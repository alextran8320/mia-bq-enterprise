# Feature SRS: F-M08-KNW-003 FAQ and Policy Library

**Status**: SRS Ready
**Owner**: A03 BA Agent
**Last Updated By**: Codex CLI (GPT-5.4 Codex environment)
**Last Reviewed By**: A01 PM Agent
**Approval Required**: PM
**Approved By**: A01 PM Agent — Promoted to SRS Ready 2026-04-16; library taxonomy + mobile scope + sales-facing exposure rules deferred to BE/integration phase per BQ pilot scope decision
**Last Status Change**: 2026-04-17
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
- Related Screens: `/knowledge` workspace library section, search results section, document detail panel, FAQ topic section, no-result state, restricted state
- Related APIs: `POST /mia/knowledge/query`, `GET /mia/knowledge/tree`, `GET /mia/knowledge/documents/:id`, `GET /mia/knowledge/faqs`
- Related Tables: `faq_knowledge_base`, `knowledge_document`, `knowledge_topic_tag`, `knowledge_sop_step`, `knowledge_document_asset`
- Related Events: -
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
| 1 | User nội bộ | Mở `/knowledge` từ menu hoặc từ source reference trong AI answer | Quick Action | Entry |
| 2 | User nội bộ | Chọn folder trong cây nội dung hoặc search theo keyword/lọc theo `knowledge topic`, `document type`, `channel`, `department`, `updated recently` | Quick Action | Narrow |
| 3 | User nội bộ | Mở detail panel của tài liệu để đọc `rule chính`, `scope`, `ngoại lệ`, `metadata`, hình ảnh/bảng/attachment nếu có | Reporting | Read |
| 4 | User nội bộ | Mở related documents hoặc copy link để gửi cho đồng nghiệp | Quick Action | Reuse |
| 5 | User nội bộ | Dùng contact/escalation path nếu tài liệu chưa giải quyết được việc | Exception Handling | Improvement |

## 2. Business Context

BQ không chỉ cần chatbot; họ cần một bề mặt tri thức chuẩn để nhân sự tự tra cứu. Research pack cho thấy các câu hỏi lặp lại xoay quanh `inventory`, `pricing policy`, `promotion`, `FAQ nội bộ`, `SOP vận hành`, và `system usage`. Nếu mọi việc đều ép qua chat, người dùng sẽ khó kiểm chứng và khó re-use link tài liệu. Feature này là bề mặt self-service trong page `/knowledge` và cũng là nơi neo trust khi `M09` trả source reference.

## 3. Preconditions

- Có documents đã publish từ `F-M08-KNW-001`.
- Có cây nội dung chính trong `/knowledge`: `SOP`, `FAQ`, `Policy`, `System Guide`, `Imported / Chờ phân loại`.
- Có taxonomy/tagging tối thiểu theo `knowledge topic`, `document type`, `channel`, `department`.
- `knowledge topic` chỉ là nhóm tri thức để tìm policy/SOP/FAQ; không trùng với product category, SKU hierarchy, inventory scope, price book, hoặc ecommerce category của `Catalog & Commerce`.
- Có access rules từ `F-M07-SEC-001`.

## 4. Postconditions

- User tra cứu được tài liệu phù hợp với quyền và ngữ cảnh công việc.
- Hệ thống giúp user tìm đúng tài liệu và có lối escalation/contact khi không đủ thông tin; analytics chi tiết thuộc M12 nếu được mở scope.

## 5. Main Flow

1. User mở `/knowledge` hoặc đi từ AI source reference sang document detail panel.
2. Hệ thống hiển thị folder tree theo `SOP`, `FAQ`, `Policy`, `System Guide`, `Imported / Chờ phân loại`, kèm quick filters theo nhóm tri thức như `Pricing Policy`, `Promotion Policy`, `CSKH Policy`, `Ecommerce Service`, `Store SOP`, `System Guide`.
3. User chọn folder hoặc nhập keyword/áp filter theo `document type`, `knowledge topic`, `channel`, `owner department`, `updated recently`.
4. Hệ thống trả search results đã qua permission filter và sắp xếp theo `relevance + freshness + published status`.
5. User mở document detail panel, xem rule chính, scope, ngoại lệ, owner, effective date, source citation, role scope, related docs, và rich content nếu tài liệu có hình ảnh/bảng/attachment.
6. UI hiển thị quick reply chips/related questions để user đi tiếp sang SOP, FAQ, policy liên quan hoặc escalation owner.
7. User copy link, mở related docs, đánh giá hữu ích/không hữu ích, hoặc dùng escalation/contact path nếu tài liệu thiếu/chưa đúng.

## 6. Alternate Flows

- User vào thẳng FAQ topic list thay vì global search.
- User search không ra kết quả và được gợi ý keyword, knowledge topic, hoặc contact path phù hợp.
- User mở một document `Superseded` từ link cũ và được điều hướng sang document thay thế.
- `Store / retail operations` dùng filter theo kênh hoặc theo loại SOP cửa hàng.
- User mở tài liệu được import từ file có hình ảnh/attachment và detail panel render asset inline hoặc hiển thị warning rõ nếu asset lỗi.

## 7. Error Flows

- Không tìm thấy kết quả phù hợp sau khi đã filter.
- Tài liệu tồn tại nhưng user không có quyền xem full content.
- Tài liệu bị deprecated hoặc superseded trong lúc user đang đọc.
- Related document trỏ tới tài liệu ở scope khác nên phải bị ẩn.
- Asset import của document bị lỗi hoặc thiếu quyền xem file gốc.

## 8. State Machine

`Knowledge Workspace Opened -> Folder/Search Applied -> Results Viewed -> Document Panel Viewed -> Feedback Submitted / Exit`

## 9. UX / Screen Behavior

- Library là section trong `/knowledge`, không có route `/knowledge/library` riêng.
- `/knowledge` ưu tiên folder tree bên trái, search/command bar phía trên, results/sections ở giữa, preview/detail panel bên phải.
- Search results phải hiển thị `document type badge`, `knowledge topic`, `owner department`, `effective date`, `freshness label`.
- Detail panel phải ưu tiên `kết luận/rule chính`, rồi `scope áp dụng`, `ngoại lệ`, `chi tiết đầy đủ`, `hình ảnh/bảng/attachment`, `related documents`.
- Nếu là SOP, detail panel phải hiển thị `SOP Step` theo thứ tự thao tác, actor, kết quả kỳ vọng, và exception path.
- `No-result state` phải gợi ý knowledge topic gần đúng và contact/escalation path.
- `No-result state` phải hoạt động như `Uncertainty Signal`: nói rõ đã search trong Knowledge Base nội bộ nhưng không có source phù hợp, kèm suggestions và `Hỏi người thật`.
- Detail panel phải có `Source Citation Block`: document/version/effective date/owner/freshness/source backing.
- Detail panel phải có `Role-Aware Header`: tài liệu áp dụng cho role/channel nào và user hiện tại có đang nằm trong scope không.
- Detail panel phải có feedback loop tối thiểu: `Hữu ích` / `Không hữu ích` hoặc `Gửi phản hồi`, không tạo object analytics riêng trong M08.
- Tài liệu SOP phải dùng `Step-by-step Guided Flow` khi có `sop_steps[]`.

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
- Nếu user mở từ AI source reference, detail panel phải neo đúng document/version đã được answer tham chiếu, không tự động nhảy sang latest version nếu khác thời điểm.
- Nếu document có bản thay thế active, UI phải hiển thị banner `Đã có bản mới` và link sang version mới.
- Nếu document có assets, UI phải render asset hợp lệ và cảnh báo rõ asset lỗi.
- Quick reply/related topic suggestions phải qua permission filter trước khi render.
- Khi mở từ AI source reference, detail panel phải giữ đúng version được cite trong answer và hiển thị nếu đang không phải latest.

## 12. API Contract Excerpt + Canonical Links

- `POST /mia/knowledge/query`
  - Input: `q`, `folder_id`, `knowledge_topic`, `document_type`, `channel`, `department`, `freshness_status`
  - Output: search results + filters + counts + no-result suggestions + `scope_statement` + `quick_reply_suggestions[]`
- `GET /mia/knowledge/tree`
  - Output: category/folder/topic tree + counts
- `GET /mia/knowledge/documents/:id`
  - Output: detail, metadata, source citation, role scope, related docs, quick reply suggestions, feedback action, access flags, version reference, assets
- `GET /mia/knowledge/faqs`
  - Output: FAQ topic grouping, summary answers, linked documents
- Canonical consumers:
  - `F-M09-AIC-001` deep-links user vào detail từ answer source reference
  - `F-M12-OBS-001` có thể đo usage/feedback ở lớp observability riêng nếu scope analytics được mở

## 13. Event / Webhook Contract Excerpt + Canonical Links

- Không phát event bắt buộc trong scope Knowledge Center hiện tại.
- Nếu cần analytics, `M12 Observability` sẽ sở hữu event/log riêng.

## 14. Data / DB Impact Excerpt + Canonical Links

- `faq_knowledge_base`
  - FAQ items ngắn, link sang document dài nếu cần
- `knowledge_document`
  - Document master và metadata cho library render
- `knowledge_topic_tag`
  - Knowledge topic, department, channel, persona tags; không lưu product/category hierarchy của Catalog & Commerce
- `knowledge_sop_step`
  - Step order, actor, action text, expected output, exception note cho SOP documents
- `knowledge_document_asset`
  - Asset render trong detail panel: inline image, imported table, attachment/file reference
- Source alignment:
  - `Haravan` cho ecommerce FAQ
  - `KiotViet` cho SOP cửa hàng
  - `SAP B1` cho pricing-related references

## 15. Validation Rules

- Search result không được chứa tài liệu ngoài quyền user.
- Detail panel phải hiển thị đúng version/reference khi mở từ source reference.
- Detail panel phải render được assets hoặc hiện warning nếu assets lỗi.
- Related docs chỉ hiện các tài liệu cùng scope quyền và không bị deprecated cứng.
- No-result state phải có wording và contact/escalation path rõ; logging analytics thuộc M12 nếu được mở scope.
- Source citation block không được thiếu `owner`, `version/effective date`, và `freshness_status`.
- Feedback action phải hiện ở document detail và no-result state nhưng không tạo `knowledge_gap_report` hoặc usage log object trong M08.

## 16. Error Codes

- `KLB-001`: Không tìm thấy tài liệu phù hợp.
- `KLB-002`: User không có quyền xem tài liệu.
- `KLB-003`: Tài liệu đã deprecated hoặc bị thay thế.
- `KLB-004`: Không xác định được contact/escalation path cho no-result state.

## 17. Non-Functional Requirements

- Search result phải trả về trong `<= 2 giây` cho `95%` truy vấn phase 1.
- Detail page phải render metadata cốt lõi trong `<= 1 giây` sau khi user mở tài liệu.
- Hệ thống phải hỗ trợ tối thiểu `50` người dùng nội bộ đồng thời ở pilot không làm search timeout.
- Không lưu usage/gap logs trong M08; nếu cần retention analytics sẽ do M12 định nghĩa riêng.
- Rich content assets trong detail panel phải render metadata trong `<= 1 giây`; binary/media có thể lazy-load nhưng không được làm mất layout.

## 18. Acceptance Criteria

- User nội bộ tra cứu được `FAQ`, `SOP`, `Policy`, `System Guide` bằng keyword hoặc filter và nhìn thấy badge loại tài liệu rõ ràng.
- Khi mở document detail từ source reference, hệ thống hiển thị đúng document/version mà answer đã tham chiếu.
- Tài liệu ngoài scope quyền không được hiển thị full content; user nhận được trạng thái restricted phù hợp.
- No-result state gợi ý keyword/knowledge topic gần đúng và có contact/escalation path rõ.
- SOP detail hiển thị được danh sách `SOP Step` theo đúng thứ tự thao tác.
- Document detail render được hình ảnh/bảng/attachment của tài liệu import.
- Document detail hiển thị source citation block, role-aware header, quick reply chips, và feedback action.
- Khi không tìm thấy kết quả, no-result state phải nói rõ scope đã search và có `Hỏi người thật` / contact owner.

## 19. Test Scenarios

- Search keyword `đổi trả` từ role `CSKH`.
- Search `SOP cửa hàng` từ role `Store / retail operations`.
- Mở tài liệu từ AI source reference và kiểm tra version reference.
- Search không có kết quả và kiểm tra contact/escalation path.
- Search không có kết quả và kiểm tra uncertainty/scope statement.
- Mở tài liệu restricted và xác minh blocked state.
- Mở document detail và kiểm tra source citation + role-aware header + feedback action.
- Mở tài liệu import có hình ảnh/bảng/attachment và xác minh detail panel không mất rich content.

## 20. Observability

- Chỉ theo dõi health tối thiểu của library ở mức document: `published documents`, `restricted documents`, `stale documents`; analytics chi tiết thuộc M12 nếu được mở scope.

## 21. Rollout / Feature Flag

- Rollout cùng phase 1 nội bộ cho desktop portal.
- Mobile optimization cho store staff để ở wave sau nếu pilot nội bộ xác nhận cần.

## 22. Open Questions

> **Đã chốt — 2026-04-17 bởi Business Owner.**

| Câu hỏi | Quyết định |
|---------|-----------|
| Taxonomy menu ưu tiên gì? | **Knowledge topic** (Pricing Policy / Promotion Policy / CSKH Policy / Store SOP / Ecommerce Service / System Usage) — không dùng product/category taxonomy của Catalog & Commerce |
| Mobile-first cho store staff phase 1? | Không — desktop-first trong phase 1; mobile sau pilot |
| Tách public-safe FAQ? | Không tách — dùng badge/scope filter trong cùng library |

**Impact lên UXUI / FE:**
- Library landing: menu theo knowledge topic (không phải role-based menu, không phải product/category menu)
- Responsive: desktop-first, mobile không cần optimize trong phase 1
- Không có trang FAQ riêng public — dùng scope filter/badge trên library chung

## 23. Definition of Done

- MIABOS có thư viện self-service đủ mạnh để nhân sự nội bộ tự tra cứu và để AI answer có nơi neo source reference/trust.

## 24. Ready-for-UXUI Checklist

- [ ] UXUI đã chốt `/knowledge` workspace, folder tree, search results, detail panel, rich content render, SOP step display, no-result state, restricted state

## 25. Ready-for-FE-Preview Checklist

- [ ] FE Preview có mock `search success`, `no result`, `restricted`, `superseded`, `open from source reference`, `sop step detail`, `rich content assets`
- [ ] Stub payload đủ `document_type`, `knowledge_topic`, `owner_department`, `entry_point`, `freshness_status`, `related_doc_count`, `sop_steps[]`, `assets[]`

## 26. Ready-for-BE / Integration Promotion Checklist

- [ ] Search index + permission filter + source-reference deep-link contract đã rõ
- [ ] Analytics/logging nếu cần đã được tách sang M12
