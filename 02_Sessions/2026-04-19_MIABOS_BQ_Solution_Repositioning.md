# High-Precision Session Log: 2026-04-19 - MIABOS - BQ Solution Repositioning

**Date**: 2026-04-19
**Project**: MIABOS -> [01_Projects/MIABOS/_project.md](../01_Projects/MIABOS/_project.md)
**Related Project**: Giay_BQ -> [01_Projects/Giay_BQ/_project.md](../01_Projects/Giay_BQ/_project.md)
**Phase**: PB-03 Product Design
**Duration**: ~1h
**AI Channel**: Codex CLI
**Model / Environment**: GPT-5.4 Codex environment
**Agent Identity**: A01 PM Agent + A03 BA Agent + A05 Tech Lead Agent -> [A01_PM_Agent.md](../00_Agent_OS/Agents/A01_PM_Agent.md)
**Neural Handshake**: [x] Verified current state against `AGENTS.md`, `Global_Rules.md`, `RUNBOOK_Session_Logging.md`, `Quality_Gates.md`, active BQ requirement pack, latest `_current_context.md`, and project `_project.md`.

---

## Strategic Context

Business Owner provided correction feedback for the BQ solution narrative:

- Differing CTKM under one price policy is BQ's normal operation, not a BQ problem.
- CTKM itself is not a BQ pain point.
- Do not use `HQ`; use BQ / BQ leadership / BQ functional owner language.
- BQ is planning its own Data Warehouse as BQ's source-of-truth for SAP B1, KiotViet, and Haravan data.
- MIABOS must be positioned as a `Core AI CRM Platform`, not BQ's Data Warehouse and not a generic AI operating layer.
- MIABOS does not create operational source data except `Conversation` and `Knowledge`.
- BQ does not use Lark; Lark must not appear as part of BQ operation or solution architecture.
- Timeline must start with BQ internal/content teams before broad rollout.
- BQ problem set must be framed as AI Internal Chatbot, AI External Chatbot for Social + Ecommerce, AI Automation for Accounting/Finance/HR/repetitive workflows, and Forecasting after data readiness.

## Collaborative Deep-Dive

- **BQ requirement pack**: updated README, raw notes, research pack, systems landscape, stakeholder map, discovery questions, proposal structure, and deprecated integration boundary copy with explicit superseding notes.
- **Core positioning**: repositioned MIABOS as Core AI CRM Platform with clear source-boundary against BQ systems and planned BQ Data Warehouse.
- **CTKM correction**: changed active docs from "CTKM pain point" to "CTKM operating data/use case that AI must query by context".
- **No-Lark correction**: removed Lark as a BQ system/workflow destination in active SRS/UXUI/architecture docs and replaced escalation framing with MIABOS Internal Escalation Queue / destination TBD.
- **Source boundary**: renamed active `I05` meaning from Source of Truth ownership to Source Boundary / mapping / priority-rule consumption.
- **Rollout sequence**: aligned project docs to internal/content team first, then external chatbot, automation, and forecasting.
- **Governance rule**: updated KB Rule 41 so future SRS work anchors to BQ Data Warehouse/source-boundary and does not reintroduce Lark or CTKM-as-painpoint framing.

## Artifacts Created/Updated

| Artifact Group | Key Files | Key Change |
|----------------|-----------|------------|
| BQ intake pack | [Giay_BQ README](../04_Raw_Information/Customers/Giay_BQ/README.md), [Customer Research Pack](../04_Raw_Information/Customers/Giay_BQ/2026-04-13_BQ_Customer_Research_Pack.md), [Systems Landscape](../04_Raw_Information/Customers/Giay_BQ/2026-04-13_BQ_Systems_And_Integration_Landscape.md), [Raw Notes](../04_Raw_Information/Customers/Giay_BQ/2026-04-13_BQ_Raw_Notes.md), [Stakeholder Map](../04_Raw_Information/Customers/Giay_BQ/2026-04-13_BQ_Stakeholder_Map.md), [Discovery Questions](../04_Raw_Information/Customers/Giay_BQ/2026-04-13_BQ_Internal_Chatbot_Discovery_Questions.md), [Proposal Structure](../04_Raw_Information/Customers/Giay_BQ/2026-04-13_BQ_Proposal_Structure_And_Team_Assignment.md) | Reframed BQ needs around Core AI CRM, Data Warehouse boundary, no Lark, CTKM not a pain point, internal/content-first rollout. |
| Proposal / brief layer | [Core AI CRM Module And Sitemap Recommendation](../01_Projects/MIABOS/Analysis/Features/Briefs/Portal_CRM_Module_And_Sitemap_Recommendation.md), [SAP B1 Internal Chatbot Integration POC](../01_Projects/MIABOS/Analysis/Features/Briefs/SAP_B1_Internal_Chatbot_Integration_POC.md) | Repositioned from Portal/generic operating layer toward Core AI CRM Platform; clarified POC scope and rollout sequence. |
| Integration layer | [F-I05 Source Boundary SRS](../01_Projects/MIABOS/Analysis/Features/Integration/SRS/F-I05-INT-001_Canonical_Mapping_And_Source_Of_Truth_SRS.md), [SAP Source Spec](../01_Projects/MIABOS/Analysis/Features/Integration/Source_Specs/F-SAP-INT-001_SAP_B1_Internal_Chatbot_Integration_SRS.md), [Haravan Source Spec](../01_Projects/MIABOS/Analysis/Features/Integration/Source_Specs/F-HAR-INT-001_HAR_Internal_Chatbot_Integration_SRS.md), [KiotViet Source Spec](../01_Projects/MIABOS/Analysis/Features/Integration/Source_Specs/F-KV-INT-001_KV_Internal_Chatbot_Integration_SRS.md), [Integration Index](../01_Projects/MIABOS/Analysis/Features/Integration/_index.md) | Clarified BQ/Data Warehouse source ownership and MIABOS consumption/read-model boundary. |
| Business SRS/UXUI | M03 Pricing, M04 Promotion, M05 Order, M07 Access, M08 Knowledge, M09 Internal AI Chat, M11 Escalation, M14 Analytics SRS/UXUI docs | Removed stale CTKM/Lark/HQ framing, added BQ Data Warehouse/source-boundary language, and aligned escalation to MIABOS internal queue/destination TBD. |
| Registries / control plane | [MIABOS Project](../01_Projects/MIABOS/_project.md), [Giay_BQ Project](../01_Projects/Giay_BQ/_project.md), [Feature Registry](../01_Projects/MIABOS/Analysis/Features/_feature_registry.md), [Feature Dependency Map](../01_Projects/MIABOS/Analysis/Features/_feature_dependency_map.md), [Modules Index](../01_Projects/MIABOS/Analysis/Features/Modules/_index.md), [Global Rules](../03_Knowledge_Bank/Global_Rules.md) | Updated canonical direction and future gate rules. |
| Logging | [Daily Log](2026-04-19_Daily_Log.md), [_session_index.md](_session_index.md), [_current_context.md](_current_context.md) | Opened and completed artifact-changing work log chain. |

## Status Decisions

| Decision | Status |
|----------|--------|
| MIABOS positioning | Core AI CRM Platform for BQ |
| BQ source-of-truth | Existing BQ systems + planned BQ Data Warehouse |
| MIABOS-created data | Conversation + Knowledge only, plus AI interaction/audit metadata |
| CTKM framing | Operating data/use case, not pain point |
| Lark | Not part of BQ operation or architecture |
| Rollout | Internal/content teams first, then broader departments/channels |

## Verification

- [x] `rg` audit for stale terms in active docs: `CTKM.*pain`, `pain.*CTKM`, `AI operating layer`, `Data Lark`, `Lark`, `HQ`, `Canonical Mapping and Source of Truth`, `Portal CRM`.
- [x] Remaining `Lark` mentions in scoped docs are either explicit "do not use Lark" clarification, global non-BQ design-system rules, or historical raw/session references.
- [x] Remaining `Portal CRM` mentions are historical file/session names or superseded history notes.
- [x] `git diff --check` passed.
- [x] Scope note: frontend mock code still has old Lark/HQ strings in `Build/Frontend_App/src/mocks/operations/operations.ts`; this session was document-focused and did not change runtime code.

## Business Owner Feedback & Sentiments

> Business Owner yêu cầu sửa lại và enhance các tài liệu liên quan theo 9 feedback points: CTKM không phải pain point, không dùng HQ/Lark, định vị BQ Data Warehouse là source-of-truth, MIABOS là Core AI CRM Platform, MIABOS chỉ tạo Conversation + Knowledge, rollout nội bộ/content trước, và bài toán BQ gồm Internal Chatbot / External Chatbot / Automation / Forecasting.

## Rules Extracted

- Updated existing KB Rule 41 rather than adding a new rule: BQ SRS context must use business needs/use cases, BQ Data Warehouse/source-boundary, no Lark, and no CTKM-as-painpoint framing.

## Next Steps

- Business Owner review the revised Core AI CRM Platform narrative before proposal deck finalization.
- If the FE preview is used for demo next, update `Build/Frontend_App/src/mocks/operations/operations.ts` to remove old Lark/HQ mock labels and align Operations screens with MIABOS Internal Queue / BQ language.
- When writing the final answer pack for BQ, use the 4-layer problem framing: Internal Chatbot, External Chatbot, AI Automation, Forecasting.
