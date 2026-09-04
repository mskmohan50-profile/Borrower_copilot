import type { ConfidenceMetrics } from '@/types/borrower';

const CONFIG: Record<ConfidenceMetrics['label'], { color: string; label: string }> = {
  high: { color: 'var(--seal-green)', label: 'High confidence' },
  medium: { color: 'var(--seal-amber)', label: 'Medium confidence' },
  low: { color: 'var(--seal-red)', label: 'Low confidence' },
};

export default function ConfidenceBadge({ confidence }: { confidence: ConfidenceMetrics }) {
  const c = CONFIG[confidence.label];

  return (
    <div
      className="inline-flex items-center gap-2 border px-3 py-1.5 font-mono text-xs"
      style={{ borderColor: c.color, color: c.color }}
    >
      <span className="w-1.5 h-1.5 rounded-full shrink-0" style={{ backgroundColor: c.color }} />
      <span className="font-semibold uppercase tracking-wide">{c.label}</span>
      <span className="text-ink-light tabular">· {confidence.score}/100</span>
      {confidence.label !== 'high' && confidence.missingCritical.length > 0 && (
        <span className="text-ink-light">
          · {confidence.missingCritical.length} key answer{confidence.missingCritical.length > 1 ? 's' : ''} missing
        </span>
      )}
    </div>
  );
}
