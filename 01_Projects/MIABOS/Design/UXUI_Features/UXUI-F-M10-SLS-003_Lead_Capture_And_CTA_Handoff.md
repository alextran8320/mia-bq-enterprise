# UXUI Feature Spec: F-M10-SLS-003 Lead Capture and CTA Handoff

**Feature ID**: F-M10-SLS-003
**Status**: Approved
**Owner**: A06 UI/UX Agent
**Implementation Reviewer**: A05 Tech Lead
**Implemented By**: A07 FE Builder
**Product**: MIA Smart / MIA Scale
**Design System Reference**: [`Design/Design_System.md`](../Design_System.md)
**Save to**: `Design/UXUI_Features/UXUI-F-M10-SLS-003_Lead_Capture_And_CTA_Handoff.md`
**Date**: 2026-04-16
**Last Updated By**: Claude Code (claude-sonnet-4-6)
**Last Reviewed By**: A06 UI/UX Agent · A05 Tech Lead · A01 PM Agent
**Approval Required**: PM Agent
**Approved By**: A01 PM Agent
**Last Status Change**: 2026-04-17
**Source of Truth**: This document for `F-M10-SLS-003` UXUI and FE Preview visual/interaction contract
**Blocking Reason**: -

> **Precondition Resolved**: Linked SRS `F-M10-SLS-003` đã ở `SRS Ready`; spec này là visual/interaction authority cho FE Preview bằng mock/stub data. BE/integration thật cần Integration Spec riêng trước khi promote lên `Build Ready`.

---

## §0. User & Task

### Target User Role(s)

| Role | Mô tả | Context |
|------|-------|---------|
| Khách hàng | Người mua hoặc người quan tâm | Đang chat với Sales Advisor AI |
| Sales / CRM | Operator nội bộ | Tạo lead thay mặt khách từ console |
| Store / Retail Ops | Quản lý cửa hàng | Nhận CTA/handoff được route về cửa hàng |

### Primary Task Objective

> Khách hoặc Sales chọn CTA và tạo được lead/handoff record với confirmation rõ ràng trong **≤ 4 giây** sau khi submit — biết rõ ai sẽ xử lý tiếp hoặc case đang Pending.

### Success Metric

| Metric | Target | Cách đo |
|--------|--------|---------|
| CTA submit → Confirmation | ≤ 4s cho 95% requests | Đo từ Submit đến confirmation render |
| Lead form completion rate | ≥ 80% không bỏ giữa chừng | Tỉ lệ submit / CTA click |
| Fields bắt buộc tối thiểu | ≤ 5 fields | Count required fields trong form |

### Failure Indicators

- Khách không hiểu CTA sẽ dẫn đến hành động gì
- Form quá dài — khách bỏ giữa chừng
- Confirmation không rõ ai xử lý hoặc khi nào
- Duplicate lead tạo ra mà user không biết

---

## 1. Feature Overview

### Purpose

Chốt conversation thành record có owner. Cung cấp CTA set rõ ràng, form ngắn tối thiểu, duplicate check, và confirmation state rõ. Không để conversation kết thúc mà không có dấu vết follow-up.

### User Persona

Khách hàng đang quan tâm mua giày — muốn để lại thông tin nhanh, không điền form dài. Sales nội bộ cần tạo lead chuyên nghiệp từ console.

### User Story

```
Là khách hàng quan tâm đến sản phẩm Giày BQ,
Tôi muốn để lại thông tin liên hệ nhanh sau khi hỏi AI
và biết rõ ai sẽ liên hệ lại với tôi,
Để tôi không phải tìm cách liên hệ lại từ đầu.
```

### Linked Artifacts

| Artifact | Location | Status |
|----------|----------|--------|
| Feature SRS | [`Analysis/Features/Modules/AI_Workspace/Lead_Capture_And_CTA_Handoff/SRS/F-M10-SLS-003_Lead_Capture_And_CTA_Handoff_SRS.md`](../../Analysis/Features/Modules/AI_Workspace/Lead_Capture_And_CTA_Handoff/SRS/F-M10-SLS-003_Lead_Capture_And_CTA_Handoff_SRS.md) | SRS Ready |
| Parent SRS | `F-M10-SLS-001_Sales_Advisor_AI_SRS.md` | SRS Ready |

---

## 2. Screen Inventory

| # | Screen Name | Route/Path | Purpose | Notes |
|---|-------------|-----------|---------|-------|
| S1 | CTA Footer (trong Sales Chat) | Component trong `/ai/sales` | Hiển thị CTA set ở cuối conversation | Bottom of chat |
| S2 | Lead Capture Form | Modal / inline panel | Thu thập thông tin tối thiểu | Short form |
| S3 | Duplicate Detection State | State trong S2 | Thông báo lead đã tồn tại | Non-error tone |
| S4 | Confirmation — Assigned | State sau S2 | Xác nhận lead + owner/team | Success |
| S5 | Confirmation — Pending Assignment | State sau S2 | Xác nhận lead nhưng chưa có owner | Pending |
| S6 | Follow-up Status | `/ai/leads/:id` | Xem trạng thái lead theo thời gian | Tracking |

---

## 2.1 Task Flow

### Primary Task Flow — Khách để lại thông tin qua CTA

| Step | User Action | System Response | Field Visibility | Notes |
|------|------------|-----------------|-----------------|-------|
| 1 | Đọc answer, thấy CTA footer | Hiển thị 2–3 CTA rõ ràng | CTA buttons | Sau conversation đủ context |
| 2 | Click CTA (VD: "Để lại thông tin") | Mở S2 Lead Form với title theo CTA type | Required fields only | Short form |
| 3 | Điền tên, SĐT, nhu cầu ngắn | Real-time validation | Required fields + nhu cầu | Tối đa 5 fields |
| 4 | Click "Gửi thông tin" | Chạy duplicate check; loading briefly | — | Submit |
| 5A | Không trùng | Tạo lead, route → S4 Confirmation Assigned | Owner name / team | Success |
| 5B | Không tìm được owner | Tạo lead → S5 Confirmation Pending | "Sẽ phân công sớm" | Pending |
| 5C | Trùng lead cũ | S3 Duplicate Detection → gắn event vào lead cũ | Gentle notice | Merge |

### Decision Points & Branching

| At Step | Condition | Branch To |
|---------|-----------|----------|
| Step 4 | Duplicate found | S3 Duplicate State — confirm hoặc cancel |
| Step 5 | Routing success | S4 Assigned |
| Step 5 | Routing fail | S5 Pending Assignment |
| Step 3 | Form invalid | Inline validation — không submit |

### Progressive Disclosure Rules

- **Required**: Tên (hoặc SĐT), SĐT, nhu cầu ngắn — luôn hiển thị
- **Optional**: Khu vực, kênh ưu tiên — hiện sau khi fill required
- **Advanced**: Ghi chú thêm — ẩn mặc định, show "Thêm ghi chú"

---

## 3. Visual Specification (Per Screen)

### Screen S1: CTA Footer

#### Layout (ASCII Wireframe)

```
┌──── Sales Chat ─────────────────────────────────────────┐
│ [Conversation area...]                                   │
│                                                          │
│ ─────────────────────────────────────────────────────── │
│ Bạn muốn làm gì tiếp theo?                              │
│ [📋 Để lại thông tin]  [🏪 Tìm cửa hàng gần nhất]      │
│ [📞 Yêu cầu gọi lại]                                    │
└──────────────────────────────────────────────────────────┘
```

#### Component Breakdown

| Component | Design Token | Notes |
|-----------|-------------|-------|
| CTA section | --color-bg-subtle, top border --color-border | Tách khỏi chat nhưng không nặng |
| CTA label | Caption 12px/500, --color-text-secondary | "Bạn muốn làm gì tiếp theo?" |
| CTA button | Body 14px/600, outlined variant | Max 3 CTAs; icon + text |
| CTA wrapper | flex-wrap, gap --space-2 | Wrap nếu không đủ chỗ |

#### Design Token Values

| Element | Property | Token / Value |
|---------|----------|---------------|
| CTA section bg | `background` | `--color-bg-subtle` (#F8FAFC) |
| CTA section top border | `border-top` | 1px solid `--color-border` (#E2E8F0) |
| CTA section padding | `padding` | `--space-4` (16px) |
| CTA button | outlined `--color-primary` | Border + text color --color-primary |

---

### Screen S2: Lead Capture Form

#### Layout (ASCII Wireframe)

```
┌─────────────────────────────────────────────────────────┐
│ "Để lại thông tin liên hệ"                     [✕]     │
│ Chúng tôi sẽ liên hệ lại trong thời gian sớm nhất.     │
├─────────────────────────────────────────────────────────┤
│ Họ tên *                                                │
│ [Nguyen Van A___________________________]               │
│                                                          │
│ Số điện thoại *                                         │
│ [0901 234 567___________________________]               │
│                                                          │
│ Nhu cầu của bạn *                                       │
│ [Tôi muốn hỏi về giày size 40 màu đen...]               │
│                                                          │
│ Khu vực (không bắt buộc)                               │
│ [Hà Nội ▼]                                             │
│                                                          │
│ [+ Thêm ghi chú]                                        │
│                                                          │
│                 [Hủy]  [Gửi thông tin →]                │
└─────────────────────────────────────────────────────────┘
```

#### Component Breakdown

| Component | Design Token | Notes |
|-----------|-------------|-------|
| Modal | --radius-lg, --shadow-3, max-w 480px | Centered |
| Form fields | Input standard, --radius-sm | Required marked * |
| Textarea (nhu cầu) | Body 14px/400, min-height 80px | Character count optional |
| Optional fields | Body 14px/400, --color-text-secondary label | Không bắt buộc |
| "Thêm ghi chú" | Text link, Body Small | Progressive disclosure |
| Submit button | Primary, full-width | Disabled khi form invalid |

#### Design Token Values

| Element | Property | Token / Value |
|---------|----------|---------------|
| Input border | `border` | 1px solid `--color-border` (#E2E8F0) |
| Input focus | `border-color` | `--color-primary` (#1E40AF) |
| Input error | `border-color` | `--color-danger` (#DC2626) |
| Submit button | `background` | `--color-primary` (#1E40AF) |
| Submit disabled | `background` | `--color-bg-muted` (#E2E8F0) |
| Modal padding | `padding` | `--space-6` (24px) |

---

### Screen S3: Duplicate Detection State

```
┌─────────────────────────────────────────────────────────┐
│ ℹ Thông tin của bạn đã được ghi nhận trước đó           │
│                                                          │
│ Chúng tôi đã có hồ sơ của bạn và sẽ ghi nhận thêm      │
│ yêu cầu này vào hồ sơ hiện có.                         │
│                                                          │
│              [Hủy]  [Xác nhận ghi nhận thêm →]          │
└─────────────────────────────────────────────────────────┘
```

> **Tone**: Không phải lỗi — nhẹ nhàng, không làm khách lo lắng.

---

### Screen S4: Confirmation — Assigned

```
┌─────────────────────────────────────────────────────────┐
│ ✓ Thông tin đã được ghi nhận thành công                 │
│                                                          │
│ Nhân viên tư vấn: Nhóm CSKH Hà Nội                    │
│ Dự kiến liên hệ: Trong vòng 2 giờ                      │
│ Kênh liên hệ: Điện thoại hoặc Zalo                     │
│                                                          │
│ Mã yêu cầu: LEAD-2026-04-16-089                        │
│                             [Đóng]  [Xem trạng thái →]  │
└─────────────────────────────────────────────────────────┘
```

### Screen S5: Confirmation — Pending Assignment

```
┌─────────────────────────────────────────────────────────┐
│ ✓ Thông tin đã được ghi nhận                            │
│                                                          │
│ Chúng tôi đang tìm nhân viên phù hợp nhất để hỗ trợ   │
│ bạn. Bạn sẽ được liên hệ trong thời gian sớm nhất.     │
│                                                          │
│ Mã yêu cầu: LEAD-2026-04-16-090                        │
│                                              [Đóng]     │
└─────────────────────────────────────────────────────────┘
```

---

## 4. Data Binding

| UI Element | API Endpoint | Field | Format |
|-----------|-------------|-------|--------|
| Submit lead | `POST /mia/leads` | `cta_type`, `contact_payload`, `need_summary`, `channel`, `conversation_id` | POST body |
| Confirmation | Response from POST | `lead_id`, `assignment_status`, `assigned_owner`, `duplicate_resolution` | Object |
| Lead status | `GET /mia/leads/:id` | `status`, `assigned_owner`, `latest_event` | Object |
| CTA handoff | `POST /mia/cta/handoff` | `cta_type`, `conversation_context`, `target_team?` | POST body |

---

## 5. State Matrix

### Form-Level States

| State | Trigger | Visual | Notes |
|-------|---------|--------|-------|
| Empty | Form mở | Placeholder trong fields | Default |
| Filling | User nhập | Real-time validation | |
| Invalid | Submit khi có lỗi | Inline error mỗi field | Không submit |
| Loading | Submit API call | Submit button loading spinner | ≤ 4s |
| Success — Assigned | API thành công, có owner | S4 | |
| Success — Pending | API thành công, chưa có owner | S5 | |
| Duplicate | Duplicate detected | S3 | Gentle tone |
| Error | API fail | "Không thể gửi lúc này. Thử lại." | Retry |

### Component-Level States

| Component | Default | Hover | Focus | Error | Disabled |
|-----------|---------|-------|-------|-------|----------|
| Input | Normal border | N/A | --color-primary border | --color-danger border + message | --color-bg-muted |
| Submit Button | --color-primary | Darken 10% | Outline ring | N/A | --color-bg-muted |
| CTA Button | Outlined primary | Fill --color-primary, white text | Outline ring | N/A | N/A |

---

## 5.1 Error & Recovery

### Common Errors

| Error ID | At Step | Error Description | System Assistance | Recovery Action |
|----------|---------|-------------------|-------------------|----------------|
| E1 | Step 3 | SĐT format sai | "Vui lòng nhập số điện thoại hợp lệ (VD: 0901 234 567)" | Focus field |
| E2 | Step 3 | Required field trống | Highlight + "Vui lòng điền [tên field]" | Focus empty field |
| E3 | Step 4 | API submit fail | "Không thể gửi lúc này. Vui lòng thử lại." + Retry | Auto-retry 1 lần |
| E4 | Step 4 | Duplicate detected | S3 — gentle notice, không phải lỗi | Confirm gắn vào lead cũ |
| E5 | Step 5 | Routing fail | S5 Pending — vẫn tạo record | Record tạo thành công |

### Dead-End Prevention Checklist

- [x] Form validation inline — không chờ submit để báo lỗi
- [x] Duplicate state không phải error — tone nhẹ nhàng
- [x] Routing fail vẫn tạo record (Pending) — không mất lead
- [x] Confirmation luôn có mã yêu cầu để khách reference
- [x] Error state có Retry — không để user stuck

---

## 6. Copy & Microcopy (Vietnamese)

| Element | Vietnamese Text | Max Length |
|---------|----------------|-----------|
| CTA section label | Bạn muốn làm gì tiếp theo? | 35 chars |
| CTA — Để lại thông tin | Để lại thông tin | 20 chars |
| CTA — Tìm cửa hàng | Tìm cửa hàng gần nhất | 25 chars |
| CTA — Gọi lại | Yêu cầu gọi lại | 20 chars |
| Form title | Để lại thông tin liên hệ | 30 chars |
| Form subtitle | Chúng tôi sẽ liên hệ lại trong thời gian sớm nhất. | 60 chars |
| Field — Họ tên | Họ tên | 10 chars |
| Field — SĐT | Số điện thoại | 15 chars |
| Field — Nhu cầu | Nhu cầu của bạn | 20 chars |
| Field — Khu vực | Khu vực (không bắt buộc) | 30 chars |
| Submit button | Gửi thông tin | 15 chars |
| Duplicate title | Thông tin của bạn đã được ghi nhận trước đó | 50 chars |
| Duplicate confirm | Xác nhận ghi nhận thêm | 25 chars |
| Assigned title | Thông tin đã được ghi nhận thành công | 45 chars |
| Pending title | Thông tin đã được ghi nhận | 30 chars |
| Pending body | Chúng tôi đang tìm nhân viên phù hợp nhất để hỗ trợ bạn. | 65 chars |
| Error submit | Không thể gửi lúc này. Vui lòng thử lại. | 45 chars |

---

## 7. Interaction & Animation

| Interaction | Animation | Duration | Easing |
|------------|-----------|----------|--------|
| CTA footer appear | Fade in from bottom | 300ms | ease-out |
| Form modal open | Scale(0.95→1) + fade | 250ms | ease-out |
| Optional fields expand | Height 0→auto + fade | 200ms | ease-out |
| Submit loading | Button spinner | — | — |
| Confirmation appear | Replace form content, fade | 200ms | ease-in-out |
| Success checkmark | Scale(0→1) + fade | 300ms | ease-out |

> `prefers-reduced-motion`: tắt scale; chỉ fade.

---

## 8. Accessibility

- [x] `aria-modal="true"` trên Lead Form modal
- [x] `aria-required="true"` trên required fields
- [x] `aria-invalid="true"` trên fields có lỗi
- [x] `aria-describedby` liên kết error message với field
- [x] Focus trap trong modal; ESC đóng (nếu form chưa có dữ liệu)
- [x] Focus sau close: trở về CTA button đã click
- [x] Submit button `aria-busy="true"` khi loading

### Contrast Check

| Element | FG | BG | Target Ratio |
|---------|----|----|------|
| Body text | #1E293B | #FFFFFF | ≥ 7:1 |
| Error message | #DC2626 | #FFFFFF | ≥ 4.5:1 |
| Submit button text | #FFFFFF | #1E40AF | ≥ 4.5:1 |
| Placeholder text | #94A3B8 | #FFFFFF | ≥ 3:1 (decorative) |

---

## 9. A05 Technical Cross-Check

| Item | Verdict | Notes |
|------|---------|-------|
| Component mapping | ✓ | Modal, Input, Button, Toast từ design system |
| Token compatibility | ✓ | Tokens chuẩn |
| Animation practical | ✓ | Modal animation nhẹ |
| Responsive aligns | ✓ | Modal full-screen ở mobile |
| Data binding matches API | ✓ | Map đủ fields từ SRS |
| Shared components | Reuse Modal, Input, Button từ SLS-001 |

**A05 Sign-Off**: Pending (2026-04-16)

---

## 10. Pre-Delivery Checklist (A07)

- [ ] CTA footer xuất hiện đúng timing trong conversation
- [ ] CTA types hiển thị đúng: Để lại thông tin, Tìm cửa hàng, Gọi lại
- [ ] Form mở đúng theo CTA type (title thay đổi)
- [ ] Required fields validation inline
- [ ] Optional fields progressive disclosure (Thêm ghi chú)
- [ ] Duplicate detection state (S3) — tone nhẹ nhàng
- [ ] Confirmation Assigned (S4) với owner + timeline
- [ ] Confirmation Pending (S5) với mã yêu cầu
- [ ] Error state với Retry
- [ ] Responsive: modal full-screen ở mobile
- [ ] 100% Vietnamese copy
- [ ] `prefers-reduced-motion` handled
- [ ] Accessibility attributes applied (aria-required, aria-invalid, focus trap)

**A06 Design Sign-Off**: Approved (2026-04-17) — 4 CTA types chốt rõ; form chung ≤5 fields; duplicate state gentle; confirmation luôn có case ID.
**A05 Tech Sign-Off**: Approved (2026-04-17) — 1 form chung không cần routing selector; API contract POST /mia/leads + /mia/cta/handoff hợp lệ; domain-routing phù hợp với AIC-003.
**PM Gate**: Approved (2026-04-17) — CTA set và routing priority đã chốt. Ready for A07 FE build (mock/stub only).
