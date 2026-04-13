---
name: design-direction
description: "Propose 2-3 design directions for a feature with visual examples, pros/cons, and recommendation for Boss selection. Used in PB-03 before detailed UXUI spec work begins."
agent: A06
phase: PB-03
input: "PRD, Feature SRS (SRS Ready), user context from §0"
output: "Design Direction Proposal for Boss review"
template: null
---

# Design Direction Proposal

## Purpose

Before investing in detailed UXUI specs, present 2-3 distinct design approaches for Boss to choose from. This prevents rework and ensures alignment on visual/interaction direction early.

## Instructions

### Step 1: Read Context

1. Read **PRD** — business goals, target users
2. Read **Feature SRS** — functional requirements, business rules
3. Read **Design System** — existing patterns to build upon
4. Read A06 **Design Principles for MIABOS**:
   - Professional & Trustworthy (B2B SaaS)
   - Dashboard-First (data density)
   - Vietnamese-First (diacritics, copy)
   - Efficiency (minimize clicks)
   - AI-Visible (AI features prominent)
   - Omni-channel Consistent

### Step 2: Generate 2-3 Directions

Each direction must be clearly different in **interaction pattern**, not just color:

#### Direction Template:

```markdown
### Direction [A/B/C]: [Name]

**Core Concept**: [1 sentence — what makes this approach different]
**Interaction Model**: [How the user completes their primary task]
**Visual Style**: [Key visual characteristics]

**Layout Sketch** (ASCII wireframe):
┌─────────────────────────┐
│ ...                     │
└─────────────────────────┘

**Pros**:
- [advantage 1]
- [advantage 2]

**Cons**:
- [tradeoff 1]
- [tradeoff 2]

**Best for**: [which user scenario this excels at]
**Risk**: [what could go wrong]
```

### Step 3: Compare Directions

| Criterion | Direction A | Direction B | Direction C |
|-----------|------------|------------|------------|
| Task completion speed | | | |
| Learning curve | | | |
| Mobile friendliness | | | |
| Consistency with existing screens | | | |
| Implementation complexity | | | |
| Scalability (more features later) | | | |

### Step 4: Recommendation

State your recommended direction and why, but present all options neutrally to Boss.

```markdown
## A06 Recommendation: Direction [X]
**Reason**: [2-3 sentences linking to MIABOS design principles and user needs]
**Caveat**: [Any tradeoff Boss should be aware of]
```

### Step 5: Present to Boss via PM

- PM presents directions to Boss
- Boss selects: **Direction A / B / C / Mix / None (revise)**
- Selected direction becomes the basis for detailed UXUI spec work
- Record selection in Session Log

**Use `ui-ux-pro-max` skill** for visual style exploration: search styles, color palettes, product type recommendations.

## Quality Checks

- [ ] 2-3 genuinely different directions (not just color variants)
- [ ] Each direction has layout sketch
- [ ] Pros/cons honest (not biased toward recommendation)
- [ ] Comparison table covers key criteria
- [ ] Recommendation tied to MIABOS design principles
- [ ] Vietnamese context considered (B2B, SME owners, dashboard-heavy)
