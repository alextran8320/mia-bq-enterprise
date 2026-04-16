# High-Precision Session Log: 2026-04-16 - MIABOS - Customer 360 UX And Story Pack

**Date**: 2026-04-16
**Project**: MIABOS -> [`01_Projects/MIABOS/_project.md`](../01_Projects/MIABOS/_project.md)
**Phase**: PB-03 / Product Design
**Duration**: ~1.0h
**AI Channel**: Codex CLI
**Model / Environment**: GPT-5 Codex
**Agent Identity**: A01 PM Agent / A03 BA / A06 UX support
**Neural Handshake**: [x] Used current AGENTS.md process, current Customer 360 SRS, existing UX/story patterns, current project timeline, and active branch context before creating new canonical artifacts.

---

## Strategic Context

Business Owner requested splitting `Customer 360 CRM` into a practical `UX + Story Pack` covering `Customer List`, `Customer 360`, `Duplicate Review`, and `Care Action`, while also deepening the customer-to-social-profile relationship model and the duplicate / merge / bulk-update logic.

## Collaborative Deep-Dive

- **Decision Point A**: The parent SRS already had a solid Customer 360 core, but it still bundled too many responsibilities into one artifact. -> Created 4 UX slices and 4 user stories to separate the main CRM surfaces.
- **Decision Point B**: Social identity is critical in BQ retail / social-commerce workflows and should not be hidden as a minor subfield. -> Added explicit modeling for `crm_social_profile`, `crm_social_relationship`, relationship states, and social linking rules.
- **Decision Point C**: Duplicate handling needed to move from “noted in business rules” to an actionable UX/implementation topic. -> Expanded the SRS with duplicate signals, merge rules, duplicate review expectations, and bulk-update guardrails.
- **Decision Point D**: Bulk operations should help operational teams but must not turn phase 1 into a risky data-cleanup engine. -> Limited phase-1 bulk actions to segment/owner/tag/store/attribute updates and explicitly kept bulk merge out of phase 1.

## Artifacts Created/Updated

| Artifact | Location (Relative Link) | Key Change | Fidelity vs. Design (1-10) |
|----------|--------------------------|------------|----------------------------|
| Customer and CRM SRS | [F-M06-CRM-001_Customer_And_CRM_SRS.md](../01_Projects/MIABOS/Analysis/Features/Modules/CRM_Workspace/Customer_And_CRM/SRS/F-M06-CRM-001_Customer_And_CRM_SRS.md) | Added customer-social relationship model, duplicate/merge logic, bulk-update rules, social-profile tables/fields, and stronger validation/tests. | 10 |
| UXUI - Customer List | [UXUI-F-M06-CRM-001A_Customer_List.md](../01_Projects/MIABOS/Design/UXUI_Features/UXUI-F-M06-CRM-001A_Customer_List.md) | Materialized customer-list surface with search, filters, saved views, duplicate flags, and bulk actions. | 9 |
| UXUI - Customer 360 | [UXUI-F-M06-CRM-001B_Customer_360.md](../01_Projects/MIABOS/Design/UXUI_Features/UXUI-F-M06-CRM-001B_Customer_360.md) | Materialized the main Customer 360 view including social relationship panel and timeline behavior. | 9 |
| UXUI - Duplicate Review | [UXUI-F-M06-CRM-001C_Duplicate_Review.md](../01_Projects/MIABOS/Design/UXUI_Features/UXUI-F-M06-CRM-001C_Duplicate_Review.md) | Materialized comparison / merge-review UX slice. | 9 |
| UXUI - Care Action | [UXUI-F-M06-CRM-001D_Care_Action.md](../01_Projects/MIABOS/Design/UXUI_Features/UXUI-F-M06-CRM-001D_Care_Action.md) | Materialized action composer surface for follow-up / care / promo / handoff. | 9 |
| Story - Customer List | [US-M06-CRM-001A_Customer_List.md](../01_Projects/MIABOS/Planning/Stories/CRM_Workspace/US-M06-CRM-001A_Customer_List.md) | Added story and ACs for the customer-list slice. | 9 |
| Story - Customer 360 | [US-M06-CRM-001B_Customer_360.md](../01_Projects/MIABOS/Planning/Stories/CRM_Workspace/US-M06-CRM-001B_Customer_360.md) | Added story and ACs for the main Customer 360 slice. | 9 |
| Story - Duplicate Review | [US-M06-CRM-001C_Duplicate_Review.md](../01_Projects/MIABOS/Planning/Stories/CRM_Workspace/US-M06-CRM-001C_Duplicate_Review.md) | Added story and ACs for duplicate resolution. | 9 |
| Story - Care Action | [US-M06-CRM-001D_Care_Action.md](../01_Projects/MIABOS/Planning/Stories/CRM_Workspace/US-M06-CRM-001D_Care_Action.md) | Added story and ACs for CRM care actions. | 9 |
| Feature Registry | [Feature Registry](../01_Projects/MIABOS/Analysis/Features/_feature_registry.md) | Updated `F-M06-CRM-001` blocker wording to reflect social-profile and duplicate-governance realities. | 10 |

## Status Decisions

| Artifact | Old Status | New Status | Changed By | Approved By | Reason |
|----------|------------|------------|------------|-------------|--------|
| `F-M06-CRM-001` | Draft | Draft | Codex CLI | - | Expanded materially, but still blocked by consent legal source, write-back scope, and duplicate governance approvals. |
| New UXUI slices | N/A | Draft | Codex CLI | - | Created to support structured design handoff from the parent SRS. |
| New user stories | N/A | Draft | Codex CLI | - | Created to support planning and phased implementation discussions. |

## Visual / Logic Audit

- [ ] **Layout Audit**: UX slices created, but no final mockup or pixel review yet.
- [ ] **Tone Audit**: N/A for design/story scaffolding work.
- [x] **Logic Audit**: The new pack now separates list/view/review/action responsibilities and better matches operational CRM flows.

## Business Owner Feedback & Sentiments

Business Owner explicitly wanted the UX/story pack to split into 4 major CRM surfaces and asked for deeper analysis of customer profile relationships with social profiles, duplicate detection, merge flows, and bulk update behavior.

## Rules Extracted (for Knowledge Bank)

- [ ] No new cross-project rule extracted.

## Next Steps

- [ ] Convert the 4 UX slices into FE preview-ready layouts or mockups.
- [ ] Materialize API mapping for duplicate review and bulk-update jobs.
- [ ] Define exact `social profile -> customer` resolve thresholds and human-approval rules.
- [ ] Confirm phase-1 bulk actions and consent restrictions with BQ.
