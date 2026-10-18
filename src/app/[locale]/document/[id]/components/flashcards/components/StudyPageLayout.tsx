import { ArrowLeft } from "lucide-react";
import { Link } from "@/i18n/navigation";
import { Button } from "@/components/ui/button";

interface StudyPageLayoutProps {
  back: { href: string; label: string };
  eyebrow: string;
  title: string;
  subtitle?: React.ReactNode;
  children: React.ReactNode;
}

// The frame shared by the study pages (cards, review): way back, then a serif title.
export const StudyPageLayout: React.FC<StudyPageLayoutProps> = ({ back, eyebrow, title, subtitle, children }) => (
  <div className="min-h-dvh bg-background text-foreground">
    <div className="mx-auto w-full max-w-2xl px-4 pb-16 pt-6">
      <Button asChild variant="ghost" size="sm" className="-ml-3">
        <Link href={back.href}>
          <ArrowLeft className="size-4" />
          {back.label}
        </Link>
      </Button>

      <header className="mt-10 border-b border-border pb-6">
        <p className="truncate text-xs font-medium uppercase tracking-[0.08em] text-muted-foreground">{eyebrow}</p>
        <h1 className="mt-2 font-serif text-4xl italic leading-tight">{title}</h1>
        {subtitle && <p className="mt-1 text-sm text-muted-foreground">{subtitle}</p>}
      </header>

      {children}
    </div>
  </div>
);
