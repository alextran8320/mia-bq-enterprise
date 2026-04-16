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
**Blocking Reason**: Cần chốt action taxonomy phase 1, destination routing, template binding, và consent gate theo từng channel.
**Product**: MIA Smart / CRM Workspace
**Design System Reference**: [`Design/Design_System.md`](../Design_System.md)
**Save to**: `Design/UXUI_Features/UXUI-F-M06-CRM-001D_Care_Action.md`
**Date**: 2026-04-16

> **Precondition**: Parent SRS `F-M06-CRM-001` defines allowed action types, consent gates, and workflow side effects. This document defines the human-facing `Care Action` composer surface.

---

## 0. User & Task

### Target User Role(s)

| Role | Mô tả | Context |
|------|------|---------|
| Sales | Nhân viên bán hàng | Tạo follow-up / callback / chăm sóc sau tư vấn |
| CSKH | Nhân viên chăm sóc khách hàng | Ghi care note, callback, handoff |
| Marketing | Nhân viên CRM / Marketing | Gửi promo hoặc chăm sóc nếu consent hợp lệ |
| Store Manager | Quản lý cửa hàng | Giao việc / follow-up các case tại cửa hàng |

### Primary Task Objective

> Người dùng tạo một hành động chăm sóc đúng loại, đúng người, đúng kênh và đúng điều kiện consent trong **<= 60 giây**, không bị mất ngữ cảnh khách hàng hiện tại.

### Success Metrics

| Metric | Target | Cách đo |
|--------|--------|---------|
| Time to create action | <= 60s | Từ mở composer đến submit |
| Failed submit due to missing context | <= 5% | Tỷ lệ submit fail vì thiếu field / routing |
| Consent-safe action rate | 100% | Không gửi marketing action khi consent không hợp lệ |
| Timeline write-back rate | 100% | Action thành công phải lên timeline |

### Failure Indicators

- Người dùng không biết phải điền field nào với từng action type
- Composer không hiển thị context / consent nên submit nhầm
- Submit fail làm mất dữ liệu đã nhập
- Handoff / follow-up không rõ đi về ai hoặc hệ thống nào

---

## 1. Feature Overview

### Purpose

Cung cấp composer ngắn, rõ, có context để người dùng tạo follow-up hoặc hành động chăm sóc mà không đánh mất ngữ cảnh khách hàng và không vi phạm consent / permission rules.

### User Story

```text
Là Sales, CSKH, hoặc Marketing,
Tôi muốn mở một composer hành động ngay từ ngữ cảnh khách hàng hiện tại,
Để tôi tạo follow-up, callback, handoff, care note, hoặc gửi promo nhanh và đúng điều kiện.
```

### Linked Artifacts

| Artifact | Location | Status |
|----------|----------|--------|
| Feature SRS | [F-M06-CRM-001_Customer_And_CRM_SRS.md](../../Analysis/Features/Modules/CRM_Workspace/Customer_And_CRM/SRS/F-M06-CRM-001_Customer_And_CRM_SRS.md) | Draft |
| User Story | [US-M06-CRM-001D_Care_Action.md](../../Planning/Stories/CRM_Workspace/US-M06-CRM-001D_Care_Action.md) | Draft |
| Related Surface | [UXUI-F-M06-CRM-001B_Customer_360.md](UXUI-F-M06-CRM-001B_Customer_360.md) | Draft |

---

## 2. Screen Inventory

| # | Surface / State | Route / Trigger | Mục đích |
|---|-----------------|-----------------|----------|
| S1 | Care Action - Side Panel | from `Customer 360` | Action trong context sâu |
| S2 | Care Action - Quick Modal | from `Customer List` | Action nhanh từ list |
| S3 | Care Action - AI Prefilled | from AI suggestion | Action được prefill |
| S4 | Care Action - Restricted | any surface | Consent / permission blocked |
| S5 | Care Action - Submit Success / Fail | after submit | Completion and recovery |

---

## 2.1 Information Architecture

### Header Summary

Phải có:

- customer name
- customer id
- lifecycle
- consent badge
- preferred channel
- owner hiện tại

### Context Preview

Phải hiển thị:

- AI suggestion nếu action đến từ AI
- last interaction
- last order
- current consent state
- warning nếu action không phù hợp context

### Action Form

Field tối thiểu:

- `action_type`
- `target_channel`
- `owner`
- `due_date / follow_up_date`
- `priority`
- `note`
- `template / campaign ref` nếu có

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

- bắt buộc `owner`, `due date`, `note`
- submit xong tạo timeline event

### Schedule Callback

- bắt buộc `callback time`, `owner`, `note`
- disable nếu thiếu phone hợp lệ

### Send Promo / Care Message

- bắt buộc `target channel`, `template/campaign`
- hiển thị content preview
- disable submit nếu consent không hợp lệ

### Care Note

- chỉ cần `note`, optional tag
- submit xong lên timeline ngay

### Handoff

- bắt buộc `destination owner/team`, `reason`, `priority`

---

## 4. Search, Filter, Sort Logic

### Search

Chỉ áp dụng khi chọn:

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
