# User Story: Duplicate Review

**Status**: Draft
**Owner**: [[A03_BA_Agent]]
**Last Updated By**: Antigravity (Gemini 3.1 Pro)
**Last Reviewed By**: A01 PM Agent
**Approval Required**: BA Agent + PM Agent
**Approved By**: -
**Last Status Change**: 2026-04-16
**Source of Truth**: This file
**Blocking Reason**: Cần chốt merge governance, survivor rule, và approval rights

## Story Identity

- `Story ID`: `US-M06-CRM-001C`
- `Feature ID`: `F-M06-CRM-001`
- `Module`: `CRM Workspace`

## User Story

`Là CRM Manager / CSKH Lead, tôi muốn có màn hình review duplicate để so sánh hồ sơ nghi trùng, xem conflict, chọn survivor record, và merge hoặc split an toàn.`

## Problem / Outcome

- Không có tool chuẩn hóa dễ dẫn đến nhân viên gộp sai dữ liệu, mất mát thông tin quan trọng.
- Reviewer cần thấy rõ conflict trước khi "bấm nút".
- Duy trì tính minh bạch và có flow audit rõ ràng sau merge để xử lý nhầm lẫn.

## Trigger

- Tự động điều hướng lúc click vào duplicate badge trong Customer List / Customer 360.
- Truy cập thẳng vào hàng đợi Duplicate Queue.

## Happy Path

1. System tự động đánh dấu 2 records là duplicate logic score > 80%.
2. CRM Manager vào giao diện Duplicate Review Queue.
3. User xem thẻ so sánh cạnh nhau, thấy các trường trùng nhau và conflict (vd consent, số phone phụ).
4. User quyết định giữ Record A (survivor) và lấy thêm sđt phụ từ Record B.
5. User xác nhận merge, check form impact (số lượng history remap).
6. Hệ thống thực hiện merge background. Update complete state.

## Acceptance Criteria

| AC ID | Given | When | Then |
|------|-------|------|------|
| AC-01 | có merge case | mở review | thấy score, lý do nghi trùng, field conflict |
| AC-02 | user chọn survivor | xem preview | thấy dữ liệu sau merge trước khi xác nhận |
| AC-03 | conflict mạnh ở consent / VIP | mở review | hệ thống highlight cảnh báo |
| AC-04 | user merge thành công | hoàn tất | identities và summaries được remap sang survivor |
| AC-05 | user chọn not duplicate | lưu quyết định | case đóng và audit đầy đủ |

## Dependencies

- `F-M06-CRM-001` SRS
- `UXUI-F-M06-CRM-001C`
- Background jobs / message queues để thực hiện deep remap.

## Out Of Scope

- Cấu hình auto-merge engine logic (thuộc AI Agent scope).
- Khôi phục dữ liệu đã merge từ UI (un-merge). Nằm ở scope kĩ thuật.

## Linked Artifacts

- UXUI: [UXUI-F-M06-CRM-001C_Duplicate_Review.md](../../../Design/UXUI_Features/UXUI-F-M06-CRM-001C_Duplicate_Review.md)
- SRS: [F-M06-CRM-001_Customer_And_CRM_SRS.md](../../../Analysis/Features/Modules/CRM_Workspace/Customer_And_CRM/SRS/F-M06-CRM-001_Customer_And_CRM_SRS.md)
