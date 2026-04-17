# Knowledge Center Index

## Purpose

Nhóm này chứa các module quản trị tri thức, SOP, policy, publishing governance, và source governance phục vụ AI lẫn người dùng nội bộ.

## UX / IA Decision

Knowledge Center được thiết kế là một workspace chung tại `/knowledge`, không phải tập hợp nhiều page rời. Root folder tree gồm `SOP`, `FAQ`, `Policy`, `System Guide`, và `Imported / Chờ phân loại`. Tài liệu import từ nguồn ngoài phải preserve rich content như hình ảnh, bảng, và attachment qua `knowledge_document_asset`.

## Modules

- `Knowledge_And_Policy`
- `Knowledge_Publishing_Queue`
- `FAQ_And_Policy_Library`
- `Knowledge_Documents_And_Source_Governance`
