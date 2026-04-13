---
name: intake-feedback
description: "Process customer feedback, feature requests, or bug reports into categorized backlog items with domain mapping. Use when customer feedback arrives from any channel."
agent: A03
phase: PB-01
input: "Customer feedback (text, email, chat export, survey data, support ticket)"
output: "Categorized backlog items in project _backlog.md with domain mapping"
template: "00_Agent_OS/Templates/T-Intake.md"
---

# Intake Customer Feedback

## Purpose

Transform raw customer feedback into structured, prioritized backlog items mapped to MIABOS domain model.

## Instructions

### Step 1: Parse Raw Feedback

- Read the raw feedback input
- Identify: customer name/company, channel (Zalo, Facebook, email, call), date, product used

### Step 2: Classify Each Item

For each distinct request/issue, classify:

| Classification | Tag | Route |
|---------------|-----|-------|
| Feature request | `[FEATURE]` | A02 for product evaluation |
| Bug report | `[BUG]` | Direct to backlog with priority |
| UX complaint | `[UX]` | A06 for review |
| Integration issue | `[INTEGRATION]` | A05 for technical review |
| Business/pricing | `[BUSINESS]` | A04 for strategy review |

### Step 3: Map to Domain

For each item, identify:
- Impacted product(s): `[SMART]` / `[SPRING]` / `[SCALE]` / `[PLATFORM]`
- Impacted domain: CRM, AI Engine, Content, Journey, Omni-channel, etc.
- Related Directus collections (reference `database_schema.json` domain map in AGENTS.md)

### Step 4: Create Backlog Items

For each classified item, produce:
- **Title**: Clear, action-oriented
- **Tags**: Classification + Product + Domain
- **Description**: Customer's actual words + structured summary
- **Priority suggestion**: Critical / High / Medium / Low
- **Customer impact**: Number of customers affected (if known)

### Step 5: Route

- Add items to relevant project `_backlog.md`
- Flag urgent items to PM for immediate triage
- If no existing project fits, flag to PM for new project consideration

## Quality Checks

- [ ] Every feedback item classified and tagged
- [ ] Domain mapping completed for each item
- [ ] Customer's original words preserved in description
- [ ] Priority assigned based on impact, not just urgency
- [ ] Items routed to correct backlog
