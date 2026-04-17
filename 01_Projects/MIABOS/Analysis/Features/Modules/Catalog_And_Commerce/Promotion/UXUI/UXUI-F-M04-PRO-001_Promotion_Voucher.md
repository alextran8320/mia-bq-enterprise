# UXUI Feature Spec: F-M04-PRO-001 Promotion & Voucher

**Feature ID**: F-M04-PRO-001
**Status**: UXUI Approved
**Owner**: A06 UI/UX Agent
**Implementation Reviewer**: A05 Tech Lead
**Implemented By**: A07 FE Builder
**Product**: MIA Smart / Platform
**Design System Reference**: `Design/Design_System.md`
**Save to**: `Analysis/Features/Modules/Catalog_And_Commerce/Promotion/UXUI/UXUI-F-M04-PRO-001_Promotion_Voucher.md`
**Date**: 2026-04-17
**Last Status Change**: 2026-04-17 (Draft → UXUI Approved)
**SRS Reference**: `../SRS/F-M04-PRO-001_Promotion_SRS.md` — SRS Ready

---

> **Precondition**: SRS F-M04-PRO-001 đã ở trạng thái `SRS Ready`. Spec này dùng cho gating và FE build handoff.

---

## §0. User & Task

### Target User Role(s)

| Role | Mô tả | Context |
|------|--------|---------|
| Sales / Vận hành bán lẻ | Cần biết CTKM nào đang áp dụng tại cửa hàng | Đang tư vấn khách về giá và ưu đãi |
| CSKH | Tra CTKM để tư vấn qua chat / call | Trả lời "có CTKM gì không?" |
| Marketing / Ecommerce | Xem toàn bộ CTKM theo channel để kiểm soát campaign | Lên kế hoạch / kiểm tra |
| AI Sales Advisor (M10) | Query CTKM tự động | Tích hợp API |

### Primary Task Objective

> Sales / CSKH tra được CTKM đang áp dụng cho một sản phẩm theo đúng channel / cửa hàng trong ≤ 3 giây, với điều kiện và hiệu lực rõ ràng. CTKM internal-only (do Marketing flag) không bao giờ hiện với CSKH hoặc chatbot ngoài.

### Success Metric

| Metric | Target | Cách đo |
|--------|--------|---------|
| CTKM resolution time | ≤ 3s cho 95% queries | Server timing |
| Internal-only filter rate | 100% CTKM `internal_only` bị ẩn với public-safe | Log `public_safe_block_count` |
| Condition display rate | 100% CTKM có điều kiện hiển thị rõ | Không có "có CTKM" mà thiếu điều kiện |
| Expired CTKM suppression | 100% CTKM hết hạn không xuất hiện | |

### Failure Indicators

- CSKH báo khách "có CTKM X" nhưng CTKM đó là internal-only
- User thấy CTKM nhưng không biết điều kiện áp dụng (tối thiểu mua bao nhiêu, cho ai)
- CTKM hết hạn vẫn xuất hiện trong answer
- Conflict giữa KiotViet và Haravan bị ẩn, hệ thống tự chọn một bên

---

## 1. Feature Overview

### Purpose

Hiển thị CTKM / voucher đang active theo đúng context (channel + store type + customer group), với điều kiện và hiệu lực đầy đủ. Tất cả CTKM active mặc định là public-safe; Marketing mới có quyền flag `internal_only` để ẩn khỏi chatbot ngoài.

### User Persona

**Primary**: CSKH trả lời câu hỏi "shop đang có CTKM gì không?" qua Zalo / Facebook.

**Secondary**: Sales tại cửa hàng chính hãng xác nhận CTKM 20% CHS khi tư vấn.

### User Story

```
Là CSKH,
Tôi muốn biết CTKM nào đang áp dụng cho sản phẩm khách quan tâm,
Để tư vấn đúng và không báo sai ưu đãi cho khách.
```

### Linked Artifacts

| Artifact | Location | Status |
|----------|----------|--------|
| Feature SRS | `../SRS/F-M04-PRO-001_Promotion_SRS.md` | SRS Ready |
| Business Rules | SRS §11 | Approved by BO 2026-04-17 |
| Pricing Module | `../../Pricing/SRS/F-M03-PRC-001_Pricing_SRS.md` | SRS Ready |

---

## 2. Screen Inventory

| # | Screen Name | Route / Path | Purpose |
|---|-------------|-------------|---------|
| S1 | Promotion Query | `/catalog/promotions` | Nhập SKU + context, xem CTKM |
| S2 | Promotion Answer Card | Inline trong S1 | Danh sách CTKM áp dụng |
| S3 | Promotion Detail | Drawer / expand | Xem điều kiện + hiệu lực đầy đủ |
| S4 | No Promotion State | Inline trong S2 | Khi không có CTKM nào phù hợp |
| S5 | Conflict State | Inline trong S2 | Khi KiotViet và Haravan conflict |
| S6 | Marketing Campaign View | `/catalog/promotions/all` | Marketing xem toàn bộ theo channel |

---

## 2.1 Task Flow

### Primary Task Flow — Sales / CSKH

| Step | User Action | System Response | Field Visibility | Notes |
|------|------------|-----------------|-----------------|-------|
| 1 | Nhập SKU hoặc tên sản phẩm | Resolve canonical key từ M01 | Tên + SKU | Có thể đến từ M01 cross-module |
| 2 | Xác nhận context: kênh + loại cửa hàng | System xác định `channel` + `store_type` | Context pills | Mặc định theo role của user |
| 3 | Xem danh sách CTKM đang active cho context này | System query `promotion_read_model`, filter theo: còn hiệu lực + scope match + public-safe whitelst | CTKM list | CTKM `internal_only` bị filter ra khỏi response |
| 4 | Click vào CTKM để xem điều kiện chi tiết | Mở S3 Promotion Detail | Tên + % giảm + điều kiện + hiệu lực + nguồn | |
| 5 | (Optional) Marketing click "Xem tất cả theo channel" | Mở S6 Campaign View | Toàn bộ CTKM active + internal flag | Chỉ Marketing role |

### Decision Points & Branching

| Tại Step | Điều kiện | Phân nhánh |
|----------|-----------|-----------|
| Step 3 | Không có CTKM nào phù hợp | S4 No promotion state |
| Step 3 | Conflict KiotViet vs Haravan | S5 Conflict state + CTA Marketing |
| Step 3 | User là CSKH public-safe | CTKM `internal_only` filter ra hoàn toàn |
| Step 3 | CTKM hết hiệu lực | Bị filter, không hiển thị |

---

## 3. Visual Specification (Per Screen)

### Screen S2: Promotion Answer Card

#### Layout (ASCII Wireframe)

```
┌───────────────────────────────────────────────────────┐
│ CTKM đang áp dụng — Giày Da Nam BQ001                │
│ Kênh: POS  ·  Loại CH: Chính hãng                    │
├───────────────────────────────────────────────────────┤
│ ┌─────────────────────────────────────────────────┐   │
│ │ 🏷️  CTKM Tháng 4 — Giảm 20% CHS               │   │
│ │     Áp dụng: Cửa hàng chính hãng               │   │
│ │     Hiệu lực: 01/04 – 30/04/2026               │   │
│ │     Nguồn: KiotViet                [Chi tiết →] │   │
│ └─────────────────────────────────────────────────┘   │
│ ┌─────────────────────────────────────────────────┐   │
│ │ 🏷️  Quà tặng khi mua 2 đôi                     │   │
│ │     Áp dụng: Tất cả cửa hàng                   │   │
│ │     Hiệu lực: Không giới hạn                   │   │
│ │     Nguồn: KiotViet                [Chi tiết →] │   │
│ └─────────────────────────────────────────────────┘   │
├───────────────────────────────────────────────────────┤
│ [Xem giá sau CTKM]       [Xem tất cả CTKM ▼]        │
└───────────────────────────────────────────────────────┘
```

#### Component Breakdown

| Component | Token | Notes |
|-----------|-------|-------|
| Card container | `--shadow-1`, `--radius-md`, `--space-5` | |
| CTKM item card | `--radius-sm`, border-left 3px `--color-warning` | Highlight trái |
| CTKM icon | 🏷️ hoặc Lucide `Tag` icon | Không dùng emoji —  dùng Lucide |
| CTKM name | Body 14px/600 `--color-text-primary` | |
| Scope label | Label 12px `--color-text-muted` | "Áp dụng: {scope}" |
| Validity | Label 12px `--color-text-muted` | "{from} – {to}" |
| Source badge | Label 11px `--color-surface-2` | "KiotViet" / "Haravan" / v.v. |
| Detail CTA | Text button 12px `--color-primary` | "Chi tiết →" |

#### CTKM Item States

| State | Visual |
|-------|--------|
| Active / valid | Border-left vàng `--color-warning`, full opacity |
| Sắp hết hạn (≤ 3 ngày) | Badge "Sắp hết hạn" đỏ nhẹ |
| Internal-only (Marketing view only) | Badge "Nội bộ" xám — không hiển thị với CSKH/public |

---

### Screen S3: Promotion Detail Drawer

```
┌──────────────────────────────────────┐
│ CTKM Tháng 4 — Giảm 20% CHS  [✕]   │
├──────────────────────────────────────┤
│ Giảm giá          20%                │
│ Áp dụng cho       Giày Da Nam BQ001  │
│ Loại cửa hàng     Chính hãng         │
│ Kênh              POS                │
│ Điều kiện         Không yêu cầu tối  │
│                   thiểu mua          │
│ Hiệu lực          01/04 – 30/04/2026 │
│ Nguồn             KiotViet (master)  │
│ Mã CTKM           CHS-APR-2026       │
└──────────────────────────────────────┘
```

---

### Screen S4: No Promotion State

```
┌───────────────────────────────────────────────────────┐
│ Không có CTKM đang áp dụng                           │
│                                                       │
│ Không tìm thấy khuyến mãi nào cho:                   │
│ BQ001 · Kênh Wholesale · Đại lý chiến lược           │
│                                                       │
│ [Thử context khác]   [Xem giá bán thông thường]      │
└───────────────────────────────────────────────────────┘
```

- Không để trạng thái này trống hoặc im lặng
- Luôn có 2 CTA thoát

---

### Screen S5: Conflict State

```
┌───────────────────────────────────────────────────────┐
│ ⚠️  Dữ liệu CTKM chưa đồng nhất                      │
├───────────────────────────────────────────────────────┤
│ KiotViet (master): CTKM giảm 20% — còn hiệu lực     │
│ Haravan (sync):    CTKM giảm 15% — đang active       │
│                                                       │
│ Haravan chưa đồng bộ xong từ KiotViet.              │
│ Vui lòng xác nhận với Marketing.                     │
├───────────────────────────────────────────────────────┤
│ [Liên hệ Marketing]        [Dùng dữ liệu KiotViet]   │
└───────────────────────────────────────────────────────┘
```

- KiotViet là master — có thể gợi ý "Dùng dữ liệu KiotViet" nhưng user phải chủ động chọn
- Không auto-resolve

---

## 4. Data Binding

| UI Element | API | Field | Format | Notes |
|-----------|-----|-------|--------|-------|
| Tên SP | M01 | `name_canonical` | String | |
| Context | User input | `channel`, `store_type` | Enum | |
| CTKM list | `POST /mia/promotions/query` | `promotions[]` | Array | Public-safe filtered |
| CTKM name | | `promotions[].name` | String | |
| Discount | | `promotions[].discount` | String | "Giảm X%" hoặc "Tặng Y" |
| Scope | | `promotions[].scope` | Object | `channel + store_type` |
| Valid from/to | | `promotions[].valid_from`, `.valid_to` | ISO8601 → "DD/MM/YYYY" | |
| Source | | `promotions[].source` | String | "KiotViet" / "Haravan" |
| Internal flag | | `promotions[].internal_only` | Boolean | Chỉ Marketing thấy |
| Conflict | | `warnings[]` PRO-002 | Error | S5 nếu có |
| No promo | | `promotions[]` empty | | S4 |

---

## 5. State Matrix

### Page-Level States

| State | Trigger | Visual |
|-------|---------|--------|
| **Idle** | Vào trang | Form context |
| **Loading** | Query đang chạy | Card skeleton |
| **Has promotions** | `promotions[]` có items | S2 list |
| **No promotion** | `promotions[]` empty | S4 empty state |
| **Conflict** | `PRO-002` | S5 conflict |
| **Error** | API fail | Error + retry |

### CTKM Item States

| State | Trigger | Visual |
|-------|---------|--------|
| Active | Còn hiệu lực | Border vàng, full opacity |
| Expiring soon | ≤ 3 ngày | Badge "Sắp hết hạn" đỏ nhẹ |
| Internal (Marketing only) | `internal_only = true` | Badge "Nội bộ" xám |
| Expired | Quá `valid_to` | Bị filter ra — không render |

---

## 5.1 Error & Recovery

| Error ID | Mô tả | System Assistance | Recovery |
|----------|-------|-------------------|---------|
| E1 (PRO-001) | Không có data CTKM | S4 No promo state + 2 CTA | Chọn context khác |
| E2 (PRO-002) | Conflict KiotViet vs Haravan | S5 + hiển thị cả hai + CTA Marketing | User chủ động xác nhận |
| E3 (PRO-003) | Public-safe filter bị fail | Block tất cả — không trả gì | Log + escalate IT |
| E4 | CTKM hết hạn | Bị filter, không render | N/A — prevention |
| E5 | API timeout | "Đã xảy ra lỗi. Thử lại?" | Retry auto 1 lần |

---

## 6. Copy & Microcopy (Tiếng Việt)

| Element | Nội dung | Max Length |
|---------|---------|-----------|
| Page title | "Tra cứu khuyến mãi" | 25 |
| Section header | "CTKM đang áp dụng" | 22 |
| Scope label | "Áp dụng:" | 10 |
| Validity label | "Hiệu lực:" | 10 |
| Source label | "Nguồn:" | 7 |
| Expiring badge | "Sắp hết hạn" | 15 |
| Internal badge | "Nội bộ" | 8 |
| No promo title | "Không có CTKM đang áp dụng" | 35 |
| No promo subtitle | "Không tìm thấy khuyến mãi nào cho context này" | 55 |
| Conflict warning | "Dữ liệu CTKM chưa đồng nhất" | 35 |
| Conflict CTA | "Liên hệ Marketing" | 20 |
| Conflict alt CTA | "Dùng dữ liệu KiotViet" | 25 |
| Detail CTA | "Chi tiết →" | 12 |
| Cross-module pricing | "Xem giá sau CTKM" | 20 |

---

## 7. Interaction & Animation

| Interaction | Animation | Duration |
|------------|-----------|----------|
| Card mount | Fade in | 200ms |
| CTKM list items | Stagger fade in (50ms/item) | Max 400ms total |
| Detail drawer open | Slide in từ phải | 250ms |
| Conflict state reveal | Slide down | 200ms |
| No promo illustration | Fade in | 300ms |

---

## 8. Accessibility

- [ ] `aria-live="polite"` cho CTKM list khi context thay đổi
- [ ] Mỗi CTKM item có `aria-label`: "{Tên CTKM} — áp dụng đến {ngày}"
- [ ] Conflict state có `role="alert"`
- [ ] Internal badge không visible với CSKH (không chỉ CSS hide — BE không trả field)
- [ ] Detail drawer: focus trap + trả focus về item khi đóng

---

## 9. A05 Technical Cross-Check

> **Reviewed by**: A05 Tech Lead (Claude / Antigravity)
> **Date**: 2026-04-17
> **Result**: ✅ Pass — recommended for UXUI Approved

| Item | Verdict | Notes |
|------|---------|-------|
| Public-safe filter BE-enforced | ✅ Pass | **Critical**: FE không nhận `internal_only` items từ BE cho CSKH/Sales role. Không phải filter client-side — field không được tồn tại trong response. |
| KiotViet master priority | ✅ Pass | BE source resolution trước khi trả response. Conflict chỉ xảy ra sau khi đã áp master rule mà vẫn có delta với Haravan. |
| Expired CTKM filter | ✅ Pass | BE filter theo `valid_to < now()` trước khi push vào response. Không phụ thuộc FE. |
| Conflict detection | ✅ Pass | BE detect và trả `PRO-002` warning. FE chỉ render S5 từ flag này. |
| Marketing all-view role gate | ✅ Pass | S6 và `internal_only` field chỉ trả với Marketing role token. A08 enforce trong middleware. |
| “Dùng dữ liệu KiotViet” CTA | ✅ Pass | CTA gợi ý nhưng user phải chủ động click — không auto-resolve. Đúng theo BO decision. |
| Stagger animation CTKM list | ✅ Pass | 50ms/item, max 400ms. Đối với list dài (>8 items), cần cap stagger ở item thứ 8 để tránh perceived delay. |
| Expiring soon logic | ✅ Pass | “Sắp hết hạn” dựa trên `valid_to - now() ≤ 3 days`. BE hoặc FE đều có thể compute — nhưng nên BE để FE không cần timezone logic. |

**A06 Design Sign-Off**: A06 (Claude / Antigravity) — 2026-04-17
**A05 Tech Sign-Off**: A05 (Claude / Antigravity) — 2026-04-17

---

## 10. Pre-Delivery Checklist (A07)

- [ ] CTKM list render đúng với điều kiện + hiệu lực đầy đủ — không có "có CTKM" mà thiếu điều kiện
- [ ] Internal-only CTKM không thể xuất hiện với CSKH / chatbot ngoài
- [ ] Expired CTKM không xuất hiện ở bất kỳ state nào
- [ ] No promo state có 2 CTA, không để trống
- [ ] Conflict state hiển thị đúng + CTA Marketing + ghi rõ KiotViet là master
- [ ] “Dùng dữ liệu KiotViet” là CTA user chủ động chọn, không auto-resolve
- [ ] Expiring badge (≤3 ngày) dựa trên BE-computed flag, không FE timezone logic
- [ ] Stagger animation cap tại item thứ 8 nếu list dài
- [ ] Marketing view có internal badge visible
- [ ] 100% Vietnamese copy
- [ ] Touch targets ≥ 44x44px
- [ ] `prefers-reduced-motion` handled

**A06 Design Sign-Off**: A06 (Claude / Antigravity) — 2026-04-17
**A05 Tech Sign-Off**: A05 (Claude / Antigravity) — 2026-04-17
**PM Gate**: Chờ BO review trước khi handoff FE Build
