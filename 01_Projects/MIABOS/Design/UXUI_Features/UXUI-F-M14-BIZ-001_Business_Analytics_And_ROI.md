# UXUI Feature Spec: F-M14-BIZ-001 Business Analytics And ROI

**Feature ID**: F-M14-BIZ-001
**Status**: Approved
**Owner**: A06 UI/UX Agent
**Implementation Reviewer**: A05 Tech Lead
**Implemented By**: A07 FE Builder
**Product**: MIA Smart / Platform
**Design System Reference**: [`Design/Design_System.md`](../Design_System.md)
**Save to**: `Design/UXUI_Features/UXUI-F-M14-BIZ-001_Business_Analytics_And_ROI.md`
**Date**: 2026-04-16
**Last Updated By**: Codex CLI (GPT-5.4 Codex environment)
**Last Reviewed By**: A01 PM Agent
**Approval Required**: PM Agent
**Approved By**: A01 PM Agent - FE Preview scope only
**Last Status Change**: 2026-04-16
**Source of Truth**: This document for `F-M14-BIZ-001` UXUI and FE Preview visual/interaction contract
**Blocking Reason**: -

> **Precondition Resolved**: SRS `F-M14-BIZ-001` hiện ở `SRS Ready`; spec này là visual/interaction authority cho FE Preview bằng mock/stub data. Production analytics vẫn là Phase 2 sau khi M05/M06/M10/M12 có đủ data volume và technical handoff được approve.

---

## §0. User & Task

### Target User Role(s)

| Role | Mô tả | Context |
|------|-------|---------|
| Ban điều hành / Owner | Quyết định cấp cao về chiến lược và đầu tư | Cần bức tranh tổng, không cần chi tiết kỹ thuật |
| Regional Manager | Quản lý vùng/khu vực | Cần so sánh chi nhánh trong scope — không xem ngoài scope |
| Marketing / Trade Marketing | Đánh giá hiệu quả CTKM và campaign | Cần promo comparison và funnel data |
| Sales Lead | Đánh giá conversion và lead quality | Cần funnel breakdown và AI lead impact |
| PM | Chứng minh ROI của AI investment | Cần AI ROI metrics có thể dùng cho báo cáo |

### Primary Task Objective

> Ban điều hành mở Executive Dashboard và đọc được top-4 KPI quan trọng nhất trong **≤ 3 giây** — không cần tổng hợp từ SAP B1, KiotViet, Haravan hay Excel.

### Success Metric

| Metric | Target | Cách đo |
|--------|--------|---------|
| Dashboard load time | ≤ 3s từ route load | Đo từ route load đến tất cả KPI card render |
| Time-to-comparison (Marketing) | ≤ 5 clicks để so sánh 2 CTKM | Đếm clicks từ mở dashboard đến side-by-side comparison |
| Export thành công | ≤ 10s cho view ≤ 12 tháng | Đo từ click Export đến file download |

### Failure Indicators

- Ban điều hành vẫn phải mở Excel để lấy số liệu sau khi có dashboard
- Marketing không xem được hiệu quả CTKM/campaign từ dashboard khi dữ liệu chưa được cấp đủ
- PM không có số cụ thể để chứng minh AI ROI với BQ leadership
- Dashboard hiển thị số không đáng tin khi insufficient data (thay vì thông báo rõ)

---

## 1. Feature Overview

### Purpose

Cung cấp dashboard analytics business tập trung cho các persona lãnh đạo và functional leads của BQ — tiêu thụ dữ liệu từ source systems/Data Warehouse khi sẵn sàng để hiển thị KPI trend, promo effectiveness, funnel conversion, và AI ROI. CTKM được xem là miền phân tích, không phải pain point của BQ.

### User Persona

Ban điều hành và functional leads BQ — cần evidence-based insight để ra quyết định, không cần biết hệ thống backend. Đặc biệt PM cần số liệu AI ROI để báo cáo đầu tư.

### User Story

```
Là thành viên Ban điều hành Giày BQ,
Tôi muốn xem hiệu quả vận hành tổng thể trên 1 dashboard thống nhất,
Để tôi ra quyết định nhanh mà không cần tổng hợp báo cáo thủ công từ nhiều hệ thống.
```

### Linked Artifacts

| Artifact | Location | Status |
|----------|----------|--------|
| Feature SRS | [`Analysis/Features/Modules/Insights_And_Performance/Business_Analytics_And_ROI/SRS/F-M14-BIZ-001_Business_Analytics_And_ROI_SRS.md`](../../Analysis/Features/Modules/Insights_And_Performance/Business_Analytics_And_ROI/SRS/F-M14-BIZ-001_Business_Analytics_And_ROI_SRS.md) | SRS Ready |

---

## 2. Screen Inventory

| # | Tên màn hình | Route | Persona chính | Mockup |
|---|-------------|-------|--------------|--------|
| S1 | Executive Dashboard | `/analytics/executive` | Ban điều hành | `Design/Mockups/F-M14-BIZ-001_S1_Executive.png` |
| S2 | Business Performance Dashboard | `/analytics/performance` | Regional Manager, Ops | `Design/Mockups/F-M14-BIZ-001_S2_Performance.png` |
| S3 | CRM & Funnel Dashboard | `/analytics/funnel` | Marketing, Sales Lead | `Design/Mockups/F-M14-BIZ-001_S3_Funnel.png` |
| S4 | AI ROI Dashboard | `/analytics/ai-roi` | PM, Ban điều hành | `Design/Mockups/F-M14-BIZ-001_S4_AI_ROI.png` |
| S5 | Promo Comparison Panel | slide-in hoặc sub-view từ S2/S3 | Marketing | `Design/Mockups/F-M14-BIZ-001_S5_Promo_Compare.png` |

---

## 2.1 Task Flow

### Primary Task Flow — Ban điều hành xem KPI tổng quan

| Step | Hành động | Phản hồi | Field hiển thị | Ghi chú |
|------|-----------|---------|---------------|---------|
| 1 | Mở `/analytics/executive` | Load S1 với 4 KPI cards và 2 mini charts | KPI cards, trend arrows, last refreshed | Load ≤ 3s |
| 2 | Đọc KPI — nếu on-target, không cần làm gì | — | — | Happy path |
| 3 | Thấy 1 KPI đang yellow/red → click card | Navigate sang view liên quan (S2/S3/S4) | Detail view | |
| 4 | Tùy chọn: thay đổi time period | Re-render với period mới | Same layout, data khác | |
| 5 | Tùy chọn: Export cho meeting | Download PDF/CSV | — | ≤ 10s |

### Primary Task Flow — Marketing so sánh CTKM

| Step | Hành động | Phản hồi |
|------|-----------|---------|
| 1 | Mở `/analytics/performance` (S2) → tab Promo Effectiveness |  Hiển thị promo list với key metrics |
| 2 | Chọn 2 CTKM muốn so sánh (checkbox) | Comparison mode active |
| 3 | Click "So sánh" | Mở S5 slide-in với side-by-side view |
| 4 | Đọc kết quả, export nếu cần | — |

### Decision Points & Branching

| Tại bước | Điều kiện | Rẽ sang |
|---------|-----------|---------|
| Bất kỳ KPI card | Insufficient data (`record_count < threshold`) | Hiển thị "Chưa đủ dữ liệu" — không hiển thị số |
| Promo comparison | Promo < 30 ngày hoặc < 50 apply events | Disable comparison, tooltip "Cần thêm dữ liệu để so sánh đáng tin" |
| Dimension filter | Regional Manager chọn ngoài scope | Block với message "Bạn không có quyền xem khu vực này" |
| Export | File > 12 tháng data | Warning về thời gian xử lý trước khi generate |

---

## 3. Visual Specification

### Screen S1: Executive Dashboard

#### Layout (ASCII Wireframe)

```
┌───────────────────────────────────────────────────────────────┐
│ TopBar (64px, glassmorphism, sticky)                          │
├────────────────┬──────────────────────────────────────────────┤
│                │ Label: "Insights & Performance"  (11px)      │
│   Sidebar      │ H1: "Tổng Quan Điều Hành"        (24px)      │
│   (240px)      │                                              │
│                │ [Period: Tuần này ▼]  [Xuất báo cáo]        │
│  bg:#ECF4FF    │ Last refreshed: 2 giờ trước                  │
│                │                                              │
│                │ ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────┐│
│                │ │ Doanh    │ │ Đơn hàng │ │AI Answer │ │Escalation││
│                │ │ Thu      │ │          │ │Success   │ │ Rate     ││
│                │ │ ↑ 12.3%  │ │ ↑ 8.1%   │ │ 94.2%    │ │ 2.1% ↓  ││
│                │ │ 2.4 tỷ   │ │ 1,240    │ │ ↑ vs kỳ │ │ vs kỳ   ││
│                │ └──────────┘ └──────────┘ └──────────┘ └──────────┘│
│                │                                              │
│                │ ┌─────────────────────┐ ┌────────────────┐  │
│                │ │ Sell-through weekly │ │ Promo conversion│ │
│                │ │ [Line chart]        │ │ [Bar chart]     │ │
│                │ └─────────────────────┘ └────────────────┘  │
└────────────────┴──────────────────────────────────────────────┘
```

#### KPI Card — Component Spec

```tsx
// KPI Card
<div className="bg-white rounded-2xl shadow-ambient p-5 cursor-pointer hover:shadow-glass transition-shadow">
  <p className="text-[11px] font-medium text-[#3A6381] uppercase tracking-wide mb-3">
    {kpiLabel}
  </p>
  <div className="flex items-end gap-3 mb-2">
    <span className="text-[28px] font-bold text-[#013652] leading-none">
      {formattedValue}
    </span>
    <TrendBadge value={changePercent} direction={direction} />
  </div>
  <p className="text-[13px] text-[#3A6381]">So với kỳ trước</p>
  <Sparkline data={trendData} className="mt-3" />
</div>
```

#### Trend Badge Spec

| Hướng | Label | Color | Icon |
|-------|-------|-------|------|
| Up (positive) | `+12.3%` | `#22C55E` | `TrendingUp` Lucide |
| Down (negative context) | `-2.1%` | `#E11D48` | `TrendingDown` |
| Down (positive context — e.g. escalation giảm là tốt) | `-2.1% ↓` | `#22C55E` | `TrendingDown` nhưng màu xanh |
| Neutral | `0%` | `#8EB6D9` | `Minus` |

> **Quy tắc context-aware**: Direction badge màu phụ thuộc vào ngữ nghĩa của metric, không phải chỉ hướng tăng/giảm. Escalation giảm → xanh. Revenue giảm → đỏ.

#### Design Token Values — S1

| Element | Property | Token / Value |
|---------|----------|---------------|
| Page bg | `background` | `#F6F9FF` |
| KPI Card bg | `background` | `#FFFFFF` |
| KPI Card radius | `border-radius` | `16px` |
| KPI Card shadow | `box-shadow` | `shadow-ambient` |
| KPI Card — hover | `box-shadow` | `shadow-glass` |
| KPI value | `font-size / weight` | `28px / 700` |
| KPI label | `font-size / color` | `11px / #3A6381` |
| Trend positive | `color` | `#22C55E` |
| Trend negative | `color` | `#E11D48` |
| Chart area | `background` | `#FFFFFF` padding 20px |
| Chart grid lines | `stroke` | `rgba(142,182,217,0.2)` |

#### Responsive Behavior

| Breakpoint | Thay đổi |
|-----------|---------|
| Desktop (≥1024px) | 4 KPI cards hàng ngang + 2 charts side-by-side |
| Tablet (768–1023px) | 2×2 KPI grid + charts stacked |
| Mobile (<768px) | 1-col stack toàn bộ; charts simplified (fewer data points) |

---

### Screen S2: Business Performance Dashboard

#### Layout

```
┌───────────────────────────────────────────────────────────┐
│ [Period ▼]  [Dimension: Chi nhánh ▼]  [Xuất CSV / PDF]    │
├───────────────────────────────────────────────────────────┤
│ Tabs: [Sell-through] [Promo Effectiveness] [Comparison]   │
├───────────────────────────────────────────────────────────┤
│                                                           │
│ [TAB: Sell-through]                                       │
│ ┌────────────────────────────────────────────────────┐   │
│ │ Sell-through Rate per Branch — Heatmap / Bar chart  │   │
│ │ Y: Chi nhánh  X: Tuần trong kỳ  Color: % rate      │   │
│ └────────────────────────────────────────────────────┘   │
│                                                           │
│ ┌────────────────────────────────────────────────────┐   │
│ │ Branch Performance Table                           │   │
│ │ Chi nhánh │ Revenue │ Orders │ Sell-through │ Trend│   │
│ └────────────────────────────────────────────────────┘   │
│                                                           │
│ [TAB: Promo Effectiveness]                                │
│ ┌───────────────────────┐ ┌──────────────────────────┐   │
│ │ Top CTKM (bar chart)  │ │ CTKM table với checkbox  │   │
│ │ Apply count + rate    │ │ [✓] CTKM-A  [✓] CTKM-B   │   │
│ └───────────────────────┘ │ [So sánh] button         │   │
│                           └──────────────────────────┘   │
└───────────────────────────────────────────────────────────┘
```

**Heatmap color scale (Sell-through):**
- `< 40%` → `#FEE2E2` (light red)
- `40–60%` → `#FEF9C3` (light yellow)
- `60–80%` → `#DCFCE7` (light green)
- `> 80%` → `#22C55E` bg (full green)
- Accessibility: color + số % trong mỗi cell

---

### Screen S3: CRM & Funnel Dashboard

#### Layout

```
┌─────────────────────────────────────────────────────────┐
│ [Period ▼]  [Segment: Tất cả ▼]  [Campaign: Tất cả ▼]  │
├─────────────────────────────────────────────────────────┤
│                                                         │
│ Conversion Funnel                                       │
│ ┌─────────────────────────────────────────────────┐    │
│ │  Lead Captured    ████████████████████  1,240   │    │
│ │  Contacted        ████████████████      890     │    │  ← 71.8%
│ │  Proposal Sent    ████████████          512     │    │  ← 57.5%
│ │  Converted        ████████              342     │    │  ← 66.8%
│ └─────────────────────────────────────────────────┘    │
│                                                         │
│ ┌──────────────────┐   ┌─────────────────────────────┐ │
│ │ By Segment       │   │ Remarketing Outcome         │ │
│ │ [Donut chart     │   │ [Bar: sent vs converted     │ │
│ │  max 5 segments] │   │  per campaign]              │ │
│ └──────────────────┘   └─────────────────────────────┘ │
│                                                         │
│ Segment Performance Table                               │
│ Segment │ Leads │ Converted │ Rate │ Revenue/lead       │
└─────────────────────────────────────────────────────────┘
```

**Funnel visualization:**
- Horizontal bar format (dễ đọc hơn traditional funnel pyramid trên dashboard data-dense)
- Mỗi stage: label + bar + số tuyệt đối + % conversion từ stage trên
- Color: `#2F64F6` gradient, opacity giảm dần theo stage
- Click stage → filter table bên dưới theo stage đó

**Insufficient data guard:**
- Segment có < 30 records → ô trong table hiển thị `—` với tooltip "Chưa đủ dữ liệu để tính đáng tin"
- Không hiển thị số, không hiển thị `0`

---

### Screen S4: AI ROI Dashboard

#### Layout

```
┌──────────────────────────────────────────────────────────┐
│ Label: "AI Workspace"  H2: "ROI & Hiệu Quả AI"           │
│ [Period ▼]  [Export báo cáo AI ROI]                      │
├──────────────────────────────────────────────────────────┤
│ ┌──────────────┐ ┌──────────────┐ ┌──────────────────┐   │
│ │ Answer       │ │ Escalation   │ │ Lead Captured    │   │
│ │ Success Rate │ │ Rate         │ │ qua AI           │   │
│ │ 94.2%  ↑    │ │ 2.1%  ↓(+)  │ │ 342 leads        │   │
│ └──────────────┘ └──────────────┘ └──────────────────┘   │
│                                                          │
│ ┌──────────────────────────────────────────────────┐    │
│ │ Answer Success Rate — trend theo tuần            │    │
│ │ [Line chart: success rate vs blocked rate vs     │    │
│ │  escalation rate — 3 lines, 12 weeks]            │    │
│ └──────────────────────────────────────────────────┘    │
│                                                          │
│ ┌─────────────────────┐  ┌──────────────────────────┐   │
│ │ Top Resolved Intents│  │ Thời gian xử lý tiết kiệm│   │
│ │ [Horizontal bar]    │  │ Ước tính: X giờ/tuần     │   │
│ │ policy/return: 380  │  │ [methodology note]       │   │
│ │ stock/query: 290    │  └──────────────────────────┘   │
│ └─────────────────────┘                                 │
└──────────────────────────────────────────────────────────┘
```

**AI ROI — "Thời gian tiết kiệm" card:**
- Hiển thị ước tính giờ/tuần tiết kiệm được dựa trên answered queries × avg handling time
- Luôn có `(i)` icon với tooltip giải thích methodology: "Ước tính dựa trên X query được AI trả lời × Y phút xử lý thủ công trung bình"
- Label: "Ước tính" — không claim exact number

---

### Screen S5: Promo Comparison Panel (Slide-in)

```
┌───────────────────────────────────────────────────────┐
│ ✕  So Sánh Chương Trình Khuyến Mãi                   │
├──────────────────────┬────────────────────────────────┤
│  CTKM A: Sale 9/9    │  CTKM B: Buy 2 Get 1          │
├──────────────────────┼────────────────────────────────┤
│  Apply count: 1,240  │  Apply count: 890             │
│  Conversion: 34.2%   │  Conversion: 41.8%            │
│  Avg discount: 18%   │  Avg discount: 33%            │
│  Revenue attr: 2.1tỷ │  Revenue attr: 1.4tỷ         │
│  Period: 7/9–14/9    │  Period: 1/9–30/9             │
├──────────────────────┴────────────────────────────────┤
│ [Bar chart: apply count per day — 2 series side-by-side]│
└───────────────────────────────────────────────────────┘
│ [Xuất so sánh này]                                    │
└───────────────────────────────────────────────────────┘
```

- Width: `560px` desktop (wider vì 2-column compare), full-width mobile (stacked)
- Insufficient data guard: nếu 1 trong 2 CTKM < 50 apply events → show "CTKM [X]: Chưa đủ dữ liệu để so sánh đáng tin" trong cột đó

---

## 4. Data Binding

| UI Element | API Endpoint | Field | Format | Ghi chú |
|-----------|-------------|-------|--------|---------|
| Revenue KPI | `GET /mia/analytics/performance` | `revenue.value`, `revenue.change_pct` | `number`, `%` | |
| Order volume KPI | `GET /mia/analytics/performance` | `orders.value`, `orders.change_pct` | `number`, `%` | |
| AI Answer Success KPI | `GET /mia/analytics/roi` | `answer_success_rate`, `change_pct` | `%` | Tái dùng từ M12 snapshot |
| Escalation Rate KPI | `GET /mia/analytics/roi` | `escalation_rate`, `change_pct` | `%` | Context: giảm = tốt |
| Sparkline data | `GET /mia/analytics/performance` | `trend[]` | `{date, value}[]` | |
| Branch performance table | `GET /mia/analytics/performance?dimension=branch` | `branches[]` | `{name, revenue, orders, sell_through, trend}` | M07 scope enforced |
| Promo effectiveness table | `GET /mia/analytics/performance` | `promos[]` | `{id, name, apply_count, conversion_rate, discount_depth, revenue_attributed}` | Chỉ show nếu `apply_count >= 50` |
| Funnel data | `GET /mia/analytics/funnel` | `stages[]` | `{label, count, conversion_from_prev}` | |
| Segment performance | `GET /mia/analytics/funnel?dimension=segment` | `segments[]` | `{name, leads, converted, rate, revenue_per_lead, record_count}` | Nếu `record_count < 30` → show `—` |
| AI ROI metrics | `GET /mia/analytics/roi` | `answer_success_rate`, `escalation_rate`, `lead_count`, `time_saved_est_hours` | | |
| Last refreshed | `GET /mia/analytics/performance` | `snapshot_updated_at` | ISO timestamp | Render "X giờ trước" |

---

## 5. State Matrix

### Page-Level States — Tất cả dashboards

| State | Trigger | Visual | Ghi chú |
|-------|---------|--------|---------|
| **Loading** | Page load | Skeleton cards + chart placeholders | Hiện ngay |
| **Populated** | Data returned | Normal display | Default |
| **Insufficient Data** | `record_count < threshold` | `—` hoặc "Chưa đủ dữ liệu" chip thay vì số | KHÔNG hiển thị `0` |
| **Stale** | `snapshot_updated_at` > refresh window | Banner: "Dữ liệu cập nhật lúc [X]. Snapshot tiếp theo: [Y]" | Không block xem |
| **Pending Snapshot** | First load / pipeline delay | "Đang tính toán — vui lòng quay lại sau [X] phút" | Không hiển thị partial data |
| **Scope Blocked** | User request ngoài M07 scope | "Bạn không có quyền xem khu vực này" — không error |
| **Error** | API failure | Error card + Retry | |

### Component States — KPI Card

| State | Default | Hover | Insufficient Data |
|-------|---------|-------|------------------|
| Card | Normal | `shadow-glass` | Grayed text, "Chưa đủ dữ liệu" chip |
| Trend badge | Colored | — | Hidden |
| Sparkline | Colored line | — | Flat gray line |

### Destructive Actions

Không có destructive action trong analytics — read-only layer.

---

## 5.1 Error & Recovery

### Common Errors

| Error ID | Tại bước | Mô tả | Hỗ trợ | Recovery |
|----------|---------|-------|--------|---------|
| E1 | Page load | Snapshot chưa sẵn sàng (BIZ-001) | "Đang tính toán. Quay lại sau [X] phút." | Auto-reload sau X phút hoặc manual Refresh |
| E2 | Promo comparison | CTKM < 50 apply events (BIZ-002) | Cột đó hiện "Chưa đủ dữ liệu" + tooltip | Disable comparison, gợi ý mở rộng date range |
| E3 | Dimension filter | Ngoài scope (BIZ-003) | "Bạn không có quyền xem khu vực này" | Gợi ý chọn lại dimension trong scope |
| E4 | Export | File quá lớn / timeout | "Xuất không thành công. Thử lại hoặc chọn range nhỏ hơn." | Retry, gợi ý narrow range |
| E5 | Funnel segment | Segment < 30 records | Cell hiển thị `—` với tooltip | Tooltip: "Cần thêm dữ liệu để tính đáng tin" |

### Dead-End Prevention Checklist

- [x] Insufficient data → `—` hoặc message rõ, không phải `0`
- [x] Scope blocked → message thân thiện, không phải lỗi kỹ thuật
- [x] Snapshot pending → ETA rõ, không phải spinner vô tận
- [x] Export fail → gợi ý narrow range, không chỉ báo lỗi

---

## 6. Copy & Microcopy (Vietnamese)

| Element | Nội dung | Độ dài tối đa |
|---------|----------|--------------|
| S1 Title | Tổng Quan Điều Hành | 25 ký tự |
| S2 Title | Hiệu Quả Kinh Doanh | 25 ký tự |
| S3 Title | Phễu Chuyển Đổi & CRM | 30 ký tự |
| S4 Title | ROI & Hiệu Quả AI | 20 ký tự |
| KPI: Revenue | Doanh Thu | 15 ký tự |
| KPI: Orders | Đơn Hàng | 15 ký tự |
| KPI: AI Answer Success | Tỉ Lệ Trả Lời Thành Công | 30 ký tự |
| KPI: Escalation | Tỉ Lệ Escalation | 20 ký tự |
| Trend vs previous | So với kỳ trước | 20 ký tự |
| Insufficient data | Chưa đủ dữ liệu | 20 ký tự |
| Insufficient data tooltip | Cần ít nhất [X] bản ghi để tính số liệu đáng tin | 60 ký tự |
| Snapshot pending | Đang tính toán. Vui lòng quay lại sau [X] phút. | 60 ký tự |
| Stale warning | Dữ liệu cập nhật lúc [X]. Snapshot tiếp theo: [Y]. | 60 ký tự |
| Scope blocked | Bạn không có quyền xem khu vực này. | 50 ký tự |
| Export button | Xuất báo cáo | 15 ký tự |
| Compare button | So sánh | 10 ký tự |
| Period selector options | Tuần này / Tháng này / Quý này / Tùy chỉnh | — |
| Time saved methodology note | Ước tính dựa trên số query được AI trả lời × thời gian xử lý thủ công trung bình | 100 ký tự |

---

## 7. Interaction & Animation

| Interaction | Animation | Duration | Easing |
|------------|-----------|----------|--------|
| Page load | Skeleton shimmer cards + chart areas | 1.5s linear loop | — |
| KPI card appear | Fade in + counter animation (0 → value) | 600ms | ease-out |
| Chart line draw | Draw animation từ trái sang phải | 800ms | ease-out |
| Tab switch | Cross-fade content | 200ms | ease-out |
| Promo Compare slide-in | Slide từ phải | 250ms | ease-out |
| Promo Compare slide-out | Slide ra phải | 180ms | ease-in |
| Period change | Fade out → skeleton → fade in | 300ms | ease-in-out |
| Funnel bar appear | Slide right từ 0 → value, staggered 80ms | 500ms | ease-out |

> `prefers-reduced-motion`: tắt counter animation, chart draw, funnel stagger. Dùng instant render.

---

## 8. Accessibility

- [ ] KPI cards: `aria-label="[Tên KPI]: [Giá trị], [Trend so với kỳ trước]"` đầy đủ
- [ ] Chart `role="img"` với `aria-label` mô tả key insight: "Biểu đồ doanh thu: tăng 12.3% so với tuần trước"
- [ ] Cung cấp data table alternative cho mỗi chart (toggle "Xem dạng bảng")
- [ ] Trend badges: không chỉ dùng màu — luôn có icon + số %
- [ ] Tab navigation: `role="tablist"`, `role="tab"`, `aria-selected`
- [ ] Insufficient data cells: `aria-label="Chưa đủ dữ liệu để tính"` thay vì `—`
- [ ] Period selector: accessible dropdown với keyboard navigation
- [ ] Export button: `aria-label="Xuất báo cáo dưới dạng PDF/CSV"`

### Contrast Check

| Element | FG | BG | Tỉ lệ dự kiến | Pass |
|---------|----|----|--------------|------|
| KPI value | `#013652` | `#FFFFFF` | ~12:1 | ✓ |
| KPI label | `#3A6381` | `#FFFFFF` | ~5.5:1 | ✓ |
| Trend positive | `#16A34A` | `#FFFFFF` | ~5.1:1 | ✓ |
| Trend negative | `#DC2626` | `#FFFFFF` | ~5.9:1 | ✓ |
| Insufficient data chip | `#64748B` | `#F1F5F9` | ~4.6:1 | ✓ kiểm tra |

---

## 9. A05 Technical Cross-Check

| Hạng mục | Kết quả | Ghi chú |
|----------|---------|---------|
| shadcn/ui mapping | Pending | `Tabs`, `Select`, `Sheet` (Compare panel), `Table`, `Button` |
| Recharts usage | Pending | `LineChart` (trend/ROI), `BarChart` (promo/intents), `FunnelChart` hoặc custom horizontal bar (funnel), `PieChart` → `RadialBarChart` (segment donut) |
| Counter animation | Pending | Cần thư viện hoặc custom hook — verify perf |
| M07 scope enforcement | Pending | BE phải filter trước khi gửi về FE — không filter client-side |
| Insufficient data guard | Pending | `record_count` field cần có trong mọi aggregate response |
| Shared components | Pending | KPI Card, Sparkline, Trend Badge share với M12 dashboard |
| Export PDF | Pending | Cần quyết định: server-side render hay client-side `@react-pdf/renderer` |

**A05 Sign-Off**: ___ (chờ SRS promote)

---

## 10. Pre-Delivery Checklist (A07)

- [ ] Design tokens từ `Design_System.md` canonical
- [ ] KPI counter animation tắt với `prefers-reduced-motion`
- [ ] `—` hiển thị đúng khi `record_count < threshold` — KHÔNG hiển thị `0`
- [ ] Trend badge: context-aware color (escalation giảm = xanh, không phải đỏ)
- [ ] Chart accessibility: `aria-label` mô tả insight chính, data table alternative
- [ ] Tab navigation accessible với keyboard
- [ ] M07 scope: Regional Manager không thấy data ngoài scope — verify với BE
- [ ] Stale banner hiển thị khi snapshot ngoài refresh window
- [ ] Export: warning trước khi generate file > 12 tháng
- [ ] Responsive: 4-col → 2-col → 1-col KPI grid
- [ ] Funnel horizontal bar format, không dùng pyramid
- [ ] 100% copy tiếng Việt
- [ ] Skeleton shimmer trên tất cả loading states

**A06 Design Sign-Off**: A01 PM approved for FE Preview scope (2026-04-16)
**A05 Tech Sign-Off**: ___ (YYYY-MM-DD)
**PM Gate**: PASS for FE Preview with mock/stub data (2026-04-16)
