# Session Log: MIABOS BO Decisions And UXUI Approve

**Date**: 2026-04-17
**AI/Channel**: Claude Code
**Model**: claude-sonnet-4-6
**Role**: A01 PM Agent + A06 UI/UX Agent + A05 Tech Lead
**Project**: MIABOS — Giày BQ
**Phase**: PB-03 (UXUI Review & Approval Gate)
**Session Type**: Artifact-changing — BO decisions recorded + UXUI specs approved

---

## Summary

Business Owner chốt 8 open questions còn lại từ §22 của 8 SRS. Sau khi nhận decisions, PM Agent phân bổ review pipeline (A06 → A05 → A01) và approve toàn bộ 9 UXUI Feature Specs từ Draft → Approved.

---

## Business Owner Decisions (2026-04-17)

| # | Câu hỏi | Quyết định |
|---|---------|-----------|
| Q1 | Transcript retention | **Lưu không thời hạn** |
| Q2 | TL xem transcript team? | **Có — TL xem toàn bộ, không mask** |
| Q3 | AI trigger condition | **Hai điều kiện:** AI confidence thấp + user bấm thủ công |
| Q4 | Routing priority | **Domain/nghiệp vụ trước** (giá, đổi trả, kỹ thuật...) |
| Q5 | Action types phase 1 | **4 loại:** Hỏi thêm thông tin · Offer KM · Chốt đơn/đặt cọc · Chuyển TL |
| Q6 | CTA set phase 1 | **4 CTA:** Đặt lịch tư vấn · Báo giá · Kết nối sales · Đặt hàng thử |
| Q7 | Dual approval? | **Không có — approval nằm ở SAP, không phải MIABOS** |
| Q8 | Freshness SLA | **1 giờ cho tất cả** source types (SAP B1, KiotViet, Excel, tài liệu tay) |

---

## Actions Taken

### 1. Cập nhật §22 của 8 SRS

Tất cả 8 SRS đã được update §22: thay "Open Questions" thành bảng decisions đã chốt + impact lên UXUI/FE.

| SRS | Impact chính |
|-----|-------------|
| F-M09-AIC-002 | Loại bỏ retention-expired state; TL không bị mask |
| F-M09-AIC-003 | Dual trigger; routing domain-first |
| F-M10-SLS-002 | 4 action types cố định; rule-based ranking |
| F-M10-SLS-003 | 4 CTA; 1 form chung; không có routing selector UI |
| F-M08-KNW-001 | Không có dual-approval UI |
| F-M08-KNW-002 | 1-reviewer flow; SLA 1-threshold |
| F-M08-KNW-003 | Taxonomy domain-based; desktop-first |
| F-M08-KNW-004 | 3 source types; freshness = 1 giờ |

### 2. Approve 9 UXUI Feature Specs (Draft → Approved)

| Feature ID | UXUI Spec | Reviewer |
|------------|-----------|---------|
| F-M09-AIC-002 | AI Answer History & Trust Review | A06 + A05 + A01 |
| F-M09-AIC-003 | Escalation Trigger & Human Handoff | A06 + A05 + A01 |
| F-M10-SLS-002 | Suggested Actions & Next Best Action | A06 + A05 + A01 |
| F-M10-SLS-003 | Lead Capture & CTA Handoff | A06 + A05 + A01 |
| F-M12-OBS-001 | Audit & Observability | A06 + A05 + A01 |
| F-M08-KNW-001 | Knowledge & Policy | A06 + A05 + A01 |
| F-M08-KNW-002 | Knowledge Publishing Queue | A06 + A05 + A01 |
| F-M08-KNW-003 | FAQ & Policy Library | A06 + A05 + A01 |
| F-M08-KNW-004 | Knowledge Documents & Source Governance | A06 + A05 + A01 |

### 3. Cập nhật UXUI_Features/_index.md

Tất cả 12 specs giờ đều ở Approved. FE Preview status cập nhật: 9 specs từ "Pending FE build" → "Open for A07 FE build".

---

## Current State

- **12/12 SRS**: Status = SRS Ready
- **12/12 UXUI Specs**: Status = Approved
- **FE Preview**: 3 specs Ready for Review (AIC-001, SLS-001, BIZ-001); 9 specs Open for A07 FE build
- **Next**: A07 FE Builder build 9 features còn lại (mock/stub only)

---

## Artifacts Modified

- `Analysis/Features/Modules/AI_Workspace/AI_Answer_History_And_Trust_Review/SRS/F-M09-AIC-002_AI_Answer_History_And_Trust_Review_SRS.md` — §22 updated
- `Analysis/Features/Modules/AI_Workspace/Escalation_Trigger_And_Human_Handoff/SRS/F-M09-AIC-003_Escalation_Trigger_And_Human_Handoff_SRS.md` — §22 updated
- `Analysis/Features/Modules/AI_Workspace/Suggested_Actions_And_Next_Best_Action/SRS/F-M10-SLS-002_Suggested_Actions_And_Next_Best_Action_SRS.md` — §22 updated
- `Analysis/Features/Modules/AI_Workspace/Lead_Capture_And_CTA_Handoff/SRS/F-M10-SLS-003_Lead_Capture_And_CTA_Handoff_SRS.md` — §22 updated
- `Analysis/Features/Modules/Knowledge_Center/Knowledge_And_Policy/SRS/F-M08-KNW-001_Knowledge_And_Policy_SRS.md` — §22 updated
- `Analysis/Features/Modules/Knowledge_Center/Knowledge_Publishing_Queue/SRS/F-M08-KNW-002_Knowledge_Publishing_Queue_SRS.md` — §22 updated
- `Analysis/Features/Modules/Knowledge_Center/FAQ_And_Policy_Library/SRS/F-M08-KNW-003_FAQ_And_Policy_Library_SRS.md` — §22 updated
- `Analysis/Features/Modules/Knowledge_Center/Knowledge_Documents_And_Source_Governance/SRS/F-M08-KNW-004_Knowledge_Documents_And_Source_Governance_SRS.md` — §22 updated
- `Design/UXUI_Features/UXUI-F-M09-AIC-002_AI_Answer_History_And_Trust_Review.md` — Status: Draft → Approved
- `Design/UXUI_Features/UXUI-F-M09-AIC-003_Escalation_Trigger_And_Human_Handoff.md` — Status: Draft → Approved
- `Design/UXUI_Features/UXUI-F-M10-SLS-002_Suggested_Actions_And_Next_Best_Action.md` — Status: Draft → Approved
- `Design/UXUI_Features/UXUI-F-M10-SLS-003_Lead_Capture_And_CTA_Handoff.md` — Status: Draft → Approved
- `Design/UXUI_Features/UXUI-F-M12-OBS-001_Audit_And_Observability.md` — Status: Draft → Approved
- `Design/UXUI_Features/UXUI-F-M08-KNW-001_Knowledge_And_Policy.md` — Status: Draft → Approved
- `Design/UXUI_Features/UXUI-F-M08-KNW-002_Knowledge_Publishing_Queue.md` — Status: Draft → Approved
- `Design/UXUI_Features/UXUI-F-M08-KNW-003_FAQ_And_Policy_Library.md` — Status: Draft → Approved
- `Design/UXUI_Features/UXUI-F-M08-KNW-004_Knowledge_Documents_And_Source_Governance.md` — Status: Draft → Approved
- `Design/UXUI_Features/_index.md` — All 12 specs Approved; FE status updated
