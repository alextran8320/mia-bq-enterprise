# Rule Authority Model

> **Governance document for the Agent OS rule system.**
> Defines which file owns which rule category, how the two rule classes differ, and how to maintain provenance.
> 
> **Owner**: [[A01_PM_Agent|PM Agent (A01)]]  
> **Last updated**: 2026-03-17  
> **Status**: Authoritative

---

## 1. The Two Rule Classes

The Agent OS uses exactly **two rule files** for global rules. They serve fundamentally different purposes and must never be merged.

### Class 1: Evergreen OS Rules
**File**: `00_Agent_OS/Rules/Global_Rules.md`

- **What they are**: Operating instructions that define *how the system runs*. These rules are structural, process-defining, and stable. They do not change unless the system architecture changes.
- **Who writes them**: [[A01_PM_Agent|PM Agent (A01)]] during OS Hardening sessions only.
- **Provenance requirement**: None required. These are design decisions, not discoveries.
- **Examples**: "Only PM Agent talks to Business Owner", "No skipping gates", "Log everything".
- **Stability**: High. Changes require explicit OS Hardening approval from Business Owner.

### Class 2: Learned KB Rules
**File**: `03_Knowledge_Bank/Global_Rules.md`

- **What they are**: Rules *discovered from real project experience*. These represent lessons learned, refinements, and corrections to the OS defaults. They evolve as the team learns.
- **Who writes them**: [[A01_PM_Agent|PM Agent (A01)]] only, after UAT or significant project events.
- **Provenance requirement**: **MANDATORY**. Every rule must cite the session that produced it using the format below.
- **Examples**: "3 Directions Rule (not 2)", "Framework-First Rule", "Color Confirmation Separate from Direction".
- **Stability**: Medium. Can be updated when new projects produce contradicting evidence.

---

## 2. The Non-Overlap Principle

**No concept may appear in both files.**

- If a concept exists in `00_Agent_OS/Rules/Global_Rules.md`, it must NOT be restated in `03_Knowledge_Bank/Global_Rules.md`.
- If a KB rule *supersedes* an OS rule (e.g., "3 directions" supersedes "2 directions"), the OS rule must be **updated** to reflect the new standard, and the KB rule that triggered the update should be **removed** from the KB (it has been promoted to OS).
- Exception: KB rules may *refine* OS rules with additional specificity, but must not restate the same principle.

**Enforcement**: During every OS Hardening session, PM Agent must cross-check both files for concept overlap.

---

## 3. Rule Category Authority Map

The following table assigns every rule category to exactly one source-of-truth file. Other files (Quality Gates, RACI Matrix, agent definitions, playbooks) may *reference* these rules but must not *define* them.

| Rule Category | Owner File | Notes |
|---------------|-----------|-------|
| Communication protocols (single point of contact, no chattiness, clarification limits) | `00_Agent_OS/Rules/Global_Rules.md` | Structural — defines agent communication model |
| Quality gate enforcement (no skipping gates, templates are law, cross-check before handoff) | `00_Agent_OS/Rules/Global_Rules.md` | Gate *policy* lives here; gate *checklists* live in `Quality_Gates.md` |
| AC coverage requirements (100% AC coverage) | `00_Agent_OS/Rules/Global_Rules.md` | Structural QA requirement |
| Verified Demo requirement | `00_Agent_OS/Rules/Global_Rules.md` | Structural phase transition requirement |
| OS read-only / project isolation | `00_Agent_OS/Rules/Global_Rules.md` | Structural filesystem rules |
| Session logging (auto-logging, logging handshake, PM enforces logging) | `00_Agent_OS/Rules/Global_Rules.md` | Structural process rules |
| OS Hardening logging requirement | `00_Agent_OS/Rules/Global_Rules.md` | Structural process rule |
| Knowledge Bank compounding | `00_Agent_OS/Rules/Global_Rules.md` | Structural process rule |
| Design fidelity gate (mandatory high-fidelity design) | `00_Agent_OS/Rules/Global_Rules.md` | Structural gate requirement |
| Visual Standards as law | `00_Agent_OS/Rules/Global_Rules.md` | Structural design authority |
| Design direction approval process (number of directions, format) | `03_Knowledge_Bank/Global_Rules.md` | Learned: evolved from 2→3 directions via project experience |
| Mid-build visual checkpoint | `00_Agent_OS/Rules/Global_Rules.md` | Structural gate requirement |
| Beauty Score gate (≥ 8/10) | `00_Agent_OS/Rules/Global_Rules.md` | Structural gate requirement |
| No unstyled HTML defaults | `00_Agent_OS/Rules/Global_Rules.md` | Structural UI requirement |
| Design retrospective | `00_Agent_OS/Rules/Global_Rules.md` | Structural process rule |
| Idempotency (webhook deduplication) | `00_Agent_OS/Rules/Global_Rules.md` | Structural technical requirement |
| AI features blocked without prompts | `00_Agent_OS/Rules/Global_Rules.md` | Structural technical requirement |
| Golden Thread / traceability links | `00_Agent_OS/Rules/Global_Rules.md` | Structural artifact requirement |
| Artifact reciprocity | `00_Agent_OS/Rules/Global_Rules.md` | Structural artifact requirement |
| Clickable relative markdown links | `03_Knowledge_Bank/Global_Rules.md` | Learned: discovered as necessary from project experience |
| Daily Log requirement | `03_Knowledge_Bank/Global_Rules.md` | Learned: specific logging cadence discovered from experience |
| Framework-First Rule (UI framework before design tokens) | `03_Knowledge_Bank/Global_Rules.md` | Learned: discovered from project experience |
| Color Confirmation Separate from Direction | `03_Knowledge_Bank/Global_Rules.md` | Learned: discovered from project experience |
| Design System = Framework Config + Theme Layer + Component Map | `03_Knowledge_Bank/Global_Rules.md` | Learned: discovered from project experience |
| High-Precision Handoffs (80-100% Rule) | `03_Knowledge_Bank/Global_Rules.md` | Learned: discovered from project experience |
| Visual Layout Audit (flexbox/grid proof) | `00_Agent_OS/Rules/Global_Rules.md` | Structural gate requirement (Visual Integrity Gate) |
| Phase ownership / RACI assignments | `00_Agent_OS/Rules/RACI_Matrix.md` | Separate authority — do not duplicate |
| Phase transition checklists | `00_Agent_OS/Rules/Quality_Gates.md` | Separate authority — do not duplicate |

---

## 4. Citation Format for Learned Rules

Every rule in `03_Knowledge_Bank/Global_Rules.md` **must** include a `Source:` citation in the following format:

```
[Source: 02_Sessions/YYYY-MM-DD_Topic.md]
```

**Requirements:**
- The cited file must exist in `02_Sessions/`.
- The citation must appear in the `Source` column of the rule table.
- The date must match the session date, not the rule-writing date.

---

## 5. Remediation Policy for Broken Citations

When a KB rule's `Source:` citation points to a session file that does not exist:

1. **Do not delete the rule.** The rule content may still be valid community knowledge.
2. **Replace the broken citation** with the following marker:
   ```
   [SOURCE LOST — Rule retained as community knowledge. Cite new session when re-verified: YYYY-MM-DD_Topic.md]
   ```
3. **Log the remediation** in the current session log.
4. **Re-verify when possible**: If the rule is exercised in a future project and proves valid, update the citation to the new session that re-verified it.

---

## 6. Promotion Policy (KB → OS)

When a KB rule has been validated across multiple projects and should become a permanent structural rule:

1. PM Agent adds the rule to `00_Agent_OS/Rules/Global_Rules.md` with proper numbering.
2. PM Agent removes the rule from `03_Knowledge_Bank/Global_Rules.md`.
3. PM Agent logs the promotion in the current session log.
4. The OS rule does not require a `Source:` citation (it is now structural).

---

## 7. Conflict Resolution

If a KB rule contradicts an OS rule:

- **KB rule wins** if it is more recent and backed by a valid session citation.
- PM Agent must update the OS rule to reflect the new standard.
- The KB rule is then removed (it has been promoted/merged into OS).
- Example: KB Rule 15 ("3 Directions Rule") supersedes OS Rule 15 ("2 directions"). OS Rule 15 must be updated to "3 directions", then KB Rule 15 removed.

---

## 8. Files That Reference But Do Not Own Rules

The following files may reference rules but are not rule authorities:

| File | Role |
|------|------|
| `00_Agent_OS/Rules/Quality_Gates.md` | Implements gate checklists. References rules but does not define them. |
| `00_Agent_OS/Rules/RACI_Matrix.md` | Defines ownership assignments. References rules but does not define them. |
| `00_Agent_OS/Agents/*.md` | Agent definitions. May cite rules but do not own them. |
| `00_Agent_OS/Playbooks/*.md` | Phase playbooks. May cite rules but do not own them. |
| `AGENTS.md` / `PROJECT_BRAIN.md` | System overview. Summarizes rules but defers to this authority model. |

---

_This document was created during OS Hardening on 2026-03-17._  
_[[A01_PM_Agent|PM Agent (A01)]] is responsible for maintaining this document._
