---
name: write-screen-spec
description: "Write one UXUI Screen Spec from Feature Spec Lite + Sitemap + Flow Matrix. Use when each canonical UX artifact is one screen."
agent: A06
phase: PB-03
input: "Feature Spec Lite, Sitemap node, Flow Matrix row, Design System"
output: "One UXUI Screen Spec in project Design/UXUI_Screens/"
template: "00_Agent_OS/Templates/T-UXUI-Screen-Spec.md"
---

# Write Screen Spec

## Purpose

Describe one screen, route, drawer, or modal in enough detail that FE can implement it without inventing task intent, states, or navigation behavior.

## Quality Checks

- [ ] Screen purpose and primary task are explicit
- [ ] Entry points and outbound navigation are explicit
- [ ] Loading / empty / error / blocked states are covered
- [ ] Linked feature, route, and sitemap node are present
