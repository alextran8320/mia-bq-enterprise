---
name: visual-audit
description: "Compare FE implementation screenshots against approved UXUI Feature Spec for mid-build checkpoint. Scores fidelity and flags deviations. Required during PB-04 build phase."
agent: A06
phase: PB-04
input: "FE screenshot(s), approved UXUI Feature Spec"
output: "Visual Audit Report: PASS or BLOCK with deviation list"
template: null
---

# Visual Audit (Mid-Build Checkpoint)

## Purpose

Compare what A07 built against what A06 designed. This is a mandatory checkpoint during PB-04 — first screen must pass before A07 continues building remaining screens.

## Instructions

### Step 1: Gather Materials

1. **FE screenshot**: from A07 (`Build/Screenshots/`)
2. **UXUI Feature Spec**: the approved spec (`Design/UXUI_Features/`)
3. **Design System**: token values for exact comparison

### Step 2: Pixel-Level Comparison

Compare element by element:

| Check Area | What to Compare | Tolerance |
|-----------|----------------|-----------|
| **Layout structure** | Grid, columns, spacing, alignment | ±2px |
| **Typography** | Font family, size, weight, color, line-height | Exact match |
| **Colors** | Background, text, border, shadow tokens | Exact match |
| **Components** | Button style, card style, table style, icons | Must use Design System |
| **Spacing** | Padding, margin, gap values | Must follow 4/8pt grid |
| **Vietnamese copy** | All text matches spec copy, no English | Exact match |
| **States** | Loading, empty, error, hover, disabled | All implemented |
| **Icons** | Lucide SVG only, no emoji, correct icon choice | Exact match |

### Step 3: Score Fidelity

**Fidelity Score**: X/10

| Score | Meaning |
|-------|---------|
| 9-10 | Pixel-perfect, zero deviations |
| 8 | Minor deviations (1-2 cosmetic issues) |
| 7 | Noticeable but non-blocking deviations |
| 5-6 | Significant layout or visual issues |
| < 5 | Fundamental mismatch with design |

### Step 4: Produce Audit Report

```markdown
## Visual Audit: [Screen Name]
**Date**: YYYY-MM-DD
**FE Screenshot**: [link]
**UXUI Spec**: [link]

### Fidelity Score: X/10

### Deviations Found
| # | Element | Expected (Spec) | Actual (Build) | Severity | Fix Required |
|---|---------|-----------------|----------------|----------|-------------|
| 1 | Page title font-size | 24px/700 | 20px/600 | Medium | Yes |
| 2 | Card padding | 20px (--space-5) | 16px | Low | Yes |

### Behavioral Check
- [ ] §0 User Task is achievable in the build
- [ ] §2.1 Task Flow steps work in sequence
- [ ] §5.1 Error states render correctly
- [ ] Vietnamese copy matches §6 Glossary

### Verdict: PASS (≥ 8/10) / BLOCK (< 8/10)
```

### Step 5: Act on Verdict

- **PASS**: A07 continues building remaining screens
- **BLOCK**: A07 must fix listed deviations before continuing. Re-audit after fixes.

## Quality Checks

- [ ] Every visible element compared to spec
- [ ] Deviations have specific expected vs actual values
- [ ] Behavioral checks (§0, §2.1, §5.1) verified, not just visual
- [ ] Vietnamese copy accuracy checked
- [ ] Screenshot saved as audit evidence
