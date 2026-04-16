# UXUI Feature Spec: F-M06-CRM-001D Care Action

**Feature ID**: F-M06-CRM-001D
**Parent Feature ID**: F-M06-CRM-001
**Status**: Draft
**Owner**: A06 UI/UX Agent
**Last Updated By**: Codex CLI (GPT-5 Codex)
**Last Reviewed By**: A01 PM Agent
**Approval Required**: A05 Tech Lead, A01 PM
**Approved By**: -
**Last Status Change**: 2026-04-16
**Source of Truth**: This document
**Blocking Reason**: C?n ch?t action taxonomy phase 1, destination routing, template binding, và consent gate theo t?ng channel.
**Product**: MIA Smart / CRM Workspace
**Design System Reference**: [`Design/Design_System.md`](../Design_System.md)
**Save to**: `Design/UXUI_Features/UXUI-F-M06-CRM-001D_Care_Action.md`
**Date**: 2026-04-16

> **Precondition**: Parent SRS `F-M06-CRM-001` defines allowed action types, consent gates, and workflow side effects. This document defines the human-facing `Care Action` composer surface.

---

## §0. User & Task

### Target User Role(s)

| Role | Mô t? | Context |
|------|------|---------|
| Sales | Nhân viên bán hàng | T?o follow-up / callback / cham sóc sau tu v?n |
| CSKH | Nhân viên cham sóc khách hàng | Ghi care note, callback, handoff |
| Marketing | Nhân viên CRM / Marketing | G?i promo ho?c cham sóc n?u consent h?p l? |
| Store Manager | Qu?n lý c?a hàng | Giao vi?c / follow-up các case t?i c?a hàng |

### Primary Task Objective

> Ngu?i dùng t?o m?t hành d?ng cham sóc dúng lo?i, dúng ngu?i, dúng kênh và dúng di?u ki?n consent trong **= 60 giây**, không b? m?t ng? c?nh khách hàng hi?n t?i.

### Success Metrics

| Metric | Target | Cách do |
|--------|--------|---------|
| Time to create action | = 60s | T? m? composer d?n submit |
| Failed submit due to missing context | = 5% | T? l? submit fail vì thi?u field / routing |
| Consent-safe action rate | 100% | Không g?i marketing action khi consent không h?p l? |
| Timeline write-back rate | 100% | Action thành công ph?i lên timeline |

### Failure Indicators

- Ngu?i dùng không bi?t ph?i di?n field nào v?i t?ng action type
- Composer không hi?n th? context / consent nên submit nh?m
- Submit fail làm m?t d? li?u dã nh?p
- Handoff / follow-up không rõ di v? ai ho?c h? th?ng nào

---

## 1. Feature Overview

### Purpose

Cung c?p composer ng?n, rõ, có context d? ngu?i dùng t?o follow-up ho?c hành d?ng cham sóc mà không dánh m?t ng? c?nh khách hàng và không vi ph?m consent / permission rules.

### User Story

```text
Là Sales, CSKH, ho?c Marketing,
Tôi mu?n m? m?t composer hành d?ng ngay t? ng? c?nh khách hàng hi?n t?i,
Ð? tôi t?o follow-up, callback, handoff, care note, ho?c g?i promo nhanh và dúng di?u ki?n.
```

### Linked Artifacts

| Artifact | Location | Status |
|----------|----------|--------|
| Feature SRS | [F-M06-CRM-001_Customer_And_CRM_SRS.md](../../Analysis/Features/Modules/CRM_Workspace/Customer_And_CRM/SRS/F-M06-CRM-001_Customer_And_CRM_SRS.md) | Draft |
| User Story | [US-M06-CRM-001D_Care_Action.md](../../Planning/Stories/CRM_Workspace/US-M06-CRM-001D_Care_Action.md) | Draft |
| Related Surface | [UXUI-F-M06-CRM-001B_Customer_360.md](UXUI-F-M06-CRM-001B_Customer_360.md) | Draft |

---

## 2. Screen Inventory

| # | Surface / State | Route / Trigger | M?c dích |
|---|-----------------|-----------------|----------|
| S1 | Care Action - Side Panel | from `Customer 360` | Action trong context sâu |
| S2 | Care Action - Quick Modal | from `Customer List` | Action nhanh t? list |
| S3 | Care Action - AI Prefilled | from AI suggestion | Action du?c prefill |
| S4 | Care Action - Restricted | any surface | Consent / permission blocked |
| S5 | Care Action - Submit Success / Fail | after submit | Completion and recovery |

---

## 2.1 Information Architecture

### Header Summary

Ph?i có:

- customer name
- customer id
- lifecycle
- consent badge
- preferred channel
- owner hi?n t?i

### Context Preview

Ph?i hi?n th?:

- AI suggestion n?u action d?n t? AI
- last interaction
- last order
- current consent state
- warning n?u action không phù h?p context

### Action Form

Field t?i thi?u:

- `action_type`
- `target_channel`
- `owner`
- `due_date / follow_up_date`
- `priority`
- `note`
- `template / campaign ref` n?u có

---

## 2.2 Task Flow

| Step | User Action | System Response | Notes |
|------|-------------|-----------------|-------|
| 1 | Open composer from Customer 360 / List / AI suggestion | Render header summary + context preview | Entry |
| 2 | Select action type | Form updates dynamically | Action-specific fields |
| 3 | Fill owner/channel/date/note/template | Validate in place | Fast compose |
| 4 | Review consent / warnings | Disable or allow submit | Guardrails |
| 5 | Submit | Success toast + timeline event | Completion |

---

## 3. Action Logic

### Follow-up Task

- b?t bu?c `owner`, `due date`, `note`
- submit xong t?o timeline event

### Schedule Callback

- b?t bu?c `callback time`, `owner`, `note`
- disable n?u thi?u phone h?p l?

### Send Promo / Care Message

- b?t bu?c `target channel`, `template/campaign`
- hi?n th? content preview
- disable submit n?u consent không h?p l?

### Care Note

- ch? c?n `note`, optional tag
- submit xong lên timeline ngay

### Handoff

- b?t bu?c `destination owner/team`, `reason`, `priority`

---

## 4. Search, Filter, Sort Logic

### Search

Ch? áp d?ng khi ch?n:

- template
- campaign
- owner

### Sort

- template: `recently used desc`
- owner: `team then name`
- campaign: `active desc`

---

## 5. Data Binding

| UI Area | Data Group | Required Fields | Notes |
|--------|------------|-----------------|-------|
| Header summary | `customer_header` | `customer_id`, `display_name`, `lifecycle`, `consent_status`, `preferred_channel`, `owner_name` | Above form |
| Context preview | `context_preview` | `last_interaction`, `last_order`, `current_consent`, `ai_suggestion`, `warnings[]` | Before action |
| Form core | `action_form` | `action_type`, `target_channel`, `owner_id`, `due_at`, `priority`, `note`, `template_id` | Dynamic form |
| Submit result | `action_result` | `action_id`, `status`, `timeline_event_id` | Post-submit |

---

## 6. State Matrix

| State | Trigger | Visual | Notes |
|------|---------|--------|-------|
| Ready | Form ready | Normal composer | Default |
| Restricted | Consent / permission invalid | Banner + disabled submit | Guardrail |
| Submitted | Action success | Success toast + timeline updated | Completion |
| Failed | Submit error | Inline error + retry | Preserve form |
| Draft saved | Future optional state | Subtle tag | Phase sau |

---

## 7. Error And Recovery

| Error | Trigger | Expected UX |
|-------|---------|-------------|
| Consent restricted | Marketing action on invalid consent | Disable submit + clear reason |
| Missing contact | Callback without valid phone | Inline validation |
| Workflow routing unavailable | Handoff target cannot be resolved | Keep form values, allow retry |
| Template unavailable | Selected template archived | Warning + prompt reselection |

---

## 8. Accessibility

- All action-specific fields need labels and help text
- Disabled submit must explain why
- Success and failure toasts should be screen-reader friendly
- Dynamic field changes should not trap focus

---

## 9. Pre-Delivery Checklist

- [ ] Each action type has a complete field map
- [ ] Consent / permission gating is explicit in the UI
- [ ] Dynamic form transitions are predictable
- [ ] Failure state preserves user input
- [ ] Timeline side effect is clearly defined
