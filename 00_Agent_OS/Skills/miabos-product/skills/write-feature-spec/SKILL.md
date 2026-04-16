---
name: write-feature-spec
description: "Write Feature SRS following MIABOS T-Feature-SRS template from approved User Stories. Closes business rules, state logic, errors, permissions, and data assumptions before design handoff. Use when BA needs to materialize Feature SRS for in-scope stories."
agent: A03
phase: PB-02 / PB-03
input: "Approved User Story with planning context (problem, trigger, happy path, dependencies, AC)"
output: "Feature SRS document in project Design/Features/ folder"
template: "00_Agent_OS/Templates/T-Feature-SRS.md"
---

# Write Feature SRS

## Purpose

Materialize the Feature SRS — the BA contract that closes enough ambiguity for downstream design (A06) and FE Preview (A07) consumption. The SRS sits between User Story (what the user needs) and UXUI Spec (how it looks).

## Instructions

### Step 1: Read Inputs

1. Đọc **User Story** đã approve — extract: user problem, trigger, happy path, dependencies, AC IDs
2. Đọc **PRD** liên quan để lấy business context và User Task Flow
3. **[BẮT BUỘC — MIABOS/BQ context]** Đọc BQ pack theo thứ tự sau trước khi mở template:
   - [`04_Raw_Information/Customers/Giay_BQ/README.md`](../../../../../04_Raw_Information/Customers/Giay_BQ/README.md) — index pack
   - [`BQ_Stakeholder_Map.md`](../../../../../04_Raw_Information/Customers/Giay_BQ/2026-04-13_BQ_Stakeholder_Map.md) → dùng để anchor §10 Role về phòng ban BQ thật
   - [`BQ_Systems_And_Integration_Landscape.md`](../../../../../04_Raw_Information/Customers/Giay_BQ/2026-04-13_BQ_Systems_And_Integration_Landscape.md) → dùng để anchor §0B Integration Source Map, §12, §14 về hệ thống thật (SAP B1, KiotViet, Haravan, Lark, Excel)
   - [`BQ_Customer_Research_Pack.md`](../../../../../04_Raw_Information/Customers/Giay_BQ/2026-04-13_BQ_Customer_Research_Pack.md) §3 → dùng để anchor §2 Business Context về pain point thật
4. Đọc `database_schema.json` domain map cho các collections liên quan
5. Đọc các analysis artifact hiện có trong `01_Projects/[project]/Analysis/`

> **Không được bỏ qua Step 3.** SRS viết mà không anchor vào BQ pack sẽ bị PM reject là generic draft, không eligible cho UXUI handoff.

### Step 2: Write the Feature SRS

Follow `T-Feature-SRS` template. Các section cốt lõi cần điền đủ:

1. **§0 Metadata** — Feature ID, linked User Story, linked PRD, related screens, APIs, tables, events, error IDs
2. **§0B Integration Source Map** — data đến từ hệ thống nào, chiều Read/Write, notes — **PHẢI điền trước khi viết các section khác**
3. **§1 User Story + §1A User Task Flow** — 4–6 steps với tên actor, action, task type, và notes
4. **§2 Business Context** — anchor vào ít nhất 1 pain point thật từ BQ pack, không được viết generic
5. **§5 Main Flow** — từng bước step-by-step với actor, action, và điều kiện rẽ nhánh
6. **§10 Role / Permission Rules** — map về phòng ban BQ thật từ Stakeholder Map, không chỉ dùng "User nội bộ"
7. **§11 Business Rules** — ít nhất 3 rules testable, mỗi rule có điều kiện cụ thể (tránh dùng "nên" hoặc "phải nhanh")
8. **§12 API Contract** — nhắc rõ integration source (SAP B1 / KiotViet / Haravan / MIABOS internal)
9. **§14 Data / DB Impact** — list ít nhất 2 table cụ thể với vai trò từng table
10. **§17 NFR** — ít nhất 1 số liệu cụ thể (latency target, retention period, hoặc concurrent user estimate)
11. **§18 Acceptance Criteria** — ít nhất 3 statements testable độc lập, không phải summary
12. **§22 Open Questions** — ghi rõ blocker thật nếu có, không để trống
13. **§24–26 Checklists** — điền checkbox với ghi chú blocker cụ thể, không để trống im lặng

### Step 3: Validate Content Depth

Trước khi set status, kiểm tra từng mục sau. Nếu bất kỳ mục nào fail → giữ `Draft`, ghi rõ lý do vào Blocking Reason:

- [ ] **§0B** đã điền Integration Source Map với ít nhất 1 hệ thống external hoặc ghi rõ "MIABOS internal only + lý do"
- [ ] **§2** Business Context nhắc ít nhất 1 pain point thật từ BQ pack (không phải generic description)
- [ ] **§5** Main Flow có ít nhất 4 steps với tên actor và action cụ thể
- [ ] **§10** Role map về phòng ban BQ thật (Ban điều hành / IT/ERP / Vận hành bán lẻ / CSKH / Logistics / Tài chính / Marketing...) — không chỉ dùng role generic
- [ ] **§11** Business Rules có ít nhất 3 rules, mỗi rule testable (có điều kiện "nếu X thì Y", không dùng "nên" hoặc "phải nhanh/ổn định")
- [ ] **§12** API Contract nhắc integration source cụ thể (SAP B1 / KiotViet / Haravan / MIABOS internal)
- [ ] **§14** DB Impact list ít nhất 2 table với vai trò từng table
- [ ] **§17** NFR có ít nhất 1 số liệu đo được (ms, giây, người dùng đồng thời, ngày retention...)
- [ ] **§18** AC có ít nhất 3 statements testable độc lập (không phải 1 câu tổng hợp)
- [ ] **§22** Open Questions ghi rõ câu hỏi thật hoặc ghi "None — tất cả blocker đã được giải quyết"

### Step 4: Set Status

- Tất cả Step 3 checks pass và không có blocking open question → set status `SRS Ready`
- Còn check nào fail hoặc có open question chặn UXUI → set status `Draft`, ghi Blocking Reason cụ thể
- `SRS Ready` là gate cứng: A06 và A05 không được bắt đầu canonical work cho đến khi status này được set

## Quality Checks

- [ ] Đã đọc BQ pack trước khi viết (Step 1 bắt buộc)
- [ ] §0B Integration Source Map đã điền
- [ ] §2 anchor vào pain point thật từ BQ pack
- [ ] §10 Role map về phòng ban BQ thật
- [ ] §11 có ≥ 3 business rules testable
- [ ] §17 có ít nhất 1 số liệu cụ thể
- [ ] §18 có ≥ 3 AC testable độc lập
- [ ] Follow đúng `T-Feature-SRS` template
- [ ] Linked tới User Story và PRD
- [ ] Data model reference collections thật từ database_schema.json
- [ ] Status set đúng (`Draft` hoặc `SRS Ready`) với Blocking Reason nếu Draft
- [ ] Lean đủ để FE Preview nhanh, explicit đủ để không ai phải tự suy đoán behavior
