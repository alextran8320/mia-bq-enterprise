# User Story: Internal AI Chat FE Preview

**Status**: Approved
**Owner**: [[A03_BA_Agent]]
**Last Updated By**: Codex CLI (GPT-5 Codex)
**Last Reviewed By**: A01 PM Agent
**Approval Required**: BA Agent + PM Agent
**Approved By**: A03 BA Agent / A01 PM Agent
**Last Status Change**: 2026-04-16
**Source of Truth**: This file for one user story and its acceptance criteria.
**Blocking Reason**: FE Preview vẫn bị khóa cho đến khi UXUI được Approved; story này chỉ approve cho planning / design chain

---

## Story Identity

- `Story ID`: `US-M09-AIC-001`
- `Feature ID`: `F-M09-AIC-001`
- `Backlog ID`: `PBI-M09-AIC-001`
- `Epic`: `EP-M09-AIC`
- `Module`: `AI Workspace`
- `Sprint`: `SPR-M09-AIC-001`
- `Owner`: `A03 BA Agent`
- `Primary Delivery Owner`: `A06 UI/UX Agent`
- `Linked Subtask Board`: [STB-M09-AIC-001_Internal_AI_Chat_FE_Preview.md](../../Subtask_Boards/STB-M09-AIC-001_Internal_AI_Chat_FE_Preview.md)

## User Story

`Là nhân viên nội bộ Giày BQ, tôi muốn hỏi MIABOS bằng tiếng Việt tự nhiên và nhận câu trả lời có nguồn rõ, freshness, warning, và bước tiếp theo, để tôi không phải mở nhiều hệ thống hoặc hỏi nhiều người cho cùng một thông tin.`

## User Problem

- Hiện user phải tự ghép câu trả lời từ nhiều hệ thống và nhiều người.
- User không biết câu trả lời là policy, data, mixed, hay blocked nếu UI không nói rõ.
- Nếu source trace và warning không hiển thị đúng, người dùng sẽ không tin answer card.

## Trigger

- Khi nhân viên nội bộ cần kiểm tra policy, SOP, tồn kho, đơn hàng, CTKM, hoặc câu hỏi mixed giữa data và policy trong lúc đang làm việc.

## Happy Path

1. User mở `/ai/chat` và nhập câu hỏi bằng tiếng Việt tự nhiên.
2. Hệ thống trả answer card đúng type, có kết luận rõ, freshness, warning nếu cần, và next action.
3. User mở source trace hoặc chọn escalate nếu cần xác minh thêm.

## Scope

### In Scope

- Chat shell nội bộ
- Answer card cho `Policy`, `Data`, `Mixed`, `Blocked`
- Source trace panel, freshness chip, warning badge
- Escalation CTA và feedback UI level

### Out of Scope

- Real backend integration
- Answer history / trust review screen
- Human handoff workflow chi tiết
- Sales advisor external surface

## Preconditions

- `F-M09-AIC-001` SRS đã ở trạng thái `SRS Ready`
- UXUI artifact đã canonicalized nhưng vẫn `Blocked` do chưa có mockup PNG + formal approval
- `M07`, `M08`, `M11` vẫn là downstream dependencies, không bị invent thêm contract mới

## Acceptance Criteria

| AC ID | Scenario | Given | When | Then |
|-------|----------|-------|------|------|
| AC-01 | Hỏi policy | User nội bộ hỏi policy hoặc SOP | Submit câu hỏi | Hệ thống trả answer type `Policy` với citation hợp lệ và freshness rõ |
| AC-02 | Hỏi data | User hỏi dữ liệu vận hành như tồn kho, đơn hàng, giá | Submit câu hỏi | Hệ thống trả answer type `Data` với source trace và warning nếu source cũ |
| AC-03 | Hỏi mixed | User hỏi câu kết hợp data và policy | Submit câu hỏi | UI tách rõ phần `Data` và phần `Policy` trong cùng một answer card |
| AC-04 | Bị block | User không đủ quyền hoặc query ngoài scope | Submit câu hỏi | Hệ thống hiển thị blocked state với lý do an toàn và next action |
| AC-05 | Xem nguồn | User mở source trace | Click source trace | User thấy citation, freshness, và trust signal mà không cần đọc raw JSON |
| AC-06 | Escalate | Answer chưa đủ chắc chắn | Click escalate hoặc follow-up | Hệ thống cho phép chuyển sang bước tiếp theo thay vì dead-end |

## Success Hypothesis

- `Primary User Value`: Giảm thời gian tìm câu trả lời và giảm phụ thuộc vào đồng nghiệp.
- `Primary Business Value`: Tăng độ tin cậy của AI Workspace trong pilot BQ.
- `Failure Risk If Weak`: User bỏ qua AI Workspace và quay lại hỏi thủ công.

## Feature Metrics

| Metric Type | Metric Name | Formula | Measurement Window | Owner | Notes |
|-------------|-------------|---------|--------------------|-------|------|
| Adoption | Query completion rate | `completed_queries / submitted_queries` | Pilot | A10 | Đo mức dùng thực tế |
| Task Success | No-dead-end rate | `sessions_with_valid_next_action / total_sessions` | Weekly | A01 | Bao gồm escalate / follow-up |
| Business Outcome Proxy | Citation coverage | `answers_with_valid_citation / policy_or_mixed_answers` | Weekly | A03 | Chỉ áp cho Policy/Mixed |
| Guardrail | Blocked clarity rate | `blocked_answers_with_clear_reason / blocked_answers` | Weekly | A06 | Không được mập mờ |
| Data Quality | Freshness visibility rate | `answers_with_visible_freshness / total_answers` | Weekly | A05 | Bắt buộc có freshness cho data/mixed |

## Required Tracking Events

| Event Name | Trigger | Required Properties | Notes |
|------------|---------|---------------------|------|
| `mia.chat.answer_rendered` | Answer card hiển thị | `story_id`, `feature_id`, `answer_type`, `has_citation` | Tracking chính |
| `mia.chat.source_trace_opened` | User mở source trace | `answer_id`, `source_count`, `freshness_state` | Trust signal |
| `mia.chat.escalation_clicked` | User chọn escalate | `reason_code`, `answer_type`, `role` | Fallback path |
| `mia.chat.feedback_submitted` | User gửi feedback | `feedback_type`, `answer_id`, `comment` | Learning loop |

## Delivery Ownership

| Workstream | Primary Agent | Accountable Agent | Notes |
|------------|---------------|-------------------|-------|
| Product / Scope | [[A02_Product_Owner_Agent]] | [[A01_PM_Agent]] | |
| Requirements / AC | [[A03_BA_Agent]] | [[A01_PM_Agent]] | |
| Technical Design | [[A05_Tech_Lead_Agent]] | [[A01_PM_Agent]] | |
| UX / Design Validation | [[A06_UI_UX_Agent]] | [[A01_PM_Agent]] | |
| Frontend Build | [[A07_FE_Builder_Agent]] | [[A01_PM_Agent]] | |
| Backend Build | [[A08_BE_Builder_Agent]] | [[A01_PM_Agent]] | |
| QA / Verification | [[A09_QA_Agent]] | [[A01_PM_Agent]] | |

## Planned Subtasks

| Subtask ID | Workstream | Description | Primary Agent | Depends On |
|------------|------------|-------------|---------------|------------|
| ST-M09-AIC-001-01 | PM | Chốt scope, release slice, và gate readiness cho `F-M09-AIC-001` | A01 | — |
| ST-M09-AIC-001-02 | BA | Refine behavior rules, AC, và open questions cho answer type / source trace / blocked state | A03 | ST-M09-AIC-001-01 |
| ST-M09-AIC-001-03 | UX | Duyệt layout, states, và interaction contract từ SRS / story | A06 | ST-M09-AIC-001-02 |
| ST-M09-AIC-001-04 | FE | Build FE Preview bằng mock / stub data בלבד | A07 | ST-M09-AIC-001-03 |
| ST-M09-AIC-001-05 | PM / Review | Review FE Preview và fold feedback trở lại story / SRS / UXUI | A01 | ST-M09-AIC-001-04 |

## Linked Artifacts

- Feature SRS: [F-M09-AIC-001_Internal_AI_Chat_SRS.md](../../../Analysis/Features/Modules/AI_Workspace/Internal_AI_Chat/SRS/F-M09-AIC-001_Internal_AI_Chat_SRS.md)
- PRD: [PRD-M09-AIC-001_Internal_AI_Chat.md](../../PRD/AI_Workspace/PRD-M09-AIC-001_Internal_AI_Chat.md)
- Design: [UXUI-F-M09-AIC-001_Internal_AI_Chat.md](../../../Design/UXUI_Features/UXUI-F-M09-AIC-001_Internal_AI_Chat.md)
- Planning: [Product_Backlog.md](../../Backlog/Product_Backlog.md), [Sprint_Backlog.md](../../Backlog/Sprint_Backlog.md)
- Subtask Board: [STB-M09-AIC-001_Internal_AI_Chat_FE_Preview.md](../../Subtask_Boards/STB-M09-AIC-001_Internal_AI_Chat_FE_Preview.md)

## Notes

- Story này được A02/A01 approve cho planning và design chain, không phải fake Business Owner sign-off cho PRD.
- FE Preview chỉ được mở sau khi UXUI được Approved thật.
- Khi backend / integration work bắt đầu, story này phải được nối lại với SRS `Build Ready` và integration contracts tương ứng.
- Local spike preview đã được materialize tại route `/ai/chat` trong `Build/Frontend_App` bằng mock data để review flow nội bộ; spike này không thay thế gate canonical.
