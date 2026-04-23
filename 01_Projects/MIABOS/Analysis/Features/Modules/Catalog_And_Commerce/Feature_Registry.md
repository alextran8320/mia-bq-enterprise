# Feature Registry — Catalog & Commerce (M01–M04)

**Status**: Active
**Owner**: A01 PM Agent
**Last Updated By**: Codex CLI (GPT-5.4 Codex environment)
**Last Updated**: 2026-04-21
**Source of Truth**: This document
**Blocking Reason**: -
**Module Group**: Catalog_And_Commerce
**Phase**: PB-02 / PB-03

---

## Mục đích

Registry này theo dõi canonical feature artifacts trong nhóm Catalog & Commerce, trạng thái migration hiện tại, và traceability tới BQ requirement pack cùng các phase tiếp theo.

> **Migration Note (2026-04-21)**: Pilot `F-M01-PRD-001` theo flow mới đã bị gỡ vì không bám front-end source of truth. Từ thời điểm này, toàn bộ M01-M04 quay lại trạng thái `Legacy SRS / Pending Migration` cho tới khi được rewrite lại đúng theo app hiện có.

---

## Feature Registry

| Feature ID | Feature Name | Module | Priority | Feature Status | Design Status | BQ Requirement Anchor | Canonical Feature Link | UX/UI Link |
|---|---|---|---|---|---|---|---|---|
| F-M01-PRD-001 | Product Catalog & Query | M01 | High | **Legacy SRS** | **Legacy UXUI** | §3.1 Dữ liệu phân mảnh; §3.6 Phụ thuộc tri thức nội bộ | [SRS](Product/SRS/F-M01-PRD-001_Product_SRS.md) | [UXUI](Product/UXUI/UXUI-F-M01-PRD-001_Product_Catalog_Query.md) |
| F-M02-INV-001 | Inventory Availability | M02 | High | **Legacy SRS** | **Legacy UXUI** | §3.2 Khả năng nhìn tồn kho; "mã nào, size nào, ở đâu, có nên chuyển không" | [SRS](Inventory_Availability/SRS/F-M02-INV-001_Inventory_Availability_SRS.md) | [UXUI](Inventory_Availability/UXUI/UXUI-F-M02-INV-001_Inventory_Availability.md) |
| F-M03-PRC-001 | Pricing Resolution | M03 | High | **Legacy SRS** | **Legacy UXUI** | §3.3 Giá và CTKM là miền dữ liệu vận hành; chính sách 1 giá + CTKM theo kênh là cách BQ vận hành | [SRS](Pricing/SRS/F-M03-PRC-001_Pricing_SRS.md) | [UXUI](Pricing/UXUI/UXUI-F-M03-PRC-001_Pricing_Resolution.md) |
| F-M04-PRO-001 | Promotion & Voucher | M04 | High | **Legacy SRS** | **Legacy UXUI** | §3.3/§3.4 CTKM là use case tra cứu/tư vấn theo context, không phải pain point | [SRS](Promotion/SRS/F-M04-PRO-001_Promotion_SRS.md) | [UXUI](Promotion/UXUI/UXUI-F-M04-PRO-001_Promotion_Voucher.md) |

---

## Blocking Reasons Per Feature

| Feature ID | Blocking Reason | Owner to Unblock |
|---|---|---|
| F-M01-PRD-001 | ✅ Resolved 2026-04-17 | — |
| F-M02-INV-001 | ✅ Resolved 2026-04-17 | — |
| F-M03-PRC-001 | ✅ Resolved 2026-04-17 | — |
| F-M04-PRO-001 | ✅ Resolved 2026-04-17 | — |

---

## Integration Dependencies

| Feature ID | Reads From | Writes To | Cross-Module |
|---|---|---|---|
| F-M01-PRD-001 | I02 SAP B1, I03 Haravan, I04 KiotViet | product_read_model | → M02, M03, M04, M09, M10 |
| F-M02-INV-001 | I02 SAP B1 inventory, I03 Haravan, I04 KiotViet store | inventory_read_model, availability_cache | → M09, M10; requires M01, M07 |
| F-M03-PRC-001 | I02 SAP B1 pricing, I03 Haravan, I04 KiotViet POS | pricing_read_model, source_priority_rule | → M09, M10; requires M01, M04, M07, M08 |
| F-M04-PRO-001 | I02 SAP B1 promo, I03 Haravan campaign, I04 KiotViet discount | promotion_read_model | → M09, M10; requires M01, M03, M07, M08 |

---

## Traceability Matrix

| Feature ID | BQ Pain Point | BQ Pack Reference | Systems Involved |
|---|---|---|---|
| F-M01-PRD-001 | Dữ liệu sản phẩm phân mảnh giữa 3 hệ thống — cùng mã hàng trả lời khác nhau | Customer Research Pack §3.1, §3.6 | SAP B1, Haravan, KiotViet |
| F-M02-INV-001 | Bài toán tồn không phải "có/không" mà là "mã nào, size nào, ở đâu, có nên chuyển không" | Customer Research Pack §3.2; Systems Landscape §8 | SAP B1, KiotViet, Haravan |
| F-M03-PRC-001 | Tra cứu giá/CTKM đúng context theo kênh, loại cửa hàng, và scope người hỏi; CTKM khác nhau là vận hành bình thường của BQ | Customer Research Pack §3.3 | SAP B1, Haravan, KiotViet, BQ Data Warehouse, M08 |
| F-M04-PRO-001 | Hỗ trợ hỏi đáp/tư vấn CTKM đang hiệu lực theo context, không định vị CTKM là pain point | Customer Research Pack §3.3/§3.4 | SAP B1, Haravan, KiotViet, BQ Data Warehouse, M08 |

---

## Gate Status

| Feature ID | Gate 3 (PB-02→03) | Gate 4A (Design Pack) | Gate 4B (BO Sign-Off) |
|---|---|---|---|
| F-M01-PRD-001 | ✅ **Legacy SRS Ready** (2026-04-17) | ✅ **Legacy UXUI Approved** (2026-04-17) | ⏳ Chờ BO |
| F-M02-INV-001 | ✅ **Legacy SRS Ready** (2026-04-17) | ✅ **Legacy UXUI Approved** (2026-04-17) | ⏳ Chờ BO |
| F-M03-PRC-001 | ✅ **Legacy SRS Ready** (2026-04-17) | ✅ **Legacy UXUI Approved** (2026-04-17) | ⏳ Chờ BO |
| F-M04-PRO-001 | ✅ **Legacy SRS Ready** (2026-04-17) | ✅ **Legacy UXUI Approved** (2026-04-17) | ⏳ Chờ BO |

> **Gate 4A legacy**: M01-M04 hiện đều quay về tracking theo `Legacy SRS + Legacy UXUI` cho tới khi có đợt rewrite canonical mới dựa trên front-end source of truth.
> **Gate 4B đang mở**: Chờ Business Owner sign-off trước khi unblock A07 FE Build cho từng slice tương ứng.

---

## Open Questions — Đã Resolve

> ✅ Tất cả open questions đã được Business Owner chốt ngày **2026-04-17**:
>
> - **M01**: Sales-safe field list (tên, SKU, barcode, mô tả, ảnh, giá niêm yết, thuộc tính, status); Hidden: giá nhập, supplier code, margin. Canonical name: SAP B1.
> - **M02**: Business Owner cập nhật trực tiếp SRS (promoted by Codex CLI). Freshness SLA: KiotViet/Haravan ≤15 phút, SAP B1 ≤4 giờ. Conflict threshold: minor ≤2 đơn vị, major ≥3.
> - **M03**: Conflict resolver = Finance + Ban điều hành. CTKM store-level master = KiotViet. Giá nhập: không bao giờ qua chatbot.
> - **M04**: Public-safe = tất cả CTKM active mặc định; Marketing đánh `internal_only` mới ẩn. KiotViet là master, Haravan sync theo.

---

_Last Updated: 2026-04-21 by Codex CLI (GPT-5.4 Codex environment) — Removed M01 pilot artifacts and restored M01–M04 to legacy pending-migration tracking._
