---
description: Create or update MIABOS session log with full logging chain compliance (Daily Log + Session Log + indexes)
argument-hint: "<project name or 'auto' to detect from context>"
---

# /session-log — Session Logging

Create or update session log following the mandatory MIABOS logging chain.

## Before Starting

1. Read the skill: `00_Agent_OS/Skills/miabos-ops/skills/session-log/SKILL.md`
2. Read template: `00_Agent_OS/Templates/T-Session-Log.md`
3. Read runbook: `03_Knowledge_Bank/RUNBOOK_Session_Logging.md`

## Invocation

```
/session-log MIABOS
/session-log auto
```

## Workflow

Follow the instructions in the SKILL.md file exactly. The skill handles the full chain:
1. Daily Log (02_Sessions/YYYY-MM-DD_Daily_Log.md)
2. Session Log (02_Sessions/Session_YYYY-MM-DD_Topic.md)
3. _session_index.md update
4. _current_context.md update
5. Project _project.md Session Timeline (if project touched)
