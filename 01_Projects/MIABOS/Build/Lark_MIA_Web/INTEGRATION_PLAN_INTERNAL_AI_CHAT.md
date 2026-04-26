# Integration Plan — Internal AI Chat (Haravan Flow Bot)

**Trang:** [packages/web/src/modules/ai-workspace/pages/InternalAIChatPage.tsx](packages/web/src/modules/ai-workspace/pages/InternalAIChatPage.tsx)
**Mục tiêu:** Thay mock data bằng call API chatbot Haravan, render response dạng markdown, lưu lịch sử hội thoại vào Postgres để restore xuyên phiên/reload.

---

## 1. Bối cảnh & quyết định kiến trúc

### Upstream API
- **Base URL:** `https://flow.aaronnnguyen.me/api/v1`
- **Endpoint:** `POST /run/{flowId}` — `flowId = 22c07722-072f-437c-a782-90e7d813f2ac`
- **Header:** `x-api-key: <HARAVAN_CHAT_BOT_API_KEY>`
- **Request:**
  ```json
  {
    "output_type": "chat",
    "input_type": "chat",
    "input_value": "<message>",
    "session_id": "<uuid>"
  }
  ```
- **Response:** Langflow chuẩn — markdown nằm ở `outputs[0].outputs[0].results.message.text` (path sẽ verify lúc implement; có fallback parse).

### Quyết định
- ⚠️ **Không gọi từ browser**: API key sẽ lộ trong DevTools, có thể bị CORS. → Tạo **proxy server-side** tại `POST /api/ai-workspace/...`.
- 🔐 **Bắt buộc Bearer auth** cho proxy (theo pattern `apiClient` hiện tại).
- 💾 **Persist DB**: lưu sessions + messages vào Postgres (Neon, qua Drizzle) để restore xuyên reload và list hội thoại trước đó.
- 🎨 **Giữ UI chrome** (badge `answerType` + side panel "Xem nguồn"): badge dùng giá trị neutral cho mọi response, side panel auto-extract links/headings từ markdown.
- 🛡 **Sanitize markdown**: dùng `rehype-sanitize` (bot có thể inject HTML).

---

## 2. Phase 1 — Database schema

**File:** [packages/server/src/db/schema.ts](packages/server/src/db/schema.ts)

Thêm 2 bảng:

```ts
export const aiChatSessions = pgTable("ai_chat_sessions", {
  id: uuid("id").primaryKey().defaultRandom(),       // = sessionId gửi cho Haravan
  userId: uuid("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  title: text("title").notNull().default("Cuộc trò chuyện mới"),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  lastActiveAt: timestamp("last_active_at", { withTimezone: true }).notNull().defaultNow(),
});

export const aiChatMessages = pgTable("ai_chat_messages", {
  id: uuid("id").primaryKey().defaultRandom(),
  sessionId: uuid("session_id").notNull().references(() => aiChatSessions.id, { onDelete: "cascade" }),
  role: text("role", { enum: ["user", "assistant", "error"] }).notNull(),
  content: text("content").notNull(),                // markdown nếu assistant, plain nếu user
  meta: jsonb("meta"),                               // { responseMs, upstreamRaw? } — nullable
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});
```

**Index:**
- `aiChatSessions(userId, lastActiveAt DESC)` — list nhanh sessions của user.
- `aiChatMessages(sessionId, createdAt ASC)` — load thread theo thứ tự.

**Migration:** `pnpm --filter @miabos/server db:generate` → `pnpm --filter @miabos/server db:migrate`.

**Title auto-gen:** khi user gửi message đầu tiên trong session, set `title = message.slice(0, 60)`.

---

## 3. Phase 2 — Backend (server)

### 3.1 Env
**File:** [packages/server/src/lib/env.ts](packages/server/src/lib/env.ts) + `.env.example`

```ts
HARAVAN_CHAT_BOT_API_KEY: z.string().min(1),
HARAVAN_CHAT_BOT_BASE_URL: z.string().url().default("https://flow.aaronnnguyen.me/api/v1"),
HARAVAN_CHAT_BOT_FLOW_ID: z.string().default("22c07722-072f-437c-a782-90e7d813f2ac"),
```

`.env` đã có `HARAVAN_CHAT_BOT_API_KEY` — không thay đổi.

### 3.2 Haravan client
**File mới:** `packages/server/src/services/haravanChat.ts`

```ts
export async function runHaravanFlow(message: string, sessionId: string): Promise<string> {
  const res = await fetch(`${env.HARAVAN_CHAT_BOT_BASE_URL}/run/${env.HARAVAN_CHAT_BOT_FLOW_ID}`, {
    method: "POST",
    headers: { "Content-Type": "application/json", "x-api-key": env.HARAVAN_CHAT_BOT_API_KEY },
    body: JSON.stringify({ output_type: "chat", input_type: "chat", input_value: message, session_id: sessionId }),
    signal: AbortSignal.timeout(60_000),
  });
  if (!res.ok) throw new Error(`Haravan upstream ${res.status}`);
  const data = await res.json();
  // Path chuẩn Langflow: outputs[0].outputs[0].results.message.text
  // Fallback: outputs[0].outputs[0].outputs.message.message | data.result | JSON.stringify(data)
  const text = extractMarkdown(data);
  if (!text) throw new Error("Empty response from Haravan");
  return text;
}
```

`extractMarkdown()` thử nhiều path để robust với schema thay đổi.

### 3.3 Routes
**File mới:** `packages/server/src/routes/aiChat.ts` — mount tại `/api/ai-workspace`, **bắt buộc auth middleware** (Bearer token, theo pattern `users.ts` / `customers.ts`).

| Method | Path                          | Mô tả                                                   |
| ------ | ----------------------------- | ------------------------------------------------------- |
| GET    | `/sessions`                   | List sessions của user (id, title, lastActiveAt). Sort DESC. |
| POST   | `/sessions`                   | Tạo session mới rỗng, return `{ id, title, createdAt }`.    |
| GET    | `/sessions/:id/messages`      | Load toàn bộ messages của session (ASC).                |
| POST   | `/sessions/:id/messages`      | Body `{ message }`. Lưu user msg → call Haravan → lưu assistant msg → return `{ user, assistant }`. |
| DELETE | `/sessions/:id`               | Xoá session (cascade messages).                         |

**Validation:** Zod cho mọi body/param. Ownership check: mọi route theo `:id` phải verify `session.userId === req.user.id` → 404 nếu không.

**Error handling:**
- Upstream fail → lưu message `role: "error"` với content là error text → trả 502 + payload `{ user, error }` (FE vẫn render được).
- Timeout → 504.

**Mount:** [packages/server/src/index.ts](packages/server/src/index.ts) → `app.use("/api/ai-workspace", aiChatRouter);`

---

## 4. Phase 3 — Frontend

### 4.1 Dependencies
**File:** [packages/web/package.json](packages/web/package.json)

```bash
pnpm --filter @miabos/web add react-markdown remark-gfm rehype-sanitize
```

### 4.2 API service
**File mới:** `packages/web/src/shared/api/aiChatApi.ts`

```ts
export interface ChatSession { id: string; title: string; lastActiveAt: string; }
export interface ChatMessage { id: string; role: "user" | "assistant" | "error"; content: string; createdAt: string; }

export const aiChatApi = {
  listSessions: () => apiClient.get<ChatSession[]>("/ai-workspace/sessions").then(r => r.data),
  createSession: () => apiClient.post<ChatSession>("/ai-workspace/sessions").then(r => r.data),
  getMessages: (sessionId: string) => apiClient.get<ChatMessage[]>(`/ai-workspace/sessions/${sessionId}/messages`).then(r => r.data),
  sendMessage: (sessionId: string, message: string) =>
    apiClient.post<{ user: ChatMessage; assistant: ChatMessage }>(`/ai-workspace/sessions/${sessionId}/messages`, { message }).then(r => r.data),
  deleteSession: (sessionId: string) => apiClient.delete(`/ai-workspace/sessions/${sessionId}`).then(r => r.data),
};
```

### 4.3 Markdown component
**File mới:** `packages/web/src/modules/ai-workspace/components/MarkdownAnswer.tsx`

- Wrap `ReactMarkdown` + `remarkGfm` + `rehypeSanitize`.
- Override các element renderers theo design tokens hiện tại:
  - `h1-h3`: `#013652`, font-weight 600, margin-bottom theo `--space-3`.
  - `p`: line-height 1.6, color `#013652`, font-size 14.
  - `ul/ol`: padding-left 20, line-height 1.6.
  - `code` inline: bg `#F6F9FF`, padding `2px 6px`, border-radius 4, font-mono.
  - `pre`: bg `#013652`, color `#fff`, padding 16, border-radius `--radius-md`, overflow-x auto.
  - `table`: border `1px solid rgba(47,100,246,0.12)`, header bg `#ECF4FF`, cell padding `8px 12px`.
  - `blockquote`: border-left 3 `#2F64F6`, padding-left 12, color `#3A6381`.
  - `a`: color `#2F64F6`, underline, target `_blank` rel `noopener`.

### 4.4 Source extractor
**File mới:** `packages/web/src/modules/ai-workspace/lib/extractSources.ts`

Parse markdown text → trả về:
```ts
interface ExtractedSources {
  links: { text: string; url: string }[];   // từ [text](url)
  outline: { level: 2 | 3; text: string }[]; // từ ## / ###
}
```

Dùng regex đơn giản (không cần full markdown parser):
- Links: `/\[([^\]]+)\]\((https?:\/\/[^\)]+)\)/g`
- Headings: `/^(#{2,3})\s+(.+)$/gm`

### 4.5 Refactor `InternalAIChatPage.tsx`

**State mới:**
```ts
const [sessions, setSessions] = useState<ChatSession[]>([]);
const [currentSessionId, setCurrentSessionId] = useState<string | null>(null);
const [messages, setMessages] = useState<ChatMessage[]>([]);
const [isLoading, setIsLoading] = useState(false);
const [activeSourceMessageId, setActiveSourceMessageId] = useState<string | null>(null);
```

(Bỏ: `entries`, `lastScenario`, `activeTrace` cũ — thay bằng state trên.)

**Lifecycle on mount:**
1. `aiChatApi.listSessions()` → set `sessions`.
2. Nếu có session → set `currentSessionId` = newest, `getMessages()` → set `messages`.
3. Nếu không có → `createSession()` → set `currentSessionId`, `messages = []`.

**`submitPrompt(text)`:**
1. `setIsLoading(true)`, optimistic push user message vào `messages`.
2. `aiChatApi.sendMessage(currentSessionId, text)`.
3. Replace optimistic + push assistant. Update `sessions` (lastActiveAt + title nếu là msg đầu).
4. Catch → push `role: "error"` message; `ErrorBubble` retry vẫn dùng `lastPrompt`.

**Switch session:** click vào history item → `setCurrentSessionId(id)` → `getMessages(id)`.

**New chat button:** thêm nút ở đầu history panel → `createSession()` → switch.

### 4.6 Giữ UI chrome (theo yêu cầu)

**`AnswerCard` refactor — giữ Card layout nhưng dữ liệu lấy từ message + extracted sources:**

| Element             | Hiện tại (mock)                       | Sau refactor                                                         |
| ------------------- | ------------------------------------- | -------------------------------------------------------------------- |
| Badge `answerType`  | Policy/Data/Mixed/Blocked/Unsupported | **Cố định: `"Trợ lý AI"`** — color `#2F64F6`, bg `#ECF4FF`, icon `Bot`. |
| Freshness chip      | `freshnessLabel` từ scenario          | `formatTime(createdAt)` + label `"Vừa trả lời"`.                      |
| `summary` heading   | `scenario.summary`                    | **Bỏ** (markdown đã chứa kết luận).                                   |
| Body                | dataPoints/citations grids            | **`<MarkdownAnswer markdown={message.content} />`** chiếm toàn bộ thân Card. |
| Nút "Xem nguồn"     | luôn hiện nếu có sourceTrace          | Hiện nếu `extractSources(content).links.length > 0 \|\| outline.length > 0`. |
| Next actions        | `scenario.nextActions`                | Cố định 2 nút: `"Hỏi tiếp"`, `"Tạo yêu cầu hỗ trợ"` (preview như cũ). |
| Feedback up/down    | giữ                                   | giữ — gọi notice (table feedback để dành sau).                       |

**Side panel "Xem nguồn":**
- Khi `activeSourceMessageId` set → tìm message tương ứng → chạy `extractSources(content)`.
- Render:
  - Nếu có `links` → list từng link: `title` (text), `source` (host từ url), `excerpt` (rỗng), `trust` (cố định "Medium").
  - Thêm section "Outline câu trả lời" — list `outline` headings.
  - Nếu cả 2 đều rỗng → empty state: *"Câu trả lời được tổng hợp từ tri thức của Trợ lý — không có nguồn cụ thể được trích dẫn."*

**History panel (sidebar phải):**
- Thay vì compute từ `entries` trong-phiên → dùng `sessions` từ DB.
- Mỗi item: title, lastActiveAt (`formatTime`), badge `"Trợ lý AI"`.
- Click → switch session.
- Thêm nút `+ Cuộc trò chuyện mới` ở trên.
- Hover hiện nút xoá → confirm → `deleteSession()`.

---

## 5. Phase 4 — Cleanup

- [internalChat.ts](packages/web/src/mocks/ai-workspace/internalChat.ts): giữ `BQ_PROMPT_CHIPS` export, xoá phần còn lại (hoặc mark `@deprecated` nếu lo có chỗ khác import — sẽ grep verify).
- Bỏ import `AnswerScenario`, `inferScenarioFromPrompt` khỏi `InternalAIChatPage.tsx`.
- TypeScript build pass: `pnpm --filter @miabos/web build`.

---

## 6. Test plan (manual)

| # | Bước                                                          | Kỳ vọng                                                  |
| - | ------------------------------------------------------------- | -------------------------------------------------------- |
| 1 | Login, vào `/ai-workspace/internal-chat`                       | Tạo session mới rỗng, EmptyState hiển thị prompt chips.  |
| 2 | Click 1 prompt chip                                            | User bubble hiện, LoadingBubble, sau ~5s assistant trả markdown render đẹp. |
| 3 | Hỏi follow-up `"giải thích thêm"`                              | Bot giữ ngữ cảnh (cùng sessionId) → trả lời liên quan câu trước. |
| 4 | F5 reload trang                                                | Session + messages restore đầy đủ.                       |
| 5 | Click `+ Cuộc trò chuyện mới`                                  | Session mới, thread rỗng. History panel hiện 2 sessions. |
| 6 | Switch về session cũ qua history                               | Messages load đúng.                                      |
| 7 | Bot trả response có links markdown                             | Side panel "Xem nguồn" có nút, click → list links + outline. |
| 8 | Bot trả response không có links/headings                       | Side panel show empty state câu chữ.                     |
| 9 | Tắt internet, gửi message                                      | ErrorBubble hiện, click "Thử lại" → retry thành công sau khi bật mạng. |
| 10 | Xoá 1 session từ history                                       | Confirm → biến mất; nếu là session đang xem → switch sang session khác hoặc tạo mới. |

---

## 7. Out of scope (làm sau)

- ❌ Streaming response (Langflow có hỗ trợ SSE — bản này dùng request/response thường).
- ❌ Edit/rename session title.
- ❌ Lưu feedback up/down vào DB (UI vẫn có nút, hiện chỉ show notice).
- ❌ Search trong history.
- ❌ Export hội thoại.
- ❌ Multi-user share session.

---

## 8. Risks & mitigations

| Risk                                                          | Mitigation                                                            |
| ------------------------------------------------------------- | --------------------------------------------------------------------- |
| Langflow response schema thay đổi → `extractMarkdown` fail   | Try multiple paths, fallback `JSON.stringify(data)` để dev thấy raw. Log warning. |
| Bot trả markdown chứa `<script>` hoặc HTML độc                | `rehype-sanitize` strip tất cả HTML không an toàn.                    |
| Latency cao (Langflow 10-30s)                                 | Timeout 60s ở server, LoadingBubble ở FE.                             |
| API key bị leak                                               | Server-only, không bao giờ trả về FE.                                 |
| User tạo quá nhiều sessions                                   | Future: pagination + auto-cleanup sessions > 90 ngày inactive.        |
| Concurrent send trong cùng session                            | FE disable input khi `isLoading`. Server không lock — race condition về thứ tự message có thể xảy ra nhưng acceptable. |

---

## 9. Estimated effort

- Phase 1 (DB): ~30 phút
- Phase 2 (Server): ~1.5 giờ
- Phase 3 (FE refactor): ~2.5 giờ
- Phase 4 (cleanup + test): ~1 giờ

**Total: ~5–6 giờ.**

---

## 10. Implementation checklist

- [ ] Schema: thêm `aiChatSessions`, `aiChatMessages` + indexes
- [ ] `db:generate` + `db:migrate`
- [ ] Env: thêm 3 biến `HARAVAN_*` vào schema + `.env.example`
- [ ] Service: `services/haravanChat.ts` + `extractMarkdown()`
- [ ] Routes: `routes/aiChat.ts` (5 endpoints) + mount + auth
- [ ] Test backend bằng curl trước khi đụng FE
- [ ] FE: `pnpm add react-markdown remark-gfm rehype-sanitize`
- [ ] FE: `shared/api/aiChatApi.ts`
- [ ] FE: `MarkdownAnswer.tsx` component + style
- [ ] FE: `lib/extractSources.ts`
- [ ] FE: refactor `InternalAIChatPage.tsx` (state + lifecycle + AnswerCard + side panel + history)
- [ ] Bỏ import mock cũ
- [ ] Manual test 10 case ở §6
- [ ] TypeScript build pass: `pnpm --filter @miabos/web build` + `pnpm --filter @miabos/server build`
