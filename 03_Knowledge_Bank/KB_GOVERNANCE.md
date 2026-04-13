# KB Governance

This document defines how the Knowledge Bank is maintained, what belongs in it, and how learned rules are promoted or removed.

---

## 7. Rule Categories: Product/Design vs Technical

The KB uses two rule categories. Every new rule must be classified before being added.

### Product & Design Rules

**What belongs here**: Rules about workflow, process, communication, UX decisions, design methodology, and team coordination patterns discovered from project experience.

**Examples from current KB**:
- Rule 1: Auto-logging without prompting (workflow process)
- Rule 2: Clickable relative markdown links (artifact standards)
- Rule 3: Visual Layout Audit (design quality process)
- Rule 7: Framework-First Rule (design methodology)
- Rule 8: Color Confirmation Separate from Direction (UX process)
- Rule 9: Design System = Framework Config + Theme Layer + Component Map (design artifact standard)

**Test question**: "Does this rule describe *how the team works* or *how the product looks/behaves*?" -> Product & Design.

### Technical Rules

**What belongs here**: Rules about implementation requirements, integration constraints, data handling, API behavior, and system-level technical decisions discovered from project experience.

**Examples from current KB**:
- Rule T1: Idempotency via unique ID for webhook handlers (implementation requirement)

**Test question**: "Does this rule describe *how the code must behave* or *how a system must be built*?" -> Technical.

### Future categories (when needed)

The KB may add new categories as the team's work expands. Candidate future categories:
- **Vendor Rules**: Constraints specific to third-party services (e.g., vendor API limits, webhook behavior).
- **Client Rules**: Preferences specific to a recurring client (e.g., Business Owner's aesthetic preferences, communication style).
- **Infrastructure Rules**: Deployment, hosting, and DevOps constraints.

**To add a new category**: PM Agent must propose it during an OS Hardening session and get Business Owner approval before creating the new table in `03_Knowledge_Bank/Global_Rules.md`.

---

## 8. How to Promote a KB Rule to OS

When a KB rule has been validated across multiple projects and should become a permanent structural rule, it is promoted to `00_Agent_OS/Rules/Global_Rules.md`.

**Full promotion workflow is defined in [[RULE_AUTHORITY.md#6-promotion-policy-kb--os|RULE_AUTHORITY.md §6]].**

Summary of steps (do not duplicate — reference RULE_AUTHORITY.md for full detail):
1. PM Agent adds the rule to OS Global_Rules.md with proper numbering.
2. PM Agent removes the rule from KB Global_Rules.md.
3. PM Agent logs the promotion in the current session log.
4. The OS rule does not require a `[Source: ...]` citation (it is now structural).

**When to promote** (criteria):
- The rule has been validated in at least 2 separate projects.
- The rule describes a structural process requirement, not a project-specific discovery.
- The Business Owner agrees the rule should be permanent.
- The rule does not already exist in OS Global_Rules.md (check for concept overlap).

**Promotion is irreversible** in the sense that the KB entry is removed. If the OS rule is later found to be wrong, it must be updated or removed via an OS Hardening session — not by re-adding it to the KB.

---

## 9. Governance Self-Check

Before closing any session that touched the KB, PM Agent must verify:

- [ ] Every new rule has a valid `[Source: ...]` citation pointing to an existing session file.
- [ ] No new rule duplicates a concept already in `00_Agent_OS/Rules/Global_Rules.md`.
- [ ] Every new rule is classified as Product & Design or Technical.
- [ ] Any deprecated rule is in the `## Removed Rules` audit log with a reason.
- [ ] Any promoted rule has been removed from the KB and added to OS.
- [ ] The session log for this session notes all KB changes made.
- [ ] The Daily Log for today notes all KB changes under **Knowledge & Rules**.

**If any item is unchecked -> do NOT close the session until it is resolved.**

---

_This document was normalized during document cleanup on 2026-03-27._
_[[A01_PM_Agent|PM Agent (A01)]] is responsible for maintaining this document._
_[Source: 00_Agent_OS/Rules/RULE_AUTHORITY.md] — cross-references the two-class rule model defined there._

