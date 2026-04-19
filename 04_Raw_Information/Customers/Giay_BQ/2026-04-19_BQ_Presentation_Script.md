# Script Thuyết Trình MIABOS × Giày BQ
# Core AI CRM Platform — Lộ trình chuyển đổi AI theo từng phase

**Status**: Draft
**Owner**: A01 PM Agent
**Last Updated By**: Claude Code (claude-sonnet-4-6)
**Last Reviewed By**: -
**Approval Required**: Business Owner
**Approved By**: -
**Last Status Change**: 2026-04-19
**Source of Truth**: This file

---

## SLIDE 1 — COVER

**[Hiển thị]**
> MIABOS × Giày BQ
> Core AI CRM Platform — Lộ trình chuyển đổi AI theo từng phase

**[Script nói]**
"Hôm nay chúng tôi muốn chia sẻ với BQ một góc nhìn cụ thể: không phải chỉ là một chatbot, mà là một lộ trình chuyển đổi AI có cấu trúc rõ ràng — từ việc hỗ trợ nội bộ hôm nay, đến việc tự động hóa toàn bộ hành trình khách hàng trong tương lai gần."

---

## SLIDE 2 — BQ LÀ AI & BỨC TRANH VẬN HÀNH

**[Hiển thị]**
- 20+ năm thương hiệu
- 200+ cửa hàng & đại lý · 43 tỉnh/thành · 2M+ khách hàng
- Mô hình 4 lớp:

```
Nhà cung cấp  →  BQ điều phối thương hiệu & kênh  →  Cửa hàng / Đại lý  →  Người tiêu dùng
```

**[Script nói]**
"BQ là một trong những thương hiệu giày dép nội địa có độ phủ lớn nhất Việt Nam. Điều đặc biệt là mô hình của BQ không đơn giản — BQ vừa là thương hiệu, vừa điều phối kênh phân phối, vừa vận hành chuỗi bán lẻ trực tiếp lẫn hệ thống đại lý toàn quốc. Đây là nền tảng kinh doanh rất vững, nhưng cũng đặt ra những thách thức vận hành ở quy mô lớn."

---

## SLIDE 3A — BÀI TOÁN 1: INTERNAL CHATBOT — DỮ LIỆU RỜI RẠC NỘI BỘ

**[Hiển thị]**

**Vấn đề:** Tri thức vận hành đang nằm rải rác ở 3 hệ thống — không ai hỏi được nhanh

```
Nhân viên muốn biết:          Phải vào:
─────────────────────         ──────────────────────────
Mã X còn bao nhiêu?      →    SAP B1 (tồn tổng) + KiotViet (tồn chi nhánh)
CTKM nào đang chạy?      →    Haravan + file Excel chính sách
Giá hiện tại của mã Y?   →    SAP B1 giá gốc + Haravan giá bán online
Quy trình đổi hàng?      →    Hỏi người có kinh nghiệm
```

**Hệ quả:**
- Nhân viên mới mất **15–30 phút/câu hỏi** phải kiểm tra thủ công qua nhiều hệ thống
- Tri thức vận hành phụ thuộc vào **con người cụ thể** — khi họ nghỉ, kiến thức đi theo
- Tồn kho ảo *(phantom inventory)* lên tới **7–12%** tổng hàng hóa do dữ liệu không đồng bộ giữa SAP B1 và KiotViet
- Sai lệch dự báo nội bộ **10–16%** do gaps dữ liệu POS và nhập thủ công

**[Script nói]**
"Bài toán đầu tiên là câu chuyện tri thức nội bộ. BQ đang vận hành trên 3 hệ thống chính — SAP B1, KiotViet, Haravan — mỗi hệ thống giữ một phần dữ liệu khác nhau. Khi một nhân viên cần trả lời một câu hỏi đơn giản như 'mã này còn hàng không', họ phải mở ít nhất 2 hệ thống, đối chiếu thủ công, rồi mới có câu trả lời.

Điều này không chỉ tốn thời gian — nó còn tạo ra rủi ro sai lệch. Nghiên cứu trên các chuỗi bán lẻ tương tự cho thấy tỉ lệ phantom inventory — hàng có trong hệ thống nhưng thực tế không khớp — có thể lên tới 7–12% khi dữ liệu không được đồng bộ. Và tri thức vận hành quan trọng vẫn đang nằm trong đầu của một số nhân sự nhất định — đây là rủi ro lớn khi công ty phát triển quy mô."

---

## SLIDE 3B — BÀI TOÁN 2: EXTERNAL CHATBOT — QUÁ TẢI MÙA CAO ĐIỂM

**[Hiển thị]**

**Vấn đề:** Khách hàng nhắn tin quá nhiều — nhân viên không kịp xử lý, không có thông tin để trả lời nhanh

```
Mùa cao điểm của BQ:
  Tết · Back-to-school · 11.11 · 12.12 · Sale mùa hè

→ Tin nhắn từ Facebook, Zalo, Website tăng 3–5 lần
→ Mỗi câu hỏi: nhân viên phải check KiotViet + Haravan trước khi trả lời
→ Thời gian phản hồi trung bình: 6+ giờ/tin nhắn trong mùa cao điểm
```

**Hệ quả:**
- Khách chờ quá lâu → bỏ sang đối thủ → **mất đơn hàng trực tiếp**
- Doanh nghiệp bán lẻ mất trung bình **$2.4M/năm** do tốc độ phản hồi chậm *(Freshworks 2025)*
- **60% khách hàng** tại Đông Nam Á ngừng mua hàng từ thương hiệu phản hồi chậm
- Nhân viên CSKH kiệt sức vào đúng thời điểm doanh thu cao nhất trong năm

**[Script nói]**
"Bài toán thứ hai xảy ra vào đúng thời điểm BQ cần tốt nhất — mùa cao điểm. Khi Tết đến, khi 11.11, khi back-to-school, lượng tin nhắn từ khách qua Facebook, Zalo, Website tăng gấp 3 đến 5 lần so với ngày thường.

Nhưng để trả lời một câu hỏi như 'size 39 màu đen còn hàng không', nhân viên vẫn phải mở KiotViet kiểm tra tồn, mở Haravan xem giá đang áp, rồi mới gõ câu trả lời. Trong lúc đó, hàng chục tin nhắn khác đang chờ. Nghiên cứu ngành cho thấy thời gian phản hồi trung bình của doanh nghiệp bán lẻ là hơn 6 tiếng — và khách hàng ngày nay không chờ lâu như vậy nữa. 60% khách hàng Đông Nam Á sẽ chuyển sang đối thủ nếu không được phản hồi đủ nhanh."

---

## SLIDE 3C — BÀI TOÁN 3: AI AUTOMATION — TÁC VỤ LẶP LẠI CHIẾM NHÂN LỰC

**[Hiển thị]**

**Vấn đề:** Nhiều bộ phận đang dùng con người để làm việc mà máy có thể làm tốt hơn

| Bộ phận | Tác vụ đang làm thủ công | Thời gian tiêu tốn |
|---------|--------------------------|-------------------|
| **HR** | Lọc CV, soạn JD, onboarding docs, hợp đồng | 10–15 giờ/tuần/recruiter |
| **Sales** | Báo cáo doanh số, tổng hợp số liệu cuối ngày | 1–2 giờ/ngày/người |
| **CSKH** | Trả lời câu hỏi lặp lại, cập nhật trạng thái đơn | Chiếm 40–60% workload |
| **Marketing** | Soạn nội dung post social, báo cáo campaign | 3–5 giờ/chiến dịch |

**Hệ quả:**
- AI screening CV giúp **giảm 60% thời gian tuyển dụng** — đặc biệt quan trọng khi BQ mở rộng thêm cửa hàng
- HR automation mang lại **ROI 3–5 lần** trong vòng 12 tháng đầu
- Nhân sự giỏi đang dùng phần lớn thời gian cho việc lặp lại thay vì công việc tạo ra giá trị

**[Script nói]**
"Bài toán thứ ba là câu chuyện nhân lực đang bị dùng sai chỗ. Với 200+ cửa hàng và đại lý, BQ thường xuyên tuyển dụng — mỗi recruiter mất 10 đến 15 tiếng mỗi tuần chỉ để đọc CV và soạn thảo tài liệu onboarding. Sales mất 1–2 tiếng mỗi ngày để tổng hợp báo cáo thủ công. CSKH trả đi trả lại cùng những câu hỏi giống nhau từ khách hàng.

Đây không phải lỗi của con người — đây là thiếu công cụ. Các nghiên cứu ngành cho thấy AI automation trong HR có thể giảm 60% thời gian tuyển dụng và mang lại ROI gấp 3–5 lần trong năm đầu. Nhân sự giỏi của BQ nên dùng thời gian cho việc ra quyết định, không phải nhập liệu."

---

## SLIDE 3D — BÀI TOÁN 4: CRM — DỮ LIỆU KHÁCH HÀNG CHƯA VỀ 1 NƠI

**[Hiển thị]**

**Vấn đề:** BQ có 2M+ khách hàng nhưng dữ liệu đang nằm rải rác — không ai nhìn được bức tranh đầy đủ

```
Khách hàng A:
  ├── Mua offline tại cửa hàng Hà Nội  →  KiotViet
  ├── Đặt online qua website            →  Haravan
  ├── Hỏi qua Zalo OA                  →  Zalo inbox riêng
  ├── Nhắn tin Facebook                 →  Facebook inbox riêng
  └── Điểm loyalty                      →  Haravan loyalty

→ 5 nguồn dữ liệu · Không ai nhìn được đầy đủ 1 khách hàng
→ Marketing, Sales, CSKH mỗi bộ phận thấy 1 mảnh khác nhau
```

**Hệ quả:**
- Không thể biết: khách này đã mua gì, thích gì, đang ở giai đoạn nào trong hành trình
- Marketing lên campaign không dựa trên hành vi thực — **thiếu recommendation đúng segment**
- **82% doanh nghiệp** mất trên $100K/năm do dữ liệu khách hàng không chính xác hoặc không đồng bộ
- Doanh nghiệp triển khai CRM thống nhất ghi nhận **tăng 29% doanh số** và **tăng 20–30% retention**
- Thời gian xây dựng một campaign marketing giảm **50%** khi dữ liệu đã được tập trung

**[Script nói]**
"Bài toán thứ tư — và đây là bài toán trung tâm mà MIABOS được xây dựng để giải — là câu chuyện dữ liệu khách hàng.

BQ có hơn 2 triệu khách hàng. Nhưng hỏi bất kỳ ai trong công ty: khách hàng A đã mua gì, tương tác với BQ qua kênh nào, điểm loyalty đang ở đâu, lần cuối cùng họ phản hồi marketing là khi nào — sẽ không ai có câu trả lời đầy đủ. Vì mỗi kênh đang giữ một mảnh dữ liệu riêng.

Hệ quả rất thực tế: Marketing không biết segment nào cần kích hoạt, CSKH không biết lịch sử của khách đang nói chuyện, Sales không biết khách nào có khả năng mua lại cao nhất. Nghiên cứu ngành cho thấy 82% doanh nghiệp mất hơn 100 ngàn đô mỗi năm chỉ từ dữ liệu khách hàng không đồng bộ. Và khi dữ liệu được tập trung, doanh số tăng trung bình 29%, retention tăng 20–30%."

---

## SLIDE 3E — BÀI TOÁN 5: FORECASTING — VẬN HÀNH THEO CẢM TÍNH

**[Hiển thị]**

**Vấn đề:** Nhập hàng, phân bổ tồn kho, và lập kế hoạch vận hành đang dựa vào kinh nghiệm thay vì dữ liệu

```
Thách thức đặc thù của BQ:
  • 200+ cửa hàng · mỗi cửa hàng có nhu cầu SKU khác nhau
  • Sản phẩm theo mùa (hè/đông/back-to-school/Tết)
  • Size + màu = hàng trăm biến thể mỗi mã
  • Dữ liệu bán hàng lịch sử nằm rải rác ở SAP + KiotViet + Haravan

→ Không có hệ thống nào tổng hợp được đủ dữ liệu để dự báo chính xác
```

**Hệ quả:**
- **73% tình trạng hết hàng** tại các chuỗi bán lẻ xuất phát từ dự báo sai *(nguồn: IHL Group)*
- Dự báo chính xác giúp **giảm 65% lost sales** và **giảm 20% tồn kho dư thừa**
- Sai lệch dự báo của chuỗi bán lẻ Việt Nam: **10–16%** so với chuẩn 6–10% tại Singapore
- Nhập thiếu vào mùa cao điểm = mất doanh thu không lấy lại được. Nhập thừa = vốn bị treo

**[Script nói]**
"Bài toán cuối cùng là forecasting — dự báo vận hành. Với 200+ cửa hàng, mỗi cửa hàng bán hàng trăm mã khác nhau, mỗi mã có nhiều size và màu — bài toán phân bổ hàng đúng, đúng lúc, đúng chỗ là cực kỳ phức tạp.

Hiện tại, quyết định nhập hàng và phân bổ tồn kho phần lớn dựa vào kinh nghiệm của người có thâm niên. Dữ liệu lịch sử bán hàng tuy có — nhưng nằm rải rác ở SAP, KiotViet, Haravan, không ai tổng hợp được đủ nhanh để ra quyết định kịp thời.

Hệ quả là vào đúng mùa cao điểm — khi Tết đến, khi back-to-school — hoặc là thiếu hàng để bán, hoặc là tồn kho chất đống ở kho trung tâm trong khi cửa hàng đang cần. Nghiên cứu ngành cho thấy 73% tình trạng hết hàng đến từ dự báo sai, và dự báo chính xác có thể giảm lost sales đến 65%."

---

## SLIDE 4 — KIẾN TRÚC HỆ THỐNG HIỆN TẠI CỦA BQ

**[Hiển thị]**
```
┌──────────┬─────────────────────────────────────────────────────────┐
│ SAP B1   │ ERP lõi: item master, tồn kho, mua hàng, kế toán,      │
│          │ tài chính, giá cơ sở, báo cáo cấu trúc                 │
├──────────┼─────────────────────────────────────────────────────────┤
│ KiotViet │ POS: vận hành cửa hàng, tồn kho chi nhánh,             │
│          │ giao dịch tại điểm bán, báo cáo bán lẻ                 │
├──────────┼─────────────────────────────────────────────────────────┤
│ Haravan  │ Ecommerce, đơn hàng online, omnichannel,                │
│          │ social commerce, loyalty, marketing campaign            │
├──────────┼─────────────────────────────────────────────────────────┤
│ Excel    │ Policy phụ trợ, workaround thủ công                     │
└──────────┴─────────────────────────────────────────────────────────┘

⚠  Vấn đề nền: 4 hệ thống hoạt động độc lập → dữ liệu không hội tụ
               → cùng 1 câu hỏi có thể cho ra nhiều đáp án khác nhau
```

**[Script nói]**
"Nhìn vào kiến trúc hệ thống hiện tại, BQ đang vận hành trên 4 nguồn dữ liệu chính. SAP B1 là ERP lõi — giữ item master, tồn kho tổng, tài chính. KiotViet xử lý vận hành tại điểm bán. Haravan phụ trách ecommerce và omnichannel. Excel lấp vào những chỗ 3 hệ thống kia chưa xử lý được.

Mỗi hệ thống đều làm tốt vai trò của nó. Nhưng khi cần một cái nhìn tổng hợp — ví dụ Marketing muốn biết khách nào đã mua offline nhưng chưa mua online, hoặc CTKM nào đang hiệu quả trên kênh nào — thì không có hệ thống nào trả lời được ngay. Đó là khoảng trống mà MIABOS sẽ lấp vào."

---

## SLIDE 5 — PHÒNG BAN THAM GIA THEO TỪNG PHASE

**[Hiển thị]**

| Phòng ban | Hệ thống đang dùng | Phase tham gia |
|-----------|-------------------|----------------|
| Ban điều hành | Báo cáo tổng hợp | Sponsor toàn bộ |
| IT / ERP | SAP B1, KiotViet, Haravan | Core owner — Phase 1 trở đi |
| Vận hành bán lẻ / Store Lead | KiotViet, SAP B1 | Phase 1, 2 |
| CSKH | Haravan, Zalo, hotline | Phase 1, 2 |
| Marketing / CRM | Haravan, Excel | Phase 2, 3 |
| Kế toán / Tài chính | SAP B1, Excel | Phase 1, 4 |
| HR | Excel, email | Phase 4 |

**[Script nói]**
"MIABOS không chỉ phục vụ một phòng ban. Mỗi phase sẽ có nhóm người dùng cốt lõi khác nhau. Phase 1 tập trung vào đội vận hành nội bộ — những người cần thông tin nhanh từ SAP, KiotViet, Haravan hàng ngày. Phase 2 mở rộng sang CSKH và Sales. Phase 3 là Marketing. Phase 4 là Automation cho toàn bộ.

Một điểm quan trọng: IT và ERP owner sẽ là đối tác kỹ thuật xuyên suốt từ đầu — vì MIABOS cần được cấp quyền đọc dữ liệu từ các hệ thống BQ đang quản lý."

---

## SLIDE 6 — MIABOS LÀ GÌ

**[Hiển thị]**
> **MIABOS = Core AI CRM Platform**
> Tích hợp thẳng SAP B1 · KiotViet · Haravan
> Bổ sung lớp AI, Knowledge, Conversation, Automation trên nền dữ liệu BQ
> BQ giữ toàn quyền sở hữu và kiểm soát source data

**3 vai trò cốt lõi:**
```
① AI Knowledge & Internal Chat  →  Hỏi đáp nội bộ có source trace
② AI Sales & CRM                →  External Chatbot + Customer 360
③ AI Marketing & Automation     →  Campaign intelligence + Workflow tự động
```

**[Script nói]**
"MIABOS được định vị là Core AI CRM Platform — không thay thế SAP, KiotViet hay Haravan. MIABOS tích hợp vào 3 hệ thống đó, đọc dữ liệu được BQ cấp phép, và bổ sung thêm lớp AI ở trên.

Cụ thể, MIABOS đảm nhận 3 vai trò mà các hệ thống hiện tại không làm: hỏi đáp thông minh có nguồn dữ liệu rõ ràng, tập trung toàn bộ hành trình khách hàng về một nơi, và hỗ trợ Marketing ra quyết định dựa trên dữ liệu thực tế thay vì kinh nghiệm."

---

## SLIDE 7 — KIẾN TRÚC KỸ THUẬT MIABOS: AGENTIC AI

**[Hiển thị]**

```
┌─────────────────────────────────────────────────────────────┐
│                     AGENTIC AI CORE                         │
│                                                             │
│   ┌─────────────┐   ┌──────────────┐   ┌────────────────┐  │
│   │  LLM Pool   │   │  RAG Engine  │   │  Agent Planner │  │
│   │             │   │              │   │                │  │
│   │ • GPT-4o    │   │ • Labeling   │   │ Phân tích ý    │  │
│   │ • Claude    │◄──│ • Data Link  │◄──│ định → chọn   │  │
│   │ • Gemini    │   │ • Retrieval  │   │ đúng agent +   │  │
│   │ • ...       │   │   Pipeline   │   │ đúng nguồn     │  │
│   └─────────────┘   └──────────────┘   └────────────────┘  │
└─────────────────────────────────────────────────────────────┘
         ↑                                         ↑
  Trả lời tốt nhất                     Routing thông minh
  theo từng loại câu hỏi               theo ngữ cảnh & domain

         ↓ tích hợp read layer
[SAP B1]   [KiotViet]   [Haravan]   [Knowledge Base BQ]
```

**Nguyên lý hoạt động:**
| Lớp | Vai trò |
|-----|---------|
| **Agentic AI** | Không chỉ trả lời — còn lập kế hoạch, phân rã câu hỏi phức tạp, gọi đúng tool đúng lúc |
| **RAG + Labeling** | Dữ liệu từ SAP/KiotViet/Haravan được gán nhãn nghiệp vụ, link liên kết ngữ nghĩa — AI tìm đúng context thay vì tìm từ khóa |
| **Data Linking** | Mã sản phẩm ở SAP được link với tồn kho KiotViet và đơn hàng Haravan — một câu hỏi kéo được dữ liệu xuyên hệ thống |
| **Multi-LLM** | Câu hỏi về số liệu tài chính → LLM giỏi reasoning. Câu hỏi tư vấn sản phẩm → LLM giỏi ngôn ngữ tự nhiên. Tự động chọn model phù hợp nhất |

**[Script nói]**
"Đây là điểm khác biệt cốt lõi về mặt kỹ thuật của MIABOS — kiến trúc Agentic AI.

Hầu hết chatbot trên thị trường hiện nay hoạt động theo mô hình đơn giản: người dùng hỏi, hệ thống tìm trong knowledge base, trả lời. Mô hình này đủ dùng cho FAQ tĩnh, nhưng không đủ cho bài toán của BQ — nơi một câu hỏi có thể cần kéo dữ liệu từ 3 hệ thống khác nhau, so sánh, và đưa ra recommendation.

MIABOS dùng kiến trúc Agentic AI — Agent không chỉ trả lời mà còn lập kế hoạch. Khi nhận một câu hỏi phức tạp, Agent phân tích ý định, chia nhỏ thành các bước, gọi đúng tool đúng thứ tự, rồi tổng hợp câu trả lời cuối cùng.

Lớp RAG kết hợp Labeling và Data Linking đảm bảo dữ liệu từ SAP, KiotViet, Haravan không chỉ được lưu mà còn được gán nhãn nghiệp vụ và link với nhau theo ngữ nghĩa. Ví dụ: mã SKU X ở SAP được link với tồn kho chi nhánh từ KiotViet và lịch sử đơn hàng từ Haravan — khi hỏi về SKU X, AI kéo được toàn bộ bức tranh xuyên hệ thống.

Và chúng tôi không dùng một LLM duy nhất — MIABOS sử dụng pool nhiều LLM kết hợp. Câu hỏi về phân tích số liệu tài chính được routing sang LLM giỏi reasoning. Câu hỏi tư vấn sản phẩm tự nhiên sang LLM giỏi ngôn ngữ. Điều này cho phép MIABOS trả lời tốt nhất ở từng loại bài toán thay vì phải compromise với một model duy nhất."

---

## SLIDE 7B — TÍCH HỢP SAP B1 × MIABOS

**[Hiển thị]**

**SAP Business One — ERP lõi · Tích hợp qua Service Layer REST API (OData v4)**

---

**Inventory Management:** Danh mục SKU chuẩn · Tồn kho theo từng kho (OnHand / Committed / OnOrder) · Lệnh chuyển kho · Kiểm kê định kỳ · Danh sách kho & địa điểm

**Pricing & Chính sách giá:** Bảng giá theo từng loại đối tác (đại lý / cửa hàng chính hãng / kênh) · Giá đặc biệt có hiệu lực theo thời gian · Giá vốn & cost basis

**Sales & Purchase Orders:** Đơn bán hàng · Đơn mua hàng (mã PO, ngày dự nhận, trạng thái) · Chi tiết từng dòng hàng (SKU, số lượng, giá, kho nhận) · Hóa đơn AR/AP

**Business Partners — Đại lý & Nhà cung cấp:** Danh sách đại lý & phân loại · Chính sách chiết khấu theo nhóm · Hạn mức tín dụng & công nợ · Thông tin liên hệ & địa chỉ

**Product Master:** Mô tả sản phẩm · Nhóm hàng · Thuộc tính vật lý (cân nặng, đặc tính) · Nhà sản xuất

---

**Source of Truth SAP B1 đảm nhận:**
Item Master chuẩn · Tồn kho kế toán tổng · Giá gốc & cost · Tài chính GL/AR/AP · Nhà cung cấp & PO

**Gaps:** Không có POS real-time tại cửa hàng → cần KiotViet · Không có hành vi khách hàng online → cần Haravan

**[Script nói]**
"SAP B1 là cột sống dữ liệu của BQ — nơi lưu trữ toàn bộ master data quan trọng nhất. MIABOS tích hợp qua Service Layer REST API để kéo 5 nhóm dữ liệu chính.

Quan trọng nhất là Inventory Management và Product Master — đây là nền định nghĩa chuẩn cho mọi SKU, tồn kho tổng theo kho, và bảng giá theo từng loại đối tác. Chatbot dùng dữ liệu này để trả lời câu hỏi về sản phẩm, giá, tồn kho một cách chính xác.

Nhóm Purchase Orders quan trọng cho Forecasting: AI biết không chỉ tồn kho hiện tại mà còn biết hàng nào đang về, về khi nào — từ đó gợi ý thời điểm đặt thêm hàng trước mùa cao điểm.

Lưu ý: tồn kho SAP là tồn kho kế toán, có thể lag so với thực tế tại quầy — đó là lý do cần KiotViet bổ sung tồn kho real-time."

---

## SLIDE 7C — TÍCH HỢP KIOTVIET × MIABOS

**[Hiển thị]**

**KiotViet — POS & vận hành chuỗi · Tích hợp qua KiotViet Public API v4.1+ (OAuth2) · Webhook real-time**

---

**Inventory Management:** Tồn kho thực tế từng chi nhánh (onHand / reserved) · Tồn khả dụng = onHand − reserved · Giá vốn tại chi nhánh · Cập nhật real-time qua webhook `inventory.changed`

**Product Catalog:** Danh mục sản phẩm theo cửa hàng · Mã vạch · Thuộc tính variant (size, màu) · Bảng giá theo nhóm khách / kênh · Giá bán lẻ cơ bản

**POS & Đơn hàng offline:** Hóa đơn bán tại quầy · Chi tiết giao dịch (SKU, số lượng, giá bán) · Phương thức thanh toán · Đổi trả tại cửa hàng · Lịch sử bán theo chi nhánh · Cập nhật real-time qua webhook `order.created`

**Customer Management:** Hồ sơ khách mua offline (tên, SĐT, email) · Điểm tích lũy loyalty tại cửa hàng · Tổng chi tiêu & công nợ · Nhóm khách hàng

**Branch Management:** Danh sách 200+ chi nhánh · Địa chỉ & khu vực · Thông tin vận hành từng cửa hàng

---

**Webhook real-time:** `inventory.changed` · `order.created` · `customer.created` · `product.updated`
→ MIABOS nhận event ngay khi có giao dịch POS tại bất kỳ cửa hàng nào trong chuỗi

**Source of Truth KiotViet đảm nhận:**
Tồn kho thực tế từng chi nhánh · Giao dịch POS offline · Đổi trả tại quầy · Lịch sử mua offline

**Gaps:** Không có đơn hàng online → cần Haravan · Loyalty cơ bản → MIABOS unify với Haravan

**[Script nói]**
"KiotViet là hệ thống sát mặt đất nhất — nơi mọi giao dịch tại 200+ cửa hàng được ghi lại real-time. Điểm khác biệt then chốt so với SAP: KiotViet cho tồn kho thực tế tại từng quầy ngay lúc này — đây là con số nhân viên cần khi khách hỏi còn hàng không.

Cách tích hợp của MIABOS với KiotViet không dùng polling mà dùng webhook — nghĩa là ngay khi có giao dịch POS xảy ra ở bất kỳ cửa hàng nào, KiotViet đẩy event sang MIABOS ngay lập tức. Chatbot luôn có dữ liệu tươi nhất mà không cần gọi API liên tục.

Với 200+ chi nhánh cùng lúc trong mùa cao điểm, MIABOS xây buffer layer riêng để xử lý event có kiểm soát — không để mất giao dịch nào dù volume tăng đột biến."

---

## SLIDE 7D — TÍCH HỢP HARAVAN × MIABOS

**[Hiển thị]**

**Haravan — Ecommerce & Omnichannel · Tích hợp qua Haravan REST API + Webhook real-time**

---

**Product Catalog & Variant:** Danh mục sản phẩm online · Variant theo size & màu (option1/2/3) · Giá bán & giá gốc (sale vs. giá gạch ngang) · Tồn kho ecommerce theo variant · Hình ảnh sản phẩm (chatbot gửi cho khách)

**Order Management:** Đơn hàng online theo kênh (web / Facebook / Zalo / app) · Trạng thái thanh toán (paid / pending / refunded) · Trạng thái giao hàng (fulfilled / partial / unshipped) · Chi tiết đơn (SKU, số lượng, giá) · Lịch sử đơn theo khách hàng

**Customer Management:** Hồ sơ khách hàng online (SĐT, email) · Tổng số đơn & tổng chi tiêu online · Tag phân loại khách · Đồng ý nhận marketing (opt-in) · Địa chỉ giao hàng

**Promotions & CTKM:** Tên & mức giảm giá (% hoặc số tiền cố định) · Phạm vi áp dụng (sản phẩm / nhóm hàng cụ thể) · Thời gian hiệu lực (ngày bắt đầu / kết thúc) · Điều kiện áp dụng (giá trị đơn tối thiểu) · Mã voucher & số lần đã dùng

**Inventory Ecommerce:** Tồn kho khả dụng theo variant & kho ecommerce · Hàng đang về (qty_incoming) · Đồng bộ với SAP B1 tránh oversell

**Omnichannel Inbox** *(Webhook real-time)*
- **Facebook Messenger:** Toàn bộ hội thoại với khách · Thời gian · Sender ID
- **Zalo OA:** Tin nhắn & file đính kèm · Zalo User ID để gửi ZNS follow-up
- **Web Chat:** Session khách trên website BQ · Nội dung trao đổi

---

**Source of Truth Haravan đảm nhận:**
Đơn hàng online · CTKM & voucher đang chạy · Hội thoại omnichannel · Hành vi mua online · Tồn kho ecommerce

**Gaps:** Không có POS offline → cần KiotViet · Loyalty chỉ kênh online → MIABOS unify với KiotViet

**[Script nói]**
"Haravan là cửa ngõ digital của BQ — phong phú nhất về hành vi khách hàng online và cũng là nơi toàn bộ hội thoại đa kênh đổ về.

Nhóm dữ liệu quan trọng nhất với External Chatbot là Omnichannel Inbox: Facebook Messenger, Zalo OA, Web Chat đều tập trung tại đây. MIABOS kết nối vào luồng này qua webhook, AI đọc toàn bộ context hội thoại trước khi trả lời — không bao giờ hỏi lại khách thông tin đã nói rồi.

Nhóm quan trọng nhất với Marketing là CTKM và Promotions: MIABOS biết chính xác CTKM nào đang active, áp cho sản phẩm nào, điều kiện gì, còn hiệu lực đến khi nào. Khi khách hỏi 'voucher này còn dùng được không', AI tra Haravan ngay và trả lời trong vài giây.

Cuối cùng, mỗi đơn hàng mới từ bất kỳ kênh nào — web, Facebook, Zalo — đều được webhook đẩy về MIABOS ngay lập tức: AI tự động gửi thông báo xác nhận cho khách, cộng điểm loyalty, và ghi vào Customer 360."

---

## SLIDE 7E — BẢO MẬT DỮ LIỆU: MIABOS CAM KẾT GÌ VỚI BQ

**[Hiển thị]**

> **Nguyên tắc nền tảng: BQ sở hữu dữ liệu — MIABOS chỉ là công cụ xử lý**

---

**1. Phân tầng quyền truy cập — MIABOS chỉ đọc những gì BQ cho phép**

```
BQ quyết định                        MIABOS thực thi
───────────────────────────────────  ──────────────────────────────────
Hệ thống nào được kết nối?       →   Chỉ kết nối SAP B1 / KiotViet /
                                      Haravan theo đúng scope BQ cấp

Module / trường dữ liệu nào?     →   Mỗi API call có permission scope
                                      riêng, không đọc ngoài phạm vi

Phòng ban nào thấy dữ liệu gì?   →   RBAC (Role-Based Access Control):
                                      Store Lead chỉ thấy chi nhánh mình,
                                      Finance thấy thêm cost data,
                                      CEO thấy toàn bộ

Dữ liệu nào không được dùng      →   Whitelist rõ ràng — ngoài danh sách
cho AI training?                      không được đưa vào model
```

---

**2. Dữ liệu BQ không bao giờ rời khỏi vùng kiểm soát của BQ**

| Cam kết | Chi tiết |
|---------|---------|
| **Không lưu source data** | MIABOS không copy và lưu trữ dữ liệu SAP B1, KiotViet, Haravan vào database riêng — chỉ cache tạm thời để trả lời, xóa sau phiên |
| **Không dùng dữ liệu BQ để train model chung** | Dữ liệu BQ chỉ phục vụ BQ — không được dùng để cải thiện model cho khách hàng khác |
| **Không chia sẻ với bên thứ ba** | Không có bên thứ ba nào truy cập dữ liệu BQ ngoài các LLM provider đã được BQ chấp thuận, theo điều khoản bảo mật ràng buộc |
| **Encryption in transit & at rest** | Toàn bộ dữ liệu truyền qua HTTPS/TLS 1.3 · Dữ liệu tạm lưu được mã hóa AES-256 |

---

**3. Audit Log — BQ kiểm soát được ai đang hỏi gì**

```
Mỗi câu hỏi AI được log đầy đủ:
  ┌─────────────────────────────────────────────────────┐
  │ Timestamp  : 2026-04-19 09:15:32                    │
  │ User       : nguyen.van.a@bq.com.vn (Store Lead HN) │
  │ Query      : "Mã BQ-2301 size 40 còn bao nhiêu?"    │
  │ Source Hit : KiotViet /inventories (branch_id: 023)  │
  │ Response   : onHand=12, reserved=2, available=10    │
  │ Latency    : 1.2s                                   │
  └─────────────────────────────────────────────────────┘

→ BQ có thể export toàn bộ audit log bất cứ lúc nào
→ Phát hiện truy cập bất thường · Tuân thủ kiểm toán nội bộ
```

---

**4. Quyền chấm dứt & lấy lại dữ liệu**

| Tình huống | MIABOS thực hiện |
|-----------|-----------------|
| BQ muốn thu hồi quyền 1 hệ thống | Revoke API key → MIABOS ngừng kết nối ngay lập tức |
| BQ muốn xóa toàn bộ dữ liệu đã cache | Hard delete trong 72 giờ, xuất biên bản xác nhận |
| BQ chấm dứt hợp đồng | Xóa toàn bộ dữ liệu BQ khỏi MIABOS trong 30 ngày, bàn giao lại dữ liệu Conversation & Knowledge |
| BQ yêu cầu audit độc lập | MIABOS hỗ trợ đơn vị kiểm toán bên thứ ba do BQ chỉ định |

---

**5. Trách nhiệm của từng bên**

```
BQ chịu trách nhiệm:                MIABOS chịu trách nhiệm:
────────────────────────────         ───────────────────────────────
• Cấp & quản lý API credentials     • Bảo mật credentials không lộ
• Xác định scope dữ liệu cho phép   • Không vượt quá scope được cấp
• Quản lý tài khoản người dùng      • Thực thi RBAC đúng theo cấu hình
• Quyết định LLM provider nào dùng  • Ký Data Processing Agreement
                                       với LLM provider thay mặt BQ
```

**[Script nói]**
"Đây là slide nhiều khách hàng hỏi đến nhất — và chúng tôi muốn trả lời thẳng thắn.

Nguyên tắc nền tảng: dữ liệu của BQ là tài sản của BQ. MIABOS là công cụ xử lý, không phải chủ sở hữu dữ liệu.

Điều đó có nghĩa là gì trong thực tế? Thứ nhất, MIABOS không copy dữ liệu SAP B1, KiotViet, Haravan vào database riêng — chúng tôi đọc theo thời gian thực, cache tạm thời để trả lời, rồi xóa. Thứ hai, dữ liệu của BQ không bao giờ được dùng để train model AI phục vụ khách hàng khác — BQ của BQ, MWG của MWG, không bao giờ trộn lẫn.

Thứ ba — và đây là điểm khác biệt — BQ có full visibility qua Audit Log. Mỗi câu hỏi được đặt ra trên hệ thống đều được ghi lại: ai hỏi, hỏi gì, lấy dữ liệu từ đâu, trả lời gì, lúc mấy giờ. BQ có thể export toàn bộ log này bất cứ lúc nào để kiểm toán nội bộ.

Cuối cùng, nếu BQ muốn chấm dứt hợp đồng — chúng tôi xóa toàn bộ dữ liệu trong 30 ngày và bàn giao lại toàn bộ Conversation và Knowledge mà BQ đã build. Không giữ lại gì."

---

## SLIDE 7E — SOURCE OF TRUTH TỔNG HỢP: AI BIẾT HỎI ĐÚNG CHỖ

**[Hiển thị]**

**Vấn đề nếu không có mapping rõ:** Cùng câu hỏi "mã X còn bao nhiêu?" → SAP B1, KiotViet, Haravan có thể cho 3 con số khác nhau

```
Domain dữ liệu          Source of Truth        Lý do
──────────────────────  ─────────────────────  ─────────────────────────────────────
Item Master (SKU)       SAP B1                 SAP định nghĩa sản phẩm chuẩn
Giá gốc / cost basis    SAP B1                 SAP quản lý price list nền
Tài chính (GL/AR/AP)    SAP B1                 Non-negotiable — ERP authority
Tồn kho tổng (kế toán)  SAP B1                 SAP reconcile toàn bộ kho
Nhà cung cấp / mua hàng SAP B1                 SAP quản lý procurement cycle
──────────────────────  ─────────────────────  ─────────────────────────────────────
Tồn kho thực tại quầy   KiotViet               POS capture real-time tại cửa hàng
Giao dịch bán lẻ offline KiotViet              Mọi hóa đơn quầy đi qua KiotViet
Đổi trả tại cửa hàng    KiotViet               Return flow offline là native KiotViet
──────────────────────  ─────────────────────  ─────────────────────────────────────
Đơn hàng online         Haravan                Luồng ecommerce native của Haravan
CTKM & discount         Haravan                Marketing promotion rules ở Haravan
Hội thoại omnichannel   Haravan                FB Messenger, Zalo OA, Web Chat
Hành vi online khách    Haravan                Click, xem, chat — native Haravan data
──────────────────────  ─────────────────────  ─────────────────────────────────────
Customer 360 (unified)  MIABOS                 MIABOS hợp nhất từ cả 3 hệ thống
Loyalty tổng hợp        MIABOS                 Merge điểm KiotViet + Haravan
Lịch sử hội thoại AI    MIABOS                 Conversation do MIABOS tạo ra
```

**Nguyên tắc MIABOS áp dụng khi trả lời:**
- Câu hỏi về **tài chính / giá gốc** → hỏi SAP B1
- Câu hỏi về **tồn kho thực tế tại cửa hàng cụ thể** → hỏi KiotViet
- Câu hỏi về **đơn hàng online / CTKM đang chạy** → hỏi Haravan
- Câu hỏi về **khách hàng tổng hợp** → MIABOS CRM 360

**[Script nói]**
"Đây là slide quan trọng nhất về mặt kỹ thuật. Khi MIABOS tích hợp cả 3 hệ thống, một câu hỏi về tồn kho có thể nhận được 3 con số khác nhau từ 3 nguồn khác nhau — không phải vì hệ thống sai, mà vì mỗi hệ thống đo tồn kho theo một góc độ khác nhau.

SAP B1 cho con số tồn kho kế toán — chính xác về tài chính nhưng có thể lag vài giờ so với thực tế. KiotViet cho con số tồn kho thực tế tại từng quầy — real-time nhưng chỉ ở cấp chi nhánh. Haravan cho con số tồn kho ecommerce — chỉ dành cho kênh online.

MIABOS không tự chọn một nguồn rồi bỏ qua phần còn lại. MIABOS biết hỏi đúng nguồn theo từng loại câu hỏi — và khi có xung đột, hệ thống hiển thị cả hai con số kèm nguồn và thời điểm cập nhật để người dùng tự quyết định.

Bên cạnh đó, có 3 domain mà không hệ thống nào trong số này là source of truth — Customer 360 tổng hợp, loyalty hợp nhất, và lịch sử hội thoại AI. Đây là 3 domain mà MIABOS tự tạo ra và là nơi MIABOS tạo ra giá trị cộng thêm thực sự."

---

## SLIDE 8 — KIẾN TRÚC TỔNG THỂ MIABOS

**[Hiển thị]**
```
[SAP B1]     [KiotViet]     [Haravan]     [Excel / Docs]
                    ↓
         ┌─────────────────────────┐
         │    Integration Hub      │  ← read layer · permission · audit log
         │   + RAG Labeling &      │  ← gán nhãn nghiệp vụ · data linking
         │     Data Linking        │
         └─────────────────────────┘
                    ↓
   ┌──────────────────────────────────────────┐
   │           AGENTIC AI CORE                │
   │   (Multi-LLM · Agent Planner · RAG)      │
   ├──────────────────────────────────────────┤
   │  Knowledge & Internal Chat               │  → Hỏi đáp nội bộ + source trace
   │  CRM & Customer 360                      │  → Hành trình khách hàng tập trung
   │  Marketing Intelligence                  │  → Tổng hợp · Recommendation · Forecast
   │  Automation Engine                       │  → Journey trigger · Workflow · Notification
   └──────────────────────────────────────────┘
                    ↓
     Facebook · Zalo OA/ZNS · Website · SMS · Email
```

**[Script nói]**
"Nhìn tổng thể, MIABOS đứng giữa nguồn dữ liệu và người dùng. Integration Hub đảm bảo dữ liệu được đọc đúng quyền, có audit log, và được gán nhãn nghiệp vụ đúng trước khi đưa vào AI Engine.

Agentic AI Core là trung tâm xử lý — nơi Multi-LLM, Agent Planner, và RAG Engine phối hợp để đưa ra câu trả lời tốt nhất.

Và toàn bộ output — dù là câu trả lời nội bộ, tư vấn bán hàng, hay campaign automation — đều có thể đẩy ra đồng thời nhiều kênh và được quản lý tập trung trong MIABOS."

---

## SLIDE 9 — ROADMAP 4 PHASE TỔNG QUAN

**[Hiển thị]**
```
Phase 1  ──►  AI Internal Chatbot + Knowledge Layer       [Tháng 1–3]
Phase 2  ──►  AI External Chatbot + CRM & Customer 360    [Tháng 4–6]
Phase 3  ──►  AI Marketing Intelligence                   [Tháng 7–9]
Phase 4  ──►  Workflow Automation + Forecasting           [Tháng 10+]
```
*Mỗi phase build on top phase trước — không làm lại từ đầu*

**[Script nói]**
"Lộ trình được chia thành 4 phase kéo dài khoảng 12 tháng. Điểm quan trọng là mỗi phase không độc lập — Phase 2 dùng lại integration và knowledge từ Phase 1, Phase 3 dùng Customer 360 từ Phase 2. Đây là cách đầu tư tích lũy, không phải restart."

---

## SLIDE 10 — PHASE 1: AI INTERNAL CHATBOT

**[Hiển thị]**
**Phase 1 — AI Internal Chatbot + Knowledge Layer** `[Tháng 1–3]`

**Phòng ban tham gia:** Vận hành bán lẻ · Store Lead · CSKH · Logistics/Kho · Tài chính · IT/ERP

---

**Use cases MIABOS giải quyết:**

| # | Use Case | Câu hỏi mẫu AI trả lời được | Nguồn dữ liệu |
|---|----------|------------------------------|---------------|
| 1 | **Tra cứu tồn kho tức thì** | "Mã BQ-2301 size 40 màu đen còn bao nhiêu tại kho HN?" | KiotViet + SAP B1 |
| 2 | **Tra cứu CTKM nhanh theo context** | "CTKM tháng này áp dụng cho cửa hàng chính hãng gồm những gì?" | Haravan + SAP B1 |
| 3 | **Tra cứu giá & chính sách giá** | "Giá bán lẻ hiện tại của mã X là bao nhiêu? Có price list đặc biệt cho đại lý không?" | SAP B1 |
| 4 | **Hướng dẫn thao tác hệ thống** | "Làm thế nào để tạo đơn chuyển kho trên KiotViet?" "Quy trình nhập hàng trên SAP B1 là gì?" | Knowledge Base |
| 5 | **Tra cứu thông tin sản phẩm** | "Mã BQ-2301 thuộc dòng nào? Chất liệu gì? Có size nào?" | SAP B1 |
| 6 | **Quy trình đổi trả & bảo hành** | "Chính sách đổi trả trong 30 ngày áp dụng điều kiện gì?" | Knowledge Base |
| 7 | **Tra cứu logistics & giao hàng** | "Đơn hàng #12345 đang ở trạng thái nào? Khi nào giao?" | Haravan + KiotViet |
| 8 | **FAQ nội bộ theo phòng ban** | "Quy trình xin nghỉ phép là gì?" "Mẫu báo cáo cuối tháng gửi ai?" | Knowledge Base |

---

**Tính năng nền tảng:**
- **Source trace:** mỗi câu trả lời ghi rõ lấy từ SAP B1 / KiotViet / Haravan + timestamp cập nhật
- **Conflict handling:** khi SAP và KiotViet cho số tồn khác nhau → hiển thị cả 2 kèm giải thích
- **Phân quyền theo vai trò:** Store Lead chỉ thấy data chi nhánh mình; Finance thấy thêm giá cost
- **Rollout:** nội bộ/content team → Store Lead → Logistics → Tài chính → toàn bộ

**Kết quả đo được:**
- Giảm 15–30 phút/câu hỏi thủ công → trả lời trong vài giây
- Giảm phụ thuộc vào nhân sự kinh nghiệm
- Giảm sai lệch thông tin giữa các phòng ban

**[Script nói]**
"Phase 1 là nền móng — nhưng không phải chatbot FAQ đơn giản. Mỗi use case ở đây giải quyết một câu hỏi mà nhân viên BQ đang phải mất 15–30 phút để tự tìm mỗi ngày.

Lấy ví dụ cụ thể: một Store Lead cần biết mã BQ-2301 size 40 màu đen còn bao nhiêu tại kho Hà Nội. Hiện tại họ phải mở KiotViet, filter theo chi nhánh, kiểm tra lại với SAP nếu cần tồn tổng — mất ít nhất 5–10 phút. Với MIABOS, họ gõ câu hỏi bằng tiếng Việt tự nhiên, AI kéo dữ liệu từ đúng nguồn, trả lời trong vài giây kèm ghi rõ 'dữ liệu từ KiotViet, cập nhật lúc 9:15 sáng nay'.

Điểm đặc biệt là MIABOS phân quyền thông minh — Store Lead chỉ thấy data của chi nhánh mình, bộ phận tài chính thấy thêm giá cost, ban điều hành thấy toàn bộ. Cùng một câu hỏi, người hỏi khác nhau nhận được câu trả lời phù hợp với quyền của họ."

---

## SLIDE 11 — PHASE 2: AI EXTERNAL CHATBOT + CRM CHUYÊN SÂU

**[Hiển thị]**
**Phase 2 — AI External Chatbot + CRM & Customer 360** `[Tháng 4–6]`

**Phòng ban tham gia:** CSKH · Sales / Store Lead · Marketing · Ecommerce · Ban điều hành

---

**[PHẦN A] AI External Chatbot — Use cases tư vấn & bán hàng đa kênh**

| # | Use Case | Kịch bản thực tế | Kênh |
|---|----------|------------------|------|
| 1 | **Tư vấn sản phẩm thông minh** | Khách nhắn "Tôi cần giày đi làm văn phòng, size 38, ngân sách 500k" → AI gợi ý 3 mã phù hợp kèm hình ảnh, giá, link mua | FB · Zalo · Web |
| 2 | **Kiểm tra tồn kho & đặt hàng** | "Mã BQ-2301 màu nâu size 39 còn không?" → AI check real-time, xác nhận có hàng, hướng dẫn đặt | FB · Zalo · Web |
| 3 | **Tra cứu trạng thái đơn hàng** | "Đơn #98765 của tôi giao khi nào?" → AI kéo từ Haravan, trả lời ngay trong chat | FB · Zalo |
| 4 | **Hỗ trợ đổi trả & bảo hành** | Khách muốn đổi size → AI hỏi đủ thông tin, tạo yêu cầu đổi hàng, chỉ cửa hàng gần nhất | FB · Zalo · Web |
| 5 | **CTKM đang áp dụng** | "Hôm nay mua có được giảm giá không?" → AI tra đúng CTKM đang hiệu lực, giải thích điều kiện áp dụng | FB · Zalo · Web |
| 6 | **Upsell & cross-sell** | Khách hỏi 1 đôi giày → AI gợi thêm phụ kiện phù hợp, combo tiết kiệm hơn | FB · Zalo · Web |
| 7 | **Smart escalation** | Câu hỏi phức tạp / khách không hài lòng → AI nhận diện, chuyển ngay cho nhân viên kèm toàn bộ context cuộc hội thoại | Tất cả kênh |

---

**[PHẦN B] CRM Chuyên Sâu — Customer 360 & quản lý hành trình khách hàng**

| # | Tính năng CRM | Giá trị mang lại | Phòng ban dùng |
|---|---------------|-----------------|----------------|
| 1 | **Customer 360 Profile** | Gộp lịch sử mua offline (KiotViet) + online (Haravan) + hội thoại (Zalo/FB) → 1 profile duy nhất | CSKH · Sales · Marketing |
| 2 | **Unified Loyalty** | Merge điểm tích KiotViet và Haravan → khách mua offline cộng điểm online và ngược lại | CSKH · Marketing |
| 3 | **AI Tag & Segment tự động** | Tự động gán tag: "khách VIP", "hay mua giày thể thao", "mua mùa hè", "có nguy cơ churn" | Marketing · Sales |
| 4 | **Timeline hành trình khách** | Xem toàn bộ lịch sử: lần đầu mua ở đâu, kênh nào, phàn nàn gì, CTKM nào đã nhận | CSKH · Store Lead |
| 5 | **Omnichannel Inbox tập trung** | FB Messenger + Zalo OA + Web Chat về 1 giao diện, nhân viên không bỏ sót tin nhắn | CSKH · Sales |
| 6 | **AI nhận diện khách quay lại** | Khi khách nhắn tin, AI biết ngay: khách này đã mua gì, vấn đề gì trước đây, đang ở tier nào | CSKH |

---

**Kết quả đo được:**
- Phản hồi khách từ 6+ giờ → dưới 4 phút (AI xử lý 24/7)
- Không bỏ sót tin nhắn trong mùa cao điểm (Tết, 11.11, 12.12)
- Nhân viên CSKH tập trung xử lý case phức tạp thay vì câu hỏi lặp lại
- Customer 360 là nền dữ liệu để Phase 3 Marketing chạy campaign đúng đối tượng

**[Script nói]**
"Phase 2 chia làm 2 phần rõ ràng — External Chatbot và CRM chuyên sâu — nhưng 2 phần này phối hợp với nhau.

External Chatbot giải quyết bài toán mùa cao điểm: khi Tết đến, tin nhắn tăng 3–5 lần, AI xử lý tất cả những câu hỏi có thể trả lời được — tư vấn sản phẩm, kiểm tra tồn kho, tra đơn hàng — trong vài giây, 24/7, không cần nhân viên. Những câu phức tạp hoặc khách không hài lòng, AI nhận diện và chuyển cho người kèm toàn bộ context — nhân viên không phải hỏi lại từ đầu.

Nhưng điều quan trọng hơn là phần CRM. Mỗi cuộc hội thoại, mỗi giao dịch được ghi vào Customer 360 — một profile duy nhất cho mỗi khách hàng, gộp data từ KiotViet, Haravan, và tất cả kênh chat. Lần đầu tiên, CSKH và Marketing nhìn được: khách này đã mua gì, ở đâu, qua kênh nào, phàn nàn gì, đang ở tier loyalty nào. Đây là nền để Phase 3 chạy campaign thực sự đúng đối tượng."

---

## SLIDE 12 — PHASE 3: AI MARKETING INTELLIGENCE

**[Hiển thị]**
**Phase 3 — AI Marketing Intelligence** `[Tháng 7–9]`

**Phòng ban tham gia:** Marketing · CRM · Ecommerce · Ban điều hành · Trade Marketing

---

**Use cases MIABOS giải quyết:**

| # | Use Case | Tính năng cụ thể | Giá trị |
|---|----------|-----------------|---------|
| 1 | **Dashboard tổng hợp dữ liệu bán hàng** | Tổng hợp revenue, đơn hàng, sản phẩm bán chạy từ SAP B1 + KiotViet + Haravan về 1 màn hình | Marketing không cần pull data thủ công từ 3 hệ thống |
| 2 | **AI Segment khách hàng tự động** | Phân tích RFM: Recency (mua gần đây?), Frequency (mua bao nhiêu lần?), Monetary (chi bao nhiêu?) → tự động nhóm khách | Biết đúng nhóm nào cần kích hoạt |
| 3 | **AI Recommendation campaign & CTKM** | Dựa trên lịch sử segment + mùa vụ + tồn kho → AI đề xuất: "Tháng này nên chạy CTKM 15% cho nhóm khách VIP chưa mua 60 ngày, ưu tiên kênh Zalo ZNS" | Campaign có data, không phải cảm tính |
| 4 | **Phân tích hiệu quả campaign** | Sau mỗi campaign: AI báo cáo tự động tỉ lệ mở, click, conversion, doanh thu tăng thêm, so sánh với kỳ trước | Biết campaign nào hiệu quả để tối ưu vòng sau |
| 5 | **Trend sản phẩm theo mùa** | AI phát hiện sản phẩm đang tăng/giảm demand theo vùng, theo mùa, theo kênh → gợi ý điều chỉnh CTKM | Không bỏ lỡ sóng bán hàng |
| 6 | **Multi-channel campaign execution** | Lên campaign 1 lần → đẩy đồng thời Zalo ZNS, Facebook, Email, SMS — track kết quả từng kênh | Tiết kiệm 50% thời gian setup campaign |
| 7 | **AI dự báo thời điểm kích hoạt CTKM tối ưu** | Dựa trên lịch sử mua hàng theo ngày/tuần/tháng → AI gợi ý thời điểm gửi thông báo CTKM có conversion cao nhất | Đúng người · đúng lúc · đúng kênh |

---

**Kết quả đo được:**
- Thời gian xây campaign giảm 50% (không cần tổng hợp số thủ công)
- Campaign chạy đúng segment → tăng conversion rate
- Marketing biết CTKM nào hiệu quả, kênh nào nên tăng ngân sách

**[Script nói]**
"Phase 3 là nơi Marketing team chuyển từ làm việc theo cảm tính sang làm việc theo dữ liệu — nhưng không phải vì Marketing kém, mà vì trước đây họ không có công cụ tổng hợp đủ nhanh.

Lấy ví dụ: Marketing muốn chạy một campaign tháng 8 cho mùa back-to-school. Hiện tại quy trình là: pull dữ liệu từ KiotViet, pull từ Haravan, gộp vào Excel, phân tích, rồi mới ra quyết định — mất 2–3 ngày. Và đến lúc chạy campaign, AI vẫn chưa có.

Với MIABOS, Marketing mở dashboard lên: dữ liệu 3 hệ thống đã được tổng hợp. AI đã phân nhóm khách — đây là nhóm 1.200 khách VIP chưa mua 60 ngày, đây là nhóm 3.500 khách hay mua giày học sinh. AI đề xuất: chạy CTKM 15% cho nhóm VIP qua Zalo ZNS, đẩy bộ sưu tập học sinh cho nhóm còn lại qua Facebook. Marketing chỉ cần duyệt và confirm.

Đây không phải Marketing bị thay thế — đây là Marketing được nâng cấp."

---

## SLIDE 13A — PHASE 4: AI AUTOMATION

**[Hiển thị]**
**Phase 4A — AI Workflow Automation** `[Tháng 10–11]`

**Phòng ban tham gia:** CSKH · HR · Sales · Kế toán · Marketing · Vận hành nội dung

---

**Use cases MIABOS giải quyết:**

**[Nhóm 1] Customer Journey Automation — chăm sóc khách chủ động**

| # | Use Case | Trigger | Hành động tự động |
|---|----------|---------|-------------------|
| 1 | **Chăm sóc sau mua** | Khách mua hàng xong | Gửi Zalo ZNS cảm ơn + hướng dẫn bảo quản giày sau 1 giờ |
| 2 | **Nhắc nhở khách chưa mua lại** | Khách VIP không mua 45 ngày | Gửi thông báo cá nhân hóa + CTKM dành riêng |
| 3 | **Tái kích hoạt khách ngủ đông** | Khách không tương tác 90 ngày | Gửi campaign Win-back với ưu đãi đặc biệt |
| 4 | **Nhắc hạn bảo hành** | Sắp hết hạn bảo hành 30 ngày | Gửi ZNS nhắc nhở + link gia hạn hoặc mua mới |
| 5 | **Upsell tự động sau đổi trả** | Khách đổi hàng thành công | Gửi gợi ý sản phẩm thay thế phù hợp hơn |

**[Nhóm 2] HR Automation — tiết kiệm thời gian tuyển dụng & vận hành nhân sự**

| # | Use Case | Trước MIABOS | Sau MIABOS |
|---|----------|-------------|------------|
| 1 | **AI screening CV** | Đọc thủ công 50–100 CV/đợt tuyển | AI lọc, chấm điểm, xếp hạng CV theo tiêu chí → recruiter chỉ review top 10 |
| 2 | **Auto generate JD** | Soạn JD tay 1–2 giờ/vị trí | Nhập yêu cầu vị trí → AI sinh JD chuẩn trong 2 phút |
| 3 | **Onboarding document pack** | Soạn thủ công từng bộ hồ sơ | AI generate tự động: hợp đồng, checklist, tài liệu training theo vị trí |
| 4 | **FAQ nhân viên mới** | Hỏi HR từng câu | AI trả lời tự động: chính sách lương, phép, quy định nội bộ |

**[Nhóm 3] Sales & Operations Automation**

| # | Use Case | Hành động tự động |
|---|----------|-------------------|
| 1 | **Báo cáo doanh số tự động** | Cuối ngày: AI tổng hợp doanh số theo cửa hàng / kênh / sản phẩm → gửi về manager |
| 2 | **Thông báo đơn hàng real-time** | Có đơn mới / đổi trạng thái → ZNS gửi cho khách tự động |
| 3 | **Cập nhật loyalty tự động** | Khách mua → điểm tích cộng ngay, thông báo qua Zalo |
| 4 | **Ticket routing thông minh** | Khách phàn nàn → AI phân loại, routing đến đúng bộ phận xử lý |

---

**Kết quả đo được:**
- HR giảm 60% thời gian tuyển dụng · ROI automation 3–5x trong năm đầu
- CSKH xử lý nhiều case hơn với cùng số nhân sự
- Không bỏ sót khách hàng cần chăm sóc do nhân sự quên

**[Script nói]**
"Phase 4A là lúc MIABOS bắt đầu chạy thay người — không phải thay thế con người, mà thay thế những việc lặp lại mà con người không nên dùng thời gian để làm.

Ví dụ rõ nhất là HR. Mỗi đợt tuyển dụng mở store mới, recruiter mất cả tuần đọc CV và soạn tài liệu onboarding. Với MIABOS, AI lọc CV theo tiêu chí, xếp hạng, recruiter chỉ interview top ứng viên. Onboarding docs được generate tự động theo vị trí — hợp đồng, checklist, tài liệu training — recruiter chỉ cần ký duyệt.

Hay ví dụ về customer journey: hiện tại không ai có thời gian nhớ gửi thông báo cho 1.200 khách VIP chưa mua 45 ngày. Với MIABOS, trigger tự chạy — đúng khách, đúng nội dung cá nhân hóa, đúng kênh — không cần ai nhớ."

---

## SLIDE 13B — PHASE 4: AI FORECASTING

**[Hiển thị]**
**Phase 4B — AI Forecasting** `[Tháng 11–12]`

**Phòng ban tham gia:** Ban điều hành · Vận hành / Logistics · Mua hàng / Procurement · Trade Marketing

---

**Use cases MIABOS giải quyết:**

| # | Use Case | Câu hỏi AI trả lời được | Nguồn dữ liệu |
|---|----------|-------------------------|---------------|
| 1 | **Dự báo nhu cầu theo SKU × mùa vụ** | "Tháng 9 (back-to-school) năm nay cần nhập bao nhiêu mã học sinh, size nào, bao nhiêu?" | KiotViet + Haravan lịch sử 2–3 năm |
| 2 | **Dự báo theo vùng & cửa hàng** | "Khu vực Hà Nội cần phân bổ thêm tồn kho dòng nào so với khu vực TP.HCM?" | KiotViet sales by branch |
| 3 | **Cảnh báo sắp hết hàng** | "Top 10 mã có nguy cơ hết hàng trong 2 tuần tới — cần đặt hàng ngay" | SAP B1 + KiotViet |
| 4 | **Gợi ý phân bổ hàng tối ưu** | "Kho HN đang tồn dư mã X, trong khi cửa hàng TP.HCM đang thiếu — gợi ý chuyển kho" | SAP B1 tồn kho multi-warehouse |
| 5 | **Dự báo doanh thu theo kênh** | "Tháng tới dự kiến doanh thu kênh online tăng/giảm bao nhiêu % so với tháng này?" | Haravan + KiotViet trend |
| 6 | **Nhập hàng đúng thời điểm** | "Nên đặt Purchase Order cho dòng Đông bao giờ để kịp nhận hàng trước tháng 10?" | SAP B1 PO history + lead time |
| 7 | **Trend sản phẩm dài hạn** | "Dòng sản phẩm nào đang tăng trưởng ổn định 6 tháng qua? Dòng nào đang giảm?" | SAP B1 + KiotViet + Haravan |

---

**Điều kiện để Forecasting hoạt động tốt:**
```
Data lịch sử từ Phase 1–3 đã được làm sạch & gán nhãn
        ↓
Tối thiểu 6–12 tháng dữ liệu bán hàng theo SKU × chi nhánh × kênh
        ↓
AI Forecasting model đạt độ chính xác tăng dần theo thời gian
```

**Kết quả đo được:**
- Giảm tình trạng hết hàng mùa cao điểm (73% hết hàng do dự báo sai → có thể giảm đáng kể)
- Giảm tồn kho dư thừa sau mùa 20%
- Ban điều hành có dữ liệu để ra quyết định nhập hàng & phân bổ thay vì dựa kinh nghiệm

**[Script nói]**
"Phase 4B là Forecasting — và đây là lý do chúng tôi để phần này ở cuối lộ trình, không phải vì nó ít quan trọng, mà vì nó phụ thuộc vào chất lượng dữ liệu được xây dựng từ Phase 1 đến Phase 3.

Khi BQ đã có 6–12 tháng dữ liệu sạch từ SAP B1, KiotViet, Haravan được gán nhãn và link xuyên hệ thống, AI Forecasting bắt đầu hoạt động với độ chính xác thực sự.

Ví dụ cụ thể nhất: chuẩn bị hàng cho mùa back-to-school. Thay vì buyer ngồi nhìn dữ liệu năm ngoái trên Excel rồi ước lượng, MIABOS phân tích xu hướng 3 năm theo từng vùng, từng size, từng mã — và đưa ra Purchase Order recommendation: cần nhập bao nhiêu, mã nào, size nào, để kịp có hàng trước tháng 9.

73% tình trạng hết hàng tại các chuỗi bán lẻ đến từ dự báo sai. Đây là bài toán mà BQ có thể giải được khi có đủ dữ liệu và đúng công cụ."

---

## SLIDE 14 — TIMELINE DỰ KIẾN

**[Hiển thị]**

| Phase | Hạng mục chính | Timeline | Điều kiện tiên quyết |
|-------|---------------|----------|---------------------|
| **Phase 1** | AI Internal Chatbot + Knowledge | Tháng 1–3 | BQ cấp API access: SAP B1, KiotViet, Haravan |
| **Phase 2** | External Chatbot + CRM 360 | Tháng 4–6 | Phase 1 stable · Page FB/Zalo OA sẵn sàng kết nối |
| **Phase 3** | AI Marketing Intelligence | Tháng 7–9 | Customer 360 từ Phase 2 đủ dữ liệu |
| **Phase 4** | Automation + Forecasting | Tháng 10+ | Data lịch sử đủ sạch từ các phase trước |

*Các phase có thể chạy song song một phần tùy năng lực triển khai của team BQ*

**[Script nói]**
"Về timeline, chúng tôi estimate 12 tháng để hoàn thành đủ 4 phase — tính từ lúc BQ xác nhận scope và team IT bắt đầu cấp quyền tích hợp.

Mỗi phase có điều kiện tiên quyết rõ ràng. Phase 1 phụ thuộc vào việc BQ cấp API access cho 3 hệ thống chính — đây là bước cần team IT của BQ tham gia sớm nhất. Các phase sau phụ thuộc vào kết quả phase trước, nên timeline có thể co giãn tùy tốc độ adoption của từng phòng ban."

---

## SLIDE 15 — BƯỚC TIẾP THEO

**[Hiển thị]**
**3 việc cần làm ngay sau buổi này:**

1. **Workshop discovery kỹ thuật** — IT/ERP owner BQ + MIABOS Tech Lead: xác nhận khả năng tích hợp SAP B1, KiotViet, Haravan và scope API access
2. **Xác nhận scope Phase 1** — danh sách use case ưu tiên, phòng ban rollout đầu tiên, KPI đo thành công
3. **POC timeline** — demo AI Internal Chatbot với dữ liệu thực tế của BQ trong môi trường sandbox

**[Script nói]**
"Để đi tiếp, chúng tôi đề xuất 3 bước cụ thể. Đầu tiên là một workshop kỹ thuật ngắn giữa team IT của BQ và Tech Lead của MIABOS để confirm khả năng tích hợp — không cần nhiều hơn 2 buổi. Thứ hai là xác nhận scope Phase 1 để chúng tôi có thể chuẩn bị POC. Thứ ba là chạy POC demo với dữ liệu thực của BQ — đây là bước để BQ thấy chatbot hoạt động như thế nào trước khi ký kết chính thức.

Chúng tôi sẵn sàng bắt đầu ngay khi BQ xác nhận."

---

## CLOSING — 3 THÔNG ĐIỆP CHỐT

> **"Bài toán của BQ không phải là thiếu hệ thống — mà là thiếu lớp AI kết nối và làm thông minh hóa các hệ thống đang có"**

> **"Kiến trúc Agentic AI + Multi-LLM + RAG của MIABOS cho phép trả lời đúng, có nguồn, xuyên hệ thống — không phải chatbot đơn giản"**

> **"12 tháng, 4 phase, build on top nhau — BQ không làm lại từ đầu ở bất kỳ bước nào"**

---

## APPENDIX — CÂU HỎI THƯỜNG GẶP

**H: MIABOS có thay thế SAP B1, KiotViet, hay Haravan không?**
Không. MIABOS đọc dữ liệu từ các hệ thống đó, bổ sung lớp AI, Conversation, và Knowledge. BQ vẫn vận hành 3 hệ thống này như hiện tại.

**H: Dữ liệu của BQ có được bảo mật không?**
MIABOS chỉ đọc dữ liệu theo quyền BQ cấp. Toàn bộ truy cập có audit log. BQ kiểm soát hoàn toàn scope dữ liệu nào MIABOS được phép truy cập.

**H: Phase 1 mất bao lâu để go-live?**
3 tháng từ lúc API access được cấp và scope Phase 1 được xác nhận.

**H: Multi-LLM nghĩa là BQ phụ thuộc vào nhiều nhà cung cấp AI?**
MIABOS quản lý việc routing giữa các LLM — BQ chỉ làm việc với một platform duy nhất là MIABOS. Việc thêm/thay LLM là quyết định kỹ thuật nội bộ của MIABOS, không ảnh hưởng đến trải nghiệm người dùng BQ.
