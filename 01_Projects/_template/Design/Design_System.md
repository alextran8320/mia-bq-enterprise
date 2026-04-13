# [PLACEHOLDER] Design System

**Gate Required By**: Gate 3 — Design → Build (PB-02 → PB-03)
**Owner**: A06 UI/UX Agent
**Status**: Replace this placeholder with actual design system during PB-02 Phase B.

> **Full template**: See `../../../../00_Agent_OS/Templates/T-Design-System.md` for the complete Design System template.
> This file must be completed before Gate 3 can pass.

---

## What Goes Here

This document defines the complete design system for the project — colors, typography, spacing, components, and interaction patterns. Created by **A06 UI/UX Agent** during PB-02 Phase B.

**Gate 3 will not pass without this document being complete.**

The Design System is the single source of truth for all visual decisions. A03 Builder Agent must read this before writing any CSS.

---

## Template Structure

> Copy the full template from `../../../../00_Agent_OS/Templates/T-Design-System.md` and fill it in.

Key sections to complete:

### 1. Design Direction
_Which of the 3 design directions was approved at Gate 2A?_
- Direction name:
- Key visual characteristics:
- Approved by Business Owner: ☐ Yes / ☐ No

### 2. Color Palette
| Token | Hex | Usage |
|-------|-----|-------|
| `--color-primary` | | Primary actions, CTAs |
| `--color-secondary` | | Secondary elements |
| `--color-background` | | Page background |
| `--color-surface` | | Card/panel background |
| `--color-text-primary` | | Main body text |
| `--color-text-secondary` | | Muted/helper text |
| `--color-border` | | Borders, dividers |
| `--color-error` | | Error states |
| `--color-success` | | Success states |
| `--color-warning` | | Warning states |

> ⚠️ **Color Confirmation Rule (KB Rule 8)**: Color palette must be confirmed in a SEPARATE step before proceeding to component design. Do not combine color selection with other design decisions.

### 3. Typography
| Token | Font | Size | Weight | Line Height | Usage |
|-------|------|------|--------|-------------|-------|
| `--text-h1` | | | | | Page titles |
| `--text-h2` | | | | | Section headers |
| `--text-h3` | | | | | Card headers |
| `--text-body` | | | | | Body text |
| `--text-small` | | | | | Helper text |
| `--text-label` | | | | | Form labels |

### 4. Spacing Scale
| Token | Value | Usage |
|-------|-------|-------|
| `--space-xs` | 4px | Tight spacing |
| `--space-sm` | 8px | Small gaps |
| `--space-md` | 16px | Default spacing |
| `--space-lg` | 24px | Section spacing |
| `--space-xl` | 32px | Large sections |
| `--space-2xl` | 48px | Page sections |

### 5. Component Library
List all UI components used in this project:

| Component | Variants | States | Notes |
|-----------|---------|--------|-------|
| Button | Primary, Secondary, Ghost | Default, Hover, Active, Disabled, Loading | |
| Input | Text, Select, Checkbox, Radio | Default, Focus, Error, Disabled | |
| Card | Default, Elevated | | |
| Table | | | |
| Modal | | | |
| Toast/Alert | Success, Error, Warning, Info | | |

### 6. Framework Configuration
> KB Rule 9: Design System = Framework Config + Theme + Component Map
_Which CSS framework is used? (Tailwind, Bootstrap, etc.)_
- Framework:
- Config file location:
- Theme extension:

---

## Gate 3 Checklist

- [ ] Color palette is defined and confirmed (separate step per KB Rule 8)
- [ ] Typography scale is complete
- [ ] Spacing scale is defined
- [ ] All components used in mockups are documented
- [ ] Framework configuration is specified
- [ ] Design System is consistent with all mockups in `Mockups/`
- [ ] A06 has reviewed and signed off

---

## Reference
- Full template: `../../../../00_Agent_OS/Templates/T-Design-System.md`
- Visual Standards: `../../../../00_Agent_OS/References/Visual_Standards.md`
- Mockups: `Mockups/`
- Gate 3 requirements: `../../../../00_Agent_OS/Rules/Quality_Gates.md` (line 60)
- Playbook: `../../../../00_Agent_OS/Playbooks/PB-02_Analyze_and_Design.md`
