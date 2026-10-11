import { useState } from "react";
import { useTranslations } from "next-intl";
import { CheckCheck, CircleDot, Loader2, MousePointerClick, PenLine, Shuffle, Underline, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { SegmentedControl } from "@/components/ui/segmented-control";
import { UpgradePlanLink } from "@/components/upgrade-plan-link";
import { ApiErrorMessage } from "@/components/api-error-message";
import { useUsage } from "@/app/[locale]/subscription/hooks/useSubscription";
import { UNLIMITED, examCreditCost } from "@/app/[locale]/subscription/lib/entitlements";
import { remainingCredits } from "@/app/[locale]/subscription/lib/usage";
import {
  ATTEMPT_MODES,
  DIFFICULTY_LEVELS,
  EXAM_SIZES,
  EXAM_TITLE_MAX_LENGTH,
  QUESTION_TYPES,
  type AttemptMode,
  type DifficultyLevel,
  type QuestionType,
} from "@/app/[locale]/document/[id]/components/exam/hooks/useExam";
import { formatPageRanges } from "@/app/[locale]/document/[id]/components/exam/lib/exam-title";
import { formatDuration, simulationTimeLimit } from "@/app/[locale]/document/[id]/components/exam/lib/exam-timing";
import { useExamSetup } from "@/app/[locale]/document/[id]/components/exam/hooks/useExamSetup";
import type { PdfDocument } from "@/app/[locale]/document/[id]/lib/pdf-document";
import { cn } from "@/lib/utils";

const DIFFICULTIES = [DIFFICULTY_LEVELS.EASY, DIFFICULTY_LEVELS.MEDIUM, DIFFICULTY_LEVELS.HARD];

const QUESTION_TYPE_OPTIONS: { id: QuestionType; icon: React.ElementType }[] = [
  { id: QUESTION_TYPES.OPEN, icon: PenLine },
  { id: QUESTION_TYPES.MULTIPLE_CHOICE, icon: CircleDot },
  { id: QUESTION_TYPES.TRUE_FALSE, icon: CheckCheck },
  { id: QUESTION_TYPES.FILL_BLANK, icon: Underline },
  { id: QUESTION_TYPES.MIXED, icon: Shuffle },
];

interface ExamSetupPanelProps {
  documentId: string;
  documentName: string;
  selectedPages: number[];
  pdfDoc: PdfDocument | null;
  onClose: () => void;
}

// Side panel of the reader's exam mode: pages are picked on the document itself, the rest here.
export const ExamSetupPanel: React.FC<ExamSetupPanelProps> = ({ documentId, documentName, selectedPages, pdfDoc, onClose }) => {
  const t = useTranslations("exam");
  const [mode, setMode] = useState<AttemptMode>(ATTEMPT_MODES.PRACTICE);
  const [title, setTitle] = useState("");
  const [difficulty, setDifficulty] = useState<DifficultyLevel>(DIFFICULTY_LEVELS.MEDIUM);
  const [questionType, setQuestionType] = useState<QuestionType>(QUESTION_TYPES.OPEN);
  const [questionCount, setQuestionCount] = useState<number>(EXAM_SIZES[0]);
  const { data: usage } = useUsage();
  const { generate, isGenerating, errorKey } = useExamSetup({ documentId, documentName, selectedPages, pdfDoc });

  // Until usage loads nothing is locked; the API enforces the plan's cap either way.
  const maxQuestions = usage?.caps.examQuestions ?? UNLIMITED;
  const isAllowedSize = (size: number) => maxQuestions === UNLIMITED || size <= maxQuestions;
  // Falls back to the smallest size if the cap is below every option; the API then explains the cap.
  const fitToPlan = (size: number) =>
    isAllowedSize(size) ? size : Math.max(EXAM_SIZES[0], ...EXAM_SIZES.filter(isAllowedSize));
  const selectedSize = fitToPlan(questionCount);
  const cost = examCreditCost(selectedSize);
  const creditsLeft = usage ? remainingCredits(usage.credits) : null;
  const hasPages = selectedPages.length > 0;
  const pageRanges = formatPageRanges(selectedPages);
  // Named after its pages unless the user names it, so untitled exams still tell apart.
  const defaultTitle = t("defaultTitle", { count: selectedPages.length, pages: pageRanges });

  const handleGenerate = () =>
    generate({
      mode,
      difficulty,
      questionType,
      questionCount: selectedSize,
      title: title.trim() || defaultTitle,
    });

  return (
    <aside aria-labelledby="exam-setup-title" className="flex h-full flex-col border-l border-border bg-card">
      <div className="flex items-center justify-between gap-2 px-5 pb-3 pt-4">
        <h2 id="exam-setup-title" className="text-base font-semibold">{t("setup.title")}</h2>
        <button
          onClick={onClose}
          title={t("setup.close")}
          aria-label={t("setup.close")}
          className="press-feedback flex h-8 w-8 items-center justify-center rounded-full text-muted-foreground transition-colors duration-150 hover:bg-accent hover:text-foreground"
        >
          <X className="h-4 w-4" />
        </button>
      </div>

      <fieldset disabled={isGenerating} className="flex-1 space-y-6 overflow-y-auto px-5 pb-6">
        <div aria-live="polite" className="rounded-xl bg-secondary px-4 py-3">
          {hasPages ? (
            <>
              <p className="text-sm font-medium tabular-nums">{t("pagesSelected", { count: selectedPages.length })}</p>
              <p className="mt-0.5 truncate font-mono text-xs tabular-nums text-muted-foreground">
                {pageRanges}
              </p>
            </>
          ) : (
            <p className="flex items-start gap-2 text-sm text-muted-foreground">
              <MousePointerClick className="mt-0.5 h-4 w-4 shrink-0" aria-hidden />
              {t("selectionHint")}
            </p>
          )}
        </div>

        <div className="space-y-2">
          <label htmlFor="exam-title" className="text-sm font-medium">{t("setup.titleLabel")}</label>
          <Input
            id="exam-title"
            value={title}
            maxLength={EXAM_TITLE_MAX_LENGTH}
            placeholder={hasPages ? defaultTitle : t("setup.titlePlaceholder")}
            onChange={(event) => setTitle(event.target.value)}
            className="rounded-[10px] bg-background"
          />
        </div>

        <div className="space-y-2">
          <p id="exam-mode-label" className="text-sm font-medium">{t("setup.modeLabel")}</p>
          <SegmentedControl
            aria-labelledby="exam-mode-label"
            value={mode}
            onChange={setMode}
            options={Object.values(ATTEMPT_MODES).map((value) => ({ value, label: t(`modes.${value}.title`) }))}
          />
          <p aria-live="polite" className="text-xs leading-relaxed text-muted-foreground">
            {t(`modes.${mode}.description`)}
            {mode === ATTEMPT_MODES.SIMULATION &&
              ` ${t("setup.timeLimit", { time: formatDuration(simulationTimeLimit(questionType, selectedSize)) })}`}
          </p>
        </div>

        <div className="space-y-2">
          <p id="exam-type-label" className="text-sm font-medium">{t("setup.questionTypeLabel")}</p>
          <div role="radiogroup" aria-labelledby="exam-type-label" className="grid grid-cols-2 gap-2">
            {QUESTION_TYPE_OPTIONS.map(({ id, icon: Icon }) => {
              const selected = questionType === id;
              return (
                <button
                  key={id}
                  role="radio"
                  aria-checked={selected}
                  onClick={() => setQuestionType(id)}
                  className={cn(
                    "press-feedback flex items-center gap-2 rounded-lg border px-3 py-2.5 text-left text-sm transition-colors duration-150",
                    selected
                      ? "border-primary/60 bg-primary/[0.06] font-medium text-foreground"
                      : "border-border text-muted-foreground hover:border-primary/30 hover:text-foreground"
                  )}
                >
                  <Icon className={cn("h-4 w-4 shrink-0", selected && "text-primary")} aria-hidden />
                  {t(`questionTypes.${id}`)}
                </button>
              );
            })}
          </div>
        </div>

        <div className="space-y-2">
          <p id="exam-size-label" className="text-sm font-medium">{t("setup.questionCountLabel")}</p>
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
          <p id="exam-difficulty-label" className="text-sm font-medium">{t("setup.difficultyLabel")}</p>
          <SegmentedControl
            aria-labelledby="exam-difficulty-label"
            value={difficulty}
            onChange={setDifficulty}
            options={DIFFICULTIES.map((level) => ({ value: level, label: t(`difficulty.${level}`) }))}
          />
        </div>
      </fieldset>

      <div className="space-y-3 border-t border-border px-5 py-4">
        <ApiErrorMessage errorKey={errorKey} />
        <p
          className={cn(
            "text-xs tabular-nums text-muted-foreground",
            creditsLeft !== null && cost > creditsLeft && "text-destructive"
          )}
        >
          {t("setup.cost", { cost })}
          {creditsLeft !== null && ` · ${t("setup.creditsLeft", { count: creditsLeft })}`}
        </p>
        <Button className="press-feedback h-9 w-full rounded-full" disabled={!hasPages || isGenerating} onClick={handleGenerate}>
          {isGenerating && <Loader2 className="h-4 w-4 animate-spin" />}
          {isGenerating ? t("generating") : t("startExam")}
        </Button>
      </div>
    </aside>
  );
};
