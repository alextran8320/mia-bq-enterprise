---
name: RISK-001 — Rủi Ro Tích Hợp MIABOS Chatbot Internal lên Lark (Giày BQ)
type: analysis
status: Draft
owner: A01 PM Agent
contributors: A05 Tech Lead, A04 Business Strategy, A02 Product Owner
recorded_by: Claude Code (claude-sonnet-4-6)
date: 2026-04-20
project: Giày BQ
related_research: 04_Raw_Information/Customers/Giay_BQ/2026-04-20_BQ_Lark_WebApp_Integration_Research.md
---

# RISK-001 — Đánh Giá Rủi Ro: MIABOS Chatbot Internal trên Lark
**Phạm vi:** Gắn MIABOS Chatbot Web App vào Lark của Giày BQ — tích hợp SAP B1, MS SQL, phân quyền nội bộ
**Ngày đánh giá:** 2026-04-20
**Đánh giá bởi:** A05 Tech Lead · A04 Business Strategy · A02 Product Owner

---

## A. GÓC NHÌN KỸ THUẬT — A05 Tech Lead

### 🔴 Rủi ro cao

**RISK-T01 — H5 Web App performance phụ thuộc network**

Lark Web App chạy trong WebView — không phải native app. Toàn bộ giao diện MIABOS render qua H5 bên trong Lark client. Hệ quả:
- Lag rõ hơn so với chạy trực tiếp trên browser, đặc biệt animation và data render
- Chi nhánh tỉnh lẻ, wifi cửa hàng yếu → chatbot phản hồi chậm → nhân viên bỏ dùng
- Lark Mobile WebView có nhiều hạn chế hơn Desktop

*Giảm thiểu:* Tối ưu frontend aggressive — lazy load, skeleton UI, cache response. Đặt SLA: response < 3 giây trên 4G bình thường. Cung cấp fallback URL web riêng khi Lark chậm.

---

**RISK-T02 — Phụ thuộc Lark API — ngoài tầm kiểm soát**

Nếu Lark thay đổi API, deprecate endpoint, hoặc downtime:
- Chatbot ngừng hoạt động hoàn toàn
- MIABOS không thể tự fix — phải chờ Lark update hoặc tự adapt
- Lark có tiền sử downtime ảnh hưởng toàn bộ enterprise tenant

*Giảm thiểu:* Thiết kế fallback — khi Lark unavailable, nhân viên vẫn truy cập MIABOS qua web URL riêng. Không để Lark là single point of failure.

---

**RISK-T03 — Lark SSO Token expiry giữa chừng**

OAuth access token TTL ngắn (~2 giờ). Nếu xử lý không đúng:
- Nhân viên đang chat giữa chừng → token hết hạn → bị đẩy ra login lại
- Race condition khi nhiều tab/device cùng refresh token đồng thời

*Giảm thiểu:* Implement silent token refresh ở background. Test kỹ edge case multi-device và long session.

---

### 🟡 Rủi ro trung bình

**RISK-T04 — MS SQL connectivity chưa rõ topology**

Anh Tuấn Anh đề cập MS SQL nhưng chưa confirm hệ thống nào, vị trí, ai quản lý:
- SQL Server nằm trong mạng nội bộ BQ, không có public endpoint → MIABOS Cloud không connect được trực tiếp
- Firewall IT BQ chặn kết nối từ ngoài vào SQL Server
- Schema thay đổi phía BQ mà không thông báo → query của MIABOS bị vỡ

*Giảm thiểu:* Discovery kỹ thuật với IT BQ trước khi thiết kế. Xem xét VPN tunnel hoặc Data Connector agent chạy trong mạng BQ để bridge ra Cloud.

---

**RISK-T05 — SAP B1 credentials và data availability**

- SAP B1 Service Layer cần credentials đủ quyền đọc — IT BQ phải cấp và quản lý
- IT BQ revoke hoặc đổi credentials không báo → chatbot trả lời sai hoặc crash
- SAP B1 maintenance, upgrade phiên bản → Service Layer endpoint thay đổi

*Giảm thiểu:* Circuit breaker — khi SAP unavailable, bot báo rõ "Dữ liệu tạm thời không truy cập" thay vì trả lời sai. Alert monitoring tự động khi connection fail.

---

**RISK-T06 — RBAC sai → data leak nội bộ**

BQ có nhiều role với quyền data khác nhau. Nếu implement phân quyền sai:
- Nhân viên cửa hàng A tra được tồn kho cửa hàng B
- Nhân viên thường thấy giá cost — thông tin nhạy cảm

*Giảm thiểu:* RBAC thiết kế và test nghiêm túc trước khi deploy. Cần IT BQ cung cấp role matrix đầy đủ ngay từ đầu. Không ship tính năng nào khi chưa có access control rõ.

---

**RISK-T07 — Con người vận hành — đã được anh Tuấn Anh nhắc trực tiếp**

Nhân viên sẽ hỏi sai, hỏi ngoài scope, hoặc hiểu lầm câu trả lời:
- Bot trả lời thiếu context → nhân viên ra quyết định sai (tưởng còn hàng nhưng thực tế đã reserved)
- Nhân viên tin bot 100% mà không verify source

*Giảm thiểu:* Source citation bắt buộc trên mọi câu trả lời có data. Thêm disclaimer với data nhạy cảm. Bot phải biết từ chối khi không chắc thay vì đoán.

---

### 🟢 Rủi ro thấp

**RISK-T08 — Lark Enterprise plan quota**

Nếu BQ đang dùng bản Lark Free hoặc bản cũ → Bot API quota thấp, Web App feature có thể bị giới hạn.

*Giảm thiểu:* Confirm Lark plan với IT BQ trước khi thiết kế.

---

**RISK-T09 — Vendor lock-in vào Lark**

Nếu BQ rời Lark trong tương lai, toàn bộ integration phải làm lại.

*Giảm thiểu:* Thiết kế MIABOS backend độc lập với Lark từ đầu — Lark chỉ là 1 channel. Sau này thêm Teams, Slack, Web standalone đều được mà không refactor core.

---

## B. GÓC NHÌN KINH DOANH — A04 Business Strategy

### 🔴 Rủi ro cao

**RISK-B01 — Adoption thấp nếu chatbot không chính xác ngay từ đầu**

BQ là tổ chức vận hành thực tiễn — nhân viên không có thời gian thử nghiệm. Nếu chatbot trả lời sai tồn kho hoặc giá ngay trong tuần đầu deploy:
- Nhân viên mất tin tưởng ngay lập tức → quay lại cách cũ (mở SAP thủ công)
- Rất khó lấy lại trust sau khi đã mất — đặc biệt với nhân viên cửa hàng vốn skeptical với công nghệ mới
- Anh Tuấn Anh sẽ khó bảo vệ dự án trước BGĐ nếu có sự cố trong giai đoạn đầu

*Giảm thiểu:* Pilot với nhóm nhỏ (5–10 nhân viên nội bộ IT/content BQ) trước khi rollout diện rộng. Chỉ mở tính năng khi đã test đủ độ chính xác. Đặt accuracy threshold rõ ràng trước khi go-live.

---

**RISK-B02 — Dự án CNTT nội bộ BQ chạy song song — nguy cơ overlap và xung đột**

Phòng CNTT BQ đang chạy riêng 1 dự án nhỏ. Nếu không coordinate rõ:
- Hai hệ thống xử lý cùng bài toán → nhân viên confused → không biết dùng cái nào
- Dữ liệu bị duplicate hoặc conflict giữa 2 hệ thống
- Anh Tuấn Anh mắc kẹt giữa 2 team

*Giảm thiểu:* Cần buổi alignment với cả MIABOS và IT BQ để phân chia scope rõ ràng trước khi bắt đầu build. MIABOS phải biết dự án CNTT kia làm gì để không đụng.

---

**RISK-B03 — Dependency vào anh Tuấn Anh — single point of approval**

Anh Tuấn Anh là decision maker thực sự (~60% BGĐ theo sau). Nếu anh Tuấn Anh bận, đổi ưu tiên, hoặc rời công ty:
- Dự án mất người champion nội bộ
- BGĐ không có đủ context để tự quyết định tiếp

*Giảm thiểu:* Trong quá trình triển khai, cần xây dựng thêm ít nhất 1 stakeholder champion khác trong BQ (có thể là IT Lead hoặc Operations Head). Document lại mọi quyết định để không phụ thuộc vào 1 người.

---

### 🟡 Rủi ro trung bình

**RISK-B04 — Kỳ vọng quá cao từ ban đầu — "làm là phải làm chỉnh chu"**

Anh Tuấn Anh đặt tiêu chuẩn cao. Nếu phase 1 deliver không đủ chất lượng:
- Mất cơ hội mở rộng sang Chatbot bán hàng, CRM, Marketing
- BQ có thể chuyển sang vendor khác

*Giảm thiểu:* Đặt expectations rõ ràng về scope của từng phase. Chỉ demo những gì đã build xong và chạy đúng — không demo concept chưa có thật.

---

**RISK-B05 — Timeline Q3–Q4 2026 — áp lực chạy song song**

BQ muốn chạy AI rất mạnh từ Q3/2026. Nếu MIABOS không kịp:
- BQ có thể chọn giải pháp nhanh hơn từ vendor khác (off-the-shelf chatbot)
- MIABOS mất window cơ hội

*Giảm thiểu:* Ưu tiên deliver Internal Chatbot trong Q2/2026 để BQ có đủ thời gian test trước khi vào Q3. Không scope creep — Internal Chatbot trước, bán hàng sau.

---

**RISK-B06 — Giá — chưa có báo giá, chưa có benchmark**

Anh Tuấn Anh yêu cầu 2 gói báo giá riêng (nội bộ + bán hàng) nhưng MIABOS chưa đưa ra con số. BQ có thể đang compare với các vendor khác trong khi chờ.

*Giảm thiểu:* Ưu tiên chuẩn bị báo giá sớm — ngay sau khi có scope rõ. Đừng để khoảng trống giá kéo dài.

---

### 🟢 Rủi ro thấp

**RISK-B07 — CRM 360 phòng CNTT làm — nguy cơ scope creep về sau**

Hiện tại CRM 360 là dự án riêng của CNTT BQ. Nhưng khi phase 3–4 MIABOS muốn làm CRM, sẽ có câu hỏi về sự trùng lắp.

*Giảm thiểu:* Document rõ ràng ngay từ bây giờ: MIABOS không đụng vào CRM trong phase 1–2. Re-evaluate phase 3 khi đến lúc.

---

## C. GÓC NHÌN SẢN PHẨM — A02 Product Owner

### 🔴 Rủi ro cao

**RISK-P01 — Không có data sạch ngay từ đầu → AI trả lời sai**

Chatbot chất lượng phụ thuộc hoàn toàn vào chất lượng data từ SAP B1, MS SQL, KiotViet. Nếu data BQ đang dirty (duplicate SKU, tồn kho lệch giữa SAP và thực tế, giá không đồng bộ):
- AI sẽ trả lời dựa trên data sai → nhân viên sai → trust mất
- Không phải lỗi AI — là lỗi data

*Giảm thiểu:* Data readiness assessment phải là bước đầu tiên trước khi build bất cứ thứ gì. Cần IT BQ confirm tình trạng data trước khi ký kết scope.

---

**RISK-P02 — Knowledge Base nội bộ BQ không được chuẩn bị**

Để chatbot trả lời được các câu hỏi về quy trình, SOP, policy — BQ phải có tài liệu nội bộ đã được viết ra và có thể import vào Knowledge Base. Thực tế nhiều công ty SME:
- Tri thức nằm trong đầu người — chưa được document
- Tài liệu có nhưng lỗi thời, không ai maintain
- Không có người phụ trách Knowledge Base sau khi MIABOS setup xong

*Giảm thiểu:* Đưa vào scope yêu cầu BQ chuẩn bị bộ tài liệu cơ bản (SOP tồn kho, chính sách giá, quy trình đổi trả) trước khi go-live. Nếu không có → chatbot chỉ trả lời được data từ SAP, không trả lời được câu hỏi nghiệp vụ.

---

### 🟡 Rủi ro trung bình

**RISK-P03 — Scope creep từ phía BQ trong quá trình build**

Khi nhân viên thấy chatbot hoạt động, sẽ phát sinh thêm yêu cầu:
- "Bot có thể tự tạo đơn hàng không?"
- "Bot có thể gửi báo cáo tự động không?"
- "Thêm tính năng A, B, C..."

Nếu không kiểm soát → delay, cost overrun, chất lượng giảm.

*Giảm thiểu:* Định nghĩa rõ MVP scope của phase 1 bằng văn bản, có anh Tuấn Anh ký duyệt. Mọi yêu cầu thêm đưa vào backlog phase sau.

---

**RISK-P04 — UX không phù hợp với nhân viên cửa hàng**

Giao diện hiện tại được thiết kế theo hướng professional/desktop. Nhân viên cửa hàng BQ:
- Dùng điện thoại nhiều hơn desktop
- Không quen chat với AI — cần guided prompt hoặc quick action button
- Tiếng Việt có dấu nhưng bàn phím điện thoại hay sai

*Giảm thiểu:* Cần user research nhỏ với 2–3 nhân viên cửa hàng thực tế trước khi finalize UX. Ưu tiên mobile-first cho màn hình chat.

---

**RISK-P05 — Không có owner rõ ràng phía BQ sau khi deploy**

Sau khi MIABOS deliver, ai ở BQ sẽ:
- Maintain Knowledge Base (update khi chính sách thay đổi)?
- Báo cáo khi bot trả lời sai?
- Approve user mới?

Nếu không có người sở hữu → hệ thống dần lỗi thời và bỏ không dùng.

*Giảm thiểu:* Yêu cầu BQ chỉ định Product Owner nội bộ trước khi go-live. Đưa vào hợp đồng điều khoản về responsibility sau triển khai.

---

### 🟢 Rủi ro thấp

**RISK-P06 — Data retention và quyền sở hữu conversation history**

Toàn bộ lịch sử chat nhân viên lưu trong MIABOS Cloud. Chưa có thỏa thuận rõ về:
- Ai sở hữu data?
- Lưu bao lâu?
- Xử lý thế nào khi nhân viên nghỉ việc?

*Giảm thiểu:* Đưa vào hợp đồng trước khi ký kết. Đơn giản nhưng cần làm sớm.

---

## D. TỔNG HỢP MA TRẬN RỦI RO

| ID | Rủi ro | Góc nhìn | Mức độ | Có thể giảm? |
|----|--------|----------|--------|-------------|
| RISK-T01 | H5 performance trên network yếu | Tech | 🔴 Cao | ✅ |
| RISK-T02 | Phụ thuộc Lark API downtime | Tech | 🔴 Cao | ✅ |
| RISK-T03 | Token expiry giữa chừng | Tech | 🔴 Cao | ✅ |
| RISK-B01 | Adoption thấp nếu sai ngay từ đầu | Business | 🔴 Cao | ✅ |
| RISK-B02 | Overlap với dự án CNTT nội bộ BQ | Business | 🔴 Cao | ✅ |
| RISK-B03 | Phụ thuộc 1 người — anh Tuấn Anh | Business | 🔴 Cao | ✅ |
| RISK-P01 | Data BQ dirty → AI trả lời sai | Product | 🔴 Cao | ✅ |
| RISK-P02 | Knowledge Base BQ chưa được chuẩn bị | Product | 🔴 Cao | ✅ |
| RISK-T04 | MS SQL topology chưa rõ | Tech | 🟡 Trung bình | ✅ |
| RISK-T05 | SAP B1 credentials & availability | Tech | 🟡 Trung bình | ✅ |
| RISK-T06 | RBAC sai → data leak nội bộ | Tech | 🟡 Trung bình | ✅ |
| RISK-T07 | Con người vận hành sai | Tech | 🟡 Trung bình | ✅ |
| RISK-B04 | Kỳ vọng cao — "làm phải chỉnh chu" | Business | 🟡 Trung bình | ✅ |
| RISK-B05 | Timeline Q3–Q4 quá gấp | Business | 🟡 Trung bình | ✅ |
| RISK-B06 | Chưa có báo giá — BQ đang compare | Business | 🟡 Trung bình | ✅ |
| RISK-P03 | Scope creep trong quá trình build | Product | 🟡 Trung bình | ✅ |
| RISK-P04 | UX không phù hợp nhân viên cửa hàng | Product | 🟡 Trung bình | ✅ |
| RISK-P05 | Không có owner BQ sau deploy | Product | 🟡 Trung bình | ✅ |
| RISK-T08 | Lark plan quota thấp | Tech | 🟢 Thấp | ✅ |
| RISK-T09 | Vendor lock-in vào Lark | Tech | 🟢 Thấp | ✅ |
| RISK-B07 | CRM scope overlap về sau | Business | 🟢 Thấp | ✅ |
| RISK-P06 | Data retention & ownership | Product | 🟢 Thấp | ✅ |

---

## E. TOP 5 CẦN GIẢI QUYẾT TRƯỚC KHI BẮT ĐẦU BUILD

| # | Việc cần làm ngay | Giải quyết rủi ro |
|---|------------------|------------------|
| 1 | Discovery kỹ thuật với IT BQ — confirm MS SQL topology, SAP B1 credentials scope, Lark plan | RISK-T04, T05, T08 |
| 2 | Data readiness assessment — tình trạng data SAP B1 / KiotViet / MS SQL hiện tại | RISK-P01 |
| 3 | Alignment session MIABOS × IT BQ — phân chia scope, tránh overlap dự án CNTT | RISK-B02 |
| 4 | BQ chuẩn bị bộ tài liệu Knowledge Base cơ bản (SOP, policy, quy trình) | RISK-P02 |
| 5 | Định nghĩa MVP scope phase 1 bằng văn bản — anh Tuấn Anh ký duyệt | RISK-P03, B04 |
