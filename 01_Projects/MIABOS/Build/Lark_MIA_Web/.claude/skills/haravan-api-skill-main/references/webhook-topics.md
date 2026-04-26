# Webhook Topics and Event Mapping

## Confidence summary

- **Documented by Haravan**: `app/uninstalled`, `products/update`, `shop/update`, and prose example `user/update`; Events API subject types and verb catalog
- **Inferred best practice**: maintaining an observed topic catalog from live traffic, using Events as naming intuition only
- **Needs sandbox validation**: any webhook topic outside the explicitly documented set

## Purpose

This reference separates **documented webhook topics** from **Events API verbs** so coding agents do not confuse the two.

Haravan’s webhook tutorial does not publish a full topic catalog in the material reviewed. Therefore, this file distinguishes:

- topics explicitly shown in docs
- topics mentioned as examples in docs text
- event verbs available from the Events API
- inferred mappings that should be validated in a sandbox before production dependence

## What is explicitly documented as webhook topic data

The webhook docs state that webhook deliveries include:

- `org_id` → identifies the shop
- `topic` → identifies which event occurred

## Webhook topics explicitly shown in docs

These are directly visible in the webhook subscription/list examples or prose.

### Confirmed by docs examples

- `app/uninstalled`
- `products/update`
- `shop/update`

### Mentioned in prose example

- `user/update`

Use the four topics above as **documented-known** values.

## Important caution

Do not assume the full webhook topic catalog equals the Events API verb catalog.

The reviewed docs do **not** provide an authoritative list of every webhook topic. Coding agents should avoid inventing unsupported subscriptions from the Events API alone.

If a task depends on a specific webhook topic not listed above, the safe workflow is:

1. check partner dashboard / webhook UI for available topics
2. inspect `GET https://webhook.haravan.com/api/subscribe` after configuring subscriptions
3. validate against a development store by triggering the event
4. log observed `topic` values from real webhook deliveries

## Events API verb catalog

The Events API is not a webhook catalog, but it is useful for fallback, reconciliation, and naming intuition.

### Subject types documented in Events API

- `Article`
- `Blog`
- `Collection`
- `Comment`
- `Order`
- `Page`
- `Product`

### Product event verbs

- `create`
- `destroy`
- `published`
- `unpublished`
- `update`

### Order event verbs

- `authorization_failure`
- `authorization_pending`
- `authorization_success`
- `cancelled`
- `capture_failure`
- `capture_pending`
- `capture_success`
- `closed`
- `confirmed`
- `fulfillment_cancelled`
- `fulfillment_pending`
- `fulfillment_success`
- `mail_sent`
- `placed`
- `re_opened`
- `refund_failure`
- `refund_pending`
- `refund_success`
- `restock_line_items`
- `sale_failure`
- `sale_pending`
- `sale_success`
- `update`
- `void_failure`
- `void_pending`
- `void_success`

### Article event verbs

- `create`
- `destroy`
- `published`
- `unpublished`
- `update`

### Blog event verbs

- `create`
- `destroy`
- `update`

### Collection event verbs

- `create`
- `destroy`
- `published`
- `unpublished`
- `update`

### Page event verbs

- `create`
- `destroy`
- `published`
- `unpublished`
- `update`

### Comment event verbs

- `create`

## How to use Events API for webhook fallback

When webhook coverage is uncertain:

1. subscribe to the documented webhook topics you know you need
2. treat webhooks as triggers
3. use Events API to reconcile missed mutations
4. fetch canonical resource state after relevant events

## Suggested mapping strategy for agents

### Level 1: documented-safe

Use directly documented webhook topics when building examples, tests, or production defaults:

- `app/uninstalled`
- `products/update`
- `shop/update`
- `user/update` (doc prose example; still validate in your environment)

### Level 2: inferred-but-unverified

If a user asks for a broader event-driven architecture, you may propose likely topic families conceptually, but you should clearly label them as **to be validated against Haravan UI or real webhook traffic**.

Examples of conceptual families only:

- product lifecycle topics
- order lifecycle topics
- shop/account lifecycle topics

Do not hardcode unverified topic strings as production truth.

## Practical observability recommendation

For each webhook delivery, log:

- `org_id`
- `topic`
- delivery timestamp
- HMAC verification result
- dedupe key

Then maintain a living catalog in your application docs or database from observed real-world traffic.

## Agent rules

- Never conflate Events API verbs with guaranteed webhook topic names.
- Prefer explicitly documented webhook topics first.
- If the required topic is undocumented, say so plainly.
- For production builds, include a discovery/validation step for topic names.
