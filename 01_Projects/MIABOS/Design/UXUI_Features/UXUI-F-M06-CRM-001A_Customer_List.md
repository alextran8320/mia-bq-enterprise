# UXUI Feature Spec: F-M06-CRM-001A Customer List

**Feature ID**: F-M06-CRM-001A
**Parent Feature ID**: F-M06-CRM-001
**Status**: Draft
**Owner**: A06 UI/UX Agent
**Last Updated By**: Codex CLI (GPT-5 Codex)
**Last Reviewed By**: A01 PM Agent
**Approval Required**: A05 Tech Lead, A01 PM
**Approved By**: -
**Last Status Change**: 2026-04-16
**Source of Truth**: This document
**Blocking Reason**: Cần chốt filter set phase 1, field ưu tiên trên list, hành vi export, và ngưỡng duplicate flag.
**Product**: MIA Smart / CRM Workspace
**Design System Reference**: [`Design/Design_System.md`](../Design_System.md)
**Save to**: `Design/UXUI_Features/UXUI-F-M06-CRM-001A_Customer_List.md`
**Date**: 2026-04-16

> **Precondition**: Parent SRS `F-M06-CRM-001` remains the canonical source for customer profile, social profile, duplicate, merge, and bulk-update rules. This UXUI spec focuses on the `Customer List` operational surface.

---

## 0. User & Task

### Target User Role(s)

| Role | Mô tả | Context |
|------|------|---------|
| Sales | Nhân viên bán hàng | Cần tìm khách nhanh để tư vấn và follow-up |
| CSKH | Nhân viên chăm sóc khách hàng | Cần tra khách, xem tín hiệu và xử lý care flow |
| Marketing | Nhân viên marketing / CRM | Cần lọc đúng tập khách cho campaign |
| Store Manager | Quản lý cửa hàng | Cần xem khách theo cửa hàng / khu vực |
| CRM Manager | Quản lý CRM | Cần review duplicate, owner, segment, quality dữ liệu |

### Primary Task Objective

> Người dùng tìm đúng khách hàng trong **<= 10 giây**, nhìn thấy các tín hiệu để dễ quyết định bước tiếp theo, và đi vào đúng flow (`Customer 360`, `Duplicate Review`, `Care Action`) với ít thao tác nhất.

### Success Metrics

| Metric | Target | Cách đo |
|--------|--------|---------|
| Time to first useful customer result | <= 3s cho 95% query phổ biến | Từ lúc nhập search tới lúc row render |
| Search-to-open conversion | >= 70% | Số search dẫn tới mở `Customer 360` hoặc `Care Action` |
| Duplicate visibility rate | 100% case có flag | Case duplicate phải hiện badge rõ ràng |
| Bulk-action misfire rate | <= 2% | Tỷ lệ bulk action bị revert hoặc fail do nhầm nhóm |

### Failure Indicators

- Người dùng phải search lại nhiều lần và list không ưu tiên đúng exact match
- Duplicate flag bị chìm, người dùng không thấy case nghi trùng
- Consent / restricted state chìm lấp khi đã đi vào hành động sâu
- Bulk action bar hiện mơ hồ, không rõ tác động trên bao nhiêu record

---

## 1. Feature Overview

### Purpose

Cung cấp một bảng làm việc hàng ngày cho Sales, CSKH, Marketing, và CRM Manager để tra cứu khách, lọc theo điều kiện nghiệp vụ, phát hiện duplicate, và đi vào đúng flow tiếp theo với số thao tác tối thiểu.

### User Story

```text
Là người dùng vận hành CRM,
Tôi muốn có danh sách khách hàng với search, filter, sort, saved view, duplicate signal, và bulk actions an toàn,
Để tôi tìm đúng khách nhanh, xử lý đúng nhóm khách, và không cần mở từng hồ sơ mới biết khách nào cần hành động.
```

### Linked Artifacts

| Artifact | Location | Status |
|----------|----------|--------|
| Feature SRS | [F-M06-CRM-001_Customer_And_CRM_SRS.md](../../Analysis/Features/Modules/CRM_Workspace/Customer_And_CRM/SRS/F-M06-CRM-001_Customer_And_CRM_SRS.md) | Draft |
| User Story | [US-M06-CRM-001A_Customer_List.md](../../Planning/Stories/CRM_Workspace/US-M06-CRM-001A_Customer_List.md) | Draft |
| Related Surface | [UXUI-F-M06-CRM-001B_Customer_360.md](UXUI-F-M06-CRM-001B_Customer_360.md) | Draft |

---

## 2. Screen Inventory

| # | Screen / State | Route | Mục đích |
|---|----------------|-------|----------|
| S1 | Customer List - Default | `/crm/customers` | Xem list khách và signals chính |
| S2 | Customer List - Filtered | `/crm/customers` | Làm việc theo view / filter nghiệp vụ |
| S3 | Customer List - Bulk Selected | `/crm/customers` | Chạy bulk actions an toàn |
| S4 | Customer List - Empty / No Result | `/crm/customers` | Giữ user không bị dead-end |
| S5 | Import Preview | `/crm/customers` modal/panel | Preview import trước khi apply |

---

## 2.1 Information Architecture

### Header

Phải có:

- tiêu đề `Khách hàng`
- tổng số hồ sơ trong kết quả hiện tại
- quick stats:
  - số khách có duplicate flag
  - số lead mới
  - số khách cần follow-up
  - số khách có consent hợp lệ
- CTA:
  - `Tạo khách hàng`
  - `Import`
  - `Xuất dữ liệu` nếu role cho phép

### Search Bar

Search box duy nhất hỗ trợ multi-key:

- số điện thoại
- tên khách hàng
- mã khách CRM
- mã khách SAP / Haravan / KiotViet
- social profile ref
- mã đơn hàng

### Filter Rail

Filter phase 1 cần có:

- `Lifecycle`: Lead, Customer, Loyal, Inactive, Blocked
- `Consent`: Opt-in, Opt-out, Unknown, Restricted
- `Source`: MIA, SAP, Haravan, KiotViet, Facebook, Zalo, Website
- `Owner`
- `Preferred Store`
- `Region`
- `Duplicate Status`: none, suspected, merge pending
- `Last Interaction`
- `Order Activity`

### Customer Row

Mỗi row phải có tối thiểu:

- checkbox
- avatar / initials
- display name
- customer id
- masked phone
- email phụ nếu có
- lifecycle badge
- consent badge
- source chính
- số social profiles đã link
- last interaction
- last order / last value
- owner
- duplicate badge nếu có
- quick actions

---

## 2.2 Task Flow

### Primary Task Flow - Tìm khách và đi vào hành động phù hợp

| Step | User Action | System Response | Notes |
|------|-------------|-----------------|-------|
| 1 | Mở `/crm/customers` | Render saved view mặc định + kết quả gần nhất | Entry |
| 2 | Gõ search query hoặc chọn filter | Refresh kết quả list | Giữ lại search/filter hiện tại |
| 3 | Xem row signals | Hiển thị duplicate / consent / owner / last interaction | Decision |
| 4A | Click row | Mở `Customer 360` | Deep dive |
| 4B | Click duplicate badge | Mở `Duplicate Review` | Conflict flow |
| 4C | Chọn nhiều row | Mở `Bulk Action Bar` | Batch action |
| 4D | Click quick action | Mở `Care Action` hoặc copy contact | Quick execution |

### Decision Rules

- exact phone hoặc exact customer ID phải ghim record lên đầu list
- duplicate badge phải nổi để dễ scan nhanh nhưng không phá nhịp đọc
- consent restricted phải nhìn thấy ngay trên row

---

## 3. Search, Filter, Sort, Pagination Logic

### Search Logic

- debounce `300-500ms`
- exact phone match ưu tiên số 1
- exact customer ID / order ref trả kết quả gần như ngay lập tức
- exact social ref ưu tiên cao hơn fuzzy name
- search không reset filter đang áp dụng
- nếu exact match duy nhất, vẫn giữ user ở list nhưng ghim record đó lên đầu

### Filter Logic

- filter giữa các nhóm dùng `AND`
- nhiều giá trị trong cùng nhóm dùng `OR`
- active filter phải hiển thị thành chips
- có nút `Clear all`
- filter thay đổi phải giữ search query

### Sort Logic

Sort phase 1:

- `Last interaction desc` mặc định
- `Created at desc`
- `Last order value desc`
- `Duplicate score desc`
- `Customer name asc`

### Pagination / Loading

- desktop ưu tiên pagination server-side
- mobile có thể dùng `load more`
- loading dùng skeleton rows / cards

---

## 4. Actions And UX Behavior

### Row Actions

- `Mở Customer 360`
- `Tạo Care Action`
- `Copy contact`
- `Xem Duplicate Review` nếu có flag

### Bulk Actions Phase 1

Cho phép:

- gán segment
- gán owner
- thêm / bỏ tag
- cập nhật preferred store
- import attribute theo file chuẩn

Không cho phép:

- bulk merge
- bulk overwrite phone/email
- bulk overwrite consent không có approval

### Import Action

Import phải có:

- chọn file
- tải template mẫu
- preview số record hợp lệ / lỗi
- map cột nếu cần
- xác nhận apply

---

## 5. Data Binding

| UI Element | Data Group | Required Fields | Notes |
|-----------|------------|-----------------|-------|
| Header stats | `summary_metrics` | `total_count`, `duplicate_count`, `new_lead_count`, `follow_up_count`, `consent_valid_count` | Top metrics |
| Search result row | `customer_list_item[]` | `customer_id`, `display_name`, `phone_masked`, `lifecycle`, `consent_status`, `source_primary`, `social_profile_count`, `last_interaction_at`, `last_order_value`, `owner_name`, `duplicate_score` | Main list payload |
| Filter state | `filter_state` | active filters | Persisted in UI state |
| Saved views | `saved_views[]` | `view_id`, `label`, `filter_preset` | Optional but recommended |
| Bulk selection | `selection_state` | selected ids | Local UI state |

---

## 6. State Matrix

| State | Trigger | Visual | Notes |
|------|---------|--------|-------|
| Empty | No customers in scope | Empty illustration + CTA `Tạo khách hàng` | No dead-end |
| No Result | Search/filter returns none | Message + keep query/filter visible | Explain why |
| Loading | First load / filter change | Skeleton rows / cards | Maintain layout |
| Populated | Result exists | Table/card list | Default |
| Bulk Selected | >= 1 row selected | Sticky bulk action bar | Show selected count |
| Import Preview | User uploads file | Preview side panel / modal | Before apply |
| Permission Limited | Restricted role | Masked columns + disabled export | Safe access |

---

## 7. Error And Recovery

| Error | Trigger | Expected UX |
|-------|---------|-------------|
| Search timeout | Search query takes too long | Keep current list, show inline retry notice |
| Filter source unavailable | One facet cannot load | Disable that facet, keep others usable |
| Export denied | User lacks permission | Permission-safe toast |
| Bulk action partial failure | Some records cannot update | Show success/fail counts and error summary |

---

## 8. Accessibility

- Search input phải có label rõ ràng
- Table row actions phải tab được
- Bulk action bar phải có keyboard focus order hợp lý
- Duplicate / consent badges không được chỉ dựa vào màu, cần text label
- Mobile card list phải giữ touch targets tối thiểu `44x44`

---

## 9. Pre-Delivery Checklist

- [ ] Header stats và row fields khớp payload design
- [ ] Search / filter / sort / pagination logic được chốt
- [ ] Bulk action phase 1 và phase sau tách rõ
- [ ] Permission-limited state có mask / disable logic
- [ ] Mobile card list không mất duplicate / consent signals
