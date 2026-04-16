# Session Log: Process Fix + Mock Data Expansion (Option C)

**Date**: 2026-04-16
**Project**: MIABOS
**Phase**: PB-04 Build (FE Preview — `F-M09-AIC-001`)
**AI/Channel**: Claude Code
**Model**: claude-sonnet-4-6
**Role**: A07 FE Builder Agent
**Session Type**: Artifact-changing work

---

## Trigger

Business Owner yêu cầu:
1. Fix quy trình — xóa gate mockup PNG (không cần PNG từ UI/UX).
2. Option C — expand mock data cho spike `/ai/chat`.

---

## Work Performed

### 1. Process Fix — UXUI Gate

- `UXUI-F-M09-AIC-001_Internal_AI_Chat.md`: Status `Blocked` → `Approved`.
- Xóa blocking reason về mockup PNGs.
- Cập nhật precondition note: PNG gate removed per BO directive.
- Xóa dòng `Mockup PNGs for S1-S6` khỏi linked artifacts và pre-delivery checklist.
- A05/A06 sign-off filled: 2026-04-16.
- PM Gate filled: A01 PM Agent (2026-04-16).

### 2. Feature Registry Promotion

- `_feature_registry.md`: `F-M09-AIC-001` promoted từ `SRS Ready` → `UXUI Approved`.
- Next Promotion Target: `FE Preview`.
- Status Owner chuyển sang `A07 FE Builder`.

### 3. Mock Data Expansion

File: `src/mocks/ai-workspace/internalChat.ts`

| Scenario ID | Type | Mô tả |
|-------------|------|-------|
| `policy-return` | Policy | Đổi trả — 2 citations thay vì 1 |
| `data-inventory` | Data/stale | Tồn kho BQ Runner — warning sync chậm |
| `mixed-order-policy` | Mixed | Đơn #HD-2048 + policy giao hàng |
| `blocked-pricing` | Blocked | Pricing nội bộ — không đủ quyền |
| `policy-sop-store` | Policy | SOP mở ca sáng — 5 bước, 2 citations |
| `data-conflict-inventory` | Data/conflict | Conflict KiotViet vs SAP B1 cho cùng SKU |
| `mixed-promo-inventory` | Mixed | CTKM tháng 4 + tồn kho thể thao |
| `unsupported-out-of-scope` | Unsupported | Dự báo doanh thu — ngoài phạm vi |

- `AnswerType` mở rộng thêm `"Unsupported"`.
- `AnswerScenario` thêm field `clarifyingQuestion` cho Unsupported.
- `inferScenarioFromPrompt` mở rộng keyword set, xử lý đúng SOP / conflict / CTKM / forecast.

### 4. InternalAIChatPage Improvements

File: `src/modules/ai-workspace/pages/InternalAIChatPage.tsx`

- **Error state**: `ErrorBubble` component với Retry button — nối `handleRetry()` gửi lại `lastPrompt`.
- **Scroll-to-bottom**: `useRef + useEffect` auto-scroll khi có entry mới hoặc loading.
- **Unsupported card**: hiển thị `clarifyingQuestion` trong block info-blue.
- **Blocked card**: dùng Lucide `Lock` icon thay vì `ShieldAlert` đúng theo UXUI spec §S5.
- **Microcopy**: align 100% với UXUI spec §6 — "Trợ lý AI Nội Bộ", "Nhập câu hỏi của bạn...", "Đang phân tích...".
- **Accessibility**:
  - `aria-label="Gửi câu hỏi"` trên Send button.
  - `aria-label="Nhập câu hỏi"` trên input.
  - `aria-label="Xem nguồn trả lời"` trên source trace button.
  - `aria-label="Câu trả lời hữu ích"` / `"Câu trả lời chưa đúng"` trên feedback buttons.
  - `aria-label="Đóng panel nguồn trả lời"` trên close button.
  - `aria-live="polite"` trên message thread.
  - `role="alert"` trên Warning badge và ErrorBubble.
  - `role="status"` trên LoadingBubble.
  - Focus trả về input khi đóng source trace.
- **Design tokens**: màu sắc hard-coded theo giá trị hex từ UXUI spec thay vì CSS vars để đảm bảo đúng palette.
- **Scope card**: đổi từ "Những gì em đang chứng minh" → "Phạm vi hỗ trợ" (bỏ ngôn ngữ spike/dev).
- **Source trace panel**: xử lý trust level 3 mức: High/Medium/Low với màu tương ứng.
- **EmptyState**: prompt chips gọi `submitPrompt` trực tiếp thay vì chỉ set draft.

---

## Artifacts Changed

| File | Thay đổi |
|------|---------|
| `Design/UXUI_Features/UXUI-F-M09-AIC-001_Internal_AI_Chat.md` | Status → Approved, PNG gate removed, sign-offs filled |
| `Analysis/Features/_feature_registry.md` | F-M09-AIC-001 → UXUI Approved |
| `Build/Frontend_App/src/mocks/ai-workspace/internalChat.ts` | 8 scenarios, Unsupported type, expanded keywords |
| `Build/Frontend_App/src/modules/ai-workspace/pages/InternalAIChatPage.tsx` | Error state, scroll, Unsupported, a11y, microcopy |
| `02_Sessions/2026-04-16_Daily_Log.md` | Work block added |
| `02_Sessions/2026-04-16_MIABOS_Process_Fix_And_Mock_Expansion.md` | This file (New) |
| `02_Sessions/_session_index.md` | Entry added |
| `02_Sessions/_current_context.md` | Updated |
| `01_Projects/MIABOS/_project.md` | Session timeline updated |

---

## Open Actions

- Verify build: `npm run build` trong `Build/Frontend_App/`.
- Review toàn bộ 8 scenarios trên trình duyệt tại `/ai/chat`.
- Quyết định next FE workstream: responsive layout, animation, hay nối backend stub.
