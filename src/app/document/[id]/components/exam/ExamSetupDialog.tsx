import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  QuestionType,
  QUESTION_TYPES,
  EXAM_MODES,
  DIFFICULTY_LEVELS
} from "@/app/document/[id]/components/exam/hooks/useExam";

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

const questionTypes: { id: QuestionType; label: string; icon: string }[] = [
  { id: QUESTION_TYPES.OPEN, label: 'Open Answer', icon: '📝' },
  { id: QUESTION_TYPES.MULTIPLE_CHOICE, label: 'Multiple Choice', icon: '🔘' },
  { id: QUESTION_TYPES.TRUE_FALSE, label: 'True/False', icon: '✓✗' },
  { id: QUESTION_TYPES.FILL_BLANK, label: 'Fill in Blank', icon: '___' },
  { id: QUESTION_TYPES.MIXED, label: 'Mixed', icon: '🎲' },
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
    <div className="fixed inset-0 flex items-center justify-center z-[100] bg-black/50">
      <div className="bg-card rounded-lg shadow-xl max-w-lg w-full mx-4">
        <div className="p-4 border-b border-border">
          <h2 className="text-lg font-semibold">Exam Setup</h2>
          <p className="text-sm text-muted-foreground">
            {selectedPages.length} pages selected
          </p>
        </div>

        <div className="p-4 space-y-4 max-h-[60vh] overflow-y-auto">
          <div className="space-y-2">
            <label className="text-sm font-medium">Exam Mode</label>
            <div className="grid gap-2">
              {modes.map((mode) => (
                <button
                  key={mode.id}
                  onClick={() => handleModeChange(mode.id)}
                  className={`
                    p-3 rounded-lg border text-left transition-all
                    ${selectedMode === mode.id
                      ? "border-accent bg-accent/10"
                      : "border-border hover:border-accent/50"
                    }
                  `}
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
              {questionTypes.map((type) => (
                <button
                  key={type.id}
                  onClick={() => setQuestionType(type.id)}
                  className={`
                    p-2 rounded-lg border text-center transition-all text-sm
                    ${questionType === type.id
                      ? "border-accent bg-accent/10"
                      : "border-border hover:border-accent/50"
                    }
                  `}
                >
                  <span className="block text-lg mb-1">{type.icon}</span>
                  {type.label}
                </button>
              ))}
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
                  onClick={() => setDifficulty(d)}
                >
                  {d.charAt(0).toUpperCase() + d.slice(1)}
                </Button>
              ))}
            </div>
          </div>
        </div>

        <div className="p-4 border-t border-border flex justify-end gap-2">
          <Button variant="ghost" onClick={onCancel}>
            Cancel
          </Button>
          <Button onClick={handleStart}>
            Start Exam
          </Button>
        </div>
      </div>
    </div>
  );
};
