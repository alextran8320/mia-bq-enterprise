# Project: [Name]

**Status**: Not Started / In Progress / UAT / Complete
**Created**: YYYY-MM-DD
**Current Phase**: PB-0X

---

## Applied Rules

> Link to which rules from `03_Knowledge_Bank/Global_Rules.md` apply to this project.
> Check off each rule that applies. Add notes where conditional.

- [ ] KB Rule 1 (Autonomous Session Log generation) — applies
- [ ] KB Rule 2 (Clickable Relative Markdown Links) — applies
- [ ] KB Rule 4 (Daily Log requirement) — applies
- [ ] KB Rule 5 (Logging Handshake) — applies
- [ ] KB Rule 6 (High-Precision Handoffs) — applies
- [ ] KB Rule 7 (Framework-First Rule) — applies if UI project
- [ ] KB Rule 8 (Color Confirmation Separate) — applies if design project
- [ ] KB Rule 9 (Design System = Framework Config + Theme + Component Map) — applies if design project
- [ ] KB Rule 10 (Start-of-Block Hard Stop) — applies
- [ ] KB Rule 11 (Current Context Anchor) — applies
- [ ] KB Rule 12 (No Final Answer Without Log Sync) — applies

**Full KB files**:
- [ ] `[[Global_Rules]]`
- [ ] `[[Product_Rules]]`
- [ ] `[[Tech_Rules]]`
- [ ] `[[Lessons_Learned]]`

---

## Intake

### Goal
_One sentence: what are we building?_

### Business Value
_Who benefits and how?_

### Scope
| Field | Value |
|-------|-------|
| Phase/Priority | |
| Target Users | |
| Platforms | |
| Integrations | |

### Constraints
| Type | Detail |
|------|--------|
| Tech | |
| Security | |
| Timeline | |

### Clarification Q&A
| # | Question | Answer |
|---|----------|--------|
| 1 | | |

---

## Raw Input Files
| File | Description | Location |
|------|------------|----------|
| | | `Raw_Input/` |

---

## Session Timeline
| Date | Session File | Phase |
|------|--------------|-------|
| | `[Link to 02_Sessions/...]` | |

---

## Progress Tracker

| Phase | Status | Date Started | Date Completed | Notes |
|-------|--------|-------------|---------------|-------|
| [[PB-01_Clarify_and_Scope|PB-01]] Clarify & Scope | | | | |
| [[PB-02_Analyze_and_Design|PB-02]] Design | | | | |
| [[PB-03_Build|PB-03]] Build | | | | |
| [[PB-04_Test_and_Review|PB-04]] Test | | | | |
| [[PB-05_Ship_and_Learn|PB-05]] Ship | | | | |

---

## Evidence Checklist

> Gate-required artifacts. Each item must exist and be complete before the listed gate can pass.
> Check off each item as it is created and populated.

### Gate 2 — Scope → Design (PB-01 → PB-02)
- [ ] `Analysis/Requirements_Mapping.md` — AC codes mapped to all PRD requirements
- [ ] `Analysis/Features/_feature_registry.md` — master feature registry exists
- [ ] `Analysis/Features/Briefs/` — one brief per in-scope feature

### Gate 2A — Design Direction Approved (within PB-02)
- [ ] Session log documents Business Owner approval of design direction

### Gate 2B — Mockups Signed Off (within PB-02)
- [ ] `Design/Mockups/` — all required screens mocked up (home, key interaction, form, list, empty, error, loading)
- [ ] Session log documents Business Owner sign-off on mockups

### Gate 3 — Design → Build (PB-02 → PB-03)
- [ ] `Architecture/Architecture.md` — system architecture complete
- [ ] `Architecture/API_Contract.md` — all endpoints defined with request/response schemas
- [ ] `Architecture/Data_Mapping.md` — feature ↔ UI ↔ API ↔ DB ↔ event mapping complete
- [ ] `Design/Design_System.md` — colors, typography, spacing, components defined
- [ ] `Design/AI_Prompts.md` — _(conditional: only if project has AI features)_
- [ ] Cross-check complete: Feature ↔ UI ↔ API ↔ DB ↔ event mapping verified

### Gate 3A — Mid-Build Visual Checkpoint (within PB-03)
- [ ] `Build/Screenshots/Checkpoints/` — mid-build screenshots reviewed by A06

### Gate 4 — Build → Test (PB-03 → PB-04)
- [ ] `Build/Screenshots/` — screenshots of all completed screens
- [ ] All screens score ≥ 8/10 fidelity vs mockups
- [ ] Beauty Score average ≥ 8/10 (6 dimensions)

### Gate 5 — Test → Ship (PB-04 → PB-05)
- [ ] `Analysis/SignOff_Certificate.md` — all gates passed, Business Owner approved
- [ ] 100% AC code coverage in test results
- [ ] Every test case maps to `Feature ID` + `AC ID`
- [ ] Zero critical/high bugs open

### Gate 6 — Done (PB-05)
- [ ] Session log in `02_Sessions/` with design retrospective
- [ ] Knowledge Bank updated with lessons learned
