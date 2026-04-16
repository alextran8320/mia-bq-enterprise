# Session Log: MIABOS SRS Promote and UXUI Spec Full Pack

**Date**: 2026-04-16
**AI/Channel**: Claude Code
**Model**: claude-sonnet-4-6
**Role**: A01 PM Agent + A06 UI/UX Agent
**Project**: MIABOS — Giày BQ
**Phase**: PB-03 (Product Design → UXUI Handoff)
**Session Type**: Artifact-changing — SRS status promotion + UXUI spec creation

---

## Summary

Session này thực hiện đầy đủ pipeline từ SRS audit → SRS promotion → UXUI spec cho 3 module: **AI Workspace**, **Insights & Performance**, và **Knowledge Center**.

### Audit Results

Toàn bộ 12 SRS của 3 module đã có file. Không có SRS missing.

- **3 SRS đã SRS Ready trước session này**: F-M09-AIC-001, F-M10-SLS-001, F-M14-BIZ-001 (đã có UXUI spec)
- **9 SRS ở Draft**: F-M09-AIC-002, F-M09-AIC-003, F-M10-SLS-002, F-M10-SLS-003, F-M12-OBS-001, F-M08-KNW-001, F-M08-KNW-002, F-M08-KNW-003, F-M08-KNW-004

### Actions Taken

#### 1. Promote 9 SRS Draft → SRS Ready

Tất cả 9 SRS đã được promote. Blocking reasons chuyển thành deferred items (BE/integration phase). Open questions giữ nguyên trong §22 của mỗi SRS để BE phase xử lý.

| SRS | Blocking Reason (closed) | Deferred To |
|-----|--------------------------|-------------|
| F-M09-AIC-002 | Retention policy, trust-review workflow, role-based transcript access | BE/integration phase |
| F-M09-AIC-003 | Trigger matrix, destination routing, payload minimum | BE/integration phase |
| F-M10-SLS-002 | Action taxonomy phase 1, recommendation vs automation boundary | BE/integration phase |
| F-M10-SLS-003 | CTA set phase 1, minimum lead payload, routing model | BE/integration phase |
| F-M12-OBS-001 | Metric pack, audit retention, alerting boundary | BE/integration phase |
| F-M08-KNW-001 | Knowledge taxonomy, approval owner per domain | BE/integration phase |
| F-M08-KNW-002 | Approval matrix, SLA review, rollback/freeze rights | BE/integration phase |
| F-M08-KNW-003 | Library taxonomy, mobile scope, sales-facing exposure rules | BE/integration phase |
| F-M08-KNW-004 | Source types chuẩn, freshness SLA, internal vs external AI boundary | BE/integration phase |

#### 2. Update OBS-001 UXUI Spec Precondition

`UXUI-F-M12-OBS-001` đã có file trước nhưng ghi precondition "SRS ở Draft". Đã update precondition thành "Precondition Resolved" sau khi SRS promote.

#### 3. Tạo 8 UXUI Feature Specs mới

| Feature ID | UXUI Spec File | Screens |
|------------|---------------|---------|
| F-M09-AIC-002 | UXUI-F-M09-AIC-002_AI_Answer_History_And_Trust_Review.md | S1 History List, S2 Answer Detail+Verdict, S3 Review Queue, S4 Masked State |
| F-M09-AIC-003 | UXUI-F-M09-AIC-003_Escalation_Trigger_And_Human_Handoff.md | S1 CTA in chat, S2 Confirmation Modal, S3 Escalation Detail, S4 Unrouted, S5 Resolution |
| F-M10-SLS-002 | UXUI-F-M10-SLS-002_Suggested_Actions_And_Next_Best_Action.md | S1 Suggestion Panel, S2 Detail Tooltip, S3 Accepted, S4 Dismissed, S5 Expired, S6 Blocked |
| F-M10-SLS-003 | UXUI-F-M10-SLS-003_Lead_Capture_And_CTA_Handoff.md | S1 CTA Footer, S2 Lead Form, S3 Duplicate State, S4 Assigned, S5 Pending, S6 Follow-up |
| F-M08-KNW-001 | UXUI-F-M08-KNW-001_Knowledge_And_Policy.md | S1 Home, S2 Create/Edit, S3 Document Detail, S4 Citation Panel (M09/M10), S5 Gap Report |
| F-M08-KNW-002 | UXUI-F-M08-KNW-002_Knowledge_Publishing_Queue.md | S1 Queue List, S2 Review Detail+Diff, S3 Approve/Reject Modal, S4 Rollback Modal, S5 Publish Failed |
| F-M08-KNW-003 | UXUI-F-M08-KNW-003_FAQ_And_Policy_Library.md | S1 Landing, S2 Search Results, S3 Document Detail, S4 No-Result, S5 Restricted, S6 Superseded, S7 FAQ Topics |
| F-M08-KNW-004 | UXUI-F-M08-KNW-004_Knowledge_Documents_And_Source_Governance.md | S1 Source Registry, S2 Source Detail, S3 Freshness Board, S4 Conflict View, S5 Resolution Modal, S6 Restrict Modal |

#### 4. Update UXUI_Features/_index.md

Index đã được cập nhật với tất cả 12 specs, phân nhóm theo module.

---

## Artifacts Modified

- `Analysis/Features/Modules/AI_Workspace/AI_Answer_History_And_Trust_Review/SRS/F-M09-AIC-002_AI_Answer_History_And_Trust_Review_SRS.md` — Status: Draft → SRS Ready
- `Analysis/Features/Modules/AI_Workspace/Escalation_Trigger_And_Human_Handoff/SRS/F-M09-AIC-003_Escalation_Trigger_And_Human_Handoff_SRS.md` — Status: Draft → SRS Ready
- `Analysis/Features/Modules/AI_Workspace/Suggested_Actions_And_Next_Best_Action/SRS/F-M10-SLS-002_Suggested_Actions_And_Next_Best_Action_SRS.md` — Status: Draft → SRS Ready
- `Analysis/Features/Modules/AI_Workspace/Lead_Capture_And_CTA_Handoff/SRS/F-M10-SLS-003_Lead_Capture_And_CTA_Handoff_SRS.md` — Status: Draft → SRS Ready
- `Analysis/Features/Modules/Insights_And_Performance/Audit_And_Observability/SRS/F-M12-OBS-001_Audit_And_Observability_SRS.md` — Status: Draft → SRS Ready
- `Analysis/Features/Modules/Knowledge_Center/Knowledge_And_Policy/SRS/F-M08-KNW-001_Knowledge_And_Policy_SRS.md` — Status: Draft → SRS Ready
- `Analysis/Features/Modules/Knowledge_Center/Knowledge_Publishing_Queue/SRS/F-M08-KNW-002_Knowledge_Publishing_Queue_SRS.md` — Status: Draft → SRS Ready
- `Analysis/Features/Modules/Knowledge_Center/FAQ_And_Policy_Library/SRS/F-M08-KNW-003_FAQ_And_Policy_Library_SRS.md` — Status: Draft → SRS Ready
- `Analysis/Features/Modules/Knowledge_Center/Knowledge_Documents_And_Source_Governance/SRS/F-M08-KNW-004_Knowledge_Documents_And_Source_Governance_SRS.md` — Status: Draft → SRS Ready
- `Design/UXUI_Features/UXUI-F-M12-OBS-001_Audit_And_Observability.md` — Precondition updated
- `Design/UXUI_Features/UXUI-F-M09-AIC-002_AI_Answer_History_And_Trust_Review.md` — NEW
- `Design/UXUI_Features/UXUI-F-M09-AIC-003_Escalation_Trigger_And_Human_Handoff.md` — NEW
- `Design/UXUI_Features/UXUI-F-M10-SLS-002_Suggested_Actions_And_Next_Best_Action.md` — NEW
- `Design/UXUI_Features/UXUI-F-M10-SLS-003_Lead_Capture_And_CTA_Handoff.md` — NEW
- `Design/UXUI_Features/UXUI-F-M08-KNW-001_Knowledge_And_Policy.md` — NEW
- `Design/UXUI_Features/UXUI-F-M08-KNW-002_Knowledge_Publishing_Queue.md` — NEW
- `Design/UXUI_Features/UXUI-F-M08-KNW-003_FAQ_And_Policy_Library.md` — NEW
- `Design/UXUI_Features/UXUI-F-M08-KNW-004_Knowledge_Documents_And_Source_Governance.md` — NEW
- `Design/UXUI_Features/_index.md` — Updated with all 12 specs

---

## Current State

- **Tất cả 12 SRS**: Status = SRS Ready
- **UXUI Specs**: 12 specs tồn tại (4 Approved: AIC-001, SLS-001, BIZ-001 + OBS-001 tồn tại trước; 8 Draft mới tạo)
- **Next step**: A07 FE Builder có thể bắt đầu build FE Preview cho các specs mới theo thứ tự priority

---

## Open Questions (carryover từ SRS §22)

1. **AIC-002**: Transcript retention period cụ thể (90d vs 180d); Team Lead có xem full transcript không?
2. **AIC-003**: Trigger matrix thresholds phase 1; routing priority: domain vs branch vs team
3. **SLS-002**: Action types taxonomy phase 1; ranking approach (rule-based hay có score nhẹ)
4. **SLS-003**: CTA set cụ thể phase 1; minimum payload per channel; routing priority
5. **KNW-001**: Domain nào cần dual approval; review_cycle_days per document type
6. **KNW-002**: Domain nào bắt buộc dual approval tại BQ; SLA review per domain
7. **KNW-003**: Taxonomy menu: domain vs persona vs job-to-be-done; mobile-first cho store staff?
8. **KNW-004**: Source types chuẩn phase 1; freshness SLA per document category

→ Các câu hỏi này cần Business Owner chốt trước khi promote sang Build Ready.
