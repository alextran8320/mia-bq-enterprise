# Feature SRS: F-M05-ORD-001 Order and Fulfillment

**Status**: Draft
**Owner**: A03 BA Agent
**Last Updated By**: Claude Code (claude-sonnet-4-6)
**Last Reviewed By**: A01 PM Agent
**Approval Required**: PM
**Approved By**: -
**Last Status Change**: 2026-04-15
**Source of Truth**: This document
**Blocking Reason**: Cần chốt order summary boundary, online/POS split, và fulfillment status vocabulary
**Module**: M05
**Phase**: PB-02 / PB-03
**Priority**: High
**Document Role**: SRS high-level cho module Order and Fulfillment của MIABOS

---

## 0. Metadata

- Feature ID: `F-M05-ORD-001`
- Related User Story: `US-M05-ORD-001`
- Related Screens: order summary answer, fulfillment status detail, escalation CTA
- Related APIs: `POST /mia/orders/query`, `POST /mia/fulfillment/query`
- Related Tables: `crm_order_summary`, `har_order_read_model`, `har_fulfillment_read_model`, `kv_order_read_model`, `kv_sales_invoice_read_model`, `kv_return_read_model`, `kv_transfer_read_model`, `logistics_read_model`
- Related Events: `order.summary.updated`, `fulfillment.status.updated`
- Related Error IDs: `ORD-001`

## 0B. Integration Source Map

| Data Domain | Source System | Direction | Notes |
|---|---|---|---|
| Đơn hàng online, trạng thái vận đơn, fulfillment | Haravan | Read | Nguồn chính cho đơn online và giao hàng |
| Hóa đơn POS, đơn bán tại cửa hàng, trả hàng POS | KiotViet | Read | Nguồn cho giao dịch tại điểm bán |
| Phiếu xuất kho, transfer, chứng từ ERP | SAP B1 | Read | Nguồn cho fulfillment level ERP, logistics nội bộ |
| Chính sách đổi trả, bảo hành, điều kiện hoàn tiền | MIABOS Knowledge Center (M08) | Read | Policy layer — không merge vào order record |
| CRM order summary | MIABOS internal DB | Write | Summary đã map, phục vụ M09/M10/M11 |

## 1. User Story

Là Sales, Operations, Store Manager, hoặc CSKH, tôi muốn hỏi được trạng thái đơn hàng / vận đơn / fulfillment / return / transfer ở mức đủ dùng cho vận hành và chăm sóc khách hàng.

## 1A. User Task Flow

| Step | User Role | Action | Task Type | Notes |
|------|-----------|--------|-----------|-------|
| 1 | User | Hỏi tình trạng đơn / hóa đơn / vận đơn / trả hàng | Quick Action | Entry |
| 2 | Hệ thống | Resolve order identity qua canonical mapping | Quick Action | Mapping |
| 3 | User | Xem order summary và action tiếp theo | Reporting | Trust |

## 2. Business Context

BQ có hơn 200 cửa hàng/đại lý với đơn hàng đến từ nhiều kênh: đơn online qua Haravan, hóa đơn POS qua KiotViet, và chứng từ ERP qua SAP B1. CSKH thường phải hỏi "đơn của khách X đang ở đâu", "trả hàng có được không", "đã giao chưa" — nhưng phải mở nhiều hệ thống mới có câu trả lời. Nếu AI không có lớp order summary thống nhất, mỗi câu hỏi của CSKH vẫn cần người xử lý thủ công.

## 3. Preconditions

- `M06` đã có customer profile để resolve customer identity.
- Order ID mapping giữa Haravan, KiotViet, SAP B1 đã có tối thiểu cho phase 1.
- Chính sách đổi trả/bảo hành đã được publish trong `M08` để link vào order answer.

## 4. Postconditions

- User nhận được order summary đủ để xử lý vận hành, không cần mở hệ thống nguồn.
- Các trường hợp cần xử lý sâu hơn có lối ra rõ qua escalation (`M11`).

## 5. Main Flow

1. User hỏi về đơn hàng theo mã đơn, tên khách, hoặc SĐT.
2. Hệ thống resolve order identity: map qua `crm_order_summary` hoặc từng read model.
3. Hệ thống xác định loại đơn: online (Haravan), POS (KiotViet), transfer/ERP (SAP B1).
4. Hệ thống pull summary từ read model tương ứng: status, fulfillment, payment, return state.
5. Nếu đơn liên quan policy đổi trả/bảo hành, link sang `M08` để lấy policy citation.
6. Render answer card với `order ID`, `trạng thái`, `last update`, `source`, `next action`.
7. User xem thêm hoặc tạo escalation nếu cần xử lý.

## 6. Alternate Flows

- Tra cứu hóa đơn POS tại cửa hàng theo mã hóa đơn KiotViet.
- Tra trạng thái trả hàng / hoàn tiền từ Haravan.
- Tra chứng từ xuất/nhập kho từ SAP B1 cho Logistics.

## 7. Error Flows

- Order ID không map được sang canonical identity → trả "không tìm thấy" + gợi ý tìm theo SĐT hoặc tên khách.
- Fulfillment status stale (Haravan sync lag) → hiển thị stale badge + thời điểm cache cuối.
- Conflict status giữa Haravan và SAP B1 → warning "trạng thái chưa đồng nhất giữa các nguồn".

## 8. State Machine

`Pending -> Confirmed -> In Fulfillment -> Shipped -> Completed / Returned / Cancelled / Needs Review`

## 9. UX / Screen Behavior

- Answer card: `mã đơn`, `trạng thái hiện tại`, `loại đơn (online/POS/ERP)`, `nguồn`, `last update`, `next action`.
- Link policy đổi trả/bảo hành nếu trạng thái là `Returned` hoặc `Needs Review`.
- Escalation CTA luôn hiển thị nếu status phức tạp cần người xử lý.

## 10. Role / Permission Rules

- `CSKH (Chăm sóc khách hàng)`: tra cứu đơn theo SĐT/tên khách, xem summary và policy link — không thấy internal cost.
- `Vận hành bán lẻ / Store Manager`: tra đơn tại cửa hàng của mình và hóa đơn POS.
- `Logistics / kho / fulfillment`: tra trạng thái giao hàng, xuất kho, transfer từ SAP B1.
- `Ecommerce / omnichannel`: tra đơn online và trạng thái fulfillment Haravan.
- Field nhạy cảm (giá nhập, margin, internal notes) mask theo `M07`.

## 11. Business Rules

- MIABOS lưu `order summary` — không mirror full transaction payload từ nguồn.
- Mọi order answer phải resolve được về ít nhất 1 canonical source; không được trả "không biết" mà không có lý do rõ.
- Order status phải phản ánh source mới nhất có freshness rõ ràng — không được hiển thị status cũ mà không có stale badge.
- CSKH chỉ được xem đơn của khách trong scope được cấp — không xem toàn bộ order database.
- Policy đổi trả/bảo hành phải được link từ `M08` khi relevant — không tự suy đoán policy.

## 12. API Contract Excerpt + Canonical Links

- `POST /mia/orders/query`: query theo `order_id`, `customer_phone`, `customer_name`, `date_range`
  - Output: `order_id`, `order_type`, `status`, `fulfillment_state`, `payment_state`, `source`, `synced_at`, `next_actions[]`, `policy_link`
- `POST /mia/fulfillment/query`: query fulfillment detail theo order
- Canonical links:
  - Reads `I03` (Haravan orders/fulfillment), `I04` (KiotViet invoices/returns), `I02` (SAP B1 transfers)
  - Reads `F-M06-CRM-001` để resolve customer identity
  - Reads `F-M08-KNW-001` cho policy đổi trả/bảo hành
  - Uses `F-M07-SEC-001` scope
  - Feeds `F-M11-ESC-001` khi cần escalation

## 13. Event / Webhook Contract Excerpt + Canonical Links

- `order.summary.updated`: phát khi order summary được sync cập nhật.
- `fulfillment.status.updated`: phát khi trạng thái giao hàng thay đổi.

## 14. Data / DB Impact Excerpt + Canonical Links

- `crm_order_summary`: canonical order summary đã map từ Haravan + KiotViet + SAP B1
- `har_order_read_model`, `har_fulfillment_read_model`: Haravan online order/fulfillment
- `kv_order_read_model`, `kv_sales_invoice_read_model`, `kv_return_read_model`: KiotViet POS
- `logistics_read_model`: SAP B1 transfer/logistics data

## 15. Validation Rules

- Mọi order answer phải có `source` và `synced_at`.
- Không được render order detail nếu customer identity không được xác nhận trong scope của người hỏi.
- Status conflict phải được detect và flag — không tự resolve.

## 16. Error Codes

- `ORD-001`: Unresolved order identity — không map được sang canonical source.
- `ORD-002`: Order status stale vượt freshness threshold.
- `ORD-003`: Status conflict giữa Haravan và SAP B1.

## 17. Non-Functional Requirements

- `POST /mia/orders/query` phải trả kết quả trong `<= 3 giây` cho `95%` queries phase 1.
- `crm_order_summary` phải được refresh tối thiểu mỗi `30 phút` cho đơn đang `In Fulfillment`.
- Hỗ trợ tối thiểu `80` concurrent order queries trong pilot phase 1.

## 18. Acceptance Criteria

- CSKH tra cứu đơn theo SĐT và nhận summary đủ: mã đơn, trạng thái, loại, nguồn, last update.
- Đơn có trạng thái `Returned` tự động link sang policy đổi trả từ `M08`.
- User không có scope bị block khỏi order detail và nhận thông báo rõ lý do.
- Status stale hiển thị badge và thời điểm cache cuối, không pass như dữ liệu mới.

## 19. Test Scenarios

Online order, POS invoice, return, stale fulfillment.

## 20. Observability

Theo dõi top unresolved order queries.

## 21. Rollout / Feature Flag

Internal operations và CSKH trước.

## 22. Open Questions

Source chuẩn cho order summary theo từng case là gì?

## 23. Definition of Done

Order/fulfillment summary dùng được cho phase 1.

## 24. Ready-for-UXUI Checklist

- [ ] UXUI đã chốt order status answer pattern

## 25. Ready-for-FE-Preview Checklist

- [ ] FE Preview có mock online/POS/return variants

## 26. Ready-for-BE / Integration Promotion Checklist

- [ ] BE contract order identity mapping đã rõ
