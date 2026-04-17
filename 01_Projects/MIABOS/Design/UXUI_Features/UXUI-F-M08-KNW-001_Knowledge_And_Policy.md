# UXUI Feature Spec: F-M08-KNW-001 Knowledge and Policy

**Feature ID**: F-M08-KNW-001
**Status**: Approved
**Owner**: A06 UI/UX Agent
**Implementation Reviewer**: A05 Tech Lead
**Implemented By**: A07 FE Builder
**Product**: MIA Smart / Platform
**Design System Reference**: [`Design/Design_System.md`](../Design_System.md)
**Save to**: `Design/UXUI_Features/UXUI-F-M08-KNW-001_Knowledge_And_Policy.md`
**Date**: 2026-04-16
**Last Updated By**: Claude Code (claude-sonnet-4-6)
**Last Reviewed By**: A06 UI/UX Agent · A05 Tech Lead · A01 PM Agent
**Approval Required**: PM Agent
**Approved By**: A01 PM Agent
**Last Status Change**: 2026-04-17
**Source of Truth**: This document for `F-M08-KNW-001` UXUI and FE Preview visual/interaction contract
**Blocking Reason**: -

> **Precondition Resolved**: Linked SRS `F-M08-KNW-001` đã ở `SRS Ready`; spec này là visual/interaction authority cho FE Preview bằng mock/stub data. BE/integration thật cần Integration Spec riêng trước khi promote lên `Build Ready`.

---

## §0. User & Task

### Target User Role(s)

| Role | Mô tả | Context |
|------|-------|---------|
| Knowledge Owner | Người tạo và quản lý tài liệu | Tạo draft, gắn source, submit review |
| Domain Reviewer | Người duyệt nội dung theo domain | Kiểm tra source backing, approve/reject |
| PM Governance | Quản lý vận hành | Giám sát toàn bộ knowledge layer |
| User nội bộ | Nhân viên tra cứu | Query knowledge qua chat hoặc library |
| AI Runtime | M09 / M10 | Tiêu thụ knowledge đã publish |

### Primary Task Objective

> Knowledge Owner tạo và submit tài liệu mới trong **≤ 5 phút** từ khi mở form đến khi submit review — không cần hiểu cấu trúc kỹ thuật phức tạp.

### Success Metric

| Metric | Target | Cách đo |
|--------|--------|---------|
| Form submit time | ≤ 5 phút | Đo từ mở form đến Submit thành công |
| Validation error rate | ≤ 10% submissions | Tỉ lệ submit bị lỗi validation |
| Citation render time | ≤ 1s sau answer card | Đo từ answer xuất hiện đến citation panel load |

### Failure Indicators

- Knowledge Owner không rõ field nào bắt buộc
- User không hiểu sự khác nhau giữa `Policy`, `FAQ`, `SOP`, `System Guide`
- Citation panel hiện nhưng không có owner / freshness / version
- Stale document không có badge cảnh báo

---

## 1. Feature Overview

### Purpose

Cung cấp bề mặt quản lý knowledge core: tạo, review, publish, và xem lại knowledge documents. Answer card trong M09/M10 sẽ reference citation từ layer này. Freshness, version, và sensitivity được kiểm soát rõ.

### User Persona

Knowledge Owner (IT / HR / Ops tại BQ) — cần tạo tài liệu chuẩn mà không cần biết về hệ thống phức tạp.

### User Story

```
Là Knowledge Owner tại Giày BQ,
Tôi muốn tạo và publish knowledge document đã được duyệt
để AI và nhân viên đều trả lời theo nguồn chính thống,
Thay vì dựa vào trí nhớ cá nhân hoặc file Excel không kiểm soát.
```

### Linked Artifacts

| Artifact | Location | Status |
|----------|----------|--------|
| Feature SRS | [`Analysis/Features/Modules/Knowledge_Center/Knowledge_And_Policy/SRS/F-M08-KNW-001_Knowledge_And_Policy_SRS.md`](../../Analysis/Features/Modules/Knowledge_Center/Knowledge_And_Policy/SRS/F-M08-KNW-001_Knowledge_And_Policy_SRS.md) | SRS Ready |

---

## 2. Screen Inventory

| # | Screen Name | Route/Path | Purpose | Notes |
|---|-------------|-----------|---------|-------|
| S1 | Knowledge Home | `/knowledge` | Overview, quick filters, recent + featured docs | Entry point |
| S2 | Create / Edit Document | `/knowledge/create` hoặc `/knowledge/:id/edit` | Tạo hoặc sửa knowledge item | Form với validation |
| S3 | Document Detail | `/knowledge/:id` | Xem đầy đủ document, version history, source trace | Read-only view |
| S4 | Citation Panel | Component trong M09/M10 | Hiển thị citation metadata khi answer tham chiếu | Inline trong chat |
| S5 | Gap Report State | Form/overlay | Báo thiếu/sai knowledge từ chat hoặc library | Feedback loop |

---

## 2.1 Task Flow

### Primary Task Flow — Knowledge Owner tạo tài liệu mới

| Step | User Action | System Response | Field Visibility | Notes |
|------|------------|-----------------|-----------------|-------|
| 1 | Click "+ Tạo tài liệu mới" | Mở S2 Create Form | Required fields: type, title, domain, owner, effective date | Entry |
| 2 | Chọn document type (FAQ/SOP/Policy/System Guide) | UI thích nghi label theo type | Type-specific hints | Context |
| 3 | Điền nội dung: title, body, source links, scope | Real-time validation required fields | All fields visible | Draft |
| 4 | Set sensitivity level và applicable channels/personas | Permission preview | Optional but recommended | Config |
| 5 | Click "Gửi để duyệt" | Validate all required → tạo pending review request | — | Submit |
| 6 | Domain Reviewer mở review queue | Xem diff, source backing, policy impact | Reviewer tools | Governance |
| 7 | Reviewer Approve / Reject | Nếu Approve → publish; nếu Reject → trả về với reason | — | Decision |

### Decision Points & Branching

| At Step | Condition | Branch To |
|---------|-----------|----------|
| Step 3 | Source duy nhất là Excel | Warning: "Cần reviewer xác nhận nguồn tạm thời" |
| Step 5 | Required fields thiếu | Inline validation — block submit |
| Step 7 | Reject | Document trả về Draft với reason code rõ |
| Step 7 | Approve | Document index vào runtime |

### Progressive Disclosure Rules

- **Required**: Document type, title, domain, owner, effective date, source links — luôn hiển thị
- **Optional**: Sensitivity level, applicable channels, personas, review cycle — hiện sau required
- **Advanced**: Structured tags, citation config — collapse, expand on click

---

## 3. Visual Specification (Per Screen)

### Screen S1: Knowledge Home

#### Layout (ASCII Wireframe)

```
┌─────────────────────────────────────────────────────────────┐
│ PageHeader: "Trung tâm tri thức"          [+ Tạo mới]       │
├─────────────────────────────────────────────────────────────┤
│ Quick Filters: [Pricing] [Đổi trả] [CSKH] [SOP] [System]   │
├─────────────────────────────────────────────────────────────┤
│ Section: Cần xem xét (stale / chờ review)                   │
│ [Stale badge] Chính sách đổi trả Q2 — quá hạn 5 ngày   [>] │
│ [Chờ duyệt] SOP cửa hàng tháng 4                       [>] │
├─────────────────────────────────────────────────────────────┤
│ Section: Cập nhật gần đây                                   │
│ [Policy] Chính sách giá mùa hè 2026       Published  14/4   │
│ [FAQ]    FAQ đổi trả online               Published  13/4   │
│ [SOP]    SOP kiểm hàng cửa hàng           Published  12/4   │
└─────────────────────────────────────────────────────────────┘
```

#### Component Breakdown

| Component | Design Token | Notes |
|-----------|-------------|-------|
| Quick filter chips | Body Small 12px/600, outlined | Scroll horizontal nếu nhiều |
| Document type badge | Caption 11px/600, color-coded | Policy=blue, FAQ=green, SOP=purple, Guide=gray |
| Stale badge | Caption 11px/600, --color-danger-bg | Nổi bật — cần action |
| Pending badge | Caption 11px/600, --color-warning-bg | Chờ duyệt |
| Row click → S3 | Full row clickable | Cursor pointer |

#### Design Token Values

| Element | Property | Token / Value |
|---------|----------|---------------|
| Page bg | `background` | `--color-bg-page` (#F8FAFC) |
| Card bg | `background` | `--color-bg-card` (#FFFFFF) |
| Badge — Policy | `background` | `--color-blue-bg` (#DBEAFE) |
| Badge — FAQ | `background` | `--color-success-bg` (#DCFCE7) |
| Badge — SOP | `background` | `--color-purple-bg` (#EDE9FE) |
| Stale bg | `background` | `--color-danger-bg` (#FEF2F2) |
| Pending bg | `background` | `--color-warning-bg` (#FEF3C7) |

---

### Screen S2: Create / Edit Document

#### Layout (ASCII Wireframe)

```
┌─────────────────────────────────────────────────────────────┐
│ ← Quay lại   "Tạo tài liệu tri thức mới"                   │
├─────────────────────────────────────────────────────────────┤
│ Loại tài liệu *    [Policy ▼]  [FAQ ▼]  [SOP ▼]  [Guide ▼] │
│ Tên tài liệu *                                              │
│ [Chính sách đổi trả Q2 2026_________________]              │
│ Domain *          [Pricing ▼]                               │
│ Phòng ban phụ trách * [Tài chính ▼]                        │
│ Ngày hiệu lực *   [2026-04-16]                              │
│ Chu kỳ xem xét *  [90 ngày ▼]                              │
├─────────────────────────────────────────────────────────────┤
│ Nội dung tài liệu *                                        │
│ [Rich text editor / Markdown...]                             │
├─────────────────────────────────────────────────────────────┤
│ Nguồn tham chiếu *                                         │
│ [+ Thêm nguồn] SAP B1 ✕  KiotViet ✕                       │
├─────────────────────────────────────────────────────────────┤
│ [+ Thêm cấu hình nâng cao ▼]                                │
├─────────────────────────────────────────────────────────────┤
│               [Lưu nháp]  [Gửi để duyệt →]                 │
└─────────────────────────────────────────────────────────────┘
```

#### Design Token Values

| Element | Property | Token / Value |
|---------|----------|---------------|
| Input border | `border` | 1px solid `--color-border` |
| Input focus | `border-color` | `--color-primary` |
| Source tag | `background` | `--color-bg-subtle` (#F8FAFC) |
| Source tag border | `border` | 1px solid `--color-border` |
| Submit button | `background` | `--color-primary` |
| Save draft button | `background` | transparent, `color` --color-primary |

---

### Screen S3: Document Detail

#### Layout (ASCII Wireframe)

```
┌─────────────────────────────────────────────────────────────┐
│ ← Quay lại   [Policy] Chính sách đổi trả Q2 2026  [Sửa]   │
│ Published | Owner: Tài chính | v2.1 | Hiệu lực: 01/04/2026 │
├─────────────────────────────────────────────────────────────┤
│ Tóm tắt: [Quy định đổi trả sản phẩm cho khách lẻ...]       │
├─────────────────────────────────────────────────────────────┤
│ Phạm vi áp dụng: Tất cả kênh / CSKH / Ecommerce            │
│ Ngoại lệ: Hàng sale không áp dụng                          │
├─────────────────────────────────────────────────────────────┤
│ Nội dung đầy đủ [...]                                       │
├─────────────────────────────────────────────────────────────┤
│ Nguồn: SAP B1 (fresh ✓) | KiotViet (fresh ✓)               │
│ Lịch sử phiên bản: v2.1 (hiện tại) | v2.0 | v1.3          │
├─────────────────────────────────────────────────────────────┤
│ [Báo vấn đề / Gap]                                          │
└─────────────────────────────────────────────────────────────┘
```

---

### Screen S4: Citation Panel (trong M09/M10 answer card)

```
┌─────────────────────────────────────────────────────────────┐
│ Nguồn tham chiếu:                                           │
│ [Policy] Chính sách đổi trả Q2 2026                        │
│ Phòng ban: Tài chính | v2.1 | Hiệu lực: 01/04/2026         │
│ Độ mới: ● Còn mới (4 ngày trước)                           │
│ [Mở tài liệu đầy đủ →]                                     │
└─────────────────────────────────────────────────────────────┘
```

> Citation panel render ≤ 1s sau answer card. Freshness badge: green=mới, yellow=gần stale, red=stale.

---

## 4. Data Binding

| UI Element | API Endpoint | Field | Format |
|-----------|-------------|-------|--------|
| Knowledge home list | `POST /mia/knowledge/query` | `document_type`, `domain`, `status`, `freshness_status` | List |
| Create form submit | Internal draft save → `POST /mia/knowledge/publish-request` (via KNW-002) | All form fields | POST body |
| Document detail | `GET /mia/knowledge/documents/:id` | `metadata`, `current_version`, `version_history`, `source_links` | Object |
| Citation panel | `GET /mia/knowledge/citations/:id` | `title`, `version`, `owner`, `effective_date`, `freshness_status` | Object |
| Gap report | `POST /mia/knowledge/gap-report` | `document_id`, `gap_description`, `reporter_role` | POST body |

---

## 5. State Matrix

### Page-Level States

| State | Trigger | Visual | Notes |
|-------|---------|--------|-------|
| Loading | API in-flight | Skeleton cards | |
| Empty | Không có document | "Chưa có tài liệu nào. Tạo tài liệu đầu tiên." + CTA | |
| Error | API fail | Error card + Retry | |
| Populated | Data loaded | Normal S1 | Default |

### Document Status States

| Status | Visual | Badge color |
|--------|--------|-------------|
| Draft | Italic text, --color-text-secondary | Gray |
| In Review | "Đang xem xét", --color-warning | Yellow |
| Published | Normal, --color-success | Green |
| Stale | Warning banner, --color-danger | Red |
| Superseded | Strikethrough + link sang version mới | Gray |
| Deprecated | Muted, ẩn khỏi search mặc định | Gray |

---

## 5.1 Error & Recovery

### Common Errors

| Error ID | At Step | Error Description | System Assistance | Recovery Action |
|----------|---------|-------------------|-------------------|----------------|
| E1 | Step 3 | Required field trống khi submit | Highlight + "Vui lòng điền [field]" | Focus field |
| E2 | Step 3 | Source duy nhất là Excel | Warning banner: "Nguồn tạm thời cần reviewer xác nhận" | Vẫn cho submit với warning |
| E3 | Step 5 | API submit fail | "Không thể gửi lúc này. Thử lại." + Retry | Retry |
| E4 | View | Document stale | Banner đỏ: "Tài liệu này quá hạn xem xét — có thể không còn chính xác" | Link tới republish action |
| E5 | View | Document superseded | Banner: "Đã có phiên bản mới. [Xem phiên bản mới →]" | Link sang version mới |

### Dead-End Prevention Checklist

- [x] Stale documents có banner cảnh báo rõ — không hiển thị như trusted
- [x] Superseded documents redirect sang version mới
- [x] Form validation inline — không submit khi thiếu required fields
- [x] Gap report từ mọi điểm trong knowledge flow

---

## 6. Copy & Microcopy (Vietnamese)

| Element | Vietnamese Text | Max Length |
|---------|----------------|-----------|
| Page title | Trung tâm tri thức | 25 chars |
| Create button | Tạo tài liệu mới | 20 chars |
| Type — Policy | Chính sách | 12 chars |
| Type — FAQ | Câu hỏi thường gặp | 20 chars |
| Type — SOP | Quy trình vận hành | 22 chars |
| Type — Guide | Hướng dẫn hệ thống | 22 chars |
| Submit button | Gửi để duyệt | 15 chars |
| Save draft | Lưu nháp | 10 chars |
| Stale banner | Tài liệu này quá hạn xem xét — có thể không còn chính xác | 65 chars |
| Superseded banner | Đã có phiên bản mới hơn cho tài liệu này. | 50 chars |
| Gap report button | Báo thiếu / sai thông tin | 30 chars |

---

## 7. Interaction & Animation

| Interaction | Animation | Duration | Easing |
|------------|-----------|----------|--------|
| Page enter | Fade in | 200ms | ease-out |
| Card hover | Background transition | 150ms | ease-out |
| Citation panel appear | Fade in + slide up | 200ms | ease-out |
| Stale banner | Pulse once on load | 500ms | ease-in-out |
| Version history expand | Height 0→auto | 250ms | ease-out |

---

## 8. Accessibility

- [x] Document type selector: `role="radiogroup"` hoặc `<select>` accessible
- [x] `aria-required="true"` trên required form fields
- [x] `aria-live="polite"` trên validation messages
- [x] Stale banner: `role="alert"` để screen reader đọc
- [x] Superseded banner: link sang version mới accessible bằng keyboard
- [x] Citation panel keyboard accessible từ answer card

---

## 9. A05 Technical Cross-Check

| Item | Verdict | Notes |
|------|---------|-------|
| Component mapping | ✓ | Form, Badge, Table, Modal từ design system |
| Token compatibility | ✓ | Tokens chuẩn |
| Animation practical | ✓ | Nhẹ; không có animation heavy |
| Responsive aligns | ✓ | Form single-column ở mobile |
| Data binding matches API | ✓ | Map đủ từ SRS |
| Shared components | Reuse Badge từ AIC-001; Form inputs từ SLS-003 |

**A05 Sign-Off**: Pending (2026-04-16)

---

## 10. Pre-Delivery Checklist (A07)

- [ ] Knowledge home với quick filters
- [ ] Stale / Pending badges rõ ràng
- [ ] Create form với required field validation
- [ ] Progressive disclosure cho advanced fields
- [ ] Document detail với freshness, version, source badges
- [ ] Citation panel render ≤ 1s
- [ ] Stale banner (role="alert")
- [ ] Superseded banner với link sang version mới
- [ ] Gap report form/overlay
- [ ] Responsive: form single-column ở mobile
- [ ] 100% Vietnamese copy
- [ ] `prefers-reduced-motion` handled
- [ ] Accessibility attributes applied

**A06 Design Sign-Off**: Approved (2026-04-17) — 5 screens đủ; form create/edit progressive disclosure; stale/superseded banner rõ; citation panel ≤1s target hợp lý. Dual approval UI đã loại bỏ theo quyết định BO.
**A05 Tech Sign-Off**: Approved (2026-04-17) — Không có dual-approval routing phức tạp; 1-reviewer flow đơn giản hơn; API contract khớp SRS.
**PM Gate**: Approved (2026-04-17) — Approval nằm ở SAP (không phải MIABOS). Ready for A07 FE build (mock/stub only).
