import { useTranslations } from "next-intl";
import type { Question } from "@/app/[locale]/document/[id]/components/exam/hooks/useExam";

export const QuestionHeading = ({ question, number }: { question: Question; number: number }) => {
  const t = useTranslations("exam");
  return (
    <>
      <p className="mb-4 flex items-center gap-3 text-xs font-medium uppercase tracking-[0.08em] text-muted-foreground">
        <span className="font-mono tabular-nums text-foreground">{String(number).padStart(2, "0")}</span>
        {question.type && t(`questionTypes.${question.type}`)}
      </p>
      <h1 className="max-w-[65ch] text-balance text-xl font-semibold leading-snug tracking-tight sm:text-2xl">
        {question.text}
      </h1>
    </>
  );
};
