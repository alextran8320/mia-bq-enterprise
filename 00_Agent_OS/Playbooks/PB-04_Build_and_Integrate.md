# PB-04: Build & Integrate

**Purpose**: Implement approved features using the preview-first flow — FE Preview first, then BE/integration after review and technical closure.

---

## Trigger

- PB-03 gate passed (all designs approved)

---

## Workflow

| Step | Agent | Skill | What Happens |
|------|-------|-------|-------------|
| 1 | **A01 PM** | [`gate-check`](../Skills/miabos-ops/skills/gate-check/SKILL.md) | Verify PRD, SRS, UXUI ready; Subtask Board opens FE Preview |
| 2 | **A07 FE** | — | Build FE Preview with mock/stub data per UXUI spec |
| 3 | **A06 UI/UX** | [`visual-audit`](../Skills/miabos-uxui/skills/visual-audit/SKILL.md) | Mid-build checkpoint: PASS or BLOCK |
| 4 | **A07 FE** | — | Complete remaining screens, A06 full visual audit (≥ 8/10) |
| 5 | **A01 PM** | — | Boss/PM reviews FE Preview, feedback absorbed into SRS + UXUI |
| 6 | **A05 Tech** | [`design-api`](../Skills/miabos-product/skills/design-api/SKILL.md) | Materialize Integration Spec after FE Preview review |
| 7 | **A08 BE** | [`directus-config`](../Skills/miabos-build/skills/directus-config/SKILL.md) | Configure Directus collections, build APIs per Integration Spec |
| 8 | **A07 FE** | — | Connect FE to real backend APIs |
| 9 | **A01 PM** | — | Verify integrated build and save runtime evidence; screenshots optional |
| 10 | **A11 Knowledge** | [`session-log`](../Skills/miabos-ops/skills/session-log/SKILL.md) | Log the session |

---

## Gate: PB-04 → PB-05

**Frontend (A07):**
- [ ] UXUI Feature Spec was `Approved` at build start
- [ ] Mid-build A06 checkpoint PASSED
- [ ] Full A06 visual audit PASSED
- [ ] Verified demo/runtime evidence saved; screenshots optional unless explicitly requested
- [ ] All interactive states implemented

**Backend (A08):**
- [ ] FE Preview was reviewed before backend work started
- [ ] `Integration Spec` or approved split technical pack was `Approved` at build start
- [ ] Critical endpoints respond correctly
- [ ] Webhook idempotency implemented
- [ ] Integration error handling in place
- [ ] AI pipeline functional (if applicable)

**Combined:**
- [ ] E2E workflow functional
- [ ] Multi-tenancy preserved
- [ ] Session logged

---

## Agent Activation

```
A01 (verify FE Preview gate) → A07 (FE Preview) → A06 (checkpoint + audit) → A01/A03/A06/A05 (review + technical closure) → A08 (backend) + A07 (integration) → A01 (verify) → A11 (log)
```
