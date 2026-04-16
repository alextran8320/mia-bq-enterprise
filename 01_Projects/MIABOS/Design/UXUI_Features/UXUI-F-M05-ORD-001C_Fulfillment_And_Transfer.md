# UXUI Feature Spec: F-M05-ORD-001C Fulfillment And Transfer

**Feature ID**: F-M05-ORD-001C
**Parent Feature ID**: F-M05-ORD-001
**Status**: Draft
**Owner**: A06 UI/UX Agent
**Last Updated By**: Codex CLI (GPT-5 Codex)
**Last Reviewed By**: A01 PM Agent
**Approval Required**: A05 Tech Lead, A01 PM
**Approved By**: -
**Last Status Change**: 2026-04-16
**Source of Truth**: This document
**Blocking Reason**: Can chot visual model cho shipment legs, transfer milestone, va conflict treatment giua Haravan logistics source voi SAP delivery ref
**Product**: MIA Smart / Orders And Service
**Date**: 2026-04-16

---

## 0. User & Task

### Target Roles

- Logistics
- Van hanh ban le
- Ecommerce
- CSKH

### Primary Goal

Theo doi nhanh don dang o buoc fulfillment nao, da ban giao van chuyen chua, giao that bai hay da giao thanh cong, va neu co chuyen kho lien quan thi thay duoc tien do ngay tren cung surface.

### Success Criteria

- User thay ngay moc `Handed To Carrier`.
- User phan biet duoc shipment timeline va transfer timeline.
- Conflict / stale duoc nhin thay truoc khi user ra quyet dinh.

## 1. Screen Overview

### Surface Types

- fulfillment timeline drawer
- shipment / transfer page
- embedded block trong sales order

### Core Areas

1. `Shipment Header`
2. `Fulfillment Timeline`
3. `Carrier / Tracking Block`
4. `Delivery Outcome`
5. `Transfer Block`
6. `Conflict / Freshness Banner`
7. `Next Action`

## 2. Screen Anatomy

### 2.1 Shipment Header

Phai co:

- shipment ref
- linked sales order / POS ref
- carrier
- tracking number
- current fulfillment status
- freshness badge

### 2.2 Fulfillment Timeline

Timeline phai tach ro:

- allocation
- packing
- handed to carrier
- in transit
- delivery attempted
- delivered / failed / returned to sender

Neu co nhieu shipment leg:

- moi leg co subheader rieng
- khong duoc gop thanh mot timeline khong nhan biet duoc

### 2.3 Transfer Block

Phai co:

- transfer ref
- from / to location
- transfer status
- reason
- ETA neu co

Transfer la secondary block, nhung phai du visible neu lien quan exchange / replenishment.

## 3. Main UX Rules

- timeline phai tach ro `sales-order fulfillment` va `internal transfer` neu ca hai cung ton tai
- `Handed To Carrier` la moc quan trong, phai nhin thay trong 1-2 giay dau
- neu `delivery failed`, ly do that bai phai hien ngay gan timeline
- neu co conflict giua source logistics va SAP delivery ref, banner conflict nam tren timeline
- neu vao tu `POS Invoice` thi header phai giu breadcrumb quay lai route POS, khong ep user di qua `Sales Order`

## 4. State Matrix

| State | Visual | Notes |
|------|--------|-------|
| Awaiting Fulfillment | Empty timeline start | Chua alloc / pack |
| In Fulfillment | Timeline dang mo rong | Pack / allocate |
| In Transit | Tracking block active | Da ban giao van chuyen |
| Delivery Failed | Warning branch | Co ly do that bai |
| Returned To Sender | Reverse flow visual | Hoan ve |
| Transfer Running | Secondary timeline | Chuyen kho noi bo |
| Stale | Freshness warning | Khong gia vo realtime |
| Conflict | Banner tren cung | Can review |

## 5. Error & Recovery

- neu khong load duoc shipment detail, van render header + latest status
- neu transfer unavailable, hien `transfer detail unavailable`
- neu tracking source loi, giu last successful sync + stale state

## 6. Interaction Notes

- click `tracking number` mo shipment detail
- click `transfer ref` mo transfer detail
- click `delivery failed` mo next action / escalation
- embedded block trong sales order phai co nut `Xem fulfillment`

## 7. Responsive Notes

- mobile timeline doi sang stacked cards
- conflict / stale banner van dat tren timeline, khong day xuong cuoi man hinh

## 8. Linked Artifacts

- SRS: [F-M05-ORD-001_Order_And_Fulfillment_SRS.md](../../Analysis/Features/Modules/Orders_And_Service/Order_And_Fulfillment/SRS/F-M05-ORD-001_Order_And_Fulfillment_SRS.md)
- Story: [US-M05-ORD-001C_Fulfillment_And_Transfer.md](../../Planning/Stories/Orders_And_Service/US-M05-ORD-001C_Fulfillment_And_Transfer.md)
