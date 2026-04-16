# High-Precision Session Log: 2026-04-15 - MIABOS - Customer 360 CRM SRS Deepening

**Date**: 2026-04-15
**Project**: MIABOS -> [`01_Projects/MIABOS/_project.md`](../01_Projects/MIABOS/_project.md)
**Phase**: PB-03 / Product Design
**Duration**: ~0.5h
**AI Channel**: Codex CLI
**Model / Environment**: GPT-5 Codex
**Agent Identity**: A01 PM Agent / A03 BA execution support
**Neural Handshake**: [x] Used current AGENTS.md process, latest project context, module tree, Order and Fulfillment SRS, Feature Registry, and Feature Dependency Map before changing canonical artifacts.

---

## Strategic Context

Business Owner requested a deeper implementation-grade analysis for `F-M06-CRM-001 Customer and CRM`, especially a Customer 360 profile that includes customer details and relationships such as order history, chat history, call history, and AI-ready CRM context.

## Collaborative Deep-Dive

- **Decision Point A**: The previous CRM SRS was too high-level and mostly placeholder-level. It has been expanded into a detailed Customer 360 SRS.
- **Decision Point B**: Customer 360 should not only store static profile data. It must aggregate identity mapping, attributes, consent, segmentation, order history, conversation history, call history, timeline, and AI profile summary.
- **Decision Point C**: MIA BOS can be the CRM master layer while still respecting SAP / Haravan / KiotViet as source systems for channel and ERP references.
- **Decision Point D**: Raw chat/call data is policy-sensitive, so the SRS defaults to storing summary-level history unless BQ approves raw message, transcript, or recording storage.

## Artifacts Created/Updated

| Artifact | Location (Relative Link) | Key Change | Fidelity vs. Design (1-10) |
|----------|--------------------------|------------|----------------------------|
| Customer and CRM SRS | [F-M06-CRM-001_Customer_And_CRM_SRS.md](../01_Projects/MIABOS/Analysis/Features/Modules/CRM_Workspace/Customer_And_CRM/SRS/F-M06-CRM-001_Customer_And_CRM_SRS.md) | Rewritten into a detailed Customer 360 SRS with profile, identity, order/chat/call history, consent, timeline, AI summary, validation, tests, and rollout. | 10 |
| Feature Registry | [Feature Registry](../01_Projects/MIABOS/Analysis/Features/_feature_registry.md) | Updated blocker wording for `F-M06-CRM-001` to include identity merge, chat/call history, consent, and AI/remarketing boundaries. | 10 |
| Feature Dependency Map | [Feature Dependency Map](../01_Projects/MIABOS/Analysis/Features/_feature_dependency_map.md) | Added Customer 360 dependencies from Orders, Internal AI Chat, Sales Advisor AI, Escalation/Workflow, and Audit. | 9 |

## Status Decisions

| Artifact | Old Status | New Status | Changed By | Approved By | Reason |
|----------|------------|------------|------------|-------------|--------|
| `F-M06-CRM-001` | Draft | Draft | Codex CLI | - | SRS deepened but still has open questions around consent, identity merge, and history storage policy. |

## Visual / Logic Audit

- [ ] **Layout Audit**: N/A, document-only work block.
- [ ] **Tone Audit**: N/A, document-only work block.
- [x] **Logic Audit**: SRS now covers Customer 360 data groups, dependencies were updated, and blocker wording aligns with the expanded scope.

## Business Owner Feedback & Sentiments

Business Owner emphasized the need for a full customer profile and customer relationships, including order history, chat history, and call history, so MIABOS can support Marketing, Sales, CSKH, and AI selling with a true 360-degree customer view.

## Rules Extracted (for Knowledge Bank)

- [ ] No new cross-project rule extracted.

## Next Steps

- [ ] Confirm customer master boundary and identity merge rule with BQ.
- [ ] Confirm whether raw chat messages, call transcript, and call recording can be stored or only summary references.
- [ ] Convert Customer 360 SRS into UXUI spec and API/data mapping pack.
