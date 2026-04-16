# PRD: M14 Business Analytics And ROI

**Status**: Approved
**Owner**: A02 Product Owner Agent
**Last Updated By**: Codex CLI (GPT-5.4 Codex environment)
**Last Reviewed By**: A01 PM Agent
**Approval Required**: Business Owner / PM Agent
**Approved By**: A01 PM Agent - FE Preview scope confirmed on 2026-04-16
**Last Status Change**: 2026-04-16
**Source of Truth**: This document for Dashboard FE Preview product scope
**Blocking Reason**: -
**Project**: MIABOS
**Module ID**: M14
**Phase**: PB-02 / PB-03
**Priority**: P1
**Products**: MIA Smart / Platform
**Created by**: A02 Product Owner Agent
**Date**: 2026-04-16
**Document Role**: Canonical product definition for Business Analytics And ROI FE Preview scope

---

## 0. Executive Summary

- **What is being proposed**: Mở FE Preview cho dashboard analytics gồm Executive Dashboard, Business Performance, CRM/Funnel, AI ROI, và Promo Compare bằng mock/stub data.
- **Why now**: Dashboard giúp biến MIABOS từ chatbot thành operating intelligence layer, cho Business Owner/BQ review được cách đo ROI, hiệu quả CTKM, funnel, và vận hành trước khi có data thật.
- **Expected business and user outcome**: Ban điều hành đọc được top KPI trong ≤ 3s, Marketing so sánh CTKM, PM có AI ROI view để báo cáo pilot.
- **Recommended decision**: Build FE Preview dashboard bằng mock/stub data; production analytics vẫn là Phase 2 sau khi data model và integration ổn định.

## 1. Business Context

BQ đang tổng hợp báo cáo từ SAP B1, KiotViet, Haravan, Excel và nhiều kênh vận hành. Không có dashboard thống nhất, ban điều hành khó biết CTKM nào hiệu quả, chi nhánh nào underperform, funnel nào chuyển đổi tốt, và AI tạo ROI gì.

## 2. Target Users and Personas

| Persona | Role | Primary Pain | Desired Outcome | Priority |
|---------|------|--------------|-----------------|----------|
| Ban điều hành / Owner | Quyết định đầu tư/vận hành | Thiếu view tổng hợp | Top KPI và trend rõ | P0 |
| Regional Manager | Quản lý khu vực | Khó so sánh branch trong scope | Drill-down chi nhánh/kênh | P1 |
| Marketing / Sales Lead | Đánh giá CTKM/funnel | Thiếu conversion evidence | Promo/funnel comparison | P0 |
| PM | Báo cáo AI ROI | Không có số chứng minh pilot | AI success, escalation, lead metrics | P0 |

## 3. User Task Flow

| Step | Task | Task Type | Success Indicator |
|------|------|-----------|------------------|
| 1 | Mở Executive Dashboard | Reporting | 4 KPI chính render trong ≤ 3s |
| 2 | Click KPI cần xem sâu | Analysis | Điều hướng sang performance/funnel/AI ROI view |
| 3 | Chọn period/dimension | Analysis | Chart và table update đúng |
| 4 | Marketing chọn 2 CTKM để so sánh | Analysis | Promo Compare panel mở và readable |
| 5 | Export hoặc dùng dashboard trong meeting | Quick Action | Có mock export state và error handling |

## 4. Scope Boundaries

### In Scope

- FE Preview routes/screens: `/analytics/executive`, `/analytics/performance`, `/analytics/funnel`, `/analytics/ai-roi`.
- Mock states: healthy, warning, insufficient data, scope denied, snapshot pending, export fail/success.
- KPI set preview: Doanh thu, Đơn hàng, AI answer success, Escalation rate, sell-through, promo effectiveness, funnel conversion, lead capture, time saved.

### Out of Scope

- Aggregation pipeline thật.
- Export file thật nếu chưa có backend.
- Query trực tiếp SAP B1/KiotViet/Haravan.
- Final dashboard governance và KPI ownership của BQ.

## 5. Success Metrics

| Goal | KPI / Metric | Target | Source |
|------|--------------|--------|--------|
| Dashboard nhanh | Route load to KPI render | ≤ 3s preview | Runtime evidence |
| So sánh CTKM nhanh | Clicks to compare two promos | ≤ 5 clicks | UX review |
| Không hiểu sai data | Insufficient data never displays as `0` | 100% guarded | FE state review |
| Dễ báo cáo ROI | AI ROI metrics visible | Success/escalation/lead/time-saved cards | UXUI review |

## 6. Release Slice

| Slice | Goal | Included | Excluded | Dependency |
|-------|------|----------|----------|------------|
| FE Preview | Review dashboard IA, KPI hierarchy, states | `F-M14-BIZ-001` mock/stub | BE/API/real analytics | SRS Ready + UXUI Approved + STB |
| Production Analytics | Real data dashboard | Aggregation, M07 scope, export, retention | Forecasting | FE review + Integration Spec |

## 7. Open Questions

| ID | Question | Blocking? | Owner | Target Resolution |
|----|----------|-----------|-------|------------------|
| OQ-01 | KPI priority cuối cùng của BQ leadership | No for FE Preview; Yes for production | Business Owner / BQ Sponsor | Before Build Ready |
| OQ-02 | Scope matrix branch/region/channel khi M13 chưa xong | No for FE Preview; Yes for production | A03/A05 | Before Build Ready |
| OQ-03 | Export implementation strategy | No for FE Preview; Yes for production | A05/A08 | Before Build Ready |

## 8. Decision Log

| Date | Decision | Made By | Reason |
|------|----------|---------|--------|
| 2026-04-16 | Mở Dashboard FE Preview bằng mock/stub data | A01 PM | SRS/UXUI đủ scope preview; production data còn chặn |

## 9. Linked Artifacts

- Feature Registry: [Analysis/Features/_feature_registry.md](../../../Analysis/Features/_feature_registry.md)
- User Story: [US-M14-BIZ-001_Business_Analytics_And_ROI.md](../../Stories/Insights_And_Performance/US-M14-BIZ-001_Business_Analytics_And_ROI.md)
- Feature SRS: [F-M14-BIZ-001_Business_Analytics_And_ROI_SRS.md](../../../Analysis/Features/Modules/Insights_And_Performance/Business_Analytics_And_ROI/SRS/F-M14-BIZ-001_Business_Analytics_And_ROI_SRS.md)
- UXUI Spec: [UXUI-F-M14-BIZ-001_Business_Analytics_And_ROI.md](../../../Design/UXUI_Features/UXUI-F-M14-BIZ-001_Business_Analytics_And_ROI.md)
- Subtask Board: [STB-M14-BIZ-001_Business_Analytics_And_ROI_FE_Preview.md](../../Subtask_Boards/STB-M14-BIZ-001_Business_Analytics_And_ROI_FE_Preview.md)

## 10. Approval Checklist

- [x] Business case is explicit
- [x] Primary personas are identified
- [x] User Task Flow is complete
- [x] In-scope release slice is explicit
- [x] Success metrics are measurable
- [x] Open blockers are explicit and deferred to BE gate where appropriate

