import type { BorrowerAnswers } from '@/types/borrower';
import type { LoanProduct } from '@/data/loanProducts';
import { clamp, lerp } from '@/utils/calculations';

export interface RateResult {
  fairBandLow: number;
  fairBandHigh: number;
  aprLow: number;
  aprHigh: number;
  processingFeePercent: number;
  reason: string;
}

export function computeFairRate(
  answers: BorrowerAnswers,
  product: LoanProduct,
  confidence: 'low' | 'medium' | 'high'
): RateResult {
  const [baseLow, baseHigh] = product.rateRange;

  let adjustment = 0; 
  const factors: string[] = [];

  if (answers.creditScore === null || answers.creditScore === 0) {
    adjustment += 50; 
    factors.push('credit score unknown (+0.5% risk premium, wider band)');
  } else if (answers.creditScore >= 750) {
    adjustment -= 150; // -1.5%
    factors.push('credit score 750+ (−1.5%)');
  } else if (answers.creditScore >= 700) {
    adjustment -= 50;
    factors.push('credit score 700–749 (−0.5%)');
  } else if (answers.creditScore >= 650) {
    adjustment += 100;
    factors.push('credit score 600–699 (+1%)');
  } else {
    adjustment += 300;
    factors.push('credit score below 600 (+3%)');
  }

  if (answers.incomeType === 'informal') {
    adjustment += 200;
    factors.push('informal income (+2%)');
  } else if (answers.incomeType === 'self-employed') {
    adjustment += 50;
    factors.push('self-employed (+0.5%)');
  }

  if (answers.employmentStability === 'stable') {
    adjustment -= 25;
    factors.push('stable income (−0.25%)');
  } else if (answers.employmentStability === 'unstable') {
    adjustment += 100;
    factors.push('unstable income (+1%)');
  }

  if (product.secured && answers.collateralValue && answers.collateralValue > 0) {
    adjustment -= 75;
    factors.push('secured by collateral (−0.75%)');
  }

  if (answers.cardUtilization !== null) {
    if (answers.cardUtilization > 70) {
      adjustment += 75;
      factors.push('high card utilisation (+0.75%)');
    } else if (answers.cardUtilization < 30) {
      adjustment -= 25;
      factors.push('low card utilisation (−0.25%)');
    }
  }

  if (answers.pastBounces && answers.pastBounces > 0) {
    adjustment += answers.pastBounces * 75;
    factors.push(`${answers.pastBounces} EMI bounce(s) (+${answers.pastBounces * 0.75}%)`);
  }

  if (answers.incomeHistoryYears !== null) {
    if (answers.incomeHistoryYears >= 10) {
      adjustment -= 25;
      factors.push('10+ years vintage (−0.25%)');
    } else if (answers.incomeHistoryYears < 2) {
      adjustment += 50;
      factors.push('less than 2 years vintage (+0.5%)');
    }
  }

  const adjustmentPercent = adjustment / 100;

  let bandLow = baseLow + adjustmentPercent;
  let bandHigh = baseHigh + adjustmentPercent;

  if (confidence === 'low') {
    const widen = (bandHigh - bandLow) * 0.3;
    bandLow -= widen / 2;
    bandHigh += widen / 2;
  } else if (confidence === 'medium') {
    const widen = (bandHigh - bandLow) * 0.15;
    bandLow -= widen / 2;
    bandHigh += widen / 2;
  }

  bandLow = clamp(bandLow, 1, 40);
  bandHigh = clamp(bandHigh, bandLow + 0.5, 45);

  const feeLow = product.processingFee[0];
  const feeHigh = product.processingFee[1];
  const processingFeePercent = lerp(feeLow, feeHigh, 0.5);
  const typicalTenure = (product.typicalTenure[0] + product.typicalTenure[1]) / 2;
  const aprLow = computeAPR(bandLow, processingFeePercent, typicalTenure);
  const aprHigh = computeAPR(bandHigh, processingFeePercent, typicalTenure);

  const reason = `Base range for ${product.label} is ${baseLow}–${baseHigh}%. Adjusted by: ${factors.join(', ')}. ${
    confidence === 'low' ? 'Band widened because some key answers are missing.' : ''
  } All-in cost (APR) includes a processing fee of ~${processingFeePercent.toFixed(1)}%.`;

  return {
    fairBandLow: round1(bandLow),
    fairBandHigh: round1(bandHigh),
    aprLow: round1(aprLow),
    aprHigh: round1(aprHigh),
    processingFeePercent,
    reason,
  };
}

function computeAPR(annualRate: number, processingFeePercent: number, tenureMonths: number): number {
  const feeAmortized = (processingFeePercent / (tenureMonths / 12));
  return annualRate + feeAmortized;
}

function round1(v: number): number {
  return Math.round(v * 10) / 10;
}
