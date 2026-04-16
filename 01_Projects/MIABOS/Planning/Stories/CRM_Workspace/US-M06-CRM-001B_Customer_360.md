# User Story: Customer 360

**Status**: Draft
**Owner**: [[A03_BA_Agent]]
**Last Updated By**: Antigravity (Gemini 3.1 Pro)
**Last Reviewed By**: A01 PM Agent
**Approval Required**: BA Agent + PM Agent
**Approved By**: -
**Last Status Change**: 2026-04-16
**Source of Truth**: This file
**Blocking Reason**: Cần chốt tab priority phase 1 và mức độ hiển thị social relationship

## Story Identity

- `Story ID`: `US-M06-CRM-001B`
- `Feature ID`: `F-M06-CRM-001`
- `Module`: `CRM Workspace`

## User Story

`Là Sales / CSKH / CRM Manager, tôi muốn mở một màn hình Customer 360 để nhìn thấy profile, social relationship, order, chat, call, timeline, AI summary, và action tiếp theo của khách hàng trong cùng một nơi.`

## Problem / Outcome

- Người dùng thường xuyên phải chuyển tab qua lại nhiều hệ thống (POS, ERP, Chat) để nắm bối cảnh khách hàng.
- Customer 360 sẽ tập hợp mọi sự kiện, thuộc tính và liên kết chéo, cho ra kết quả trong < 3s.
- Cải thiện tỷ lệ ra quyết định chính xác dựa trên ngữ cảnh và consent.

## Trigger

- Mở từ danh sách khách hàng.
- Deep link từ đơn hàng / chat conversation / ticket.
- Click thông báo push tự động.

## Happy Path

1. User bấm chi tiết khách hàng từ list.
2. Hệ thống tải header profile, consent flag và thẻ tóm tắt AI summary.
3. User xem phần panel Social relationship để kiểm tra liên lạc.
4. User cuộn xem timeline đa kênh (call, chat, order) và lịch sử gần nhất.
5. User quyết định gọi điện thoại hoặc gửi email thông qua nút "Care Action".

## Acceptance Criteria

| AC ID | Given | When | Then |
|------|-------|------|------|
| AC-01 | customer đã tồn tại | mở hồ sơ | thấy profile header, consent, identity map, AI summary |
| AC-02 | customer có nhiều social profiles | mở panel relationship | thấy rõ linked và unresolved profiles |
| AC-03 | một nguồn history lỗi | mở customer 360 | màn hình vẫn render partial data |
| AC-04 | customer có duplicate flag | mở hồ sơ | thấy CTA sang duplicate review |
| AC-05 | tạo action từ customer 360 | submit thành công | action xuất hiện trên timeline |

## Dependencies

- `F-M06-CRM-001` SRS
- `UXUI-F-M06-CRM-001B`
- API gọi xuống các core domains như hội thoại, call history, đơn hàng, promotion.

## Out Of Scope

- Cập nhật thủ công các field dữ liệu đồng bộ chéo với ERP (VD: điểm thưởng loyal point).
- Xóa hồ sơ gốc trực tiếp từ UI này.

## Linked Artifacts

- UXUI: [UXUI-F-M06-CRM-001B_Customer_360.md](../../../Design/UXUI_Features/UXUI-F-M06-CRM-001B_Customer_360.md)
- SRS: [F-M06-CRM-001_Customer_And_CRM_SRS.md](../../../Analysis/Features/Modules/CRM_Workspace/Customer_And_CRM/SRS/F-M06-CRM-001_Customer_And_CRM_SRS.md)
