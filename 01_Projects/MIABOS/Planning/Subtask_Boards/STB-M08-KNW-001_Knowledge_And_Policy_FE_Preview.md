# STB: F-M08-KNW-001 Knowledge And Policy — FE Preview

**Feature ID**: F-M08-KNW-001
**Status**: In Progress
**Phase**: PB-04 FE Preview (mock/stub only)
**Assigned To**: A07 FE Builder
**UXUI Spec**: Approved
**SRS**: SRS Ready
**Date**: 2026-04-17

---

## Subtasks

| # | Task | Status | Notes |
|---|------|--------|-------|
| 1 | Mock data: knowledge documents list | Done | `src/mocks/knowledge/documents.ts` |
| 2 | Page: KnowledgeHomePage (`/knowledge`) | Done | Stats + filter + doc list |
| 3 | Page: KnowledgeDocumentDetailPage (`/knowledge/:id`) | Done | Detail + stale/superseded banner |
| 4 | Page: KnowledgeCreatePage (`/knowledge/create`) | Done | Form với validation |
| 5 | Router: add `/knowledge` routes | Done | `router.tsx` |
| 6 | Sidebar: add Knowledge Center nav group | Done | `Sidebar.tsx` |
| 7 | Build verify + HTTP 200 | Pending | |

---

## Evidence Gate

- [ ] `npm run build` pass (Node v20)
- [ ] `/knowledge` HTTP 200
- [ ] `/knowledge/create` HTTP 200
- [ ] `/knowledge/:id` HTTP 200

---

## Notes

- Mock/stub only — không gọi API thật
- BE/integration blocked cho đến khi BO mở gate riêng
