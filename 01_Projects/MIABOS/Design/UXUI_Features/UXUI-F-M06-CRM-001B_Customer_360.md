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
**Blocking Reason**: Cần chốt tab set phase 1, social relationship panel, call-history density, và mức chi tiết timeline.
**Product**: MIA Smart / CRM Workspace
**Design System Reference**: [`Design/Design_System.md`](../Design_System.md)
**Save to**: `Design/UXUI_Features/UXUI-F-M06-CRM-001B_Customer_360.md`
**Date**: 2026-04-16

> **Precondition**: Parent SRS `F-M06-CRM-001` remains the canonical source for profile, identity, social profile, order/chat/call summary, and customer action logic. This document defines the `Customer 360` viewing surface.

---

## 0. User & Task

### Target User Role(s)

| Role | Mô tả | Context |
|------|------|---------|
| Sales | Nhân viên bán hàng | Cần hiểu khách nhanh để chốt tư vấn |
| CSKH | Nhân viên chăm sóc khách hàng | Cần xem lịch sử và context trước khi phản hồi |
| Marketing | Nhân viên CRM / Marketing | Cần hiểu profile, consent, segment và hành vi |
| CRM Manager | Quản lý CRM | Cần kiểm tra hồ sơ, quality và duplicate signals |
| AI-assisted operator | Người dùng nhận gợi ý từ AI | Cần đọc `AI Summary` và chuyển thành hành động |

### Primary Task Objective

> Người dùng mở một hồ sơ và hiểu đủ về khách trong **3-5 giây** đầu tiên, sau đó có thể đào sâu vào order / chat / social / timeline hoặc tạo hành động mà không phải đổi màn hình liên tục.

### Success Metrics

| Metric | Target | Cách đo |
|--------|--------|---------|
| Time to understand top context | <= 5s | Từ lúc page load đến lúc đọc xong header + AI summary |
| Section engagement efficiency | <= 2 clicks tới block cần xem | Order / chat / call / social |
| Partial-data resilience | 100% | Một nguồn lỗi không làm page fail toàn bộ |
| Care-action launch rate | >= 30% phiên có next step | Từ Customer 360 sang action / duplicate / conversation |

### Failure Indicators

- Người dùng phải mở nhiều tab mới hiểu khách là ai
- Identity và social profile trộn lẫn, không rõ linked vs unresolved
- Timeline dày nhưng vô hướng, không giúp ra quyết định
- Action chìm lấp ở cuối trang, người dùng bỏ qua một nhịp chăm sóc

---

## 1. Feature Overview

### Purpose

Cung cấp màn hình trung tâm để người dùng đọc nhanh toàn bộ ngữ cảnh khách hàng và chuyển ngay sang hành động phù hợp mà không phải di chuyển qua nhiều module rời rạc.

### User Story

```text
Là Sales, CSKH, hoặc CRM Manager,
Tôi muốn mở một hồ sơ Customer 360 duy nhất để xem profile, identity, social profiles, lịch sử đơn, chat, call, timeline, và action context,
Để tôi hiểu khách trong vài giây và quyết định bước chăm sóc tiếp theo chính xác hơn.
```

### Linked Artifacts

| Artifact | Location | Status |
|----------|----------|--------|
| Feature SRS | [F-M06-CRM-001_Customer_And_CRM_SRS.md](../../Analysis/Features/Modules/CRM_Workspace/Customer_And_CRM/SRS/F-M06-CRM-001_Customer_And_CRM_SRS.md) | Draft |
| User Story | [US-M06-CRM-001B_Customer_360.md](../../Planning/Stories/CRM_Workspace/US-M06-CRM-001B_Customer_360.md) | Draft |
| Related Surface | [UXUI-F-M06-CRM-001D_Care_Action.md](UXUI-F-M06-CRM-001D_Care_Action.md) | Draft |

---

## 2. Screen Inventory

| # | Screen / State | Route | Mục đích |
|---|----------------|-------|----------|
| S1 | Customer 360 - Full Profile | `/crm/customers/:customer_id` | View đầy đủ hồ sơ |
| S2 | Customer 360 - Lead Only | `/crm/customers/:customer_id` | Trường hợp chưa có order history |
| S3 | Customer 360 - Partial Data | `/crm/customers/:customer_id` | Một nguồn không khả dụng |
| S4 | Customer 360 - Consent Restricted | `/crm/customers/:customer_id` | Chặn action marketing |
| S5 | Customer 360 - Duplicate Suspected | `/crm/customers/:customer_id` | Điều hướng sang duplicate review |

---

## 2.1 Information Architecture

### Profile Header

Phải có:

- avatar
- `display_name`
- `customer_id`
- lifecycle badge
- consent badge
- duplicate badge nếu có
- owner
- preferred store / region
- quick CTA:
  - `Tạo Care Action`
  - `Mở Duplicate Review`
  - `Copy contact`

### AI Summary

Phải hiển thị:

- summary 2-4 dòng
- `next best action`
- risk flags
- recommended care direction nếu có
- generated time

### Identity + Social Relationship Panel

Tách rõ 3 nhóm:

- `Core identities`: MIA, SAP, Haravan, KiotViet
- `Social profiles linked`
- `Social profiles unresolved / suggested`

Mỗi social profile cần hiển thị:

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

Phải có:

- size giày
- style preference
- budget range
- purpose / occasion
- preferred channel
- preferred store
- source và updated time của từng attribute

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

- icon theo loại event
- title
- timestamp
- source
- short description
- actor nếu có

---

## 2.2 Task Flow

### Primary Task Flow - Đọc hồ sơ và ra hành động

| Step | User Action | System Response | Notes |
|------|-------------|-----------------|-------|
| 1 | Mở Customer 360 từ list hoặc deep link | Render header + AI summary trước | Fast read |
| 2 | Scan identity / social panel | Hiển thị linked vs unresolved profiles | Identity check |
| 3 | Review orders / conversations / calls | Summary-first sections | Evidence |
| 4 | Dùng timeline để hiểu chuỗi sự kiện | Filter by event type | Context |
| 5 | Chọn `Care Action` / `Duplicate Review` / `Open conversation` | Open panel or navigate | Next step |

---

## 3. Search, Filter, Sort Logic In-Screen

### Search nội bộ

Cho phép search trong:

- order history theo mã đơn
- conversation history theo channel / intent
- timeline theo keyword

### Filter nội bộ

Timeline filter:

- order
- chat
- call
- campaign
- care note
- action

### Sort nội bộ

- order history: `date desc`
- conversation history: `last_message_at desc`
- call history: `started_at desc`
- timeline: `timestamp desc`

---

## 4. Actions And UX Behavior

### Header Actions

- `Tạo Care Action`
- `Mở Duplicate Review`
- `Copy phone / contact`

### Section Actions

- order: `xem thêm`
- conversation: `mở summary`
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

- Header CTAs phải có explicit labels
- Timeline filters phải dùng icon + text
- Social profile actions phải keyboard reachable
- Summary sections phải có heading hierarchy rõ ràng
- Critical badges như consent / duplicate không chỉ dựa vào màu

---

## 9. Pre-Delivery Checklist

- [ ] Above-the-fold content đủ để hiểu khách trong 3-5 giây
- [ ] Identity / social / attribute / history / timeline hierarchy không bị lẫn
- [ ] Partial-data state không làm hỏng page readability
- [ ] Consent-restricted state chặn đúng action marketing
- [ ] Mobile stack không mất social/duplicate signals
