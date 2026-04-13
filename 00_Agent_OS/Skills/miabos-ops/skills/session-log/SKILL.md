---
name: session-log
description: "Create or update MIABOS session log with full logging chain compliance. Mandatory at the end of every playbook phase or after any artifact-changing work. Use when closing a work session."
agent: A11
phase: All
input: "Current session context: project, phase, artifacts changed, decisions made"
output: "Daily Log + Session Log + updated indexes"
template: "00_Agent_OS/Templates/T-Session-Log.md"
---

# Session Logging

## Purpose

Complete the mandatory logging chain. This is not optional admin work — it is part of the deliverable. A session is not closed until this chain is complete.

## Instructions

### Step 1: Create/Update Daily Log

Check if `02_Sessions/YYYY-MM-DD_Daily_Log.md` exists:
- **Exists**: Add a time-block entry for this session
- **Missing**: Create it with today's date, then add the entry

Daily Log entry format:
```markdown
### [HH:MM] - [Project] - [Topic]
- **Agent**: [A0X]
- **AI Channel**: [Claude / Codex / Cursor / Gemini / ChatGPT]
- **Phase**: PB-0X
- **Summary**: [1-2 sentences]
- **Session Log**: [[YYYY-MM-DD_Project_Topic]]
```

### Step 2: Create Session Log

Create `02_Sessions/YYYY-MM-DD_[Project]_[Topic].md` using T-Session-Log template.

Fill in:
1. **Header metadata**: Date, Project, Phase, AI Channel, Agent Identity
2. **Strategic Context**: Core objective of this session
3. **Collaborative Deep-Dive**: Decision points, alternatives rejected, rationale
4. **Artifacts Created/Updated**: Table with location, key change, fidelity score
5. **Status Decisions**: Old status → New status with reason
6. **Business Owner Feedback**: Exact quotes or detailed paraphrasing
7. **Rules Extracted**: Any new rules for Knowledge Bank
8. **Next Steps**: Actionable items for next session

### Step 3: Update _session_index.md

Add entry to `02_Sessions/_session_index.md`:
```markdown
| YYYY-MM-DD | [Project] | [Topic] | PB-0X | [AI Channel] | [[Session Log Link]] |
```

### Step 4: Update _current_context.md

Update `02_Sessions/_current_context.md` with:
- Current project state
- Current phase
- Last session reference
- Active blockers
- Next expected action

### Step 5: Update Project Timeline (if project touched)

If a project was touched, add entry to that project's `_project.md` Session Timeline section.

## Quality Checks

- [ ] Daily Log exists and updated
- [ ] Session Log follows T-Session-Log template
- [ ] All artifacts listed with relative links
- [ ] _session_index.md updated
- [ ] _current_context.md updated
- [ ] Project _project.md Session Timeline updated (if project touched)
- [ ] AI Channel and model recorded
- [ ] No silent CRUD — every artifact change documented
