---
name: write-feature-spec
description: "Write Feature Spec Lite following MIABOS T-Feature-Spec-Lite template from approved Research + PRD + User Story. Closes business rules, flows, permissions, and data touchpoints before UX/UI by screen."
agent: A03
phase: PB-02 / PB-03
input: "Approved Research or PM waiver, approved PRD, approved User Story with planning context"
output: "Feature Spec Lite document in project Analysis/Features/"
template: "00_Agent_OS/Templates/T-Feature-Spec-Lite.md"
---

# Write Feature Spec Lite

## Purpose

Materialize the canonical `Feature Spec Lite` — the BA contract that closes enough ambiguity for sitemap design, screen specs, FE Preview, and later technical integration. This artifact replaces new canonical `Feature SRS` authoring in the current MIABOS process.

## Instructions

### Step 1: Read Inputs

1. Read approved `User Story` — extract problem, trigger, happy path, dependencies, and AC IDs
2. Read linked `PRD` — extract business context, scope, release intent, and task flow
3. Read linked `Research` artifacts or PM waiver:
   - `Research Brief`
   - `Benchmark Matrix`
   - `Recommendation`
4. In MIABOS/BQ context, read the BQ pack:
   - `04_Raw_Information/Customers/Giay_BQ/README.md`
   - `2026-04-13_BQ_Stakeholder_Map.md`
   - `2026-04-13_BQ_Systems_And_Integration_Landscape.md`
   - `2026-04-13_BQ_Customer_Research_Pack.md` relevant section
5. Read existing analysis artifacts under `01_Projects/[project]/Analysis/`

### Step 2: Write the Feature Spec Lite

Follow `T-Feature-Spec-Lite` and complete at minimum:

1. Metadata + linked research
2. Feature goal and business context
3. Actors / roles
4. Trigger and entry point
5. Main flow
6. Alternate / error flows
7. Business / permission / validation rules
8. Data / integration touchpoints
9. Acceptance criteria
10. Linked screen specs
11. Sitemap node(s) and flow matrix reference

### Step 3: Validate Before Promotion

Before changing status, confirm:

- [ ] Business context is anchored to real BQ use case or linked research recommendation
- [ ] Main flow has at least 4 clear steps with actor + action
- [ ] Business rules contain at least 3 testable rules where relevant
- [ ] At least one measurable NFR or operational expectation exists when applicable
- [ ] Acceptance criteria contain at least 3 testable statements where the feature is not intentionally tiny
- [ ] Linked screens are identified or explicitly `TBD - blocked`
- [ ] Data / integration touchpoints cite real systems or internal boundaries

### Step 4: Set Status

- `Draft` -> information incomplete or UX cannot proceed safely
- `In Review` -> structurally complete, awaiting PM review
- `Feature Ready for UX` -> safe for A06 to derive sitemap + screen specs
- `Build Ready` -> only after FE Preview review feedback is absorbed and technical closure is complete

## Quality Checks

- [ ] Followed `T-Feature-Spec-Lite`
- [ ] Research input exists or waiver is recorded
- [ ] PRD and User Story links are present
- [ ] Task flow and rules are explicit enough that A06 does not need to invent behavior
- [ ] Linked screen list exists
- [ ] Status is correct with blocking reason if not ready
