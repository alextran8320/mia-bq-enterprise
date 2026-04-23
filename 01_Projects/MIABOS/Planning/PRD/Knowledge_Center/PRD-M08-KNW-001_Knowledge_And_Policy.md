# PRD: M08 Knowledge Center Workspace

**Status**: In Review
**Owner**: A02 Product Owner Agent
**Last Updated By**: Codex CLI (GPT-5.4 Codex environment)
**Last Reviewed By**: A01 PM Agent
**Approval Required**: Business Owner / PM Agent
**Approved By**: -
**Last Status Change**: 2026-04-21
**Source of Truth**: This document
**Blocking Reason**: Cần xác nhận phạm vi governance production và ownership theo domain trước khi promote
**Project**: MIABOS
**Module ID**: M08
**Phase**: PB-02 / PB-03
**Priority**: P0
**Products**: MIA Smart / Platform
**Created by**: A02 Product Owner Agent
**Date**: 2026-04-21
**Document Role**: Canonical product definition for business context, scope, and release intent

---

## 0. Executive Summary

- **What is being proposed**: xây `Knowledge Center` như nền tảng tri thức nội bộ để nuôi AI và chuẩn hóa tri thức doanh nghiệp trong một workspace vận hành thống nhất.
- **Why now**: nếu không có lớp tri thức nội bộ có cấu trúc và governance, AI chỉ là lớp hỏi-đáp thiếu căn cứ và khó tạo niềm tin nội bộ lẫn mở rộng use case sau này.
- **Expected business and user outcome**: BQ có được một nền tri thức nội bộ có thể nuôi AI, giảm phụ thuộc vào tài liệu rời rạc và người biết việc, đồng thời tạo nền cho `M09` và các surface AI khác.
- **Recommended decision**: định vị `M08` là foundation module P0, với core value chính là “internal knowledge foundation for AI”, còn browse/search/queue/source health là các capability phục vụ mục tiêu đó.

## 1. Business Context

### 1.1 Background

Tri thức nội bộ của BQ hiện trải rộng ở nhiều hình thức: SOP, FAQ, policy, system guide, file import, attachment, tài liệu chưa phân loại, và tri thức nằm trong người có kinh nghiệm. Để AI nội bộ hoạt động đáng tin, cần một nền tảng tri thức có cấu trúc, có owner, có trạng thái, có khả năng kiểm tra nguồn và vòng đời.

### 1.2 Problem Statement

Không có một nền tảng tri thức chuẩn sẽ dẫn đến ba vấn đề:
- AI trả lời thiếu căn cứ hoặc không nhất quán
- tổ chức tiếp tục phụ thuộc vào một số cá nhân biết việc
- tài liệu nội bộ tồn tại nhưng khó tìm, khó duyệt, khó biết cái nào còn hiệu lực

### 1.3 Why This Matters

`M08` không chỉ là chỗ lưu document. Nó là nền để:
- AI nội bộ có nguồn để trả lời
- tổ chức chuẩn hóa tri thức theo domain
- tạo trust signal cho câu trả lời AI
- giảm rủi ro “AI nói hay nhưng không có căn cứ”

### 1.4 Why Now

Vì `M09` và các bề mặt AI khác phụ thuộc trực tiếp vào chất lượng tri thức nền. Nếu không chốt `M08` sớm, toàn bộ lớp AI sẽ bị kéo theo logic “hỏi thì có vẻ trả lời được nhưng không ai chắc là đúng”.

## 2. Target Users and Personas

| Persona | Role | Primary Pain | Desired Outcome | Priority |
|---------|------|--------------|-----------------|----------|
| Knowledge owner / domain owner | Quản lý tri thức theo domain | Tài liệu rời rạc, khó giữ một bản chuẩn | Có nền tri thức có owner, trạng thái và vòng đời rõ | P0 |
| Reviewer / PM / Ops | Kiểm soát chất lượng tri thức | Khó biết tài liệu nào đang stale, pending, hoặc lỗi nguồn | Có workspace để kiểm soát tri thức vận hành | P0 |
| Nhân viên nội bộ / AI consumer | Dùng tri thức để làm việc và hỏi AI | Khó tìm đúng tài liệu và khó biết có nên tin hay không | Tìm nhanh, đọc nhanh, và feed được vào AI | P1 |

## 3. Jobs To Be Done

| Persona | Job To Be Done | Current Friction | Product Opportunity |
|---------|----------------|------------------|---------------------|
| Knowledge owner | Chuẩn hóa và duy trì tri thức nội bộ | File rời rạc, khó thống nhất | Workspace quản trị tri thức có cấu trúc |
| Reviewer / Ops | Kiểm tra tình trạng tri thức và nguồn | Không thấy được pending/stale/source health tập trung | Một control surface chung |
| AI layer / internal users | Lấy tri thức đủ tin cậy để trả lời / tra cứu | Không có nền tri thức chuẩn để nuôi AI | Knowledge foundation cho AI |

## 4. User Task Flows  ⚠ Mandatory

### Knowledge Owner / Reviewer

| Step | Task | Task Type | Success Indicator |
|------|------|-----------|------------------|
| 1 | Vào workspace tri thức và định vị nhóm tài liệu cần xử lý | Reporting | Thấy rõ folder / queue / source state |
| 2 | Tìm, kiểm tra, hoặc thêm tài liệu mới vào nền tri thức | Configuration | Có entry point rõ cho import hoặc tạo thủ công |
| 3 | Xem tình trạng pending / stale / source health | Exception Handling | Biết ngay điểm nào đang có rủi ro |
| 4 | Mở detail để xác minh metadata, content, attachment | Reporting | Xác minh được tài liệu có đủ tin cậy để nuôi AI |

### Internal User / AI Consumer

| Step | Task | Task Type | Success Indicator |
|------|------|-----------|------------------|
| 1 | Tìm đúng tài liệu hoặc nhóm tri thức liên quan | Quick Action | Search và folder filter usable |
| 2 | Mở detail để đọc nội dung và context | Reporting | Đọc được tài liệu trong định dạng phù hợp |
| 3 | Dùng tài liệu như nền tham chiếu cho công việc / AI answer | Reporting | Tài liệu có metadata đủ để tin và dùng |

## 5. Product Goals and Success Metrics

| Goal | KPI / Metric | Baseline | Target | Source |
|------|--------------|----------|--------|--------|
| Tạo nền tri thức nội bộ usable cho AI | Tỷ lệ tri thức P1 có thể được map vào knowledge workspace có owner/trạng thái | Chưa có | Tăng theo pilot rollout | Knowledge ops log |
| Giảm phụ thuộc tri thức rời rạc | Tỷ lệ tài liệu trọng yếu được đưa về một workspace chuẩn | Chưa có | Tăng theo wave import/governance | Knowledge registry |
| Tăng khả năng kiểm soát chất lượng tri thức | Tỷ lệ pending/stale/source issue được nhìn thấy tập trung | Chưa có | 100% issue surfaced trong workspace | Ops review |

## 6. Scope Boundaries

### 6.1 In Scope

- Một workspace tri thức nội bộ thống nhất
- Browse / search / list / detail
- Queue awareness
- Source health awareness
- Entry point cho import và tạo thủ công
- Typed document handling cho các nhóm tri thức nội bộ chính

### 6.2 Out of Scope

- Fully automated knowledge ingestion production
- Publish workflow production hoàn chỉnh
- Permission/governance production end-state
- Knowledge analytics sâu cho mọi use case

### 6.3 Non-Goals

- Không phải chỉ là document library thuần
- Không phải module analytics
- Không phải chatbot

## 7. Release Slice and Sequencing

| Slice | Goal | Included Features | Excluded Features | Dependency |
|-------|------|-------------------|-------------------|------------|
| Phase 1 | Tạo nền tri thức nội bộ usable cho AI | workspace, browse/search/detail, queue awareness, source health awareness | automation sâu, governance production hoàn chỉnh | domain owner alignment |
| Phase 1.5 | Tăng chất lượng governance và trust | richer workflow, freshness discipline, owner discipline | advanced analytics | ops/process maturity |
| Phase 2 | Mở rộng khả năng nuôi AI và scale governance | deeper integration with AI / more structured controls | full enterprise KM program | architecture + organization readiness |

## 8. Linked Features

| Feature ID | Feature Name | Purpose | Priority | Planned Status |
|------------|--------------|---------|----------|----------------|
| `F-M08-KNW-001` | Knowledge and Policy | Knowledge core | P0 | Legacy artifact / pending migration |
| `F-M08-KNW-002` | Knowledge Publishing Queue | Knowledge governance surface | P0 | Legacy artifact / pending migration |
| `F-M08-KNW-003` | FAQ and Policy Library | Self-serve browse and detail | P1 | Legacy artifact / pending migration |
| `F-M08-KNW-004` | Knowledge Documents and Source Governance | Source/freshness trust layer | P0 | Legacy artifact / pending migration |

## 9. Solution Direction

### 9.1 UX / IA Direction

`M08` phải được hiểu là một workspace chung của tri thức nội bộ, không phải 4 sản phẩm rời. IA phải phục vụ cả hai nhu cầu: quản trị tri thức và cung cấp nền tri thức để AI/nhân viên dùng lại.

### 9.2 Functional Capabilities

- Workspace-based knowledge operations
- Browse / search / detail
- Queue and source visibility
- Structured document handling
- Entry points for knowledge growth

### 9.3 Operational Rules

- Knowledge phải có trạng thái, độ mới, và ngữ cảnh đủ để nuôi AI
- Queue/source issues phải nhìn thấy được, không ẩn trong backend
- Nền tri thức phải phục vụ AI trước khi tối ưu các capability phụ

### 9.4 Technical Constraints for Downstream Teams

- Cần metadata contract đủ để AI sử dụng tri thức
- Cần domain ownership rõ để knowledge không bị “mồ côi”
- Cần gắn freshness / source / state vào model tri thức, không chỉ vào UI

## 10. Assumptions and Dependencies

| ID | Assumption / Dependency | Risk if Wrong | Owner |
|----|-------------------------|---------------|-------|
| A-01 | BQ có thể phân owner theo domain tri thức | Governance không chạy được | PM / Business Owner |
| A-02 | M08 sẽ là foundation feeding cho M09 và các module AI khác | AI layer thiếu căn cứ | A02 / A03 |
| A-03 | Tài liệu nguồn có thể được chuẩn hóa dần theo wave thay vì one-shot | Scope quá lớn, chậm rollout | PM / Ops |

## 11. Risks and Mitigations

| Risk | Type | Impact | Mitigation | Owner |
|------|------|--------|------------|-------|
| Knowledge Center bị hiểu là thư viện tài liệu đơn thuần | Product | Không đạt core value nuôi AI | Giữ framing “knowledge foundation for AI” xuyên suốt | A02 / A01 |
| Tri thức vào nhiều nhưng không có owner | Governance | Không dùng được lâu dài | Chốt ownership theo domain trước rollout rộng | PM |
| Nền tri thức không feed được cho AI | Product | M09/M10 yếu đi | Ép metadata / source / state contract ngay từ đầu | A03 / A05 |

## 12. Open Questions

| ID | Question | Blocking? | Owner | Target Resolution Date |
|----|----------|-----------|-------|------------------------|
| OQ-01 | Domain tri thức P1 nào phải được ưu tiên để nuôi AI nội bộ? | Yes | Business Owner / PM | 2026-04-22 |
| OQ-02 | Ai là owner và reviewer cuối cho từng nhóm tri thức P1? | Yes | PM / Ops | 2026-04-22 |
| OQ-03 | Freshness / stale policy P1 được áp theo loại tri thức hay theo domain? | No nhưng cần sớm | PM / Ops | 2026-04-23 |

## 13. Decision Log

| Date | Decision | Made By | Reason |
|------|----------|---------|--------|
| 2026-04-21 | Định vị lại PRD M08 theo core value `nền tảng tri thức nội bộ để nuôi AI` | Business Owner / Codex | Chỉnh PRD về đúng business value thay vì mô tả workspace UI |

## 14. Linked Artifacts

- Feature Registry: [01_Projects/MIABOS/Analysis/Features/_feature_registry.md](../../../Analysis/Features/_feature_registry.md)
- User Stories:
- Feature SRS files:
  - [F-M08-KNW-001_Knowledge_And_Policy_SRS.md](../../../Analysis/Features/Modules/Knowledge_Center/Knowledge_And_Policy/SRS/F-M08-KNW-001_Knowledge_And_Policy_SRS.md)
  - [F-M08-KNW-002_Knowledge_Publishing_Queue_SRS.md](../../../Analysis/Features/Modules/Knowledge_Center/Knowledge_Publishing_Queue/SRS/F-M08-KNW-002_Knowledge_Publishing_Queue_SRS.md)
  - [F-M08-KNW-003_FAQ_And_Policy_Library_SRS.md](../../../Analysis/Features/Modules/Knowledge_Center/FAQ_And_Policy_Library/SRS/F-M08-KNW-003_FAQ_And_Policy_Library_SRS.md)
  - [F-M08-KNW-004_Knowledge_Documents_And_Source_Governance_SRS.md](../../../Analysis/Features/Modules/Knowledge_Center/Knowledge_Documents_And_Source_Governance/SRS/F-M08-KNW-004_Knowledge_Documents_And_Source_Governance_SRS.md)
- UXUI specs:
- Architecture / Integration Specs:
- Research / Evidence:
  - Knowledge Center research set under `01_Projects/MIABOS/Research/Knowledge_Center/`

## 15. Approval Checklist

- [x] Business case is explicit
- [x] Primary personas are identified
- [x] User Task Flows are complete
- [x] In-scope release slice is explicit
- [ ] Success metrics are fully measurable
- [x] Major assumptions are recorded
- [x] Open blockers are explicit
- [ ] Business Owner approved this PRD
