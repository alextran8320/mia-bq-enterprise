# Zalo Personal Account Integration Research

**Document Type**: Channel Integration Research  
**Channel**: Zalo personal account  
**Research Date**: 2026-04-07  
**Prepared By**: A03 Business Analyst Agent (Codex CLI)  
**Status**: Draft  
**Primary Use**: Feasibility assessment only

---

## 1. Executive Summary

Based on the reviewed official Zalo materials, MIABOS should **not** currently position Zalo personal account as an official, productized omni-channel integration.

The reviewed official materials strongly center on:

- Zalo Official Account
- OA Manager
- OA OpenAPI
- OA messaging and chatbot

In the reviewed public official materials, no equivalent business-grade public messaging API surface was identified for personal Zalo accounts.

That means this channel should be treated as **unsupported for official integration** unless a separate verified official program or API is confirmed.

---

## 2. What Was Reviewed

The reviewed official Zalo materials focus on business interaction through Zalo OA:

- enterprise messaging
- OA operations
- OpenAPI
- user management
- chatbot
- multi-OA management
- third-party system integration

These official surfaces explicitly describe OA as the business integration model.

### 2.1 Relevant object boundary

The key object boundary in the reviewed official materials is:

- `business messaging = Official Account`

not:

- `business messaging = personal account`

---

## 3. Key Finding

### 3.1 What was found

- official business integration story for Zalo OA
- OA OpenAPI for CRM / ERP / omni-channel / chatbot scenarios
- OA management and conversation operations

### 3.2 What was not found in reviewed official public materials

- public business messaging API for personal accounts
- public webhook model for personal-account customer-service integration
- public operational send / receive API for personal accounts
- official product narrative positioning personal accounts as the enterprise integration surface

### 3.3 BA interpretation

If a business wants scalable, policy-aligned integration with Zalo, the official path shown in the reviewed documentation is **Zalo Official Account**, not a personal account.

### 3.4 Practical integration-flow conclusion

For MIABOS, the correct decision flow is:

1. customer asks for Zalo integration
2. MIABOS checks whether the request is for OA or personal account
3. if OA -> proceed with official integration track
4. if personal account -> classify as unsupported / separate research item

### 3.5 Personal-account object view

| Object | Status in reviewed official business docs |
|--------|-------------------------------------------|
| personal account identity | not presented as official business integration object |
| personal-account message API | not identified |
| personal-account webhook | not identified |
| personal-account agent handoff object | not identified |

---

## 4. Product Recommendation for MIABOS

### 4.1 Recommended product stance

MIABOS should state:

- **Supported**: Zalo Official Account
- **Not officially supported**: Zalo personal account

### 4.2 Why this matters

If MIABOS advertises personal-account integration without an official public API basis, risks include:

- policy violation
- connection instability
- account bans or feature loss
- support burden from unofficial methods
- inability to guarantee scale or compliance

### 4.3 Recommended MIABOS object policy

MIABOS should not create a standard production channel adapter object for Zalo personal accounts.

If tracking is necessary, it should exist only as:

- a demand signal
- a sales note
- a research backlog item

not as a normal operational `omni_channels` adapter.

---

## 5. If Customers Ask for Zalo Personal

Recommended BA handling:

1. clarify whether they actually need OA or personal account
2. explain that the official business integration path is OA
3. propose OA migration or OA-first deployment
4. if needed, log personal-account need as a separate research / partnership track, not as committed delivery scope

### 5.1 Recommended response flow

1. confirm business objective:
   - customer support
   - sales consultation
   - remarketing
2. map objective to OA-supported path
3. explain risk of personal-account unofficial methods
4. offer OA onboarding or migration support

---

## 6. Suggested MIABOS Capability Flags

If the channel row is ever created for research or manual-assist purposes only:

- `supports_inbound_messages = false`
- `supports_outbound_messages = false`
- `supports_official_api = false`
- `supports_manual_assist_only = true`

But the recommended default is **do not create this as a normal sellable channel type**.

### 6.1 Error and risk handling implication

If the business still requests personal-account support, MIABOS should record:

- `support_status = unsupported`
- `risk_reason = no_verified_official_business_api`
- `next_action = recommend_oa`

---

## 7. Risk Assessment

**Risk Level**: Very High

Main risks:

- no confirmed official public business messaging API in reviewed materials
- high compliance and operational risk
- unstable unofficial workarounds

Mitigation:

- keep official product support on OA only
- escalate any personal-account request into separate validated research

---

## 8. Sources

- Zalo OA homepage: <https://oa.zalo.me/>
- Zalo OA messaging / interaction capabilities: <https://oa.zalo.me/home/function/interaction>
- Zalo OA management capabilities: <https://oa.zalo.me/home/function/management>
- Zalo OA OpenAPI extension page: <https://oa.zalo.me/home/function/extension>
- Zalo OA OpenAPI and enterprise integration article: <https://oa.zalo.me/home/resources/library/tinh-nang-mo-rong-nang-cap-zalo-oa_2410156908111809541>

---

## 9. BA Conclusion

For MIABOS, **Zalo personal account should remain out of the official omni-channel commitment scope** until a verified official public business integration program is identified.
