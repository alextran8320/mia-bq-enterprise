# Feature SRS: F-M02-INV-001 Inventory Availability

**Status**: SRS Ready
**Owner**: A03 BA Agent
**Last Updated By**: Codex CLI (GPT-5 Codex)
**Last Reviewed By**: A01 PM Agent
**Approval Required**: PM
**Approved By**: -
**Last Status Change**: 2026-04-16
**Source of Truth**: This document
**Blocking Reason**: -
**Module**: M02
**Phase**: PB-02 / PB-03
**Priority**: High
**Document Role**: SRS canonical cho module Inventory Availability của MIABOS.

---

## 0. Metadata

- Feature ID: `F-M02-INV-001`
- Related User Story: `US-M02-INV-001`
- Related UXUI: `../UXUI/UXUI-F-M02-INV-001_Inventory_Availability.md`
- Related Screens: availability answer card, realtime check status, stale warning, source trace drawer
- Related APIs: `POST /mia/inventory/check`, `GET /mia/inventory/availability`
- Related Tables: `inventory_read_model`, `availability_cache`, `inventory_conflict_log`
- Related Events: `mia.inventory.realtime_checked`, `mia.inventory.stale_detected`
- Related Error IDs: `INV-001`, `INV-002`, `INV-003`

## 0B. Integration Source Map

| Data Domain | Source System | Direction | Notes |
|---|---|---|---|
| Tồn kho kho trung tâm, tồn ERP, tồn kế toán | SAP B1 | Read | Nguồn chính cho warehouse / ERP stock; có thể có độ trễ theo batch sync |
| Tồn tại cửa hàng, tồn theo chi nhánh, tồn POS | KiotViet | Read | Nguồn ưu tiên cho store-level operational availability |
| Tồn channel online, tồn ecommerce sellable | Haravan | Read | Chỉ authoritative cho online/channel availability, không đồng nghĩa store stock |
| Canonical product key | MIABOS Product module `M01` | Read | Dùng để resolve đúng SKU/variant trước khi check tồn |
| Scope trim / sensitivity rule | MIABOS Access Control `M07` | Read | Quyết định exact quantity có được lộ ra hay không |
| Availability read model, cache, conflict log | MIABOS internal DB | Write | Lớp hợp nhất phục vụ query nội bộ và AI |

## 1. User Story

Là Sales, CSKH, Store Manager, Logistics, hoặc AI bán hàng, tôi muốn biết tình trạng còn hàng của một SKU/variant theo đúng phạm vi location và channel để có thể tư vấn, xác minh, hoặc ra quyết định vận hành nhanh mà không làm người dùng hiểu nhầm dữ liệu.

## 1A. User Task Flow

| Step | User Role | Action | Task Type | Notes |
|------|-----------|--------|-----------|-------|
| 1 | Sales / CSKH / Logistics | Hỏi tồn theo mã hàng, size, màu, cửa hàng, khu vực, hoặc channel | Quick Action | Entry |
| 2 | Hệ thống | Resolve canonical product key và xác định query context | Quick Action | Product + scope resolution |
| 3 | Hệ thống | Chọn `realtime` hoặc `cache-soft` theo policy | System Decision | Policy-driven |
| 4 | User / AI | Xem kết quả availability kèm source, freshness, confidence, warning | Reporting | Trust layer |
| 5 | User | Kiểm tra lại, xem nguồn, hoặc escalate nếu dữ liệu chưa chắc chắn | Exception Handling | No dead-end |

## 1B. Availability Glossary

| Term | Định nghĩa | Dùng cho ai | Ghi chú |
|------|------------|-------------|---------|
| `on_hand_qty` | Số lượng tồn vật lý hoặc tồn hệ thống đang được nguồn ghi nhận | IT / ERP / Logistics | Không mặc định trả cho Sales/CSKH |
| `reserved_qty` | Số lượng đã giữ chỗ, pending allocation, hoặc đang gắn với đơn chưa hoàn tất | Logistics / Ops | Có thể chưa khả dụng ở mọi nguồn |
| `available_to_sell_qty` | Số lượng còn có thể bán sau khi trừ reserve/hold theo rule | Internal Ops | Là quantity business-meaningful nhất cho quyết định bán |
| `online_sellable_qty` | Số lượng còn được phép bán trên kênh online | Ecommerce / Sales-safe | Không đồng nghĩa tồn tại cửa hàng |
| `transferable_qty` | Số lượng có thể cân nhắc điều chuyển giữa các điểm | Logistics / Regional Ops | Chỉ là dữ kiện hỗ trợ, chưa phải quyết định chuyển hàng |
| `availability_status` | Trạng thái hiển thị: `available`, `low_stock`, `out_of_stock`, `unknown`, `conflict` | Tất cả | Trạng thái trình bày, không thay thế số tồn |
| `quantity_hint` | Gợi ý hiển thị dạng `còn hàng`, `còn ít`, `hết hàng` cho safe mode | Sales / CSKH / external-safe | Rule phase 1: `hết hàng` khi `available_to_sell_qty <= 0`; `còn ít` khi `available_to_sell_qty` từ `1` đến `3`; `còn hàng` khi `available_to_sell_qty >= 4` |
| `freshness_level` | `realtime`, `cached`, `stale`, `unknown` | Tất cả | Phải đi kèm `synced_at` hoặc `checked_at` |

## 1C. Phase 1 Canonical Decisions

### 1. Canonical availability semantics

- `available_to_sell_qty` là quantity business-default cho mọi quyết định nội bộ liên quan đến bán hàng nếu source đủ dữ liệu.
- `on_hand_qty` chỉ là quantity kỹ thuật hoặc fallback trace; không được dùng trực tiếp để trả safe-mode nếu chưa trừ reserve/hold.
- `online_sellable_qty` là quantity authoritative cho câu hỏi theo channel online; không được suy diễn sang store stock.
- Nếu source chưa đủ dữ liệu để tính `available_to_sell_qty`, hệ thống phải trả `unknown` hoặc wording `còn hàng cần xác minh`, không được suy diễn optimistic.

### 2. Phase 1 location hierarchy

- `region`: lớp tổng hợp quản trị khu vực.
- `branch`: đơn vị vận hành / thương mại trực thuộc một `region`.
- `store`: điểm bán vật lý trực thuộc một `branch` và một `region`.
- `warehouse`: điểm lưu kho, tách khỏi `store` nhưng có thể được link sang `branch` hoặc `region`.
- `channel`: chiều trực giao với location, gồm tối thiểu `retail_official`, `dealer`, `ecommerce`, `marketplace`.
- `store_type`: thuộc tính phân loại của `store`, gồm tối thiểu `official_store`, `dealer_store`, `outlet`, `warehouse_only`, `online_only`.

### 3. Resolution rule

- Query tồn bắt buộc phải resolve ít nhất tới `variant + one location dimension + channel context`.
- Nếu query chỉ có `region` hoặc `branch`, kết quả phải được gắn nhãn `aggregate / projection`.
- Nếu query theo `store`, answer có thể trả exact hoặc safe summary tùy `M07`.

## 2. Business Context

BQ vận hành retail đa cửa hàng và đa kênh, trong đó cùng một câu hỏi "còn hàng không" có thể cho ra nhiều đáp án khác nhau tùy nguồn: SAP B1 cho tồn ERP và kho trung tâm, KiotViet cho tồn operational tại từng cửa hàng, Haravan cho khả dụng bán trên kênh online. Với ngành giày dép, câu hỏi tồn kho thực tế luôn gắn với `SKU x size x màu x location x channel`; nếu hệ thống trả lời thiếu một trong các chiều này, người dùng có thể hiểu sai và mất niềm tin vào chatbot. Vì vậy module này không chỉ là màn hình xem tồn, mà là decision layer giúp internal users và AI trả lời tồn kho an toàn, có nguồn gốc, và có mức độ tin cậy rõ ràng.

## 3. Preconditions

- `M01 Product` đã cung cấp canonical product mapping tối thiểu ở mức `product + variant`.
- Location mapping giữa SAP B1, KiotViet, Haravan đã có tối thiểu để map `warehouse`, `branch`, `store`, `channel` trong phase 1.
- `M07 Access Control And Sensitivity` đã định nghĩa rõ role nào được xem exact quantity, role nào chỉ được xem `quantity_hint`.
- `I05` / `I06` đã có contract tối thiểu cho source routing và read-model projection.
- Có freshness SLA tối thiểu cho từng nguồn để phân biệt `realtime`, `cached`, và `stale`.

## 4. Postconditions

- Mọi availability answer đều có `source`, `scope`, `freshness`, và `warning` phù hợp với context người hỏi.
- User không nhận exact quantity nếu không đủ quyền hoặc không đủ độ tin cậy dữ liệu.
- Khi dữ liệu không đủ chắc chắn, hệ thống trả `unknown` hoặc `needs confirmation` thay vì kết luận lạc quan.

## 5. Main Flow

1. User hỏi tồn kho theo mã hàng, barcode, tên hàng, hoặc SKU cụ thể; nếu là sản phẩm có biến thể, user có thể nêu thêm `size` và `màu`.
2. Hệ thống resolve về `canonical_product_id` và `variant_key` từ `M01`.
3. Nếu sản phẩm yêu cầu variant mà query chưa đủ `size` hoặc `màu`, hệ thống dừng flow availability và trả clarifying prompt thay vì tự đoán.
4. Hệ thống xác định `location_scope` và `channel_context`: `warehouse`, `branch`, `store`, `region`, `channel`, hoặc `global`.
5. Hệ thống xác định `request_mode`: `internal_exact`, `internal_summary`, `sales_safe`, hoặc `public_safe` theo `M07`.
6. Hệ thống chọn path `prefer_realtime` hoặc `allow_cache` theo use case, role, và mức độ nhạy cảm của quyết định.
7. Hệ thống gọi nguồn phù hợp hoặc đọc từ `inventory_read_model` / `availability_cache`, sau đó hợp nhất dữ liệu theo grain chuẩn `canonical_product_id + variant + location + channel`.
8. Hệ thống tính `availability_status`, `quantity_hint`, `freshness_level`, `availability_confidence`, và `conflict_status`.
9. Hệ thống gắn `source`, `checked_sources[]`, `synced_at` hoặc `checked_at`, `scope`, `warnings[]`, và `next_action_hint` vào response.
10. UI render answer card theo quyền: role nội bộ đủ scope có thể thấy exact quantity; safe mode chỉ thấy `quantity_hint`.
11. Nếu confidence thấp, stale, hoặc conflict vượt ngưỡng, hệ thống không trả kết luận chắc chắn mà gợi ý `kiểm tra realtime`, `xem kho khác`, hoặc `escalate logistics`.

## 6. Alternate Flows

- User hỏi tồn theo khu vực hoặc tỉnh: hệ thống trả aggregated result và ghi rõ đây là projection tổng hợp, không phải cam kết tồn tại từng cửa hàng.
- Realtime timeout nhưng cache còn trong TTL: trả cache với badge `cached` và timestamp cuối cùng.
- Logistics hỏi để cân nhắc điều chuyển: trả detail theo kho / chi nhánh nếu user đủ quyền, kèm source trace.
- Sales-safe mode hỏi tồn ở cửa hàng gần nhất: chỉ trả `còn hàng / còn ít / hết hàng` và tên điểm bán gần nhất trong scope.
- Batch query nhiều SKU ở mức vùng / toàn hệ thống: ưu tiên cache-soft để tối ưu tốc độ thay vì exactness realtime.

## 7. Error Flows

- `SAP B1` timeout: fallback sang cache; nếu cache cũng stale quá TTL thì trả `unknown` với warning rõ ràng.
- KiotViet branch mismatch: trả `không tìm thấy dữ liệu cho chi nhánh này`, không im lặng fail.
- Conflict rõ rệt giữa KiotViet và SAP B1: vào warning/conflict state, không tự chọn một nguồn rồi kết luận chắc chắn.
- Query thiếu variant bắt buộc: không chạy check tồn mà trả clarifying prompt.
- User hỏi location ngoài scope quyền: block exact answer, chỉ trả safe summary hoặc thông báo ngoài phạm vi.
- Haravan báo còn hàng online nhưng source store-level không xác nhận: trả `channel-specific only` hoặc `low confidence`, không suy diễn là còn tại cửa hàng.

## 8. State Machine

`Ready -> Resolving Context -> Realtime Checking / Cache Lookup -> Available / Low Stock / Out Of Stock / Conflict / Needs Confirmation / Failed`

## 9. UX / Screen Behavior

- Kết quả tồn phải có `freshness badge` ngay cạnh số liệu hoặc trạng thái.
- Nếu dữ liệu là stale hoặc cache fallback, copy phải nói rõ thời điểm dữ liệu được đồng bộ hoặc kiểm tra.
- Query thiếu `size` / `màu` phải vào clarifying state, không hiển thị empty state mơ hồ.
- Conflict giữa nguồn phải là một state riêng có CTA, không chỉ là badge phụ.
- Sales-safe/public-safe card chỉ hiển thị `quantity_hint`; exact quantity và discrepancy log phải bị ẩn hoàn toàn.
- Aggregated result theo khu vực phải ghi rõ đây là projection tổng hợp.

## 10. Role / Permission Rules

- `Store Manager / Vận hành bán lẻ`: xem tồn chi tiết của cửa hàng mình và điểm liên quan trong scope được cấp.
- `Logistics / Kho / Fulfillment`: xem tồn chi tiết theo kho trung tâm, chi nhánh, và multi-store summary khi đủ quyền.
- `Sales / CSKH / Ecommerce`: thường chỉ xem được `quantity_hint`, store-safe summary, hoặc online availability.
- `IT / ERP / Data`: xem technical trace đầy đủ gồm discrepancy log và checked sources.
- Mọi field-level projection phải đi qua `M07` trước khi render.

## 11. Business Rules

- Mọi availability answer phải có `source` và `synced_at` hoặc `checked_at`; không được trả số tồn không rõ nguồn.
- Khi realtime check thành công, đó là kết quả ưu tiên; cache chỉ dùng khi policy cho phép hoặc realtime không khả dụng.
- `KiotViet` là nguồn ưu tiên cho store-level operational availability.
- `SAP B1` là nguồn ưu tiên cho warehouse / ERP stock.
- `Haravan` chỉ authoritative cho `online_sellable_qty` / online channel, không dùng để khẳng định exact store stock.
- Inventory answer phải được tính trên `canonical product key + variant + location scope + channel`; không được check ở mức product cha nếu variant là bắt buộc để bán.
- `available_to_sell_qty` là quantity business-default cho internal decision nếu source đủ dữ liệu; `on_hand_qty` chỉ dùng như technical trace hoặc fallback.
- `quantity_hint` cho sales-safe/public-safe phải đi qua rule nội bộ; không map thẳng raw exact quantity nếu chưa được policy duyệt.
- Rule `quantity_hint` phase 1:
  - `hết hàng` khi `available_to_sell_qty <= 0`
  - `còn ít` khi `available_to_sell_qty` trong khoảng `1-3`
  - `còn hàng` khi `available_to_sell_qty >= 4`
- Nếu chỉ có `on_hand_qty` mà chưa tính được `available_to_sell_qty`, safe mode không được suy ra `quantity_hint` chắc chắn; kết quả phải downgrade thành `còn hàng cần xác minh` hoặc `unknown` theo policy copy.
- Freshness SLA phase 1:
  - `KiotViet store-level`: `realtime` khi check trực tiếp trong request; `cached` nếu snapshot <= `15 phút`; `stale` nếu > `15 phút`
  - `Haravan online`: `realtime` khi pull trực tiếp; `cached` nếu snapshot <= `15 phút`; `stale` nếu > `15 phút`
  - `SAP B1 warehouse-level`: `cached` hợp lệ nếu snapshot <= `4 giờ`; `stale` nếu > `4 giờ`
- Conflict threshold phase 1:
  - `minor_conflict` khi chênh lệch tuyệt đối giữa hai nguồn là `1-2 đơn vị`
  - `major_conflict` khi chênh lệch tuyệt đối >= `3 đơn vị`
  - `major_conflict` phải downgrade answer xuống `conflict` hoặc `needs confirmation` đối với internal decision-sensitive queries
- Nếu conflict giữa SAP B1 và KiotViet vượt ngưỡng cho phép, hệ thống phải trả `conflict` hoặc `needs confirmation`, không tự chọn một bên.
- Nếu không đủ source hoặc rule để kết luận, hệ thống phải trả `unknown`, không suy diễn optimistic.
- Khi user hỏi `có nên chuyển hàng không`, phase 1 chỉ được trả dữ kiện hỗ trợ và CTA escalation; chưa được tự động khuyến nghị điều chuyển nếu chưa có transfer rule được phê duyệt.

## 11B. Realtime / Cache Decision Matrix

| Use Case | Primary Role | Scope thường gặp | Preferred Path | Fallback | Output Mode | Notes |
|----------|--------------|------------------|----------------|----------|-------------|-------|
| Tư vấn bán tại cửa hàng cho SKU + size cụ thể | Sales / Store | Store cụ thể | Realtime KiotViet | Cache <= 15 phút | Exact nếu đủ quyền, ngược lại `quantity_hint` | Use case nhạy cảm với chốt đơn |
| CSKH hỏi còn hàng online | CSKH / Ecommerce | Channel online | Haravan current | Cache <= 15 phút | Sales-safe summary | Không đồng nghĩa còn ở cửa hàng |
| Logistics kiểm tra để cân nhắc điều chuyển | Logistics / Ops | Kho + nhiều store | Realtime nếu xử lý incident, ngược lại cache-soft | KV <= 15 phút, SAP <= 4 giờ | Exact + source trace | Có thể đọc nhiều nguồn song song |
| Quản lý hỏi tổng quan khu vực | Regional Manager | Region / branch aggregate | Cache-soft | Warning nếu quá TTL | Aggregate summary | Không cần realtime mặc định |
| AI bán hàng external hỏi gần còn hàng không | Sales Advisor AI | Store vicinity / channel-safe | Cache-soft đã trim | `unknown` nếu stale/conflict | `quantity_hint` only | Không lộ exact quantity |
| Kiểm tra nhanh toàn hệ thống nhiều SKU | Ops / Tech | Global aggregate | Cache-soft | None | Summary / report mode | Tối ưu tốc độ hơn realtime |

### Rule Notes cho Matrix

- `prefer_realtime` là bắt buộc khi quyết định có thể ảnh hưởng trực tiếp đến chốt đơn tại store hoặc xử lý incident logistics.
- `allow_cache` chỉ hợp lệ khi snapshot chưa vượt freshness SLA của nguồn tương ứng.
- `cache_only` chỉ nên dùng cho report/aggregate mode, không dùng cho decision-sensitive query tại điểm bán.

## 12. API Contract Excerpt + Canonical Links

### `POST /mia/inventory/check`

- Mục đích: check availability cho 1 SKU/variant trong 1 context cụ thể.
- Input:
  - `sku` hoặc `canonical_product_id`
  - `variant_attrs` gồm `size`, `color`, `width` nếu có
  - `location_scope`: `warehouse`, `branch`, `store`, `region`, `channel`, `global`
  - `location_id` hoặc `location_group_id`
  - `channel`
  - `request_mode`: `internal_exact`, `internal_summary`, `sales_safe`, `public_safe`
  - `freshness_policy`: `prefer_realtime`, `allow_cache`, `cache_only`
  - `allow_fallback`: boolean
- Output:
  - `availability_status`
  - `quantity_exact` nếu role đủ quyền
  - `quantity_hint`
  - `scope`
  - `source`
  - `checked_sources[]`
  - `synced_at`
  - `checked_at`
  - `freshness_level`
  - `availability_confidence`
  - `conflict_status`
  - `warnings[]`
  - `next_action_hint`

### `GET /mia/inventory/availability`

- Mục đích: list availability theo nhiều SKU trong cùng một context.
- Query params: `sku[]`, `location_scope`, `channel`, `request_mode`, `freshness_policy`
- Output: aggregated availability list, top warnings, freshness summary

### Canonical Links

- Reads `I02` (SAP B1 inventory), `I03` (Haravan inventory sync), `I04` (KiotViet store inventory)
- Uses `F-M01-PRD-001` để resolve canonical product key
- Uses `F-M07-SEC-001` để trim scope và sensitivity
- Depends on `M13` / `I06` cho location hierarchy và projection contract
- Feeds `F-M09-AIC-001` và `F-M10-SLS-001`

## 13. Event / Webhook Contract Excerpt + Canonical Links

- `mia.inventory.realtime_checked`: phát khi realtime check được thực hiện.
- `mia.inventory.stale_detected`: phát khi cache vượt freshness threshold.
- `mia.inventory.conflict_detected`: phát khi phát hiện discrepancy vượt ngưỡng giữa các nguồn.

## 14. Data / DB Impact Excerpt + Canonical Links

- `inventory_read_model`
  - Grain tối thiểu: `canonical_product_id + variant_key + source_system + location_type + location_id + channel`
  - Fields gợi ý:
    - `on_hand_qty`
    - `reserved_qty`
    - `available_to_sell_qty`
    - `online_sellable_qty`
    - `transferable_qty`
    - `source_system`
    - `source_record_id`
    - `synced_at`
    - `freshness_level`
    - `conflict_flag`
    - `location_scope_snapshot`
- `availability_cache`
  - Key gợi ý: `canonical_product_id + variant_key + location_scope + request_mode + channel`
  - Chứa TTL theo từng nguồn và từng use case
- `inventory_conflict_log`
  - Lưu discrepancy giữa sources để audit và root-cause analysis
- `location_scope_mapping`
  - Mapping `warehouse / branch / store / region / channel / dealer` phục vụ resolve scope

## 15. Validation Rules

- Mọi availability answer phải có `source` và `synced_at` hoặc `checked_at`; nếu không có thì không được render như kết quả chính thức.
- Tồn âm hoặc tồn bất thường phải bị flag warning, không hiển thị như dữ liệu bình thường.
- Conflict giữa sources phải được detect trước khi render.
- Nếu sản phẩm có variant bắt buộc mà query không chỉ rõ variant, request phải dừng ở clarifying state.
- `quantity_exact` chỉ được trả nếu `request_mode` và `M07` đều cho phép.
- `quantity_hint` chỉ được render khi có `available_to_sell_qty` hợp lệ hoặc projection rule tương đương đã được duyệt.
- Nếu conflict chỉ ở mức `minor_conflict`, answer summary vẫn có thể render nhưng phải có warning nhẹ và source trace.
- Nếu conflict ở mức `major_conflict`, answer exact phải bị chặn đối với role không phải `IT / ERP / Data` hoặc `Logistics / Ops`.
- Haravan online quantity không được map sang store-level answer nếu không có bridge rule được duyệt.
- Mọi cache fallback phải lưu rõ lý do fallback: `timeout`, `source unavailable`, `rate limit`, hoặc `manual policy`.

## 16. Error Codes

- `INV-001`: Availability check failed; cả realtime và cache đều không khả dụng.
- `INV-002`: Product không resolve được để check inventory.
- `INV-003`: Conflict giữa SAP B1 và KiotViet vượt ngưỡng cho phép.
- `INV-004`: Query thiếu variant bắt buộc.
- `INV-005`: Location ngoài scope hoặc không map được.

## 17. Non-Functional Requirements

- Realtime path phải trả kết quả trong `<= 3 giây` cho `90%` queries phase 1.
- Cache-soft path phải trả kết quả trong `<= 1 giây` cho `95%` queries.
- Cache TTL tối đa: KiotViet store-level `15 phút`; SAP B1 warehouse-level `4 giờ`.
- Cache TTL tối đa: Haravan online `15 phút`.
- Hỗ trợ tối thiểu `100` concurrent availability queries trong pilot phase 1.
- Scope evaluation qua `M07` không được làm tổng latency vượt budget realtime path.
- Mọi response phải log `source`, `freshness_level`, `fallback_used`, `conflict_status` để audit.
- Conflict detection phải deterministic trên cùng input và cùng source snapshot.
- Nếu source vượt TTL, hệ thống phải downgrade confidence hoặc trả stale warning trong `100%` cases.

## 18. Acceptance Criteria

- User hỏi tồn theo mã + cửa hàng và nhận kết quả có source, timestamp, freshness badge.
- Khi realtime timeout nhưng cache còn hợp lệ, hệ thống fallback cache và nói rõ đó là dữ liệu cache.
- Conflict giữa SAP B1 và KiotViet được flag warning, không tự chọn một nguồn rồi trả chắc chắn.
- User không đủ scope chỉ nhận `quantity_hint`, không nhận exact quantity.
- Với safe mode, `available_to_sell_qty = 0` trả `hết hàng`; `1-3` trả `còn ít`; `>= 4` trả `còn hàng`.
- Với sản phẩm có variant, nếu user chưa chỉ rõ `size` hoặc `màu`, hệ thống hỏi lại thay vì trả sai grain.
- Query kênh online chỉ trả online/channel-safe availability, không suy diễn thành tồn tại cửa hàng.
- Logistics nội bộ có thể thấy exact quantity và source trace theo kho/chi nhánh khi đủ quyền.
- Nếu stale vượt threshold và realtime cũng không khả dụng, answer phải về `unknown` hoặc `needs confirmation`.
- Nếu conflict ở mức `major_conflict`, hệ thống không trả exact answer cho Sales/CSKH dù vẫn có source data.

## 19. Test Scenarios

1. Realtime KiotViet success cho SKU + size + store.
2. SAP timeout nhưng cache còn trong TTL -> fallback cache hợp lệ.
3. SAP timeout và cache stale quá TTL -> trả `unknown` + stale warning.
4. Query thiếu `size` cho sản phẩm variant -> clarifying prompt.
5. Sales-safe mode hỏi tồn store -> chỉ nhận `quantity_hint`, không nhận số exact.
6. Conflict giữa SAP B1 và KiotViet vượt ngưỡng -> card vào trạng thái conflict.
7. Haravan báo còn online nhưng store-level source không xác nhận -> answer channel-specific only.
8. User hỏi ngoài branch scope -> exact answer bị block theo `M07`.
9. Logistics hỏi multi-store để cân nhắc điều chuyển -> thấy aggregate + source trace.
10. Batch query nhiều SKU theo khu vực -> dùng cache-soft path và gắn aggregate warning.
11. Safe mode với `available_to_sell_qty = 2` -> trả `còn ít`.
12. Safe mode với chỉ `on_hand_qty` nhưng thiếu reserve/hold contract -> không trả `quantity_hint` chắc chắn.
13. Minor conflict (`delta = 1`) -> render summary + warning nhẹ.
14. Major conflict (`delta >= 3`) -> chặn exact answer cho Sales/CSKH.

## 20. Observability

Theo dõi tối thiểu các metric sau:

- `success_rate`
- `realtime_rate`
- `fallback_rate`
- `stale_answer_rate`
- `conflict_rate`
- `clarifying_prompt_rate`
- `scope_denied_rate`
- top SKU / location gây conflict nhiều nhất

## 21. Rollout / Feature Flag

- Phase 1: internal-first cho Store Manager, Logistics, CSKH nội bộ.
- Phase 2: mở sales-safe projection cho AI sales advisor và các role front-line.
- Public-safe mode chỉ mở sau khi sensitivity rules và confidence wording được chốt.

## 22. Open Questions

- Grain canonical cuối cùng của `inventory_read_model` có bắt buộc `variant + location + channel` ở phase 1 không?
- `available_to_sell_qty` có tính được ngay từ source hiện tại hay cần phase sau mới có reserve/hold contract đầy đủ?
- Branch / store / dealer hierarchy chính thức của BQ sẽ map thế nào trong `M13`?
- Với câu hỏi `có nên chuyển hàng không`, phase 1 chỉ dừng ở CTA escalation hay cho phép suggestion mềm theo rule?

## 23. Definition of Done

Module Inventory Availability được coi là đạt khi:

- resolve được query tồn từ canonical product layer
- trả kết quả có source + freshness rõ ràng
- tôn trọng scope trim của `M07`
- xử lý được clarifying, stale, conflict, và fallback cache
- phục vụ được cả internal mode lẫn sales-safe mode ở mức tối thiểu

## 24. Ready-for-UXUI Checklist

- [x] UXUI canonical theo module folder đã được materialize ổn định
- [x] UXUI draft cho route inventory availability đã tồn tại
- [x] UXUI đã chốt cách hiển thị availability confidence ở mức draft handoff
- [x] UXUI đã chốt conflict / stale state và copy an toàn ở mức draft handoff

## 25. Ready-for-FE-Preview Checklist

- [ ] FE Preview có mock `realtime`, `cached`, `stale`, `conflict`, và `clarifying` states
- [ ] FE Preview có safe-mode card và internal-exact card tách biệt
- [ ] FE Preview có source trace drawer hoặc equivalent disclosure

## 26. Ready-for-BE / Integration Promotion Checklist

- [ ] BE contract realtime vs cache đã chốt
- [ ] Canonical availability semantics đã chốt với BA/PM
- [ ] Location hierarchy và projection dependency `M13` / `I06` đã map rõ
- [x] Freshness SLA phase 1 đã được định nghĩa trong SRS
- [x] Conflict threshold phase 1 giữa SAP B1 / KiotViet / Haravan đã được định nghĩa
