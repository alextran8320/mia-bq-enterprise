# Subtask Board: STB-M14-BIZ-001 Business Analytics And ROI FE Preview

**Status**: In Review
**Owner**: A01 PM Agent
**Last Updated By**: Codex CLI (GPT-5.4 Codex environment)
**Last Reviewed By**: A01 PM Agent
**Approval Required**: PM
**Approved By**: A01 PM Agent
**Last Status Change**: 2026-04-16
**Source of Truth**: Execution board for `F-M14-BIZ-001 Business Analytics And ROI` FE Preview.
**Blocking Reason**: FE Preview is reviewable with mock/stub data; Business Owner review decision is not yet recorded.

---

## Parent Context

- `Story ID`: `US-M14-BIZ-001`
- `Feature ID`: `F-M14-BIZ-001`
- `Backlog ID`: `PBI-M14-BIZ-001`
- `Module`: Insights And Performance / Business Analytics And ROI
- `Related PRD`: [PRD-M14-BIZ-001_Business_Analytics_And_ROI.md](../PRD/Insights_And_Performance/PRD-M14-BIZ-001_Business_Analytics_And_ROI.md)
- `Related Feature SRS`: [F-M14-BIZ-001_Business_Analytics_And_ROI_SRS.md](../../Analysis/Features/Modules/Insights_And_Performance/Business_Analytics_And_ROI/SRS/F-M14-BIZ-001_Business_Analytics_And_ROI_SRS.md)
- `Related UXUI`: [UXUI-F-M14-BIZ-001_Business_Analytics_And_ROI.md](../../Design/UXUI_Features/UXUI-F-M14-BIZ-001_Business_Analytics_And_ROI.md)
- `Target Routes`: `/analytics/executive`, `/analytics/performance`, `/analytics/funnel`, `/analytics/ai-roi`
- `Requirement Clarification Status`: `Clear for FE Preview / production analytics deferred`

## Confirmed Decisions

- FE Preview may use local mock/stub data only.
- Dashboard KPI set for preview: revenue, order volume, AI answer success, escalation rate, sell-through, promo effectiveness, funnel conversion, lead capture, time saved.
- Insufficient data must never render as `0`.
- Scope-denied state must be friendly and business-readable.
- No real analytics, export, or M07 scope API may be invented in FE Preview.

## Gate Check

| Requirement | Status | Evidence | Notes |
|-------------|--------|----------|-------|
| PRD approved | PASS | [PRD](../PRD/Insights_And_Performance/PRD-M14-BIZ-001_Business_Analytics_And_ROI.md) | FE Preview scope only |
| User Story approved | PASS | [Story](../Stories/Insights_And_Performance/US-M14-BIZ-001_Business_Analytics_And_ROI.md) | AC IDs defined |
| Feature SRS at least `SRS Ready` | PASS | [SRS](../../Analysis/Features/Modules/Insights_And_Performance/Business_Analytics_And_ROI/SRS/F-M14-BIZ-001_Business_Analytics_And_ROI_SRS.md) | BE gate separate |
| UXUI Feature Spec approved | PASS | [UXUI](../../Design/UXUI_Features/UXUI-F-M14-BIZ-001_Business_Analytics_And_ROI.md) | Approved for FE Preview |
| Mock/stub data boundary explicit | PASS | This board | No real endpoints |

## Subtask Statuses

| Subtask ID | Workstream | Title | Primary Agent | Consulted Agents | Depends On | Output Artifact | Status | Blocking Reason |
|------------|------------|-------|---------------|------------------|------------|-----------------|--------|-----------------|
| ST-M14-BIZ-001-01 | PM | Legalize FE Preview handoff | A01 | A02, A03, A06 | - | PRD/story/STB/backlog sync | Done | - |
| ST-M14-BIZ-001-02 | FE | Build Dashboard FE Preview | A07 | A06, A05 | ST-01 | Analytics routes with mock data | Ready for Review | - |
| ST-M14-BIZ-001-03 | A06/A01 | Runtime review and visual audit | A06/A01 | A07 | ST-02 | Runtime evidence/review notes | Todo | Requires Business Owner / PM review |
| ST-M14-BIZ-001-04 | Tech Lead | Integration handoff | A05 | A03, A06 | Review decision | Integration Spec | Blocked | Requires reviewed FE preview |

## ST-M14-BIZ-001-02 - FE - Build Dashboard FE Preview

**Role**: A07 FE Builder  
**Status**: `Ready for Review`  
**Depends On**: ST-M14-BIZ-001-01

### Objective

Build reviewable analytics dashboard preview routes that demonstrate KPI hierarchy, dashboard states, promo comparison, funnel view, and AI ROI with local mock/stub data.

### In Scope

- Add analytics/dashboard route(s) and navigation entry if needed.
- Implement Executive Dashboard, Business Performance, CRM/Funnel, AI ROI, and Promo Comparison states.
- Use local mock data only.
- Represent healthy, warning, insufficient data, scope denied, snapshot pending, and export error/success states.
- Produce runtime evidence: build pass, route check, and review URL. Screenshot is optional unless PM/Business Owner requests it.

### Out of Scope

- Do not create real analytics endpoints.
- Do not connect SAP B1, KiotViet, Haravan, M03-M06, M10, or M12.
- Do not implement real export generation unless a backend/API contract exists.
- Do not change production KPI definitions.

### Write Scope

- Frontend dashboard routes/components under `01_Projects/MIABOS/Build/Frontend_App/src/`.
- Optional mock data under `01_Projects/MIABOS/Build/Frontend_App/src/mocks/`.
- This subtask board only for status/evidence updates.

### Read First

| File | Purpose |
|------|---------|
| [UXUI](../../Design/UXUI_Features/UXUI-F-M14-BIZ-001_Business_Analytics_And_ROI.md) | Visual, interaction, copy, states |
| [SRS](../../Analysis/Features/Modules/Insights_And_Performance/Business_Analytics_And_ROI/SRS/F-M14-BIZ-001_Business_Analytics_And_ROI_SRS.md) | Business rules, API/data mock contract |
| [Story](../Stories/Insights_And_Performance/US-M14-BIZ-001_Business_Analytics_And_ROI.md) | AC IDs and user task |

### Evidence Required

- `npm run build` pass.
- Analytics routes return HTTP 200 in local dev server.
- Runtime review note confirming main states are reachable.
- Any deviations from UXUI/SRS documented in this board before review.

### Execution Steps Completed

1. Created local mock analytics dataset for KPI, branch, promo, funnel, AI ROI, insufficient-data, scope-denied, and snapshot-pending states.
2. Implemented Dashboard FE Preview routes:
   - `/analytics/executive`
   - `/analytics/performance`
   - `/analytics/funnel`
   - `/analytics/ai-roi`
3. Added navigation entry `Dashboard ROI` under `Insights`.
4. Kept preview strictly frontend-only: no backend endpoint, no analytics API, no SAP B1/KiotViet/Haravan/M03-M06/M10/M12 calls.
5. Ran production build with Node `v20.10.0`: `npm run build` passed.
6. Started Vite preview server at `http://127.0.0.1:4173/`.
7. Verified all target routes return HTTP `200`.

### Runtime Evidence

| Evidence | Result | Notes |
|----------|--------|-------|
| `PATH=/Users/tranduchoang/.nvm/versions/node/v20.10.0/bin:$PATH npm run build` | PASS | Vite build completed successfully. |
| `GET /analytics/executive` | HTTP 200 | Preview route reachable. |
| `GET /analytics/performance` | HTTP 200 | Preview route reachable. |
| `GET /analytics/funnel` | HTTP 200 | Preview route reachable. |
| `GET /analytics/ai-roi` | HTTP 200 | Preview route reachable. |

### Review URLs

- `http://127.0.0.1:4173/analytics/executive`
- `http://127.0.0.1:4173/analytics/performance`
- `http://127.0.0.1:4173/analytics/funnel`
- `http://127.0.0.1:4173/analytics/ai-roi`

### Hard Stops

- Missing mock data for insufficient-data or scope-denied states.
- Any call to a real or invented backend endpoint.
- Any user-facing English copy not defined in UXUI.
- Raw hex colors if design tokens/classes already exist for the intended style.

### Done When

- [x] Dashboard preview routes are reachable.
- [x] Healthy/warning/insufficient/scope-denied states are reviewable.
- [x] Runtime evidence is recorded.
- [ ] PM/Business Owner review decision is captured.

## ST-M14-BIZ-001-03 - A06/A01 - Runtime Review and Visual Audit

**Role**: A06 UI/UX Agent + A01 PM Agent  
**Status**: `Todo`  
**Depends On**: ST-M14-BIZ-001-02

### Objective

Business Owner / PM reviews the mock dashboard preview and decides whether the FE direction is acceptable before any integration work is opened.

### Review Checklist

- [ ] KPI hierarchy is acceptable for BQ executive review.
- [ ] Promo comparison flow is understandable.
- [ ] Funnel and AI ROI views communicate the intended business value.
- [ ] Insufficient-data state does not look like zero performance.
- [ ] Scope-denied state is business-readable and not technical.
- [ ] Business Owner decides: `Approved / Needs Changes / Blocked`.

### Backend Boundary

No BE, integration, analytics API, export API, or production data pipeline work may start until Business Owner confirms the broader frontend review is complete and PM explicitly opens the backend/integration gate.
