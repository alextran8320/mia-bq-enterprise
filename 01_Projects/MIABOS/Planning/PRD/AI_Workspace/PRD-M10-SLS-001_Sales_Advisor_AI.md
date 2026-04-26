# PRD: M10 Sales Advisor AI

**Status**: In Review
**Owner**: A02 Product Owner Agent
**Last Updated By**: Codex CLI (GPT-5.4 Codex environment)
**Last Reviewed By**: A01 PM Agent
**Approval Required**: Business Owner / PM Agent
**Approved By**: -
**Last Status Change**: 2026-04-21
**Source of Truth**: This document
**Blocking Reason**: Cần chốt KPI baseline và integration ownership cho lead handoff trước khi promote
**Project**: MIABOS
**Module ID**: M10
**Phase**: PB-02 / PB-03
**Priority**: P0
**Products**: MIA Smart
**Created by**: A02 Product Owner Agent
**Date**: 2026-04-21
**Document Role**: Canonical product definition for business context, scope, and release intent

---

## 0. Executive Summary

- **What is being proposed**: xây `Sales Advisor AI` như surface tư vấn bán hàng có khả năng chuyển nhu cầu mơ hồ thành gợi ý sản phẩm và CTA chuyển đổi.
- **Why now**: đây là lớp AI đối ngoại có thể tác động trực tiếp lên lead capture và conversion, đồng thời giảm tải cho đội sales/CSKH ở các câu hỏi lặp lại.
- **Expected business and user outcome**: tăng lead capture / conversion và giảm khối lượng xử lý thủ công cho sales/CSKH ở giai đoạn discovery ban đầu.
- **Recommended decision**: định vị `M10` là module tăng trưởng P0/P1, với KPI business chính là conversion/lead capture, và KPI vận hành song song là giảm tải cho sales/CSKH.

## 1. Business Context

### 1.1 Background

Trong bối cảnh BQ bán hàng đa kênh, một lượng lớn tương tác đầu vào của khách hàng là các câu hỏi lặp lại: tìm loại giày phù hợp, khoảng giá, ưu đãi, mức độ sẵn sàng của hàng, và bước tiếp theo nên làm gì. Nếu tất cả đều đổ trực tiếp vào sales/CSKH, chi phí hỗ trợ cao và lead nóng dễ bị mất.

### 1.2 Problem Statement

BQ cần một lớp tư vấn AI đủ tốt để:
- xử lý phần discovery ban đầu thay cho con người ở các câu hỏi lặp lại
- tạo động lực chuyển đổi sớm hơn
- thu lại lead hoặc đẩy khách sang bước tiếp theo một cách có cấu trúc

Nếu không có lớp này, conversion phụ thuộc quá nhiều vào phản hồi thủ công và năng lực từng nhân viên.

### 1.3 Why This Matters

`M10` là surface kết nối trực tiếp giữa năng lực AI và doanh thu:
- nếu làm tốt, nó tạo lead nhiều hơn và nhanh hơn
- đồng thời, nó giảm áp lực cho sales/CSKH ở phần discovery sơ cấp

Đây là nơi MIABOS thể hiện giá trị không chỉ ở “AI biết trả lời” mà ở “AI giúp tạo cơ hội bán hàng”.

### 1.4 Why Now

Sau khi đã có tư duy answer-first nội bộ ở `M09`, `M10` là bước tự nhiên để chuyển năng lực đó thành giá trị tăng trưởng. Đây cũng là bề mặt dễ demo cho stakeholder vì thấy rõ path từ nhu cầu -> gợi ý -> CTA -> lead.

## 2. Target Users and Personas

| Persona | Role | Primary Pain | Desired Outcome | Priority |
|---------|------|--------------|-----------------|----------|
| Khách hàng tiềm năng | Tìm sản phẩm phù hợp | Không biết bắt đầu từ đâu, phải hỏi nhiều lần | Nhận gợi ý nhanh và có bước đi tiếp rõ | P0 |
| Sales / CSKH | Chuyển nhu cầu thành lead / cơ hội bán | Phải trả lời lặp lại nhiều câu discovery | Giảm tải phần tư vấn sơ cấp | P0 |
| Marketing / Growth | Tăng lead và conversion | Khó đo hiệu quả AI trong funnel đầu | Có surface tạo lead có thể tối ưu | P1 |

## 3. Jobs To Be Done

| Persona | Job To Be Done | Current Friction | Product Opportunity |
|---------|----------------|------------------|---------------------|
| Khách hàng | Tìm nhanh lựa chọn phù hợp | Cần tự lọc catalog hoặc chờ nhân viên trả lời | AI-guided discovery + suggestion + CTA |
| Sales / CSKH | Nhận đầu vào đã được làm ấm tốt hơn | Phải lặp lại cùng một bộ câu hỏi ban đầu | AI xử lý pre-qualification và thu lead |
| Marketing / Growth | Đo xem lớp tư vấn AI có tạo giá trị tăng trưởng không | Chưa có bề mặt rõ để theo dõi | Conversion surface gắn với lead capture |

## 4. User Task Flows  ⚠ Mandatory

### Khách hàng tiềm năng

| Step | Task | Task Type | Success Indicator |
|------|------|-----------|------------------|
| 1 | Nêu nhu cầu hoặc chọn hướng tư vấn ban đầu | Quick Action | Có thể bắt đầu dễ dàng mà không cần biết catalog |
| 2 | Trả lời một số câu discovery ngắn | Quick Action | Không bị hỏi quá dài dòng |
| 3 | Xem gợi ý sản phẩm / khoảng giá / note phù hợp | Reporting | Có output đủ để tiếp tục ra quyết định |
| 4 | Chọn CTA tiếp theo | Quick Action | Có đường đi tiếp rõ ràng |

### Sales / CSKH

| Step | Task | Task Type | Success Indicator |
|------|------|-----------|------------------|
| 1 | Nhận khách đã qua lớp discovery sơ bộ | Reporting | Context khách rõ hơn khi tiếp nhận |
| 2 | Dùng lead / intent signal để follow-up | Quick Action | Giảm thời gian hỏi lại từ đầu |
| 3 | Tập trung vào closing thay vì lặp lại tư vấn sơ cấp | Reporting | Giảm tải câu hỏi lặp lại |

## 5. Product Goals and Success Metrics

| Goal | KPI / Metric | Baseline | Target | Source |
|------|--------------|----------|--------|--------|
| Tăng chuyển đổi | Lead capture / CTA conversion rate | Chưa có baseline chuẩn | KPI chính của module; target chốt ở pilot instrumentation | Product analytics / M14 |
| Giảm tải cho sales/CSKH | Tỷ lệ câu discovery sơ cấp được AI hấp thụ | Chưa có | Tăng dần theo pilot | Ops / observability |
| Tạo gợi ý usable | Tỷ lệ session có suggestion đủ rõ để user chọn CTA tiếp | Chưa có | Cao hơn baseline chat FAQ thông thường | Product analytics |
| Không overpromise | Tỷ lệ response vi phạm safety boundary | Chưa có | 0 tolerance | QA / audit |

## 6. Scope Boundaries

### 6.1 In Scope

- Surface tư vấn bán hàng dựa trên discovery ngắn
- Suggestion cards có định hướng mua hàng
- CTA chuyển đổi / để lại lead / gặp tư vấn
- Boundary an toàn khi câu hỏi đi vào vùng không nên cam kết

### 6.2 Out of Scope

- Checkout hoàn chỉnh
- CRM writeback production
- Full routing production cho lead
- Cam kết tồn kho chi tiết theo thời gian thực

### 6.3 Non-Goals

- Không thay thế hoàn toàn sales con người
- Không là catalog browser truyền thống
- Không là chatbot chăm sóc sau bán

## 7. Release Slice and Sequencing

| Slice | Goal | Included Features | Excluded Features | Dependency |
|-------|------|-------------------|-------------------|------------|
| Phase 1 | Tạo lớp tư vấn AI có khả năng generate lead | discovery, suggestions, CTA, lead capture baseline, safety boundary | CRM writeback production, routing production | M01-M04 data signals + M08 policy guardrails |
| Phase 1.5 | Tăng hiệu quả chuyển đổi và giảm tải | better scenario coverage, intent quality, handoff quality | full sales automation | M14 measurement + ops tuning |
| Phase 2 | Tích hợp sâu hơn vào funnel bán hàng | real routing, CRM tie-in, richer qualification | closing automation | architecture + governance approval |

## 8. Linked Features

| Feature ID | Feature Name | Purpose | Priority | Planned Status |
|------------|--------------|---------|----------|----------------|
| `F-M10-SLS-001` | Sales Advisor AI | AI-guided product suggestion and CTA path | P0 | Legacy artifact / pending migration |
| `F-M10-SLS-002` | Suggested Actions And Next Best Action | Tăng chất lượng bước tiếp theo | P1 | Legacy artifact / pending migration |
| `F-M10-SLS-003` | Lead Capture And CTA Handoff | Thu lead và chuyển cơ hội bán | P0 | Legacy artifact / pending migration |

## 9. Solution Direction

### 9.1 UX / IA Direction

`M10` phải dẫn dắt user theo hướng discovery ngắn, sau đó nhanh chóng tạo “đề xuất + CTA” thay vì nhốt user trong hội thoại dài. Đây là bề mặt conversion, không phải bề mặt khám phá vô tận.

### 9.2 Functional Capabilities

- Discovery intake
- Suggestion cards
- CTA path
- Lead capture
- Safety boundary

### 9.3 Operational Rules

- KPI ưu tiên số 1 là conversion / lead capture
- KPI song song là giảm tải câu hỏi discovery cho sales/CSKH
- Không được dùng wording tạo cam kết vượt quá độ chắc chắn của dữ liệu

### 9.4 Technical Constraints for Downstream Teams

- Cần analytics rõ để đo CTA / lead capture / drop-off
- Cần link chặt với pricing/promo/policy guardrails
- Cần boundary rõ cho blocked / warning / low-confidence states

## 10. Assumptions and Dependencies

| ID | Assumption / Dependency | Risk if Wrong | Owner |
|----|-------------------------|---------------|-------|
| A-01 | User sẵn sàng đi qua discovery ngắn để nhận gợi ý tốt hơn | Drop-off cao | A02 / A06 |
| A-02 | Sales/CSKH có thể tiếp nhận lead ở chất lượng “pre-qualified” vừa đủ | Lead không dùng được | PM / Ops |
| A-03 | M01-M04 và M08 cung cấp đủ product/policy signals để tạo gợi ý đáng tin | Suggestion kém chất lượng | A03 / A05 |

## 11. Risks and Mitigations

| Risk | Type | Impact | Mitigation | Owner |
|------|------|--------|------------|-------|
| AI gợi ý nhiều nhưng không tạo lead | Business | Không đạt KPI chính | Theo dõi CTA funnel, tối ưu scenario và CTA copy | A02 / Marketing |
| Tăng lead nhưng không giảm tải sales | Ops | Không đạt mục tiêu kép | Tối ưu discovery để giảm phần hỏi lặp lại | PM / Ops |
| Overpromise về hàng hóa / ưu đãi | Trust / Business | Mất niềm tin, rủi ro vận hành | Safety boundary + confidence wording | A06 / A05 |

## 12. Open Questions

| ID | Question | Blocking? | Owner | Target Resolution Date |
|----|----------|-----------|-------|------------------------|
| OQ-01 | Định nghĩa chính thức của `lead capture` cho pilot là gì? | Yes | Business Owner / PM | 2026-04-22 |
| OQ-02 | Sales/CSKH muốn nhận loại context tối thiểu nào khi AI handoff? | Yes | PM / Ops | 2026-04-22 |
| OQ-03 | Baseline hiện tại cho conversion và workload sales/CSKH là bao nhiêu? | No nhưng cần để đo ROI | PM / Data | 2026-04-23 |

## 13. Decision Log

| Date | Decision | Made By | Reason |
|------|----------|---------|--------|
| 2026-04-21 | Định vị lại PRD M10 theo mục tiêu kép `tăng conversion/lead capture` và `giảm tải cho sales/CSKH` | Business Owner / Codex | Chỉnh PRD về đúng business value, front-end chỉ dùng để hiểu logic hiện tại |

## 14. Linked Artifacts

- Feature Registry: [01_Projects/MIABOS/Analysis/Features/_feature_registry.md](../../../Analysis/Features/_feature_registry.md)
- User Stories:
- Feature SRS files:
  - [F-M10-SLS-001_Sales_Advisor_AI_SRS.md](../../../Analysis/Features/Modules/AI_Workspace/Sales_Advisor_AI/SRS/F-M10-SLS-001_Sales_Advisor_AI_SRS.md)
- UXUI specs:
  - [UXUI-F-M10-SLS-001_Sales_Advisor_AI.md](../../../Design/UXUI_Features/UXUI-F-M10-SLS-001_Sales_Advisor_AI.md)
- Architecture / Integration Specs:
- Research / Evidence:
  - Front-end logic reference: `Build/Lark_MIA_Web/src/modules/ai-workspace/pages/SalesAdvisorPage.tsx`

## 15. Approval Checklist

- [x] Business case is explicit
- [x] Primary personas are identified
- [x] User Task Flows are complete
- [x] In-scope release slice is explicit
- [ ] Success metrics are fully measurable
- [x] Major assumptions are recorded
- [x] Open blockers are explicit
- [ ] Business Owner approved this PRD
