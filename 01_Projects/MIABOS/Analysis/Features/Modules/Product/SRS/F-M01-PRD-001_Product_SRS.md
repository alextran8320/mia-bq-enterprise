# Feature SRS: F-M01-PRD-001 Product

**Status**: Draft
**Owner**: A03 BA Agent
**Last Updated By**: Codex CLI (GPT-5 Codex)
**Last Reviewed By**: A01 PM Agent
**Approval Required**: PM
**Approved By**: -
**Last Status Change**: 2026-04-15
**Source of Truth**: This document
**Blocking Reason**: Cần rút chi tiết field, query pattern, và sales-safe projection từ source specs
**Module**: M01
**Phase**: PB-02 / PB-03
**Priority**: High
**Document Role**: SRS high-level cho module Product của MIABOS, dùng cho tra cứu nội bộ và tư vấn bán hàng

---

## 0. Metadata

- Feature ID: `F-M01-PRD-001`
- Related User Story: `US-M01-PRD-001`
- Related Screens: chatbot answer card, product detail summary, product trace source
- Related APIs: `POST /mia/products/query`, `GET /mia/products/{id}`
- Related Tables: `product_read_model`, `har_catalog_read_model`, `kv_product_read_model`
- Related Events: `product.read_model.updated`
- Related Error IDs: `PRD-001`

## 1. User Story

Là người dùng nội bộ hoặc AI bán hàng, tôi muốn tra cứu được sản phẩm theo mã, barcode, variant, category, collection, thuộc tính, và channel projection để trả lời nhanh và chính xác.

## 1A. User Task Flow

| Step | User Role | Action | Task Type | Notes |
|------|-----------|--------|-----------|-------|
| 1 | Sales / CSKH | Hỏi về sản phẩm theo mã hoặc mô tả | Quick Action | Điểm vào |
| 2 | Hệ thống | Resolve product từ canonical mapping | Quick Action | Query engine |
| 3 | User / AI | Xem product summary, variant, và source trace | Reporting | Trust |

## 2. Business Context

Hợp nhất product từ SAP / Haravan / KiotViet thành một module tiêu chuẩn cho mọi use case hỏi đáp.

## 3. Preconditions

- Có canonical mapping và source specs.

## 4. Postconditions

- Truy vấn được product summary thống nhất và sales-safe projection.

## 5. Main Flow

Resolve product -> nạp projection theo role/channel -> trả answer card.

## 6. Alternate Flows

Tìm theo barcode, tên gần đúng, hoặc variant.

## 7. Error Flows

Không map được SKU/barcode hoặc payload nguồn thiếu field.

## 8. State Machine

`Draft -> Active -> Stale -> Deprecated`

## 9. UX / Screen Behavior

Answer card phải có tên, mã, thuộc tính chính, source, và thời điểm sync.

## 10. Role / Permission Rules

Public-safe projection khác internal projection.

## 11. Business Rules

Không mirror toàn bộ field kỹ thuật; phải có product canonical identity.

## 12. API Contract Excerpt + Canonical Links

Phụ thuộc `I02/I03/I04/I05`.

## 13. Event / Webhook Contract Excerpt + Canonical Links

Phát `product.read_model.updated` khi projection thay đổi.

## 14. Data / DB Impact Excerpt + Canonical Links

Đọc từ `product_read_model` và source read models liên quan.

## 15. Validation Rules

Mọi product answer phải có source trace.

## 16. Error Codes

`PRD-001`: Không resolve được product canonical key.

## 17. Non-Functional Requirements

Query nhanh, fuzzy search có kiểm soát.

## 18. Acceptance Criteria

Tra cứu được product unified từ 3 nguồn.

## 19. Test Scenarios

Query theo mã, barcode, variant, và fuzzy name.

## 20. Observability

Theo dõi top product queries và unresolved mappings.

## 21. Rollout / Feature Flag

Phase 1 internal trước, sales-safe sau.

## 22. Open Questions

Bộ field nào public-safe theo từng channel?

## 23. Definition of Done

Product module query được từ canonical layer.

## 24. Ready-for-UXUI Checklist

- [ ] UXUI đã chốt answer card sản phẩm

## 25. Ready-for-FE-Preview Checklist

- [ ] FE Preview có mock product projections

## 26. Ready-for-BE / Integration Promotion Checklist

- [ ] Dependency với `I05` đã trace rõ
