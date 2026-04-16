# User Story: Return Order

**Status**: Draft
**Owner**: [[A03_BA_Agent]]
**Last Updated By**: Codex CLI (GPT-5 Codex)
**Last Reviewed By**: A01 PM Agent
**Approval Required**: BA Agent + PM Agent
**Approved By**: -
**Last Status Change**: 2026-04-16
**Source of Truth**: This file
**Blocking Reason**: Can chot field bat buoc cho return line, ownership giua store-led return va service-case flow, va source-priority cho refund / exchange state

## Story Identity

- `Story ID`: `US-M05-ORD-001B`
- `Feature ID`: `F-M05-ORD-001`
- `Module`: `Orders And Service`

## User Story

`La CSKH / Store Manager / Bao hanh dich vu, toi muon mo nhanh mot return order de thay don goc, ly do doi tra, item nao dang doi tra, dang theo huong refund hay exchange, va ai dang xu ly, de xu ly sau ban dung va khong bi nham voi sales order.`

## Problem / Outcome

- Return order de bi nham voi sales order neu khong co state va field set rieng.
- User can biet ro case dang refund hay exchange de khong huong dan sai cho khach.
- Story nay dat return order thanh mot operational object doc lap nhung van linked ve don goc.

## Trigger

- Tim bang `ma return`
- Tim bang `sales order` / `invoice` goc
- Mo tu `Sales Order And POS`
- Mo tu `After-sales Service Case`

## Happy Path

1. User mo return order.
2. Doc header + linked original order.
3. Kiem tra status cluster `return / refund / exchange`.
4. Doc tung line item doi tra.
5. Xem policy citation va owner / SLA.
6. Chon next action hoac escalation.

## Acceptance Criteria

| AC ID | Given | When | Then |
|------|-------|------|------|
| AC-01 | user tim bang ma return hoac don goc | mo ket qua | he thong mo dung `return order` thay vi sales-order detail |
| AC-02 | return order co nhieu line item | mo detail | thay `requested_quantity`, `approved_quantity`, `received_quantity`, va `return_resolution` cua tung line |
| AC-03 | return order theo huong refund | mo detail | thay `return_order_status`, `refund_status`, refund amount, va policy citation |
| AC-04 | return order theo huong exchange | mo detail | thay `exchange_status`, target variant neu co, va lien ket sang transfer / fulfillment context neu can |
| AC-05 | user role chi duoc xem inspection summary | mo detail | he thong khong lo note tham dinh full hoac thong tin restricted |
| AC-06 | return order bi reject | mo detail | ly do reject hien o fold dau va khong bi an trong note cuoi |
| AC-07 | original order unavailable | mo detail | return detail van render va hien trang thai linked-order unavailable |

## Dependencies

- `F-M05-ORD-001` SRS
- `UXUI-F-M05-ORD-001B`
- `M08` policy citation
- `M11` escalation

## Out Of Scope

- approval workflow tu dong
- write-back refund
- cap nhat inspection result tu UI nay

## Linked Artifacts

- UXUI: [UXUI-F-M05-ORD-001B_Return_Order.md](../../../Design/UXUI_Features/UXUI-F-M05-ORD-001B_Return_Order.md)
- SRS: [F-M05-ORD-001_Order_And_Fulfillment_SRS.md](../../../Analysis/Features/Modules/Orders_And_Service/Order_And_Fulfillment/SRS/F-M05-ORD-001_Order_And_Fulfillment_SRS.md)
