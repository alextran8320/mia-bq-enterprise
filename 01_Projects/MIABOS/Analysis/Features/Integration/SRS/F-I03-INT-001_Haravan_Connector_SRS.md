# Feature SRS: F-I03-INT-001 Haravan Connector

**Status**: Draft
**Owner**: A03 BA Agent
**Last Updated By**: Codex CLI (GPT-5 Codex)
**Last Reviewed By**: A01 PM Agent
**Approval Required**: PM
**Approved By**: -
**Last Status Change**: 2026-04-15
**Source of Truth**: This document
**Blocking Reason**: Cần materialize connector contract từ source spec Haravan và chốt polling vs webhook mix
**Module**: Integration
**Phase**: PB-02 / PB-03
**Priority**: High
**Document Role**: SRS high-level cho connector Haravan của MIABOS

---

## 0. Metadata

- Feature ID: `F-I03-INT-001`
- Related User Story: `US-I03-INT-001`
- Related Screens:
  - Màn hình cấu hình Haravan connector
  - Màn hình sync status cho ecommerce domains
- Related APIs:
  - `GET /haravan/catalog`
  - `GET /haravan/inventory`
  - `GET /haravan/orders`
  - `GET /haravan/fulfillment`
  - `GET /haravan/customers`
  - `GET /haravan/promotions`
  - `GET /haravan/channels`
- Related Tables:
  - `haravan_connector_config`
  - `haravan_sync_cursor`
- Related Events:
  - `haravan.catalog.synced`
  - `haravan.inventory.synced`
  - `haravan.order.synced`
- Related Error IDs:
  - `HAR-CON-001`
  - `HAR-CON-002`

## 1. User Story

Là Integration Admin, tôi muốn MIABOS có connector Haravan riêng để lấy dữ liệu online commerce theo cơ chế chuẩn và feed các business modules của MIABOS.

## 1A. User Task Flow

| Step | User Role | Action | Task Type | Notes |
|------|-----------|--------|-----------|-------|
| 1 | Integration Admin | Cấu hình app/API access của Haravan | Configuration | Setup |
| 2 | Integration Admin | Theo dõi sync theo domain catalog, order, fulfillment, customer | Reporting | Vận hành |
| 3 | Technical Operator | Retry domain bị fail | Exception Handling | Recovery |

## 2. Business Context

Haravan là nguồn online commerce cho product online, inventory online, đơn online, fulfillment, customer online, promotion, và channel context.

## 3. Preconditions

- Haravan API credentials đã được cấp.
- Channel / source metadata có thể truy xuất được.

## 4. Postconditions

- Dữ liệu online commerce được đưa vào MIABOS theo domain chuẩn hóa.

## 5. Main Flow

1. Orchestrator gọi Haravan connector.
2. Connector đọc domain data từ Haravan.
3. Connector chuẩn hóa payload cơ bản.
4. Event `haravan.*.synced` được phát cho downstream.

## 6. Alternate Flows

- Catalog sync chạy theo lịch dài hơn inventory/order sync.

## 7. Error Flows

- Rate limit -> backoff và retry.
- Payload thiếu channel/source -> mark `Needs Review`.

## 8. State Machine

`Ready -> Syncing -> Synced / Failed / Needs Review`

## 9. UX / Screen Behavior

- Phải tách được domain stale như inventory khác với order.

## 10. Role / Permission Rules

- Chỉ admin kỹ thuật được chỉnh app access hoặc sync policy.

## 11. Business Rules

- Không cho chatbot gọi trực tiếp Haravan API.
- Chỉ sync những domain phục vụ use case đã chốt.

## 12. API Contract Excerpt + Canonical Links

- Phụ thuộc trực tiếp vào source spec [F-HAR-INT-001](../Source_Specs/F-HAR-INT-001_HAR_Internal_Chatbot_Integration_SRS.md)

## 13. Event / Webhook Contract Excerpt + Canonical Links

- Phát `haravan.*.synced` cho downstream modules.

## 14. Data / DB Impact Excerpt + Canonical Links

- Lưu connector config và cursor riêng cho Haravan.

## 15. Validation Rules

- Domain sync phải có cursor / watermark rõ ràng.

## 16. Error Codes

- `HAR-CON-001`: Haravan timeout / rate limit
- `HAR-CON-002`: Payload thiếu field bắt buộc

## 17. Non-Functional Requirements

- Hỗ trợ backoff khi bị quota / rate limit.

## 18. Acceptance Criteria

- Haravan connector sync được các domain đã chốt trong source spec.

## 19. Test Scenarios

- Sync catalog
- Sync inventory
- Sync order
- Retry sau rate limit

## 20. Observability

- Theo dõi success/fail theo từng domain Haravan.

## 21. Rollout / Feature Flag

- Mở sau SAP hoặc song song nếu online commerce là priority pilot.

## 22. Open Questions

- Haravan có webhook đủ tốt cho order/fulfillment hay vẫn cần polling hybrid?

## 23. Definition of Done

- Có connector contract rõ cho Haravan và trace sang source spec.

## 24. Ready-for-UXUI Checklist

- [ ] Status view cho các domain online đã đủ rõ

## 25. Ready-for-FE-Preview Checklist

- [ ] Mock connector status đã xác định

## 26. Ready-for-BE / Integration Promotion Checklist

- [ ] Đã chốt rate-limit handling strategy
