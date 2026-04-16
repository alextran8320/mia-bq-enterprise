# User Story: Customer List

**Status**: Draft
**Owner**: [[A03_BA_Agent]]
**Last Updated By**: Antigravity (Gemini 3.1 Pro)
**Last Reviewed By**: A01 PM Agent
**Approval Required**: BA Agent + PM Agent
**Approved By**: -
**Last Status Change**: 2026-04-16
**Source of Truth**: This file
**Blocking Reason**: Cần chốt filter priority và bulk action set phase 1

## Story Identity

- `Story ID`: `US-M06-CRM-001A`
- `Feature ID`: `F-M06-CRM-001`
- `Module`: `CRM Workspace`

## User Story

`Là Sales / CSKH / Marketing, tôi muốn có danh sách khách hàng với search, filter, saved view, duplicate flag, và bulk action cơ bản để tìm đúng hồ sơ nhanh và thao tác CRM hàng ngày hiệu quả.`

## Problem / Outcome

- Hiện tại người dùng khó tra cứu và theo dõi đúng tệp khách hàng mục tiêu do thiếu thiết kế danh sách tối ưu.
- Cần cung cấp bộ lọc động và dấu hiệu cảnh báo (duplicate, consent) để tránh sai sót.
- Danh sách tạo ra thói quen quản lý tệp khách hàng theo saved views.

## Trigger

- Truy cập từ sidebar menu `CRM / Customers`.
- Bấm vào link danh sách khách hàng từ các báo cáo Campaign/Segments.
- Redirect sau khi thoát Customer 360.

## Happy Path

1. User mở màn hình danh sách khách hàng theo URL mặc định (hoặc saved view cá nhân).
2. Hệ thống load data theo pagination.
3. User gõ tìm kiếm số điện thoại, hệ thống debounce và hiển thị exact match.
4. User quan sát thấy row tín hiệu khách hàng, kiểm tra thấy badge cảnh báo "duplicate".
5. User nhấp vào dòng hồ sơ để xem Customer 360, hoặc nhấp badge để xử lý Duplicate.

## Acceptance Criteria

| AC ID | Given | When | Then |
|------|-------|------|------|
| AC-01 | user mở customer list | search theo phone / tên / social ref / order ref | hệ thống trả đúng candidate list |
| AC-02 | list có duplicate flag | click duplicate badge | mở đúng duplicate review flow |
| AC-03 | user chọn nhiều khách | bulk action được phép | hiện bulk action bar với preview count |
| AC-04 | user dùng saved view | quay lại màn hình | hệ thống nhớ view |
| AC-05 | user không có quyền xem full phone | list render | phone được mask đúng policy |

## Dependencies

- `F-M06-CRM-001` SRS
- `UXUI-F-M06-CRM-001A`
- Cơ chế Role & Permission (masking phone/email)

## Out Of Scope

- Cập nhật số lượng lớn dữ liệu ngoại trừ các field được phép ở phase 1 (gán tags, owner).
- Chỉnh sửa trực tiếp trên grid list (chỉ view-only).

## Linked Artifacts

- UXUI: [UXUI-F-M06-CRM-001A_Customer_List.md](../../../Design/UXUI_Features/UXUI-F-M06-CRM-001A_Customer_List.md)
- SRS: [F-M06-CRM-001_Customer_And_CRM_SRS.md](../../../Analysis/Features/Modules/CRM_Workspace/Customer_And_CRM/SRS/F-M06-CRM-001_Customer_And_CRM_SRS.md)
