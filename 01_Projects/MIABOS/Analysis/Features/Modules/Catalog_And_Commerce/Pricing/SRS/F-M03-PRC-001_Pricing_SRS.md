# Feature SRS: F-M03-PRC-001 Pricing

**Status**: Draft
**Owner**: A03 BA Agent
**Last Updated By**: Codex CLI (GPT-5 Codex)
**Last Reviewed By**: A01 PM Agent
**Approval Required**: PM
**Approved By**: -
**Last Status Change**: 2026-04-15
**Source of Truth**: This document
**Blocking Reason**: Chưa chốt source-priority rule cho giá theo kênh và loại cửa hàng
**Module**: M03
**Phase**: PB-02 / PB-03
**Priority**: High
**Document Role**: SRS high-level cho module Pricing của MIABOS

---

## 0. Metadata

- Feature ID: `F-M03-PRC-001`
- Related User Story: `US-M03-PRC-001`
- Related Screens: price answer card, source priority warning, pricing detail summary
- Related APIs: `POST /mia/pricing/query`
- Related Tables: `pricing_read_model`, `source_priority_rule`
- Related Events: `pricing.read_model.updated`
- Related Error IDs: `PRC-001`

## 1. User Story

Là Sales, Marketing, Finance, hoặc AI bán hàng, tôi muốn biết giá áp dụng đúng theo kênh / loại cửa hàng / context để tư vấn và đối soát chính xác.

## 1A. User Task Flow

| Step | User Role | Action | Task Type | Notes |
|------|-----------|--------|-----------|-------|
| 1 | User | Hỏi giá của mã hàng trong một context cụ thể | Quick Action | Entry |
| 2 | Hệ thống | Resolve source-priority rule | Quick Action | Rule engine |
| 3 | User / AI | Xem giá kết luận + nguồn + warning nếu conflict | Reporting | Trust |

## 2. Business Context

Pricing nằm phân tán giữa SAP, Haravan, KiotViet và có thể khác nhau theo channel.

## 3. Preconditions

- Source-priority rule đã có ít nhất cho phase 1.

## 4. Postconditions

- Giá được trả lời theo context đúng hoặc bị cảnh báo nếu chưa chắc chắn.

## 5. Main Flow

Resolve product -> resolve context -> apply source-priority -> return answer.

## 6. Alternate Flows

Fallback nội bộ, advisory-only public-safe pricing.

## 7. Error Flows

Conflict, thiếu rule, hoặc stale price.

## 8. State Machine

`Configured -> Active -> Warning / Needs Review`

## 9. UX / Screen Behavior

Phải hiển thị context áp dụng và warning rõ ràng.

## 10. Role / Permission Rules

Public-safe mode có thể bị giới hạn field giá.

## 11. Business Rules

Không tự suy diễn nếu chưa có rule.

## 12. API Contract Excerpt + Canonical Links

Phụ thuộc `I02/I03/I04/I05`.

## 13. Event / Webhook Contract Excerpt + Canonical Links

Phát `pricing.read_model.updated` khi projection giá thay đổi.

## 14. Data / DB Impact Excerpt + Canonical Links

Đọc từ `pricing_read_model` và `source_priority_rule`.

## 15. Validation Rules

Mọi answer giá phải map được rule hoặc warning.

## 16. Error Codes

`PRC-001`: Source-priority unresolved.

## 17. Non-Functional Requirements

Decisioning phải deterministic.

## 18. Acceptance Criteria

Trả được giá hoặc warning có kiểm soát.

## 19. Test Scenarios

Pricing theo channel, pricing conflict, stale price.

## 20. Observability

Theo dõi số case pricing warning.

## 21. Rollout / Feature Flag

Nội bộ trước, AI bán hàng sau.

## 22. Open Questions

Source owner cuối cùng của giá theo từng channel là gì?

## 23. Definition of Done

Có pricing answer đáng tin cậy cho phase 1.

## 24. Ready-for-UXUI Checklist

- [ ] UXUI đã chốt warning state cho pricing conflict

## 25. Ready-for-FE-Preview Checklist

- [ ] FE Preview có mock multi-source pricing

## 26. Ready-for-BE / Integration Promotion Checklist

- [ ] BE contract source-priority đã rõ
