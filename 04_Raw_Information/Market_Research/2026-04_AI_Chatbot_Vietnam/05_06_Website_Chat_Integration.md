# Website Chat Integration Research

**Document Type**: Channel Integration Research  
**Channel**: Website chat  
**Research Date**: 2026-04-07  
**Prepared By**: A03 Business Analyst Agent (Codex CLI)  
**Status**: Draft  
**Primary Use**: MIABOS owned chat widget, live support, AI assistant, lead capture

---

## 1. Executive Summary

Website chat is the most controllable and strategically valuable omni-channel surface for MIABOS because it is a first-party channel.

Unlike partner-governed messaging channels, website chat can be fully designed and operated by MIABOS using standard web technologies:

- JavaScript embed snippet
- HTTP requests through Fetch API
- real-time message delivery through WebSocket or Server-Sent Events
- optional iframe isolation with `window.postMessage()` for cross-origin widget shells

This should be treated as the reference adapter for MIABOS conversation architecture.

---

## 2. Integration Surface

Website chat does not depend on a third-party channel API. MIABOS can define the full surface:

- embeddable script or iframe widget
- session bootstrap endpoint
- message send endpoint
- event stream or socket endpoint
- identity resolution endpoint
- file upload endpoint if needed

This makes website chat suitable for both MVP and long-term standardization.

### 2.1 Primary integration scenarios for MIABOS

- deploy MIABOS widget across customer websites
- start anonymous visitor conversations
- upgrade anonymous visitors into known CRM identities
- support AI-first and human-assisted live chat
- capture page, campaign, and source attribution data
- trigger appointments, forms, or workflow automation

### 2.2 Core external objects

| Object | Meaning | Why MIABOS needs it |
|--------|---------|---------------------|
| widget instance | the embedded chat client | channel endpoint on customer website |
| visitor session | browser-level conversation session | conversation bootstrap |
| visitor identity | known or anonymous user profile | participant model |
| page context | current URL, referrer, UTM | attribution and automation |
| real-time connection | socket or event stream | live conversation UX |
| file upload | media transfer object | richer conversation support |

---

## 3. Suggested Technical Model

### 3.1 Widget delivery

Two common delivery options:

- direct JS widget injected into merchant site
- iframe-based widget shell embedded on merchant site

### 3.2 Client-to-server requests

Use Fetch API for:

- session creation
- message send
- customer metadata update
- transcript fetch

### 3.3 Real-time updates

Use one of:

- WebSocket for full duplex messaging
- Server-Sent Events for server-to-client streaming if the client send path remains plain HTTP

### 3.4 Cross-origin communication

If MIABOS uses an iframe widget, `window.postMessage()` can safely coordinate:

- widget open / close state
- resize events
- authentication handoff
- parent-page events

### 3.5 Recommended integration objects for MIABOS

| MIABOS object | Website meaning |
|---------------|-----------------|
| `omni_channels` row | website widget configuration |
| `mc_conversations` | visitor session / conversation |
| `mc_conversation_participants` | anonymous visitor or identified customer |
| `mc_messages` | inbound and outbound chat messages |
| attribution fields | URL, referrer, UTM, campaign |
| widget config | theme, domains, behavior flags |

---

## 4. Recommended MIABOS Product Behavior

Website chat should support:

- anonymous visitor session
- known-customer resume
- AI-first reply
- human takeover
- lead capture forms
- appointment routing
- CRM sync
- page / campaign attribution

Because MIABOS owns both client and server sides, this channel is ideal for:

- fastest iteration
- best observability
- easiest compliance controls

### 4.1 Detailed end-to-end integration flow

1. Customer website loads the MIABOS widget snippet or iframe.
2. Widget requests a session bootstrap from MIABOS.
3. MIABOS creates or resumes a visitor conversation.
4. Visitor sends a message through Fetch or WebSocket transport.
5. MIABOS writes inbound `mc_messages` and updates conversation state.
6. MIABOS runs AI or human-routing policy.
7. MIABOS pushes the reply back through WebSocket, SSE, or polling response flow.
8. If the visitor identifies themselves, MIABOS upgrades the participant from anonymous to known-customer state.
9. MIABOS stores page / campaign context for future CRM and automation use.

### 4.2 Inbound object mapping

| Website object | MIABOS target |
|----------------|---------------|
| browser session / conversation token | conversation external key |
| visitor message | inbound message row |
| page URL / referrer / UTM | attribution fields |
| customer-entered identity data | participant identity upgrade |

### 4.3 Outbound object mapping

| MIABOS intent | Website object |
|---------------|----------------|
| AI reply | streamed or pushed widget message |
| human agent reply | operator-sent widget message |
| lead form follow-up | structured widget response |
| appointment CTA | interactive widget event |

---

## 5. Recommended MIABOS Adapter Design

### 5.1 Suggested channel code

`website_chat`

### 5.2 Capability flags

- `supports_inbound_messages = true`
- `supports_outbound_messages = true`
- `supports_real_time_streaming = true`
- `supports_anonymous_sessions = true`
- `supports_identity_upgrade = true`
- `supports_custom_ui = true`

### 5.3 Suggested event model

- `session_created`
- `visitor_identified`
- `message_received`
- `message_sent`
- `conversation_assigned`
- `conversation_returned_to_ai`
- `widget_opened`
- `widget_closed`

### 5.4 Recommended conversation lifecycle

- `anonymous_new`
- `anonymous_active`
- `identified_active`
- `active_human`
- `waiting_customer`
- `closed`

### 5.5 Recommended message lifecycle

- `received`
- `processing_ai`
- `queued_human`
- `sent`
- `delivered_client`
- `failed_transport`

---

## 6. Error and Exception Handling

### 6.1 Expected failure types

- widget bootstrap failure
- cross-origin / domain validation failure
- socket disconnect or reconnect storm
- duplicate send caused by client retry
- identity-upgrade conflict

### 6.2 MIABOS handling recommendation

- make message sends idempotent with client-generated keys
- separate transport status from conversation status
- support graceful fallback from WebSocket to HTTP-based delivery pattern if needed
- validate allowed domains per widget config

---

## 7. Data Mapping to MIABOS

| Website chat concept | MIABOS mapping |
|----------------------|----------------|
| visitor session | `mc_conversations` |
| visitor identity | conversation participant |
| inbound message | `mc_messages` inbound row |
| AI reply | `mc_messages` outbound row |
| page URL / referrer / UTM | conversation attribution fields |
| widget state | client-side telemetry or event log |

---

## 8. Risk Assessment

**Risk Level**: Low

Main risks:

- client embed complexity across customer websites
- browser compatibility and cross-origin security
- reconnect and session-state edge cases

Mitigation:

- use standard browser APIs only
- define a strict widget security model
- centralize telemetry and reconnect logic

---

## 9. Sources

- MDN Fetch API: <https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API>
- MDN Using the Fetch API: <https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API/Using_Fetch>
- MDN WebSocket API: <https://developer.mozilla.org/en-US/docs/Web/API/WebSocket>
- MDN Server-Sent Events overview: <https://developer.mozilla.org/docs/Web/API/Server-sent_events>
- MDN Using Server-Sent Events: <https://developer.mozilla.org/en-US/docs/Web/API/Server-sent_events/Using_server-sent_events>
- MDN `window.postMessage()`: <https://developer.mozilla.org/en-US/docs/Web/API/Window/postMessage>

---

## 10. BA Conclusion

Website chat should be treated as a **Tier-0 owned channel** for MIABOS. It is the easiest surface to standardize first and should serve as the reference architecture for conversation lifecycle, agent handoff, telemetry, and AI orchestration.
