# Webhooks

## Confidence summary

- **Documented by Haravan**: HTTPS-only delivery, verify-token GET handshake, subscribe/list/unsubscribe endpoints, HMAC header and formula, 5-second timeout, retry/delete behavior, example topics shown in docs
- **Inferred best practice**: queue-first processing, durable receipt before `200`, idempotency store design, reconciliation workflow
- **Needs sandbox validation**: exact payload schemas for each topic beyond fields explicitly mentioned (`org_id`, `topic`), any undocumented topic names relied on by your app

## Purpose

This reference covers Haravan webhook setup, subscription lifecycle, callback verification, HMAC authentication, delivery behavior, retries, and resilient handler design.

## Core facts from Haravan docs

- Webhooks notify your app about shop events.
- Notification payloads are JSON.
- Haravan supports **HTTPS only** for webhook delivery.
- Webhook use requires the `wh_api` scope.
- Subscriptions are tied to the installed app state; after uninstall/reinstall, you need to subscribe again.

## Webhook lifecycle

Haravan’s webhook flow has three distinct phases.

### 1. Callback URL verification during webhook registration

When you configure the webhook callback URL in the partner app settings, Haravan performs a verification request:

```http
GET {YOUR_CALLBACK_URL}?hub.mode=subscribe&hub.verify_token={Verify_Token}&hub.challenge={Challenge}
```

Your app must:

1. compare `hub.verify_token` against the verify token configured in your app
2. if it does not match, return `401`
3. if it matches, return `200` with the raw `hub.challenge` value

This is a registration handshake, not an event delivery.

### 2. Subscription activation via API

After you have an access token with the right scopes, call:

- `POST https://webhook.haravan.com/api/subscribe`

Headers:

- `Content-Type: application/json`
- `Authorization: Bearer {Token}`

The docs show an empty JSON body `{}`.

Success response example:

```json
{
  "error": false,
  "message": "Đăng ký webhook thành công."
}
```

You can also:

- list subscriptions: `GET https://webhook.haravan.com/api/subscribe`
- unsubscribe: `DELETE https://webhook.haravan.com/api/subscribe`

### 3. Event delivery to your callback URL

After successful subscription, Haravan sends webhook notifications as `POST` requests to your callback URL.

The docs explicitly call out these useful fields:

- `org_id` → identifies which shop sent the event
- `topic` → identifies which event occurred

Example events shown in the docs response include:

- `app/uninstalled`
- `products/update`
- `shop/update`
- docs text also mentions `user/update`

For topic-catalog safety and mapping against Events API verbs, also read `webhook-topics.md`.

## Authentication of webhook deliveries

Haravan documents an HMAC-based verification scheme.

### Header used

- `X-Haravan-Hmacsha256`

### Verification algorithm

1. read the **raw request body bytes** exactly as received
2. compute `HMAC-SHA256(raw_body, client_secret)`
3. base64-encode the resulting digest
4. compare the result to `X-Haravan-Hmacsha256`
5. if mismatch, return `401`
6. if match, continue processing and return `200`

The docs give the formula in PHP:

```php
$calculated_hmac = base64_encode(hash_hmac('sha256', $data, CLIENT_SECRET, true));
```

## Critical implementation rule: use raw body

Do **not** verify against re-serialized JSON.

Use the exact raw payload bytes from the HTTP request body. If your framework parses JSON before you capture the raw body and then you stringify it again, HMAC verification may fail.

## Delivery semantics

Haravan docs state:

- your app acknowledges receipt by returning `200 OK`
- any response outside the `200` range counts as failure
- `3xx` redirects are treated as failures
- Haravan does **not** follow redirects
- Haravan waits up to **5 seconds** for a response
- on failure or timeout, Haravan retries **19 times over the next 48 hours**
- after **19 consecutive failures**, the webhook subscription is automatically deleted
- warning is sent to the app’s emergency developer email address

## Design consequences

- respond quickly
- do not block on heavy downstream work
- do not rely on redirects
- do not assume webhook subscription lasts forever; monitor and re-establish if needed

## Recommended handler architecture

### Phase A: verification endpoint

Handle registration GET requests separately from event POST requests.

#### GET verify flow

- check `hub.mode == subscribe`
- compare `hub.verify_token`
- return challenge on success
- return 401 on mismatch

#### POST event flow

- capture raw body
- verify `X-Haravan-Hmacsha256`
- parse JSON only after HMAC passes
- extract `org_id`, `topic`, event payload
- record delivery idempotently
- enqueue async processing
- return `200` fast

## Idempotency strategy

Haravan retries failed deliveries. Your app must be idempotent even if the same notification arrives multiple times.

Recommended approach:

- hash the raw body plus topic/org_id or use a provided event identifier if present
- store a delivery record keyed by dedupe identifier
- if duplicate, short-circuit processing but still return `200`
- keep a processed timestamp and status

Example storage fields:

- `shop_org_id`
- `topic`
- `delivery_hash`
- `received_at`
- `verified`
- `processed_at`
- `processing_status`
- `raw_payload`

## Queue-first processing pattern

Because Haravan times out after 5 seconds, use this shape:

1. receive request
2. verify HMAC
3. persist delivery
4. enqueue background job
5. return `200`
6. do heavy processing async

Heavy processing includes:

- syncing order/product/customer details
- calling other APIs
- database fan-out
- ERP/CRM propagation
- expensive transformations

## Fallback and reconciliation

Webhook systems fail in the real world. Haravan also provides Events, but Events are not guaranteed realtime.

Recommended pattern:

- use webhooks for near-realtime triggers
- use Events for reconciliation and gap-filling
- if webhook downtime occurs, replay recent changes via Events and direct resource fetches

Good recovery workflow:

1. detect handler downtime or repeated failures
2. restore endpoint
3. check current webhook subscription state with `GET /api/subscribe`
4. re-subscribe if needed
5. replay recent changes by polling Events or resource windows
6. dedupe against already-processed deliveries

## Subscription management

### Subscribe

```http
POST https://webhook.haravan.com/api/subscribe
Authorization: Bearer {Token}
Content-Type: application/json

{}
```

### List subscribed webhook events

```http
GET https://webhook.haravan.com/api/subscribe
Authorization: Bearer {Token}
Content-Type: application/json
```

Docs show response records shaped like:

```json
{
  "id": "612849678226d51c00dcade2",
  "event": "products/update",
  "url": "https://example.ngrok.io/webhooks"
}
```

### Unsubscribe

```http
DELETE https://webhook.haravan.com/api/subscribe
Authorization: Bearer {Token}
Content-Type: application/json
```

## Operational cautions

- local development with ngrok is acceptable for testing, but ngrok URLs expire; update configuration when they rotate
- remove stale ngrok tunnels to avoid spam deliveries
- after reinstalling the app, call subscribe again
- monitor 401 and 5xx responses closely because repeated failures can silently kill subscriptions

## Framework notes

### Express / Node.js

Use raw-body capture middleware for the webhook route. Do not attach standard JSON parsing before signature verification unless you preserve the raw body yourself.

### Fastify / Nest / Next.js

Use framework-specific raw-body access on the webhook route.

### Python / Flask / FastAPI

Read `request.data` / raw bytes before JSON parsing.

## Suggested response policy

- invalid verify token → `401`
- invalid HMAC → `401`
- valid delivery, queued successfully → `200`
- valid delivery but duplicate → `200`
- temporary internal issue after verification but before durable persistence → prefer failing with non-200 only if you want Haravan to retry

This is a tradeoff:

- return `200` only after you have durably recorded the event, or
- fail fast to trigger retry if durable recording is unavailable

## Test checklist

- GET verification handshake returns challenge correctly
- HMAC verification passes with known-good fixture
- HMAC verification fails on mutated payload
- webhook route returns `200` within 5 seconds
- duplicate payload does not cause duplicate side effects
- redirect responses are never used
- subscription list endpoint reflects expected events
- reinstall flow re-subscribes automatically

## Agent guidance

When implementing Haravan webhooks, always produce:

1. verification GET handler
2. HMAC verification utility using raw body
3. POST webhook endpoint
4. idempotent delivery store
5. async job dispatch after durable receipt
6. subscription bootstrap/check logic
7. reconciliation fallback plan using Events
