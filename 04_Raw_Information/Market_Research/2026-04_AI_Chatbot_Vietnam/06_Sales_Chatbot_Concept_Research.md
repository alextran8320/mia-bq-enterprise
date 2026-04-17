# Research: Sales Chatbot Concept & Best Practices
**Folder**: `04_Raw_Information/Market_Research/2026-04_AI_Chatbot_Vietnam/`
**File**: `06_Sales_Chatbot_Concept_Research.md`
**Ngày**: 2026-04-17
**Nguồn**: Tavily Deep Research (pro model) + Tavily Search
**Thực hiện bởi**: A01 PM Agent / Claude Sonnet 4.6 — Claude Code session
**Trạng thái**: Draft — Chờ Business Owner review

---

## Mục lục

1. [Định nghĩa & Phân loại Chatbot Bán Hàng](#1-định-nghĩa--phân-loại)
2. [Các Concept Chính (Archetype)](#2-các-concept-chính-archetype)
3. [Conversation Design Best Practices](#3-conversation-design-best-practices)
4. [Lead Qualification Frameworks](#4-lead-qualification-frameworks)
5. [Proactive vs Reactive Engagement](#5-proactive-vs-reactive-engagement)
6. [Human Handoff Protocols](#6-human-handoff-protocols)
7. [Persona & Tone Design](#7-persona--tone-design)
8. [Omnichannel Architecture](#8-omnichannel-architecture)
9. [Technical Stack & AI Architecture](#9-technical-stack--ai-architecture)
10. [KPIs & Benchmarks](#10-kpis--benchmarks)
11. [Nhận xét về Chatbot POC Hiện Tại](#11-nhận-xét-về-chatbot-poc-hiện-tại)
12. [Concept Đề Xuất cho MIABOS](#12-concept-đề-xuất-cho-miabos)
13. [Nguồn Tham Khảo](#13-nguồn-tham-khảo)

---

## 1. Định nghĩa & Phân loại

### Sales Chatbot là gì?

> **AI Sales Chatbot** = Một trợ lý AI hoạt động 24/7 thay thế (hoặc hỗ trợ) Sales Development Representative (SDR), với nhiệm vụ: chủ động hoặc phản ứng với khách hàng, thu thập thông tin đủ điều kiện (lead qualification), và bàn giao liền mạch cho nhân viên thật khi cần — trên mọi kênh mà khách hàng đang dùng.

**Nguồn**: Zendesk (2026), Salesforce (2026), Qualimero (2025)

### Phân loại theo khả năng

| Loại | Logic | Khả năng | Hạn chế |
|------|-------|----------|---------|
| **Rule-Based Bot** | If/Then, keyword matching | Dự đoán được, nhanh, rẻ | Cứng nhắc, fail với câu phức tạp |
| **AI-Powered Bot** | NLP + Intent recognition | Hiểu ngữ cảnh, học từ dữ liệu | Chi phí cao hơn, cần training |
| **Hybrid Bot** | Rule-based core + AI backstop | Tốt nhất cả hai | Phức tạp hơn khi design |

**Ghi chú thực tiễn**: Với SME Việt Nam, **Hybrid** là lựa chọn tối ưu — dùng rule-based cho qualification flow (có thể kiểm soát), AI để trả lời FAQ và câu hỏi tự do.

---

## 2. Các Concept Chính (Archetype)

### Archetype 1 — Reactive FAQ + Qualify Bot

- **Mô tả**: Chỉ phản ứng khi khách hỏi. Trả lời câu hỏi thường gặp, sau đó dần thu thập thông tin qualification.
- **Phù hợp**: Website chat, Zalo OA dạng inbound
- **Ví dụ thực tế**: Intercom Fin, HubSpot Chatbot Builder
- **Điểm yếu**: Bỏ lỡ cơ hội chuyển đổi khi khách lướt nhưng không nhắn

### Archetype 2 — Proactive Sales Trigger Bot

- **Mô tả**: Chủ động nhắn tin khi khách thực hiện hành vi cụ thể (xem trang giá > 30 giây, xem sản phẩm lần 2, v.v.)
- **Phù hợp**: Website, Facebook Messenger, Email retargeting
- **Ví dụ thực tế**: Drift, Qualified.com, Warmly
- **Trigger mẫu**: "Khách xem trang /pricing 2 lần trong 24 giờ → bot gửi tin proactive"
- **Điểm yếu**: Cần targeting tốt, dễ bị coi là spam nếu không đúng lúc

### Archetype 3 — AI SDR Agent (Full Funnel)

- **Mô tả**: Bot đóng vai SDR đầy đủ — hỏi đúng câu đúng lúc, chấm điểm lead, tự book lịch tư vấn, nurture lead lạnh
- **Phù hợp**: B2B, deal giá trị cao, doanh nghiệp có đội sales
- **Ví dụ thực tế**: Conversica, Qualified Enterprise
- **Điểm yếu**: Chi phí cao, thời gian setup lâu

### ✅ Archetype Đề Xuất cho MIABOS — Hybrid SDR Bot

Kết hợp:
- **Proactive trigger** (khi khách xem sản phẩm/giá)
- **Reactive qualify** (BANT-lite khi khách nhắn trước)
- **Human handoff** khi lead đủ điều kiện hoặc câu hỏi phức tạp

---

## 3. Conversation Design Best Practices

### 3.1 Các Pattern Thiết Kế Đã Được Chứng Minh

**Pattern 1 — Slot Filling (Progressive)**
- Thu thập thông tin qualification từng bước một, không hỏi tất cả cùng lúc
- Giảm drop-off đáng kể so với form tĩnh
- Mỗi câu chỉ hỏi 1 thông tin chưa biết

**Pattern 2 — Parameter Chain**
- Luôn check xem thông tin đã có chưa (từ CRM, session trước) trước khi hỏi
- Tránh hỏi lại điều khách đã cung cấp → cải thiện UX đáng kể

**Pattern 3 — Decision Tree với Quick Reply Buttons**
- Dùng nút bấm cho các lựa chọn phổ biến (thay vì bắt khách gõ)
- Giảm ma sát, tăng tốc độ conversation
- Đặc biệt quan trọng trên mobile (Zalo, Facebook)

**Pattern 4 — RAG cho FAQ**
- Kết nối với Knowledge Base (Directus) để trả lời câu hỏi tự do
- RAG phù hợp khi knowledge base thay đổi thường xuyên (giá, chính sách)
- Giảm hallucination 42–68% so với LLM không có RAG

### 3.2 Nguyên Tắc Viết Script

- Dùng ngôn ngữ tự nhiên, tránh robot-speak
- Câu ngắn, active voice
- Không hỏi nhiều hơn 1 câu trong 1 tin nhắn
- Luôn cung cấp "lối thoát" — cho phép khách gặp người thật bất cứ lúc nào
- Chỉ hỏi survey/feedback SAU khi task đã hoàn thành

---

## 4. Lead Qualification Frameworks

### 4.1 BANT Framework (Budget, Authority, Need, Timeline)

Phù hợp nhất với SME và B2B giao dịch nhỏ/trung.

```
B — Budget:    "Ngân sách của bạn khoảng bao nhiêu cho [sản phẩm]?"
A — Authority: "Bạn là người quyết định mua hàng không?"
N — Need:      "Bạn đang cần giải quyết vấn đề gì cụ thể?"
T — Timeline:  "Bạn dự kiến sử dụng khi nào?"
```

**Scoring mẫu** (từ research):
- Decision maker = +15 điểm
- Timeline < 30 ngày = +25 điểm
- Budget đã confirm = +20 điểm
- Score ≥ ngưỡng → route đến nhân viên
- Score < ngưỡng → vào nurture sequence

### 4.2 BANT-Lite cho Thị Trường Việt Nam (SME)

Không phải SME Việt Nam nào cũng trả lời thẳng về ngân sách. Đề xuất điều chỉnh:

```
Step 1 — Intent:    "Bạn muốn tìm hiểu về [A], [B], hay [C]?" (nút bấm)
Step 2 — Need:      "Hiện tại bạn đang gặp khó khăn gì với [lĩnh vực]?"
Step 3 — Timeline:  "Bạn cần giải quyết gấp hay đang tìm hiểu thêm?"
Step 4 — Authority: "Bạn có thể quyết định ngay hay cần tham khảo thêm?"
Step 5 — Budget:    (Hỏi muộn, khi lead đã warm) "Bạn muốn tư vấn gói nào?"
```

### 4.3 Required vs Progressive Profiling

| Loại thông tin | Khi nào hỏi |
|----------------|-------------|
| Intent (họ muốn gì) | Ngay đầu |
| Need (vấn đề của họ) | Sớm |
| Timeline | Sớm |
| Authority | Khi đã warm |
| Budget | Muộn nhất |
| Chi tiết kỹ thuật | Chỉ khi cần thiết |

---

## 5. Proactive vs Reactive Engagement

### 5.1 Proactive Triggers (Khi nào chủ động nhắn)

| Trigger | Điều kiện | Hành động |
|---------|-----------|-----------|
| Page time trigger | Xem trang sản phẩm > 30 giây | Gửi tin chào + offer tư vấn |
| Repeat visit trigger | Xem trang giá lần 2 trong 24h | Gửi offer cụ thể hơn |
| Form abandon trigger | Điền form dở dang | Nhắc nhở nhẹ |
| Re-engagement trigger | Không tương tác > 7 ngày | Gửi nội dung giá trị |
| Cart/inquiry abandon | Xem sản phẩm nhưng không hỏi | Offer tư vấn miễn phí |

### 5.2 Pacing Rules (Tránh spam)

- Không nhắn quá 1 tin proactive mỗi 48 giờ cho 1 khách
- Luôn có nút "Không cảm ơn / Nhắn lại sau"
- Giờ hoạt động: 7:00–22:00 (Vietnam timezone)
- Sau giờ hoạt động: enqueue → gửi khi sáng hôm sau

### 5.3 Guardrails (Bảo vệ)

- Bot phải tự giới thiệu là AI ở đầu cuộc hội thoại
- Không hứa hẹn điều ngoài phạm vi được phép
- Escalate ngay khi: khiếu nại, vấn đề pháp lý, yêu cầu hoàn tiền
- Log tất cả conversation để review hàng tuần

---

## 6. Human Handoff Protocols

### 6.1 Khi Nào Chuyển Sang Người Thật

| Trigger Handoff | Hành động |
|----------------|-----------|
| Khách yêu cầu gặp người thật | Chuyển ngay + thông báo thời gian chờ |
| Lead score đủ điều kiện (hot lead) | Alert nhân viên trong 5 phút |
| Bot không trả lời được (fallback 2 lần) | Chuyển + xin lỗi |
| Khiếu nại / cảm xúc tiêu cực | Chuyển ngay, ưu tiên cao |
| Câu hỏi về pháp lý / hợp đồng | Chuyển và log |

### 6.2 Handoff Context Package (Phải gửi đủ)

```
Khi chuyển sang nhân viên, bot phải đính kèm:
├── Full conversation transcript
├── Lead score + lý do
├── Thông tin đã thu thập (tên, nhu cầu, timeline, v.v.)
├── Channel nguồn (Facebook / Zalo / Web)
├── Sentiment tag (tích cực / trung lập / tiêu cực)
└── Đề xuất bước tiếp theo
```

### 6.3 SLA Handoff

- **Hot lead**: Thông báo nhân viên trong **< 5 phút** (tỷ lệ chuyển đổi tăng 9x khi response < 5 phút)
- **Warm lead**: Trong vòng 1 giờ
- **Ngoài giờ làm việc**: Enqueue + gửi email/SMS cho nhân viên

---

## 7. Persona & Tone Design

### 7.1 Template Persona

```
Tên bot:     Mia (gợi ý — phù hợp brand MIA Solution)
Vai trò:     Tư vấn viên AI 24/7
3 traits:    Thân thiện · Chuyên nghiệp · Nhanh nhẹn
Tone:        Ngắn gọn, tiếng Việt tự nhiên, tránh robot-speak
             Thân mật nhưng lịch sự (dùng "bạn" / "mình")
Scope:       Tư vấn sản phẩm, giá, chính sách → escalate khi phức tạp
Forbidden:   Không hứa giá chắc chắn nếu chưa confirm
             Không nói xấu đối thủ
             Không cam kết thời gian delivery nếu không chắc
```

### 7.2 Archetype Tone theo Context

| Context | Tone |
|---------|------|
| Lần đầu chào hỏi | Thân thiện, nhẹ nhàng |
| Đang qualify | Tập trung, câu hỏi rõ ràng |
| Khách đang phân vân | Empathetic, hỗ trợ |
| Khách khiếu nại | Apologetic, chuyển người ngay |
| Đặt hàng thành công | Vui vẻ, confirm rõ ràng |

---

## 8. Omnichannel Architecture

### 8.1 Multichannel vs Omnichannel — Sự Khác Biệt Quan Trọng

| Tiêu chí | Multichannel | Omnichannel |
|----------|-------------|-------------|
| Channels | Có mặt ở nhiều nơi | Có mặt ở nhiều nơi |
| Conversation history | **Riêng lẻ từng channel** | **Unified — 1 history per customer** |
| Context khi chuyển kênh | Mất context | Giữ nguyên context |
| Dashboard | Nhiều tab/tool | 1 unified inbox |
| Customer experience | Phải lặp lại thông tin | Liền mạch |

> 56% khách hàng cảm thấy thất vọng khi phải lặp lại thông tin khi chuyển kênh.
> Doanh nghiệp có omnichannel tốt giữ được 89% khách hàng vs 33% với multichannel yếu.

### 8.2 Unified Inbox Model (Tham chiếu ảnh Business Owner cung cấp)

```
┌─────────────────────────────────────────────────────────┐
│  CHANNEL SELECTOR (Left sidebar)                        │
│  [FB] [Zalo] [IG] [Web] [SMS] ...                       │
├─────────────────────────────────────────────────────────┤
│  CONVERSATION LIST (Center-left)                        │
│  ┌──────────────────────────────┐                       │
│  │ 🟢 Fatima Del...   8 min    │ ← Đang chờ            │
│  │ 🟡 Guest User      17 min   │ ← Bot đang xử lý     │
│  │ ⚪ Anchit Sama...  1 hr     │ ← Đã resolve          │
│  └──────────────────────────────┘                       │
├────────────────────────────┬────────────────────────────┤
│  CHAT WINDOW (Main)        │  CUSTOMER PANEL (Right)    │
│                            │                            │
│  [Bot message - vàng]      │  Tên: Fatima Del Mundo     │
│  "Responded by AI Chatbot" │  Status: Potential         │
│                            │  Channel: Facebook         │
│  [Customer message]        │  Tags: hot-lead            │
│                            │                            │
│  [Human message - xanh]    │  CUSTOMER DETAILS ▼        │
│  "Agent Sarah"             │  📍 Location               │
│                            │  📞 Phone                  │
│  Toggle: [Chatbot Active]  │  📧 Email                  │
│          ← ON/OFF          │                            │
│                            │  ATTACHMENTS (0) →         │
│  [Type a message...]       │                            │
└────────────────────────────┴────────────────────────────┘
```

### 8.3 Architecture Kỹ Thuật

```
CHANNELS
  ├── Facebook Messenger API (Graph API v21+)
  ├── Zalo Official Account API (Zalo OA Webhook)
  ├── Instagram Messaging API (Meta Business)
  ├── Website Chat Widget (WebSocket)
  └── (Future) WhatsApp Business API, SMS, Email

      ↓ tất cả đổ vào

CHANNEL GATEWAY / ROUTER
  ├── Normalize message format (text, image, button, template)
  ├── Identity linking (match customer across channels)
  └── Route to conversation engine

      ↓

CONVERSATION ENGINE
  ├── Intent Classification (NLP)
  ├── State Management (session, history)
  ├── Lead Scoring Logic
  └── Handoff Decision Engine

      ↓ query

KNOWLEDGE BASE (RAG)
  ├── Product catalog (Directus)
  ├── FAQ / Policy
  ├── Pricing
  └── Promotions

      ↓ store

CRM / DIRECTUS
  ├── customers collection
  ├── conversations collection
  ├── mc_conversations / mc_messages
  └── Lead score, tags, history

      ↓ display

UNIFIED INBOX (Frontend)
  ├── Agent dashboard
  ├── Bot-to-human toggle
  ├── Real-time notifications
  └── Customer detail panel
```

### 8.4 Channel-Specific Considerations

| Channel | Đặc điểm UX | Điều chỉnh cần thiết |
|---------|-------------|---------------------|
| **Facebook Messenger** | Rich media, persistent menu, quick replies | Dùng button templates, carousel cho sản phẩm |
| **Zalo OA** | Phổ biến nhất Việt Nam, ZNS notifications | Follow Zalo template rules, OA verification |
| **Instagram DM** | Trẻ hơn, visual-first | Ưu tiên ảnh sản phẩm, story mentions |
| **Website Chat** | Full control, desktop + mobile | Proactive triggers mạnh nhất ở đây |

### 8.5 Implementation Order (Đề xuất)

> "Không launch tất cả channel cùng lúc. Master 1 channel trước, thêm 1 channel mỗi 2–4 tuần."
> — Conferbot Omnichannel Guide (2026)

```
Phase 1: Website Chat Widget (nền tảng, kiểm soát tốt nhất)
Phase 2: Zalo OA (kênh phổ biến nhất cho SME Việt Nam)
Phase 3: Facebook Messenger
Phase 4: Instagram DM
Phase 5: WhatsApp Business (nếu cần)
```

---

## 9. Technical Stack & AI Architecture

### 9.1 RAG vs Fine-tuning

| Tiêu chí | RAG | Fine-tuning |
|----------|-----|-------------|
| Chi phí ban đầu | Thấp | Cao |
| Update knowledge | Realtime (không cần retrain) | Cần retrain khi update |
| Hallucination | Giảm 42–68% | Phụ thuộc training data |
| Phù hợp khi | Knowledge thay đổi thường xuyên | Tone/domain ổn định |
| **Kết luận** | **✅ Dùng cho MIABOS** | Cân nhắc sau Phase 1 |

**Lý do chọn RAG cho MIABOS**: Giá sản phẩm, chính sách, khuyến mãi của Giày BQ thay đổi thường xuyên → RAG từ Directus CMS là phù hợp nhất.

### 9.2 Latency Targets

| Metric | Target |
|--------|--------|
| Time-to-first-token (chat) | < 500ms |
| End-to-end response | < 2 giây |
| Abandonment rate | Tăng ~7% mỗi giây delay |

### 9.3 Model Tiering (Tiết kiệm chi phí)

```
Simple queries (FAQ, giá, địa chỉ)  → Rule-based / Lightweight model
Complex queries (tư vấn chuyên sâu) → LLM + RAG (Claude Haiku / GPT-4o-mini)
Escalation decision                  → Rule-based scoring
```

---

## 10. KPIs & Benchmarks

### 10.1 KPIs Cốt Lõi

| KPI | Định nghĩa | Benchmark tốt |
|-----|-----------|--------------|
| **Containment Rate** | % cuộc hội thoại bot tự xử lý hoàn toàn | 70–85% |
| **Handoff Rate** | % escalate sang người thật | < 25% |
| **CSAT** | Điểm hài lòng khách hàng | > 80% |
| **Fallback Rate** | % bot không trả lời được | < 10% |
| **Speed-to-Lead** | Thời gian kết nối hot lead → nhân viên | < 5 phút |
| **MQL → SQL Rate** | % lead qualified chuyển thành sales opportunity | 20–35% |
| **Conversation → Opportunity** | % cuộc chat tạo ra qualified opportunity | 5–15% |
| **Average Handling Time** | Thời gian xử lý trung bình (bot) | 2–5 phút |

### 10.2 Speed-to-Lead Impact (Dữ liệu quan trọng)

| Thời gian response | Tỷ lệ chuyển đổi |
|-------------------|-----------------|
| < 5 phút | **Cao nhất** |
| < 1 giờ | 53% khả năng chuyển đổi |
| > 24 giờ | 17% khả năng chuyển đổi |

> Phản hồi trong 5 phút đầu cải thiện tỷ lệ chuyển đổi lên đến 900% so với phản hồi sau 30 phút.

### 10.3 Governance Cadence

| Tần suất | Việc cần làm |
|----------|-------------|
| Hàng tuần | Sample transcript, kiểm tra intent accuracy |
| Hàng tháng | Review persona, cập nhật script |
| Hàng quý | Retrain/refresh policy, A/B test flow mới |

---

## 11. Nhận Xét về Chatbot POC Hiện Tại

### Các Vấn Đề Được Xác Định

| Vấn đề | Mức độ | Chi tiết |
|--------|--------|---------|
| Không có concept rõ ràng | 🔴 Critical | Bot không xác định được: FAQ bot, sales bot hay support bot? |
| Không có qualification flow | 🔴 Critical | Không có BANT hay bất kỳ framework qualification nào |
| Thiếu proactive trigger | 🟡 Major | Chỉ reactive, bỏ lỡ cơ hội chuyển đổi |
| Không có human handoff | 🔴 Critical | Không có cơ chế chuyển sang nhân viên thật |
| Không có omnichannel | 🔴 Critical | Widget độc lập, không kết nối Facebook/Zalo/Instagram |
| Không có lead scoring | 🟡 Major | Không phân loại hot/warm/cold lead |
| Không có persona định nghĩa | 🟠 Moderate | Tone và identity chưa nhất quán |
| Không có KPI tracking | 🟠 Moderate | Không đo lường được hiệu quả |

### Kết Luận

Chatbot POC hiện tại **bị lỗi ngay từ gốc conceptual** — thiết kế không dựa trên research và best practice. Cần viết lại hoàn toàn từ concept → SRS → UXUI Spec → Implementation.

---

## 12. Concept Đề Xuất cho MIABOS

### 12.1 Tên Concept

**"MIA Smart — Hybrid AI Sales Consultation Bot"**

### 12.2 Core Concept

```
Proactive Trigger
      +
Reactive BANT-lite Qualification
      +
RAG Knowledge Base (Directus)
      +
Seamless Human Handoff
      +
Unified Omnichannel Inbox
```

### 12.3 Conversation Flow Đề Xuất

```
[TRIGGER]
├── Proactive: Khách xem sản phẩm/giá > 30s
└── Reactive: Khách nhắn tin trước

    ↓

[CHÀO HỎI — Personalized]
"Chào [Tên nếu biết]! Mình là Mia, tư vấn viên AI của [Brand].
Bạn đang tìm hiểu về [sản phẩm X]? Mình có thể giúp gì?"

    ↓

[INTENT PROBE — Quick Buttons]
[Tư vấn sản phẩm] [Xem giá] [Đặt hàng] [Vấn đề khác]

    ↓

[QUALIFICATION — Progressive Slot Filling]
Step 1: Need   — "Bạn đang cần giải quyết vấn đề gì?"
Step 2: Timeline — "Bạn cần gấp hay đang tìm hiểu thêm?"
Step 3: Authority — (khi đã warm) "Bạn quyết định được ngay không?"
Step 4: Budget — (muộn nhất) "Bạn muốn tư vấn gói nào?"

    ↓

[LEAD SCORING]
Score ≥ 60 (hot)  → Alert nhân viên, book lịch tư vấn
Score 30–59 (warm) → Gửi catalog + nurture sequence
Score < 30 (cold)  → FAQ + re-engage sau 7 ngày

    ↓

[HUMAN HANDOFF khi trigger]
├── Khách yêu cầu gặp người thật
├── Bot không hiểu 2 lần liên tiếp
├── Lead score = hot
└── Nội dung nhạy cảm (khiếu nại, pháp lý)

Handoff package: transcript + score + thông tin thu thập được
```

### 12.4 Roadmap Implement

| Phase | Nội dung | Ưu tiên |
|-------|---------|---------|
| **Phase 1** | Viết lại SRS + UXUI Spec theo concept mới | 🔴 Ngay |
| **Phase 2** | Implement Unified Inbox UI (theo ảnh BO cung cấp) | 🔴 Ngay |
| **Phase 3** | Build conversation engine + BANT-lite flow | 🟡 Sau Phase 2 |
| **Phase 4** | Kết nối Website Chat Widget (kênh đầu tiên) | 🟡 Sau Phase 3 |
| **Phase 5** | Kết nối Zalo OA | 🟠 Phase tiếp theo |
| **Phase 6** | Kết nối Facebook Messenger + Instagram | 🟠 Phase tiếp theo |
| **Phase 7** | Lead scoring + CRM sync + analytics | 🟢 Phase sau |

---

## 13. Nguồn Tham Khảo

### Nguồn Primary (Tavily Research — Pro Model, 2026-04-17)

| # | Nguồn | Nội dung |
|---|-------|---------|
| 1 | Zendesk — AI Chatbot for Sales (2026) | Định nghĩa, archetype, platform comparison |
| 2 | Salesforce — Best AI Sales Chatbots (2026) | Qualification flow, guardrails |
| 3 | Nextiva — Chatbots for Lead Generation | BANT flow, speed-to-lead stats |
| 4 | Conferbot — Omnichannel Chatbot Guide (2026) | Unified inbox, channel strategy |
| 5 | QuickReply.ai — Omnichannel Inbox | Bot-to-human handoff mechanics |
| 6 | Trengo — Omnichannel Marketing Strategy | Unified inbox, channel sync |
| 7 | Qualimero — AI Chatbots in 2025 | Rule-based vs AI comparison |
| 8 | Prospeo — AI Chatbot Lead Generation Playbook | BANT scoring formula |
| 9 | Chatbot.com — Lead Qualification | Slot filling, progressive profiling |
| 10 | thewickfirm.com — Omnichannel Integration | Context preservation, 56% frustration stat |
| 11 | NNGroup — Chatbots | Proactive/reactive balance |
| 12 | ChatMetrics — B2B Live Chat Response | Speed-to-lead conversion stats |
| 13 | Conversica | B2B SDR bot case studies |
| 14 | Drift / Intercom | Playbook-based sales chatbot patterns |
| 15 | Qualified.com | ABM-first SDR agent approach |

### Nguồn Secondary (Từ Tavily Research Pro — đầy đủ citations)

Xem thêm tại citations [1]–[42] trong Research Report gốc (session 2026-04-17).

---

*File này là Research Document — không phải SRS hay UXUI Spec.*
*Bước tiếp theo: Viết UXUI Spec cho Unified Inbox Chat Interface (A06 lead).*
*Sau đó: Viết lại SRS Chatbot Engine theo concept này (A03 lead).*
