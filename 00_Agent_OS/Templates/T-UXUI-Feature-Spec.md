# UXUI Feature Spec: [Feature Name]

**Feature ID**: F-[Module]-[Number]
**Status**: Draft / In Review / Approved / Blocked / Deprecated
**Owner**: [[A06_UI_UX_Agent|A06 UI/UX Agent]]
**Implementation Reviewer**: [[A05_Tech_Lead_Agent|A05 Tech Lead]]
**Implemented By**: [[A07_FE_Builder_Agent|A07 FE Builder]]
**Product**: [MIA Smart / MIA Spring / MIA Scale / Platform]
**Design System Reference**: `Design/Design_System.md`
**Save to**: `Design/UXUI_Features/UXUI-[F-ID]_[Feature-Name].md`
**Date**: YYYY-MM-DD
**Last Status Change**: YYYY-MM-DD

---

> **Precondition**: The linked `Feature SRS` must already be `SRS Ready` or higher. Without that prerequisite, this document may exist only as a `Non-Binding Concept` and may not be used for gating, subtask release, or build handoff.

## §0. User & Task ⚠️ MANDATORY — Handoff blocked without this section

### Target User Role(s)
| Role | Description | Context |
|------|-------------|--------|
| _e.g. Agent_ | _Customer service rep handling live conversations_ | _On duty, multitasking across channels_ |
| _e.g. Supervisor_ | _Team lead monitoring agent performance_ | _Reviewing metrics, handling escalations_ |

### Primary Task Objective
_What is the user trying to accomplish? State as a clear, measurable action._

> Example: "Agent changes conversation status in <10 seconds without leaving the current screen."
> Example: "Supervisor assigns a conversation to an agent in <3 clicks."

### Success Metric
| Metric | Target | How to Measure |
|--------|--------|---------------|
| Task completion time | _e.g. <10s_ | _Stopwatch from screen load to task done_ |
| Error rate | _e.g. <5%_ | _Count of user errors during task flow_ |
| Steps to complete | _e.g. ≤5 clicks_ | _Count clicks from entry to task done_ |

### Failure Indicators
- _e.g. User opens >2 routes to complete 1 task_
- _e.g. User abandons form halfway_
- _e.g. User needs to ask colleague how to do it_

---

## 1. Feature Overview

### Purpose
_What user need does this feature serve? What problem does it solve? Reference §0 User & Task for the primary job-to-be-done._

### User Persona
_Which user type primarily uses this? (e.g., SME Owner, Marketing Staff, Admin)_

### User Story
```
As a [user type],
I want to [action],
So that [business value].
```

### Linked Artifacts
| Artifact | Location | Status |
|----------|----------|--------|
| User Story | `Planning/Stories/[Module]/US-XX-XXX.md` | |
| Feature SRS | `Analysis/Features/SRS/F-XX-XXX.md` | |
| API Contract | `Architecture/API_Contract.md#section` | |
| Data Mapping | `Architecture/Data_Mapping.md#section` | |

---

## 2. Screen Inventory

| # | Screen Name | Route/Path | Purpose | Mockup |
|---|-------------|-----------|---------|--------|
| S1 | | | | `Design/Mockups/F-XX-XXX_S1.png` |
| S2 | | | | `Design/Mockups/F-XX-XXX_S2.png` |

---

## 2.1 Task Flow ⚠️ MANDATORY — Handoff blocked without this section

_Document the 5–7 step flow the primary user follows to complete their task. Mark which step introduces advanced/optional fields (progressive disclosure)._

### Primary Task Flow

| Step | User Action | System Response | Field Visibility | Notes |
|------|------------|-----------------|-----------------|-------|
| 1 | _e.g. Opens conversation list_ | _Show filtered list for assigned conversations_ | Required fields only | _Entry point_ |
| 2 | _e.g. Clicks on conversation_ | _Opens conversation detail panel_ | Required fields only | |
| 3 | _e.g. Clicks "Change Status"_ | _Shows status dropdown_ | Required fields only | _Quick action_ |
| 4 | _e.g. Selects new status_ | _Validates transition rules_ | Required fields only | _Decision point: if invalid, show §5.1 error_ |
| 5 | _e.g. Confirms change_ | _Saves + shows success toast_ | — | _Task complete_ |
| 6 | _(Optional) Clicks "Advanced"_ | _Expands advanced options panel_ | Optional + Advanced | _Progressive disclosure_ |

### Decision Points & Branching
| At Step | Condition | Branch To |
|---------|-----------|----------|
| _e.g. Step 4_ | _Status transition not allowed_ | _§5.1 Error E1 — show inline error + allowed transitions_ |

### Progressive Disclosure Rules
- **Required fields**: Always visible from Step 1
- **Optional fields**: Visible after user initiates the task (Step 3+)
- **Advanced fields**: Hidden behind "Advanced" or "More Options" — only shown on explicit user action

> **Agent Flow Example**: Agent on duty → clicks conversation → changes status → done (3 clicks).
> **Supervisor Flow Example**: Supervisor reviews dashboard → filters by team → clicks agent → reassigns conversation → done (4 clicks).

> Derive this section from the linked `Feature SRS` task, state, permission, and error contracts. Do not invent feature behavior from visual preference alone.

---

## 3. Visual Specification (Per Screen)

### Screen S1: [Screen Name]

#### Layout (ASCII Wireframe)
```
┌─────────────────────────────────────────────┐
│ PageHeader: [Title] + [Breadcrumbs]          │
├─────────────────────────────────────────────┤
│ FilterBar: [Search] [Filter1] [Filter2]      │
├─────────────────────────────────────────────┤
│ Content Area                                 │
│ ┌──────────────────────────────────────────┐│
│ │ [Main Component]                          ││
│ └──────────────────────────────────────────┘│
└─────────────────────────────────────────────┘
```

#### Component Breakdown

| Component | Design Token | Framework Mapping | Notes |
|-----------|-------------|-------------------|-------|
| PageHeader | H1 (24px/700) | `<PageHeader>` | Vietnamese title |
| DataTable | Body Small (13px/400) | `<Table>` | Sortable, paginated |

#### Design Token Values (Exact)

| Element | Property | Token / Value |
|---------|----------|---------------|
| Page background | `background` | `--color-bg-page` (#F8FAFC) |
| Card background | `background` | `--color-bg-card` (#FFFFFF) |
| Card padding | `padding` | `--space-5` (20px) |
| Card radius | `border-radius` | `--radius-md` (8px) |
| Card shadow | `box-shadow` | `--shadow-1` |
| _[Every visible element must have explicit tokens]_ | | |

#### Responsive Behavior

| Breakpoint | Change |
|-----------|--------|
| Desktop (≥1024px) | Full layout as wireframed |
| Tablet (768-1023px) | [Describe specific changes] |
| Mobile (<768px) | [Describe specific changes] |

---

## 4. Data Binding

| UI Element | API Endpoint | Field | Format | Sort/Filter |
|-----------|-------------|-------|--------|-------------|
| _[Map every visible data point to API]_ | | | | |

---

## 5. State Matrix

### Page-Level States

| State | Trigger | Visual | Notes |
|-------|---------|--------|-------|
| **Loading** | API in-flight | Skeleton blocks matching layout | Show after 300ms |
| **Empty** | 0 results | Illustration + "Chưa có dữ liệu" + CTA | |
| **Error** | API error | Error card + "Thử lại" button | Retry refetches |
| **Populated** | Data returned | Normal display | Default |
| **Filtered (no match)** | Filters, 0 results | "Không tìm thấy" + clear filter link | |

### Component-Level States

| Component | Default | Hover | Active | Focus | Disabled | Loading | Error |
|-----------|---------|-------|--------|-------|----------|---------|-------|
| _[Every interactive component]_ | | | | | | | |

### Destructive Actions

| Action | Confirmation | Undo |
|--------|-------------|------|
| _[Every delete/remove action]_ | Dialog text | Toast + "Hoàn tác" |

---

## 5.1 Error & Recovery ⚠️ MANDATORY — Handoff blocked without this section

_Document common errors users encounter during the Task Flow (§2.1) and how the system helps recover._

### Common Errors

| Error ID | At Step | Error Description | Frequency | System Assistance | Recovery Action |
|----------|---------|-------------------|-----------|-------------------|----------------|
| E1 | _e.g. Step 4_ | _Invalid status transition_ | Common | _Inline error: "Không thể chuyển từ [X] sang [Y]. Trạng thái hợp lệ: [A, B, C]"_ | _Show allowed transitions as clickable options_ |
| E2 | _e.g. Step 3_ | _Required field missing_ | Common | _Highlight empty field + scroll to it + "Vui lòng nhập [field name]"_ | _Focus on missing field_ |
| E3 | _e.g. Step 5_ | _Network/API error during save_ | Rare | _"Đã xảy ra lỗi. Dữ liệu chưa được lưu." + Retry button_ | _Auto-retry once, then show retry button_ |

### Dead-End Prevention Checklist
- [ ] Every error state has a clear user-facing message (Vietnamese)
- [ ] Every error state has a recovery action (retry, go back, alternative path)
- [ ] No step in the Task Flow leads to a blank screen or unresponsive state
- [ ] Form validation is inline and immediate (not only on submit)
- [ ] Long forms have save-as-draft or auto-save
- [ ] Cancel/Back always works and preserves user input where appropriate

### Guidance & Assistance
| Guidance Type | Where | Content |
|---------------|-------|---------|
| Empty state | _e.g. First visit to list_ | _"Chưa có dữ liệu. Bắt đầu bằng cách [CTA]."_ |
| Contextual hint | _e.g. Complex field_ | _Tooltip or helper text explaining what to enter_ |
| Next step | _e.g. After completing task_ | _"Đã lưu thành công. Bạn có thể [next action]."_ |

---

## 6. Copy & Microcopy (Vietnamese)

| Element | Vietnamese Text | Max Length |
|---------|----------------|-----------|
| Page Title | | |
| Empty State | "Chưa có dữ liệu" | 30 chars |
| Error | "Đã xảy ra lỗi. Vui lòng thử lại." | 50 chars |
| _[100% Vietnamese, zero English labels]_ | | |

---

## 7. Interaction & Animation

| Interaction | Animation | Duration | Easing |
|------------|-----------|----------|--------|
| Page enter | Fade in | 200ms | ease-out |
| Modal open | Scale(0.95→1) + fade | 250ms | ease-out |
| Modal close | Scale(1→0.95) + fade | 180ms | ease-in |
| _[Every animation]_ | | | |

> `prefers-reduced-motion` must disable non-essential animations.

---

## 8. Accessibility

- [ ] `aria-label` on: [icon-only buttons]
- [ ] `aria-sort` on: [sortable columns]
- [ ] `aria-live="polite"` on: [dynamic content]
- [ ] Keyboard tab order: [describe]
- [ ] Focus after modal close: [where?]

### Contrast Check

| Element | FG | BG | Ratio | Pass |
|---------|----|----|-------|------|
| _[All text/bg combinations]_ | | | | |

---

## 9. A05 Technical Cross-Check

| Item | Verdict | Notes |
|------|---------|-------|
| Component mapping | ✓/✗ | |
| Token compatibility | ✓/✗ | |
| Animation practical | ✓/✗ | |
| Responsive aligns | ✓/✗ | |
| Data binding matches API | ✓/✗ | |
| Shared components | | [list reuse vs new] |

**A05 Sign-Off**: ___ (YYYY-MM-DD)

---

## 10. Pre-Delivery Checklist (A07)

- [ ] Design tokens matched exactly
- [ ] No browser defaults visible
- [ ] Icons: Lucide SVG only (no emoji)
- [ ] Be Vietnam Pro font rendering verified
- [ ] All states implemented (loading, empty, error, populated)
- [ ] All hover/active/focus/disabled states
- [ ] Touch targets ≥ 44x44px
- [ ] Responsive: desktop + tablet + mobile
- [ ] 100% Vietnamese copy
- [ ] Verified demo/runtime evidence for all screens + states; screenshots optional unless explicitly requested
- [ ] `prefers-reduced-motion` handled
- [ ] Accessibility attributes applied

**A06 Design Sign-Off**: ___ (YYYY-MM-DD)
**A05 Tech Sign-Off**: ___ (YYYY-MM-DD)
**PM Gate**: ___ (YYYY-MM-DD)
