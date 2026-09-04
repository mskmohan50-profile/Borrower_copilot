# RULES.md — Borrower Copilot

Every rule, threshold, band, and assumption in the app. This document is read as carefully as the code.

## Table of Contents
1. [Loan Products](#1-loan-products)
2. [Affordability (FOIR)](#2-affordability--foir-)
3. [Eligibility (Lender Sanction vs Safe Carry)](#3-eligibility--lender-sanction-vs-safe-carry-)
4. [Fair Rate Model](#4-fair-rate-model)
5. [EMI & Tenure](#5-emi--tenure)
6. [Stress Test](#6-stress-test)
7. [Verdict Logic](#7-verdict-logic)
8. [Confidence Scoring](#8-confidence-scoring)
9. [Question Design](#9-question-design)
10. [What We Don't Know](#10-what-we-dont-know)

---

## 1. Loan Products

| Product | Rate Range (p.a.) | Typical Tenure | Processing Fee | Max FOIR | Max LTV | Secured? |
|---|---|---|---|---|---|---|
| Personal Loan | 10.5% – 24% | 12–60 months | 1.5%–3.5% | 50% | — | No |
| Home Loan | 8.4% – 10.5% | 60–360 months | 0.5%–1.0% | 55% | 80% | Yes |
| Loan Against Property | 9.5% – 13% | 36–240 months | 1.0%–2.0% | 55% | 70% | Yes |
| Gold Loan | 9% – 18% | 3–36 months | 0.5%–1.5% | 60% | 75% | Yes |
| Business Loan | 14% – 28% | 12–84 months | 1.5%–3.0% | 55% | — | No |
| Two-Wheeler Loan | 11% – 22% | 12–48 months | 1.0%–2.5% | 50% | 90% | Yes |

**Why:** These are the typical market bands in India as of 2026, drawn from public rate sheets of HDFC, SBI, ICICI, Bajaj Finance, and Muthoot. I've rounded to half-point boundaries.

**Source:** My judgement based on public lender rate sheets and RBI market reports.

---

## 2. Affordability (FOIR)

FOIR = Fixed Obligations to Income Ratio = (Total EMIs / Net Monthly Income) × 100

| Rule | Value | Why | Source |
|---|---|---|---|
| Base FOIR limit | Product-specific (see above) | Indian lenders use FOIR as the primary affordability gate | Standard Indian lending practice |
| Income type adjustment (informal) | FOIR × 0.8 | Informal income is harder to verify and more volatile | My judgement |
| Income type adjustment (self-employed) | FOIR × 0.95 | Slightly less stable than salaried | My judgement |
| Variable income > 40% | FOIR × 0.9 | High variability means lower dependable income | My judgement |
| Employment stability: stable | FOIR × 1.0 | No reduction | — |
| Employment stability: moderate | FOIR × 0.9 | Some risk premium | My judgement |
| Employment stability: unstable | FOIR × 0.75 | Significant risk | My judgement |
| Dependent buffer (0 dependents) | Expense buffer × 1.0 | No dependents = full buffer available | My judgement |
| Dependent buffer (1–2) | Expense buffer × 0.9 | Some additional obligation | My judgement |
| Dependent buffer (3+) | Expense buffer × 0.8 | Heavy obligations | My judgement |
| Residence: owned | Expense buffer × 1.05 | No rent = more disposable | My judgement |
| Residence: rented | Expense buffer × 0.9 | Rent is a fixed obligation not always captured | My judgement |
| Survival buffer | 30% of (income − expenses − existing EMIs) | Prudent floor; borrower must not be at zero after EMI | My judgement; aligns with financial planning norms |
| Upcoming large expense | Amortized over 12 months, subtracted from ceiling | Future lump expenses reduce capacity | My judgement |
| Productive loan return | 70% of expected monthly return added to ceiling | Conservative — not all projected income materializes | My judgement |
| Expenses unknown | Use 70% of FOIR ceiling | When we can't verify expenses, be conservative | My judgement |
| Co-applicant income | Added to total income | Lenders consider combined income | Standard practice |

**Key formula:**
```
safeEMICeiling = min(FOIR_ceiling, expense_ceiling) − upcoming_amortized + productive_return×0.7
```

**What we don't know:** Actual lender FOIR models vary and are proprietary. We use a conservative version.

---

## 3. Eligibility (Lender Sanction vs Safe Carry)

Two numbers, always separated.

### Lender Sanction (what the bank will likely approve)

| Rule | Value | Why | Source |
|---|---|---|---|
| Income multiplier (Personal) | 18× monthly income | Typical unsecured personal loan multiplier | My judgement; ranges 15–24x in market |
| Income multiplier (Home) | 30× monthly income | Long tenure + secured = higher multiplier | My judgement; ranges 25–36x |
| Income multiplier (LAP) | 24× monthly income | Secured but shorter tenure than home | My judgement |
| Income multiplier (Gold) | 25× monthly income | High LTV, short tenure | My judgement |
| Income multiplier (Business) | 15× monthly income | Unsecured business, higher risk | My judgement |
| Income multiplier (Two-Wheeler) | 12× monthly income | Small ticket, short tenure | My judgement |
| Income type: informal | Multiplier × 0.6 | Lenders heavily discount informal income | My judgement |
| Income type: self-employed | Multiplier × 0.85 | Some discount for income variability | My judgement |
| Credit score ≥ 750 | Multiplier × 1.0 | Best tier — no reduction | Standard practice |
| Credit score 700–749 | Multiplier × 0.95 | Slight reduction | My judgement |
| Credit score 600–699 | Multiplier × 0.8 | Notable reduction | My judgement |
| Credit score < 600 | Multiplier × 0.6 | Major reduction | My judgement |
| Credit score unknown | Multiplier × 0.8 | Conservative — treat as average-ish | My judgement |
| Vintage ≥ 5 years | Multiplier × 1.1 | Stability premium | My judgement |
| Vintage < 2 years | Multiplier × 0.85 | New to workforce/business | My judgement |
| LTV cap (secured) | min(sanction, collateral × LTV%) | Lenders cap at LTV | Standard practice |
| Cap at requested amount | min(sanction, amount × 1.1) | Lenders rarely exceed request by >10% | My judgement |

### Safe Carry (what borrower can repay without stress)

| Rule | Value | Why | Source |
|---|---|---|---|
| Formula | Reverse EMI: P = EMI × ((1+r)^n − 1) / (r × (1+r)^n) | Standard finance — present value of an annuity | Textbook |
| Rate used | Low end of fair band + 30% of band width | Conservative — don't assume best rate | My judgement |
| Tenure used | Max tenure capped by retirement age (60) | Can't repay after retirement for salaried | Standard practice |

### Which to use

| Rule | Value | Why |
|---|---|---|
| Recommended amount | min(lenderSanction, safeCarry) | The borrower should use the lower number — always. If safe carry < lender sanction, the lender will lend more than is safe. |
| Label | "Safe carry" or "Lender sanction" | Tell the borrower which one is the binding constraint |

**What we don't know:** Real lender sanction models are proprietary and vary by bank. Our multiplier is a reasonable approximation.

---

## 4. Fair Rate Model

The fair rate is a **band**, not a point. It starts from the product's market range and adjusts for borrower profile.

| Factor | Adjustment (basis points) | Why | Source |
|---|---|---|---|
| Credit score ≥ 750 | −150 bp (−1.5%) | Best risk tier gets best rates | Standard practice |
| Credit score 700–749 | −50 bp (−0.5%) | Good tier | My judgement |
| Credit score 600–699 | +100 bp (+1%) | Average risk | My judgement |
| Credit score < 600 | +300 bp (+3%) | High risk | My judgement |
| Credit score unknown | +50 bp (+0.5%), wider band | Uncertainty premium + wider band | My judgement |
| Informal income | +200 bp (+2%) | Hard to verify, higher default risk | My judgement |
| Self-employed | +50 bp (+0.5%) | Slightly higher risk than salaried | Standard practice |
| Stable employment | −25 bp (−0.25%) | Stability discount | My judgement |
| Unstable employment | +100 bp (+1%) | Instability premium | My judgement |
| Secured by collateral | −75 bp (−0.75%) | Collateral reduces lender risk | Standard practice |
| Card utilisation > 70% | +75 bp (+0.75%) | High utilisation signals stress | My judgement; CIBIL factors utilisation |
| Card utilisation < 30% | −25 bp (−0.25%) | Disciplined credit use | My judgement |
| Each EMI bounce | +75 bp (+0.75%) per bounce | Direct evidence of repayment difficulty | My judgement |
| Vintage ≥ 10 years | −25 bp (−0.25%) | Long track record | My judgement |
| Vintage < 2 years | +50 bp (+0.5%) | Short track record | My judgement |

### Band widening

| Confidence | Band widening | Why |
|---|---|---|
| High | None | Enough data to be precise |
| Medium | ±7.5% of band width | Some uncertainty |
| Low | ±15% of band width | Significant uncertainty — "we're guessing" |

### APR (All-in cost)

| Rule | Value | Why | Source |
|---|---|---|---|
| APR formula | Rate + (processingFee / tenureInYears) | Processing fee amortized over loan life — gives true annual cost | RBI mandate for APR disclosure |
| Processing fee | Midpoint of product's fee range | Conservative midpoint | — |

**What we don't know:** Actual rate cards are lender-specific and change frequently. We model the fair rate for the borrower's profile, not any specific lender's quote.

---

## 5. EMI & Tenure

| Rule | Value | Why | Source |
|---|---|---|---|
| EMI formula | P × r × (1+r)^n / ((1+r)^n − 1) | Standard reducing-balance EMI | Textbook |
| Monthly ceiling | safeEMICeiling from affordability | The max EMI borrower should pay | See §2 |
| Recommended tenure | Shortest tenure where EMI ≤ ceiling | Minimizes total interest while staying affordable | My judgement |
| Fair rate for EMI calc | Midpoint of fair band | Use the expected rate, not best or worst | My judgement |
| Max tenure | min(product max, (60 − age) × 12) for salaried | Retirement at 60 — can't repay after | Standard practice |
| Tenure steps (home/LAP) | 5, 10, 15, 20 years | Standard tenure options | Market practice |
| Tenure steps (others) | 1, 2, 3, 4, 5 years | Standard tenure options | Market practice |

**What we don't know:** Some lenders allow tenure up to 65 for self-employed. We use 60 uniformly for simplicity.

---

## 6. Stress Test

One stress case: income drops AND rate rises simultaneously.

| Rule | Value | Why | Source |
|---|---|---|---|
| Income drop (salaried) | 20% | Job loss or pay cut scenario | My judgement |
| Income drop (self-employed) | 25% | Business downturn | My judgement |
| Income drop (informal) | 30% | High variability, gig economy | My judgement |
| Rate hike | +2 percentage points | RBI rate cycle or floating rate reset | My judgement; typical RBI cycle move |
| Stress ceiling | (stressedIncome − expenses − existingEMIs) × 0.7 | Reduced income needs larger buffer | My judgement |
| Survivable | stressedEMI ≤ stressCeiling | Can the borrower still pay? | — |

**What we don't know:** Real shocks can be larger (COVID saw 50%+ income drops for some). We model a moderate stress, not worst-case.

---

## 7. Verdict Logic

The verdict uses red flags and yellow flags from affordability, obligations, and history.

### Red flags (any 2 → "Don't borrow")

| Condition | Flag | Why |
|---|---|---|
| Existing EMIs > 50% of income | Red | Already over-leveraged |
| Disposable income < 0 (deficit) | Red | Running a monthly loss |
| Safe EMI ceiling < ₹1,000 | Red | No room for new debt |
| ≥ 2 EMI bounces in last 12 months | Red | Active repayment distress |
| Amount wanted > 1.5× safe carry | Red | Asking for far more than affordable |

### Yellow flags (2+ → "Borrow less")

| Condition | Flag | Why |
|---|---|---|
| Existing EMIs 35–50% of income | Yellow | High but not critical |
| Disposable income < 15% of income | Yellow | Thin margin |
| Emergency savings < 1 month | Yellow | No cushion |
| 1 EMI bounce | Yellow | Blemished record |
| Amount wanted > safe carry but ≤ 1.5× | Yellow | Over-reaching moderately |
| Consumption loan > 12 months income | Yellow | Large unproductive debt |

### Decision matrix

| Condition | Verdict |
|---|---|
| Red flags ≥ 2 | Don't borrow |
| Red flags ≥ 1 OR yellow flags ≥ 2 | Borrow less (suggest reduced amount) |
| Yellow flags ≥ 1 | Borrow less (suggest safe carry) |
| No flags | Borrow |

### Reduced amount suggestion

| Condition | Value |
|---|---|
| Red ≥ 1 or yellow ≥ 2 | min(safeCarry, amountWanted × 0.7) |
| Yellow ≥ 1 only | safeCarry |

**What we don't know:** Verdict is a heuristic, not a credit decision. A real underwriter has more data.

---

## 8. Confidence Scoring

| Component | Weight | Why |
|---|---|---|
| Critical questions answered | 65% | Must-have data drives all outputs |
| Additional questions answered | 25% | Each tightens a range |
| Credit score known | 10% | Unknown score = significant uncertainty |

| Score | Label | Band behaviour |
|---|---|---|
| ≥ 70 | High | No widening |
| 45–69 | Medium | ±7.5% band widening |
| < 45 | Low | ±15% band widening + "we're guessing" notice |

Critical questions: amountWanted, netMonthlyIncome, incomeType, existingEMIs, householdExpenses, age, loanType.

**What we don't know:** Confidence is a proxy for data completeness, not prediction accuracy.

---

## 9. Question Design

### Must questions (9)

| # | Question | What it drives |
|---|---|---|
| 1 | Purpose (text) | Verdict: need vs want, productive loan routing |
| 2 | Loan type (choice) | Rate band, tenure, FOIR, LTV |
| 3 | Amount wanted (number) | Eligibility comparison, verdict |
| 4 | Net monthly income (number) | FOIR, eligibility, EMI ceiling |
| 5 | Income type (choice) | Rate adjustment, stability, product routing |
| 6 | Existing EMIs (number) | FOIR, EMI ceiling, stress test |
| 7 | Household expenses (number) | Affordability, stress test |
| 8 | Age (number) | Max tenure, retirement-adjusted eligibility |
| 9 | Credit score (choice with "unknown") | Rate band, eligibility multiplier, confidence |

### Additional questions (12, conditional)

| # | Question | Condition | What it tightens |
|---|---|---|---|
| 10 | Income stability | Income known | Rate band, stress test |
| 11 | Income history years | Income known | Eligibility multiplier, rate |
| 12 | Variable income share | Not salaried | Stress severity, rate |
| 13 | Card utilisation | Score known | Rate band |
| 14 | Past EMI bounces | Existing EMIs > 0 | Rate, verdict, stress |
| 15 | Emergency savings months | Expenses known | Verdict, stress |
| 16 | Collateral value | Secured loan or business+SE | LTV, eligibility, rate |
| 17 | Co-applicant income | Income known | Eligibility, EMI ceiling |
| 18 | Upcoming large expense | Income known | Affordability, verdict |
| 19 | Productive loan return | Purpose is income-generating | Verdict, affordability |
| 20 | Offers received | Amount known | Negotiation card comparison |
| 21 | Residence type | Income known | Affordability buffer |
| 22 | Dependents | Income known | Affordability buffer, stress |

**Adaptive routing:** A salaried IT employee won't see "variable income share" (condition: not salaried). A personal loan borrower won't see "collateral value" (condition: secured loan type). A borrower with no existing EMIs won't see "past bounces."

**Unknown ≠ zero:** "I don't know my credit score" is modelled as unknown (null/0), not as 300. The rate band widens and a risk premium is added.

---

## 10. What We Don't Know

| Gap | How we handle it | Honesty |
|---|---|---|
| Actual lender underwriting models | Approximate with multipliers and FOIR | Stated in app + here |
| Real-time market rates | Static bands that may drift | Stated; bands are 2026 approximations |
| Borrower's true expenses | Self-reported | We trust but add buffer |
| Credit bureau data | Self-reported or unknown | Unknown modelled as wider band, not zero |
| Lender-specific processing fees | Midpoint of range | Stated as approximate |
| Floating rate risk | +2% in stress test | Stated as scenario, not prediction |
| Tax implications | Not modelled | Not in scope |
| Prepayment penalties | Not modelled | Borrower should check sanction letter |
| Co-applicant credit profile | Only income considered | Simplification stated |
| Foreclosure charges | Not modelled | Borrower should check |
