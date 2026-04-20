# Session Log — BQ MOM Meeting 2 Recap

**Date:** 2026-04-20
**Session Type:** Artifact-changing — MOM creation
**AI/Channel:** Claude Code (claude-sonnet-4-6)
**Performed By:** A11 Knowledge Agent (acting) / A01 PM Agent (supervisor)
**Project Touched:** Giày BQ (customer intake)

---

## Trigger

Business Owner (alextran8320) cung cấp raw notes từ buổi gặp thứ 2 với anh Tuấn Anh — Decision Maker phía BQ — và yêu cầu tạo MOM recap đầy đủ không bỏ sót chi tiết.

---

## Artifacts Created / Modified

| File | Action | Notes |
|------|--------|-------|
| `04_Raw_Information/MOM/2026-04-20_BQ_MOM_Meeting2.md` | Created | MOM đầy đủ, 13 sections, không bỏ sót |
| `04_Raw_Information/MOM/_index.md` | Updated | Thêm entry cho MOM mới |
| `02_Sessions/2026-04-20_Daily_Log.md` | Created | Daily log cho ngày 2026-04-20 |
| `02_Sessions/2026-04-20_BQ_MOM_Meeting2_Recap.md` | Created | Session log này |
| `02_Sessions/_session_index.md` | Updated | Thêm entry 2026-04-20 |
| `02_Sessions/_current_context.md` | Updated | Cập nhật context mới nhất |

---

## Key Findings & Decisions Recorded in MOM

### Pivot #1 — Lark Platform (Critical Correction)
- BQ đang dùng **Lark 3 năm** — đây là platform vận hành chính
- Assumption sai từ 2026-04-19 ("BQ không dùng Lark") đã được corrected
- **Impact:** Toàn bộ kiến trúc giải pháp cần được rebuild on top Lark

### Pivot #2 — CRM 360 deprioritized
- CRM 360 không phải ưu tiên — đây là dự án riêng của phòng CNTT BQ
- Phase 3–4 vẫn khả thi nhưng cần tính toán lại

### Pivot #3 — Build ON Lark / SAP
- End user tương tác Bot phải qua Lark hoặc SAP
- Không yêu cầu thêm platform mới

### New Requirements Captured
- Internal Chatbot on Lark: 3 trụ cột (workflow Lark, phân quyền data, AI hình ảnh/content)
- MS SQL integration requirement mới
- Hạ tầng Cloud → migrate Server BQ sau
- Human factor problem cần thiết kế solution
- 2 gói báo giá cần chuẩn bị: Chatbot Nội Bộ + Chatbot Bán Hàng
- Decision signal: anh Tuấn Anh approve → ~60% BGĐ đồng ý

---

## Required Follow-up

1. Update `2026-04-13_BQ_Raw_Notes.md` — xóa bỏ assumption sai về Lark
2. Update `_current_context.md` với pivot mới
3. Re-scope proposal trước buổi tiếp theo với anh Tuấn Anh
4. Chuẩn bị kiến trúc kỹ thuật Lark Bot + MS SQL integration
