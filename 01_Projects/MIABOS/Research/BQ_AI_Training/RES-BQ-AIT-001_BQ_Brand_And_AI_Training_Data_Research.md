# RES-BQ-AIT-001 — Giày BQ Brand & AI Training Data Research

| Field | Value |
|-------|-------|
| Project | MIABOS / Giày BQ |
| Research Type | Brand Research / AI Training Data Readiness / RAG Architecture |
| Author | A01 PM Agent + A03 BA Agent + A05 Tech Lead Agent via Codex CLI |
| Date | 2026-04-19 |
| Status | Draft — Pending Business Owner Review |
| Related Scope | AI Internal Chatbot, AI External Chatbot, Knowledge Center, Integration Read Model, Forecasting Readiness |
| Source of Truth | This research document after Business Owner approval |

---

## 1. Mục Đích Tài Liệu

Tài liệu này tổng hợp research về thương hiệu Giày BQ và chuyển hóa thành danh mục dữ liệu AI cần học / cần kết nối cho MIABOS.

Mục tiêu chính:

- Làm rõ BQ là thương hiệu retail đa điểm bán, đa kênh, có cửa hàng chính hãng, đại lý, ecommerce, app, CSKH, policy, loyalty và SAP B1.
- Xác định chính xác từng bộ dữ liệu AI cần dùng, file type chuẩn, độ dài / batch đề xuất, và cơ chế xử lý phù hợp.
- Tách rõ dữ liệu nào nên đưa vào RAG, dữ liệu nào phải truy vấn qua API / SQL / Data Warehouse, dữ liệu nào chỉ dùng cho eval hoặc fine-tuning.
- Tránh sai hướng: không fine-tune toàn bộ dữ liệu vận hành sống vào model.

---

## 2. Executive Summary

Giày BQ nên được nhìn như một doanh nghiệp bán lẻ giày dép Việt Nam đang vận hành ở quy mô chuỗi: website ecommerce, hệ thống hơn 200 cửa hàng / đại lý, chính sách đổi trả, bảo hành trọn đời, loyalty, app, kênh CSKH, và hành trình triển khai SAP Business One.

Đối với AI, BQ không cần một model được fine-tune bằng toàn bộ dữ liệu doanh nghiệp. BQ cần một kiến trúc:

```text
RAG cho tri thức tài liệu
+ API / SQL retrieval cho dữ liệu sống
+ source-of-truth / business-rule layer
+ role-based access control
+ audit / eval liên tục
```

Kết luận kỹ thuật:

- **RAG** phù hợp với brand knowledge, policy, SOP, FAQ, hướng dẫn SAP B1 / KiotViet / Haravan, tài liệu nội bộ đã duyệt.
- **Structured retrieval / API / Data Warehouse query** phù hợp với tồn kho, giá, CTKM, đơn hàng, khách hàng, loyalty, hóa đơn, trạng thái giao vận.
- **Fine-tuning** chỉ nên dùng sau pilot để cải thiện intent classification, format câu trả lời, tone, và cách xử lý tình huống lặp lại. Không dùng fine-tune để nhồi dữ liệu giá / tồn / đơn hàng.
- **Forecasting** là phase sau, cần Data Warehouse đủ sạch và dữ liệu lịch sử theo SKU / location / time. Đây không phải bài toán RAG.

---

## 3. Research Sources

### 3.1 Nguồn nội bộ MIABOS / BQ pack

| Source | Vai trò |
|--------|---------|
| `04_Raw_Information/Customers/Giay_BQ/README.md` | Active intake index cho BQ |
| `2026-04-13_BQ_Raw_Notes.md` | Raw requirement signals từ Business Owner |
| `2026-04-13_BQ_Customer_Research_Pack.md` | Research pack về business model, roadmap AI, BQ Data Warehouse boundary |
| `2026-04-13_BQ_Systems_And_Integration_Landscape.md` | Source systems: SAP B1, KiotViet, Haravan, Excel, BQ Data Warehouse |
| `2026-04-13_BQ_SAP_Research.md` | Research về SAP B1 object groups và hàm ý tích hợp |
| `2026-04-13_BQ_Stakeholder_Map.md` | Stakeholder / department map cho rollout AI |
| `01_Projects/MIABOS/Analysis/Features/Integration/Source_Specs/` | Source specs cho SAP B1, KiotViet, Haravan |
| `01_Projects/MIABOS/Analysis/Features/Integration/SRS/F-I05-INT-001_Canonical_Mapping_And_Source_Of_Truth_SRS.md` | Canonical mapping và source-priority rules |

### 3.2 Nguồn public

| Source | Insight dùng trong research |
|--------|-----------------------------|
| https://giaybq.com.vn/ | Website ecommerce, danh mục sản phẩm, variant màu / size, sale, cart, dịch vụ giao hàng / đổi trả / bảo hành |
| https://giaybq.com.vn/pages/he-thong-cua-hang | BQ có mặt tại 43 tỉnh thành với hơn 200 cửa hàng và đại lý |
| https://hoptackinhdoanh.giaybq.com.vn/ | BQ tự giới thiệu hơn 20 năm, hơn 2 triệu khách hàng, hơn 200 cửa hàng / đại lý, mô hình hợp tác kinh doanh |
| https://giaybq.com.vn/pages/chinh-sach-doi-tra | Chính sách đổi trả 30 ngày và điều kiện đổi trả |
| https://giaybq.com.vn/pages/chinh-sach-doi-tra-online | Chính sách đổi trả online, thử giày tại nhà, điều kiện đổi trả |
| https://giaybq.com.vn/pages/chinh-sach-bao-hanh-tron-doi | Chính sách bảo hành trọn đời |
| https://giaybq.com.vn/pages/chinh-sach-khach-hang-than-thiet | Chính sách khách hàng thân thiết áp dụng từ 2026-01-01 |
| https://apps.apple.com/vn/app/giay-bq/id1495668379?l=vi | App Giày BQ: tìm sản phẩm, đặt hàng, chat với cửa hàng, nhận thông báo, quản lý thông tin cá nhân |
| https://cmcconsulting.vn/chuc-mung-thuong-hieu-giay-bq-khoi-dong-hanh-trinh-trien-khai-erp-sap-business-one-cung-cmc-consulting | Tín hiệu BQ triển khai SAP Business One; quy mô hơn 200 cửa hàng / đại lý và áp lực quản trị |

### 3.3 Nguồn kỹ thuật

| Source | Insight dùng trong research |
|--------|-----------------------------|
| https://developers.openai.com/api/docs/guides/retrieval | Vector store, semantic search, metadata filtering, chunking/indexing |
| https://developers.openai.com/api/docs/guides/tools-file-search | File Search trong Responses API, citations, supported file types |
| https://platform.openai.com/docs/guides/fine-tuning | Fine-tuning dùng cho hành vi / format / classification, không thay thế retrieval dữ liệu động |

---

## 4. Brand Research — Giày BQ

### 4.1 Nhận diện thương hiệu

| Dimension | Research finding |
|-----------|------------------|
| Category | Giày dép / giày công sở Việt / sản phẩm nam, nữ, trẻ em, phụ kiện |
| Business footprint | Hơn 200 cửa hàng và đại lý; public website store page ghi 43 tỉnh thành |
| Partner model | Trang hợp tác kinh doanh thể hiện mô hình đại lý / đối tác / tiêu chuẩn vận hành thương hiệu |
| Customer promise | Chất lượng, trải nghiệm tự tin, đổi trả linh hoạt, bảo hành miễn phí / trọn đời |
| Digital footprint | Website ecommerce, app, tra cứu đơn hàng online, Fanpage, Zalo OA, TikTok / Instagram links |
| Operational complexity | Multi-store, multi-dealer, multi-channel, product variant theo size / màu / kênh |
| ERP signal | CMC Consulting công bố hành trình triển khai SAP Business One cho BQ |

### 4.2 Điểm cần lưu ý về governance

Public source đang có ít nhất một dấu hiệu không đồng nhất:

- Trang hệ thống cửa hàng ghi `43 tỉnh thành`.
- Trang hợp tác kinh doanh ghi `34 tỉnh thành`.

Đây không phải bằng chứng kết luận về vận hành nội bộ, nhưng là tín hiệu rõ rằng AI phải có:

- source citation,
- source priority,
- effective date,
- owner xác nhận,
- cơ chế trả lời khi nguồn mâu thuẫn.

### 4.3 Business model nhìn theo 4 lớp

| Lớp | Vai trò | AI cần hiểu gì |
|-----|---------|----------------|
| Nhà cung cấp | Nguyên vật liệu, phụ kiện, gia công, nhập hàng | Supplier, purchase, lead time, chất lượng, inbound |
| BQ / điều phối thương hiệu | Danh mục, giá, CTKM, kho, đại lý, brand governance | Source-of-truth, policy, rule, escalation owner |
| Cửa hàng / đại lý | POS, tồn kho, bán hàng, đổi trả, CSKH tại điểm bán | Store scope, branch inventory, order, return, transfer |
| Người tiêu dùng | Mua hàng, hỏi sản phẩm, đổi trả, bảo hành, loyalty | Product advice, sales-safe availability, policy answer |

---

## 5. Nguyên Tắc AI Training Cho BQ

### 5.1 Không fine-tune dữ liệu vận hành sống

Không đưa các dữ liệu sau vào fine-tuning model:

- tồn kho,
- giá đang áp dụng,
- CTKM hiệu lực,
- đơn hàng,
- hóa đơn,
- trạng thái giao vận,
- dữ liệu khách hàng,
- loyalty,
- doanh thu / công nợ / tài chính.

Lý do:

- thay đổi liên tục,
- cần phân quyền theo vai trò,
- cần freshness,
- cần audit,
- dễ lỗi nếu model ghi nhớ bản cũ.

### 5.2 Dữ liệu tĩnh / bán tĩnh dùng RAG

RAG phù hợp với:

- brand profile,
- chính sách đổi trả / bảo hành / KHTT,
- SOP,
- FAQ,
- hướng dẫn SAP B1 / KiotViet / Haravan,
- tài liệu đào tạo,
- quy trình xử lý lỗi / escalation,
- policy đã duyệt.

### 5.3 Dữ liệu sống dùng API / Data Warehouse

Nguồn sống phải được truy vấn theo thời điểm hỏi:

- SAP B1 / Data Warehouse: ERP core, item, warehouse, inventory, price list, transfer, BP, order ref.
- KiotViet: branch, product, inventory, invoice, order, return, transfer, customer, promotion.
- Haravan: catalog online, inventory online, order, fulfillment, customer, promotion, channel.
- Excel: chỉ là nguồn phụ trợ / temporary nếu chưa có system owner.

### 5.4 Fine-tuning chỉ sau eval

Fine-tuning chỉ nên mở khi có:

- ít nhất 100-200 câu hỏi thật hoặc gần thật,
- gold answer có source,
- holdout set tối thiểu 30%,
- eval đo accuracy, citation correctness, access-control correctness, hallucination rate.

Fine-tune nên học:

- intent classification,
- answer format,
- tone BQ,
- cách hỏi lại khi thiếu dữ liệu,
- cách từ chối / escalation khi vượt quyền.

---

## 6. Dataset Catalog Cho AI Training / Retrieval

### 6.1 Danh mục tổng hợp

| # | Bộ dữ liệu | File type chuẩn | Độ dài / batch đề xuất | Cơ chế phù hợp | Ghi chú |
|---|------------|-----------------|-------------------------|----------------|--------|
| 1 | Brand profile BQ | `.md` hoặc `.docx` | 1-3 file; 1.000-2.500 từ/file | RAG | Nên có tone, history, positioning, cam kết dịch vụ |
| 2 | Public website pages | HTML crawl -> `.md` | 1 page = 1 file; chunk 700-1.000 tokens | RAG | Lưu URL, crawl date, public/internal flag |
| 3 | Store / dealer network | DB table hoặc `.jsonl` | 1 record/cửa hàng; nếu export thì 2.000 records/file | API / SQL retrieval | Không dùng RAG chính vì cần filter theo location |
| 4 | Product catalog / SKU / variant | DB table, `.parquet`, backup `.jsonl` | 1 row/SKU-size-color; 10.000 rows/file nếu export | API / SQL retrieval | RAG chỉ dùng cho mô tả sản phẩm / tư vấn style |
| 5 | Product content / sales copy | `.jsonl` hoặc `.md` theo product | 1 record/product; 150-500 từ/product | RAG + API hybrid | Dùng cho external sales chatbot |
| 6 | Product images | Image URL / asset table | 1 record/asset; không nhúng binary vào RAG text | Vision / asset retrieval | Dùng image_url, caption, alt_text |
| 7 | Chính sách đổi trả | `.md`, `.docx`, `.pdf` | 1 policy/file; 500-2.500 từ | RAG | Bắt buộc citation và effective date |
| 8 | Chính sách đổi trả online | `.md`, `.docx`, `.pdf` | 1 policy/file; 500-2.500 từ | RAG | Tách với đổi trả cửa hàng |
| 9 | Bảo hành trọn đời | `.md`, `.docx`, `.pdf` | 1 policy/file; 500-2.500 từ | RAG | Có phạm vi áp dụng / kênh mua |
| 10 | Khách hàng thân thiết / loyalty policy | `.md`, `.docx`, `.pdf` | 1 policy/file; 500-3.000 từ | RAG + API loyalty lookup | Rule đọc từ RAG, điểm/hạng đọc từ API |
| 11 | SOP SAP B1 | `.md`, `.docx`, `.pdf` | 1 SOP/process; nếu >3.000 từ tách theo quy trình | RAG | Hỗ trợ hỏi "thao tác trên SAP như thế nào" |
| 12 | SOP KiotViet | `.md`, `.docx`, `.pdf` | 1 SOP/process; nếu >3.000 từ tách theo quy trình | RAG | Store/POS users |
| 13 | SOP Haravan | `.md`, `.docx`, `.pdf` | 1 SOP/process; nếu >3.000 từ tách theo quy trình | RAG | Ecommerce/CSKH users |
| 14 | Excel policy tables | `.xlsx` -> normalized `.csv` + `.md` explanation | 1 sheet = 1 dataset; 5.000 rows/file nếu tabular | Hybrid: structured lookup + RAG explanation | Excel là source phụ trợ, cần owner xác nhận |
| 15 | SAP B1 item master | DB/API + `.json schema` | Không upload raw vào RAG; query theo API | API / Data Warehouse | ERP source |
| 16 | SAP B1 warehouse/store master | DB/API + `.json schema` | Không upload raw vào RAG | API / Data Warehouse | Location scope |
| 17 | SAP B1 inventory availability | API realtime/cache | Cache 30-120 giây nếu cần | API retrieval | Không fine-tune, không RAG |
| 18 | SAP B1 price list | DB/API | Sync 5-15 phút nếu approved | API + source-priority rule | Chỉ trả lời khi có source rule |
| 19 | SAP B1 transfer / inbound | DB/API | Sync 5-15 phút | API retrieval | Logistics / ETA |
| 20 | KiotViet branch | DB/API | Sync 15-60 phút | API retrieval | Branch scope |
| 21 | KiotViet product / barcode | DB/API | Sync 15-30 phút | API retrieval | SKU/barcode mapping |
| 22 | KiotViet inventory | DB/API | Sync 1-5 phút | API retrieval | Tồn chi nhánh nội bộ |
| 23 | KiotViet invoice / order / return / transfer | DB/API | Sync 1-15 phút tùy domain | API retrieval | Internal chatbot only, role gated |
| 24 | KiotViet customer / loyalty | DB/API | Sync 5-15 phút | API + sensitivity rule | Không expose public |
| 25 | KiotViet promotion / voucher / coupon | DB/API | Sync 5-15 phút | API + rule layer | Sales-safe subset riêng |
| 26 | Haravan catalog / variant | DB/API | Sync 15-30 phút | API + RAG product content | Online commerce |
| 27 | Haravan inventory online | DB/API | Sync 1-5 phút | API retrieval | Sales-safe chỉ nên trả `còn/hết` |
| 28 | Haravan orders / fulfillment | DB/API | Sync 1-5 phút | API retrieval | CSKH / ecommerce, role gated |
| 29 | Haravan customer / loyalty | DB/API | Sync 5-15 phút | API + sensitivity rule | Dữ liệu nhạy cảm |
| 30 | Haravan promotion / discount code | DB/API | Sync 5-15 phút | API + sales-safe whitelist | Public-safe cần whitelist |
| 31 | Canonical product mapping | DB table + `.csv` backup | 1 row/mapping; 10.000 rows/file nếu export | Deterministic lookup | Không dùng RAG |
| 32 | Canonical location mapping | DB table + `.csv` backup | 1 row/location mapping | Deterministic lookup | Map SAP warehouse / KiotViet branch / Haravan location |
| 33 | Canonical customer mapping | DB table + `.csv` backup | 1 row/customer mapping | Deterministic lookup | Nhạy cảm, role gated |
| 34 | Canonical order mapping | DB table + `.csv` backup | 1 row/order mapping | Deterministic lookup | Phân biệt SAP order / channel order / MIA order |
| 35 | Source-priority rules | `.md` rulebook + DB rule table | 1 rulebook 1.000-3.000 từ; 1 row/rule | Rule engine + RAG explanation | Bắt buộc cho giá/CTKM/order |
| 36 | User role / data scope | DB table + `.json schema` | 1 row/user-scope hoặc role-scope | Access-control tool | Chạy trước retrieval/render |
| 37 | Chat history / answer audit | DB table; export `.jsonl` cho eval | Retention tối thiểu 180 ngày theo SRS hiện tại | Eval / analytics | Không đưa raw vào RAG đại trà |
| 38 | Gold Q&A eval set | `.jsonl` | Phase 1: 100-200 câu; holdout 30% | Eval + optional fine-tune | Mỗi answer phải có source |
| 39 | External sales chatbot scenario set | `.jsonl` | 50-100 kịch bản tư vấn; answer 100-250 từ | RAG + optional SFT | Public-safe, không dữ liệu nhạy cảm |
| 40 | Forecasting dataset | Data Warehouse table / `.parquet` | 24-36 tháng theo SKU-location-day nếu có | Forecasting ML, không RAG | Phase sau |

### 6.2 Chuẩn metadata bắt buộc cho file RAG

Mỗi file đưa vào vector store phải có metadata tối thiểu:

| Metadata | Ý nghĩa |
|----------|---------|
| `source_system` | Website, MIABOS, SAP B1, KiotViet, Haravan, Excel, Manual |
| `source_url` | URL hoặc source path gốc |
| `document_type` | Brand, Policy, SOP, FAQ, System Guide, Product Content |
| `owner_department` | CSKH, Ecommerce, Store Ops, Finance, Marketing, IT/Data |
| `audience` | Internal, Public, Sales-safe, Manager-only |
| `sensitivity` | Public, Internal, Restricted, Confidential |
| `effective_from` | Ngày bắt đầu hiệu lực |
| `effective_to` | Ngày hết hiệu lực nếu có |
| `approval_status` | Draft, Approved, Deprecated |
| `version` | Version tài liệu |
| `last_reviewed_at` | Ngày review gần nhất |

### 6.3 Chuẩn chunking đề xuất

| Loại tài liệu | Chunk size | Overlap | Ghi chú |
|---------------|------------|---------|--------|
| Policy / SOP | 700-1.000 tokens | 100-150 tokens | Giữ heading và section path |
| FAQ ngắn | 1 Q&A = 1 chunk | 0 | Dễ citation |
| Product content | 1 product hoặc 1 variant group = 1 chunk | 0-100 tokens | Không nhét inventory/price sống |
| Long PDF / manual | 800-1.200 tokens | 150-200 tokens | Tách theo mục lục nếu có |
| Tables converted to text | 1 table hoặc subtable = 1 chunk | 0 | Nếu cần tính toán thì dùng structured lookup |

---

## 7. Cơ Chế AI Theo Từng Nhóm Use Case

### 7.1 AI Internal Chatbot

| Query type | Ví dụ | Retrieval path | Answer requirement |
|------------|-------|----------------|-------------------|
| Policy | "Đơn sale 30% có đổi trả được không?" | RAG policy | Trả lời kèm citation, hiệu lực, điều kiện |
| Data | "Mã này còn hàng ở chi nhánh Đà Nẵng không?" | API/Data Warehouse | Trả số liệu theo scope, source, last_synced_at |
| Mixed | "Mã này đang giảm 30%, đổi size được không?" | API promo + RAG policy | Tách data snapshot và policy explanation |
| Unsupported | "Dự báo tháng sau nên nhập bao nhiêu?" nếu phase 1 chưa mở forecasting | Guardrail | Nêu chưa đủ scope/data, gợi ý bước tiếp theo |

### 7.2 AI External Sales Chatbot

External chatbot chỉ được dùng sales-safe data:

- sản phẩm,
- mô tả,
- hình ảnh,
- giá bán public nếu được whitelist,
- CTKM public nếu được whitelist,
- còn hàng / hết hàng ở mức an toàn,
- chính sách public.

Không được lộ:

- số lượng tồn chi tiết,
- doanh thu,
- công nợ,
- trạng thái thanh toán nội bộ,
- dữ liệu khách hàng riêng tư,
- COD đối soát,
- margin,
- rule CTKM nội bộ.

### 7.3 AI Automation

AI Automation cho Accounting / Finance / HR / Marketing / Content chỉ mở sau khi:

- có business owner từng workflow,
- có approval path,
- có audit,
- có rollback / human approval,
- có rule không để AI tự ghi vào ERP khi chưa có gate.

### 7.4 Forecasting

Forecasting cần dataset riêng:

| Dataset | Granularity đề xuất | Minimum history |
|---------|---------------------|-----------------|
| Sales history | SKU x store/location x day | 24-36 tháng |
| Inventory history | SKU x location x day | 12-24 tháng |
| Promotion calendar | promo x SKU/category/channel x date | 12-24 tháng |
| Price history | SKU x channel x effective date | 12-24 tháng |
| Return history | SKU x location x reason x date | 12-24 tháng |
| Seasonality / holiday | date dimension | 3 năm nếu có |

LLM chỉ nên dùng để giải thích forecast và hỗ trợ hỏi đáp kết quả. Mô hình dự báo thực tế nên là forecasting/ML pipeline trên Data Warehouse.

---

## 8. Target Architecture Đề Xuất

```text
User Question
  -> Intent Classifier
  -> Role / Scope / Sensitivity Check
  -> Query Planner
       -> RAG: policy / SOP / FAQ / brand
       -> API / SQL: SAP B1 / KiotViet / Haravan / Data Warehouse
       -> Rule Engine: source priority / CTKM / price / access
  -> Answer Composer
  -> Citation + Freshness + Warning
  -> Audit Log + Feedback
```

### 8.1 Vector stores đề xuất

| Vector Store | Nội dung | Filter quan trọng |
|--------------|----------|------------------|
| `bq_public_brand_policy` | Website public, brand, policy public | `audience=public`, `sensitivity=public` |
| `bq_internal_policy_sop` | SOP, policy, system guides nội bộ | `department`, `role`, `sensitivity` |
| `bq_product_content_sales_safe` | Product descriptions, style, usage, public-safe selling points | `category`, `gender`, `style`, `sales_safe=true` |
| `bq_system_guides` | SAP B1 / KiotViet / Haravan usage guides | `system`, `role`, `process` |

### 8.2 Structured stores / tools đề xuất

| Tool / Store | Nội dung | Notes |
|--------------|----------|-------|
| `get_product_by_sku` | Product canonical lookup | SKU / barcode / item code |
| `get_availability` | Inventory by source/scope | Realtime or cache |
| `get_price_context` | Price by channel/store type/effective date | Requires source-priority rule |
| `get_promotion_context` | CTKM by scope/channel/time | CTKM là use case data, không phải pain point |
| `get_order_summary` | Order status / summary | Role-gated |
| `get_customer_summary` | Customer/loyalty context | Strict sensitivity |
| `resolve_canonical_mapping` | Product/location/customer/order mapping | Deterministic |
| `check_access_scope` | Role/data scope check | Must run before render |

---

## 9. Implementation Roadmap

### 9.1 Phase 1 — Internal Chatbot + Knowledge

| Priority | Work item | Output |
|----------|-----------|--------|
| P0 | Import policy / SOP / brand docs | RAG vector store with metadata |
| P0 | Build gold Q&A eval set | 100-200 questions, holdout 30% |
| P0 | Define source-priority and access rules | Rulebook + DB rules |
| P1 | Connect product / store / availability read model | API tools |
| P1 | Add answer audit / feedback | Eval and improvement loop |
| P1 | Pilot for internal/content team | Measured adoption and trust |

### 9.2 Phase 2 — External Sales Chatbot

| Priority | Work item | Output |
|----------|-----------|--------|
| P0 | Build sales-safe product content | Public-safe RAG |
| P0 | Whitelist price/CTKM/availability behavior | Guardrailed API layer |
| P1 | Add lead/customer attribute capture | CRM profile enrichment |
| P1 | Add handoff to human / sales advisor | Escalation / lead flow |

### 9.3 Phase 3 — Automation

| Priority | Work item | Output |
|----------|-----------|--------|
| P0 | Select repeatable workflows | Accounting/Finance/HR/Marketing candidates |
| P0 | Define approval / audit / rollback | Governance pack |
| P1 | Build controlled workflow actions | Human-in-the-loop automation |

### 9.4 Phase 4 — Forecasting

| Priority | Work item | Output |
|----------|-----------|--------|
| P0 | Audit Data Warehouse readiness | Data quality report |
| P0 | Build SKU-location-day historical dataset | Forecasting feature table |
| P1 | Pilot demand / trend forecast | Forecast dashboard + explanation |

---

## 10. Open Questions Cần Chốt Với BQ

| # | Question | Owner cần trả lời | Vì sao quan trọng |
|---|----------|-------------------|-------------------|
| 1 | Data Warehouse của BQ đã có schema/roadmap chưa? | IT/Data owner | Quyết định MIABOS query trực tiếp source hay qua DW |
| 2 | Source-of-truth cho giá theo kênh là gì? | Finance / Pricing | Tránh AI trả giá sai |
| 3 | Source-of-truth cho CTKM theo kênh/cửa hàng/đại lý là gì? | Marketing / Trade / Finance | CTKM là use case tra cứu cần rule rõ |
| 4 | Dữ liệu nào được phép dùng cho external chatbot? | Business + Legal/CSKH | Tách public-safe và internal-only |
| 5 | Role/data scope cho từng nhóm user là gì? | IT/Data + PM BQ | Chặn lộ dữ liệu nhạy cảm |
| 6 | Pilot user đầu tiên gồm những ai? | BQ leadership | Xác định bộ câu hỏi/eval thực tế |
| 7 | Ai là owner phê duyệt SOP/policy trong Knowledge Center? | Department owners | RAG chỉ đáng tin nếu tài liệu approved |
| 8 | KPI pilot 8-12 tuần là gì? | Sponsor | Chốt success criteria |

---

## 11. Recommended Pilot Acceptance Metrics

| Metric | Target đề xuất |
|--------|----------------|
| Answer citation coverage | >= 95% câu policy/mixed có citation |
| Freshness display coverage | 100% câu data/mixed có source + last_synced_at |
| Access-control violation | 0 critical incident |
| Answer accuracy on gold eval | >= 85% sau vòng pilot đầu |
| Unsupported/uncertain handling | 100% có lý do và next action |
| Internal lookup time reduction | Giảm 30-50% thời gian tra cứu nhóm pilot |
| Escalation quality | >= 90% escalation có đủ context câu hỏi/source/user/time |

---

## 12. Recommendation Cho Business Owner

Nên trình bày BQ AI Training theo hướng:

1. **Không phải train model bằng toàn bộ dữ liệu BQ.**
2. **AI học tri thức đã duyệt bằng RAG.**
3. **AI tra dữ liệu sống bằng connector/API/Data Warehouse.**
4. **AI luôn trả lời có source, freshness, scope, warning.**
5. **Fine-tune chỉ là phase tối ưu hành vi sau khi có eval.**
6. **Forecasting tách thành phase data readiness riêng.**

Thông điệp proposal nên dùng:

> Với BQ, MIABOS không thay thế SAP B1, KiotViet, Haravan hay Data Warehouse của BQ. MIABOS đóng vai trò Core AI CRM Platform: đọc dữ liệu được cấp quyền, hiểu tri thức đã duyệt, trả lời có nguồn, tạo Conversation và Knowledge, rồi từng bước mở rộng sang sales chatbot, automation và forecasting khi dữ liệu đủ sẵn sàng.

---

## 13. Quality Checklist

- [x] Có research thương hiệu BQ từ public + BQ pack nội bộ.
- [x] Có phân loại dataset theo file type.
- [x] Có độ dài / batch đề xuất cho từng dataset.
- [x] Có phân loại RAG / API retrieval / fine-tune / forecasting.
- [x] Không gọi CTKM là pain point.
- [x] Không đưa Lark vào BQ operation.
- [x] Giữ MIABOS đúng vai trò Core AI CRM Platform.
- [x] Tách rõ BQ Data Warehouse là source-of-truth mục tiêu của BQ.
- [x] Có open questions cho discovery tiếp theo.
