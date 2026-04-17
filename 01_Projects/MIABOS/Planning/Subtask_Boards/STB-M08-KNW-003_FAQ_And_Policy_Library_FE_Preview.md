# STB: F-M08-KNW-003 FAQ And Policy Library — FE Preview

**Feature ID**: F-M08-KNW-003
**Status**: In Progress
**Phase**: PB-04 FE Preview (mock/stub only)
**Assigned To**: A07 FE Builder
**UXUI Spec**: Approved
**SRS**: SRS Ready
**Date**: 2026-04-17

---

## Design Change Notice — 2026-04-17

Library không còn là page riêng `/knowledge/library`. Nó là section trong `/knowledge`, dùng folder tree `SOP / FAQ / Policy / System Guide / Imported`, search ở command bar, results ở center column, và document detail panel bên phải.

## Subtasks

| # | Task | Status | Notes |
|---|------|--------|-------|
| 1 | Mock data: library docs | Done | Dùng chung `documents.ts` |
| 2 | Page: KnowledgeLibraryPage (`/knowledge/library`) | Legacy Done | Keep only if needed for backwards deep-link; not main UX |
| 3 | Library section inside KnowledgeHomePage (`/knowledge`) | Pending | Search + folder context + results + detail panel |
| 4 | Rich content render in detail panel | Pending | image/table/attachment |
| 5 | Build verify | Pending | |

---

## Evidence Gate

- [ ] `npm run build` pass
- [ ] `/knowledge` library section usable
- [ ] `/knowledge?category=FAQ` deep-link state works
- [ ] `/knowledge/library` is removed, redirected, or clearly marked legacy before FE handoff

---

## Notes

- Domain-based taxonomy (không phải persona)
- Desktop-first; mobile không cần optimize phase 1
- Scope filter bằng badge, không tách trang riêng
