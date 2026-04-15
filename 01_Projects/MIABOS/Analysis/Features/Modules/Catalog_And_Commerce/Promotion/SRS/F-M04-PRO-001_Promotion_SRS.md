# Feature SRS: F-M04-PRO-001 Promotion

**Status**: Draft
**Owner**: A03 BA Agent
**Last Updated By**: Codex CLI (GPT-5 Codex)
**Last Reviewed By**: A01 PM Agent
**Approval Required**: PM
**Approved By**: -
**Last Status Change**: 2026-04-15
**Source of Truth**: This document
**Blocking Reason**: Chưa chốt source-priority rule cho CTKM và phạm vi public-safe exposure
**Module**: M04
**Phase**: PB-02 / PB-03
**Priority**: High
**Document Role**: SRS high-level cho module Promotion của MIABOS

---

## 0. Metadata

- Feature ID: `F-M04-PRO-001`
- Related User Story: `US-M04-PRO-001`
- Related Screens: promotion answer card, voucher detail, promo scope explanation
- Related APIs: `POST /mia/promotions/query`
- Related Tables: `promotion_read_model`, `source_priority_rule`
- Related Events: `promotion.read_model.updated`
- Related Error IDs: `PRO-001`

## 1. User Story

Là Sales, Marketing, CSKH, hoặc AI bán hàng, tôi muốn biết CTKM / voucher / coupon áp dụng đúng cho sản phẩm hoặc khách hàng trong đúng context.

## 1A. User Task Flow

| Step | User Role | Action | Task Type | Notes |
|------|-----------|--------|-----------|-------|
| 1 | User | Hỏi CTKM hoặc mã giảm giá đang áp dụng | Quick Action | Entry |
| 2 | Hệ thống | Resolve promotion scope và source rule | Quick Action | Rule engine |
| 3 | User / AI | Xem CTKM kết luận + điều kiện áp dụng | Reporting | Trust |

## 2. Business Context

CTKM là domain biến động cao và dễ conflict giữa ERP, POS, và online.

## 3. Preconditions

- Pricing/product mapping đã có.

## 4. Postconditions

- CTKM trả ra có scope, hiệu lực, và warning khi cần.

## 5. Main Flow

Resolve item/customer/channel -> apply promo rules -> return result.

## 6. Alternate Flows

Voucher-only, category-level promo, customer-group promo.

## 7. Error Flows

Source conflict, expired promo, hoặc scope mismatch.

## 8. State Machine

`Configured -> Active -> Expired / Warning / Needs Review`

## 9. UX / Screen Behavior

Phải thấy hiệu lực, điều kiện, và scope áp dụng.

## 10. Role / Permission Rules

Chatbot public chỉ thấy phần đã whitelist.

## 11. Business Rules

Không lộ internal-only promo logic ra public-safe mode.

## 12. API Contract Excerpt + Canonical Links

Phụ thuộc `I02/I03/I04/I05`.

## 13. Event / Webhook Contract Excerpt + Canonical Links

Phát `promotion.read_model.updated` khi CTKM thay đổi.

## 14. Data / DB Impact Excerpt + Canonical Links

Đọc từ `promotion_read_model` và source-priority rules.

## 15. Validation Rules

Promo answer phải có hiệu lực và scope rõ ràng.

## 16. Error Codes

`PRO-001`: Promotion source unresolved.

## 17. Non-Functional Requirements

Rule resolution phải nhất quán.

## 18. Acceptance Criteria

Trả được CTKM đúng context hoặc warning rõ ràng.

## 19. Test Scenarios

Promo by channel, voucher by customer group, expired promo.

## 20. Observability

Theo dõi top promotion conflicts.

## 21. Rollout / Feature Flag

Nội bộ trước, sales-safe sau.

## 22. Open Questions

Owner cuối của CTKM theo từng channel là gì?

## 23. Definition of Done

Promotion module trả lời được cho phase 1.

## 24. Ready-for-UXUI Checklist

- [ ] UXUI đã chốt promo card / warning states

## 25. Ready-for-FE-Preview Checklist

- [ ] FE Preview có mock promo scope variants

## 26. Ready-for-BE / Integration Promotion Checklist

- [ ] BE contract promo priority đã rõ
