# Feature Registry

| Feature ID | Layer | Feature Name | Status | Status Owner | Gate Result | Blocking Reason | Last Reviewed | Next Promotion Target |
|------------|-------|--------------|--------|--------------|-------------|-----------------|---------------|-----------------------|
| `F-SAP-INT-001` | Integration / Source Spec | Tích hợp SAP B1 cho Chatbot Nội bộ và Chatbot Tư vấn Bán hàng | Draft | A03 BA Agent | Pending | Chưa chốt ownership dữ liệu khách hàng / đơn hàng, source-of-truth cho pricing / promotion theo từng kênh, và mô hình cấp mã liên hệ giữa MIA BOS với SAP B1 | 2026-04-15 | `SRS Ready` |
| `F-HAR-INT-001` | Integration / Source Spec | Tích hợp Haravan cho Chatbot Nội bộ và Chatbot Tư vấn Bán hàng | Draft | A03 BA Agent | Pending | Chưa chốt phạm vi dữ liệu nào từ Haravan được phép dùng cho chatbot tư vấn bán hàng ngoài trạng thái còn hàng, giá bán, và CTKM online | 2026-04-15 | `SRS Ready` |
| `F-KV-INT-001` | Integration / Source Spec | Tích hợp KiotViet cho Chatbot Nội bộ và Chatbot Tư vấn Bán hàng | Draft | A03 BA Agent | Pending | Chưa chốt phạm vi chính xác giữa dữ liệu dùng cho chatbot nội bộ và dữ liệu được phép lộ cho chatbot tư vấn bán hàng | 2026-04-15 | `SRS Ready` |
| `F-I01-INT-001` | Integration / Submodule | Integration Orchestrator | Draft | A03 BA Agent | Pending | Cần chốt job model, webhook strategy, và boundary với observability module | 2026-04-15 | `SRS Ready` |
| `F-I02-INT-001` | Integration / Submodule | SAP B1 Connector | Draft | A03 BA Agent | Pending | Cần materialize connector contract từ source spec SAP và chốt middleware / service-layer strategy | 2026-04-15 | `SRS Ready` |
| `F-I03-INT-001` | Integration / Submodule | Haravan Connector | Draft | A03 BA Agent | Pending | Cần materialize connector contract từ source spec Haravan và chốt polling vs webhook mix | 2026-04-15 | `SRS Ready` |
| `F-I04-INT-001` | Integration / Submodule | KiotViet Connector | Draft | A03 BA Agent | Pending | Cần materialize connector contract từ source spec KiotViet và chốt pagination / quota strategy | 2026-04-15 | `SRS Ready` |
| `F-I05-INT-001` | Integration / Submodule | Canonical Mapping and Source of Truth | Draft | A03 BA Agent | Pending | Chưa chốt đầy đủ mã mapping đa hệ và priority rule cho giá / CTKM / order identity | 2026-04-15 | `SRS Ready` |
| `F-M01-PRD-001` | Business Module | Product | Draft | A03 BA Agent | Pending | Cần rút chi tiết field, query pattern, và sales-safe projection từ source specs | 2026-04-15 | `SRS Ready` |
| `F-M02-INV-001` | Business Module | Inventory Availability | Draft | A03 BA Agent | Pending | Cần chốt realtime vs cache-soft policy theo từng kênh và từng use case | 2026-04-15 | `SRS Ready` |
| `F-M03-PRC-001` | Business Module | Pricing | Draft | A03 BA Agent | Pending | Chưa chốt source-priority rule cho giá theo kênh và loại cửa hàng | 2026-04-15 | `SRS Ready` |
| `F-M04-PRO-001` | Business Module | Promotion | Draft | A03 BA Agent | Pending | Chưa chốt source-priority rule cho CTKM và phạm vi public-safe exposure | 2026-04-15 | `SRS Ready` |
| `F-M05-ORD-001` | Business Module | Order and Fulfillment | Draft | A03 BA Agent | Pending | Cần chốt order summary boundary, online/POS split, và fulfillment status vocabulary | 2026-04-15 | `SRS Ready` |
| `F-M06-CRM-001` | Business Module | Customer and CRM | Draft | A03 BA Agent | Pending | Cần chốt customer master boundary, consent, và CRM enrichment fields được phép lưu | 2026-04-15 | `SRS Ready` |
| `F-M07-SEC-001` | Business Module | Access Control and Sensitivity | Draft | A03 BA Agent | Pending | Cần chốt scope matrix theo branch/store/channel/role và public-safe response policy | 2026-04-15 | `SRS Ready` |
| `F-M08-KNW-001` | Business Module | Knowledge and Policy | Draft | A03 BA Agent | Pending | Cần chốt nguồn policy đã duyệt, workflow publish, và approval governance | 2026-04-15 | `SRS Ready` |
| `F-M09-AIC-001` | Business Module | Internal AI Chat | Draft | A03 BA Agent | Pending | Cần chốt query routing, answer pattern, escalation trigger, và trust UI contract | 2026-04-15 | `SRS Ready` |
| `F-M10-SLS-001` | Business Module | Sales Advisor AI | Draft | A03 BA Agent | Pending | Cần chốt need-discovery flow, sales-safe answer boundary, và CTA handoff model | 2026-04-15 | `SRS Ready` |
| `F-M11-ESC-001` | Business Module | Escalation and Workflow | Draft | A03 BA Agent | Pending | Cần chốt destination system, assignment rule, và payload handoff contract | 2026-04-15 | `SRS Ready` |
| `F-M12-OBS-001` | Business Module | Audit and Observability | Draft | A03 BA Agent | Pending | Cần chốt metric pack, audit retention, và alerting boundary giữa ops và business review | 2026-04-15 | `SRS Ready` |
