# Feature SRS: F-M06-CRM-001 Customer and CRM

**Status**: Draft
**Owner**: A03 BA Agent
**Last Updated By**: Codex CLI (GPT-5 Codex)
**Last Reviewed By**: A01 PM Agent
**Approval Required**: PM
**Approved By**: -
**Last Status Change**: 2026-04-15
**Source of Truth**: This document
**Blocking Reason**: Cần chốt customer master boundary, consent, và CRM enrichment fields được phép lưu
**Module**: M06
**Phase**: PB-02 / PB-03
**Priority**: High
**Document Role**: SRS high-level cho module Customer and CRM của MIABOS

---

## 0. Metadata

- Feature ID: `F-M06-CRM-001`
- Related User Story: `US-M06-CRM-001`
- Related Screens: customer profile summary, CRM enrichment view, lead / remarketing context
- Related APIs: `POST /mia/customers/profile`, `POST /mia/leads`, `POST /mia/remarketing/triggers`
- Related Tables: `crm_customer`, `crm_customer_attribute`, `crm_lead_event`, `crm_order_summary`, `har_customer_read_model`, `kv_customer_read_model`
- Related Events: `mia.customer.profile.updated`, `mia.remarketing.triggered`
- Related Error IDs: `CRM-001`

## 1. User Story

Là Sales, CSKH, hoặc AI bán hàng, tôi muốn MIABOS có hồ sơ khách hàng hợp nhất để phục vụ tư vấn, chăm sóc, remarketing, và handoff cho người thật.

## 1A. User Task Flow

| Step | User Role | Action | Task Type | Notes |
|------|-----------|--------|-----------|-------|
| 1 | User / AI | Tìm hoặc tạo hồ sơ khách hàng | Quick Action | Entry |
| 2 | Hệ thống | Hợp nhất dữ liệu khách từ CRM + channels + ERP refs | Quick Action | Profile build |
| 3 | Sales / CSKH | Xem thuộc tính, lịch sử tóm tắt, và gợi ý hành động | Reporting | CRM usage |

## 2. Business Context

MIA BOS được định vị là CRM + AI Sales / CSKH operating layer.

## 3. Preconditions

- Customer mapping và consent policy đã có.

## 4. Postconditions

- Có customer profile dùng được cho hỏi đáp và remarketing.

## 5. Main Flow

Resolve/create profile -> enrich attributes -> use in AI or CRM actions.

## 6. Alternate Flows

Lead-only profile, anonymous lead, channel-linked customer.

## 7. Error Flows

Conflict customer identities, consent missing, hoặc enrichment denied.

## 8. State Machine

`Lead -> Qualified -> Customer -> Inactive / Blocked`

## 9. UX / Screen Behavior

Profile summary phải hiển thị nguồn, consent, và attributes đã xác nhận.

## 10. Role / Permission Rules

Customer-sensitive fields phải theo role/scope.

## 11. Business Rules

MIA có thể là master ở lớp CRM nhưng không thay thế ERP master logic.

## 12. API Contract Excerpt + Canonical Links

Phụ thuộc `I05` và customer domains của `I02/I03/I04`; feed `M10`.

## 13. Event / Webhook Contract Excerpt + Canonical Links

Phát `mia.customer.profile.updated` và `mia.remarketing.triggered`.

## 14. Data / DB Impact Excerpt + Canonical Links

Đọc / ghi vào `crm_customer`, `crm_customer_attribute`, `crm_lead_event`.

## 15. Validation Rules

Không lưu field CRM nhạy cảm nếu chưa có consent boundary.

## 16. Error Codes

`CRM-001`: Customer profile conflict.

## 17. Non-Functional Requirements

Profile merge phải có audit.

## 18. Acceptance Criteria

Tạo / xem / enrich được hồ sơ khách hàng phase 1.

## 19. Test Scenarios

Unify customer refs, enrich size/preference, trigger remarketing.

## 20. Observability

Theo dõi profile merge conflicts và remarketing trigger count.

## 21. Rollout / Feature Flag

Sales/CSKH trước, automation sau.

## 22. Open Questions

Field nào được phép lưu và dùng remarketing?

## 23. Definition of Done

Customer CRM module đủ cho AI sales và CSKH phase 1.

## 24. Ready-for-UXUI Checklist

- [ ] UXUI đã chốt customer summary + enrichment states

## 25. Ready-for-FE-Preview Checklist

- [ ] FE Preview có mock lead/customer variants

## 26. Ready-for-BE / Integration Promotion Checklist

- [ ] BE contract consent và unified identity đã rõ
