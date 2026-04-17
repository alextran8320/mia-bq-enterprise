# STB: F-M08-KNW-001 Knowledge And Policy — FE Preview

**Feature ID**: F-M08-KNW-001
**Status**: In Progress
**Phase**: PB-04 FE Preview (mock/stub only)
**Assigned To**: A07 FE Builder
**UXUI Spec**: Approved
**SRS**: SRS Ready
**Date**: 2026-04-17

---

## Design Change Notice — 2026-04-17

Business Owner yêu cầu Knowledge Center chuyển sang **một page chung `/knowledge`** có folder tree, command/search bar, content sections, preview/detail panel, `Import tài liệu`, và rich document assets. Các route `/knowledge/create` và `/knowledge/:id` chỉ còn là deep-link/panel state, không phải trải nghiệm chính tách rời.

## Subtasks

| # | Task | Status | Notes |
|---|------|--------|-------|
| 1 | Mock data: knowledge documents list | Done | `src/mocks/knowledge/documents.ts` |
| 2 | Page: KnowledgeHomePage (`/knowledge`) | Needs Revision | Consolidate folder tree + sections + preview/detail |
| 3 | Page: KnowledgeDocumentDetailPage (`/knowledge/:id`) | Needs Revision | Convert to detail panel/deep-link state |
| 4 | Page: KnowledgeCreatePage (`/knowledge/create`) | Needs Revision | Convert to drawer; add Import drawer as primary path |
| 5 | Router: add `/knowledge` routes | Done | `router.tsx` |
| 6 | Sidebar: add Knowledge Center nav group | Done | `Sidebar.tsx` |
| 7 | Rich document assets mock: images/tables/attachments | Pending | Required by updated UXUI |
| 8 | Build verify + HTTP 200 | Pending | |

---

## Evidence Gate

- [ ] `npm run build` pass (Node v20)
- [ ] `/knowledge` HTTP 200
- [ ] `/knowledge` renders folder tree + Import CTA + preview/detail panel
- [ ] Import drawer preserves mock image/table/attachment metadata
- [ ] `/knowledge/create` deep-link/drawer state works
- [ ] `/knowledge/:id` deep-link/detail panel state works

---

## Notes

- Mock/stub only — không gọi API thật
- BE/integration blocked cho đến khi BO mở gate riêng
