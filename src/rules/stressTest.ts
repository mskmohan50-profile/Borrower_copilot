import type { BorrowerAnswers } from '@/types/borrower';
import type { LoanProduct } from '@/data/loanProducts';
import type { AffordabilityResult } from './affordability';
import type { EligibilityResult } from './eligibility';

export interface StressTestResult {
  scenario: string;
  incomeDrop: number;
  rateHike: number;
  stressedIncome: number;
  stressedEMI: number;
  stressedCeiling: number;
  survivable: boolean;
  reason: string;
}

export function computeStressTest(
  answers: BorrowerAnswers,
  product: LoanProduct,
  affordability: AffordabilityResult,
  eligibility: EligibilityResult,
  fairRate: number,
  recommendedTenure: number,
  recommendedAmount: number
): StressTestResult {
  const incomeDropPct =
    answers.incomeType === 'informal' ? 30 : answers.incomeType === 'self-employed' ? 25 : 20;

  const stressedIncome = (answers.netMonthlyIncome ?? 0) * (1 - incomeDropPct / 100);
  const stressedRate = fairRate + 2; 

  const monthlyRate = stressedRate / 100 / 12;
  const factor = Math.pow(1 + monthlyRate, recommendedTenure);
  const stressedEMI =
    monthlyRate > 0
      ? (recommendedAmount * monthlyRate * factor) / (factor - 1)
      : recommendedAmount / recommendedTenure;

  const stressedAvailableIncome =
    stressedIncome - (answers.householdExpenses ?? 0) - (answers.existingEMIs ?? 0);
  const stressedCeiling = Math.max(0, stressedAvailableIncome * 0.7);

  const survivable = stressedEMI <= stressedCeiling;

  const reason = survivable
    ? `Even if your income drops ${incomeDropPct}% and rates rise 2%, your EMI of ₹${Math.round(
        stressedEMI
      ).toLocaleString('en-IN')}/mo stays within what your stressed budget can handle (ceiling: ₹${Math.round(
        stressedCeiling
      ).toLocaleString('en-IN')}/mo). You would survive a bad stretch without defaulting.`
    : `If your income drops ${incomeDropPct}% and rates rise 2%, your EMI of ₹${Math.round(
        stressedEMI
      ).toLocaleString('en-IN')}/mo would exceed your stressed budget ceiling of ₹${Math.round(
        stressedCeiling
      ).toLocaleString('en-IN')}/mo. You would need to restructure, skip EMIs, or take emergency borrowing. This is a real risk.`;

  return {
    scenario: `Income drops ${incomeDropPct}% and interest rate rises by 2 percentage points`,
    incomeDrop: incomeDropPct,
    rateHike: 2,
    stressedIncome: Math.round(stressedIncome),
    stressedEMI: Math.round(stressedEMI),
    stressedCeiling: Math.round(stressedCeiling),
    survivable,
    reason,
  };
}
