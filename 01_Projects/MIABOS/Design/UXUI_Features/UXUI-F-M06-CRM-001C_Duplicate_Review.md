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
**Blocking Reason**: C?n ch?t field priority matrix khi merge, quy?n approve merge, và chính sách split identity.
**Product**: MIA Smart / CRM Workspace
**Design System Reference**: [`Design/Design_System.md`](../Design_System.md)
**Save to**: `Design/UXUI_Features/UXUI-F-M06-CRM-001C_Duplicate_Review.md`
**Date**: 2026-04-16

> **Precondition**: Parent SRS `F-M06-CRM-001` must remain the source for duplicate, merge, survivor, split, and audit rules. This UXUI spec covers the human review surface only.

---

## §0. User & Task

### Target User Role(s)

| Role | Mô t? | Context |
|------|------|---------|
| CRM Manager | Ngu?i duy?t ch?t lu?ng d? li?u | C?n quy?t d?nh merge/split |
| CSKH Lead | Qu?n lý cham sóc khách hàng | C?n tránh merge nh?m khách dang du?c x? lý |
| Operations Manager | Qu?n lý v?n hành | C?n rà case nghi trùng ?nh hu?ng workflow |

### Primary Task Objective

> Reviewer hi?u rõ vì sao case b? nghi duplicate, th?y du?c impact c?a merge, và ra quy?t d?nh v?i confidence cao tru?c khi d? li?u b? h?p nh?t.

### Success Metrics

| Metric | Target | Cách do |
|--------|--------|---------|
| Time to first review decision | = 3 phút / case ph? bi?n | T? m? case d?n quy?t d?nh |
| Preview-before-merge rate | 100% | Không merge n?u chua xem preview |
| Wrong merge rate | = 1% | T? l? ph?i split / repair sau merge |
| High-risk conflict visibility | 100% | Consent / VIP / multiple ID conflict ph?i n?i rõ |

### Failure Indicators

- Reviewer không th?y rõ field nào dang conflict n?ng
- Merge preview không nói rõ s? identities / histories s? b? remap
- Nút `Merge` d? b?m tru?c khi hi?u case
- Không có cách postpone / assign khi?n queue b? t?c

---

## 1. Feature Overview

### Purpose

Cung c?p surface an toàn cho ngu?i dùng có th?m quy?n so sánh h? so nghi trùng, xem conflict, và dua ra quy?t d?nh merge ho?c split v?i audit d?y d?.

### User Story

```text
Là CRM Manager ho?c CSKH Lead,
Tôi mu?n có m?t màn hình review duplicate th?t rõ ràng d? th?y vì sao hai h? so b? nghi trùng, field nào conflict, và sau merge h? so s? ra sao,
Ð? tôi không merge nh?m và v?n x? lý nhanh các case trùng d? li?u.
```

### Linked Artifacts

| Artifact | Location | Status |
|----------|----------|--------|
| Feature SRS | [F-M06-CRM-001_Customer_And_CRM_SRS.md](../../Analysis/Features/Modules/CRM_Workspace/Customer_And_CRM/SRS/F-M06-CRM-001_Customer_And_CRM_SRS.md) | Draft |
| User Story | [US-M06-CRM-001C_Duplicate_Review.md](../../Planning/Stories/CRM_Workspace/US-M06-CRM-001C_Duplicate_Review.md) | Draft |
| Related Surface | [UXUI-F-M06-CRM-001B_Customer_360.md](UXUI-F-M06-CRM-001B_Customer_360.md) | Draft |

---

## 2. Screen Inventory

| # | Screen / State | Route | M?c dích |
|---|----------------|-------|----------|
| S1 | Review Queue | `/crm/customers/duplicate-review` | Xem queue các case c?n x? lý |
| S2 | Reviewing Case | `/crm/customers/duplicate-review` | So sánh candidates và conflict |
| S3 | Merge Preview | `/crm/customers/duplicate-review` | Xem k?t qu? sau merge |
| S4 | High-Risk Conflict | `/crm/customers/duplicate-review` | Tô rõ case nh?y c?m |
| S5 | Merge Blocked / Resolved | `/crm/customers/duplicate-review` | Handle permission / stale state |

---

## 2.1 Information Architecture

### Review Queue

Queue c?n hi?n th?:

- merge case id
- duplicate score
- candidate count
- lo?i match m?nh nh?t
- created_at
- assigned reviewer
- status

### Candidate Comparison Panel

M?i candidate card ph?i có:

- tên
- customer_id
- lifecycle
- source systems
- phone / email masked theo quy?n
- last interaction
- last order
- consent status
- social profile count

### Conflict Matrix

Field b?t bu?c:

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

M?i dòng field ph?i hi?n th?:

- giá tr? c?a candidate A
- giá tr? c?a candidate B
- ngu?n d? li?u
- confidence / verified status
- suggested winner n?u có
- selector cho survivor value

### Merge Preview

Merge preview ph?i có:

- survivor record du?c ch?n
- fields cu?i cùng sau merge
- s? identities remap
- s? orders / conversations / calls b? ?nh hu?ng
- warning n?u conflict m?nh

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

- `merge now` ch? enable sau khi user xem preview
- `mark not duplicate` b?t nh?p lý do
- `assign reviewer` m? modal ch?n ngu?i + due date
- `split identity` ch? hi?n trong state h?p l?

### Confirmation Rules

Merge:

- c?n modal xác nh?n l?n cu?i
- hi?n th? s? records b? ?nh hu?ng
- b?t nh?p note n?u có conflict m?nh

Not Duplicate:

- b?t nh?p reason

Assign Reviewer:

- ch?n reviewer
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
