# PRD: FAQ and Policy Library

**Status**: Draft — Research Approved, Pending Business Owner PRD Approval
**Owner**: A02 Product Owner Agent
**Last Updated By**: A01 PM Agent (Claude Sonnet 4.6 — Claude Code CLI)
**Last Reviewed By**: A01 PM Agent
**Approval Required**: Business Owner
**Approved By**: -
**Last Status Change**: 2026-04-17
**Source of Truth**: This document
**Blocking Reason**: Chưa chốt external exposure boundary
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

- What is being proposed: Xây `FAQ and Policy Library` như một section trong page chung `/knowledge`, để Sales / CSKH / Store / Ops có thể tự tra cứu policy, FAQ, SOP mà không phải luôn đi qua chat.
- Why now: BQ cần internal AI phase 1, nhưng không phải mọi nhu cầu tri thức đều nên qua chat; library là bề mặt tự phục vụ song song để tăng adoption và giảm friction.
- Expected business and user outcome: Giảm câu hỏi lặp lại, tăng self-service, và tạo một bề mặt tham chiếu trực tiếp cho source reference của AI.
- Recommended decision: Approve library như P1 capability trong `Knowledge_Center`, nhưng không tách thành page riêng; đặt trong workspace `/knowledge` với cây thư mục category và preview/detail panel.

## 1. Business Context

### 1.1 Background

Nhiều câu hỏi nội bộ của BQ là dạng `chính sách nào đang áp dụng`, `quy trình xử lý ra sao`, `FAQ nào đúng cho tình huống này`. Chat là một entry point tốt, nhưng library vẫn cần tồn tại như nguồn tra cứu trực tiếp.

### 1.2 Problem Statement

Nếu không có thư viện chuẩn, người dùng sẽ phải tìm tài liệu rời rạc hoặc hỏi AI nhiều vòng. Điều này vừa chậm, vừa khó đối chiếu khi cần tự xác minh policy.

### 1.3 Why This Matters

Library giúp:
- tự phục vụ cho user nội bộ
- giảm tải cho người có kinh nghiệm
- tạo một bề mặt đích khi user bấm vào source reference từ AI answer
- đọc được tài liệu rich content có hình ảnh, bảng, attachment mà không phải tải file gốc ngay

### 1.4 Why Now

Library nên được định nghĩa cùng wave với knowledge core để UX / IA của `Knowledge_Center` không bị lệch giữa `chat-first` và `lookup-first`.

## 2. Target Users and Personas

| Persona | Role | Primary Pain | Desired Outcome | Priority |
|---------|------|--------------|-----------------|----------|
| Sales / CSKH | Người cần tra policy nhanh | Mất thời gian hỏi người khác | Search nhanh, mở detail rõ | P0 |
| Store Lead / Ops | Người xử lý SOP tại điểm bán | Tài liệu phân mảnh, khó biết bản mới nhất | Có library filter theo knowledge topic / cửa hàng / kênh | P1 |
| Knowledge Owner | Người duy trì nội dung | Khó biết tài liệu nào cần bổ sung | Có contact/escalation path từ no-result state | P1 |

## 3. Jobs To Be Done

| Persona | Job To Be Done | Current Friction | Product Opportunity |
|---------|----------------|------------------|---------------------|
| Sales / CSKH | Tra một policy hoặc FAQ ngay trong lúc xử lý khách | Tìm nhiều nguồn, không chắc bản mới nhất | Search + filter + detail với metadata rõ |
| Store Lead / Ops | Mở SOP hoặc policy đúng cho bối cảnh vận hành | Thiếu taxonomy và filter theo role / branch | Library có knowledge topic, doc type, related docs |
| Knowledge Owner | Bổ sung nội dung khi user không tìm thấy | No-result chưa có owner xử lý | No-result có contact/escalation path, không tạo gap object trong M08 |

## 4. User Task Flows  ⚠ Mandatory

### Sales / CSKH

| Step | Task | Task Type | Success Indicator |
|------|------|-----------|------------------|
| 1 | Mở `/knowledge`, search theo keyword hoặc chọn folder trong cây nội dung | Quick Action | Có kết quả phù hợp ban đầu |
| 2 | Lọc theo category `SOP / FAQ / Policy / System Guide`, knowledge topic, hoặc role scope | Quick Action | Thu hẹp đúng nhóm policy cần xem |
| 3 | Click tài liệu để xem preview/detail panel trong cùng page | Reporting | Xác định được policy cần áp dụng |
| 4 | Đọc rule chính, hình ảnh, bảng, attachment nếu tài liệu có rich content | Reporting | Không mất ngữ cảnh từ tài liệu gốc |
| 5 | Copy link hoặc mở related doc khi cần | Quick Action | Reuse được ngay trong công việc |

### Store Lead / Ops

| Step | Task | Task Type | Success Indicator |
|------|------|-----------|------------------|
| 1 | Mở `/knowledge`, chọn folder `SOP / Store Operation` hoặc knowledge topic vận hành | Quick Action | Vào đúng khu vực SOP / policy |
| 2 | Xem tài liệu gần nhất hoặc most viewed | Reporting | Nhanh thấy tài liệu quan trọng |
| 3 | Mở tài liệu deprecated / replacement nếu cần | Exception Handling | Không dùng nhầm policy cũ |
| 4 | Dùng contact/escalation path nếu nội dung thiếu / sai | Exception Handling | Có người xử lý tiếp |

## 5. Product Goals and Success Metrics

| Goal | KPI / Metric | Baseline | Target | Source |
|------|--------------|----------|--------|--------|
| Tăng self-service | `% search dẫn tới mở document detail` | Chưa đo | `>= 65%` | `M12 / observability nếu bật` |
| Giảm no-result | `no-result rate` | Chưa đo | `<= 15%` sau pilot | `M12 / observability nếu bật` |
| Tăng reuse từ AI answer | `% AI document/source reference được mở detail khi cần` | Chưa đo | `>= 30%` | `M12 / observability nếu bật` |

## 6. Scope Boundaries

### 6.1 In Scope

- Search / filter / library list
- Folder tree trong `/knowledge`, root gồm `SOP`, `FAQ`, `Policy`, `System Guide`, `Imported / Chờ phân loại`
- Policy / FAQ / SOP detail
- Rich document render: text, heading, table, image, attachment preview/link
- Related documents
- Empty state / access denied / deprecated state
- Contact/escalation path từ no-result state; không tạo object xử lý thiếu tri thức riêng trong M08

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
| `P1.5 Source Reference Deep-Link` | Mở detail từ AI answer trơn tru | anchor / deep-link / metadata trust | advanced personalization | `M09` |
| `P2 Wider Access` | Mở rộng sang store/mobile hoặc public-safe subset | role-based variants | full public library | policy approval |

## 8. Linked Features

| Feature ID | Feature Name | Purpose | Priority | Planned Status |
|------------|--------------|---------|----------|----------------|
| `F-M08-KNW-003` | FAQ and Policy Library | Self-service lookup | P1 | Draft |
| `F-M08-KNW-001` | Knowledge and Policy | Nguồn knowledge được hiển thị trong library | P0 | Draft |
| `F-M08-KNW-004` | Knowledge Documents and Source Governance | Filter trust / freshness / deprecated | P0 | Draft |
| `F-M07-SEC-001` | Access Control and Sensitivity | Kiểm quyền xem theo role / branch / channel | P0 | Draft |

## 9. Solution Direction

### 9.1 Chatbot + Library Relationship (từ Research Approved 2026-04-17)

Library và Chatbot là 2 entry points song song cho cùng 1 knowledge base — không thay thế nhau:

| Entry Point | Khi nào dùng | Mental model |
|-------------|-------------|--------------|
| **AI Chatbot** | User KHÔNG biết mình cần đọc tài liệu gì — hỏi tự nhiên | "Chính sách đổi trả là gì?" |
| **Library Browse** | User BIẾT mình cần tài liệu gì — mở trực tiếp | Mở folder Policy > Đổi trả |

3 Interaction Modes cho library (xem [RES-M08-KNW_UX_Patterns_And_IA.md](../../../../Research/Knowledge_Center/RES-M08-KNW_UX_Patterns_And_IA.md) §3):
- **Mode A: Instant lookup** — search keyword → detail panel ngay
- **Mode B: Guided browse** — category tree → folder → article → step-by-step
- **Mode C: Exploration** — overview card → drill-down sections

UX patterns bắt buộc trong library:
- **Quick reply chips**: sau search result, suggest related topics
- **Step-by-step guided flow**: cho tài liệu SOP — interactive checklist, không dump text
- **Stale content warning**: badge rõ khi tài liệu quá expiry date
- **Human escalation path**: nút "Báo nội dung sai / thiếu" luôn visible — không để dead-end

### 9.2 UX / IA Direction

Library là **content section trong `/knowledge`**, không phải `/knowledge/library` page riêng. User nên bắt đầu từ cây category hoặc keyword:

- `SOP`: quy trình thao tác, có SOP Step theo thứ tự
- `FAQ`: câu hỏi thường gặp, câu trả lời ngắn + link detail
- `Policy`: quy định, scope, exception, owner, effective date
- `System Guide`: hướng dẫn dùng SAP B1 / KiotViet / Haravan / MIABOS
- `Imported / Chờ phân loại`: tài liệu vừa sync/import chưa được owner phân loại

Library vẫn filter theo `knowledge topic`, nhưng không dùng tên collection, module code, hoặc taxonomy của Catalog & Commerce. User không phải đi theo product category/SKU hierarchy khi mục tiêu là tìm tri thức chính sách/quy trình.

### 9.2 Functional Capabilities

- Search keyword
- Browse bằng folder tree category/folder/topic
- Filter theo knowledge topic / doc type / role scope
- Detail panel với rule chính + metadata + rich content images/tables/attachments
- Related docs + deprecated handling
- SOP Step display cho tài liệu SOP
- Contact/escalation path khi không tìm thấy nội dung

### 9.3 Operational Rules

- Chỉ tài liệu `Published` mới hiển thị mặc định
- Deprecated doc phải cảnh báo rõ và dẫn sang replacement nếu có
- Kết quả search phải qua permission / sensitivity filter

### 9.4 Technical Constraints for Downstream Teams

- Search index cần đủ nhanh cho tra cứu hàng ngày
- Deep-link từ `M09` sang library detail phải ổn định
- Analytics search/open/no-result nếu cần thuộc `M12`; M08 không sở hữu usage analytics object

## 10. Assumptions and Dependencies

| ID | Assumption / Dependency | Risk if Wrong | Owner |
|----|-------------------------|---------------|-------|
| `A-001` | User nội bộ có nhu cầu lookup-first bên cạnh chat | Nếu sai, library bị dùng ít | A02 / PM |
| `A-002` | Taxonomy có thể nhóm theo knowledge topic công việc | Nếu không, UX filter sẽ rối | A02 / A06 |
| `D-001` | Permission filter từ `M07` sẵn sàng | Có thể lộ tài liệu sai scope | A05 / A08 |

## 11. Risks and Mitigations

| Risk | Type | Impact | Mitigation | Owner |
|------|------|--------|------------|-------|
| Taxonomy quá giống Catalog & Commerce | UX | User lẫn giữa tài liệu tri thức và dữ liệu sản phẩm | Dùng knowledge topic như Pricing Policy / Store SOP / System Usage | A02 / A06 |
| Deprecated handling không rõ | Product | User dùng nhầm policy cũ | Bắt buộc banner + replacement link | A03 / A06 |
| Search chậm hoặc no-result cao | Adoption | User quay lại cách hỏi thủ công | M12 đo nếu scope analytics mở; Knowledge Owner bổ sung content theo feedback/escalation | A10 / Knowledge Owner |
| Library bị tách khỏi Knowledge Center | UX | User phải nhớ nhiều route và mất context | Library là section trong `/knowledge`; detail mở ở panel/drawer | A06 / A07 |
| Tài liệu có hình ảnh nhưng detail chỉ render text | UX | SOP/policy có thể thiếu bước minh họa quan trọng | Detail panel phải render asset list và inline images | A03 / A06 |

## 12. Open Questions

| ID | Question | Blocking? | Owner | Target Resolution Date |
|----|----------|-----------|-------|------------------------|
| `OQ-001` | Filter chính nên theo knowledge topic, persona, hay mixed model? | No | PM / A06 | 2026-04-18 |
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
