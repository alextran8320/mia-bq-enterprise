# [PLACEHOLDER] Sign-Off Certificate

**Gate Required By**: Gate 5 — Test → Ship (PB-04 → PB-05)
**Owner**: PM Agent (A01) — requires Business Owner signature
**Status**: Replace this placeholder with actual sign-off when all Gate 5 criteria are met.

---

## What Goes Here

This document is the formal sign-off that all quality gates have been passed and the project is ready to ship. It must be completed and "signed" (acknowledged) by the Business Owner before Gate 5 passes.

**Gate 5 will not pass without this document being complete.**

---

## Template Structure

---

# Sign-Off Certificate

**Project**: [Project Name]
**Version**: [v1.0 / Sprint X]
**Date**: YYYY-MM-DD
**Prepared By**: A01 PM Agent
**Approved By**: Business Owner

---

## Summary

This certificate confirms that **[Project Name]** has passed all quality gates and is approved for production deployment.

---

## Gate Completion Summary

| Gate | Description | Status | Date Passed | Evidence |
|------|------------|--------|-------------|----------|
| Gate 1 | Project Kickoff | ✅ PASSED | YYYY-MM-DD | `_project.md` |
| Gate 2 | Scope → Design | ✅ PASSED | YYYY-MM-DD | `Analysis/Requirements_Mapping.md` |
| Gate 2A | Design Direction Approved | ✅ PASSED | YYYY-MM-DD | Session log |
| Gate 2B | Mockups Signed Off | ✅ PASSED | YYYY-MM-DD | `Design/Mockups/` |
| Gate 3 | Design → Build | ✅ PASSED | YYYY-MM-DD | `Design/Architecture.md`, `Design/API_Contract.md` |
| Gate 3A | Mid-Build Visual Checkpoint | ✅ PASSED | YYYY-MM-DD | `Build/Screenshots/Checkpoints/` |
| Gate 4 | Build → Test | ✅ PASSED | YYYY-MM-DD | `Build/Screenshots/` |
| Gate 5 | Test → Ship | ✅ PASSED | YYYY-MM-DD | This document |

---

## Quality Metrics

| Metric | Target | Actual | Pass? |
|--------|--------|--------|-------|
| Test Coverage (AC codes) | 100% | | |
| Fidelity Score (avg) | ≥ 8/10 | | |
| Beauty Score (avg) | ≥ 8/10 | | |
| Critical Bugs | 0 | | |
| High Bugs | 0 | | |

---

## Acceptance Criteria Sign-Off

| AC Code | Requirement | Test Result | Notes |
|---------|------------|-------------|-------|
| AC-001 | | ✅ PASS | |
| AC-002 | | ✅ PASS | |

---

## Known Issues / Deferred Items

| # | Issue | Severity | Deferred To | Owner |
|---|-------|----------|-------------|-------|
| | None | | | |

---

## Business Owner Approval

> By acknowledging this certificate, the Business Owner confirms that:
> 1. All acceptance criteria have been met
> 2. The product is ready for production deployment
> 3. Any deferred items are accepted and tracked

**Business Owner**: [Name]
**Date**: YYYY-MM-DD
**Decision**: ☐ APPROVED FOR SHIP / ☐ REJECTED — see notes

**Notes**:
_[Any final notes from Business Owner]_

---

## Reference
- Gate 5 requirements: `../../../../00_Agent_OS/Rules/Quality_Gates.md` (line 128)
- Playbook: `../../../../00_Agent_OS/Playbooks/PB-05_Ship_and_Learn.md`
- Requirements Mapping: `Requirements_Mapping.md`
