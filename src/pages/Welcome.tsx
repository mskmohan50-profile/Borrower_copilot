import { ArrowRight, Play, Pencil } from 'lucide-react';
import CoverHeader from '@/components/CoverHeader';
import { SAMPLE_BORROWERS, type SampleBorrower } from '@/data/sampleBorrowers';

interface WelcomeProps {
  onStart: () => void;
  onRunSample?: (sample: SampleBorrower) => void;
  onEditSample?: (sample: SampleBorrower) => void;
}

const OUTPUTS = [
  { n: '01', title: 'Should you borrow?', body: 'A clear verdict — borrow, borrow less, or don\u2019t. "Don\u2019t" is a real answer here.' },
  { n: '02', title: 'How much, really?', body: 'What the lender will sanction vs. what you can safely carry. They differ — use the right one.' },
  { n: '03', title: 'What\u2019s a fair rate?', body: 'A band, not a point, plus the all-in cost (APR) so you can compare quotes honestly.' },
  { n: '04', title: 'What EMI to agree to?', body: 'A monthly ceiling with the tenure trade-off, and one stress case worked through.' },
];

export default function Welcome({ onStart, onRunSample, onEditSample }: WelcomeProps) {
  return (
    <div className="min-h-screen bg-paper">
      <CoverHeader />

      <div className="max-w-3xl mx-auto px-4 py-12 sm:py-16">
        <div className="mb-12">
          <p className="font-mono text-xs uppercase tracking-widest text-spine mb-3">Before you sign anything</p>
          <h1 className="font-serif text-4xl sm:text-5xl font-semibold text-ink leading-tight mb-5">
            Know your numbers before you walk into a lender.
          </h1>
          <p className="text-lg text-ink-light leading-relaxed max-w-xl">
            Every lender has a model that decides what you get. You've had nothing — until now.
            Answer a few honest questions and leave with four numbers and a card you can negotiate with.
          </p>
          <p className="font-mono text-xs text-ink-light mt-4">
            No login. No bureau pull. Nothing stored — it stays in your browser.
          </p>
        </div>

        <div className="border border-rule divide-y divide-rule mb-10">
          {OUTPUTS.map((o) => (
            <div key={o.n} className="flex gap-4 p-5">
              <span className="font-mono text-sm text-spine shrink-0 pt-0.5">{o.n}</span>
              <div>
                <h3 className="font-serif text-lg font-semibold text-ink mb-1">{o.title}</h3>
                <p className="text-sm text-ink-light leading-relaxed">{o.body}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="border-2 border-spine p-5 mb-10 flex items-start gap-4">
          <span className="font-mono text-xs border border-spine text-spine px-2 py-1 shrink-0">PLUS</span>
          <div>
            <h3 className="font-serif text-lg font-semibold text-ink mb-1">A Negotiation Card</h3>
            <p className="text-sm text-ink-light leading-relaxed">
              One screen, built for the branch counter. Lender quotes 14% — card says fair is
              11–12.5%, and why.
            </p>
          </div>
        </div>

        <button
          onClick={onStart}
          className="w-full flex items-center justify-center gap-2 bg-ink text-paper text-base font-mono font-semibold uppercase tracking-wide py-4 hover:bg-spine transition-colors"
        >
          Start your assessment
          <ArrowRight className="w-4 h-4" />
        </button>
        <p className="text-center text-xs text-ink-light mt-4">
          Takes 3–5 minutes. Answer what you know, skip what you don't — the app tells you what that costs you.
        </p>

        <div className="mt-14">
          <p className="font-mono text-xs uppercase tracking-widest text-spine mb-3">Worked examples</p>
          <h2 className="font-serif text-2xl font-semibold text-ink mb-2">Three borrowers, already filled in</h2>
          <p className="text-sm text-ink-light leading-relaxed mb-5 max-w-xl">
            Open any of them to see the full assessment — verdict, lender vs. safe amount, fair rate band
            and EMI ceiling — or step through their answers question by question and change one.
          </p>

          <div className="border border-rule divide-y divide-rule">
            {SAMPLE_BORROWERS.map((s) => (
              <div key={s.id} className="p-5">
                <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1 mb-2">
                  <h3 className="font-serif text-lg font-semibold text-ink">
                    {s.name}, {s.age}
                  </h3>
                  <span className="font-mono text-[11px] uppercase tracking-widest text-ink-light">
                    {s.place} · {s.segment}
                  </span>
                </div>
                <p className="text-sm text-ink-light leading-relaxed mb-2">{s.blurb}</p>
                <p className="font-mono text-xs text-spine mb-4">Wants {s.ask}</p>
                <div className="flex flex-wrap gap-2">
                  <button
                    onClick={() => onRunSample?.(s)}
                    className="inline-flex items-center gap-2 border border-ink px-3 py-2 font-mono text-xs uppercase tracking-wide text-ink hover:bg-ink hover:text-paper transition-colors"
                  >
                    <Play className="w-3.5 h-3.5" />
                    See {s.name}'s numbers
                  </button>
                  <button
                    onClick={() => onEditSample?.(s)}
                    className="inline-flex items-center gap-2 border border-rule px-3 py-2 font-mono text-xs uppercase tracking-wide text-ink-light hover:border-ink hover:text-ink transition-colors"
                  >
                    <Pencil className="w-3.5 h-3.5" />
                    Step through the questions
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
