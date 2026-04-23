---
name: write-uxui-spec
description: "Write the canonical screen-based UXUI pack for one feature slice from Feature Spec Lite + Sitemap + Flow Matrix. Use when A06 needs to materialize all required screen specs for FE Preview."
agent: A06
phase: PB-03
input: "Feature Spec Lite (Feature Ready for UX), PRD, Design System, approved or draft Sitemap + Flow Matrix"
output: "Screen-level UXUI spec pack in project Design/UXUI_Screens/"
template: "00_Agent_OS/Templates/T-UXUI-Screen-Spec.md"
---

# Write UXUI Screen Pack

## Purpose

Produce the canonical screen-based UXUI handoff for one feature slice. This skill assumes MIABOS is using `Sitemap + Flow Matrix + Screen Specs` rather than one `UXUI Feature Spec` file per feature.

## Instructions

1. Read `Feature Spec Lite` — it must be at least `Feature Ready for UX`
2. Read linked `PRD`, `Research Recommendation`, and current `Design System`
3. Materialize or verify `Sitemap + Flow Matrix`
4. Determine all in-scope screens:
   - route pages
   - drawers / modals that carry meaningful task work
   - critical empty / blocked / error states if they are distinct surfaces
5. Create one `UXUI Screen Spec` per in-scope screen
6. Ensure each screen spec links back to:
   - feature ID
   - sitemap node
   - flow matrix reference
   - related route/path
7. Set status:
   - `Draft` while missing feature or sitemap certainty
   - `In Review` when screen set is structurally complete
   - `Approved` after PM / Business Owner design sign-off

## Quality Checks

- [ ] Every in-scope screen has a spec
- [ ] Every screen links back to feature + sitemap + flow matrix
- [ ] Screen purpose, states, and navigation are explicit
- [ ] No screen invents behavior beyond the Feature Spec
- [ ] Vietnamese copy is complete in visible UI text
