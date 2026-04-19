# PRD: Knowledge Documents and Source Governance

**Status**: Draft — Research Approved, Pending Business Owner PRD Approval
**Owner**: A02 Product Owner Agent
**Last Updated By**: Codex CLI (GPT-5.4 Codex environment)
**Last Reviewed By**: A01 PM Agent
**Approval Required**: Business Owner
**Approved By**: -
**Last Status Change**: 2026-04-19
**Source of Truth**: This document
**Blocking Reason**: Chưa chốt final external exposure boundary
**Project**: MIABOS
**Module ID**: M08
**Phase**: PB-02 / PB-03
**Priority**: P0
**Products**: MIA Smart / Platform
**Created by**: A02 Product Owner Agent
**Date**: 2026-04-15
**Document Role**: Canonical product definition cho source governance và trust controls của Knowledge Center

---

## 0. Executive Summary

- What is being proposed: Xây lớp `Source Governance` như section `Source Health` trong `/knowledge`, để Knowledge Center biết nguồn nào đáng tin, còn mới, được phép cho kênh/persona nào, và tài liệu/assets nào đang phụ thuộc vào nguồn đó.
- Why now: BQ có tri thức và dữ liệu rải ở SAP B1, Haravan, KiotViet, Excel, tài liệu nội bộ, và đang dự định xây Data Warehouse riêng làm source-of-truth. MIABOS cần source governance để AI dùng đúng nguồn BQ cho phép mà không biến MIABOS thành kho dữ liệu nghiệp vụ mới.
- Expected business and user outcome: AI chỉ dùng đúng nguồn được phép, stale/restricted source được phát hiện sớm, và PM/Ops kiểm soát được trust layer.
- Recommended decision: Approve source governance như P0 foundation cùng `Knowledge Core`, nhưng giữ `Draft` đến khi source types và freshness policy được chốt.

## 1. Business Context

### 1.1 Background

BQ có nhiều nguồn khác nhau cho tri thức và dữ liệu. Business Owner đã clarify ngày 2026-04-19 rằng source-of-truth dữ liệu nghiệp vụ sẽ thuộc hệ thống BQ đang sở hữu và Data Warehouse BQ dự kiến. MIABOS chỉ tạo thêm `Conversation` và `Knowledge`; Knowledge Source Governance chỉ quản trị metadata, trust, freshness, và allowed-use của nguồn để chatbot, CRM, automation, và forecasting không bị drift.

### 1.2 Problem Statement

Nếu không có source registry và rule trust/freshness, cùng một knowledge topic có thể bị trả từ nguồn đã cũ hoặc chưa được phép, đặc biệt ở pricing policy, CTKM, và hướng dẫn vận hành. CTKM không phải pain point của BQ; đây là miền dữ liệu/use case cần AI tra cứu đúng context. Dữ liệu sản phẩm/tồn/giá/đơn đã nằm ở Catalog & Commerce và hệ nguồn BQ; Knowledge Center chỉ lưu source metadata/linking cho tài liệu tri thức.

### 1.3 Why This Matters

Source governance giúp:
- xác định nguồn nào được phép dùng
- phát hiện `stale` và `restricted source`
- phân biệt source cho `internal AI` và `external AI`
- nhìn được tài liệu import/hình ảnh/attachment nào bị ảnh hưởng khi source stale/restricted

### 1.4 Why Now

Nếu để source governance sau khi AI đã vận hành, đội dự án sẽ phải xử lý trust problem muộn và tốn nhiều rework ở `M09`, `M10`, và `M12`.

## 2. Target Users and Personas

| Persona | Role | Primary Pain | Desired Outcome | Priority |
|---------|------|--------------|-----------------|----------|
| PM / Governance | Người kiểm soát trust layer | Không biết nguồn nào đang được AI dùng | Có source registry, rule, stale/restricted view | P0 |
| Knowledge Owner | Người gắn tài liệu với nguồn | Khó chứng minh tài liệu đến từ đâu | Có source link và owner rõ | P0 |
| Ops / Reviewer | Người kiểm tra vận hành | Khó phát hiện nguồn cũ hoặc nguồn bị hạn chế | Có alert và corrective-action path | P1 |

## 3. Jobs To Be Done

| Persona | Job To Be Done | Current Friction | Product Opportunity |
|---------|----------------|------------------|---------------------|
| PM / Governance | Biết nguồn nào được AI dùng và vì sao | Không có registry / rule rõ | Source registry + rule engine trong `/knowledge` |
| Knowledge Owner | Gắn knowledge/assets với nguồn đáng tin | Metadata và ownership mơ hồ | Bắt buộc owner / source type / trust level |
| Ops / Reviewer | Phát hiện stale/restricted source trước khi lan ra runtime | Không có health view rõ | Freshness board + source health status |

## 4. User Task Flows  ⚠ Mandatory

### PM / Governance

| Step | Task | Task Type | Success Indicator |
|------|------|-----------|------------------|
| 1 | Mở `/knowledge`, vào section `Source Health`, đăng ký hoặc rà soát source trong registry | Configuration | Source có metadata đầy đủ |
| 2 | Cấu hình trust level, freshness rule, allowed channel | Configuration | Rule áp vào đúng source |
| 3 | Xem stale/restricted source health | Reporting | Thấy rõ nguồn nào có vấn đề |
| 4 | Quyết định restrict/unrestrict hoặc escalate ngoài M08 | Exception Handling | Runtime chỉ dùng nguồn safe |

### Knowledge Owner

| Step | Task | Task Type | Success Indicator |
|------|------|-----------|------------------|
| 1 | Liên kết knowledge item và imported assets với source | Configuration | Document có source hợp lệ |
| 2 | Kiểm tra source còn active và đủ trust không | Quick Action | Không link nhầm source stale |
| 3 | Cập nhật source note khi có thay đổi | Configuration | Metadata luôn mới |
| 4 | Phối hợp xử lý source health warning nếu bị cảnh báo | Exception Handling | Source được cập nhật hoặc restrict trước runtime |

## 5. Product Goals and Success Metrics

| Goal | KPI / Metric | Baseline | Target | Source |
|------|--------------|----------|--------|--------|
| Chuẩn hóa source ownership | `% source có owner + trust rule + freshness rule` | Chưa đo | `100%` | `knowledge_source_registry` |
| Giảm rủi ro source stale | `% source stale vượt SLA` | Chưa đo | `<= 10%` | `M12 / freshness monitor` |
| Giảm rủi ro nguồn bị hạn chế | `% source restricted không được runtime dùng` | Chưa đo | `100%` | `knowledge_source_registry` |

## 6. Scope Boundaries

### 6.1 In Scope

- Source registry
- Source type / trust / freshness / allowed channel rules
- Link document/assets với source
- Stale / restricted states

### 6.2 Out of Scope

- Integration implementation chi tiết của từng hệ
- Business analytics/ROI dashboards
- Tự động reconcile dữ liệu giữa SAP/KiotViet/Haravan bằng AI

### 6.3 Non-Goals

- Không thay thế `I05 Canonical Mapping and Source Boundary`
- Không thay thế Data Warehouse/source-of-truth của BQ
- Không trở thành MDM platform đầy đủ cho mọi domain

## 7. Release Slice and Sequencing

| Slice | Goal | Included Features | Excluded Features | Dependency |
|-------|------|-------------------|-------------------|------------|
| `P1 Source Registry` | Có danh mục nguồn và rule tối thiểu | source registry, owner, trust level, allowed channel | advanced automation | `I05`, `M07` |
| `P1.5 Freshness and Source Health` | Nhìn ra stale/restricted source sớm | freshness rule, stale flag, restricted state | automated auto-fix | `M12` |
| `P2 External-safe Governance` | Tách source cho internal vs external AI | channel-specific source rules | broad public exposure | sales-safe policy |

## 8. Linked Features

| Feature ID | Feature Name | Purpose | Priority | Planned Status |
|------------|--------------|---------|----------|----------------|
| `F-M08-KNW-004` | Knowledge Documents and Source Governance | Source registry + freshness + restricted-source governance | P0 | Draft |
| `F-M08-KNW-001` | Knowledge and Policy | Consumer của source governance | P0 | Draft |
| `F-I05-INT-001` | Canonical Mapping and Source Boundary | Mapping/priority logic giữa các hệ theo source owner BQ/Data Warehouse | P0 | Draft |
| `F-M07-SEC-001` | Access Control and Sensitivity | Allowed persona/channel filter | P0 | Draft |
| `F-M12-OBS-001` | Audit and Observability | stale/restricted monitoring nếu scope analytics mở | P1 | Draft |

## 9. Solution Direction

### 9.1 Source Governance & Chatbot Trust (từ Research Approved 2026-04-17)

Source governance là tầng **trust infrastructure** cho chatbot Gen 3 RAG. Từ research benchmark:
- **Verified Knowledge > Volume**: ít tài liệu nhưng được verify và có owner còn tốt hơn nhiều tài liệu stale (Guru lesson)
- **Trust = Citation + Honesty**: chatbot chỉ cite source có valid trust level — source stale/restricted → chatbot dùng Uncertainty Signal thay vì trả lời từ nguồn cũ
- Freshness signal từ source governance feed trực tiếp vào **Stale Content Warning** pattern ở chatbot và library

Mapping source → chatbot behavior:
| Source Status | Chatbot Behavior |
|--------------|-----------------|
| Active + fresh | Retrieve bình thường + cite |
| Active + stale (warning) | Retrieve theo rule cho phép + hiển thị stale badge theo freshness threshold `1 giờ` phase 1 |
| Restricted | Không retrieve — Uncertainty Signal + escalation path |
| Inactive | Không retrieve |

Xem [RES-M08-KNW_UX_Patterns_And_IA.md](../../../Research/Knowledge_Center/RES-M08-KNW_UX_Patterns_And_IA.md) §2 Pattern 2-3, [RES-M08-KNW_Internal_Chatbot_Concept.md](../../../Research/Knowledge_Center/RES-M08-KNW_Internal_Chatbot_Concept.md) §3 Pillar 2, và [RES-M08-KNW_Paradigm_And_Benchmark.md](../../../Research/Knowledge_Center/RES-M08-KNW_Paradigm_And_Benchmark.md) §6 Insight 1.

### 9.2 UX / IA Direction

Source governance là bề mặt cho PM/Ops/Governance trong `/knowledge`, không phải user-facing module rời. UI phải ưu tiên `registry`, `freshness`, `restricted state`, và affected documents/assets hơn là editing comfort.

### 9.2 Functional Capabilities

- Register/update source
- Define trust / freshness / allowed usage rules
- Link documents/assets to sources
- Detect stale / restricted source status
- Feed runtime warning contract: `fresh`, `stale`, `restricted`, `inactive`, `scope searched`, and escalation owner for M09 uncertainty/stale patterns

### 9.3 Operational Rules

- Mỗi source phải có owner
- Source không có freshness rule thì không được active; phase 1 default freshness threshold là `1 giờ` cho SAP B1, KiotViet, Excel upload, và tài liệu viết tay
- Source bị restricted không được dùng cho runtime answer mới
- Internal AI và external AI có thể dùng khác source set

### 9.4 Technical Constraints for Downstream Teams

- Cần interlock với `I05` để không nhân đôi source-boundary/source-priority logic
- Stale/restricted events có thể feed `M12` nếu scope observability mở
- Runtime source filtering phải áp được theo channel và persona

## 10. Assumptions and Dependencies

| ID | Assumption / Dependency | Risk if Wrong | Owner |
|----|-------------------------|---------------|-------|
| `A-001` | Source types của BQ có thể chuẩn hóa thành danh mục hữu hạn | Rule engine khó maintain | A02 / PM |
| `A-002` | Có thể lấy freshness signal tối thiểu từ nguồn hoặc owner | Không đo được stale | A05 / A08 |
| `D-001` | `I05` và `M07` sẽ cung cấp priority + permission logic | Governance bị rời rạc | A05 |

## 11. Risks and Mitigations

| Risk | Type | Impact | Mitigation | Owner |
|------|------|--------|------------|-------|
| Source types quá nhiều hoặc mơ hồ | Product / Data | Rule governance rối | Chốt taxonomy source types theo P1 | PM / A02 |
| Freshness SLA không khả thi | Operational | Cảnh báo stale vô nghĩa | Phase 1 dùng threshold chung `1 giờ`, sau pilot mới xét phân lớp SLA | PM / Ops |
| Data reconciliation bị kéo vào Knowledge Center | Governance | M08 phình scope, trùng Catalog & Commerce | Chỉ lưu source metadata/linking; reconciliation thuộc integration/Catalog & Commerce hoặc BE phase | PM |
| Không thấy asset impact khi source stale | UX / Governance | Tài liệu import có hình ảnh/attachment lỗi nhưng governance không thấy | Source detail hiển thị linked documents/assets và affected counts | A03 / A06 |

## 12. Open Questions

| ID | Question | Blocking? | Owner | Target Resolution Date |
|----|----------|-----------|-------|------------------------|
| `OQ-001` | Bộ source types chuẩn cho BQ là gì? | Yes | Business Owner / PM | 2026-04-18 |
| `OQ-002` | Freshness SLA có tách theo `policy / system guide / pricing note / promotion note` không? | Yes | PM / Ops | 2026-04-19 |
| `OQ-003` | Rule source nào được phép cho external AI ở phase 2? | Yes | Business Owner / PM | 2026-04-20 |

## 13. Decision Log

| Date | Decision | Made By | Reason |
|------|----------|---------|--------|
| 2026-04-15 | Source governance được tách riêng khỏi knowledge core | Codex CLI / A01 PM Agent | Trust layer cần artifact riêng để gate kiến trúc và operational rules |
| 2026-04-17 | Source governance là section `Source Health` trong `/knowledge` và phải hiển thị affected documents/assets | Codex CLI / A01 PM Agent | Giữ Knowledge Center thống nhất và hỗ trợ tài liệu import rich content |
| 2026-04-17 | Freshness phase 1 dùng threshold chung `1 giờ`; không tạo workflow xử lý mismatch dữ liệu trong M08 | Codex CLI / A01 PM Agent | Align với quyết định BO và giữ source governance ở mức warning/restricted health |
| 2026-04-19 | Source governance không được định vị MIABOS là source-of-truth dữ liệu nghiệp vụ; BQ Data Warehouse và hệ thống BQ giữ ownership nguồn | Business Owner / Codex CLI | Reposition MIABOS thành Core AI CRM Platform, chỉ tạo Conversation + Knowledge |

## 14. Linked Artifacts

- Feature Registry: [01_Projects/MIABOS/Analysis/Features/_feature_registry.md](../../../Analysis/Features/_feature_registry.md)
- User Stories: `-`
- Feature SRS files:
  - [F-M08-KNW-004_Knowledge_Documents_And_Source_Governance_SRS.md](../../../Analysis/Features/Modules/Knowledge_Center/Knowledge_Documents_And_Source_Governance/SRS/F-M08-KNW-004_Knowledge_Documents_And_Source_Governance_SRS.md)
- UXUI specs: `-`
- Architecture / Integration Specs:
  - [F-I05-INT-001_Canonical_Mapping_And_Source_Of_Truth_SRS.md](../../../Analysis/Features/Integration/SRS/F-I05-INT-001_Canonical_Mapping_And_Source_Of_Truth_SRS.md)
- Research / Evidence:
  - [RES-M08-KNW_UX_Patterns_And_IA.md](../../../Research/Knowledge_Center/RES-M08-KNW_UX_Patterns_And_IA.md)
  - [RES-M08-KNW_Knowledge_Center_Layout_And_Rich_Document_Research.md](../../../Research/Knowledge_Center/RES-M08-KNW_Knowledge_Center_Layout_And_Rich_Document_Research.md)
  - [2026-04-13_BQ_Customer_Research_Pack.md](../../../../04_Raw_Information/Customers/Giay_BQ/2026-04-13_BQ_Customer_Research_Pack.md)
  - [2026-04-13_BQ_Systems_And_Integration_Landscape.md](../../../../04_Raw_Information/Customers/Giay_BQ/2026-04-13_BQ_Systems_And_Integration_Landscape.md)

## 15. Approval Checklist

- [x] Business case is explicit
- [x] Primary personas are identified
- [x] User Task Flows are complete
- [x] In-scope release slice is explicit
- [x] Success metrics are measurable
- [x] Major assumptions are recorded
- [x] Open blockers are explicit
- [ ] Business Owner approved this PRD
