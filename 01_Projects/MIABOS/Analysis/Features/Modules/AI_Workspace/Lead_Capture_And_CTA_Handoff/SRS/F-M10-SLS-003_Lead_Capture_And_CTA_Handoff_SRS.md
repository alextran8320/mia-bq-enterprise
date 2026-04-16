# Feature SRS: F-M10-SLS-003 Lead Capture and CTA Handoff

**Status**: SRS Ready
**Owner**: A03 BA Agent
**Last Updated By**: Claude Code (claude-sonnet-4-6)
**Last Reviewed By**: A01 PM Agent
**Approval Required**: PM
**Approved By**: A01 PM Agent — Promoted to SRS Ready 2026-04-16; CTA set + routing specifics deferred to BE/integration phase per BQ pilot scope decision
**Last Status Change**: 2026-04-16
**Source of Truth**: This document
**Blocking Reason**: -
**Module**: M10
**Phase**: PB-02 / PB-03
**Priority**: High
**Document Role**: SRS canonical cho lead capture và CTA handoff của `Sales Advisor AI`

---

## 0. Metadata

- Feature ID: `F-M10-SLS-003`
- Related User Story: `US-M10-SLS-003`
- Related PRD: `-`
- Related Screens: CTA footer, lead form, handoff confirmation, pending-assignment state, follow-up status
- Related APIs: `POST /mia/leads`, `POST /mia/cta/handoff`, `GET /mia/leads/:id`
- Related Tables: `crm_lead`, `crm_lead_event`, `crm_customer_attribute`, `sales_cta_handoff`, `sales_cta_duplicate_check`
- Related Events: `mia.lead.created`, `mia.cta.handoff.triggered`, `mia.lead.pending_assignment`, `mia.lead.duplicate_detected`
- Related Error IDs: `SLS-005`, `SLS-006`, `SLS-007`, `SLS-010`

## 0B. Integration Source Map

| Source System / Module | Data / Knowledge Type | Usage In This Feature | Truth Level | Notes |
|------------------------|-----------------------|-----------------------|-------------|-------|
| `F-M10-SLS-001` | Conversation context, intent, need summary | Nguồn tạo CTA/lead context | Primary source | Không tạo lead mù không có context |
| `F-M10-SLS-002` | Suggested action accepted | Trigger CTA path phù hợp | Supporting source | Optional depending on flow |
| `M06 CRM` | Lead master, customer matching, owner routing | Nơi lưu lead và follow-up state | Primary operational system | Hệ quả business chính |
| `M07 Public-Safe Rules` | CTA/channel exposure policy | Quy định CTA nào được phép hiện | Gatekeeper | Không hiển thị CTA trái channel policy |
| `KiotViet / Store Context` | Store availability/location context | Gợi ý store owner hoặc destination branch | Operational context | Dùng cho branch routing |
| `Haravan / Website Context` | Online channel context | Dùng cho channel-specific lead routing | Channel context | Quan trọng cho ecommerce flow |

## 1. User Story

Là khách hàng hoặc sales/CRM operator, tôi muốn chốt hội thoại thành một CTA cụ thể và tạo lead/handoff đúng nơi để cơ hội bán hàng không bị mất ở cuối conversation.

## 1A. User Task Flow

| Step | User Role | Action | Task Type | Notes |
|------|-----------|--------|-----------|-------|
| 1 | Khách / Sales | Chọn CTA phù hợp như `Để lại thông tin`, `Nhờ tư vấn thêm`, `Liên hệ cửa hàng phù hợp` | Quick Action | Entry |
| 2 | Hệ thống | Hiển thị form ngắn hoặc handoff path phù hợp với CTA và channel | Quick Action | Capture |
| 3 | Khách / Sales | Điền/xác nhận dữ liệu tối thiểu như tên, SĐT, nhu cầu, khu vực | Quick Action | Submit |
| 4 | Hệ thống | Kiểm tra duplicate, tạo lead hoặc handoff record, và route sang owner/team phù hợp | Configuration | Routing |
| 5 | User | Nhận confirmation về bước tiếp theo và trạng thái `Assigned` hoặc `Pending Assignment` | Reporting | Outcome |

## 2. Business Context

Trong retail BQ, giá trị của AI tư vấn chỉ trở thành doanh thu khi conversation kết thúc bằng owner/action rõ ràng. Nếu khách quan tâm mà không có CTA hoặc lead record, cơ hội bị mất ngay tại thời điểm nóng nhất. Feature này biến ý định trong chat thành record có thể follow-up trong CRM hoặc chuyển đúng đội/cửa hàng.

## 3. Preconditions

- `F-M10-SLS-001` đã xác định conversation stage và intent.
- `M06 CRM` có contract tạo lead và lưu follow-up.
- `M07` đã chốt CTA exposure theo channel.
- Có routing policy tối thiểu theo `branch`, `channel`, `team`.

## 4. Postconditions

- Lead/handoff record được tạo với payload tối thiểu hợp lệ.
- Có destination hoặc ít nhất trạng thái `Pending Assignment`.
- Confirmation message nói rõ bước tiếp theo để giảm kỳ vọng sai.

## 5. Main Flow

1. Khách hoặc sales chọn CTA từ conversation.
2. Hệ thống xác định CTA type và form/payload tối thiểu cần thu thập.
3. User nhập hoặc xác nhận thông tin như tên, SĐT, khu vực, nhu cầu, preferred channel.
4. Hệ thống chạy duplicate check theo phone/channel/session context.
5. Nếu không trùng hoặc trùng có thể merge, hệ thống tạo lead/handoff record trong CRM.
6. Hệ thống route record sang owner/team/branch phù hợp hoặc gắn `Pending Assignment`.
7. Confirmation state hiển thị rõ ai hoặc đội nào sẽ xử lý tiếp.

## 6. Alternate Flows

- Khách anonymous chỉ để lại SĐT và nhu cầu ngắn.
- Sales nội bộ tạo lead thay mặt khách từ console.
- Hệ thống chỉ tạo `handoff` mà chưa đủ dữ liệu để tạo lead đầy đủ.
- Duplicate lead được phát hiện và conversation gắn vào lead hiện có thay vì tạo mới.

## 7. Error Flows

- Form thiếu dữ liệu tối thiểu.
- Routing không tìm ra owner/team.
- Duplicate logic nhận sai lead và làm mất bối cảnh conversation mới.
- CTA hiện ra ở channel không được phép.

## 8. State Machine

`CTA Available -> Selected -> Capturing -> Duplicate Checking -> Lead Created / Handoff Created -> Assigned / Pending Assignment / Failed`

## 9. UX / Screen Behavior

- CTA set phải ít nhưng rõ, tránh quá nhiều lựa chọn cạnh tranh.
- Lead form phase 1 phải ngắn; hỏi tối thiểu cần thiết để follow-up được.
- Confirmation state phải nói rõ `ai sẽ liên hệ`, `qua kênh nào`, `khi nào dự kiến`, hoặc `đang chờ phân công`.
- Nếu duplicate detected, UI không nên tạo cảm giác lỗi; chỉ cần thông báo nhẹ rằng yêu cầu đã được ghi vào hồ sơ hiện có.

## 10. Role / Permission Rules

- `Khách hàng`: chỉ thấy CTA public-safe hợp lệ theo channel.
- `Sales / CRM`: được tạo lead thay mặt khách và xem routing result nội bộ.
- `Store / retail operations`: nhận CTA/handoff nếu routing về cửa hàng/phân khu của mình.
- `Ecommerce / omnichannel`: nhận lead/handoff từ online channels.
- `PM Governance`: xem aggregate CTA/lead outcomes và rule set, không cần xử lý từng lead.
- Mọi routing và visibility phải qua `M07` branch/channel access rules.

## 11. Business Rules

- Mỗi CTA phải map sang một outcome rõ trong tập phase 1 như `Lead Capture`, `Human Consultation`, `Store Direction`, `Callback Request`; không dùng CTA mơ hồ.
- Lead payload tối thiểu phải đủ để follow-up được; ít nhất cần `contact handle` hoặc `channel callback path` và `need summary`.
- Nếu duplicate check tìm thấy lead đang mở phù hợp, hệ thống phải tạo event mới gắn vào lead hiện có thay vì tạo lead rác.
- Nếu không xác định được owner ngay, record vẫn phải được lưu với trạng thái `Pending Assignment`.
- CTA public-facing không được tạo cam kết ngoài policy như giữ hàng chắc chắn hoặc chốt giá ngoài public-safe boundary.
- Confirmation message phải phản ánh đúng trạng thái thực tế `Assigned`, `Pending Assignment`, hoặc `Follow-up Required`.

## 12. API Contract Excerpt + Canonical Links

- `POST /mia/leads`
  - Input: `cta_type`, `contact_payload`, `need_summary`, `channel`, `branch_hint`, `conversation_id`
  - Output: `lead_id`, `assignment_status`, `assigned_owner`, `duplicate_resolution`
- `POST /mia/cta/handoff`
  - Input: `cta_type`, `conversation_context`, `target_team?`
  - Output: `handoff_id`, `destination_status`
- `GET /mia/leads/:id`
  - Output: lead status, assignment, latest event
- Downstream:
  - Writes to `M06 CRM`
  - May trigger `M11` assignment workflow
  - Feeds `F-M12-OBS-001` and `F-M14-ANL-001`

## 13. Event / Webhook Contract Excerpt + Canonical Links

- `mia.lead.created`: khi lead được tạo thành công.
- `mia.cta.handoff.triggered`: khi handoff được tạo.
- `mia.lead.pending_assignment`: khi chưa xác định được owner ngay.
- `mia.lead.duplicate_detected`: khi lead được merge/gắn vào record cũ.

## 14. Data / DB Impact Excerpt + Canonical Links

- `crm_lead`
  - Lead master, owner, source channel, status
- `crm_lead_event`
  - CTA selected, duplicate result, assignment changes, follow-up milestones
- `crm_customer_attribute`
  - Need summary, preferences, location, preferred contact method
- `sales_cta_handoff`
  - Handoff-specific routing metadata
- `sales_cta_duplicate_check`
  - Duplicate resolution log for audit
- Source alignment:
  - `Haravan` for website/online channel context
  - `KiotViet` for store destination hints
  - `M06 CRM` as system of record for lead lifecycle

## 15. Validation Rules

- CTA payload phải có fields tối thiểu theo `cta_type`.
- Duplicate check phải chạy trước khi trả `Lead Created` thành công.
- `Assigned` chỉ hợp lệ khi owner/team thực sự tồn tại và active.
- Confirmation response phải khớp trạng thái lưu trong CRM/handoff table.

## 16. Error Codes

- `SLS-005`: Lead creation failed.
- `SLS-006`: CTA handoff routing failed.
- `SLS-007`: Lead payload invalid or incomplete.
- `SLS-010`: Duplicate resolution conflict.

## 17. Non-Functional Requirements

- CTA submit tới confirmation phải hoàn tất trong `<= 4 giây` cho `95%` requests.
- Lead form phase 1 không nên yêu cầu quá `5` fields bắt buộc.
- Duplicate check phải trả kết quả trong `<= 2 giây`.
- Lead/handoff event logs phải giữ tối thiểu `365 ngày`.

## 18. Acceptance Criteria

- Khách hoặc sales chọn được CTA hợp lệ và tạo được lead/handoff record với payload tối thiểu.
- Duplicate lead được xử lý đúng, không tạo record trùng vô nghĩa.
- Khi chưa routing được owner, hệ thống vẫn lưu record và hiển thị `Pending Assignment`.
- Confirmation state phản ánh đúng owner/status thực tế.
- CTA outcome liên kết được với CRM event để theo dõi follow-up.

## 19. Test Scenarios

- Tạo lead từ CTA bình thường.
- CTA anonymous với payload tối thiểu.
- Duplicate lead detection và merge event.
- Routing fail dẫn tới `Pending Assignment`.
- Sales nội bộ tạo lead thay mặt khách.

## 20. Observability

- Theo dõi `cta click-through`, `form completion rate`, `lead creation success`, `duplicate rate`, `pending-assignment rate`, `lead-to-follow-up conversion`.

## 21. Rollout / Feature Flag

- Bật sau khi CTA set phase 1 được PM chốt.
- CTA types mở dần theo channel và business owner readiness.

## 22. Open Questions

- CTA set phase 1 chính xác gồm những lựa chọn nào?
- Minimum payload theo từng channel có khác nhau không?
- Routing ưu tiên theo branch, store owner, hay team sales chung?

## 23. Definition of Done

- Sales Advisor AI chốt được conversation thành record có owner hoặc trạng thái chờ rõ ràng để cơ hội không bị rơi mất.

## 24. Ready-for-UXUI Checklist

- [ ] UXUI đã chốt CTA set, lead form tối thiểu, duplicate state, assigned/pending confirmation

## 25. Ready-for-FE-Preview Checklist

- [ ] FE Preview có mock `cta selected`, `form invalid`, `duplicate detected`, `lead created`, `pending assignment`
- [ ] Stub payload đủ `cta_type`, `minimum_fields`, `assignment_status`, `duplicate_resolution`

## 26. Ready-for-BE / Integration Promotion Checklist

- [ ] Create lead, duplicate check, routing, confirmation-state contracts đã rõ
- [ ] Mapping từ CTA outcome sang CRM/workflow lifecycle đã rõ
