# Session Log: Access Control And Sensitivity SRS Refinement

**Date**: 2026-04-16
**Project**: MIABOS
**Phase**: PB-02 / PB-03 Analysis & Product Design (`F-M07-SEC-001`)
**AI/Channel**: Codex CLI
**Model**: GPT-5 Codex
**Role**: A01 PM Agent / A03 BA Agent
**Session Type**: Artifact-changing work

---

## Trigger

Business Owner yêu cầu phân tích sâu và cải thiện trực tiếp SRS `F-M07-SEC-001_Access_Control_And_Sensitivity_SRS.md`.

---

## Work Performed

### 1. Tái định nghĩa phạm vi tài liệu từ high-level sang canonical SRS

- Viết lại metadata và document role để M07 được định vị là lớp `gatekeeper` canonical cho role, scope, sensitivity, masking, và public-safe policy.
- Giữ trạng thái `Draft` nhưng cập nhật blocker đúng thực tế BQ: role matrix, scope dimensions, sensitivity taxonomy, public-safe policy.

### 2. Neo business context chặt hơn vào BQ pack

- Mở rộng `§2 Business Context` theo pain point thật của BQ:
  - retail đa chi nhánh / đa cửa hàng / đa kênh
  - khác biệt giữa cửa hàng chính hãng, đại lý, ecommerce, và vận hành trung tâm
  - dữ liệu phân mảnh giữa `SAP B1`, `KiotViet`, `Haravan`, `Excel`, `Lark`
- Chuyển framing từ “phân quyền kỹ thuật” sang “AI không được trả đúng dữ liệu cho sai người”.

### 3. Làm rõ scope model và runtime decision model

- Nâng `§0B Integration Source Map` để tách:
  - identity source
  - role abstraction authority của MIABOS
  - branch / region / warehouse / store type / channel mapping
  - observability sink và escalation dependency
- Viết lại `§1A`, `§3`, `§4`, `§5`, `§6`, `§7` để mô tả end-to-end flow:
  - resolve actor
  - resolve context scope
  - load requested fields/resource class
  - evaluate scope + sensitivity + public-safe layer
  - trả `allow | mask | summary_only | deny | escalation_only`

### 4. Tăng độ chặt cho role rules, business rules, và technical contracts

- Mở rộng `§10 Role / Permission Rules` theo stakeholder BQ:
  - PM Governance
  - Admin / Ops Governance
  - IT / ERP / data
  - Ban điều hành / vận hành trung tâm
  - Store Manager / Retail Operations
  - CSKH Team Lead
  - Pricing Control / Finance
  - Ecommerce / Omnichannel Lead
  - Dealer / Franchise role
- Mở rộng `§11 Business Rules` với các rule testable:
  - M07 là authority độc lập với role gốc từ external systems
  - default deny nếu thiếu policy mapping
  - public-safe chỉ siết chặt hơn, không nới rộng
  - downstream không được tự projection theo cảm tính
  - escalation/review payload vẫn phải respect sensitivity theo role người nhận
- Mở rộng `§12`, `§13`, `§14`, `§15`, `§16` để materialize API/event/data/validation/error contract sâu hơn.

### 5. Nâng NFR, AC, test, observability lên mức dùng được cho review tiếp theo

- Bổ sung NFR có số liệu cụ thể cho latency, cache invalidation, retention, rollback, dashboard freshness.
- Viết lại AC theo các scenario BQ thực tế:
  - Store Manager ngoài scope
  - Sales hỏi giá nhập
  - CSKH mở transcript có PII
  - public-safe bot hỏi CTKM nội bộ
  - thiếu policy mapping
- Mở rộng test scenarios và observability metrics để M12 có thể consume denied/masked/policy-gap signals.

---

## Artifacts Changed

| File | Thay đổi |
|------|----------|
| `01_Projects/MIABOS/Analysis/Features/Modules/Operations_And_Governance/Access_Control_And_Sensitivity/SRS/F-M07-SEC-001_Access_Control_And_Sensitivity_SRS.md` | Refine sâu business context, scope model, role matrix, flows, business rules, API/data contract, validation, NFR, AC, tests, observability |
| `02_Sessions/2026-04-16_MIABOS_Access_Control_And_Sensitivity_SRS_Refinement.md` | New session log |
| `02_Sessions/2026-04-16_Daily_Log.md` | Added work block |
| `02_Sessions/_session_index.md` | Added session entry |
| `02_Sessions/_current_context.md` | Updated active topic and next actions |
| `01_Projects/MIABOS/_project.md` | Added session timeline entry |

---

## Status Decisions

- `F-M07-SEC-001_Access_Control_And_Sensitivity_SRS.md`: giữ `Draft`.
- Chưa promote sang `SRS Ready` vì các điểm quyết định nghiệp vụ vẫn còn mở:
  - role matrix BQ chưa được chốt chính thức
  - scope dimension cuối cho phase 1 chưa chốt hoàn toàn
  - taxonomy sensitivity và public-safe projection còn cần PM/BO xác nhận

---

## Key Decisions

- M07 phải được hiểu là `runtime access and projection gate`, không chỉ là màn cấu hình quyền.
- Scope cần xét đa chiều theo `branch/store`, `region`, `channel`, `store_type`; không thể chỉ dùng role đơn thuần.
- Action taxonomy canonical cho phase 1 được nâng thành `allow`, `mask`, `summary_only`, `deny`, `escalation_only`.
- Escalation và trust-review payload phải bị re-evaluate theo role người nhận, không reuse quyền của người hỏi ban đầu.
- Public-safe policy là lớp siết thêm sau evaluate nội bộ, không được dùng để mở rộng dữ liệu.

---

## Business Owner Input

- Business Owner yêu cầu: phân tích sâu và cải thiện trực tiếp SRS `F-M07-SEC-001`.
- Không có chỉ đạo promote status; mục tiêu của work block là nâng chất lượng SRS draft để chuẩn bị cho review BA/PM tiếp theo.

---

## Rules Extracted

- Không thêm KB rule mới trong session này.

---

## Open Actions

- Chốt ma trận role BQ theo stakeholder group thật cho pilot phase 1.
- Chốt scope dimensions cuối cùng: có cần `warehouse` riêng hay dừng ở `branch/store/channel/store type`.
- Chốt taxonomy sensitivity và summary projection an toàn theo từng domain.
- Sau khi ba điểm trên rõ, đánh giá lại khả năng promote `F-M07-SEC-001` lên `SRS Ready`.
