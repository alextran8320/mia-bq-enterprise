# MIABOS - Project Workspace

**Status**: Active Workspace
**Last Updated**: 2026-04-14

## Project Identity

- **Project Name**: MIABOS
- **Client**: Giay BQ
- **Client Segment**: Retail
- **Project Scope**: AI platform for Marketing, Sales, and Customer Service operations
- **Business Context**: MIABOS is being positioned here as an AI operating workspace tailored to a retail client rather than as a generic multi-product internal platform description.

## Retained Assets

- [Design System](Design/Aura_Minimalist_Design_System.md)
- `Build/Frontend_App/` - retained implementation workspace
- `Build/Screenshots/` - retained empty evidence workspace

## Reset Scope

The following documentation layers were intentionally removed on 2026-04-13:

- `Analysis/`
- `Architecture/`
- `Business/`
- `Planning/`
- `Test/`
- `Design/UXUI_Features/`
- `Design/UXUI-Global-IA-Spec.md`
- `ANALYSIS_PLAN.md`
- `_backlog.md`

## Current Direction

- Prioritize project descriptions that reference **Giay BQ** explicitly.
- Treat the active domain as **Retail**.
- Describe MIABOS in this workspace as serving **Marketing, Sales, and Customer Service** workflows for the client.

## Requirement Source

- **Primary Requirement Pack**: [04_Raw_Information/Customers/Giay_BQ/README.md](../../04_Raw_Information/Customers/Giay_BQ/README.md)
- **Working Rule**: Until a newer approved intake source replaces it, the Agent Team should treat the `Giay_BQ` customer pack as the active source of requirements for this workspace.

## Session Timeline

| Date | Session Log | Summary |
|------|-------------|---------|
| 2026-04-13 | [2026-04-13_MIABOS_Project_Document_Reset](../../02_Sessions/2026-04-13_MIABOS_Project_Document_Reset.md) | Removed business, planning, analysis, architecture, test, and feature-level design documents while preserving the design system and build workspace. |
| 2026-04-13 | [2026-04-13_MIABOS_Project_Metadata_Reset](../../02_Sessions/2026-04-13_MIABOS_Project_Metadata_Reset.md) | Updated the retained project metadata so MIABOS is now explicitly scoped to Giay BQ, Retail, and the Marketing/Sales/CS operating domain. |
| 2026-04-13 | [2026-04-13_MIABOS_Giay_BQ_Requirement_Source_Linkage](../../02_Sessions/2026-04-13_MIABOS_Giay_BQ_Requirement_Source_Linkage.md) | Linked the `Giay_BQ` customer pack into the agent control plane so the team now uses it as the active requirement source. |
| 2026-04-13 | [2026-04-13_MIABOS_BQ_SAP_Research_Consolidation](../../02_Sessions/2026-04-13_MIABOS_BQ_SAP_Research_Consolidation.md) | Consolidated SAP Business One research for the BQ case into a single reusable research artifact inside the active customer pack. |
| 2026-04-14 | [2026-04-14_MIABOS_BQ_Integration_Architecture_and_Data_Boundary](../../02_Sessions/2026-04-14_MIABOS_BQ_Integration_Architecture_and_Data_Boundary.md) | Promoted the SAP B1 internal chatbot integration document into the project Analysis feature-brief layer, deprecated the raw-pack copy, and reframed the scope into a practical POC by department, question type, and minimum data set. |
| 2026-04-14 | [2026-04-14_MIABOS_BQ_Integration_Architecture_and_Data_Boundary](../../02_Sessions/2026-04-14_MIABOS_BQ_Integration_Architecture_and_Data_Boundary.md) | Authored the first full SRS for the SAP B1 integration feature in the project SRS layer and registered feature `F-SAP-INT-001` in the feature registry. |
| 2026-04-14 | [2026-04-14_MIABOS_BQ_Integration_Architecture_and_Data_Boundary](../../02_Sessions/2026-04-14_MIABOS_BQ_Integration_Architecture_and_Data_Boundary.md) | Refined the SAP B1 integration SRS into a final Vietnamese handoff version with a cleaner integration model, storage boundary, department question matrix, and customer discovery pack. |
| 2026-04-14 | [2026-04-14_MIABOS_BQ_Integration_Architecture_and_Data_Boundary](../../02_Sessions/2026-04-14_MIABOS_BQ_Integration_Architecture_and_Data_Boundary.md) | Expanded the SRS so MIA BOS is positioned as a CRM plus AI Sales/CSKH layer, added realtime inventory guidance, FAQ and policy ownership on MIA, and CRM data boundaries for customer, order summary, and remarketing use cases. |
| 2026-04-14 | [2026-04-14_MIABOS_BQ_Integration_Architecture_and_Data_Boundary](../../02_Sessions/2026-04-14_MIABOS_BQ_Integration_Architecture_and_Data_Boundary.md) | Deepened the SRS with customer/product/order ownership analysis, dual-ID and sync-direction guidance, a cleaner high-level integration module model, and richer department-by-department internal Q&A analysis for BQ retail operations. |
| 2026-04-14 | [2026-04-14_MIABOS_BQ_Integration_Architecture_and_Data_Boundary](../../02_Sessions/2026-04-14_MIABOS_BQ_Integration_Architecture_and_Data_Boundary.md) | Added a more detailed SAP B1 <-> MIA BOS module integration model and a direct module-mapping table so the overall architecture is easier to explain in workshops and implementation planning. |
| 2026-04-14 | [2026-04-14_MIABOS_BQ_Integration_Architecture_and_Data_Boundary](../../02_Sessions/2026-04-14_MIABOS_BQ_Integration_Architecture_and_Data_Boundary.md) | Restructured the integration view into three cleaner models: SAP-to-MIA module synchronization, MIA modules for the internal chatbot, and MIA modules for the sales/CSKH chatbot. |
