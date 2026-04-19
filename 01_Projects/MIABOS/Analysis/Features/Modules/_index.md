# MIABOS Modules Index

## Purpose

Folder này chứa các module nghiệp vụ nội tại của MIABOS, được nhóm lại theo `product surfaces` của Core AI CRM Platform thay vì để flat theo danh sách module rời.

## Product Surface Groups

### `CRM_Workspace`

- `Customer_And_CRM`

### `Catalog_And_Commerce`

- `Product`
- `Inventory_Availability`
- `Pricing`
- `Promotion`

### `Orders_And_Service`

- `Order_And_Fulfillment`

### `AI_Workspace`

- `Internal_AI_Chat`
- `Sales_Advisor_AI`

### `Knowledge_Center`

- `Knowledge_And_Policy`

### `Operations_And_Governance`

- `Access_Control_And_Sensitivity`
- `Escalation_And_Workflow`

### `Insights_And_Performance`

- `Audit_And_Observability`

## Domain Rule

- Mỗi module có SRS riêng trong folder `SRS/`.
- Mọi module business phải trace ngược được về ít nhất một `Integration Source Spec`.
- Product surface là lớp packaging cho Core AI CRM Platform, không làm thay đổi `Feature ID` hay boundary nghiệp vụ cốt lõi của module.
