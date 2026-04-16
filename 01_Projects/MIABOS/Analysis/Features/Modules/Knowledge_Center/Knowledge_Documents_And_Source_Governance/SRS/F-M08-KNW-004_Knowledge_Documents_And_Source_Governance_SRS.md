# Feature SRS: F-M08-KNW-004 Knowledge Documents and Source Governance

**Status**: SRS Ready
**Owner**: A03 BA Agent
**Last Updated By**: Claude Code (claude-sonnet-4-6)
**Last Reviewed By**: A01 PM Agent
**Approval Required**: PM
**Approved By**: A01 PM Agent — Promoted to SRS Ready 2026-04-16; freshness SLA per source type + internal vs external AI boundary deferred to BE/integration phase per BQ pilot scope decision
**Last Status Change**: 2026-04-16
**Source of Truth**: This document
**Blocking Reason**: -
**Module**: M08
**Phase**: PB-02 / PB-03
**Priority**: High
**Document Role**: SRS canonical cho governance của nguồn tri thức, owner, freshness, conflict, và allowed usage trong `Knowledge_Center`

---

## 0. Metadata

- Feature ID: `F-M08-KNW-004`
- Related User Story: `US-M08-KNW-004`
- Related PRD: [PRD-M08-KNW-004_Knowledge_Documents_And_Source_Governance.md](../../../../../../Planning/PRD/Knowledge_Center/PRD-M08-KNW-004_Knowledge_Documents_And_Source_Governance.md)
- Related Screens: source registry, document-source detail, freshness board, source conflict view, source rule detail
- Related APIs: `GET /mia/knowledge/sources`, `POST /mia/knowledge/sources`, `POST /mia/knowledge/source-rules`, `GET /mia/knowledge/freshness`, `POST /mia/knowledge/source-conflicts/:id/resolve`
- Related Tables: `knowledge_source_registry`, `knowledge_document_source_link`, `knowledge_freshness_rule`, `knowledge_conflict_case`, `knowledge_source_audit_log`
- Related Events: `knowledge.source.registered`, `knowledge.source.rule_changed`, `knowledge.source.stale_detected`, `knowledge.source.conflict_detected`, `knowledge.source.restricted`
- Related Error IDs: `KSG-001`, `KSG-002`, `KSG-003`, `KSG-004`, `KSG-005`

## 0B. Integration Source Map

| Source System | Data / Knowledge Type | Governance Need | Truth Level | Notes |
|---------------|-----------------------|-----------------|-------------|-------|
| `SAP B1` | ERP, tồn kho, item master, pricing base, đối tác | Xác định source-of-truth cho dữ liệu cấu trúc và policy liên quan ERP | Primary structured source | Core cho `IT / ERP / data` và `pricing control` |
| `KiotViet` | Store POS, store-level inventory, retail operations | Neo SOP cửa hàng và exception theo vận hành bán lẻ | Operational source | Không override ERP policy nếu conflict chưa resolve |
| `Haravan` | Ecommerce order flow, online inventory context, customer service context | Neo policy/FAQ cho online order và omnichannel service | Channel source | Quan trọng cho `Ecommerce / omnichannel` và `CSKH` |
| `Excel` | Policy tables tạm thời, manual promotion logic, exception sheets | Gắn temporary trust level và freshness chặt hơn | Temporary source | Không mặc định là source of truth |
| `Lark` | Workflow approvals, notes, form records | Bổ trợ governance, approval evidence, owner trace | Workflow support | Không là runtime source độc lập |
| `Internal Docs` | SOP/Policy/FAQ đã chuẩn hóa | Đầu ra canonical sau khi publish | Canonical published source | Phải link ngược về upstream source backing |

## 1. User Story

Là `PM Governance`, `IT / hệ thống / ERP / data`, `Tài chính / pricing control`, hoặc `Knowledge Owner`, tôi muốn quản trị rõ từng nguồn tri thức, owner, trust level, freshness rule, và allowed usage để AI chỉ dùng đúng nguồn được phép và hệ thống phát hiện được stale/conflict thay vì trả lời âm thầm sai.

## 1A. User Task Flow

| Step | User Role | Action | Task Type | Notes |
|------|-----------|--------|-----------|-------|
| 1 | Governance / IT | Đăng ký source mới hoặc cập nhật metadata nguồn | Configuration | Registry |
| 2 | Governance | Gắn `owner department`, `trust level`, `allowed personas`, `allowed channels`, `freshness rule` | Configuration | Policy |
| 3 | Knowledge Owner | Link document tới một hoặc nhiều source backing và khai báo source priority | Configuration | Traceability |
| 4 | Hệ thống | Đánh giá stale/conflict theo freshness rule và source priority | Reporting | Monitoring |
| 5 | PM / Governance | Resolve conflict hoặc restrict source nếu có rủi ro | Exception Handling | Control |
| 6 | AI runtime | Chỉ tiêu thụ nguồn pass được policy `role + channel + trust + freshness` | Quick Action | Guardrail |

## 2. Business Context

BQ hiện có tri thức và dữ liệu nằm rải ở `SAP B1`, `KiotViet`, `Haravan`, `Excel`, và `Lark`. Research pack đã chỉ ra đây là bài toán `source-of-truth` nền, nếu không giải thì chatbot, CRM, automation, và forecasting đều mất niềm tin. Feature này là lớp governance để biết câu hỏi nào nên lấy rule từ đâu, source nào chỉ là supporting evidence, source nào stale, và source nào bị cấm dùng cho external-facing AI.

## 3. Preconditions

- Có integration foundation tối thiểu cho `SAP B1`, `KiotViet`, `Haravan`, và `Lark/Excel` sources.
- Có knowledge core từ `F-M08-KNW-001`.
- Có access/sensitivity rules từ `F-M07-SEC-001`.

## 4. Postconditions

- Mỗi source có owner, trust level, freshness SLA, allowed personas/channels, và status rõ ràng.
- Runtime chỉ expose source hợp lệ theo bối cảnh hỏi.
- Conflict/stale cases được hiển thị và xử lý có audit trail.

## 5. Main Flow

1. `IT / ERP / data` hoặc `PM Governance` tạo source record, khai báo `source type`, `owner department`, `source scope`, `system endpoint/reference`.
2. Governance gán `trust level`, `allowed channels`, `allowed personas`, `freshness rule`, `conflict priority`.
3. `Knowledge Owner` link knowledge document/version tới source backing tương ứng và chỉ rõ source nào là primary.
4. Hệ thống chạy freshness evaluation, so last refresh / last confirm / review cycle với threshold đã cấu hình.
5. Nếu phát hiện stale hoặc conflict, hệ thống tạo case và gắn trạng thái `Warning`, `Restricted`, hoặc `Conflict`.
6. Runtime query từ `M09` hoặc `M10` chỉ nhận được source set đã pass filter theo role/channel/trust/freshness.
7. Governance resolve case, cập nhật rule hoặc restrict source để bảo vệ downstream AI.

## 6. Alternate Flows

- Một document có nhiều source backing, ví dụ `Policy` nội bộ + `SAP B1` evidence + `Excel` exception note.
- Một source được phép cho `Internal AI` nhưng bị cấm với `Sales Advisor AI`.
- Conflict giữa `KiotViet` và `SAP B1` được tạm xử lý bằng priority rule, chưa cần merge dữ liệu ngay.
- `Excel` source chỉ được active trong khoảng thời gian ngắn cho pilot.

## 7. Error Flows

- Document được publish nhưng chưa link bất kỳ source hợp lệ nào.
- Source thiếu owner hoặc trust level nhưng vẫn bị expose cho runtime.
- Freshness rule cấu hình sai khiến stale case không được phát hiện.
- Conflict đã bị flag nhưng runtime vẫn không chặn/không warning.
- Người chịu trách nhiệm của source nghỉ việc hoặc đổi phòng ban mà không cập nhật ownership.

## 8. State Machine

`Registered -> Active -> Warning / Stale / Conflict -> Restricted / Resolved -> Deprecated`

## 9. UX / Screen Behavior

- Source registry phải hiển thị `source type`, `owner department`, `trust level`, `last refresh`, `allowed channels`, `allowed personas`, `status`.
- Freshness board phải cho thấy `days since last refresh`, `threshold`, `affected documents`, `downstream modules impacted`.
- Conflict view phải so sánh rõ `source A`, `source B`, `field/domain conflicted`, `priority rule`, `current runtime effect`.

## 10. Role / Permission Rules

- `IT / hệ thống / ERP / data`: tạo source registry, cập nhật system metadata, monitor sync/freshness signal.
- `PM Governance`: thay trust level, allowed usage, restrict/unrestrict source, đóng conflict case.
- `Tài chính / pricing control`: reviewer nghiệp vụ cho source liên quan giá/khuyến mãi.
- `CSKH` và `Ecommerce / omnichannel`: không sửa source rules toàn cục nhưng có thể xem source flags ảnh hưởng tới domain của họ.
- `Knowledge Owner`: link document với source backing trong domain được giao.
- `AI runtime`: chỉ consume source đã pass policy filter; không tự bypass `Restricted`.

## 11. Business Rules

- Nếu source không có `owner department`, `trust level`, hoặc `freshness rule`, source đó không được chuyển sang trạng thái `Active`.
- Nếu source bị `Restricted`, runtime không được dùng source đó cho answer mới; chỉ audit/admin views mới được thấy trạng thái chi tiết.
- Nếu conflict giữa hai source cùng domain chưa resolve, runtime phải theo `priority rule` hoặc trả warning; không được ngầm chọn nguồn không có rule.
- Nếu source type là `Excel`, default trust level phải thấp hơn `SAP B1` / `Haravan` / `KiotViet` trừ khi PM Governance override rõ ràng.
- Nếu source được phép cho `Internal AI` nhưng không được phép cho `External-facing AI`, `M10` phải bị chặn dùng source đó ngay cả khi `M09` được phép dùng.
- Một document `Published` phải link tới ít nhất một source backing hợp lệ hoặc explicit `manual canonical policy source`.

## 12. API Contract Excerpt + Canonical Links

- `GET /mia/knowledge/sources`
  - Output: registry list, health flags, trust level, freshness, allowed usage
- `POST /mia/knowledge/sources`
  - Input: `source_type`, `system_name`, `owner_department`, `reference`, `notes`
- `POST /mia/knowledge/source-rules`
  - Input: `source_id`, `trust_level`, `allowed_personas[]`, `allowed_channels[]`, `freshness_rule_id`, `priority_rank`
- `GET /mia/knowledge/freshness`
  - Output: stale/conflict snapshot cho governance và `M12`
- `POST /mia/knowledge/source-conflicts/:id/resolve`
  - Input: `resolution_type`, `resolved_by`, `resolution_note`
- Downstream links:
  - `F-M08-KNW-001` consume source backing status
  - `F-M09-AIC-001` / `F-M10-SLS-001` consume allowed source sets

## 13. Event / Webhook Contract Excerpt + Canonical Links

- `knowledge.source.registered`: phát khi thêm source mới.
- `knowledge.source.rule_changed`: phát khi đổi trust/freshness/allowed usage.
- `knowledge.source.stale_detected`: phát khi vượt freshness threshold.
- `knowledge.source.conflict_detected`: phát khi có mismatch giữa sources.
- `knowledge.source.restricted`: phát khi governance khóa source.
- `M12` dùng các event này để theo dõi stale dashboard, conflict backlog, restricted source count.

## 14. Data / DB Impact Excerpt + Canonical Links

- `knowledge_source_registry`
  - `source_id`, `source_type`, `system_name`, `owner_department`, `trust_level`, `status`
- `knowledge_document_source_link`
  - `document_version_id`, `source_id`, `priority_rank`, `usage_type`, `notes`
- `knowledge_freshness_rule`
  - `source_type`, `threshold_hours`, `stale_action`, `warning_level`
- `knowledge_conflict_case`
  - `domain`, `field_name`, `source_a`, `source_b`, `priority_rule`, `state`
- `knowledge_source_audit_log`
  - rule changes, restrict/unrestrict actions, resolution notes
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
- Conflict case chỉ được đóng khi có resolution note và actor hợp lệ.

## 16. Error Codes

- `KSG-001`: Source chưa đăng ký hoặc metadata không hợp lệ.
- `KSG-002`: Freshness rule bị thiếu hoặc xung đột.
- `KSG-003`: Source bị restricted cho runtime hiện tại.
- `KSG-004`: Conflict chưa resolve.
- `KSG-005`: Source ownership invalid hoặc đã hết hiệu lực.

## 17. Non-Functional Requirements

- Freshness snapshot phải cập nhật ít nhất mỗi `15 phút` cho pilot phase 1.
- Source registry list phải mở trong `<= 2 giây` cho `95%` requests.
- Conflict detection batch phải hoàn tất trong `<= 10 phút` sau khi nhận source refresh signal.
- Audit trail của source rule changes phải giữ tối thiểu `365 ngày`.

## 18. Acceptance Criteria

- Governance tạo được source registry với `owner department`, `trust level`, `allowed usage`, và `freshness rule`.
- Khi một source vượt freshness threshold, hệ thống gắn cờ `Stale` và thể hiện được tài liệu/downstream modules bị ảnh hưởng.
- Khi source bị `Restricted`, `M09` và `M10` không được dùng source đó cho answer mới.
- Khi có conflict giữa hai nguồn cùng domain, hệ thống tạo conflict case với `priority rule` hoặc warning phù hợp.
- Mỗi document `Published` link được tới source backing hợp lệ hoặc manual canonical source có kiểm soát.

## 19. Test Scenarios

- Tạo source mới cho `SAP B1` và gán trust/freshness rules.
- Link document tới nhiều source với priority khác nhau.
- Source `Excel` vượt freshness threshold và bị gắn `Stale`.
- Conflict giữa `SAP B1` và `KiotViet` trên cùng domain và kiểm tra warning/runtime behavior.
- Restrict source rồi query từ `M09`/`M10`.

## 20. Observability

- Theo dõi `source freshness compliance`, `restricted source count`, `conflict backlog`, `Excel-backed active documents`, `downstream modules impacted by stale sources`.

## 21. Rollout / Feature Flag

- Rollout cùng wave nền của `Knowledge_Center`.
- External-facing usage rules chỉ bật sau internal pilot và khi PM chốt sales-safe boundary.

## 22. Open Questions

- Bộ source types chuẩn cho BQ phase 1 sẽ chốt ở mức nào?
- Freshness SLA có cần tách riêng cho `Policy`, `FAQ`, `System Guide`, `Promo Note` không?
- Khi conflict kéo dài chưa resolve, runtime nên `block`, `warn`, hay `fallback` theo từng domain?

## 23. Definition of Done

- MIABOS có lớp source governance đủ để kiểm soát trust, freshness, conflict, và allowed usage của mọi knowledge runtime answer.

## 24. Ready-for-UXUI Checklist

- [ ] UXUI đã chốt source registry, freshness board, conflict view, restricted state, resolution flow

## 25. Ready-for-FE-Preview Checklist

- [ ] FE Preview có mock `active`, `stale`, `conflict`, `restricted`, `resolved`
- [ ] Stub payload đủ `trust_level`, `freshness_threshold`, `days_since_refresh`, `allowed_channels`, `priority_rank`

## 26. Ready-for-BE / Integration Promotion Checklist

- [ ] Contract source registry, freshness evaluation, conflict detection, runtime source filtering đã rõ
- [ ] Mapping source policy giữa `M08`, `M09`, và `M10` đã neo vào systems landscape
