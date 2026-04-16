# UXUI Feature Spec: F-M12-OBS-001 Audit And Observability

**Feature ID**: F-M12-OBS-001
**Status**: Draft
**Owner**: A06 UI/UX Agent
**Implementation Reviewer**: A05 Tech Lead
**Implemented By**: A07 FE Builder
**Product**: MIA Smart / Platform
**Design System Reference**: [`Design/Design_System.md`](../Design_System.md)
**Save to**: `Design/UXUI_Features/UXUI-F-M12-OBS-001_Audit_And_Observability.md`
**Date**: 2026-04-16
**Last Updated By**: Claude Code (claude-sonnet-4-6)
**Last Status Change**: 2026-04-16

> **Precondition Resolved**: Linked SRS `F-M12-OBS-001` đã ở `SRS Ready` (promoted 2026-04-16); spec này là visual/interaction authority cho FE Preview bằng mock/stub data. Bật từ ngày đầu pilot. BE/integration thật cần Integration Spec riêng trước khi promote lên `Build Ready`.

---

## §0. User & Task

### Target User Role(s)

| Role | Mô tả | Context |
|------|-------|---------|
| PM / A01 | Product Manager theo dõi chất lượng AI và vận hành pilot | Cần nhìn thấy health tổng thể không cần mở log thủ công |
| Ops Governance | Người kiểm soát quyền truy cập và sensitivity rules | Cần theo dõi access denied, blocked answers |
| IT / ERP / Tech Ops | Kỹ thuật viên debug integration và AI pipeline | Cần log sâu, raw event, latency detail |

### Primary Task Objective

> PM/Ops mở dashboard và biết ngay hệ thống đang ở trạng thái nào (Healthy / Warning / Alert) trong **≤ 3 giây** — không cần đọc log thủ công.

### Success Metric

| Metric | Target | Cách đo |
|--------|--------|---------|
| Dashboard load time | ≤ 3s từ lúc mở page | Đo từ route load đến 4 panel render |
| Time-to-insight (phát hiện vấn đề) | ≤ 2 phút từ khi có alert | Đo từ alert → user drill-down → xác định root cause |
| False positive rate cho status badge | ≤ 5% | Số lần "Warning/Alert" mà thực tế không có vấn đề |

### Failure Indicators

- PM phải hỏi Tech Ops "hệ thống có ổn không?" thay vì tự xem dashboard
- Dashboard hiển thị `0` cho metric không có data (thay vì "Chưa đủ dữ liệu")
- Alert không có link drill-down — user không biết phải xem gì tiếp
- Tech Ops phải mở nhiều tab/tool để tổng hợp thông tin vào 1 bức tranh

---

## 1. Feature Overview

### Purpose

Cung cấp dashboard vận hành và observability tập trung cho PM/Ops/Tech để theo dõi sync health, AI answer quality, escalation rate, và access events của MIABOS pilot — bật từ ngày đầu, không có M12 thì không có cơ sở cải thiện có hệ thống.

### User Persona

PM và Ops đang vận hành pilot BQ — cần confidence rằng hệ thống đang hoạt động đúng, và khi có vấn đề thì biết ngay để xử lý.

### User Story

```
Là PM / Ops của MIABOS,
Tôi muốn xem được trạng thái vận hành của toàn bộ hệ thống trong 1 dashboard,
Để tôi phát hiện và xử lý vấn đề trước khi ảnh hưởng đến người dùng pilot.
```

### Linked Artifacts

| Artifact | Location | Status |
|----------|----------|--------|
| Feature SRS | [`Analysis/Features/Modules/Insights_And_Performance/Audit_And_Observability/SRS/F-M12-OBS-001_Audit_And_Observability_SRS.md`](../../Analysis/Features/Modules/Insights_And_Performance/Audit_And_Observability/SRS/F-M12-OBS-001_Audit_And_Observability_SRS.md) | Draft |

---

## 2. Screen Inventory

| # | Tên màn hình | Route | Mục đích | Mockup |
|---|-------------|-------|---------|--------|
| S1 | Ops Overview Dashboard | `/ops/dashboard` | Tổng quan 4 panel — entry point cho PM/Ops | `Design/Mockups/F-M12-OBS-001_S1_Ops_Overview.png` |
| S2 | Sync Health Drill-Down | `/ops/sync-health` | Chi tiết sync runs, lỗi, latency theo connector | `Design/Mockups/F-M12-OBS-001_S2_Sync_Health.png` |
| S3 | AI Quality Drill-Down | `/ops/ai-quality` | Answer success rate, blocked rate, top failing intents | `Design/Mockups/F-M12-OBS-001_S3_AI_Quality.png` |
| S4 | Audit Log Query | `/ops/audit-log` | Query raw audit log với filter — dành cho Tech Ops | `Design/Mockups/F-M12-OBS-001_S4_Audit_Log.png` |
| S5 | Alert Detail Panel | slide-in từ S1 | Chi tiết 1 alert: metric nào, threshold, timeline | `Design/Mockups/F-M12-OBS-001_S5_Alert_Detail.png` |

---

## 2.1 Task Flow

### Primary Task Flow — PM kiểm tra trạng thái hệ thống

| Step | Hành động của User | Phản hồi của Hệ thống | Field hiển thị | Ghi chú |
|------|---|----|---|---|
| 1 | Mở `/ops/dashboard` | Load S1 với 4 status panel và global status badge | Status badges, key metrics, sparklines | Load ≤ 3s |
| 2 | Đọc global status — nếu Healthy, không cần làm gì thêm | — | Global badge: `Healthy` / `Warning` / `Alert` | Happy path kết thúc ở đây |
| 3 | Nếu thấy Warning/Alert trên 1 panel → click panel đó | Drill-down sang S2/S3 tương ứng | Detail metrics, trend chart, event table | |
| 4 | Xác định vấn đề cụ thể (connector nào lỗi, intent nào fail nhiều) | Hiển thị event table với filter sẵn theo vấn đề | Event rows với status + timestamp | |
| 5 | Tùy chọn: click Alert icon để xem Alert Detail (S5) | Slide-in S5 với threshold info và timeline | Alert timeline, threshold config | |
| 6 | Quyết định corrective action và đóng dashboard | — | — | Out-of-scope cho UI |

### Primary Task Flow — Tech Ops debug integration

| Step | Hành động của User | Phản hồi của Hệ thống |
|------|---|----|
| 1 | Mở `/ops/audit-log` (S4) | Load audit log table với default filter: last 24h |
| 2 | Set filter: `module = I02 SAP B1`, `event_type = sync_failed`, `date_range = last 7d` | Table refresh, hiển thị matching events |
| 3 | Click 1 row để xem chi tiết | Expand row: full event payload (PII đã mask) |
| 4 | Export filtered result nếu cần share | Download CSV |

### Decision Points & Branching

| Tại bước | Điều kiện | Rẽ sang |
|---------|-----------|---------|
| S1 — Sync Health panel | Status = Alert | Panel border đỏ + icon alert + CTA "Xem chi tiết" → S2 |
| S1 — AI Quality panel | Status = Warning | Panel border vàng + CTA → S3 |
| S4 — Log query | Range > 7 ngày | Warning: "Query lớn, có thể chậm. Tiếp tục?" |
| S4 — Log row | Field có PII | Mask hiển thị `***` — không hiển thị raw ngay cả với Tech Ops |

---

## 3. Visual Specification

### Screen S1: Ops Overview Dashboard

#### Layout (ASCII Wireframe)

```
┌───────────────────────────────────────────────────────────────┐
│ TopBar (64px, glassmorphism, sticky)                          │
├────────────────┬──────────────────────────────────────────────┤
│                │ Label: "Insights & Performance" (11px)       │
│   Sidebar      │ H1: "Giám Sát Vận Hành"  (24px)             │
│   (240px)      │                                              │
│                │ [Global Status Badge]  [Last updated: X phút]│
│  bg:#ECF4FF    │                                              │
│                │ ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────┐│
│                │ │ Sync     │ │ AI       │ │Escalation│ │ Access   ││
│                │ │ Health   │ │ Quality  │ │   Rate   │ │ Denied   ││
│                │ │ [badge]  │ │ [badge]  │ │ [badge]  │ │ [badge]  ││
│                │ │ 98.2%    │ │ 94.1%    │ │  2.3%    │ │  12 lần  ││
│                │ │ [spark]  │ │ [spark]  │ │ [spark]  │ │ [spark]  ││
│                │ └──────────┘ └──────────┘ └──────────┘ └──────────┘│
│                │                                              │
│                │ ┌─────────────────────────────────────────┐ │
│                │ │ Recent Alerts (nếu có)                  │ │
│                │ │ [Alert row 1]  [Alert row 2]            │ │
│                │ └─────────────────────────────────────────┘ │
└────────────────┴──────────────────────────────────────────────┘
```

#### Status Panel — Component Spec

Mỗi trong 4 panel là 1 `Status Card`:

```tsx
// Status Card structure
<div className="bg-white rounded-2xl shadow-ambient p-5 cursor-pointer hover:shadow-glass transition-shadow">
  <div className="flex items-center justify-between mb-3">
    <span className="text-[11px] font-medium text-[#3A6381] uppercase tracking-wide">
      {panelLabel}
    </span>
    <StatusBadge status={status} />  {/* Healthy / Warning / Alert */}
  </div>
  <div className="text-[28px] font-bold text-[#013652] leading-none mb-2">
    {primaryMetric}
  </div>
  <Sparkline data={trendData} color={statusColor} />
  <p className="text-[13px] text-[#3A6381] mt-2">{metricLabel}</p>
</div>
```

#### Status Badge Color System

| Status | Background | Text / Border | Tailwind | Icon |
|--------|-----------|--------------|---------|------|
| `Healthy` | `#DCFCE7` | `#16A34A` | `bg-green-100 text-green-700` | `CheckCircle` Lucide |
| `Warning` | `#FEF9C3` | `#CA8A04` | `bg-yellow-100 text-yellow-700` | `AlertTriangle` Lucide |
| `Alert` | `#FEE2E2` | `#DC2626` | `bg-red-100 text-red-600` | `AlertOctagon` Lucide |
| `No Data` | `#F1F5F9` | `#64748B` | `bg-slate-100 text-slate-500` | `Minus` Lucide |

> **Quy tắc**: Color không phải indicator duy nhất — luôn có icon + text label kèm.

#### Global Status Badge

Hiển thị trạng thái xấu nhất trong 4 panel:
- Nếu tất cả Healthy → Global `Healthy`
- Nếu có 1 Warning → Global `Warning`
- Nếu có 1 Alert → Global `Alert` + pulse animation nhẹ (1s, `ring-2 ring-red-400/50`)

#### Recent Alerts Table

Chỉ hiển thị khi có alert trong 24h. Mỗi row:

| Element | Spec |
|---------|------|
| Row bg | `bg-white`, hover `bg-[#ECF2FE]` |
| Alert icon | `AlertOctagon` 16px, màu theo severity |
| Text | `text-[14px] text-[#013652]` — mô tả ngắn |
| Timestamp | `text-[13px] font-mono text-[#3A6381]` |
| CTA | Ghost button "Xem chi tiết" → mở S5 |

#### Design Token Values — S1

| Element | Property | Token / Value |
|---------|----------|---------------|
| Page bg | `background` | `#F6F9FF` |
| Status Card bg | `background` | `#FFFFFF` |
| Status Card radius | `border-radius` | `16px` |
| Status Card shadow | `box-shadow` | `shadow-ambient` |
| Status Card padding | `padding` | `20px` |
| Status Card — Alert border | `border` | `1px solid rgba(220,38,38,0.3)` — ghost border exception |
| Status Card — Warning border | `border` | `1px solid rgba(202,138,4,0.3)` |
| Primary metric font | `font-size / weight` | `28px / 700` (KPI Value style) |
| Sparkline | `height / color` | `24px / theo status color` |
| Last updated label | `font-size / color` | `11px / #3A6381` |

#### Responsive Behavior

| Breakpoint | Thay đổi |
|-----------|---------|
| Desktop (≥1024px) | 4 status cards hàng ngang, grid-cols-4 |
| Tablet (768–1023px) | 2×2 grid |
| Mobile (<768px) | Stack dọc, 1 card mỗi hàng |

---

### Screen S2: Sync Health Drill-Down

#### Layout

```
┌─────────────────────────────────────────────────────────┐
│ ← Quay lại    Sync Health — Chi tiết                    │
├────────────────────────────────┬────────────────────────┤
│ Time Filter: [24h] [7d] [30d]  │ Connector Filter: [All]│
├────────────────────────────────┴────────────────────────┤
│ ┌───────────┐ ┌───────────┐ ┌───────────┐ ┌──────────┐ │
│ │SAP B1     │ │KiotViet   │ │Haravan    │ │Overall   │ │
│ │ ✓ Healthy │ │ ⚠ Warning │ │ ✓ Healthy │ │ ⚠ Warning│ │
│ │ 99.1%     │ │ 96.2%     │ │ 98.8%     │ │ 98.0%    │ │
│ └───────────┘ └───────────┘ └───────────┘ └──────────┘ │
│                                                         │
│ [Line chart: success rate theo time cho connector]      │
│                                                         │
│ Sync Run Log Table                                      │
│ ┌─────────────────────────────────────────────────────┐ │
│ │ Connector │ Run ID    │ Status  │ Time   │ Error    │ │
│ │ SAP B1    │ run-0042  │ ✓ OK    │ 14:32  │ —        │ │
│ │ KiotViet  │ run-0041  │ ✗ Fail  │ 14:28  │ Timeout  │ │
│ └─────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────┘
```

**Table spec:**
- Header sticky, `bg-[#ECF4FF]`, height `44px`
- Row height `48px`, hover `bg-[#ECF2FE]`
- Status cell: icon + text — không chỉ màu
- Error cell: truncate với tooltip khi hover
- Click row → expand chi tiết run log (không navigate away)

---

### Screen S3: AI Quality Drill-Down

#### Layout

```
┌──────────────────────────────────────────────────────────┐
│ ← Quay lại    AI Quality — Chi tiết                     │
├──────────────────────────────────────────────────────────┤
│ [24h] [7d] [30d]    [All modules] [M09] [M10]           │
├──────────────────────────────────────────────────────────┤
│ ┌─────────────┐ ┌─────────────┐ ┌────────────────────┐  │
│ │ Answer      │ │ Blocked     │ │ Escalation Rate    │  │
│ │ Success     │ │ Rate        │ │                    │  │
│ │ 94.1%  ↑   │ │ 3.2%   ↓   │ │ 2.3%   →           │  │
│ └─────────────┘ └─────────────┘ └────────────────────┘  │
│                                                          │
│ [Bar chart: Top 10 failed / low-confidence intents]      │
│                                                          │
│ Answer Quality Event Table                               │
│ ┌────────────────────────────────────────────────────┐  │
│ │ Time  │ Intent        │ Type   │ Result  │ Warning │  │
│ │ 14:30 │ policy/return │ Policy │ ✓ OK    │ —       │  │
│ │ 14:28 │ stock/SKU-123 │ Data   │ ⚠ Warn  │ Stale   │  │
│ │ 14:25 │ price/intern  │ —      │ ✗ Block │ No perm │  │
│ └────────────────────────────────────────────────────┘  │
└──────────────────────────────────────────────────────────┘
```

**Intent bar chart:**
- Horizontal bar chart, Recharts `BarChart`
- X-axis: fail count, Y-axis: intent name
- Color: `#E11D48` cho blocked, `#F59E0B` cho warning, `#22C55E` cho success
- Tooltip: count + percentage

---

### Screen S4: Audit Log Query

#### Layout

```
┌───────────────────────────────────────────────────────────┐
│ ← Quay lại    Audit Log                                   │
├───────────────────────────────────────────────────────────┤
│ Filters:                                                  │
│ [Module: All ▼] [Event Type: All ▼] [Date Range: 7d ▼]   │
│ [Search: Actor / keyword...]     [Áp dụng] [Xuất CSV]    │
├───────────────────────────────────────────────────────────┤
│ Kết quả: 248 events                                       │
│ ┌──────────────────────────────────────────────────────┐  │
│ │ Timestamp   │ Module │ Event Type    │ Actor  │ Detail│  │
│ │ 14:32:01    │ M09    │ answer_blocked│ ***    │ [>]   │  │
│ │ 14:30:55    │ I02    │ sync_failed   │ system │ [>]   │  │
│ │ 14:28:12    │ M07    │ access_denied │ ***    │ [>]   │  │
│ └──────────────────────────────────────────────────────┘  │
│ [← 1 2 3 ... 25 →]                                       │
└───────────────────────────────────────────────────────────┘
```

**Quan trọng — PII Masking:**
- `Actor` field luôn hiển thị `***` ở table view
- Click `[>]` để expand row → hiển thị detail nhưng vẫn mask PII fields theo M07
- Không có nút "Hiện PII" — masking là absolute theo quy tắc M07

**Filter behavior:**
- Date range > 7 ngày: hiện warning "Query lớn, thời gian xử lý có thể lâu hơn"
- Date range > 30 ngày: disable button "Áp dụng", yêu cầu narrow thêm filter

---

### Screen S5: Alert Detail Panel (Slide-in)

```
┌──────────────────────────────────────┐
│ ✕  Chi tiết Alert                    │
├──────────────────────────────────────┤
│ 🔴 Escalation Rate vượt ngưỡng       │
│                                      │
│ Giá trị hiện tại:  8.2%             │
│ Ngưỡng cấu hình:   5.0%             │
│ Bắt đầu từ:        14:15 hôm nay    │
│                                      │
│ [Sparkline: trend 6h gần nhất]       │
│                                      │
│ Hành động gợi ý:                     │
│ → Xem escalation queue (link)        │
│ → Kiểm tra AI quality (link)         │
│                                      │
│ [Điều chỉnh ngưỡng]  [Xem log đầy đủ]│
└──────────────────────────────────────┘
```

- Width: `360px` desktop, full-width mobile
- Background: `#FFFFFF`, `shadow-glass`, `rounded-2xl`
- Slide-in từ phải, `250ms ease-out`
- "Điều chỉnh ngưỡng": chỉ hiện với role Admin/PM — dẫn sang inline form trong panel

---

## 4. Data Binding

| UI Element | API Endpoint | Field | Format | Ghi chú |
|-----------|-------------|-------|--------|---------|
| Global Status Badge | `GET /mia/ops/metrics` | `overall_status` | `"healthy"` \| `"warning"` \| `"alert"` | Worst-of-4 panels |
| Sync Health metric | `GET /mia/ops/metrics?domain=sync` | `sync_success_rate`, `status` | `number (%)`, string | |
| AI Quality metric | `GET /mia/ops/metrics?domain=ai` | `answer_success_rate`, `blocked_rate` | `number (%)` | |
| Escalation metric | `GET /mia/ops/metrics?domain=escalation` | `escalation_rate`, `status` | `number (%)` | |
| Access Denied count | `GET /mia/ops/metrics?domain=access` | `denied_count_24h`, `status` | `number` | |
| Sparkline data | `GET /mia/ops/metrics` | `trend_data[]` | `{timestamp, value}[]` | Last 24h, 12 points |
| Recent alerts | `GET /mia/ops/metrics` | `active_alerts[]` | `{id, metric, value, threshold, started_at}` | Chỉ hiện nếu `length > 0` |
| Sync run table | `GET /mia/audit/query-log?module=I01-I05` | `run_events[]` | `{connector, run_id, status, timestamp, error}` | |
| AI quality table | `GET /mia/audit/query-log?module=M09,M10` | `answer_events[]` | `{timestamp, intent, answer_type, result, warning}` | |
| Audit log table | `GET /mia/audit/query-log` | `events[]` | `{timestamp, module, event_type, actor_masked, detail}` | Actor luôn masked |
| Last updated | `GET /mia/ops/metrics` | `snapshot_updated_at` | ISO timestamp | Render "X phút trước" |

---

## 5. State Matrix

### Page-Level States — S1 Overview

| State | Trigger | Visual | Ghi chú |
|-------|---------|--------|---------|
| **Loading** | Page load | Skeleton 4 cards (shimmer) | Hiển thị ngay |
| **All Healthy** | Tất cả metrics OK | 4 cards badge xanh, global badge Healthy | Default happy path |
| **Warning** | 1+ metric warning | Panel border vàng, global badge Warning | |
| **Alert** | 1+ metric alert | Panel border đỏ, global badge Alert + pulse ring | |
| **No Data** | Event pipeline gián đoạn | Badge "Chưa đủ dữ liệu" — KHÔNG hiển thị `0%` | Quan trọng — tránh false healthy |
| **Error** | API timeout | Error card: "Không tải được dữ liệu. Thử lại?" | |
| **Stale** | `snapshot_updated_at` > 10 phút | Banner vàng: "Dashboard có thể chưa cập nhật — cập nhật lúc [X]" | |

### Component States — Status Card

| State | Border | Badge | Cursor |
|-------|--------|-------|--------|
| Healthy | none | Green | pointer (clickable) |
| Warning | ghost amber | Yellow | pointer |
| Alert | ghost red | Red | pointer |
| No Data | none | Slate | pointer |
| Loading | none | Skeleton | default |

### Destructive Actions

| Hành động | Xác nhận |
|-----------|----------|
| Điều chỉnh alert threshold | Inline confirm: "Thay đổi ngưỡng từ X% → Y%. Xác nhận?" |

---

## 5.1 Error & Recovery

### Common Errors

| Error ID | Tại bước | Mô tả | Hỗ trợ | Recovery |
|----------|---------|-------|--------|---------|
| E1 | S1 load | API timeout (OBS-001) | Error card với "Thử lại" | Auto-retry 1 lần sau 3s, sau đó hiện manual Retry |
| E2 | S1 panel | Event pipeline gián đoạn, thiếu data (OBS-003) | Badge "Chưa đủ dữ liệu" thay vì `0` | Link "Xem chi tiết pipeline" → S2 |
| E3 | S4 audit log | Query quá rộng, timeout (OBS-002) | Inline warning trước khi query | Gợi ý narrow filter: "Thử giới hạn trong 7 ngày" |
| E4 | S5 threshold | Threshold change fail | Toast lỗi: "Không lưu được. Thử lại" | Retry button trong toast |

### Dead-End Prevention Checklist

- [x] Mọi Alert đều có "Hành động gợi ý" với link drill-down
- [x] "No Data" luôn có link xem pipeline health
- [x] Audit log timeout có gợi ý narrow filter — không chỉ báo lỗi
- [x] Stale dashboard có timestamp rõ — không silent show old data

---

## 6. Copy & Microcopy (Vietnamese)

| Element | Nội dung | Độ dài tối đa |
|---------|----------|--------------|
| Page Title | Giám Sát Vận Hành | 25 ký tự |
| Sync Health panel | Đồng Bộ Dữ Liệu | 20 ký tự |
| AI Quality panel | Chất Lượng AI | 15 ký tự |
| Escalation panel | Tỉ Lệ Escalation | 20 ký tự |
| Access Denied panel | Truy Cập Bị Chặn | 20 ký tự |
| Status Healthy | Bình thường | 15 ký tự |
| Status Warning | Cần chú ý | 15 ký tự |
| Status Alert | Cần xử lý ngay | 20 ký tự |
| No data label | Chưa đủ dữ liệu | 20 ký tự |
| Pipeline interrupted | Luồng dữ liệu bị gián đoạn | 35 ký tự |
| Stale warning | Dashboard có thể chưa cập nhật — cập nhật lúc [X] | 60 ký tự |
| Alert title pattern | [Metric] vượt ngưỡng / dưới ngưỡng | — |
| Threshold save confirm | Thay đổi ngưỡng từ X% → Y%. Xác nhận? | 50 ký tự |
| Actor masked | *** | — |
| PII masked field | [Đã ẩn] | — |

---

## 7. Interaction & Animation

| Interaction | Animation | Duration | Easing |
|------------|-----------|----------|--------|
| Page load | Skeleton shimmer 4 cards | 1.5s linear loop | — |
| Status card appear | Fade in | 200ms | ease-out |
| Alert pulse ring | `ring-2 ring-red-400/50` pulse | 1s ease-in-out, loop | — |
| Alert Detail slide-in | Slide từ phải | 250ms | ease-out |
| Alert Detail slide-out | Slide ra phải | 180ms | ease-in |
| Row expand (audit log) | Slide down + fade | 200ms | ease-out |
| Stale banner appear | Slide down từ trên | 200ms | ease-out |
| Chart load | Fade in | 300ms | ease-out |

> `prefers-reduced-motion`: tắt tất cả animation, dùng instant transition. Alert pulse thay bằng static red badge.

---

## 8. Accessibility

- [ ] Status cards đều có `aria-label="[Panel] — Trạng thái: [status]"` đầy đủ
- [ ] Global status badge: `role="status"`, `aria-live="polite"` (cập nhật khi refresh)
- [ ] Alert Detail: focus trap khi mở, focus trả về trigger button khi đóng
- [ ] Audit log table: `aria-sort` trên cột có sort, `aria-label` trên icon-only actions
- [ ] PII masked cells: `aria-label="Thông tin đã được ẩn vì lý do bảo mật"`
- [ ] Keyboard: Tab qua 4 status cards → Recent Alerts → navigation tiếp theo
- [ ] Alert pulse animation: disable khi `prefers-reduced-motion`

### Contrast Check

| Element | FG | BG | Tỉ lệ dự kiến | Pass |
|---------|----|----|--------------|------|
| KPI metric | `#013652` | `#FFFFFF` | ~12:1 | ✓ |
| Panel label | `#3A6381` | `#FFFFFF` | ~5.5:1 | ✓ |
| Healthy badge text | `#16A34A` | `#DCFCE7` | ~4.5:1 | ✓ kiểm tra |
| Warning badge text | `#CA8A04` | `#FEF9C3` | ~4.6:1 | ✓ kiểm tra |
| Alert badge text | `#DC2626` | `#FEE2E2` | ~4.5:1 | ✓ kiểm tra |

> Verify thực tế bằng DevTools contrast checker.

---

## 9. A05 Technical Cross-Check

| Hạng mục | Kết quả | Ghi chú |
|----------|---------|---------|
| shadcn/ui mapping | Pending | `Sheet` (Alert Detail), `Table`, `Badge`, `Select` (filters) |
| Recharts usage | Pending | `LineChart` (trend), `BarChart` (intent breakdown), `Sparkline` (mini) |
| Token compatibility | Pending | Status color system cần verify vs Design_System tokens |
| PII masking | Pending | Masking phải xảy ra server-side trước khi gửi về FE |
| Responsive | Pending | Grid 4→2→1 columns |
| Data binding | Pending | Verify `overall_status` computation logic với BE |

**A05 Sign-Off**: ___ (chờ SRS promote)

---

## 10. Pre-Delivery Checklist (A07)

- [ ] Design tokens từ `Design_System.md` canonical
- [ ] Status badge luôn có icon + text — không chỉ màu
- [ ] "Chưa đủ dữ liệu" hiển thị đúng — KHÔNG hiển thị `0` khi thiếu data
- [ ] PII masking hiển thị `***` cho Actor field, không bypass
- [ ] Alert pulse animation tắt khi `prefers-reduced-motion`
- [ ] Stale banner hiển thị khi `snapshot_updated_at` > 10 phút
- [ ] Audit log: Date range > 30 ngày → disable query, show warning
- [ ] Skeleton shimmer trên tất cả loading states
- [ ] Responsive: 4-col → 2-col → 1-col
- [ ] 100% copy tiếng Việt
- [ ] Accessibility attributes đầy đủ

**A06 Design Sign-Off**: ___ (YYYY-MM-DD)
**A05 Tech Sign-Off**: ___ (YYYY-MM-DD)
**PM Gate**: ___ (YYYY-MM-DD)
