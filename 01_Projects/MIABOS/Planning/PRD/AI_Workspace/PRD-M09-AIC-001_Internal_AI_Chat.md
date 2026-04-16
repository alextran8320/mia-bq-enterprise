# PRD: Internal AI Chat

**Status**: In Review
**Owner**: [[A02_Product_Owner_Agent|A02 Product Owner Agent]]
**Last Updated By**: Codex CLI (GPT-5 Codex)
**Last Reviewed By**: A01 PM Agent
**Approval Required**: Business Owner
**Approved By**: -
**Last Status Change**: 2026-04-16
**Source of Truth**: This document
**Blocking Reason**: Chờ Business Owner review; FE Preview vẫn bị khóa cho đến khi UXUI được Approved
**Project**: MIABOS
**Module ID**: M09
**Phase**: PB-02 / PB-03
**Priority**: P0
**Products**: MIA Smart
**Created by**: [[A02_Product_Owner_Agent|A02 Product Owner Agent]]
**Date**: 2026-04-16
**Document Role**: Canonical product definition cho internal AI workspace của BQ

---

## 0. Executive Summary

- What is being proposed: Xây `Internal AI Chat` làm entry point cho nhân viên BQ hỏi đáp bằng tiếng Việt tự nhiên, có source trace, freshness, warning, và next action.
- Why now: Requirement pack BQ cho phase 1 cần một giao diện chat nội bộ đủ tin cậy để nối `Knowledge Center` với các nguồn vận hành như SAP B1, KiotViet, Haravan.
- Expected business and user outcome: Giảm thời gian hỏi đáp lặp lại, tăng trust vào AI answer, và tránh tình trạng user phải mở nhiều hệ thống cho một câu hỏi.
- Recommended decision: Duyệt slice `F-M09-AIC-001` như front door của AI Workspace, nhưng giữ PRD ở `In Review` đến khi Business Owner review xong.

## 1. Business Context

### 1.1 Background

BQ đang vận hành retail đa kênh, nên cùng một câu hỏi có thể chạm dữ liệu kho, đơn hàng, giá, CTKM, policy đổi trả, hoặc SOP nội bộ. Nếu không có một surface chat thống nhất, nhân viên sẽ tiếp tục phụ thuộc vào người biết việc thay vì vào một nguồn chuẩn.

### 1.2 Problem Statement

Hiện câu hỏi nội bộ bị phân mảnh giữa SAP B1, KiotViet, Haravan, Excel, và tài liệu policy. Người dùng không phân biệt được đâu là dữ liệu snapshot, đâu là policy, đâu là câu cần escalate. Điều này làm giảm trust và tạo chi phí hỏi lại.

### 1.3 Why This Matters

`Internal AI Chat` là lớp giao tiếp đầu tiên của MIABOS với người dùng nội bộ. Nếu lớp này không rõ loại câu trả lời, không có trace, hoặc không chặn đúng lúc, toàn bộ AI Workspace sẽ bị xem là “chat thử nghiệm” thay vì công cụ vận hành.

### 1.4 Why Now

Phase 1 của BQ cần một trải nghiệm đủ nhanh để pilot, nhưng cũng đủ chặt để không lộ dữ liệu sai hoặc câu trả lời mơ hồ. Đây là thời điểm thích hợp để chốt slice nền trước khi mở các slice trust review và escalation sâu hơn.

## 2. Target Users and Personas

| Persona | Role | Primary Pain | Desired Outcome | Priority |
|---------|------|--------------|-----------------|----------|
| CSKH | Nhân viên chăm sóc khách hàng | Phải mở nhiều nguồn để trả lời khách | Có answer rõ, có citation, biết lúc nào cần escalate | P0 |
| Ecommerce / Omnichannel | Nhân viên kênh online | Cần đối chiếu đơn hàng, chính sách, và trạng thái xử lý nhanh | Nhận được mixed answer rõ ràng, không phải đoán | P0 |
| Ops / Store Lead | Quản lý vận hành cửa hàng | SOP và policy thường nằm rải ở nhiều nơi | Tra cứu nhanh, có freshness và warning khi nguồn cũ | P0 |
| Ban điều hành / Pricing control | Quản lý cấp cao hoặc kiểm soát giá | Cần summary cross-domain nhưng phải giữ quyền truy cập | Nhận câu trả lời an toàn, có masking nếu cần | P1 |

## 3. Jobs To Be Done

| Persona | Job To Be Done | Current Friction | Product Opportunity |
|---------|----------------|------------------|---------------------|
| CSKH | Trả lời policy / order / complaint đúng ngay lần đầu | Phải hỏi lại đồng nghiệp hoặc mở nhiều hệ thống | Một chat shell có answer type, citation, và escalation rõ |
| Ecommerce / Omnichannel | Tra cứu tình huống mixed giữa đơn hàng và policy | Dữ liệu và policy dễ bị trộn lẫn | Tách `Data` và `Policy` trong cùng một answer card |
| Ops / Store Lead | Kiểm tra SOP, quy trình, warning mới nhất | Không rõ bản nào là bản hiệu lực | Hiển thị freshness và source trace có kiểm soát |

## 4. User Task Flows  ⚠ Mandatory

### CSKH

| Step | Task | Task Type | Success Indicator |
|------|------|-----------|------------------|
| 1 | Mở `/ai/chat` và đặt câu hỏi bằng tiếng Việt tự nhiên | Quick Action | Có thread và input dock sẵn |
| 2 | Đọc answer type badge, kết luận, và warning | Reporting | Biết ngay answer là Policy/Data/Mixed/Blocked |
| 3 | Mở source trace nếu cần xác minh | Quick Action | Thấy citation và freshness |
| 4 | Escalate nếu answer chưa đủ chắc chắn | Exception Handling | Không bị dead-end |

### Ecommerce / Omnichannel

| Step | Task | Task Type | Success Indicator |
|------|------|-----------|------------------|
| 1 | Nhập câu hỏi mixed về đơn hàng và policy | Quick Action | Hệ thống nhận đúng intent |
| 2 | Đọc tách bạch phần data và phần policy | Reporting | Không bị trộn kết luận |
| 3 | Kiểm tra warning nếu nguồn cũ hoặc mâu thuẫn | Reporting | Hiểu rủi ro của câu trả lời |
| 4 | Gửi feedback hoặc mở escalation | Exception Handling | Có next action rõ |

### Ops / Store Lead

| Step | Task | Task Type | Success Indicator |
|------|------|-----------|------------------|
| 1 | Hỏi SOP / policy / guideline nội bộ | Quick Action | Có answer có citation |
| 2 | Xem freshness và source trace | Reporting | Biết bản nào đang hiệu lực |
| 3 | Chọn tiếp tục hỏi hoặc escalate | Exception Handling | Không phải rời khỏi chat để tìm người khác |

## 5. Product Goals and Success Metrics

| Goal | KPI / Metric | Baseline | Target | Source |
|------|--------------|----------|--------|--------|
| Tăng tốc độ trả lời | Thời gian tới answer đầu tiên | Chưa đo | `<= 4 giây` cho 95% query pilot | `chat_answer_snapshot` |
| Tăng trust | Tỉ lệ answer policy có citation hợp lệ | Chưa đo | `>= 85%` | `M12 observability` |
| Giảm dead-end | Tỉ lệ session có escalation hoặc follow-up hợp lệ thay vì bế tắc | Chưa đo | `>= 95%` | `chat_audit_log` |

## 6. Scope Boundaries

### 6.1 In Scope

- Chat shell nội bộ cho nhân viên BQ
- Answer type `Policy / Data / Mixed / Blocked`
- Source trace, freshness, warning, next action
- Escalation CTA ở mức UI contract
- Tương thích với `M07`, `M08`, `M11`

### 6.2 Out of Scope

- Chat sales-facing cho khách hàng cuối
- Human handoff workflow chi tiết của `M11`
- Answer history / trust review đầy đủ của `F-M09-AIC-002`
- Real-time analytics dashboard của `M12`

### 6.3 Non-Goals

- Không thay thế SAP B1, KiotViet, hay Haravan
- Không trả raw JSON hoặc raw ERP payload cho user business
- Không tự động hành động thay user trong phase 1

## 7. Release Slice and Sequencing

| Slice | Goal | Included Features | Excluded Features | Dependency |
|-------|------|-------------------|-------------------|------------|
| Phase 1 Internal AI Chat Foundation | Có front door AI nội bộ đủ tin cậy để pilot BQ | `F-M09-AIC-001` | Trust review sâu và handoff workflow full | `F-M08-KNW-001..004`, `F-M07-SEC-001`, `F-M11-ESC-001` |
| Phase 1.1 Trust Loop | Ghi nhận answer history và review trust | `F-M09-AIC-002` | Production analytics đầy đủ | `F-M09-AIC-001`, `F-M12-OBS-001` |
| Phase 1.2 Escalation Loop | Nối câu trả lời chưa đủ chắc chắn sang người thật | `F-M09-AIC-003` | Full case management | `F-M09-AIC-001`, `F-M11-ESC-001` |

## 8. Linked Features

| Feature ID | Feature Name | Purpose | Priority | Planned Status |
|------------|--------------|---------|----------|----------------|
| `F-M09-AIC-001` | Internal AI Chat | Front door hỏi đáp nội bộ có trust layer | P0 | Draft |
| `F-M09-AIC-002` | AI Answer History and Trust Review | Review lịch sử answer và trust signals | P1 | Draft |
| `F-M09-AIC-003` | Escalation Trigger and Human Handoff | Chuyển câu hỏi chưa đủ chắc sang người thật | P1 | Draft |

## 9. Solution Direction

### 9.1 UX / IA Direction

Trải nghiệm phải bắt đầu bằng chat shell gọn, answer card có cấu trúc rõ, và source trace chỉ mở khi user cần xác minh. UI không được biến thành dashboard nặng thông tin.

### 9.2 Functional Capabilities

- Phân loại intent và answer type theo câu hỏi
- Chạy access check trước khi render answer
- Tách rõ phần `Data` và phần `Policy` khi câu hỏi là `Mixed`
- Gắn warning khi nguồn cũ, mâu thuẫn, hoặc thiếu độ tin cậy

### 9.3 Operational Rules

- Answer policy hoặc mixed phải có citation hợp lệ
- Nếu quyền không đủ, hiển thị blocked state an toàn thay vì dữ liệu thô
- Source trace phải phản ánh snapshot tại thời điểm trả lời, không compose live state lại

### 9.4 Technical Constraints for Downstream Teams

- FE Preview chỉ chạy bằng mock/stub data cho tới khi UXUI Approved
- API contract phải khớp giữa `Internal AI Chat` và `Escalation`
- Mọi answer phải snapshot để phục vụ audit và review sau này

## 10. Assumptions and Dependencies

| ID | Assumption / Dependency | Risk if Wrong | Owner |
|----|-------------------------|---------------|-------|
| `A-001` | BQ chấp nhận phase 1 là internal-only AI workspace | Scope bị lệch sang external sớm | PM / Business Owner |
| `A-002` | Source specs của SAP B1, KiotViet, Haravan đủ cho snapshot cấp 1 | Câu trả lời data bị thiếu | A05 / A03 |
| `D-001` | `M08` đủ stable để cung cấp citation cho policy answer | Trust layer yếu | A03 |
| `D-002` | `M07` đủ rõ để mask/block đúng quyền | Lộ dữ liệu nhạy cảm | A03 / A05 |
| `D-003` | UXUI approval là gate bắt buộc trước FE Preview canonical | FE build sớm sẽ đi sai contract | A01 / A06 |

## 11. Risks and Mitigations

| Risk | Type | Impact | Mitigation | Owner |
|------|------|--------|------------|-------|
| Intent taxonomy phase 1 mơ hồ | Product | Routing sai, answer sai type | Chốt taxonomy trong SRS và story AC | A03 |
| Source conflict giữa SAP / KiotViet / Haravan | Data | Trust giảm mạnh | Gắn warning + priority rule rõ | A05 / A03 |
| FE Preview bị mở quá sớm | Process | Build sai contract | Giữ gate `UXUI Approved` trước preview | A01 |
| User không hiểu blocked state | UX | Tăng dead-end cảm nhận | Microcopy blocked rõ ràng, ngắn, không lộ thuật ngữ hệ thống | A06 |

## 12. Open Questions

| ID | Question | Blocking? | Owner | Target Resolution Date |
|----|----------|-----------|-------|------------------------|
| `OQ-001` | Low-confidence threshold phase 1 chốt theo rule nào? | Yes | A03 / A01 | 2026-04-18 |
| `OQ-002` | Khi source conflict, hệ thống ưu tiên source nào cho từng intent class? | Yes | A05 / A03 | 2026-04-18 |
| `OQ-003` | Follow-up question hay escalation sẽ là default fallback? | Yes | A01 / A03 | 2026-04-19 |

## 13. Decision Log

| Date | Decision | Made By | Reason |
|------|----------|---------|--------|
| 2026-04-16 | Chọn `Internal AI Chat` làm front door của `AI Workspace` phase 1 | A02 / A01 | Đây là slice có giá trị pilot cao nhất và tạo nền cho trust / escalation sau đó |
| 2026-04-16 | Giữ PRD ở `In Review`, không fake Business Owner approval | A02 / A01 | Cần review thật trước khi chốt downstream planning |

## 14. Linked Artifacts

- Feature Registry: [01_Projects/MIABOS/Analysis/Features/_feature_registry.md](../../../Analysis/Features/_feature_registry.md)
- Feature SRS: [F-M09-AIC-001_Internal_AI_Chat_SRS.md](../../../Analysis/Features/Modules/AI_Workspace/Internal_AI_Chat/SRS/F-M09-AIC-001_Internal_AI_Chat_SRS.md)
- UXUI Spec: [UXUI-F-M09-AIC-001_Internal_AI_Chat.md](../../../Design/UXUI_Features/UXUI-F-M09-AIC-001_Internal_AI_Chat.md)
- User Story: [US-M09-AIC-001_Internal_AI_Chat_FE_Preview.md](../../Stories/AI_Workspace/US-M09-AIC-001_Internal_AI_Chat_FE_Preview.md)
- Subtask Board: [STB-M09-AIC-001_Internal_AI_Chat_FE_Preview.md](../../Subtask_Boards/STB-M09-AIC-001_Internal_AI_Chat_FE_Preview.md)
- Research / Evidence:
  - [2026-04-13_BQ_Customer_Research_Pack.md](../../../../04_Raw_Information/Customers/Giay_BQ/2026-04-13_BQ_Customer_Research_Pack.md)
  - [2026-04-13_BQ_Raw_Notes.md](../../../../04_Raw_Information/Customers/Giay_BQ/2026-04-13_BQ_Raw_Notes.md)

## 15. Approval Checklist

- [x] Business case is explicit
- [x] Primary personas are identified
- [x] User Task Flows are complete
- [x] In-scope release slice is explicit
- [x] Success metrics are measurable
- [x] Major assumptions are recorded
- [x] Open blockers are explicit
- [ ] Business Owner approved this PRD
