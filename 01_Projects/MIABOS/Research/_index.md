# Research Index — MIABOS

> `01_Projects/MIABOS/Research/` là canonical research layer của project.
> Không tạo research layer song song ở nơi khác.
> Research là input bắt buộc trước khi rewrite canonical `PRD`, `Feature Spec`, hoặc `UX/UI Screen Spec` cho module mới hoặc rewrite lớn, trừ khi PM ghi rõ `waived + reason`.

---

## Canonical Workflow

```
Raw Input
  -> Research Brief
  -> Benchmark Matrix
  -> Research Recommendation
  -> PM / Business Owner Review
  -> APPROVE / WAIVE
  -> Rewrite PRD / Feature / UXUI Screen Specs
```

## Canonical Subfolders

| Folder | Purpose |
|--------|---------|
| [Briefs/](./Briefs/) | Framing câu hỏi nghiên cứu, scope, user/job, decision outputs |
| [Benchmark/](./Benchmark/) | So sánh benchmark thị trường / product patterns |
| [Recommendations/](./Recommendations/) | Kết luận canonical để dẫn PRD / Feature / UXUI |
| Module-specific folders | Research artifacts đã materialize cho từng module/capability |

## Current Registered Research

| Type | Module / Topic | File | Status | Date |
|------|----------------|------|--------|------|
| Recommendation | Knowledge Center — Internal Chatbot Concept | [Knowledge_Center/RES-M08-KNW_Internal_Chatbot_Concept.md](Knowledge_Center/RES-M08-KNW_Internal_Chatbot_Concept.md) | Approved | 2026-04-17 |
| Benchmark | Knowledge Center — Paradigm & Benchmark | [Knowledge_Center/RES-M08-KNW_Paradigm_And_Benchmark.md](Knowledge_Center/RES-M08-KNW_Paradigm_And_Benchmark.md) | Approved | 2026-04-17 |
| Recommendation | Knowledge Center — UX Patterns | [Knowledge_Center/RES-M08-KNW_UX_Patterns_And_IA.md](Knowledge_Center/RES-M08-KNW_UX_Patterns_And_IA.md) | Approved | 2026-04-17 |
| Benchmark / Recommendation | Knowledge Center — Layout & Rich Documents | [Knowledge_Center/RES-M08-KNW_Knowledge_Center_Layout_And_Rich_Document_Research.md](Knowledge_Center/RES-M08-KNW_Knowledge_Center_Layout_And_Rich_Document_Research.md) | Approved | 2026-04-17 |
| Recommendation | BQ AI Training — Brand & Data Readiness | [BQ_AI_Training/RES-BQ-AIT-001_BQ_Brand_And_AI_Training_Data_Research.md](BQ_AI_Training/RES-BQ-AIT-001_BQ_Brand_And_AI_Training_Data_Research.md) | Draft — Pending BO Review | 2026-04-19 |
## Migration Note

- Legacy research documents remain valid if they already contain enough benchmark/recommendation substance for the new process.
- New research work should prefer the `Briefs -> Benchmark -> Recommendations` structure.
- Pilot structured research cho `M01 Product Query` đã bị xóa vì không còn bám front-end source of truth.
