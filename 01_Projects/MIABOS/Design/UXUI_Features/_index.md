# UXUI Feature Specs Index

**Status**: Approved
**Owner**: A06 UI/UX Agent
**Last Updated By**: Claude Code (claude-sonnet-4-6)
**Last Reviewed By**: A01 PM Agent
**Approval Required**: PM Agent
**Approved By**: A01 PM Agent
**Last Status Change**: 2026-04-17
**Source of Truth**: Legacy index for feature-level UXUI specs kept during migration to screen-based UXUI
**Blocking Reason**: -

---

> **Migration Note (2026-04-21)**: `Design/UXUI_Features/` is now a legacy layer.
> New canonical UX/UI handoff should go to:
> - `Design/Sitemap/`
> - `Design/Flow_Matrix/`
> - `Design/UXUI_Screens/`
>
> Existing files here remain valid as legacy references until each module is migrated.

## Legacy Specs

### AI Workspace — M09 Internal AI Chat

| Feature ID | UXUI Spec | Status | Linked SRS Status | FE Preview Status | Notes |
|------------|-----------|--------|-------------------|-------------------|-------|
| `F-M09-AIC-001` | [UXUI-F-M09-AIC-001_Internal_AI_Chat.md](./UXUI-F-M09-AIC-001_Internal_AI_Chat.md) | Approved | SRS Ready | Ready for Review at `/ai/chat` | Mock/stub only; BE integration blocked |
| `F-M09-AIC-002` | [UXUI-F-M09-AIC-002_AI_Answer_History_And_Trust_Review.md](./UXUI-F-M09-AIC-002_AI_Answer_History_And_Trust_Review.md) | Approved | SRS Ready | Open for A07 FE build | Retention-expired state removed (BO: lưu không thời hạn); TL xem toàn bộ transcript team |
| `F-M09-AIC-003` | [UXUI-F-M09-AIC-003_Escalation_Trigger_And_Human_Handoff.md](./UXUI-F-M09-AIC-003_Escalation_Trigger_And_Human_Handoff.md) | Approved | SRS Ready | Open for A07 FE build | Dual trigger: auto (low confidence) + manual; routing domain-first |

### AI Workspace — M10 Sales Advisor AI

| Feature ID | UXUI Spec | Status | Linked SRS Status | FE Preview Status | Notes |
|------------|-----------|--------|-------------------|-------------------|-------|
| `F-M10-SLS-001` | [UXUI-F-M10-SLS-001_Sales_Advisor_AI.md](./UXUI-F-M10-SLS-001_Sales_Advisor_AI.md) | Approved | SRS Ready | Open for A07 FE Preview | Mock/stub only |
| `F-M10-SLS-002` | [UXUI-F-M10-SLS-002_Suggested_Actions_And_Next_Best_Action.md](./UXUI-F-M10-SLS-002_Suggested_Actions_And_Next_Best_Action.md) | Approved | SRS Ready | Open for A07 FE build | 4 action types chốt; rule-based ranking; max 3 cards |
| `F-M10-SLS-003` | [UXUI-F-M10-SLS-003_Lead_Capture_And_CTA_Handoff.md](./UXUI-F-M10-SLS-003_Lead_Capture_And_CTA_Handoff.md) | Approved | SRS Ready | Open for A07 FE build | 4 CTA types; 1 form chung; routing domain-first |

### Insights and Performance

| Feature ID | UXUI Spec | Status | Linked SRS Status | FE Preview Status | Notes |
|------------|-----------|--------|-------------------|-------------------|-------|
| `F-M12-OBS-001` | [UXUI-F-M12-OBS-001_Audit_And_Observability.md](./UXUI-F-M12-OBS-001_Audit_And_Observability.md) | Approved | SRS Ready | Open for A07 FE build | Bật từ ngày đầu pilot; 4-panel dashboard mock/stub |
| `F-M14-BIZ-001` | [UXUI-F-M14-BIZ-001_Business_Analytics_And_ROI.md](./UXUI-F-M14-BIZ-001_Business_Analytics_And_ROI.md) | Approved | SRS Ready | Ready for Review at `/analytics/executive` | Mock/stub only; production analytics blocked |

### Knowledge Center — M08

| Feature ID | UXUI Spec | Status | Linked SRS Status | FE Preview Status | Notes |
|------------|-----------|--------|-------------------|-------------------|-------|
| `F-M08-KNW-001` | [UXUI-F-M08-KNW-001_Knowledge_And_Policy.md](./UXUI-F-M08-KNW-001_Knowledge_And_Policy.md) | Approved | SRS Ready | Open for A07 FE build | No dual-approval UI (SAP handles); 1-reviewer flow |
| `F-M08-KNW-002` | [UXUI-F-M08-KNW-002_Knowledge_Publishing_Queue.md](./UXUI-F-M08-KNW-002_Knowledge_Publishing_Queue.md) | Approved | SRS Ready | Open for A07 FE build | 1-reviewer queue; SLA timer 1-threshold; diff view UI-only |
| `F-M08-KNW-003` | [UXUI-F-M08-KNW-003_FAQ_And_Policy_Library.md](./UXUI-F-M08-KNW-003_FAQ_And_Policy_Library.md) | Approved | SRS Ready | Open for A07 FE build | Taxonomy: knowledge-topic based; desktop-first; scope filter via badge; includes citation/quick replies/feedback |
| `F-M08-KNW-004` | [UXUI-F-M08-KNW-004_Knowledge_Documents_And_Source_Governance.md](./UXUI-F-M08-KNW-004_Knowledge_Documents_And_Source_Governance.md) | Approved | SRS Ready | Open for A07 FE build | 3 source types (SAP B1/KiotViet/Excel); freshness = 1 giờ cho tất cả |
