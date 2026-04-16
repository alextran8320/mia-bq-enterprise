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
| 2026-04-16 | [2026-04-16_MIABOS_M14_Dashboard_FE_Preview_Build](../../02_Sessions/2026-04-16_MIABOS_M14_Dashboard_FE_Preview_Build.md) | Build mock-only Dashboard FE Preview cho `F-M14-BIZ-001`: thêm analytics routes, mock data, sidebar nav, responsive layout, verify build/HTTP 200, cập nhật STB/backlog sang `Ready for Review`, và giữ BE/integration blocked theo chỉ đạo Business Owner. |
| 2026-04-16 | [2026-04-16_MIABOS_Internal_AI_Chat_Review_Round1_Fix](../../02_Sessions/2026-04-16_MIABOS_Internal_AI_Chat_Review_Round1_Fix.md) | Vá feedback review vòng 1 cho Internal AI Chat FE Preview: bỏ copy `mock/đang xây dựng`, mở click interaction ở các khu vực pending, thêm panel lịch sử hỏi đáp nội bộ, và xác minh lại build/runtime evidence trước khi xin re-review. |
| 2026-04-16 | [2026-04-16_MIABOS_M09_M14_Readiness_Sync](../../02_Sessions/2026-04-16_MIABOS_M09_M14_Readiness_Sync.md) | Promote `F-M09-AIC-001` và `F-M14-BIZ-001` lên `SRS Ready`, approve UXUI cho mock FE Preview, materialize PRD/story/STB còn thiếu, và đồng bộ backlog/sprint/control-plane cho M09/M10/M14 preview pack. |
| 2026-04-16 | [2026-04-16_OS_Screenshot_Bypass_Process_Update](../../02_Sessions/2026-04-16_OS_Screenshot_Bypass_Process_Update.md) | Cập nhật quy trình FE/build review để bỏ screenshot bắt buộc; thay bằng Verified Demo/runtime evidence và sync các active STB M09/M10. |
| 2026-04-16 | [2026-04-16_MIABOS_Sales_Advisor_AI_FE_Preview_Readiness](../../02_Sessions/2026-04-16_MIABOS_Sales_Advisor_AI_FE_Preview_Readiness.md) | Sửa ghost session log và ghi lại readiness chain cho `F-M10-SLS-001 Sales Advisor AI`: SRS Ready, UXUI Approved for FE Preview, PRD/story/backlog/STB được materialize cho mock preview; discovered implementation draft được ghi nhận là unverified. |
| 2026-04-16 | [2026-04-16_MIABOS_Internal_AI_Chat_FE_Preview_Fix](../../02_Sessions/2026-04-16_MIABOS_Internal_AI_Chat_FE_Preview_Fix.md) | Ghi nhận work block sửa FE preview `/ai/chat`: build/runtime verification, route review, và trạng thái mock-only preview cho Internal AI Chat. |
| 2026-04-16 | [2026-04-16_MIABOS_Obsidian_Local_Gitignore](../../02_Sessions/2026-04-16_MIABOS_Obsidian_Local_Gitignore.md) | Tạo root `.gitignore` với rule `.obsidian/` và gỡ toàn bộ `.obsidian` khỏi Git index để mỗi máy giữ Obsidian workspace/config riêng mà không bị Git bắt buộc track. |
| 2026-04-16 | [2026-04-16_MIABOS_Alex_Implementation_To_Main_Merge](../../02_Sessions/2026-04-16_MIABOS_Alex_Implementation_To_Main_Merge.md) | Merge branch `alex_implementation` vào `main` bằng merge commit `f1fab3d`, đưa toàn bộ khối implementation/spec/design/session artifacts sang nhánh chính, và giữ lại local working state của Business Owner dưới dạng unstaged change sau merge. |
| 2026-04-16 | [2026-04-16_MIABOS_Knowledge_Center_And_AI_Workspace_SRS_Enhancement](../../02_Sessions/2026-04-16_MIABOS_Knowledge_Center_And_AI_Workspace_SRS_Enhancement.md) | Enhance lại toàn bộ 10 SRS của `Knowledge_Center` và `AI_Workspace` theo quy trình SRS mới: thêm `§0B Integration Source Map`, neo BQ context/source map, mở rộng flows/rules/NFR/AC, và giữ tất cả ở `Draft` vì blocker nghiệp vụ vẫn còn mở. |
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
| 2026-04-14 | [2026-04-14_MIABOS_Main_Branch_Merge](../../02_Sessions/2026-04-14_MIABOS_Main_Branch_Merge.md) | Đồng bộ branch `main` với `hien` bằng fast-forward merge để đưa toàn bộ artifact SAP/BQ mới nhất sang nhánh chính mà không phát sinh conflict. |
| 2026-04-15 | [2026-04-15_MIABOS_Tanh_To_Main_Merge](../../02_Sessions/2026-04-15_MIABOS_Tanh_To_Main_Merge.md) | Đồng bộ branch `main` với `tanh` bằng merge commit để đưa hai artifact SRS HAR và KV sang nhánh chính mà không làm mất local `.obsidian/workspace.json`. |
| 2026-04-15 | [2026-04-15_MIABOS_Analysis_Artifact_Routing_Repair](../../02_Sessions/2026-04-15_MIABOS_Analysis_Artifact_Routing_Repair.md) | Sửa misrouting sau merge bằng cách chuyển hai Feature SRS HAR/KV từ `02_Sessions/` về `Analysis/Features/` ở lớp analysis canonical, cập nhật feature control-plane, và harden quy trình để `02_Sessions/` chỉ còn log artifacts. |
| 2026-04-15 | [2026-04-15_MIABOS_Analysis_Feature_Modularization](../../02_Sessions/2026-04-15_MIABOS_Analysis_Feature_Modularization.md) | Tái cấu trúc `Analysis/Features` thành 2 lớp `Integration` + `Modules`, relocate 3 source specs vào `Integration/Source_Specs/`, materialize 5 integration SRS và 12 business-module SRS, và đồng bộ lại feature control-plane. |
| 2026-04-15 | [2026-04-15_MIABOS_Portal_CRM_Module_And_Sitemap_Recommendation](../../02_Sessions/2026-04-15_MIABOS_Portal_CRM_Module_And_Sitemap_Recommendation.md) | Materialize khuyến nghị chính thức về final module set và sitemap Portal CRM cho Giày BQ, chốt các module cần giữ, các module cần bổ sung (`I06`, `M13`, `M14`), và packaging product surfaces cho portal. |
| 2026-04-15 | [2026-04-15_MIABOS_Module_Surface_Restructuring](../../02_Sessions/2026-04-15_MIABOS_Module_Surface_Restructuring.md) | Restructure lại canonical tree của `Modules/` theo các product surfaces của Portal CRM, move 12 business modules sang nhóm surface mới, và đồng bộ lại `Feature Registry` / `Traceability Matrix` với cột `Portal Surface`. |
| 2026-04-15 | [2026-04-15_MIABOS_Knowledge_Center_SRS_Expansion](../../02_Sessions/2026-04-15_MIABOS_Knowledge_Center_SRS_Expansion.md) | Materialize `Knowledge_Center` thành 4 SRS canonical riêng cho knowledge core, publishing queue, FAQ/policy library, và source governance; đồng bộ lại control-plane analysis cho surface này. |
| 2026-04-15 | [2026-04-15_MIABOS_Planning_Folder_And_Knowledge_Center_PRDs](../../02_Sessions/2026-04-15_MIABOS_Planning_Folder_And_Knowledge_Center_PRDs.md) | Mở lớp `Planning/` cho project và materialize 4 PRD canonical của `Knowledge_Center`, đồng thời nối traceability từ PRD sang SRS. |
| 2026-04-15 | [2026-04-15_MIABOS_AI_Workspace_SRS_Expansion](../../02_Sessions/2026-04-15_MIABOS_AI_Workspace_SRS_Expansion.md) | Materialize `AI_Workspace` thành 6 capability slices bằng cách thêm 4 SRS mới cho answer history, escalation handoff, suggested actions, và CTA/lead handoff; đồng bộ lại control-plane analysis cho surface AI. |
