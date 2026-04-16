# Catalog And Commerce — Module Index

**Status**: Active
**Last Updated**: 2026-04-17
**Last Updated By**: Claude (Antigravity / claude-sonnet-4-6)
**Phase**: PB-02 / PB-03
**Source of Truth**: [Feature_Registry.md](Feature_Registry.md)

---

## Mục đích

Nhóm module **Catalog & Commerce** (M01–M04) phục vụ lớp dữ liệu nền cho chatbot nội bộ BQ:
tra cứu sản phẩm, tồn kho, giá, và khuyến mãi từ các hệ thống SAP B1 / KiotViet / Haravan.

Đây là prerequisite cho M09 (Internal AI Chat) và M10 (Sales Advisor AI).

---

## Module SRS Index

| Module | Feature ID | Feature Name | SRS Status | Blocking Reason | SRS Link |
|---|---|---|---|---|---|
| M01 | F-M01-PRD-001 | Product Catalog & Query | **Draft** | Cần chốt sales-safe field projection per channel | [F-M01-PRD-001](Product/SRS/F-M01-PRD-001_Product_SRS.md) |
| M02 | F-M02-INV-001 | Inventory Availability | **Draft** | Cần chốt freshness threshold per source/channel | [F-M02-INV-001](Inventory_Availability/SRS/F-M02-INV-001_Inventory_Availability_SRS.md) |
| M03 | F-M03-PRC-001 | Pricing Resolution | **Draft** | Chưa chốt source-priority rule per channel | [F-M03-PRC-001](Pricing/SRS/F-M03-PRC-001_Pricing_SRS.md) |
| M04 | F-M04-PRO-001 | Promotion & Voucher | **Draft** | Chưa chốt CTKM source-priority và public-safe scope | [F-M04-PRO-001](Promotion/SRS/F-M04-PRO-001_Promotion_SRS.md) |

---

## Cross-Module Dependencies

```
M01 (Product)
  ├── prerequisite cho M02, M03, M04
  ├── feeds M09 (Internal AI Chat)
  └── feeds M10 (Sales Advisor AI)

M02 (Inventory) → requires M01, M07
M03 (Pricing) → requires M01, M04, M07, M08
M04 (Promotion) → requires M01, M03, M07, M08
```

---

## BQ Requirement Coverage

| BQ Pain Point | Module Giải Quyết |
|---|---|
| Dữ liệu sản phẩm phân mảnh giữa SAP B1/KiotViet/Haravan | M01 |
| Tồn kho phân tán — "mã nào, size nào, ở đâu, có nên chuyển không" | M02 |
| Chính sách 1 giá nhưng CTKM khác theo kênh — hỏi cùng câu nhận trả lời khác nhau | M03 |
| Xác định CTKM đang làm thủ công — làm chậm sell-through | M04 |

---

## Next Actions

- [ ] Business Owner chốt 4 open questions trong `Feature_Registry.md` để mở promote SRS → `SRS Ready`
- [ ] Sau khi SRS Ready: PM mở Gate 3 → A06 bắt đầu design UXUI cho M01–M04
- [ ] UXUI Feature Specs cho M01–M04 sẽ được tạo sau khi SRS promoted

---

_Last Updated: 2026-04-17_
