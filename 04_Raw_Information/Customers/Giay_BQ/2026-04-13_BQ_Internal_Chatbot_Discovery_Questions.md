# Bộ Câu Hỏi Khai Thác Chuyên Sâu Cho Chatbot Nội Bộ BQ

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

## Mục đích

Bộ câu hỏi này dùng để làm rõ phạm vi thực tế của `chatbot nội bộ` cho BQ và tách bạch giữa `FAQ`, `Q&A dữ liệu`, `hỗ trợ ra quyết định`, và `workflow automation` ở các giai đoạn sau.

## 1. Mục tiêu kinh doanh

- 3 vấn đề nội bộ lớn nhất mà chatbot phải giải quyết trong 3-6 tháng đầu là gì?
- Kết quả nào quan trọng nhất: tra cứu nhanh hơn, ít câu hỏi nội bộ hơn, quyết định vận hành tốt hơn, giảm phụ thuộc vào nhân sự nhiều kinh nghiệm, hay kiểm soát tồn kho tốt hơn?
- Ưu tiên số 1 là `FAQ`, `tra cứu dữ liệu`, hay `hỗ trợ quyết định`?

## 2. Nhóm người dùng

- Nhóm nào nên dùng trước: ban điều hành, vận hành bán lẻ, quản lý vùng, cửa hàng, CSKH, marketing, sales, tài chính, HR?
- Mỗi nhóm thường cần hỏi điều gì nhất?
- Dữ liệu nào từng nhóm không được phép nhìn thấy?

## 3. Phạm vi câu hỏi

- Top 20 câu hỏi nội bộ lặp lại nhiều nhất hiện nay là gì?
- Những câu nào liên quan đến tồn kho, giá, CTKM, sản phẩm, logistics, hoặc hướng dẫn dùng hệ thống?
- Chatbot chỉ cần trả lời dữ kiện hay còn phải giải thích nguyên nhân và gợi ý bước tiếp theo?

## 4. Hệ thống và dữ liệu

- Hệ thống nào là source of truth cho tồn kho, sản phẩm, giá, CTKM, trạng thái đơn hàng, và thông tin khách hàng?
- Hôm nay `SAP B1`, `KiotViet`, `Haravan`, và Excel đang lệch nhau ở những điểm nào?
- Những file Excel nào đang rất quan trọng về mặt vận hành dù nằm ngoài hệ thống chính?

## 5. Knowledge base

- SOP, chính sách giá, chính sách CTKM, quy định bảo hành, và tài liệu training hiện đang nằm ở đâu?
- Khi có mâu thuẫn, tài liệu nào được coi là bản cuối cùng đã phê duyệt?
- Chatbot có cần dẫn nguồn tài liệu hoặc rule khi trả lời không?

## 6. Thiết kế câu trả lời

- Câu trả lời nên ngắn gọn trực tiếp hay chi tiết kèm bảng biểu, so sánh?
- Chatbot có cần trả về bảng tải xuống hay chỉ cần trả lời dạng text?
- Nếu dữ liệu chưa chắc chắn, chatbot nên nói `không đủ dữ liệu` hay đưa best-effort answer kèm cảnh báo?

## 7. Hành động sau khi trả lời

- Phase 1 chatbot có nên giữ read-only không?
- Nếu về sau cần action, chatbot được phép làm gì: tạo task, raise issue, đề xuất chuyển kho, gợi ý CTKM, hay khởi tạo luồng phê duyệt?
- Hành động nào bắt buộc phải được quản lý duyệt?

## 8. Bảo mật và audit

- Thông tin nào là nhạy cảm: doanh thu, margin, công nợ, lương, rule CTKM, giá riêng cho đối tác?
- Câu trả lời có cần che dữ liệu theo vai trò không?
- Toàn bộ câu hỏi và câu trả lời có cần được log để audit không?

## 9. Tình huống lỗi và ngoại lệ

- Nếu `SAP B1` và Excel trả ra hai đáp án khác nhau thì phải xử lý thế nào?
- Nếu người dùng hỏi mơ hồ hoặc nhập sai mã hàng thì chatbot nên phản ứng ra sao?
- Nếu chatbot không trả lời được, có cần handoff sang người phụ trách không?

## 10. Tiêu chí thành công của pilot

- Sau 8-12 tuần, điều gì khiến pilot được coi là thành công?
- KPI nào nên cải thiện đầu tiên: thời gian tra cứu, độ chính xác câu trả lời, tỉ lệ dùng, giảm escalations nội bộ, hay tốc độ ra quyết định?
- 5-10 use case nào bắt buộc phải demo được để ban lãnh đạo chấp nhận?
