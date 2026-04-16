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
- Related PRD: `PRD-MIABOS-BQ-Phase1`
- Related Screens: availability answer card, realtime check status, stale warning
- Related APIs: `POST /mia/inventory/check`, `GET /mia/inventory/availability`
- Related Tables: `inventory_read_model`, `availability_cache`
- Related Events: `mia.inventory.realtime_checked`, `mia.inventory.stale_detected`
- Related Error IDs: `INV-001`, `INV-002`, `INV-003`

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
| 1 | Sales / CSKH | Hỏi tồn theo mã hàng, size, màu, hoặc khu vực cụ thể | Quick Action | Điểm vào |
| 2 | Sales / CSKH | Xem kết quả tồn với freshness badge (realtime/cached/stale) | Reporting | Kết quả chính |
| 3 | Sales / CSKH | Yêu cầu kiểm tra realtime nếu cache đang stale | Quick Action | Override path |
| 4 | Logistics / Vận hành bán lẻ | Xem chi tiết tồn theo kho/cửa hàng cụ thể để cân nhắc chuyển hàng | Reporting | Role nội bộ |
| 5 | Logistics | Nhận cảnh báo conflict nếu SAP B1 vs KiotViet không khớp | Exception Handling | Data quality |

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

| # | Scenario | Input | Expected Output |
|---|---|---|---|
| TS-01 | Realtime check thành công | `sku=BQ001, location=store_HN01, freshness=realtime` | Tồn realtime + source KiotViet + freshness_level=realtime |
| TS-02 | Cache fallback khi realtime timeout | `sku=BQ001` (SAP B1 timeout) | Tồn cached + stale badge + synced_at hiện tại |
| TS-03 | Cache stale vượt threshold | `sku=BQ002` (cached >4h for SAP B1) | Stale warning + gợi ý "kiểm tra realtime nếu cần xác nhận" |
| TS-04 | Conflict SAP B1 vs KiotViet | `sku=BQ003` (số tồn lệch >10%) | Warning "dữ liệu chưa đồng nhất giữa các nguồn" — không tự chọn |
| TS-05 | User không đủ scope | Sales query chi tiết tồn kho nội bộ | Chỉ nhận "còn/hết" không nhận số tuyệt đối |
| TS-06 | Branch không map được | `location=UNKNOWN_BRANCH` | Error INV-002 + "không tìm thấy dữ liệu cho chi nhánh này" |
| TS-07 | Cả realtime và cache đều fail | `sku=BQ004` (hệ thống lỗi) | Error INV-001 + "không có dữ liệu đáng tin tại thời điểm này" |

## 20. Observability

- **inventory_check_total**: tổng số availability check theo realtime / cache-soft path
- **realtime_success_rate**: % check realtime thành công trong ≤3s
- **cache_fallback_rate**: % check phải dùng cache do realtime fail
- **stale_detection_count**: số lần cache vượt freshness threshold — alert khi tăng
- **conflict_flag_count**: số lần SAP B1 vs KiotViet conflict — dùng để data quality review
- **scope_violation_count**: số lần user không đủ scope request chi tiết tồn (audit log)

## 21. Rollout / Feature Flag

Nội bộ trước, public-safe sau.

## 22. Open Questions

Ngưỡng freshness theo từng nguồn và từng channel là bao nhiêu?

## 23. Definition of Done

Availability module vận hành được cho internal và sales-safe mode.

## 24. Ready-for-UXUI Checklist

- [ ] `User Story` đã approved và có problem, trigger, happy path, dependencies, AC context
- [ ] User Task Flow đủ chi tiết để thiết kế screen/state (§1A)
- [ ] Business rules và permission rules testable (§11)
- [ ] Main, alternate, và error flows đã ghi đầy đủ (§5/6/7)
- [ ] State machine rõ ràng hoặc đánh dấu `N/A + lý do` (§8)
- [ ] Data và event dependencies đã link (§12/13/14)
- [ ] Open questions buộc A06 phải tự bịa behavior đã được resolve hoặc đánh dấu blocker (§22)

## 25. Ready-for-FE-Preview Checklist

- [ ] User Story đã approved và link trong Sprint Backlog
- [ ] UXUI spec tồn tại và cite SRS này
- [ ] Không còn mâu thuẫn chưa giải quyết giữa SRS và UXUI
- [ ] Mock/stub data assumptions cho FE Preview đã rõ ràng
- [ ] PM đã mở `FE Preview` một cách tường minh

## 26. Ready-for-BE / Integration Promotion Checklist

- [ ] FE Preview đã được review
- [ ] Feedback thay đổi behavior từ FE Preview đã được đưa về SRS / UXUI
- [ ] `Integration Spec` (hoặc split technical pack đã approved) align với SRS này
- [ ] UXUI spec tồn tại và cite SRS này
- [ ] Không còn mâu thuẫn chưa giải quyết giữa SRS, UXUI, và technical handoff artifact
- [ ] PM đã confirm `Build Ready`
