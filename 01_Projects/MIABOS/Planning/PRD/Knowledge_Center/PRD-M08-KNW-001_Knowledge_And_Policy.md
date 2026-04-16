# PRD: Knowledge and Policy

**Status**: Draft
**Owner**: A02 Product Owner Agent
**Last Updated By**: Codex CLI (GPT-5 Codex)
**Last Reviewed By**: A01 PM Agent
**Approval Required**: Business Owner
**Approved By**: -
**Last Status Change**: 2026-04-15
**Source of Truth**: This document
**Blocking Reason**: Chưa chốt taxonomy knowledge theo domain, approver ownership, và contract citation/freshness cho AI answer
**Project**: MIABOS
**Module ID**: M08
**Phase**: PB-02 / PB-03
**Priority**: P0
**Products**: MIA Smart / Platform
**Created by**: A02 Product Owner Agent
**Date**: 2026-04-15
**Document Role**: Canonical product definition cho knowledge core của Knowledge Center

---

## 0. Executive Summary

- What is being proposed: Xây lớp `Knowledge and Policy` làm nguồn tri thức chuẩn cho SOP, FAQ, policy, system guide, và citation runtime của AI.
- Why now: BQ đang có nhu cầu phase 1 là chatbot nội bộ; nếu không có knowledge core, AI sẽ chỉ là lớp hỏi đáp thiếu căn cứ và khó tạo niềm tin.
- Expected business and user outcome: Nhân viên nội bộ tra cứu nhanh hơn, câu trả lời AI có nguồn rõ ràng hơn, và doanh nghiệp giảm phụ thuộc vào trí nhớ của một vài nhân sự.
- Recommended decision: Approve lớp knowledge core như P0 foundation, nhưng giữ `Draft` đến khi chốt taxonomy, owner phê duyệt, và freshness policy.

## 1. Business Context

### 1.1 Background

BQ có nhiều câu hỏi lặp lại về `pricing policy`, `promotion policy`, `SOP vận hành`, `đổi trả`, `bảo hành`, và hướng dẫn dùng hệ thống. Requirement pack đã xác định deliverable phase 1 nên là `chatbot nội bộ + knowledge layer + integration foundation`.

### 1.2 Problem Statement

Hiện tri thức nghiệp vụ nhiều khả năng nằm rải giữa tài liệu nội bộ, Excel, người có kinh nghiệm, và nhiều hệ khác nhau. Nếu AI không có lớp knowledge được duyệt và version hóa, cùng một câu hỏi có thể cho ra câu trả lời khác nhau.

### 1.3 Why This Matters

Knowledge core là điều kiện để:
- tạo trust cho `Internal AI Chat`
- phân biệt `policy answer` với `data answer`
- làm nền cho `FAQ library`, `publishing governance`, và `source governance`

### 1.4 Why Now

Nếu không chốt knowledge core trước, các bước sau như UXUI cho AI answer, publish workflow, hoặc sales-safe external reuse sẽ bị buộc phải tự suy luận.

## 2. Target Users and Personas

| Persona                   | Role                      | Primary Pain                                                   | Desired Outcome                                          | Priority |
| ------------------------- | ------------------------- | -------------------------------------------------------------- | -------------------------------------------------------- | -------- |
| Knowledge Owner           | Ops / PM / domain owner   | Tri thức bị phân mảnh, khó giữ một bản chuẩn                   | Có một lớp knowledge chuẩn, versionable, có owner rõ     | P0       |
| Sales / CSKH / Operations | Người dùng nội bộ         | Hỏi đi hỏi lại cùng một policy, phụ thuộc người có kinh nghiệm | Tra cứu / hỏi AI và nhận câu trả lời có citation, dễ tin | P0       |
| Reviewer / PM             | Người kiểm soát nghiệp vụ | Khó biết policy nào đang hiệu lực                              | Nhìn được version, owner, effective date, và freshness   | P1       |

## 3. Jobs To Be Done

| Persona | Job To Be Done | Current Friction | Product Opportunity |
|---------|----------------|------------------|---------------------|
| Knowledge Owner | Chuẩn hóa và publish tri thức đúng domain | Tài liệu rời rạc, khó kiểm soát bản đúng | Tạo lớp knowledge core có metadata + version + citation |
| Sales / CSKH / Ops | Tìm chính sách / SOP nhanh trong lúc làm việc | Phải hỏi người khác hoặc mở nhiều nguồn | Tra cứu qua chat hoặc library từ một knowledge source chuẩn |
| Reviewer / PM | Kiểm tra câu trả lời AI có căn cứ không | Không có source trace rõ | Bắt buộc citation, owner, freshness ở answer layer |

## 4. User Task Flows  ⚠ Mandatory

### Knowledge Owner

| Step | Task | Task Type | Success Indicator |
|------|------|-----------|------------------|
| 1 | Tạo hoặc cập nhật knowledge item theo domain và loại tài liệu | Configuration | Knowledge item có metadata tối thiểu |
| 2 | Gắn owner, effective date, review cycle | Configuration | Item đủ điều kiện gửi review |
| 3 | Gửi item sang publish workflow | Quick Action | Item vào queue đúng domain |
| 4 | Theo dõi item đã được index và xuất hiện cho runtime chưa | Reporting | Citation/runtime đã dùng đúng bản |

### Sales / CSKH / Operations

| Step | Task | Task Type | Success Indicator |
|------|------|-----------|------------------|
| 1 | Hỏi policy / SOP qua chat hoặc mở library | Quick Action | Tìm được đúng domain câu hỏi |
| 2 | Xem kết luận và citation | Reporting | Nhận câu trả lời có nguồn rõ |
| 3 | Mở detail để kiểm tra owner / hiệu lực khi cần | Quick Action | Xác minh được độ tin cậy |
| 4 | Báo knowledge gap nếu câu trả lời chưa đủ | Exception Handling | Gap được ghi nhận cho Knowledge Owner |

## 5. Product Goals and Success Metrics

| Goal | KPI / Metric | Baseline | Target | Source |
|------|--------------|----------|--------|--------|
| Tạo trust cho AI policy answers | `% câu trả lời policy có citation hợp lệ` | Chưa đo | `>= 85%` trong pilot nội bộ | `M12 / knowledge usage log` |
| Giảm hỏi đáp thủ công lặp lại | `% truy vấn policy tự phục vụ không cần escalate` | Chưa đo | `>= 60%` | `M12 / escalation log` |
| Chuẩn hóa ownership tri thức | `% knowledge item có owner + effective date + review cycle` | Chưa đo | `100%` | `knowledge_document` |

## 6. Scope Boundaries

### 6.1 In Scope

- Knowledge item cho `SOP`, `FAQ`, `Policy`, `System Guide`
- Metadata owner, domain, effective date, review cycle
- Citation và version reference cho AI/runtime
- Detail view để user xác minh knowledge

### 6.2 Out of Scope

- Tự động sinh knowledge bằng AI
- Chỉnh sửa nội dung tài liệu ngoài workflow governance
- External/public library cho khách hàng cuối

### 6.3 Non-Goals

- Không thay thế dữ liệu transactional từ SAP / Haravan / KiotViet
- Không giải quyết toàn bộ dashboard / observability ở PRD này

## 7. Release Slice and Sequencing

| Slice | Goal | Included Features | Excluded Features | Dependency |
|-------|------|-------------------|-------------------|------------|
| `P1 Knowledge Core` | Có knowledge source chuẩn cho internal AI | `F-M08-KNW-001`, citation, version, owner metadata | External-safe publishing | `F-M08-KNW-002`, `F-M08-KNW-004` |
| `P1.5 Trust Hardening` | Tăng khả năng xác minh và audit | freshness label, deprecated handling, gap feedback | channel-specific exposure | `M12`, `M07` |
| `P2 External Reuse` | Mở một phần knowledge cho sales-facing AI | public-safe subsets | full public library | approval + sales-safe policy |

## 8. Linked Features

| Feature ID | Feature Name | Purpose | Priority | Planned Status |
|------------|--------------|---------|----------|----------------|
| `F-M08-KNW-001` | Knowledge and Policy | Knowledge core + citation + version + answer trust | P0 | Draft |
| `F-M08-KNW-002` | Knowledge Publishing Queue | Publish governance cho knowledge core | P0 | Draft |
| `F-M08-KNW-003` | FAQ and Policy Library | Self-serve lookup surface | P1 | Draft |
| `F-M08-KNW-004` | Knowledge Documents and Source Governance | Trust / freshness / source rules | P0 | Draft |

## 9. Solution Direction

### 9.1 UX / IA Direction

Knowledge core không chỉ là màn hình admin. Nó phải feed được hai bề mặt chính: `AI answer citation` và `library detail view`.

### 9.2 Functional Capabilities

- Tạo knowledge item với metadata chuẩn
- Version hóa và giữ lịch sử
- Query knowledge cho AI/runtime
- Trả detail / citation / freshness cho user xác minh

### 9.3 Operational Rules

- Chỉ item được duyệt mới được dùng ở runtime
- Policy answer phải có citation
- Deprecated knowledge phải hiển thị rõ và không được ngầm dùng như active

### 9.4 Technical Constraints for Downstream Teams

- Cần contract rõ giữa `M08` và `M09` cho citation payload
- Metadata phải đủ cho `M12` đo coverage và stale usage
- Permission filter phải đi qua `M07`

## 10. Assumptions and Dependencies

| ID | Assumption / Dependency | Risk if Wrong | Owner |
|----|-------------------------|---------------|-------|
| `A-001` | BQ có thể chỉ định owner theo domain knowledge | Publish governance bị treo | PM / Business Owner |
| `A-002` | Internal AI phase 1 là use case chính | Nếu scope chuyển sang external sớm, cần public-safe redesign | PM |
| `D-001` | `F-M08-KNW-002` và `F-M08-KNW-004` sẽ được build song hành hoặc ngay sau | Knowledge core thiếu governance | PO / BA |

## 11. Risks and Mitigations

| Risk | Type | Impact | Mitigation | Owner |
|------|------|--------|------------|-------|
| Taxonomy knowledge quá mơ hồ | Product | AI và library khó dùng | Chốt taxonomy theo domain + doc type trước UX | A02 / A01 |
| Thiếu owner phê duyệt | Governance | Không publish được hoặc publish sai | Lập approval matrix theo domain | PM |
| Citation payload không đủ trust | UX / Product | User không tin AI answer | Chuẩn hóa `owner / version / effective date / freshness` | A02 / A03 |

## 12. Open Questions

| ID | Question | Blocking? | Owner | Target Resolution Date |
|----|----------|-----------|-------|------------------------|
| `OQ-001` | Domain nào là taxonomy P1 chính thức? | Yes | Business Owner / PM | 2026-04-18 |
| `OQ-002` | Phòng ban nào approve pricing / promotion / service policy? | Yes | Business Owner / PM | 2026-04-18 |
| `OQ-003` | Freshness SLA có tách theo loại knowledge không? | Yes | PM / Ops | 2026-04-19 |

## 13. Decision Log

| Date | Decision | Made By | Reason |
|------|----------|---------|--------|
| 2026-04-15 | Tách `Knowledge_Center` thành 4 PRD/SRS slices thay vì 1 umbrella doc | Codex CLI / A01 PM Agent | Dễ gate, dễ handoff, dễ traceability |

## 14. Linked Artifacts

- Feature Registry: [01_Projects/MIABOS/Analysis/Features/_feature_registry.md](../../../Analysis/Features/_feature_registry.md)
- User Stories: `-`
- Feature SRS files:
  - [F-M08-KNW-001_Knowledge_And_Policy_SRS.md](../../../Analysis/Features/Modules/Knowledge_Center/Knowledge_And_Policy/SRS/F-M08-KNW-001_Knowledge_And_Policy_SRS.md)
- UXUI specs: `-`
- Architecture / Integration Specs: `-`
- Research / Evidence:
  - [2026-04-13_BQ_Customer_Research_Pack.md](../../../../04_Raw_Information/Customers/Giay_BQ/2026-04-13_BQ_Customer_Research_Pack.md)
  - [2026-04-13_BQ_Raw_Notes.md](../../../../04_Raw_Information/Customers/Giay_BQ/2026-04-13_BQ_Raw_Notes.md)

## 15. Approval Checklist

- [x] Business case is explicit
- [x] Primary personas are identified
- [x] User Task Flows are complete
- [x] In-scope release slice is explicit
- [x] Success metrics are measurable
- [x] Major assumptions are recorded
- [x] Open blockers are explicit
- [ ] Business Owner approved this PRD
