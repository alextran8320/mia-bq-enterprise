# Feature SRS: F-M02-INV-001 Inventory Availability

**Status**: Draft
**Owner**: A03 BA Agent
**Last Updated By**: Claude Code (claude-sonnet-4-6)
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

## 0B. Integration Source Map

| Data Domain | Source System | Direction | Notes |
|---|---|---|---|
| Tồn kho trung tâm / warehouse, kế toán tồn | SAP B1 | Read | Nguồn chính cho tồn cấp ERP, có thể có delay |
| Tồn tại điểm bán, tồn theo chi nhánh | KiotViet | Read | Nguồn cho store-level availability, near-real-time |
| Tồn ecommerce, tồn channel online | Haravan | Read | Nguồn cho online availability, sync từ SAP hoặc KiotViet |
| Availability read model, availability cache | MIABOS internal DB | Write | Output phục vụ M09/M10 query |

## 1. User Story

Là Sales, Logistics, CSKH, hoặc AI bán hàng, tôi muốn biết tình trạng còn hàng / hết hàng / tồn theo scope phù hợp để tư vấn và vận hành nhanh.

## 1A. User Task Flow

| Step | User Role | Action | Task Type | Notes |
|------|-----------|--------|-----------|-------|
| 1 | Sales / Logistics | Hỏi tồn theo mã hàng và khu vực | Quick Action | Entry |
| 2 | Hệ thống | Chọn realtime hoặc cache-soft path | Quick Action | Policy-driven |
| 3 | User / AI | Xem kết quả availability + source + freshness | Reporting | Trust |

## 2. Business Context

BQ pack xác nhận bài toán tồn kho của BQ không phải là "có hàng hay không" mà là "mã nào, size nào, ở kho/cửa hàng nào, và có nên chuyển không". Tồn kho nằm phân tán ở SAP B1 (kho trung tâm/ERP), KiotViet (tồn tại từng cửa hàng), và Haravan (tồn channel online). Ba nguồn này có thể không đồng nhất và có delay khác nhau. Nếu AI trả tồn mà không chỉ rõ nguồn và freshness, người dùng sẽ hiểu nhầm và mất niềm tin vào chatbot.

## 3. Preconditions

- Product canonical mapping đã có (`M01`).
- Location/branch mapping giữa SAP B1, KiotViet, và Haravan đã có tối thiểu cho phase 1.
- `M07` đã định nghĩa scope rule: role nào được xem tồn chi tiết theo chi nhánh.

## 4. Postconditions

- Availability answer có `source`, `freshness`, `scope`, và `warning` phù hợp với context người hỏi.
- User không bao giờ nhận được tồn số tuyệt đối mà không biết nó từ đâu và mới đến mức nào.

## 5. Main Flow

1. User hỏi tồn kho theo mã/size/màu hoặc nhóm sản phẩm.
2. Hệ thống resolve canonical product key từ `M01`.
3. Hệ thống xác định scope: user hỏi theo kho, chi nhánh, cửa hàng, hay toàn hệ thống.
4. Hệ thống chọn path: `realtime check` (gọi trực tiếp KiotViet/SAP) nếu freshness policy yêu cầu, hoặc `cache-soft` nếu phù hợp.
5. Hệ thống gắn `source`, `synced_at`, `freshness_level` (realtime / cached / stale) vào kết quả.
6. Render answer card với kết quả tồn + freshness badge + warning nếu stale/conflict.
7. User xem detail theo cửa hàng hoặc yêu cầu check realtime nếu cần chính xác hơn.

## 6. Alternate Flows

- User hỏi tồn theo khu vực / tỉnh → trả aggregated result với warning "tồn theo khu vực, không phải từng cửa hàng".
- Fallback cache khi realtime timeout → trả cache với stale badge và thời điểm cache cuối.
- User nội bộ Logistics hỏi để cân nhắc chuyển hàng → trả chi tiết theo kho/chi nhánh.

## 7. Error Flows

- SAP B1 timeout → fallback sang cache; nếu cache cũng stale → trả warning "không có dữ liệu đáng tin tại thời điểm này".
- KiotViet branch mismatch (chi nhánh không map được) → trả "không tìm thấy dữ liệu cho chi nhánh này" thay vì im lặng.
- Tồn từ KiotViet và SAP B1 conflict rõ rệt → warning "dữ liệu chưa đồng nhất giữa các nguồn" thay vì tự chọn một bên.

## 8. State Machine

`Ready -> Realtime Checking -> Available / Unavailable / Fallback Cached / Stale Warning / Failed`

## 9. UX / Screen Behavior

- Kết quả tồn phải có `freshness badge` (realtime / cached / stale) ngay cạnh số liệu.
- Nếu tồn là 0 theo nguồn đang stale, phải hiển thị cả hai thông tin: "0 theo cache lúc HH:MM" và gợi ý "kiểm tra realtime nếu cần xác nhận".
- Phân tách rõ tồn theo scope: toàn hệ thống vs theo kho trung tâm vs theo cửa hàng cụ thể.

## 10. Role / Permission Rules

- `Vận hành bán lẻ / Store Manager`: xem tồn theo cửa hàng của mình và kho gần nhất.
- `Logistics / kho / fulfillment (Ban điều hành)`: xem tồn chi tiết theo kho trung tâm và all-store summary.
- `Sales / CSKH (Ecommerce)`: xem tồn theo phạm vi được cấp — thường là "còn/hết" với tên cửa hàng gần nhất, không thấy số tuyệt đối nội bộ.
- `IT / ERP / data`: xem technical detail đầy đủ bao gồm discrepancy log.
- Mọi scope đi qua `M07` trước khi render.

## 11. Business Rules

- Mọi availability answer phải có `source` và `synced_at` — không được trả số tồn "không rõ nguồn".
- Khi realtime check thành công, đây là kết quả ưu tiên; cache chỉ dùng khi realtime không khả dụng.
- Freshness threshold theo từng nguồn: SAP B1 batch sync có thể chấp nhận cache đến 4 giờ; KiotViet POS nên realtime hoặc cache tối đa 15 phút cho inventory-sensitive queries.
- Tồn chi tiết theo cửa hàng (số tuyệt đối) chỉ được phép với role nội bộ đủ scope — không trả cho public-safe mode.
- Nếu tồn conflict giữa SAP B1 và KiotViet vượt ngưỡng cho phép, hệ thống phải flag conflict thay vì tự chọn.

## 12. API Contract Excerpt + Canonical Links

- `POST /mia/inventory/check`: check availability theo `sku`, `location_scope`, `freshness_policy`
  - Output: `availability_status`, `quantity_hint`, `scope`, `source`, `synced_at`, `freshness_level`, `warnings[]`
- `GET /mia/inventory/availability`: list availability theo nhiều SKU
- Canonical links:
  - Reads `I02` (SAP B1 inventory), `I03` (Haravan inventory sync), `I04` (KiotViet store inventory)
  - Uses `F-M01-PRD-001` để resolve canonical product key
  - Uses `F-M07-SEC-001` để scope result
  - Feeds `F-M09-AIC-001`, `F-M10-SLS-001`

## 13. Event / Webhook Contract Excerpt + Canonical Links

- `mia.inventory.realtime_checked`: phát khi realtime check được thực hiện (dùng cho observability).
- `mia.inventory.stale_detected`: phát khi cache vượt freshness threshold.

## 14. Data / DB Impact Excerpt + Canonical Links

- `inventory_read_model`: canonical tồn kho đã map từ SAP B1 + KiotViet + Haravan, gồm `source`, `synced_at`, `freshness_level`
- `availability_cache`: cache cho near-real-time với TTL theo từng nguồn
- Source mapping: SAP B1 cho warehouse-level; KiotViet cho store-level; Haravan cho online channel

## 15. Validation Rules

- Mọi availability answer phải có `source` và `synced_at` — không có thì không được render.
- Tồn âm hoặc tồn bất thường phải bị flag warning thay vì hiển thị bình thường.
- Conflict giữa sources phải được detect và flag trước khi render.

## 16. Error Codes

- `INV-001`: Availability check failed — cả realtime và cache đều không khả dụng.
- `INV-002`: Product không map được để check inventory.
- `INV-003`: Conflict giữa SAP B1 và KiotViet vượt ngưỡng cho phép.

## 17. Non-Functional Requirements

- Realtime path phải trả kết quả trong `<= 3 giây` cho `90%` queries.
- Cache-soft path phải trả kết quả trong `<= 1 giây`.
- Cache TTL: KiotViet store-level tối đa `15 phút`; SAP B1 warehouse-level tối đa `4 giờ`.
- Hỗ trợ tối thiểu `100` concurrent availability queries trong pilot phase 1.

## 18. Acceptance Criteria

- User hỏi tồn theo mã + cửa hàng và nhận kết quả có source, synced_at, freshness badge.
- Khi realtime timeout, hệ thống tự fallback cache và hiển thị rõ đây là cache với thời điểm.
- Tồn conflict giữa SAP B1 và KiotViet được flag warning thay vì tự chọn một bên.
- User không đủ scope chỉ nhận "còn/hết" không nhận số tuyệt đối.

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
