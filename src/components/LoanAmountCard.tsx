import type { EligibilityOutput } from '@/types/borrower';
import { formatINR } from '@/utils/formatting';

interface LoanAmountCardProps {
  eligibility: EligibilityOutput;
}

export default function LoanAmountCard({ eligibility }: LoanAmountCardProps) {
  const safeIsRecommended = eligibility.recommendationLabel === 'Safe carry';

  return (
    <div className="bg-paper border border-rule p-6 sm:p-7" style={{ boxShadow: '4px 4px 0 var(--rule)' }}>
      <h3 className="font-serif text-xl font-semibold text-ink mb-1">Maximum loan amount</h3>
      <p className="text-sm text-ink-light mb-5">Two numbers, often different. Use the lower one.</p>

      <div className="grid grid-cols-1 sm:grid-cols-3 border border-rule divide-y sm:divide-y-0 sm:divide-x divide-rule">
        <div className="p-4">
          <p className="font-mono text-[10px] uppercase tracking-widest text-ink-light mb-2">Lender may sanction</p>
          <p className="font-mono text-2xl font-semibold text-ink-light tabular">
            {formatINR(eligibility.lenderSanction, true)}
          </p>
          <p className="text-xs text-ink-light mt-1">What the bank will likely approve</p>
        </div>

        <div className={`p-4 ${safeIsRecommended ? 'bg-paper-dark/50' : ''}`}>
          <p className="font-mono text-[10px] uppercase tracking-widest text-ink-light mb-2">You can safely carry</p>
          <p
            className="font-mono text-2xl font-semibold tabular"
            style={{ color: safeIsRecommended ? 'var(--seal-green)' : 'var(--ink-light)' }}
          >
            {formatINR(eligibility.safeCarry, true)}
          </p>
          <p className="text-xs text-ink-light mt-1">What you can repay without stress</p>
        </div>

        <div className={`p-4 ${!safeIsRecommended ? 'bg-paper-dark/50' : ''}`}>
          <p className="font-mono text-[10px] uppercase tracking-widest text-ink-light mb-2">Use this number</p>
          <p className="font-mono text-2xl font-semibold text-ink tabular">
            {formatINR(eligibility.recommended, true)}
          </p>
          <p className="text-xs text-ink-light mt-1">The lower of the two — always</p>
        </div>
      </div>

      <p className="mt-4 text-sm text-ink-light leading-relaxed border-l-2 border-gold pl-3">
        {eligibility.reason}
      </p>
    </div>
  );
}
