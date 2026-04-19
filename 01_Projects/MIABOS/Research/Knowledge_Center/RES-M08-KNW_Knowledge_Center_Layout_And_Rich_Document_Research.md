# RES-M08-KNW — Knowledge Center Layout & Rich Document Research

| Field | Value |
|-------|-------|
| Module | Knowledge Center |
| Research Type | UX / IA / Product Pattern Research |
| Author | A03 BA Agent + A06 UI/UX Agent (via Codex CLI + Claude Code CLI) |
| Date | 2026-04-17 |
| Status | **Approved — Business Owner approved 2026-04-17** |
| Related Docs | `UXUI-F-M08-KNW-001`, `PRD-M08-KNW-*`, `F-M08-KNW-* SRS`, `STB-M08-KNW-*` |

---

## 1. Mục đích tài liệu

Tài liệu này ghi lại phần research đã dùng để reshape Knowledge Center sau feedback của Business Owner:

- Tài liệu sync/import từ phòng ban khác chắc chắn có **hình ảnh, bảng, attachment**.
- Thêm tài liệu cần có nút **Import tài liệu** rõ ràng.
- Knowledge Center nên là **một page chung** thay vì nhiều page rời.
- Nội dung cần có **cây thư mục** với các root category như `SOP`, `FAQ`, `Policy`, `System Guide`.
- UX/UI hiện tại đọc yếu vì PO/BA/UX đang shape Knowledge Center như admin CRUD thay vì một knowledge workspace.

Tài liệu này là research input. Các PRD/SRS/UXUI đã được chỉnh theo hướng này, nhưng trước khi FE rework nên dùng research này làm điểm review chính thức với Business Owner.

---

## 2. Research Sources

| Source | Link | Pattern / Insight dùng cho MIABOS |
|--------|------|------------------------------------|
| Atlassian Confluence — Keep it organized | https://www.atlassian.com/software/confluence/resources/guides/best-practices/keep-it-organized | Knowledge space nên có page tree/hierarchy, search trong cấu trúc, archive/stale handling, và hub nội dung thay vì list phẳng. |
| Microsoft SharePoint — What is a document library? | https://support.microsoft.com/en-us/office/what-is-a-document-library-3b5976dd-65cf-4c9e-bf5a-713c10ca2872 | Document library cần lưu file/folder, metadata, permission, activity/version context, và giúp user tìm tài liệu nhanh. |
| Microsoft SharePoint — Upload files and folders to a library | https://support.microsoft.com/en-gb/office/upload-files-and-folders-to-a-library-da549fb1-1fcb-4167-87d0-4693e93cb7a0 | Upload/import phải là first-class action; user kỳ vọng kéo thả file/folder hoặc import file từ nguồn ngoài. |
| Microsoft SharePoint — Accessible pictures and media | https://support.microsoft.com/en-us/office/add-accessible-pictures-and-media-to-a-sharepoint-online-site-a17dc07d-1184-49d1-adc4-87841644cda4 | Hình ảnh/media phải có alt text/caption hoặc context label; tài liệu rich content không được chỉ render text. |
| WAI-ARIA APG — Tree View Pattern | https://www.w3.org/WAI/ARIA/apg/patterns/treeview/ | Folder tree phải có expand/collapse, selected state, focus state, keyboard navigation, và semantics rõ. |

---

## 3. Vấn đề của hướng UX trước đó

### 3.1 Triệu chứng

FE Preview và UXUI cũ đang chia Knowledge Center thành nhiều route:

- `/knowledge`
- `/knowledge/library`
- `/knowledge/publishing-queue`
- `/knowledge/sources`
- `/knowledge/freshness`
- `/knowledge/create`
- `/knowledge/:id`

Cách chia này làm Knowledge Center giống một tập admin screens rời rạc hơn là một trung tâm tri thức.

### 3.2 Tác hại với user

| Vấn đề | Tác hại |
|--------|---------|
| User phải nhớ nhiều route | Không biết bắt đầu từ đâu khi chỉ muốn tìm/tạo tài liệu. |
| Không có cây nội dung | User không hình dung tài liệu nằm trong SOP/FAQ/Policy/System Guide nào. |
| Create tách khỏi import | Không phản ánh thực tế tài liệu thường đến từ file/source ngoài. |
| Detail page chỉ text-heavy | Mất hình ảnh, bảng, attachment trong tài liệu gốc. |
| Queue/source health là page riêng | Reviewer/Governance mất context với tài liệu đang xem. |

### 3.3 Root cause

Lỗi không chỉ ở UX/UI. PO/BA trước đó chưa đóng đúng information architecture:

- `Library`, `Queue`, `Source Health`, `Create`, `Detail` được xem như module/page riêng.
- `Document Category`, `Knowledge Topic`, và `Catalog/Product Category` chưa được phân định đủ rõ.
- Rich document assets chưa được đưa vào object model.
- Import chưa được xem là happy path chính.

---

## 4. Research Synthesis

### 4.1 Knowledge Center nên là workspace, không phải menu route

Confluence và SharePoint đều đặt trọng tâm vào một không gian nội dung có điều hướng, search, metadata và detail context. Với MIABOS, pattern phù hợp là:

- một workspace chung `/knowledge`
- folder tree ở bên trái
- search/command bar ở trên
- content sections ở giữa
- preview/detail panel ở bên phải

Điều này giúp user luôn giữ context: đang ở category nào, đang đọc tài liệu nào, source/freshness ra sao, và action tiếp theo nằm đâu.

### 4.2 Folder tree là xương sống IA

Root tree nên là document category, không phải product/category commerce:

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

Phân biệt:

| Khái niệm | Thuộc Knowledge Center? | Diễn giải |
|-----------|--------------------------|-----------|
| Document Category | Có | Root IA: `SOP`, `FAQ`, `Policy`, `System Guide`. |
| Knowledge Topic | Có | Nhóm nghiệp vụ bên trong category: `pricing policy`, `promotion policy`, `customer service`, `store operation`, `ecommerce service`, `system usage`. |
| Product / Catalog Category | Không | Thuộc Catalog & Commerce; chỉ được link làm context/source khi cần. |

### 4.3 Import là happy path chính

Với BQ, tài liệu tri thức không chỉ được gõ tay trong MIABOS. Nhiều khả năng đến từ:

- PDF / DOCX / XLSX từ phòng ban
- internal workflow memo / department note (BQ does not use Lark per Business Owner clarification on 2026-04-19)
- file export từ hệ thống
- ảnh hướng dẫn thao tác
- policy table hoặc bảng điều kiện

Vì vậy command bar nên có:

- Primary CTA: `Import tài liệu`
- Secondary CTA: `Tạo thủ công`

Import drawer cần yêu cầu:

- source type hoặc file/source picker
- target category
- target knowledge topic
- target folder
- owner
- effective date
- source link
- preview sau import: text sections, images, tables, attachments
- warning nếu media/asset import lỗi

### 4.4 Rich document không được mất hình ảnh

Tài liệu knowledge thường không chỉ là văn bản. Với SOP và policy, hình ảnh/bảng có thể là phần quyết định user hiểu đúng hay sai:

- ảnh chụp màn hình thao tác trong SAP B1 / KiotViet / Haravan
- bảng điều kiện đổi trả / bảo hành / CTKM
- file policy gốc
- biểu mẫu hoặc attachment cần tải về

Do đó Knowledge Center cần object asset riêng:

`knowledge_document_asset`

| Field | Purpose |
|-------|---------|
| `document_version_id` | Gắn asset vào đúng version tài liệu. |
| `asset_type` | `image`, `table`, `attachment`, `media`, `source_file`. |
| `source_file_ref` | Tham chiếu file/source ban đầu. |
| `storage_ref` | Vị trí lưu asset trong MIABOS/storage. |
| `caption` | Caption nếu source có hoặc reviewer bổ sung. |
| `alt_text` | Alt text/accessibility context cho hình ảnh. |
| `display_order` | Thứ tự hiển thị trong document detail. |
| `import_status` | `imported`, `failed`, `skipped`, `needs_review`. |
| `original_url` | URL gốc nếu asset đến từ source ngoài. |

Rule quan trọng: **không được silent drop asset**. Nếu ảnh/bảng/attachment lỗi, UI phải hiện warning.

### 4.5 Tree view phải accessible

Folder tree cần tuân thủ tối thiểu:

- có trạng thái expand/collapse
- có selected item rõ
- focus bằng keyboard rõ ràng
- arrow keys để di chuyển/mở folder
- Enter/Space để chọn
- aria-expanded / aria-selected tương ứng

Nếu không làm phần này, user keyboard/screen reader sẽ bị kẹt ở cây nội dung.

---

## 5. Recommended Layout

### 5.1 Desktop Layout

```
┌─────────────────────────────────────────────────────────────────────────────┐
│ Trung tâm tri thức       [Search SOP, FAQ, policy...] [Import] [Tạo thủ công]│
├───────────────┬───────────────────────────────────────┬─────────────────────┤
│ Cây nội dung  │ Section: Chờ xử lý                     │ Chi tiết / Preview  │
│ ▾ SOP         │ [Stale] Chính sách đổi trả Q2      >   │ [Policy] Đổi trả Q2 │
│   Store Ops   │ [Review] SOP xử lý khiếu nại       >   │ Owner: CSKH         │
│   Ecommerce   │                                       │ Hiệu lực: 01/04     │
│ ▾ FAQ         │ Section: Tài liệu trong folder chọn    │                     │
│   CSKH        │ [SOP] Kiểm hàng khi nhận đổi trả   >   │ Rich content preview│
│   Delivery    │ [SOP] Escalate đơn lỗi hệ thống    >   │ - text              │
│ ▾ Policy      │                                       │ - images            │
│   Pricing     │ Section: Cập nhật gần đây              │ - tables            │
│   Promotion   │ [Guide] Hướng dẫn tra KiotViet     >   │ - attachments       │
│ ▾ Imported    │ [FAQ] Câu hỏi bảo hành giày        >   │                     │
└───────────────┴───────────────────────────────────────┴─────────────────────┘
```

### 5.2 Layout zones

| Zone | Purpose | Required Content |
|------|---------|------------------|
| Top command bar | Entry/action | Search, `Import tài liệu`, `Tạo thủ công`, quick filters. |
| Left folder tree | IA/context | `SOP`, `FAQ`, `Policy`, `System Guide`, `Imported / Chờ phân loại`. |
| Center sections | Work surface | Pending/stale, selected-folder docs, recent updates, search results. |
| Right panel | Reading/context | Metadata, rich content, source reference, version, freshness, related docs. |

---

## 6. Core User Flows

### Flow 1 — Import tài liệu

1. User mở `/knowledge`.
2. Click `Import tài liệu`.
3. Chọn file/source hoặc kéo thả file.
4. Chọn category: `SOP`, `FAQ`, `Policy`, `System Guide`.
5. Chọn knowledge topic/folder.
6. Hệ thống parse text, headings, images, tables, attachments.
7. User xem preview và warnings.
8. Gửi để duyệt.

### Flow 2 — Browse bằng cây nội dung

1. User mở `/knowledge`.
2. Expand `SOP`.
3. Chọn `Store Operation`.
4. Center column cập nhật danh sách tài liệu trong folder.
5. Click một tài liệu.
6. Right panel hiển thị detail/rich content/source/version.

### Flow 3 — Review publish request

1. Reviewer vào `/knowledge`.
2. Chọn section `Chờ duyệt`.
3. Mở request.
4. Xem tabs `Summary`, `Diff`, `Rich Content`, `Source Evidence`, `Impact`, `History`.
5. Approve/Reject với comment.

### Flow 4 — Source Health

1. PM/Governance vào `/knowledge`.
2. Chọn section `Source Health`.
3. Xem source stale/restricted.
4. Mở source detail.
5. Xem affected documents/assets.
6. Restrict/unrestrict hoặc yêu cầu owner xử lý.

---

## 7. Product Decisions Recommended

| Decision | Recommendation | Reason |
|----------|----------------|--------|
| Main route | `/knowledge` | Một workspace chung giúp user không bị phân mảnh. |
| Main IA | Folder tree by document category | User hiểu SOP/FAQ/Policy/Guide nhanh hơn module/route. |
| Add document action | `Import tài liệu` primary, `Tạo thủ công` secondary | Tài liệu từ phòng ban khác thường đã có file/source. |
| Rich content | Required | SOP/policy thường có ảnh, bảng, attachment. |
| Separate pages | Không dùng làm main UX | Chỉ giữ deep-link hoặc legacy redirect nếu cần. |
| Analytics objects | Không thuộc M08 | Nếu cần usage analytics, chuyển sang M12 Observability. |
| Data reconciliation | Không thuộc M08 | Trùng Catalog & Commerce / Integration nếu kéo vào Knowledge Center. |

---

## 8. FE Preview Impact

FE Preview hiện có đã build nhiều route riêng. Theo research này, cần revise:

| Existing Route / Page | New Direction |
|-----------------------|---------------|
| `/knowledge` | Trở thành unified workspace đầy đủ. |
| `/knowledge/library` | Convert thành Library section trong `/knowledge`. |
| `/knowledge/publishing-queue` | Convert thành `Chờ duyệt` section/panel trong `/knowledge`. |
| `/knowledge/sources` | Convert thành `Source Health` section/panel trong `/knowledge`. |
| `/knowledge/freshness` | Convert thành Source Health sub-section. |
| `/knowledge/create` | Convert thành drawer/deep-link state; `Import tài liệu` là primary drawer. |
| `/knowledge/:id` | Convert thành detail panel/deep-link state. |

---

## 9. Approval Questions For Business Owner

- [ ] Anh approve `/knowledge` là single workspace chưa?
- [ ] Root folder tree `SOP / FAQ / Policy / System Guide / Imported` đã đúng chưa?
- [ ] `Import tài liệu` làm primary CTA đã đúng với vận hành BQ chưa?
- [ ] Phase 1 import hỗ trợ file nào: PDF, DOCX, XLSX, image, HTML export?
- [ ] Tài liệu import lỗi ảnh/bảng thì cho gửi review với warning hay bắt retry trước?
- [ ] FE Preview cũ nhiều route có nên redirect/ẩn sau khi consolidate không?

---

## 10. Research Conclusion

Knowledge Center nên được thiết kế như một **knowledge workspace**, không phải admin module. Trải nghiệm đúng cho BQ là:

> Mở `/knowledge` → thấy cây SOP/FAQ/Policy/Guide → import hoặc tìm tài liệu → đọc rich content có ảnh/bảng/attachment → kiểm source/freshness/version → gửi duyệt hoặc xử lý source health trong cùng một không gian.

Đây là hướng giảm rối IA, tăng trust, và phù hợp hơn với thực tế tài liệu doanh nghiệp được sync/import từ nhiều phòng ban.

---

*Tài liệu này là input research đã được approve để định hướng PRD/SRS/UXUI. Nếu Business Owner đổi layout concept, phải revise research trước rồi mới sync lại artifact chính thức.*
