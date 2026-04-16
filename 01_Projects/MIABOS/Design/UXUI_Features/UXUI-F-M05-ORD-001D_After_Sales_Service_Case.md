# UXUI Feature Spec: F-M05-ORD-001D After-sales Service Case

**Feature ID**: F-M05-ORD-001D
**Parent Feature ID**: F-M05-ORD-001
**Status**: Draft
**Owner**: A06 UI/UX Agent
**Last Updated By**: Codex CLI (GPT-5 Codex)
**Last Reviewed By**: A01 PM Agent
**Approval Required**: A05 Tech Lead, A01 PM
**Approved By**: -
**Last Status Change**: 2026-04-16
**Source of Truth**: This document
**Blocking Reason**: Can chot action taxonomy cho after-sales phase 1, SLA display rule, va note hierarchy giua latest note va inspection outcome
**Product**: MIA Smart / Orders And Service
**Date**: 2026-04-16

---

## 0. User & Task

### Target Roles

- CSKH
- Bao hanh / dich vu
- Store Manager
- AI-assisted operator

### Primary Goal

Nhin thay nhanh case sau ban dang thuoc loai nao, lien quan don / invoice / mat hang nao, ai dang xu ly, co qua SLA khong, va can tao handoff hay lien he khach tiep theo ra sao.

### Success Criteria

- User doc duoc latest case context trong 3-5 giay.
- SLA qua han noi bat hon status thong thuong.
- Linked order / return / POS invoice duoc dieu huong dung route.

## 1. Screen Overview

### Surface Types

- service case detail page
- side panel tu sales order / return order
- answer card trong AI Workspace

### Core Areas

1. `Case Header`
2. `Linked Order / Return / Invoice`
3. `Case Status + SLA`
4. `Product / Issue Summary`
5. `Latest Note`
6. `Inspection Outcome`
7. `Policy Citation`
8. `Owner / Routing`
9. `Next Action + Escalation CTA`

## 2. Screen Anatomy

### 2.1 Case Header

Phai co:

- case type badge
- service case id
- owner team
- owner person neu co
- current case status
- SLA status

### 2.2 Product / Issue Summary

Phai hien thi:

- linked product / variant
- symptom / issue summary
- customer impact level neu co
- linked order / return / invoice

### 2.3 Latest Note Vs Inspection Outcome

- `Latest Note` la operational note moi nhat
- `Inspection Outcome` la ket qua nghiep vu / ky thuat
- khong duoc tron 2 loai nay vao mot block mo ho

## 3. Main UX Rules

- `Warranty`, `Complaint`, `Care Follow-up`, `Repair` phai co badge loai case ro
- SLA qua han phai noi bat hon status thuong
- latest note duoc dat tren fold dau de CSKH doc trong 3-5 giay
- neu case co lien ket `return order`, nut dieu huong sang return phai o header
- neu case co lien ket `POS invoice`, dieu huong phai di truc tiep sang route POS invoice, khong di vong qua sales order
- inspection result chi hien full cho `Bao hanh / dich vu` va `Manager`; `CSKH` chi xem summary outcome

## 4. State Matrix

| State | Visual | Notes |
|------|--------|-------|
| New | Neutral badge | Moi tao |
| In Review | Review ribbon | Dang tham dinh |
| Waiting Customer | Clock / waiting cue | Cho khach phan hoi |
| In Service | Progress state | Dang xu ly |
| Waiting Approval | Warning / approval cue | Can nguoi duyet |
| Resolved | Success state | Da xu ly xong |
| Reopened | Warning state | Mo lai sau khi da dong |
| SLA Breach | Warning banner + badge | Uu tien review |

## 5. Error & Recovery

- neu latest note unavailable, van hien issue summary + owner + SLA
- neu linked record unavailable, CTA bi disable va co ly do
- neu policy citation unavailable, hien warning state

## 6. Interaction Notes

- click `Linked Order` mo `Sales Order And POS`
- click `Linked Return` mo `Return Order`
- click `Escalation CTA` tao payload handoff sang M11
- neu AI answer card hien service case, phai co CTA `Mo case`

## 7. Responsive Notes

- mobile: latest note va next action dat tren inspection outcome
- desktop: owner / routing co the dat o cot phai

## 8. Linked Artifacts

- SRS: [F-M05-ORD-001_Order_And_Fulfillment_SRS.md](../../Analysis/Features/Modules/Orders_And_Service/Order_And_Fulfillment/SRS/F-M05-ORD-001_Order_And_Fulfillment_SRS.md)
- Story: [US-M05-ORD-001D_After_Sales_Service_Case.md](../../Planning/Stories/Orders_And_Service/US-M05-ORD-001D_After_Sales_Service_Case.md)
