# Traceability Matrix

**Status**: Active
**Owner**: A01 PM Agent
**Last Updated By**: Codex CLI (GPT-5.4 Codex environment)
**Last Reviewed By**: A01 PM Agent
**Approval Required**: PM
**Approved By**: A01 PM Agent
**Last Status Change**: 2026-04-21
**Source of Truth**: Traceability chain for `Raw Input -> Research -> PRD -> Feature -> Screens -> Build -> Test`
**Blocking Reason**: -

---

| Feature ID | Raw Input / Source Pack | Research | PRD | Feature | Screens | Build / Review State | Test Mapping | Status |
|------------|--------------------------|----------|-----|---------|---------|----------------------|--------------|--------|
| `F-M01-PRD-001` | BQ pack | Legacy / missing structured research | No canonical PRD active | Legacy SRS | Legacy UXUI feature spec | Front-end exists under `/catalog/*`; PRD rewrite pending | Pending migration | `Pending Migration` |
| `F-M02-INV-001` | BQ pack | Legacy / missing structured research | Legacy PRD linkage indirect | Legacy SRS | Legacy UXUI feature spec | Pending migration | Pending migration | `Pending Migration` |
| `F-M08-KNW-001` | BQ pack | [Research set](../../Research/Knowledge_Center/) | [PRD](../../Planning/PRD/Knowledge_Center/PRD-M08-KNW-001_Knowledge_And_Policy.md) | Legacy SRS | Legacy UXUI feature spec | Pending migration | Pending migration | `Pending Migration` |
| `F-M08-KNW-002` | BQ pack | [Research set](../../Research/Knowledge_Center/) | [PRD](../../Planning/PRD/Knowledge_Center/PRD-M08-KNW-001_Knowledge_And_Policy.md) | Legacy SRS | Legacy UXUI feature spec | Covered as sub-capability inside workspace PRD | Pending migration | `Pending Migration` |
| `F-M08-KNW-003` | BQ pack | [Research set](../../Research/Knowledge_Center/) | [PRD](../../Planning/PRD/Knowledge_Center/PRD-M08-KNW-001_Knowledge_And_Policy.md) | Legacy SRS | Legacy UXUI feature spec | Covered as sub-capability inside workspace PRD | Pending migration | `Pending Migration` |
| `F-M08-KNW-004` | BQ pack | [Research set](../../Research/Knowledge_Center/) | [PRD](../../Planning/PRD/Knowledge_Center/PRD-M08-KNW-001_Knowledge_And_Policy.md) | Legacy SRS | Legacy UXUI feature spec | Covered as sub-capability inside workspace PRD | Pending migration | `Pending Migration` |
| `F-M09-AIC-001` | BQ pack + MOM | [Research set](../../Research/Knowledge_Center/) | [PRD](../../Planning/PRD/AI_Workspace/PRD-M09-AIC-001_Internal_AI_Chat.md) | Legacy SRS | Legacy UXUI feature spec | FE Preview exists at `/ai/chat`; process migration pending | Pending remap | `Pending Migration` |
| `F-M10-SLS-001` | BQ pack | Research partial / needs structured brief | [PRD](../../Planning/PRD/AI_Workspace/PRD-M10-SLS-001_Sales_Advisor_AI.md) | Legacy SRS | Legacy UXUI feature spec | FE Preview planning exists; migration pending | Pending remap | `Pending Migration` |
| `F-M14-BIZ-001` | BQ pack + portal recommendation | Research missing / PM waiver needed | [PRD](../../Planning/PRD/Insights_And_Performance/PRD-M14-BIZ-001_Business_Analytics_And_ROI.md) | Legacy SRS | Legacy UXUI feature spec | FE Preview exists at `/analytics/executive`; migration pending | Pending remap | `Pending Migration` |
