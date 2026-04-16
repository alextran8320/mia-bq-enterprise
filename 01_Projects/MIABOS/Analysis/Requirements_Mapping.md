# Requirements Mapping: F-M09-AIC-001 Internal AI Chat

**Gate Required By**: Gate 2 - Scope -> Design (PB-01 -> PB-02)
**Owner**: A03 BA Agent
**Status**: In Review
**Last Updated By**: Codex CLI (GPT-5 Codex)
**Last Reviewed By**: A03 BA Agent
**Approval Required**: PM
**Approved By**: -
**Last Status Change**: 2026-04-16
**Source of Truth**: This document
**Blocking Reason**: -

---

## Project

- **Project**: MIABOS / AI Workspace
- **SRS Reference**: [Analysis/Features/Modules/AI_Workspace/Internal_AI_Chat/SRS/F-M09-AIC-001_Internal_AI_Chat_SRS.md](./Features/Modules/AI_Workspace/Internal_AI_Chat/SRS/F-M09-AIC-001_Internal_AI_Chat_SRS.md)
- **PRD Reference**: [Planning/PRD/AI_Workspace/PRD-M09-AIC-001_Internal_AI_Chat.md](../Planning/PRD/AI_Workspace/PRD-M09-AIC-001_Internal_AI_Chat.md)
- **User Story Reference**: [Planning/Stories/AI_Workspace/US-M09-AIC-001_Internal_AI_Chat_FE_Preview.md](../Planning/Stories/AI_Workspace/US-M09-AIC-001_Internal_AI_Chat_FE_Preview.md)

---

## Requirements Traceability Matrix

| AC Code | Requirement | Source (SRS / planned PRD) | Design Artifact | Build Component | Test Case | Status |
|---------|-------------|----------------------------|-----------------|-----------------|-----------|--------|
| AC-001 | Query được classify thành `Policy`, `Data`, `Mixed`, hoặc `Unsupported` theo rule phase 1. | SRS §5, planned PRD | UXUI answer-state mapping | FE chat shell routing | Intent classification test | ☐ Not Started |
| AC-002 | Policy và Mixed answer phải có citation hợp lệ, freshness, warning, và next action rõ ràng. | SRS §11, §18 | Answer card, citation block | Answer rendering layer | Policy/Mixed response test | ☐ Not Started |
| AC-003 | Data và Mixed answer phải tách rõ phần data snapshot và phần policy explanation. | SRS §5, §9, §15 | Mixed answer layout | Snapshot payload renderer | Mixed answer split test | ☐ Not Started |
| AC-004 | Blocked / Unsupported state phải nêu lý do business-friendly và có next action hoặc escalation path. | SRS §7, §9, §22 | Blocked state, escalation CTA | Blocked state renderer | Blocked-state test | ☐ Not Started |
| AC-005 | Access check phải chạy trước render và không được lộ raw payload ngoài scope. | SRS §3, §10, §11 | M07 guardrail handoff | Access-evaluate hook | Permission-block test | ☐ Not Started |

**Status values**: ☐ Not Started -> 🔄 In Design -> 🔨 In Build -> 🧪 In Test -> ✅ Done

---

## Functional Requirements

| # | Requirement | Priority | AC Code | Notes |
|---|-------------|----------|---------|-------|
| FR-001 | Phase-1 chat shell phải routing đúng intent taxonomy canonical. | Must Have | AC-001 | Policy/Data/Mixed/Unsupported |
| FR-002 | Answer card phải hiển thị conclusion, evidence, freshness, warning, và next action. | Must Have | AC-002 | Trust-first layout |
| FR-003 | Mixed answer phải tách data snapshot và policy explanation thành 2 khối rõ. | Must Have | AC-003 | Không merge lẫn content |
| FR-004 | Blocked / Unsupported answer phải giải thích được lý do và hướng tiếp theo. | Must Have | AC-004 | Có escalation CTA |
| FR-005 | Mọi render phải đi qua M07 access check trước khi hiển thị chi tiết. | Must Have | AC-005 | Default deny when ambiguous |

---

## Non-Functional Requirements

| # | Requirement | Category | Acceptance Criteria | Notes |
|---|-------------|----------|---------------------|-------|
| NFR-001 | `POST /mia/chat/query` trả answer đầu tiên trong `<= 4 giây` cho `95%` phase-1 queries. | Performance | p95 latency <= 4s | SRS §17 |
| NFR-002 | `chat_answer_snapshot` và `chat_audit_log` được giữ tối thiểu `180 ngày`. | Retention | Retention policy documented and implemented | SRS §17 |
| NFR-003 | Low-confidence handling phải deterministic và chỉ hỏi lại đúng 1 lần trước escalation/block. | Reliability | Same input, same decision path | SRS §22 |

---

## Out of Scope

| # | Item | Reason | Future Phase? |
|---|------|--------|---------------|
| OOS-001 | Autonomous action execution from chat answer. | Phase 1 chỉ tư vấn và hướng dẫn, không tự động thao tác nghiệp vụ. | Yes |
| OOS-002 | Raw ERP / raw JSON exposure in answer UI. | Không phù hợp business users và vi phạm trust boundary. | No |
| OOS-003 | ML-score based routing thay cho rule-based gate phase 1. | Phase 1 cần deterministic behavior để dễ audit. | Maybe later |

---

## Open Questions

| # | Question | Owner | Due Date | Answer |
|---|----------|-------|----------|--------|
| Q-001 | Phase-1 routing, low-confidence handling, và source-trace contract đã chốt chưa? | A03 BA Agent | 2026-04-16 | Đã chốt trong SRS `F-M09-AIC-001` section 22; không còn blocker cho SRS Ready. |

---

## Gate 2 Checklist

Before passing Gate 2, verify:
- [ ] All PRD requirements have AC codes
- [ ] All AC codes are traceable to design artifacts
- [ ] Out-of-scope items are explicitly documented
- [ ] Open questions are resolved or deferred with owner assigned
- [ ] Business Owner has reviewed and confirmed scope

---

## Reference

- PRD: [Planning/PRD/AI_Workspace/PRD-M09-AIC-001_Internal_AI_Chat.md](../Planning/PRD/AI_Workspace/PRD-M09-AIC-001_Internal_AI_Chat.md)
- User Story: [Planning/Stories/AI_Workspace/US-M09-AIC-001_Internal_AI_Chat_FE_Preview.md](../Planning/Stories/AI_Workspace/US-M09-AIC-001_Internal_AI_Chat_FE_Preview.md)
- SRS: [Analysis/Features/Modules/AI_Workspace/Internal_AI_Chat/SRS/F-M09-AIC-001_Internal_AI_Chat_SRS.md](./Features/Modules/AI_Workspace/Internal_AI_Chat/SRS/F-M09-AIC-001_Internal_AI_Chat_SRS.md)
- Gate 2 requirements: `../../../../00_Agent_OS/Rules/Quality_Gates.md` (line 22)
- Playbook: `../../../../00_Agent_OS/Playbooks/PB-01_Clarify_and_Scope.md`
