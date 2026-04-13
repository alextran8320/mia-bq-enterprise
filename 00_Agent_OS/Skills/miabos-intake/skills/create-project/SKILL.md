---
name: create-project
description: "Initialize a new MIABOS project workspace from 01_Projects/_template/ with proper metadata, linking, and index entries. Use when a new initiative is confirmed GO by Business Owner."
agent: A01
phase: PB-01
input: "Project name, brief description, impacted products"
output: "New project folder in 01_Projects/ with _project.md initialized"
template: "01_Projects/_template/"
---

# Create Project Workspace

## Purpose

Set up a new project folder with all required structure and metadata so agents can begin working immediately.

## Instructions

### Step 1: Gather Minimum Info

Before creating, confirm:
- **Project name** (English, no spaces — use underscores)
- **Brief description** (1-2 sentences)
- **Impacted products**: MIA Smart / MIA Spring / MIA Scale / Platform
- **Trigger**: MOM reference, Boss directive, or market signal

### Step 2: Copy Template

Copy `01_Projects/_template/` → `01_Projects/[Project_Name]/`

Resulting structure:
```
01_Projects/[Project_Name]/
├── _project.md          ← Initialize with metadata
├── Raw_Input/
├── Analysis/
├── Design/
├── Build/
└── Test/
```

### Step 3: Initialize _project.md

Fill in:
- Project name, description, status (`Active`)
- Impacted products
- Created date (today)
- Current phase: `PB-01`
- Session Timeline: empty (first session will populate)
- Link to triggering MOM or intake document

### Step 4: Update Indexes

- If a project index exists in `01_Projects/`, add this project entry

## Quality Checks

- [ ] Folder structure matches template
- [ ] _project.md has all required metadata filled
- [ ] Impacted products tagged
- [ ] Current phase set to PB-01
