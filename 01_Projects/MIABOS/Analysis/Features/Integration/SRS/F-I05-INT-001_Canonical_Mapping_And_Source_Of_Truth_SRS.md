# Feature SRS: F-I05-INT-001 Canonical Mapping and Source Boundary

**Status**: Draft
**Owner**: A03 BA Agent
**Last Updated By**: Codex CLI (GPT-5.4 Codex environment)
**Last Reviewed By**: A01 PM Agent
**Approval Required**: PM
**Approved By**: -
**Last Status Change**: 2026-04-19
**Source of Truth**: This document
**Blocking Reason**: Chưa chốt đầy đủ mã mapping đa hệ và priority rule cho giá / CTKM / order identity
**Module**: Integration
**Phase**: PB-02 / PB-03
**Priority**: High
**Document Role**: SRS high-level cho lớp canonical mapping, unified IDs, và source-boundary rules để tiêu thụ dữ liệu từ source systems / Data Warehouse BQ

---

## 0. Metadata

- Feature ID: `F-I05-INT-001`
- Related User Story: `US-I05-INT-001`
- Related Screens:
  - Màn hình mapping codes
  - Màn hình source-priority rules
  - Màn hình unresolved mapping review
- Related APIs:
  - `POST /mia/mappings/resolve`
  - `GET /mia/source-priority-rules`
  - `POST /mia/source-priority-rules`
- Related Tables:
  - `canonical_product_map`
  - `canonical_location_map`
  - `canonical_customer_map`
  - `canonical_order_map`
  - `source_priority_rule`
- Related Events:
  - `mapping.resolved`
  - `mapping.conflict.detected`
  - `source.priority.rule.updated`
- Related Error IDs:
  - `MAP-001`
  - `SOT-001`

## 1. User Story

Là Data Steward hoặc Business Analyst, tôi muốn MIABOS có lớp mapping và source-boundary để tiêu thụ dữ liệu từ SAP, Haravan, KiotViet hoặc Data Warehouse của BQ trước khi business modules sử dụng, nhưng không biến MIABOS thành source-of-truth dữ liệu vận hành.

## 1A. User Task Flow

| Step | User Role | Action | Task Type | Notes |
|------|-----------|--------|-----------|-------|
| 1 | Data Steward | Xem mapping chưa resolve giữa item / branch / customer / order | Reporting | Điểm vào |
| 2 | Data Steward | Chốt rule mapping hoặc sửa mapping thủ công | Configuration | Quản trị |
| 3 | Business Analyst | Chốt source-priority rule cho giá / CTKM / order summary | Configuration | Rule |
| 4 | Operations | Xem cảnh báo khi dữ liệu xung đột nguồn | Exception Handling | Follow-up |

## 2. Business Context

Không có lớp canonical mapping thì MIABOS sẽ trả lời lệch giữa ERP, online commerce, và POS retail. Đây là lớp nền bắt buộc để downstream modules dùng dữ liệu thống nhất theo source-of-truth do BQ/Data Warehouse xác định.

## 3. Preconditions

- Đã có source specs của SAP / Haravan / KiotViet.
- Đã xác định các domain cần unify ID và source-of-truth owner phía BQ/Data Warehouse.

## 4. Postconditions

- Có unified identity cho các domain chính.
- Có rule chọn nguồn đúng theo từng domain / kênh / loại cửa hàng.

## 5. Main Flow

1. Dữ liệu từ connector đổ vào layer mapping.
2. Hệ thống cố gắng auto-resolve bằng rule có sẵn.
3. Conflict được giữ lại cho review nếu chưa resolve được.
4. Kết quả canonical được phát cho business modules.

## 6. Alternate Flows

- Một số domain chỉ cần reference mapping, chưa cần master unification.

## 7. Error Flows

- Hai nguồn cùng claim ownership -> raise conflict.
- Không map được item / order / customer -> mark unresolved.

## 8. State Machine

`New -> Auto-Matched / Needs Review -> Approved -> Active / Deprecated`

## 9. UX / Screen Behavior

- Phải hiển thị rõ mapping source A, source B, canonical key, và conflict reason.

## 10. Role / Permission Rules

- Chỉ BA / Data Steward / PM mới được đổi source-priority rule.

## 11. Business Rules

- Giá và CTKM không được tự suy diễn khi chưa có source-priority rule.
- Customer/order unified ID phải phân biệt giữa CRM ID, ERP ID, và channel ID.

## 12. API Contract Excerpt + Canonical Links

- Phụ thuộc vào cả 3 source specs trong `Source_Specs/`.

## 13. Event / Webhook Contract Excerpt + Canonical Links

- Phát event khi mapping hoặc source-priority rule thay đổi.

## 14. Data / DB Impact Excerpt + Canonical Links

- Cần các bảng canonical map và rule tables ở mức khái niệm.

## 15. Validation Rules

- Không cho activate rule mới nếu gây conflict với rule đang chạy.

## 16. Error Codes

- `MAP-001`: Không resolve được canonical mapping
- `SOT-001`: Xung đột source-of-truth

## 17. Non-Functional Requirements

- Traceable, audit được, và không gây silent override.

## 18. Acceptance Criteria

- Có thể xác định canonical mapping cho product/location/customer/order.
- Có source-priority rule rõ cho giá và CTKM.

## 19. Test Scenarios

- Auto match SKU
- Manual resolve branch mismatch
- Pricing source conflict
- Order dual-ID mapping

## 20. Observability

- Theo dõi số conflict mapping mở và số rule overrides.

## 21. Rollout / Feature Flag

- Mở trước các business modules phụ thuộc.

## 22. Open Questions

- Domain nào cần manual review bắt buộc?
- Rule precedence thay đổi theo kênh hay theo module?

## 23. Definition of Done

- Có canonical mapping và source-priority layer đủ cho phase 1.

## 24. Ready-for-UXUI Checklist

- [ ] Mapping review screens đã được mô tả đủ

## 25. Ready-for-FE-Preview Checklist

- [ ] Mock conflicts và mock rules đã rõ

## 26. Ready-for-BE / Integration Promotion Checklist

- [ ] Domain ownership rules đã được chốt ở mức phase 1
