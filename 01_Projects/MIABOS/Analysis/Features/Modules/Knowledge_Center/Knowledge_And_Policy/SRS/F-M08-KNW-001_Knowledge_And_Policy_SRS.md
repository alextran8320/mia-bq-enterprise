# Feature SRS: F-M08-KNW-001 Knowledge and Policy

**Status**: SRS Ready
**Owner**: A03 BA Agent
**Last Updated By**: Codex CLI (GPT-5.4 Codex environment)
**Last Reviewed By**: A01 PM Agent
**Approval Required**: PM
**Approved By**: A01 PM Agent — Promoted to SRS Ready 2026-04-16; taxonomy fine-tuning + approval owner per domain deferred to BE/integration phase per BQ pilot scope decision
**Last Status Change**: 2026-04-17
**Source of Truth**: This document
**Blocking Reason**: -
**Module**: M08
**Phase**: PB-02 / PB-03
**Priority**: High
**Document Role**: SRS canonical cho lớp knowledge core của `Knowledge_Center`, làm source chuẩn cho FAQ, SOP, policy, và AI runtime answers

---

## 0. Metadata

- Feature ID: `F-M08-KNW-001`
- Related User Story: `US-M08-KNW-001`
- Related PRD: [PRD-M08-KNW-001_Knowledge_And_Policy.md](../../../../../../Planning/PRD/Knowledge_Center/PRD-M08-KNW-001_Knowledge_And_Policy.md)
- Related Screens: unified `/knowledge` workspace, folder tree, import drawer, document detail panel, source detail panel, policy detail, source badge, document version timeline
- Related APIs: `POST /mia/knowledge/query`, `GET /mia/knowledge/documents/:id`, `GET /mia/knowledge/tree`, `POST /mia/knowledge/import`
- Related Tables: `knowledge_document`, `knowledge_document_version`, `knowledge_policy_index`, `knowledge_sop_step`, `knowledge_document_source_link`, `knowledge_document_asset`
- Related Events: `knowledge.document.indexed`, `knowledge.document.published`, `knowledge.document.deprecated`
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

## 0C. Knowledge Object Boundary

Knowledge Center chỉ lưu các đối tượng tri thức đã được diễn giải để người dùng và AI hiểu đúng chính sách/quy trình. Không lưu lại dữ liệu catalog, tồn kho, giá, đơn hàng, hoặc CTKM như source of truth mới.

| Object | Có lưu trong Knowledge Center? | Diễn giải BA |
|--------|-------------------------------|--------------|
| `Knowledge Document` | Có | Đơn vị tài liệu chính: FAQ, SOP, Policy, System Guide. |
| `Knowledge Document Version` | Có | Bản nội dung theo version/effective date để tránh dùng nhầm policy cũ. |
| `Knowledge Topic` | Có | Nhóm tri thức nội bộ như `pricing policy`, `promotion policy`, `customer service`, `store operation`, `ecommerce service`, `system usage`; không phải product category / commerce category. |
| `Policy Rule` | Có | Rule nghiệp vụ đã rút gọn từ policy theo dạng điều kiện và kết quả. |
| `SOP Step` | Có | Một bước hướng dẫn thao tác nằm trong tài liệu SOP, ví dụ `mở KiotViet`, `tra SKU`, `đối chiếu trạng thái`, `escalate cho Store Lead`; đây không phải workflow/task engine. |
| `Source Registry` | Có | Danh mục nguồn và owner/trust/freshness của nguồn. |
| `Document Source Link` | Có | Link tài liệu/version với source backing để biết nội dung dựa vào đâu. |
| `Knowledge Document Asset` | Có | Hình ảnh, bảng chuyển đổi, file đính kèm, hoặc media được import/copy vào version tài liệu để không mất ngữ cảnh khi sync từ nguồn ngoài. |

## 1. User Story

Là `Ban điều hành / vận hành trung tâm`, `CSKH`, `Ecommerce / omnichannel`, `Marketing / trade marketing`, `IT / hệ thống / ERP / data`, hoặc `Tài chính / kế toán / pricing control`, tôi muốn MIABOS có lớp knowledge/policy chuẩn hóa để nhân sự và AI cùng trả lời theo nguồn đã duyệt thay vì dựa vào trí nhớ cá nhân, file rời, hoặc dữ liệu vận hành chưa được giải thích.

## 1A. User Task Flow

| Step | User Role | Action | Task Type | Notes |
|------|-----------|--------|-----------|-------|
| 1 | Knowledge Owner | Import tài liệu từ file/source ngoài hoặc tạo knowledge item mới trong workspace `/knowledge` | Configuration | Intake |
| 2 | Knowledge Owner | Khai báo `document category`, `knowledge topic`, `effective date`, `source links`; kiểm tra rich content gồm hình ảnh, bảng, attachment | Configuration | Structuring |
| 3 | Reviewer / Domain Approver | Kiểm tra nội dung, source backing, owner, và mức độ nhạy cảm trước khi approve | Quick Action | Governance |
| 4 | Hệ thống | Index bản approved vào knowledge runtime, sinh source reference metadata, và cập nhật version timeline | Configuration | Publish |
| 5 | User nội bộ / AI runtime | Query knowledge theo tình huống thực tế như tồn kho, CTKM, đổi trả, SOP xử lý khiếu nại, hướng dẫn hệ thống | Quick Action | Consumption |
| 6 | User nội bộ | Mở source reference detail để xem owner, ngày hiệu lực, version, và freshness của tài liệu | Reporting | Trust check |
| 7 | User nội bộ / PM | Dùng feedback hoặc escalation path nếu tài liệu chưa đủ rõ, đã cũ, hoặc không đủ nguồn | Exception Handling | Feedback loop |

## 2. Business Context

Theo BQ research pack, phase 1 phải giải quyết gói `chatbot nội bộ + knowledge layer + integration foundation`. Vấn đề nền là dữ liệu và policy đang nằm rải ở `SAP B1`, `KiotViet`, `Haravan`, `Excel`, và tài liệu nội bộ; cùng một câu hỏi về `pricing policy`, `promotion policy`, `đổi trả`, `SOP cửa hàng`, hoặc `cách tra cứu hệ thống` dễ nhận nhiều câu trả lời khác nhau tùy người hỏi. Feature này tồn tại để tạo lớp tri thức chuẩn đã duyệt, tách biệt với dữ liệu vận hành thô, từ đó giúp `M09 Internal AI Chat` và `M10 Sales Advisor AI` trả lời có căn cứ thay vì suy diễn.

## 3. Preconditions

- Có taxonomy tri thức tối thiểu theo topic phase 1: `pricing policy`, `promotion policy`, `customer service`, `store operation`, `ecommerce service`, `system usage`.
- Taxonomy này không thay thế hoặc duplicate taxonomy của `Catalog & Commerce`; sản phẩm/SKU/category vẫn thuộc M01-M04 và chỉ được link như source/context khi cần.
- Có cây nội dung chính theo document category: `SOP`, `FAQ`, `Policy`, `System Guide`, `Imported / Chờ phân loại`.
- Có vai trò tối thiểu: `Knowledge Owner`, `Domain Reviewer`, `PM Governance`.
- Có lớp source governance tối thiểu từ `F-M08-KNW-004`.
- Có rule access/sensitivity từ `F-M07-SEC-001`.

## 4. Postconditions

- User nội bộ và AI runtime truy xuất được knowledge đã duyệt cùng source reference, version, owner, effective date, và freshness.
- Knowledge item có lifecycle rõ ràng, không bị overwrite ngầm khi có bản mới.
- Feedback từ runtime hoặc library có đường xử lý rõ qua escalation/backlog ngoài M08 nếu cần, không tạo object analytics/gap riêng trong Knowledge Center.

## 5. Main Flow

1. `Knowledge Owner` mở `/knowledge`, chọn `Import tài liệu` hoặc `Tạo thủ công`.
2. Nếu import, hệ thống nhận file/source, extract text/heading/table/image/attachment, rồi đề xuất category `SOP`, `FAQ`, `Policy`, hoặc `System Guide`; nếu chưa chắc thì đưa vào `Imported / Chờ phân loại`.
3. `Knowledge Owner` gắn `knowledge topic`, `source links`, `owner`, `effective date`, `review cycle`, `sensitivity level`, `applicable channels`, và `applicable personas`.
4. Hệ thống validate metadata bắt buộc và asset integrity; hình ảnh/media lỗi phải hiện warning, không được silent drop.
5. `Domain Reviewer` đọc tóm tắt thay đổi, rich content preview, source evidence, rồi approve hoặc trả về sửa.
6. Khi được approve, hệ thống tạo version runtime, index searchable content, và bảo toàn metadata tham chiếu gồm `title`, `version`, `owner`, `effective date`, `last published date`, `assets`.
7. `M09` hoặc `M10` query knowledge runtime theo `intent + role + channel + sensitivity`.
8. Hệ thống trả answer payload ở dạng `kết luận`, `bằng chứng`, `freshness`, `warning`, `available next action`.
9. User mở source/detail metadata hoặc gửi feedback/escalation nếu tài liệu chưa đủ rõ hoặc outdated.

## 6. Alternate Flows

- Một answer cần ghép nhiều source references từ `policy` và `FAQ` cùng domain.
- Policy mới được publish nhưng policy cũ vẫn cần giữ để audit hoặc đối chiếu lịch sử.
- User bỏ qua chat và đi thẳng vào library/detail để tra cứu manual.
- Một policy chỉ hợp lệ cho `Ecommerce / omnichannel` nhưng không áp dụng cho cửa hàng vật lý.
- Tài liệu sync từ phòng ban khác có hình ảnh hướng dẫn, bảng Excel nhúng, hoặc attachment gốc; hệ thống phải lưu asset và liên kết với version tài liệu.

## 7. Error Flows

- Tài liệu chưa publish nhưng runtime vẫn nhận query trỏ tới nó.
- Source reference trỏ tới version đã deprecated hoặc chưa tới ngày hiệu lực.
- Source backing là `Excel` nhưng chưa có reviewer chấp nhận nó như temporary exception source.
- User có quyền xem answer summary nhưng không có quyền mở detail đầy đủ vì sensitivity level cao.
- File import mất hình ảnh hoặc attachment; hệ thống phải đưa document về trạng thái draft warning cho owner/reviewer xử lý.

## 8. State Machine

`Draft -> In Review -> Approved -> Indexed -> Published -> Superseded / Deprecated`

## 9. UX / Screen Behavior

- Answer card phải hiển thị `kết luận trước`, sau đó là `bằng chứng / policy basis`.
- Knowledge Center phải là một page `/knowledge` chung, gồm folder tree bên trái, command/search bar phía trên, section list ở giữa, và detail/preview panel bên phải.
- Folder tree root gồm `SOP`, `FAQ`, `Policy`, `System Guide`, và `Imported / Chờ phân loại`.
- Có nút `Import tài liệu` ở command bar; `Tạo thủ công` là action phụ.
- Document detail phải render rich content gồm text, heading, table, inline image, attachment, caption/alt text nếu có.
- Source reference panel phải cho thấy `document type`, `owner phòng ban`, `version`, `effective date`, `freshness label`, `source backing`.
- AI answer/reference payload phải render theo `RES-M08-KNW_UX_Patterns_And_IA`: answer summary tối đa 3-4 dòng, scope declaration, source citation block, stale/uncertainty state, quick reply chips, role-aware guidance, và feedback/escalation action.
- SOP detail phải cho thấy các `SOP Step` theo thứ tự thao tác, actor phụ trách, điều kiện áp dụng, và bước escalation nếu quy trình bị chặn.
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

- Nếu `document type = Policy` thì answer runtime bắt buộc phải có ít nhất 1 source reference hợp lệ đang hiệu lực; nếu không, hệ thống phải trả warning `insufficient policy basis`.
- Nếu nguồn backing duy nhất là `Excel` thì document không được promote lên `Published` trừ khi reviewer đánh dấu `temporary source accepted = true`.
- Nếu có version mới được publish cho cùng `document code`, version cũ phải chuyển sang `Superseded` hoặc `Deprecated`; không được overwrite nội dung cũ trong cùng record active.
- Nếu `sensitivity level` của document cao hơn quyền hiện tại của user, hệ thống có thể trả summary an toàn nhưng phải chặn mở full detail.
- Nếu document quá `review cycle` mà chưa republish hoặc revalidate, runtime phải gắn nhãn `stale` và answer không được hiển thị như fully trusted.
- Nếu query đồng thời đụng `transaction data` và `policy knowledge`, UI phải tách rõ phần `data snapshot` và phần `policy explanation`.
- Nếu runtime không tìm thấy source phù hợp hoặc source bị restricted, hệ thống không được trả confident answer; phải trả `uncertain` state với scope searched và escalation/contact action.
- Nếu document có `sop_steps[]`, runtime phải có thể trả `Guided Process` payload thay vì chỉ trả body text.
- Nếu document khai báo `role_guidance[]`, answer phải ưu tiên guidance đúng role/persona/channel hiện tại và hiển thị role-aware header.

## 12. API Contract Excerpt + Canonical Links

- `POST /mia/knowledge/query`
  - Input: `query_text`, `intent`, `role`, `channel`, `branch_scope`, `sensitivity_scope`
  - Output: `answer_summary`, `scope_statement`, `confidence_state`, `source_references[]`, `freshness_status`, `warnings[]`, `role_guidance`, `quick_reply_suggestions[]`, `follow_up_actions[]`, `escalation_action`, `feedback_action`
  - Consumer: `F-M09-AIC-001`, `F-M10-SLS-001`
- `GET /mia/knowledge/documents/:id`
  - Output: `document metadata`, `current version`, `version history`, `source links`, `assets`, `access flags`
- `GET /mia/knowledge/tree`
  - Output: `category tree`, `folder/topic counts`, `stale counts`, `pending review counts`
- `POST /mia/knowledge/import`
  - Input: `source_type`, `file_ref/source_url`, `target_category`, `target_topic`, `owner`, `effective_date`
  - Output: `import_job_id`, `draft_document_id`, `asset_status[]`, `warnings[]`
- Canonical dependencies: `F-M08-KNW-002`, `F-M08-KNW-004`, `F-M07-SEC-001`

## 13. Event / Webhook Contract Excerpt + Canonical Links

- `knowledge.document.indexed`: phát sau khi index/search runtime cập nhật xong.
- `knowledge.document.published`: phát khi document active cho downstream AI.
- `knowledge.document.deprecated`: phát khi rút document khỏi active runtime.
- `M12` có thể consume publish/deprecate events để đo adoption hoặc chất lượng ở lớp observability; Knowledge Center không sở hữu analytics usage object.

## 14. Data / DB Impact Excerpt + Canonical Links

- `knowledge_document`
  - Lưu `document_code`, `document_type`, `knowledge_topic`, `owner_department`, `sensitivity_level`, `review_cycle_days`
- `knowledge_document_version`
  - Lưu `version_number`, `effective_date`, `published_at`, `approval_note`, `superseded_by`
- `knowledge_policy_index`
  - Lưu searchable payload cho runtime, normalized tags, document/version reference, `answer_summary`, `scope_statement`, `quick_reply_suggestions`, `role_guidance`, `escalation_owner`
- `knowledge_sop_step`
  - Lưu step order, actor, action text, expected output, exception/escalation note cho tài liệu SOP
- `knowledge_document_source_link`
  - Lưu link giữa document/version và source backing; không lưu catalog/commerce data thô
- `knowledge_document_asset`
  - Lưu asset thuộc document version: `asset_type`, `source_file_ref`, `storage_ref`, `caption`, `alt_text`, `display_order`, `import_status`, `original_url`
- Mapping source system:
  - `SAP B1` cho pricing / item / partner-linked policies
  - `KiotViet` cho SOP cửa hàng
  - `Haravan` cho ecommerce order/service policies
  - `Excel` chỉ là supporting evidence có kiểm soát

## 15. Validation Rules

- Draft không đủ `document type`, `owner`, `effective date`, `review cycle`, `source links` thì không được gửi review.
- Draft import không được mất asset âm thầm; nếu asset import lỗi phải có `import_status=failed` và warning cho reviewer.
- Source reference runtime phải map đúng `knowledge_document_version` tại thời điểm answer được sinh ra.
- Runtime không được dùng documents ở trạng thái `Draft`, `In Review`, `Restricted`, hoặc `Deprecated`.
- Nếu review cycle quá hạn, system vẫn có thể cho phép mở detail nhưng phải chặn trạng thái `trusted` ở runtime answer.
- Published document dùng cho AI runtime phải có đủ source citation metadata: `title`, `version`, `owner`, `effective_date`, `freshness_status`, và `source_backing`.
- `answer_summary` không được vượt quá 4 dòng trong answer card; nội dung dài phải đi qua detail link hoặc expand.
- Quick reply suggestions chỉ được tạo từ related docs/topics đã qua permission filter.

## 16. Error Codes

- `KNW-001`: Không tìm thấy knowledge đã publish phù hợp với query.
- `KNW-002`: Source reference không hợp lệ hoặc version đã hết hiệu lực.
- `KNW-003`: Document bị sensitivity block cho user / channel hiện tại.
- `KNW-004`: Knowledge item thiếu source backing hoặc freshness validation.
- `KNW-005`: Import tài liệu thất bại hoặc asset trong tài liệu không import đầy đủ.

## 17. Non-Functional Requirements

- `POST /mia/knowledge/query` phải trả kết quả trong `<= 3 giây` cho `95%` queries phase 1.
- Source reference panel phải render metadata cốt lõi trong `<= 1 giây` sau khi answer card xuất hiện.
- Search index phải hỗ trợ tối thiểu `20.000` knowledge records và `50` người dùng nội bộ đồng thời trong pilot mà không degradation nghiêm trọng.
- Import job phải preserve tối thiểu text, heading, table, inline image, và attachment references cho các file phổ biến trong pilot; asset lỗi phải được báo trong `<= 10 giây` sau khi import parse xong.
- Mọi thay đổi status/version phải có audit trail giữ tối thiểu `365 ngày`.

## 18. Acceptance Criteria

- Khi `CSKH` hỏi về đổi trả hoặc bảo hành, hệ thống trả answer có ít nhất 1 source reference hợp lệ với `owner`, `version`, và `effective date`.
- Khi một policy bị supersede bởi version mới, answer runtime mới chỉ dùng version mới; version cũ vẫn mở được ở history/audit state.
- Khi user không đủ quyền mở tài liệu nhạy cảm, UI phải chặn full detail nhưng vẫn giữ hành vi đúng theo access policy đã định.
- Khi document vượt review cycle, answer phải hiện nhãn `stale` hoặc warning tương đương thay vì hiển thị như trusted content.
- Nếu answer hoặc library chưa đủ rõ, UI phải có feedback/escalation path; scope này không tạo gap-report object riêng.
- Khi import tài liệu có hình ảnh, detail view phải hiển thị ảnh đúng vị trí hoặc hiển thị warning rõ nếu ảnh lỗi.
- Khi user mở `/knowledge`, họ phải thấy cùng lúc cây nội dung category, danh sách section, và preview/detail panel mà không phải nhảy qua nhiều page riêng.
- Khi runtime không tìm thấy source hợp lệ, answer phải hiển thị uncertainty signal với `scope_statement`, suggestions, và `Hỏi người thật` / contact action.
- Khi hỏi SOP, hệ thống phải trả được guided step payload gồm step order, actor, action, expected output, và exception/escalation note.

## 19. Test Scenarios

- Query `policy đổi trả` từ role `CSKH` và kiểm tra source reference metadata.
- Query `pricing rule` từ role không đủ quyền và xác minh full detail bị chặn.
- Query không có source phù hợp và xác minh uncertainty signal + escalation action.
- Query SOP vận hành và xác minh guided step payload thay vì wall of text.
- Publish version mới của cùng policy rồi kiểm tra version cũ sang `Superseded`.
- Gửi feedback từ answer/library và xác minh không tạo object gap riêng trong Knowledge Center.
- Import một file có ảnh/bảng/attachment và xác minh `knowledge_document_asset` được tạo, detail panel render đủ rich content.
- Mở `/knowledge`, chọn folder `SOP / Store Operation`, xác minh danh sách và preview panel cập nhật trong cùng page.

## 20. Observability

- Theo dõi tối thiểu ở mức document health: `published document count`, `documents quá review cycle`, `stale document count`, `feedback/escalation count nếu M12 bật đo lường`.

## 21. Rollout / Feature Flag

- Rollout wave 1 cho các domain `pricing`, `promotion`, `đổi trả`, `bảo hành`, `system usage`.
- `Public-safe reuse` cho `M10` chỉ bật sau khi PM chốt danh mục documents external-safe.

## 22. Open Questions

> **Đã chốt — 2026-04-17 bởi Business Owner.**

| Câu hỏi | Quyết định |
|---------|-----------|
| Dual approval áp dụng cho domain nào? | **Không có dual approval** — approval workflow không nằm trên MIABOS; nằm ở SAP |
| `review_cycle_days` per document type | Không áp dụng trong MIABOS; do SAP quản lý |
| Excel-backed policy dùng làm runtime source? | Không áp dụng dual approval flow trong hệ thống này |

**Impact lên UXUI / FE:**
- Loại bỏ toàn bộ dual-approval UI (không có "Chờ duyệt 2" badge, không có dual-approver field)
- Review queue trong KNW-002 chỉ cần 1-reviewer flow
- Document create/edit form không có approval routing selector

## 23. Definition of Done

- MIABOS có lớp knowledge core đủ để feed `M09` và `M10` bằng nguồn đã duyệt, có document/version reference, freshness, source backing, và feedback/escalation path rõ ràng.

## 24. Ready-for-UXUI Checklist

- [ ] UXUI đã chốt knowledge home, source/detail reference pattern, document detail, SOP step display, stale label, và superseded state

## 25. Ready-for-FE-Preview Checklist

- [ ] FE Preview có mock `published`, `stale`, `restricted`, `superseded`, `sop step detail`
- [ ] Stub payload đủ `document_type`, `knowledge_topic`, `owner_department`, `version`, `effective_date`, `freshness_status`, `warnings`, `sop_steps[]`

## 26. Ready-for-BE / Integration Promotion Checklist

- [ ] Contract giữa `M08` và `M09/M10` cho query response + document/version/source reference đã rõ
- [ ] Source backing validation từ `F-M08-KNW-004` đã map vào publish flow
