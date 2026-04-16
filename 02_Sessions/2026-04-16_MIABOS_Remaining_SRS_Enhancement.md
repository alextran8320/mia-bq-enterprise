# Session Log: MIABOS Remaining SRS Enhancement

**Date**: 2026-04-16
**AI/Channel**: Claude Code
**Model**: claude-sonnet-4-6
**Agent Role**: A03 BA Agent
**Project**: MIABOS
**Phase**: PB-02 / PB-03
**Session Type**: SRS Enhancement

---

## Mục tiêu

Hoàn thiện 9 SRS còn lại (M01-M07, M11, M12) chưa được enhance theo quy trình SRS mới đã được establish ngày 2026-04-15. Các SRS này thuộc surface: `Catalog_And_Commerce`, `Orders_And_Service`, `CRM_Workspace`, `Operations_And_Governance`, và `Insights_And_Performance`.

---

## Artifacts Enhanced

| SRS | Module | Thay đổi chính |
|---|---|---|
| `F-M01-PRD-001` | Product | §0B (SAP B1 item master, Haravan catalog, KiotViet POS); §2 BQ pain: data phân mảnh 3 nguồn; §5 6 steps; §11 5 business rules; §17 có latency/retention target; §18 4 AC |
| `F-M02-INV-001` | Inventory | §0B (SAP B1 warehouse, KiotViet store, Haravan online); §2 BQ pain: tồn kho "nằm sai chỗ"; §5 7 steps realtime vs cache; §11 5 rules; §17 latency + cache TTL; §18 4 AC |
| `F-M03-PRC-001` | Pricing | §0B (SAP B1 giá cơ sở, Haravan ecommerce, KiotViet POS, M08 policy 1 giá + CTKM CHS); §2 BQ pain: xác định CTKM thủ công; §5 7 steps; §11 5 rules; §17 deterministic + latency; §18 4 AC |
| `F-M04-PRO-001` | Promotion | §0B (SAP B1, Haravan, KiotViet, M08 whitelist); §2 BQ pain: CTKM thủ công + 200 CHS conflict; §5 7 steps; §11 5 rules; §17 refresh 2h + expired cleanup 1h; §18 4 AC |
| `F-M05-ORD-001` | Order & Fulfillment | §0B (Haravan online, KiotViet POS, SAP B1 transfer, M08 policy); §2 BQ pain: CSKH phải mở 3 hệ thống; §5 7 steps; §11 5 rules; §17 latency + refresh 30 phút; §18 4 AC |
| `F-M06-CRM-001` | Customer & CRM | §0B (SAP B1 business partner, Haravan loyalty, KiotViet CRM, M08 policy); §2 BQ pain: 2M+ khách không có profile hợp nhất; §5 7 steps; §11 5 rules; §17 latency + retention 180 ngày; §18 4 AC |
| `F-M07-SEC-001` | Access Control | §0B (MIABOS internal — không kéo rule từ SAP/KV/HAR); §2 BQ pain: 200 cửa hàng/đại lý, nhiều role, scope khác nhau; §5 7 steps evaluate flow; §11 5 rules; §17 latency 200ms (không bottleneck chat); §18 4 AC |
| `F-M11-ESC-001` | Escalation | §0B (M09/M10 context, Lark task write, internal queue fallback); §2 BQ pain: AI dead-end, "Data Lark" direction; §5 7 steps; §11 5 rules; §17 latency + retry + retention; §18 4 AC |
| `F-M12-OBS-001` | Audit & Observability | §0B (I01-I05 sync, M09-M10 audit, M11 escalation — MIABOS internal only); §2 BQ pain: không có observability → không cải thiện được pilot; §5 6 steps; §11 5 rules; §17 metric lag + log retention; §18 4 AC |

---

## Trạng thái sau session

- Tất cả 19 SRS trong workspace đã có `§0B Integration Source Map`.
- Tất cả đủ depth gate: §5 ≥ 4 steps, §11 ≥ 3 rules testable, §17 có số liệu, §18 ≥ 3 AC.
- Tất cả giữ `Draft` — không có SRS nào được promote trong session này.
- Blocking Reason của từng SRS vẫn còn nguyên — phản ánh blocker nghiệp vụ thật.

---

## Next Actions

- Quyết định các blocker nghiệp vụ cho từng module để promote SRS lên `SRS Ready`.
- Bắt đầu UXUI design (A06) cho các module đã đủ điều kiện sau khi blocker được giải quyết.
