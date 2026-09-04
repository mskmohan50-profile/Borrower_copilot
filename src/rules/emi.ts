import type { BorrowerAnswers } from '@/types/borrower';
import type { LoanProduct } from '@/data/loanProducts';
import { emi as calcEMI, totalInterest } from '@/utils/calculations';
import type { AffordabilityResult } from './affordability';
import type { RateResult } from './rates';

export interface EMIResult {
  monthlyCeiling: number;
  recommendedEMI: number;
  recommendedTenure: number; // months
  recommendedAmount: number;
  tenureOptions: { tenure: number; emi: number; totalInterest: number; affordable: boolean }[];
  stressCase: {
    scenario: string;
    incomeAfterShock: number;
    emiAfterShock: number;
    affordable: boolean;
    reason: string;
  };
  reason: string;
}

function getMaxTenureForAge(age: number | null, product: LoanProduct): number {
  if (age === null) return product.typicalTenure[1] * 0.7;
  const maxAge = 60;
  const yearsToRetirement = Math.max(1, maxAge - age);
  return Math.min(product.typicalTenure[1], yearsToRetirement * 12);
}

export function computeEMI(
  answers: BorrowerAnswers,
  product: LoanProduct,
  affordability: AffordabilityResult,
  rate: RateResult,
  recommendedAmount: number
): EMIResult {
  const ceiling = affordability.safeEMICeiling;
  const fairRate = (rate.fairBandLow + rate.fairBandHigh) / 2;
  const maxTenure = Math.floor(getMaxTenureForAge(answers.age, product));
  const tenureOptions: EMIResult['tenureOptions'] = [];
  const tenureSteps = generateTenureSteps(product, maxTenure);

  for (const tenure of tenureSteps) {
    const e = calcEMI(recommendedAmount, fairRate, tenure);
    const ti = totalInterest(recommendedAmount, fairRate, tenure);
    tenureOptions.push({
      tenure,
      emi: Math.round(e),
      totalInterest: Math.round(ti),
      affordable: e <= ceiling,
    });
  }
  const affordableOptions = tenureOptions.filter((o) => o.affordable);
  let recommendedTenure: number;
  let recommendedEMI: number;

  if (affordableOptions.length > 0) {
    const best = affordableOptions[0];
    recommendedTenure = best.tenure;
    recommendedEMI = best.emi;
  } else {
    const longest = tenureOptions[tenureOptions.length - 1];
    recommendedTenure = longest.tenure;
    recommendedEMI = longest.emi;
  }

  const stressIncomeDrop = answers.incomeType === 'informal' ? 0.3 : answers.incomeType === 'self-employed' ? 0.25 : 0.2;
  const stressedIncome = (answers.netMonthlyIncome ?? 0) * (1 - stressIncomeDrop);
  const stressedRate = fairRate + 2;
  const stressedEMI = calcEMI(recommendedAmount, stressedRate, recommendedTenure);
  const stressedAvailableIncome = stressedIncome - (answers.householdExpenses ?? 0) - (answers.existingEMIs ?? 0);
  const stressedSurvivalBuffer = stressedAvailableIncome * 0.3;
  const stressedEMICeiling = Math.max(0, stressedAvailableIncome - stressedSurvivalBuffer);
  const stressAffordable = stressedEMI <= stressedEMICeiling;

  const stressScenario = `Income drops ${stressIncomeDrop * 100}% (to ₹${Math.round(stressedIncome).toLocaleString('en-IN')}/mo) AND rate rises 2% (to ${stressedRate.toFixed(1)}%).`;

  const stressReason = stressAffordable
    ? `Even with ${stressIncomeDrop * 100}% income cut and a 2% rate hike, your EMI of ₹${Math.round(stressedEMI).toLocaleString('en-IN')}/mo stays within your stressed budget. You'd survive a bad year.`
    : `If income drops ${stressIncomeDrop * 100}% and rate rises 2%, your EMI rises to ₹${Math.round(stressedEMI).toLocaleString('en-IN')}/mo — above your stressed ceiling of ₹${Math.round(stressedEMICeiling).toLocaleString('en-IN')}/mo. This would force a restructuring or default.`;

  const reason = `Your monthly EMI ceiling is ₹${ceiling.toLocaleString('en-IN')}/mo — the most you should pay without squeezing your survival buffer. At a fair rate of ${fairRate.toFixed(1)}% for ₹${recommendedAmount.toLocaleString('en-IN')}, a ${Math.floor(recommendedTenure / 12)}-year tenure gives an EMI of ₹${recommendedEMI.toLocaleString('en-IN')}/mo. ${
    affordableOptions.length > 0
      ? 'Shorter tenures cost more per month but save you lakhs in interest.'
      : 'Even the longest tenure exceeds your ceiling — consider borrowing less.'
  }`;

  return {
    monthlyCeiling: ceiling,
    recommendedEMI: Math.round(recommendedEMI),
    recommendedTenure,
    recommendedAmount,
    tenureOptions,
    stressCase: {
      scenario: stressScenario,
      incomeAfterShock: Math.round(stressedIncome),
      emiAfterShock: Math.round(stressedEMI),
      affordable: stressAffordable,
      reason: stressReason,
    },
    reason,
  };
}

function generateTenureSteps(product: LoanProduct, maxTenure: number): number[] {
  const [minT, maxT] = product.typicalTenure;
  const steps: number[] = [];

  if (product.type === 'home' || product.type === 'lap') {
    for (let y = 5; y <= Math.floor(maxTenure / 12); y += 5) {
      steps.push(y * 12);
    }
  } else if (product.type === 'business') {
    for (let y = 1; y <= Math.floor(maxTenure / 12); y += 1) {
      steps.push(y * 12);
    }
  } else {
    for (let y = 1; y <= Math.floor(maxTenure / 12); y += 1) {
      steps.push(y * 12);
    }
  }

  const filtered = steps.filter((t) => t >= minT && t <= maxTenure);
  if (filtered.length < 2) {
    filtered.push(Math.min(maxT, maxTenure));
  }
  return [...new Set(filtered)].sort((a, b) => a - b);
}
