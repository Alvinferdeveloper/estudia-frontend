import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Progress } from "@/components/ui/progress";
import { ChevronRight, Loader2, Check, X } from "lucide-react";
import { Question, Answer, QuestionType } from "@/app/document/[id]/hooks/useExam";

interface ExamUIProps {
  questions: Question[];
  answers: Answer[];
  currentIndex: number;
  currentAnswer: string;
  onAnswerChange: (answer: string) => void;
  onNext: () => void;
  isSubmitting: boolean;
  onFinish: () => void;
  currentQuestionType: QuestionType;
}

export const ExamUI: React.FC<ExamUIProps> = ({
  questions,
  answers,
  currentIndex,
  currentAnswer,
  onAnswerChange,
  onNext,
  isSubmitting,
  onFinish,
  currentQuestionType: defaultQuestionType,
}) => {
  const currentQuestion = questions[currentIndex];
  const currentAnswerData = answers.find(a => a.questionId === currentQuestion?.id);
  const isLastQuestion = currentIndex === questions.length - 1;
  const hasAnswered = !!currentAnswerData;
  const currentQuestionType = currentQuestion?.type || defaultQuestionType;

  if (!currentQuestion) return null;

  const progress = ((currentIndex + 1) / questions.length) * 100;

  const renderAnswerInput = () => {
    if (hasAnswered) return null;

    switch (currentQuestionType) {
      case 'multiple_choice':
        return (
          <div className="space-y-2">
            {currentQuestion.options?.map((option, idx) => {
              const optionLetter = String.fromCharCode(65 + idx);
              const isSelected = currentAnswer === optionLetter;
              return (
                <button
                  key={idx}
                  onClick={() => onAnswerChange(optionLetter)}
                  disabled={isSubmitting}
                  className={`w-full p-3 rounded-lg border text-left transition-all ${
                    isSelected
                      ? 'border-accent bg-accent/10'
                      : 'border-border hover:border-accent/50'
                  }`}
                >
                  {option}
                </button>
              );
            })}
          </div>
        );

      case 'true_false':
        return (
          <div className="flex gap-4">
            <Button
              variant={currentAnswer === 'true' ? 'default' : 'outline'}
              size="lg"
              onClick={() => onAnswerChange('true')}
              disabled={isSubmitting}
              className="flex-1"
            >
              <Check className="mr-2 h-4 w-4" />
              True
            </Button>
            <Button
              variant={currentAnswer === 'false' ? 'default' : 'outline'}
              size="lg"
              onClick={() => onAnswerChange('false')}
              disabled={isSubmitting}
              className="flex-1"
            >
              <X className="mr-2 h-4 w-4" />
              False
            </Button>
          </div>
        );

      case 'fill_blank':
        return (
          <input
            type="text"
            value={currentAnswer}
            onChange={(e) => onAnswerChange(e.target.value)}
            placeholder="Type your answer..."
            className="w-full p-3 rounded-lg border border-border focus:border-accent focus:outline-none"
            disabled={isSubmitting}
          />
        );

      default:
        return (
          <Textarea
            placeholder="Write your answer here..."
            value={currentAnswer}
            onChange={(e) => onAnswerChange(e.target.value)}
            className="min-h-[150px]"
            disabled={isSubmitting}
          />
        );
    }
  };

  const renderAnswerFeedback = () => {
    if (!hasAnswered || !currentAnswerData) return null;

    const isCorrect = currentAnswerData.score === 10;
    const showCorrectAnswer = ['multiple_choice', 'true_false', 'fill_blank'].includes(currentQuestionType);

    return (
      <div className="space-y-4">
        <div className="p-4 bg-muted rounded-lg">
          <p className="text-sm text-muted-foreground mb-2">Your answer:</p>
          <p className="font-medium">
            {currentQuestionType === 'multiple_choice' && currentQuestion.options
              ? currentQuestion.options[currentAnswerData.userAnswer.charCodeAt(0) - 65]
              : currentQuestionType === 'true_false'
              ? currentAnswerData.userAnswer === 'true' ? 'True' : 'False'
              : currentAnswerData.userAnswer
            }
          </p>
        </div>

        <div className={`p-4 rounded-lg border ${
          isCorrect ? 'bg-green-50 border-green-500' : 'bg-red-50 border-red-500'
        }`}>
          <div className="flex items-center gap-2 mb-2">
            <span className="font-medium">Score:</span>
            <span className={`text-2xl font-bold ${isCorrect ? 'text-green-600' : 'text-red-600'}`}>
              {currentAnswerData.score}/10
            </span>
          </div>
          <p className="text-sm">{currentAnswerData.feedback}</p>
        </div>

        {showCorrectAnswer && (
          <div className="p-4 bg-muted/50 rounded-lg">
            <p className="text-sm text-muted-foreground mb-1">Correct answer:</p>
            <p className="font-medium">
              {currentQuestionType === 'multiple_choice' && currentQuestion.options && currentQuestion.idealAnswer
                ? currentQuestion.options[currentQuestion.idealAnswer.charCodeAt(0) - 65]
                : currentQuestionType === 'true_false'
                ? currentQuestion.idealAnswer === 'true' ? 'True' : 'False'
                : currentQuestion.idealAnswer
              }
            </p>
          </div>
        )}

        {currentQuestionType === 'open' && currentQuestion.idealAnswer && (
          <div className="p-4 bg-muted/50 rounded-lg">
            <p className="text-sm text-muted-foreground mb-1">Ideal answer:</p>
            <p className="text-sm">{currentQuestion.idealAnswer}</p>
          </div>
        )}
      </div>
    );
  };

  const getSubmitButtonText = () => {
    switch (currentQuestionType) {
      case 'multiple_choice':
        return 'Submit Answer';
      case 'true_false':
        return 'Submit';
      case 'fill_blank':
        return 'Submit';
      default:
        return 'Submit Answer';
    }
  };

  const canSubmit = () => {
    if (isSubmitting) return false;
    if (!currentAnswer.trim()) return false;
    return true;
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-background">
      <div className="max-w-2xl w-full mx-4 space-y-6">
        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm text-muted-foreground">
            <span>Question {currentIndex + 1} of {questions.length}</span>
            <span>{Math.round(progress)}%</span>
          </div>
          <Progress value={progress} className="h-2" />
        </div>

        <div className="bg-card rounded-lg shadow-lg p-6 space-y-6">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="text-xs font-medium px-2 py-1 bg-accent/20 text-accent rounded">
                {currentQuestionType.replace('_', ' ').toUpperCase()}
              </span>
            </div>
            <h3 className="text-lg font-semibold mb-2">Question {currentIndex + 1}</h3>
            <p className="text-lg">{currentQuestion.text}</p>
          </div>

          {hasAnswered ? renderAnswerFeedback() : renderAnswerInput()}
        </div>

        <div className="flex justify-end">
          {hasAnswered ? (
            isLastQuestion ? (
              <Button onClick={onFinish} size="lg">
                View Results
              </Button>
            ) : (
              <Button onClick={onNext} size="lg">
                Next Question
                <ChevronRight className="ml-2 h-4 w-4" />
              </Button>
            )
          ) : (
            <Button
              onClick={onNext}
              disabled={!canSubmit()}
              size="lg"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Evaluating...
                </>
              ) : (
                getSubmitButtonText()
              )}
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};
