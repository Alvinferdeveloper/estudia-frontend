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
  DIFFICULTY_LEVELS,
  EXAM_SIZES,
  type DifficultyLevel,
  type ExamConfig,
  type ExamModeType,
} from "@/app/[locale]/document/[id]/components/exam/hooks/useExam";
import { cn } from "@/lib/utils";
import { SegmentedControl } from "@/components/ui/segmented-control";
import { UpgradePlanLink } from "@/components/upgrade-plan-link";
import { useUsage } from "@/app/[locale]/subscription/hooks/useSubscription";
import { UNLIMITED, examCreditCost } from "@/app/[locale]/subscription/lib/entitlements";
import { remainingCredits } from "@/app/[locale]/subscription/lib/usage";
import type { ApiErrorKey } from "@/lib/api-errors";
import { ApiErrorMessage } from "@/components/api-error-message";

interface ExamSetupDialogProps {
  selectedPages: number[];
  onStartExam: (config: ExamConfig) => void;
  onCancel: () => void;
  errorKey: ApiErrorKey | null;
}

// Presets: choosing a mode sets its question type and size (custom keeps what the user picked).
const modes: { id: ExamModeType; defaultType: QuestionType; defaultSize?: number }[] = [
  { id: EXAM_MODES.QUICK_REVIEW, defaultType: QUESTION_TYPES.OPEN, defaultSize: 5 },
  { id: EXAM_MODES.EXAM_SIMULATION, defaultType: QUESTION_TYPES.MULTIPLE_CHOICE, defaultSize: 10 },
  { id: EXAM_MODES.CUSTOM, defaultType: QUESTION_TYPES.OPEN },
];

const DIFFICULTIES = [DIFFICULTY_LEVELS.EASY, DIFFICULTY_LEVELS.MEDIUM, DIFFICULTY_LEVELS.HARD];

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
  errorKey,
}) => {
  const t = useTranslations("exam");
  const tCommon = useTranslations("common");
  const [selectedMode, setSelectedMode] = useState<string>(EXAM_MODES.QUICK_REVIEW);
  const [difficulty, setDifficulty] = useState<DifficultyLevel>(DIFFICULTY_LEVELS.MEDIUM);
  const [questionType, setQuestionType] = useState<QuestionType>(QUESTION_TYPES.OPEN);
  const [questionCount, setQuestionCount] = useState<number>(EXAM_SIZES[0]);
  const { data: usage } = useUsage();

  // Until usage loads nothing is locked; the API enforces the plan's cap either way.
  const maxQuestions = usage?.caps.examQuestions ?? UNLIMITED;
  const isAllowedSize = (size: number) => maxQuestions === UNLIMITED || size <= maxQuestions;
  // Falls back to the smallest size if the cap is below every option; the API then explains the cap.
  const fitToPlan = (size: number) =>
    isAllowedSize(size) ? size : Math.max(EXAM_SIZES[0], ...EXAM_SIZES.filter(isAllowedSize));
  const selectedSize = fitToPlan(questionCount);
  const cost = examCreditCost(selectedSize);
  const creditsLeft = usage ? remainingCredits(usage.credits) : null;

  const handleModeChange = (modeId: string) => {
    setSelectedMode(modeId);
    const mode = modes.find(m => m.id === modeId);
    if (mode && modeId !== EXAM_MODES.CUSTOM) {
      setQuestionType(mode.defaultType);
      if (mode.defaultSize) setQuestionCount(mode.defaultSize);
    }
  };

  const handleStart = () => {
    onStartExam({
      mode: selectedMode,
      difficulty,
      questionType,
      questionCount: selectedSize,
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
            <label id="exam-size-label" className="text-sm font-medium">{t("setup.questionCountLabel")}</label>
            <SegmentedControl
              aria-labelledby="exam-size-label"
              value={selectedSize}
              onChange={setQuestionCount}
              options={EXAM_SIZES.map((size) => ({ value: size, label: size, disabled: !isAllowedSize(size) }))}
            />
            {!EXAM_SIZES.every(isAllowedSize) && (
              <p className="text-xs text-muted-foreground">
                {t("setup.questionCountCap", { max: maxQuestions })} <UpgradePlanLink />
              </p>
            )}
          </div>

          <div className="space-y-2">
            <label id="exam-difficulty-label" className="text-sm font-medium">{t("setup.difficultyLabel")}</label>
            <SegmentedControl
              aria-labelledby="exam-difficulty-label"
              value={difficulty}
              onChange={setDifficulty}
              options={DIFFICULTIES.map((level) => ({ value: level, label: t(`difficulty.${level}`) }))}
            />
          </div>
        </div>

        <ApiErrorMessage errorKey={errorKey} className="px-4 pb-3" />

        <DialogFooter className="border-t border-border p-4">
          <p
            className={cn(
              "mr-auto self-center text-xs tabular-nums text-muted-foreground",
              creditsLeft !== null && cost > creditsLeft && "text-destructive"
            )}
          >
            {t("setup.cost", { cost })}
            {creditsLeft !== null && ` · ${t("setup.creditsLeft", { count: creditsLeft })}`}
          </p>
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
