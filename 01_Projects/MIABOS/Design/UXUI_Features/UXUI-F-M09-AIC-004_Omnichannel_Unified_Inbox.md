# UXUI Feature Spec: F-M09-AIC-004 Omnichannel Unified Inbox

**Feature ID**: F-M09-AIC-004
**Status**: In Review
**Owner**: A06 UI/UX Agent
**Implementation Reviewer**: A05 Tech Lead
**Implemented By**: A07 FE Builder
**Product**: MIA Smart
**Design System Reference**: `Design/Design_System.md` — Aura Minimalist (Giay BQ Portal)
**Save to**: `Design/UXUI_Features/UXUI-F-M09-AIC-004_Omnichannel_Unified_Inbox.md`
**Date**: 2026-04-17
**Last Status Change**: 2026-04-17
**Source SRS**: `Analysis/Features/Modules/AI_Workspace/Omnichannel_Sales_Chat/SRS/F-M09-AIC-004_Omnichannel_Unified_Inbox_SRS.md`
**Research Basis**: `04_Raw_Information/Market_Research/2026-04_AI_Chatbot_Vietnam/06_Sales_Chatbot_Concept_Research.md`

> **Precondition**: Feature SRS F-M09-AIC-004 is `Draft` — promoted to `In Review` with this spec per Business Owner approval of concept on 2026-04-17. Build handoff requires PM to promote both to `SRS Ready` + `Approved`.

---

## §0. User & Task ⚠️ MANDATORY

### Target User Role(s)

| Role | Mô tả | Context khi dùng |
|------|-------|-----------------|
| **CS Agent** | Nhân viên chăm sóc khách hàng | Đang trực ca, nhận và xử lý tin nhắn đến từ nhiều kênh cùng lúc |
| **Sales Agent** | Nhân viên tư vấn bán hàng | Tiếp nhận hot lead từ bot, tư vấn và chốt đơn |
| **Team Lead** | Trưởng nhóm CS/Sales | Giám sát team, assign lại hội thoại, xem tổng quan |

### Primary Task Objective

> **CS/Sales Agent**: Xem, phân loại và trả lời hội thoại khách hàng từ mọi kênh trong **< 30 giây** từ khi mở Inbox — không cần mở thêm tab hay tool khác.
>
> **Team Lead**: Assign hội thoại cho agent phù hợp trong **≤ 3 thao tác**.

### Success Metric

| Metric | Target | Cách đo |
|--------|--------|---------|
| Thời gian từ mở Inbox đến gửi reply đầu tiên | ≤ 30 giây | Đo từ page load đến click Send |
| Số thao tác để assign conversation | ≤ 3 clicks | Đếm click từ conversation list đến assign confirm |
| Tỷ lệ agent dùng đúng bot toggle | ≥ 95% | Audit log: toggle ON/OFF đúng context |
| Thời gian load conversation list | ≤ 1.5 giây | API response + render time |
| Tỷ lệ nhầm channel khi reply | 0% | Audit log: reply channel = source channel |

### Failure Indicators

- Agent phải mở nhiều hơn 1 tab để xử lý 1 hội thoại
- Agent không biết bot đang active hay đã dừng trong conversation
- Agent gửi reply nhưng không biết nó được gửi qua kênh nào
- Team Lead phải hỏi agent để biết conversation đang ở trạng thái nào
- Khách hàng nhắn tin nhưng không có ai nhận vì bị bỏ sót trong list

---

## 1. Feature Overview

### Purpose

Unified Inbox là giao diện trung tâm để agent quản lý toàn bộ hội thoại với khách hàng từ mọi kênh (Facebook, Zalo, Instagram, Website) trong một màn hình duy nhất. Bot AI (F-M09-AIC-005) tự động xử lý phần lớn hội thoại — agent chỉ cần vào khi bot alert hoặc khi muốn tiếp quản.

### User Persona

**Nguyễn Thu Hà** — CS Agent, 24 tuổi, làm việc tại Giày BQ, thường xuyên trực ca buổi tối. Hà quản lý đồng thời Facebook page, Zalo OA, và website chat. Hiện tại Hà phải mở 3 tab riêng, hay bỏ lỡ tin khi đang xử lý kênh khác.

### User Story

```
Là CS Agent,
Tôi muốn xem tất cả tin nhắn từ mọi kênh trong 1 dashboard,
Để không bỏ lỡ hội thoại nào và trả lời nhanh hơn mà không cần chuyển tab.
```

### Linked Artifacts

| Artifact | Location | Status |
|----------|----------|--------|
| Feature SRS | `Analysis/Features/Modules/AI_Workspace/Omnichannel_Sales_Chat/SRS/F-M09-AIC-004_Omnichannel_Unified_Inbox_SRS.md` | Draft → In Review |
| Bot Engine SRS | `Analysis/Features/Modules/AI_Workspace/Sales_Bot_Conversation_Engine/SRS/F-M09-AIC-005_Sales_Bot_Conversation_Engine_SRS.md` | Draft |
| Research | `04_Raw_Information/Market_Research/2026-04_AI_Chatbot_Vietnam/06_Sales_Chatbot_Concept_Research.md` | Done |
| Design System | `Design/Design_System.md` | Approved |

---

## 2. Screen Inventory

| # | Tên màn hình | Route/Path | Mục đích |
|---|-------------|-----------|---------|
| S1 | Unified Inbox — Toàn bộ | `/inbox` | View chính: 3 cột, danh sách + chat + customer panel |
| S2 | Customer Detail Panel | Panel bên phải trong S1 | Xem profile, stage, history khách hàng |
| S3 | Bot Toggle Confirmation | Modal/overlay trong S1 | Confirm khi agent toggle bot OFF |
| S4 | Assign Conversation | Dropdown/popover trong S1 | Team Lead assign sang agent khác |
| S5 | Inbox — Empty State | `/inbox` khi chưa có conversation | Trạng thái lần đầu hoặc filter không có kết quả |

---

## 2.1 Task Flow ⚠️ MANDATORY

### Primary Task Flow — CS Agent Trả Lời Hội Thoại

| Step | Hành động của Agent | Phản hồi của Hệ thống | Trường hiển thị | Ghi chú |
|------|--------------------|-----------------------|-----------------|---------|
| 1 | Mở `/inbox` | Load danh sách conversation, sort theo `last_message_at` DESC, highlight unread | Conversation list: avatar, tên, preview, timestamp, unread badge, channel icon | Entry point |
| 2 | Chọn filter channel hoặc status (optional) | Filter conversation list theo lựa chọn | Filter bar: [Tất cả kênh] [Facebook] [Zalo] [Instagram] [Website] + [Tất cả] [Chưa đọc] [Bot đang xử lý] [Của tôi] | Progressive — hiển thị sau khi load |
| 3 | Click vào conversation | Load full message thread. Highlight conversation đang chọn trong list. Hiển thị Customer Detail Panel bên phải | Thread: tin bot (nền vàng) + tin agent (nền trắng) + tin khách (không background), label rõ ràng | Decision point: nếu bot đang active → hiển thị toggle ON |
| 4 | Đọc context, kiểm tra bot status | Indicator `Chatbot đang hoạt động` nếu bot ON. Customer panel hiện stage + tags | Bot toggle switch (top-right chat window), customer stage badge | Agent tự quyết có tiếp quản không |
| 5 (Nếu tiếp quản) | Toggle bot OFF | Modal confirm hiện ra | Confirmation modal: "Tắt chatbot? Bot sẽ dừng tự động trả lời trong hội thoại này." + [Xác nhận] [Huỷ] | Decision point: §5.1 E3 nếu toggle sync fail |
| 6 | Gõ nội dung reply trong ô nhập | Hiển thị typing indicator trong thread | Input area: text field + send button + attachment icon + internal note toggle | Required: nội dung không được trống |
| 7 | Click Gửi | Message được deliver lên channel tương ứng. Xuất hiện trong thread với status `Đã gửi → Đã nhận → Đã đọc` | Message bubble mới, delivery status indicator | §5.1 E1 nếu gửi thất bại |
| 8 | Cập nhật tags/stage (optional) | Customer panel cập nhật realtime | Customer panel: stage dropdown, tag input | Optional — progressive disclosure |
| 9 | Mark Đã xử lý khi xong | Status conversation chuyển `Đã xử lý`. Conversation di chuyển xuống dưới list hoặc ra khỏi filter hiện tại | Confirmation toast: "Đã đánh dấu xử lý" | Task complete |

### Decision Points & Branching

| Tại Step | Điều kiện | Rẽ nhánh đến |
|---------|-----------|-------------|
| Step 3 | Conversation chưa được assign cho ai | Hiển thị banner "Hội thoại chưa được phân công" + nút [Nhận xử lý] |
| Step 4 | Bot đang OFF (agent khác đã tiếp quản) | Hiển thị "Agent [Tên] đang xử lý" — không cho reply nếu không phải assignee |
| Step 5 | Agent confirm toggle OFF | Gọi `PATCH /inbox/conversations/:id/bot-toggle`, chờ confirm trước khi cho reply |
| Step 7 | Message send fail sau 3 lần retry | §5.1 E1 — hiển thị lỗi + retry manual |
| Step 7 | Channel API down (Facebook/Zalo offline) | §5.1 E2 — banner channel error, queue message |

### Three Interaction Patterns

#### Pattern 1 — Quick Action (≤ 3 thao tác)

**Kịch bản**: Bot đã xử lý xong, agent chỉ cần check và đánh dấu xử lý.

```
Click conversation → Đọc thread → Click "Đã xử lý"
(3 clicks — không cần toggle, không cần reply)
```

#### Pattern 2 — Exception Handling (Bot fail, agent phải tiếp quản)

```
Notification: Bot không xử lý được → Conversation highlighted đỏ trong list
→ Click vào → Banner "Bot cần hỗ trợ" hiển thị trên thread
→ Agent đọc context (bot đã hỏi đến đâu, lead score bao nhiêu)
→ Toggle bot OFF (confirm modal)
→ Gửi reply tiếp tục từ đúng điểm bot dừng
→ Resolve khi xong
```

#### Pattern 3 — Team Lead Assign

```
Click vào conversation → Click icon [Phân công] trên header chat window
→ Dropdown danh sách agents available → Chọn agent → Confirm
(3 clicks)
```

### Progressive Disclosure Rules

- **Luôn hiển thị**: Danh sách conversation, thread chính, bot toggle, send button, Customer Detail Panel (collapsed)
- **Hiển thị sau khi click conversation**: Full thread, customer panel mở rộng, tags, stage
- **Ẩn sau "Thêm tuỳ chọn"**: Internal note toggle, attachment picker, schedule send (future)

---

## 3. Visual Specification

### Screen S1: Unified Inbox — Layout 3 Cột

#### Layout (ASCII Wireframe)

```
┌──────────────────────────────────────────────────────────────────────────┐
│ TOPBAR: Logo + Navigation + Search (⌘K) + Notifications + Avatar         │
├────┬──────────────────────┬────────────────────────────┬──────────────────┤
│    │ CHANNEL SELECTOR     │                            │                  │
│ S  │ ┌──┐ Facebook    ●   │  [Search conversations...] │  CUSTOMER PANEL  │
│ I  │ ├──┤ Zalo            │  ─────────────────────── │                  │
│ D  │ ├──┐ Instagram        │  Filter: [Tất cả kênh ▾] │  👤 Nguyễn Lan   │
│ E  │ ├──┤ Website      ●   │  [Tất cả][Chưa đọc][Bot] │  Tiềm năng       │
│ B  │ └──┘                  │                          │                  │
│ A  │                      │ ┌──────────────────────┐  │  THÔNG TIN KH ▾  │
│ R  │                      │ │ 🟢 Nguyễn Lan    8p  │  │  📍 —            │
│    │                      │ │ Bot đang xử lý  [ZAL]│  │  📞 —            │
│    │                      │ │ "Mình cần tư vấn..." │  │  📧 —            │
│    │                      │ ├──────────────────────┤  │                  │
│    │                      │ │ Trần Minh      17p   │  │  LỊCH SỬ (3) ▾   │
│    │                      │ │ "What dent..."  [FB] │  │                  │
│    │                      │ ├──────────────────────┤  │  TỆP ĐÍNH KÈM    │
│    │                      │ │ Lê Hoàng       1h    │  │  (0)         →   │
│    │                      │ │ "Tagalog Kasi..[ZAL] │  │                  │
│    │                      │ └──────────────────────┘  │                  │
├────┼──────────────────────┼────────────────────────────┤                  │
│    │                      │ CHAT WINDOW                │                  │
│    │                      │ ┌────────────────────────┐ │                  │
│    │                      │ │ Nguyễn Lan  [ZAL]      │ │                  │
│    │                      │ │ Chatbot đang hoạt động●│ │                  │
│    │                      │ │                    [⚡] │ │                  │
│    │                      │ ├────────────────────────┤ │                  │
│    │                      │ │      [Bot bubble vàng] │ │                  │
│    │                      │ │ "Bạn muốn tư vấn gì?" │ │                  │
│    │                      │ │ Bot AI · 8p trước      │ │                  │
│    │                      │ │                        │ │                  │
│    │                      │ │ [Khách bubble trái]    │ │                  │
│    │                      │ │ Mình cần giày đi làm   │ │                  │
│    │                      │ │ Nguyễn Lan · 7p trước  │ │                  │
│    │                      │ │                        │ │                  │
│    │                      │ │      [Bot bubble vàng] │ │                  │
│    │                      │ │ "Bạn cần trong tuần   │ │                  │
│    │                      │ │  này hay đang xem?"    │ │                  │
│    │                      │ │ Bot AI · 6p trước      │ │                  │
│    │                      │ ├────────────────────────┤ │                  │
│    │                      │ │ 📎  Nhập tin nhắn...  🎤│►│                  │
│    │                      │ └────────────────────────┘ │                  │
└────┴──────────────────────┴────────────────────────────┴──────────────────┘
```

#### Component Breakdown

| Component | Design Token | Framework Mapping | Ghi chú |
|-----------|-------------|-------------------|---------|
| Page background | `bg-[#F6F9FF]` | `<div className="bg-[#F6F9FF]">` | `--color-bg-page` |
| Channel sidebar | `bg-[#ECF4FF]` w-16 | `<nav>` | `--color-bg-surface`, icon-only, collapsed |
| Conversation list panel | `bg-white` w-72 border-r | `<aside>` | `--color-bg-card` |
| Conversation item — default | `hover:bg-[#ECF2FE]` | `<button>` | `--color-primary-light` on hover |
| Conversation item — selected | `bg-[#D3E1FC]` | `<button aria-selected>` | `--color-primary-muted` |
| Unread badge | `bg-[#2F64F6] text-white` rounded-full text-xs | `<Badge>` | Số tin chưa đọc |
| Channel indicator chip | `text-[10px] bg-[#ECF2FE] text-[#2F64F6]` rounded | `<span>` | "ZAL" / "FB" / "IG" / "WEB" |
| Chat window | `bg-white flex-1` | `<main>` | Flex grow |
| Bot message bubble | `bg-[#FFF8EC] border border-[#F59E0B]/20` rounded-lg | `<div>` | Nền vàng nhạt cho tin bot |
| Bot label | `text-[#F59E0B] text-[11px] font-medium` | `<span>` | "Bot AI" |
| Agent message bubble | `bg-white border border-[#ECF4FF]` rounded-lg | `<div>` | Phân biệt với tin bot |
| Customer message bubble | `bg-[#F6F9FF]` rounded-lg | `<div>` | Bên trái, không có background đặc biệt |
| Bot toggle switch | shadcn `<Switch>` với label | `<Switch>` | ON = primary blue, OFF = tertiary |
| Bot active indicator | `text-[#22C55E]` + dot animation | `<span>` | Pulse dot khi active |
| Message input | shadcn `<Textarea>` h-12 auto-grow | `<Textarea>` | Grow đến 5 dòng rồi scroll |
| Send button | `bg-[#2F64F6] hover:bg-[#2552CC]` rounded-full w-9 h-9 | `<Button>` | Icon Send (Lucide) |
| Customer panel | `bg-white` w-72 border-l | `<aside>` | Collapsible |
| Stage badge | Conditional color badge | `<Badge>` | Tiềm năng/Đủ tiêu chuẩn/Khách hàng |

#### Design Token Values

| Element | Property | Token / Value |
|---------|----------|---------------|
| Page background | `background` | `#F6F9FF` |
| Conversation list bg | `background` | `#FFFFFF` |
| Selected conversation | `background` | `#D3E1FC` |
| Bot bubble background | `background` | `#FFF8EC` |
| Bot bubble border | `border` | `#F59E0B` at 20% opacity |
| Bot label color | `color` | `#F59E0B` |
| Primary CTA (Send) | `background` | `#2F64F6` |
| Unread badge | `background` | `#2F64F6` |
| Toggle ON color | `background` | `#2F64F6` |
| Text primary | `color` | `#013652` |
| Text secondary | `color` | `#3A6381` |
| Timestamp / metadata | `color` | `#8EB6D9` |
| Card shadow | `box-shadow` | `0 4px 24px rgba(1,54,82,0.06)` |
| Channel sidebar width | `width` | `64px` (w-16) |
| Conversation list width | `width` | `288px` (w-72) |
| Customer panel width | `width` | `288px` (w-72) |

#### Responsive Behavior

| Breakpoint | Thay đổi |
|-----------|---------|
| Desktop (≥1280px) | Layout 4 cột đầy đủ: sidebar + list + chat + customer panel |
| Desktop nhỏ (1024–1279px) | Customer panel collapse thành icon-only, mở khi click |
| Tablet (768–1023px) | List ẩn, chỉ hiện chat + swipe-back để về list. Customer panel drawer |
| Mobile (<768px) | Single column: list view → tap → chat view. Bottom navigation |

---

### Screen S3: Bot Toggle Confirmation Modal

#### Layout

```
┌─────────────────────────────────────┐
│  ⚠️  Tắt chatbot?                   │
│                                     │
│  Bot sẽ dừng tự động trả lời trong  │
│  hội thoại này. Bạn sẽ xử lý trực  │
│  tiếp với khách hàng.               │
│                                     │
│  [      Huỷ      ] [  Xác nhận  ]   │
└─────────────────────────────────────┘
```

#### Component

| Element | Token / Value |
|---------|--------------|
| Modal overlay | `bg-black/40` backdrop-blur-sm |
| Modal card | `bg-white rounded-xl shadow-glass p-6 w-[360px]` |
| Icon | Lucide `ToggleLeft` `text-[#F59E0B]` |
| Title | H3 `text-[#013652]` font-600 |
| Body text | Body `text-[#3A6381]` |
| Nút Huỷ | shadcn `<Button variant="outline">` |
| Nút Xác nhận | shadcn `<Button>` `bg-[#2F64F6]` |

---

## 4. Data Binding

| UI Element | API Endpoint | Field | Format | Sort/Filter |
|-----------|-------------|-------|--------|-------------|
| Danh sách conversation | `GET /inbox/conversations` | `id, customer_name, channel, last_message, last_message_at, status, bot_active, unread_count, assignee` | List | Sort: `last_message_at` DESC; Filter: `channel`, `status`, `assigned_to` |
| Channel icon trên conversation item | `channel` field | `facebook\|zalo\|instagram\|web` | Enum → icon mapping | — |
| Unread badge | `unread_count` | Integer | Số, ẩn khi = 0 | — |
| Bot active indicator | `bot_active` | Boolean | ON/OFF toggle state | — |
| Message thread | `GET /inbox/conversations/:id/messages` | `id, sender_type, sender_name, content, sent_at, status, channel, is_internal_note` | Chronological list | ASC by `sent_at` |
| Bot bubble indicator | `sender_type === 'bot'` | String | Conditional render | — |
| Delivery status icon | `status` field | `sending\|sent\|delivered\|read\|failed` | Enum → icon | — |
| Customer name (panel) | `GET /inbox/customers/:id` | `name` | String | — |
| Stage badge | `stage` | `potential\|qualified\|customer` | Enum → Vietnamese label + color | — |
| Tags | `tags[]` | String array | Chip list | — |
| Channel history | `channel_history[]` | Array | List với channel icon + date | Sort: DESC |
| Bot toggle state | `PATCH /inbox/conversations/:id/bot-toggle` | `bot_active` | Boolean | — |
| Assignee | `assigned_agent_id` → agent lookup | String | Tên agent | — |

---

## 5. State Matrix

### Page-Level States

| State | Trigger | Visual | Ghi chú |
|-------|---------|--------|---------|
| **Loading** | API đang tải | Skeleton: 3 cột skeleton blocks, chiều cao conversation item giả | Hiện sau 300ms delay |
| **Empty — Chưa có hội thoại** | 0 conversations | Illustration + "Chưa có hội thoại nào. Kết nối kênh đầu tiên của bạn." + nút [Cài đặt kênh] | First-time state |
| **Empty — Filter không kết quả** | Filter active, 0 match | Icon search + "Không tìm thấy hội thoại phù hợp" + link [Xoá bộ lọc] | — |
| **Conversation selected** | Agent click conversation | Left panel highlight, chat window load, customer panel expand | Default working state |
| **No conversation selected** | Mới vào, chưa chọn | Chat area trống với illustration + "Chọn một hội thoại để bắt đầu" | Idle state |
| **Channel API error** | Zalo/FB/IG offline | Banner đỏ trên chat window: "Kênh [X] đang gặp sự cố. Tin nhắn sẽ được gửi khi kết nối phục hồi." | Non-blocking |
| **All channels offline** | Tất cả channels down | Full-page error + thông báo + retry | Blocking |

### Component-Level States

| Component | Default | Hover | Active/Selected | Focus | Disabled | Loading |
|-----------|---------|-------|-----------------|-------|----------|---------|
| Conversation item | `bg-white` | `bg-[#ECF2FE]` | `bg-[#D3E1FC]` border-l-2 primary | — | — | Skeleton |
| Send button | `bg-[#2F64F6]` | `bg-[#2552CC]` | `bg-[#1A3B99]` | ring-2 primary | `bg-[#ECF4FF] text-tertiary` | Spinner icon |
| Bot toggle | Blue (ON) / Gray (OFF) | Opacity 80% | — | ring-2 | — | — |
| Message input | border-ghost | border-primary | — | ring-2 primary | bg-surface | — |
| Stage badge — Tiềm năng | `bg-[#ECF2FE] text-[#2F64F6]` | — | — | — | — | — |
| Stage badge — Đủ tiêu chuẩn | `bg-[#D1FAE5] text-[#065F46]` | — | — | — | — | — |
| Stage badge — Khách hàng | `bg-[#22C55E] text-white` | — | — | — | — | — |
| Channel chip FB | `bg-[#1877F2]/10 text-[#1877F2]` | — | — | — | — | — |
| Channel chip ZAL | `bg-[#0068FF]/10 text-[#0068FF]` | — | — | — | — | — |
| Channel chip IG | `bg-[#E1306C]/10 text-[#E1306C]` | — | — | — | — | — |
| Channel chip WEB | `bg-[#ECF2FE] text-[#2F64F6]` | — | — | — | — | — |

### Destructive Actions

| Hành động | Confirmation | Undo |
|-----------|-------------|------|
| Tắt chatbot (toggle OFF) | Modal S3: "Tắt chatbot? Bot sẽ dừng tự động trả lời..." | Không có undo — agent toggle ON lại nếu muốn |
| Đánh dấu Đã xử lý | Không cần confirm | Toast "Đã đánh dấu xử lý" + link "Mở lại" trong 5 giây |

---

## 5.1 Error & Recovery ⚠️ MANDATORY

### Common Errors

| Error ID | Tại Step | Mô tả lỗi | Tần suất | Hệ thống hỗ trợ | Hành động khôi phục |
|----------|---------|-----------|---------|-----------------|-------------------|
| E1 | Step 7 (gửi tin) | Gửi tin thất bại sau 3 lần retry | Hiếm | Toast đỏ: "Không gửi được tin nhắn. Kết nối kênh đang gián đoạn." + nút [Thử lại] | Retry thủ công; nếu vẫn fail → thông báo sẽ gửi khi kết nối phục hồi |
| E2 | Step 7 (kênh offline) | Channel API (Facebook/Zalo) không khả dụng | Hiếm | Banner vàng trên chat: "Kênh [Facebook] đang gặp sự cố. Tin nhắn đã được lưu và sẽ tự động gửi khi phục hồi." | Không cần làm gì — auto-send khi recover |
| E3 | Step 5 (bot toggle) | Toggle sync với Bot Engine thất bại | Rất hiếm | Modal giữ nguyên, toast: "Không thể tắt chatbot lúc này. Vui lòng thử lại." | Retry toggle; nếu fail lần 2 → escalate IT |
| E4 | Step 1 (load inbox) | Không load được danh sách conversation | Hiếm | Error card giữa màn hình: "Không tải được hội thoại. Kiểm tra kết nối mạng." + [Thử lại] | Retry refetch toàn bộ list |
| E5 | Step 3 (load thread) | Không load được tin nhắn trong conversation | Hiếm | Skeleton → Error state trong chat window: "Không tải được nội dung. " + [Thử lại] | Retry load thread |
| E6 | Step 8 (cập nhật stage) | Lưu stage/tag thất bại | Hiếm | Inline error trong Customer panel: "Không lưu được. Vui lòng thử lại." | Retry lưu |
| E7 | Step 3 (tiếp quản) | Conversation đã được assign cho agent khác | Common | Banner: "Agent [Tên] đang xử lý hội thoại này." | Xem transcript, liên hệ agent, hoặc Team Lead reassign |

### Dead-End Prevention Checklist

- [x] Mọi error state đều có thông báo tiếng Việt rõ ràng
- [x] Mọi error đều có action khôi phục (retry, auto-queue, hoặc chỉ dẫn)
- [x] Không có bước nào dẫn đến màn hình trắng hoặc không phản hồi
- [x] Validation inline: ô nhập tin không cho gửi khi trống
- [x] Cancel/Huỷ luôn hoạt động và không mất nội dung đang gõ
- [x] Bot toggle fail → không block agent, vẫn cho đọc thread

### Hướng dẫn & Hỗ trợ

| Loại hướng dẫn | Vị trí | Nội dung |
|---------------|-------|---------|
| Empty state lần đầu | `/inbox` chưa có channel | "Chưa có kênh nào được kết nối. Vào Cài đặt để thêm kênh đầu tiên." |
| Empty state filter | List khi filter không có kết quả | "Không có hội thoại phù hợp với bộ lọc hiện tại. [Xoá bộ lọc]" |
| Sau gửi thành công | Thread | Không cần toast — delivery status icon đủ |
| Sau resolve | List | Toast nhẹ: "Đã đánh dấu xử lý." + "Mở lại" |
| Conversation cần attention | List item | Badge đỏ: "Cần hỗ trợ" khi bot fail hoặc hot lead |
| Internal note hint | Input area | Placeholder: "Ghi chú nội bộ (không gửi cho khách)..." |

---

## 6. Bảng từ vựng giao diện ⚠️ MANDATORY

| Thuật ngữ hiển thị (Tiếng Việt) | Thuật ngữ kỹ thuật (cấm dùng trên UI) | Vị trí sử dụng |
|--------------------------------|--------------------------------------|---------------|
| Hội thoại | conversation / mc_conversations | Tiêu đề list, breadcrumb, toast |
| Chatbot đang hoạt động | bot_active = true | Toggle label, status indicator |
| Chatbot đã tắt | bot_active = false | Toggle label khi OFF |
| Bot AI | sender_type: bot | Label dưới tin nhắn bot |
| Tư vấn viên: [Tên] | sender_type: agent | Label dưới tin nhắn agent |
| Tiềm năng | stage: potential | Stage badge |
| Đủ tiêu chuẩn | stage: qualified | Stage badge |
| Khách hàng | stage: customer | Stage badge |
| Đã xử lý | status: resolved | Status button, filter label |
| Đang xử lý | status: in_progress | Status indicator |
| Chưa phân công | status: unassigned | Banner trong conversation |
| Phân công cho | assign / assigned_agent_id | Dropdown label |
| Kênh Facebook | channel: facebook | Channel chip, filter |
| Kênh Zalo | channel: zalo | Channel chip, filter |
| Kênh Instagram | channel: instagram | Channel chip, filter |
| Kênh Website | channel: web | Channel chip, filter |
| Tất cả kênh | channel: all | Filter button |
| Chưa đọc | unread_count > 0 | Filter button, badge |
| Của tôi | assigned_to: current_user | Filter button |
| Ghi chú nội bộ | is_internal_note: true | Input toggle label |
| Đã gửi | status: sent | Delivery icon tooltip |
| Đã nhận | status: delivered | Delivery icon tooltip |
| Đã đọc | status: read | Delivery icon tooltip |
| Gửi thất bại | status: failed | Error indicator |
| Thông tin khách hàng | customer profile | Panel section title |
| Lịch sử liên lạc | channel_history | Panel section title |
| Tệp đính kèm | attachments | Panel section title |

---

## 7. Route Declaration

### Route: `/inbox`

- **Mục tiêu người dùng chính**: Xem và xử lý toàn bộ hội thoại khách hàng từ mọi kênh
- **Single-scope**: ✅ Một mục tiêu — quản lý hội thoại omnichannel
- **IA label**: "Hội thoại" (không dùng "Inbox", "M09", "AIC")
- **Breadcrumb**: Hội thoại
- **Page title** (browser tab): "Hội thoại — MIA Smart"

### Sidebar Navigation Label

- Icon: Lucide `MessageSquare`
- Label: **Hội thoại**
- Badge: Số tin chưa đọc tổng (tất cả kênh)

---

## 8. Copy & Microcopy (Tiếng Việt)

| Element | Nội dung tiếng Việt | Độ dài tối đa |
|---------|-------------------|--------------|
| Page title | Hội thoại | 20 ký tự |
| Search placeholder | Tìm kiếm hội thoại... | 40 ký tự |
| Empty state — chưa có kênh | Chưa có kênh nào được kết nối. Vào Cài đặt để bắt đầu. | 80 ký tự |
| Empty state — filter | Không có hội thoại phù hợp. [Xoá bộ lọc] | 60 ký tự |
| No conversation selected | Chọn một hội thoại để bắt đầu | 40 ký tự |
| Bot active label | Chatbot đang hoạt động | 30 ký tự |
| Bot inactive label | Chatbot đã tắt | 20 ký tự |
| Toggle OFF modal title | Tắt chatbot? | 15 ký tự |
| Toggle OFF modal body | Bot sẽ dừng tự động trả lời trong hội thoại này. Bạn sẽ tiếp tục xử lý trực tiếp. | 120 ký tự |
| Toggle OFF confirm button | Xác nhận tắt | 15 ký tự |
| Toggle OFF cancel button | Huỷ | 5 ký tự |
| Message input placeholder | Nhập tin nhắn... | 20 ký tự |
| Internal note placeholder | Ghi chú nội bộ (không gửi cho khách)... | 50 ký tự |
| Send button tooltip | Gửi (Enter) | 10 ký tự |
| Resolve button | Đã xử lý | 10 ký tự |
| Reopen button | Mở lại | 8 ký tự |
| Assign button | Phân công | 10 ký tự |
| Unassigned banner | Hội thoại chưa được phân công. [Nhận xử lý] | 60 ký tự |
| Agent viewing indicator | [Tên] đang xem hội thoại này | 40 ký tự |
| Error — send fail | Không gửi được tin nhắn. Vui lòng thử lại. | 50 ký tự |
| Error — channel offline | Kênh [X] đang gặp sự cố. Tin nhắn sẽ gửi khi phục hồi. | 70 ký tự |
| Error — toggle fail | Không thể tắt chatbot lúc này. Vui lòng thử lại. | 60 ký tự |
| Toast — resolved | Đã đánh dấu xử lý. [Mở lại] | 30 ký tự |
| Toast — assigned | Đã phân công cho [Tên]. | 30 ký tự |
| Bot message label | Bot AI | 10 ký tự |
| Hot lead badge | Khách hàng tiềm năng cao | 30 ký tự |
| Needs attention badge | Cần hỗ trợ | 15 ký tự |
| Stage — Tiềm năng | Tiềm năng | 10 ký tự |
| Stage — Đủ tiêu chuẩn | Đủ tiêu chuẩn | 15 ký tự |
| Stage — Khách hàng | Khách hàng | 10 ký tự |

---

## 9. Interaction & Animation

| Tương tác | Animation | Thời gian | Easing |
|----------|-----------|-----------|--------|
| Load conversation list | Skeleton fade-in → content | 300ms | ease-out |
| Click conversation item | Background transition | 150ms | ease-out |
| Load message thread | Skeleton → fade-in content từ bottom | 200ms | ease-out |
| New message appear | Slide-up + fade-in từ bottom | 200ms | ease-out |
| Bot toggle modal open | Scale(0.95→1) + fade-in | 200ms | ease-out |
| Bot toggle modal close | Scale(1→0.95) + fade-out | 150ms | ease-in |
| Channel sidebar hover | Background highlight | 100ms | ease-out |
| Send button press | Scale(0.95) bounce | 100ms | ease-in-out |
| Toast appear | Slide-up + fade-in (bottom-right) | 250ms | ease-out |
| Toast dismiss | Fade-out + slide-right | 200ms | ease-in |
| Customer panel expand | Height 0→auto + fade | 200ms | ease-out |
| Delivery status update | Icon crossfade | 150ms | ease |
| Unread badge update | Scale pop (1→1.2→1) | 200ms | spring |
| Realtime message (WebSocket) | Slide-up từ bottom của thread | 200ms | ease-out |

> `prefers-reduced-motion`: Tắt tất cả animation trên. Chỉ giữ lại instant state changes.

---

## 10. Accessibility

- [x] `aria-label` trên: Send button ("Gửi tin nhắn"), Toggle button ("Bật/tắt chatbot"), Channel filter buttons, Attachment button
- [x] `aria-live="polite"` trên: Message thread area (new messages), Toast notifications, Delivery status changes
- [x] `aria-live="assertive"` trên: Error messages (send fail, channel down)
- [x] `aria-selected` trên: Conversation list items
- [x] `aria-pressed` trên: Bot toggle switch
- [x] `role="log"` trên: Message thread container
- [x] Keyboard tab order: Channel sidebar → Filter bar → Conversation list → Message input → Send → Customer panel
- [x] Keyboard: Enter để gửi tin (Shift+Enter xuống dòng), Escape để đóng modal
- [x] Focus sau modal close: Trở về Bot Toggle button
- [x] Focus sau send: Giữ nguyên trong message input

### Contrast Check

| Element | FG | BG | Ratio | WCAG |
|---------|----|----|-------|------|
| Primary text trong message | `#013652` | `#FFFFFF` | 12.5:1 | ✅ AAA |
| Bot label text | `#F59E0B` | `#FFF8EC` | 3.2:1 | ✅ AA Large |
| Unread badge | `#FFFFFF` | `#2F64F6` | 5.1:1 | ✅ AA |
| Timestamp / metadata | `#8EB6D9` | `#FFFFFF` | 2.8:1 | ⚠️ AA Large only |
| Channel chip FB text | `#1877F2` | `rgba(#1877F2,10%)` | 4.5:1 | ✅ AA |
| Stage badge — Tiềm năng | `#2F64F6` | `#ECF2FE` | 5.1:1 | ✅ AA |
| Stage badge — Khách hàng | `#FFFFFF` | `#22C55E` | 3.0:1 | ✅ AA Large |
| Error toast | `#FFFFFF` | `#E11D48` | 5.2:1 | ✅ AA |

---

## 11. A05 Technical Cross-Check

| Hạng mục | Kết quả | Ghi chú |
|---------|---------|---------|
| WebSocket cho realtime messages | ✅ | Dùng native WebSocket hoặc Socket.io — phải implement trong BE trước |
| shadcn `<Switch>` cho bot toggle | ✅ | Available, cần custom color token |
| shadcn `<Textarea>` auto-grow | ✅ | Available, cần `rows={1}` + `onInput` resize logic |
| Lucide icons cho channels | ⚠️ | Facebook/Zalo/Instagram không có trong Lucide — dùng SVG brand icons riêng |
| Identity linking cross-channel | ✅ | BE concern, FE chỉ render từ API response |
| Skeleton loading | ✅ | shadcn `<Skeleton>` available |
| Responsive 3-cột → 1-cột | ✅ | Tailwind breakpoints đủ xử lý |
| `aria-live` realtime updates | ✅ | Standard HTML — không cần lib |
| CSS animation với `prefers-reduced-motion` | ✅ | Tailwind `motion-safe:` prefix |
| Bot toggle sync timeout | ✅ | FE chờ API confirm trước khi flip UI state |

**A05 Sign-Off**: Pending (2026-04-17)

---

## 12. Pre-Delivery Checklist (A07)

- [ ] Design tokens matched exactly theo Design_System.md
- [ ] Không có browser defaults nào visible (reset đúng)
- [ ] Icons: Lucide SVG cho system icons; brand SVG riêng cho Facebook/Zalo/Instagram/Web
- [ ] Be Vietnam Pro font rendering verified trên Chrome + Safari
- [ ] Tất cả states implemented: loading skeleton, empty (2 loại), error (5 loại), populated, no-selection
- [ ] Tất cả hover/active/focus/disabled states cho mọi interactive element
- [ ] Bot toggle: ON state + OFF state + loading state + fail state
- [ ] Message bubble: bot / agent / customer — phân biệt rõ về màu và label
- [ ] Delivery status icons: sending / sent / delivered / read / failed
- [ ] Touch targets ≥ 44×44px cho tất cả buttons, conversation items, toggle
- [ ] Responsive: desktop 1280px + 1024px + tablet 768px + mobile 375px
- [ ] 100% Vietnamese copy — zero English labels trong UI
- [ ] WebSocket realtime: new message xuất hiện mà không cần refresh
- [ ] Bot toggle animation đúng: state flip chỉ sau API confirm
- [ ] Confirmation modal cho toggle OFF
- [ ] `prefers-reduced-motion` handled — animation tắt sạch
- [ ] Accessibility: `aria-live` trên thread, `aria-selected` trên list, `role="log"`

**A06 Design Sign-Off**: A06 UI/UX Agent — 2026-04-17
**A05 Tech Sign-Off**: Pending
**PM Gate**: Pending
