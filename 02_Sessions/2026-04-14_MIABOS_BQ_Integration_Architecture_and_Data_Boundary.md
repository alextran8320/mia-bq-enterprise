# High-Precision Session Log: 2026-04-14 - MIABOS - BQ Integration Architecture and Data Boundary

**Date**: 2026-04-14
**Project**: MIABOS -> `advisory / pre-project BQ workspace context`
**Phase**: PB-01 / PB-02
**Duration**: ~1h
**AI Channel**: Codex CLI
**Model / Environment**: GPT-5 Codex
**Agent Identity**: A01 PM Agent -> `00_Agent_OS/Agents/A01_PM_Agent.md`
**Neural Handshake**: [x] Verified current state against the active workspace context and latest session log.

---

## Strategic Context

The core objective of this session was to convert the ongoing BQ chatbot integration discussion into a concrete architecture artifact that both MIA and BQ can use as a shared framing document before detailed flow-by-flow analysis begins, then refine it into a simpler module-level modeling view and Vietnamese working-document language for proposal and discovery use, and finally review whether the synchronized data scope is actually sufficient for internal chatbot use across departments.

## Collaborative Deep-Dive

- **Decision Point A**: The Business Owner clarified that `SAP B1` is the current source of truth for inventory. -> The architecture now anchors inventory around SAP and treats other systems as contextual or channel-specific sources.
- **Decision Point B**: The Business Owner clarified that pricing and promotion ownership are still uncertain and may span `SAP B1`, `KiotViet`, and `Haravan`. -> The architecture now explicitly introduces a `pricing / promotion resolution logic` layer instead of assuming a single source.
- **Decision Point C**: The Business Owner clarified that the internal chatbot must support both Q&A and escalation. -> The architecture now includes an `Action and Escalation Layer`.
- **Decision Point D**: The Business Owner clarified that the external chatbot should only expose simplified availability such as `in stock` or `out of stock`. -> The architecture now separates internal and external answer models.
- **Decision Point E**: The Business Owner asked for a simpler integration model before detailed design. -> The architecture artifact now includes an explicit module-level table showing `module -> direction -> sync frequency -> purpose -> logic note`.
- **Decision Point F**: The Business Owner asked to adjust the docs into Vietnamese. -> The main architecture artifact and the BQ pack index were rewritten into Vietnamese-oriented working language.
- **Decision Point G**: The Business Owner asked for a review of whether the synchronized information is already enough for internal chatbot use across departments. -> The architecture artifact now includes a department-by-department sufficiency review and a gap list for the missing modules.
- **Decision Point H**: The Business Owner asked for an overview drawing of the modules that will integrate with SAP B1. -> The architecture artifact now includes a dedicated `SAP B1 -> MIA BOS` module overview diagram.
- **Alternative Approaches Rejected**: A full-replica design in which MIA mirrors SAP objects broadly was rejected because it would increase sync complexity, governance cost, and duplication without improving the phase-1 AI value proposition.

## Artifacts Created/Updated

| Artifact | Location (Relative Link) | Key Change | Fidelity vs. Design (1-10) |
|----------|-------------------------|------------|----------------------------|
| BQ Integration Architecture and Data Boundary | `04_Raw_Information/Customers/Giay_BQ/2026-04-14_BQ_Integration_Architecture_And_Data_Boundary.md` | Added a department-by-department sufficiency review and a dedicated SAP B1 -> MIA BOS module overview diagram on top of the earlier simplified integration model | 9 |
| BQ customer-pack index | `04_Raw_Information/Customers/Giay_BQ/README.md` | Rewrote the BQ pack index into Vietnamese and retained the new architecture artifact link | 9 |
| Daily Log | `02_Sessions/2026-04-14_Daily_Log.md` | Logged the artifact-changing work block for the day | 10 |
| Session Index | `02_Sessions/_session_index.md` | Added the new dated section and linked this session | 10 |
| Current Context | `02_Sessions/_current_context.md` | Updated the active workspace topic and next actions to reflect the new architecture artifact | 10 |

## Status Decisions

| Artifact | Old Status | New Status | Changed By | Approved By | Reason |
|----------|------------|------------|------------|-------------|--------|
| `2026-04-14_BQ_Integration_Architecture_And_Data_Boundary.md` | - | Draft | Codex CLI | - | New architecture-framing artifact created for proposal and discovery alignment |
| `04_Raw_Information/Customers/Giay_BQ/README.md` | Draft | Draft | Codex CLI | - | Index updated only; no approval-state change intended |

## Visual / Logic Audit

- [ ] **Layout Audit**: Not applicable for this document-only work block.
- [ ] **Tone Audit**: Not applicable for this document-only work block.
- [x] **Logic Audit**: The new artifact, the customer-pack index, the Daily Log, the Session Log, `_session_index.md`, and `_current_context.md` were synchronized in the same work block.

## Business Owner Feedback & Sentiments

The Business Owner requested that the deliverable should begin with the overall integration model first, then move into detailed flows, goals, logic, and the storage boundary so both implementation teams can align before execution details are expanded.

The Business Owner also clarified:

> Inventory truth is currently on SAP B1.

> Internal chatbot should support both read and escalation.

> External chatbot should answer inventory only in a simplified `in stock` / `out of stock` way.

> The next need is a simple integration model first: module, direction, and sync frequency.

> Adjust the docs into Vietnamese.

> Review whether the synchronized information already meets the internal chatbot needs across departments.

> Draw the overall model of the modules that will integrate with SAP B1.

## Rules Extracted (for Knowledge Bank)

- [ ] No new cross-project Knowledge Bank rule extracted in this session.

## Next Steps

- Produce a `Source-of-Truth Matrix` by domain and channel for BQ.
- Produce a `Role-Permission Matrix` for the internal chatbot scope.
- Produce a `Detailed Integration Flow Pack` covering inventory, product, pricing, promotion, and escalation.
- Validate pricing and promotion ownership across `SAP B1`, `KiotViet`, `Haravan`, and Excel-based policy files.
- Decide whether the next scope slice should add `organization-scope mapping`, `order / fulfillment / CS context`, and `promotion approval / resolution` to support a broader multi-department chatbot scope.
