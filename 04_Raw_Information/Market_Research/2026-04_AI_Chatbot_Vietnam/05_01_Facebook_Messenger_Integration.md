# Facebook Messenger Integration Research

**Document Type**: Channel Integration Research  
**Channel**: Facebook Messenger  
**Research Date**: 2026-04-07  
**Prepared By**: A03 Business Analyst Agent (Codex CLI)  
**Status**: Draft  
**Primary Use**: MIABOS omnichannel inbox, AI reply, comment-to-DM follow-up

---

## 1. Executive Summary

Facebook Messenger is a strong fit for MIABOS as a core official integration channel.

The reviewed Meta materials show a stable API-first model:

- Page-based onboarding
- Graph API send endpoints
- Page access tokens
- inbound webhook events
- conversation ownership / moderation support
- platform rules such as the 24-hour messaging window

This is sufficient for a proper unified inbox adapter.

---

## 2. Official Integration Surface

The public Meta Messenger Platform materials reviewed indicate that integration is centered on:

- a Facebook Page
- a Meta app with `pages_messaging`
- a Page access token
- Graph API endpoints such as `/{page-id}/messages`
- webhook-based event delivery

The reviewed Messenger Postman collection also points to:

- Send API
- Messenger Profile API
- Conversations API
- Moderate Conversations API

This means MIABOS can model Messenger as a standard channel adapter with both inbound and outbound capability.

### 2.1 Primary integration scenarios for MIABOS

- connect a Facebook Page as a tenant-owned messaging channel
- ingest inbound Messenger conversations into the unified inbox
- let AI or human agents reply inside MIABOS
- support takeover / return-to-AI conversation control
- support page-level comment-to-DM follow-up where allowed
- keep moderation and audit actions synchronized

### 2.2 Core external objects

| Object | Meaning | Why MIABOS needs it |
|--------|---------|---------------------|
| Facebook App | the application that owns permissions and webhooks | onboarding and policy boundary |
| Facebook Page | the business messaging identity | top-level channel object |
| Page access token | token used for API calls | outbound send and management |
| PSID | Page-scoped user identifier | conversation participant identity |
| message | customer or business message | unified inbox message record |
| attachment | media payload | message content support |
| postback / quick reply | structured customer interaction | intent and workflow triggers |
| conversation ownership state | whether MIABOS AI or another app owns thread control | handoff governance |
| moderation action | block / ban / spam operations | trust and abuse handling |

---

## 3. Onboarding and Authentication

### 3.1 Business-side prerequisites

- Business has a Facebook Page
- MIABOS app is connected to the Page
- required permissions are approved
- MIABOS stores Page-level access credentials per tenant

### 3.2 Auth model

- Page access token
- Meta app permissions, especially `pages_messaging`

### 3.3 BA implication

The onboarding flow should be designed as:

1. Select or connect Facebook Page
2. Grant Meta permissions
3. Verify webhook subscription
4. Persist channel record in `omni_channels`
5. Run test send / receive

### 3.4 Recommended onboarding flow

1. Business user opens `Connect Facebook Messenger` inside MIABOS.
2. MIABOS redirects user to Meta authorization.
3. User grants required Page permissions.
4. MIABOS receives authorization result and identifies the selected Page.
5. MIABOS stores or references the Page access token securely.
6. MIABOS subscribes the app to webhook events for that Page.
7. MIABOS creates the channel row in `omni_channels`.
8. MIABOS sends a verification test and marks channel health as `active` only after inbound and outbound checks pass.

---

## 4. Inbound Flow

Messenger supports webhook-driven inbound processing for:

- customer messages
- postbacks
- quick replies
- other interaction events tied to Messenger surfaces

For MIABOS this maps naturally to:

- create or reopen `mc_conversation`
- append inbound `mc_message`
- trigger AI or human-routing policy
- write channel event audit

### 4.1 Detailed inbound integration flow

1. Meta sends a webhook event to the MIABOS Messenger endpoint.
2. MIABOS verifies the webhook source and subscription context.
3. MIABOS resolves the tenant and channel using the Page identifier.
4. MIABOS normalizes the sender PSID into `mc_conversation_participants`.
5. MIABOS creates or reopens the conversation in `mc_conversations`.
6. MIABOS writes the raw inbound payload to an adapter audit log.
7. MIABOS writes a normalized inbound row into `mc_messages`.
8. MIABOS runs routing logic:
   - AI auto-reply
   - human-owned queue
   - assignment / SLA logic
9. MIABOS updates conversation state and unread counters.

### 4.2 Inbound object mapping

| External field / object | MIABOS target |
|-------------------------|---------------|
| Page ID | `omni_channels.channel_external_id` |
| sender PSID | participant external ID |
| message ID | external message ID |
| message text / attachment | normalized content payload |
| quick reply / postback | interaction metadata |
| event timestamp | message created / received timestamps |

---

## 5. Outbound Flow

The reviewed Send API material shows programmatic sending via:

- `POST /{page-id}/messages`
- recipient by Page-scoped ID
- message content types such as text, attachments, templates, and sender actions

This supports:

- AI auto-reply
- human agent reply
- structured buttons or quick replies where useful
- read / processing UX via sender actions

### 5.1 Detailed outbound integration flow

1. MIABOS agent or AI creates an outbound reply request.
2. MIABOS checks channel status, token health, and conversation ownership.
3. MIABOS validates whether the conversation is still inside the allowed messaging window.
4. MIABOS maps the outbound payload into Messenger Send API format.
5. MIABOS sends `POST /{page-id}/messages`.
6. MIABOS records the returned external message identifier.
7. MIABOS writes the outbound message into `mc_messages`.
8. MIABOS updates conversation status and send outcome audit.

### 5.2 Outbound object mapping

| MIABOS intent | Messenger object |
|---------------|------------------|
| plain text reply | text message |
| structured CTA | buttons / quick replies / template payload |
| typing state | sender action |
| image / file reply | attachment |
| agent takeover response | ownership-aware outbound message |

---

## 6. Conversation and Message Lifecycle

### 6.1 Recommended conversation states in MIABOS

- `new`
- `active_ai`
- `active_human`
- `waiting_customer`
- `closed`
- `blocked`

### 6.2 Recommended message states in MIABOS

- `received`
- `queued`
- `sent`
- `failed`
- `skipped_policy`
- `skipped_ownership`

### 6.3 Lifecycle notes

- one Messenger thread should map to one active MIABOS conversation context per tenant and Page
- reopen logic should be triggered when a customer sends a new inbound message after closure
- ownership transitions must be auditable because Messenger supports thread governance patterns

---

## 7. Operational Constraints

### 7.1 Messaging window

The reviewed Meta Messenger documentation indicates a key rule:

- the recipient must have messaged the Page within the last 24 hours, or
- the Page must use an allowed mechanism for messaging outside the standard window

### 7.2 Ownership and moderation

The reviewed Messenger materials also show:

- conversation ownership filtering through Conversations API
- moderation actions such as block, unblock, ban, unban, spam move

### 7.3 BA implication

MIABOS must not treat Messenger as an unlimited outbound remarketing channel. It is better modeled as:

- responsive messaging channel
- human-service inbox
- AI support channel
- comment-to-DM follow-up channel where policy permits

---

## 8. Error and Exception Handling

### 8.1 Expected failure types

- invalid or expired Page token
- missing permission after reconnect
- duplicate webhook delivery
- message outside allowed messaging policy
- user blocked / unavailable for message delivery
- ownership conflict when another app controls the thread

### 8.2 MIABOS handling recommendation

- persist raw error code and normalized failure reason
- never mark outbound message `sent` until the API call succeeds
- make duplicate webhook handling idempotent by external event / message key
- distinguish policy failure from transport failure in analytics

---

## 9. Recommended MIABOS Adapter Design

### 9.1 Required capabilities

- OAuth / Page connect flow
- webhook verification and event ingestion
- outbound send abstraction
- PSID-based identity mapping
- 24-hour-window guardrail
- thread ownership / takeover state
- moderation actions

### 9.2 Suggested channel code

`facebook_messenger`

### 9.3 Suggested capability flags

- `supports_inbound_messages = true`
- `supports_outbound_messages = true`
- `supports_templates = true`
- `supports_human_takeover = true`
- `supports_comment_dm_followup = true`
- `supports_broadcast = limited_by_policy`

---

## 10. Data Mapping to MIABOS

| Messenger concept | MIABOS mapping |
|-------------------|----------------|
| Facebook Page | `omni_channels.channel_external_id` |
| Page access token | secure credential reference |
| Page-scoped ID (PSID) | `mc_conversation_participants.external_user_id` |
| inbound message event | `mc_messages` inbound row |
| outbound send | `mc_messages` outbound row |
| ownership state | conversation AI/human ownership flags |
| moderation action | conversation moderation audit |

---

## 11. Risk Assessment

**Risk Level**: Medium

Main risks:

- Meta policy and permission review changes
- messaging-window restrictions
- token lifecycle and permission revocation
- webhook duplication and retry behavior

Mitigation:

- central token health checks
- strict idempotency by message / event ID
- outbound policy guardrails
- sandbox test Page during implementation

---

## 12. Sources

- Meta Messenger Platform Postman collection: <https://www.postman.com/meta/messenger-platform-api/collection/iyp204x/messenger-platform-api>
- Meta Messenger Platform documentation overview in Postman: <https://www.postman.com/meta/messenger-platform-api/documentation/iyp204x/messenger-platform-api%3Fentity%3Dfolder-22794852-6724e47b-0e25-4cb0-95cb-cd04279dd917>
- Meta Conversations API example showing ownership filtering: <https://www.postman.com/meta/messenger-platform-api/request/hbl9dbu/conversation-ownership-filtering>
- Meta Moderate Conversations API folder: <https://www.postman.com/meta/messenger-platform-api/folder/22794852-2a03c680-8373-42e8-ac2e-4b1b0d1fd60d>

---

## 13. BA Conclusion

Facebook Messenger should remain a **Tier-1 official MIABOS omni-channel adapter**. It is suitable for unified inbox, AI reply, handoff, and page-based customer service workflows.
