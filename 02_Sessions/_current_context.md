# Current Active Context

**Last Updated**: 2026-04-17
**Active Workspace Topic**: Catalog_And_Commerce audit complete — 4 SRS đủ chuẩn, blocked by open questions
**Current Project**: `MIABOS`
**Current Phase**: `PB-02 / PB-03`
**Latest Canonical Session Log**: [[2026-04-17_MIABOS_Catalog_Commerce_SRS_Audit]]
**Today's Daily Log**: [[2026-04-17_Daily_Log]]

## Latest Decisions

- Toàn bộ **12 SRS** của AI_Workspace (M09 + M10), Insights_And_Performance (M12 + M14), Knowledge_Center (M08 x4) đều ở trạng thái **SRS Ready**.
- 9 SRS được promote từ Draft → SRS Ready trong session này (blocking reasons là BE/integration concerns, không phải design blockers).
- **12 UXUI Feature Specs** hiện tồn tại: 4 Approved (AIC-001, SLS-001, BIZ-001 + OBS-001 precondition resolved), 8 Draft mới tạo.
- Open questions được defer vào §22 của từng SRS; cần Business Owner chốt trước khi promote sang Build Ready.
- Backend/integration bị khóa cho tới khi toàn bộ frontend hoàn tất và Business Owner mở gate riêng.

## SRS Status Summary

| Feature                                               | Status    |
| ----------------------------------------------------- | --------- |
| F-M09-AIC-001 Internal AI Chat                        | SRS Ready |
| F-M09-AIC-002 AI Answer History & Trust Review        | SRS Ready |
| F-M09-AIC-003 Escalation Trigger & Human Handoff      | SRS Ready |
| F-M10-SLS-001 Sales Advisor AI                        | SRS Ready |
| F-M10-SLS-002 Suggested Actions & Next Best Action    | SRS Ready |
| F-M10-SLS-003 Lead Capture & CTA Handoff              | SRS Ready |
| F-M12-OBS-001 Audit & Observability                   | SRS Ready |
| F-M14-BIZ-001 Business Analytics & ROI                | SRS Ready |
| F-M08-KNW-001 Knowledge & Policy                      | SRS Ready |
| F-M08-KNW-002 Knowledge Publishing Queue              | SRS Ready |
| F-M08-KNW-003 FAQ & Policy Library                    | SRS Ready |
| F-M08-KNW-004 Knowledge Documents & Source Governance | SRS Ready |

## UXUI Spec Status Summary

| Feature       | UXUI Spec Status | FE Preview                                 |
| ------------- | ---------------- | ------------------------------------------ |
| F-M09-AIC-001 | Approved         | Ready for Review at `/ai/chat`             |
| F-M09-AIC-002 | Draft            | Pending FE build                           |
| F-M09-AIC-003 | Draft            | Pending FE build                           |
| F-M10-SLS-001 | Approved         | Open for A07 FE Preview                    |
| F-M10-SLS-002 | Draft            | Pending FE build                           |
| F-M10-SLS-003 | Draft            | Pending FE build                           |
| F-M12-OBS-001 | Draft            | Pending FE build                           |
| F-M14-BIZ-001 | Approved         | Ready for Review at `/analytics/executive` |
| F-M08-KNW-001 | Draft            | Pending FE build                           |
| F-M08-KNW-002 | Draft            | Pending FE build                           |
| F-M08-KNW-003 | Draft            | Pending FE build                           |
| F-M08-KNW-004 | Draft            | Pending FE build                           |

## Next Actions

- Business Owner review UXUI Specs mới (8 Draft) và approve để mở A07 FE build.
- Business Owner chốt 8 open questions trong §22 của các SRS để promote sang Build Ready.
- Business Owner review M09 `/ai/chat` và M14 `/analytics/executive` FE Previews hiện có.
- A07 FE Builder chờ UXUI spec approval trước khi bắt đầu build 9 features còn lại.
- Created draft UXUI spec cho `F-M11-ESC-001` Escalation and Workflow tại `Design/UXUI_Features`.
- Áp dụng Right Drawer layout để giữ context chat log thay vì mở route page mới.
- Đổi status thành Draft do SRS đang In Review.

## Next Actions

- Review/Approve file F-M11 UXUI Spec và các UI Screen trên figma/UI layout.
- Or proceed with another feature.
  **Last Updated**: 2026-04-16
  **Active Workspace Topic**: Operations And Governance — module riêng `/operations` với 5 page P1
  **Current Project**: `MIABOS`
  **Current Phase**: `PB-04 Build (Operations And Governance FE Module)`
  **Latest Canonical Session Log**: [[2026-04-16_MIABOS_Operations_And_Governance_FE_Module_Implementation]]
  **Today's Daily Log**: [[2026-04-16_Daily_Log]]

## Latest Decisions

- `Operations & Governance` đã được materialize thành module riêng với route tree `/operations/escalations`, `/operations/users-roles`, `/operations/scope-rules`, `/operations/integration-ops`, `/operations/source-mapping`.
- Sidebar có group mới `Operations & Governance`, không gộp capability này vào `CRM`, `Catalog`, hay `Orders`.
- Module shell dùng chung search context, quick queries, metrics, tabs và warning model cho 5 page P1.
- `npm exec vite build` pass cho module mới; `npm run build` toàn app chưa rerun và vẫn có blocker cũ ngoài phạm vi tại `src/modules/ai-workspace/pages/InternalAIChatPage.tsx`.

## Next Actions

- Review trực tiếp các route `/operations/*` trong browser.
- Nếu cần, mở work block riêng cho visual polish tiếp theo của `Operations & Governance`.
- Tiếp tục giữ boundary: không sửa `AI Workspace` trừ khi mở task riêng cho blocker build toàn app.
