---
name: beauty-score
description: "Evaluate visual quality of FE implementation across 6 dimensions. Target: average >= 8/10. Gate requirement for PB-05. Use when QA phase needs visual quality assessment of built screens."
agent: A06
phase: PB-05
input: "FE screenshots, approved UXUI Feature Spec, Design System"
output: "Beauty Score Report with per-dimension scores and remediation"
template: null
---

# Beauty Score Assessment

## Purpose

Evaluate the visual quality of implemented screens. This is a PB-05 gate requirement — average score must be >= 8/10 to pass. Scoring is evidence-based, not subjective.

## Instructions

### Step 1: Gather Materials

1. Collect all **FE screenshots** from `Build/Screenshots/`
2. Read the approved **UXUI Feature Spec** for design intent
3. Read the **Design System** for token values
4. If using Pencil MCP: use `get_screenshot` for live capture

### Step 2: Score Each Screen Across 6 Dimensions

For each screen, score 1-10 on:

#### D1: Layout & Spacing (Weight: HIGH)
| Score | Criteria |
|-------|---------|
| 9-10 | Perfect grid alignment, consistent spacing, visual hierarchy clear, whitespace intentional |
| 7-8 | Minor spacing inconsistencies, hierarchy mostly clear |
| 5-6 | Noticeable alignment issues, cramped or too sparse areas |
| 1-4 | Broken layout, overlapping elements, no visual structure |

**Check**: Spacing scale (4/8pt grid), container max-width, z-index layering, safe area padding

#### D2: Typography & Hierarchy (Weight: HIGH)
| Score | Criteria |
|-------|---------|
| 9-10 | Type scale consistent, heading hierarchy clear, Vietnamese diacritics perfect, line-height comfortable |
| 7-8 | Minor inconsistencies in weight/size usage |
| 5-6 | Hierarchy unclear, some text hard to read |
| 1-4 | No type system, random sizes/weights, diacritics broken |

**Check**: Be Vietnam Pro font, scale (12/14/16/18/24/32), line-height 1.5+, weight hierarchy

#### D3: Color & Contrast (Weight: HIGH)
| Score | Criteria |
|-------|---------|
| 9-10 | Semantic color tokens used consistently, contrast >= 4.5:1, dark/light mode coherent |
| 7-8 | Minor color inconsistencies, all contrast passes |
| 5-6 | Some low-contrast text, inconsistent use of semantic colors |
| 1-4 | Raw hex values, contrast failures, clashing colors |

**Check**: Primary/secondary/error/surface tokens, AA contrast, status colors (success/warning/error)

#### D4: Consistency & Component Reuse (Weight: MEDIUM)
| Score | Criteria |
|-------|---------|
| 9-10 | All screens use same components, tokens applied uniformly, icon set consistent |
| 7-8 | Minor variations between screens |
| 5-6 | Mix of custom and system components, some inconsistency |
| 1-4 | Each screen looks like different app, no reuse |

**Check**: Button styles, card styles, table styles, icon set (Lucide only, no emoji)

#### D5: Responsiveness (Weight: MEDIUM)
| Score | Criteria |
|-------|---------|
| 9-10 | Desktop + tablet + mobile all look intentional, no horizontal scroll, touch targets correct |
| 7-8 | Desktop good, mobile mostly works with minor issues |
| 5-6 | Desktop only, mobile broken or not tested |
| 1-4 | Layout breaks at multiple breakpoints |

**Check**: Breakpoints (375/768/1024/1440), touch targets (44px min), viewport meta

#### D6: Micro-interactions & Feedback (Weight: LOW)
| Score | Criteria |
|-------|---------|
| 9-10 | Loading/empty/error states all implemented, animations smooth, hover/focus/disabled all styled |
| 7-8 | Most states implemented, minor animation gaps |
| 5-6 | Missing empty/error states, no loading indicators |
| 1-4 | No interactive states, browser defaults visible |

**Check**: Skeleton loaders, empty states, error states, toast, modals, hover/active/focus/disabled

### Step 3: Calculate & Report

```markdown
## Beauty Score Report: [Feature Name]
**Date**: YYYY-MM-DD
**Screens Evaluated**: [count]
**Evaluator**: A06 UI/UX Agent

### Per-Screen Scores

| Screen | D1 Layout | D2 Typo | D3 Color | D4 Consistency | D5 Responsive | D6 Micro | Average |
|--------|----------|---------|----------|---------------|--------------|----------|---------|
| S1 | /10 | /10 | /10 | /10 | /10 | /10 | /10 |

### Overall Average: X.X / 10

### Verdict: PASS (≥ 8.0) / FAIL (< 8.0)

### Remediation (if FAIL)
| # | Screen | Dimension | Issue | Fix Required | Priority |
|---|--------|-----------|-------|-------------|----------|
```

### Step 4: Act on Verdict

- **PASS (≥ 8.0)**: Beauty gate cleared, proceed to sign-off
- **FAIL (< 8.0)**: List specific remediation items → route to A07 for fixes → re-score after fixes

## Quality Checks

- [ ] All screens evaluated (no screen skipped)
- [ ] Each dimension scored with evidence (not gut feel)
- [ ] Vietnamese copy checked for accuracy
- [ ] Screenshots saved as evidence
- [ ] Remediation items specific and actionable (not "make it look better")
