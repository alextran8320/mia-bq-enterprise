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
**Blocking Reason**: C?n ch?t filter set phase 1, field uu tiên trên list, hành vi export, và ngu?ng duplicate flag.
**Product**: MIA Smart / CRM Workspace
**Design System Reference**: [`Design/Design_System.md`](../Design_System.md)
**Save to**: `Design/UXUI_Features/UXUI-F-M06-CRM-001A_Customer_List.md`
**Date**: 2026-04-16

> **Precondition**: Parent SRS `F-M06-CRM-001` remains the canonical source for customer profile, social profile, duplicate, merge, and bulk-update rules. This UXUI spec focuses on the `Customer List` operational surface.

---

## §0. User & Task

### Target User Role(s)

| Role | Mô t? | Context |
|------|------|---------|
| Sales | Nhân viên bán hàng | C?n tìm khách nhanh d? tu v?n và follow-up |
| CSKH | Nhân viên cham sóc khách hàng | C?n tra khách, xem tín hi?u và x? lý care flow |
| Marketing | Nhân viên marketing / CRM | C?n l?c dúng t?p khách cho campaign |
| Store Manager | Qu?n lý c?a hàng | C?n xem khách theo c?a hàng / khu v?c |
| CRM Manager | Qu?n lý CRM | C?n review duplicate, owner, segment, quality d? li?u |

### Primary Task Objective

> Ngu?i dùng tìm dúng khách hàng trong **= 10 giây**, nhìn th?y các tín hi?u d? d? quy?t d?nh bu?c ti?p theo, và di vào dúng flow (`Customer 360`, `Duplicate Review`, `Care Action`) v?i ít thao tác nh?t.

### Success Metrics

| Metric | Target | Cách do |
|--------|--------|---------|
| Time to first useful customer result | = 3s cho 95% query ph? bi?n | T? lúc nh?p search t?i lúc row render |
| Search-to-open conversion | = 70% | S? search d?n t?i m? `Customer 360` ho?c `Care Action` |
| Duplicate visibility rate | 100% case có flag | Case duplicate ph?i hi?n badge rõ ràng |
| Bulk-action misfire rate | = 2% | T? l? bulk action b? revert ho?c fail do nh?m nhóm |

### Failure Indicators

- Ngu?i dùng ph?i search l?i nhi?u l?n vì list không uu tiên dúng exact match
- Duplicate flag b? chìm, ngu?i dùng không th?y case nghi trùng
- Consent / restricted state ch? l? khi dã di vào hành d?ng sâu
- Bulk action bar hi?n mo h?, không rõ tác d?ng trên bao nhiêu record

---

## 1. Feature Overview

### Purpose

Cung c?p m?t b?ng làm vi?c h?ng ngày cho Sales, CSKH, Marketing, và CRM Manager d? tra c?u khách, l?c theo di?u ki?n nghi?p v?, phát hi?n duplicate, và di vào dúng flow ti?p theo v?i s? thao tác t?i thi?u.

### User Story

```text
Là ngu?i dùng v?n hành CRM,
Tôi mu?n có danh sách khách hàng v?i search, filter, sort, saved view, duplicate signal, và bulk actions an toàn,
Ð? tôi tìm dúng khách nhanh, x? lý dúng nhóm khách, và không c?n m? t?ng h? so m?i bi?t khách nào c?n hành d?ng.
```

### Linked Artifacts

| Artifact | Location | Status |
|----------|----------|--------|
| Feature SRS | [F-M06-CRM-001_Customer_And_CRM_SRS.md](../../Analysis/Features/Modules/CRM_Workspace/Customer_And_CRM/SRS/F-M06-CRM-001_Customer_And_CRM_SRS.md) | Draft |
| User Story | [US-M06-CRM-001A_Customer_List.md](../../Planning/Stories/CRM_Workspace/US-M06-CRM-001A_Customer_List.md) | Draft |
| Related Surface | [UXUI-F-M06-CRM-001B_Customer_360.md](UXUI-F-M06-CRM-001B_Customer_360.md) | Draft |

---

## 2. Screen Inventory

| # | Screen / State | Route | M?c dích |
|---|----------------|-------|----------|
| S1 | Customer List - Default | `/crm/customers` | Xem list khách và signals chính |
| S2 | Customer List - Filtered | `/crm/customers` | Làm vi?c theo view / filter nghi?p v? |
| S3 | Customer List - Bulk Selected | `/crm/customers` | Ch?y bulk actions an toàn |
| S4 | Customer List - Empty / No Result | `/crm/customers` | Gi? user không b? dead-end |
| S5 | Import Preview | `/crm/customers` modal/panel | Preview import tru?c khi apply |

---

## 2.1 Information Architecture

### Header

Ph?i có:

- tiêu d? `Khách hàng`
- t?ng s? h? so trong k?t qu? hi?n t?i
- quick stats:
  - s? khách có duplicate flag
  - s? lead m?i
  - s? khách c?n follow-up
  - s? khách có consent h?p l?
- CTA:
  - `T?o khách hàng`
  - `Import`
  - `Xu?t d? li?u` n?u role cho phép

### Search Bar

Search box duy nh?t h? tr? multi-key:

- s? di?n tho?i
- tên khách hàng
- mã khách CRM
- mã khách SAP / Haravan / KiotViet
- social profile ref
- mã don hàng

### Filter Rail

Filter phase 1 c?n có:

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

M?i row ph?i có t?i thi?u:

- checkbox
- avatar / initials
- display name
- customer id
- masked phone
- email ph? n?u có
- lifecycle badge
- consent badge
- source chính
- s? social profiles dã link
- last interaction
- last order / last value
- owner
- duplicate badge n?u có
- quick actions

---

## 2.2 Task Flow

### Primary Task Flow - Tìm khách và di vào hành d?ng phù h?p

| Step | User Action | System Response | Notes |
|------|-------------|-----------------|-------|
| 1 | M? `/crm/customers` | Render saved view m?c d?nh + k?t qu? g?n nh?t | Entry |
| 2 | Gõ search query ho?c ch?n filter | Refresh k?t qu? list | Gi? l?i search/filter hi?n t?i |
| 3 | Xem row signals | Hi?n th? duplicate / consent / owner / last interaction | Decision |
| 4A | Click row | M? `Customer 360` | Deep dive |
| 4B | Click duplicate badge | M? `Duplicate Review` | Conflict flow |
| 4C | Ch?n nhi?u row | M? `Bulk Action Bar` | Batch action |
| 4D | Click quick action | M? `Care Action` ho?c copy contact | Quick execution |

### Decision Rules

- exact phone ho?c exact customer ID ph?i ghim record lên d?u list
- duplicate badge ph?i n?i d? d? scan nhanh nhung không phá nh?p d?c
- consent restricted ph?i nhìn th?y ngay trên row

---

## 3. Search, Filter, Sort, Pagination Logic

### Search Logic

- debounce `300-500ms`
- exact phone match uu tiên s? 1
- exact customer ID / order ref tr? k?t qu? g?n nhu ngay l?p t?c
- exact social ref uu tiên cao hon fuzzy name
- search không reset filter dang áp d?ng
- n?u exact match duy nh?t, v?n gi? user ? list nhung ghim record dó lên d?u

### Filter Logic

- filter gi?a các nhóm dùng `AND`
- nhi?u giá tr? trong cùng nhóm dùng `OR`
- active filter ph?i hi?n th? thành chips
- có nút `Clear all`
- filter thay d?i ph?i gi? search query

### Sort Logic

Sort phase 1:

- `Last interaction desc` m?c d?nh
- `Created at desc`
- `Last order value desc`
- `Duplicate score desc`
- `Customer name asc`

### Pagination / Loading

- desktop uu tiên pagination server-side
- mobile có th? dùng `load more`
- loading dùng skeleton rows / cards

---

## 4. Actions And UX Behavior

### Row Actions

- `M? Customer 360`
- `T?o Care Action`
- `Copy contact`
- `Xem Duplicate Review` n?u có flag

### Bulk Actions Phase 1

Cho phép:

- gán segment
- gán owner
- thêm / b? tag
- c?p nh?t preferred store
- import attribute theo file chu?n

Không cho phép:

- bulk merge
- bulk overwrite phone/email
- bulk overwrite consent không có approval

### Import Action

Import ph?i có:

- ch?n file
- t?i template m?u
- preview s? record h?p l? / l?i
- map c?t n?u c?n
- xác nh?n apply

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
| Empty | No customers in scope | Empty illustration + CTA `T?o khách hàng` | No dead-end |
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

- Search input ph?i có label rõ ràng
- Table row actions ph?i tab du?c
- Bulk action bar ph?i có keyboard focus order h?p lý
- Duplicate / consent badges không du?c ch? d?a vào màu, c?n text label
- Mobile card list ph?i gi? touch targets t?i thi?u `44x44`

---

## 9. Pre-Delivery Checklist

- [ ] Header stats và row fields kh?p payload design
- [ ] Search / filter / sort / pagination logic du?c ch?t
- [ ] Bulk action phase 1 và phase sau tách rõ
- [ ] Permission-limited state có mask / disable logic
- [ ] Mobile card list không m?t duplicate / consent signals
