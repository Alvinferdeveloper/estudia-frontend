"use client";

import { cn } from "@/lib/utils";
import { BRAND_NAME } from "@/lib/brand";
import { ZocratisMark } from "@/components/brand/ZocratisMark";
import { useRotatingIndex } from "../hooks/useRotatingIndex";

const QUOTES = [
  { text: "Solo sé que no sé nada.", source: "Sócrates" },
  { text: "Una vida sin examen no merece ser vivida.", source: "Sócrates, en la Apología de Platón" },
  { text: "El asombro es el comienzo de la sabiduría.", source: "Sócrates, en el Teeteto de Platón" },
];

const ROTATION_MS = 8000;

// Uses the primary pair, so it reads as ink with ivory text in light mode and inverts in dark mode.
export const AuthEditorialPanel: React.FC = () => {
  const index = useRotatingIndex(QUOTES.length, ROTATION_MS);
  const quote = QUOTES[index];

  return (
    <aside className="relative hidden overflow-hidden bg-primary p-12 text-primary-foreground lg:flex lg:flex-col lg:justify-between">
      <ZocratisMark className="pointer-events-none absolute -bottom-24 -right-20 size-[520px] opacity-[0.06]" />

      <div className="relative flex items-center gap-2.5">
        <ZocratisMark className="size-7" />
        <span className="text-lg font-semibold tracking-tight">{BRAND_NAME}</span>
      </div>

      {/* Remounted on each change so the enter animation replays; blur masks the crossfade. */}
      <figure
        key={index}
        className="relative max-w-[28ch] animate-in fade-in blur-in-6 slide-in-from-bottom-2 duration-700 ease-[var(--ease-out)]"
      >
        <blockquote className="font-serif text-[clamp(2.25rem,3.4vw,3.25rem)] italic leading-[1.1] tracking-tight text-balance">
          «{quote.text}»
        </blockquote>
        <figcaption className="mt-6 text-sm text-primary-foreground/70">{quote.source}</figcaption>
      </figure>

      <div className="relative flex items-center justify-between text-sm text-primary-foreground/60">
        <p>Aprende preguntando.</p>
        <div aria-hidden className="flex items-center gap-1.5">
          {QUOTES.map((item, dotIndex) => (
            <span
              key={item.text}
              className={cn(
                "h-1 w-6 origin-left rounded-full bg-current transition-[transform,opacity] duration-500 ease-[var(--ease-out)]",
                dotIndex === index ? "scale-x-100 opacity-100" : "scale-x-25 opacity-40"
              )}
            />
          ))}
        </div>
      </div>
    </aside>
  );
};
