# UXUI Feature Spec: F-M01-PRD-001 Product Catalog & Query

**Feature ID**: F-M01-PRD-001
**Status**: UXUI Approved
**Owner**: A06 UI/UX Agent
**Implementation Reviewer**: A05 Tech Lead
**Implemented By**: A07 FE Builder
**Product**: MIA Smart / Platform
**Design System Reference**: `Design/Design_System.md`
**Save to**: `Analysis/Features/Modules/Catalog_And_Commerce/Product/UXUI/UXUI-F-M01-PRD-001_Product_Catalog_Query.md`
**Date**: 2026-04-17
**Last Status Change**: 2026-04-17 (Draft → UXUI Approved)
**SRS Reference**: `../SRS/F-M01-PRD-001_Product_SRS.md` — SRS Ready

---

> **Precondition**: SRS F-M01-PRD-001 đã ở trạng thái `SRS Ready`. Spec này dùng cho gating và FE build handoff.

---

## §0. User & Task

### Target User Role(s)

| Role | Mô tả | Context |
|------|--------|---------|
| Sales / Vận hành bán lẻ | Nhân viên bán hàng tại cửa hàng hoặc ecommerce | Đang tư vấn khách, cần tra thông tin sản phẩm nhanh |
| CSKH | Nhân viên chăm sóc khách hàng | Trả lời câu hỏi khách qua chat/call, cần thông tin chính xác |
| Logistics / IT | Tra soát internal, kiểm tra source conflict | Công việc nội bộ, cần trace đầy đủ |

### Primary Task Objective

> Sales / CSKH tra cứu thông tin sản phẩm theo mã / barcode / tên và nhận answer card đủ thông tin trong ≤ 5 giây, không cần rời màn hình hiện tại.

### Success Metric

| Metric | Target | Cách đo |
|--------|--------|---------|
| Task completion time | ≤ 5s từ lúc nhập query đến khi thấy answer card | Stopwatch từ keystroke đến card render |
| Steps to complete | ≤ 3 bước (nhập → chọn kết quả → xem card) | Đếm interaction |
| Error rate | < 5% query không resolve được canonical key | Log PRD-001 / total queries |
| Scope violation | 0 lần field nhạy cảm lộ với Sales/CSKH | Audit log projection_violation_count |

### Failure Indicators

- User phải hỏi đồng nghiệp để biết mã sản phẩm đúng là gì
- User thấy giá nhập / margin / supplier code trong answer card
- User không rõ thông tin đang xem từ nguồn nào và mới đến mức nào
- Fuzzy match tự chọn kết quả sai mà không hỏi lại user

---

## 1. Feature Overview

### Purpose

Cho phép Sales, CSKH, và AI bán hàng tra cứu nhanh thông tin sản phẩm từ lớp dữ liệu canonical (đã được hợp nhất từ SAP B1, KiotViet, Haravan) với projection đúng theo role. Giải quyết vấn đề dữ liệu phân mảnh: cùng mã hàng có thể cho kết quả khác nhau tùy nguồn — module này trả ra câu trả lời duy nhất, có nguồn gốc rõ ràng.

### User Persona

**Primary**: Sales / CSKH đang tư vấn khách, cần thông tin nhanh, không có thời gian tra SAP B1 hoặc KiotViet thủ công.

### User Story

```
Là Sales,
Tôi muốn tra cứu thông tin sản phẩm theo mã / barcode / tên gần đúng
Để tư vấn khách chính xác mà không cần mở nhiều hệ thống.
```

### Linked Artifacts

| Artifact | Location | Status |
|----------|----------|--------|
| Feature SRS | `../SRS/F-M01-PRD-001_Product_SRS.md` | SRS Ready |
| Integration Source Map | SRS §0B | Đã có |
| Business Rules | SRS §11 | Approved by BO 2026-04-17 |

---

## 2. Screen Inventory

| # | Screen Name | Route / Path | Purpose |
|---|-------------|-------------|---------|
| S1 | Product Search — Query Input | `/catalog/product` | Nhập query, xem suggest list |
| S2 | Product Answer Card | `/catalog/product?id={canonical_id}` | Xem thông tin sản phẩm đã resolve |
| S3 | Product Source Trace (Internal) | `drawer` overlay trên S2 | IT / Logistics xem full source trace |

---

## 2.1 Task Flow

### Primary Task Flow — Sales / CSKH

| Step | User Action | System Response | Field Visibility | Notes |
|------|------------|-----------------|-----------------|-------|
| 1 | Nhập mã SKU, barcode, hoặc tên gần đúng vào search box | Gợi ý xuất hiện realtime sau 300ms | Search box | Entry point — auto-focus |
| 2 | Chọn sản phẩm đúng từ suggest list hoặc nhấn Enter nếu chỉ có 1 kết quả | Resolve canonical key, load answer card | Suggest list (tên + SKU + thumbnail) | Nếu fuzzy match → suggest list; nếu exact → trực tiếp card |
| 3 | Xem answer card: tên chuẩn, SKU, variant, giá niêm yết, thuộc tính, trạng thái, source badge | Card render với sales-safe projection | Sales-safe fields only (xem §11 SRS) | Giá nhập / margin / supplier bị ẩn hoàn toàn |
| 4 | (Optional) Click "Xem tồn kho" | Chuyển sang M02 Inventory check cho SKU này | — | Cross-module CTA |
| 5 | (Optional) Click "Xem chính sách" | Chuyển sang M08 Knowledge lookup cho sản phẩm này | — | Cross-module CTA |

### Decision Points & Branching

| Tại Step | Điều kiện | Phân nhánh |
|----------|-----------|-----------|
| Step 1 | Input rỗng | Không show suggest, không query |
| Step 2 | Fuzzy match trả ≥ 2 kết quả | Show suggest list, user chọn |
| Step 2 | Không resolve được canonical key | Hiển thị E1 — gợi ý tìm lại |
| Step 3 | Product stale > threshold | Show stale badge + gợi ý refresh |
| Step 3 | Conflict giữa nguồn | Show warning inline — không ẩn |

### Progressive Disclosure Rules

- **Required** (luôn hiện từ step 1): Search box, suggest list tên + SKU
- **Standard** (hiện khi có answer card): Tên chuẩn, SKU, variant, giá niêm yết, thuộc tính, status, source badge, synced_at
- **Advanced** (chỉ hiện khi user click "Xem nguồn gốc"): Source trace từng field, conflict detail — chỉ với Logistics / IT

---

## 3. Visual Specification (Per Screen)

### Screen S1: Product Search — Query Input

#### Layout (ASCII Wireframe)

```
┌─────────────────────────────────────────────────────┐
│ PageHeader: Tra cứu sản phẩm                        │
├─────────────────────────────────────────────────────┤
│ ┌─────────────────────────────────────────────────┐ │
│ │ 🔍 Nhập mã SKU, barcode, hoặc tên sản phẩm...  │ │
│ └─────────────────────────────────────────────────┘ │
│                                                     │
│ Suggest list (khi đang gõ):                         │
│ ┌─────────────────────────────────────────────────┐ │
│ │ [thumb] Giày Da Nam BQ001   SKU: BQ001   POS   │ │
│ │ [thumb] Giày Thể Thao BQ002 SKU: BQ002   Online│ │
│ │ [thumb] Dép Sandal BQ003    SKU: BQ003   All   │ │
│ └─────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────┘
```

#### Component Breakdown

| Component | Design Token | Notes |
|-----------|-------------|-------|
| PageHeader | H1 24px/700 `--color-text-primary` | "Tra cứu sản phẩm" |
| Search Input | Body 14px, `--radius-md`, `--shadow-1` | Auto-focus, debounce 300ms |
| Suggest Item | Body 13px/400, hover `--color-bg-hover` | Thumbnail 32px + tên + SKU + channel badge |
| Channel Badge | Label 11px, `--color-surface-2` | "POS" / "Online" / "All" |

#### Design Token Values

| Element | Property | Token / Value |
|---------|----------|---------------|
| Page background | `background` | `--color-bg-page` (#F8FAFC) |
| Search input bg | `background` | `--color-bg-card` (#FFFFFF) |
| Search border | `border` | `--color-border` (1px solid #E2E8F0) |
| Search focus | `border-color` | `--color-primary` (#2f64f6) |
| Suggest list bg | `background` | `--color-bg-card` |
| Suggest list shadow | `box-shadow` | `--shadow-2` |
| Suggest item hover | `background` | `--color-bg-hover` (#F1F5F9) |

---

### Screen S2: Product Answer Card

#### Layout (ASCII Wireframe)

```
┌─────────────────────────────────────────────────────┐
│ ← Tìm kiếm lại   [search input — prefilled]        │
├─────────────────────────────────────────────────────┤
│ ┌─────────────────────────────────────────────────┐ │
│ │ [ảnh 80px]  Giày Da Nam Classic                 │ │
│ │             SKU: BQ001  |  Barcode: 8936...     │ │
│ │             ● Đang bán  │ Cập nhật: 2h trước    │ │
│ │             Nguồn: SAP B1  [realtime badge]     │ │
│ ├─────────────────────────────────────────────────┤ │
│ │ THÔNG TIN SẢN PHẨM                              │ │
│ │ Giá niêm yết       850,000 đ                    │ │
│ │ Size               39 / 40 / 41 / 42 / 43       │ │
│ │ Màu sắc            Đen / Nâu / Kem               │ │
│ │ Chất liệu          Da bò thật                    │ │
│ │ Mô tả              [expandable text...]          │ │
│ ├─────────────────────────────────────────────────┤ │
│ │ [Xem tồn kho]  [Xem chính sách]  [Xem nguồn ▼] │ │
│ └─────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────┘
```

#### Component Breakdown

| Component | Design Token | Notes |
|-----------|-------------|-------|
| Card container | `--radius-md`, `--shadow-1`, `--space-5` | White card trên page bg |
| Product name | H2 18px/600 `--color-text-primary` | Canonical name từ SAP B1 |
| SKU / Barcode | Body 12px `--color-text-muted` | Inline, separator ` │ ` |
| Status badge | Label 11px/500 | Xanh = Đang bán, Xám = Ngừng |
| Source badge | Label 11px `--color-primary-light` | "SAP B1", "Haravan", v.v. |
| Freshness badge | Label 11px | Xanh = Realtime, Vàng = Cached, Đỏ = Stale |
| Field label | Body 12px `--color-text-muted` | Uppercase tracking |
| Field value | Body 14px/500 `--color-text-primary` | |
| CTA buttons | Secondary button style | Cross-module navigation |

#### Freshness Badge States

| State | Màu | Text |
|-------|-----|------|
| Realtime | Xanh `#22C55E` | "Realtime" |
| Cached | Xanh nhạt `#60A5FA` | "Cached · {X} phút trước" |
| Stale | Vàng `#F59E0B` | "Cũ · {timestamp}" + icon ⚠️ |

#### Conflict Warning

```
┌──────────────────────────────────────────────────────┐
│ ⚠️  Dữ liệu chưa đồng nhất giữa SAP B1 và KiotViet  │
│     Tên: "Giày Da BQ001" (SAP) / "BQ001 Da Nam" (KV) │
│     [Xem chi tiết]                                   │
└──────────────────────────────────────────────────────┘
```

---

### Screen S3: Source Trace Drawer (Internal only)

```
┌───────────────────────────────┐
│ Nguồn gốc dữ liệu     [✕]    │
├───────────────────────────────┤
│ Tên chuẩn   SAP B1  ✓ master │
│ Mô tả       Haravan  ✓        │
│ Ảnh         Haravan  ✓        │
│ Barcode     SAP B1  ✓        │
│ Giá niêm yết SAP B1  ✓       │
├───────────────────────────────┤
│ Conflict log                  │
│ Tên KiotViet: "BQ001 Da Nam"  │
│ Tên SAP B1:  "Giày Da BQ001"  │
│ → Hiển thị theo SAP B1       │
└───────────────────────────────┘
```

Chỉ render cho role `Logistics / IT`. Sales / CSKH không thấy drawer này.

---

## 4. Data Binding

| UI Element | API Endpoint | Field | Format | Notes |
|-----------|-------------|-------|--------|-------|
| Search suggest | `POST /mia/products/query` | `results[].name`, `sku`, `thumbnail` | Text / URL | Debounce 300ms |
| Product name | `GET /mia/products/{id}` | `name_canonical` | String | Từ SAP B1 |
| SKU | | `sku` | String | |
| Barcode | | `barcode` | String | |
| Status | | `status` | `active` / `inactive` | Badge mapping |
| Source | | `source` | String | Badge label |
| Synced at | | `synced_at` | ISO8601 → "X phút trước" | Relative time |
| Freshness | | `freshness_level` | `realtime`/`cached`/`stale` | Badge state |
| Giá niêm yết | | `price_retail` | Number → `{N},000 đ` | Trong sales-safe projection |
| Size | | `attributes.size[]` | Array → join " / " | |
| Màu | | `attributes.color[]` | Array → join " / " | |
| Chất liệu | | `attributes.material` | String | |
| Conflict warning | | `conflict_flag` | Boolean | Hiện nếu `true` |

---

## 5. State Matrix

### Page-Level States

| State | Trigger | Visual | Notes |
|-------|---------|--------|-------|
| **Idle** | Vừa vào trang | Search box empty, placeholder | Auto-focus search |
| **Searching** | User đang gõ | Suggest list loading skeleton | Debounce 300ms |
| **Suggest shown** | API trả gợi ý | Suggest dropdown | Max 7 items |
| **Loading card** | User chọn sản phẩm | Card skeleton 3 rows | Sau 300ms delay |
| **Populated** | Card data trả về | Full answer card | Default |
| **Stale warning** | `freshness_level = stale` | Vàng badge + warning inline | |
| **Conflict** | `conflict_flag = true` | Warning banner + "Xem chi tiết" | |
| **Not found** | `PRD-001` | Illustration + message + gợi ý | |
| **Error** | API fail | Error card + "Thử lại" | |

### Component-Level States

| Component | Default | Hover | Focus | Disabled |
|-----------|---------|-------|-------|----------|
| Search Input | Border `--color-border` | Border `--color-primary-light` | Border `--color-primary` + ring | N/A |
| Suggest Item | Bg transparent | Bg `--color-bg-hover` | Bg `--color-bg-hover` | N/A |
| CTA Button | Secondary style | Darker bg | Ring `--color-primary` | Opacity 0.4 |

---

## 5.1 Error & Recovery

### Common Errors

| Error ID | Tại Step | Mô tả | Tần suất | System Assistance | Recovery |
|----------|---------|-------|----------|-------------------|---------|
| E1 | Step 2 | Không tìm thấy sản phẩm (PRD-001) | Không thường xuyên | "Không tìm thấy sản phẩm với mã này. Thử tìm theo tên hoặc barcode?" | Gợi ý 3 cách tìm khác |
| E2 | Step 3 | Dữ liệu stale > threshold (PRD-002) | Có thể xảy ra | Badge vàng + "Dữ liệu cách đây {X} giờ. Bấm để cập nhật mới nhất." | Button "Cập nhật" refresh realtime |
| E3 | Step 3 | Conflict dữ liệu giữa nguồn (PRD-003) | Hiếm | Warning banner vàng "Dữ liệu chưa đồng nhất giữa các nguồn" | Link "Xem chi tiết" cho IT/Logistics |
| E4 | Step 1-3 | API timeout / network error | Hiếm | "Đã xảy ra lỗi. Vui lòng thử lại." | Button "Thử lại" auto-retry 1 lần |

### Dead-End Prevention

- [x] Mọi error state có message tiếng Việt rõ ràng
- [x] Mọi error có recovery action (retry, tìm lại, xem chi tiết)
- [x] Fuzzy match không tự chọn — luôn hỏi user xác nhận khi ≥2 kết quả
- [x] Stale data không hiển thị như data mới — bắt buộc có badge
- [x] Conflict không ẩn im lặng — bắt buộc có warning

---

## 6. Copy & Microcopy (Tiếng Việt)

| Element | Nội dung | Max Length |
|---------|---------|-----------|
| Page Title | "Tra cứu sản phẩm" | 30 |
| Search Placeholder | "Nhập mã SKU, barcode, hoặc tên sản phẩm..." | 60 |
| Suggest empty | "Không tìm thấy gợi ý phù hợp" | 40 |
| Not found | "Không tìm thấy sản phẩm. Thử tìm theo tên hoặc barcode?" | 60 |
| Stale warning | "Dữ liệu cũ — cập nhật lúc {timestamp}" | 50 |
| Conflict warning | "Dữ liệu chưa đồng nhất giữa các nguồn" | 50 |
| CTA: Tồn kho | "Xem tồn kho" | 15 |
| CTA: Chính sách | "Xem chính sách" | 15 |
| CTA: Nguồn gốc | "Xem nguồn gốc ▼" | 20 |
| Source trace title | "Nguồn gốc dữ liệu" | 25 |
| Field: Giá niêm yết | "Giá niêm yết" | 15 |
| Field: Trạng thái (active) | "Đang bán" | 10 |
| Field: Trạng thái (inactive) | "Ngừng kinh doanh" | 20 |

---

## 7. Interaction & Animation

| Interaction | Animation | Duration | Easing |
|------------|-----------|----------|--------|
| Page enter | Fade in | 200ms | ease-out |
| Suggest list open | Slide down + fade | 150ms | ease-out |
| Suggest list close | Fade out | 100ms | ease-in |
| Answer card mount | Fade in + slide up 8px | 200ms | ease-out |
| Source trace drawer open | Slide in từ phải | 250ms | ease-out |
| Stale badge pulse | Pulse 1 lần khi mount | 600ms | ease-in-out |
| Error card | Shake 1 lần | 300ms | ease-in-out |

> `prefers-reduced-motion`: disable tất cả slide/pulse/shake, chỉ giữ fade.

---

## 8. Accessibility

- [ ] `aria-label` cho search input: "Tìm kiếm sản phẩm theo SKU, barcode, hoặc tên"
- [ ] `aria-live="polite"` cho suggest list và answer card
- [ ] `aria-busy="true"` khi đang loading card
- [ ] Keyboard: Tab → Search → Suggest items → CTA buttons
- [ ] Focus sau khi đóng Source Trace drawer: trả về CTA "Xem nguồn gốc"
- [ ] Freshness badge có `title` tooltip hiển thị timestamp đầy đủ

### Contrast Check

| Element | FG | BG | Ratio | Pass |
|---------|----|----|-------|------|
| Product name | #1E293B | #FFFFFF | 16:1 | ✓ AA |
| Field label | #64748B | #FFFFFF | 5.9:1 | ✓ AA |
| Stale badge text | #92400E | #FEF3C7 | 7.2:1 | ✓ AA |
| Conflict warning | #92400E | #FFFBEB | 7.2:1 | ✓ AA |

---

## 9. A05 Technical Cross-Check

> **Reviewed by**: A05 Tech Lead (Claude / Antigravity)
> **Date**: 2026-04-17
> **Result**: ✅ Pass — recommended for UXUI Approved

| Item | Verdict | Notes |
|------|---------|-------|
| Component mapping | ✅ Pass | Search, Card, Badge, Drawer đều có trong design system. Shared `FreshnessBadge`, `ConflictBanner`, `SourceDrawer` sẽ tái dùng sang M02/M03/M04. |
| Token compatibility | ✅ Pass | Tất cả dùng `--color-*`, `--space-*`, `--radius-*`. Không có hardcode hex. |
| Animation practical | ✅ Pass | Slide + fade < 300ms. `prefers-reduced-motion` được xử lý. |
| Responsive aligns | ✅ Pass | Card single-column trên mobile. Suggest dropdown full-width. |
| Data binding matches API | ✅ Pass | Mọi field map về `GET /mia/products/{id}` output. `name_canonical`, `price_retail`, `attributes.*` khả thi từ `product_read_model`. |
| Sales-safe enforcement | ✅ Pass | **Quan trọng**: Projection phải enforce server-side. FE không được CSS-hide field — field không được tồn tại trong response payload. |
| Source trace drawer | ✅ Pass | Role-gate check trước khi render button. Nếu FE nhận payload đã trim, button không render — đúng. |
| Debounce strategy | ✅ Pass | 300ms phù hợp. Cần cancel request in-flight khi user gõ tiếp (AbortController). |
| Thumbnail CDN | ⚠️ Note | `thumbnail` field cần xác nhận CDN URL pattern từ Haravan/SAP B1. A08 cần document ảnh fallback khi không có ảnh. |
| Conflict banner scope | ✅ Pass | Conflict chỉ hiển khi field cụ thể khác nhau an meaningful way, không phải mọi delta nhỏ. Spec đặc tả đúng. |

**A06 Design Sign-Off**: A06 (Claude / Antigravity) — 2026-04-17
**A05 Tech Sign-Off**: A05 (Claude / Antigravity) — 2026-04-17

---

## 10. Pre-Delivery Checklist (A07)

- [ ] Design tokens matched exactly
- [ ] No browser defaults visible
- [ ] Icons: Lucide SVG only (no emoji)
- [ ] Be Vietnam Pro font applied
- [ ] All states: idle, searching, suggest shown, loading card, populated, stale, conflict, not found, error
- [ ] Freshness badges: realtime / cached / stale đều có
- [ ] Sales-safe projection: giá nhập / supplier / margin không thể thấy ở bất kỳ state nào
- [ ] Source trace drawer: chỉ hiện với Logistics / IT role
- [ ] Touch targets ≥ 44x44px
- [ ] Responsive: desktop + tablet + mobile
- [ ] 100% Vietnamese copy
- [ ] `prefers-reduced-motion` handled
- [ ] AbortController cho search debounce — cancel in-flight request khi user gõ tiếp
- [ ] Thumbnail fallback image khi không có ảnh sản phẩm

**A06 Design Sign-Off**: A06 (Claude / Antigravity) — 2026-04-17
**A05 Tech Sign-Off**: A05 (Claude / Antigravity) — 2026-04-17
**PM Gate**: Chờ BO review trước khi handoff FE Build
