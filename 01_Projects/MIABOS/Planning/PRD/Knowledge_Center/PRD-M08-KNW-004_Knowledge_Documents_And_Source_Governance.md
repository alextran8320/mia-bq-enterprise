# PRD: Knowledge Documents and Source Governance

**Status**: Draft
**Owner**: A02 Product Owner Agent
**Last Updated By**: Codex CLI (GPT-5 Codex)
**Last Reviewed By**: A01 PM Agent
**Approval Required**: Business Owner
**Approved By**: -
**Last Status Change**: 2026-04-15
**Source of Truth**: This document
**Blocking Reason**: Chưa chốt source types, freshness SLA theo nguồn, và rule source nào được phép cho internal AI vs external AI
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

- What is being proposed: Xây lớp `Source Governance` để Knowledge Center biết nguồn nào đáng tin, còn mới, được phép cho kênh nào, và conflict nào cần xử lý.
- Why now: BQ có tri thức và dữ liệu rải ở SAP B1, Haravan, KiotViet, Excel, và tài liệu nội bộ; không có source governance thì AI sẽ mất trust rất nhanh.
- Expected business and user outcome: AI chỉ dùng đúng nguồn được phép, stale/conflict được phát hiện sớm, và PM/Ops kiểm soát được trust layer.
- Recommended decision: Approve source governance như P0 foundation cùng `Knowledge Core`, nhưng giữ `Draft` đến khi source types và freshness policy được chốt.

## 1. Business Context

### 1.1 Background

BQ có nhiều nguồn khác nhau cho tri thức và dữ liệu. Requirement pack đã chỉ ra bài toán source-of-truth là nền để chatbot, CRM, automation, và forecasting không bị drift.

### 1.2 Problem Statement

Nếu không có source registry và rule trust/freshness, cùng một domain knowledge có thể bị trả từ các nguồn mâu thuẫn hoặc đã cũ, đặc biệt ở pricing, CTKM, và hướng dẫn vận hành.

### 1.3 Why This Matters

Source governance giúp:
- xác định nguồn nào được phép dùng
- phát hiện `stale` và `conflict`
- phân biệt source cho `internal AI` và `external AI`

### 1.4 Why Now

Nếu để source governance sau khi AI đã vận hành, đội dự án sẽ phải xử lý trust problem muộn và tốn nhiều rework ở `M09`, `M10`, và `M12`.

## 2. Target Users and Personas

| Persona | Role | Primary Pain | Desired Outcome | Priority |
|---------|------|--------------|-----------------|----------|
| PM / Governance | Người kiểm soát trust layer | Không biết nguồn nào đang được AI dùng | Có source registry, rule, stale/conflict view | P0 |
| Knowledge Owner | Người gắn tài liệu với nguồn | Khó chứng minh tài liệu đến từ đâu | Có source link và owner rõ | P0 |
| Ops / Reviewer | Người kiểm tra vận hành | Khó phát hiện nguồn cũ / mâu thuẫn | Có alert và corrective-action path | P1 |

## 3. Jobs To Be Done

| Persona | Job To Be Done | Current Friction | Product Opportunity |
|---------|----------------|------------------|---------------------|
| PM / Governance | Biết nguồn nào được AI dùng và vì sao | Không có registry / rule rõ | Source registry + rule engine |
| Knowledge Owner | Gắn knowledge với nguồn đáng tin | Metadata và ownership mơ hồ | Bắt buộc owner / source type / trust level |
| Ops / Reviewer | Phát hiện stale / conflict trước khi lan ra runtime | Không có dashboard/case rõ | Freshness board + conflict case list |

## 4. User Task Flows  ⚠ Mandatory

### PM / Governance

| Step | Task | Task Type | Success Indicator |
|------|------|-----------|------------------|
| 1 | Đăng ký hoặc rà soát source trong registry | Configuration | Source có metadata đầy đủ |
| 2 | Cấu hình trust level, freshness rule, allowed channel | Configuration | Rule áp vào đúng source |
| 3 | Xem stale / conflict cases | Reporting | Thấy rõ nguồn nào có vấn đề |
| 4 | Quyết định restrict / resolve / escalate | Exception Handling | Runtime chỉ dùng nguồn safe |

### Knowledge Owner

| Step | Task | Task Type | Success Indicator |
|------|------|-----------|------------------|
| 1 | Liên kết knowledge item với source | Configuration | Document có source hợp lệ |
| 2 | Kiểm tra source còn active và đủ trust không | Quick Action | Không link nhầm source stale |
| 3 | Cập nhật source note khi có thay đổi | Configuration | Metadata luôn mới |
| 4 | Phối hợp xử lý conflict nếu bị cảnh báo | Exception Handling | Conflict được resolve trước publish |

## 5. Product Goals and Success Metrics

| Goal | KPI / Metric | Baseline | Target | Source |
|------|--------------|----------|--------|--------|
| Chuẩn hóa source ownership | `% source có owner + trust rule + freshness rule` | Chưa đo | `100%` | `knowledge_source_registry` |
| Giảm rủi ro source stale | `% source stale vượt SLA` | Chưa đo | `<= 10%` | `M12 / freshness monitor` |
| Kiểm soát conflict | `open conflict backlog` | Chưa đo | `< 5 case P1 kéo dài > 7 ngày` | `knowledge_conflict_case` |

## 6. Scope Boundaries

### 6.1 In Scope

- Source registry
- Source type / trust / freshness / allowed channel rules
- Link document với source
- Stale / conflict / restricted states

### 6.2 Out of Scope

- Integration implementation chi tiết của từng hệ
- Business analytics/ROI dashboards
- Tự động resolve conflict bằng AI

### 6.3 Non-Goals

- Không thay thế `I05 Canonical Mapping and Source of Truth`
- Không trở thành MDM platform đầy đủ cho mọi domain

## 7. Release Slice and Sequencing

| Slice | Goal | Included Features | Excluded Features | Dependency |
|-------|------|-------------------|-------------------|------------|
| `P1 Source Registry` | Có danh mục nguồn và rule tối thiểu | source registry, owner, trust level, allowed channel | advanced automation | `I05`, `M07` |
| `P1.5 Freshness and Conflict` | Nhìn ra stale / conflict sớm | freshness rule, stale flag, conflict case | automated auto-fix | `M12` |
| `P2 External-safe Governance` | Tách source cho internal vs external AI | channel-specific source rules | broad public exposure | sales-safe policy |

## 8. Linked Features

| Feature ID | Feature Name | Purpose | Priority | Planned Status |
|------------|--------------|---------|----------|----------------|
| `F-M08-KNW-004` | Knowledge Documents and Source Governance | Source registry + freshness + conflict | P0 | Draft |
| `F-M08-KNW-001` | Knowledge and Policy | Consumer của source governance | P0 | Draft |
| `F-I05-INT-001` | Canonical Mapping and Source of Truth | Mapping/priority logic giữa các hệ | P0 | Draft |
| `F-M07-SEC-001` | Access Control and Sensitivity | Allowed persona/channel filter | P0 | Draft |
| `F-M12-OBS-001` | Audit and Observability | stale/conflict monitoring | P1 | Draft |

## 9. Solution Direction

### 9.1 UX / IA Direction

Source governance là bề mặt cho PM/Ops/Governance, không phải user-facing module. UI phải ưu tiên `registry`, `freshness`, `conflict`, và `restricted state` hơn là editing comfort.

### 9.2 Functional Capabilities

- Register/update source
- Define trust / freshness / allowed usage rules
- Link documents to sources
- Detect stale / conflict / restricted cases

### 9.3 Operational Rules

- Mỗi source phải có owner
- Source không có freshness rule thì không được active
- Source bị restricted không được dùng cho runtime answer mới
- Internal AI và external AI có thể dùng khác source set

### 9.4 Technical Constraints for Downstream Teams

- Cần interlock với `I05` để không nhân đôi source-of-truth logic
- Stale/conflict events phải feed `M12`
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
| Freshness SLA không khả thi | Operational | Cảnh báo stale vô nghĩa | Phân lớp SLA theo source type / domain | PM / Ops |
| Conflict nhiều nhưng không ai sở hữu | Governance | AI trả lời thiếu tin cậy | Gắn owner và escalation rule cho conflict case | PM |

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

## 14. Linked Artifacts

- Feature Registry: [01_Projects/MIABOS/Analysis/Features/_feature_registry.md](../../../Analysis/Features/_feature_registry.md)
- User Stories: `-`
- Feature SRS files:
  - [F-M08-KNW-004_Knowledge_Documents_And_Source_Governance_SRS.md](../../../Analysis/Features/Modules/Knowledge_Center/Knowledge_Documents_And_Source_Governance/SRS/F-M08-KNW-004_Knowledge_Documents_And_Source_Governance_SRS.md)
- UXUI specs: `-`
- Architecture / Integration Specs:
  - [F-I05-INT-001_Canonical_Mapping_And_Source_Of_Truth_SRS.md](../../../Analysis/Features/Integration/SRS/F-I05-INT-001_Canonical_Mapping_And_Source_Of_Truth_SRS.md)
- Research / Evidence:
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
