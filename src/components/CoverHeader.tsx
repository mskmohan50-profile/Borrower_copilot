import type { ReactNode } from 'react';

interface CoverHeaderProps {
  right?: ReactNode;
}

export default function CoverHeader({ right }: CoverHeaderProps) {
  return (
    <div className="bg-spine text-paper">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-3 flex items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <span className="w-7 h-7 border border-gold/70 flex items-center justify-center font-serif text-sm">
            B
          </span>
          <div className="leading-tight">
            <p className="font-serif text-sm tracking-wide">Borrower Copilot</p>
            <p className="font-mono text-[10px] text-paper/60 uppercase tracking-widest">Self-assessment</p>
          </div>
        </div>
        <div className="flex items-center gap-4 text-sm text-paper/90">
          {right}
        </div>
      </div>
      <div className="h-[2px] bg-gold/60" />
    </div>
  );
}
