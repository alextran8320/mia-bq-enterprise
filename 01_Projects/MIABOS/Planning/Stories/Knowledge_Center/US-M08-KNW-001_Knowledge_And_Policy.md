# User Stories: F-M08-KNW-001 Knowledge And Policy

**Feature ID**: F-M08-KNW-001
**Status**: Ready for FE Build
**Linked UXUI Spec**: Approved
**Linked SRS**: SRS Ready
**Last Updated By**: Codex CLI (GPT-5.4 Codex environment)
**Last Updated**: 2026-04-17

---

## US-KNW-001-01 — Xem Knowledge Home

**As** Knowledge Owner / User nội bộ,
**I want** mở `/knowledge` và thấy một Knowledge Center workspace có cây nội dung, search, sections, và preview/detail panel,
**So that** tôi biết ngay tài liệu nằm ở đâu, loại nào đang stale/chờ duyệt, và có thể truy cập nhanh mà không phải nhảy qua nhiều page.

**Acceptance Criteria (mock/stub):**
- Trang load ≤ 2s với mock data
- Hiện stats: Tổng tài liệu / Pending review / Stale
- Left folder tree root gồm `SOP`, `FAQ`, `Policy`, `System Guide`, `Imported / Chờ phân loại`
- Top command bar có global search, `Import tài liệu`, `Tạo thủ công`
- Center có sections: `Chờ xử lý`, `Tài liệu trong folder đang chọn`, `Cập nhật gần đây`
- Right preview/detail panel cập nhật khi click một tài liệu
- Filter theo knowledge topic (Pricing Policy / Promotion Policy / CSKH Policy / Store SOP / Ecommerce Service / System Usage)

---

## US-KNW-001-02 — Import tài liệu mới

**As** Knowledge Owner,
**I want** click `Import tài liệu` từ `/knowledge`,
**So that** tôi có thể đưa tài liệu từ phòng ban khác vào Knowledge Center mà không mất hình ảnh, bảng, hoặc attachment.

**Acceptance Criteria (mock/stub):**
- `Import tài liệu` là primary CTA trên command bar
- Import drawer hỗ trợ chọn source type hoặc upload mock file
- Form có: Category (SOP/FAQ/Policy/System Guide), Knowledge Topic, Folder, Owner, Effective Date, Source
- Preview sau import hiển thị mock counts: text sections, images, tables, attachments
- Nếu mock asset lỗi, hiện warning "Có hình ảnh chưa import thành công"
- Submit hiện toast "Đã import và gửi để duyệt"

---

## US-KNW-001-03 — Tạo tài liệu thủ công

**As** Knowledge Owner,
**I want** click `Tạo thủ công` và điền form trong drawer,
**So that** tôi có thể submit tài liệu để reviewer duyệt.

**Acceptance Criteria (mock/stub):**
- Form có: Type selector (FAQ/SOP/Policy/System Guide), Title, Knowledge Topic, Folder, Body rich text, Source
- Nếu Type = SOP, form hỗ trợ nhập danh sách SOP Step theo thứ tự thao tác
- Rich editor có vùng mock cho image/table/attachment
- Required field validation
- Submit hiện toast "Đã gửi để duyệt"

---

## US-KNW-001-04 — Xem Document Detail

**As** User nội bộ,
**I want** xem đầy đủ nội dung tài liệu trong preview/detail panel của `/knowledge`,
**So that** tôi đọc được chính sách/FAQ mà không cần xuất file.

**Acceptance Criteria (mock/stub):**
- Hiện: Type badge, Knowledge Topic, Owner, Effective date, Body
- Nếu là SOP, hiện SOP Step theo thứ tự: actor, action, expected output, exception path
- Nếu tài liệu có hình ảnh/bảng/attachment, detail panel render mock rich content rõ ràng
- Stale banner nếu `last_updated > 1 giờ`
- Superseded banner nếu có version mới hơn
