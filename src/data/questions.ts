import type { BorrowerAnswers, LoanType } from '@/types/borrower';

export type QuestionType = 'number' | 'choice' | 'text';

export interface QuestionOption {
  value: string;
  label: string;
}

export interface Question {
  id: keyof BorrowerAnswers | 'loanType';
  field: keyof BorrowerAnswers;
  question: string;
  helpText?: string;
  type: QuestionType;
  tier: 'must' | 'additional';
  unit?: string;
  placeholder?: string;
  options?: QuestionOption[];
  min?: number;
  max?: number;
  // Show this question only if this returns true
  condition?: (answers: Partial<BorrowerAnswers>) => boolean;
  // Whether this question tightens a range
  tightens: string;
}

export const QUESTIONS: Question[] = [
  // ===== MUST QUESTIONS =====
  {
    id: 'purpose',
    field: 'purpose',
    question: 'What are you borrowing for?',
    helpText: 'Tell us in a few words — e.g. wedding, business expansion, scooter for delivery.',
    type: 'text',
    tier: 'must',
    placeholder: 'e.g. Wedding expenses',
    tightens: 'Verdict: is this a need or a want?',
  },
  {
    id: 'loanType',
    field: 'loanType',
    question: 'What type of loan are you considering?',
    helpText: 'If unsure, pick what you think you\'ll apply for.',
    type: 'choice',
    tier: 'must',
    options: [
      { value: 'personal', label: 'Personal Loan' },
      { value: 'home', label: 'Home Loan' },
      { value: 'lap', label: 'Loan Against Property' },
      { value: 'gold', label: 'Gold Loan' },
      { value: 'business', label: 'Business Loan' },
      { value: 'two-wheeler', label: 'Two-Wheeler Loan' },
    ],
    tightens: 'Rate band, tenure, FOIR limit',
  },
  {
    id: 'amountWanted',
    field: 'amountWanted',
    question: 'How much do you want to borrow?',
    helpText: 'The amount you plan to ask the lender for.',
    type: 'number',
    tier: 'must',
    unit: '₹',
    placeholder: 'e.g. 500000',
    tightens: 'Eligibility comparison, verdict',
  },
  {
    id: 'netMonthlyIncome',
    field: 'netMonthlyIncome',
    question: 'What is your net (take-home) monthly income?',
    helpText: 'After tax deductions. If variable, give your typical month.',
    type: 'number',
    tier: 'must',
    unit: '₹/mo',
    placeholder: 'e.g. 60000',
    tightens: 'FOIR, eligibility, EMI ceiling',
  },
  {
    id: 'incomeType',
    field: 'incomeType',
    question: 'How do you earn your income?',
    helpText: 'This affects how lenders assess stability.',
    type: 'choice',
    tier: 'must',
    options: [
      { value: 'salaried', label: 'Salaried (company payroll)' },
      { value: 'self-employed', label: 'Self-employed (business/professional)' },
      { value: 'informal', label: 'Informal / gig / daily wage' },
    ],
    tightens: 'Rate band, stability factor, product routing',
  },
  {
    id: 'existingEMIs',
    field: 'existingEMIs',
    question: 'What is your total monthly EMI right now?',
    helpText: 'Add up all ongoing loan EMIs — personal, car, home, credit card EMI, app loans.',
    type: 'number',
    tier: 'must',
    unit: '₹/mo',
    placeholder: '0 if none',
    tightens: 'FOIR, EMI ceiling, stress test',
  },
  {
    id: 'householdExpenses',
    field: 'householdExpenses',
    question: 'What are your monthly household expenses?',
    helpText: 'Rent, groceries, utilities, school fees, transport — everything you spend to live.',
    type: 'number',
    tier: 'must',
    unit: '₹/mo',
    placeholder: 'e.g. 25000',
    tightens: 'Affordability, stress test',
  },
  {
    id: 'age',
    field: 'age',
    question: 'How old are you?',
    helpText: 'Affects maximum tenure and retirement considerations.',
    type: 'number',
    tier: 'must',
    unit: 'years',
    placeholder: 'e.g. 32',
    min: 18,
    max: 75,
    tightens: 'Max tenure, retirement-adjusted eligibility',
  },
  {
    id: 'creditScore',
    field: 'creditScore',
    question: 'Do you know your credit score (CIBIL)?',
    helpText: 'If you don\'t know, that\'s fine — we\'ll model the uncertainty.',
    type: 'choice',
    tier: 'must',
    options: [
      { value: '750', label: 'Above 750 (excellent)' },
      { value: '700', label: '700–749 (good)' },
      { value: '650', label: '600–699 (average)' },
      { value: '550', label: 'Below 600 (low)' },
      { value: '0', label: 'I don\'t know my score' },
    ],
    tightens: 'Rate band, confidence',
  },

  // ===== ADDITIONAL QUESTIONS =====
  {
    id: 'employmentStability',
    field: 'employmentStability',
    question: 'How stable is your income?',
    type: 'choice',
    tier: 'additional',
    options: [
      { value: 'stable', label: 'Very stable — same employer/business for 3+ years' },
      { value: 'moderate', label: 'Moderate — changed recently or seasonal' },
      { value: 'unstable', label: 'Unstable — varies a lot or recently disrupted' },
    ],
    condition: (a) => a.netMonthlyIncome != null,
    tightens: 'Rate band, stress test',
  },
  {
    id: 'incomeHistoryYears',
    field: 'incomeHistoryYears',
    question: 'How many years have you been in your current line of work?',
    helpText: 'Lenders look for vintage. Longer history = more confidence.',
    type: 'number',
    tier: 'additional',
    unit: 'years',
    placeholder: 'e.g. 5',
    condition: (a) => a.netMonthlyIncome != null,
    tightens: 'Eligibility multiplier, rate band',
  },
  {
    id: 'variableIncomeShare',
    field: 'variableIncomeShare',
    question: 'What share of your income varies month to month?',
    helpText: 'Bonuses, commissions, daily earnings. 0% if your income is fixed.',
    type: 'number',
    tier: 'additional',
    unit: '%',
    placeholder: '0–100',
    min: 0,
    max: 100,
    condition: (a) => a.incomeType !== 'salaried',
    tightens: 'Stress test severity, rate band',
  },
  {
    id: 'cardUtilization',
    field: 'cardUtilization',
    question: 'How much of your credit card limit do you typically use?',
    helpText: 'Total outstanding on cards ÷ total card limit.',
    type: 'number',
    tier: 'additional',
    unit: '%',
    placeholder: '0–100',
    min: 0,
    max: 100,
    condition: (a) => a.creditScore !== null && a.creditScore !== 0,
    tightens: 'Rate band, credit score adjustment',
  },
  {
    id: 'pastBounces',
    field: 'pastBounces',
    question: 'Any EMI bounces or missed payments in the last 12 months?',
    helpText: 'Count each bounced EMI or missed payment.',
    type: 'number',
    tier: 'additional',
    unit: 'count',
    placeholder: '0 if none',
    min: 0,
    condition: (a) => a.existingEMIs != null && a.existingEMIs > 0,
    tightens: 'Rate band, verdict, stress test',
  },
  {
    id: 'emergencySavingsMonths',
    field: 'emergencySavingsMonths',
    question: 'How many months of expenses do you have saved as emergency fund?',
    helpText: 'Liquid savings you could access in a week, ÷ monthly expenses.',
    type: 'number',
    tier: 'additional',
    unit: 'months',
    placeholder: 'e.g. 3',
    min: 0,
    condition: (a) => a.householdExpenses != null && a.householdExpenses > 0,
    tightens: 'Verdict, stress test',
  },
  {
    id: 'collateralValue',
    field: 'collateralValue',
    question: 'Do you own property or gold you could pledge?',
    helpText: 'Approximate market value of the asset you can offer as security.',
    type: 'number',
    tier: 'additional',
    unit: '₹',
    placeholder: 'e.g. 4500000',
    condition: (a) => {
      const lt = a.loanType as LoanType | undefined;
      return lt === 'lap' || lt === 'home' || lt === 'gold' || (a.loanType === 'business' && a.incomeType === 'self-employed');
    },
    tightens: 'Secured product routing, LTV, eligibility',
  },
  {
    id: 'coApplicantIncome',
    field: 'coApplicantIncome',
    question: 'Does anyone in your household earn additionally?',
    helpText: 'Spouse, parent — income that could support repayment or as co-applicant.',
    type: 'number',
    tier: 'additional',
    unit: '₹/mo',
    placeholder: '0 if none',
    condition: (a) => a.netMonthlyIncome != null,
    tightens: 'Eligibility, EMI ceiling',
  },
  {
    id: 'upcomingLargeExpense',
    field: 'upcomingLargeExpense',
    question: 'Any large expense coming up in the next year?',
    helpText: 'Medical, wedding, school admission — one-time costs you can see.',
    type: 'number',
    tier: 'additional',
    unit: '₹',
    placeholder: '0 if none',
    condition: (a) => a.netMonthlyIncome != null,
    tightens: 'Affordability, verdict',
  },
  {
    id: 'productiveLoanReturn',
    field: 'productiveLoanReturn',
    question: 'Will this loan generate income?',
    helpText: 'If for business, stock, or a vehicle for work — how much monthly income will it add?',
    type: 'number',
    tier: 'additional',
    unit: '₹/mo',
    placeholder: '0 if not for income',
    condition: (a) => {
      const p = (a.purpose || '').toLowerCase();
      return p.includes('business') || p.includes('stock') || p.includes('vehicle') || p.includes('delivery') || p.includes('scooter') || a.loanType === 'business';
    },
    tightens: 'Verdict, affordability',
  },
  {
    id: 'offersReceived',
    field: 'offersReceived',
    question: 'Have you already received an offer from a lender?',
    helpText: 'If you have a quote, enter the rate and amount. We\'ll compare it to fair.',
    type: 'text',
    tier: 'additional',
    placeholder: 'e.g. 14% for 5L (leave blank if none)',
    condition: (a) => a.amountWanted != null,
    tightens: 'Negotiation card comparison',
  },
  {
    id: 'residenceType',
    field: 'residenceType',
    question: 'Do you own or rent your home?',
    type: 'choice',
    tier: 'additional',
    options: [
      { value: 'owned', label: 'Owned' },
      { value: 'rented', label: 'Rented' },
      { value: 'family', label: 'Living with family' },
    ],
    condition: (a) => a.netMonthlyIncome != null,
    tightens: 'Affordability buffer, stability assessment',
  },
  {
    id: 'dependents',
    field: 'dependents',
    question: 'How many people depend on your income?',
    helpText: 'Children, elderly parents, non-earning spouse.',
    type: 'number',
    tier: 'additional',
    unit: 'people',
    placeholder: 'e.g. 2',
    min: 0,
    condition: (a) => a.netMonthlyIncome != null,
    tightens: 'Affordability buffer, stress test',
  },
];

export function getMustQuestions(): Question[] {
  return QUESTIONS.filter((q) => q.tier === 'must');
}

export function getAdditionalQuestions(answers: Partial<BorrowerAnswers>): Question[] {
  return QUESTIONS.filter((q) => q.tier === 'additional' && (!q.condition || q.condition(answers)));
}

export function getActiveQuestions(answers: Partial<BorrowerAnswers>): Question[] {
  return [...getMustQuestions(), ...getAdditionalQuestions(answers)];
}
