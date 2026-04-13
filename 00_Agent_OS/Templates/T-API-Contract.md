# API Contract: [Project/Epic Name]

> Use this template only when the story requires a split technical pack. In the lean preview-first process, the default pre-BE technical handoff is `T-Integration-Spec`.

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

## 1. Authentication

| Field | Value |
|-------|-------|
| **Method** | JWT / API Key / Webhook Signature |
| **Header** | `Authorization: Bearer <token>` |
| **Rate Limit** | X requests/minute |

---

## 2. Standard Error Schema

All error responses follow this format:
```json
{
  "error": {
    "code": "ERROR_CODE",
    "message": "Human-readable description",
    "details": {}
  }
}
```

| HTTP Code | When |
|-----------|------|
| 400 | Bad request / validation error |
| 401 | Unauthorized |
| 404 | Resource not found |
| 409 | Conflict (duplicate) |
| 500 | Internal server error |

---

## 3. Endpoints

### `POST /api/endpoint-name`

**API ID**: `API-001`
**Purpose**: [What this endpoint does]
**Feature IDs**: `F-M01-001`
**Covers AC**: `AC-F-M01-001-01`
**Related Error IDs**: `ERR-001`
**Related Event IDs**: `EV-001`

**Request:**
```json
{
  "field1": "value",
  "field2": 123
}
```

**Response 200:**
```json
{
  "id": "uuid",
  "field1": "value",
  "created_at": "2024-01-01T00:00:00Z"
}
```

**Response 400:**
```json
{
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "field1 is required"
  }
}
```

---

### `GET /api/endpoint-name/:id`

**API ID**: `API-002`
**Purpose**: [What this endpoint does]
**Feature IDs**: `F-M01-002`
**Covers AC**: `AC-F-M01-002-01`

**Response 200:**
```json
{
  "id": "uuid",
  "field1": "value"
}
```

---

_(Repeat for each endpoint)_

---

## 4. Webhooks (Inbound)

### `POST /webhooks/service-name`

**API ID**: `API-WH-001`
**Source**: [External service name]
**Idempotency Key**: `unique_id_field` _(mandatory - check before processing)_
**Feature IDs**: `F-M01-003`
**Related Event IDs**: `EV-003`

**Payload from external service:**
```json
{
  "event": "event_type",
  "unique_id_field": "abc-123",
  "data": {}
}
```

**Our Response:** Always `200 OK` (even for duplicates)

---

## 5. Cross-Check

- [ ] Every endpoint's response fields have a place in the UI (Design System)
- [ ] Every endpoint maps to at least one AC code in PRD
- [ ] Every endpoint maps to at least one Feature ID in the registry
- [ ] Webhook idempotency defined for all inbound webhooks
- [ ] Error schema is consistent across all endpoints
