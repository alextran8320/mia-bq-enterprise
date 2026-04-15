# Integration Domain Index

## Purpose

Folder này chứa toàn bộ artifact thuộc domain `Integration` của MIABOS.

- `Source_Specs/`: các tài liệu nguồn theo từng hệ ngoài (`SAP`, `Haravan`, `KiotViet`)
- `SRS/`: các submodule integration nội tại của MIABOS

## Domain Rule

- `Integration` chỉ mô tả lớp kết nối, đồng bộ, mapping, source-of-truth, và vận hành sync.
- Các module nghiệp vụ tiêu thụ dữ liệu tích hợp phải nằm ở `../Modules/`.
