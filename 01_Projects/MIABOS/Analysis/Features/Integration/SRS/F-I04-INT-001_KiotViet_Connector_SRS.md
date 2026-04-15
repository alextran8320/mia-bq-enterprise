# Feature SRS: F-I04-INT-001 KiotViet Connector

**Status**: Draft
**Owner**: A03 BA Agent
**Last Updated By**: Codex CLI (GPT-5 Codex)
**Last Reviewed By**: A01 PM Agent
**Approval Required**: PM
**Approved By**: -
**Last Status Change**: 2026-04-15
**Source of Truth**: This document
**Blocking Reason**: Cần materialize connector contract từ source spec KiotViet và chốt pagination / quota strategy
**Module**: Integration
**Phase**: PB-02 / PB-03
**Priority**: High
**Document Role**: SRS high-level cho connector KiotViet của MIABOS

---

## 0. Metadata

- Feature ID: `F-I04-INT-001`
- Related User Story: `US-I04-INT-001`
- Related Screens:
  - Màn hình cấu hình KiotViet connector
  - Màn hình sync status cho retail domains
- Related APIs:
  - `GET /kiotviet/branches`
  - `GET /kiotviet/products`
  - `GET /kiotviet/inventory`
  - `GET /kiotviet/invoices`
  - `GET /kiotviet/orders`
  - `GET /kiotviet/returns`
  - `GET /kiotviet/transfers`
  - `GET /kiotviet/customers`
  - `GET /kiotviet/promotions`
- Related Tables:
  - `kiotviet_connector_config`
  - `kiotviet_sync_cursor`
- Related Events:
  - `kiotviet.product.synced`
  - `kiotviet.inventory.synced`
  - `kiotviet.sales.synced`
- Related Error IDs:
  - `KV-CON-001`
  - `KV-CON-002`

## 1. User Story

Là Integration Admin, tôi muốn MIABOS có connector KiotViet riêng để đưa dữ liệu retail / POS / branch operations vào business modules của MIA theo contract chuẩn.

## 1A. User Task Flow

| Step | User Role | Action | Task Type | Notes |
|------|-----------|--------|-----------|-------|
| 1 | Integration Admin | Cấu hình credential và policy sync KiotViet | Configuration | Setup |
| 2 | Integration Admin | Theo dõi sync branch, product, inventory, invoice, order, return | Reporting | Vận hành |
| 3 | Technical Operator | Retry domain hoặc xử lý pagination / quota issue | Exception Handling | Recovery |

## 2. Business Context

KiotViet là nguồn dữ liệu retail / POS / store operations cho chi nhánh, sản phẩm, tồn theo chi nhánh, hóa đơn POS, order, return, transfer, customer, và promotion.

## 3. Preconditions

- KiotViet API contract đã được cấp.
- Branch code và barcode strategy có thể mapping được.

## 4. Postconditions

- Dữ liệu retail từ KiotViet được feed vào MIABOS theo domain chuẩn.

## 5. Main Flow

1. Orchestrator gọi KiotViet connector theo domain.
2. Connector đọc dữ liệu theo pagination / cursor phù hợp.
3. Dữ liệu được normalize cơ bản.
4. Event `kiotviet.*.synced` được phát ra downstream.

## 6. Alternate Flows

- Inventory/invoice sync chạy tần suất cao hơn branch/product.

## 7. Error Flows

- Pagination mismatch -> dừng domain sync và mark `Needs Review`.
- Quota exceeded -> backoff và retry.

## 8. State Machine

`Ready -> Syncing -> Synced / Failed / Needs Review`

## 9. UX / Screen Behavior

- Cần thấy rõ domain nào của KiotViet stale theo chi nhánh hoặc toàn hệ.

## 10. Role / Permission Rules

- Chỉ admin kỹ thuật được chỉnh sync policy và credential.

## 11. Business Rules

- Không cho AI gọi trực tiếp KiotViet API.
- Branch master phải đi qua mapping layer trước khi được dùng downstream.

## 12. API Contract Excerpt + Canonical Links

- Phụ thuộc trực tiếp vào source spec [F-KV-INT-001](../Source_Specs/F-KV-INT-001_KV_Internal_Chatbot_Integration_SRS.md)

## 13. Event / Webhook Contract Excerpt + Canonical Links

- Phát `kiotviet.*.synced` cho downstream modules.

## 14. Data / DB Impact Excerpt + Canonical Links

- Lưu connector config và cursor riêng cho KiotViet.

## 15. Validation Rules

- Branch / barcode / SKU mapping phải qua validation tối thiểu.

## 16. Error Codes

- `KV-CON-001`: KiotViet quota / timeout
- `KV-CON-002`: Không map được paging / cursor state

## 17. Non-Functional Requirements

- Hỗ trợ pagination bền vững và retry có kiểm soát.

## 18. Acceptance Criteria

- KiotViet connector sync được các domain đã chốt trong source spec.

## 19. Test Scenarios

- Sync branches
- Sync inventory
- Sync invoices
- Retry sau quota error

## 20. Observability

- Theo dõi success/fail theo từng domain KiotViet.

## 21. Rollout / Feature Flag

- Bật cùng phase retail pilot.

## 22. Open Questions

- KiotViet có webhook usable hay chỉ poll theo lịch?

## 23. Definition of Done

- Có connector contract rõ cho KiotViet và trace sang source spec.

## 24. Ready-for-UXUI Checklist

- [ ] Status view cho retail domains đã đủ rõ

## 25. Ready-for-FE-Preview Checklist

- [ ] Mock connector status đã xác định

## 26. Ready-for-BE / Integration Promotion Checklist

- [ ] Đã chốt pagination / quota policy
