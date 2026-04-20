---
name: MOM Buổi Gặp Thứ 2 — Giày BQ × MIABOS
type: project
status: Draft
owner: A01 PM Agent
recorded_by: Claude Code (claude-sonnet-4-6)
date: 2026-04-20
participants: Anh Tuấn Anh (BQ), Đội MIABOS
---

# MOM — Buổi Gặp Thứ 2: Giày BQ × MIABOS
**Ngày:** 2026-04-20 | **Người tham dự:** Anh Tuấn Anh (BQ — Decision Maker), Đội MIABOS

---

## 0. Hiện trạng
Team MIABOS đã demo : CRM Profile 360, luồng đồng bộ SP + Chính sách giá + Đơn hàng + Khuyến mãi ,... Chia sẻ qua về Workflow Automation, Marketing AI (Campaign & Content generation)
 Anh Tuấn Anh xem xong demo, nhận xét khá sát với nhu cầu. Tuy nhiên chia sẻ luôn CRM 360 không phải thứ đang cần — một phần là dự án riêng của phòng CNTT, không muốn trùng lắp
 Anh Tuấn Anh vẫn kỳ vọng MIA có thể hoàn thành các hạng mục: Chatbot nội bộ, Chatbot bán hàng, Marketing AI , Workflow Automation 

## 1. Chatbot Nội Bộ
> Đây là vấn đề chung của tất cả phòng ban trong BQ. Về việc mất nhiều thời gian trong việc truy xuất thông tin: Hỏi giá bán, chính sách,.... 

**Bối cảnh:** BQ đang dùng Lark 3 năm, SAP cũng vậy. Anh Tuấn Anh muốn build chatbot nội bộ trên Lark hoặc CRM nội bộ — build như vậy là tối ưu nhất cho vận hành, chỉ cần lên 1 trong 2 hệ thống đó, không cần lên thêm CRM MIABOS.

**Mong muốn anh Tuấn Anh:**
*Làm là phải làm chỉnh chu. Kết nối là kết nối qua Lark. End user tương tác Bot tư vấn nội bộ phải qua Lark hoặc SAP.*

**Vấn đề cần giải sau khi anh Tuấn Anh đi gặp các phòng khác**
- Yếu tố con người: sắp triển khai Chatbot nội bộ → cần tính toán bài toán con người vận hành như thế nào. Bản chất BQ về con người vận hành cũng sẽ có sự sai sót → phải đưa về giải pháp xử lý được
- Chatbot phải chạy trên tài khoản Lark hoặc SAP và hướng đến đúng người dùng -> để vận hành chỉ sử dụng trên 1 nơi

**Hạ tầng:** Chatbot nội bộ triển khai trên Cloud → sau này migrate lên Server của BQ. Anh Tuấn Anh cũng mong muốn phát triển dựa trên hạ tầng đó.

**Next action & kết quả cần chuẩn bị trước buổi tiếp theo:**

| #   | Việc cần làm                                                                    | Kết quả cần có                     |
| --- | ------------------------------------------------------------------------------- | ---------------------------------- |
| 1   | Xử lý triệt để use case Chatbot nội bộ — càng thực tiễn nhất càng tốt           | Demo hoặc blueprint đủ thuyết phục |
| 2   | Cài đặt Lark và kết nối qua Lark                                                | Kiến trúc tích hợp Lark Bot cụ thể |
| 3   | Dựng MS SQL để kết nối và thực hiện                                             | Sơ đồ kết nối dữ liệu rõ ràng      |
| 4   | Thiết kế giải pháp cho bài toán con người vận hành (phân quyền, sai sót, audit) | Mô hình đề xuất cụ thể             |
| 5   | Kiến trúc hạ tầng Cloud + migration plan lên Server BQ                          | Tài liệu đủ để anh Tuấn Anh review |
| 6   | Báo giá gói Chatbot Nội Bộ                                                      | Bảng giá theo scope                |

---

## 2. Chatbot Bán Hàng

**Mong muốn từ Anh Tuấn Anh sau khi trao đổi với các Phòng ban**
- Xử lý hình ảnh: khách gửi tin nhắn Facebook → bot xử lý hình ảnh để biết là sản phẩm khách đang đề cập là gì -> mặt hàng nào từ đó tư vấn cho đúng 

*Ưu tiên: xong Chatbot Nội Bộ trước, còn thời gian mới focus vào Chatbot Bán Hàng.*

**Next action & kết quả cần chuẩn bị trước buổi tiếp theo:**

| #   | Việc cần làm                               | Kết quả cần có                  |
| --- | ------------------------------------------ | ------------------------------- |
| 1   | Làm rõ bài toán xử lý hình ảnh từ Facebook | Blueprint + ví dụ demo được     |
| 2   | Xác nhận nguồn dữ liệu tư vấn cần kết nối  | Danh sách hệ thống cần tích hợp |
| 3   | Báo giá gói Chatbot Bán Hàng               | Bảng giá theo scope             |

---

## 3. Ngoài lề

- **CRM:** cần tính toán lại — Phase 3–4 vẫn khả thi
- **Marketing:** xử lý hình ảnh + video + tự động hóa một số nội dung Social
- **Phòng CNTT:** đang chạy riêng nhiều dự án nhỏ — anh Tuấn Anh trực tiếp phụ trách. Nếu đội MIA hoàn thành tốt các hạng mục đề ra thì anh Tuấn Anh sẽ tiếp tục giao thêm các dự án phụ trách 
- **Timeline:** Q3–Q4/2026 BQ chuẩn bị tinh thần chạy AI rất mạnh + chạy song song nhiều hạng mục
- **Tín hiệu quyết định:** *"Anh mà duyệt thì gần 60% BGĐ sẽ đồng ý rồi"*
