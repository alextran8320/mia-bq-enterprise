---
name: Research — Tích Hợp MIABOS Chatbot Web App lên Lark
type: project
status: Draft
owner: A05 Tech Lead Agent
recorded_by: Claude Code (claude-sonnet-4-6)
date: 2026-04-20
---

# Research: Gắn MIABOS Chatbot Internal Web App lên Lark
**Câu hỏi cần trả lời:** Có thể nhúng một web application (giao diện chatbot MIABOS đã build) vào bên trong Lark không? Nhân viên login bằng tài khoản MIABOS, sau đó hỏi đáp trên giao diện đó ngay trong Lark?

**Kết luận:** ✅ Hoàn toàn khả thi — Lark hỗ trợ chính thức qua cơ chế **Web App (H5 App)**.

---

## 1. Cơ Chế Lark Hỗ Trợ

Lark Open Platform cung cấp 4 loại app có thể build và gắn vào Lark client:

| Loại | Mô tả | Phù hợp với BQ? |
|------|-------|----------------|
| **Web App (H5 App)** | Web application chạy bên trong Lark client — đầy đủ UI, không mở browser ngoài | ✅ Đây là loại cần dùng |
| **Gadget** | Widget thông tin nhỏ hiển thị trên Workplace, chỉ xem, không tương tác nhiều | ❌ Không đủ cho chatbot |
| **Mini Program** | App nhẹ dùng DSL riêng của Lark, phức tạp hơn | ⚠ Không cần thiết |
| **Bot** | Chatbot dạng DM trong Lark chat | ✅ Bổ sung được nếu cần |

→ **Loại cần dùng: Web App (H5 App)** — web application MIABOS (React) chạy như một H5 app bên trong Lark client.

📎 Nguồn: [Lark — App Types: Web App, Gadget, Mini Program](https://open.larksuite.com/document/home/app-types-introduction/robots-web-applications-and-mini-programs)
📎 Nguồn: [Lark — App Types Overview](https://open.larksuite.com/document/home/app-types-introduction/overview)

---

## 2. Giao Diện Trông Như Thế Nào

```
Nhân viên BQ mở Lark (desktop hoặc mobile)
  → vào Workbench (thanh app phía trái Lark)
  → click vào "MIABOS Chatbot"
  → Web app MIABOS mở NGAY TRONG Lark client
     (không redirect ra browser ngoài)
  → Toàn bộ giao diện chatbot hiện ra:
     - Ô nhập câu hỏi
     - Kết quả trả lời + data cards
     - Panel nguồn trích dẫn bên phải
     - Lịch sử conversation
```

Giao diện MIABOS đã build (React app như trong screenshot) render đầy đủ trong Lark — desktop lẫn mobile. Lark Web App hỗ trợ truy cập qua:
- Workbench (app panel trong Lark) — điểm truy cập chính
- Lark client search — tìm tên app là ra
- Message link — chia sẻ link app trong chat

📎 Nguồn: [Lark Open Platform Overview](https://open.larksuite.com/document/uQjL04CN/ucDOz4yN4MjL3gzM)

---

## 3. Authentication — Nhân Viên Login Như Thế Nào

### Lựa chọn 1: Lark SSO (OAuth 2.0) — Khuyến nghị

Nhân viên mở app trong Lark → **tự động login, không cần nhập gì thêm**.

Flow kỹ thuật:
```
1. Nhân viên click mở MIABOS app trong Lark
2. Lark redirect đến: https://passport.larksuite.com/suite/passport/oauth/authorize
   (kèm client_id, redirect_uri, state)
3. Lark trả về authorization_code về MIABOS backend
4. MIABOS đổi code → lấy access_token
5. MIABOS gọi API lấy thông tin user (tên, email, phòng ban, role trong BQ)
6. MIABOS tự động tạo/map tài khoản → login → vào chatbot luôn
```

Ưu điểm: nhân viên không cần nhớ thêm password — dùng tài khoản Lark BQ là xong.

📎 Nguồn: [Lark — Web App SSO / OAuth 2.0 Flow](https://open.larksuite.com/document/common-capabilities/sso/web-application-sso/web-app-overview)
📎 Nguồn: [Lark — Open SSO Login Page Protocol](https://open.larksuite.com/document/common-capabilities/applink-protocol/supported-protocol/open-the-sso-login-page)
📎 Nguồn: [Lark — Configure SSO for Apps](https://www.larksuite.com/hc/en-US/articles/969072468797-configure-sso-for-apps-lark-sso)

### Lựa chọn 2: MIABOS Auth Riêng

Nhân viên mở app → thấy login page MIABOS → nhập tài khoản MIABOS. Đây là cách anh mô tả ban đầu — hoàn toàn làm được, chỉ cần thêm 1 bước login.

📎 Nguồn: [Lark OAuth — Casdoor IAM](https://casdoor.org/docs/provider/oauth/lark/)

---

## 4. Loại App Cần Tạo: Enterprise Self-Built App

Đây chính xác là loại BQ cần:

- **Chỉ hoạt động trong tenant Lark của BQ** — nhân viên ngoài tổ chức không truy cập được
- **Không cần Lark team review** — IT của BQ duyệt là deploy và dùng được
- Deploy lên workbench nội bộ, nhân viên BQ thấy app ngay trong Lark
- Quản lý qua Lark Admin — bật/tắt, phân quyền theo phòng ban

📎 Nguồn: [Lark — App Types Overview (Self-Built vs App Store)](https://open.larksuite.com/document/home/app-types-introduction/overview)
📎 Nguồn: [Lark — Access Tokens & Tenant Auth](https://open.larksuite.com/document/ukTMukTMukTM/ukDNz4SO0MjL5QzM/g)
📎 Nguồn: [Lark — Tenant Access Token Internal](https://open.larksuite.com/document/ukTMukTMukTM/ukDNz4SO0MjL5QzM/auth-v3/auth/tenant_access_token_internal)

---

## 5. Tính Năng Anh Yêu Cầu — Độ Khả Thi

### Lưu trữ toàn bộ conversation ✅

Mỗi message event Lark gửi về MIABOS kèm `user_id`, `message_id`, `timestamp`, nội dung. MIABOS tự lưu vào database riêng. Lark cũng có API để pull lại lịch sử nếu cần sync.

📎 Nguồn: [Lark — Get Chat History API](https://open.larksuite.com/document/uAjLw4CM/ukTMukTMukTM/reference/im-v1/message/list)
📎 Nguồn: [Lark — Chat History & Storage FAQs](https://www.larksuite.com/hc/en-US/articles/405125586206-chat-history-and-storage-faqs)

### Tách nhiều conversation (multi-session) ✅ có giới hạn

Lark Web App là web application đầy đủ — MIABOS có thể tự implement UI tách conversation y như ChatGPT (sidebar danh sách, tạo conversation mới, quay lại conversation cũ). Đây là logic phía MIABOS, không phụ thuộc vào Lark.

Cách lưu session: dùng Redis hoặc database, mỗi conversation có `session_id` riêng gắn với `user_id`.

📎 Nguồn: [GitHub — lark_bot với Redis session memory](https://github.com/Mgrsc/lark_bot)
📎 Nguồn: [LangGraph + Redis — AI agent memory & persistence](https://redis.io/blog/langgraph-redis-build-smarter-ai-agents-with-memory-persistence/)
📎 Nguồn: [Redis — LLM Session Memory](https://redis.io/docs/latest/develop/ai/redisvl/user_guide/session_manager/)

### Trích xuất nguồn tương ứng từng câu trả lời ✅

Kiến trúc RAG chuẩn — mỗi câu trả lời kèm source document, tên hệ thống, timestamp cập nhật. Đây là tính năng đã implement sẵn trong giao diện anh build (nút "Xem nguồn", panel bên phải).

```
Ví dụ output:
"Mã BQ-2301 size 40 còn 8 đôi tại kho HN (Cầu Giấy)
 📌 Nguồn: SAP B1 — Inventory, cập nhật 09:15 hôm nay"

"Quy trình đổi hàng áp dụng trong 30 ngày
 📌 Nguồn: Chính sách Đổi Trả v2.1 — trang 3"
```

📎 Nguồn: [RAG Citations và Source Traceability](https://app.ailog.fr/en/blog/guides/citation-sourcing-rag)
📎 Nguồn: [FINOS AI Governance — Source Traceability](https://air-governance-framework.finos.org/mitigations/mi-13_providing-citations-and-source-traceability-for-ai-generated-information.html)

### Chỉ dùng nội bộ BQ ✅

Tenant-locked qua `tenant_access_token_internal`. Có thể cấu hình allowlist theo user_id hoặc phòng ban.

📎 Nguồn: [Lark — Integrating Enterprise SSO](https://open.larksuite.com/solutions/detail/sso)

---

## 6. Hạn Chế Cần Lưu Ý

| Hạn chế | Mức độ | Giải pháp |
|---------|--------|-----------|
| H5 Web App chậm hơn native app, phụ thuộc network | Thấp | Optimize frontend, cache response |
| Cần IT BQ tạo Custom App trên Lark Open Platform | Thấp | 1 lần setup, không phức tạp |
| Lark Mobile có thể render khác Desktop | Thấp | Test responsive trên cả 2 |

---

## 7. Các Bên Đã Làm Production

- **Lark × OpenAI** — GPT-4 + DALL·E + Whisper chạy trên Lark, open source: [GitHub — ConnectAI-E/Lark-OpenAI](https://github.com/ConnectAI-E/Lark-OpenAI)
- **lark_bot** — AI assistant đầy đủ, container-based: [GitHub — Mgrsc/lark_bot](https://github.com/Mgrsc/lark_bot)
- **Hermes Agent** — deploy AI xuyên Lark + Telegram + WeCom: [OpenClaw — Hermes Agent](https://openclawapi.org/en/blog/2026-04-01-hermes-agent-full-platform-deploy)
- **n8n** — workflow template Lark Bot: [n8n — Send message via Lark Bot](https://n8n.io/workflows/2478-send-a-message-via-a-lark-bot/)
- **DialogFlow × Lark** — hướng dẫn chi tiết: [Medium — Building a Lark Bot with DialogFlow](https://medium.com/@thegeorgeyli/building-a-lark-bot-with-dialogflow-es-32f75a775e12)

---

## 8. Tóm Tắt Độ Khả Thi

| Yêu cầu | Khả thi? | Ghi chú |
|---------|----------|---------|
| Gắn web app chatbot MIABOS vào Lark | ✅ | Lark Web App (H5) — hỗ trợ chính thức |
| Login bằng tài khoản MIABOS | ✅ | MIABOS auth riêng hoặc Lark SSO OAuth 2.0 |
| Giao diện như screenshot đã build | ✅ | React app render đầy đủ trong Lark client |
| Lưu toàn bộ conversation | ✅ | MIABOS tự lưu DB + Lark Message API |
| Tách nhiều conversation | ✅ | MIABOS implement sidebar, Redis session |
| Trích xuất nguồn từng câu trả lời | ✅ | RAG chuẩn, đã có trong giao diện |
| Chỉ dùng nội bộ BQ | ✅ | Enterprise Self-Built App, tenant-locked |
| IT BQ approve là dùng được | ✅ | Không cần Lark team review |

---

## 9. Next Action Kỹ Thuật

| # | Việc cần làm | Owner |
|---|-------------|-------|
| 1 | IT BQ tạo Custom App trên Lark Open Platform (open.larksuite.com/app) | IT BQ + MIABOS Tech Lead |
| 2 | Đăng ký redirect URI của MIABOS vào Lark App config | MIABOS Tech Lead |
| 3 | Implement Lark SSO OAuth 2.0 trong MIABOS backend | MIABOS Backend |
| 4 | Deploy MIABOS Web App lên Cloud với HTTPS | MIABOS DevOps |
| 5 | Bật tính năng Web App trong Lark App, deploy lên BQ Workbench | IT BQ |
| 6 | Test trên Lark Desktop + Mobile | MIABOS QA |

---

## 10. Tổng Hợp Nguồn Research

### Lark Official Documentation
- [Lark Open Platform — Trang chủ developer](https://open.larksuite.com/)
- [App Types Overview](https://open.larksuite.com/document/home/app-types-introduction/overview)
- [Web App, Gadget, Mini Program](https://open.larksuite.com/document/home/app-types-introduction/robots-web-applications-and-mini-programs)
- [Open Platform Overview](https://open.larksuite.com/document/uQjL04CN/ucDOz4yN4MjL3gzM)
- [Web App SSO Overview](https://open.larksuite.com/document/common-capabilities/sso/web-application-sso/web-app-overview)
- [Open SSO Login Page](https://open.larksuite.com/document/common-capabilities/applink-protocol/supported-protocol/open-the-sso-login-page)
- [Configure SSO for Apps](https://www.larksuite.com/hc/en-US/articles/969072468797-configure-sso-for-apps-lark-sso)
- [Access Tokens & Authorization](https://open.larksuite.com/document/ukTMukTMukTM/ukDNz4SO0MjL5QzM/g)
- [Tenant Access Token Internal](https://open.larksuite.com/document/ukTMukTMukTM/ukDNz4SO0MjL5QzM/auth-v3/auth/tenant_access_token_internal)
- [Bot Overview](https://open.larksuite.com/document/client-docs/bot-v3/bot-overview)
- [Custom Bot Usage Guide](https://open.larksuite.com/document/ukTMukTMukTM/ucTM5YjL3ETO24yNxkjN)
- [Interactive Message Cards](https://open.larksuite.com/document/ukTMukTMukTM/uAzMxEjLwMTMx4CMzETM)
- [Get Chat History API](https://open.larksuite.com/document/uAjLw4CM/ukTMukTMukTM/reference/im-v1/message/list)
- [Receive Message Event](https://open.larksuite.com/document/uAjLw4CM/ukTMukTMukTM/reference/im-v1/message/events/receive)
- [Enterprise SSO Integration](https://open.larksuite.com/solutions/detail/sso)
- [Embed Web Portal into Workplace](https://www.larksuite.com/hc/en-US/articles/663258873590-embed-a-web-portal-into-a-workplace)
- [Chat History & Storage FAQs](https://www.larksuite.com/hc/en-US/articles/405125586206-chat-history-and-storage-faqs)
- [Gadget Development with uni-app](https://open.larkoffice.com/document/tools-and-resources/development-tools/develop-gadget-with-uni-app)

### GitHub — SDK & Production Examples
- [ConnectAI-E/Lark-OpenAI — GPT-4 trên Lark](https://github.com/ConnectAI-E/Lark-OpenAI)
- [Mgrsc/lark_bot — AI assistant production-ready](https://github.com/Mgrsc/lark_bot)
- [go-lark/lark — Go SDK](https://github.com/go-lark/lark)
- [larksuite/node-sdk — Node.js SDK](https://github.com/larksuite/node-sdk)
- [larksuite/lark-openapi-mcp — Official MCP](https://github.com/larksuite/lark-openapi-mcp)
- [larksuite/cli — Official CLI tool](https://github.com/larksuite/cli)
- [SAP-archive/smb-assistant-bot — SAP B1 bot](https://github.com/SAP-archive/smb-assistant-bot)

### SAP B1 Integration
- [ChatFin — AI Agents for SAP B1](https://chatfin.ai/sap-business-one-ai-agents/)
- [RConsult — SAP B1 AI Assistant via Service Layer](https://rconsult.biz/en/ai-assistant/)
- [MyWave.ai — AI Agents for SAP B1](https://www.mywave.ai/sap-business-one)
- [SAP Conversational AI — Connect với SAP B1](https://community.sap.com/t5/technology-blog-posts-by-members/connecting-sap-conversational-ai-with-sap-business-one/ba-p/13529378)
- [SAP Community — Custom Chatbot Widget in SAPUI5](https://community.sap.com/t5/technology-blog-posts-by-members/custom-chatbot-widget-in-sapui5-using-expression-binding/ba-p/13867135)
- [CData — ChatGPT ↔ SAP B1 via MCP](https://www.cdata.com/kb/tech/sapbusinessone-cloud-chatgpt.rst)
- [SAP B1 AI Features 2025](https://akshay.com/sap-b1-ai-features/)

### RAG & Source Citation
- [RAG Citations và Source Traceability — Ailog](https://app.ailog.fr/en/blog/guides/citation-sourcing-rag)
- [FINOS — AI Source Traceability Framework](https://air-governance-framework.finos.org/mitigations/mi-13_providing-citations-and-source-traceability-for-ai-generated-information.html)
- [AWS — What is RAG](https://aws.amazon.com/what-is/retrieval-augmented-generation/)

### Session Memory & Redis
- [Redis — LLM Session Memory](https://redis.io/docs/latest/develop/ai/redisvl/user_guide/session_manager/)
- [LangGraph + Redis — AI agent memory](https://redis.io/blog/langgraph-redis-build-smarter-ai-agents-with-memory-persistence/)
- [Feishu/Lark — OpenClaw setup](https://docs.openclaw.ai/channels/feishu)
- [Hermes Agent — Multi-platform AI deploy](https://openclawapi.org/en/blog/2026-04-01-hermes-agent-full-platform-deploy)

### Authentication
- [Lark OAuth — Casdoor IAM](https://casdoor.org/docs/provider/oauth/lark/)
- [Lark — Okta SSO Integration](https://www.okta.com/integrations/lark/)
- [n8n — Send message via Lark Bot](https://n8n.io/workflows/2478-send-a-message-via-a-lark-bot/)
