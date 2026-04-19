# Bản Đồ Stakeholder Của BQ

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

## Mục đích

Tài liệu này mapping các phòng ban và chức năng có khả năng sẽ tham gia vào roadmap giải pháp AI của BQ, dựa trên footprint public và suy luận từ mô hình vận hành.

## 1. Các phòng ban/chức năng lõi nhiều khả năng tồn tại

| Phòng ban / Chức năng | Mức tin cậy | Vì sao nhiều khả năng tồn tại | Mức ưu tiên trong roadmap AI |
|-----------------------|------------|----------------------|-------------------------|
| Ban điều hành / vận hành trung tâm | Cao | Mạng lưới retail và đại lý toàn quốc đòi hỏi điều phối tập trung | Rất quan trọng |
| Vận hành bán lẻ / quản lý cửa hàng | Cao | Hệ thống cửa hàng và cửa hàng chính hãng thể hiện rõ vận hành retail trực tiếp | Rất quan trọng |
| Phát triển đại lý / nhượng quyền / kênh | Cao | Trang hợp tác kinh doanh public cho thấy rõ mô hình phát triển đối tác | Cao |
| Chăm sóc khách hàng | Cao | Có hotline CSKH, hỗ trợ online, góp ý, khiếu nại, đơn hàng | Rất quan trọng |
| Ecommerce / omnichannel | Cao | Có website commerce, app, tra cứu đơn hàng online, footprint đa kênh | Cao |
| Marketing / trade marketing | Cao | Có CTKM, campaign, hỗ trợ xúc tiến bán hàng cho đối tác, bộ sưu tập theo mùa | Cao |
| CRM / loyalty | Cao | Có chính sách khách hàng thân thiết hiệu lực từ 2026-01-01 | Cao |
| Logistics / kho / fulfillment | Cao | Luồng giao hàng, đổi trả, bảo hành đều hàm ý ownership logistics | Rất quan trọng |
| Bảo hành / dịch vụ / xưởng | Cao | Chính sách bảo hành trọn đời có nhắc xử lý tại chỗ và chuyển xưởng | Cao |
| IT / hệ thống / ERP / data | Trung bình-Cao | Bắt buộc phải tồn tại nếu nhìn vào stack hệ thống được nhắc đến | Rất quan trọng |
| Tài chính / kế toán / pricing control | Trung bình-Cao | Suy ra từ ERP, chính sách giá, và nhu cầu kiểm soát kênh | Cao |
| HR / đào tạo / truyền thông nội bộ | Trung bình | Có tín hiệu tuyển dụng và mô hình đào tạo cho cửa hàng/đại lý | Trung bình |

## 2. Mức độ tham gia theo từng phase giải pháp

| Chức năng | Phase 1 Chatbot nội bộ | Phase 2 CRM + External Chatbot | Phase 3 Marketing AI + Automation | Phase 4 Forecasting |
|----------|--------------------------|--------------------------------|-----------------------------------|---------------------|
| Ban điều hành | Sponsor | Sponsor | Sponsor | Sponsor |
| IT / ERP / data | Core owner | Core owner | Core owner | Core owner |
| Vận hành bán lẻ | Core user | Cao | Trung bình | Cao |
| CSKH | Core user | Core user | Trung bình | Thấp |
| Logistics / kho | Core user | Trung bình | Thấp | Cao |
| Tài chính / pricing control | Core user | Trung bình | Cao | Cao |
| Marketing / CRM | Trung bình | Core owner | Core owner | Trung bình |
| Ecommerce / omnichannel | Trung bình | Core owner | Cao | Trung bình |
| Đại lý / nhượng quyền | Trung bình | Cao | Trung bình | Trung bình |
| Bảo hành / dịch vụ | Trung bình | Cao | Thấp | Thấp |
| HR | Thấp | Thấp | Core owner cho HR automation | Thấp |

## 3. Stakeholder quan trọng nhất cho Phase 1

Workshop đầu tiên gần như chắc chắn nên có:

- executive sponsor
- owner của ERP / hệ thống
- owner vận hành bán lẻ
- owner CSKH
- owner logistics / kho
- owner tài chính / chính sách giá
- owner marketing hoặc CRM để xác nhận policy

## 4. Hàm ý khi đưa vào proposal

Proposal nên mô tả BQ không phải như một case chatbot cho một phòng ban đơn lẻ, mà là một cơ hội triển khai `MIABOS Core AI CRM Platform` theo phase: bắt đầu từ AI Internal Chatbot cho nhóm nội bộ/content, sau đó mở rộng sang AI External Chatbot cho Social + Ecommerce, AI Automation cho các khối vận hành, và Forecasting khi Data Warehouse của BQ đủ sẵn sàng.

Điều này quan trọng vì:

- source data nằm ở các hệ thống BQ đang sở hữu và Data Warehouse BQ dự kiến, không nằm trong MIABOS ngoại trừ `Conversation` và `Knowledge`
- policy ownership nằm ở nhiều phòng ban
- chatbot chỉ được tin nếu câu trả lời nhất quán giữa nhiều chức năng và đúng boundary dữ liệu BQ
