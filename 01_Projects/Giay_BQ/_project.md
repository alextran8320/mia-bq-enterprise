# Project: Giay BQ — MIABOS Core AI CRM Platform Implementation

**Status**: In Progress
**Created**: 2026-04-13
**Current Phase**: PB-03 (Product Design — Core AI CRM positioning updated, UX/UI Spec pending)

---

## Applied Rules

- [x] KB Rule 1 (Autonomous Session Log generation) — applies
- [x] KB Rule 2 (Clickable Relative Markdown Links) — applies
- [x] KB Rule 4 (Daily Log requirement) — applies
- [x] KB Rule 5 (Logging Handshake) — applies
- [x] KB Rule 6 (High-Precision Handoffs) — applies
- [x] KB Rule 7 (Framework-First Rule) — applies: React + shadcn/ui + Tailwind CSS
- [x] KB Rule 8 (Color Confirmation Separate) — applies: MIA Brand Blue `#2F64F6` confirmed 2026-04-15
- [x] KB Rule 9 (Design System = Framework Config + Theme + Component Map) — applies: Design_System.md canonical
- [x] KB Rule 10 (Start-of-Block Hard Stop) — applies
- [x] KB Rule 11 (Current Context Anchor) — applies
- [x] KB Rule 12 (No Final Answer Without Log Sync) — applies

---

## Intake

### Goal
Xây dựng MIABOS cho Giày BQ như một Core AI CRM Platform: AI Internal Chatbot cho nhu cầu hỏi đáp riêng của BQ, AI External Chatbot cho Social + Ecommerce sales advisory, Knowledge/Conversation layer, AI Automation cho các khối vận hành, và nền tảng Forecasting khi Data Warehouse BQ đủ sẵn sàng.

### Business Value
Giúp BQ dùng AI để tra cứu tri thức/dữ liệu đúng boundary, tư vấn bán hàng trên kênh social/ecommerce, giảm câu hỏi lặp lại giữa phòng ban, và chuẩn bị nền dữ liệu cho automation/forecasting. Source-of-truth dữ liệu nghiệp vụ vẫn thuộc SAP B1 / Haravan / KiotViet / Data Warehouse BQ; MIABOS chỉ tạo thêm Conversation và Knowledge.

### Scope
| Field | Value |
|-------|-------|
| Phase 1 Priority | AI Internal Chatbot + Knowledge + Conversation cho nhóm nội bộ/content BQ trước khi rollout rộng |
| Target Users | Nhân viên nội bộ Giày BQ (Sales, CSKH, Store Lead, Ops, Admin) |
| Platforms | Web (Desktop-first, responsive) |
| Integrations | SAP B1, Haravan, KiotViet, planned BQ Data Warehouse (via Integration Orchestrator I01–I06/read model được BQ cho phép) |

### Constraints
| Type | Detail |
|------|--------|
| Tech | Greenfield — React 18+, shadcn/ui, Tailwind CSS, Directus CMS |
| Design | Aura Minimalist Design System (canonical: [`01_Projects/MIABOS/Design/Design_System.md`](../MIABOS/Design/Design_System.md)) |
| Scope | Phase 1 = Internal/content-team adoption trước; Phase 2 = External Chatbot Social + Ecommerce; Phase 3 = AI Automation; Phase 4 = Forecasting khi Data Warehouse sẵn sàng |

---

## Raw Input Files
| File | Description | Location |
|------|------------|----------|
| BQ Raw Notes | Ghi chép discovery session 2026-04-13 | [04_Raw_Information/Customers/Giay_BQ/2026-04-13_BQ_Raw_Notes.md](../../04_Raw_Information/Customers/Giay_BQ/2026-04-13_BQ_Raw_Notes.md) |
| BQ Customer Research Pack | Phân tích khách hàng và market context | [04_Raw_Information/Customers/Giay_BQ/2026-04-13_BQ_Customer_Research_Pack.md](../../04_Raw_Information/Customers/Giay_BQ/2026-04-13_BQ_Customer_Research_Pack.md) |
| BQ Systems & Integration Landscape | Hệ thống hiện tại và bản đồ tích hợp | [04_Raw_Information/Customers/Giay_BQ/2026-04-13_BQ_Systems_And_Integration_Landscape.md](../../04_Raw_Information/Customers/Giay_BQ/2026-04-13_BQ_Systems_And_Integration_Landscape.md) |
| BQ Stakeholder Map | Danh sách stakeholders và vai trò | [04_Raw_Information/Customers/Giay_BQ/2026-04-13_BQ_Stakeholder_Map.md](../../04_Raw_Information/Customers/Giay_BQ/2026-04-13_BQ_Stakeholder_Map.md) |
| BQ SAP Research | Nghiên cứu SAP B1 cho BQ | [04_Raw_Information/Customers/Giay_BQ/2026-04-13_BQ_SAP_Research.md](../../04_Raw_Information/Customers/Giay_BQ/2026-04-13_BQ_SAP_Research.md) |
| BQ Integration Architecture | Kiến trúc tích hợp và data boundary | [04_Raw_Information/Customers/Giay_BQ/2026-04-14_BQ_Integration_Architecture_And_Data_Boundary.md](../../04_Raw_Information/Customers/Giay_BQ/2026-04-14_BQ_Integration_Architecture_And_Data_Boundary.md) |
| Core AI CRM Module & Sitemap | Khuyến nghị module set và sitemap theo positioning Core AI CRM Platform | [01_Projects/MIABOS/Analysis/Features/Briefs/Portal_CRM_Module_And_Sitemap_Recommendation.md](../MIABOS/Analysis/Features/Briefs/Portal_CRM_Module_And_Sitemap_Recommendation.md) |

---

## Session Timeline
| Date | Session File | Phase | Summary |
|------|--------------|-------|---------|
| 2026-04-13 | [OS Workspace History Reset](../../02_Sessions/2026-04-13_OS_Workspace_History_Reset.md) | PB-01 | Khởi tạo workspace cho Giày BQ |
| 2026-04-13 | [MIABOS Giay BQ Requirement Source Linkage](../../02_Sessions/2026-04-13_MIABOS_Giay_BQ_Requirement_Source_Linkage.md) | PB-01 | Liên kết BQ requirement pack vào control plane |
| 2026-04-14 | [BQ Integration Architecture](../../02_Sessions/2026-04-14_MIABOS_BQ_Integration_Architecture_and_Data_Boundary.md) | PB-02 | Thiết lập kiến trúc tích hợp SAP B1 / Haravan / KiotViet |
| 2026-04-15 | [MIABOS Analysis Feature Modularization](../../02_Sessions/2026-04-15_MIABOS_Analysis_Feature_Modularization.md) | PB-02 | Materialize 17 SRS modules theo Integration + Business layers |
| 2026-04-15 | [MIABOS Portal CRM Module And Sitemap](../../02_Sessions/2026-04-15_MIABOS_Portal_CRM_Module_And_Sitemap_Recommendation.md) | PB-02 | Chốt module set và sitemap giai đoạn cũ; note 2026-04-19 supersede positioning thành Core AI CRM Platform |
| 2026-04-15 | [Giay BQ Design System Setup](../../02_Sessions/2026-04-15_Giay_BQ_Design_System_Setup.md) | PB-03 | Materialize Design System Aura Minimalist canonical cho Giay_BQ project |
| 2026-04-19 | [MIABOS BQ Solution Repositioning](../../02_Sessions/2026-04-19_MIABOS_BQ_Solution_Repositioning.md) | PB-03 | Reposition MIABOS thành Core AI CRM Platform; CTKM không phải pain point; BQ không dùng Lark; Data Warehouse BQ giữ source-of-truth; rollout nội bộ/content trước |

---

## Progress Tracker

| Phase | Status | Date Started | Date Completed | Notes |
|-------|--------|-------------|---------------|-------|
| PB-01 Discovery & Intake | Complete | 2026-04-13 | 2026-04-13 | BQ requirement pack linked |
| PB-02 Analysis & Strategy | Complete | 2026-04-13 | 2026-04-15 | Module set, sitemap, integration arch chốt |
| PB-03 Product Design | In Progress | 2026-04-15 | — | Design System Approved; UX/UI Spec pending features |
| PB-04 Build & Integrate | Not Started | — | — | |
| PB-05 Test & Review | Not Started | — | — | |
| PB-06 Ship & Learn | Not Started | — | — | |

---

## Evidence Checklist

### Gate 2 — Scope → Design (PB-01 → PB-02)
- [x] Raw requirement intake complete — BQ Customer Pack linked
- [x] Module set finalized — I01-I06, M01-M14 defined
- [x] Sitemap approved — 7 product surfaces, 40+ pages mapped

### Gate 2A — Design Direction Approved (within PB-02/PB-03)
- [x] Design direction confirmed: Aura Minimalist — Business Owner approved 2026-04-15
- [x] [`MIABOS/Design/Design_System.md`](../MIABOS/Design/Design_System.md) — canonical, status Approved

### Gate 2B — Mockups Signed Off
- [ ] [`MIABOS/Design/Mockups/`](../MIABOS/Design/Mockups/) — pending (no features assigned yet for UX/UI Spec)

### Gate 3 — Design → Build (PB-03 → PB-04)
- [x] [`MIABOS/Design/Design_System.md`](../MIABOS/Design/Design_System.md) — complete
- [ ] UX/UI Spec per feature — pending feature assignment
- [ ] A05 Tech Lead sign-off on Design System implementability
- [ ] Architecture.md — pending
- [ ] API_Contract.md — pending
- [ ] Data_Mapping.md — pending

### Gate 4 — Build → Test
- [ ] Not started

### Gate 5 — Test → Ship
- [ ] Not started
