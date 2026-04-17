# RES-M08-KNW — Internal Chatbot: UX Patterns & Information Architecture

| Field | Value |
|-------|-------|
| Module | Knowledge Center |
| Research Type | UX Design Research |
| Author | A01 PM Agent (Claude Sonnet 4.6 — Claude Code CLI, w/ A06 UX input) |
| Date | 2026-04-17 |
| Status | **Approved — Business Owner approved 2026-04-17** |
| Sources | Impulse Lab UX Guide, OrangeLoops UX Patterns, NeuronUX Conversational AI, Workgrid 2024 Guide |

---

## 1. Nguyên tắc cốt lõi UX cho Internal AI Chatbot

### Nguyên tắc 1: Kiến trúc tin tưởng (Trust Architecture)
User sẽ không dùng chatbot nếu không tin vào câu trả lời. Trust được build qua:
- **Source transparency**: Luôn hiển thị "Dựa trên tài liệu X, cập nhật ngày Y"
- **Uncertainty signaling**: Nói rõ khi không chắc thay vì trả lời mơ hồ
- **Scope declaration**: Nói rõ chatbot đang search trong phạm vi nào ("Em search trong Knowledge Base nội bộ, không phải internet")
- **Error recovery**: Khi sai → cho phép user report và có action tiếp theo

### Nguyên tắc 2: Brevity + Structure (Ngắn + Có cấu trúc)
Không ai đọc wall of text trong chat. Output phải:
- Câu trả lời chính ≤ 3–4 dòng đầu
- Dùng bullet points cho list
- Dùng numbered steps cho quy trình
- Dùng card/table cho comparison
- "Xem thêm" để expand — không dump tất cả lên màn hình

### Nguyên tắc 3: Always-Available Escape Hatch
User không bao giờ được cảm thấy mắc kẹt:
- Nút **"Hỏi người thật"** visible ở mọi màn hình, không buried
- Khi escalate → transfer toàn bộ conversation history, không bắt user lặp lại
- Khi chatbot không biết → chỉ đúng người/channel có thể giúp

### Nguyên tắc 4: Minimal Friction Entry
- Gợi ý câu hỏi phổ biến ngay khi mở chatbot (không để user nhìn vào màn hình trắng)
- Autocomplete / suggestion khi user đang gõ
- Quick reply chips sau mỗi câu trả lời để guide next step

### Nguyên tắc 5: Honest Memory
- Nói rõ chatbot nhớ gì trong session (context hiện tại)
- Không fake personalization — "Xin chào Alex" nhưng không nhớ gì từ lần trước là worse than no personalization

---

## 2. UX Patterns đã được validate bởi thị trường

### Pattern 1: Source Citation Block
```
┌─────────────────────────────────────────────────────┐
│  Nhân viên chính thức được nghỉ phép 12 ngày/năm,   │
│  trong đó 3 ngày có thể chuyển sang năm sau.        │
│                                                     │
│  📄 Dựa trên: Chính sách Nhân sự 2025              │
│     Cập nhật: 15/01/2025 · Người phụ trách: HR     │
└─────────────────────────────────────────────────────┘
```
**Tại sao cần**: Build trust. User biết thông tin này từ đâu và còn mới không.

---

### Pattern 2: Uncertainty Signal
```
┌─────────────────────────────────────────────────────┐
│  ⚠️ Em không tìm thấy thông tin chính xác về        │
│  điều này trong Knowledge Base nội bộ.              │
│                                                     │
│  Anh/chị có thể:                                   │
│  [Hỏi HR trực tiếp]  [Search manual]  [Tạo request]│
└─────────────────────────────────────────────────────┘
```
**Tại sao cần**: Không hallucinate. Failure state có ích hơn confident wrong answer.

---

### Pattern 3: Stale Content Warning
```
┌─────────────────────────────────────────────────────┐
│  ℹ️ Em tìm thấy thông tin liên quan, nhưng tài liệu │
│  này chưa được review trong 6 tháng.               │
│                                                     │
│  Nội dung: [hiển thị nhưng có warning badge]       │
│                                                     │
│  [Xác nhận với HR]  [Đánh dấu cần cập nhật]        │
└─────────────────────────────────────────────────────┘
```
**Tại sao cần**: Tránh user ra quyết định dựa trên thông tin cũ.

---

### Pattern 4: Quick Reply Chips
```
┌─────────────────────────────────────────────────────┐
│  [Câu trả lời về chính sách nghỉ phép]             │
│                                                     │
│  Câu hỏi liên quan:                                │
│  [Nghỉ phép không lương?] [Nghỉ thai sản?]         │
│  [Cách đăng ký nghỉ phép?]                         │
└─────────────────────────────────────────────────────┘
```
**Tại sao cần**: Reduce typing effort. Guide user đến thông tin liên quan họ có thể chưa biết cần hỏi.

---

### Pattern 5: Step-by-Step Guided Flow
```
┌─────────────────────────────────────────────────────┐
│  Quy trình onboard khách hàng mới (5 bước):        │
│                                                     │
│  ✅ Bước 1: Tạo profile khách hàng trong CRM       │
│  ✅ Bước 2: Gửi email chào mừng (template A)       │
│  ⬜ Bước 3: Setup tài khoản MIA Smart              │
│  ⬜ Bước 4: Training session lần 1                 │
│  ⬜ Bước 5: Check-in sau 7 ngày                    │
│                                                     │
│  [Xem chi tiết Bước 3]  [Đánh dấu hoàn thành]     │
└─────────────────────────────────────────────────────┘
```
**Tại sao cần**: Quy trình phức tạp cần structure, không dump text. Interactive checklist tăng completion rate.

---

### Pattern 6: Role-Aware Response Header
```
┌─────────────────────────────────────────────────────┐
│  [CS Agent view — câu hỏi: "Khách hàng khiếu nại"] │
│                                                     │
│  Với role CS Agent, anh/chị cần:                   │
│  1. Ghi nhận vào ticket system trong 30 phút       │
│  2. Response SLA: 4 giờ làm việc                   │
│  3. Escalate lên Lead CS nếu KH yêu cầu manager   │
│                                                     │
│  [Xem SLA đầy đủ]  [Template phản hồi KH]         │
└─────────────────────────────────────────────────────┘
```
**Tại sao cần**: Same question, different role = different relevant answer.

---

### Pattern 7: Feedback Loop (thumbs up/down)
```
┌─────────────────────────────────────────────────────┐
│  [Câu trả lời]                                     │
│                                                     │
│  Câu trả lời này có hữu ích không?  👍  👎          │
│                                                     │
│  (Nếu 👎) Anh/chị muốn gửi thêm feedback không?   │
└─────────────────────────────────────────────────────┘
```
**Tại sao cần**: Continuous improvement signal. Phát hiện knowledge gaps.

---

## 3. Information Architecture — 3 Interaction Modes

Internal chatbot phải handle 3 loại intent khác nhau, mỗi loại cần IA khác nhau:

### Mode A: Instant Answer (80% của traffic)
**Trigger**: Câu hỏi có 1 câu trả lời rõ ràng
```
User: "Chính sách nghỉ phép bao nhiêu ngày?"
→ Direct answer + source citation + quick reply chips
Không cần intermediate steps
```

### Mode B: Guided Process (15% của traffic)
**Trigger**: Câu hỏi về quy trình có nhiều bước
```
User: "Làm sao để onboard khách hàng mới?"
→ Step-by-step flow
→ Có thể interactive (check off steps)
→ Deep link vào từng bước
```

### Mode C: Exploration / Discovery (5% của traffic)
**Trigger**: Câu hỏi mở, exploratory
```
User: "Cho tôi biết về MIA Smart"
→ Structured overview card
→ Drill-down: [Tính năng] [Pricing] [Case studies] [FAQ]
→ User chọn góc độ muốn explore
```

---

## 4. Conversation Flow Design

### Entry State (khi mở chatbot lần đầu)
```
┌─────────────────────────────────────────────────────┐
│  Xin chào [Tên]! Em có thể giúp gì cho anh/chị?   │
│                                                     │
│  Câu hỏi phổ biến hôm nay:                        │
│  [Chính sách nghỉ phép]                            │
│  [Quy trình xử lý khiếu nại]                       │
│  [Tính năng mới MIA Spring]                        │
│  [Onboard khách hàng mới]                          │
└─────────────────────────────────────────────────────┘
```

### Normal Answer Flow
```
User input → [Intent detection] → [Role-aware retrieval]
           → [Answer synthesis] → Response + Citation
           → Quick reply chips → [Next question or Close]
```

### Not Found Flow
```
User input → [Intent detection] → [Retrieval — no match / low confidence]
           → Uncertainty message → [Escalation options]
           → [Route to: HR / Tech Lead / CS Lead / Search manually]
```

### Escalation Flow
```
User clicks "Hỏi người thật"
→ Summary của conversation được tạo tự động
→ Route đến đúng người/channel
→ Người nhận thấy full context, không hỏi lại
```

---

## 5. Anti-patterns cần tránh

| Anti-pattern | Tại sao sai | Thay bằng |
|-------------|-------------|-----------|
| Chỉ có button navigation | Không scale — không predict được mọi câu hỏi | Free text + suggested chips |
| Response là wall of text | Không ai đọc → abandon | Structured output: bullets, steps, cards |
| Không cite nguồn | User không tin hoặc tin sai | Source citation block mọi answer |
| Generic fallback "Tôi không hiểu" | Dead end — user bỏ | Uncertainty signal + escalation options |
| Không có human escalation | User mắc kẹt | Nút "Hỏi người thật" luôn visible |
| Fake confidence khi không biết | Trả lời sai → mất trust hoàn toàn | Honest uncertainty signal |
| Đổ toàn bộ tài liệu | Overwhelming | Summary + "Xem thêm" expand |
| Không nhớ context trong session | User phải lặp lại → frustrating | Session memory, reference back |
| Không có feedback mechanism | Không biết chatbot đang fail ở đâu | Thumbs up/down sau mỗi answer |

---

## 6. Wireframe concept (mô tả text)

### Layout tổng thể
```
┌──────────────────────────────────────────────────────────┐
│  MIABOS Assistant                        [_] [□] [×]    │
├──────────────────────────────────────────────────────────┤
│  Conversation Area (scrollable)                         │
│  ┌──────────────────────────────────────────────────┐   │
│  │  [Tin nhắn của User] (right-aligned, bubble)    │   │
│  │  [Tin nhắn của Bot]  (left-aligned, card style) │   │
│  │  └── Source citation (smaller text, gray)       │   │
│  │  └── Quick reply chips                          │   │
│  └──────────────────────────────────────────────────┘   │
├──────────────────────────────────────────────────────────┤
│  [🔍 Tìm kiếm hoặc hỏi...              ] [Gửi ↑]       │
│  [Hỏi người thật]  [Xem lịch sử]                        │
└──────────────────────────────────────────────────────────┘
```

### Bot message card structure
```
┌──────────────────────────────────────────────────────────┐
│  [Answer — ngắn gọn, structured]                        │
│  • Bullet point nếu list                                │
│  • Numbered steps nếu quy trình                         │
│                                                         │
│  📄 Nguồn: [Tên tài liệu] · [Ngày] · [Owner]          │
│  ────────────────────────────────────────               │
│  [Quick reply 1]  [Quick reply 2]  [Quick reply 3]      │
│  ────────────────────────────────────────               │
│  👍  👎   Có hữu ích không?                             │
└──────────────────────────────────────────────────────────┘
```

---

## 7. Key metrics để đo UX success

| Metric | Target Phase 1 | Cách đo |
|--------|---------------|---------|
| Answer found rate | ≥ 80% | Tỷ lệ câu hỏi có answer (không fallback) |
| Thumbs up rate | ≥ 70% | Positive feedback / total rated |
| Escalation rate | ≤ 15% | % câu hỏi phải escalate to human |
| Session completion rate | ≥ 85% | User có câu trả lời và close properly |
| Avg response time | ≤ 3 giây | End-to-end latency |
| Weekly active users | Tăng MoM | Adoption tracking |

---

*Tài liệu này là input research đã được approve để định hướng PRD/SRS/UXUI. Nếu Business Owner đổi concept, phải revise research trước rồi mới sync lại artifact chính thức.*
