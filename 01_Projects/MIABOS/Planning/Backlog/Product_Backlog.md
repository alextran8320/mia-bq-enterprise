# Product Backlog

**Status**: In Review
**Owner**: [[A01_PM_Agent]]
**Last Updated By**: Codex CLI (GPT-5 Codex)
**Last Reviewed By**: A01 PM Agent
**Approval Required**: PM Agent + Product Owner
**Approved By**: -
**Last Status Change**: 2026-04-16
**Source of Truth**: This file for ordered product-priority sequencing, story-level readiness, and release planning.
**Blocking Reason**: FE Preview còn bị khóa bởi UXUI chưa Approved; backlog hiện chỉ materialize slice `F-M09-AIC-001` cho AI Workspace
**Project**: MIABOS
**Delivery Unit**: `User Story`
**Document Role**: Canonical PM control plane for release and sprint candidate prioritization

---

## 0. Purpose

- Use this file as the single ordered backlog for approved story slices.
- Every row represents one delivery story slice that maps back to one `Feature ID`.
- Group work by release first, then by target sprint or delivery batch.

## 1. Backlog Readiness Vocabulary

| Readiness | Meaning | Legal Next Move |
|-----------|---------|-----------------|
| `Idea` | Identified, not yet shaped into a delivery story slice | Clarify scope and owners |
| `Scoped` | Scope, release intent, and target users are known, but story authoring is not complete | Prepare or refine the story slice |
| `Ready for Story` | PM and BA have enough clarity to finalize the canonical story file | Write or approve the user story |
| `Design Pending` | Story exists, but SRS and/or UXUI gate is not yet legal for build | Complete SRS, UXUI, and design gate work |
| `Ready for Design` | Story is approved for near-term PB-03 work and can legally move into SRS plus UXUI preparation | Open or continue PB-03 work |
| `Ready for Build` | Story, SRS, design, and execution handoff are sufficiently approved for implementation | Pull into build execution |
| `Blocked` | Work cannot progress and the blocker is explicit | Resolve blocker before promotion |
| `Done` | Delivered and accepted | Close and retain for traceability |

## 2. Priority Vocabulary

- `P0` = critical current release scope
- `P1` = important but not first-wave scope
- `P2` = deferable or exploratory scope

## 3. Backlog Structure

Keep the row format below stable across all grouped sections.
Use release grouping first, then sprint or delivery batch grouping.

## Phase 1 AI Workspace Foundation

### Design and Planning Batch

| Rank | Backlog ID | Story ID | Feature ID | Epic ID | Item | Product | Priority | Readiness | Target Release | Target Sprint | PM Owner | BA Owner | Dependency | Next Action | Story File | Feature SRS | UXUI / STB | Blocking Reason |
|------|------------|----------|------------|---------|------|---------|----------|-----------|----------------|---------------|----------|----------|------------|-------------|------------|-------------|------------|-----------------|
| 1 | PBI-M09-AIC-001 | US-M09-AIC-001 | F-M09-AIC-001 | EP-M09-AIC | Internal AI Chat Foundation | MIA Smart | P0 | Ready for Design | R1 | Sprint 1 | A01 | A03 | `F-M08-KNW-001..004`, `F-M07-SEC-001`, `F-M11-ESC-001` | Review PRD with Business Owner, giữ BA/UX workstream mở, và không mở FE Preview trước khi UXUI Approved | [US-M09-AIC-001_Internal_AI_Chat_FE_Preview.md](../Stories/AI_Workspace/US-M09-AIC-001_Internal_AI_Chat_FE_Preview.md) | [F-M09-AIC-001_Internal_AI_Chat_SRS.md](../../Analysis/Features/Modules/AI_Workspace/Internal_AI_Chat/SRS/F-M09-AIC-001_Internal_AI_Chat_SRS.md) | [STB-M09-AIC-001_Internal_AI_Chat_FE_Preview.md](../Subtask_Boards/STB-M09-AIC-001_Internal_AI_Chat_FE_Preview.md) | FE Preview blocked until UXUI Approved |

## 4. Row Rules

- `Rank` is the PM ordering signal inside the grouped section. No duplicate ranks inside the same section.
- `Backlog ID` must be unique across the entire file.
- `Story ID` may be `-` only before the canonical story file exists.
- `Dependency` should reference backlog IDs when possible, not loose prose only.
- `Next Action` must be concrete and actionable, not a status restatement.
- `Story File`, `Feature SRS`, and `UXUI / STB` should use explicit links once the artifact exists.

## 5. Backlog Summary

| Release | P0 Count | P1 Count | P2 Count | Total |
|---------|----------|----------|----------|-------|
| R1 | 1 | 0 | 0 | 1 |
| R2 | 0 | 0 | 0 | 0 |
| R3 | 0 | 0 | 0 | 0 |
| **Total** | 1 | 0 | 0 | 1 |

## 6. Governance

- Every backlog row must map to one `Feature ID`.
- The backlog runs at the `User Story` level, not the feature-brief level.
- `Ready for Story` means scope, release target, and PM/BA ownership are clear enough to finalize the story file.
- `Ready for Design` means the story is approved for near-term PB-03 preparation and may legally proceed into `Feature SRS` plus `UXUI`.
- `Ready for Build` requires linked downstream artifacts with valid status for the in-scope slice.
- PM ownership and BA ownership must both be explicit before story authoring begins.
- Duplicate `Backlog ID` values are forbidden.
- Use this file for prioritization and readiness only; do not turn backlog rows into meeting notes.
