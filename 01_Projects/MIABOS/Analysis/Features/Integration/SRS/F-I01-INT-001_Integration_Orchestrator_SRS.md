# Feature SRS: F-I01-INT-001 Integration Orchestrator

**Status**: Draft
**Owner**: A03 BA Agent
**Last Updated By**: Codex CLI (GPT-5 Codex)
**Last Reviewed By**: A01 PM Agent
**Approval Required**: PM
**Approved By**: -
**Last Status Change**: 2026-04-15
**Source of Truth**: This document
**Blocking Reason**: Cần chốt job model, webhook strategy, và boundary với observability module
**Module**: Integration
**Phase**: PB-02 / PB-03
**Priority**: High
**Document Role**: SRS high-level cho lớp điều phối sync, webhook/polling, retry, và trạng thái vận hành integration

---

## 0. Metadata

- Feature ID: `F-I01-INT-001`
- Related User Story: `US-I01-INT-001`
- Related PRD: Integration domain decomposition
- Related Screens:
  - Màn hình danh sách connector jobs
  - Màn hình lịch chạy sync
  - Màn hình chi tiết run / retry / dead-letter
- Related APIs:
  - `POST /mia/integrations/jobs/run`
  - `GET /mia/integrations/jobs`
  - `POST /mia/integrations/webhook-ingest`
- Related Tables:
  - `integration_job`
  - `integration_run`
  - `integration_cursor`
  - `integration_webhook_inbox`
- Related Events:
  - `integration.run.started`
  - `integration.run.completed`
  - `integration.run.failed`
- Related Error IDs:
  - `INT-ORC-001`
  - `INT-ORC-002`

## 1. User Story

Là Integration Admin hoặc Technical Operator, tôi muốn MIABOS có một lớp điều phối integration thống nhất để mọi sync job từ SAP, Haravan, và KiotViet chạy theo một cơ chế chuẩn, có retry, có theo dõi trạng thái, và có khả năng xử lý lỗi có kiểm soát.

## 1A. User Task Flow

| Step | User Role | Action | Task Type | Notes |
|------|-----------|--------|-----------|-------|
| 1 | Integration Admin | Xem danh sách connector jobs | Reporting | Điểm vào chính |
| 2 | Integration Admin | Kiểm tra lịch chạy, cursor, và trạng thái lần chạy gần nhất | Quick Action | Theo dõi vận hành |
| 3 | Integration Admin | Chạy lại job hoặc requeue webhook inbox khi cần | Exception Handling | Luồng xử lý lỗi |
| 4 | Technical Operator | Xem dead-letter / failed run để phân loại nguyên nhân | Exception Handling | Điều tra |

## 2. Business Context

MIABOS cần một orchestration layer dùng chung cho mọi nguồn tích hợp để tránh mỗi connector tự triển khai logic sync riêng, gây drift về retry, logging, và observability.

## 3. Preconditions

- Các connector nguồn đã được khai báo.
- Có lịch chạy hoặc webhook contract cho từng nguồn.
- Có nơi lưu cursor / last successful sync.

## 4. Postconditions

- Mọi integration run có trạng thái rõ ràng.
- Có thể retry, requeue, hoặc dừng job theo control chung.
- Connector phía dưới không phải tự giải quyết orchestration logic riêng.

## 5. Main Flow

1. Hệ thống nhận trigger từ scheduler hoặc webhook.
2. Integration Orchestrator chọn connector và job type tương ứng.
3. Orchestrator nạp cursor, policy retry, và execution context.
4. Connector thực thi sync.
5. Kết quả được ghi vào run history và phát event trạng thái.

## 6. Alternate Flows

- Webhook event được đưa vào inbox rồi xử lý bất đồng bộ.
- Job có thể chạy ad-hoc theo thao tác của admin.

## 7. Error Flows

- Lỗi transient -> retry theo policy.
- Lỗi mapping / payload -> đưa vào dead-letter để xử lý tiếp.

## 8. State Machine

`Queued -> Running -> Succeeded / Failed / Dead-Lettered / Cancelled`

## 9. UX / Screen Behavior

- Danh sách jobs phải hiển thị nguồn, domain, lịch chạy, trạng thái cuối, và thời gian chạy gần nhất.
- Run detail phải hiển thị lỗi rút gọn, attempt count, và action khả dụng.

## 10. Role / Permission Rules

- Chỉ Integration Admin / Tech Lead mới được chạy lại hoặc thay đổi lịch.
- Business user không truy cập được lớp vận hành này.

## 11. Business Rules

- Mọi connector phải chạy qua orchestrator, không chạy bypass trong production.
- Retry policy phải cấu hình được theo domain.

## 12. API Contract Excerpt + Canonical Links

- API orchestration là internal API, không lộ trực tiếp cho chatbot.

## 13. Event / Webhook Contract Excerpt + Canonical Links

- Event trạng thái run là nguồn input cho module `M12 Audit and Observability`.

## 14. Data / DB Impact Excerpt + Canonical Links

- Lưu metadata run, không mirror payload nguồn 1:1 mặc định.

## 15. Validation Rules

- Không được tạo run trùng khi idempotency key giống nhau.

## 16. Error Codes

- `INT-ORC-001`: Không khởi tạo được job context
- `INT-ORC-002`: Retry exhaust

## 17. Non-Functional Requirements

- Có khả năng chạy song song nhiều connector.
- Có idempotency và audit trail.

## 18. Acceptance Criteria

- Có thể theo dõi tất cả sync jobs qua một control plane thống nhất.
- Có retry và dead-letter flow chuẩn hóa.

## 19. Test Scenarios

- Trigger polling job thành công
- Trigger webhook job thành công
- Retry sau lỗi tạm thời
- Dead-letter sau lỗi payload

## 20. Observability

- Theo dõi số run thành công / thất bại / dead-letter theo connector và domain.

## 21. Rollout / Feature Flag

- Bật trước cho SAP, sau đó mở rộng sang Haravan và KiotViet.

## 22. Open Questions

- Webhook inbox retention bao lâu?
- Retry policy có khác nhau theo nguồn hay theo domain?

## 23. Definition of Done

- Có orchestration flow thống nhất cho cả 3 nguồn.
- Có run log, retry, và dead-letter control.

## 24. Ready-for-UXUI Checklist

- [ ] Job list và run detail đã chốt ở mức high-level
- [ ] Action retry / requeue / cancel được mô tả rõ

## 25. Ready-for-FE-Preview Checklist

- [ ] Mock run data đã rõ
- [ ] Không còn mâu thuẫn giữa orchestration state và UI states

## 26. Ready-for-BE / Integration Promotion Checklist

- [ ] Retry / webhook / polling policy được chốt
- [ ] Dependency với `M12` đã trace rõ
