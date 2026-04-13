# Design System: [Project/Epic Name]

**Status**: Draft / In Review / Approved / Blocked / Deprecated
**Owner**: [[A06_UI_UX_Agent|A06 UI/UX Agent]]
**Co-Owner (Implementation)**: [[A05_Tech_Lead_Agent|A05 Tech Lead]]
**Last Updated By**: A06
**Last Reviewed By**: A01
**Approval Required**: Business Owner (visual direction), A05 (implementability)
**Approved By**: -
**Last Status Change**: YYYY-MM-DD
**Source of Truth**: This document
**Blocking Reason**: -
**Created by**: [[A06_UI_UX_Agent|A06 UI/UX Agent]]
**Date**: YYYY-MM-DD
**Visual Standards**: Compliant with [[Visual_Standards]]
**Design Direction**: [Approved direction name/description]
**Platform Context**: MIABOS — B2B SaaS Marketing Automation (MIA Smart / MIA Spring / MIA Scale)

---

## 0. Framework & Stack

| Layer | Technology | Version | Notes |
|-------|-----------|---------|-------|
| Backend/CMS | **Directus** | Latest | 161 collections, REST + GraphQL |
| UI Framework | **[React + Framework TBD]** | — | A05 decides framework |
| Charts | **Recharts** or **Chart.js** | Latest | Funnel, Line, Bar, Pie |
| Icons | **Lucide Icons** (SVG only, no emoji) | Latest | Outlined, 1.5px stroke |
| Font Primary | **Be Vietnam Pro** (Google Fonts) | Variable | Full Vietnamese diacritics |
| Font Fallback | **Inter** → system-ui → sans-serif | Variable | International fallback |
| Font Mono | **JetBrains Mono** | 400-500 | Data labels, code, IDs |

### Font Import

```css
@import url('https://fonts.googleapis.com/css2?family=Be+Vietnam+Pro:wght@300;400;500;600;700&family=Inter:wght@300;400;500;600;700&family=JetBrains+Mono:wght@400;500&display=swap');
```

### Framework Theme Config (A05 fills actual implementation)

```tsx
// theme/themeConfig.ts
const themeConfig = {
  colorPrimary: '#2563EB',       // Trust Blue
  colorSuccess: '#059669',       // Deal Green
  colorError: '#DC2626',         // Error Red
  colorWarning: '#F59E0B',       // Warning Amber
  fontFamily: "'Be Vietnam Pro', 'Inter', system-ui, sans-serif",
  fontFamilyMono: "'JetBrains Mono', monospace",
  borderRadius: 8,
  // ... A05 completes based on chosen framework
};
```

---

## 1. Design Tokens

### 1.1 Color System — CRM & Marketing Automation Palette

**Primary Palette** (Trust Blue — CRM industry standard)

| Token | HEX | RGB | Usage | WCAG on White |
|-------|-----|-----|-------|---------------|
| `--color-primary` | `#2563EB` | 37,99,235 | Primary actions, active nav, links | AA ✓ (4.58:1) |
| `--color-primary-hover` | `#1D4ED8` | 29,78,216 | Hover state for primary | AA ✓ |
| `--color-primary-active` | `#1E40AF` | 30,64,175 | Active/pressed state | AAA ✓ |
| `--color-primary-light` | `#EFF6FF` | 239,246,255 | Primary tint backgrounds | — |
| `--color-primary-muted` | `#DBEAFE` | 219,234,254 | Selected row, active tab bg | — |

**Secondary Palette** (Deal Green — conversion/success)

| Token | HEX | Usage |
|-------|-----|-------|
| `--color-secondary` | `#059669` | Success states, deal closed, positive metrics |
| `--color-secondary-light` | `#D1FAE5` | Success background |

**Neutral Palette**

| Token | HEX | Usage |
|-------|-----|-------|
| `--color-bg-page` | `#F8FAFC` | Page background (warm off-white) |
| `--color-bg-surface` | `#F1F5F9` | Section background, sidebar bg |
| `--color-bg-card` | `#FFFFFF` | Card surfaces, modals, dropdowns |
| `--color-text-primary` | `#0F172A` | Headings, primary text (Slate-900) |
| `--color-text-secondary` | `#475569` | Body text, descriptions (Slate-600) |
| `--color-text-tertiary` | `#94A3B8` | Placeholder, muted labels (Slate-400) |
| `--color-text-disabled` | `#CBD5E1` | Disabled text (Slate-300) |
| `--color-border` | `#E2E8F0` | Borders, dividers (Slate-200) |
| `--color-border-strong` | `#CBD5E1` | Strong borders (Slate-300) |

**Semantic Colors**

| Token | HEX | Usage | Icon Required |
|-------|-----|-------|---------------|
| `--color-success` | `#059669` | Success, positive, completed | ✓ checkmark |
| `--color-error` | `#DC2626` | Error, destructive, failed | ✓ alert |
| `--color-warning` | `#F59E0B` | Warning, attention needed | ✓ warning |
| `--color-info` | `#2563EB` | Info, in-progress | ✓ info |

**Product Accent Colors** (differentiate MIA products within MIABOS)

| Product | Accent | HEX | Usage |
|---------|--------|-----|-------|
| MIA Smart | Chatbot Blue | `#3B82F6` | Chat interfaces, AI indicators |
| MIA Spring | Content Purple | `#8B5CF6` | Content creation, campaign builder |
| MIA Scale | Growth Teal | `#14B8A6` | Remarketing, customer journey |
| Platform | Neutral Slate | `#64748B` | Admin, settings, system |

> **Rule**: Color must NEVER be the sole indicator. Always pair with icon or text label (WCAG `color-not-only`).

### 1.2 Typography — Vietnamese-First

| Element | Font | Size | Weight | Line Height | Letter Spacing | Usage |
|---------|------|------|--------|-------------|----------------|-------|
| Display | Be Vietnam Pro | 32px | 700 | 1.2 | -0.5px | Dashboard titles, hero metrics |
| H1 | Be Vietnam Pro | 24px | 700 | 1.3 | -0.3px | Page titles |
| H2 | Be Vietnam Pro | 20px | 600 | 1.4 | 0 | Section headings |
| H3 | Be Vietnam Pro | 16px | 600 | 1.5 | 0 | Card titles, subsections |
| Body | Be Vietnam Pro | 14px | 400 | 1.6 | 0 | Standard body text |
| Body Small | Be Vietnam Pro | 13px | 400 | 1.5 | 0 | Compact lists, table cells |
| Caption | Be Vietnam Pro | 12px | 400 | 1.5 | 0 | Timestamps, helper text |
| Label | Be Vietnam Pro | 12px | 500 | 1.5 | 0.5px | Form labels, overlines |
| Data | JetBrains Mono | 13px | 400 | 1.4 | 0 | IDs, codes, metrics, phone numbers |
| KPI Value | Be Vietnam Pro | 28px | 700 | 1.1 | -0.5px | Dashboard KPI numbers |

**Vietnamese Typography Rules**:
- Be Vietnam Pro has native Vietnamese diacritics — no fallback rendering issues
- Minimum body font: 14px (13px allowed in compact data tables only)
- Line height ≥ 1.5 for body text (Vietnamese diacritics need vertical clearance)
- Test with long Vietnamese strings: "Chương trình khuyến mãi đặc biệt dành cho khách hàng thân thiết"
- Use `font-display: swap` to avoid FOIT

### 1.3 Spacing — 4px/8px Grid System

| Token | Value | Usage |
|-------|-------|-------|
| `--space-0.5` | 2px | Micro gaps (icon badge offset) |
| `--space-1` | 4px | Icon-to-label, tight inline |
| `--space-2` | 8px | Related items, input inner padding |
| `--space-3` | 12px | Card inner padding (compact), list item gap |
| `--space-4` | 16px | Standard padding, screen margins mobile |
| `--space-5` | 20px | Card padding standard |
| `--space-6` | 24px | Between cards, between form fields |
| `--space-8` | 32px | Section breaks |
| `--space-10` | 40px | Page-level top/bottom spacing |
| `--space-12` | 48px | Major section dividers |

### 1.4 Border Radius

| Token | Value | Usage |
|-------|-------|-------|
| `--radius-sm` | 4px | Inputs, tags, small elements |
| `--radius-md` | 8px | Cards, containers, buttons |
| `--radius-lg` | 12px | Modals, large cards, panels |
| `--radius-xl` | 16px | Sheets, dialogs, feature panels |
| `--radius-full` | 9999px | Pills, avatars, FABs |

### 1.5 Elevation (Shadow System)

| Level | Value | Usage |
|-------|-------|-------|
| `--shadow-0` | none | Flat elements, embedded |
| `--shadow-1` | `0 1px 2px rgba(0,0,0,0.06), 0 1px 3px rgba(0,0,0,0.10)` | Resting cards |
| `--shadow-2` | `0 2px 4px rgba(0,0,0,0.06), 0 4px 6px rgba(0,0,0,0.10)` | Hovered cards, raised elements |
| `--shadow-3` | `0 4px 6px rgba(0,0,0,0.05), 0 10px 15px rgba(0,0,0,0.10)` | Dropdowns, popovers |
| `--shadow-4` | `0 10px 25px rgba(0,0,0,0.10), 0 20px 48px rgba(0,0,0,0.10)` | Modals, dialogs |

### 1.6 Z-Index Scale

| Token | Value | Usage |
|-------|-------|-------|
| `--z-base` | 0 | Normal flow |
| `--z-dropdown` | 10 | Dropdowns, autocomplete |
| `--z-sticky` | 20 | Sticky headers, fixed elements |
| `--z-drawer` | 30 | Side drawers, sheets |
| `--z-modal` | 40 | Modals, dialogs |
| `--z-popover` | 50 | Popovers, tooltips |
| `--z-toast` | 100 | Toast notifications |
| `--z-overlay` | 1000 | Full-screen overlays |

### 1.7 Icons

| Property | Value |
|----------|-------|
| Library | **Lucide Icons** (SVG) |
| Standard size | 20px |
| Dashboard/Nav size | 24px |
| Inline size | 16px |
| Style | Outlined, 1.5px stroke, round cap/join |
| Active state | Filled variant or brand color |
| Color | Inherit (monochromatic) |
| **Anti-pattern** | **NEVER use emoji as icons** |

---

## 2. Component Library

### 2.1 Interactive States (Apply to ALL components)

| State | Visual Change | Transition |
|-------|--------------|------------|
| Default | Base appearance | — |
| Hover | Background +5% darker, shadow up 1 level | 150ms ease-out |
| Active/Pressed | Background +10% darker, shadow drops to 0 | 100ms ease-in |
| Focus | 2px solid `--color-primary` ring, 2px offset | Instant |
| Disabled | 40% opacity, `cursor: not-allowed`, no interaction | — |
| Loading | Skeleton shimmer for content, spinner for buttons | 1.5s pulse |
| Error | `--color-error` border + error message below field | 200ms |
| Empty | Illustration + helpful message + CTA button | — |

> **Rule**: Focus rings must NEVER be removed (accessibility `focus-states`). Use `outline` not `border` for focus.

### 2.2 Component Specifications

#### Buttons

| Variant | Height | Radius | Padding | Shadow | Spec |
|---------|--------|--------|---------|--------|------|
| Primary | 40px | md | 12px 24px | 1→2 hover | `--color-primary` bg, white text |
| Secondary | 40px | md | 12px 24px | 0 | White bg, primary border+text |
| Ghost | 40px | md | 12px 24px | 0 | Transparent bg, primary text |
| Destructive | 40px | md | 12px 24px | 0 | `--color-error` bg, white text |
| Icon Button | 36px | md | 8px | 0 | Icon only, tooltip required |

**Button Rules**:
- One primary CTA per screen section
- Loading state: spinner + disabled
- Destructive actions require confirmation dialog
- Touch target: min 44x44px (extend hit area with padding if visual is smaller)

#### Data Table (Dashboard-Critical Component)

| Property | Value | Notes |
|----------|-------|-------|
| Header height | 44px | Sticky, `--color-bg-surface` bg |
| Row height | 48px (default) / 36px (compact) | Compact for data-dense views |
| Row hover | `--color-primary-light` bg | 150ms transition |
| Row selected | `--color-primary-muted` bg | Checkbox column |
| Cell padding | 12px horizontal | |
| Border | Bottom border `--color-border` | No vertical borders |
| Sort indicator | Lucide arrow-up/arrow-down icon | `aria-sort` attribute |
| Empty state | Centered illustration + "Chưa có dữ liệu" + CTA | |
| Pagination | Bottom right, 10/20/50 per page | |
| Column widths | Auto with min-width, user-resizable | |
| Responsive | Horizontal scroll with sticky first column on < 1024px | `overflow-x: auto` wrapper |

**Table Anti-Patterns (NEVER)**:
- Horizontal scroll on desktop
- Truncating important data without tooltip
- No loading skeleton (use row-shaped skeleton blocks)
- Gray text on gray background (must meet 4.5:1 contrast)

#### Forms

| Component | Height | Radius | Padding | Spec |
|-----------|--------|--------|---------|------|
| Text Input | 40px | sm | 8px 12px | 1px `--color-border`, primary on focus |
| Textarea | auto (min 80px) | sm | 8px 12px | Resizable vertical |
| Select | 40px | sm | 8px 12px | Dropdown arrow icon |
| Checkbox | 20px | sm | — | Primary fill when checked |
| Radio | 20px | full | — | Primary dot when selected |
| Switch/Toggle | 24px height | full | — | Primary bg when on |
| Date Picker | 40px | sm | 8px 12px | Calendar popover |

**Form Rules** (UI/UX Pro Max compliance):
- Visible label per input — NEVER placeholder-only (`input-labels`)
- Error message below the related field (`error-placement`)
- Required fields marked with `*` (`required-indicators`)
- Inline validation on blur, not on keystroke (`inline-validation`)
- Correct `input type` for mobile keyboards: `tel`, `email`, `number` (`input-type-keyboard`)
- Auto-focus first invalid field on submit error (`focus-management`)
- Helper text below complex inputs (`input-helper-text`)
- Progressive disclosure for advanced options (`progressive-disclosure`)
- Auto-save for long forms (`form-autosave`)

#### Cards

| Variant | Radius | Padding | Shadow | Usage |
|---------|--------|---------|--------|-------|
| Standard | md | 20px | 1 | Content containers |
| KPI Card | md | 16px | 1 | Dashboard metrics (value + label + trend) |
| Compact | md | 12px | 0, border only | List items, inline cards |
| Feature Card | lg | 24px | 2 | Feature highlights, onboarding |

#### Navigation

| Component | Spec | Notes |
|-----------|------|-------|
| Sidebar (Desktop) | 240px width, collapsible to 64px (icons only) | Sticky, full height |
| Top Bar | 56px height, sticky | Logo + search + user menu |
| Tab Bar | 48px height | Max 5 items with icon + label |
| Breadcrumbs | 16px text, `/` separator | For 3+ level deep hierarchies |

#### Overlays

| Component | Radius | Padding | Shadow | Backdrop | Notes |
|-----------|--------|---------|--------|----------|-------|
| Modal/Dialog | lg | 24px | 4 | `rgba(0,0,0,0.5)` | Max 560px width, centered |
| Drawer | 0 (left/right edge) | 24px | 4 | `rgba(0,0,0,0.3)` | 320px width |
| Toast | md | 12px 16px | 3 | none | Auto-dismiss 3-5s, bottom-right |
| Tooltip | sm | 8px 12px | 3 | none | Dark bg, white text, max 240px |
| Popover | md | 16px | 3 | none | Triggered by click, dismissed by outside click |

**Overlay Rules**:
- Toast must not steal focus — use `aria-live="polite"` (`toast-accessibility`)
- Confirm before dismissing modal with unsaved changes (`sheet-dismiss-confirm`)
- Modals must have clear close button (`modal-escape`)

### 2.3 MIABOS-Specific Components

#### Chat Interface (MIA Smart)

| Element | Spec |
|---------|------|
| Chat Bubble (User) | Right-aligned, `--color-primary` bg, white text, radius: 16px 16px 4px 16px |
| Chat Bubble (AI Bot) | Left-aligned, `--color-bg-surface` bg, primary text, radius: 16px 16px 16px 4px |
| AI Typing Indicator | 3-dot pulse animation, `--color-primary`, 300ms stagger |
| Bot Avatar | 32px, rounded-full, MIA Smart accent color border |
| Input Bar | Bottom fixed, 48px height, attach button + text input + send button |
| Quick Reply | Pill buttons, `--color-primary-muted` bg, primary text |

#### Content Editor (MIA Spring)

| Element | Spec |
|---------|------|
| Editor Toolbar | Sticky top, 44px height, icon buttons with tooltips |
| Content Preview | Side-by-side or tab toggle (Edit / Preview) |
| AI Suggestion Card | `--color-spring-accent` left border, light purple bg |
| Status Badge | Draft (gray) → Pending Review (amber) → Approved (green) → Published (blue) |
| SEO Score | Progress ring, color-coded (red < 50 < amber < 80 < green) |

#### Campaign Builder (MIA Scale)

| Element | Spec |
|---------|------|
| Journey Canvas | Horizontal flow diagram, drag-and-drop nodes |
| Node (Trigger) | Circle, `--color-scale-accent`, icon center |
| Node (Action) | Rounded rect, white bg, action icon + label |
| Node (Condition) | Diamond shape, amber border, condition text |
| Connector Lines | Curved bezier, `--color-border-strong`, animated flow dots |
| Channel Icons | Small (16px) channel logos: Facebook, Zalo, WhatsApp, SMS, Email |

#### Dashboard KPI Row

| Element | Spec |
|---------|------|
| KPI Card | 4-column grid, each: icon + label + value + trend |
| Value | KPI Value typography (28px, 700, Be Vietnam Pro) |
| Trend | Arrow icon + percentage, green (up) / red (down) |
| Sparkline | Mini line chart (60x20px), no axis, primary color |

### 2.4 Component Tree (MIABOS Dashboard Layout)

```
AppShell
├── TopBar (56px, sticky)
│   ├── Logo (MIA Solution)
│   ├── ProductSwitcher (Smart / Spring / Scale)
│   ├── GlobalSearch (expandable)
│   ├── NotificationBell (badge count)
│   └── UserMenu (Avatar + Company + Dropdown)
├── Sidebar (240px, collapsible to 64px)
│   ├── Navigation Groups
│   │   ├── CRM (Customers, Conversations, Appointments, Orders)
│   │   ├── AI (Rules, Knowledge, Training)
│   │   ├── Content (Campaigns, Content, Tone)
│   │   ├── Remarketing (Journeys, Reminders, Promotions)
│   │   ├── Products (Catalog, Categories, Attributes)
│   │   ├── Channels (Omni-channels, Post Management)
│   │   └── Settings (Company, Users, Integrations)
│   └── CollapseTrigger
└── MainContent
    ├── PageHeader (title + breadcrumb + actions)
    ├── FilterBar (search + filters + sort + view toggle)
    └── ContentArea
        ├── KPIRow (4-column metrics)
        ├── Charts (Recharts/Chart.js, responsive)
        ├── DataTable (sortable, filterable, paginated)
        ├── CardGrid (Bento box layout for overview pages)
        ├── EmptyState (illustration + message + CTA)
        └── LoadingState (skeleton shimmer matching layout)
```

---

## 3. Screen Layouts

### Screen: [Name]
**Feature ID**: F-XX-XXX
**Purpose**: [What the user does here]
**Mockup**: `Design/Mockups/[filename]`
**Product**: [SMART / SPRING / SCALE / PLATFORM]

**Layout (ASCII wireframe):**
```
┌─────────────────────────────────────────────┐
│ TopBar [56px]                                │
├──────────┬──────────────────────────────────┤
│ Sidebar  │ PageHeader                        │
│ [240px]  │ ┌──────────────────────────────┐ │
│          │ │ FilterBar                     │ │
│          │ ├──────────────────────────────┤ │
│          │ │ KPI Row (4 cards)            │ │
│          │ ├──────────────────────────────┤ │
│          │ │ Main Content Area            │ │
│          │ │ (Table / Cards / Chart)      │ │
│          │ └──────────────────────────────┘ │
└──────────┴──────────────────────────────────┘
```

**States (ALL must be defined)**:
| State | Description |
|-------|-------------|
| Loading | Skeleton blocks matching layout shape, 1.5s shimmer pulse |
| Empty | Centered illustration + "Chưa có dữ liệu" + primary CTA |
| Error | Error message card with retry button |
| Populated | Normal data display |
| Filtered (no results) | "Không tìm thấy kết quả" + clear filter suggestion |

---

## 4. Responsive Strategy (Desktop-First)

| Breakpoint | Width | Layout | Navigation | Notes |
|-----------|-------|--------|------------|-------|
| Desktop XL | ≥ 1440px | Full sidebar + 3-col content | Sidebar expanded | Ideal dashboard view |
| Desktop | 1024-1439px | Full sidebar + 2-col content | Sidebar expanded | Standard |
| Tablet | 768-1023px | Collapsed sidebar + 2-col | Sidebar collapsed (icons) | Hover to expand |
| Mobile | < 768px | Single column, full-width | Bottom tab bar (5 max) | Hamburger for secondary nav |

**Responsive Rules**:
- Tables: horizontal scroll with sticky first column on < 1024px
- KPI Row: 4-col → 2-col on tablet → stack on mobile
- Charts: simplify (fewer data points, larger touch targets) on mobile
- Sidebar: 240px → 64px (icons only) → bottom tab bar
- Content measure: max 75ch for readability on wide screens

---

## 5. Animation & Transitions

| Context | Duration | Easing | Notes |
|---------|----------|--------|-------|
| Hover effects | 150ms | ease-out | Color, shadow, scale(1.02) |
| Page transitions | 200ms | ease-out | Fade or slide |
| Modal enter | 250ms | ease-out | Scale(0.95→1) + fade |
| Modal exit | 180ms | ease-in | Scale(1→0.95) + fade (exit faster) |
| Dropdown open | 200ms | ease-out | Scale-Y from top |
| Toast enter | 300ms | spring | Slide from right |
| Toast exit | 200ms | ease-in | Slide to right |
| Skeleton shimmer | 1.5s | linear, infinite | Background gradient sweep |
| AI typing dots | 300ms each | ease-in-out, staggered | 3-dot bounce sequence |

**Animation Rules** (UI/UX Pro Max compliance):
- `prefers-reduced-motion`: disable all non-essential animations
- Animations must be interruptible — user tap cancels immediately
- Never block user input during animation
- Max 1-2 animated elements per view (avoid overwhelming)
- Use `transform` and `opacity` only (never animate `width`/`height`/`top`/`left`)

---

## 6. Loading Patterns

| Context | Pattern | Duration Threshold |
|---------|---------|-------------------|
| Page load | Full skeleton of expected layout | Immediate |
| Data fetch | Skeleton shimmer blocks matching shape | > 300ms show skeleton |
| Action button | Spinner inside button + disabled | Immediate |
| Chart loading | Skeleton chart placeholder (axes + shimmer) | > 300ms |
| Image loading | Gray placeholder → fade-in on load | Immediate placeholder |
| AI processing | Typing indicator (3-dot) + "Đang phân tích..." | Immediate |
| File upload | Progress bar (determinate) + file name | Immediate |

---

## 7. Dark Mode Considerations

> Dark mode is **optional** for MIABOS v1. If implemented later:

| Token | Light | Dark |
|-------|-------|------|
| `--color-bg-page` | `#F8FAFC` | `#0F172A` |
| `--color-bg-surface` | `#F1F5F9` | `#1E293B` |
| `--color-bg-card` | `#FFFFFF` | `#334155` |
| `--color-text-primary` | `#0F172A` | `#F1F5F9` |
| `--color-text-secondary` | `#475569` | `#94A3B8` |
| `--color-border` | `#E2E8F0` | `#475569` |

- Use desaturated/lighter tonal variants, not inverted colors
- Test contrast independently for dark mode
- Maintain AA contrast minimum (4.5:1 text, 3:1 UI elements)

---

## 8. Charts & Data Visualization

### Recommended Chart Types (MIABOS)

| Data Need | Chart Type | Library | Example |
|-----------|-----------|---------|---------|
| KPI trend over time | Line Chart | Recharts | Revenue, active users |
| Category comparison | Bar Chart (vertical) | Recharts | Channel performance, product metrics |
| Conversion funnel | Funnel Chart | Custom SVG / D3.js | Lead → Appointment → Order → Repeat |
| Proportion/share | Donut Chart (max 5 segments) | Recharts | Channel distribution, customer segments |
| Multi-channel flow | Sankey Diagram | D3.js | Customer journey across channels |
| Real-time metrics | Stat + Sparkline | Recharts | Active conversations, live metrics |

### Chart Design Rules

- Legends always visible, positioned near chart
- Tooltips on hover (desktop) / tap (mobile) showing exact values
- Use `--color-primary`, `--color-secondary`, `--color-info`, `--color-warning` for series
- Empty data state: "Chưa có dữ liệu" message + guidance
- Tabular (number) font for axis labels: JetBrains Mono
- Grid lines: `--color-border` (subtle, don't compete with data)
- Animate on scroll entry (respect `prefers-reduced-motion`)
- Provide CSV export for data-heavy dashboards
- Max 5 categories for pie/donut (use bar chart for more)

---

## 9. Accessibility Checklist (WCAG AA Minimum)

### Priority 1: CRITICAL
- [ ] Color contrast: 4.5:1 for normal text, 3:1 for large text and UI elements
- [ ] Focus rings: 2-4px visible outline on all interactive elements
- [ ] Alt text: descriptive `alt` on meaningful images/icons
- [ ] `aria-label` on icon-only buttons
- [ ] Keyboard nav: Tab order matches visual order
- [ ] Form labels: `<label>` with `for` attribute (never placeholder-only)
- [ ] Color not sole indicator: always pair with icon/text
- [ ] Skip to main content link
- [ ] Heading hierarchy: sequential h1→h6, no level skip

### Priority 2: HIGH
- [ ] Touch targets: min 44x44px interactive area
- [ ] 8px+ spacing between touch targets
- [ ] `prefers-reduced-motion` respected
- [ ] Dynamic Type / font scaling supported
- [ ] `aria-sort` on sortable table headers
- [ ] `aria-live` for dynamic content (toasts, errors)
- [ ] `role="alert"` for form errors

### Priority 3: MEDIUM
- [ ] Chart tooltips keyboard-reachable
- [ ] Chart screen-reader summary text
- [ ] Password show/hide toggle
- [ ] Auto-complete support on inputs

---

## 10. Cross-Check (Before Handoff to Build)

### A06 UI/UX Owner Checklist
- [ ] All design tokens defined and consistent
- [ ] Component specifications cover all screen types
- [ ] All interactive states defined (hover, active, focus, disabled, loading, error, empty)
- [ ] Vietnamese text renders correctly with Be Vietnam Pro
- [ ] Mockups exist for all screens (photorealistic, not wireframes)
- [ ] Responsive behavior documented
- [ ] WCAG AA compliance verified
- [ ] No Anti-Patterns from [[Visual_Standards]]

### A05 Tech Lead Implementation Checklist
- [ ] Framework theme config is complete and implementable
- [ ] Component mapping to framework components is clear
- [ ] Token values are CSS-variable-ready
- [ ] Responsive breakpoints align with framework grid
- [ ] Animation durations and easings are practical
- [ ] Chart library selections are compatible
- [ ] Font loading strategy defined (`font-display: swap`)
- [ ] Z-index scale doesn't conflict with framework defaults

### Combined Sign-Off
- [ ] A06 visual intent confirmed
- [ ] A05 technical implementability confirmed
- [ ] PM gate passed
