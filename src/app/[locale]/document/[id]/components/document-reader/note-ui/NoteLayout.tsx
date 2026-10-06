import { useTranslations } from "next-intl";
import { cn } from "@/lib/utils";
import { ApiErrorText } from "@/components/api-error-message";
import type { NoteSessionError } from "@/app/[locale]/document/[id]/hooks/useNoteSession";
import { ZocratisMark } from "@/components/brand/ZocratisMark";
import { useStickToBottom } from "@/app/[locale]/document/[id]/hooks/useStickToBottom";

interface NoteScrollAreaProps {
  // Keep the newest text in view while it streams in.
  follow?: boolean;
  children: React.ReactNode;
}

export const NoteScrollArea: React.FC<NoteScrollAreaProps> = ({ follow = false, children }) => {
  const { scrollRef, contentRef } = useStickToBottom({ enabled: follow });

  return (
    <div ref={scrollRef} className="min-h-0 flex-1 overflow-y-auto">
      <div ref={contentRef} className="px-6 py-5">
        {children}
      </div>
    </div>
  );
};

export const NoteFooter: React.FC<{ className?: string; children: React.ReactNode }> = ({ className, children }) => (
  <div className={cn("shrink-0 border-t border-border bg-card px-4 py-3", className)}>{children}</div>
);

export const NoteStatus: React.FC<{ label: string; className?: string }> = ({ label, className }) => (
  <div role="status" className={cn("flex items-center gap-2.5 text-sm text-muted-foreground", className)}>
    <ZocratisMark animated className="size-5 text-primary" />
    {label}
  </div>
);

export const NoteError: React.FC<{ error: NoteSessionError | null; className?: string }> = ({ error, className }) => {
  const t = useTranslations("notes.errors");
  if (!error) return null;

  return (
    <p role="alert" className={cn("text-sm text-destructive", className)}>
      <ApiErrorText errorKey={error.reason} fallback={t(error.key)} />
    </p>
  );
};
