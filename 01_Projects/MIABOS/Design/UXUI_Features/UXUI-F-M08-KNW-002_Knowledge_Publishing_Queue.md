# UXUI Feature Spec: F-M08-KNW-002 Knowledge Publishing Queue

**Feature ID**: F-M08-KNW-002
**Status**: Approved
**Owner**: A06 UI/UX Agent
**Implementation Reviewer**: A05 Tech Lead
**Implemented By**: A07 FE Builder
**Product**: MIA Smart / Platform
**Design System Reference**: [`Design/Design_System.md`](../Design_System.md)
**Save to**: `Design/UXUI_Features/UXUI-F-M08-KNW-002_Knowledge_Publishing_Queue.md`
**Date**: 2026-04-16
**Last Updated By**: A01 PM Agent (Claude Sonnet 4.6 — Claude Code CLI, incorporating research 2026-04-17)
**Last Reviewed By**: A06 UI/UX Agent · A05 Tech Lead · A01 PM Agent
**Approval Required**: PM Agent
**Approved By**: A01 PM Agent
**Last Status Change**: 2026-04-17
**Source of Truth**: This document for `F-M08-KNW-002` UXUI and FE Preview visual/interaction contract
**Blocking Reason**: -

> **Precondition Resolved**: Linked SRS `F-M08-KNW-002` đã ở `SRS Ready`; spec này là visual/interaction authority cho FE Preview bằng mock/stub data. BE/integration thật cần Integration Spec riêng trước khi promote lên `Build Ready`.

---

## §0. User & Task

### Target User Role(s)

| Role | Mô tả | Context |
|------|-------|---------|
| Knowledge Owner | Người gửi tài liệu vào queue | Submit version mới, theo dõi trạng thái |
| Domain Reviewer | Người duyệt theo domain | Xem diff, approve/reject với comment |
| PM Governance | Governance tổng | Freeze, rollback, override trong incident |
| Tài chính / Pricing Control | Reviewer pricing/promotion | Duyệt policy nhạy cảm về giá |

### Primary Task Objective

> Reviewer xem và duyệt publish request trong **≤ 3 phút** từ khi mở request đến khi lưu decision — có đủ thông tin để quyết định không cần hỏi thêm.

### Success Metric

| Metric | Target | Cách đo |
|--------|--------|---------|
| Review decision time | ≤ 3 phút | Đo từ mở request đến submit decision |
| Review rejection rate do thiếu info | ≤ 5% | Tỉ lệ reject vì reviewer không đủ thông tin |
| Rollback action time | ≤ 30s từ confirm | Đo từ click Rollback đến runtime update |

### Failure Indicators

- Reviewer không thể thấy sự khác biệt giữa version cũ và mới
- Decision submit nhưng không có comment → không audit được
- Rollback confirm nhưng runtime vẫn dùng version lỗi
- Queue list không phân biệt được SLA gần breach
- Reviewer không thấy hình ảnh/bảng/attachment được import trong tài liệu nên duyệt thiếu ngữ cảnh
- Queue bị đặt ở route riêng khiến reviewer mất context với cây nội dung Knowledge Center

---

## 1. Feature Overview

### Purpose

Cung cấp publishing queue như một section trong `/knowledge` với governance rõ ràng: owner submit → reviewer diff compare + approve/reject → publish runtime hoặc rollback khi incident. Đây là lớp kiểm soát bắt buộc trước khi bất kỳ knowledge nào vào AI runtime.

### User Persona

Domain Reviewer (Tài chính, CSKH lead, Ecommerce lead) — người bận rộn, cần review nhanh nhưng cần đủ context để quyết định đúng.

### User Story

```
Là Domain Reviewer tại Giày BQ,
Tôi muốn review publish request với đủ diff và source evidence
và approve / reject với comment rõ ràng,
Để knowledge runtime chỉ chứa nội dung đã được xác minh đúng domain.
```

### Linked Artifacts

| Artifact | Location | Status |
|----------|----------|--------|
| Feature SRS | [`Analysis/Features/Modules/Knowledge_Center/Knowledge_Publishing_Queue/SRS/F-M08-KNW-002_Knowledge_Publishing_Queue_SRS.md`](../../Analysis/Features/Modules/Knowledge_Center/Knowledge_Publishing_Queue/SRS/F-M08-KNW-002_Knowledge_Publishing_Queue_SRS.md) | SRS Ready |

---

## 1.1 Research Compliance — Approved Research Docs

> Spec này phải tuân thủ 4 Research docs đã được Business Owner approve ngày 2026-04-17:

| Research Doc | Link | Key Principles Applied |
|-------------|------|----------------------|
| Paradigm & Benchmark | [RES-M08-KNW_Paradigm_And_Benchmark.md](../../Research/Knowledge_Center/RES-M08-KNW_Paradigm_And_Benchmark.md) | Guru verification workflow — reviewer accountable cho từng card |
| UX Patterns & IA | [RES-M08-KNW_UX_Patterns_And_IA.md](../../Research/Knowledge_Center/RES-M08-KNW_UX_Patterns_And_IA.md) | Structured cards output; action confirmation patterns; UX Idempotency |
| Layout & Rich Document | [RES-M08-KNW_Knowledge_Center_Layout_And_Rich_Document_Research.md](../../Research/Knowledge_Center/RES-M08-KNW_Knowledge_Center_Layout_And_Rich_Document_Research.md) | Queue là section trong /knowledge — không phải route riêng; Rich content preview bắt buộc |

### UX Patterns bắt buộc trong spec này

| Pattern | Implemented ở | Status |
|---------|--------------|--------|
| Rich Content Preview trong review (image/table/attachment) | S2 Tab "Rich Content" | ✅ |
| Explicit confirmation cho action không thể undo (Rollback) | S4 Rollback Modal + confirmation text | ✅ |
| Decision Log — không approve/reject im lặng | S3 Comment bắt buộc | ✅ |
| UX Idempotency — tránh duplicate action | S3 Modal disable button sau submit | ⚠ Cần verify A07 |
| SLA urgency signal rõ | S1 color-coded SLA timer | ✅ |

---

## 2. Screen Inventory

| # | Screen Name | Route/Path | Purpose | Notes |
|---|-------------|-----------|---------|-------|
| S1 | Publishing Queue Section | `/knowledge?section=queue` | Danh sách requests với SLA, status trong workspace chung | Section trong `/knowledge` |
| S2 | Review Detail Panel | `/knowledge/review/:id` | Diff compare, rich content preview, source evidence, approval history | Panel/drawer trong workspace |
| S3 | Approve / Reject Modal | Modal overlay trong S2 | Submit decision với comment | Decision action |
| S4 | Rollback / Freeze Modal | Modal overlay | Confirm rollback/freeze với impact preview | Emergency action |
| S5 | Publish Failed State | State trong S1/S2 | Hiển thị khi publish job lỗi | Error state |

---

## 2.1 Task Flow

### Primary Task Flow — Reviewer duyệt publish request

| Step | User Action | System Response | Field Visibility | Notes |
|------|------------|-----------------|-----------------|-------|
| 1 | Mở `/knowledge` và chọn section `Chờ duyệt` | List sorted by: SLA breach risk → category/topic → date | SLA timer, category/topic, status | Entry |
| 2 | Click vào request | Mở S2 Review Detail Panel trong cùng workspace | Tabs: Summary, Diff, Rich Content, Source Evidence, Impact, History | Review |
| 3 | Xem tab Diff | Hiển thị side-by-side: version cũ vs mới, với changes highlight | Diff view | Core action |
| 4 | Xem tab Rich Content | Preview text, images, tables, attachments của version sẽ publish | Asset preview | Verify imported content |
| 5 | Xem tab Source Evidence | Danh sách sources, trust level, freshness | Source metadata | Verify |
| 6 | Click "Phê duyệt" hoặc "Từ chối" | Mở S3 Modal | Comment textarea, approval level | Decision |
| 7 | Nhập comment và submit | Ghi audit, publish / reject, trả về queue | — | Done |
| 8B | PM Governance: Click "Rollback" | Mở S4 Rollback Modal | Target version, runtime impact preview | Emergency |

### Decision Points & Branching

| At Step | Condition | Branch To |
|---------|-----------|----------|
| Step 2 | Domain = pricing, thiếu reviewer tài chính | Warning banner: cần thêm reviewer |
| Step 4 | Imported asset lỗi | Warning "Có hình ảnh/attachment chưa import thành công" |
| Step 7 | Approve → publish job fail | S5 Publish Failed State |
| Step 7 | Reject | Request trả về Draft với reason |
| Step 8B | Rollback confirmed | Runtime update; S1 refresh |

### Progressive Disclosure Rules

- **Required**: Diff view, rich content preview, source evidence — mặc định open tab Summary
- **Optional**: Full diff, approval history — tabs riêng
- **Advanced**: Raw publish job log — chỉ cho PM/IT trong S5

---

## 3. Visual Specification (Per Screen)

### Screen S1: Publishing Queue List

#### Layout (ASCII Wireframe)

```
┌─────────────────────────────────────────────────────────────┐
│ PageHeader: "Hàng chờ phê duyệt"                [Filters]  │
├─────────────────────────────────────────────────────────────┤
│ [Domain ▼] [Status ▼] [Reviewer ▼] [Priority ▼]            │
├─────────────────────────────────────────────────────────────┤
│ 🔴 SLA: còn 1h  | Pricing | Gửi bởi: Nguyễn A | In Review  │
│ ⚠ SLA: còn 4h  | CSKH   | Gửi bởi: Trần B   | Submitted  │
│ ✓              | SOP     | Gửi bởi: Lê C     | Published  │
└─────────────────────────────────────────────────────────────┘
```

#### Component Breakdown

| Component | Design Token | Notes |
|-----------|-------------|-------|
| SLA timer — urgent | Caption 12px/700, --color-danger | < 2h |
| SLA timer — warning | Caption 12px/600, --color-warning | 2–8h |
| SLA timer — ok | Caption 12px/400, --color-text-secondary | > 8h |
| Status badge | Caption 11px/600 | Color per status |
| Row | Body 14px/400, hover --color-bg-hover | Full row clickable |

#### Design Token Values

| Element | Property | Token / Value |
|---------|----------|---------------|
| Page bg | `background` | `--color-bg-page` (#F8FAFC) |
| SLA urgent | `color` | `--color-danger` (#DC2626) |
| SLA warning | `color` | `--color-warning` (#D97706) |
| Status Published | `background` | `--color-success-bg` (#DCFCE7) |
| Status In Review | `background` | `--color-warning-bg` (#FEF3C7) |
| Status Publish Failed | `background` | `--color-danger-bg` (#FEF2F2) |

---

### Screen S2: Review Detail

#### Layout (ASCII Wireframe)

```
┌─────────────────────────────────────────────────────────────┐
│ ← Quay lại   "Chính sách đổi trả Q2 2026"    SLA: 4h còn  │
├─────────────────────────────────────────────────────────────┤
│ [Tóm tắt] [So sánh thay đổi] [Nguồn] [Phạm vi] [Lịch sử] │
├─────────────────────────────────────────────────────────────┤
│ TAB: So sánh thay đổi                                       │
│ PHIÊN BẢN CŨ (v1.3)          │ PHIÊN BẢN MỚI (v2.0)       │
│ ...Khách được đổi trong 7 ngày│ ...Khách được đổi trong 14n │
│ [highlight red: 7 ngày]       │ [highlight green: 14 ngày]  │
├─────────────────────────────────────────────────────────────┤
│              [Từ chối]  [Phê duyệt →]                       │
└─────────────────────────────────────────────────────────────┘
```

#### Design Token Values

| Element | Property | Token / Value |
|---------|----------|---------------|
| Diff removed | `background` | `--color-danger-bg` (#FEF2F2), text color `--color-danger` |
| Diff added | `background` | `--color-success-bg` (#DCFCE7), text color `--color-success` |
| Tab active | `border-bottom` | 2px solid `--color-primary` |
| Approve button | `background` | `--color-primary` |
| Reject button | outlined `--color-danger` | |

---

### Screen S3: Approve / Reject Modal

```
┌─────────────────────────────────────────────────────────────┐
│ "Phê duyệt publish request"                        [✕]     │
│                                                             │
│ Nhận xét (bắt buộc): *                                     │
│ [Đã kiểm tra source SAP B1, policy nhất quán...]            │
│                                                             │
│ Cấp phê duyệt: ● Cấp 1 (Reviewer)  ○ Cấp 2 (PM Confirm)  │
│                                                             │
│              [Hủy]  [Xác nhận phê duyệt →]                 │
└─────────────────────────────────────────────────────────────┘
```

> Comment bắt buộc cho cả Approve và Reject. Không để phê duyệt im lặng.

---

### Screen S4: Rollback / Freeze Modal

```
┌─────────────────────────────────────────────────────────────┐
│ ⚠ Xác nhận hoàn nguyên phiên bản                  [✕]     │
│                                                             │
│ Tác động runtime: M09 và M10 sẽ ngừng dùng v2.0            │
│ Phiên bản mục tiêu: v1.3 (Approved 2026-03-15)            │
│                                                             │
│ Lý do hoàn nguyên (bắt buộc): *                            │
│ [Phát hiện sai thông tin về điều kiện đổi trả...]           │
│                                                             │
│ Xác nhận bằng cách gõ: ROLLBACK                            │
│ [___________]                                               │
│                                                             │
│              [Hủy]  [Xác nhận hoàn nguyên]                 │
└─────────────────────────────────────────────────────────────┘
```

> Rollback yêu cầu nhập confirmation text để tránh bấm nhầm.

---

## 4. Data Binding

| UI Element | API Endpoint | Field | Format |
|-----------|-------------|-------|--------|
| Queue list | `GET /mia/knowledge/publishing-queue` | `status`, `category`, `knowledge_topic`, `reviewer`, `priority`, `effective_date`, `review_sla_due_at` | List |
| Review detail | `GET /mia/knowledge/publishing-queue/:id` | Full request metadata + diff + `assets[]` + source evidence | Object |
| Approve | `POST /mia/knowledge/approve` | `request_id`, `approval_note`, `reviewer_role`, `approval_level` | POST body |
| Reject | `POST /mia/knowledge/reject` | `request_id`, `reason_code`, `comment` | POST body |
| Rollback | `POST /mia/knowledge/rollback` | `request_id`, `target_version_id`, `incident_note` | POST body |

---

## 5. State Matrix

### Request Status States

| Status | Badge | Color | Meaning |
|--------|-------|-------|---------|
| Submitted | Đã gửi | Blue | Chờ reviewer pick up |
| In Review | Đang xem xét | Yellow | Reviewer đang mở |
| Approved | Đã phê duyệt | Green | Chờ publish job |
| Published | Đã xuất bản | Green solid | Active runtime |
| Publish Failed | Lỗi xuất bản | Red | Job fail — cần xử lý |
| Rolled Back | Đã hoàn nguyên | Gray | Reverted |
| Rejected | Bị từ chối | Red | Trả về owner |

---

## 5.1 Error & Recovery

### Common Errors

| Error ID | At Step | Error Description | System Assistance | Recovery Action |
|----------|---------|-------------------|-------------------|----------------|
| E1 | Step 6 | Comment trống | "Vui lòng nhập nhận xét trước khi phê duyệt" | Focus textarea |
| E2 | Step 6 | Reviewer không đúng domain (pricing) | Warning: "Domain này cần reviewer Tài chính" | Hiện tên reviewer cần thêm |
| E3 | Post-approve | Publish job fail | S5 "Lỗi xuất bản — tài liệu chưa được kích hoạt" + contact IT | Hiện request ở Publish Failed |
| E4 | Step 7B | Rollback target bị deprecated | "Phiên bản mục tiêu không còn hợp lệ để hoàn nguyên." | Chọn phiên bản khác |
| E5 | Step 7B | Confirmation text không khớp | "Vui lòng gõ đúng ROLLBACK để xác nhận." | Focus input |

### Dead-End Prevention Checklist

- [x] Comment bắt buộc — không thể approve/reject không lý do
- [x] Publish Failed state rõ ràng — không để queue im lặng
- [x] Rollback confirmation text tránh nhầm bấm
- [x] SLA timer hiển thị rõ ngay từ queue list

---

## 6. Copy & Microcopy (Vietnamese)

| Element | Vietnamese Text | Max Length |
|---------|----------------|-----------|
| Page title | Hàng chờ phê duyệt | 25 chars |
| SLA urgent | SLA: còn [X] giờ — cần xử lý gấp | 35 chars |
| Approve button | Phê duyệt | 12 chars |
| Reject button | Từ chối | 10 chars |
| Approve modal title | Xác nhận phê duyệt | 22 chars |
| Reject modal title | Xác nhận từ chối | 20 chars |
| Comment label | Nhận xét (bắt buộc) | 22 chars |
| Rollback modal title | Xác nhận hoàn nguyên phiên bản | 35 chars |
| Publish Failed label | Lỗi xuất bản | 15 chars |
| Publish Failed message | Tài liệu chưa được kích hoạt trên runtime do lỗi xuất bản. Liên hệ IT để xử lý. | 90 chars |
| Rollback confirm text | ROLLBACK | fixed |

---

## 7. Interaction & Animation

| Interaction | Animation | Duration | Easing |
|------------|-----------|----------|--------|
| SLA timer | Count-down visual update | Every 60s | — |
| Modal open | Scale(0.95→1) + fade | 250ms | ease-out |
| Diff view load | Fade in | 200ms | ease-out |
| Decision success | Toast "Đã [phê duyệt / từ chối] thành công." | 300ms slide | ease-out |
| Rollback confirm | Shake animation nếu text sai | 300ms | ease-in-out |

---

## 8. Accessibility

- [x] `aria-modal="true"` trên tất cả modals
- [x] `aria-required="true"` trên comment textarea
- [x] `aria-live="assertive"` trên SLA urgent alerts
- [x] `role="tab"` và `role="tabpanel"` cho tab navigation trong S2
- [x] Focus trap trong modal
- [x] Focus sau close modal: trả về nút trigger (Approve/Reject)
- [x] Rollback confirmation input: `autocomplete="off"`, không allow paste

---

## 9. A05 Technical Cross-Check

| Item | Verdict | Notes |
|------|---------|-------|
| Component mapping | ✓ | Tabs, Diff view, Modal, Badge, Timer |
| Token compatibility | ✓ | Diff highlight dùng danger/success tokens |
| Animation practical | ✓ | Modal animation nhẹ |
| Responsive aligns | ✓ | Diff view scroll horizontal ở mobile |
| Data binding matches API | ✓ | Map đủ từ SRS |
| Shared components | Reuse Modal từ SLS-003; Badge từ KNW-001 |

**A05 Sign-Off**: Pending (2026-04-16)

---

## 10. Pre-Delivery Checklist (A07)

- [ ] Queue section trong `/knowledge` với SLA timer + color-coded urgency
- [ ] Tabs trong review detail (Summary, Diff, Rich Content, Source Evidence, Impact, History)
- [ ] Rich Content tab render image/table/attachment warnings
- [ ] Diff view side-by-side với highlight changes
- [ ] Approve/Reject modal với bắt buộc comment
- [ ] Publish Failed state rõ ràng
- [ ] Rollback modal với confirmation text input
- [ ] Freeze state (nếu có trong pilot scope)
- [ ] Responsive: diff scroll horizontal ở mobile
- [ ] 100% Vietnamese copy
- [ ] `prefers-reduced-motion` handled
- [ ] Accessibility: tabs, focus trap, aria-live

**A06 Design Sign-Off**: Approved (2026-04-17) — Queue list + diff view + 1-reviewer approve/reject flow rõ. Dual approval UI loại bỏ theo quyết định BO. Rollback ROLLBACK confirmation text giữ lại cho safety.
**A05 Tech Sign-Off**: Approved (2026-04-17) — 1-reviewer flow đơn giản; SLA timer 1-threshold; diff view là UI-only component, không cần BE phức tạp.
**PM Gate**: Approved (2026-04-17) — Approval workflow nằm ở SAP. Queue MIABOS chỉ là visibility layer. Ready for A07 FE build (mock/stub only).
