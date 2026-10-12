import { useEffect } from "react";
import { useTranslations } from "next-intl";
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { IconButton } from "@/components/ui/icon-button";

const AUTO_DISMISS_MS = 6000;

interface ResumeNoticeProps {
  page: number;
  onStartOver: () => void;
  onDismiss: () => void;
}

// Tells the reader the document reopened where they left off, with a way back to the beginning.
export const ResumeNotice: React.FC<ResumeNoticeProps> = ({ page, onStartOver, onDismiss }) => {
  const t = useTranslations("reader.resume");
  const tActions = useTranslations("common.actions");

  useEffect(() => {
    const timeout = setTimeout(onDismiss, AUTO_DISMISS_MS);
    return () => clearTimeout(timeout);
  }, [onDismiss]);

  return (
    <div className="pointer-events-none absolute inset-x-0 bottom-6 z-20 flex justify-center px-4">
      <div
        role="status"
        className="pointer-events-auto flex items-center gap-1 rounded-full border border-border bg-card py-1 pl-4 pr-1 text-sm shadow-float animate-in fade-in slide-in-from-bottom-2 duration-200 ease-[var(--ease-out)]"
      >
        <span className="text-muted-foreground">{t("notice", { page })}</span>
        <Button variant="ghost" size="sm" onClick={onStartOver} className="text-foreground">
          {t("startOver")}
        </Button>
        <IconButton size="icon-sm" label={tActions("close")} onClick={onDismiss}>
          <X className="size-3.5" />
        </IconButton>
      </div>
    </div>
  );
};
