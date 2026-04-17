# User Story: US-M09-AIC-001 Internal AI Chat

**Status**: Approved
**Owner**: A03 BA Agent
**Last Updated By**: Codex CLI (GPT-5.4 Codex environment)
**Last Reviewed By**: A01 PM Agent
**Approval Required**: PM Agent
**Approved By**: A01 PM Agent - FE Preview scope approved with mock/stub data
**Last Status Change**: 2026-04-17
**Source of Truth**: This file is the canonical user story for `F-M09-AIC-001`; the previous `_FE_Preview` duplicate has been removed.
**Blocking Reason**: -

---

## 1. Story Identity

- `Story ID`: `US-M09-AIC-001`
- `Feature ID`: `F-M09-AIC-001`
- `Backlog ID`: `PBI-M09-AIC-001`
- `Epic`: `EP-AI-OPS`
- `Module`: `M09 AI Workspace`
- `Sprint`: `FE-Preview-01`
- `Priority`: `P0`
- `Product`: `MIA Smart`
- `Release Slice`: FE Preview with mock/stub data
- `Primary Delivery Owner`: `A07 FE Builder`
- `Linked Subtask Board`: [STB-M09-AIC-001_Internal_AI_Chat_FE_Preview.md](../../Subtask_Boards/STB-M09-AIC-001_Internal_AI_Chat_FE_Preview.md)

## 2. User Story

Là nhân viên nội bộ Giày BQ, tôi muốn hỏi MIABOS bằng tiếng Việt tự nhiên và nhận câu trả lời có nguồn rõ, freshness, warning, và bước tiếp theo, để tôi không phải mở nhiều hệ thống hoặc hỏi nhiều người cho cùng một thông tin.

## 3. User Problem

- Nhân viên BQ cần hỏi nhanh về tồn kho, chính sách, CTKM, đơn online, và thao tác hệ thống nhưng dữ liệu nằm rải ở SAP B1, KiotViet, Haravan, Excel, Knowledge Center, và người phụ trách nội bộ.
- User không biết câu trả lời là `Policy`, `Data`, `Mixed`, hay `Blocked` nếu UI không nói rõ.
- Nếu source trace, freshness, và warning không hiển thị đúng, người dùng sẽ không tin answer card và quay lại hỏi thủ công.

## 4. Trigger

Khi nhân viên nội bộ đang xử lý khách hoặc vận hành nội bộ và cần câu trả lời ngay trong chat.

## 5. Happy Path

1. User mở `/ai/chat`.
2. User nhập câu hỏi bằng tiếng Việt tự nhiên.
3. FE Preview render loading state và mock answer card phù hợp.
4. User đọc kết luận, answer type, freshness, warning, và source summary.
5. User mở source trace hoặc chọn next action/escalation nếu cần.

## 6. Scope

### In Scope

- Chat shell nội bộ tại route `/ai/chat`.
- Answer card cho `Policy`, `Data`, `Mixed`, `Blocked`, và `Unsupported`.
- Source trace panel, freshness chip, warning badge.
- Escalation CTA, feedback UI, và suggested follow-up action.
- Mock/stub data đủ để review flow và trust layer.

### Out of Scope

- Real backend endpoint calls.
- Production source priority giữa SAP B1, KiotViet, Haravan, Excel.
- Production escalation routing.
- Final Business Owner approval cho integration behavior.
- Promote SRS lên `Build Ready`.

## 7. Dependencies

- `F-M09-AIC-001` SRS is `SRS Ready`.
- `UXUI-F-M09-AIC-001` is `Approved` for FE Preview.
- `STB-M09-AIC-001` controls A07 execution/review scope.
- Product Backlog and Sprint Backlog list this story as `Ready for Review`.
- Backend/integration is deferred until Integration Spec is approved.

## 8. Acceptance Criteria

| AC ID | Scenario | Given | When | Then |
| ----- | -------- | ----- | ---- | ---- |
| `AC-M09-AIC-001-01` | Hỏi policy | User nội bộ hỏi policy hoặc SOP | Submit câu hỏi | Answer card hiển thị type `Policy`, kết luận, citation/source summary, freshness, và next action |
| `AC-M09-AIC-001-02` | Hỏi data | User hỏi dữ liệu vận hành như tồn kho, đơn hàng, giá | Submit câu hỏi | Answer card hiển thị type `Data`, source trace, freshness, và warning nếu source cũ hoặc không chắc |
| `AC-M09-AIC-001-03` | Hỏi mixed | User hỏi câu kết hợp data và policy | Submit câu hỏi | UI tách rõ phần `Dữ liệu hiện tại` và `Chính sách áp dụng` trong cùng một answer card |
| `AC-M09-AIC-001-04` | Bị block/unsupported | User không đủ quyền hoặc query ngoài scope | Submit câu hỏi | UI hiển thị lý do blocked an toàn và có escalation/next-action path |
| `AC-M09-AIC-001-05` | Xem nguồn | User mở source trace | Click source trace | Source trace panel xuất hiện mà không thay thế hoặc làm mất chat thread |
| `AC-M09-AIC-001-06` | Warning/trust | Mock data stale hoặc conflict | Answer render | Warning hiển thị rõ và answer không ngầm thể hiện là fully trusted |
| `AC-M09-AIC-001-07` | Feedback/escalate | Answer chưa đủ chắc chắn | User chọn feedback hoặc escalation | UI ghi nhận lựa chọn và không để user rơi vào dead-end |

## 9. Success Hypothesis

| Type | Hypothesis |
| ---- | ---------- |
| Primary User Value | Giảm thời gian tìm câu trả lời và giảm phụ thuộc vào đồng nghiệp. |
| Primary Business Value | Tăng độ tin cậy của AI Workspace trong pilot BQ. |
| Failure Risk If Weak | User bỏ qua AI Workspace và quay lại hỏi thủ công. |

## 10. Feature Metrics

| Metric Type | Metric Name | Formula | Measurement Window | Owner | Notes |
| ----------- | ----------- | ------- | ------------------ | ----- | ----- |
| Adoption | Query completion rate | `completed_queries / submitted_queries` | Pilot | A10 | Đo mức dùng thực tế |
| Task Success | No-dead-end rate | `sessions_with_valid_next_action / total_sessions` | Weekly | A01 | Bao gồm escalate/follow-up |
| Business Outcome Proxy | Citation coverage | `answers_with_valid_citation / policy_or_mixed_answers` | Weekly | A03 | Chỉ áp cho Policy/Mixed |
| Guardrail | Blocked clarity rate | `blocked_answers_with_clear_reason / blocked_answers` | Weekly | A06 | Không được mập mờ |
| Data Quality | Freshness visibility rate | `answers_with_visible_freshness / total_answers` | Weekly | A05 | Bắt buộc có freshness cho Data/Mixed |

## 11. Required Tracking Events

| Event Name | Trigger | Required Properties | Notes |
| ---------- | ------- | ------------------- | ----- |
| `mia.chat.answer_rendered` | Answer card hiển thị | `story_id`, `feature_id`, `answer_type`, `has_citation` | Tracking chính |
| `mia.chat.source_trace_opened` | User mở source trace | `answer_id`, `source_count`, `freshness_state` | Trust signal |
| `mia.chat.escalation_clicked` | User chọn escalate | `reason_code`, `answer_type`, `role` | Fallback path |
| `mia.chat.feedback_submitted` | User gửi feedback | `feedback_type`, `answer_id`, `comment` | Learning loop |

## 12. Delivery Ownership

| Workstream | Primary Agent | Accountable Agent | Notes |
| ---------- | ------------- | ----------------- | ----- |
| Product / Scope | A02 Product Owner Agent | A01 PM Agent | PRD already Approved for FE Preview |
| Requirements / AC | A03 BA Agent | A01 PM Agent | This story is canonical |
| UX / Design Validation | A06 UI/UX Agent | A01 PM Agent | UXUI Approved for FE Preview |
| Frontend Preview | A07 FE Builder | A01 PM Agent | Mock/stub only |
| Backend / Integration | A08 BE Builder | A01 PM Agent | Blocked until reviewed FE Preview + Integration Spec |
| QA / Verification | A09 QA Agent | A01 PM Agent | After preview review decision |

## 13. Linked Artifacts

- PRD: [PRD-M09-AIC-001_Internal_AI_Chat.md](../../PRD/AI_Workspace/PRD-M09-AIC-001_Internal_AI_Chat.md)
- Feature SRS: [F-M09-AIC-001_Internal_AI_Chat_SRS.md](../../../Analysis/Features/Modules/AI_Workspace/Internal_AI_Chat/SRS/F-M09-AIC-001_Internal_AI_Chat_SRS.md)
- UXUI: [UXUI-F-M09-AIC-001_Internal_AI_Chat.md](../../../Design/UXUI_Features/UXUI-F-M09-AIC-001_Internal_AI_Chat.md)
- Product Backlog: [Product_Backlog.md](../../Backlog/Product_Backlog.md)
- Sprint Backlog: [Sprint_Backlog.md](../../Backlog/Sprint_Backlog.md)
- Subtask Board: [STB-M09-AIC-001_Internal_AI_Chat_FE_Preview.md](../../Subtask_Boards/STB-M09-AIC-001_Internal_AI_Chat_FE_Preview.md)

## 14. Readiness Decision

| Gate | Result | Notes |
| ---- | ------ | ----- |
| FE Preview Start Gate | Passed | PRD Approved, SRS Ready, UXUI Approved, STB exists, mock/stub scope explicit |
| Current Delivery State | Ready for Review | FE Preview exists at `/ai/chat`; Business Owner review decision is still pending |
| BE / Integration Gate | Blocked | Requires reviewed FE Preview, SRS `Build Ready`, and approved Integration Spec |
