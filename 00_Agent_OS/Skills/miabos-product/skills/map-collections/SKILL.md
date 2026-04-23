---
name: map-collections
description: "Map feature requirements to existing Directus collections from database_schema.json (161 collections). Identifies which collections, fields, and relationships a feature needs. Use when analyzing data impact of a new feature."
agent: A05 / A03
phase: PB-02 / PB-03
input: "Feature description or Feature Spec + database_schema.json"
output: "Collection mapping table showing feature → collection → field traceability"
template: null
---

# Map to Directus Collections

## Purpose

Analyze which existing Directus collections a feature touches, which fields are needed, and whether new collections/fields are required. Prevents building redundant data structures.

## Instructions

### Step 1: Read Inputs

1. Read the feature description, Feature Spec, or User Story
2. Read `database_schema.json` (root of workspace)
3. Reference the MIABOS Database Domain Map in AGENTS.md for quick domain lookup

### Step 2: Identify Required Data

List every data entity the feature needs:
- What data does the user see/edit?
- What data does the system read/write behind the scenes?
- What relationships between entities are needed?

### Step 3: Map to Existing Collections

For each data entity, search `database_schema.json`:

| Data Need | Existing Collection | Key Fields | Relationship | Gap? |
|-----------|-------------------|------------|-------------|------|
| Customer info | `customers` | name, phone, email, company | belongs_to: companies | None |
| Conversation | `conversations` | customer_id, channel, status | has_many: messages | None |
| [New need] | — | — | — | **NEW collection needed** |

### Step 4: Flag Gaps

For each gap (no existing collection matches):
- Propose: new collection? new fields on existing? or use existing differently?
- Consider: multi-tenancy (company field), access control, existing relationships
- Flag to A05 Tech Lead for architecture decision

### Step 5: Cross-Domain Impact

Check if the feature touches multiple domains:
- CRM + AI Engine? → MIA Smart impact
- Content + Omni-channel? → MIA Spring impact
- Journey + Promotions? → MIA Scale impact
- Flag cross-domain dependencies

## Output Format

```markdown
## Collection Mapping: [Feature Name]

### Existing Collections Used
| Collection | Domain | Fields Used | Access Pattern |
|-----------|--------|-------------|---------------|

### New Collections/Fields Required
| Proposed Name | Reason | Related To | Multi-tenant? |
|--------------|--------|-----------|--------------|

### Cross-Domain Impact
| Domain A | Domain B | Dependency Type |
|----------|----------|----------------|
```

## Quality Checks

- [ ] Every data need mapped to existing collection or flagged as gap
- [ ] Multi-tenancy (company isolation) verified for all collections
- [ ] Cross-domain impacts flagged
- [ ] No redundant new collections proposed (checked existing first)
