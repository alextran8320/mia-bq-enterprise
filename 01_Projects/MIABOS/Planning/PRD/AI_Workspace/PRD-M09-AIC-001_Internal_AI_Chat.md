# PRD: M09 Internal AI Chat

**Status**: In Review
**Owner**: A02 Product Owner Agent
**Last Updated By**: Codex CLI (GPT-5.4 Codex environment)
**Last Reviewed By**: A01 PM Agent
**Approval Required**: Business Owner / PM Agent
**Approved By**: -
**Last Status Change**: 2026-04-21
**Source of Truth**: This document
**Blocking Reason**: Cần xác nhận phạm vi production, source priority, và escalation destination trước khi promote khỏi `In Review`
**Project**: MIABOS
**Module ID**: M09
**Phase**: PB-02 / PB-03
**Priority**: P0
**Products**: MIA Smart
**Created by**: A02 Product Owner Agent
**Date**: 2026-04-21
**Document Role**: Canonical product definition for business context, scope, and release intent

---

## 0. Executive Summary

- **What is being proposed**: xây `Internal AI Chat` như điểm vào tra cứu nội bộ thống nhất để nhân sự BQ hỏi nhanh về dữ liệu vận hành và tri thức nội bộ trong một luồng hội thoại có trust layer.
- **Why now**: BQ đang phụ thuộc mạnh vào một số cá nhân biết việc và phải mở nhiều hệ thống để trả lời câu hỏi nội bộ; đây là friction trực tiếp làm chậm vận hành.
- **Expected business and user outcome**: tăng tốc tra cứu nội bộ, giảm phụ thuộc vào người nắm tri thức rải rác, và tạo nền cho lớp AI nội bộ có thể được tin dùng thực tế.
- **Recommended decision**: giữ `M09` là surface P0 cho phase đầu, với trọng tâm business là `faster internal lookup + lower dependency on tribal knowledge`, còn execution detail sẽ follow theo capability packs phía sau.

## 1. Business Context

### 1.1 Background

BQ đang vận hành trên nhiều nguồn dữ liệu và nhiều lớp tri thức nội bộ cùng lúc: dữ liệu sản phẩm, đơn hàng, tồn kho, SOP, policy, hướng dẫn xử lý và các ngoại lệ vận hành. Khi nhân viên cần trả lời nhanh, họ phải dựa vào kinh nghiệm cá nhân, hỏi người biết việc, hoặc tự tra nhiều nguồn rời rạc.

### 1.2 Problem Statement

Hiện không có một điểm vào thống nhất để nhân viên BQ:
- hỏi nhanh câu hỏi nội bộ
- nhận câu trả lời có căn cứ
- biết khi nào câu trả lời đủ tin cậy để dùng
- biết khi nào phải hỏi tiếp hoặc escalte

Hệ quả là thời gian xử lý kéo dài, chất lượng trả lời không đồng đều, và tri thức doanh nghiệp bị “giam” trong một số người nắm kinh nghiệm.

### 1.3 Why This Matters

Nếu không giải bài toán này, MIABOS khó chứng minh giá trị ở vai trò “AI vận hành nội bộ”. `Internal AI Chat` là nơi biến tri thức và dữ liệu đã có thành năng lực sử dụng được hằng ngày, thay vì chỉ là kho lưu trữ hoặc integration layer.

### 1.4 Why Now

Đây là surface phù hợp nhất để chứng minh giá trị phase đầu vì:
- tác động trực tiếp lên tốc độ vận hành nội bộ
- gắn chặt với bài toán giảm phụ thuộc vào người biết việc
- tận dụng được nền tri thức `M08` và các module dữ liệu downstream mà không đòi hỏi phải expose quy trình quá rộng ra bên ngoài ngay

## 2. Target Users and Personas

| Persona | Role | Primary Pain | Desired Outcome | Priority |
|---------|------|--------------|-----------------|----------|
| Sales / cửa hàng | Tra cứu để tư vấn và xử lý tại điểm bán | Phải hỏi người khác hoặc mở nhiều hệ thống | Có câu trả lời nhanh, đủ tin để hành động | P0 |
| CSKH / Ecommerce Ops | Xử lý câu hỏi khách và tình huống vận hành | Không chắc nên tin nguồn nào | Có câu trả lời có trust signal và lối xử lý tiếp | P0 |
| Supervisor / Manager | Giám sát, hỗ trợ nghiệp vụ | Tri thức nằm trong người cũ, khó chuẩn hóa | Có điểm vào chung để giảm phụ thuộc cá nhân | P1 |

## 3. Jobs To Be Done

| Persona | Job To Be Done | Current Friction | Product Opportunity |
|---------|----------------|------------------|---------------------|
| Sales / CSKH | Hỏi nhanh một câu nội bộ và lấy được câu trả lời usable | Mở nhiều nơi, hỏi nhiều người, trả lời chậm | Chat-first lookup với trust layer |
| Supervisor | Chuẩn hóa cách trả lời đội vận hành | Mỗi người trả lời một kiểu | Một point of truth dùng chung trong công việc hằng ngày |
| Ops / business owner | Giảm phụ thuộc vào cá nhân giữ tri thức | Tribal knowledge khó chuyển giao | Biến tri thức phân tán thành surface AI có thể dùng lặp lại |

## 4. User Task Flows  ⚠ Mandatory

### Sales / CSKH / Operations

| Step | Task | Task Type | Success Indicator |
|------|------|-----------|------------------|
| 1 | Đặt câu hỏi nội bộ bằng ngôn ngữ tự nhiên | Quick Action | Có thể bắt đầu tra cứu ngay mà không cần biết nguồn nào đúng |
| 2 | Nhận kết luận sơ bộ từ hệ thống | Quick Action | Câu trả lời xuất hiện nhanh và dễ hiểu |
| 3 | Kiểm tra độ tin cậy của câu trả lời | Reporting | Có source / freshness / warning rõ |
| 4 | Quyết định dùng câu trả lời, hỏi tiếp, hoặc chuyển hướng xử lý | Exception Handling | Không bị dead-end khi câu trả lời chưa đủ |

### Supervisor / Manager

| Step | Task | Task Type | Success Indicator |
|------|------|-----------|------------------|
| 1 | Kiểm tra nhân viên có đang dùng được một điểm vào chung không | Reporting | Thấy route/chat flow đủ rõ để chuẩn hóa dùng nội bộ |
| 2 | Xem khi nào hệ thống tự tin hoặc không tự tin | Reporting | Có blocked / unsupported / warning states rõ |
| 3 | Dùng kết quả như lớp giảm phụ thuộc người biết việc | Reporting | Cùng một loại câu hỏi có câu trả lời nhất quán hơn |

## 5. Product Goals and Success Metrics

| Goal | KPI / Metric | Baseline | Target | Source |
|------|--------------|----------|--------|--------|
| Tăng tốc tra cứu nội bộ | Thời gian từ lúc đặt câu hỏi đến khi có kết luận usable | Hiện phụ thuộc người/hệ thống rời rạc | Giảm rõ rệt so với cách hỏi thủ công hiện tại; target cụ thể chốt ở pilot instrumentation | Runtime log / pilot measure |
| Giảm phụ thuộc người biết việc | Tỷ lệ câu hỏi nội bộ phổ biến có thể tự phục vụ qua chat | Chưa có | Tăng dần theo pilot, ưu tiên nhóm câu hỏi lặp lại cao | Usage / observability |
| Tăng niềm tin khi dùng AI nội bộ | Tỷ lệ câu trả lời có trust signal đầy đủ | Chưa có | 100% answer state có source/freshness/warning contract phù hợp | UX review / QA |
| Không tạo dead-end vận hành | Tỷ lệ blocked / unsupported cases có lối xử lý tiếp | Chưa có | 100% | UX review / QA |

## 6. Scope Boundaries

### 6.1 In Scope

- Một surface chat nội bộ thống nhất cho tra cứu và hỗ trợ quyết định nghiệp vụ
- Khả năng phân loại câu trả lời thành các nhóm như dữ liệu, chính sách, kết hợp, bị chặn, ngoài phạm vi
- Trust layer: freshness, warning, source trace, blocked reason
- Lối xử lý tiếp: feedback, retry, next action, history context

### 6.2 Out of Scope

- Tự động thực thi hành động nghiệp vụ xuyên hệ thống
- Ticket/case management production
- Escalation routing production
- Full permission model production cho toàn bộ tổ chức

### 6.3 Non-Goals

- Không phải chatbot chăm sóc khách hàng bên ngoài
- Không phải dashboard điều hành
- Không phải knowledge repository thuần túy

## 7. Release Slice and Sequencing

| Slice | Goal | Included Features | Excluded Features | Dependency |
|-------|------|-------------------|-------------------|------------|
| Phase 1 | Tạo điểm vào tra cứu nội bộ dùng được hằng ngày | internal chat shell, answer states, trust layer, next-step guidance | hành động tự động production, escalation production | M08 knowledge foundation + core data modules |
| Phase 1.5 | Tăng độ tin cậy và khả năng sử dụng lặp lại | better source priority, better history, observability | deep workflow automation | M07 / M12 / integration hardening |
| Phase 2 | Mở rộng từ hỏi-đáp sang hỗ trợ vận hành sâu hơn | richer action suggestions, routing, workflow tie-in | full autonomous actioning | technical + governance approval |

## 8. Linked Features

| Feature ID | Feature Name | Purpose | Priority | Planned Status |
|------------|--------------|---------|----------|----------------|
| `F-M09-AIC-001` | Internal AI Chat | Core internal lookup and answer experience | P0 | Legacy artifact / pending migration |
| `F-M09-AIC-002` | Answer History And Trust Review | Reuse and inspect prior answers | P1 | Legacy artifact / pending migration |
| `F-M09-AIC-003` | Escalation Trigger And Human Handoff | Tạo lối ra khi answer chưa đủ | P1 | Legacy artifact / pending migration |

## 9. Solution Direction

### 9.1 UX / IA Direction

`M09` phải là điểm vào trực tiếp cho công việc hằng ngày: hỏi nhanh, đọc nhanh, kiểm nhanh độ tin cậy, và quyết định bước tiếp. UX đi theo hướng answer-first, không buộc user phải hiểu cấu trúc hệ thống phía sau.

### 9.2 Functional Capabilities

- Internal question intake bằng ngôn ngữ tự nhiên
- Answer classification rõ ràng
- Trust and source review
- Support actions khi câu trả lời chưa đủ hoặc cần đào sâu
- Session-level history / review

### 9.3 Operational Rules

- Không trả lời mơ hồ khi hệ thống không đủ tự tin
- Không để user bị dead-end khi bị chặn hoặc ngoài phạm vi
- Mọi câu trả lời usable phải có trust contract tương ứng

### 9.4 Technical Constraints for Downstream Teams

- Cần source priority rõ giữa tri thức nội bộ và dữ liệu vận hành
- Cần definition rõ cho blocked / unsupported / stale behavior
- Cần gắn observability đủ để đo mục tiêu business “faster lookup / less dependency”

## 10. Assumptions and Dependencies

| ID | Assumption / Dependency | Risk if Wrong | Owner |
|----|-------------------------|---------------|-------|
| A-01 | M08 có thể cung cấp tri thức đủ dùng cho các câu hỏi nội bộ lặp lại | M09 chỉ thành shell chat đẹp nhưng không đủ giá trị | A02 / A03 |
| A-02 | Các module dữ liệu nền có thể feed được answer contract tối thiểu | Câu trả lời data thiếu độ tin cậy | A05 / A08 |
| A-03 | BQ sẵn sàng dùng M09 như điểm vào chung thay vì tiếp tục lệ thuộc cá nhân | Adoption thấp | PM / Business Owner |

## 11. Risks and Mitigations

| Risk | Type | Impact | Mitigation | Owner |
|------|------|--------|------------|-------|
| Chat trả lời nhanh nhưng không đủ tin cậy | Product | User bỏ dùng | Buộc trust layer và blocked behavior rõ | A06 / A05 |
| Tri thức vẫn nằm trong người biết việc, không được materialize đủ | Business | Không đạt mục tiêu giảm phụ thuộc | Ưu tiên knowledge/topic coverage cho nhóm câu hỏi lặp lại nhiều nhất | A02 / A03 |
| User hiểu M09 như công cụ “biết hết” | Adoption / Trust | Kỳ vọng sai | Rõ scope, uncertainty, escalation path | A01 / A06 |

## 12. Open Questions

| ID | Question | Blocking? | Owner | Target Resolution Date |
|----|----------|-----------|-------|------------------------|
| OQ-01 | Nhóm câu hỏi nội bộ P1 nào phải được cover trước để đạt business impact rõ nhất? | Yes | Business Owner / PM | 2026-04-22 |
| OQ-02 | Khi answer chưa đủ, destination escalation thực tế là gì? | Yes | PM / Ops | 2026-04-22 |
| OQ-03 | KPI baseline hiện tại cho thời gian tra cứu thủ công là bao nhiêu? | No nhưng cần cho pilot | PM / Data | 2026-04-23 |

## 13. Decision Log

| Date | Decision | Made By | Reason |
|------|----------|---------|--------|
| 2026-04-21 | Định vị lại PRD M09 theo business value `tăng tốc tra cứu nội bộ và giảm phụ thuộc người biết việc` | Business Owner / Codex | Chỉnh lại PRD theo đúng core value business thay vì mô tả front-end |

## 14. Linked Artifacts

- Feature Registry: [01_Projects/MIABOS/Analysis/Features/_feature_registry.md](../../../Analysis/Features/_feature_registry.md)
- User Stories:
- Feature SRS files:
  - [F-M09-AIC-001_Internal_AI_Chat_SRS.md](../../../Analysis/Features/Modules/AI_Workspace/Internal_AI_Chat/SRS/F-M09-AIC-001_Internal_AI_Chat_SRS.md)
- UXUI specs:
  - [UXUI-F-M09-AIC-001_Internal_AI_Chat.md](../../../Design/UXUI_Features/UXUI-F-M09-AIC-001_Internal_AI_Chat.md)
- Architecture / Integration Specs:
- Research / Evidence:
  - Front-end logic reference: `Build/Frontend_App/src/modules/ai-workspace/pages/InternalAIChatPage.tsx`

## 15. Approval Checklist

- [x] Business case is explicit
- [x] Primary personas are identified
- [x] User Task Flows are complete
- [x] In-scope release slice is explicit
- [ ] Success metrics are fully measurable
- [x] Major assumptions are recorded
- [x] Open blockers are explicit
- [ ] Business Owner approved this PRD
