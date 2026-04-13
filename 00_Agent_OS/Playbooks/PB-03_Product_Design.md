# PB-03: Product Design

**Purpose**: Convert approved `User Stories` into the canonical design-and-preview package: `Feature SRS`, `UXUI`, `Subtask Board`, and the FE Preview-ready handoff.

---

## Trigger

- PB-02 gate passed (PRD approved, stories prioritized, boss approved)

---

## Workflow

| Step | Agent | Skill | What Happens |
|------|-------|-------|-------------|
| A | **A02 PO** | — | Confirm PRD linked to in-scope stories, backlogs aligned |
| B | **A03 BA** | [`write-feature-spec`](../Skills/miabos-product/skills/write-feature-spec/SKILL.md) | Materialize Feature SRS, close business rules → promote to `SRS Ready` |
| C | **A06 UI/UX** | [`design-direction`](../Skills/miabos-uxui/skills/design-direction/SKILL.md) + `ui-ux-pro-max` | Propose 2-3 design directions → Boss selects → **Gate 3A** |
| C.1 | **A06 UI/UX** | [`ia-design`](../Skills/miabos-uxui/skills/ia-design/SKILL.md) | Design Information Architecture (job-based nav, routes) |
| D | **A06 UI/UX** | [`write-uxui-spec`](../Skills/miabos-uxui/skills/write-uxui-spec/SKILL.md) + `ui-ux-pro-max` | UXUI Feature Specs (5 mandatory sections), Vietnamese copy → **Gate 3B** |
| E | **A05 Tech** | [`design-api`](../Skills/miabos-product/skills/design-api/SKILL.md) | Technical feasibility review (if PM flags risk) |
| F | **A01 PM** | [`gate-check`](../Skills/miabos-ops/skills/gate-check/SKILL.md) | Verify User Story → SRS → UXUI → Subtask Board linkage, open FE Preview |
| G | **A11 Knowledge** | [`session-log`](../Skills/miabos-ops/skills/session-log/SKILL.md) | Log the session |

---

## Gate: PB-03 → PB-04

- [ ] PRD exists and is `Approved`
- [ ] In-scope `User Stories` are approved and placed in Sprint Backlog
- [ ] Feature SRS exists and is `SRS Ready`
- [ ] Design direction approved
- [ ] Mockups `Approved` by Boss
- [ ] UXUI Feature Specs exist and are `Approved`
- [ ] Subtask Board exists and explicitly opens `FE Preview`
- [ ] Vietnamese copy complete in all specs
- [ ] Session logged

---

## Agent Activation

```
A02 (PRD + story alignment) → A03 (Feature SRS) → A06 (design direction → mockups → UXUI specs) → A01 (FE Preview readiness closure) → A11 (log)
```
