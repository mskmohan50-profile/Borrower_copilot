import { useMemo } from 'react';
import type { BorrowerAnswers } from '@/types/borrower';
import { runAssessment } from '@/rules/engine';
import BorrowVerdict from '@/components/BorrowVerdict';
import LoanAmountCard from '@/components/LoanAmountCard';
import RateCard from '@/components/RateCard';
import EmiCard from '@/components/EmiCard';
import NegotiationCard from '@/components/NegotiationCard';
import ConfidenceBadge from '@/components/ConfidenceBadge';
import CoverHeader from '@/components/CoverHeader';
import { ArrowLeft, RotateCcw } from 'lucide-react';

interface ResultsProps {
  answers: BorrowerAnswers;
  onRestart: () => void;
  onBack: () => void;
}

const SECTIONS = [
  { n: '01', title: 'Should you borrow?' },
  { n: '02', title: 'How much can you borrow?' },
  { n: '03', title: "What's a fair rate?" },
  { n: '04', title: 'What EMI should you agree to?' },
];

export default function Results({ answers, onRestart, onBack }: ResultsProps) {
  const result = useMemo(() => runAssessment(answers), [answers]);

  const parsedOfferRate = answers.offersReceived
    ? parseFloat(answers.offersReceived.match(/([\d.]+)\s*%/)?.[1] ?? '')
    : null;
  const offerRate = parsedOfferRate !== null && !isNaN(parsedOfferRate) ? parsedOfferRate : null;

  return (
    <div className="min-h-screen bg-paper">
      <CoverHeader
        right={
          <>
            <button
              onClick={onBack}
              className="flex items-center gap-1 font-mono text-xs uppercase tracking-wide hover:text-gold transition-colors"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              Questions
            </button>
            <button
              onClick={onRestart}
              className="flex items-center gap-1 font-mono text-xs uppercase tracking-wide hover:text-gold transition-colors"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              Restart
            </button>
          </>
        }
      />

      <div className="max-w-3xl mx-auto px-4 py-8 sm:py-12">
        <div className="mb-8">
          <p className="font-mono text-xs uppercase tracking-widest text-spine mb-2">Assessment result</p>
          <h1 className="font-serif text-3xl font-semibold text-ink mb-3">Your four numbers</h1>
          <div className="flex flex-wrap items-center gap-3">
            <ConfidenceBadge confidence={result.confidence} />
            {result.confidence.label === 'low' && (
              <p className="text-sm text-ink-light">Answers are thin — ranges are wide. Go back and add more to tighten them.</p>
            )}
            {result.confidence.label === 'medium' && (
              <p className="text-sm text-ink-light">Good coverage. A few more answers would tighten the bands further.</p>
            )}
          </div>
        </div>

        <div className="mb-6">
          <div className="flex items-baseline gap-2 mb-3">
            <span className="font-mono text-sm text-spine">{SECTIONS[0].n}</span>
            <h2 className="font-mono text-xs uppercase tracking-widest text-ink-light">{SECTIONS[0].title}</h2>
          </div>
          <BorrowVerdict verdict={result.verdict} />
        </div>

        <div className="mb-6">
          <div className="flex items-baseline gap-2 mb-3">
            <span className="font-mono text-sm text-spine">{SECTIONS[1].n}</span>
            <h2 className="font-mono text-xs uppercase tracking-widest text-ink-light">{SECTIONS[1].title}</h2>
          </div>
          <LoanAmountCard eligibility={result.eligibility} />
        </div>

        <div className="mb-6">
          <div className="flex items-baseline gap-2 mb-3">
            <span className="font-mono text-sm text-spine">{SECTIONS[2].n}</span>
            <h2 className="font-mono text-xs uppercase tracking-widest text-ink-light">{SECTIONS[2].title}</h2>
          </div>
          <RateCard rate={result.rate} offerRate={offerRate} />
        </div>

        <div className="mb-6">
          <div className="flex items-baseline gap-2 mb-3">
            <span className="font-mono text-sm text-spine">{SECTIONS[3].n}</span>
            <h2 className="font-mono text-xs uppercase tracking-widest text-ink-light">{SECTIONS[3].title}</h2>
          </div>
          <EmiCard emi={result.emi} />
        </div>

        <div className="mb-6">
          <div className="flex items-baseline gap-2 mb-3">
            <span className="font-mono text-sm text-gold">★</span>
            <h2 className="font-mono text-xs uppercase tracking-widest text-spine">Negotiation card</h2>
          </div>
          <NegotiationCard data={result.negotiation} />
        </div>

        <div className="mt-10 mb-6 border border-rule px-4 py-4">
          <p className="text-xs text-ink-light leading-relaxed">
            This is a self-assessment tool, not financial advice. The numbers are estimates based on Indian
            lending rules of thumb (FOIR, income multipliers, product rate bands) and your self-reported
            answers. Always read the sanction letter carefully. See the full assumptions in RULES.md.
          </p>
        </div>
      </div>
    </div>
  );
}
