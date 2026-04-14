# Current Active Context

**Last Updated**: 2026-04-14
**Active Workspace Topic**: MIABOS Giay BQ SAP B1 integration SRS for internal chatbot and sales advisory chatbot
**Current Project**: `MIABOS`
**Current Phase**: `PB-02 / PB-03 BA contract drafting`
**Latest Canonical Session Log**: [[2026-04-14_MIABOS_BQ_Integration_Architecture_and_Data_Boundary]]
**Today's Daily Log**: [[2026-04-14_Daily_Log]]

## Latest Decisions

- The canonical SAP integration working document now exists in the project `Features/SRS` layer as `F-SAP-INT-001_SAP_B1_Internal_Chatbot_Integration_SRS.md`.
- The SRS has been refined into a cleaner final Vietnamese handoff version and includes the required custom integration sections requested by the Business Owner.
- SAP-side authorization sync remains out of scope; MIA owns MIA-side user, role, feature-scope, and data-scope configuration.
- The feature now frames MIA BOS as a CRM plus AI Sales/CSKH operating layer, not only an internal Q&A layer.
- Inventory is currently modeled with realtime checking as the preferred mechanism plus optional soft-cache fallback instead of a mandatory persisted inventory mirror.
- The feature registry now contains `F-SAP-INT-001` with current blocker on pricing / promotion source-of-truth plus customer / order ownership and identity-mapping clarification.
- The latest SRS version now includes customer master / ERP reference separation, dual-ID order guidance, and a deeper department-by-department internal chatbot analysis.
- The latest SRS version also includes a detailed module-by-module SAP B1 <-> MIA BOS integration model for clearer workshop communication.
- The detailed integration section is now split into three clearer models: SAP-to-MIA sync modules, MIA modules for the internal chatbot, and MIA modules for the sales/CSKH chatbot.

## Next Actions

- Review and approve the new SRS with the Business Owner.
- Resolve pricing and promotion source-of-truth by channel.
- Confirm customer-data, order-summary, and remarketing data boundaries for phase 1.
- Confirm customer ID ownership, business-partner mapping, and channel-order federation model.
- Decide whether the next artifact should break the module model into API-level flow packs.
- Validate whether the current three-model architecture view is ready for customer workshop usage.
- Promote the feature toward `SRS Ready` and open downstream UXUI / technical design.
