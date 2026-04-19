# Bộ Nghiên Cứu Khách Hàng Giày BQ

**Status**: Draft
**Owner**: A01 PM Agent
**Last Updated By**: Codex CLI (GPT-5.4 Codex environment)
**Last Reviewed By**: -
**Approval Required**: Business Owner
**Approved By**: -
**Last Status Change**: 2026-04-19
**Source of Truth**: This file
**Blocking Reason**: -

---

## 1. Tóm tắt điều hành

`Giày BQ` cho thấy dấu hiệu của một thương hiệu giày dép Việt Nam đang vận hành theo mô hình bán lẻ đa điểm bán, đa kênh, có cả hệ thống cửa hàng chính hãng lẫn đại lý/đối tác, đồng thời đã có nền hiện diện số tương đối rõ qua website commerce, loyalty, đơn hàng online, và ứng dụng phục vụ đối tác.

> **Clarification 2026-04-19 từ Business Owner**: Không dùng framing `HQ`. Tài liệu phải gọi là `BQ`, `ban điều hành BQ`, `khối vận hành BQ`, hoặc `bộ phận phụ trách` tùy ngữ cảnh. CTKM khác nhau dưới cùng một chính sách giá là cách BQ vận hành, không phải pain point. BQ đang dự định xây `Data Warehouse` làm source-of-truth dữ liệu của riêng BQ; MIABOS được định vị là `Core AI CRM Platform`, chỉ tạo thêm `Conversation` và `Knowledge`, không sở hữu source data vận hành của BQ.

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

### 2.2 Lớp BQ / điều phối thương hiệu và kênh

- Quản trị thương hiệu BQ
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

### 3.1 Dữ liệu phân mảnh và nhu cầu Data Warehouse của BQ

- Dữ liệu vận hành nhiều khả năng đang nằm rải ở `SAP B1`, `KiotViet`, `Haravan`, và file Excel.
- Cùng một câu hỏi có thể cho ra nhiều đáp án khác nhau tùy vào hệ thống mà người dùng kiểm tra.
- Business Owner đã clarify BQ đang dự định xây `Data Warehouse` để làm source-of-truth dữ liệu riêng của BQ, hứng dữ liệu từ SAP B1, KiotViet, Haravan.
- Đây là bài toán nền của phía BQ: nếu Data Warehouse / source-of-truth chưa rõ thì chatbot, CRM AI, automation, và forecasting đều dễ mất niềm tin từ người dùng.
- Vai trò MIABOS là Core AI CRM Platform tiêu thụ source data đã được BQ cho phép, tạo Conversation/Knowledge, và trả lời có source/freshness; MIABOS không thay thế Data Warehouse.

### 3.2 Khả năng nhìn tồn kho và phân bổ hàng

- Bài toán thực không chỉ là thiếu hàng, mà là hàng đang nằm sai chỗ.
- Một doanh nghiệp bán lẻ giày dép phải quản lý tồn ở cấp `SKU x size x màu x cửa hàng/kênh`.
- Vì vậy, bài toán vận hành không dừng ở “có hàng hay không”, mà là “mã nào, size nào, ở đâu, và có nên chuyển hay không”.

### 3.3 Giá và CTKM là miền dữ liệu vận hành, không phải pain point

- Ghi chú từ khách cho thấy có `chính sách 1 giá` nhưng CTKM lại khác nhau theo kênh hoặc loại cửa hàng.
- Business Owner đã clarify đây là **cách BQ đang vận hành**, không phải vấn đề cần sửa.
- MIABOS chỉ cần tra cứu và diễn giải đúng chính sách/CTKM đang hiệu lực theo context người hỏi, không định vị CTKM là pain point.
- Nếu dữ liệu CTKM được đưa vào POC, câu trả lời cần nêu rõ nguồn, phạm vi áp dụng, hiệu lực, và public/internal scope.

### 3.4 Nhu cầu hỏi đáp và tư vấn AI theo miền nghiệp vụ

- BQ có nhu cầu AI hỗ trợ nhiều miền: hỏi đáp nội bộ, tư vấn bán hàng ngoài kênh Social + Ecommerce, automation cho kế toán/tài chính/HR, và forecasting.
- Với CTKM, nhu cầu đúng là `tra cứu / giải thích / tư vấn theo context`, không phải sửa quy trình CTKM.
- Phase đầu nên chọn các use case có thể demo rõ bằng dữ liệu/knowledge đã có: hỏi đáp nội bộ, tra sản phẩm/tồn kho/giá/CTKM khi được cấp dữ liệu, và source trace.

### 3.5 Khoảng trống readiness cho forecasting

- Khách hàng có nhu cầu forecasting và dự đoán trend, nhưng đây là nhóm use case yêu cầu dữ liệu lịch sử đủ sạch, master data được map tốt, và quy tắc source-of-truth ổn định.
- Vì vậy forecasting nên được xem là năng lực ở phase sau, phụ thuộc vào Data Warehouse / data readiness của BQ, không phải bước triển khai đầu tiên.

### 3.6 Phụ thuộc nhiều vào tri thức nội bộ

- Các team nội bộ nhiều khả năng đang hỏi đi hỏi lại các câu quanh:
  - inventory
  - pricing policy
  - promotions
  - product information
  - logistics
  - system usage (`SAP B1`, `KiotViet`, `Haravan`, Excel)

## 4. Vì sao phase 1 nên là AI Internal Chatbot cho nhóm nội bộ/content trước

Từ góc nhìn Product Strategy, AI Internal Chatbot là điểm vào hợp lý nhất vì nó giải quyết đồng thời 3 việc nền:

1. `Chuẩn hóa tri thức`
2. `Truy cập dữ liệu business bằng ngôn ngữ tự nhiên`
3. `Tạo thói quen dùng AI trong vận hành hàng ngày`

Business Owner định hướng rollout nên bắt đầu cho các bộ phận nội dung/nội bộ của BQ trước, sau đó mới mở diện rộng cho các bộ phận khác.

### Kết quả mục tiêu của phase 1

- Giảm thời gian nội bộ phải đi tìm thông tin
- Giảm phụ thuộc vào một vài nhân sự nhiều kinh nghiệm
- Tạo một lớp hỏi đáp AI có source trace trên các hệ thống BQ cho phép truy cập hoặc trên Data Warehouse khi sẵn sàng
- Xây niềm tin vào AI bằng các use case vận hành dạng read-only trước khi đi sang automation hoặc prediction

## 5. Roadmap AI đề xuất cho BQ

### Phase 1: AI Internal Chatbot + Knowledge cho nội bộ/content team

- FAQ nội bộ
- Tra cứu tồn kho
- Tra cứu chính sách giá
- Tra cứu CTKM theo context vận hành khi dữ liệu được cấp
- Tra cứu sản phẩm
- Hướng dẫn sử dụng `SAP B1`, `KiotViet`, `Haravan`, Excel
- Ưu tiên rollout cho các bộ phận nội dung/nội bộ trước khi triển khai rộng

### Phase 2: Core AI CRM + AI External Chatbot

- Customer 360
- Làm giàu dữ liệu loyalty và dữ liệu khách hàng
- AI External Chatbot tư vấn bán hàng trên Social + Ecommerce
- Điều hướng và hỗ trợ khách hàng đa kênh ở mức public-safe

### Phase 3: AI Automation cho bộ phận lặp lại nhiều

- Hỗ trợ lập kế hoạch marketing và content
- Tự động hóa workflow cho kế toán, tài chính, HR, tuyển dụng, vận hành content social, và các vai trò có nhiều tác vụ lặp lại

### Phase 4: Forecasting

- Dự đoán trend
- Dự báo nhu cầu
- Hỗ trợ phân bổ hàng
- Hỗ trợ decision intelligence khi Data Warehouse / historical data đủ sẵn sàng

## 6. Lưu ý và cảnh báo từ public research

- Việc cùng tồn tại thông tin `34 tỉnh/thành` trên một trang và `43 tỉnh/thành` trên một trang khác là một ví dụ rõ cho khả năng governance chưa đồng nhất giữa các kênh.
- Đây nên được xem là tín hiệu cần kiểm chứng thêm khi thiết kế Data Warehouse / source-of-truth của BQ, không phải bằng chứng kết luận về vận hành nội bộ.
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

BQ nên được nhìn như một cơ hội `Core AI CRM Platform nhiều phase`, chứ không chỉ là một yêu cầu chatbot đơn lẻ.

Deliverable đầu tiên nên là một gói `AI Internal Chatbot + Knowledge + Conversation + integration-ready read layer`, triển khai trước cho nhóm nội bộ/content của BQ. Đây là nền móng cần thiết để đi tiếp sang Core AI CRM, external sales chatbot, automation, và forecasting khi Data Warehouse của BQ sẵn sàng.
