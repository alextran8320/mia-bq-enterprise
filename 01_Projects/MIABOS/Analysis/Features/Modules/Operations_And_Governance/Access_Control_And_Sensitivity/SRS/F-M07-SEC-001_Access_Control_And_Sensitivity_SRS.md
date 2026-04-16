# Feature SRS: F-M07-SEC-001 Access Control and Sensitivity

**Status**: Draft
**Owner**: A03 BA Agent
**Last Updated By**: Codex CLI (GPT-5 Codex)
**Last Reviewed By**: A01 PM Agent
**Approval Required**: PM
**Approved By**: -
**Last Status Change**: 2026-04-16
**Source of Truth**: This document
**Blocking Reason**: Cần chốt role matrix BQ theo phòng ban, quy tắc scope theo branch/store/channel/store type, taxonomy độ nhạy dữ liệu, và public-safe response policy cho pilot phase 1
**Module**: M07
**Phase**: PB-02 / PB-03
**Priority**: High
**Document Role**: SRS canonical cho lớp quản trị role, data scope, sensitivity gating, masking, và public-safe policy của MIABOS

---

## 0. Metadata

- Feature ID: `F-M07-SEC-001`
- Related User Story: `US-M07-SEC-001`
- Related PRD: `-`
- Related Screens: user scope profile list, role/scope profile detail, sensitivity rule list, policy preview, public-safe rule config, blocked/masked answer states
- Related APIs: `POST /mia/access/evaluate`, `POST /mia/public-safe/evaluate`, `GET /mia/access/profiles/:id`, `POST /mia/access/rules/preview`
- Related Tables: `mia_user_scope_profile`, `mia_role_profile`, `sensitivity_rule`, `public_safe_response_policy`, `mia_access_audit_log`
- Related Events: `mia.access.rule.updated`, `mia.access.profile.updated`, `mia.public_safe_policy.updated`, `mia.access.denied`
- Related Error IDs: `SEC-001`, `SEC-002`, `SEC-003`, `SEC-004`, `SEC-005`

## 0B. Integration Source Map

| Data Domain | Source System | Direction | Notes |
|---|---|---|---|
| User identity, login subject, base account status | MIABOS internal DB hoặc approved IdP | Read | M07 chỉ tiêu thụ identity gốc, không phụ thuộc hoàn toàn vào role ngoài |
| Department / role abstraction | MIABOS internal DB | Read/Write | MIABOS là authority cho role nội bộ phục vụ AI |
| Branch, region, warehouse, store type mapping | SAP B1 + KiotViet + Haravan | Read | Dùng để resolve scope branch/store/channel theo ngữ cảnh BQ |
| Channel taxonomy | Haravan + MIABOS internal config | Read | Phân biệt online, retail, dealer, marketplace, omnichannel |
| Sensitivity rules, public-safe policy | MIABOS internal DB | Read/Write | Quản trị nội bộ, không kéo từ hệ ngoài |
| Escalation handoff constraint | M11 Workflow / Case Handling | Read | Nếu answer bị block, có thể chỉ cho phép escalation với payload đã mask |
| Audit / metrics sink | M12 Observability | Write | Ghi denied events, masked events, policy-gap events |

## 1. User Story

Là `PM Governance`, `Admin / Ops Governance`, `IT / ERP / data`, hoặc owner vận hành từng phòng ban, tôi muốn MIABOS tự quản lý quyền truy cập, phạm vi dữ liệu, mức độ nhạy cảm, và chính sách public-safe để AI chỉ trả đúng dữ liệu cho đúng người, đúng bối cảnh, và vẫn có đường xử lý tiếp khi gặp dữ liệu bị chặn.

## 1A. User Task Flow

| Step | User Role | Action | Task Type | Notes |
|------|-----------|--------|-----------|-------|
| 1 | Admin / Ops Governance | Tạo hoặc sửa role profile cho nhóm người dùng BQ | Configuration | Entry |
| 2 | Admin / Ops Governance | Gán data scope theo branch, store, region, channel, store type | Configuration | Scope control |
| 3 | Admin / Ops Governance | Khai báo sensitivity rules và public-safe policies | Configuration | Governance |
| 4 | Hệ thống | Khi M09/M10/M08 cần render answer hoặc transcript, gọi evaluate engine | Quick Action | Runtime gate |
| 5 | Hệ thống | Trả kết quả `allow`, `mask`, `summary_only`, `deny`, hoặc `escalation_only` | Quick Action | Decision |
| 6 | User / Team Lead | Nhìn thấy answer phù hợp scope, hoặc blocked state rõ ràng, hoặc CTA escalation | Exception Handling | Outcome |

## 2. Business Context

BQ vận hành theo mô hình retail đa chi nhánh, đa cửa hàng, đa kênh, và có sự khác biệt rõ giữa cửa hàng chính hãng, đại lý, ecommerce, và các đội hỗ trợ trung tâm. Theo stakeholder map và BQ pack, các nhóm như `Ban điều hành / vận hành trung tâm`, `Vận hành bán lẻ`, `CSKH`, `Logistics / kho`, `Marketing / Trade`, `Ecommerce / omnichannel`, `Tài chính / pricing control`, và `IT / ERP / data` đều có lý do hợp lệ để dùng AI, nhưng không thể nhìn cùng một lớp dữ liệu.

Pain point thật của BQ là dữ liệu đang phân mảnh giữa `SAP B1`, `KiotViet`, `Haravan`, `Excel`, và lớp workflow như `Lark`. Nếu MIABOS không có lớp phân quyền độc lập, AI rất dễ:

- làm lộ giá nhập, margin-adjacent data, hoặc cơ chế CTKM nội bộ cho vai trò không phù hợp
- cho phép cửa hàng/đại lý nhìn dữ liệu ngoài phạm vi chi nhánh, vùng, hoặc kênh
- hiển thị transcript/source snapshot nhạy cảm trong các luồng review và escalation
- làm mất niềm tin ngay từ pilot vì user thấy "AI trả đúng nhưng sai người"

Vì vậy M07 là gatekeeper bắt buộc cho toàn bộ phase 1 của chatbot nội bộ và cả public-safe mode ở các surface về sau.

## 3. Preconditions

- User identity tối thiểu đã tồn tại trong MIABOS hoặc qua IdP được approve.
- Có mapping tối thiểu giữa `branch`, `store`, `region`, `warehouse`, `channel`, `store_type` từ các nguồn `SAP B1`, `KiotViet`, `Haravan`.
- Các module tiêu thụ dữ liệu như `M08`, `M09`, `M10`, `M11` chấp nhận gọi evaluate API trước khi render hoặc handoff.
- Admin đã khai báo ít nhất một bộ `role profile`, một bộ `scope profile`, và một policy `public-safe` cho pilot.

## 4. Postconditions

- Mọi answer, transcript detail, source trace, escalation payload, và review payload đều đi qua M07 trước khi hiển thị hoặc gửi tiếp.
- Các blocked/masked decisions có audit trail và giải thích vận hành đủ rõ cho PM/Ops theo dõi.
- Admin có thể thay đổi rule mà không cần sửa code downstream.

## 5. Main Flow

1. Một module tiêu thụ dữ liệu như `M09 Internal AI Chat`, `M09 Trust Review`, `M10 Sales Advisor`, hoặc `M11 Escalation` gửi request tới `POST /mia/access/evaluate` trước khi render output hoặc gửi handoff payload.
2. M07 resolve `actor identity` thành `user`, `role_profile`, `department`, `tenant`, và trạng thái active.
3. M07 resolve `context scope` gồm `branch`, `region`, `store`, `store_type`, `warehouse`, `channel`, `entry_point`, và `mode` (`internal`, `public-safe`, `escalation-recipient`, `reviewer`).
4. M07 load `requested data fields` và `resource class` từ module gọi, ví dụ `inventory.available_qty`, `pricing.base_price`, `promotion.mechanic`, `customer.phone`, `chat.source_snapshot`.
5. M07 đối chiếu role profile với data scope profile để xác định resource đó có thuộc phạm vi cho phép hay không.
6. Nếu resource thuộc phạm vi, M07 tiếp tục áp dụng `sensitivity_rule` để quyết định từng field được `allow`, `mask`, `summary_only`, hay `deny`.
7. Nếu mode là `public-safe`, M07 áp dụng thêm `public_safe_response_policy`; policy này có thể giảm thêm kết quả từ `allow` xuống `summary_only` hoặc `deny`.
8. Nếu answer chính bị deny hoàn toàn nhưng use case cho phép follow-up, M07 trả `decision = escalation_only` cùng reason code để M11/M09 mở CTA chuyển người xử lý.
9. M07 ghi `mia_access_audit_log` với input context, policy version, decision summary, và denied/masked reasons.
10. Module downstream chỉ được render đúng theo payload projection M07 trả về; không được tự khôi phục field gốc từ data source.

## 6. Alternate Flows

- `Internal manager mode`: Team Lead hoặc PM Governance được xem aggregate hoặc cross-branch trong đúng domain của mình nhưng vẫn bị chặn các field tài chính sâu.
- `Dealer-safe mode`: Người dùng thuộc hệ đại lý được xem giá bán/chính sách áp dụng cho kênh của mình, nhưng không được xem data của cửa hàng chính hãng.
- `Public-safe mode`: Chatbot external hoặc sales-safe chỉ được xem whitelist tối thiểu như tồn khả dụng dạng hint, giá công khai, CTKM public.
- `Escalation-recipient mode`: Người nhận case ở M11 được xem payload đã mask theo role nhận case, không mặc định nhận full transcript.
- `Reviewer mode`: M09-AIC-002 mở transcript/history theo scope review, có thể thấy masked transcript thay vì full detail.

## 7. Error Flows

- Không tìm thấy `mia_user_scope_profile` cho user đang truy cập -> chặn output, trả `SEC-002`, ghi audit.
- User có nhiều scope profile xung đột nhau trên cùng một `branch/store/channel` -> chặn output, trả `SEC-004`, yêu cầu Admin resolve.
- Thiếu mapping `branch/store/channel` từ nguồn upstream nên không resolve được context -> default deny, trả `SEC-005`.
- Module downstream gửi field chưa đăng ký sensitivity class -> default deny và ghi `policy_gap`.
- `public_safe_response_policy` lỗi hoặc chưa có bản active cho mode hiện tại -> deny toàn bộ câu trả lời public-safe.
- Evaluate engine timeout hoặc lỗi hệ thống -> fail closed, không fail open.

## 8. State Machine

`Draft -> Configured -> Active -> Warning / Blocked -> Deprecated`

Giải thích:

- `Configured`: đã có tối thiểu role profile, scope profile, sensitivity rules
- `Active`: runtime evaluate đang dùng policy version hợp lệ
- `Warning`: có policy gap hoặc mapping gap nhưng chưa gây outage toàn phần
- `Blocked`: evaluate engine hoặc config state khiến downstream không thể sử dụng an toàn

## 9. UX / Screen Behavior

- Màn hình `Role / Scope Profile` phải cho phép đọc nhanh theo "ai được xem cái gì", không chỉ hiển thị JSON hay field kỹ thuật.
- Policy preview phải cho phép thử scenario như: `Store Manager tại chi nhánh A hỏi tồn kho SKU X`, `CSKH hỏi lịch sử đơn`, `sales-safe bot hỏi giá`.
- Blocked state cho end-user phải dùng ngôn ngữ vận hành như `ngoài phạm vi chi nhánh`, `thông tin nhạy cảm`, `chỉ hiển thị cho bộ phận phụ trách`, không lộ tên field kỹ thuật.
- Masked state phải phân biệt rõ giữa `đã ẩn một phần` và `không được phép xem toàn bộ`.
- Nếu decision là `escalation_only`, UI phải hiện CTA rõ ràng `Chuyển người phụ trách xử lý`.

## 10. Role / Permission Rules

- `PM Governance`: xem được mọi policy, audit summary, override review và quản lý exception policy ở mức hệ thống.
- `Admin / Ops Governance`: tạo/sửa role profile, scope profile, sensitivity rules, public-safe policy, nhưng không được giả mạo quyền kinh doanh ngoài policy đã phê duyệt.
- `IT / ERP / data`: xem audit trail sâu, mapping gaps, policy gaps, và debug info của evaluate engine.
- `Ban điều hành / vận hành trung tâm`: xem báo cáo aggregate cross-domain, nhưng quyền xem chi tiết field vẫn phụ thuộc sensitivity rule.
- `Store Manager / Retail Operations`: xem dữ liệu trong branch/store/vùng được giao; không xem giá nhập hoặc dữ liệu của đơn vị khác.
- `CSKH Team Lead`: xem ticket/order/service context thuộc phạm vi khách hàng và kênh phụ trách; không xem full pricing internals.
- `Pricing Control / Finance`: xem logic giá, discount authority, và policy liên quan; không mặc định xem full customer transcript nếu không có nhu cầu.
- `Ecommerce / Omnichannel Lead`: xem online order, channel operations, và chính sách kênh online trong scope được giao.
- `Dealer / Franchise role`: chỉ xem dữ liệu áp dụng cho nhóm cửa hàng/đại lý được gán; không được nhìn nội bộ HQ.
- `M08`, `M09`, `M10`, `M11`: bắt buộc là consumer của evaluate API; không được bypass bằng rule local.

## 11. Business Rules

- M07 là authority cho `role abstraction`, `data scope`, `sensitivity`, và `public-safe` trong MIABOS; không reuse mù quáng role gốc từ `SAP B1`, `KiotViet`, hoặc `Haravan`.
- Scope phải xét đồng thời ít nhất 4 trục: `branch/store`, `region`, `channel`, `store_type`; không đủ dữ liệu ở bất kỳ trục nào thì mặc định `deny`.
- Sensitivity class tối thiểu cho phase 1 phải có: `Public`, `Internal Operational`, `Restricted Internal`, `Sensitive Commercial`, `PII / Customer Sensitive`.
- Với mỗi field hoặc resource class, action hợp lệ chỉ nằm trong tập: `allow`, `mask`, `summary_only`, `deny`, `escalation_only`.
- `summary_only` chỉ được dùng khi có định nghĩa projection cụ thể; không được để downstream tự tóm tắt theo cảm tính.
- Nếu `requested field` không có sensitivity class hoặc policy mapping, hệ thống phải `deny` thay vì `allow`.
- Public-safe policy luôn là lớp siết chặt thêm, không bao giờ nới rộng hơn kết quả evaluate nội bộ.
- Payload được gửi sang `M11 Escalation` hoặc `M09 Trust Review` vẫn phải tôn trọng sensitivity theo role người nhận, không theo role người hỏi ban đầu.
- Mọi thay đổi policy phải có `reason`, `changed_by`, `approved_by`, `effective_at`, và audit trail.
- Không có role nào tự mở rộng scope cho chính mình; mọi thay đổi scope phải do `Admin / Ops Governance` hoặc `PM Governance` thực hiện.
- Denied/masked decisions phải trả `reason_code` chuẩn để downstream hiển thị đúng ngôn ngữ vận hành và feed được vào analytics.

## 12. API Contract Excerpt + Canonical Links

- `POST /mia/access/evaluate`
  - Purpose: evaluate projection cho một request render/handoff cụ thể
  - Input:
    - `user_id`
    - `role_profile_code`
    - `mode` = `internal | public-safe | escalation-recipient | reviewer`
    - `context`: `branch_id`, `store_id`, `region_id`, `channel_code`, `store_type`, `entry_point`
    - `resource_type`: `inventory | pricing | promotion | product | customer | transcript | source_trace | escalation_payload`
    - `requested_fields[]`
    - `resource_scope_ref`
  - Output:
    - `decision`
    - `allowed_fields[]`
    - `masked_fields[]`
    - `summary_projection`
    - `blocked_reason_code`
    - `policy_version`
    - `requires_escalation`
- `POST /mia/public-safe/evaluate`
  - Purpose: evaluate riêng cho kịch bản external/public-safe
  - Input: `resource_type`, `requested_fields[]`, `channel_code`, `policy_context`
  - Output: `public_allowed_fields[]`, `summary_projection`, `blocked_reason_code`
- `GET /mia/access/profiles/:id`
  - Output: role profile + scope profile + effective policies
- `POST /mia/access/rules/preview`
  - Input: actor + context + requested resource giả lập
  - Output: projected result để admin preview trước khi publish policy
- Canonical links:
  - Gatekeeper cho `F-M09-AIC-001`, `F-M09-AIC-002`, `F-M09-AIC-003`, `F-M10-SLS-001`, `F-M11-ESC-001`
  - Gửi denied/masked events sang `F-M12-OBS-001`

## 13. Event / Webhook Contract Excerpt + Canonical Links

- `mia.access.profile.updated`: khi user scope profile hoặc role profile thay đổi.
- `mia.access.rule.updated`: khi sensitivity rule được tạo/sửa/deprecate.
- `mia.public_safe_policy.updated`: khi policy public-safe đổi version active.
- `mia.access.denied`: khi runtime evaluate trả `deny` hoặc `escalation_only`.
- `mia.access.policy_gap_detected`: khi field/resource không có mapping policy.

## 14. Data / DB Impact Excerpt + Canonical Links

- `mia_role_profile`
  - `role_profile_code`, `department_code`, `can_view_cross_branch`, `can_receive_escalation`, `status`
- `mia_user_scope_profile`
  - `user_id`, `role_profile_code`, `branch_scope`, `store_scope`, `region_scope`, `channel_scope`, `store_type_scope`, `effective_from`, `effective_to`
- `sensitivity_rule`
  - `resource_type`, `field_code`, `sensitivity_class`, `allowed_role_profiles`, `projection_type`, `policy_version`, `status`
- `public_safe_response_policy`
  - `resource_type`, `allowed_fields`, `summary_projection`, `channel_scope`, `effective_at`, `status`
- `mia_access_audit_log`
  - `request_id`, `user_id`, `role_profile_code`, `mode`, `resource_type`, `decision`, `blocked_reason_code`, `policy_version`, `evaluated_at`
- Canonical notes:
  - Không mirror full source payload gốc ở M07; M07 chỉ quản lý policy + audit + projection outcome
  - Scope dimension codes phải map được sang master data read models từ integration layer

## 15. Validation Rules

- Module downstream không được render field nào ngoài `allowed_fields[]` hoặc `summary_projection` M07 trả về.
- `summary_projection` phải là output chuẩn hóa từ policy, không phải text tự sinh ngẫu hứng.
- Mọi evaluate call phải được log vào `mia_access_audit_log`, kể cả `allow`.
- Nếu context thiếu `branch/channel/store_type` mà resource yêu cầu những dimension đó, evaluate phải fail closed.
- Policy preview chỉ hợp lệ nếu dùng đúng engine và policy version đang active; không được dùng mock rules khác production.
- Recipient của escalation/review chỉ xem được payload sau khi M07 re-evaluate theo role nhận.

## 16. Error Codes

- `SEC-001`: Policy evaluation failed - rule engine/system error.
- `SEC-002`: User scope profile not found.
- `SEC-003`: Public-safe policy blocked the resource.
- `SEC-004`: Conflicting scope assignments detected.
- `SEC-005`: Missing context or mapping data for access evaluation.

## 17. Non-Functional Requirements

- `POST /mia/access/evaluate` phải trả kết quả trong `<= 200ms` cho `95%` request chuẩn.
- `POST /mia/public-safe/evaluate` phải trả kết quả trong `<= 150ms` cho `95%` request.
- Policy change phải invalidate cache và có hiệu lực runtime trong `<= 60 giây`.
- Audit log cho mọi evaluate decision phải giữ tối thiểu `180 ngày`.
- Chính sách active phải versioned; rollback về bản policy trước phải thực hiện được trong `<= 5 phút`.
- Evaluate engine phải deterministic: cùng `user + context + policy_version + resource payload` phải ra cùng kết quả.
- Denied/masked events phải xuất hiện trên dashboard M12 trong `<= 5 phút`.

## 18. Acceptance Criteria

- `Store Manager` chỉ xem được tồn kho và CTKM trong branch/store được giao; query ngoài scope bị block với lý do vận hành rõ ràng.
- `Sales / Retail Operations` không xem được `giá nhập`, `margin-adjacent fields`, hoặc CTKM mechanic nội bộ nếu role profile không cho phép.
- `CSKH Team Lead` xem được complaint/order/service context của team mình nhưng transcript/source detail nhạy cảm vẫn bị mask theo policy.
- `Public-safe mode` chỉ trả các field trong whitelist và có thể hạ từ số tuyệt đối xuống `summary_projection` nếu policy yêu cầu.
- Nếu thiếu mapping policy cho field mới, hệ thống phải deny và ghi `policy_gap_detected`, không render field đó.
- Nếu answer bị deny hoàn toàn nhưng scenario cho phép follow-up, downstream nhận được `requires_escalation = true`.
- Admin thay đổi policy và effect được áp dụng cho runtime trong thời gian NFR quy định, có audit đầy đủ.

## 19. Test Scenarios

- `Store Manager` hỏi tồn SKU ở chi nhánh của mình -> allow.
- `Store Manager` hỏi tồn của chi nhánh khác -> deny với reason `OUT_OF_SCOPE_BRANCH`.
- `Sales role` hỏi giá nhập -> deny hoặc summary-only theo policy.
- `Public-safe bot` hỏi CTKM nội bộ -> deny.
- `CSKH Team Lead` mở answer history có customer PII -> masked transcript.
- `Escalation recipient` nhận case từ pricing conflict -> payload đã mask đúng theo role nhận.
- Policy mới publish cho `promotion.mechanic` -> preview đúng, runtime đổi đúng, audit log có policy version mới.

## 20. Observability

- Theo dõi `allow rate`, `deny rate`, `masked rate`, `summary_only rate`, `policy_gap count`, `scope_conflict count`, `public-safe block count`, `escalation_only count`.
- Breakdown theo `role_profile`, `resource_type`, `channel`, `branch`, `blocked_reason_code`.
- Dashboard phải chỉ ra top field/resource bị deny nhiều nhất để PM/IT biết rule nào đang quá chặt hoặc thiếu mapping.

## 21. Rollout / Feature Flag

- Bật bắt buộc trước khi pilot nội bộ cho `M09`.
- Pha 1 ưu tiên coverage cho `inventory`, `pricing`, `promotion`, `product`, `transcript/source trace`, `escalation payload`.
- `public-safe mode` có thể bật sau internal mode nhưng policy phải được chuẩn bị trước.

## 22. Open Questions

- BQ có cần scope sâu đến mức `warehouse` riêng hay chỉ `branch/store/channel/store type` là đủ cho phase 1?
- Team Lead các phòng ban có được xem cross-branch aggregate hay chỉ xem branch do mình phụ trách?
- Với `summary_only`, từng domain nên trả gì là an toàn: ví dụ inventory trả `còn hàng / sắp hết / hết`, pricing trả `giá áp dụng hiện tại` hay chỉ `liên hệ bộ phận phụ trách`?
- Role nào được phép xem full source snapshot của answer history và escalation payload?

## 23. Definition of Done

- MIABOS có một access/sensitivity gate vận hành được cho pilot BQ, đủ rõ để downstream render đúng projection, audit được mọi quyết định, và không làm AI lộ dữ liệu sai người hoặc sai phạm vi.

## 24. Ready-for-UXUI Checklist

- [ ] UXUI đã chốt screen quản lý role profile, scope profile, sensitivity rules, policy preview
- [ ] UXUI đã chốt các trạng thái `allow`, `masked`, `summary_only`, `deny`, `escalation_only`
- [ ] UXUI đã chốt blocked copy theo ngôn ngữ vận hành, không dùng field kỹ thuật

## 25. Ready-for-FE-Preview Checklist

- [ ] FE Preview có mock policy preview và answer states cho `masked`, `summary_only`, `deny`, `escalation_only`
- [ ] Stub payload đủ `decision`, `allowed_fields`, `masked_fields`, `summary_projection`, `blocked_reason_code`, `requires_escalation`

## 26. Ready-for-BE / Integration Promotion Checklist

- [ ] Role matrix BQ theo stakeholder group đã chốt
- [ ] Scope dimensions và mapping source (`SAP B1`, `KiotViet`, `Haravan`) đã chốt
- [ ] Sensitivity taxonomy và public-safe rules đã chốt
- [ ] Audit contract và M12 observability mapping đã rõ
