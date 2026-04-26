# Subtask Board: STB-M10-SLS-001 Sales Advisor AI FE Preview

**Status**: Approved
**Owner**: A01 PM Agent
**Last Updated By**: Codex CLI (GPT-5.4 Codex environment)
**Last Reviewed By**: A01 PM Agent
**Approval Required**: PM Agent
**Approved By**: A01 PM Agent — Business Owner instructed execution on 2026-04-16
**Last Status Change**: 2026-04-16
**Source of Truth**: Execution board for `US-M10-SLS-001` FE Preview with mock/stub data.
**Blocking Reason**: -

---

## Parent Context

- `Story ID`: US-M10-SLS-001
- `Feature ID`: F-M10-SLS-001
- `Backlog ID`: PBI-M10-SLS-001
- `Module`: AI Workspace / Sales Advisor AI
- `Related Feature SRS`: [F-M10-SLS-001_Sales_Advisor_AI_SRS.md](../../Analysis/Features/Modules/AI_Workspace/Sales_Advisor_AI/SRS/F-M10-SLS-001_Sales_Advisor_AI_SRS.md)
- `Related UXUI`: [UXUI-F-M10-SLS-001_Sales_Advisor_AI.md](../../Design/UXUI_Features/UXUI-F-M10-SLS-001_Sales_Advisor_AI.md)
- `Story Summary`: Khách hàng nhận tư vấn sản phẩm public-safe, xem suggestion card, và chọn CTA/lead capture trong một chat preview.
- `Requirement Clarification Status`: `Clear for FE Preview / BE integration deferred`
- `Confirmed Decisions (PM / Business Owner)`:
  - Business Owner yêu cầu thực hiện đề xuất chọn `F-M10-SLS-001` làm feature FE tiếp theo ngoài Internal AI Chat.
  - FE Preview dùng mock/stub data only; không gọi endpoint thật.
  - CTA phase 1: `Xem sản phẩm`, `Để lại thông tin`, `Gặp nhân viên tư vấn`, `Hỏi câu khác`.
  - Availability không hiển thị số tồn kho; dùng wording theo `high / medium / low confidence`.
  - Lead form phase 1 chỉ cần `Tên của bạn` và `Số điện thoại`.
- `Open Questions That MUST Be Confirmed Before Execution`: None for FE Preview. Backend routing/source-priority questions are deferred to Integration Spec.
- `Key Constraints`:
  - Stack: existing `Build/Lark_MIA_Web` React + TypeScript + local shared UI.
  - Copy: 100% Vietnamese user-facing copy from UXUI §6.
  - No backend invention: A07 must not call real endpoints for Sales Advisor AI.
  - Evidence: build result, route check, browser/runtime verification notes; screenshot optional unless explicitly requested.
- `Release Rule`: FE Preview is open. BE/integration remains blocked until FE Preview is reviewed, `Feature SRS = Build Ready`, and Integration Spec is approved.

---

## Subtask Statuses

- `Todo`
- `In Progress`
- `Blocked`
- `Ready for Review`
- `Done`

---

## Gate 4C FE Preview Start Check

| Requirement | Status | Evidence | Notes |
|-------------|--------|----------|-------|
| PRD exists and is approved | PASS | [PRD-M10-SLS-001](../PRD/AI_Workspace/PRD-M10-SLS-001_Sales_Advisor_AI.md) | FE Preview scope only |
| User Story exists in Sprint Backlog | PASS | [US-M10-SLS-001](../Stories/AI_Workspace/US-M10-SLS-001_Sales_Advisor_AI.md), [Sprint Backlog](../Backlog/Sprint_Backlog.md) | Row readiness = `Ready for Build` |
| Feature SRS at least `SRS Ready` | PASS | [SRS](../../Analysis/Features/Modules/AI_Workspace/Sales_Advisor_AI/SRS/F-M10-SLS-001_Sales_Advisor_AI_SRS.md) | BE gate still separate |
| UXUI Feature Spec approved | PASS | [UXUI](../../Design/UXUI_Features/UXUI-F-M10-SLS-001_Sales_Advisor_AI.md) | Approved for FE Preview |
| Subtask Board explicitly allows FE Preview | PASS | This file | A07 may start |
| Mock/stub data contract explicit | PASS | SRS §25, UXUI §4, this board | No real endpoints |

**Gate Verdict**: `PASS for FE Preview`  
**Important Boundary**: `NOT Build Ready for BE / integration`.

---

## Subtask Board (Summary)

| Subtask ID | Workstream | Title | Primary Agent | Consulted Agents | Depends On | Output Artifact | Status | Blocking Reason |
|------------|------------|-------|---------------|------------------|------------|-----------------|--------|-----------------|
| ST-M10-SLS-001-01 | PM | Confirm readiness and open FE Preview | A01 | A02, A03, A06 | — | Planning/SRS/UXUI/STB synced | Done | - |
| ST-M10-SLS-001-02 | FE | Build Sales Advisor AI FE Preview | A07 | A06, A05 | ST-01 | `/sales-advisor` preview in frontend app | Todo | - |
| ST-M10-SLS-001-03 | PM / QA | Verify build and preview evidence | A01 / A09 | A07, A06 | ST-02 | Build result + runtime evidence; screenshot optional | Todo | - |
| ST-M10-SLS-001-04 | PM / Review | Review FE Preview and capture feedback | A01 | Business Owner, A06, A07 | ST-03 | Review decision + doc updates if needed | Todo | - |
| ST-M10-SLS-001-05 | Tech Lead | Materialize Integration Spec after FE review | A05 | A03, A08 | ST-04 | Integration Spec | Blocked | Requires reviewed FE Preview |

---

## Subtask Detail Blocks

### ST-M10-SLS-001-01 · PM · Confirm Readiness and Open FE Preview

**Role**: A01 PM Agent  
**Status**: `Done`  
**Depends On**: —

#### Objective

Promote `F-M10-SLS-001` from draft preparation into legal FE Preview scope without opening backend/integration work.

#### Confirmed Inputs

- Business Owner said: "THực hiện theo đề xuất của em đi".
- SRS has BQ context, integration source map, main flow, testable business rules, NFR metrics, and ACs.
- UXUI has §0 User & Task, §2.1 Task Flow, §5.1 Error & Recovery, and Vietnamese copy.

#### Blocked Clarifications

- None for FE Preview.
- Real source priority, channel routing, and CRM lead assignment remain blocked for BE/integration.

#### In Scope

- Promote SRS to `SRS Ready`.
- Approve UXUI for FE Preview.
- Create PRD, backlog row, sprint row, user story, and this subtask board.

#### Out of Scope

- Backend/API implementation.
- Integration Spec.
- Production data contracts.

#### Write Scope

- `Planning/PRD/AI_Workspace/`
- `Planning/Backlog/`
- `Planning/Stories/AI_Workspace/`
- `Planning/Subtask_Boards/`
- linked SRS/UXUI/control-plane rows

#### Read First

| File | What to look for |
|------|-----------------|
| [SRS](../../Analysis/Features/Modules/AI_Workspace/Sales_Advisor_AI/SRS/F-M10-SLS-001_Sales_Advisor_AI_SRS.md) | Behavior and mock contract |
| [UXUI](../../Design/UXUI_Features/UXUI-F-M10-SLS-001_Sales_Advisor_AI.md) | Visual/interaction authority |
| [PRD](../PRD/AI_Workspace/PRD-M10-SLS-001_Sales_Advisor_AI.md) | Product scope |

#### Execution Steps

1. Validate SRS content depth and resolve FE-preview blockers.
2. Promote SRS and control-plane rows to `SRS Ready`.
3. Approve UXUI for mock/stub FE Preview.
4. Create planning artifacts and Gate 4C evidence.

#### Do Not Assume

- Do not mark BE/integration as open.
- Do not convert FE Preview approval into production approval.

#### Evidence Required

- This board exists and records Gate 4C PASS for FE Preview.
- Registry/traceability status is synced.

#### Escalate When

- Business Owner asks for real lead routing or real product availability.

#### Done When

- A07 can build from this board without inventing missing scope.

---

### ST-M10-SLS-001-02 · FE · Build Sales Advisor AI FE Preview

**Role**: A07 FE Builder  
**Status**: `Todo`  
**Depends On**: ST-M10-SLS-001-01

#### Objective

Build a reviewable `/sales-advisor` FE Preview that demonstrates the Sales Advisor task flow, states, and conversion CTA using local mock/stub data.

#### Confirmed Inputs

- Route target: `/sales-advisor`.
- Primary task: khách nhận suggestion trong ≤ 3 discovery turns and can select CTA.
- Copy source: UXUI §6.
- Mock states: loading, discovery, suggested, low-confidence availability, blocked, no-match, lead-capture, lead-submitted, error.

#### Blocked Clarifications

- None for FE Preview.

#### In Scope

- New Sales Advisor page/component(s).
- Local mock data file(s).
- Router/sidebar entry if needed for local review.
- Styling aligned with existing design tokens and UXUI.

#### Out of Scope

- Real API calls.
- Backend lead creation.
- Global redesign of app shell.
- Refactoring Internal AI Chat beyond reusable patterns if strictly needed.

#### Write Scope

- `Build/Lark_MIA_Web/src/modules/ai-workspace/pages/SalesAdvisorPage.tsx`
- `Build/Lark_MIA_Web/src/mocks/ai-workspace/salesAdvisor.ts`
- `Build/Lark_MIA_Web/src/app/router.tsx`
- `Build/Lark_MIA_Web/src/app/layouts/Sidebar.tsx` if nav needs a visible entry
- Small shared UI updates only if needed and non-breaking

#### Read First

| File | What to look for |
|------|-----------------|
| [UXUI](../../Design/UXUI_Features/UXUI-F-M10-SLS-001_Sales_Advisor_AI.md) | Required states, copy, layout, tokens |
| [SRS](../../Analysis/Features/Modules/AI_Workspace/Sales_Advisor_AI/SRS/F-M10-SLS-001_Sales_Advisor_AI_SRS.md) | Business rules and error states |
| [User Story](../Stories/AI_Workspace/US-M10-SLS-001_Sales_Advisor_AI.md) | ACs |
| `Build/Lark_MIA_Web/src/modules/ai-workspace/pages/InternalAIChatPage.tsx` | Existing chat patterns; do not revert unrelated dirty changes |

#### Execution Steps

1. Create local mock scenarios for discovery, suggestion, low-confidence availability, blocked, no-match, and lead capture.
2. Build `/sales-advisor` chat shell with welcome, quick replies, message thread, suggestion cards, blocked bubble, and lead form.
3. Add route and optional sidebar entry for review.
4. Ensure all user-facing copy is Vietnamese.
5. Run `npm run build`.
6. Save runtime evidence after build: route check, browser console/layout notes, and optional screenshot only if PM/Business Owner requests it.

#### Do Not Assume

- Do not call `/mia/sales-advisor/query`, `/mia/sales-advisor/products`, or `/mia/leads`.
- Do not expose stock quantity or internal price fields.
- Do not use English user-facing labels.
- Do not promote SRS to `Build Ready`.

#### Evidence Required

- Build output.
- Route check/browser runtime evidence for `/sales-advisor`; screenshot optional.
- Notes on any mock-only assumptions.

#### Escalate When

- A required visual state cannot be represented without inventing product/data behavior.
- Existing FE dirty changes conflict with Sales Advisor implementation.

#### Done When

- `/sales-advisor` is reviewable and all ACs in `US-M10-SLS-001` are demonstrable with mock data.

---

### ST-M10-SLS-001-03 · PM / QA · Verify Build and Evidence

**Role**: A01 PM Agent / A09 QA Agent  
**Status**: `Todo`  
**Depends On**: ST-M10-SLS-001-02

#### Objective

Verify the preview builds and produces runtime evidence before Business Owner review.

#### Confirmed Inputs

- Build command: `npm run build` from `Build/Lark_MIA_Web`.
- Visual route: `/sales-advisor`.

#### Blocked Clarifications

- None.

#### In Scope

- Build verification.
- Runtime route/browser verification; screenshot capture only if explicitly requested.
- AC spot-check.

#### Out of Scope

- Full QA/UAT.
- Backend integration tests.

#### Write Scope

- Optional `Build/Screenshots/` evidence only if PM/Business Owner requests screenshot capture.
- Session log and STB status updates after verification.

#### Read First

| File | What to look for |
|------|-----------------|
| [User Story](../Stories/AI_Workspace/US-M10-SLS-001_Sales_Advisor_AI.md) | AC checklist |
| [UXUI](../../Design/UXUI_Features/UXUI-F-M10-SLS-001_Sales_Advisor_AI.md) | Visual states |

#### Execution Steps

1. Run build.
2. Start local preview/dev server if needed.
3. Check `/sales-advisor`.
4. Save runtime evidence and optional screenshot only when requested.
5. Update STB status and session log.

#### Do Not Assume

- Do not treat build success alone as visual approval.

#### Evidence Required

- Terminal build result.
- Route/browser verification evidence.
- Optional screenshot path only if screenshot was explicitly requested or already captured.

#### Escalate When

- Route is blank, layout breaks, or text overflows.

#### Done When

- Build and runtime evidence exist and FE Preview is ready for review.
