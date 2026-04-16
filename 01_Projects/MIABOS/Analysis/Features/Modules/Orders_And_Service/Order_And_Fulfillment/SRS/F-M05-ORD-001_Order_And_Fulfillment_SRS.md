# Feature SRS: F-M05-ORD-001 Order and Fulfillment

**Status**: Draft
**Owner**: A03 BA Agent
**Last Updated By**: Codex CLI (GPT-5 Codex)
**Last Reviewed By**: A01 PM Agent
**Approval Required**: PM
**Approved By**: -
**Last Status Change**: 2026-04-16
**Source of Truth**: This document
**Blocking Reason**: Can chot source-priority cho sales order / return order theo tung tinh huong, mapping giua sales-order state va return-order state, va policy write-back sang ERP/channel khi mo rong sau phase 1
**Module**: M05
**Phase**: PB-02 / PB-03
**Priority**: High
**Document Role**: SRS chi tiet cho module Order and Fulfillment, nen tang tra cuu va dieu huong nghiep vu don hang, giao nhan, doi tra, chuyen kho, va hau mai cho MIABOS

---

## 0. Metadata

- Feature ID: `F-M05-ORD-001`
- Related User Story: `US-M05-ORD-001`
- Related Screens:
  - Order summary answer
  - Order detail summary drawer
  - POS invoice detail
  - Fulfillment tracking timeline
  - Return / exchange / transfer status detail
  - After-sales service case summary
  - Escalation CTA
- Related APIs:
  - `POST /mia/orders/query`
  - `GET /mia/orders/{order_id}`
  - `POST /mia/orders/{order_id}/timeline`
  - `POST /mia/fulfillment/query`
  - `POST /mia/returns/query`
  - `POST /mia/transfers/query`
  - `POST /mia/service-cases/query`
- Related Tables:
  - `crm_order_summary`
  - `crm_order_line_summary`
  - `crm_order_promotion_summary`
  - `crm_order_fulfillment_summary`
  - `crm_order_return_summary`
  - `crm_transfer_summary`
  - `crm_service_case_summary`
  - `har_order_read_model`
  - `har_order_line_read_model`
  - `har_fulfillment_read_model`
  - `har_refund_read_model`
  - `kv_order_read_model`
  - `kv_sales_invoice_read_model`
  - `kv_order_line_read_model`
  - `kv_return_read_model`
  - `sap_sales_order_ref`
  - `sap_delivery_ref`
  - `sap_return_ref`
  - `sap_transfer_ref`
  - `logistics_read_model`
- Related Events:
  - `order.summary.updated`
  - `order.line.summary.updated`
  - `order.fulfillment.updated`
  - `order.return.updated`
  - `order.transfer.updated`
  - `service.case.updated`
- Related Error IDs:
  - `ORD-001`
  - `ORD-002`
  - `ORD-003`
  - `ORD-004`
  - `ORD-005`

## 0B. Integration Source Map

| Data Domain | Source System | Direction | Notes |
|---|---|---|---|
| Don hang online, line item, thanh toan online, CTKM online, shipment ecommerce | Haravan | Read | Nguon chinh cho online order, shipping progress, refund online |
| Hoa don POS, don ban tai cua hang, line item POS, doi tra tai diem ban | KiotViet | Read | Nguon cho giao dich tai cua hang va hoa don POS |
| Sales order ERP, delivery, return doc, transfer doc, warehouse movement | SAP B1 | Read | Nguon ERP / logistics / document-level reconciliation |
| Chinh sach doi tra, bao hanh, sau ban, SLA xu ly | MIABOS Knowledge Center (M08) | Read | Policy layer, citation bat buoc khi tra loi nghiep vu nhay cam |
| Customer profile, order summary hop nhat, service case summary | MIABOS internal DB | Read/Write | MIA luu summary, timeline, escalation context, khong mirror full transaction payload |

## 0C. POC Implementation Framing

### 0C.1 Muc tieu POC

POC cua `Order and Fulfillment` phai du de:

- tra cuu nhanh thong tin tong quan don hang cho CSKH, van hanh, cua hang, logistics
- gom ngu canh don online, POS, transfer, return, service case vao mot lop summary thong nhat
- giai quyet nhu cau hoi dap noi bo ve don hang ma khong bat user mo 3 he thong khac nhau
- cap context cho `M06 Customer 360`, `M09 Internal AI Chat`, `M10 Sales Advisor AI`, va `M11 Escalation`
- uu tien read-only / summary-first, chua day workflow tao sua giao dich tren ERP / channel trong phase 1

### 0C.2 Pham vi POC bat buoc

POC phase 1 bat buoc co:

- `Sales Order Summary`
- `Sales Order Line Summary`
- `Promotion / Discount Summary`
- `POS Invoice Detail Summary`
- `Fulfillment Tracking`
- `Return Order Summary`
- `Transfer Status Summary`
- `After-sales Service Case Summary`
- `Source / Freshness / Conflict Badge`
- `Escalation CTA`

POC phase 1 chua bat buoc full sau:

- tao / sua / huy don tren Haravan / KiotViet / SAP
- write-back tu MIABOS vao ERP cho return / transfer
- full accounting payload va posting detail
- logistics route planning / carrier booking
- auto adjudication cho return / warranty

### 0C.3 Quyet dinh trien khai chinh

- `MIA BOS` la master cua lop `order summary / service summary` phuc vu AI, CRM, Sales, CSKH
- `Haravan`, `KiotViet`, `SAP B1` van la master cua transaction phat sinh tren tung kenh / tai lieu nghiep vu goc
- `MIA BOS` luu `summary + mapping + freshness + policy citation + escalation context`, khong mirror full payload giao dich
- `Promotion` trong order phai duoc hien thi nhu `promotion outcome summary`, khong tu tinh lai CTKM tu dau trong phase 1
- `Product line` trong order phai hien thi du thong tin de support ban hang va cham soc: SKU, ten, size, mau, so luong, gia, giam gia, thanh tien, tinh trang fulfilment line neu co

## 1. User Story

La `CSKH`, `Store Manager`, `Van hanh ban le`, `Logistics`, `Ecommerce`, `Bao hanh / dich vu`, hoac `AI noi bo`, toi muon tra cuu duoc don hang, hoa don POS, fulfillment, doi tra, chuyen kho, va case hau mai o muc do du dung cho van hanh va cham soc khach hang, de biet don dang o dau, gom nhung san pham nao, dang ap dung CTKM nao, tinh trang giao nhan / doi tra ra sao, va khi nao can tao escalation cho nguoi xu ly.

## 1A. User Task Flow

| Step | User Role | Action | Task Type | Notes |
|------|-----------|--------|-----------|-------|
| 1 | CSKH / Store / Logistics / AI | Tim don theo ma don, ma hoa don, SDT, ten khach, ma van don, ma doi tra, ma chuyen kho | Quick Action | Diem vao chinh |
| 2 | He thong | Resolve order identity qua canonical mapping va customer context | Quick Action | Dinh danh online / POS / ERP / return / transfer |
| 3 | He thong | Xac dinh truy van theo capability phu hop: order, POS invoice, fulfillment, return, transfer, service case | Quick Action | Dieu huong theo nghiep vu |
| 4 | User | Xem order summary tong quan: nguon don, trang thai xu ly, customer, cua hang / kenh, tong tien, line items, CTKM, payment | Reporting | View tong hop |
| 5 | User | Mo chi tiet timeline de xem xu ly don, giao nhan, ban giao van chuyen, doi tra, hoan tien, chuyen kho, service case | Reporting | Operational deep-dive |
| 6 | User | Neu phat hien conflict / stale / can xu ly sau, tao escalation hoac follow-up case | Exception Handling | Handoff sang M11 |
| 7 | Manager / QA / Ops | Theo doi source, freshness, unresolved query, va conflict status | Reporting | Governance |

## 2. Business Context

BQ van hanh mo hinh ban le da kenh voi hon 200 cua hang / dai ly, co ecommerce, POS tai diem ban, ERP cho logistics va tai lieu nghiep vu, dong thoi co cac chinh sach doi tra / bao hanh / sau ban can nhat quan tren nhieu bo phan. Theo BQ pack:

- du lieu van hanh dang phan manh giua `SAP B1`, `KiotViet`, `Haravan`, va co the ca bang Excel ho tro
- CSKH, van hanh cua hang, logistics, va bo phan sau ban can cung tra loi cac cau hoi "don nay dang o dau", "da giao chua", "tra hang xu ly toi dau", "co doi size duoc khong", "hoa don POS nay thuoc cua hang nao", "co can dieu chuyen kho khong"
- chatbot noi bo phase 1 chi tao duoc niem tin neu co lop source-of-truth va business-rule layer ro rang cho order / fulfillment, tuong tu cach BQ can cho inventory, pricing, va promotion

Module `Order and Fulfillment` vi vay khong chi la "xem trang thai don", ma la mot operational answer layer bao phu:

- don hang tong quan
- giao dich ban hang tai cua hang / POS
- trang thai fulfillment va giao nhan
- nghiep vu doi tra / doi size / chuyen kho
- case bao hanh / khieu nai / cham soc sau ban

Neu khong co lop nay, `M06 Customer 360` se thieu order context, `M09` se tra loi mo ho, `M10` khong co du lieu de goi y next-best-action, va `M11` khong du payload de handoff.

## 3. Preconditions

- `M06 Customer and CRM` da co customer identity toi thieu de resolve khach theo phone / ten / order relation.
- `I05 Canonical Mapping and Source of Truth` da co rule map giua `Haravan`, `KiotViet`, `SAP B1`, va `mia_order_id`.
- `M03 Pricing` va `M04 Promotion` da co source-priority rule de M05 biet cach doc `promotion outcome summary`.
- `M08 Knowledge and Policy` da publish chinh sach doi tra / bao hanh / sau ban de M05 co policy citation.
- `M07 Access Control and Sensitivity` da co rule mask field nhay cam theo role / chi nhanh / cua hang / kenh.
- Connector `I02`, `I03`, `I04` da cung cap read model / sync co freshness metadata.

## 4. Postconditions

- User nhan duoc summary du dung cho nghiep vu order / POS / fulfillment / doi tra / transfer / hau mai ma khong can mo he thong nguon ngay lap tuc.
- Moi cau tra loi co `source`, `synced_at`, va badge `fresh / stale / conflict` ro rang.
- Khi can xu ly tiep, user co `next action` hoac `escalation CTA` ro.
- `M06` co the doc duoc order history / service history o muc summary cho Customer 360.
- `M11` nhan duoc payload escalation toi thieu khi case vuot qua kha nang chatbot / tra cuu summary.

## 5. Main Flow

### 5.1 Tra cuu tom tat don hang ban

1. User hoi theo ma don, SDT, ten khach, ma van don, hoac ma hoa don.
2. He thong resolve customer va order identity qua `crm_order_summary`, `crm_customer`, va cac read model lien quan.
3. He thong xac dinh loai giao dich chinh: `Sales Order Online`, `Sales Invoice POS`, `Return Order`, `Transfer`, hoac `Service Case`.
4. Neu ket qua la `Sales Order Online` hoac `Sales Invoice POS`, he thong tai `sales-order summary header`: ma don / ma hoa don, nguon, customer, cua hang / kenh, tong tien, payment state, sales-order state, fulfillment state, source freshness.
5. He thong tai `sales-order line summary`: SKU, ten san pham, size, mau, so luong, don gia, giam gia, thanh tien, line fulfillment state neu co.
6. He thong tai `promotion summary`: CTKM da ap dung, loai giam gia, coupon / campaign ref, muc giam, note neu la online-only / store-only.
7. He thong tai `next action`: cho dong goi, dang giao, cho doi tra, can lien he khach, can chuyen kho, hoac can tao service case.
8. User xem summary, mo timeline chi tiet, hoac tao escalation neu can.

### 5.2 Xem hoa don ban hang / POS

1. User nhap ma hoa don POS, SDT khach, hoac ma cua hang.
2. He thong goi read model KiotViet va mapping voi customer / ERP ref neu co.
3. He thong hien thi thong tin hoa don: cua hang, nhan vien ban, thoi diem giao dich, line items, thanh tien, giam gia, hinh thuc thanh toan.
4. Neu hoa don da phat sinh doi tra / doi size, he thong hien thi link toi return summary lien quan.
5. Neu co yeu cau sau ban, user co the mo service case tu invoice context.

### 5.3 Theo doi fulfillment va giao nhan

1. User mo fulfillment detail tu order summary hoac tim bang ma van don.
2. He thong tai timeline fulfillment tu Haravan / logistics read model / SAP delivery ref.
3. He thong hien thi cac moc: xac nhan don, giu hang, dong goi, ban giao van chuyen, dang giao, giao thanh cong / giao that bai / hoan hang.
4. Neu co nhieu shipment, he thong gom theo shipment leg hoac delivery doc.
5. Neu freshness vuot threshold, he thong hien thi stale badge va cache time.
6. Neu conflict giua ecommerce shipping status va ERP delivery status, he thong hien thi conflict banner va de xuat escalation.

### 5.4 Theo doi don doi tra, doi size, hoan tien

1. User tim theo ma don, ma return, SDT, hoac hoa don POS.
2. He thong xac dinh loai `return order`: `Return`, `Exchange`, `Refund`, hoac `Warranty-linked Return`.
3. He thong hien thi `return-order header`: ma don doi tra, sales order / invoice goc, ly do, ngay tiep nhan, kenh tiep nhan, current return-order state, refund state, exchange state neu co.
4. He thong link sang `M08` de trich policy doi tra / bao hanh lien quan.
5. Neu can doi size / doi mau, he thong hien thi product target va dependency voi inventory / transfer neu co.
6. User xem next action: cho xac minh, cho nhan hang, cho phe duyet, cho hoan tien, cho chuyen kho, hoac can lien he khach.

### 5.5 Theo doi chuyen kho lien quan don hang

1. User mo transfer context khi don can cap hang tu kho / chi nhanh khac, hoac khi doi tra can chuyen ve kho / xuat lai cua hang.
2. He thong doc `sap_transfer_ref` / `logistics_read_model`.
3. He thong hien thi tu kho, den kho / cua hang, ly do chuyen, trang thai chung tu, trang thai van chuyen noi bo, ETA neu co.
4. Neu transfer lien quan doi size / bo sung fulfillment cho don mo, he thong gan lien ket voi order summary.

### 5.6 Quan ly case dich vu sau ban

1. User mo service case tu order, invoice, return, hoac customer profile.
2. He thong hien thi loai case: `Warranty`, `Complaint`, `Care Follow-up`, `Repair`, `Post-sale Check-in`.
3. He thong hien thi order / invoice lien quan, san pham lien quan, symptom / issue, owner xu ly, SLA, latest note, next action.
4. Neu case can doi tra / bao hanh, he thong cite policy tu `M08`.
5. Neu case can chuyen nguoi xu ly, he thong tao escalation sang `M11`.

## 6. Alternate Flows

### 6.1 Don co nhieu line san pham va nhieu CTKM

- Don co the gom nhieu line item khac nhau ve SKU, size, mau.
- M05 phai hien thi duoc CTKM o hai muc:
  - `order-level promotion`
  - `line-level discount / markdown / gift / bundle`
- Khong duoc chi hien thi mot tong giam gia ma khong noi ro ngu canh.

### 6.2 Don online mua - doi tra tai cua hang

- Order phat sinh tren Haravan nhung return / exchange tiep nhan tai cua hang.
- M05 phai giu duoc lien ket giua `online order` va `POS/service handling record` de CSKH khong xem nhu 2 case tach roi.

### 6.3 Ban tai cua hang nhung can chuyen kho bo sung

- POS invoice co the ban hang tai diem ban nhung can bo sung hang tu chi nhanh / kho khac.
- Transfer context phai duoc hien thi nhu mot operational tail cua giao dich, khong tach thanh case khong lien quan.

### 6.4 Service case khong co return

- Khach khieu nai / can bao hanh / follow-up sau ban nhung khong doi tra.
- He thong mo service case doc lap, van link order / invoice goc neu tim thay.

### 6.5 Khong tim thay order nhung tim thay invoice / return / service case

- He thong khong duoc tra "khong biet".
- Phai tra ve summary theo ngu canh tim thay duoc va chi ro `order linkage missing`.

## 7. Error Flows

| Error | Trigger | Expected Behavior |
|-------|---------|-------------------|
| `ORD-001` Unresolved order identity | Khong map duoc ma don / hoa don / van don sang canonical record | Tra ket qua "khong tim thay" co goi y tim bang SDT, ten khach, ma invoice, ma return |
| `ORD-002` Stale source data | Sync lag vuot freshness threshold | Hien stale badge, ghi `synced_at`, khong gia vo du lieu realtime |
| `ORD-003` Source conflict | Haravan, KiotViet, SAP khac nhau ve status / amount / fulfillment | Hien conflict banner, chi ro source nao dang khac, khong auto tu hop nhat im lang |
| `ORD-004` Restricted detail | User khong du scope xem chi tiet line item / margin / note nhay cam | Hien masked view va ly do bi gioi han |
| `ORD-005` Missing policy citation | Return / warranty case can policy nhung `M08` khong co citation hop le | Hien canh bao "policy unavailable", khong tu suy dien nghiep vu |

## 8. State Machine

### 8.1 Sales-order status

`Created -> Confirmed -> Awaiting Fulfillment -> In Fulfillment -> Ready To Ship -> Shipped -> Delivered -> Closed`

Trang thai nhanh:

- `Cancelled`
- `Needs Review`
- `On Hold`

### 8.2 Sales-order payment status

`Unpaid -> Partially Paid -> Paid -> COD Pending -> Refunded / Partially Refunded`

### 8.3 Fulfillment status

`Unallocated -> Allocated -> Packed -> Handed To Carrier -> In Transit -> Delivery Attempted -> Delivered / Delivery Failed / Returned To Sender`

### 8.4 Return-order status

`Requested -> Eligibility Review -> Approved -> Rejected -> Awaiting Item Return -> Item Received -> Inspection -> Refund Pending / Exchange Pending -> Completed / Closed`

### 8.5 Return-order refund status

`Not Applicable -> Pending Refund Approval -> Refund Pending -> Refunded -> Partial Refund -> Refund Failed`

### 8.6 Return-order exchange status

`Not Applicable -> Exchange Pending Allocation -> Exchange Awaiting Transfer -> Exchange In Fulfillment -> Exchange Delivered -> Exchange Closed`

### 8.7 Transfer status

`Requested -> Approved -> Picking -> In Transfer -> Received -> Completed / Cancelled`

### 8.8 Service case status

`New -> In Review -> Waiting Customer -> In Service -> Waiting Approval -> Resolved -> Closed / Reopened`

## 9. UX / Screen Behavior

Order and Fulfillment answer / detail phai co cac block chinh:

1. `Header`: ma don / invoice / return / transfer / case, nguon, customer, channel, cua hang, freshness, conflict badge.
2. `Current Status`: order status, fulfillment status, payment status, return status, service status tuy theo context.
3. `Financial Summary`: tong tien hang, tong giam gia, phi ship, thanh toan, refund amount neu co.
4. `Product Lines`: danh sach line item voi SKU, ten, size, mau, so luong, gia, giam gia, line status.
5. `Promotion Summary`: coupon, campaign, combo / bundle, markdown, loyalty / member benefit neu co.
6. `Fulfillment Timeline`: cac moc xu ly don va giao nhan.
7. `Returns / Transfers / Service`: block dieu huong sang nghiep vu lien quan.
8. `Policy Citation`: doi tra / bao hanh / hau mai citation tu `M08`.
9. `Next Action`: lien he khach, cho tiep nhan hang tra, cho giao lai, cho kiem tra bao hanh, tao escalation.
10. `Escalation CTA`: luon co neu case stale, conflict, pending qua SLA, hoac can xu ly thu cong.

## 10. Role / Permission Rules

| Role | Quyen xem | Quyen cap nhat / tac dong | Ghi chu |
|------|-----------|---------------------------|---------|
| `CSKH` | Order summary, line item, promotion summary, fulfillment status, return / service status | Tao escalation, them care note / follow-up qua M11 | Khong thay internal margin / cost |
| `Van hanh ban le / Store Manager` | Hoa don POS, giao dich cua cua hang minh, return / exchange tai diem ban | Tao handoff noi bo, xac nhan tiep nhan case | Theo store scope |
| `Logistics / kho / fulfillment` | Fulfillment timeline, transfer, delivery doc summary | Cap nhat thong qua he thong nguon, M05 chi read / escalate | Can xem ERP / warehouse ref |
| `Ecommerce / omnichannel` | Online order, shipment, refund online, campaign / coupon context | Dieu phoi xu ly qua he thong nguon | Can thay shipping / COD context |
| `Bao hanh / dich vu` | Service case, warranty context, linked order / invoice | Tao / tiep nhan service workflow qua M11 | Policy citation bat buoc |
| `Manager / PM` | View rong hon theo scope, unresolved conflict, SLA, stale trend | Duyet huong xu ly conflict / priority | Can audit |
| `AI Bot` | Doc summary field duoc cap phep | Duoc de xuat action / trigger escalation, khong duoc tu viet nguoc transaction | Bound by M07 |

## 10A. Route And Visibility Decision

### 10A.1 POS invoice routing rule

`POS invoice` duoc chot la `mot route song song`, khong phai `child-view bat buoc` cua `sales order`.

Ly do:

- nhieu giao dich tai cua hang co the chi ton tai o dang `invoice / POS transaction`
- van hanh cua hang va CSKH can tim truc tiep theo `ma hoa don`
- route rieng giup UI / search / permission ro hon cho giao dich tai diem ban
- neu tim thay lien ket ve `sales order` hoac `return order`, UI se hien `linked record`, nhung khong bat buoc user di qua sales-order route truoc

Quyet dinh route:

- `Sales Order`: route chinh cho don ban online hoac don ban co fulfillment context
- `POS Invoice`: route song song cho giao dich tai diem ban
- `Return Order`: route song song cho don doi tra / doi size / refund
- giua cac route phai co `linked record CTA`

### 10A.2 Visibility boundary cho manual discount, refund amount, inspection result

| Role | Manual Discount | Refund Amount | Inspection Result | Notes |
|------|-----------------|---------------|-------------------|-------|
| `CSKH` | Xem `co / khong`, tong muc giam, va pham vi line / order; khong xem nguoi tao giam gia noi bo | Xem summary refund amount da duyet / da hoan | Xem ket qua summary `dat / khong dat / can review`; khong xem note tham dinh sau | Du de tra loi khach |
| `Van hanh ban le / Store Manager` | Xem muc giam tay cua giao dich trong scope cua hang minh; khong xem margin / cost | Xem refund amount trong scope cua hang / case cua minh | Xem ket qua tham dinh va note van hanh co lien quan den xu ly tai diem ban | Phuc vu xu ly cua hang |
| `Logistics / kho / fulfillment` | Khong hien thi mac dinh | Khong hien thi mac dinh | Chi xem ket qua inspection neu no anh huong flow kho / nhap hang tra | Default la an |
| `Ecommerce / omnichannel` | Xem discount summary cua don online; khong xem internal manual discount cua POS ngoai scope | Xem refund amount cua return online / refund online | Xem summary inspection neu lien quan return online; khong xem note tham dinh noi bo chi tiet | Online-first scope |
| `Bao hanh / dich vu` | Xem discount summary khi can de xu ly tranh chap; khong uu tien hien thi tren fold dau | Xem refund amount neu case co lien quan refund / exchange | Xem full inspection result trong scope case, gom ket qua va note xu ly nghiep vu | Role sau ban co quyen sau hon |
| `Manager / PM` | Xem day du trong scope duoc cap | Xem day du | Xem day du | Co audit / governance |
| `AI Bot` | Chi xem summary flag va tong muc giam neu duoc cap phep; khong xem actor / ly do discount | Chi xem summary refund amount neu can de tra loi | Chi xem summary inspection outcome; khong xem note chi tiet / hinh anh / nhan xet noi bo | Khong lo field restricted |

## 11. Business Rules

1. MIA BOS luu `summary layer`, khong mirror full transaction payload tu Haravan / KiotViet / SAP.
2. Moi order / invoice / return / transfer / service answer bat buoc co it nhat mot `canonical source`.
3. Moi ket qua bat buoc co `source` va `synced_at`.
4. `Order summary` va `product line summary` duoc phep luu trong MIA de phuc vu CRM, AI, Sales, CSKH.
5. MIA khong duoc tu tinh lai CTKM goc trong phase 1; chi hien thi `promotion outcome` doc tu source va mapping layer.
6. CTKM phai biet ro la `order-level`, `line-level`, `voucher`, `bundle`, `member benefit`, hay `manual discount`.
7. Don nhieu line san pham phai hien thi du duoc: SKU, ten, size, mau, so luong, gia, giam gia, thanh tien.
8. Neu mot line item co line-level fulfillment khac nhau, M05 phai hien thi line status thay vi chi tong status cua don.
9. Fulfillment status va order status la hai vocabulary khac nhau, khong duoc gop lam mot.
10. Return / exchange status va service case status la hai lifecycle khac nhau, du co the lien ket.
11. Case doi tra / bao hanh / hau mai phai link citation tu `M08` khi can policy interpretation.
12. Neu source conflict, M05 phai flag conflict thay vi quietly chon mot source ma khong thong bao.
13. Neu user khong du scope, M05 phai tra masked response thay vi fail toan bo.
14. M05 phai cung cap `next action` va `handoff hint` thay vi chi hien thi raw status.
15. M05 phai feed `M06 Customer 360` bang order / service summary co the dung ngay cho care va remarketing.

## 11A. Business Transaction Split

### 11A.1 Nhom giao dich trong module

Module `M05` can tach ro 2 nhom don hang chinh:

1. `Don hang ban`:
   - online sales order tu Haravan
   - sales invoice / POS transaction tu KiotViet
   - sales-order summary co the gan fulfillment
2. `Don hang doi tra`:
   - return
   - exchange
   - refund-led return
   - warranty-linked return

`Transfer` va `Service Case` khong duoc xem la don hang ban, nhung la nghiep vu lien quan co the phat sinh tu `don hang ban` hoac `don hang doi tra`.

### 11A.2 Rule tach biet giua don hang ban va don hang doi tra

- `Don hang ban` co muc tieu chinh la ban / giao hang cho khach.
- `Don hang doi tra` co muc tieu chinh la nhan lai hang, hoan tien, doi size / doi mau, hoac xu ly case sau ban.
- `Don hang doi tra` phai luon link duoc ve `sales order` hoac `POS invoice` goc neu tim thay.
- `Don hang doi tra` co state rieng, khong duoc dung chung state cua `sales order`.
- `Return / exchange` co the keo theo `transfer` hoac `service case`, nhung van la nghiep vu trung tam cua `don hang doi tra`.

## 11B. Capability Slice Framing

### 11B.1 Capability slices trong module

| Slice | Vai tro | POC Priority | Mo ta |
|------|---------|--------------|-------|
| `S1 Sales Order Summary Query` | Tom tat don hang ban tong quan | P0 | View tong hop sales order / POS invoice, customer, amount, status, source |
| `S2 POS Invoice Summary` | Giao dich tai cua hang | P0 | Hoa don POS, line items, payment, store context |
| `S3 Fulfillment Tracking` | Theo doi xu ly va giao nhan | P0 | Timeline packed -> shipped -> delivered / failed |
| `S4 Return Order Summary` | Doi tra, doi size, refund | P0 | Return order state, eligibility, inspection, refund / exchange progress |
| `S5 Transfer Status Summary` | Chuyen kho lien quan don | P1 | Internal transfer cho order / exchange / replenishment |
| `S6 After-sales Service Case Summary` | Bao hanh, khieu nai, follow-up | P1 | Service case goc don hang sau ban |
| `S7 Conflict / Stale / Escalation Layer` | Governance va handoff | P0 | Badge, warning, escalation trigger |

### 11B.2 Khuyen nghi rollout

- `Phase 1A`: `S1 + S2 + S3 + S7`
- `Phase 1B`: `S4`
- `Phase 1C`: `S5 + S6`

Ly do:

- `Order Summary + POS + Fulfillment` giai quyet pain point hoi dap noi bo nhanh nhat
- `Return / Exchange` quan trong cho CSKH va hau mai, nhung can policy alignment hon
- `Transfer` va `Service Case` can phoi hop kho / bao hanh / van hanh nhieu hon nen cho vao doi sau trong POC

## 11C. Canonical Order Summary Structure

### 11C.1 Sales-order header summary

`crm_order_summary` nen co toi thieu:

- `mia_order_id`
- `business_transaction_type` (`sales_order`, `sales_invoice_pos`)
- `source_type` (`haravan_order`, `kiotviet_invoice`, `sap_sales_order`)
- `source_order_id`
- `customer_ref`
- `channel`
- `store_ref`
- `order_created_at`
- `sales_order_status`
- `fulfillment_status`
- `payment_status`
- `related_return_order_count`
- `related_service_case_count`
- `currency`
- `subtotal_amount`
- `discount_amount`
- `shipping_fee`
- `grand_total`
- `refunded_amount`
- `latest_source`
- `synced_at`
- `freshness_state`
- `conflict_state`
- `next_action_code`

### 11C.2 Sales-order line-item summary

`crm_order_line_summary` nen co:

- `mia_order_line_id`
- `mia_order_id`
- `sku`
- `product_name`
- `variant_name`
- `size`
- `color`
- `uom`
- `quantity`
- `unit_price`
- `line_discount_amount`
- `line_net_amount`
- `line_fulfillment_status`
- `warehouse_ref` neu co
- `returnable_flag`
- `warranty_flag`

### 11C.3 Sales-order promotion summary

`crm_order_promotion_summary` nen co:

- `mia_order_id`
- `promotion_type`
- `promotion_code`
- `promotion_name`
- `promotion_scope` (`order`, `line`, `bundle`, `member`, `manual`)
- `discount_amount`
- `gift_item_ref` neu co
- `campaign_ref`
- `source_system`

### 11C.4 Fulfillment summary

`crm_order_fulfillment_summary` nen co:

- `mia_order_id`
- `shipment_ref`
- `carrier_ref`
- `tracking_number`
- `fulfillment_status`
- `packed_at`
- `handed_to_carrier_at`
- `delivered_at`
- `delivery_attempt_count`
- `delivery_failure_reason`
- `latest_location_note`

### 11C.5 Return-order header summary

`crm_order_return_summary` nen co:

- `mia_return_order_id`
- `business_transaction_type` (`return_order`)
- `source_case_id`
- `related_mia_order_id`
- `related_invoice_id`
- `return_order_type` (`return`, `exchange`, `refund`, `warranty_return`)
- `return_channel` (`store`, `ecommerce`, `call_center`, `manual`)
- `return_reason`
- `return_requested_at`
- `return_order_status`
- `refund_status`
- `exchange_status`
- `refund_amount`
- `exchange_target_summary`
- `item_receive_status`
- `inspection_result`
- `owner_team`
- `policy_citation_ref`
- `sla_due_at`
- `last_updated_at`
- `next_action_code`
- `source`
- `synced_at`
- `freshness_state`

### 11C.6 Return-order line-item summary

`crm_return_order_line_summary` nen co:

- `mia_return_order_line_id`
- `mia_return_order_id`
- `related_mia_order_line_id`
- `sku`
- `product_name`
- `variant_name`
- `size`
- `color`
- `requested_quantity`
- `approved_quantity`
- `received_quantity`
- `refund_amount`
- `exchange_target_sku` neu co
- `return_resolution` (`refund`, `exchange`, `repair_review`, `reject`)

### 11C.7 Transfer / service summary

`crm_transfer_summary`, `crm_service_case_summary` nen co:

- `related_mia_order_id`
- `related_mia_return_order_id` neu co
- `source_case_id`
- `case_type`
- `case_reason`
- `current_status`
- `owner_team`
- `opened_at`
- `last_updated_at`
- `policy_citation_ref`
- `sla_due_at`
- `next_action_code`

## 11C. Source Ownership And Priority Rules

### 11C.1 Source ownership theo nghiep vu

| Nghiep vu | Source uu tien 1 | Source uu tien 2 | Source bo tro | Ghi chu |
|----------|------------------|------------------|---------------|---------|
| Don online | Haravan | SAP B1 | MIA summary | Haravan la operational source cho ecommerce order |
| Hoa don POS | KiotViet | SAP B1 | MIA summary | KiotViet la source chinh cho tai diem ban |
| Fulfillment ecommerce | Haravan / logistics | SAP delivery ref | MIA summary | Can chot rule cuoi cung theo shipping integration |
| Return online | Haravan | SAP return ref | MIA summary | Policy tu M08 |
| Return tai cua hang | KiotViet | SAP return ref | MIA summary | Store-owned handling |
| Transfer kho | SAP B1 | logistics read model | MIA summary | ERP / warehouse source |
| Service case hau mai | MIA service summary / M11 | Order / invoice source | M08 policy | MIA co the la master cua summary layer |

### 11C.2 Rule chon nguon khi conflict

1. Neu user xem `online order`, uu tien status operational tu Haravan, nhung phai hien ERP ref neu co.
2. Neu user xem `POS invoice`, uu tien KiotViet.
3. Neu user xem `transfer`, uu tien SAP B1.
4. Neu user xem `service case`, uu tien MIA service summary + policy citation.
5. Neu conflict giua hai source chua co rule chot, M05 bat buoc hien `conflict_state = true`.

## 12. API Contract Excerpt + Canonical Links

### 12.1 Order query

`POST /mia/orders/query`

Input:

- `order_id`
- `invoice_id`
- `tracking_number`
- `customer_phone`
- `customer_name`
- `channel`
- `store_ref`
- `date_range`
- `include_lines`
- `include_promotions`

Output toi thieu:

- `mia_order_id`
- `source_type`
- `source_order_id`
- `order_status`
- `fulfillment_status`
- `payment_status`
- `return_status`
- `service_status`
- `customer`
- `store`
- `amount_summary`
- `promotion_summary[]`
- `line_items[]`
- `next_actions[]`
- `source`
- `synced_at`
- `freshness_state`
- `conflict_state`

### 12.2 Fulfillment query

`POST /mia/fulfillment/query`

Output:

- `mia_order_id`
- `shipment_ref`
- `tracking_number`
- `carrier`
- `fulfillment_timeline[]`
- `delivery_result`
- `source`
- `synced_at`

### 12.3 Return / exchange query

`POST /mia/returns/query`

Output:

- `return_case_id`
- `related_mia_order_id`
- `case_type`
- `reason`
- `current_status`
- `refund_amount`
- `exchange_target`
- `policy_link`
- `owner_team`
- `next_actions[]`

### 12.4 Transfer query

`POST /mia/transfers/query`

Output:

- `transfer_id`
- `related_mia_order_id`
- `from_location`
- `to_location`
- `transfer_status`
- `eta`
- `source`
- `synced_at`

### 12.5 Service case query

`POST /mia/service-cases/query`

Output:

- `service_case_id`
- `related_mia_order_id`
- `related_invoice_id`
- `case_type`
- `service_status`
- `sla_due_at`
- `owner_team`
- `policy_link`
- `latest_note_summary`
- `next_actions[]`

### 12.6 Canonical links

- Reads `I02` (SAP B1 Connector)
- Reads `I03` (Haravan Connector)
- Reads `I04` (KiotViet Connector)
- Reads `I05` (Canonical Mapping and Source of Truth)
- Reads `F-M03-PRC-001` cho amount interpretation context
- Reads `F-M04-PRO-001` cho promotion interpretation context
- Reads `F-M06-CRM-001` de resolve customer / order relationship
- Reads `F-M07-SEC-001` cho scope / masking
- Reads `F-M08-KNW-001` cho policy citation
- Feeds `F-M06-CRM-001` order history / service history
- Feeds `F-M09-AIC-001` va `F-M10-SLS-001` answer context
- Feeds `F-M11-ESC-001` khi can escalation

## 13. Event / Webhook Contract Excerpt + Canonical Links

- `order.summary.updated`: cap nhat khi summary header cua don thay doi
- `order.line.summary.updated`: cap nhat khi line item thay doi
- `order.fulfillment.updated`: cap nhat khi timeline giao nhan thay doi
- `order.return.updated`: cap nhat khi return / exchange / refund thay doi
- `order.transfer.updated`: cap nhat khi transfer status thay doi
- `service.case.updated`: cap nhat khi service / warranty / complaint case thay doi

## 14. Data / DB Impact Excerpt + Canonical Links

- `crm_order_summary`: lop tong hop cho order / invoice / operational state
- `crm_order_line_summary`: chi tiet line item cho AI / Sales / CSKH
- `crm_order_promotion_summary`: lop tong hop CTKM da ap dung
- `crm_order_fulfillment_summary`: timeline giao nhan
- `crm_order_return_summary`: doi tra / refund / exchange summary
- `crm_transfer_summary`: transfer kho lien quan don
- `crm_service_case_summary`: hau mai / bao hanh / complaint summary
- `har_order_read_model`, `har_order_line_read_model`, `har_fulfillment_read_model`, `har_refund_read_model`: online order source
- `kv_order_read_model`, `kv_sales_invoice_read_model`, `kv_order_line_read_model`, `kv_return_read_model`: POS source
- `sap_sales_order_ref`, `sap_delivery_ref`, `sap_return_ref`, `sap_transfer_ref`, `logistics_read_model`: ERP / logistics source

## 15. Validation Rules

1. Moi ket qua phai co `source` va `synced_at`.
2. Khong duoc render line item detail neu user khong co scope xem chi tiet nghiep vu nhay cam.
3. `sales order` response phai co `sales_order_status`; `return order` response phai co `return_order_status`. Khong duoc dung mot field status chung cho ca hai.
4. `promotion_summary` phai bao gom it nhat mot `promotion_scope` va `discount_amount` neu co giam gia.
5. Neu sales order co nhieu line item, response khong duoc chi tra tong tien ma bo qua line summary.
6. Neu return order co nhieu line item bi doi tra, response phai chi ro `requested_quantity`, `approved_quantity`, va huong xu ly cua tung line.
7. Neu return / warranty can policy ma khong co citation, system phai canh bao ro.
8. Neu conflict state = true, response phai liet ke conflict dimensions toi thieu: `status`, `amount`, hoac `fulfillment`.
9. Neu stale state = true, response phai co `freshness_reason` hoac `last_successful_sync_at`.

## 16. Error Codes

- `ORD-001`: Unresolved order identity
- `ORD-002`: Source stale beyond freshness threshold
- `ORD-003`: Status / amount / fulfillment conflict across sources
- `ORD-004`: Restricted detail by scope
- `ORD-005`: Missing policy citation for policy-bound scenario

## 17. Non-Functional Requirements

- `POST /mia/orders/query` phai tra ket qua trong `<= 3 giay` cho `95%` truy van phase 1.
- `GET /mia/orders/{order_id}` voi `include_lines=true` phai tra ket qua trong `<= 4 giay` cho `95%` request.
- `crm_order_summary` phai refresh toi thieu moi `15 phut` cho don dang `In Fulfillment`, `Awaiting Fulfillment`, `Return Pending`, hoac `In Service`.
- `crm_order_fulfillment_summary` phai refresh toi thieu moi `10 phut` cho shipment dang `In Transit`.
- He thong ho tro toi thieu `100` concurrent order-related queries trong pilot phase 1.
- `order / fulfillment / return / service` summary phai luu audit log cho moi lan sync conflict / stale / escalation trigger.
- Ty le unresolved order query sau mapping phase 1 phai nho hon `8%` tren tong truy van hop le noi bo.

## 18. Acceptance Criteria

1. CSKH tra cuu `sales order` theo SDT hoac ma don va nhan duoc summary day du: ma don, nguon, customer, line items, CTKM, `sales_order_status`, `fulfillment_status`, last update.
2. User xem `POS invoice` va thay duoc cua hang, line san pham, hinh thuc thanh toan, va lien ket doi tra / service case neu co.
3. User xem `fulfillment timeline` va thay ro cac moc packed, handed to carrier, in transit, delivered / failed cung freshness badge.
4. User tra cuu `return order` va thay duoc sales order / invoice goc, `return_order_status`, `refund_status`, `exchange_status`, ly do, item lines bi doi tra, policy citation, va next action.
5. Transfer case lien quan don hang hien thi duoc tu kho, den kho, status, va lien ket voi sales order / return order context.
6. Service case sau ban hien thi duoc loai case, san pham lien quan, SLA, owner team, latest note summary, va escalation CTA neu qua han.
7. Neu source conflict hoac stale, he thong khong duoc tra du lieu nhu da xac thuc hoan toan ma phai hien canh bao ro.

## 19. Test Scenarios

- Tra cuu don online co 2 line item, 1 voucher order-level, 1 markdown line-level
- Tra cuu hoa don POS tai cua hang co doi size sau mua
- Theo doi shipment ecommerce da ban giao van chuyen nhung SAP chua cap delivery ref
- Return online du dieu kien theo policy va dang cho nhan hang tra ve
- Return tai cua hang bi reject do ngoai policy
- Transfer kho bo sung hang cho exchange case
- Service case bao hanh co linked order nhung khong co return
- Stale fulfillment status do Haravan sync lag
- Conflict amount giua Haravan va SAP
- Restricted detail voi user khong du scope

## 20. Observability

Theo doi:

- top unresolved order queries
- stale source rate theo tung he thong
- conflict rate theo `status / amount / fulfillment`
- return / service case qua SLA
- most common escalation reasons lien quan order / fulfillment / return
- query volume theo role: CSKH / Store / Logistics / AI

## 21. Rollout / Feature Flag

- `Phase 1A`: internal operations, CSKH, ecommerce
- `Phase 1B`: store manager / retail operations / logistics
- `Phase 1C`: bao hanh / dich vu sau ban

Feature flag goi y:

- `order_summary_phase1`
- `pos_invoice_summary_phase1`
- `fulfillment_tracking_phase1`
- `returns_summary_phase1b`
- `transfer_summary_phase1c`
- `service_case_summary_phase1c`

## 22. Open Questions

1. Khi online order va SAP delivery ref conflict, source nao duoc xem la operational truth trong tung phase?
2. Warranty / complaint case se master o MIA hay chi la summary read tu mot system khac?
3. Transfer kho lien quan doi size co can route qua workflow phe duyet rieng hay chi read-only trong phase 1?

## 23. Definition of Done

Module `Order and Fulfillment` duoc xem la done cho phase 1 khi:

- tra cuu duoc order / POS / fulfillment summary o muc van hanh du dung
- hien thi du line item va promotion outcome de user hieu giao dich dang noi ve cai gi
- co du return / transfer / service summary cho cac case lien quan sau ban
- co badge freshness / conflict / restriction ro rang
- co payload handoff du cho `M06` va `M11`

## 24. Ready-for-UXUI Checklist

- [ ] UXUI da chot answer pattern cho `Order Summary`, `POS Invoice`, `Fulfillment Timeline`, `Return / Exchange`, `Service Case`
- [ ] Da chot visual treatment cho `stale`, `conflict`, `restricted`, `policy citation`
- [ ] Da chot card / drawer / timeline pattern cho line item + CTKM

## 25. Ready-for-FE-Preview Checklist

- [ ] FE Preview co mock du cho `online order`, `POS invoice`, `return case`, `service case`, `stale/conflict`
- [ ] Mock data co line-item variant: size, mau, CTKM order-level, CTKM line-level

## 26. Ready-for-BE / Integration Promotion Checklist

- [ ] Da chot canonical key map giua order / invoice / return / transfer / service case
- [ ] Da chot source-priority rule cho order / fulfillment / return / transfer
- [ ] Da chot payload toi thieu cho `promotion outcome summary`
