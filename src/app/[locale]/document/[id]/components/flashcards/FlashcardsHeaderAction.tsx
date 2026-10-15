import { Layers } from "lucide-react";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { ROUTES } from "@/config/routes";
import { Button } from "@/components/ui/button";
import { useFlashcards } from "@/app/[locale]/document/[id]/components/flashcards/hooks/useFlashcards";

export const FlashcardsHeaderAction: React.FC<{ documentId: string }> = ({ documentId }) => {
  const t = useTranslations("flashcards");
  const { data: cards } = useFlashcards(documentId);
  const count = cards?.length ?? 0;

  return (
    <Button asChild variant="ghost" size="icon" className="relative">
      <Link href={ROUTES.documentFlashcards(documentId)} title={t("headerLink")} aria-label={t("headerLink")}>
        <Layers />
        {count > 0 && (
          <span className="absolute -right-0.5 -top-0.5 flex h-3.5 min-w-3.5 items-center justify-center rounded-full bg-primary px-0.5 text-[9px] font-semibold text-primary-foreground">
            {count > 9 ? "9+" : count}
          </span>
        )}
      </Link>
    </Button>
  );
};
