# STB: F-M08-KNW-002 Knowledge Publishing Queue — FE Preview

**Feature ID**: F-M08-KNW-002
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
| 1 | Mock data: publishing queue items | Done | `src/mocks/knowledge/publishingQueue.ts` |
| 2 | Page: KnowledgePublishingQueuePage (`/knowledge/publishing-queue`) | Done | Queue list + SLA badge |
| 3 | Router: add `/knowledge/publishing-queue` | Done | `router.tsx` |
| 4 | Build verify | Pending | |

---

## Evidence Gate

- [ ] `npm run build` pass
- [ ] `/knowledge/publishing-queue` HTTP 200

---

## Notes

- 1-reviewer flow; không có dual-approval UI (SAP handles)
- SLA timer: 1-threshold duy nhất
