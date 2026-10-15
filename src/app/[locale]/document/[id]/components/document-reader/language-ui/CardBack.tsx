import { AlertTriangle, RotateCcw, Trash2, Loader2 } from "lucide-react";
import { useTranslations } from "next-intl";
import { LanguageCode, VocabularyExplanation } from "@/app/types";
import { cn } from "@/lib/utils";
import { IconButton } from "@/components/ui/icon-button";
import { NoteColorPicker } from "@/app/[locale]/document/[id]/components/document-reader/note-ui";
import { TranslationLoader } from "./TranslationLoader";
import { LanguageFlag } from "./LanguageFlag";

const sectionLabelClass = "text-[11px] font-medium uppercase tracking-[0.08em] text-muted-foreground";

interface CardBackProps {
  explanation: VocabularyExplanation;
  wordLanguage: LanguageCode;
  explanationLanguage: LanguageCode;
  isRegenerating: boolean;
  onRegenerate: () => void;
  isEditMode: boolean;
  onDelete?: () => void;
  isDeleting?: boolean;
  selectedColor: string;
  onColorChange: (color: string) => void;
  // Shown for saved words only.
  deckAction?: React.ReactNode;
}

export const CardBack: React.FC<CardBackProps> = ({
  explanation,
  wordLanguage,
  explanationLanguage,
  isRegenerating,
  onRegenerate,
  isEditMode,
  onDelete,
  isDeleting,
  selectedColor,
  onColorChange,
  deckAction,
}) => {
  const t = useTranslations("vocabulary.cardBack");

  return (
    <div className="flex max-h-[min(70vh,480px)] w-[340px] max-w-[92vw] flex-col overflow-hidden rounded-2xl border border-border bg-popover text-popover-foreground shadow-float">
      <div className="shrink-0 border-b border-border px-5 py-3.5 text-center">
        <div className="flex items-center justify-center gap-1.5 text-muted-foreground">
          <LanguageFlag code={wordLanguage} />
          <span>&rarr;</span>
          <LanguageFlag code={explanationLanguage} />
        </div>
        <h2 className="mt-1 break-words font-serif text-2xl italic">
          {explanation.word}
        </h2>
        {explanation.sourceText && (
          <p className="mt-0.5 text-xs text-muted-foreground">
            {t("fromSource", { text: explanation.sourceText })}
          </p>
        )}
        {explanation.phonetic && (
          <p className="mt-0.5 text-sm italic text-muted-foreground">/{explanation.phonetic}/</p>
        )}
      </div>

      {isRegenerating ? (
        <div className="flex flex-1 items-center justify-center py-10">
          <TranslationLoader wordLanguage={wordLanguage} explanationLanguage={explanationLanguage} />
        </div>
      ) : (
        <div className="flex-1 space-y-5 overflow-y-auto scrollbar-thin px-5 py-4">
          <section>
            <h3 className={sectionLabelClass}>{t("meanings")}</h3>
            <ol className="divide-y divide-border">
              {explanation.meanings.map((meaning, i) => (
                <li key={i} className="py-3 first:pt-2 last:pb-0">
                  {meaning.partOfSpeech && (
                    <span className="rounded-full bg-secondary px-2 py-0.5 text-[10px] font-medium uppercase tracking-wide text-secondary-foreground">
                      {meaning.partOfSpeech}
                    </span>
                  )}
                  <p className="mt-2 text-sm leading-relaxed">{meaning.definition}</p>
                  {meaning.exampleSentence && (
                    <p className="mt-2 text-sm italic text-muted-foreground">
                      &ldquo;{meaning.exampleSentence}&rdquo;
                    </p>
                  )}
                  {meaning.exampleTranslation && (
                    <p className="mt-1 text-xs text-muted-foreground">{meaning.exampleTranslation}</p>
                  )}
                </li>
              ))}
            </ol>
          </section>

          {explanation.confusables && explanation.confusables.length > 0 && (
            <section className="space-y-2">
              <h3 className={cn(sectionLabelClass, "flex items-center gap-1.5")}>
                <AlertTriangle className="size-3.5 text-ochre" />
                {t("confusables")}
              </h3>
              {explanation.confusables.map((c, i) => (
                <div key={i} className="rounded-xl bg-ochre/10 p-3">
                  <p className="text-sm font-semibold">{c.word}</p>
                  <p className="mt-1 text-xs leading-relaxed text-muted-foreground">{c.explanation}</p>
                </div>
              ))}
            </section>
          )}

          {explanation.tip && (
            <section className="rounded-xl bg-secondary p-3">
              <h3 className={sectionLabelClass}>{t("tip")}</h3>
              <p className="mt-1 text-xs leading-relaxed text-secondary-foreground">{explanation.tip}</p>
            </section>
          )}

          {explanation.synonyms && explanation.synonyms.length > 0 && (
            <ul className="flex flex-wrap gap-1.5">
              {explanation.synonyms.map((s, i) => (
                <li key={i} className="rounded-full border border-border px-2.5 py-1 text-xs text-muted-foreground">
                  {s}
                </li>
              ))}
            </ul>
          )}
        </div>
      )}

      <div className="flex shrink-0 items-center justify-between gap-2 border-t border-border px-4 py-3">
        <NoteColorPicker
          selectedColor={selectedColor}
          onColorChange={onColorChange}
          className="text-foreground"
        />
        <div className="flex items-center gap-1">
          {isEditMode && deckAction}
          {isEditMode && onDelete && (
            <IconButton
              label={t("delete")}
              onClick={onDelete}
              disabled={isDeleting}
              variant="ghost-destructive"
            >
              {isDeleting ? <Loader2 className="animate-spin" /> : <Trash2 />}
            </IconButton>
          )}
          <IconButton label={t("regenerate")} onClick={onRegenerate} disabled={isRegenerating}>
            <RotateCcw />
          </IconButton>
        </div>
      </div>
    </div>
  );
};
