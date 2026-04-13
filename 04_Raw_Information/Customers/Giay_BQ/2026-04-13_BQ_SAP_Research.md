# SAP Research for Giay BQ

**Status**: Draft
**Owner**: A01 PM Agent
**Last Updated By**: Codex CLI (GPT-5 Codex)
**Last Reviewed By**: -
**Approval Required**: Business Owner
**Approved By**: -
**Last Status Change**: 2026-04-13
**Source of Truth**: This file
**Blocking Reason**: -

---

## Purpose

This document consolidates the SAP Business One research completed for the `Giay BQ` customer case. It is intended to support:

- proposal writing
- business discovery
- SAP-to-MIABOS integration framing
- stakeholder explanation of SAP scope without going deep into implementation details

This is a business-facing research pack, not a full technical integration specification.

## 1. Executive Summary

For the `Giay BQ` case, `SAP Business One` should be treated as the likely `ERP core` and one of the most important source systems in the target `MIABOS` operating layer.

At a business level, SAP B1 most likely owns:

- product and item master structure
- warehouse and inventory structure
- purchasing and supplier context
- pricing baseline and structured commercial data
- receivable/payable and finance control context
- management-level operational reporting

For Phase 1 of MIABOS, SAP B1 should primarily support:

- internal chatbot Q&A
- structured data lookup
- source-of-truth clarification
- cross-system business interpretation alongside `KiotViet`, `Haravan`, and `Excel`

The recommended stance for early-phase delivery is:

- `read-first`
- `business-rule layer before automation`
- `limited realtime only where business value is high`
- `write-back later, after governance and confidence are established`

## 2. How SAP B1 Should Be Understood for BQ

`Giay BQ` is not a single-store business. It operates in a multi-location retail model with stores, dealers, ecommerce presence, and likely fragmented operational data. In that context, SAP B1 matters because it can anchor the enterprise version of truth across functions.

For this case, SAP B1 should be viewed as:

- the business control system for structured ERP data
- a likely owner of enterprise-level item, warehouse, partner, and pricing structures
- a key reference point for inventory, purchasing, and financial control
- an upstream system that MIABOS will interpret, not replace

## 3. SAP B1 Module View — Grouped by Business Objects

### 3.1 Administration

Business object groups:

- users
- roles and authorizations
- approvals
- numbering and document settings
- currencies and exchange rates
- tax setup
- company configuration
- user-defined fields and metadata

### 3.2 Financials

Business object groups:

- chart of accounts
- journal entries
- budgets
- cost centers and dimensions
- fiscal periods
- recurring postings
- tax determination
- financial reporting structures

### 3.3 Sales Opportunities

Business object groups:

- leads
- opportunities
- activities
- pipeline stages
- competitor context
- sales forecast at opportunity level

### 3.4 Sales - A/R

Business object groups:

- customers
- quotations
- sales orders
- deliveries
- A/R invoices
- returns and credit memos
- customer receivables

### 3.5 Purchasing - A/P

Business object groups:

- suppliers
- purchase requests
- purchase quotations
- purchase orders
- goods receipt PO
- A/P invoices
- returns and credit memos
- supplier payables

### 3.6 Business Partners

Business object groups:

- customer master
- supplier master
- lead master
- contact persons
- addresses
- payment terms
- credit limits
- bank and billing context

### 3.7 Banking

Business object groups:

- incoming payments
- outgoing payments
- deposits
- checks
- bank reconciliation
- bank statement processing

### 3.8 Inventory

Business object groups:

- item master
- item groups
- price lists
- warehouses
- stock balances
- goods receipt and goods issue
- transfer and transfer request
- inventory counting and posting
- batch numbers and serial numbers
- units of measure

### 3.9 Resources

Business object groups:

- resources
- capacity
- resource cost
- time and allocation context

### 3.10 Production

Business object groups:

- BOM
- production orders
- issue for production
- receipt from production
- component structures

### 3.11 MRP

Business object groups:

- demand forecast
- planning parameters
- replenishment suggestions
- purchase recommendations
- production recommendations
- rescheduling recommendations

### 3.12 Service

Business object groups:

- service calls
- customer equipment cards
- service contracts
- technician assignments
- service history

### 3.13 Human Resources

Business object groups:

- employee master data
- position data
- employee personal records
- absence and HR-related records

### 3.14 Reports and Analytics

Business object groups:

- sales reports
- purchasing reports
- inventory reports
- financial reports
- aging reports
- cash flow reports
- operational snapshots

## 4. The SAP B1 Modules Most Relevant to BQ

For `Giay BQ`, not every SAP B1 module matters equally. The priority research and integration focus should be:

### High Priority

- `Business Partners`
- `Sales - A/R`
- `Purchasing - A/P`
- `Inventory`
- `Financials`
- `Banking`
- `MRP`

### Medium Priority

- `Sales Opportunities`
- `Reports and Analytics`
- `Administration`

### Lower Priority for Phase 1

- `Production`
- `Resources`
- `Service`
- `Human Resources`

The exact relevance depends on how deeply BQ has implemented SAP B1 in practice.

## 5. What SAP B1 Is Likely to Contribute to MIABOS

For early MIABOS solution framing, SAP B1 should contribute the following types of business objects:

### Master Data

- item master
- SKU reference data
- warehouse master
- supplier and partner data
- pricing baseline

### Transaction and Operational Context

- stock balances by warehouse
- transfer requests and transfer status
- purchasing status
- selected sales-document context

### Finance and Control Context

- receivable/payable visibility
- selected payment status
- management reporting snapshots

### Knowledge Context

- SOP or process guidance related to SAP B1 usage
- business interpretation of SAP-controlled data

## 6. Suggested SAP B1 -> MIABOS Integration Pattern

This research recommends a non-technical but operationally realistic integration posture.

### Phase 1

Primary purpose:

- allow internal users to ask business questions in natural language
- give a trusted answer with source awareness
- reduce dependency on key internal experts

Recommended integration posture:

- mostly `scheduled sync`
- selective `near-realtime` for high-value objects
- no broad write-back

### Suggested Sync Pattern by Object Type

| Object Group | Recommended Sync Pattern | Why |
|--------------|--------------------------|-----|
| item master, warehouse master, partner master | Scheduled | Changes are structured, lower urgency, good fit for periodic sync |
| price lists and baseline pricing | Scheduled | Important for consistency, but usually not minute-by-minute critical |
| stock balances and transfer status | Near-realtime or frequent schedule | Strong operational value for supply chain and store support |
| purchasing and inbound visibility | Frequent schedule | Helpful for ETA and replenishment decisions |
| management finance snapshots | Scheduled daily or intra-day | Better suited to controlled reporting windows |
| SOP, usage guides, policy docs | Manual / curated updates | This is knowledge sync rather than transactional sync |

### Why This Pattern Fits BQ

- BQ appears to operate across many stores and channels
- the immediate value is faster lookup and better alignment, not aggressive process automation
- early trust in the system will come from correct read models, not from write actions

## 7. Who Will Use SAP-Driven Insight on MIABOS

The likely primary MIABOS users for SAP-related queries are:

### Executive and Central Operations

- enterprise-level inventory visibility
- stock allocation questions
- cross-channel operational clarification
- management summary and exception review

### Supply Chain and Logistics

- where inventory exists
- what is inbound
- whether transfer is needed
- how warehouse and store positions compare

### Pricing and Finance Control

- baseline price clarification
- pricing governance questions
- receivable/payable and control-oriented checks

### ERP / IT Key Users

- SAP usage guidance
- source-of-truth clarification
- system interpretation support for other departments

### Retail and Regional Management

- cross-store inventory visibility
- escalation support when store-level systems conflict with enterprise data

## 8. SAP B1 Business Questions MIABOS Should Be Able to Answer

The following question types are well aligned to SAP-supported MIABOS use cases:

- What is the official item or SKU information for code X?
- Which warehouse currently holds inventory for item X?
- What is the baseline price for item X?
- Which supplier or partner is associated with item or purchasing flow Y?
- Is stock currently in transfer or in inbound flow?
- Which system should be trusted for this type of enterprise-level inventory question?
- How does a user perform business process Y in SAP B1?

## 9. Caveats and Discovery Questions

This research is still based on external signals and general SAP B1 operating patterns. The following points still require direct validation with BQ:

- Which SAP B1 modules are truly active in daily operations
- Whether store inventory truth is controlled mainly in SAP B1 or in `KiotViet`
- Whether pricing logic is centrally controlled in SAP B1 or partially maintained outside the ERP
- Whether MRP or planning modules are actually in use
- Whether finance and payment visibility can be opened for MIABOS users by role
- Whether `Excel` currently carries critical business logic not yet formalized in SAP B1

## 10. Official SAP Documentation and Learning Resources

The links below were gathered to support both business understanding and later technical feasibility work.

### Product and User Guide

- SAP Business One product overview: https://learning.sap.com/products/business-one
- SAP Business One Help Portal: https://help.sap.com/docs/SAP_BUSINESS_ONE/68a2e87fb29941b5bf959a184d9c6727/
- SAP Business One Web Client Guide: https://help.sap.com/docs/SAP_BUSINESS_ONE_WEB_CLIENT/2554bf7e9aa347729b0547a737e123ac/
- SAP Business One User Guide PDF: https://help.sap.com/doc/ceedc4fe720a4fc19a8e1fa75bdf02f7/10.0_SP_2505/en-US/ab9cf61542fb4359ae1ee7a972f920d5.pdf

### Business and Process Learning

- Implementing SAP Business One: https://learning.sap.com/courses/implementing-sap-business-one
- Discovering SAP Business One Web Client Logistics: https://learning.sap.com/courses/discovering-sap-business-one-web-client-logistics
- Managing Logistics in SAP Business One: https://learning.sap.com/courses/managing-logistics-in-sap-business-one
- Utilizing SAP Business One Web Client Accounting: https://learning.sap.com/courses/utilizing-sap-business-one-web-client-accounting
- Handling Accounting in SAP Business One: https://learning.sap.com/courses/handling-accounting-in-sap-business-one
- Leveraging the SAP Business One Service Layer: https://learning.sap.com/courses/leveraging-the-sap-business-one-service-layer

### Object and Integration References

- Business Objects List: https://help.sap.com/docs/SAP_BUSINESS_ONE/a2c93a1c88a24f1faeee3d3f62fbde7a/e7203929438243b9b2c58da80c80a3ee.html
- DI API / SDK Help: https://help.sap.com/doc/089315d8d0f8475a9fc84fb919b501a3/10.0/en-US/SDKHelp/
- Service Layer API Reference: https://help.sap.com/doc/056f69366b5345a386bb8149f1700c19/10.0/en-US/Service%20Layer%20API%20Reference.html
- Working with SAP Business One Service Layer PDF: https://help.sap.com/doc/0d2533ad95ba4ad7a702e83570a21c32/latest/en-US/Working_with_SAP_Business_One_Service_Layer.pdf

## 11. Video and Course Pack for Rapid Business Learning

For practical learning, the best video-oriented path is to use SAP Learning courses because they package process explanations, lessons, and walkthroughs in sequence.

Recommended viewing order:

1. SAP Business One product overview
2. Discovering SAP Business One Web Client Logistics
3. Managing Logistics in SAP Business One
4. Utilizing SAP Business One Web Client Accounting
5. Leveraging the SAP Business One Service Layer

This sequence is enough to understand:

- how SAP B1 is structured
- what the major business modules do
- which objects matter for retail and inventory-led use cases
- how later integration with MIABOS can be framed

## 12. Recommended Narrative for Proposal Use

For `Giay BQ`, SAP Business One should be positioned as:

- the enterprise control layer
- the source of structured ERP truth
- the anchor for item, warehouse, partner, purchasing, and finance-oriented interpretation
- one of the critical upstream systems that MIABOS must read and explain

MIABOS should then be positioned as:

- the AI access layer
- the cross-system interpretation layer
- the business-rule layer that helps users ask once and understand the answer in context

## 13. Key Takeaway

The most important product insight is not simply that `BQ uses SAP B1`.

The deeper point is:

- if SAP B1 is the enterprise ERP anchor
- and `KiotViet` is the store operations layer
- and `Haravan` is the online commerce layer

then `MIABOS` should be designed as the layer that unifies business meaning across all three.

That is the most strategic role SAP research plays in this case.
