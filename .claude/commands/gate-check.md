---
description: Verify MIABOS quality gate checklist before transitioning between pipeline phases (PB-0X to PB-0Y)
argument-hint: "<from-phase> <to-phase> e.g. PB-02 PB-03"
---

# /gate-check — Quality Gate Verification

Run the quality gate checklist to verify readiness for phase transition.

## Before Starting

1. Read the skill: `00_Agent_OS/Skills/miabos-ops/skills/gate-check/SKILL.md`
2. Read: `00_Agent_OS/Rules/Quality_Gates.md`
3. Read: `00_Agent_OS/References/Document_Status_Model.md`

## Invocation

```
/gate-check PB-01 PB-02
/gate-check PB-03 PB-04
```

## Workflow

Follow the instructions in the SKILL.md file exactly.
