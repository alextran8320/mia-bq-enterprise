# [PLACEHOLDER] Build Screenshots

**Gate Required By**: Gate 4 — Build → Test (PB-03 → PB-04)
**Status**: Replace this file with actual screenshots when build is complete.

---

## What Goes Here

This folder contains screenshots of the completed build, used for:
1. **Fidelity comparison** — built UI vs approved mockups (must score ≥ 8/10)
2. **A06 Visual Audit** — UI/UX Agent reviews all screens before Gate 4 passes
3. **Beauty Score evidence** — 6-dimension beauty evaluation (average ≥ 8/10)

### Required Screenshots (per Gate 4)
Capture screenshots for every screen that has a corresponding mockup:
- [ ] Home / Dashboard screen
- [ ] Key interaction screen
- [ ] Form screen
- [ ] List / Table screen
- [ ] Empty state screen
- [ ] Error state screen
- [ ] Loading state screen

### File Naming Convention
```
[ScreenName]_[State]_[Date].png
```
Examples:
- `Dashboard_Default_2026-03-17.png`
- `OrderForm_Empty_2026-03-17.png`
- `OrderList_Loaded_2026-03-17.png`
- `Login_Error_2026-03-17.png`

---

## Mid-Build Checkpoint Screenshots (Gate 3A)

A06 requires a mid-build visual checkpoint during PB-03. Store those here too:
```
Checkpoints/
  [ScreenName]_Checkpoint_[Date].png
```

---

## Fidelity Scoring Template

For each screen, A06 scores fidelity vs mockup:

| Screen | Mockup File | Screenshot | Fidelity Score (1-10) | Notes |
|--------|------------|------------|----------------------|-------|
| Dashboard | `../Mockups/Dashboard_Default_v1.md` | `Dashboard_Default_YYYY-MM-DD.png` | | |
| | | | | |

**Gate 4 passes only when ALL screens score ≥ 8/10.**

---

## Beauty Score Dimensions (A06 evaluates)

| Dimension | Score (1-10) | Notes |
|-----------|-------------|-------|
| Visual Hierarchy | | |
| Color Consistency | | |
| Typography | | |
| Spacing & Alignment | | |
| Component Polish | | |
| Overall Impression | | |
| **Average** | | Must be ≥ 8/10 |

---

## Reference
- Mockups to compare against: `../Mockups/`
- Visual Standards: `../../../../00_Agent_OS/References/Visual_Standards.md`
- Gate 4 requirements: `../../../../00_Agent_OS/Rules/Quality_Gates.md` (line 97)
