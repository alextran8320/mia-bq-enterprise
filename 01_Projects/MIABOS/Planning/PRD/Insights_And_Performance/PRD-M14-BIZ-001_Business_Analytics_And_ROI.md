# PRD: M14 Business Analytics And ROI

**Status**: In Review
**Owner**: A02 Product Owner Agent
**Last Updated By**: Codex CLI (GPT-5.4 Codex environment)
**Last Reviewed By**: A01 PM Agent
**Approval Required**: Business Owner / PM Agent
**Approved By**: -
**Last Status Change**: 2026-04-21
**Source of Truth**: This document
**Blocking Reason**: Cần chốt KPI ownership và baseline đo AI ROI trước khi promote
**Project**: MIABOS
**Module ID**: M14
**Phase**: PB-02 / PB-03
**Priority**: P1
**Products**: MIA Smart / Platform
**Created by**: A02 Product Owner Agent
**Date**: 2026-04-21
**Document Role**: Canonical product definition for business context, scope, and release intent

---

## 0. Executive Summary

- **What is being proposed**: xây `M14` như dashboard điều hành cho BQ leadership, đồng thời là bề mặt đo hiệu quả AI/ROI cho các surface MIABOS.
- **Why now**: nếu không có lớp dashboard điều hành, giá trị AI và hiệu quả vận hành sẽ khó được nhìn thấy, khó quyết định ưu tiên đầu tư, và khó chứng minh ROI.
- **Expected business and user outcome**: lãnh đạo BQ có được góc nhìn điều hành tập trung; PM/vận hành có được góc nhìn đo hiệu quả AI/ROI trong cùng một dashboard family.
- **Recommended decision**: định vị `M14` là module điều hành và đo lường, với 2 core value cùng tồn tại: `dashboard cho leadership` và `dashboard đo AI/ROI`.

## 1. Business Context

### 1.1 Background

BQ đang cần nhìn thấy hiệu quả vận hành và hiệu quả AI theo cách dễ đọc, dễ so sánh, và hỗ trợ quyết định. Khi dữ liệu, hoạt động bán hàng, conversion funnel, và tín hiệu AI nằm rải ở nhiều nơi, việc điều hành sẽ chậm và việc chứng minh AI có tạo ra giá trị hay không sẽ luôn mơ hồ.

### 1.2 Problem Statement

Hiện thiếu một bề mặt điều hành thống nhất để:
- lãnh đạo đọc KPI trọng yếu nhanh
- so sánh hiệu quả kinh doanh/funnel
- nhìn riêng được hiệu quả AI/ROI

Không có lớp này, MIABOS khó trở thành công cụ điều hành thực sự và khó chứng minh business impact.

### 1.3 Why This Matters

`M14` là nơi nối execution với decision-making:
- với leadership, đây là lớp nhìn tổng thể để ra quyết định
- với PM/vận hành AI, đây là nơi nhìn ra AI có đang tạo lead, giảm tải hay tiết kiệm thời gian không

### 1.4 Why Now

Ngay từ giai đoạn đầu, cần một lớp đo lường và kể câu chuyện giá trị. Nếu không, các module AI sẽ bị nhìn như demo rời rạc chứ không phải capability có thể chứng minh hiệu quả.

## 2. Target Users and Personas

| Persona | Role | Primary Pain | Desired Outcome | Priority |
|---------|------|--------------|-----------------|----------|
| BQ Leadership / Owner | Ra quyết định điều hành | Thiếu view tổng hợp dễ đọc | Có dashboard leadership tập trung | P0 |
| PM / Vận hành AI | Đo hiệu quả AI | Khó chứng minh ROI | Có view riêng cho AI signals và ROI | P0 |
| Sales / Marketing Lead | Theo dõi hiệu quả funnel và kinh doanh | Dữ liệu phân tán, khó so sánh | Có góc nhìn theo performance/funnel | P1 |

## 3. Jobs To Be Done

| Persona | Job To Be Done | Current Friction | Product Opportunity |
|---------|----------------|------------------|---------------------|
| Leadership | Đọc nhanh tình hình kinh doanh và tín hiệu vận hành | KPI nằm rời rạc | Executive dashboard |
| PM / AI Ops | Chứng minh AI có giá trị business | Không có lớp đo tập trung | AI ROI dashboard |
| Sales / Marketing Lead | So sánh hiệu quả performance/funnel | Khó đối chiếu cùng một nơi | Multi-view dashboard family |

## 4. User Task Flows  ⚠ Mandatory

### Leadership

| Step | Task | Task Type | Success Indicator |
|------|------|-----------|------------------|
| 1 | Mở dashboard điều hành | Reporting | Vào được view executive với KPI trọng yếu |
| 2 | Đọc nhanh top KPI và trạng thái hệ thống | Reporting | Biết ngay bức tranh vận hành hiện tại |
| 3 | Chuyển sang góc nhìn sâu hơn nếu cần | Reporting | Có route/tab để drill sang performance hoặc funnel |

### PM / AI Ops

| Step | Task | Task Type | Success Indicator |
|------|------|-----------|------------------|
| 1 | Mở view AI ROI | Reporting | Có góc nhìn riêng cho AI signals |
| 2 | So sánh tín hiệu AI với business outcome | Reporting | Nhìn được success/escalation/lead/time-saved |
| 3 | Dùng kết quả để báo cáo và tối ưu | Reporting | Có bề mặt đủ rõ để kể câu chuyện ROI |

## 5. Product Goals and Success Metrics

| Goal | KPI / Metric | Baseline | Target | Source |
|------|--------------|----------|--------|--------|
| Tạo dashboard điều hành usable | Tỷ lệ KPI leadership trọng yếu được gom vào một dashboard family | Chưa có | 100% KPI P1 được surface ở lớp điều hành | Dashboard definition |
| Đo được AI ROI | Có bộ chỉ số AI/ROI đủ dùng cho pilot review | Chưa có | Có view AI ROI riêng với metric set thống nhất | M14 / observability |
| Giảm thời gian tổng hợp báo cáo | Thời gian để leadership/PM đọc bức tranh chính | Chưa có baseline chuẩn | Giảm đáng kể so với cách tổng hợp thủ công | Ops / PM review |

## 6. Scope Boundaries

### 6.1 In Scope

- Dashboard family cho leadership và AI/ROI measurement
- Nhiều view phục vụ các góc nhìn khác nhau
- KPI summary, comparison, funnel, và AI signal surfaces
- Export/reporting intent ở mức route và interaction baseline

### 6.2 Out of Scope

- Forecasting sâu
- Analytics production pipeline hoàn chỉnh
- Transaction-level investigation workflow
- Enterprise BI replacement

### 6.3 Non-Goals

- Không phải chỉ là dashboard marketing
- Không phải chỉ là dashboard AI
- Không phải công cụ phân tích ad hoc full-featured

## 7. Release Slice and Sequencing

| Slice | Goal | Included Features | Excluded Features | Dependency |
|-------|------|-------------------|-------------------|------------|
| Phase 1 | Tạo dashboard leadership + AI ROI narrative | executive, performance, funnel, ai-roi views | forecasting, deep export, transaction drill-down | agreed KPI set |
| Phase 1.5 | Tăng chất lượng đo lường | cleaner KPI governance, stronger AI metrics mapping | full enterprise BI | M12 / observability / data model |
| Phase 2 | Mở rộng chiều sâu phân tích | richer drill-down, broader ROI model | full ad hoc analytics | architecture + governance readiness |

## 8. Linked Features

| Feature ID | Feature Name | Purpose | Priority | Planned Status |
|------------|--------------|---------|----------|----------------|
| `F-M14-BIZ-001` | Business Analytics And ROI | Leadership dashboard + AI ROI measurement | P0 | Legacy artifact / pending migration |
| `F-M12-OBS-001` | Audit And Observability | Feed measurement signals | P1 | Legacy artifact / pending migration |

## 9. Solution Direction

### 9.1 UX / IA Direction

`M14` phải là dashboard family có nhiều góc nhìn nhưng một mental model thống nhất: điều hành, performance, funnel, AI ROI. Không nên để leadership và AI measurement tách thành hai sản phẩm rời.

### 9.2 Functional Capabilities

- Executive overview
- Performance comparison
- Funnel view
- AI ROI view
- Export/reporting baseline

### 9.3 Operational Rules

- Leadership dashboard và AI ROI phải cùng sống trong một module
- Hệ thống phải nói rõ trạng thái dữ liệu, không chỉ hiển thị KPI đẹp
- AI ROI phải đo được contribution chứ không chỉ hiển thị vanity metrics

### 9.4 Technical Constraints for Downstream Teams

- Cần metric ownership rõ
- Cần baseline trước khi kết luận ROI
- Cần mapping giữa AI signals và business outcomes

## 10. Assumptions and Dependencies

| ID | Assumption / Dependency | Risk if Wrong | Owner |
|----|-------------------------|---------------|-------|
| A-01 | BQ leadership đồng ý một KPI set trọng yếu cho phase 1 | Dashboard quá rộng hoặc không dùng được | PM / Business Owner |
| A-02 | AI signals có thể được map sang business outcome | AI ROI thành vanity dashboard | PM / Data / A05 |
| A-03 | M14 được dùng như lớp review điều hành, không bị đòi thành full BI quá sớm | Scope blow-up | A01 / A02 |

## 11. Risks and Mitigations

| Risk | Type | Impact | Mitigation | Owner |
|------|------|--------|------------|-------|
| Dashboard nhiều view nhưng không rõ người dùng chính | Product | Không adoption | Chốt leadership + AI ROI là 2 trục chính | A02 / A01 |
| AI ROI không có baseline đáng tin | Measurement | Kể sai câu chuyện giá trị | Chốt baseline và metric ownership sớm | PM / Data |
| Dashboard bị hiểu là chỉ để demo | Business | Không trở thành công cụ điều hành thật | Gắn chặt KPI leadership và review cadence | PM / Business Owner |

## 12. Open Questions

| ID | Question | Blocking? | Owner | Target Resolution Date |
|----|----------|-----------|-------|------------------------|
| OQ-01 | Bộ KPI leadership P1 chốt cuối gồm những gì? | Yes | Business Owner / PM | 2026-04-22 |
| OQ-02 | Bộ metric AI ROI nào được coi là đủ để review pilot? | Yes | PM / Data | 2026-04-22 |
| OQ-03 | Ai sở hữu từng metric và nguồn dữ liệu tương ứng? | No nhưng cần sớm | PM / Data / Ops | 2026-04-23 |

## 13. Decision Log

| Date | Decision | Made By | Reason |
|------|----------|---------|--------|
| 2026-04-21 | Định vị lại PRD M14 theo 2 core value: `dashboard điều hành cho BQ leadership` và `dashboard đo hiệu quả AI/ROI` | Business Owner / Codex | Chỉnh PRD về đúng business framing |

## 14. Linked Artifacts

- Feature Registry: [01_Projects/MIABOS/Analysis/Features/_feature_registry.md](../../../Analysis/Features/_feature_registry.md)
- User Stories:
- Feature SRS files:
  - [F-M14-BIZ-001_Business_Analytics_And_ROI_SRS.md](../../../Analysis/Features/Modules/Insights_And_Performance/Business_Analytics_And_ROI/SRS/F-M14-BIZ-001_Business_Analytics_And_ROI_SRS.md)
- UXUI specs:
  - [UXUI-F-M14-BIZ-001_Business_Analytics_And_ROI.md](../../../Design/UXUI_Features/UXUI-F-M14-BIZ-001_Business_Analytics_And_ROI.md)
- Architecture / Integration Specs:
- Research / Evidence:
  - Front-end logic reference: `Build/Lark_MIA_Web/src/modules/insights-performance/pages/BusinessAnalyticsPage.tsx`

## 15. Approval Checklist

- [x] Business case is explicit
- [x] Primary personas are identified
- [x] User Task Flows are complete
- [x] In-scope release slice is explicit
- [ ] Success metrics are fully measurable
- [x] Major assumptions are recorded
- [x] Open blockers are explicit
- [ ] Business Owner approved this PRD
