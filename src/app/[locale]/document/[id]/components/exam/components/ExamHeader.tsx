import { X } from "lucide-react";
import { Link } from "@/i18n/navigation";
import { ROUTES } from "@/config/routes";

interface ExamHeaderProps {
  documentId: string;
  // Says what leaving means for this mode (progress kept, clock still running).
  leaveLabel: string;
  children: React.ReactNode;
}

// The attempt's top bar: a way out to the document, then the mode's own status.
export const ExamHeader: React.FC<ExamHeaderProps> = ({ documentId, leaveLabel, children }) => (
  <header className="sticky top-0 z-10 border-b border-border bg-background">
    <div className="mx-auto flex h-14 w-full max-w-2xl items-center gap-4 px-4">
      <Link
        href={ROUTES.document(documentId)}
        title={leaveLabel}
        aria-label={leaveLabel}
        className="press-feedback flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-muted-foreground transition-colors duration-150 hover:bg-accent hover:text-foreground"
      >
        <X className="h-4 w-4" />
      </Link>
      {children}
    </div>
  </header>
);
