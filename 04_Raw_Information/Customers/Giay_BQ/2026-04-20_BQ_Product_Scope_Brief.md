---
name: BQ Product Scope Brief — Chatbot Nội Bộ & Chatbot Bán Hàng
type: project
status: Draft
owner: A01 PM Agent
recorded_by: Claude Code (claude-sonnet-4-6)
date: 2026-04-20
source: Tổng hợp từ MOM buổi gặp thứ 2 (anh Tuấn Anh) + trao đổi với phòng CNTT BQ
---

# BQ Product Scope Brief
**Ngày:** 2026-04-20

---

## 1. Chatbot Nội Bộ

**Mục tiêu:** Nhân viên BQ hỏi — bot trả lời ngay trên Lark hoặc SAP, không cần lên thêm hệ thống nào.

### Yêu cầu

**Platform & Tích hợp**
- Build trên **Lark** — end user tương tác 100% qua Lark hoặc SAP
- Kết nối **MS SQL** (hệ thống BQ đang dùng) để truy xuất dữ liệu vận hành
- Tích hợp với **SAP B1** — tra tồn kho, giá, thông tin sản phẩm
- Hạ tầng: Cloud trước → migrate Server BQ sau

**Tính năng cốt lõi**
- Tra cứu **hàng tồn kho** theo mã, kho, chi nhánh — đây là use case ưu tiên số 1
- Tra cứu giá, CTKM, thông tin sản phẩm
- Hỏi đáp các **luồng vận hành nội bộ** đang chạy trên Lark (SOP, quy trình, policy)
- Phân quyền dữ liệu theo role — ai thấy gì, đến đâu

**AI & Xử lý**
- AI xử lý hình ảnh, bài viết, content nội bộ
- Hỏi bằng tiếng Việt tự nhiên — bot hiểu và truy xuất đúng nguồn

**Vận hành & Con người**
- Phải có giải pháp cho **sai sót người dùng** — BQ sẽ vận hành không hoàn hảo
- Audit log: ai hỏi gì, lấy dữ liệu từ đâu
- Cơ chế phân quyền rõ ràng theo phòng ban

### Next Action

| # | Việc cần làm | Owner |
|---|-------------|-------|
| 1 | Xác nhận MS SQL là SQL Server nào của BQ — cần anh Tuấn Anh cung cấp thông tin | A01 PM → anh Tuấn Anh |
| 2 | Map toàn bộ workflow BQ đang chạy trên Lark — cần 1 buổi discovery ngắn với CNTT | A01 PM + A03 BA |
| 3 | Thiết kế kiến trúc Lark Bot + MS SQL + SAP integration | A05 Tech Lead |
| 4 | Thiết kế giải pháp phân quyền & human error handling | A03 BA |
| 5 | Soạn báo giá gói Chatbot Nội Bộ | A02 PO + A04 Strategy |
| 6 | Chuẩn bị tài liệu kiến trúc hạ tầng Cloud → migration plan | A05 Tech Lead |

---

## 2. Chatbot Bán Hàng

**Mục tiêu:** Khách nhắn tin qua Facebook → bot hiểu nhu cầu, tư vấn đúng sản phẩm, chốt đơn. Không cần nhân viên xử lý từng tin nhắn.

### Yêu cầu

**Kênh**
- Tích hợp **Facebook Messenger** — kênh ưu tiên
- Mở rộng sang Zalo, Website nếu phù hợp

**Tính năng cốt lõi**
- **Xử lý hình ảnh:** khách gửi ảnh sản phẩm → bot nhận diện → tư vấn mã phù hợp
- **Hiểu yêu cầu tự nhiên:** "Tôi muốn mua quần, áo, giày…" → bot tra catalog → gợi ý + chốt
- Tra cứu **tồn kho real-time** trước khi tư vấn — không tư vấn hàng hết hàng
- Tra cứu **giá + CTKM** đang áp dụng
- Hỗ trợ đổi trả, tra đơn hàng

**AI & Xử lý**
- Computer vision: nhận diện sản phẩm từ ảnh khách gửi
- NLP hiểu ý định mua hàng từ tiếng Việt tự nhiên
- Kết nối dữ liệu sản phẩm từ SAP B1 + KiotViet + Haravan

**Ưu tiên:** Làm xong Chatbot Nội Bộ trước, mới focus vào hạng mục này.

### Next Action

| # | Việc cần làm | Owner |
|---|-------------|-------|
| 1 | Xác nhận kênh ưu tiên: chỉ Facebook hay thêm Zalo/Web? | A01 PM → anh Tuấn Anh |
| 2 | Blueprint xử lý hình ảnh: nhận diện từ ảnh khách gửi hay từ catalog BQ? | A05 Tech Lead |
| 3 | Xác nhận nguồn dữ liệu sản phẩm: SAP B1 + KiotViet + Haravan đều cần? | A03 BA → confirm với CNTT BQ |
| 4 | Soạn báo giá gói Chatbot Bán Hàng | A02 PO + A04 Strategy |

---

## Thứ tự triển khai

```
[Phase 1] Chatbot Nội Bộ (Lark + MS SQL + SAP)
        ↓ xong, ổn định
[Phase 2] Chatbot Bán Hàng (Facebook + image AI + catalog)
        ↓ song song nếu đủ nguồn lực (Q3–Q4/2026)
[Phase 3+] CRM, Marketing Automation — tính toán lại sau
```
