import { Loader2 } from "lucide-react";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface ExamFooterProps {
  // Keyboard shortcut of the primary action, shown on wide screens.
  shortcut?: string;
  children: React.ReactNode;
}

// The attempt's bottom bar: the step's actions on the right.
export const ExamFooter: React.FC<ExamFooterProps> = ({ shortcut, children }) => {
  const t = useTranslations("exam.session");

  return (
    <footer className="sticky bottom-0 border-t border-border bg-background">
      <div className="mx-auto flex min-h-16 w-full max-w-2xl flex-wrap items-center justify-end gap-x-3 gap-y-2 px-4 py-3">
        {shortcut && (
          <p className="mr-auto hidden items-center gap-1.5 text-xs text-muted-foreground md:flex">
            <kbd className="rounded border border-border bg-secondary px-1.5 py-0.5 font-sans text-[11px]">{shortcut}</kbd>
            {t("keyboardHint")}
          </p>
        )}
        {children}
      </div>
    </footer>
  );
};

interface ExamActionProps extends React.ComponentProps<typeof Button> {
  isBusy?: boolean;
}

export const ExamAction: React.FC<ExamActionProps> = ({ isBusy, disabled, className, children, ...props }) => (
  <Button className={cn("px-6", className)} disabled={disabled || isBusy} {...props}>
    {isBusy && <Loader2 className="h-4 w-4 animate-spin" />}
    {children}
  </Button>
);
