# UXUI Feature Spec: F-M03-PRC-001 Pricing Resolution

**Feature ID**: F-M03-PRC-001
**Status**: UXUI Approved
**Owner**: A06 UI/UX Agent
**Implementation Reviewer**: A05 Tech Lead
**Implemented By**: A07 FE Builder
**Product**: MIA Smart / Platform
**Design System Reference**: `Design/Design_System.md`
**Save to**: `Analysis/Features/Modules/Catalog_And_Commerce/Pricing/UXUI/UXUI-F-M03-PRC-001_Pricing_Resolution.md`
**Date**: 2026-04-17
**Last Status Change**: 2026-04-17 (Draft → UXUI Approved)
**SRS Reference**: `../SRS/F-M03-PRC-001_Pricing_SRS.md` — SRS Ready

---

> **Precondition**: SRS F-M03-PRC-001 đã ở trạng thái `SRS Ready`. Spec này dùng cho gating và FE build handoff.

---

## §0. User & Task

### Target User Role(s)

| Role | Mô tả | Context |
|------|--------|---------|
| Sales / Vận hành bán lẻ | Cần biết giá bán đúng theo kênh / cửa hàng | Đang tư vấn khách, cần quote giá chính xác |
| CSKH / Ecommerce | Tra giá online để tư vấn qua chat | Cần giá Haravan + CTKM nếu có |
| Marketing / Trade Marketing | Xem CTKM theo channel/store type | Lên kế hoạch campaign |
| Finance / Pricing Control | Tra source-priority rule, audit conflict | Kiểm soát giá, không được qua chatbot |

### Primary Task Objective

> Sales tra được giá bán đúng cho một SKU theo đúng kênh / loại cửa hàng trong ≤ 3 giây, với CTKM áp dụng (nếu có) và nguồn giá rõ ràng. Giá nhập / margin không bao giờ xuất hiện.

### Success Metric

| Metric | Target | Cách đo |
|--------|--------|---------|
| Pricing resolution time | ≤ 3s cho 95% queries | Server timing |
| Cost field exposure | 0 lần giá nhập / margin lộ | Audit log |
| Conflict display rate | 100% conflict được hiển thị, không tự chọn | Log pricing_conflict_count |
| Missing rule escalation | 100% missing rule dẫn đến CTA Finance | Log missing_rule_count |

### Failure Indicators

- Sales nhận được giá nhập hoặc margin qua bất kỳ path nào
- Conflict giá giữa SAP B1 và Haravan bị ẩn, hệ thống tự chọn một bên
- CTKM cửa hàng chính hãng và đại lý bị gộp chung mà không phân biệt context
- Giá stale không có badge cảnh báo

---

## 1. Feature Overview

### Purpose

Cung cấp UI tra cứu giá với context đầy đủ: kênh bán, loại cửa hàng, CTKM áp dụng. Mọi answer đều có source trace và deterministic resolution theo rule. Không bao giờ trả giá nhập / giá vốn qua bất kỳ role nào.

### User Persona

**Primary**: Sales tại cửa hàng chính hãng — cần biết giá sau CTKM 20% CHS khi tư vấn khách.

**Secondary**: CSKH ecommerce — cần giá online Haravan với CTKM campaign đang active.

### User Story

```
Là Sales tại cửa hàng chính hãng,
Tôi muốn biết giá bán mã BQ001 sau CTKM đang áp dụng,
Để báo giá đúng cho khách mà không cần hỏi lại quản lý.
```

### Linked Artifacts

| Artifact | Location | Status |
|----------|----------|--------|
| Feature SRS | `../SRS/F-M03-PRC-001_Pricing_SRS.md` | SRS Ready |
| Business Rules | SRS §11 | Approved by BO 2026-04-17 |
| Promotion Module | `../../Promotion/SRS/F-M04-PRO-001_Promotion_SRS.md` | SRS Ready |

---

## 2. Screen Inventory

| # | Screen Name | Route / Path | Purpose |
|---|-------------|-------------|---------|
| S1 | Pricing Query | `/catalog/pricing` | Nhập SKU + context, xem giá |
| S2 | Price Answer Card | Inline trong S1 | Hiển thị giá kết luận với đầy đủ context |
| S3 | Pricing Conflict State | Inline trong S2 | Khi giá conflict giữa nguồn |
| S4 | Missing Rule State | Inline trong S2 | Khi không có rule cho context |
| S5 | Finance Trace Drawer | Drawer overlay | Finance xem source-priority rule + audit |

---

## 2.1 Task Flow

### Primary Task Flow — Sales (Safe Mode)

| Step | User Action | System Response | Field Visibility | Notes |
|------|------------|-----------------|-----------------|-------|
| 1 | Nhập SKU hoặc chọn từ M01 | Resolve canonical product key | SKU + tên | Có thể đến từ M01 cross-module CTA |
| 2 | Chọn context: kênh (POS / ecommerce / đại lý) + loại cửa hàng (chính hãng / nhượng quyền) | System xác định context | Context selector | Mặc định theo role/location user |
| 3 | Xem giá kết luận | System tra `source_priority_rule` → giá cơ sở SAP B1 + CTKM KiotViet (nếu có) | `base_price`, `promo_applied`, `final_price`, `context_applied`, `source` | Giá nhập bị mask hoàn toàn |
| 4 | (Optional) Xem chi tiết CTKM | Expand CTKM section: tên, điều kiện, hiệu lực, nguồn | CTKM detail | |
| 5 | (Optional) Finance click "Xem nguồn rule" | Mở S5 Finance Trace Drawer | Source-priority rule + audit log | Chỉ Finance role |

### Decision Points & Branching

| Tại Step | Điều kiện | Phân nhánh |
|----------|-----------|-----------|
| Step 3 | Giá SAP B1 ≠ Haravan ngoài CTKM đã biết | S3 Conflict state → CTA Finance |
| Step 3 | Không có source-priority rule cho context | S4 Missing rule state → CTA Finance |
| Step 3 | Giá stale > threshold | Stale badge + gợi ý refresh |
| Step 3 | User là Sales | Giá nhập / margin bị mask hoàn toàn |
| Step 5 | User không phải Finance | Drawer button không render |

---

## 3. Visual Specification (Per Screen)

### Screen S2: Price Answer Card

#### Layout (ASCII Wireframe)

```
┌───────────────────────────────────────────────────────┐
│ Giá bán — Giày Da Nam BQ001                          │
│ Kênh: POS  ·  Loại CH: Chính hãng                    │
├───────────────────────────────────────────────────────┤
│ Giá niêm yết          850,000 đ                       │
│ CTKM đang áp dụng     Giảm 20% CHS        [Chi tiết] │
│ ─────────────────────────────────────────────────────│
│ Giá sau CTKM          680,000 đ           ★ Kết luận │
├───────────────────────────────────────────────────────┤
│ Nguồn: SAP B1 (giá gốc) + KiotViet (CTKM)           │
│ [Realtime] · Cập nhật: 10:05 hôm nay                │
├───────────────────────────────────────────────────────┤
│ [Xem CTKM khác]      [Xem tồn kho]    [Xem nguồn ▼] │
└───────────────────────────────────────────────────────┘
```

#### Component Breakdown

| Component | Token | Notes |
|-----------|-------|-------|
| Card container | `--shadow-1`, `--radius-md`, `--space-5` | |
| Section header | Body 12px uppercase `--color-text-muted` | "GIÁ BÁN — {TÊN SP}" |
| Context pills | Label 11px `--color-surface-2` | "POS", "Chính hãng" |
| Giá gốc | Body 14px `--color-text-muted` | Strikethrough nếu có CTKM |
| CTKM label | Label 13px `--color-warning` | Tên CTKM + % |
| Giá kết luận | H2 22px/700 `--color-primary` | Số lớn nhất trên card |
| Kết luận badge | Label 11px/600 `--color-primary-light` | "★ Kết luận" |
| Source info | Body 12px `--color-text-muted` | Nguồn từng phần tính giá |
| Freshness badge | Giống M01/M02 | |

#### Giá nhập / Margin — KHÔNG CÓ trên UI

> Không có bất kỳ field nào liên quan đến giá nhập, giá vốn, margin trong toàn bộ component tree. BE không trả field này về, FE không render placeholder. Đây là hard rule, không có exception.

---

### Screen S3: Conflict State

```
┌───────────────────────────────────────────────────────┐
│ ⚠️  Giá chưa đồng nhất giữa các nguồn                 │
├───────────────────────────────────────────────────────┤
│ SAP B1 (giá gốc):   850,000 đ                        │
│ Haravan (online):    780,000 đ   ← Lệch ngoài CTKM  │
│                                                       │
│ Chênh lệch: 70,000 đ — cần xác nhận từ Finance       │
├───────────────────────────────────────────────────────┤
│ [Liên hệ Finance để xác nhận]   [Tra lại sau]        │
└───────────────────────────────────────────────────────┘
```

- Không trả giá kết luận khi conflict — chỉ hiển thị hai nguồn và chênh lệch
- CTA "Liên hệ Finance" là action bắt buộc, không optional

---

### Screen S4: Missing Rule State

```
┌───────────────────────────────────────────────────────┐
│ ℹ️  Chưa có quy tắc giá cho context này               │
├───────────────────────────────────────────────────────┤
│ Sản phẩm: BQ001                                       │
│ Kênh: Wholesale  ·  Loại CH: Đại lý chiến lược       │
│                                                       │
│ Chưa có rule giá được cấu hình cho context này.      │
│ Vui lòng liên hệ Finance để bổ sung rule.            │
├───────────────────────────────────────────────────────┤
│ [Liên hệ Finance]   [Thử context khác]               │
└───────────────────────────────────────────────────────┘
```

---

## 4. Data Binding

| UI Element | API | Field | Format | Notes |
|-----------|-----|-------|--------|-------|
| Tên sản phẩm | M01 | `name_canonical` | String | |
| Context pills | User input | `channel`, `store_type` | Enum | |
| Giá niêm yết | `POST /mia/pricing/query` | `base_price` | Number → `{N},000 đ` | |
| CTKM label | | `promotion_applied.name` | String | |
| CTKM % | | `promotion_applied.discount_pct` | Number → "Giảm X%" | |
| Giá kết luận | | `final_price` | Number → `{N},000 đ` | |
| Source | | `source` | String | Multi-source: "SAP B1 + KiotViet" |
| Context applied | | `context_applied` | Object | `channel + store_type` |
| Freshness | | `freshness_level` | Enum | Badge |
| Synced at | | `synced_at` | ISO8601 | Relative |
| Conflict flag | | `conflict_flag` (derived từ `warnings[]`) | Boolean | S3 nếu true |
| Missing rule | | error `PRC-001` | Boolean | S4 nếu true |

**Giá nhập / Margin**: Không có field nào trong API response trả về cho Sales projection. BE enforces.

---

## 5. State Matrix

### Page-Level States

| State | Trigger | Visual |
|-------|---------|--------|
| **Idle** | Vào trang | Form context, search box |
| **Loading** | Query đang chạy | Card skeleton |
| **Resolved** | Giá tính được, không conflict | S2 full card |
| **Resolved + CTKM** | Giá có CTKM overlay | S2 với giá gốc strikethrough + giá sau CTKM |
| **Conflict** | `PRC-002` | S3 conflict state |
| **Missing rule** | `PRC-001` | S4 missing rule |
| **Stale** | `PRC-003` | S2 + vàng stale badge |
| **Error** | API fail | Error card + retry |

---

## 5.1 Error & Recovery

| Error ID | Mô tả | System Assistance | Recovery |
|----------|-------|-------------------|---------|
| E1 (PRC-001) | Không có rule cho context | S4 + "Liên hệ Finance để bổ sung rule" | CTA Finance |
| E2 (PRC-002) | Conflict giá giữa nguồn | S3 + hiển thị 2 giá + chênh lệch | CTA Finance xác nhận |
| E3 (PRC-003) | Giá stale vượt threshold | Stale badge + "Cập nhật?" | Refresh button |
| E4 | Giá nhập bị request | Block + không render (BE enforce) | N/A |
| E5 | API timeout | "Đã xảy ra lỗi. Thử lại?" | Retry 1 lần auto |

---

## 6. Copy & Microcopy (Tiếng Việt)

| Element | Nội dung | Max Length |
|---------|---------|-----------|
| Page title | "Tra cứu giá bán" | 20 |
| Context label channel | "Kênh bán" | 10 |
| Context label store type | "Loại cửa hàng" | 15 |
| Giá niêm yết | "Giá niêm yết" | 15 |
| CTKM label | "CTKM đang áp dụng" | 20 |
| Giá kết luận | "Giá sau CTKM" / "Giá bán" | 15 |
| Kết luận badge | "★ Kết luận" | 12 |
| Source prefix | "Nguồn:" | 7 |
| Conflict warning | "Giá chưa đồng nhất giữa các nguồn" | 40 |
| Conflict CTA | "Liên hệ Finance để xác nhận" | 35 |
| Missing rule | "Chưa có quy tắc giá cho context này" | 40 |
| Missing rule CTA | "Liên hệ Finance để bổ sung rule" | 35 |
| Stale warning | "Dữ liệu giá đã cũ · Cập nhật?" | 35 |
| Cost hidden notice | (không có — field không tồn tại trên UI) | — |

---

## 7. Interaction & Animation

| Interaction | Animation | Duration |
|------------|-----------|----------|
| Card mount | Fade in + slide up 6px | 200ms |
| CTKM expand | Slide down | 150ms |
| Conflict card reveal | Slide down | 200ms |
| Finance trace drawer | Slide in từ phải | 250ms |
| Stale badge pulse | 1 lần khi mount | 600ms |

---

## 8. Accessibility

- [ ] `aria-live="polite"` cho price answer khi context thay đổi
- [ ] Giá kết luận có `aria-label`: "Giá bán sau khuyến mãi: {N} đồng"
- [ ] Conflict state có `role="alert"`
- [ ] Finance drawer: focus trap khi mở, trả focus về CTA khi đóng
- [ ] Màu không phải indicator duy nhất — mọi state có icon + text

---

## 9. A05 Technical Cross-Check

> **Reviewed by**: A05 Tech Lead (Claude / Antigravity)
> **Date**: 2026-04-17
> **Result**: ✅ Pass — recommended for UXUI Approved

| Item | Verdict | Notes |
|------|---------|-------|
| Cost field zero-trust | ✅ Pass | **Critical**: BE không được đưa `cost_price`, `margin`, `supplier_cost` vào bất kỳ response nào cho non-Finance role. FE không render placeholder. Không phải "hide" mà là "không tồn tại". |
| Conflict detection server-side | ✅ Pass | FE chỉ render conflict state từ BE flag `conflict_flag`. FE không tự so sánh giá giữa nguồn. |
| Source priority rule deterministic | ✅ Pass | Cùng input (sku + channel + store_type + date) → cùng output. A08 cần unit test case này. |
| CTKM layering (base + overlay) | ✅ Pass | Tách biệt `base_price` và `promotion_applied` trong response. FE render riêng lỳ, không gộp. |
| Finance drawer role-gate | ✅ Pass | BE check role trước khi trả audit data. FE không render drawer button nếu payload không có audit data. |
| Context selector default | ✅ Pass | Default context = role/location của user. A08 cần điền `channel` + `store_type` mặc định từ user session. |
| Strikethrough giá gốc | ✅ Pass | Chỉ strikethrough khi có `promotion_applied`. Nếu không có CTKM, hiển `base_price` là “Giá bán”, không có strikethrough. |
| Stale badge và refresh | ✅ Pass | Refresh button trigger re-query với `force_realtime=true`. A08 cần hỗ trợ query param này. |

**A06 Design Sign-Off**: A06 (Claude / Antigravity) — 2026-04-17
**A05 Tech Sign-Off**: A05 (Claude / Antigravity) — 2026-04-17

---

## 10. Pre-Delivery Checklist (A07)

- [ ] Giá nhập / margin / supplier không thể render ở bất kỳ state nào
- [ ] Conflict state hiển thị đúng 2 nguồn + chênh lệch + CTA Finance
- [ ] Missing rule state hiển thị đúng + CTA Finance
- [ ] CTKM overlay: giá gốc strikethrough + giá sau CTKM nổi bật — strikethrough chỉ khi có CTKM
- [ ] Khi không có CTKM: hiển `base_price` là "Giá bán", không strikethrough
- [ ] Stale badge với timestamp + refresh button (`force_realtime=true`)
- [ ] Context selector (kênh + store type) hoạt động đúng, default từ session
- [ ] Finance trace drawer chỉ render với Finance role
- [ ] 100% Vietnamese copy
- [ ] Touch targets ≥ 44x44px

**A06 Design Sign-Off**: A06 (Claude / Antigravity) — 2026-04-17
**A05 Tech Sign-Off**: A05 (Claude / Antigravity) — 2026-04-17
**PM Gate**: Chờ BO review trước khi handoff FE Build
