# Session Log: MIABOS SRS Process Enhancement

**Date**: 2026-04-15
**AI/Channel**: Claude Code
**Model**: claude-sonnet-4-6
**Agent Role**: A01 PM Agent + A03 BA Agent
**Project**: MIABOS
**Phase**: PB-02 / PB-03
**Session Type**: OS Process Improvement

---

## Mục tiêu

Anh (Business Owner) nhận thấy SRS đang được các AI model tạo ra với chất lượng thấp — content quá ngắn, thiếu BQ-specific context, và thiếu một số fields quan trọng. Yêu cầu: enhance lại quy trình để mọi AI model có thể tạo SRS đúng chuẩn mà không cần nhắc lại.

---

## Phân tích root cause

Ba vấn đề được xác định:

| # | Gap | Vị trí |
|---|---|---|
| G1 | Skill `write-feature-spec` không bắt buộc đọc BQ pack — model tự quyết định có cần context không | `SKILL.md` Step 1 |
| G2 | Template `T-Feature-SRS` không có section "Integration Source Map" — model không biết phải ghi nguồn dữ liệu từ hệ thống nào (SAP B1, KiotViet, Haravan...) | `T-Feature-SRS.md` |
| G3 | Quality Check không enforce content depth — không có rule nào block "§5 < 4 steps", "§17 không có số", "§18 dưới 3 AC" | Cả SKILL.md và template |

Các SRS cụ thể bị ảnh hưởng nặng nhất: `F-M09-AIC-001` (file core M09, yếu nhất), các SRS Knowledge Center (thiếu BQ integration anchor).

---

## Thay đổi đã thực hiện

### 1. `00_Agent_OS/Skills/miabos-product/skills/write-feature-spec/SKILL.md`

- Thêm **Step 1 bắt buộc đọc BQ pack** (Stakeholder Map, Systems & Integration Landscape, Customer Research Pack §3) trước khi mở template
- Thêm note "Không được bỏ qua" để model không tự quyết định skip
- Cập nhật **Step 2** với instruction cụ thể cho từng section cốt lõi (§0B, §2, §5, §10, §11, §12, §14, §17, §18)
- Thêm **Step 3 Validate Content Depth** với 10 checkbox có điều kiện cụ thể
- Cập nhật **Quality Checks** phản ánh đầy đủ depth requirements mới

### 2. `00_Agent_OS/Templates/T-Feature-SRS.md`

- Thêm **§0B Integration Source Map** ngay sau §0 Metadata — table với Data Domain, Source System, Direction, Notes + note về hệ thống BQ
- Thêm **guidance text** vào các section cốt lõi (§2, §3, §4, §5, §6, §7, §8, §9, §10, §11, §12, §14, §17, §18, §22) để model biết cần điền gì và mức độ depth tối thiểu

### 3. `03_Knowledge_Bank/Global_Rules.md`

- Thêm **Rule 41 — SRS BQ Context Anchor Rule**: bắt buộc anchor §2/§10/§0B/§12/§14 vào BQ pack, không eligible UXUI handoff nếu thiếu
- Thêm **Rule 42 — SRS Content Depth Gate**: định nghĩa gate cứng (§5 ≥ 4 steps, §11 ≥ 3 rules testable, §17 có số liệu, §18 ≥ 3 AC) trước khi set SRS Ready

### 4. `AGENTS.md`

- Thêm section **"Khi viết Feature SRS"** vào Quick Start với 9 bước cụ thể — applicable cho mọi AI model đọc file này

---

## Kết quả

Sau enhancement, mọi AI model đọc AGENTS.md → SKILL.md → T-Feature-SRS sẽ có đủ instruction để:
1. Đọc BQ pack trước khi viết (không còn generic)
2. Điền §0B Integration Source Map (không còn thiếu integration context)
3. Biết depth tối thiểu cho từng section (không còn 1-dòng placeholder)
4. Không promote lên SRS Ready khi chưa đủ điều kiện

---

## Next Actions

- Enrich các SRS hiện tại bắt đầu với `F-M09-AIC-001` (file yếu nhất, blocking downstream)
- Sau đó enrich `F-M08-KNW-001..004` và các SRS AI Workspace còn lại
