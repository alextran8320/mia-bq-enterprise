# User Story: Care Action

**Status**: Draft
**Owner**: [[A03_BA_Agent]]
**Last Updated By**: Codex CLI (GPT-5 Codex)
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

## Acceptance Criteria

| AC ID | Given | When | Then |
|------|-------|------|------|
| AC-01 | user mở action composer | chọn action type | form hiển thị đúng field cần nhập |
| AC-02 | consent không hợp lệ | chọn action gửi marketing | hệ thống chặn submit và nêu rõ lý do |
| AC-03 | action tạo thành công | submit | timeline cập nhật và có success state |
| AC-04 | action được khởi tạo từ AI suggestion | mở composer | form được prefill đúng context |
| AC-05 | submit lỗi | retry | user không mất nội dung đã nhập |

## Linked Artifacts

- UXUI: [UXUI-F-M06-CRM-001D_Care_Action.md](../../../Design/UXUI_Features/UXUI-F-M06-CRM-001D_Care_Action.md)
- SRS: [F-M06-CRM-001_Customer_And_CRM_SRS.md](../../../Analysis/Features/Modules/CRM_Workspace/Customer_And_CRM/SRS/F-M06-CRM-001_Customer_And_CRM_SRS.md)
