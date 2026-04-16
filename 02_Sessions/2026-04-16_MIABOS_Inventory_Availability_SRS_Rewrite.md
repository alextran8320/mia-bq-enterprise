# Session Log: Inventory Availability SRS Rewrite

**Date**: 2026-04-16
**Project**: MIABOS
**Phase**: PB-02 / PB-03 (`F-M02-INV-001`)
**AI/Channel**: Codex CLI
**Model**: GPT-5 Codex
**Role**: A01 PM Agent / A03 BA Agent
**Session Type**: Artifact-changing work

---

## Trigger

Business Owner yêu cầu cập nhật trực tiếp file SRS `F-M02-INV-001_Inventory_Availability_SRS.md` nằm trong module `Inventory_Availability`.

---

## Work Performed

### 1. Rewrite sạch SRS canonical

- Viết lại toàn bộ nội dung SRS để loại bỏ tình trạng lỗi encoding / ký tự vỡ.
- Giữ cấu trúc section chuẩn của workspace từ `§0` đến `§26`.
- Đưa toàn bộ nội dung về tiếng Việt rõ ràng, nhất quán, đọc được trực tiếp.

### 2. Làm rõ lại semantics và contract nghiệp vụ

- Giữ và làm sạch `Availability Glossary`.
- Làm rõ `Main Flow`, `Alternate Flows`, `Error Flows`, `Business Rules`, `Decision Matrix`.
- Chốt wording nhất quán cho:
  - `available_to_sell_qty`
  - `online_sellable_qty`
  - `quantity_hint`
  - `freshness_level`
  - `unknown / needs confirmation`

### 3. Sửa metadata và dependency note

- Cập nhật `Last Updated By` và `Last Status Change`.
- Ghi rõ trạng thái UXUI hiện tại trong metadata thay vì trỏ như một canonical path đã ổn định.
- Giữ status `Draft` vì các blocker nghiệp vụ cốt lõi vẫn còn mở.

---

## Artifacts Changed

| File | Thay đổi |
|------|----------|
| `01_Projects/MIABOS/Analysis/Features/Modules/Catalog_And_Commerce/Inventory_Availability/SRS/F-M02-INV-001_Inventory_Availability_SRS.md` | Rewritten sạch toàn bộ nội dung, loại bỏ lỗi encoding và làm rõ business/technical contract |
| `02_Sessions/2026-04-16_MIABOS_Inventory_Availability_SRS_Rewrite.md` | New session log |
| `02_Sessions/2026-04-16_Daily_Log.md` | Updated |
| `02_Sessions/_session_index.md` | Updated |
| `02_Sessions/_current_context.md` | Updated |
| `01_Projects/MIABOS/_project.md` | Updated |

---

## Key Decisions

- SRS `F-M02-INV-001` cần được xem là document canonical trong chính module `Inventory_Availability`, không phụ thuộc vào việc file UXUI đã ổn định đường dẫn hay chưa.
- Vấn đề lớn nhất cần sửa ngay là tính đọc được và tính nhất quán của spec, trước cả việc promote status.
- `Inventory Availability` tiếp tục được giữ như một decision layer, không hạ xuống thành màn query tồn đơn thuần.

---

## Status Decisions

- `F-M02-INV-001_Inventory_Availability_SRS.md`: giữ `Draft`

---

## Open Actions

- Chốt canonical availability semantics với BA/PM.
- Chốt realtime/cache-soft matrix theo use case thật của BQ.
- Chốt location hierarchy và dependency `M13 / I06`.
- Sau khi 3 điểm trên rõ, đánh giá lại khả năng promote `F-M02-INV-001` lên `SRS Ready`.
