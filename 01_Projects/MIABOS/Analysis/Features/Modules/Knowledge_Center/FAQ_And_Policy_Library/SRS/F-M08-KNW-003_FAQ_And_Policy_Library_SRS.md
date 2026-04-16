# Feature SRS: F-M08-KNW-003 FAQ and Policy Library

**Status**: SRS Ready
**Owner**: A03 BA Agent
**Last Updated By**: Claude Code (claude-sonnet-4-6)
**Last Reviewed By**: A01 PM Agent
**Approval Required**: PM
**Approved By**: A01 PM Agent — Promoted to SRS Ready 2026-04-16; library taxonomy + mobile scope + sales-facing exposure rules deferred to BE/integration phase per BQ pilot scope decision
**Last Status Change**: 2026-04-16
**Source of Truth**: This document
**Blocking Reason**: -
**Module**: M08
**Phase**: PB-02 / PB-03
**Priority**: High
**Document Role**: SRS canonical cho thư viện tra cứu `FAQ`, `SOP`, `Policy`, `System Guide` trong `Knowledge_Center`

---

## 0. Metadata

- Feature ID: `F-M08-KNW-003`
- Related User Story: `US-M08-KNW-003`
- Related PRD: [PRD-M08-KNW-003_FAQ_And_Policy_Library.md](../../../../../../Planning/PRD/Knowledge_Center/PRD-M08-KNW-003_FAQ_And_Policy_Library.md)
- Related Screens: library landing, search results, policy detail, FAQ topic list, no-result state, restricted state
- Related APIs: `GET /mia/knowledge/library`, `GET /mia/knowledge/policies/:id`, `GET /mia/knowledge/faqs`, `POST /mia/knowledge/library-feedback`
- Related Tables: `faq_knowledge_base`, `knowledge_document`, `knowledge_document_tag`, `knowledge_usage_log`, `knowledge_library_feedback`
- Related Events: `knowledge.library.searched`, `knowledge.library.document_opened`, `knowledge.library.no_result`, `knowledge.library.feedback_submitted`
- Related Error IDs: `KLB-001`, `KLB-002`, `KLB-003`, `KLB-004`

## 0B. Integration Source Map

| Source System | Data / Knowledge Type | Usage In Library | Truth Level | Notes |
|---------------|-----------------------|------------------|-------------|-------|
| `Internal Docs` | Approved FAQ/SOP/Policy/System Guide | Nguồn hiển thị chính cho library | Canonical published source | Chỉ tài liệu `Published` mới hiện mặc định |
| `SAP B1` | ERP-linked policy evidence | Hỗ trợ metadata/source badge cho pricing/item-related policy | Supporting structured evidence | Không render raw ERP tables cho end user |
| `KiotViet` | Store procedures | Feed SOP theo bối cảnh cửa hàng | Operational evidence | Quan trọng cho `Store Lead` và retail ops |
| `Haravan` | Ecommerce/online order guidance | Feed FAQ/policy cho online service flows | Channel evidence | Gắn `omnichannel` tags |
| `Excel` | Temporary policy notes | Chỉ làm source badge/supporting note khi đã được publish | Temporary evidence | Không hiện như source of truth |
| `Lark` | Workflow memo/approval context | Hỗ trợ tracking feedback và owner handoff | Workflow support | Không phải document body chính |

## 1. User Story

Là `CSKH`, `Ecommerce / omnichannel`, `Ban điều hành / vận hành trung tâm`, `Marketing / trade marketing`, hoặc `Store / retail operations`, tôi muốn có thư viện FAQ / SOP / policy để tra cứu nhanh đúng tài liệu theo công việc thay vì phải hỏi nhiều vòng trong chat hoặc phụ thuộc vào người có kinh nghiệm.

## 1A. User Task Flow

| Step | User Role | Action | Task Type | Notes |
|------|-----------|--------|-----------|-------|
| 1 | User nội bộ | Mở library từ menu hoặc từ citation trong AI answer | Quick Action | Entry |
| 2 | User nội bộ | Search theo keyword hoặc lọc theo `domain`, `document type`, `channel`, `department`, `updated recently` | Quick Action | Narrow |
| 3 | User nội bộ | Mở detail của tài liệu để đọc `rule chính`, `scope`, `ngoại lệ`, `metadata` | Reporting | Read |
| 4 | User nội bộ | Mở related documents hoặc copy link để gửi cho đồng nghiệp | Quick Action | Reuse |
| 5 | User nội bộ | Gửi feedback `thiếu`, `sai`, `đã cũ`, hoặc `khó hiểu` khi tài liệu chưa giải quyết được việc | Exception Handling | Improvement |

## 2. Business Context

BQ không chỉ cần chatbot; họ cần một bề mặt tri thức chuẩn để nhân sự tự tra cứu. Research pack cho thấy các câu hỏi lặp lại xoay quanh `inventory`, `pricing policy`, `promotion`, `FAQ nội bộ`, `SOP vận hành`, và `system usage`. Nếu mọi việc đều ép qua chat, người dùng sẽ khó kiểm chứng và khó re-use link tài liệu. Feature này là bề mặt self-service của `Knowledge_Center` và cũng là nơi neo trust khi `M09` trả citation.

## 3. Preconditions

- Có documents đã publish từ `F-M08-KNW-001`.
- Có taxonomy/tagging tối thiểu theo `domain`, `document type`, `channel`, `department`.
- Có access rules từ `F-M07-SEC-001`.

## 4. Postconditions

- User tra cứu được tài liệu phù hợp với quyền và ngữ cảnh công việc.
- Hệ thống ghi nhận search/open/no-result/feedback để phát hiện gap tri thức.

## 5. Main Flow

1. User mở library landing hoặc đi từ AI citation sang detail page.
2. Hệ thống hiển thị quick filters theo `Pricing`, `Promotion`, `CSKH`, `Ecommerce`, `Store SOP`, `System Guide`.
3. User nhập keyword hoặc áp filter theo `document type`, `channel`, `owner department`, `updated recently`.
4. Hệ thống trả search results đã qua permission filter và sắp xếp theo `relevance + freshness + published status`.
5. User mở document detail, xem rule chính, scope, ngoại lệ, owner, effective date, related docs.
6. User copy link, mở related docs, hoặc gửi feedback nếu tài liệu thiếu/chưa đúng.

## 6. Alternate Flows

- User vào thẳng FAQ topic list thay vì global search.
- User search không ra kết quả và được gợi ý keyword, domain, hoặc contact path phù hợp.
- User mở một document `Superseded` từ link cũ và được điều hướng sang document thay thế.
- `Store / retail operations` dùng filter theo kênh hoặc theo loại SOP cửa hàng.

## 7. Error Flows

- Không tìm thấy kết quả phù hợp sau khi đã filter.
- Tài liệu tồn tại nhưng user không có quyền xem full content.
- Tài liệu bị deprecated hoặc superseded trong lúc user đang đọc.
- Related document trỏ tới tài liệu ở scope khác nên phải bị ẩn.

## 8. State Machine

`Library Opened -> Search Applied -> Results Viewed -> Document Viewed -> Feedback Submitted / Exit`

## 9. UX / Screen Behavior

- Library landing ưu tiên `search bar`, `popular topics`, `recently updated`, `most used`.
- Search results phải hiển thị `document type badge`, `domain`, `owner department`, `effective date`, `freshness label`.
- Detail page phải ưu tiên `kết luận/rule chính`, rồi `scope áp dụng`, `ngoại lệ`, `chi tiết đầy đủ`, `related documents`.
- `No-result state` phải gợi ý domain gần đúng và cho phép report gap trực tiếp.

## 10. Role / Permission Rules

- `CSKH`: xem FAQ/policy liên quan đổi trả, bảo hành, khiếu nại, order handling.
- `Ecommerce / omnichannel`: xem policy và SOP cho online order, delivery, channel handling, online customer service.
- `Marketing / trade marketing`: xem CTKM, collection note, campaign-facing policy trong phạm vi được duyệt.
- `Store / retail operations`: xem SOP cửa hàng, process kiểm hàng, vận hành bán lẻ, nhưng không mặc định thấy policy pricing control nhạy cảm.
- `Ban điều hành / vận hành trung tâm`: xem toàn bộ published library nội bộ.
- `External/public AI` và khách ngoài không được truy cập trực tiếp library nội bộ này.

## 11. Business Rules

- Chỉ documents ở trạng thái `Published` mới hiện trong search results mặc định; `Superseded` hoặc `Deprecated` chỉ hiện khi có link trực tiếp hoặc audit scope cho phép.
- Search results phải pass cả `permission filter` và `sensitivity filter` trước khi render.
- Nếu user mở từ AI citation, detail page phải neo đúng document/version đã được answer tham chiếu, không tự động nhảy sang latest version nếu khác thời điểm.
- Nếu document có bản thay thế active, UI phải hiển thị banner `Đã có bản mới` và link sang version mới.
- Feedback `thiếu/sai/cũ` phải tạo record gắn với `document_id`, `user_role`, `search keyword`, `source entry point`.

## 12. API Contract Excerpt + Canonical Links

- `GET /mia/knowledge/library`
  - Query params: `q`, `domain`, `document_type`, `channel`, `department`, `freshness_status`
  - Output: search results + filters + counts + no-result suggestions
- `GET /mia/knowledge/policies/:id`
  - Output: detail, metadata, related docs, access flags, version reference
- `GET /mia/knowledge/faqs`
  - Output: FAQ topic grouping, summary answers, linked documents
- `POST /mia/knowledge/library-feedback`
  - Input: `document_id`, `feedback_type`, `comment`, `entry_point`
- Canonical consumers:
  - `F-M09-AIC-001` deep-links user vào detail từ answer citation
  - `F-M12-OBS-001` consume no-result và library feedback metrics

## 13. Event / Webhook Contract Excerpt + Canonical Links

- `knowledge.library.searched`: log search keyword + filters + result count.
- `knowledge.library.document_opened`: log detail open + entry point.
- `knowledge.library.no_result`: log queries không có kết quả.
- `knowledge.library.feedback_submitted`: log feedback thiếu/sai/cũ.

## 14. Data / DB Impact Excerpt + Canonical Links

- `faq_knowledge_base`
  - FAQ items ngắn, link sang document dài nếu cần
- `knowledge_document`
  - Document master và metadata cho library render
- `knowledge_document_tag`
  - Domain, department, channel, persona tags
- `knowledge_usage_log`
  - Search/open/no-result/open-from-citation logs
- `knowledge_library_feedback`
  - Feedback type, note, actor role, document reference
- Source alignment:
  - `Haravan` cho ecommerce FAQ
  - `KiotViet` cho SOP cửa hàng
  - `SAP B1` cho pricing-related references

## 15. Validation Rules

- Search result không được chứa tài liệu ngoài quyền user.
- Detail page phải hiển thị đúng version/reference khi mở từ citation.
- Related docs chỉ hiện các tài liệu cùng scope quyền và không bị deprecated cứng.
- No-result logging phải capture được keyword và filter set để dùng cho gap analysis.

## 16. Error Codes

- `KLB-001`: Không tìm thấy tài liệu phù hợp.
- `KLB-002`: User không có quyền xem tài liệu.
- `KLB-003`: Tài liệu đã deprecated hoặc bị thay thế.
- `KLB-004`: Không ghi nhận được feedback library.

## 17. Non-Functional Requirements

- Search result phải trả về trong `<= 2 giây` cho `95%` truy vấn phase 1.
- Detail page phải render metadata cốt lõi trong `<= 1 giây` sau khi user mở tài liệu.
- Hệ thống phải hỗ trợ tối thiểu `50` người dùng nội bộ đồng thời ở pilot không làm search timeout.
- No-result và feedback logs phải lưu tối thiểu `180 ngày`.

## 18. Acceptance Criteria

- User nội bộ tra cứu được `FAQ`, `SOP`, `Policy`, `System Guide` bằng keyword hoặc filter và nhìn thấy badge loại tài liệu rõ ràng.
- Khi mở document detail từ citation, hệ thống hiển thị đúng document/version mà answer đã tham chiếu.
- Tài liệu ngoài scope quyền không được hiển thị full content; user nhận được trạng thái restricted phù hợp.
- No-result state gợi ý keyword/domain gần đúng và cho phép gửi feedback gap.
- Feedback từ library được lưu với `feedback_type` và `entry_point`.

## 19. Test Scenarios

- Search keyword `đổi trả` từ role `CSKH`.
- Search `SOP cửa hàng` từ role `Store / retail operations`.
- Mở tài liệu từ AI citation và kiểm tra version reference.
- Search không có kết quả và gửi feedback `thiếu tài liệu`.
- Mở tài liệu restricted và xác minh blocked state.

## 20. Observability

- Theo dõi `search success rate`, `no-result rate`, `top viewed docs`, `top no-result keywords`, `feedback by domain`, `documents mở nhiều từ AI citation`.

## 21. Rollout / Feature Flag

- Rollout cùng phase 1 nội bộ cho desktop portal.
- Mobile optimization cho store staff để ở wave sau nếu pilot nội bộ xác nhận cần.

## 22. Open Questions

- Taxonomy menu chính sẽ ưu tiên `domain`, `persona`, hay `job-to-be-done`?
- Store staff có cần mobile-first library ngay phase 1 không?
- Có nên tách riêng `public-safe FAQ` khỏi library nội bộ hay chỉ filter bằng badge/scope?

## 23. Definition of Done

- MIABOS có thư viện self-service đủ mạnh để nhân sự nội bộ tự tra cứu và để AI answer có nơi neo trust/citation.

## 24. Ready-for-UXUI Checklist

- [ ] UXUI đã chốt landing, search results, detail page, no-result state, restricted state, feedback state

## 25. Ready-for-FE-Preview Checklist

- [ ] FE Preview có mock `search success`, `no result`, `restricted`, `superseded`, `open from citation`
- [ ] Stub payload đủ `document_type`, `owner_department`, `entry_point`, `freshness_status`, `related_doc_count`

## 26. Ready-for-BE / Integration Promotion Checklist

- [ ] Search index + permission filter + citation deep-link contract đã rõ
- [ ] Feedback logging và no-result analytics đã map vào observability
