# UXUI Feature Spec: F-M10-SLS-001 Sales Advisor AI

**Feature ID**: F-M10-SLS-001
**Status**: Approved
**Owner**: A06 UI/UX Agent
**Implementation Reviewer**: A05 Tech Lead
**Implemented By**: A07 FE Builder
**Product**: MIA Smart
**Design System Reference**: [`Design/Design_System.md`](../Design_System.md)
**Save to**: `Design/UXUI_Features/UXUI-F-M10-SLS-001_Sales_Advisor_AI.md`
**Date**: 2026-04-16
**Last Status Change**: 2026-04-16
**Approval Required**: PM Agent for FE Preview
**Approved By**: A01 PM Agent — FE Preview scope confirmed by Business Owner instruction on 2026-04-16
**Blocking Reason**: -

> **Precondition Resolved**: Linked SRS `F-M10-SLS-001` hiện ở `SRS Ready`; spec này là visual/interaction authority cho FE Preview bằng mock/stub data. BE/integration thật vẫn cần Integration Spec trước khi promote SRS lên `Build Ready`.

---

## §0. User & Task

### Target User Role(s)

| Role | Mô tả | Context |
|------|-------|---------|
| Khách hàng (anonymous / known) | Người mua tiềm năng đang tìm hiểu sản phẩm | Trên website, Zalo OA, hoặc kiosk tại cửa hàng |
| Sales / CSKH nội bộ | Nhân viên hỗ trợ khách qua console nội bộ | Đang chat hoặc gọi điện cho khách, cần gợi ý nhanh |

### Primary Task Objective

> Khách hàng nhận được gợi ý sản phẩm phù hợp kèm range giá, ưu đãi public-safe, và CTA rõ ràng sau **≤ 3 câu discovery** — không bị hỏi thông tin nhạy cảm và không bị dead-end.

### Success Metric

| Metric | Target | Cách đo |
|--------|--------|---------|
| Thời gian từ câu hỏi đến suggestion đầu tiên | ≤ 4s | Đo từ submit đến Suggestion Card render |
| Số câu discovery trước khi có suggestion | ≤ 3 câu | Đếm follow-up questions trước khi render S3 |
| CTA click-through rate | ≥ 20% (pilot target) | Số lần click CTA / tổng session có suggestion |

### Failure Indicators

- Khách bị hỏi > 3 câu liên tiếp trước khi thấy sản phẩm nào
- Suggestion Card không có rationale — chỉ liệt kê tên + giá
- Khách hỏi thông tin nhạy cảm và nhận được câu trả lời không có CTA tiếp theo
- CTA dẫn đến lỗi hoặc màn hình trắng

---

## 1. Feature Overview

### Purpose

Cung cấp AI tư vấn bán hàng external (public-safe) cho khách hàng Giày BQ — gợi ý sản phẩm phù hợp với nhu cầu, range giá, và CTKM an toàn, kèm CTA chuyển đổi rõ ràng (để lại thông tin, liên hệ cửa hàng, xem thêm online).

### User Persona

Khách hàng đang cân nhắc mua giày — quan tâm đến `mẫu nào hợp`, `còn size không`, `giá tầm bao nhiêu`, `có khuyến mãi gì`. Không biết và không cần biết hệ thống backend của BQ.

### User Story

```
Là khách hàng Giày BQ,
Tôi muốn được AI gợi ý sản phẩm phù hợp với nhu cầu và ngân sách của tôi,
Để tôi dễ dàng quyết định mua mà không cần phải tự tìm kiếm trên nhiều trang.
```

### Linked Artifacts

| Artifact | Location | Status |
|----------|----------|--------|
| Feature SRS | [`Analysis/Features/Modules/AI_Workspace/Sales_Advisor_AI/SRS/F-M10-SLS-001_Sales_Advisor_AI_SRS.md`](../../Analysis/Features/Modules/AI_Workspace/Sales_Advisor_AI/SRS/F-M10-SLS-001_Sales_Advisor_AI_SRS.md) | SRS Ready |

---

## 2. Screen Inventory

| # | Tên màn hình | Route/Context | Mục đích | Mockup |
|---|-------------|--------------|---------|--------|
| S1 | Sales Chat Shell | `/sales-advisor` hoặc widget embed | Giao diện chat tư vấn cho khách | `Design/Mockups/F-M10-SLS-001_S1_Sales_Chat_Shell.png` |
| S2 | Discovery Prompts | trong S1 | AI hỏi làm rõ nhu cầu | `Design/Mockups/F-M10-SLS-001_S2_Discovery.png` |
| S3 | Suggestion Card | trong S1 | Gợi ý sản phẩm kèm rationale, range giá, CTA | `Design/Mockups/F-M10-SLS-001_S3_Suggestion.png` |
| S4 | Blocked State | trong S1 | Câu hỏi vượt public-safe boundary | `Design/Mockups/F-M10-SLS-001_S4_Blocked.png` |
| S5 | CTA Footer — Lead Capture | trong S3 | Khách để lại thông tin liên hệ | `Design/Mockups/F-M10-SLS-001_S5_Lead_Capture.png` |

---

## 2.1 Task Flow

### Primary Task Flow — Tư vấn và chuyển đổi

| Step | Hành động của User | Phản hồi của Hệ thống | Field hiển thị | Ghi chú |
|------|-------------------|----------------------|---------------|---------|
| 1 | Mở Sales Chat (website widget hoặc Zalo OA) | Hiển thị Chat Shell, welcome message, Quick Reply chips gợi ý chủ đề | Welcome + Quick Reply chips | Entry point |
| 2 | Nêu nhu cầu sơ bộ ("Tôi muốn mua giày thể thao") hoặc chọn Quick Reply | AI hiểu intent, bắt đầu need-discovery | — | |
| 3 | Trả lời 1–3 câu discovery (size, ngân sách, mục đích dùng, màu sắc) | Quick Reply chips gợi ý mỗi câu để giảm typing | Discovery bubbles | Tối đa 3 câu trước khi suggest |
| 4 | — | Hệ thống truy xuất product candidates + public-safe pricing + availability projection | — | Backend |
| 5 | — | Render Suggestion Card (S3) với sản phẩm, lý do, range giá, CTA | S3 | Answer trong ≤ 4s |
| 6 | Chọn CTA hoặc hỏi tiếp | CTA dẫn sang Lead Capture (S5) / handoff / xem thêm; hoặc tiếp tục chat | S5 hoặc tiếp chat | Conversion |

### Decision Points & Branching

| Tại bước | Điều kiện | Rẽ sang |
|---------|-----------|---------|
| Step 2 | Câu hỏi vượt public-safe boundary | Render Blocked (S4) — lịch sự, có CTA |
| Step 5 | Availability confidence thấp | Suggestion Card dùng wording mềm + CTA "Xác nhận tại cửa hàng" |
| Step 5 | Không tìm được sản phẩm match | Fallback card: "Xem thêm tại" + link collection + CTA tư vấn thêm |
| Step 6 | Khách chọn CTA Lead Capture | Render S5 inline trong chat |

### Progressive Disclosure Rules

- **Luôn hiển thị**: Suggestion product name, lý do phù hợp, range giá
- **Hiển thị khi có**: CTKM/ưu đãi (chỉ khi có public-safe promo), Availability note
- **Ẩn sau click**: Chi tiết sản phẩm đầy đủ (link ra trang product)
- **Hiển thị sau ≤ 3 discovery**: Suggestion Card — không để khách chờ quá 3 câu

---

## 3. Visual Specification

### Screen S1: Sales Chat Shell

#### Layout (ASCII Wireframe)

```
┌───────────────────────────────────────────────┐
│  [Logo BQ nhỏ]  Trợ lý Tư Vấn Giày BQ   [✕] │  ← Header widget (nếu embed)
├───────────────────────────────────────────────┤
│                                               │
│  [AI Bubble: Welcome message]                 │
│                                               │
│  [Quick Reply chips hàng ngang]               │
│   [Giày thể thao] [Giày công sở] [Sandal]     │
│                                               │
│  [User Bubble]                                │
│                                               │
│  [AI Bubble: Discovery question]              │
│  [Quick Reply chips: Dưới 500k] [500k-1tr]... │
│                                               │
│  [Suggestion Card nếu đã có]                  │
│                                               │
├───────────────────────────────────────────────┤
│  [Floating Dock — nhập hoặc chọn Quick Reply] │
└───────────────────────────────────────────────┘
```

#### Component Breakdown

| Component | Design Token | shadcn/ui | Ghi chú |
|-----------|-------------|-----------|---------|
| Chat Shell bg | `bg-[#F6F9FF]` | — | Cùng tone với Internal Chat |
| Header widget | `bg-white shadow-ambient rounded-t-2xl` | — | Chỉ khi embed widget |
| AI Bubble | `bg-[#ECF4FF] text-[#013652] rounded-[12px] rounded-bl-[4px]` | — | Left-aligned |
| User Bubble | `bg-[#2F64F6] text-white rounded-[12px] rounded-br-[4px]` | — | Right-aligned |
| Quick Reply chips | `rounded-full border border-[rgba(142,182,217,0.3)] text-[#2F64F6] text-sm px-4 py-2 hover:bg-[#ECF2FE]` | `Badge` variant | Disappear sau khi chọn |
| Floating Dock | Xem Design_System §2.7 | — | Glassmorphism |

#### Design Token Values

| Element | Property | Token / Value |
|---------|----------|---------------|
| Shell bg | `background` | `#F6F9FF` |
| AI bubble bg | `background` | `#ECF4FF` |
| User bubble bg | `background` | `#2F64F6` |
| Quick Reply border | `border` | `rgba(142,182,217,0.3)` |
| Quick Reply text | `color` | `#2F64F6` |
| Quick Reply hover bg | `background` | `#ECF2FE` |
| Header bg | `background` | `#FFFFFF` |
| Header shadow | `box-shadow` | `shadow-ambient` |

---

### Screen S2: Discovery Prompts

Discovery là **các câu hỏi của AI** hiển thị trong AI Bubble + Quick Reply chips bên dưới.

**Anatomy:**

```
┌─────────────────────────────────────────┐
│  [AI Bubble]                            │
│  "Bạn muốn dùng cho mục đích gì?"       │
└─────────────────────────────────────────┘
   [Đi chơi / dạo phố]  [Chạy bộ]  [Công sở]  [Đi học]
```

**Quy tắc:**
- Mỗi câu discovery có **Quick Reply chips** để khách không cần gõ
- Chips biến mất sau khi khách chọn (không để chip cũ lơ lửng)
- Tối đa **3 lượt discovery** — sau đó AI phải đưa suggestion dù chưa có đủ info
- Progress indicator nhỏ (3 dots, 1–2–3) tùy chọn để cho khách biết còn bao nhiêu câu

---

### Screen S3: Suggestion Card

#### Layout

```
┌──────────────────────────────────────────────┐
│  [AI Bubble: "Dựa trên nhu cầu của bạn..."]  │
├──────────────────────────────────────────────┤
│  ┌────────────────────────────────────────┐  │
│  │  [Hình sản phẩm thumbnail 80x80px]     │  │
│  │  Tên sản phẩm  (H3, #013652)           │  │
│  │  ✓ Lý do phù hợp (Body, #3A6381)      │  │
│  │                                         │  │
│  │  💰 Từ 850.000đ                         │  │  ← Range giá (không cam kết chính xác)
│  │  🏷️ Đang có ưu đãi: Giảm 10%           │  │  ← Chỉ hiện nếu có public-safe promo
│  │  📦 Có thể còn tại cửa hàng HCM        │  │  ← Projection mềm nếu confidence thấp
│  │                                         │  │
│  │  [Xem sản phẩm]  [Để lại thông tin]    │  │  ← CTAs
│  └────────────────────────────────────────┘  │
│                                              │
│  ┌────────────────────────────────────────┐  │
│  │  Sản phẩm 2 (nếu có) ...              │  │
│  └────────────────────────────────────────┘  │
│                                              │
│  [Hỏi tiếp]  [Xem thêm sản phẩm]           │
└──────────────────────────────────────────────┘
```

#### Suggestion Card — Token Values

| Element | Property | Token / Value |
|---------|----------|---------------|
| Card bg | `background` | `#FFFFFF` |
| Card radius | `border-radius` | `16px` |
| Card shadow | `box-shadow` | `shadow-ambient` |
| Card padding | `padding` | `16px` (p-4) |
| Product name | `font-size / weight` | `16px / 600` (H3) |
| Rationale | `font-size / color` | `14px / #3A6381` |
| Price range | `font-size / weight / color` | `16px / 600 / #013652` |
| Promo badge | `background / color` | `#ECF2FE / #2F64F6` |
| Availability note | `font-size / color` | `13px / #3A6381` (italic nếu projection mềm) |
| CTA Primary | Pill, gradient `#2F64F6 → #2552CC` | `rounded-full` |
| CTA Secondary | Pill Ghost `text-[#2F64F6]` | `rounded-full` |

#### Wording Rules cho Availability

| Confidence | Wording | KHÔNG dùng |
|-----------|---------|-----------|
| High | "Còn hàng tại [Cửa hàng X]" | — |
| Medium | "Có thể còn tại [Khu vực X], nên xác nhận trước khi đến" | "Còn hàng" (cam kết) |
| Low | "Nên liên hệ cửa hàng để xác nhận" | Bất kỳ con số tồn kho cụ thể |

---

### Screen S4: Blocked State

```
┌──────────────────────────────────────────┐
│  [AI Bubble]                             │
│  "Mình không thể cung cấp thông tin      │
│  này. Bạn có thể liên hệ nhân viên       │
│  để được hỗ trợ thêm nhé! 😊"           │
│                                          │
│  [Gặp nhân viên tư vấn]                 │  ← Primary CTA
│  [Hỏi câu khác]                         │  ← Ghost CTA
└──────────────────────────────────────────┘
```

**Quy tắc:**
- Không lộ lý do kỹ thuật (`blocked by M07`, `permission denied`)
- Ngôn ngữ thân thiện, không lạnh lùng
- Luôn có 2 CTA: thoát sang human handoff + tiếp tục chat
- Cho phép dùng emoji thân thiện trong external-facing chat (khác với internal chat)

---

### Screen S5: Lead Capture (inline trong chat)

```
┌──────────────────────────────────────────────┐
│  [AI Bubble]                                 │
│  "Để nhân viên liên hệ tư vấn thêm,         │
│  bạn để lại thông tin nhé:"                  │
├──────────────────────────────────────────────┤
│  ┌────────────────────────────────────────┐  │
│  │  Tên của bạn *                         │  │  ← Input
│  │  Số điện thoại *                       │  │  ← Input type="tel"
│  │  [Gửi thông tin]  [Thôi, để sau]       │  │  ← CTA
│  └────────────────────────────────────────┘  │
└──────────────────────────────────────────────┘
```

**Quy tắc form:**
- Tối thiểu nhất có thể: chỉ cần Tên + SĐT cho phase 1
- Label visible cho mỗi input (không placeholder-only)
- `input type="tel"` cho số điện thoại
- Submit thành công: AI bubble "Đã ghi nhận! Nhân viên sẽ liên hệ bạn sớm."
- "Thôi, để sau" không xoá cuộc hội thoại — tiếp tục chat bình thường

---

## 4. Data Binding

| UI Element | API Endpoint | Field | Format | Ghi chú |
|-----------|-------------|-------|--------|---------|
| Discovery question | `POST /mia/sales-advisor/query` | `discovery_fields_needed[]` | `{question, quick_reply_options[]}` | Render nếu suggestions chưa sẵn sàng |
| Quick Reply chips | `POST /mia/sales-advisor/query` | `discovery_fields_needed[].quick_reply_options` | `string[]` | Max 4 chips per question |
| Suggestion product name | `GET /mia/sales-advisor/products` | `suggestions[].name` | string | |
| Suggestion rationale | `GET /mia/sales-advisor/products` | `suggestions[].rationale` | string | Bắt buộc có |
| Price range | `GET /mia/sales-advisor/products` | `suggestions[].price_band` | `{from, to, currency}` | Render "Từ X" nếu chỉ có lower bound |
| Promo note | `GET /mia/sales-advisor/products` | `suggestions[].policy_notes[]` | `string[]` | Chỉ render nếu có |
| Availability note | `GET /mia/sales-advisor/products` | `suggestions[].availability_confidence` | `"high"` \| `"medium"` \| `"low"` | Map sang wording theo bảng §3 |
| CTA options | `POST /mia/sales-advisor/query` | `cta_options[]` | `{label, type, payload}` | |
| Blocked state | `POST /mia/sales-advisor/query` | `warnings[]` + blocked flag | — | Render S4 nếu blocked |
| Lead form submit | `POST /mia/leads` | `{name, phone, session_id, product_interest}` | — | |

---

## 5. State Matrix

### Page-Level States

| State | Trigger | Visual | Ghi chú |
|-------|---------|--------|---------|
| **Loading** | Sau khi user submit | 3-dot typing indicator trong AI bubble | Ngay lập tức |
| **Discovery** | API cần thêm info | AI bubble + Quick Reply chips | Tối đa 3 lần |
| **Suggested** | Products sẵn sàng | Suggestion Cards (S3) | Default success |
| **Blocked** | Public-safe filter kích hoạt | Blocked bubble (S4) | Thân thiện, có CTA |
| **No Match** | Không có sản phẩm phù hợp | Fallback bubble + collection link + CTA | Không để dead-end |
| **Lead Capture** | Khách chọn CTA "Để lại thông tin" | Inline form S5 | |
| **Lead Submitted** | Form submit thành công | Success bubble | Tiếp tục cho phép chat |
| **Error** | API timeout | Bubble lỗi nhẹ: "Cho mình một chút nhé..." + auto-retry | Giữ ngữ điệu thân thiện |

### Component-Level States — Suggestion Card

| Component | Default | Hover | Active | Focus |
|-----------|---------|-------|--------|-------|
| CTA Primary button | Gradient pill | opacity 0.9 | Scale 0.98 | Ring 2px |
| CTA Ghost button | Transparent pill | `bg-[#ECF2FE]` | Scale 0.98 | Ring 2px |
| Quick Reply chip | Border ghost | `bg-[#ECF2FE]` | Scale 0.97 | Ring 2px |
| Product thumbnail | Normal | Scale 1.02, shadow-ambient up | — | — |

### Destructive Actions

| Hành động | Xác nhận | Ghi chú |
|-----------|----------|---------|
| Huỷ Lead Capture form | Không cần confirm — "Thôi, để sau" đủ rõ | Form biến mất, chat tiếp tục |

---

## 5.1 Error & Recovery

### Common Errors

| Error ID | Tại bước | Mô tả | Tần suất | Hỗ trợ | Recovery |
|----------|---------|-------|---------|--------|---------|
| E1 | Step 2 | Câu hỏi vượt public-safe (SLS-001) | Thỉnh thoảng | Blocked bubble thân thiện với 2 CTA | "Gặp nhân viên" hoặc "Hỏi câu khác" |
| E2 | Step 5 | Availability stale (SLS-009) | Thỉnh thoảng | Wording projection mềm + CTA xác nhận | "Xác nhận tại cửa hàng" CTA |
| E3 | Step 5 | Product context không đủ (SLS-008) | Thỉnh thoảng | Fallback: gợi ý collection thay vì SKU cụ thể | Link xem collection + CTA tư vấn thêm |
| E4 | Step 6 | Lead form submit lỗi | Hiếm | "Chưa gửi được. Thử lại nhé?" + Retry | Retry button inline |

### Dead-End Prevention Checklist

- [x] Blocked state luôn có 2 CTA: human handoff + tiếp tục chat
- [x] No-match state luôn có collection link + CTA tư vấn
- [x] Lead form fail có Retry
- [x] Quick Reply chips giúp giảm friction khi discovery
- [x] "Thôi, để sau" trong Lead Capture không kết thúc chat

### Guidance & Assistance

| Loại | Nơi | Nội dung |
|------|-----|---------|
| Welcome message | S1 mở lần đầu | "Xin chào! Tôi có thể giúp bạn tìm giày phù hợp. Bạn đang tìm kiểu giày gì?" |
| Post-suggestion | Sau S3 | "Bạn có muốn xem thêm sản phẩm tương tự không?" |
| Post-lead | Sau submit S5 | "Đã ghi nhận! Nhân viên sẽ liên hệ bạn trong thời gian sớm nhất." |

---

## 6. Copy & Microcopy (Vietnamese)

| Element | Nội dung tiếng Việt | Độ dài tối đa |
|---------|-------------------|--------------|
| Widget title | Tư Vấn Giày BQ | 20 ký tự |
| Welcome message | Xin chào! Tôi có thể giúp bạn tìm giày phù hợp. Bạn đang tìm kiểu giày gì? | 100 ký tự |
| Input placeholder | Nhập câu hỏi hoặc mô tả nhu cầu... | 50 ký tự |
| AI thinking | Đang tìm sản phẩm phù hợp... | 40 ký tự |
| Suggestion intro | Dựa trên nhu cầu của bạn, đây là một số gợi ý: | 60 ký tự |
| Price range | Từ [X]đ | — |
| Availability high | Còn hàng tại [cửa hàng] | — |
| Availability medium | Có thể còn tại [khu vực], nên xác nhận trước | — |
| Availability low | Liên hệ cửa hàng để xác nhận tình trạng hàng | 60 ký tự |
| Blocked message | Mình không thể cung cấp thông tin này. Bạn có thể liên hệ nhân viên để được hỗ trợ nhé! | 100 ký tự |
| CTA: xem sản phẩm | Xem sản phẩm | 15 ký tự |
| CTA: lead | Để lại thông tin | 20 ký tự |
| CTA: human | Gặp nhân viên tư vấn | 25 ký tự |
| CTA: continue | Hỏi câu khác | 15 ký tự |
| Lead form name label | Tên của bạn | 15 ký tự |
| Lead form phone label | Số điện thoại | 15 ký tự |
| Lead success | Đã ghi nhận! Nhân viên sẽ liên hệ bạn sớm. | 60 ký tự |
| No match | Mình chưa tìm thấy sản phẩm phù hợp, nhưng bạn có thể xem thêm tại đây | 80 ký tự |

---

## 7. Interaction & Animation

| Interaction | Animation | Duration | Easing |
|------------|-----------|----------|--------|
| AI typing | 3-dot pulse `#2F64F6` | 300ms stagger, loop | ease-in-out |
| Suggestion Card appear | Fade in + slide up 8px | 250ms | ease-out |
| Quick Reply chips appear | Staggered fade in (50ms each) | 200ms per chip | ease-out |
| Quick Reply chip select | Scale(0.95) + fade out | 150ms | ease-in |
| Lead form appear | Slide down + fade in | 200ms | ease-out |
| Lead form success | Fade out form + fade in success bubble | 200ms | ease-out |
| Widget open | Scale(0.95→1) + fade | 250ms | ease-out |
| Widget close | Scale(1→0.95) + fade | 180ms | ease-in |

> `prefers-reduced-motion`: tắt tất cả animation trừ opacity fade cơ bản.

---

## 8. Accessibility

- [ ] `aria-label="Gửi"` trên Send button (icon-only)
- [ ] Quick Reply chips là `<button>` elements với text accessible (không chỉ icon)
- [ ] `aria-live="polite"` trên Message Thread
- [ ] Lead form: mỗi input có `<label>` với `htmlFor` — không dùng placeholder-only
- [ ] `type="tel"` cho input số điện thoại
- [ ] `role="alert"` trên Blocked bubble và Error bubble
- [ ] Keyboard: Tab qua Quick Reply chips → Enter để chọn
- [ ] Focus sau submit Lead form: trở về input chat nếu close form

### Contrast Check

| Element | FG | BG | Tỉ lệ dự kiến | Pass |
|---------|----|----|--------------|------|
| Product name | `#013652` | `#FFFFFF` | ~12:1 | ✓ |
| Rationale text | `#3A6381` | `#FFFFFF` | ~5.5:1 | ✓ |
| Price text | `#013652` | `#FFFFFF` | ~12:1 | ✓ |
| User bubble | `#FFFFFF` | `#2F64F6` | ~4.8:1 | ✓ |
| AI bubble text | `#013652` | `#ECF4FF` | ~9:1 | ✓ |
| Quick Reply text | `#2F64F6` | `#FFFFFF` | ~4.7:1 | ✓ |

> **Cần verify thực tế** bằng DevTools contrast checker trước khi build.

---

## 9. A05 Technical Cross-Check

| Hạng mục | Kết quả | Ghi chú |
|----------|---------|---------|
| shadcn/ui mapping | Pending | `Button`, `Input`, `ScrollArea`, `Badge` cho chips |
| Token compatibility | Pending | Tất cả tokens từ `Design_System.md` |
| Animation practical | Pending | Staggered chip animation cần test perf trên mobile |
| Responsive aligns | Pending | Widget embed mode cần kiểm tra breakpoint riêng |
| Data binding matches API | Approved for FE Preview | Dùng mock/stub payload theo SRS §25; verify enum thật với BE sau FE review |
| Shared components | Pending | AI Bubble, User Bubble, Floating Dock share với M09 Internal Chat |

**A05 Sign-Off**: Preview technical cross-check accepted for mock/stub FE Preview; Integration Spec still required before BE build.

---

## 10. Pre-Delivery Checklist (A07)

- [ ] Design tokens khớp chính xác với `Design_System.md`
- [ ] Buttons đều `rounded-full` (pill)
- [ ] Quick Reply chips là `<button>`, không phải `<div>`
- [ ] Icons: Lucide SVG only
- [ ] Lead form: visible label trên mỗi input
- [ ] Be Vietnam Pro font render đúng dấu tiếng Việt
- [ ] Tất cả states: loading, discovery, suggested, blocked, no-match, lead-capture, lead-submitted, error
- [ ] Wording availability đúng theo confidence level (không cam kết sai)
- [ ] Touch targets ≥ 44x44px (đặc biệt Quick Reply chips)
- [ ] Responsive: desktop widget + mobile full-screen
- [ ] 100% copy tiếng Việt
- [ ] `prefers-reduced-motion` handled
- [ ] Accessibility attributes đã gắn

**A06 Design Sign-Off**: Approved for FE Preview (2026-04-16)
**A05 Tech Sign-Off**: Mock/stub preview only; BE integration gated separately (2026-04-16)
**PM Gate**: FE Preview opened by A01 PM Agent (2026-04-16)
