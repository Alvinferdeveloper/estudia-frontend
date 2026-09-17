import { AlertTriangle, RotateCcw, Trash2, Loader2 } from "lucide-react";
import { LanguageCode, VocabularyExplanation } from "@/app/types";
import { NoteColorPicker } from "@/app/document/[id]/components/document-reader/note-ui";
import { TranslationLoader } from "./TranslationLoader";
import { LanguageFlag } from "./LanguageFlag";

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
}) => {
  return (
    <div className="relative flex max-h-[min(70vh,480px)] w-[340px] max-w-[92vw] flex-col rounded-2xl p-[1px] bg-gradient-to-br from-violet-400/60 via-indigo-500/40 to-fuchsia-400/60 shadow-[0_20px_50px_-16px_rgba(109,40,217,0.55)]">
      <div className="flex max-h-[min(70vh,480px)] flex-col overflow-hidden rounded-2xl bg-gradient-to-b from-[#1a1330] to-[#0e0a1c]">
        {/* Header */}
        <div className="shrink-0 border-b border-violet-400/20 px-5 py-3.5 text-center">
          <div className="flex items-center justify-center gap-1.5 text-[10px] font-medium uppercase tracking-[0.25em] text-violet-300/60">
            <LanguageFlag code={wordLanguage} />
            <span>&rarr;</span>
            <LanguageFlag code={explanationLanguage} />
          </div>
          <h2 className="mt-1 break-words font-serif text-xl text-white">
            {explanation.word}
          </h2>
          {explanation.phonetic && (
            <p className="mt-0.5 text-sm italic text-violet-200/60">/{explanation.phonetic}/</p>
          )}
        </div>

        {/* Scrollable body */}
        {isRegenerating ? (
          <div className="flex flex-1 items-center justify-center py-10">
            <TranslationLoader wordLanguage={wordLanguage} explanationLanguage={explanationLanguage} />
          </div>
        ) : (
          <div className="flex-1 overflow-y-auto px-5 py-4 space-y-4">
            {/* Meanings */}
            <div className="space-y-3">
              <p className="text-[11px] font-semibold uppercase tracking-widest text-violet-300/70">
                Significados
              </p>
              {explanation.meanings.map((meaning, i) => (
                <div
                  key={i}
                  className="rounded-xl border border-violet-400/20 bg-violet-500/[0.06] p-3.5"
                >
                  <div className="flex items-baseline justify-between gap-2">
                    {meaning.partOfSpeech && (
                      <span className="rounded-full bg-violet-500/20 px-2 py-0.5 text-[10px] font-medium uppercase tracking-wide text-violet-200">
                        {meaning.partOfSpeech}
                      </span>
                    )}
                  </div>
                  <p className="mt-2 text-sm leading-relaxed text-violet-50">
                    {meaning.definition}
                  </p>
                  {meaning.exampleSentence && (
                    <p className="mt-2 border-l-2 border-fuchsia-400/40 pl-2.5 text-sm italic text-violet-200/80">
                      &ldquo;{meaning.exampleSentence}&rdquo;
                    </p>
                  )}
                  {meaning.exampleTranslation && (
                    <p className="mt-1 pl-2.5 text-xs text-violet-300/60">
                      {meaning.exampleTranslation}
                    </p>
                  )}
                </div>
              ))}
            </div>

            {/* Confusables */}
            {explanation.confusables && explanation.confusables.length > 0 && (
              <div className="space-y-2">
                <p className="flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-widest text-amber-300/80">
                  <AlertTriangle className="h-3.5 w-3.5" />
                  No confundir con
                </p>
                {explanation.confusables.map((c, i) => (
                  <div
                    key={i}
                    className="rounded-xl border border-amber-400/20 bg-amber-500/[0.06] p-3"
                  >
                    <p className="text-sm font-semibold text-amber-200">{c.word}</p>
                    <p className="mt-1 text-xs leading-relaxed text-amber-100/80">
                      {c.explanation}
                    </p>
                  </div>
                ))}
              </div>
            )}

            {/* Tip */}
            {explanation.tip && (
              <div className="rounded-xl border border-dashed border-violet-400/30 bg-black/20 p-3">
                <p className="text-[11px] font-semibold uppercase tracking-widest text-violet-300/60">
                  Dato útil
                </p>
                <p className="mt-1 text-xs leading-relaxed text-violet-100/80">
                  {explanation.tip}
                </p>
              </div>
            )}

            {/* Synonyms */}
            {explanation.synonyms && explanation.synonyms.length > 0 && (
              <div className="flex flex-wrap gap-1.5">
                {explanation.synonyms.map((s, i) => (
                  <span
                    key={i}
                    className="rounded-full bg-violet-500/15 px-2.5 py-1 text-xs text-violet-200"
                  >
                    {s}
                  </span>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Footer controls */}
        <div className="flex shrink-0 items-center justify-between gap-2 border-t border-violet-400/20 px-4 py-3">
          <NoteColorPicker
            selectedColor={selectedColor}
            onColorChange={onColorChange}
            size="sm"
          />
          <div className="flex items-center gap-1">
            {isEditMode && onDelete && (
              <button
                onClick={onDelete}
                disabled={isDeleting}
                title="Eliminar"
                className="press-feedback flex h-8 w-8 items-center justify-center rounded-full text-red-300/80 transition-colors hover:bg-red-500/15 hover:text-red-200 disabled:opacity-50"
              >
                {isDeleting ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Trash2 className="h-4 w-4" />
                )}
              </button>
            )}
            <button
              onClick={onRegenerate}
              disabled={isRegenerating}
              title="Volver a conjurar"
              className="press-feedback flex h-8 w-8 items-center justify-center rounded-full text-violet-300/80 transition-colors hover:bg-violet-500/15 hover:text-violet-200 disabled:opacity-50"
            >
              <RotateCcw className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
