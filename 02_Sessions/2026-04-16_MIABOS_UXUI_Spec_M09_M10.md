# Session Log: UXUI Spec — F-M09-AIC-001 & F-M10-SLS-001

**Date**: 2026-04-16
**AI/Channel**: Claude Code (claude-sonnet-4-6)
**Role**: A01 PM Agent / A06 UI/UX Agent
**Project**: MIABOS / Giay BQ
**Phase**: PB-03 Product Design
**Session Type**: Artifact-Changing Work

---

## Summary

Tạo 2 UXUI Feature Spec đầu tiên cho project Giay BQ, dựa trên SRS F-M09-AIC-001 và F-M10-SLS-001. Đồng thời tạo thư mục `Design/UXUI_Features/` để chứa tất cả UX/UI spec từ đây về sau.

---

## Artifacts Created

| Artifact | Path | Action |
|----------|------|--------|
| UXUI_Features folder | `01_Projects/MIABOS/Design/UXUI_Features/` | Created |
| UXUI Spec — Internal AI Chat | `01_Projects/MIABOS/Design/UXUI_Features/UXUI-F-M09-AIC-001_Internal_AI_Chat.md` | Created — Status: Draft |
| UXUI Spec — Sales Advisor AI | `01_Projects/MIABOS/Design/UXUI_Features/UXUI-F-M10-SLS-001_Sales_Advisor_AI.md` | Created — Status: Draft |

---

## Key Decisions

- Folder canonical cho UXUI Spec: `01_Projects/MIABOS/Design/UXUI_Features/`
- Cả 2 spec ở `Draft` — tương ứng với SRS source vẫn đang `Draft`. Sẽ promote khi SRS promote lên `SRS Ready`.
- **M09 Internal AI Chat** (dành cho nhân viên nội bộ): UI thiên về trust layer rõ ràng — Answer Type Badge (Policy/Data/Mixed/Blocked), Freshness Chip, Warning Badge, Source Trace Panel slide-in. Floating Dock glassmorphism cho input.
- **M10 Sales Advisor AI** (dành cho khách hàng external): UI thiên về conversion — Discovery Quick Reply chips (≤3 lần), Suggestion Card với rationale + range giá + availability wording mềm, CTA Pill, Lead Capture inline form.
- Hai module share: AI Bubble, User Bubble, Floating Dock — component có thể reuse từ `M09` sang `M10`.
- Wording availability `M10` có quy tắc nghiêm: `high/medium/low confidence` map sang ngôn ngữ khác nhau — không cam kết sai.
- Design tokens tất cả từ `Design_System.md` canonical — không import từ Visual_Standards.
- A05 sign-off pending trên cả 2 spec — sẽ thực hiện sau khi SRS promote.

---

## Design Coverage Summary

| Spec | Screens | States | Components chính |
|------|---------|--------|-----------------|
| M09 Internal AI Chat | S1 Chat Shell, S2 Policy, S3 Data, S4 Mixed, S5 Blocked, S6 Source Trace | Loading, Empty, Error, Policy, Data, Mixed, Blocked | Answer Card (3 loại), Floating Dock, Source Trace Panel |
| M10 Sales Advisor AI | S1 Chat Shell, S2 Discovery, S3 Suggestion, S4 Blocked, S5 Lead Capture | Loading, Discovery, Suggested, Blocked, No Match, Lead Capture, Lead Submitted, Error | Suggestion Card, Quick Reply Chips, Lead Form inline |

---

## Open Actions

- [ ] Khi SRS F-M09-AIC-001 promote lên `SRS Ready` → review và promote UXUI spec này
- [ ] Khi SRS F-M10-SLS-001 promote lên `SRS Ready` → review và promote UXUI spec này
- [ ] A05 Tech Lead cross-check cả 2 spec — điền Section 9 của mỗi file
- [ ] Tạo mockup photorealistic cho S1/S3/S4/S5 của M09 và S1/S3/S4 của M10 khi cần visual sign-off
