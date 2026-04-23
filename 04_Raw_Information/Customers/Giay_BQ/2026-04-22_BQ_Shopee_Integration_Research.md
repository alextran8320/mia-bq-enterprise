---
name: Research — Tích Hợp Shopee Open Platform cho Giày BQ
type: project
status: Draft
owner: A05 Tech Lead Agent
recorded_by: Claude Code (claude-sonnet-4-6)
date: 2026-04-22
source_link: https://open.shopee.com/documents/v2/v2.ams.get_open_campaign_added_product?module=127&type=1
---

# Research: Tích Hợp Shopee Open Platform — Giày BQ

---

## 1. Endpoint Anh Cung Cấp — Phân Tích

**Endpoint:** `v2.ams.get_open_campaign_added_product`
**Module:** 127 (AMS — Advertising & Campaign Management System)
**Loại:** GET

Đây là API thuộc nhóm **AMS (Advertising Management System)** của Shopee — dùng để lấy danh sách **sản phẩm đã được thêm vào một Open Campaign** (chiến dịch khuyến mãi công khai trên Shopee).

**Ý nghĩa với BQ:** BQ có thể dùng endpoint này để:
- Biết sản phẩm nào đang tham gia chiến dịch khuyến mãi trên Shopee
- Sync trạng thái campaign về hệ thống nội bộ (SAP B1, chatbot nội bộ)
- Khi nhân viên hỏi bot "Sản phẩm X có đang giảm giá trên Shopee không?" → bot tra API này → trả lời chính xác

---

## 2. Shopee Open Platform — Tổng Quan

**Loại API:** REST API v2.0 (v1.0 đã ngừng từ 26/12/2022)
**Xác thực:** OAuth 2.0 + SHA256 signature

**Thông số xác thực bắt buộc mỗi request:**

| Tham số | Mô tả |
|---------|-------|
| `partner_id` | ID đối tác đăng ký trên Shopee Open Platform |
| `timestamp` | Unix timestamp lúc gọi API |
| `sign` | SHA256(partner_id + api_path + timestamp + access_token + shop_id) |
| `access_token` | Token xác thực — hết hạn sau **4 giờ** |
| `shop_id` | ID shop của BQ trên Shopee |

---

## 3. Các Module API Có Liên Quan Đến BQ

| Module | Chức năng | Use case với BQ |
|--------|-----------|----------------|
| **Product/Item** | Quản lý listing sản phẩm, tồn kho, giá | Sync catalog từ SAP B1 → Shopee |
| **Order** | Lấy và quản lý đơn hàng | Đơn Shopee chảy vào hệ thống BQ |
| **AMS / Campaign** | Quản lý chiến dịch, sản phẩm trong campaign | Chatbot biết SP nào đang giảm giá |
| **Discount** | Voucher, flash sale, giảm giá | Đồng bộ CTKM với Haravan |
| **Logistics** | Vận chuyển, trả hàng, hoàn tiền | Tracking đơn hàng Shopee |
| **Chat** | Tin nhắn người mua - người bán | Tích hợp vào Chatbot bán hàng |
| **Inventory** | Tồn kho real-time | Sync với KiotViet/SAP B1 |
| **Shop** | Thông tin shop, hiệu suất | Dashboard analytics |

---

## 4. Phân Tích Tích Hợp Theo Bài Toán BQ

### 4.1 Chatbot Nội Bộ — Những gì có thể lấy từ Shopee

Khi nhân viên hỏi bot về tình hình trên Shopee, bot có thể tra:

| Câu hỏi nhân viên | API cần gọi | Dữ liệu trả về |
|------------------|-------------|----------------|
| "Mã X đang bán trên Shopee giá bao nhiêu?" | `v2.item.get_item_base_info` | Giá bán, giá gốc, tồn kho Shopee |
| "Sản phẩm X có đang trong flash sale không?" | `v2.ams.get_open_campaign_added_product` | Danh sách SP trong campaign |
| "Đơn Shopee hôm nay có bao nhiêu?" | `v2.order.get_order_list` | Danh sách đơn theo ngày |
| "Shopee còn bao nhiêu tồn kho mã X?" | `v2.product.get_dts_info` | Tồn kho kênh Shopee |

### 4.2 Chatbot Bán Hàng — Tích hợp Chat Shopee

Shopee có **Chat API** (`v2.message`) — bot MIABOS có thể:
- Nhận tin nhắn từ người mua trên Shopee
- Tự động trả lời câu hỏi về sản phẩm, tồn kho, đơn hàng
- Escalate lên nhân viên khi câu hỏi phức tạp

**Lưu ý quan trọng:** Shopee Chat API chỉ cho phép trả lời — không cho phép gửi tin nhắn chủ động đến người mua (chống spam policy).

### 4.3 Sync tồn kho 2 chiều — SAP B1 ↔ Shopee

```
SAP B1 (tồn kho master)
    ↓ MIABOS đọc qua Service Layer
MIABOS tính tồn kho khả dụng cho Shopee
    ↓ gọi v2.product.update_stock
Shopee cập nhật tồn kho listing
```

Ngược lại khi có đơn Shopee:
```
Shopee Order webhook → MIABOS nhận event
    ↓ trừ tồn kho trong hệ thống
Notify nhân viên kho qua Lark
```

---

## 5. Giới Hạn Kỹ Thuật Cần Lưu Ý

| Hạn chế | Chi tiết | Ảnh hưởng đến BQ |
|---------|----------|-----------------|
| **Access token hết hạn 4 giờ** | Phải refresh token liên tục | Cần implement auto-refresh, nếu quên token hết → API fail |
| **Rate limit** | Giới hạn số lượng API call mỗi phút/giờ | Với 200+ cửa hàng sync đồng thời → dễ bị throttle |
| **Pagination** | Dataset lớn (sản phẩm, đơn hàng) phải xử lý nhiều trang | Sync toàn bộ catalog BQ cần xử lý pagination cẩn thận |
| **Breaking changes** | Shopee update API không báo trước | Cần monitor Shopee changelog thường xuyên |
| **Marketing app requirement** | Chỉ **Third-party Partner Platform** hoặc **Registered Business Seller** mới được tạo marketing app | BQ cần đăng ký đúng loại tài khoản developer |
| **AMS module — phạm vi hạn chế** | `get_open_campaign_added_product` chỉ đọc được campaign công khai — không đọc được flash sale private hoặc campaign nội bộ của shop | Cần dùng thêm `v2.discount` module cho CTKM riêng của BQ |

---

## 6. Yêu Cầu Đăng Ký Trên Shopee Open Platform

Để tích hợp đầy đủ (bao gồm AMS / marketing module):

1. **Tạo tài khoản developer** tại [open.shopee.com](https://open.shopee.com)
2. **Đăng ký app type:** Registered Business Seller hoặc Third-party Partner
3. **Xin quyền (scope)** cho từng module cần dùng — AMS module yêu cầu approve riêng
4. **Kết nối shop BQ** → authorize app → lấy access token
5. **Whitelist webhook URL** của MIABOS để nhận event đơn hàng, tồn kho

---

## 7. Đánh Giá Độ Khả Thi Cho BQ

| Hạng mục | Khả thi? | Ghi chú |
|----------|----------|---------|
| Lấy sản phẩm trong campaign (AMS) | ✅ | Đúng endpoint anh cung cấp |
| Sync tồn kho SAP B1 ↔ Shopee | ✅ | Cần xử lý rate limit |
| Tích hợp Chat Shopee vào chatbot bán hàng | ✅ | Chỉ reply, không initiate |
| Đơn Shopee chảy vào hệ thống BQ real-time | ✅ | Qua webhook |
| Chatbot nội bộ tra thông tin Shopee | ✅ | Thêm Shopee như 1 data source |
| Marketing app (AMS đầy đủ) | ⚠ Cần đăng ký đúng loại | Business Seller account |

---

## 8. Next Action

| # | Việc cần làm | Owner |
|---|-------------|-------|
| 1 | Confirm BQ đang dùng Shopee seller account loại gì — cá nhân hay Business? | A01 PM → anh Tuấn Anh |
| 2 | Đăng ký Shopee Open Platform developer account dạng Business Seller | IT BQ |
| 3 | Xin scope cho các module cần dùng: AMS, Product, Order, Chat, Logistics | MIABOS Tech Lead |
| 4 | Design data flow: Shopee → MIABOS → SAP B1/KiotViet | A05 Tech Lead |
| 5 | Xác nhận Shopee có phải kênh bán hàng chính của BQ không — hay chỉ là 1 trong nhiều kênh? | A01 PM → anh Tuấn Anh |

---

## 9. Nguồn Research

- [Shopee Open Platform — Docs gốc (endpoint anh cung cấp)](https://open.shopee.com/documents/v2/v2.ams.get_open_campaign_added_product?module=127&type=1)
- [Shopee API Essential Guide — Rollout](https://rollout.com/integration-guides/shopee/api-essentials)
- [Shopee API Comprehensive Guide — API2Cart](https://api2cart.com/api-technology/shopee-api/)
- [Shopee Open API — Public APIs Directory](https://publicapis.io/shopee-api)
- [Shopee API Documentation: Product & Order — API2Cart](https://api2cart.com/news/shopee-api-documentation/)
- [What is Open Platform (Open API)? — Shopee Seller](https://seller.shopee.ph/edu/article/5588)
- [Shopee Open API Authorisation Expiry](https://seller.shopee.com.my/edu/article/3642)
- [Shopee Affiliate Open API Explorer V2](https://open-api.affiliate.shopee.vn/explorer/v2)
- [GitHub — shopee-sdk (congminh1254)](https://github.com/congminh1254/shopee-sdk)
- [GitHub — python-shopee SDK](https://github.com/JimCurryWang/python-shopee)
- [GitHub — shopee-api-client PHP](https://github.com/raviMukti/shopee-api-client)
