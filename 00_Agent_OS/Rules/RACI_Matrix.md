# RACI Matrix — MIABOS 12-Agent Team

**R** = Responsible (does the work)
**A** = Accountable (approves/gatekeeps)
**C** = Consulted (provides input)
**I** = Informed (receives notification)

---

## By Phase (11 Agents)

| Phase | Boss | A01 PM | A02 PO | A03 BA | A04 Strategy | A05 TechLead | A06 UI/UX | A07 FE | A08 BE | A09 QA | A10 Data | A11 Knowledge |
|-------|------|--------|--------|--------|-------------|-------------|-----------|--------|--------|--------|---------|--------------|
| **PB-01: Discovery** | A | A/R | C | R | C | - | - | - | - | - | - | R (MOM + log) |
| **PB-02: Analysis & Strategy** | A | A (gate) | R (prioritize) | R (requirements) | R (business case) | C | - | - | - | - | R (insights) | R (log) |
| **PB-03a: PRD** | A (approve) | A (gate) | **R** (lead) | C | C | C | - | - | - | - | - | R (log) |
| **PB-03b: Design** | A (approve) | A (gate) | C | C | - | C | **R** (lead) | - | - | - | - | R (log) |
| **PB-03c: Architecture** | I | A (gate) | C | C | - | **R** (lead) | C | - | - | - | - | R (log) |
| **PB-03d: UX-Tech Cross-Check** | I | **A/R** | C | C | - | **R** | **R** | I | - | - | - | R (log) |
| **PB-04: Build** | - | A (gate) | C | C | - | C (FE architecture + technical unblock) | R (checkpoint) | **R** (FE) | **R** (BE) | I | - | R (log) |
| **PB-05: Test & Review** | I | I | C | C | - | - | R (beauty) | R (fix) | R (fix) | **A/R** (test) | - | R (log) |
| **PB-06: Ship & Learn** | **A** (UAT) | R (package) | C | - | R (impact) | - | - | - | - | C | **R** (metrics) | **R** (KB + release + log) |

---

## Key Dynamics

1. **A01 PM Agent holds all gates**. Nothing moves forward without PM verifying the quality gate.

2. **A02 Product Owner drives product decisions**. Owns PRD, roadmap, feature prioritization. The "what" authority.

3. **A03 BA is the domain expert**. Owns requirements, business rules, and data model analysis. Consulted by everyone.

4. **A04 Business Strategy validates business justification**. Every major initiative needs a business case.

5. **A05 Tech Lead owns technical design**. Architecture, API contracts, Directus schema decisions, and frontend technical architecture / design-system implementation governance.

6. **A06 UI/UX is the design authority**. A06 owns visual intent, UX flows, mockups, component anatomy, checkpoint, and beauty score, and must co-work with A05 before A07 build starts.

7. **A07/A08 Builders implement only**. A07 may not go directly from A06 handoff to build without A05 technical cross-check. Builders are forbidden from making design or architecture decisions.

8. **A09 QA is the final functional gatekeeper**. Accountable for PB-05 sign-off.

9. **A10 Data Analyst provides evidence for decisions**. Active in PB-02 (insights) and PB-06 (measurement).

10. **A11 MOM/Content processes raw inputs**. Active in PB-01 (MOM) and PB-06 (release notes).

11. **A12 Knowledge Agent is always active**. Mandatory logging at every phase end.

---

## Agent Activation Map (Quick Reference)

```
PB-01: A01 (triage) → A11 (MOM) → A03 (domain) → A02 (eval) → A12 (log)
PB-02: A04 (biz case) → A10 (insights) → A03 (reqs) → A02 (prioritize) → A12 (log)
PB-03: A02 (PRD) → A06 (design) ‖ A05 (technical architecture) → A05+A06 (UX-tech cross-check) → A01 (gate) → A12 (log)
PB-04: A08 (backend) ‖ A07 (frontend under A05 constraints) → A06 (checkpoint) → A12 (log)
PB-05: A09 (test) → A06 (beauty) → A07/A08 (fix loop) → A12 (log)
PB-06: A01 (package) → Boss (UAT) → A10 (metrics) → A04 (impact) → A11 (release) → A12 (KB + log)
```
