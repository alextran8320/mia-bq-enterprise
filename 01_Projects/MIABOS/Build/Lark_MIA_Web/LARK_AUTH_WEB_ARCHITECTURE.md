# Backend Architecture & Auth Sync

> Tài liệu kỹ thuật về cấu trúc backend (`packages/server`) và cách account / permission được đồng bộ giữa Lark, JWT, và Postgres.
> Đối tượng đọc: developer maintain hoặc extend project. Cần đọc trước khi sửa auth/RBAC/Lark flow.
>
> Doc này mô tả **trạng thái hiện tại** của code. Nếu sửa luồng/middleware/schema, **phải update doc này trong cùng change** (theo rule trong [`CLAUDE.md`](../CLAUDE.md#keeping-docs-in-sync)).

---

## 1. Tổng quan layered architecture

```
┌──────────────────────────────────────────────────────────────┐
│                      HTTP Request                            │
│      (browser / Lark webview / curl)                         │
└──────────────────────┬───────────────────────────────────────┘
                       │
                       ▼
┌──────────────────────────────────────────────────────────────┐
│  Express app (src/index.ts)                                  │
│   1. cors            (multi-origin allowlist)                │
│   2. express.json    (body parser, 1MB limit)                │
│   3. pino-http       (structured access log, skip /health)   │
└──────────────────────┬───────────────────────────────────────┘
                       │
        ┌──────────────┼──────────────┬─────────────┬─────────────┐
        ▼              ▼              ▼             ▼             ▼
   /api/health    /api/config   /api/auth/*  /api/customers/*  /api/users/*
   (public)       (public)      (mixed)      (requireAuth +    (requireAuth +
                                              requirePermission) requirePermission)
                       │
                       ▼
┌──────────────────────────────────────────────────────────────┐
│  Middleware chain                                            │
│                                                              │
│   requireAuth                                                │
│     ├─ verify JWT (clockTolerance 5s)                        │
│     ├─ loadAuthedUser(userId): SELECT user + role +          │
│     │                          permissions (3 queries)       │
│     └─ attach req.user = { id, email, role, permissions:Set }│
│                                                              │
│   requirePermission(code)                                    │
│     └─ check req.user.permissions.has(code) → next or 403    │
└──────────────────────┬───────────────────────────────────────┘
                       │
                       ▼
┌──────────────────────────────────────────────────────────────┐
│  Route handlers (src/routes/*)                               │
│   - parse body with Zod                                      │
│   - delegate business logic to services/                     │
│   - throw HttpError(status, msg) on domain errors            │
│   - never call res.status() in services                      │
└──────────────────────┬───────────────────────────────────────┘
                       │
        ┌──────────────┴──────────────┐
        ▼                             ▼
┌──────────────────┐         ┌─────────────────────┐
│   Services       │         │   Drizzle ORM       │
│   (pure logic)   │ ──────▶ │   (db client)       │
│                  │         │                     │
│   authService    │         │   Postgres pool     │
│   larkService    │         │   (port 5433 dev)   │
│   bindingService │         └─────────────────────┘
└──────────────────┘
                       │
                       ▼
┌──────────────────────────────────────────────────────────────┐
│  errorHandler (src/middleware/errorHandler.ts)               │
│   - ZodError       → 400 + .flatten() issues                 │
│   - HttpError      → its status + message                    │
│   - anything else  → 500 + log err                           │
└──────────────────────────────────────────────────────────────┘
```

### Module boundaries

| Layer | Responsibility | Allowed to do | Forbidden |
|---|---|---|---|
| `routes/` | HTTP shape, validation, status codes | parse req, call services, set res | business logic, direct DB |
| `middleware/` | Cross-cutting (auth, errors, logging) | augment req, short-circuit response | DB queries except auth load |
| `services/` | Business logic | DB queries, external API calls, throw HttpError | direct response writing |
| `db/` | Schema + raw client | define tables, expose `db` | business decisions |
| `lib/` | Pure utilities | env parsing, hashing, logger | side effects on import (except env) |

### Why "no service writes to res"

Services throw `HttpError` instead of writing responses. This gives:
- Single error path through `errorHandler` → consistent JSON shape `{ error, details? }`
- Services testable in isolation (no Express mocks)
- Nested service calls don't accidentally double-respond

---

## 2. Account & Permission sync — full picture

### 2.1 Domain model

```
┌───────────────┐  N…1  ┌──────────┐  N…N  ┌───────────────┐
│    users      │──────▶│  roles   │◀──────│ permissions   │
│  - id (uuid)  │       │  - name  │       │  - code       │
│  - email      │       │          │       │ (customer:read│
│  - password_  │       │  admin   │       │  customer:    │
│    hash (NULL │       │  manager │       │   write/...)  │
│   if Lark-only)│      │  staff   │       │               │
│  - role_id    │       └──────────┘       └───────────────┘
│  - is_active  │             ▲
└───┬───────────┘             │
    │ 1…0..1                  │ via role_permissions (junction)
    ▼
┌───────────────────────┐
│   lark_bindings       │
│  - lark_open_id (PK)  │   ← unique per Lark app
│  - lark_union_id      │   ← unique per tenant (optional)
│  - user_id (FK,UNIQUE)│   ← 1 user bind đúng 1 Lark account
│  - tenant_key         │
│  - linked_at          │
└───────────────────────┘
```

**Source of truth:**
- `roles` + `role_permissions` định nghĩa **bộ quyền cho từng role**. Admin sửa qua DB / migration / seed re-run, **chưa có UI**.
- `users.role_id` định nghĩa **role hiện tại của user**. Sửa qua `PATCH /api/users/:id` (admin only).
- `lark_bindings` định nghĩa **mapping 1-1 giữa Lark identity và internal user**. Tạo bởi auto-provision hoặc bind thủ công.

**Permission của user X = quyền của role mà X đang giữ.** Không có per-user permission override (nếu cần sau này → thêm bảng `user_permissions`).

### 2.2 Vòng đời JWT

JWT payload **chỉ chứa `userId`** — không cache role/permission. Lý do:

- ✅ Role/permission có thể đổi giữa session (admin promote user) → mỗi request đọc DB là luôn fresh
- ✅ Deactivate user (`is_active=false`) → request kế tiếp 403 ngay
- ❌ Tradeoff: 3 query DB cho mỗi authenticated request (1 user+role join, 1 permissions, không count `bindings`)

Khi cần optimize:
- Add LRU cache 30s trong `loadAuthedUser` (key = userId, invalidate on PATCH)
- Hoặc embed role+permissions vào JWT + chấp nhận stale tới khi token expire

Token sign:
```
src/services/authService.ts:14
signToken({ userId }) → JWT(env.JWT_SECRET, { expiresIn: env.JWT_EXPIRES_IN })
```

Token verify:
```
src/services/authService.ts:17
verifyToken(token) → { userId } | throw HttpError(401)
   - clockTolerance: 5s (chống clock drift)
```

Loading user + permissions:
```
src/services/authService.ts:30   loadAuthedUser(userId)
   1. SELECT user JOIN roles (1 query)
   2. SELECT permissions JOIN role_permissions JOIN roles (1 query)
   3. Trả AuthedUser { id, email, role, permissions: Set<string>, isActive }
   4. Throw 401 nếu không tìm thấy, 403 nếu inactive
```

---

## 3. Luồng đồng bộ Account: Lark ↔ DB

### 3.1 Sơ đồ tổng quan các luồng

```
                        ┌─────────────────┐
                        │  User opens app │
                        └────────┬────────┘
                                 │
              ┌──────────────────┴──────────────────┐
              │                                     │
        ┌─────▼─────┐                       ┌──────▼──────┐
        │  In Lark  │                       │  In browser │
        │  Desktop  │                       │  (no tt/UA) │
        └─────┬─────┘                       └──────┬──────┘
              │                                    │
              │ FE: LandingRedirect detects Lark   │ → /login
              │ → /lark/entry → loadSdk →          │
              │   requestAccess → code             │ User nhập email/pwd
              │                                    │
              ▼                                    ▼
   POST /api/auth/lark/exchange       POST /api/auth/login
              │                                    │
              ▼                                    ▼
   ┌──────────────────────────┐       ┌──────────────────────┐
   │ larkService              │       │ bcrypt.compare       │
   │ getAppAccessToken (cache)│       │ password vs hash     │
   │ → exchange code →        │       │                      │
   │ user_access_token        │       │ NULL hash → reject   │
   │ → user_info →            │       │ ("dùng Lark đăng    │
   │ LarkProfile              │       │ nhập")               │
   └─────────┬────────────────┘       └─────────┬────────────┘
             │                                  │
             ▼                                  │
   ┌──────────────────────────┐                 │
   │ findUserByLarkOpenId     │                 │
   └─────────┬────────────────┘                 │
             │                                  │
        ┌────┴─────┐                            │
        │          │                            │
   ┌────▼───┐  ┌───▼────────────────┐           │
   │ Found  │  │ Not found          │           │
   │ binding│  │ → autoProvision    │           │
   └────┬───┘  │   FromLark         │           │
        │      └────────┬───────────┘           │
        │               │                        │
        │       ┌───────┴────────┐              │
        │       │                │              │
        │  ┌────▼─────┐    ┌─────▼─────┐        │
        │  │ Provisioned│  │ Returned   │        │
        │  │ → user+    │  │ null       │        │
        │  │  binding   │  │ (auto off  │        │
        │  └────┬───────┘  │  or no     │        │
        │       │          │  email)    │        │
        │       │          └─────┬──────┘        │
        │       │                │               │
        │       │                ▼               │
        │       │     Response { needsBinding,   │
        │       │       larkProfile }            │
        │       │                │               │
        │       │      FE stash → /login         │
        │       │       → user nhập internal pwd │
        │       │       → /bind → POST /api/     │
        │       │         auth/bind { profile }  │
        │       │                │               │
        │       │       ┌────────▼─────────┐     │
        │       │       │ createBinding     │     │
        │       │       └────────┬──────────┘     │
        │       │                │               │
        ▼       ▼                ▼               ▼
   ┌────────────────────────────────────────────────────┐
   │  signToken({ userId })                             │
   │  loadAuthedUser → trả token + user                 │
   └────────────────────┬───────────────────────────────┘
                        │
                        ▼
                 FE: lưu JWT
                  → /dashboard
```

### 3.2 Chi tiết từng case

> **Lark client detection** — `isInLark()` ưu tiên theo thứ tự (early return khi match):
> 1. `window.tt` hoặc `window.h5sdk` đã có (SDK đã load) → đúng Lark
> 2. UA chứa `Lark` / `Feishu` → đúng Lark Desktop hoặc Mobile
> 3. App đang ở trong iframe (`window.self !== window.top` hoặc cross-origin parent throw) → coi là Lark Web (larksuite.com embed app vào iframe)
> 4. Không match → browser thường, route về `/login`
>
> `loadLarkSdk()` có **timeout 8s** — nếu detection lầm (vd app embed trong iframe khác Lark), sau 8s sẽ reject + LarkEntryPage hiện nút "Đăng nhập bằng email" để fallback.

#### Case A — Lark, chưa bind, auto-provision bật (mặc định hiện tại)

**Trigger:** `LARK_AUTO_PROVISION=true` + Lark profile có `email`.

```
1. FE  /lark/entry       → loadLarkSdk → requestLarkCode → code
2. FE  POST /api/auth/lark/exchange { code }
3. BE  larkService.exchangeCodeForProfile(code):
        a. getAppAccessToken (cached, TTL = expire - 60s)
        b. POST /open-apis/authen/v1/access_token (with app_token)
           → user_access_token
        c. GET /open-apis/authen/v1/user_info (with user_access_token)
           → LarkProfile { openId, unionId, tenantKey, email, name }
4. BE  bindingService.findUserByLarkOpenId(profile.openId) → null
5. BE  bindingService.autoProvisionFromLark(profile):
        - kiểm tra LARK_AUTO_PROVISION=true ✓ và profile.email tồn tại ✓
        - email ∈ env.ADMIN_EMAILS (lowercase compare)? → role = admin
        - else                                          → role = staff
        - INSERT users { email, full_name=profile.name, role_id, password_hash=NULL }
          + onConflictDoNothing(email) (handle race)
        - INSERT lark_bindings { lark_open_id, union_id, tenant_key, user_id }
        - return user.id
6. BE  authService.loadAuthedUser(user.id) + signToken
7. BE  Response { token, user }
8. FE  lưu vào authStore (persist localStorage), navigate /dashboard
```

**File reference:**
- [`packages/server/src/services/larkService.ts:46`](../packages/server/src/services/larkService.ts#L46) — `exchangeCodeForProfile`
- [`packages/server/src/services/bindingService.ts:47`](../packages/server/src/services/bindingService.ts#L47) — `autoProvisionFromLark`
- [`packages/server/src/routes/auth.ts:55`](../packages/server/src/routes/auth.ts#L55) — `/lark/exchange` handler

#### Case B — Lark, đã bind (mọi lần mở sau lần đầu)

```
1-3. Như Case A
4. BE findUserByLarkOpenId(openId) → { userId, linkedAt }
5. BE loadAuthedUser(userId) + signToken
6. Response { token, user }
```

Auto-provision **không gọi** trong case này. User bị deactivate sau khi bind?
→ `loadAuthedUser` throw 403 → FE clear store → LandingRedirect → loop /lark/entry.
→ Workaround production: thêm trang riêng "Account của bạn đã bị tạm khoá, liên hệ admin".

#### Case A' — Lark, chưa bind, auto-provision tắt HOẶC profile thiếu email

```
1-4. Như Case A
5. autoProvisionFromLark return null (do tắt hoặc thiếu email)
6. BE response { needsBinding: true, larkProfile }
7. FE sessionStorage.pendingLarkProfile = profile (cross-page handoff)
8. FE navigate /login (state.from = '/bind')
9. User nhập email/password internal → /api/auth/login → JWT
10. FE detect sessionStorage có pendingLarkProfile → navigate /bind
11. BE POST /api/auth/bind { larkProfile } (with new JWT)
12. createBinding:
     - check user đã bind chưa → 409 nếu có
     - check open_id đã bind ai chưa → 409 nếu có
     - INSERT lark_bindings
13. Response { user, linkedAt }
```

**Kết quả:** user nội bộ + Lark identity được khớp 1-1. Lần sau Case B chạy.

#### Case C — Browser ngoài Lark

```
1. FE LandingRedirect: isInLark()=false, no token → /login
2. POST /api/auth/login { email, password }
3. BE bcrypt.compare(password, user.password_hash)
   → password_hash NULL? throw 401 với msg "Tài khoản này chỉ đăng nhập bằng Lark"
4. Response { token, user }
5. FE → /dashboard
```

**Khoá đặc biệt cho user Lark-only:** sau khi auto-provision, `password_hash = NULL`. Login bằng email/password sẽ luôn fail. User chỉ vào được qua Lark Desktop.

---

## 4. Đồng bộ Permission

### 4.1 Server: luôn fresh từ DB

Mỗi request đi qua `requireAuth` đều load lại user + permissions từ DB. Không có cache. Tradeoff đã giải thích ở §2.2.

```
src/middleware/requireAuth.ts
   header → token → verifyToken → loadAuthedUser → req.user

src/middleware/requirePermission.ts
   req.user.permissions.has('customer:write') ? next() : 403
```

→ Khi admin đổi role / deactivate qua `PATCH /api/users/:id`, **request kế tiếp** của user đó đã thấy state mới. Không cần force logout.

### 4.2 Client: cache trong Zustand, refresh on app mount

FE giữ `user` (kèm `permissions: string[]`) trong Zustand store, persist localStorage. UI dùng để ẩn/hiện menu/buttons (`<RequirePermission>`, `usePermissions().has()`).

Nguồn fresh:
- `App.tsx` mount → `authApi.me()` → fetch DB state → `setUser`
- Sau mỗi navigation page-load? Không. Chỉ mount component App lần đầu.

→ **Stale window**: Khi admin đổi role X từ `staff` → `manager`, X vẫn thấy menu `staff` cho đến khi:
- X reload tab → App.tsx mount lại → /me refetch
- Hoặc X navigate sang trang gọi API mutating → 401/403 nếu role mới không đủ → axios interceptor clear store → /login → re-fetch

**FE chỉ là UX hint, BE luôn enforce** — kể cả X cố click "Delete customer" với UI cũ, BE sẽ trả 403.

### 4.3 Sequence diagram đầy đủ — đổi role + sync xuống user

```
Admin (browser)        BE                  DB           User X (browser)
     │                  │                   │                  │
     │ PATCH /users/X   │                   │                  │
     │ {role:'manager'} │                   │                  │
     │─────────────────▶│ check guardrails  │                  │
     │                  │ (not self,        │                  │
     │                  │  not last admin)  │                  │
     │                  │──────UPDATE──────▶│                  │
     │                  │◀──────row─────────│                  │
     │◀───── 200 ───────│                   │                  │
     │                  │                                      │
     │                  │  GET /customers (X's request)        │
     │                  │◀─────────────────────────────────────│
     │                  │ requireAuth                          │
     │                  │  loadAuthedUser(X.id)                │
     │                  │──── SELECT users JOIN roles ────────▶│
     │                  │◀──── role='manager' (NEW) ──────────│
     │                  │  → req.user.permissions has new set  │
     │                  │ requirePermission('customer:read')   │
     │                  │  ✓ pass                              │
     │                  │  ──────── 200 customers ────────────▶│
     │                                                         │
     │                  │  (Sometime later) GET /api/auth/me   │
     │                  │◀─────────────────────────────────────│
     │                  │ same load → user with role='manager' │
     │                  │ ──────── 200 user ──────────────────▶│
     │                                                         │
     │                                                  FE: setUser
     │                                                  → menu Customers form
     │                                                    create xuất hiện
```

---

## 5. Bảo mật & các điểm cần biết

| Item | Hiện trạng | Note |
|---|---|---|
| JWT in localStorage | Có (zustand persist) | XSS có thể đọc được. Cân nhắc HttpOnly cookie nếu strict. |
| CSRF | Không lo (Bearer header, không cookie) | Đổi sang cookie thì phải add CSRF token |
| Refresh token | Không có | JWT 7 ngày, hết là phải re-login. Add nếu cần lifetime dài. |
| Rate limit | Không có | Add `express-rate-limit` cho `/api/auth/login` để chống brute force |
| Password policy | Chỉ check min(1) | Add Zod regex cho production (length, complexity) |
| Lark profile validation | Tin tưởng Lark trả đúng | Backend không verify Lark response signature (là chấp nhận được vì gọi qua HTTPS với app_token) |
| `tenant_key` filtering | Lưu nhưng chưa kiểm | Nếu app đa-tenant → chỉ accept binding nếu `tenant_key` ∈ whitelist |
| Auto-provision spam | Email ∈ tenant Lark là tự lên user | An toàn hơn: bật `LARK_AUTO_PROVISION=false` + bind thủ công cho production strict |

---

## 6. Khi nào sửa cái gì

| Yêu cầu | File chính cần đụng | Test sau khi sửa |
|---|---|---|
| Thêm permission code mới (vd `report:export`) | `db/seed.ts` (mapping role) → re-seed; `routes/<route>.ts` add `requirePermission(...)` | curl với 3 role |
| Thêm role mới (vd `viewer`) | `db/seed.ts`, [`routes/users.ts:36`](../packages/server/src/routes/users.ts#L36) (z.enum), FE [`UsersPage.tsx`](../packages/web/src/pages/UsersPage.tsx) ROLES const | Tạo user role mới qua /users, login, kiểm permissions |
| Đổi default role auto-provision | [`bindingService.ts:51`](../packages/server/src/services/bindingService.ts#L51) | Lark login với email không trong ADMIN_EMAILS |
| Add cache permissions | `services/authService.ts` `loadAuthedUser` thêm LRU + invalidate trong `routes/users.ts` PATCH | curl bench, đổi role rồi check stale |
| Multi-tenant Lark | `bindingService.ts` filter tenant_key, `env.ts` add `ALLOWED_TENANT_KEYS` | Lark Console publish 2 workspace |
| Refresh token | `authService.ts` add `signRefreshToken`/`verifyRefreshToken`, route `/api/auth/refresh`, `lark_bindings` thêm `refresh_token` cột | Force expire JWT, gọi /refresh, re-fetch |

---

## 7. Liên kết

- Sơ đồ kiến trúc cấp cao: [`PLAN_LARK_MIA_WEB.md §3`](../PLAN_LARK_MIA_WEB.md#3-kiến-trúc-tổng-thể)
- DB schema: [`PLAN_LARK_MIA_WEB.md §4`](../PLAN_LARK_MIA_WEB.md#4-database-schema) + [`packages/server/src/db/schema.ts`](../packages/server/src/db/schema.ts)
- Auth/permission flow tổng quan (đối tượng PM/business): [`PLAN_LARK_MIA_WEB.md §6,7`](../PLAN_LARK_MIA_WEB.md#6-luồng-login-chi-tiết)
- Quy ước codebase + gotchas: [`CLAUDE.md`](../CLAUDE.md)
- Setup + onboarding: [`README.md`](../README.md)
