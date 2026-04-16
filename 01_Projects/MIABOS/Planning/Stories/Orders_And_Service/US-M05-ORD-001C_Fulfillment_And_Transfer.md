# User Story: Fulfillment And Transfer

**Status**: Draft
**Owner**: [[A03_BA_Agent]]
**Last Updated By**: Codex CLI (GPT-5 Codex)
**Last Reviewed By**: A01 PM Agent
**Approval Required**: BA Agent + PM Agent
**Approved By**: -
**Last Status Change**: 2026-04-16
**Source of Truth**: This file
**Blocking Reason**: Can chot source-priority cho fulfillment truth, visual model cho shipment leg, va transfer milestone bat buoc trong phase 1

## Story Identity

- `Story ID`: `US-M05-ORD-001C`
- `Feature ID`: `F-M05-ORD-001`
- `Module`: `Orders And Service`

## User Story

`La Logistics / Van hanh ban le / Ecommerce / CSKH, toi muon theo doi shipment va transfer lien quan don hang trong mot timeline ro rang, de biet don dang duoc xu ly toi dau, co conflict hay stale khong, va can xu ly tiep nhu the nao.`

## Problem / Outcome

- Fulfillment va transfer de bi tron ngu canh neu khong co timeline split ro.
- Conflict giua logistics source va SAP ref co the dan toi huong dan sai.
- Story nay giup logistics / CSKH doc nhanh moc van hanh thay vi doc raw source status.

## Trigger

- Mo tu `Sales Order`
- Mo tu `POS Invoice`
- Tim bang `tracking number`
- Tim bang `transfer ref`

## Happy Path

1. User mo fulfillment / transfer context.
2. Doc shipment header.
3. Theo doi timeline fulfillment.
4. Kiem tra transfer block neu co.
5. Xem conflict / stale banner neu xuat hien.
6. Chon next action hoac escalation.

## Acceptance Criteria

| AC ID | Given | When | Then |
|------|-------|------|------|
| AC-01 | sales order co fulfillment context | mo timeline | thay cac moc allocate, pack, handed to carrier, in transit, delivered / failed |
| AC-02 | co transfer lien quan exchange hoac bo sung fulfillment | mo context | thay transfer status va lien ket voi order / return hien tai |
| AC-03 | user vao tu POS invoice | mo fulfillment | breadcrumb / back action giu route POS invoice thay vi ep qua sales order |
| AC-04 | source logistics va SAP delivery ref xung dot | mo timeline | he thong hien conflict banner ro rang |
| AC-05 | du lieu stale vuot threshold | mo timeline | thay freshness badge va cache time |
| AC-06 | co nhieu shipment leg | mo timeline | user phan biet duoc tung leg thay vi mot timeline gop mo ho |
| AC-07 | transfer detail unavailable | mo context | man hinh van render shipment context va hien thong bao transfer unavailable |

## Dependencies

- `F-M05-ORD-001` SRS
- `UXUI-F-M05-ORD-001C`
- shipping / transfer read models
- `M11` escalation

## Out Of Scope

- booking carrier
- sua fulfillment status
- tao transfer tu UI nay

## Linked Artifacts

- UXUI: [UXUI-F-M05-ORD-001C_Fulfillment_And_Transfer.md](../../../Design/UXUI_Features/UXUI-F-M05-ORD-001C_Fulfillment_And_Transfer.md)
- SRS: [F-M05-ORD-001_Order_And_Fulfillment_SRS.md](../../../Analysis/Features/Modules/Orders_And_Service/Order_And_Fulfillment/SRS/F-M05-ORD-001_Order_And_Fulfillment_SRS.md)
