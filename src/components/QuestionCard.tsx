import { useState, useRef, useEffect } from 'react';
import type { Question } from '@/data/questions';
import type { AnswerValue } from '@/types/borrower';
import { HelpCircle, Check, ArrowRight } from 'lucide-react';

interface QuestionCardProps {
  question: Question;
  value: AnswerValue;
  onAnswer: (value: AnswerValue) => void;
  onSkip: () => void;
  isLast: boolean;
  questionNumber: number;
  totalQuestions: number;
}

export default function QuestionCard({
  question,
  value,
  onAnswer,
  onSkip,
  isLast,
}: QuestionCardProps) {
  const [localValue, setLocalValue] = useState<string | number>(value ?? '');
  const [showHelp, setShowHelp] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setLocalValue(value ?? '');
    setShowHelp(false);
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, [question, value]);

  const handleSubmit = () => {
    if (localValue !== '' && localValue !== null) {
      let parsed = localValue;
      if (question.type === 'number') {
        parsed = Number(localValue);
        if (isNaN(parsed)) return;
      }
      onAnswer(parsed);
    }
  };

  const handleChoice = (val: string) => {
    setLocalValue(val);
    let parsed: string | number = val;
    if (question.field === 'creditScore' || question.field === 'age') {
      parsed = Number(val);
    }
    onAnswer(parsed);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleSubmit();
    }
  };

  const letters = 'abcdefgh';

  return (
    <div
      key={question.field}
      className="bg-paper border border-rule p-6 sm:p-8 animate-fadeUp"
      style={{ boxShadow: '4px 4px 0 var(--rule)' }}
    >
      <div className="flex items-start justify-between gap-4 mb-4">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-2">
            <span className="font-mono text-[11px] font-semibold uppercase tracking-widest text-spine">
              {question.tier === 'must' ? 'Required' : 'Optional'}
            </span>
            {question.tier === 'additional' && (
              <span className="font-mono text-[11px] text-ink-light">— tightens: {question.tightens}</span>
            )}
          </div>
          <h3 className="font-serif text-xl sm:text-2xl font-semibold text-ink leading-snug">
            {question.question}
          </h3>
        </div>
        {question.helpText && (
          <button
            onClick={() => setShowHelp(!showHelp)}
            className="shrink-0 mt-1 text-ink-light hover:text-spine transition-colors"
            aria-label="Show help"
          >
            <HelpCircle className="w-5 h-5" />
          </button>
        )}
      </div>

      {showHelp && question.helpText && (
        <p className="text-sm text-ink-light bg-paper-dark/50 border-l-2 border-gold px-4 py-3 mb-4">
          {question.helpText}
        </p>
      )}

      <div className="mt-2">
        {question.type === 'choice' && question.options && (
          <div className="border border-rule divide-y divide-rule">
            {question.options.map((opt, i) => {
              const isSelected = String(localValue) === opt.value;
              return (
                <button
                  key={opt.value}
                  onClick={() => handleChoice(opt.value)}
                  className={`w-full flex items-center gap-3 text-left px-4 py-3.5 transition-colors ${
                    isSelected ? 'bg-ink text-paper' : 'hover:bg-paper-dark/50 text-ink'
                  }`}
                >
                  <span
                    className={`font-mono text-xs w-5 h-5 flex items-center justify-center border shrink-0 ${
                      isSelected ? 'border-paper' : 'border-rule text-ink-light'
                    }`}
                  >
                    {letters[i] ?? i}
                  </span>
                  <span className={isSelected ? 'font-medium' : ''}>{opt.label}</span>
                  {isSelected && <Check className="w-4 h-4 ml-auto shrink-0" />}
                </button>
              );
            })}
          </div>
        )}

        {(question.type === 'number' || question.type === 'text') && (
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              {question.unit && (
                <span className="absolute right-4 top-1/2 -translate-y-1/2 font-mono text-sm text-ink-light">
                  {question.unit}
                </span>
              )}
              <input
                ref={inputRef}
                type={question.type === 'number' ? 'number' : 'text'}
                value={localValue}
                onChange={(e) => setLocalValue(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder={question.placeholder}
                min={question.min}
                max={question.max}
                className="w-full px-4 py-3.5 bg-paper border border-rule focus:border-spine focus:outline-none text-ink text-base font-mono tabular transition-colors pr-16"
              />
            </div>
            <button
              onClick={handleSubmit}
              className="flex items-center justify-center gap-2 px-6 py-3.5 bg-ink text-paper font-mono text-sm font-semibold uppercase tracking-wide hover:bg-spine transition-colors shrink-0"
            >
              {isLast ? 'See results' : 'Next'}
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>

      {question.tier === 'additional' && (
        <button
          onClick={onSkip}
          className="mt-4 font-mono text-xs uppercase tracking-wide text-ink-light hover:text-ink transition-colors"
        >
          Skip this entry →
        </button>
      )}
    </div>
  );
}
