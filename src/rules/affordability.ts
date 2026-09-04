import type { BorrowerAnswers, IncomeType, EmploymentStability, ResidenceType } from '@/types/borrower';
import type { LoanProduct } from '@/data/loanProducts';

export interface AffordabilityResult {
  netIncome: number;
  existingEMIs: number;
  householdExpenses: number;
  availableForEMI: number; 
  foirLimit: number; 
  expenseBuffer: number; 
  safeEMICeiling: number; 
  reason: string;
}

function getStabilityFactor(stability: EmploymentStability | null, incomeType: IncomeType): number {
  if (stability === 'stable') return 1.0;
  if (stability === 'moderate') return 0.9;
  if (stability === 'unstable') return 0.75;
  if (incomeType === 'salaried') return 0.95;
  if (incomeType === 'self-employed') return 0.85;
  return 0.7; 
}

function getDependentBuffer(dependents: number | null): number {
  if (dependents === null) return 0.85;
  if (dependents === 0) return 1.0;
  if (dependents <= 2) return 0.9;
  return 0.8;
}

function getResidenceBuffer(residence: ResidenceType | null): number {
  if (residence === 'owned') return 1.05; 
  if (residence === 'family') return 1.0;
  if (residence === 'rented') return 0.9;
  return 0.95;
}

export function computeAffordability(
  answers: BorrowerAnswers,
  product: LoanProduct
): AffordabilityResult {
  const income = answers.netMonthlyIncome ?? 0;
  const coApplicant = answers.coApplicantIncome ?? 0;
  const totalIncome = income + coApplicant;
  const existingEMIs = answers.existingEMIs ?? 0;
  const householdExpenses = answers.householdExpenses ?? 0;

  
  let foirLimit = product.maxFOIR;

  if (answers.incomeType === 'informal') foirLimit *= 0.8;
  if (answers.incomeType === 'self-employed') foirLimit *= 0.95;

  if (answers.variableIncomeShare && answers.variableIncomeShare > 40) {
    foirLimit *= 0.9;
  }

  const stabilityFactor = getStabilityFactor(answers.employmentStability, answers.incomeType);
  foirLimit *= stabilityFactor;

  const foirCeiling = totalIncome * (foirLimit / 100) - existingEMIs;

  const dependantBuffer = getDependentBuffer(answers.dependents);
  const residenceBuffer = getResidenceBuffer(answers.residenceType);

  const afterExpenses = totalIncome - householdExpenses - existingEMIs;
  const survivalBuffer = afterExpenses * 0.3 * dependantBuffer * residenceBuffer;
  const expenseCeiling = Math.max(0, afterExpenses - survivalBuffer);

  let safeEMICeiling: number;
  if (householdExpenses > 0) {
    safeEMICeiling = Math.min(foirCeiling, expenseCeiling);
  } else {
    safeEMICeiling = foirCeiling * 0.7;
  }

  if (answers.upcomingLargeExpense && answers.upcomingLargeExpense > 0) {
    safeEMICeiling -= answers.upcomingLargeExpense / 12;
  }

  safeEMICeiling = Math.max(0, safeEMICeiling);

  if (answers.productiveLoanReturn && answers.productiveLoanReturn > 0) {

    safeEMICeiling += answers.productiveLoanReturn * 0.7;
  }

  safeEMICeiling = Math.max(0, Math.round(safeEMICeiling));

  const foirPct = Math.round(foirLimit);

  const reason = `Your available income after expenses and existing EMIs is ₹${Math.round(
    totalIncome - householdExpenses - existingEMIs
  ).toLocaleString('en-IN')}/mo. After keeping a survival buffer for ${
    answers.dependents !== null ? `${answers.dependents} dependent${answers.dependents !== 1 ? 's' : ''}` : 'dependents'
  }, your safe EMI ceiling is ₹${safeEMICeiling.toLocaleString('en-IN')}/mo. This uses a FOIR of ${foirPct}% of your ₹${totalIncome.toLocaleString(
    'en-IN'
  )} income${coApplicant > 0 ? ' (including co-applicant)' : ''}.`;

  return {
    netIncome: totalIncome,
    existingEMIs,
    householdExpenses,
    availableForEMI: Math.round(foirCeiling),
    foirLimit: foirPct,
    expenseBuffer: Math.round(expenseCeiling),
    safeEMICeiling,
    reason,
  };
}
