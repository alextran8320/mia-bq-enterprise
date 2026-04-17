# STB: F-M08-KNW-002 Knowledge Publishing Queue — FE Preview

**Feature ID**: F-M08-KNW-002
**Status**: In Progress
**Phase**: PB-04 FE Preview (mock/stub only)
**Assigned To**: A07 FE Builder
**UXUI Spec**: Approved
**SRS**: SRS Ready
**Date**: 2026-04-17

---

## Design Change Notice — 2026-04-17

Publishing Queue không còn là page chính riêng. Nó là section `Chờ duyệt` trong `/knowledge`; review detail mở trong panel/drawer và phải có tab rich content để reviewer thấy hình ảnh/bảng/attachment trước khi duyệt.

## Subtasks

| # | Task | Status | Notes |
|---|------|--------|-------|
| 1 | Mock data: publishing queue items | Done | `src/mocks/knowledge/publishingQueue.ts` |
| 2 | Page: KnowledgePublishingQueuePage (`/knowledge/publishing-queue`) | Legacy Done | Keep only if needed for backwards deep-link |
| 3 | Queue section inside KnowledgeHomePage (`/knowledge?section=queue`) | Pending | SLA list + review detail panel |
| 4 | Review detail rich content tab | Pending | image/table/attachment preview |
| 5 | Build verify | Pending | |

---

## Evidence Gate

- [ ] `npm run build` pass
- [ ] `/knowledge?section=queue` usable
- [ ] `/knowledge/publishing-queue` is removed, redirected, or clearly marked legacy before FE handoff

---

## Notes

- 1-reviewer flow; không có dual-approval UI (SAP handles)
- SLA timer: 1-threshold duy nhất
