# Hồ Sơ Khách Hàng Giày BQ

**Status**: Draft
**Owner**: A01 PM Agent
**Last Updated By**: Codex CLI (GPT-5.4 Codex environment)
**Last Reviewed By**: -
**Approval Required**: Business Owner
**Approved By**: -
**Last Status Change**: 2026-04-19
**Source of Truth**: This folder index
**Blocking Reason**: -

---

## Mục Đích

Thư mục này lưu các ghi chú intake, tài liệu research đã cấu trúc, stakeholder framing, landscape hệ thống, và các input hỗ trợ proposal cho case `Giay BQ`.

Đây là `customer pack` đang được dùng trong giai đoạn intake và pre-project discovery để:

- giữ lại các requirement signal đang làm việc cùng Business Owner
- gom research thành bộ tài liệu có thể tái sử dụng
- hỗ trợ architecture framing, workshop planning, và solution scoping

## Thành Phần Hồ Sơ

| Tài liệu | Vai trò |
|----------|---------|
| [2026-04-13_BQ_Raw_Notes.md](2026-04-13_BQ_Raw_Notes.md) | Ghi chú intake thô từ Business Owner và các tín hiệu ban đầu |
| [2026-04-13_BQ_Customer_Research_Pack.md](2026-04-13_BQ_Customer_Research_Pack.md) | Bộ research tổng hợp về business model, business needs, roadmap AI, và nhận định chiến lược |
| [2026-04-13_BQ_SAP_Research.md](2026-04-13_BQ_SAP_Research.md) | Tài liệu research riêng cho SAP Business One, gồm module nghiệp vụ, object groups, và hàm ý tích hợp |
| [2026-04-13_BQ_Systems_And_Integration_Landscape.md](2026-04-13_BQ_Systems_And_Integration_Landscape.md) | Bức tranh hệ thống hiện tại của SAP B1, KiotViet, Haravan, Excel, và Data Warehouse dự kiến của BQ |
| [2026-04-13_BQ_Internal_Chatbot_Discovery_Questions.md](2026-04-13_BQ_Internal_Chatbot_Discovery_Questions.md) | Bộ câu hỏi discovery cho chatbot nội bộ |
| [2026-04-13_BQ_Stakeholder_Map.md](2026-04-13_BQ_Stakeholder_Map.md) | Mapping stakeholder và phòng ban tham gia theo roadmap AI |
| [2026-04-13_BQ_Proposal_Structure_And_Team_Assignment.md](2026-04-13_BQ_Proposal_Structure_And_Team_Assignment.md) | Cấu trúc proposal và phân công team nội bộ |
| [2026-04-14_BQ_Integration_Architecture_And_Data_Boundary.md](2026-04-14_BQ_Integration_Architecture_And_Data_Boundary.md) | Bản discovery gốc. Tài liệu feature chính đã được chuẩn hóa và chuyển sang [SAP_B1_Internal_Chatbot_Integration_POC.md](../../../01_Projects/MIABOS/Analysis/Features/Briefs/SAP_B1_Internal_Chatbot_Integration_POC.md) |

## Ghi Chú Sử Dụng

- Customer pack này vẫn là workspace intake/discovery, chưa phải project workspace chính thức trong `01_Projects/`.
- Hướng framing hiện tại cho BQ nên bắt đầu từ `Core AI CRM Platform`, trong đó phase đầu tiên ưu tiên `AI Internal Chatbot + Knowledge + Conversation + integration-ready read layer`.
- BQ không sử dụng Lark trong operation hiện tại. Nếu các tài liệu cũ có nhắc `Data Lark`, cần đọc lại thành định hướng `Data Warehouse` của riêng BQ.
- MIABOS không tạo source data vận hành của BQ ngoài `Conversation` và `Knowledge`; source-of-truth dữ liệu vẫn nằm ở hệ thống BQ đang sở hữu và Data Warehouse dự kiến.
- Các câu trả lời discovery đã được xác nhận nên được cập nhật ngược lại vào pack này để tránh drift khi sang proposal và design.
