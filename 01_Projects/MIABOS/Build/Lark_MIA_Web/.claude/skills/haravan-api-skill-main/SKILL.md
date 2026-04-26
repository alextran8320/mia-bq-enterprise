---
name: haravan-api
description: Integrate with Haravan Omni APIs for app installation, OAuth/token exchange, scope planning, shop data sync, and webhook-capable commerce integrations. Use when building or debugging Haravan integrations for products, orders, customers, inventory, shipping, metafields, events, or app install/login flows. Covers Haravan REST API base URLs, required scopes, rate limiting, error handling, and safe implementation patterns so coding agents can build working connectors and backends.
---

# Haravan API

Use this skill when the task involves integrating an app or backend with Haravan Omni APIs.

## What this skill helps with

- Planning Haravan app install/login flow
- Choosing scopes for commerce, haraweb, install, login, and webhook access
- Implementing REST calls against Haravan API domains
- Syncing products, variants, customers, orders, inventory, shipping, transactions, and metafields
- Designing webhook/event-driven integrations
- Implementing verified webhook handlers, subscription lifecycle, and replay-safe processing
- Handling rate limits, auth failures, and common API mistakes

## First principles

1. Haravan has **two main REST API prefixes**:
   - `https://apis.haravan.com/com` for commerce/admin data
   - `https://apis.haravan.com/web` for storefront/haraweb data
2. Access is controlled by **scopes**, and write scopes include read.
3. Most app integrations should treat Haravan as a **shop-scoped OAuth integration**.
4. Installation flow and runtime login flow are related but not identical.
5. Respect rate limits from the start; do not build bursty per-record loops.

## Workflow

1. Identify the business flow:
   - install app
   - interactive in-admin app usage
   - background sync
   - webhook/event processing
   - one-way or two-way data sync
2. Choose the resource family and API prefix.
3. Read `references/overview.md`.
4. If the task touches auth/install, read `references/auth-and-scopes.md`.
5. If the task touches concrete resources, read `references/resources.md`.
6. If the task touches install/create-app flow, also read `references/app-setup.md`.
7. If the task touches webhook registration or delivery handling, also read `references/webhooks.md`.
8. If the task writes production code, also read `references/implementation-patterns.md`.
9. Implement the smallest working integration first, then expand.

## Selection guide

- **Need install/login/OAuth** → read `references/auth-and-scopes.md`
- **Need endpoints and object patterns** → read `references/resources.md`
- **Need install dashboard/token exchange specifics** → read `references/app-setup.md`
- **Need webhook verification/subscription/retry behavior** → read `references/webhooks.md`
- **Need webhook topic catalog vs Events mapping** → read `references/webhook-topics.md`
- **Need resilient client architecture** → read `references/implementation-patterns.md`
- **Need quick examples/snippets** → read `references/examples.md`

## Confidence labels

Use these labels when reading this skill and its references:

- **Documented by Haravan** → directly supported by the reviewed Haravan docs
- **Inferred best practice** → engineering guidance derived from the docs, but not stated verbatim
- **Needs sandbox validation** → plausible or partially documented behavior that should be verified on a dev store before production dependence

## Rules for coding agents

- Never invent endpoints; derive them from Haravan docs and the resource prefix pattern.
- Prefer a thin Haravan client wrapper plus resource-specific methods.
- Keep token handling centralized.
- Capture response headers for rate-limit visibility.
- Serialize large write bursts and honor `429 Retry-After`.
- For destructive actions, confirm the exact endpoint and payload shape before coding.
- For webhooks/events, design idempotent handlers.
- Separate webhook registration handshake (GET) from event delivery handling (POST).
- Verify webhook HMAC against the raw request body, never re-serialized JSON.
- Return `200` fast after durable receipt; do heavy work asynchronously.
- Store external IDs and sync cursors explicitly.

## Output expectations

When asked to build a Haravan integration, produce:

1. Scope plan
2. Auth/install flow summary
3. Endpoint map
4. Data model mapping
5. Error/rate-limit handling plan
6. Implementation code or patch
7. Test checklist

## References

- `references/overview.md`
- `references/auth-and-scopes.md`
- `references/resources.md`
- `references/app-setup.md`
- `references/webhooks.md`
- `references/webhook-topics.md`
- `references/implementation-patterns.md`
- `references/examples.md`
