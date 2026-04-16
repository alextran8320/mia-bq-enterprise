# Session Log: MIABOS Catalog & Commerce SRS Audit

**Date**: 2026-04-17
**Topic**: Audit và chuẩn hóa tài liệu module Catalog_And_Commerce (M01–M04)
**AI Channel**: Claude (Antigravity / claude-sonnet-4-6)
**Project**: MIABOS / Giày BQ
**Phase**: PB-02 / PB-03
**Trigger**: Business Owner yêu cầu kiểm tra xem tài liệu Catalog_And_Commerce đã đủ và chuẩn chưa

---

## Objective

Audit đầy đủ 4 SRS của nhóm Catalog & Commerce, đối chiếu với:
- Template `T-Feature-SRS.md`
- Global Rules 41 (BQ Context Anchor) và 42 (SRS Content Depth Gate)
- Quality Gate 3 (Feature Registry & Traceability Matrix requirement)
- BQ Requirement Pack (`04_Raw_Information/Customers/Giay_BQ/`)

---

## Gaps Phát Hiện

| # | Gap | File bị ảnh hưởng | Rule vi phạm |
|---|---|---|---|
| G1 | Thiếu field `Related PRD` trong §0 Metadata | Cả 4 SRS | Template §0 |
| G2 | §24 Checklist không theo template chuẩn — 1 item generic thay vì 7 items | Cả 4 SRS | Template §24 |
| G3 | §25 Checklist không theo template chuẩn — 1 item generic thay vì 5 items | Cả 4 SRS | Template §25 |
| G4 | §26 Checklist không theo template chuẩn — 1 item generic thay vì 6 items | Cả 4 SRS | Template §26 |
| G5 | `_index.md` sơ sài — thiếu status, SRS link, traceability | _index.md | Rule 39 |
| G6 | Không có Feature Registry / Traceability Matrix | Module level | Gate 3 |
| G7 | §1A User Task Flow chỉ 3 steps và dùng "Hệ thống" là actor thay vì user role thực | Cả 4 SRS | Rule 32, Gate 4B |
| G8 | §19 Test Scenarios và §20 Observability quá ngắn (1 dòng generic) | Cả 4 SRS | Chất lượng nội dung |
| G9 | Related Error IDs trong §0 thiếu ERR-002/003 đã được define ở §16 | Cả 4 SRS | Internal consistency |

---

## Hành Động Thực Hiện

### SRS Files (cả 4 files):

1. **§0 Metadata**: Thêm `Related PRD: PRD-MIABOS-BQ-Phase1`, bổ sung đủ error IDs từ §16
2. **§1A User Task Flow**: Mở rộng từ 3 steps lên 5 steps, thay "Hệ thống" bằng user role thực (Sales, CSKH, Logistics, Tài chính, Marketing)
3. **§19 Test Scenarios**: Thay 1 dòng bằng bảng 7 test scenarios cụ thể với input/expected output rõ ràng
4. **§20 Observability**: Thay 1 dòng bằng 6 metrics cụ thể (metric name, ý nghĩa, trigger alert)
5. **§24 Ready-for-UXUI Checklist**: Replace bằng 7-item checklist chuẩn từ template
6. **§25 Ready-for-FE-Preview Checklist**: Replace bằng 5-item checklist chuẩn từ template
7. **§26 Ready-for-BE/Integration Checklist**: Replace bằng 6-item checklist chuẩn từ template

### Artifact mới tạo:

- **`Feature_Registry.md`**: Tạo mới — Feature Registry đầy đủ với traceability matrix, integration dependencies, gate status, và open questions
- **`_index.md`**: Nâng cấp hoàn toàn từ 13 dòng sơ sài → đầy đủ với SRS status table, cross-module dependencies, BQ coverage, và next actions

---

## Điểm Vẫn Cần Business Owner Chốt (để promote SRS sang SRS Ready)

| # | Feature | Question |
|---|---|---|
| OQ-M01-01 | F-M01-PRD-001 | Bộ field nào public-safe theo từng channel? |
| OQ-M02-01 | F-M02-INV-001 | Freshness threshold theo từng nguồn và từng channel? |
| OQ-M03-01 | F-M03-PRC-001 | Source owner cuối cùng của giá theo từng channel? |
| OQ-M04-01 | F-M04-PRO-001 | Owner cuối của CTKM theo từng channel? |

---

## Trạng Thái Sau Session

| Feature | Trạng Thái | Rule 41 ✓ | Rule 42 ✓ | Gate 3 Ready |
|---|---|---|---|---|
| F-M01-PRD-001 | Draft (Blocked) | ✅ | ✅ | ⏳ Chờ OQ-M01-01 |
| F-M02-INV-001 | Draft (Blocked) | ✅ | ✅ | ⏳ Chờ OQ-M02-01 |
| F-M03-PRC-001 | Draft (Blocked) | ✅ | ✅ | ⏳ Chờ OQ-M03-01 |
| F-M04-PRO-001 | Draft (Blocked) | ✅ | ✅ | ⏳ Chờ OQ-M04-01 |

---

## Artifact Changes

| File | Action |
|---|---|
| F-M01-PRD-001_Product_SRS.md | UPDATED — G1/G2/G3/G4/G7/G8/G9 |
| F-M02-INV-001_Inventory_Availability_SRS.md | UPDATED — G1/G2/G3/G4/G7/G8/G9 |
| F-M03-PRC-001_Pricing_SRS.md | UPDATED — G1/G2/G3/G4/G7/G8/G9 |
| F-M04-PRO-001_Promotion_SRS.md | UPDATED — G1/G2/G3/G4/G7/G8/G9 |
| Catalog_And_Commerce/_index.md | UPDATED (major overhaul) — G5 |
| Catalog_And_Commerce/Feature_Registry.md | CREATED — G6 |

---

_Session logged by: Claude (Antigravity / claude-sonnet-4-6)_
