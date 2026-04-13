# PB-01: Discovery & Intake

**Purpose**: Transform raw inputs (MOM, ideas, feedback, market signals) into structured, actionable requirements.

---

## Trigger

- Business Owner drops raw input (text, MOM transcript, screenshot, file, idea)
- Customer feedback batch arrives
- Market signal or competitive move detected

---

## Workflow

| Step | Agent | Skill | What Happens |
|------|-------|-------|-------------|
| 1 | **A01 PM** | — | Receive raw input, classify type, route to correct agent |
| 2 | **A11 Knowledge** | [`process-mom`](../Skills/miabos-intake/skills/process-mom/SKILL.md) | Structure MOM → decisions + action items + KB rules |
| 3 | **A03 BA** | [`intake-feedback`](../Skills/miabos-intake/skills/intake-feedback/SKILL.md) | Map inputs to domain model, flag impacted products |
| 4 | **A02 PO** | — | Evaluate product-market fit, preliminary prioritization |
| 5 | **A01 PM** | [`create-project`](../Skills/miabos-intake/skills/create-project/SKILL.md) | If new initiative: create project workspace |
| 6 | **A01 PM** | — | Present structured scope to Boss → GO / REVISE / DEFER |
| 7 | **A11 Knowledge** | [`session-log`](../Skills/miabos-ops/skills/session-log/SKILL.md) | Log the session |

---

## Gate: PB-01 → PB-02

- [ ] Raw input processed and structured
- [ ] Requirements Mapping exists
- [ ] Scope confirmed by Business Owner
- [ ] Impacted products identified
- [ ] Project workspace exists (if new)
- [ ] Session logged

---

## Agent Activation

```
A01 (triage) → A11 (MOM) → A03 (domain analysis) → A02 (product eval) → A01 (scope confirm) → A11 (log)
```
