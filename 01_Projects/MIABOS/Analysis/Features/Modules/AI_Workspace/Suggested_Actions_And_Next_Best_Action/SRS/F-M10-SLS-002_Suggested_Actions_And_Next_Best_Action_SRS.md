# Feature SRS: F-M10-SLS-002 Suggested Actions and Next Best Action

**Status**: Draft
**Owner**: A03 BA Agent
**Last Updated By**: Codex CLI (GPT-5 Codex)
**Last Reviewed By**: A01 PM Agent
**Approval Required**: PM
**Approved By**: -
**Last Status Change**: 2026-04-16
**Source of Truth**: This document
**Blocking Reason**: Cần chốt action taxonomy phase 1, ranh giới giữa recommendation và automation, và cách đo hiệu quả suggestion theo lead/conversation/channel
**Module**: M10
**Phase**: PB-02 / PB-03
**Priority**: High
**Document Role**: SRS canonical cho suggestion engine và next-best-action của `Sales Advisor AI`

---

## 0. Metadata

- Feature ID: `F-M10-SLS-002`
- Related User Story: `US-M10-SLS-002`
- Related PRD: `-`
- Related Screens: suggestion stack, next-best-action panel, rationale tooltip, accepted/dismissed state
- Related APIs: `GET /mia/sales-advisor/suggestions`, `POST /mia/sales-advisor/suggestions/:id/feedback`
- Related Tables: `sales_ai_suggestion`, `sales_ai_suggestion_feedback`, `crm_lead_event`, `sales_chat_session`
- Related Events: `mia.sales.suggestion.generated`, `mia.sales.suggestion.accepted`, `mia.sales.suggestion.dismissed`
- Related Error IDs: `SLS-002`, `SLS-003`, `SLS-004`

## 0B. Integration Source Map

| Source System / Module | Data / Knowledge Type | Usage In This Feature | Truth Level | Notes |
|------------------------|-----------------------|-----------------------|-------------|-------|
| `F-M10-SLS-001` | Conversation context, need-discovery state | Context chính để generate suggestion | Primary source | Không sinh suggestion khi context quá mỏng |
| `M06 CRM` | Lead/customer stage, prior interactions | Xếp hạng action theo follow-up context | Supporting operational source | Dùng cho internal operators |
| `M08 Public-Safe Knowledge` | Policy/FAQ cho CTA explanation | Giải thích tại sao action phù hợp | Knowledge support | Chỉ dùng docs public-safe |
| `M07 Public-Safe Rules` | Policy guardrail | Chặn action/suggestion không phù hợp | Gatekeeper | Không được tự động vượt rule |
| `M12/M14` | Outcome metrics target | Đo effectiveness của suggestion | Analytics consumer | Dùng cho tuning |

## 1. User Story

Là `Sales`, `CRM`, hoặc AI advisor trong bối cảnh bán lẻ BQ, tôi muốn hệ thống gợi ý `next-best-action` phù hợp theo nhu cầu khách và stage hội thoại để không bỏ lỡ cơ hội chuyển đổi hoặc follow-up.

## 1A. User Task Flow

| Step | User Role | Action | Task Type | Notes |
|------|-----------|--------|-----------|-------|
| 1 | Hệ thống | Thu thập context hội thoại, customer intent, stage, channel, prior actions | Reporting | Context |
| 2 | Hệ thống | Sinh 1-n action suggestions có ranking và rationale | Quick Action | Recommendation |
| 3 | Sales / CRM / AI shell | Hiển thị suggestion với lời giải thích dễ hiểu | Quick Action | Decision |
| 4 | User | Accept, dismiss, snooze, hoặc bỏ qua suggestion | Quick Action | Feedback |
| 5 | Hệ thống | Ghi outcome để đánh giá hiệu quả suggestion | Reporting | Learning |

## 2. Business Context

Giá trị kinh doanh của AI sales không chỉ nằm ở câu trả lời, mà ở việc đưa khách hoặc sales nội bộ tới hành động đúng lúc: giữ lead, chuyển cửa hàng phù hợp, gợi ý mẫu tương đương, hẹn tư vấn, hoặc follow-up lại. Với BQ, đây là lớp giúp conversation không bị dừng ở mức `tham khảo vui`, mà đi tiếp tới outcome đo được.

## 3. Preconditions

- `F-M10-SLS-001` đã tạo được conversation context tối thiểu.
- `M06 CRM` có dữ liệu stage hoặc lead context cơ bản.
- Có rule public-safe từ `M07`.

## 4. Postconditions

- Hệ thống sinh được suggested actions có rationale và priority.
- Feedback accept/dismiss được ghi lại để đo hiệu quả.
- Suggestion không tự động thực thi action nhạy cảm.

## 5. Main Flow

1. Hệ thống nhận context từ conversation, customer preference, channel, và nếu có thì lead stage.
2. Engine so context với rule set/action taxonomy phase 1.
3. Hệ thống sinh 1-n suggestions kèm rationale, priority, expected outcome.
4. UI hiển thị suggestion đầu tiên là action ưu tiên cao nhất và các lựa chọn phụ nếu có.
5. User accept/dismiss/snooze hoặc bỏ qua suggestion.
6. Hệ thống log feedback và liên kết outcome với conversation/lead event.

## 6. Alternate Flows

- Context quá mỏng nên chỉ sinh generic CTA.
- Có nhiều suggestions cùng hợp lệ, engine phải xếp hạng.
- Suggestion bị chặn vì policy/public-safe rule.
- Sales nội bộ dùng suggestion panel trong console thay vì khách thấy trực tiếp.

## 7. Error Flows

- Suggestion sai persona hoặc sai stage.
- Suggestion không có rationale khiến user không tin.
- Feedback không log được nên mất outcome measurement.
- Suggestion cũ vẫn hiển thị dù conversation đã sang stage khác.

## 8. State Machine

`Context Ready -> Suggested -> Viewed -> Accepted / Dismissed / Snoozed / Expired`

## 9. UX / Screen Behavior

- Suggestion panel phải nhẹ, dễ quét, không cạnh tranh với CTA chính.
- Mỗi suggestion cần hiển thị `action`, `vì sao gợi ý`, `nếu làm thì kỳ vọng gì`.
- Expired suggestion phải biến mất hoặc chuyển trạng thái non-actionable rõ ràng.

## 10. Role / Permission Rules

- `Sales / CRM`: xem và thao tác đầy đủ với suggestion trong console nội bộ.
- `Khách hàng`: chỉ thấy suggestion nếu nó nằm trong bộ CTA public-safe.
- `PM Governance`: xem aggregate effectiveness, không cần can thiệp từng suggestion.
- `Marketing / trade marketing`: xem aggregate suggestion performance theo campaign/channel nếu được cấp.
- Mọi suggestion public-facing phải pass `M07 public-safe filter`.

## 11. Business Rules

- Mỗi suggestion phải có `action_type`, `rationale`, `priority`, `expected_outcome`; thiếu một trong các trường này thì suggestion không hợp lệ.
- Suggestion không được tự động trigger hành động ảnh hưởng khách; user phải chủ động accept nếu action dẫn tới handoff/lead/contact.
- Nếu context chưa đủ rõ, hệ thống ưu tiên suggestion hỏi thêm hoặc CTA mềm thay vì action mạnh.
- `Dismissed` và `Snoozed` cũng phải được log để học hành vi user, không chỉ `Accepted`.
- Suggestion phải hết hạn khi conversation stage thay đổi đáng kể hoặc sau một khoảng TTL đã định.
- Suggestion public-facing không được gợi ý hành động trái policy hoặc tạo cam kết ngoài public-safe boundary.

## 12. API Contract Excerpt + Canonical Links

- `GET /mia/sales-advisor/suggestions`
  - Input: `session_id`, `lead_id?`, `channel`, `stage`
  - Output: `suggestions[]` gồm `action_type`, `rationale`, `priority`, `expected_outcome`, `expiry_at`
- `POST /mia/sales-advisor/suggestions/:id/feedback`
  - Input: `feedback_type`, `actor_role`, `outcome_note`
- Downstream:
  - Feeds `F-M10-SLS-003` nếu action được accept và dẫn tới CTA/lead
  - Feeds `F-M12-OBS-001` và `F-M14-ANL-001` cho effectiveness metrics

## 13. Event / Webhook Contract Excerpt + Canonical Links

- `mia.sales.suggestion.generated`: khi suggestion được tạo.
- `mia.sales.suggestion.accepted`: khi suggestion được accept.
- `mia.sales.suggestion.dismissed`: khi suggestion bị dismiss hoặc snooze.

## 14. Data / DB Impact Excerpt + Canonical Links

- `sales_ai_suggestion`
  - `session_id`, `action_type`, `rationale`, `priority`, `expected_outcome`, `expiry_at`
- `sales_ai_suggestion_feedback`
  - `suggestion_id`, `feedback_type`, `actor_role`, `feedback_at`, `outcome_note`
- `crm_lead_event`
  - Link suggestion accepted tới lead outcome nếu có
- `sales_chat_session`
  - Source context cho generation

## 15. Validation Rules

- Suggestion phải map đúng stage hiện tại của conversation hoặc lead.
- Expired suggestion không được hiển thị như actionable.
- Feedback phải gắn đúng suggestion ID và actor.
- Suggestion blocked bởi `M07` không được trả ra client.

## 16. Error Codes

- `SLS-002`: Suggested action generation failed.
- `SLS-003`: Suggested action blocked by policy.
- `SLS-004`: Suggested action feedback invalid.

## 17. Non-Functional Requirements

- Suggestion generation phải hoàn tất trong `<= 2 giây` sau khi context đủ.
- Mỗi response suggestion nên chứa tối đa `3` actions để tránh quá tải lựa chọn.
- Outcome metrics phải phản ánh trong analytics trong `<= 10 phút`.
- Suggestion/feedback logs phải giữ tối thiểu `180 ngày`.

## 18. Acceptance Criteria

- Khi context đủ, hệ thống sinh được tối đa `3` suggested actions có rationale và priority rõ ràng.
- User accept/dismiss/snooze được suggestion và feedback được lưu.
- Suggestion hết hạn hoặc không còn đúng stage sẽ không còn hiển thị như actionable.
- Suggestion public-facing không vượt public-safe boundary.
- Suggestion accepted có thể dẫn được sang CTA/handoff flow hoặc lead event.

## 19. Test Scenarios

- Generate suggestion với context đầy đủ.
- Context mỏng chỉ ra generic CTA.
- Suggestion bị policy block.
- User accept suggestion và tạo lead event.
- Suggestion hết hạn sau khi conversation đổi stage.

## 20. Observability

- Theo dõi `suggestion view rate`, `accept rate`, `dismiss rate`, `snooze rate`, `expired unused rate`, `lead uplift by suggestion type`.

## 21. Rollout / Feature Flag

- Mở sau khi `F-M10-SLS-001` ổn định ở sales-safe mode.
- Action taxonomy mở dần theo persona và channel.

## 22. Open Questions

- Bộ action types phase 1 của BQ gồm chính xác những gì?
- Action ranking chỉ rule-based trước hay có score nhẹ?
- KPI chính đo ở level suggestion, lead, hay conversion thực?

## 23. Definition of Done

- Sales Advisor AI không chỉ trả lời mà còn gợi ý được bước đi tiếp theo, có rationale và đo được hiệu quả cơ bản.

## 24. Ready-for-UXUI Checklist

- [ ] UXUI đã chốt suggestion stack, rationale pattern, accepted/dismissed/snoozed states, expired behavior

## 25. Ready-for-FE-Preview Checklist

- [ ] FE Preview có mock `single suggestion`, `multiple suggestions`, `blocked`, `expired`, `accepted`
- [ ] Stub payload đủ `action_type`, `rationale`, `priority`, `expected_outcome`, `expiry_at`

## 26. Ready-for-BE / Integration Promotion Checklist

- [ ] Generation, ranking, expiry, feedback, and outcome logging contracts đã rõ
