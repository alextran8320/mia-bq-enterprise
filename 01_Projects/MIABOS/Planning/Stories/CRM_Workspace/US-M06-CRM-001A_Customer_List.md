# User Story: Customer List

**Status**: Draft
**Owner**: [[A03_BA_Agent]]
**Last Updated By**: Codex CLI (GPT-5 Codex)
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

## Acceptance Criteria

| AC ID | Given | When | Then |
|------|-------|------|------|
| AC-01 | user mở customer list | search theo phone / tên / social ref / order ref | hệ thống trả đúng candidate list |
| AC-02 | list có duplicate flag | click duplicate badge | mở đúng duplicate review flow |
| AC-03 | user chọn nhiều khách | bulk action được phép | hiện bulk action bar với preview count |
| AC-04 | user dùng saved view | quay lại màn hình | hệ thống nhớ view |
| AC-05 | user không có quyền xem full phone | list render | phone được mask đúng policy |

## Linked Artifacts

- UXUI: [UXUI-F-M06-CRM-001A_Customer_List.md](../../../Design/UXUI_Features/UXUI-F-M06-CRM-001A_Customer_List.md)
- SRS: [F-M06-CRM-001_Customer_And_CRM_SRS.md](../../../Analysis/Features/Modules/CRM_Workspace/Customer_And_CRM/SRS/F-M06-CRM-001_Customer_And_CRM_SRS.md)
