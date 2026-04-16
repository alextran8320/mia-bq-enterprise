# Product Backlog — MIABOS

**Status**: Approved
**Owner**: A01 PM Agent
**Last Updated By**: Codex CLI (GPT-5.4 Codex environment)
**Last Reviewed By**: A01 PM Agent
**Approval Required**: PM Agent + Product Owner
**Approved By**: A01 PM Agent
**Last Status Change**: 2026-04-16
**Source of Truth**: This file for ordered product-priority sequencing, story-level readiness, and release planning.
**Blocking Reason**: -
**Project**: MIABOS
**Delivery Unit**: `User Story`
**Document Role**: Canonical PM control plane for release and sprint candidate prioritization

---

## 0. Purpose

Backlog này mở story-level control plane tối thiểu cho các feature đã được Business Owner yêu cầu hoặc PM hợp thức hóa để đưa vào FE Preview bằng mock/stub data trong ngày 2026-04-16.

## 1. Backlog Readiness Vocabulary

| Readiness | Meaning | Legal Next Move |
|-----------|---------|-----------------|
| `Idea` | Identified, not yet shaped into a delivery story slice | Clarify scope and owners |
| `Scoped` | Scope, release intent, and target users are known, but story authoring is not complete | Prepare or refine the story slice |
| `Ready for Story` | PM and BA have enough clarity to finalize the canonical story file | Write or approve the user story |
| `Design Pending` | Story exists, but SRS and/or UXUI gate is not yet legal for build | Complete SRS, UXUI, and design gate work |
| `Ready for Design` | Story is approved for near-term PB-03 work and can legally move into SRS plus UXUI preparation | Open or continue PB-03 work |
| `Ready for Build` | Story, SRS, design, and execution handoff are sufficiently approved for implementation | Pull into build execution |
| `Ready for Review` | FE Preview exists and is reviewable, but Business Owner/PM decision is not yet recorded | Run review and capture decision |
| `Blocked` | Work cannot progress and the blocker is explicit | Resolve blocker before promotion |
| `Done` | Delivered and accepted | Close and retain for traceability |

## R1 — BQ AI Preview Pack

### Sprint FE-Preview-01

| Rank | Backlog ID | Story ID | Feature ID | Epic ID | Item | Product | Priority | Readiness | Target Release | Target Sprint | PM Owner | BA Owner | Dependency | Next Action | Story File | Feature SRS | UXUI / STB | Blocking Reason |
|------|------------|----------|------------|---------|------|---------|----------|-----------|----------------|---------------|----------|----------|------------|-------------|------------|-------------|------------|-----------------|
| 1 | PBI-M09-AIC-001 | US-M09-AIC-001 | F-M09-AIC-001 | EP-AI-OPS | Internal AI Chat FE Preview | MIA Smart | P0 | Ready for Review | R1 | FE-Preview-01 | A01 | A03 | M07/M08 mock contracts | Business Owner review `/ai/chat`; record decision before integration | [US-M09-AIC-001_Internal_AI_Chat.md](../Stories/AI_Workspace/US-M09-AIC-001_Internal_AI_Chat.md) | [F-M09-AIC-001_Internal_AI_Chat_SRS.md](../../Analysis/Features/Modules/AI_Workspace/Internal_AI_Chat/SRS/F-M09-AIC-001_Internal_AI_Chat_SRS.md) | [UXUI](../../Design/UXUI_Features/UXUI-F-M09-AIC-001_Internal_AI_Chat.md) / [STB](../Subtask_Boards/STB-M09-AIC-001_Internal_AI_Chat_FE_Preview.md) | - |
| 2 | PBI-M10-SLS-001 | US-M10-SLS-001 | F-M10-SLS-001 | EP-AI-SALES | Sales Advisor AI FE Preview | MIA Smart | P0 | Ready for Build | R1 | FE-Preview-01 | A01 | A03 | M07/M08 mock contracts | A07 build FE Preview from approved UXUI + SRS using mock/stub data | [US-M10-SLS-001_Sales_Advisor_AI.md](../Stories/AI_Workspace/US-M10-SLS-001_Sales_Advisor_AI.md) | [F-M10-SLS-001_Sales_Advisor_AI_SRS.md](../../Analysis/Features/Modules/AI_Workspace/Sales_Advisor_AI/SRS/F-M10-SLS-001_Sales_Advisor_AI_SRS.md) | [UXUI](../../Design/UXUI_Features/UXUI-F-M10-SLS-001_Sales_Advisor_AI.md) / [STB](../Subtask_Boards/STB-M10-SLS-001_Sales_Advisor_AI_FE_Preview.md) | - |
| 3 | PBI-M14-BIZ-001 | US-M14-BIZ-001 | F-M14-BIZ-001 | EP-BIZ-DASHBOARD | Business Analytics And ROI FE Preview | MIA Smart / Platform | P1 | Ready for Review | R1 | FE-Preview-01 | A01 | A03 | M03-M06/M10/M12 mock read models | Business Owner review dashboard routes; record decision before any integration | [US-M14-BIZ-001_Business_Analytics_And_ROI.md](../Stories/Insights_And_Performance/US-M14-BIZ-001_Business_Analytics_And_ROI.md) | [F-M14-BIZ-001_Business_Analytics_And_ROI_SRS.md](../../Analysis/Features/Modules/Insights_And_Performance/Business_Analytics_And_ROI/SRS/F-M14-BIZ-001_Business_Analytics_And_ROI_SRS.md) | [UXUI](../../Design/UXUI_Features/UXUI-F-M14-BIZ-001_Business_Analytics_And_ROI.md) / [STB](../Subtask_Boards/STB-M14-BIZ-001_Business_Analytics_And_ROI_FE_Preview.md) | - |

## 5. Backlog Summary

| Release | P0 Count | P1 Count | P2 Count | Total |
|---------|----------|----------|----------|-------|
| R1 | 2 | 1 | 0 | 3 |
| **Total** | 2 | 1 | 0 | 3 |
