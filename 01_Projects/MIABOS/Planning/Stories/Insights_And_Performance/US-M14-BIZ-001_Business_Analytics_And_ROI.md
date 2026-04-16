# User Story: US-M14-BIZ-001 Business Analytics And ROI FE Preview

**Status**: Approved
**Owner**: A03 BA Agent
**Last Updated By**: Codex CLI (GPT-5.4 Codex environment)
**Last Reviewed By**: A01 PM Agent
**Approval Required**: PM Agent
**Approved By**: A01 PM Agent
**Last Status Change**: 2026-04-16
**Source of Truth**: This file for Dashboard FE Preview user story and acceptance criteria.
**Blocking Reason**: -

---

## Story

As a BQ executive or functional lead, I want to view business performance, funnel, promo effectiveness, and AI ROI in one dashboard experience, so that I can understand pilot value without manually combining reports.

## Planning Context

- `Feature ID`: F-M14-BIZ-001
- `PRD`: [PRD-M14-BIZ-001_Business_Analytics_And_ROI.md](../../PRD/Insights_And_Performance/PRD-M14-BIZ-001_Business_Analytics_And_ROI.md)
- `Feature SRS`: [F-M14-BIZ-001_Business_Analytics_And_ROI_SRS.md](../../../Analysis/Features/Modules/Insights_And_Performance/Business_Analytics_And_ROI/SRS/F-M14-BIZ-001_Business_Analytics_And_ROI_SRS.md)
- `UXUI`: [UXUI-F-M14-BIZ-001_Business_Analytics_And_ROI.md](../../../Design/UXUI_Features/UXUI-F-M14-BIZ-001_Business_Analytics_And_ROI.md)
- `Priority`: P1
- `Product`: MIA Smart / Platform
- `Release Slice`: FE Preview with mock/stub data

## User Problem

BQ leadership and functional teams lack one trusted view for revenue trend, promo effectiveness, funnel conversion, and AI ROI. Current reporting depends on manual synthesis across systems.

## Trigger

Business Owner wants a dashboard preview to review information architecture, KPI hierarchy, states, and value story before real analytics integration.

## Happy Path

1. User opens `/analytics/executive`.
2. Dashboard renders top-4 KPI cards and supporting charts.
3. User clicks a KPI or navigation tab to inspect performance, funnel, or AI ROI.
4. User filters by period/dimension using mock data.
5. User opens promo comparison or export state for review.

## Dependencies

- SRS `F-M14-BIZ-001` is `SRS Ready`.
- UXUI `UXUI-F-M14-BIZ-001` is `Approved` for FE Preview.
- STB `STB-M14-BIZ-001` controls A07 execution/review scope.
- Production aggregation deferred until Integration Spec is approved.

## Acceptance Criteria

| AC ID | Acceptance Criteria |
|-------|---------------------|
| AC-M14-BIZ-001-01 | Given the user opens Executive Dashboard, when the preview loads, then four KPI cards and last-refreshed timestamp are visible. |
| AC-M14-BIZ-001-02 | Given a metric has insufficient data, when the card/table renders, then the preview shows "Chưa đủ dữ liệu" or `-` with tooltip instead of `0`. |
| AC-M14-BIZ-001-03 | Given Marketing selects two promotions, when comparison opens, then side-by-side promo metrics are visible with clear labels. |
| AC-M14-BIZ-001-04 | Given a user is outside a regional scope in mock state, when they select the dimension, then the preview shows a friendly scope-blocked message. |
| AC-M14-BIZ-001-05 | Given the PM opens AI ROI view, when the view renders, then answer success, escalation rate, lead capture, and time saved metrics are visible. |

## Out of Scope

- Real analytics API.
- Real export generation.
- Production M07 scope enforcement.
- Final KPI governance approval from BQ leadership.

