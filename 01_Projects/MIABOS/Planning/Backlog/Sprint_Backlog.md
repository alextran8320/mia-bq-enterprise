# Sprint Backlog — FE Preview 01

**Status**: Approved
**Owner**: A01 PM Agent
**Last Updated By**: Codex CLI (GPT-5.4 Codex environment)
**Last Reviewed By**: A01 PM Agent
**Approval Required**: PM Agent + Product Owner
**Approved By**: A01 PM Agent
**Last Status Change**: 2026-04-16
**Source of Truth**: This file for sprint-level committed execution scope pulled from the product backlog.
**Blocking Reason**: -

---

## Sprint Identity

- `Sprint ID`: FE-Preview-01
- `Sprint Goal`: Build/review FE Previews for Internal AI Chat, Sales Advisor AI, and Business Analytics Dashboard using mock/stub data.
- `Release`: R1 — BQ AI Preview Pack
- `Sprint Owner`: A01 PM Agent
- `Sprint Dates`: 2026-04-16 onward

## Sprint Backlog

| PBI             | Feature ID    | Story                                                                                              | Subtask Board                                                                                 | Item                                  | PM Owner | BA Owner | Primary Build Owner | Readiness        | Next Action                                                        |
| --------------- | ------------- | -------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------- | ------------------------------------- | -------- | -------- | ------------------- | ---------------- | ------------------------------------------------------------------ |
| PBI-M09-AIC-001 | F-M09-AIC-001 | [US-M09-AIC-001](../Stories/AI_Workspace/US-M09-AIC-001_Internal_AI_Chat.md)                       | [STB-M09-AIC-001](../Subtask_Boards/STB-M09-AIC-001_Internal_AI_Chat_FE_Preview.md)           | Internal AI Chat FE Preview           | A01      | A03      | A07                 | Ready for Review | Business Owner review `/ai/chat`; record decision                  |
| PBI-M10-SLS-001 | F-M10-SLS-001 | [US-M10-SLS-001](../Stories/AI_Workspace/US-M10-SLS-001_Sales_Advisor_AI.md)                       | [STB-M10-SLS-001](../Subtask_Boards/STB-M10-SLS-001_Sales_Advisor_AI_FE_Preview.md)           | Sales Advisor AI FE Preview           | A01      | A03      | A07                 | Ready for Build  | Build `/sales-advisor` preview from SRS + UXUI with mock data only |
| PBI-M14-BIZ-001 | F-M14-BIZ-001 | [US-M14-BIZ-001](../Stories/Insights_And_Performance/US-M14-BIZ-001_Business_Analytics_And_ROI.md) | [STB-M14-BIZ-001](../Subtask_Boards/STB-M14-BIZ-001_Business_Analytics_And_ROI_FE_Preview.md) | Business Analytics And ROI FE Preview | A01      | A03      | A07                 | Ready for Review | Business Owner review dashboard routes; record decision            |

## Sprint Readiness Vocabulary

- `Idea`
- `Scoped`
- `Ready for Story`
- `Ready for Build`
- `Ready for Review`
- `Blocked`
- `Done`

## Sprint Acceptance Definition

- FE Preview route is reviewable locally.
- All UXUI §5 states are represented with mock/stub data.
- No real backend endpoint is required or invented.
- Runtime evidence is produced before review closure; screenshot is optional unless PM/Business Owner requests it.

## Sprint Risks

| Risk                                                            | Impact                 | Mitigation                                                                              | Owner |
| --------------------------------------------------------------- | ---------------------- | --------------------------------------------------------------------------------------- | ----- |
| Preview uses mock data and may be mistaken for integrated build | Expectation mismatch   | STB and final handoff must label preview scope clearly                                  | A01   |
| Sales Advisor reuses Internal Chat styling too heavily          | Weak external-sales UX | Follow UXUI copy, CTA, and lead form requirements                                       | A07   |
| Dashboard preview implies real analytics are ready              | Expectation mismatch   | Label M14 as mock/stub preview and keep production analytics behind Integration Spec    | A01   |
| Backend starts before frontend pack is complete                 | Process drift          | Keep backend/integration blocked until Business Owner confirms all frontend is complete | A01   |
