# Current Active Context

**Last Updated**: 2026-04-15
**Active Workspace Topic**: MIABOS modules regrouped by Portal CRM product surfaces
**Current Project**: `MIABOS`
**Current Phase**: `PB-03 / Operational Governance`
**Latest Canonical Session Log**: [[2026-04-15_MIABOS_Module_Surface_Restructuring]]
**Today's Daily Log**: [[2026-04-15_Daily_Log]]

## Latest Decisions

- `Analysis/Features` đã được tái cấu trúc thành 2 lớp chính: `Integration` và `Modules`.
- 3 tài liệu `SAP / Haravan / KiotViet` giờ nằm dưới `Integration/Source_Specs/` và được xem là source specs theo hệ ngoài.
- MIABOS hiện có 5 `Integration SRS` (`I01..I05`) và 12 `Business Module SRS` (`M01..M12`) ở mức high-level, đồng bộ qua `Feature Registry`, `Traceability Matrix`, và `Feature Dependency Map`.
- Bộ SRS business modules đã được chuẩn hóa đủ 26 section theo `T-Feature-SRS`.
- Portal CRM recommendation đã chốt rõ bộ module cần giữ, bộ module cần bổ sung (`I06`, `M13`, `M14`), và sitemap theo các product surfaces.
- Lớp `Modules/` hiện đã được regroup thực tế theo 7 product surfaces của Portal CRM; `Feature Registry` và `Traceability Matrix` có thêm cột `Portal Surface`.

## Next Actions

- Nếu Business Owner duyệt, materialize `I06`, `M13`, `M14` thành SRS riêng.
- Chuyển sitemap recommendation thành `Portal IA / UXUI Spec`.
- Nếu cần, bổ sung thêm `Feature Dependency Map` ở góc nhìn product surfaces / portal navigation.
- Nếu cần đi sâu hơn, break tiếp từng module `M01..M12` thành API / Data Mapping / UXUI packs.
- Nếu Business Owner muốn, xử lý tiếp nhánh `main` so với `origin/main` ở work block riêng.
