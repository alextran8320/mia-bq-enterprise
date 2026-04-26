# App Setup and Install Flow

## Confidence summary

- **Documented by Haravan**: partner app creation, authorize endpoint, token endpoint, bearer auth, example token response fields
- **Inferred best practice**: adding `state`, separating install auth from runtime session auth, persistence checklist, connectivity tests
- **Needs sandbox validation**: exact runtime placement/availability of `id_token` in the current Haravan flow, any refresh-token behavior your app depends on

## Purpose

This reference focuses on creating a Haravan app, preparing install/login flow, exchanging authorization codes for tokens, and validating the app can make authenticated API calls.

## Partner-side setup

From the Haravan getting-started docs reviewed:

1. Register a Partner account.
2. Create a development store.
3. In the Partner Dashboard, create an app.
4. Configure at least one allowed redirect URL.
5. Select the data access scopes the app needs.
6. Record the app's `client_id` and `client_secret`.

Example redirect URL shown in docs:

- `http://localhost:3000/callback`

## Authorization URL pattern

The reviewed docs show this authorize base:

- `https://accounts.haravan.com/connect/authorize`

Example pattern:

```text
https://accounts.haravan.com/connect/authorize
  ?response_mode=query
  &response_type=code
  &scope=openid org profile userinfo com.write_products com.read_products grant_service
  &client_id=YOUR_CLIENT_ID
  &redirect_uri=http://localhost:3000/callback
```

Practical guidance:

- add a CSRF-safe `state` parameter even if the simple example omits it
- URL-encode `redirect_uri` and scope values correctly
- keep scope generation deterministic so debugging is tractable

## Token exchange

The docs show this token endpoint:

- `POST https://accounts.haravan.com/connect/token`

With form-encoded body fields:

- `grant_type=authorization_code`
- `client_id=...`
- `client_secret=...`
- `code=...`
- `redirect_uri=...`

Example response fields shown:

- `id_token`
- `access_token`
- `expires_in`
- `token_type`
- `scope`
- optional `refresh_token`

The docs explicitly state the returned `access_token` is the token used for API calls.

### Note on `id_token`

The reviewed Haravan docs describe login/install flow in two nearby ways:

- the create-app guide clearly shows `id_token` in the **token exchange response**
- the access-scopes guide discusses using login flow to obtain and decode `id_token` during authorization/login handling

For implementation safety, treat `id_token` as part of the login/install token set and confirm the exact step in the current Haravan flow you are implementing.

## Auth header for API requests

The reviewed docs show Bearer auth:

```http
Authorization: Bearer {Token}
```

Combined with JSON requests such as:

```http
GET https://apis.haravan.com/com/products.json
Content-Type: application/json
Authorization: Bearer {Token}
```

## Recommended production flow

### Install/connect flow

1. User clicks connect/install.
2. Redirect to Haravan authorize URL with login scopes.
3. Receive the authorization `code` from the redirect.
4. Exchange the code for the token set used by your flow.
5. Read and decode `id_token` from the login/install token set when available.
6. If app requires admin/shop-owner install, verify role.
7. Redirect for install scopes including `grant_service` and optional `wh_api`.
8. Exchange code for long-lived install token.
9. Persist installation.
10. Call `/com/shop.json` or `/web/shop.json` to confirm the token works.

### Runtime app session flow

1. User opens app.
2. App obtains fresh login authorization context.
3. App verifies user access separately from stored shop installation.
4. App resolves shop record and uses stored access token for Haravan resource calls.

This separation keeps user session identity and shop API access from becoming entangled.

## Minimal persistence model

Store at least:

- `shop_id` or `org_id`
- `client_id` reference / app identity
- granted scopes
- access token
- token type
- expires_at if applicable
- refresh token if ever provided
- installer user id / role snapshot
- install status
- created_at / updated_at

## Validation checklist after install

- token exchange succeeds
- `Authorization: Bearer ...` works
- one read endpoint succeeds, e.g. `/com/products.json`
- granted scopes match expectation
- app can identify the shop consistently
- webhook scope and partner config are aligned if webhooks are needed

## Failure analysis

### Invalid code during token exchange
Likely symptom:

- `400 Bad Request`

Check:

- code reused or expired
- redirect URI mismatch
- wrong client credentials
- form encoding mistake

### Auth works but API returns 403
Check:

- scope was requested during install
- scope was actually granted
- endpoint is under the correct prefix
- current business flow needs `com.*` or `web.*`

### Token works for one shop but data appears wrong
Check:

- shop installation record lookup
- tenant isolation bugs
- stale token mapped to wrong shop

## Agent guidance

When building app bootstrap code:

- centralize authorize URL generation
- centralize token exchange
- decode and validate `id_token` in one module
- persist granted scopes exactly as returned
- create a post-install connectivity test
- never scatter `client_secret` handling across the codebase
