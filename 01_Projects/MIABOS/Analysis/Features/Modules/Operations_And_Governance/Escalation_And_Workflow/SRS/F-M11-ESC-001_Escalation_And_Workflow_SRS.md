# Feature SRS: F-M11-ESC-001 Escalation and Workflow

**Status**: Draft
**Owner**: A03 BA Agent
**Last Updated By**: Codex CLI (GPT-5 Codex)
**Last Reviewed By**: A01 PM Agent
**Approval Required**: PM
**Approved By**: -
**Last Status Change**: 2026-04-15
**Source of Truth**: This document
**Blocking Reason**: Cần chốt destination system, assignment rule, và payload handoff contract
**Module**: M11
**Phase**: PB-02 / PB-03
**Priority**: High
**Document Role**: SRS high-level cho escalation và workflow handoff của MIABOS

---

## 0. Metadata

- Feature ID: `F-M11-ESC-001`
- Related User Story: `US-M11-ESC-001`
- Related Screens: escalation compose drawer, queue list, ticket detail reference
- Related APIs: `POST /mia/escalations`
- Related Tables: `escalation_ticket_ref`
- Related Events: `mia.chatbot.escalation_created`, `escalation.assigned`
- Related Error IDs: `ESC-001`

## 1. User Story

Là người dùng nội bộ hoặc AI, tôi muốn tạo escalation nhanh khi câu trả lời chưa đủ chắc chắn hoặc cần người xử lý tiếp.

## 1A. User Task Flow

| Step | User Role | Action | Task Type | Notes |
|------|-----------|--------|-----------|-------|
| 1 | User / AI | Chọn tạo escalation từ answer hiện tại | Exception Handling | Entry |
| 2 | Hệ thống | Đóng gói context hội thoại, source, actor, reason | Quick Action | Payload |
| 3 | User / Assignee | Theo dõi trạng thái ticket/handoff | Reporting | Follow-up |

## 2. Business Context

Escalation là cầu nối giữa AI answer và vận hành người thật.

## 3. Preconditions

- Destination workflow đã được xác định.

## 4. Postconditions

- Có ticket / task / reference để follow-up.

## 5. Main Flow

Create escalation -> route -> assign -> track status.

## 6. Alternate Flows

Auto escalation, manual escalation, external ticketing.

## 7. Error Flows

Destination unavailable, assignment failed, hoặc duplicate escalation.

## 8. State Machine

`Draft -> Submitted -> Assigned -> Resolved -> Closed`

## 9. UX / Screen Behavior

Escalation phải giữ nguyên chat context và source context.

## 10. Role / Permission Rules

Quyền tạo escalation và quyền xem queue có thể khác nhau.

## 11. Business Rules

Không cần mirror full external ticket payload nếu hệ ngoài là source chính.

## 12. API Contract Excerpt + Canonical Links

Phụ thuộc `M09/M10`; feed `M12`.

## 13. Event / Webhook Contract Excerpt + Canonical Links

Phát `mia.chatbot.escalation_created` và `escalation.assigned`.

## 14. Data / DB Impact Excerpt + Canonical Links

Ghi tham chiếu escalation vào `escalation_ticket_ref`.

## 15. Validation Rules

Escalation phải có reason, context, source, và actor.

## 16. Error Codes

`ESC-001`: Escalation routing failed.

## 17. Non-Functional Requirements

Reliable và traceable.

## 18. Acceptance Criteria

Tạo và theo dõi được escalation từ internal AI và sales advisor.

## 19. Test Scenarios

Manual escalation, auto escalation, duplicate prevention.

## 20. Observability

Theo dõi escalation rate, assignment lag, unresolved count.

## 21. Rollout / Feature Flag

Phase 1 nội bộ trước, external later.

## 22. Open Questions

Destination chính là Lark, email, hay workflow nội bộ?

## 23. Definition of Done

Escalation workflow vận hành được và traceable.

## 24. Ready-for-UXUI Checklist

- [ ] UXUI đã chốt escalation composer / queue states

## 25. Ready-for-FE-Preview Checklist

- [ ] FE Preview có mock submit / assigned / resolved

## 26. Ready-for-BE / Integration Promotion Checklist

- [ ] BE routing contract đã rõ
