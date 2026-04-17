# PRD: Knowledge and Policy

**Status**: Draft — Research Approved, Pending Business Owner PRD Approval
**Owner**: A02 Product Owner Agent
**Last Updated By**: A01 PM Agent (Claude Sonnet 4.6 — Claude Code CLI)
**Last Reviewed By**: A01 PM Agent
**Approval Required**: Business Owner
**Approved By**: -
**Last Status Change**: 2026-04-17
**Source of Truth**: This document
**Blocking Reason**: Chưa chốt external exposure boundary và final source-type boundary
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

- What is being proposed: Xây lớp `Knowledge and Policy` trong một page `/knowledge` chung, làm nguồn tri thức chuẩn cho SOP, FAQ, policy, system guide, rich documents có hình ảnh/attachment, và source reference runtime của AI.
- Why now: BQ đang có nhu cầu phase 1 là chatbot nội bộ; nếu không có knowledge core, AI sẽ chỉ là lớp hỏi đáp thiếu căn cứ và khó tạo niềm tin.
- Expected business and user outcome: Nhân viên nội bộ tra cứu nhanh hơn, câu trả lời AI có nguồn rõ ràng hơn, và doanh nghiệp giảm phụ thuộc vào trí nhớ của một vài nhân sự.
- Recommended decision: Approve lớp knowledge core như P0 foundation; dùng `SOP / FAQ / Policy / System Guide` làm cây nội dung chính, dùng `knowledge topic` bên trong để tránh trùng Catalog & Commerce.

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
- tiếp nhận tài liệu từ phòng ban khác mà không mất hình ảnh, bảng, hoặc attachment khi sync/import

### 1.4 Why Now

Nếu không chốt knowledge core trước, các bước sau như UXUI cho AI answer, publish workflow, hoặc sales-safe external reuse sẽ bị buộc phải tự suy luận.

## 2. Target Users and Personas

| Persona                   | Role                      | Primary Pain                                                   | Desired Outcome                                          | Priority |
| ------------------------- | ------------------------- | -------------------------------------------------------------- | -------------------------------------------------------- | -------- |
| Knowledge Owner           | Ops / PM / domain owner   | Tri thức bị phân mảnh, khó giữ một bản chuẩn                   | Có một lớp knowledge chuẩn, versionable, có owner rõ     | P0       |
| Sales / CSKH / Operations | Người dùng nội bộ         | Hỏi đi hỏi lại cùng một policy, phụ thuộc người có kinh nghiệm | Tra cứu / hỏi AI và nhận câu trả lời có source reference, dễ tin | P0       |
| Reviewer / PM             | Người kiểm soát nghiệp vụ | Khó biết policy nào đang hiệu lực                              | Nhìn được version, owner, effective date, và freshness   | P1       |

## 3. Jobs To Be Done

| Persona | Job To Be Done | Current Friction | Product Opportunity |
|---------|----------------|------------------|---------------------|
| Knowledge Owner | Import hoặc chuẩn hóa tri thức đúng category/topic | Tài liệu rời rạc, có hình ảnh/attachment, khó kiểm soát bản đúng | Tạo lớp knowledge core có import, metadata, version, asset preservation, source reference |
| Sales / CSKH / Ops | Tìm chính sách / SOP nhanh trong lúc làm việc | Phải hỏi người khác hoặc mở nhiều nguồn | Tra cứu qua chat hoặc library từ một knowledge source chuẩn |
| Reviewer / PM | Kiểm tra câu trả lời AI có căn cứ không | Không có source trace rõ | Bắt buộc source reference, owner, freshness ở answer layer |

## 4. User Task Flows  ⚠ Mandatory

### Knowledge Owner

| Step | Task | Task Type | Success Indicator |
|------|------|-----------|------------------|
| 1 | Mở `/knowledge`, chọn `Import tài liệu` hoặc `Tạo thủ công` | Quick Action | Bắt đầu trong cùng Knowledge Center workspace |
| 2 | Chọn category `SOP / FAQ / Policy / System Guide`, knowledge topic, folder, owner, effective date, review cycle | Configuration | Knowledge item có metadata tối thiểu |
| 3 | Kiểm tra nội dung rich content gồm text, hình ảnh, bảng, attachment, source link | Configuration | Không mất dữ liệu quan trọng khi import |
| 4 | Gửi item sang publish workflow | Quick Action | Item vào queue đúng reviewer/topic |
| 5 | Theo dõi item đã được index và xuất hiện cho runtime chưa | Reporting | Runtime đã dùng đúng bản document/version |

### Sales / CSKH / Operations

| Step | Task | Task Type | Success Indicator |
|------|------|-----------|------------------|
| 1 | Hỏi policy / SOP qua chat hoặc mở library | Quick Action | Tìm được đúng knowledge topic câu hỏi |
| 2 | Xem kết luận và source/document reference | Reporting | Nhận câu trả lời có nguồn rõ |
| 3 | Mở detail để kiểm tra owner / hiệu lực khi cần | Quick Action | Xác minh được độ tin cậy |
| 4 | Dùng feedback/escalation path nếu câu trả lời chưa đủ | Exception Handling | Có lối xử lý tiếp mà không tạo object gap riêng |

## 5. Product Goals and Success Metrics

| Goal | KPI / Metric | Baseline | Target | Source |
|------|--------------|----------|--------|--------|
| Tạo trust cho AI policy answers | `% câu trả lời policy có document/source reference hợp lệ` | Chưa đo | `>= 85%` trong pilot nội bộ | `M12 / observability nếu bật` |
| Giảm hỏi đáp thủ công lặp lại | `% truy vấn policy tự phục vụ không cần escalate` | Chưa đo | `>= 60%` | `M12 / escalation log` |
| Chuẩn hóa ownership tri thức | `% knowledge item có owner + effective date + review cycle` | Chưa đo | `100%` | `knowledge_document` |

## 6. Scope Boundaries

### 6.1 In Scope

- Knowledge item cho `SOP`, `FAQ`, `Policy`, `System Guide`
- Single Knowledge Center page `/knowledge` với folder tree, search, sections, preview/detail panel
- Import tài liệu từ file/source ngoài, preserve hình ảnh, bảng, attachment
- Metadata owner, knowledge topic, effective date, review cycle
- Document/source reference và version reference cho AI/runtime
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
| `P1 Knowledge Core` | Có knowledge source chuẩn cho internal AI | `F-M08-KNW-001`, source reference, version, owner metadata | External-safe publishing | `F-M08-KNW-002`, `F-M08-KNW-004` |
| `P1.5 Trust Hardening` | Tăng khả năng xác minh và audit | freshness label, deprecated handling, feedback/escalation path | channel-specific exposure | `M12`, `M07` |
| `P2 External Reuse` | Mở một phần knowledge cho sales-facing AI | public-safe subsets | full public library | approval + sales-safe policy |

## 8. Linked Features

| Feature ID | Feature Name | Purpose | Priority | Planned Status |
|------------|--------------|---------|----------|----------------|
| `F-M08-KNW-001` | Knowledge and Policy | Knowledge core + source reference + version + answer trust | P0 | Draft |
| `F-M08-KNW-002` | Knowledge Publishing Queue | Publish governance cho knowledge core | P0 | Draft |
| `F-M08-KNW-003` | FAQ and Policy Library | Self-serve lookup surface | P1 | Draft |
| `F-M08-KNW-004` | Knowledge Documents and Source Governance | Trust / freshness / source rules | P0 | Draft |

## 9. Solution Direction

### 9.1 Chatbot Concept (từ Research Approved 2026-04-17)

Knowledge core là nền tảng cho **Internal AI Chatbot theo paradigm Gen 3 — RAG Knowledge Assistant** (xem [RES-M08-KNW_Internal_Chatbot_Concept.md](../../../../Research/Knowledge_Center/RES-M08-KNW_Internal_Chatbot_Concept.md)).

**Concept: "Trusted Knowledge Companion"** — không phải FAQ bot, không phải search bar. Là AI assistant hiểu context nhân viên, trả lời từ KB được verify, biết khi nào escalate.

4 Design Pillars bắt buộc khi build knowledge core:
- **Answer-First**: Knowledge item phải đủ granular để AI tổng hợp câu trả lời trực tiếp — không chỉ return link
- **Verified Knowledge**: Mỗi item có owner + expiry date. Chatbot sẽ hiển thị "cập nhật lần cuối" và cảnh báo stale
- **Role-Aware**: Cùng một knowledge topic có thể cần trả lời khác nhau theo role (Sales vs CS vs Manager)
- **Honest Uncertainty**: Khi không có knowledge item hợp lệ → chatbot nói thẳng + escalation path, không hallucinate

Benchmark đối chiếu: **Guru** (verified cards + in-workflow surfacing), **Workgrid** (proactive AI), **Glean** (permission-aware retrieval). Xem [RES-M08-KNW_Paradigm_And_Benchmark.md](../../../../Research/Knowledge_Center/RES-M08-KNW_Paradigm_And_Benchmark.md).

### 9.2 UX / IA Direction

Knowledge core không chỉ là màn hình admin. Nó phải là **Knowledge Center workspace** dùng chung tại `/knowledge`, feed được hai bề mặt chính: `AI answer document/source reference` và `library/detail view`.

Layout chuẩn (3-panel workspace — xem [RES-M08-KNW_Knowledge_Center_Layout_And_Rich_Document_Research.md](../../../../Research/Knowledge_Center/RES-M08-KNW_Knowledge_Center_Layout_And_Rich_Document_Research.md)):
- Left: cây thư mục `SOP`, `FAQ`, `Policy`, `System Guide`, `Imported / Chờ phân loại` (tối đa 3 cấp)
- Top: global search (Cmd+K) + `Import tài liệu` (primary CTA) + `Tạo thủ công`
- Center: các section nội dung như `Chờ xử lý`, `Tài liệu trong folder đang chọn`, `Cập nhật gần đây`
- Right: preview/detail panel có metadata, rich content (text + image + table + attachment), source reference, version, freshness

UX patterns bắt buộc cho detail panel (xem [RES-M08-KNW_UX_Patterns_And_IA.md](../../../../Research/Knowledge_Center/RES-M08-KNW_UX_Patterns_And_IA.md)):
- **Source Citation Block**: tên tài liệu + ngày cập nhật + người phụ trách
- **Stale Content Warning**: badge cảnh báo khi tài liệu quá expiry
- **Article Metadata Block**: owner, last updated, tags, verified status ở đầu mỗi article

`Knowledge topic` là nhóm tri thức vận hành như `Pricing Policy`, `Promotion Policy`, `CSKH Policy`, `Store SOP`, `Ecommerce Service`, `System Usage`. Đây không phải product category, SKU hierarchy, price book, inventory scope, hay ecommerce category; các dữ liệu đó thuộc `Catalog & Commerce`.

### 9.2 Functional Capabilities

- Tạo knowledge item với metadata chuẩn
- Import tài liệu rich content từ nguồn ngoài và giữ hình ảnh/bảng/attachment dưới dạng document assets
- Version hóa và giữ lịch sử
- Query knowledge cho AI/runtime
- Trả detail / source reference / freshness cho user xác minh
- Lưu `SOP Step` cho tài liệu SOP: từng bước thao tác, actor, kết quả kỳ vọng, exception/escalation note
- Lưu cây nội dung category/folder để user browse theo SOP / FAQ / Policy / Guide thay vì phải biết module kỹ thuật

### 9.3 Operational Rules

- Chỉ item được duyệt mới được dùng ở runtime
- Policy answer phải có document/source reference
- Deprecated knowledge phải hiển thị rõ và không được ngầm dùng như active

### 9.4 Technical Constraints for Downstream Teams

- Cần contract rõ giữa `M08` và `M09` cho document/version/source reference
- Analytics chi tiết nếu cần thuộc `M12`; Knowledge Center không sở hữu usage analytics object
- Permission filter phải đi qua `M07`
- Import/parser chi tiết thuộc BE/integration design; PRD này chỉ khóa UX và data expectation là không được mất asset âm thầm

## 10. Assumptions and Dependencies

| ID | Assumption / Dependency | Risk if Wrong | Owner |
|----|-------------------------|---------------|-------|
| `A-001` | BQ có thể chỉ định owner theo knowledge topic | Publish governance bị treo | PM / Business Owner |
| `A-002` | Internal AI phase 1 là use case chính | Nếu scope chuyển sang external sớm, cần public-safe redesign | PM |
| `D-001` | `F-M08-KNW-002` và `F-M08-KNW-004` sẽ được build song hành hoặc ngay sau | Knowledge core thiếu governance | PO / BA |

## 11. Risks and Mitigations

| Risk | Type | Impact | Mitigation | Owner |
|------|------|--------|------------|-------|
| Taxonomy knowledge quá giống Catalog & Commerce | Product | AI và library bị lẫn giữa tri thức và dữ liệu sản phẩm | Dùng `knowledge topic` + doc type; không dùng product/category taxonomy | A02 / A01 |
| Thiếu owner phê duyệt | Governance | Không publish được hoặc publish sai | Lập approval matrix theo domain | PM |
| Source reference không đủ trust | UX / Product | User không tin AI answer | Chuẩn hóa `owner / version / effective date / source backing / freshness` | A02 / A03 |
| Tài liệu import bị mất hình ảnh/bảng | UX / Data | User đọc sai hoặc thiếu ngữ cảnh | Bắt buộc asset list + import warning + reviewer preview | A03 / A06 |
| UX tách quá nhiều page | UX | User không hiểu Knowledge Center nằm ở đâu | Chốt `/knowledge` là workspace duy nhất, các phần còn lại là section/panel | A01 / A06 |

## 12. Open Questions

| ID | Question | Blocking? | Owner | Target Resolution Date |
|----|----------|-----------|-------|------------------------|
| `OQ-001` | Knowledge topic P1 chính thức gồm những nhóm nào? | No | Business Owner / PM | 2026-04-18 |
| `OQ-002` | Phòng ban nào approve pricing / promotion / service policy? | Yes | Business Owner / PM | 2026-04-18 |
| `OQ-003` | Freshness SLA có tách theo loại knowledge không? | Yes | PM / Ops | 2026-04-19 |
| `OQ-004` | Phase 1 import chính thức hỗ trợ các định dạng nào: PDF, DOCX, XLSX, image, HTML export? | Yes | PM / A05 | 2026-04-19 |

## 13. Decision Log

| Date | Decision | Made By | Reason |
|------|----------|---------|--------|
| 2026-04-15 | Tách `Knowledge_Center` thành 4 PRD/SRS slices thay vì 1 umbrella doc | Codex CLI / A01 PM Agent | Dễ gate, dễ handoff, dễ traceability |
| 2026-04-17 | Chốt `/knowledge` là single workspace có folder tree, sections, Import action, và rich document assets | Codex CLI / A01 PM Agent | Business Owner phản hồi UXUI cũ quá rời rạc và tài liệu sync chắc chắn có hình ảnh |

## 14. Linked Artifacts

- Feature Registry: [01_Projects/MIABOS/Analysis/Features/_feature_registry.md](../../../Analysis/Features/_feature_registry.md)
- User Stories: `-`
- Feature SRS files:
  - [F-M08-KNW-001_Knowledge_And_Policy_SRS.md](../../../Analysis/Features/Modules/Knowledge_Center/Knowledge_And_Policy/SRS/F-M08-KNW-001_Knowledge_And_Policy_SRS.md)
- UXUI specs: `-`
- Architecture / Integration Specs: `-`
- Research / Evidence:
  - [RES-M08-KNW_Internal_Chatbot_Concept.md](../../../../Research/Knowledge_Center/RES-M08-KNW_Internal_Chatbot_Concept.md) ✅ Approved
  - [RES-M08-KNW_Paradigm_And_Benchmark.md](../../../../Research/Knowledge_Center/RES-M08-KNW_Paradigm_And_Benchmark.md) ✅ Approved
  - [RES-M08-KNW_UX_Patterns_And_IA.md](../../../../Research/Knowledge_Center/RES-M08-KNW_UX_Patterns_And_IA.md) ✅ Approved
  - [RES-M08-KNW_Knowledge_Center_Layout_And_Rich_Document_Research.md](../../../../Research/Knowledge_Center/RES-M08-KNW_Knowledge_Center_Layout_And_Rich_Document_Research.md) ✅ Approved
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
