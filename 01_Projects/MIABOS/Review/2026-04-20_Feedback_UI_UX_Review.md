# Feedback Review — MIABOS UI/UX

**Ngày:** 2026-04-20
**Người phản hồi:** Business Owner
**Phiên bản review:** Draft
**Trạng thái:** Open — chờ xử lý
**Owner xử lý:** A06 UI/UX Agent + A07 FE Builder

---

## Tổng quan

Tài liệu ghi nhận các phản hồi chi tiết từ Business Owner sau buổi review giao diện MIABOS. Các hạng mục dưới đây cần được xử lý trước khi chuyển sang giai đoạn tiếp theo.

---

## MỤC 1 — Phản hồi AI Chat & Mock Data

### 1.1 Mock data phải viết bằng tiếng Việt và đúng với ngữ cảnh BQ

**Vấn đề hiện tại:**
Mock data trong giao diện chat đang dùng dữ liệu giả không phù hợp — tên sản phẩm, mã SKU, câu trả lời của chatbot không phản ánh đúng nghiệp vụ thực tế của Giày BQ.

**Yêu cầu chỉnh sửa:**
- Toàn bộ mock data trong màn hình AI Chat phải viết bằng **tiếng Việt**
- Tên sản phẩm dùng format thực tế: ví dụ `Giày da nam BQ-2301`, `Dép thể thao nữ BQ-1102`
- Mã SKU theo format BQ: `BQ-XXXX`
- Câu hỏi mẫu phải là câu hỏi thực tế nhân viên BQ hay hỏi:
  - *"Mã BQ-2301 size 40 màu đen còn bao nhiêu tại kho Hà Nội?"*
  - *"CTKM tháng này áp dụng cho cửa hàng chính hãng gồm những gì?"*
  - *"Giá bán lẻ hiện tại của mã BQ-1102 là bao nhiêu?"*
  - *"Đơn hàng #98765 đang ở trạng thái nào?"*
- Câu trả lời của chatbot phải có **source trace** rõ ràng theo format:
  > `Theo dữ liệu từ KiotViet (cập nhật 09:15 hôm nay): Mã BQ-2301 size 40 màu đen tại kho Hà Nội còn **10 đôi** (tồn thực: 12, đã giữ: 2).`

**Ưu tiên:** Cao
**Assignee:** A07 FE Builder

---

## MỤC 2 — Dữ liệu Đa Kênh

### 2.1 Chỉnh lại kênh hiển thị đúng với kênh BQ đang vận hành

**Vấn đề hiện tại:**
Màn hình Omnichannel / Đa kênh đang hiển thị các kênh không đúng với hệ thống thực tế của BQ.

**Yêu cầu chỉnh sửa:**
Chỉ hiển thị đúng các kênh BQ đang dùng:

| Kênh | Hiển thị trong UI | Ghi chú |
|------|-------------------|---------|
| Facebook Messenger | ✅ Giữ nguyên | Page Facebook chính thức của BQ |
| Zalo OA | ✅ Giữ nguyên | Zalo Official Account BQ |
| Zalo ZNS | ✅ Giữ nguyên | Dùng cho thông báo tự động |
| Website Chat | ✅ Giữ nguyên | Chat trên giaybq.com.vn |
| SMS | ✅ Giữ nguyên | Thông báo đơn hàng, OTP |
| Email | ✅ Giữ nguyên | CSKH & marketing |
| WhatsApp | ❌ Bỏ | BQ không dùng kênh này |
| Instagram | ❌ Bỏ | BQ không dùng kênh này |
| Telegram | ❌ Bỏ | BQ không dùng kênh này |

**Ưu tiên:** Trung bình
**Assignee:** A07 FE Builder

---

## MỤC 3 — Danh Sách CTKM (Chương Trình Khuyến Mãi)

### 3.1 Cột hiển thị trong bảng danh sách CTKM

**Yêu cầu:** Bảng danh sách CTKM phải hiển thị đúng các cột sau theo thứ tự:

| STT | Tên cột | Kiểu dữ liệu | Ghi chú |
|-----|---------|-------------|---------|
| 1 | **Mã CTKM** | Text | Mã định danh duy nhất, ví dụ: `CTKM-2026-001` |
| 2 | **Tên CTKM** | Text | Tên đầy đủ của chương trình |
| 3 | **Áp dụng tại cửa hàng** | Tag / Badge | Tất cả / Cửa hàng chính hãng / Đại lý / Online — có thể multi-select |
| 4 | **Trạng thái** | Badge màu | `Đang chạy` (xanh) · `Chờ duyệt` (vàng) · `Đã kết thúc` (xám) · `Tạm dừng` (đỏ) |
| 5 | **Ngày bắt đầu** | Date | Format: `DD/MM/YYYY` |
| 6 | **Ngày kết thúc** | Date | Format: `DD/MM/YYYY` · Highlight đỏ nếu sắp hết hạn (< 7 ngày) |
| 7 | **Action** | Button group | `Xem` · `Sửa` · `Duyệt` · `Tạm dừng` · `Nhân bản` |

**Yêu cầu bổ sung cho cột Action:**
- `Duyệt` chỉ hiển thị khi Trạng thái = `Chờ duyệt`
- `Tạm dừng` chỉ hiển thị khi Trạng thái = `Đang chạy`
- `Sửa` bị disable khi Trạng thái = `Đang chạy` hoặc `Đã kết thúc`
- `Nhân bản` luôn hiển thị — cho phép copy CTKM cũ làm template

**Mock data mẫu:**

| Mã CTKM | Tên CTKM | Áp dụng tại | Trạng thái | Ngày bắt đầu | Ngày kết thúc | Action |
|---------|----------|------------|-----------|-------------|--------------|--------|
| CTKM-2026-001 | Giảm 20% Cửa Hàng Chính Hãng Tháng 4 | Cửa hàng chính hãng | Đang chạy | 01/04/2026 | 30/04/2026 | Xem · Tạm dừng · Nhân bản |
| CTKM-2026-002 | Back-to-School — Giảm 15% Giày Học Sinh | Tất cả | Chờ duyệt | 01/08/2026 | 15/09/2026 | Xem · Sửa · Duyệt · Nhân bản |
| CTKM-2026-003 | Tết Nguyên Đán 2026 — Ưu Đãi Đặc Biệt | Tất cả | Đã kết thúc | 15/01/2026 | 10/02/2026 | Xem · Nhân bản |
| CTKM-2026-004 | Flash Sale Cuối Tuần — Giảm 10% | Online | Tạm dừng | 01/04/2026 | 30/06/2026 | Xem · Sửa · Nhân bản |

**Ưu tiên:** Cao
**Assignee:** A06 UI/UX Agent + A07 FE Builder

---

## MỤC 4 — Danh Sách Chính Sách Giá

### 4.1 Cột hiển thị trong bảng danh sách Chính sách giá

**Yêu cầu:** Bảng danh sách Chính sách giá phải hiển thị đúng các cột sau theo thứ tự:

| STT | Tên cột | Kiểu dữ liệu | Ghi chú |
|-----|---------|-------------|---------|
| 1 | **Mã bảng giá** | Text | Mã định danh duy nhất, ví dụ: `BG-2026-001` |
| 2 | **Tên bảng giá** | Text | Tên mô tả rõ đối tượng & mục đích |
| 3 | **Ngày bắt đầu** | Date | Format: `DD/MM/YYYY` |
| 4 | **Ngày kết thúc** | Date | Format: `DD/MM/YYYY` · `-` nếu áp dụng vô thời hạn |
| 5 | **Đối tượng áp dụng** | Tag | Khách lẻ · Đại lý cấp 1 · Đại lý cấp 2 · Nhân viên · VIP |
| 6 | **Khu vực bán hàng** | Tag | Toàn quốc · Miền Bắc · Miền Trung · Miền Nam · Online |
| 7 | **Trạng thái** | Badge màu | `Đang áp dụng` (xanh) · `Chờ hiệu lực` (vàng) · `Hết hiệu lực` (xám) |

**Mock data mẫu:**

| Mã bảng giá | Tên bảng giá | Ngày bắt đầu | Ngày kết thúc | Đối tượng áp dụng | Khu vực | Trạng thái |
|-------------|-------------|-------------|--------------|-------------------|---------|-----------|
| BG-2026-001 | Bảng giá bán lẻ tiêu chuẩn 2026 | 01/01/2026 | — | Khách lẻ | Toàn quốc | Đang áp dụng |
| BG-2026-002 | Bảng giá đại lý cấp 1 — Q1/2026 | 01/01/2026 | 31/03/2026 | Đại lý cấp 1 | Toàn quốc | Hết hiệu lực |
| BG-2026-003 | Bảng giá đại lý cấp 1 — Q2/2026 | 01/04/2026 | 30/06/2026 | Đại lý cấp 1 | Toàn quốc | Đang áp dụng |
| BG-2026-004 | Bảng giá nhân viên nội bộ 2026 | 01/01/2026 | 31/12/2026 | Nhân viên | Toàn quốc | Đang áp dụng |
| BG-2026-005 | Bảng giá khuyến mãi Miền Bắc T5 | 01/05/2026 | 31/05/2026 | Khách lẻ | Miền Bắc | Chờ hiệu lực |

**Ưu tiên:** Cao
**Assignee:** A06 UI/UX Agent + A07 FE Builder

---

## Tổng hợp hạng mục cần xử lý

| # | Hạng mục | Mục | Ưu tiên | Assignee | Trạng thái |
|---|---------|-----|---------|----------|-----------|
| 1 | Chỉnh mock data AI Chat sang tiếng Việt + đúng nghiệp vụ BQ | 1.1 | Cao | A07 FE | ✅ Done — 2026-04-19 |
| 2 | Chỉnh danh sách kênh đa kênh đúng với BQ | 2.1 | Trung bình | A07 FE | ⬜ Open |
| 3 | Cập nhật cột bảng danh sách CTKM | 3.1 | Cao | A06 + A07 | ⬜ Open |
| 4 | Cập nhật cột bảng danh sách Chính sách giá | 4.1 | Cao | A06 + A07 | ⬜ Open |

---

*Tài liệu này sẽ được cập nhật khi từng hạng mục hoàn thành. Assignee đánh dấu ✅ Done kèm link màn hình đã chỉnh khi xử lý xong.*
