# UXUI Feature Spec: F-M02-INV-001 Inventory Availability

**Feature ID**: F-M02-INV-001
**Status**: UXUI Approved
**Owner**: A06 UI/UX Agent
**Implementation Reviewer**: A05 Tech Lead
**Implemented By**: A07 FE Builder
**Product**: MIA Smart / Platform
**Design System Reference**: `Design/Design_System.md`
**Save to**: `Analysis/Features/Modules/Catalog_And_Commerce/Inventory_Availability/UXUI/UXUI-F-M02-INV-001_Inventory_Availability.md`
**Date**: 2026-04-17
**Last Status Change**: 2026-04-17 (Draft → UXUI Approved)
**SRS Reference**: `../SRS/F-M02-INV-001_Inventory_Availability_SRS.md` — SRS Ready

---

> **Precondition**: SRS F-M02-INV-001 đã ở trạng thái `SRS Ready`. Spec này dùng cho gating và FE build handoff.

---

## §0. User & Task

### Target User Role(s)

| Role | Mô tả | Context |
|------|--------|---------|
| Sales / CSKH | Tư vấn khách, cần biết còn hàng không | Đang chat/gặp khách, cần trả lời nhanh |
| Store Manager / Vận hành bán lẻ | Kiểm tra tồn tại cửa hàng mình | Ra quyết định nhận đơn / từ chối |
| Logistics / Kho | Kiểm tra tồn để cân nhắc điều chuyển | Đang lên kế hoạch vận hành |
| AI Sales Advisor (M10) | Query tồn kho tự động | Tích hợp API, không phải user trực tiếp |

### Primary Task Objective

> Sales / CSKH biết được tình trạng tồn kho (còn hàng / còn ít / hết hàng) cho một SKU + size + cửa hàng cụ thể trong ≤ 4 giây, với nguồn dữ liệu và mức độ tin cậy rõ ràng.

### Success Metric

| Metric | Target | Cách đo |
|--------|--------|---------|
| Time to availability answer | ≤ 4s realtime path, ≤ 1s cache path | Server + client timing |
| Clarifying prompt rate | > 90% trường hợp thiếu variant được hỏi lại, không đoán | Log `clarifying_prompt_rate` |
| Scope violation | 0 lần exact quantity lộ với Sales/CSKH public-safe | Audit log |
| Conflict display rate | 100% conflict được hiển thị, không ẩn | Log conflict_flag_count |

### Failure Indicators

- Sales nhận được số tồn tuyệt đối mà không hiểu là số đó theo nguồn nào
- System trả "còn hàng" khi data đã stale > 4 giờ mà không có cảnh báo
- User thấy conflict nhưng không biết phải làm gì tiếp theo
- User hỏi "size 42 còn không" nhưng system trả lời theo tổng SKU cha mà không hỏi lại variant

---

## 1. Feature Overview

### Purpose

Cung cấp lớp UI cho phép internal users và AI tra tình trạng tồn kho từ nhiều nguồn (SAP B1, KiotViet, Haravan) với trust layer rõ ràng: freshness badge, conflict state, và safe mode projection theo role.

### User Persona

**Primary**: Sales đang tư vấn khách tại cửa hàng hoặc qua chat — cần biết "còn hàng không" trong vài giây, không cần biết số chính xác.

**Secondary**: Logistics cần số liệu đầy đủ để cân nhắc điều chuyển.

### User Story

```
Là Sales,
Tôi muốn biết mã BQ001 size 42 còn không tại cửa hàng gần tôi,
Để xác nhận đơn cho khách ngay mà không cần gọi điện kho.
```

### Linked Artifacts

| Artifact | Location | Status |
|----------|----------|--------|
| Feature SRS | `../SRS/F-M02-INV-001_Inventory_Availability_SRS.md` | SRS Ready |
| Availability Glossary | SRS §1B | Đã có |
| Phase 1 Canonical Decisions | SRS §1C | Đã có |
| Business Rules + Freshness SLA | SRS §11 | Approved by BO 2026-04-17 |

---

## 2. Screen Inventory

| # | Screen Name | Route / Path | Purpose |
|---|-------------|-------------|---------|
| S1 | Inventory Check — Input | `/catalog/inventory` | Nhập SKU + scope, xem kết quả |
| S2 | Availability Answer Card | Nằm trong S1 sau query | Hiển thị kết quả cho Sales/CSKH (safe mode) |
| S3 | Inventory Detail — Internal | Drawer overlay trên S2 | Logistics xem exact + source trace |
| S4 | Clarifying Prompt State | Inline trong S1 | Khi thiếu variant bắt buộc |
| S5 | Conflict State | Inline trong S2 | Khi conflict > threshold |

---

## 2.1 Task Flow

### Primary Task Flow — Sales / CSKH (Safe Mode)

| Step | User Action | System Response | Field Visibility | Notes |
|------|------------|-----------------|-----------------|-------|
| 1 | Nhập SKU hoặc chọn sản phẩm từ M01 (cross-module handoff) | Resolve canonical product key từ M01 | SKU + tên | Có thể đến từ M01 answer card |
| 2 | Chỉ định variant nếu cần (size, màu) | Nếu thiếu variant bắt buộc: hiện clarifying prompt | Variant selector | Nếu đủ: chuyển step 3 |
| 3 | Chọn scope: cửa hàng / khu vực / kênh | System xác định `location_scope` và `channel_context` | Scope selector | Mặc định là cửa hàng đang dùng |
| 4 | Xem availability answer card | System chạy realtime/cache theo policy, trả kết quả | `quantity_hint` + source + freshness | Sales chỉ thấy "còn hàng / còn ít / hết hàng" |
| 5 | (Optional) Click "Kiểm tra lại" | Trigger realtime check mới | — | Dùng khi badge đang cached/stale |

### Secondary Task Flow — Logistics (Internal Exact Mode)

| Step | User Action | System Response | Notes |
|------|------------|-----------------|-------|
| 1-3 | Giống Sales, nhưng role = Logistics | — | |
| 4 | Xem card với exact quantity + source trace | `available_to_sell_qty`, `on_hand_qty`, `checked_sources[]` | Exact chỉ cho đủ quyền |
| 5 | Click "Xem theo kho / chi nhánh" | Expand multi-location breakdown | Source trace drawer |

### Decision Points & Branching

| Tại Step | Điều kiện | Phân nhánh |
|----------|-----------|-----------|
| Step 2 | Sản phẩm có variant bắt buộc, query chưa đủ | Clarifying prompt — không chạy check |
| Step 4 | Cache stale > TTL nhưng realtime cũng fail | Trả `unknown` + stale warning |
| Step 4 | Conflict major (delta ≥ 3) | Card vào conflict state, block exact answer |
| Step 4 | User ngoài scope | Block exact, chỉ trả safe summary |
| Step 4 | Haravan online, không xác nhận store | Trả "channel-specific only" |

---

## 3. Visual Specification (Per Screen)

### Screen S2: Availability Answer Card — Safe Mode

#### Layout (ASCII Wireframe)

```
┌──────────────────────────────────────────────────────┐
│ Tình trạng tồn kho                                   │
├──────────────────────────────────────────────────────┤
│ Giày Da Nam BQ001 · Size 42 · Đen                   │
│ Cửa hàng: Nguyễn Trãi, TP.HCM                       │
├──────────────────────────────────────────────────────┤
│                                                      │
│         ✅  Còn hàng                                  │
│                                                      │
│ Nguồn: KiotViet  ·  [Realtime]  ·  09:34 hôm nay   │
│                                                      │
├──────────────────────────────────────────────────────┤
│ [Kiểm tra lại]        [Xem cửa hàng khác]           │
└──────────────────────────────────────────────────────┘
```

#### Availability Status Visual Mapping

| Status | Icon | Color | Text |
|--------|------|-------|------|
| `available` | ✅ | Xanh lá `#22C55E` | "Còn hàng" |
| `low_stock` | ⚠️ | Vàng `#F59E0B` | "Còn ít" |
| `out_of_stock` | ❌ | Đỏ `#EF4444` | "Hết hàng" |
| `unknown` | ❓ | Xám `#94A3B8` | "Không xác định được" |
| `conflict` | 🔴 | Đỏ đậm + warning | (xem S5) |
| `needs_confirmation` | 🔵 | Xanh nhạt | "Cần xác minh thêm" |

#### Freshness Badge

| State | Icon | Color | Text |
|-------|------|-------|------|
| `realtime` | 🟢 | Xanh `#22C55E` | "Realtime" |
| `cached` | 🔵 | Xanh dương `#60A5FA` | "Cached · {X} phút trước" |
| `stale` | 🟡 | Vàng + ⚠️ | "Cũ · {timestamp} · Cập nhật?" |
| `unknown` | ⬜ | Xám | "Không rõ thời gian" |

---

### Screen S4: Clarifying Prompt State

```
┌──────────────────────────────────────────────────────┐
│ Giày Da Nam BQ001 — Chọn phiên bản để kiểm tra tồn  │
├──────────────────────────────────────────────────────┤
│ Size:  [39] [40] [41] [42] [43]                      │
│ Màu:   [Đen] [Nâu] [Kem]                            │
│                                                      │
│ ℹ️  Cần chọn size và màu để kiểm tra chính xác       │
└──────────────────────────────────────────────────────┘
```

- Không render answer card cho đến khi user chọn đủ variant
- Button "Kiểm tra" chỉ enable sau khi đủ variant

---

### Screen S5: Conflict State Card

```
┌──────────────────────────────────────────────────────┐
│ ⚠️  Dữ liệu tồn kho chưa đồng nhất                   │
├──────────────────────────────────────────────────────┤
│ KiotViet báo: Còn ít (2 đôi)                        │
│ SAP B1 báo:   Hết hàng (0)                           │
│                                                      │
│ Chênh lệch: 2 đơn vị — cần xác minh                 │
├──────────────────────────────────────────────────────┤
│ [Liên hệ kho để xác nhận]  [Kiểm tra realtime]      │
└──────────────────────────────────────────────────────┘
```

- Major conflict (delta ≥ 3): block exact answer với Sales/CSKH
- Minor conflict (delta 1-2): hiện summary + warning nhẹ

---

## 4. Data Binding

| UI Element | API | Field | Format | Notes |
|-----------|-----|-------|--------|-------|
| Tên sản phẩm | M01 canonical | `name_canonical` | String | Lấy từ M01 |
| Variant display | M01 | `variant_attrs` | size + color | |
| Scope label | User context | `location_scope` | String | |
| Availability status | `POST /mia/inventory/check` | `availability_status` | Enum | |
| Quantity hint | | `quantity_hint` | `còn hàng`/`còn ít`/`hết hàng` | Chỉ safe mode |
| Quantity exact | | `quantity_exact` | Number | Chỉ Logistics đủ quyền |
| Source | | `source` | String | Badge label |
| Freshness | | `freshness_level` | Enum | Badge state |
| Checked at | | `checked_at` | ISO8601 → relative | "X phút trước" |
| Confidence | | `availability_confidence` | `high`/`medium`/`low` | Hiện nếu low |
| Conflict status | | `conflict_status` | `none`/`minor`/`major` | Trigger S5 |
| Warnings | | `warnings[]` | Array string | Inline warning |
| Next action hint | | `next_action_hint` | String | CTA suggestion |

---

## 5. State Matrix

### Page-Level States

| State | Trigger | Visual |
|-------|---------|--------|
| **Input idle** | Vừa vào | Form trống, placeholder |
| **Clarifying** | Thiếu variant | S4 Clarifying prompt |
| **Loading** | Query đang chạy | Skeleton card |
| **Available** | `availability_status = available` | Xanh ✅ + "Còn hàng" |
| **Low stock** | `= low_stock` | Vàng ⚠️ + "Còn ít" |
| **Out of stock** | `= out_of_stock` | Đỏ ❌ + "Hết hàng" |
| **Unknown** | Không đủ dữ liệu | Xám ❓ + message |
| **Conflict** | `conflict_status = major` | S5 Conflict card |
| **Stale** | `freshness_level = stale` | Vàng badge + CTA cập nhật |
| **Scope denied** | User ngoài scope | "Ngoài phạm vi của bạn" |
| **Error** | API fail | Error card + retry |

---

## 5.1 Error & Recovery

| Error ID | Tại Step | Mô tả | System Assistance | Recovery |
|----------|---------|-------|-------------------|---------|
| E1 | Step 2 | Thiếu variant bắt buộc | Clarifying prompt — không đoán | User chọn variant |
| E2 | Step 4 | Cache stale vượt TTL, realtime cũng fail (INV-001) | "Không có dữ liệu đáng tin. Thử lại sau?" | Retry button |
| E3 | Step 4 | Location không map được (INV-005) | "Không tìm thấy dữ liệu cho chi nhánh này" | Gợi ý chọn chi nhánh khác |
| E4 | Step 4 | Major conflict (INV-003) | S5 Conflict card + CTA escalation | "Liên hệ kho để xác nhận" |
| E5 | Step 4 | User ngoài scope | "Nội dung này nằm ngoài phạm vi bạn được xem" | — |
| E6 | Step 4 | Haravan online mà không xác nhận store | "Thông tin này chỉ cho kênh online, không đồng nghĩa còn ở cửa hàng" | CTA "Kiểm tra tại cửa hàng" |

---

## 6. Copy & Microcopy (Tiếng Việt)

| Element | Nội dung | Max Length |
|---------|---------|-----------|
| Page title | "Kiểm tra tồn kho" | 25 |
| Clarifying message | "Cần chọn size và màu để kiểm tra chính xác" | 50 |
| Available | "Còn hàng" | 10 |
| Low stock | "Còn ít" | 10 |
| Out of stock | "Hết hàng" | 10 |
| Unknown | "Không xác định được — cần xác minh" | 40 |
| Needs confirmation | "Cần xác minh thêm" | 25 |
| Stale warning | "Dữ liệu cũ · Cập nhật?" | 25 |
| Conflict warning | "Dữ liệu tồn kho chưa đồng nhất giữa các nguồn" | 55 |
| Conflict CTA | "Liên hệ kho để xác nhận" | 30 |
| Scope denied | "Nội dung này nằm ngoài phạm vi bạn được xem" | 55 |
| Channel-specific only | "Thông tin này chỉ cho kênh online" | 40 |
| CTA: Kiểm tra lại | "Kiểm tra lại" | 15 |
| CTA: Cửa hàng khác | "Xem cửa hàng khác" | 20 |
| CTA: Xem nguồn | "Xem nguồn gốc ▼" | 20 |

---

## 7. Interaction & Animation

| Interaction | Animation | Duration | Easing |
|------------|-----------|----------|--------|
| Card mount | Fade in + slide up 6px | 200ms | ease-out |
| State transition (e.g. loading → available) | Cross-fade | 150ms | ease-in-out |
| Conflict card expand | Slide down | 200ms | ease-out |
| Stale badge | Pulse 1 lần khi mount | 600ms | ease-in-out |
| Clarifying prompt | Slide down | 150ms | ease-out |

> `prefers-reduced-motion`: disable pulse/slide, chỉ giữ fade.

---

## 8. Accessibility

- [ ] `aria-live="assertive"` cho availability status (thay đổi quan trọng)
- [ ] `aria-live="polite"` cho freshness badge update
- [ ] `aria-label` cho freshness badge: "Dữ liệu được kiểm tra lúc {timestamp}"
- [ ] Keyboard: Tab → Variant selector → Scope selector → Submit → Result card → CTAs
- [ ] Conflict card có focus khi mount
- [ ] Màu sắc không phải indicator duy nhất — luôn có icon + text đi kèm

---

## 9. A05 Technical Cross-Check

> **Reviewed by**: A05 Tech Lead (Claude / Antigravity)
> **Date**: 2026-04-17
> **Result**: ✅ Pass — recommended for UXUI Approved

| Item | Verdict | Notes |
|------|---------|-------|
| Variant guard trước khi query | ✅ Pass | FE validate + BE validate (INV-004). FE disable Submit button cho đến khi đủ variant. |
| Scope enforcement | ✅ Pass | BE trim response. `location_scope` cần A08 document store_id → KiotViet store_code mapping. |
| Freshness SLA display | ✅ Pass | Map `freshness_level` enum sang badge. A08 cần document logic `synced_at` → `freshness_level` per source. UI hiển nguồn kém tươi nhất. |
| Conflict threshold display | ✅ Pass | Major (delta ≥3) → S5 Conflict card đúng. **Gap nhỏ**: Minor conflict (delta 1–2) chưa có wireframe riêng. A07 implement warning badge vàng nhạt inline, không cần full S5. |
| Haravan channel isolation | ✅ Pass | `channel-specific only` warning bắt buộc khi source = Haravan online. A08 flag trong response. |
| Exact quantity gate | ✅ Pass | `quantity_exact` chỉ render nếu BE trả về. FE không hardcode label gợi ý exact qty với Sales/CSKH. |
| Cross-module handoff từ M01 | ✅ Pass | Canonical key từ M01 truyền qua route param. Cần thống nhất kiểu truyền với A07/A08. |
| Stale per-source SLA | ✅ Pass | KiotViet ≤15m, SAP B1 ≤4h — đúng với BO decision. FE hiển thị nguồn stale nhất. |

**A06 Design Sign-Off**: A06 (Claude / Antigravity) — 2026-04-17
**A05 Tech Sign-Off**: A05 (Claude / Antigravity) — 2026-04-17

---

## 10. Pre-Delivery Checklist (A07)

- [ ] Đủ 5 availability states: available / low_stock / out_of_stock / unknown / conflict
- [ ] Freshness badges: realtime / cached / stale / unknown
- [ ] Clarifying prompt khi thiếu variant — không render card sai grain
- [ ] Conflict minor: warning badge vàng nhạt inline
- [ ] Conflict major: S5 card đầy đủ + CTA
- [ ] Exact quantity không render với Sales/CSKH safe mode
- [ ] Scope denied state
- [ ] Haravan channel-specific warning khi source = Haravan online
- [ ] 100% Vietnamese copy
- [ ] Touch targets ≥ 44x44px
- [ ] `prefers-reduced-motion` handled

**A06 Design Sign-Off**: A06 (Claude / Antigravity) — 2026-04-17
**A05 Tech Sign-Off**: A05 (Claude / Antigravity) — 2026-04-17
**PM Gate**: Chờ BO review trước khi handoff FE Build
