# Current Active Context

**Last Updated**: 2026-04-18
**Active Workspace Topic**: Internal Chatbot Concept alignment completed
**Current Project**: `MIABOS`
**Current Phase**: `PB-03 Product Design`
**Latest Canonical Session Log**: [[2026-04-18_MIABOS_Internal_Chatbot_Concept_Alignment]]
**Today's Daily Log**: [[2026-04-18_Daily_Log]]

## Latest Decisions

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

- **A07 FE Builder**: keep `/ai/chat` FE Preview within answer-first/trust-layer scope; do not add ticket/CRM/SAP action execution in this slice.
- **A05/A08**: before backend/integration, materialize Integration Spec with source priority, access check, source routing, answer snapshot, and escalation handoff.
- **PM / Business Owner**: review aligned Knowledge Center PRD/SRS/UXUI docs against `RES-M08-KNW_UX_Patterns_And_IA.md` before FE revision.
- **PM / Business Owner**: approve hoặc comment research artifact `RES-M08-KNW_Knowledge_Center_Layout_And_Rich_Document_Research.md`.
- **PM / Business Owner**: review `/inbox` UI refinement round 2 (brand + avatar + search) và chốt feedback cuối.
- **A07 FE Builder**: revise M08 FE Preview into one `/knowledge` workspace with folder tree, `Import tài liệu`, content sections, rich document assets, and preview/detail panel.
- **A07 FE Builder**: Build 5 features còn lại (mock/stub only): AIC-002, AIC-003, SLS-002, SLS-003, OBS-001.
- Business Owner review FE Previews hiện có: M09 `/ai/chat` (doc chain cleaned), M14 `/analytics/executive`; M08 should be reworked before final review.
- Không mở backend/integration cho đến khi BO mở gate riêng.
