import type { EMIOutput } from '@/types/borrower';
import { formatINR, formatMonths, formatEMI } from '@/utils/formatting';
import { AlertTriangle, Check, X } from 'lucide-react';

interface EmiCardProps {
  emi: EMIOutput;
}

export default function EmiCard({ emi }: EmiCardProps) {
  return (
    <div className="bg-paper border border-rule p-6 sm:p-7" style={{ boxShadow: '4px 4px 0 var(--rule)' }}>
      <h3 className="font-serif text-xl font-semibold text-ink mb-1">EMI &amp; outflow</h3>
      <p className="text-sm text-ink-light mb-5">Your monthly ceiling, and the tenure trade-off.</p>

      <div className="grid grid-cols-1 sm:grid-cols-2 border border-rule divide-y sm:divide-y-0 sm:divide-x divide-rule mb-5">
        <div className="p-4 bg-paper-dark/40">
          <p className="font-mono text-[10px] uppercase tracking-widest text-ink-light mb-2">Monthly EMI ceiling</p>
          <p className="font-mono text-3xl font-semibold tabular" style={{ color: 'var(--spine)' }}>
            {formatEMI(emi.monthlyCeiling)}
          </p>
          <p className="text-xs text-ink-light mt-1">Do not cross this — ever</p>
        </div>

        <div className="p-4">
          <p className="font-mono text-[10px] uppercase tracking-widest text-ink-light mb-2">Recommended EMI</p>
          <p className="font-mono text-3xl font-semibold text-ink tabular">{formatEMI(emi.recommendedEMI)}</p>
          <p className="text-xs text-ink-light mt-1">at {formatMonths(emi.recommendedTenure)} tenure</p>
        </div>
      </div>

      <div className="border border-rule mb-5 overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-paper-dark/50 text-ink-light font-mono text-[10px] uppercase tracking-widest">
              <th className="text-left px-4 py-2.5 font-semibold">Tenure</th>
              <th className="text-right px-4 py-2.5 font-semibold">Monthly EMI</th>
              <th className="text-right px-4 py-2.5 font-semibold">Total interest</th>
              <th className="text-center px-4 py-2.5 font-semibold">Affordable</th>
            </tr>
          </thead>
          <tbody>
            {emi.tenureOptions.map((opt) => {
              const isRecommended = opt.tenure === emi.recommendedTenure;
              return (
                <tr
                  key={opt.tenure}
                  className={`border-t border-rule ${isRecommended ? 'bg-paper-dark/50' : ''}`}
                >
                  <td className="px-4 py-2.5 font-medium text-ink">
                    {formatMonths(opt.tenure)}
                    {isRecommended && <span className="ml-2 font-mono text-[10px] text-spine">← recommended</span>}
                  </td>
                  <td className="px-4 py-2.5 text-right font-mono text-ink tabular">{formatINR(opt.emi)}/mo</td>
                  <td className="px-4 py-2.5 text-right font-mono text-ink-light tabular">{formatINR(opt.totalInterest, true)}</td>
                  <td className="px-4 py-2.5 text-center">
                    {opt.affordable ? (
                      <Check className="w-4 h-4 mx-auto" style={{ color: 'var(--seal-green)' }} />
                    ) : (
                      <X className="w-4 h-4 mx-auto" style={{ color: 'var(--seal-red)' }} />
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <div
        className="border-l-2 p-4"
        style={{
          borderColor: emi.stressCase.affordable ? 'var(--seal-green)' : 'var(--seal-red)',
          backgroundColor: 'var(--paper-dark)',
        }}
      >
        <div className="flex items-start gap-3">
          <AlertTriangle
            className="w-4 h-4 shrink-0 mt-0.5"
            style={{ color: emi.stressCase.affordable ? 'var(--seal-green)' : 'var(--seal-red)' }}
          />
          <div>
            <p className="text-sm font-semibold text-ink mb-1">Stress test — {emi.stressCase.scenario}</p>
            <p className="text-sm text-ink-light">{emi.stressCase.reason}</p>
          </div>
        </div>
      </div>

      <p className="mt-5 text-sm text-ink-light leading-relaxed border-l-2 border-gold pl-3">{emi.reason}</p>
    </div>
  );
}
