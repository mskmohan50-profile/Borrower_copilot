import { useState, useMemo, useCallback } from 'react';
import type { BorrowerAnswers, AnswerValue } from '@/types/borrower';
import { getActiveQuestions, type Question } from '@/data/questions';
import ProgressBar from '@/components/ProgressBar';
import QuestionCard from '@/components/QuestionCard';
import CoverHeader from '@/components/CoverHeader';
import { ArrowLeft } from 'lucide-react';

interface AssessmentProps {
  onComplete: (answers: BorrowerAnswers) => void;
  onBack: () => void;
  /** Pre-filled answers (e.g. a sample borrower) the user can walk through and edit. */
  initialAnswers?: Partial<BorrowerAnswers> | undefined;
}

const EMPTY_ANSWERS: BorrowerAnswers = {
  purpose: '',
  amountWanted: null,
  loanType: 'personal',
  netMonthlyIncome: null,
  incomeType: 'salaried',
  existingEMIs: null,
  householdExpenses: null,
  age: null,
  creditScore: null,
  employmentStability: null,
  incomeHistoryYears: null,
  variableIncomeShare: null,
  cardUtilization: null,
  pastBounces: null,
  emergencySavingsMonths: null,
  collateralValue: null,
  coApplicantIncome: null,
  upcomingLargeExpense: null,
  productiveLoanReturn: null,
  offersReceived: null,
  residenceType: null,
  dependents: null,
};

export default function Assessment({ onComplete, onBack, initialAnswers }: AssessmentProps) {
  const [answers, setAnswers] = useState<Partial<BorrowerAnswers>>(initialAnswers ?? {});
  const [currentIndex, setCurrentIndex] = useState(0);

  const activeQuestions = useMemo(() => {
    return getActiveQuestions(answers);
  }, [answers]);

  const handleAnswer = useCallback(
    (value: AnswerValue) => {
      if (currentIndex >= activeQuestions.length) return;
      const question = activeQuestions[currentIndex];
      if (!question) return;
      const newAnswers = { ...answers, [question.field]: value };
      setAnswers(newAnswers);

      setTimeout(() => {
        const updatedQuestions = getActiveQuestions(newAnswers);
        const nextIdx = currentIndex + 1;
        if (nextIdx >= updatedQuestions.length) {
          onComplete({ ...EMPTY_ANSWERS, ...newAnswers } as BorrowerAnswers);
        } else {
          setCurrentIndex(nextIdx);
        }
      }, 150);
    },
    [currentIndex, activeQuestions, answers, onComplete]
  );

  const handleSkip = useCallback(() => {
    const question = activeQuestions[currentIndex];
    if (!question) return;
    const newAnswers = { ...answers, [question.field]: null };
    setAnswers(newAnswers);
    const updatedQuestions = getActiveQuestions(newAnswers);
    const nextIdx = currentIndex + 1;
    if (nextIdx >= updatedQuestions.length) {
      onComplete({ ...EMPTY_ANSWERS, ...newAnswers } as BorrowerAnswers);
    } else {
      setCurrentIndex(nextIdx);
    }
  }, [currentIndex, activeQuestions, answers, onComplete]);

  const handlePrev = useCallback(() => {
    if (currentIndex === 0) {
      onBack();
    } else {
      setCurrentIndex(currentIndex - 1);
    }
  }, [currentIndex, onBack]);

  if (activeQuestions.length === 0) {
    return null;
  }

  const question = (activeQuestions[currentIndex] ?? activeQuestions[0]) as Question;
  const currentValue = answers[question.field] as AnswerValue;

  return (
    <div className="min-h-screen bg-paper">
      <CoverHeader
        right={
          <button
            onClick={handlePrev}
            className="flex items-center gap-1 font-mono text-xs uppercase tracking-wide hover:text-gold transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            {currentIndex === 0 ? 'Home' : 'Back'}
          </button>
        }
      />

      <div className="max-w-2xl mx-auto px-4 py-8 sm:py-12">
        <div className="mb-6">
          <ProgressBar
            current={currentIndex + 1}
            total={activeQuestions.length}
            label={
              question.tier === 'must'
                ? `Required — entry ${currentIndex + 1} of ${activeQuestions.length}`
                : `Optional — entry ${currentIndex + 1} of ${activeQuestions.length}`
            }
          />
        </div>

        <QuestionCard
          key={`${question.field}-${currentIndex}`}
          question={question}
          value={currentValue}
          onAnswer={handleAnswer}
          onSkip={handleSkip}
          isLast={currentIndex === activeQuestions.length - 1}
          questionNumber={currentIndex + 1}
          totalQuestions={activeQuestions.length}
        />

        <p className="text-center font-mono text-[11px] text-ink-light mt-6">
          Your answers stay in your browser. Nothing is sent or stored.
        </p>
      </div>
    </div>
  );
}
