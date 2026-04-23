# Current Active Context

**Last Updated**: 2026-04-21
**Active Workspace Topic**: MIABOS process migration — `Raw Input -> Research -> PRD -> Features -> UX/UI by Screen`
**Current Project**: `MIABOS`
**Current Phase**: `PB-01 / PB-02 / PB-03 Process Migration`
**Latest Canonical Session Log**: [[2026-04-21_MIABOS_Process_Migration_Research_PRD_Features_UXUI]]
**Today's Daily Log**: [[2026-04-21_Daily_Log]]

## Latest Decisions (2026-04-21)

- Business Owner approved migration of canonical MIABOS process to `Raw Input -> Research -> PRD -> Features -> UX/UI by Screen`.
- Existing `01_Projects/MIABOS/Research/` remains the canonical research layer; no parallel research layer will be created elsewhere.
- New canonical analysis artifact becomes `Feature Spec Lite`; `Feature SRS` stays only as legacy artifact during phased migration.
- New canonical design artifact becomes `UXUI Screen Spec`, coordinated by `Sitemap + Flow Matrix`.

## Current State

- Core OS/process layer has been migrated to `Raw Input -> Research -> PRD -> Features -> UX/UI by Screen`.
- Business Owner requested PRD cleanup to follow the existing front-end as source of truth and to remove demo artifacts created during migration.
- Demo pilot `M01 Product Query` artifacts have been removed from canonical PRD / Feature / Research / Screen-Pack layers.
- PRD layer has been backfilled from front-end source of truth for:
- PRD layer has been backfilled from front-end source of truth for:
  - `M08 Knowledge Center Workspace`
  - `M09 Internal AI Chat`
  - `M10 Sales Advisor AI`
  - `M14 Business Analytics And ROI`
- `M08` no longer uses 4 separate PRDs in the canonical PRD layer; it is now one workspace PRD aligned to `/knowledge`.
- Business Owner clarified that front-end is only evidence to understand current logic/scope; canonical PRDs must remain business-driven. The four rewritten PRDs were updated accordingly.

## Next Actions

- Review remaining PRD gaps for front-end-backed modules still missing clean canonical PRD coverage, especially `Catalog & Commerce`, `CRM`, `Orders`, and `Operations`.
- Decide whether to keep backfilled PRDs at `In Review` or promote after Business Owner validation.
- Keep legacy SRS/UXUI in place until each module is explicitly migrated to the new chain.

## ⚠ Critical Correction (2026-04-20)

> **BQ ĐANG DÙNG LARK — 3 NĂM**. Assumption từ 2026-04-19 rằng "BQ không dùng Lark" là SAI. Anh Tuấn Anh xác nhận trực tiếp trong buổi gặp thứ 2. Toàn bộ tài liệu tham chiếu Lark = "không dùng" phải được cập nhật.

## Latest Decisions (2026-04-20 — Buổi Gặp Thứ 2 Với BQ)

- **PIVOT**: BQ đang dùng **Lark 3 năm** — platform vận hành lõi. Build Chatbot Nội Bộ phải tích hợp trên Lark.
- **PIVOT**: CRM 360 không phải ưu tiên — đây là dự án riêng của phòng CNTT BQ. Phase 3–4 vẫn khả thi nhưng cần re-scope.
- **PIVOT**: End user tương tác Bot phải qua **Lark hoặc SAP** — không thêm platform mới.
- Focus duy nhất Phase 1: **AI Chatbot Nội Bộ tích hợp Lark** — 3 trụ cột: luồng vận hành Lark + bộ dữ liệu phân quyền + AI xử lý hình ảnh/content.
- Use case cốt lõi: **truy xuất dữ liệu hàng tồn kho** phải được giải triệt để.
- Hạ tầng: **Cloud-first → migrate Server BQ** sau khi ổn định.
- Human factor problem phải được thiết kế solution rõ ràng (sai sót con người vận hành, phân quyền, audit).
- **MS SQL** được anh Tuấn Anh đề cập như yêu cầu kỹ thuật — cần confirm đây là SQL Server BQ hay yêu cầu mới.
- **2 gói báo giá** cần chuẩn bị: Chatbot Nội Bộ + Chatbot Bán Hàng.
- Decision signal: anh Tuấn Anh approve → ~60% BGĐ BQ đồng ý.
- Q3–Q4 2026: BQ chuẩn bị chạy AI rất mạnh + song song (nội bộ + bán hàng).

## Latest Decisions (2026-04-19)

- Business Owner identified the need to link Master Data, Knowledge Center documents, and Interaction/Eval Data so AI can retrieve faster and more accurately.
- Created `01_Projects/MIABOS/Analysis/Data_Setup/AI_Data_Linkage_And_Labeling_Setup.md` as the canonical Draft Analysis artifact for AI data linkage and labeling setup.
- Data setup recommendation: use canonical IDs, source object mappings, object-knowledge relationship edges, metadata-filtered RAG, graph expansion, and source-priority rules before semantic search.
- Labeling should be shared across Master Data, Knowledge chunks, and Interaction/Eval records so AI retrieval and evaluation use the same taxonomy.
- Business Owner requested the BQ brand research and AI training/data-readiness recommendation be materialized as a canonical Research artifact.
- Created `01_Projects/MIABOS/Research/BQ_AI_Training/RES-BQ-AIT-001_BQ_Brand_And_AI_Training_Data_Research.md` as `Draft — Pending Business Owner Review`.
- Research recommendation: BQ AI Training should use Hybrid RAG + API/SQL retrieval + business rule layer + eval; fine-tuning should only optimize behavior/format after pilot evidence.
- Operational data such as inventory, price, CTKM, orders, customers, fulfillment, and loyalty should be retrieved from source systems / BQ Data Warehouse, not memorized in model weights.
- Business Owner clarified on 2026-04-19: differing CTKM under one price policy is BQ's normal operating model, not a problem statement; CTKM itself is not a BQ pain point.
- Business Owner clarified BQ should not be described with `HQ`; use `BQ` / central business ownership language instead.
- Business Owner clarified BQ does not use Lark and Lark must not appear as part of BQ operations.
- Business Owner clarified BQ is planning its own Data Warehouse to be BQ's source of truth for data received from SAP, KiotViet, and Haravan.
- MIABOS should be repositioned as a `Core AI CRM Platform`; MIABOS does not create BQ operational source data except Conversation and Knowledge artifacts.
- BQ rollout should start with BQ internal/content teams before broad deployment to other departments.
- BQ problem set should be framed as: AI Internal Chatbot for internal Q&A, AI External Chatbot for Social + Ecommerce sales advisory, AI Automation for Accounting/Finance/HR and repetitive office workflows, and Forecasting/prediction as a later data-readiness phase.
- Documentation update completed on 2026-04-19 across BQ intake pack, MIABOS briefs, integration/source-boundary SRS, relevant module SRS/UXUI docs, project control-plane, and KB Rule 41.
- Vietnamese diacritics normalization completed on 2026-04-19 for selected active docs: BQ customer README, BQ Raw Notes quote block, and SAP B1 Internal Chatbot Integration POC brief.
- Scope note: document layer is updated; frontend mock code still contains old Lark/HQ labels in Operations mock data and should be cleaned before demoing that route.
- Internal Chatbot Concept alignment completed on 2026-04-18: M09 SRS/UXUI were confirmed broadly aligned to `Trusted Knowledge Companion`; research metadata synced to Approved; M09 UXUI Source Trace binding fixed to use answer snapshot from `POST /mia/chat/query`.
- `Data` / `Mixed` answer in `F-M09-AIC-001` is explicitly scoped as read-only operational data snapshot for BQ phase 1, not Gen 4 action execution.
- Business Owner yêu cầu Knowledge Center không duplicate Catalog & Commerce taxonomy/data; `Knowledge Category / Domain` phải được diễn giải lại thành taxonomy tri thức nội bộ.
- Business Owner yêu cầu bỏ `Citation Snapshot`, `Knowledge Gap Report`, `Knowledge Usage Log`, và `Conflict Case` khỏi object set của Knowledge Center.
- `SOP Step` cần được giải thích lại là bước hướng dẫn thao tác trong tài liệu SOP, không phải workflow/task execution engine.
- A03 BA đã sync SRS/PRD/Stories/UXUI Knowledge Center để dùng `Knowledge Topic`, tách analytics sang M12 nếu cần, và đẩy data reconciliation/conflict handling ra khỏi M08.
- Business Owner yêu cầu Knowledge Center hỗ trợ tài liệu rich content có hình ảnh/bảng/attachment vì tài liệu sync từ phòng ban khác chắc chắn có hình ảnh.
- Knowledge Center được chốt lại là **một page chung `/knowledge`** với folder tree, command/search bar, content sections, và preview/detail panel.
- Root folder tree chính: `SOP`, `FAQ`, `Policy`, `System Guide`, `Imported / Chờ phân loại`.
- `Import tài liệu` là CTA chính; `Tạo thủ công` là CTA phụ.
- SRS/PRD/Stories/UXUI/STB M08 đã được refine theo layout mới; FE preview hiện có `/knowledge/library`, `/knowledge/publishing-queue`, `/knowledge/sources`, `/knowledge/freshness` được xem là legacy/revision-required trước FE handoff tiếp theo.
- Research chính thức đã được materialize tại `01_Projects/MIABOS/Research/Knowledge_Center/RES-M08-KNW_Knowledge_Center_Layout_And_Rich_Document_Research.md` và link vào Research index.
- UnifiedInbox `/inbox` đã được refine 2 vòng: vòng 1 neutral hóa; vòng 2 theo feedback BO đã đưa lại brand color ở mức vừa phải, dùng `Avatar` component xuyên suốt, thêm search thật sự chạy, giữ nguyên logic nghiệp vụ.
- Internal AI Chat doc chain đã được dọn trước BO review: Feature Registry chỉ còn một row `F-M09-AIC-001`, user story duplicate `_FE_Preview` đã bị xóa, story canonical là `US-M09-AIC-001_Internal_AI_Chat.md`, SRS/Requirements Mapping đã trỏ về story chính, UXUI metadata đủ status-model fields.
- Knowledge Center PRD/SRS/UXUI đã được align với `RES-M08-KNW_UX_Patterns_And_IA.md`: M08 giờ có contract answer-ready cho M09/M10 gồm source citation, scope statement, uncertainty/stale state, quick replies, guided SOP, role-aware guidance, feedback/escalation, AI Preview before publish, và freshness threshold `1 giờ`.
- M08 docs không còn TODO `cần bổ sung/cần verify` cho feedback/quick replies, không còn dual-approval UI residue trong queue, và không còn conflict-case workflow trong Source Governance.
- Build full qua `vite build` đang bị chặn bởi môi trường Node `v16.14.0`; `npx tsc -b` pass cho code mới.
- Business Owner đã chốt 8 open questions ngày 2026-04-17 (retention, trigger, routing, action types, CTA set, approval, freshness SLA).
- **12/12 UXUI Feature Specs** = Approved.
- 8 SRS §22 đã được update với decisions chính thức của Business Owner.
- Approval workflow nằm ở SAP — MIABOS không có dual-approval UI trong Knowledge Center.
- Freshness threshold = 1 giờ cho tất cả source types (SAP B1, KiotViet, Excel, tài liệu tay).
- Backend/integration bị khóa cho tới khi toàn bộ frontend hoàn tất và Business Owner mở gate riêng.

## UXUI Spec Status Summary

| Feature | UXUI Spec Status | FE Preview |
|---------|-----------------|------------|
| F-M09-AIC-001 | Approved | Ready for Review at `/ai/chat` |
| F-M09-AIC-002 | **Approved** | Open for A07 FE build |
| F-M09-AIC-003 | **Approved** | Open for A07 FE build |
| F-M10-SLS-001 | Approved | Open for A07 FE Preview |
| F-M10-SLS-002 | **Approved** | Open for A07 FE build |
| F-M10-SLS-003 | **Approved** | Open for A07 FE build |
| F-M12-OBS-001 | **Approved** | Open for A07 FE build |
| F-M14-BIZ-001 | Approved | Ready for Review at `/analytics/executive` |
| F-M08-KNW-001 | **Approved, revised 2026-04-17 with UX Pattern IA alignment** | Needs FE preview revision to unified `/knowledge` |
| F-M08-KNW-002 | **Approved, revised 2026-04-17 with UX Pattern IA alignment** | Needs FE preview revision as `/knowledge` section with AI Preview tab |
| F-M08-KNW-003 | **Approved, revised 2026-04-17 with UX Pattern IA alignment** | Needs FE preview revision as `/knowledge` section with citation/quick replies/feedback |
| F-M08-KNW-004 | **Approved, revised 2026-04-17 with UX Pattern IA alignment** | Needs FE preview revision as `/knowledge` section with 1-hour source freshness |

## FE Build Status

| Feature | FE Preview Route | Status |
|---------|-----------------|--------|
| F-M09-AIC-001 | /ai/chat | ✅ Built & Ready for Review |
| F-M14-BIZ-001 | /analytics/executive | ✅ Built & Ready for Review |
| UnifiedInbox (AI Workspace) | /inbox | ✅ UI refined round 2 (brand + avatar + search); needs BO review |
| F-M08-KNW-001 | /knowledge | Built earlier, now needs revision for folder tree + Import + rich assets |
| F-M08-KNW-002 | /knowledge?section=queue | Built earlier as `/knowledge/publishing-queue`; now needs consolidation |
| F-M08-KNW-003 | /knowledge?category=FAQ / Library section | Built earlier as `/knowledge/library`; now needs consolidation |
| F-M08-KNW-004 | /knowledge?section=sources + /knowledge?section=freshness | Built earlier as `/knowledge/sources` + `/knowledge/freshness`; now needs consolidation |
| F-M09-AIC-002 | TBD | 🔲 Open for A07 FE build |
| F-M09-AIC-003 | TBD | 🔲 Open for A07 FE build |
| F-M10-SLS-002 | TBD | 🔲 Open for A07 FE build |
| F-M10-SLS-003 | TBD | 🔲 Open for A07 FE build |
| F-M12-OBS-001 | TBD | 🔲 Open for A07 FE build |

## Next Actions

- **Business Owner**: review `RES-BQ-AIT-001_BQ_Brand_And_AI_Training_Data_Research.md` before it is used as proposal / AI training plan input.
- **Business Owner / PM**: review `AI_Data_Linkage_And_Labeling_Setup.md` and confirm taxonomy / relationship model before technical design.
- **A05 Tech Lead**: use the Data Setup Analysis as input for Directus collection design and integration architecture.
- **A03 BA**: use the Data Setup Analysis as input for source-priority rules, role/scope definitions, and eval case setup.
- **PM / BA / Tech Lead**: after approval, use the BQ AI Training research as input for proposal deck, Knowledge Center import scope, connector/data-readiness scope, and pilot eval set.
- **PM / Business Owner**: review revised Core AI CRM Platform narrative and confirm it is ready to become proposal/deck source.
- **PM / Business Owner**: confirm whether to normalize remaining deprecated/archive no-diacritics files such as `2026-04-14_BQ_Integration_Architecture_And_Data_Boundary.md` and older Orders story files.
- **A07 FE Builder**: if Operations screens will be demoed, remove old Lark/HQ mock labels and align with MIABOS Internal Escalation Queue / BQ language.
- **A07 FE Builder**: keep `/ai/chat` FE Preview within answer-first/trust-layer scope; do not add ticket/CRM/SAP action execution in this slice.
- **A05/A08**: before backend/integration, materialize Integration Spec with BQ/Data Warehouse source priority, access check, source routing, answer snapshot, and escalation handoff.
- **PM / Business Owner**: review aligned Knowledge Center PRD/SRS/UXUI docs against `RES-M08-KNW_UX_Patterns_And_IA.md` before FE revision.
- **PM / Business Owner**: approve hoặc comment research artifact `RES-M08-KNW_Knowledge_Center_Layout_And_Rich_Document_Research.md`.
- **PM / Business Owner**: review `/inbox` UI refinement round 2 (brand + avatar + search) và chốt feedback cuối.
- **A07 FE Builder**: revise M08 FE Preview into one `/knowledge` workspace with folder tree, `Import tài liệu`, content sections, rich document assets, and preview/detail panel.
- **A07 FE Builder**: Build 5 features còn lại (mock/stub only): AIC-002, AIC-003, SLS-002, SLS-003, OBS-001.
- Business Owner review FE Previews hiện có: M09 `/ai/chat` (doc chain cleaned), M14 `/analytics/executive`; M08 should be reworked before final review.
- Không mở backend/integration cho đến khi BO mở gate riêng.
