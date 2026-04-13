# Design System: MIABOS Aura Minimalist

**Status**: Draft
**Owner**: [[A06_UI_UX_Agent|A06 UI/UX Agent]]
**Co-Owner (Implementation)**: [[A05_Tech_Lead_Agent|A05 Tech Lead]]
**Last Updated By**: A06
**Last Reviewed By**: A01
**Approval Required**: Business Owner (visual direction), A05 (implementability)
**Source of Truth**: This document
**Visual Standards**: Compliant with [[Visual_Standards]]
**Design Direction**: Aura Minimalist (The Editorial Dialogue)
**Platform Context**: MIABOS — AI workspace for Marketing, Sales, and Customer Service operations for Giày BQ (`Retail`)

---

## 0. Framework & Stack

| Layer | Technology | Version | Notes |
|-------|-----------|---------|-------|
| Backend/CMS | **Directus** | Latest | 161 collections, REST + GraphQL |
| UI Framework | **[React + TBD]** | — | A05 decides framework |
| Charts | **Recharts** or **Chart.js** | Latest | Funnel, Line, Bar, Pie |
| Icons | **Lucide Icons** (SVG only) | Latest | Outlined, 1.5px stroke |
| Font Primary | **Be Vietnam Pro** (Google Fonts) | Variable | Maintained for optimal Vietnamese diacritics despite Aura's default Public Sans. |
| Font Fallback | **Inter** → system-ui → sans-serif | Variable | International fallback |
| Font Mono | **JetBrains Mono** | 400-500 | Data labels, code, IDs |

### Font Import

```css
@import url('https://fonts.googleapis.com/css2?family=Be+Vietnam+Pro:wght@300;400;500;600;700&family=Inter:wght@300;400;500;600;700&family=JetBrains+Mono:wght@400;500&display=swap');
```

---

## 1. Design Tokens

### 1.1 Color System — The Cool Slate & Brand Blue

**Primary Palette** (MIA Brand Blue)

| Token                    | HEX       | RGB         | Usage                                     |
| ------------------------ | --------- | ----------- | ----------------------------------------- |
| `--color-primary`        | `#2F64F6` | 47,100,246  | Primary actions, active nav, primary CTAs |
| `--color-primary-hover`  | `#2552CC` | 37,82,204   | Hover state for primary                   |
| `--color-primary-active` | `#1A3B99` | 26,59,153   | Active/pressed state                      |
| `--color-primary-light`  | `#ECF2FE` | 236,242,254 | Primary tint backgrounds, hover rows      |
| `--color-primary-muted`  | `#D3E1FC` | 211,225,252 | Selected row, active tab bg               |

**Neutral Palette** (The Cool Slate Foundation)

| Token                    | HEX       | Usage                                                                    |
| ------------------------ | --------- | ------------------------------------------------------------------------ |
| `--color-bg-page`        | `#F6F9FF` | Global page background (cool off-white)                                  |
| `--color-bg-surface`     | `#ECF4FF` | Section background, sidebars (recessed feel)                             |
| `--color-bg-card`        | `#FFFFFF` | Card surfaces, modals, dropdowns (elevated workspace)                    |
| `--color-text-primary`   | `#013652` | Headings, primary text (Navy Slate) - **NO PURE BLACK**                  |
| `--color-text-secondary` | `#3A6381` | Body text, descriptions, muted labels                                    |
| `--color-text-tertiary`  | `#8EB6D9` | Placeholder, subtle borders, ghost outlines                              |
| `--color-border-ghost`   | `#8EB6D9` | 10-20% opacity for Ghost Borders (when separation is strictly necessary) |

**Semantic Colors** (Adjusted for the Cool Slate aesthetic)

| Token             | HEX       | Usage                                 | Icon Required |
| ----------------- | --------- | ------------------------------------- | ------------- |
| `--color-success` | `#22C55E` | Success, completed (MIA Accent Green) | ✓ checkmark   |
| `--color-error`   | `#E11D48` | Error, destructive, failed            | ✓ alert       |
| `--color-warning` | `#F59E0B` | Warning, attention needed             | ✓ warning     |

### 1.2 Typography — Editorial Clarity

| Element | Font | Size | Weight | Line Height | Usage |
|---------|------|------|--------|-------------|-------|
| Display | Be Vietnam Pro | 36px | 700 | 1.2 | Dashboard greetings, main hero |
| H1 | Be Vietnam Pro | 24px | 700 | 1.3 | Page titles |
| H2 | Be Vietnam Pro | 20px | 600 | 1.4 | Section headings |
| H3 | Be Vietnam Pro | 16px | 600 | 1.5 | Card titles, subsections |
| Body | Be Vietnam Pro | 14px | 400 | 1.6 | Standard body text (generous rhythm) |
| Label | Be Vietnam Pro | 11px | 500 | 1.5 | Metadata, timestamps in `#3A6381` |

**The "Intentional Gap" Rule:**
Whenever possible, skip one size in the hierarchy for adjacent typographic elements (e.g., place a `Label` metadata immediately above an `H2` title) to force an editorial contrast.

### 1.3 Elevation & Depth: Tonal Layering

Traditional sharp drop shadows are forbidden. We use **Ambient Depth**.

| Level | Value | Usage |
|-------|-------|-------|
| `--shadow-0` | none | Flat elements |
| `--shadow-ambient` | `0 12px 24px rgba(1, 54, 82, 0.04)` | Floating action buttons, active chat bubbles. Feels like a soft room glow. |
| `--shadow-glass` | `backdrop-filter: blur(20px); background: rgba(246, 249, 255, 0.8)` | Modals, Emoji pickers, Floating Docks. |

---

## 2. Component Library

### 2.1 The "No-Line" Rule
**Explicit Instruction:** Designers and Developers are prohibited from using 1px solid borders (`<hr>`) to define layout sections. All structural boundaries must be achieved through:
1. **Background Color Shifts:** Placing a `--color-bg-surface` (`#ECF4FF`) sidebar against a `--color-bg-page` (`#F6F9FF`) background.
2. **Generous Spacing:** Alternating blocks using double standard margins.

### 2.2 Buttons

| Variant | Radius | Padding | Style |
|---------|--------|---------|-------|
| Primary | Pill (1.5rem / 9999px) | 12px 24px | Linear gradient from `--color-primary` to `--color-primary-hover` at 135°. White text. |
| Secondary | Pill (1.5rem / 9999px) | 12px 24px | `--color-primary-light` background, `--color-primary` text. |
| Tertiary | Pill (1.5rem / 9999px) | 12px 24px | `Transparent` bg, `--color-primary` text. |

### 2.3 Data Tables (Dashboard-Critical Component)

- **The "No-Divider" Rule:** Data tables do not have vertical lines. Horizontal separation is achieved either by utilizing `--space-5` (20px) paddings or alternating background tones between white and `--color-bg-page`.
- **Row Selected:** Use `--color-primary-muted`.
- **Avatars in Tables:** Always `rounded-full` (9999px). When grouped (e.g., multiple participants), they overlap with a `2px` stroke of `--color-bg-card` mimicking a cutout.

### 2.4 Inputs & Floating Dock

**Standard Input Fields:** 
- Use `--color-bg-card` (`#FFFFFF`). 
- Do **not** use a solid border; use a subtle ambient shadow or a 10% ghost `outline` to define the hit area. Text should be `body` size.

**The "Floating Dock" (For Customer Conversations):**
Instead of a pinned bottom bar, the message input must be a **Floating Dock**:
- **Position:** Centered at the bottom, 24px from the screen edge.
- **Style:** Utilizes Glassmorphism (`--shadow-glass`) and an Ambient Shadow. This keeps the workspace feeling unconstrained.

---

## 3. Screen Layouts & Structural Architecture

### Asymmetric Padding
High-end design is defined by what you *don’t* include. Utilize asymmetric padding for containers: e.g., Top padding `32px` vs Bottom padding `20px` to create an editorial "lift" and directional reading flow.

### MIABOS Screen Baseline (Tonal Nesting)
```
AppShell
├── TopBar (Glassmorphism, sticky top)
│   └── Logo, Fast-Global-Search, User Menu
├── Sidebar (Full height)
│   └── Base: `--color-bg-surface` (#ECF4FF) — Directly touches Main Content without any border.
└── MainContent
    └── Base: `--color-bg-page` (#F6F9FF)
        ├── PageHeader (Title using Intentional Gap)
        ├── ContentArea
        │   ├── White Cards (`--color-bg-card` / #FFFFFF)
        │   ├── Borderless Data Tables
        │   └── Floating Dock inputs (if applicable)
```

---

## 4. Specific MIABOS Workflow Adjustments

### Customer Service / Sales Chat Interface
- **Sender (Self):** Background `--color-primary` (`#2F64F6`), text white. Shape: `12px` rounding, with bottom-right corner `4px` (Tail).
- **Recipient:** Background `--color-bg-surface` (`#ECF4FF`), text `--color-text-primary`. Shape: `12px` rounding, with bottom-left corner `4px`.
- **Typing Indicator:** 3-dot pulse in `--color-primary`, staggered.

### Marketing Content Workspace
- **Editor Area:** Borderless expansive white `#FFFFFF` "Canvas".
- **AI Suggestion Highlight:** A `4px` left border in `--color-primary`, glowing with an ambient shadow to command focus without cluttering the canvas.

### Retail Journey / Campaign Builder
- **Nodes/Cards:** High-radius `16px` white cards suspended on the canvas via ambient shadows.
- **Flow Lines:** Curved beziers (`--color-border-ghost`) spanning across the `--color-bg-page` background.

---

## 5. Accessibility Checklist (WCAG AA Minimum)

- [ ] Ensure `--color-text-primary` against `--color-bg-page` exceeds a 4.5:1 contrast ratio.
- [ ] No component relies *solely* on `#2F64F6` blue to indicate status (always combine with icons or distinct spacing).
- [ ] Ensure the Glassmorphism blur (20px) does not hinder legibility of underlying text in highly compressed viewports. Ensure fallback `rgba` colors maintain text contrast.
- [ ] Input fields maintain a visible focus state via a 2px offset ring, not just a shadow drop.
