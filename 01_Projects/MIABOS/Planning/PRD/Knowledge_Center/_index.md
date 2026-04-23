# Knowledge Center PRD Index

**Status**: In Review
**Owner**: A02 Product Owner Agent
**Last Updated By**: Codex CLI (GPT-5.4 Codex environment)
**Last Reviewed By**: A01 PM Agent
**Approval Required**: Business Owner
**Approved By**: -
**Last Status Change**: 2026-04-21
**Source of Truth**: Entry point for Knowledge Center PRD artifacts
**Blocking Reason**: PRD đang được backfill từ front-end source of truth; cần PM/Business Owner xác nhận lại governance scope

---

## Purpose

Folder này hiện chỉ giữ một PRD chuẩn cho `Knowledge Center Workspace`, vì front-end source of truth thể hiện `M08` là một workspace chung tại `/knowledge`, không phải 4 PRD tách rời.

## PRD Map

| PRD | Capability | Linked SRS | Status |
|-----|------------|------------|--------|
| [PRD-M08-KNW-001_Knowledge_And_Policy.md](./PRD-M08-KNW-001_Knowledge_And_Policy.md) | Workspace `/knowledge` gồm browse, search, queue, source health, detail, import/manual-create entry points | `F-M08-KNW-001..004` | In Review |

## Cleanup Decision

- `PRD-M08-KNW-002`, `PRD-M08-KNW-003`, `PRD-M08-KNW-004` đã bị xóa khỏi canonical PRD layer vì không còn khớp với front-end source of truth.

## Shared Inputs

- [BQ Customer Research Pack](../../../../04_Raw_Information/Customers/Giay_BQ/2026-04-13_BQ_Customer_Research_Pack.md)
- [BQ Raw Notes](../../../../04_Raw_Information/Customers/Giay_BQ/2026-04-13_BQ_Raw_Notes.md)
- [MIABOS Core AI CRM Platform - Module And Sitemap Recommendation](../../../Analysis/Features/Briefs/Portal_CRM_Module_And_Sitemap_Recommendation.md)
- `Knowledge_Center` SRS pack trong `Analysis/Features/Modules/Knowledge_Center/`
