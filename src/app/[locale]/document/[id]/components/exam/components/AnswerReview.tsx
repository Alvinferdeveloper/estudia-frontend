import { useId, useState } from "react";
import { ChevronDown } from "lucide-react";
import { useTranslations } from "next-intl";
import { type GradedAnswer, type Question } from "@/app/[locale]/document/[id]/components/exam/hooks/useExam";
import { answerTone } from "@/app/[locale]/document/[id]/components/exam/lib/exam-score";
import { answerText } from "@/app/[locale]/document/[id]/components/exam/lib/answer-text";
import { ToneMark } from "@/app/[locale]/document/[id]/components/exam/components/ToneMark";
import { AnswerFeedback } from "@/app/[locale]/document/[id]/components/exam/components/AnswerFeedback";
import { cn } from "@/lib/utils";

interface AnswerReviewProps {
  number: number;
  question: Question;
  // Null when the question was left unanswered.
  answer: GradedAnswer | null;
}

// One row of a finished attempt; expands to the given answer and its grade.
export const AnswerReview: React.FC<AnswerReviewProps> = ({ number, question, answer }) => {
  const t = useTranslations("exam");
  const [open, setOpen] = useState(false);
  const panelId = useId();

  return (
    <li>
      <button
        onClick={() => setOpen((value) => !value)}
        aria-expanded={open}
        aria-controls={panelId}
        className="press-feedback flex w-full items-center gap-3 rounded-lg px-2 py-3 text-left transition-colors duration-150 hover:bg-accent/60"
      >
        {answer ? (
          <ToneMark tone={answerTone(answer.score)} />
        ) : (
          <span aria-hidden className="h-5 w-5 shrink-0 rounded-full border border-dashed border-muted-foreground/50" />
        )}
        <span className="min-w-0 flex-1">
          <span className="block text-xs text-muted-foreground">{t("results.questionNumber", { number })}</span>
          <span className={cn("block text-sm text-foreground", !open && "truncate")}>{question.text}</span>
        </span>
        <span className="shrink-0 font-mono text-sm font-semibold tabular-nums text-foreground">
          {answer ? t("session.grade", { score: answer.score }) : t("results.unanswered")}
        </span>
        <ChevronDown
          aria-hidden
          className={cn("h-4 w-4 shrink-0 text-muted-foreground transition-transform duration-200", open && "rotate-180")}
        />
      </button>

      {open && (
        <div id={panelId} className="space-y-3 pb-4 pl-10 pr-2 animate-in fade-in duration-200">
          {answer ? (
            <>
              <div>
                <p className="mb-1 text-xs font-medium uppercase tracking-[0.08em] text-muted-foreground">
                  {t("results.yourAnswer")}
                </p>
                <p className="whitespace-pre-wrap text-sm leading-relaxed text-foreground">
                  {answerText(question, answer.userAnswer, { true: t("session.true"), false: t("session.false") })}
                </p>
              </div>
              <AnswerFeedback question={question} answer={answer} />
            </>
          ) : (
            <p className="text-sm text-muted-foreground">{t("results.unansweredHint")}</p>
          )}
        </div>
      )}
    </li>
  );
};
