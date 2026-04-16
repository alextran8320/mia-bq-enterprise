# User Story: US-M10-SLS-001 Sales Advisor AI FE Preview

**Status**: Approved
**Owner**: A03 BA Agent
**Last Updated By**: Codex CLI (GPT-5.4 Codex environment)
**Last Reviewed By**: A01 PM Agent
**Approval Required**: BA Agent + PM Agent
**Approved By**: A01 PM Agent
**Last Status Change**: 2026-04-16
**Source of Truth**: This file for the Sales Advisor AI FE Preview user story and acceptance criteria.
**Blocking Reason**: -

---

## Story Identity

- `Story ID`: US-M10-SLS-001
- `Feature ID`: F-M10-SLS-001
- `Backlog ID`: PBI-M10-SLS-001
- `Epic`: EP-AI-SALES
- `Module`: AI Workspace / Sales Advisor AI
- `Sprint`: FE-Preview-01
- `Owner`: A03 BA Agent
- `Primary Delivery Owner`: A07 FE Builder
- `Linked Subtask Board`: [STB-M10-SLS-001_Sales_Advisor_AI_FE_Preview.md](../../Subtask_Boards/STB-M10-SLS-001_Sales_Advisor_AI_FE_Preview.md)

## User Story

`As a Giày BQ customer, I want an AI advisor to recommend suitable shoes with safe price/promo/availability guidance, so that I can move toward purchase without manually searching multiple channels.`

## User Problem

- Khách không biết mẫu nào hợp nhu cầu, còn hàng hay đang có ưu đãi không.
- BQ cần tư vấn đủ hữu ích nhưng không lộ tồn kho chi tiết, giá nội bộ, hoặc policy chưa public-safe.

## Trigger

- Khách mở website/Zalo/widget tư vấn và nêu nhu cầu mua giày.
- Sales/CSKH cần preview cách AI tư vấn và capture lead trước khi BE integration thật.

## Happy Path

1. Khách mở `/sales-advisor` và nêu nhu cầu hoặc chọn quick reply.
2. AI hỏi 1-3 câu discovery rồi render suggestion card.
3. Khách xem rationale, range giá, availability wording và chọn CTA.
4. Nếu chọn để lại thông tin, inline form tạo lead mock và trả success bubble.

## Scope

### In Scope

- FE Preview route `/sales-advisor`.
- Mock states: welcome, discovery, suggested, low-confidence availability, blocked, no-match, lead-capture, lead-submitted, error.
- Vietnamese copy from UXUI §6.
- Stub payload with `rationale`, `price_band`, `availability_confidence`, `policy_notes`, `cta_options`.

### Out of Scope

- Real API integration.
- Real CRM lead creation.
- Real product image/catalog source.
- Final channel routing and assignment logic.

## Preconditions

- [F-M10-SLS-001 SRS](../../../Analysis/Features/Modules/AI_Workspace/Sales_Advisor_AI/SRS/F-M10-SLS-001_Sales_Advisor_AI_SRS.md) is `SRS Ready`.
- [UXUI-F-M10-SLS-001](../../../Design/UXUI_Features/UXUI-F-M10-SLS-001_Sales_Advisor_AI.md) is `Approved` for FE Preview.
- Subtask Board explicitly allows A07 FE Preview with mock/stub data.

## Acceptance Criteria

| AC ID | Scenario | Given | When | Then |
|-------|----------|-------|------|------|
| AC-M10-001 | Need discovery to suggestion | Khách mở `/sales-advisor` và nêu nhu cầu cơ bản | Khách trả lời tối đa 3 câu discovery | FE Preview hiển thị suggestion card có product name, rationale, price range, availability note, và CTA |
| AC-M10-002 | Sensitive query blocked | Khách hỏi thông tin nhạy cảm như tồn kho chi tiết hoặc giá nội bộ | Hệ thống phân loại query là public-unsafe | FE Preview hiển thị blocked bubble thân thiện và 2 CTA: gặp nhân viên tư vấn, hỏi câu khác |
| AC-M10-003 | Low-confidence availability | Mock payload có `availability_confidence = low` hoặc `medium` | Suggestion card render | UI dùng wording projection mềm, không hiển thị số tồn kho hoặc cam kết chắc chắn |
| AC-M10-004 | Lead capture path | Khách chọn CTA `Để lại thông tin` | Khách nhập tên và số điện thoại hợp lệ | FE Preview hiển thị success bubble và không kết thúc chat thread |
| AC-M10-005 | No backend invention | A07 build preview | Preview cần data | Code dùng mock/stub local, không gọi endpoint thật chưa có Integration Spec |

## Success Hypothesis

- `Primary User Value`: Khách nhận gợi ý sản phẩm rõ ràng trong một flow ngắn.
- `Primary Business Value`: BQ có conversion path reviewable trước khi đầu tư backend integration.
- `Failure Risk If Weak`: Chat trở thành FAQ chung, không tạo lead hoặc rủi ro cam kết sai.

## Feature Metrics

| Metric Type | Metric Name | Formula | Measurement Window | Owner | Notes |
|-------------|-------------|---------|--------------------|-------|------|
| Adoption | Chat started | sessions with first user message | Preview run | A07 | Mock instrumentation note |
| Task Success | Suggestion shown | sessions with suggestion / sessions started | Preview run | A07 | Target: happy path works |
| Business Outcome Proxy | CTA selected | CTA clicks / suggestion shown | Preview run | A07 | Mock only |
| Guardrail | Sensitive query blocked | blocked scenarios pass / blocked scenarios tested | Preview test | A07/A09 | Target: 100% |
| Data Quality | Stub completeness | required fields present / required fields | Build check | A07 | Target: 100% |

## Required Tracking Events

| Event Name | Trigger | Required Properties | Notes |
|------------|---------|---------------------|------|
| `mia.sales.answer.generated` | Suggestion card rendered | `session_id`, `scenario`, `availability_confidence`, `cta_count` | Mock event note only |
| `mia.sales.answer.blocked` | Blocked state rendered | `session_id`, `blocked_reason`, `cta_count` | Mock event note only |
| `mia.lead.created` | Lead form success | `session_id`, `name_present`, `phone_present`, `product_interest` | Mock event note only |

## Delivery Ownership

| Workstream | Primary Agent | Accountable Agent | Notes |
|------------|---------------|-------------------|-------|
| Product / Scope | A02 Product Owner Agent | A01 PM Agent | PRD approved for FE Preview |
| Requirements / AC | A03 BA Agent | A01 PM Agent | SRS Ready |
| Technical Design | A05 Tech Lead Agent | A01 PM Agent | Integration deferred |
| UX / Design Validation | A06 UI/UX Agent | A01 PM Agent | UXUI approved for preview |
| Frontend Build | A07 FE Builder Agent | A01 PM Agent | Build with mock data |
| Backend Build | A08 BE Builder Agent | A01 PM Agent | Out of scope |
| QA / Verification | A09 QA Agent | A01 PM Agent | Visual/build evidence after FE |

## Planned Subtasks

| Subtask ID | Workstream | Description | Primary Agent | Depends On |
|------------|------------|-------------|---------------|------------|
| ST-M10-SLS-001-01 | PM | Confirm readiness and open FE Preview | A01 | - |
| ST-M10-SLS-001-02 | FE | Build `/sales-advisor` preview with mock data | A07 | ST-01 |
| ST-M10-SLS-001-03 | QA/PM | Verify build and runtime evidence; screenshot optional | A01/A09 | ST-02 |

## Linked Artifacts

- Feature SRS: [F-M10-SLS-001_Sales_Advisor_AI_SRS.md](../../../Analysis/Features/Modules/AI_Workspace/Sales_Advisor_AI/SRS/F-M10-SLS-001_Sales_Advisor_AI_SRS.md)
- Design: [UXUI-F-M10-SLS-001_Sales_Advisor_AI.md](../../../Design/UXUI_Features/UXUI-F-M10-SLS-001_Sales_Advisor_AI.md)
- PRD: [PRD-M10-SLS-001_Sales_Advisor_AI.md](../../PRD/AI_Workspace/PRD-M10-SLS-001_Sales_Advisor_AI.md)
- Subtask Board: [STB-M10-SLS-001_Sales_Advisor_AI_FE_Preview.md](../../Subtask_Boards/STB-M10-SLS-001_Sales_Advisor_AI_FE_Preview.md)
- Integration Spec / Architecture: Deferred until after FE Preview review

## Notes

- This story is the direct planning artifact between PRD and FE Preview.
- Backend/integration remains blocked until FE Preview is reviewed and A05 materializes an approved Integration Spec.
