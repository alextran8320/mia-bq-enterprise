---
name: process-mom
description: "Process a raw MOM transcript into structured decisions, action items, open issues, and KB rules following MIABOS T-MOM template. Use when Boss drops meeting notes, voice transcript, or raw bullet points."
agent: A11
phase: PB-01
input: "Raw MOM transcript (text, file, or voice-to-text output)"
output: "Structured MOM file in 04_Raw_Information/MOM/, action items routed to project backlog"
template: "00_Agent_OS/Templates/T-MOM.md"
---

# Process MOM Transcript

## Purpose

Transform raw meeting notes into structured, actionable artifacts. Every MOM must produce at least one decision or action item — never output a formatted-but-empty document.

## Instructions

### Step 1: Read Input

- Accept input in any form: pasted transcript, file path, voice-to-text dump, bullet points
- If file path provided, read the file
- Identify: date, participants, meeting topic, platform

### Step 2: Extract & Structure

Fill the T-MOM template with these sections:

1. **Meeting Objective** — infer from context if not stated explicitly
2. **Key Discussion Points** — group by topic, capture key arguments and data referenced
3. **Decisions Made** — extract every decision with: context/rationale, decided by, impact
4. **Action Items** — extract with: owner, deadline, priority (High/Med/Low), project link
5. **Open Issues** — unresolved items that need follow-up
6. **Next Steps** — next meeting date, prep needed, follow-ups

### Step 3: Validate

- [ ] Every decision has a rationale (not just "decided X")
- [ ] Every action item has an owner and deadline (ask PM if missing)
- [ ] No orphan topics — every discussion point leads to a decision, action, or open issue
- [ ] Vietnamese names/terms preserved accurately

### Step 4: Save & Route

1. Save structured MOM to `04_Raw_Information/MOM/YYYY-MM-DD_[Topic].md`
2. Update `04_Raw_Information/MOM/_index.md` (add entry)
3. Route action items to PM for backlog insertion:
   - New feature → project `_backlog.md`
   - Bug → project `_backlog.md` with `[BUG]` tag
   - Strategy → A04 for business case evaluation
4. Route KB-worthy rules to `03_Knowledge_Bank/` via PM approval

### Step 5: Preserve Raw Input

Keep the original raw transcript in **Section 7: Raw Notes / Transcript** of the MOM file.

## Quality Checks

- [ ] Output follows T-MOM template exactly
- [ ] At least 1 decision or action item extracted
- [ ] All action items have owner + deadline
- [ ] Raw transcript preserved in Section 7
- [ ] MOM index updated
