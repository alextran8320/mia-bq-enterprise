# Ghi Chú Thô BQ

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

## Bối cảnh

Business Owner yêu cầu research chuyên sâu cho `https://giaybq.com.vn/`, tập trung vào một khách hàng tiềm năng trong ngành bán lẻ giày dép, có hơn 200 cửa hàng/đại lý, và đang có nhu cầu về một chatbot nội bộ phục vụ các bài toán vận hành cũng như các use case liên quan đến dự báo trên nền `SAP B1`.

## Input thô từ Business Owner

### Bối cảnh khách hàng ban đầu

- Khách hàng tiềm năng: `Giày BQ`
- Loại hình kinh doanh: chuỗi bán lẻ giày dép có cửa hàng và đại lý
- Insight từ Business Owner: `hơn 200 cửa hàng (bao gồm cả đại lý)`
- Manh mối về hệ thống đang dùng: `SAP B1`
- Mối quan tâm ban đầu: `chatbot nội bộ` cho các bài toán nội bộ, có liên quan đến forecasting

### Khung M2C mà Business Owner yêu cầu

Business Owner yêu cầu phân tích BQ theo 4 lớp đối tượng:

1. `Nhà cung cấp`
2. `Nhà phân phối`
3. `Điểm bán lẻ của chính cửa hàng + mô hình nhượng quyền/đại lý`
4. `Người tiêu dùng`

### Các tín hiệu bổ sung được ghi nhận sau đó

Các ý dưới đây được Business Owner chuyển lại như ghi chú phản hồi từ khách hàng và ghi chú định hướng:

- `bravo`
- `SAP B1`
- `Forecast / predict trend`
- `Promotions at stores`
- `Logistics`
- `One-price policy, with specific promotions for owned stores (for example, 20% discount at official stores)`
- `Promotion policy fit is currently done manually` — note cũ cần đọc lại cẩn trọng: Business Owner đã clarify ngày 2026-04-19 rằng CTKM không phải pain point của BQ; đây chỉ là một nhóm dữ liệu/use case cần AI tra cứu đúng scope.
- `From 2026 -> 2027: run AI projects in parallel`
- `Need 10 implementation directions, with a clear sequence: what first, what later`
- `BQ is planning its own Data Warehouse as the source-of-truth layer receiving data from SAP B1, KiotViet, and Haravan`

### Các hướng giải pháp mà Business Owner đã nhắc đến

1. Build một `chatbot nội bộ` có thể trả lời FAQ nội bộ về:
   - `SAP B1`
   - `Haravan`
   - `KiotViet`
   - `Excel`
   - `tồn kho`
   - `chính sách giá`
   - `thông tin sản phẩm`
2. Triển khai AI hỗ trợ `marketing` và `sales`
3. Build một `chatbot bán hàng external` / `omni-chat`
4. Build `AI automation` cho các vị trí có nhiều công việc lặp đi lặp lại trong:
   - `HR`
   - `tuyển dụng`
   - `marketing`
   - `vận hành content social`
   - `tài chính kế toán`
5. Định hướng chiến lược được clarify lại: `Data Warehouse` của riêng BQ, không phải Lark. BQ không dùng Lark trong operation hiện tại.

## Ghi chú tiếng Việt đã chuyển có dấu

Các cụm tiếng Việt dưới đây được giữ nguyên nội dung từ raw intake ban đầu, chỉ chuyển sang tiếng Việt có dấu để dễ đọc:

> bravo
> SAP B1
> Dự báo dự đoán trend
> Khuyến mãi ở các cửa hàng
> Logistic
> Chính sách giá là 1 giá, áp dụng cho những CTKM riêng (giảm giá 20% các cửa hàng chính hãng)
> Chính sách khuyến mãi phù hợp là làm thủ công
> từ 2026 -> 2027: Chạy các dự án về AI song song luôn
> 10 hướng để triển khai: cái nào triển khai trước, cái nào triển khai sau
> Cần:
> 1. Build hệ thống chatbot nội bộ...
> 2. Triển khai: Marketing, sales
> 3. Triển khai hệ thống Chatbot bán hàng...
> 4. AI Automation vị trí công việc liên quan đến lặp đi lặp lại...
> -> Định hướng triển khai Data Lark

> **Correction 2026-04-19**: Business Owner clarify rằng BQ **không sử dụng Lark**. Cụm `Data Lark` trong raw note phải được hiểu lại là định hướng xây **Data Warehouse của riêng BQ** để hứng dữ liệu từ SAP B1, KiotViet, Haravan. CTKM không phải pain point; CTKM chỉ là một miền dữ liệu vận hành cần tra cứu đúng scope.

## Diễn giải nghiệp vụ từ raw intake

- Khách hàng không chỉ hỏi về một chatbot đơn lẻ.
- Khách hàng đang có xu hướng nghĩ theo một `AI transformation roadmap` rộng hơn, nhiều phase, nhiều phòng ban.
- BQ đang dự định xây `Data Warehouse` làm source-of-truth dữ liệu của riêng BQ. MIABOS cần đứng đúng vai trò `Core AI CRM Platform`, không thay thế Data Warehouse và không tự tạo dữ liệu vận hành BQ ngoài `Conversation` và `Knowledge`.
- Bộ bài toán cần frame đúng gồm: `AI Internal Chatbot` cho hỏi đáp nội bộ của BQ; `AI External Chatbot` cho tư vấn bán hàng trên Social + Ecommerce; `AI Automation` cho kế toán, tài chính, HR và các việc lặp lại; `Forecasting` ở phase sau khi data readiness đủ.
- Điểm vào thực tế nhất hiện tại là `AI Internal Chatbot` triển khai trước cho các team nội bộ/content của BQ, vì đây là lớp tạo thói quen dùng AI, chuẩn hóa knowledge, và kiểm chứng integration trước khi rollout diện rộng.
