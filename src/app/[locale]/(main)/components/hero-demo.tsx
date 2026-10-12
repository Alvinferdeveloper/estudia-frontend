"use client";

import { useEffect, useState } from "react";
import { useReducedMotion } from "motion/react";
import { useTranslations } from "next-intl";
import { Clock, Folder, MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ZocratisMark } from "@/components/brand/ZocratisMark";
import { siteConfig } from "@/config/site";
import { cn } from "@/lib/utils";

const PROMPTS = ["formula", "summary", "image"] as const;
type PromptId = (typeof PROMPTS)[number];

const TYPING_DELAY_MS = 450;
const TYPING_STEP_MS = 16;

// Reveals the answer character by character, as the real chat streams it.
function useTyped(text: string, run: boolean) {
  const reduce = useReducedMotion();
  const [out, setOut] = useState("");
  const [typing, setTyping] = useState(false);

  useEffect(() => {
    if (!run) {
      setOut("");
      setTyping(false);
      return;
    }
    if (reduce) {
      setOut(text);
      setTyping(false);
      return;
    }
    setOut("");
    setTyping(true);
    let i = 0;
    let interval: ReturnType<typeof setInterval> | undefined;
    const timeout = setTimeout(() => {
      interval = setInterval(() => {
        i += 1;
        setOut(text.slice(0, i));
        if (i >= text.length) {
          if (interval) clearInterval(interval);
          setTyping(false);
        }
      }, TYPING_STEP_MS);
    }, TYPING_DELAY_MS);
    return () => {
      clearTimeout(timeout);
      if (interval) clearInterval(interval);
    };
  }, [text, run, reduce]);

  return { out, typing };
}

// A miniature of the reader: pick a prompt and watch the note being written.
export function HeroDemo() {
  const t = useTranslations("landing.demo");
  const [activeId, setActiveId] = useState<PromptId | null>(null);
  const { out, typing } = useTyped(activeId ? t(`prompts.${activeId}.response`) : "", activeId !== null);

  return (
    <div className="relative mx-auto max-w-4xl">
      <div className="relative aspect-[16/10] overflow-hidden rounded-2xl border border-border bg-background shadow-float">
        <div className="absolute inset-4 flex flex-col overflow-hidden rounded-xl border border-border bg-card md:inset-6">
          <div className="flex shrink-0 items-center gap-2 border-b border-border px-3.5 py-2.5">
            <span className="size-2.5 rounded-full bg-border" />
            <span className="size-2.5 rounded-full bg-border" />
            <span className="size-2.5 rounded-full bg-border" />
            <span className="mx-auto text-[11px] text-muted-foreground">{t("fileName")}</span>
          </div>

          <div className="flex min-h-0 flex-1">
            <aside className="hidden w-40 shrink-0 flex-col border-r border-border bg-sidebar p-3 sm:flex">
              <div className="mb-4 flex items-center gap-1.5">
                <ZocratisMark className="size-4 text-primary" />
                <span className="text-[11px] font-semibold">{siteConfig.name}</span>
              </div>
              <div className="mb-3 flex items-center gap-1.5 rounded-md bg-primary/10 px-2 py-1.5 text-[11px] font-medium text-primary">
                <Clock className="size-3" />
                {t("recent")}
              </div>
              <p className="mb-1.5 px-2 text-[9px] font-semibold uppercase tracking-wider text-muted-foreground">
                {t("collections")}
              </p>
              <div className="flex items-center gap-1.5 px-2 py-1 text-[11px] text-muted-foreground">
                <span className="size-1.5 rounded-full bg-primary" />
                {t("collectionCalculus")}
              </div>
              <div className="flex items-center gap-1.5 px-2 py-1 text-[11px] text-muted-foreground">
                <span className="size-1.5 rounded-full bg-ochre" />
                {t("collectionHistory")}
              </div>
              <div className="mt-auto flex items-center gap-1.5 border-t border-border pt-2.5 text-[9.5px] text-muted-foreground">
                <Folder className="size-3" />
                {t("savedDocuments")}
              </div>
            </aside>

            <div className="relative flex-1 bg-reader-canvas/60 p-3 md:p-5">
              <div className="flex h-full flex-col gap-2.5 rounded-lg border border-border bg-ivory-sheet p-4 md:p-6">
                <div className="h-1.5 w-[92%] rounded-full bg-foreground/10" />
                <div className="h-1.5 w-[78%] rounded-full bg-foreground/10" />
                <div
                  className={cn(
                    "rounded-md border px-2.5 py-2 text-[11px] leading-relaxed transition-colors duration-200 ease-[var(--ease-out)]",
                    activeId
                      ? "border-primary/50 bg-primary/10 text-foreground"
                      : "border-border bg-foreground/5 text-muted-foreground"
                  )}
                >
                  {activeId ? t(`prompts.${activeId}.selection`) : t("selectionPlaceholder")}
                </div>
                <div className="h-1.5 w-[60%] rounded-full bg-foreground/10" />
                <span className="inline-block h-1.5 w-[70%] rounded-full bg-primary/35" />
                <div className="h-1.5 w-[80%] rounded-full bg-foreground/10" />
                <span className="inline-block h-1.5 w-[55%] rounded-full bg-ochre/45" />
                <div className="mt-1 h-1.5 w-[40%] rounded-full bg-foreground/10" />
              </div>

              <div className="absolute bottom-3 right-3 w-44 rounded-lg border border-border bg-card p-3 shadow-float md:bottom-5 md:right-5 md:w-56">
                <div className="mb-2 flex items-center gap-1.5">
                  <ZocratisMark animated={typing} className="size-3.5 text-primary" />
                  <span className="text-[9.5px] font-semibold uppercase tracking-wide text-muted-foreground">
                    {t("noteLabel")}
                  </span>
                </div>
                <p aria-live="polite" className="min-h-[34px] text-[10.5px] leading-relaxed">
                  {out || <span className="text-muted-foreground">{t("notePlaceholder", { brand: siteConfig.name })}</span>}
                  {!typing && out && <span className="ml-0.5 inline-block h-2.5 w-[2px] animate-pulse bg-primary align-middle" />}
                </p>
                <div className="mt-2.5 flex gap-1.5">
                  <span className="rounded-full bg-primary px-2 py-0.5 text-[9px] font-semibold text-primary-foreground">
                    {t("accept")}
                  </span>
                  <span className="rounded-full border border-border px-2 py-0.5 text-[9px] font-semibold text-muted-foreground">
                    {t("edit")}
                  </span>
                </div>
              </div>

              <div className="absolute bottom-3 left-3 flex size-8 items-center justify-center rounded-full bg-primary text-primary-foreground md:bottom-5 md:left-5">
                <MessageCircle className="size-4" />
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-6 flex flex-wrap items-center justify-center gap-2">
        <span className="mr-1 hidden text-xs text-muted-foreground sm:inline">{t("tryIt")}</span>
        {PROMPTS.map((id) => (
          <Button
            key={id}
            variant="outline"
            size="sm"
            aria-pressed={activeId === id}
            onClick={() => setActiveId(id)}
            className="h-7 bg-card/80 text-xs text-muted-foreground aria-pressed:border-primary/50 aria-pressed:bg-primary/10 aria-pressed:text-primary"
          >
            {t(`prompts.${id}.chip`)}
          </Button>
        ))}
      </div>
    </div>
  );
}
