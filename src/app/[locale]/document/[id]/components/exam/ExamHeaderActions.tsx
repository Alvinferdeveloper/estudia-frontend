import { ClipboardList, FlaskConical } from "lucide-react";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { ROUTES } from "@/config/routes";
import { useUserExams } from "@/app/[locale]/document/[id]/components/exam/hooks/useExam";
import { Button } from "@/components/ui/button";
import { IconButton } from "@/components/ui/icon-button";

interface ExamHeaderActionsProps {
  documentId: string;
  examMode: boolean;
  onToggleExamMode: () => void;
}

export const ExamHeaderActions: React.FC<ExamHeaderActionsProps> = ({ documentId, examMode, onToggleExamMode }) => {
  const t = useTranslations("exam");
  const { data: exams } = useUserExams(documentId);
  const count = exams?.length ?? 0;

  return (
    <div className="flex items-center gap-1">
      <IconButton label={t("modeButton")} onClick={onToggleExamMode} aria-pressed={examMode}>
        <FlaskConical />
      </IconButton>
      <Button asChild variant="ghost" size="icon" className="relative">
        <Link href={ROUTES.documentExams(documentId)} title={t("myExams")} aria-label={t("myExams")}>
          <ClipboardList />
          {count > 0 && (
            <span className="absolute -right-0.5 -top-0.5 flex h-3.5 min-w-3.5 items-center justify-center rounded-full bg-primary px-0.5 text-[9px] font-semibold text-primary-foreground">
              {count > 9 ? "9+" : count}
            </span>
          )}
        </Link>
      </Button>
    </div>
  );
};
