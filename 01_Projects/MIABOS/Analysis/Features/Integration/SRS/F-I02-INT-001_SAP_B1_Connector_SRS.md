# Feature SRS: F-I02-INT-001 SAP B1 Connector

**Status**: Draft
**Owner**: A03 BA Agent
**Last Updated By**: Codex CLI (GPT-5 Codex)
**Last Reviewed By**: A01 PM Agent
**Approval Required**: PM
**Approved By**: -
**Last Status Change**: 2026-04-15
**Source of Truth**: This document
**Blocking Reason**: Cần materialize connector contract từ source spec SAP và chốt middleware / service-layer strategy
**Module**: Integration
**Phase**: PB-02 / PB-03
**Priority**: High
**Document Role**: SRS high-level cho connector SAP B1 của MIABOS

---

## 0. Metadata

- Feature ID: `F-I02-INT-001`
- Related User Story: `US-I02-INT-001`
- Related PRD: Integration domain decomposition
- Related Screens:
  - Màn hình cấu hình SAP connector
  - Màn hình domain sync status của SAP
- Related APIs:
  - `GET /sap/items`
  - `GET /sap/warehouses`
  - `GET /sap/inventory/availability`
  - `GET /sap/transfers`
  - `GET /sap/price-lists`
  - `GET /sap/promotions`
- Related Tables:
  - `sap_connector_config`
  - `sap_sync_cursor`
- Related Events:
  - `sap.product.synced`
  - `sap.pricing.synced`
  - `sap.promotion.synced`
  - `sap.logistics.synced`
- Related Error IDs:
  - `SAP-CON-001`
  - `SAP-CON-002`

## 1. User Story

Là Integration Admin, tôi muốn MIABOS có một connector SAP B1 riêng để đọc dữ liệu ERP lõi, quản lý cursor, và phát event chuẩn hóa sang read-model layer.

## 1A. User Task Flow

| Step | User Role | Action | Task Type | Notes |
|------|-----------|--------|-----------|-------|
| 1 | Integration Admin | Cấu hình endpoint / credential / middleware path của SAP | Configuration | Setup |
| 2 | Integration Admin | Chạy sync theo từng domain như product, pricing, logistics | Quick Action | Vận hành |
| 3 | Technical Operator | Xem lỗi sync theo domain SAP | Exception Handling | Debug |

## 2. Business Context

SAP B1 là nguồn ERP lõi cho sản phẩm, kho, tồn, giá nền, và một phần CTKM / logistics context. MIABOS cần connector tách riêng để điều phối access vào SAP theo chuẩn có kiểm soát.

## 3. Preconditions

- Có Service Layer hoặc middleware đã được cấp quyền.
- Domain endpoints của SAP đã được xác nhận.

## 4. Postconditions

- MIABOS đọc được dữ liệu SAP theo domain.
- Event đồng bộ SAP được phát chuẩn để downstream modules xử lý.

## 5. Main Flow

1. Orchestrator gọi SAP connector theo domain.
2. Connector đọc dữ liệu từ SAP / middleware.
3. Kết quả được normalize ở mức connector.
4. Connector phát event domain-specific cho read-model layer.

## 6. Alternate Flows

- Inventory availability có thể gọi realtime thay vì chỉ sync theo lịch.

## 7. Error Flows

- SAP timeout -> trả về lỗi connector và cho phép fallback ở business module.
- Domain endpoint thiếu dữ liệu -> mark `Needs Review`.

## 8. State Machine

`Ready -> Syncing -> Synced / Failed / Needs Review`

## 9. UX / Screen Behavior

- Phải thấy được domain nào của SAP đang sync tốt, domain nào đang stale.

## 10. Role / Permission Rules

- Chỉ admin kỹ thuật được đổi credential hoặc endpoint.

## 11. Business Rules

- Không cho LLM gọi trực tiếp SAP.
- Inventory realtime và sync batch là hai luồng riêng nhưng dùng chung connector authority.

## 12. API Contract Excerpt + Canonical Links

- Phụ thuộc trực tiếp vào source spec [F-SAP-INT-001](../Source_Specs/F-SAP-INT-001_SAP_B1_Internal_Chatbot_Integration_SRS.md)

## 13. Event / Webhook Contract Excerpt + Canonical Links

- Phát `sap.*.synced` cho downstream modules.

## 14. Data / DB Impact Excerpt + Canonical Links

- Chỉ lưu config và cursor ở connector layer.

## 15. Validation Rules

- Credential phải được kiểm tra trước khi mở lịch sync.

## 16. Error Codes

- `SAP-CON-001`: Không kết nối được SAP
- `SAP-CON-002`: SAP trả payload không hợp lệ

## 17. Non-Functional Requirements

- Hỗ trợ throttling và timeout control.

## 18. Acceptance Criteria

- SAP connector sync được các domain đã chốt trong source spec.

## 19. Test Scenarios

- Sync product
- Sync pricing
- Realtime availability check
- Timeout recovery

## 20. Observability

- Theo dõi success/fail theo từng SAP domain.

## 21. Rollout / Feature Flag

- Mở đầu tiên vì SAP là nguồn lõi của phase 1.

## 22. Open Questions

- Đi qua Service Layer trực tiếp hay middleware trung gian?

## 23. Definition of Done

- Có connector contract rõ cho SAP và trace sang source spec.

## 24. Ready-for-UXUI Checklist

- [ ] UI config / status screens đã đủ high-level

## 25. Ready-for-FE-Preview Checklist

- [ ] Mock connector status đã xác định

## 26. Ready-for-BE / Integration Promotion Checklist

- [ ] Đã chốt endpoint family của SAP
