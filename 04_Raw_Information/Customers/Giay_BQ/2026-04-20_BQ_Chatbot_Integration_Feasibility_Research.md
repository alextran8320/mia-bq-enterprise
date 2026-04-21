---
name: Research — Khả Thi Kỹ Thuật Tích Hợp Chatbot lên Lark & SAP B1
type: project
status: Draft
owner: A05 Tech Lead Agent
recorded_by: Claude Code (claude-sonnet-4-6)
date: 2026-04-20
---

# Research: Tích Hợp Chatbot Internal lên Lark & SAP B1
**Kết luận nhanh:** Cả 2 đều khả thi về mặt kỹ thuật. Đã có nhiều bên làm rồi. Có sự khác biệt quan trọng về cách UX hiển thị giữa 2 platform.

---

## 1. Lark — Tích hợp Chatbot

### Cơ chế kỹ thuật

Lark có **Open Platform** chính thức với đầy đủ Bot API. Flow hoạt động:

```
Nhân viên nhắn tin cho Bot trong Lark
        ↓
Lark gửi event (webhook) đến server MIABOS
        ↓
MIABOS xử lý (AI + query SAP/MS SQL)
        ↓
MIABOS gọi Lark API → trả lời về đúng chat
```

Cụ thể cần làm:
1. Tạo **Custom App** trên Lark Open Platform → bật tính năng Bot
2. Đăng ký **Webhook URL** (server MIABOS nhận event từ Lark)
3. Dùng **App ID + App Secret** để xác thực và gọi Lark Messaging API
4. Bot xuất hiện như 1 **contact/user trong Lark** — nhân viên DM bot như nhắn tin bình thường

### UX thực tế trông như thế nào

- **Không phải floating bubble** kiểu website — mà là 1 conversation chat trong Lark
- Nhân viên mở Lark → thấy Bot như 1 contact → nhắn tin → bot reply ngay trong chat thread
- Có thể add bot vào **group chat** → nhiều người cùng hỏi 1 bot trong 1 group
- UX **rất tự nhiên** với người dùng Lark — không cần học thêm gì

### Đã có bao nhiêu bên làm?

Rất nhiều — đây là pattern phổ biến:
- **Lark × OpenAI** (GitHub: ConnectAI-E/Lark-OpenAI) — GPT-4 + DALL·E + Whisper chạy trên Lark, production-ready, open source
- **lark_bot** (GitHub: Mgrsc/lark_bot) — AI assistant đầy đủ tính năng, container-based, deploy được ngay
- **n8n** có sẵn workflow template gửi message qua Lark Bot
- **Alibaba Cloud** đã làm chatbot alert qua Lark
- Nhiều enterprise đang dùng Lark × GPT cho internal ops

### SDK & Tooling

| Ngôn ngữ | SDK | Ghi chú |
|----------|-----|---------|
| Go | go-lark | Official-style, IM API đầy đủ |
| Python | lark-oapi | Official SDK từ Lark |
| Node.js | @larksuiteoapi/node-sdk | Official SDK |

### Điểm cần lưu ý

- Webhook URL phải **HTTPS công khai** — cần deploy server MIABOS lên Cloud (đúng với yêu cầu của anh Tuấn Anh)
- Rate limit API: cần xử lý queue nếu nhiều người hỏi cùng lúc
- Lark Enterprise version (BQ đang dùng) hỗ trợ đầy đủ Bot API

**Verdict: ✅ Hoàn toàn khả thi. Cơ chế rõ ràng, nhiều bên đã làm production.**

---

## 2. SAP Business One — Tích hợp Chatbot

### Cơ chế kỹ thuật

SAP B1 có **Service Layer REST API (OData v4)** — đây là cổng chính để chatbot đọc/ghi dữ liệu SAP.

```
Chatbot (trên Lark) nhận câu hỏi
        ↓
MIABOS AI xử lý ý định → xác định cần data từ SAP
        ↓
MIABOS gọi SAP B1 Service Layer API
        ↓
SAP trả về data (tồn kho, giá, PO, v.v.)
        ↓
MIABOS format → trả lời nhân viên qua Lark
```

Các endpoint quan trọng đã được confirm khả dụng:
- `GET /Items` — danh mục sản phẩm
- `GET /InventoryGenEntries` / `StockTransfer` — tồn kho
- `GET /PriceLists` — bảng giá
- `GET /PurchaseOrders` — đơn mua hàng
- `GET /BusinessPartners` — đại lý / nhà cung cấp

### Nhúng Chat UI vào SAP B1 — có làm được không?

**SAP B1 Desktop Client (Windows):** Khó — client cũ, không có cơ chế nhúng widget dễ dàng

**SAP B1 Web Client / Fiori (web-based):** Làm được qua:
- **SAP UI5 Side Panel** (`sap.f.SidePanel`) — chat widget nằm cạnh màn hình chính SAP
- **Floating button bottom-right** mở popover chat — đúng kiểu bubble chat
- Cần viết **SAP UI5 Add-on / Extension** để nhúng vào

→ Nếu BQ đang dùng **SAP B1 Web Client**, nhúng bubble chat vào SAP là khả thi.
→ Nếu BQ đang dùng **SAP B1 Desktop**, không nên nhúng vào SAP — tốt hơn là để chatbot chạy trên Lark và SAP là data source.

### Đã có bao nhiêu bên làm?

Khá nhiều, đặc biệt từ 2024–2025:
- **ChatFin.ai** — AI agents kết nối SAP B1 qua native API, production
- **RConsult** — AI Assistant qua Service Layer, 200+ endpoints, hỗ trợ Claude + OpenAI + self-hosted
- **MyWave.ai** — AI Agents for SAP B1
- **SAP chính thức** — Joule (conversational AI) đang rollout cho SAP B1
- **SAP SMB Assistant Bot** — open source trên GitHub (SAP-archive/smb-assistant-bot)
- **CData Connect AI** — ChatGPT ↔ SAP B1 qua MCP server

**Verdict: ✅ Kết nối SAP B1 làm data source = rất khả thi, nhiều bên làm rồi.**
**⚠ Nhúng chat UI vào trong SAP B1 desktop = khó. Khuyến nghị dùng Lark làm điểm tương tác chính.**

---

## 3. Kiến Trúc Khuyến Nghị cho BQ

Dựa trên research, kiến trúc tối ưu:

```
[Nhân viên BQ]
      ↓  nhắn tin qua Lark (chat tự nhiên)
[Lark Bot — điểm tương tác duy nhất]
      ↓  webhook event
[MIABOS AI Server — trên Cloud]
      ├── Query SAP B1 Service Layer (tồn kho, giá, PO)
      ├── Query MS SQL (data BQ nội bộ)
      └── RAG / Knowledge Base (SOP, policy, quy trình)
      ↓  trả lời
[Lark Bot → reply trong chat]
```

**Tại sao không nhúng vào SAP B1?**
- SAP B1 là nơi **xử lý nghiệp vụ** — nhân viên vào để làm việc, không phải để hỏi chuyện
- Lark là nơi **giao tiếp** — nhân viên đã ở đó cả ngày, hỏi bot rất tự nhiên
- Kết nối SAP B1 qua API để lấy data là đủ — không cần nhúng UI vào SAP

---

## 4. Về MS SQL

BQ có thể đang dùng **MS SQL Server** để lưu data nội bộ hoặc là data layer trung gian. Kết nối từ MIABOS vào MS SQL:
- Standard: kết nối qua **ODBC / JDBC** hoặc **pyodbc** (Python)
- Nếu có REST API wrapper trên MS SQL: gọi trực tiếp
- Cần confirm với anh Tuấn Anh: đây là SQL Server nào, có API không hay cần viết connector

---

## 5. Tóm Tắt Độ Khả Thi

| Hạng mục | Khả thi? | Đã có bên làm? | Độ phức tạp |
|----------|----------|----------------|-------------|
| Lark Bot (chat tự nhiên) | ✅ | Rất nhiều | Thấp–Trung bình |
| SAP B1 làm data source (API) | ✅ | Rất nhiều | Trung bình |
| MS SQL connector | ✅ | Standard | Thấp |
| Nhúng bubble chat vào Lark | ✅ (native UX) | Nhiều | Thấp |
| Nhúng bubble chat vào SAP B1 Web | ⚠ Khả thi | Một số | Cao |
| Nhúng vào SAP B1 Desktop | ❌ Không nên | Ít | Rất cao |

---

## 6. Câu Hỏi Cần Confirm Với Anh Tuấn Anh

1. BQ đang dùng **SAP B1 bản Desktop hay Web Client**?
2. **MS SQL** là hệ thống nào — data warehouse riêng hay SQL Server của SAP B1?
3. Lark của BQ là bản **Enterprise** hay Free? (ảnh hưởng đến Bot API quota)
4. Nhân viên muốn hỏi bot theo kiểu **1-1 (DM bot)** hay **trong group chat** của từng phòng ban?
