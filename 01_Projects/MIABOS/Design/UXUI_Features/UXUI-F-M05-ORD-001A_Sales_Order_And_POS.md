# UXUI Feature Spec: F-M05-ORD-001A Sales Order And POS

**Feature ID**: F-M05-ORD-001A
**Parent Feature ID**: F-M05-ORD-001
**Status**: Draft
**Owner**: A06 UI/UX Agent
**Last Updated By**: Codex CLI (GPT-5 Codex)
**Last Reviewed By**: A01 PM Agent
**Approval Required**: A05 Tech Lead, A01 PM
**Approved By**: -
**Last Status Change**: 2026-04-16
**Source of Truth**: This document
**Blocking Reason**: Can chot field priority tren header/detail fold dau, visual treatment cho order-level vs line-level CTKM, va pattern expanded line detail trong phase 1
**Product**: MIA Smart / Orders And Service
**Date**: 2026-04-16

---

## 0. User & Task

### Target Roles

- CSKH
- Store Manager
- Van hanh ban le
- Ecommerce
- AI-assisted operator

### Primary Goal

Mo nhanh mot `sales order` hoac `POS invoice`, nhin thay ngay khach nao mua gi, mua o kenh nao, CTKM nao dang ap dung, trang thai xu ly don va giao nhan hien tai, de tra loi khach va dieu huong tac vu tiep theo.

### Success Criteria

- User phan biet duoc `sales order` va `POS invoice` trong 1-2 giay dau.
- User thay du line item va CTKM ma khong can mo them he thong nguon.
- User nhin thay ngay co `return`, `service case`, `conflict`, hay `stale` de xu ly tiep.

## 1. Screen Overview

### Surface Types

- answer card trong AI Workspace
- detail drawer / side panel
- full detail page cho order / POS

### Route Decision

- `Sales Order`: route chinh cho don ban online hoac don co fulfillment context
- `POS Invoice`: route song song, khong phai child-view bat buoc cua `Sales Order`
- neu co linked record, header phai hien CTA di sang route lien quan

### Core Areas

1. `Header`
2. `Status Rail`
3. `Financial Summary`
4. `Product Lines`
5. `Promotion Summary`
6. `Fulfillment Snapshot`
7. `Related Returns / Service Cases`
8. `Next Action + Escalation CTA`

## 2. Screen Anatomy

### 2.1 Header

Header bat buoc co:

- label `Sales Order` hoac `POS Invoice`
- ma giao dich chinh
- customer name
- phone masked theo quyen
- channel (`online`, `store`, `omnichannel`)
- store name neu co
- freshness badge
- conflict badge neu co

Field priority fold dau:

1. loai giao dich + ma giao dich
2. customer
3. current status cluster
4. amount summary
5. CTA di sang linked record

### 2.2 Status Rail

Phai tach ro:

- `sales_order_status`
- `payment_status`
- `fulfillment_status`

Neu la `POS Invoice` thi:

- `payment_status` uu tien hien cao hon
- `fulfillment_status` chi hien khi giao dich co lien ket giao nhan / transfer / delivery

### 2.3 Financial Summary

Phai hien thi:

- subtotal
- total discount
- shipping fee neu co
- grand total
- refunded amount neu co lien ket refund

Khong hien:

- internal cost
- margin
- actor tao manual discount neu role khong du quyen

### 2.4 Product Lines

Moi line phai hien thi:

- SKU
- product name
- variant / size / color
- quantity
- unit price
- line discount
- line net amount
- line fulfillment status neu khac status tong

Neu co > 4 lines:

- fold dau chi hien 4 lines dau
- co CTA `Xem tat ca line`

### 2.5 Promotion Summary

Phai tach:

- `order-level promotion`
- `line-level discount`
- `voucher`
- `bundle / gift`
- `member benefit`
- `manual discount`

Khong duoc gop nhieu loai CTKM thanh 1 dong "giam gia".

## 3. Main UX Rules

### Quick Action Path

1. Search bang ma don hoac ma hoa don
2. Mo detail
3. Doc header + status + amount
4. Kiem tra line item / CTKM
5. Chon next action hoac linked record

### Exception Path

Neu `stale` hoac `conflict`:

- banner canh bao nam tren cung
- CTA `Tao escalation`
- linked source / synced_at phai nhin thay duoc

### Related Record Path

- click `Related Return` mo `Return Order`
- click `Service Case` mo `After-sales Service Case`
- click `Xem fulfillment` mo `Fulfillment And Transfer`

## 4. State Matrix

| State | Visual | Notes |
|------|--------|-------|
| Sales Order Online | Header neutral + shipment snapshot | Don online |
| POS Invoice | Header ngan hon + store context ro hon | Giao dich tai diem ban |
| Multi-line Order | Product list mo rong | > 1 line item |
| Promotion-heavy Order | Promotion section mo mac dinh | Co >= 2 lop CTKM |
| No Fulfillment Context | Fulfillment block collapse | POS / completed case |
| Restricted | Mot so field mask | Theo M07 |
| Conflict | Banner canh bao tren cung | Can review |
| Stale | Freshness badge warning | Khong gia vo realtime |

## 5. Error & Recovery

### Common Errors

- khong tim thay order
- khong load duoc line item
- khong load duoc promotion detail
- linked return / service record unavailable

### Recovery Rules

- neu khong load duoc line item, van render header + status + amount
- neu khong load duoc promotion detail, hien `promotion summary unavailable`
- neu linked record loi, giu CTA disabled state + ly do
- neu restricted, hien masked field thay vi fail toan man hinh

## 6. Visibility Rules

### Manual Discount

- `CSKH` va `AI Bot`: chi thay summary-level manual discount
- `Store Manager`: thay chi tiet trong scope cua hang duoc cap
- `Manager`: thay day du trong scope duoc cap

### Refund Amount In Sales Context

- chi hien khi sales order / POS da co linked return
- `CSKH`: thay summary amount
- role sau ban / manager: thay detail hon neu can

## 7. Interaction Notes

- click line item mo drawer detail line
- click status badge loc timeline / linked flow neu co
- AI answer card phai co CTA `Xem chi tiet`
- full page phai co CTA `Tao escalation`

## 8. Responsive Notes

- desktop dung layout `2-column`: trai cho status + lines, phai cho financial + CTKM + action
- mobile stack theo thu tu: header -> status -> financial -> lines -> CTKM -> fulfillment -> related cases -> CTA
- product line tren mobile doi sang row 2 tang: name/variant o tren, qty/price o duoi

## 9. Linked Artifacts

- SRS: [F-M05-ORD-001_Order_And_Fulfillment_SRS.md](../../Analysis/Features/Modules/Orders_And_Service/Order_And_Fulfillment/SRS/F-M05-ORD-001_Order_And_Fulfillment_SRS.md)
- Story: [US-M05-ORD-001A_Sales_Order_And_POS.md](../../Planning/Stories/Orders_And_Service/US-M05-ORD-001A_Sales_Order_And_POS.md)
