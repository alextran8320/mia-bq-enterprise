# [PLACEHOLDER] AI Prompts

**Gate Required By**: Gate 3 — Design → Build (PB-02 → PB-03) — **CONDITIONAL**
**Owner**: A07 Architect Agent + A02 Product Agent
**Status**: Replace this placeholder with actual AI prompts IF this project has AI features.

> ⚠️ **CONDITIONAL FILE**: This file is only required if the project includes AI/LLM features.
> If the project has NO AI features, you may delete this file or leave it as-is.
> Gate 3 only requires this file if AI features are in scope.

---

## What Goes Here

This document defines all AI/LLM prompts used in the project — system prompts, user prompt templates, few-shot examples, and prompt engineering decisions. Created during PB-02 Phase D.

**If AI features exist, Gate 3 will not pass without this document being complete.**

---

## Template Structure

---

# AI Prompts: [Project Name]

**Version**: v1.0
**Date**: YYYY-MM-DD
**Author**: A07 Architect Agent / A02 Product Agent
**AI Provider**: OpenAI / Anthropic / Google / Other
**Model**: GPT-4 / Claude 3 / Gemini / Other

---

## AI Feature Inventory

| Feature | Description | Trigger | Expected Output |
|---------|------------|---------|-----------------|
| | | | |

---

## Prompt Templates

### [Feature Name] — System Prompt

**Purpose**: _What this prompt does_
**Model**: _Which model_
**Temperature**: _0.0 - 1.0_
**Max Tokens**: _limit_

```
[SYSTEM PROMPT]
You are a [role]. Your task is to [task].

Rules:
1. [Rule 1]
2. [Rule 2]

Output format:
[Specify exact output format]
```

**Few-Shot Examples** (if applicable):
```
User: [example input]
Assistant: [example output]
```

---

### [Feature Name] — User Prompt Template

**Purpose**: _What this prompt does_
**Variables**: `{variable_name}` — description

```
[USER PROMPT TEMPLATE]
[Context: {context}]

Task: [task description]

Input: {user_input}

Please [specific instruction].
```

---

## Prompt Engineering Decisions

| Decision | Rationale | Alternative Considered |
|----------|-----------|----------------------|
| | | |

---

## Testing & Validation

For each prompt, define:
- [ ] Expected output format
- [ ] Edge cases to test
- [ ] Failure modes and fallbacks
- [ ] Cost estimate per call

---

## Cost Estimation

| Feature | Model | Avg Input Tokens | Avg Output Tokens | Cost/Call | Est. Monthly Calls | Est. Monthly Cost |
|---------|-------|-----------------|------------------|-----------|-------------------|------------------|
| | | | | | | |

---

## Gate 3 Checklist (if AI features exist)

- [ ] All AI features have defined prompts
- [ ] System prompts are finalized
- [ ] User prompt templates have all variables documented
- [ ] Few-shot examples are provided where needed
- [ ] Cost estimates are acceptable
- [ ] Fallback behavior for AI failures is defined
- [ ] A07 has reviewed and signed off

---

## Reference
- Architecture: `Architecture.md`
- API Contract: `API_Contract.md`
- Gate 3 requirements: `../../../../00_Agent_OS/Rules/Quality_Gates.md` (line 61)
- Playbook: `../../../../00_Agent_OS/Playbooks/PB-02_Analyze_and_Design.md`
