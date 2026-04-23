---
name: gate-check
description: "Verify quality gate checklist before transitioning between MIABOS pipeline phases (PB-0X to PB-0Y). Blocks transition if requirements not met. Use before any phase handoff."
agent: A01
phase: All transitions
input: "Source phase (PB-0X), target phase (PB-0Y), project path"
output: "Gate check report: PASS or BLOCK with specific reasons"
template: null
---

# Quality Gate Check

## Purpose

Verify that all gate requirements are met before transitioning to the next pipeline phase. If any requirement fails, the transition is BLOCKED with specific remediation steps.

## Instructions

### Step 1: Identify the Gate

Determine which gate to check based on input:
- PB-01 → PB-02: Intake complete
- PB-02 → PB-03: Analysis complete
- PB-03 → PB-04: Design complete
- PB-04 → PB-05: Build complete
- PB-05 → PB-06: Test complete
- PB-06 → Done: Ship complete

### Step 2: Read Gate Requirements

Read the corresponding Playbook file for the gate checklist:
- `00_Agent_OS/Playbooks/PB-0X_*.md` → "Gate: PB-0X → PB-0Y" section

### Step 3: Verify Each Requirement

For each gate requirement:
1. Check if the artifact exists (read the file)
2. Check if the status is correct (Draft / Feature Ready for UX / Approved / etc.)
3. Check if content is complete (not just a skeleton)

### Step 4: Produce Gate Report

```markdown
## Gate Check: PB-0X → PB-0Y
**Project**: [name]
**Date**: YYYY-MM-DD
**Checked by**: A01 PM Agent

### Results
| # | Requirement | Status | Evidence | Notes |
|---|-------------|--------|----------|-------|
| 1 | [requirement] | PASS / FAIL | [file link] | [if FAIL: what's missing] |

### Verdict: PASS / BLOCK

### If BLOCKED — Remediation
| # | What's Missing | Owner Agent | Action Required |
|---|---------------|-------------|----------------|
```

### Step 5: Act on Verdict

- **PASS**: Announce transition approved, notify next-phase lead agents
- **BLOCK**: List specific remediation items, assign to responsible agents, do NOT proceed

## Quality Checks

- [ ] Every gate requirement checked with evidence
- [ ] FAIL items have specific remediation steps
- [ ] Responsible agent identified for each FAIL item
- [ ] Session logged after gate check (trigger `session-log` skill)
