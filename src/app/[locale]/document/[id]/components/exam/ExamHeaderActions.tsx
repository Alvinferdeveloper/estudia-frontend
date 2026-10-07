import { ClipboardList, FlaskConical } from "lucide-react";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { ROUTES } from "@/config/routes";
import { useUserExams } from "@/app/[locale]/document/[id]/components/exam/hooks/useExam";
import { cn } from "@/lib/utils";

interface ExamHeaderActionsProps {
  documentId: string;
  examMode: boolean;
  onToggleExamMode: () => void;
}

const ICON_BUTTON =
  "press-feedback relative flex h-8 w-8 items-center justify-center rounded-full transition-colors duration-150";

export const ExamHeaderActions: React.FC<ExamHeaderActionsProps> = ({ documentId, examMode, onToggleExamMode }) => {
  const t = useTranslations("exam");
  const { data: exams } = useUserExams(documentId);
  const count = exams?.length ?? 0;

  return (
    <div className="flex items-center gap-1">
      <button
        onClick={onToggleExamMode}
        aria-pressed={examMode}
        title={t("modeButton")}
        aria-label={t("modeButton")}
        className={cn(
          ICON_BUTTON,
          examMode ? "bg-primary/10 text-primary" : "text-muted-foreground hover:bg-accent hover:text-foreground"
        )}
      >
        <FlaskConical className="h-4 w-4" />
      </button>
      <Link
        href={ROUTES.documentExams(documentId)}
        title={t("myExams")}
        aria-label={t("myExams")}
        className={cn(ICON_BUTTON, "text-muted-foreground hover:bg-accent hover:text-foreground")}
      >
        <ClipboardList className="h-4 w-4" />
        {count > 0 && (
          <span className="absolute -right-0.5 -top-0.5 flex h-3.5 min-w-3.5 items-center justify-center rounded-full bg-primary px-0.5 text-[9px] font-semibold text-primary-foreground">
            {count > 9 ? "9+" : count}
          </span>
        )}
      </Link>
    </div>
  );
};
