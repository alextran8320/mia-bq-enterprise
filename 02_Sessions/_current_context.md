# Current Active Context

**Last Updated**: 2026-04-14
**Active Workspace Topic**: MIABOS Giay BQ integration architecture and data boundary
**Current Project**: `MIABOS`
**Current Phase**: `PB-01 / PB-02 integration framing`
**Latest Canonical Session Log**: [[2026-04-14_MIABOS_BQ_Integration_Architecture_and_Data_Boundary]]
**Today's Daily Log**: [[2026-04-14_Daily_Log]]

## Latest Decisions

- The `Giay_BQ` customer pack remains the active requirement source for the retained MIABOS workspace.
- A dedicated `2026-04-14_BQ_Integration_Architecture_And_Data_Boundary.md` artifact now frames the overall BQ integration model before detailed flows are designed.
- The integration model treats `SAP B1` as the inventory truth anchor and `MIA BOS` as the AI-facing interpretation and action layer.
- The proposed MIA boundary is intentionally minimal: canonical read models, governance metadata, and audit records rather than broad ERP replication.
- Pricing and promotion remain discovery-sensitive domains that require a later source-priority matrix by channel.
- The main architecture artifact now contains a simplified module-level model showing direction and sync frequency and has been adjusted into Vietnamese for working alignment with BQ.
- The current review concludes that the synchronized data is enough for a pilot serving Sales, Logistics, and part of Marketing/Trade, but not yet enough for a full multi-department internal chatbot.
- The architecture artifact now includes a dedicated SAP B1 -> MIA BOS module overview diagram.

## Next Actions

- Break the integration architecture into detailed flow packs for inventory, product, pricing, promotion, and escalation.
- Produce the role-permission and source-of-truth matrices needed for implementation alignment.
- Keep the BQ pack current as new discovery answers arrive.
