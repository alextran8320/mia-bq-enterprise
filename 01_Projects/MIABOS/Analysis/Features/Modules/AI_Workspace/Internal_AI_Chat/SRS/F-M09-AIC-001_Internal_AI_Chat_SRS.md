# Feature SRS: F-M09-AIC-001 Internal AI Chat

**Status**: SRS Ready
**Owner**: A03 BA Agent
**Last Updated By**: Codex CLI (GPT-5.4 Codex environment)
**Last Reviewed By**: A01 PM Agent
**Approval Required**: PM
**Approved By**: A01 PM Agent - FE Preview scope approved with mock/stub data on 2026-04-16
**Last Status Change**: 2026-04-16
**Source of Truth**: This document
**Blocking Reason**: -
**Module**: M09
**Phase**: PB-02 / PB-03
**Priority**: High
**Document Role**: SRS canonical cho chatbot nội bộ của MIABOS dùng cho pilot BQ phase 1

---

## 0. Metadata

- Feature ID: `F-M09-AIC-001`
- Related User Story: `US-M09-AIC-001`
- Related Screens: chat console nội bộ, answer card, source trace panel, warning state, escalation CTA, blocked state
- Related APIs: `POST /mia/chat/query`, `GET /mia/chat/suggestions/:id`, `POST /mia/chat/feedback`
- Related Tables: `chat_session`, `chat_message`, `chat_answer_snapshot`, `chat_audit_log`
- Related Events: `mia.chat.answer_generated`, `mia.chat.answer_blocked`, `mia.chat.escalation_created`, `mia.chat.feedback_submitted`
- Related Error IDs: `AIC-001`, `AIC-008`, `AIC-009`, `AIC-010`

## 0B. Integration Source Map

| Source System / Module | Data / Knowledge Type | Usage In Chat | Truth Level | Notes |
|------------------------|-----------------------|---------------|-------------|-------|
| `M08 Knowledge Center` | Policy, SOP, FAQ, system guide | Dùng cho policy explanation, SOP answer, citation, freshness | Canonical knowledge source | Ưu tiên cho answer mang tính rule/policy |
| `SAP B1` | ERP, item master, pricing base, đối tác | Dùng qua integration layer để trả data snapshot có kiểm soát | Structured source | Không expose raw payload trực tiếp |
| `KiotViet` | POS/store inventory, retail ops context | Dùng cho câu hỏi vận hành cửa hàng và tồn theo điểm bán | Operational source | Có thể conflict với ERP, phải có warning/priority |
| `Haravan` | Ecommerce orders, omnichannel context | Dùng cho online order/service questions | Channel source | Quan trọng cho `CSKH` và `Ecommerce` |
| `Excel` | Temporary exception table, manual notes | Chỉ dùng khi governance cho phép và phải gắn warning | Temporary source | Không được silent-use |
| `M07 Security / Access` | Permission, role scope, sensitivity rules | Chặn/giảm scope answer, mask fields, block full detail | Gatekeeper | Bắt buộc chạy trước render answer |
| `M11 Workflow / Escalation` | Handoff workflow | Nhận escalation khi answer không đủ chắc chắn | Operational target | Không để user dead-end |

## 1. User Story

Là `Ban điều hành / vận hành trung tâm`, `CSKH`, `Ecommerce / omnichannel`, `Marketing / trade marketing`, `IT / ERP / data`, hoặc `Tài chính / pricing control`, tôi muốn hỏi MIABOS bằng ngôn ngữ tự nhiên và nhận câu trả lời có nguồn, freshness, warning, và hướng xử lý tiếp theo thay vì phải mở nhiều hệ thống hoặc hỏi nhiều người.

## 1A. User Task Flow

| Step | User Role | Action | Task Type | Notes |
|------|-----------|--------|-----------|-------|
| 1 | User nội bộ | Nhập câu hỏi tự nhiên như `tồn kho`, `CTKM`, `policy đổi trả`, `cách xử lý đơn online`, `cách dùng hệ thống` | Quick Action | Entry |
| 2 | Hệ thống | Phân loại intent, xác định đây là `data question`, `policy question`, `mixed question`, hoặc `out-of-scope` | Quick Action | Intent routing |
| 3 | Hệ thống | Chạy access check theo `M07`, xác định role/channel/branch scope | Configuration | Guardrail |
| 4 | Hệ thống | Query các source phù hợp từ `M08`, integration layer, hoặc cả hai | Quick Action | Retrieval |
| 5 | Hệ thống | Compose answer card theo cấu trúc `kết luận`, `bằng chứng`, `freshness`, `warning`, `next action` | Reporting | Response |
| 6 | User nội bộ | Mở source trace, citation detail, hoặc follow suggested action | Reporting | Trust check |
| 7 | User nội bộ / Hệ thống | Trigger escalation hoặc feedback nếu answer chưa đủ chắc chắn | Exception Handling | Follow-up |

## 2. Business Context

BQ pack xác nhận phase 1 nên là `chatbot nội bộ + knowledge layer + integration foundation` vì cùng lúc giải quyết ba pain points: dữ liệu phân mảnh, policy phân tán, và thời gian hỏi đáp lặp lại giữa các phòng ban. Nội bộ BQ thường phải hỏi các câu kiểu `còn hàng không`, `CTKM áp dụng ra sao`, `policy đổi trả thế nào`, `đơn online đang ở đâu`, `xử lý khiếu nại ra sao`, `thao tác ERP/website thế nào`. Nếu chat không tách bạch được đâu là data snapshot và đâu là policy explanation, người dùng sẽ mất niềm tin rất nhanh.

## 3. Preconditions

- `M08 Knowledge Center` đã có ít nhất các domain phase 1 `pricing`, `promotion`, `đổi trả`, `bảo hành`, `system usage`.
- Integration foundation với `SAP B1`, `KiotViet`, `Haravan` có contract đọc tối thiểu.
- `M07` đã cung cấp access/sensitivity rules.
- Escalation path tối thiểu từ `F-M09-AIC-003` hoặc workflow đích tương đương đã tồn tại.

## 4. Postconditions

- User nhận được answer có `kết luận`, `evidence`, `warning`, `freshness`, `next action`.
- Mọi answer đều được audit và có snapshot đủ để review/trust analysis.
- Query không giải được có lối ra rõ qua escalation hoặc blocked state.

## 5. Main Flow

1. User gửi câu hỏi trong chat shell.
2. Hệ thống normalize query, phân loại intent, và xác định answer type là `Policy`, `Data`, `Mixed`, hoặc `Unsupported`.
3. Hệ thống kiểm tra `role`, `branch`, `channel`, `sensitivity` qua `M07`.
4. Nếu là `Policy`, hệ thống query `M08`; nếu là `Data`, hệ thống query integration source phù hợp; nếu là `Mixed`, hệ thống lấy cả `data snapshot` và `policy citation`.
5. Hệ thống đánh giá freshness/trust của từng source, gắn warning khi source tạm thời, stale, hoặc conflict.
6. Hệ thống render answer card với `kết luận`, `bằng chứng`, `source trace`, `freshness`, `warning`, `next action`.
7. User mở citation, gửi feedback, hoặc tạo escalation nếu answer chưa đủ.

## 6. Alternate Flows

- Một query như `giày mẫu X còn ở đâu và CTKM áp dụng thế nào` cần ghép `inventory snapshot` với `promotion policy`.
- Query vượt scope của user nên chỉ trả summary an toàn thay vì full detail.
- Query chỉ có policy nhưng không có data source nào cần chạm.
- Query không rõ ý nên chat trả follow-up question thay vì đoán.

## 7. Error Flows

- Source data khả dụng nhưng policy backing bị thiếu.
- Policy có citation nhưng source data stale hoặc conflict.
- User hỏi ngoài scope phase 1, hệ thống phải blocked có giải thích.
- Query routing sai khiến answer lấy sai source hoặc sai scope quyền.

## 8. State Machine

`Question Submitted -> Intent Classified -> Authorized -> Retrieved -> Answered / Blocked / Escalated`

## 9. UX / Screen Behavior

- Chat shell phải ưu tiên tốc độ nhập và đọc, không biến thành dashboard dày widget.
- Answer card phải luôn có `kết luận trước`, `details sau`, `warning rõ`, `actions rõ`.
- Nếu answer là `Mixed`, UI phải tách hai khối `Dữ liệu hiện tại` và `Chính sách áp dụng`.
- Nếu answer bị blocked, UI phải nói rõ lý do như `thiếu quyền`, `nguồn chưa đủ tin cậy`, hoặc `ngoài scope`.

## 10. Role / Permission Rules

- `Ban điều hành / vận hành trung tâm`: xem cross-domain summaries và operational metrics được phép.
- `CSKH`: hỏi order/policy/complaint knowledge trong phạm vi customer service.
- `Ecommerce / omnichannel`: hỏi online order/service/channel issues; không mặc định thấy pricing-control internals.
- `Marketing / trade marketing`: hỏi CTKM/campaign-facing policy và collection information.
- `Tài chính / pricing control`: hỏi policy giá, promotion guardrail, và exception rules.
- `IT / ERP / data`: xem technical/source-level diagnostics nhiều hơn các role khác.
- Mọi answer trước khi render phải đi qua `M07` để mask hoặc block field nhạy cảm.

## 11. Business Rules

- Nếu answer type là `Policy` hoặc `Mixed`, answer phải có ít nhất 1 citation hợp lệ từ `M08`; nếu không, hệ thống phải gắn warning `insufficient policy basis`.
- Nếu query chạm dữ liệu từ source đang `stale` hoặc `conflict`, answer không được hiển thị là fully trusted; phải có warning hoặc block tùy rule.
- Nếu user không đủ quyền với dữ liệu chi tiết, hệ thống có thể trả summary an toàn nhưng không được trả raw fields ngoài scope.
- Không được render raw JSON, raw ERP payload, hoặc tên bảng kỹ thuật ra answer card cho user business.
- Nếu intent confidence thấp hơn threshold phase 1, hệ thống phải hỏi lại hoặc đề nghị escalation thay vì tự suy đoán.
- Mọi answer phải log snapshot của `question`, `answer`, `source set`, `warning set`, `actor role`.

## 12. API Contract Excerpt + Canonical Links

- `POST /mia/chat/query`
  - Input: `session_id`, `message`, `user_role`, `branch_scope`, `channel_scope`
  - Output: `answer_type`, `answer_summary`, `data_points[]`, `citations[]`, `freshness_status`, `warnings[]`, `next_actions[]`, `escalation_available`
- `GET /mia/chat/suggestions/:id`
  - Output: follow-up actions hoặc clarifying prompts
- `POST /mia/chat/feedback`
  - Input: `answer_id`, `feedback_type`, `comment`
- Canonical links:
  - Reads `F-M08-KNW-001..004`
  - Uses `F-M07-SEC-001`
  - Emits to `F-M09-AIC-002`, `F-M09-AIC-003`, `F-M12-OBS-001`

## 13. Event / Webhook Contract Excerpt + Canonical Links

- `mia.chat.answer_generated`: phát khi answer card được tạo.
- `mia.chat.answer_blocked`: phát khi answer bị block do permission/policy/trust issue.
- `mia.chat.escalation_created`: phát khi user hoặc system tạo escalation.
- `mia.chat.feedback_submitted`: phát khi user đánh dấu answer chưa ổn.

## 14. Data / DB Impact Excerpt + Canonical Links

- `chat_session`
  - Session metadata, actor role, channel, branch scope
- `chat_message`
  - Question/assistant message timeline
- `chat_answer_snapshot`
  - `answer_type`, `answer_summary`, `source snapshot`, `warnings`, `freshness`, `intent`
- `chat_audit_log`
  - Authorization, routing, source usage, escalation events
- Source mapping:
  - `M08` cho policy/SOP/FAQ
  - `SAP B1/KiotViet/Haravan` cho transactional/operational snapshots qua integration layer

## 15. Validation Rules

- Không render answer nếu access check thất bại.
- `Mixed` answer phải tách được phần policy và phần data snapshot.
- Warning/freshness phải phản ánh đúng source snapshot tại thời điểm trả lời.
- Feedback và escalation chỉ hợp lệ khi answer snapshot tồn tại.

## 16. Error Codes

- `AIC-001`: Internal answer generation failed.
- `AIC-008`: Query routing failed hoặc intent không xác định được.
- `AIC-009`: Answer blocked by access or policy.
- `AIC-010`: Source snapshot incomplete or inconsistent.

## 17. Non-Functional Requirements

- `POST /mia/chat/query` phải trả answer đầu tiên trong `<= 4 giây` cho `95%` phase-1 queries.
- Chat phải hỗ trợ tối thiểu `100` user nội bộ đồng thời trong pilot mà không làm audit/logging mất dữ liệu.
- `chat_answer_snapshot` và `chat_audit_log` phải được giữ tối thiểu `180 ngày`.
- Blocked/failed answer rate phải quan sát được gần real-time với độ trễ `<= 5 phút`.

## 18. Acceptance Criteria

- Khi `CSKH` hỏi về đổi trả, hệ thống trả answer có `citation`, `freshness`, và `warning` đúng theo policy hiện hành.
- Khi `Ecommerce` hỏi câu `mixed` về đơn online và policy áp dụng, answer card tách rõ `data snapshot` và `policy explanation`.
- Khi user hỏi ngoài quyền, hệ thống chặn answer chi tiết và hiển thị lý do blocked thay vì trả dữ liệu thô.
- Khi source đang stale/conflict, answer card có warning hoặc escalation option theo rule.
- Mọi answer được ghi vào snapshot/audit để `F-M09-AIC-002` truy xuất lại được.

## 19. Test Scenarios

- Query `policy đổi trả` từ `CSKH`.
- Query `còn hàng ở cửa hàng nào` từ role hợp lệ.
- Query `đơn online + policy giao hàng` cho mixed answer.
- Query ngoài scope quyền và xác minh blocked state.
- Query low-confidence và xác minh follow-up question hoặc escalation CTA.

## 20. Observability

- Theo dõi `answer success rate`, `blocked rate`, `escalation rate`, `top intents`, `mixed-answer rate`, `stale/conflict answer rate`.

## 21. Rollout / Feature Flag

- Đây là feature ưu tiên cao nhất của phase 1 nội bộ.
- `Mixed answer` và `auto escalation` có thể bật dần nếu PM muốn pilot nhỏ trước.

## 22. Open Questions

Các quyết định dưới đây đủ để mở `UXUI` và `FE Preview` bằng mock/stub data. Backend/integration thật vẫn cần A05 materialize trong Integration Spec trước khi promote `Build Ready`.

| Question | FE Preview Decision | Downstream Note |
|----------|---------------------|-----------------|
| Intent taxonomy phase 1 chốt ở mức nào? | Dùng 4 answer types cho preview: `Policy`, `Data`, `Mixed`, `Unsupported/Blocked`. | Production routing có thể mở rộng thêm sub-intent theo domain sau khi integration layer có dữ liệu thật. |
| Query routing matrix giữa data/policy answers như thế nào? | Preview dùng deterministic routing: policy-only -> `M08`; data-only -> integration snapshot; mixed -> tách `Dữ liệu hiện tại` + `Chính sách áp dụng`; unsupported -> blocked/follow-up. | Source priority thật giữa `SAP B1`, `KiotViet`, `Haravan`, và Excel phải được chốt trong Integration Spec. |
| Low-confidence threshold dùng rule-based hay score-based? | Preview dùng state mock: low-confidence -> follow-up question nếu còn trong scope; stale/conflict/sensitive -> warning hoặc blocked card. | Production cần threshold score/rule cụ thể và audit logic trước BE build. |
| Query nào được phép follow-up, query nào phải escalate ngay? | Follow-up khi thiếu intent/detail nhưng không nhạy cảm; escalate/block khi hỏi ngoài quyền, source conflict nặng, hoặc user bấm `Tạo yêu cầu hỗ trợ`. | Destination routing và payload escalation thuộc `F-M09-AIC-003` / `F-M11-ESC-001`. |
| Trust UI contract cho answer card đã đủ chưa? | Preview dùng type badge + freshness chip + warning badge + source trace + next action theo UXUI `F-M09-AIC-001`. | Label cuối cùng có thể refine sau Business Owner review nhưng không block FE Preview. |

## 23. Definition of Done

- BQ có chatbot nội bộ dùng được cho pilot phase 1, trả lời có trust layer rõ ràng và không để người dùng bị dead-end.

## 24. Ready-for-UXUI Checklist

- [x] UXUI đã chốt chat shell, answer card, blocked state, mixed-answer pattern, source trace, escalation CTA

## 25. Ready-for-FE-Preview Checklist

- [x] FE Preview có mock `policy`, `data`, `mixed`, `blocked`, `warning`, `escalation`
- [x] Stub payload đủ `answer_type`, `citations`, `warnings`, `freshness_status`, `next_actions`

## 26. Ready-for-BE / Integration Promotion Checklist

- [ ] Query orchestration, access check, source routing, answer snapshot contract đã rõ
- [ ] Mapping giữa `M08`, integration layer, `M07`, và escalation path đã rõ
