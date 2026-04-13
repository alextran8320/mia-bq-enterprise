# PB-06: Ship & Learn

**Purpose**: Deploy, measure impact, conduct retrospective, and distill learnings into Knowledge Bank.

---

## Trigger

- PB-05 gate passed (all tests pass, signed off)

---

## Workflow

| Step | Agent | Skill | What Happens |
|------|-------|-------|-------------|
| 1 | **A01 PM** | — | Package deliverables for Boss review, prepare deployment checklist |
| 2 | **Boss** | — | Review/UAT: PASS or FAIL (if FAIL → loop to PB-04/05) |
| 3 | **A01 PM** | — | Deploy to production, verify, notify stakeholders |
| 4 | **A10 Data** | `pm-marketing-growth:north-star`, `pm-data-analytics:*` | Set up monitoring, track success metrics, impact report |
| 5 | **A04 Strategy** | `pm-product-strategy:*` | Compare actual vs predicted business impact, recommend next iterations |
| 6 | **A11 Knowledge** | [`process-mom`](../Skills/miabos-intake/skills/process-mom/SKILL.md) | Retrospective: extract rules for KB, update Lessons Learned |
| 7 | **A11 Knowledge** | `pm-execution:release-notes` | Generate release notes, draft stakeholder update |
| 8 | **A11 Knowledge** | [`session-log`](../Skills/miabos-ops/skills/session-log/SKILL.md) | Final session log |

---

## Gate: PB-06 → Done

- [ ] Boss says PASS
- [ ] Deployed to production (if applicable)
- [ ] Metrics dashboard set up
- [ ] Impact report planned
- [ ] Retrospective completed
- [ ] Knowledge Bank updated
- [ ] Final session logged
- [ ] Release notes published

---

## Agent Activation

```
A01 (package) → Boss (UAT) → A10 (metrics) → A04 (impact) → A11 (retro + KB + release notes + final log)
```
