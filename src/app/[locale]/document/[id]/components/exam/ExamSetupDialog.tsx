import { useState } from "react";
import { useTranslations } from "next-intl";
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
} from "@/app/[locale]/document/[id]/components/exam/hooks/useExam";
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
  { id: EXAM_MODES.QUICK_REVIEW, defaultType: QUESTION_TYPES.OPEN },
  { id: EXAM_MODES.EXAM_SIMULATION, defaultType: QUESTION_TYPES.MULTIPLE_CHOICE },
  { id: EXAM_MODES.CUSTOM, defaultType: QUESTION_TYPES.OPEN },
];

const questionTypes: { id: QuestionType; icon: React.ElementType }[] = [
  { id: QUESTION_TYPES.OPEN, icon: PenLine },
  { id: QUESTION_TYPES.MULTIPLE_CHOICE, icon: CircleDot },
  { id: QUESTION_TYPES.TRUE_FALSE, icon: CheckCheck },
  { id: QUESTION_TYPES.FILL_BLANK, icon: Underline },
  { id: QUESTION_TYPES.MIXED, icon: Shuffle },
];

export const ExamSetupDialog: React.FC<ExamSetupDialogProps> = ({
  selectedPages,
  onStartExam,
  onCancel,
}) => {
  const t = useTranslations("exam");
  const tCommon = useTranslations("common");
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
      title: t("defaultTitle", { count: selectedPages.length }),
    });
  };

  return (
    <Dialog open onOpenChange={(open) => !open && onCancel()}>
      <DialogContent className="max-w-lg gap-0 p-0">
        <DialogHeader className="p-4 pb-3">
          <DialogTitle>{t("setup.title")}</DialogTitle>
          <DialogDescription>
            {t("pagesSelected", { count: selectedPages.length })}
          </DialogDescription>
        </DialogHeader>

        <div className="max-h-[60vh] space-y-4 overflow-y-auto p-4 pt-0">
          <div className="space-y-2">
            <label className="text-sm font-medium">{t("setup.modeLabel")}</label>
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
                  <div className="font-medium">{t(`setup.modes.${mode.id}.title`)}</div>
                  <div className="text-sm text-muted-foreground">{t(`setup.modes.${mode.id}.description`)}</div>
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">{t("setup.questionTypeLabel")}</label>
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
                    {t(`questionTypes.${type.id}`)}
                  </button>
                );
              })}
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">{t("setup.difficultyLabel")}</label>
            <div className="flex gap-2">
              {[DIFFICULTY_LEVELS.EASY, DIFFICULTY_LEVELS.MEDIUM, DIFFICULTY_LEVELS.HARD].map((d) => (
                <Button
                  key={d}
                  variant={difficulty === d ? "default" : "outline"}
                  size="sm"
                  className="press-feedback"
                  onClick={() => setDifficulty(d)}
                >
                  {t(`difficulty.${d}`)}
                </Button>
              ))}
            </div>
          </div>
        </div>

        <DialogFooter className="border-t border-border p-4">
          <Button variant="ghost" className="press-feedback" onClick={onCancel}>
            {tCommon("actions.cancel")}
          </Button>
          <Button className="press-feedback" onClick={handleStart}>
            {t("startExam")}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
