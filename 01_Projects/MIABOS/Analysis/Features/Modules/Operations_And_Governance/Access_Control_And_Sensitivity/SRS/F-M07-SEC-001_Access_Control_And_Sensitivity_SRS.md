# Feature SRS: F-M07-SEC-001 Access Control and Sensitivity

**Status**: Draft
**Owner**: A03 BA Agent
**Last Updated By**: Codex CLI (GPT-5 Codex)
**Last Reviewed By**: A01 PM Agent
**Approval Required**: PM
**Approved By**: -
**Last Status Change**: 2026-04-15
**Source of Truth**: This document
**Blocking Reason**: Cần chốt scope matrix theo branch/store/channel/role và public-safe response policy
**Module**: M07
**Phase**: PB-02 / PB-03
**Priority**: High
**Document Role**: SRS high-level cho module phân quyền, data scope, sensitivity, và public-safe policy

---

## 0. Metadata

- Feature ID: `F-M07-SEC-001`
- Related User Story: `US-M07-SEC-001`
- Related Screens: role/scope config, sensitivity policy config, public-safe rule config
- Related APIs: `POST /mia/access/evaluate`, `POST /mia/public-safe/evaluate`
- Related Tables: `mia_user_scope_profile`, `sensitivity_rule`, `public_safe_response_policy`
- Related Events: `access.rule.updated`, `public.safe.policy.updated`
- Related Error IDs: `SEC-001`

## 1. User Story

Là PM / Admin / Ops Governance, tôi muốn MIABOS tự quản lý access, scope, sensitivity, và public-safe policy để AI không lộ dữ liệu sai ngữ cảnh.

## 1A. User Task Flow

| Step | User Role | Action | Task Type | Notes |
|------|-----------|--------|-----------|-------|
| 1 | Admin | Cấu hình role và data scope | Configuration | Entry |
| 2 | Admin | Cấu hình sensitivity và public-safe policy | Configuration | Governance |
| 3 | Hệ thống | Evaluate quyền trước khi trả câu trả lời | Quick Action | Runtime |

## 2. Business Context

Đây là lớp bảo vệ bắt buộc để integration data không bị AI trả sai người, sai kênh, sai mức chi tiết.

## 3. Preconditions

- Branch/channel mapping đã có.

## 4. Postconditions

- Mọi answer đều đi qua scope và sensitivity gate.

## 5. Main Flow

Resolve actor -> resolve scope -> evaluate sensitivity -> trim answer projection.

## 6. Alternate Flows

Internal mode, sales-safe mode, escalation-only mode.

## 7. Error Flows

Policy missing, scope conflict, hoặc public-safe deny.

## 8. State Machine

`Draft -> Active -> Warning / Blocked`

## 9. UX / Screen Behavior

Admin phải nhìn thấy rule effect rõ ràng.

## 10. Role / Permission Rules

Module này là authority cho `M09` và `M10`.

## 11. Business Rules

MIA không phụ thuộc vào phân quyền gốc của SAP/HAR/KV.

## 12. API Contract Excerpt + Canonical Links

Feed mọi module AI/business có dữ liệu nhạy cảm.

## 13. Event / Webhook Contract Excerpt + Canonical Links

Phát `access.rule.updated` và `public.safe.policy.updated`.

## 14. Data / DB Impact Excerpt + Canonical Links

Quản trị `mia_user_scope_profile`, `sensitivity_rule`, `public_safe_response_policy`.

## 15. Validation Rules

Không có answer nào được bypass module này.

## 16. Error Codes

`SEC-001`: Policy evaluation failed.

## 17. Non-Functional Requirements

Deterministic và auditable.

## 18. Acceptance Criteria

Chặn được data vượt scope và public-safe violations.

## 19. Test Scenarios

Internal allowed, public denied, branch-scope denied.

## 20. Observability

Theo dõi denied count và overridden answer count.

## 21. Rollout / Feature Flag

Bắt buộc trước khi mở AI cho người dùng thật.

## 22. Open Questions

Scope granularity theo channel / branch / store type là gì?

## 23. Definition of Done

Có gate kiểm soát answer projection chạy được phase 1.

## 24. Ready-for-UXUI Checklist

- [ ] UXUI đã chốt policy config screens

## 25. Ready-for-FE-Preview Checklist

- [ ] FE Preview có mock allow/deny/warning states

## 26. Ready-for-BE / Integration Promotion Checklist

- [ ] BE evaluation contract đã rõ
