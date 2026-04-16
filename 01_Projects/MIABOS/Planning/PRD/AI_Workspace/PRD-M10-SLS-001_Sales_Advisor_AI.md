# PRD: M10 Sales Advisor AI

**Status**: Approved
**Owner**: A02 Product Owner Agent
**Last Updated By**: Codex CLI (GPT-5.4 Codex environment)
**Last Reviewed By**: A01 PM Agent
**Approval Required**: Business Owner / PM Agent
**Approved By**: A01 PM Agent — Business Owner instructed execution on 2026-04-16
**Last Status Change**: 2026-04-16
**Source of Truth**: This document for product scope and release intent
**Blocking Reason**: -
**Project**: MIABOS
**Module ID**: M10
**Phase**: PB-02 / PB-03
**Priority**: P0
**Products**: MIA Smart
**Created by**: A02 Product Owner Agent
**Date**: 2026-04-16
**Document Role**: Canonical product definition for Sales Advisor AI FE Preview scope

---

## 0. Executive Summary

- **What is being proposed**: Mở FE Preview cho Sales Advisor AI để khách hàng Giày BQ có thể nhận gợi ý sản phẩm, range giá, ưu đãi public-safe, và CTA chuyển đổi trong một chat experience.
- **Why now**: Sau Internal AI Chat, đây là feature đối ngoại có giá trị demo cao nhất cho sales/conversion và dùng lại foundation product, availability, policy, CRM lead.
- **Expected business and user outcome**: Khách hàng đi từ nhu cầu mơ hồ sang gợi ý sản phẩm và CTA trong ≤ 3 câu discovery; BQ có bằng chứng sớm về sales-assist use case.
- **Recommended decision**: Build FE Preview bằng mock/stub data trước; chưa mở backend/integration thật cho đến khi FE Preview được review.

## 1. Business Context

### 1.1 Background

Giày BQ vận hành nhiều kênh retail và cần một lớp tư vấn bán hàng nhất quán cho website/Zalo/CSKH. Khách thường hỏi theo nhu cầu, ngân sách, size, khu vực và khuyến mãi; các câu trả lời phải đủ hữu ích nhưng không được lộ tồn kho chi tiết, giá nội bộ, hoặc cam kết sai.

### 1.2 Problem Statement

Tư vấn hiện phụ thuộc vào nhân sự và dữ liệu phân tán, khiến khách mất thời gian tự tìm sản phẩm hoặc chờ nhân viên xác nhận. Nếu AI trả lời không có boundary rõ, rủi ro lớn nhất là cam kết sai tồn/giá/khuyến mãi.

### 1.3 Why This Matters

Sales Advisor AI là bề mặt chuyển đổi trực tiếp: nó chứng minh MIABOS không chỉ là CRM nội bộ mà còn giúp BQ tạo lead và hỗ trợ quyết định mua.

### 1.4 Why Now

Business Owner đã yêu cầu chọn feature khác ngoài Chat nội bộ để tiếp tục build FE. `F-M10-SLS-001` đã có SRS và UXUI đủ sâu để mở FE Preview bằng mock/stub data.

## 2. Target Users and Personas

| Persona | Role | Primary Pain | Desired Outcome | Priority |
|---------|------|--------------|-----------------|----------|
| Khách hàng Giày BQ | Người mua tiềm năng | Không biết mẫu nào hợp, còn hàng hay có ưu đãi không | Nhận gợi ý và CTA nhanh | P0 |
| Sales / CSKH | Nhân viên hỗ trợ khách | Phải tra cứu thủ công nhiều nguồn | Có gợi ý và lead context để follow-up | P0 |
| Marketing / Trade Marketing | Người quản lý campaign | Khó biết CTA/chat tư vấn có tạo nhu cầu không | Có dữ liệu conversion để tối ưu | P1 |

## 3. Jobs To Be Done

| Persona | Job To Be Done | Current Friction | Product Opportunity |
|---------|----------------|------------------|---------------------|
| Khách hàng | Tìm sản phẩm phù hợp với nhu cầu và ngân sách | Tự lọc catalog mất thời gian | AI hỏi 1-3 câu rồi gợi ý |
| Sales / CSKH | Chuyển nhu cầu thành lead/action | Thiếu context chuẩn hóa | CTA lead/handoff có context |
| Marketing | Đánh giá hiệu quả tư vấn AI | Không có tracking thống nhất | Event `mia.sales.answer.generated`, `mia.lead.created` |

## 4. User Task Flows

### Khách hàng

| Step | Task | Task Type | Success Indicator |
|------|------|-----------|------------------|
| 1 | Mở chat tư vấn và nêu nhu cầu hoặc chọn quick reply | Quick Action | Chat shell load và nhận input |
| 2 | Trả lời tối đa 3 câu discovery | Quick Action | Hệ thống có đủ context tối thiểu |
| 3 | Đọc suggestion card gồm sản phẩm, rationale, range giá, availability note | Quick Action | Suggestion render trong ≤ 4s |
| 4 | Chọn CTA: xem sản phẩm, để lại thông tin, gặp nhân viên, hoặc hỏi tiếp | Quick Action | CTA không tạo dead-end |

### Sales / CSKH

| Step | Task | Task Type | Success Indicator |
|------|------|-----------|------------------|
| 1 | Dùng conversation context để hiểu nhu cầu khách | Quick Action | Need summary rõ |
| 2 | Xem suggestion và warning public-safe | Exception Handling | Không dùng thông tin nhạy cảm sai scope |
| 3 | Tạo lead/handoff khi khách sẵn sàng | Quick Action | Lead payload đủ tên/SĐT/context |

## 5. Product Goals and Success Metrics

| Goal | KPI / Metric | Baseline | Target | Source |
|------|--------------|----------|--------|--------|
| Tư vấn nhanh | Time to first suggestion | Chưa có | ≤ 4s cho 95% query preview | FE Preview instrumentation |
| Giảm friction | Discovery question count | Chưa có | ≤ 3 câu trước suggestion | Chat state |
| Tạo chuyển đổi | CTA click-through | Chưa có | ≥ 20% pilot target | `mia.sales.answer.generated` / CTA click |
| Giữ an toàn | Sensitive answer leak | 0 tolerance | 100% sensitive mock cases blocked | SRS / FE states |

## 6. Scope Boundaries

### 6.1 In Scope

- FE Preview route `/sales-advisor` với mock/stub data.
- States: welcome, discovery, suggestion, low-confidence availability, blocked, no-match, lead capture, lead submitted, error.
- Copy tiếng Việt theo UXUI §6.
- Mock CTA set phase 1: `Xem sản phẩm`, `Để lại thông tin`, `Gặp nhân viên tư vấn`, `Hỏi câu khác`.

### 6.2 Out of Scope

- Kết nối backend thật.
- Tạo lead thật trong CRM.
- Pricing/promotion/availability source-priority thật.
- Channel routing thật sang store owner hoặc sales owner.

### 6.3 Non-Goals

- Không thay thế ecommerce product detail page.
- Không hiển thị tồn kho số lượng chi tiết.
- Không expose ERP/internal pricing fields.

## 7. Release Slice and Sequencing

| Slice | Goal | Included Features | Excluded Features | Dependency |
|-------|------|-------------------|-------------------|------------|
| FE Preview | Review UI/flow và conversion path | `F-M10-SLS-001` mock/stub | BE/API/CRM real integration | SRS Ready + UXUI Approved + STB |
| Integration | Kết nối API và lead handoff thật | `F-M10-SLS-003`, API contracts | Full automation | FE Preview reviewed + Integration Spec |

## 8. Linked Features

| Feature ID | Feature Name | Purpose | Priority | Planned Status |
|------------|--------------|---------|----------|----------------|
| `F-M10-SLS-001` | Sales Advisor AI | Chat tư vấn bán hàng external public-safe | P0 | FE Preview |
| `F-M10-SLS-003` | Lead Capture and CTA Handoff | Tạo lead/handoff thật | P0 | Later integration |
| `F-M07-SEC-001` | Access Control and Sensitivity | Public-safe boundary | P0 | Dependency |
| `F-M08-KNW-001` | Knowledge and Policy | Public-safe policy source | P0 | Dependency |

## 9. Solution Direction

### 9.1 UX / IA Direction

Một route/widget chat tập trung vào task tư vấn. Primary experience là chat thread + quick replies + suggestion cards; không dùng dashboard hay form dài.

### 9.2 Functional Capabilities

- Need-discovery qua quick reply chips.
- Suggestion cards có rationale, price band, promo/policy note, availability wording.
- Blocked state thân thiện cho sensitive questions.
- Inline lead capture form tối thiểu.

### 9.3 Operational Rules

- Không quá 3 câu discovery trước suggestion đầu tiên.
- Không cam kết số tồn kho khi confidence thấp.
- Không dùng policy chưa public-safe.
- Block sensitive questions và đưa CTA thay thế.

### 9.4 Technical Constraints for Downstream Teams

- FE Preview dùng mock/stub only.
- Không invent endpoint thật ngoài contract excerpt trong SRS.
- Backend/integration chỉ mở sau FE Preview review và Integration Spec approved.

## 10. Assumptions and Dependencies

| ID | Assumption / Dependency | Risk if Wrong | Owner |
|----|-------------------------|---------------|-------|
| DEP-01 | Product projection có thể được mock đủ cho preview | Preview thiếu realism | A07 |
| DEP-02 | Public-safe wording trong UXUI được PM chấp nhận cho review | Copy phải sửa lại | A06/A01 |
| DEP-03 | Lead form phase 1 chỉ cần tên + SĐT | Form quá tối giản cho sales thật | A02/A03 |

## 11. Risks and Mitigations

| Risk | Type | Impact | Mitigation | Owner |
|------|------|--------|------------|-------|
| Preview bị hiểu nhầm là đã tích hợp real data | Scope | Kỳ vọng sai | Label/mock notes trong STB và final handoff | A01 |
| Availability wording quá cam kết | Business | Rủi ro vận hành | Dùng confidence wording từ UXUI | A07 |
| Chat UI giống Internal AI Chat quá nhiều | UX | Không phù hợp external customer | Dùng Sales Advisor copy, CTA, lead form riêng | A06/A07 |

## 12. Open Questions

| ID | Question | Blocking? | Owner | Target Resolution Date |
|----|----------|-----------|-------|------------------------|
| OQ-01 | Channel routing thật cho lead sang CRM/store owner | No for FE Preview; Yes for BE | A05/A08 | Before Build Ready |
| OQ-02 | Source priority thật cho price/promo/availability | No for FE Preview; Yes for BE | A05/A03 | Before Build Ready |

## 13. Decision Log

| Date | Decision | Made By | Reason |
|------|----------|---------|--------|
| 2026-04-16 | Chọn `F-M10-SLS-001 Sales Advisor AI` làm feature FE tiếp theo ngoài Internal AI Chat | Business Owner / A01 PM | Có UXUI/SRS gần nhất và giá trị demo sales rõ |
| 2026-04-16 | Build FE Preview bằng mock/stub trước, chưa mở backend thật | A01 PM | Giữ đúng gate FE Preview trước Integration Spec |

## 14. Linked Artifacts

- Feature Registry: [Analysis/Features/_feature_registry.md](../../../Analysis/Features/_feature_registry.md)
- User Story: [US-M10-SLS-001_Sales_Advisor_AI.md](../../Stories/AI_Workspace/US-M10-SLS-001_Sales_Advisor_AI.md)
- Feature SRS: [F-M10-SLS-001_Sales_Advisor_AI_SRS.md](../../../Analysis/Features/Modules/AI_Workspace/Sales_Advisor_AI/SRS/F-M10-SLS-001_Sales_Advisor_AI_SRS.md)
- UXUI Spec: [UXUI-F-M10-SLS-001_Sales_Advisor_AI.md](../../../Design/UXUI_Features/UXUI-F-M10-SLS-001_Sales_Advisor_AI.md)
- Subtask Board: [STB-M10-SLS-001_Sales_Advisor_AI_FE_Preview.md](../../Subtask_Boards/STB-M10-SLS-001_Sales_Advisor_AI_FE_Preview.md)

## 15. Approval Checklist

- [x] Business case is explicit
- [x] Primary personas are identified
- [x] User Task Flows are complete
- [x] In-scope release slice is explicit
- [x] Success metrics are measurable
- [x] Major assumptions are recorded
- [x] Open blockers are explicit and deferred to BE gate where appropriate
- [x] Business Owner instructed execution for this path on 2026-04-16
