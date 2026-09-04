import type { BorrowerAnswers } from "@/types/borrower";
import type { LoanProduct } from "@/data/loanProducts";
import type { AffordabilityResult } from "./affordability";
import type { EligibilityResult } from "./eligibility";

export interface VerdictResult {
  decision: "borrow" | "borrow-less" | "dont-borrow";
  reason: string;
  reducedAmountSuggestion: number | null;
}

export function computeVerdict(
  answers: BorrowerAnswers,
  product: LoanProduct,
  affordability: AffordabilityResult,
  eligibility: EligibilityResult
): VerdictResult {
  const income = answers.netMonthlyIncome ?? 0;
  const existingEMIs = answers.existingEMIs ?? 0;
  const expenses = answers.householdExpenses ?? 0;
  const amountWanted = answers.amountWanted ?? 0;

  const reasons: string[] = [];
  let redFlags = 0;
  let yellowFlags = 0;

  if (income > 0) {
    const currentFOIR = (existingEMIs / income) * 100;

    if (currentFOIR > 50) {
      redFlags++;
      reasons.push(
        `Your existing EMIs are already ${currentFOIR.toFixed(0)}% of income — above the 50% danger line. Adding another loan is very risky.`
      );
    } else if (currentFOIR > 35) {
      yellowFlags++;
      reasons.push(
        `Existing EMIs are ${currentFOIR.toFixed(0)}% of income — high but manageable if the new EMI is small.`
      );
    }
  }

  const disposable = income - expenses - existingEMIs;

  if (disposable < 0) {
    redFlags++;
    reasons.push(
      `Your expenses and existing EMIs already exceed your income. You are running a monthly deficit.`
    );
  } else if (disposable < income * 0.15) {
    yellowFlags++;
    reasons.push(
      `Only ${((disposable / income) * 100).toFixed(0)}% of income is left after expenses and EMIs — thin margin.`
    );
  }

  if (affordability.safeEMICeiling < 1000) {
    redFlags++;
    reasons.push(
      `After expenses and a survival buffer, you have no room for a new EMI.`
    );
  }

  if (
    answers.emergencySavingsMonths !== null &&
    answers.emergencySavingsMonths < 1
  ) {
    yellowFlags++;
    reasons.push(
      `You have less than 1 month of emergency savings — no cushion if income stops.`
    );
  }

  if (answers.pastBounces && answers.pastBounces > 0) {
    if (answers.pastBounces >= 2) {
      redFlags++;
      reasons.push(
        `${answers.pastBounces} EMI bounces in the last year — lenders will see you as high risk, and you may be struggling already.`
      );
    } else {
      yellowFlags++;
      reasons.push(
        `1 EMI bounce recently — your repayment track record is blemished.`
      );
    }
  }

  if (amountWanted > 0 && eligibility.safeCarry > 0) {
    if (amountWanted > eligibility.safeCarry * 1.5) {
      redFlags++;
      reasons.push(
        `You want ₹${amountWanted.toLocaleString("en-IN")} but can safely carry only ₹${eligibility.safeCarry.toLocaleString("en-IN")}. That's ${(amountWanted / eligibility.safeCarry).toFixed(1)}x your safe limit.`
      );
    } else if (amountWanted > eligibility.safeCarry) {
      yellowFlags++;
      reasons.push(
        `You want more than your safe carrying capacity (₹${eligibility.safeCarry.toLocaleString("en-IN")}). Consider reducing the amount.`
      );
    }
  }

  const isConsumption =
    !answers.productiveLoanReturn || answers.productiveLoanReturn === 0;

  if (
    isConsumption &&
    product.type === "personal" &&
    amountWanted > income * 12
  ) {
    yellowFlags++;
    reasons.push(
      `This is a consumption loan (no income generated) larger than a year's income. Think carefully.`
    );
  }

  let decision: "borrow" | "borrow-less" | "dont-borrow";
  let reducedAmountSuggestion: number | null = null;

  if (redFlags >= 2) {
    decision = "dont-borrow";
  } else if (redFlags >= 1 || yellowFlags >= 2) {
    decision = "borrow-less";

    if (eligibility.safeCarry > 0) {
      reducedAmountSuggestion = Math.min(
        eligibility.safeCarry,
        amountWanted * 0.7
      );
    }
  } else if (yellowFlags >= 1) {
    decision = "borrow-less";

    if (
      eligibility.safeCarry > 0 &&
      eligibility.safeCarry < amountWanted
    ) {
      reducedAmountSuggestion = eligibility.safeCarry;
    }
  } else {
    decision = "borrow";
  }

  const headline =
    decision === "dont-borrow"
      ? `Don't borrow right now. ${
          reasons[0] ??
          "Your financial profile does not support new debt."
        }`
      : decision === "borrow-less"
      ? `Borrow, but less than you planned. ${
          reasons[0] ??
          "You can afford a smaller amount than you want."
        }`
      : `You're in a position to borrow. Your income, existing obligations, and buffer support this loan.`;

  const fullReason =
    reasons.length > 0
      ? `${headline} ${reasons.slice(1).join(" ")}`
      : headline;

  return {
    decision,
    reason: fullReason,
    reducedAmountSuggestion:
      reducedAmountSuggestion !== null
        ? Math.round(reducedAmountSuggestion)
        : null,
  };
}

