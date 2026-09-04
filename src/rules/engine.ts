import type { BorrowerAnswers, AssessmentResult, NegotiationCardData } from '@/types/borrower';
import { getLoanProduct } from '@/data/loanProducts';
import { computeConfidence } from './confidence';
import { computeAffordability } from './affordability';
import { computeEligibility } from './eligibility';
import { computeFairRate } from './rates';
import { computeEMI } from './emi';
import { computeVerdict } from './verdict';

export function runAssessment(answers: BorrowerAnswers): AssessmentResult {
  const product = getLoanProduct(answers.loanType);
  const confidence = computeConfidence(answers);

  const affordability = computeAffordability(answers, product);
  const eligibility = computeEligibility(answers, product, affordability);
  const rate = computeFairRate(answers, product, confidence.label);
  const emi = computeEMI(answers, product, affordability, rate, eligibility.recommended);
  const verdict = computeVerdict(answers, product, affordability, eligibility);

  const keyLever = determineKeyLever(answers, product);
  const talkingPoints = buildTalkingPoints(answers, product, rate, eligibility);

  const negotiation: NegotiationCardData = {
    borrowerProfile: `${answers.incomeType}, ${answers.age ?? '?'} yrs, ${answers.netMonthlyIncome ? `₹${answers.netMonthlyIncome.toLocaleString('en-IN')}/mo` : 'income unknown'}`,
    loanType: product.label,
    fairRateBand: `${rate.fairBandLow}% – ${rate.fairBandHigh}% p.a.`,
    aprBand: `${rate.aprLow}% – ${rate.aprHigh}% (all-in)`,
    maxEligible: `₹${eligibility.recommended.toLocaleString('en-IN')} (safe carry: ₹${eligibility.safeCarry.toLocaleString('en-IN')})`,
    safeEMI: `₹${emi.monthlyCeiling.toLocaleString('en-IN')}/mo`,
    keyLever,
    talkingPoints,
  };

  return {
    confidence,
    verdict,
    eligibility: {
      lenderSanction: eligibility.lenderSanction,
      safeCarry: eligibility.safeCarry,
      recommended: eligibility.recommended,
      recommendationLabel: eligibility.recommendationLabel,
      reason: eligibility.reason,
    },
    rate,
    emi,
    negotiation,
  };
}

function determineKeyLever(answers: BorrowerAnswers, product: ReturnType<typeof getLoanProduct>): string {
  if (product.secured && answers.collateralValue && answers.collateralValue > 0) {
    return 'You have collateral — this is a secured loan and your rate should reflect the lower risk.';
  }
  if (answers.creditScore && answers.creditScore >= 750) {
    return 'Your credit score is 750+ — you qualify for the best rate tier. Don\'t accept a quote meant for average profiles.';
  }
  if (answers.creditScore === 0 || answers.creditScore === null) {
    return 'No credit score — ask the lender to assess on income and collateral, not bureau history alone.';
  }
  if (answers.incomeHistoryYears && answers.incomeHistoryYears >= 5) {
    return `Your ${answers.incomeHistoryYears}-year income history is strong evidence of repayment capacity — use it to negotiate.`;
  }
  if (answers.coApplicantIncome && answers.coApplicantIncome > 0) {
    return 'Your co-applicant income strengthens the application — combined eligibility should get a better rate.';
  }
  return 'Your safe EMI ceiling is the key constraint — don\'t let the lender push you above it.';
}

function buildTalkingPoints(
  answers: BorrowerAnswers,
  product: ReturnType<typeof getLoanProduct>,
  rate: ReturnType<typeof computeFairRate>,
  eligibility: ReturnType<typeof computeEligibility>
): string[] {
  const points: string[] = [];

  points.push(`Fair rate for my profile is ${rate.fairBandLow}%–${rate.fairBandHigh}%. The all-in cost including your processing fee should be below ${rate.aprHigh}% APR.`);

  if (product.secured && answers.collateralValue) {
    points.push(`I'm offering collateral worth ₹${(answers.collateralValue / 100000).toFixed(1)}L. A secured loan should not be priced like an unsecured one.`);
  }

  if (answers.creditScore && answers.creditScore >= 750) {
    points.push(`My credit score is ${answers.creditScore}. That puts me in your lowest risk bucket — the rate should reflect that.`);
  }

  points.push(`My safe EMI ceiling is ₹${eligibility.recommended > 0 ? Math.round(eligibility.recommended / 100) * 100 : 0} in principal. I won't agree to an EMI above my safe monthly limit.`);

  if (answers.existingEMIs && answers.existingEMIs > 0) {
    points.push(`I already have ₹${answers.existingEMIs.toLocaleString('en-IN')}/mo in existing EMIs. The new EMI must keep my total obligations within safe FOIR.`);
  }

  points.push(`I want the processing fee capped at ${rate.processingFeePercent.toFixed(1)}%. Anything higher eats into the effective cost.`);

  if (answers.offersReceived) {
    points.push(`I've received an offer — I'm comparing it to the fair band. If your rate is above ${rate.fairBandHigh}%, I'll ask you to justify the premium.`);
  }

  return points;
}
