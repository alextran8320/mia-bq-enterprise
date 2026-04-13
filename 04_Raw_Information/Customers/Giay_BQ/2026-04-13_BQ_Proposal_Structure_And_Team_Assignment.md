# Cấu Trúc Proposal Và Phân Công Team Cho BQ

**Status**: Draft
**Owner**: A01 PM Agent
**Last Updated By**: Codex CLI (GPT-5 Codex)
**Last Reviewed By**: -
**Approval Required**: Business Owner
**Approved By**: -
**Last Status Change**: 2026-04-13
**Source of Truth**: This file
**Blocking Reason**: -

---

## 1. Storyline proposal đề xuất

### Deck chính

1. Cover
2. Executive summary
3. BQ đang vận hành như thế nào hôm nay
4. Landscape hệ thống hiện tại
5. Các bài toán kinh doanh hiện tại
6. Vì sao cần một roadmap AI theo phase
7. Tầm nhìn chuyển đổi AI cho BQ
8. Tổng quan roadmap 4 phase
9. Phase 1: AI chatbot nội bộ
10. Kiến trúc kỹ thuật của Phase 1
11. Phase 2: CRM + external AI chatbot
12. Phase 3: Marketing AI + AI automation
13. Phase 4: Forecasting
14. Chiến lược tích hợp giữa `SAP B1`, `KiotViet`, `Haravan`, Excel, và Lark
15. Cách triển khai và logic rollout
16. Governance, team dự án, và bước tiếp theo

### Appendix

- Các câu hỏi mẫu cho chatbot nội bộ
- Mapping dữ liệu
- Assumptions và risks

## 2. Thông điệp chính theo từng phase

### Phase 1

- Xây lớp truy vấn AI nội bộ và knowledge layer trước
- Tập trung vào FAQ, tồn kho, giá, CTKM, sản phẩm, logistics, và hướng dẫn dùng hệ thống

### Phase 2

- Mở rộng sang CRM và AI hướng khách hàng
- Dựa trên nền tri thức nội bộ và data mapping sạch hơn

### Phase 3

- Mở rộng sang Marketing AI và automation cho công việc lặp lại

### Phase 4

- Triển khai forecasting sau khi data foundation đủ mạnh

## 3. Phân vai trong team

| Vai trò | Trách nhiệm chính | Output trong proposal |
|---------|-------------------|-----------------------|
| Business Owner | Narrative thương mại và chiến lược | Executive message, strategic framing, phần close proposal |
| PO | Chủ proposal về mặt storyline | Flow slide, roadmap, merge deck, logic bước tiếp theo |
| BA | Chủ business problem và use case | Bối cảnh business, pain points, use case, source-of-truth business mapping |
| Tech Lead | Chủ feasibility kỹ thuật | Chiến lược tích hợp, dependency, risk, giới hạn khả thi |
| Solution Architect | Chủ kiến trúc | Diagram kiến trúc, target state theo phase, flow hệ thống |

## 4. Task breakdown đề xuất

### Business Owner

- chốt commercial angle chính
- tinh chỉnh leadership message
- duyệt storyline cuối cùng trước khi trình bày

### PO

- sở hữu outline cuối của deck
- draft executive summary và các slide roadmap
- merge toàn bộ nội dung thành một proposal thống nhất

### BA

- draft phần bối cảnh business và pain point của BQ
- viết use-case summary cho cả 4 phase
- chuẩn bị data-source mapping và FAQ mapping cho Phase 1

### Tech Lead

- xác định ranh giới tích hợp cho `SAP B1`, `KiotViet`, `Haravan`, Excel, và Lark
- draft technical assumptions và risks
- xác nhận mức khả thi theo từng phase

### Solution Architect

- thiết kế target architecture
- thiết kế diagram kiến trúc theo từng phase
- map AI layer, integration layer, knowledge layer, và source systems

## 5. Lưu ý khi delivery

- Tránh positioning proposal như một chatbot đơn lẻ.
- Nên positioning đây là một `AI operating layer theo phase cho BQ`.
- Phase 1 phải đủ cụ thể và đủ demo-able.
- Forecasting cần được giữ ở phase sau, phụ thuộc vào data readiness.
