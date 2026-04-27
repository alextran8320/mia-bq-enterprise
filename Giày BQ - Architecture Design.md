---
title: Giày BQ - Architecture Design
date: 2026-04-19
---

## 1. Architecture Tổng Thể

### 1.1 Kiến trúc High-Level

```mermaid
graph TB
    subgraph "USER INTERFACE LAYER"
        WebPortal[Web Portal<br/>Admin · Sales · CSKH]
        ZaloOA[Zalo OA / Website<br/>Khách hàng]
        FB[Facebook Messenger<br/>Khách hàng]
    end

    subgraph "API GATEWAY"
        Gateway[NestJS Gateway<br/>Auth · RBAC · Rate Limit · Audit]
    end

    subgraph "AI ORCHESTRATION LAYER"
        Router[Intent Router]
        AgentP1[P1 · Internal FAQ Agent]
        AgentP2[P2 · CRM Agent]
        AgentP3[P3 · Sales Advisor Agent]
        ToolReg[Tool Registry<br/>MCP Servers]
    end

    subgraph "LLM PROVIDERS"
        GeminiPro[Gemini 2.5 Pro<br/>Complex tasks]
        GeminiFlash[Gemini 2.5 Flash<br/>Fast · cheap]
        ClaudeFB[Claude Sonnet<br/>Fallback]
    end

    subgraph "KNOWLEDGE & DATA LAYER"
        KG[(Knowledge Graph<br/>Customer 360 · SP · Đơn)]
        Vec[(Vector DB<br/>SOP · Policy · FAQ)]
        Cache[(Redis<br/>Cache · Queue)]
        PG[(PostgreSQL<br/>App · Audit · Staging)]
        Search[Full-text Search<br/>Catalog SP]
    end

    subgraph "INTEGRATION & SYNC LAYER"
        Queue[Message Queue<br/>+ DLQ]
        Webhook[Webhook Receiver<br/>Haravan · KiotViet]
        Cron[Cron Scheduler<br/>Polling SAP]
        Workers[Worker Pool<br/>ETL · Entity Resolver · Conflict Detection]
        PIIMask[PII Masking Layer]
    end

    subgraph "DATA SOURCES"
        SAP[SAP B1<br/>ERP · Read-only]
        KV[KiotViet<br/>POS]
        Hara[Haravan<br/>Web]
        Docs[Lark / Excel<br/>SOP · Policy]
    end

    WebPortal --> Gateway
    ZaloOA --> Gateway
    FB --> Gateway

    Gateway --> Router
    Router --> AgentP1
    Router --> AgentP2
    Router --> AgentP3

    AgentP1 --> ToolReg
    AgentP2 --> ToolReg
    AgentP3 --> ToolReg

    AgentP1 --> GeminiPro
    AgentP2 --> GeminiPro
    AgentP3 --> GeminiFlash
    Router --> GeminiFlash
    AgentP2 -.fallback.-> ClaudeFB

    ToolReg --> KG
    ToolReg --> Vec
    ToolReg --> Cache
    ToolReg --> PG
    ToolReg --> Search

    GeminiPro -.qua.-> PIIMask
    GeminiFlash -.qua.-> PIIMask

    SAP --> Cron
    KV --> Webhook
    Hara --> Webhook
    Docs --> Workers

    Cron --> Queue
    Webhook --> Queue
    Queue --> Workers
    Workers --> KG
    Workers --> Vec
    Workers --> PG

    style GeminiPro fill:#4ecdc4
    style GeminiFlash fill:#a8dadc
    style KG fill:#ffe66d
    style Queue fill:#a8dadc
    style PIIMask fill:#e63946
```


---

## 2. Tech Stack

### 2.1 Tận dụng từ `mia-chatbot` hiện tại

| Tier            | Công nghệ                                    |
| --------------- | -------------------------------------------- |
| Backend         | NestJS (modular monolith, 11 domain modules) |
| Frontend        | React + TanStack Router + MUI                |
| ORM + DB        | Drizzle ORM + PostgreSQL                     |
| Auth            | Better-Auth (multi-tenant + RBAC)            |
| API             | oRPC (type-safe RPC)                         |
| Background jobs | Trigger.dev                                  |
| Monorepo        | Turborepo                                    |

### 2.2 Components bổ sung

| Component         | Lựa chọn                                      | Mục đích                         | Phí     |
| ----------------- | --------------------------------------------- | -------------------------------- | ------- |
| Graph DB          | **Neo4j Community** (đánh giá Apache AGE sau) | Customer 360 + relationships     | Free    |
| Vector DB         | **pgvector**                                  | SOP/Policy/FAQ embeddings        | Free    |
| Message Queue     | **Redis Streams**                             | Sync pipeline + DLQ              | Free    |
| Cache             | **Redis 7.x** (hoặc Valkey)                   | Session + hot cache + rate limit | Free    |
| Full-text Search  | **Meilisearch**                               | Tìm SP (Vietnamese tốt)          | Free    |
| MCP Servers       | **TypeScript** (`@modelcontextprotocol/sdk`)  | 1 server / data source           | Free    |
| Tool Registry     | **TypeScript** (Vercel AI SDK / Mastra)       | Align stack, reuse Drizzle + Zod | Free    |
| Embeddings        | **bge-m3** self-host                          | Multilingual VN                  | Free    |
| PII Masking       | **Microsoft Presidio** + VN rules             | Trước khi gọi cloud LLM          | Free    |
| LLM Observability | **Langfuse** self-host                        | Trace · Cost · Latency           | Free    |
| **LLM Primary**   | **Gemini 2.5 Pro / Flash** (Paid)             | Generation chính                 | $/tháng |


---

## 3. Chiến Lược Đồng Bộ Data

### 3.1 Sơ đồ Sync Layer

```mermaid
graph LR
    subgraph "DATA SOURCES"
        SAP[SAP B1]
        KV[KiotViet]
        Hara[Haravan]
        Docs[Lark/Excel]
    end

    subgraph "INGESTION"
        Cron[Cron Polling<br/>SAP 5-15 min]
        WH[Webhook Receiver<br/>HMAC + Idempotency]
        Up[Doc Uploader]
    end

    subgraph "QUEUE - Redis Streams"
        QSap[sync.sap.*]
        QHara[sync.haravan.*]
        QKv[sync.kiotviet.*]
        QRetry[sync.retry<br/>exponential]
        QDLQ[sync.dlq<br/>alert]
    end

    subgraph "WORKERS"
        WEtl[ETL · Normalize]
        WEr[Entity Resolver<br/>SKU / Phone]
        WConf[Conflict Detector]
        WEmb[Embedding Worker]
    end

    subgraph "STORES"
        KG[(Knowledge Graph)]
        PG[(PostgreSQL)]
        Vec[(pgvector)]
        Meili[Meilisearch]
    end

    SAP --> Cron --> QSap
    KV --> WH --> QKv
    Hara --> WH --> QHara
    Docs --> Up

    QSap --> WEtl
    QHara --> WEtl
    QKv --> WEtl
    Up --> WEmb

    WEtl --> WEr --> WConf
    WConf --> KG
    WConf --> PG
    WConf --> Meili
    WEmb --> Vec

    QSap -.fail.-> QRetry
    QHara -.fail.-> QRetry
    QKv -.fail.-> QRetry
    QRetry -.5x fail.-> QDLQ

    style QDLQ fill:#e63946
    style WConf fill:#ffd166
    style KG fill:#ffe66d
```


---

## 4. Bảo Mật Data & Lựa Chọn LLM

**Trích Gemini API Terms:**
> **Unpaid:** *"Google uses the content you submit to the Services and any generated responses to provide, improve, and develop Google products and services."*
>
> **Paid:** *"Google doesn't use your prompts (including system instructions, cached content, and files such as images, videos, or documents) or responses to improve our products."*

**Nguồn:**
- [Gemini API Terms — Data Use (Paid)](https://ai.google.dev/gemini-api/terms#data-use-paid)
- [Google Processor Terms (DPA)](https://business.safety.google/processorterms/)
- [Anthropic Privacy Policy](https://www.anthropic.com/legal/privacy)
---



*Document owner: MIA Tech Team · Last updated: 2026-04-19*
