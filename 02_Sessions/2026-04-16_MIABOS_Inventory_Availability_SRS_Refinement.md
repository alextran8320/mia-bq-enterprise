# Session Log: Inventory Availability SRS Refinement

**Date**: 2026-04-16
**Project**: MIABOS
**Phase**: PB-02 / PB-03 Analysis & Product Design (`F-M02-INV-001`)
**AI/Channel**: Codex CLI
**Model**: GPT-5 Codex
**Role**: A01 PM Agent / A03 BA Agent
**Session Type**: Artifact-changing work

---

## Trigger

Business Owner yêu cầu phân tích sâu và cải thiện trực tiếp SRS `F-M02-INV-001_Inventory_Availability_SRS.md`.

---

## Work Performed

### 1. Làm rõ semantics của "availability"

- Thêm `§1B Availability Glossary` để tách rõ:
  - `on_hand_qty`
  - `reserved_qty`
  - `available_to_sell_qty`
  - `online_sellable_qty`
  - `transferable_qty`
  - `availability_status`
  - `quantity_hint`
  - `freshness_level`

### 2. Nâng độ chặt cho flow nghiệp vụ

- Mở rộng `§5 Main Flow` để cover:
  - resolve canonical product key
  - check thiếu variant bắt buộc (`size`, `color`)
  - resolve location scope
  - resolve response mode (`internal exact`, `internal summary`, `sales-safe/public-safe`)
  - chọn `realtime` vs `cache-soft`
  - tính confidence / warning / next action hint
- Bổ sung alternate/error flows cho:
  - thiếu variant
  - hỏi ngoài scope quyền
  - Haravan online stock không tương đương store stock

### 3. Materialize policy matrix cho realtime vs cache

- Thêm `§11B Realtime / Cache Decision Matrix`.
- Matrix này tách theo use case thực:
  - bán tại cửa hàng
  - CSKH online
  - logistics cân nhắc điều chuyển
  - regional summary
  - sales advisor external-safe
  - batch query nhiều SKU

### 4. Tăng độ build-ready của contract kỹ thuật

- Mở rộng `§12 API Contract` với input/output chi tiết hơn:
  - `variant_attrs`
  - `request_mode`
  - `allow_fallback`
  - `checked_sources[]`
  - `availability_confidence`
  - `conflict_status`
  - `next_action_hint`
- Viết lại `§14 Data / DB Impact` để làm rõ grain của `inventory_read_model`.
- Bổ sung `inventory_conflict_log` và `location_scope_mapping`.

### 5. Tăng độ chặt cho validation, AC, tests, open questions

- Mở rộng `§15 Validation Rules`, `§17 NFR`, `§18 Acceptance Criteria`, `§19 Test Scenarios`, `§20 Observability`, `§22 Open Questions`.
- Đặc biệt thêm các case:
  - clarifying prompt khi thiếu variant
  - exact qty vs quantity hint
  - stale quá TTL
  - cross-source conflict
  - branch scope deny
  - channel-specific only answer

---

## Artifacts Changed

| File | Thay đổi |
|------|----------|
| `01_Projects/MIABOS/Analysis/Features/Modules/Catalog_And_Commerce/Inventory_Availability/SRS/F-M02-INV-001_Inventory_Availability_SRS.md` | Refine sâu semantics, flow, decision matrix, API/data contract, validation, AC, tests, observability, open questions |
| `02_Sessions/2026-04-16_MIABOS_Inventory_Availability_SRS_Refinement.md` | New session log |
| `02_Sessions/2026-04-16_Daily_Log.md` | Added work block |
| `02_Sessions/_session_index.md` | Added session entry |
| `02_Sessions/_current_context.md` | Updated active topic and next actions |
| `01_Projects/MIABOS/_project.md` | Added session timeline entry |

---

## Status Decisions

- `F-M02-INV-001_Inventory_Availability_SRS.md`: giữ nguyên `Draft`.
- Không promote sang `SRS Ready` vì các blocker nghiệp vụ lớn vẫn còn mở:
  - canonical availability semantics cần BA/PM chốt cuối
  - realtime vs cache-soft matrix cần PM confirm theo use case
  - location hierarchy còn phụ thuộc `M13` / `I06`

---

## Key Decisions

- `Inventory Availability` được định nghĩa là một decision layer, không phải chỉ là màn hình xem tồn.
- `Haravan` chỉ nên authoritative cho `online_sellable_qty` / online channel, không được suy diễn thành tồn tại cửa hàng.
- Sales-safe/public-safe mode phải dùng `quantity_hint`, không dùng exact quantity.
- Query inventory cho sản phẩm variant phải dừng để hỏi rõ `size` / `color` nếu thiếu.
- Khi stale hoặc conflict vượt ngưỡng, answer phải downgrade confidence hoặc trả `unknown / needs confirmation`.

---

## Business Owner Input

- Business Owner yêu cầu: phân tích sâu SRS `F-M02-INV-001` và cải thiện trực tiếp tài liệu.
- Không có chỉ đạo promote status; work block này tập trung vào nâng chất lượng SRS draft để chuẩn bị cho vòng review tiếp theo.

---

## Rules Extracted

- Không thêm KB rule mới trong session này.

---

## Open Actions

- Chốt cuối glossary availability với PM/BA: semantic nào là canonical cho phase 1.
- Chốt ma trận `use case x source x freshness x fallback`.
- Chốt dependency `M13 / I06` cho location hierarchy và branch/channel projection.
- Sau khi ba điểm trên rõ, mới đánh giá lại khả năng promote `F-M02-INV-001` lên `SRS Ready`.
