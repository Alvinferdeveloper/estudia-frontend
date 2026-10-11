import { BookOpenText, Languages } from "lucide-react";
import { useTranslations } from "next-intl";
import { LanguageCode } from "@/app/types";
import type { ApiErrorKey } from "@/lib/api-errors";
import { ApiErrorMessage } from "@/components/api-error-message";
import { TranslationLoader } from "./TranslationLoader";
import { LanguageFlag } from "./LanguageFlag";
import { Button } from "@/components/ui/button";

interface CardFrontProps {
  word: string;
  wordLanguage: LanguageCode;
  explanationLanguage: LanguageCode;
  sourceLanguage: LanguageCode;
  isLoading: boolean;
  errorKey?: ApiErrorKey | null;
  onReveal: () => void;
}

export const CardFront: React.FC<CardFrontProps> = ({
  word,
  wordLanguage,
  explanationLanguage,
  sourceLanguage,
  isLoading,
  errorKey,
  onReveal,
}) => {
  const isEquivalent = sourceLanguage !== wordLanguage;
  const t = useTranslations("vocabulary.cardFront");

  return (
    <div className="w-[300px] max-w-[88vw] rounded-2xl border border-border bg-popover px-6 py-7 text-center text-popover-foreground shadow-float">
      <div className="mx-auto mb-4 flex size-11 items-center justify-center rounded-full bg-secondary">
        <Languages className="size-5 text-muted-foreground" />
      </div>

      <div className="flex items-center justify-center gap-1.5 text-muted-foreground">
        <LanguageFlag code={isEquivalent ? sourceLanguage : wordLanguage} />
        <span>&rarr;</span>
        <LanguageFlag code={isEquivalent ? wordLanguage : explanationLanguage} />
      </div>

      <h2 className="mt-2 break-words font-serif text-3xl italic leading-tight">
        {word}
      </h2>
      {isEquivalent && (
        <p className="mt-1.5 text-xs text-muted-foreground">
          {t("learnHowToSay", { language: wordLanguage })}
        </p>
      )}

      <div className="mt-6 min-h-[68px]">
        {isLoading ? (
          <TranslationLoader wordLanguage={wordLanguage} explanationLanguage={explanationLanguage} />
        ) : (
          <Button onClick={onReveal}>
            <BookOpenText />
            {t("reveal")}
          </Button>
        )}
      </div>

      <ApiErrorMessage errorKey={errorKey} className="mt-3 text-xs" />
    </div>
  );
};
