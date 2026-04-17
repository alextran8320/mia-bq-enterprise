# Feature SRS: F-M09-AIC-005 Sales Bot Conversation Engine

**Status**: Draft
**Owner**: A03 BA Agent
**Last Updated By**: A01 PM Agent (Claude Sonnet 4.6 — Claude Code)
**Last Reviewed By**: A01 PM Agent
**Approval Required**: PM + Business Owner
**Approved By**: —
**Last Status Change**: 2026-04-17
**Source of Truth**: This document
**Blocking Reason**: Chờ Business Owner approve concept + F-M09-AIC-004 promote lên SRS Ready trước
**Module**: M09
**Phase**: PB-03
**Priority**: Critical
**Document Role**: SRS canonical cho Sales Bot — engine xử lý hội thoại tự động với khách hàng cuối theo concept Hybrid AI SDR Bot

> **Concept gốc**: Research document `04_Raw_Information/Market_Research/2026-04_AI_Chatbot_Vietnam/06_Sales_Chatbot_Concept_Research.md`
> **Concept được approve bởi Business Owner**: 2026-04-17
> **Phân biệt rõ với F-M09-AIC-001 (Internal AI Chat)**:
> - `F-M09-AIC-001`: Chatbot **nội bộ** cho nhân viên tra cứu knowledge
> - `F-M09-AIC-005` (file này): Sales Bot **customer-facing** tự động tư vấn và qualify khách hàng

---

## 0. Metadata

- Feature ID: `F-M09-AIC-005`
- Related PRD: `Planning/PRD/AI_Workspace/PRD-M09-AIC-005_Sales_Bot_Conversation_Engine.md` *(cần tạo)*
- Related User Story: `US-M09-AIC-005` *(cần tạo)*
- Related SRS liên kết: `F-M09-AIC-004` (Unified Inbox — consumer của bot output), `F-M09-AIC-003` (Escalation & Handoff), `F-M08-KNW-003` (FAQ & Policy Library — knowledge source)
- Related Screens: Không có UI agent trực tiếp. Output hiển thị trong `F-M09-AIC-004` Unified Inbox.
- Related APIs: `POST /bot/conversation/message`, `GET /bot/conversation/:id/state`, `POST /bot/conversation/:id/handoff`, `POST /bot/trigger/proactive`, `GET /bot/lead/:id/score`
- Related Tables: `mc_conversations`, `mc_messages`, `customers`, `bot_conversation_state`, `bot_lead_score`, `bot_trigger_log`
- Related Events: `bot.message.sent`, `bot.lead.qualified`, `bot.handoff.triggered`, `bot.trigger.fired`, `inbox.bot.toggled` *(subscribed từ F-M09-AIC-004)*
- Related Error IDs: `BOT-001`, `BOT-002`, `BOT-003`, `BOT-004`, `BOT-005`

## 0B. Integration Source Map

| Source System / Module | Data / Event Type | Usage In Bot Engine | Truth Level | Notes |
|------------------------|-------------------|---------------------|-------------|-------|
| `F-M09-AIC-004 Unified Inbox` | Inbound messages, bot toggle event | Nhận tin từ khách, nhận lệnh dừng từ agent | Primary consumer | Bot subscribe `inbox.bot.toggled` để dừng khi agent takeover |
| `F-M08-KNW-003 FAQ & Policy Library` | Product FAQ, chính sách, giá, khuyến mãi | RAG knowledge source cho trả lời câu hỏi tự do | Canonical knowledge source | Bot không được trả lời ngoài knowledge base mà không có warning |
| `customers collection (CRM)` | Customer profile, phone, email, tags, stage, history | Personalize greeting, check existing customer, cập nhật sau qualify | CRM source | Identity lookup trước khi bắt đầu flow |
| `product / product_category` | Tên sản phẩm, mô tả, SKU, giá niêm yết | Trả lời câu hỏi về sản phẩm cụ thể | Product catalog source | Sync từ Haravan/KiotViet qua integration layer |
| `promotions collection` | Chương trình khuyến mãi active | Trả lời câu hỏi về giá ưu đãi, CTKM | Promotion source | Chỉ expose CTKM đang active |
| `omni_channels collection` | Channel config, greeting template per channel | Điều chỉnh format message theo channel | Config source | Facebook/Zalo/Web có template khác nhau |
| `M07 Security / Access` | Guardrail rules, forbidden topics | Chặn bot trả lời ngoài scope | Gatekeeper | Bot không được commit giá, hợp đồng, policy ngoài KB |

---

## 1. User Story

### Customer-side
Là khách hàng nhắn tin vào Facebook page / Zalo OA / website của Giày BQ, tôi muốn nhận phản hồi ngay lập tức 24/7, được tư vấn đúng sản phẩm theo nhu cầu, và có thể kết nối với nhân viên thật khi tôi sẵn sàng mua hoặc cần giải đáp sâu hơn.

### Agent-side
Là CS/Sales Agent, tôi muốn bot tự xử lý các hội thoại phổ thông (FAQ, giá, tính năng sản phẩm) và chỉ alert tôi khi khách đã đủ điều kiện hoặc bot không xử lý được — để tôi tập trung vào các deal có giá trị cao.

---

## 1A. User Task Flow — Conversation Journey

| Step | Actor | Action | Task Type | Notes |
|------|-------|--------|-----------|-------|
| 1 | System / Bot | Nhận tin từ khách HOẶC trigger proactive khi khách xem sản phẩm > 30s | Quick Action | Entry — Reactive hoặc Proactive |
| 2 | Bot | Lookup customer trong CRM theo channel ID (Facebook PSID, Zalo UID, v.v.) | Quick Action | Identity resolution |
| 3 | Bot | Gửi greeting message — personalized nếu existing customer, generic nếu new | Quick Action | Personalized hello |
| 4 | Customer | Chọn intent qua quick reply buttons hoặc gõ tự do | Quick Action | Intent probe |
| 5 | Bot | Classify intent: `Product Inquiry` / `Pricing` / `Order Status` / `Complaint` / `Other` | Quick Action | Intent classification |
| 6 | Bot | Xử lý theo intent: trả lời FAQ (RAG) hoặc bắt đầu BANT-lite qualification flow | Quick Action | Branch logic |
| 7 | Bot | Hỏi qualification questions (progressive slot filling — 1 câu / 1 tin) | Quick Action | Qualification |
| 8 | System | Tính lead score sau mỗi câu trả lời của khách | Quick Action | Real-time scoring |
| 9 | Bot | Theo score: offer booking / gửi catalog / nurture / hoặc escalate | Quick Action | Route decision |
| 10 | System | Nếu hot lead: emit `bot.lead.qualified`, alert agent qua `F-M09-AIC-004` | Exception Handling | Human handoff trigger |
| 11 | Agent | Nhận notification, toggle bot OFF, tiếp quản | Quick Action | Human takes over |
| 12 | Bot | Khi nhận `inbox.bot.toggled = OFF`: dừng auto-reply trong conversation đó | Configuration | Graceful stop |

---

## 2. Business Context

Giày BQ nhận hàng trăm tin nhắn mỗi ngày qua Facebook và Zalo. Phần lớn là câu hỏi lặp lại: giá, mẫu, size, chính sách đổi trả. Nếu không có bot, agents phải trả lời thủ công từng câu → chậm, bỏ sót, không scale được. Tệ hơn, khách hỏi lúc 10 giờ tối không ai trả lời → mất deal.

Sales Bot giải quyết: 70–85% hội thoại được xử lý tự động 24/7, agents chỉ nhận notification khi khách đã qualified và sẵn sàng mua. Speed-to-lead < 5 phút cho hot lead → tăng tỷ lệ chuyển đổi lên đến 9x so với response sau 30 phút.

---

## 3. Preconditions

- `F-M09-AIC-004` (Unified Inbox) đã deploy và đang nhận messages từ ít nhất 1 channel.
- `F-M08-KNW-003` (FAQ & Policy Library) có tối thiểu 20 Q&A entries cho domain: giá, sản phẩm, chính sách đổi trả, bảo hành.
- `omni_channels` đã config greeting template và quick reply buttons cho từng channel.
- `customers` collection có index trên `channel_user_id` để lookup nhanh.
- Guardrail rules đã được define trong `M07`: bot không được commit giá chính xác khi chưa có promotion context, không được hứa delivery date.

---

## 4. Postconditions

- Mọi hội thoại bot tham gia đều được log vào `mc_messages` với `sender_type: bot`.
- Lead score sau mỗi conversation được ghi vào `bot_lead_score` và sync về `customers.stage`.
- Khi bot trigger handoff, agent nhận notification trong vòng 5 phút.
- Khi bot dừng (toggle OFF), bot không gửi thêm bất kỳ auto-reply nào trong conversation đó cho đến khi toggle ON.

---

## 5. Main Flow — Hybrid AI SDR Bot

### 5.1 Reactive Flow (Khách nhắn trước)

```
[1] Nhận tin nhắn đầu tiên từ khách
[2] Lookup CRM: existing customer? → load profile / new → create draft record
[3] Gửi greeting:
    - Existing: "Chào [Tên]! Mình là Mia, rất vui được gặp lại bạn. Hôm nay mình có thể giúp gì?"
    - New:      "Chào bạn! Mình là Mia, tư vấn viên AI của [Brand]. Bạn đang tìm gì hôm nay?"
[4] Gửi intent probe (quick reply buttons):
    [Tư vấn sản phẩm] [Xem giá / CTKM] [Đặt hàng] [Kiểm tra đơn hàng] [Vấn đề khác]
[5] Nhận intent response → classify → branch
```

### 5.2 Proactive Flow (Trigger tự động)

```
Trigger conditions (AND logic):
  - Khách đang active trên website / landing page
  - Time-on-page > 30 giây ĐỐI VỚI trang sản phẩm hoặc trang giá
  - Chưa gửi proactive message trong 48 giờ cho cùng visitor
  - Trong giờ hoạt động: 07:00–22:00 (GMT+7)

Proactive message:
  "Bạn đang xem [Tên sản phẩm]? Mình có thể tư vấn thêm về [điểm nổi bật] không?"
  [Tư vấn ngay] [Để lại số, mình gọi lại] [Không cảm ơn]
```

### 5.3 Intent Branch Logic

| Intent | Bot Action |
|--------|-----------|
| `Product Inquiry` | RAG lookup từ KB → trả lời kèm product detail card + suggest related |
| `Pricing / CTKM` | RAG lookup promotions active → trả lời kèm CTA booking hoặc catalog |
| `Order Status` | Lookup order theo phone/email nếu có → nếu không có → hỏi thông tin → lookup → hoặc escalate |
| `Complaint` | Escalate ngay với priority HIGH, không để bot xử lý |
| `Other / Unclear` | Hỏi lại 1 lần theo clarification template → nếu vẫn unclear → escalate |

### 5.4 BANT-lite Qualification Flow

Áp dụng sau khi intent = `Product Inquiry` hoặc `Pricing`, bot bắt đầu qualify **progressive** (1 câu / tin, không hỏi hết 1 lúc):

```
Slot 1 — Need (hỏi đầu tiên):
  "Bạn đang tìm sản phẩm cho mục đích gì? (ví dụ: đi làm, thể thao, dạo phố)"
  → Score: need_defined = +20

Slot 2 — Timeline (hỏi khi need đã có):
  "Bạn cần sản phẩm gấp hay đang tham khảo thêm?"
  [Cần trong tuần này] [Cần trong tháng này] [Đang tham khảo]
  → Score: timeline_urgent = +25 / timeline_month = +10 / browsing = +0

Slot 3 — Authority (hỏi khi timeline đã có):
  "Bạn mua cho bản thân hay làm quà tặng?"
  → Score: self_purchase = +15 / gift = +10

Slot 4 — Budget (hỏi muộn nhất, optional):
  "Bạn muốn tham khảo sản phẩm trong tầm giá nào?"
  [Dưới 500k] [500k–1 triệu] [Trên 1 triệu] [Linh hoạt]
  → Score: budget_high = +20 / budget_mid = +10 / budget_low = +5
```

### 5.5 Lead Scoring & Routing

| Tổng Score | Phân loại | Hành động của Bot |
|-----------|-----------|------------------|
| ≥ 60 | **Hot Lead** | Alert agent (< 5 phút), offer "Để mình kết nối bạn với tư vấn viên ngay" + book calendar |
| 30–59 | **Warm Lead** | Gửi catalog phù hợp + offer "Bạn có muốn để lại số để tư vấn viên liên hệ không?" |
| < 30 | **Cold Lead** | Gửi thêm thông tin + schedule re-engage sau 7 ngày |

---

## 6. Alternate Flows

- **Khách hỏi ngoài script (free text)**: Bot dùng RAG lookup `F-M08-KNW-003`. Nếu confidence < 0.7 → trả lời kèm disclaimer "Mình không chắc về câu này, để mình kết nối bạn với tư vấn viên nhé?" → escalate nếu khách đồng ý.
- **Khách yêu cầu gặp người thật bất kỳ lúc nào**: Escalate ngay, không hỏi thêm. Tin nhắn: "Được rồi! Mình sẽ kết nối bạn với tư vấn viên ngay. Vui lòng chờ mình một chút nhé."
- **Ngoài giờ hoạt động (22:00–07:00)**: Bot vẫn nhận tin và trả lời FAQ cơ bản, nhưng không trigger proactive. Hot lead → queue + notify agent sáng hôm sau + gửi tin cho khách: "Tư vấn viên sẽ liên hệ bạn vào sáng mai nhé!"
- **Conversation đã có agent takeover (bot = OFF)**: Bot im lặng hoàn toàn. Subscribe event `inbox.bot.toggled = OFF` → stop processing ngay.
- **Khách gửi ảnh / file**: Bot acknowledge và escalate: "Mình đã nhận ảnh của bạn! Để mình chuyển cho tư vấn viên xem và tư vấn chi tiết nhé."

---

## 7. Error Flows

- **RAG lookup fail / KB unavailable**: Bot không trả lời bừa. Gửi: "Hệ thống đang bận xíu, mình sẽ nhờ tư vấn viên hỗ trợ bạn nhé!" → escalate. Log `BOT-001`.
- **Intent classification fail (confidence < 0.5 sau 2 lần)**: Escalate. Log `BOT-002`.
- **Channel message send fail**: Retry 3 lần. Nếu vẫn fail → log `BOT-003`, flag cho agent qua Inbox.
- **Lead score calculation error**: Dùng default score = 0, tiếp tục flow nhưng log cảnh báo `BOT-004`.
- **CRM lookup timeout**: Tiếp tục với generic greeting (không personalized), log `BOT-005`. Không block conversation.

---

## 8. State Machine

```
Bot Conversation States:
  Idle → [Inbound message / Proactive trigger] → Active
  Active → [Intent classified] → Qualifying / FAQ Answering
  Qualifying → [Lead scored] → Hot Lead Handoff / Warm Nurture / Cold Hold
  FAQ Answering → [Question answered] → Follow-up Prompt / Idle
  Any Active State → [inbox.bot.toggled = OFF] → Suspended (silent)
  Suspended → [inbox.bot.toggled = ON] → Active (resume)
  Any → [Conversation Resolved] → Idle

Lead States:
  Unknown → Qualifying → Hot / Warm / Cold
  Hot → Handoff Triggered → Agent Assigned
  Warm → Nurture Sequence → Re-qualify after 7 days
  Cold → Hold → Re-engage after 7 days
```

---

## 9. UX / Screen Behavior (Bot Output Format)

Bot output phải tuân theo channel format:

| Channel | Text limit | Buttons | Rich media |
|---------|-----------|---------|-----------|
| Facebook Messenger | 2000 ký tự / bubble | Quick replies (≤ 13), buttons (≤ 3) | Image, carousel, template |
| Zalo OA | 2000 ký tự | Action buttons (≤ 5) | Image, file; không dùng carousel |
| Website Chat | Không giới hạn | Quick replies tự do | Image, file, card |

**Quy tắc viết script bot**:
- Mỗi tin nhắn bot = 1 ý duy nhất. Không nhồi nhiều câu hỏi vào 1 tin.
- Dùng emoji chừng mực: ✅ 😊 để thân thiện, không dùng trong context complain/escalate.
- Không bao giờ viết: "Tôi không biết", "Tôi không hiểu". Luôn có alternative path.
- Khi escalate: luôn cho khách biết thời gian chờ dự kiến và confirm là có người sẽ tiếp.

**Persona**:
```
Tên: Mia
Role: Tư vấn viên AI 24/7
3 traits: Thân thiện · Chuyên nghiệp · Nhanh nhẹn
Tone: Tiếng Việt tự nhiên, dùng "bạn" / "mình"
Forbidden: Không commit giá cụ thể khi chưa có promotion context
           Không cam kết delivery date
           Không nói xấu đối thủ
           Không xử lý khiếu nại — escalate ngay
```

---

## 10. Role / Permission Rules

- Bot không có "role" theo nghĩa agent. Bot hoạt động với permission của system account.
- Bot chỉ được đọc data từ: `F-M08-KNW-003`, `product`, `promotions`, `customers` (read-only profile fields).
- Bot không được write vào `customers` trực tiếp ngoài trường `bot_last_contact_at` và `bot_conversation_state`.
- Stage update (`Potential` → `Qualified`) chỉ được trigger qua event `bot.lead.qualified`, không phải bot tự write.
- Agent (qua `F-M09-AIC-004`) có thể override mọi bot decision bằng toggle OFF.

---

## 11. Business Rules

- Bot phải tự giới thiệu là AI trong lần tương tác đầu tiên của mỗi conversation.
- Proactive trigger không được fire quá 1 lần mỗi 48 giờ cho cùng 1 visitor/customer.
- Proactive trigger chỉ được fire trong giờ hoạt động: 07:00–22:00 (GMT+7).
- Bot không được hỏi quá 1 qualification question trong 1 tin nhắn.
- Khi khách yêu cầu gặp người thật (detect keywords: "người thật", "nhân viên", "tư vấn viên", "gặp người"), escalate ngay trong 1 bước, không hỏi thêm.
- Complaint keywords (detect: "tức", "thất vọng", "tệ", "sai", "lừa", "khiếu nại") → escalate với priority HIGH ngay.
- Bot không được retry clarification question quá 1 lần. Sau 1 lần hỏi lại mà vẫn unclear → escalate.
- Sau 30 phút không có response từ khách → conversation state = `Idle`, không gửi thêm tin.

---

## 12. API Contract Excerpt + Canonical Links

- `POST /bot/conversation/message`
  - Input: `conversation_id`, `channel`, `customer_id`, `inbound_message`, `current_state`
  - Output: `{outbound_messages[], new_state, lead_score_delta, handoff_triggered}`

- `GET /bot/conversation/:id/state`
  - Output: `{conversation_id, current_state, qualification_slots_filled, lead_score, last_intent}`

- `POST /bot/conversation/:id/handoff`
  - Input: `reason` (hot_lead|user_requested|bot_fail|complaint), `priority` (high|normal)
  - Output: `{handoff_id, estimated_wait_seconds}`
  - Side effect: emit `bot.handoff.triggered`, notify agent via `F-M09-AIC-004`

- `POST /bot/trigger/proactive`
  - Input: `visitor_id`, `page_url`, `time_on_page_seconds`, `channel`
  - Output: `{triggered: boolean, reason}` — engine tự validate pacing rules

- `GET /bot/lead/:id/score`
  - Output: `{customer_id, score, classification, slots_filled, recommended_action}`

- Canonical links:
  - Reads from `F-M08-KNW-003` (FAQ/knowledge RAG)
  - Reads from `product`, `promotions` (catalog context)
  - Reads/writes to `bot_conversation_state`, `bot_lead_score`
  - Emits to `F-M09-AIC-004` (inbox notification), `F-M09-AIC-003` (escalation), `F-M12-OBS-001` (analytics)
  - Subscribes `inbox.bot.toggled` from `F-M09-AIC-004`

---

## 13. Event / Webhook Contract Excerpt

- `bot.message.sent`: Phát sau mỗi tin bot gửi thành công ra channel. Payload: `{conversation_id, message_id, channel, intent, state}`.
- `bot.lead.qualified`: Phát khi lead score đạt ngưỡng Hot (≥ 60). Payload: `{customer_id, score, qualification_data, recommended_action}`.
- `bot.handoff.triggered`: Phát khi bot trigger handoff. Payload: `{conversation_id, reason, priority, context_package}`.
- `bot.trigger.fired`: Phát khi proactive trigger được fire. Payload: `{visitor_id, channel, page_url, trigger_type}`.
- `inbox.bot.toggled` *(subscribed)*: Bot consume event này để biết khi nào dừng.

---

## 14. Data / DB Impact Excerpt

- `bot_conversation_state` *(new collection)*
  - `id`, `conversation_id`, `current_state`, `qualification_slots` (JSON), `lead_score`, `last_intent`, `last_active_at`, `bot_active`

- `bot_lead_score` *(new collection)*
  - `id`, `customer_id`, `conversation_id`, `score`, `classification`, `slots_filled` (JSON), `scored_at`

- `bot_trigger_log` *(new collection)*
  - `id`, `visitor_id`, `channel`, `trigger_type`, `fired_at`, `outcome`

- `mc_messages` *(existing — thêm fields)*
  - `sender_type: bot` — phân biệt với agent/customer
  - `bot_intent`: intent được classify cho tin này
  - `bot_state_snapshot`: state tại thời điểm gửi tin

- `customers` *(existing — thêm fields)*
  - `bot_last_contact_at`, `bot_lead_score`, `bot_classification` (hot|warm|cold)

---

## 15. Validation Rules

- Bot không được gửi message nếu `bot_active = false` trong `bot_conversation_state`.
- Proactive trigger phải validate pacing rules trước khi fire (48h window, giờ hoạt động).
- Lead score phải trong range [0, 100]. Score ngoài range → clamp và log warning.
- Handoff package phải include conversation transcript, lead score, và qualification slots. Thiếu bất kỳ field nào → log error, vẫn handoff nhưng flag incomplete.
- Bot không được write field nhạy cảm vào `customers` (không write phone, email, payment info từ conversation — chỉ update qua CRM proper flow).

---

## 16. Error Codes

- `BOT-001`: RAG/knowledge base lookup failed — escalate, log.
- `BOT-002`: Intent classification failed after 2 attempts — escalate, log.
- `BOT-003`: Channel message send failed after 3 retries — flag manual, log.
- `BOT-004`: Lead score calculation error — use default 0, continue, log warning.
- `BOT-005`: CRM lookup timeout — continue with generic, log warning.

---

## 17. Non-Functional Requirements

- Bot phải respond trong `<= 3 giây` end-to-end (từ khi nhận tin đến khi message được gửi lên channel API) cho 95% messages.
- RAG lookup phải complete trong `<= 1.5 giây` để đảm bảo tổng response < 3 giây.
- Bot phải xử lý được tối thiểu `500 concurrent conversations` mà không degraded latency.
- Proactive trigger evaluation phải xảy ra trong `<= 500ms` sau khi điều kiện trigger được detect.
- `bot_conversation_state` phải được persist với durability cao — không mất state khi bot restart.
- Bot uptime: `99.5%`. Khi bot down, fallback = auto-escalate toàn bộ conversations sang agent queue.

---

## 18. Acceptance Criteria

- Khách nhắn vào Zalo OA lúc 10 giờ tối → Bot trả lời trong vòng 3 giây với greeting + intent probe buttons.
- Khách chọn "Tư vấn sản phẩm" → Bot hỏi Need, sau đó Timeline, sau đó Authority theo đúng thứ tự slot filling (không hỏi Budget đầu tiên).
- Khách đạt score ≥ 60 → Bot offer kết nối tư vấn viên + agent nhận alert trong Unified Inbox trong vòng 5 phút.
- Khách gõ "cho mình gặp nhân viên" → Bot escalate ngay, không hỏi thêm bất kỳ câu nào.
- Agent toggle bot OFF trong Inbox → Bot dừng reply ngay trong conversation đó (< 2 giây).
- Khách gửi câu hỏi ngoài scope KB (confidence < 0.7) → Bot không hallucinate, disclaimer và offer escalate.
- Proactive trigger fire đúng: chỉ fire 1 lần trong 48 giờ, chỉ trong giờ 07:00–22:00.
- Complaint keyword detect → Bot escalate với priority HIGH ngay lập tức.

---

## 19. Test Scenarios

- Khách mới nhắn "Giày của shop có mẫu nào đẹp không?" → Bot classify `Product Inquiry`, RAG lookup, trả lời kèm catalog card.
- Khách hỏi "Giá bao nhiêu?" → Bot tham khảo promotions active, trả lời đúng CTKM, không commit sai giá.
- Conversation đầy đủ BANT-lite: Need → Timeline (urgent) → Authority (self purchase) → Score = 60 → Bot offer handoff.
- Khách gõ "tức lắm rồi, hàng kém quá" → Bot detect complaint → escalate HIGH priority ngay.
- Bot đang active → Agent toggle OFF → Khách gửi thêm tin → Bot không reply.
- Proactive trigger test: Visitor ở trang /san-pham/giay-abc 35 giây → Trigger fires đúng message.
- Ngoài giờ (23:00): Khách nhắn → Bot trả lời FAQ cơ bản + thông báo tư vấn viên sẽ liên hệ sáng mai.

---

## 20. Observability

- `bot_response_time_p95`: Thời gian bot respond từ inbound → outbound message.
- `bot_containment_rate`: % conversations bot xử lý hoàn toàn (không escalate).
- `bot_handoff_rate`: % conversations bot trigger handoff.
- `bot_fallback_rate`: % messages bot không classify được intent.
- `lead_qualification_rate`: % conversations hoàn thành ít nhất 2 BANT slots.
- `hot_lead_rate`: % conversations đạt score ≥ 60.
- `proactive_trigger_engagement_rate`: % proactive messages nhận được response từ khách.
- `complaint_escalation_p100`: 100% complaint keywords phải trigger escalation — không có exception.

---

## 21. Open Questions

- [ ] Script approval: Greeting templates và BANT-lite scripts cần Business Owner approve trước khi deploy.
- [ ] Knowledge base scope: Bao nhiêu Q&A entries là đủ để bot containment rate ≥ 70% ở launch?
- [ ] Calendar booking: Phase 1 có integrate Google Calendar / Calendly cho hot lead booking không?
- [ ] Re-engagement: Warm lead re-engage sau 7 ngày bằng kênh nào (Zalo ZNS? Facebook broadcast?) — cần confirm theo policy Meta/Zalo.
- [ ] Multi-language: Phase 1 chỉ tiếng Việt. English support nếu khách nhắn tiếng Anh?
