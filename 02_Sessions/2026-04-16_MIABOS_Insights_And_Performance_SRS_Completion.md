# Session Log: MIABOS Insights And Performance SRS Completion

**Date**: 2026-04-16
**AI/Channel**: Claude Code
**Model**: claude-sonnet-4-6
**Agent Role**: A03 BA Agent
**Project**: MIABOS
**Phase**: PB-02 / PB-03
**Session Type**: SRS Materialization

---

## Mục tiêu

Hoàn thiện surface `Insights_And_Performance` bằng cách materialize SRS cho `M14 Business Analytics / ROI` — module được khuyến nghị trong Portal CRM Brief nhưng chưa có SRS. Surface này trước đây chỉ có `F-M12-OBS-001` (Audit & Observability) là đủ cho ops, nhưng thiếu business-value analytics layer để Ban điều hành BQ đánh giá ROI của pilot AI.

---

## Artifacts Created / Updated

| Artifact | Action | Ghi chú |
|---|---|---|
| `F-M14-BIZ-001_Business_Analytics_And_ROI_SRS.md` | Created | SRS đầy đủ 26 sections, §0B, BQ context, depth gate đủ |
| `Insights_And_Performance/_index.md` | Updated | Thêm `Business_Analytics_And_ROI` vào module list |
| `Analysis/Features/_feature_registry.md` | Updated | Đăng ký `F-M14-BIZ-001` với blocking reason và status Draft |
| `Analysis/Features/_traceability_matrix.md` | Updated | Thêm row M14 với source refs đến M03-M06, M10, M12 và Brief |

---

## Highlights M14 SRS

### §0B Integration Source Map
- M14 không đọc trực tiếp SAP B1 / KiotViet / Haravan.
- Toàn bộ dữ liệu đến qua read models của M03/M04 (pricing/promo), M05 (orders), M06/M10 (CRM/funnel), M12 (AI quality snapshots).
- Điều này đảm bảo consistency và tránh duplicate ETL — M14 là pure analytics aggregation layer.

### §2 Business Context
- BQ hiện tổng hợp báo cáo thủ công từ SAP B1, KiotViet, Haravan, Excel — không có view thống nhất.
- Không có M14, MIABOS chỉ là chatbot, không phải operating intelligence layer.
- M14 là module biến pilot AI thành evidence-based investment cho BQ leadership.

### §5 Main Flow (7 steps)
Load trigger → Aggregate snapshot → User open dashboard → Select view → Render with drill-down → Dimension drill → Threshold highlight

### §11 Business Rules (6 rules)
- Chỉ hiển thị completed periods — không mixed in-progress data.
- Promo effectiveness chỉ tính khi ≥ 50 apply events.
- AI ROI metrics tái dùng M12 snapshot — không tính lại để tránh divergence.
- Funnel conversion rate có clear denominator rule.
- Segment comparison yêu cầu ≥ 30 records mỗi segment.
- M14 là read-only layer — không write-back về source systems.

### §17 NFR với số liệu cụ thể
- Dashboard load: ≤ 3 giây (snapshot cached)
- API performance: ≤ 2 giây cho range ≤ 90 ngày
- Data freshness: daily snapshot mỗi 6h, weekly snapshot lại mỗi ngày 02:00
- Promo/funnel metrics: độ trễ ≤ 24 giờ (không cần realtime)
- Export: ≤ 10 giây cho range ≤ 12 tháng
- Retention: ≥ 2 năm để có YoY comparison

### §18 Acceptance Criteria (4 ACs độc lập)
1. Executive Dashboard load KPI trong ≤ 3s với 4 metrics trên 1 view.
2. Side-by-side promo effectiveness comparison với apply count, conversion rate, discount depth.
3. AI ROI Dashboard với trend theo tuần và last-refreshed timestamp.
4. Regional Manager scope enforcement — không thấy data ngoài khu vực được assign.

---

## Trạng thái sau session

- Surface `Insights_And_Performance` đã có đủ 2 module: `M12 Audit & Observability` + `M14 Business Analytics & ROI`.
- `F-M14-BIZ-001` giữ `Draft` — blocking: cần chốt KPI set ưu tiên, granularity chi nhánh/kênh, ownership dashboard definitions.
- Tổng cộng workspace MIABOS hiện có **20 SRS** đều ở trạng thái Draft với blocking reasons rõ ràng.

---

## Next Actions

- Chốt KPI set ưu tiên cho M14 phase 1 với Ban điều hành / PM.
- Materialize M13 (Channel / Branch / Dealer Operations) SRS để M14 có thể dùng branch drill-down đầy đủ.
- Sau khi có SRS Ready cho bất kỳ module nào, bắt đầu UXUI design (A06).
