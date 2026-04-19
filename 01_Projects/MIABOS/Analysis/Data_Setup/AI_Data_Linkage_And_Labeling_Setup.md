# AI Data Linkage & Labeling Setup — MIABOS / Giày BQ

**Status**: Draft  
**Owner**: A03 BA Agent + A05 Tech Lead Agent  
**Last Updated By**: Codex CLI (GPT-5.4 Codex environment)  
**Last Reviewed By**: -  
**Approval Required**: PM / Business Owner  
**Approved By**: -  
**Last Status Change**: 2026-04-19  
**Source of Truth**: This document after PM/Business Owner approval  
**Blocking Reason**: Cần Business Owner / BQ xác nhận source-of-truth rules, role scope, và danh mục nhãn nghiệp vụ cuối cùng  
**Related Research**: [RES-BQ-AIT-001_BQ_Brand_And_AI_Training_Data_Research.md](../../Research/BQ_AI_Training/RES-BQ-AIT-001_BQ_Brand_And_AI_Training_Data_Research.md)

---

## 1. Mục Đích

Tài liệu này định nghĩa cách setup bộ dữ liệu cho AI trong MIABOS/BQ để AI truy xuất nhanh, đúng nguồn, đúng quyền, và có khả năng liên kết giữa:

1. **Master Data / Operational Objects**: sản phẩm, giá, kho, cửa hàng, khách hàng, đơn hàng, CTKM, tồn kho, hệ thống nguồn.
2. **Knowledge Data**: chính sách, SOP, FAQ, hướng dẫn hệ thống, quy trình nội bộ, tài liệu training trong Knowledge Center.
3. **Interaction / Eval Data**: câu hỏi, câu trả lời, feedback, audit, escalation, bộ câu hỏi chuẩn dùng để đánh giá và tối ưu AI.

Điểm cốt lõi: AI không "học nhanh hơn" chỉ vì có nhiều dữ liệu. AI truy xuất nhanh và đúng hơn khi dữ liệu được:

- có định danh chuẩn,
- có link quan hệ giữa các object,
- có metadata/label rõ,
- có source priority rule,
- có access scope,
- có eval set để đo chất lượng.

---

## 2. Nguyên Tắc Thiết Kế

### 2.1 Tách 3 lớp dữ liệu

| Lớp | Ví dụ | Cơ chế lưu / truy xuất | AI dùng thế nào |
|-----|------|------------------------|-----------------|
| Master Data / Operational Objects | Product, SKU, price, warehouse, store, inventory, order, customer, promotion | Sync thành object/read model trong MIABOS hoặc đọc qua BQ Data Warehouse/API | Query có cấu trúc, filter, join, freshness |
| Knowledge Data | SOP, policy, FAQ, system guide, warranty/return rules | Knowledge Center + vector index + metadata | RAG có citation và effective date |
| Interaction / Eval Data | chat logs, answer snapshot, user feedback, escalation, gold Q&A | Audit DB + eval dataset `.jsonl` | Đo chất lượng, fine-tune hành vi nếu đủ dữ liệu |

### 2.2 Không dùng một cơ chế cho mọi thứ

| Dữ liệu | Không nên | Nên |
|---------|-----------|-----|
| Tồn kho, giá, đơn hàng, khách hàng | Nhét vào RAG hoặc fine-tune | API/SQL retrieval + source/freshness |
| Policy, SOP, FAQ | Hardcode trong prompt | RAG + citation + metadata |
| Quan hệ sản phẩm - policy - CTKM | Để AI tự suy luận | Link table / graph edge / metadata filter |
| Access control | Dựa vào model tự nhớ | Rule engine + role/scope check trước render |
| Cải thiện format trả lời | Tăng thêm data source | Eval + prompt + optional fine-tune sau pilot |

### 2.3 Master Data không phải Knowledge, nhưng phải link được với Knowledge

Ví dụ:

- Product `BQ-D-TH932` link tới:
  - `Product Category = Dép nam`,
  - `Size Guide = Size nam`,
  - `Return Policy = Đổi trả 30 ngày`,
  - `Warranty Policy = Bảo hành trọn đời`,
  - `Promotion Rule = Sale >=25% chỉ đổi size`,
  - `Store Availability = availability API`.

Nếu không có link, AI có thể lấy đúng product nhưng trả sai policy; hoặc lấy đúng policy nhưng áp sai cho sản phẩm / kênh / CTKM.

---

## 3. Data Object Model Đề Xuất

### 3.1 Canonical object

Mọi master data nên được chuẩn hóa về canonical object trước khi AI dùng.

| Field | Required | Description |
|-------|----------|-------------|
| `canonical_object_id` | Có | ID chuẩn của MIABOS, không phụ thuộc source |
| `entity_type` | Có | `product`, `variant`, `store`, `warehouse`, `customer`, `order`, `promotion`, `policy`, `sop`, `faq` |
| `canonical_code` | Có | Code dễ đọc, ví dụ SKU, store code, promo code |
| `display_name` | Có | Tên hiển thị cho user |
| `source_system` | Có | `SAP_B1`, `KiotViet`, `Haravan`, `BQ_DW`, `MIABOS`, `Excel`, `Website` |
| `source_ref` | Có | ID gốc trong hệ thống nguồn |
| `status` | Có | `active`, `inactive`, `draft`, `deprecated`, `needs_review` |
| `business_domain` | Có | `catalog`, `inventory`, `pricing`, `promotion`, `order`, `customer`, `knowledge`, `service` |
| `sensitivity_level` | Có | `public`, `internal`, `restricted`, `confidential` |
| `last_synced_at` | Có nếu source sống | Độ mới dữ liệu |
| `effective_from` | Có nếu có hiệu lực | Ngày bắt đầu hiệu lực |
| `effective_to` | Nên có | Ngày hết hiệu lực |

### 3.2 Source object mapping

Dùng để map cùng một thực thể giữa SAP B1 / KiotViet / Haravan / BQ Data Warehouse / MIABOS.

| Field | Required | Description |
|-------|----------|-------------|
| `mapping_id` | Có | ID mapping |
| `canonical_object_id` | Có | Link về canonical object |
| `source_system` | Có | Source |
| `source_object_type` | Có | Loại object trong source |
| `source_object_id` | Có | ID gốc |
| `source_code` | Nên có | Mã trong source |
| `confidence` | Có | `exact`, `high`, `medium`, `low`, `manual_verified` |
| `mapping_status` | Có | `active`, `needs_review`, `conflict`, `deprecated` |
| `verified_by` | Nên có | Người xác nhận |
| `verified_at` | Nên có | Thời điểm xác nhận |

### 3.3 Knowledge document

Knowledge Center không chỉ lưu text. Mỗi tài liệu cần metadata đủ để AI filter trước khi semantic search.

| Field | Required | Description |
|-------|----------|-------------|
| `knowledge_document_id` | Có | ID tài liệu |
| `document_type` | Có | `policy`, `sop`, `faq`, `system_guide`, `training`, `brand`, `announcement` |
| `knowledge_topic` | Có | `return_policy`, `warranty`, `pricing`, `promotion`, `store_operation`, `system_usage` |
| `business_domain` | Có | Domain nghiệp vụ |
| `owner_department` | Có | Phòng ban owner |
| `audience` | Có | `public`, `internal`, `sales_safe`, `manager_only` |
| `sensitivity_level` | Có | `public`, `internal`, `restricted`, `confidential` |
| `approval_status` | Có | `draft`, `approved`, `deprecated`, `needs_review` |
| `effective_from` | Có | Hiệu lực |
| `effective_to` | Nên có | Hết hiệu lực |
| `source_url_or_file` | Có | Link source |
| `version` | Có | Version |
| `last_reviewed_at` | Nên có | Ngày review |

### 3.4 Knowledge chunk

Chunk là đơn vị AI search trong vector store. Chunk phải giữ context của document.

| Field | Required | Description |
|-------|----------|-------------|
| `chunk_id` | Có | ID chunk |
| `knowledge_document_id` | Có | Link document |
| `section_path` | Có | Ví dụ `Policy > Return > Online > Sale >=25%` |
| `chunk_text` | Có | Text được index |
| `chunk_type` | Có | `rule`, `procedure_step`, `faq_answer`, `definition`, `example`, `table_summary` |
| `business_domain` | Có | Domain |
| `related_entity_type` | Nên có | Product / promotion / order / store nếu có |
| `related_canonical_object_ids` | Nên có | Danh sách object liên quan |
| `effective_from` | Có | Kế thừa từ document hoặc override |
| `effective_to` | Nên có | Kế thừa từ document hoặc override |
| `sensitivity_level` | Có | Kế thừa từ document |

---

## 4. Link Data Với Nhau Bằng Cơ Chế Nào?

### 4.1 Cơ chế 1 — Canonical ID

Mọi hệ thống nguồn có thể dùng mã khác nhau, nhưng MIABOS cần một ID chuẩn để AI join dữ liệu.

Ví dụ:

| Source | Source ID | Canonical Object |
|--------|-----------|------------------|
| SAP B1 | `ITEM-TH932` | `product:BQ-D-TH932` |
| KiotViet | `KV-PROD-9912` | `product:BQ-D-TH932` |
| Haravan | `HAR-VAR-7821` | `product:BQ-D-TH932` |

AI không nên tự đoán các mã này giống nhau. Mapping phải do hệ thống resolve trước.

### 4.2 Cơ chế 2 — Relationship / Edge Table

Cần một bảng link quan hệ giữa Master Data và Knowledge.

Đề xuất collection/table: `ai_data_relationship`

| Field | Required | Description |
|-------|----------|-------------|
| `relationship_id` | Có | ID quan hệ |
| `source_entity_type` | Có | Loại entity nguồn |
| `source_entity_id` | Có | ID nguồn |
| `target_entity_type` | Có | Loại entity đích |
| `target_entity_id` | Có | ID đích |
| `relationship_type` | Có | Loại quan hệ |
| `confidence` | Có | `system`, `manual_verified`, `inferred`, `needs_review` |
| `valid_from` | Có | Hiệu lực |
| `valid_to` | Nên có | Hết hiệu lực |
| `created_by` | Có | System/user |
| `review_status` | Có | `active`, `needs_review`, `deprecated` |

Các `relationship_type` chuẩn:

| Relationship Type | Ý nghĩa | Ví dụ |
|-------------------|---------|-------|
| `applies_to` | Knowledge/rule áp dụng cho object | Return policy applies to product category |
| `explains` | Tài liệu giải thích object/rule | SOP explains SAP inventory lookup |
| `depends_on` | Dữ liệu/tri thức phụ thuộc nguồn khác | Promotion answer depends on price rule |
| `supersedes` | Tài liệu mới thay tài liệu cũ | Policy v2026 supersedes v2025 |
| `conflicts_with` | Có xung đột cần review | Website says 43 provinces, partner page says 34 |
| `derived_from` | Read model sinh ra từ source | MIABOS product derived from SAP item |
| `same_as` | Hai object là cùng thực thể | KiotViet product same as SAP item |
| `restricted_by` | Bị giới hạn bởi quyền/scope | Finance report restricted by role |
| `recommended_for` | Dùng cho tư vấn/gợi ý | Product recommended for office style |
| `owned_by` | Owner nghiệp vụ | Promotion policy owned by Marketing/Trade |

### 4.3 Cơ chế 3 — Metadata Filter Trước Semantic Search

Không nên search toàn bộ Knowledge Center rồi để model tự chọn. Query phải được route và filter.

Ví dụ:

User hỏi: `Mã TH932 đang sale 30%, khách online muốn đổi size được không?`

Query planner nên filter:

```json
{
  "document_type": ["policy", "faq"],
  "knowledge_topic": ["return_policy", "promotion_policy"],
  "audience": ["public", "sales_safe", "internal"],
  "business_domain": ["promotion", "service"],
  "approval_status": "approved",
  "effective_at": "today"
}
```

Sau đó mới semantic search trong tập đã filter.

### 4.4 Cơ chế 4 — Graph Expansion

Với câu hỏi mixed, AI cần mở rộng từ object sang knowledge liên quan.

Ví dụ luồng:

1. Resolve `TH932` -> `product:BQ-D-TH932`.
2. Query promotion context -> đang sale 30%.
3. Graph lookup:
   - product -> category `Dép nam`,
   - promotion -> rule `sale >=25%`,
   - rule -> return policy chunk.
4. RAG lấy đúng policy chunk.
5. Answer composer trả lời: kết luận + data snapshot + policy citation.

### 4.5 Cơ chế 5 — Source Priority Rule

Nếu một câu hỏi có nhiều nguồn, AI phải biết nguồn nào thắng.

Đề xuất rule table: `source_priority_rule`

| Field | Description |
|-------|-------------|
| `rule_id` | ID |
| `business_domain` | `inventory`, `pricing`, `promotion`, `order`, `customer`, `policy` |
| `context_scope` | Kênh / cửa hàng / role / public/internal |
| `primary_source` | Nguồn chính |
| `fallback_source` | Nguồn fallback |
| `conflict_behavior` | `block`, `warn`, `escalate`, `show_both` |
| `effective_from` / `effective_to` | Hiệu lực |
| `approved_by` | Người duyệt |

Ví dụ:

| Domain | Context | Primary | Fallback | Conflict Behavior |
|--------|---------|---------|----------|-------------------|
| Inventory | Store internal | KiotViet / BQ DW | SAP B1 snapshot | warn + show freshness |
| Inventory | ERP control | SAP B1 / BQ DW | KiotViet | warn |
| Promotion | Online sales | Haravan / BQ DW | Manual approved policy | block if conflict |
| Policy | Return/warranty | Knowledge Center approved doc | Website public page | show approved doc |

---

## 5. Labeling Taxonomy Đề Xuất

### 5.1 Nhãn bắt buộc cho Master Data

| Label | Example | Purpose |
|-------|---------|---------|
| `entity_type` | `product`, `store`, `promotion` | Query routing |
| `business_domain` | `catalog`, `pricing`, `inventory` | Filter |
| `source_system` | `SAP_B1`, `KiotViet`, `Haravan`, `BQ_DW` | Citation/freshness |
| `canonical_code` | `BQ-D-TH932` | Join |
| `category` | `dep_nam`, `giay_nu`, `phu_kien` | Product matching |
| `channel_scope` | `store`, `online`, `social`, `all` | Policy/price/promo applicability |
| `store_scope` | `da_nang`, `mien_trung`, `all` | Inventory/promo scope |
| `audience` | `internal`, `public`, `sales_safe` | Answer boundary |
| `sensitivity_level` | `public`, `restricted` | Access control |
| `freshness_status` | `fresh`, `stale`, `unknown` | Warning |
| `approval_status` | `active`, `needs_review` | Trust |

### 5.2 Nhãn bắt buộc cho Knowledge

| Label | Example | Purpose |
|-------|---------|---------|
| `document_type` | `policy`, `sop`, `faq`, `system_guide` | Retrieval route |
| `knowledge_topic` | `return_policy`, `warranty`, `promotion_policy` | Narrow search |
| `business_domain` | `service`, `promotion`, `inventory` | Link với master data |
| `owner_department` | `CSKH`, `Marketing`, `Finance`, `IT/Data` | Governance |
| `audience` | `public`, `internal`, `sales_safe` | Prevent leakage |
| `sensitivity_level` | `public`, `internal`, `restricted`, `confidential` | Access control |
| `approval_status` | `approved`, `draft`, `deprecated` | Only approved docs answer |
| `effective_from` | `2026-01-01` | Time validity |
| `effective_to` | `2026-12-31` | Time validity |
| `related_entity_type` | `product_category`, `promotion`, `order` | Graph expansion |
| `related_entity_ids` | `category:dep_nam` | Object linkage |
| `version` | `v2026.01` | Superseding |

### 5.3 Nhãn cho Interaction / Eval Data

| Label | Example | Purpose |
|-------|---------|---------|
| `intent_type` | `Policy`, `Data`, `Mixed`, `Unsupported` | Eval routing |
| `expected_sources` | `policy:return_online`, `api:inventory` | Citation check |
| `role_context` | `CSKH`, `Store Manager`, `Sales Online` | Permission eval |
| `answer_quality` | `accepted`, `rejected`, `needs_review` | Improvement loop |
| `failure_reason` | `wrong_source`, `stale_data`, `missing_permission`, `hallucination` | Error analysis |
| `escalated` | `true/false` | Measure unresolved cases |
| `gold_answer_id` | `eval-gold-001` | Fine-tune/eval linkage |

---

## 6. Retrieval Flow Chuẩn

### 6.1 Query classification

Mỗi câu hỏi phải được classify trước:

| Intent | Meaning | Retrieval |
|--------|---------|-----------|
| `Policy` | Chỉ hỏi chính sách / quy trình | Knowledge RAG |
| `Data` | Chỉ hỏi số liệu / trạng thái object | API / SQL |
| `Mixed` | Vừa data vừa policy | API / SQL + RAG + rule |
| `Unsupported` | Ngoài scope hoặc thiếu data | Block / clarify / escalate |

### 6.2 Flow tổng quát

```text
User Question
  -> Normalize entity names / SKU / store / date
  -> Classify intent: Policy / Data / Mixed / Unsupported
  -> Resolve canonical objects
  -> Check role + data scope
  -> Apply source-priority rules
  -> Retrieve:
       Data intent: API/SQL/Data Warehouse
       Policy intent: metadata-filtered RAG
       Mixed intent: API/SQL + graph-linked RAG
  -> Compose answer:
       conclusion
       data snapshot if any
       policy explanation if any
       source/citation
       freshness
       warning
       next action/escalation
  -> Write audit
```

### 6.3 Mixed answer example

User hỏi:

> Mã TH932 đang giảm 30%, khách mua online muốn đổi màu được không?

System steps:

1. Resolve product `TH932`.
2. Query promotion/price context.
3. Detect sale >=25%.
4. Graph link to return policy online.
5. Retrieve approved return policy chunk.
6. Answer:
   - Nếu sale >=25%, chỉ hỗ trợ đổi size nếu còn hàng, không hỗ trợ đổi màu/mẫu khác hoặc trả hàng.
   - Source: Promotion API + Return Policy Online.
   - Freshness: promotion checked at timestamp.

---

## 7. Directus / MIABOS Collection Gợi Ý

| Collection | Purpose |
|------------|---------|
| `canonical_objects` | Lưu canonical entity cho product/store/customer/order/promotion/knowledge |
| `source_object_mappings` | Map source IDs từ SAP/KiotViet/Haravan/BQ DW về canonical ID |
| `ai_data_relationships` | Link object-object, object-knowledge, knowledge-knowledge |
| `source_priority_rules` | Rule chọn nguồn đúng theo domain/context |
| `knowledge_documents` | Tài liệu Knowledge Center |
| `knowledge_chunks` | Chunk index metadata |
| `knowledge_document_assets` | Hình ảnh/bảng/attachment/source file |
| `ai_label_taxonomy` | Danh mục nhãn chuẩn |
| `ai_label_assignments` | Gán nhãn cho object/document/chunk |
| `user_scope_profiles` | Role, department, branch/channel/data scope |
| `chat_answer_snapshots` | Snapshot câu trả lời |
| `chat_audit_logs` | Log câu hỏi/câu trả lời/source |
| `ai_eval_cases` | Bộ câu hỏi đánh giá |
| `ai_eval_results` | Kết quả eval theo model/prompt/version |

---

## 8. Quy Trình Setup Dữ Liệu

### Step 1 — Chốt taxonomy

Chốt danh mục nhãn:

- `business_domain`,
- `knowledge_topic`,
- `document_type`,
- `entity_type`,
- `audience`,
- `sensitivity_level`,
- `channel_scope`,
- `store_scope`,
- `source_system`,
- `intent_type`.

### Step 2 — Sync Master Data vào canonical objects

Nguồn:

- SAP B1,
- KiotViet,
- Haravan,
- BQ Data Warehouse khi sẵn sàng,
- Excel tạm thời nếu được BQ duyệt.

Output:

- `canonical_objects`,
- `source_object_mappings`,
- `last_synced_at`,
- `freshness_status`.

### Step 3 — Import Knowledge vào Knowledge Center

Nguồn:

- policy,
- SOP,
- FAQ,
- system guide,
- website public,
- approved internal docs.

Output:

- `knowledge_documents`,
- `knowledge_chunks`,
- `knowledge_document_assets`,
- vector index.

### Step 4 — Gắn link giữa Master Data và Knowledge

Tạo `ai_data_relationships`.

Ví dụ:

- `product_category:dep_nam` `applies_to` `policy:return_30_days`.
- `promotion_rule:sale_ge_25` `applies_to` `policy:return_online_sale_condition`.
- `system:SAP_B1` `explained_by` `system_guide:sap_inventory_lookup`.
- `store:da_nang` `restricted_by` `scope:region_mien_trung`.

### Step 5 — Chốt source-priority rules

Không mở chatbot data/mixed cho giá/CTKM/order nếu chưa có rule.

### Step 6 — Build eval set

Tạo `ai_eval_cases` theo nhóm:

- 30% Policy,
- 30% Data,
- 30% Mixed,
- 10% Unsupported / access blocked.

Mỗi eval case cần:

- user role,
- question,
- expected intent,
- expected source,
- expected answer points,
- expected access decision,
- expected citation.

---

## 9. Labeling Guideline Theo Ví Dụ

### 9.1 Policy đổi trả online

```json
{
  "document_type": "policy",
  "knowledge_topic": "return_policy",
  "business_domain": "service",
  "audience": ["public", "sales_safe", "internal"],
  "sensitivity_level": "public",
  "approval_status": "approved",
  "effective_from": "2026-01-01",
  "related_entity_type": ["promotion_rule", "order_channel"],
  "related_entity_ids": ["promotion_rule:sale_ge_25", "channel:online"]
}
```

### 9.2 Product SKU

```json
{
  "entity_type": "product_variant",
  "business_domain": "catalog",
  "source_system": "SAP_B1",
  "canonical_code": "BQ-D-TH932-BLACK-40",
  "category": "dep_nam",
  "channel_scope": ["store", "online"],
  "audience": ["internal", "sales_safe"],
  "sensitivity_level": "public",
  "status": "active"
}
```

### 9.3 Promotion

```json
{
  "entity_type": "promotion",
  "business_domain": "promotion",
  "source_system": "BQ_DW",
  "canonical_code": "PROMO-WEB-30",
  "channel_scope": ["online"],
  "store_scope": ["all"],
  "audience": ["internal", "sales_safe"],
  "sensitivity_level": "internal",
  "effective_from": "2026-04-01",
  "effective_to": "2026-04-30",
  "approval_status": "active"
}
```

---

## 10. Quality Gates Cho Data Setup

Không được mở AI trả lời production nếu chưa đạt:

- [ ] Master Data có canonical ID.
- [ ] Source object mapping có trạng thái `active` hoặc `manual_verified` cho domain pilot.
- [ ] Knowledge document dùng cho trả lời phải `approved`.
- [ ] Knowledge chunk có metadata đủ để filter.
- [ ] `ai_data_relationships` có ít nhất link cho product category, policy, promotion rule, source system guide.
- [ ] Source-priority rules đã chốt cho `inventory`, `pricing`, `promotion`, `order`, `policy`.
- [ ] Role/data scope đã cấu hình.
- [ ] Mixed answer test pass: data snapshot + policy explanation + citation + freshness.
- [ ] Eval set có đủ Policy/Data/Mixed/Unsupported.
- [ ] Audit log ghi lại source và link object/knowledge đã dùng.

---

## 11. Open Questions

| # | Question | Owner | Why |
|---|----------|-------|-----|
| 1 | BQ Data Warehouse sẽ cấp canonical ID hay MIABOS tạm tạo canonical ID? | IT/Data BQ + A05 | Quyết định mapping authority |
| 2 | Source-of-truth cho giá theo channel/store type là gì? | Finance/Pricing BQ | Tránh AI trả giá sai |
| 3 | Source-of-truth cho CTKM theo channel/store/promo type là gì? | Marketing/Trade + Finance | Cần rule cho mixed answer |
| 4 | Knowledge Center owner theo từng document type là ai? | BQ Department Owners | Tránh tài liệu chưa duyệt được dùng |
| 5 | Bộ nhãn `business_domain` và `knowledge_topic` dùng tiếng Việt hay English-safe code? | PM + A03 | Cần ổn định giữa tool và AI |
| 6 | External chatbot được dùng những labels nào là sales-safe? | Business Owner + CSKH/Sales | Chặn lộ dữ liệu nội bộ |

---

## 12. Recommendation

Nên setup dữ liệu AI của BQ theo hướng **Object Graph + Metadata-filtered RAG + Structured Retrieval**:

1. Master Data được sync thành object/read model có canonical ID.
2. Knowledge Center lưu policy/SOP/FAQ có metadata, chunk, asset và citation.
3. Một bảng relationship nối object với knowledge, knowledge với knowledge, object với object.
4. Label taxonomy dùng chung cho master data, knowledge và eval.
5. Query planner dùng label để filter trước, graph để mở rộng context, rồi mới gọi RAG/API.
6. Fine-tuning chỉ dùng sau khi có eval, không dùng để thay thế linkage/labeling.

Nếu làm đúng, AI không cần "nhớ nhiều hơn"; AI sẽ **tìm đúng hơn, nhanh hơn, có nguồn hơn, và ít hallucinate hơn**.
