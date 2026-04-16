# Feature SRS: F-M09-AIC-003 Escalation Trigger and Human Handoff

**Status**: SRS Ready
**Owner**: A03 BA Agent
**Last Updated By**: Claude Code (claude-sonnet-4-6)
**Last Reviewed By**: A01 PM Agent
**Approval Required**: PM
**Approved By**: A01 PM Agent — Promoted to SRS Ready 2026-04-16; trigger matrix + routing specifics deferred to BE/integration phase per BQ pilot scope decision
**Last Status Change**: 2026-04-16
**Source of Truth**: This document
**Blocking Reason**: -
**Module**: M09
**Phase**: PB-02 / PB-03
**Priority**: High
**Document Role**: SRS canonical cho trigger escalation và human handoff từ `Internal AI Chat`

---

## 0. Metadata

- Feature ID: `F-M09-AIC-003`
- Related User Story: `US-M09-AIC-003`
- Related PRD: `-`
- Related Screens: escalation CTA, handoff confirmation, escalation detail, unrouted state, resolution sync state
- Related APIs: `POST /mia/chat/escalate`, `GET /mia/chat/escalations/:id`, `POST /mia/chat/escalations/:id/reassign`
- Related Tables: `chat_escalation`, `chat_escalation_assignment`, `chat_escalation_resolution`, `chat_audit_log`
- Related Events: `mia.chat.escalation.triggered`, `mia.chat.escalation.assigned`, `mia.chat.escalation.unrouted`, `mia.chat.escalation.resolved`
- Related Error IDs: `AIC-005`, `AIC-006`, `AIC-007`, `AIC-012`

## 0B. Integration Source Map

| Source System / Module | Data / Workflow Used | Usage In This Feature | Truth Level | Notes |
|------------------------|----------------------|-----------------------|-------------|-------|
| `F-M09-AIC-001` | Question/answer/source/warning snapshot | Payload nguồn cho escalation | Primary source | Không được rebuild payload từ live state |
| `M11 Workflow / Case Handling` | Assignment, SLA, resolution workflow | Đích chính của handoff | Primary workflow target | Không tạo case song song rời rạc |
| `M07 Security / Access` | Scope masking | Kiểm soát nội dung được gửi cho người nhận | Gatekeeper | Payload phải respect sensitivity |
| `M08 Knowledge Center` | Knowledge gap reference | Link back khi escalation do missing knowledge | Supporting source | Giúp tạo feedback loop |
| `M12 Observability` | Escalation analytics | Consume trigger/assignment/resolution metrics | Analytics consumer | Dùng cho unresolved backlog |

## 1. User Story

Là user nội bộ, `PM Governance`, `CSKH Team Lead`, hoặc `IT / ERP / data`, tôi muốn AI trigger escalation đúng lúc và gửi đủ ngữ cảnh cho người xử lý để các câu hỏi không chắc chắn, bị block, hoặc thiếu source được giải quyết nhanh mà không phải hỏi lại từ đầu.

## 1A. User Task Flow

| Step | User Role | Action | Task Type | Notes |
|------|-----------|--------|-----------|-------|
| 1 | Hệ thống / User | Trigger escalation do `low confidence`, `missing knowledge`, `permission block`, `user requested human` | Exception Handling | Entry |
| 2 | Hệ thống | Đóng gói question, answer snapshot, source trace, warning, role, branch, reason code | Configuration | Packaging |
| 3 | Hệ thống | Tìm destination theo domain/branch/team rule hoặc chuyển trạng thái `Unrouted` | Quick Action | Routing |
| 4 | Ops / Team Lead | Xem escalation, assign/reassign cho người xử lý phù hợp | Quick Action | Assignment |
| 5 | Người xử lý | Xem ngữ cảnh, phản hồi, và resolve case | Quick Action | Resolution |
| 6 | Hệ thống | Đồng bộ trạng thái resolve ngược về AI Workspace và analytics | Reporting | Closure |

## 2. Business Context

Trong pilot BQ, chatbot nội bộ chắc chắn sẽ gặp các câu hỏi vượt scope hoặc chưa đủ source. Nếu không có escalation path rõ, người dùng sẽ coi chatbot như dead-end. Escalation feature tồn tại để biến `AI không chắc` thành `case có owner`, đặc biệt cho các nhóm `CSKH`, `Ecommerce`, `pricing control`, và `IT / ERP / data` khi câu hỏi chạm ngoại lệ nghiệp vụ hoặc dữ liệu không đồng nhất.

## 3. Preconditions

- `F-M09-AIC-001` có answer snapshot, confidence/warning signals, blocked reason nếu có.
- `M11` hoặc workflow engine đích đã tồn tại.
- Có routing matrix tối thiểu theo `domain`, `branch`, `team`.

## 4. Postconditions

- Mọi escalation có reason code, payload đầy đủ, và destination status rõ.
- Người xử lý nhận được đủ context để không phải hỏi lại câu ban đầu.
- Resolution sync ngược về AI layer để phục vụ learning loop.

## 5. Main Flow

1. AI hoặc user trigger escalation từ answer card.
2. Hệ thống validate reason code và đóng gói `question`, `answer snapshot`, `source snapshot`, `warning`, `actor role`, `branch/channel scope`.
3. Hệ thống tra routing matrix để tìm `team`, `owner`, `priority`, `SLA`.
4. Nếu tìm thấy destination, escalation được tạo ở trạng thái `Assigned`; nếu không, trạng thái `Unrouted`.
5. `Ops / Team Lead` xem case, assign/reassign cho người xử lý thực tế.
6. Người xử lý cập nhật trạng thái `In Progress`, sau đó `Resolved` hoặc `Rejected`.
7. Hệ thống đồng bộ resolution về AI Workspace và update analytics/escalation history.

## 6. Alternate Flows

- User tự bấm `Cần người hỗ trợ` dù answer không bị blocked.
- Hệ thống auto-trigger vì `low confidence` hoặc `missing knowledge`.
- Escalation được reassign giữa `CSKH`, `Ecommerce`, và `IT / ERP / data` do domain mismatch.
- Resolution tạo thêm knowledge gap item cho `M08`.

## 7. Error Flows

- Trigger matrix chưa rõ khiến hệ thống không biết khi nào phải auto-escalate.
- Routing matrix không tìm thấy owner phù hợp.
- Payload thiếu source snapshot hoặc branch context.
- Workflow engine nhận case nhưng không trả trạng thái assignment/resolution ngược lại.

## 8. State Machine

`Triggered -> Packaged -> Routed / Unrouted -> Assigned -> In Progress -> Resolved / Rejected`

## 9. UX / Screen Behavior

- Escalation CTA phải nêu lý do vì sao AI đề xuất escalation.
- Confirmation modal phải hiển thị `reason`, `what will be sent`, `destination status`.
- Nếu case `Unrouted`, UI phải nói rõ `đã ghi nhận nhưng chưa xác định được người xử lý`.
- Detail view cho người xử lý phải tập trung vào `question`, `answer snapshot`, `source`, `warning`, `reason code`, `priority`.

## 10. Role / Permission Rules

- `User nội bộ`: được trigger escalation trong scope domain họ đang hỏi.
- `CSKH Team Lead`: nhận/assign escalation liên quan complaint, order service, đổi trả.
- `Ecommerce / omnichannel Lead`: nhận escalation liên quan online order, channel operations.
- `IT / ERP / data`: nhận escalation technical, source mismatch, data inconsistency.
- `PM Governance`: xem toàn bộ escalation, override reroute khi cần.
- Payload gửi cho người nhận vẫn phải chịu masking/sensitivity rule từ `M07`.

## 11. Business Rules

- Escalation phải dùng reason code chuẩn trong tập `Low Confidence`, `Out Of Scope`, `Permission Block`, `Missing Knowledge`, `Source Conflict`, `User Requested Human`.
- Handoff payload phải giữ snapshot tại thời điểm answer được tạo; không được refetch live data rồi thay thế im lặng.
- Nếu routing không tìm thấy destination, escalation vẫn phải được tạo với trạng thái `Unrouted` thay vì fail silent.
- Nếu answer bị `Permission Block`, payload gửi cho người xử lý vẫn phải giữ sensitivity boundary theo role nhận case.
- Escalation từ `Internal AI Chat` phải map được sang case/workflow của `M11`; không tạo hệ thống tracking tách rời khó audit.
- Khi resolution xác định là `Missing Knowledge`, hệ thống phải để lại dấu vết cho backlog/gap loop của `M08`.

## 12. API Contract Excerpt + Canonical Links

- `POST /mia/chat/escalate`
  - Input: `answer_id`, `reason_code`, `requester_role`, `note`, `branch_scope`
  - Output: `escalation_id`, `routing_status`, `assigned_team`, `sla_due_at`
- `GET /mia/chat/escalations/:id`
  - Output: payload, assignment, resolution history, workflow link
- `POST /mia/chat/escalations/:id/reassign`
  - Input: `target_team`, `target_owner`, `note`
- Downstream:
  - Write to `M11`
  - Read by `F-M09-AIC-002`
  - Feed metrics to `F-M12-OBS-001`

## 13. Event / Webhook Contract Excerpt + Canonical Links

- `mia.chat.escalation.triggered`: khi escalation được tạo.
- `mia.chat.escalation.assigned`: khi assignment thành công.
- `mia.chat.escalation.unrouted`: khi chưa tìm ra destination.
- `mia.chat.escalation.resolved`: khi workflow đích đóng case.

## 14. Data / DB Impact Excerpt + Canonical Links

- `chat_escalation`
  - `answer_id`, `reason_code`, `routing_status`, `priority`, `requester_role`
- `chat_escalation_assignment`
  - `assigned_team`, `assigned_owner`, `assigned_at`, `sla_due_at`, `reassignment_count`
- `chat_escalation_resolution`
  - `resolution_type`, `resolution_note`, `resolved_by`, `resolved_at`
- `chat_audit_log`
  - Trigger, routing, reassign, resolution sync events
- Canonical links:
  - Payload nguồn từ `chat_answer_snapshot`
  - Destination engine ở `M11`

## 15. Validation Rules

- Escalation chỉ hợp lệ khi answer snapshot và reason code tồn tại.
- Assignment chỉ hợp lệ nếu destination owner/team còn active.
- `Unrouted` case phải hiện trong queue quản trị, không được biến mất khỏi tracking.
- Resolution sync về AI Workspace phải map đúng `escalation_id` và `answer_id`.

## 16. Error Codes

- `AIC-005`: Escalation trigger failed.
- `AIC-006`: Escalation routing destination not found.
- `AIC-007`: Escalation payload incomplete.
- `AIC-012`: Escalation resolution sync failed.

## 17. Non-Functional Requirements

- Escalation creation phải hoàn tất trong `<= 3 giây` sau khi user bấm CTA.
- Assignment status phải phản ánh về AI Workspace trong `<= 30 giây`.
- `Unrouted` và `SLA breach` metrics phải lên dashboard trong `<= 5 phút`.
- Escalation records và audit trail phải giữ tối thiểu `180 ngày`.

## 18. Acceptance Criteria

- User hoặc hệ thống trigger được escalation với reason code chuẩn và tạo được record.
- Payload handoff chứa đủ `question`, `answer snapshot`, `source trace`, `warning`, `actor context`.
- Nếu routing fail, case vẫn tồn tại ở trạng thái `Unrouted` và hiển thị rõ cho PM/Ops.
- Escalation assign/reassign được sang đúng team hoặc owner, và resolution sync ngược về AI Workspace.
- Escalation do `Missing Knowledge` để lại dấu vết cho loop cải thiện knowledge.

## 19. Test Scenarios

- Auto-trigger escalation do `Low Confidence`.
- Manual escalation do `User Requested Human`.
- Routing fail và xác minh `Unrouted`.
- Reassign giữa hai team khác nhau.
- Resolution sync từ workflow engine về AI Workspace.

## 20. Observability

- Theo dõi `trigger rate`, `unrouted rate`, `assignment lag`, `SLA breach rate`, `top escalation reasons`, `resolution turnaround`.

## 21. Rollout / Feature Flag

- Bật ngay từ pilot phase 1 để tránh dead-end.
- Auto-trigger rules bật dần sau khi PM chốt trigger matrix.

## 22. Open Questions

- Trigger matrix phase 1 sẽ dựa trên threshold nào?
- Destination routing ưu tiên `domain`, `branch`, hay `team owner` trước?
- Resolution nào cần tự động tạo knowledge gap hoặc bug follow-up?

## 23. Definition of Done

- AI Workspace có đường thoát rõ ràng từ answer không chắc chắn sang case có owner và được theo dõi đầy đủ.

## 24. Ready-for-UXUI Checklist

- [ ] UXUI đã chốt escalation CTA, confirmation, unrouted state, detail view, resolution sync state

## 25. Ready-for-FE-Preview Checklist

- [ ] FE Preview có mock `manual trigger`, `auto trigger`, `assigned`, `unrouted`, `resolved`
- [ ] Stub payload đủ `reason_code`, `routing_status`, `assigned_team`, `sla_due_at`, `warning_snapshot`

## 26. Ready-for-BE / Integration Promotion Checklist

- [ ] Contract giữa `M09` và `M11` cho trigger/routing/reassign/resolution đã rõ
- [ ] Routing matrix, masking, and gap-feedback behavior đã rõ
