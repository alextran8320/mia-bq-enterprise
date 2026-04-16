# Feature SRS: F-M04-PRO-001 Promotion

**Status**: Draft
**Owner**: A03 BA Agent
**Last Updated By**: Claude Code (claude-sonnet-4-6)
**Last Reviewed By**: A01 PM Agent
**Approval Required**: PM
**Approved By**: -
**Last Status Change**: 2026-04-15
**Source of Truth**: This document
**Blocking Reason**: Chưa chốt source-priority rule cho CTKM và phạm vi public-safe exposure
**Module**: M04
**Phase**: PB-02 / PB-03
**Priority**: High
**Document Role**: SRS high-level cho module Promotion của MIABOS

---

## 0. Metadata

- Feature ID: `F-M04-PRO-001`
- Related User Story: `US-M04-PRO-001`
- Related PRD: `PRD-MIABOS-BQ-Phase1`
- Related Screens: promotion answer card, voucher detail, promo scope explanation
- Related APIs: `POST /mia/promotions/query`
- Related Tables: `promotion_read_model`, `source_priority_rule`
- Related Events: `promotion.read_model.updated`, `promotion.expired`
- Related Error IDs: `PRO-001`, `PRO-002`, `PRO-003`

## 0B. Integration Source Map

| Data Domain | Source System | Direction | Notes |
|---|---|---|---|
| CTKM nội bộ, promotion config, voucher set | SAP B1 | Read | Nguồn master cho promotion rules nội bộ |
| CTKM ecommerce, voucher online, campaign discount | Haravan | Read | Nguồn cho promotion phía online/sàn |
| CTKM tại POS, loyalty redemption tại cửa hàng | KiotViet | Read | Nguồn cho promotion tại điểm bán |
| Policy CTKM theo loại cửa hàng (chính hãng vs đại lý), whitelist public-safe | MIABOS Knowledge Center (M08) | Read | Quy tắc whitelist và scope CTKM — "policy 1 giá + CTKM riêng CHS" |
| Promotion read model, source-priority rule | MIABOS internal DB | Write | Output sau khi resolve priority + scope |

## 1. User Story

Là Sales, Marketing, CSKH, hoặc AI bán hàng, tôi muốn biết CTKM / voucher / coupon áp dụng đúng cho sản phẩm hoặc khách hàng trong đúng context.

## 1A. User Task Flow

| Step | User Role | Action | Task Type | Notes |
|------|-----------|--------|-----------|-------|
| 1 | Sales / CSKH | Hỏi CTKM đang áp dụng cho sản phẩm X hoặc tại cửa hàng/kênh cụ thể | Quick Action | Điểm vào |
| 2 | Sales / CSKH | Xem CTKM kết luận: tên, điều kiện, % giảm, hiệu lực, scope, nguồn | Reporting | Kết quả chính |
| 3 | CSKH | Kiểm tra xem CTKM có áp dụng cho khách hàng cụ thể không (channel/group) | Quick Action | Customer context |
| 4 | Marketing / Ecommerce | Xem toàn bộ CTKM đang active theo channel/store type để lên kế hoạch | Reporting | Campaign view |
| 5 | Sales / CSKH | Nhận cảnh báo nếu CTKM conflict giữa SAP B1 và Haravan | Exception Handling | Data quality |

## 2. Business Context

BQ pack ghi nhận: xác định CTKM phù hợp tại BQ hiện đang làm **thủ công** — đây là pain point trực tiếp. CTKM của BQ không đơn giản: có chính sách 1 giá nhưng CTKM riêng cho cửa hàng chính hãng (VD: 20%), CTKM theo campaign ecommerce trên Haravan, voucher tại POS KiotViet, và loyalty redemption. Nếu AI không resolve đúng scope và channel, người dùng sẽ nhận CTKM sai — trả cho khách nhầm hoặc mất doanh thu.

## 3. Preconditions

- `M01` đã resolve canonical product key.
- `M03` đã có `source_priority_rule` cho giá cơ sở.
- Promotion source đã được sync tối thiểu từ SAP B1 và Haravan cho phase 1.
- `M07` đã định nghĩa CTKM nào là public-safe (được phép hiển thị trên chatbot ngoài).

## 4. Postconditions

- CTKM được trả ra đúng scope (channel / store type / thời điểm) với hiệu lực và điều kiện rõ ràng.
- Internal-only promo không bị lộ ra public-safe mode.

## 5. Main Flow

1. User hỏi CTKM đang áp dụng cho sản phẩm X hoặc trong context cụ thể.
2. Hệ thống resolve canonical product key từ `M01`.
3. Hệ thống xác định context: channel (ecommerce / POS / đại lý), store type (chính hãng / nhượng quyền), customer group, thời điểm.
4. Hệ thống query `promotion_read_model` và filter theo context + hiệu lực hiện tại.
5. Hệ thống apply `public-safe whitelist` từ `M07` nếu context là chatbot ngoài hoặc sales-safe mode.
6. Render answer card với `CTKM áp dụng`, `điều kiện`, `hiệu lực`, `channel scope`, `source`.
7. User xem detail hoặc hỏi thêm điều kiện áp dụng cụ thể.

## 6. Alternate Flows

- Voucher-only query: trả thông tin voucher/coupon cụ thể theo mã.
- Category-level promo: trả CTKM áp dụng cho toàn bộ nhóm sản phẩm.
- Customer-group promo: trả CTKM riêng cho loyalty tier hoặc đại lý.

## 7. Error Flows

- Conflict giữa CTKM từ SAP B1 và Haravan cho cùng sản phẩm + channel → warning "CTKM chưa đồng nhất" thay vì tự chọn.
- CTKM đã hết hiệu lực nhưng vẫn còn trong read model → filter out và ghi log stale promo.
- Scope mismatch: user hỏi CTKM đại lý nhưng không có quyền xem → trả "không có CTKM phù hợp trong phạm vi của bạn".

## 8. State Machine

`Configured -> Active -> Expired / Conflict Warning / Scope Denied`

## 9. UX / Screen Behavior

- Answer card phải hiển thị: `tên CTKM`, `giảm bao nhiêu / điều kiện gì`, `áp dụng cho channel/store type nào`, `hiệu lực từ - đến`, `nguồn`.
- Phân biệt rõ CTKM nội bộ vs public-safe bằng badge.
- Nếu không có CTKM nào phù hợp: trả rõ "không có CTKM đang áp dụng cho context này" thay vì im lặng.

## 10. Role / Permission Rules

- `Sales / Vận hành bán lẻ (cửa hàng chính hãng)`: xem CTKM áp dụng cho cửa hàng của mình.
- `Marketing / trade marketing`: xem toàn bộ CTKM đang active theo channel/store type.
- `Ecommerce / omnichannel`: xem CTKM ecommerce và campaign online.
- `CSKH`: xem CTKM public-safe để tư vấn khách — không thấy internal-only promo.
- `IT / ERP / data`: xem full promotion source trace.
- Public-safe mode bị giới hạn bởi whitelist từ `M07`.

## 11. Business Rules

- CTKM chỉ được trả ra khi: còn hiệu lực, scope match với context người hỏi, và pass public-safe whitelist nếu cần.
- Không được lộ internal-only promo (ví dụ: CTKM đặc biệt cho đại lý chiến lược) ra ngoài scope cho phép.
- Khi có conflict giữa nguồn, hệ thống không được tự chọn — phải flag conflict và gợi ý confirm với `Marketing / Tài chính`.
- CTKM hết hiệu lực phải được filter out khỏi `promotion_read_model` theo schedule, không để stale promo ảnh hưởng đến answer.
- Điều kiện áp dụng (tối thiểu mua bao nhiêu, loại khách nào, channel nào) phải được hiển thị đầy đủ — không trả "có CTKM" mà không nói điều kiện.

## 12. API Contract Excerpt + Canonical Links

- `POST /mia/promotions/query`: query theo `sku`, `channel`, `store_type`, `customer_group`, `date`
  - Output: `promotions[]` (name, discount, conditions, valid_from, valid_to, scope, source), `warnings[]`
- Canonical links:
  - Reads `I02` (SAP B1 promotion), `I03` (Haravan promotion/campaign), `I04` (KiotViet POS discount)
  - Reads `F-M08-KNW-001` cho policy CTKM theo loại cửa hàng
  - Uses `F-M07-SEC-001` cho public-safe whitelist
  - Feeds `F-M09-AIC-001`, `F-M10-SLS-001`

## 13. Event / Webhook Contract Excerpt + Canonical Links

- `promotion.read_model.updated`: phát khi sync cập nhật `promotion_read_model`.
- `promotion.expired`: phát khi CTKM hết hiệu lực và bị remove khỏi active set.

## 14. Data / DB Impact Excerpt + Canonical Links

- `promotion_read_model`: CTKM đã map theo canonical product key + scope, gồm `valid_from`, `valid_to`, `channel_scope`, `store_type_scope`, `source`
- `source_priority_rule`: rule ưu tiên promotion source theo context (tái dùng từ M03)

## 15. Validation Rules

- Promotion answer phải có `hiệu lực` và `scope` rõ ràng — không được trả CTKM "không rõ điều kiện".
- Expired promotions phải bị filter ra trước khi render.
- Public-safe whitelist phải được check trước khi trả bất kỳ CTKM nào cho mode ngoài.

## 16. Error Codes

- `PRO-001`: Promotion source unresolved hoặc read model không có data.
- `PRO-002`: Promotion conflict giữa SAP B1 và Haravan cho cùng context.
- `PRO-003`: Public-safe whitelist check failed — CTKM bị block.

## 17. Non-Functional Requirements

- Promotion query phải trả kết quả trong `<= 2 giây` cho `95%` queries phase 1.
- `promotion_read_model` phải được refresh tối thiểu mỗi `2 giờ` (CTKM biến động nhanh hơn giá).
- Expired promotion cleanup phải chạy tối thiểu mỗi `1 giờ` để tránh stale promo ảnh hưởng answer.

## 18. Acceptance Criteria

- Sales hỏi CTKM đang áp dụng cho mã X tại cửa hàng chính hãng và nhận đúng CTKM với điều kiện, hiệu lực, nguồn.
- Chatbot public (sales-safe mode) không trả CTKM internal-only — bị filter bởi whitelist.
- CTKM conflict giữa SAP B1 và Haravan được flag warning, không tự chọn.
- CTKM hết hiệu lực không xuất hiện trong answer.

## 19. Test Scenarios

| # | Scenario | Input | Expected Output |
|---|---|---|---|
| TS-01 | CTKM cửa hàng chính hãng | `sku=BQ001, channel=pos, store_type=flagship, date=today` | CTKM 20% CHS + điều kiện + hiệu lực + source |
| TS-02 | CTKM ecommerce | `sku=BQ001, channel=ecommerce, date=today` | CTKM Haravan campaign + scope online |
| TS-03 | Voucher theo customer group | `voucher_code=VIP2026, customer_group=loyal` | CTKM loyalty + điều kiện tối thiểu mua |
| TS-04 | CTKM đã hết hiệu lực | `sku=BQ002` (expired promo in read model) | Filter out expired — không xuất hiện trong answer |
| TS-05 | Conflict CTKM SAP B1 vs Haravan | `sku=BQ003, channel=ecommerce` (conflict) | Warning PRO-002 — không tự chọn nguồn |
| TS-06 | Public-safe mode | CSKH query tư vấn khách | Không trả internal-only promo — whitelist filter |
| TS-07 | Không có CTKM nào phù hợp | `sku=BQ004, channel=agent` (no promo) | "không có CTKM đang áp dụng cho context này" — không im lặng |

## 20. Observability

- **promotion_query_total**: tổng số promotion query theo channel/store type/customer group
- **promotion_resolve_success_rate**: % query trả được CTKM đúng scope
- **promotion_conflict_count**: số lần conflict giữa nguồn CTKM — alert khi tăng đột biến
- **expired_promo_filtered_count**: số lần CTKM hết hiệu lực bị filter — báo hiệu cleanup chậm
- **public_safe_block_count**: số lần internal-only promo bị block bởi whitelist (audit log)
- **no_promo_match_rate**: % query không có CTKM nào phù hợp — dùng để phân tích coverage

## 21. Rollout / Feature Flag

Nội bộ trước, sales-safe sau.

## 22. Open Questions

Owner cuối của CTKM theo từng channel là gì?

## 23. Definition of Done

Promotion module trả lời được cho phase 1.

## 24. Ready-for-UXUI Checklist

- [ ] `User Story` đã approved và có problem, trigger, happy path, dependencies, AC context
- [ ] User Task Flow đủ chi tiết để thiết kế screen/state (§1A)
- [ ] Business rules và permission rules testable (§11)
- [ ] Main, alternate, và error flows đã ghi đầy đủ (§5/6/7)
- [ ] State machine rõ ràng hoặc đánh dấu `N/A + lý do` (§8)
- [ ] Data và event dependencies đã link (§12/13/14)
- [ ] Open questions buộc A06 phải tự bịa behavior đã được resolve hoặc đánh dấu blocker (§22)

## 25. Ready-for-FE-Preview Checklist

- [ ] User Story đã approved và link trong Sprint Backlog
- [ ] UXUI spec tồn tại và cite SRS này
- [ ] Không còn mâu thuẫn chưa giải quyết giữa SRS và UXUI
- [ ] Mock/stub data assumptions cho FE Preview đã rõ ràng
- [ ] PM đã mở `FE Preview` một cách tường minh

## 26. Ready-for-BE / Integration Promotion Checklist

- [ ] FE Preview đã được review
- [ ] Feedback thay đổi behavior từ FE Preview đã được đưa về SRS / UXUI
- [ ] `Integration Spec` (hoặc split technical pack đã approved) align với SRS này
- [ ] UXUI spec tồn tại và cite SRS này
- [ ] Không còn mâu thuẫn chưa giải quyết giữa SRS, UXUI, và technical handoff artifact
- [ ] PM đã confirm `Build Ready`
