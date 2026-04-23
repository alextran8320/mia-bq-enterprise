# Template — Subtask Board

**Status**: Draft
**Owner**: [[A01_PM_Agent]]
**Last Updated By**: -
**Last Reviewed By**: -
**Approval Required**: PM Agent
**Approved By**: -
**Last Status Change**: -
**Source of Truth**: Execution board for one approved user story — split into agent-owned subtasks with enough context for any AI to execute independently without reading the full conversation history.
**Blocking Reason**: -

---

## Parent Context

- `Story ID`:
- `Feature ID`:
- `Backlog ID`:
- `Module`:
- `Related Feature Spec`:
- `Related Sitemap`:
- `Related Flow Matrix`:
- `Story Summary`: _One-sentence: what the user can do when this story is done_
- `Requirement Clarification Status`: `Clear / Blocked - PM or Business Owner confirmation required`
- `Confirmed Decisions (PM / Business Owner)`: _Bullet list of requirement clarifications that are already approved_
- `Open Questions That MUST Be Confirmed Before Execution`: _List every unresolved ambiguity that affects scope, behavior, data, copy, validation, permissions, or integration_
- `Key Constraints`:
  - _e.g., Multi-tenancy: company_id isolation required on every query_
  - _e.g., Stack: Directus REST API + React + Minimals UI (MUI v6)_
  - _e.g., [Any open question that is currently blocking a workstream]_
- `Release Rule`: _UX/UI stays blocked until `Feature Spec = Feature Ready for UX`; FE Preview stays blocked until linked Screen Specs + Sitemap + Flow Matrix are approved and PM explicitly opens preview; BE/integration stays blocked until FE Preview is reviewed, `Feature Spec = Build Ready`, and `Integration Spec` is approved_

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
- `Evidence Required`: verified demo/runtime evidence, notes, test proof, artifact updates, or optional screenshots required at handoff
- `Escalate When`: exact conditions that require PM / Business Owner confirmation
- `Done When`: objective exit criteria

PM may not promote a board to execution-ready unless every active block is implementation-plan grade.

---

## Subtask Board (Summary)

| Subtask ID | Workstream | Title | Primary Agent | Consulted Agents | Depends On | Output Artifact | Status | Blocking Reason |
|------------|------------|-------|---------------|------------------|------------|-----------------|--------|-----------------|
| ST-[ID]-01 | PM | Confirm sprint scope and gate readiness | A01 | A02, A03 | — | Sprint Backlog row updated | Todo | - |
| ST-[ID]-02 | BA | Materialize Feature Spec and close behavior rules | A03 | A02 | ST-[ID]-01 | Feature Spec `Feature Ready for UX` | Todo | - |
| ST-[ID]-03 | UX | Design sitemap, screens, states, and interactions from Feature Spec | A06 | A03 | ST-[ID]-02 | Sitemap + Flow Matrix + Screen Specs | Todo | - |
| ST-[ID]-04 | FE | Build FE Preview with mock/stub data | A07 | A06 | ST-[ID]-03 | Frontend preview | Todo | - |
| ST-[ID]-05 | PM / Review | Review FE Preview and absorb feedback into docs | A01 | A03, A06, A07 | ST-[ID]-04 | Review decision + updated Feature Spec / Screen Specs | Todo | - |
| ST-[ID]-06 | Tech Lead | Materialize Integration Spec for BE and real integration | A05 | A03, A06 | ST-[ID]-05 | Integration Spec | Todo | - |
| ST-[ID]-07 | BE | Implement backend endpoint and data logic | A08 | A05, A03 | ST-[ID]-06 | Backend implementation | Todo | - |
| ST-[ID]-08 | FE | Integrate FE Preview with real backend | A07 | A05, A08 | ST-[ID]-07 | Integrated frontend | Todo | - |
| ST-[ID]-09 | QA | Verify AC coverage and run regression | A09 | A07, A08 | ST-[ID]-08 | Test execution evidence | Todo | - |

---

## Subtask Detail Blocks

> Each block below must be self-contained. An AI agent should be able to read only this block and execute correctly without inventing missing requirements. If any field below cannot be completed truthfully, the block must remain `Blocked` and PM must ask the Business Owner to confirm the missing requirement.

---

### ST-[ID]-01 · PM · Confirm Sprint Scope and Gate Readiness

**Role**: A01 PM Agent — Sprint scope gating and backlog hygiene
**Status**: `Todo`
**Depends On**: —

#### Read First
| File | What to look for |
|------|-----------------|
| `Planning/Backlog/Sprint_Backlog.md` | PBI row for this story — current Readiness and Next Action |
| `Planning/Backlog/Product_Backlog.md` | PBI priority, readiness, and blocking reason |
| `Planning/Stories/[Module]/[US-file].md` | Story exists and is linked correctly |

#### Task
Confirm that this PBI is correctly sequenced in the active sprint and the story file exists. Verify the Sprint Backlog row reflects the current readiness state. Update the `Next Action` and `Readiness` columns using only canonical readiness vocabulary. If any blocking reason exists, document it and keep the status as `Blocked`.

#### Produce
| What | Where | Format |
|------|-------|--------|
| Sprint Backlog row updated | `Planning/Backlog/Sprint_Backlog.md` | Update `Readiness` and `Next Action` columns for this PBI |
| This subtask status | `STB-[ID].md` summary table | Set ST-[ID]-01 → `Done` |

#### Done When
- [ ] Sprint Backlog row for this PBI has a valid canonical `Readiness` value (typically `Ready for Story` or `Blocked` with reason documented)
- [ ] User story file is confirmed to exist and has a valid `Linked Subtask Board` link back to this file
- [ ] BA agent (A03) has been unblocked to begin ST-[ID]-02

---

### ST-[ID]-02 · BA · Materialize Feature Spec and Close Behavior Rules

**Role**: A03 BA Agent — Business rule closure and AC precision
**Status**: `Todo`
**Depends On**: ST-[ID]-01

#### Read First
| File | What to look for |
|------|-----------------|
| `Planning/Stories/[Module]/[US-file].md` | All ACs in Given/When/Then format — identify any with ambiguous "When" or "Then" |
| `Planning/Backlog/Product_Backlog.md` | Story priority, readiness, dependencies |
| `Analysis/Modules/[Module]/_overview.md` | Business rules, open questions, collection constraints |

#### Task
Convert the approved story slice into the canonical `Feature Spec Lite`. Review every AC in the story. For each ambiguous criterion, make a decision and update the AC or the feature spec so downstream agents do not have to infer behavior. Close or explicitly block the required business rules, role/permission rules, state transitions, error flows, event dependencies, and data assumptions. Document any non-obvious decision in the story `Notes` section and in the feature spec.

#### Produce
| What | Where | Format |
|------|-------|--------|
| Feature Spec file | `Analysis/Features/.../[F-ID]_[Name]_Feature_Spec.md` or project-equivalent canonical feature path | Fill `T-Feature-Spec-Lite` and promote to `Feature Ready for UX` if legal |
| ACs updated (if any were ambiguous) | `Planning/Stories/[Module]/[US-file].md` | Edit AC table rows directly |
| Decision log (if decisions were made) | `Planning/Stories/[Module]/[US-file].md` — Notes section | Bullet list: "Decision: [what], Rationale: [why]" |
| This subtask status | `STB-[ID].md` summary table | Set ST-[ID]-02 → `Done` |

#### Done When
- [ ] Every AC has a concrete, testable "Then" clause — no vague language like "works correctly"
- [ ] Feature Spec exists and is at least `Feature Ready for UX`
- [ ] All open questions relevant to this story in `_overview.md` are either answered or explicitly deferred with a note
- [ ] UX (A06) is unblocked to begin ST-[ID]-03

---

### ST-[ID]-03 · UX · Design Sitemap, Screens, States, and Interactions from Feature Spec

**Role**: A06 UX/UI Agent — Screen layout, component selection, interaction design
**Status**: `Todo`
**Depends On**: ST-[ID]-02

#### Read First
| File | What to look for |
|------|-----------------|
| `Analysis/Features/.../[F-ID]_[Name]_Feature_Spec.md` | Canonical task flow, alternate flows, error flows, role logic, permissions, and touchpoints |
| `Planning/Stories/[Module]/[US-file].md` | Final ACs, Scope (In/Out), Notes, Linked Artifacts |
| `Analysis/Modules/[Module]/_overview.md` | Business rules relevant to display |

#### Task
Design the UI for this feature from the `Feature Spec`. Materialize `Sitemap + Flow Matrix`, then map each AC and each relevant feature flow/state to one or more screen specs. Specify layout, information hierarchy, empty/loading/error/blocked states, responsive notes, and interaction behavior needed for FE Preview. If a UX behavior is not backed by the Feature Spec, record it as an open question instead of silently inventing it.

#### Produce
| What | Where | Format |
|------|-------|--------|
| Sitemap + Flow Matrix | `Design/Sitemap/...` + `Design/Flow_Matrix/...` | Feature-to-screen routing authority |
| Screen spec files | `Design/UXUI_Screens/.../SCR-...md` | One file per screen / drawer / modal |
| This subtask status | `STB-[ID].md` summary table | Set ST-[ID]-03 → `Done` |

#### Done When
- [ ] Every AC has a corresponding UI element or state identified
- [ ] Every critical feature main/alternate/error flow has a corresponding UI path or state
- [ ] Empty, loading, and error states are designed
- [ ] FE Preview agent (A07) can begin ST-[ID]-04 using this document alone

---

### ST-[ID]-04 · FE · Build FE Preview with Mock / Stub Data

**Role**: A07 FE Builder — Preview implementation for review and iteration
**Status**: `Todo`
**Depends On**: ST-[ID]-03

#### Read First
| File | What to look for |
|------|-----------------|
| `Design/UXUI_Screens/...` | Screen specs, layout, component map, interaction states |
| `Design/Sitemap/...` + `Design/Flow_Matrix/...` | Feature-to-screen routing authority |
| `Analysis/Features/.../[F-ID]_[Name]_Feature_Spec.md` | Behavior rules that FE Preview must respect |
| `Planning/Stories/[Module]/[US-file].md` | All ACs and scope boundaries |
| `STB-[ID].md` | Release rule and preview notes |

#### Task
Build the FE Preview from `Screen Specs + Sitemap/Flow Matrix + Feature Spec` using mock data or stub adapters only. The goal is a reviewable frontend that proves task flow, state transitions, and visual hierarchy before BE starts. Do not invent real endpoints. If mock assumptions are needed, document them in FE preview notes or inline comments so they can later be folded into `Integration Spec`.

#### Produce
| What | Where | Format |
|------|-------|--------|
| FE Preview implementation | Project FE codebase | React/Vue preview components using mock/stub data |
| FE Preview notes | Story Notes, preview README, or implementation notes | Mock assumptions, unresolved edge cases, preview-only constraints |
| This subtask status | `STB-[ID].md` summary table | Set ST-[ID]-04 → `Done` |

#### Done When
- [ ] Frontend is reviewable by PM / Business Owner
- [ ] Preview respects current Feature Spec behavior and approved screen specs
- [ ] Mock/stub data assumptions are explicit
- [ ] PM can run ST-[ID]-05 without needing backend work first

---

### ST-[ID]-05 · PM / Review · Review FE Preview and Absorb Feedback

**Role**: A01 PM Agent — review orchestration and gate control
**Status**: `Todo`
**Depends On**: ST-[ID]-04

#### Read First
| File | What to look for |
|------|-----------------|
| FE Preview implementation | Actual reviewable frontend |
| `Planning/Stories/[Module]/[US-file].md` | Scope, ACs, and any newly surfaced open questions |
| `Analysis/Features/SRS/[F-ID]_[Name].md` | Current behavior baseline |
| `Design/UXUI_Features/UXUI-[F-ID]_[Name].md` | Current UX baseline |

#### Task
Run FE Preview review with the Business Owner or PM. Capture feedback, classify it as visual-only or behavior-changing, and ensure behavior-changing feedback is folded back into `User Story`, `Feature SRS`, and `UXUI` before BE starts. If the preview is rejected, block BE and loop back to FE/UX/BA as needed.

#### Produce
| What | Where | Format |
|------|-------|--------|
| Review decision | `STB-[ID].md` or Sprint Backlog notes | Approved / Needs Changes / Blocked |
| Updated story/spec docs | `Planning/Stories/...`, `Feature SRS`, `UXUI` | Only if feedback changes behavior or interaction contract |
| This subtask status | `STB-[ID].md` summary table | Set ST-[ID]-05 → `Done` |

#### Done When
- [ ] FE Preview has a clear review outcome
- [ ] Any behavior-changing feedback has been absorbed into Story / SRS / UXUI
- [ ] PM has explicitly decided whether the story may proceed to technical closure
- [ ] A05 is unblocked to begin ST-[ID]-06

---

### ST-[ID]-06 · Tech Lead · Materialize Integration Spec for BE and Real Integration

**Role**: A05 Tech Lead — Technical handoff after FE direction is stable
**Status**: `Todo`
**Depends On**: ST-[ID]-05

#### Read First
| File | What to look for |
|------|-----------------|
| `Analysis/Features/SRS/[F-ID]_[Name].md` | Finalized behavior baseline after FE review |
| `Design/UXUI_Features/UXUI-[F-ID]_[Name].md` | FE-reviewed UI behavior and state usage |
| FE Preview notes / review output | Proven frontend assumptions that now need technical closure |
| `Analysis/Modules/[Module]/_overview.md` | Data collections, business rules, referenced systems |

#### Task
Translate the FE-reviewed story into the approved technical handoff for BE and real integration. By default, create `Integration Spec`; only use split `Architecture + API Contract + Data Mapping` if PM explicitly chooses the deeper pack. Define data shape, endpoint behavior, validation ownership, tenancy/security constraints, event/state mapping, and any integration notes needed for A08 and A07 integration work.

#### Produce
| What | Where | Format |
|------|-------|--------|
| Integration Spec | `Architecture/[Module]/[F-ID]_[Name]_Integration_Spec.md` or canonical lean technical path | Fill `T-Integration-Spec` and promote to `Approved` if legal |
| This subtask status | `STB-[ID].md` summary table | Set ST-[ID]-06 → `Done` |

#### Done When
- [ ] Technical handoff artifact exists and is approved
- [ ] No unresolved contradiction remains between SRS, UXUI, preview behavior, and technical contract
- [ ] A08 and A07 can begin real integration work without inventing backend behavior

---

### ST-[ID]-07 · BE · Implement Backend Endpoint and Data Logic

**Role**: A08 BE Builder — Directus configuration, API implementation, integration logic
**Status**: `Todo`
**Depends On**: ST-[ID]-06

#### Read First
| File | What to look for |
|------|-----------------|
| `Architecture/[Module]/[F-ID]_[Name]_Integration_Spec.md` | API/data/event contract, security, ownership |
| `Planning/Stories/[Module]/[US-file].md` | ACs — especially validation, edge cases, and permissions |
| `Analysis/Features/SRS/[F-ID]_[Name].md` | Business rules, state logic, and error behavior |

#### Task
Implement the backend and integration logic exactly to the approved technical handoff. Configure Directus collections/permissions, endpoints, flows, and any supporting services. Document any required deviations and re-open PM review if the deviation changes the contract.

#### Produce
| What | Where | Format |
|------|-------|--------|
| Backend implementation | Backend / Directus environment and codebase | APIs, flows, data logic |
| Evidence of contract verification | Technical handoff artifact or implementation notes | Endpoint tests, permission checks, notable deviations |
| This subtask status | `STB-[ID].md` summary table | Set ST-[ID]-07 → `Done` |

#### Done When
- [ ] Backend respects the approved technical handoff
- [ ] Critical endpoints and integration logic work
- [ ] Tenancy/security behavior is verified
- [ ] A07 can begin ST-[ID]-08

---

### ST-[ID]-08 · FE · Integrate FE Preview with Real Backend

**Role**: A07 FE Builder — Real integration after preview approval
**Status**: `Todo`
**Depends On**: ST-[ID]-07

#### Read First
| File | What to look for |
|------|-----------------|
| FE Preview implementation | Existing preview baseline to preserve |
| `Architecture/[Module]/[F-ID]_[Name]_Integration_Spec.md` | Real API/data contract |
| `Design/UXUI_Features/UXUI-[F-ID]_[Name].md` | Approved UX baseline |
| `Analysis/Features/SRS/[F-ID]_[Name].md` | Behavior and error-state expectations |

#### Task
Replace mock/stub adapters with real backend integration while preserving the FE Preview behavior already reviewed. Align client validation, loading, error, and state handling with the approved technical handoff. Escalate any contract mismatch immediately instead of patching around it silently.

#### Produce
| What | Where | Format |
|------|-------|--------|
| Integrated frontend | Project FE codebase | FE connected to real backend |
| Integration notes | FE implementation notes or story Notes section | Any mismatch, workaround, or decision requiring follow-up |
| This subtask status | `STB-[ID].md` summary table | Set ST-[ID]-08 → `Done` |

#### Done When
- [ ] FE uses real backend data instead of preview-only stubs
- [ ] Reviewed FE behavior is preserved after integration
- [ ] Error, loading, and empty states still satisfy UXUI and SRS
- [ ] QA may begin ST-[ID]-09

---

### ST-[ID]-09 · QA · Verify AC Coverage and Run Regression

**Role**: A09 QA Agent — Test execution and sign-off
**Status**: `Todo`
**Depends On**: ST-[ID]-08

#### Read First
| File | What to look for |
|------|-----------------|
| `Planning/Stories/[Module]/[US-file].md` | Every AC — your test plan must cover all of them |
| `Analysis/Features/SRS/[F-ID]_[Name].md` | Canonical behavior, state rules, and error logic |
| `Design/UXUI_Features/UXUI-[F-ID]_[Name].md` | Approved UI states and interaction model |
| `Architecture/[Module]/[F-ID]_[Name]_Integration_Spec.md` | Technical contract and tenancy/security expectations |

#### Task
Write and execute a test case for each AC. For each AC: set up the Given precondition, perform the When action, verify the Then result matches exactly. Pay special attention to multi-tenancy, edge cases, FE-reviewed behavior preservation, and any integration-specific validation or state transitions.

#### Produce
| What | Where | Format |
|------|-------|--------|
| Test case file | `Test/Cases/[F-ID]_[Name]_Test_Cases.md` | Table: AC ID · Test Scenario · Steps · Expected · Actual · Pass/Fail |
| Any P0/P1 bugs found | Bug report in `Test/Bugs/` or inline in test file | Title, Steps to Reproduce, Expected, Actual, Severity |
| This subtask status | `STB-[ID].md` summary table | Set ST-[ID]-09 → `Done` |

#### Done When
- [ ] Every AC has at least one passing test case with evidence
- [ ] Multi-tenancy / permission rules are explicitly tested where applicable
- [ ] Zero P0 bugs open (P1 bugs logged and triaged)
- [ ] Story status can be updated to `Done` in Sprint Backlog

---

## Handoff Rules

- After **ST-[ID]-01** (PM Done): BA may begin ST-[ID]-02.
- After **ST-[ID]-02** (BA Done): UX may begin ST-[ID]-03.
- After **ST-[ID]-03** (UX Done): FE may begin ST-[ID]-04.
- After **ST-[ID]-04** (FE Preview Done): PM review begins ST-[ID]-05.
- After **ST-[ID]-05** (review complete and preview accepted): Tech Lead may begin ST-[ID]-06.
- After **ST-[ID]-06** (technical handoff approved): BE may begin ST-[ID]-07.
- After **ST-[ID]-07** (BE Done): FE may begin ST-[ID]-08.
- After **ST-[ID]-08** (FE integration Done): QA may begin ST-[ID]-09.
- PM (A01) is responsible for updating status column after each handoff and unblocking the next agent.
