# Current Active Context

**Last Updated**: 2026-04-16
**Active Workspace Topic**: Chuyển `.obsidian/` sang machine-local state bằng root `.gitignore`
**Current Project**: `MIABOS`
**Current Phase**: `Operational / Repo Hygiene`
**Latest Canonical Session Log**: [[2026-04-16_MIABOS_Obsidian_Local_Gitignore]]
**Today's Daily Log**: [[2026-04-16_Daily_Log]]

## Latest Decisions

- Repo hiện có root `.gitignore` mới với rule `.obsidian/`.
- Toàn bộ `.obsidian/**` đã được gỡ khỏi Git index bằng `git rm -r --cached` nhưng file local vẫn còn trên máy.
- `git check-ignore -v --no-index` xác nhận `.obsidian/workspace.json` và `.obsidian/app.json` đang bị ignore đúng theo rule mới.
- `main` vẫn giữ merge commit `f1fab3d` từ `alex_implementation`; work block hiện tại chỉ harden tracking behavior cho Obsidian.

## Next Actions

- Commit `.gitignore` mới cùng staged removals của `.obsidian/`.
- Nếu cần, push `main` lên remote sau khi chốt commit repo hygiene này.
- Nếu muốn giữ lại một vài file Obsidian dùng chung, thiết kế whitelist riêng.
