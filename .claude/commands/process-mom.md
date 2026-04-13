---
description: Process a raw MOM transcript into structured MIABOS artifacts (decisions, action items, KB rules)
argument-hint: "<path to MOM file or paste transcript>"
---

# /process-mom — MOM Processing Pipeline

Process raw meeting notes into structured artifacts following the MIABOS A11 Knowledge Agent workflow.

## Before Starting

1. Read the skill definition: `00_Agent_OS/Skills/miabos-intake/skills/process-mom/SKILL.md`
2. Read the MOM template: `00_Agent_OS/Templates/T-MOM.md`
3. Read the session logging runbook: `03_Knowledge_Bank/RUNBOOK_Session_Logging.md`

## Invocation

```
/process-mom 04_Raw_Information/MOM/2026-04-10_Weekly.md
/process-mom [paste transcript directly]
```

## Workflow

Follow the instructions in the SKILL.md file exactly. The skill handles:
1. Reading and parsing raw MOM input
2. Structuring into T-MOM template format
3. Extracting decisions, action items, and KB rules
4. Routing action items to relevant project backlogs
5. Completing the logging chain

## Output Location

- Structured MOM → `04_Raw_Information/MOM/`
- Action items → relevant `01_Projects/[name]/_backlog.md`
- KB rules → `03_Knowledge_Bank/`
