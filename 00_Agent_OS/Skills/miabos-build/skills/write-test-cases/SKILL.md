---
name: write-test-cases
description: "Write comprehensive test cases mapped to Feature IDs and AC IDs with 100% AC coverage. Covers 5-layer testing: API, Data, E2E, Integration, AI. Use when entering PB-05 Test & Review phase."
agent: A09
phase: PB-05
input: "Feature SRS, UXUI Feature Spec, Integration Spec, AC IDs"
output: "Test cases in project Test/ folder"
template: "00_Agent_OS/Templates/T-Test-Cases.md"
---

# Write Test Cases

## Purpose

Create a complete test suite that covers every acceptance criterion. No AC-ID should be untested.

## Instructions

### Step 1: Read Inputs

1. Read **Feature SRS** — extract all AC-IDs and business rules (BR-IDs)
2. Read **UXUI Feature Spec** — extract §2.1 Task Flow, §5.1 Error & Recovery
3. Read **Integration Spec** — extract API-IDs and data model
4. Read existing test cases to avoid duplication

### Step 2: Create Traceability Map

```markdown
| Feature ID | AC-ID | Test Case ID | Layer | Priority |
|-----------|-------|-------------|-------|----------|
| F-M02-001 | AC-F001-01 | TC-001 | E2E | Critical |
| F-M02-001 | AC-F001-02 | TC-002 | API | High |
```

Every AC-ID must have at least 1 test case. Flag gaps.

### Step 3: Write Test Cases per Layer

**Layer 1 — API Tests:**
- Endpoint responds with correct status codes
- Request validation (required fields, types, formats)
- Error responses match API Contract error schema
- Multi-tenancy: company isolation verified

**Layer 2 — Data Tests:**
- Collections, relationships, and constraints verified
- Business rules from SRS enforced at data level
- Data integrity after CRUD operations

**Layer 3 — E2E Tests:**
- User Task Flow from UXUI §2.1 achievable end-to-end
- Task completion in documented step count
- All 3 interaction patterns tested: Quick Action, Exception Handling, Bulk Operation

**Layer 4 — Integration Tests (if applicable):**
- External service calls succeed (OmiCall, Facebook, Zalo, etc.)
- Webhook delivery and idempotency
- Fallback chains work when primary fails

**Layer 5 — AI Tests (if applicable):**
- Chatbot responses match trained rules
- Content generation produces valid output
- Remarketing triggers fire correctly

### Step 4: Write Each Test Case

Follow T-Test-Cases template:

```markdown
### TC-XXX: [Test Case Title]
- **Feature ID**: F-MXX-XXX
- **AC-ID**: AC-FXXX-XX
- **Layer**: API / Data / E2E / Integration / AI
- **Priority**: Critical / High / Medium / Low
- **Preconditions**: [Setup required]
- **Steps**:
  1. [Action]
  2. [Action]
- **Expected Result**: [What should happen]
- **Pass Criteria**: [Measurable condition]
```

### Step 5: Add Task Completion Tests

For every feature, add at least 1 test:
> "User completes [primary task] from [starting screen] in max [Y] steps"

This validates the UXUI §2.1 Task Flow is achievable.

## Quality Checks

- [ ] 100% AC-ID coverage (no orphan ACs)
- [ ] Traceability map complete: Feature → AC → Test Case
- [ ] All 5 layers covered (where applicable)
- [ ] Task completion tests exist for every feature
- [ ] Test cases are reproducible (clear preconditions + steps)
