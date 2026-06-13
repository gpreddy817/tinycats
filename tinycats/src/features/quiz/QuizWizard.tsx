import { useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '@/app/hooks';
import {
  startQuiz,
  setAnswer,
  nextStep,
  prevStep,
  completeQuiz,
  selectCurrentStep,
  selectTotalSteps,
  selectQuizAnswers,
} from '@/features/quiz/quizSlice';
import { fetchRecommendations } from '@/features/recommendations/recommendationsSlice';
import { QuizStep, QUIZ_STEPS } from '@/features/quiz/QuizStep';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight, Sparkles } from 'lucide-react';
import type { QuizAnswers } from '@/types/quiz';
import { useEffect } from 'react';

export function QuizWizard() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const currentStep = useAppSelector(selectCurrentStep);
  const totalSteps = useAppSelector(selectTotalSteps);
  const answers = useAppSelector(selectQuizAnswers);

  useEffect(() => {
    dispatch(startQuiz());
  }, [dispatch]);

  const step = QUIZ_STEPS[currentStep];
  if (!step) return null;

  const currentValue = answers[step.id as keyof QuizAnswers];
  const isFinalStep = currentStep === totalSteps - 1;
  const progressPct = Math.round(((currentStep + 1) / totalSteps) * 100);

  // Validate: single/multi steps require a selection; text is optional
  const canProceed =
    step.type === 'text' || (currentValue !== undefined && (step.type !== 'multi' || (currentValue as string[]).length > 0));

  const handleChange = (value: QuizAnswers[keyof QuizAnswers]) => {
    dispatch(setAnswer({ key: step.id as keyof QuizAnswers, value }));
  };

  const handleNext = () => {
    if (!canProceed) return;
    if (isFinalStep) {
      handleSubmit();
    } else {
      dispatch(nextStep());
    }
  };

  const handleSubmit = () => {
    dispatch(completeQuiz());
    // Cast answers since we've validated all required fields by the final step
    void dispatch(fetchRecommendations(answers as QuizAnswers));
    navigate('/results');
  };

  return (
    <div className="w-full max-w-lg mx-auto px-4 py-8 animate-slide-up">
      {/* Progress Bar */}
      <div className="mb-8">
        <div className="flex justify-between items-center mb-2">
          <span
            className="text-sm font-medium"
            style={{ color: 'var(--color-text-secondary)' }}
          >
            Step {currentStep + 1} of {totalSteps}
          </span>
          <span
            className="text-sm font-semibold"
            style={{ color: 'var(--color-primary)' }}
          >
            {progressPct}%
          </span>
        </div>
        <div
          className="w-full rounded-full overflow-hidden"
          style={{ height: '6px', backgroundColor: 'var(--color-border)' }}
          role="progressbar"
          aria-valuenow={currentStep + 1}
          aria-valuemin={1}
          aria-valuemax={totalSteps}
          aria-label={`Quiz progress: step ${currentStep + 1} of ${totalSteps}`}
        >
          <div
            className="h-full rounded-full trait-bar-fill"
            style={{
              width: `${progressPct}%`,
              backgroundColor: 'var(--color-primary)',
            }}
          />
        </div>
      </div>

      {/* Question */}
      <div className="mb-6">
        <div className="flex items-center gap-3 mb-2">
          <span className="text-3xl" aria-hidden="true">{step.emoji}</span>
          <h2
            className="text-xl font-semibold leading-snug"
            style={{ fontFamily: 'var(--font-display)', color: 'var(--color-text-primary)' }}
            id={`quiz-question-${currentStep}`}
          >
            {step.question}
          </h2>
        </div>
      </div>

      {/* Step Content */}
      <QuizStep step={step} value={currentValue} onChange={handleChange} />

      {/* Navigation */}
      <div className="flex justify-between items-center mt-8 gap-4">
        <Button
          variant="ghost"
          size="default"
          onClick={() => dispatch(prevStep())}
          disabled={currentStep === 0}
          id="quiz-back-btn"
          aria-label="Previous question"
        >
          <ChevronLeft size={16} />
          Back
        </Button>

        <Button
          variant={isFinalStep ? 'default' : 'default'}
          size="lg"
          onClick={handleNext}
          disabled={!canProceed}
          id={isFinalStep ? 'quiz-submit-btn' : 'quiz-next-btn'}
          aria-label={isFinalStep ? 'Get my cat recommendations' : 'Next question'}
          className="min-w-[160px]"
        >
          {isFinalStep ? (
            <>
              <Sparkles size={16} />
              Get My Recommendations
            </>
          ) : (
            <>
              Next
              <ChevronRight size={16} />
            </>
          )}
        </Button>
      </div>
    </div>
  );
}

export default QuizWizard;
