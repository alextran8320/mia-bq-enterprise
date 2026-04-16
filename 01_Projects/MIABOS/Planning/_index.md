# MIABOS Planning Index

**Status**: Draft
**Owner**: A01 PM Agent
**Last Updated By**: Codex CLI (GPT-5 Codex)
**Last Reviewed By**: A01 PM Agent
**Approval Required**: PM
**Approved By**: -
**Last Status Change**: 2026-04-15
**Source of Truth**: Entry point for project planning artifacts
**Blocking Reason**: Chưa chốt đầy đủ approval chain cho toàn bộ planning surface; `AI_Workspace` vừa được materialize cho `F-M09-AIC-001`, nhưng Business Owner review và UXUI approval vẫn còn mở

---

## Purpose

Folder này chứa các planning artifacts của project `MIABOS`, trả lời câu hỏi `what ships when`, `release slice nào đi trước`, và `dependency nào cần chốt` trước khi sang design / build.

## Current Structure

| Folder | Purpose | Status |
|--------|---------|--------|
| [`PRD/Knowledge_Center/`](./PRD/Knowledge_Center/_index.md) | Bộ PRD cho surface `Knowledge_Center` | Draft |
| [`PRD/AI_Workspace/`](./PRD/AI_Workspace/_index.md) | Bộ PRD cho surface `AI_Workspace`, bắt đầu với `F-M09-AIC-001` | In Review |
| [`Backlog/`](./Backlog/Product_Backlog.md) | Product backlog và sprint backlog cho các slice đã materialize | In Review |
| [Stories/AI_Workspace/](./Stories/AI_Workspace/US-M09-AIC-001_Internal_AI_Chat_FE_Preview.md) | Canonical user stories cho AI_Workspace | Approved |
| [Stories/Orders_And_Service/](./Stories/Orders_And_Service/US-M05-ORD-001A_Sales_Order_And_POS.md) | Canonical user stories cho Orders And Service | Draft |
| [`Subtask_Boards/`](./Subtask_Boards/STB-M09-AIC-001_Internal_AI_Chat_FE_Preview.md) | Execution boards cho story-level handoff | In Review |

## Operating Notes

- `Planning/` là lớp product planning do `A02 Product Owner Agent` dẫn dắt, nhưng được PM mở và kiểm soát gate.
- PRD không thay thế `Feature SRS`; PRD trả lời `why / for whom / outcome`, còn SRS trả lời `behavior / rules / states`.
- Bước tiếp theo hợp lệ sau PRD là `Product Backlog -> Sprint Backlog -> User Story`, không nhảy cóc thẳng sang build.
- Với `F-M09-AIC-001`, `FE Preview` chỉ được mở sau khi `UXUI` được `Approved` thật và PM explicitly mở preview.
- `PRD In Review` không đồng nghĩa với `Business Owner Approved`; approval phải được giữ tách bạch để tránh fake sign-off.

