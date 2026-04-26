# Examples

## Example 1: Scope planning for an order sync app

Goal:

- install app on merchant shop
- read orders
- read customers tied to orders
- receive webhook-driven updates

Suggested scope set:

- `openid`
- `profile`
- `email`
- `org`
- `userinfo`
- `grant_service`
- `wh_api`
- `com.read_orders`
- `com.read_customers`

Notes:

- Use install flow with admin/shop owner.
- Persist long-lived token after code exchange.
- Register webhook-capable app config in partner dashboard.

## Example 2: Read customers updated since a cursor

Request pattern:

```http
GET https://apis.haravan.com/com/customers.json?updated_at_min=2026-04-20T00:00:00Z&limit=50&page=1
```

Expected response envelope:

```json
{
  "customers": [
    {
      "id": 1037889951,
      "email": "customer@example.com",
      "first_name": "Haravan",
      "last_name": "Demo"
    }
  ]
}
```

Agent guidance:

- paginate until empty or until fewer than `limit` results are returned
- advance cursor only after successful page processing

## Example 3: Create a shop-level metafield

Request shape:

```http
POST https://apis.haravan.com/com/metafields.json
Content-Type: application/json
```

```json
{
  "metafield": {
    "namespace": "myapp",
    "key": "external_system_id",
    "value": "erp-12345",
    "value_type": "string"
  }
}
```

## Example 4: Create a product metafield with JSON semantic content

Even when storing JSON semantics, send the value as a string.

```json
{
  "metafield": {
    "namespace": "myapp_sync",
    "key": "pricing_rules",
    "value": "{\"tier\":\"vip\",\"discount\":10}",
    "value_type": "json"
  }
}
```

## Example 5: Product and variant sync strategy

```text
1. Pull products with updated_at_min window.
2. For each product, treat embedded variants as the stock/pricing units.
3. Map external catalog item -> product, external SKU -> variant.
4. If inventory is authoritative from ERP, issue inventory `set` writes by variant/location.
5. If inventory is operational and event-driven, issue smaller `adjust` writes.
```

## Example 6: Shipping-rate lookup

```http
GET https://apis.haravan.com/com/shipping_rates.json?country_id=241&province_id=50&district_id=478&total_price=500000&total_weight=1200
Authorization: Bearer {Token}
```

Use ID-based geography resolution before this step.

## Example 7: Rate-limit aware pseudocode

```ts
async function haravanRequestWithRetry(doRequest: () => Promise<Response>) {
  for (let attempt = 0; attempt < 5; attempt++) {
    const res = await doRequest();
    if (res.status !== 429) return res;

    const retryAfter = Number(res.headers.get("Retry-After") ?? "1");
    await sleep((retryAfter * 1000) + jitterMs(150));
  }
  throw new Error("Haravan API kept returning 429");
}
```

## Example 8: Client wrapper sketch

```ts
class HaravanClient {
  constructor(
    private readonly baseUrl: string,
    private readonly accessToken: string,
  ) {}

  async request<T>(method: string, path: string, body?: unknown): Promise<T> {
    const res = await fetch(`${this.baseUrl}${path}`, {
      method,
      headers: {
        "Authorization": `Bearer ${this.accessToken}`,
        "Content-Type": "application/json",
      },
      body: body ? JSON.stringify(body) : undefined,
    });

    if (!res.ok) {
      const text = await res.text();
      throw new Error(`Haravan ${method} ${path} failed: ${res.status} ${text}`);
    }

    return res.json() as Promise<T>;
  }
}
```

Adjust the auth header format to the exact requirements of the user’s app stack and current Haravan auth guidance if broader docs specify a particular header convention.

## Example 9: Installation flow sketch

```text
1. Redirect merchant user to Haravan authorize URL with login scopes.
2. Receive code and id_token.
3. Decode id_token and verify org/shop and admin role.
4. Redirect again with install scopes including grant_service and optional wh_api.
5. Exchange code for long-lived token.
6. Save shop installation record.
7. Fetch /com/shop.json to confirm connectivity.
```

## Example 10: Webhook verification handshake

```ts
app.get('/webhooks', (req, res) => {
  const mode = req.query['hub.mode'];
  const token = req.query['hub.verify_token'];
  const challenge = req.query['hub.challenge'];

  if (mode !== 'subscribe') return res.sendStatus(400);
  if (token !== process.env.HARAVAN_WEBHOOK_VERIFY_TOKEN) return res.sendStatus(401);

  res.status(200).send(String(challenge ?? ''));
});
```

## Example 11: HMAC verification with raw body

```ts
import crypto from 'node:crypto';

function verifyHaravanWebhook(rawBody: Buffer, headerValue: string | undefined, clientSecret: string) {
  if (!headerValue) return false;
  const digest = crypto
    .createHmac('sha256', clientSecret)
    .update(rawBody)
    .digest('base64');
  return crypto.timingSafeEqual(Buffer.from(digest), Buffer.from(headerValue));
}
```

## Example 12: Event reconciliation job

Use when webhook delivery may be incomplete.

```text
1. Store last event id or created_at cursor.
2. Poll /com/events.json with filters and windowing.
3. Ignore events older than already-processed cursors.
4. For relevant subject types, fetch full resource if needed.
5. Record processed event ids for dedupe.
```
