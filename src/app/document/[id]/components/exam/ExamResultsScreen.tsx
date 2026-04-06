import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { CheckCircle, XCircle, RotateCcw, FileText } from "lucide-react";
import { ExamResults } from "@/app/document/[id]/components/exam/hooks/useExam";

interface ExamResultsScreenProps {
  results: ExamResults;
  onRetry: () => void;
  onClose: () => void;
}

export const ExamResultsScreen: React.FC<ExamResultsScreenProps> = ({
  results,
  onRetry,
  onClose,
}) => {
  const { exam, questions, answers, averageScore } = results;

  const getScoreColor = (score: number | null) => {
    if (score === null) return 'text-muted-foreground';
    if (score >= 7) return 'text-green-500';
    if (score >= 5) return 'text-yellow-500';
    return 'text-red-500';
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-background overflow-y-auto">
      <div className="max-w-2xl w-full mx-4 py-8 space-y-6">
        <Card>
          <CardHeader className="text-center">
            <CardTitle className="text-2xl">Exam Complete!</CardTitle>
            <CardDescription>{exam.title}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="text-center space-y-2">
              <p className="text-sm text-muted-foreground">Average Score</p>
              <p className={`text-6xl font-bold ${getScoreColor(averageScore)}`}>
                {averageScore.toFixed(1)}
                <span className="text-2xl text-muted-foreground">/10</span>
              </p>
            </div>

            <Progress value={averageScore * 10} className="h-3" />

            <div className="grid grid-cols-3 gap-4 text-center">
              <div className="p-3 bg-muted rounded-lg">
                <p className="text-2xl font-bold">{questions.length}</p>
                <p className="text-xs text-muted-foreground">Questions</p>
              </div>
              <div className="p-3 bg-muted rounded-lg">
                <p className="text-2xl font-bold">{exam.pages.length}</p>
                <p className="text-xs text-muted-foreground">Pages</p>
              </div>
              <div className="p-3 bg-muted rounded-lg">
                <p className="text-2xl font-bold">{exam.difficulty}</p>
                <p className="text-xs text-muted-foreground">Difficulty</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Question Breakdown</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {questions.map((question, index) => {
              const answer = answers.find(a => a.questionId === question.id);
              const score = answer?.score ?? null;

              return (
                <div
                  key={question.id}
                  className="flex items-center justify-between p-3 bg-muted/50 rounded-lg"
                >
                  <div className="flex items-center gap-3">
                    {score !== null && score >= 5 ? (
                      <CheckCircle className="h-5 w-5 text-green-500" />
                    ) : (
                      <XCircle className="h-5 w-5 text-red-500" />
                    )}
                    <div>
                      <p className="text-sm font-medium">Question {index + 1}</p>
                      <p className="text-xs text-muted-foreground line-clamp-1">
                        {question.text}
                      </p>
                    </div>
                  </div>
                  <span className={`font-bold ${getScoreColor(score)}`}>
                    {score !== null ? `${score}/10` : '-'}
                  </span>
                </div>
              );
            })}
          </CardContent>
        </Card>

        <div className="flex gap-2 justify-end">
          <Button variant="outline" onClick={onClose}>
            <FileText className="mr-2 h-4 w-4" />
            Close
          </Button>
          <Button onClick={onRetry}>
            <RotateCcw className="mr-2 h-4 w-4" />
            Retry Exam
          </Button>
        </div>
      </div>
    </div>
  );
};
