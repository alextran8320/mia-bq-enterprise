# Feature SRS: F-M08-KNW-001 Knowledge and Policy

**Status**: Draft
**Owner**: A03 BA Agent
**Last Updated By**: Codex CLI (GPT-5 Codex)
**Last Reviewed By**: A01 PM Agent
**Approval Required**: PM
**Approved By**: -
**Last Status Change**: 2026-04-16
**Source of Truth**: This document
**Blocking Reason**: Cần chốt taxonomy knowledge theo domain, approval owner cuối cho từng nhóm policy, và contract citation/freshness được hiển thị thống nhất trong `M09` và `M10`
**Module**: M08
**Phase**: PB-02 / PB-03
**Priority**: High
**Document Role**: SRS canonical cho lớp knowledge core của `Knowledge_Center`, làm source chuẩn cho FAQ, SOP, policy, và AI runtime answers

---

## 0. Metadata

- Feature ID: `F-M08-KNW-001`
- Related User Story: `US-M08-KNW-001`
- Related PRD: [PRD-M08-KNW-001_Knowledge_And_Policy.md](../../../../../../Planning/PRD/Knowledge_Center/PRD-M08-KNW-001_Knowledge_And_Policy.md)
- Related Screens: knowledge home, citation panel, policy detail, source badge, document version timeline
- Related APIs: `POST /mia/knowledge/query`, `GET /mia/knowledge/documents/:id`, `GET /mia/knowledge/citations/:id`, `POST /mia/knowledge/gap-report`
- Related Tables: `knowledge_document`, `knowledge_document_version`, `knowledge_policy_index`, `knowledge_usage_log`, `knowledge_gap_report`
- Related Events: `knowledge.document.indexed`, `knowledge.document.published`, `knowledge.document.deprecated`, `knowledge.gap.reported`
- Related Error IDs: `KNW-001`, `KNW-002`, `KNW-003`, `KNW-004`

## 0B. Integration Source Map

| Source System | Data / Knowledge Type | Usage In This Feature | Truth Level | Notes |
|---------------|-----------------------|-----------------------|-------------|-------|
| `SAP B1` | ERP policy references, item master notes, pricing base, partner rules | Nguồn tham chiếu cho policy vận hành có liên quan ERP và pricing control | System of record cho dữ liệu cấu trúc | Không expose raw ERP payload trực tiếp ra answer |
| `KiotViet` | POS/store-level operational notes, cửa hàng, retail exceptions | Bổ sung SOP vận hành cửa hàng và bối cảnh retail execution | Operational source | Dùng để neo SOP theo ngữ cảnh cửa hàng |
| `Haravan` | Ecommerce workflow, đơn online, omnichannel service rules | Feed policy/FAQ cho ecommerce, CSKH online, và order inquiry | Channel source | Không thay thế policy nội bộ đã duyệt |
| `Excel` | Policy tables tạm thời, exception sheet, promo notes | Chỉ được dùng như nguồn hỗ trợ hoặc temporary evidence | Supporting only | Không được coi là source of truth mặc định |
| `Lark` | Workflow notes, form, approval context | Dùng làm nguồn workflow evidence và owner handoff | Supporting only | Phải link ngược về policy/document chính |
| `Internal Docs` | SOP, FAQ, policy được soạn nội bộ | Nguồn chính cho tri thức đã duyệt trong Knowledge Center | Canonical runtime source sau khi publish | Chỉ bản `Published` mới được AI dùng |

## 1. User Story

Là `Ban điều hành / vận hành trung tâm`, `CSKH`, `Ecommerce / omnichannel`, `Marketing / trade marketing`, `IT / hệ thống / ERP / data`, hoặc `Tài chính / kế toán / pricing control`, tôi muốn MIABOS có lớp knowledge/policy chuẩn hóa để nhân sự và AI cùng trả lời theo nguồn đã duyệt thay vì dựa vào trí nhớ cá nhân, file rời, hoặc dữ liệu vận hành chưa được giải thích.

## 1A. User Task Flow

| Step | User Role | Action | Task Type | Notes |
|------|-----------|--------|-----------|-------|
| 1 | Knowledge Owner | Tạo knowledge item mới hoặc version mới, khai báo `domain`, `document type`, `effective date`, `source links` | Configuration | Intake |
| 2 | Knowledge Owner | Gắn policy summary, structured tags, và scope áp dụng như branch / channel / persona | Configuration | Structuring |
| 3 | Reviewer / Domain Approver | Kiểm tra nội dung, source backing, owner, và mức độ nhạy cảm trước khi approve | Quick Action | Governance |
| 4 | Hệ thống | Index bản approved vào knowledge runtime, sinh citation metadata, và cập nhật version timeline | Configuration | Publish |
| 5 | User nội bộ / AI runtime | Query knowledge theo tình huống thực tế như tồn kho, CTKM, đổi trả, SOP xử lý khiếu nại, hướng dẫn hệ thống | Quick Action | Consumption |
| 6 | User nội bộ | Mở citation detail để xem owner, ngày hiệu lực, version, và freshness của tài liệu | Reporting | Trust check |
| 7 | User nội bộ / PM | Report knowledge gap hoặc conflict khi answer chưa đủ chắc chắn | Exception Handling | Feedback loop |

## 2. Business Context

Theo BQ research pack, phase 1 phải giải quyết gói `chatbot nội bộ + knowledge layer + integration foundation`. Vấn đề nền là dữ liệu và policy đang nằm rải ở `SAP B1`, `KiotViet`, `Haravan`, `Excel`, và tài liệu nội bộ; cùng một câu hỏi về `pricing policy`, `promotion policy`, `đổi trả`, `SOP cửa hàng`, hoặc `cách tra cứu hệ thống` dễ nhận nhiều câu trả lời khác nhau tùy người hỏi. Feature này tồn tại để tạo lớp tri thức chuẩn đã duyệt, tách biệt với dữ liệu vận hành thô, từ đó giúp `M09 Internal AI Chat` và `M10 Sales Advisor AI` trả lời có căn cứ thay vì suy diễn.

## 3. Preconditions

- Có taxonomy knowledge tối thiểu theo các domain phase 1: `product`, `inventory`, `pricing`, `promotion`, `customer service`, `system usage`.
- Có vai trò tối thiểu: `Knowledge Owner`, `Domain Reviewer`, `PM Governance`.
- Có lớp source governance tối thiểu từ `F-M08-KNW-004`.
- Có rule access/sensitivity từ `F-M07-SEC-001`.

## 4. Postconditions

- User nội bộ và AI runtime truy xuất được knowledge đã duyệt cùng citation, version, owner, effective date, và freshness.
- Knowledge item có lifecycle rõ ràng, không bị overwrite ngầm khi có bản mới.
- Gap report từ runtime quay lại backlog knowledge để cải thiện nội dung.

## 5. Main Flow

1. `Knowledge Owner` tạo draft, chọn `document type` là `FAQ`, `SOP`, `Policy`, hoặc `System Guide`, rồi gắn `domain` và `source links`.
2. Hệ thống validate metadata bắt buộc gồm `owner`, `effective date`, `review cycle`, `sensitivity level`, `applicable channels`, và `applicable personas`.
3. `Domain Reviewer` đọc tóm tắt thay đổi, so source evidence với policy text, rồi approve hoặc trả về sửa.
4. Khi được approve, hệ thống tạo version runtime, index searchable content, và sinh citation snapshot gồm `title`, `version`, `owner`, `effective date`, `last published date`.
5. `M09` hoặc `M10` query knowledge runtime theo `intent + role + channel + sensitivity`.
6. Hệ thống trả answer payload ở dạng `kết luận`, `bằng chứng`, `freshness`, `warning`, `available next action`.
7. User mở citation detail hoặc report gap nếu tài liệu chưa đủ rõ, conflict, hoặc outdated.

## 6. Alternate Flows

- Một answer cần ghép nhiều citations từ `policy` và `FAQ` cùng domain.
- Policy mới được publish nhưng policy cũ vẫn cần giữ để audit hoặc đối chiếu lịch sử.
- User bỏ qua chat và đi thẳng vào library/detail để tra cứu manual.
- Một policy chỉ hợp lệ cho `Ecommerce / omnichannel` nhưng không áp dụng cho cửa hàng vật lý.

## 7. Error Flows

- Tài liệu chưa publish nhưng runtime vẫn nhận query trỏ tới nó.
- Citation trỏ tới version đã deprecated hoặc chưa tới ngày hiệu lực.
- Source backing là `Excel` nhưng chưa có reviewer chấp nhận nó như temporary exception source.
- User có quyền xem answer summary nhưng không có quyền mở detail đầy đủ vì sensitivity level cao.

## 8. State Machine

`Draft -> In Review -> Approved -> Indexed -> Published -> Superseded / Deprecated`

## 9. UX / Screen Behavior

- Answer card phải hiển thị `kết luận trước`, sau đó là `bằng chứng / policy basis`.
- Citation panel phải cho thấy `document type`, `owner phòng ban`, `version`, `effective date`, `freshness label`, `source backing`.
- Policy detail phải ưu tiên `quy định chính`, `scope áp dụng`, `ngoại lệ`, rồi mới tới full body.
- Nếu tài liệu bị `Superseded` hoặc `Deprecated`, UI phải cho link sang bản thay thế và gắn cảnh báo rõ.

## 10. Role / Permission Rules

- `Ban điều hành / vận hành trung tâm`: xem toàn bộ policy nội bộ đã publish, bao gồm policy cross-branch.
- `CSKH`: xem SOP xử lý khiếu nại, đổi trả, bảo hành, order inquiry, nhưng không mặc định thấy policy pricing control nội bộ.
- `Ecommerce / omnichannel`: xem knowledge liên quan order online, fulfillment, policy giao hàng, campaign/channel handling.
- `Marketing / trade marketing`: xem policy CTKM, campaign note, collection info, nhưng không sửa policy tài chính.
- `IT / hệ thống / ERP / data`: quản trị metadata, source mapping, và technical validation; không tự approve nội dung nghiệp vụ nếu không phải domain owner.
- `Tài chính / kế toán / pricing control`: reviewer chính cho pricing policy, promotion guardrail, và ngoại lệ liên quan giá.
- `AI runtime`: chỉ tiêu thụ documents có trạng thái `Published` và đã pass filter `role + channel + sensitivity`.

## 11. Business Rules

- Nếu `document type = Policy` thì answer runtime bắt buộc phải có ít nhất 1 citation hợp lệ đang hiệu lực; nếu không, hệ thống phải trả warning `insufficient policy basis`.
- Nếu nguồn backing duy nhất là `Excel` thì document không được promote lên `Published` trừ khi reviewer đánh dấu `temporary source accepted = true`.
- Nếu có version mới được publish cho cùng `document code`, version cũ phải chuyển sang `Superseded` hoặc `Deprecated`; không được overwrite nội dung cũ trong cùng record active.
- Nếu `sensitivity level` của document cao hơn quyền hiện tại của user, hệ thống có thể trả summary an toàn nhưng phải chặn mở full detail.
- Nếu document quá `review cycle` mà chưa republish hoặc revalidate, runtime phải gắn nhãn `stale` và answer không được hiển thị như fully trusted.
- Nếu query đồng thời đụng `transaction data` và `policy knowledge`, UI phải tách rõ phần `data snapshot` và phần `policy explanation`.

## 12. API Contract Excerpt + Canonical Links

- `POST /mia/knowledge/query`
  - Input: `query_text`, `intent`, `role`, `channel`, `branch_scope`, `sensitivity_scope`
  - Output: `answer_summary`, `citations[]`, `freshness_status`, `warnings[]`, `follow_up_actions[]`
  - Consumer: `F-M09-AIC-001`, `F-M10-SLS-001`
- `GET /mia/knowledge/documents/:id`
  - Output: `document metadata`, `current version`, `version history`, `source links`, `access flags`
- `GET /mia/knowledge/citations/:id`
  - Output: citation snapshot tại thời điểm runtime tham chiếu
- `POST /mia/knowledge/gap-report`
  - Dùng khi user báo thiếu tri thức từ chat hoặc library
- Canonical dependencies: `F-M08-KNW-002`, `F-M08-KNW-004`, `F-M07-SEC-001`

## 13. Event / Webhook Contract Excerpt + Canonical Links

- `knowledge.document.indexed`: phát sau khi index/search runtime cập nhật xong.
- `knowledge.document.published`: phát khi document active cho downstream AI.
- `knowledge.document.deprecated`: phát khi rút document khỏi active runtime.
- `knowledge.gap.reported`: phát khi user tạo gap report từ library hoặc chat.
- `M12` consume các events này để đo `citation coverage`, `stale usage`, `top missing intents`.

## 14. Data / DB Impact Excerpt + Canonical Links

- `knowledge_document`
  - Lưu `document_code`, `document_type`, `domain`, `owner_department`, `sensitivity_level`, `review_cycle_days`
- `knowledge_document_version`
  - Lưu `version_number`, `effective_date`, `published_at`, `approval_note`, `superseded_by`
- `knowledge_policy_index`
  - Lưu searchable payload cho runtime, normalized tags, citation snapshot key
- `knowledge_usage_log`
  - Log query, citation open, warning shown, user role, channel context
- `knowledge_gap_report`
  - Log question chưa giải được, missing domain, source mismatch, requester info
- Mapping source system:
  - `SAP B1` cho pricing / item / partner-linked policies
  - `KiotViet` cho SOP cửa hàng
  - `Haravan` cho ecommerce order/service policies
  - `Excel` chỉ là supporting evidence có kiểm soát

## 15. Validation Rules

- Draft không đủ `document type`, `owner`, `effective date`, `review cycle`, `source links` thì không được gửi review.
- Citation runtime phải map đúng `knowledge_document_version` tại thời điểm answer được sinh ra.
- Runtime không được dùng documents ở trạng thái `Draft`, `In Review`, `Restricted`, hoặc `Deprecated`.
- Nếu review cycle quá hạn, system vẫn có thể cho phép mở detail nhưng phải chặn trạng thái `trusted` ở runtime answer.

## 16. Error Codes

- `KNW-001`: Không tìm thấy knowledge đã publish phù hợp với query.
- `KNW-002`: Citation không hợp lệ hoặc version đã hết hiệu lực.
- `KNW-003`: Document bị sensitivity block cho user / channel hiện tại.
- `KNW-004`: Knowledge item thiếu source backing hoặc freshness validation.

## 17. Non-Functional Requirements

- `POST /mia/knowledge/query` phải trả kết quả trong `<= 3 giây` cho `95%` queries phase 1.
- Citation panel phải render metadata cốt lõi trong `<= 1 giây` sau khi answer card xuất hiện.
- Search index phải hỗ trợ tối thiểu `20.000` knowledge records và `50` người dùng nội bộ đồng thời trong pilot mà không degradation nghiêm trọng.
- Mọi thay đổi status/version phải có audit trail giữ tối thiểu `365 ngày`.

## 18. Acceptance Criteria

- Khi `CSKH` hỏi về đổi trả hoặc bảo hành, hệ thống trả answer có ít nhất 1 citation hợp lệ với `owner`, `version`, và `effective date`.
- Khi một policy bị supersede bởi version mới, answer runtime mới chỉ dùng version mới; version cũ vẫn mở được ở history/audit state.
- Khi user không đủ quyền mở tài liệu nhạy cảm, UI phải chặn full detail nhưng vẫn giữ hành vi đúng theo access policy đã định.
- Khi document vượt review cycle, answer phải hiện nhãn `stale` hoặc warning tương đương thay vì hiển thị như trusted content.
- Gap report từ answer hoặc library phải tạo được record trong `knowledge_gap_report`.

## 19. Test Scenarios

- Query `policy đổi trả` từ role `CSKH` và kiểm tra citation metadata.
- Query `pricing rule` từ role không đủ quyền và xác minh full detail bị chặn.
- Publish version mới của cùng policy rồi kiểm tra version cũ sang `Superseded`.
- Report knowledge gap từ answer card và xác minh backlog record được tạo.

## 20. Observability

- Theo dõi `citation coverage rate`, `stale answer rate`, `top missing knowledge intents`, `documents quá review cycle`, `domain có nhiều gap report`.

## 21. Rollout / Feature Flag

- Rollout wave 1 cho các domain `pricing`, `promotion`, `đổi trả`, `bảo hành`, `system usage`.
- `Public-safe reuse` cho `M10` chỉ bật sau khi PM chốt danh mục documents external-safe.

## 22. Open Questions

- Domain nào ở BQ cần dual approval thay vì single reviewer?
- `review_cycle_days` chuẩn cho từng nhóm `Policy`, `SOP`, `FAQ`, `System Guide` là bao nhiêu?
- `Excel-backed policy` có được dùng như temporary runtime source trong pilot hay chỉ để reviewer tham khảo?

## 23. Definition of Done

- MIABOS có lớp knowledge core đủ để feed `M09` và `M10` bằng nguồn đã duyệt, có citation, versioning, freshness, và gap feedback loop rõ ràng.

## 24. Ready-for-UXUI Checklist

- [ ] UXUI đã chốt knowledge home, answer citation pattern, document detail, stale label, superseded state, và gap-report state

## 25. Ready-for-FE-Preview Checklist

- [ ] FE Preview có mock `published`, `stale`, `restricted`, `superseded`, `gap reported`
- [ ] Stub payload đủ `document_type`, `owner_department`, `version`, `effective_date`, `freshness_status`, `warnings`

## 26. Ready-for-BE / Integration Promotion Checklist

- [ ] Contract giữa `M08` và `M09/M10` cho query response + citation snapshot đã rõ
- [ ] Source backing validation từ `F-M08-KNW-004` đã map vào publish flow
