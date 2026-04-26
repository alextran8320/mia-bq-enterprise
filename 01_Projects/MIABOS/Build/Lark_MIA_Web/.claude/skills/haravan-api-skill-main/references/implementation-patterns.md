# Implementation Patterns

## Confidence summary

- **Documented by Haravan**: rate-limit headers/behavior, webhook timeout and retry constraints, scope/HTTPS requirements already reflected from source docs
- **Inferred best practice**: almost all architecture guidance in this file, including queueing, idempotency design, module separation, observability, and retry posture
- **Needs sandbox validation**: concrete throughput limits for your workload mix, especially high-volume inventory or webhook burst handling

## 1. Build a thin authenticated client

Every Haravan integration should start with a small HTTP client that:

- stores the base URL prefix (`/com` or `/web`)
- injects auth headers centrally
- sends `Content-Type: application/json` for JSON writes
- captures response headers
- normalizes errors
- retries only when safe

Suggested capabilities:

- base URL selection by resource family
- timeout support
- request/response logging with redaction
- rate-limit tracking from `X-Haravan-Api-Call-Limit`
- 429 retry support using `Retry-After`

## 2. Separate install auth from business API calls

Do not mix these concerns:

- OAuth/login/install flow
- persistent shop credential storage
- resource operations

Use separate modules/services so production bugs are easier to isolate.

## 3. Design for shop-scoped multi-tenancy

Most partner apps will serve multiple shops. Model your data with explicit shop ownership:

- `shops`
- `shop_tokens`
- `shop_scopes`
- `sync_cursors`
- `webhook_deliveries`
- `resource_mappings`

Never let a request execute against Haravan without resolving the target shop first.

## 4. Rate-limit aware job execution

Haravan uses a leaky bucket.

Implement:

- per-shop queues
- concurrency caps per shop
- write serialization when risk is high
- backoff on 429
- optional jitter on retries

Good pattern:

1. enqueue resource jobs by shop
2. inspect last seen `X-Haravan-Api-Call-Limit`
3. slow down as bucket occupancy rises
4. if 429, sleep for `Retry-After` and retry

Bad pattern:

- fan out hundreds of parallel requests for one shop
- retry instantly on 429
- ignore headers

## 5. Use incremental syncs

For large resources, prefer:

- `updated_at_min` windows
- `since_id` pagination
- `fields` projection when available

Maintain cursors per shop and per resource family.

Example cursor fields:

- `last_synced_at`
- `last_seen_id`
- `last_successful_page`

Resource-specific guidance:

- **products**: sync catalog with `updated_at_*`, then reconcile variants/images as needed
- **customers**: sync with `updated_at_*` and project only fields needed by downstream CRM or ERP
- **orders**: use date windows and then fetch transaction detail only for orders that actually need payment reconciliation
- **events**: use as reconciliation trail, not as primary realtime source
- **inventory**: decide explicitly whether your source of truth is authoritative (`set`) or delta-based (`adjust`)

## 6. Treat webhooks and events differently

### Webhooks
Use for near-realtime push flows when your app and scopes support them.

Requirements indicated by docs:

- webhook registration in partner app config
- `wh_api` scope
- owner/admin install path
- HTTPS callback URL

Webhook handler rules:

- implement the registration GET handshake separately from event POST delivery
- verify `X-Haravan-Hmacsha256` against the raw request body using app client secret
- make processing idempotent
- persist receipt before side effects if possible
- acknowledge quickly, process async when needed
- treat webhooks as triggers to fetch canonical resource state when payloads are partial
- never use redirects on webhook routes because Haravan treats 3xx as failure

### Events API
Use for:

- reconciliation
- audit history
- fallback diagnostics

Do not assume Events are realtime.

## 7. Idempotent writes

For create/update flows touching remote systems:

- keep local idempotency keys where possible
- prefer upsert semantics in your own system even if Haravan API itself is create/update only
- store Haravan resource IDs after first successful creation
- guard against duplicate webhook/event processing

## 8. Error handling matrix

### 400
Likely causes:

- malformed JSON
- wrong `Content-Type`
- invalid parameters
- invalid OAuth `code`

Action:

- do not blindly retry
- log request shape safely
- validate payload builder

### 401
Likely causes:

- expired or invalid token
- wrong auth header

Action:

- refresh/reinstall flow if applicable
- verify shop/token lookup

### 403
Likely causes:

- missing scope
- wrong user role for install/runtime flow
- endpoint under wrong prefix

Action:

- compare required scope vs granted scope
- verify `com` vs `web`

### 404
Likely causes:

- wrong path
- stale resource ID
- resource deleted

Action:

- check endpoint construction
- mark local mapping stale if confirmed

### 429
Action:

- obey `Retry-After`
- back off queue for that shop
- record metrics

### 500 / 502
Action:

- retry with bounded exponential backoff for safe operations
- avoid infinite loops
- surface degraded status to operators

## 9. Logging and observability

Log at minimum:

- shop identifier
- resource family
- endpoint path
- method
- status code
- duration
- request id if exposed
- rate-limit header
- retry count

Redact:

- tokens
- customer PII when not needed
- raw payloads containing secrets

## 10. Testing approach

Before shipping a Haravan integration, validate:

- install flow with admin user
- runtime login flow with allowed and disallowed users
- one read endpoint works end-to-end
- one write endpoint works end-to-end
- 403 path for missing scope is intelligible
- 429 retry logic actually waits
- webhook GET verification handshake works
- webhook HMAC verification succeeds with raw body fixture
- webhook/event deduplication works
- incremental sync resumes after interruption
- webhook handler returns within Haravan's 5-second timeout budget

## 11. Common agent mistakes to avoid

- hardcoding the wrong base prefix
- forgetting `.json`
- assuming write without matching scope
- mixing short-lived login token with long-lived install token
- treating events as instant
- storing numeric/json metafield values without string conversion
- issuing uncontrolled parallel syncs per shop
- mapping stock at product level when the real unit is the variant
- using free-text province/district names where shipping APIs expect IDs
- pushing huge inventory adjustment payloads without chunking and retry strategy
