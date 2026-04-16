# UXUI Feature Spec: F-M09-AIC-001 Internal AI Chat

**Feature ID**: F-M09-AIC-001
**Status**: Approved
**Status**: Approved
**Owner**: A06 UI/UX Agent
**Implementation Reviewer**: A05 Tech Lead
**Implemented By**: A07 FE Builder
**Product**: MIA Smart
**Design System Reference**: [`Design/Design_System.md`](../Design_System.md)
**Save to**: `Design/UXUI_Features/UXUI-F-M09-AIC-001_Internal_AI_Chat.md`
**Date**: 2026-04-16
**Last Updated By**: Codex CLI (GPT-5.4 Codex environment)
**Last Reviewed By**: A01 PM Agent
**Approval Required**: PM Agent
**Approved By**: A01 PM Agent - FE Preview scope only
**Last Status Change**: 2026-04-16
**Source of Truth**: This document for `F-M09-AIC-001` UXUI and FE Preview visual/interaction contract
**Blocking Reason**: -

> **Precondition Resolved**: Linked SRS `F-M09-AIC-001` hiện ở `SRS Ready`; spec này là visual/interaction authority cho FE Preview bằng mock/stub data. BE/integration thật vẫn cần Integration Spec trước khi promote SRS lên `Build Ready`.

---

## §0. User & Task

### Target User Role(s)

| Role                    | Mô tả                         | Context                                                     |
| ----------------------- | ----------------------------- | ----------------------------------------------------------- |
| CSKH                    | Nhân viên chăm sóc khách hàng | Đang xử lý yêu cầu khách, cần tra policy/order nhanh        |
| Sales                   | Nhân viên bán hàng            | Cần biết tồn kho, CTKM, giá để tư vấn khách trực tiếp       |
| Ops / Store Lead        | Quản lý vận hành cửa hàng     | Cần xác nhận SOP, policy nội bộ, trạng thái vận hành        |
| Ecommerce / Omnichannel | Nhân viên kênh online         | Cần tra đơn online, policy giao hàng, channel context       |
| Ban điều hành           | Quản lý cấp cao               | Cần tóm tắt cross-domain nhanh, không cần mở nhiều hệ thống |

### Primary Task Objective

> Nhân viên nội bộ hỏi MIABOS bằng ngôn ngữ tự nhiên và nhận câu trả lời có nguồn, freshness, warning rõ trong **≤ 4 giây** — không cần mở SAP B1, KiotViet, hay Haravan.

### Success Metric

| Metric                                   | Target                   | Cách đo                                                               |
| ---------------------------------------- | ------------------------ | --------------------------------------------------------------------- |
| Thời gian nhận answer đầu tiên           | ≤ 4s cho 95% queries     | Đo từ lúc submit đến khi answer card render                           |
| Task completion (tìm được thông tin cần) | ≥ 80% không cần escalate | Tỉ lệ session không tạo escalation                                    |
| Số bước để đọc answer                    | ≤ 2 clicks               | Submit → đọc answer card (không cần mở source trace để hiểu kết luận) |

### Failure Indicators

- User phải hỏi lại cùng câu hỏi nhiều lần
- User không hiểu answer là `Policy`, `Data` hay `Mixed` mà không cần đọc kỹ
- User thoát chat và gọi điện/nhắn tin đồng nghiệp thay vì dùng tool
- Màn hình blank hoặc spinner không có thông báo sau khi submit

---

## 1. Feature Overview

### Purpose

Cung cấp chat nội bộ AI cho nhân viên BQ để tra cứu thông tin từ nhiều nguồn (SAP B1, KiotViet, Haravan, Knowledge Center) qua một interface thống nhất, với answer card có cấu trúc rõ, trust layer hiển thị, và không để user bị dead-end.

### User Persona

Nhân viên nội bộ Giày BQ — đang làm việc, cần tra cứu nhanh, không có thời gian học tool phức tạp.

### User Story

```
Là nhân viên nội bộ Giày BQ,
Tôi muốn hỏi MIABOS bằng tiếng Việt thông thường
và nhận câu trả lời có nguồn rõ, freshness, và hướng xử lý tiếp theo,
Để tôi không phải mở nhiều hệ thống hoặc hỏi nhiều người cho cùng một thông tin.
```

### Linked Artifacts

| Artifact    | Location                                                                                                                                                                                                       | Status    |
| ----------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | --------- |
| Feature SRS | [`Analysis/Features/Modules/AI_Workspace/Internal_AI_Chat/SRS/F-M09-AIC-001_Internal_AI_Chat_SRS.md`](../../Analysis/Features/Modules/AI_Workspace/Internal_AI_Chat/SRS/F-M09-AIC-001_Internal_AI_Chat_SRS.md) | SRS Ready |

---

## 2. Screen Inventory

| #   | Tên màn hình          | Route          | Mục đích                                        | Mockup                                               |
| --- | --------------------- | -------------- | ----------------------------------------------- | ---------------------------------------------------- |
| S1  | Chat Shell (Main)     | `/ai/chat`     | Giao diện chat chính — nhập câu hỏi, đọc answer | `Design/Mockups/F-M09-AIC-001_S1_Chat_Shell.png`     |
| S2  | Answer Card — Policy  | trong S1       | Trả lời câu hỏi thuần policy/SOP                | `Design/Mockups/F-M09-AIC-001_S2_Answer_Policy.png`  |
| S3  | Answer Card — Data    | trong S1       | Trả lời câu hỏi thuần data (tồn kho, đơn hàng…) | `Design/Mockups/F-M09-AIC-001_S3_Answer_Data.png`    |
| S4  | Answer Card — Mixed   | trong S1       | Trả lời câu hỏi kết hợp data + policy           | `Design/Mockups/F-M09-AIC-001_S4_Answer_Mixed.png`   |
| S5  | Answer Card — Blocked | trong S1       | Answer bị chặn do permission/policy/trust       | `Design/Mockups/F-M09-AIC-001_S5_Answer_Blocked.png` |
| S6  | Source Trace Panel    | slide-in từ S1 | Chi tiết nguồn, freshness, citation             | `Design/Mockups/F-M09-AIC-001_S6_Source_Trace.png`   |

---

## 2.1 Task Flow

### Primary Task Flow — Hỏi và nhận answer

| Step | Hành động của User                                     | Phản hồi của Hệ thống                                                                            | Field hiển thị                                                  | Ghi chú                       |
| ---- | ------------------------------------------------------ | ------------------------------------------------------------------------------------------------ | --------------------------------------------------------------- | ----------------------------- |
| 1    | Mở `/ai/chat`                                          | Hiển thị Chat Shell với lịch sử session (nếu có) hoặc empty state                                | Chat input + welcome message                                    | Entry point                   |
| 2    | Gõ câu hỏi vào Floating Dock, nhấn Enter hoặc nút Send | Hiển thị bubble câu hỏi của user, spinner "Đang phân tích..."                                    | Question bubble                                                 | Instant feedback              |
| 3    | —                                                      | Hệ thống phân loại intent (`Policy` / `Data` / `Mixed` / `Unsupported`) và chạy access check M07 | —                                                               | Backend, user thấy spinner    |
| 4    | —                                                      | Render Answer Card theo loại (S2/S3/S4/S5)                                                       | Kết luận, type badge, freshness, warning (nếu có), next actions | Answer phải render trong ≤ 4s |
| 5    | Đọc answer, tùy chọn mở Source Trace                   | Slide-in Source Trace Panel (S6)                                                                 | Citation list, freshness per source, trust level                | Optional                      |
| 6    | Chọn Next Action (escalate, hỏi tiếp, gửi feedback)    | Tạo escalation / mở input mới / ghi nhận feedback                                                | —                                                               | Task complete hoặc continue   |

### Decision Points & Branching

| Tại bước | Điều kiện              | Rẽ sang                                                          |
| -------- | ---------------------- | ---------------------------------------------------------------- |
| Step 3   | Access check M07 fail  | Render Answer Card Blocked (S5)                                  |
| Step 3   | Intent = `Unsupported` | Render Blocked với lý do "Ngoài phạm vi hỗ trợ" + escalation CTA |
| Step 3   | Intent confidence thấp | Render follow-up question thay vì answer                         |
| Step 4   | Source stale/conflict  | Render answer với Warning Badge rõ ràng                          |

### Progressive Disclosure Rules

- **Luôn hiển thị**: Kết luận, Answer Type Badge, Freshness, Next Actions
- **Hiển thị khi có**: Warning Badge (chỉ khi có warning)
- **Ẩn sau click**: Source Trace chi tiết (citation, raw freshness per source)
- **Ẩn sau "Xem thêm"**: Evidence/bằng chứng chi tiết dài

---

## 3. Visual Specification

### Screen S1: Chat Shell

#### Layout (ASCII Wireframe)

```
┌──────────────────────────────────────────────────────────┐
│ TopBar (64px, glassmorphism, sticky)                     │
├───────────────┬──────────────────────────────────────────┤
│               │  Label: "AI Workspace"  (#3A6381, 11px)  │
│   Sidebar     │  H1: "Chat Nội Bộ"     (#013652, 24px)   │
│   (240px)     │                                          │
│  bg:#ECF4FF   │  ┌────────────────────────────────────┐  │
│               │  │ Message Thread (scroll)             │  │
│               │  │                                     │  │
│               │  │  [Bubble: User question]            │  │
│               │  │                                     │  │
│               │  │  [Answer Card]                      │  │
│               │  │                                     │  │
│               │  │  [Bubble: User question 2]          │  │
│               │  │                                     │  │
│               │  │  [Answer Card 2]                    │  │
│               │  └────────────────────────────────────┘  │
│               │                                          │
│               │  [Floating Dock — bottom center]         │
└───────────────┴──────────────────────────────────────────┘
```

#### Component Breakdown

| Component      | Design Token                                                            | shadcn/ui Mapping | Ghi chú                         |
| -------------- | ----------------------------------------------------------------------- | ----------------- | ------------------------------- |
| Page bg        | `bg-[#F6F9FF]`                                                          | —                 | Cool Slate Foundation           |
| Sidebar        | `bg-[#ECF4FF]`                                                          | —                 | No border-right                 |
| TopBar         | `bg-white/85 backdrop-blur-xl`                                          | —                 | Glassmorphism                   |
| Page Label     | `text-[11px] font-medium text-[#3A6381]`                                | `<p>`             | Intentional Gap Rule            |
| Page Title     | `text-[24px] font-bold text-[#013652]`                                  | `<h1>`            |                                 |
| Message Thread | `bg-[#F6F9FF]`                                                          | `ScrollArea`      | Full height minus TopBar + Dock |
| User Bubble    | `bg-[#2F64F6] text-white rounded-[12px] rounded-br-[4px]`               | —                 | Right-aligned                   |
| Floating Dock  | `fixed bottom-6 bg-white/80 backdrop-blur-xl rounded-full shadow-glass` | —                 | Xem Design_System §2.7          |

#### Design Token Values

| Element            | Property        | Token / Value                                       |
| ------------------ | --------------- | --------------------------------------------------- |
| Page background    | `background`    | `#F6F9FF`                                           |
| Sidebar background | `background`    | `#ECF4FF`                                           |
| Card background    | `background`    | `#FFFFFF`                                           |
| Card radius        | `border-radius` | `16px` (rounded-2xl)                                |
| Card shadow        | `box-shadow`    | `shadow-ambient` (`0 12px 24px rgba(1,54,82,0.04)`) |
| Card padding       | `padding`       | `24px` (p-6)                                        |
| User bubble bg     | `background`    | `#2F64F6`                                           |
| User bubble text   | `color`         | `#FFFFFF`                                           |
| System bubble bg   | `background`    | `#ECF4FF`                                           |
| System bubble text | `color`         | `#013652`                                           |

#### Responsive Behavior

| Breakpoint          | Thay đổi                                                      |
| ------------------- | ------------------------------------------------------------- |
| Desktop (≥1024px)   | Layout đầy đủ như wireframe, Sidebar 240px                    |
| Tablet (768–1023px) | Sidebar collapsed 64px, Floating Dock max-w giảm              |
| Mobile (<768px)     | Sidebar ẩn (drawer), Floating Dock full-width với margin 12px |

---

### Screen S2 / S3 / S4: Answer Card (3 loại)

#### Answer Card — Anatomy chung

```
┌─────────────────────────────────────────────┐
│ [Type Badge]  [Freshness Chip]  [Warning?]  │  ← Header row
├─────────────────────────────────────────────┤
│ Kết luận (H3, bold, #013652)                │  ← Luôn đầu tiên
│                                             │
│ [Khối Data]     ← chỉ có ở Data/Mixed       │
│  • Điểm dữ liệu 1: Giá trị                 │
│  • Điểm dữ liệu 2: Giá trị                 │
│                                             │
│ [Khối Policy]   ← chỉ có ở Policy/Mixed     │
│  • Citation 1 (link mở Source Trace)       │
│  • Citation 2                              │
├─────────────────────────────────────────────┤
│ [Nút: Xem nguồn] [Nút: Escalate] [Hữu ích] │  ← Actions row
│ [Nút: Chưa đúng]                            │
└─────────────────────────────────────────────┘
```

#### Type Badge Spec

| Loại Answer           | Badge Label     | Badge Color                      | Tailwind                       |
| --------------------- | --------------- | -------------------------------- | ------------------------------ |
| Policy                | `Chính sách`    | `#8B5CF6` bg-light, text purple  | `bg-purple-50 text-purple-700` |
| Data                  | `Dữ liệu`       | `#2F64F6` bg-light, text primary | `bg-[#ECF2FE] text-[#2F64F6]`  |
| Mixed                 | `Kết hợp`       | `#F59E0B` bg-light, text amber   | `bg-amber-50 text-amber-700`   |
| Unsupported / Blocked | `Ngoài phạm vi` | `#E11D48` bg-light, text error   | `bg-red-50 text-[#E11D48]`     |

#### Freshness Chip Spec

| Trạng thái          | Label                   | Màu            | Icon     |
| ------------------- | ----------------------- | -------------- | -------- |
| Fresh (< threshold) | `Cập nhật X phút trước` | `#22C55E` text | ✓ circle |
| Stale (> threshold) | `Dữ liệu có thể cũ`     | `#F59E0B` text | ⚠        |
| Conflict            | `Nguồn mâu thuẫn`       | `#E11D48` text | ✗        |

#### Warning Badge Spec

Chỉ render khi có warning từ API. Hiển thị inline ngay dưới Type Badge:

```tsx
<div className="flex items-start gap-2 rounded-xl bg-amber-50 px-4 py-3 text-sm text-amber-700">
  <AlertTriangle size={16} className="mt-0.5 shrink-0" />
  <span>{warning.message}</span>
</div>
```

#### Mixed Answer — Tách 2 khối rõ ràng

```
┌────────────────────────────────────────────────┐
│ [Badge: Kết hợp]  [Freshness]  [Warning nếu có]│
├────────────────────────────────────────────────┤
│ Kết luận tổng hợp                              │
├───────────────────┬────────────────────────────┤
│ [Icon: Data]      │ [Icon: Policy]             │
│ Dữ liệu hiện tại   │ Chính sách áp dụng         │
│ • SKU còn: X      │ • Policy đổi trả: ...     │
│ • Giá: Y          │ • Source: M08/FAQ-003      │
└───────────────────┴────────────────────────────┘
│ [Xem nguồn]  [Escalate]  [Hữu ích]  [Chưa đúng] │
└────────────────────────────────────────────────┘
```

Hai khối dùng `grid grid-cols-2 gap-4` trên desktop, stack trên mobile.

#### Design Token Values — Answer Card

| Element                   | Property             | Token / Value                         |
| ------------------------- | -------------------- | ------------------------------------- |
| Card bg                   | `background`         | `#FFFFFF`                             |
| Card radius               | `border-radius`      | `16px`                                |
| Card shadow               | `box-shadow`         | `shadow-ambient`                      |
| Card padding              | `padding`            | `20px` (p-5)                          |
| Kết luận text             | `font-size / weight` | `16px / 600` (H3)                     |
| Evidence text             | `font-size`          | `14px / 400` (Body)                   |
| Citation text             | `font-size`          | `13px / 400` (Mono)                   |
| Action buttons            | `variant`            | Ghost pill, `#2F64F6`                 |
| Divider giữa 2 khối Mixed | `border`             | Ghost border `rgba(142,182,217,0.15)` |

---

### Screen S5: Answer Card — Blocked

```
┌─────────────────────────────────────────────┐
│ [Badge: Ngoài phạm vi / Không đủ quyền]     │
├─────────────────────────────────────────────┤
│ [Icon: Lock]  Không thể hiển thị thông tin này │  ← H3, #013652
│                                             │
│  Lý do: [lý do rõ ràng bằng tiếng Việt]    │  ← Body, #3A6381
│  VD: "Bạn không có quyền xem dữ liệu        │
│        giá nội bộ của kho trung tâm"         │
│                                             │
│  Bạn có thể:                                │
│  → [Liên hệ quản lý để được cấp quyền]     │  ← Ghost button
│  → [Tạo yêu cầu hỗ trợ]                   │  ← Primary button
└─────────────────────────────────────────────┘
```

**Quy tắc bắt buộc:**

- Không dùng thuật ngữ kỹ thuật (`permission denied`, `403`, `M07 blocked`)
- Luôn có ít nhất 1 next action — không để user dead-end
- Icon dùng Lucide `Lock` (không dùng emoji)

---

### Screen S6: Source Trace Panel (Slide-in)

```
┌───────────────────────────────────────┐
│ ← Quay lại   Nguồn trả lời           │  ← Header
├───────────────────────────────────────┤
│ Nguồn 1: M08 / FAQ-Policy-003         │
│   Freshness: Cập nhật 2 giờ trước    │
│   Trust: ✓ Canonical                  │
│   Trích dẫn: "Khách được đổi trong   │
│   30 ngày nếu..."                     │
├───────────────────────────────────────┤
│ Nguồn 2: KiotViet / Store-HCM-01      │
│   Freshness: ⚠ Cập nhật 4 giờ trước  │
│   Trust: Operational source           │
│   Dữ liệu: Tồn kho: 12 đôi           │
└───────────────────────────────────────┘
```

- Width: `360px` (desktop), full-width (mobile)
- Animation: slide-in từ phải, `250ms ease-out`
- Background: `#FFFFFF` card, `shadow-glass`
- Mỗi source là 1 card riêng với `rounded-xl shadow-ambient p-4`
- Source Trace data phải đi từ `POST /mia/chat/query` response snapshot; `GET /mia/chat/suggestions/:id` chỉ dùng cho follow-up prompts / clarifying prompts.

---

## 4. Data Binding

| UI Element          | API Endpoint                    | Field                      | Format                                             | Ghi chú                                               |
| ------------------- | ------------------------------- | -------------------------- | -------------------------------------------------- | ----------------------------------------------------- |
| Answer Type Badge   | `POST /mia/chat/query`          | `answer_type`              | `"Policy"` \| `"Data"` \| `"Mixed"` \| `"Blocked"` |                                                       |
| Kết luận text       | `POST /mia/chat/query`          | `answer_summary`           | string                                             | Luôn render đầu tiên                                  |
| Data points         | `POST /mia/chat/query`          | `data_points[]`            | `{label, value, source}`                           | Chỉ render nếu `answer_type` là `Data` hoặc `Mixed`   |
| Citations           | `POST /mia/chat/query`          | `citations[]`              | `{doc_id, title, excerpt}`                         | Chỉ render nếu `answer_type` là `Policy` hoặc `Mixed` |
| Freshness chip      | `POST /mia/chat/query`          | `freshness_status`         | `"fresh"` \| `"stale"` \| `"conflict"`             |                                                       |
| Warning badge       | `POST /mia/chat/query`          | `warnings[]`               | `{code, message}`                                  | Chỉ render nếu `warnings.length > 0`                  |
| Next action buttons | `POST /mia/chat/query`          | `next_actions[]`           | `{label, type, payload}`                           |                                                       |
| Escalation CTA      | `POST /mia/chat/query`          | `escalation_available`     | boolean                                            | Chỉ render nếu `true`                                 |
| Source Trace list   | `GET /mia/chat/suggestions/:id` | `source_trace[]`           | `{source_id, freshness, trust_level, excerpt}`     | Lazy-load khi mở panel                                |
| Feedback            | `POST /mia/chat/feedback`       | `answer_id, feedback_type` | —                                                  | 👍 / 👎                                               |

---

## 5. State Matrix

### Page-Level States

| State                 | Trigger                        | Visual                                                         | Ghi chú                           |
| --------------------- | ------------------------------ | -------------------------------------------------------------- | --------------------------------- |
| **Loading**           | API in-flight sau submit       | Spinner trong Floating Dock + "Đang phân tích..." bubble từ AI | Hiện ngay sau submit              |
| **Empty**             | Session mới, chưa có message   | Welcome message + 3 suggested prompts                          | Prompts là gợi ý câu hỏi phổ biến |
| **Error**             | API error (không phải blocked) | Error card nhỏ: "Đã có lỗi xảy ra. Thử lại?" + Retry button    | Không xoá câu hỏi của user        |
| **Populated**         | Có messages trong session      | Thread hiển thị bình thường                                    | Default                           |
| **Source Trace Open** | User click "Xem nguồn"         | Slide-in panel che 1/3 phải màn hình                           | Overlay không block chat          |

### Component-Level States — Answer Card

| State                    | Default                         | Hover          | Focus                      | Loading        |
| ------------------------ | ------------------------------- | -------------- | -------------------------- | -------------- |
| Action buttons (Ghost)   | `text-[#2F64F6]` transparent bg | `bg-[#ECF2FE]` | `ring-2 ring-[#2F64F6]/30` | Spinner inline |
| Feedback buttons (👍 👎) | Outlined, `#8EB6D9`             | Scale 1.1      | Ring                       | —              |
| Citation link            | `text-[#2F64F6]` underline      | Opacity 0.8    | Ring                       | —              |
| "Xem nguồn" button       | Ghost pill                      | `bg-[#ECF2FE]` | Ring                       | —              |

### Destructive Actions

| Hành động        | Xác nhận                                       | Undo                           |
| ---------------- | ---------------------------------------------- | ------------------------------ |
| Xoá session chat | Dialog: "Bạn có muốn xoá hội thoại này không?" | Toast "Đã xoá" + "Hoàn tác" 5s |

---

## 5.1 Error & Recovery

### Common Errors

| Error ID | Tại bước | Mô tả                                 | Tần suất     | Hỗ trợ từ hệ thống                                                  | Hành động khôi phục                                          |
| -------- | -------- | ------------------------------------- | ------------ | ------------------------------------------------------------------- | ------------------------------------------------------------ |
| E1       | Step 3   | Access check fail (AIC-009)           | Thỉnh thoảng | Blocked card: "Bạn không có quyền xem thông tin này. Lý do: [X]"    | Ghost button "Liên hệ quản lý", Primary button "Tạo yêu cầu" |
| E2       | Step 3   | Intent không nhận dạng được (AIC-008) | Thỉnh thoảng | Follow-up question: "Bạn có thể mô tả rõ hơn về [X] không?"         | Input focus trở lại Floating Dock                            |
| E3       | Step 4   | Source stale/conflict (AIC-010)       | Thỉnh thoảng | Warning badge trong answer card + nút "Xem nguồn để biết thêm"      | Escalation CTA nếu `escalation_available = true`             |
| E4       | Step 4   | API timeout / general error (AIC-001) | Hiếm         | Error bubble: "Đã có lỗi. Câu hỏi của bạn chưa được xử lý." + Retry | Retry tự động 1 lần, sau đó hiện nút "Thử lại"               |

### Dead-End Prevention Checklist

- [x] Mọi Blocked state đều có ít nhất 1 next action (Escalate hoặc Liên hệ)
- [x] Mọi Error state đều có Retry hoặc hướng dẫn xử lý
- [x] Follow-up question khi low-confidence — không đoán sai
- [x] Floating Dock luôn enabled — user có thể hỏi tiếp bất kỳ lúc nào
- [x] Source Trace không block chat — slide-in overlay, không replace màn hình

### Guidance & Assistance

| Loại                | Nơi hiển thị              | Nội dung                                                                      |
| ------------------- | ------------------------- | ----------------------------------------------------------------------------- |
| Empty state prompts | Session mới               | "Hỏi về tồn kho hôm nay", "Chính sách đổi trả là gì?", "Đơn #XXX đang ở đâu?" |
| Contextual hint     | Dưới Warning badge        | "Dữ liệu từ KiotViet có thể chưa được cập nhật. Bấm 'Xem nguồn' để kiểm tra." |
| Post-action         | Sau escalation thành công | "Đã tạo yêu cầu hỗ trợ. Quản lý sẽ phản hồi sớm."                             |

---

## 6. Copy & Microcopy (Vietnamese)

| Element                | Nội dung tiếng Việt                                                    | Độ dài tối đa |
| ---------------------- | ---------------------------------------------------------------------- | ------------- |
| Page Title             | Trợ lý AI Nội Bộ                                                       | 30 ký tự      |
| Input placeholder      | Nhập câu hỏi của bạn...                                                | 40 ký tự      |
| AI thinking state      | Đang phân tích...                                                      | 20 ký tự      |
| Empty state title      | Xin chào! Tôi có thể giúp gì cho bạn?                                  | 50 ký tự      |
| Blocked title          | Không thể hiển thị thông tin này                                       | 50 ký tự      |
| Blocked subtitle       | [Lý do cụ thể, không dùng thuật ngữ kỹ thuật]                          | 100 ký tự     |
| Stale warning          | Dữ liệu có thể chưa được cập nhật mới nhất                             | 60 ký tự      |
| Conflict warning       | Các nguồn dữ liệu có kết quả khác nhau                                 | 60 ký tự      |
| Source trace CTA       | Xem nguồn                                                              | 15 ký tự      |
| Escalation CTA         | Tạo yêu cầu hỗ trợ                                                     | 25 ký tự      |
| Feedback positive      | Câu trả lời hữu ích                                                    | 25 ký tự      |
| Feedback negative      | Câu trả lời chưa đúng                                                  | 25 ký tự      |
| Error message          | Đã có lỗi xảy ra. Vui lòng thử lại.                                    | 50 ký tự      |
| Retry button           | Thử lại                                                                | 10 ký tự      |
| Delete session confirm | Bạn có muốn xoá hội thoại này không? Hành động này không thể hoàn tác. | 80 ký tự      |

---

## 7. Interaction & Animation

| Interaction           | Animation                          | Duration            | Easing      |
| --------------------- | ---------------------------------- | ------------------- | ----------- |
| Submit câu hỏi        | User bubble slide-in từ phải       | 200ms               | ease-out    |
| AI thinking           | 3-dot pulse trong bubble `#2F64F6` | 300ms stagger, loop | ease-in-out |
| Answer card appear    | Fade in + scale(0.97→1)            | 250ms               | ease-out    |
| Warning badge appear  | Fade in                            | 200ms               | ease-out    |
| Source Trace open     | Slide in từ phải                   | 250ms               | ease-out    |
| Source Trace close    | Slide out phải                     | 180ms               | ease-in     |
| Feedback button press | Scale(1→0.9→1)                     | 150ms               | ease-in-out |
| Page enter            | Fade in                            | 200ms               | ease-out    |

> `prefers-reduced-motion`: tắt tất cả animation, dùng instant transition.

---

## 8. Accessibility

- [ ] `aria-label="Gửi câu hỏi"` trên Send button (icon-only)
- [ ] `aria-label="Xem nguồn trả lời"` trên Source Trace button
- [ ] `aria-label="Câu trả lời hữu ích"` / `"Câu trả lời chưa đúng"` trên feedback buttons
- [ ] `aria-live="polite"` trên Message Thread (thông báo khi answer card mới xuất hiện)
- [ ] `role="alert"` trên Warning badge và Blocked card
- [ ] Keyboard: Tab từ Input → Send → Action buttons trong answer card mới nhất
- [ ] Focus sau khi đóng Source Trace Panel: trở về "Xem nguồn" button
- [ ] Floating Dock input: `aria-label="Nhập câu hỏi"`, `type="text"`

### Contrast Check

| Element            | FG        | BG        | Tỉ lệ dự kiến | Pass |
| ------------------ | --------- | --------- | ------------- | ---- |
| Kết luận text      | `#013652` | `#FFFFFF` | ~12:1         | ✓    |
| Body text          | `#3A6381` | `#FFFFFF` | ~5.5:1        | ✓    |
| User bubble text   | `#FFFFFF` | `#2F64F6` | ~4.8:1        | ✓    |
| System bubble text | `#013652` | `#ECF4FF` | ~9:1          | ✓    |
| Warning text       | `#B45309` | `#FFFBEB` | ~7:1          | ✓    |
| Blocked text       | `#E11D48` | `#FFF1F2` | ~5:1          | ✓    |

> **Cần verify thực tế** bằng DevTools contrast checker trước khi build.

---

## 9. A05 Technical Cross-Check

| Hạng mục                 | Kết quả | Ghi chú                                                 |
| ------------------------ | ------- | ------------------------------------------------------- |
| shadcn/ui mapping        | Pending | `ScrollArea`, `Sheet` (Source Trace), `Button`, `Input` |
| Token compatibility      | Pending | Tất cả tokens lấy từ `Design_System.md` canonical       |
| Animation practical      | Pending | Cần test glassmorphism performance trên mobile          |
| Responsive aligns        | Pending | Grid layout Mixed card cần kiểm tra 768px               |
| Data binding matches API | Pending | Cần verify `answer_type` enum với BE                    |
| Shared components        | Pending | Answer Card có thể share với M10 Sales Advisor          |

**A05 Review Note**: cross-check complete; linked SRS and planning chain exist; PNG gate removed per BO directive — FE build can proceed from spec text + data-binding contract
**A05 Sign-Off**: A05 Tech Lead (2026-04-16)

---

## 10. Pre-Delivery Checklist (A07)

- [ ] Design tokens khớp chính xác với `Design_System.md`
- [x] Linked FE Preview story is materialized in `Planning/Stories/AI_Workspace/`
- [x] Canonical UXUI status là `Approved` (PNG gate removed per BO directive 2026-04-16)
- [x] FE Preview canonical đã được mở — spike tại `/ai/chat` là canonical build
- [ ] Không có border cứng 1px trong layout — dùng background shift
- [ ] Buttons đều `rounded-full` (pill)
- [ ] Icons: Lucide SVG only (không emoji)
- [ ] Be Vietnam Pro font render đúng với dấu tiếng Việt
- [ ] Tất cả states: loading, empty, error, policy, data, mixed, blocked
- [ ] Hover / active / focus / disabled trên mọi interactive element
- [ ] Touch targets ≥ 44x44px
- [ ] Responsive: desktop + tablet + mobile
- [ ] 100% copy tiếng Việt
- [ ] `prefers-reduced-motion` handled
- [ ] Accessibility attributes đã gắn

**A06 Design Sign-Off**: **\_ (YYYY-MM-DD)
**A05 Tech Sign-Off**: \_** (YYYY-MM-DD)
**PM Gate**: \_\_\_ (YYYY-MM-DD)
