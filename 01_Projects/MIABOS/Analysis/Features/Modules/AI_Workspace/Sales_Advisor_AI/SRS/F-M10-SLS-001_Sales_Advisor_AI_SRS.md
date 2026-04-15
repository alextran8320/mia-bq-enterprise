# Feature SRS: F-M10-SLS-001 Sales Advisor AI

**Status**: Draft
**Owner**: A03 BA Agent
**Last Updated By**: Codex CLI (GPT-5 Codex)
**Last Reviewed By**: A01 PM Agent
**Approval Required**: PM
**Approved By**: -
**Last Status Change**: 2026-04-15
**Source of Truth**: This document
**Blocking Reason**: Cần chốt need-discovery flow, sales-safe answer boundary, và CTA handoff model
**Module**: M10
**Phase**: PB-02 / PB-03
**Priority**: High
**Document Role**: SRS high-level cho chatbot tư vấn bán hàng của MIABOS

---

## 0. Metadata

- Feature ID: `F-M10-SLS-001`
- Related User Story: `US-M10-SLS-001`
- Related Screens: sales chat shell, suggestion card, CTA / lead form, handoff state
- Related APIs: `POST /mia/sales-advisor/query`, `POST /mia/leads`
- Related Tables: `crm_customer`, `crm_customer_attribute`, `crm_lead_event`
- Related Events: `mia.sales.answer.generated`, `mia.lead.created`
- Related Error IDs: `SLS-001`

## 1. User Story

Là khách hàng hoặc AI bán hàng, tôi muốn được tư vấn sản phẩm, giá, CTKM, availability ở mức sales-safe, đồng thời ghi nhận nhu cầu và điều hướng sang hành động mua / để lại lead.

## 1A. User Task Flow

| Step | User Role | Action | Task Type | Notes |
|------|-----------|--------|-----------|-------|
| 1 | Khách hàng | Bắt đầu hội thoại tư vấn | Quick Action | Entry |
| 2 | AI | Khai thác nhu cầu, size, sở thích, khu vực | Quick Action | Need discovery |
| 3 | AI | Đề xuất sản phẩm và CTA phù hợp | Quick Action | Conversion |
| 4 | Hệ thống | Tạo lead hoặc handoff khi khách sẵn sàng | Quick Action | Outcome |

## 2. Business Context

Đây là lớp AI-facing ra khách, phải cực kỳ chặt ở sales-safe boundary.

## 3. Preconditions

- M01-M04, M06, M07 đã có contract tối thiểu.

## 4. Postconditions

- Tư vấn được trong scope an toàn và có CTA rõ ràng.

## 5. Main Flow

Discover need -> evaluate public-safe policy -> fetch projections -> answer -> CTA/handoff.

## 6. Alternate Flows

Anonymous user, no-availability case, lead-only case.

## 7. Error Flows

Thiếu confidence, out-of-scope, hoặc denied by public-safe policy.

## 8. State Machine

`Conversation Open -> Discovering -> Suggesting -> Lead Captured / Handoff / Closed`

## 9. UX / Screen Behavior

Suggestion card, CTA, và store/channel suggestion phải rõ ràng.

## 10. Role / Permission Rules

Phụ thuộc `M07 public-safe policy`.

## 11. Business Rules

Không lộ tồn chi tiết, payment status, hoặc nội dung nhạy cảm.

## 12. API Contract Excerpt + Canonical Links

Phụ thuộc `M01/M02/M03/M04/M06/M07`; feed `M11/M12`.

## 13. Event / Webhook Contract Excerpt + Canonical Links

Phát `mia.sales.answer.generated` và `mia.lead.created`.

## 14. Data / DB Impact Excerpt + Canonical Links

Ghi lead / customer attributes vào CRM layer.

## 15. Validation Rules

Mọi answer public-facing phải qua sales-safe projection.

## 16. Error Codes

`SLS-001`: Sales-safe response blocked.

## 17. Non-Functional Requirements

Tự nhiên, an toàn, conversion-oriented.

## 18. Acceptance Criteria

Trả lời được product/price/promo/availability trong phạm vi cho phép.

## 19. Test Scenarios

Suggest product, no-stock redirect, CTA lead capture, blocked sensitive query.

## 20. Observability

Theo dõi lead conversion, blocked answers, và CTA click-through.

## 21. Rollout / Feature Flag

Sau internal pilot ổn định.

## 22. Open Questions

CTA set và channel handoff cho phase 1 là gì?

## 23. Definition of Done

Sales advisor chạy được trong sales-safe mode.

## 24. Ready-for-UXUI Checklist

- [ ] UXUI đã chốt suggestion card + CTA states

## 25. Ready-for-FE-Preview Checklist

- [ ] FE Preview có mock discovery / suggestion / lead capture

## 26. Ready-for-BE / Integration Promotion Checklist

- [ ] BE public-safe evaluation contract đã rõ
