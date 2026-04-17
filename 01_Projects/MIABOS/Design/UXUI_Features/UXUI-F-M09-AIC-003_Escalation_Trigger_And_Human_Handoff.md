# UXUI Feature Spec: F-M09-AIC-003 Escalation Trigger and Human Handoff

**Feature ID**: F-M09-AIC-003
**Status**: Approved
**Owner**: A06 UI/UX Agent
**Implementation Reviewer**: A05 Tech Lead
**Implemented By**: A07 FE Builder
**Product**: MIA Smart / Platform
**Design System Reference**: [`Design/Design_System.md`](../Design_System.md)
**Save to**: `Design/UXUI_Features/UXUI-F-M09-AIC-003_Escalation_Trigger_And_Human_Handoff.md`
**Date**: 2026-04-16
**Last Updated By**: Claude Code (claude-sonnet-4-6)
**Last Reviewed By**: A06 UI/UX Agent · A05 Tech Lead · A01 PM Agent
**Approval Required**: PM Agent
**Approved By**: A01 PM Agent
**Last Status Change**: 2026-04-17
**Source of Truth**: This document for `F-M09-AIC-003` UXUI and FE Preview visual/interaction contract
**Blocking Reason**: -

> **Precondition Resolved**: Linked SRS `F-M09-AIC-003` đã ở `SRS Ready`; spec này là visual/interaction authority cho FE Preview bằng mock/stub data. BE/integration thật cần Integration Spec riêng trước khi promote lên `Build Ready`.

---

## §0. User & Task

### Target User Role(s)

| Role | Mô tả | Context |
|------|-------|---------|
| User nội bộ | Nhân viên sử dụng chatbot | Gặp câu trả lời chưa đủ, muốn có người hỗ trợ |
| CSKH Team Lead | Quản lý nhóm CSKH | Nhận và phân công escalation |
| PM Governance | Quản lý vận hành | Override routing, xem backlog unrouted |
| IT / ERP / Data | Kỹ thuật | Nhận escalation technical, source mismatch |
| Ecommerce / Omnichannel Lead | Quản lý kênh online | Nhận escalation liên quan đơn online |

### Primary Task Objective

> User trigger escalation và nhận confirmation về trạng thái routing trong **≤ 4 giây** — biết rõ ai hoặc đội nào sẽ xử lý tiếp, hoặc case đang ở trạng thái Unrouted.

### Success Metric

| Metric | Target | Cách đo |
|--------|--------|---------|
| Thời gian tạo escalation | ≤ 4s từ khi bấm CTA | Đo từ click đến hiển thị confirmation |
| Escalation trigger success rate | ≥ 95% không bị lỗi | Tỉ lệ trigger hoàn tất, trừ lỗi network |
| User hiểu Unrouted state | 100% nhìn thấy trạng thái rõ | Không để case biến mất không dấu vết |

### Failure Indicators

- User không rõ lý do vì sao AI đề xuất escalation
- Confirmation không nói rõ ai sẽ xử lý
- Case Unrouted nhưng không có thông báo rõ
- User bấm CTA nhưng không có gì xảy ra (silent fail)

---

## 1. Feature Overview

### Purpose

Cung cấp đường thoát rõ ràng khi AI không thể trả lời đủ tự tin: user hoặc hệ thống trigger escalation, đóng gói context đầy đủ, route tới đúng team, và xác nhận trạng thái. Không để conversation là dead-end.

### User Persona

User nội bộ gặp câu hỏi vượt scope AI — cần chắc chắn câu hỏi sẽ được người thật xử lý, không mất đi.

### User Story

```
Là nhân viên nội bộ Giày BQ đang dùng Internal AI Chat,
Tôi muốn trigger escalation khi AI không trả lời được
và nhận xác nhận rõ ràng về ai sẽ xử lý tiếp,
Để tôi không phải hỏi lại từ đầu và câu hỏi không bị bỏ sót.
```

### Linked Artifacts

| Artifact | Location | Status |
|----------|----------|--------|
| Feature SRS | [`Analysis/Features/Modules/AI_Workspace/Escalation_Trigger_And_Human_Handoff/SRS/F-M09-AIC-003_Escalation_Trigger_And_Human_Handoff_SRS.md`](../../Analysis/Features/Modules/AI_Workspace/Escalation_Trigger_And_Human_Handoff/SRS/F-M09-AIC-003_Escalation_Trigger_And_Human_Handoff_SRS.md) | SRS Ready |
| Parent SRS | `F-M09-AIC-001_Internal_AI_Chat_SRS.md` | SRS Ready |

---

## 2. Screen Inventory

| # | Screen Name | Route/Path | Purpose | Notes |
|---|-------------|-----------|---------|-------|
| S1 | Escalation CTA (trong Chat) | Component trong `/ai/chat` | Nút/CTA trigger escalation từ answer card | Inline trong S1 của AIC-001 |
| S2 | Escalation Confirmation Modal | Modal overlay | Xác nhận reason, preview payload, destination | Bước confirm trước submit |
| S3 | Escalation Detail | `/ai/chat/escalations/:id` | Xem status, assignment, resolution | Sau khi tạo |
| S4 | Unrouted State | State trong S3 | Case đã tạo nhưng chưa xác định owner | Error/pending state |
| S5 | Resolution Sync State | State trong S3 | Case đã được resolve, feedback về chat | Success state |

---

## 2.1 Task Flow

### Primary Task Flow — User trigger escalation thủ công

| Step | User Action | System Response | Field Visibility | Notes |
|------|------------|-----------------|-----------------|-------|
| 1 | Đọc answer card, thấy CTA "Cần người hỗ trợ" | CTA hiển thị với lý do AI gợi ý | Reason badge trên CTA | Entry point |
| 2 | Click CTA | Mở S2 Confirmation Modal | Reason (pre-filled), note field, preview "Sẽ gửi gì" | Confirm step |
| 3 | Review reason code và payload preview | Modal hiển thị rõ: reason, context tóm tắt, destination ước tính | Edit note nếu muốn | Transparency |
| 4 | Click "Xác nhận chuyển" | API tạo escalation; hiện loading briefly | — | Submit |
| 5 | Hệ thống route thành công | Modal đóng; hiện S3 với status `Assigned` + team name | Team, SLA estimate | Done |
| 5B | Routing fail | Modal đóng; hiện S3 với status `Unrouted` + message rõ | S4 Unrouted State | Alternate |

### Decision Points & Branching

| At Step | Condition | Branch To |
|---------|-----------|----------|
| Step 1 | Auto-trigger do AI confidence thấp | CTA xuất hiện tự động với reason = `Low Confidence` |
| Step 5 | Routing tìm thấy owner | S3 status `Assigned` |
| Step 5B | Routing không tìm thấy owner | S3 status `Unrouted` — S4 |
| Step 5 | Case được resolve | S5 Resolution Sync State |

### Progressive Disclosure Rules

- **Required**: Reason code — luôn hiển thị trên CTA và trong modal
- **Optional**: User note — hiện trong modal, không bắt buộc
- **Advanced**: Full payload detail (question, answer snapshot, warnings) — collapse trong modal, expand on click

---

## 3. Visual Specification (Per Screen)

### Screen S1: Escalation CTA (trong answer card)

#### Layout

```
┌─────────────────────────────────────────────────────────┐
│ Answer Card:                                             │
│ [Answer text...]                                         │
│ [Source trace]  [Warning chips]                          │
│                                                          │
│ ─────────────────────────────────────────────────────── │
│ ⚠ AI không chắc chắn về câu trả lời này                │
│ [🙋 Cần người hỗ trợ]   [Xem thêm gợi ý]               │
└─────────────────────────────────────────────────────────┘
```

#### Component

| Component | Design Token | Notes |
|-----------|-------------|-------|
| CTA button | Body 14px/600, --color-primary | Prominent — không dễ bỏ qua |
| Auto-trigger banner | Caption 12px/500, --color-warning-bg | Xuất hiện khi AI tự trigger |
| CTA section separator | 1px dashed --color-border | Tách phần escalation khỏi answer |

---

### Screen S2: Escalation Confirmation Modal

#### Layout (ASCII Wireframe)

```
┌─────────────────────────────────────────────────────────┐
│ "Chuyển câu hỏi đến người hỗ trợ"              [✕]     │
├─────────────────────────────────────────────────────────┤
│ Lý do chuyển:                                           │
│ ● AI không chắc chắn   ○ Ngoài phạm vi                 │
│ ○ Cần xác nhận nghiệp vụ   ○ Tôi muốn người thật       │
├─────────────────────────────────────────────────────────┤
│ Sẽ gửi kèm: [Expand để xem chi tiết ▼]                 │
│ • Câu hỏi gốc                                           │
│ • Câu trả lời AI (snapshot)                             │
│ • Nguồn và cảnh báo                                     │
├─────────────────────────────────────────────────────────┤
│ Ghi chú thêm (không bắt buộc):                         │
│ [Textarea: Mô tả thêm yêu cầu của bạn...]               │
├─────────────────────────────────────────────────────────┤
│ Dự kiến xử lý bởi: Nhóm CSKH                           │
│                    [Hủy]  [Xác nhận chuyển →]           │
└─────────────────────────────────────────────────────────┘
```

#### Component Breakdown

| Component | Design Token | Notes |
|-----------|-------------|-------|
| Modal container | --radius-lg (12px), --shadow-3 | Centered, max-w 560px |
| Reason radio group | Body 14px/500 | Pre-select reason từ AI signal |
| Payload preview | Body Small 13px/400, --color-bg-subtle | Collapse mặc định |
| Destination preview | Body 14px/600, --color-primary | Hiển thị team/domain ước tính |
| Confirm button | Body 14px/600, --color-primary | Active sau khi chọn reason |

#### Design Token Values

| Element | Property | Token / Value |
|---------|----------|---------------|
| Modal background | `background` | `--color-bg-card` (#FFFFFF) |
| Modal overlay | `background` | rgba(0,0,0,0.4) |
| Payload preview bg | `background` | `--color-bg-subtle` (#F8FAFC) |
| Confirm button | `background` | `--color-primary` (#1E40AF) |
| Border | `border` | 1px solid `--color-border` (#E2E8F0) |

---

### Screen S3: Escalation Detail

#### Layout (ASCII Wireframe)

```
┌─────────────────────────────────────────────────────────┐
│ ← Quay lại   "Chi tiết escalation"    [ESC-ID]          │
├─────────────────────────────────────────────────────────┤
│ Status: ● Đã phân công / ⬡ Chờ phân công / ✓ Đã xử lý │
├─────────────────────────────────────────────────────────┤
│ Thông tin:                                               │
│ Lý do: AI không chắc chắn                              │
│ Nhóm xử lý: CSKH                                        │
│ SLA: trước 2026-04-16 17:00                             │
├─────────────────────────────────────────────────────────┤
│ Nội dung đã gửi: [Expand ▼]                             │
├─────────────────────────────────────────────────────────┤
│ Lịch sử xử lý:                                          │
│ 14:25 — Tạo escalation                                  │
│ 14:26 — Phân công: Nguyễn A (CSKH)                     │
└─────────────────────────────────────────────────────────┘
```

#### Design Token Values

| Element | Property | Token / Value |
|---------|----------|---------------|
| Status — Assigned | `color` | `--color-success` (#16A34A) |
| Status — Unrouted | `color` | `--color-warning` (#D97706) |
| Status — Resolved | `color` | `--color-text-secondary` (#64748B) |
| SLA near-breach | `color` | `--color-danger` (#DC2626) |

---

### Screen S4: Unrouted State

```
┌─────────────────────────────────────────────────────────┐
│ ⬡ Chưa xác định được người xử lý                        │
│                                                          │
│ Câu hỏi của bạn đã được ghi nhận.                      │
│ Hệ thống chưa tìm được đội phù hợp tự động.            │
│ PM Governance sẽ phân công thủ công trong thời gian sớm │
│                                                          │
│ [Mã escalation: ESC-2026-04-16-042]                     │
└─────────────────────────────────────────────────────────┘
```

---

## 4. Data Binding

| UI Element | API Endpoint | Field | Format |
|-----------|-------------|-------|--------|
| CTA reason | Local from answer context | `confidence_level`, `warning_count` | Auto-select reason |
| Modal destination | `POST /mia/chat/escalate` (preview) | `assigned_team` (estimate) | String |
| Submit escalation | `POST /mia/chat/escalate` | `answer_id`, `reason_code`, `note`, `branch_scope` | POST body |
| Escalation detail | `GET /mia/chat/escalations/:id` | `routing_status`, `assigned_team`, `sla_due_at`, `resolution_history` | Object |
| Reassign | `POST /mia/chat/escalations/:id/reassign` | `target_team`, `note` | POST body |

---

## 5. State Matrix

### Page-Level States

| State | Trigger | Visual | Notes |
|-------|---------|--------|-------|
| Loading | API in-flight | Spinner trong modal / skeleton trong S3 | |
| Assigned | Routing success | S3 với status Assigned, team name, SLA | Default success |
| Unrouted | Routing fail | S4 Unrouted State | Không để case biến mất |
| Resolved | Case closed | S5 — Resolution sync với summary | |
| Error | API failure | "Không thể tạo escalation. Thử lại." + Retry | |

### Component-Level States

| Component | Default | Hover | Active | Disabled |
|-----------|---------|-------|--------|----------|
| CTA Button | --color-primary | Darken 10% | Press | N/A |
| Reason Radio | Unselected | Highlight | Selected + fill | N/A |
| Confirm Button | Disabled khi chưa có reason | N/A | Active khi có reason | --color-bg-muted |

---

## 5.1 Error & Recovery

### Common Errors

| Error ID | At Step | Error Description | System Assistance | Recovery Action |
|----------|---------|-------------------|-------------------|----------------|
| E1 | Step 4 | API tạo escalation thất bại | "Không thể chuyển lúc này. Vui lòng thử lại." + Retry | Auto-retry 1 lần |
| E2 | Step 5B | Routing không tìm thấy owner | S4 Unrouted State — ghi nhận rõ ràng | PM Governance sẽ xử lý thủ công |
| E3 | Step 2 | Payload thiếu answer snapshot | "Không đủ thông tin để tạo escalation." + Back | Quay lại chat |

### Dead-End Prevention Checklist

- [x] Unrouted case không biến mất — luôn có S4 state rõ ràng
- [x] Silent fail không được phép — mọi kết quả trigger đều có confirmation
- [x] Confirmation nói rõ reason, destination estimate, và "sẽ gửi gì"
- [x] Error có Retry rõ ràng

---

## 6. Copy & Microcopy (Vietnamese)

| Element | Vietnamese Text | Max Length |
|---------|----------------|-----------|
| CTA button | Cần người hỗ trợ | 25 chars |
| Auto-trigger banner | AI không chắc chắn về câu trả lời này | 50 chars |
| Modal title | Chuyển câu hỏi đến người hỗ trợ | 40 chars |
| Reason — Low Confidence | AI không chắc chắn | 25 chars |
| Reason — Out of Scope | Ngoài phạm vi AI | 20 chars |
| Reason — User Requested | Tôi muốn người thật xử lý | 30 chars |
| Reason — Missing Knowledge | Thiếu thông tin để trả lời | 30 chars |
| Confirm button | Xác nhận chuyển | 20 chars |
| Unrouted title | Chưa xác định được người xử lý | 40 chars |
| Unrouted body | Câu hỏi đã được ghi nhận. Chúng tôi sẽ phân công thủ công trong thời gian sớm. | 80 chars |
| Success toast | Đã chuyển câu hỏi thành công. | 40 chars |

---

## 7. Interaction & Animation

| Interaction | Animation | Duration | Easing |
|------------|-----------|----------|--------|
| Modal open | Scale(0.95→1) + fade in | 250ms | ease-out |
| Modal close | Scale(1→0.95) + fade out | 180ms | ease-in |
| Payload expand | Height 0→auto | 200ms | ease-out |
| Status badge update | Color transition | 300ms | ease-in-out |
| Success toast | Slide from top-right | 300ms | ease-out |

> `prefers-reduced-motion`: tắt scale; chỉ giữ fade.

---

## 8. Accessibility

- [x] `aria-modal="true"` trên Confirmation Modal
- [x] `aria-label` trên Close button (✕)
- [x] `role="radiogroup"` cho reason selection
- [x] `aria-live="polite"` trên status update trong S3
- [x] Focus trap trong modal khi mở
- [x] Focus sau modal close: trở về CTA button trong answer card
- [x] Keyboard: ESC đóng modal, Enter confirm khi reason đã chọn

---

## 9. A05 Technical Cross-Check

| Item | Verdict | Notes |
|------|---------|-------|
| Component mapping | ✓ | Modal, RadioGroup, Button từ design system |
| Token compatibility | ✓ | Dùng token chuẩn |
| Animation practical | ✓ | Modal animation nhẹ |
| Responsive aligns | ✓ | Modal full-screen ở mobile |
| Data binding matches API | ✓ | Map đủ từ SRS |
| Shared components | Reuse Modal, Button, Badge từ AIC-001 |

**A05 Sign-Off**: Pending (2026-04-16)

---

## 10. Pre-Delivery Checklist (A07)

- [ ] CTA hiển thị đúng trong answer card (auto và manual)
- [ ] Modal mở đúng, focus trap hoạt động
- [ ] Reason pre-select khi auto-trigger
- [ ] Payload preview collapse/expand
- [ ] Confirmation submit → S3 Assigned hoặc S4 Unrouted
- [ ] S4 Unrouted State hiển thị đủ copy và case ID
- [ ] S5 Resolution Sync hiển thị khi case closed
- [ ] Error state với Retry
- [ ] All tokens matched
- [ ] 100% Vietnamese copy
- [ ] Responsive: modal full-screen ở mobile
- [ ] `prefers-reduced-motion` handled
- [ ] Accessibility attributes applied

**A06 Design Sign-Off**: Approved (2026-04-17) — Screens đủ, Unrouted state rõ, dual-trigger (auto + manual) được thể hiện tốt, copy Vietnamese đầy đủ.
**A05 Tech Sign-Off**: Approved (2026-04-17) — Modal, RadioGroup, focus trap hợp lệ. API contract khớp SRS. Routing domain-first đã được ghi nhận.
**PM Gate**: Approved (2026-04-17) — Trigger conditions và routing priority đã chốt. Ready for A07 FE build (mock/stub only).
