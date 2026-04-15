# Feature SRS: F-M02-INV-001 Inventory Availability

**Status**: Draft
**Owner**: A03 BA Agent
**Last Updated By**: Codex CLI (GPT-5 Codex)
**Last Reviewed By**: A01 PM Agent
**Approval Required**: PM
**Approved By**: -
**Last Status Change**: 2026-04-15
**Source of Truth**: This document
**Blocking Reason**: Cần chốt realtime vs cache-soft policy theo từng kênh và từng use case
**Module**: M02
**Phase**: PB-02 / PB-03
**Priority**: High
**Document Role**: SRS high-level cho module Inventory Availability của MIABOS

---

## 0. Metadata

- Feature ID: `F-M02-INV-001`
- Related User Story: `US-M02-INV-001`
- Related Screens: availability answer card, realtime check status, stale warning
- Related APIs: `POST /mia/inventory/check`, `GET /mia/inventory/availability`
- Related Tables: `inventory_read_model`, `availability_cache`
- Related Events: `mia.inventory.realtime_checked`
- Related Error IDs: `INV-001`

## 1. User Story

Là Sales, Logistics, CSKH, hoặc AI bán hàng, tôi muốn biết tình trạng còn hàng / hết hàng / tồn theo scope phù hợp để tư vấn và vận hành nhanh.

## 1A. User Task Flow

| Step | User Role | Action | Task Type | Notes |
|------|-----------|--------|-----------|-------|
| 1 | Sales / Logistics | Hỏi tồn theo mã hàng và khu vực | Quick Action | Entry |
| 2 | Hệ thống | Chọn realtime hoặc cache-soft path | Quick Action | Policy-driven |
| 3 | User / AI | Xem kết quả availability + source + freshness | Reporting | Trust |

## 2. Business Context

Availability là use case tần suất cao nhất và nhạy cảm nhất trong bài toán retail.

## 3. Preconditions

- Product mapping và location mapping đã có.

## 4. Postconditions

- Availability answer có source, freshness, và warning phù hợp.

## 5. Main Flow

Resolve product/location -> check realtime hoặc cache -> compose answer.

## 6. Alternate Flows

Fallback cache, region-level answer, store-level answer.

## 7. Error Flows

SAP timeout, Haravan stale, hoặc KiotViet branch mismatch.

## 8. State Machine

`Ready -> Realtime Checking -> Available / Unavailable / Fallback Cached / Failed`

## 9. UX / Screen Behavior

Phải hiển thị freshness badge và mức độ chắc chắn.

## 10. Role / Permission Rules

External chatbot chỉ trả `còn hàng / hết hàng`; internal có thể xem chi tiết hơn theo scope.

## 11. Business Rules

Không lộ tồn chi tiết cho public-safe mode.

## 12. API Contract Excerpt + Canonical Links

Phụ thuộc `I02/I03/I04/I05` và feed `M09/M10`.

## 13. Event / Webhook Contract Excerpt + Canonical Links

Ghi `mia.inventory.realtime_checked` cho realtime path.

## 14. Data / DB Impact Excerpt + Canonical Links

Đọc `inventory_read_model` hoặc `availability_cache`.

## 15. Validation Rules

Mọi kết quả tồn phải gắn source và timestamp.

## 16. Error Codes

`INV-001`: Availability check failed.

## 17. Non-Functional Requirements

Hỗ trợ near-real-time với fallback rõ ràng.

## 18. Acceptance Criteria

Phân biệt được realtime, cached, stale, và failed.

## 19. Test Scenarios

Realtime success, cache fallback, stale warning.

## 20. Observability

Theo dõi success/fail/fallback rate.

## 21. Rollout / Feature Flag

Nội bộ trước, public-safe sau.

## 22. Open Questions

Ngưỡng freshness theo từng nguồn và từng channel là bao nhiêu?

## 23. Definition of Done

Availability module vận hành được cho internal và sales-safe mode.

## 24. Ready-for-UXUI Checklist

- [ ] UXUI đã chốt cách hiển thị availability confidence

## 25. Ready-for-FE-Preview Checklist

- [ ] FE Preview có mock realtime/cached/stale states

## 26. Ready-for-BE / Integration Promotion Checklist

- [ ] BE contract realtime vs cache đã rõ
