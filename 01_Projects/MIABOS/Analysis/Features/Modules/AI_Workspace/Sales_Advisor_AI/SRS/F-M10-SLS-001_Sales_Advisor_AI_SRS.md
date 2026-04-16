# Feature SRS: F-M10-SLS-001 Sales Advisor AI

**Status**: SRS Ready
**Owner**: A03 BA Agent
**Last Updated By**: Codex CLI (GPT-5 Codex)
**Last Reviewed By**: A01 PM Agent
**Approval Required**: PM
**Approved By**: A01 PM Agent — FE Preview scope confirmed by Business Owner instruction on 2026-04-16
**Last Status Change**: 2026-04-16
**Source of Truth**: This document
**Blocking Reason**: -
**Module**: M10
**Phase**: PB-02 / PB-03
**Priority**: High
**Document Role**: SRS canonical cho chatbot tư vấn bán hàng của MIABOS trong bối cảnh retail BQ

---

## 0. Metadata

- Feature ID: `F-M10-SLS-001`
- Related User Story: `US-M10-SLS-001`
- Related Screens: sales chat shell, suggestion card, product recommendation stack, CTA footer, handoff state
- Related APIs: `POST /mia/sales-advisor/query`, `GET /mia/sales-advisor/products`, `POST /mia/leads`
- Related Tables: `crm_customer`, `crm_customer_attribute`, `product_projection`, `sales_chat_session`, `crm_lead_event`
- Related Events: `mia.sales.answer.generated`, `mia.sales.answer.blocked`, `mia.lead.created`
- Related Error IDs: `SLS-001`, `SLS-008`, `SLS-009`

## 0B. Integration Source Map

| Source System / Module | Data / Knowledge Type | Usage In This Feature | Truth Level | Notes |
|------------------------|-----------------------|-----------------------|-------------|-------|
| `M08 Knowledge Center` | Public-safe FAQ/policy như đổi trả, giao hàng, bảo hành | Giải thích chính sách an toàn cho khách | Canonical public-safe knowledge | Chỉ dùng docs đã được whitelist |
| `SAP B1` | Product master, pricing base, item attributes | Feed projected product/pricing context | Structured source | Không expose ERP nội bộ/raw fields |
| `KiotViet` | Store-level availability context | Feed gợi ý khu vực/cửa hàng có khả năng còn hàng | Operational source | Chỉ expose availability projection an toàn |
| `Haravan` | Ecommerce catalog, online channel context | Feed channel-specific product and order context | Channel source | Hữu ích cho website/online assistant |
| `M07 Security / Public-Safe Rules` | Exposure policy, blocked topics, masking | Chặn answer nhạy cảm và enforce sales-safe boundary | Gatekeeper | Không bypass |
| `M06 CRM` | Lead/customer context | Ghi nhận nhu cầu và lead/handoff | Operational CRM target | Phục vụ follow-up |

## 1. User Story

Là khách hàng hoặc sales/CRM operator đang hỗ trợ khách, tôi muốn AI tư vấn sản phẩm, giá, CTKM, và availability ở mức an toàn để khách tiến gần hơn tới quyết định mua, đồng thời không làm lộ dữ liệu nhạy cảm hoặc cam kết sai.

## 1A. User Task Flow

| Step | User Role | Action | Task Type | Notes |
|------|-----------|--------|-----------|-------|
| 1 | Khách hàng | Bắt đầu hội thoại tư vấn về nhu cầu như kiểu giày, size, màu, ngân sách, mục đích dùng | Quick Action | Entry |
| 2 | AI | Hỏi thêm thông tin cần thiết theo need-discovery flow | Quick Action | Qualification |
| 3 | Hệ thống | Tìm product candidates, price band, CTKM public-safe, và availability projection phù hợp | Quick Action | Retrieval |
| 4 | AI | Trả suggestion card gồm sản phẩm, lý do phù hợp, range giá/ưu đãi an toàn, và CTA | Quick Action | Recommendation |
| 5 | Khách / Sales | Chọn CTA như để lại lead, hỏi tiếp, xem cửa hàng phù hợp, hoặc nhờ nhân viên hỗ trợ | Quick Action | Conversion |

## 2. Business Context

BQ là retail nhiều chi nhánh/kênh, nên bài toán AI external không thể chỉ là trả FAQ đơn thuần. Khách hàng thường quan tâm `mẫu nào hợp`, `còn size không`, `giá tầm bao nhiêu`, `có khuyến mãi gì`, `nên qua cửa hàng nào`, nhưng nếu hệ thống lộ tồn chi tiết, giá nội bộ, hoặc cam kết sai promotion thì rủi ro cao. Feature này là lớp tư vấn bán hàng an toàn, được xây sau foundation nội bộ, tận dụng source-of-truth đã chuẩn hóa nhưng chỉ expose phần public-safe.

## 3. Preconditions

- `M08` đã có tập public-safe policy/FAQ được whitelist.
- `M07` đã chốt rule public-safe exposure.
- `SAP B1`, `KiotViet`, `Haravan` có projection contract tối thiểu cho product/availability.
- `M06 CRM` có contract lead/customer context cơ bản.

## 4. Postconditions

- Khách nhận được tư vấn trong scope an toàn, có suggestion và CTA rõ.
- Hệ thống ghi nhận need-discovery context và conversion outcome.
- Các câu hỏi nhạy cảm bị block hoặc chuyển hướng đúng cách.

## 5. Main Flow

1. Khách bắt đầu hội thoại và nêu nhu cầu sơ bộ.
2. AI hỏi tiếp 1-3 câu để làm rõ `category`, `style`, `size`, `budget`, `channel preference`, `location`.
3. Hệ thống áp public-safe policy và truy xuất product candidates + price band + availability projection.
4. Hệ thống kiểm tra CTKM/policy liên quan từ `M08` public-safe knowledge.
5. AI trả suggestion card với `lý do phù hợp`, `range giá`, `ưu đãi public-safe`, `available next CTA`.
6. Khách chọn CTA hoặc hỏi tiếp; nếu vượt scope, hệ thống block và chuyển sang lead/handoff path.

## 6. Alternate Flows

- Khách anonymous chỉ hỏi thông tin chung, chưa sẵn sàng để lại lead.
- Không có sản phẩm match rõ, AI chuyển sang đề xuất nhóm sản phẩm gần nhất hoặc CTA để tư vấn thêm.
- Availability confidence thấp, AI chỉ gợi ý `kiểm tra tại cửa hàng` thay vì cam kết còn hàng.
- Sales nội bộ dùng cùng engine để tư vấn hỗ trợ khách qua chat/manual console.

## 7. Error Flows

- Khách hỏi thông tin nhạy cảm như tồn chi tiết theo mã kho, giá nội bộ, biên lợi nhuận.
- Product source thiếu confidence hoặc availability stale.
- Public-safe policy chưa có cho trường hợp khách hỏi.
- CTA/handoff downstream bị lỗi khiến cuộc hội thoại không chốt được outcome.

## 8. State Machine

`Conversation Open -> Discovering -> Suggesting -> CTA Offered -> Lead Captured / Handoff / Closed / Blocked`

## 9. UX / Screen Behavior

- Chat UI cho khách phải gọn, hướng hành động, không quá nhiều detail nội bộ.
- Suggestion card phải nêu `sản phẩm`, `vì sao phù hợp`, `range giá`, `ưu đãi`, `CTA`.
- Nếu availability không chắc chắn, UI phải dùng wording kiểu `có thể còn tại` hoặc `nên để nhân viên xác nhận` thay vì khẳng định tuyệt đối.
- Blocked state phải lịch sự, không lộ thuật ngữ hệ thống.

## 10. Role / Permission Rules

- `Khách hàng`: chỉ thấy thông tin public-safe và CTA public-safe.
- `Sales / CRM`: có thể xem thêm conversation context và tạo lead thay mặt khách trong console nội bộ.
- `Marketing / trade marketing`: xem aggregate content/CTA performance, không phải live sensitive detail.
- `PM Governance`: xem rule set, blocked reasons, và conversion analytics.
- Mọi public-facing answer phải qua `M07 public-safe filter`.

## 11. Business Rules

- Nếu câu hỏi yêu cầu `tồn chi tiết`, `giá nội bộ`, `payment status`, hoặc dữ liệu không public-safe, AI phải block hoặc chuyển sang human handoff; không được suy diễn.
- Nếu availability source không đủ confidence hoặc stale, AI chỉ được trả projection mềm hoặc CTA xác nhận thêm.
- Chỉ policy/FAQ đã được đánh dấu `public-safe = true` trong `M08` mới được dùng cho khách.
- Mọi suggestion phải có ít nhất một rationale business-friendly; không chỉ liệt kê SKU.
- Nếu khách chưa cung cấp đủ thông tin để gợi ý hợp lý, AI phải hỏi tiếp thay vì đề xuất bừa.
- Kết quả tư vấn phải gắn được với CTA hoặc lead opportunity; không dừng ở answer vô hướng hành động.

## 12. API Contract Excerpt + Canonical Links

- `POST /mia/sales-advisor/query`
  - Input: `session_id`, `message`, `channel`, `anonymous_context`, `known_customer_context`
  - Output: `discovery_fields_needed[]`, `suggestions[]`, `policy_notes[]`, `warnings[]`, `cta_options[]`
- `GET /mia/sales-advisor/products`
  - Output: projected product candidates, price bands, availability projection
- `POST /mia/leads`
  - Input từ CTA/handoff khi khách sẵn sàng
- Downstream:
  - Reads `M08`, `M07`, product/inventory projections
  - Feeds `F-M10-SLS-002`, `F-M10-SLS-003`, `F-M12-OBS-001`

## 13. Event / Webhook Contract Excerpt + Canonical Links

- `mia.sales.answer.generated`: khi AI trả suggestion.
- `mia.sales.answer.blocked`: khi câu hỏi vượt public-safe boundary.
- `mia.lead.created`: khi CTA tạo lead thành công.

## 14. Data / DB Impact Excerpt + Canonical Links

- `sales_chat_session`
  - conversation metadata, channel, stage
- `product_projection`
  - safe projection payload cho price/availability
- `crm_customer`
  - customer reference nếu đã nhận diện được
- `crm_customer_attribute`
  - stated preference như size, style, budget
- `crm_lead_event`
  - timeline từ suggestion tới CTA/handoff
- Source mapping:
  - `SAP B1` cho product/pricing base
  - `KiotViet` cho store availability projection
  - `Haravan` cho ecommerce catalog/channel context
  - `M08` cho public-safe policy explanation

## 15. Validation Rules

- Public-facing answer phải pass `M07 public-safe evaluation`.
- Suggestion chỉ hợp lệ khi có đủ tối thiểu 1 rationale và CTA set.
- Availability projection phải mang confidence/freshness status.
- Lead/handoff CTA chỉ hiển thị khi channel hiện tại cho phép.

## 16. Error Codes

- `SLS-001`: Sales-safe response blocked.
- `SLS-008`: Product suggestion context insufficient.
- `SLS-009`: Availability / pricing projection unavailable or stale.

## 17. Non-Functional Requirements

- Response đầu tiên phải xuất hiện trong `<= 4 giây` cho `95%` queries.
- Need-discovery follow-up không nên vượt quá `3` câu liên tiếp trước khi đưa suggestion đầu tiên.
- Public-safe evaluation phải được log đầy đủ cho `100%` blocked answers.
- Chat phải hỗ trợ tối thiểu `200` concurrent external sessions trong pilot nhẹ mà không làm rớt lead events.

## 18. Acceptance Criteria

- Khi khách nêu nhu cầu cơ bản, AI hỏi tiếp đủ thông tin rồi đưa ra suggestion card có rationale và CTA.
- Khi khách hỏi thông tin nhạy cảm vượt public-safe boundary, AI block đúng và không lộ dữ liệu nội bộ.
- Khi availability confidence thấp, answer dùng wording projection mềm hoặc CTA xác nhận thay vì cam kết chắc chắn.
- Chỉ documents/policies `public-safe` từ `M08` được dùng trong answer.
- Conversation có thể dẫn sang `F-M10-SLS-003` để tạo lead/handoff.

## 19. Test Scenarios

- Need discovery cho khách hỏi giày theo ngân sách.
- Suggest sản phẩm bình thường với CTA.
- Query bị block do đòi tồn chi tiết hoặc giá nội bộ.
- Availability stale và AI chuyển sang CTA xác nhận.
- Lead được tạo sau khi khách chọn CTA.

## 20. Observability

- Theo dõi `suggestion rate`, `blocked sensitive query rate`, `cta click-through`, `lead conversion`, `availability low-confidence rate`.

## 21. Rollout / Feature Flag

- Mở sau khi internal pilot và knowledge foundation ổn định.
- Product categories và CTA types mở dần theo channel.

## 22. Open Questions

Các quyết định dưới đây đủ để mở `FE Preview`; phần contract backend thật vẫn cần A05 materialize trong Integration Spec trước khi promote `Build Ready`.

| Question | FE Preview Decision | Downstream Note |
|----------|---------------------|-----------------|
| CTA set phase 1 cho từng channel là gì? | Dùng 4 CTA mock: `Xem sản phẩm`, `Để lại thông tin`, `Gặp nhân viên tư vấn`, `Hỏi câu khác`. | Channel routing thật sang CRM/store owner thuộc `F-M10-SLS-003` và Integration Spec. |
| Availability projection được phép chi tiết tới mức nào? | Chỉ hiển thị 3 mức wording: `Còn hàng tại [cửa hàng]`, `Có thể còn tại [khu vực], nên xác nhận trước`, `Liên hệ cửa hàng để xác nhận tình trạng hàng`; không hiển thị số tồn kho. | Mapping confidence/freshness thật phải được A05/A08 chốt trước BE build. |
| Kịch bản nào cần human handoff ngay thay vì tiếp tục AI discovery? | Trigger handoff mock khi khách hỏi dữ liệu nhạy cảm, availability confidence thấp nhưng muốn đến cửa hàng, lead form submit lỗi 2 lần, hoặc khách chọn CTA `Gặp nhân viên tư vấn`. | Destination routing và payload tối thiểu thuộc `F-M10-SLS-003` / `F-M11-ESC-001`. |

## 23. Definition of Done

- Sales Advisor AI tư vấn được trong giới hạn an toàn, có conversion path rõ, và không làm lộ dữ liệu nội bộ.

## 24. Ready-for-UXUI Checklist

- [x] UXUI đã chốt sales chat shell, need-discovery prompts, suggestion card, blocked state, CTA footer

## 25. Ready-for-FE-Preview Checklist

- [x] FE Preview có mock `discovery`, `suggestion`, `low-confidence availability`, `blocked`, `cta offered`
- [x] Stub payload đủ `rationale`, `price_band`, `availability_confidence`, `policy_notes`, `cta_options`

## 26. Ready-for-BE / Integration Promotion Checklist

- [ ] Public-safe evaluation, product projection, and CTA handoff contracts đã rõ
- [ ] Mapping giữa source systems và public-safe fields đã được chốt
