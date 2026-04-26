# Auth and Scopes

## Confidence summary

- **Documented by Haravan**: scope families, naming patterns, install/login scope composition, shop info endpoints, two install options
- **Inferred best practice**: production preference for option 2, suggested auth modules, persistence model
- **Needs sandbox validation**: exact role/user claim shapes inside decoded `id_token`, edge-case user authorization behavior in a specific app configuration

## Scope families

Haravan documents these scope groups.

### 1. Haraweb scopes
Used for storefront-side APIs under `https://apis.haravan.com/web`.

Naming pattern:

- `web.read_<resource>`
- `web.write_<resource>`

Examples from docs:

- `web.read_contents`
- `web.write_contents`
- `web.read_themes`
- `web.write_themes`
- `web.read_script_tags`
- `web.write_script_tags`

Write scope includes read capability.

### 2. Commerce scopes
Used for admin/commerce APIs under `https://apis.haravan.com/com`.

Naming pattern:

- `com.read_<resource>`
- `com.write_<resource>`

Examples from docs:

- `com.read_products`
- `com.write_products`
- `com.read_customers`
- `com.write_customers`
- `com.read_orders`
- `com.write_orders`
- `com.read_inventories`
- `com.write_inventories`
- `com.read_shippings`
- `com.write_shippings`

### 3. Webhook scope
- `wh_api`

Required when using webhooks for the application.
Docs note this is only usable by the shop owner/admin role and requires webhook registration in the partner app configuration.

### 4. Login scopes
Used to log in and obtain user/shop context:

- `openid`
- `profile`
- `email`
- `org`
- `userinfo`

### 5. Install scopes
Install requires the login scopes plus:

- `grant_service`

The docs say `grant_service` is used by the shop owner/admin to:

- get a long-lived access token
- install the application on the seller application list

Install scope set may also include selected haraweb/commerce scopes and optional webhook scope.

## Recommended install model

Haravan documents two approaches.

### Option 1: login scopes only during install
Characteristics:

- one authorization call
- yields a short-lived user access token
- app usable only by users who install it
- does not appear in seller app list
- cannot use webhook

This is simpler, but weaker for production app distribution.

### Option 2: login + install scopes (recommended by Haravan)
Characteristics:

- first authorize with login scope to get `id_token`
- decode JWT to inspect user info, role, and shop info
- verify the user is shop owner/admin
- then authorize with install scopes
- exchange code for a long-lived access token
- app appears in seller app list
- supports stronger lifecycle and webhook usage

For production partner apps, prefer **Option 2** unless the user explicitly wants a lightweight internal tool flow.

## Runtime authorization after install

Haravan distinguishes installation from later app usage.

Recommended runtime pattern:

1. Before launching app functionality, authorize with login scopes.
2. Decode `id_token`.
3. Verify the current user is allowed to use the app.
4. Check both seller-side permission and app-side authorization rules.

The docs describe cases where a user may:

- lack seller permission for the app scopes
- have seller permission but not your app’s internal authorization
- lack scope permission but still be allowed by app-side policy depending on your design

Coding implication: app session auth and Haravan install auth should be modeled separately.

## Shop information after install

Haravan docs list these shop info endpoints:

- `GET https://apis.haravan.com/web/shop.json` for haraweb-only apps
- `GET https://apis.haravan.com/com/shop.json` for commerce-only apps
- if both scope families are used, either endpoint can be used

## Practical implementation pattern

### Minimal data you should store per shop

- shop/org identifier from Haravan login/install flow
- shop domain or canonical identifier if available in your app flow
- granted scopes
- token type and expiry metadata if present
- long-lived access token
- installing user/admin info
- webhook enabled flag
- install timestamp
- last successful API call timestamp

### Suggested auth modules

- `buildAuthorizeUrl(scopes, state, redirectUri)`
- `exchangeCodeForToken(code)`
- `decodeIdToken(idToken)`
- `validateShopAdminRole(claims)`
- `loadInstalledShop(shopId)`
- `assertGrantedScope(shop, requiredScope)`

### Scope planning examples

#### Read-only product sync
- `openid profile email org userinfo`
- `grant_service`
- `com.read_products`

#### Order management app
- login/install scopes above
- `com.read_orders`
- `com.write_orders`
- maybe `com.read_customers`
- maybe `com.read_products`

#### Content/theme extension
- login/install scopes above
- `web.read_themes`
- `web.write_themes`
- maybe `web.read_script_tags`
- maybe `web.write_script_tags`

#### Webhook-driven order ingestion
- login/install scopes above
- `grant_service`
- `wh_api`
- `com.read_orders`
- optionally `com.read_customers`
- optionally `com.read_products`

## Cautions

- Do not assume non-admin users can complete install flows requiring `grant_service` or webhook scope.
- Do not mix short-lived user tokens and long-lived app/shop tokens without clear naming.
- Do not defer scope validation until after requests fail in production; validate early.
- If you are debugging `403`, check granted scope first, then role, then endpoint prefix.
