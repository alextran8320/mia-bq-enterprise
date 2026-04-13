# Ghi Chú Thô BQ

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
- `Promotion policy fit is currently done manually`
- `From 2026 -> 2027: run AI projects in parallel`
- `Need 10 implementation directions, with a clear sequence: what first, what later`

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
5. Định hướng chiến lược: `Data Lark`

## Ghi chú tiếng Việt được giữ nguyên

Các cụm tiếng Việt dưới đây được giữ lại vì đây là một phần của raw intake ban đầu:

> bravo  
> SAP B1  
> Du bao du doan trend  
> Khuyen mai o cac cua hang  
> Logistic  
> Chinh sach gia la 1 gia, ap dung cho nhung CTKM rieng (giam gia 20% cac cua hang chinh hang)  
> Chinh sach khuyen mai phu hop la lam thu cong  
> tu 2026 -> 2027: Chay cac du an ve AI song song luon  
> 10 huong de trien khai: cai nao trien khai truoc, cai nao trien khai sau  
> Can:  
> 1. Build he thong chatbot noi bo...  
> 2. Trien khai: Marketing, sales  
> 3. Trien khai he thong Chatbot ban hang...  
> 4. AI Automation vi tri cong viec lien quan den lap di lap lai...  
> -> Dinh huong trien khai Data Lark

## Diễn giải nghiệp vụ từ raw intake

- Khách hàng không chỉ hỏi về một chatbot đơn lẻ.
- Khách hàng đang có xu hướng nghĩ theo một `AI transformation roadmap` rộng hơn, nhiều phase, nhiều phòng ban.
- Điểm vào thực tế nhất hiện tại là `chatbot nội bộ`, vì đây là lớp có thể chuẩn hóa tri thức, giảm phân mảnh dữ liệu, và tạo nền cho CRM, chatbot external, automation, và forecasting về sau.
