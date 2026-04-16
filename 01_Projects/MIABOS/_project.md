# MIABOS - Project Workspace

**Status**: Active Workspace
**Last Updated**: 2026-04-16

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
| 2026-04-16 | [2026-04-16_MIABOS_CRM_UXUI_Detailing](../../02_Sessions/2026-04-16_MIABOS_CRM_UXUI_Detailing.md) | Deepened the four CRM UXUI specs with explicit on-screen information, search/filter/sort logic, detailed actions, and UX behavior for implementation and wireframing. |
| 2026-04-16 | [2026-04-16_MIABOS_Customer_360_UX_And_Story_Pack](../../02_Sessions/2026-04-16_MIABOS_Customer_360_UX_And_Story_Pack.md) | Split `Customer 360 CRM` into four UX/story surfaces (`Customer List`, `Customer 360`, `Duplicate Review`, `Care Action`) and deepened customer-social relationships plus duplicate / merge / bulk-update logic. |
| 2026-04-16 | [2026-04-16_MIABOS_Order_And_Fulfillment_SRS_Deepening](../../02_Sessions/2026-04-16_MIABOS_Order_And_Fulfillment_SRS_Deepening.md) | Deepened `F-M05-ORD-001 Order and Fulfillment`, split `sales order` vs `return order`, materialized 4 UXUI docs and 4 planning stories, then standardized the docs to a richer implementation-ready level across SRS, UXUI, and Story layers. |
| 2026-04-16 | [2026-04-16_MIABOS_Customer_360_CRM_POC_Implementation_Ready](../../02_Sessions/2026-04-16_MIABOS_Customer_360_CRM_POC_Implementation_Ready.md) | Elevated `F-M06-CRM-001 Customer and CRM` from deep analysis into a POC / implementation-ready SRS with clearer module boundaries, source ownership, sync design, API/job structure, and rollout phases. |
| 2026-04-16 | [2026-04-16_MIABOS_Process_Fix_And_Mock_Expansion](../../02_Sessions/2026-04-16_MIABOS_Process_Fix_And_Mock_Expansion.md) | Fix quy trình: PNG gate removed per BO directive, UXUI ? Approved, F-M09-AIC-001 ? UXUI Approved. Expand mock 4?8 scenarios. Improve spike: error state, scroll, Unsupported card, a11y, microcopy. |
| 2026-04-16 | [2026-04-16_MIABOS_Internal_AI_Chat_Canonical_Prep_And_Spike](../../02_Sessions/2026-04-16_MIABOS_Internal_AI_Chat_Canonical_Prep_And_Spike.md) | Promote `F-M09-AIC-001` lên `SRS Ready`, materialize planning chain d?y d? cho `Internal AI Chat`, gi? UXUI ? tr?ng thái `Blocked` vì thi?u mockup sign-off, và thêm local spike preview `/ai/chat` b?ng mock data trong app React hi?n có. |
| 2026-04-16 | [2026-04-16_MIABOS_AI_Workspace_Planning_Chain_F_M09_AIC_001](../../02_Sessions/2026-04-16_MIABOS_AI_Workspace_Planning_Chain_F_M09_AIC_001.md) | Materialize planning chain cho `F-M09-AIC-001 Internal AI Chat`: t?o PRD `AI_Workspace`, Product Backlog, Sprint Backlog, User Story, và Subtask Board; gi? PRD `In Review`, story `Approved` cho planning, và khóa FE Preview cho t?i khi UXUI du?c Approved th?t. |
| 2026-04-16 | [2026-04-16_MIABOS_UXUI_F_M09_AIC_001_Review](../../02_Sessions/2026-04-16_MIABOS_UXUI_F_M09_AIC_001_Review.md) | Refined `UXUI-F-M09-AIC-001_Internal_AI_Chat.md` into a canonical `Blocked` UXUI artifact with required metadata, intended FE Preview story path, explicit mockup blockers, and SRS-aligned data-binding / token assumptions. |
| 2026-04-16 | [2026-04-16_MIABOS_Obsidian_Local_Gitignore](../../02_Sessions/2026-04-16_MIABOS_Obsidian_Local_Gitignore.md) | T?o root `.gitignore` v?i rule `.obsidian/` và g? toàn b? `.obsidian` kh?i Git index d? m?i máy gi? Obsidian workspace/config riêng mà không b? Git b?t bu?c track. |
| 2026-04-16 | [2026-04-16_MIABOS_Alex_Implementation_To_Main_Merge](../../02_Sessions/2026-04-16_MIABOS_Alex_Implementation_To_Main_Merge.md) | Merge branch `alex_implementation` vào `main` b?ng merge commit `f1fab3d`, dua toàn b? kh?i implementation/spec/design/session artifacts sang nhánh chính, và gi? l?i local working state c?a Business Owner du?i d?ng unstaged change sau merge. |
| 2026-04-16 | [2026-04-16_MIABOS_Knowledge_Center_And_AI_Workspace_SRS_Enhancement](../../02_Sessions/2026-04-16_MIABOS_Knowledge_Center_And_AI_Workspace_SRS_Enhancement.md) | Enhance l?i toàn b? 10 SRS c?a `Knowledge_Center` và `AI_Workspace` theo quy trình SRS m?i: thêm `§0B Integration Source Map`, neo BQ context/source map, m? r?ng flows/rules/NFR/AC, và gi? t?t c? ? `Draft` vì blocker nghi?p v? v?n còn m?. |
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
| 2026-04-14 | [2026-04-14_MIABOS_Main_Branch_Merge](../../02_Sessions/2026-04-14_MIABOS_Main_Branch_Merge.md) | Ð?ng b? branch `main` v?i `hien` b?ng fast-forward merge d? dua toàn b? artifact SAP/BQ m?i nh?t sang nhánh chính mà không phát sinh conflict. |
| 2026-04-15 | [2026-04-15_MIABOS_Tanh_To_Main_Merge](../../02_Sessions/2026-04-15_MIABOS_Tanh_To_Main_Merge.md) | Ð?ng b? branch `main` v?i `tanh` b?ng merge commit d? dua hai artifact SRS HAR và KV sang nhánh chính mà không làm m?t local `.obsidian/workspace.json`. |
| 2026-04-15 | [2026-04-15_MIABOS_Analysis_Artifact_Routing_Repair](../../02_Sessions/2026-04-15_MIABOS_Analysis_Artifact_Routing_Repair.md) | S?a misrouting sau merge b?ng cách chuy?n hai Feature SRS HAR/KV t? `02_Sessions/` v? `Analysis/Features/` ? l?p analysis canonical, c?p nh?t feature control-plane, và harden quy trình d? `02_Sessions/` ch? còn log artifacts. |
| 2026-04-15 | [2026-04-15_MIABOS_Analysis_Feature_Modularization](../../02_Sessions/2026-04-15_MIABOS_Analysis_Feature_Modularization.md) | Tái c?u trúc `Analysis/Features` thành 2 l?p `Integration` + `Modules`, relocate 3 source specs vào `Integration/Source_Specs/`, materialize 5 integration SRS và 12 business-module SRS, và d?ng b? l?i feature control-plane. |
| 2026-04-15 | [2026-04-15_MIABOS_Portal_CRM_Module_And_Sitemap_Recommendation](../../02_Sessions/2026-04-15_MIABOS_Portal_CRM_Module_And_Sitemap_Recommendation.md) | Materialize khuy?n ngh? chính th?c v? final module set và sitemap Portal CRM cho Giày BQ, ch?t các module c?n gi?, các module c?n b? sung (`I06`, `M13`, `M14`), và packaging product surfaces cho portal. |
| 2026-04-15 | [2026-04-15_MIABOS_Module_Surface_Restructuring](../../02_Sessions/2026-04-15_MIABOS_Module_Surface_Restructuring.md) | Restructure l?i canonical tree c?a `Modules/` theo các product surfaces c?a Portal CRM, move 12 business modules sang nhóm surface m?i, và d?ng b? l?i `Feature Registry` / `Traceability Matrix` v?i c?t `Portal Surface`. |
| 2026-04-15 | [2026-04-15_MIABOS_Customer_360_CRM_SRS_Deepening](../../02_Sessions/2026-04-15_MIABOS_Customer_360_CRM_SRS_Deepening.md) | Deepened `F-M06-CRM-001 Customer and CRM` into a Customer 360 SRS covering profile, identity mapping, order history, chat history, call history, consent, timeline, and AI-ready CRM context. |
| 2026-04-15 | [2026-04-15_MIABOS_Knowledge_Center_SRS_Expansion](../../02_Sessions/2026-04-15_MIABOS_Knowledge_Center_SRS_Expansion.md) | Materialize `Knowledge_Center` thành 4 SRS canonical riêng cho knowledge core, publishing queue, FAQ/policy library, và source governance; d?ng b? l?i control-plane analysis cho surface này. |
| 2026-04-15 | [2026-04-15_MIABOS_Planning_Folder_And_Knowledge_Center_PRDs](../../02_Sessions/2026-04-15_MIABOS_Planning_Folder_And_Knowledge_Center_PRDs.md) | M? l?p `Planning/` cho project và materialize 4 PRD canonical c?a `Knowledge_Center`, d?ng th?i n?i traceability t? PRD sang SRS. |
| 2026-04-15 | [2026-04-15_MIABOS_AI_Workspace_SRS_Expansion](../../02_Sessions/2026-04-15_MIABOS_AI_Workspace_SRS_Expansion.md) | Materialize `AI_Workspace` thành 6 capability slices b?ng cách thêm 4 SRS m?i cho answer history, escalation handoff, suggested actions, và CTA/lead handoff; d?ng b? l?i control-plane analysis cho surface AI. |

| 2026-04-16 | [2026-04-16_MIABOS_Pull_Main_Into_Hino_And_Resolve_Customer_360_Merge](../../02_Sessions/2026-04-16_MIABOS_Pull_Main_Into_Hino_And_Resolve_Customer_360_Merge.md) | Merged the latest origin/main into branch Hino, resolved conflicts, and preserved the deepened Customer 360 CRM SRS for continued analysis work. |



| 2026-04-16 | [2026-04-16_MIABOS_Customer_List_Encoding_Fix](../../02_Sessions/2026-04-16_MIABOS_Customer_List_Encoding_Fix.md) | Fixed UXUI Customer List text encoding (Antigravity) |
| 2026-04-16 | [2026-04-16_MIABOS_M06_CRM_UXUI_Encoding_Fix](../../02_Sessions/2026-04-16_MIABOS_M06_CRM_UXUI_Encoding_Fix.md) | Fixed UXUI M06 files text encoding (Antigravity) |
| 2026-04-16 | [2026-04-16_MIABOS_M06_CRM_Stories_Structure_Update](../../02_Sessions/2026-04-16_MIABOS_M06_CRM_Stories_Structure_Update.md) | Structured and expanded M06 CRM User Stories fields (Antigravity) |
