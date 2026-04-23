---
name: write-user-stories
description: "Break a feature into user stories with acceptance criteria following MIABOS conventions. Each story carries user problem, trigger, happy path, dependencies, and AC context. Use when transitioning from PRD/Research direction to backlog items."
agent: A03
phase: PB-02
input: "PRD section, Feature Brief, or raw feature description"
output: "User stories in project _backlog.md or Analysis/ folder"
template: "00_Agent_OS/Templates/T-User-Story-AC.md"
---

# Write User Stories

## Purpose

Break a feature into implementable user stories that carry enough context for BA to write Feature Spec Lite without guessing.

## Instructions

### Step 1: Read Inputs

1. Read the **PRD** — especially User Task Flow section
2. Read any **Feature Brief** or raw description from PM/PO
3. Reference `database_schema.json` domain map for data context
4. Check existing stories in project `_backlog.md` to avoid duplication

### Step 2: Decompose into Stories

For each distinct user task, write a story following T-User-Story-AC:

**Story format:**
```
As a [user role], I want to [action] so that [value/outcome].
```

**Each story MUST include:**
- **User Problem**: What pain does this solve?
- **Trigger**: What event starts this task?
- **Happy Path**: 3-5 step main flow
- **Dependencies**: Other stories, APIs, or data this needs
- **AC IDs**: Acceptance criteria with unique IDs (AC-FXXX-01, AC-FXXX-02, ...)

### Step 3: Prioritize

Tag each story:
- **Priority**: P0 (Must Have) / P1 (Should Have) / P2 (Nice to Have)
- **Product**: `[SMART]` / `[SPRING]` / `[SCALE]` / `[PLATFORM]`
- **Feature ID**: Link to parent feature (F-MXX-XXX)

### Step 4: Validate INVEST Criteria

Each story should be:
- **I**ndependent — can be built separately
- **N**egotiable — not a contract, open for discussion
- **V**aluable — delivers user/business value
- **E**stimable — small enough to estimate
- **S**mall — fits in one sprint/iteration
- **T**estable — AC are verifiable

### Step 5: Add to Backlog

- Add stories to project `_backlog.md`
- Order by priority within the feature group
- Flag any story that is too large for splitting

## Quality Checks

- [ ] Follows T-User-Story-AC template
- [ ] Each story has: user problem, trigger, happy path, dependencies
- [ ] Each story has unique AC-IDs
- [ ] Stories tagged with priority + product + feature ID
- [ ] INVEST criteria met
- [ ] No duplicate stories in existing backlog
