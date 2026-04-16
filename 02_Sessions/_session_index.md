# Session Index

### 2026-04-16

- [[2026-04-16_Daily_Log|Daily Log]] - All AI interactions for this day.
- [[2026-04-16_MIABOS_UXUI_Spec_M09_M10|MIABOS UXUI Spec M09 M10]] - Tạo 2 UXUI Feature Spec đầu tiên: F-M09-AIC-001 Internal AI Chat và F-M10-SLS-001 Sales Advisor AI. Tạo folder `Design/UXUI_Features/`.
- [[2026-04-16_MIABOS_Knowledge_Center_And_AI_Workspace_SRS_Enhancement|MIABOS Knowledge Center And AI Workspace SRS Enhancement]] - Enhance lại toàn bộ 10 SRS của `Knowledge_Center` và `AI_Workspace` theo quy trình SRS mới: thêm `§0B`, neo BQ context/source map, và mở rộng flow/rule/NFR/AC nhưng giữ `Draft` vì blocker nghiệp vụ còn mở.
- [[2026-04-16_MIABOS_Remaining_SRS_Enhancement|MIABOS Remaining SRS Enhancement]] - Enhance 9 SRS còn lại (M01-M07, M11, M12) theo quy trình SRS mới: thêm §0B, neo BQ context, đủ depth gate cho toàn bộ SRS pack.
- [[2026-04-16_MIABOS_Insights_And_Performance_SRS_Completion|MIABOS Insights And Performance SRS Completion]] - Materialize `F-M14-BIZ-001 Business Analytics And ROI` để hoàn thiện surface `Insights_And_Performance`; workspace MIABOS giờ có đủ 20 SRS.

### 2026-04-15

- [[2026-04-15_Daily_Log|Daily Log]] - All AI interactions for this day.
- [[2026-04-15_MIABOS_SRS_Process_Enhancement|MIABOS SRS Process Enhancement]] - Enhanced quy trình viết SRS: cập nhật SKILL.md, template (§0B Integration Source Map), Global Rules 41+42, AGENTS.md để enforce BQ anchor và content depth gate cho mọi AI model.
- [[2026-04-15_Giay_BQ_Design_System_Setup|Giay BQ Design System Setup]] - Materialize canonical Design System Aura Minimalist cho project Giay_BQ; khởi tạo project folder và `_project.md`.
- [[2026-04-15_MIABOS_AI_Workspace_SRS_Expansion|MIABOS AI Workspace SRS Expansion]] - Materialize 4 SRS mới cho `AI_Workspace` và sync control-plane của surface AI.
- [[2026-04-15_MIABOS_Planning_Folder_And_Knowledge_Center_PRDs|MIABOS Planning Folder And Knowledge Center PRDs]] - Mở lớp `Planning/` cho project và materialize 4 PRD của `Knowledge_Center`.
- [[2026-04-15_MIABOS_Knowledge_Center_SRS_Expansion|MIABOS Knowledge Center SRS Expansion]] - Materialize `Knowledge_Center` thành 4 SRS canonical và sync control-plane của surface này.
- [[2026-04-15_MIABOS_Module_Surface_Restructuring|MIABOS Module Surface Restructuring]] - Restructure lại `Modules/` theo các product surfaces của Portal CRM và sync lại control-plane theo `Portal Surface`.
- [[2026-04-15_MIABOS_Portal_CRM_Module_And_Sitemap_Recommendation|MIABOS Portal CRM Module And Sitemap Recommendation]] - Materialize khuyến nghị chính thức về bộ module cần có và sitemap Portal CRM cho Giày BQ sau vòng phản biện chéo.
- [[2026-04-15_MIABOS_Analysis_Feature_Modularization|MIABOS Analysis Feature Modularization]] - Tái cấu trúc `Analysis/Features` thành `Integration` + `Modules`, relocate 3 source specs, tạo 17 SRS high-level mới, và đồng bộ lại control-plane feature.
- [[2026-04-15_MIABOS_Analysis_Artifact_Routing_Repair|MIABOS Analysis Artifact Routing Repair]] - Di chuyển hai Feature SRS HAR/KV khỏi `02_Sessions/` sang lớp `Analysis/Features/`, đồng bộ control-plane, và siết rule/gate để `02_Sessions/` chỉ còn log artifacts.
- [[2026-04-15_MIABOS_Tanh_To_Main_Merge|MIABOS Tanh To Main Merge]] - Hoàn tất merge branch `tanh` vào `main` bằng merge commit, không phát sinh conflict, và giữ nguyên local `.obsidian/workspace.json`.

### 2026-04-14

- [[2026-04-14_Daily_Log|Daily Log]] - All AI interactions for this day.
- [[2026-04-14_MIABOS_BQ_Integration_Architecture_and_Data_Boundary|MIABOS BQ Integration Architecture and Data Boundary]] - Produced the overall BQ integration architecture artifact covering the SAP B1-centered system boundary, MIA data boundary, sync model, API ownership, and open discovery questions.
- [[2026-04-14_OS_Vietnamese_Documentation_Rule_Update|OS Vietnamese Documentation Rule Update]] - Updated the workspace language policy so canonical document bodies now default to Vietnamese while file and folder naming stays English-safe.
- [[2026-04-14_Analysis_Folder_Creation|Analysis Folder Creation]] - Tạo `05_Analysis/` với subfolder `PO/` và `BA/`; thêm Rule 21D, 21E (OS), Rule 39 (KB) để enforce PO & BA analysis artifact routing.
- [[2026-04-14_MIABOS_Main_Branch_Merge|MIABOS Main Branch Merge]] - Đồng bộ `main` với `hien` bằng fast-forward merge, không phát sinh conflict, giữ nguyên local `.obsidian/workspace.json`.

### 2026-04-13

- [[2026-04-13_Daily_Log|Daily Log]] - All AI interactions for this day.
- [[2026-04-13_OS_Workspace_History_Reset|OS Workspace History Reset]] - Cleared inherited `02_Sessions` history and removed non-BQ customer-specific raw artifacts from the copied workspace, then rebuilt the mandatory control-plane files.
- [[2026-04-13_MIABOS_Project_Document_Reset|MIABOS Project Document Reset]] - Removed MIABOS business and project documentation while preserving the design system and retained implementation workspace.
- [[2026-04-13_MIABOS_Project_Metadata_Reset|MIABOS Project Metadata Reset]] - Reframed the retained MIABOS workspace around Giay BQ, Retail, and the Marketing/Sales/Customer Service AI operating scope.
- [[2026-04-13_MIABOS_Giay_BQ_Requirement_Source_Linkage|MIABOS Giay BQ Requirement Source Linkage]] - Linked the Giay BQ customer pack into the agent control plane as the active requirement source for the current MIABOS workspace.
- [[2026-04-13_MIABOS_BQ_SAP_Research_Consolidation|MIABOS BQ SAP Research Consolidation]] - Consolidated the SAP Business One research for Giay BQ into a single reusable research pack and linked it from the BQ customer-pack index.
