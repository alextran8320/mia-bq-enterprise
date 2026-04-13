# Bức Tranh Hệ Thống Và Tích Hợp Của BQ

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

Tài liệu này chụp lại bức tranh nghiệp vụ cấp cao của các hệ thống được nhắc đến trong case BQ và giải thích cách nên nhìn chúng khi thiết kế chatbot nội bộ.

## 1. SAP Business One

### Các domain nghiệp vụ lớn

- Administration
- Financials
- Sales opportunities
- Sales and A/R
- Purchasing and A/P
- Business partners
- Banking
- Inventory
- Resources
- Production
- MRP
- Service
- Human resources
- Reports

### Diễn giải cho thiết kế chatbot

Với mô hình bán lẻ kiểu BQ, `SAP B1` nhiều khả năng là nguồn lõi cho:

- item master
- warehouse master
- mua hàng
- kế toán tồn kho
- A/R và A/P
- tài chính và kiểm soát
- giá cơ sở và báo cáo cấu trúc

## 2. KiotViet

### Các domain nghiệp vụ lớn

- POS / retail sales
- product and barcode management
- store-level inventory
- purchasing / receiving / returns
- customer management
- supplier management
- debt / receivable-payable handling
- cash in/out
- branch / chain management
- retail reporting

### Diễn giải cho thiết kế chatbot

Với mô hình BQ, `KiotViet` nhiều khả năng phù hợp cho:

- giao dịch tại cửa hàng
- tra cứu tồn theo chi nhánh
- các câu hỏi liên quan POS
- báo cáo bán lẻ tại điểm bán

## 3. Haravan

### Các domain nghiệp vụ lớn

- website/storefront
- omnichannel commerce
- social commerce
- marketplace integration
- order management
- inventory sync
- shipping and COD
- customer 360 / loyalty
- omnichannel inbox
- marketing and analytics

### Diễn giải cho thiết kế chatbot

Với mô hình BQ, `Haravan` nhiều khả năng phù hợp cho:

- ecommerce và đơn hàng online
- tương tác khách hàng đa kênh
- CTKM online và campaign
- trạng thái đơn hàng và dữ liệu khách hàng trên các kênh online

## 4. Excel

### Vai trò thường gặp

- ad-hoc reports
- policy tables
- manual promotion logic
- temporary master-data mapping
- workaround reports outside formal systems

### Diễn giải cho thiết kế chatbot

Excel nên được coi là `nguồn tạm thời` hoặc `nguồn hỗ trợ`, không nên mặc định là source of truth.

## 5. Lark

### Tín hiệu chiến lược đã được nhắc tới

Business Owner có nhắc rõ `Data Lark`.

### Vai trò có khả năng phù hợp trong solution

- kênh truy cập người dùng
- workflow và phê duyệt
- form
- điều phối task cộng tác
- lớp data/control-plane nhẹ

## 6. Gợi ý source-of-truth cho Phase 1

### Vai trò chính có khả năng cao

- `SAP B1`: ERP / tồn kho / mua hàng / tài chính / dữ liệu cấu trúc về sản phẩm và đối tác
- `KiotViet`: vận hành cửa hàng/POS
- `Haravan`: ecommerce, omnichannel, và ngữ cảnh đơn hàng hướng khách hàng
- `Excel`: policy phụ trợ và ngoại lệ làm tay
- `Lark`: lớp workflow và cộng tác

## 7. Nguyên tắc tích hợp cho chatbot nội bộ

### Đọc trước, hành động sau

Phase 1 nên ưu tiên read-only ở mức tối đa:

- trả lời câu hỏi
- hiển thị nguồn dữ liệu
- giảm mơ hồ
- tránh thay đổi workflow ngay ở bản đầu

### Bắt buộc phải có business-rule layer

Chatbot không nên đọc từng hệ thống riêng lẻ rồi trả lời trực tiếp mà thiếu lớp mapping nghiệp vụ.

Kiến trúc cần có:

- quy tắc ưu tiên source-of-truth
- mapping master data
- quy tắc phân quyền
- audit logging
- glossary cho các khái niệm như `tồn khả dụng`, `tồn bán được`, `giá đang áp CTKM`, và `khuyến mãi cửa hàng chính hãng`

## 8. Những câu hỏi chatbot nên trả lời trước

- Tồn kho hiện tại của mã X theo kho / cửa hàng / kênh là bao nhiêu?
- Chính sách giá đang hiệu lực cho mã X là gì?
- Hiện có CTKM nào, áp cho những kênh nào?
- Thông tin sản phẩm của mã X là gì?
- Với một loại câu hỏi cụ thể, người dùng nên kiểm tra hệ thống nào?
- Người dùng thao tác nghiệp vụ Y trong `SAP B1`, `KiotViet`, hoặc `Haravan` như thế nào?
