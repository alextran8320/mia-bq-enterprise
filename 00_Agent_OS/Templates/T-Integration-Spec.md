# Integration Spec: [Feature / Story Name]

**Status**: Draft / In Review / Approved / Blocked / Deprecated
**Owner**: [[A05_Tech_Lead_Agent|A05 Tech Lead Agent]]
**Last Updated By**: A05
**Last Reviewed By**: A01
**Approval Required**: PM
**Approved By**: -
**Last Status Change**: YYYY-MM-DD
**Source of Truth**: This document
**Blocking Reason**: -
**Created by**: [[A05_Tech_Lead_Agent|A05 Tech Lead Agent]]
**Date**: YYYY-MM-DD

---

## 1. Scope

- `Story ID`:
- `Feature ID`:
- `Related PRD`:
- `Related User Story`:
- `Related Feature SRS`:
- `Related UXUI`:
- `FE Preview Review Result`:

## 2. Purpose

_This is the lean technical handoff used to start BE build and real FE integration after the FE Preview has been reviewed and stabilized._

## 3. FE -> API Contract

| UI Element / Action | Endpoint / Method | Request Fields | Response Fields | Notes |
|---------------------|------------------|----------------|-----------------|------|

## 4. Data Mapping

| FE Field | API Field | DB Collection / Field | Validation Owner | Notes |
|----------|-----------|------------------------|------------------|------|

## 5. Validation & Error Ownership

| Rule | FE / BE Owner | Error Code | User-Facing Behavior |
|------|----------------|------------|----------------------|

## 6. State & Event Mapping

| Business State | FE State | Backend State / Event | Notes |
|----------------|----------|------------------------|------|

## 7. Tenancy / Security Rules

- 

## 8. Integration Notes

- External services:
- Retry / fallback:
- Idempotency needs:

## 9. Build Notes

- Mock/stub behavior to replace:
- Required migrations / schema changes:
- BE sequencing notes:
- FE integration notes:

## 10. Cross-Check

- [ ] FE Preview behavior has been reviewed and frozen enough for BE start
- [ ] Every FE action maps to a backend contract
- [ ] Every backend field exposed to FE has a user-facing reason
- [ ] Validation ownership is explicit
- [ ] Tenancy / security rules are explicit
- [ ] No unresolved contradiction remains with `Feature SRS` or `UXUI`
