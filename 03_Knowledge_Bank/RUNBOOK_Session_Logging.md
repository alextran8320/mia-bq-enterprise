# RUNBOOK — Session Logging & Daily Logs

**Owner**: [[A01_PM_Agent|PM Agent (A01)]]
**Scope**: Applies to ALL AI working sessions (Claude, Cursor, ChatGPT, Gemini, or any AI tool) related to the Agent OS or any Project.
**Language**: Nội dung tài liệu theo hướng Vietnamese-first. Tên file vẫn giữ canonical English-safe naming pattern.

> **Session Store Authority**: All session logs are stored in `02_Sessions/` ONLY.
> Project-local `Logs/` folders are NOT valid session stores and must not be used.
> See Section 2 for naming conventions and Section 7 for the Ghost Link Repair Procedure.

---

## 1. Core Principles

- **One Daily Log per calendar day**: Every day with artifact-changing AI activity MUST have exactly one `02_Sessions/YYYY-MM-DD_Daily_Log.md`.
- **One Session Log per artifact-changing work block**: Create Session Logs only for work blocks that create, update, delete, or structurally change workspace artifacts.
- **One Current Context Anchor**: `02_Sessions/_current_context.md` must always reflect the latest active topic, latest canonical session log, and the next resume action.
- **Never wait for the Business Owner to ask**: Logging is the agent's default responsibility. A11 Knowledge Agent logs at the end of every playbook phase. PM Agent enforces it.
- **Vietnamese-first operating logs**: Daily Logs và Session Logs nên được viết bằng tiếng Việt theo mặc định. Tên file và stable naming tokens vẫn giữ English-safe để link, parsing rules, và naming conventions tiếp tục ổn định.
- **AI attribution is mandatory**: Every logged work block must record the AI/channel and, when known, the model or execution environment.
- **Silent CRUD is invalid work**: If an AI creates, updates, renames, moves, or deletes canonical artifacts and leaves without completing the logging chain, the work block is incomplete and must be repaired before further normal work continues.
- **Logging cannot be delegated away**: The AI/model/channel closing the work block must ensure the logging chain is complete. "Another model will log later" is not a valid operating assumption.

---

## 2. Session Store Authority & Naming Convention

**Canonical location**: `02_Sessions/` — the ONLY valid folder for all session logs.

**Naming rules**:
| File type | Pattern | Example |
|-----------|---------|---------|
| Daily Log | `YYYY-MM-DD_Daily_Log.md` | `2026-03-17_Daily_Log.md` |
| Topic Session Log | `YYYY-MM-DD_ProjectName_Topic.md` | `2026-03-17_Project_Alpha_Design_System.md` |
| OS Hardening Log | `YYYY-MM-DD_OS_Topic.md` | `2026-03-17_OS_Rule_Authority.md` |
| Current Context Anchor | `_current_context.md` | `_current_context.md` |

**Rules**:
- All dates use the calendar date when work happened (not when the log was written).
- `ProjectName` uses the project folder name exactly (e.g., `Project_Alpha`).
- `Topic` is a 2-4 word summary of the work block.
- `ProjectName` và `Topic` trong tên file phải giữ ở dạng English-safe slug theo canonical naming pattern.
- Never store session logs in project-local `Logs/` folders — only in `02_Sessions/`.
- `_current_context.md` is not a replacement for Session Logs. It is a mandatory resume accelerator pointing to the canonical logs.
- Do NOT create Session Logs for question-only or explanation-only conversations that do not change artifacts.

## 2.5. Current Context Anchor Format

`02_Sessions/_current_context.md` must always include:

- Last updated date
- Active workspace topic
- Current project
- Current phase
- Latest canonical session log link
- Today's Daily Log link
- 3-5 bullet latest decisions
- 1-3 bullet next actions

If this file is stale, update it before continuing work.

---

## 3. Start-of-Block Logging (Logging Handshake)

Before starting any new work block with the Business Owner:

1. Determine today's date in `YYYY-MM-DD` format.
2. Decide whether the upcoming work is **artifact-changing** or **advisory-only**:
   - **Artifact-changing** -> continue with the full logging handshake.
   - **Advisory-only** -> no Session Log is required unless the work later changes artifacts.
3. Check `02_Sessions/` for `YYYY-MM-DD_Daily_Log.md`:
   - **If it exists** -> open it, note the current state.
   - **If it does NOT exist** -> create it by copying the most recent Daily Log as a template, then updating the date and clearing the timeline entries.
4. Update `02_Sessions/_session_index.md`:
   - If today's date does not have a section -> add `### YYYY-MM-DD`.
   - Ensure the first line under the date is: `- [[YYYY-MM-DD_Daily_Log|Daily Log]] - All AI interactions for this day.`
5. Update `02_Sessions/_current_context.md` with the active topic, project, phase, latest canonical session log, and immediate next action.
6. Add a draft entry to the Daily Log Timeline for the current work block (topic only; details added at end), including the AI/channel.

**Hard stop**: If the work is artifact-changing and steps 3-5 are incomplete, substantive work has not officially started.

## 3.5. CRUD Trigger Matrix

Use this table literally. If the action matches any row, logging is mandatory.

| Action Type | Counts as Artifact-Changing? | Examples |
|-------------|------------------------------|----------|
| Create file | Yes | New story, new spec, new log, new template, new screenshot placeholder |
| Update file content | Yes | Editing story text, changing metadata, fixing links, changing checklist state |
| Rename / move file | Yes | Renaming a story, moving docs, relocating logs |
| Delete file | Yes | Removing obsolete artifacts or bad drafts |
| Create / rename / move / delete folder | Yes | Restructuring module folders, moving screenshots, cleanup work |
| Update control-plane artifact | Yes | `_project.md`, backlog, indexes, `_current_context.md`, template files |
| Change status / metadata only | Yes | `Draft -> Approved`, `Blocking Reason`, `Owner`, `Last Updated By` |
| Question-only / explanation-only chat | No | Advice, critique, brainstorming, research summary without edits |
| Planning proposal left only in chat | No | Options, recommendations, structure proposal not yet written to workspace |

If you are unsure, bias toward `Yes`.

## 3.6. Known Failure Modes and Countermeasures

This workspace has a recurring multi-model failure pattern. Use these countermeasures explicitly:

| Failure Mode | Bad Assumption | Required Countermeasure |
|--------------|----------------|--------------------------|
| Minor-edit rationalization | "I only fixed one small thing." | Any canonical CRUD counts. Use the trigger matrix literally. |
| Delegation fantasy | "Another AI/channel will log later." | The current AI must finish the chain before closing. |
| Deliverable-first exit | "The artifact is updated, so I am done." | Treat log sync as part of the deliverable itself. |
| Control-plane omission | "I updated the Session Log, that's enough." | The chain is incomplete until Daily Log, `_session_index.md`, `_current_context.md`, and project timeline are also synced when relevant. |
| Advisory-to-CRUD drift | "This started as advice, so I don't need logs." | The moment canonical artifacts change, the session becomes artifact-changing and the full handshake applies. |

Before any final answer after CRUD, ask:
- Did I change any canonical artifact or metadata?
- Did I sync every required log/control-plane artifact?
- If another model touched this earlier without logs, did I repair that first?

---

## 4. End-of-Block Logging

When an artifact-changing work block completes (e.g., PRD finalized, design approved, bug fixed, OS hardening complete):

1. Create or update the Session Log:
   - **New topic** -> create `02_Sessions/YYYY-MM-DD_ProjectName_Topic.md` from [[T-Session-Log|`T-Session-Log.md`]]. Fill in: Date, Project, Phase, AI Channel, Model/Environment, Agent, Neural Handshake, decisions made, artifacts created/updated, rules extracted, next steps.
   - **Continuing a topic** -> append a new section to the existing Session Log.
2. Update the Daily Log (`02_Sessions/YYYY-MM-DD_Daily_Log.md`):
   - Under the correct time block: list main topics (bullet points), record the AI/channel, and link to the session log just created/updated.
   - Update Key Decisions and Actions & Owners sections.
3. Update `02_Sessions/_current_context.md` so the next model can resume from the finished state rather than the starting state.
4. Update the touched project's `_project.md` Session Timeline if the work block affected a project.
5. Maintain the Golden Thread (see Section 6).

**Close-out hard stop**: An artifact-changing session is not allowed to end while any required log-link in the chain is still missing.

## 4.5. Silent CRUD Recovery Procedure

Use this when you discover that another AI/model/channel changed artifacts but did not log properly.

1. Stop normal feature or delivery work immediately.
2. Determine the earliest date that can be proven for the unlogged change:
   - If today's date is the only reliable fact, use today and clearly mark the recovery as retroactive.
   - Do not invent an exact historical timestamp you cannot verify.
3. Create or repair the Daily Log for the recovery date.
4. Create a recovery Session Log with:
   - `AI Channel` = the model doing the repair
   - explicit note that the original artifact changes were discovered without complete logging
   - list of files/folders that appear to have changed
   - what is verified vs what is inferred
5. Repair `_session_index.md`, `_current_context.md`, and any project `_project.md` Session Timeline affected.
6. If some facts cannot be reconstructed, write `unverifiable` instead of fabricating false precision.
7. Only after the logging chain is repaired may normal work resume.

## 4.6. Session Close Definition

For artifact-changing work, a session is considered `open` until all of the following are true:

- The main artifact edits are complete.
- The Session Log is created or updated.
- The Daily Log entry is created or updated.
- `_session_index.md` is synchronized.
- `_current_context.md` is synchronized.
- The touched project's `_project.md` Session Timeline is updated when relevant.

If any item above is missing, do not treat the session as closed and do not deliver a final completion message.

---

## 5. End-of-Day Checklist

At the end of the day (or when the Business Owner stops working):

1. Open `02_Sessions/YYYY-MM-DD_Daily_Log.md`.
2. Review and complete these four sections:
   - **Timeline** — all major work blocks listed with session log links.
   - **Key Decisions** — all significant decisions made today.
   - **Actions & Owners** — all open tasks with owners.
   - **Risks / Issues / Blockers** — any unresolved issues.
3. Review the **Knowledge & Rules** section:
   - If a new rule was identified today -> plan to add it to `03_Knowledge_Bank/Global_Rules.md` with `[Source: 02_Sessions/YYYY-MM-DD_Topic.md]`.
4. Verify no gaps:
   - No new session log exists without a link in the Daily Log.
   - No project work was done without updating the project's `_project.md` Session Timeline.
   - `_current_context.md` points to the true latest canonical session log.
   - No advisory-only conversation created a noisy log entry by mistake.

---

## 6. The Golden Thread — Bidirectional Link Protocol

Every session creates a chain of bidirectional links. Follow this protocol exactly:

**Projects ↔ Sessions**:
1. When work touches a project, add to `01_Projects/[ProjectName]/_project.md` -> `## Session Timeline`:
   ```markdown
   | YYYY-MM-DD | [[YYYY-MM-DD_ProjectName_Topic|Topic]] | Summary of work done. |
   ```
2. Inside the Session Log, include a link back:
   ```markdown
   **Project**: [[_project|ProjectName]]
   ```

**Sessions ↔ Knowledge Bank**:
1. When a session log extracts a new rule, note the target KB file.
2. Inside the KB file, cite the session origin:
   ```markdown
   [Source: 02_Sessions/YYYY-MM-DD_ProjectName_Topic.md]
   ```

**Projects ↔ Knowledge Bank**:
- `_project.md` must have an `## Applied Rules` section listing which KB rules apply to this project.

---

## 7. Ghost Link Repair Procedure

A "ghost link" is a reference in `_project.md`, `_session_index.md`, or a Daily Log that points to a session file which does not exist.

**Steps to repair a ghost link**:

1. Search for the referenced file at `02_Sessions/YYYY-MM-DD_ProjectName_Topic.md`.
2. Check if the content was created at an alternative path (e.g., a project-local `Logs/` folder).
   - **If found at alternative path** -> move/copy the file to `02_Sessions/` with the correct naming convention, then update all references.
   - **If NOT found anywhere** -> replace the broken link text with the following marker:
     ```
     [GHOST LINK — Session log was not created. Marking as unverifiable.
     Create a new session log when work on this topic resumes.]
     ```
3. Log the ghost link repair in the current session log.

**Prevention**: Always create the session log BEFORE ending the work block (see Section 4). Never assume it will be done later.

---

## 8. Immediate Logging Triggers

Stop and log immediately (do not wait for end of block or end of day) when:

- Business Owner says: "Confirmed", "Decision is", "Keep this option", "Let's go with X" -> log in Daily Log + Session Log immediately.
- Any OS or process rule change occurs.
- Any major incident (critical bug, architecture change, data loss risk).
- Today's Daily Log is missing when a new session starts.

Do **not** log immediately when:

- The AI only answers a question.
- The AI only explains a concept or critiques an idea.
- The conversation ends without any workspace artifact being changed.

---

## 9. Compliance Self-Check

Before ending any session with the Business Owner, PM Agent must verify:

- [ ] Today's `YYYY-MM-DD_Daily_Log.md` exists in `02_Sessions/`.
- [ ] Every major work block has an entry in the Daily Log Timeline.
- [ ] Every major work block has a linked Session Log in `02_Sessions/`.
- [ ] `02_Sessions/_current_context.md` reflects the latest completed work block.
- [ ] Every project touched today has its `_project.md` Session Timeline updated.
- [ ] `02_Sessions/_session_index.md` has an entry for today.
- [ ] No ghost links were created today (or any found were repaired).
- [ ] Any new KB rule has a `[Source: ...]` citation.
- [ ] Every logged work block records the AI/channel and model/environment when known.
- [ ] No advisory-only exchange was logged by mistake.
- [ ] No AI/model/channel performed silent CRUD today; if one did, the recovery procedure was completed before more work continued.
- [ ] No work block relied on "another model will log later" as a substitute for actual log completion.

**If any item is unchecked -> do NOT close the session until it is resolved.**

---

_Last updated: 2026-03-30 (silent CRUD trigger matrix, retroactive repair procedure, and anti-forget countermeasures added)_
_[[A01_PM_Agent|PM Agent (A01)]] owns this file._
