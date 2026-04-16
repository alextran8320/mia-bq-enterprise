# Subtask Board: Internal AI Chat FE Preview

**Status**: In Review
**Owner**: [[A01_PM_Agent]]
**Last Updated By**: Codex CLI (GPT-5 Codex)
**Last Reviewed By**: A01 PM Agent
**Approval Required**: PM Agent
**Approved By**: -
**Last Status Change**: 2026-04-16
**Source of Truth**: Execution board for one approved user story — split into agent-owned subtasks with enough context for any AI to execute independently without reading the full conversation history.
**Blocking Reason**: FE Preview vẫn blocked until UXUI được Approved; BA/UX planning work vẫn có thể chạy

---

## Parent Context

- `Story ID`: `US-M09-AIC-001`
- `Feature ID`: `F-M09-AIC-001`
- `Backlog ID`: `PBI-M09-AIC-001`
- `Module`: `AI Workspace`
- `Related Feature SRS`: [F-M09-AIC-001_Internal_AI_Chat_SRS.md](../../../Analysis/Features/Modules/AI_Workspace/Internal_AI_Chat/SRS/F-M09-AIC-001_Internal_AI_Chat_SRS.md)
- `Story Summary`: Người dùng nội bộ hỏi MIABOS bằng tiếng Việt tự nhiên và nhận answer card có source trace, freshness, warning, và next action.
- `Requirement Clarification Status`: `Clear for BA / UX refinement; canonical FE Preview still blocked pending mockup export and UXUI approval`
- `Confirmed Decisions (PM / Business Owner)`: 
  - `Answer type` phase 1 gồm `Policy`, `Data`, `Mixed`, `Blocked`
  - `Source trace` là panel slide-in, không mở mặc định
  - Không render raw JSON / raw ERP payload trong answer card
  - FE Preview chỉ chạy bằng mock / stub data
- `Open Questions That MUST Be Confirmed Before Execution`: 
  - Threshold low-confidence phase 1 chốt thế nào
  - Khi source conflict, source nào được ưu tiên cho từng intent class
  - Default fallback là follow-up question hay escalate
- `Key Constraints`:
  - BQ context là internal-only phase 1
  - M07 phải gate access / sensitivity trước render answer
  - M08 phải cung cấp citation hợp lệ cho policy / mixed answer
  - FE Preview không được mở trước khi UXUI Approved
- `Release Rule`: Planning work cho BA/UX có thể tiếp tục, nhưng FE Preview canonical chỉ được mở sau khi `Feature SRS = SRS Ready`, `UXUI = Approved`, và PM explicitly opens preview

---

## Subtask Statuses

- `Todo`
- `In Progress`
- `Blocked`
- `Ready for Review`
- `Done`

---

## Steel Shield Standard

The `Subtask Board` is the execution shield for the story. A downstream agent must be able to execute from this board alone without inventing missing requirements.

If any delivery-impacting requirement is unclear:
- the board must mark it as `Blocked - PM / Business Owner confirmation required`, or
- the board must record the confirmed decision explicitly.

An incomplete board is not a legal handoff.

### Mandatory Execution-Plan Fields For Every Detail Block

Every subtask detail block must be complete enough to answer all items below:

- `Objective`: what exactly this agent must achieve
- `Confirmed Inputs`: decisions already confirmed by PM / Business Owner
- `Blocked Clarifications`: unresolved items that must be asked before work continues
- `In Scope`: what this agent is allowed to change or decide
- `Out of Scope`: what this agent must not change
- `Write Scope`: exact files / artifacts this agent may modify
- `Read First`: exact artifacts the agent must consume
- `Execution Steps`: step-by-step implementation plan
- `Do Not Assume`: explicit assumptions that are forbidden
- `Evidence Required`: screenshots, notes, test proof, or artifact updates required at handoff
- `Escalate When`: exact conditions that require PM / Business Owner confirmation
- `Done When`: objective exit criteria

PM may not promote a board to execution-ready unless every active block is implementation-plan grade.

---

## Subtask Board (Summary)

| Subtask ID | Workstream | Title | Primary Agent | Consulted Agents | Depends On | Output Artifact | Status | Blocking Reason |
|------------|------------|-------|---------------|------------------|------------|-----------------|--------|-----------------|
| ST-M09-AIC-001-01 | PM | Confirm sprint scope and gate readiness | A01 | A02, A03 | — | Sprint Backlog row updated | Done | - |
| ST-M09-AIC-001-02 | BA | Materialize feature behavior rules and close open questions | A03 | A02 | ST-M09-AIC-001-01 | Story / SRS decision notes | Done | - |
| ST-M09-AIC-001-03 | UX | Design layout, states, and interactions from SRS | A06 | A03 | ST-M09-AIC-001-02 | UXUI spec / mockup | In Progress | - |
| ST-M09-AIC-001-04 | FE | Build FE Preview with mock / stub data | A07 | A06 | ST-M09-AIC-001-03 | Frontend preview | Blocked | UXUI chưa Approved; local spike `/ai/chat` exists for non-gated review only |
| ST-M09-AIC-001-05 | PM / Review | Review FE Preview and absorb feedback into docs | A01 | A03, A06, A07 | ST-M09-AIC-001-04 | Review decision + updated docs | Blocked | FE Preview chưa legal |

---

## Subtask Detail Blocks

### ST-M09-AIC-001-01 · PM · Confirm Sprint Scope and Gate Readiness

**Role**: A01 PM Agent — sprint scope gating and backlog hygiene
**Status**: `Done`
**Depends On**: —

#### Read First
| File | What to look for |
|------|-----------------|
| `Planning/PRD/AI_Workspace/PRD-M09-AIC-001_Internal_AI_Chat.md` | Business case, scope boundaries, and release slice |
| `Planning/Backlog/Product_Backlog.md` | Readiness and next action for the story slice |
| `Planning/Stories/AI_Workspace/US-M09-AIC-001_Internal_AI_Chat_FE_Preview.md` | Story scope, AC, and linked board |

#### Task
Confirm the slice is explicit, reviewable, and sequenced for BA/UX planning. Keep FE Preview out of execution until UXUI is approved.

#### Produce
| What | Where | Format |
|------|-------|--------|
| Sprint Backlog row updated | `Planning/Backlog/Sprint_Backlog.md` | Single canonical row for the story slice |
| This subtask status | `STB-M09-AIC-001_Internal_AI_Chat_FE_Preview.md` summary table | Set ST-M09-AIC-001-01 → `Done` |

#### Done When
- [x] Sprint backlog row exists and points to the correct story
- [x] FE Preview gate is explicitly blocked until UXUI Approved
- [x] BA/UX workstream may continue without inventing new scope

### ST-M09-AIC-001-02 · BA · Materialize Feature Behavior Rules and Close Open Questions

**Role**: A03 BA Agent — business rule closure and AC precision
**Status**: `Done`
**Depends On**: ST-M09-AIC-001-01

#### Read First
| File | What to look for |
|------|-----------------|
| `Planning/PRD/AI_Workspace/PRD-M09-AIC-001_Internal_AI_Chat.md` | Scope, user groups, and open questions |
| `Planning/Stories/AI_Workspace/US-M09-AIC-001_Internal_AI_Chat_FE_Preview.md` | AC table, scope, and notes |
| `Analysis/Features/Modules/AI_Workspace/Internal_AI_Chat/SRS/F-M09-AIC-001_Internal_AI_Chat_SRS.md` | State machine, rules, API contract, validation |

#### Task
Tighten the behavior contract for the story slice. Close or explicitly defer the questions around intent threshold, source conflict priority, and fallback behavior. Ensure the story ACs remain testable and do not rely on future design improvisation.

#### Produce
| What | Where | Format |
|------|-------|--------|
| Decision notes | `Planning/Stories/AI_Workspace/US-M09-AIC-001_Internal_AI_Chat_FE_Preview.md` | Bullet list in `Notes` section |
| Story AC precision | `Planning/Stories/AI_Workspace/US-M09-AIC-001_Internal_AI_Chat_FE_Preview.md` | Update AC table if needed |
| This subtask status | `STB-M09-AIC-001_Internal_AI_Chat_FE_Preview.md` summary table | Set `Done` after SRS Ready + story precision sync |

#### Done When
- [x] Every AC has a concrete, testable `Then` clause
- [x] Open questions are either answered or explicitly deferred
- [x] UX can start from the refined behavior contract without guessing

### ST-M09-AIC-001-03 · UX · Design Layout, States, and Interactions from SRS

**Role**: A06 UI/UX Agent — screen layout, component selection, interaction design
**Status**: `In Progress`
**Depends On**: ST-M09-AIC-001-02

#### Read First
| File | What to look for |
|------|-----------------|
| `Analysis/Features/Modules/AI_Workspace/Internal_AI_Chat/SRS/F-M09-AIC-001_Internal_AI_Chat_SRS.md` | Main flow, alternate flows, error flows, state machine |
| `Planning/Stories/AI_Workspace/US-M09-AIC-001_Internal_AI_Chat_FE_Preview.md` | Final ACs, scope, and notes |
| `Design/UXUI_Features/UXUI-F-M09-AIC-001_Internal_AI_Chat.md` | Current UX draft, screen inventory, and mockup placeholders |

#### Task
Refine layout, states, and interactions for the chat shell, answer cards, blocked state, and source trace. Keep the design aligned with the current SRS draft and call out any contract gaps instead of silently inventing them.

#### Produce
| What | Where | Format |
|------|-------|--------|
| UX spec updates | `Design/UXUI_Features/UXUI-F-M09-AIC-001_Internal_AI_Chat.md` | Update state/behavior sections |
| Mockup references | `Design/Mockups/` | Update or create mockup placeholders as needed |
| This subtask status | `STB-M09-AIC-001_Internal_AI_Chat_FE_Preview.md` summary table | Keep `In Progress` until UXUI is ready for approval |

#### Done When
- [ ] Every AC maps to a visible UI state or interaction
- [ ] Empty, loading, error, blocked, and mixed states are defined
- [ ] FE Preview can be built from the UXUI spec without guessing

### ST-M09-AIC-001-04 · FE · Build FE Preview with Mock / Stub Data

**Role**: A07 FE Builder — preview implementation for review and iteration
**Status**: `Blocked`
**Depends On**: ST-M09-AIC-001-03

#### Read First
| File | What to look for |
|------|-----------------|
| `Design/UXUI_Features/UXUI-F-M09-AIC-001_Internal_AI_Chat.md` | Layout, component map, interaction states |
| `Planning/Stories/AI_Workspace/US-M09-AIC-001_Internal_AI_Chat_FE_Preview.md` | Scope boundaries and ACs |
| `Analysis/Features/Modules/AI_Workspace/Internal_AI_Chat/SRS/F-M09-AIC-001_Internal_AI_Chat_SRS.md` | Behavior rules and state machine |

#### Task
Implement the FE Preview using mock/stub data only. Do not connect to live APIs or invent new contract fields. A local spike preview already exists at `/ai/chat`, but it does not replace the canonical gate blocked by missing mockup approval.

#### Produce
| What | Where | Format |
|------|-------|--------|
| FE Preview implementation | Project FE codebase | React preview components using mock/stub data |
| FE Preview notes | Story notes or preview README | Mock assumptions and edge cases |
| This subtask status | `STB-M09-AIC-001_Internal_AI_Chat_FE_Preview.md` summary table | Remain `Blocked` until UXUI Approved |

#### Done When
- [ ] Frontend is reviewable by PM / Business Owner
- [ ] Preview respects approved UXUI and SRS behavior
- [ ] Mock/stub assumptions are explicit
- [ ] PM can run review without backend work first

### ST-M09-AIC-001-05 · PM / Review · Review FE Preview and Absorb Feedback

**Role**: A01 PM Agent — review orchestration and gate control
**Status**: `Blocked`
**Depends On**: ST-M09-AIC-001-04

#### Read First
| File | What to look for |
|------|-----------------|
| FE Preview implementation | Actual reviewable frontend |
| `Planning/Stories/AI_Workspace/US-M09-AIC-001_Internal_AI_Chat_FE_Preview.md` | Scope, ACs, and any newly surfaced open questions |
| `Analysis/Features/Modules/AI_Workspace/Internal_AI_Chat/SRS/F-M09-AIC-001_Internal_AI_Chat_SRS.md` | Current behavior baseline |
| `Design/UXUI_Features/UXUI-F-M09-AIC-001_Internal_AI_Chat.md` | Current UX baseline |

#### Task
Run FE Preview review only after preview exists. Capture feedback, classify it as visual-only or behavior-changing, and fold behavior-changing feedback back into Story, SRS, and UXUI before any downstream build.

#### Produce
| What | Where | Format |
|------|-------|--------|
| Review decision | `STB-M09-AIC-001_Internal_AI_Chat_FE_Preview.md` | Approved / Needs Changes / Blocked |
| Updated docs | `Planning/Stories/...`, `Feature SRS`, `UXUI` | Only if feedback changes behavior or interaction contract |
| This subtask status | `STB-M09-AIC-001_Internal_AI_Chat_FE_Preview.md` summary table | Stay blocked until FE Preview exists |

#### Done When
- [ ] FE Preview has a clear review outcome
- [ ] Any behavior-changing feedback is absorbed into Story / SRS / UXUI
- [ ] PM has explicitly decided whether the story may proceed to technical closure
