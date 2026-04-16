# UXUI Feature Spec: F-M05-ORD-001B Return Order

**Feature ID**: F-M05-ORD-001B
**Parent Feature ID**: F-M05-ORD-001
**Status**: Draft
**Owner**: A06 UI/UX Agent
**Last Updated By**: Codex CLI (GPT-5 Codex)
**Last Reviewed By**: A01 PM Agent
**Approval Required**: A05 Tech Lead, A01 PM
**Approved By**: -
**Last Status Change**: 2026-04-16
**Source of Truth**: This document
**Blocking Reason**: Can chot visual split giua refund path va exchange path, severity treatment cho reject / inspection fail, va field priority o fold dau
**Product**: MIA Smart / Orders And Service
**Date**: 2026-04-16

---

## 0. User & Task

### Target Roles

- CSKH
- Store Manager
- Bao hanh / dich vu
- Van hanh ban le

### Primary Goal

Mo nhanh mot `return order`, biet no dang o buoc nao, tra ve don goc nao, mat hang nao dang doi tra, xu ly theo huong `refund` hay `exchange`, va user can lam gi tiep theo.

### Success Criteria

- User nhin thay ro return order khac sales order.
- User thay du line doi tra, huong xu ly, policy, owner, va SLA.
- User khong can suy luan xem case dang refund hay exchange.

## 1. Screen Overview

### Surface Types

- detail drawer tu sales order
- full page return detail
- answer card trong AI Workspace

### Core Areas

1. `Return Header`
2. `Linked Original Order / Invoice`
3. `Return Status Rail`
4. `Return Line Items`
5. `Refund / Exchange Decision Block`
6. `Policy Citation`
7. `Related Transfer / Service Case`
8. `Owner + SLA + Next Action`

## 2. Screen Anatomy

### 2.1 Return Header

Phai hien thi ro:

- ma return order
- loai return (`return`, `exchange`, `refund`, `warranty-linked`)
- linked order / invoice goc
- kenh tiep nhan (`store`, `ecommerce`, `manual`, `call center`)
- `return_order_status`
- `refund_status`
- `exchange_status` neu co

Field priority fold dau:

1. ma return + loai return
2. linked order / invoice
3. current status cluster
4. owner / SLA
5. next action

### 2.2 Return Line Items

Tung line phai co:

- requested quantity
- approved quantity
- received quantity
- SKU / ten / variant
- return resolution
- target variant neu exchange

Neu inspection reject:

- line phai hien reject outcome ro
- khong duoc chi dua vao note o cuoi man hinh

### 2.3 Refund / Exchange Block

Neu case theo huong refund:

- refund amount
- refund status
- payment / channel summary

Neu case theo huong exchange:

- exchange target
- allocation / transfer dependency
- exchange status

Khong duoc tron refund va exchange vao mot layout giong nhau.

## 3. Main UX Rules

### Quick Action Path

1. Tim bang ma return hoac order goc
2. Doc header + status cluster
3. Kiem tra line item doi tra
4. Doc refund / exchange block
5. Kiem tra owner / SLA
6. Chon next action / escalation

### Exception Path

- `Rejected`: ly do reject phai o fold dau
- `Inspection Failed`: line nao fail phai hien ro
- `Policy Unavailable`: warning state, khong xac nhan duoc phep doi tra

## 4. State Matrix

| State | Visual | Notes |
|------|--------|-------|
| Requested | Neutral badge + waiting icon | Moi tiep nhan |
| Eligibility Review | Review banner | Can nguoi xu ly quyet |
| Awaiting Item Return | Timeline nhan manh buoc nhan hang | Cho khach tra hang |
| Inspection | Item condition block noi bat | Cho ket qua tham dinh |
| Refund Pending | Tien duoc nhan manh | Return huong refund |
| Exchange Pending | Target product block mo | Return huong exchange |
| Rejected | Red / warning card | Bat buoc co ly do |
| Completed | Success state | Da dong case |

## 5. Error & Recovery

- neu khong load duoc line item, van render header + status + owner
- neu policy citation loi, hien `policy unavailable`
- neu linked original order unavailable, giu header return va hien `original order unavailable`
- neu role bi han che, hien summary-level refund / inspection thay vi blank

## 6. Visibility Rules

### Refund Amount

- `CSKH`: summary refund amount
- `Store Manager`: refund amount trong scope cua hang / case minh
- `Bao hanh / dich vu`: refund amount day du neu case co lien quan
- `Manager`: day du

### Inspection Result

- `CSKH`: chi summary outcome
- `Store Manager`: outcome + note van hanh lien quan
- `Bao hanh / dich vu`: full inspection result
- `Manager`: full inspection result
- `AI Bot`: summary outcome only

## 7. Interaction Notes

- click `Original Order` quay lai `Sales Order And POS`
- click `Transfer` mo `Fulfillment / Transfer`
- click `Service Case` mo case sau ban lien quan
- click `Escalation CTA` tao handoff voi payload gom return header + lines + policy ref

## 8. Responsive Notes

- desktop: status rail va owner / SLA o cot phai
- mobile: status rail dat len tren return lines de user thay ngay huong xu ly
- refund / exchange block tren mobile phai stack theo mode hien tai, khong hien 2 block song song

## 9. Linked Artifacts

- SRS: [F-M05-ORD-001_Order_And_Fulfillment_SRS.md](../../Analysis/Features/Modules/Orders_And_Service/Order_And_Fulfillment/SRS/F-M05-ORD-001_Order_And_Fulfillment_SRS.md)
- Story: [US-M05-ORD-001B_Return_Order.md](../../Planning/Stories/Orders_And_Service/US-M05-ORD-001B_Return_Order.md)
