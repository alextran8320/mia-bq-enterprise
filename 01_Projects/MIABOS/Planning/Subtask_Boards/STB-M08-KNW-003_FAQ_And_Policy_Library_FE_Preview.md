# STB: F-M08-KNW-003 FAQ And Policy Library — FE Preview

**Feature ID**: F-M08-KNW-003
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
| 1 | Mock data: library docs | Done | Dùng chung `documents.ts` |
| 2 | Page: KnowledgeLibraryPage (`/knowledge/library`) | Done | Domain menu + search + results |
| 3 | Router: add `/knowledge/library` | Done | `router.tsx` |
| 4 | Build verify | Pending | |

---

## Evidence Gate

- [ ] `npm run build` pass
- [ ] `/knowledge/library` HTTP 200

---

## Notes

- Domain-based taxonomy (không phải persona)
- Desktop-first; mobile không cần optimize phase 1
- Scope filter bằng badge, không tách trang riêng
