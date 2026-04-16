# Feature SRS: F-M03-PRC-001 Pricing

**Status**: Draft
**Owner**: A03 BA Agent
**Last Updated By**: Claude Code (claude-sonnet-4-6)
**Last Reviewed By**: A01 PM Agent
**Approval Required**: PM
**Approved By**: -
**Last Status Change**: 2026-04-15
**Source of Truth**: This document
**Blocking Reason**: Chưa chốt source-priority rule cho giá theo kênh và loại cửa hàng
**Module**: M03
**Phase**: PB-02 / PB-03
**Priority**: High
**Document Role**: SRS high-level cho module Pricing của MIABOS

---

## 0. Metadata

- Feature ID: `F-M03-PRC-001`
- Related User Story: `US-M03-PRC-001`
- Related Screens: price answer card, source priority warning, pricing detail summary
- Related APIs: `POST /mia/pricing/query`
- Related Tables: `pricing_read_model`, `source_priority_rule`
- Related Events: `pricing.read_model.updated`
- Related Error IDs: `PRC-001`

## 0B. Integration Source Map

| Data Domain | Source System | Direction | Notes |
|---|---|---|---|
| Giá cơ sở, price list, pricebook | SAP B1 | Read | Nguồn chính cho giá nội bộ và đại lý |
| Giá ecommerce, giá online, discounted price | Haravan | Read | Nguồn cho giá hiển thị trên website/sàn |
| Giá tại POS, giá bán lẻ tại cửa hàng | KiotViet | Read | Nguồn cho giá tại điểm bán |
| Policy 1 giá, CTKM riêng theo loại cửa hàng (VD: 20% CHS chính hãng) | MIABOS Knowledge Center (M08) | Read | Policy layer — quy tắc ưu tiên theo channel/store type |
| Pricing read model, source-priority rule | MIABOS internal DB | Write | Output sau khi resolve priority rule |

## 1. User Story

Là Sales, Marketing, Finance, hoặc AI bán hàng, tôi muốn biết giá áp dụng đúng theo kênh / loại cửa hàng / context để tư vấn và đối soát chính xác.

## 1A. User Task Flow

| Step | User Role | Action | Task Type | Notes |
|------|-----------|--------|-----------|-------|
| 1 | User | Hỏi giá của mã hàng trong một context cụ thể | Quick Action | Entry |
| 2 | Hệ thống | Resolve source-priority rule | Quick Action | Rule engine |
| 3 | User / AI | Xem giá kết luận + nguồn + warning nếu conflict | Reporting | Trust |

## 2. Business Context

BQ pack ghi nhận rõ: BQ áp dụng `chính sách 1 giá` nhưng CTKM khác nhau theo loại cửa hàng (ví dụ: 20% riêng cho cửa hàng chính hãng). Giá cơ sở nằm ở SAP B1, giá ecommerce ở Haravan, giá tại POS ở KiotViet — và việc xác định CTKM phù hợp hiện đang làm **thủ công**. Nếu chatbot trả lời giá mà không resolve đúng context (channel / loại cửa hàng / thời điểm), người dùng sẽ nhận được giá sai và mất tin tưởng vào AI.

## 3. Preconditions

- `M01` đã resolve canonical product key.
- Source-priority rule đã được định nghĩa tối thiểu cho phase 1 (SAP B1 là master giá cơ sở; CTKM lấy từ M08 Knowledge hoặc promotion source).
- `M07` đã định nghĩa field giá nào được phép trả theo từng role.

## 4. Postconditions

- Giá được trả ra đúng context (channel / store type / thời điểm) với source trace rõ ràng.
- Khi không đủ rule hoặc có conflict, hệ thống trả warning thay vì tự suy đoán.

## 5. Main Flow

1. User hỏi giá của sản phẩm theo một context cụ thể (kênh, loại cửa hàng, thời điểm).
2. Hệ thống resolve canonical product key từ `M01`.
3. Hệ thống xác định context: channel (ecommerce / POS / đại lý), store type (chính hãng / nhượng quyền), và thời điểm hiện tại.
4. Hệ thống tra `source_priority_rule`: SAP B1 là giá cơ sở; CTKM theo context từ `M04` hoặc `M08`.
5. Nếu có CTKM áp dụng cho context này, merge giá CTKM lên giá cơ sở.
6. Nếu có conflict giữa nguồn, gắn warning "giá chưa đồng nhất giữa các nguồn" thay vì tự chọn.
7. Render answer card với `giá kết luận`, `context áp dụng`, `source`, `có CTKM không`, `warning`.

## 6. Alternate Flows

- Advisory-only pricing cho public-safe mode: chỉ trả giá niêm yết, không trả giá nội bộ/đại lý.
- Fallback khi thiếu rule: trả "chưa có rule cho context này" và đề nghị escalation.

## 7. Error Flows

- Conflict giữa SAP B1 và Haravan/KiotViet vượt ngưỡng → warning + không tự chọn.
- Thiếu source-priority rule cho context này → trả "không đủ dữ liệu để confirm giá" + gợi ý liên hệ Finance.
- Giá stale (sync lag > threshold) → gắn stale badge.

## 8. State Machine

`Configured -> Active -> Conflict Warning / Stale Warning / Needs Review`

## 9. UX / Screen Behavior

- Answer card phải hiển thị: `giá kết luận`, `context áp dụng (channel/store type)`, `nguồn giá`, `thời điểm sync`.
- Nếu có CTKM: hiển thị riêng `giá gốc`, `CTKM áp dụng`, `giá sau CTKM`.
- Warning conflict / stale phải hiển thị inline, không ẩn im lặng.

## 10. Role / Permission Rules

- `Sales / Vận hành bán lẻ`: xem giá bán theo channel được giao — không thấy giá nhập/margin.
- `Tài chính / pricing control (Ban điều hành)`: xem giá cơ sở SAP B1 và source-priority rule.
- `Marketing / trade marketing`: xem CTKM đang áp dụng theo từng channel/store type.
- `IT / ERP / data`: xem full trace bao gồm conflict log.
- Field giá nhạy cảm (giá nhập, margin) bị mask theo `M07`.

## 11. Business Rules

- Giá cơ sở (SAP B1) là authoritative base price — các nguồn khác chỉ được phép có CTKM overlay, không được override giá cơ sở im lặng.
- Nếu chưa có source-priority rule cho context (channel/store type) cụ thể, hệ thống không được tự suy diễn — phải trả warning và gợi ý escalation.
- CTKM chỉ được tính khi có hiệu lực hợp lệ và scope match với context người hỏi.
- Giá tại cửa hàng chính hãng và đại lý có thể khác nhau do CTKM riêng — UI phải phân biệt rõ hai context này, không gộp chung.
- Không được trả giá nhập hoặc margin cho user ngoài scope `Tài chính / pricing control`.

## 12. API Contract Excerpt + Canonical Links

- `POST /mia/pricing/query`: query theo `sku`, `channel`, `store_type`, `date`
  - Output: `base_price`, `promotion_applied`, `final_price`, `source`, `synced_at`, `warnings[]`, `context_applied`
- Canonical links:
  - Reads `I02` (SAP B1 pricing), `I03` (Haravan pricing), `I04` (KiotViet POS pricing)
  - Reads `F-M04-PRO-001` cho CTKM overlay
  - Reads `F-M08-KNW-001` cho policy giá dạng rule/SOP
  - Uses `F-M07-SEC-001` để trim field nhạy cảm
  - Feeds `F-M09-AIC-001`, `F-M10-SLS-001`

## 13. Event / Webhook Contract Excerpt + Canonical Links

- `pricing.read_model.updated`: phát khi `pricing_read_model` được sync cập nhật.

## 14. Data / DB Impact Excerpt + Canonical Links

- `pricing_read_model`: giá đã resolve theo canonical product key, gồm `base_price`, `source`, `synced_at`
- `source_priority_rule`: rule ưu tiên nguồn giá theo channel/store type — đây là bảng trung tâm của module này

## 15. Validation Rules

- Mọi answer giá phải map được về ít nhất 1 rule trong `source_priority_rule` hoặc trả warning rõ.
- Giá stale (synced_at vượt threshold) phải được gắn `stale` trước khi render.
- Conflict giữa sources phải được detect và flag — không được tự resolve im lặng.

## 16. Error Codes

- `PRC-001`: Source-priority unresolved cho context hiện tại.
- `PRC-002`: Giá conflict giữa SAP B1 và nguồn khác vượt ngưỡng.
- `PRC-003`: Giá stale vượt freshness threshold.

## 17. Non-Functional Requirements

- Pricing resolution phải deterministic — cùng input luôn cho cùng output theo rule, không có randomness.
- `POST /mia/pricing/query` phải trả kết quả trong `<= 2 giây` cho `95%` queries phase 1.
- `source_priority_rule` phải có audit log mỗi khi rule thay đổi để trace lý do.
- Pricing data phải được refresh từ SAP B1 tối thiểu mỗi `4 giờ`.

## 18. Acceptance Criteria

- Sales hỏi giá mã X theo kênh ecommerce và nhận `giá kết luận`, `CTKM nếu có`, `nguồn`, `context áp dụng`.
- Khi cùng SKU có giá khác nhau giữa SAP B1 và Haravan ngoài CTKM đã biết, hệ thống trả warning conflict thay vì tự chọn.
- Tài chính / pricing control xem được source-priority rule và trace tại sao giá ra kết quả đó.
- Giá stale hiển thị `stale` badge, không pass như dữ liệu mới.

## 19. Test Scenarios

Pricing theo channel, pricing conflict, stale price.

## 20. Observability

Theo dõi số case pricing warning.

## 21. Rollout / Feature Flag

Nội bộ trước, AI bán hàng sau.

## 22. Open Questions

Source owner cuối cùng của giá theo từng channel là gì?

## 23. Definition of Done

Có pricing answer đáng tin cậy cho phase 1.

## 24. Ready-for-UXUI Checklist

- [ ] UXUI đã chốt warning state cho pricing conflict

## 25. Ready-for-FE-Preview Checklist

- [ ] FE Preview có mock multi-source pricing

## 26. Ready-for-BE / Integration Promotion Checklist

- [ ] BE contract source-priority đã rõ
