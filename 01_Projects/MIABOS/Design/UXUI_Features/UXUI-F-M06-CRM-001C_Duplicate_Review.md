# UXUI Feature Spec: F-M06-CRM-001C Duplicate Review

**Feature ID**: F-M06-CRM-001C
**Parent Feature ID**: F-M06-CRM-001
**Status**: Draft
**Owner**: A06 UI/UX Agent
**Last Updated By**: Codex CLI (GPT-5 Codex)
**Last Reviewed By**: A01 PM Agent
**Approval Required**: A05 Tech Lead, A01 PM
**Approved By**: -
**Last Status Change**: 2026-04-16
**Source of Truth**: This document
**Blocking Reason**: Cần chốt field priority matrix khi merge, quyền approve merge, và chính sách split identity.
**Product**: MIA Smart / CRM Workspace
**Design System Reference**: [`Design/Design_System.md`](../Design_System.md)
**Save to**: `Design/UXUI_Features/UXUI-F-M06-CRM-001C_Duplicate_Review.md`
**Date**: 2026-04-16

> **Precondition**: Parent SRS `F-M06-CRM-001` must remain the source for duplicate, merge, survivor, split, and audit rules. This UXUI spec covers the human review surface only.

---

## 0. User & Task

### Target User Role(s)

| Role | Mô tả | Context |
|------|------|---------|
| CRM Manager | Người duyệt chất lượng dữ liệu | Cần quyết định merge/split |
| CSKH Lead | Quản lý chăm sóc khách hàng | Cần tránh merge nhầm khách đang được xử lý |
| Operations Manager | Quản lý vận hành | Cần rõ case nghi trùng ảnh hưởng workflow |

### Primary Task Objective

> Reviewer hiểu rõ vì sao case bị nghi duplicate, thấy được impact của merge, và ra quyết định với confidence cao trước khi dữ liệu bị hợp nhất.

### Success Metrics

| Metric | Target | Cách đo |
|--------|--------|---------|
| Time to first review decision | <= 3 phút / case phổ biến | Từ mở case đến quyết định |
| Preview-before-merge rate | 100% | Không merge nếu chưa xem preview |
| Wrong merge rate | <= 1% | Tỷ lệ phải split / repair sau merge |
| High-risk conflict visibility | 100% | Consent / VIP / multiple ID conflict phải nổi rõ |

### Failure Indicators

- Reviewer không thấy rõ field nào đang conflict nặng
- Merge preview không nói rõ số identities / histories sẽ bị remap
- Nút `Merge` dễ bấm trước khi hiểu case
- Không có cách postpone / assign khiến queue bị tắc

---

## 1. Feature Overview

### Purpose

Cung cấp surface an toàn cho người dùng có thẩm quyền so sánh hồ sơ nghi trùng, xem conflict, và đưa ra quyết định merge hoặc split với audit đầy đủ.

### User Story

```text
Là CRM Manager hoặc CSKH Lead,
Tôi muốn có một màn hình review duplicate thật rõ ràng để thấy vì sao hai hồ sơ bị nghi trùng, field nào conflict, và sau merge hồ sơ sẽ ra sao,
Để tôi không merge nhầm và vẫn xử lý nhanh các case trùng dữ liệu.
```

### Linked Artifacts

| Artifact | Location | Status |
|----------|----------|--------|
| Feature SRS | [F-M06-CRM-001_Customer_And_CRM_SRS.md](../../Analysis/Features/Modules/CRM_Workspace/Customer_And_CRM/SRS/F-M06-CRM-001_Customer_And_CRM_SRS.md) | Draft |
| User Story | [US-M06-CRM-001C_Duplicate_Review.md](../../Planning/Stories/CRM_Workspace/US-M06-CRM-001C_Duplicate_Review.md) | Draft |
| Related Surface | [UXUI-F-M06-CRM-001B_Customer_360.md](UXUI-F-M06-CRM-001B_Customer_360.md) | Draft |

---

## 2. Screen Inventory

| # | Screen / State | Route | Mục đích |
|---|----------------|-------|----------|
| S1 | Review Queue | `/crm/customers/duplicate-review` | Xem queue các case cần xử lý |
| S2 | Reviewing Case | `/crm/customers/duplicate-review` | So sánh candidates và conflict |
| S3 | Merge Preview | `/crm/customers/duplicate-review` | Xem kết quả sau merge |
| S4 | High-Risk Conflict | `/crm/customers/duplicate-review` | Tô rõ case nhạy cảm |
| S5 | Merge Blocked / Resolved | `/crm/customers/duplicate-review` | Handle permission / stale state |

---

## 2.1 Information Architecture

### Review Queue

Queue cần hiển thị:

- merge case id
- duplicate score
- candidate count
- loại match mạnh nhất
- created_at
- assigned reviewer
- status

### Candidate Comparison Panel

Mỗi candidate card phải có:

- tên
- customer_id
- lifecycle
- source systems
- phone / email masked theo quyền
- last interaction
- last order
- consent status
- social profile count

### Conflict Matrix

Field bắt buộc:

- tên
- phone
- email
- birthday
- consent source
- social profile refs
- SAP / Haravan / KiotViet IDs
- last order
- last interaction
- owner

Mỗi dòng field phải hiển thị:

- giá trị của candidate A
- giá trị của candidate B
- nguồn dữ liệu
- confidence / verified status
- suggested winner nếu có
- selector cho survivor value

### Merge Preview

Merge preview phải có:

- survivor record được chọn
- fields cuối cùng sau merge
- số identities remap
- số orders / conversations / calls bị ảnh hưởng
- warning nếu conflict mạnh

---

## 2.2 Task Flow

| Step | User Action | System Response | Notes |
|------|-------------|-----------------|-------|
| 1 | Open duplicate review queue | Render cases by score/status | Queue |
| 2 | Pick a case | Load comparison + conflict matrix | Review |
| 3 | Inspect field conflicts | Highlight strong conflicts | Decision support |
| 4 | Choose survivor values | Update merge preview | Controlled merge |
| 5A | Merge now | Confirmation modal + audit note | Final action |
| 5B | Mark not duplicate / assign reviewer / postpone | Persist state | Alternative path |

---

## 3. Search, Filter, Sort Logic

### Search queue

- customer name
- phone
- case id

### Filter queue

- status
- score band
- reviewer

### Sort queue

- `score desc`
- `created_at desc`

---

## 4. Actions And Decision Logic

### Supported Actions

- `merge now`
- `mark not duplicate`
- `split identity`
- `assign reviewer`
- `postpone`

### Decision Rules

- `merge now` chỉ enable sau khi user xem preview
- `mark not duplicate` bắt nhập lý do
- `assign reviewer` mở modal chọn người + due date
- `split identity` chỉ hiện trong state hợp lệ

### Confirmation Rules

Merge:

- cần modal xác nhận lần cuối
- hiển thị số records bị ảnh hưởng
- bắt nhập note nếu có conflict mạnh

Not Duplicate:

- bắt nhập reason

Assign Reviewer:

- chọn reviewer
- optional due date

---

## 5. Data Binding

| UI Area | Data Group | Required Fields | Notes |
|--------|------------|-----------------|-------|
| Queue | `merge_cases[]` | `case_id`, `duplicate_score`, `candidate_count`, `match_reason`, `created_at`, `reviewer`, `status` | Queue view |
| Candidate cards | `candidates[]` | `customer_id`, `display_name`, `lifecycle`, `source_systems`, `masked_phone`, `last_interaction_at`, `last_order_at`, `consent_status`, `social_count` | Comparison |
| Conflict matrix | `field_conflicts[]` | `field_name`, `value_a`, `value_b`, `source_a`, `source_b`, `verified_status`, `suggested_winner` | Main review |
| Merge preview | `merge_preview` | `survivor_customer_id`, `final_values`, `identity_remap_count`, `history_impact_count`, `warnings[]` | Before merge |

---

## 6. State Matrix

| State | Trigger | Visual | Notes |
|------|---------|--------|-------|
| Queue only | No case selected | List of cases | Entry |
| Reviewing | Case selected | Comparison + conflict + preview | Default |
| High-risk conflict | Strong conflict detected | Red banner + highlighted rows | Risk |
| Merge success | Merge completed | Success toast + queue updated | Completion |
| Merge blocked | Permission / stale issue | Inline error + disabled action | Guardrail |
| Resolved by others | Case already closed | Read-only resolved state | Recovery |

---

## 7. Error And Recovery

| Error | Trigger | Expected UX |
|-------|---------|-------------|
| Merge blocked by permission | User lacks approval rights | Inline error + disabled merge |
| Preview generation failed | Backend cannot generate preview | Preserve comparison, offer retry |
| Candidate stale | One candidate changed during review | Show stale banner, require refresh |
| Case already resolved | Another reviewer completed it | Show read-only resolved state |

---

## 8. Accessibility

- Conflict rows must be keyboard navigable
- High-risk conflict needs text label, not color only
- Confirmation modal should trap focus correctly
- Field selectors need explicit labels

---

## 9. Pre-Delivery Checklist

- [ ] Queue fields and sort/filter logic are complete
- [ ] Conflict matrix shows enough provenance for each field
- [ ] Merge preview explains impact clearly
- [ ] High-risk conflicts are visually and textually obvious
- [ ] Permission-blocked state is not ambiguous
