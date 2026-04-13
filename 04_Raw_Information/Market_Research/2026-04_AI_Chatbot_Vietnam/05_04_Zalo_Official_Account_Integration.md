# Zalo Official Account Integration Research

**Document Type**: Channel Integration Research  
**Channel**: Zalo Official Account  
**Research Date**: 2026-04-07  
**Prepared By**: A03 Business Analyst Agent (Codex CLI)  
**Status**: Draft  
**Primary Use**: MIABOS Vietnam-native business messaging, customer service, chatbot, broadcast, workflow integration

---

## 1. Executive Summary

Zalo Official Account is one of the most strategically important channels for MIABOS in Vietnam.

The reviewed official Zalo OA materials show:

- OA as the business account model
- OA Manager as the default operating console
- OA OpenAPI as the extension / integration surface
- webhook support tied to OpenAPI rights
- messaging, user-management, OA-management, and other operating capabilities
- explicit suitability for CRM, ERP, omni-channel, and chatbot integrations

This makes Zalo OA a strong official business integration surface for MIABOS.

---

## 2. Official Integration Surface

The reviewed Zalo OA materials describe two primary operating layers:

### 2.1 OA Manager

Zalo's native management console for:

- OA profile and setup
- admin management
- conversation assignment
- user information management
- usage monitoring

### 2.2 OA OpenAPI

The reviewed OA OpenAPI materials describe a paid extension capability for:

- automating OA operations
- integrating OA with internal or third-party systems
- managing multiple OAs centrally
- synchronizing customer and OA data
- using corresponding webhooks for operations

This is exactly the kind of integration surface MIABOS needs.

### 2.3 Primary integration scenarios for MIABOS

- connect one or many OAs into MIABOS
- ingest OA messages into the unified inbox
- synchronize OA user data into CRM context
- send customer-care and consultation replies from AI or human agents
- support chatbot and workflow-driven service scenarios
- support branch or brand structures through multiple OAs

### 2.4 Core external objects

| Object | Meaning | Why MIABOS needs it |
|--------|---------|---------------------|
| OA | official business account | top-level channel identity |
| OA package / extension entitlement | commercial feature boundary | onboarding readiness |
| OA admin / operator | business-side operating role | permission and workflow context |
| OA user / follower | customer identity in Zalo ecosystem | participant mapping |
| OA message | inbound or outbound customer-care content | unified inbox |
| OA webhook event | event delivery from OpenAPI-linked operations | ingestion and status sync |
| OA user profile data | customer enrichment data | CRM and segmentation |

---

## 3. Onboarding and Authentication

### 3.1 Business-side prerequisites

- business creates a Zalo Official Account
- business activates the needed OA service tier or extension capability
- MIABOS is authorized to access the OA through OpenAPI-related setup

### 3.2 BA implication

MIABOS onboarding should be modeled as:

1. Connect OA
2. Confirm OA service eligibility / package
3. Grant OpenAPI rights
4. Register webhook endpoint
5. Save OA channel record
6. Run test interaction

Because OA OpenAPI is positioned as a paid capability, MIABOS pricing and onboarding flows must account for Zalo-side service dependency.

### 3.3 Recommended onboarding flow

1. Business user opens `Connect Zalo OA` in MIABOS.
2. MIABOS asks for OA identifier and confirms OA package eligibility.
3. Business authorizes MIABOS to use OA OpenAPI capability.
4. MIABOS registers webhook and callback configuration.
5. MIABOS creates the OA row in `omni_channels`.
6. MIABOS verifies outbound send and inbound event health.
7. MIABOS loads base OA user / profile synchronization settings.

---

## 4. Inbound Flow

The reviewed Zalo OA materials indicate that:

- Zalo OA supports two-way enterprise-user messaging
- OpenAPI rights have corresponding webhooks
- OA user and conversation data can be synchronized into enterprise systems

For MIABOS this supports:

- unified inbox ingestion
- AI reply or chatbot decisioning
- human assignment
- OA user profile synchronization

### 4.1 Detailed inbound integration flow

1. OA webhook event reaches the MIABOS Zalo adapter endpoint.
2. MIABOS resolves the OA and tenant context.
3. MIABOS validates whether the event type is supported for inbox processing.
4. MIABOS normalizes the OA user identity into conversation participant records.
5. MIABOS creates or reopens the conversation.
6. MIABOS stores the raw event payload for audit.
7. MIABOS writes normalized inbound message or customer event records.
8. MIABOS triggers AI, queueing, or agent assignment policy.
9. MIABOS updates CRM-linked OA user information if present.

### 4.2 Inbound object mapping

| External field / object | MIABOS target |
|-------------------------|---------------|
| OA ID | channel identity |
| OA user ID / follower ID | participant external identity |
| inbound message payload | `mc_messages` normalized row |
| OA user profile attributes | CRM enrichment fields |
| webhook event ID / type | adapter audit and idempotency key |

---

## 5. Outbound Flow

The reviewed materials show Zalo OA messaging supports multiple business messaging patterns, including:

- basic consultation messaging
- broadcast
- template-style business messaging categories

The OA materials also describe using OA data plus off-platform business data to personalize interactions.

### BA implication

MIABOS can use Zalo OA not only for reply workflows, but also for:

- customer-care automation
- reminder orchestration
- personalized business messaging
- CRM-linked service workflows

### 5.1 Detailed outbound integration flow

1. MIABOS operator, AI, or automation creates an outbound OA message request.
2. MIABOS validates the OA channel status and permitted message type.
3. MIABOS maps the payload into the OA outbound API format.
4. MIABOS sends the outbound request through the OA adapter.
5. MIABOS stores outbound message audit and normalized `mc_messages` row.
6. MIABOS updates conversation state and operational metrics.

### 5.2 Outbound object mapping

| MIABOS intent | Zalo OA object |
|---------------|----------------|
| service reply | OA message |
| customer-care automation | OA business message or workflow-driven send |
| reminder | OA outbound message under OA policy / package |
| enriched CRM outreach | OA message personalized from synced profile context |

---

## 6. Conversation and Message Lifecycle

### 6.1 Recommended conversation states in MIABOS

- `new`
- `active_ai`
- `active_human`
- `awaiting_customer`
- `closed`
- `restricted_channel`

### 6.2 Recommended message states in MIABOS

- `received`
- `queued`
- `sent`
- `failed`
- `rejected_capability`
- `rejected_quota`

### 6.3 Lifecycle notes

- OA capability and quota should influence whether outbound actions are allowed
- OA user profile sync should be treated as enrichment, not as a hard dependency for message ingestion

---

## 7. Operational Constraints

### 7.1 Service-tier dependency

The reviewed OA OpenAPI article states that OpenAPI is a paid OA feature and requires service-package activation.

### 7.2 Zalo-governed feature boundaries

Some capabilities may depend on:

- OA type
- feature quotas
- purchased rights
- Zalo review or policy constraints

### 7.3 BA implication

MIABOS should treat Zalo OA integration readiness as a combination of:

- technical connection
- commercial eligibility
- OA operating package status

---

## 8. Error and Exception Handling

### 8.1 Expected failure types

- OA package does not support required capability
- webhook not configured or partially active
- quota or feature usage limit reached
- user profile sync unavailable
- duplicate event delivery

### 8.2 MIABOS handling recommendation

- store capability status per OA in `omni_channels`
- handle webhook and send failures independently
- use event-level idempotency keys
- keep CRM enrichment decoupled from conversation ingestion

---

## 9. Recommended MIABOS Adapter Design

### 9.1 Required capabilities

- OA connect and verification flow
- webhook ingestion
- OA user synchronization
- outbound messaging abstraction
- OA capability / quota awareness
- multi-OA support for multi-brand or branch businesses

### 9.2 Suggested channel code

`zalo_official_account`

### 9.3 Suggested capability flags

- `supports_inbound_messages = true`
- `supports_outbound_messages = true`
- `supports_chatbot = true`
- `supports_customer_profile_sync = true`
- `supports_broadcast = true`
- `supports_multi_oa_management = true`

---

## 10. Data Mapping to MIABOS

| Zalo OA concept | MIABOS mapping |
|-----------------|----------------|
| OA | `omni_channels.channel_external_id` |
| OA admin / branch context | tenant or brand-level config |
| Zalo user / follower / UID | `mc_conversation_participants.external_user_id` |
| inbound OA interaction | `mc_messages` inbound row |
| outbound OA message | `mc_messages` outbound row |
| OA labels / user info | CRM enrichment or tag sync |
| OA webhook event | event audit / adapter log |

---

## 11. Risk Assessment

**Risk Level**: Medium

Main risks:

- Zalo-side service package dependency
- feature eligibility per OA package
- evolving local rules and quotas
- documentation discoverability compared with Meta

Mitigation:

- treat commercial eligibility as part of onboarding
- implement capability flags per OA
- maintain Zalo-specific operational runbook

---

## 12. Sources

- Zalo OA homepage: <https://oa.zalo.me/>
- Zalo OA management capabilities: <https://oa.zalo.me/home/function/management>
- Zalo OA messaging / interaction capabilities: <https://oa.zalo.me/home/function/interaction>
- Zalo OA OpenAPI extension page: <https://oa.zalo.me/home/function/extension>
- Zalo OA OpenAPI and enterprise integration article: <https://oa.zalo.me/home/resources/library/tinh-nang-mo-rong-nang-cap-zalo-oa_2410156908111809541>
- Zalo OA getting started for business: <https://oa.zalo.me/home/resources/library/bat-dau-voi-zalo-official-account-doanh-nghiep_4734298769069788795>

---

## 13. BA Conclusion

Zalo Official Account should be a **Tier-1 official MIABOS channel** for Vietnam. It is one of the strongest strategic differentiators MIABOS can build against international competitors that lack Zalo-native depth.
