"use client";

import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

const SCRAMBLE_CHARS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
const SCRAMBLE_STEP_MS = 28;

interface DecodingTextProps {
  /** Phrases to cycle through, each one scrambling in via a cipher-reveal effect. */
  phrases: string[];
  intervalMs?: number;
  className?: string;
}

/** Cipher-style reveal: cycles through `phrases`, scrambling random characters into place left-to-right. */
export const DecodingText: React.FC<DecodingTextProps> = ({
  phrases,
  intervalMs = 2200,
  className,
}) => {
  const [phraseIndex, setPhraseIndex] = useState(0);
  const [display, setDisplay] = useState(phrases[0] ?? "");

  useEffect(() => {
    const target = phrases[phraseIndex % phrases.length] ?? "";
    let frame = 0;
    const totalFrames = target.length * 2;

    const scrambleTimer = setInterval(() => {
      frame++;
      const revealedCount = Math.floor((frame / totalFrames) * target.length);
      setDisplay(
        target
          .split("")
          .map((char, i) =>
            char === " " || i < revealedCount
              ? char
              : SCRAMBLE_CHARS[Math.floor(Math.random() * SCRAMBLE_CHARS.length)]
          )
          .join("")
      );
      if (frame >= totalFrames) clearInterval(scrambleTimer);
    }, SCRAMBLE_STEP_MS);

    const nextPhraseTimer = setTimeout(() => {
      setPhraseIndex((i) => (i + 1) % phrases.length);
    }, intervalMs);

    return () => {
      clearInterval(scrambleTimer);
      clearTimeout(nextPhraseTimer);
    };
  }, [phraseIndex, phrases, intervalMs]);

  return <p className={cn("font-mono tracking-wide", className)}>{display}</p>;
};
