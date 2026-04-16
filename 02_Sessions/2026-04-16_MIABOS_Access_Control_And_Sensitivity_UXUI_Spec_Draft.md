# Session Log: Access Control And Sensitivity UXUI Spec Draft

**Date**: 2026-04-16
**Project**: MIABOS
**Phase**: PB-03 Product Design (`F-M07-SEC-001`)
**AI/Channel**: Codex CLI
**Model**: GPT-5 Codex
**Role**: A06 UI/UX Agent / A01 PM Agent
**Session Type**: Artifact-changing work

---

## Trigger

Business Owner yêu cầu tạo UXUI doc cho tính năng `Access_Control_And_Sensitivity` và lưu file trong `01_Projects/MIABOS/Design/UXUI_Features`.

---

## Work Performed

### 1. Materialize canonical UXUI artifact ở lớp Design

- Tạo file `UXUI-F-M07-SEC-001_Access_Control_And_Sensitivity.md` trong `Design/UXUI_Features/`.
- Giữ tài liệu ở trạng thái `Draft UX Contract` vì linked SRS `F-M07-SEC-001` hiện vẫn là `Draft`.

### 2. Thiết kế lại feature theo hướng job-based governance UI

- Định nghĩa dominant route là `/governance/phan-quyen-du-lieu`.
- Tránh biến màn hình thành UI kỹ thuật thuần JSON/debug; framing chính là:
  - quản lý hồ sơ quyền
  - quản lý quy tắc độ nhạy
  - mô phỏng kết quả truy cập

### 3. Hoàn thành 5 behavioral sections bắt buộc

- Viết `§0 User & Task` cho các vai trò `PM Governance`, `Admin / Ops Governance`, `IT / ERP / data`, `Team Lead vận hành`.
- Viết `§2.1 Task Flow` với 7 bước và đủ ba interaction patterns:
  - Quick Action
  - Exception Handling
  - Bulk Operation = N/A + reason
- Viết `§5.1 Error & Recovery` cho các tình huống:
  - không tải được hồ sơ quyền
  - scope profile xung đột
  - thiếu mapping độ nhạy
  - mô phỏng thiếu context
  - outcome bị deny / escalation_only
- Viết `§6 UI Copy Glossary` để thay các term kỹ thuật như `role profile`, `scope profile`, `summary projection`, `policy gap`.
- Chốt route declaration theo nguyên tắc một route một dominant goal.

### 4. Đồng bộ UX contract với SRS M07 và Design System

- UXUI bám sát decision taxonomy mới của M07:
  - `allow`
  - `mask`
  - `summary_only`
  - `deny`
  - `escalation_only`
- Bổ sung screen/state inventory cho:
  - trung tâm phân quyền dữ liệu
  - chi tiết hồ sơ quyền
  - thư viện quy tắc độ nhạy
  - mô phỏng kết quả truy cập
  - runtime blocked/masked reference state
- Dùng design tokens và layout direction từ `Aura_Minimalist_Design_System`.

---

## Artifacts Changed

| File | Thay đổi |
|------|----------|
| `01_Projects/MIABOS/Design/UXUI_Features/UXUI-F-M07-SEC-001_Access_Control_And_Sensitivity.md` | New draft UXUI feature spec |
| `02_Sessions/2026-04-16_MIABOS_Access_Control_And_Sensitivity_UXUI_Spec_Draft.md` | New session log |
| `02_Sessions/2026-04-16_Daily_Log.md` | Added work block |
| `02_Sessions/_session_index.md` | Added session entry |
| `02_Sessions/_current_context.md` | Updated active topic and next actions |
| `01_Projects/MIABOS/_project.md` | Added session timeline entry |

---

## Status Decisions

- `UXUI-F-M07-SEC-001_Access_Control_And_Sensitivity.md`: `Draft`
- Chưa promote lên `In Review` hay `Approved` vì:
  - linked SRS chưa đạt `SRS Ready`
  - role matrix, scope matrix, sensitivity taxonomy của BQ vẫn còn blocker

---

## Key Decisions

- UX của M07 phải là `governance workspace`, không phải màn debug thuần kỹ thuật.
- Route chính tập trung vào một công việc: quản lý và mô phỏng quyền truy cập dữ liệu.
- `Mô phỏng kết quả truy cập` là thành phần UX bắt buộc để PM/Ops hiểu tác động policy trước khi publish.
- Runtime states `mask`, `summary_only`, `deny`, `escalation_only` phải có ngôn ngữ vận hành rõ để downstream modules reuse nhất quán.

---

## Open Actions

- Review PM/BA cho route và IA của M07.
- Chốt role matrix, scope dimensions, và sensitivity taxonomy để UXUI có thể move lên `In Review`.
- Nếu tiếp tục PB-03, bước kế tiếp là tạo visual authority/mockup fidelity cho S1-S6 và sync lại với A05 trước FE handoff.
