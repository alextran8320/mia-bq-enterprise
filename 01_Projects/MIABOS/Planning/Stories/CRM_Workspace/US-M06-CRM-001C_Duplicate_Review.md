# User Story: Duplicate Review

**Status**: Draft
**Owner**: [[A03_BA_Agent]]
**Last Updated By**: Codex CLI (GPT-5 Codex)
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

## Acceptance Criteria

| AC ID | Given | When | Then |
|------|-------|------|------|
| AC-01 | có merge case | mở review | thấy score, lý do nghi trùng, field conflict |
| AC-02 | user chọn survivor | xem preview | thấy dữ liệu sau merge trước khi xác nhận |
| AC-03 | conflict mạnh ở consent / VIP | mở review | hệ thống highlight cảnh báo |
| AC-04 | user merge thành công | hoàn tất | identities và summaries được remap sang survivor |
| AC-05 | user chọn not duplicate | lưu quyết định | case đóng và audit đầy đủ |

## Linked Artifacts

- UXUI: [UXUI-F-M06-CRM-001C_Duplicate_Review.md](../../../Design/UXUI_Features/UXUI-F-M06-CRM-001C_Duplicate_Review.md)
- SRS: [F-M06-CRM-001_Customer_And_CRM_SRS.md](../../../Analysis/Features/Modules/CRM_Workspace/Customer_And_CRM/SRS/F-M06-CRM-001_Customer_And_CRM_SRS.md)
