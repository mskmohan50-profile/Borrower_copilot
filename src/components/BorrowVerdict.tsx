import type { VerdictOutput } from '@/types/borrower';
import { ArrowRight } from 'lucide-react';
import { formatINR } from '@/utils/formatting';

interface BorrowVerdictProps {
  verdict: VerdictOutput;
}

const CONFIG: Record<VerdictOutput['decision'], { color: string; title: string; stamp: string }> = {
  borrow: { color: 'var(--seal-green)', title: 'Cleared to borrow', stamp: 'BORROW' },
  'borrow-less': { color: 'var(--seal-amber)', title: 'Borrow — but less', stamp: 'REDUCE' },
  'dont-borrow': { color: 'var(--seal-red)', title: "Don't borrow now", stamp: 'DECLINE' },
};

export default function BorrowVerdict({ verdict }: BorrowVerdictProps) {
  const c = CONFIG[verdict.decision];

  return (
    <div className="bg-paper border border-rule p-6 sm:p-8" style={{ boxShadow: '4px 4px 0 var(--rule)' }}>
      <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6 sm:gap-8">
        <div
          key={verdict.decision}
          className="shrink-0 w-28 h-28 rounded-full border-[3px] flex items-center justify-center text-center animate-stamp"
          style={{ borderColor: c.color, color: c.color, transform: 'rotate(-6deg)' }}
        >
          <div className="border border-current rounded-full w-[88px] h-[88px] flex items-center justify-center">
            <span className="font-mono text-[11px] font-bold tracking-widest leading-tight px-2">
              {c.stamp}
            </span>
          </div>
        </div>
        <div className="flex-1 text-center sm:text-left">
          <h2 className="font-serif text-2xl sm:text-3xl font-semibold text-ink mb-2">{c.title}</h2>
          <p className="text-ink-light leading-relaxed max-w-xl">{verdict.reason}</p>
          {verdict.reducedAmountSuggestion !== null && (
            <div className="mt-4 inline-flex items-center gap-2 border border-rule px-4 py-2.5 bg-paper-dark/40">
              <ArrowRight className="w-4 h-4 text-ink-light shrink-0" />
              <span className="text-sm text-ink">
                Consider borrowing{' '}
                <strong className="font-mono">{formatINR(verdict.reducedAmountSuggestion, true)}</strong> instead.
              </span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
