# Haravan Omni API Overview

## Confidence summary

- **Documented by Haravan**: API prefixes, auth requirement, rate limits, status codes
- **Inferred best practice**: recommended module split, default architecture posture
- **Needs sandbox validation**: none in this file beyond environment-specific app behavior

## Core model

Haravan exposes REST APIs for app partners to read and write merchant data. The visible pattern in the docs is split by product area:

- `https://apis.haravan.com/com/...` → commerce/admin resources
- `https://apis.haravan.com/web/...` → haraweb/storefront resources

Most operational back-office integrations will use the **commerce** prefix.

## Key constraints

- All APIs require authentication.
- All APIs are subject to rate limits.
- Access is controlled by scopes chosen in the Partner app config and passed during install/login.
- Not every user can complete every install flow; some flows require the shop owner/admin role.

## Common integration categories

### 1. Admin/commerce integrations
Use `com` endpoints for:

- products
- variants
- customers
- orders
- transactions
- inventory
- shipping rates
- metafields
- events

### 2. Storefront/haraweb integrations
Use `web` endpoints for:

- themes
- script tags
- blogs
- articles
- pages
- redirects
- comments

### 3. App platform integration
Covers:

- OAuth/login/install flow
- scope negotiation
- webhook registration/use
- user/session verification
- shop connection lifecycle

## Rate limits

Haravan documents a leaky bucket model:

- bucket size: `80`
- leak rate: `4 requests / second`
- header: `X-Haravan-Api-Call-Limit: current/80`
- throttling response: `429 Too Many Requests`
- retry hint: `Retry-After: <seconds>`

Design implications:

- Average sustained rate should stay near or under 4 req/s per shop.
- Short bursts are allowed until the bucket fills.
- High-volume sync jobs should use queues, batch scheduling, and backoff.

## Error status baseline

Haravan docs explicitly call out:

- `200 OK` → success
- `400 Bad Request` → malformed syntax, wrong `Content-Type`, or invalid OAuth code
- `401 Unauthorized` → missing/invalid credentials
- `403 Forbidden` → missing scope / insufficient permission
- `404 Not Found` → resource missing
- `429 Too Many Requests` → rate-limited
- `500 Internal Server Error` → Haravan internal issue
- `502 Bad Gateway` → upstream/proxy issue

## Design posture for agents

When integrating with Haravan:

1. Decide the exact resource family first.
2. Use the proper prefix (`com` vs `web`).
3. Verify scopes before coding business logic.
4. Build a reusable client that injects auth, parses errors, and tracks call limits.
5. Keep idempotency and retry behavior explicit.

## Recommended file/module split in apps

- `haravan/client.*` → HTTP wrapper
- `haravan/auth.*` → install/login/token logic
- `haravan/scopes.*` → scope constants and composition
- `haravan/resources/*` → orders, customers, products, metafields, etc.
- `haravan/webhooks.*` or `haravan/events.*` → async ingestion
- `haravan/sync/*` → import/export jobs and cursors

## Practical defaults

If the user is vague, start with these assumptions:

- app backend owns the Haravan token
- integration is shop-scoped
- commerce/admin API is the main surface
- writes need explicit retries and observability
- webhooks are preferred over naive polling when supported by the product flow
