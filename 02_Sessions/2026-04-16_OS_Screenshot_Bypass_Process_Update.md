# Session Log: OS Screenshot Bypass Process Update

**Date**: 2026-04-16  
**Project**: MIABOS + Agent OS process  
**Phase**: OS Hardening / PB-04 evidence policy  
**Duration**: Single work block  
**AI Channel**: Codex CLI  
**Model / Environment**: GPT-5.4 Codex environment  
**Agent Identity**: A01 PM Agent -> [`00_Agent_OS/Agents/A01_PM_Agent.md`](../00_Agent_OS/Agents/A01_PM_Agent.md)  
**Neural Handshake**: [x] Read `AGENTS.md`, A01 PM Agent, Global Rules, Session Logging Runbook, Quality Gates, Document Status Model, RACI, Skills Registry, current context, Daily Log, and project `_project.md`.

---

## Business Owner Instruction

Business Owner requested: read `AGENTS.md`, then update the process so the screenshot step is skipped.

## Decision

Mandatory screenshot capture is removed from the MIABOS process. The required evidence is now `Verified Demo` / runtime proof. Screenshots remain optional supporting evidence only when PM or Business Owner explicitly requests them, or when visual risk is high enough that an agent intentionally saves one.

## Process Changes

| Area | Artifact | Change |
|------|----------|--------|
| Canonical entry | [`AGENTS.md`](../AGENTS.md) | Updated `/visual-audit` and `/beauty-score` usage to accept runtime evidence; screenshots optional. |
| OS rules | [`00_Agent_OS/Rules/Global_Rules.md`](../00_Agent_OS/Rules/Global_Rules.md) | Updated Verified Demo and Visual Integrity Gate to require runtime evidence, not screenshot/recording capture. |
| Quality gates | [`00_Agent_OS/Rules/Quality_Gates.md`](../00_Agent_OS/Rules/Quality_Gates.md) | Replaced `Screenshots saved` with `Verified demo/runtime evidence saved`. |
| PB-04 playbook | [`PB-04_Build_and_Integrate.md`](../00_Agent_OS/Playbooks/PB-04_Build_and_Integrate.md) | Replaced capture-screenshot step with runtime evidence verification. |
| A06/A07 agents | [`A06_UI_UX_Agent.md`](../00_Agent_OS/Agents/A06_UI_UX_Agent.md), [`A07_FE_Builder_Agent.md`](../00_Agent_OS/Agents/A07_FE_Builder_Agent.md) | Updated visual review and FE output expectations to runtime evidence; screenshot optional. |
| UXUI skills | [`visual-audit`](../00_Agent_OS/Skills/miabos-uxui/skills/visual-audit/SKILL.md), [`beauty-score`](../00_Agent_OS/Skills/miabos-uxui/skills/beauty-score/SKILL.md) | Changed required input/evidence from screenshots to runtime evidence. |
| Templates | [`T-UXUI-Feature-Spec.md`](../00_Agent_OS/Templates/T-UXUI-Feature-Spec.md), [`T-Session-Log.md`](../00_Agent_OS/Templates/T-Session-Log.md), [`T-Subtask-Board.md`](../00_Agent_OS/Templates/T-Subtask-Board.md) | Removed screenshot as required pre-delivery evidence. |
| Knowledge Bank | [`03_Knowledge_Bank/Global_Rules.md`](../03_Knowledge_Bank/Global_Rules.md) | Updated screenshot-related learned rules and added Rule 43 `Screenshot Bypass Rule`. |
| Project template | [`01_Projects/_template/Build/Screenshots/_screenshots_placeholder.md`](../01_Projects/_template/Build/Screenshots/_screenshots_placeholder.md) | Reframed screenshot folder as optional evidence storage. |
| MIABOS active artifacts | [`SignOff_Certificate.md`](../01_Projects/MIABOS/Analysis/SignOff_Certificate.md), [`STB-M09-AIC-001`](../01_Projects/MIABOS/Planning/Subtask_Boards/STB-M09-AIC-001_Internal_AI_Chat_FE_Preview.md), [`STB-M10-SLS-001`](../01_Projects/MIABOS/Planning/Subtask_Boards/STB-M10-SLS-001_Sales_Advisor_AI_FE_Preview.md), [`US-M10-SLS-001`](../01_Projects/MIABOS/Planning/Stories/AI_Workspace/US-M10-SLS-001_Sales_Advisor_AI.md) | Replaced screenshot proof with runtime evidence for active FE Preview flow. |

## New Knowledge Rule

Added KB Rule 43:

> Screenshot capture is no longer mandatory by default. FE/build/design review still requires evidence, but the default evidence is `Verified Demo` / runtime proof: build pass log, route HTTP check, browser console check, DOM/layout assertion, Playwright result, or review note with route link.

## Verification

- Searched remaining process references for hard screenshot requirements.
- Remaining screenshot mentions are either optional, raw input examples, or bug-report evidence options.
- No screenshot file or folder was deleted.

## Follow-Up

- Future FE Preview subtasks should request runtime evidence first: build result, route check, browser console/layout notes, AC spot-check, and optional screenshot only by explicit request.
