# UXUI Feature Spec: F-M07-SEC-001 Access Control And Sensitivity

**Feature ID**: F-M07-SEC-001
**Status**: Draft
**Owner**: A06 UI/UX Agent
**Implementation Reviewer**: A05 Tech Lead
**Implemented By**: A07 FE Builder
**Product**: MIABOS / Operations And Governance
**Design System Reference**: [Aura_Minimalist_Design_System.md](../Aura_Minimalist_Design_System.md)
**Canonical Save Path**: `Design/UXUI_Features/UXUI-F-M07-SEC-001_Access_Control_And_Sensitivity.md`
**Date**: 2026-04-16
**Last Status Change**: 2026-04-16

> **Precondition**: SRS [F-M07-SEC-001](../../Analysis/Features/Modules/Operations_And_Governance/Access_Control_And_Sensitivity/SRS/F-M07-SEC-001_Access_Control_And_Sensitivity_SRS.md) hiện đang ở trạng thái `Draft`. Tài liệu này là `Draft UX Contract` để review hành vi UX và IA, chưa mở handoff FE chính thức.

---

## §0. User & Task

### Target User Role(s)

| Role | Mô tả | Context |
|------|------|---------|
| PM Governance | Chủ governance liên phòng ban | Cần xem policy đang tác động ra sao và chặn rủi ro lộ dữ liệu |
| Admin / Ops Governance | Người cấu hình role, scope, policy | Cần tạo/sửa profile quyền nhanh, không bị rối bởi field kỹ thuật |
| IT / ERP / data | Người debug mapping, policy gap, audit | Cần truy vết rõ vì sao rule cho ra `allow`, `mask`, hay `deny` |
| Team Lead vận hành | Người review quyền của team | Cần hiểu team mình thấy được gì và khi nào phải escalated |

### Primary Task Objective

> Admin hoặc PM Governance cấu hình và kiểm tra được một policy access/sensitivity hoàn chỉnh cho đúng nhóm người dùng trong `<= 5 bước`, đồng thời preview được outcome trước khi publish mà không cần suy luận từ field kỹ thuật.

### Success Metric

| Metric | Target | How to Measure |
|--------|--------|---------------|
| Hoàn thành tạo/sửa một role-scope profile | `<= 5 bước` | Đếm thao tác từ lúc mở route đến lúc lưu |
| Hiểu đúng outcome policy preview | `>= 90%` trong internal review | So sánh kỳ vọng của reviewer với output simulator |
| Dead-end khi rule bị xung đột hoặc thiếu mapping | `0%` | Không có state blank hoặc fail silent |

### Failure Indicators

- Admin phải mở nhiều hơn 2 route để hiểu “ai được xem cái gì”.
- User không phân biệt được `mask`, `summary_only`, và `deny`.
- Policy preview không giải thích được vì sao rule bị chặn.
- Runtime blocked state không gợi ý bước tiếp theo như `đổi phạm vi`, `xem bản tóm tắt`, hoặc `chuyển người phụ trách`.

---

## 1. Feature Overview

### Purpose

Thiết kế route quản trị quyền truy cập và độ nhạy dữ liệu cho MIABOS theo cách vận hành được, để đội PM/Ops/IT của BQ có thể quản lý `role profile`, `data scope`, `sensitivity rules`, và `public-safe policy` mà không cần làm việc trực tiếp với cấu hình thô.

### User Story

```text
Là PM Governance hoặc Admin / Ops Governance,
Tôi muốn cấu hình và preview policy truy cập dữ liệu theo role, chi nhánh, kênh, và độ nhạy,
Để AI chỉ hiển thị dữ liệu đúng người, đúng phạm vi, và có hành vi nhất quán khi cần mask hoặc chặn.
```

### Linked Artifacts

| Artifact | Location | Status |
|----------|----------|--------|
| Feature SRS | [F-M07-SEC-001_Access_Control_And_Sensitivity_SRS.md](../../Analysis/Features/Modules/Operations_And_Governance/Access_Control_And_Sensitivity/SRS/F-M07-SEC-001_Access_Control_And_Sensitivity_SRS.md) | Draft |
| Inventory dependency | [F-M02-INV-001_Inventory_Availability_SRS.md](../../Analysis/Features/Modules/Catalog_And_Commerce/Inventory_Availability/SRS/F-M02-INV-001_Inventory_Availability_SRS.md) | Draft |
| AI trust dependency | [F-M09-AIC-002_AI_Answer_History_And_Trust_Review_SRS.md](../../Analysis/Features/Modules/AI_Workspace/AI_Answer_History_And_Trust_Review/SRS/F-M09-AIC-002_AI_Answer_History_And_Trust_Review_SRS.md) | Draft |
| Escalation dependency | [F-M11-ESC-001_Escalation_And_Workflow_SRS.md](../../Analysis/Features/Modules/Operations_And_Governance/Escalation_And_Workflow/SRS/F-M11-ESC-001_Escalation_And_Workflow_SRS.md) | Draft |

---

## 2. Screen Inventory

| # | Screen Name | Route/Path | Purpose |
|---|-------------|-----------|---------|
| S1 | Trung Tâm Phân Quyền Dữ Liệu | `/governance/phan-quyen-du-lieu` | Route chính để xem tổng quan profile, rules, policy issues |
| S2 | Danh Sách Hồ Sơ Quyền | trong S1 | Xem các role profile/scope profile hiện có |
| S3 | Chi Tiết Hồ Sơ Quyền | drawer hoặc full page trong S1 | Tạo/sửa role profile, scope profile, effective access |
| S4 | Thư Viện Quy Tắc Độ Nhạy | tab trong S1 | Quản lý sensitivity classes, projection types, rule status |
| S5 | Mô Phỏng Kết Quả Truy Cập | tab hoặc panel trong S1 | Preview outcome `allow`, `mask`, `summary_only`, `deny`, `escalation_only` |
| S6 | Trạng Thái Runtime Bị Chặn / Bị Ẩn | design reference state | Chuẩn hóa cách các module khác hiển thị blocked/masked outcome |

## 2.1 Task Flow

### Primary Task Flow

| Step | User Action | System Response | Field Visibility | Notes |
|------|------------|-----------------|-----------------|-------|
| 1 | Mở route `Trung Tâm Phân Quyền Dữ Liệu` | Hiển thị dashboard nhẹ gồm profile list, policy health, và CTA chính `Tạo hồ sơ quyền` | Required | Entry |
| 2 | Chọn một hồ sơ có sẵn hoặc tạo hồ sơ mới | Mở S3 với thông tin role, phòng ban, phạm vi branch/channel/store type | Required | Quick action |
| 3 | Cập nhật role profile và scope profile | Validate xung đột phạm vi, highlight policy gaps nếu có | Required + Optional | Decision point |
| 4 | Mở tab `Quy tắc độ nhạy` | Hiển thị rule list theo resource type, sensitivity class, projection type | Optional | Governance detail |
| 5 | Chọn `Mô phỏng kết quả truy cập` | Cho nhập scenario giả lập: role, channel, branch, resource type, requested field | Required + Advanced | Preview |
| 6 | Xem preview outcome | Hiển thị `allow`, `mask`, `summary_only`, `deny`, hoặc `escalation_only` cùng giải thích | Required | Validation |
| 7 | Lưu thay đổi hoặc hủy | Nếu hợp lệ, lưu và hiển thị success state; nếu chưa hợp lệ, giữ user ở cùng context để sửa | - | Completion |

### Three Interaction Patterns

| Pattern | Mô tả |
|---------|------|
| Quick Action | Admin mở route -> chọn hồ sơ -> sửa scope -> lưu trong `<= 3 bước` sau khi đã có profile nền |
| Exception Handling | Khi scope xung đột, thiếu mapping, hoặc rule chưa active, hệ thống không cho publish im lặng mà hiển thị lỗi kèm chỗ sửa trực tiếp |
| Bulk Operation | N/A cho phase 1. Lý do: policy sai có rủi ro cao, batch-edit hàng loạt dễ gây lỗi dây chuyền; chỉ nên mở sau khi role matrix BQ đã ổn định |

### Decision Points & Branching

| At Step | Condition | Branch To |
|---------|-----------|----------|
| Step 3 | Scope profile xung đột branch/channel/store type | §5.1 Error `SEC-UX-002` |
| Step 4 | Rule chưa có sensitivity mapping | §5.1 Error `SEC-UX-003` |
| Step 6 | Outcome là `summary_only` hoặc `deny` | Hiển thị explanation panel thay vì success preview |
| Step 6 | Outcome là `escalation_only` | Hiển thị note “chỉ chuyển người phụ trách xử lý”, không hiển thị data projection |

### Progressive Disclosure Rules

- **Required fields**: tên hồ sơ, role profile, phòng ban, branch/store/channel/store type scope.
- **Optional fields**: region, effective date, recipient escalation capability.
- **Advanced fields**: policy version, requested field simulator, raw reason codes, audit identifiers.

## 2.2 Route Declaration

| Route | Dominant User Goal | Single-Scope Confirmation | Forbidden Alternative Scope |
|-------|--------------------|---------------------------|-----------------------------|
| `/governance/phan-quyen-du-lieu` | Quản lý và mô phỏng quyền truy cập dữ liệu | Có | Không gộp workflow inbox, audit analytics, connector monitoring, hay cấu hình chatbot |

---

## 3. Visual Specification

### Screen S1: Trung Tâm Phân Quyền Dữ Liệu

```text
+-------------------------------------------------------------------+
| TopBar                                                            |
+-------------------------------------------------------------------+
| H1: Phân Quyền Dữ Liệu                                            |
| [Tìm hồ sơ quyền.................] [Lọc phòng ban] [Trạng thái]   |
|                                                  [Tạo hồ sơ quyền]|
|                                                                   |
| +----------------------+  +------------------------------------+  |
| | Hồ sơ quyền          |  | Tóm tắt policy                     |  |
| | Danh sách profile    |  | Số rule active / warning / gap     |  |
| | chip role + phạm vi  |  | CTA: Mô phỏng kết quả truy cập     |  |
| +----------------------+  +------------------------------------+  |
|                                                                   |
| Tab row: [Hồ sơ quyền] [Quy tắc độ nhạy] [Mô phỏng truy cập]      |
|                                                                   |
| Content area: S2 / S4 / S5                                        |
+-------------------------------------------------------------------+
```

### Screen S2: Danh Sách Hồ Sơ Quyền

- Table hoặc stacked cards tùy viewport.
- Mỗi hàng chỉ nên trả lời 4 câu hỏi:
  - hồ sơ này dành cho ai
  - thấy theo phạm vi nào
  - policy đang healthy hay warning
  - có CTA gì tiếp theo
- Primary CTA của hàng là `Xem chi tiết`, không dùng `Edit` làm nhãn chính.

### Screen S3: Chi Tiết Hồ Sơ Quyền

```text
+--------------------------------------------------------------+
| Hồ sơ quyền: Quản lý cửa hàng miền Trung                     |
| [Đang hoạt động]                                             |
|--------------------------------------------------------------|
| Vai trò / phòng ban                                          |
| [Store Manager v] [Vận hành bán lẻ v]                        |
|                                                              |
| Phạm vi dữ liệu                                              |
| [Chi nhánh] [Khu vực] [Kênh] [Loại cửa hàng]                |
| chip selected scopes                                         |
|                                                              |
| Quyền xử lý tiếp                                              |
| [ ] Có thể nhận yêu cầu hỗ trợ                               |
|                                                              |
| [Lưu thay đổi] [Hủy]                                         |
+--------------------------------------------------------------+
```

### Screen S4: Thư Viện Quy Tắc Độ Nhạy

- Group theo `resource type`: tồn kho, giá, CTKM, transcript, source trace, escalation payload.
- Mỗi rule card hiển thị:
  - mức độ nhạy cảm
  - projection type
  - nhóm role được phép
  - trạng thái `Active`, `Warning`, `Deprecated`
- Không show raw field names lên headline; raw field chỉ ở expandable detail.

### Screen S5: Mô Phỏng Kết Quả Truy Cập

```text
+--------------------------------------------------------------+
| Mô phỏng kết quả truy cập                                    |
|--------------------------------------------------------------|
| Vai trò      [Pricing Control v]                             |
| Phạm vi      [Chi nhánh A v] [Online v] [CH chính hãng v]    |
| Dữ liệu      [Giá / CTKM / Transcript v]                     |
| Trường cần xem [...........................................]  |
| [Chạy mô phỏng]                                              |
|--------------------------------------------------------------|
| Kết quả: SUMMARY ONLY                                        |
| Bạn chỉ được xem bản tóm tắt vì dữ liệu này thuộc mức nhạy   |
| cảm thương mại.                                              |
| [Xem giải thích] [Đổi phạm vi]                               |
+--------------------------------------------------------------+
```

### Screen S6: Trạng Thái Runtime Bị Chặn / Bị Ẩn

- Đây là reference state dùng chung cho downstream modules.
- Ba outcome cần tách rõ bằng ngôn ngữ:
  - `Đã ẩn một phần thông tin`
  - `Chỉ hiển thị bản tóm tắt`
  - `Bạn chưa có phạm vi truy cập phù hợp`
- Nếu outcome là `escalation_only`, CTA chính là `Chuyển người phụ trách xử lý`.

### Design Token Notes

| Element | Value |
|---------|-------|
| Page background | `--color-bg-page` |
| Section surface | `--color-bg-surface` |
| Primary card | `--color-bg-card` |
| Primary CTA | gradient `--color-primary` -> `--color-primary-hover` |
| Warning chip | `--color-warning` trên nền tint nhẹ |
| Error / deny state | `--color-error` + helper copy, không dùng đỏ tràn cả card |

### Responsive Behavior

| Breakpoint | Change |
|-----------|--------|
| Desktop | Sidebar list + content detail song song |
| Tablet | Tabs giữ nguyên, S3 chuyển thành drawer rộng |
| Mobile | List/card stack dọc, S3 và S5 dùng full-screen sheet |

---

## 4. Data Binding

| UI Element | API Endpoint | Field | Format | Sort/Filter |
|-----------|-------------|-------|--------|-------------|
| Search hồ sơ quyền | `GET /mia/access/profiles/:id` hoặc list endpoint tương đương | `role_profile_code`, `department_code` | Text + chips | Search theo role/department |
| Scope chips | `GET /mia/access/profiles/:id` | `branch_scope`, `store_scope`, `region_scope`, `channel_scope`, `store_type_scope` | chips | Filter theo dimension |
| Rule list | `POST /mia/access/rules/preview` + rule source | `resource_type`, `field_code`, `sensitivity_class`, `projection_type`, `status` | rows/cards | Filter theo resource/status |
| Preview form | `POST /mia/access/rules/preview` | `role_profile_code`, `context`, `resource_type`, `requested_fields[]` | form | - |
| Preview result | `POST /mia/access/rules/preview` | `decision`, `allowed_fields[]`, `masked_fields[]`, `summary_projection`, `blocked_reason_code`, `requires_escalation` | result card | - |
| Policy health summary | analytics source nội bộ | `warning_count`, `policy_gap_count`, `active_rule_count` | stat cards | Filter theo status |

---

## 5. State Matrix

### Page-Level States

| State | Trigger | Visual | Notes |
|-------|---------|--------|-------|
| Empty | Chưa có hồ sơ hoặc chưa chọn tab | Empty state + CTA `Tạo hồ sơ quyền` | Không để màn hình trắng |
| Loading | Đang load profile/rules/preview | Skeleton theo layout | Sau 300ms mới hiện |
| Populated | Có dữ liệu profile hoặc rule | Bình thường | Default |
| Warning | Có policy gap hoặc xung đột scope | Warning banner + row highlight | Không block toàn trang |
| Error | API fail hoặc preview fail | Error card + CTA `Thử lại` | Giữ input đã nhập |

### Component-Level States

| Component | Default | Hover | Active | Focus | Disabled | Loading | Error |
|-----------|---------|-------|--------|-------|----------|---------|-------|
| Hồ sơ quyền row | card trắng | card tint nhẹ | selected tint | outline rõ | opacity 50% | skeleton row | warning border |
| Scope chips | outlined | tint nhẹ | filled | focus ring | muted | - | chip cảnh báo |
| Preview result card | neutral | - | emphasized | - | - | loading shell | deny/error state |
| Primary CTA | gradient blue | darker gradient | pressed | focus ring | muted | spinner | - |

### Destructive Actions

| Action | Confirmation | Undo |
|--------|-------------|------|
| Ngừng hiệu lực hồ sơ quyền | Dialog: `Ngừng hiệu lực hồ sơ này?` | Không có undo tức thì; yêu cầu mở lại để kích hoạt |
| Ngừng hiệu lực rule | Dialog: `Quy tắc này sẽ không còn áp dụng.` | Không có undo tức thì |

## 5.1 Error & Recovery

| Error ID | At Step | Description | Frequency | System Assistance | Recovery Action |
|----------|---------|-------------|-----------|-------------------|----------------|
| `SEC-UX-001` | Step 2 | Không tải được hồ sơ quyền | Thỉnh thoảng | Error card + giữ filter hiện tại | `Thử lại` |
| `SEC-UX-002` | Step 3 | Scope profile xung đột branch/channel/store type | Common | Highlight group bị xung đột + helper text rõ | Sửa lại phạm vi ngay tại chỗ |
| `SEC-UX-003` | Step 4 | Rule chưa có mapping độ nhạy | Common | Gắn badge `Thiếu mapping` vào row và link sang rule detail | Bổ sung rule trước khi publish |
| `SEC-UX-004` | Step 6 | Mô phỏng không đủ context để chạy | Common | Chỉ rõ trường còn thiếu | Điền đủ role/phạm vi/dữ liệu rồi chạy lại |
| `SEC-UX-005` | Step 6 | Preview trả `deny` hoặc `escalation_only` | Common | Giải thích outcome bằng ngôn ngữ vận hành | Đổi phạm vi, đổi role, hoặc mở luồng hỗ trợ |

### Dead-End Prevention Checklist

- [x] Mọi error đều có copy tiếng Việt rõ ràng
- [x] Mọi error đều có recovery action
- [x] Không có bước nào rơi vào blank state
- [x] Validation phải inline, không đợi tới lúc submit cuối

### Guidance & Assistance

| Guidance Type | Where | Content |
|---------------|-------|---------|
| Empty state | S1/S2 | `Chưa có hồ sơ quyền. Bắt đầu bằng cách tạo hồ sơ cho một nhóm người dùng.` |
| Contextual hint | S3 | `Phạm vi càng rộng thì dữ liệu thấy được càng nhiều. Chỉ chọn đúng phần công việc cần thiết.` |
| Preview explanation | S5 | `Kết quả mô phỏng này dùng để kiểm tra policy trước khi áp dụng thật.` |

---

## 6. UI Copy Glossary & Microcopy

### UI Copy Glossary

| User-Facing Term (Vietnamese) | Forbidden Technical Term | Where Used |
|-------------------------------|--------------------------|-----------|
| Hồ sơ quyền | role profile | list title, detail page |
| Phạm vi dữ liệu | scope profile | scope section |
| Quy tắc độ nhạy | sensitivity rule | rule library |
| Bản tóm tắt an toàn | summary projection | preview result |
| Đã ẩn một phần thông tin | masked fields | runtime state |
| Chỉ chuyển người phụ trách xử lý | escalation_only | blocked state CTA |
| Dữ liệu ngoài phạm vi | out of scope | runtime explanation |
| Thiếu mapping dữ liệu | policy gap | warning banner |

### Copy & Microcopy

| Element | Vietnamese Text | Max Length |
|---------|-----------------|-----------|
| Page Title | `Phân Quyền Dữ Liệu` | 32 |
| Primary CTA | `Tạo hồ sơ quyền` | 24 |
| Tab 1 | `Hồ sơ quyền` | 20 |
| Tab 2 | `Quy tắc độ nhạy` | 20 |
| Tab 3 | `Mô phỏng truy cập` | 20 |
| Empty state | `Chưa có hồ sơ quyền nào.` | 36 |
| Helper | `Chọn đúng phạm vi công việc, không mở rộng hơn nhu cầu thực tế.` | 80 |
| Deny state | `Bạn chưa có phạm vi truy cập phù hợp cho dữ liệu này.` | 72 |
| Masked state | `Một phần thông tin đã được ẩn theo chính sách dữ liệu.` | 72 |
| Summary-only state | `Bạn chỉ được xem bản tóm tắt an toàn của dữ liệu này.` | 72 |
| Escalation state | `Thông tin này cần chuyển người phụ trách xử lý tiếp.` | 72 |

---

## 7. Interaction & Animation

| Interaction | Animation | Duration | Easing |
|------------|-----------|----------|--------|
| Tab switch | fade + slight slide | 180ms | ease-out |
| Drawer open | slide-in + ambient fade | 220ms | ease-out |
| Preview result change | cross-fade | 160ms | ease-out |
| Warning badge appear | fade + scale 0.98 -> 1 | 140ms | ease-out |

> `prefers-reduced-motion` phải tắt animation không cần thiết.

---

## 8. Accessibility

- [ ] `aria-label` cho icon-only actions trong row/profile
- [ ] keyboard tab order đi theo thứ tự: filter -> list -> detail -> preview
- [ ] preview result dùng `aria-live="polite"` khi outcome đổi
- [ ] warning/error states không chỉ dựa vào màu, phải có icon + text
- [ ] drawer đóng xong phải trả focus về row hoặc CTA đã mở nó

### Contrast Check

| Element | FG | BG | Ratio | Pass |
|---------|----|----|-------|------|
| Page title | `--color-text-primary` | `--color-bg-page` | AA target | Yes |
| Secondary helper | `--color-text-secondary` | `--color-bg-card` | AA target | Yes |
| Primary CTA | white | `--color-primary` | AA target | Yes |
| Warning chip | dark text | warning tint | AA target | Yes |

---

## 9. A05 Technical Cross-Check

- Route đề xuất: `/governance/phan-quyen-du-lieu`
- Không tạo mixed-scope route; audit analytics và workflow inbox phải là route riêng
- Preview simulator cần response shape đúng theo SRS M07:
  - `decision`
  - `allowed_fields[]`
  - `masked_fields[]`
  - `summary_projection`
  - `blocked_reason_code`
  - `requires_escalation`
- Downstream runtime states của `M09`, `M10`, `M11` nên reuse cùng component outcome card để giữ hành vi nhất quán

---

## 10. A07 Pre-Delivery Checklist

- [ ] Không dùng module code trong nhãn UI
- [ ] Mọi copy visible là tiếng Việt
- [ ] Có đầy đủ state `allow`, `mask`, `summary_only`, `deny`, `escalation_only`
- [ ] Preview simulator không biến thành màn JSON/debug thuần kỹ thuật
- [ ] Trạng thái blocked luôn có bước tiếp theo
- [ ] Responsive layout rõ cho desktop/tablet/mobile
