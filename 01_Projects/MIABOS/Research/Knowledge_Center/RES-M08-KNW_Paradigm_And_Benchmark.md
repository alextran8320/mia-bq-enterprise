# RES-M08-KNW — Internal Chatbot: Paradigm & Market Benchmark

| Field | Value |
|-------|-------|
| Module | Knowledge Center |
| Research Type | Market Benchmark |
| Author | A01 PM Agent (Claude Sonnet 4.6 — Claude Code CLI, w/ A04 Strategy + A06 UX input) |
| Date | 2026-04-17 |
| Status | **Approved — Business Owner approved 2026-04-17** |
| Sources | Tavily Search, NVIDIA Enterprise Guide, Workgrid 2024 Guide, Atlan LLM KB Review, GoSearch Benchmark |

---

## 1. Tổng quan thị trường Internal Chatbot 2024–2025

Theo IDC FutureScape: đến 2025, **2/3 doanh nghiệp** sẽ dùng kết hợp Generative AI + RAG cho knowledge discovery nội bộ, cải thiện decision efficacy 50%.

Xu hướng chính:
- Shift từ **reactive chatbot** (chờ user hỏi) → **proactive AI assistant** (chủ động push thông tin)
- Shift từ **link-based retrieval** → **answer synthesis** (tổng hợp trả lời trực tiếp)
- Shift từ **one-size-fits-all** → **role-aware, context-sensitive** responses
- **RAG** (Retrieval-Augmented Generation) trở thành kiến trúc chuẩn cho internal KB chatbot

---

## 2. Benchmark: Top sản phẩm Internal Knowledge Assistant

### 2.1 Guru — Best for: CS/Sales Teams
**Positioning**: Internal knowledge management cho customer-facing teams

**Điểm mạnh nổi bật**:
- **Verification workflow**: Mỗi knowledge card có 1 người chịu trách nhiệm verify định kỳ — ai responsible cho từng thông tin
- **In-workflow surfacing**: Surface đúng knowledge card khi agent đang gõ — không cần switch tab
- **Content freshness signals**: Tự động flag tài liệu chưa được review lâu
- Tích hợp native với Slack, Teams

**Pricing**: ~$10/user/month

**Lesson cho MIABOS**: Model "verified knowledge card có owner" rất phù hợp với context CS/Sales của BQ — mỗi SOP cần người responsible, không để stale.

---

### 2.2 Glean — Best for: Enterprise cross-system search
**Positioning**: Unified semantic search qua 100+ workplace tools

**Điểm mạnh nổi bật**:
- Search một lần qua Google Drive, SharePoint, Confluence, Slack, Jira, Salesforce, email
- **Permission-aware**: Chỉ trả kết quả user được phép xem
- **Knowledge graph**: Hiểu mối quan hệ giữa các tài liệu
- Personalized based on role và usage history

**Pricing**: Enterprise — custom quote

**Lesson cho MIABOS**: Permission-aware retrieval rất quan trọng — nhân viên Sales không nên thấy tài liệu internal của Finance.

---

### 2.3 Workgrid — Best for: Employee experience
**Positioning**: Proactive AI Work Assistant (không chỉ reactive Q&A)

**Điểm mạnh nổi bật**:
- **Proactive "to-know" + "to-do"**: Push thông tin quan trọng trước khi user hỏi
- Tích hợp với enterprise systems để surface real-time alerts
- Robust intent understanding — hiểu câu hỏi tự nhiên không cần keyword chính xác
- Exception handling rõ ràng khi không có câu trả lời

**Lesson cho MIABOS**: Concept "proactive delivery" là roadmap tốt cho Gen 4. Phase 1 nên focus reactive trước, nhưng thiết kế phải mở để thêm proactive sau.

---

### 2.4 Moveworks — Best for: Action-oriented AI
**Positioning**: AI that resolves issues, not just finds information

**Điểm mạnh nổi bật**:
- Không chỉ trả lời — **thực thi action**: tạo ticket, check status, trigger access workflows
- Tích hợp sâu với ITSM, HRMS, ERP
- NLP rất mạnh — hiểu câu hỏi phức tạp trong nhiều domain

**Lesson cho MIABOS**: Đây là Gen 4 target. Phase 1 không cần action execution, nhưng cần thiết kế conversation flow để dễ thêm action buttons sau.

---

### 2.5 Notion AI — Best for: Small teams, workspace-native
**Positioning**: AI embedded trong workspace quen thuộc

**Điểm mạnh nổi bật**:
- Lowest friction — user không cần học tool mới
- Semantic search qua workspace content
- AI content generation + Q&A

**Hạn chế**:
- Không có verification workflow
- Không có permission-aware retrieval
- Stale pages surface cùng mức với fresh content

**Lesson cho MIABOS**: "Embedded trong tool quen" là UX win lớn. Nên xem xét widget/sidebar approach thay vì standalone app.

---

## 3. Comparison matrix

| Tiêu chí | Guru | Glean | Workgrid | Moveworks | Notion AI |
|----------|------|-------|----------|-----------|-----------|
| Kiến trúc core | RAG + Verification | Semantic Search + KG | RAG + Proactive | NLP + Actions | RAG (workspace) |
| Answer synthesis | ✓ | Partial | ✓ | ✓ | ✓ |
| Source citation | ✓ | ✓ | ✓ | Partial | ✗ |
| Knowledge verification | ✓✓ (best) | ✗ | Partial | ✗ | ✗ |
| Permission-aware | ✓ | ✓✓ (best) | ✓ | ✓ | ✗ |
| Role-aware response | Partial | ✓ | ✓ | ✓ | ✗ |
| Action execution | ✗ | Partial | Partial | ✓✓ (best) | ✗ |
| Proactive push | ✗ | ✗ | ✓✓ (best) | ✓ | ✗ |
| Human escalation | ✓ | ✓ | ✓ | ✓ | ✗ |
| Fit cho SME | ✓✓ | ✗ (enterprise) | ✓ | ✗ (enterprise) | ✓✓ |

---

## 4. Kiến trúc kỹ thuật chuẩn: RAG Pipeline

Dựa trên NVIDIA Enterprise Guide + industry benchmark:

```
User Query
    │
    ▼
[Query Understanding]
Intent detection + role context injection
    │
    ▼
[Retrieval Layer]
Vector search trên Knowledge Base
→ Lấy top-N đoạn văn bản relevant nhất
    │
    ▼
[Context Assembly]
Ghép query + retrieved docs + user context (role, history)
    │
    ▼
[Generation Layer — LLM]
Tổng hợp câu trả lời từ retrieved docs
→ Không được "bịa" ngoài retrieved context
    │
    ▼
[Response + Citations]
Câu trả lời + tên tài liệu nguồn + ngày cập nhật
    │
    ▼
[Feedback Collection]
Thumbs up/down → training signal
```

**Điểm cần chú ý cho MIABOS**:
- Knowledge Base quality là foundation — "garbage in, garbage out"
- Chunking strategy (cách chia tài liệu thành các đoạn) ảnh hưởng lớn đến chất lượng retrieval
- Permission filtering phải xảy ra ở retrieval layer, không phải sau khi generate

---

## 5. Đặc thù thị trường Việt Nam / SEA

Từ research về SME Việt Nam:
- **93% doanh nghiệp VN** đã dùng ít nhất 1 công cụ AI cho giao tiếp (Zalo, Facebook Messenger)
- Familiarity cao với chat interface — nhưng mostly customer-facing, ít internal
- **Tiết kiệm 4.5 giờ/ngày/nhân viên** khi có AI assistant hiệu quả (benchmark SME VN)
- Cost sensitivity cao → cần ROI rõ ràng và thời gian onboard ngắn

**Implication cho MIABOS**:
- UI phải quen thuộc — gần giống Zalo/Messenger interface
- Ngôn ngữ mặc định: Tiếng Việt, tự nhiên, không formal quá
- Onboarding < 5 phút — user không đọc manual
- Cần quick wins visible sớm (reduction in "hỏi đi hỏi lại" giữa nhân viên)

---

## 6. Kết luận từ benchmark

**3 insight quan trọng nhất**:

1. **Verification > Volume**: Ít tài liệu nhưng được verify và có owner còn tốt hơn nhiều tài liệu stale. Guru thành công vì điều này.

2. **Trust = Citation + Honesty**: Chatbot được tin dùng khi luôn cite nguồn VÀ thừa nhận khi không biết. Không có cái nào một mình là đủ.

3. **Embedded wins over standalone**: Chatbot embedded trong workflow (Slack, Teams, sidebar của tool quen) có adoption cao hơn standalone app đáng kể.

---

*Tài liệu này là input research đã được approve để định hướng PRD/SRS/UXUI. Nếu Business Owner đổi concept, phải revise research trước rồi mới sync lại artifact chính thức.*
