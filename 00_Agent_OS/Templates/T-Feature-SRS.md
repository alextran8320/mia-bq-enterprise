# Feature SRS: [Feature ID] [Feature Name]

**Status**: Draft / In Review / SRS Ready / Build Ready / Blocked / Deprecated
**Owner**: [[A03_BA_Agent|A03 BA Agent]]
**Last Updated By**: A03
**Last Reviewed By**: A01
**Approval Required**: PM
**Approved By**: -
**Last Status Change**: YYYY-MM-DD
**Source of Truth**: This document
**Blocking Reason**: -
**Module**: M0X
**Phase**: PX
**Priority**: High / Medium / Low
**Document Role**: Canonical lean BA contract (`SRS Lite`) for UXUI, FE Preview, and later technical integration

---

## 0. Metadata

- Feature ID:
- Related User Story:
- Related PRD:
- Related Screens:
- Related APIs:
- Related Tables:
- Related Events:
- Related Error IDs:

## 0B. Integration Source Map

_Ghi rõ feature này lấy data từ đâu và ghi về đâu. Bắt buộc với mọi feature có data dependency. Nếu thuần MIABOS internal, ghi "MIABOS internal only" và lý do._

| Data Domain | Source System | Direction | Notes |
|---|---|---|---|
| e.g. Tồn kho | SAP B1 / KiotViet | Read | Phase 1: read-only |
| e.g. Giá cơ sở | SAP B1 | Read | CTKM override từ MIABOS Promotion |
| e.g. Policy text | MIABOS Knowledge Center (M08) | Read | Knowledge đã published |
| e.g. Lịch sử chat | MIABOS internal DB | Write | Audit log |

> **Hệ thống BQ đang dùng**: SAP B1 (ERP/tồn kho/tài chính), KiotViet (POS/cửa hàng), Haravan (ecommerce/omnichannel), Lark (workflow/cộng tác), Excel (policy phụ trợ/ngoại lệ).
> Mọi SRS trong context MIABOS/BQ phải anchor §12 API Contract và §14 DB Impact vào bảng này.

## 1. User Story

## 1A. User Task Flow

_For each relevant user role, document 3–5 primary task steps for the core job-to-be-done._

| Step | User Role | Action | Task Type | Notes |
|------|-----------|--------|-----------|-------|
| 1 | _e.g. Agent_ | _e.g. Opens assigned conversation_ | Quick Action | _Entry point_ |
| 2 | _e.g. Agent_ | _e.g. Reviews customer message_ | — | |
| 3 | _e.g. Agent_ | _e.g. Sends reply or changes status_ | Quick Action | _Primary task_ |
| 4 | _e.g. Supervisor_ | _e.g. Reviews team dashboard_ | Reporting | _Separate role flow_ |
| 5 | _e.g. Supervisor_ | _e.g. Reassigns conversation_ | Quick Action | |

**Task Types**: `Quick Action` | `Configuration` | `Reporting` | `Bulk Operation` | `Exception Handling`

> This section feeds directly into the UXUI Spec §2.1 Task Flow. If this section is missing, the feature cannot proceed to canonical UI design.

## 2. Business Context

_Anchor vào pain point thật từ BQ pack. Giải thích vì sao feature này cần thiết trong context vận hành của BQ — không được viết generic. Ví dụ: "BQ hiện xử lý CTKM thủ công, dữ liệu tồn kho phân mảnh giữa SAP B1 và KiotViet, nội bộ hỏi lặp đi lặp lại về..."_

## 3. Preconditions

_Các điều kiện phải đúng TRƯỚC khi feature này được dùng. Liệt kê dependency về data, system, role, hoặc feature khác._

## 4. Postconditions

_Trạng thái hệ thống sau khi feature hoàn thành thành công._

## 5. Main Flow

_Từng bước step-by-step. Tối thiểu 4 steps. Mỗi step phải có: Actor (ai thực hiện) + Action (làm gì) + điều kiện nếu có. Không được viết 1 dòng summary._

_Ví dụ format:_
_1. [Actor] — [Action] → [Result hoặc next state]_
_2. [System] — [Action] nếu [điều kiện] → [Result]_

## 6. Alternate Flows

_Mỗi alternate flow phải có: trigger condition + path khác biệt so với main flow. Không gộp nhiều flows thành 1 dòng._

## 7. Error Flows

_Mỗi error flow: condition kích hoạt + behavior hệ thống + user sees gì._

## 8. State Machine

_Liệt kê states + transitions. Format: `State A --[trigger]--> State B`. Nếu không có stateful workflow, ghi `N/A — lý do`._

## 9. UX / Screen Behavior

_Mô tả behavior UI cụ thể: thứ tự hiển thị, pattern layout chính, trạng thái empty/loading/error, progressive disclosure nếu có._

## 10. Role / Permission Rules

_Map về phòng ban BQ thật từ Stakeholder Map. Không chỉ dùng "User nội bộ" — phải ghi rõ phòng ban tương ứng trong ngoặc._

_Ví dụ: "PM / Ops (Ban điều hành, IT/ERP)", "Vận hành bán lẻ (Store Manager, cửa hàng trưởng)"_

## 11. Business Rules

_Tối thiểu 3 rules. Mỗi rule phải testable — có điều kiện "nếu X thì Y". Không được dùng "nên", "phải nhanh", "phải ổn định" mà không có số liệu cụ thể._

_Ví dụ tốt: "Chỉ knowledge item có status `Published` mới được dùng cho AI runtime."_
_Ví dụ tệ: "Hệ thống phải hoạt động tốt."_

## 12. API Contract Excerpt + Canonical Links

_Nhắc rõ integration source cho mỗi endpoint (SAP B1 / KiotViet / Haravan / MIABOS internal). Phải consistent với §0B Integration Source Map._

## 13. Event / Webhook Contract Excerpt + Canonical Links

## 14. Data / DB Impact Excerpt + Canonical Links

_Tối thiểu 2 table với vai trò từng table. Phải consistent với §0B Integration Source Map._

## 15. Validation Rules

## 16. Error Codes

## 17. Non-Functional Requirements

_Tối thiểu 1 số liệu đo được. Ví dụ: latency target (ms/giây), retention period (ngày), concurrent user estimate, uptime SLA. Không được chỉ viết "nhanh", "ổn định", "có audit"._

## 18. Acceptance Criteria

_Tối thiểu 3 statements testable độc lập. Mỗi AC là 1 câu có thể pass/fail rõ ràng — không phải summary. Format: "Người dùng [role] có thể [action] và kết quả là [expected outcome]."_

## 19. Test Scenarios

## 20. Observability

## 21. Rollout / Feature Flag

## 22. Open Questions

_Ghi câu hỏi thật còn chưa chốt được — đặc biệt các câu liên quan đến BQ (owner phê duyệt, policy cụ thể, integration contract). Nếu không còn open question, ghi "None — tất cả blocker đã được giải quyết."_

## 23. Definition of Done

## 24. Ready-for-UXUI Checklist

- [ ] `User Story` is approved and contains problem, trigger, happy path, dependencies, and AC context
- [ ] User Task Flow is explicit enough for screen/state design
- [ ] Business rules and permission rules are testable
- [ ] Main, alternate, and error flows are documented
- [ ] State machine is explicit or marked `N/A + reason`
- [ ] Data and event dependencies are linked
- [ ] Open questions that would force A06 to invent behavior are either resolved or marked as blockers

## 25. Ready-for-FE-Preview Checklist

- [ ] User Story is approved and linked in Sprint Backlog
- [ ] UXUI spec exists and cites this SRS
- [ ] No unresolved contradiction remains between SRS and UXUI
- [ ] Mock/stub data assumptions for FE Preview are explicit
- [ ] PM has explicitly opened `FE Preview`

## 26. Ready-for-BE / Integration Promotion Checklist

- [ ] FE Preview has been reviewed
- [ ] Behavior-changing feedback from FE Preview is absorbed back into SRS / UXUI
- [ ] `Integration Spec` (or approved split technical pack) is aligned to this SRS
- [ ] UXUI spec exists and cites this SRS
- [ ] No unresolved contradiction remains between SRS, UXUI, and the technical handoff artifact
- [ ] PM has confirmed `Build Ready`
