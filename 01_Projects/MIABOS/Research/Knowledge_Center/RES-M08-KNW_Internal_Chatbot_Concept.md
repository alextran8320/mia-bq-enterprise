# RES-M08-KNW — Internal Chatbot: Concept & Design Direction

| Field | Value |
|-------|-------|
| Module | Knowledge Center |
| Research Type | Concept Direction |
| Author | A01 PM Agent (Claude Sonnet 4.6 — Claude Code CLI, w/ A06 UX input) |
| Date | 2026-04-17 |
| Status | **Approved — Business Owner approved 2026-04-17** |
| Blocks | PRD-M08-KNW-*, SRS-M08-KNW-*, UXUI-M08-KNW-* |

---

## Mục đích tài liệu

Tài liệu này xác định **concept cốt lõi** cho Internal Chatbot của MIABOS trước khi rewrite các tài liệu chính thức (PRD, SRS, UXUI Spec). Mọi quyết định design trong tài liệu này phải được Business Owner approve trước khi thực thi.

> **Approval / Alignment Note (2026-04-18)**: Research index đang ghi tài liệu này ở trạng thái `Approved`. Các SRS/UXUI liên quan phải giữ concept `Trusted Knowledge Companion` làm lõi: answer-first, source citation, verified knowledge, role-sensitive response, honest uncertainty, và human escalation. Với BQ phase 1, `M09 Internal AI Chat` được phép mở rộng sang **read-only operational data snapshot** từ SAP B1 / KiotViet / Haravan khi cần trả lời câu hỏi tồn kho/đơn hàng/CTKM, nhưng không được vượt sang Gen 4 action execution như tự tạo ticket, tự update CRM/SAP, hoặc proactive push notification.

---

## 1. Vấn đề với approach hiện tại

Chatbot nội bộ hiện tại được build mà **chưa qua research phase** — dẫn đến thiếu:

- Một design paradigm rõ ràng (đang làm chatbot theo kiểu nào?)
- Best practice về UX cho internal chatbot
- Benchmark đối chiếu với các sản phẩm thị trường
- Phân tích use case phù hợp với context BQ (Sales team, CS, Ops)

Kết quả: chatbot generic, không differentiated, không solve đúng pain point của nhân viên BQ.

---

## 2. Spectrum tiến hóa của Internal Chatbot

Thị trường 2024–2025 định nghĩa 4 thế hệ chatbot nội bộ:

### Generation 1 — Rule-based FAQ Bot
- Hoạt động bằng predefined flows, button menus, keyword matching
- Mạnh khi: số câu hỏi ít, cố định, không thay đổi
- Yếu khi: user hỏi ngoài script → "Tôi không hiểu"
- Ví dụ: chatbot cũ trên website, Messenger bot đơn giản

### Generation 2 — Search-First Bot
- Nhận câu hỏi → trả về list tài liệu/links liên quan
- Mạnh hơn Gen 1 vì không cần predefined flows
- Yếu: không synthesize — user vẫn phải tự đọc và tìm
- Ví dụ: internal search bar có AI assist

### Generation 3 — RAG Knowledge Assistant ← **Target MIABOS**
- Nhận câu hỏi → retrieve đúng đoạn văn bản → tổng hợp câu trả lời
- Luôn cite nguồn tài liệu đã dùng để trả lời
- Hiểu context, nhớ conversation trong session
- Honest khi không biết (low confidence → cảnh báo)
- Ví dụ: Guru, Workgrid, Notion AI, Confluence AI

### Generation 4 — AI Copilot / Agent
- Không chỉ trả lời — còn thực thi action (tạo ticket, gửi email, update CRM)
- Proactive: push thông tin quan trọng mà không cần user hỏi
- Ví dụ: Moveworks, Microsoft Copilot, Glean Actions
- **→ Đây là roadmap dài hạn, không phải scope hiện tại**

### Vị trí hiện tại và target

```
Gen 1       Gen 2       Gen 3           Gen 4
  ●──────────●──────────●───────────────●
             ↑           ↑
         Hiện tại      Target
         (MIABOS)      (MIABOS v2)
```

---

## 3. Concept được đề xuất: "Trusted Knowledge Companion"

### Tên concept
**Trợ lý Tri thức Đáng tin cậy** (Trusted Knowledge Companion)

### Positioning statement
> MIABOS Internal Chatbot là trợ lý tri thức đáng tin cậy — không phải search engine, không phải rule-based bot — mà là người đồng hành AI biết context của team, trả lời chính xác từ knowledge base được verify, và biết khi nào cần dẫn đến con người.

### 4 Trụ cột thiết kế (Design Pillars)

#### Pillar 1: Answer-First, Not Link-First
Thay vì trả về list links, chatbot **tổng hợp câu trả lời trực tiếp** từ nhiều nguồn tài liệu, luôn kèm citation. User không cần mở thêm tài liệu để đọc — trừ khi muốn đào sâu.

#### Pillar 2: Verified Knowledge
Mỗi tài liệu trong Knowledge Base có owner và expiry date. Chatbot hiển thị ngày cập nhật cuối và cảnh báo khi tài liệu quá hạn thay vì trả lời tự tin từ thông tin cũ.

#### Pillar 3: Context-Aware & Role-Sensitive
Chatbot biết user đang ở role nào (Sales / CS Agent / Ops / Manager). Cùng một câu hỏi có thể cần trả lời khác nhau theo role. Nhớ context trong session — không hỏi lại thông tin đã có.

#### Pillar 4: Honest Uncertainty
Khi confidence thấp hoặc không tìm thấy thông tin → nói thẳng và cung cấp alternative path (escalate, search manually, liên hệ người phụ trách). Không hallucinate, không trả lời mơ hồ để tránh "tôi không biết".

---

## 4. Scope use cases — Phase 1

Dựa trên context Giày BQ (Sales team, CS agents, Ops staff):

### Priority 1 — High Frequency, High Value (Build trước)
| Use Case | Actor | Mô tả |
|----------|-------|-------|
| Tra cứu chính sách | Toàn bộ nhân viên | Nghỉ phép, expense, quy định nội bộ |
| Tra cứu kiến thức sản phẩm | Sales, CS | Tính năng MIA Smart / Spring / Scale |
| Tra cứu SOP / quy trình | CS, Ops | Quy trình xử lý ticket, onboard KH |
| FAQ khách hàng thường gặp | CS Agent | Tra nhanh khi đang trong cuộc hội thoại với KH |

### Priority 2 — Medium Frequency (Build sau)
| Use Case | Actor | Mô tả |
|----------|-------|-------|
| Onboarding guide | Nhân viên mới | Checklist, tài liệu, người liên hệ |
| Escalation routing | CS, Sales | Vấn đề này cần leo lên ai? |
| Template / Script | Sales | Mẫu email, mẫu pitch, mẫu báo cáo |

### Out of scope (Phase 1)
- Tự động tạo ticket
- Summary cuộc họp tự động
- Proactive push notifications
- Tích hợp action với CRM/SAP

---

## 5. Differentiators so với chatbot generic

| Điểm khác biệt | Generic Chatbot | MIABOS Trusted Knowledge Companion |
|----------------|-----------------|-------------------------------------|
| Nguồn trả lời | Không rõ | Luôn cite tên tài liệu + ngày cập nhật |
| Khi không biết | "Tôi không hiểu" hoặc hallucinate | Thừa nhận + gợi ý escalation path |
| Role awareness | Không có | Trả lời khác nhau theo role user |
| Độ tin cậy KB | Không kiểm soát | KB có owner + expiry, chatbot cảnh báo khi stale |
| Output format | Text block | Structured: bullets, steps, cards |
| Dead-end | Hay bị kẹt | Luôn có human escalation path |

---

## 6. Điều cần Business Owner quyết định

Các quyết định dưới đây là checklist review ban đầu. Trạng thái hiện tại theo Research Index: **Approved 2026-04-17**.

- [x] **Concept direction**: "Trusted Knowledge Companion" (Gen 3 RAG) là hướng chuẩn.
- [x] **Phase 1 scope**: Priority 1 use cases được dùng làm lõi; BQ phase 1 có thêm read-only data/mixed answer cho inventory/order/promotion context.
- [x] **Primary user**: Tất cả nhân viên nội bộ phase 1, với priority cao cho CSKH / Sales / Store / Ecommerce.
- [x] **Verified KB**: M08 Knowledge Center quản lý owner/freshness/source governance cho KB.
- [x] **Language**: Tiếng Việt là mặc định cho chatbot nội bộ; English có thể xử lý sau nếu Business Owner mở scope.

---

*Tài liệu này là input research đã được approve để định hướng PRD/SRS/UXUI. Nếu Business Owner đổi concept, phải revise research trước rồi mới sync lại artifact chính thức.*
