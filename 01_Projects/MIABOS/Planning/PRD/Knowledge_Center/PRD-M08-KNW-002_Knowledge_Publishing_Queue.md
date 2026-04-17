# PRD: Knowledge Publishing Queue

**Status**: Draft — Research Approved, Pending Business Owner PRD Approval
**Owner**: A02 Product Owner Agent
**Last Updated By**: Codex CLI (GPT-5.4 Codex environment)
**Last Reviewed By**: A01 PM Agent
**Approval Required**: Business Owner
**Approved By**: -
**Last Status Change**: 2026-04-17
**Source of Truth**: This document
**Blocking Reason**: Chưa chốt quyền rollback cuối cùng và runtime index confirmation detail
**Project**: MIABOS
**Module ID**: M08
**Phase**: PB-02 / PB-03
**Priority**: P0
**Products**: MIA Smart / Platform
**Created by**: A02 Product Owner Agent
**Date**: 2026-04-15
**Document Role**: Canonical product definition cho publishing governance của Knowledge Center

---

## 0. Executive Summary

- What is being proposed: Xây `Publishing Queue` như section `Chờ duyệt` trong `/knowledge`, để mọi knowledge item đều đi qua submit -> review -> approve / reject -> publish / rollback.
- Why now: Nếu knowledge được publish trực tiếp, BQ sẽ không kiểm soát được policy sai hoặc bản chưa duyệt lọt vào AI runtime.
- Expected business and user outcome: Giảm rủi ro publish sai policy, tăng khả năng audit, và tạo nhịp review rõ cho domain owners.
- Recommended decision: Approve queue ở mức P0 foundation, giữ `Draft` đến khi approval matrix và rollback authority được chốt.

## 1. Business Context

### 1.1 Background

Phase 1 của BQ cần một knowledge layer đáng tin cho chatbot nội bộ. Điều đó đòi hỏi publish workflow rõ ràng, không phụ thuộc vào thao tác tay ngoài hệ thống.

### 1.2 Problem Statement

Khi knowledge thay đổi liên quan tới giá, CTKM, đổi trả, hay SOP vận hành, việc không có queue phê duyệt sẽ làm tăng nguy cơ AI trả lời sai và khó truy ngược ai chịu trách nhiệm.

### 1.3 Why This Matters

Publishing Queue là lớp governance giúp:
- chặn draft chưa duyệt vào runtime
- lưu lý do approve / reject / rollback
- đảm bảo đội vận hành biết chính sách nào vừa được thay đổi
- reviewer xem được rich content preview gồm hình ảnh/bảng/attachment trước khi duyệt

### 1.4 Why Now

Queue phải được định nghĩa song song với knowledge core; nếu để sau, toàn bộ pipeline M08 sẽ phải retro-fit governance.

## 2. Target Users and Personas

| Persona | Role | Primary Pain | Desired Outcome | Priority |
|---------|------|--------------|-----------------|----------|
| Knowledge Owner | Người submit tài liệu | Không biết quy trình publish chuẩn | Submit nhanh, theo dõi trạng thái rõ | P0 |
| Reviewer | Người phê duyệt domain | Khó thấy thay đổi gì và tác động ở đâu | Có diff, metadata, decision path rõ | P0 |
| PM / Governance | Người kiểm soát rủi ro | Khó rollback / audit khi publish sai | Có quyền can thiệp và lịch sử đầy đủ | P1 |

## 3. Jobs To Be Done

| Persona | Job To Be Done | Current Friction | Product Opportunity |
|---------|----------------|------------------|---------------------|
| Knowledge Owner | Gửi bản mới để đưa vào runtime | Dễ gửi nhầm bản hoặc thiếu metadata | Queue chuẩn hóa submit package |
| Reviewer | So sánh bản cũ và bản mới trước khi approve | Khó review nếu không có diff, metadata, rich content preview | Review detail / diff / rich content / impact view |
| PM / Governance | Can thiệp khi publish sai | Không có rollback contract rõ | Force rollback và audit trail trong cùng hệ |

## 4. User Task Flows  ⚠ Mandatory

### Knowledge Owner

| Step | Task | Task Type | Success Indicator |
|------|------|-----------|------------------|
| 1 | Hoàn thiện draft và change summary | Configuration | Request đủ metadata |
| 2 | Submit vào publishing queue | Quick Action | Request có trạng thái `Submitted` |
| 3 | Theo dõi comment / reject reason | Reporting | Biết cần sửa gì |
| 4 | Resubmit sau khi chỉnh sửa | Quick Action | Request quay lại review thành công |

### Reviewer / PM

| Step | Task | Task Type | Success Indicator |
|------|------|-----------|------------------|
| 1 | Mở `/knowledge` và chọn section `Chờ duyệt`, lọc request theo category/topic/priority | Quick Action | Chọn đúng request cần review |
| 2 | Xem diff, metadata, rich content preview, impact | Reporting | Đủ thông tin để ra quyết định |
| 3 | Approve / reject với lý do | Quick Action | Request có decision log rõ |
| 4 | Rollback nếu phát hiện publish sai | Exception Handling | Runtime quay về bản đúng |

## 5. Product Goals and Success Metrics

| Goal | KPI / Metric | Baseline | Target | Source |
|------|--------------|----------|--------|--------|
| 100% publish có governance | `% knowledge publish đi qua queue` | Chưa đo | `100%` | `knowledge_publish_request` |
| Review đúng hạn | `% request được xử lý trong SLA` | Chưa đo | `>= 90%` | `M12 / queue metrics` |
| Giảm rủi ro publish lỗi | `publish failure + rollback rate` | Chưa đo | `< 5%` | `M12 / publish events` |

## 6. Scope Boundaries

### 6.1 In Scope

- Submit request publish
- Review detail và diff compare
- Rich content preview cho tài liệu import có hình ảnh/bảng/attachment
- Approve / reject với reason
- Publish confirmation và rollback

### 6.2 Out of Scope

- Viết / chỉnh nội dung tài liệu trực tiếp trong PRD này
- Workflow pháp lý đa tầng ngoài domain knowledge
- Notification đa kênh phức tạp

### 6.3 Non-Goals

- Không thay thế toàn bộ document management system
- Không mở queue cho user nội bộ phổ thông

## 7. Release Slice and Sequencing

| Slice | Goal | Included Features | Excluded Features | Dependency |
|-------|------|-------------------|-------------------|------------|
| `P1 Basic Queue` | Chặn publish trực tiếp và có review path | submit, review, approve/reject, publish status | SAP approval workflow / legal approval | `F-M08-KNW-001` |
| `P1.5 Rollback Governance` | Xử lý sai sót publish | rollback + incident note | automated notifications | runtime index confirmation |
| `P2 Advanced Governance` | Tăng kiểm soát theo domain nhạy cảm | SLA dashboard, incident review, runtime confirmation detail | legal / SAP approval workflow | `M12`, PM policy |

## 8. Linked Features

| Feature ID | Feature Name | Purpose | Priority | Planned Status |
|------------|--------------|---------|----------|----------------|
| `F-M08-KNW-002` | Knowledge Publishing Queue | Review / approve / publish / rollback | P0 | Draft |
| `F-M08-KNW-001` | Knowledge and Policy | Nơi phát sinh knowledge item cần publish | P0 | Draft |
| `F-M08-KNW-004` | Knowledge Documents and Source Governance | Kiểm source / trust trước publish | P0 | Draft |
| `F-M12-OBS-001` | Audit and Observability | Theo dõi queue SLA / publish failure | P1 | Draft |

## 9. Solution Direction

### 9.1 Chatbot Concept Connection (từ Research Approved 2026-04-17)

Publishing Queue là lớp **governance bắt buộc** để đảm bảo chatbot Gen 3 RAG chỉ retrieve knowledge đã được verify. Nguyên tắc từ research benchmark:
- **Guru model**: mỗi knowledge card có verification workflow — ai responsible, review khi nào
- Chatbot chỉ được dùng item có status `Published` — queue là gate duy nhất
- Reviewer phải thấy **rich content preview** (hình ảnh, bảng, attachment) trước khi approve — không duyệt text-only sẽ bỏ sót ngữ cảnh

Queue cũng là điểm kiểm tra để tài liệu có đủ metadata phục vụ các pattern trong [RES-M08-KNW_UX_Patterns_And_IA.md](../../../Research/Knowledge_Center/RES-M08-KNW_UX_Patterns_And_IA.md): source citation, stale warning, uncertainty fallback, quick replies, role-aware guidance, và feedback/escalation path. Reviewer không chỉ duyệt nội dung đọc được trên library; reviewer phải xác nhận nội dung này đủ an toàn để AI Chat dùng làm answer source.

Xem [RES-M08-KNW_Paradigm_And_Benchmark.md](../../../Research/Knowledge_Center/RES-M08-KNW_Paradigm_And_Benchmark.md) §2.1 cho Guru verification workflow detail.

### 9.2 UX / IA Direction

Queue là section vận hành trong `/knowledge`, không phải page rời. Reviewer cần thấy `category`, `priority`, `knowledge_topic`, `effective date`, `change summary`, `diff`, rich content preview, và source evidence trước khi quyết định.

UX patterns bắt buộc trong review interface:
- **Diff view**: so sánh bản cũ và bản mới side-by-side
- **Rich content preview tab**: render đầy đủ hình ảnh, bảng, attachment — không được text-only
- **AI Answer Preview**: preview answer summary, source citation block, role-aware header, stale/uncertainty state, quick replies, và feedback/escalation action trước khi publish
- **Impact declaration**: hiển thị bao nhiêu AI queries/tháng đang dùng knowledge item này (để reviewer hiểu độ rủi ro)
- **Decision log**: approve/reject phải có reason — không được one-click silent

### 9.2 Functional Capabilities

- Submit request với metadata bắt buộc
- Review detail + diff + rich content preview
- AI answer-ready validation preview
- Approve / reject có lý do
- Publish status + rollback path

### 9.3 Operational Rules

- Không được publish trực tiếp từ draft
- Reject phải có reason
- Rollback phải có incident note và target version rõ
- Request không đủ `source citation`, `freshness state`, `scope statement`, hoặc `escalation owner` thì không được publish cho AI runtime

### 9.4 Technical Constraints for Downstream Teams

- Publish chỉ được coi thành công khi runtime index xác nhận
- Queue events phải feed được `M12`
- Permission model phụ thuộc domain + PM override

## 10. Assumptions and Dependencies

| ID | Assumption / Dependency | Risk if Wrong | Owner |
|----|-------------------------|---------------|-------|
| `A-001` | Mỗi domain sẽ có ít nhất 1 reviewer | Queue không xử lý được | PM |
| `A-002` | Rollback target luôn còn giữ metadata/version | Không rollback được khi publish lỗi | A03 / BE |
| `D-001` | Runtime publish contract được định nghĩa rõ | Queue approve xong nhưng runtime không sync | A05 / A08 |

## 11. Risks and Mitigations

| Risk | Type | Impact | Mitigation | Owner |
|------|------|--------|------------|-------|
| Approval matrix quá phức tạp | Product / Ops | Queue chậm, người dùng bỏ quy trình | Bắt đầu bằng single approval per domain | A02 / PM |
| Reviewer thiếu SLA | Operational | Request backlog tăng | Định nghĩa SLA + dashboard queue | PM |
| Rollback không đủ rõ | Governance | Sai policy kéo dài ở runtime | Thiết kế rollback state từ P1.5 | A05 / A08 |
| Review không thấy hình ảnh/attachment | UX / Governance | Duyệt thiếu ngữ cảnh từ tài liệu import | Bắt buộc tab rich content trong review detail | A03 / A06 |

## 12. Open Questions

| ID | Question / Decision Area | Status | Owner | Target Resolution Date |
|----|--------------------------|--------|-------|------------------------|
| `D-001` | Approval workflow nằm ở đâu? | **Resolved 2026-04-17**: nằm ở SAP; MIABOS không làm dual approval UI | Business Owner / PM | Done |
| `OQ-002` | Ai có quyền force rollback cuối cùng? | Open | PM / Business Owner | 2026-04-18 |
| `OQ-003` | Runtime index confirmation khi publish/rollback được xác nhận bằng signal nào? | Open | PM / A05 / A08 | 2026-04-19 |

> **Decision update — 2026-04-17**: Queue trong MIABOS dùng 1-reviewer visibility/review flow cho FE Preview; rollback authority và runtime index confirmation vẫn cần chốt ở BE/integration phase.

## 13. Decision Log

| Date | Decision | Made By | Reason |
|------|----------|---------|--------|
| 2026-04-15 | Tách publishing governance thành PRD riêng | Codex CLI / A01 PM Agent | Cần gate governance độc lập thay vì ẩn trong knowledge core |
| 2026-04-17 | Queue là section `Chờ duyệt` trong `/knowledge`, không phải workspace rời | Codex CLI / A01 PM Agent | Giữ reviewer trong cùng Knowledge Center và hỗ trợ rich content review |
| 2026-04-17 | Queue phải kiểm tra AI answer-ready metadata trước khi publish | Codex CLI / A01 PM Agent | Align với `RES-M08-KNW_UX_Patterns_And_IA` để M09 có citation, uncertainty/stale state, quick replies, role-aware guidance, và feedback/escalation |

## 14. Linked Artifacts

- Feature Registry: [01_Projects/MIABOS/Analysis/Features/_feature_registry.md](../../../Analysis/Features/_feature_registry.md)
- User Stories: `-`
- Feature SRS files:
  - [F-M08-KNW-002_Knowledge_Publishing_Queue_SRS.md](../../../Analysis/Features/Modules/Knowledge_Center/Knowledge_Publishing_Queue/SRS/F-M08-KNW-002_Knowledge_Publishing_Queue_SRS.md)
- UXUI specs: `-`
- Architecture / Integration Specs: `-`
- Research / Evidence:
  - [RES-M08-KNW_UX_Patterns_And_IA.md](../../../Research/Knowledge_Center/RES-M08-KNW_UX_Patterns_And_IA.md)
  - [RES-M08-KNW_Knowledge_Center_Layout_And_Rich_Document_Research.md](../../../Research/Knowledge_Center/RES-M08-KNW_Knowledge_Center_Layout_And_Rich_Document_Research.md)
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
