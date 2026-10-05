import { Languages, Wand2 } from "lucide-react";
import { useTranslations } from "next-intl";
import { LanguageCode } from "@/app/types";
import type { ApiErrorKey } from "@/lib/api-errors";
import { TranslationLoader } from "./TranslationLoader";
import { LanguageFlag } from "./LanguageFlag";

interface CardFrontProps {
  word: string;
  wordLanguage: LanguageCode;
  explanationLanguage: LanguageCode;
  sourceLanguage: LanguageCode;
  isLoading: boolean;
  errorKey?: ApiErrorKey | null;
  onConjure: () => void;
}

export const CardFront: React.FC<CardFrontProps> = ({
  word,
  wordLanguage,
  explanationLanguage,
  sourceLanguage,
  isLoading,
  errorKey,
  onConjure,
}) => {
  const isEquivalent = sourceLanguage !== wordLanguage;
  const t = useTranslations("vocabulary.cardFront");
  const tErrors = useTranslations("errors");

  return (
    <div className="relative w-[300px] max-w-[88vw] rounded-2xl p-[1px] bg-gradient-to-br from-violet-400/60 via-indigo-500/40 to-fuchsia-400/60 shadow-[0_20px_50px_-16px_rgba(109,40,217,0.55)]">
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-b from-[#1a1330] to-[#0e0a1c] px-6 py-7 text-center">
        {/* corner flourishes */}
        <span className="absolute left-3 top-3 text-xs text-violet-300/50">✦</span>
        <span className="absolute right-3 top-3 text-xs text-violet-300/50">✦</span>
        <span className="absolute bottom-3 left-3 text-xs text-violet-300/50">✦</span>
        <span className="absolute bottom-3 right-3 text-xs text-violet-300/50">✦</span>

        <div className="mx-auto mb-4 flex h-11 w-11 items-center justify-center rounded-full bg-violet-500/15 ring-1 ring-violet-400/40">
          <Languages className="h-5 w-5 text-violet-300" />
        </div>

        <div className="flex items-center justify-center gap-1.5 text-[11px] font-medium uppercase tracking-[0.25em] text-violet-300/70">
          <LanguageFlag code={isEquivalent ? sourceLanguage : wordLanguage} />
          <span>&rarr;</span>
          <LanguageFlag code={isEquivalent ? wordLanguage : explanationLanguage} />
        </div>

        <h2 className="mt-2 break-words font-serif text-3xl leading-tight text-white">
          {word}
        </h2>
        {isEquivalent && (
          <p className="mt-1.5 text-xs text-violet-200/60">
            {t("learnHowToSay", { language: wordLanguage })}
          </p>
        )}

        <div className="mt-6 min-h-[68px]">
          {isLoading ? (
            <TranslationLoader wordLanguage={wordLanguage} explanationLanguage={explanationLanguage} />
          ) : (
            <button
              onClick={onConjure}
              className="press-feedback inline-flex items-center gap-2 rounded-full bg-violet-500 px-4 py-2 text-sm font-semibold text-white shadow-lg shadow-violet-900/40 transition-colors duration-150 hover:bg-violet-400"
            >
              <Wand2 className="h-4 w-4" />
              {t("conjure")}
            </button>
          )}
        </div>

        {errorKey && (
          <p className="mt-3 text-xs text-red-300/90">{tErrors(errorKey)}</p>
        )}
      </div>
    </div>
  );
};
