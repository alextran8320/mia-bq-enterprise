# Feature SRS: F-M08-KNW-002 Knowledge Publishing Queue

**Status**: SRS Ready
**Owner**: A03 BA Agent
**Last Updated By**: Claude Code (claude-sonnet-4-6)
**Last Reviewed By**: A01 PM Agent
**Approval Required**: PM
**Approved By**: A01 PM Agent — Promoted to SRS Ready 2026-04-16; approval matrix per domain + SLA specifics deferred to BE/integration phase per BQ pilot scope decision
**Last Status Change**: 2026-04-16
**Source of Truth**: This document
**Blocking Reason**: -
**Module**: M08
**Phase**: PB-02 / PB-03
**Priority**: High
**Document Role**: SRS canonical cho hàng đợi review, approve, publish, freeze, và rollback của `Knowledge_Center`

---

## 0. Metadata

- Feature ID: `F-M08-KNW-002`
- Related User Story: `US-M08-KNW-002`
- Related PRD: [PRD-M08-KNW-002_Knowledge_Publishing_Queue.md](../../../../../../Planning/PRD/Knowledge_Center/PRD-M08-KNW-002_Knowledge_Publishing_Queue.md)
- Related Screens: publishing queue, review detail, version diff compare, approval history, rollback confirmation
- Related APIs: `GET /mia/knowledge/publishing-queue`, `POST /mia/knowledge/publish-request`, `POST /mia/knowledge/approve`, `POST /mia/knowledge/reject`, `POST /mia/knowledge/rollback`
- Related Tables: `knowledge_publish_request`, `knowledge_publish_approval`, `knowledge_document_version`, `knowledge_publish_incident`
- Related Events: `knowledge.publish.requested`, `knowledge.publish.approved`, `knowledge.publish.rejected`, `knowledge.publish.rolled_back`, `knowledge.publish.failed`
- Related Error IDs: `KPQ-001`, `KPQ-002`, `KPQ-003`, `KPQ-004`, `KPQ-005`

## 0B. Integration Source Map

| Source System | Data / Workflow Used | Usage In Queue | Truth Level | Notes |
|---------------|----------------------|----------------|-------------|-------|
| `Internal Docs` | Draft policy/SOP/FAQ text | Nguồn nội dung chính chờ review/publish | Canonical content source | Bản approved mới thành runtime source |
| `SAP B1` | ERP-linked evidence, pricing base, partner rules | Reviewer dùng để verify policy basis | Structured evidence | Không publish raw ERP data qua queue |
| `KiotViet` | Store operations evidence | So sánh SOP cửa hàng và tình huống retail | Operational evidence | Hữu ích cho branch/store SOP |
| `Haravan` | Ecommerce workflow evidence | Verify policy/order flow cho omnichannel | Channel evidence | Dùng cho CSKH/ecommerce policies |
| `Excel` | Temporary promo/policy tables | Chỉ làm supporting attachment | Temporary evidence | Bắt buộc reviewer xác nhận khi dùng |
| `Lark` | Approval workflow notes | Hỗ trợ comment/decision context | Workflow support | Không thay thế publish audit trong MIABOS |

## 1. User Story

Là `Knowledge Owner`, `Tài chính / kế toán / pricing control`, `CSKH`, `Ecommerce / omnichannel`, hoặc `PM Governance`, tôi muốn có publishing queue rõ ràng để knowledge chỉ được đưa vào runtime sau khi đã được reviewer đúng domain kiểm tra, phê duyệt, và vẫn rollback/freeze được khi phát hiện sai.

## 1A. User Task Flow

| Step | User Role | Action | Task Type | Notes |
|------|-----------|--------|-----------|-------|
| 1 | Knowledge Owner | Gửi draft hoặc version mới vào queue cùng change summary, source evidence, effective date | Configuration | Submit |
| 2 | Hệ thống | Tạo request, tính domain reviewer theo approval matrix, và gắn SLA review | Configuration | Routing |
| 3 | Reviewer | Mở review detail, xem diff giữa version cũ và version mới, source backing, affected personas/channels | Quick Action | Review |
| 4 | Reviewer | Approve, reject, hoặc request changes với comment có cấu trúc | Quick Action | Decision |
| 5 | Hệ thống | Nếu approved thì publish bản mới sang runtime index, cập nhật active version, và ghi audit | Configuration | Publish |
| 6 | PM / Governance | Nếu có incident sau publish thì freeze hoặc rollback sang version trước | Exception Handling | Control |

## 2. Business Context

BQ có nhiều policy nhạy cảm ở `pricing`, `promotion`, `đổi trả`, và SOP đa kênh. Nếu nhân sự cập nhật thẳng vào runtime mà không qua publishing queue, internal AI rất dễ trả sai rule theo từng thời điểm, đặc biệt khi nguồn thực tế đang nằm xen giữa `SAP B1`, `Haravan`, `KiotViet`, và các bảng `Excel` tạm. Queue này là lớp kiểm soát bắt buộc để `Knowledge_Center` không trở thành kho tài liệu không kiểm soát được.

## 3. Preconditions

- Có document draft hoặc version mới hợp lệ từ `F-M08-KNW-001`.
- Có source governance và trust level từ `F-M08-KNW-004`.
- Có role matrix tối thiểu cho `Knowledge Owner`, `Domain Reviewer`, `PM Governance`.

## 4. Postconditions

- Chỉ version đã `Approved` và publish thành công mới trở thành runtime version.
- Mọi quyết định approve, reject, rollback, freeze đều có audit trail, comment, và owner rõ.
- Publish incident có record riêng để trace root cause.

## 5. Main Flow

1. `Knowledge Owner` submit version mới cùng `change summary`, `effective date`, `source links`, `affected domains`, `affected channels`.
2. Hệ thống kiểm tra metadata bắt buộc, xác định reviewer theo domain như `pricing control`, `CSKH`, `Ecommerce / omnichannel`, hoặc `PM Governance`.
3. Reviewer mở diff compare, đối chiếu source backing, kiểm tra policy impact và sensitivity.
4. Reviewer chọn `Approve`, `Reject`, hoặc `Request Changes`; mọi decision đều phải có comment.
5. Nếu `Approve`, hệ thống chạy publish job, re-index runtime, và xác nhận active version mới.
6. Nếu publish job thất bại, request chuyển sang `Publish Failed` thay vì `Published`.
7. Nếu có incident sau publish, `PM Governance` có thể `Freeze Runtime` hoặc `Rollback` sang version trước, đồng thời tạo incident log.

## 6. Alternate Flows

- Domain nhạy cảm như `pricing` cần thêm reviewer thứ hai trước khi publish.
- Request bị reject nhưng owner sửa minor issue và resubmit trên cùng lineage.
- Publish thành công nhưng cần `freeze` tạm thời do conflict từ source system.
- Một request chỉ thay metadata hoặc effective date mà không đổi body chính.

## 7. Error Flows

- Request thiếu source evidence hoặc effective date.
- Reviewer không đúng domain cố approve request.
- Publish job chạy xong nhưng runtime index chưa xác nhận active version.
- Rollback target đã bị deprecated cứng hoặc thiếu source snapshot.
- Freeze được bật nhưng `M09` hoặc `M10` vẫn cache answer từ version vừa lỗi.

## 8. State Machine

`Draft -> Submitted -> In Review -> Approved -> Publishing -> Published -> Frozen / Rolled Back / Rejected / Publish Failed`

## 9. UX / Screen Behavior

- Queue list phải hiển thị `domain`, `document type`, `requested by`, `effective date`, `review SLA`, `current reviewer`, `publish risk`.
- Review detail phải có tab `Summary`, `Diff`, `Source Evidence`, `Impact Scope`, `Approval History`.
- Rollback/freeze action phải có confirmation modal mô tả rõ `runtime impact`, `target version`, `expected downstream effect`.

## 10. Role / Permission Rules

- `Knowledge Owner`: submit, withdraw trước khi được review, và resubmit request của domain mình.
- `Tài chính / kế toán / pricing control`: reviewer chính cho pricing/promotion policies.
- `CSKH`: reviewer nội dung cho khiếu nại, đổi trả, bảo hành, script xử lý khách.
- `Ecommerce / omnichannel`: reviewer cho policy/order flow/kênh online.
- `IT / hệ thống / ERP / data`: xác minh source mapping, không tự duyệt nội dung nghiệp vụ ngoài scope kỹ thuật.
- `PM Governance`: xem toàn queue, override trong tình huống incident, freeze/rollback khi cần.
- `User nội bộ` thông thường không được truy cập publishing queue.

## 11. Business Rules

- Nếu request chưa có `change summary`, `effective date`, và ít nhất một `source link`, hệ thống phải chặn submit.
- Nếu `domain = pricing` hoặc `domain = promotion`, request không được publish khi thiếu reviewer thuộc nhóm `Tài chính / pricing control`.
- Nếu publish job không nhận xác nhận index hoàn tất, request phải ở trạng thái `Publish Failed`; không được coi là active runtime.
- Nếu rollback được kích hoạt, runtime version mới phải bị de-activate trước khi target version cũ được re-activate.
- Nếu source backing chính chỉ là `Excel`, reviewer phải đánh dấu `temporary evidence accepted`; nếu không, request không được approve.
- Mọi reject phải có comment có cấu trúc để owner biết cần sửa metadata, source evidence, hay business rule.

## 12. API Contract Excerpt + Canonical Links

- `GET /mia/knowledge/publishing-queue`
  - Filter: `status`, `domain`, `reviewer`, `priority`, `effective_date`
- `POST /mia/knowledge/publish-request`
  - Input: `document_id`, `version_id`, `change_summary`, `effective_date`, `source_links[]`, `impact_scope`
- `POST /mia/knowledge/approve`
  - Input: `request_id`, `approval_note`, `reviewer_role`, `approval_level`
- `POST /mia/knowledge/reject`
  - Input: `request_id`, `reason_code`, `comment`
- `POST /mia/knowledge/rollback`
  - Input: `request_id`, `target_version_id`, `incident_note`
- Downstream links:
  - `F-M08-KNW-001` consume publish result
  - `F-M09-AIC-001` và `F-M10-SLS-001` consume active runtime versions

## 13. Event / Webhook Contract Excerpt + Canonical Links

- `knowledge.publish.requested`: phát khi owner submit request.
- `knowledge.publish.approved`: phát khi reviewer approve.
- `knowledge.publish.rejected`: phát khi reviewer reject.
- `knowledge.publish.failed`: phát khi publish/index lỗi.
- `knowledge.publish.rolled_back`: phát khi rollback thành công.
- `M12` theo dõi `review SLA`, `publish failure`, `rollback count`, `top reject reasons`.

## 14. Data / DB Impact Excerpt + Canonical Links

- `knowledge_publish_request`
  - `request_id`, `document_id`, `version_id`, `status`, `domain`, `requested_by`, `effective_date`, `review_sla_due_at`
- `knowledge_publish_approval`
  - `request_id`, `approval_level`, `reviewer_department`, `decision`, `comment`, `decided_at`
- `knowledge_document_version`
  - Active version lineage, rollback target metadata
- `knowledge_publish_incident`
  - Root cause, affected modules, recovery action, closed_by
- Source alignment:
  - `SAP B1` evidence for pricing/partner policy
  - `Haravan` evidence for ecommerce order flow
  - `KiotViet` evidence for store SOP
  - `Excel` only as explicitly accepted temporary attachment

## 15. Validation Rules

- Submit request phải map tới version `Draft` hợp lệ và chưa bị deprecated.
- Approve chỉ hợp lệ nếu actor nằm trong approval matrix của domain đó.
- Publish complete chỉ hợp lệ khi active runtime version = approved version ID.
- Rollback chỉ hợp lệ khi target version còn nguyên citation/source snapshot.

## 16. Error Codes

- `KPQ-001`: Publish request thiếu metadata bắt buộc.
- `KPQ-002`: Reviewer không đủ quyền phê duyệt domain này.
- `KPQ-003`: Publish runtime/index thất bại.
- `KPQ-004`: Rollback target không hợp lệ.
- `KPQ-005`: Freeze hoặc unfreeze state conflict.

## 17. Non-Functional Requirements

- Queue list phải tải trong `<= 2 giây` cho `95%` request list dưới `1.000` items.
- Review detail và diff compare phải mở trong `<= 3 giây` với version body tối đa `50.000` ký tự.
- Publish / rollback action phải ghi audit event trong `<= 5 giây`.
- Audit log và approval log phải được giữ tối thiểu `365 ngày`.

## 18. Acceptance Criteria

- Owner submit được publish request có đủ `change summary`, `effective date`, `source links`, và request xuất hiện đúng trong queue.
- Reviewer đúng domain approve hoặc reject được request và mọi decision đều có comment lưu lại.
- Nếu publish thành công, version mới trở thành active runtime version; nếu publish lỗi, request phải ở trạng thái `Publish Failed`.
- PM Governance rollback được về version trước và runtime phản ánh đúng version sau rollback.
- Queue hiển thị được review SLA và phân biệt rõ `Submitted`, `In Review`, `Published`, `Rolled Back`, `Publish Failed`.

## 19. Test Scenarios

- Submit request thiếu source evidence.
- Approve request pricing với reviewer không đúng phòng ban.
- Publish thành công rồi kiểm tra active runtime version.
- Publish lỗi và xác minh queue chuyển sang `Publish Failed`.
- Rollback policy lỗi sau khi đã active.

## 20. Observability

- Theo dõi `queue size`, `review SLA breach`, `publish success rate`, `publish failure by domain`, `rollback count`, `temporary Excel-backed approvals`.

## 21. Rollout / Feature Flag

- Rollout cùng wave đầu của `Knowledge_Center`.
- `Dual approval` và `freeze runtime` có thể bật sau khi PM chốt approval matrix.

## 22. Open Questions

> **Đã chốt — 2026-04-17 bởi Business Owner.**

| Câu hỏi | Quyết định |
|---------|-----------|
| Dual approval theo domain? | **Không có dual approval** — approval nằm ở SAP, không phải MIABOS |
| SLA review chuẩn | **Không áp dụng SLA timer phân theo domain** — publishing queue chỉ dùng 1 SLA chung nếu cần |
| Auto-invalidate cache khi rollback? | Defer sang BE/integration phase |

**Impact lên UXUI / FE:**
- Queue list không có "Dual Approval" badge hay "Cần 2 duyệt" state
- SLA timer (nếu giữ) dùng 1 threshold duy nhất cho tất cả tài liệu
- Approve/Reject flow: 1-step, 1-reviewer

## 23. Definition of Done

- Publishing queue vận hành end-to-end từ submit tới publish hoặc rollback, đủ audit và governance để knowledge runtime không bị cập nhật tùy tiện.

## 24. Ready-for-UXUI Checklist

- [ ] UXUI đã chốt queue list, review detail, diff compare, reject reason pattern, publish failed state, rollback confirmation

## 25. Ready-for-FE-Preview Checklist

- [ ] FE Preview có mock `submitted`, `in review`, `published`, `publish failed`, `frozen`, `rolled back`
- [ ] Stub payload đủ `domain`, `review_sla_due_at`, `reviewer_department`, `change_summary`, `publish_risk`

## 26. Ready-for-BE / Integration Promotion Checklist

- [ ] Contract publish/rollback/index confirmation đã rõ
- [ ] Approval matrix và freeze behavior đã map vào workflow engine
