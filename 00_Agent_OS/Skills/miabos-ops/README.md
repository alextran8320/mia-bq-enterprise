# miabos-ops

**Cross-cutting operational skills** — session logging, quality gates, and context synchronization. These skills enforce MIABOS process compliance across all phases.

## Skills (3)

- **session-log** — Create/update session log with full logging chain compliance (Daily Log + Session Log + indexes).
- **gate-check** — Verify quality gate checklist before phase transition (PB-0X → PB-0Y).
- **sync-context** — Update _current_context.md, _session_index.md, and Daily Log after artifact-changing work.

## Commands

| Command | Description |
|---------|-------------|
| `/miabos-ops:log` | Create or update session log |
| `/miabos-ops:gate-check` | Run quality gate checklist |
| `/miabos-ops:sync-context` | Sync all context files |

## Lead Agents

- **A01 PM Agent** — Gate enforcement
- **A11 Knowledge Agent** — Session logging, context sync
