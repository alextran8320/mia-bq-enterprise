# Session Log: Inventory Availability Phase1 Rule Closure

**Date**: 2026-04-16
**Project**: MIABOS
**Phase**: PB-03 (`F-M02-INV-001`)
**AI/Channel**: Codex CLI
**Model**: GPT-5 Codex
**Role**: A01 PM Agent / A03 BA Agent
**Session Type**: Artifact-changing work

---

## Trigger

Business Owner yêu cầu làm tiếp trên chính SRS `F-M02-INV-001_Inventory_Availability_SRS.md` để giảm độ mở của spec.

---

## Work Performed

### 1. Chốt tạm bộ rule phase 1 trong SRS

- Thêm rule `quantity_hint` cho safe mode:
  - `hết hàng`: `available_to_sell_qty <= 0`
  - `còn ít`: `available_to_sell_qty = 1-3`
  - `còn hàng`: `available_to_sell_qty >= 4`

### 2. Chốt freshness SLA phase 1

- `KiotViet store-level`: realtime trong request, cache hợp lệ <= `15 phút`
- `Haravan online`: realtime trong request, cache hợp lệ <= `15 phút`
- `SAP B1 warehouse-level`: cache hợp lệ <= `4 giờ`

### 3. Chốt conflict threshold phase 1

- `minor_conflict`: chênh lệch tuyệt đối `1-2`
- `major_conflict`: chênh lệch tuyệt đối `>= 3`
- `major_conflict` buộc downgrade exact answer với các role front-line

### 4. Lan các rule này sang các section liên quan

- `Business Rules`
- `Realtime / Cache Decision Matrix`
- `Validation Rules`
- `Non-Functional Requirements`
- `Acceptance Criteria`
- `Test Scenarios`
- `Ready-for-BE / Integration Promotion Checklist`

---

## Artifacts Changed

| File | Thay đổi |
|------|----------|
| `01_Projects/MIABOS/Analysis/Features/Modules/Catalog_And_Commerce/Inventory_Availability/SRS/F-M02-INV-001_Inventory_Availability_SRS.md` | Added phase-1 rule closure for quantity hint, freshness SLA, and conflict threshold |
| `02_Sessions/2026-04-16_MIABOS_Inventory_Availability_Phase1_Rule_Closure.md` | New session log |
| `02_Sessions/2026-04-16_Daily_Log.md` | Updated |
| `02_Sessions/_session_index.md` | Updated |
| `02_Sessions/_current_context.md` | Updated |
| `01_Projects/MIABOS/_project.md` | Updated |

---

## Key Decisions

- SRS chưa lên `SRS Ready`, nhưng phase 1 nay đã có bộ rule đủ cụ thể để giảm việc downstream tự suy đoán.
- `Freshness SLA` và `conflict threshold` được xem là tạm chốt cho phase 1, chờ BA/PM approve cuối cùng.
- Blocker còn lại tập trung vào canonical semantics cuối cùng và location hierarchy `M13 / I06`.

---

## Open Actions

- Chốt semantic cuối cùng của `available_to_sell_qty` ở tất cả nguồn.
- Chốt location hierarchy cho `branch / store / dealer / region / warehouse`.
- Review lại UXUI để copy safe-mode và conflict-state khớp bộ rule mới.
