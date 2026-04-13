---
name: directus-config
description: "Generate Directus collection/field configuration specs for backend implementation. Translates Integration Spec data model into actionable Directus configuration. Use when A08 needs to configure Directus for a feature."
agent: A08
phase: PB-04
input: "Integration Spec (Approved), database_schema.json"
output: "Directus configuration spec in project Build/ folder"
template: null
---

# Directus Configuration Spec

## Purpose

Translate the Integration Spec's data model section into a concrete Directus configuration that A08 can implement directly.

## Instructions

### Step 1: Read Inputs

1. Read **Integration Spec** (must be `Approved`)
2. Read `database_schema.json` for existing schema
3. Read Feature SRS for business rules that affect field validation

### Step 2: Define Collections

For each new or modified collection:

```markdown
### Collection: [name]
- **Action**: CREATE / MODIFY
- **Singleton**: No
- **Hidden**: No
- **Multi-tenant field**: company (M2O → companies)
- **Sort field**: [if applicable]
- **Archive field**: status / archived_at [if applicable]
```

### Step 3: Define Fields

For each field:

```markdown
| Field | Type | Interface | Required | Default | Validation | Notes |
|-------|------|-----------|----------|---------|------------|-------|
| id | uuid | — | auto | auto-generated | — | PK |
| company | m2o | select-dropdown-m2o | yes | current_company | — | Multi-tenant |
| status | string | select-dropdown | yes | 'draft' | enum: draft,active,archived | — |
| name | string | input | yes | — | max_length: 255 | — |
```

### Step 4: Define Relationships

```markdown
| From Collection | Field | Type | To Collection | Notes |
|----------------|-------|------|---------------|-------|
| [collection] | company | M2O | companies | Multi-tenant isolation |
| [collection] | items | O2M | [related] | — |
```

### Step 5: Define Access Control

Per role (from Role-Permission Matrix):

```markdown
| Role | Create | Read | Update | Delete | Filter |
|------|--------|------|--------|--------|--------|
| Admin | * | * | * | * | company = $CURRENT_COMPANY |
| Agent | own | company | own | — | company = $CURRENT_COMPANY |
```

### Step 6: Define Flows (Automation)

If the feature needs Directus Flows:
- Trigger: event type + collection
- Operations: sequence of actions
- Error handling

## Quality Checks

- [ ] Integration Spec was `Approved` before starting
- [ ] Every collection has company field for multi-tenancy
- [ ] Field types match Directus supported types
- [ ] Relationships validated against existing schema
- [ ] Access control defined per role
- [ ] No conflicts with existing collections in database_schema.json
