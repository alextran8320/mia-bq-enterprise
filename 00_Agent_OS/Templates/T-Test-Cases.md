# Test Cases: [Project/Epic Name]

**Status**: Draft / In Review / Test Ready / Approved
**Owner**: [[A04_QA_Agent|QA Agent]]
**Last Updated By**: A04
**Last Reviewed By**: A01
**Approval Required**: PM / Business Owner
**Approved By**: -
**Last Status Change**: YYYY-MM-DD
**Source of Truth**: This document
**Blocking Reason**: -
**Created by**: [[A04_QA_Agent|QA Agent]]
**Date**: YYYY-MM-DD
**PRD Reference**: [Link to PRD]

---

## 1. Coverage Summary

| Metric | Value |
|--------|-------|
| Total AC codes in PRD | |
| AC codes covered by tests | |
| Coverage % | **Must be 100%** |
| Total test cases | |

---

## 2. Test Case Matrix

| Test ID | Covered AC | Feature ID | Layer | Priority | Pre-conditions | Steps | Expected Result | Actual Result | Status |
|---------|-----------|------------|-------|----------|---------------|-------|-----------------|---------------|--------|
| TC-001 | AC-F-M01-001-01 | F-M01-001 | API | High | | 1. ... 2. ... | | | |
| TC-002 | AC-F-M01-001-01 | F-M01-001 | Data | High | | 1. ... 2. ... | | | |
| TC-003 | AC-F-M01-002-01 | F-M01-002 | E2E | Medium | | 1. ... 2. ... | | | |

**Layer types**: API / Data / E2E
**Priority**: High / Medium / Low
**Status**: PENDING / PASSED / FAILED

---

## 2A. Task Completion Tests

_Every feature must have ≥1 task completion test case verifying the user can complete their primary task within the documented step count from UXUI Spec §2.1._

| Task-TC ID | Feature ID | User Role | Task Description | Max Steps | Max Time | Interaction Model | Result | Status |
|-----------|------------|-----------|-----------------|-----------|----------|-------------------|--------|--------|
| TaskTC-001 | F-M01-001 | Agent | _e.g. Change conversation status_ | 3 clicks | <10s | Quick Action | | PENDING |
| TaskTC-002 | F-M01-001 | Supervisor | _e.g. Reassign conversation_ | 4 clicks | <15s | Quick Action | | PENDING |
| TaskTC-003 | F-M01-002 | Agent | _e.g. Process bulk status change_ | 5 clicks | <30s | Bulk Operation | | PENDING |

**Interaction Models**: `Quick Action` | `Exception Handling` | `Bulk Operation`

**Failure criteria**: If any TaskTC exceeds its Max Steps or Max Time target, it is filed as a UX-Blocking bug.

---

## 3. Test Data Strategy

| Data Set | Description | Source |
|----------|------------|--------|
| | | Seed / Mock / Sandbox |

---

## 4. Bug Reports

### BUG-001: [Title]
| Field | Value |
|-------|-------|
| **Test ID** | TC-XXX |
| **Covered AC** | AC-F-M01-001-01 |
| **Feature ID** | F-M01-001 |
| **Severity** | High / Medium / Low / **UX-Blocking** |
| **Steps to Reproduce** | |
| **Expected** | |
| **Actual** | |
| **Error Log** | |
| **Status** | Open / Fixed / Verified |

**UX-Blocking Severity Definition** (release blocker, not "nice-to-have"):
- Form too long with no field grouping or progressive disclosure
- Labels using technical/system language instead of user-facing Vietnamese
- No visual hierarchy — primary CTA not prominent
- Dead-end in task flow — user stuck with no guidance
- Schema fields exposed without task-based justification
- Task completion exceeds documented step/time limits

---

## 5. Sign-Off

```
Sign-Off: [Project Name]
Date: YYYY-MM-DD
Signed by: [[A04_QA_Agent|QA Agent]]

Total Test Cases: X
Passed: X / X (100%)
AC Coverage: X / X (100%)
Layers Tested: API, Data, E2E

Known Limitations:
- [List any]

Verdict: APPROVED FOR UAT
```
