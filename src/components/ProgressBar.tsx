interface ProgressBarProps {
  current: number;
  total: number;
  label?: string;
}

export default function ProgressBar({ current, total, label }: ProgressBarProps) {
  const pct = total > 0 ? (current / total) * 100 : 0;
  const pad = (n: number) => String(n).padStart(2, '0');

  return (
    <div className="w-full">
      <div className="flex items-center justify-between mb-2">
        <span className="font-mono text-xs uppercase tracking-wide text-ink-light">
          {label ?? `Entry ${current} of ${total}`}
        </span>
        <span className="font-mono text-xs text-ink tabular">
          {pad(current)}/{pad(total)}
        </span>
      </div>
      <div className="h-[3px] w-full bg-rule/50">
        <div
          className="h-full bg-spine transition-all duration-500 ease-out"
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  );
}
