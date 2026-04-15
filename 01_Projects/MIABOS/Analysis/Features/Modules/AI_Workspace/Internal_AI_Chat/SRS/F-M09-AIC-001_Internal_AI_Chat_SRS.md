# Feature SRS: F-M09-AIC-001 Internal AI Chat

**Status**: Draft
**Owner**: A03 BA Agent
**Last Updated By**: Codex CLI (GPT-5 Codex)
**Last Reviewed By**: A01 PM Agent
**Approval Required**: PM
**Approved By**: -
**Last Status Change**: 2026-04-15
**Source of Truth**: This document
**Blocking Reason**: Cần chốt query routing, answer pattern, escalation trigger, và trust UI contract
**Module**: M09
**Phase**: PB-02 / PB-03
**Priority**: High
**Document Role**: SRS high-level cho chatbot nội bộ của MIABOS

---

## 0. Metadata

- Feature ID: `F-M09-AIC-001`
- Related User Story: `US-M09-AIC-001`
- Related Screens: chat console nội bộ, answer card, source trace panel, escalation CTA
- Related APIs: `POST /mia/chat/query`
- Related Tables: `chat_audit_log`
- Related Events: `mia.chatbot.answer_generated`, `mia.chatbot.escalation_created`
- Related Error IDs: `AIC-001`

## 1. User Story

Là người dùng nội bộ, tôi muốn hỏi dữ liệu và policy bằng ngôn ngữ tự nhiên trên MIABOS và nhận câu trả lời có nguồn, độ mới dữ liệu, và cảnh báo khi cần.

## 1A. User Task Flow

| Step | User Role | Action | Task Type | Notes |
|------|-----------|--------|-----------|-------|
| 1 | User nội bộ | Nhập câu hỏi tự nhiên | Quick Action | Entry |
| 2 | Hệ thống | Route intent sang module phù hợp | Quick Action | Runtime |
| 3 | User | Xem answer + source + freshness + warning | Reporting | Trust |
| 4 | User | Tạo escalation nếu chưa đủ chắc chắn | Exception Handling | Follow-up |

## 2. Business Context

Đây là bề mặt tiêu thụ chính của các business modules nội bộ.

## 3. Preconditions

- M01-M08 đã có contract tối thiểu.

## 4. Postconditions

- User nhận được câu trả lời có giải thích, source, warning, và next action.

## 5. Main Flow

Classify intent -> evaluate access -> query modules -> compose answer -> audit.

## 6. Alternate Flows

Data + policy answer, multi-source answer, answer + escalation.

## 7. Error Flows

Module unavailable, out-of-scope, hoặc stale-only answer.

## 8. State Machine

`Question Submitted -> Routed -> Answered / Escalated / Blocked`

## 9. UX / Screen Behavior

Answer phải có kết luận trước, chi tiết sau, và source trace rõ.

## 10. Role / Permission Rules

Mọi answer đi qua `M07`.

## 11. Business Rules

Không trả raw payload; phải trả `kết luận + bằng chứng + hành động`.

## 12. API Contract Excerpt + Canonical Links

Phụ thuộc `M01..M08`; feed `M11` và `M12`.

## 13. Event / Webhook Contract Excerpt + Canonical Links

Phát `mia.chatbot.answer_generated` và `mia.chatbot.escalation_created`.

## 14. Data / DB Impact Excerpt + Canonical Links

Ghi audit vào `chat_audit_log`.

## 15. Validation Rules

Mọi answer phải có source trace hoặc warning.

## 16. Error Codes

`AIC-001`: Internal answer generation failed.

## 17. Non-Functional Requirements

Nhanh, ổn định, có audit.

## 18. Acceptance Criteria

Trả lời được các intent phase 1 với trust UI đầy đủ.

## 19. Test Scenarios

Product query, inventory query, policy query, out-of-scope query.

## 20. Observability

Theo dõi answer rate, escalation rate, và top intents.

## 21. Rollout / Feature Flag

Pilot nội bộ trước.

## 22. Open Questions

Intent taxonomy phase 1 chốt ở mức nào?

## 23. Definition of Done

Internal AI chat dùng được cho pilot phase 1.

## 24. Ready-for-UXUI Checklist

- [ ] UXUI đã chốt chat shell và answer card

## 25. Ready-for-FE-Preview Checklist

- [ ] FE Preview có mock intent variants

## 26. Ready-for-BE / Integration Promotion Checklist

- [ ] BE query orchestration contract đã rõ
