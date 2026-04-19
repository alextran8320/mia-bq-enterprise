# Integration Domain Index

## Purpose

Folder này chứa toàn bộ artifact thuộc domain `Integration` của MIABOS.

- `Source_Specs/`: các tài liệu nguồn theo từng hệ ngoài (`SAP`, `Haravan`, `KiotViet`)
- `SRS/`: các submodule integration nội tại của MIABOS

## Domain Rule

- `Integration` chỉ mô tả lớp kết nối, đồng bộ, mapping, source-boundary, và vận hành sync. Source-of-truth dữ liệu nghiệp vụ thuộc hệ thống BQ đang sở hữu và Data Warehouse BQ dự kiến; MIABOS không tự trở thành source-of-truth ngoài `Conversation` và `Knowledge`.
- Các module nghiệp vụ tiêu thụ dữ liệu tích hợp phải nằm ở `../Modules/`.
