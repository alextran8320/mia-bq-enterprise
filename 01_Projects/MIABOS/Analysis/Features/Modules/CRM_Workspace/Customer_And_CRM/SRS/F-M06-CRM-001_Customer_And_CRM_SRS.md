# Feature SRS: F-M06-CRM-001 Customer and CRM

**Status**: Draft
**Owner**: A03 BA Agent
**Last Updated By**: Claude Code (claude-sonnet-4-6)
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

## 0B. Integration Source Map

| Data Domain | Source System | Direction | Notes |
|---|---|---|---|
| Customer master, thông tin khách hàng cơ bản | SAP B1 | Read | Nguồn cho business partner / customer code |
| Khách hàng ecommerce, loyalty, đơn online | Haravan | Read | Nguồn cho customer profile phía online và loyalty |
| Khách hàng tại cửa hàng, CRM POS | KiotViet | Read | Nguồn cho customer tại điểm bán |
| Chính sách loyalty, điểm tích lũy, hạng thành viên | MIABOS Knowledge Center (M08) | Read | Policy layer cho CRM rules |
| CRM customer master, lead, enrichment attributes | MIABOS internal DB | Read/Write | MIABOS là master của CRM layer; source là read-only |

## 1. User Story

Là Sales, CSKH, hoặc AI bán hàng, tôi muốn MIABOS có hồ sơ khách hàng hợp nhất để phục vụ tư vấn, chăm sóc, remarketing, và handoff cho người thật.

## 1A. User Task Flow

| Step | User Role | Action | Task Type | Notes |
|------|-----------|--------|-----------|-------|
| 1 | User / AI | Tìm hoặc tạo hồ sơ khách hàng | Quick Action | Entry |
| 2 | Hệ thống | Hợp nhất dữ liệu khách từ CRM + channels + ERP refs | Quick Action | Profile build |
| 3 | Sales / CSKH | Xem thuộc tính, lịch sử tóm tắt, và gợi ý hành động | Reporting | CRM usage |

## 2. Business Context

BQ có hơn 2 triệu khách hàng (theo public footprint) với dữ liệu khách phân tán: SAP B1 (business partner/customer code), KiotViet (CRM tại cửa hàng), Haravan (customer profile ecommerce + loyalty). CSKH và Sales thường không biết khách đã mua gì, thuộc tier nào, hay có CTKM riêng không — vì không có profile hợp nhất. Phase 1 cần CRM layer đủ để AI trả lời "khách này là ai, đã mua gì, thuộc hạng nào" mà không cần mở 3 hệ thống.

## 3. Preconditions

- Customer identity mapping giữa SAP B1, KiotViet, Haravan đã có tối thiểu cho phase 1 (ít nhất theo SĐT hoặc email).
- Consent policy và boundary field CRM được phép lưu đã được xác định.
- `M07` đã định nghĩa field customer nào là nhạy cảm (PII) và cần mask.

## 4. Postconditions

- MIABOS có `crm_customer` làm master CRM layer — unified từ nhiều nguồn.
- AI và CSKH/Sales truy cập được profile tóm tắt với scope phù hợp.

## 5. Main Flow

1. User hoặc AI tìm kiếm khách theo SĐT, email, hoặc tên.
2. Hệ thống resolve canonical customer identity từ `crm_customer` — check match từ SAP B1, KiotViet, Haravan.
3. Nếu chưa có profile, hệ thống tạo lead profile từ thông tin có sẵn.
4. Hệ thống pull enrichment attributes: hạng loyalty, lịch sử mua tóm tắt, kênh hay dùng.
5. Hệ thống apply scope rule từ `M07` để mask PII hoặc field nhạy cảm theo role.
6. Render customer profile summary với `tên`, `hạng`, `lịch sử tóm tắt`, `kênh`, `consent state`.
7. Sales/CSKH dùng profile để tư vấn, tạo lead event, hoặc trigger remarketing.

## 6. Alternate Flows

- Lead-only profile: khách chưa có trong SAP B1/KiotViet — tạo profile mới trong MIABOS CRM.
- Anonymous lead từ chatbot: chỉ có session context, chưa identify.
- Channel-linked lookup: tìm theo Haravan customer ID hoặc KiotViet customer code.

## 7. Error Flows

- Conflict customer identity (cùng SĐT nhưng khác tên giữa KiotViet và Haravan) → flag conflict, không tự merge im lặng.
- Consent missing hoặc field không được phép lưu → block enrichment, ghi log.
- Enrichment request từ AI nhưng scope không đủ → trả summary an toàn, mask field nhạy cảm.

## 8. State Machine

`Lead -> Qualified Lead -> Customer -> Active / Inactive / Blocked`

## 9. UX / Screen Behavior

- Profile summary: `tên`, `SĐT (masked nếu cần)`, `hạng loyalty`, `kênh chính`, `lần mua gần nhất`, `consent state`.
- Field nguồn phải có badge rõ (SAP B1 / KiotViet / Haravan / MIABOS CRM).
- Conflict identity phải hiển thị warning "hồ sơ có thể trùng lặp" thay vì tự merge.

## 10. Role / Permission Rules

- `CSKH (Chăm sóc khách hàng)`: xem profile summary — tên, hạng, lịch sử tóm tắt, kênh. SĐT đầy đủ theo scope được cấp.
- `Sales / Vận hành bán lẻ`: xem enrichment thêm — mua gì gần đây, CTKM phù hợp, lead score.
- `Marketing / CRM (Ecommerce)`: xem segment, loyalty tier, remarketing triggers.
- `IT / ERP / data`: xem full identity mapping và conflict log.
- PII fields (SĐT đầy đủ, địa chỉ, email) mask theo scope trong `M07`.

## 11. Business Rules

- MIABOS CRM là master ở lớp CRM, nhưng không override customer master trong SAP B1/KiotViet/Haravan.
- Không lưu field PII hoặc enrichment attribute chưa có consent boundary rõ ràng.
- Customer identity merge chỉ được thực hiện khi có ít nhất 2 matching identifiers (VD: SĐT + email) — không tự merge chỉ dựa tên.
- Loyalty tier/hạng phải lấy từ nguồn authoritative (Haravan loyalty hoặc MIABOS CRM); không tự suy đoán từ lịch sử đơn hàng.
- AI runtime chỉ được dùng customer attributes đã được consent-cleared cho use case đó.

## 12. API Contract Excerpt + Canonical Links

- `POST /mia/customers/profile`: tìm/tạo profile theo `phone`, `email`, `name`
  - Output: `customer_id`, `name`, `loyalty_tier`, `channels[]`, `last_purchase_summary`, `consent_state`, `source_refs[]`
- `POST /mia/leads`: tạo lead event từ chatbot session
- `POST /mia/remarketing/triggers`: trigger remarketing cho segment phù hợp
- Canonical links:
  - Reads `I02` (SAP B1 business partner), `I03` (Haravan customer/loyalty), `I04` (KiotViet customer)
  - Feeds `F-M10-SLS-001` (sales advisor), `F-M09-AIC-001` (chat context)

## 13. Event / Webhook Contract Excerpt + Canonical Links

- `mia.customer.profile.updated`: phát khi profile được tạo mới hoặc enrichment thay đổi.
- `mia.remarketing.triggered`: phát khi remarketing được trigger cho customer segment.

## 14. Data / DB Impact Excerpt + Canonical Links

- `crm_customer`: canonical customer master trong MIABOS CRM — unified từ các nguồn
- `crm_customer_attribute`: enrichment attributes, loyalty tier, preferences
- `crm_lead_event`: lead creation và qualification events từ chatbot
- `har_customer_read_model`, `kv_customer_read_model`: read layers từ Haravan + KiotViet

## 15. Validation Rules

- Customer merge chỉ hợp lệ khi có ít nhất 2 matching identifiers.
- Field PII không được ghi vào `crm_customer_attribute` nếu chưa có consent boundary.
- Remarketing trigger chỉ hợp lệ với customer đã có consent cho marketing communications.

## 16. Error Codes

- `CRM-001`: Customer identity conflict — không tự merge được.
- `CRM-002`: Consent missing — enrichment hoặc remarketing bị block.
- `CRM-003`: Customer not found — không resolve được trong bất kỳ nguồn nào.

## 17. Non-Functional Requirements

- `POST /mia/customers/profile` phải trả kết quả trong `<= 2 giây` cho `95%` queries.
- Customer profile phải được re-sync tối thiểu mỗi `24 giờ` từ Haravan (loyalty tier thay đổi thường xuyên).
- Audit log cho mọi identity merge và remarketing trigger phải được giữ tối thiểu `180 ngày`.

## 18. Acceptance Criteria

- CSKH tra khách theo SĐT và nhận profile summary với tên, hạng loyalty, kênh chính, lần mua gần nhất.
- AI Sales Advisor nhận customer context từ M06 để cá nhân hóa tư vấn.
- Conflict identity được flag warning — không tự merge khi chỉ có 1 matching identifier.
- PII field bị mask đúng theo scope của role đang hỏi.

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
