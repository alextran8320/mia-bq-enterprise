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
| 2026-04-17 | [2026-04-17_MIABOS_Escalation_UXUI_Spec_Draft](../../02_Sessions/2026-04-17_MIABOS_Escalation_UXUI_Spec_Draft.md) | Tạo draft UXUI spec cho `F-M11-ESC-001` tại `Design/UXUI_Features`: route composer dạng Drawer, screen inventory S1-S5, interaction pattern và đầy đủ 5 behavioral sections bắt buộc. Giá trị Status là Draft. |
| 2026-04-17 | [2026-04-17_MIABOS_Escalation_And_Workflow_SRS_Refinement](../../02_Sessions/2026-04-17_MIABOS_Escalation_And_Workflow_SRS_Refinement.md) | Refine sâu F-M11-ESC-001: neo BQ Context với SAP/KiotViet, phân định Lark là External Destination, thiết lập Fallback Queue nội bộ tại MIABOS DB, và chốt AC, Error codes. |
| 2026-04-16 | [2026-04-16_MIABOS_Access_Control_And_Sensitivity_UXUI_Spec_Draft](../../02_Sessions/2026-04-16_MIABOS_Access_Control_And_Sensitivity_UXUI_Spec_Draft.md) | Tạo draft UXUI spec cho `F-M07-SEC-001` tại `Design/UXUI_Features`: route `/governance/phan-quyen-du-lieu`, screen inventory cho governance UI, simulator outcome `allow/mask/summary_only/deny/escalation_only`, và giữ `Draft` vì linked SRS chưa `SRS Ready`. |
| 2026-04-16 | [2026-04-16_MIABOS_Inventory_Availability_Phase1_Rule_Closure](../../02_Sessions/2026-04-16_MIABOS_Inventory_Availability_Phase1_Rule_Closure.md) | Chot tam bo rule phase 1 cho `F-M02-INV-001`: quantity_hint, freshness SLA theo nguon, conflict threshold, va dong bo cac rule nay sang validation/AC/test/checklist. |
| 2026-04-16 | [2026-04-16_MIABOS_Inventory_Availability_SRS_Rewrite](../../02_Sessions/2026-04-16_MIABOS_Inventory_Availability_SRS_Rewrite.md) | Rewrite sach file `F-M02-INV-001_Inventory_Availability_SRS.md` trong module `Inventory_Availability`, loai bo loi encoding va lam ro lai toan bo semantics, flow, rules, va contract. |
| 2026-04-16 | [2026-04-16_MIABOS_Inventory_Availability_Module_UXUI_Alignment](../../02_Sessions/2026-04-16_MIABOS_Inventory_Availability_Module_UXUI_Alignment.md) | Dua UXUI artifact cua F-M02-INV-001 ve dung folder module Inventory_Availability/UXUI, cap nhat SRS canonical de tro sang artifact moi, va giu file cu tai Design/UXUI_Features duoi dang redirect mem. |
| 2026-04-16 | [2026-04-16_MIABOS_Access_Control_And_Sensitivity_SRS_Refinement](../../02_Sessions/2026-04-16_MIABOS_Access_Control_And_Sensitivity_SRS_Refinement.md) | Refine sâu F-M07-SEC-001: neo BQ context, mở rộng role/scope/sensitivity model, materialize runtime decision gate, API/data/audit contract, và giữ Draft vì blocker nghiệp vụ còn mở. |
| 2026-04-16 | [2026-04-16_MIABOS_Inventory_Availability_UXUI_Spec_Draft](../../02_Sessions/2026-04-16_MIABOS_Inventory_Availability_UXUI_Spec_Draft.md) | Materialize draft UXUI spec cho `F-M02-INV-001`: route `/catalog/inventory-availability`, define 6 screen/state slices, viet du 5 section bat buoc, va giu status `Draft` do linked SRS chua `SRS Ready`. |
| 2026-04-16 | [2026-04-16_MIABOS_Inventory_Availability_SRS_Refinement](../../02_Sessions/2026-04-16_MIABOS_Inventory_Availability_SRS_Refinement.md) | Refine sau `F-M02-INV-001 Inventory Availability`: them availability glossary, mo rong flow inventory theo variant/scope/mode, materialize realtime-cache decision matrix, va lam day API/data/validation/AC/test contract; giu status `Draft` vi blocker nghiep vu con mo. |
| 2026-04-16 | [2026-04-16_MIABOS_Process_Fix_And_Mock_Expansion](../../02_Sessions/2026-04-16_MIABOS_Process_Fix_And_Mock_Expansion.md) | Fix quy trÃ¬nh: PNG gate removed per BO directive, UXUI â†’ Approved, F-M09-AIC-001 â†’ UXUI Approved. Expand mock 4â†’8 scenarios. Improve spike: error state, scroll, Unsupported card, a11y, microcopy. |
| 2026-04-16 | [2026-04-16_MIABOS_Internal_AI_Chat_Canonical_Prep_And_Spike](../../02_Sessions/2026-04-16_MIABOS_Internal_AI_Chat_Canonical_Prep_And_Spike.md) | Promote `F-M09-AIC-001` lÃªn `SRS Ready`, materialize planning chain Ä‘áº§y Ä‘á»§ cho `Internal AI Chat`, giá»¯ UXUI á»Ÿ tráº¡ng thÃ¡i `Blocked` vÃ¬ thiáº¿u mockup sign-off, vÃ  thÃªm local spike preview `/ai/chat` báº±ng mock data trong app React hiá»‡n cÃ³. |
| 2026-04-16 | [2026-04-16_MIABOS_AI_Workspace_Planning_Chain_F_M09_AIC_001](../../02_Sessions/2026-04-16_MIABOS_AI_Workspace_Planning_Chain_F_M09_AIC_001.md) | Materialize planning chain cho `F-M09-AIC-001 Internal AI Chat`: táº¡o PRD `AI_Workspace`, Product Backlog, Sprint Backlog, User Story, vÃ  Subtask Board; giá»¯ PRD `In Review`, story `Approved` cho planning, vÃ  khÃ³a FE Preview cho tá»›i khi UXUI Ä‘Æ°á»£c Approved tháº­t. |
| 2026-04-16 | [2026-04-16_MIABOS_UXUI_F_M09_AIC_001_Review](../../02_Sessions/2026-04-16_MIABOS_UXUI_F_M09_AIC_001_Review.md) | Refined `UXUI-F-M09-AIC-001_Internal_AI_Chat.md` into a canonical `Blocked` UXUI artifact with required metadata, intended FE Preview story path, explicit mockup blockers, and SRS-aligned data-binding / token assumptions. |
| 2026-04-16 | [2026-04-16_MIABOS_Obsidian_Local_Gitignore](../../02_Sessions/2026-04-16_MIABOS_Obsidian_Local_Gitignore.md) | Táº¡o root `.gitignore` vá»›i rule `.obsidian/` vÃ  gá»¡ toÃ n bá»™ `.obsidian` khá»i Git index Ä‘á»ƒ má»—i mÃ¡y giá»¯ Obsidian workspace/config riÃªng mÃ  khÃ´ng bá»‹ Git báº¯t buá»™c track. |
| 2026-04-16 | [2026-04-16_MIABOS_Alex_Implementation_To_Main_Merge](../../02_Sessions/2026-04-16_MIABOS_Alex_Implementation_To_Main_Merge.md) | Merge branch `alex_implementation` vÃ o `main` báº±ng merge commit `f1fab3d`, Ä‘Æ°a toÃ n bá»™ khá»‘i implementation/spec/design/session artifacts sang nhÃ¡nh chÃ­nh, vÃ  giá»¯ láº¡i local working state cá»§a Business Owner dÆ°á»›i dáº¡ng unstaged change sau merge. |
| 2026-04-16 | [2026-04-16_MIABOS_Knowledge_Center_And_AI_Workspace_SRS_Enhancement](../../02_Sessions/2026-04-16_MIABOS_Knowledge_Center_And_AI_Workspace_SRS_Enhancement.md) | Enhance láº¡i toÃ n bá»™ 10 SRS cá»§a `Knowledge_Center` vÃ  `AI_Workspace` theo quy trÃ¬nh SRS má»›i: thÃªm `Â§0B Integration Source Map`, neo BQ context/source map, má»Ÿ rá»™ng flows/rules/NFR/AC, vÃ  giá»¯ táº¥t cáº£ á»Ÿ `Draft` vÃ¬ blocker nghiá»‡p vá»¥ váº«n cÃ²n má»Ÿ. |
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
| 2026-04-14 | [2026-04-14_MIABOS_Main_Branch_Merge](../../02_Sessions/2026-04-14_MIABOS_Main_Branch_Merge.md) | Äá»“ng bá»™ branch `main` vá»›i `hien` báº±ng fast-forward merge Ä‘á»ƒ Ä‘Æ°a toÃ n bá»™ artifact SAP/BQ má»›i nháº¥t sang nhÃ¡nh chÃ­nh mÃ  khÃ´ng phÃ¡t sinh conflict. |
| 2026-04-15 | [2026-04-15_MIABOS_Tanh_To_Main_Merge](../../02_Sessions/2026-04-15_MIABOS_Tanh_To_Main_Merge.md) | Äá»“ng bá»™ branch `main` vá»›i `tanh` báº±ng merge commit Ä‘á»ƒ Ä‘Æ°a hai artifact SRS HAR vÃ  KV sang nhÃ¡nh chÃ­nh mÃ  khÃ´ng lÃ m máº¥t local `.obsidian/workspace.json`. |
| 2026-04-15 | [2026-04-15_MIABOS_Analysis_Artifact_Routing_Repair](../../02_Sessions/2026-04-15_MIABOS_Analysis_Artifact_Routing_Repair.md) | Sá»­a misrouting sau merge báº±ng cÃ¡ch chuyá»ƒn hai Feature SRS HAR/KV tá»« `02_Sessions/` vá» `Analysis/Features/` á»Ÿ lá»›p analysis canonical, cáº­p nháº­t feature control-plane, vÃ  harden quy trÃ¬nh Ä‘á»ƒ `02_Sessions/` chá»‰ cÃ²n log artifacts. |
| 2026-04-15 | [2026-04-15_MIABOS_Analysis_Feature_Modularization](../../02_Sessions/2026-04-15_MIABOS_Analysis_Feature_Modularization.md) | TÃ¡i cáº¥u trÃºc `Analysis/Features` thÃ nh 2 lá»›p `Integration` + `Modules`, relocate 3 source specs vÃ o `Integration/Source_Specs/`, materialize 5 integration SRS vÃ  12 business-module SRS, vÃ  Ä‘á»“ng bá»™ láº¡i feature control-plane. |
| 2026-04-15 | [2026-04-15_MIABOS_Portal_CRM_Module_And_Sitemap_Recommendation](../../02_Sessions/2026-04-15_MIABOS_Portal_CRM_Module_And_Sitemap_Recommendation.md) | Materialize khuyáº¿n nghá»‹ chÃ­nh thá»©c vá» final module set vÃ  sitemap Portal CRM cho GiÃ y BQ, chá»‘t cÃ¡c module cáº§n giá»¯, cÃ¡c module cáº§n bá»• sung (`I06`, `M13`, `M14`), vÃ  packaging product surfaces cho portal. |
| 2026-04-15 | [2026-04-15_MIABOS_Module_Surface_Restructuring](../../02_Sessions/2026-04-15_MIABOS_Module_Surface_Restructuring.md) | Restructure láº¡i canonical tree cá»§a `Modules/` theo cÃ¡c product surfaces cá»§a Portal CRM, move 12 business modules sang nhÃ³m surface má»›i, vÃ  Ä‘á»“ng bá»™ láº¡i `Feature Registry` / `Traceability Matrix` vá»›i cá»™t `Portal Surface`. |
| 2026-04-15 | [2026-04-15_MIABOS_Knowledge_Center_SRS_Expansion](../../02_Sessions/2026-04-15_MIABOS_Knowledge_Center_SRS_Expansion.md) | Materialize `Knowledge_Center` thÃ nh 4 SRS canonical riÃªng cho knowledge core, publishing queue, FAQ/policy library, vÃ  source governance; Ä‘á»“ng bá»™ láº¡i control-plane analysis cho surface nÃ y. |
| 2026-04-15 | [2026-04-15_MIABOS_Planning_Folder_And_Knowledge_Center_PRDs](../../02_Sessions/2026-04-15_MIABOS_Planning_Folder_And_Knowledge_Center_PRDs.md) | Má»Ÿ lá»›p `Planning/` cho project vÃ  materialize 4 PRD canonical cá»§a `Knowledge_Center`, Ä‘á»“ng thá»i ná»‘i traceability tá»« PRD sang SRS. |
| 2026-04-15 | [2026-04-15_MIABOS_AI_Workspace_SRS_Expansion](../../02_Sessions/2026-04-15_MIABOS_AI_Workspace_SRS_Expansion.md) | Materialize `AI_Workspace` thÃ nh 6 capability slices báº±ng cÃ¡ch thÃªm 4 SRS má»›i cho answer history, escalation handoff, suggested actions, vÃ  CTA/lead handoff; Ä‘á»“ng bá»™ láº¡i control-plane analysis cho surface AI. |




