# Feature SRS: [Feature ID] [Feature Name]

**Status**: Draft / In Review / SRS Ready / Build Ready / Blocked / Deprecated
**Owner**: [[A03_BA_Agent|A03 BA Agent]]
**Last Updated By**: A03
**Last Reviewed By**: A01
**Approval Required**: PM
**Approved By**: -
**Last Status Change**: YYYY-MM-DD
**Source of Truth**: This document
**Blocking Reason**: -
**Module**: M0X
**Phase**: PX
**Priority**: High / Medium / Low
**Document Role**: Canonical lean BA contract (`SRS Lite`) for UXUI, FE Preview, and later technical integration

---

## 0. Metadata

- Feature ID:
- Related User Story:
- Related PRD:
- Related Screens:
- Related APIs:
- Related Tables:
- Related Events:
- Related Error IDs:

## 1. User Story

## 1A. User Task Flow

_For each relevant user role, document 3–5 primary task steps for the core job-to-be-done._

| Step | User Role         | Action                               | Task Type    | Notes                |
| ---- | ----------------- | ------------------------------------ | ------------ | -------------------- |
| 1    | _e.g. Agent_      | _e.g. Opens assigned conversation_   | Quick Action | _Entry point_        |
| 2    | _e.g. Agent_      | _e.g. Reviews customer message_      | —            |                      |
| 3    | _e.g. Agent_      | _e.g. Sends reply or changes status_ | Quick Action | _Primary task_       |
| 4    | _e.g. Supervisor_ | _e.g. Reviews team dashboard_        | Reporting    | _Separate role flow_ |
| 5    | _e.g. Supervisor_ | _e.g. Reassigns conversation_        | Quick Action |                      |

**Task Types**: `Quick Action` | `Configuration` | `Reporting` | `Bulk Operation` | `Exception Handling`

> This section feeds directly into the UXUI Spec §2.1 Task Flow. If this section is missing, the feature cannot proceed to canonical UI design.

## 2. Business Context

## 3. Preconditions

## 4. Postconditions

## 5. Main Flow

## 6. Alternate Flows

## 7. Error Flows

## 8. State Machine

## 9. UX / Screen Behavior

## 10. Role / Permission Rules

## 11. Business Rules

## 12. API Contract Excerpt + Canonical Links

## 13. Event / Webhook Contract Excerpt + Canonical Links

## 14. Data / DB Impact Excerpt + Canonical Links

## 15. Validation Rules

## 16. Error Codes

## 17. Non-Functional Requirements

## 18. Acceptance Criteria

## 19. Test Scenarios

## 20. Observability

## 21. Rollout / Feature Flag

## 22. Open Questions

## 23. Definition of Done

## 24. Ready-for-UXUI Checklist

- [ ] `User Story` is approved and contains problem, trigger, happy path, dependencies, and AC context
- [ ] User Task Flow is explicit enough for screen/state design
- [ ] Business rules and permission rules are testable
- [ ] Main, alternate, and error flows are documented
- [ ] State machine is explicit or marked `N/A + reason`
- [ ] Data and event dependencies are linked
- [ ] Open questions that would force A06 to invent behavior are either resolved or marked as blockers

## 25. Ready-for-FE-Preview Checklist

- [ ] User Story is approved and linked in Sprint Backlog
- [ ] UXUI spec exists and cites this SRS
- [ ] No unresolved contradiction remains between SRS and UXUI
- [ ] Mock/stub data assumptions for FE Preview are explicit
- [ ] PM has explicitly opened `FE Preview`

## 26. Ready-for-BE / Integration Promotion Checklist

- [ ] FE Preview has been reviewed
- [ ] Behavior-changing feedback from FE Preview is absorbed back into SRS / UXUI
- [ ] `Integration Spec` (or approved split technical pack) is aligned to this SRS
- [ ] UXUI spec exists and cites this SRS
- [ ] No unresolved contradiction remains between SRS, UXUI, and the technical handoff artifact
- [ ] PM has confirmed `Build Ready`
