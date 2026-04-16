# MIABOS Planning Index

**Status**: Approved
**Owner**: A01 PM Agent
**Last Updated By**: Codex CLI (GPT-5.4 Codex environment)
**Last Reviewed By**: A01 PM Agent
**Approval Required**: PM
**Approved By**: A01 PM Agent
**Last Status Change**: 2026-04-16
**Source of Truth**: Entry point for project planning artifacts
**Blocking Reason**: -

---

## Purpose

Folder này chứa các planning artifacts của project `MIABOS`, trả lời câu hỏi `what ships when`, `release slice nào đi trước`, và `dependency nào cần chốt` trước khi sang design / build.

## Current Structure

| Folder | Purpose | Status |
|--------|---------|--------|
| [`PRD/Knowledge_Center/`](./PRD/Knowledge_Center/_index.md) | Bộ PRD cho surface `Knowledge_Center` | Draft |
| [`PRD/AI_Workspace/`](./PRD/AI_Workspace/_index.md) | PRD cho AI Workspace feature slices đang mở preview | Approved |
| [`PRD/Insights_And_Performance/`](./PRD/Insights_And_Performance/_index.md) | PRD cho Dashboard / Business Analytics preview | Approved |
| [`Backlog/`](./Backlog/Product_Backlog.md) | Product Backlog và Sprint Backlog cho delivery slices | Approved |
| [`Stories/AI_Workspace/`](./Stories/AI_Workspace/US-M09-AIC-001_Internal_AI_Chat.md) | User Stories cho AI Workspace | Approved |
| [`Stories/Insights_And_Performance/`](./Stories/Insights_And_Performance/US-M14-BIZ-001_Business_Analytics_And_ROI.md) | User Stories cho Dashboard / Analytics | Approved |
| [`Subtask_Boards/`](./Subtask_Boards/STB-M10-SLS-001_Sales_Advisor_AI_FE_Preview.md) | Execution board cho FE Preview | Approved |
| [`Subtask_Boards/`](./Subtask_Boards/STB-M09-AIC-001_Internal_AI_Chat_FE_Preview.md) | Execution board cho FE preview `F-M09-AIC-001 Internal AI Chat` | Approved |
| [`Subtask_Boards/`](./Subtask_Boards/STB-M14-BIZ-001_Business_Analytics_And_ROI_FE_Preview.md) | Execution board cho Dashboard FE preview `F-M14-BIZ-001` | In Review |

## Operating Notes

- `Planning/` là lớp product planning do `A02 Product Owner Agent` dẫn dắt, nhưng được PM mở và kiểm soát gate.
- PRD không thay thế `Feature SRS`; PRD trả lời `why / for whom / outcome`, còn SRS trả lời `behavior / rules / states`.
- `F-M09-AIC-001`, `F-M10-SLS-001`, và `F-M14-BIZ-001` hiện có đủ PRD -> Backlog -> Sprint Backlog -> User Story -> SRS Ready -> UXUI Approved -> Subtask Board để A07 thực hiện hoặc review FE Preview bằng mock/stub data.
- BE/integration vẫn bị chặn cho đến khi FE Preview được review và Integration Spec được approved.
- `M09` đã có preview `/ai/chat` cần Business Owner review; `M14` đã có Dashboard FE Preview reviewable tại `/analytics/executive`; `M10` đang mở cho A07 build/review preview theo STB tương ứng.
- Theo quyết định Business Owner mới nhất, backend/integration không mở cho tới khi toàn bộ frontend được hoàn tất và Business Owner cho phép.
