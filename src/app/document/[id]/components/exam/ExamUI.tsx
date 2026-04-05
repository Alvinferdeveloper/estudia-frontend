import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Progress } from "@/components/ui/progress";
import { ChevronRight, Loader2 } from "lucide-react";
import { Question, Answer } from "@/app/document/[id]/hooks/useExam";

interface ExamUIProps {
  questions: Question[];
  answers: Answer[];
  currentIndex: number;
  currentAnswer: string;
  onAnswerChange: (answer: string) => void;
  onNext: () => void;
  isSubmitting: boolean;
  onFinish: () => void;
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
}) => {
  const currentQuestion = questions[currentIndex];
  const currentAnswerData = answers.find(a => a.questionId === currentQuestion?.id);
  const isLastQuestion = currentIndex === questions.length - 1;
  const hasAnswered = !!currentAnswerData;

  if (!currentQuestion) return null;

  const progress = ((currentIndex + 1) / questions.length) * 100;

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
            <h3 className="text-lg font-semibold mb-2">Question {currentIndex + 1}</h3>
            <p className="text-lg">{currentQuestion.text}</p>
          </div>

          {hasAnswered ? (
            <div className="space-y-4">
              <div className="p-4 bg-muted rounded-lg">
                <p className="text-sm text-muted-foreground mb-2">Your answer:</p>
                <p>{currentAnswerData.userAnswer}</p>
              </div>

              <div className="p-4 bg-accent/10 rounded-lg border border-accent">
                <div className="flex items-center gap-2 mb-2">
                  <span className="font-medium">Score:</span>
                  <span className="text-2xl font-bold text-accent">
                    {currentAnswerData.score}/10
                  </span>
                </div>
                <p className="text-sm">{currentAnswerData.feedback}</p>
              </div>

              {currentQuestion.idealAnswer && (
                <div className="p-4 bg-muted/50 rounded-lg">
                  <p className="text-sm text-muted-foreground mb-1">Ideal answer:</p>
                  <p className="text-sm">{currentQuestion.idealAnswer}</p>
                </div>
              )}
            </div>
          ) : (
            <div className="space-y-4">
              <Textarea
                placeholder="Write your answer here..."
                value={currentAnswer}
                onChange={(e) => onAnswerChange(e.target.value)}
                className="min-h-[150px]"
                disabled={isSubmitting}
              />
            </div>
          )}
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
              disabled={!currentAnswer.trim() || isSubmitting}
              size="lg"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Evaluating...
                </>
              ) : (
                'Submit Answer'
              )}
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};
