# Feature SRS: F-M11-ESC-001 Escalation and Workflow

**Status**: In Review
**Owner**: A03 BA Agent
**Last Updated By**: Codex CLI (GPT-5.4 Codex environment)
**Last Reviewed By**: A01 PM Agent
**Approval Required**: PM, Business Owner
**Approved By**: -
**Last Status Change**: 2026-04-19
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
| Escalation destination (Task system) | MIABOS Internal Escalation Queue | Write | Business Owner clarify BQ không dùng Lark; phase hiện tại dùng queue nội bộ MIABOS hoặc destination khác do BQ xác nhận sau |
| Ticket Fallback | MIABOS Internal Database | Write | Nếu destination chưa chốt hoặc dispatch lỗi, tạo internal queue để khỏi mất ticket |
| Cấu trúc Data BQ (Sản phẩm/Tồn kho) | SAP B1, KiotViet | Read | AI trace source khi tạo escalation (AI tham chiếu từ KiotViet hay SAP) |

## 1. User Story

Là Vận hành bán lẻ / Quản lý cửa hàng (hoặc AI), tôi muốn tạo escalation nhanh vào MIABOS Internal Escalation Queue khi câu trả lời của AI mâu thuẫn giữa các hệ thống (ví dụ: SAP báo còn, KiotViet báo hết) hoặc chưa đủ tin cậy, để bộ phận phụ trách của BQ tiếp quản xử lý triệt để.

## 1A. User Task Flow

| Step | User Role | Action | Task Type | Notes |
|------|-----------|--------|-----------|-------|
| 1 | Store Manager / AI | Bấm nút tạo escalation từ answer / Nhấp tự động | Exception Handling | Entry |
| 2 | Hệ thống | Trích xuất context (câu hỏi, source, confidence score) | Quick Action | Payload Generation |
| 3 | Hệ thống | Map domain rule để gán người nhận (CSKH, IT, Kho) | Routing | Workflow |
| 4 | User / Assignee | Theo dõi trạng thái trên MIABOS Internal Escalation Queue | Reporting | Follow-up |

## 2. Business Context

Tại Giày BQ, dữ liệu vận hành nằm ở SAP B1, KiotViet, Haravan, Excel và Data Warehouse dự kiến của BQ. Khi triển khai Phase 1 Chatbot Nội Bộ, sẽ có tình huống AI đưa ra câu trả lời không chắc chắn (low confidence) do dữ liệu chưa đồng bộ, chưa đủ quyền, hoặc chưa có source snapshot đáng tin.
Để xây dựng niềm tin vào AI, hệ thống không được để "dead-end". Cần có một luồng Escalation mượt mà ghi nhận vấn đề vào MIABOS Internal Escalation Queue kèm đầy đủ context để bộ phận phụ trách của BQ xử lý. BQ không sử dụng Lark trong operation hiện tại.

## 3. Preconditions

- AI Chat (M09/M10) đã sinh ra một `answer_snapshot` bao gồm `session_id`, `question`, `answer`, `confidence_score`.
- Bảng `assignment_rules` đã được định nghĩa trong MIABOS (vd: Intent Tồn Kho -> team Logistics/Kho; Intent Giá -> team Tài chính/Pricing control).

## 4. Postconditions

- Một ticket được sinh ra trong MIABOS Internal Escalation Queue đúng nhóm phòng ban phụ trách.
- `escalation_ticket_ref` được lưu vào MIABOS DB với trạng thái `Submitted` liên kết tới internal ticket ID.

## 5. Main Flow (>= 4 steps)

1. **Trigger**: Store Manager nhấn nút "Báo cáo lỗi/Cần hỗ trợ" trên đoạn chat với AI, hoặc AI tự động chớp cháy luồng auto-escalation do (confidence < 0.6).
2. **Form Render**: Hệ thống hiển thị Drawer điền thông tin bổ sung. Các trường Context (hội thoại, system source bị lỗi như KiotViet/SAP) đã được auto-filled.
3. **Submit**: Store Manager nhập "Lý do bổ sung" (không bắt buộc) và nhấn Gửi.
4. **Routing**: Hệ thống resolve `assignment_rule` dựa trên Domain của câu hỏi (Order, Inventory, IT Support) -> Xác định team/role phụ trách trong MIABOS.
5. **Dispatch**: Hệ thống tạo ticket trong MIABOS Internal Escalation Queue.
6. **Persistence**: Ghi log lại `escalation_ticket_ref` với `internal_ticket_id` lưu vào backend MIABOS. Trả về thông báo thành công cho Store Manager kèm mã ticket theo dõi.

## 6. Alternate Flows

- **Destination Chưa Chốt / Offline**: Nếu destination ngoài MIABOS chưa chốt hoặc dispatch lỗi, hệ thống vẫn ghi MIABOS Internal Queue và notify Admin Ops BQ.
- **Auto Escalation**: AI Chatbot gọi trực tiếp API sinh Escalation ngầm ở Step 4, gửi notification vào kênh Chat cho user biết "Hệ thống đã ghi nhận vấn đề này, số ticket: #...".

## 7. Error Flows

- Thiếu `answer_snapshot` ID: Báo lỗi "Không truy xuất được context đoạn chat gốc". Block quá trình submit.
- Không match được Routing Rule: Ticket vào queue mặc định `General Support`, ghi Error Log để phân tích lại sau.

## 8. State Machine

`Draft` -> `Submitted` -> `Assigned` -> `In Progress` -> `Resolved` -> `Closed`

## 9. UX / Screen Behavior

- Form nằm dạng Right Drawer chồng lên giao diện chat, không làm mất bối cảnh hội thoại hiện tại.
- Read-only section lớn để hiển thị "Context sẽ được gửi đi", tăng sự tự tin cho user.
- Thẻ tag màu phân biệt Severity (Low, Medium, High).

## 10. Role / Permission Rules

Theo BQ Stakeholder Map:
- **Vận hành bán lẻ / Quản lý cửa hàng**: Quyền `Create`, xem Escalation của nhánh mình.
- **Chăm sóc khách hàng (CSKH)**: Quyền `View All`, nhận assign và route lại trong MIABOS.
- **Logistics / Tài chính / IT**: Nhận ticket assign theo Domain. IT/Data owner có thêm quyền Audit toàn bộ log bảng `escalation_ticket_ref`.
- **Ban điều hành**: Read-only Metrics tổng (Escalation Resolution Rate).

## 11. Business Rules (Testable)

- **BR-ESC-01 (Mandatory Data)**: Lệnh tạo Escalation qua API bắt buộc ném lỗi 400 nếu thiếu `reason` trừ khi cờ `is_auto=true`.
- **BR-ESC-02 (De-duplicate)**: Ngăn chặn tạo 2 Escalation cho cùng `answer_id` trong vòng 30 phút. Ném lỗi 409 Conflict.
- **BR-ESC-03 (Destination Fallback)**: Nếu destination ngoài MIABOS chưa chốt hoặc lỗi, tự động ghi xuống `status_internal=fallback` và không chặn luồng hiển thị thành công của user ở FE.
- **BR-ESC-04 (Auto Confidence Boundary)**: Chỉ trigger Auto Escalation nếu `confidence_score` của AI < 0.6 và Intent gốc nằm trong danh sách nhạy cảm (Pricing, Hoàn trả).

## 12. API Contract Excerpt

- `POST /mia/escalations`
  - Input: `session_id` (string), `answer_id` (string), `reason` (string), `domain` (enum: inventory, pricing, order, policy), `is_auto` (boolean).
  - Output: `escalation_id` (string), `assignee_role` (string), `internal_ticket_url` (string), `status` (string).
- Integration Outbound: TBD theo destination BQ xác nhận sau; không dùng Lark mặc định.

## 13. Event / Webhook Contract Excerpt

- `mia.chatbot.escalation_created`: Bắn ra Topic nội bộ khi tạo thành công.
- `escalation.status_updated`: Event nội bộ khi ticket thay đổi status (Resolved -> báo lại Store Manager).

## 14. Data / DB Impact Excerpt

- Bảng `escalation_ticket_ref`: 
  - `escalation_id` (PK)
  - `answer_id` (FK)
  - `internal_ticket_id` (String)
  - `domain` (String)
  - `assignee_role` (String)
  - `status` (Enum)
  - `created_by` (UUID) - User BQ nội bộ.

## 15. Validation Rules

- `reason` max 1000 kí tự.
- Payload destination phải đảm bảo sanitize để tránh lỗi render hoặc injection khi tích hợp hệ thống ngoài sau này.

## 16. Error Codes

- `ESC-001`: Escalation Destination Timeout / Unresponsive.
- `ESC-002`: Missing Assignment Group Rule in System.
- `ESC-003`: Duplicate Escalation for same answer under 30 minutes.

## 17. Non-Functional Requirements

- **Latency**: API `/mia/escalations` phải trả kết quả cho FE trong vòng `< 2 giây`.
- **Audit Limit**: 100% thay đổi trường `status` phải được lưu lịch sử DB ít nhất `180 ngày`.
- **System Load**: API phải chịu tải được `50 req/s` lúc peak hour cửa hàng bán lẻ đóng ca.

## 18. Acceptance Criteria

- **AC1**: Là nhân viên cửa hàng, khi gọi Escalation trên một câu trả lời thiếu thông tin tồn kho hợp lệ, hệ thống tạo ticket trong MIABOS Internal Escalation Queue và gán đúng Group BQ Logistics, trả link/mã ticket ngay trong ứng dụng Chat.
- **AC2**: Là IT Developer, nếu destination ngoài MIABOS chưa cấu hình, Escalation vẫn được lưu vào Database MIABOS dạng fallback để không mất context.
- **AC3**: Cố tình spam tạo 2 Escalation cho cùng 1 tin nhắn trợ lý trong vòng 5 phút sẽ bị từ chối bằng Toast notification "Bạn đã tạo khiếu nại cho câu hỏi này".
- **AC4**: Khi ticket được cập nhật trạng thái "Done" trong MIABOS, hệ thống update ngay ticket ref thành Resolved và notify cho nhân viên cửa hàng đó.

## 19. Test Scenarios

- Tạo Escalation hợp lệ theo tay (Manual).
- Tự động tạo bằng AI Simulator (Score < 0.6).
- Stress test tạo duplicate (Race condition checking).
- Destination adapter trả 500 error xem hệ thống Handle Fallback.

## 20. Observability

- Dashboard số lượng Escalation theo 4 nhánh: Inventory, Pricing, Order, Policy.
- Timeout rate của destination adapter.

## 21. Rollout / Feature Flag

- `FLAG_ESCALATION_EXTERNAL_DESTINATION`: Mặc định = False. Phase hiện tại dùng MIABOS Internal Escalation Queue.

## 22. Open Questions

- BQ muốn giữ escalation trong MIABOS queue hay tích hợp sang hệ thống ticket/workflow nào khác trong phase sau?
- SLA xử lý escalation theo domain cần được BQ chốt như thế nào?

## 23. Definition of Done

- Mã FE/BE ghép thông trơn tru qua MIABOS Internal Escalation Queue. Log lại được DB nội bộ của BQ. Phủ 80% Unit Test.

## 24. Ready-for-UXUI Checklist

- [x] UXUI đã nhận rõ Role và Context từ BQ Ecosystem.
- [ ] Render Screen States: Drawer Composer, Success Toaster, Error Alert.

## 25. Ready-for-FE-Preview Checklist

- [ ] Lên được API stub/mock cho frontend bind dữ liệu.

## 26. Ready-for-BE / Integration Promotion Checklist

- [ ] Destination ngoài MIABOS chưa chốt; phase hiện tại dùng MIABOS Internal Escalation Queue.
