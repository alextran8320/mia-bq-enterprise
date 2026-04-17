# UXUI Feature Spec: F-M08-KNW-003 FAQ and Policy Library

**Feature ID**: F-M08-KNW-003
**Status**: Approved
**Owner**: A06 UI/UX Agent
**Implementation Reviewer**: A05 Tech Lead
**Implemented By**: A07 FE Builder
**Product**: MIA Smart / Platform
**Design System Reference**: [`Design/Design_System.md`](../Design_System.md)
**Save to**: `Design/UXUI_Features/UXUI-F-M08-KNW-003_FAQ_And_Policy_Library.md`
**Date**: 2026-04-16
**Last Updated By**: Claude Code (claude-sonnet-4-6)
**Last Reviewed By**: A06 UI/UX Agent · A05 Tech Lead · A01 PM Agent
**Approval Required**: PM Agent
**Approved By**: A01 PM Agent
**Last Status Change**: 2026-04-17
**Source of Truth**: This document for `F-M08-KNW-003` UXUI and FE Preview visual/interaction contract
**Blocking Reason**: -

> **Precondition Resolved**: Linked SRS `F-M08-KNW-003` đã ở `SRS Ready`; spec này là visual/interaction authority cho FE Preview bằng mock/stub data. BE/integration thật cần Integration Spec riêng trước khi promote lên `Build Ready`.

---

## §0. User & Task

### Target User Role(s)

| Role | Mô tả | Context |
|------|-------|---------|
| CSKH | Nhân viên chăm sóc khách hàng | Cần tra policy đổi trả, bảo hành nhanh |
| Ecommerce / Omnichannel | Nhân viên kênh online | Tra policy giao hàng, order flow |
| Store / Retail Operations | Nhân viên cửa hàng | Tra SOP vận hành, kiểm hàng |
| Ban điều hành | Quản lý cấp cao | Xem policy cross-domain |
| Marketing / Trade Marketing | Nhân viên marketing | Tra policy CTKM, campaign |

### Primary Task Objective

> Nhân viên tìm và đọc được tài liệu cần thiết trong **≤ 30 giây** từ khi mở library — không cần hỏi đồng nghiệp hoặc nhắn tin trong group chat.

### Success Metric

| Metric | Target | Cách đo |
|--------|--------|---------|
| Search → document found | ≤ 30s | Đo từ mở library đến đọc document |
| No-result rate | ≤ 20% searches | Tỉ lệ search không ra kết quả |
| Feedback submission | ≥ 5% of no-result | Tỉ lệ user báo gap sau no-result |

### Failure Indicators

- User search không ra kết quả và không biết làm gì tiếp
- User mở document nhưng không tìm được rule chính trong 10 giây
- User share link document nhưng link hết hạn hoặc sai version
- User thấy document deprecated nhưng không biết có bản mới

---

## 1. Feature Overview

### Purpose

Thư viện self-service cho nhân viên nội bộ tra cứu FAQ, SOP, Policy, System Guide theo domain và role. Entry point cả từ navigation và từ AI citation trong M09/M10.

### User Persona

Nhân viên CSKH hoặc cửa hàng BQ — đang phục vụ khách, cần tra nhanh rule không cần hỏi lead.

### User Story

```
Là nhân viên CSKH tại Giày BQ,
Tôi muốn tìm nhanh chính sách đổi trả hoặc SOP xử lý khiếu nại
trong thư viện tri thức,
Để trả lời khách chính xác mà không phải nhắn tin hỏi leader.
```

### Linked Artifacts

| Artifact | Location | Status |
|----------|----------|--------|
| Feature SRS | [`Analysis/Features/Modules/Knowledge_Center/FAQ_And_Policy_Library/SRS/F-M08-KNW-003_FAQ_And_Policy_Library_SRS.md`](../../Analysis/Features/Modules/Knowledge_Center/FAQ_And_Policy_Library/SRS/F-M08-KNW-003_FAQ_And_Policy_Library_SRS.md) | SRS Ready |

---

## 2. Screen Inventory

| # | Screen Name | Route/Path | Purpose | Notes |
|---|-------------|-----------|---------|-------|
| S1 | Library Landing | `/knowledge/library` | Search bar + quick topics + recent | Entry point |
| S2 | Search Results | `/knowledge/library?q=...` | Danh sách kết quả với badges | Filter + sort |
| S3 | Document Detail | `/knowledge/library/:id` | Nội dung đầy đủ + metadata | Read view |
| S4 | No-Result State | State trong S2 | Không tìm thấy kết quả | Guidance + gap report |
| S5 | Restricted State | State trong S3 | Không đủ quyền xem full content | Access info |
| S6 | Superseded State | State trong S3 | Đang xem bản cũ | Banner + redirect |
| S7 | FAQ Topic List | `/knowledge/library/faqs` | Nhóm FAQ theo topic | Browse |

---

## 2.1 Task Flow

### Primary Task Flow — User tìm tài liệu qua search

| Step | User Action | System Response | Field Visibility | Notes |
|------|------------|-----------------|-----------------|-------|
| 1 | Mở library hoặc click từ AI citation | S1 Library Landing với search bar focus | Search bar, quick topics, popular docs | Entry |
| 2 | Gõ keyword (VD: "đổi trả") | Live search suggestions sau 300ms | Suggested results | Type |
| 3 | Press Enter hoặc chọn suggestion | S2 Search Results với filters | Result list + filter chips | Results |
| 4 | Áp thêm filter (document type, owner department) | List update | Filter applied | Narrow |
| 5 | Click document | S3 Document Detail | Rule chính ở đầu, scope, ngoại lệ, body | Read |
| 6 | Share link hoặc gửi feedback | Copy link hoặc mở gap report form | — | Done |

### Decision Points & Branching

| At Step | Condition | Branch To |
|---------|-----------|----------|
| Step 3 | Không có kết quả | S4 No-Result State |
| Step 5 | User không đủ quyền xem full | S5 Restricted State |
| Step 5 | Document bị superseded | S6 Superseded banner |
| Step 1 | Đến từ AI citation | S3 trực tiếp, neo đúng version answer đã dùng |

### Progressive Disclosure Rules

- **Required**: Rule chính, scope áp dụng — luôn ở đầu S3
- **Optional**: Ngoại lệ, chi tiết đầy đủ — ở giữa S3
- **Advanced**: Version history, source links — collapse ở cuối S3

---

## 3. Visual Specification (Per Screen)

### Screen S1: Library Landing

#### Layout (ASCII Wireframe)

```
┌─────────────────────────────────────────────────────────────┐
│ PageHeader: "Thư viện tri thức"                             │
├─────────────────────────────────────────────────────────────┤
│ 🔍 [Tìm kiếm tài liệu, FAQ, chính sách...]                 │
├─────────────────────────────────────────────────────────────┤
│ Chủ đề phổ biến:                                           │
│ [Đổi trả] [Bảo hành] [Giá & CTKM] [SOP cửa hàng]          │
│ [Đặt hàng online] [Hướng dẫn hệ thống]                     │
├─────────────────────────────────────────────────────────────┤
│ Cập nhật gần đây:                                           │
│ [Policy] Chính sách đổi trả Q2   → CSKH, Ecomm  14/4      │
│ [SOP]    Kiểm hàng đầu ca        → Cửa hàng     13/4      │
│ [FAQ]    FAQ đặt hàng online     → Ecommerce    12/4       │
├─────────────────────────────────────────────────────────────┤
│ Xem thêm: [FAQ theo chủ đề →]                              │
└─────────────────────────────────────────────────────────────┘
```

#### Component Breakdown

| Component | Design Token | Notes |
|-----------|-------------|-------|
| Search bar | Input large, --radius-full | Focus on load; hint text nhẹ |
| Topic chips | Body Small 12px/600, outlined | Scroll horizontal |
| Recent doc row | Body 14px/400, hover | Badge type + persona tags |
| Document type badge | Caption 11px/600, color-coded | Policy/FAQ/SOP/Guide |
| Persona tag | Caption 11px/400, --color-bg-subtle | "CSKH", "Cửa hàng", "Ecomm" |

#### Design Token Values

| Element | Property | Token / Value |
|---------|----------|---------------|
| Search bar bg | `background` | `--color-bg-card` (#FFFFFF) |
| Search bar border | `border` | 1px solid `--color-border` |
| Search focus shadow | `box-shadow` | `--shadow-focus` (0 0 0 3px --color-primary-light) |
| Topic chip | outlined `--color-primary` | |
| Section heading | Body Small 13px/600, --color-text-secondary | |

---

### Screen S2: Search Results

#### Layout (ASCII Wireframe)

```
┌─────────────────────────────────────────────────────────────┐
│ ← Quay lại   🔍 [đổi trả___]   Tìm thấy 12 tài liệu      │
├─────────────────────────────────────────────────────────────┤
│ Loại: [Tất cả ▼] [Policy] [FAQ] [SOP]   Phòng ban: [Tất cả ▼]│
├─────────────────────────────────────────────────────────────┤
│ [Policy] Chính sách đổi trả Q2 2026                        │
│ CSKH / Ecommerce | Tài chính | 01/04/2026 | ● Còn mới      │
│                                                              │
│ [FAQ] Khách có thể đổi giày đã dùng không?                 │
│ CSKH | CSKH Lead | 15/03/2026 | ● Còn mới                  │
│                                                              │
│ [SOP] Quy trình xử lý đổi trả tại cửa hàng                │
│ Cửa hàng | Vận hành | 10/03/2026 | ⚠ Gần hết hạn          │
└─────────────────────────────────────────────────────────────┘
```

#### Design Token Values

| Element | Property | Token / Value |
|---------|----------|---------------|
| Result card hover | `background` | `--color-bg-hover` (#F1F5F9) |
| Freshness — Còn mới | `color` | `--color-success` (#16A34A) |
| Freshness — Gần hết hạn | `color` | `--color-warning` (#D97706) |
| Freshness — Hết hạn | `color` | `--color-danger` (#DC2626) |
| Result card border | `border-bottom` | 1px solid `--color-border` |

---

### Screen S3: Document Detail

#### Layout (ASCII Wireframe)

```
┌─────────────────────────────────────────────────────────────┐
│ ← Kết quả   [Policy] Chính sách đổi trả Q2 2026            │
│ Tài chính | v2.1 | Hiệu lực: 01/04/2026 | ● Còn mới        │
│ Áp dụng: CSKH / Ecommerce                  [Copy link]     │
├─────────────────────────────────────────────────────────────┤
│ QUY ĐỊNH CHÍNH                                              │
│ Khách được đổi trả trong vòng 14 ngày kể từ ngày mua.      │
├─────────────────────────────────────────────────────────────┤
│ PHẠM VI ÁP DỤNG                                            │
│ • Tất cả cửa hàng và kênh online                           │
│ NGOẠI LỆ                                                    │
│ • Hàng sale giảm > 50% không áp dụng                       │
├─────────────────────────────────────────────────────────────┤
│ Nội dung đầy đủ [...]                                       │
├─────────────────────────────────────────────────────────────┤
│ Tài liệu liên quan:                                        │
│ [SOP xử lý đổi trả] [FAQ đổi trả online]                   │
├─────────────────────────────────────────────────────────────┤
│ Nguồn: SAP B1 ✓ | KiotViet ✓ [Xem thêm ▼]                 │
│ Phiên bản: v2.1 (hiện tại) | v2.0 | v1.3 [Xem lịch sử ▼] │
│                           [Báo thiếu / sai thông tin]       │
└─────────────────────────────────────────────────────────────┘
```

#### Component Breakdown

| Component | Design Token | Notes |
|-----------|-------------|-------|
| Rule section header | Body 13px/700, --color-text-primary, all-caps | Đứng đầu — dễ scan |
| Rule content | Body 15px/400, --color-text-primary | Clear, readable |
| Scope / Exception | Body 14px/400, --color-text-secondary | Bullet list |
| Related docs | Body Small 13px/500, --color-primary link | Max 3 |
| Source badge | Caption 11px/400 + icon | Check ✓ = fresh, ⚠ = warning |
| Copy link button | Ghost button, Caption 12px/500 | Copy to clipboard |
| Gap report link | Text link, Caption 12px/400, --color-text-secondary | Bottom |

---

### Screen S4: No-Result State

```
┌─────────────────────────────────────────────────────────────┐
│ 🔍 Không tìm thấy kết quả cho "đổi hàng lỗi"              │
│                                                             │
│ Bạn có thể thử:                                            │
│ • Từ khóa liên quan: "đổi trả", "bảo hành", "khiếu nại"   │
│ • Lọc theo lĩnh vực: CSKH                                  │
│ • Xem FAQ theo chủ đề                                      │
│                                                             │
│ [Báo thiếu tài liệu →]                                    │
└─────────────────────────────────────────────────────────────┘
```

### Screen S5: Restricted State

```
┌─────────────────────────────────────────────────────────────┐
│ 🔒 Bạn không có quyền xem tài liệu này                     │
│                                                             │
│ Tài liệu "Chính sách giá nội bộ Q2" chỉ dành cho           │
│ Tài chính / Pricing Control.                                │
│                                                             │
│ Để được cấp quyền, liên hệ PM Governance.                  │
└─────────────────────────────────────────────────────────────┘
```

### Screen S6: Superseded State (Banner trong S3)

```
┌─────────────────────────────────────────────────────────────┐
│ ℹ Đây không phải phiên bản mới nhất                        │
│ Tài liệu này đã được thay thế bởi phiên bản mới hơn.       │
│ [Xem phiên bản mới nhất →]                                 │
└─────────────────────────────────────────────────────────────┘
```

---

## 4. Data Binding

| UI Element | API Endpoint | Field | Format |
|-----------|-------------|-------|--------|
| Search | `GET /mia/knowledge/library` | `q`, `domain`, `document_type`, `department`, `freshness_status` | Query params |
| Results | Response | `document_type`, `title`, `owner_department`, `effective_date`, `freshness_status` | Array |
| Document detail | `GET /mia/knowledge/policies/:id` | `detail`, `metadata`, `related_docs`, `access_flags`, `version_reference` | Object |
| FAQ list | `GET /mia/knowledge/faqs` | `topic_grouping`, `summary_answers`, `linked_documents` | Object |
| Feedback | `POST /mia/knowledge/library-feedback` | `document_id`, `feedback_type`, `comment`, `entry_point` | POST body |

---

## 5. State Matrix

### Search-Level States

| State | Trigger | Visual | Notes |
|-------|---------|--------|-------|
| Empty search | Landing | S1 với topics | Default |
| Searching | Typing | Live suggestions | Debounce 300ms |
| Results | Search complete | S2 | |
| No result | 0 results | S4 | |
| Error | API fail | "Không thể tìm kiếm lúc này." + Retry | |

### Document States

| State | Visual |
|-------|--------|
| Published | Normal, freshness badge |
| Stale | Warning badge trên S3 |
| Superseded | S6 Banner + link sang mới |
| Restricted | S5 — không show content |
| Deprecated | Ẩn khỏi search mặc định |

---

## 5.1 Error & Recovery

### Common Errors

| Error ID | At Step | Error Description | System Assistance | Recovery Action |
|----------|---------|-------------------|-------------------|----------------|
| E1 | Step 3 | No result | S4 với keyword suggestions và gap report | User báo gap hoặc thử lại |
| E2 | Step 5 | Access restricted | S5 với hướng dẫn xin quyền | Liên hệ PM |
| E3 | Step 5 | Document đã superseded | S6 banner với link sang mới | Click link mới |
| E4 | Step 6 | Copy link fail | Toast "Không thể copy. Hãy copy thủ công." + URL text | Hiện URL rõ |

### Dead-End Prevention Checklist

- [x] No-result state gợi ý keyword + gap report — không để user bí
- [x] Restricted state giải thích rõ + hướng dẫn tiếp theo
- [x] Superseded state dẫn sang version mới ngay
- [x] Mọi document có related docs để user tiếp tục browse

---

## 6. Copy & Microcopy (Vietnamese)

| Element | Vietnamese Text | Max Length |
|---------|----------------|-----------|
| Page title | Thư viện tri thức | 22 chars |
| Search placeholder | Tìm kiếm tài liệu, FAQ, chính sách... | 45 chars |
| Popular topics label | Chủ đề phổ biến | 18 chars |
| Recent label | Cập nhật gần đây | 20 chars |
| No-result title | Không tìm thấy kết quả cho "[keyword]" | 40+keyword |
| No-result suggest | Bạn có thể thử: | 20 chars |
| Gap report link | Báo thiếu tài liệu | 22 chars |
| Restricted title | Bạn không có quyền xem tài liệu này | 45 chars |
| Superseded banner | Đây không phải phiên bản mới nhất. | 40 chars |
| Superseded CTA | Xem phiên bản mới nhất | 25 chars |
| Copy link button | Copy link | 10 chars |
| Copy success | Đã copy link thành công | 25 chars |
| Feedback button | Báo thiếu / sai thông tin | 30 chars |

---

## 7. Interaction & Animation

| Interaction | Animation | Duration | Easing |
|------------|-----------|----------|--------|
| Search bar focus | Expand width slightly + shadow | 200ms | ease-out |
| Search results appear | Fade + slide-down | 200ms | ease-out |
| Document open (from search) | Fade in | 200ms | ease-out |
| Superseded banner | Fade in from top | 250ms | ease-out |
| Copy success | Toast slide from top-right | 300ms | ease-out |

---

## 8. Accessibility

- [x] `role="search"` trên search bar container
- [x] `aria-live="polite"` trên result count update
- [x] `aria-label` trên document type filter buttons
- [x] Document detail headings hierarchy: h1 (title) → h2 (Quy định chính) → h2 (Phạm vi) → h2 (Ngoại lệ)
- [x] Superseded banner: `role="alert"` để screen reader đọc
- [x] Restricted state: không hiển thị hidden content với screen reader
- [x] Related docs links: descriptive text, không phải "xem thêm"

---

## 9. A05 Technical Cross-Check

| Item | Verdict | Notes |
|------|---------|-------|
| Component mapping | ✓ | Search, Filter, Card, Badge, Toast |
| Token compatibility | ✓ | Tokens chuẩn |
| Animation practical | ✓ | Nhẹ, không distracting |
| Responsive aligns | ✓ | Single column ở mobile; filters collapse |
| Data binding matches API | ✓ | Map đủ từ SRS |
| Shared components | Reuse Badge từ KNW-001; Search từ design system |

**A05 Sign-Off**: Pending (2026-04-16)

---

## 10. Pre-Delivery Checklist (A07)

- [ ] Library landing với search focus và quick topics
- [ ] Live search suggestions (debounce 300ms)
- [ ] Search results với freshness badges
- [ ] Filter by type và department
- [ ] Document detail: rule chính ở đầu, progressive disclosure
- [ ] No-result state với keyword suggestions + gap report
- [ ] Restricted state với hướng dẫn
- [ ] Superseded banner với link sang version mới
- [ ] Copy link to clipboard
- [ ] Feedback gap report form
- [ ] FAQ topic list (/knowledge/library/faqs)
- [ ] Responsive: filters collapse ở mobile; single column
- [ ] 100% Vietnamese copy
- [ ] `prefers-reduced-motion` handled
- [ ] Accessibility: role="search", headings hierarchy, aria-live

**A06 Design Sign-Off**: Approved (2026-04-17) — Taxonomy theo domain (không phải persona); desktop-first; không tách public-safe FAQ ra riêng; no-result state có gap-report link đủ tốt.
**A05 Tech Sign-Off**: Approved (2026-04-17) — Search với debounce 300ms standard; scope filter = badge-based không cần ACL phức tạp cho FE Preview; domain menu static data.
**PM Gate**: Approved (2026-04-17) — Taxonomy và mobile scope đã chốt. Ready for A07 FE build (mock/stub only).
