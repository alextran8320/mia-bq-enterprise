# Feature Dependency Map

## Dependency Graph

```mermaid
graph TD
    subgraph Integration
        I01[I01 Integration Orchestrator]
        I02[I02 SAP B1 Connector]
        I03[I03 Haravan Connector]
        I04[I04 KiotViet Connector]
        I05[I05 Canonical Mapping and Source of Truth]
    end

    subgraph Business_Modules
        M01[M01 Product]
        M02[M02 Inventory Availability]
        M03[M03 Pricing]
        M04[M04 Promotion]
        M05[M05 Order and Fulfillment]
        M06[M06 Customer and CRM]
        M07[M07 Access Control and Sensitivity]
        M08[M08 Knowledge and Policy]
        M09[M09 Internal AI Chat]
        M10[M10 Sales Advisor AI]
        M11[M11 Escalation and Workflow]
        M12[M12 Audit and Observability]
    end

    I02 --> M01
    I02 --> M02
    I02 --> M03
    I02 --> M04
    I02 --> M05
    I02 --> M06

    I03 --> M01
    I03 --> M02
    I03 --> M03
    I03 --> M04
    I03 --> M05
    I03 --> M06

    I04 --> M01
    I04 --> M02
    I04 --> M03
    I04 --> M04
    I04 --> M05
    I04 --> M06

    I05 --> M01
    I05 --> M02
    I05 --> M03
    I05 --> M04
    I05 --> M05
    I05 --> M06

    M01 --> M09
    M02 --> M09
    M03 --> M09
    M04 --> M09
    M05 --> M09
    M06 --> M09
    M07 --> M09
    M08 --> M09

    M01 --> M10
    M02 --> M10
    M03 --> M10
    M04 --> M10
    M06 --> M10
    M07 --> M10

    M09 --> M11
    M10 --> M11

    I01 --> M12
    I02 --> M12
    I03 --> M12
    I04 --> M12
    I05 --> M12
    M09 --> M12
    M10 --> M12
    M11 --> M12
```

## Structural Rule

- `Integration` là layer cấp dữ liệu, không phải business module.
- `Modules` là layer nghiệp vụ và AI vận hành của MIABOS.
- `Source Specs` là input để materialize `Integration SRS` và `Business Module SRS`.
