# User Story: After-sales Service Case

**Status**: Draft
**Owner**: [[A03_BA_Agent]]
**Last Updated By**: Codex CLI (GPT-5 Codex)
**Last Reviewed By**: A01 PM Agent
**Approval Required**: BA Agent + PM Agent
**Approved By**: -
**Last Status Change**: 2026-04-16
**Source of Truth**: This file
**Blocking Reason**: Can chot action taxonomy phase 1, SLA rule, va ownership giua service case voi return order

## Story Identity

- `Story ID`: `US-M05-ORD-001D`
- `Feature ID`: `F-M05-ORD-001`
- `Module`: `Orders And Service`

## User Story

`La CSKH / Bao hanh dich vu / Store Manager, toi muon mo mot after-sales service case de thay case loai nao, lien quan don / return / invoice nao, ai dang xu ly, co qua SLA khong, va co can handoff hay lien he khach tiep theo khong.`

## Problem / Outcome

- Case sau ban de bi "chim" trong note neu khong co trang detail ro.
- CSKH can doc duoc latest note va issue summary nhanh ma khong can xem toan bo history.
- Story nay bien service case thanh mot object van hanh ro route, ro owner, ro SLA.

## Trigger

- Mo tu `Sales Order`
- Mo tu `Return Order`
- Mo tu `Customer 360`
- Mo tu `AI answer card`

## Happy Path

1. User mo service case.
2. Doc case header + SLA.
3. Kiem tra linked order / return / invoice.
4. Doc issue summary + latest note.
5. Kiem tra inspection outcome theo scope quyen.
6. Chon next action hoac escalation.

## Acceptance Criteria

| AC ID | Given | When | Then |
|------|-------|------|------|
| AC-01 | service case ton tai | mo detail | thay case type, owner, SLA, latest note, va linked record |
| AC-02 | case lien quan return order | mo detail | thay CTA di truc tiep sang return-order route |
| AC-03 | case lien quan POS invoice | mo detail | thay CTA di truc tiep sang POS invoice route |
| AC-04 | user la CSKH | mo detail | chi thay summary inspection outcome, khong thay full inspection note |
| AC-05 | case qua SLA | mo detail | SLA warning duoc hien ro hon status thong thuong va co escalation CTA |
| AC-06 | linked record unavailable | mo detail | service case van render va hien linked-record unavailable |
| AC-07 | latest note unavailable | mo detail | issue summary, owner, va SLA van hien day du |

## Dependencies

- `F-M05-ORD-001` SRS
- `UXUI-F-M05-ORD-001D`
- `M08` policy citation
- `M11` escalation / routing

## Out Of Scope

- tao case moi
- sua SLA
- cap nhat inspection outcome tu UI nay

## Linked Artifacts

- UXUI: [UXUI-F-M05-ORD-001D_After_Sales_Service_Case.md](../../../Design/UXUI_Features/UXUI-F-M05-ORD-001D_After_Sales_Service_Case.md)
- SRS: [F-M05-ORD-001_Order_And_Fulfillment_SRS.md](../../../Analysis/Features/Modules/Orders_And_Service/Order_And_Fulfillment/SRS/F-M05-ORD-001_Order_And_Fulfillment_SRS.md)
