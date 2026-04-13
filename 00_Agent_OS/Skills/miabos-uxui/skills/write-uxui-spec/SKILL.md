---
name: write-uxui-spec
description: "Write UXUI Feature Spec with all 5 mandatory behavioral sections (§0 User & Task, §2.1 Task Flow, §5.1 Error & Recovery, §6 UI Copy Glossary, Route Declaration). Derives behavior from Feature SRS, not visual intuition. Use when A06 needs to produce a UXUI spec for an approved Feature SRS."
agent: A06
phase: PB-03
input: "Feature SRS (SRS Ready), PRD User Task Flow, Design System"
output: "UXUI Feature Spec in project Design/UXUI_Features/"
template: "00_Agent_OS/Templates/T-UXUI-Feature-Spec.md"
---

# Write UXUI Feature Spec

## Purpose

Produce the canonical UXUI Feature Spec that bridges Feature SRS (what it does) with frontend implementation (how it looks and behaves). The spec must be complete enough that A07 can build FE Preview without inventing behavior.

## Critical Rule

**Handoff is BLOCKED** if any of these 5 sections are missing, even if layout and tokens are complete.

## Instructions

### Step 1: Read Inputs (mandatory before any design)

1. Read **Feature SRS** — must be at least `SRS Ready`
2. Read **PRD** — especially User Task Flow section
3. Read **Design System** — current tokens, components, patterns
4. Read **A06 Agent definition** — Design Principles for MIABOS
5. If redesign: read the existing UXUI spec being replaced

### Step 2: Write §0 User & Task

This is the foundation. Everything else derives from this.

| Field | What to Write |
|-------|--------------|
| **Target User Role(s)** | Table: Role, Description, Context (what they're doing when they use this) |
| **Primary Task Objective** | Measurable action: "Agent changes status in <10s" |
| **Success Metric** | Table: Metric, Target, How to Measure |
| **Failure Indicators** | Bullets: signs the design failed (>2 routes to complete 1 task, user abandons, etc.) |

### Step 3: Write §2.1 Task Flow

5-7 step flow the primary user follows:

| Step | User Action | System Response | Field Visibility | Notes |
|------|------------|-----------------|-----------------|-------|

**Must also include Three Interaction Patterns:**
1. **Quick Action** — most common path in ≤3 steps
2. **Exception Handling** — what user sees/does when normal path fails
3. **Bulk Operation** — multi-item processing, or explicit "N/A + reason"

**Progressive Disclosure Rules:**
- Required fields: Always visible
- Optional fields: Visible after user initiates task
- Advanced fields: Hidden behind "More Options"

### Step 4: Write §5.1 Error & Recovery

| Error ID | At Step | Description | Frequency | System Assistance | Recovery Action |
|----------|---------|-------------|-----------|-------------------|----------------|

**Dead-End Prevention Checklist:**
- Every error has Vietnamese user-facing message
- Every error has recovery action (retry, go back, alternative)
- No step leads to blank/unresponsive state
- Form validation is inline, not submit-only

### Step 5: Write §6 UI Copy Glossary

Map operational terms to forbidden technical terms:

| User-Facing Term (Vietnamese) | Forbidden Technical Term | Where Used |
|-------------------------------|------------------------|-----------|
| Khach hang | customer (DB field) | List title, breadcrumb |
| Trang thai | status (API field) | Dropdown label |

**Rule**: All labels, buttons, placeholders, empty states, hints, errors in the spec MUST use only terms from this glossary.

### Step 6: Write Route Declaration

For each route introduced:
- State the dominant user goal
- Confirm single-scope (one goal per route)
- IA labels use job/action vocabulary, NOT module codes (M01, M09 are forbidden in UI)

### Step 7: Complete Remaining Sections

Fill T-UXUI-Feature-Spec template sections 1-10:
- Screen Inventory, Visual Specification, Data Binding, State Matrix
- Copy & Microcopy (100% Vietnamese)
- Interaction & Animation
- Accessibility
- A05 Technical Cross-Check
- A07 Pre-Delivery Checklist

**Use `ui-ux-pro-max` skill** for visual design decisions: style selection, color palette, component patterns, accessibility rules.

### Step 8: Set Status

- `Draft` → sections incomplete or SRS not yet `SRS Ready`
- `In Review` → all 5 mandatory sections complete, ready for PM/Boss review
- `Approved` → Boss/PM signed off

## Quality Checks

- [ ] §0 User & Task complete with measurable success metric
- [ ] §2.1 Task Flow has 5-7 steps + Three Interaction Patterns
- [ ] §5.1 Error & Recovery covers all decision points from §2.1
- [ ] §6 UI Copy Glossary maps all visible terms (zero English in UI)
- [ ] Route Declaration: each route has single dominant goal
- [ ] IA labels use job vocabulary, no module codes
- [ ] Primary CTA visually dominant on every screen (one primary only)
- [ ] Form fields follow Task Flow order (not DB schema order)
- [ ] Vietnamese copy complete — no English placeholders
- [ ] Feature SRS was `SRS Ready` before starting
- [ ] Design System tokens referenced (not ad-hoc values)
