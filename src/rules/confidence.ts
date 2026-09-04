import type { BorrowerAnswers, ConfidenceMetrics } from '@/types/borrower';

const CRITICAL_FIELDS: (keyof BorrowerAnswers)[] = [
  'amountWanted',
  'netMonthlyIncome',
  'incomeType',
  'existingEMIs',
  'householdExpenses',
  'age',
  'loanType',
];

export function computeConfidence(answers: Partial<BorrowerAnswers>): ConfidenceMetrics {
  const missingCritical: string[] = [];
  let criticalAnswered = 0;

  for (const field of CRITICAL_FIELDS) {
    const val = answers[field];
    if (val === null || val === undefined || val === '') {
      missingCritical.push(field);
    } else {
      criticalAnswered++;
    }
  }

  const additionalFields: (keyof BorrowerAnswers)[] = [
    'employmentStability',
    'incomeHistoryYears',
    'variableIncomeShare',
    'cardUtilization',
    'pastBounces',
    'emergencySavingsMonths',
    'collateralValue',
    'coApplicantIncome',
    'upcomingLargeExpense',
    'productiveLoanReturn',
    'residenceType',
    'dependents',
  ];

  let additionalAnswered = 0;
  for (const field of additionalFields) {
    const val = answers[field];
    if (val !== null && val !== undefined && val !== '') {
      additionalAnswered++;
    }
  }

  const creditUnknown = answers.creditScore === 0 || answers.creditScore === null;

  const criticalPct = criticalAnswered / CRITICAL_FIELDS.length;
  const additionalPct = additionalAnswered / additionalFields.length;
  let score = criticalPct * 65 + additionalPct * 25 + (creditUnknown ? 0 : 10);
  score = Math.round(Math.min(100, score));

  let label: 'low' | 'medium' | 'high';
  if (score >= 70) label = 'high';
  else if (score >= 45) label = 'medium';
  else label = 'low';

  return { score, label, missingCritical };
}
