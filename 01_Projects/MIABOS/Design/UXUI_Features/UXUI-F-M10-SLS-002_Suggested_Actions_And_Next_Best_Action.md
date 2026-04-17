# UXUI Feature Spec: F-M10-SLS-002 Suggested Actions and Next Best Action

**Feature ID**: F-M10-SLS-002
**Status**: Approved
**Owner**: A06 UI/UX Agent
**Implementation Reviewer**: A05 Tech Lead
**Implemented By**: A07 FE Builder
**Product**: MIA Smart / MIA Scale
**Design System Reference**: [`Design/Design_System.md`](../Design_System.md)
**Save to**: `Design/UXUI_Features/UXUI-F-M10-SLS-002_Suggested_Actions_And_Next_Best_Action.md`
**Date**: 2026-04-16
**Last Updated By**: Claude Code (claude-sonnet-4-6)
**Last Reviewed By**: A06 UI/UX Agent · A05 Tech Lead · A01 PM Agent
**Approval Required**: PM Agent
**Approved By**: A01 PM Agent
**Last Status Change**: 2026-04-17
**Source of Truth**: This document for `F-M10-SLS-002` UXUI and FE Preview visual/interaction contract
**Blocking Reason**: -

> **Precondition Resolved**: Linked SRS `F-M10-SLS-002` đã ở `SRS Ready`; spec này là visual/interaction authority cho FE Preview bằng mock/stub data. BE/integration thật cần Integration Spec riêng trước khi promote lên `Build Ready`.

---

## §0. User & Task

### Target User Role(s)

| Role | Mô tả | Context |
|------|-------|---------|
| Sales / CRM | Tư vấn bán hàng hoặc operator nội bộ | Đang hội thoại, cần gợi ý bước tiếp theo |
| AI Sales Shell | AI advisor trong bối cảnh retail | Hiển thị suggestion cho khách hoặc sales |
| PM Governance | Theo dõi hiệu quả suggestion | Xem aggregate effectiveness |

### Primary Task Objective

> Sales/AI xem được suggestion có rationale và chọn accept/dismiss trong **≤ 2 clicks** — không làm gián đoạn luồng hội thoại chính.

### Success Metric

| Metric | Target | Cách đo |
|--------|--------|---------|
| Accept/Dismiss time | ≤ 5s từ khi suggestion hiện | Đo từ render đến feedback action |
| Suggestion đọc được | 100% có rationale rõ | Không có suggestion "tại sao?" |
| Không gây distraction | Suggestion không che nội dung chat | Visual review: overlay không block |

### Failure Indicators

- User bỏ qua suggestion vì không hiểu lý do gợi ý
- Suggestion stack quá nhiều làm rối màn hình
- Suggestion hết hạn nhưng vẫn hiển thị như actionable
- Accept suggestion nhưng không dẫn tới action tiếp theo rõ

---

## 1. Feature Overview

### Purpose

Cung cấp panel suggestion nhẹ trong Sales Advisor AI shell, hiển thị 1–3 next-best-actions có rationale và priority. Sales/AI chọn accept/dismiss. Hệ thống ghi feedback để đo hiệu quả và feed sang CTA/lead flow nếu cần.

### User Persona

Sales/CRM nội bộ Giày BQ — đang hội thoại với khách, cần gợi ý nhanh không cần suy nghĩ nhiều.

### User Story

```
Là Sales / AI Advisor tại Giày BQ,
Tôi muốn thấy gợi ý hành động tiếp theo phù hợp theo ngữ cảnh hội thoại
có giải thích tại sao,
Để tôi không bỏ lỡ cơ hội chuyển đổi và biết nên làm gì tiếp theo.
```

### Linked Artifacts

| Artifact | Location | Status |
|----------|----------|--------|
| Feature SRS | [`Analysis/Features/Modules/AI_Workspace/Suggested_Actions_And_Next_Best_Action/SRS/F-M10-SLS-002_Suggested_Actions_And_Next_Best_Action_SRS.md`](../../Analysis/Features/Modules/AI_Workspace/Suggested_Actions_And_Next_Best_Action/SRS/F-M10-SLS-002_Suggested_Actions_And_Next_Best_Action_SRS.md) | SRS Ready |
| Parent SRS | `F-M10-SLS-001_Sales_Advisor_AI_SRS.md` | SRS Ready |

---

## 2. Screen Inventory

| # | Screen Name | Route/Path | Purpose | Notes |
|---|-------------|-----------|---------|-------|
| S1 | Suggestion Panel (trong Sales Chat) | Component trong `/ai/sales` | Hiển thị suggestion stack trong shell | Sidebar/bottom panel |
| S2 | Suggestion Detail Tooltip | Tooltip/popover | Giải thích rationale chi tiết khi hover/tap | On demand |
| S3 | Accepted State | State trong S1 | Sau khi accept → dẫn vào action flow | Transition |
| S4 | Dismissed / Snoozed State | State trong S1 | Sau khi dismiss/snooze | Feedback ghi nhận |
| S5 | Expired State | State trong S1 | Suggestion hết hạn — not actionable | Visual muted |
| S6 | Blocked State | State trong S1 | Suggestion bị policy chặn | Info only |

---

## 2.1 Task Flow

### Primary Task Flow — Sales xem và accept suggestion

| Step | User Action | System Response | Field Visibility | Notes |
|------|------------|-----------------|-----------------|-------|
| 1 | Hội thoại đủ context | Suggestion panel xuất hiện với 1–3 items | Suggestion cards với action + rationale | Auto-generate |
| 2 | Đọc suggestion đầu tiên (priority cao nhất) | Hiển thị action name, rationale tóm tắt, priority badge | Action, 1-line rationale | Scan |
| 3 | Hover/tap để xem thêm rationale | Tooltip S2 mở với giải thích đầy đủ + expected outcome | Full rationale, expected outcome | Optional |
| 4 | Click "Thực hiện" (Accept) hoặc "Bỏ qua" (Dismiss) | Ghi feedback, chuyển sang S3 hoặc S4 | Feedback action | Decision |
| 4B | Click "Để sau" (Snooze) | Ghi snooze, ẩn tạm suggestion | — | Optional |
| 5 | Nếu Accept dẫn tới CTA/lead | Trigger F-M10-SLS-003 flow | CTA form | Downstream |

### Decision Points & Branching

| At Step | Condition | Branch To |
|---------|-----------|----------|
| Step 1 | Context quá mỏng | Chỉ hiện generic CTA suggestion, không có specific action |
| Step 4 | Accept → action dẫn tới handoff/lead | Trigger SLS-003 CTA flow |
| Step 5 | Suggestion hết hạn trước khi action | S5 Expired State |
| Step 3 | Suggestion bị policy block | S6 Blocked State |

### Progressive Disclosure Rules

- **Required**: Action name + 1-line rationale — luôn hiển thị
- **Optional**: Full rationale + expected outcome — tooltip/tap on demand
- **Advanced**: Suggestion score/source — không hiển thị cho end user; chỉ cho PM analytics

---

## 3. Visual Specification (Per Screen)

### Screen S1: Suggestion Panel

#### Layout (ASCII Wireframe)

```
┌──── Sales Chat Shell ───────────────────────────────────┐
│ [Chat conversation area]                                 │
│                                                          │
│ ┌─ Gợi ý hành động ──────────────────────────────────┐ │
│ │ ① [Priority HIGH] Gợi ý tư vấn thêm về kích thước  │ │
│ │   "Khách đang phân vân size — hỏi xác nhận ngay"   │ │
│ │   [✓ Thực hiện]  [✗ Bỏ qua]  [⏱ Để sau]           │ │
│ │                                                      │ │
│ │ ② [Priority MED] Gợi ý đổi mẫu tương đương         │ │
│ │   "Size 40 hết — có mẫu tương tự còn hàng"         │ │
│ │   [✓ Thực hiện]  [✗ Bỏ qua]                        │ │
│ └──────────────────────────────────────────────────────┘ │
│ [Chat input box]                                         │
└──────────────────────────────────────────────────────────┘
```

#### Component Breakdown

| Component | Design Token | Notes |
|-----------|-------------|-------|
| Panel container | --radius-md, --shadow-1, --color-bg-card | Không che chat area chính |
| Panel title | Caption 12px/600, --color-text-secondary | "Gợi ý hành động" |
| Suggestion card | Body 14px/400 | Max 3 cards; priority order |
| Priority badge | Caption 11px/600 | HIGH=--color-danger, MED=--color-warning, LOW=--color-text-secondary |
| Action name | Body 14px/600, --color-text-primary | Bold — dễ scan |
| Rationale text | Body Small 13px/400, --color-text-secondary | 1 line; truncate với "..." |
| Accept button | Body 13px/600, --color-primary, ghost/outline | Nhẹ — không cạnh tranh với chat |
| Dismiss button | Body 13px/400, --color-text-secondary | Text-only |
| Snooze button | Body 13px/400, --color-text-secondary | Text-only, icon ⏱ |

#### Design Token Values

| Element | Property | Token / Value |
|---------|----------|---------------|
| Panel background | `background` | `--color-bg-card` (#FFFFFF) |
| Panel border | `border` | 1px solid `--color-border` (#E2E8F0) |
| Panel shadow | `box-shadow` | `--shadow-1` |
| Priority HIGH | `background` | `--color-danger-bg` (#FEF2F2) |
| Priority MED | `background` | `--color-warning-bg` (#FEF3C7) |
| Expired card | `opacity` | 0.4; `pointer-events: none` |
| Card padding | `padding` | `--space-3` (12px) |
| Card gap | `gap` | `--space-2` (8px) |

#### Responsive Behavior

| Breakpoint | Change |
|-----------|--------|
| Desktop (≥1024px) | Side panel kéo rộng đến 320px |
| Tablet (768–1023px) | Panel collapse xuống bottom bar |
| Mobile (<768px) | Bottom sheet với swipe-to-dismiss |

---

### Screen S2: Suggestion Detail Tooltip

```
┌─────────────────────────────────────────────┐
│ Gợi ý tư vấn thêm về kích thước             │
│ ─────────────────────────────────────────── │
│ Tại sao: Khách đã đề cập size 40 nhưng      │
│ chưa xác nhận. Hỏi ngay để tránh mất lead.  │
│                                              │
│ Kỳ vọng: Tăng 30% khả năng chốt đơn trong  │
│ hội thoại này.                               │
│                                              │
│ [✓ Thực hiện]  [✗ Bỏ qua]                  │
└─────────────────────────────────────────────┘
```

---

### Screen S5: Expired State

```
┌─────────────────────────────────────────────┐
│ [Muted, opacity 40%]                         │
│ Gợi ý đã hết hạn                            │
│ Hội thoại đã chuyển sang giai đoạn khác.    │
└─────────────────────────────────────────────┘
```

### Screen S6: Blocked State

```
┌─────────────────────────────────────────────┐
│ 🚫 Không thể hiển thị gợi ý này             │
│ Hành động này không phù hợp với chính sách  │
│ kênh hiện tại.                               │
└─────────────────────────────────────────────┘
```

---

## 4. Data Binding

| UI Element | API Endpoint | Field | Format |
|-----------|-------------|-------|--------|
| Suggestion list | `GET /mia/sales-advisor/suggestions` | `action_type`, `rationale`, `priority`, `expected_outcome`, `expiry_at` | Array |
| Accept/Dismiss | `POST /mia/sales-advisor/suggestions/:id/feedback` | `feedback_type`, `actor_role`, `outcome_note` | POST body |
| Expired check | Local | `expiry_at` vs `now()` | Client-side |
| Blocked | Returned from API | `blocked_reason` present | Flag |

---

## 5. State Matrix

### Panel-Level States

| State | Trigger | Visual | Notes |
|-------|---------|--------|-------|
| Hidden | Context chưa đủ | Panel ẩn | Không block layout |
| Loading | Generating suggestions | Skeleton 2–3 cards | Sau 300ms |
| Populated | Suggestions ready | S1 với 1–3 cards | Default |
| All dismissed | User dismiss hết | "Không còn gợi ý nào." | |
| All expired | Session stage changed | S5 cho tất cả cards | |
| Error | API fail | "Không tải được gợi ý." + Retry | |

### Card-Level States

| State | Visual |
|-------|--------|
| Default | Normal card |
| Hover | Border highlight --color-primary, cursor pointer |
| Accepted | Check mark, fade out, transition sang action |
| Dismissed | Fade out + slide up collapse |
| Snoozed | Minimized, timer badge |
| Expired | Muted opacity 40%, not clickable |
| Blocked | S6 info card |

---

## 5.1 Error & Recovery

### Common Errors

| Error ID | At Step | Error Description | System Assistance | Recovery Action |
|----------|---------|-------------------|-------------------|----------------|
| E1 | Step 1 | API không trả suggestion (timeout) | "Không tải được gợi ý. Thử lại?" | Retry button nhỏ trong panel |
| E2 | Step 4 | Feedback submit fail | Silent retry; nếu fail 2 lần thì drop — không block user | Không interrupt luồng chat |
| E3 | Step 4 | Accept dẫn tới blocked action | S6 Blocked State với lý do ngắn | Dismiss và suggest CTA khác |

### Dead-End Prevention Checklist

- [x] Panel ẩn khi không có suggestion — không hiện trống
- [x] Expired state không giống actionable state
- [x] Accept action dẫn tới flow rõ ràng (SLS-003) hoặc nói rõ sẽ làm gì
- [x] Error state không block chat chính

---

## 6. Copy & Microcopy (Vietnamese)

| Element | Vietnamese Text | Max Length |
|---------|----------------|-----------|
| Panel title | Gợi ý hành động | 20 chars |
| Accept button | Thực hiện | 10 chars |
| Dismiss button | Bỏ qua | 8 chars |
| Snooze button | Để sau | 8 chars |
| Expired label | Gợi ý đã hết hạn | 20 chars |
| Expired body | Hội thoại đã chuyển sang giai đoạn khác. | 45 chars |
| Blocked title | Không thể hiển thị gợi ý này | 35 chars |
| All dismissed | Không còn gợi ý nào phù hợp lúc này. | 40 chars |
| Error load | Không tải được gợi ý. | 25 chars |
| Retry link | Thử lại | 8 chars |

---

## 7. Interaction & Animation

| Interaction | Animation | Duration | Easing |
|------------|-----------|----------|--------|
| Panel appear | Slide in from bottom/right + fade | 250ms | ease-out |
| Card appear | Stagger fade-in per card, 50ms delay | 200ms | ease-out |
| Accept | Card fade + scale-down | 200ms | ease-in |
| Dismiss | Card slide-left + fade | 200ms | ease-in |
| Tooltip open | Fade + scale(0.95→1) | 150ms | ease-out |
| Expired | Transition opacity to 40% | 500ms | ease-in-out |

> `prefers-reduced-motion`: tắt slide/scale, giữ opacity fade.

---

## 8. Accessibility

- [x] `aria-label` trên Accept, Dismiss, Snooze buttons
- [x] `role="list"` cho suggestion panel, `role="listitem"` mỗi card
- [x] `aria-live="polite"` khi panel xuất hiện với suggestion mới
- [x] Keyboard: Tab qua các action buttons trong mỗi card
- [x] Expired cards: `aria-disabled="true"`, không nhận focus
- [x] Tooltip accessible bằng keyboard (focus trigger)

---

## 9. A05 Technical Cross-Check

| Item | Verdict | Notes |
|------|---------|-------|
| Component mapping | ✓ | Card, Button, Tooltip từ design system |
| Token compatibility | ✓ | Tokens chuẩn |
| Animation practical | ✓ | Stagger nhẹ; không heavy |
| Responsive aligns | ✓ | Panel → bottom sheet ở mobile |
| Data binding matches API | ✓ | Map đủ suggestion fields |
| Shared components | Reuse Card, Button, Badge từ SLS-001 |

**A05 Sign-Off**: Pending (2026-04-16)

---

## 10. Pre-Delivery Checklist (A07)

- [ ] Suggestion panel xuất hiện/ẩn đúng theo context
- [ ] Max 3 cards; priority order đúng
- [ ] Accept / Dismiss / Snooze feedback ghi nhận
- [ ] Tooltip rationale detail hoạt động hover + tap
- [ ] Expired state visual rõ (muted, not clickable)
- [ ] Blocked state hiển thị info
- [ ] Accept dẫn vào SLS-003 CTA flow (stub)
- [ ] Panel ẩn hoàn toàn khi không có suggestion
- [ ] Error state với Retry
- [ ] Responsive: bottom sheet ở mobile
- [ ] 100% Vietnamese copy
- [ ] `prefers-reduced-motion` handled
- [ ] Accessibility attributes applied

**A06 Design Sign-Off**: Approved (2026-04-17) — 4 action types đã được BO chốt; panel layout, 6 states, expired/blocked UX đầy đủ, max 3 cards rule rõ.
**A05 Tech Sign-Off**: Approved (2026-04-17) — Suggestion panel không block chat content; API contract khớp SRS; rule-based ranking đủ cho phase 1.
**PM Gate**: Approved (2026-04-17) — Action taxonomy đã chốt. Ready for A07 FE build (mock/stub only).
