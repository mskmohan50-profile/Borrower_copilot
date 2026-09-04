import type { LoanType } from '@/types/borrower';

export interface LoanProduct {
  type: LoanType;
  label: string;
  rateRange: [number, number]; // % p.a., typical market
  typicalTenure: [number, number]; // months
  processingFee: [number, number]; // %
  maxFOIR: number; // max % of net income available for all EMIs
  maxLTV: number; // max loan-to-value for secured
  description: string;
  secured: boolean;
}

export const LOAN_PRODUCTS: Record<LoanType, LoanProduct> = {
  personal: {
    type: 'personal',
    label: 'Personal Loan',
    rateRange: [10.5, 24],
    typicalTenure: [12, 60],
    processingFee: [1.5, 3.5],
    maxFOIR: 50,
    maxLTV: 0,
    description: 'Unsecured. Rate depends heavily on credit score and income profile.',
    secured: false,
  },
  home: {
    type: 'home',
    label: 'Home Loan',
    rateRange: [8.4, 10.5],
    typicalTenure: [60, 360],
    processingFee: [0.5, 1.0],
    maxFOIR: 55,
    maxLTV: 80,
    description: 'Secured by property. Lowest rates, longest tenure.',
    secured: true,
  },
  lap: {
    type: 'lap',
    label: 'Loan Against Property',
    rateRange: [9.5, 13],
    typicalTenure: [36, 240],
    processingFee: [1.0, 2.0],
    maxFOIR: 55,
    maxLTV: 70,
    description: 'Secured by property you own. Lower than personal, higher than home.',
    secured: true,
  },
  gold: {
    type: 'gold',
    label: 'Gold Loan',
    rateRange: [9, 18],
    typicalTenure: [3, 36],
    processingFee: [0.5, 1.5],
    maxFOIR: 60,
    maxLTV: 75,
    description: 'Secured by gold. Fast disbursal, rate depends on LTV.',
    secured: true,
  },
  business: {
    type: 'business',
    label: 'Business Loan',
    rateRange: [14, 28],
    typicalTenure: [12, 84],
    processingFee: [1.5, 3.0],
    maxFOIR: 55,
    maxLTV: 0,
    description: 'Unsecured business loan. Rate depends on ITR and business vintage.',
    secured: false,
  },
  'two-wheeler': {
    type: 'two-wheeler',
    label: 'Two-Wheeler Loan',
    rateRange: [11, 22],
    typicalTenure: [12, 48],
    processingFee: [1.0, 2.5],
    maxFOIR: 50,
    maxLTV: 90,
    description: 'Secured by the vehicle. Rate depends on credit profile.',
    secured: true,
  },
};

export function getLoanProduct(type: LoanType): LoanProduct {
  return LOAN_PRODUCTS[type];
}
