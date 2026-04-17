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
**Last Updated By**: A01 PM Agent (Claude Sonnet 4.6 — Claude Code CLI, incorporating research 2026-04-17)
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
| PM Governance | Quản lý vận hành knowledge | Restrict/unrestrict source, xem freshness |
| IT / ERP / Data | Kỹ thuật, quản trị hệ thống | Đăng ký source, monitor sync, cập nhật metadata |
| Tài chính / Pricing Control | Reviewer pricing sources | Xác nhận source liên quan giá/promo |
| Knowledge Owner | Người tạo tài liệu | Link document với source backing |

### Primary Task Objective

> Governance Officer xem được toàn bộ freshness/source health và restrict nguồn rủi ro trong **≤ 3 phút** từ khi mở freshness board — không cần mở nhiều tool khác.

### Success Metric

| Metric | Target | Cách đo |
|--------|--------|---------|
| Source registry load time | ≤ 2s | Đo từ mở trang đến list render |
| Restrict decision time | ≤ 3 phút | Đo từ mở source health đến restrict/unrestrict |
| Stale detection lag | ≤ 15 phút | Đo từ threshold breach đến badge hiển thị |

### Failure Indicators

- PM không thể phân biệt source nào là primary vs supporting
- Stale source không hiển thị rõ — AI vẫn dùng mà không cảnh báo
- Source bị restrict/unrestrict nhưng không có reason note — không audit được
- Governance restrict source nhưng M09/M10 vẫn hiển thị data từ đó
- Governance phải mở route riêng để xem source health, tách khỏi cây nội dung Knowledge Center
- Tài liệu import có ảnh/attachment nhưng source governance không biết asset nào thuộc source nào

---

## 1. Feature Overview

### Purpose

Cung cấp source governance như một section trong `/knowledge` để đăng ký nguồn tri thức, gán trust level và freshness rule, phát hiện stale/restricted state, kiểm soát allowed usage cho AI runtime, và theo dõi tài liệu/assets được import từ nguồn đó. Đây là lớp nền để Knowledge Center không trở thành nguồn không kiểm soát.

### User Persona

PM Governance và IT/ERP tại BQ — người chịu trách nhiệm đảm bảo AI chỉ dùng nguồn đáng tin, fresh, và hợp lệ theo ngữ cảnh.

### User Story

```
Là PM Governance tại Giày BQ,
Tôi muốn biết mọi nguồn tri thức đang ở trạng thái gì
và xử lý được stale/restricted source ngay trên dashboard,
Để AI không trả lời từ nguồn đã lỗi thời hoặc không được phép.
```

### Linked Artifacts — Research Compliance

> Spec này phải tuân thủ 4 Research docs đã được Business Owner approve ngày 2026-04-17:

| Research Doc | Link | Key Principles Applied |
|-------------|------|----------------------|
| Internal Chatbot Concept | [RES-M08-KNW_Internal_Chatbot_Concept.md](../../Research/Knowledge_Center/RES-M08-KNW_Internal_Chatbot_Concept.md) | Pillar 2 Verified KB — owner + expiry feed trực tiếp chatbot behavior |
| Paradigm & Benchmark | [RES-M08-KNW_Paradigm_And_Benchmark.md](../../Research/Knowledge_Center/RES-M08-KNW_Paradigm_And_Benchmark.md) | Verification > Volume; Guru model; Permission-aware retrieval |
| UX Patterns & IA | [RES-M08-KNW_UX_Patterns_And_IA.md](../../Research/Knowledge_Center/RES-M08-KNW_UX_Patterns_And_IA.md) | Stale Content Warning feeds từ source governance; Trust = Citation + Honesty |

### Source → Chatbot Behavior Mapping (bắt buộc implement)

| Source Status | Chatbot Behavior | Visual Indicator |
|--------------|-----------------|-----------------|
| Active + fresh | Retrieve + cite bình thường | Source badge xanh |
| Active + stale (quá review cycle) | Retrieve + stale badge + "chưa review X tháng" | Source badge vàng |
| Restricted | Không retrieve — Uncertainty Signal + escalation | — |
| Inactive | Không retrieve | — |

> A07 phải implement mapping này trong Source Reference Panel (S5 của KNW-001). Source governance data feed từ `knowledge_source_registry`.

### Linked SRS Artifacts

| Artifact | Location | Status |
|----------|----------|--------|
| Feature SRS | [`Analysis/Features/Modules/Knowledge_Center/Knowledge_Documents_And_Source_Governance/SRS/F-M08-KNW-004_Knowledge_Documents_And_Source_Governance_SRS.md`](../../Analysis/Features/Modules/Knowledge_Center/Knowledge_Documents_And_Source_Governance/SRS/F-M08-KNW-004_Knowledge_Documents_And_Source_Governance_SRS.md) | SRS Ready |

---

## 2. Screen Inventory

| # | Screen Name | Route/Path | Purpose | Notes |
|---|-------------|-----------|---------|-------|
| S1 | Source Registry Section | `/knowledge?section=sources` | Danh sách all sources với status health trong workspace chung | Governance section |
| S2 | Source Detail / Edit Panel | `/knowledge/sources/:id` | Chi tiết source + edit rules + audit log + linked documents/assets | Panel/drawer |
| S3 | Freshness Section | `/knowledge?section=freshness` | Overview freshness health theo source | Monitoring section |
| S4 | Restrict Source Modal | Modal trong S1/S2 | Xác nhận restrict với impact preview | Emergency action |

---

## 2.1 Task Flow

### Primary Task Flow — Governance kiểm tra freshness và restrict source

| Step | User Action | System Response | Field Visibility | Notes |
|------|------------|-----------------|-----------------|-------|
| 1 | Mở `/knowledge` và chọn section `Source Health` | Hiển thị sources theo freshness health: OK / Warning / Stale | Status badges, days-since-refresh | Entry monitoring |
| 2 | Thấy source `Stale` hoặc `Restricted risk` | Mở source detail | Source metadata + affected documents | Investigation |
| 3 | Click "Khóa nguồn" nếu nguồn không đủ tin cậy | Mở S4 Restrict Source Modal | Reason note + impact preview | Decision |
| 4 | Nhập reason note + confirm | Ghi audit, update runtime source filter | — | Done |

### Alternate Flow — IT đăng ký source mới

| Step | User Action | System Response | Notes |
|------|------------|-----------------|-------|
| 1 | Click "+ Thêm nguồn" trong Source Registry section | Mở form tạo source | |
| 2 | Điền metadata: source type, system name, owner, reference | Validation required | |
| 3 | Gán trust level, freshness rule, allowed channels/personas | Config gatekeeper | |
| 4 | Submit | Source ở trạng thái Active | |

### Progressive Disclosure Rules

- **Required**: Source name, type, owner, trust level — luôn hiển thị trong registry
- **Optional**: Freshness rule detail, allowed personas, linked documents/assets — expand in source detail
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

### Screen S4: Restrict Source Modal

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
| Freshness board | `GET /mia/knowledge/freshness` | `source_health_snapshot` | Object |
| Linked documents/assets | `GET /mia/knowledge/sources/:id/assets` | `documents[]`, `assets[]`, `affected_count` | Object |

---

## 5. State Matrix

### Source Status States

| Status | Display | Color | Meaning |
|--------|---------|-------|---------|
| Active | ● Active | Success green | Đang dùng, fresh |
| Warning | ⚠ Gần hết hạn | Warning yellow | Sắp stale |
| Stale | 🔴 Hết hạn | Danger red | Vượt freshness threshold |
| Restricted | ○ Bị khóa | Muted gray | Không được dùng cho runtime |
| Deprecated | — (ẩn) | N/A | Không còn active |

---

## 5.1 Error & Recovery

### Common Errors

| Error ID | At Step | Error Description | System Assistance | Recovery Action |
|----------|---------|-------------------|-------------------|----------------|
| E1 | Create source | Required field trống | Inline validation | Focus field |
| E2 | Source rule form | Trust/freshness rule thiếu | "Vui lòng hoàn tất rule nguồn" | Focus missing field |
| E3 | Restrict modal | Note trống | "Vui lòng nhập lý do khóa nguồn" | Focus textarea |
| E4 | Source health | Source bị restricted | Warning: "Nguồn này sẽ không được dùng cho answer mới" | Mở source detail |
| E5 | Freshness board | Source không phát signal | "Không nhận được dữ liệu từ nguồn này — liên hệ IT" | Link contact |

### Dead-End Prevention Checklist

- [x] Restrict source hiện impact preview rõ trước confirm
- [x] Stale badge hiện ngay trên source registry — không phải chỉ trong freshness board
- [x] Affected documents từ stale/restricted source được link trực tiếp

---

## 6. Copy & Microcopy (Vietnamese)

| Element | Vietnamese Text | Max Length |
|---------|----------------|-----------|
| Page title — Registry | Quản lý nguồn tri thức | 28 chars |
| Page title — Freshness | Độ tươi mới của nguồn | 25 chars |
| Status — Active | Đang hoạt động | 18 chars |
| Status — Stale | Hết hạn cập nhật | 20 chars |
| Status — Restricted | Bị khóa | 10 chars |
| Trust — Cao | Độ tin cậy cao | 18 chars |
| Trust — Trung | Độ tin cậy trung bình | 25 chars |
| Trust — Thấp | Độ tin cậy thấp | 18 chars |
| Restrict button | Khóa nguồn | 12 chars |
| Restrict modal title | Xác nhận khóa nguồn | 25 chars |
| Restrict impact | [N] tài liệu đang dùng nguồn này sẽ bị ảnh hưởng. | 55 chars |
| Reason note label | Ghi chú (bắt buộc) | 22 chars |
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
| Restrict success | Row fade-muted then normal | 500ms | ease-in-out |

---

## 8. Accessibility

- [x] `aria-label` trên status dots (color + icon không đủ cho screen reader)
- [x] `aria-live="polite"` trên freshness board last-refreshed timestamp
- [x] `aria-required="true"` trên restrict note textarea
- [x] `role="status"` trên source health summary stats
- [x] Modal focus trap + ESC đóng (nếu form chưa có dữ liệu)

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

- [ ] Source Health section trong `/knowledge` với status dots + trust badges
- [ ] Summary stat bar (Tổng / Cần xử lý / Stale / Restricted)
- [ ] Freshness board với days-since-refresh + threshold comparison
- [ ] Stale row highlight (--color-danger-bg)
- [ ] Restrict source modal — impact preview + note bắt buộc
- [ ] Create/Edit source form
- [ ] Audit log collapse/expand trong source detail
- [ ] Linked documents/assets trong source detail
- [ ] Responsive: registry scroll horizontal ở mobile
- [ ] 100% Vietnamese copy
- [ ] `prefers-reduced-motion` handled
- [ ] Accessibility: aria-label on status dots, focus trap, role="table"

**A06 Design Sign-Off**: Approved (2026-04-17) — 3 source types (SAP B1/KiotViet/Excel); freshness threshold 1 giờ cho tất cả; Source Health section trong `/knowledge`; Restrict modal impact-count và linked assets là required UX.
**A05 Tech Sign-Off**: Approved (2026-04-17) — 1-hour threshold unified; 3 source types đơn giản hơn dự kiến; reconciliation/conflict handling defer sang BE/Catalog & Commerce phase, không nằm trong M08 object model.
**PM Gate**: Approved (2026-04-17) — Source types và freshness SLA đã chốt. Ready for A07 FE build (mock/stub only).
