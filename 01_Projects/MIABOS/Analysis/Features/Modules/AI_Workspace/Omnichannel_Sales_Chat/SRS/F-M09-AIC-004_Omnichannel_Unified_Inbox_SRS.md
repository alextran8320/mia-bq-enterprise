# Feature SRS: F-M09-AIC-004 Omnichannel Unified Inbox

**Status**: Draft
**Owner**: A03 BA Agent
**Last Updated By**: A01 PM Agent (Claude Sonnet 4.6 — Claude Code)
**Last Reviewed By**: A01 PM Agent
**Approval Required**: PM + Business Owner
**Approved By**: —
**Last Status Change**: 2026-04-17
**Source of Truth**: This document
**Blocking Reason**: Chờ Business Owner approve concept trước khi promote lên SRS Ready
**Module**: M09
**Phase**: PB-03
**Priority**: Critical
**Document Role**: SRS canonical cho Omnichannel Unified Inbox — giao diện quản lý hội thoại khách hàng đa kênh của agents nội bộ MIABOS

> **Phân biệt rõ với F-M09-AIC-001 (Internal AI Chat)**
> - `F-M09-AIC-001`: Chatbot nội bộ cho **nhân viên** tra cứu knowledge/policy
> - `F-M09-AIC-004` (file này): Unified Inbox cho **agents** quản lý hội thoại với **khách hàng cuối** qua Facebook, Zalo, Instagram, Website

---

## 0. Metadata

- Feature ID: `F-M09-AIC-004`
- Related PRD: `Planning/PRD/AI_Workspace/PRD-M09-AIC-004_Omnichannel_Unified_Inbox.md` *(cần tạo)*
- Related User Story: `US-M09-AIC-004` *(cần tạo)*
- Related SRS liên kết: `F-M09-AIC-005` (Sales Bot Conversation Engine), `F-M09-AIC-003` (Escalation & Handoff)
- Related Screens: Unified Inbox dashboard, conversation list, chat window, customer detail panel, channel selector, bot toggle, agent assignment
- Related APIs: `GET /inbox/conversations`, `POST /inbox/conversations/:id/assign`, `POST /inbox/conversations/:id/message`, `PATCH /inbox/conversations/:id/bot-toggle`, `GET /inbox/customers/:id`
- Related Tables: `mc_conversations`, `mc_messages`, `mc_conversation_participants`, `customers`, `omni_channels`
- Related Events: `inbox.conversation.created`, `inbox.conversation.assigned`, `inbox.message.received`, `inbox.bot.toggled`, `inbox.conversation.resolved`
- Related Error IDs: `UNI-001`, `UNI-002`, `UNI-003`, `UNI-004`

## 0B. Integration Source Map

| Source System / Channel | Data / Event Type | Usage In Inbox | Truth Level | Notes |
|------------------------|-------------------|----------------|-------------|-------|
| `Facebook Messenger API` | Inbound/outbound messages, user profile | Conversation stream, customer identity | Primary channel source | Requires Meta Business verification |
| `Zalo Official Account API` | Messages, ZNS notifications, follower profile | Conversation stream, proactive messaging | Primary channel source | Kênh ưu tiên cho thị trường Việt Nam |
| `Instagram DM API` | Inbound/outbound DMs, story mentions | Conversation stream | Secondary channel source | Chỉ available qua Meta Business |
| `Website Chat Widget` | WebSocket messages, visitor session | Conversation stream, visitor behavior data | Primary channel source | Full control, proactive trigger mạnh nhất |
| `F-M09-AIC-005` | Bot conversation state, lead score, qualification data | Hiển thị bot status, trigger handoff | Bot engine source | Bot toggle control flow |
| `CRM / customers collection` | Customer profile, history, tags, stage | Customer detail panel | CRM source | Identity linking cross-channel |
| `omni_channels collection` | Channel config, credentials, active status | Channel selector, routing rules | Config source | Admin-managed |
| `M07 Security / Access` | Agent role, permission scope | Giới hạn agent xem/reply đúng channel và branch | Gatekeeper | Bắt buộc check trước mọi action |

---

## 1. User Story

Là `CS Agent`, `Sales Agent`, hoặc `Team Lead`, tôi muốn xem tất cả hội thoại khách hàng từ mọi kênh (Facebook, Zalo, Instagram, Website) trong một dashboard duy nhất, biết được bot đang xử lý hay cần tôi can thiệp, và có thể tiếp quản hoặc reply trực tiếp mà không mất context.

---

## 1A. User Task Flow

| Step | User Role | Action | Task Type | Notes |
|------|-----------|--------|-----------|-------|
| 1 | Agent / Team Lead | Mở Unified Inbox, xem danh sách hội thoại theo filter (channel, status, assignee) | Quick Action | Entry point |
| 2 | Agent | Chọn hội thoại, đọc toàn bộ transcript kể cả lịch sử bot | Reporting | Context load |
| 3 | Agent | Xem Customer Detail Panel (tên, kênh, tags, stage, lịch sử) | Reporting | Customer context |
| 4 | Agent | Toggle bot OFF để tiếp quản, hoặc để bot tiếp tục | Configuration | Handoff control |
| 5 | Agent | Gõ và gửi tin nhắn reply cho khách | Quick Action | Human reply |
| 6 | Agent | Tag conversation, cập nhật stage, gắn note nội bộ | Configuration | CRM update |
| 7 | Team Lead | Assign / reassign conversation cho agent khác | Quick Action | Routing |
| 8 | Agent | Mark conversation as Resolved | Quick Action | Closure |
| 9 | System | Sync resolution về CRM, trigger analytics event | Reporting | Post-close |

---

## 2. Business Context

Giày BQ hiện có khách hàng tiếp cận qua nhiều kênh (Facebook page, Zalo OA, website). Mỗi kênh đang được quản lý riêng lẻ, agents phải mở nhiều tab/tool để trả lời, context khách hàng không được chia sẻ cross-channel. Kết quả: response time chậm, agents hỏi lại thông tin khách đã cung cấp, bỏ lỡ hội thoại trong giờ cao điểm.

Unified Inbox giải quyết đồng thời: tập trung tất cả kênh vào 1 nơi, cho phép bot tự xử lý phần lớn hội thoại (70–85%), agents chỉ can thiệp khi cần, và đảm bảo không hội thoại nào bị bỏ sót.

---

## 3. Preconditions

- `omni_channels` collection đã được cấu hình ít nhất 1 channel active (Website Chat tối thiểu cho Phase 1).
- `F-M09-AIC-005` (Sales Bot Engine) đã deploy và đang nhận/gửi message.
- `customers` collection có identity linking logic (match khách qua phone/email across channels).
- `M07` đã cung cấp agent role/permission rules.
- Agent đã được assign ít nhất 1 channel trong admin config.

---

## 4. Postconditions

- Agent thấy toàn bộ conversation history bao gồm cả phần bot đã xử lý.
- Mọi action của agent (reply, tag, assign, resolve) được log vào audit trail.
- Bot toggle state được sync real-time — khi agent toggle OFF, bot dừng ngay trong conversation đó.
- Customer profile được cập nhật sau mỗi interaction (tag mới, stage mới, note mới).

---

## 5. Main Flow

1. Agent mở Unified Inbox. Hệ thống load danh sách conversations từ tất cả channel đã assign cho agent, sắp xếp theo `last_message_at` DESC, highlight conversations chưa đọc hoặc cần attention.
2. Agent chọn channel filter (All / Facebook / Zalo / Instagram / Web) hoặc status filter (All / Unread / Bot Active / Assigned to Me / Resolved).
3. Agent click vào conversation. Hệ thống load full message thread theo `mc_messages`, kèm indicator rõ đâu là tin bot (`Responded by AI Chatbot`) và đâu là tin agent.
4. Hệ thống hiển thị Customer Detail Panel bên phải: tên, avatar, stage (`Potential` / `Qualified` / `Customer`), channel nguồn, phone, email, tags, attachments, conversation history cross-channel.
5. Nếu bot đang active (toggle ON), agent thấy indicator `Chatbot Active`. Agent có thể toggle OFF để tiếp quản — hệ thống gửi event `inbox.bot.toggled` sang `F-M09-AIC-005`, bot dừng auto-reply trong conversation này.
6. Agent gõ và gửi reply. Hệ thống gửi message qua đúng channel API (Facebook/Zalo/Instagram/Web) tương ứng với conversation đó.
7. Agent cập nhật tags, stage, hoặc gắn internal note (không gửi cho khách).
8. Agent hoặc Team Lead assign conversation sang agent khác nếu cần.
9. Agent mark Resolved. Hệ thống cập nhật status, emit `inbox.conversation.resolved`, sync về CRM.

---

## 6. Alternate Flows

- **Khách nhắn từ 2 kênh khác nhau**: Nếu identity linking match được (cùng phone/email), hệ thống hiển thị cross-channel history trong cùng customer profile. Nếu không match được, tạo 2 conversation profile riêng và flag để agent merge thủ công.
- **Bot không active cho channel/conversation đó**: Toggle indicator ẩn, agent xử lý 100% manual.
- **Agent offline / ngoài giờ**: Conversation vào queue `Unassigned`. System gửi notification cho Team Lead. Bot tiếp tục xử lý theo escalation policy của `F-M09-AIC-005`.
- **Nhiều agent cùng mở 1 conversation**: Hệ thống hiển thị indicator "Agent X đang xem" để tránh reply trùng. Chỉ 1 agent được assign chính thức có quyền reply.

---

## 7. Error Flows

- **Channel API unavailable** (Facebook/Zalo outage): Hiển thị banner channel error, queue outbound messages, retry tự động khi channel recover. Không mất message.
- **Bot toggle sync fail**: Hiển thị warning, không cho phép agent reply cho đến khi toggle state được confirm. Tránh bot và agent cùng reply một lúc.
- **Message send fail**: Hiển thị trạng thái `Failed`, cho phép agent retry thủ công. Log lỗi vào audit.
- **Identity link conflict**: Hai khách có cùng phone/email nhưng khác người → Flag để admin review, không tự động merge.

---

## 8. State Machine

```
Conversation States:
  New → [Bot Active] → Bot Handling
                    → [Bot Toggle OFF / Hot Lead] → Agent Assigned
  New → [No Bot] → Unassigned → Agent Assigned
  Agent Assigned → [Reply sent] → In Progress
  In Progress → [Resolved] → Closed
  Any → [Reopen] → In Progress

Message States:
  Sending → Sent → Delivered → Read
  Sending → Failed → [Retry] → Sent / Failed
```

---

## 9. UX / Screen Behavior

- **Layout 3 cột**: Channel sidebar (trái) | Conversation list (giữa) | Chat window + Customer panel (phải). Tham chiếu: ảnh Business Owner cung cấp ngày 2026-04-17.
- **Conversation list**: Avatar + tên + preview tin cuối + timestamp + unread badge. Đang bot-active hiển thị indicator xanh nhỏ. Cần attention (bot fail / hot lead) highlight đỏ.
- **Chat window**: Tin bot nền vàng nhạt với label `Responded by AI Chatbot`. Tin agent nền trắng với tên agent. Tin khách bên trái không có background đặc biệt. Timestamp mỗi cluster tin nhắn.
- **Bot toggle**: Switch ở góc trên phải chat window, hiển thị rõ `Chatbot Active / Inactive`. Toggle OFF → confirmation dialog trước khi thực hiện.
- **Customer Detail Panel**: Collapsible, scroll độc lập. Sections: Profile info | Stage + Tags | Channel history | Attachments. Edit inline cho stage và tags.
- **Internal note**: Input riêng (khác với reply box), có icon phân biệt, không gửi ra kênh ngoài.
- **Typing indicator**: Hiển thị khi bot hoặc agent đang soạn.
- **Real-time update**: Tin nhắn mới push qua WebSocket, không cần refresh page.

---

## 10. Role / Permission Rules

| Role | Quyền |
|------|-------|
| `CS Agent` | Xem + reply conversations được assign. Toggle bot trong conversation của mình. Tag + note. |
| `Sales Agent` | Như CS Agent, thêm quyền cập nhật stage từ Potential → Qualified → Customer. |
| `Team Lead` | Xem tất cả conversations của team. Assign / reassign. Xem analytics. |
| `Admin` | Cấu hình channels, add/remove agents, xem toàn bộ audit log. |
| Tất cả role | Không được xem conversations ngoài channel scope được assign. |

---

## 11. Business Rules

- Mỗi conversation tại một thời điểm chỉ có 1 agent được assign chính thức. Team Lead có thể reassign bất kỳ lúc nào.
- Khi bot toggle OFF trong một conversation, bot không được tự động toggle lại trừ khi agent toggle ON trở lại hoặc conversation được Resolved và khách nhắn lại.
- Sau khi conversation Resolved, nếu khách nhắn tin trong vòng 24 giờ, tái mở conversation cũ (không tạo mới). Sau 24 giờ thì tạo conversation mới.
- Internal note không được sync ra bất kỳ channel ngoài nào. Phải được mask trong payload gửi cho channel API.
- Agent không được reply qua kênh khác với kênh gốc của conversation (không reply Facebook bằng Zalo).
- Message fail phải được retry tối đa 3 lần tự động. Sau 3 lần fail, flag thủ công cho agent.

---

## 12. API Contract Excerpt + Canonical Links

- `GET /inbox/conversations`
  - Query: `channel`, `status`, `assigned_to`, `page`, `limit`
  - Output: `[{id, customer_name, channel, last_message, last_message_at, status, bot_active, unread_count, assignee}]`

- `GET /inbox/conversations/:id/messages`
  - Output: `[{id, sender_type (bot|agent|customer), sender_name, content, sent_at, status, channel}]`

- `POST /inbox/conversations/:id/message`
  - Input: `content`, `message_type (text|image|template)`, `agent_id`
  - Output: `{message_id, status, sent_at}`

- `PATCH /inbox/conversations/:id/bot-toggle`
  - Input: `bot_active: boolean`, `agent_id`
  - Output: `{conversation_id, bot_active, toggled_at}`

- `POST /inbox/conversations/:id/assign`
  - Input: `agent_id`
  - Output: `{conversation_id, assignee, assigned_at}`

- `GET /inbox/customers/:id`
  - Output: `{id, name, phone, email, stage, tags, channel_history[], attachments[]}`

- Canonical links:
  - Reads from `F-M09-AIC-005` (bot state, lead score)
  - Emits to `F-M09-AIC-003` (escalation), `F-M12-OBS-001` (analytics)
  - Writes to `customers`, `mc_conversations`, `mc_messages`

---

## 13. Event / Webhook Contract Excerpt

- `inbox.conversation.created`: Phát khi conversation mới xuất hiện từ bất kỳ channel nào.
- `inbox.conversation.assigned`: Phát khi conversation được assign cho agent.
- `inbox.message.received`: Phát khi có tin khách hàng mới, kể cả khi bot đang active.
- `inbox.bot.toggled`: Phát khi agent toggle bot ON/OFF. `F-M09-AIC-005` subscribe event này.
- `inbox.conversation.resolved`: Phát khi conversation được đóng.

---

## 14. Data / DB Impact Excerpt

- `mc_conversations`
  - `id`, `channel` (facebook|zalo|instagram|web), `customer_id`, `status`, `bot_active`, `assigned_agent_id`, `created_at`, `resolved_at`

- `mc_messages`
  - `id`, `conversation_id`, `sender_type` (bot|agent|customer), `sender_id`, `content`, `message_type`, `sent_at`, `delivery_status`, `is_internal_note`

- `mc_conversation_participants`
  - `conversation_id`, `agent_id`, `joined_at`, `role` (assigned|observer)

- `omni_channels`
  - `id`, `channel_type`, `credentials`, `active`, `webhook_url`, `assigned_agents[]`

- `customers`
  - Cập nhật `stage`, `tags`, `last_contact_at`, `channel_history[]` sau mỗi resolved conversation

---

## 15. Validation Rules

- Không cho phép reply nếu agent không được assign chính thức cho conversation đó (trừ Team Lead).
- Bot toggle phải sync thành công với `F-M09-AIC-005` trước khi UI cập nhật. Không cho phép trạng thái ambiguous.
- Internal note phải có flag `is_internal_note: true` và không được đưa vào payload gửi ra channel.
- Attachment gửi cho khách phải pass file type/size validation trước khi gửi lên channel API.

---

## 16. Error Codes

- `UNI-001`: Channel API unavailable — queue message, retry.
- `UNI-002`: Bot toggle sync failed — block agent reply until confirmed.
- `UNI-003`: Message send failed after 3 retries — flag manual.
- `UNI-004`: Identity link conflict — flag for admin review, do not auto-merge.

---

## 17. Non-Functional Requirements

- Inbox phải load conversation list trong `<= 1.5 giây` với tối đa 500 active conversations.
- Tin nhắn mới phải xuất hiện real-time trong vòng `<= 1 giây` qua WebSocket.
- Bot toggle phải có hiệu lực trong `<= 2 giây` kể từ khi agent confirm.
- Hệ thống phải hỗ trợ tối thiểu `20 agents` online đồng thời trong pilot mà không degraded UX.
- Message history phải giữ tối thiểu `365 ngày`.
- Uptime target: `99.5%` cho inbox core (conversation list + message thread + send).

---

## 18. Acceptance Criteria

- Agent mở Inbox thấy đủ conversations từ tất cả channel đã được assign, sorted đúng theo `last_message_at`.
- Agent click vào conversation thấy đủ transcript kể cả tin bot, với label phân biệt rõ bot/agent/customer.
- Agent toggle bot OFF → trong vòng 2 giây bot không còn auto-reply trong conversation đó.
- Agent gửi reply → tin xuất hiện trong chat window và được deliver lên channel tương ứng.
- Khi khách hàng nhắn từ 2 kênh khác nhau với cùng phone, Customer Detail Panel hiển thị unified history.
- Internal note không xuất hiện trong conversation phía khách hàng trên bất kỳ channel nào.
- Khi channel API down, agent thấy banner rõ ràng, message được queue, không mất data.

---

## 19. Test Scenarios

- Agent đăng nhập, filter `Unread` → thấy đúng conversations cần attention.
- Agent chọn conversation từ Zalo, thấy transcript, toggle bot OFF, gửi reply → confirm deliver lên Zalo OA.
- Khách nhắn tiếp vào conversation đã Resolved trong 24 giờ → conversation tái mở (không tạo mới).
- Khách nhắn vào conversation Resolved sau 24 giờ → conversation mới được tạo.
- Team Lead reassign conversation từ Agent A sang Agent B → Agent A mất quyền reply ngay.
- Internal note của agent không xuất hiện trong Zalo/Facebook conversation phía khách.

---

## 20. Observability

- `conversations_created_per_channel`: số conversation mới theo kênh (hàng giờ).
- `bot_containment_rate`: % conversation bot xử lý hoàn toàn không cần agent.
- `handoff_rate`: % conversation bot toggle OFF sang agent.
- `agent_response_time_p95`: thời gian từ khi có tin khách đến khi agent reply đầu tiên.
- `message_delivery_fail_rate`: % message fail deliver lên channel API.
- `unassigned_conversation_age_p95`: thời gian conversation nằm unassigned.

---

## 21. Open Questions

- [ ] Phase 1: Implement channel nào trước? Đề xuất: Website Chat → Zalo OA → Facebook → Instagram.
- [ ] Identity linking: Dùng phone/email match hay cần thêm channel-specific user ID linking?
- [ ] Agent notification: Push notification qua browser hay email/SMS khi có conversation mới cần attention?
- [ ] Routing rule: Tự động assign theo round-robin hay agent chọn conversation tự do?
