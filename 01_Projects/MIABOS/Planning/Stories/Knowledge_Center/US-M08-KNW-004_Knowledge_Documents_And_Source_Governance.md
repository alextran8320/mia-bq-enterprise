# User Stories: F-M08-KNW-004 Knowledge Documents And Source Governance

**Feature ID**: F-M08-KNW-004
**Status**: Ready for FE Build
**Linked UXUI Spec**: Approved
**Linked SRS**: SRS Ready

---

## US-KNW-004-01 — Xem Source Registry

**As** IT / PM Governance,
**I want** mở `/knowledge/sources` và thấy 3 nguồn dữ liệu với trạng thái freshness,
**So that** tôi biết nguồn nào đang stale hoặc conflict cần xử lý.

**Acceptance Criteria (mock/stub):**
- List: SAP B1 / KiotViet / Excel Upload với status dot (Active/Stale/Conflict)
- Stale nếu last_sync > 1 giờ
- Click → Source Detail

---

## US-KNW-004-02 — Xem Freshness Board

**As** IT / PM Governance,
**I want** mở `/knowledge/freshness` và thấy bảng tổng hợp freshness theo source,
**So that** tôi phát hiện nguồn nào cần sync lại trước khi AI dùng sai dữ liệu.

**Acceptance Criteria (mock/stub):**
- Bảng: Source, Last sync, Status, Days since refresh
- Badge đỏ nếu > 1 giờ, xanh nếu ≤ 1 giờ
- Restrict button cho từng source
