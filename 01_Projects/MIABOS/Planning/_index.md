# MIABOS Planning Index

**Status**: Approved
**Owner**: A01 PM Agent
**Last Updated By**: Codex CLI (GPT-5.4 Codex environment)
**Last Reviewed By**: A01 PM Agent
**Approval Required**: PM
**Approved By**: A01 PM Agent
**Last Status Change**: 2026-04-21
**Source of Truth**: Entry point for project planning artifacts
**Blocking Reason**: -

---

## Purpose

Folder này chứa các planning artifacts của project `MIABOS`, trả lời câu hỏi `what ships when`, `release slice nào đi trước`, và `dependency nào cần chốt` trước khi sang design / build.

Canonical flow mới của project là:

`Raw Input -> Research -> PRD -> Features -> UX/UI by Screen`

## Current Structure

| Folder                                                                                                                 | Purpose                                                         | Status    |
| ---------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------- | --------- |
| [`PRD/Knowledge_Center/`](./PRD/Knowledge_Center/_index.md)                                                            | PRD workspace cho `Knowledge Center` dựa trên front-end source of truth | In Review |
| [`PRD/AI_Workspace/`](./PRD/AI_Workspace/_index.md)                                                                    | PRD backfill cho `Internal AI Chat` và `Sales Advisor AI` từ front-end hiện có | In Review |
| [`PRD/Insights_And_Performance/`](./PRD/Insights_And_Performance/_index.md)                                            | PRD backfill cho dashboard analytics routes đang có             | In Review |
| [`PRD/Catalog_And_Commerce/`](./PRD/Catalog_And_Commerce/_index.md)                                                    | Chưa có canonical PRD active; pilot demo đã bị gỡ              | Pending Rewrite |
| [`Backlog/`](./Backlog/Product_Backlog.md)                                                                             | Product Backlog và Sprint Backlog cho delivery slices           | Approved  |
| [`Stories/AI_Workspace/`](./Stories/AI_Workspace/US-M09-AIC-001_Internal_AI_Chat.md)                                   | User Stories cho AI Workspace                                   | Approved  |
| [`Stories/Insights_And_Performance/`](./Stories/Insights_And_Performance/US-M14-BIZ-001_Business_Analytics_And_ROI.md) | User Stories cho Dashboard / Analytics                          | Approved  |
| [`Subtask_Boards/`](./Subtask_Boards/STB-M10-SLS-001_Sales_Advisor_AI_FE_Preview.md)                                   | Execution board cho FE Preview                                  | Approved  |
| [`Subtask_Boards/`](./Subtask_Boards/STB-M09-AIC-001_Internal_AI_Chat_FE_Preview.md)                                   | Execution board cho FE preview `F-M09-AIC-001 Internal AI Chat` | Approved  |
| [`Subtask_Boards/`](./Subtask_Boards/STB-M14-BIZ-001_Business_Analytics_And_ROI_FE_Preview.md)                         | Execution board cho Dashboard FE preview `F-M14-BIZ-001`        | In Review |

## Operating Notes

- `Planning/` là lớp product planning do `A02 Product Owner Agent` dẫn dắt, nhưng được PM mở và kiểm soát gate.
- `Research` là input bắt buộc cho module mới hoặc rewrite lớn trước khi promote canonical `PRD`, `Feature Spec`, hoặc `UX/UI Screen` artifacts.
- PRD không thay thế `Feature Spec`; PRD trả lời `why / for whom / outcome`, còn Feature Spec trả lời `behavior / rules / states`.
- `UX/UI` canonical mới được quản lý theo `Sitemap + Flow Matrix + Screen Specs`, không còn xem một file `UXUI per feature` là định dạng đích duy nhất.
- Trong giai đoạn chuyển tiếp, các `Feature SRS` cũ được giữ như legacy artifacts cho đến khi từng module được migrate sang `Feature Spec Lite`.
- Với các module đã có front-end trước tài liệu, front-end là source of truth để backfill PRD; không suy diễn thêm scope ngoài những gì app đang materialize.
- BE/integration vẫn bị chặn cho đến khi FE Preview được review và Integration Spec được approved.
- Theo quyết định Business Owner mới nhất, backend/integration không mở cho tới khi toàn bộ frontend được hoàn tất và Business Owner cho phép.
