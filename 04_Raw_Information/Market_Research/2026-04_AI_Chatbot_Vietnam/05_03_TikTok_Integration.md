# TikTok Integration Research

**Document Type**: Channel Integration Research  
**Channel**: TikTok  
**Research Date**: 2026-04-07  
**Prepared By**: A03 Business Analyst Agent (Codex CLI)  
**Status**: Draft  
**Primary Use**: MIABOS lead capture, messaging-ad routing, limited business automation research

---

## 1. Executive Summary

TikTok is not currently the same class of integration surface as Facebook Messenger, WhatsApp Cloud API, or Zalo OA for MIABOS.

The official materials reviewed show:

- Business Account automatic messages configured in TikTok app / Business Center
- Messaging Ads that can route users into TikTok Direct Messages or external apps such as Messenger, WhatsApp, and Zalo
- Content Posting API for publishing content
- Data portability scopes for direct-message data export, not operational customer-service messaging

Because of this, TikTok should currently be treated as:

- a lead-entry and acquisition channel
- a routing source into stronger owned / official channels
- a future-research integration area

It should **not** be promised yet as a full MIABOS inbox adapter at the same level as Messenger or WhatsApp.

---

## 2. Official Integration Surface Reviewed

### 2.1 Business-side messaging surfaces

The reviewed TikTok Business help materials show automatic messages for Business Accounts through:

- welcome messages
- keyword replies
- suggested questions
- chat prompts

These are configured inside TikTok's own product surfaces, not through a public operational DM API shown in the reviewed docs.

### 2.2 Paid lead-generation surface

The reviewed Messaging Ads material shows:

- Direct Messaging Ads inside TikTok Direct Messages
- Instant Messaging Ads routing to third-party apps such as Messenger, WhatsApp, and Zalo

### 2.3 Developer API surface

The reviewed TikTok developer docs show public APIs for:

- content posting
- creator authorization scopes
- data portability exports

The reviewed scopes include `portability.directmessages.*`, but that is a data portability pattern, not an operational live-support messaging API.

### 2.4 Primary integration scenarios for MIABOS

- track TikTok as a traffic and lead source
- route ad-initiated conversations to stronger messaging channels
- optionally orchestrate content publishing workflows
- capture acquisition context for CRM and automation downstream

### 2.5 Core external objects

| Object | Meaning | Why MIABOS needs it |
|--------|---------|---------------------|
| TikTok Business Account | brand identity on TikTok | channel / source identity |
| Messaging Ad | paid conversation entry point | lead-source attribution |
| auto-message configuration | TikTok-managed reply behavior | operator awareness only |
| content post / publish job | publishing output | content workflow integration |
| portability DM export | historical / exportable data, not live messaging | limited analytics or migration use |

---

## 3. BA Interpretation

### 3.1 What seems officially available

- TikTok-native automated DM features inside Business Center / app
- ad products that initiate chats
- APIs for posting content and accessing approved data products

### 3.2 What was not found in reviewed official public docs

- a public operational API equivalent to:
  - `send message`
  - `receive customer DM webhook`
  - `agent handoff`
  - `delivery status`
  - `conversation ownership`

### 3.3 Practical conclusion

MIABOS should position TikTok in phase 1 as:

- ad-source attribution channel
- lead source
- CTA routing channel
- campaign orchestration input

Not as a fully normalized two-way inbox channel unless a stronger official operational API is confirmed later.

### 3.4 Recommended scope boundary

MIABOS should currently define TikTok integration as:

- `source_and_routing_integration`

and explicitly not as:

- `full_operational_messaging_integration`

---

## 4. Recommended MIABOS Use Cases

### 4.1 Near-term recommended

- connect TikTok campaign metadata
- capture `source = tiktok`
- attribute lead or conversation origin
- route Instant Messaging Ads to WhatsApp, Zalo OA, or Messenger
- track content publishing workflow via Content Posting API if business need exists

### 4.2 Avoid promising now

- full live inbox synchronization
- bot takeover / return-to-AI
- official DM send / receive parity with Messenger
- full conversation audit sourced directly from public operational DM APIs

### 4.3 Recommended integration flow for phase 1

1. User sees TikTok content or ad.
2. User interacts through Messaging Ad or TikTok profile CTA.
3. TikTok-origin context is captured in MIABOS campaign / lead attribution.
4. MIABOS routes the customer into a supported official conversation channel:
   - Website
   - WhatsApp
   - Zalo OA
   - Facebook Messenger
5. Downstream conversation lifecycle is managed in the supported destination channel.

### 4.4 Recommended integration objects for MIABOS

| MIABOS object | TikTok-linked meaning |
|---------------|-----------------------|
| lead source | `tiktok` |
| campaign source | ad or campaign identifier |
| routed channel | target channel chosen for real conversation |
| content asset | published TikTok post or media artifact |
| acquisition event | entry event from ad / CTA interaction |

---

## 5. Suggested MIABOS Adapter Design

### 5.1 Initial adapter type

`tiktok_lead_adapter`

### 5.2 Scope for initial version

- campaign / ad source registration
- conversation-source attribution
- outbound route-to-channel CTA configuration
- content publishing integration if needed

### 5.3 Suggested processing flow

1. ingest TikTok campaign or CTA metadata
2. map source into MIABOS acquisition tracking
3. configure target conversation channel
4. pass customer into supported inbox channel
5. preserve TikTok as origin context in CRM and automation

### 5.4 Capability flags

- `supports_inbound_messages = uncertain_public_api`
- `supports_outbound_messages = uncertain_public_api`
- `supports_lead_source_attribution = true`
- `supports_redirect_to_external_channels = true`
- `supports_content_posting = true`

---

## 6. Error and Exception Handling

### 6.1 Expected failure types

- routing target misconfiguration
- campaign attribution mismatch
- policy change in TikTok messaging products
- non-portable assumptions about direct-message APIs

### 6.2 MIABOS handling recommendation

- keep the adapter limited to verified supported behaviors
- separate acquisition analytics from conversation operations
- require a partner-validation gate before any upgrade into full inbox scope

---

## 7. Data Mapping to MIABOS

| TikTok concept | MIABOS mapping |
|----------------|----------------|
| TikTok campaign / ad source | lead source attribution |
| Messaging Ad | source trigger record |
| redirect target app | channel routing config |
| Business Account auto-message config | external-platform-managed behavior, not MIABOS-managed logic |
| posted content | content publishing artifact |

---

## 8. Risk Assessment

**Risk Level**: High

Main risks:

- unclear public operational DM API surface
- policy drift in ads and messaging products
- partial control because many behaviors stay inside TikTok products

Mitigation:

- limit product promise
- treat TikTok as source / routing first
- run a separate partner / API-validation track before inbox commitment

---

## 9. Sources

- TikTok automatic messages overview: <https://ads.tiktok.com/help/article/navigate-auto-message-business-accounts?lang=en>
- TikTok automatic message setup: <https://ads.tiktok.com/help/article/how-to-set-up-auto-messages-for-business-accounts>
- TikTok Messaging Ads: <https://ads.tiktok.com/help/article/about-tiktok-messaging-ads>
- TikTok developer overview: <https://developers.tiktok.com/doc>
- TikTok Content Posting API get started: <https://developers.tiktok.com/doc/content-posting-api-get-started/>
- TikTok scopes reference: <https://developers.tiktok.com/doc/tiktok-api-scopes>
- TikTok Data Portability API get started: <https://developers.tiktok.com/doc/data-portability-api-get-started>

---

## 10. BA Conclusion

TikTok should be positioned for MIABOS as a **lead-entry and routing channel first**, not as a committed full inbox integration. A stronger public operational messaging API would need to be verified before productizing it as a true omnichannel adapter.
