# STB: F-M08-KNW-004 Knowledge Documents And Source Governance — FE Preview

**Feature ID**: F-M08-KNW-004
**Status**: In Progress
**Phase**: PB-04 FE Preview (mock/stub only)
**Assigned To**: A07 FE Builder
**UXUI Spec**: Approved
**SRS**: SRS Ready
**Date**: 2026-04-17

---

## Design Change Notice — 2026-04-17

Source Governance không còn là hai page chính `/knowledge/sources` và `/knowledge/freshness`. Nó là section `Source Health` trong `/knowledge`; source detail mở trong panel/drawer và phải hiển thị linked documents/assets để thấy impact khi source stale/restricted.

## Subtasks

| # | Task | Status | Notes |
|---|------|--------|-------|
| 1 | Mock data: sources registry + freshness | Done | `src/mocks/knowledge/sources.ts` |
| 2 | Page: KnowledgeSourcesPage (`/knowledge/sources`) | Legacy Done | Keep only if needed for backwards deep-link |
| 3 | Page: KnowledgeFreshnessPage (`/knowledge/freshness`) | Legacy Done | Keep only if needed for backwards deep-link |
| 4 | Source Health section inside KnowledgeHomePage (`/knowledge?section=sources`) | Pending | Registry + freshness + restrict actions |
| 5 | Source detail linked documents/assets | Pending | Affected asset/document count |
| 6 | Build verify | Pending | |

---

## Evidence Gate

- [ ] `npm run build` pass
- [ ] `/knowledge?section=sources` usable
- [ ] `/knowledge?section=freshness` usable
- [ ] `/knowledge/sources` and `/knowledge/freshness` are removed, redirected, or clearly marked legacy before FE handoff

---

## Notes

- 3 source types: SAP B1, KiotViet, Excel Upload
- Freshness = 1 giờ unified threshold
- Source mismatch/reconciliation behavior deferred to BE/Catalog & Commerce phase
