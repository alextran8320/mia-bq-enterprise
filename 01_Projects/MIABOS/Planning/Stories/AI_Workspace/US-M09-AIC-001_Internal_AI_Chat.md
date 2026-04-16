# User Story: US-M09-AIC-001 Internal AI Chat FE Preview

**Status**: Approved
**Owner**: A03 BA Agent
**Last Updated By**: Codex CLI (GPT-5.4 Codex environment)
**Last Reviewed By**: A01 PM Agent
**Approval Required**: PM Agent
**Approved By**: A01 PM Agent
**Last Status Change**: 2026-04-16
**Source of Truth**: This file for Internal AI Chat FE Preview user story and acceptance criteria.
**Blocking Reason**: -

---

## Story

As a BQ internal user, I want to ask MIABOS natural-language questions and receive answer cards with source, freshness, warning, and next action, so that I can resolve operational questions without opening multiple systems.

## Planning Context

- `Feature ID`: F-M09-AIC-001
- `PRD`: [PRD-M09-AIC-001_Internal_AI_Chat.md](../../PRD/AI_Workspace/PRD-M09-AIC-001_Internal_AI_Chat.md)
- `Feature SRS`: [F-M09-AIC-001_Internal_AI_Chat_SRS.md](../../../Analysis/Features/Modules/AI_Workspace/Internal_AI_Chat/SRS/F-M09-AIC-001_Internal_AI_Chat_SRS.md)
- `UXUI`: [UXUI-F-M09-AIC-001_Internal_AI_Chat.md](../../../Design/UXUI_Features/UXUI-F-M09-AIC-001_Internal_AI_Chat.md)
- `Priority`: P0
- `Product`: MIA Smart
- `Release Slice`: FE Preview with mock/stub data

## User Problem

Nhân viên BQ cần hỏi nhanh về tồn kho, policy, CTKM, đơn online, và thao tác hệ thống nhưng dữ liệu nằm rải ở nhiều hệ thống và người phụ trách khác nhau.

## Trigger

User đang xử lý khách hoặc vận hành nội bộ và cần câu trả lời ngay trong chat.

## Happy Path

1. User mở `/ai/chat`.
2. User nhập câu hỏi bằng tiếng Việt.
3. FE Preview render loading state và mock answer card phù hợp.
4. User đọc kết luận, freshness, warning, và source summary.
5. User mở source trace hoặc chọn next action/escalation.

## Dependencies

- SRS `F-M09-AIC-001` is `SRS Ready`.
- UXUI `UXUI-F-M09-AIC-001` is `Approved` for FE Preview.
- STB `STB-M09-AIC-001` controls A07 execution/review scope.
- Backend/integration deferred until Integration Spec is approved.

## Acceptance Criteria

| AC ID | Acceptance Criteria |
|-------|---------------------|
| AC-M09-AIC-001-01 | Given the user submits a policy question, when the preview responds, then the answer card shows type, conclusion, citation/source summary, freshness, and next action. |
| AC-M09-AIC-001-02 | Given the user submits a mixed data + policy question, when the preview responds, then data and policy blocks are visually separated. |
| AC-M09-AIC-001-03 | Given the question is blocked or unsupported, when the preview responds, then the user sees a clear reason and an escalation/next-action path. |
| AC-M09-AIC-001-04 | Given source data is stale/conflicting in mock data, when the preview responds, then a warning is visible and the card does not imply full trust. |
| AC-M09-AIC-001-05 | Given the user opens source trace, when the panel appears, then it does not replace or lose the chat thread. |

## Out of Scope

- Real endpoint calls.
- Production source priority.
- Production escalation routing.
- Final Business Owner approval of integration behavior.

