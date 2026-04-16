# Feature SRS: F-M11-ESC-001 Escalation and Workflow

**Status**: In Review
**Owner**: A03 BA Agent
**Last Updated By**: A03 BA Agent
**Last Reviewed By**: A01 PM Agent
**Approval Required**: PM, Business Owner
**Approved By**: -
**Last Status Change**: 2026-04-17
**Source of Truth**: This document
**Blocking Reason**: -
**Module**: M11
**Phase**: PB-03
**Priority**: High
**Document Role**: SRS high-level cho escalation và workflow handoff của MIABOS áp dụng cho Giày BQ

---

## 0. Metadata

- Feature ID: `F-M11-ESC-001`
- Related User Story: `US-M11-ESC-001`
- Related Screens: escalation compose drawer, queue list, ticket detail reference
- Related APIs: `POST /mia/escalations`
- Related Tables: `escalation_ticket_ref`
- Related Events: `mia.chatbot.escalation_created`, `escalation.assigned`
- Related Error IDs: `ESC-001`

## 0B. Integration Source Map

| Data Domain | Source System | Direction | Notes |
|---|---|---|---|
| Chat context & Source trace | MIABOS internal | Read | Đóng gói câu hỏi/trả lời từ AI Chatbot Nội Bộ |
| Escalation destination (Task system) | Lark | Write | Theo định hướng chiến lược "Data Lark" của BQ để gán task và phê duyệt |
| Ticket Fallback | MIABOS Internal Database | Write | Nếu Lark API lỗi, tạo internal queue để khỏi mất ticket |
| Cấu trúc Data BQ (Sản phẩm/Tồn kho) | SAP B1, KiotViet | Read | AI trace source khi tạo escalation (AI tham chiếu từ KiotViet hay SAP) |

## 1. User Story

Là Vận hành bán lẻ / Quản lý cửa hàng (hoặc AI), tôi muốn tạo escalation nhanh sang Lark khi câu trả lời của AI mâu thuẫn giữa các hệ thống (ví dụ: SAP báo còn, KiotViet báo hết) hoặc chưa đủ tin cậy, để bộ phận CSKH hoặc IT tiếp quản xử lý triệt để.

## 1A. User Task Flow

| Step | User Role | Action | Task Type | Notes |
|------|-----------|--------|-----------|-------|
| 1 | Store Manager / AI | Bấm nút tạo escalation từ answer / Nhấp tự động | Exception Handling | Entry |
| 2 | Hệ thống | Trích xuất context (câu hỏi, source, confidence score) | Quick Action | Payload Generation |
| 3 | Hệ thống | Map domain rule để gán người nhận (CSKH, IT, Kho) | Routing | Workflow |
| 4 | User / Assignee | Theo dõi trạng thái trên Lark và MIABOS | Reporting | Follow-up |

## 2. Business Context

Tại Giày BQ, dữ liệu vận hành bị phân mảnh cao giữa SAP B1 (ERP/SOT lõi), KiotViet (Cửa hàng lẻ), Haravan (TMĐT) và Excel (CTKM thủ công). Khi triển khai Phase 1 Chatbot Nội Bộ, chắc chắn sẽ xảy ra tình huống AI đưa ra câu trả lời không chắc chắn (low confidence) do source data mâu thuẫn, hoặc nhân viên tại 200+ cửa hàng thấy thông tin không đúng thực tế. 
Để xây dựng niềm tin vào AI, hệ thống không được để "dead-end". Cần có một luồng Escalation mượt mà đẩy thẳng task lỗi sang Lark (hệ thống workspace mục tiêu của BQ) kèm theo đầy đủ context để các phòng ban trung tâm (CSKH, Kho, IT) fix data tận gốc.

## 3. Preconditions

- AI Chat (M09/M10) đã sinh ra một `answer_snapshot` bao gồm `session_id`, `question`, `answer`, `confidence_score`.
- Tích hợp API của Lark (Lark Open Platform) đã có sắn Access Token hợp lệ.
- Bảng `assignment_rules` đã được định nghĩa trong MIABOS (vd: Intent Tồn Kho -> team Logistics/Kho; Intent Giá -> team Tài chính/Pricing control).

## 4. Postconditions

- Một Task/Ticket được sinh ra trên Lark đúng nhóm phòng ban phụ trách.
- `escalation_ticket_ref` được lưu vào MIABOS DB với trạng thái `Submitted` liên kết tới Lark Task ID.

## 5. Main Flow (>= 4 steps)

1. **Trigger**: Store Manager nhấn nút "Báo cáo lỗi/Cần hỗ trợ" trên đoạn chat với AI, hoặc AI tự động chớp cháy luồng auto-escalation do (confidence < 0.6).
2. **Form Render**: Hệ thống hiển thị Drawer điền thông tin bổ sung. Các trường Context (hội thoại, system source bị lỗi như KiotViet/SAP) đã được auto-filled.
3. **Submit**: Store Manager nhập "Lý do bổ sung" (không bắt buộc) và nhấn Gửi.
4. **Routing**: Hệ thống resolve `assignment_rule` dựa trên Domain của câu hỏi (Order, Inventory, IT Support) -> Xác định assignee Lark Open ID tương ứng (vd: Ban Vận hành / IT BQ).
5. **Dispatch**: Hệ thống call API Lark `POST /open-apis/task/v2/tasks` để tạo Task.
6. **Persistence**: Ghi log lại `escalation_ticket_ref` với `Lark_Task_ID` lưu vào backend MIABOS. Trả về thông báo thành công cho Store Manager kèm link Lark theo dõi.

## 6. Alternate Flows

- **Lark Rate Limit / Offline**: Nếu call API Lark trả về lỗi (timeout, rate limit), hệ thống tự động fallback ghi thành MIABOS Internal Queue và notify rủi ro cho Admin Ops BQ.
- **Auto Escalation**: AI Chatbot gọi trực tiếp API sinh Escalation ngầm ở Step 4, gửi notification vào kênh Chat cho user biết "Hệ thống tự động điều tra vấn đề này trên Lark, số ticket: #...".

## 7. Error Flows

- Thiếu `answer_snapshot` ID: Báo lỗi "Không truy xuất được context đoạn chat gốc". Block quá trình submit.
- Không match được Routing Rule: Task vào group Lark "General Support" mặc định, ghi Error Log để phân tích lại sau.

## 8. State Machine

`Draft` -> `Submitted` -> `Assigned (Lark)` -> `In Progress (Lark)` -> `Resolved (Lark & MIABOS)` -> `Closed`

## 9. UX / Screen Behavior

- Form nằm dạng Right Drawer chồng lên giao diện chat, không làm mất bối cảnh hội thoại hiện tại.
- Read-only section lớn để hiển thị "Context sẽ được gửi đi", tăng sự tự tin cho user.
- Thẻ tag màu phân biệt Severity (Low, Medium, High).

## 10. Role / Permission Rules

Theo BQ Stakeholder Map:
- **Vận hành bán lẻ / Quản lý cửa hàng**: Quyền `Create`, xem Escalation của nhánh mình.
- **Chăm sóc khách hàng (CSKH)**: Quyền `View All`, nhận assign và Route lại (Re-assign) trên Lark.
- **Logistics / Tài chính / IT**: Nhận Lark task assign theo Domain. IT/Data owner có thêm quyền Audit toàn bộ log bảng `escalation_ticket_ref`.
- **Ban điều hành**: Read-only Metrics tổng (Escalation Resolution Rate).

## 11. Business Rules (Testable)

- **BR-ESC-01 (Mandatory Data)**: Lệnh tạo Escalation qua API bắt buộc ném lỗi 400 nếu thiếu `reason` trừ khi cờ `is_auto=true`.
- **BR-ESC-02 (De-duplicate)**: Ngăn chặn tạo 2 Escalation cho cùng `answer_id` trong vòng 30 phút. Ném lỗi 409 Conflict.
- **BR-ESC-03 (Timeout Fallback)**: API Sync sang Lark phải timeout ở 3s. Nếu timeout, tự động ghi xuống `status_internal=fallback` và không chặn luồng hiển thị thành công của user ở FE.
- **BR-ESC-04 (Auto Confidence Boundary)**: Chỉ trigger Auto Escalation nếu `confidence_score` của AI < 0.6 và Intent gốc nằm trong danh sách nhạy cảm (Pricing, Hoàn trả).

## 12. API Contract Excerpt

- `POST /mia/escalations`
  - Input: `session_id` (string), `answer_id` (string), `reason` (string), `domain` (enum: inventory, pricing, order, policy), `is_auto` (boolean).
  - Output: `escalation_id` (string), `assignee_lark_ref` (string), `lark_task_url` (string), `status` (string).
- Integration Outbound:
  - `POST https://open.larksuite.com/open-apis/task/v2/tasks`

## 13. Event / Webhook Contract Excerpt

- `mia.chatbot.escalation_created`: Bắn ra Topic nội bộ khi tạo thành công.
- `escalation.lark_webhook_received`: Endpoint để Lark ping ngược lại MIABOS khi task thay đổi status (Resolved -> Báo lại Store Manager).

## 14. Data / DB Impact Excerpt

- Bảng `escalation_ticket_ref`: 
  - `escalation_id` (PK)
  - `answer_id` (FK)
  - `lark_task_id` (String)
  - `domain` (String)
  - `assignee_role` (String)
  - `status` (Enum)
  - `created_by` (UUID) - User BQ nội bộ.

## 15. Validation Rules

- `reason` max 1000 kí tự.
- Payload tới Lark phải đảm bảo HTML sanitize để tránh lỗi render task Lark.

## 16. Error Codes

- `ESC-001`: Lark API Timeout / Unresponsive.
- `ESC-002`: Missing Assignment Group Rule in System.
- `ESC-003`: Duplicate Escalation for same answer under 30 minutes.

## 17. Non-Functional Requirements

- **Latency**: API `/mia/escalations` phải trả kết quả cho FE trong vòng `< 2 giây` (tính cả Overhead gọi sang Lark, API Lark là external endpoint).
- **Audit Limit**: 100% thay đổi trường `status` phải được lưu lịch sử DB ít nhất `180 ngày`.
- **System Load**: API phải chịu tải được `50 req/s` lúc peak hour cửa hàng bán lẻ đóng ca.

## 18. Acceptance Criteria

- **AC1**: Là nhân viên cửa hàng, khi gọi Escalation trên một câu trả lời thiếu thông tin tồn kho hợp lệ, hệ thống tạo Ticket bên Lark thành công và gán đúng Group BQ Logistics, trả link ngay trong ứng dụng Chat.
- **AC2**: Là IT Developer, nếu tôi cố tình giả lập tắt Lark integration, Escalation vẫn được lưu vào Database MIABOS dạng fallback và Job sync sẽ tự động scan để gửi lại vào ban đêm.
- **AC3**: Cố tình spam tạo 2 Escalation cho cùng 1 tin nhắn trợ lý trong vòng 5 phút sẽ bị từ chối bằng Toast notification "Bạn đã tạo khiếu nại cho câu hỏi này".
- **AC4**: Lark webhook push trạng thái "Done", MIABOS update ngay ticket ref thành Resolved và báo tiếng Notify cho nhân viên cửa hàng đó.

## 19. Test Scenarios

- Tạo Escalation hợp lệ theo tay (Manual).
- Tự động tạo bằng AI Simulator (Score < 0.6).
- Stress test tạo duplicate (Race condition checking).
- API Lark trả 500 error xem hệ thống Handle Fallback.

## 20. Observability

- Dashboard số lượng Escalation theo 4 nhánh: Inventory, Pricing, Order, Policy.
- API Timeout rate của ngõ giao tiếp Lark.

## 21. Rollout / Feature Flag

- `FLAG_LARK_ESCALATION`: Mặc định = True. Fallback if False.

## 22. Open Questions

- BQ có muốn tạo Sub-task trên Lark hay dùng 1 Root task kèm comment history? 
- Quản trị viên Lark của BQ có đủ phân quyền webhook trở lại MIABOS Server chưa?

## 23. Definition of Done

- Mã FE/BE ghép thông trơn tru tích hợp qua Lark test workspace. Log lại được DB nội bộ của BQ. Phủ 80% Unit Test.

## 24. Ready-for-UXUI Checklist

- [x] UXUI đã nhận rõ Role và Context từ BQ Ecosystem.
- [ ] Render Screen States: Drawer Composer, Success Toaster, Error Alert.

## 25. Ready-for-FE-Preview Checklist

- [ ] Lên được API stub/mock cho frontend bind dữ liệu.

## 26. Ready-for-BE / Integration Promotion Checklist

- [x] Flow Lark Data đã rõ, Map field 1-1 completed.
