# Feature SRS: F-M09-AIC-002 AI Answer History and Trust Review

**Status**: SRS Ready
**Owner**: A03 BA Agent
**Last Updated By**: Claude Code (claude-sonnet-4-6)
**Last Reviewed By**: A01 PM Agent
**Approval Required**: PM
**Approved By**: A01 PM Agent — Promoted to SRS Ready 2026-04-16; open questions deferred to BE/integration phase per BQ pilot scope decision
**Last Status Change**: 2026-04-16
**Source of Truth**: This document
**Blocking Reason**: -
**Module**: M09
**Phase**: PB-02 / PB-03
**Priority**: High
**Document Role**: SRS canonical cho lịch sử answer và trust review của `Internal AI Chat`

---

## 0. Metadata

- Feature ID: `F-M09-AIC-002`
- Related User Story: `US-M09-AIC-002`
- Related PRD: `-`
- Related Screens: answer history list, answer review detail, trust flags panel, review queue, masked transcript state
- Related APIs: `GET /mia/chat/history`, `GET /mia/chat/history/:id`, `POST /mia/chat/review`, `GET /mia/chat/review-queue`
- Related Tables: `chat_answer_history`, `chat_answer_review`, `chat_audit_log`, `chat_answer_snapshot`
- Related Events: `mia.chat.answer.reviewed`, `mia.chat.answer.flagged`, `mia.chat.review_queue_changed`
- Related Error IDs: `AIC-002`, `AIC-003`, `AIC-004`, `AIC-011`

## 0B. Integration Source Map

| Source System / Module | Data / Knowledge Type | Usage In This Feature | Truth Level | Notes |
|------------------------|-----------------------|-----------------------|-------------|-------|
| `F-M09-AIC-001` | Answer snapshots, warning set, citations | Nguồn history và review chính | Primary source | Mọi answer phải được snapshot trước khi review |
| `M08 Knowledge Center` | Citation metadata, freshness context | Hiển thị source trace khi review answer | Supporting source | Không refetch live policy để thay snapshot |
| `M07 Security / Access` | Role/sensitivity masking | Kiểm soát ai được xem transcript/detail nào | Gatekeeper | Bắt buộc với PII hoặc sensitive answer |
| `M12 Observability` | Metrics target | Consume review verdicts và flagged issues | Analytics consumer | Dùng cho trust dashboard |
| `M11 Escalation` | Escalation linkage | Liên kết answer flagged sang human handoff | Workflow consumer | Không tạo queue review tách rời khỏi escalation |

## 1. User Story

Là `PM Governance`, `Ban điều hành / vận hành trung tâm`, `Team Lead CSKH`, `IT / ERP / data`, hoặc user nội bộ cần tự kiểm tra câu trả lời của mình, tôi muốn xem lại lịch sử answer và review các answer rủi ro để biết AI đang trả lời đúng tới đâu và cần sửa knowledge/routing ở đâu.

## 1A. User Task Flow

| Step | User Role                    | Action                                                                          | Task Type     | Notes       |
| ---- | ---------------------------- | ------------------------------------------------------------------------------- | ------------- | ----------- |
| 1    | PM / Team Lead / User nội bộ | Mở answer history theo thời gian, domain, role, user, hoặc verdict              | Reporting     | Entry       |
| 2    | PM / Team Lead               | Mở detail để xem question, answer snapshot, source trace, warning, access scope | Reporting     | Trust check |
| 3    | Reviewer                     | Gắn verdict `Trusted`, `Needs Review`, `Incorrect`, hoặc `Escalated` kèm note   | Quick Action  | Review      |
| 4    | Hệ thống                     | Đưa answer flagged sang review queue hoặc escalation link                       | Configuration | Follow-up   |
| 5    | PM / Ops                     | Xem aggregate issues để ưu tiên knowledge gap, routing fix, hoặc permission fix | Reporting     | Improvement |

## 2. Business Context

Pilot nội bộ chỉ có giá trị nếu BQ nhìn lại được answer history một cách có hệ thống. Cùng một chatbot phase 1 có thể trả được nhanh, nhưng nếu không xem lại các câu `sai`, `thiếu warning`, `thiếu citation`, hoặc `bị block sai`, đội vận hành sẽ không biết nên sửa `Knowledge Center`, integration source, hay rule access. Trust review là lớp phản hồi bắt buộc để pilot không dừng ở cảm tính.

## 3. Preconditions

- `F-M09-AIC-001` đã ghi answer snapshots và audit tối thiểu.
- Có access/sensitivity rules từ `M07`.
- Có observability target ở `M12`.

## 4. Postconditions

- Answer history truy vấn lại được theo use case quản trị và self-review.
- Trust review verdict được lưu, audit được, và feed sang analytics/escalation.
- Sensitive answers vẫn bị mask đúng scope.

## 5. Main Flow

1. Reviewer mở answer history list và lọc theo `domain`, `role`, `warning level`, `verdict`, `date range`.
2. Hệ thống trả list answers đã log cùng summary signals như `answer type`, `warning count`, `citation count`, `escalation status`.
3. Reviewer mở detail của một answer để xem `question`, `answer snapshot`, `source trace snapshot`, `freshness`, `warning`, `blocked reason` nếu có.
4. Reviewer chọn verdict chuẩn và nhập note ngắn về lý do.
5. Nếu verdict là `Needs Review` hoặc `Incorrect`, hệ thống đưa answer vào review queue và liên kết corrective action hoặc escalation.
6. `M12` consume verdicts để tính trust metrics và top issue domains.

## 6. Alternate Flows

- User nội bộ chỉ được xem history cá nhân.
- `Team Lead CSKH` xem history của team mình nhưng transcript nhạy cảm bị mask.
- PM chỉ xem các answers đã flagged trong review queue thay vì toàn bộ lịch sử.
- Một answer đã hết retention full transcript nhưng vẫn giữ metadata summary cho audit.

## 7. Error Flows

- Answer history record tồn tại nhưng thiếu source snapshot.
- User không đủ quyền mở transcript chi tiết.
- Review verdict gửi lên nhưng answer record đã bị purge khỏi detail storage.
- Review queue tạo được nhưng không sync sang `M12` hoặc escalation link.

## 8. State Machine

`Answered -> Logged -> Viewed -> Reviewed / Flagged / Escalated -> Closed`

## 9. UX / Screen Behavior

- History list phải cho filter nhanh theo `domain`, `role`, `warning`, `verdict`, `entry point`, `user`.
- Detail view phải nhấn mạnh `question`, `answer`, `sources`, `warnings`, `why this was risky`.
- Masked state phải nói rõ `nội dung bị ẩn do quyền hạn`.
- Review action phải nhẹ, không biến screen thành form dài.

## 10. Role / Permission Rules

- `Ban điều hành / vận hành trung tâm`: xem aggregate cross-domain history và các answer flagged quan trọng.
- `CSKH Team Lead`: xem history/review của team CSKH trong phạm vi khách hàng và complaint domains.
- `Ecommerce / omnichannel Lead`: xem history domain online order/service.
- `IT / ERP / data`: xem source-level diagnostics và routing/audit detail sâu hơn.
- `PM Governance`: xem toàn bộ review queue và các answers có rủi ro cao.
- `User nội bộ` thông thường: xem lịch sử cá nhân hoặc scope được cấp.

## 11. Business Rules

- Mọi answer từ `F-M09-AIC-001` phải được log kèm `source snapshot`, `warning snapshot`, `answer type`, và `actor role`; nếu thiếu thì answer không đủ điều kiện trust review.
- Review verdict chỉ được dùng tập giá trị chuẩn `Trusted`, `Needs Review`, `Incorrect`, `Escalated`; không cho free-text verdict.
- Nếu answer bị verdict `Incorrect`, hệ thống phải yêu cầu reviewer nhập note nguyên nhân tối thiểu ở mức ngắn.
- Nếu answer đã vượt retention full transcript, hệ thống vẫn phải giữ metadata summary tối thiểu để audit và metric continuity.
- Nếu answer thuộc scope nhạy cảm, transcript/full source detail phải bị mask theo quyền trước khi render review screen.
- Answer đã được escalate phải link ngược được tới escalation record tương ứng.

## 12. API Contract Excerpt + Canonical Links

- `GET /mia/chat/history`
  - Filters: `date_from`, `date_to`, `domain`, `user_role`, `verdict`, `warning_level`, `has_escalation`
- `GET /mia/chat/history/:id`
  - Output: `question`, `answer snapshot`, `source snapshot`, `warnings`, `masking flags`, `review history`
- `POST /mia/chat/review`
  - Input: `answer_id`, `verdict`, `review_note`, `reviewer_role`, `follow_up_type`
- `GET /mia/chat/review-queue`
  - Output: answers cần review theo severity
- Downstream:
  - Feed `F-M09-AIC-003` khi verdict = `Escalated`
  - Feed `F-M12-OBS-001` cho trust metrics

## 13. Event / Webhook Contract Excerpt + Canonical Links

- `mia.chat.answer.reviewed`: phát khi lưu verdict.
- `mia.chat.answer.flagged`: phát khi answer được đánh dấu rủi ro.
- `mia.chat.review_queue_changed`: phát khi answer vào/ra review queue.

## 14. Data / DB Impact Excerpt + Canonical Links

- `chat_answer_history`
  - Summary row cho list/filter
- `chat_answer_snapshot`
  - Full answer/source/warning snapshot tại thời điểm trả lời
- `chat_answer_review`
  - `verdict`, `review_note`, `reviewer_role`, `follow_up_type`, `reviewed_at`
- `chat_audit_log`
  - Trace masking, access, review actions
- Canonical link:
  - Snapshot lấy từ `F-M09-AIC-001`, không recompose live answer khi review

## 15. Validation Rules

- History detail chỉ mở được nếu answer snapshot tồn tại hoặc còn metadata summary hợp lệ.
- Review chỉ hợp lệ nếu reviewer có quyền trong scope answer đó.
- Verdict `Incorrect` hoặc `Escalated` phải có note hoặc follow-up action.
- Masking phải được áp trước khi trả payload history detail.

## 16. Error Codes

- `AIC-002`: Không truy xuất được answer history record.
- `AIC-003`: Review action không hợp lệ hoặc không đủ quyền.
- `AIC-004`: Answer snapshot không đầy đủ cho trust review.
- `AIC-011`: Review queue sync failed.

## 17. Non-Functional Requirements

- History list phải trả kết quả trong `<= 2 giây` cho `95%` truy vấn chuẩn.
- Detail view phải mở trong `<= 3 giây` kể cả khi answer có nhiều citations.
- Full transcript/source snapshot giữ tối thiểu `90 ngày`; metadata summary và review verdict giữ tối thiểu `180 ngày`.
- Review verdict phải xuất hiện trong trust metrics của `M12` với độ trễ `<= 5 phút`.

## 18. Acceptance Criteria

- PM/Lead tra cứu được answer history theo `domain`, `role`, `warning`, `verdict`.
- Mở answer detail thấy đúng snapshot của thời điểm answer được tạo, không bị thay bằng live data mới.
- Reviewer lưu được verdict chuẩn và note, answer xuất hiện đúng trong review queue hoặc escalation flow nếu cần.
- Sensitive transcript bị mask đúng scope quyền.
- M12 nhận được verdict/flagged signal để tính trust metrics.

## 19. Test Scenarios

- Filter history theo `CSKH`, `pricing`, `warning`.
- Review answer có citation đầy đủ và mark `Trusted`.
- Review answer sai và mark `Incorrect` với note.
- Mở answer ngoài quyền và xác minh masked state.
- Detail answer hết retention full transcript nhưng còn metadata summary.

## 20. Observability

- Theo dõi `review coverage`, `flagged rate`, `incorrect rate`, `masked access attempts`, `history retention coverage`, `top issue domains`.

## 21. Rollout / Feature Flag

- Bật đồng thời hoặc ngay sau `F-M09-AIC-001`.
- Review queue full cho PM/Ops bật trước; self-history cho user có thể bật sau vài ngày pilot.

## 22. Open Questions

> **Đã chốt — 2026-04-17 bởi Business Owner.**

| Câu hỏi | Quyết định |
|---------|-----------|
| Transcript retention period | **Lưu không thời hạn** — không tự xóa, không có expire state |
| Team Lead xem transcript của team? | **Có — TL xem toàn bộ transcript không bị mask** |
| Verdict taxonomy mở rộng? | Giữ nguyên 4 verdicts hiện tại trong phase 1 |

**Impact lên UXUI / FE:**
- Loại bỏ `retention-expired state` (S4 Masked) — không còn cần thiết
- Role TL: `masked = false` cho transcript của toàn team
- Masked state chỉ còn áp dụng khi user thường xem transcript người khác ngoài team

## 23. Definition of Done

- BQ có history và trust-review đủ rõ để cải thiện chatbot nội bộ bằng evidence thay vì cảm tính.

## 24. Ready-for-UXUI Checklist

- [ ] UXUI đã chốt history list, detail view, masked state, verdict action, review queue

## 25. Ready-for-FE-Preview Checklist

- [ ] FE Preview có mock `trusted`, `needs review`, `incorrect`, `escalated`, `masked`, `retention expired`
- [ ] Stub payload đủ `answer_type`, `warning_level`, `citation_count`, `verdict`, `masking_flags`

## 26. Ready-for-BE / Integration Promotion Checklist

- [ ] Snapshot retention, review write contract, masking rules, M12 sync contract đã rõ
