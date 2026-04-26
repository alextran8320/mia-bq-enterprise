# Resources and Endpoint Patterns

## Confidence summary

- **Documented by Haravan**: endpoint paths, scopes, listed parameters, resource properties, value/type constraints, documented enums and examples cited from reviewed docs
- **Inferred best practice**: integration notes about mapping strategy, sync posture, and client abstraction
- **Needs sandbox validation**: undocumented edge behavior, full payload coverage beyond reviewed examples, and conflicting inventory adjustment line-item support limits (`100` vs `200`)

## Endpoint prefixes

- Commerce/admin resources: `https://apis.haravan.com/com`
- Haraweb/storefront resources: `https://apis.haravan.com/web`

Use `.json` endpoints as shown in docs.

## Important resource families from the docs set reviewed

### Customers
Auth scopes:

- `com.read_customers`
- `com.write_customers`

Common endpoints:

- `GET /com/customers.json`
- `GET /com/customers/search.json`
- `GET /com/customers/count.json`
- `GET /com/customers/{customer_id}.json`
- `POST /com/customers.json`
- `PUT /com/customers/{customer_id}.json`
- `DELETE /com/customers/{customer_id}.json`
- `POST /com/customers/{customer_id}/tags.json`
- `DELETE /com/customers/{customer_id}/tags.json`
- `GET /com/customers/groups.json`

Useful query parameters shown in docs:

- `ids`
- `since_id`
- `created_at_min`
- `created_at_max`
- `updated_at_min`
- `updated_at_max`
- `limit`
- `page`
- `fields`

Important customer properties seen in docs:

- `id`
- `email`
- `phone`
- `first_name`
- `last_name`
- `addresses`
- `default_address`
- `tags`
- `state`
- `orders_count`
- `total_spent`
- `verified_email`
- `birthday`
- `gender`
- `last_order_date`

Integration notes:

- email and phone are treated as unique identifiers in practice according to docs wording
- customer account `state` is informative, not typically directly mutated through API
- `fields` is useful for thinner sync pulls

### Products
Auth scopes:

- `com.read_products`
- `com.write_products`

Common endpoints:

- `GET /com/products.json`
- `GET /com/products/count.json`
- `GET /com/products/{product_id}.json`
- `POST /com/products.json`
- `PUT /com/products/{product_id}.json`
- `DELETE /com/products/{product_id}.json`
- `POST /com/products/{product_id}/tags.json`
- `DELETE /com/products/{product_id}/tags.json`

Useful query parameters shown in docs:

- `ids`
- `limit`
- `page`
- `since_id`
- `vendor`
- `handle`
- `product_type`
- `collection_id`
- `sku`
- `barcode`
- `created_at_min`
- `created_at_max`
- `updated_at_min`
- `updated_at_max`
- `published_at_min`
- `published_at_max`
- `fields`

Important product properties seen in docs:

- `id`
- `title`
- `handle`
- `product_type`
- `vendor`
- `published_at`
- `published_scope` (`web`, `pos`, `global`)
- `tags`
- `template_suffix`
- `images`
- `variants`
- `options`
- `only_hide_from_list`
- `not_allow_promotion`

Integration notes:

- product payloads often embed variants and images
- use `fields` to reduce payload size for catalog syncs
- `published_scope` matters if the app must reason about online-store vs POS visibility
- product tags are comma-separated strings, not arrays, at the top-level resource

### Product variants
Auth scopes:

- `com.read_products`
- `com.write_products`

Common endpoints:

- `GET /com/products/{product_id}/variants.json`
- `GET /com/products/{product_id}/variants/count.json`
- `GET /com/variants/{variant_id}.json`
- `POST /com/products/{product_id}/variants.json`
- `PUT /com/variants/{variant_id}.json`
- `DELETE /com/products/{product_id}/variants/{variant_id}.json`

Key facts from docs:

- each product can have at most `100` variants
- variants expose `sku`, `barcode`, `price`, `compare_at_price`, `inventory_quantity`, `inventory_management`, `inventory_policy`, `requires_shipping`, `taxable`, `image_id`, and `option1..3`
- `inventory_management = haravan` indicates Haravan tracks inventory for that variant
- `inventory_policy` values include `deny` and `continue`

Integration notes:

- variants are the atomic unit for pricing and stock-sensitive integrations
- do not treat product-level stock as authoritative when variant-level inventory exists
- for ERP sync, map your external SKU primarily to variant SKU, not product title

### Orders
Auth scopes:

- `com.read_orders`
- `com.write_orders`

Reviewed docs clearly show order payload richness including:

- `billing_address`
- `shipping_address`
- `customer`
- `line_items`
- `transactions`
- `financial_status`
- `fulfillment_status`
- `gateway`
- totals and timestamps

Common usage pattern:

- list orders
- fetch detail
- inspect transactions and fulfillment state
- attach order metafields if needed

When building against orders, expect nested objects and large payloads. Thin them using query params or post-processing where possible.

### Transactions
Auth scopes:

- `com.read_orders`
- `com.write_orders`

Common endpoints:

- `GET /com/orders/{order_id}/transactions.json`
- `GET /com/orders/{order_id}/transactions/{transaction_id}.json`
- `POST /com/orders/{order_id}/transactions.json`

Important transaction properties:

- `amount`
- `authorization`
- `gateway`
- `kind`
- `status`
- `currency`
- `parent_id`
- `external_transaction_id`
- `is_cod_gateway`

Documented transaction kinds include:

- `Pending`
- `Authorization`
- `Sale`
- `Capture`
- `Void`
- `Refund`

Integration notes:

- treat order payment state as a sequence of transactions, not one flat field
- use transaction history when reconciling COD, capture, or refund workflows
- `parent_id` is useful for linking captures/refunds to earlier payment steps

### Metafields
Metafields are an extension mechanism for many resource types.

Supported owner examples from docs:

- shop
- product
- product_image
- product_variant
- order
- customer
- collection
- page
- blog
- article

Common endpoints:

- `GET /com/metafields.json`
- `GET /com/metafields/count.json`
- `GET /com/metafields/{id}.json`
- `POST /com/metafields.json`
- `PUT /com/metafields/{id}.json`
- `DELETE /com/metafields/{id}.json`
- nested variants like `/com/products/{id}/metafields.json`

Required metafield fields per docs:

- `key`
- `namespace`
- `value`
- `value_type`

Optional:

- `description`

Value types documented:

- `string`
- `integer`
- `json`

Critical nuance:

Even when the semantic type is integer or json, the docs state `value` is entered and stored as a **string** via API.

Practical guidance:

- always stringify outbound metafield values
- validate `namespace` and `key` length constraints
- keep app-owned namespace stable, such as `myapp`, `myapp_sync`, `erp_bridge`

### Inventory adjustments
Auth scopes:

- `com.read_inventories`
- `com.write_inventories`

Common endpoints:

- `GET /com/inventories/adjustments.json`
- `GET /com/inventories/adjustments/count.json`
- `GET /com/inventories/adjustments/{adjustment_id}.json`
- `POST /com/inventories/adjustorset.json`

Important properties:

- `adjust_number`
- `tran_date`
- `location_id`
- `type`
- `reason`
- `total_quantity`
- `total_cost`
- `note`
- `tags`
- `line_items`

Documented `type` values:

- `adjust` → add delta to existing quantity
- `set` → overwrite quantity

Documented `reason` values include:

- `newproduct`
- `returned`
- `productionofgoods`
- `damaged`
- `shrinkage`
- `promotion`
- `transfer`

Line-item behavior from docs:

- line items include `product_id`, `product_variant_id`, `quantity`, `cost_amount`, `sku`, `barcode`
- the docs mention best support around `200` items per request in one section and `100` items in the create example; treat this as a signal to keep requests well below the upper bound unless validated empirically

Integration notes:

- prefer `set` for authoritative full-stock syncs from ERP/WMS
- prefer `adjust` for delta-based operational corrections
- include `location_id`; inventory is location-sensitive
- avoid giant stock writes in one burst because inventory sync is the easiest way to hit rate limits

### Shipping rates
Auth scopes documented:

- `com.read_orders`
- `com.write_orders`

Common endpoint:

- `GET /com/shipping_rates.json?country_id={country_id}&province_id={province_id}&district_id={district_id}`

Additional query parameters shown in docs:

- `total_price`
- `total_weight`

Returned fields are minimal:

- `id`
- `title`
- `price`

Integration notes:

- shipping-rate lookup depends on geography IDs, not free-text names
- upstream callers may need separate country/province/district resolution before quote lookup
- use this API as a quote/lookup primitive, not as a full shipping-order lifecycle API

### Events
Events provide an activity log, not guaranteed realtime delivery.

Common endpoints:

- `GET /com/events.json`
- `GET /com/events/{event_id}.json`
- `GET /com/events/count.json`
- nested forms such as `/com/orders/{order_id}/events.json`

Important event properties:

- `id`
- `subject_id`
- `subject_type`
- `verb`
- `message`
- `description`
- `created_at`
- `path`

Docs caution:

- events may lag by seconds
- rare cases can lag by minutes
- should not be treated as strict realtime signaling

Use events for:

- audit/history views
- low-frequency reconciliation
- debugging resource lifecycle

Do **not** use events as a hard realtime substitute for webhooks if the product needs immediate reaction.

## Query/pagination pattern

Across reviewed Haravan resources, common patterns recur:

- `page`
- `limit`
- `since_id`
- date-window filtering
- `fields`
- sometimes search endpoints for indexed lookup

This suggests a reusable list helper can support most resources.

## Reusable client abstraction

A practical shape:

```ts
interface HaravanClient {
  get<T>(path: string, query?: Record<string, string | number | boolean>): Promise<T>;
  post<T>(path: string, body: unknown): Promise<T>;
  put<T>(path: string, body: unknown): Promise<T>;
  delete<T>(path: string, query?: Record<string, string | number | boolean>): Promise<T>;
}
```

Then layer resource modules:

- `customers.list()`
- `customers.get(id)`
- `orders.list()`
- `metafields.upsertProductMetafield(productId, input)`
- `events.listSince(cursor)`

## Safe assumptions

- List endpoints often default to `50` items; do not assume unbounded return sizes.
- Nested response envelopes are common, e.g. `{ customers: [...] }`, `{ metafield: {...} }`.
- Response bodies can be large for orders/customers; avoid fetching everything at once.
