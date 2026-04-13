# Global Rules

These rules are absolute. Every agent must read this before starting any work.

> **Rule Authority**: This file owns all *evergreen OS rules* — structural, process-defining rules that define how the system runs.  
> Learned rules from project experience live in [[Global_Rules|`03_Knowledge_Bank/Global_Rules.md`]].  
> See [[RULE_AUTHORITY|`RULE_AUTHORITY.md`]] for the full governance model.

---

## Rule 0: Brain-First Execution
Before any `run_command` or `write_to_file` in the `Build/` directory, the Agent MUST prove it has read the Project Brain by citing the current Phase and latest Session Log in its internal reasoning. Execution without context is considered negligence.

---

## Communication Rules

1. **Single Point of Contact**: Only [[A01_PM_Agent|PM Agent]] communicates with Business Owner. Other agents work silently.
2. **No Chattiness**: Agents communicate through artifacts, not conversation. No opinions, no tangents.
3. **Clarification Limit**: Maximum 2 rounds of questions, 3 questions per round. However, unresolved requirement ambiguity that affects scope, behavior, state, data, permissions, copy, acceptance, or integration may NOT be resolved by agent assumption; it must be escalated to PM / Business Owner for explicit confirmation.

## Quality Rules

4. **No Skipping Gates**: Every phase transition requires its quality gate to pass. No exceptions.
5. **Templates Are Law**: All artifacts must follow templates from `00_Agent_OS/Templates/`.
6. **Feature SRS Before Canonical UI/UX**: No feature-level UI/UX spec, mockup, or UX subtask may begin as a canonical delivery artifact until the linked `Feature SRS` is at least `SRS Ready`. `PRD` may support discussion and scope alignment only; any pre-SRS concept artifact must be explicitly marked `Non-Binding Concept` and may not be used for gating, subtask release, or build handoff.
7. **PRD Is Mandatory for Business Alignment**: Every delivery slice must trace back to an approved `PRD` with business goal, scope, success metrics, and User Task Flow. No team member may replace the PRD with a story-only or design-only interpretation of the business problem.
8. **Backlog Runs on User Stories**: `Product Backlog` and `Sprint Backlog` use approved `User Stories` as the delivery unit. Features remain traceability and registry objects, but sprint commitment, sequencing, and execution readiness are controlled at the story level.
9. **Feature Brief Is Removed from the Canonical Flow**: Standalone `Feature Brief` artifacts are no longer part of the approved MIABOS process. `User Story` is the only planning artifact between `PRD` and `Feature SRS`, and it must carry the problem, trigger, happy path, dependencies, and AC context required for BA handoff.
10. **Preview-First Delivery Rule**: Frontend work may start in `FE Preview` mode after `PRD + User Story + Feature SRS + UXUI + Subtask Board` are ready. `FE Preview` may use mock data or stub adapters and must not be blocked by missing backend contracts.
11. **No Backend Before Reviewed FE Preview + Integration Spec**: Backend build, real API integration, or Directus configuration may not start until the Business Owner or PM has reviewed the FE Preview, any behavior-changing feedback has been folded back into `SRS/UXUI`, and an approved `Integration Spec` (or explicitly approved split technical pack) exists.
12. **Cross-Check Before Integrated Build**: The final technical handoff for real integration must verify `SRS ↔ UXUI ↔ Integration Spec ↔ QA scope` consistency before BE start or FE-to-BE integration.
13. **No Silent Requirement Invention**: If any requirement is unclear and affects scope, behavior, data, state transitions, permissions, user-facing copy, validation, or integration behavior, the agent may propose options but MUST ask PM / Business Owner for confirmation before updating canonical specs, releasing subtasks, implementing code, or promoting status.
14. **Subtask Board Is the Steel Shield**: No execution subtask is legal unless the linked `Subtask Board` is detailed enough to act as an implementation plan for the assigned agent. If the board lacks confirmed decisions, in-scope/out-of-scope boundaries, write scope, execution steps, evidence requirements, or do-not-assume rules, PM must block execution.
15. **100% AC Coverage**: QA must have test cases covering every Acceptance Criteria code in the PRD.
16. **Mandatory Verified Demo**: Every phase transition (e.g., Build → QA, QA → UAT) requires a `Verified Demo` artifact. The agent MUST:
    - Automatically start the browser and perform a live demo of the feature.
    - Record the interaction (`.webp`) and embed it in the `walkthrough.md`.
    - Provide raw log proofs showing backend logic verification.
    - Explicitly fix all bugs found during the demo BEFORE handing off.

## Structural Rules

17. **OS is Read-Only**: Never modify `00_Agent_OS/` during project work unless explicitly performing OS Hardening approved by the Business Owner.
18. **Projects Are Isolated**: Each project gets its own folder under `01_Projects/`. No cross-contamination.
19. **Log Only Artifact-Changing Work**: A session log is required only when an AI creates, updates, deletes, restructures, or promotes canonical workspace artifacts. Pure question-answering, explanation-only, brainstorming-only, or advisory exchanges without artifact changes must NOT create a session log.
20. **Knowledge Compounds**: After each project cycle, extract rules and add to Knowledge Bank. Only [[A01_PM_Agent|PM Agent]] writes to Knowledge Bank.
21. **Mandatory Design Fidelity**: Every project with a UI component MUST satisfy a `High-Fidelity Design` gate. The [[A03_Builder_Agent|Builder Agent]] is forbidden from writing code until the [[A06_UI_UX_Agent|A06 UI/UX Agent]] and Business Owner sign off on visual mockups. Mockups must meet "Premium" standards defined in [[Visual_Standards]].
21A. **Vietnamese-First Workspace Standard**: Nội dung tài liệu chuẩn, status descriptions, metadata values, backlog artifacts, sprint artifacts, session-log content, và operating instructions MUST được viết bằng tiếng Việt theo mặc định trừ khi Business Owner yêu cầu rõ một ngôn ngữ khác.
21B. **English-Safe Naming Convention is Mandatory**: Folder và file mới MUST giữ English-safe names theo `PascalCase`, `snake_case`, hoặc canonical template naming patterns đã được OS định nghĩa. Stable technical identifiers, tên file, và tên folder nên tiếp tục English-safe để bảo toàn interoperability giữa các tool và AI models.
21C. **Business Language Flexibility**: Product UI copy, campaign copy, chatbot responses, customer-facing text, và proposal/delivery artifacts có thể dùng tiếng Việt hoặc các business-required languages khác. Khi không có yêu cầu ngôn ngữ cụ thể, mặc định dùng tiếng Việt cho nội dung artifact và giữ naming conventions ở mức English-safe.

21D. **Analysis/ Folder Is Mandatory Inside Every Project**: Mỗi project trong `01_Projects/` PHẢI có subfolder `Analysis/` theo đúng cấu trúc template trong `01_Projects/_template/Analysis/`. Toàn bộ tài liệu phân tích của A02 (PO) và A03 (BA) — bao gồm requirements, domain rules, feature specs, SRS, NFR, decision log, personas, assumptions, glossary — PHẢI được lưu trong `[project]/Analysis/`. Nghiêm cấm để analysis artifacts rải rác ở `04_Raw_Information/`, `02_Sessions/`, root project folder, hay bất kỳ folder nào khác ngoài `[project]/Analysis/`.

21E. **Analysis Artifact Traceability Is Mandatory**: Mỗi file trong `[project]/Analysis/` PHẢI có header metadata gồm `Status`, `Author` (agent name), `Date`, và link về source (raw input hoặc PRD). File thiếu traceability metadata không hợp lệ cho gate transitions và sẽ bị PM Agent block.

## Visual & Design Rules

22. **Visual Standards Are Law**: The [[Visual_Standards]] document is the single source of truth for all visual design decisions. All agents must reference it. All design tokens must comply with it unless explicitly overridden by Business Owner.

23. **Design Direction Before Design System**: [[A06_UI_UX_Agent|A06]] must propose **3** visual directions (brand color + font + photorealistic AI mockup each) and get Business Owner approval BEFORE creating the full Design System. No designing in a vacuum. If all 3 are rejected, A06 researches current global trends and generates 3 new directions. Maximum 3 iteration rounds.

24. **Visual Integrity Gate**: No UI implementation is considered "Done" without a `Verified Demo` showing the interface is stable. The Agent must prove flexbox/grid alignment via browser screenshots and ensure no overflows or disjointed elements exist at standard viewports.

25. **Mid-Build Visual Checkpoint**: After the FIRST screen is implemented, [[A06_UI_UX_Agent|A06]] must review and approve before [[A03_Builder_Agent|Builder]] proceeds to remaining screens. This prevents entire builds going in the wrong visual direction.

26. **Design-First Frontend**: No frontend code may be written until:
    - A visual mockup exists in `Design/Mockups/` for that screen
    - [[Visual_Standards]] has been read
    - Design System tokens are configured in the CSS/Tailwind theme
    - Component library (shadcn/ui, Radix, etc.) is installed
    Builder must reference the specific mockup file when implementing each screen.

27. **Beauty Score Gate**: During QA ([[PB-04_Test_and_Review|PB-04]]), [[A06_UI_UX_Agent|A06]] evaluates a Beauty Score (visual hierarchy, whitespace, color harmony, typography, consistency, polish). Average must be ≥ 8/10. This is separate from Fidelity Score (mockup match).

28. **No Unstyled Defaults**: Every visible HTML element must be explicitly styled. Browser default inputs, buttons, selects, and scrollbars are forbidden in shipped UI. Skeleton shimmer for loading (not spinners for content areas).

29. **Design Retrospective**: After every project UAT, log what looked good and what looked cheap/ugly in the session log and Knowledge Bank. This compounds design quality over time.

## Logging Rules

30. **Artifact-Triggered Auto-Logging is Non-Negotiable**: [[A11_Knowledge_Agent]] MUST log at the end of every artifact-changing work block. This is proactive — do NOT wait for the Business Owner to remind. Failure to log an artifact-changing block is a process violation.
31. **No Log for Advice-Only Exchanges**: If the AI only answers questions, explains, critiques, brainstorms, or recommends without changing workspace artifacts, no Session Log should be created. The workspace must not accumulate noisy logs for talk-only exchanges.
32. **Logging Handshake**: At the START of every artifact-changing work block, verify the Daily Log exists. At the END, create/update Session Log + Daily Log + Session Index + Project Session Timeline. See [[RUNBOOK_Session_Logging|RUNBOOK]].
32A. **CRUD = Logging Trigger**: Creating, updating, renaming, moving, deleting, or structurally reorganizing any canonical file or folder, or changing canonical metadata/control-plane artifacts, counts as artifact-changing work even if the edit looks small. Once CRUD happened, the full logging chain is mandatory.
32B. **Retroactive Log Repair Before Resume**: If any AI/model/channel discovers prior artifact changes without the required logging chain, it must stop normal work and repair the missing logs before continuing. Working on top of silent CRUD without repair is a process violation.
32C. **No Delegated Logging Assumption**: The AI/model/channel that performed or continued the artifact-changing work block must ensure the logging chain is complete before closing. It may not assume another model, another app, or a later session will handle the logs.
32D. **Final Answer Blocked Until Log Sync**: After artifact-changing work, a session is not considered complete and no final delivery is valid until `Daily Log`, `Session Log`, `_session_index.md`, `_current_context.md`, and any required project timeline updates are complete.
33. **AI Channel Attribution is Mandatory**: Every Session Log and every Daily Log work-block entry must record which AI/channel performed the work (e.g. Codex, Cursor, Claude, Gemini, ChatGPT) and, when known, the model or execution environment.
34. **PM Agent Enforces Logging**: [[A01_PM_Agent|PM Agent (A01)]] must verify A08 has completed logging before any gate transition for artifact-changing work. Missing required log = gate blocked.
35. **OS Hardening Sessions Must Be Logged**: Any changes to `00_Agent_OS/` files must be logged in a Session Log, even if no project work was done. OS changes affect all future projects.

## Technical Rules

36. **Idempotency is Mandatory**: All webhook handlers must check unique IDs to prevent duplicate processing.
37. **AI Features Are Blocked Without Prompts**: Any User Story tagged `[NEEDS-AI-PROMPT]` cannot be marked as complete without a corresponding AI Prompt specification.
38. **Golden Thread (Traceability)**: Every artifact created by an Agent MUST include a clickable relative markdown link back to the responsible Agent file in the header.
39. **Artifact Reciprocity**: If a Project Doc links to an Agent, that Agent file should provide top-level context on how it handles such artifacts.
40. **Artifact Status Is Gate-Bearing**: A canonical document may exist and still be illegal to consume. Agents must obey `[[Document_Status_Model]]`; if status is invalid for the next phase, hard stop.
41. **PM Owns Gate-Bearing Promotions**: Document owners may draft and prepare artifacts, but only [[A01_PM_Agent|PM Agent]] may confirm handoff states such as `Build Ready`, `Approved`, or `Done` unless Business Owner approval is explicitly required.

---

_Last updated: 2026-04-14 (added Rule 21D & 21E — Analysis/ subfolder mandatory inside every project; PO & BA artifact routing enforced)_  
_Only [[A01_PM_Agent|PM Agent]] may update this file through the Knowledge Bank update process ([[PB-05_Ship_and_Learn|PB-05]])._  
_Rule 15 updated: "2 directions" → "3 directions" per KB Rule 15._
