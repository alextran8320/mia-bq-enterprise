# Omni-Channel Integration Research Index

**Document Type**: Channel Integration Research Index  
**Scope**: MIABOS omni-channel integration feasibility and mechanism research  
**Research Date**: 2026-04-07  
**Prepared By**: A03 Business Analyst Agent (Codex CLI)  
**Status**: Draft  
**Related Products**: MIA Smart, MIA Scale, Platform

---

## 1. Purpose

This research pack documents the official or practical integration mechanisms for the main omni-channel surfaces relevant to MIABOS:

- Facebook Messenger
- WhatsApp Business Platform
- TikTok
- Zalo Official Account
- Zalo personal account
- Website chat

Each channel is documented in a separate Markdown file so product, BA, architecture, and implementation teams can consume the findings independently.

The current version also deepens each channel document with:

- primary integration scenarios
- external integration objects
- end-to-end integration flow
- message / conversation lifecycle suggestions
- error and exception handling notes
- MIABOS object mapping

---

## 2. Executive Summary

| Channel | Official Integration Surface | Feasibility for MIABOS | Recommended Positioning |
|---------|------------------------------|------------------------|-------------------------|
| Facebook Messenger | Meta Messenger Platform / Graph API / webhooks | High | Core omnichannel inbox and bot channel |
| WhatsApp Business | WhatsApp Business Platform Cloud API / webhooks | High | Core business messaging channel after R1 |
| TikTok | Business Suite auto-messages, Messaging Ads, Content Posting API | Medium-Low | Lead-generation and redirection channel first, not a full inbox promise |
| Zalo Official Account | Zalo OA / OA OpenAPI / OA Manager / webhooks | High | Core Vietnam-native business messaging channel |
| Zalo personal account | No public business-grade messaging API found in reviewed official docs | Low | Do not position as official productized integration |
| Website chat | First-party MIABOS web widget + backend APIs + real-time transport | Very High | Foundational owned channel and adapter reference implementation |

---

## 3. Recommended MIABOS Rollout Order

1. **R1 / MVP**
   - Website chat
   - Facebook Messenger
   - Zalo Official Account
2. **R1.5 / R2**
   - WhatsApp Business Platform
3. **Later / controlled scope**
   - TikTok as a lead-entry and routing channel
4. **Do not commit as official integration**
   - Zalo personal account

This sequence matches MIABOS release intent already present in the release plan: R1 minimum omni-channel target = Facebook Messenger + Zalo OA.

---

## 4. MIABOS Integration Architecture Direction

### 4.1 Control Plane

Use `omni_channels` as the per-tenant channel control plane:

- channel type
- channel credentials / token references
- webhook status
- AI enablement flags
- rule / knowledge scope
- channel-specific capabilities

### 4.2 Conversation Plane

Normalize all inbound and outbound interactions into:

- `mc_conversations`
- `mc_messages`
- `mc_conversation_participants`

### 4.3 Adapter Pattern

Implement one adapter per channel:

- `facebook_messenger_adapter`
- `whatsapp_cloud_api_adapter`
- `zalo_oa_adapter`
- `website_chat_adapter`
- `tiktok_lead_adapter` (initially limited scope)

### 4.4 Event Pattern

Each adapter should support:

- channel onboarding
- inbound webhook or polling ingestion
- outbound send contract
- delivery / status updates where available
- idempotency and replay safety
- human takeover / return-to-AI flags where channel permits it

---

## 5. File Map

- [05_01_Facebook_Messenger_Integration.md](05_01_Facebook_Messenger_Integration.md)
- [05_02_WhatsApp_Business_Platform_Integration.md](05_02_WhatsApp_Business_Platform_Integration.md)
- [05_03_TikTok_Integration.md](05_03_TikTok_Integration.md)
- [05_04_Zalo_Official_Account_Integration.md](05_04_Zalo_Official_Account_Integration.md)
- [05_05_Zalo_Personal_Account_Integration.md](05_05_Zalo_Personal_Account_Integration.md)
- [05_06_Website_Chat_Integration.md](05_06_Website_Chat_Integration.md)

---

## 6. Source Notes

- This pack prioritizes official vendor or platform documentation.
- Where no official public business API was found, the document states that explicitly instead of inferring unsupported capability.
- Policy-heavy channels must be re-verified during implementation because approval, messaging windows, rate limits, and onboarding flows can change.
