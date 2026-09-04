# RUNTHROUGHS.md — Three Borrowers

How the app processes Priya, Ravi, and Anita: the questions asked, the four outputs, and the Negotiation Card for each.

---

## Priya, 29 — Bengaluru, Salaried

**Profile:** Software engineer at a large MNC, 5 years. Net ₹1,10,000/month. One car loan EMI ₹14,000, 2 years left. Credit score 780. Rents at ₹28,000. Wants ₹8,00,000 personal loan for a wedding.

### Questions Asked

| #  | Question             | Priya's Answer                           | Tier       |
| -- | -------------------- | ---------------------------------------- | ---------- |
| 1  | Purpose              | "Wedding"                                | Must       |
| 2  | Loan type            | Personal Loan                            | Must       |
| 3  | Amount wanted        | ₹8,00,000                                | Must       |
| 4  | Net monthly income   | ₹1,10,000                                | Must       |
| 5  | Income type          | Salaried                                 | Must       |
| 6  | Existing EMIs        | ₹14,000                                  | Must       |
| 7  | Household expenses   | ₹28,000 rent + ~₹22,000 living = ₹50,000 | Must       |
| 8  | Age                  | 29                                       | Must       |
| 9  | Credit score         | 750+ (excellent) — actual 780            | Must       |
| 10 | Income stability     | Stable (5 years, same employer)          | Additional |
| 11 | Income history years | 5                                        | Additional |
| 12 | Card utilisation     | ~15%                                     | Additional |
| 13 | Emergency savings    | ~3 months                                | Additional |
| 14 | Residence type       | Rented                                   | Additional |
| 15 | Dependents           | 0                                        | Additional |

### Questions Skipped

* Variable income share → salaried, condition not met
* Past EMI bounces → appears because existing EMIs > 0
* Collateral value → personal loan, not secured
* Productive loan return → wedding, not income-generating
* Co-applicant income → ₹0 / not provided

### Output 1: Should you borrow?

**Verdict: Borrow, but less**

**Reason:** Existing EMIs are approximately 13% of income and are manageable. However, the wedding is a consumption expense and does not generate income. She wants ₹8,00,000, but her safe borrowing capacity is lower.

**Suggested amount: ~₹6,50,000**

### Output 2: How much?

| Number              |         Value |
| ------------------- | ------------: |
| Lender may sanction |    ₹19,80,000 |
| Safe carry          |     ₹6,50,000 |
| **Use this**        | **₹6,50,000** |

**Reason:** A lender may theoretically sanction up to ₹19.8L based on income, credit quality and employment vintage. However, affordability is the binding constraint. After ₹50,000 household expenses and ₹14,000 existing EMI, the safe new-EMI ceiling is approximately ₹22,000/month.

At approximately 11.5% for 5 years, ₹6.5L produces an EMI of approximately ₹14,300/month.

### Output 3: Fair Rate

|                          | Value               |
| ------------------------ | ------------------- |
| Base personal-loan range | 10.5%–24.0%         |
| Adjusted fair rate band  | **9.5%–13.5% p.a.** |
| Estimated APR            | **10.8%–14.9%**     |
| Processing fee           | ~2.5%               |

**Reason:** Her 780 credit score, stable salaried income, 5-year employment history and low card utilisation put her in a prime borrower category.

### Output 4: EMI

|                     |                   Value |
| ------------------- | ----------------------: |
| Monthly EMI ceiling |                 ₹22,000 |
| Recommended EMI     |             **₹14,300** |
| Recommended tenure  | **5 years / 60 months** |
| Recommended amount  |           **₹6,50,000** |

**Tenure trade-off at 11.5%, ₹6.5L:**

| Tenure  | Approx. EMI | Approx. Total Interest | Affordable?           |
| ------- | ----------: | ---------------------: | --------------------- |
| 2 years |     ₹30,400 |                ₹79,600 | No                    |
| 3 years |     ₹21,450 |              ₹1,22,200 | Yes, but tight        |
| 4 years |     ₹16,900 |              ₹1,61,000 | Yes                   |
| 5 years |     ₹14,300 |              ₹2,08,200 | **Yes — recommended** |

**Stress test:** Income drops 20% to ₹88,000 and rate rises to 13.5%.

* Stressed EMI: approximately **₹14,900/month**
* Stressed safe ceiling: approximately **₹16,800/month**
* **Survivable: Yes**

### Negotiation Card

```text
Borrower: Salaried, 29 yrs, ₹1,10,000/mo

Loan type: Personal Loan

Fair rate band: 9.5%–13.5% p.a.
All-in cost (APR): 10.8%–14.9%

Eligible amount: ₹6,50,000 (safe carry)

Safe EMI ceiling: ₹22,000/mo

Strongest lever:
Your credit score is 780. You are a low-risk borrower
and should qualify for the lender's best pricing tier.

Say this to the lender:

• My credit score is 780, so I expect your best rate tier.

• Fair pricing for my profile is approximately 9.5%–13.5%.

• My safe EMI ceiling is ₹22,000/month.

• I already have ₹14,000 in existing EMI obligations.

• Keep the total monthly debt obligation within a
  responsible FOIR.

• Cap the processing fee at 2.5%.

• Show me the complete APR/all-in cost before I accept.
```

---

## Ravi, 42 — Mysuru, Self-Employed

**Profile:** Kirana store owner, 14 years. Cash income ₹40,000–80,000/month; ITR shows ₹4,20,000/year (~₹35,000/month declared). Owns shop premises worth ₹45,00,000, unencumbered. No formal loan history and no known credit score. Wife earns ₹18,000 teaching. Wants ₹15,00,000 for stock + delivery vehicle.

### Questions Asked

| #  | Question               | Ravi's Answer                          | Tier       |
| -- | ---------------------- | -------------------------------------- | ---------- |
| 1  | Purpose                | Second stock line and delivery vehicle | Must       |
| 2  | Loan type              | Business Loan initially                | Must       |
| 3  | Amount wanted          | ₹15,00,000                             | Must       |
| 4  | Net monthly income     | ₹60,000 average                        | Must       |
| 5  | Income type            | Self-employed                          | Must       |
| 6  | Existing EMIs          | ₹0                                     | Must       |
| 7  | Household expenses     | ₹25,000                                | Must       |
| 8  | Age                    | 42                                     | Must       |
| 9  | Credit score           | "I don't know"                         | Must       |
| 10 | Income stability       | Stable, 14 years                       | Additional |
| 11 | Income history years   | 14                                     | Additional |
| 12 | Variable income share  | ~50%                                   | Additional |
| 13 | Collateral value       | ₹45,00,000                             | Additional |
| 14 | Co-applicant income    | ₹18,000                                | Additional |
| 15 | Productive loan return | ~₹20,000/month                         | Additional |
| 16 | Residence type         | Owned                                  | Additional |
| 17 | Dependents             | 3                                      | Additional |

### Questions Skipped

* Card utilisation → no known credit score
* Past EMI bounces → no existing EMIs
* Emergency savings → not provided

### Product Routing Note

Ravi initially selects an unsecured **Business Loan**.

However, he owns an unencumbered shop worth ₹45L against a ₹15L requirement. The app should therefore recommend considering a **Loan Against Property (LAP)**.

The collateral-to-loan ratio is strong:

**₹15L / ₹45L = 33.3% LTV**

A secured LAP structure could therefore offer materially better pricing than an unsecured business loan, subject to lender policy and income verification.

### Output 1: Should you borrow?

**Verdict: Borrow**

**Reason:** The loan is productive, there are no existing EMIs, the business has operated for 14 years, collateral is substantial, and there is additional household income from the co-applicant.

The major uncertainty is that his declared ITR income is only ₹4.2L/year and he has no known credit score.

### Output 2: How much?

The original sanction calculation was mathematically incorrect.

Using the stated formula:

**₹60,000 × 15 × 0.85 × 0.80 × 1.10 = ₹6,73,200**

So the calculated lender-sanction estimate is approximately **₹6,73,000**, not ₹10,20,000.

| Number                     |         Value |
| -------------------------- | ------------: |
| Calculated lender sanction | **₹6,73,200** |
| Safe carry                 |   ~₹18,50,000 |
| Requested amount           |    ₹15,00,000 |
| **Use this**               | **₹6,73,000** |

**Important:** The ₹18.5L safe-carry figure is an affordability estimate, not an approval amount. The lender's documented income and underwriting rules are the binding constraint.

For a LAP, the collateral does not appear to be the limiting factor:

**₹45L × 70% = ₹31.5L maximum theoretical LTV capacity**

The actual sanction would still depend on lender-specific income assessment, ITRs, property valuation, repayment capacity and credit underwriting.

### Output 3: Fair Rate

#### Business Loan — unsecured

|                    | Value           |
| ------------------ | --------------- |
| Base range         | 14.0%–28.0%     |
| Adjusted fair band | **17.5%–27.5%** |
| Estimated APR      | **18.8%–29.0%** |

#### LAP — recommended alternative

|                       | Value           |
| --------------------- | --------------- |
| Indicative fair band  | **10.5%–15.0%** |
| Estimated APR         | **11.2%–15.8%** |
| Processing fee target | ~2%             |

**Reason:** The secured structure materially reduces lender risk because the shop provides collateral. Final pricing will depend on lender, property, documentation, credit assessment and income verification.

### Output 4: EMI

**Recommended path: LAP**

For **₹6,73,000 at 12.75% for 5 years**:

* EMI ≈ **₹15,200/month**

For reference, if a lender approves the full requested ₹15L at 12.75% for 5 years:

* EMI ≈ **₹33,900/month**

### Tenure Trade-off — ₹6.73L at 12.75%

| Tenure  | Approx. EMI | Approx. Total Interest | Affordable?                    |
| ------- | ----------: | ---------------------: | ------------------------------ |
| 3 years |     ₹22,700 |              ₹1,45,000 | Yes                            |
| 4 years |     ₹18,000 |              ₹1,91,000 | Yes                            |
| 5 years |     ₹15,200 |              ₹2,39,000 | **Yes — recommended**          |
| 7 years |     ₹12,200 |              ₹3,56,000 | Yes, but higher total interest |

### Stress Test

Assume income drops 25%:

* Ravi income: ₹45,000
* Wife income: ₹18,000
* Combined income: ₹63,000
* Household expenses: ₹25,000
* Recommended EMI: ~₹15,200

Approximate post-expense cash flow:

**₹63,000 − ₹25,000 − ₹15,200 = ₹22,800**

**Survivable: Yes, but with a reduced safety margin.**

The productive return of approximately ₹20,000/month provides additional support, but it should not be treated as guaranteed income.

### Negotiation Card

```text
Borrower: Self-employed, 42 yrs, ₹60,000/mo
Co-applicant income: ₹18,000/mo

Loan type: Business Loan
Recommended alternative: LAP

Business loan fair rate: 17.5%–27.5%
LAP fair rate: 10.5%–15.0%

Calculated lender estimate: ~₹6,73,000

Strongest lever:
I own an unencumbered shop worth ₹45L.
A secured LAP structure should be considered instead
of an unsecured business loan.

Say this to the lender:

• I own an unencumbered commercial property worth ₹45L.

• My requested loan is ₹15L, which is only about 33%
  of the property's value.

• Please evaluate me for a secured LAP rather than
  an unsecured business loan.

• My business has operated for 14 years.

• My wife contributes ₹18,000/month to household income.

• The loan is productive and expected to generate
  approximately ₹20,000/month in additional income.

• Please provide the complete APR and all fees.

• Target processing fee: approximately 2% for LAP.
```

---

## Anita, 35 — Hubballi, Informal

**Profile:** Delivery-platform rider + home tailoring. ₹26,000–30,000/month. Two children, husband unemployed for 8 months. Three app loans, ₹35,000 outstanding at 30%+, one EMI bounced last month. Wants ₹1,50,000 for an electric scooter to increase delivery capacity.

### Questions Asked

| #  | Question               | Anita's Answer                                 | Tier       |
| -- | ---------------------- | ---------------------------------------------- | ---------- |
| 1  | Purpose                | Electric scooter to increase delivery capacity | Must       |
| 2  | Loan type              | Two-Wheeler Loan                               | Must       |
| 3  | Amount wanted          | ₹1,50,000                                      | Must       |
| 4  | Net monthly income     | ₹28,000 average                                | Must       |
| 5  | Income type            | Informal                                       | Must       |
| 6  | Existing EMIs          | ₹5,000/month                                   | Must       |
| 7  | Household expenses     | ₹18,000                                        | Must       |
| 8  | Age                    | 35                                             | Must       |
| 9  | Credit score           | "I don't know"                                 | Must       |
| 10 | Income stability       | Unstable                                       | Additional |
| 11 | Income history years   | 2                                              | Additional |
| 12 | Variable income share  | 40%                                            | Additional |
| 13 | Past EMI bounces       | 1                                              | Additional |
| 14 | Emergency savings      | 0 months                                       | Additional |
| 15 | Productive loan return | ~₹10,000/month                                 | Additional |
| 16 | Residence type         | Rented                                         | Additional |
| 17 | Dependents             | 3                                              | Additional |

### Questions Skipped

* Card utilisation → no known credit score
* Collateral value → vehicle itself is the security
* Co-applicant income → husband currently unemployed
* Upcoming large expense → not provided

### Output 1: Should you borrow?

**Verdict: Don't borrow now**

**Reason:** Multiple risk factors are present:

1. Existing app loans are at 30%+.
2. One recent EMI has already bounced.
3. Emergency savings are zero.
4. Income is variable.
5. Household expenses consume a large portion of income.
6. There are three dependents.
7. A new loan would increase debt pressure.

The scooter is potentially productive, but the existing high-cost debt needs to be addressed first.

**Recommended path:**

1. Avoid stacking another expensive loan.
2. Negotiate or consolidate the existing app loans.
3. Clear the ₹35,000 high-cost debt if possible.
4. Build at least a small emergency buffer.
5. Reassess the scooter loan after cash flow improves.

### Output 2: How much?

The original calculation needs an important correction.

The theoretical lender calculation is:

**₹28,000 × 12 × 0.60 × 0.80 = ₹1,61,280**

But the vehicle LTV cap at 90% of ₹1.5L is:

**₹1,50,000 × 90% = ₹1,35,000**

Therefore, the estimated lender amount is capped at approximately **₹1,35,000**, not ₹2,00,000.

| Number                          |         Value |
| ------------------------------- | ------------: |
| Theoretical income-based amount |     ₹1,61,280 |
| Vehicle LTV cap                 |     ₹1,35,000 |
| Estimated lender maximum        | **₹1,35,000** |
| Safe carry                      |  **~₹73,000** |
| **Recommended now**             |        **₹0** |

**Important:** Because the verdict is "Don't borrow now", the safest recommendation is **₹0 new borrowing today**.

If the existing high-cost debt is first cleared and her cash flow improves, a future two-wheeler loan could be reconsidered.

### Output 3: Fair Rate

|                        | Value           |
| ---------------------- | --------------- |
| Base two-wheeler range | 11.0%–22.0%     |
| Adjusted fair band     | **17.0%–26.0%** |
| Estimated APR          | **18.2%–27.5%** |
| Processing fee target  | ~2%             |

**Reason:** Informal income, limited income history, unknown credit score, unstable household income, variable earnings and a recent EMI bounce all increase risk.

### Output 4: EMI

The previous numbers were inconsistent because **₹80,000 at 21.5% for 60 months does not produce a ₹2,000 EMI**.

At 21.5%:

* ₹80,000 / 60 months → EMI ≈ **₹2,185/month**
* To keep EMI at ₹2,000/month → loan amount is approximately **₹73,200**

Therefore:

|                                              |                Value |
| -------------------------------------------- | -------------------: |
| Safe EMI ceiling                             |     **₹2,000/month** |
| Maximum amount at ~21.5% for 5 years         |         **~₹73,000** |
| Recommended new borrowing now                |               **₹0** |
| Recommended future amount after debt cleanup | **~₹70,000–₹73,000** |
| Recommended tenure                           |              5 years |

### Tenure Trade-off at 21.5%

For approximately ₹73,000:

| Tenure  | Approx. EMI | Affordable?                          |
| ------- | ----------: | ------------------------------------ |
| 2 years |      ₹3,760 | No                                   |
| 3 years |      ₹2,760 | No                                   |
| 4 years |      ₹2,310 | No                                   |
| 5 years |      ₹2,000 | **Yes, but only after debt cleanup** |

### Stress Test

Income drops 30%:

**₹28,000 × 70% = ₹19,600**

After household expenses and existing EMI:

**₹19,600 − ₹18,000 − ₹5,000 = −₹3,400**

She is already in a deficit before adding a new EMI.

* Stressed EMI: ~₹2,300
* Stressed available amount: **₹0**
* **Survivable: No**

### Negotiation Card

```text
Borrower: Informal, 35 yrs, ₹28,000/mo

Loan type: Two-Wheeler Loan

Fair rate band: 17.0%–26.0% p.a.
All-in cost (APR): 18.2%–27.5%

Safe EMI ceiling: ₹2,000/mo

Maximum future loan at ~21.5%:
~₹73,000 for 60 months

Current recommendation:
₹0 new borrowing until existing high-cost debt is addressed.

Strongest lever:
The scooter is productive and may generate approximately
₹10,000/month in additional delivery income, but existing
high-cost debt must be resolved first.

Say this to the lender:

• I have existing app loans at 30%+ and want to avoid
  taking another high-cost loan.

• My safe EMI ceiling is ₹2,000/month.

• Please structure any future two-wheeler loan within
  that EMI limit.

• The scooter is expected to generate approximately
  ₹10,000/month in additional delivery income.

• Target processing fee: no more than 2%.

• I want transparent APR and all charges disclosed.

WARNING:
Do not stack a new loan on top of the existing high-cost
app loans. Clear or consolidate the existing debt first.
```

---

# Summary Comparison

|                        |                                Priya |                            Ravi |                                         Anita |
| ---------------------- | -----------------------------------: | ------------------------------: | --------------------------------------------: |
| **Verdict**            |                          Borrow less |                          Borrow |                              Don't borrow now |
| **Amount wanted**      |                            ₹8,00,000 |                      ₹15,00,000 |                                     ₹1,50,000 |
| **Lender estimate**    |                           ₹19,80,000 |                     ~₹6,73,000* |                                   ₹1,35,000** |
| **Safe carry**         |                            ₹6,50,000 |                     ~₹18,50,000 |                                      ~₹73,000 |
| **Recommended now**    |                            ₹6,50,000 |                      ~₹6,73,000 |                                        **₹0** |
| **Fair rate**          |                           9.5%–13.5% |                 10.5%–15.0% LAP |                                   17.0%–26.0% |
| **EMI ceiling**        |                              ₹22,000 |                        ~₹43,000 |                                        ₹2,000 |
| **Recommended tenure** |                              5 years |                         5 years |                    5 years after debt cleanup |
| **Stress test**        |                           Survivable |             Survivable, tighter |                                Not survivable |
| **Key insight**        | Lender may over-lend; use safe carry | Use collateral and consider LAP | Clear high-cost app debt before new borrowing |

* Ravi's ₹6.73L figure follows the stated income-multiplier formula. Actual lender approval depends on ITR/declared income, property valuation, underwriting and credit assessment.

** Anita's ₹1.35L figure is the 90% vehicle-LTV cap on a ₹1.5L scooter. The theoretical income-based calculation is higher, so LTV is the binding constraint.

---

# Core Calculation Rules

The app should apply these rules consistently:

### 1. Lender Sanction

```text
Lender sanction =
monthly income
× income multiplier
× income-type adjustment
× credit adjustment
× vintage adjustment
```

Then apply any applicable **LTV/product cap**.

### 2. Safe Carry

Safe carry should be constrained by:

```text
Available monthly cash flow =
income
+ reliable co-applicant income
+ conservative productive-loan return
− household expenses
− existing EMIs
− required safety buffer
```

The safe EMI should then be converted into a maximum loan amount using the selected interest rate and tenure.

### 3. EMI

Use the standard amortizing-loan formula:

```text
EMI = P × r × (1+r)^n / ((1+r)^n − 1)
```

Where:

* `P` = principal
* `r` = monthly interest rate
* `n` = number of months

### 4. Decision Priority

The app should always prefer:

**Safe carry < lender sanction**

when affordability is the binding constraint.

And:

**Lender sanction < safe carry**

when underwriting/approval is the binding constraint.

### 5. High-Risk Override

If the borrower has:

* recent EMI bounce,
* zero emergency savings,
* unstable income,
* high-cost existing debt,
* or negative stressed cash flow,

the app should be allowed to override a mathematically positive borrowing capacity and recommend **"Don't borrow now."**

---

# Final App Logic

**Priya**

> Strong borrower, but the requested ₹8L is unnecessary for her safe cash flow. Recommend ₹6.5L.

**Ravi**

> Productive borrowing makes sense. His collateral is the strongest lever. Route him toward LAP rather than unsecured business credit, while recognizing that documented income may limit the sanction.

**Anita**

> The scooter itself is economically useful, but adding another loan while already carrying 30%+ app debt and having a recent bounce is unsafe. Recommend ₹0 new borrowing until the existing debt is addressed.
