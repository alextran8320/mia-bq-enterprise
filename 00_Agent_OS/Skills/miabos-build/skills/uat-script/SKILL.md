---
name: uat-script
description: "Generate UAT (User Acceptance Testing) scripts for Business Owner or stakeholder testing. Written in Vietnamese, task-oriented, non-technical. Use when preparing for Boss review in PB-05 or PB-06."
agent: A09
phase: PB-05 / PB-06
input: "Feature Spec, Flow Matrix + UXUI Screen Specs, test results"
output: "UAT script in project Test/ folder"
template: null
---

# Generate UAT Script

## Purpose

Create a testing script that the Business Owner or stakeholders can follow to verify features work correctly. Must be non-technical, task-oriented, and in Vietnamese.

## Instructions

### Step 1: Read Inputs

1. Read **Flow Matrix + linked UXUI Screen Specs** — this is the user's journey across screens
2. Read **Feature Spec** — understand business rules and AC
3. Read **test results** — know what passed/failed in QA

### Step 2: Structure UAT Script

```markdown
# UAT Script: [Feature Name]
**Date**: YYYY-MM-DD
**Version**: v1.0
**Prepared by**: A09 QA Agent

## Prerequisites
- Account: [test account details]
- Browser: Chrome / Safari
- Test data: [pre-loaded data description]

## Scenarios
```

### Step 3: Write Scenarios

For each major user flow, write a scenario in Vietnamese:

```markdown
### Scenario 1: [Task Name in Vietnamese]

**Goal**: [What the user is trying to accomplish]

| Step | Action | Expected Result | Pass? |
|------|--------|-----------------|-------|
| 1 | [Vietnamese instruction] | [Vietnamese expected result] | [ ] |
| 2 | ... | ... | [ ] |

**Notes for tester**: [Any context needed]
```

### Step 4: Cover Key Areas

Each UAT script must include scenarios for:
1. **Happy path** — main user flow works end-to-end
2. **Common variations** — different data, different choices
3. **Error handling** — what happens when something goes wrong
4. **Edge cases** — empty states, maximum data, special characters

### Step 5: Add Sign-off Section

```markdown
## Sign-off
| Tester | Date | Result | Notes |
|--------|------|--------|-------|
| | | PASS / FAIL | |

**Overall Verdict**: PASS / FAIL
**Blocking Issues**: [list or "none"]
```

## Quality Checks

- [ ] Written in Vietnamese (non-technical language)
- [ ] Steps are clear enough for non-technical user
- [ ] Happy path + error handling covered
- [ ] Prerequisites clearly stated
- [ ] Sign-off section included
- [ ] Linked to Feature Spec AC-IDs
