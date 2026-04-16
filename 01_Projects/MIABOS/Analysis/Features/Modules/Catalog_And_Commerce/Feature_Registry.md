# Feature Registry — Catalog & Commerce (M01–M04)

**Status**: Active
**Owner**: A01 PM Agent
**Last Updated By**: Claude (Antigravity / claude-sonnet-4-6)
**Last Updated**: 2026-04-17
**Source of Truth**: This document
**Blocking Reason**: -
**Module Group**: Catalog_And_Commerce
**Phase**: PB-02 / PB-03

---

## Mục đích

Registry này theo dõi toàn bộ Feature SRS trong nhóm Catalog & Commerce, trạng thái hiện tại, và traceability tới BQ requirement pack và các phase tiếp theo.

---

## Feature Registry

| Feature ID | Feature Name | Module | Priority | SRS Status | UXUI Status | BQ Requirement Anchor | SRS Link |
|---|---|---|---|---|---|---|---|
| F-M01-PRD-001 | Product Catalog & Query | M01 | High | Draft | — | §3.1 Dữ liệu phân mảnh; §3.6 Phụ thuộc tri thức nội bộ | [SRS](Product/SRS/F-M01-PRD-001_Product_SRS.md) |
| F-M02-INV-001 | Inventory Availability | M02 | High | Draft | — | §3.2 Khả năng nhìn tồn kho; "mã nào, size nào, ở đâu, có nên chuyển không" | [SRS](Inventory_Availability/SRS/F-M02-INV-001_Inventory_Availability_SRS.md) |
| F-M03-PRC-001 | Pricing Resolution | M03 | High | Draft | — | §3.3 Độ phức tạp giá và CTKM; chính sách 1 giá + CTKM theo kênh | [SRS](Pricing/SRS/F-M03-PRC-001_Pricing_SRS.md) |
| F-M04-PRO-001 | Promotion & Voucher | M04 | High | Draft | — | §3.4 Quyết định CTKM còn thủ công | [SRS](Promotion/SRS/F-M04-PRO-001_Promotion_SRS.md) |

---

## Blocking Reasons Per Feature

| Feature ID | Blocking Reason | Owner to Unblock |
|---|---|---|
| F-M01-PRD-001 | Cần rút chi tiết field, query pattern, và sales-safe projection từ source specs | Business Owner / IT |
| F-M02-INV-001 | Cần chốt realtime vs cache-soft policy theo từng kênh và từng use case | Business Owner |
| F-M03-PRC-001 | Chưa chốt source-priority rule cho giá theo kênh và loại cửa hàng | Business Owner / Finance |
| F-M04-PRO-001 | Chưa chốt source-priority rule cho CTKM và phạm vi public-safe exposure | Business Owner / Marketing |

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
| F-M03-PRC-001 | Chính sách 1 giá nhưng CTKM khác theo kênh/loại cửa hàng — người dùng nội bộ hỏi cùng câu nhưng nhận trả lời khác nhau | Customer Research Pack §3.3 | SAP B1, Haravan, KiotViet, M08 |
| F-M04-PRO-001 | Xác định CTKM phù hợp hiện đang làm thủ công — làm chậm phản ứng với markdown và sell-through | Customer Research Pack §3.4 | SAP B1, Haravan, KiotViet, M08 |

---

## Gate Status

| Feature ID | Gate 3 (PB-02→03) | Gate 4A (Design Direction) | Gate 4B (Mockup Signoff) |
|---|---|---|---|
| F-M01-PRD-001 | ⏳ Blocked (SRS Draft) | — | — |
| F-M02-INV-001 | ⏳ Blocked (SRS Draft) | — | — |
| F-M03-PRC-001 | ⏳ Blocked (SRS Draft) | — | — |
| F-M04-PRO-001 | ⏳ Blocked (SRS Draft) | — | — |

> **Ghi chú Gate 3**: 4 SRS đều đạt Rule 42 content depth gate (§5 ≥4 steps, §11 ≥3 testable rules, §17 có số đo, §18 ≥3 AC). Blocking reason là open questions về source-priority rules cần Business Owner chốt trước khi promote sang `SRS Ready`.

---

## Open Questions Cần Business Owner Chốt

| # | Feature | Question | Tác động |
|---|---|---|---|
| OQ-M01-01 | F-M01-PRD-001 | Bộ field nào public-safe theo từng channel (ecommerce, POS, đại lý)? | Quyết định sales-safe projection |
| OQ-M02-01 | F-M02-INV-001 | Freshness threshold theo từng nguồn và từng channel là bao nhiêu? | Quyết định realtime vs cache policy |
| OQ-M03-01 | F-M03-PRC-001 | Source owner cuối cùng của giá theo từng channel là gì? | Quyết định source-priority rule |
| OQ-M04-01 | F-M04-PRO-001 | Owner cuối của CTKM theo từng channel là gì? | Quyết định promotion scope rule |

---

_Last Updated: 2026-04-17 by Claude (Antigravity / claude-sonnet-4-6) — Audit session Catalog_And_Commerce_
