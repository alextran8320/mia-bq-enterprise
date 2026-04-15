# Feature SRS: F-M12-OBS-001 Audit and Observability

**Status**: Draft
**Owner**: A03 BA Agent
**Last Updated By**: Codex CLI (GPT-5 Codex)
**Last Reviewed By**: A01 PM Agent
**Approval Required**: PM
**Approved By**: -
**Last Status Change**: 2026-04-15
**Source of Truth**: This document
**Blocking Reason**: Cần chốt metric pack, audit retention, và alerting boundary giữa ops và business review
**Module**: M12
**Phase**: PB-02 / PB-03
**Priority**: High
**Document Role**: SRS high-level cho audit, observability, và monitoring của MIABOS

---

## 0. Metadata

- Feature ID: `F-M12-OBS-001`
- Related User Story: `US-M12-OBS-001`
- Related Screens: sync monitor dashboard, audit query log, AI quality dashboard, stale/conflict dashboard
- Related APIs: `GET /mia/ops/metrics`, `GET /mia/audit/query-log`
- Related Tables: `chat_audit_log`, `integration_run`, `observability_metric_snapshot`
- Related Events: `audit.log.created`, `metric.threshold.breached`
- Related Error IDs: `OBS-001`

## 1. User Story

Là PM, Ops, hoặc Technical Operator, tôi muốn theo dõi được sync health, chất lượng câu trả lời AI, escalation rate, stale/conflict rate để vận hành MIABOS an toàn.

## 1A. User Task Flow

| Step | User Role | Action | Task Type | Notes |
|------|-----------|--------|-----------|-------|
| 1 | Ops | Xem dashboard sync / AI quality | Reporting | Entry |
| 2 | Ops | Drill xuống domain hoặc intent lỗi nhiều | Reporting | Investigation |
| 3 | PM / Ops | Quyết định corrective action hoặc tuning rule | Quick Action | Improvement |

## 2. Business Context

Nếu không có audit và observability thì integration + AI sẽ không đáng tin để mở rộng.

## 3. Preconditions

- I01-I05, M09-M11 đều phát event / audit logs.

## 4. Postconditions

- Có khả năng nhìn toàn cảnh sync health và AI answer quality.

## 5. Main Flow

Collect signals -> aggregate metrics -> render dashboards / alerts.

## 6. Alternate Flows

Business review dashboard vs technical ops dashboard.

## 7. Error Flows

Missing audit event, metric lag, hoặc false-positive alert.

## 8. State Machine

`Collecting -> Aggregated -> Alerting / Healthy / Degraded`

## 9. UX / Screen Behavior

Cần tách sync health, answer quality, escalation, stale/conflict.

## 10. Role / Permission Rules

PM xem tổng quan; Tech Ops xem log sâu.

## 11. Business Rules

Audit retention và masking phải phù hợp sensitivity rule.

## 12. API Contract Excerpt + Canonical Links

Phụ thuộc `I01..I05`, `M09..M11`.

## 13. Event / Webhook Contract Excerpt + Canonical Links

Nhận signals từ integration runs, chat audit, và escalation events.

## 14. Data / DB Impact Excerpt + Canonical Links

Tập trung log và metric snapshot phục vụ monitoring.

## 15. Validation Rules

Metric phải truy ngược được về source events.

## 16. Error Codes

`OBS-001`: Audit / metric pipeline degraded.

## 17. Non-Functional Requirements

Near-real-time đủ cho vận hành, retention có kiểm soát.

## 18. Acceptance Criteria

Xem được sync success/fail, answer rate, escalation rate, stale/conflict indicators.

## 19. Test Scenarios

Sync failure alert, answer quality dashboard, escalation lag metric.

## 20. Observability

Chính module này là output observability trung tâm.

## 21. Rollout / Feature Flag

Bật từ ngày đầu pilot.

## 22. Open Questions

Retention audit bao lâu và ai xem được log sâu?

## 23. Definition of Done

Có ops dashboard dùng được cho pilot phase 1.

## 24. Ready-for-UXUI Checklist

- [ ] UXUI đã chốt dashboard views theo persona

## 25. Ready-for-FE-Preview Checklist

- [ ] FE Preview có mock healthy / degraded / alert states

## 26. Ready-for-BE / Integration Promotion Checklist

- [ ] BE metric aggregation contract đã rõ
