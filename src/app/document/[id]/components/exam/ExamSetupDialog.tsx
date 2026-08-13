import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { PenLine, CircleDot, CheckCheck, Underline, Shuffle } from "lucide-react";
import {
  QuestionType,
  QUESTION_TYPES,
  EXAM_MODES,
  DIFFICULTY_LEVELS
} from "@/app/document/[id]/components/exam/hooks/useExam";
import { cn } from "@/lib/utils";

interface ExamSetupDialogProps {
  selectedPages: number[];
  onStartExam: (config: {
    mode: string;
    difficulty: string;
    questionType: QuestionType;
    title: string;
  }) => void;
  onCancel: () => void;
}

const modes = [
  {
    id: EXAM_MODES.QUICK_REVIEW,
    title: 'Quick Review',
    description: '5 questions to test your understanding',
    defaultType: QUESTION_TYPES.OPEN,
  },
  {
    id: EXAM_MODES.EXAM_SIMULATION,
    title: 'Exam Simulation',
    description: 'Realistic test conditions with time pressure',
    defaultType: QUESTION_TYPES.MULTIPLE_CHOICE,
  },
  {
    id: EXAM_MODES.CUSTOM,
    title: 'Custom',
    description: 'Configure your own exam settings',
    defaultType: QUESTION_TYPES.OPEN,
  },
];

const questionTypes: { id: QuestionType; label: string; icon: React.ElementType }[] = [
  { id: QUESTION_TYPES.OPEN, label: 'Open Answer', icon: PenLine },
  { id: QUESTION_TYPES.MULTIPLE_CHOICE, label: 'Multiple Choice', icon: CircleDot },
  { id: QUESTION_TYPES.TRUE_FALSE, label: 'True/False', icon: CheckCheck },
  { id: QUESTION_TYPES.FILL_BLANK, label: 'Fill in Blank', icon: Underline },
  { id: QUESTION_TYPES.MIXED, label: 'Mixed', icon: Shuffle },
];

export const ExamSetupDialog: React.FC<ExamSetupDialogProps> = ({
  selectedPages,
  onStartExam,
  onCancel,
}) => {
  const [selectedMode, setSelectedMode] = useState<string>(EXAM_MODES.QUICK_REVIEW);
  const [difficulty, setDifficulty] = useState<string>(DIFFICULTY_LEVELS.MEDIUM);
  const [questionType, setQuestionType] = useState<QuestionType>(QUESTION_TYPES.OPEN);

  const handleModeChange = (modeId: string) => {
    setSelectedMode(modeId);
    const mode = modes.find(m => m.id === modeId);
    if (mode && modeId !== EXAM_MODES.CUSTOM) {
      setQuestionType(mode.defaultType);
    }
  };

  const handleStart = () => {
    onStartExam({
      mode: selectedMode,
      difficulty,
      questionType,
      title: `Exam - ${selectedPages.length} pages`,
    });
  };

  return (
    <Dialog open onOpenChange={(open) => !open && onCancel()}>
      <DialogContent className="max-w-lg gap-0 p-0">
        <DialogHeader className="p-4 pb-3">
          <DialogTitle>Exam Setup</DialogTitle>
          <DialogDescription>
            {selectedPages.length} pages selected
          </DialogDescription>
        </DialogHeader>

        <div className="max-h-[60vh] space-y-4 overflow-y-auto p-4 pt-0">
          <div className="space-y-2">
            <label className="text-sm font-medium">Exam Mode</label>
            <div className="grid gap-2">
              {modes.map((mode) => (
                <button
                  key={mode.id}
                  onClick={() => handleModeChange(mode.id)}
                  className={cn(
                    "press-feedback rounded-lg border p-3 text-left transition-colors duration-150",
                    selectedMode === mode.id
                      ? "border-primary bg-primary/[0.06]"
                      : "border-border hover:border-primary/40"
                  )}
                >
                  <div className="font-medium">{mode.title}</div>
                  <div className="text-sm text-muted-foreground">{mode.description}</div>
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Question Type</label>
            <div className="grid grid-cols-2 gap-2">
              {questionTypes.map((type) => {
                const Icon = type.icon;
                return (
                  <button
                    key={type.id}
                    onClick={() => setQuestionType(type.id)}
                    className={cn(
                      "press-feedback flex flex-col items-center gap-1.5 rounded-lg border p-2.5 text-center text-sm transition-colors duration-150",
                      questionType === type.id
                        ? "border-primary bg-primary/[0.06]"
                        : "border-border hover:border-primary/40"
                    )}
                  >
                    <Icon className={cn("h-4 w-4", questionType === type.id ? "text-primary" : "text-muted-foreground")} />
                    {type.label}
                  </button>
                );
              })}
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Difficulty</label>
            <div className="flex gap-2">
              {[DIFFICULTY_LEVELS.EASY, DIFFICULTY_LEVELS.MEDIUM, DIFFICULTY_LEVELS.HARD].map((d) => (
                <Button
                  key={d}
                  variant={difficulty === d ? "default" : "outline"}
                  size="sm"
                  className="press-feedback"
                  onClick={() => setDifficulty(d)}
                >
                  {d.charAt(0).toUpperCase() + d.slice(1)}
                </Button>
              ))}
            </div>
          </div>
        </div>

        <DialogFooter className="border-t border-border p-4">
          <Button variant="ghost" className="press-feedback" onClick={onCancel}>
            Cancel
          </Button>
          <Button className="press-feedback" onClick={handleStart}>
            Start Exam
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
