# Knowledge Bank: Lessons Learned

Chronological log of lessons from each project cycle.
**Only [[A01_PM_Agent|PM Agent]] may update this file.**
*(MANDATORY: Every new entry MUST include the session source e.g. `[Source: 02_Sessions/YYYY-MM-DD_Project_Topic.md]` for traceability).*

---

## Log

| Date       | Project              | UAT Status | Feedback Summary                                                        | Lesson                                                                                                                                                                                                                                                            | Rules Extracted                                                                                              | Applied To                                                                        |
| ---------- | -------------------- | ---------- | ----------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------ | --------------------------------------------------------------------------------- |
| 2026-03-15 | System Init          | N/A        | Initial setup                                                           | Agent team structure created with 4 agents, 5 playbooks                                                                                                                                                                                                           | Framework established                                                                                        | Global_Rules.md                                                                   |
| 2026-03-15 | Agent OS Enhancement | N/A        | "design is not beautiful I expect" + "I don't see you log work session" | 1) Vague "premium" language without concrete specs causes ugly output. Fix: Visual Standards with actionable specs from reference apps. 2) Logging rules exist but aren't enforced. Fix: A08 mandatory triggers in every playbook + PM enforces logging at gates. | Rules 6-12 in KB, Rules 14-25 in Global Rules, Visual Standards created, all 8 agents updated, RACI expanded | Global_Rules.md, all Agent files, all Playbooks, Quality_Gates.md, RACI_Matrix.md |

---

_Format for new entries:_
```json
{
  "date": "YYYY-MM-DD",
  "project": "[name]",
  "uat_status": "PASS/FAIL",
  "feedback": "[Boss's exact words or summary]",
  "lesson": "[What we learned]",
  "rules_extracted": ["Rule 1", "Rule 2"],
  "applied_to": "Global_Rules.md / Tech_Rules.md / Product_Rules.md / Vendor_Notes/"
}
```
