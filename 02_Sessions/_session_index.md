# Session Index

### 2026-04-16

- [[2026-04-16_Daily_Log|Daily Log]] - All AI interactions for this day.
- [[2026-04-16_MIABOS_Customer_360_UX_And_Story_Pack|MIABOS Customer 360 UX And Story Pack]] - Split Customer 360 into `Customer List`, `Customer 360`, `Duplicate Review`, and `Care Action`; added social-profile relationship modeling plus duplicate / merge / bulk-update logic.
- [[2026-04-16_MIABOS_Customer_360_CRM_POC_Implementation_Ready|MIABOS Customer 360 CRM POC Implementation Ready]] - Elevated `F-M06-CRM-001` from deep analysis to POC / implementation-ready with module architecture, source ownership, sync boundary, APIs, jobs, storage boundary, and rollout phases.
- [[2026-04-16_MIABOS_Pull_Main_Into_Hino_And_Resolve_Customer_360_Merge|MIABOS Pull Main Into Hino And Resolve Customer 360 Merge]] - Committed local Customer 360 work on `Hino`, pulled `origin/main`, resolved merge conflicts, and kept the branch clean for continued analysis.
- [[2026-04-16_MIABOS_Process_Fix_And_Mock_Expansion|MIABOS Process Fix And Mock Data Expansion]] - Fix quy trình: xóa PNG gate per BO directive, promote UXUI Approved. Expand mock 4?8 scenarios. Improve spike: error state, scroll, Unsupported card, a11y, microcopy.
- [[2026-04-16_MIABOS_Internal_AI_Chat_Canonical_Prep_And_Spike|MIABOS Internal AI Chat Canonical Prep And Spike]] - Promote `F-M09-AIC-001` lên `SRS Ready`, materialize planning chain d?y d?, canonicalize UXUI ? tr?ng thái `Blocked`, và thêm local spike preview `/ai/chat` b?ng mock data.
- [[2026-04-16_MIABOS_AI_Workspace_Planning_Chain_F_M09_AIC_001|MIABOS AI Workspace Planning Chain F M09 AIC 001]] - Materialize planning chain cho `F-M09-AIC-001 Internal AI Chat`: PRD, Product Backlog, Sprint Backlog, User Story, và Subtask Board; gi? PRD `In Review`, story `Approved` cho planning, và khóa FE Preview d?n khi UXUI Approved th?t.
- [[2026-04-16_MIABOS_UXUI_F_M09_AIC_001_Review|MIABOS UXUI F-M09-AIC-001 Review]] - Refine `UXUI-F-M09-AIC-001` into a canonical `Blocked` UXUI artifact with required metadata, FE Preview planning link, explicit mockup blocker, and SRS-aligned data binding.
- [[2026-04-16_MIABOS_Obsidian_Local_Gitignore|MIABOS Obsidian Local Gitignore]] - Chuy?n `.obsidian/` thành machine-local state b?ng root `.gitignore` và g? toàn b? `.obsidian` kh?i Git index.
- [[2026-04-16_MIABOS_Alex_Implementation_To_Main_Merge|MIABOS Alex Implementation To Main Merge]] - Merge branch `alex_implementation` vào `main`, import toàn b? l?ch s? implementation/spec/design liên quan, và ph?c h?i local working state sau merge.
- [[2026-04-16_MIABOS_UXUI_Spec_M09_M10|MIABOS UXUI Spec M09 M10]] - T?o 2 UXUI Feature Spec d?u tiên: F-M09-AIC-001 Internal AI Chat và F-M10-SLS-001 Sales Advisor AI. T?o folder `Design/UXUI_Features/`.
- [[2026-04-16_MIABOS_Knowledge_Center_And_AI_Workspace_SRS_Enhancement|MIABOS Knowledge Center And AI Workspace SRS Enhancement]] - Enhance l?i toàn b? 10 SRS c?a `Knowledge_Center` và `AI_Workspace` theo quy trình SRS m?i: thêm `§0B`, neo BQ context/source map, và m? r?ng flow/rule/NFR/AC nhung gi? `Draft` vì blocker nghi?p v? còn m?.
- [[2026-04-16_MIABOS_Remaining_SRS_Enhancement|MIABOS Remaining SRS Enhancement]] - Enhance 9 SRS còn l?i (M01-M07, M11, M12) theo quy trình SRS m?i: thêm §0B, neo BQ context, d? depth gate cho toàn b? SRS pack.
- [[2026-04-16_MIABOS_Insights_And_Performance_SRS_Completion|MIABOS Insights And Performance SRS Completion]] - Materialize `F-M14-BIZ-001 Business Analytics And ROI` d? hoàn thi?n surface `Insights_And_Performance`; workspace MIABOS gi? có d? 20 SRS.
- [[2026-04-16_MIABOS_Order_And_Fulfillment_SRS_Deepening|MIABOS Order And Fulfillment SRS Deepening]] - Deepen `F-M05-ORD-001` into a more implementation-facing SRS with capability slices, order line + CTKM, fulfillment, return / transfer, and after-sales service scope.

### 2026-04-15

- [[2026-04-15_Daily_Log|Daily Log]] - All AI interactions for this day.
- [[2026-04-15_MIABOS_Customer_360_CRM_SRS_Deepening|MIABOS Customer 360 CRM SRS Deepening]] - Deepened `F-M06-CRM-001` into a Customer 360 SRS covering profile, identity mapping, order history, chat history, call history, consent, timeline, and AI-ready CRM context.
- [[2026-04-15_MIABOS_SRS_Process_Enhancement|MIABOS SRS Process Enhancement]] - Enhanced quy trình vi?t SRS: c?p nh?t SKILL.md, template (§0B Integration Source Map), Global Rules 41+42, AGENTS.md d? enforce BQ anchor và content depth gate cho m?i AI model.
- [[2026-04-15_Giay_BQ_Design_System_Setup|Giay BQ Design System Setup]] - Materialize canonical Design System Aura Minimalist cho project Giay_BQ; kh?i t?o project folder và `_project.md`.
- [[2026-04-15_MIABOS_AI_Workspace_SRS_Expansion|MIABOS AI Workspace SRS Expansion]] - Materialize 4 SRS m?i cho `AI_Workspace` và sync control-plane c?a surface AI.
- [[2026-04-15_MIABOS_Planning_Folder_And_Knowledge_Center_PRDs|MIABOS Planning Folder And Knowledge Center PRDs]] - M? l?p `Planning/` cho project và materialize 4 PRD c?a `Knowledge_Center`.
- [[2026-04-15_MIABOS_Knowledge_Center_SRS_Expansion|MIABOS Knowledge Center SRS Expansion]] - Materialize `Knowledge_Center` thành 4 SRS canonical và sync control-plane c?a surface này.
- [[2026-04-15_MIABOS_Module_Surface_Restructuring|MIABOS Module Surface Restructuring]] - Restructure l?i `Modules/` theo các product surfaces c?a Portal CRM và sync l?i control-plane theo `Portal Surface`.
- [[2026-04-15_MIABOS_Portal_CRM_Module_And_Sitemap_Recommendation|MIABOS Portal CRM Module And Sitemap Recommendation]] - Materialize khuy?n ngh? chính th?c v? b? module c?n có và sitemap Portal CRM cho Giày BQ sau vòng ph?n bi?n chéo.
- [[2026-04-15_MIABOS_Analysis_Feature_Modularization|MIABOS Analysis Feature Modularization]] - Tái c?u trúc `Analysis/Features` thành `Integration` + `Modules`, relocate 3 source specs, t?o 17 SRS high-level m?i, và d?ng b? l?i control-plane feature.
- [[2026-04-15_MIABOS_Analysis_Artifact_Routing_Repair|MIABOS Analysis Artifact Routing Repair]] - Di chuy?n hai Feature SRS HAR/KV kh?i `02_Sessions/` sang l?p `Analysis/Features/`, d?ng b? control-plane, và si?t rule/gate d? `02_Sessions/` ch? còn log artifacts.
- [[2026-04-15_MIABOS_Tanh_To_Main_Merge|MIABOS Tanh To Main Merge]] - Hoàn t?t merge branch `tanh` vào `main` b?ng merge commit, không phát sinh conflict, và gi? nguyên local `.obsidian/workspace.json`.

### 2026-04-14

- [[2026-04-14_Daily_Log|Daily Log]] - All AI interactions for this day.
- [[2026-04-14_MIABOS_BQ_Integration_Architecture_and_Data_Boundary|MIABOS BQ Integration Architecture and Data Boundary]] - Produced the overall BQ integration architecture artifact covering the SAP B1-centered system boundary, MIA data boundary, sync model, API ownership, and open discovery questions.
- [[2026-04-14_OS_Vietnamese_Documentation_Rule_Update|OS Vietnamese Documentation Rule Update]] - Updated the workspace language policy so canonical document bodies now default to Vietnamese while file and folder naming stays English-safe.
- [[2026-04-14_Analysis_Folder_Creation|Analysis Folder Creation]] - T?o `05_Analysis/` v?i subfolder `PO/` và `BA/`; thêm Rule 21D, 21E (OS), Rule 39 (KB) d? enforce PO & BA analysis artifact routing.
- [[2026-04-14_MIABOS_Main_Branch_Merge|MIABOS Main Branch Merge]] - Ð?ng b? `main` v?i `hien` b?ng fast-forward merge, không phát sinh conflict, gi? nguyên local `.obsidian/workspace.json`.

### 2026-04-13

- [[2026-04-13_Daily_Log|Daily Log]] - All AI interactions for this day.
- [[2026-04-13_OS_Workspace_History_Reset|OS Workspace History Reset]] - Cleared inherited `02_Sessions` history and removed non-BQ customer-specific raw artifacts from the copied workspace, then rebuilt the mandatory control-plane files.
- [[2026-04-13_MIABOS_Project_Document_Reset|MIABOS Project Document Reset]] - Removed MIABOS business and project documentation while preserving the design system and retained implementation workspace.
- [[2026-04-13_MIABOS_Project_Metadata_Reset|MIABOS Project Metadata Reset]] - Reframed the retained MIABOS workspace around Giay BQ, Retail, and the Marketing/Sales/Customer Service AI operating scope.
- [[2026-04-13_MIABOS_Giay_BQ_Requirement_Source_Linkage|MIABOS Giay BQ Requirement Source Linkage]] - Linked the Giay BQ customer pack into the agent control plane as the active requirement source for the current MIABOS workspace.
- [[2026-04-13_MIABOS_BQ_SAP_Research_Consolidation|MIABOS BQ SAP Research Consolidation]] - Consolidated the SAP Business One research for Giay BQ into a single reusable research pack and linked it from the BQ customer-pack index.




- [[2026-04-16_MIABOS_CRM_UXUI_Detailing|MIABOS CRM UXUI Detailing]] - Expanded the four CRM UXUI specs with required on-screen information, search/filter/sort logic, detailed actions, and UX behavior.
- [2026-04-16_MIABOS_Customer_List_Encoding_Fix](2026-04-16_MIABOS_Customer_List_Encoding_Fix.md) - UXUI formatting fix (Antigravity) - PB-03
- [2026-04-16_MIABOS_M06_CRM_UXUI_Encoding_Fix](2026-04-16_MIABOS_M06_CRM_UXUI_Encoding_Fix.md) - UXUI formatting fix M06 (Antigravity) - PB-03
- [2026-04-16_MIABOS_M06_CRM_Stories_Structure_Update](2026-04-16_MIABOS_M06_CRM_Stories_Structure_Update.md) - CRM Stories struct expansion (Antigravity) - PB-03
