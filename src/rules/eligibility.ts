import type { BorrowerAnswers } from '@/types/borrower';
import type { LoanProduct } from '@/data/loanProducts';
import { clamp } from '@/utils/calculations';
import type { AffordabilityResult } from './affordability';

export interface EligibilityResult {
  lenderSanction: number; 
  safeCarry: number; 
  recommended: number;
  recommendationLabel: string;
  reason: string;
}

function getIncomeMultiplier(product: LoanProduct, incomeType: string): number {
  const base: Record<string, number> = {
    personal: 18,
    home: 30,
    lap: 24,
    gold: 25,
    business: 15,
    'two-wheeler': 12,
  };
  let mult = base[product.type] ?? 15;

  if (incomeType === 'informal') mult *= 0.6;
  else if (incomeType === 'self-employed') mult *= 0.85;

  return mult;
}

function getCreditAdjustment(creditScore: number | null): number {
  if (creditScore === null || creditScore === 0) return 0.8; 
  if (creditScore >= 750) return 1.0;
  if (creditScore >= 700) return 0.95;
  if (creditScore >= 650) return 0.8;
  if (creditScore >= 550) return 0.6;
  return 0.4;
}

function getMaxTenureForAge(age: number | null, product: LoanProduct): number {
  if (age === null) return product.typicalTenure[1] * 0.7;
  const maxAge = 60;
  const yearsToRetirement = Math.max(1, maxAge - age);
  const ageBasedTenure = yearsToRetirement * 12;
  return Math.min(product.typicalTenure[1], ageBasedTenure);
}

export function computeEligibility(
  answers: BorrowerAnswers,
  product: LoanProduct,
  affordability: AffordabilityResult
): EligibilityResult {
  const income = answers.netMonthlyIncome ?? 0;
  const coApplicant = answers.coApplicantIncome ?? 0;
  const totalIncome = income + coApplicant;

  const multiplier = getIncomeMultiplier(product, answers.incomeType);
  const creditAdj = getCreditAdjustment(answers.creditScore ?? null);

  let lenderSanction = totalIncome * multiplier * creditAdj;

  if (answers.incomeHistoryYears !== null) {
    if (answers.incomeHistoryYears >= 5) lenderSanction *= 1.1;
    else if (answers.incomeHistoryYears < 2) lenderSanction *= 0.85;
  }

  if (product.secured && answers.collateralValue && answers.collateralValue > 0) {
    const ltvCap = answers.collateralValue * (product.maxLTV / 100);
    lenderSanction = Math.min(lenderSanction, ltvCap);
  }
  if (answers.amountWanted && answers.amountWanted > 0) {
    lenderSanction = Math.min(lenderSanction, answers.amountWanted * 1.1);
  }

  lenderSanction = Math.round(clamp(lenderSanction, 0, 50000000));

  const maxTenure = getMaxTenureForAge(answers.age, product);
  const safeRate = product.rateRange[0] + (product.rateRange[1] - product.rateRange[0]) * 0.3;
  const safeEMI = affordability.safeEMICeiling;

  const monthlyRate = safeRate / 100 / 12;
  let safeCarry: number;
  if (monthlyRate > 0 && maxTenure > 0) {
    const factor = Math.pow(1 + monthlyRate, maxTenure);
    safeCarry = (safeEMI * (factor - 1)) / (monthlyRate * factor);
  } else {
    safeCarry = safeEMI * maxTenure;
  }

  safeCarry = Math.round(clamp(safeCarry, 0, 50000000));

  const recommended = Math.min(lenderSanction, safeCarry);
  const recommendationLabel = recommended === safeCarry ? 'Safe carry' : 'Lender sanction';

  let reason: string;
  if (safeCarry < lenderSanction) {
    reason = `A lender may sanction up to ₹${lenderSanction.toLocaleString('en-IN')} based on your income (${multiplier}x monthly income, adjusted for credit profile). But your safe carrying capacity is only ₹${safeCarry.toLocaleString('en-IN')} — that's what you can repay without stress. Use the lower number: ₹${recommended.toLocaleString('en-IN')}.`;
  } else {
    reason = `Your safe carrying capacity is ₹${safeCarry.toLocaleString('en-IN')}, and lenders may sanction up to ₹${lenderSanction.toLocaleString('en-IN')}. The lender's number is the constraint here — use ₹${recommended.toLocaleString('en-IN')}.`;
  }

  return {
    lenderSanction,
    safeCarry,
    recommended,
    recommendationLabel,
    reason,
  };
}
