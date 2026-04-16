# Subtask Board — STB-M09-AIC-001 Internal AI Chat FE Preview

**Status**: In Review
**Owner**: A01 PM Agent
**Last Updated By**: Codex CLI (GPT-5.4 Codex environment)
**Last Reviewed By**: A01 PM Agent
**Approval Required**: Business Owner / PM
**Approved By**: -
**Last Status Change**: 2026-04-16
**Source of Truth**: Execution board for the `F-M09-AIC-001 Internal AI Chat` FE preview slice.
**Blocking Reason**: Business Owner review vòng 1 đã ghi nhận 3 gap UX/interaction; FE preview đang được chỉnh và chờ re-review.

---

## Parent Context

- `Story ID`: `US-M09-AIC-001`
- `Feature ID`: `F-M09-AIC-001`
- `Backlog ID`: `PBI-M09-AIC-001`
- `Module`: `M09 AI Workspace`
- `Related Feature SRS`: [`../../Analysis/Features/Modules/AI_Workspace/Internal_AI_Chat/SRS/F-M09-AIC-001_Internal_AI_Chat_SRS.md`](../../Analysis/Features/Modules/AI_Workspace/Internal_AI_Chat/SRS/F-M09-AIC-001_Internal_AI_Chat_SRS.md)
- `Related UXUI Spec`: [`../../Design/UXUI_Features/UXUI-F-M09-AIC-001_Internal_AI_Chat.md`](../../Design/UXUI_Features/UXUI-F-M09-AIC-001_Internal_AI_Chat.md)
- `Related FE Preview`: [`../../Build/Frontend_App/src/modules/ai-workspace/pages/InternalAIChatPage.tsx`](../../Build/Frontend_App/src/modules/ai-workspace/pages/InternalAIChatPage.tsx)
- `Route`: `/ai/chat`
- `Evidence`: `npm run build` pass, `/ai/chat` HTTP 200, browser/runtime verification notes; screenshot is optional supporting evidence only.
- `Story Summary`: Nhân viên nội bộ BQ hỏi MIABOS bằng tiếng Việt và nhận answer card có nguồn, freshness, warning, và next action từ mock data.
- `Requirement Clarification Status`: `Clear for FE Preview / BE integration deferred`

## Confirmed Decisions

- Business Owner requested continuing the FE preview repair plan on 2026-04-16.
- Current FE preview is mock/stub only; it must not invent or call real backend endpoints.
- Reviewable route is `http://127.0.0.1:5173/ai/chat` when the Vite dev server is running.
- `npm run build` passes when running under Node `v20.10.0`.

## Open Questions That MUST Be Confirmed Before Backend / Production Integration

- Intent taxonomy phase 1: exact labels and routing priority for `Policy`, `Data`, `Mixed`, `Blocked`, `Unsupported`.
- Query routing matrix: which source wins when `SAP B1`, `KiotViet`, and `Haravan` conflict.
- Escalation threshold: when to create a human handoff instead of showing an answer.
- Trust UI contract: which freshness/trust/warning labels are final for Business Owner review.
- PRD/User Story layer for `M09 AI Workspace` has been materialized for FE Preview scope.

## Key Constraints

- FE preview may use local mock data only.
- No real endpoint integration is allowed before `Integration Spec` or approved split technical handoff exists.
- User-facing copy must remain Vietnamese and operational, not system-code-heavy.
- SRS is `SRS Ready` and UXUI is `Approved` for FE Preview. Production integration remains blocked until review + technical handoff.

## Release Rule

FE preview may be reviewed by PM / Business Owner as a mock implementation. BE/integration remains blocked until FE preview review is complete, behavior-changing feedback is folded back into SRS/UXUI, `Feature SRS = Build Ready`, and technical handoff is approved.

---

## Subtask Board Summary

| Subtask ID        | Workstream  | Title                                       | Primary Agent | Consulted Agents | Depends On             | Output Artifact            | Status           | Blocking Reason                                                 |
| ----------------- | ----------- | ------------------------------------------- | ------------- | ---------------- | ---------------------- | -------------------------- | ---------------- | --------------------------------------------------------------- |
| ST-M09-AIC-001-01 | PM          | Confirm gate and missing planning artifacts | A01           | A02, A03         | -                      | PRD/story/STB/backlog sync | Done             | -                                                               |
| ST-M09-AIC-001-02 | BA          | Confirm SRS readiness                       | A03           | A01              | ST-M09-AIC-001-01      | Feature SRS                | Done             | -                                                               |
| ST-M09-AIC-001-03 | UX          | Confirm UXUI readiness                      | A06           | A01, A03         | ST-M09-AIC-001-02      | UXUI spec                  | Done             | -                                                               |
| ST-M09-AIC-001-04 | FE          | Repair and verify FE preview                | A07           | A01              | Business Owner request | `/ai/chat` preview         | Ready for Review | Mock-only preview; no backend integration                       |
| ST-M09-AIC-001-05 | PM / Review | Business Owner review of FE preview         | A01           | A06, A07         | ST-M09-AIC-001-04      | Review decision            | In Progress      | Review vòng 1 đã có feedback; cần re-review sau bản vá          |
| ST-M09-AIC-001-06 | Tech Lead   | Integration handoff                         | A05           | A03, A06         | ST-M09-AIC-001-05      | Integration Spec           | Blocked          | Requires reviewed FE preview and SRS promotion to `Build Ready` |
| ST-M09-AIC-001-07 | BE/FE       | Real integration                            | A08 / A07     | A05              | ST-M09-AIC-001-06      | Integrated build           | Blocked          | No approved technical handoff                                   |

---

## ST-M09-AIC-001-04 · FE · Repair and Verify FE Preview

**Role**: A07 FE Builder — preview implementation with mock/stub data  
**Status**: `Ready for Review`  
**Depends On**: Business Owner request to continue FE preview repair

### Objective

Make the Internal AI Chat FE preview buildable and reviewable at `/ai/chat` without changing product behavior or connecting real backend endpoints.

### Confirmed Inputs

- Route is `/ai/chat`.
- Preview implementation file: [`../../Build/Frontend_App/src/modules/ai-workspace/pages/InternalAIChatPage.tsx`](../../Build/Frontend_App/src/modules/ai-workspace/pages/InternalAIChatPage.tsx)
- Mock scenario file: [`../../Build/Frontend_App/src/mocks/ai-workspace/internalChat.ts`](../../Build/Frontend_App/src/mocks/ai-workspace/internalChat.ts)
- UXUI status is `Approved` for FE Preview; this remains mock-only, not production integration approval.

### Production Clarifications

- Final production thresholds and source-priority conflict rules remain open for Integration Spec.
- No backend API contract is approved for real integration.

### In Scope

- Fix TypeScript/build blocker.
- Keep preview behavior and mock data intact.
- Add local ignore rule for generated `*.tsbuildinfo`.
- Save runtime evidence for review; screenshot capture is optional unless PM or Business Owner explicitly requests it.

### Out of Scope

- Do not promote SRS to `Build Ready`.
- Do not create real API calls.
- Do not change backend or Directus configuration.
- Do not make Business Owner approval decisions.

### Write Scope

- `01_Projects/MIABOS/Build/Frontend_App/src/modules/ai-workspace/pages/InternalAIChatPage.tsx`
- `01_Projects/MIABOS/Build/Frontend_App/.gitignore`
- This subtask board and required session logs.

### Read First

| File                                                                                                                                                                                                                 | What to look for                               |
| -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------- |
| [`../../Design/UXUI_Features/UXUI-F-M09-AIC-001_Internal_AI_Chat.md`](../../Design/UXUI_Features/UXUI-F-M09-AIC-001_Internal_AI_Chat.md)                                                                             | Intended layout, task flow, answer-card states |
| [`../../Analysis/Features/Modules/AI_Workspace/Internal_AI_Chat/SRS/F-M09-AIC-001_Internal_AI_Chat_SRS.md`](../../Analysis/Features/Modules/AI_Workspace/Internal_AI_Chat/SRS/F-M09-AIC-001_Internal_AI_Chat_SRS.md) | `SRS Ready` behavior baseline for FE Preview   |
| [`../../Build/Frontend_App/package.json`](../../Build/Frontend_App/package.json)                                                                                                                                     | Build/dev scripts                              |

### Execution Steps Completed

1. Replaced `assistantEntries.at(-1)` with `assistantEntries[assistantEntries.length - 1]` to stay compatible with current `ES2020` lib target.
2. Added `*.tsbuildinfo` to front-end `.gitignore` because `tsc -b` creates this cache file.
3. Ran production build with Node `v20.10.0`: `npm run build` passed.
4. Started Vite dev server with Node `v20.10.0`: `http://127.0.0.1:5173/`.
5. Verified `/ai/chat` returns HTTP `200`.
6. Saved runtime evidence: production build passed, Vite route `/ai/chat` returned HTTP 200, and preview is reviewable in browser. Any screenshot artifact is optional support, not a gate requirement.
7. Removed product copy `mock — đang trong quá trình xây dựng` khỏi UI chính.
8. Converted `next actions`, `Câu hỏi gần nhất`, và `Trợ lý có thể giúp gì` thành interaction có thể click.
9. Added `Lịch sử hỏi đáp nội bộ` panel trong FE preview để xem lại các câu đã hỏi trong phiên và nhảy lại answer.

### Do Not Assume

- Do not assume FE preview is production-ready.
- SRS/UXUI đã approved cho FE preview, nhưng chưa phải approval cho production integration.
- Do not assume current mock copy is final.
- Do not assume backend endpoints exist.

### Evidence Required

- `npm run build` pass log.
- `/ai/chat` HTTP `200` check.
- Runtime evidence: build pass log, route HTTP 200 check, and review URL. Screenshot optional unless requested.
- Business Owner review decision in ST-M09-AIC-001-05.

### Escalate When

- Business Owner rejects the visual direction.
- Any feedback changes answer taxonomy, source trust rules, or escalation behavior.
- Backend integration is requested before `Integration Spec` approval.

### Done When

- [x] Build passes under Node `v20.10.0`.
- [x] `/ai/chat` route is reachable.
- [x] Runtime evidence is captured; screenshot optional.
- [ ] Business Owner reviews and marks preview `Approved / Needs Changes / Blocked`.

---

## ST-M09-AIC-001-05 · PM / Review · Business Owner Review

**Role**: A01 PM Agent — review orchestration and gate control  
**Status**: `In Progress`  
**Depends On**: ST-M09-AIC-001-04

### Objective

Review the mock FE preview with Business Owner and capture the decision before any backend or production integration work starts.

### Review URL

- `http://127.0.0.1:5173/ai/chat`

### Review Checklist

- [ ] Layout is acceptable for internal BQ user review.
- [ ] Main empty state and prompt chips are clear.
- [ ] Answer-card states are acceptable: `Policy`, `Data`, `Mixed`, `Blocked`, `Unsupported`.
- [ ] Source trace panel behavior is acceptable.
- [ ] Copy tone is Vietnamese, operational, and understandable.
- [x] Không còn copy `mock/đang xây dựng` trong màn hình chính.
- [x] Các thành phần `Câu hỏi gần nhất` và `Trợ lý có thể giúp gì` đều clickable.
- [x] Có panel `Lịch sử hỏi đáp nội bộ` để truy cập lại các câu đã hỏi trong phiên.
- [ ] Business Owner decides: `Approved / Needs Changes / Blocked`.

### Business Owner Review Notes (2026-04-16 - Round 1)

- Không muốn hiển thị copy kiểu `mock — đang trong quá trình xây dựng`.
- Một số khu vực chưa click được (`Câu hỏi gần nhất`, `Trợ lý có thể giúp gì`, một số action trong answer card).
- Giao diện còn đơn giản, thiếu `Lịch sử đã hỏi đáp nội bộ`.

### FE Patch Notes (2026-04-16 - After Round 1)

- Đã bỏ copy `mock/đang xây dựng` ở mô tả chính.
- Đã mở click interaction cho `Câu hỏi gần nhất`, `Trợ lý có thể giúp gì`, và action/feedback trong answer card.
- Đã thêm panel `Lịch sử hỏi đáp nội bộ` để xem lại các câu đã hỏi trong phiên và nhảy về câu trả lời tương ứng.

### Done When

- [ ] Review decision is recorded in this board.
- [ ] Behavior-changing feedback is reflected back into SRS/UXUI before technical handoff.
- [ ] PM decides whether A05 can start integration specification.
