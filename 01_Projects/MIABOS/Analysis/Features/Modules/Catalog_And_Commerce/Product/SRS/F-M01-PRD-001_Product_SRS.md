# Feature SRS: F-M01-PRD-001 Product

**Status**: SRS Ready
**Owner**: A03 BA Agent
**Last Updated By**: Claude (Antigravity / claude-sonnet-4-6)
**Last Reviewed By**: A01 PM Agent
**Approval Required**: PM
**Approved By**: Business Owner (answered 2026-04-17)
**Last Status Change**: 2026-04-17
**Source of Truth**: This document
**Blocking Reason**: -
**Module**: M01
**Phase**: PB-02 / PB-03
**Priority**: High
**Document Role**: SRS canonical cho module Product của MIABOS, dùng cho tra cứu nội bộ và tư vấn bán hàng

---

## 0. Metadata

- Feature ID: `F-M01-PRD-001`
- Related User Story: `US-M01-PRD-001`
- Related PRD: `PRD-MIABOS-BQ-Phase1`
- Related Screens: chatbot answer card, product detail summary, product trace source
- Related APIs: `POST /mia/products/query`, `GET /mia/products/{id}`
- Related Tables: `product_read_model`, `har_catalog_read_model`, `kv_product_read_model`
- Related Events: `product.read_model.updated`
- Related Error IDs: `PRD-001`, `PRD-002`, `PRD-003`

## 0B. Integration Source Map

| Data Domain | Source System | Direction | Notes |
|---|---|---|---|
| Item master, barcode, variant, thuộc tính kỹ thuật | SAP B1 | Read | Nguồn chính cho product canonical identity |
| Catalog ecommerce, collection, mô tả web, ảnh | Haravan | Read | Nguồn cho sales-safe projection phía online |
| POS product, barcode tại cửa hàng | KiotViet | Read | Tham chiếu tại điểm bán, có thể lệch với SAP B1 |
| Product policy, hướng dẫn bảo hành, đổi trả | MIABOS Knowledge Center (M08) | Read | Policy layer, không merge vào product master |
| Product canonical read model | MIABOS internal DB | Write | Output của mapping layer, phục vụ M09/M10 |

## 1. User Story

Là người dùng nội bộ hoặc AI bán hàng, tôi muốn tra cứu được sản phẩm theo mã, barcode, variant, category, collection, thuộc tính, và channel projection để trả lời nhanh và chính xác.

## 1A. User Task Flow

| Step | User Role | Action | Task Type | Notes |
|------|-----------|--------|-----------|-------|
| 1 | Sales / CSKH | Hỏi về sản phẩm theo mã, barcode, hoặc tên gần đúng | Quick Action | Điểm vào |
| 2 | Sales / CSKH | Chọn kết quả đúng nếu fuzzy match trả nhiều gợi ý | Quick Action | Xác nhận kết quả |
| 3 | Sales / CSKH | Xem answer card: tên, mã, variant, source, synced_at | Reporting | Kết quả chính |
| 4 | Logistics / IT | Xem source trace đầy đủ hoặc kiểm tra conflict giữa nguồn | Reporting | Role nội bộ |
| 5 | Sales / CSKH | Yêu cầu thêm thông tin về policy/availability từ M02/M08 | Quick Action | Cross-module handoff |

## 2. Business Context

BQ vận hành hơn 200 cửa hàng/đại lý với dữ liệu sản phẩm nằm phân mảnh giữa SAP B1 (item master), KiotViet (POS catalog), và Haravan (ecommerce catalog). Cùng một mã hàng có thể có tên khác nhau, mô tả khác nhau, hoặc trạng thái khác nhau tùy theo hệ thống. Nếu AI và Sales không có lớp product thống nhất, câu trả lời sẽ không nhất quán và mất niềm tin từ người dùng nội bộ.

## 3. Preconditions

- Integration Source Specs `I02` (SAP B1), `I03` (Haravan), `I04` (KiotViet) đã có canonical product mapping tối thiểu.
- `product_read_model` đã được seed với ít nhất bộ dữ liệu mẫu từ phase 1.
- `M07` đã cung cấp scope rule để biết field nào public-safe.

## 4. Postconditions

- Mọi query product đều resolve về `product_read_model` thống nhất với source trace rõ ràng.
- Projection theo role/channel được áp dụng trước khi render answer card.

## 5. Main Flow

1. User hỏi về sản phẩm bằng mã, barcode, tên, hoặc mô tả.
2. Hệ thống resolve về `canonical product key` trong `product_read_model`.
3. Nếu không resolve được, hệ thống thử fuzzy match hoặc trả "không tìm thấy" với gợi ý tìm lại.
4. Hệ thống nạp projection phù hợp theo role/channel của người hỏi từ `M07`.
5. Hệ thống render answer card gồm `tên`, `mã`, `variant`, `thuộc tính chính`, `source`, `thời điểm sync`.
6. User xem source trace hoặc yêu cầu thêm thông tin về policy/availability.

## 6. Alternate Flows

- Tìm theo barcode trả về SKU + variant mapping.
- Tìm tên gần đúng trả danh sách gợi ý để user xác nhận.
- Sales advisor (M10) query product cho tư vấn — nhận sales-safe projection.

## 7. Error Flows

- SKU/barcode không map được vào canonical key → trả "không tìm thấy" + gợi ý cách tìm lại.
- Payload nguồn thiếu field quan trọng → answer card có warning "thông tin chưa đầy đủ" và ghi rõ field thiếu từ nguồn nào.
- Conflict giữa tên/mã giữa SAP B1 và KiotViet → hiển thị warning "dữ liệu chưa đồng nhất" thay vì tự chọn.

## 8. State Machine

`Draft -> Active -> Stale (sync lag > threshold) -> Deprecated`

## 9. UX / Screen Behavior

- Answer card phải hiển thị: `tên chuẩn`, `mã`, `variant rõ (size/màu nếu giày)`, `source chính`, `thời điểm sync`.
- Nếu có nhiều projection (nội bộ vs sales-safe), phân biệt rõ bằng badge.
- Field thiếu hoặc conflict gắn warning inline, không ẩn im lặng.

## 10. Role / Permission Rules

- `Sales / CSKH (Vận hành bán lẻ, Ecommerce)`: nhận sales-safe projection — có tên, mô tả, thuộc tính, giá cơ sở; không thấy internal cost hoặc supplier info.
- `Tài chính / pricing control`: có thể thấy thêm giá nhập, cấu trúc cost nếu scope cho phép.
- `IT / ERP / data`: có thể xem technical trace đầy đủ.
- Mọi projection phải đi qua `M07` trước khi render.

## 11. Business Rules

- Mọi product answer phải resolve về `product_read_model`; không được trả raw payload từ SAP B1/KiotViet/Haravan trực tiếp.
- Nếu canonical key không xác định được, hệ thống không được tự chọn nguồn ưu tiên — phải trả warning hoặc gợi ý tìm lại.
- **Canonical product name**: `SAP B1` là nguồn authoritative cho tên chuẩn (`name_canonical`) dùng để hiển thị. Tên từ KiotViet và Haravan chỉ dùng cho search/fuzzy match và channel-specific display, không được override tên chuẩn.
- **Sales-safe field list** (approved by Business Owner 2026-04-17): Sales / CSKH **được phép thấy**: tên sản phẩm chuẩn, mã SKU, barcode, mô tả sản phẩm, ảnh sản phẩm, giá niêm yết, thuộc tính (size, màu, chất liệu), trạng thái active/inactive.
- **Hidden fields** — bắt buộc mask cho Sales/CSKH: giá nhập / giá vốn, supplier code / mã nhà cung cấp, margin. Chỉ `Tài chính / pricing control` và `IT/ERP` được xem khi đủ scope `M07`.
- Sales-safe projection không được chứa bất kỳ field nào trong danh sách hidden, kể cả dưới dạng aggregate hoặc derived calculation.
- Khi `source sync lag > threshold`, answer card phải gắn `stale` badge thay vì hiển thị như dữ liệu mới.

## 12. API Contract Excerpt + Canonical Links

- `POST /mia/products/query`: query theo `sku`, `barcode`, `name_fuzzy`, `category`, `channel`
  - Output: `canonical_id`, `name`, `variants[]`, `attributes{}`, `source`, `synced_at`, `projection_scope`
- `GET /mia/products/{id}`: lấy full detail theo canonical ID
- Canonical links:
  - Reads integration layer `I02` (SAP B1), `I03` (Haravan), `I04` (KiotViet)
  - Uses `F-M07-SEC-001` để trim projection
  - Feeds `F-M09-AIC-001` (internal chat), `F-M10-SLS-001` (sales advisor)

## 13. Event / Webhook Contract Excerpt + Canonical Links

- `product.read_model.updated`: phát khi sync cập nhật `product_read_model` từ bất kỳ nguồn nào.

## 14. Data / DB Impact Excerpt + Canonical Links

- `product_read_model`: canonical product data, unified từ SAP B1 + Haravan + KiotViet
- `har_catalog_read_model`: Haravan catalog snapshot — nguồn cho sales-safe/ecommerce projection
- `kv_product_read_model`: KiotViet product snapshot — nguồn cho POS/store projection
- Source mapping: SAP B1 là chủ product master; Haravan/KiotViet là channel read layers

## 15. Validation Rules

- Mọi product answer phải có `source` và `synced_at` rõ ràng.
- Sales-safe projection không được chứa field nằm trong `sensitivity_rule` của `M07`.
- Fuzzy match chỉ được trả gợi ý (suggest list), không được tự confirm kết quả match.

## 16. Error Codes

- `PRD-001`: Không resolve được canonical product key.
- `PRD-002`: Product read model stale (sync lag > threshold).
- `PRD-003`: Projection conflict — nguồn báo product khác nhau và chưa có resolution rule.

## 17. Non-Functional Requirements

- `POST /mia/products/query` phải trả kết quả trong `<= 2 giây` cho `95%` queries phase 1.
- Fuzzy search với tên gần đúng phải trả gợi ý trong `<= 3 giây`.
- `product_read_model` phải được refresh tối thiểu mỗi `4 giờ` từ SAP B1 để tránh stale quá lâu.
- Hỗ trợ tối thiểu `50` concurrent internal queries trong pilot phase 1.

## 18. Acceptance Criteria

- Sales / CSKH query sản phẩm theo mã và nhận answer card đầy đủ tên, variant, source, synced_at.
- Query theo tên gần đúng trả danh sách gợi ý, không tự chọn kết quả sai.
- Field ngoài scope sales-safe bị ẩn/masked khi user không có quyền.
- Product stale hơn threshold hiển thị `stale` badge thay vì pass như dữ liệu mới.

## 19. Test Scenarios

| # | Scenario | Input | Expected Output |
|---|---|---|---|
| TS-01 | Query chính xác theo SKU | `sku=BQ001` | Answer card đầy đủ: tên, mã, variant, source, synced_at |
| TS-02 | Query theo barcode | `barcode=8936082100123` | Map về canonical SKU + answer card |
| TS-03 | Fuzzy name không rõ | `name_fuzzy=giày da nam` | Suggest list ≥3 gợi ý, không tự chọn |
| TS-04 | SKU không tồn tại | `sku=NOTFOUND` | Error `PRD-001` + gợi ý tìm lại |
| TS-05 | Product read model stale | `sku=BQ002` (synced_at > threshold) | Stale badge rõ trên answer card |
| TS-06 | Sales-safe projection | Sales query `sku=BQ001` | Không thấy internal cost, supplier code, margin |
| TS-07 | Conflict SAP B1 vs KiotViet | `sku=BQ003` (conflict state) | Warning "dữ liệu chưa đồng nhất" — không tự chọn nguồn |

## 20. Observability

- **product_query_total**: tổng số query theo SKU/barcode/fuzzy name
- **product_resolve_success_rate**: % query resolve được canonical key
- **product_unresolved_mapping**: danh sách SKU/barcode không map được — dùng để báo cáo data quality
- **product_stale_rate**: % answer card trả về với stale badge
- **product_conflict_count**: số lần SAP B1 vs KiotViet conflict — alert khi tăng đột biến
- **projection_violation_count**: số lần sensitive field bị request ngoài scope (audit log)

## 21. Rollout / Feature Flag

Phase 1 internal trước, sales-safe sau.

## 22. Open Questions

> ✅ **Đã được Business Owner chốt ngày 2026-04-17:**
>
> - **Sales-safe field list**: Tên sản phẩm chuẩn, mã SKU, barcode, mô tả, ảnh, giá niêm yết, thuộc tính (size/màu/chất liệu), trạng thái active/inactive. Hidden: giá nhập, supplier code, margin.
> - **Canonical name source**: SAP B1 là authoritative cho tên chuẩn.

_Không còn open question blocking UXUI._

## 23. Definition of Done

Module Product được coi là đạt khi:
- resolve được query sản phẩm về `product_read_model` với canonical key từ SAP B1
- trả sales-safe projection đúng field list đã chốt
- ẩn hoàn toàn giá nhập, supplier code, margin với Sales/CSKH
- có source trace và synced_at trên mọi answer card
- fuzzy match trả suggest list, không tự confirm kết quả sai
- conflict và stale hiển thị warning inline, không ẩn im lặng

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
