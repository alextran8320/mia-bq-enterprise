# Feature SRS: F-M12-OBS-001 Audit and Observability

**Status**: Draft
**Owner**: A03 BA Agent
**Last Updated By**: Claude Code (claude-sonnet-4-6)
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

## 0B. Integration Source Map

| Data Domain | Source System | Direction | Notes |
|---|---|---|---|
| Integration sync events, run logs | MIABOS integration layer (I01-I05) | Read | Nguồn cho sync health metrics |
| Chat audit logs, answer quality signals | MIABOS internal (M09/M10) | Read | Nguồn cho AI answer quality dashboard |
| Escalation events, assignment lag | MIABOS internal (M11) | Read | Nguồn cho escalation metrics |
| Metric snapshots, observability dashboard data | MIABOS internal DB | Write | Output — phục vụ Ops/PM dashboard |

## 1. User Story

Là PM, Ops, hoặc Technical Operator, tôi muốn theo dõi được sync health, chất lượng câu trả lời AI, escalation rate, stale/conflict rate để vận hành MIABOS an toàn.

## 1A. User Task Flow

| Step | User Role | Action | Task Type | Notes |
|------|-----------|--------|-----------|-------|
| 1 | Ops | Xem dashboard sync / AI quality | Reporting | Entry |
| 2 | Ops | Drill xuống domain hoặc intent lỗi nhiều | Reporting | Investigation |
| 3 | PM / Ops | Quyết định corrective action hoặc tuning rule | Quick Action | Improvement |

## 2. Business Context

BQ pilot nội bộ sẽ bắt đầu với một nhóm user nhỏ — nếu không có observability từ ngày đầu, PM/Ops không biết AI đang trả lời đúng bao nhiêu phần trăm, sync từ SAP B1/KiotViet/Haravan có ổn không, và escalation có đang tăng bất thường không. Không có M12, không có cơ sở để cải thiện có hệ thống sau mỗi sprint pilot.

## 3. Preconditions

- `I01-I05` (integration layer) đã phát sync events và run logs.
- `M09/M10` đã ghi `chat_audit_log` và answer snapshots.
- `M11` đã ghi escalation events.
- `M07` đã ghi access deny events.

## 4. Postconditions

- PM/Ops có dashboard để theo dõi sync health, answer quality, escalation rate, và stale/conflict rate trong pilot.
- Technical Ops có log query đủ sâu để debug integration và AI answer issues.

## 5. Main Flow

1. Hệ thống liên tục thu thập signals từ `I01-I05`, `M09-M11`, `M07`.
2. Hệ thống aggregate metrics theo window (5 phút, 1 giờ, 1 ngày).
3. PM/Ops mở dashboard, chọn view: Sync Health / AI Quality / Escalation / Access Denied.
4. User drill xuống domain hoặc module cụ thể khi phát hiện metric bất thường.
5. Hệ thống phát alert khi metric vượt ngưỡng (VD: escalation rate > X%, blocked answer > Y%).
6. PM/Ops quyết định corrective action: adjust knowledge, fix integration, update access rule.

## 6. Alternate Flows

- Business review view: tập trung answer quality, top intents, top unresolved queries — dành cho PM.
- Technical ops view: sync run logs, error traces, latency breakdown — dành cho IT/ERP/data.

## 7. Error Flows

- Missing audit event (module không phát event) → metric gap, dashboard hiển thị "data incomplete" thay vì 0.
- Metric aggregation lag > 10 phút → alert "dashboard có thể không cập nhật".
- False-positive alert → Admin có thể adjust threshold mà không cần code change.

## 8. State Machine

`Collecting -> Aggregating -> Healthy / Warning (metric near threshold) / Alerting (threshold breached) / Degraded (pipeline issue)`

## 9. UX / Screen Behavior

- Dashboard chia 4 panel chính: `Sync Health`, `AI Answer Quality`, `Escalation`, `Access Denied`.
- Mỗi panel có: current status badge (Healthy/Warning/Alert), key metric số, trend sparkline.
- Drill-down theo domain/module/time window.
- Alert notification rõ ràng với: metric nào, ngưỡng bao nhiêu, khi nào, và link drill-down.

## 10. Role / Permission Rules

- `PM / Ban điều hành`: xem tổng quan tất cả panels, drill-down theo domain.
- `IT / ERP / data (Tech Ops)`: xem technical log sâu, raw event query, latency detail.
- `Ops Governance`: xem access denied log và sensitivity rule impact.
- Log chi tiết có PII phải được mask theo `M07` trước khi hiển thị — ngay cả với Tech Ops.

## 11. Business Rules

- Audit retention: `chat_audit_log` giữ tối thiểu `180 ngày`; `integration_run` giữ tối thiểu `90 ngày`.
- Metrics phải truy ngược được về source events — không được chỉ có aggregate mà không có raw log.
- Masking từ `M07` áp dụng kể cả trên dashboard — Tech Ops không được thấy PII raw trong log view.
- Alert threshold phải có default sensible và có thể điều chỉnh bởi Admin mà không cần code change.
- Dashboard phải phân biệt rõ "không có data" vs "data = 0" — tránh false healthy signal khi event pipeline bị gián đoạn.

## 12. API Contract Excerpt + Canonical Links

- `GET /mia/ops/metrics`: lấy metric summary theo `domain`, `time_window`, `metric_type`
- `GET /mia/audit/query-log`: query audit log với filter `user`, `module`, `event_type`, `date_range`
- Canonical links:
  - Reads từ `I01-I05` (sync events), `M09-M10` (chat audit), `M11` (escalation events), `M07` (access events)

## 13. Event / Webhook Contract Excerpt + Canonical Links

- `audit.log.created`: phát khi audit event mới được ghi (internal pipeline).
- `metric.threshold.breached`: phát khi metric vượt ngưỡng → trigger alert notification.

## 14. Data / DB Impact Excerpt + Canonical Links

- `chat_audit_log`: answer events từ M09/M10 — source chính cho AI quality metrics
- `integration_run`: sync run logs từ I01-I05 — source cho sync health metrics
- `observability_metric_snapshot`: aggregated metrics theo window, phục vụ dashboard query nhanh

## 15. Validation Rules

- Metric phải có `source_event_count` để biết aggregate từ bao nhiêu events — không hiển thị metric mà không có basis.
- Log query không được trả raw PII — masking phải được apply trước khi render.
- Alert threshold change phải có audit log.

## 16. Error Codes

- `OBS-001`: Audit/metric pipeline degraded — event collection bị gián đoạn.
- `OBS-002`: Log query timeout — quá nhiều data trong range được query.
- `OBS-003`: Metric source event missing — không đủ data để tính metric.

## 17. Non-Functional Requirements

- Dashboard metrics phải có độ trễ `<= 5 phút` so với real-time events.
- `GET /mia/ops/metrics` phải trả kết quả trong `<= 3 giây` cho range `<= 24 giờ`.
- `chat_audit_log` retention: tối thiểu `180 ngày`. `integration_run` retention: tối thiểu `90 ngày`.
- Alert delivery phải có độ trễ `<= 10 phút` sau khi threshold bị breach.

## 18. Acceptance Criteria

- PM mở dashboard và thấy được sync health, answer success rate, escalation rate, và blocked answer rate trong 1 view.
- Tech Ops drill-down vào integration run log và thấy từng sync attempt với status và error nếu có.
- Alert được gửi khi escalation rate vượt ngưỡng config — trong vòng 10 phút.
- "Data incomplete" được hiển thị rõ khi event pipeline bị gián đoạn — không hiển thị 0 giả.

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
