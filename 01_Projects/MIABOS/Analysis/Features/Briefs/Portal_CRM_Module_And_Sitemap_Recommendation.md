# MIABOS Core AI CRM Platform - Module And Sitemap Recommendation

**Status**: Draft Recommendation
**Owner**: A01 PM Agent
**Contributors**: A05 Tech Lead Agent, A02 Product Owner Agent, A04 Business Strategy Agent
**Last Updated By**: Codex CLI (GPT-5.4 Codex environment)
**Last Updated**: 2026-04-19
**Scope**: Giay BQ / MIABOS Core AI CRM Platform
**Document Role**: Quyết định khuyến nghị về bộ module cần có và sitemap Core AI CRM Platform sau vòng phản biện chéo kiến trúc, sản phẩm, và chiến lược

---

## 1. Executive Decision

Core AI CRM Platform của MIABOS cho Giày BQ nên được thiết kế trên 3 lớp:

1. `Integration Foundation`
2. `Business And AI Modules`
3. `Portal Product Surfaces`

Business Owner clarify ngày 2026-04-19: BQ dự định xây Data Warehouse riêng để làm source-of-truth dữ liệu từ SAP B1, KiotViet, Haravan. MIABOS không thay Data Warehouse và không tạo source data vận hành ngoài `Conversation` và `Knowledge`. CTKM là miền dữ liệu/use case, không phải pain point. BQ không sử dụng Lark trong operation hiện tại.

Kết luận sau vòng phản biện:

- Bộ `I01-I05` và `M01-M12` hiện tại là nền đúng để đi tiếp.
- Nhưng để đủ chặt cho build thực tế và đủ rõ cho Core AI CRM Platform, cần bổ sung thêm:
  - `I06 Projection / Read Model / Landing`
  - `M13 Channel / Branch / Dealer Operations`
  - `M14 Business Analytics / ROI`
- `Commercial Packaging / Tenant Onboarding` là capability platform quan trọng, nhưng không phải module người dùng chính của Core AI CRM Platform cho phase Giày BQ hiện tại.

---

## 2. Final Module Set Recommendation

### 2.1 Integration Foundation

| Module ID | Module Name | Status | Mục đích chính |
|-----------|-------------|--------|----------------|
| `I01` | Integration Orchestrator | Keep | Điều phối scheduler, polling, webhook, retry, dead-letter, run control |
| `I02` | SAP B1 Connector | Keep | Kết nối và đồng bộ dữ liệu từ SAP B1 |
| `I03` | Haravan Connector | Keep | Kết nối và đồng bộ dữ liệu từ Haravan |
| `I04` | KiotViet Connector | Keep | Kết nối và đồng bộ dữ liệu từ KiotViet |
| `I05` | Canonical Mapping And Source Boundary | Keep | Map đa mã, ưu tiên nguồn dữ liệu theo rule BQ/Data Warehouse, xử lý conflict ở lớp tiêu thụ |
| `I06` | Projection / Read Model / Landing | Add | Chuẩn hóa, materialize, replay, freshness, staging và landing cho dữ liệu tiêu thụ xuống business modules, không thay Data Warehouse của BQ |

### 2.2 Business And AI Modules

| Module ID | Module Name | Status | Mục đích chính |
|-----------|-------------|--------|----------------|
| `M01` | Product | Keep | Catalog, variant, barcode, category, collection, product query |
| `M02` | Inventory Availability | Keep | Tồn kho, availability, fallback cache, realtime check |
| `M03` | Pricing | Keep | Giá cơ sở, giá hiệu lực, source-priority rule |
| `M04` | Promotion | Keep | Tra cứu CTKM, discount, voucher, coupon, promo scope theo context vận hành |
| `M05` | Order And Fulfillment | Keep with later split option | Order summary, POS invoice, online order, fulfillment, transfer, return |
| `M06` | Customer And CRM | Keep | Customer profile, loyalty, customer attributes, lead capture, remarketing trigger |
| `M07` | Access Control And Sensitivity | Keep | Role, branch/store/channel scope, sensitivity, public-safe response policy |
| `M08` | Knowledge And Policy | Keep | SOP, FAQ, policy, knowledge index, publishing rules |
| `M09` | Internal AI Chat | Keep | Chatbot nội bộ, source trace, warning, fallback |
| `M10` | Sales Advisor AI | Keep | Chatbot tư vấn bán hàng, sales-safe answer, CTA handoff |
| `M11` | Escalation And Workflow | Keep with workflow expansion | Escalation, ticket, assignment, MIABOS internal queue / destination TBD |
| `M12` | Audit And Observability | Keep | Audit log, sync monitor, stale/conflict, AI quality monitoring |
| `M13` | Channel / Branch / Dealer Operations | Add | Quản trị cửa hàng, chi nhánh, đại lý, khu vực, channel context, operational scope |
| `M14` | Business Analytics / ROI | Add | Dashboard quản trị, ROI, sell-through, promo effectiveness, branch compare, funnel value |

### 2.3 Platform Capability Outside Portal Core

| Capability | Status | Ghi chú |
|------------|--------|---------|
| `Commercial Packaging / Tenant Onboarding` | Add Later | Cần cho scale product và GTM, nhưng không phải top-level Core AI CRM module cho BQ phase hiện tại |

---

## 3. Module Packaging For Core AI CRM Platform

Không nên expose toàn bộ module dưới dạng menu top-level. Core AI CRM Platform nên đóng gói chúng thành các product surfaces sau:

1. `CRM Workspace`
2. `Catalog And Commerce`
3. `Orders And Service`
4. `AI Workspace`
5. `Knowledge Center`
6. `Operations And Governance`
7. `Insights And Performance`

---

## 4. Core AI CRM Sitemap Recommendation

## 4.1 Dashboard

| Page | Purpose | Primary Persona | Mapped Modules | Phase |
|------|---------|-----------------|----------------|-------|
| `Executive Dashboard` | Tổng quan vận hành CRM, AI, commerce, KPI chính | Owner / PM / Ban điều hành BQ | `M14`, `M12` | P2 |
| `Retail Ops Dashboard` | Tồn kho, giá, CTKM, đơn, escalation và health trạng thái | Ops / Store Lead | `M02`, `M03`, `M04`, `M05`, `M11`, `M12` | P1 |
| `AI Trust Dashboard` | Chất lượng câu trả lời, stale/conflict, escalation, blocked answers | PM / Ops / Tech Lead | `M09`, `M10`, `M11`, `M12`, `M07` | P1 |

## 4.2 CRM Workspace

| Page | Purpose | Primary Persona | Mapped Modules | Phase |
|------|---------|-----------------|----------------|-------|
| `Customer List` | Danh sách khách hàng và filter theo segment / branch / channel | Sales / CSKH | `M06`, `M13` | P1 |
| `Customer 360` | Hồ sơ khách hàng, thuộc tính, lịch sử tóm tắt, hành động gợi ý | Sales / CSKH / Manager | `M06`, `M05`, `M10` | P1 |
| `Lead Inbox` | Lead mới từ chatbot / form / channel | Sales | `M06`, `M10`, `M11` | P2 |
| `Dealer / Partner Accounts` | Hồ sơ đại lý, đối tác, account B2B, trạng thái hợp tác | Sales B2B / Manager | `M06`, `M13` | P2 |
| `Customer Segments` | Segment khách hàng và điều kiện nhóm | Marketing / CRM | `M06`, `M14` | P2 |
| `Remarketing Triggers` | Trigger chăm sóc lại, nhắc mua lại, loyalty outreach | Marketing / CRM | `M06`, `M08`, `M14` | P2 |

## 4.3 Catalog And Commerce

| Page | Purpose | Primary Persona | Mapped Modules | Phase |
|------|---------|-----------------|----------------|-------|
| `Product Catalog` | Quản trị và tra cứu sản phẩm hợp nhất | Sales / Store / Ops | `M01`, `I05`, `I06` | P1 |
| `Inventory Availability` | Kiểm tra tồn theo SKU / size / màu / chi nhánh / kênh | Sales / Store / CSKH | `M02`, `M13`, `I06` | P1 |
| `Pricing Center` | Tra cứu giá hiện hành, giá theo điều kiện, source trace | Sales / Trade / Ops | `M03`, `I05`, `I06` | P1 |
| `Promotion Center` | Tra cứu CTKM, voucher, campaign scope, promo logic | Trade / Marketing / Sales | `M04`, `M03`, `I05` | P1 |
| `Branch / Channel Projection` | Xem projection theo cửa hàng, chi nhánh, kênh bán | Ops / Regional Manager | `M13`, `M01`, `M02`, `M03`, `M04` | P2 |
| `Approval Center` | Phê duyệt thay đổi giá, CTKM, knowledge publish, rule changes | Manager / Governance / bộ phận phụ trách BQ | `M11`, `M03`, `M04`, `M08`, `M07` | P2 |

## 4.4 Orders And Service

| Page | Purpose | Primary Persona | Mapped Modules | Phase |
|------|---------|-----------------|----------------|-------|
| `Order Summary` | Tra cứu đơn hàng hợp nhất và trạng thái tổng quan | CSKH / Sales / Manager | `M05`, `I05`, `I06` | P1 |
| `POS And Sales Invoice` | Xem invoice / POS transaction summary | Store / Finance Ops | `M05` | P2 |
| `Fulfillment Tracking` | Theo dõi giao hàng, xử lý fulfillment, trạng thái giao vận | Ops / CSKH | `M05` | P2 |
| `Returns And Transfers` | Theo dõi đổi trả, chuyển kho, tình trạng xử lý | Ops / Store Lead | `M05`, `M13` | P2 |
| `Service Cases` | Chăm sóc sau bán, warranty, follow-up issue | CSKH | `M05`, `M06`, `M11` | P3 |

## 4.5 AI Workspace

| Page | Purpose | Primary Persona | Mapped Modules | Phase |
|------|---------|-----------------|----------------|-------|
| `Internal AI Chat` | Hỏi đáp nội bộ với source trace và freshness | Nhân viên nội bộ | `M09`, `M07`, `M01-M08` | P1 |
| `Sales Advisor Console` | Workspace tư vấn bán hàng với CTA và lead capture | Sales / Digital Team | `M10`, `M06`, `M07` | P2 |
| `AI Answer History` | Lịch sử trả lời, warning, escalation linkage | PM / Ops / Sales Lead | `M09`, `M10`, `M12` | P2 |
| `Suggested Actions` | Gợi ý next-best-action cho chăm sóc và bán hàng | Sales / CRM | `M10`, `M06`, `M14` | P3 |

## 4.6 Knowledge Center

| Page | Purpose | Primary Persona | Mapped Modules | Phase |
|------|---------|-----------------|----------------|-------|
| `SOP Library` | Quản trị SOP và hướng dẫn nội bộ | Ops / PM / QA | `M08` | P1 |
| `FAQ And Policies` | Chính sách đổi trả, giao hàng, loyalty, CSKH | Sales / CSKH / Store | `M08` | P1 |
| `Knowledge Documents` | Kho tri thức doanh nghiệp và nguồn trả lời AI | PM / Ops / Knowledge Owner | `M08` | P2 |
| `Knowledge Publishing Queue` | Duyệt và publish tài liệu tri thức | PM / Governance | `M08`, `M11` | P2 |

## 4.7 Operations And Governance

| Page | Purpose | Primary Persona | Mapped Modules | Phase |
|------|---------|-----------------|----------------|-------|
| `Escalation Queue` | Theo dõi escalation từ AI hoặc người dùng | Ops / PM / Team Lead | `M11`, `M09`, `M10` | P1 |
| `Workflow Inbox` | Hàng đợi assignment, approval, unresolved cases | Ops / Manager | `M11` | P2 |
| `Users And Roles` | Quản trị người dùng và quyền | Admin | `M07` | P1 |
| `Scope And Sensitivity Rules` | Branch/store/channel scope và sensitivity rules | Admin / Governance | `M07`, `M13` | P1 |
| `Integration Ops` | Job runs, retry, webhook inbox, dead-letter, connector health | Tech Ops / Admin | `I01`, `I02`, `I03`, `I04`, `I06` | P1 |
| `Source Boundary And Mapping` | Map đa mã, đọc rule ưu tiên từ BQ/Data Warehouse, và xử lý conflict dữ liệu | Tech Ops / PM / Ops Governance | `I05`, `I06`, `M13` | P1 |

## 4.8 Insights And Performance

| Page | Purpose | Primary Persona | Mapped Modules | Phase |
|------|---------|-----------------|----------------|-------|
| `Business Performance Dashboard` | Hiệu quả vận hành, sell-through, promo performance, branch compare | Ban điều hành BQ / Regional Manager | `M14`, `M13`, `M03`, `M04`, `M05` | P2 |
| `CRM And Funnel Dashboard` | Lead, conversion, segment performance, remarketing outcome | Marketing / Sales Lead | `M14`, `M06`, `M10` | P2 |
| `Audit And Compliance Dashboard` | Audit truy vấn, deny count, blocked answers, rule violations | PM / Governance / Tech Lead | `M12`, `M07`, `M09`, `M10` | P2 |

---

## 5. Recommended Build Sequence

### 5.1 Foundation Bundle

- `I01 Integration Orchestrator`
- `I05 Canonical Mapping And Source Boundary`
- `I06 Projection / Read Model / Landing`
- `M07 Access Control And Sensitivity`
- `M12 Audit And Observability`

### 5.2 Retail Ops Core

- `M01 Product`
- `M02 Inventory Availability`
- `M03 Pricing`
- `M04 Promotion`
- `M05 Order And Fulfillment`
- `M06 Customer And CRM`
- `M13 Channel / Branch / Dealer Operations`

### 5.3 AI Ops

- `M08 Knowledge And Policy`
- `M09 Internal AI Chat`
- `M11 Escalation And Workflow`

> Phase đầu nên rollout cho các bộ phận nội bộ/content của BQ trước để chuẩn hóa Knowledge và Conversation trước khi mở diện rộng.

### 5.4 Sales Expansion

- `M10 Sales Advisor AI`
- `M14 Business Analytics / ROI`

---

## 6. Final Recommendation To Approve

### 6.1 Approve Now

- Giữ `I01-I05` và `M01-M12` làm backbone hiện tại
- Bổ sung `I06`, `M13`, `M14` vào backlog kiến trúc và product
- Thiết kế Core AI CRM Platform theo `product surfaces`, không expose raw module tree làm menu
- Giữ rõ boundary: Data Warehouse/source-of-truth thuộc BQ; MIABOS tạo Conversation + Knowledge và cung cấp AI CRM experience

### 6.2 Do Not Approve Yet

- Không xem module tree hiện tại là fully implementation-ready nếu chưa có `I06`
- Không rollout sales-facing rộng nếu chưa chốt `M07`, `I05`, `M03`, `M04`, `M12` và boundary với Data Warehouse/source systems của BQ
- Không coi `M12` là đủ cho business value dashboard; cần `M14`

### 6.3 Decision Trigger

Khi anh chốt hướng này, bước tiếp theo nên là:

1. Materialize `I06`, `M13`, `M14` thành SRS riêng
2. Chuyển sitemap này thành `Portal IA / UXUI Spec`
3. Chốt roadmap `P1 / P2 / P3` theo từng surface
