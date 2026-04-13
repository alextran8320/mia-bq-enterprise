# Bộ Nghiên Cứu Khách Hàng Giày BQ

**Status**: Draft
**Owner**: A01 PM Agent
**Last Updated By**: Codex CLI (GPT-5 Codex)
**Last Reviewed By**: -
**Approval Required**: Business Owner
**Approved By**: -
**Last Status Change**: 2026-04-13
**Source of Truth**: This file
**Blocking Reason**: -

---

## 1. Tóm tắt điều hành

`Giày BQ` cho thấy dấu hiệu của một thương hiệu giày dép Việt Nam đang vận hành theo mô hình bán lẻ đa điểm bán, đa kênh, có cả hệ thống cửa hàng chính hãng lẫn đại lý/đối tác, đồng thời đã có nền hiện diện số tương đối rõ qua website commerce, loyalty, đơn hàng online, và ứng dụng phục vụ đối tác.

### Một số tín hiệu nổi bật từ footprint public

- Trang hệ thống cửa hàng public ghi hiện diện tại `43 tỉnh/thành` với `hơn 200 cửa hàng và đại lý`.
- Trang hợp tác kinh doanh public ghi `hơn 20 năm`, `hơn 2 triệu khách hàng`, và `hơn 200 cửa hàng và đại lý`.
- Footprint public có ecommerce, hotline CSKH, chính sách khách hàng thân thiết, tra cứu đơn hàng online, và chính sách bảo hành trọn đời.
- Listing trên App Store của ứng dụng `Giày BQ` có nhắc tới các luồng nghiệp vụ thiên về đại lý như tìm sản phẩm, đặt số lượng lớn, chat với cửa hàng, và nhận thông báo.

## 2. Cách nhìn business model

Nếu nhìn dưới góc Product + Business Analysis, mô hình của BQ có thể chia thành 4 lớp business liên thông với nhau.

### 2.1 Lớp nhà cung cấp

- Cung ứng nguyên vật liệu, phụ kiện, bao bì, hoặc OEM/ODM/gia công thành phẩm
- Trọng tâm vận hành: giá, lead time, độ ổn định chất lượng, MOQ, truy xuất nguồn gốc

### 2.2 Lớp nhà phân phối / brand HQ

- Quản trị thương hiệu trung tâm
- Hoạch định danh mục sản phẩm
- Thiết kế chính sách giá và khuyến mãi
- Điều phối kho và phân bổ hàng
- Hỗ trợ đại lý và quản trị kênh

### 2.3 Lớp cửa hàng chính hãng + đại lý/nhượng quyền

- Vận hành tại điểm bán
- Nghiệp vụ POS
- Theo dõi tồn kho tại điểm bán
- Triển khai CTKM
- Chăm sóc khách tại cửa hàng
- Onboarding và quản trị kênh đại lý

### 2.4 Lớp người tiêu dùng

- Tạo nhu cầu và chuyển đổi mua hàng
- Hành vi mua sắm đa kênh
- Loyalty và mua lặp lại
- Kỳ vọng về đổi trả, bảo hành, hậu mãi

## 3. Các bài toán cốt lõi suy ra cho doanh nghiệp kiểu BQ

### 3.1 Dữ liệu phân mảnh

- Dữ liệu vận hành nhiều khả năng đang nằm rải ở `SAP B1`, `KiotViet`, `Haravan`, và file Excel.
- Cùng một câu hỏi có thể cho ra nhiều đáp án khác nhau tùy vào hệ thống mà người dùng kiểm tra.
- Đây là bài toán nền, vì nếu không giải quyết lớp source-of-truth thì chatbot, CRM, automation, và forecasting đều dễ mất niềm tin từ người dùng.

### 3.2 Khả năng nhìn tồn kho và phân bổ hàng

- Bài toán thực không chỉ là thiếu hàng, mà là hàng đang nằm sai chỗ.
- Một doanh nghiệp bán lẻ giày dép phải quản lý tồn ở cấp `SKU x size x màu x cửa hàng/kênh`.
- Vì vậy, bài toán vận hành không dừng ở “có hàng hay không”, mà là “mã nào, size nào, ở đâu, và có nên chuyển hay không”.

### 3.3 Độ phức tạp của giá và CTKM

- Ghi chú từ khách cho thấy có `chính sách 1 giá` nhưng CTKM lại khác nhau theo kênh hoặc loại cửa hàng.
- Điều này tạo ra độ phức tạp cao giữa cửa hàng chính hãng, đại lý, ecommerce, và omni-channel commerce.
- Nếu không có rule rõ và data đồng nhất, người dùng nội bộ rất dễ hỏi cùng một câu nhưng mỗi nơi trả lời một kiểu.

### 3.4 Quyết định CTKM còn thủ công

- Ghi chú khách hàng nêu rõ việc xác định CTKM phù hợp hiện vẫn làm thủ công.
- Điều này làm chậm vòng phản ứng với markdown, sell-through, hàng chậm bán, và hiệu quả campaign.
- Đây cũng là một use case rất phù hợp để AI hỗ trợ ở giai đoạn sau, sau khi phase 1 đã giúp chuẩn hóa tri thức và dữ liệu.

### 3.5 Khoảng trống readiness cho forecasting

- Khách hàng có nhu cầu forecasting và dự đoán trend, nhưng đây là nhóm use case yêu cầu dữ liệu lịch sử đủ sạch, master data được map tốt, và quy tắc source-of-truth ổn định.
- Vì vậy forecasting nên được xem là năng lực ở phase sau, không phải bước triển khai đầu tiên.

### 3.6 Phụ thuộc nhiều vào tri thức nội bộ

- Các team nội bộ nhiều khả năng đang hỏi đi hỏi lại các câu quanh:
  - inventory
  - pricing policy
  - promotions
  - product information
  - logistics
  - system usage (`SAP B1`, `KiotViet`, `Haravan`, Excel)

## 4. Vì sao phase 1 nên là chatbot nội bộ

Từ góc nhìn Product Strategy, chatbot nội bộ là điểm vào hợp lý nhất vì nó giải quyết đồng thời 3 vấn đề nền:

1. `Chuẩn hóa tri thức`
2. `Truy cập dữ liệu business bằng ngôn ngữ tự nhiên`
3. `Tạo thói quen dùng AI trong vận hành hàng ngày`

### Kết quả mục tiêu của phase 1

- Giảm thời gian nội bộ phải đi tìm thông tin
- Giảm phụ thuộc vào một vài nhân sự nhiều kinh nghiệm
- Tạo một lớp truy vấn thống nhất trên các hệ thống bị phân mảnh
- Xây niềm tin vào AI bằng các use case vận hành dạng read-only trước khi đi sang automation hoặc prediction

## 5. Roadmap AI đề xuất cho BQ

### Phase 1: AI Chatbot nội bộ

- FAQ nội bộ
- Tra cứu tồn kho
- Tra cứu chính sách giá
- Tra cứu chính sách CTKM
- Tra cứu sản phẩm
- Hướng dẫn sử dụng `SAP B1`, `KiotViet`, `Haravan`, Excel

### Phase 2: CRM + AI External Chatbot

- Customer 360
- Làm giàu dữ liệu loyalty và dữ liệu khách hàng
- Chatbot bán hàng external
- Điều hướng và hỗ trợ khách hàng đa kênh

### Phase 3: Marketing AI + AI Automation

- Hỗ trợ lập kế hoạch marketing và content
- Tự động hóa workflow cho HR, tuyển dụng, tài chính, vận hành content social, và các vai trò có nhiều tác vụ lặp lại

### Phase 4: Forecasting

- Dự đoán trend
- Dự báo nhu cầu
- Hỗ trợ phân bổ hàng
- Hỗ trợ gợi ý CTKM

## 6. Lưu ý và cảnh báo từ public research

- Việc cùng tồn tại thông tin `34 tỉnh/thành` trên một trang và `43 tỉnh/thành` trên một trang khác là một ví dụ rõ cho khả năng governance chưa đồng nhất giữa các kênh.
- Đây nên được xem là tín hiệu cho thấy vấn đề quản lý source-of-truth nội bộ có thể đã tồn tại trước khi làm AI.
- Một phần mapping về phòng ban/chức năng được support trực tiếp từ footprint public; một phần là suy luận nghiệp vụ hợp lý từ mô hình vận hành.

## 7. Nguồn đã dùng

- `https://giaybq.com.vn/`
- `https://giaybq.com.vn/pages/he-thong-cua-hang`
- `https://giaybq.com.vn/pages/lien-he`
- `https://giaybq.com.vn/pages/tra-cuu-don-hang-online`
- `https://giaybq.com.vn/pages/chinh-sach-doi-tra`
- `https://giaybq.com.vn/pages/chinh-sach-doi-tra-online`
- `https://giaybq.com.vn/pages/chinh-sach-bao-hanh-tron-doi`
- `https://giaybq.com.vn/pages/chinh-sach-khach-hang-than-thiet`
- `https://hoptackinhdoanh.giaybq.com.vn/`
- `https://apps.apple.com/vn/app/giay-bq/id1495668379?l=vi`

## 8. Khuyến nghị điều hành

BQ nên được nhìn như một cơ hội `AI operating layer nhiều phase`, chứ không chỉ là một yêu cầu chatbot đơn lẻ.

Deliverable đầu tiên nên là một gói `chatbot nội bộ + knowledge layer + integration foundation`, vì đây là nền móng cần thiết để đi tiếp sang CRM, chatbot external, automation, và forecasting.
