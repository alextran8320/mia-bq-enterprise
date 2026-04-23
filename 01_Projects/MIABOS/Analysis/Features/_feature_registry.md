# Feature Registry

**Status**: Active
**Owner**: A01 PM Agent
**Last Updated By**: Codex CLI (GPT-5.4 Codex environment)
**Last Reviewed By**: A01 PM Agent
**Approval Required**: PM
**Approved By**: A01 PM Agent
**Last Status Change**: 2026-04-21
**Source of Truth**: Canonical control plane for feature readiness under the process `Raw Input -> Research -> PRD -> Features -> UX/UI by Screen`
**Blocking Reason**: -

---

## Registry Rules

- `Canonical Artifact` now means `Feature Spec Lite` for migrated slices.
- Existing `SRS` files remain valid only as `Legacy SRS` during phased migration.
- `Canonical Status` uses `Draft / In Review / Feature Ready for UX / Build Ready / Blocked / Deprecated`.
- `Linked Screens` may point to `UXUI Screen Specs` or `Pending Migration`.

## Active / Migrated Slices

| Feature ID | Portal Surface | Feature Name | Canonical Artifact | Canonical Status | Research | PRD | Linked Screens | Blocking Reason |
|------------|----------------|--------------|--------------------|------------------|----------|-----|----------------|-----------------|
| `F-M09-AIC-001` | AI Workspace | Internal AI Chat | Legacy SRS | `Pending Migration` | Research exists | PRD exists | Legacy UXUI Feature Spec | Chưa migrate sang Feature Spec Lite + Screen Pack |
| `F-M10-SLS-001` | AI Workspace | Sales Advisor AI | Legacy SRS | `Pending Migration` | Research partial | PRD exists | Legacy UXUI Feature Spec | Chưa migrate sang Feature Spec Lite + Screen Pack |
| `F-M14-BIZ-001` | Insights And Performance | Business Analytics And ROI | Legacy SRS | `Pending Migration` | Research missing / needs waiver | PRD exists | Legacy UXUI Feature Spec | Chưa migrate sang Feature Spec Lite + Screen Pack |
| `F-M08-KNW-001` | Knowledge Center | Knowledge and Policy | Legacy SRS | `Pending Migration` | Research exists | PRD exists | Legacy UXUI Feature Spec | Chưa migrate sang Feature Spec Lite + Screen Pack |
| `F-M08-KNW-002` | Knowledge Center | Knowledge Publishing Queue | Legacy SRS | `Pending Migration` | Research exists | PRD exists | Legacy UXUI Feature Spec | Chưa migrate sang Feature Spec Lite + Screen Pack |
| `F-M08-KNW-003` | Knowledge Center | FAQ and Policy Library | Legacy SRS | `Pending Migration` | Research exists | PRD exists | Legacy UXUI Feature Spec | Chưa migrate sang Feature Spec Lite + Screen Pack |
| `F-M08-KNW-004` | Knowledge Center | Knowledge Documents and Source Governance | Legacy SRS | `Pending Migration` | Research exists | PRD exists | Legacy UXUI Feature Spec | Chưa migrate sang Feature Spec Lite + Screen Pack |

## Remaining Legacy Slices

| Feature ID | Surface | Legacy Artifact | Current State | Migration Target |
|------------|---------|-----------------|---------------|------------------|
| `F-SAP-INT-001` | Integration Foundation | Source Spec / SRS | Legacy Draft | Wave 2 |
| `F-HAR-INT-001` | Integration Foundation | Source Spec / SRS | Legacy Draft | Wave 2 |
| `F-KV-INT-001` | Integration Foundation | Source Spec / SRS | Legacy Draft | Wave 2 |
| `F-I01-INT-001` | Integration Foundation | SRS | Legacy Draft | Wave 2 |
| `F-I02-INT-001` | Integration Foundation | SRS | Legacy Draft | Wave 2 |
| `F-I03-INT-001` | Integration Foundation | SRS | Legacy Draft | Wave 2 |
| `F-I04-INT-001` | Integration Foundation | SRS | Legacy Draft | Wave 2 |
| `F-I05-INT-001` | Integration Foundation | SRS | Legacy Draft | Wave 2 |
| `F-M01-PRD-001` | Catalog And Commerce | SRS | Legacy `SRS Ready` | PRD demo + Feature Spec demo đã xóa; chờ rewrite từ front-end source of truth |
| `F-M02-INV-001` | Catalog And Commerce | SRS | Legacy `SRS Ready` | Wave 1 |
| `F-M03-PRC-001` | Catalog And Commerce | SRS | Legacy `SRS Ready` | Wave 1 |
| `F-M04-PRO-001` | Catalog And Commerce | SRS | Legacy `SRS Ready` | Wave 1 |
| `F-M05-ORD-001` | Orders And Service | SRS | Legacy Draft | Wave 2 |
| `F-M06-CRM-001` | CRM Workspace | SRS | Legacy Draft | Wave 2 |
| `F-M07-SEC-001` | Operations And Governance | SRS | Legacy Draft | Wave 2 |
| `F-M09-AIC-002` | AI Workspace | SRS | Legacy `SRS Ready` | Wave 1 |
| `F-M09-AIC-003` | AI Workspace | SRS | Legacy `SRS Ready` | Wave 1 |
| `F-M09-AIC-004` | AI Workspace | SRS | Legacy Draft | Wave 2 |
| `F-M09-AIC-005` | AI Workspace | SRS | Legacy Draft | Wave 2 |
| `F-M10-SLS-002` | AI Workspace | SRS | Legacy `SRS Ready` | Wave 1 |
| `F-M10-SLS-003` | AI Workspace | SRS | Legacy `SRS Ready` | Wave 1 |
| `F-M11-ESC-001` | Operations And Governance | SRS | Legacy Draft | Wave 2 |
| `F-M12-OBS-001` | Insights And Performance | SRS | Legacy `SRS Ready` | Wave 1 |
