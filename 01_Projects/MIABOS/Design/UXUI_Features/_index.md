# UXUI Feature Specs Index

**Status**: Approved
**Owner**: A06 UI/UX Agent
**Last Updated By**: Claude Code (claude-sonnet-4-6)
**Last Reviewed By**: A01 PM Agent
**Approval Required**: PM Agent
**Approved By**: A01 PM Agent
**Last Status Change**: 2026-04-16
**Source of Truth**: Index for feature-level UXUI specs
**Blocking Reason**: -

---

## Specs

### AI Workspace — M09 Internal AI Chat

| Feature ID | UXUI Spec | Status | Linked SRS Status | FE Preview Status | Notes |
|------------|-----------|--------|-------------------|-------------------|-------|
| `F-M09-AIC-001` | [UXUI-F-M09-AIC-001_Internal_AI_Chat.md](./UXUI-F-M09-AIC-001_Internal_AI_Chat.md) | Approved | SRS Ready | Ready for Review at `/ai/chat` | Mock/stub only; BE integration blocked |
| `F-M09-AIC-002` | [UXUI-F-M09-AIC-002_AI_Answer_History_And_Trust_Review.md](./UXUI-F-M09-AIC-002_AI_Answer_History_And_Trust_Review.md) | Draft | SRS Ready | Pending FE build | Mock/stub; screens: history list, detail, review queue, masked state |
| `F-M09-AIC-003` | [UXUI-F-M09-AIC-003_Escalation_Trigger_And_Human_Handoff.md](./UXUI-F-M09-AIC-003_Escalation_Trigger_And_Human_Handoff.md) | Draft | SRS Ready | Pending FE build | Mock/stub; screens: CTA, confirmation modal, escalation detail, unrouted, resolution |

### AI Workspace — M10 Sales Advisor AI

| Feature ID | UXUI Spec | Status | Linked SRS Status | FE Preview Status | Notes |
|------------|-----------|--------|-------------------|-------------------|-------|
| `F-M10-SLS-001` | [UXUI-F-M10-SLS-001_Sales_Advisor_AI.md](./UXUI-F-M10-SLS-001_Sales_Advisor_AI.md) | Approved | SRS Ready | Open for A07 FE Preview | Mock/stub only |
| `F-M10-SLS-002` | [UXUI-F-M10-SLS-002_Suggested_Actions_And_Next_Best_Action.md](./UXUI-F-M10-SLS-002_Suggested_Actions_And_Next_Best_Action.md) | Draft | SRS Ready | Pending FE build | Mock/stub; suggestion panel, accepted/dismissed/expired/blocked states |
| `F-M10-SLS-003` | [UXUI-F-M10-SLS-003_Lead_Capture_And_CTA_Handoff.md](./UXUI-F-M10-SLS-003_Lead_Capture_And_CTA_Handoff.md) | Draft | SRS Ready | Pending FE build | Mock/stub; CTA footer, lead form, duplicate, assigned/pending confirmation |

### Insights and Performance

| Feature ID | UXUI Spec | Status | Linked SRS Status | FE Preview Status | Notes |
|------------|-----------|--------|-------------------|-------------------|-------|
| `F-M12-OBS-001` | [UXUI-F-M12-OBS-001_Audit_And_Observability.md](./UXUI-F-M12-OBS-001_Audit_And_Observability.md) | Draft | SRS Ready | Pending FE build | Mock/stub; dashboard panels: sync health, AI quality, escalation, access denied |
| `F-M14-BIZ-001` | [UXUI-F-M14-BIZ-001_Business_Analytics_And_ROI.md](./UXUI-F-M14-BIZ-001_Business_Analytics_And_ROI.md) | Approved | SRS Ready | Ready for Review at `/analytics/executive` | Mock/stub only; production analytics remains blocked until all FE is complete |

### Knowledge Center — M08

| Feature ID | UXUI Spec | Status | Linked SRS Status | FE Preview Status | Notes |
|------------|-----------|--------|-------------------|-------------------|-------|
| `F-M08-KNW-001` | [UXUI-F-M08-KNW-001_Knowledge_And_Policy.md](./UXUI-F-M08-KNW-001_Knowledge_And_Policy.md) | Draft | SRS Ready | Pending FE build | Mock/stub; knowledge home, create form, document detail, citation panel |
| `F-M08-KNW-002` | [UXUI-F-M08-KNW-002_Knowledge_Publishing_Queue.md](./UXUI-F-M08-KNW-002_Knowledge_Publishing_Queue.md) | Draft | SRS Ready | Pending FE build | Mock/stub; queue list, review detail+diff, approve/reject modal, rollback modal |
| `F-M08-KNW-003` | [UXUI-F-M08-KNW-003_FAQ_And_Policy_Library.md](./UXUI-F-M08-KNW-003_FAQ_And_Policy_Library.md) | Draft | SRS Ready | Pending FE build | Mock/stub; library landing, search results, document detail, no-result, restricted |
| `F-M08-KNW-004` | [UXUI-F-M08-KNW-004_Knowledge_Documents_And_Source_Governance.md](./UXUI-F-M08-KNW-004_Knowledge_Documents_And_Source_Governance.md) | Draft | SRS Ready | Pending FE build | Mock/stub; source registry, freshness board, conflict view, restrict modal |
