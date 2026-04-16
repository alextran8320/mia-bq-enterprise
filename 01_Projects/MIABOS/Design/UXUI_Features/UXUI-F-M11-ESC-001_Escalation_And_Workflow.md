# UXUI Feature Spec: F-M11-ESC-001 Escalation and Workflow (Draft)

**Feature ID**: F-M11-ESC-001
**Status**: Draft
**Owner**: A06 UI/UX Agent
**Implementation Reviewer**: A05 Tech Lead
**Implemented By**: A07 FE Builder
**Product**: MIABOS / Operations And Governance
**Design System Reference**: [Aura_Minimalist_Design_System.md](../Aura_Minimalist_Design_System.md)
**Canonical Save Path**: `Design/UXUI_Features/UXUI-F-M11-ESC-001_Escalation_And_Workflow.md`
**Date**: 2026-04-17
**Last Status Change**: 2026-04-17

> **Precondition**: SRS [F-M11-ESC-001_Escalation_And_Workflow_SRS.md](../../Analysis/Features/Modules/Operations_And_Governance/Escalation_And_Workflow/SRS/F-M11-ESC-001_Escalation_And_Workflow_SRS.md) đã được rewrite vào lúc 2026-04-17 theo context BQ và đang chờ review. Tài liệu này là Draft UX Contract cho FE/UI dev.

---

## §0. User & Task

### Target User Role(s)

| Role | Mô tả | Context |
|------|------|---------|
| Vận hành bán lẻ (Store Manager) | Nhân viên cửa hàng BQ đang dùng AI Chat | Cần báo lỗi hoặc Escalation 1 ticket cho tuyến trên khi dữ liệu của AI không khớp hoặc AI không có quyền hạn |
| CSKH / IT / Kho | Người nhận task (Assignee) | Tiếp nhận task từ Lark và theo dõi nguồn gốc lỗi (qua context từ MIABOS) |
| System (Auto) | Workflow automation | Khi confidence score < 0.6, hệ thống tự escalate thay user |

### Primary Task Objective

> Người dùng (Vận hành bán lẻ) có thể tạo Escalation từ một hội thoại AI sai sót, cung cấp lý do chỉ trong `>= 2 bước` (click, nhập lý do, submit), hệ thống đẩy sang Lark và trả kết quả/URL theo dõi ngay.

### Success Metric

| Metric | Target | How to Measure |
|--------|--------|---------------|
| Thời gian tạo 1 Escalation thủ công | `< 10s` | Đếm từ lúc bấm nút "Báo Cáo/Hỗ Trợ" đến lúc Submit |
| Contextual Data Auto-fill | `100%` | Các field gốc (câu trả lời, domain, answer_id) tự động fill, không bắt user copy paste |
| Rời bỏ (Drop-off rate) ở màn Drawer | `< 5%` | Số phiên mở Drawer đóng ngang mà không submit |

### Failure Indicators

- Người dùng không thấy được link Lark sau khi Submit.
- Không nhận biết được là Fallback hay Thành công ngay.
- Click tạo trùng nhiều lần vì hệ thống delay.

---

## 1. Feature Overview

### Purpose
Thiết kế một luồng Report / Escalation trực tiếp trên nền Chatbot Nội Bộ, kết nối sang Lark Workflow. Đảm bảo nhân viên cửa hàng không bị bế tắc khi câu trả lời của Trợ lý hoặc dữ liệu KiotViet/SAP B1 gặp xung đột.

### User Story
`Là Vận hành bán lẻ / Quản lý cửa hàng BQ, tôi muốn tạo escalation nhanh sang Lark khi câu trả lời của AI mâu thuẫn giữa các hệ thống, để bộ phận trung tâm tiếp quản trên Lark.`

### Linked Artifacts

| Artifact | Location | Status |
|----------|----------|--------|
| Feature SRS | [F-M11-ESC-001_Escalation_And_Workflow_SRS.md](../../Analysis/Features/Modules/Operations_And_Governance/Escalation_And_Workflow/SRS/F-M11-ESC-001_Escalation_And_Workflow_SRS.md) | In Review |
| Design System | [Aura Minimalist](../Aura_Minimalist_Design_System.md) | Active |

---

## 2. Screen Inventory

| # | Screen Name | Route/Path | Purpose |
|---|-------------|-----------|---------|
| S1 | Escalation Trigger Button | Component trong Chat | Nút hoặc Text Link gọi Drawer (nằm dưới Chat bubble) |
| S2 | Escalation Composer Drawer | Right Drawer | Form điền lý do lỗi và preview dữ liệu gốc gửi đi |
| S3 | Auto Escalation Banner | Inline Message | Banner báo tự động gửi ticket khi confidence < 0.6 |
| S4 | Ticket Ref Link / Toast | Component trong Chat | Thông báo ticket đã sinh thành công ở Lark, kèm Button Link |
| S5 | Escalation Queue (Admin) | `/governance/escalations` | Bảng list các ticket (nếu có user nội bộ theo dõi qua MIABOS) |

## 2.1 Task Flow

### Primary Task Flow

| Step | User Action | System Response | Field Visibility | Notes |
|------|------------|-----------------|-----------------|-------|
| 1 | Bấm nút "Cần Hỗ Trợ/Báo Lỗi" dưới answer card | Mở S2 Drawer | N/A | Entry Point |
| 2 | Xem qua Context (Readonly) | Render question, answer gốc, System Reference | Context Readonly | Tăng lòng tin |
| 3 | Chọn Label lỗi và nhập Lý do (Reason) | Mở keyboard | Type, Reason (opt/req) | Required input |
| 4 | Bấm "Gửi Yêu Cầu" | Nút thành Loading. Gọi API `POST /mia/escalations`. De-duplicate lock UI. | Nhúng lock UI | API sync |
| 5 | Nhận phản hồi UI (Thành công / Fallback) | Đóng Drawer, hiển thị Toast và Link Task Lark thả vào Chat. | Màn chat | Completion |

### Exception Handling 

| At Step | Condition | Branch To |
|---------|-----------|----------|
| Step 4 | Rate Limit Lark, Timeout API > 3s | Lưu DB Fallback, Báo Toast Notification "Yêu cầu đã được lưu và sẽ đồng bộ sau" (System handles offline). |
| Step 4 | Duplicate request < 30m | Reject with Toast "Yêu cầu đã đang được xử lý". |

---

## 3. Visual Specification

### Screen S1: Escalation Trigger Button
- **Placement**: Nằm dưới thẻ Answer Card của Trợ lý.
- **UI Element**: IconButton hoặc TextLink nhỏ (Icon: Flag hoặc Warning). Text: `Cần Hỗ Trợ/Báo Lỗi`.
- **Hover**: Đổi màu sậm hơn (Tint color primary).

### Screen S2: Escalation Composer Drawer
```text
+--------------------------------------------------------------+
| [X] Tạo Yêu Cầu Hỗ Trợ                                      |
|--------------------------------------------------------------|
| Bối cảnh hội thoại (Sẽ được gửi kèm)                         |
| +---------------------------------------------------------+  |
| | Hỏi: Tồn kho Giày mã BQ0123 tại Kênh Online?            |  |
| | Đáp: Hiện chỉ còn 0, theo dữ liệu từ KiotViet (Update..) |  |
| +---------------------------------------------------------+  |
|                                                              |
| Lĩnh vực hỗ trợ *                                            |
| [ Kho & Vận Chuyển v ]                                       |
|                                                              |
| Lý do / Mô tả lỗi *                                          |
| [ Nhập mô tả lỗi (VD: SAP báo còn 5 đôi)...            ]     |
|                                                              |
| [ Gửi Yêu Cầu ]  (Disabled nếu chưa nhập Reason)             |
+--------------------------------------------------------------+
```

### Screen S3: Auto Escalation Banner
Dành cho trường hợp hệ thống AI trả lời thấp hơn ngưỡng tin cậy `< 0.6`.
```text
+--------------------------------------------------------------+
| ( i ) Hệ thống tự động: Trợ lý phát hiện dữ liệu không đồng  |
|       nhất. Đã tự động báo cáo lên phòng Kho Vận.            |
|       [ Xem Tiến Độ (Lark) -> ]                              |
+--------------------------------------------------------------+
```

### Screen S4: Ticket Ref Link (Success State)
- **UI Element**: Một Message System nhỏ hiện trong luồng chat.
- **Text**: `Phiếu hỗ trợ #ESC-0199 đã tạo. [Mở Task Lark]`.
- **Icon**: Check circle (Green).

### Screen S5: Escalation Queue (Admin) (Reference Only)
- Bảng Grid xem list các dòng `escalation_ticket_ref`.
- Cột: ID, Ngày Tạo, Nội Dung Lỗi, Domain, Status, Link Lark.
- Bộ lọc: Theo Domain (Kho, Sales, Pricing), Trạng Thái.

---

## 4. Data Binding

| UI Element | API Endpoint | Field | Format |
|-----------|-------------|-------|--------|
| Composer Root | Parent Screen | `session_id`, `answer_id` | hidden |
| Readonly Context | Parent Screen/Redux | `conversation_history` | Text Block |
| Domain Select | Static/Config | `domain_enum` | Dropdown |
| Submit Payload | `POST /mia/escalations`| `reason`, `domain` | JSON Req |
| Success Reference | `POST /mia/escalations` payload return | `lark_task_url`, `assignee` | String URL |

---

## 5. State Matrix

| Component | Default | Hover | Active | Disabled | Loading |
|-----------|---------|-------|--------|----------|---------|
| Trigger Btn | Normal | Bg tinted | Pressed | `opacity-50` | Spinner |
| Submit Btn | Primary Blue | Dark Blue | Pressed | Grayed & unclickable | Spinner with Text "Đang gửi..." |
| Drawer Background | Dim 40% | N/A | N/A | N/A | N/A |
| Domain Dropdown | Placeholder | Border tint| Focus ring | Locked | - |

## 5.1 Error & Recovery

| Error ID | At Step | Description | Frequency | System Assistance | Recovery Action |
|----------|---------|-------------|-----------|-------------------|----------------|
| `ESC-UX-001` | Step 4 | Duplicate request | Rare | Toast "Yêu cầu đã được tạo cách đây 5 phút" | Không cho spam |
| `ESC-UX-002` | Step 4 | Timeout API (Lark Down) | Occasional | Bắn Popup nhỏ: "Đã lưu bản ghi. Đồng bộ Lark tạm gián đoạn" | Đóng Drawer bình thường |
| `ESC-UX-003` | Step 3 | Bấm gửi không có lý do | User Error | Disable Submit button hoặc hiển thị text error đỏ dưới textarea. | Nhập nội dung để mở khóa Button |

---

## 6. UI Copy Glossary & Microcopy

| Element | Vietnamese Text |
|---------|-----------------|
| Nút gọi | `Cần Hỗ Trợ/Báo Lỗi` |
| Title Drawer | `Tạo Yêu Cầu Hỗ Trợ` |
| Group Nhãn | `Lĩnh vực hỗ trợ` `Kho & Vận Chuyển` `Tài Chính` |
| Lý do | `Lý do / Mô tả lỗi` |
| Toast thành công | `Thành công! Đã chuyển tiếp sang Lark.` |
| Fallback | `Lưu nội bộ thành công. Hệ thống sẽ kết nối với Lark sau.` |

---

## 7. Interaction & Animation

- **Drawer Slide**: Mở từ phải sang trái, duration 250ms, `ease-out`. Click ra ngoài Dimmer để đóng (nếu chưa điền), chặn đóng (confirm) nếu đã gõ text.
- **Button Loading**: Không được đổi chiều ngang của Button, giấu Text thay icon Spinner ở trung tâm.

---

## 8. Accessibility

- Cho phép **[ESC]** để thoát Drawer (với confirm modal).
- Tab index: `Dropdown` -> `TextArea` -> `Submit`.
- Nút Submit disabled cần bổ sung `aria-disabled="true"`.

---

## 9. A05 Technical Cross-Check

- Đảm bảo Drawer Composer được code theo pattern tách rời Component, nhận props là `{ answer_id, session_id }`, không ôm store chat quá lớn.
- API Route phải cover handle timeout ở Gateway, khi FE gọi POST `< 2000ms`, BE trả `202 Accepted` với tag fallback nếu Lark đơ, để UI không bị treo spinner vô tận.

---

## 10. A07 Pre-Delivery Checklist

- [ ] Lên layout HTML Drawer đúng form nhập liệu.
- [ ] Bind state Submit (Loading, Lock form, Show Toast).
- [ ] Handle URL Link Lark trỏ qua New Tab target="_blank".
- [ ] Xử lý Banner Auto-Escalation trên luồng UI Chat History.
