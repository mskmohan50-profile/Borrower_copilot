import type { RateOutput } from '@/types/borrower';

interface RateCardProps {
  rate: RateOutput;
  offerRate?: number | null;
}

export default function RateCard({ rate, offerRate }: RateCardProps) {
  const inBand = offerRate !== undefined && offerRate !== null && offerRate >= rate.fairBandLow && offerRate <= rate.fairBandHigh;
  const aboveBand = offerRate !== undefined && offerRate !== null && offerRate > rate.fairBandHigh;
  const belowBand = offerRate !== undefined && offerRate !== null && offerRate < rate.fairBandLow;

  return (
    <div className="bg-paper border border-rule p-6 sm:p-7" style={{ boxShadow: '4px 4px 0 var(--rule)' }}>
      <h3 className="font-serif text-xl font-semibold text-ink mb-1">Fair interest rate</h3>
      <p className="text-sm text-ink-light mb-5">A band, not a point. Compare the lender's quote against this.</p>

      <div className="grid grid-cols-1 sm:grid-cols-2 border border-rule divide-y sm:divide-y-0 sm:divide-x divide-rule mb-4">
        <div className="p-4">
          <p className="font-mono text-[10px] uppercase tracking-widest text-ink-light mb-2">Fair rate band</p>
          <p className="font-mono text-3xl font-semibold text-ink tabular">
            {rate.fairBandLow}%<span className="text-xl text-ink-light"> – </span>{rate.fairBandHigh}%
          </p>
          <p className="text-xs text-ink-light mt-1">per annum, reducing balance</p>
        </div>

        <div className="p-4">
          <p className="font-mono text-[10px] uppercase tracking-widest text-ink-light mb-2">All-in cost (APR)</p>
          <p className="font-mono text-3xl font-semibold text-ink-light tabular">
            {rate.aprLow}%<span className="text-xl"> – </span>{rate.aprHigh}%
          </p>
          <p className="text-xs text-ink-light mt-1">includes {rate.processingFeePercent.toFixed(1)}% processing fee</p>
        </div>
      </div>

      {offerRate !== undefined && offerRate !== null && offerRate > 0 && (
        <div
          className="px-4 py-3 mb-4 border-l-2"
          style={{
            borderColor: inBand ? 'var(--seal-green)' : aboveBand ? 'var(--seal-red)' : 'var(--seal-amber)',
            backgroundColor: 'var(--paper-dark)',
          }}
        >
          <p className="text-sm text-ink">
            {inBand && <>Your lender quoted <strong className="font-mono">{offerRate}%</strong> — within the fair band. Good deal.</>}
            {aboveBand && <>Your lender quoted <strong className="font-mono">{offerRate}%</strong> — above the fair band of {rate.fairBandLow}%–{rate.fairBandHigh}%. Negotiate down or walk away.</>}
            {belowBand && <>Your lender quoted <strong className="font-mono">{offerRate}%</strong> — below the fair band. Read the fine print for hidden charges.</>}
          </p>
        </div>
      )}

      <p className="text-sm text-ink-light leading-relaxed border-l-2 border-gold pl-3">{rate.reason}</p>
    </div>
  );
}
