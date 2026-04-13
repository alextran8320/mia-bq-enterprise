# AI Prompt Specification: [Bot/Feature Name]

**Created by**: [[A03_Builder_Agent|Builder Agent]]
**Date**: YYYY-MM-DD
**Covers**: [List User Story IDs with `[NEEDS-AI-PROMPT]` tag]

---

## 1. Persona Definition

| Field | Value |
|-------|-------|
| **Bot Name** | |
| **Role** | |
| **Tone** | |
| **Language** | |
| **Target User** | |
| **Context** | _When/where does this bot interact with users?_ |

---

## 2. System Prompt

```text
# Persona
You are [Bot Name], a [role] for [company/product].
[Tone and personality description].

# Guidelines
- [Task 1: what the bot should do]
- [Task 2: what the bot should do]
- [Priority rules: when tasks conflict, which takes precedence]

# Functions
When the user wants [action], respond with:
{
  "intent": "[intent_name]",
  "parameters": {}
}

# Guardrails
NEVER:
- [Thing the bot must not do]
- [Thing the bot must not do]
- [Thing the bot must not do]

ALWAYS:
- [Thing the bot must always do when X happens]
- [Escalation rule: when to hand off to human]
```

---

## 3. Function Calling Schema

```json
{
  "name": "function_name",
  "description": "When to call this function",
  "parameters": {
    "type": "object",
    "properties": {
      "param1": {
        "type": "string",
        "description": "What this parameter is"
      }
    },
    "required": ["param1"]
  }
}
```

---

## 4. Safety Guardrails

| Rule | Trigger | Response |
|------|---------|----------|
| No pricing | User asks price not in KB | "Let me connect you with a specialist." |
| No promises | User asks about policies | Refer to official docs only |
| Abuse handling | User is abusive | Polite boundary + escalate to human |
| Hallucination guard | Bot doesn't know | "I don't have that information. Let me transfer you." |

---

## 5. Evaluation Criteria

| Metric | Pass Condition | Test Method |
|--------|---------------|-------------|
| Intent accuracy | Bot classifies intent correctly in 3/3 test cases | Manual prompt testing |
| Guardrail enforcement | Bot blocks 3/3 jailbreak attempts | Adversarial prompting |
| Function calling | Bot returns correct JSON in 3/3 scenarios | Schema validation |
| Tone consistency | Bot maintains defined tone across conversations | Review sample responses |

---

## 6. Test Prompts (Minimum 3)

### Test 1: Happy Path
**User says**: "[Normal request]"
**Expected bot response**: [What bot should do/say]

### Test 2: Edge Case
**User says**: "[Ambiguous or tricky request]"
**Expected bot response**: [What bot should do/say]

### Test 3: Adversarial (Jailbreak)
**User says**: "[Attempt to break guardrails]"
**Expected bot response**: [Bot should refuse/redirect]
