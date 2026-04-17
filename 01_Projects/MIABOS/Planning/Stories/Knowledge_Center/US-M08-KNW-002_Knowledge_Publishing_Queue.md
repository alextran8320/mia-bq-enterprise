# User Stories: F-M08-KNW-002 Knowledge Publishing Queue

**Feature ID**: F-M08-KNW-002
**Status**: Ready for FE Build
**Linked UXUI Spec**: Approved
**Linked SRS**: SRS Ready

---

## US-KNW-002-01 — Xem Queue List

**As** Domain Reviewer,
**I want** mở `/knowledge/publishing-queue` và thấy danh sách tài liệu chờ duyệt,
**So that** tôi biết cần review cái nào và theo thứ tự nào.

**Acceptance Criteria (mock/stub):**
- List có: Title, Type, Domain, Submitted by, Time waiting, SLA indicator
- SLA badge: Gấp (đỏ) / Bình thường (xám)
- Click row → mở Review Detail

---

## US-KNW-002-02 — Review và Approve/Reject

**As** Domain Reviewer,
**I want** xem diff của tài liệu và approve hoặc reject có comment,
**So that** chỉ tài liệu đúng mới được publish lên hệ thống.

**Acceptance Criteria (mock/stub):**
- Tab: Summary / Nội dung / Lịch sử
- Approve button → toast "Đã duyệt"
- Reject button → yêu cầu comment → toast "Đã từ chối"
