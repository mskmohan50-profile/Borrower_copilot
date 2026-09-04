import type { NegotiationCardData } from '@/types/borrower';

interface NegotiationCardProps {
  data: NegotiationCardData;
}

export default function NegotiationCard({ data }: NegotiationCardProps) {
  return (
    <div className="relative">
      {/* perforation strip */}
      <div
        className="absolute -top-2 left-4 right-4 h-4 flex items-center justify-between px-1 pointer-events-none"
        aria-hidden="true"
      >
        {Array.from({ length: 22 }).map((_, i) => (
          <span key={i} className="w-1.5 h-1.5 rounded-full bg-paper border border-rule" />
        ))}
      </div>

      <div className="border-2 border-spine bg-paper p-6 sm:p-8">
        <div className="flex items-center justify-between border-b border-rule pb-4 mb-5">
          <div>
            <p className="font-mono text-[10px] uppercase tracking-widest text-spine font-semibold">
              Negotiation card
            </p>
            <h3 className="font-serif text-xl font-semibold text-ink">Hold this up at the branch</h3>
          </div>
          <span className="font-mono text-[10px] text-ink-light border border-rule px-2 py-1 uppercase tracking-wide">
            Self-issued
          </span>
        </div>

        <div className="grid grid-cols-2 gap-x-4 gap-y-2 mb-5 font-mono text-xs">
          <p className="text-ink-light">Borrower</p>
          <p className="text-ink text-right capitalize">{data.borrowerProfile}</p>
          <p className="text-ink-light">Loan type</p>
          <p className="text-ink text-right">{data.loanType}</p>
        </div>

        <div className="grid grid-cols-2 border border-rule divide-x divide-rule mb-5">
          <div className="border-b border-rule p-3">
            <p className="font-mono text-[10px] uppercase tracking-widest text-ink-light mb-1">Fair rate band</p>
            <p className="font-mono text-lg font-semibold tabular" style={{ color: 'var(--seal-green)' }}>{data.fairRateBand}</p>
          </div>
          <div className="border-b border-rule p-3">
            <p className="font-mono text-[10px] uppercase tracking-widest text-ink-light mb-1">All-in cost (APR)</p>
            <p className="font-mono text-lg font-semibold text-ink tabular">{data.aprBand}</p>
          </div>
          <div className="p-3">
            <p className="font-mono text-[10px] uppercase tracking-widest text-ink-light mb-1">Eligible amount</p>
            <p className="font-mono text-sm font-semibold text-ink tabular">{data.maxEligible}</p>
          </div>
          <div className="p-3">
            <p className="font-mono text-[10px] uppercase tracking-widest text-ink-light mb-1">Safe EMI ceiling</p>
            <p className="font-mono text-lg font-semibold text-ink tabular">{data.safeEMI}</p>
          </div>
        </div>

        <div className="border-l-2 border-gold pl-3 py-1 mb-5">
          <p className="font-mono text-[10px] uppercase tracking-widest text-ink-light mb-1">Your strongest lever</p>
          <p className="text-sm text-ink">{data.keyLever}</p>
        </div>

        <div className="border-t border-rule pt-4">
          <p className="font-mono text-[10px] uppercase tracking-widest text-ink-light mb-3">Say this to the lender</p>
          <ul className="space-y-2">
            {data.talkingPoints.map((point, i) => (
              <li key={i} className="flex items-start gap-2 text-sm text-ink">
                <span className="text-spine shrink-0">—</span>
                <span>{point}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
