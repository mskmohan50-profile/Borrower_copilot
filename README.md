# Borrower Copilot

A personal assistant that helps an Indian borrower answer four questions before they walk into a lender:

1. **Should I borrow at all?**
2. **How much am I really eligible for?**
3. **What is a fair rate for me?**
4. **What EMI should I agree to?**

Plus a **Negotiation Card** — one screen to hold up to the lender.

## Run locally

```bash
npm install
npm run dev
```

## How it works

1. **Welcome screen** — explains the four outputs and the negotiation card.
2. **Assessment** — 9 required questions + up to 12 adaptive optional questions. Questions adapt based on answers (a salaried employee won't see "variable income share"; a personal loan borrower won't see "collateral value"). Skip what you don't know — the app widens ranges and lowers confidence.
3. **Results** — four outputs plus the negotiation card, each with a one-sentence "why."

## Key design decisions

- **No backend.** Everything runs in the browser. No login, no data storage, no credit bureau pull.
- **Rules separated from UI.** All lending logic lives in `src/rules/`. The UI only renders results.
- **Unknown ≠ zero.** "I don't know my credit score" is modelled as unknown, not as 300. The rate band widens and a risk premium is added.
- **Confidence widens with silence.** Fewer answers = wider bands = lower confidence. The app says so explicitly.
- **Two numbers, always separated.** Lender sanction vs. safe carry. The borrower uses the lower one.
- **India, in rupees.** FOIR-based affordability, RBI-style APR disclosure, real product bands.

## Deliverables

- **[RULES.md](./RULES.md)** — Every rule, threshold, band, and assumption.
- **[RUNTHROUGHS.md](./RUNTHROUGHS.md)** — Priya, Ravi, and Anita: questions, outputs, negotiation cards.
- **The app** — `npm run dev` to see it live.

## Tech stack

- React 18 + TypeScript
- Vite (dev server + build)
- Tailwind CSS (styling)
- Lucide React (icons)

## What I'd build next

1. **LAP routing suggestion** — when a borrower selects "Business Loan" but has collateral, proactively suggest LAP and show the rate difference.
2. **Refinance detection** — when existing EMIs are at high rates (app loans > 30%), suggest consolidation.
3. **PDF export** of the negotiation card so the borrower can print it.
4. **Multiple loan comparison** — show two-wheeler vs personal vs gold side by side for the same borrower.
5. **Regional rate adjustment** — rates in metro vs tier-2/3 cities can differ by 50–100 bp.

## What I'd cut

1. The "offers received" question — useful in theory but the free-text parsing is fragile. Would replace with structured rate + amount inputs.
2. The separate `stressTest.ts` module — it duplicates logic already in `emi.ts`. Would consolidate.
