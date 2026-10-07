import { useTranslations } from "next-intl";
import type { Answer, Question } from "@/app/[locale]/document/[id]/components/exam/hooks/useExam";
import { VERDICT_KEY, answerTone } from "@/app/[locale]/document/[id]/components/exam/lib/exam-score";
import { answerText } from "@/app/[locale]/document/[id]/components/exam/lib/answer-text";
import { ToneMark } from "@/app/[locale]/document/[id]/components/exam/components/ToneMark";

interface AnswerFeedbackProps {
  question: Question;
  answer: Answer;
}

// The grade of an answered question: verdict, the model's feedback and, unless it was right, the reference answer.
export const AnswerFeedback: React.FC<AnswerFeedbackProps> = ({ question, answer }) => {
  const t = useTranslations("exam.session");
  const tone = answerTone(answer.score);

  return (
    <div className="overflow-hidden rounded-xl border border-border bg-card animate-in fade-in slide-in-from-bottom-1 duration-200">
      <div className="flex items-start gap-3 px-4 py-3.5">
        <ToneMark tone={tone} className="mt-px" />
        <div className="min-w-0 flex-1">
          <p className="flex items-baseline justify-between gap-3 text-sm font-semibold text-foreground">
            {t(VERDICT_KEY[tone])}
            <span className="font-mono text-xs font-semibold tabular-nums text-muted-foreground">
              {t("grade", { score: answer.score })}
            </span>
          </p>
          {/* Closed questions carry no feedback: the verdict and the right answer already say it all. */}
          {answer.feedback && (
            <p className="mt-1 text-sm leading-relaxed text-muted-foreground">{answer.feedback}</p>
          )}
        </div>
      </div>

      {tone !== "success" && answer.idealAnswer && (
        <div className="border-t border-border bg-secondary/60 px-4 py-3">
          <p className="mb-1 text-xs font-medium uppercase tracking-[0.08em] text-muted-foreground">
            {t("referenceAnswer")}
          </p>
          <p className="text-sm leading-relaxed text-foreground">
            {answerText(question, answer.idealAnswer, { true: t("true"), false: t("false") })}
          </p>
        </div>
      )}
    </div>
  );
};
