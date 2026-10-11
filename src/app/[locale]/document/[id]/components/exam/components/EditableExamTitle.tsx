import { useRef, useState } from "react";
import { Pencil } from "lucide-react";
import { useTranslations } from "next-intl";
import { getApiErrorKey } from "@/lib/api-errors";
import { ApiErrorMessage } from "@/components/api-error-message";
import { EXAM_TITLE_MAX_LENGTH, useRenameExam } from "@/app/[locale]/document/[id]/components/exam/hooks/useExam";
import { cn } from "@/lib/utils";

interface EditableExamTitleProps {
  examId: string;
  title: string;
  as: "h1" | "h2";
  className?: string;
}

// An exam's title that renames in place: Enter or leaving the field saves, Escape cancels.
export const EditableExamTitle: React.FC<EditableExamTitleProps> = ({ examId, title, as: Heading, className }) => {
  const t = useTranslations("exam.rename");
  const rename = useRenameExam();
  const [draft, setDraft] = useState<string | null>(null);
  // Escape unmounts the field, which can fire a blur that must not save.
  const cancelledRef = useRef(false);

  const startEditing = () => {
    cancelledRef.current = false;
    setDraft(title);
  };

  const save = () => {
    if (draft === null || cancelledRef.current || rename.isPending) return;
    const next = draft.trim();
    if (!next || next === title) return setDraft(null);
    rename.mutate({ examId, title: next }, { onSuccess: () => setDraft(null) });
  };

  if (draft !== null) {
    return (
      <div>
        <input
          autoFocus
          value={draft}
          maxLength={EXAM_TITLE_MAX_LENGTH}
          disabled={rename.isPending}
          aria-label={t("label")}
          onChange={(event) => setDraft(event.target.value)}
          onFocus={(event) => event.currentTarget.select()}
          onBlur={save}
          onKeyDown={(event) => {
            // Saving happens once, on blur.
            if (event.key === "Enter") event.currentTarget.blur();
            if (event.key === "Escape") {
              cancelledRef.current = true;
              rename.reset();
              setDraft(null);
            }
          }}
          className={cn(
            "w-full rounded-md bg-card px-1.5 -mx-1.5 outline-none ring-1 ring-border focus-visible:ring-2 focus-visible:ring-ring/50 disabled:opacity-60",
            className
          )}
        />
        <ApiErrorMessage errorKey={rename.error ? getApiErrorKey(rename.error) : null} className="mt-1" />
      </div>
    );
  }

  return (
    <div className="group flex min-w-0 items-center gap-1.5">
      <Heading className={cn("min-w-0 truncate", className)}>{title}</Heading>
      <button
        onClick={startEditing}
        title={t("action")}
        aria-label={t("action")}
        className="press-feedback flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-muted-foreground opacity-60 transition-[opacity,color,background-color] duration-150 hover:bg-accent hover:text-foreground hover:opacity-100 focus-visible:opacity-100 group-hover:opacity-100"
      >
        <Pencil className="h-3.5 w-3.5" />
      </button>
    </div>
  );
};
