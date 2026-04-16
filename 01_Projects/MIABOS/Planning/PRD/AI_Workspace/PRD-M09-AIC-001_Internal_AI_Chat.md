# PRD: M09 Internal AI Chat

**Status**: Approved
**Owner**: A02 Product Owner Agent
**Last Updated By**: Codex CLI (GPT-5.4 Codex environment)
**Last Reviewed By**: A01 PM Agent
**Approval Required**: Business Owner / PM Agent
**Approved By**: A01 PM Agent - FE Preview scope confirmed on 2026-04-16
**Last Status Change**: 2026-04-16
**Source of Truth**: This document for Internal AI Chat FE Preview product scope
**Blocking Reason**: -
**Project**: MIABOS
**Module ID**: M09
**Phase**: PB-02 / PB-03
**Priority**: P0
**Products**: MIA Smart
**Created by**: A02 Product Owner Agent
**Date**: 2026-04-16
**Document Role**: Canonical product definition for Internal AI Chat FE Preview scope

---

## 0. Executive Summary

- **What is being proposed**: Hợp thức hóa FE Preview cho Internal AI Chat tại `/ai/chat`, tập trung vào chat shell, answer card, source trace, blocked state, warning, feedback, và escalation CTA bằng mock/stub data.
- **Why now**: Đây là feature phase 1 quan trọng nhất cho BQ vì giải quyết trực tiếp bài toán dữ liệu/policy phân mảnh giữa SAP B1, KiotViet, Haravan, Excel, và tri thức nội bộ.
- **Expected business and user outcome**: Nhân viên nội bộ BQ có thể hỏi bằng tiếng Việt, nhận answer có kết luận, nguồn, freshness, warning, và next action trong một trải nghiệm review được.
- **Recommended decision**: Cho phép review FE Preview bằng mock/stub data; chưa mở backend/integration thật cho đến khi preview được review và technical handoff được approve.

## 1. Business Context

Giày BQ có footprint retail nhiều chi nhánh/kênh và dữ liệu phân mảnh. Phase 1 được khuyến nghị là `chatbot nội bộ + knowledge layer + integration foundation`, vì nhân viên đang cần hỏi nhanh về tồn kho, CTKM, chính sách đổi trả, đơn hàng online, và cách thao tác hệ thống.

## 2. Target Users and Personas

| Persona | Role | Primary Pain | Desired Outcome | Priority |
|---------|------|--------------|-----------------|----------|
| CSKH | Xử lý yêu cầu khách | Phải hỏi nhiều người hoặc mở nhiều hệ thống | Có answer có nguồn và hướng xử lý | P0 |
| Sales / Store Staff | Tư vấn tại cửa hàng | Cần tra tồn/giá/CTKM nhanh | Có thông tin đủ an toàn để tư vấn | P0 |
| Ecommerce / Omnichannel | Xử lý đơn online | Cần biết trạng thái, policy, kênh liên quan | Có mixed answer data + policy | P0 |
| Ban điều hành / Ops | Theo dõi vận hành | Thiếu view thống nhất để hỏi nhanh | Có summary và nguồn rõ | P1 |

## 3. User Task Flow

| Step | Task | Task Type | Success Indicator |
|------|------|-----------|------------------|
| 1 | Mở `/ai/chat` và nhập câu hỏi tự nhiên | Quick Action | Chat shell nhận input |
| 2 | Hệ thống phân loại intent và chạy access check | Guardrail | Có loading state rõ, không dead-end |
| 3 | Hệ thống trả answer card theo `Policy`, `Data`, `Mixed`, hoặc `Blocked` | Quick Action | Answer render trong ≤ 4s |
| 4 | User mở source trace hoặc next action | Trust Check | Source/freshness/warning dễ hiểu |
| 5 | User gửi feedback hoặc tạo escalation nếu cần | Exception Handling | Có lối ra rõ khi answer chưa đủ |

## 4. Scope Boundaries

### In Scope

- FE Preview route `/ai/chat` với mock/stub data.
- States: empty, loading, policy answer, data answer, mixed answer, warning, blocked, source trace, feedback, escalation CTA.
- Copy tiếng Việt theo UXUI.
- Runtime evidence: build pass, route reachable, review note; screenshot optional.

### Out of Scope

- Kết nối backend thật.
- Query thật SAP B1/KiotViet/Haravan.
- Auto escalation thật sang workflow/case.
- Final source-priority rules và production trust scoring.

## 5. Success Metrics

| Goal | KPI / Metric | Target | Source |
|------|--------------|--------|--------|
| Trả lời nhanh | Time to first answer | ≤ 4s cho 95% preview queries | FE/runtime instrumentation |
| Dễ tin | Answer có type/freshness/source visible | 100% answer states | UXUI review |
| Không dead-end | Blocked/unsupported có next action | 100% blocked cases | FE state review |
| Đủ cho review | FE Preview route reviewable | `/ai/chat` reachable | Runtime evidence |

## 6. Release Slice

| Slice | Goal | Included | Excluded | Dependency |
|-------|------|----------|----------|------------|
| FE Preview | Review UX/flow/trust layer | `F-M09-AIC-001` mock/stub | BE/API/real integration | SRS Ready + UXUI Approved + STB |
| Integration | Kết nối source/API thật | Query orchestration, access check, answer snapshot | Open-ended AI automation | FE review + Integration Spec |

## 7. Open Questions

| ID | Question | Blocking? | Owner | Target Resolution |
|----|----------|-----------|-------|------------------|
| OQ-01 | Source priority thật khi SAP B1/KiotViet/Haravan conflict | No for FE Preview; Yes for BE | A05/A03 | Before Build Ready |
| OQ-02 | Threshold production cho low-confidence/escalation | No for FE Preview; Yes for BE | A05/A08 | Before Build Ready |
| OQ-03 | Destination routing cho escalation thật | No for FE Preview; Yes for BE | A05/A08 | Before Build Ready |

## 8. Decision Log

| Date | Decision | Made By | Reason |
|------|----------|---------|--------|
| 2026-04-16 | Mở Internal AI Chat FE Preview bằng mock/stub data | A01 PM | SRS/UXUI đủ scope preview; production integration còn chặn |

## 9. Linked Artifacts

- Feature Registry: [Analysis/Features/_feature_registry.md](../../../Analysis/Features/_feature_registry.md)
- User Story: [US-M09-AIC-001_Internal_AI_Chat.md](../../Stories/AI_Workspace/US-M09-AIC-001_Internal_AI_Chat.md)
- Feature SRS: [F-M09-AIC-001_Internal_AI_Chat_SRS.md](../../../Analysis/Features/Modules/AI_Workspace/Internal_AI_Chat/SRS/F-M09-AIC-001_Internal_AI_Chat_SRS.md)
- UXUI Spec: [UXUI-F-M09-AIC-001_Internal_AI_Chat.md](../../../Design/UXUI_Features/UXUI-F-M09-AIC-001_Internal_AI_Chat.md)
- Subtask Board: [STB-M09-AIC-001_Internal_AI_Chat_FE_Preview.md](../../Subtask_Boards/STB-M09-AIC-001_Internal_AI_Chat_FE_Preview.md)

## 10. Approval Checklist

- [x] Business case is explicit
- [x] Primary personas are identified
- [x] User Task Flow is complete
- [x] In-scope release slice is explicit
- [x] Success metrics are measurable
- [x] Open blockers are explicit and deferred to BE gate where appropriate

