# Feature SRS: F-M08-KNW-004 Knowledge Documents and Source Governance

**Status**: SRS Ready
**Owner**: A03 BA Agent
**Last Updated By**: Codex CLI (GPT-5.4 Codex environment)
**Last Reviewed By**: A01 PM Agent
**Approval Required**: PM
**Approved By**: A01 PM Agent — Promoted to SRS Ready 2026-04-16; freshness SLA per source type + internal vs external AI boundary deferred to BE/integration phase per BQ pilot scope decision
**Last Status Change**: 2026-04-17
**Source of Truth**: This document
**Blocking Reason**: -
**Module**: M08
**Phase**: PB-02 / PB-03
**Priority**: High
**Document Role**: SRS canonical cho governance của nguồn tri thức, owner, freshness, trust, và allowed usage trong `Knowledge_Center`

---

## 0. Metadata

- Feature ID: `F-M08-KNW-004`
- Related User Story: `US-M08-KNW-004`
- Related PRD: [PRD-M08-KNW-004_Knowledge_Documents_And_Source_Governance.md](../../../../../../Planning/PRD/Knowledge_Center/PRD-M08-KNW-004_Knowledge_Documents_And_Source_Governance.md)
- Related Screens: `/knowledge` source health section, source registry section, document-source detail panel, freshness section, source rule detail
- Related APIs: `GET /mia/knowledge/sources`, `POST /mia/knowledge/sources`, `POST /mia/knowledge/source-rules`, `GET /mia/knowledge/freshness`
- Related Tables: `knowledge_source_registry`, `knowledge_document_source_link`, `knowledge_freshness_rule`, `knowledge_source_audit_log`, `knowledge_document_asset`
- Related Events: `knowledge.source.registered`, `knowledge.source.rule_changed`, `knowledge.source.stale_detected`, `knowledge.source.restricted`
- Related Error IDs: `KSG-001`, `KSG-002`, `KSG-003`, `KSG-004`, `KSG-005`

## 0B. Integration Source Map

| Source System | Data / Knowledge Type | Governance Need | Truth Level | Notes |
|---------------|-----------------------|-----------------|-------------|-------|
| `SAP B1` | ERP, tồn kho, item master, pricing base, đối tác | Xác định nguồn tham chiếu cho dữ liệu cấu trúc và policy liên quan ERP | Primary structured source | Core cho `IT / ERP / data` và `pricing control`; dữ liệu catalog/transaction vẫn thuộc Catalog & Commerce |
| `KiotViet` | Store POS, store-level inventory, retail operations | Neo SOP cửa hàng và exception theo vận hành bán lẻ | Operational source | Không duplicate dữ liệu POS; chỉ lưu metadata nguồn và source link |
| `Haravan` | Ecommerce order flow, online inventory context, customer service context | Neo policy/FAQ cho online order và omnichannel service | Channel source | Quan trọng cho `Ecommerce / omnichannel` và `CSKH` |
| `Excel` | Policy tables tạm thời, manual promotion logic, exception sheets | Gắn temporary trust level và freshness chặt hơn | Temporary source | Không mặc định là source of truth |
| `Lark` | Workflow approvals, notes, form records | Bổ trợ governance, approval evidence, owner trace | Workflow support | Không là runtime source độc lập |
| `Internal Docs` | SOP/Policy/FAQ đã chuẩn hóa | Đầu ra canonical sau khi publish | Canonical published source | Phải link ngược về upstream source backing |

## 1. User Story

Là `PM Governance`, `IT / hệ thống / ERP / data`, `Tài chính / pricing control`, hoặc `Knowledge Owner`, tôi muốn quản trị rõ từng nguồn tri thức, owner, trust level, freshness rule, và allowed usage để AI chỉ dùng đúng nguồn được phép và không trả lời từ nguồn stale/restricted.

## 1A. User Task Flow

| Step | User Role | Action | Task Type | Notes |
|------|-----------|--------|-----------|-------|
| 1 | Governance / IT | Đăng ký source mới hoặc cập nhật metadata nguồn | Configuration | Registry |
| 2 | Governance | Gắn `owner department`, `trust level`, `allowed personas`, `allowed channels`, `freshness rule` | Configuration | Policy |
| 3 | Knowledge Owner | Link document/assets tới một hoặc nhiều source backing và khai báo source priority | Configuration | Traceability |
| 4 | Hệ thống | Đánh giá freshness/source health theo rule đã cấu hình | Reporting | Monitoring |
| 5 | PM / Governance | Restrict hoặc unrestrict source nếu có rủi ro | Exception Handling | Control |
| 6 | AI runtime | Chỉ tiêu thụ nguồn pass được policy `role + channel + trust + freshness` | Quick Action | Guardrail |

## 2. Business Context

BQ hiện có tri thức và dữ liệu nằm rải ở `SAP B1`, `KiotViet`, `Haravan`, `Excel`, và `Lark`. Research pack đã chỉ ra đây là bài toán source trust nền, nếu không giải thì chatbot, CRM, automation, và forecasting đều mất niềm tin. Feature này là lớp governance để biết tài liệu tri thức dựa vào nguồn nào, source nào chỉ là supporting evidence, source nào stale, và source nào bị cấm dùng cho external-facing AI. Dữ liệu Catalog & Commerce đã có ở hệ nguồn; Knowledge Center không lưu lại dữ liệu đó như object nghiệp vụ mới.

## 3. Preconditions

- Có integration foundation tối thiểu cho `SAP B1`, `KiotViet`, `Haravan`, và `Lark/Excel` sources.
- Có knowledge core từ `F-M08-KNW-001`.
- Có access/sensitivity rules từ `F-M07-SEC-001`.

## 4. Postconditions

- Mỗi source có owner, trust level, freshness SLA, allowed personas/channels, và status rõ ràng.
- Runtime chỉ expose source hợp lệ theo bối cảnh hỏi.
- Source stale/restricted được hiển thị và có audit trail khi rule hoặc trạng thái nguồn thay đổi.

## 5. Main Flow

1. `IT / ERP / data` hoặc `PM Governance` tạo source record, khai báo `source type`, `owner department`, `source scope`, `system endpoint/reference`.
2. Governance gán `trust level`, `allowed channels`, `allowed personas`, và `freshness rule`.
3. `Knowledge Owner` link knowledge document/version tới source backing tương ứng và chỉ rõ source nào là primary.
4. Hệ thống chạy freshness evaluation, so last refresh / last confirm / review cycle với threshold đã cấu hình.
5. Nếu phát hiện source stale hoặc bị governance restrict, hệ thống gắn trạng thái `Warning`, `Stale`, hoặc `Restricted` trực tiếp trên source/document-source link; phase 1 dùng threshold chung `1 giờ`.
6. Runtime query từ `M09` hoặc `M10` chỉ nhận được source set đã pass filter theo role/channel/trust/freshness.
7. Governance cập nhật rule hoặc restrict/unrestrict source để bảo vệ downstream AI.

## 6. Alternate Flows

- Một document có nhiều source backing, ví dụ `Policy` nội bộ + `SAP B1` evidence + `Excel` exception note.
- Một source được phép cho `Internal AI` nhưng bị cấm với `Sales Advisor AI`.
- Nếu hai nguồn có dữ liệu không khớp, Knowledge Center chỉ hiển thị source health/warning ở mức metadata; xử lý reconciliation dữ liệu thuộc integration/Catalog & Commerce hoặc BE phase.
- Tài liệu import có hình ảnh/attachment phải link được asset về source backing để governance thấy scope ảnh hưởng khi source stale/restricted.
- `Excel` source chỉ được active trong khoảng thời gian ngắn cho pilot.

## 7. Error Flows

- Document được publish nhưng chưa link bất kỳ source hợp lệ nào.
- Source thiếu owner hoặc trust level nhưng vẫn bị expose cho runtime.
- Freshness rule cấu hình sai khiến stale source không được phát hiện.
- Source bị restricted nhưng runtime vẫn không chặn/không warning.
- Người chịu trách nhiệm của source nghỉ việc hoặc đổi phòng ban mà không cập nhật ownership.

## 8. State Machine

`Registered -> Active -> Warning / Stale -> Restricted / Active -> Deprecated`

## 9. UX / Screen Behavior

- Source registry phải hiển thị `source type`, `owner department`, `trust level`, `last refresh`, `allowed channels`, `allowed personas`, `status`.
- Freshness board phải cho thấy `days since last refresh`, `threshold`, `affected documents`, `downstream modules impacted`.
- Source governance nằm trong `/knowledge` dưới dạng section/panel, không tách người dùng ra khỏi Knowledge Center workspace.
- Source detail phải hiển thị linked documents/assets để biết tài liệu import nào bị ảnh hưởng bởi source stale/restricted.
- Source status phải feed trực tiếp sang UX patterns của M09: `fresh` -> source citation bình thường, `stale` -> stale warning, `restricted/inactive` -> uncertainty signal + escalation.
- Nếu cần so sánh source A/B ở mức dữ liệu, scope đó thuộc integration/Catalog & Commerce hoặc BE reconciliation.

## 10. Role / Permission Rules

- `IT / hệ thống / ERP / data`: tạo source registry, cập nhật system metadata, monitor sync/freshness signal.
- `PM Governance`: thay trust level, allowed usage, restrict/unrestrict source.
- `Tài chính / pricing control`: reviewer nghiệp vụ cho source liên quan giá/khuyến mãi.
- `CSKH` và `Ecommerce / omnichannel`: không sửa source rules toàn cục nhưng có thể xem source flags ảnh hưởng tới domain của họ.
- `Knowledge Owner`: link document với source backing trong domain được giao.
- `AI runtime`: chỉ consume source đã pass policy filter; không tự bypass `Restricted`.

## 11. Business Rules

- Nếu source không có `owner department`, `trust level`, hoặc `freshness rule`, source đó không được chuyển sang trạng thái `Active`.
- Nếu source bị `Restricted`, runtime không được dùng source đó cho answer mới; chỉ audit/admin views mới được thấy trạng thái chi tiết.
- Nếu nhiều source cùng backing cho một document, document/source link phải có `usage_type` và `priority_rank`; nếu thiếu rule thì runtime phải warning hoặc không dùng source đó.
- Nếu source type là `Excel`, default trust level phải thấp hơn `SAP B1` / `Haravan` / `KiotViet` trừ khi PM Governance override rõ ràng.
- Nếu source được phép cho `Internal AI` nhưng không được phép cho `External-facing AI`, `M10` phải bị chặn dùng source đó ngay cả khi `M09` được phép dùng.
- Một document `Published` phải link tới ít nhất một source backing hợp lệ hoặc explicit `manual canonical policy source`.
- Phase 1 freshness rule mặc định là `1 giờ` cho SAP B1, KiotViet, Excel upload, và tài liệu viết tay; ví dụ UI phải dùng thống nhất threshold này trong mọi mock data.
- M08 không tạo object hoặc workflow xử lý mismatch dữ liệu; source mismatch chỉ hiển thị health/warning và defer reconciliation sang BE/integration hoặc Catalog & Commerce.

## 12. API Contract Excerpt + Canonical Links

- `GET /mia/knowledge/sources`
  - Output: registry list, health flags, trust level, freshness, allowed usage
- `POST /mia/knowledge/sources`
  - Input: `source_type`, `system_name`, `owner_department`, `reference`, `notes`
- `POST /mia/knowledge/source-rules`
  - Input: `source_id`, `trust_level`, `allowed_personas[]`, `allowed_channels[]`, `freshness_rule_id`, `priority_rank`
- `GET /mia/knowledge/freshness`
  - Output: freshness/source health snapshot cho governance
- `GET /mia/knowledge/sources/:id/assets`
  - Output: linked documents/assets bị ảnh hưởng bởi source
- Downstream links:
  - `F-M08-KNW-001` consume source backing status
  - `F-M09-AIC-001` / `F-M10-SLS-001` consume allowed source sets

## 13. Event / Webhook Contract Excerpt + Canonical Links

- `knowledge.source.registered`: phát khi thêm source mới.
- `knowledge.source.rule_changed`: phát khi đổi trust/freshness/allowed usage.
- `knowledge.source.stale_detected`: phát khi vượt freshness threshold.
- `knowledge.source.restricted`: phát khi governance khóa source.
- `M12` có thể dùng các event này để theo dõi stale dashboard và restricted source count.

## 14. Data / DB Impact Excerpt + Canonical Links

- `knowledge_source_registry`
  - `source_id`, `source_type`, `system_name`, `owner_department`, `trust_level`, `status`
- `knowledge_document_source_link`
  - `document_version_id`, `source_id`, `priority_rank`, `usage_type`, `notes`
- `knowledge_freshness_rule`
  - `source_type`, `threshold_hours`, `stale_action`, `warning_level`
- `knowledge_source_audit_log`
  - rule changes, restrict/unrestrict actions, resolution notes
- `knowledge_document_asset`
  - linked imported assets theo source/document version để governance thấy impact của source health
- Source mapping baseline:
  - `SAP B1` = ERP / pricing / product master
  - `KiotViet` = store POS / store inventory / retail ops
  - `Haravan` = ecommerce / online order context
  - `Excel` = temporary exception/promo sheet
  - `Lark` = workflow note/supporting evidence

## 15. Validation Rules

- Source không có owner hoặc freshness rule thì không được active.
- Document/source link phải chỉ rõ source priority nếu có nhiều hơn một nguồn.
- Restricted source không được trả về trong runtime source set cho `M09` hoặc `M10`.
- Source restrict/unrestrict chỉ hợp lệ khi có actor, reason note, và audit log.
- Freshness threshold phase 1 phải validate `threshold_hours = 1` cho các source types đã chốt, trừ khi có quyết định BO mới.

## 16. Error Codes

- `KSG-001`: Source chưa đăng ký hoặc metadata không hợp lệ.
- `KSG-002`: Freshness rule bị thiếu hoặc xung đột.
- `KSG-003`: Source bị restricted cho runtime hiện tại.
- `KSG-004`: Source health không đủ điều kiện runtime.
- `KSG-005`: Source ownership invalid hoặc đã hết hiệu lực.

## 17. Non-Functional Requirements

- Freshness snapshot phải cập nhật ít nhất mỗi `15 phút` cho pilot phase 1.
- Source registry list phải mở trong `<= 2 giây` cho `95%` requests.
- Audit trail của source rule changes phải giữ tối thiểu `365 ngày`.

## 18. Acceptance Criteria

- Governance tạo được source registry với `owner department`, `trust level`, `allowed usage`, và `freshness rule`.
- Khi một source vượt freshness threshold, hệ thống gắn cờ `Stale` và thể hiện được tài liệu/downstream modules bị ảnh hưởng.
- Khi source bị `Restricted`, `M09` và `M10` không được dùng source đó cho answer mới.
- Nếu source health không đủ điều kiện, runtime phải nhận warning hoặc bị chặn theo rule.
- Khi source stale/restricted có linked imported assets, source detail phải hiển thị affected asset/document count.
- Mỗi document `Published` link được tới source backing hợp lệ hoặc manual canonical source có kiểm soát.
- Khi source stale, M09/M10 phải nhận được `stale` warning metadata; khi source restricted, M09/M10 phải nhận được block/uncertainty signal thay vì source content.

## 19. Test Scenarios

- Tạo source mới cho `SAP B1` và gán trust/freshness rules.
- Link document tới nhiều source với priority khác nhau.
- Source `Excel` vượt freshness threshold và bị gắn `Stale`.
- Source stale/restricted và kiểm tra warning/runtime behavior.
- Freshness threshold 1 giờ áp dụng đồng nhất cho SAP B1, KiotViet, Excel upload, và tài liệu viết tay trong FE preview.
- Restrict source rồi query từ `M09`/`M10`.

## 20. Observability

- Theo dõi `source freshness compliance`, `restricted source count`, `Excel-backed active documents`, `downstream modules impacted by stale sources`.

## 21. Rollout / Feature Flag

- Rollout cùng wave nền của `Knowledge_Center`.
- External-facing usage rules chỉ bật sau internal pilot và khi PM chốt sales-safe boundary.

## 22. Open Questions

> **Đã chốt — 2026-04-17 bởi Business Owner.**

| Câu hỏi | Quyết định |
|---------|-----------|
| Source types phase 1 | SAP B1 · KiotViet · Excel upload thủ công (3 sources chuẩn) |
| Freshness SLA tách theo document type? | **Không tách** — dùng **1 giờ** cho tất cả source types |
| Source mismatch chưa resolve: block/warn/fallback? | Xử lý reconciliation dữ liệu defer sang BE/integration hoặc Catalog & Commerce; Knowledge Center chỉ hiển thị source health/warning |

**Freshness threshold áp dụng:**
| Source | Stale sau |
|--------|-----------|
| SAP B1 | 1 giờ |
| KiotViet | 1 giờ |
| Excel upload | 1 giờ |
| Tài liệu viết tay (FAQ, SOP) | 1 giờ |

**Impact lên UXUI / FE:**
- Freshness board: đánh dấu stale khi `last_sync > 1 giờ` — thống nhất tất cả source
- Source Registry: 3 source types với badge tương ứng (SAP B1 / KiotViet / Excel)
- Source mismatch behavior: không có case workflow trong UI phase 1; chỉ hiển thị source health/freshness/restricted state

## 23. Definition of Done

- MIABOS có lớp source governance đủ để kiểm soát trust, freshness, restricted state, và allowed usage của mọi knowledge runtime answer.

## 24. Ready-for-UXUI Checklist

- [ ] UXUI đã chốt source registry, freshness board, restricted state, source rule detail

## 25. Ready-for-FE-Preview Checklist

- [ ] FE Preview có mock `active`, `stale`, `restricted`
- [ ] Stub payload đủ `trust_level`, `freshness_threshold`, `days_since_refresh`, `allowed_channels`, `priority_rank`

## 26. Ready-for-BE / Integration Promotion Checklist

- [ ] Contract source registry, freshness evaluation, runtime source filtering đã rõ
- [ ] Mapping source policy giữa `M08`, `M09`, và `M10` đã neo vào systems landscape
