# PROPOSAL: MIA BOS — AI Operating Layer for Giày BQ

**Version**: 1.0 Draft
**Ngày**: 2026-04-17
**Chuẩn bị bởi**: MIA Solution
**Dành cho**: Giày BQ — Ban Lãnh Đạo & Team Vận Hành
**Trạng thái**: Draft — Chờ duyệt nội dung

---

---

# SECTION 1. Giới Thiệu MIA Solution

---

## Slide 1.1 — Cover

# MIA BOS
## AI Operating Layer cho Giày BQ

> *Từ dữ liệu phân mảnh đến AI vận hành thống nhất*

**MIA Solution** | Đồng hành chuyển đổi số cho doanh nghiệp Việt

---

## Slide 1.2 — Về MIA Solution

### Chúng tôi là ai?

**MIA Solution** là công ty SaaS B2B Việt Nam chuyên cung cấp nền tảng AI Marketing Automation cho doanh nghiệp vừa và nhỏ (SME). Chúng tôi tin rằng AI không phải là công nghệ xa vời — mà là công cụ vận hành thực tế giúp doanh nghiệp tăng trưởng bền vững hơn.

### Bộ sản phẩm

| Sản phẩm | Chức năng cốt lõi | Phù hợp cho |
|----------|-------------------|-------------|
| **MIA Smart** | AI Chatbot 24/7 — hội thoại đa kênh tự động | Sales, CSKH, Lead Capture |
| **MIA Spring** | AI Content Production — từ insight đến nội dung | Marketing, Campaigns |
| **MIA Scale** | AI Remarketing — tự động nuôi dưỡng & chăm sóc khách hàng | CRM, Retention |

### Số liệu tiêu biểu

- Đang triển khai cho nhiều khách hàng doanh nghiệp Việt Nam
- Kết nối đa kênh: Facebook, Zalo OA, WhatsApp, Website, SMS, Email, OmiCall
- Platform dựa trên **161+ collections Directus** — hạ tầng dữ liệu mạnh mẽ cho B2B

### Tầm nhìn chiến lược

> *"Đồng hành cùng 7–10% SME Việt Nam trong hành trình chuyển đổi số AI đến 2030"*

---

## Slide 1.3 — Năng Lực Nền Tảng

### Kiến trúc AI 3 lớp

```
┌─────────────────────────────────────────────────────┐
│              AI CORE                                │
│  Rule-based AI · Knowledge-based AI · Agent Thinking│
├─────────────────────────────────────────────────────┤
│           KNOWLEDGE LAYER                           │
│   Policy · FAQ · SOP · Product Knowledge            │
├─────────────────────────────────────────────────────┤
│         INTEGRATION LAYER                           │
│   ERP · POS · Ecommerce · CRM · Internal Systems    │
├─────────────────────────────────────────────────────┤
│          OMNICHANNEL DELIVERY                       │
│  Facebook · Zalo · WhatsApp · Website · SMS · Email │
│           OmiCall (VoIP)                            │
└─────────────────────────────────────────────────────┘
```

### Điều MIA làm khác biệt

- ✅ **Trust Layer** — Mọi câu trả lời AI đều có nguồn, freshness, và cảnh báo rõ ràng
- ✅ **Phase-based deployment** — Không áp đặt công nghệ, đồng hành theo từng giai đoạn trưởng thành
- ✅ **Vietnamese-first** — Hiểu ngữ cảnh vận hành bán lẻ Việt Nam
- ✅ **Data boundary** — Không expose raw data nhạy cảm, có access control theo role

---

---

# SECTION 2. Tổng Quan Giày BQ & Bài Toán Hiện Tại

---

## Slide 2.1 — Giày BQ Là Ai?

### Thương hiệu giày dép Việt Nam với hơn 20 năm kinh nghiệm

| Chỉ số | Số liệu |
|--------|---------|
| Thời gian hoạt động | Hơn 20 năm |
| Số lượng khách hàng | Hơn 2 triệu khách |
| Độ phủ | 43 tỉnh/thành phố |
| Mạng lưới | 200+ cửa hàng chính hãng & đại lý |

### Mô hình kinh doanh 4 lớp

```
┌─────────────────────────────────────────────────────────────────────┐
│                                                                     │
│  [ Nhà Cung Cấp ]  →  [ Brand HQ ]  →  [ Cửa Hàng / Đại Lý ]  →  │
│   NVL · OEM · ODM     Phân phối        Chính hãng · Nhượng quyền   │
│                        Catalog                                       │
│                        Pricing Policy  [ Người Tiêu Dùng ]          │
│                        Kho & Phân bổ    Đa kênh · Loyalty           │
│                                                                     │
└─────────────────────────────────────────────────────────────────────┘
```

### Kênh bán hàng hiện tại của BQ

- 🏪 **Cửa hàng chính hãng** — vận hành tại điểm bán trực tiếp
- 🤝 **Đại lý & nhượng quyền** — mạng lưới phân phối rộng khắp
- 🛒 **Ecommerce** — website, sàn TMĐT
- 📱 **Hotline & CSKH** — tổng đài hỗ trợ khách hàng
- 🎯 **Loyalty program** — khách hàng thân thiết, bảo hành trọn đời

---

## Slide 2.2 — Bức Tranh Hệ Thống Hiện Tại

### 5 hệ thống — 5 nguồn dữ liệu riêng biệt

```
┌─────────────┐   ┌──────────────┐   ┌──────────────┐
│  SAP B1     │   │  KiotViet    │   │  Haravan     │
│             │   │              │   │              │
│ • Item Master│  │ • POS Sales  │   │ • Ecommerce  │
│ • Warehouse │   │ • Store Inv. │   │ • Online CRM │
│ • Finance   │   │ • Customer   │   │ • Campaign   │
│ • Mua hàng  │   │ • POS Report │   │ • Omnichannel│
└─────────────┘   └──────────────┘   └──────────────┘
       ↑                  ↑                  ↑
       │                  │                  │
 ┌─────────────┐   ┌──────────────┐
 │  Excel      │   │  Lark        │
 │             │   │              │
 │ • Policy    │   │ • Workflow   │
 │   tables    │   │ • Approvals  │
 │ • Manual    │   │ • Forms      │
 │   reports   │   │ • Collab     │
 └─────────────┘   └──────────────┘
```

### Vấn đề cốt lõi

> **Không có lớp trung gian thống nhất** → Cùng một câu hỏi nghiệp vụ có thể cho ra nhiều đáp án khác nhau tùy theo hệ thống mà người dùng tra cứu.

---

## Slide 2.3 — 5 Bài Toán Cốt Lõi Của BQ

### Pain Point 1 — Dữ liệu phân mảnh

**Triệu chứng**: Nhân viên phải mở nhiều hệ thống để trả lời một câu hỏi. Mỗi hệ thống cho một con số khác nhau.

**Hệ quả**: Mất niềm tin vào dữ liệu nội bộ. Quyết định dựa trên thông tin không nhất quán.

**Ví dụ**: *"Tồn kho mã giày X size 41 là bao nhiêu?"* → SAP nói 50, KiotViet nói 43, thực tế là 38.

---

### Pain Point 2 — Tồn kho nằm sai chỗ

**Triệu chứng**: Không thiếu hàng, nhưng hàng đang nằm sai cửa hàng, sai kho, sai kênh.

**Hệ quả**: Mất doanh thu ở những nơi cần hàng, tồn đọng ở nơi không cần.

**Đặc thù ngành giày**: Quản lý tồn phải chính xác đến cấp `SKU × Size × Màu × Cửa hàng`.

---

### Pain Point 3 — Policy giá & CTKM phức tạp

**Triệu chứng**: BQ có chính sách 1 giá nhưng CTKM lại khác nhau theo kênh, loại cửa hàng, và đối tượng khách.

**Hệ quả**: Nhân viên không biết áp đúng CTKM. Khách hàng nhận thông tin mâu thuẫn giữa online và cửa hàng.

---

### Pain Point 4 — Quyết định CTKM còn thủ công

**Triệu chứng**: Xác định CTKM phù hợp (markdown, sell-through, bundle) hiện vẫn được thực hiện bằng tay.

**Hệ quả**: Phản ứng chậm với tồn đọng và biến động thị trường. Bỏ lỡ window tốt để xử lý hàng chậm bán.

---

### Pain Point 5 — Tri thức nằm trong đầu người

**Triệu chứng**: Policy, SOP, hướng dẫn hệ thống chỉ có một số nhân sự kỳ cựu biết. Người mới khó tiếp cận.

**Hệ quả**: Phụ thuộc cá nhân. Chi phí onboarding cao. Rủi ro khi nhân sự thay đổi.

---

---

# SECTION 3. Tầm Nhìn Giải Pháp: AI Operating Layer Theo Phase

---

## Slide 3.1 — Vì Sao Cần Roadmap AI Theo Phase?

### Bài học từ thực tế triển khai AI

> "AI không phải là chiếc đũa thần. AI chỉ thông minh được khi dữ liệu đầu vào đáng tin cậy."

**3 lý do cần phân phase:**

**1. Data readiness đi trước AI ambition**
Forecasting, campaign automation, và predictive recommendation đều yêu cầu data history đủ sạch. Nếu bỏ qua bước chuẩn hóa dữ liệu ngay từ đầu, các use case AI phức tạp sẽ cho kết quả không đáng tin và mất niềm tin người dùng.

**2. Niềm tin được xây dựng qua kết quả nhỏ có thể kiểm chứng**
Phase 1 tập trung vào read-only, hỏi đáp có nguồn. Người dùng thấy AI trả lời đúng → tin tưởng → sẵn sàng dùng AI cho các use case phức tạp hơn ở Phase 2, 3.

**3. Rollout an toàn theo từng nhóm người dùng**
Không triển khai đại trà ngay từ đầu. Pilot với nhóm nhỏ → đo lường → scale → mở cho toàn bộ tổ chức.

---

## Slide 3.2 — Tổng Quan Roadmap 4 Phase

### Lộ trình AI Operating Layer cho BQ

```
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

  PHASE 1              PHASE 2              PHASE 3         PHASE 4
  AI Nội Bộ       →   CRM + AI External →  Marketing AI  → Forecasting
  (Foundation)         (Customer Layer)     (Automation)    & BI

  ─────────────────────────────────────────────────────────────────────

  • Chatbot nội bộ     • Customer 360        • Campaign AI    • Demand
    hỏi đáp đa domain  • Sales Advisor AI    • Workflow AI      Forecast
  • Knowledge Layer    • Remarketing         • Content AI     • Inventory
    chuẩn hóa tri thức • Lead Capture        • HR automation    AI
  • Integration data   • Loyalty & care      • Social ops     • CTKM AI
    từ SAP/KV/Haravan                          automation     • ROI BI

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

  BEFORE: Dữ liệu phân mảnh, tri thức cá nhân, phản ứng thủ công
  AFTER:  AI vận hành thống nhất, tri thức tổ chức, scale tự động

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

### Mục tiêu mỗi phase

| Phase | Mục tiêu cốt lõi | Kết quả đo lường |
|-------|-----------------|-----------------|
| **Phase 1** | Xây nền dữ liệu & tri thức AI | Giảm thời gian tìm thông tin, tăng nhất quán trong câu trả lời |
| **Phase 2** | Hợp nhất ngữ cảnh khách hàng & tư vấn | Tăng chuyển đổi, cải thiện CSKH, xây dựng CRM thực sự có ích |
| **Phase 3** | Tự động hóa quy trình lặp lại | Tiết kiệm thời gian nhân sự, tăng quy mô vận hành không tăng headcount |
| **Phase 4** | Dự báo & ra quyết định dựa trên AI | Tối ưu tồn kho, CTKM đúng thời điểm, ROI đo được |

---

---

# SECTION 4. Chi Tiết Giải Pháp MIA BOS

---

## Slide 4.1 — Kiến Trúc Tổng Thể MIA BOS

### MIA BOS là một hệ thống AI Operating Layer đa tầng

```
┌──────────────────────────────────────────────────────────────────┐
│                        USER LAYER                                │
│   Ban Điều Hành  │  CSKH  │  Sales  │  Marketing  │  Store Mgr  │
│                     IT/ERP  │  Ecommerce                         │
├──────────────────────────────────────────────────────────────────┤
│                      AI INTERFACE LAYER                          │
│                                                                  │
│   ┌─────────────────────────┐  ┌──────────────────────────────┐  │
│   │  M09: Internal AI Chat  │  │  M10: Sales Advisor AI       │  │
│   │  Hỏi đáp nội bộ đa      │  │  Tư vấn bán hàng external   │  │
│   │  domain — có trust layer│  │  — public-safe boundary      │  │
│   └─────────────────────────┘  └──────────────────────────────┘  │
├──────────────────────────────────────────────────────────────────┤
│                   DOMAIN & KNOWLEDGE LAYER                       │
│                                                                  │
│   ┌──────────────┐  ┌──────────────┐  ┌───────────────────────┐ │
│   │ M08 Knowledge│  │ M06 CRM      │  │ M05 Orders & Service  │ │
│   │ Center       │  │ Workspace    │  │ Đơn hàng, đổi trả,    │ │
│   │ Tri thức đã  │  │ Customer 360 │  │ fulfillment, bảo hành │ │
│   │ phê duyệt    │  │ Identity Map │  └───────────────────────┘ │
│   └──────────────┘  └──────────────┘                            │
│   ┌──────────────┐  ┌──────────────┐  ┌───────────────────────┐ │
│   │ M01 Product  │  │ M03 Pricing  │  │ M04 Promotion         │ │
│   │ Catalog      │  │ Chính sách   │  │ CTKM đa kênh          │ │
│   │ Sản phẩm     │  │ giá hiệu lực │  └───────────────────────┘ │
│   └──────────────┘  └──────────────┘                            │
├──────────────────────────────────────────────────────────────────┤
│                 SECURITY & GOVERNANCE LAYER                      │
│   M07 Access Control · Role Masking · Audit Log · Consent Gate  │
├──────────────────────────────────────────────────────────────────┤
│                    INTEGRATION LAYER                             │
│   ┌────────────┐  ┌────────────┐  ┌────────────┐  ┌──────────┐ │
│   │  SAP B1    │  │  KiotViet  │  │  Haravan   │  │  Excel   │ │
│   │  ERP, Item │  │  POS, Store│  │  Commerce  │  │  Lark    │ │
│   │  Warehouse │  │  Inventory │  │  Online    │  │ (Support)│ │
│   └────────────┘  └────────────┘  └────────────┘  └──────────┘ │
└──────────────────────────────────────────────────────────────────┘
```

---

## Slide 4.2 — Phase 1: AI Chatbot Nội Bộ

### Mục tiêu Phase 1

Phase 1 tập trung vào **3 kết quả nền tảng**:

1. **Chuẩn hóa tri thức** — Tất cả policy, FAQ, SOP được đưa vào Knowledge Center có version và reviewer
2. **Truy cập dữ liệu bằng ngôn ngữ tự nhiên** — Nhân viên hỏi chatbot thay vì mở 3 hệ thống
3. **Tạo thói quen dùng AI trong vận hành hàng ngày** — Nền tảng niềm tin cho Phase 2, 3, 4

### Luồng xử lý AI Chat

```
   Người dùng gõ câu hỏi
            │
            ↓
   [Intent Classification]
   Policy / Data / Mixed / Unsupported
            │
            ↓
   [Access Check — M07]
   Role · Branch · Channel · Sensitivity
            │
       ┌────┴────┐
       ↓         ↓
  [KB Query]  [Data Query]
   M08 Policy   SAP B1 / KiotViet / Haravan
       │         │
       └────┬────┘
            ↓
   ┌─────────────────────────────────────┐
   │          ANSWER CARD                │
   │  ✅ Kết luận (trả lời trực tiếp)   │
   │  📎 Nguồn & Citation              │
   │  🕐 Freshness (updated khi nào?)   │
   │  ⚠️  Warning (nếu conflict/stale)  │
   │  ▶️  Next Action / Escalation      │
   └─────────────────────────────────────┘
```

### Tính năng Phase 1

| Nhóm tính năng | Câu hỏi mẫu người dùng có thể hỏi |
|----------------|----------------------------------|
| **Tồn kho** | "Giày mẫu X size 41 màu đen còn ở cửa hàng quận 1 không?" |
| **Giá & CTKM** | "CTKM hiện tại của mã ABC áp dụng cho kênh online không?" |
| **Sản phẩm** | "Mẫu giày Y có những size và màu nào? Chất liệu gì?" |
| **Đơn hàng** | "Đơn 1234567 của khách Nguyễn Văn A đang ở trạng thái gì?" |
| **Policy & SOP** | "Chính sách đổi trả đơn online trong 7 ngày là gì?" |
| **Hệ thống** | "Cách tạo đơn chuyển kho trên SAP B1 như thế nào?" |

### Đối tượng hưởng lợi Phase 1

| Role | Pain point giải quyết được |
|------|--------------------------|
| **Ban Điều Hành** | Tra cứu cross-domain, policy overview nhanh |
| **CSKH** | Trả lời khách hàng nhanh và chính xác hơn |
| **Sales** | Kiểm tra tồn kho và CTKM khi tư vấn khách |
| **Ecommerce** | Xử lý đơn online, policy giao hàng, refund |
| **Marketing** | CTKM đang áp dụng, campaign context |
| **IT / ERP** | Hướng dẫn thao tác nghiệp vụ trên các hệ thống |

---

## Slide 4.3 — Module Tính Năng (Feature Map)

### Bản đồ 12 Module của MIA BOS

```
┌─────────────────────────────────────────────────────────────────────┐
│                         PHASE 1 — FOUNDATION                       │
├──────────────────┬──────────────────┬──────────────────────────────┤
│  🛍️ M01          │  💰 M03          │  🎁 M04                      │
│  Product Catalog  │  Pricing         │  Promotion                   │
│  Sản phẩm        │  Chính sách giá  │  CTKM đa kênh               │
│  thống nhất       │  đang hiệu lực   │  theo loại đơn               │
├──────────────────┼──────────────────┼──────────────────────────────┤
│  📦 M05          │  🔐 M07          │  📚 M08                      │
│  Orders &        │  Security &      │  Knowledge Center            │
│  Service         │  Access          │  Tri thức phê duyệt          │
│  Đơn hàng,       │  Phân quyền      │  có version &                │
│  đổi trả,        │  Masking         │  citation                    │
│  bảo hành        │  Audit           │                              │
├──────────────────┼──────────────────┼──────────────────────────────┤
│  🤖 M09          │  🚨 M11          │                              │
│  Internal        │  Escalation      │                              │
│  AI Chat         │  Handoff khi     │                              │
│  Chatbot nội bộ  │  vượt scope AI   │                              │
│  hỏi đáp         │                  │                              │
├──────────────────┴──────────────────┴──────────────────────────────┤
│                         PHASE 2 — CUSTOMER LAYER                   │
├──────────────────┬──────────────────────────────────────────────────┤
│  👥 M06          │  💬 M10                                         │
│  CRM Workspace   │  Sales Advisor AI                               │
│  Customer 360    │  Tư vấn bán hàng                                │
│  Identity Map    │  external (public-safe)                         │
│  Care Action     │                                                 │
├──────────────────┴──────────────────────────────────────────────────┤
│                     PHASE 3/4 — SCALE & PREDICT                    │
├──────────────────────────────────────────────────────────────────────┤
│  📊 M12 Analytics · 📈 M14 Business Analytics & ROI Dashboard      │
└──────────────────────────────────────────────────────────────────────┘
```

---

## Slide 4.4 — Đề Xuất Tích Hợp

### Mô hình tích hợp Phase 1 — Read-Only Safety First

```
  ┌───────────────────────────────────────────────────────────────────┐
  │                       MIA BOS CORE                               │
  │                                                                   │
  │  ┌─────────────────────┐   ┌──────────────────────────────────┐  │
  │  │   Knowledge Center   │   │        CRM & Order Layer         │  │
  │  │       (M08)          │   │       (M06 + M05)                │  │
  │  │                      │   │                                  │  │
  │  │  Policy · FAQ · SOP  │   │  Customer 360 · Order Summary    │  │
  │  │  System Guide        │   │  Identity Map · Timeline         │  │
  │  └──────────┬───────────┘   └──────────────┬───────────────────┘  │
  │             │ Knowledge                     │ Data Summary          │
  └─────────────┼──────────────────────────────┼──────────────────────┘
                │                              │
  ┌─────────────▼──────────────────────────────▼─────────────────────┐
  │                    INTEGRATION LAYER                              │
  │                     (READ-ONLY Phase 1)                           │
  │                                                                   │
  │  ┌──────────────┐  ┌──────────────┐  ┌──────────────────────┐   │
  │  │   SAP B1     │  │  KiotViet    │  │      Haravan          │   │
  │  │              │  │              │  │                        │   │
  │  │ • Item Master│  │ • POS Sales  │  │ • Ecommerce orders    │   │
  │  │ • Warehouse  │  │ • Store Inv  │  │ • Online customer     │   │
  │  │ • Business   │  │ • POS Cust.  │  │ • Campaign/Channel    │   │
  │  │   Partner    │  │ • POS Report │  │ • Omni-channel inbox  │   │
  │  │ • Pricing    │  │              │  │                        │   │
  │  │   base       │  │              │  │                        │   │
  │  └──────────────┘  └──────────────┘  └──────────────────────┘   │
  │                                                                   │
  │        + Excel (policy supporting) · Lark (workflow)             │
  └───────────────────────────────────────────────────────────────────┘
```

### Source-of-Truth theo domain

| Domain | Source ưu tiên 1 | Source ưu tiên 2 | Ghi chú |
|--------|-----------------|-----------------|---------|
| Sản phẩm (item master) | SAP B1 | KiotViet | SAP là ERP canonical |
| Tồn kho cửa hàng | KiotViet | SAP B1 | KiotViet là POS operational |
| Đơn online | Haravan | SAP B1 | Haravan là ecommerce source |
| Hóa đơn POS | KiotViet | SAP B1 | Store-level transaction |
| Policy & Tri thức | M08 Knowledge Center | — | Internal canonical source |
| Customer profile | MIA BOS (CRM Layer) | Haravan / KiotViet ref | MIA là CRM master |

### Nguyên tắc tích hợp Phase 1

> 🔵 **Read-Only** — Không write-back về ERP trong Phase 1. MIA chỉ đọc và tổng hợp.

> 🔶 **Conflict → Cảnh báo** — Khi hai nguồn không khớp, AI hiển thị conflict warning thay vì tự chọn một nguồn.

> 🕐 **Freshness badge** — Mỗi câu trả lời gắn nhãn `synced_at` — người dùng biết dữ liệu mới đến mức nào.

> 🔐 **Access Gate** — Mọi câu trả lời đi qua M07 trước khi render — không lộ raw payload hoặc dữ liệu nhạy cảm.

---

## Slide 4.5 — Phase 2: CRM + AI External Chatbot

### Customer 360 — Nhìn thấy toàn cảnh mỗi khách hàng

```
  Khách hàng ─────────────────────────────────────────────┐
                                                           │
  ┌────────────────────────────────────────────────────────┼────────────┐
  │                       CUSTOMER 360                          M06      │
  │                                                                       │
  │  ┌────────────────────────────┐  ┌────────────────────────────────┐  │
  │  │     PROFILE HEADER         │  │        AI SUMMARY              │  │
  │  │  Tên · Life cycle · Consent│  │  Tóm tắt · Risk flag          │  │
  │  │  Owner · Preferred channel │  │  Next best action              │  │
  │  └────────────────────────────┘  └────────────────────────────────┘  │
  │                                                                       │
  │  ┌────────────────────────────────────────────────────────────────┐  │
  │  │                 IDENTITY MAP                                    │  │
  │  │   MIA ID · SAP BP Code · KiotViet ID · Haravan ID              │  │
  │  │   Facebook PSID · Zalo User ID · OmiCall ref                   │  │
  │  └────────────────────────────────────────────────────────────────┘  │
  │                                                                       │
  │  ┌──────────────┐ ┌────────────────┐ ┌───────────┐ ┌─────────────┐  │
  │  │ Order History│ │ Chat History   │ │  Calls    │ │  Timeline   │  │
  │  │ Đơn gần nhất │ │ Cuộc hội thoại │ │  Gọi điện │ │  Toàn bộ   │  │
  │  │ Status · SKU │ │ Intent · Feeling│ │  Outcome  │  sự kiện    │  │
  │  └──────────────┘ └────────────────┘ └───────────┘ └─────────────┘  │
  └───────────────────────────────────────────────────────────────────────┘
```

### Sales Advisor AI — Tư vấn bán hàng thông minh & an toàn

```
  Khách bắt đầu chat
          │
          ↓
  [Need Discovery — AI hỏi thêm 1–3 câu]
  "Bạn cần giày cho mục đích gì? Ngân sách khoảng bao nhiêu?"
          │
          ↓
  [Product Matching — Public-Safe Only]
  Sản phẩm phù hợp · Range giá an toàn · Ưu đãi public
          │
          ↓
  ┌──────────────────────────────────────────────┐
  │           SUGGESTION CARD                    │
  │  🥿 Sản phẩm A — Phù hợp vì: ...            │
  │  💰 Giá range: 400.000–600.000đ              │
  │  🎁 Ưu đãi: Giảm 10% dịp khai trương        │
  │  📍 Còn tại: Cửa hàng Q1, Q7, Bình Thạnh    │
  └──────────────────────────────────────────────┘
          │
          ↓
  [CTA — Chọn hành động tiếp theo]
  📋 Để lại thông tin  |  👤 Gặp nhân viên  |  🔍 Xem thêm
```

---

## Slide 4.6 — Phase 3 & 4 (Roadmap Preview)

### Phase 3: Marketing AI & Automation

| Tính năng | Mô tả | Lợi ích |
|-----------|-------|---------|
| Campaign AI | Tạo và tối ưu campaign tự động theo segment | Tiết kiệm thời gian marketing, tăng ROI |
| Remarketing AI | Tự động chăm sóc khách hàng theo hành vi & lịch sử | Tăng retention, giảm churn |
| Content AI | Tạo nội dung sản phẩm, caption, email theo brief | Scale content không tăng headcount |
| Workflow AI | Tự động hóa quy trình HR, tài chính, báo cáo | Giảm công việc lặp lại cho back-office |

### Phase 4: Forecasting & Decision Intelligence

| Tính năng | Mô tả | Điều kiện tiên quyết |
|-----------|-------|---------------------|
| Demand Forecast | Dự báo nhu cầu theo mùa, khu vực, kênh | Data history sạch Phase 1+2 |
| Inventory AI | Gợi ý phân bổ hàng tối ưu | Integration inventory đầy đủ |
| AI Pricing Recommendation | Gợi ý CTKM đúng thời điểm, đúng kênh | Price history + demand signal |
| ROI Dashboard | Đo lường toàn bộ hiệu quả AI theo tháng | Tracking từ Phase 1 |

> ⚠️ **Lưu ý quan trọng**: Phase 4 chỉ thực sự hiệu quả khi dữ liệu từ Phase 1 & 2 đã đủ sạch và đủ lịch sử. Đây là lý do Phase 1 là foundation không thể bỏ qua.

---

---

# SECTION 5. Demo Giao Diện

---

## Slide 5.1 — Internal AI Chat (M09)

*(Giao diện sẽ được bổ sung — placeholder)*

**Màn hình minh họa sẽ bao gồm:**

- **Chat Shell**: Giao diện hỏi đáp gọn — ưu tiên tốc độ nhập và đọc
- **Answer Card — Policy**: Kết luận → Trích dẫn policy → Ngày hiệu lực → Next action
- **Answer Card — Data**: Kết quả tra cứu tồn kho/đơn hàng → Source → Synced at → Conflict badge nếu có
- **Mixed Answer**: Tách rõ hai khối "Dữ liệu hiện tại" và "Chính sách áp dụng"
- **Blocked State**: Thay vì lỗi trắng — AI giải thích rõ tại sao không thể trả lời và đề xuất bước tiếp

---

## Slide 5.2 — Customer 360 (M06)

*(Giao diện sẽ được bổ sung — placeholder)*

**Màn hình minh họa sẽ bao gồm:**

- **Profile Header**: Tên, lifecycle badge, consent badge, duplicate alert
- **AI Summary Panel**: Tóm tắt khách 2–4 dòng, gợi ý hành động tiếp theo
- **Identity & Social Panel**: Các nguồn đã link và các profile social unresolved
- **History Tabs**: Orders · Conversations · Calls với summary-first  
- **Timeline**: Toàn bộ sự kiện khách hàng gom vào một dòng thời gian
- **Care Action CTA**: Nút tạo hành động chăm sóc ngay từ màn hình này

---

## Slide 5.3 — Sales Advisor AI (M10)

*(Giao diện sẽ được bổ sung — placeholder)*

**Màn hình minh họa sẽ bao gồm:**

- **Chat Entry**: Giao diện nhẹ, friendly với khách hàng
- **Need Discovery Flow**: AI hỏi lần lượt theo logic — không hỏi quá 3 câu
- **Suggestion Card**: Sản phẩm + Lý do phù hợp + Range giá + Availability hint + CTA
- **Blocked State**: Khi câu hỏi vượt public-safe boundary — AI lịch sự chuyển hướng

---

---

# SECTION 6. Chiến Lược Triển Khai

---

## Slide 6.1 — Lộ Trình Triển Khai Chi Tiết

### Tháng 1–2: FOUNDATION

```
  [Integration Setup]
  └── Kết nối đọc dữ liệu từ SAP B1, KiotViet, Haravan
  └── Thiết lập canonical product mapping layer
  └── Chốt source-of-truth rules theo domain

  [Knowledge Seeding]
  └── Workshop với domain experts BQ
  └── Tạo FAQ/Policy drafts cho: Pricing · Promotion · Đổi trả · Bảo hành · SOP
  └── Review và publish vào Knowledge Center

  [Internal AI Chat Pilot — M09]
  └── Deploy cho nhóm pilot: CSKH, Sales, Ecommerce (15–20 người)
  └── Read-only: Tồn kho · Giá · CTKM · Sản phẩm · Đơn hàng · Policy
  └── Audit log 100% câu trả lời
  └── Đo lường satisfaction & usage rate sau 2 tuần
```

### Tháng 3–4: EXPAND

```
  [CRM Workspace — M06]
  └── Customer 360 với identity mapping đa nguồn
  └── Order history & conversation history integration
  └── Duplicate detection console
  └── Care Action composer

  [Order & Service Context — M05]
  └── Order summary layer (Sales order, POS invoice, Return, Fulfillment)
  └── Feed context vào Customer 360 và Internal AI Chat

  [Sales Advisor AI Pilot — M10]
  └── Deploy trên 1–2 kênh sản phẩm (website hoặc Zalo OA)
  └── Public-safe boundary test
  └── Lead capture integration với M06 CRM
```

### Tháng 5+: SCALE

```
  [Marketing & Remarketing]
  └── Care automation dựa trên Customer 360
  └── Remarketing với consent gate

  [Analytics & Monitoring]
  └── Dashboard theo dõi answer quality, escalation rate
  └── Knowledge gap report → cải thiện Knowledge Center

  [Phase 3/4 Scoping]
  └── Review data readiness
  └── POC marketing automation và forecasting pilot
```

---

## Slide 6.2 — Governance & An Toàn Dữ Liệu

### Bảo mật được thiết kế từ đầu, không phải thêm vào sau

| Nguyên tắc | Cách MIA BOS thực hiện |
|------------|------------------------|
| **Role-Based Access** | Mỗi role chỉ thấy thông tin trong phạm vi được cấp phép (M07) |
| **Field Masking** | Số điện thoại, email được mask theo policy — không lộ raw cho role không có quyền |
| **Audit Trail** | 100% câu trả lời AI được log snapshot tại thời điểm trả lời — truy xuất được |
| **Consent Gate** | Không bao giờ gửi marketing nếu consent không hợp lệ |
| **No Raw Payload** | Không expose raw ERP payload ra ngoài AI answer layer |
| **Citation Required** | Policy answer bắt buộc phải có citation hợp lệ — không suy diễn |
| **Data Boundary** | MIA lưu summary layer — không mirror full ERP transaction payload |

---

---

# SECTION 7. Tại Sao MIA BOS?

---

## Slide 7.1 — Điểm Khác Biệt

### MIA BOS không phải là chatbot thông thường

| Vấn đề của BQ | Chatbot thông thường | MIA BOS |
|---------------|---------------------|---------|
| Dữ liệu phân mảnh | Chỉ đọc một nguồn | Integration layer + source-of-truth rules |
| Câu trả lời mâu thuẫn | Không có cơ chế phát hiện | Conflict detection → warning hiển thị rõ |
| Không biết dữ liệu có cũ không | Không báo | Freshness badge + synced_at timestamp |
| Policy thay đổi, chatbot vẫn sai | Không tự cập nhật | Knowledge Center có version + review cycle |
| Nhân viên không tin AI | Không có nguồn | Citation bắt buộc + source trace panel |
| Lộ dữ liệu nhạy cảm | Không có access control | M07 gate 100% câu trả lời trước render |
| Khách hàng thiếu ngữ cảnh | Không có CRM | Customer 360 hợp nhất từ tất cả nguồn |

---

## Slide 7.2 — Kết Quả Kỳ Vọng Phase 1

### Sau 2–3 tháng vận hành Phase 1

| Kết quả | Mục tiêu |
|---------|----------|
| Giảm thời gian đi tìm thông tin | ↓ 50% thời gian truy vấn nội bộ |
| Nhất quán câu trả lời | 100% câu trả lời AI có source và freshness |
| Trust layer | Mọi policy answer đều có citation hợp lệ |
| Knowledge coverage | Top 80% câu hỏi lặp lại của từng phòng ban được trả lời từ Knowledge Center |
| Nền tảng cho Phase 2 | CRM identity mapping đủ để mở Customer 360 |

### ROI kỳ vọng dài hạn

> Mỗi nhân viên tiết kiệm 30–60 phút/ngày đi tìm thông tin → với 50 nhân viên → **25–50 giờ/ngày** được giải phóng cho công việc tạo giá trị thực sự.

---

---

# SECTION 8. Closing & Next Steps

---

## Slide 8.1 — Executive Summary

### Ba điểm cốt lõi BQ cần ghi nhớ

**1. BQ đang vận hành tốt — nhưng phụ thuộc vào những thứ không scale được**

Tri thức nằm trong đầu người, dữ liệu nằm rải rác ở nhiều hệ thống. Khi BQ scale thêm 50–100 cửa hàng, những vấn đề này sẽ nhân lên gấp đôi.

**2. MIA BOS là AI Operating Layer theo phase — không phải "chatbot thử cho vui"**

Phase 1 xây nền dữ liệu và tri thức. Phase 2 tận dụng nền đó cho CRM và tư vấn thông minh. Phase 3, 4 mới có thể làm automation và dự báo hiệu quả. Không thể bỏ qua Phase 1.

**3. Phase 1 đủ cụ thể, demo-able, và an toàn để bắt đầu ngay**

- ✅ Read-only — không thay đổi dữ liệu hiện tại
- ✅ Pilot nhỏ trước — mở rộng sau khi được verify
- ✅ Có trust layer — không để AI trả lời sai mà không ai biết

---

## Slide 8.2 — Bước Tiếp Theo

### Kế hoạch hành động 4 tuần

| Tuần | Hành động | Output |
|------|-----------|--------|
| **Tuần 1** | Workshop chốt scope Phase 1 với team BQ (domain ưu tiên đầu tiên cho chatbot) | Scope document được sign-off |
| **Tuần 2** | POC Integration spike — kết nối thử nghiệm SAP B1 / KiotViet / Haravan read-only | Feasibility report |
| **Tuần 3** | Knowledge seeding session — workshop với domain expert BQ để tạo FAQ/Policy drafts | Bộ tri thức draft Phase 1 |
| **Tuần 4** | Timeline chi tiết, team assignment, và SLA cam kết | Project charter ký kết |

### Điều kiện để bắt đầu

- [ ] BQ cung cấp access đọc API / export SAP B1, KiotViet, Haravan
- [ ] Xác định 2–3 domain expert cho Knowledge seeding (Pricing, CSKH, IT)
- [ ] Xác định nhóm pilot người dùng (10–20 người đầu tiên)

---

## Slide 8.3 — Thông Tin Liên Hệ

**MIA Solution**

> Đồng hành cùng doanh nghiệp Việt trong hành trình chuyển đổi số AI

*[Thông tin liên hệ team MIA — sẽ được bổ sung]*

---

---

# APPENDIX

---

## A1 — Câu Hỏi Mẫu cho Chatbot Nội Bộ Phase 1

### Nhóm Tồn Kho & Sản Phẩm
- *"Giày mẫu BQ2023 size 41 màu đen còn ở kho/cửa hàng nào gần quận 7?"*
- *"Mẫu giày nam chạy bộ có những size nào đang còn hàng?"*
- *"SKU VN001-41-DEN tồn bao nhiêu đơn vị tại hệ thống?"*
- *"Sản phẩm X có chất liệu gì, bảo hành bao lâu?"*

### Nhóm Giá & CTKM
- *"CTKM tháng 4 áp dụng cho kênh ecommerce là gì?"*
- *"Khách mua combo 2 đôi được giảm bao nhiêu phần trăm?"*
- *"Chính sách chiết khấu cho đại lý loại A hiện tại như thế nào?"*
- *"Mã giảm giá SUMMER25 áp dụng cho những mặt hàng nào?"*

### Nhóm Đơn Hàng & CSKH
- *"Đơn hàng HD20240417001 đang ở trạng thái gì?"*
- *"Khách Nguyễn Văn A số 0901234567 có đơn nào đang chờ xử lý không?"*
- *"Đổi trả đơn online trong vòng 7 ngày cần những điều kiện gì?"*
- *"Chính sách bảo hành trọn đời của BQ áp dụng như thế nào?"*

### Nhóm Hệ Thống & SOP
- *"Cách tạo đơn chuyển kho trên SAP B1 như thế nào?"*
- *"Làm thế nào để tra cứu tồn kho realtime trên KiotViet?"*
- *"Quy trình xử lý đơn đổi trả trên Haravan gồm những bước nào?"*
- *"Ai cần được thông báo khi có đơn hàng bị khiếu nại về chất lượng?"*

---

## A2 — Assumptions & Risks

| Rủi ro | Xác suất | Mức độ ảnh hưởng | Biện pháp giảm thiểu |
|--------|----------|-----------------|---------------------|
| SAP B1 API access bị giới hạn hoặc chưa mở | Cao | Cao | Integration spike trong tuần 1; thống nhất read contract tối thiểu trước khi build |
| Knowledge nội bộ BQ chưa được viết thành tài liệu chuẩn | Cao | Trung bình | Workshop knowledge seeding — output là FAQ/Policy drafts làm tài liệu gốc |
| Dữ liệu KiotViet và SAP B1 không đồng nhất ở một số domain | Trung bình | Trung bình | Conflict detection layer — AI warn thay vì tự merge; không làm giả dữ liệu |
| User adoption thấp trong giai đoạn pilot | Thấp | Trung bình | UX ưu tiên tốc độ & trust; training session; champion người dùng trong pilot group |
| Excel policy không đủ chuẩn để dùng làm runtime source | Trung bình | Thấp | Excel chỉ là supporting evidence; phải có reviewer xác nhận mới được dùng |
| Haravan API rate limit hoặc contract đặc biệt | Thấp | Thấp | Clarify trước với BQ IT về existing API agreements |

---

## A3 — Stakeholder Map

| Stakeholder | Vai trò trong BQ | Domain chính quan tâm | Phase liên quan |
|-------------|-----------------|----------------------|----------------|
| **Ban Điều Hành** | Leadership, quyết định chiến lược | Policy overview, cross-domain analytics, KPI | P1, P4 |
| **CSKH** | Xử lý yêu cầu và khiếu nại khách hàng | Order status, policy đổi trả/bảo hành, hướng dẫn | P1 |
| **Sales (tại cửa hàng & online)** | Tư vấn và bán hàng | Sản phẩm, tồn kho, CTKM, Customer 360 | P1, P2 |
| **Marketing / Trade Marketing** | Campaign và quảng bá | CTKM, campaign, content, customer segment | P1, P3 |
| **IT / ERP / Data** | Quản trị hệ thống và dữ liệu | Integration, system guide, technical audit | P1 |
| **Store Manager** | Vận hành tại điểm bán | Tồn kho cửa hàng, giao dịch POS, đội tư vấn | P1 |
| **Ecommerce / Omnichannel** | Kênh online và đa kênh | Đơn online, fulfillment, refund, CSKH online | P1, P2 |
| **Logistics / Kho** | Giao nhận và phân bổ hàng | Transfer, fulfillment tracking, warehouse | P1 |

---

## A4 — Mapping Module → Business Domain

| Business Domain | Module chính | Nguồn dữ liệu |
|-----------------|-------------|---------------|
| Sản phẩm & Catalog | M01 | SAP B1 (master) · KiotViet · Haravan |
| Pricing & CTKM | M03, M04 | SAP B1 · Internal policy |
| Order & Fulfillment | M05 | Haravan · KiotViet · SAP B1 · Logistics |
| Customer & CRM | M06 | MIA (master CRM) · SAP BP · KV · HAR · Chat · OmiCall |
| Security & Governance | M07 | MIA internal — access rules |
| Knowledge Center | M08 | Internal docs · SAP B1 policy · SOP |
| Internal AI Chat | M09 | M08 + Integration layer |
| Sales Advisor AI | M10 | M08 (public-safe) + Product projection |
| Escalation & Workflow | M11 | MIA workflow engine |
| Analytics & BI | M12, M14 | MIA aggregated data |

---

*Tài liệu này được chuẩn bị bởi **MIA Solution** dựa trên phân tích toàn bộ SRS module (M01, M05, M06, M07, M08, M09, M10) và BQ Customer Research Pack.*

*Phiên bản: 1.0 Draft | Ngày: 2026-04-17*
