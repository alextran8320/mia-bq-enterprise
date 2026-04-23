# MIABOS Skills Registry

> **FOR ANY AI READING THIS FILE** (Claude, Codex, Qwen, Gemini, Cursor, ChatGPT, or any AI tool):
> This is the **master index of all executable skills** in the MIABOS workspace.
> Skills are reusable prompt templates that standardize how AI agents perform recurring tasks.
>
> **How to use a skill**: Read the relevant `SKILL.md` file, then follow its instructions exactly.
> Skills reference templates in `00_Agent_OS/Templates/` — always use those templates for output format.
>
> **Claude Code users**: Skills are also available as `/slash-commands` (see `.claude/commands/`).

---

## How Skills Work

```
User request → AI identifies matching skill → Reads SKILL.md → Follows instructions → Produces standardized output
```

Each skill contains:
- **Purpose**: What the skill does
- **Context**: MIABOS-specific background
- **Instructions**: Step-by-step execution guide
- **Output Template**: Expected format (links to `00_Agent_OS/Templates/`)
- **Quality Checks**: Validation before delivering output

---

## Skill Groups

### miabos-intake (PB-01: Discovery & Intake)

| Skill | File | Agent | Description |
|-------|------|-------|-------------|
| `process-mom` | [SKILL.md](miabos-intake/skills/process-mom/SKILL.md) | A11 | Process raw MOM transcript → structured decisions, action items, KB rules |
| `create-project` | [SKILL.md](miabos-intake/skills/create-project/SKILL.md) | A01 | Initialize new project from template with proper linking |
| `intake-feedback` | [SKILL.md](miabos-intake/skills/intake-feedback/SKILL.md) | A03 | Process customer feedback → categorized backlog items |

### miabos-research (PB-01 & PB-02: Discovery Research & Recommendation)

| Skill | File | Agent | Description |
|-------|------|-------|-------------|
| `research-brief` | [SKILL.md](miabos-research/skills/research-brief/SKILL.md) | A02 | Frame one research problem into scope, questions, and required evidence |
| `benchmark-market` | [SKILL.md](miabos-research/skills/benchmark-market/SKILL.md) | A04 | Compare external market/product patterns in a benchmark matrix |
| `recommend-patterns` | [SKILL.md](miabos-research/skills/recommend-patterns/SKILL.md) | A06 | Convert research + benchmark into canonical UX/product recommendation |

### miabos-product (PB-02 & PB-03: Analysis, Strategy & Design)

| Skill | File | Agent | Description |
|-------|------|-------|-------------|
| `write-feature-spec` | [SKILL.md](miabos-product/skills/write-feature-spec/SKILL.md) | A03 | Write `Feature Spec Lite` from approved story + PRD + research context |
| `write-user-stories` | [SKILL.md](miabos-product/skills/write-user-stories/SKILL.md) | A03 | Break feature into user stories with acceptance criteria |
| `design-api` | [SKILL.md](miabos-product/skills/design-api/SKILL.md) | A05 | Design API contracts for Directus-based features |
| `map-collections` | [SKILL.md](miabos-product/skills/map-collections/SKILL.md) | A05 | Map feature requirements → Directus collections from database_schema.json |

### miabos-build (PB-04 & PB-05: Build, Test & Review)

| Skill | File | Agent | Description |
|-------|------|-------|-------------|
| `directus-config` | [SKILL.md](miabos-build/skills/directus-config/SKILL.md) | A08 | Generate Directus collection/field configuration specs |
| `write-test-cases` | [SKILL.md](miabos-build/skills/write-test-cases/SKILL.md) | A09 | Write test cases following T-Test-Cases template |
| `uat-script` | [SKILL.md](miabos-build/skills/uat-script/SKILL.md) | A09 | Generate UAT scripts for stakeholder testing |

### miabos-uxui (PB-03, PB-04, PB-05: UI/UX Behavioral Design & Quality)

| Skill | File | Agent | Description |
|-------|------|-------|-------------|
| `write-uxui-spec` | [SKILL.md](miabos-uxui/skills/write-uxui-spec/SKILL.md) | A06 | Write canonical screen-based UXUI pack for a feature slice |
| `write-screen-spec` | [SKILL.md](miabos-uxui/skills/write-screen-spec/SKILL.md) | A06 | Write one UXUI Screen Spec linked to feature + sitemap + flow matrix |
| `design-sitemap` | [SKILL.md](miabos-uxui/skills/design-sitemap/SKILL.md) | A06 | Design sitemap + flow matrix for screen-based UX handoff |
| `beauty-score` | [SKILL.md](miabos-uxui/skills/beauty-score/SKILL.md) | A06 | Evaluate visual quality across 6 dimensions (gate PB-05, target ≥ 8/10) |
| `visual-audit` | [SKILL.md](miabos-uxui/skills/visual-audit/SKILL.md) | A06 | Mid-build FE checkpoint: compare implementation vs approved spec |
| `design-direction` | [SKILL.md](miabos-uxui/skills/design-direction/SKILL.md) | A06 | Propose 2-3 design directions for Boss selection |
| `ia-design` | [SKILL.md](miabos-uxui/skills/ia-design/SKILL.md) | A06 | Design Information Architecture using job-based taxonomy |

### miabos-ops (Cross-cutting Operations)

| Skill | File | Agent | Description |
|-------|------|-------|-------------|
| `session-log` | [SKILL.md](miabos-ops/skills/session-log/SKILL.md) | A11 | Create/update session log with full logging chain compliance |
| `gate-check` | [SKILL.md](miabos-ops/skills/gate-check/SKILL.md) | A01 | Verify quality gate checklist before phase transition |
| `sync-context` | [SKILL.md](miabos-ops/skills/sync-context/SKILL.md) | A11 | Update _current_context.md + _session_index.md + Daily Log |

---

## Adding New Skills

1. Create folder: `00_Agent_OS/Skills/<group>/skills/<skill-name>/SKILL.md`
2. Follow the SKILL.md format (see any existing skill as reference)
3. Add entry to this registry
4. (Optional) Create Claude Code command: `.claude/commands/<skill-name>.md`

### SKILL.md Format

```markdown
---
name: <skill-name>
description: "<One-line description — used by AI to decide when to auto-trigger>"
agent: <A01-A11>
phase: <PB-01 to PB-06 or Cross-cutting>
input: "<What the skill expects as input>"
output: "<What the skill produces>"
template: "<Link to 00_Agent_OS/Templates/T-xxx.md if applicable>"
---

# <Skill Title>

## Purpose
What this skill does and when to use it.

## Context
MIABOS-specific background needed to execute correctly.

## Instructions
Step-by-step execution guide.

## Output Format
Expected structure (reference template if applicable).

## Quality Checks
Validation checklist before delivering output.
```
