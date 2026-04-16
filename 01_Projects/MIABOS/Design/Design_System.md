# Design System: Giay BQ Portal — Aura Minimalist

**Status**: Approved
**Owner**: [[A06_UI_UX_Agent|A06 UI/UX Agent]]
**Co-Owner (Implementation)**: [[A05_Tech_Lead_Agent|A05 Tech Lead]]
**Last Updated By**: A06
**Last Reviewed By**: A01
**Approval Required**: Business Owner (visual direction), A05 (implementability)
**Approved By**: Business Owner — 2026-04-15
**Last Status Change**: 2026-04-15
**Source of Truth**: This document
**Blocking Reason**: -
**Visual Standards**: Compliant with [[Visual_Standards|00_Agent_OS/References/Visual_Standards.md]]
**Design Direction**: Aura Minimalist (The Editorial Dialogue) — inherited from MIABOS platform
**Platform Context**: Giay BQ Internal Portal — MIA Smart (AI Chatbot) Phase 1
**Forked From**: `01_Projects/MIABOS/Design/Aura_Minimalist_Design_System.md`

> **Note for AI agents**: Visual_Standards.md is a MIABOS platform-level reference. This file is the canonical Design System for Giay_BQ. Do NOT import conflicting tokens from Visual_Standards into this project. If there is a conflict between this file and Visual_Standards, this file wins.

---

## 0. Framework & Stack

| Layer | Technology | Version | Notes |
|-------|-----------|---------|-------|
| Frontend | **React** | 18+ | Greenfield — no legacy codebase |
| UI Component Library | **shadcn/ui** | Latest | Headless, Tailwind-native, Aura-compatible |
| CSS Framework | **Tailwind CSS** | v3+ | Primary styling system |
| Backend/CMS | **Directus** | Latest | REST + GraphQL |
| Charts | **Recharts** | Latest | Line, Bar, Pie, Funnel |
| Icons | **Lucide React** (SVG only) | Latest | Outlined, 1.5px stroke — no emoji |
| Font Primary | **Be Vietnam Pro** (Google Fonts) | Variable | Full Vietnamese diacritics |
| Font Fallback | **Inter** → system-ui → sans-serif | Variable | International fallback |
| Font Mono | **JetBrains Mono** | 400–500 | Data labels, IDs, code |

### Font Import

```css
@import url('https://fonts.googleapis.com/css2?family=Be+Vietnam+Pro:wght@300;400;500;600;700&family=Inter:wght@300;400;500;600;700&family=JetBrains+Mono:wght@400;500&display=swap');
```

### Tailwind Theme Config (`tailwind.config.ts`)

```ts
import type { Config } from 'tailwindcss'

const config: Config = {
  content: ['./src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ["'Be Vietnam Pro'", "'Inter'", 'system-ui', 'sans-serif'],
        mono: ["'JetBrains Mono'", 'monospace'],
      },
      colors: {
        // Primary — MIA Brand Blue
        primary: {
          DEFAULT:  '#2F64F6',
          hover:    '#2552CC',
          active:   '#1A3B99',
          light:    '#ECF2FE',
          muted:    '#D3E1FC',
        },
        // Neutral — Cool Slate Foundation
        bg: {
          page:    '#F6F9FF',
          surface: '#ECF4FF',
          card:    '#FFFFFF',
        },
        text: {
          primary:   '#013652',
          secondary: '#3A6381',
          tertiary:  '#8EB6D9',
        },
        border: {
          ghost: '#8EB6D9',
        },
        // Semantic
        success: '#22C55E',
        error:   '#E11D48',
        warning: '#F59E0B',
      },
      borderRadius: {
        pill: '9999px',
      },
      boxShadow: {
        ambient: '0 12px 24px rgba(1, 54, 82, 0.04)',
        glass:   '0 4px 24px rgba(1, 54, 82, 0.06)',
      },
    },
  },
  plugins: [],
}
export default config
```

### shadcn/ui `components.json`

```json
{
  "$schema": "https://ui.shadcn.com/schema.json",
  "style": "default",
  "rsc": false,
  "tsx": true,
  "tailwind": {
    "config": "tailwind.config.ts",
    "css": "src/index.css",
    "baseColor": "slate",
    "cssVariables": true
  },
  "aliases": {
    "components": "@/components",
    "utils": "@/lib/utils"
  }
}
```

### CSS Variables (`src/index.css`)

```css
@layer base {
  :root {
    /* Primary */
    --color-primary:        47 100 246;   /* #2F64F6 */
    --color-primary-hover:  37 82 204;    /* #2552CC */
    --color-primary-active: 26 59 153;    /* #1A3B99 */
    --color-primary-light:  236 242 254;  /* #ECF2FE */
    --color-primary-muted:  211 225 252;  /* #D3E1FC */

    /* Background */
    --color-bg-page:    246 249 255;  /* #F6F9FF */
    --color-bg-surface: 236 244 255;  /* #ECF4FF */
    --color-bg-card:    255 255 255;  /* #FFFFFF */

    /* Text */
    --color-text-primary:   1 54 82;      /* #013652 */
    --color-text-secondary: 58 99 129;    /* #3A6381 */
    --color-text-tertiary:  142 182 217;  /* #8EB6D9 */

    /* Ghost border */
    --color-border-ghost: 142 182 217;  /* #8EB6D9 — use at 10–20% opacity */

    /* Semantic */
    --color-success: 34 197 94;   /* #22C55E */
    --color-error:   225 29 72;   /* #E11D48 */
    --color-warning: 245 158 11;  /* #F59E0B */
  }
}
```

---

## 1. Design Tokens

### 1.1 Color System — Cool Slate & MIA Brand Blue

**Primary Palette**

| Token | HEX | Usage |
|-------|-----|-------|
| `--color-primary` | `#2F64F6` | Primary actions, active nav, CTAs |
| `--color-primary-hover` | `#2552CC` | Hover state |
| `--color-primary-active` | `#1A3B99` | Active/pressed state |
| `--color-primary-light` | `#ECF2FE` | Tint backgrounds, hover rows |
| `--color-primary-muted` | `#D3E1FC` | Selected row, active tab bg |

**Neutral Palette**

| Token | HEX | Usage |
|-------|-----|-------|
| `--color-bg-page` | `#F6F9FF` | Global page background |
| `--color-bg-surface` | `#ECF4FF` | Sidebar, section backgrounds |
| `--color-bg-card` | `#FFFFFF` | Cards, modals, dropdowns |
| `--color-text-primary` | `#013652` | Headings — NO pure black |
| `--color-text-secondary` | `#3A6381` | Body text, descriptions |
| `--color-text-tertiary` | `#8EB6D9` | Placeholder, ghost hints |
| `--color-border-ghost` | `#8EB6D9` | Ghost borders at 10–20% opacity only |

**Semantic Colors**

| Token | HEX | Icon Required |
|-------|-----|---------------|
| `--color-success` | `#22C55E` | ✓ checkmark |
| `--color-error` | `#E11D48` | ✓ alert triangle |
| `--color-warning` | `#F59E0B` | ✓ warning circle |

**Module Accent Mapping (Giay BQ Phase 1)**

| Module | MIA Product | Accent | Notes |
|--------|-------------|--------|-------|
| All Phase 1 modules | MIA Smart | `#2F64F6` Brand Blue | Only MIA Smart in scope |
| Future: Content/Campaign | MIA Spring | `#8B5CF6` Purple | Not in Phase 1 |
| Future: Remarketing | MIA Scale | `#14B8A6` Teal | Not in Phase 1 |

---

### 1.2 Typography

| Element | Font | Size | Weight | Line Height | Usage |
|---------|------|------|--------|-------------|-------|
| Display | Be Vietnam Pro | 36px | 700 | 1.2 | Dashboard hero, greetings |
| H1 | Be Vietnam Pro | 24px | 700 | 1.3 | Page titles |
| H2 | Be Vietnam Pro | 20px | 600 | 1.4 | Section headings |
| H3 | Be Vietnam Pro | 16px | 600 | 1.5 | Card titles, subsections |
| Body | Be Vietnam Pro | 14px | 400 | 1.6 | Standard body text |
| Label | Be Vietnam Pro | 11px | 500 | 1.5 | Metadata, timestamps in `#3A6381` |
| Mono | JetBrains Mono | 13px | 400 | 1.5 | IDs, data codes, order numbers |

**The "Intentional Gap" Rule**: Khi đặt Label ngay trên H2, đây là intentional contrast — không được thêm element giữa chúng.

---

### 1.3 Spacing Scale

| Token | Value | Tailwind Class | Usage |
|-------|-------|----------------|-------|
| `--space-xs` | 4px | `p-1` | Tight icon padding |
| `--space-sm` | 8px | `p-2` | Small gaps, badge padding |
| `--space-md` | 16px | `p-4` | Default component padding |
| `--space-lg` | 24px | `p-6` | Card padding, section gaps |
| `--space-xl` | 32px | `p-8` | Page section top margin |
| `--space-2xl` | 48px | `p-12` | Large section separators |

**Asymmetric Padding Rule**: Container top padding `32px`, bottom `20px` — tạo "editorial lift".

---

### 1.4 Elevation & Depth

Không dùng drop shadow cứng. Chỉ dùng Ambient Depth.

| Level | CSS Value | Tailwind | Usage |
|-------|-----------|----------|-------|
| Flat | `none` | `shadow-none` | Inline elements |
| Ambient | `0 12px 24px rgba(1,54,82,0.04)` | `shadow-ambient` | Cards, panels |
| Glass | `backdrop-filter: blur(20px); bg: rgba(246,249,255,0.8)` | custom | Modals, floating dock |

---

## 2. Component Library

### 2.1 The "No-Line" Rule (Absolute)

**CẤM** dùng `border: 1px solid` hoặc `<hr>` để chia layout. Thay thế bằng:
1. **Background color shift**: Sidebar `#ECF4FF` kề Main `#F6F9FF` — không cần border
2. **Spacing**: Double margin tạo breathing room
3. **Ghost border** (exception): `border: 1px solid rgba(142,182,217,0.15)` — chỉ dùng khi absolutely necessary (e.g., phân biệt 2 vùng cùng màu nền)

---

### 2.2 Buttons

| Variant | Tailwind Classes | Notes |
|---------|-----------------|-------|
| Primary | `rounded-pill bg-gradient-to-br from-primary to-primary-hover text-white px-6 py-3 font-medium` | Pill shape, gradient |
| Secondary | `rounded-pill bg-primary-light text-primary px-6 py-3 font-medium` | Tint bg |
| Ghost | `rounded-pill bg-transparent text-primary px-6 py-3 font-medium` | No bg |
| Destructive | `rounded-pill bg-error text-white px-6 py-3 font-medium` | Error actions only |

```tsx
// Tailwind class pattern
const buttonVariants = {
  primary:     'rounded-full bg-gradient-to-br from-[#2F64F6] to-[#2552CC] text-white px-6 py-3 text-sm font-medium hover:opacity-90 transition-opacity',
  secondary:   'rounded-full bg-[#ECF2FE] text-[#2F64F6] px-6 py-3 text-sm font-medium hover:bg-[#D3E1FC] transition-colors',
  ghost:       'rounded-full bg-transparent text-[#2F64F6] px-6 py-3 text-sm font-medium hover:bg-[#ECF2FE] transition-colors',
  destructive: 'rounded-full bg-[#E11D48] text-white px-6 py-3 text-sm font-medium hover:opacity-90 transition-opacity',
}
```

---

### 2.3 Cards

```tsx
// Standard card
<div className="bg-white rounded-2xl shadow-ambient p-6">
  {/* content */}
</div>

// Glass card (modals, overlays)
<div className="bg-white/80 backdrop-blur-xl rounded-2xl shadow-glass p-6">
  {/* content */}
</div>
```

---

### 2.4 Data Tables

- **Không có vertical dividers**
- Row hover: `bg-[#ECF2FE]` (primary-light)
- Row selected: `bg-[#D3E1FC]` (primary-muted)
- Horizontal separation: alternating `bg-white` / `bg-[#F6F9FF]`
- Avatar cells: `rounded-full` (9999px), grouped avatars overlap với 2px `ring-2 ring-white`

---

### 2.5 Form Inputs

```tsx
// Standard input — no hard border
<input className="
  w-full bg-white rounded-xl px-4 py-3
  shadow-ambient outline-none
  focus:ring-2 focus:ring-[#2F64F6]/30 focus:ring-offset-0
  text-[#013652] placeholder:text-[#8EB6D9]
  text-sm
" />
```

---

### 2.6 Sidebar & App Shell

```
AppShell
├── TopBar (sticky, glassmorphism)
│   ├── bg: rgba(246,249,255,0.85) + backdrop-blur-xl
│   ├── Logo | Search | UserMenu
│   └── height: 64px
├── Sidebar
│   ├── bg: #ECF4FF
│   ├── width: 240px (expanded) / 64px (collapsed)
│   ├── NO border-right — color difference alone separates it
│   └── Active nav item: bg #D3E1FC, text #2F64F6, icon #2F64F6
└── MainContent
    ├── bg: #F6F9FF
    ├── padding: 32px 32px 20px 32px (asymmetric — top heavier)
    └── max-width: 1440px centered
```

---

### 2.7 Chat Interface (MIA Smart — Primary Module for Giay BQ)

- **Sender (Staff/AI) bubble**: bg `#2F64F6`, text white, `rounded-[12px] rounded-br-[4px]`
- **Recipient (Customer) bubble**: bg `#ECF4FF`, text `#013652`, `rounded-[12px] rounded-bl-[4px]`
- **Typing indicator**: 3-dot pulse animation in `#2F64F6`, staggered 200ms
- **Floating Dock** (message input): centered bottom, 24px from edge, glassmorphism style

```tsx
// Floating Dock
<div className="
  fixed bottom-6 left-1/2 -translate-x-1/2
  w-[calc(100%-3rem)] max-w-2xl
  bg-white/80 backdrop-blur-xl
  rounded-full shadow-glass
  px-4 py-3 flex items-center gap-3
">
  <input className="flex-1 bg-transparent outline-none text-[#013652] placeholder:text-[#8EB6D9] text-sm" />
  <button className="rounded-full bg-[#2F64F6] p-2 text-white">
    <SendIcon size={16} />
  </button>
</div>
```

---

## 3. Screen Layouts

### 3.1 Standard Page Layout

```
┌─────────────────────────────────────────────┐
│ TopBar (64px, glassmorphism, sticky)        │
├──────────────┬──────────────────────────────┤
│              │ PageHeader                   │
│   Sidebar    │   Label (11px, #3A6381)      │
│   (240px)    │   H1 (24px, #013652)         │  ← Intentional Gap Rule
│              │                              │
│  bg:#ECF4FF  │ ContentArea (bg: #F6F9FF)    │
│              │   ┌─────────┐ ┌─────────┐   │
│              │   │  Card   │ │  Card   │   │
│              │   │(#FFFFFF)│ │(#FFFFFF)│   │
│              │   └─────────┘ └─────────┘   │
│              │                              │
└──────────────┴──────────────────────────────┘
```

### 3.2 Responsive Breakpoints

| Breakpoint | Width | Sidebar | Notes |
|------------|-------|---------|-------|
| Mobile | < 768px | Hidden (drawer) | Stack layout |
| Tablet | 768–1024px | Collapsed (64px icons) | Icon-only nav |
| Desktop | 1024–1440px | Expanded (240px) | Standard |
| Wide | > 1440px | Expanded + content max-width 1440px | Centered |

---

## 4. Accessibility Checklist (WCAG AA Minimum)

- [ ] `#013652` text on `#F6F9FF` background — verify ≥ 4.5:1 contrast
- [ ] `#013652` text on `#FFFFFF` card — verify ≥ 4.5:1 contrast
- [ ] `#FFFFFF` text on `#2F64F6` button — verify ≥ 4.5:1 contrast
- [ ] No component relies solely on color to indicate status — always pair with icon
- [ ] Glassmorphism blur (20px) — ensure text readable on all backgrounds, provide rgba fallback
- [ ] Input focus state uses 2px ring offset, not shadow only
- [ ] All interactive elements have visible focus indicator

---

## 5. Anti-Patterns (Forbidden)

| Anti-Pattern | Reason | Correct Alternative |
|---|---|---|
| `border: 1px solid #E2E8F0` (Visual Standards token) | Wrong token — belongs to MIABOS platform, not Aura | Use background color shift or ghost border at 15% opacity |
| `border-radius: 8px` on buttons | Breaks Aura pill shape rule | Use `rounded-full` (9999px) |
| `color: #0F172A` (Visual Standards text) | Wrong token | Use `#013652` (Navy Slate) |
| `background: #F8FAFC` (Visual Standards page bg) | Wrong token | Use `#F6F9FF` (Cool Blue-tinted) |
| `box-shadow: 0 1px 3px rgba(0,0,0,0.1)` (standard shadow) | Too hard, kills Aura aesthetic | Use `shadow-ambient` |
| `<hr>` or visual dividers | Violates No-Line Rule | Spacing + background shift |
| Pure black `#000000` or near-black `#111827` for text | No pure black — Aura rule | Use `#013652` |

---

## 6. Gate Checklist

- [x] Design direction confirmed: Aura Minimalist
- [x] UI framework confirmed: React + shadcn/ui + Tailwind CSS (greenfield)
- [x] Color palette defined — MIA Brand Blue `#2F64F6` canonical
- [x] Typography scale complete
- [x] Spacing scale defined
- [x] Component library documented (Button, Card, Table, Input, Chat, AppShell)
- [x] Tailwind config provided
- [x] shadcn/ui config provided
- [x] CSS variables provided
- [x] Anti-patterns documented
- [x] Accessibility checklist included
- [ ] Mockups linked (pending — `Design/Mockups/`)
- [ ] A05 Tech Lead sign-off on implementability
