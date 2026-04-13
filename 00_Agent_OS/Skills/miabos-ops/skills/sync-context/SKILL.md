---
name: sync-context
description: "Update all MIABOS context-tracking files after artifact-changing work: _current_context.md, _session_index.md, and Daily Log. Lightweight version of session-log for mid-session syncs."
agent: A11 / A01
phase: All
input: "Current work context (auto-detect from recent changes)"
output: "Updated context files in 02_Sessions/"
template: null
---

# Sync Context Files

## Purpose

Quick sync of context-tracking files after artifact-changing work within an ongoing session. Use this between major work blocks when a full session log is not yet warranted.

## Instructions

### Step 1: Detect What Changed

Scan recent work in the current session:
- Which files were created, modified, or deleted?
- Which project(s) were touched?
- What phase are we in?

### Step 2: Update _current_context.md

Update `02_Sessions/_current_context.md` with current state:

```markdown
## Current Context
**Last Updated**: YYYY-MM-DD HH:MM
**Active Project**: [name]
**Current Phase**: PB-0X
**AI Channel**: [Claude / Codex / Cursor / etc.]
**Last Session**: [[link to latest session log]]

### Active Work
- [What's being worked on right now]

### Blockers
- [Any active blockers, or "None"]

### Next Action
- [What should happen next]
```

### Step 3: Ensure Daily Log Exists

If `02_Sessions/YYYY-MM-DD_Daily_Log.md` doesn't exist, create it.

### Step 4: Quick Index Check

Verify `02_Sessions/_session_index.md` has the latest session entry. If the current session doesn't have a Session Log yet, note that one will be created at session close.

## Quality Checks

- [ ] _current_context.md reflects actual current state
- [ ] Daily Log exists for today
- [ ] No stale context (dates, phases, blockers are current)
