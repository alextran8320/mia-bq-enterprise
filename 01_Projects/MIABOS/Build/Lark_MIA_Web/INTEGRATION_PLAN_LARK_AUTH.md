# Plan tích hợp Lark Auth + RBAC vào `Lark_MIA_Web` (FE + BE cùng source)

> **Mục tiêu:** chuyển `Lark_MIA_Web` từ FE-only POC (mock data) thành **full-stack workspace** chạy cả Backend (Express + Drizzle + Postgres + Lark integration) và Frontend (React + Vite) trong cùng một repo, áp dụng nguyên kiến trúc đã mô tả ở [LARK_AUTH_WEB_ARCHITECTURE.md](LARK_AUTH_WEB_ARCHITECTURE.md).
>
> **Đối tượng đọc:** Dev chuẩn bị implement, Tech Lead review, PM theo dõi tiến độ.
>
> **Trạng thái:** _Draft — chờ confirm trước khi code._

---

## 0. TL;DR

- Restructure thư mục thành **npm workspaces monorepo**: `packages/web/` (FE hiện tại) + `packages/server/` (BE mới).
- BE port `3000`, FE port `5180`, **DB Postgres serverless trên Neon** (region Singapore).
- 1 lệnh `npm run dev` chạy song song cả 2 (`concurrently`).
- 4 case auth (Lark first-time / bound / needs-bind / browser email-pwd) hoạt động end-to-end.
- Permission model: `roles + role_permissions` junction trong DB, FE bind qua `<RequirePermission code="...">` và `usePermissions()`.
- Phase đầu replace mock cho 5 page (Users, Roles, PermissionProfiles, Profile + CRM Customers/Leads). Module khác migrate dần ở phase sau.

### Decisions đã chốt (Boss confirm 2026-04-26)

| # | Quyết định | Giá trị |
|---|---|---|
| 12.1 | Dual-mode email/pwd + Lark | (a) — giữ fallback email/password |
| 12.2 | Auto-provision | ON — `LARK_AUTO_PROVISION=true` |
| 12.3 | Phạm vi P7 (replace mock) | Mở rộng ra cả CRM (Customers + Leads) ngoài 4 page admin |
| 12.4 | DB hosting dev | **Neon** (Postgres serverless, free tier, region `ap-southeast-1` Singapore) |
| 12.5 | Lark App credentials | Boss đã có App ID + Secret, sẽ tự nhập vào `.env` sau |

---

## 1. Hiện trạng cần thay đổi

| Aspect | Hiện tại | Sau tích hợp |
|---|---|---|
| Repo shape | Single FE package, `package.json` ở root | npm workspaces monorepo: `packages/web` + `packages/server` |
| Dependencies FE | Chỉ có react, react-router, lucide, apexcharts, xlsx | Thêm `axios`, `zustand` |
| Dependencies BE | — | `express`, `drizzle-orm`, `pg`, `bcrypt`, `jsonwebtoken`, `zod`, `pino`, `pino-http`, `cors`, `dotenv`, `tsx` (dev), Lark HTTP qua `fetch` |
| Database | — | Postgres serverless trên **Neon** (region `ap-southeast-1`) |
| Routes FE | 100% public, redirect `/` → `/analytics/executive` | Bọc protected qua `<RequireAuth>`; public: `/login`, `/lark/entry`, `/bind` |
| Data | Mock từ `src/mocks/` | Auth + Users + Roles từ API thật. Mock còn lại giữ tạm. |
| Env | Không có `.env` | `.env` ở `packages/server/` (DB, JWT, Lark), `.env` ở `packages/web/` (`VITE_*`) |

---

## 2. Cấu trúc thư mục mục tiêu

```
Lark_MIA_Web/                            ← workspace root (đã rename từ Frontend_App)
├── package.json                          ← root, có "workspaces": ["packages/*"], scripts run-all
├── tsconfig.base.json                    ← shared TS config (mới)
├── LARK_AUTH_WEB_ARCHITECTURE.md         ← doc kiến trúc (đã có)
├── INTEGRATION_PLAN_LARK_AUTH.md         ← file này
│
├── packages/
│   ├── web/                              ← FE hiện tại (move toàn bộ vào đây)
│   │   ├── package.json                  ← scripts dev/build, deps FE
│   │   ├── vite.config.ts                ← thêm proxy /api → :3000
│   │   ├── index.html
│   │   ├── tsconfig.json
│   │   ├── public/
│   │   ├── .env.development              ← VITE_API_BASE_URL, VITE_LARK_APP_ID
│   │   └── src/
│   │       ├── main.tsx
│   │       ├── styles/
│   │       ├── mocks/                    ← giữ nguyên cho module chưa có API
│   │       ├── shared/
│   │       │   ├── ui/                   ← giữ nguyên
│   │       │   └── auth/                 ← MỚI
│   │       │       ├── apiClient.ts
│   │       │       ├── authStore.ts
│   │       │       ├── authApi.ts
│   │       │       ├── larkSdk.ts
│   │       │       ├── permission.tsx
│   │       │       └── types.ts
│   │       ├── modules/
│   │       │   ├── auth/                 ← MỚI
│   │       │   │   └── pages/
│   │       │   │       ├── LandingRedirect.tsx
│   │       │   │       ├── LoginPage.tsx
│   │       │   │       ├── LarkEntryPage.tsx
│   │       │   │       └── BindPage.tsx
│   │       │   ├── crm-workspace/        ← giữ nguyên
│   │       │   ├── ai-workspace/         ← giữ nguyên
│   │       │   ├── catalog-and-commerce/ ← giữ nguyên
│   │       │   ├── insights-performance/ ← giữ nguyên
│   │       │   ├── knowledge-center/     ← giữ nguyên
│   │       │   ├── operations-and-governance/  ← UsersAndRolesPage, UserDetailPage sẽ replace mock
│   │       │   ├── orders-and-service/   ← giữ nguyên
│   │       │   └── settings/             ← ProfilePage, RolesPage, PermissionProfilesPage replace mock
│   │       └── app/
│   │           ├── AuthBootstrap.tsx     ← MỚI
│   │           ├── router.tsx            ← rewrite
│   │           └── layouts/              ← TopBar.tsx update (user thật, logout)
│   │
│   └── server/                           ← BE MỚI
│       ├── package.json
│       ├── tsconfig.json
│       ├── .env                          ← DB_URL, JWT_SECRET, LARK_APP_ID, LARK_APP_SECRET, ADMIN_EMAILS, LARK_AUTO_PROVISION
│       ├── drizzle.config.ts
│       └── src/
│           ├── index.ts                  ← Express app entry
│           ├── lib/
│           │   ├── env.ts                ← parse + validate env qua zod
│           │   ├── logger.ts             ← pino
│           │   └── httpError.ts
│           ├── db/
│           │   ├── client.ts             ← Drizzle + pg Pool
│           │   ├── schema.ts             ← users, roles, permissions, role_permissions, lark_bindings
│           │   ├── migrations/
│           │   └── seed.ts               ← roles + permission codes mặc định
│           ├── middleware/
│           │   ├── requireAuth.ts
│           │   ├── requirePermission.ts
│           │   └── errorHandler.ts
│           ├── services/
│           │   ├── authService.ts        ← signToken, verifyToken, loadAuthedUser
│           │   ├── larkService.ts        ← getAppAccessToken (cache), exchangeCodeForProfile
│           │   ├── bindingService.ts     ← findUserByLarkOpenId, autoProvisionFromLark, createBinding
│           │   └── userService.ts        ← list/get/update users (admin)
│           └── routes/
│               ├── health.ts
│               ├── config.ts             ← public — trả LARK_APP_ID cho FE
│               ├── auth.ts               ← /login, /lark/exchange, /bind, /me, /logout
│               └── users.ts              ← CRUD admin (requirePermission)
```

---

## 3. Tech stack & dependency list

### 3.1 Root (`Lark_MIA_Web/package.json`)
```json
{
  "name": "miabos-bq",
  "private": true,
  "workspaces": ["packages/*"],
  "scripts": {
    "dev": "concurrently -n server,web -c blue,magenta \"npm run dev -w packages/server\" \"npm run dev -w packages/web\"",
    "dev:db": "docker compose up -d",
    "build": "npm run build -w packages/server && npm run build -w packages/web",
    "db:push": "npm run db:push -w packages/server",
    "db:seed": "npm run db:seed -w packages/server"
  },
  "devDependencies": {
    "concurrently": "^9.0.0",
    "typescript": "^5.8.0"
  }
}
```

### 3.2 `packages/server/package.json`
```json
{
  "name": "@miabos/server",
  "private": true,
  "type": "module",
  "scripts": {
    "dev": "tsx watch src/index.ts",
    "build": "tsc -p tsconfig.json",
    "start": "node dist/index.js",
    "db:push": "drizzle-kit push",
    "db:seed": "tsx src/db/seed.ts"
  },
  "dependencies": {
    "express": "^4.21.0",
    "cors": "^2.8.5",
    "pino": "^9.5.0",
    "pino-http": "^10.3.0",
    "dotenv": "^16.4.5",
    "drizzle-orm": "^0.36.0",
    "pg": "^8.13.0",
    "bcrypt": "^5.1.1",
    "jsonwebtoken": "^9.0.2",
    "zod": "^3.23.8"
  },
  "devDependencies": {
    "@types/express": "^4.17.21",
    "@types/cors": "^2.8.17",
    "@types/pg": "^8.11.10",
    "@types/bcrypt": "^5.0.2",
    "@types/jsonwebtoken": "^9.0.7",
    "@types/node": "^22.0.0",
    "tsx": "^4.19.0",
    "drizzle-kit": "^0.30.0",
    "typescript": "^5.8.0"
  }
}
```

### 3.3 `packages/web/package.json` (cập nhật từ file hiện tại)
- Giữ nguyên deps cũ.
- Thêm `axios`, `zustand`.

---

## 4. Database schema (Drizzle — `packages/server/src/db/schema.ts`)

```ts
// Skeleton — types và default đã match doc kiến trúc §2.1
roles {
  id          uuid pk default uuid_v4
  name        text unique not null   // 'admin' | 'manager' | 'staff' | ...
  description text
}

permissions {
  id    uuid pk
  code  text unique not null         // 'customer:read', 'customer:write', 'user:write', ...
  label text
}

role_permissions {                    // junction
  role_id       uuid fk roles.id (cascade)
  permission_id uuid fk permissions.id (cascade)
  pk (role_id, permission_id)
}

users {
  id            uuid pk
  email         text unique not null
  full_name     text
  password_hash text                  // NULL = Lark-only
  role_id       uuid fk roles.id
  is_active     boolean default true
  created_at    timestamptz default now()
  updated_at    timestamptz default now()
}

lark_bindings {
  lark_open_id  text pk               // unique theo Lark app
  lark_union_id text                  // optional, unique theo tenant
  user_id       uuid unique fk users.id (cascade)
  tenant_key    text
  linked_at     timestamptz default now()
}
```

### Seed mặc định (`packages/server/src/db/seed.ts`)
- Roles: `admin`, `manager`, `staff`.
- Permissions tối thiểu để cover UI hiện tại:
  - `customer:read`, `customer:write`, `customer:delete`
  - `lead:read`, `lead:write`
  - `order:read`, `order:write`
  - `product:read`, `product:write`
  - `pricing:read`, `pricing:write`
  - `promotion:read`, `promotion:write`
  - `inbox:read`, `inbox:write`
  - `escalation:read`, `escalation:write`
  - `integration:read`, `integration:write`
  - `knowledge:read`, `knowledge:write`
  - `analytics:read`
  - `user:read`, `user:write`
  - `role:read`, `role:write`
  - `setting:read`, `setting:write`
- Mapping mặc định:
  - `admin` ⇒ tất cả
  - `manager` ⇒ tất cả `*:read` + `customer:write`, `order:write`, `escalation:write`, `inbox:write`, `pricing:write`, `promotion:write`, `analytics:read`
  - `staff` ⇒ `customer:read|write`, `order:read|write`, `lead:read|write`, `inbox:read|write`, `product:read`, `pricing:read`, `analytics:read`

> **Quy tắc:** mỗi lần thêm permission code mới ⇒ cập nhật seed + migration ⇒ rerun `db:seed` (idempotent: dùng `ON CONFLICT DO NOTHING`).

---

## 5. Backend — endpoints contract

| Method | Path | Auth | Body / Query | Response |
|---|---|---|---|---|
| GET | `/api/health` | public | — | `{ ok: true }` |
| GET | `/api/config` | public | — | `{ larkAppId, autoProvision }` (FE đọc lúc init) |
| POST | `/api/auth/login` | public | `{ email, password }` | `{ token, user }` hoặc 401 |
| POST | `/api/auth/lark/exchange` | public | `{ code }` | `{ token, user }` HOẶC `{ needsBinding: true, larkProfile }` |
| POST | `/api/auth/bind` | requireAuth | `{ larkProfile }` | `{ user, linkedAt }` |
| GET | `/api/auth/me` | requireAuth | — | `{ user }` (fresh từ DB) |
| POST | `/api/auth/logout` | requireAuth | — | `{ ok: true }` (no-op vì JWT stateless — chỉ để FE consistent) |
| GET | `/api/users` | `user:read` | `?q=&role=&active=` | `{ items, total }` |
| GET | `/api/users/:id` | `user:read` | — | `{ user }` |
| PATCH | `/api/users/:id` | `user:write` | `{ role?, isActive?, fullName? }` | `{ user }` (guardrails: không tự đổi role mình; không demote last admin) |
| GET | `/api/roles` | `role:read` | — | `{ roles, permissions }` |

> **Error shape thống nhất:** `{ error: string, details?: any }` — bắn từ `errorHandler` middleware.

---

## 6. Frontend — chi tiết files mới

### 6.1 `shared/auth/types.ts`
```ts
export type Role = 'admin' | 'manager' | 'staff' | string;
export type AuthedUser = {
  id: string;
  email: string;
  fullName: string | null;
  role: Role;
  permissions: string[];
  isActive: boolean;
};
export type LarkProfile = {
  openId: string;
  unionId?: string;
  tenantKey?: string;
  email?: string;
  name?: string;
  avatarUrl?: string;
};
export type LoginResponse = { token: string; user: AuthedUser };
export type LarkExchangeResponse =
  | LoginResponse
  | { needsBinding: true; larkProfile: LarkProfile };
```

### 6.2 `shared/auth/apiClient.ts`
- `axios.create({ baseURL: '/api' })`.
- Request interceptor: gắn `Authorization: Bearer ${token}` từ store.
- Response interceptor:
  - 401 → `useAuthStore.getState().clear()` + `window.location.assign('/login')` (đồng bộ, tránh race nhiều request fail cùng lúc).
  - 403 → throw nguyên (UI tự xử lý / toast).
  - Mọi error khác throw nguyên.

### 6.3 `shared/auth/authStore.ts`
- Zustand store + `persist` middleware → `localStorage` key `miabos_auth`.
- Shape: `{ token: string | null, user: AuthedUser | null, hydrated: boolean, setToken, setUser, clear }`.

### 6.4 `shared/auth/authApi.ts`
Wrap endpoint mục §5: `login(email, pwd)`, `larkExchange(code)`, `bind(profile)`, `me()`, `logout()`, `getConfig()`.

### 6.5 `shared/auth/larkSdk.ts`
- `isInLark()` priority: `window.tt || window.h5sdk` → `/Lark|Feishu/i.test(navigator.userAgent)` → iframe heuristic (`window.self !== window.top` hoặc cross-origin parent throw).
- `loadLarkSdk()`:
  - Inject `<script src="https://lf1-cdn-tos.bytegoofy.com/goofy/lark/op/h5-js-sdk-{ver}.js">` 1 lần.
  - Promise reject sau 8s timeout.
- `requestLarkCode(appId)` → `tt.requestAccess({ appID, scopeList: [], state })` → `code`.

### 6.6 `shared/auth/permission.tsx`
- `usePermissions()` hook trả `{ has, hasAny, hasAll, isAdmin }`.
- `<RequireAuth>{children}</RequireAuth>` — dùng layer outlet/element trong router.
- `<RequirePermission code | codes>{children}</RequirePermission>` — UI gating; nếu route-level fail ⇒ redirect `/`.

### 6.7 4 page mới (`modules/auth/pages/`)

#### `LandingRedirect.tsx`
```
on mount:
  if token && hydrated:
    return <Navigate to="/analytics/executive" replace />
  if isInLark():
    return <Navigate to="/lark/entry" replace />
  return <Navigate to="/login" replace />
```

#### `LoginPage.tsx`
- Form email/password (nếu BQ enforce Lark-only ⇒ ẩn form, chỉ giữ nút "Đăng nhập bằng Lark").
- Sau success: kiểm `sessionStorage.pendingLarkProfile` ⇒ `/bind`, else `/`.
- Hiển thị message rõ khi BE trả "Tài khoản này chỉ đăng nhập bằng Lark" (password_hash NULL).

#### `LarkEntryPage.tsx`
1. `useEffect`: `loadLarkSdk()` → catch timeout 8s ⇒ render fallback "Đăng nhập bằng email" link `/login`.
2. SDK ready ⇒ `requestLarkCode()` → `authApi.larkExchange(code)`.
3. Branch:
   - Có `token` ⇒ `setToken/setUser` ⇒ `/`.
   - `needsBinding` ⇒ `sessionStorage.pendingLarkProfile = profile` ⇒ `/login`.
4. Show splash + spinner trong khi chờ.

#### `BindPage.tsx`
- Đọc `sessionStorage.pendingLarkProfile`. Không có ⇒ redirect `/login`.
- Hiển thị info Lark + nút "Liên kết tài khoản".
- Click ⇒ `authApi.bind(profile)` → set token mới (BE trả token mới sau khi bind) → clear sessionStorage → `/`.
- 409 `user already bound` ⇒ message "Tài khoản đã liên kết Lark khác" + nút "Đăng xuất".

### 6.8 `app/AuthBootstrap.tsx`
- Bọc `<RouterProvider>` trong `main.tsx`.
- Khi mount: nếu store có `token` ⇒ `authApi.me()` → `setUser`. Trong khi pending ⇒ render splash. Lỗi 401 ⇒ `clear()`. Cuối ⇒ `setHydrated(true)`.
- Mục đích: đảm bảo permission-data luôn fresh ngay sau reload (khớp doc §4.2).

### 6.9 `app/router.tsx` (rewrite)
```
/                  → <LandingRedirect/>           (public)
/login             → <LoginPage/>                 (public, no AppShell)
/lark/entry        → <LarkEntryPage/>             (public, no AppShell)
/bind              → <RequireAuth><BindPage/>     (auth, no AppShell)

/crm/...           → <RequireAuth><AppShell/>     + RequirePermission per route
/orders/...        → 〃
/catalog/...       → 〃
/operations/...    → 〃 (users-roles cần user:read, scope-rules cần setting:read, ...)
/inbox             → 〃 (inbox:read)
/ai/...            → 〃
/sales-advisor     → 〃
/analytics/...     → 〃 (analytics:read)
/settings/...      → 〃 (profile public-trong-auth, roles cần role:read, ...)
/knowledge/...     → 〃 (knowledge:read)
```

### 6.10 `app/layouts/TopBar.tsx` — update
- Avatar/name lấy từ `useAuthStore(s => s.user)`.
- Menu tài khoản thêm "Đăng xuất" → `authApi.logout()` → `clear()` → `navigate('/login')`.
- (Không xóa logic store/notification mock — chỉ thay user data source.)

### 6.11 Pages chuyển từ mock sang API (Phase 7 — không bắt buộc trong PR đầu)
- [UsersAndRolesPage.tsx](src/modules/operations-and-governance/pages/UsersAndRolesPage.tsx) ⇒ `GET /api/users`.
- [UserDetailPage.tsx](src/modules/operations-and-governance/pages/UserDetailPage.tsx) ⇒ `GET /api/users/:id` + `PATCH`.
- [RolesPage.tsx](src/modules/settings/pages/RolesPage.tsx) ⇒ `GET /api/roles`.
- [PermissionProfilesPage.tsx](src/modules/settings/pages/PermissionProfilesPage.tsx) ⇒ `GET /api/roles` (kèm permissions).
- [ProfilePage.tsx](src/modules/settings/pages/ProfilePage.tsx) ⇒ hiển thị `useAuthStore().user` + binding status (call `/api/auth/me` để kiểm).

---

## 7. Vite proxy & env

### 7.1 `packages/web/vite.config.ts`
```ts
export default defineConfig({
  plugins: [react()],
  resolve: { alias: { '@': path.resolve(__dirname, './src') } },
  server: {
    port: 5180,
    strictPort: true,
    proxy: {
      '/api': { target: 'http://localhost:3000', changeOrigin: true }
    }
  },
  preview: { port: 5180, strictPort: true }
});
```

### 7.2 `packages/web/.env.development`
```
VITE_API_BASE_URL=/api
VITE_LARK_APP_ID=cli_xxx     # lấy từ Lark Console
VITE_LARK_SDK_VERSION=1.5.45
```

### 7.3 `packages/server/.env`
```
NODE_ENV=development
PORT=3000
# Neon — copy từ dashboard, dùng connection có "?sslmode=require"
# Format: postgres://USER:PASSWORD@ep-xxx-pooler.ap-southeast-1.aws.neon.tech/miabos_bq?sslmode=require
DATABASE_URL=
JWT_SECRET=change-me-32-chars-min
JWT_EXPIRES_IN=7d
CORS_ORIGINS=http://localhost:5180
LARK_APP_ID=cli_xxx
LARK_APP_SECRET=xxx
LARK_AUTO_PROVISION=true
ADMIN_EMAILS=owner@bq.vn,admin@bq.vn
```

> **Drizzle + Neon note:** dùng package `@neondatabase/serverless` cho HTTP driver (không cần TCP pool, friendly với serverless deploy sau này). Khi `NODE_ENV=development` chạy với Express + driver `pg` cũng OK — schema migration giống nhau.

---

## 8. Neon setup (one-time, ~5 phút)

1. Sign up tại https://console.neon.tech (GitHub SSO).
2. **Create project**:
   - Project name: `miabos-bq`
   - Postgres version: 16
   - Region: `Asia Pacific (Singapore)` — gần VN nhất
   - Database name: `miabos_bq`
3. Sau khi tạo xong, dashboard hiện connection string. **Copy connection có `-pooler` trong host** (pooled connection — friendly với serverless future):
   ```
   postgres://miabos_owner:xxx@ep-cool-name-12345-pooler.ap-southeast-1.aws.neon.tech/miabos_bq?sslmode=require
   ```
4. Paste vào `packages/server/.env` ở key `DATABASE_URL`.
5. (Optional) Tạo branch `dev` từ `main` để dev không touch DB sản xuất sau này:
   - Neon dashboard → Branches → `+ New branch` → name `dev`, parent `main`.
   - Lấy connection string của branch `dev` cho `.env` local.
6. Run `npm run db:push && npm run db:seed` — Drizzle apply schema + seed lên Neon trực tiếp.

> **Auto-suspend:** mặc định Neon suspend compute sau 5 phút idle. Lần đầu request sau idle ~500ms-1s cold start. Tắt được trong Settings → Compute → "Suspend compute after inactivity" → Off (tốn compute hours hơn). Free tier 191h compute/month — đủ cho POC.

---

## 9. Phase plan & milestones

| Phase | Scope | Acceptance |
|---|---|---|
| **P0 — Workspace bootstrap** | Tạo monorepo skeleton, move FE vào `packages/web`, init `packages/server` rỗng, root `concurrently`, docker-compose Postgres | `npm run dev` chạy FE 5180 + BE 3000 stub `GET /api/health` |
| **P1 — DB + schema + seed** | Drizzle schema + migration + seed roles/permissions | `npm run db:push && npm run db:seed` ⇒ DB có 3 roles, ~30 permissions |
| **P2 — Auth core BE** | `authService`, `requireAuth`, `requirePermission`, `errorHandler`, `/login`, `/me`, `/logout`, `/config` | curl đăng nhập với user seed, gọi `/me` thành công, gọi route guarded fail 401 đúng |
| **P3 — Lark integration BE** | `larkService`, `bindingService`, `/lark/exchange`, `/bind`, auto-provision | curl giả `code` (mock Lark response trong dev) ⇒ tạo user + binding |
| **P4 — Users/Roles BE** | `routes/users.ts` (list, get, patch with guardrails) | curl admin patch role staff ⇒ manager OK; user staff patch khác ⇒ 403 |
| **P4.5 — CRM BE** | `routes/customers.ts`, `routes/leads.ts` (list/get/create/patch). Schema thêm `customers`, `leads`. Seed mock | curl list customers + create lead OK với token staff |
| **P5 — Auth core FE** | `apiClient`, `authStore`, `permission.tsx`, `AuthBootstrap`, router rewrite + `<RequireAuth>` | Reload bất kỳ route protected khi chưa login ⇒ về `/login`. Login email/pwd hoạt động. |
| **P6 — Lark flow FE** | `LandingRedirect`, `LarkEntryPage`, `BindPage`, `LoginPage` 2-mode | 4 case doc §3.2 chạy đúng (test trong Lark Desktop + browser) |
| **P7 — Replace mock** | TopBar user thật + logout; **Users/Roles/Profile + CRM Customers/Leads** call API; `<RequirePermission>` cho buttons cần gating | Login staff ⇒ không thấy nút "Xoá user"/"Xoá khách hàng", login admin ⇒ thấy. PATCH user role + CRUD customer hoạt động end-to-end. |
| **P8 — Polish** | Splash, error toasts, rate-limit `/login` (`express-rate-limit`), password policy zod, log redact secrets | Brute force `/login` 11 lần ⇒ 429. Log không có `password`/`token` raw. |

---

## 10. Migration commands (one-shot khi start P0)

```bash
# 1. Restructure
cd 01_Projects/MIABOS/Build/Lark_MIA_Web
mkdir -p packages/web packages/server

# Move FE vào packages/web (giữ git history)
git mv src packages/web/src
git mv public packages/web/public
git mv index.html packages/web/index.html
git mv vite.config.ts packages/web/vite.config.ts
git mv tsconfig.json packages/web/tsconfig.json
git mv package.json packages/web/package.json
git mv package-lock.json packages/web/package-lock.json
# (tsbuildinfo, dist, node_modules: xoá rồi cài lại sau)

# 2. Tạo root package.json mới (workspaces) — viết tay theo §3.1
# 3. Init server package
cd packages/server && npm init -y && cd ../..
# 4. Cài deps
npm i
# 5. Setup Neon — xem §8, copy DATABASE_URL vào packages/server/.env
# 6. DB schema + seed (chạy lên Neon trực tiếp)
npm run db:push && npm run db:seed
# 7. Run dev
npm run dev
```

---

## 11. Risks & mitigations

| Risk | Khả năng | Mitigation |
|---|---|---|
| Lark SDK không load trong dev (vì origin `localhost`) | Cao | Test trên Lark Desktop với redirect URL `http://localhost:5180`. Whitelist trong Lark Console. Có nút fallback email/pwd. |
| `isInLark()` false-positive khi app nhúng iframe khác Lark | Trung | 8s timeout `loadLarkSdk` + fallback button. Log UA + parent origin để debug. |
| `tenant_key` mismatch nếu BQ có nhiều workspace Lark | Thấp | Phase 8 add `ALLOWED_TENANT_KEYS` env và filter trong `bindingService`. |
| Ad-blocker chặn Lark CDN | Thấp | Self-host SDK trong `packages/web/public/lark-sdk/` nếu cần. |
| Session race khi mở 2 tab cùng lúc | Trung | Zustand persist + storage event listener: tab khác `clear()` ⇒ tab này cũng `clear()`. |
| Dev quên rerun seed sau khi đổi role | Cao | Seed idempotent (`ON CONFLICT DO NOTHING`); script `db:seed` chạy nhanh; document trong README. |
| BE bị brute-force `/login` | Trung | P8: `express-rate-limit` 5 lần / 15 phút / IP cho `/api/auth/login`. |
| JWT trong localStorage bị XSS | Trung | Sanitize mọi user-content render. Cân nhắc P9 chuyển HttpOnly cookie + CSRF token nếu strict. |

---

## 12. Decisions đã chốt (Boss confirm 2026-04-26)

| # | Câu hỏi | Quyết định | Hệ quả implement |
|---|---|---|---|
| 12.1 | Auth mode | **Dual-mode** (email/pwd + Lark) | `LoginPage` giữ form đầy đủ, không ẩn |
| 12.2 | Auto-provision | **ON** | `LARK_AUTO_PROVISION=true` mặc định trong `.env` template; user Lark mới ⇒ tự lên `staff` (hoặc `admin` nếu email ∈ `ADMIN_EMAILS`) |
| 12.3 | Phạm vi P7 replace mock | **Mở rộng cả CRM** | P7 thêm `CustomerListPage`, `CustomerProfilePage`, `LeadListPage` ⇒ cần thêm BE endpoints `/api/customers` & `/api/leads` ⇒ thêm phase **P4.5** ở §9 |
| 12.4 | DB dev | **Neon** (region Singapore) | Bỏ Docker compose. Xem §8 setup. Drizzle dùng `pg` driver tới Neon trực tiếp. |
| 12.5 | Lark credentials | Boss tự nhập sau | `.env.example` để giá trị `cli_xxx`, document trong README cách lấy từ Lark Console |

---

## 13. Definition of Done (cho toàn bộ tích hợp)

- [ ] `npm run dev` chạy FE + BE bằng 1 lệnh.
- [ ] User mở `http://localhost:5180` trong browser thường ⇒ landing → `/login` → đăng nhập email/pwd ⇒ vào `/analytics/executive`.
- [ ] User mở Lark Desktop, app `http://localhost:5180` ⇒ landing → `/lark/entry` → exchange → vào dashboard không cần nhập gì.
- [ ] User Lark chưa có account, BE seed `LARK_AUTO_PROVISION=true` ⇒ tạo user + binding tự động.
- [ ] Admin patch role user qua UI ⇒ user request kế tiếp đã thấy permissions mới (server-side enforcement).
- [ ] Staff đăng nhập ⇒ TopBar tên đúng, sidebar không có menu admin (`/operations/users-roles`).
- [ ] Staff cố gọi `PATCH /api/users/:id` qua DevTools ⇒ 403.
- [ ] Reload trang giữa session ⇒ `me()` re-fetch ⇒ permissions luôn fresh.
- [ ] Logout ⇒ token xoá khỏi localStorage, navigate `/login`, request kế tiếp 401 nếu token leak.
- [ ] Doc [LARK_AUTH_WEB_ARCHITECTURE.md](LARK_AUTH_WEB_ARCHITECTURE.md) còn match trạng thái code (sửa code ⇒ sửa doc cùng PR).

---

## 14. Liên kết

- Kiến trúc auth chi tiết: [LARK_AUTH_WEB_ARCHITECTURE.md](LARK_AUTH_WEB_ARCHITECTURE.md)
- Active requirement source (Giày BQ): [04_Raw_Information/Customers/Giay_BQ/README.md](../../../../04_Raw_Information/Customers/Giay_BQ/README.md)
- Workspace canonical entry: [AGENTS.md](../../../../AGENTS.md)
