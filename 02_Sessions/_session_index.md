# Session Index

### 2026-04-16

- [[2026-04-16_Daily_Log|Daily Log]] - All AI interactions for this day.
- [[2026-04-16_MIABOS_SRS_Promote_And_UXUI_Spec_Full_Pack|MIABOS SRS Promote And UXUI Spec Full Pack]] - Promote 9 SRS Draft → SRS Ready cho AI_Workspace/Insights_And_Performance/Knowledge_Center; tạo 8 UXUI Feature Specs mới; UXUI index đầy đủ 12 specs.
- [[2026-04-16_MIABOS_M14_Dashboard_FE_Preview_Build|MIABOS M14 Dashboard FE Preview Build]] - Built mock-only Dashboard FE Preview routes, verified build and HTTP 200 routes, updated M14 STB/backlog to Ready for Review, and kept BE blocked.
- [[2026-04-16_MIABOS_Internal_AI_Chat_Review_Round1_Fix|MIABOS Internal AI Chat Review Round1 Fix]] - Vá feedback review vòng 1 cho `/ai/chat` (bỏ copy mock, mở click interaction, thêm lịch sử hỏi đáp), chạy lại build/runtime evidence và đưa STB về trạng thái re-review.
- [[2026-04-16_MIABOS_M09_M14_Readiness_Sync|MIABOS M09 M14 Readiness Sync]] - Promoted M09/M14 to SRS Ready, approved UXUI for mock FE Preview, created missing PRD/story/STB/backlog chain, and kept production integration blocked.
- [[2026-04-16_OS_Screenshot_Bypass_Process_Update|OS Screenshot Bypass Process Update]] - Cập nhật quy trình để bỏ bước screenshot bắt buộc; thay bằng Verified Demo/runtime evidence, screenshot chỉ optional khi được yêu cầu.
- [[2026-04-16_MIABOS_Sales_Advisor_AI_FE_Preview_Readiness|MIABOS Sales Advisor AI FE Preview Readiness]] - Sửa ghost session log và ghi lại readiness chain cho `F-M10-SLS-001 Sales Advisor AI` FE Preview.
- [[2026-04-16_MIABOS_Internal_AI_Chat_FE_Preview_Fix|MIABOS Internal AI Chat FE Preview Fix]] - Sửa lỗi build FE preview cho màn `/ai/chat`, chạy kiểm chứng build/dev server, và ghi nhận trạng thái review của Internal AI Chat.
- [[2026-04-16_MIABOS_Obsidian_Local_Gitignore|MIABOS Obsidian Local Gitignore]] - Chuyển `.obsidian/` thành machine-local state bằng root `.gitignore` và gỡ toàn bộ `.obsidian` khỏi Git index.
- [[2026-04-16_MIABOS_Alex_Implementation_To_Main_Merge|MIABOS Alex Implementation To Main Merge]] - Merge branch `alex_implementation` vào `main`, import toàn bộ lịch sử implementation/spec/design liên quan, và phục hồi local working state sau merge.
- [[2026-04-16_MIABOS_UXUI_Spec_M09_M10|MIABOS UXUI Spec M09 M10]] - Tạo 2 UXUI Feature Spec đầu tiên: F-M09-AIC-001 Internal AI Chat và F-M10-SLS-001 Sales Advisor AI. Tạo folder `Design/UXUI_Features/`.
- [[2026-04-16_MIABOS_Knowledge_Center_And_AI_Workspace_SRS_Enhancement|MIABOS Knowledge Center And AI Workspace SRS Enhancement]] - Enhance lại toàn bộ 10 SRS của `Knowledge_Center` và `AI_Workspace` theo quy trình SRS mới: thêm `§0B`, neo BQ context/source map, và mở rộng flow/rule/NFR/AC nhưng giữ `Draft` vì blocker nghiệp vụ còn mở.
- [[2026-04-16_MIABOS_Remaining_SRS_Enhancement|MIABOS Remaining SRS Enhancement]] - Enhance 9 SRS còn lại (M01-M07, M11, M12) theo quy trình SRS mới: thêm §0B, neo BQ context, đủ depth gate cho toàn bộ SRS pack.
- [[2026-04-16_MIABOS_Insights_And_Performance_SRS_Completion|MIABOS Insights And Performance SRS Completion]] - Materialize `F-M14-BIZ-001 Business Analytics And ROI` để hoàn thiện surface `Insights_And_Performance`; workspace MIABOS giờ có đủ 20 SRS.

### 2026-04-15

- [[2026-04-15_Daily_Log|Daily Log]] - All AI interactions for this day.
- [[2026-04-15_MIABOS_Customer_360_CRM_SRS_Deepening|MIABOS Customer 360 CRM SRS Deepening]] - Deepened `F-M06-CRM-001` into a Customer 360 SRS covering profile, identity mapping, order history, chat history, call history, consent, timeline, and AI-ready CRM context.
- [[2026-04-15_MIABOS_SRS_Process_Enhancement|MIABOS SRS Process Enhancement]] - Enhanced quy tr�nh vi?t SRS: c?p nh?t SKILL.md, template (�0B Integration Source Map), Global Rules 41+42, AGENTS.md d? enforce BQ anchor v� content depth gate cho m?i AI model.
- [[2026-04-15_Giay_BQ_Design_System_Setup|Giay BQ Design System Setup]] - Materialize canonical Design System Aura Minimalist cho project Giay_BQ; kh?i t?o project folder v� `_project.md`.
- [[2026-04-15_MIABOS_AI_Workspace_SRS_Expansion|MIABOS AI Workspace SRS Expansion]] - Materialize 4 SRS m?i cho `AI_Workspace` v� sync control-plane c?a surface AI.
- [[2026-04-15_MIABOS_Planning_Folder_And_Knowledge_Center_PRDs|MIABOS Planning Folder And Knowledge Center PRDs]] - M? l?p `Planning/` cho project v� materialize 4 PRD c?a `Knowledge_Center`.
- [[2026-04-15_MIABOS_Knowledge_Center_SRS_Expansion|MIABOS Knowledge Center SRS Expansion]] - Materialize `Knowledge_Center` th�nh 4 SRS canonical v� sync control-plane c?a surface n�y.
- [[2026-04-15_MIABOS_Module_Surface_Restructuring|MIABOS Module Surface Restructuring]] - Restructure l?i `Modules/` theo c�c product surfaces c?a Portal CRM v� sync l?i control-plane theo `Portal Surface`.
- [[2026-04-15_MIABOS_Portal_CRM_Module_And_Sitemap_Recommendation|MIABOS Portal CRM Module And Sitemap Recommendation]] - Materialize khuy?n ngh? ch�nh th?c v? b? module c?n c� v� sitemap Portal CRM cho Gi�y BQ sau v�ng ph?n bi?n ch�o.
- [[2026-04-15_MIABOS_Analysis_Feature_Modularization|MIABOS Analysis Feature Modularization]] - T�i c?u tr�c `Analysis/Features` th�nh `Integration` + `Modules`, relocate 3 source specs, t?o 17 SRS high-level m?i, v� d?ng b? l?i control-plane feature.
- [[2026-04-15_MIABOS_Analysis_Artifact_Routing_Repair|MIABOS Analysis Artifact Routing Repair]] - Di chuy?n hai Feature SRS HAR/KV kh?i `02_Sessions/` sang l?p `Analysis/Features/`, d?ng b? control-plane, v� si?t rule/gate d? `02_Sessions/` ch? c�n log artifacts.
- [[2026-04-15_MIABOS_Tanh_To_Main_Merge|MIABOS Tanh To Main Merge]] - Ho�n t?t merge branch `tanh` v�o `main` b?ng merge commit, kh�ng ph�t sinh conflict, v� gi? nguy�n local `.obsidian/workspace.json`.

### 2026-04-14

- [[2026-04-14_Daily_Log|Daily Log]] - All AI interactions for this day.
- [[2026-04-14_MIABOS_BQ_Integration_Architecture_and_Data_Boundary|MIABOS BQ Integration Architecture and Data Boundary]] - Produced the overall BQ integration architecture artifact covering the SAP B1-centered system boundary, MIA data boundary, sync model, API ownership, and open discovery questions.
- [[2026-04-14_OS_Vietnamese_Documentation_Rule_Update|OS Vietnamese Documentation Rule Update]] - Updated the workspace language policy so canonical document bodies now default to Vietnamese while file and folder naming stays English-safe.
- [[2026-04-14_Analysis_Folder_Creation|Analysis Folder Creation]] - T?o `05_Analysis/` v?i subfolder `PO/` v� `BA/`; th�m Rule 21D, 21E (OS), Rule 39 (KB) d? enforce PO & BA analysis artifact routing.
- [[2026-04-14_MIABOS_Main_Branch_Merge|MIABOS Main Branch Merge]] - �?ng b? `main` v?i `hien` b?ng fast-forward merge, kh�ng ph�t sinh conflict, gi? nguy�n local `.obsidian/workspace.json`.

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
- [2026-04-17_MIABOS_BQ_Proposal_Full_Content](2026-04-17_MIABOS_BQ_Proposal_Full_Content.md) � BQ Proposal full content (Antigravity) - PB-03
