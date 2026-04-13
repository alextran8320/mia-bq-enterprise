# PB-05: Test & Review

**Purpose**: Validate all features against acceptance criteria, visual quality, and integration correctness.

---

## Trigger

- PB-04 gate passed (build complete)

---

## Workflow

| Step | Agent | Skill | What Happens |
|------|-------|-------|-------------|
| 1 | **A09 QA** | [`write-test-cases`](../Skills/miabos-build/skills/write-test-cases/SKILL.md) | Create test strategy, map test cases to Feature IDs + AC IDs |
| 2 | **A09 QA** | — | Execute 5-layer testing: API + Data + E2E + Integration + AI |
| 3 | **A09 QA** | — | Task completion testing: verify UXUI §2.1 task flows achievable |
| 4 | **A06 UI/UX** | [`beauty-score`](../Skills/miabos-uxui/skills/beauty-score/SKILL.md) | Beauty Score assessment (6 dimensions, target ≥ 8/10) |
| 5 | **A07/A08** | — | Bug fix loop until all critical/high resolved |
| 6 | **A09 QA** | — | Regression check: cross-product + multi-tenancy |
| 7 | **A09 QA** | [`uat-script`](../Skills/miabos-build/skills/uat-script/SKILL.md) | Generate UAT script for Boss/stakeholder testing |
| 8 | **A01 PM** | [`gate-check`](../Skills/miabos-ops/skills/gate-check/SKILL.md) | Sign-off: all tests pass, beauty ≥ 8/10, no critical bugs |
| 9 | **A11 Knowledge** | [`session-log`](../Skills/miabos-ops/skills/session-log/SKILL.md) | Log the session |

---

## Gate: PB-05 → PB-06

- [ ] Test cases cover 100% of AC codes
- [ ] Tests map to Feature ID + AC ID
- [ ] 5-layer testing completed
- [ ] All tests passed
- [ ] Beauty score ≥ 8/10
- [ ] No critical/high bugs open
- [ ] Sign-off certificate created
- [ ] Session logged

---

## Agent Activation

```
A09 (test strategy → execute) → A06 (beauty score) → A07/A08 (fix loop) → A09 (re-test) → A01 (sign-off) → A11 (log)
```
