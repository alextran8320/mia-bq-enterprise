# User Stories: F-M08-KNW-003 FAQ And Policy Library

**Feature ID**: F-M08-KNW-003
**Status**: Ready for FE Build
**Linked UXUI Spec**: Approved
**Linked SRS**: SRS Ready

---

## US-KNW-003-01 — Tìm kiếm tài liệu trong Library

**As** Nhân viên nội bộ,
**I want** mở `/knowledge/library`, chọn domain và tìm theo từ khóa,
**So that** tôi tìm nhanh chính sách hoặc FAQ cần tra cứu.

**Acceptance Criteria (mock/stub):**
- Search bar focused on load
- Domain menu (Giá / Sản phẩm / Đổi trả / Vận hành)
- Kết quả hiện: Title, Type badge, Domain, Freshness
- No-result state có link "Báo thiếu tài liệu"

---

## US-KNW-003-02 — Xem Document Detail từ Library

**As** Nhân viên nội bộ,
**I want** click vào kết quả tìm kiếm và đọc tài liệu đầy đủ,
**So that** tôi áp dụng đúng chính sách mà không cần hỏi lại.

**Acceptance Criteria (mock/stub):**
- Hiện: Kết luận/quy tắc trước, scope/exception sau
- Scope badge (nội bộ / store staff / all)
- Superseded banner nếu tài liệu đã thay thế
