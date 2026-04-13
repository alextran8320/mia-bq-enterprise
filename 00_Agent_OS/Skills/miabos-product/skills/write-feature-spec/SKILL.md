---
name: write-feature-spec
description: "Write Feature SRS following MIABOS T-Feature-SRS template from approved User Stories. Closes business rules, state logic, errors, permissions, and data assumptions before design handoff. Use when BA needs to materialize Feature SRS for in-scope stories."
agent: A03
phase: PB-02 / PB-03
input: "Approved User Story with planning context (problem, trigger, happy path, dependencies, AC)"
output: "Feature SRS document in project Design/Features/ folder"
template: "00_Agent_OS/Templates/T-Feature-SRS.md"
---

# Write Feature SRS

## Purpose

Materialize the Feature SRS — the BA contract that closes enough ambiguity for downstream design (A06) and FE Preview (A07) consumption. The SRS sits between User Story (what the user needs) and UXUI Spec (how it looks).

## Instructions

### Step 1: Read Inputs

1. Read the approved **User Story** — extract: user problem, trigger, happy path, dependencies, AC IDs
2. Read the **PRD** for business context and User Task Flow
3. Read `database_schema.json` domain map for relevant collections
4. Read any existing analysis in the project `Analysis/` folder

### Step 2: Write the Feature SRS

Follow `T-Feature-SRS` template. Key sections:

1. **Feature Overview** — Feature ID, linked User Story, linked PRD section
2. **User Roles & Permissions** — who can do what (reference T-Role-Permission-Matrix if complex)
3. **Business Rules** — testable, unambiguous rules (each with BR-ID)
4. **Data Model** — collections, fields, relationships involved (from database_schema.json)
5. **State Machine** — if the feature has stateful workflows (reference T-State-Machine)
6. **Error Catalog** — edge cases and expected system behavior (reference T-Error-Catalog)
7. **Acceptance Criteria** — detailed AC with AC-IDs, linked to User Story AC
8. **Open Questions** — anything unresolved (flag to PM)

### Step 3: Validate Completeness

- [ ] Every AC from User Story is addressed
- [ ] Business rules are testable (not vague like "should be fast")
- [ ] Data model references real Directus collections
- [ ] Error cases covered (not just happy path)
- [ ] Permissions defined per user role

### Step 4: Set Status

- If all sections complete and no blocking open questions → set status to `SRS Ready`
- If open questions remain → set status to `Draft` and flag to PM
- `SRS Ready` is the gate: A06 UI/UX and A05 Tech cannot start canonical work until this status

## Quality Checks

- [ ] Follows T-Feature-SRS template
- [ ] Linked to User Story and PRD
- [ ] Business rules have BR-IDs
- [ ] AC have AC-IDs
- [ ] Data model references real collections from database_schema.json
- [ ] Status set correctly (Draft or SRS Ready)
- [ ] Lean enough for fast FE Preview, explicit enough to prevent invention
