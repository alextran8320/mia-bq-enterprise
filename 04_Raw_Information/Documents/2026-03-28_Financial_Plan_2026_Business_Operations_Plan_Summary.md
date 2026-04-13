# Financial Plan 2026 - Business Operations Plan - Summary

**Date Added**: 2026-03-28
**Owner**: [[A01_PM_Agent]]
**Source File**: [2026-03-28_Financial_Plan_2026_Business_Operations_Plan.tsv](2026-03-28_Financial_Plan_2026_Business_Operations_Plan.tsv)
**Purpose**: Distill the financial plan into business signals that can be used by the MIABOS business layer.

---

## 1. Explicit Data Found in the TSV

| Item | Value | Notes |
|------|-------|-------|
| 2026 revenue target | `5,827,972,544 VND` | Annual sales and service revenue |
| COGS target | `2,114,875,000 VND` | `36%` of revenue |
| Gross profit target | `3,713,097,544 VND` | `64%` gross margin |
| Selling expense target | `1,809,244,921 VND` | `31%` of revenue |
| G&A target | `1,897,879,451 VND` | `33%` of revenue |
| Operating profit target | `5,973,172 VND` | Practically break-even for the full year |

## 2. Quarterly Revenue and Profit Shape

| Metric | Q1 | Q2 | Q3 | Q4 |
|--------|----|----|----|----|
| Revenue | `146,000,000` | `887,040,000` | `1,859,437,120` | `2,935,495,424` |
| COGS | `185,875,000` | `480,125,000` | `652,750,000` | `796,125,000` |
| Operating Profit | `-311,105,000` | `-303,583,200` | `167,107,510` | `453,553,862` |

## 3. What This File Allows Us to Answer

| Question | Answer | Confidence | Basis |
|----------|--------|------------|-------|
| What are the main cost drivers? | Explicitly: `IT + labor` inside COGS. Financially material supporting cost buckets: selling expense and G&A. | High | Row `4.1`, row `8`, row `9` |
| What is the 6-12 month commercial priority? | Growth and revenue ramp first, while still trying to protect a healthy gross margin and end the year near break-even. | Medium | Revenue grows sharply through Q4; H1 is loss-making, H2 turns positive; gross margin target is `64%`. |
| What commercial posture does this imply? | Invest early, absorb losses in H1, recover in H2, scale toward year-end. | Medium | Quarterly operating profit trend turns positive in Q3 and Q4. |

## 4. What This File Does Not Answer Directly

| Question | Status | Why |
|----------|--------|-----|
| Current price points or quote ranges | Not answerable directly | Revenue plan does not expose package price, seat price, or quote ranges |
| Exact AI usage cost, channel fees, onboarding cost, support cost, sales commission | Not answerable directly | Costs are not split into those sub-buckets |
| ICP by industry, company size, or easiest buyer | Not answerable directly | No segment or buyer data exists in the TSV |
| Top 3 competitors in sales | Not answerable directly | No competitor references exist in the TSV |
| Main sales channel | Not answerable directly | No channel or pipeline split exists in the TSV |

## 5. Important Interpretation Notes

- The annual pre-tax profit of `5,973,172 VND` is effectively near break-even, not a margin-maximization plan.
- The `7%` shown beside `Tổng lợi nhuận kế toán trước thuế` appears inconsistent with the revenue and profit amounts and should be treated as a likely spreadsheet-formatting or source inconsistency until verified.
- This file is strong evidence for commercial posture and cost shape, but weak evidence for pricing detail, ICP specificity, competitor reality, and channel strategy.

## 6. Recommended Use in MIABOS Business Layer

- Use this file to strengthen:
  - `Business_Strategy.md`
  - `Pricing_and_Sales_Strategy.md`
  - `Release_Business_Cases.md`
  - `Evidence/Raw_Insights_Log.md`
- Do not use this file alone to finalize:
  - Pricing tiers
  - Sales channel strategy
  - Competitor battlecards
  - ICP segmentation
