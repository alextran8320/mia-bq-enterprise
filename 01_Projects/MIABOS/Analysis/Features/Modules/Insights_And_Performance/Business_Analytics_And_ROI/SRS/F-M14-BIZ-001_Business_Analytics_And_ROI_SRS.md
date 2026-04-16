# Feature SRS: F-M14-BIZ-001 Business Analytics And ROI

**Status**: SRS Ready
**Owner**: A03 BA Agent
**Last Updated By**: Codex CLI (GPT-5.4 Codex environment)
**Last Reviewed By**: A01 PM Agent
**Approval Required**: PM
**Approved By**: A01 PM Agent - FE Preview scope approved with mock/stub data on 2026-04-16
**Last Status Change**: 2026-04-16
**Source of Truth**: This document
**Blocking Reason**: -
**Module**: M14
**Phase**: PB-03 / FE Preview (mock) - production analytics remains P2
**Priority**: High
**Document Role**: SRS high-level cho analytics, ROI, và business performance dashboard của MIABOS

---

## 0. Metadata

- Feature ID: `F-M14-BIZ-001`
- Related User Story: `US-M14-BIZ-001`
- Related Screens: Business Performance Dashboard, CRM And Funnel Dashboard, Executive Dashboard
- Related APIs: `GET /mia/analytics/performance`, `GET /mia/analytics/funnel`, `GET /mia/analytics/roi`
- Related Tables: `analytics_metric_snapshot`, `funnel_event`, `segment_performance`, `promo_effectiveness_log`
- Related Events: `analytics.snapshot.refreshed`, `funnel.conversion.recorded`
- Related Error IDs: `BIZ-001`

## 0B. Integration Source Map

| Data Domain | Source System | Direction | Notes |
|---|---|---|---|
| Order data, sell-through, fulfillment rate | MIABOS internal (M05) | Read | Aggregate từ read model M05 — không query trực tiếp Haravan/KiotViet |
| Pricing data, promo effectiveness | MIABOS internal (M03/M04) | Read | Aggregate promo apply count, discount depth, margin impact |
| Customer segments, funnel stages, lead conversion | MIABOS internal (M06/M10) | Read | Funnel event từ M10 lead capture và CRM segment từ M06 |
| AI quality signals, escalation rate | MIABOS internal (M12) | Read | Tái dùng metric snapshots từ M12 Observability để tránh duplicate aggregation |
| Branch / channel / dealer context | MIABOS internal (M13 — future) | Read | Phase 2: drill-down theo chi nhánh, khu vực, đại lý khi M13 available |
| Analytics metric snapshots | MIABOS internal DB | Write | Output — phục vụ dashboard query theo persona |

> M14 không đọc trực tiếp SAP B1, KiotViet, hay Haravan. Toàn bộ dữ liệu đi qua read model của các module MIABOS (M03-M06, M10, M12) để đảm bảo consistency và tránh duplicate ETL.

## 1. User Story

Là Ban điều hành, Regional Manager, hoặc Marketing/Sales Lead, tôi muốn xem được hiệu quả vận hành (sell-through, promo effectiveness, conversion funnel, AI ROI) trên một dashboard thống nhất để ra quyết định nhanh mà không cần tổng hợp báo cáo thủ công từ SAP B1, Excel, Haravan.

## 1A. User Task Flow

| Step | User Role | Action | Task Type | Notes |
|------|-----------|--------|-----------|-------|
| 1 | Ban điều hành / HQ | Mở Executive Dashboard, xem KPI tổng quan | Reporting | Entry point — tổng quan toàn hệ thống |
| 2 | Regional Manager | Drill-down theo chi nhánh hoặc khu vực để so sánh hiệu quả | Reporting | Cần M13 context cho drill-down đầy đủ (P2) |
| 3 | Marketing / Sales Lead | Xem promo effectiveness và funnel conversion theo campaign | Analysis | So sánh CTKM nào hiệu quả nhất |
| 4 | Marketing / CRM | Xem segment performance và remarketing outcome | Analysis | Liên kết CRM segment với conversion outcome |
| 5 | PM | Xem AI ROI dashboard: answer success rate, escalation reduction, lead capture rate | Reporting | Đánh giá giá trị AI investment cho BQ pilot |
| 6 | Bất kỳ persona nào | Export hoặc schedule báo cáo định kỳ | Quick Action | Cho họp tuần/tháng |
| 7 | PM / Ban điều hành | Xem trend theo thời gian (so sánh tháng/quý) | Analysis | Phát hiện tăng/giảm có hệ thống |

## 2. Business Context

BQ hiện tổng hợp báo cáo thủ công: dữ liệu bán hàng từ SAP B1, sell-through từ KiotViet, ecommerce performance từ Haravan, CTKM từ Excel — không có view thống nhất nào. Ban điều hành không biết CTKM nào hiệu quả thực sự, chi nhánh nào underperform, và AI đang tạo ra ROI gì sau khi đầu tư. Marketing không có cơ sở dữ liệu để đánh giá remarketing trigger. Không có M14, MIABOS chỉ là chatbot — không phải operating intelligence layer. M14 là module biến pilot AI thành evidence-based investment cho BQ leadership.

## 3. Preconditions

- `M03/M04` đã có read model pricing và promo data với apply count và discount depth.
- `M05` đã có order data theo channel, branch, và fulfillment status.
- `M06/M10` đã có funnel events, lead capture record, và segment definitions.
- `M12` đã có AI quality metric snapshots với answer success rate, escalation rate.
- User đã được M07 cấp quyền xem analytics theo scope (HQ xem tổng, Regional xem khu vực).

## 4. Postconditions

- Ban điều hành có Executive Dashboard với KPI tổng quan toàn hệ thống.
- Marketing / Sales Lead có Funnel Dashboard với promo effectiveness và conversion by segment.
- PM có AI ROI Dashboard với evidence-based metrics để báo cáo business value cho BQ.
- Dữ liệu dashboard được refresh theo chu kỳ và có timestamp rõ ràng — không bao giờ hiển thị stale data mà không có cảnh báo.

## 5. Main Flow

1. Hệ thống aggregate data từ read models của M03/M04/M05/M06/M10/M12 theo snapshot schedule.
2. Metric snapshots được tính và lưu vào `analytics_metric_snapshot` theo time window (daily, weekly, monthly).
3. User mở dashboard — hệ thống load latest snapshot theo scope được phép (M07 enforce).
4. User chọn view: Business Performance / CRM Funnel / AI ROI / Promo Effectiveness.
5. Hệ thống render metric với trend indicator (vs previous period), drill-down theo dimension (branch/channel/campaign/segment).
6. User drill-down vào một dimension — hệ thống filter snapshot và re-render sub-view.
7. Khi metric vượt threshold hoặc tụt dưới target, hệ thống hiển thị highlight với color coding (không phải alert — distinguish từ M12 ops alerting).

## 6. Alternate Flows

- **Executive summary mode**: Ban điều hành chỉ muốn top-3 KPI của tuần — hệ thống offer single-page digest view với highlight thay vì full dashboard.
- **Comparison mode**: User select hai time periods hoặc hai branches để so sánh side-by-side.
- **Export**: User export PDF hoặc CSV cho meeting chuẩn bị — hệ thống snapshot current view ra file.

## 7. Error Flows

- Snapshot chưa được tính (first load hoặc pipeline delay) → hiển thị "Đang tính toán — vui lòng quay lại sau X phút" với timestamp dự kiến.
- Dimension không có đủ data (ví dụ chi nhánh mới < 30 ngày) → hiển thị "Chưa đủ data để tính metric tin cậy" — không hiển thị số không đáng tin.
- User không có quyền xem dimension → M07 chặn, hiển thị "Không có quyền xem khu vực này".

## 8. State Machine

`Pending (snapshot chưa sẵn) -> Ready (snapshot mới nhất available) -> Stale Warning (snapshot > refresh window) -> Error (aggregation pipeline failed)`

## 9. UX / Screen Behavior

- **Executive Dashboard**: 4 KPI card lớn (Revenue trend, Order volume, AI answer success, Escalation rate) + 2 mini chart (sell-through weekly, promo conversion).
- **Business Performance Dashboard**: Bảng metric theo branch/channel + heatmap sell-through + promo effectiveness bar chart.
- **CRM And Funnel Dashboard**: Funnel visualization (Lead → Contacted → Converted) theo segment, remarketing outcome, top-performing campaigns.
- **AI ROI Dashboard**: Answer success rate trend, escalation rate trend, lead capture count, estimated time-saved per agent.
- Tất cả dashboard có: time period selector, dimension filter (branch/channel/segment), last-refreshed timestamp, export button.
- Color coding: green = on target, yellow = near threshold, red = below target — thống nhất toàn platform.

## 10. Role / Permission Rules

- `Ban điều hành / Owner`: Xem tất cả dashboard, không giới hạn scope, có thể xem cross-branch.
- `Regional Manager`: Xem được chi nhánh và khu vực trong scope được assign — không xem cross-region.
- `Marketing / Trade Marketing`: Xem Promo Effectiveness và CRM Funnel — không xem revenue P&L chi tiết.
- `Sales Lead`: Xem CRM Funnel và AI ROI — không xem financial metric chi tiết.
- `PM / Tech Lead`: Xem AI ROI và Audit Dashboard — không xem commercial P&L.
- Permission theo M07 — M14 không tự quản lý scope matrix.

## 11. Business Rules

- Dashboard chỉ hiển thị data từ completed periods — không mixed completed và in-progress period trong cùng một chart.
- Promo effectiveness chỉ tính khi có ít nhất `50 apply events` trong period — dưới ngưỡng này hiển thị "insufficient data".
- AI ROI metrics (answer success rate, escalation rate) tính từ `M12` snapshot — không tính lại độc lập để tránh divergence.
- Funnel conversion rate = (converted leads / total captured leads) per period per segment — denominator không được là 0 nếu không có capture.
- Segment performance comparison chỉ hợp lệ khi cả hai segments có ≥ 30 records trong period.
- Không có write-back từ M14 sang source systems — M14 là read-only analytics layer.

## 12. API Contract Excerpt + Canonical Links

- `GET /mia/analytics/performance?dimension={branch|channel}&period={daily|weekly|monthly}`: Business Performance metrics
- `GET /mia/analytics/funnel?segment={id}&period={...}`: CRM Funnel metrics per segment
- `GET /mia/analytics/roi?period={...}`: AI ROI metrics aggregated from M12 snapshots
- Canonical links:
  - Reads từ M03/M04 (pricing/promo), M05 (orders), M06/M10 (CRM/funnel), M12 (AI quality snapshots)
  - M07 enforces scope on all queries

## 13. Event / Webhook Contract Excerpt + Canonical Links

- `analytics.snapshot.refreshed`: phát khi snapshot mới hoàn thành — trigger dashboard cache invalidation.
- `funnel.conversion.recorded`: phát khi lead chuyển trạng thái sang Converted — source cho real-time funnel metric.

## 14. Data / DB Impact Excerpt + Canonical Links

- `analytics_metric_snapshot`: aggregated KPIs theo time window, dimension (branch/channel/segment), metric_type
- `funnel_event`: raw funnel stage transitions từ M10 lead capture và M06 CRM — source cho conversion metrics
- `segment_performance`: per-segment aggregate metrics (conversion rate, revenue per segment, promo sensitivity)
- `promo_effectiveness_log`: per-promo aggregate (apply count, discount depth, revenue attributed, period)

## 15. Validation Rules

- Metric snapshot phải có `record_count` và `period_start`/`period_end` để đảm bảo traceability.
- Conversion rate không được tính khi denominator < minimum threshold — trả về `null` thay vì `0` để tránh false zero.
- Export chỉ được phép cho data trong scope của user — M07 scope check phải xảy ra trước khi generate file.

## 16. Error Codes

- `BIZ-001`: Analytics pipeline delayed — snapshot không được refresh đúng schedule.
- `BIZ-002`: Insufficient data for metric — record count dưới minimum threshold.
- `BIZ-003`: Scope access denied — user không có quyền xem dimension được request.

## 17. Non-Functional Requirements

- Dashboard initial load phải hoàn thành trong `<= 3 giây` cho view đang dùng snapshot cached.
- Snapshot refresh schedule: `daily snapshots` mỗi 6h; `weekly snapshots` tính lại mỗi ngày lúc 02:00.
- API `GET /mia/analytics/performance` phải trả kết quả trong `<= 2 giây` cho range `<= 90 ngày`.
- Promo effectiveness và funnel metrics có độ trễ tối đa `24 giờ` so với source events — không cần realtime.
- Export PDF/CSV phải hoàn thành trong `<= 10 giây` cho view `<= 12 tháng`.
- `analytics_metric_snapshot` retention: tối thiểu `2 năm` để đảm bảo YoY comparison.

## 18. Acceptance Criteria

- Ban điều hành mở Executive Dashboard và thấy được Revenue trend, Order volume, AI answer success rate, và Escalation rate trong 1 view — load trong ≤ 3 giây.
- Marketing Lead chọn 2 CTKM khác nhau và so sánh promo effectiveness side-by-side — hệ thống hiển thị apply count, conversion rate, và discount depth cho từng CTKM.
- PM xem AI ROI Dashboard và thấy answer success rate trend theo tuần, escalation rate, và lead capture count — tất cả có timestamp "last refreshed" rõ ràng.
- Regional Manager chỉ thấy data của khu vực được assign — không thấy data khu vực khác, không có error nếu cố truy cập ngoài scope.

## 19. Test Scenarios

Snapshot refresh pipeline, scope enforcement by region, insufficient data display, promo comparison cross-period, funnel conversion calculation.

## 20. Observability

M14 tái dùng M12 cho ops alerting (snapshot pipeline delay). M14 tự emit `analytics.snapshot.refreshed` events để M12 có thể monitor freshness.

## 21. Rollout / Feature Flag

- FE Preview có thể mở ngay bằng mock/stub data để review dashboard IA, KPI hierarchy, states, và copy.
- Production analytics vẫn là Phase 2 — sau khi M05, M06, M10, M12 stable và có đủ data volume từ pilot để tính metric có nghĩa.

## 22. Open Questions

Các quyết định dưới đây đủ để mở `UXUI` và `FE Preview` bằng mock/stub data. Production analytics/integration thật vẫn cần A05/A08 chốt sau FE review.

| Question | FE Preview Decision | Downstream Note |
|----------|---------------------|-----------------|
| KPI set ưu tiên cho phase 1 dashboard là gì? | Executive Preview dùng top-4 KPI: `Doanh thu`, `Đơn hàng`, `Tỉ lệ trả lời thành công của AI`, `Tỉ lệ escalation`. Các view phụ dùng `sell-through`, `promo effectiveness`, `funnel conversion`, `lead capture`, `time saved`. | KPI cuối cùng cho production cần Business Owner/BQ leadership approve sau demo. |
| Granularity phân tích theo chi nhánh/kênh cần đến mức nào trước M13? | FE Preview mô phỏng branch/channel/segment filter nhưng không cam kết dữ liệu thật; Regional Manager only sees assigned scope. | Drill-down production theo vùng/đại lý/chi nhánh phụ thuộc M13 và M07 scope matrix. |
| Ai owner dashboard definitions? | PM sở hữu dashboard definition cho preview; Ban điều hành/BQ sponsor approve KPI priority; Marketing/Sales Lead approve funnel/promo definitions. | Ownership chính thức cần đưa vào governance artifact trước Build Ready. |
| YoY comparison có cần phase 1 không? | Deferred. Preview chỉ cần current period vs previous period; YoY để Phase 2 khi có retention đủ 2 năm. | Production retention đã đặt tối thiểu 2 năm trong NFR. |
| Export có cần hoạt động thật ở preview không? | FE Preview hiển thị export action và mock success/error states; không generate file thật nếu chưa có backend. | Export thật cần quyết định server-side/client-side trong technical handoff. |

## 23. Definition of Done

Ban điều hành và PM có dashboard dùng được để báo cáo BQ pilot ROI sau 30 ngày chạy.

## 24. Ready-for-UXUI Checklist

- [x] UXUI đã chốt dashboard layout và persona views cho Executive, Marketing, PM
- [x] Color coding và threshold system đã được define đủ cho FE Preview; BQ reporting style cuối cùng chờ review

## 25. Ready-for-FE-Preview Checklist

- [x] FE Preview có mock data cho tất cả 4 main views với các trạng thái: healthy, warning, insufficient data

## 26. Ready-for-BE / Integration Checklist

- [ ] Aggregation pipeline architecture đã được approve
- [ ] Snapshot schedule và retention policy đã được chốt với IT/data team BQ
