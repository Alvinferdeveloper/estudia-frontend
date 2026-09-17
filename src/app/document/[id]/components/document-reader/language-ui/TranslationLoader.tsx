"use client";

import { useEffect, useState } from "react";
import { ArrowRight } from "lucide-react";
import { getLanguageOption, LanguageCode } from "@/app/types";
import { FlagReel } from "./FlagReel";
import { DecodingText } from "./DecodingText";

// Decorative flag pairs shown between the real one, just to keep the reel feeling alive during a longer wait.
const DECORATIVE_PAIRS: [string, string][] = [
  ["FR", "DE"],
  ["JP", "IT"],
];

const PHRASES = [
  "Analizando significado",
  "Buscando ejemplos",
  "Revisando falsos amigos",
  "Puliendo la explicación",
];

const PAIR_INTERVAL_MS = 1900;

interface TranslationLoaderProps {
  wordLanguage: LanguageCode;
  explanationLanguage: LanguageCode;
}

export const TranslationLoader: React.FC<TranslationLoaderProps> = ({
  wordLanguage,
  explanationLanguage,
}) => {
  const wordCode = getLanguageOption(wordLanguage)?.countryCode ?? "GB";
  const explanationCode = getLanguageOption(explanationLanguage)?.countryCode ?? "ES";
  const pairs: [string, string][] = [[wordCode, explanationCode], ...DECORATIVE_PAIRS];

  const [pairIndex, setPairIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setPairIndex((i) => (i + 1) % pairs.length);
    }, PAIR_INTERVAL_MS);
    return () => clearInterval(timer);
    // The real pair is fixed for the lifetime of this loader (a card is scoped to one word);
    // `pairs` intentionally isn't a dependency so the interval doesn't reset every render.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const [left, right] = pairs[pairIndex];

  return (
    <div className="flex flex-col items-center gap-3 py-1">
      <div className="flex items-center gap-2.5">
        <FlagReel countryCode={left} direction="up" />
        <ArrowRight className="h-3.5 w-3.5 text-violet-300/60" />
        <FlagReel countryCode={right} direction="down" />
      </div>
      <DecodingText
        phrases={PHRASES}
        className="text-[11px] text-violet-200/70"
      />
    </div>
  );
};
