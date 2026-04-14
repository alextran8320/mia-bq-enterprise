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

## Continuation - SAP POC Brief Realignment

### Strategic Update
The working SAP integration artifact was re-evaluated against practical delivery needs. The conclusion was that the canonical document should move out of the raw customer-pack layer and into the project Analysis feature-brief layer so it can function as a true POC scoping artifact.

### Additional Decisions
- **Decision Point K**: The Business Owner explicitly rejected SAP-side authorization integration as necessary. -> The revised POC brief removes SAP authorization sync and instead defines MIA as the owner of MIA-specific user, role, feature-scope, and data-scope configuration.
- **Decision Point L**: The Business Owner asked for a more realistic operating model based on which department will ask what and therefore which data must actually be synchronized. -> The revised POC brief now maps departments, common questions, required data domains, and the minimum fields MIA must take.
- **Decision Point M**: The Business Owner asked for a self-critique and a complete result that could be used for customer POC immediately. -> The new project-level brief now contains a self-critique section, a narrowed POC scope, explicit non-scope decisions, and a minimum data-set definition.

### Additional Artifacts Created/Updated
| Artifact | Location (Relative Link) | Key Change | Fidelity vs. Design (1-10) |
|----------|-------------------------|------------|----------------------------|
| SAP B1 Internal Chatbot Integration POC | `01_Projects/MIABOS/Analysis/Features/Briefs/SAP_B1_Internal_Chatbot_Integration_POC.md` | New project-level canonical POC brief for the SAP integration feature | 9 |
| Raw integration architecture doc | `04_Raw_Information/Customers/Giay_BQ/2026-04-14_BQ_Integration_Architecture_And_Data_Boundary.md` | Reframed as a deprecated pointer to the new project-level brief | 9 |
| BQ customer-pack index | `04_Raw_Information/Customers/Giay_BQ/README.md` | Updated to point readers to the new project-level brief | 9 |
| Project timeline | `01_Projects/MIABOS/_project.md` | Added this work block to the project Session Timeline | 10 |

### Additional Business Owner Direction
> Integration of authorization is not necessary. Each system has its own permission model. On MIA, we will configure user permissions appropriate to MIA.

> Analyze clearly which department will access which data and what they will ask, then determine exactly which information should be taken.

> Critique your own result and produce a complete version that can be used for customer POC immediately.

### Additional Next Steps
- Produce the MIA-side user/role/data-scope matrix.
- Produce the source-of-truth matrix for pricing and promotions by channel.
- Break the POC brief into detailed data-flow packs for product, inventory, pricing, promotion, and escalation.

## Continuation - SAP Integration SRS Authoring

### Strategic Update
The working POC brief has now been promoted into a full SRS-level BA artifact in the project `Features/SRS` layer. The new SRS becomes the canonical structured handoff for later UXUI, FE preview, and technical integration work.

### Additional Decisions
- **Decision Point N**: The Business Owner requested a final SRS in Vietnamese with diacritics and with additional integration sections beyond the standard template. -> The new SRS was authored to satisfy the standard SRS structure plus the required integration model, sync matrix, field-level detail, department Q&A mapping, and customer question pack.
- **Decision Point O**: The Business Owner needs the feature described for both internal chatbot use and sales advisory chatbot use. -> The SRS now separates internal chatbot logic from sales-safe external advisory behavior.

### Additional Artifacts Created/Updated
| Artifact | Location (Relative Link) | Key Change | Fidelity vs. Design (1-10) |
|----------|-------------------------|------------|----------------------------|
| SAP B1 Integration SRS | `01_Projects/MIABOS/Analysis/Features/SRS/F-SAP-INT-001_SAP_B1_Internal_Chatbot_Integration_SRS.md` | New full SRS in Vietnamese with diacritics for internal chatbot and sales advisory integration | 9 |
| Feature Registry | `01_Projects/MIABOS/Analysis/Features/_feature_registry.md` | Registered feature `F-SAP-INT-001` with current draft status and blocker | 10 |
| Project Timeline | `01_Projects/MIABOS/_project.md` | Added the SRS authoring work block to the project Session Timeline | 10 |

### Additional Next Steps
- Review the SRS with the Business Owner.
- Resolve pricing and promotion source-of-truth questions.
- If approved, promote the feature toward `SRS Ready` and open downstream UXUI work.

## Continuation - SAP Integration SRS Final Refinement

### Strategic Update
The initial SRS draft was tightened into a cleaner final BA handoff so the artifact can be used immediately in customer-facing POC discussion. The revised version simplifies the structure, keeps the document fully Vietnamese, and clarifies the operating boundary between SAP B1 and MIA BOS.

### Additional Decisions
- **Decision Point P**: The SRS should not stop at a generic integration description. -> The final version now explicitly documents which data MIA should store, which data MIA should not store, and why this protects MIA from becoming an SAP mirror.
- **Decision Point Q**: The Business Owner needs a more operational view by department. -> The final version now sharpens the department-to-question-to-data mapping so the POC conversation can move directly into scope confirmation.

### Additional Artifacts Created/Updated
| Artifact | Location (Relative Link) | Key Change | Fidelity vs. Design (1-10) |
|----------|-------------------------|------------|----------------------------|
| SAP B1 Integration SRS | `01_Projects/MIABOS/Analysis/Features/SRS/F-SAP-INT-001_SAP_B1_Internal_Chatbot_Integration_SRS.md` | Rewritten into a cleaner final Vietnamese handoff version with clearer integration model, storage boundary, and department Q&A mapping | 10 |
| Feature Registry | `01_Projects/MIABOS/Analysis/Features/_feature_registry.md` | Re-saved and aligned to the finalized feature naming and blocker wording | 10 |
| Project Timeline | `01_Projects/MIABOS/_project.md` | Added the final refinement step to the project session timeline | 10 |

### Additional Next Steps
- Review the finalized SRS with the Business Owner.
- Confirm pricing and promotion source-of-truth by channel.
- If accepted, move the feature toward `SRS Ready` and open downstream UXUI and technical design.

## Continuation - CRM and AI Sales Expansion for SAP SRS

### Strategic Update
The Business Owner expanded the target outcome beyond a simple advisory chatbot. The SAP integration SRS now frames MIA BOS as a CRM plus AI Sales/CSKH operating layer that can support consultative selling, customer profiling, remarketing, and customer-care use cases in addition to internal chatbot scenarios.

### Additional Decisions
- **Decision Point R**: The sales chatbot should aim to replace significant portions of salesperson and in-store advisory behavior. -> The SRS now includes customer-attribute capture, consultative questioning, product guidance, location-aware availability answers, and conversion-oriented CTA logic.
- **Decision Point S**: Inventory does not have to be persisted as a full synchronized model on MIA. -> The SRS now proposes realtime inventory checking as the primary mechanism, with optional short-lived soft-cache fallback.
- **Decision Point T**: Some critical FAQ and company-policy knowledge will not come from SAP or channel systems. -> The SRS now explicitly places company policy, return policy, AI behavior rules, and brand knowledge under MIA-owned knowledge modules.
- **Decision Point U**: MIA BOS may serve as the CRM layer for sales and care workflows. -> The SRS now includes customer, customer-attribute, and order-summary persistence boundaries for Marketing, Sales, and CSKH use cases.

### Additional Artifacts Created/Updated
| Artifact | Location (Relative Link) | Key Change | Fidelity vs. Design (1-10) |
|----------|-------------------------|------------|----------------------------|
| SAP B1 Integration SRS | `01_Projects/MIABOS/Analysis/Features/SRS/F-SAP-INT-001_SAP_B1_Internal_Chatbot_Integration_SRS.md` | Expanded to include CRM positioning, realtime inventory, FAQ ownership, customer/order summary scope, and remarketing behavior | 10 |
| Feature Registry | `01_Projects/MIABOS/Analysis/Features/_feature_registry.md` | Blocker wording updated to include customer and order data scope clarification | 10 |
| Traceability Matrix | `01_Projects/MIABOS/Analysis/Features/_traceability_matrix.md` | Added traceability row for feature `F-SAP-INT-001` | 10 |
| Project Timeline | `01_Projects/MIABOS/_project.md` | Added this SRS expansion step to the project session timeline | 10 |

### Additional Next Steps
- Confirm customer-data consent, retention, and CRM ownership boundaries with BQ.
- Confirm the source of order-summary data and the allowed detail level for store-level availability responses.
- If agreed, split the feature into detailed flow packs for internal chatbot, AI sales, CRM enrichment, and remarketing.

## Continuation - Deep Retail Data Ownership and Department Q&A Refinement

### Strategic Update
The Business Owner clarified that MIA BOS should be able to persist customer, product, and order information deeply enough to support independent Marketing, Sales, and Customer Care operations. In response, the SRS was deepened beyond high-level integration scope into a more practical retail architecture that distinguishes ERP ownership, CRM ownership, and channel-originating transaction flows.

### Additional Decisions
- **Decision Point V**: MIA BOS should be able to act as the CRM-side master for customer operations. -> The SRS now distinguishes MIA-side customer identity from SAP ERP-side business partner references and recommends a mapping layer rather than forcing a single raw identifier across systems.
- **Decision Point W**: Orders can originate from multiple systems. -> The SRS now recommends a dual-ID and federated-order model: `mia_order_ref` for MIA-origin orders, `sap_order_no` for ERP-confirmed orders, and `channel_order_no` for channel-originating orders.
- **Decision Point X**: The previous module-level integration diagram was still too implementation-shaped. -> The SRS now includes a cleaner top-level module model that separates ERP Core, Channel Systems, CRM Core, AI Layer, and Workflow / Remarketing.
- **Decision Point Y**: Internal chatbot analysis needed to reflect real retail department behavior more explicitly. -> The SRS now expands the department-by-department section with operational objectives, core question categories, and required data visibility.

### Additional Artifacts Created/Updated
| Artifact | Location (Relative Link) | Key Change | Fidelity vs. Design (1-10) |
|----------|-------------------------|------------|----------------------------|
| SAP B1 Integration SRS | `01_Projects/MIABOS/Analysis/Features/SRS/F-SAP-INT-001_SAP_B1_Internal_Chatbot_Integration_SRS.md` | Expanded with customer/order ownership, dual-ID sync model, cleaner module diagram, and deeper internal department analysis | 10 |
| Feature Registry | `01_Projects/MIABOS/Analysis/Features/_feature_registry.md` | Blocker wording updated to include customer/order ownership and code-generation model clarification | 10 |
| Project Timeline | `01_Projects/MIABOS/_project.md` | Added this deeper retail architecture refinement to the project timeline | 10 |

### Additional Next Steps
- Confirm customer master ownership, BP-code mapping, and order-ID federation with BQ and the SAP implementation partner.
- Decide whether MIA should receive channel orders directly, via SAP only, or through a hybrid federation pattern.
- If agreed, split the SRS into follow-up technical packs for customer master, order federation, realtime availability, and departmental chatbot flows.

## Continuation - Detailed SAP-MIA Module Integration Model

### Strategic Update
The Business Owner requested an even clearer overall module model for SAP B1 and MIA BOS. The SRS was therefore expanded with a more detailed SAP-to-MIA integration diagram and a direct module mapping table so both business and technical stakeholders can understand the architecture without jumping straight into field-level detail.

### Additional Decisions
- **Decision Point Z**: The single high-level module model was not enough for workshop readability. -> The SRS now includes a second, more detailed module integration view that shows how SAP ERP modules map into MIA CRM, AI, workflow, and identity-mapping modules.

### Additional Artifacts Created/Updated
| Artifact | Location (Relative Link) | Key Change | Fidelity vs. Design (1-10) |
|----------|-------------------------|------------|----------------------------|
| SAP B1 Integration SRS | `01_Projects/MIABOS/Analysis/Features/SRS/F-SAP-INT-001_SAP_B1_Internal_Chatbot_Integration_SRS.md` | Added detailed SAP-to-MIA module diagram and module mapping table | 10 |
| Project Timeline | `01_Projects/MIABOS/_project.md` | Added this detailed integration-model refinement to the project timeline | 10 |

### Additional Next Steps
- Validate whether the detailed module model is clear enough for customer-facing discussion.
- If needed, break the model further into API-level or sequence-flow technical packs.

## Continuation - Three-Model Integration View Simplification

### Strategic Update
The detailed integration model was still too dense for quick workshop communication. The SRS was therefore restructured into three clearer visual models: one for SAP-to-MIA synchronization only, one for MIA modules serving the internal chatbot, and one for MIA modules serving the sales and customer-care chatbot.

### Additional Decisions
- **Decision Point AA**: The sync model should only show SAP and MIA modules. -> The first detailed diagram now excludes downstream chatbot modules and focuses only on module synchronization, direction, and frequency.
- **Decision Point AB**: Internal and external AI-consumption views should not be mixed. -> The MIA-side AI module usage is now split into separate internal-chatbot and sales/CSKH-chatbot models.

### Additional Artifacts Created/Updated
| Artifact | Location (Relative Link) | Key Change | Fidelity vs. Design (1-10) |
|----------|-------------------------|------------|----------------------------|
| SAP B1 Integration SRS | `01_Projects/MIABOS/Analysis/Features/SRS/F-SAP-INT-001_SAP_B1_Internal_Chatbot_Integration_SRS.md` | Reorganized the detailed integration view into three simpler architecture models and aligned the table with two-way sync semantics | 10 |
| Project Timeline | `01_Projects/MIABOS/_project.md` | Added this three-model simplification step to the project timeline | 10 |

### Additional Next Steps
- Validate whether the three-model structure is now simple enough for customer-facing workshop use.
- If needed, add separate sequence-flow diagrams for customer, order, and channel-order synchronization.
