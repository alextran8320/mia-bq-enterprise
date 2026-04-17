# User Stories: F-M08-KNW-004 Knowledge Documents And Source Governance

**Feature ID**: F-M08-KNW-004
**Status**: Ready for FE Build
**Linked UXUI Spec**: Approved
**Linked SRS**: SRS Ready
**Last Updated By**: Codex CLI (GPT-5.4 Codex environment)
**Last Updated**: 2026-04-17

---

## US-KNW-004-01 — Xem Source Registry

**As** IT / PM Governance,
**I want** mở `/knowledge` và chọn section `Source Health`,
**So that** tôi biết nguồn nào đang active, stale, hoặc restricted trước khi AI dùng.

**Acceptance Criteria (mock/stub):**
- List: SAP B1 / KiotViet / Excel Upload với status dot (Active/Stale/Restricted)
- Stale nếu last_sync > 1 giờ
- Click → Source Detail panel trong cùng `/knowledge` workspace
- Source detail hiển thị linked documents/assets nếu có tài liệu import từ nguồn đó

---

## US-KNW-004-02 — Xem Freshness Board

**As** IT / PM Governance,
**I want** xem section freshness trong `/knowledge`,
**So that** tôi phát hiện nguồn nào cần sync lại hoặc restrict trước khi AI dùng sai dữ liệu.

**Acceptance Criteria (mock/stub):**
- Bảng: Source, Last sync, Status, Days since refresh
- Badge đỏ nếu > 1 giờ, xanh nếu ≤ 1 giờ
- Restrict button cho từng source
