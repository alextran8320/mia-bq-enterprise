# User Stories: F-M08-KNW-003 FAQ And Policy Library

**Feature ID**: F-M08-KNW-003
**Status**: Ready for FE Build
**Linked UXUI Spec**: Approved
**Linked SRS**: SRS Ready
**Last Updated By**: Codex CLI (GPT-5.4 Codex environment)
**Last Updated**: 2026-04-17

---

## US-KNW-003-01 — Tìm kiếm tài liệu trong Library

**As** Nhân viên nội bộ,
**I want** mở `/knowledge`, chọn folder trong cây nội dung hoặc tìm theo từ khóa,
**So that** tôi tìm nhanh chính sách hoặc FAQ cần tra cứu.

**Acceptance Criteria (mock/stub):**
- Search bar nằm trên command bar của `/knowledge`
- Folder tree có root `SOP`, `FAQ`, `Policy`, `System Guide`, `Imported / Chờ phân loại`
- Knowledge topic menu (Pricing Policy / Promotion Policy / CSKH Policy / Store SOP / Ecommerce Service / System Usage)
- Kết quả hiện: Title, Type badge, Knowledge Topic, Freshness
- No-result state có contact/escalation path, không tạo object xử lý thiếu tri thức riêng trong M08

---

## US-KNW-003-02 — Xem Document Detail từ Library

**As** Nhân viên nội bộ,
**I want** click vào kết quả tìm kiếm và đọc tài liệu đầy đủ trong preview/detail panel,
**So that** tôi áp dụng đúng chính sách mà không cần hỏi lại.

**Acceptance Criteria (mock/stub):**
- Hiện: Kết luận/quy tắc trước, scope/exception sau
- Nếu tài liệu là SOP, hiện các SOP Step theo thứ tự thao tác
- Nếu tài liệu có hình ảnh/bảng/attachment, detail panel render đầy đủ rich content mock
- Scope badge (nội bộ / store staff / all)
- Superseded banner nếu tài liệu đã thay thế
