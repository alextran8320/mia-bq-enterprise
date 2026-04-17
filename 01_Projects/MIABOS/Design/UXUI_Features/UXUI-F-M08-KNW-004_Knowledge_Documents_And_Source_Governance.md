# UXUI Feature Spec: F-M08-KNW-004 Knowledge Documents and Source Governance

**Feature ID**: F-M08-KNW-004
**Status**: Approved
**Owner**: A06 UI/UX Agent
**Implementation Reviewer**: A05 Tech Lead
**Implemented By**: A07 FE Builder
**Product**: MIA Smart / Platform (Internal Governance)
**Design System Reference**: [`Design/Design_System.md`](../Design_System.md)
**Save to**: `Design/UXUI_Features/UXUI-F-M08-KNW-004_Knowledge_Documents_And_Source_Governance.md`
**Date**: 2026-04-16
**Last Updated By**: Claude Code (claude-sonnet-4-6)
**Last Reviewed By**: A06 UI/UX Agent · A05 Tech Lead · A01 PM Agent
**Approval Required**: PM Agent
**Approved By**: A01 PM Agent
**Last Status Change**: 2026-04-17
**Source of Truth**: This document for `F-M08-KNW-004` UXUI and FE Preview visual/interaction contract
**Blocking Reason**: -

> **Precondition Resolved**: Linked SRS `F-M08-KNW-004` đã ở `SRS Ready`; spec này là visual/interaction authority cho FE Preview bằng mock/stub data. BE/integration thật cần Integration Spec riêng trước khi promote lên `Build Ready`.

---

## §0. User & Task

### Target User Role(s)

| Role | Mô tả | Context |
|------|-------|---------|
| PM Governance | Quản lý vận hành knowledge | Restrict source, resolve conflict, xem freshness |
| IT / ERP / Data | Kỹ thuật, quản trị hệ thống | Đăng ký source, monitor sync, cập nhật metadata |
| Tài chính / Pricing Control | Reviewer pricing sources | Xác nhận source liên quan giá/promo |
| Knowledge Owner | Người tạo tài liệu | Link document với source backing |

### Primary Task Objective

> Governance Officer xem được toàn bộ freshness health và resolve conflict source trong **≤ 5 phút** từ khi mở freshness board đến khi close case — không cần mở nhiều tool khác.

### Success Metric

| Metric | Target | Cách đo |
|--------|--------|---------|
| Source registry load time | ≤ 2s | Đo từ mở trang đến list render |
| Conflict resolution time | ≤ 5 phút | Đo từ mở case đến close |
| Stale detection lag | ≤ 15 phút | Đo từ threshold breach đến badge hiển thị |

### Failure Indicators

- PM không thể phân biệt source nào là primary vs supporting
- Stale source không hiển thị rõ — AI vẫn dùng mà không cảnh báo
- Conflict case đóng nhưng không có resolution note — không audit được
- Governance restrict source nhưng M09/M10 vẫn hiển thị data từ đó

---

## 1. Feature Overview

### Purpose

Cung cấp bề mặt governance để đăng ký nguồn tri thức, gán trust level và freshness rule, phát hiện stale/conflict, và kiểm soát allowed usage cho AI runtime. Đây là lớp nền để Knowledge Center không trở thành nguồn không kiểm soát.

### User Persona

PM Governance và IT/ERP tại BQ — người chịu trách nhiệm đảm bảo AI chỉ dùng nguồn đáng tin, fresh, và hợp lệ theo ngữ cảnh.

### User Story

```
Là PM Governance tại Giày BQ,
Tôi muốn biết mọi nguồn tri thức đang ở trạng thái gì
và xử lý được conflict hoặc stale source ngay trên dashboard,
Để AI không trả lời từ nguồn đã lỗi thời hoặc không được phép.
```

### Linked Artifacts

| Artifact | Location | Status |
|----------|----------|--------|
| Feature SRS | [`Analysis/Features/Modules/Knowledge_Center/Knowledge_Documents_And_Source_Governance/SRS/F-M08-KNW-004_Knowledge_Documents_And_Source_Governance_SRS.md`](../../Analysis/Features/Modules/Knowledge_Center/Knowledge_Documents_And_Source_Governance/SRS/F-M08-KNW-004_Knowledge_Documents_And_Source_Governance_SRS.md) | SRS Ready |

---

## 2. Screen Inventory

| # | Screen Name | Route/Path | Purpose | Notes |
|---|-------------|-----------|---------|-------|
| S1 | Source Registry | `/knowledge/sources` | Danh sách all sources với status health | Main governance view |
| S2 | Source Detail / Edit | `/knowledge/sources/:id` | Chi tiết source + edit rules + audit log | Config |
| S3 | Freshness Board | `/knowledge/freshness` | Overview freshness health theo source | Monitoring |
| S4 | Conflict View | `/knowledge/conflicts` | Danh sách + detail conflict cases | Resolution |
| S5 | Conflict Resolution Modal | Modal trong S4 | Confirm resolution + note | Action |
| S6 | Restrict Source Modal | Modal trong S1/S2 | Xác nhận restrict với impact preview | Emergency action |

---

## 2.1 Task Flow

### Primary Task Flow — Governance phát hiện và resolve conflict

| Step | User Action | System Response | Field Visibility | Notes |
|------|------------|-----------------|-----------------|-------|
| 1 | Mở S3 Freshness Board | Hiển thị sources theo freshness health: OK / Warning / Stale | Status badges, days-since-refresh | Entry monitoring |
| 2 | Thấy Conflict badge trên source | Click sang S4 Conflict View | Conflict list | Investigation |
| 3 | Click conflict case | Xem S source A vs source B, field conflict, priority rule | Detail view | Analysis |
| 4 | Click "Giải quyết" | Mở S5 Resolution Modal | Resolution type, note | Decision |
| 5 | Chọn resolution type + nhập note + confirm | Ghi audit, close case, update runtime source filter | — | Done |

### Alternate Flow — IT đăng ký source mới

| Step | User Action | System Response | Notes |
|------|------------|-----------------|-------|
| 1 | Click "+ Thêm nguồn" trong S1 | Mở form tạo source | |
| 2 | Điền metadata: source type, system name, owner, reference | Validation required | |
| 3 | Gán trust level, freshness rule, allowed channels/personas | Config gatekeeper | |
| 4 | Submit | Source ở trạng thái Active | |

### Progressive Disclosure Rules

- **Required**: Source name, type, owner, trust level — luôn hiển thị trong registry
- **Optional**: Freshness rule detail, allowed personas — expand in source detail
- **Advanced**: Raw audit log — collapse trong S2

---

## 3. Visual Specification (Per Screen)

### Screen S1: Source Registry

#### Layout (ASCII Wireframe)

```
┌─────────────────────────────────────────────────────────────┐
│ PageHeader: "Quản lý nguồn tri thức"       [+ Thêm nguồn]  │
├─────────────────────────────────────────────────────────────┤
│ [Status ▼] [Source Type ▼] [Owner ▼]       [🔍 Tìm kiếm]  │
├─────────────────────────────────────────────────────────────┤
│ Tổng: 6 nguồn  │  Cần xử lý: 2  │  Stale: 1  │  Conflict: 1 │
├─────────────────────────────────────────────────────────────┤
│ ● SAP B1      | ERP    | Tài chính | Trust: Cao | ● Active   │
│ ● KiotViet    | POS    | Vận hành  | Trust: Cao | ● Active   │
│ ⚠ Excel Q1   | Manual | Marketing | Trust: Thấp| ⚠ Stale   │
│ ⚡ KiotViet  | POS    | IT        | Trust: Cao | ⚡ Conflict│
│ ○ Haravan    | Ecomm  | Ecomm     | Trust: Cao | ● Active   │
│ ○ Lark       | Wflow  | HR        | Trust: Thấp| ● Active   │
└─────────────────────────────────────────────────────────────┘
```

#### Component Breakdown

| Component | Design Token | Notes |
|-----------|-------------|-------|
| Status dot — Active | --color-success | ● |
| Status dot — Stale | --color-warning | ⚠ |
| Status dot — Conflict | --color-danger | ⚡ |
| Status dot — Restricted | --color-text-secondary | ○ muted |
| Trust badge | Caption 11px/600 | Cao=green, Trung=yellow, Thấp=red |
| Summary stat bar | Body Small 13px/500 | Highlight "Cần xử lý" bằng warning |
| Row click → S2 | Full row clickable | |

#### Design Token Values

| Element | Property | Token / Value |
|---------|----------|---------------|
| Page bg | `background` | `--color-bg-page` (#F8FAFC) |
| Card bg | `background` | `--color-bg-card` (#FFFFFF) |
| Status Active | `color` | `--color-success` (#16A34A) |
| Status Stale | `color` | `--color-warning` (#D97706) |
| Status Conflict | `color` | `--color-danger` (#DC2626) |
| Status Restricted | `color` | `--color-text-muted` (#94A3B8) |
| Trust — Cao | `background` | `--color-success-bg` |
| Trust — Thấp | `background` | `--color-danger-bg` |
| Row hover | `background` | `--color-bg-hover` (#F1F5F9) |

---

### Screen S3: Freshness Board

#### Layout (ASCII Wireframe)

```
┌─────────────────────────────────────────────────────────────┐
│ PageHeader: "Độ tươi mới của nguồn tri thức"  [Refresh]    │
├─────────────────────────────────────────────────────────────┤
│ ● Còn mới (4)    ⚠ Gần hết hạn (1)    🔴 Hết hạn (1)      │
├─────────────────────────────────────────────────────────────┤
│ SAP B1         | Lần cuối: 2h trước  | Ngưỡng: 24h  | ● OK  │
│ KiotViet       | Lần cuối: 3h trước  | Ngưỡng: 24h  | ● OK  │
│ Haravan        | Lần cuối: 6h trước  | Ngưỡng: 12h  | ⚠ 6h  │
│ Excel Q1       | Lần cuối: 8 ngày    | Ngưỡng: 7 ngày| 🔴 Stale│
├─────────────────────────────────────────────────────────────┤
│ Tài liệu ảnh hưởng bởi nguồn Stale: 3 tài liệu [Xem →]    │
└─────────────────────────────────────────────────────────────┘
```

#### Design Token Values

| Element | Property | Token / Value |
|---------|----------|---------------|
| OK row bg | `background` | transparent |
| Stale row bg | `background` | `--color-danger-bg` (#FEF2F2) |
| Warning row bg | `background` | `--color-warning-bg` (#FEF3C7) |
| Days-since-refresh | Caption 12px/500 | Red nếu stale |
| Affected docs link | Body Small 13px/500, --color-primary | |

---

### Screen S4: Conflict View

#### Layout (ASCII Wireframe)

```
┌─────────────────────────────────────────────────────────────┐
│ PageHeader: "Xung đột nguồn dữ liệu"                        │
├─────────────────────────────────────────────────────────────┤
│ [Mở ▼] [Đã giải quyết ▼]                                   │
├─────────────────────────────────────────────────────────────┤
│ ⚡ Xung đột tồn kho    KiotViet vs SAP B1  Pricing  Mở     │
│   Tồn kho size 40 màu đen: KiotViet=5, SAP B1=0            │
│   Quy tắc ưu tiên: SAP B1 (ERP)          [Giải quyết →]   │
│                                                              │
│ ✓ Xung đột giá       Haravan vs SAP B1  Resolved 12/4      │
└─────────────────────────────────────────────────────────────┘
```

---

### Screen S5: Conflict Resolution Modal

```
┌─────────────────────────────────────────────────────────────┐
│ "Giải quyết xung đột"                              [✕]     │
│                                                             │
│ Xung đột: KiotViet vs SAP B1 — tồn kho size 40             │
│ Quy tắc hiện tại: SAP B1 ưu tiên                           │
│                                                             │
│ Loại giải quyết:                                           │
│ ● Giữ quy tắc ưu tiên hiện tại                            │
│ ○ Override: dùng KiotViet cho trường hợp này                │
│ ○ Escalate: cần xem xét thêm                                │
│                                                             │
│ Ghi chú (bắt buộc): *                                      │
│ [SAP B1 là nguồn chính xác — KiotViet chưa đồng bộ...]     │
│                                                             │
│              [Hủy]  [Xác nhận giải quyết →]                │
└─────────────────────────────────────────────────────────────┘
```

---

### Screen S6: Restrict Source Modal

```
┌─────────────────────────────────────────────────────────────┐
│ ⚠ Xác nhận khóa nguồn                             [✕]     │
│                                                             │
│ Nguồn: Excel Q1 Promotions                                  │
│ Tác động: 3 tài liệu đang dùng nguồn này sẽ bị đánh dấu   │
│ "Nguồn không hợp lệ" — M09 và M10 sẽ không dùng           │
│ các tài liệu này cho answer mới.                           │
│                                                             │
│ Lý do khóa (bắt buộc): *                                   │
│ [Dữ liệu đã lỗi thời, chờ cập nhật từ SAP B1...]           │
│                                                             │
│              [Hủy]  [Xác nhận khóa nguồn]                  │
└─────────────────────────────────────────────────────────────┘
```

---

## 4. Data Binding

| UI Element | API Endpoint | Field | Format |
|-----------|-------------|-------|--------|
| Source registry | `GET /mia/knowledge/sources` | `registry_list`, `health_flags`, `trust_level`, `freshness`, `allowed_usage` | Array |
| Create source | `POST /mia/knowledge/sources` | `source_type`, `system_name`, `owner_department`, `reference`, `notes` | POST body |
| Source rules | `POST /mia/knowledge/source-rules` | `source_id`, `trust_level`, `allowed_personas[]`, `allowed_channels[]`, `freshness_rule_id` | POST body |
| Freshness board | `GET /mia/knowledge/freshness` | `stale/conflict snapshot` | Object |
| Conflict resolution | `POST /mia/knowledge/source-conflicts/:id/resolve` | `resolution_type`, `resolved_by`, `resolution_note` | POST body |

---

## 5. State Matrix

### Source Status States

| Status | Display | Color | Meaning |
|--------|---------|-------|---------|
| Active | ● Active | Success green | Đang dùng, fresh |
| Warning | ⚠ Gần hết hạn | Warning yellow | Sắp stale |
| Stale | 🔴 Hết hạn | Danger red | Vượt freshness threshold |
| Conflict | ⚡ Xung đột | Danger red | Mâu thuẫn với source khác |
| Restricted | ○ Bị khóa | Muted gray | Không được dùng cho runtime |
| Deprecated | — (ẩn) | N/A | Không còn active |

### Conflict Case States

| Status | Badge | Color |
|--------|-------|-------|
| Open | Mở | Red |
| In Progress | Đang xử lý | Yellow |
| Resolved | Đã giải quyết | Green |
| Escalated | Đã escalate | Orange |

---

## 5.1 Error & Recovery

### Common Errors

| Error ID | At Step | Error Description | System Assistance | Recovery Action |
|----------|---------|-------------------|-------------------|----------------|
| E1 | Create source | Required field trống | Inline validation | Focus field |
| E2 | Resolution modal | Note trống khi submit | "Vui lòng nhập ghi chú trước khi giải quyết" | Focus textarea |
| E3 | Restrict modal | Note trống | Như E2 | Focus textarea |
| E4 | Conflict | Priority rule chưa có | Warning: "Conflict sẽ chặn answer nếu không resolve" | Gợi ý action |
| E5 | Freshness board | Source không phát signal | "Không nhận được dữ liệu từ nguồn này — liên hệ IT" | Link contact |

### Dead-End Prevention Checklist

- [x] Conflict case không được close mà không có resolution note
- [x] Restrict source hiện impact preview rõ trước confirm
- [x] Stale badge hiện ngay trên source registry — không phải chỉ trong freshness board
- [x] Affected documents từ stale/restricted source được link trực tiếp

---

## 6. Copy & Microcopy (Vietnamese)

| Element | Vietnamese Text | Max Length |
|---------|----------------|-----------|
| Page title — Registry | Quản lý nguồn tri thức | 28 chars |
| Page title — Freshness | Độ tươi mới của nguồn | 25 chars |
| Page title — Conflict | Xung đột nguồn dữ liệu | 28 chars |
| Status — Active | Đang hoạt động | 18 chars |
| Status — Stale | Hết hạn cập nhật | 20 chars |
| Status — Conflict | Xung đột | 10 chars |
| Status — Restricted | Bị khóa | 10 chars |
| Trust — Cao | Độ tin cậy cao | 18 chars |
| Trust — Trung | Độ tin cậy trung bình | 25 chars |
| Trust — Thấp | Độ tin cậy thấp | 18 chars |
| Resolve button | Giải quyết | 12 chars |
| Restrict button | Khóa nguồn | 12 chars |
| Restrict modal title | Xác nhận khóa nguồn | 25 chars |
| Restrict impact | [N] tài liệu đang dùng nguồn này sẽ bị ảnh hưởng. | 55 chars |
| Resolution note label | Ghi chú (bắt buộc) | 22 chars |
| Resolve success | Đã giải quyết xung đột thành công. | 40 chars |
| Restrict success | Nguồn đã được khóa. M09 và M10 đã cập nhật. | 50 chars |

---

## 7. Interaction & Animation

| Interaction | Animation | Duration | Easing |
|------------|-----------|----------|--------|
| Page enter | Fade in | 200ms | ease-out |
| Source row click → S2 | Navigate + fade | 200ms | ease-out |
| Stale badge | Pulse once on mount | 600ms | ease-in-out |
| Modal open | Scale(0.95→1) + fade | 250ms | ease-out |
| Freshness board refresh | Skeleton → data | 200ms | ease-out |
| Conflict resolve success | Row fade-green then normal | 500ms | ease-in-out |

---

## 8. Accessibility

- [x] `aria-label` trên status dots (color + icon không đủ cho screen reader)
- [x] `aria-live="polite"` trên freshness board last-refreshed timestamp
- [x] `aria-required="true"` trên resolution/restrict note textarea
- [x] `role="status"` trên source health summary stats
- [x] Modal focus trap + ESC đóng (nếu form chưa có dữ liệu)
- [x] Conflict table: `role="table"` với proper headers

### Contrast Check

| Element | FG | BG | Target Ratio |
|---------|----|----|------|
| Body text | #1E293B | #FFFFFF | ≥ 7:1 |
| Stale row text | #DC2626 | #FEF2F2 | ≥ 4.5:1 |
| Warning row text | #D97706 | #FEF3C7 | ≥ 4.5:1 |
| Trust Cao text | #16A34A | #DCFCE7 | ≥ 4.5:1 |

---

## 9. A05 Technical Cross-Check

| Item | Verdict | Notes |
|------|---------|-------|
| Component mapping | ✓ | Table, Badge, Modal, StatusDot từ design system |
| Token compatibility | ✓ | Tokens chuẩn |
| Animation practical | ✓ | Pulse + fade nhẹ |
| Responsive aligns | ✓ | Registry scroll horizontal ở mobile |
| Data binding matches API | ✓ | Map đủ từ SRS |
| Shared components | Reuse Badge từ KNW-001; Modal từ KNW-002 |

**A05 Sign-Off**: Pending (2026-04-16)

---

## 10. Pre-Delivery Checklist (A07)

- [ ] Source registry list với status dots + trust badges
- [ ] Summary stat bar (Tổng / Cần xử lý / Stale / Conflict)
- [ ] Freshness board với days-since-refresh + threshold comparison
- [ ] Stale row highlight (--color-danger-bg)
- [ ] Conflict view với case list + detail
- [ ] Conflict resolution modal — note bắt buộc
- [ ] Restrict source modal — impact preview + note bắt buộc
- [ ] Create/Edit source form
- [ ] Audit log collapse/expand trong source detail
- [ ] Responsive: registry scroll horizontal ở mobile
- [ ] 100% Vietnamese copy
- [ ] `prefers-reduced-motion` handled
- [ ] Accessibility: aria-label on status dots, focus trap, role="table"

**A06 Design Sign-Off**: Approved (2026-04-17) — 3 source types (SAP B1/KiotViet/Excel); freshness threshold 1 giờ cho tất cả; Freshness Board và Source Registry screens đủ; Restrict modal impact-count là good UX.
**A05 Tech Sign-Off**: Approved (2026-04-17) — 1-hour threshold unified; 3 source types đơn giản hơn dự kiến; conflict resolution defer sang BE phase không ảnh hưởng FE Preview.
**PM Gate**: Approved (2026-04-17) — Source types và freshness SLA đã chốt. Ready for A07 FE build (mock/stub only).
