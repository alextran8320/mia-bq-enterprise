# STB: F-M08-KNW-004 Knowledge Documents And Source Governance — FE Preview

**Feature ID**: F-M08-KNW-004
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
| 1 | Mock data: sources registry + freshness | Done | `src/mocks/knowledge/sources.ts` |
| 2 | Page: KnowledgeSourcesPage (`/knowledge/sources`) | Done | Source registry + status dots |
| 3 | Page: KnowledgeFreshnessPage (`/knowledge/freshness`) | Done | Freshness board — stale if > 1h |
| 4 | Router: add `/knowledge/sources` + `/knowledge/freshness` | Done | `router.tsx` |
| 5 | Build verify | Pending | |

---

## Evidence Gate

- [ ] `npm run build` pass
- [ ] `/knowledge/sources` HTTP 200
- [ ] `/knowledge/freshness` HTTP 200

---

## Notes

- 3 source types: SAP B1, KiotViet, Excel Upload
- Freshness = 1 giờ unified threshold
- Conflict behavior deferred to BE phase
