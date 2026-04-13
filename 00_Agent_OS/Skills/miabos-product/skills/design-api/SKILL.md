---
name: design-api
description: "Design API contracts and Integration Spec for Directus-based features. Maps Feature SRS requirements to endpoints, data flows, and integration points. Use after FE Preview review when preparing backend handoff."
agent: A05
phase: PB-03 / PB-04
input: "Feature SRS (SRS Ready), FE Preview feedback, database_schema.json"
output: "Integration Spec in project Architecture/ folder"
template: "00_Agent_OS/Templates/T-Integration-Spec.md, 00_Agent_OS/Templates/T-API-Contract.md"
---

# Design API / Integration Spec

## Purpose

Produce the Integration Spec — the lean technical handoff that opens backend work after FE Preview is reviewed. Maps Feature → UI → API → DB traceability.

## Instructions

### Step 1: Read Inputs

1. Read **Feature SRS** (must be at least `SRS Ready`)
2. Read **FE Preview feedback** (behavior changes absorbed back into SRS/UXUI)
3. Read `database_schema.json` for existing collections/fields/relationships
4. Read UXUI Feature Spec for UI data requirements

### Step 2: Map API Endpoints

For each feature requirement, define:

| Field | Example |
|-------|---------|
| **API-ID** | API-FXXX-01 |
| **Method** | GET / POST / PATCH / DELETE |
| **Path** | `/items/customers?filter[company][_eq]={{company_id}}` |
| **Request** | Query params, body schema |
| **Response** | Success schema, error schema |
| **Auth** | Role/permission required |
| **Feature ID** | Linked Feature ID |

### Step 3: Map Data Model Changes

If new collections/fields needed:
- Collection name, field definitions, relationships
- Migration plan (if modifying existing collections)
- Backward compatibility check

### Step 4: Map Integration Points

For external services (OmiCall, Facebook, Zalo, etc.):
- Event trigger → webhook/API call
- Payload format
- Error handling + retry + fallback
- Idempotency strategy

### Step 5: Produce Integration Spec

Write `Architecture/Integration_Spec.md` using T-Integration-Spec template:
- Feature → UI → API → DB traceability matrix
- Endpoint definitions
- Data model changes
- Integration flows
- Error handling patterns

### Step 6: Set Status

- `In Review` → submit to PM for sign-off
- `Approved` → PM confirms, backend work can start

## Quality Checks

- [ ] Follows T-Integration-Spec template
- [ ] Feature SRS was at least `SRS Ready` before starting
- [ ] FE Preview has been reviewed (or PM approved exception)
- [ ] Every endpoint has API-ID linked to Feature ID
- [ ] Data model changes validated against database_schema.json
- [ ] Multi-tenancy (company isolation) preserved
- [ ] Error handling specified for every endpoint
- [ ] No orphan endpoints (every API maps to a feature need)
