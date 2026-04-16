# User Story: Sales Order And POS

**Status**: Draft
**Owner**: [[A03_BA_Agent]]
**Last Updated By**: Codex CLI (GPT-5 Codex)
**Last Reviewed By**: A01 PM Agent
**Approval Required**: BA Agent + PM Agent
**Approved By**: -
**Last Status Change**: 2026-04-16
**Source of Truth**: This file
**Blocking Reason**: Can chot field priority o header, visual treatment cho order-level vs line-level CTKM, va source-priority cho fulfillment truth

## Story Identity

- `Story ID`: `US-M05-ORD-001A`
- `Feature ID`: `F-M05-ORD-001`
- `Module`: `Orders And Service`

## User Story

`La CSKH / Store Manager / Van hanh ban le / Ecommerce, toi muon mo nhanh sales order hoac POS invoice de thay customer, line item, CTKM, payment, va fulfillment context trong cung mot view ro rang, de tra loi khach va dieu huong nghiep vu tiep theo.`

## Problem / Outcome

- Hien tai order va POS context de bi tron nhau neu khong co route / field split ro.
- User can doc nhanh line item, CTKM, payment, va fulfillment ma khong phai sang he thong nguon.
- Story nay tao man hinh order / POS operational-first, khong phai accounting-first.

## Trigger

- Tim bang `ma don`
- Tim bang `ma hoa don`
- Mo tu `Customer 360`
- Mo tu `AI answer card`

## Happy Path

1. User search theo ma don hoac ma hoa don.
2. He thong resolve dung `sales order` hoac `POS invoice`.
3. User mo detail va doc header + status + amount.
4. User xem line item va promotion summary.
5. User mo linked return / fulfillment / service case neu can.
6. User chon next action hoac tao escalation.

## Acceptance Criteria

| AC ID | Given | When | Then |
|------|-------|------|------|
| AC-01 | user tim bang ma don hoac ma hoa don | mo ket qua | he thong phan biet ro `sales order` va `POS invoice` |
| AC-02 | sales order co nhieu line item | mo detail | thay du SKU, size, mau, quantity, unit price, discount, line net amount |
| AC-03 | don co CTKM o nhieu muc | mo detail | thay ro `order-level promotion` va `line-level discount` khong bi gop mo ho |
| AC-04 | user mo POS invoice | xem header | thay route / breadcrumb POS invoice rieng, khong bi ep di qua sales-order route |
| AC-05 | user khong du quyen xem full manual discount detail | mo detail | chi thay summary-level discount theo policy |
| AC-06 | don co linked return hoac service case | mo detail | thay CTA di sang linked route dung ngu canh |
| AC-07 | fulfillment block khong co du lieu | mo detail | man hinh van render order / POS detail ma khong fail toan bo |

## Dependencies

- `F-M05-ORD-001` SRS
- `UXUI-F-M05-ORD-001A`
- `M07` cho masking / sensitivity
- `M11` cho escalation CTA

## Out Of Scope

- tao / sua / huy don
- sua CTKM
- sua line item
- write-back giao dich ve he thong nguon

## Linked Artifacts

- UXUI: [UXUI-F-M05-ORD-001A_Sales_Order_And_POS.md](../../../Design/UXUI_Features/UXUI-F-M05-ORD-001A_Sales_Order_And_POS.md)
- SRS: [F-M05-ORD-001_Order_And_Fulfillment_SRS.md](../../../Analysis/Features/Modules/Orders_And_Service/Order_And_Fulfillment/SRS/F-M05-ORD-001_Order_And_Fulfillment_SRS.md)
