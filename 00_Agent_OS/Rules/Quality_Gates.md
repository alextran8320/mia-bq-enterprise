# Quality Gates — MIABOS

Every phase transition is guarded by a quality gate. **No gate, no pass.**
[[A01_PM_Agent|PM Agent]] enforces all gates.

---

## Universal Logging Gate

These checks apply before any phase transition or session close involving artifact changes.

- [ ] No silent CRUD remains unresolved from the current or a previously discovered work block
- [ ] The full logging chain is complete for the work block being handed off: Daily Log, Session Log, `_session_index.md`, `_current_context.md`, and project `_project.md` Session Timeline when relevant
- [ ] The responsible AI/channel is recorded in the logs, with model/environment when known
- [ ] No agent is relying on "another model will log later" as a handoff assumption
- [ ] `02_Sessions/` contains only logs/control-plane artifacts; any imported analysis or delivery artifact has been relocated to its canonical folder before session close

## Gate 1: Start → PB-01

- [ ] Business Owner input exists (text, MOM, file, idea)
- [ ] PM loaded KB context
- [ ] Daily Log created/updated
- [ ] No previously discovered silent CRUD remains unrepaired

## Gate 2: PB-01 → PB-02

- [ ] Raw input processed and structured
- [ ] Requirements Mapping exists with domain/collection references
- [ ] Scope confirmed by Business Owner
- [ ] Impacted products identified (Smart/Spring/Scale/Platform)
- [ ] MOM processed (if meeting-sourced input)
- [ ] Session logged by A12

## Gate 3: PB-02 → PB-03

- [ ] Business case validated (GO decision from A04)
- [ ] Customer insights documented (A10)
- [ ] PRD exists and is `Approved`
- [ ] Product Backlog exists and is prioritized at the `User Story` level
- [ ] Sprint Backlog identifies the near-term in-scope user stories
- [ ] User stories have AC IDs
- [ ] Success metrics defined
- [ ] **PRD User Task Flow section exists for each in-scope feature**
- [ ] Feature SRS exists for every in-scope story slice entering design
- [ ] Feature SRS and BA/PO analysis artifacts live under `01_Projects/[project]/Analysis/` and are not misfiled in `02_Sessions/` or raw-input folders
- [ ] Feature Registry and Traceability Matrix are updated for every in-scope Feature SRS
- [ ] Feature SRS is `SRS Ready` for every in-scope story slice before canonical UI/UX starts
- [ ] Each in-scope `User Story` carries planning context directly: problem, trigger, happy path, dependencies, and AC IDs
- [ ] Any requirement ambiguity affecting scope, behavior, data, permissions, copy, validation, or integration has been explicitly confirmed by PM / Business Owner or is logged as a blocker
- [ ] Boss approved feature slice
- [ ] Session logged by A12

## Gate 4A: Design Direction Approved

- [ ] 2-3 design directions proposed
- [ ] Boss selected direction

## Gate 4B: Mockups Signed Off

- [ ] Design System exists/updated
- [ ] Mockups exist for all in-scope screens
- [ ] UXUI Feature Specs exist per feature
- [ ] Linked Feature SRS is cited in every UXUI Feature Spec
- [ ] Linked Feature SRS remains at least `SRS Ready` while UXUI work is open
- [ ] **UXUI Feature Spec has §0 User & Task (mandatory behavioral section)**
- [ ] **UXUI Feature Spec has §2.1 Task Flow (5–7 steps documented)**
- [ ] **UXUI Feature Spec has §5.1 Error & Recovery (common errors + dead-end prevention)**
- [ ] Vietnamese copy complete
- [ ] Boss signed off on mockups

## Gate 4C: FE Preview Start Gate

- [ ] PRD exists and is `Approved`
- [ ] User Story exists in Sprint Backlog and is approved for execution
- [ ] Feature SRS is at least `SRS Ready`
- [ ] UXUI Feature Spec is `Approved`
- [ ] Subtask Board exists and explicitly marks `FE Preview` as allowed
- [ ] Subtask Board contains confirmed decisions, write scope, execution steps, evidence requirements, and explicit do-not-assume rules for the assigned agent
- [ ] No unresolved requirement ambiguity remains at FE Preview start; anything unclear is blocked pending PM / Business Owner confirmation
- [ ] Mock/stub data contract is explicit in UXUI, Subtask Board, or FE preview notes
- [ ] FE preview does not rely on invented backend endpoints

## Gate 5: FE Preview Review → BE / Integration Start Gate

- [ ] FE Preview exists and is reviewable by the Business Owner or PM
- [ ] FE Preview feedback has been captured
- [ ] Any behavior-changing feedback is folded back into `User Story`, `Feature SRS`, and `UXUI`
- [ ] Feature SRS is promoted to `Build Ready`
- [ ] `Integration Spec` exists and is `Approved`, OR the explicit split pack `Architecture + API Contract + Data Mapping` is `Approved`
- [ ] PM has explicitly opened backend/integration work for the story
- [ ] No unresolved requirement ambiguity remains for backend/integration work; anything unclear has been confirmed by PM / Business Owner or blocked
- [ ] Cross-check passed: `SRS ↔ UXUI ↔ Integration Spec (or split pack) ↔ BE scope`

## Gate 6: BE / Integration Build → PB-05

- [ ] FE Preview approved or accepted as the UI baseline for integration
- [ ] Feature SRS was `Build Ready` at integration build start
- [ ] UXUI Feature Spec was `Approved` at integration build start
- [ ] Technical handoff artifact (`Integration Spec` or split pack) was `Approved` at build start
- [ ] **Every screen has 1 primary goal identified**
- [ ] **Form fields classified: Required / Optional / Advanced**
- [ ] **Task main flow completable in ≤7 steps with no dead-end**
- [ ] **A07 Pre-Build Checklist complete (§0/§2.1/§5.1 acknowledged, field-to-label mapping done)**

- [ ] Session logged by A12

**Frontend (A07):**
- [ ] Mid-build A06 checkpoint PASSED
- [ ] Full A06 visual audit PASSED
- [ ] Verified demo/runtime evidence saved; screenshots are optional unless explicitly requested
- [ ] All interactive states implemented

**Backend (A08):**
- [ ] Technical handoff artifact was `Approved` at build start
- [ ] Critical endpoints respond correctly per API Contract
- [ ] Webhook idempotency implemented
- [ ] Integration error handling in place
- [ ] Multi-tenancy preserved

**Combined:**
- [ ] E2E workflow functional
- [ ] Session logged by A12

## Gate 7: PB-05 → PB-06

- [ ] Test cases cover 100% of AC codes
- [ ] **Task completion test cases exist for every feature (≥1 per feature)**
- [ ] **Task completion tests passed (primary flow achievable in documented steps)**
- [ ] Tests map to Feature ID + AC ID
- [ ] 5-layer testing completed (API + Data + E2E + Integration + AI)
- [ ] All tests passed
- [ ] Beauty score ≥ 8/10
- [ ] No critical/high bugs open
- [ ] **No open UX-Blocking bugs**
- [ ] Sign-off certificate created
- [ ] Session logged by A12

## Gate 8: PB-06 → Done

- [ ] Boss reviews and says PASS
- [ ] Deployed to production (if applicable)
- [ ] Metrics dashboard set up
- [ ] Retrospective completed
- [ ] Knowledge Bank updated
- [ ] Release notes published
- [ ] Final session logged
