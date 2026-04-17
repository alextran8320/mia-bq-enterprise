# UXUI Feature Spec: F-M09-AIC-002 AI Answer History and Trust Review

**Feature ID**: F-M09-AIC-002
**Status**: Approved
**Owner**: A06 UI/UX Agent
**Implementation Reviewer**: A05 Tech Lead
**Implemented By**: A07 FE Builder
**Product**: MIA Smart / Platform
**Design System Reference**: [`Design/Design_System.md`](../Design_System.md)
**Save to**: `Design/UXUI_Features/UXUI-F-M09-AIC-002_AI_Answer_History_And_Trust_Review.md`
**Date**: 2026-04-16
**Last Updated By**: Claude Code (claude-sonnet-4-6)
**Last Reviewed By**: A06 UI/UX Agent · A05 Tech Lead · A01 PM Agent
**Approval Required**: PM Agent
**Approved By**: A01 PM Agent
**Last Status Change**: 2026-04-17
**Source of Truth**: This document for `F-M09-AIC-002` UXUI and FE Preview visual/interaction contract
**Blocking Reason**: -

> **Precondition Resolved**: Linked SRS `F-M09-AIC-002` đã ở `SRS Ready`; spec này là visual/interaction authority cho FE Preview bằng mock/stub data. BE/integration thật cần Integration Spec riêng trước khi promote lên `Build Ready`.

---

## §0. User & Task

### Target User Role(s)

| Role | Mô tả | Context |
|------|-------|---------|
| PM Governance | Quản lý vận hành, governance | Cần xem lại answer AI theo domain, đánh giá rủi ro |
| CSKH Team Lead | Quản lý nhóm chăm sóc khách hàng | Cần review history team, phát hiện answer sai |
| Ecommerce / Omnichannel Lead | Quản lý kênh online | Xem answer trong phạm vi domain của mình |
| IT / ERP / Data | Kỹ thuật, vận hành hệ thống | Cần trace source-level diagnostics |
| User nội bộ | Nhân viên thông thường | Xem lại lịch sử hỏi đáp cá nhân |

### Primary Task Objective

> Reviewer xem lại answer history và đánh giá trust verdict trong **≤ 3 clicks** từ khi mở history list đến khi lưu verdict — không cần rời khỏi màn hình.

### Success Metric

| Metric | Target | Cách đo |
|--------|--------|---------|
| Thời gian gắn verdict | ≤ 60s từ khi mở history | Đo từ lúc mở screen đến lưu verdict |
| Review completion rate | ≥ 90% không bị lỗi form | Tỉ lệ reviewer submit verdict thành công lần đầu |
| History query time | ≤ 2s cho 95% filter queries | Đo từ apply filter đến render list |

### Failure Indicators

- Reviewer không rõ sự khác nhau giữa verdict `Needs Review` và `Incorrect`
- Reviewer không thể tìm answer theo filter domain/role
- Masked transcript hiện lỗi hoặc không nói rõ lý do ẩn
- Verdict submit nhưng không có feedback xác nhận

---

## 1. Feature Overview

### Purpose

Cung cấp bề mặt xem lại lịch sử answer AI và workflow trust review cho PM/Lead. Cho phép tra cứu theo domain, role, warning; mở detail snapshot; gắn verdict chuẩn; và feed kết quả sang review queue / M12 analytics.

### User Persona

PM Governance và Team Lead — người chịu trách nhiệm chất lượng AI answer, cần nhìn lại hệ thống chứ không phải hỏi từng câu.

### User Story

```
Là PM Governance / Team Lead tại Giày BQ,
Tôi muốn xem lại lịch sử answer AI theo domain và verdict
và gắn đánh giá trust cho từng answer có rủi ro,
Để tôi có bằng chứng cụ thể để cải thiện Knowledge Center và routing rule.
```

### Linked Artifacts

| Artifact | Location | Status |
|----------|----------|--------|
| Feature SRS | [`Analysis/Features/Modules/AI_Workspace/AI_Answer_History_And_Trust_Review/SRS/F-M09-AIC-002_AI_Answer_History_And_Trust_Review_SRS.md`](../../Analysis/Features/Modules/AI_Workspace/AI_Answer_History_And_Trust_Review/SRS/F-M09-AIC-002_AI_Answer_History_And_Trust_Review_SRS.md) | SRS Ready |
| Parent SRS | `F-M09-AIC-001_Internal_AI_Chat_SRS.md` | SRS Ready |

---

## 2. Screen Inventory

| # | Screen Name | Route/Path | Purpose | Notes |
|---|-------------|-----------|---------|-------|
| S1 | Answer History List | `/ai/chat/history` | Danh sách answer đã log, filter, tìm kiếm | Entry point chính |
| S2 | Answer Detail & Trust Review | `/ai/chat/history/:id` | Xem snapshot đầy đủ + gắn verdict | Core review action |
| S3 | Review Queue | `/ai/chat/review-queue` | Danh sách answers cần review theo severity | Dành cho PM/Ops |
| S4 | Masked Transcript State | Overlay trong S2 | Hiển thị trạng thái ẩn nội dung nhạy cảm | State của S2 |

---

## 2.1 Task Flow

### Primary Task Flow — PM xem và review answer

| Step | User Action | System Response | Field Visibility | Notes |
|------|------------|-----------------|-----------------|-------|
| 1 | Mở `/ai/chat/history` | Render history list với filter bar | Filter, summary columns | Entry point |
| 2 | Áp filter theo `domain`, `role`, `warning level`, `verdict` | List update, hiển thị đúng subset | Filter chips active | Debounce 300ms |
| 3 | Click vào một answer row | Mở detail panel / page S2 | Full snapshot, verdict form | Answer detail |
| 4 | Đọc `question`, `answer snapshot`, `source trace`, `warning` | Render đầy đủ; masked content ẩn theo quyền | Verdict form ở cuối | Trust check |
| 5 | Chọn verdict và nhập note (bắt buộc nếu `Incorrect`/`Escalated`) | Validate form, enable Submit | Verdict radio + note textarea | Decision |
| 6 | Click Submit | Lưu verdict, hiện toast xác nhận, cập nhật row trong list | — | Task complete |

### Decision Points & Branching

| At Step | Condition | Branch To |
|---------|-----------|----------|
| Step 4 | Nội dung bị mask (sensitivity) | Hiện S4 Masked State — giải thích lý do ẩn |
| Step 5 | Verdict = `Incorrect` hoặc `Escalated` | Bắt buộc nhập note trước khi Submit |
| Step 5 | Answer đã hết retention full transcript | Hiện metadata summary + warning banner |
| Step 6 | Verdict = `Escalated` | Tạo link tới escalation record (F-M09-AIC-003) |

### Progressive Disclosure Rules

- **Required fields**: Filter bar, summary columns — luôn hiển thị
- **Optional fields**: Note textarea hiện sau khi chọn verdict
- **Advanced fields**: Source trace detail, raw audit log — collapse mặc định, expand on click

---

## 3. Visual Specification (Per Screen)

### Screen S1: Answer History List

#### Layout (ASCII Wireframe)

```
┌─────────────────────────────────────────────────────────────┐
│ PageHeader: "Lịch sử câu trả lời AI"  [Review Queue CTA]   │
├─────────────────────────────────────────────────────────────┤
│ FilterBar: [Domain ▼] [Role ▼] [Warning ▼] [Verdict ▼] [Date Range] [🔍] │
├─────────────────────────────────────────────────────────────┤
│ Stats Row: Tổng: 124  │  Chờ review: 18  │  Có rủi ro: 7   │
├─────────────────────────────────────────────────────────────┤
│ Table:                                                       │
│ [Thời gian] [Domain] [Role] [Answer Type] [Warning] [Verdict] [→] │
│ 2026-04-16 14:22  Pricing  CSKH  Policy  ⚠ 2  Chờ review  > │
│ 2026-04-16 13:05  Inventory Sales  Data   —   Trusted       > │
│ ...                                                          │
├─────────────────────────────────────────────────────────────┤
│ Pagination: < 1 2 3 ... >                                   │
└─────────────────────────────────────────────────────────────┘
```

#### Component Breakdown

| Component | Design Token | Notes |
|-----------|-------------|-------|
| PageHeader | H1 24px/700 | Tiêu đề tiếng Việt |
| FilterBar | Body 14px/400 | Dropdown multi-select; debounce 300ms |
| Stats Row | Body Small 13px/500 | Highlight `Chờ review` bằng --color-warning |
| Table Row | Body 14px/400 | Click entire row → S2 |
| Verdict Badge | Caption 12px/500 | Color-coded: Trusted=green, Needs Review=yellow, Incorrect=red, Escalated=orange |
| Warning Count | Caption 12px/700 | Icon ⚠ + count; red nếu ≥ 2 |

#### Design Token Values

| Element | Property | Token / Value |
|---------|----------|---------------|
| Page background | `background` | `--color-bg-page` (#F8FAFC) |
| Card/Table background | `background` | `--color-bg-card` (#FFFFFF) |
| Table row hover | `background` | `--color-bg-hover` (#F1F5F9) |
| Verdict — Trusted | `color` | `--color-success` (#16A34A) |
| Verdict — Needs Review | `color` | `--color-warning` (#D97706) |
| Verdict — Incorrect | `color` | `--color-danger` (#DC2626) |
| Verdict — Escalated | `color` | `--color-orange` (#EA580C) |
| Card padding | `padding` | `--space-5` (20px) |
| Table row height | `height` | 48px |

#### Responsive Behavior

| Breakpoint | Change |
|-----------|--------|
| Desktop (≥1024px) | Full table với tất cả columns |
| Tablet (768–1023px) | Ẩn column `Answer Type`, giữ `Domain`, `Warning`, `Verdict` |
| Mobile (<768px) | Card list view thay table; filter collapse vào sheet bottom |

---

### Screen S2: Answer Detail & Trust Review

#### Layout (ASCII Wireframe)

```
┌─────────────────────────────────────────────────────────────┐
│ ← Quay lại   "Chi tiết câu trả lời"   [Answer ID] [Time]   │
├─────────────────────────────────────────────────────────────┤
│ Section: Câu hỏi                                            │
│ "Tồn kho giày size 40 màu đen còn bao nhiêu?"              │
├─────────────────────────────────────────────────────────────┤
│ Section: Câu trả lời (snapshot)                             │
│ [Answer Type Badge]  [Freshness Label]  [Warning Chips]     │
│ "Theo dữ liệu KiotViet lúc 14:20..."                       │
├─────────────────────────────────────────────────────────────┤
│ Section: Nguồn tham chiếu [Expand ▼]                        │
│ • KiotViet — tồn kho cửa hàng (14:20, còn mới)             │
│ • Knowledge Center — chính sách tồn kho...                  │
├─────────────────────────────────────────────────────────────┤
│ Section: Cảnh báo                                           │
│ ⚠ Dữ liệu SAP B1 chưa đồng bộ                              │
├─────────────────────────────────────────────────────────────┤
│ Section: Đánh giá trust                                     │
│ ○ Tin cậy  ○ Cần xem lại  ○ Sai  ○ Đã escalate            │
│ [Note: bắt buộc nếu chọn Sai / Đã escalate]                │
│ [Nội dung ghi chú...]                                       │
│                            [Hủy]  [Lưu đánh giá →]         │
└─────────────────────────────────────────────────────────────┘
```

#### Component Breakdown

| Component | Design Token | Notes |
|-----------|-------------|-------|
| Back link | Body 14px/400, --color-primary | Arrow icon + text |
| Question block | Body 16px/500, --color-text-primary | Background --color-bg-subtle |
| Answer block | Body 14px/400 | Snapshot — không phải live data |
| Answer Type Badge | Caption 12px/600 | Policy / Data / Mixed |
| Freshness Label | Caption 12px/400 | Màu theo freshness: green/yellow/red |
| Warning chips | Caption 12px/500, --color-warning-bg | Mỗi warning 1 chip |
| Source trace | Body Small 13px/400 | Collapse mặc định, expand on click |
| Verdict radio group | Body 14px/500 | 4 options rõ ràng |
| Note textarea | Body 14px/400 | Bắt buộc khi verdict = Sai / Đã escalate |
| Submit button | Body 14px/600, --color-primary | Disabled khi form chưa valid |

#### Design Token Values

| Element | Property | Token / Value |
|---------|----------|---------------|
| Section header | `font-size/weight` | 13px/600, --color-text-secondary |
| Question bg | `background` | `--color-bg-subtle` (#F8FAFC) |
| Warning chip bg | `background` | `--color-warning-bg` (#FEF3C7) |
| Warning chip text | `color` | `--color-warning` (#D97706) |
| Masked content bg | `background` | `--color-bg-muted` (#E2E8F0) |
| Submit button | `background` | `--color-primary` (#1E40AF) |
| Divider | `border` | 1px solid --color-border (#E2E8F0) |

---

### Screen S4: Masked Transcript State (Overlay trong S2)

```
┌─────────────────────────────────────────────────────────────┐
│ [Icon khóa]  Nội dung bị ẩn                                 │
│ Bạn không có quyền xem chi tiết câu trả lời này             │
│ do mức độ nhạy cảm cao hơn quyền hiện tại của bạn.         │
│                                                              │
│ Để yêu cầu quyền truy cập, liên hệ PM Governance.          │
└─────────────────────────────────────────────────────────────┘
```

---

## 4. Data Binding

| UI Element | API Endpoint | Field | Format |
|-----------|-------------|-------|--------|
| History list | `GET /mia/chat/history` | `answer_type`, `domain`, `user_role`, `warning_count`, `verdict`, `created_at` | List |
| Filter options | `GET /mia/chat/history` | Filter params: `domain`, `user_role`, `verdict`, `warning_level`, `date_from`, `date_to` | Query params |
| Answer detail | `GET /mia/chat/history/:id` | `question`, `answer_snapshot`, `source_snapshot`, `warnings`, `masking_flags`, `review_history` | Object |
| Submit verdict | `POST /mia/chat/review` | `answer_id`, `verdict`, `review_note`, `reviewer_role`, `follow_up_type` | POST body |
| Review queue | `GET /mia/chat/review-queue` | `severity`, `verdict`, `domain` | List |

---

## 5. State Matrix

### Page-Level States

| State | Trigger | Visual | Notes |
|-------|---------|--------|-------|
| Loading | API in-flight | Skeleton rows matching table layout | Sau 300ms |
| Empty | 0 answers | "Chưa có lịch sử câu trả lời nào." + icon | |
| Error | API error | Error card + "Thử lại" | Retry refetch |
| Populated | Data returned | Full table | Default |
| Filtered (no match) | Filter active, 0 results | "Không tìm thấy kết quả phù hợp." + clear filter | |

### Component-Level States

| Component | Default | Hover | Active | Disabled | Error |
|-----------|---------|-------|--------|----------|-------|
| Table Row | Normal bg | --color-bg-hover | Ripple | N/A | N/A |
| Verdict Radio | Unselected | Highlight border | Selected + fill | N/A | Red border nếu bắt buộc |
| Note Textarea | Placeholder | Border --color-primary | Typing | N/A | Red border + error message |
| Submit Button | --color-primary | Darken 10% | Active press | --color-bg-muted | N/A |

---

## 5.1 Error & Recovery

### Common Errors

| Error ID | At Step | Error Description | System Assistance | Recovery Action |
|----------|---------|-------------------|-------------------|----------------|
| E1 | Step 5 | Verdict `Incorrect` nhưng không có note | Highlight textarea + "Vui lòng nhập lý do đánh giá" | Focus textarea |
| E2 | Step 6 | API save thất bại | "Không thể lưu đánh giá. Vui lòng thử lại." + Retry | Auto-retry 1 lần |
| E3 | Step 4 | Answer snapshot không tồn tại | "Bản ghi này đã hết thời gian lưu trữ chi tiết. Chỉ còn metadata tóm tắt." | Hiện summary thay full detail |
| E4 | Step 3 | User không đủ quyền xem detail | S4 Masked State | Hướng dẫn liên hệ PM |
| E5 | Step 2 | Filter không có kết quả | "Không tìm thấy kết quả." + link "Xóa bộ lọc" | Clear all filters |

### Dead-End Prevention Checklist

- [x] Mọi error state có message tiếng Việt rõ ràng
- [x] Masked state giải thích lý do và hướng dẫn tiếp theo
- [x] Submit disabled khi form chưa valid — không để submit sai
- [x] Retention-expired state vẫn hiện metadata + verdict form
- [x] Back link luôn hoạt động từ S2 về S1

---

## 6. Copy & Microcopy (Vietnamese)

| Element | Vietnamese Text | Max Length |
|---------|----------------|-----------|
| Page Title | Lịch sử câu trả lời AI | 30 chars |
| Verdict — Tin cậy | Tin cậy | 10 chars |
| Verdict — Needs Review | Cần xem lại | 15 chars |
| Verdict — Incorrect | Sai / Không chính xác | 20 chars |
| Verdict — Escalated | Đã chuyển xử lý | 20 chars |
| Note placeholder | Nhập lý do đánh giá (bắt buộc) | 40 chars |
| Masked state title | Nội dung bị ẩn | 20 chars |
| Masked state body | Bạn không có quyền xem chi tiết này do mức nhạy cảm cao hơn quyền hiện tại. | 100 chars |
| Empty list | Chưa có lịch sử câu trả lời nào. | 40 chars |
| Submit button | Lưu đánh giá | 15 chars |
| Success toast | Đã lưu đánh giá thành công. | 40 chars |
| Retention expired | Bản ghi này đã hết thời gian lưu trữ chi tiết. Chỉ còn metadata tóm tắt. | 80 chars |

---

## 7. Interaction & Animation

| Interaction | Animation | Duration | Easing |
|------------|-----------|----------|--------|
| Page enter | Fade in | 200ms | ease-out |
| Row click → detail | Slide in from right / Navigate | 250ms | ease-out |
| Verdict select | Radio fill + scale(1→1.05→1) | 150ms | ease-out |
| Note textarea appear | Height 0→auto + fade | 200ms | ease-out |
| Submit success | Toast slide in from top-right | 300ms | ease-out |
| Modal/overlay open | Scale(0.95→1) + fade | 250ms | ease-out |

> `prefers-reduced-motion`: tắt scale animation; giữ fade.

---

## 8. Accessibility

- [x] `aria-label` trên: icon-only buttons (filter icons, expand source trace)
- [x] `aria-live="polite"` trên: toast notification, filter result count
- [x] `role="radiogroup"` cho verdict selection
- [x] `aria-required="true"` trên note textarea khi verdict = Sai/Escalated
- [x] Keyboard tab order: FilterBar → Table → Verdict → Note → Submit
- [x] Focus sau submit: trở về S1 history list, focus row vừa được review

### Contrast Check

| Element | FG | BG | Target Ratio |
|---------|----|----|------|
| Body text | #1E293B | #FFFFFF | ≥ 7:1 |
| Verdict Trusted | #16A34A | #FFFFFF | ≥ 4.5:1 |
| Verdict Incorrect | #DC2626 | #FFFFFF | ≥ 4.5:1 |
| Warning chip text | #D97706 | #FEF3C7 | ≥ 4.5:1 |
| Masked state text | #64748B | #E2E8F0 | ≥ 4.5:1 |

---

## 9. A05 Technical Cross-Check

| Item | Verdict | Notes |
|------|---------|-------|
| Component mapping | ✓ | Dùng Table, RadioGroup, Textarea, Badge từ design system |
| Token compatibility | ✓ | Dùng token chuẩn từ Design_System.md |
| Animation practical | ✓ | Không có animation heavy; fade + slide nhẹ |
| Responsive aligns | ✓ | Table → Card list ở mobile |
| Data binding matches API | ✓ | Map đủ fields từ SRS API contract |
| Shared components | Reuse: Table, FilterBar, Badge, Toast từ AIC-001 |

**A05 Sign-Off**: Pending (2026-04-16)

---

## 10. Pre-Delivery Checklist (A07)

- [ ] Design tokens matched exactly
- [ ] No browser defaults visible
- [ ] Icons: Lucide SVG only (no emoji)
- [ ] Be Vietnam Pro font rendering verified
- [ ] All states implemented (loading, empty, error, populated, filtered-no-match)
- [ ] Masked state implemented với đúng copy tiếng Việt
- [ ] Retention-expired state implemented
- [ ] All hover/active/focus/disabled states
- [ ] Touch targets ≥ 44x44px
- [ ] Responsive: desktop + tablet + mobile
- [ ] 100% Vietnamese copy
- [ ] Verdict form validation: note bắt buộc khi Sai/Escalated
- [ ] `prefers-reduced-motion` handled
- [ ] Accessibility attributes applied

**A06 Design Sign-Off**: Approved (2026-04-17) — Screens đầy đủ, flow rõ, copy tiếng Việt đủ, token chuẩn. Lưu ý: loại bỏ retention-expired state theo quyết định BO ngày 2026-04-17.
**A05 Tech Sign-Off**: Approved (2026-04-17) — Component mapping hợp lệ, API contract khớp SRS, animation nhẹ, responsive đủ.
**PM Gate**: Approved (2026-04-17) — Open questions đã chốt. Ready for A07 FE build (mock/stub only).
