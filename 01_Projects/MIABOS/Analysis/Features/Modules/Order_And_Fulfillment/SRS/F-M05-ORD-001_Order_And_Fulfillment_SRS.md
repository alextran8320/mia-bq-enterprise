# Feature SRS: F-M05-ORD-001 Order and Fulfillment

**Status**: Draft
**Owner**: A03 BA Agent
**Last Updated By**: Codex CLI (GPT-5 Codex)
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

## 1. User Story

Là Sales, Operations, Store Manager, hoặc CSKH, tôi muốn hỏi được trạng thái đơn hàng / vận đơn / fulfillment / return / transfer ở mức đủ dùng cho vận hành và chăm sóc khách hàng.

## 1A. User Task Flow

| Step | User Role | Action | Task Type | Notes |
|------|-----------|--------|-----------|-------|
| 1 | User | Hỏi tình trạng đơn / hóa đơn / vận đơn / trả hàng | Quick Action | Entry |
| 2 | Hệ thống | Resolve order identity qua canonical mapping | Quick Action | Mapping |
| 3 | User | Xem order summary và action tiếp theo | Reporting | Trust |

## 2. Business Context

Order/fulfillment là domain hỏi đáp có giá trị cao cho CSKH và operations.

## 3. Preconditions

- Order IDs giữa các nguồn đã được mapping ở mức phase 1.

## 4. Postconditions

- Trả được summary thay vì full raw transaction.

## 5. Main Flow

Resolve order -> pull summary -> compose answer -> optionally escalate.

## 6. Alternate Flows

POS invoice, online order, return, transfer.

## 7. Error Flows

Không map được order, fulfillment stale, hoặc status conflict.

## 8. State Machine

`Draft -> Pending -> In Progress -> Completed / Returned / Cancelled / Needs Review`

## 9. UX / Screen Behavior

Phải hiển thị nguồn, status, last update, và next action.

## 10. Role / Permission Rules

Chỉ role phù hợp mới xem customer/order details sâu.

## 11. Business Rules

MIABOS lưu summary chứ không mirror full payload.

## 12. API Contract Excerpt + Canonical Links

Phụ thuộc `I02/I03/I04/I05` và feed `M09/M11`.

## 13. Event / Webhook Contract Excerpt + Canonical Links

Phát `order.summary.updated` và `fulfillment.status.updated`.

## 14. Data / DB Impact Excerpt + Canonical Links

Đọc order/fulfillment summaries từ các read models tương ứng.

## 15. Validation Rules

Mọi answer phải resolve được order identity hoặc warning.

## 16. Error Codes

`ORD-001`: Unresolved order identity.

## 17. Non-Functional Requirements

Trả lời nhanh và dễ escalate.

## 18. Acceptance Criteria

Tra cứu được online/POS/return/transfer summary theo scope.

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
