# Feature SRS: F-M11-ESC-001 Escalation and Workflow

**Status**: Draft
**Owner**: A03 BA Agent
**Last Updated By**: Claude Code (claude-sonnet-4-6)
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

## 0B. Integration Source Map

| Data Domain | Source System | Direction | Notes |
|---|---|---|---|
| Chat context, answer snapshot, source trace | MIABOS internal (M09/M10) | Read | Context được đóng gói khi tạo escalation |
| Escalation destination: task/ticket system | Lark (workflow) | Write | Destination chính theo BQ pack — "Data Lark" |
| Fallback destination nếu Lark chưa sẵn sàng | Email / Internal queue | Write | Fallback cho phase 1 nếu Lark integration chưa có |
| Escalation ticket reference | MIABOS internal DB | Write | MIABOS lưu reference, không mirror full ticket |

## 1. User Story

Là người dùng nội bộ hoặc AI, tôi muốn tạo escalation nhanh khi câu trả lời chưa đủ chắc chắn hoặc cần người xử lý tiếp.

## 1A. User Task Flow

| Step | User Role | Action | Task Type | Notes |
|------|-----------|--------|-----------|-------|
| 1 | User / AI | Chọn tạo escalation từ answer hiện tại | Exception Handling | Entry |
| 2 | Hệ thống | Đóng gói context hội thoại, source, actor, reason | Quick Action | Payload |
| 3 | User / Assignee | Theo dõi trạng thái ticket/handoff | Reporting | Follow-up |

## 2. Business Context

BQ pack nhắc đến Lark như một hướng triển khai chiến lược ("Data Lark"). Với hơn 200 cửa hàng và nhiều phòng ban, khi AI không trả lời được hoặc trả lời chưa chắc chắn, người dùng cần một lối thoát rõ ràng để chuyển sang người thật xử lý — không để dead-end. Escalation là module bắt buộc để AI đáng tin cậy trong vận hành thực tế: user phải thấy rằng khi AI không chắc, vẫn có người tiếp quản.

## 3. Preconditions

- `M09/M10` đã tạo ra answer snapshot và context để đóng gói vào escalation.
- Destination workflow đã được xác định: Lark task (ưu tiên) hoặc internal queue (fallback phase 1).
- Assignment rule tối thiểu đã được config: escalate cho ai theo loại domain (inventory → Logistics, pricing → Finance, policy → phòng tương ứng).

## 4. Postconditions

- Escalation được tạo với đủ context để assignee xử lý mà không cần hỏi lại từ đầu.
- User biết escalation đã được gửi đi và có thể theo dõi trạng thái.

## 5. Main Flow

1. User hoặc AI trigger escalation từ answer card (manual) hoặc tự động khi confidence thấp (auto).
2. Hệ thống đóng gói: `câu hỏi gốc`, `answer đã trả`, `source context`, `warning`, `actor`, `domain`.
3. Hệ thống resolve assignee theo `assignment_rule`: domain → phòng ban / người phụ trách.
4. Hệ thống tạo task trong Lark (hoặc internal queue nếu Lark chưa sẵn sàng) với full context.
5. Hệ thống ghi `escalation_ticket_ref` trong MIABOS — reference tới external ticket.
6. User nhận confirmation: "escalation đã gửi, assignee là X, bạn có thể theo dõi tại Y".
7. Assignee xử lý và update status — MIABOS sync về `escalation_ticket_ref`.

## 6. Alternate Flows

- Auto escalation: M09 tự trigger khi answer confidence < threshold, không cần user bấm.
- Manual escalation: user chủ động tạo dù answer đã có nhưng chưa tin.
- External ticketing (phase 2): route sang hệ thống ticket ngoài nếu cần (ví dụ: CSKH complaint system).

## 7. Error Flows

- Lark destination unavailable → fallback sang internal queue, notify Admin.
- Assignment rule không match domain → escalate về queue default của IT/Ops, ghi warning.
- Duplicate escalation (cùng context được gửi 2 lần) → detect và de-duplicate, trả reference cũ cho user.

## 8. State Machine

`Draft -> Submitted -> Assigned -> In Progress -> Resolved -> Closed`

## 9. UX / Screen Behavior

- Escalation compose drawer phải pre-fill context từ chat: câu hỏi, answer, domain, source.
- User chỉ cần thêm "lý do escalation" nếu muốn — không bắt buộc điền lại từ đầu.
- Sau khi submit, hiển thị: "Đã gửi cho [assignee/phòng ban]. Theo dõi tại [link]."
- Nếu auto escalation: banner nhỏ trong chat "Câu hỏi này đã được chuyển tiếp tự động cho [phòng ban]."

## 10. Role / Permission Rules

- `Mọi user nội bộ`: có thể tạo manual escalation từ chat.
- `PM / Ops (Ban điều hành)`: xem escalation queue toàn bộ và assign lại.
- `Assignee (phòng ban được giao)`: xem và update status escalation của mình.
- `IT / ERP / data`: xem full audit trail của escalation routing.
- Lark task chỉ visible cho user được assign — không expose toàn bộ nội bộ.

## 11. Business Rules

- Escalation phải có đủ 4 trường: `reason` (hoặc auto-generated), `context snapshot`, `source trace`, `actor` — không cho phép tạo empty escalation.
- MIABOS lưu `escalation_ticket_ref` — không mirror full ticket payload từ Lark.
- Auto escalation chỉ được trigger khi answer confidence < threshold được config — không tự động với mọi answer.
- Duplicate escalation (cùng `session_id` + `question_hash`) trong vòng 30 phút phải bị detect và de-duplicate.
- Assignee được xác định theo `assignment_rule` + domain — nếu không map được, fallback về queue default, không được fail silently.

## 12. API Contract Excerpt + Canonical Links

- `POST /mia/escalations`: tạo escalation
  - Input: `session_id`, `answer_id`, `reason`, `domain`, `actor`, `escalation_type` (manual/auto)
  - Output: `escalation_id`, `assignee`, `destination_ref`, `status`
- Canonical links:
  - Reads context from `F-M09-AIC-001`, `F-M10-SLS-001`
  - Writes to Lark task (or internal queue fallback)
  - Feeds `F-M12-OBS-001` cho escalation metrics

## 13. Event / Webhook Contract Excerpt + Canonical Links

- `mia.chatbot.escalation_created`: phát khi escalation được tạo.
- `escalation.assigned`: phát khi assignee được xác định và task được gửi.
- `escalation.status_updated`: phát khi Lark/destination cập nhật trạng thái.

## 14. Data / DB Impact Excerpt + Canonical Links

- `escalation_ticket_ref`: MIABOS-side reference — `escalation_id`, `destination_ref`, `status`, `assignee`, `created_at`, `context_snapshot`
- Destination: Lark task (write) hoặc internal queue table (fallback)

## 15. Validation Rules

- Escalation không hợp lệ nếu thiếu `context_snapshot` hoặc `actor`.
- Duplicate detection phải chạy trước khi ghi vào `escalation_ticket_ref`.
- `destination_ref` phải được ghi lại sau khi Lark xác nhận tạo task — không ghi trước.

## 16. Error Codes

- `ESC-001`: Escalation routing failed — destination không nhận được task.
- `ESC-002`: Assignment rule không match — fallback queue được dùng.
- `ESC-003`: Duplicate escalation detected.

## 17. Non-Functional Requirements

- `POST /mia/escalations` phải trả confirmation trong `<= 3 giây` (bao gồm Lark API call).
- Escalation delivery đến Lark phải có retry với tối thiểu 3 attempts trước khi fallback.
- `escalation_ticket_ref` phải được giữ tối thiểu `180 ngày` cho audit.
- Duplicate detection window: `30 phút` cho cùng `session_id` + `question_hash`.

## 18. Acceptance Criteria

- User tạo manual escalation từ chat answer và nhận confirmation với tên assignee và link theo dõi.
- Auto escalation được trigger khi answer confidence < threshold và user thấy banner trong chat.
- Duplicate escalation trong 30 phút bị detect và trả reference cũ thay vì tạo mới.
- Escalation thiếu context_snapshot bị reject với lý do rõ.

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
