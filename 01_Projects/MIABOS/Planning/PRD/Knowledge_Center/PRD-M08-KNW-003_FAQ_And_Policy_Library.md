# PRD: FAQ and Policy Library

**Status**: Draft
**Owner**: A02 Product Owner Agent
**Last Updated By**: Codex CLI (GPT-5 Codex)
**Last Reviewed By**: A01 PM Agent
**Approval Required**: Business Owner
**Approved By**: -
**Last Status Change**: 2026-04-15
**Source of Truth**: This document
**Blocking Reason**: Chưa chốt taxonomy library, search/filter model theo vai trò, và boundary giữa policy nội bộ với policy public-safe
**Project**: MIABOS
**Module ID**: M08
**Phase**: PB-02 / PB-03
**Priority**: P1
**Products**: MIA Smart / Platform
**Created by**: A02 Product Owner Agent
**Date**: 2026-04-15
**Document Role**: Canonical product definition cho self-service knowledge lookup của Knowledge Center

---

## 0. Executive Summary

- What is being proposed: Xây `FAQ and Policy Library` để Sales / CSKH / Store / Ops có thể tự tra cứu policy, FAQ, SOP mà không phải luôn đi qua chat.
- Why now: BQ cần internal AI phase 1, nhưng không phải mọi nhu cầu tri thức đều nên qua chat; library là bề mặt tự phục vụ song song để tăng adoption và giảm friction.
- Expected business and user outcome: Giảm câu hỏi lặp lại, tăng self-service, và tạo một bề mặt tham chiếu trực tiếp cho citation của AI.
- Recommended decision: Approve library như P1 capability trong `Knowledge_Center`, mở desktop nội bộ trước, mobile/store sau.

## 1. Business Context

### 1.1 Background

Nhiều câu hỏi nội bộ của BQ là dạng `chính sách nào đang áp dụng`, `quy trình xử lý ra sao`, `FAQ nào đúng cho tình huống này`. Chat là một entry point tốt, nhưng library vẫn cần tồn tại như nguồn tra cứu trực tiếp.

### 1.2 Problem Statement

Nếu không có thư viện chuẩn, người dùng sẽ phải tìm tài liệu rời rạc hoặc hỏi AI nhiều vòng. Điều này vừa chậm, vừa khó đối chiếu khi cần tự xác minh policy.

### 1.3 Why This Matters

Library giúp:
- tự phục vụ cho user nội bộ
- giảm tải cho người có kinh nghiệm
- tạo một bề mặt đích khi user bấm vào citation từ AI answer

### 1.4 Why Now

Library nên được định nghĩa cùng wave với knowledge core để UX / IA của `Knowledge_Center` không bị lệch giữa `chat-first` và `lookup-first`.

## 2. Target Users and Personas

| Persona | Role | Primary Pain | Desired Outcome | Priority |
|---------|------|--------------|-----------------|----------|
| Sales / CSKH | Người cần tra policy nhanh | Mất thời gian hỏi người khác | Search nhanh, mở detail rõ | P0 |
| Store Lead / Ops | Người xử lý SOP tại điểm bán | Tài liệu phân mảnh, khó biết bản mới nhất | Có library filter theo domain / cửa hàng / kênh | P1 |
| Knowledge Owner | Người duy trì nội dung | Khó biết user có tìm thấy nội dung không | Theo dõi no-result và feedback gap | P1 |

## 3. Jobs To Be Done

| Persona | Job To Be Done | Current Friction | Product Opportunity |
|---------|----------------|------------------|---------------------|
| Sales / CSKH | Tra một policy hoặc FAQ ngay trong lúc xử lý khách | Tìm nhiều nguồn, không chắc bản mới nhất | Search + filter + detail với metadata rõ |
| Store Lead / Ops | Mở SOP hoặc policy đúng cho bối cảnh vận hành | Thiếu taxonomy và filter theo role / branch | Library có domain, doc type, related docs |
| Knowledge Owner | Nhìn chỗ nào user hay không tìm thấy | Không có no-result signal | Thu thập search/open/gap events |

## 4. User Task Flows  ⚠ Mandatory

### Sales / CSKH

| Step | Task | Task Type | Success Indicator |
|------|------|-----------|------------------|
| 1 | Mở library hoặc search theo keyword | Quick Action | Có kết quả phù hợp ban đầu |
| 2 | Lọc theo domain / doc type | Quick Action | Thu hẹp đúng nhóm policy cần xem |
| 3 | Mở detail và đọc rule chính | Reporting | Xác định được policy cần áp dụng |
| 4 | Copy link hoặc mở related doc khi cần | Quick Action | Reuse được ngay trong công việc |

### Store Lead / Ops

| Step | Task | Task Type | Success Indicator |
|------|------|-----------|------------------|
| 1 | Mở library theo domain vận hành | Quick Action | Vào đúng khu vực SOP / policy |
| 2 | Xem tài liệu gần nhất hoặc most viewed | Reporting | Nhanh thấy tài liệu quan trọng |
| 3 | Mở tài liệu deprecated / replacement nếu cần | Exception Handling | Không dùng nhầm policy cũ |
| 4 | Gửi feedback nếu nội dung thiếu / sai | Exception Handling | Gap được ghi nhận |

## 5. Product Goals and Success Metrics

| Goal | KPI / Metric | Baseline | Target | Source |
|------|--------------|----------|--------|--------|
| Tăng self-service | `% search dẫn tới mở document detail` | Chưa đo | `>= 65%` | `knowledge_usage_log` |
| Giảm no-result | `no-result rate` | Chưa đo | `<= 15%` sau pilot | `M12 / knowledge search events` |
| Tăng reuse citation | `% AI citation được mở detail khi cần` | Chưa đo | `>= 30%` | `knowledge.library.document_opened` |

## 6. Scope Boundaries

### 6.1 In Scope

- Search / filter / library list
- Policy / FAQ / SOP detail
- Related documents
- Empty state / access denied / deprecated state
- Feedback gap từ library

### 6.2 Out of Scope

- Chỉnh sửa knowledge trong library
- External/public library cho end customers
- Mobile-native app optimization ở phase đầu

### 6.3 Non-Goals

- Không thay thế chat shell
- Không giải quyết toàn bộ governance của publish và source trong PRD này

## 7. Release Slice and Sequencing

| Slice | Goal | Included Features | Excluded Features | Dependency |
|-------|------|-------------------|-------------------|------------|
| `P1 Internal Desktop Library` | Cho đội nội bộ tra cứu trực tiếp | search, filter, detail, related docs | mobile/store optimization | `F-M08-KNW-001`, `F-M07-SEC-001` |
| `P1.5 Citation Deep-Link` | Mở detail từ AI answer trơn tru | anchor / deep-link / metadata trust | advanced personalization | `M09` |
| `P2 Wider Access` | Mở rộng sang store/mobile hoặc public-safe subset | role-based variants | full public library | policy approval |

## 8. Linked Features

| Feature ID | Feature Name | Purpose | Priority | Planned Status |
|------------|--------------|---------|----------|----------------|
| `F-M08-KNW-003` | FAQ and Policy Library | Self-service lookup | P1 | Draft |
| `F-M08-KNW-001` | Knowledge and Policy | Nguồn knowledge được hiển thị trong library | P0 | Draft |
| `F-M08-KNW-004` | Knowledge Documents and Source Governance | Filter trust / freshness / deprecated | P0 | Draft |
| `F-M07-SEC-001` | Access Control and Sensitivity | Kiểm quyền xem theo role / branch / channel | P0 | Draft |

## 9. Solution Direction

### 9.1 UX / IA Direction

Library phải được thiết kế theo `job-first taxonomy`, không theo tên collection hay module code. User nên bắt đầu từ domain công việc hoặc keyword, không phải từ cấu trúc hệ thống.

### 9.2 Functional Capabilities

- Search keyword
- Filter theo domain / doc type / role scope
- Detail page với rule chính + metadata
- Related docs + deprecated handling
- Feedback gap

### 9.3 Operational Rules

- Chỉ tài liệu `Published` mới hiển thị mặc định
- Deprecated doc phải cảnh báo rõ và dẫn sang replacement nếu có
- Kết quả search phải qua permission / sensitivity filter

### 9.4 Technical Constraints for Downstream Teams

- Search index cần đủ nhanh cho tra cứu hàng ngày
- Deep-link từ `M09` sang library detail phải ổn định
- Events search/open/no-result phải feed được `M12`

## 10. Assumptions and Dependencies

| ID | Assumption / Dependency | Risk if Wrong | Owner |
|----|-------------------------|---------------|-------|
| `A-001` | User nội bộ có nhu cầu lookup-first bên cạnh chat | Nếu sai, library bị dùng ít | A02 / PM |
| `A-002` | Taxonomy có thể nhóm theo domain công việc | Nếu không, UX filter sẽ rối | A02 / A06 |
| `D-001` | Permission filter từ `M07` sẵn sàng | Có thể lộ tài liệu sai scope | A05 / A08 |

## 11. Risks and Mitigations

| Risk | Type | Impact | Mitigation | Owner |
|------|------|--------|------------|-------|
| Taxonomy quá kỹ thuật | UX | User không tìm thấy tài liệu | Dùng nhãn theo job / domain công việc | A02 / A06 |
| Deprecated handling không rõ | Product | User dùng nhầm policy cũ | Bắt buộc banner + replacement link | A03 / A06 |
| Search chậm hoặc no-result cao | Adoption | User quay lại cách hỏi thủ công | Theo dõi no-result và bổ sung taxonomy/content | A10 / Knowledge Owner |

## 12. Open Questions

| ID | Question | Blocking? | Owner | Target Resolution Date |
|----|----------|-----------|-------|------------------------|
| `OQ-001` | Filter chính nên theo domain, persona, hay mixed model? | Yes | PM / A06 | 2026-04-18 |
| `OQ-002` | Có cần tách policy nội bộ và policy public-safe ngay từ P1 không? | Yes | Business Owner / PM | 2026-04-18 |
| `OQ-003` | P1 có cần support mobile/store trực tiếp không? | No | PM | 2026-04-20 |

## 13. Decision Log

| Date | Decision | Made By | Reason |
|------|----------|---------|--------|
| 2026-04-15 | Library được tách riêng khỏi knowledge core | Codex CLI / A01 PM Agent | Self-service lookup là một job khác với governance / publish |

## 14. Linked Artifacts

- Feature Registry: [01_Projects/MIABOS/Analysis/Features/_feature_registry.md](../../../Analysis/Features/_feature_registry.md)
- User Stories: `-`
- Feature SRS files:
  - [F-M08-KNW-003_FAQ_And_Policy_Library_SRS.md](../../../Analysis/Features/Modules/Knowledge_Center/FAQ_And_Policy_Library/SRS/F-M08-KNW-003_FAQ_And_Policy_Library_SRS.md)
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
