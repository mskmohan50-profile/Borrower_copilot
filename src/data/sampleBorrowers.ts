import type { BorrowerAnswers } from '@/types/borrower';

export interface SampleBorrower {
  id: 'priya' | 'ravi' | 'anita';
  name: string;
  age: number;
  place: string;
  segment: string;
  blurb: string;
  ask: string;
  answers: BorrowerAnswers;
}

/**
 * The three brief borrowers, pre-filled exactly as the app's own questions
 * would capture them. Ranges are entered as the typical month; the variable
 * share question carries the spread so the engine widens the band itself.
 */
export const SAMPLE_BORROWERS: SampleBorrower[] = [
  {
    id: 'priya',
    name: 'Priya',
    age: 29,
    place: 'Bengaluru',
    segment: 'Salaried',
    blurb: 'Software engineer, large MNC, 5 years. Net ₹1,10,000/mo. Car loan EMI ₹14,000 with 2 years left. Score 780. Rents at ₹28,000.',
    ask: '₹8,00,000 personal loan for a wedding',
    answers: {
      purpose: 'Wedding expenses',
      loanType: 'personal',
      amountWanted: 800000,
      netMonthlyIncome: 110000,
      incomeType: 'salaried',
      existingEMIs: 14000,
      householdExpenses: 48000,
      age: 29,
      creditScore: 750,
      employmentStability: 'stable',
      incomeHistoryYears: 5,
      variableIncomeShare: 10,
      cardUtilization: 25,
      pastBounces: 0,
      emergencySavingsMonths: 3,
      collateralValue: null,
      coApplicantIncome: null,
      upcomingLargeExpense: null,
      productiveLoanReturn: null,
      offersReceived: '14% for 8L, 5 years',
      residenceType: 'rented',
      dependents: 0,
    },
  },
  {
    id: 'ravi',
    name: 'Ravi',
    age: 42,
    place: 'Mysuru',
    segment: 'Self-employed',
    blurb: 'Kirana store, 14 years. Cash ₹40,000–80,000/mo but ITR shows ₹4,20,000/yr. Owns shop premises worth ₹45,00,000, unencumbered. No credit history. Wife earns ₹18,000.',
    ask: '₹15,00,000 for a second stock line and a delivery vehicle',
    answers: {
      purpose: 'Second stock line and a delivery vehicle for the shop',
      loanType: 'lap',
      amountWanted: 1500000,
      netMonthlyIncome: 60000,
      incomeType: 'self-employed',
      existingEMIs: 0,
      householdExpenses: 32000,
      age: 42,
      creditScore: 0,
      employmentStability: 'stable',
      incomeHistoryYears: 14,
      variableIncomeShare: 45,
      cardUtilization: null,
      pastBounces: null,
      emergencySavingsMonths: 4,
      collateralValue: 4500000,
      coApplicantIncome: 18000,
      upcomingLargeExpense: null,
      productiveLoanReturn: 22000,
      offersReceived: null,
      residenceType: 'owned',
      dependents: 2,
    },
  },
  {
    id: 'anita',
    name: 'Anita',
    age: 35,
    place: 'Hubballi',
    segment: 'Informal',
    blurb: 'Delivery-platform rider plus home tailoring, ₹26,000–30,000/mo. Two children, husband unemployed 8 months. Three app loans, ₹35,000 outstanding above 30%, one EMI bounced last month.',
    ask: '₹1,50,000 for an electric scooter to double delivery runs',
    answers: {
      purpose: 'Electric scooter to double delivery runs',
      loanType: 'two-wheeler',
      amountWanted: 150000,
      netMonthlyIncome: 28000,
      incomeType: 'informal',
      existingEMIs: 4500,
      householdExpenses: 19000,
      age: 35,
      creditScore: 0,
      employmentStability: 'unstable',
      incomeHistoryYears: 2,
      variableIncomeShare: 60,
      cardUtilization: null,
      pastBounces: 1,
      emergencySavingsMonths: 0,
      collateralValue: null,
      coApplicantIncome: 0,
      upcomingLargeExpense: null,
      productiveLoanReturn: 7000,
      offersReceived: null,
      residenceType: 'rented',
      dependents: 3,
    },
  },
];
