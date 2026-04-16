# User Story: Care Action

**Status**: Draft
**Owner**: [[A03_BA_Agent]]
**Last Updated By**: Antigravity (Gemini 3.1 Pro)
**Last Reviewed By**: A01 PM Agent
**Approval Required**: BA Agent + PM Agent
**Approved By**: -
**Last Status Change**: 2026-04-16
**Source of Truth**: This file
**Blocking Reason**: Cần chốt action taxonomy, destination routing, và consent gate

## Story Identity

- `Story ID`: `US-M06-CRM-001D`
- `Feature ID`: `F-M06-CRM-001`
- `Module`: `CRM Workspace`

## User Story

`Là Sales / CSKH / Marketing, tôi muốn tạo hành động chăm sóc từ customer context hiện tại để follow-up, gửi CTKM, ghi chú chăm sóc, hoặc handoff mà không bị thiếu consent hay thiếu ngữ cảnh.`

## Problem / Outcome

- Khi xem insight khách hàng, người dùng gặp rào cản thao tác khi muốn ghi chú chăm sóc hay giao việc.
- Quản lý chiến dịch cần có bước an toàn để chỉ cho phép gửi khi trạng thái đồng ý (consent) là hợp lệ.
- Luồng Care action giúp thao tác được chuẩn hóa và tự động lưu ngược về customer timeline.

## Trigger

- Mở action modal/side-panel từ màn hình danh sách Customer.
- Mở từ thẻ AI Summary / Next best action.
- Nhấp chọn "Create care action" tại Customer 360 header.

## Happy Path

1. User đang đứng tại Customer 360, muốn gọi khách hàng ngày tựu trường.
2. User bấm nút tạo Care Action.
3. Modal bật lên preview nhẹ bối cảnh liên hệ mới nhất.
4. User chọn action = "Hẹn Follow up", chọn Owner phụ trách, note nội dung cần nói chuyện.
5. User bấm lưu. Hệ thống hiển thị Toast thành công.
6. Một ticket/follow-up event được bắn vào timeline. Màn hình tự đóng không reload.

## Acceptance Criteria

| AC ID | Given | When | Then |
|------|-------|------|------|
| AC-01 | user mở action composer | chọn action type | form hiển thị đúng field cần nhập |
| AC-02 | consent không hợp lệ | chọn action gửi marketing | hệ thống chặn submit và nêu rõ lý do |
| AC-03 | action tạo thành công | submit | timeline cập nhật và có success state |
| AC-04 | action được khởi tạo từ AI suggestion | mở composer | form được prefill đúng context |
| AC-05 | submit lỗi | retry | user không mất nội dung đã nhập |

## Dependencies

- `F-M06-CRM-001` SRS
- `UXUI-F-M06-CRM-001D`
- Routing notification và Task Management backend.

## Out Of Scope

- Cấu hình template CTKM (thuộc M04/M10).
- Xây dựng workflow automation đa kênh bên trong modal (Care action là hành động đơn lẻ).

## Linked Artifacts

- UXUI: [UXUI-F-M06-CRM-001D_Care_Action.md](../../../Design/UXUI_Features/UXUI-F-M06-CRM-001D_Care_Action.md)
- SRS: [F-M06-CRM-001_Customer_And_CRM_SRS.md](../../../Analysis/Features/Modules/CRM_Workspace/Customer_And_CRM/SRS/F-M06-CRM-001_Customer_And_CRM_SRS.md)
