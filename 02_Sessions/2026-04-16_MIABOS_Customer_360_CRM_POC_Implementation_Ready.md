# High-Precision Session Log: 2026-04-16 - MIABOS - Customer 360 CRM POC Implementation Ready

**Date**: 2026-04-16
**Project**: MIABOS -> [`01_Projects/MIABOS/_project.md`](../01_Projects/MIABOS/_project.md)
**Phase**: PB-03 / Product Design
**Duration**: ~0.8h
**AI Channel**: Codex CLI
**Model / Environment**: GPT-5 Codex
**Agent Identity**: A01 PM Agent / A03 BA execution support
**Neural Handshake**: [x] Reused current AGENTS.md process, project timeline, latest branch context on `Hino`, Customer 360 SRS, and adjacent Order module context before changing canonical artifacts.

---

## Strategic Context

Business Owner requested continuing the `Customer 360 CRM` work and pushing it beyond analysis depth into a `POC / implementation-ready` state so the team can use it for BA clarification, UX planning, BE estimation, and integration planning.

## Collaborative Deep-Dive

- **Decision Point A**: The prior version already described Customer 360 well at the business-analysis layer, but it still lacked engineering-shaping content. -> Added `POC Implementation Framing`, module breakdown, sync boundary, and implementation phasing.
- **Decision Point B**: The document should help teams decide what to build first, not just what exists conceptually. -> Added explicit P0/P1 module decomposition for `Customer Core`, `Identity Resolver`, `Order Summary Store`, `Conversation Summary Store`, `Timeline`, `Consent`, and `Action Center`.
- **Decision Point C**: `MIA BOS` needs to behave as a CRM master without becoming a replica of SAP / Haravan / KiotViet. -> Added storage-boundary tables covering what MIA should store vs. what should remain in source systems.
- **Decision Point D**: Backend estimation and API design require more than screen-level requirements. -> Added API payload minima, background jobs, event-driven triggers, API-to-DB mapping, POC rollout phases, and POC exit criteria.

## Artifacts Created/Updated

| Artifact | Location (Relative Link) | Key Change | Fidelity vs. Design (1-10) |
|----------|--------------------------|------------|----------------------------|
| Customer and CRM SRS | [F-M06-CRM-001_Customer_And_CRM_SRS.md](../01_Projects/MIABOS/Analysis/Features/Modules/CRM_Workspace/Customer_And_CRM/SRS/F-M06-CRM-001_Customer_And_CRM_SRS.md) | Elevated to implementation-ready depth with POC scope, module architecture, source ownership, sync model, API payloads, jobs/events, storage boundary, rollout plan, and stronger acceptance criteria. | 10 |
| Daily Log | [2026-04-16_Daily_Log.md](2026-04-16_Daily_Log.md) | Added this Customer 360 implementation-ready work block. | 10 |
| Session Index | [_session_index.md](_session_index.md) | Added this session under 2026-04-16. | 10 |
| Current Context | [_current_context.md](_current_context.md) | Updated active context from repo-sync continuation to Customer 360 implementation-ready refinement. | 10 |
| Project Timeline | [MIABOS Project](../01_Projects/MIABOS/_project.md) | Added new timeline entry for the Customer 360 implementation-ready pass. | 10 |

## Status Decisions

| Artifact | Old Status | New Status | Changed By | Approved By | Reason |
|----------|------------|------------|------------|-------------|--------|
| `F-M06-CRM-001` | Draft | Draft | Codex CLI | - | Content depth increased materially, but open decisions remain around consent legal source, write-back boundary, and duplicate governance. |

## Visual / Logic Audit

- [ ] **Layout Audit**: N/A, document-only work block.
- [ ] **Tone Audit**: N/A, document-only work block.
- [x] **Logic Audit**: The SRS now gives implementation teams a clearer path with module boundaries, jobs, APIs, tables, sync frequency, and POC phaseing.

## Business Owner Feedback & Sentiments

Business Owner asked for the CRM module to go deeper into an implementation-ready state, with clearer structure for what MIA should store, how it should integrate with source systems, and how Customer 360 should support real Marketing, Sales, and Customer Service use cases.

## Rules Extracted (for Knowledge Bank)

- [ ] No new cross-project rule extracted.

## Next Steps

- [ ] Convert the Customer 360 SRS into an API mapping pack with sample request/response payloads.
- [ ] Define the write-back matrix for `MIA -> SAP / Haravan / KiotViet`.
- [ ] Split the module into FE/UX slices: `Customer List`, `Customer 360`, `Duplicate Review`, `Care Action`.
- [ ] If BQ confirms OmiCall scope, promote `Call Summary` from architecture-ready to POC-deliverable.
