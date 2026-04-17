# UXUI Feature Spec: F-M08-KNW-001 Knowledge and Policy

**Feature ID**: F-M08-KNW-001
**Status**: Approved
**Owner**: A06 UI/UX Agent
**Implementation Reviewer**: A05 Tech Lead
**Implemented By**: A07 FE Builder
**Product**: MIA Smart / Platform
**Design System Reference**: [`Design/Design_System.md`](../Design_System.md)
**Save to**: `Design/UXUI_Features/UXUI-F-M08-KNW-001_Knowledge_And_Policy.md`
**Date**: 2026-04-16
**Last Updated By**: A01 PM Agent (Claude Sonnet 4.6 — Claude Code CLI, incorporating research 2026-04-17)
**Last Reviewed By**: A06 UI/UX Agent · A05 Tech Lead · A01 PM Agent
**Approval Required**: PM Agent
**Approved By**: A01 PM Agent
**Last Status Change**: 2026-04-17
**Source of Truth**: This document for `F-M08-KNW-001` UXUI and FE Preview visual/interaction contract
**Blocking Reason**: -

> **Precondition Resolved**: Linked SRS `F-M08-KNW-001` đã ở `SRS Ready`; spec này là visual/interaction authority cho FE Preview bằng mock/stub data. BE/integration thật cần Integration Spec riêng trước khi promote lên `Build Ready`.

---

## §0. User & Task

### Target User Role(s)

| Role | Mô tả | Context |
|------|-------|---------|
| Knowledge Owner | Người tạo và quản lý tài liệu | Tạo draft, gắn source, submit review |
| Domain Reviewer | Người duyệt nội dung theo domain | Kiểm tra source backing, approve/reject |
| PM Governance | Quản lý vận hành | Giám sát toàn bộ knowledge layer |
| User nội bộ | Nhân viên tra cứu | Query knowledge qua chat hoặc library |
| AI Runtime | M09 / M10 | Tiêu thụ knowledge đã publish |

### Primary Task Objective

> Knowledge Owner tạo và submit tài liệu mới trong **≤ 5 phút** từ khi mở form đến khi submit review — không cần hiểu cấu trúc kỹ thuật phức tạp.

### Success Metric

| Metric | Target | Cách đo |
|--------|--------|---------|
| Form submit time | ≤ 5 phút | Đo từ mở form đến Submit thành công |
| Validation error rate | ≤ 10% submissions | Tỉ lệ submit bị lỗi validation |
| Source reference render time | ≤ 1s sau answer card | Đo từ answer xuất hiện đến source panel load |

### Failure Indicators

- Knowledge Owner không rõ field nào bắt buộc
- User không hiểu sự khác nhau giữa `Policy`, `FAQ`, `SOP`, `System Guide`
- Source reference panel hiện nhưng không có owner / freshness / version
- Stale document không có badge cảnh báo
- Tài liệu import từ nguồn ngoài bị mất hình ảnh / bảng / attachment
- Knowledge Center bị tách thành nhiều page nhỏ khiến user không biết bắt đầu ở đâu

---

## 1. Feature Overview

### Purpose

Cung cấp bề mặt quản lý knowledge core trong một **Knowledge Center workspace** duy nhất: tra cứu, import, tạo mới, review, publish, và xem lại knowledge documents. Answer card trong M09/M10 sẽ reference document/source metadata từ layer này. Freshness, version, rich content, và sensitivity được kiểm soát rõ.

### User Persona

Knowledge Owner (IT / HR / Ops tại BQ) — cần tạo tài liệu chuẩn mà không cần biết về hệ thống phức tạp.

### User Story

```
Là Knowledge Owner tại Giày BQ,
Tôi muốn tạo và publish knowledge document đã được duyệt
để AI và nhân viên đều trả lời theo nguồn chính thống,
Thay vì dựa vào trí nhớ cá nhân hoặc file Excel không kiểm soát.
```

### Linked Artifacts

| Artifact | Location | Status |
|----------|----------|--------|
| Feature SRS | [`Analysis/Features/Modules/Knowledge_Center/Knowledge_And_Policy/SRS/F-M08-KNW-001_Knowledge_And_Policy_SRS.md`](../../Analysis/Features/Modules/Knowledge_Center/Knowledge_And_Policy/SRS/F-M08-KNW-001_Knowledge_And_Policy_SRS.md) | SRS Ready |

---

## 1.1 Research Compliance — Approved Research Docs

> Spec này phải tuân thủ 4 Research docs đã được Business Owner approve ngày 2026-04-17:

| Research Doc | Link | Key Principles Applied |
|-------------|------|----------------------|
| Internal Chatbot Concept | [RES-M08-KNW_Internal_Chatbot_Concept.md](../../Research/Knowledge_Center/RES-M08-KNW_Internal_Chatbot_Concept.md) | Gen 3 RAG; Answer-First; Verified KB; Role-Aware; Honest Uncertainty |
| Paradigm & Benchmark | [RES-M08-KNW_Paradigm_And_Benchmark.md](../../Research/Knowledge_Center/RES-M08-KNW_Paradigm_And_Benchmark.md) | Guru verification model; Source Citation block; Embedded wins standalone |
| UX Patterns & IA | [RES-M08-KNW_UX_Patterns_And_IA.md](../../Research/Knowledge_Center/RES-M08-KNW_UX_Patterns_And_IA.md) | 7 UX patterns; 3 interaction modes; Article Metadata Block |
| Layout & Rich Document | [RES-M08-KNW_Knowledge_Center_Layout_And_Rich_Document_Research.md](../../Research/Knowledge_Center/RES-M08-KNW_Knowledge_Center_Layout_And_Rich_Document_Research.md) | 3-panel workspace; Sidebar max 3 levels; Cmd+K search; Content blocks |

### UX Patterns bắt buộc trong spec này

| Pattern | Implemented ở | Status |
|---------|--------------|--------|
| Source Citation Block (tên doc + ngày + owner) | S4 Document Detail Panel + S5 Source Reference Panel | ✅ |
| Stale Content Warning (badge + banner) | S1 badges + S4 banner | ✅ |
| Article Metadata Block (owner, date, tags, verified) | S4 Detail Panel header | ✅ |
| Uncertainty Signal (khi không tìm thấy) | S1 empty state + E3-E6 error states | ✅ |
| Human Escalation Path (không dead-end) | Feedback button trong S4 | ✅ |
| Feedback Loop (thumbs up/down) | Thiếu — cần thêm vào S4 | ⚠ Cần bổ sung |

> **⚠ Feedback Loop**: Research doc §2 Pattern 7 yêu cầu thumbs up/down sau mỗi document view. A07 cần thêm feedback widget vào S4 Document Detail Panel.

## 1.2 Research-Backed IA Reset (cũ — giữ nguyên)

### References Checked

| Reference Pattern | Product / Standard | UX Implication For MIABOS |
|-------------------|--------------------|----------------------------|
| Page tree + child pages | Atlassian Confluence | Knowledge cần có cây nội dung bên trái để user hiểu vị trí của SOP / FAQ / Policy / Guide thay vì chỉ thấy list phẳng. |
| Search inside hierarchy | Atlassian Confluence | Search phải chạy global nhưng vẫn cho filter theo folder/topic đang chọn. |
| Document library + folders + metadata | Microsoft SharePoint | Import/tạo tài liệu phải đi cùng folder placement, metadata, owner, version, và permission. |
| Rich pictures/media accessibility | Microsoft SharePoint | Tài liệu import có hình ảnh phải giữ được preview, caption/alt text nếu có, và broken-media warning. |
| Tree view accessibility | WAI-ARIA APG | Cây thư mục phải keyboard navigable, có expand/collapse state, selected state, và focus rõ. |

### Research Source Links

- Atlassian Confluence organization patterns: https://www.atlassian.com/software/confluence/resources/guides/best-practices/keep-it-organized
- Microsoft SharePoint document library pattern: https://support.microsoft.com/en-us/office/what-is-a-document-library-3b5976dd-65cf-4c9e-bf5a-713c10ca2872
- Microsoft SharePoint upload files/folders pattern: https://support.microsoft.com/en-gb/office/upload-files-and-folders-to-a-library-da549fb1-1fcb-4167-87d0-4693e93cb7a0
- Microsoft SharePoint accessible pictures/media: https://support.microsoft.com/en-us/office/add-accessible-pictures-and-media-to-a-sharepoint-online-site-a17dc07d-1184-49d1-adc4-87841644cda4
- WAI-ARIA tree view pattern: https://www.w3.org/WAI/ARIA/apg/patterns/treeview/

### Product Decision

Knowledge Center không triển khai như nhiều route độc lập. `Library`, `Publishing Queue`, `Source Health`, `Import`, và `Document Detail` là **sections/panels trong một page `/knowledge`**. Route sâu chỉ dùng cho deep-link và browser history, không làm user cảm giác đang rời khỏi workspace.

### IA Model

```
/knowledge
├─ SOP
│  ├─ Store Operation
│  ├─ Ecommerce Handling
│  └─ System Usage
├─ FAQ
│  ├─ CSKH
│  ├─ Order / Delivery
│  └─ Promotion
├─ Policy
│  ├─ Pricing Policy
│  ├─ Promotion Policy
│  └─ Warranty / Return
├─ System Guide
│  ├─ SAP B1
│  ├─ KiotViet
│  └─ Haravan
└─ Imported / Chờ phân loại
```

> `SOP`, `FAQ`, `Policy`, `System Guide` là content category chính của Knowledge Center. `Knowledge Topic` là nhóm nghiệp vụ bên trong category. Cả hai đều không trùng với Catalog & Commerce vì không mô tả SKU/category/product data.

## 2. Screen Inventory

| # | Screen Name | Route/Path | Purpose | Notes |
|---|-------------|-----------|---------|-------|
| S1 | Knowledge Center Workspace | `/knowledge` | Page chung gồm folder tree, search, section list, preview/detail panel | Entry point duy nhất |
| S2 | Import Document Drawer | `/knowledge?panel=import` | Upload/sync tài liệu rich content từ file hoặc external source | Drawer trong S1 |
| S3 | Create / Edit Document Drawer | `/knowledge?panel=create` hoặc `/knowledge/:id/edit` | Tạo hoặc sửa knowledge item thủ công | Drawer trong S1 |
| S4 | Document Detail Panel | `/knowledge/:id` | Xem đầy đủ document, hình ảnh, attachment, version history, source trace | Detail panel trong S1 |
| S5 | Source Reference Panel | Component trong M09/M10 | Hiển thị document/source metadata khi answer tham chiếu | Inline trong chat |

---

## 2.1 Task Flow

### Primary Task Flow — Knowledge Owner import hoặc tạo tài liệu mới

| Step | User Action | System Response | Field Visibility | Notes |
|------|------------|-----------------|-----------------|-------|
| 1 | Mở `/knowledge` | Workspace load với folder tree, search, sections, và CTA `Import tài liệu` / `Tạo thủ công` | Folder tree + command bar | Entry |
| 2A | Click `Import tài liệu` | Mở S2 Import Drawer | Source type, file/source picker, target category/topic | Preferred khi có file từ phòng ban khác |
| 2B | Click `Tạo thủ công` | Mở S3 Create Drawer | Required fields: type, title, knowledge topic, owner, effective date | Manual entry |
| 3 | Chọn category chính: SOP / FAQ / Policy / System Guide | UI gợi ý metadata phù hợp | Type-specific hints | Không dùng product category |
| 4 | Import hoặc nhập nội dung rich content | Hệ thống giữ text, hình ảnh, bảng, attachment; cảnh báo media lỗi | Rich editor + asset list | Draft |
| 5 | Gắn source links, scope, sensitivity, applicable personas | Permission preview | Optional but recommended | Config |
| 6 | Click `Gửi để duyệt` | Validate all required -> tạo pending review request | — | Submit |
| 7 | Reviewer mở `Chờ duyệt` section trong `/knowledge` | Xem diff, source backing, rich content preview | Reviewer tools | Governance |
| 8 | Reviewer Approve / Reject | Nếu Approve -> publish; nếu Reject -> trả về với reason | — | Decision |

### Decision Points & Branching

| At Step | Condition | Branch To |
|---------|-----------|----------|
| Step 4 | Import có ảnh bị lỗi / không tải được | Warning: "Có hình ảnh chưa import thành công" + retry per asset |
| Step 4 | File không map được category | Đưa vào `Imported / Chờ phân loại` |
| Step 5 | Source duy nhất là Excel | Warning: "Cần reviewer xác nhận nguồn tạm thời" |
| Step 6 | Required fields thiếu | Inline validation — block submit |
| Step 8 | Reject | Document trả về Draft với reason code rõ |
| Step 8 | Approve | Document index vào runtime |

### Progressive Disclosure Rules

- **Required**: Document type, title, knowledge topic, owner, effective date, source links — luôn hiển thị
- **Optional**: Sensitivity level, applicable channels, personas, review cycle — hiện sau required
- **Advanced**: Structured tags, asset metadata, source parsing options — collapse, expand on click

---

## 3. Visual Specification (Per Screen)

### Screen S1: Knowledge Center Workspace

#### Layout (ASCII Wireframe)

```
┌─────────────────────────────────────────────────────────────────────────────┐
│ Trung tâm tri thức       [Search SOP, FAQ, policy...] [Import] [Tạo thủ công]│
├───────────────┬───────────────────────────────────────┬─────────────────────┤
│ Cây nội dung  │ Section: Chờ xử lý                     │ Chi tiết / Preview  │
│ ▾ SOP         │ [Stale] Chính sách đổi trả Q2      >   │ [Policy] Đổi trả Q2 │
│   Store Ops   │ [Review] SOP xử lý khiếu nại       >   │ Owner: CSKH         │
│   Ecommerce   │                                       │ Hiệu lực: 01/04     │
│ ▾ FAQ         │ Section: Tài liệu trong SOP/Store Ops  │                     │
│   CSKH        │ [SOP] Kiểm hàng khi nhận đổi trả   >   │ Rich content preview│
│   Delivery    │ [SOP] Escalate đơn lỗi hệ thống    >   │ - text              │
│ ▾ Policy      │                                       │ - images            │
│   Pricing     │ Section: Cập nhật gần đây              │ - tables            │
│   Promotion   │ [Guide] Hướng dẫn tra KiotViet     >   │ - attachments       │
│ ▾ Imported    │ [FAQ] Câu hỏi bảo hành giày        >   │                     │
└───────────────┴───────────────────────────────────────┴─────────────────────┘
```

#### Component Breakdown

| Component | Design Token | Notes |
|-----------|-------------|-------|
| Command search | Input 40px height | Global search; giữ folder context khi user đang chọn folder |
| Import button | Primary button | CTA chính vì tài liệu từ bên khác thường sync/import vào |
| Create manual button | Secondary button | Dùng khi soạn nội dung mới trong MIABOS |
| Folder tree | Tree view 280px width | Root gồm SOP / FAQ / Policy / System Guide / Imported |
| Section list | Table/list hybrid | Group theo selected folder, pending/stale/recent |
| Preview panel | 360-420px width | Xem nhanh metadata + rich content trước khi mở detail |
| Document type badge | Caption 11px/600, color-coded | Policy=blue, FAQ=green, SOP=purple, Guide=gray |
| Stale badge | Caption 11px/600, --color-danger-bg | Nổi bật — cần action |
| Pending badge | Caption 11px/600, --color-warning-bg | Chờ duyệt |
| Row click → S4 | Full row clickable | Update preview panel; double click/open detail |

#### Design Token Values

| Element | Property | Token / Value |
|---------|----------|---------------|
| Page bg | `background` | `--color-bg-page` (#F8FAFC) |
| Card bg | `background` | `--color-bg-card` (#FFFFFF) |
| Badge — Policy | `background` | `--color-blue-bg` (#DBEAFE) |
| Badge — FAQ | `background` | `--color-success-bg` (#DCFCE7) |
| Badge — SOP | `background` | `--color-purple-bg` (#EDE9FE) |
| Stale bg | `background` | `--color-danger-bg` (#FEF2F2) |
| Pending bg | `background` | `--color-warning-bg` (#FEF3C7) |

---

### Screen S2: Import Document Drawer

#### Layout (ASCII Wireframe)

```
┌─────────────────────────────────────────────────────────────┐
│ Import tài liệu                                      [X]    │
├─────────────────────────────────────────────────────────────┤
│ Nguồn import *                                             │
│ [Upload file] [Sync link] [Connector sau]                  │
│                                                             │
│ Kéo thả file vào đây                                       │
│ Hỗ trợ: PDF, DOCX, XLSX, hình ảnh, HTML export              │
├─────────────────────────────────────────────────────────────┤
│ Phân loại                                                   │
│ Category *      [Policy ▼]                                  │
│ Knowledge Topic [Promotion Policy ▼]                        │
│ Folder          [Policy / Promotion ▼]                      │
├─────────────────────────────────────────────────────────────┤
│ Preview sau import                                          │
│ ✓ Text sections: 8    ✓ Images: 4    ✓ Tables: 2            │
│ ⚠ Attachments cần kiểm tra: 1                               │
├─────────────────────────────────────────────────────────────┤
│ Metadata                                                    │
│ Owner * [CSKH ▼]  Effective date * [2026-04-17]             │
│ Source link [https://...]                                   │
├─────────────────────────────────────────────────────────────┤
│ [Lưu nháp]                          [Import & gửi duyệt]   │
└─────────────────────────────────────────────────────────────┘
```

#### Import Rules

- Import phải giữ `text`, `heading hierarchy`, `tables`, `inline images`, và `attachments` ở dạng asset list.
- Mỗi ảnh có `asset_type=image`, `caption`, `alt_text nếu có`, `source_file_ref`, `storage_ref`, và trạng thái `imported / failed / skipped`.
- Nếu ảnh không import được, drawer không được silent fail; phải hiện warning và cho retry hoặc submit với warning reviewer.
- File chưa rõ category được đưa vào folder `Imported / Chờ phân loại`.

---

### Screen S3: Create / Edit Document

#### Layout (ASCII Wireframe)

```
┌─────────────────────────────────────────────────────────────┐
│ Tạo thủ công                                        [X]     │
├─────────────────────────────────────────────────────────────┤
│ Loại tài liệu *    [Policy ▼]  [FAQ ▼]  [SOP ▼]  [Guide ▼] │
│ Tên tài liệu *                                              │
│ [Chính sách đổi trả Q2 2026_________________]              │
│ Knowledge Topic * [Pricing Policy ▼]                        │
│ Folder *          [Policy / Pricing ▼]                      │
│ Phòng ban phụ trách * [Tài chính ▼]                        │
│ Ngày hiệu lực *   [2026-04-16]                              │
│ Chu kỳ xem xét *  [90 ngày ▼]                              │
├─────────────────────────────────────────────────────────────┤
│ Nội dung tài liệu *                                        │
│ [Rich text editor: text / ảnh / bảng / attachment...]        │
├─────────────────────────────────────────────────────────────┤
│ Nguồn tham chiếu *                                         │
│ [+ Thêm nguồn] SAP B1 ✕  KiotViet ✕                       │
├─────────────────────────────────────────────────────────────┤
│ [+ Thêm cấu hình nâng cao ▼]                                │
├─────────────────────────────────────────────────────────────┤
│               [Lưu nháp]  [Gửi để duyệt →]                 │
└─────────────────────────────────────────────────────────────┘
```

#### Design Token Values

| Element | Property | Token / Value |
|---------|----------|---------------|
| Input border | `border` | 1px solid `--color-border` |
| Input focus | `border-color` | `--color-primary` |
| Source tag | `background` | `--color-bg-subtle` (#F8FAFC) |
| Source tag border | `border` | 1px solid `--color-border` |
| Submit button | `background` | `--color-primary` |
| Save draft button | `background` | transparent, `color` --color-primary |

---

### Screen S4: Document Detail Panel

#### Layout (ASCII Wireframe)

```
┌─────────────────────────────────────────────────────────────┐
│ ← Quay lại   [Policy] Chính sách đổi trả Q2 2026  [Sửa]   │
│ Published | Owner: Tài chính | v2.1 | Hiệu lực: 01/04/2026 │
├─────────────────────────────────────────────────────────────┤
│ Tóm tắt: [Quy định đổi trả sản phẩm cho khách lẻ...]       │
├─────────────────────────────────────────────────────────────┤
│ Phạm vi áp dụng: Tất cả kênh / CSKH / Ecommerce            │
│ Ngoại lệ: Hàng sale không áp dụng                          │
├─────────────────────────────────────────────────────────────┤
│ Nội dung đầy đủ [...]                                       │
│ [Ảnh: Bảng quy định đổi trả tại cửa hàng]                   │
│ [Bảng: Điều kiện áp dụng / Ngoại lệ / Người duyệt]          │
│ [Attachment: File policy gốc.pdf]                           │
├─────────────────────────────────────────────────────────────┤
│ Nguồn: SAP B1 (fresh ✓) | KiotViet (fresh ✓)               │
│ Lịch sử phiên bản: v2.1 (hiện tại) | v2.0 | v1.3          │
├─────────────────────────────────────────────────────────────┤
│ [Gửi phản hồi]                                              │
└─────────────────────────────────────────────────────────────┘
```

---

### Screen S5: Source Reference Panel (trong M09/M10 answer card)

```
┌─────────────────────────────────────────────────────────────┐
│ Tài liệu tham chiếu:                                        │
│ [Policy] Chính sách đổi trả Q2 2026                        │
│ Phòng ban: Tài chính | v2.1 | Hiệu lực: 01/04/2026         │
│ Độ mới: ● Còn mới (4 ngày trước)                           │
│ [Mở tài liệu đầy đủ →]                                     │
└─────────────────────────────────────────────────────────────┘
```

> Source reference panel render ≤ 1s sau answer card. Freshness badge: green=mới, yellow=gần stale, red=stale.

---

## 4. Data Binding

| UI Element | API Endpoint | Field | Format |
|-----------|-------------|-------|--------|
| Knowledge home list | `POST /mia/knowledge/query` | `document_type`, `knowledge_topic`, `status`, `freshness_status` | List |
| Folder tree | `GET /mia/knowledge/tree` | `category`, `folder`, `knowledge_topic`, `counts` | Tree |
| Import document | `POST /mia/knowledge/import` | `source_type`, `file_ref`, `target_folder`, `metadata`, `assets[]` | Multipart / async job |
| Create form submit | Internal draft save → `POST /mia/knowledge/publish-request` (via KNW-002) | All form fields | POST body |
| Document detail | `GET /mia/knowledge/documents/:id` | `metadata`, `current_version`, `version_history`, `source_links`, `assets[]` | Object |
| Source reference panel | `GET /mia/knowledge/documents/:id` | `title`, `version`, `owner`, `effective_date`, `freshness_status`, `source_links` | Object |
| SOP step list | `GET /mia/knowledge/documents/:id` | `sop_steps[]` with `actor`, `action`, `expected_output`, `exception_note` | Array |

---

## 5. State Matrix

### Page-Level States

| State | Trigger | Visual | Notes |
|-------|---------|--------|-------|
| Loading | API in-flight | Skeleton cards | |
| Empty | Không có document | "Chưa có tài liệu nào. Import hoặc tạo tài liệu đầu tiên." + CTA Import | |
| Error | API fail | Error card + Retry | |
| Populated | Data loaded | Normal S1 | Default |

### Document Status States

| Status | Visual | Badge color |
|--------|--------|-------------|
| Draft | Italic text, --color-text-secondary | Gray |
| In Review | "Đang xem xét", --color-warning | Yellow |
| Published | Normal, --color-success | Green |
| Stale | Warning banner, --color-danger | Red |
| Superseded | Strikethrough + link sang version mới | Gray |
| Deprecated | Muted, ẩn khỏi search mặc định | Gray |

---

## 5.1 Error & Recovery

### Common Errors

| Error ID | At Step | Error Description | System Assistance | Recovery Action |
|----------|---------|-------------------|-------------------|----------------|
| E1 | Step 3 | Required field trống khi submit | Highlight + "Vui lòng điền [field]" | Focus field |
| E2 | Step 3 | Source duy nhất là Excel | Warning banner: "Nguồn tạm thời cần reviewer xác nhận" | Vẫn cho submit với warning |
| E3 | Step 5 | API submit fail | "Không thể gửi lúc này. Thử lại." + Retry | Retry |
| E4 | View | Document stale | Banner đỏ: "Tài liệu này quá hạn xem xét — có thể không còn chính xác" | Link tới republish action |
| E5 | View | Document superseded | Banner: "Đã có phiên bản mới. [Xem phiên bản mới →]" | Link sang version mới |
| E6 | Import | Một hoặc nhiều hình ảnh import lỗi | Asset warning + retry per asset | Retry hoặc submit với warning reviewer |

### Dead-End Prevention Checklist

- [x] Stale documents có banner cảnh báo rõ — không hiển thị như trusted
- [x] Superseded documents redirect sang version mới
- [x] Form validation inline — không submit khi thiếu required fields
- [x] Import lỗi có recovery path — không làm mất hình ảnh âm thầm
- [x] Feedback/escalation path tồn tại nhưng không tạo object xử lý thiếu tri thức riêng trong M08

---

## 6. Copy & Microcopy (Vietnamese)

| Element | Vietnamese Text | Max Length |
|---------|----------------|-----------|
| Page title | Trung tâm tri thức | 25 chars |
| Import button | Import tài liệu | 18 chars |
| Create button | Tạo thủ công | 15 chars |
| Type — Policy | Chính sách | 12 chars |
| Type — FAQ | Câu hỏi thường gặp | 20 chars |
| Type — SOP | Quy trình vận hành | 22 chars |
| Type — Guide | Hướng dẫn hệ thống | 22 chars |
| Submit button | Gửi để duyệt | 15 chars |
| Save draft | Lưu nháp | 10 chars |
| Stale banner | Tài liệu này quá hạn xem xét — có thể không còn chính xác | 65 chars |
| Superseded banner | Đã có phiên bản mới hơn cho tài liệu này. | 50 chars |
| Feedback button | Gửi phản hồi | 15 chars |
| Import warning | Có hình ảnh chưa import thành công. | 40 chars |

---

## 7. Interaction & Animation

| Interaction | Animation | Duration | Easing |
|------------|-----------|----------|--------|
| Page enter | Fade in | 200ms | ease-out |
| Card hover | Background transition | 150ms | ease-out |
| Source reference panel appear | Fade in + slide up | 200ms | ease-out |
| Stale banner | Pulse once on load | 500ms | ease-in-out |
| Version history expand | Height 0→auto | 250ms | ease-out |
| Folder expand/collapse | Chevron rotate + height transition | 150ms | ease-out |

---

## 8. Accessibility

- [x] Document type selector: `role="radiogroup"` hoặc `<select>` accessible
- [x] `aria-required="true"` trên required form fields
- [x] `aria-live="polite"` trên validation messages
- [x] Stale banner: `role="alert"` để screen reader đọc
- [x] Superseded banner: link sang version mới accessible bằng keyboard
- [x] Source reference panel keyboard accessible từ answer card
- [x] Folder tree tuân thủ tree view behavior: arrow keys, Enter/Space select, rõ `aria-expanded` và `aria-selected`
- [x] Hình ảnh trong rich document có alt text/caption nếu source cung cấp; nếu thiếu, reviewer thấy warning

---

## 9. A05 Technical Cross-Check

| Item | Verdict | Notes |
|------|---------|-------|
| Component mapping | ✓ | Form, Badge, Table, Modal từ design system |
| Token compatibility | ✓ | Tokens chuẩn |
| Animation practical | ✓ | Nhẹ; không có animation heavy |
| Responsive aligns | ✓ | Form single-column ở mobile |
| Data binding matches API | ✓ | Map đủ từ SRS |
| Shared components | Reuse Badge từ AIC-001; Form inputs từ SLS-003 |

**A05 Sign-Off**: Pending (2026-04-16)

---

## 10. Pre-Delivery Checklist (A07)

- [ ] Unified `/knowledge` workspace với folder tree + command/search bar + sections + preview/detail panel
- [ ] `Import tài liệu` primary CTA và Import drawer
- [ ] Rich document asset preview cho image/table/attachment
- [ ] Stale / Pending badges rõ ràng
- [ ] Create form với required field validation
- [ ] Progressive disclosure cho advanced fields
- [ ] Document detail với freshness, version, source badges
- [ ] Source reference panel render ≤ 1s
- [ ] Stale banner (role="alert")
- [ ] Superseded banner với link sang version mới
- [ ] Feedback/escalation path không tạo object gap riêng
- [ ] Responsive: form single-column ở mobile
- [ ] 100% Vietnamese copy
- [ ] `prefers-reduced-motion` handled
- [ ] Accessibility attributes applied

**A06 Design Sign-Off**: Approved (2026-04-17) — Unified `/knowledge` workspace; Import drawer; rich document assets; stale/superseded banner rõ; source reference panel ≤1s target hợp lý. Dual approval UI đã loại bỏ theo quyết định BO.
**A05 Tech Sign-Off**: Approved (2026-04-17) — Không có dual-approval routing phức tạp; 1-reviewer flow đơn giản hơn; API contract khớp SRS.
**PM Gate**: Approved (2026-04-17) — Approval nằm ở SAP (không phải MIABOS). Ready for A07 FE build (mock/stub only).
