# UXUI Feature Spec: F-M06-CRM-001B Customer 360

**Feature ID**: F-M06-CRM-001B
**Parent Feature ID**: F-M06-CRM-001
**Status**: Draft
**Owner**: A06 UI/UX Agent
**Last Updated By**: Codex CLI (GPT-5 Codex)
**Last Reviewed By**: A01 PM Agent
**Approval Required**: A05 Tech Lead, A01 PM
**Approved By**: -
**Last Status Change**: 2026-04-16
**Source of Truth**: This document
**Blocking Reason**: C?n ch?t tab set phase 1, social relationship panel, call-history density, và m?c chi ti?t timeline.
**Product**: MIA Smart / CRM Workspace
**Design System Reference**: [`Design/Design_System.md`](../Design_System.md)
**Save to**: `Design/UXUI_Features/UXUI-F-M06-CRM-001B_Customer_360.md`
**Date**: 2026-04-16

> **Precondition**: Parent SRS `F-M06-CRM-001` remains the canonical source for profile, identity, social profile, order/chat/call summary, and customer action logic. This document defines the `Customer 360` viewing surface.

---

## §0. User & Task

### Target User Role(s)

| Role | Mô t? | Context |
|------|------|---------|
| Sales | Nhân viên bán hàng | C?n hi?u khách nhanh d? ch?t tu v?n |
| CSKH | Nhân viên cham sóc khách hàng | C?n xem l?ch s? và context tru?c khi ph?n h?i |
| Marketing | Nhân viên CRM / Marketing | C?n hi?u profile, consent, segment và hành vi |
| CRM Manager | Qu?n lý CRM | C?n ki?m tra h? so, quality và duplicate signals |
| AI-assisted operator | Ngu?i dùng nh?n g?i ý t? AI | C?n d?c `AI Summary` và chuy?n thành hành d?ng |

### Primary Task Objective

> Ngu?i dùng m? m?t h? so và hi?u d? v? khách trong **3-5 giây** d?u tiên, sau dó có th? dào sâu vào order / chat / social / timeline ho?c t?o hành d?ng mà không ph?i d?i màn hình liên t?c.

### Success Metrics

| Metric | Target | Cách do |
|--------|--------|---------|
| Time to understand top context | = 5s | T? lúc page load d?n lúc d?c xong header + AI summary |
| Section engagement efficiency | = 2 clicks t?i block c?n xem | Order / chat / call / social |
| Partial-data resilience | 100% | M?t ngu?n l?i không làm page fail toàn b? |
| Care-action launch rate | = 30% phiên có next step | T? Customer 360 sang action / duplicate / conversation |

### Failure Indicators

- Ngu?i dùng ph?i m? nhi?u tab m?i hi?u khách là ai
- Identity và social profile tr?n l?n, không rõ linked vs unresolved
- Timeline dày nhung vô hu?ng, không giúp ra quy?t d?nh
- Action ch? l? ? cu?i trang, ngu?i dùng b? qua m?t nh?p cham sóc

---

## 1. Feature Overview

### Purpose

Cung c?p màn hình trung tâm d? ngu?i dùng d?c nhanh toàn b? ng? c?nh khách hàng và chuy?n ngay sang hành d?ng phù h?p mà không ph?i di chuy?n qua nhi?u module r?i r?c.

### User Story

```text
Là Sales, CSKH, ho?c CRM Manager,
Tôi mu?n m? m?t h? so Customer 360 duy nh?t d? xem profile, identity, social profiles, l?ch s? don, chat, call, timeline, và action context,
Ð? tôi hi?u khách trong vài giây và quy?t d?nh bu?c cham sóc ti?p theo chính xác hon.
```

### Linked Artifacts

| Artifact | Location | Status |
|----------|----------|--------|
| Feature SRS | [F-M06-CRM-001_Customer_And_CRM_SRS.md](../../Analysis/Features/Modules/CRM_Workspace/Customer_And_CRM/SRS/F-M06-CRM-001_Customer_And_CRM_SRS.md) | Draft |
| User Story | [US-M06-CRM-001B_Customer_360.md](../../Planning/Stories/CRM_Workspace/US-M06-CRM-001B_Customer_360.md) | Draft |
| Related Surface | [UXUI-F-M06-CRM-001D_Care_Action.md](UXUI-F-M06-CRM-001D_Care_Action.md) | Draft |

---

## 2. Screen Inventory

| # | Screen / State | Route | M?c dích |
|---|----------------|-------|----------|
| S1 | Customer 360 - Full Profile | `/crm/customers/:customer_id` | View d?y d? h? so |
| S2 | Customer 360 - Lead Only | `/crm/customers/:customer_id` | Tru?ng h?p chua có order history |
| S3 | Customer 360 - Partial Data | `/crm/customers/:customer_id` | M?t ngu?n không kh? d?ng |
| S4 | Customer 360 - Consent Restricted | `/crm/customers/:customer_id` | Ch?n action marketing |
| S5 | Customer 360 - Duplicate Suspected | `/crm/customers/:customer_id` | Ði?u hu?ng sang duplicate review |

---

## 2.1 Information Architecture

### Profile Header

Ph?i có:

- avatar
- `display_name`
- `customer_id`
- lifecycle badge
- consent badge
- duplicate badge n?u có
- owner
- preferred store / region
- quick CTA:
  - `T?o Care Action`
  - `M? Duplicate Review`
  - `Copy contact`

### AI Summary

Ph?i hi?n th?:

- summary 2-4 dòng
- `next best action`
- risk flags
- recommended care direction n?u có
- generated time

### Identity + Social Relationship Panel

Tách rõ 3 nhóm:

- `Core identities`: MIA, SAP, Haravan, KiotViet
- `Social profiles linked`
- `Social profiles unresolved / suggested`

M?i social profile c?n hi?n th?:

- channel
- display name
- external profile ref
- last interaction
- link status
- actions:
  - `link`
  - `unlink`
  - `needs review`
  - `open conversation`

### Attributes

Ph?i có:

- size giày
- style preference
- budget range
- purpose / occasion
- preferred channel
- preferred store
- source và updated time c?a t?ng attribute

### Histories

Order History:

- order code
- channel
- status
- value
- date
- item summary

Conversation History:

- channel
- started_at
- last_message_at
- primary intent
- sentiment
- summary

Call History:

- direction
- agent
- started_at
- duration
- outcome
- summary

Timeline:

- icon theo lo?i event
- title
- timestamp
- source
- short description
- actor n?u có

---

## 2.2 Task Flow

### Primary Task Flow - Ð?c h? so và ra hành d?ng

| Step | User Action | System Response | Notes |
|------|-------------|-----------------|-------|
| 1 | M? Customer 360 t? list ho?c deep link | Render header + AI summary tru?c | Fast read |
| 2 | Scan identity / social panel | Hi?n th? linked vs unresolved profiles | Identity check |
| 3 | Review orders / conversations / calls | Summary-first sections | Evidence |
| 4 | Dùng timeline d? hi?u chu?i s? ki?n | Filter by event type | Context |
| 5 | Ch?n `Care Action` / `Duplicate Review` / `Open conversation` | Open panel or navigate | Next step |

---

## 3. Search, Filter, Sort Logic In-Screen

### Search n?i b?

Cho phép search trong:

- order history theo mã don
- conversation history theo channel / intent
- timeline theo keyword

### Filter n?i b?

Timeline filter:

- order
- chat
- call
- campaign
- care note
- action

### Sort n?i b?

- order history: `date desc`
- conversation history: `last_message_at desc`
- call history: `started_at desc`
- timeline: `timestamp desc`

---

## 4. Actions And UX Behavior

### Header Actions

- `T?o Care Action`
- `M? Duplicate Review`
- `Copy phone / contact`

### Section Actions

- order: `xem thêm`
- conversation: `m? summary`
- call: `xem call summary`
- timeline item: `xem context`

### Social Actions

- `Link profile`
- `Unlink profile`
- `Mark needs review`
- `Open conversation`

---

## 5. Data Binding

| UI Area | Data Group | Required Fields | Notes |
|--------|------------|-----------------|-------|
| Header | `profile_header` | `customer_id`, `display_name`, `avatar_url`, `lifecycle`, `consent_status`, `owner_name`, `preferred_store`, `region`, `duplicate_flag` | Above the fold |
| AI Summary | `ai_summary` | `summary_text`, `next_best_action`, `risk_flags`, `generated_at` | Fast read |
| Identity Panel | `identities[]` | `source_system`, `external_id`, `verified_status` | Core identity |
| Social Panel | `social_profiles[]` | `channel`, `display_name`, `external_profile_ref`, `last_interaction_at`, `link_status` | Social relationship |
| Attributes | `attributes[]` | `attribute_key`, `attribute_value`, `source_type`, `updated_at` | CRM enrich |
| Histories | `recent_orders[]`, `recent_conversations[]`, `recent_calls[]` | summary fields | Summary-first |
| Timeline | `timeline_items[]` | `event_type`, `title`, `timestamp`, `source`, `summary` | Unified context |

---

## 6. State Matrix

| State | Trigger | Visual | Notes |
|------|---------|--------|-------|
| Lead-only | No order history | Keep profile + social + action visible | Lead from chatbot/social |
| Full profile | Full data available | 2-column full view | Default |
| Partial profile | One source unavailable | Show missing block retry / warning | No full-page fail |
| Consent restricted | Consent invalid for marketing | Banner + disabled marketing actions | Guardrail |
| Duplicate suspected | Duplicate flag active | Badge + CTA review | Conflict state |
| Social unresolved | Unresolved profile exists | Highlight social panel | Review needed |

---

## 7. Error And Recovery

| Error | Trigger | Expected UX |
|-------|---------|-------------|
| Order source timeout | Order block unavailable | Render block with retry, keep rest of page alive |
| Social profile fetch delayed | Social panel incomplete | Show partial state and refresh hint |
| Call history disabled | Feature not enabled | Hide/collapse call block gracefully |
| Timeline too long | Heavy history | Lazy load / paginate timeline |

---

## 8. Accessibility

- Header CTAs ph?i có explicit labels
- Timeline filters ph?i dùng icon + text
- Social profile actions ph?i keyboard reachable
- Summary sections ph?i có heading hierarchy rõ ràng
- Critical badges nhu consent / duplicate không ch? d?a vào màu

---

## 9. Pre-Delivery Checklist

- [ ] Above-the-fold content d? d? hi?u khách trong 3-5 giây
- [ ] Identity / social / attribute / history / timeline hierarchy không b? l?n
- [ ] Partial-data state không làm h?ng page readability
- [ ] Consent-restricted state ch?n dúng action marketing
- [ ] Mobile stack không m?t social/duplicate signals
