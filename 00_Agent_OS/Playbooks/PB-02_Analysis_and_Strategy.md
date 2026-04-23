# PB-02: Analysis & Strategy

**Purpose**: Build business case, analyze market context, approve research direction, prioritize features, and produce canonical PRD + Feature Spec artifacts.

---

## Trigger

- PB-01 gate passed (scope confirmed)

---

## Workflow

| Step | Agent | Skill | What Happens |
|------|-------|-------|-------------|
| 1 | **A04 Strategy / A06 UX / A02 PO** | `research-brief`, `benchmark-market`, `recommend-patterns` | Research Brief → Benchmark Matrix → Recommendation for the capability/module |
| 2 | **A04 Strategy** | `pm-product-strategy:*`, `pm-go-to-market:*` | Market analysis, competitive intel, business case → GO/NO-GO |
| 3 | **A10 Data** | `pm-data-analytics:*`, `pm-market-research:*` | Customer insights, metrics baseline, success KPIs |
| 4 | **A03 BA** | [`write-user-stories`](../Skills/miabos-product/skills/write-user-stories/SKILL.md) | User stories with AC IDs, business rules, state machines |
| 5 | **A03 BA** | [`write-feature-spec`](../Skills/miabos-product/skills/write-feature-spec/SKILL.md) | Feature Spec Lite documents for in-scope stories |
| 6 | **A02 PO** | — | Feature Registry, Product Backlog prioritization, roadmap update |
| 6 | **A01 PM** | [`gate-check`](../Skills/miabos-ops/skills/gate-check/SKILL.md) | Review artifacts, present to Boss, get approval |
| 7 | **A11 Knowledge** | [`session-log`](../Skills/miabos-ops/skills/session-log/SKILL.md) | Log the session |

---

## Gate: PB-02 → PB-03

- [ ] Business case validated (GO decision)
- [ ] Research artifacts exist and are `Approved`, or PM waiver is documented
- [ ] Customer insights documented
- [ ] Feature Registry exists with prioritized features
- [ ] Product Backlog is prioritized at the `User Story` level
- [ ] Sprint Backlog identifies the near-term in-scope user stories
- [ ] User stories with AC IDs defined
- [ ] Feature Spec exists for in-scope stories entering design
- [ ] Each in-scope `User Story` contains direct planning context for BA
- [ ] Success metrics defined
- [ ] Boss approved feature slice
- [ ] Session logged

---

## Agent Activation

```
Research → A04 (business case) → A10 (insights) → A03 (requirements) → A02 (prioritization) → A01 (review) → A11 (log)
```
