# User Stories: F-M08-KNW-001 Knowledge And Policy

**Feature ID**: F-M08-KNW-001
**Status**: Ready for FE Build
**Linked UXUI Spec**: Approved
**Linked SRS**: SRS Ready

---

## US-KNW-001-01 — Xem Knowledge Home

**As** Knowledge Owner / User nội bộ,
**I want** mở `/knowledge` và thấy tổng quan tài liệu theo domain,
**So that** tôi biết ngay có bao nhiêu tài liệu, loại nào đang stale, và truy cập nhanh.

**Acceptance Criteria (mock/stub):**
- Trang load ≤ 2s với mock data
- Hiện stats: Tổng tài liệu / Pending review / Stale
- Filter theo domain (Giá / Sản phẩm / Đổi trả / Vận hành)
- Recent docs list và Featured docs section

---

## US-KNW-001-02 — Tạo tài liệu mới

**As** Knowledge Owner,
**I want** click "+ Tạo tài liệu mới" và điền form,
**So that** tôi có thể submit tài liệu để reviewer duyệt.

**Acceptance Criteria (mock/stub):**
- Form có: Type selector (FAQ/SOP/Policy/System Guide), Title, Domain, Body, Source
- Required field validation
- Submit hiện toast "Đã gửi để duyệt"

---

## US-KNW-001-03 — Xem Document Detail

**As** User nội bộ,
**I want** xem đầy đủ nội dung tài liệu tại `/knowledge/:id`,
**So that** tôi đọc được chính sách/FAQ mà không cần xuất file.

**Acceptance Criteria (mock/stub):**
- Hiện: Type badge, Domain, Owner, Effective date, Body
- Stale banner nếu `last_updated > 1 giờ`
- Superseded banner nếu có version mới hơn
