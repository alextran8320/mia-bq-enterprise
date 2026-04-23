# Document Status Model

This rule defines how canonical documents carry status and how status controls agent handoffs.

> `existence != readiness`
>
> A file may exist and still be invalid for the next agent to consume.

---

## 1. Required Metadata

Every canonical document MUST expose these metadata fields near the top of the file:

- `Status`
- `Owner`
- `Last Updated By`
- `Last Reviewed By`
- `Approval Required`
- `Approved By`
- `Last Status Change`
- `Source of Truth`
- `Blocking Reason`

Use `-` when a field is intentionally empty.

## 2. Canonical Status Vocabulary

### Universal statuses

- `Draft`
- `In Review`
- `Approved`
- `Blocked`
- `Deprecated`

### Delivery statuses

- `Feature Ready for UX`
- `Build Ready`
- `Test Ready`
- `Done`

## 3. Artifact Lifecycles

| Artifact Type | Allowed Statuses | Gate Rule |
|---------------|------------------|-----------|
| `PRD.md` | `Draft -> In Review -> Approved -> Deprecated` | PB-02 cannot start until PRD is `Approved` |
| `Feature Spec Lite` | `Draft -> In Review -> Feature Ready for UX -> Build Ready -> Blocked -> Deprecated` | A05/A06 cannot consume unless Feature Spec is `Feature Ready for UX`; A07/A08 cannot consume unless Feature Spec is `Build Ready` |
| `Feature Registry` row | `Draft / Feature Ready for UX / Build Ready / Test Ready / Done / Blocked / Deprecated` | Registry is the PM control plane for feature slice readiness |
| `UXUI Screen Spec`, `Sitemap`, `Flow Matrix` | `Draft -> In Review -> Approved -> Blocked -> Deprecated` | FE Preview may not start unless all required screen specs, sitemap, and flow matrix are approved |
| `Design_System`, `Mockups`, `Architecture`, `API_Contract`, `Data_Mapping`, `Integration_Spec` | `Draft -> In Review -> Approved -> Blocked -> Deprecated` | FE Preview may start without the full technical pack, but BE/integration may not start until the approved technical handoff artifact exists |
| `Test Cases`, `Traceability Matrix`, `Sign-Off` | `Draft -> In Review -> Test Ready -> Approved` | PB-05 cannot start until test artifacts are `Approved` |

## 4. Authority Model

| Agent | May Author / Update | May Promote To | Cannot Promote To |
|-------|----------------------|----------------|-------------------|
| `A02 Product Owner Agent` | PRD, Feature Registry, Product Backlog sequencing | `Draft`, `In Review` | `Feature Ready for UX`, `Build Ready`, `Approved` business gate states |
| `A03 BA Agent` | Feature Spec Lite, User Stories, Business Rules, domain-rule artifacts | `Draft`, `In Review`, `Feature Ready for UX` | `Build Ready`, `Approved` gate states |
| `A05 Tech Lead Agent` | Integration Spec, Architecture, API Contract, Data Mapping | `Draft`, `In Review` | `Approved` by itself |
| `A06 UI/UX Agent` | Design System, Mockups, UXUI Screen Specs, Sitemap, Flow Matrix, Visual Audit artifacts | `Draft`, `In Review` | `Approved` by itself |
| `A07 FE Builder / A08 BE Builder` | Build artifacts only | Implementation status inside build artifacts | Any upstream spec/design gate status |
| `A09 QA Agent` | Test artifacts, bug reports, sign-off drafts | `Draft`, `In Review`, `Test Ready` | Final UAT/business approval |
| `A01 PM Agent` | Any gate-bearing status confirmation | `Approved`, `Build Ready`, `Done`, rejection to `Blocked` | Business Owner-only approvals |
| `Business Owner` | Business/design/UAT approvals | `Approved` for PRD, mockups, UAT sign-off | Technical authoring statuses |

## 5. Agent Consumption Rules

| Consumer Agent | Required Upstream Status |
|----------------|--------------------------|
| `A03 BA Agent` | `PRD = Approved` and relevant `User Story = Ready for BA` with direct planning context |
| `A05 Tech Lead Agent` | relevant `Feature Spec = Feature Ready for UX`; final technical handoff for BE/integration also requires reviewed FE Preview unless PM declares a technical-risk exception |
| `A06 UI/UX Agent` | `Research = Approved or Waived`, `PRD = Approved`, relevant `User Story = Ready for Design`, and relevant `Feature Spec = Feature Ready for UX` |
| `A07 FE Builder` | story row not `Blocked`, relevant `Feature Spec = Feature Ready for UX`, linked `Screen Specs = Approved`, linked `Sitemap/Flow Matrix = Approved`, and Subtask Board explicitly allows `FE Preview`; `Integration_Spec` is required only when moving from preview to real backend integration |
| `A08 BE Builder` | story row not `Blocked`, relevant `Feature Spec = Build Ready`, reviewed FE Preview, and linked `Integration_Spec` (or approved split `Architecture/API/Data` pack) = `Approved` |
| `A09 QA Agent` | relevant feature row at least `Build Ready`, test artifacts at least `Test Ready` |
| `Business Owner` | consumes only review-ready business/design/UAT artifacts |

If status is invalid, the consuming agent MUST hard stop and escalate to PM.

## 6. Feature Registry Control Fields

Each feature row in the registry MUST include:

- `Status`
- `Status Owner`
- `Gate Result`
- `Blocking Reason`
- `Last Reviewed`
- `Next Promotion Target`

The registry is the canonical control plane. If a per-document status conflicts with the registry, PM must treat the slice as blocked until reconciled.

## 7. Status Change Protocol

Every major promotion or demotion MUST update:

1. The document itself
2. The linked registry row
3. The session log or decision log if the status change is gate-bearing

Recommended status decision record:

| Artifact | Old Status | New Status | Changed By | Approved By | Reason |
|----------|------------|------------|------------|-------------|--------|
| | | | | | |

## 8. Validation Rules

- `Blocked` MUST include a real `Blocking Reason` and link to an open question or explicit dependency.
- `Deprecated` MUST identify the replacement source of truth.
- `Feature Ready for UX` is impossible unless task flow, business rules, role/permission rules, state logic, error conditions, data dependencies, and linked research rationale are explicit enough for A05 and A06 to consume without inventing missing behavior.
- `Build Ready` is impossible unless the FE Preview has been reviewed, behavior-changing feedback is absorbed back into canonical docs, and the required technical handoff artifact (`Integration_Spec` or approved split pack) is already `Approved`.
- Canonical screen-level UI/UX work may not begin from `PRD` or `User Story` alone; the linked `Feature Spec` must already be at least `Feature Ready for UX`.
- `Feature Brief` is removed from the canonical process. The approved `User Story` must carry the planning context required for BA handoff.
- `Approved` on a canonical design or technical artifact means the document is valid for downstream consumption within its scoped feature slice.
- PM is the final gate enforcer even when another agent owns the document.
