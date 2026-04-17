# Current Active Context

**Last Updated**: 2026-04-17
**Active Workspace Topic**: Knowledge Center FE Preview Built — M08 KNW-001→KNW-004 live at /knowledge/*
**Current Project**: `MIABOS`
**Current Phase**: `PB-04 / FE Build`
**Latest Canonical Session Log**: [[2026-04-17_MIABOS_Knowledge_Center_FE_Preview_Build]]
**Today's Daily Log**: [[2026-04-17_Daily_Log]]

## Latest Decisions

- Business Owner đã chốt 8 open questions ngày 2026-04-17 (retention, trigger, routing, action types, CTA set, approval, freshness SLA).
- **12/12 UXUI Feature Specs** = Approved.
- 8 SRS §22 đã được update với decisions chính thức của Business Owner.
- Approval workflow nằm ở SAP — MIABOS không có dual-approval UI trong Knowledge Center.
- Freshness threshold = 1 giờ cho tất cả source types (SAP B1, KiotViet, Excel, tài liệu tay).
- Backend/integration bị khóa cho tới khi toàn bộ frontend hoàn tất và Business Owner mở gate riêng.

## UXUI Spec Status Summary

| Feature | UXUI Spec Status | FE Preview |
|---------|-----------------|------------|
| F-M09-AIC-001 | Approved | Ready for Review at `/ai/chat` |
| F-M09-AIC-002 | **Approved** | Open for A07 FE build |
| F-M09-AIC-003 | **Approved** | Open for A07 FE build |
| F-M10-SLS-001 | Approved | Open for A07 FE Preview |
| F-M10-SLS-002 | **Approved** | Open for A07 FE build |
| F-M10-SLS-003 | **Approved** | Open for A07 FE build |
| F-M12-OBS-001 | **Approved** | Open for A07 FE build |
| F-M14-BIZ-001 | Approved | Ready for Review at `/analytics/executive` |
| F-M08-KNW-001 | **Approved** | Open for A07 FE build |
| F-M08-KNW-002 | **Approved** | Open for A07 FE build |
| F-M08-KNW-003 | **Approved** | Open for A07 FE build |
| F-M08-KNW-004 | **Approved** | Open for A07 FE build |

## FE Build Status

| Feature | FE Preview Route | Status |
|---------|-----------------|--------|
| F-M09-AIC-001 | /ai/chat | ✅ Built & Ready for Review |
| F-M14-BIZ-001 | /analytics/executive | ✅ Built & Ready for Review |
| F-M08-KNW-001 | /knowledge | ✅ Built & Verified (2026-04-17) |
| F-M08-KNW-002 | /knowledge/publishing-queue | ✅ Built & Verified (2026-04-17) |
| F-M08-KNW-003 | /knowledge/library | ✅ Built & Verified (2026-04-17) |
| F-M08-KNW-004 | /knowledge/sources + /knowledge/freshness | ✅ Built & Verified (2026-04-17) |
| F-M09-AIC-002 | TBD | 🔲 Open for A07 FE build |
| F-M09-AIC-003 | TBD | 🔲 Open for A07 FE build |
| F-M10-SLS-002 | TBD | 🔲 Open for A07 FE build |
| F-M10-SLS-003 | TBD | 🔲 Open for A07 FE build |
| F-M12-OBS-001 | TBD | 🔲 Open for A07 FE build |

## Next Actions

- **A07 FE Builder**: Build 5 features còn lại (mock/stub only): AIC-002, AIC-003, SLS-002, SLS-003, OBS-001.
- Business Owner review FE Previews hiện có: M09 `/ai/chat`, M14 `/analytics/executive`, M08 `/knowledge/*`.
- Không mở backend/integration cho đến khi BO mở gate riêng.
