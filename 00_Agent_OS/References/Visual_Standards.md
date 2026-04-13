# Visual Standards — MIABOS Platform

> **Platform**: MIABOS — B2B SaaS Marketing Automation
> **Products**: MIA Smart (AI Chatbot) | MIA Spring (AI Content) | MIA Scale (AI Remarketing)
> **Style**: Data-Dense Dashboard + Swiss Modernism 2.0 + AI-Native UI
> **Target Users**: Vietnamese SME Owners & Marketing Staff
> **Generated with**: UI/UX Pro Max Design Intelligence

---

## 1. Design Philosophy

### Core Principles

| # | Principle | What It Means |
|---|-----------|---------------|
| 1 | **Professional & Trustworthy** | B2B SaaS for business owners. No playful, no gimmicky. Clean, confident, reliable. |
| 2 | **Data-Dense but Readable** | Dashboard-heavy UI optimized for information density without sacrificing clarity. |
| 3 | **Vietnamese-First** | All UI copy in Vietnamese. Typography must handle diacritics perfectly. |
| 4 | **Efficiency-Obsessed** | Users manage multiple channels, hundreds of customers. Minimize clicks, maximize information. |
| 5 | **AI-Visible** | AI capabilities are a selling point. Make them prominent, not hidden. |
| 6 | **Cross-Product Consistent** | MIA Smart, Spring, Scale share the same design language, differentiated by accent color. |
| 7 | **Accessible by Default** | WCAG AA minimum. Color is never the sole indicator. |

### Visual Identity Keywords

`professional` · `data-dense` · `dashboard` · `clean` · `trustworthy` · `blue` · `modern` · `Vietnamese` · `AI-native` · `omnichannel` · `efficient`

---

## 2. Color System

### Primary: Trust Blue (CRM Industry Standard)

| Role | Token | HEX | Usage |
|------|-------|-----|-------|
| Primary | `--color-primary` | `#2563EB` | CTAs, active nav, links |
| Primary Hover | `--color-primary-hover` | `#1D4ED8` | Hover states |
| Primary Active | `--color-primary-active` | `#1E40AF` | Active/pressed |
| Primary Light | `--color-primary-light` | `#EFF6FF` | Tint backgrounds |
| Primary Muted | `--color-primary-muted` | `#DBEAFE` | Selected rows, tabs |

### Product Accents

| Product | Color Name | HEX | When Used |
|---------|-----------|-----|-----------|
| **MIA Smart** | Chatbot Blue | `#3B82F6` | Chat UI, AI indicators, conversation screens |
| **MIA Spring** | Content Purple | `#8B5CF6` | Content editor, campaign builder |
| **MIA Scale** | Growth Teal | `#14B8A6` | Customer journey, remarketing |
| **Platform** | Neutral Slate | `#64748B` | Admin, settings, system |

### Neutrals (Slate Scale)

| Token | HEX | Usage |
|-------|-----|-------|
| `--color-bg-page` | `#F8FAFC` | Page background |
| `--color-bg-surface` | `#F1F5F9` | Sidebar, section bg |
| `--color-bg-card` | `#FFFFFF` | Cards, modals |
| `--color-text-primary` | `#0F172A` | Headings |
| `--color-text-secondary` | `#475569` | Body text |
| `--color-text-tertiary` | `#94A3B8` | Placeholder, muted |
| `--color-border` | `#E2E8F0` | Borders, dividers |

### Semantic Colors

| State | HEX | Pair With Icon |
|-------|-----|---------------|
| Success | `#059669` | ✓ Checkmark |
| Error | `#DC2626` | ✓ Alert triangle |
| Warning | `#F59E0B` | ✓ Warning circle |
| Info | `#2563EB` | ✓ Info circle |

### Color Rules

1. **Never use color as sole indicator** — always pair with icon/text (WCAG `color-not-only`)
2. **4.5:1 contrast** for normal text, 3:1 for large text and UI elements
3. **Use semantic tokens** (`--color-primary`), never raw hex in components
4. **Product accents** are for feature-area identification, not for global CTAs
5. **Destructive actions** use `--color-error` and are visually separated from primary actions

---

## 3. Typography

### Font Stack

| Purpose | Font | Fallback |
|---------|------|----------|
| Primary (Vietnamese) | **Be Vietnam Pro** | Inter, system-ui, sans-serif |
| Monospace (Data) | **JetBrains Mono** | Courier New, monospace |

### Type Scale

| Style | Size | Weight | Line Height | Letter Spacing | Usage |
|-------|------|--------|-------------|----------------|-------|
| Display | 32px | 700 | 1.2 | -0.5px | Hero metrics, dashboard titles |
| H1 | 24px | 700 | 1.3 | -0.3px | Page titles |
| H2 | 20px | 600 | 1.4 | 0 | Section headings |
| H3 | 16px | 600 | 1.5 | 0 | Card titles |
| Body | 14px | 400 | 1.6 | 0 | Standard text |
| Body Small | 13px | 400 | 1.5 | 0 | Table cells (compact only) |
| Caption | 12px | 400 | 1.5 | 0 | Timestamps, helper text |
| Label | 12px | 500 | 1.5 | 0.5px | Form labels, overlines |
| Data | 13px (Mono) | 400 | 1.4 | 0 | IDs, phone numbers, codes |
| KPI Value | 28px | 700 | 1.1 | -0.5px | Dashboard metrics |

### Typography Rules

1. Minimum body: **14px** (13px only in compact data tables)
2. Line height ≥ **1.5** for body (Vietnamese diacritics need vertical space)
3. Use `font-display: swap` to prevent invisible text during loading
4. Weight hierarchy: 700 headings, 600 subheadings, 500 labels, 400 body
5. JetBrains Mono for tabular data (phone numbers, IDs, amounts) — prevents layout shift
6. Test with Vietnamese string: "Chương trình khuyến mãi đặc biệt dành cho khách hàng thân thiết"

---

## 4. Spacing & Layout

### 4px/8px Grid

| Token | Value | Usage |
|-------|-------|-------|
| 2px | Micro gap (badge offset) |
| 4px | Icon-to-label |
| 8px | Related items |
| 12px | Compact card padding |
| 16px | Standard padding |
| 20px | Card padding |
| 24px | Between cards |
| 32px | Section breaks |
| 40px | Page spacing |

### Dashboard Grid

| Breakpoint | Columns | Gutter | Sidebar | Content Max |
|-----------|---------|--------|---------|-------------|
| ≥1440px | 12 | 24px | 240px | 1200px |
| 1024-1439px | 12 | 16px | 240px | fluid |
| 768-1023px | 8 | 16px | 64px (collapsed) | fluid |
| <768px | 4 | 16px | none (bottom tab) | fluid |

### Layout Rules

1. **Desktop-first** responsive strategy (most users on desktop)
2. Sidebar: 240px expanded → 64px collapsed → bottom tab on mobile
3. Content max-width: avoid text wider than 75ch on wide screens
4. KPI row: 4 cols → 2 cols (tablet) → stacked (mobile)
5. Tables: horizontal scroll with sticky first column on < 1024px

---

## 5. Component Standards

### Elevation

| Level | Shadow | Usage |
|-------|--------|-------|
| 0 | none | Embedded, flat |
| 1 | `0 1px 3px rgba(0,0,0,0.10)` | Resting cards |
| 2 | `0 4px 6px rgba(0,0,0,0.10)` | Hovered, raised |
| 3 | `0 10px 15px rgba(0,0,0,0.10)` | Dropdowns, popovers |
| 4 | `0 20px 48px rgba(0,0,0,0.10)` | Modals, dialogs |

### Border Radius

| Token | Value | Usage |
|-------|-------|-------|
| sm | 4px | Inputs, tags |
| md | 8px | Cards, buttons |
| lg | 12px | Modals, panels |
| xl | 16px | Sheets, dialogs |
| full | 9999px | Pills, avatars |

### Icons

- **Library**: Lucide Icons (SVG)
- **Sizes**: 16px (inline), 20px (standard), 24px (nav/dashboard)
- **Style**: Outlined, 1.5px stroke, round cap
- **Active**: Filled variant or brand color
- **NEVER**: Emoji as icons. Always SVG.

---

## 6. Interactive Patterns

### Buttons
- One primary CTA per section
- 40px height, md radius
- Loading: spinner + disabled
- Destructive: red bg, requires confirmation

### Tables (Core Component)
- Header: 44px, sticky, surface bg
- Row: 48px default, 36px compact
- Hover: primary-light bg
- Sort: arrow icons, `aria-sort`
- Empty: illustration + message + CTA
- Responsive: horizontal scroll + sticky first column

### Forms
- Visible labels (never placeholder-only)
- Error below field, not at top
- Validate on blur (not keystroke)
- Required marked with `*`
- Helper text for complex inputs
- Auto-focus first error on submit

### Loading
- Skeleton shimmer matching layout (not generic spinner)
- Show skeleton after 300ms delay
- Charts: skeleton chart (axes + shimmer)
- Buttons: spinner + disabled
- AI processing: 3-dot typing indicator

### Toasts
- Auto-dismiss 3-5s
- Bottom-right position (desktop)
- `aria-live="polite"` (never steal focus)
- Success: green icon + message
- Error: red icon + message + retry link

---

## 7. Animation Standards

| Pattern | Duration | Easing | Notes |
|---------|----------|--------|-------|
| Hover effect | 150ms | ease-out | Color, shadow |
| Page transition | 200ms | ease-out | Fade |
| Modal enter | 250ms | ease-out | Scale + fade |
| Modal exit | 180ms | ease-in | Faster than enter |
| Dropdown | 200ms | ease-out | Scale-Y from top |
| Toast enter | 300ms | spring | Slide from right |
| Skeleton pulse | 1.5s | linear, infinite | Background sweep |
| AI typing dots | 300ms stagger | ease-in-out | 3-dot bounce |

### Animation Rules

1. `prefers-reduced-motion`: disable all non-essential
2. Only animate `transform` and `opacity` (never width/height)
3. Exit animations ~70% of enter duration
4. Max 1-2 animated elements per view
5. Animations must be interruptible by user

---

## 8. MIABOS-Specific Patterns

### Chat Interface (MIA Smart)

- User bubble: right-aligned, primary bg, white text, radius 16/16/4/16
- AI bubble: left-aligned, surface bg, dark text, radius 16/16/16/4
- Typing indicator: 3-dot pulse, primary color
- Bot avatar: 32px, rounded, Smart accent border
- Quick replies: pill buttons, primary-muted bg

### Content Editor (MIA Spring)

- Toolbar: sticky, 44px, icon buttons with tooltips
- Preview: side-by-side or tab toggle
- AI suggestions: purple left border, light bg
- Status flow: Draft (gray) → Review (amber) → Approved (green) → Published (blue)

### Campaign Builder (MIA Scale)

- Journey canvas: horizontal flow, drag-drop nodes
- Triggers: circle + teal accent
- Actions: rounded rect, white
- Conditions: diamond, amber border
- Connectors: bezier curves, animated flow dots
- Channel badges: 16px platform icons

### Dashboard KPIs

- 4-column grid, responsive to 2-col then stacked
- Each: icon + label + large value (KPI typography) + trend arrow
- Sparkline: 60x20px mini chart, primary color
- Green trend = positive, red = negative

---

## 9. Anti-Patterns (NEVER Do These)

| # | Anti-Pattern | Why | Do Instead |
|---|-------------|-----|------------|
| 1 | Emoji as icons (🎨 🚀 ⚙️) | Inconsistent cross-platform, not themeable | SVG icons (Lucide) |
| 2 | Placeholder-only form labels | Accessibility violation, disappears on input | Visible `<label>` always |
| 3 | Color as sole indicator | Colorblind users can't distinguish | Add icon + text |
| 4 | Remove focus rings | Keyboard users lose navigation | Always show focus outline |
| 5 | Browser default styling | Looks unprofessional, inconsistent | Explicitly style every element |
| 6 | Gray text on gray background | Fails contrast, unreadable | Meet 4.5:1 contrast |
| 7 | English labels in UI | Product is Vietnamese-first | 100% Vietnamese copy |
| 8 | Truncate without tooltip | Users can't see full content | Tooltip or expandable |
| 9 | No loading state | Users think app is broken | Skeleton shimmer always |
| 10 | No empty state | Users don't know what to do | Illustration + CTA |
| 11 | Horizontal scroll on desktop | Poor desktop UX, data table abuse | Responsive column strategy |
| 12 | Animate width/height | Causes layout reflow, poor performance | Use transform only |
| 13 | Block UI during animation | Users can't interact | Animations must be interruptible |
| 14 | Heavy chrome around AI features | Obscures the AI benefit | Clean, minimal chrome |
| 15 | Mix filled + outlined icons | Visual inconsistency | One style per hierarchy level |

---

## 10. Accessibility Standards (WCAG AA Minimum)

### Critical (Must Have)

| Check | Standard | Test |
|-------|---------|------|
| Color contrast | 4.5:1 text, 3:1 large/UI | DevTools contrast checker |
| Focus rings | 2-4px visible on all interactive | Tab through entire page |
| Alt text | On all meaningful images/icons | Screen reader audit |
| Aria labels | On icon-only buttons | Verify in DOM |
| Keyboard nav | Tab order = visual order | Tab through page |
| Form labels | `<label>` with `for` | Inspect all forms |
| Heading hierarchy | Sequential h1→h6 | Heading outline check |

### High Priority

| Check | Standard |
|-------|---------|
| Touch targets | Min 44x44px |
| Touch spacing | Min 8px gap |
| `prefers-reduced-motion` | Disable non-essential animations |
| `aria-sort` | On sortable table headers |
| `aria-live` | On dynamic content (toasts, errors) |
| Skip link | "Skip to main content" on every page |

### Chart Accessibility

| Check | Standard |
|-------|---------|
| Legends | Always visible, near chart |
| Tooltips | Keyboard-reachable |
| Text summary | `aria-label` describing key insight |
| Pattern/texture | Supplement color for colorblind |
| Data table | Provide table alternative for screen readers |

---

## 11. Quality Gate Checklist

Before ANY design work leaves A06:

- [ ] All values use semantic tokens (no raw hex in specs)
- [ ] Every screen has all 5 states defined (loading, empty, error, populated, filtered-empty)
- [ ] Every interactive element has all states (hover, active, focus, disabled)
- [ ] Vietnamese copy is 100% complete
- [ ] Responsive behavior documented for all 3 breakpoints
- [ ] Accessibility requirements listed per feature
- [ ] Contrast ratios verified for all text/bg combinations
- [ ] No anti-patterns from Section 9
- [ ] A05 Tech Lead has cross-checked implementability
- [ ] Mockups are photorealistic (not wireframes)
