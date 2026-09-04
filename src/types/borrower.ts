export type LoanType =
  | 'personal'
  | 'home'
  | 'lap' 
  | 'gold'
  | 'business'
  | 'two-wheeler';

export type IncomeType = 'salaried' | 'self-employed' | 'informal';

export type EmploymentStability = 'stable' | 'moderate' | 'unstable';

export type ResidenceType = 'owned' | 'rented' | 'family';

export type CreditScoreKnown = 'excellent' | 'good' | 'average' | 'low' | 'unknown';

export interface BorrowerAnswers {
  purpose: string;
  amountWanted: number | null;
  loanType: LoanType;
  netMonthlyIncome: number | null;
  incomeType: IncomeType;
  existingEMIs: number | null;
  householdExpenses: number | null;
  age: number | null;
  creditScore: number | null; 

  
  employmentStability: EmploymentStability | null;
  incomeHistoryYears: number | null;
  variableIncomeShare: number | null;
  cardUtilization: number | null;
  pastBounces: number | null;
  emergencySavingsMonths: number | null; 
  collateralValue: number | null;
  coApplicantIncome: number | null;
  upcomingLargeExpense: number | null;
  productiveLoanReturn: number | null; 
  offersReceived: string | null; 
  residenceType: ResidenceType | null;
  dependents: number | null;
}

export interface ConfidenceMetrics {
  score: number; 
  label: 'low' | 'medium' | 'high';
  missingCritical: string[];
}

export interface VerdictOutput {
  decision: 'borrow' | 'borrow-less' | 'dont-borrow';
  reason: string;
  reducedAmountSuggestion: number | null;
}

export interface EligibilityOutput {
  lenderSanction: number; 
  safeCarry: number; 
  recommended: number;
  recommendationLabel: string;
  reason: string;
}

export interface RateOutput {
  fairBandLow: number; 
  fairBandHigh: number;
  aprLow: number; 
  aprHigh: number;
  processingFeePercent: number;
  reason: string;
}

export interface EMIOutput {
  monthlyCeiling: number;
  recommendedEMI: number;
  recommendedTenure: number;
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

export type AnswerValue = string | number | null;

export interface NegotiationCardData {
  borrowerProfile: string;
  loanType: string;
  fairRateBand: string;
  aprBand: string;
  maxEligible: string;
  safeEMI: string;
  keyLever: string;
  talkingPoints: string[];
}

export interface AssessmentResult {
  confidence: ConfidenceMetrics;
  verdict: VerdictOutput;
  eligibility: EligibilityOutput;
  rate: RateOutput;
  emi: EMIOutput;
  negotiation: NegotiationCardData;
}
