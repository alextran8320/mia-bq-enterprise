# WhatsApp Business Platform Integration Research

**Document Type**: Channel Integration Research  
**Channel**: WhatsApp Business Platform (Cloud API)  
**Research Date**: 2026-04-07  
**Prepared By**: A03 Business Analyst Agent (Codex CLI)  
**Status**: Draft  
**Primary Use**: MIABOS official business messaging, notifications, human support, AI reply

---

## 1. Executive Summary

WhatsApp Business Platform Cloud API is an official and mature business integration surface for MIABOS.

The reviewed Meta materials show:

- Graph API-based send model
- inbound and status webhooks
- WABA and business phone number model
- template-message governance
- embedded onboarding for partners / tech providers
- explicit throughput and pair-rate limits

This channel is highly suitable for MIABOS after core MVP channels are stable.

---

## 2. Official Integration Surface

The reviewed WhatsApp Business Platform materials indicate that Cloud API is built around:

- Meta business portfolio
- WhatsApp Business Account (WABA)
- business phone number
- Graph API `/messages`
- webhook delivery for inbound messages and status changes
- templates for business-initiated messaging

This is a clean API model for a SaaS platform.

### 2.1 Primary integration scenarios for MIABOS

- connect a business WhatsApp number into MIABOS
- unify inbound customer chats in the shared inbox
- reply from AI or human agents through Cloud API
- send approved template messages for business-initiated workflows
- track message delivery and read states
- attribute conversations from Click-to-WhatsApp ads

### 2.2 Core external objects

| Object | Meaning | Why MIABOS needs it |
|--------|---------|---------------------|
| business portfolio | Meta business container | onboarding and ownership boundary |
| WABA | WhatsApp Business Account | top-level business messaging object |
| business phone number | channel identity used for send / receive | channel row and routing |
| access token | auth credential | API access |
| template | approved business-initiated message format | notification and campaign workflows |
| message / `wamid` | message object and identifier | unified inbox + status tracking |
| contact | WhatsApp user identity | participant identity |
| referral context | ad-origin metadata | attribution and automation |

---

## 3. Onboarding and Authentication

### 3.1 Business-side prerequisites

- business portfolio
- WABA
- registered business phone number
- approved permissions and app review where required

### 3.2 Auth and permissions

The reviewed docs mention access token types and permissions including:

- `business_management`
- `whatsapp_business_management`
- `whatsapp_business_messaging`

### 3.3 Embedded onboarding

The reviewed Embedded Signup documentation is important for MIABOS because it supports:

- partner-style onboarding inside a website or portal
- WABA assignment
- system user assignment
- phone registration
- app subscription to WABA webhooks

### 3.4 BA implication

MIABOS should design WhatsApp onboarding as a guided embedded setup rather than a manual back-office process.

### 3.5 Recommended onboarding flow

1. Business user opens `Connect WhatsApp` inside MIABOS.
2. MIABOS launches the Embedded Signup flow.
3. User selects or creates the business portfolio and WABA context.
4. User registers or selects a business phone number.
5. MIABOS obtains the necessary system-user / business integration access.
6. MIABOS subscribes to WABA webhooks.
7. MIABOS stores channel metadata in `omni_channels`.
8. MIABOS verifies send and inbound webhook health before activating the channel.

---

## 4. Inbound Flow

Inbound delivery is webhook-first.

The reviewed webhook material shows inbound notifications can include:

- contacts
- messages
- context
- text
- media
- interactive responses
- order-related structures
- referral context from Click-to-WhatsApp ads
- delivery and status updates

This makes WhatsApp suitable for:

- unified inbox
- AI reply
- human support routing
- attribution from ad-driven conversations

### 4.1 Detailed inbound integration flow

1. WhatsApp Business Platform sends a webhook to MIABOS.
2. MIABOS verifies the webhook source and WABA context.
3. MIABOS resolves the business phone number to the correct tenant channel.
4. MIABOS normalizes the sender into participant identity records.
5. MIABOS creates or reopens `mc_conversations`.
6. MIABOS stores the raw webhook payload in adapter audit storage.
7. MIABOS writes normalized inbound `mc_messages`.
8. MIABOS updates referral or ad attribution if present.
9. MIABOS runs routing logic for AI reply, human queue, or automation follow-up.

### 4.2 Inbound object mapping

| External field / object | MIABOS target |
|-------------------------|---------------|
| WABA / phone number ID | channel identity |
| sender WhatsApp identifier / phone | participant external identity |
| `wamid` | external message ID |
| text / interactive / media payload | normalized content payload |
| referral | attribution metadata |
| status webhook | message delivery state |

---

## 5. Outbound Flow

The reviewed Cloud API materials show outbound messaging through:

- `POST /{phone-number-id}/messages`

Supported operational patterns include:

- free-form response messages
- template messages
- media messages
- interactive formats

### BA implication

MIABOS should split outbound use cases into:

1. **customer-service reply path**
2. **business-initiated template path**

Those are not the same operational flow and should not share one approval model.

### 5.1 Detailed outbound integration flow

1. MIABOS creates an outbound message request.
2. MIABOS classifies the request:
   - service reply
   - template-governed business initiation
3. MIABOS validates allowed message type and required template metadata.
4. MIABOS maps the payload to Cloud API `/messages`.
5. MIABOS sends the request using the connected business phone number.
6. MIABOS records the returned `wamid`.
7. MIABOS stores outbound `mc_messages`.
8. MIABOS later reconciles webhook status events into delivery, read, or failed state.

### 5.2 Outbound object mapping

| MIABOS intent | WhatsApp object |
|---------------|-----------------|
| service text reply | text message |
| notification / reminder | approved template message |
| CTA choice | interactive message |
| image / file | media message |
| post-ad follow-up | attributed conversation response |

---

## 6. Conversation and Message Lifecycle

### 6.1 Recommended conversation states in MIABOS

- `new`
- `active_ai`
- `active_human`
- `awaiting_customer`
- `closed`
- `campaign_initiated`

### 6.2 Recommended message states in MIABOS

- `queued`
- `sent`
- `delivered`
- `read`
- `failed`
- `rejected_policy`
- `rate_limited`

### 6.3 Lifecycle notes

- WhatsApp delivery state is richer than some other channels and should be preserved in analytics
- template-driven outbound flows should be auditable separately from service replies

---

## 7. Operational Constraints

### 7.1 Template governance

The reviewed docs show template messages require approved message templates. This affects:

- notification design
- campaign setup
- auditability
- approval lead time

### 7.2 Throughput and limits

The reviewed docs explicitly mention:

- default throughput up to 80 messages per second per number
- possible upgrade up to 1,000 messages per second
- pair rate limit for the same WhatsApp user

### 7.3 Webhook performance

The reviewed docs also provide webhook scaling expectations and redelivery behavior.

### 7.4 BA implication

MIABOS should not treat WhatsApp as a generic free outbound pipe. It requires:

- message-type governance
- template management UI
- quality and volume monitoring
- retry logic with rate-limit awareness

---

## 8. Error and Exception Handling

### 8.1 Expected failure types

- template not approved or invalid template payload
- permission / token failure
- pair-rate limit exceeded
- phone number throughput limit exceeded
- number not fully registered or quality-limited
- inbound / status webhook replay or delay

### 8.2 MIABOS handling recommendation

- classify failures by policy, rate limit, registration, or transport
- keep message state pending until webhook reconciliation when needed
- centralize retry logic in the sender service, not the UI layer
- expose template-governance errors clearly to operators

---

## 9. Recommended MIABOS Adapter Design

### 9.1 Required capabilities

- embedded signup onboarding
- WABA and number registration tracking
- webhook verification and ingestion
- outbound `/messages` abstraction
- template management linkage
- delivery / read / failed status sync
- pair-rate-aware retry policy

### 9.2 Suggested channel code

`whatsapp_business_cloud_api`

### 9.3 Suggested capability flags

- `supports_inbound_messages = true`
- `supports_outbound_messages = true`
- `supports_templates = true`
- `supports_delivery_status = true`
- `supports_ad_referral_context = true`
- `supports_broadcast = template_governed`

---

## 10. Data Mapping to MIABOS

| WhatsApp concept | MIABOS mapping |
|------------------|----------------|
| WABA | `omni_channels.parent_business_entity` or linked business metadata |
| business phone number | `omni_channels.channel_external_id` |
| contact phone / WhatsApp ID | participant external identity |
| inbound webhook message | `mc_messages` inbound row |
| outbound `/messages` call | `mc_messages` outbound row |
| template name / language | outbound template metadata |
| `wamid` | external message ID |
| delivery / read / failure status | message status audit |

---

## 11. Risk Assessment

**Risk Level**: Medium

Main risks:

- app review and permission approval
- template approval dependencies
- throughput and pair-rate errors
- billing / line-of-credit operational complexity

Mitigation:

- build onboarding around Embedded Signup
- separate template-governed use cases in the product
- implement strong message-state reconciliation
- create a rate-limit aware sender service

---

## 12. Sources

- Meta Cloud API overview: <https://meta-preview.mintlify.io/docs/whatsapp/cloud-api/overview>
- Meta Embedded Signup documentation: <https://www.postman.com/meta/whatsapp-business-platform/documentation/du6gzjv/embedded-signup>
- Meta Embedded Signup collection: <https://www.postman.com/meta/whatsapp-business-platform/collection/du6gzjv/embedded-signup>
- Meta inbound webhook notifications: <https://www.postman.com/meta/whatsapp-business-platform/folder/pye1i1g/inbound-webhook-notifications>
- Meta send text message example: <https://www.postman.com/meta/whatsapp-business-platform/request/13382743-5556ae73-e538-416a-afe7-bbcec579653a>
- Meta sending message templates: <https://www.postman.com/meta/whatsapp-business-platform/folder/5tgpjyz/sending-message-templates>

---

## 13. BA Conclusion

WhatsApp Business Platform should be a **Tier-1.5 / Tier-2 official MIABOS adapter**. It is strong enough for production omnichannel support, but only if MIABOS ships it with onboarding, template governance, and rate-limit-aware delivery logic.
