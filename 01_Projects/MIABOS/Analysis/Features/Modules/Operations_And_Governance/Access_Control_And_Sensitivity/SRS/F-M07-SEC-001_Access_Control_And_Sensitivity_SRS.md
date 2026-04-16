# Feature SRS: F-M07-SEC-001 Access Control and Sensitivity

**Status**: Draft
**Owner**: A03 BA Agent
**Last Updated By**: Claude Code (claude-sonnet-4-6)
**Last Reviewed By**: A01 PM Agent
**Approval Required**: PM
**Approved By**: -
**Last Status Change**: 2026-04-15
**Source of Truth**: This document
**Blocking Reason**: Cần chốt scope matrix theo branch/store/channel/role và public-safe response policy
**Module**: M07
**Phase**: PB-02 / PB-03
**Priority**: High
**Document Role**: SRS high-level cho module phân quyền, data scope, sensitivity, và public-safe policy

---

## 0. Metadata

- Feature ID: `F-M07-SEC-001`
- Related User Story: `US-M07-SEC-001`
- Related Screens: role/scope config, sensitivity policy config, public-safe rule config
- Related APIs: `POST /mia/access/evaluate`, `POST /mia/public-safe/evaluate`
- Related Tables: `mia_user_scope_profile`, `sensitivity_rule`, `public_safe_response_policy`
- Related Events: `access.rule.updated`, `public.safe.policy.updated`
- Related Error IDs: `SEC-001`

## 0B. Integration Source Map

| Data Domain | Source System | Direction | Notes |
|---|---|---|---|
| User identity, role assignment | MIABOS internal DB | Read | Nguồn authority cho role/scope trong MIABOS |
| Branch/store/channel mapping | SAP B1 + KiotViet + Haravan | Read | Dùng để resolve scope branch/channel cho user |
| Sensitivity rules, public-safe policy | MIABOS internal DB | Read/Write | Admin config — không kéo từ external system |
| User scope profile | MIABOS internal DB | Read/Write | Output của module này, được dùng bởi M09/M10 |

## 1. User Story

Là PM / Admin / Ops Governance, tôi muốn MIABOS tự quản lý access, scope, sensitivity, và public-safe policy để AI không lộ dữ liệu sai ngữ cảnh.

## 1A. User Task Flow

| Step | User Role | Action | Task Type | Notes |
|------|-----------|--------|-----------|-------|
| 1 | Admin | Cấu hình role và data scope | Configuration | Entry |
| 2 | Admin | Cấu hình sensitivity và public-safe policy | Configuration | Governance |
| 3 | Hệ thống | Evaluate quyền trước khi trả câu trả lời | Quick Action | Runtime |

## 2. Business Context

BQ có hơn 200 cửa hàng/đại lý với nhiều loại nhân sự (cửa hàng trưởng, sales, CSKH, kế toán, IT, ban điều hành). Mỗi role có phạm vi dữ liệu khác nhau: sales không được thấy giá nhập, CSKH không được thấy toàn bộ hồ sơ khách, cửa hàng đại lý không được thấy dữ liệu cửa hàng chính hãng. Nếu không có lớp access control + sensitivity gate rõ ràng trong MIABOS, AI sẽ lộ dữ liệu sai người và mất tin cậy ngay từ pilot.

## 3. Preconditions

- User identity và role assignment trong MIABOS đã được setup tối thiểu cho phase 1.
- Branch/store/channel mapping giữa SAP B1, KiotViet, Haravan đã có.
- Admin đã config ít nhất `public-safe whitelist` cho phase 1 để phân biệt internal vs external safe data.

## 4. Postconditions

- Mọi answer từ M09/M10 đều đi qua scope + sensitivity gate trước khi render.
- Admin có thể xem rule effect và adjust policy mà không cần code change.

## 5. Main Flow

1. AI module (M09/M10) gửi request evaluate access cho một answer trước khi render.
2. Hệ thống resolve `actor` (user ID → role → scope profile) từ `mia_user_scope_profile`.
3. Hệ thống resolve `context`: branch/store/channel của request hiện tại.
4. Hệ thống evaluate `sensitivity_rule`: field nào cần mask, block, hoặc trim cho role + context này.
5. Nếu context là `public-safe` (chatbot ngoài / sales-safe), apply thêm `public_safe_response_policy`.
6. Trả về `allowed_fields[]`, `masked_fields[]`, `blocked_reason` cho module gọi.
7. Module gọi render answer chỉ với fields được phép.

## 6. Alternate Flows

- Internal mode: role nội bộ có scope rộng hơn, ít mask hơn.
- Sales-safe mode: dành cho chatbot bán hàng ngoài — chỉ trả data đã whitelist.
- Escalation-only mode: user bị block full answer nhưng vẫn có thể tạo escalation.

## 7. Error Flows

- Policy rule missing cho context hiện tại → default deny, log warning cho Admin.
- Scope conflict (user được giao 2 branch mâu thuẫn nhau) → block và yêu cầu Admin resolve.
- Public-safe evaluate fail → block toàn bộ answer, trả lý do "không thể xác nhận scope an toàn".

## 8. State Machine

`Draft -> Active -> Warning (policy gap) / Blocked (evaluation error)`

## 9. UX / Screen Behavior

- Admin config screen phải hiển thị rule list với preview "answer này sẽ bị trim như thế nào với role X".
- Blocked answer phải hiển thị lý do rõ cho user: "thiếu quyền", "ngoài scope branch", "public-safe block".
- Không hiển thị tên field kỹ thuật trong lý do blocked — dùng ngôn ngữ vận hành.

## 10. Role / Permission Rules

- `IT / ERP / data (Ban điều hành)`: full access để config rules và xem audit trail.
- `Admin / Ops Governance`: config scope profile và sensitivity rules cho từng role.
- `Mọi module AI (M09/M10)`: gọi evaluate API trước khi render — không được bypass.
- Không có role nào được tự assign scope cho mình — chỉ Admin mới config.

## 11. Business Rules

- MIABOS không phụ thuộc vào phân quyền gốc của SAP B1/KiotViet/Haravan — scope trong MIABOS là independent layer.
- Mọi answer từ M09/M10 phải đi qua `POST /mia/access/evaluate` trước khi render — không có bypass.
- Nếu không có rule cho một field/context cụ thể, default behavior là **deny** (không phải allow).
- Public-safe whitelist phải được Admin review và approve định kỳ — không tự động mở rộng.
- Mọi thay đổi rule phải có audit trail với timestamp, actor, và lý do.

## 12. API Contract Excerpt + Canonical Links

- `POST /mia/access/evaluate`: evaluate scope cho một request
  - Input: `user_id`, `role`, `context` (branch/channel/store_type), `requested_fields[]`, `mode` (internal/public-safe)
  - Output: `allowed_fields[]`, `masked_fields[]`, `blocked`, `blocked_reason`
- `POST /mia/public-safe/evaluate`: evaluate public-safe whitelist cho external chatbot
- Canonical links:
  - Authority cho `F-M09-AIC-001`, `F-M10-SLS-001`, và tất cả modules có sensitive data
  - Feeds audit trail vào `F-M12-OBS-001`

## 13. Event / Webhook Contract Excerpt + Canonical Links

- `access.rule.updated`: phát khi Admin thay đổi sensitivity rule hoặc scope profile.
- `public.safe.policy.updated`: phát khi public-safe whitelist được cập nhật.

## 14. Data / DB Impact Excerpt + Canonical Links

- `mia_user_scope_profile`: mapping user → role → branch/store/channel scope
- `sensitivity_rule`: field-level sensitivity config theo role/context
- `public_safe_response_policy`: whitelist cho external/sales-safe mode

## 15. Validation Rules

- Không có module nào được render answer chứa field chưa qua evaluate.
- Mọi evaluate call phải được log vào audit trail.
- Rule change chỉ được apply sau khi được Admin confirm — không có auto-apply.

## 16. Error Codes

- `SEC-001`: Policy evaluation failed — rule engine error.
- `SEC-002`: User scope not found — chưa có profile cho user này.
- `SEC-003`: Public-safe evaluate blocked — field không trong whitelist.

## 17. Non-Functional Requirements

- `POST /mia/access/evaluate` phải trả kết quả trong `<= 200ms` (không thể là bottleneck của chat response).
- Evaluate call phải deterministic — cùng input luôn cho cùng output.
- Audit log cho evaluate calls phải được giữ tối thiểu `180 ngày`.
- Rule cache phải invalidate ngay khi Admin update rule — không có stale rule trong production.

## 18. Acceptance Criteria

- Sales query giá nhập bị block và nhận lý do "ngoài phạm vi quyền truy cập" — không thấy field giá nhập.
- Chatbot public (sales-safe mode) chỉ trả fields trong whitelist — internal field bị mask hoàn toàn.
- Admin thay đổi rule và effect được áp dụng ngay lập tức cho evaluate calls tiếp theo.
- Mọi blocked access được log vào audit trail với timestamp và lý do.

## 19. Test Scenarios

Internal allowed, public denied, branch-scope denied.

## 20. Observability

Theo dõi denied count và overridden answer count.

## 21. Rollout / Feature Flag

Bắt buộc trước khi mở AI cho người dùng thật.

## 22. Open Questions

Scope granularity theo channel / branch / store type là gì?

## 23. Definition of Done

Có gate kiểm soát answer projection chạy được phase 1.

## 24. Ready-for-UXUI Checklist

- [ ] UXUI đã chốt policy config screens

## 25. Ready-for-FE-Preview Checklist

- [ ] FE Preview có mock allow/deny/warning states

## 26. Ready-for-BE / Integration Promotion Checklist

- [ ] BE evaluation contract đã rõ
