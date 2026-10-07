import { Loader2 } from "lucide-react";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";

interface ExamFooterProps {
  label: string;
  shortcut: string;
  isBusy: boolean;
  disabled: boolean;
  onAction: () => void;
}

// One primary action per step: grade, next question or results.
export const ExamFooter: React.FC<ExamFooterProps> = ({ label, shortcut, isBusy, disabled, onAction }) => {
  const t = useTranslations("exam.session");

  return (
    <footer className="sticky bottom-0 border-t border-border bg-background">
      <div className="mx-auto flex h-16 w-full max-w-2xl items-center justify-between gap-3 px-4">
        <p className="hidden items-center gap-1.5 text-xs text-muted-foreground md:flex">
          <kbd className="rounded border border-border bg-secondary px-1.5 py-0.5 font-sans text-[11px]">{shortcut}</kbd>
          {t("keyboardHint")}
        </p>
        <Button className="press-feedback ml-auto h-9 rounded-full px-6" disabled={disabled || isBusy} onClick={onAction}>
          {isBusy && <Loader2 className="h-4 w-4 animate-spin" />}
          {label}
        </Button>
      </div>
    </footer>
  );
};
