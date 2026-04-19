# Knowledge Center PRD Index

**Status**: Draft
**Owner**: A02 Product Owner Agent
**Last Updated By**: Codex CLI (GPT-5.4 Codex environment)
**Last Reviewed By**: A01 PM Agent
**Approval Required**: Business Owner
**Approved By**: -
**Last Status Change**: 2026-04-17
**Source of Truth**: Entry point for Knowledge Center PRD artifacts
**Blocking Reason**: Chưa chốt final source-type boundary và external exposure boundary

---

## Purpose

Folder này gom các PRD của surface `Knowledge_Center` để A02/A01 có lớp product-definition rõ ràng trước khi đi tiếp sang backlog, story sequencing, và design.

**UX/IA decision 2026-04-17**: Knowledge Center là một page chung `/knowledge`, không chia thành nhiều page rời. Các capability bên dưới là section/panel trong cùng workspace: folder tree bên trái, search/command bar phía trên, content sections ở giữa, preview/detail panel bên phải. Tài liệu import từ nguồn ngoài phải preserve hình ảnh, bảng, và attachment dưới dạng document assets.

**AI Chat UX alignment 2026-04-17**: PRD/SRS/UXUI M08 phải align với [RES-M08-KNW_UX_Patterns_And_IA.md](../../../Research/Knowledge_Center/RES-M08-KNW_UX_Patterns_And_IA.md). Knowledge Center không chỉ lưu document body; nó phải cung cấp answer-ready metadata cho M09/M10: source citation, scope statement, stale/uncertainty state, quick replies, role-aware guidance, escalation path, và feedback action.

## PRD Map

| PRD | Capability | Linked SRS | Status |
|-----|------------|------------|--------|
| [PRD-M08-KNW-001_Knowledge_And_Policy.md](./PRD-M08-KNW-001_Knowledge_And_Policy.md) | `/knowledge` workspace, Import action, rich document assets, document/version/source reference | `F-M08-KNW-001` | Draft |
| [PRD-M08-KNW-002_Knowledge_Publishing_Queue.md](./PRD-M08-KNW-002_Knowledge_Publishing_Queue.md) | Review, approve, publish, rollback governance as `Chờ duyệt` section | `F-M08-KNW-002` | Draft |
| [PRD-M08-KNW-003_FAQ_And_Policy_Library.md](./PRD-M08-KNW-003_FAQ_And_Policy_Library.md) | Search / filter / detail section cho SOP, FAQ, policy, rich documents | `F-M08-KNW-003` | Draft |
| [PRD-M08-KNW-004_Knowledge_Documents_And_Source_Governance.md](./PRD-M08-KNW-004_Knowledge_Documents_And_Source_Governance.md) | Source registry, freshness, trust, restricted-source governance as Source Health section | `F-M08-KNW-004` | Draft |

## Shared Inputs

- [BQ Customer Research Pack](../../../../04_Raw_Information/Customers/Giay_BQ/2026-04-13_BQ_Customer_Research_Pack.md)
- [BQ Raw Notes](../../../../04_Raw_Information/Customers/Giay_BQ/2026-04-13_BQ_Raw_Notes.md)
- [MIABOS Core AI CRM Platform - Module And Sitemap Recommendation](../../../Analysis/Features/Briefs/Portal_CRM_Module_And_Sitemap_Recommendation.md)
- `Knowledge_Center` SRS pack trong `Analysis/Features/Modules/Knowledge_Center/`
