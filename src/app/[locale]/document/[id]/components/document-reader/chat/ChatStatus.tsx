import { useTranslations } from "next-intl";
import { CircleAlert, RotateCcw } from "lucide-react";
import { ZocratisMark } from "@/components/brand/ZocratisMark";

export const PendingReply: React.FC = () => {
  const t = useTranslations("chat.status");

  return (
    <div role="status">
      <ZocratisMark animated className="size-6 text-primary" />
      <span className="sr-only">{t("thinking")}</span>
    </div>
  );
};

export const ChatError: React.FC<{ onRetry: () => void }> = ({ onRetry }) => {
  const t = useTranslations("chat.status");

  return (
    <div role="alert" className="flex gap-3">
      <div className="flex size-7 shrink-0 items-center justify-center rounded-lg bg-destructive/10 text-destructive">
        <CircleAlert className="size-3.5" />
      </div>
      <div className="flex flex-col items-start gap-1 pt-1 text-sm">
        <p className="font-medium text-foreground">{t("errorTitle")}</p>
        <p className="text-muted-foreground">{t("errorDescription")}</p>
        <button
          type="button"
          onClick={onRetry}
          className="press-feedback mt-2 inline-flex items-center gap-1.5 rounded-lg border border-sidebar-border px-2.5 py-1.5 text-xs font-medium text-foreground hover:bg-sidebar-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        >
          <RotateCcw className="size-3.5" />
          {t("retry")}
        </button>
      </div>
    </div>
  );
};

export const MessagesSkeleton: React.FC = () => (
  <div aria-hidden className="flex animate-pulse flex-col gap-6 motion-reduce:animate-none">
    <div className="ml-auto h-10 w-3/5 rounded-2xl rounded-br-md bg-muted" />
    <div className="flex flex-col gap-2">
      <div className="h-3 w-full rounded bg-muted" />
      <div className="h-3 w-11/12 rounded bg-muted" />
      <div className="h-3 w-2/3 rounded bg-muted" />
    </div>
  </div>
);
