# MIABOS Planning Index

**Status**: Draft
**Owner**: A01 PM Agent
**Last Updated By**: Codex CLI (GPT-5 Codex)
**Last Reviewed By**: A01 PM Agent
**Approval Required**: PM
**Approved By**: -
**Last Status Change**: 2026-04-15
**Source of Truth**: Entry point for project planning artifacts
**Blocking Reason**: Chưa materialize backlog và user stories; hiện mới mở lớp PRD cho Knowledge Center

---

## Purpose

Folder này chứa các planning artifacts của project `MIABOS`, trả lời câu hỏi `what ships when`, `release slice nào đi trước`, và `dependency nào cần chốt` trước khi sang design / build.

## Current Structure

| Folder | Purpose | Status |
|--------|---------|--------|
| [`PRD/Knowledge_Center/`](./PRD/Knowledge_Center/_index.md) | Bộ PRD cho surface `Knowledge_Center` | Draft |

## Operating Notes

- `Planning/` là lớp product planning do `A02 Product Owner Agent` dẫn dắt, nhưng được PM mở và kiểm soát gate.
- PRD không thay thế `Feature SRS`; PRD trả lời `why / for whom / outcome`, còn SRS trả lời `behavior / rules / states`.
- Bước tiếp theo hợp lệ sau PRD là `Product Backlog -> Sprint Backlog -> User Story`, không nhảy cóc thẳng sang build.
