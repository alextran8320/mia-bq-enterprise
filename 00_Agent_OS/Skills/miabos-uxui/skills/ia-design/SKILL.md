---
name: ia-design
description: "Design Information Architecture for MIABOS features using job-based taxonomy (not module codes). Defines navigation structure, route hierarchy, and screen naming in Vietnamese operational language. Use when designing new modules or restructuring navigation."
agent: A06
phase: PB-03
input: "PRD User Task Flow, Feature Spec, existing IA (if any)"
output: "IA Design document with nav structure, route map, and label system"
template: null
---

# Information Architecture Design

## Purpose

Design the navigation structure and screen hierarchy using job-based taxonomy. Users think in tasks ("Quản lý khách hàng"), not module codes ("M02"). IA must make the primary task findable in ≤2 clicks from the main navigation.

## MIABOS IA Rules (Non-Negotiable)

1. **Job taxonomy, not module taxonomy**: Nav labels and screen titles use operational language
2. **Module codes are planning-internal**: M01, M02, M09 are forbidden in user-visible surfaces
3. **Each route has a single dominant goal**: Mixed-scope routes must be split
4. **Vietnamese-first labels**: All navigation in Vietnamese
5. **2-click rule**: Primary task reachable from main nav in ≤2 clicks

## Instructions

### Step 1: Inventory User Jobs

From PRD User Task Flow, list every job the user needs to do:

| Job | User Role | Frequency | Current Path (if exists) | Ideal Path |
|-----|-----------|-----------|------------------------|-----------|
| Xem danh sach khach hang | Agent | Daily | ??? | /khach-hang |
| Them khach hang moi | Agent | Daily | ??? | /khach-hang/them-moi |
| Xem chi tiet khach hang | Agent | Hourly | ??? | /khach-hang/:id |

### Step 2: Design Navigation Structure

```markdown
## Main Navigation (Sidebar)

| Nav Item (Vietnamese) | Icon | Route | Dominant Goal | User Roles |
|-----------------------|------|-------|---------------|------------|
| Tong quan | LayoutDashboard | /tong-quan | See today's key metrics | All |
| Khach hang | Users | /khach-hang | Manage customer records | Agent, Supervisor |
| Hoi thoai | MessageSquare | /hoi-thoai | Handle conversations | Agent |
| ...
```

### Step 3: Define Route Hierarchy

```markdown
## Route Map

/khach-hang                    → List (dominant: find + filter customers)
/khach-hang/them-moi           → Create (dominant: add new customer)
/khach-hang/:id                → Detail (dominant: view/edit one customer)
/khach-hang/:id/lich-su        → History (dominant: review interaction history)
```

**Rule**: Each route = one dominant goal. If a route serves 2 goals, split it.

### Step 4: Label System

Map every navigation label:

| Location | Vietnamese Label | Forbidden Alternative | Why |
|----------|-----------------|----------------------|-----|
| Sidebar nav | Khach hang | M02, Customers, CRM | Module code / English |
| Page title | Danh sach khach hang | Customer List | English |
| Breadcrumb | Trang chu > Khach hang > Chi tiet | Home > M02 > Detail | Module code |
| Tab label | Thong tin co ban | Basic Info | English |

### Step 5: Validate Against MIABOS Context

Consider cross-product consistency:
- **MIA Smart** users: conversation-heavy, need quick access to chat + customer
- **MIA Spring** users: content-heavy, need campaign + content creation flow
- **MIA Scale** users: journey-heavy, need remarketing + customer groups
- **Platform**: shared nav items (customers, settings, reports) must be consistent

### Step 6: Output IA Document

```markdown
# Information Architecture: [Feature/Module Name]

## Navigation Structure
[Main nav + secondary nav]

## Route Map
[Full route hierarchy with dominant goals]

## Label System
[Complete Vietnamese label mapping]

## Cross-Product Impact
[Which nav items are shared across Smart/Spring/Scale]

## Accessibility Notes
[Skip links, keyboard nav order, ARIA landmarks]
```

## Quality Checks

- [ ] Zero module codes in user-visible surfaces
- [ ] All labels in Vietnamese
- [ ] Each route has a single declared dominant goal
- [ ] Primary task reachable in ≤2 clicks from main nav
- [ ] Cross-product consistency verified
- [ ] Route hierarchy is shallow (max 3 levels deep)
- [ ] Label system consistent (same concept = same label everywhere)
