# Feature SRS: F-M08-KNW-001 Knowledge and Policy

**Status**: Draft
**Owner**: A03 BA Agent
**Last Updated By**: Codex CLI (GPT-5 Codex)
**Last Reviewed By**: A01 PM Agent
**Approval Required**: PM
**Approved By**: -
**Last Status Change**: 2026-04-15
**Source of Truth**: This document
**Blocking Reason**: Cần chốt nguồn policy đã duyệt, workflow publish, và approval governance
**Module**: M08
**Phase**: PB-02 / PB-03
**Priority**: High
**Document Role**: SRS high-level cho module Knowledge and Policy của MIABOS

---

## 0. Metadata

- Feature ID: `F-M08-KNW-001`
- Related User Story: `US-M08-KNW-001`
- Related Screens: knowledge index, policy publish workflow, document detail
- Related APIs: `POST /mia/knowledge/query`, `POST /mia/knowledge/publish`
- Related Tables: `knowledge_document_index`, `faq_knowledge_base`
- Related Events: `knowledge.document.published`, `knowledge.document.deprecated`
- Related Error IDs: `KNW-001`

## 1. User Story

Là Sales, CSKH, Operations, hoặc AI chatbot, tôi muốn MIABOS có knowledge/policy layer riêng để giải thích nghiệp vụ và chính sách thay vì chỉ trả dữ liệu thô.

## 1A. User Task Flow

| Step | User Role | Action | Task Type | Notes |
|------|-----------|--------|-----------|-------|
| 1 | Knowledge Owner | Publish hoặc update tài liệu đã duyệt | Configuration | Governance |
| 2 | User / AI | Hỏi SOP / policy / FAQ | Quick Action | Runtime |
| 3 | Hệ thống | Trả lời bằng tài liệu đã được index | Reporting | Trust |

## 2. Business Context

Chính sách đổi trả, SOP, FAQ, policy doanh nghiệp là tri thức riêng MIABOS phải tự sở hữu.

## 3. Preconditions

- Có tài liệu đã duyệt và approval workflow tối thiểu.

## 4. Postconditions

- AI truy xuất được knowledge có governance.

## 5. Main Flow

Publish approved doc -> index -> query -> answer with citation.

## 6. Alternate Flows

Document deprecated hoặc superseded policy.

## 7. Error Flows

Tài liệu chưa duyệt, tài liệu stale, hoặc thiếu index.

## 8. State Machine

`Draft -> In Review -> Approved -> Published -> Deprecated`

## 9. UX / Screen Behavior

Answer phải phân biệt rõ data answer và policy answer.

## 10. Role / Permission Rules

Chỉ knowledge owner mới được publish.

## 11. Business Rules

Chỉ tài liệu đã duyệt mới được index cho chatbot.

## 12. API Contract Excerpt + Canonical Links

Feed `M09` và `M10`.

## 13. Event / Webhook Contract Excerpt + Canonical Links

Phát `knowledge.document.published` và `knowledge.document.deprecated`.

## 14. Data / DB Impact Excerpt + Canonical Links

Quản lý `knowledge_document_index` và `faq_knowledge_base`.

## 15. Validation Rules

Mọi policy answer phải trace về approved document.

## 16. Error Codes

`KNW-001`: Không tìm thấy knowledge approved.

## 17. Non-Functional Requirements

Searchable và versionable.

## 18. Acceptance Criteria

Truy vấn được SOP/policy/FAQ từ lớp knowledge.

## 19. Test Scenarios

Query FAQ, deprecated doc, publish workflow.

## 20. Observability

Theo dõi top missing knowledge intents.

## 21. Rollout / Feature Flag

Mở sớm cùng internal AI chat.

## 22. Open Questions

Owner nào duyệt knowledge theo từng domain?

## 23. Definition of Done

Có knowledge layer dùng được cho phase 1.

## 24. Ready-for-UXUI Checklist

- [ ] UXUI đã chốt knowledge answer / citation pattern

## 25. Ready-for-FE-Preview Checklist

- [ ] FE Preview có mock approved / deprecated docs

## 26. Ready-for-BE / Integration Promotion Checklist

- [ ] BE publish/index contract đã rõ
