"use client";

import { motion, useReducedMotion, type Variants } from "motion/react";
import { useTranslations } from "next-intl";
import { siteConfig } from "@/config/site";

const item: Variants = {
  hidden: { opacity: 0, y: 16 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.23, 1, 0.32, 1] } },
};

const container: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.1 } },
};

function FeatureCard({ index, children }: { index: string; children: React.ReactNode }) {
  return (
    <div className="h-full rounded-[1.75rem] border border-border bg-card p-7 md:p-9">
      <span className="mb-3 block font-serif text-sm italic text-muted-foreground">{index}</span>
      {children}
    </div>
  );
}

function UnderstandVisual() {
  const t = useTranslations("landing.featureRows.understand");
  return (
    <div className="flex flex-col gap-3">
      <div className="flex flex-wrap gap-2">
        <span className="rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold text-primary">{t("tags.definition")}</span>
        <span className="rounded-full border border-border px-3 py-1 text-xs font-medium text-muted-foreground">{t("tags.example")}</span>
        <span className="rounded-full border border-border px-3 py-1 text-xs font-medium text-muted-foreground">{t("tags.formula")}</span>
      </div>
      <div className="h-1 overflow-hidden rounded-full bg-border">
        <div className="h-full w-1/4 rounded-full bg-primary" />
      </div>
      <p className="flex items-center gap-2 text-xs text-muted-foreground">
        <span className="size-1.5 rounded-full bg-success" />
        {t("progress")}
      </p>
    </div>
  );
}

function AskVisual() {
  const t = useTranslations("landing.featureRows.ask");
  return (
    <div className="relative rounded-lg border border-border bg-ivory-sheet p-5">
      <span className="absolute -top-3 left-8 inline-flex items-center rounded-full bg-primary px-2.5 py-1 text-[11px] font-semibold text-primary-foreground">
        {t("action")}
      </span>
      <div className="mt-3 flex flex-col gap-2">
        <div className="h-1.5 w-[90%] rounded-full bg-foreground/10" />
        <span className="inline-flex h-1.5 w-[70%] items-end gap-1 rounded-full bg-primary/40 ring-1 ring-primary/50">
          <span className="mb-[-3px] ml-auto mr-1 inline-block h-2.5 w-[2px] animate-pulse bg-primary" />
        </span>
        <div className="h-1.5 w-[55%] rounded-full bg-foreground/10" />
      </div>
    </div>
  );
}

function NotesVisual() {
  const t = useTranslations("landing.featureRows.notes");
  return (
    <div className="rounded-lg border border-border bg-ivory-sheet p-5 text-[13px] leading-relaxed">
      <p className="rounded-md bg-danger/10 px-2 py-1 text-danger line-through decoration-danger/60">{t("before")}</p>
      <p className="mt-1.5 rounded-md bg-success/10 px-2 py-1 text-success">{t("after")}</p>
      <div className="mt-3 flex gap-1.5">
        <span className="rounded-full bg-primary px-2.5 py-1 text-[11px] font-semibold text-primary-foreground">{t("accept")}</span>
        <span className="rounded-full border border-border px-2.5 py-1 text-[11px] font-semibold text-muted-foreground">{t("edit")}</span>
      </div>
    </div>
  );
}

export function FeatureRows() {
  const t = useTranslations("landing.featureRows");
  const reduceMotion = useReducedMotion();

  return (
    <section id="features" className="py-20 md:py-28">
      <div className="container mx-auto px-4">
        <div className="mb-12 max-w-2xl md:mb-16">
          <h2 className="text-3xl font-bold tracking-tight md:text-4xl">{t("title")}</h2>
          <p className="mt-3 max-w-md text-muted-foreground">{t("subtitle")}</p>
        </div>

        <motion.div
          variants={container}
          initial={reduceMotion ? false : "hidden"}
          whileInView="show"
          viewport={{ once: true, margin: "-80px" }}
          className="grid grid-cols-1 gap-4 md:grid-cols-3 md:gap-5"
        >
          <motion.div variants={item} className="md:col-span-2">
            <FeatureCard index="01">
              <h3 className="mb-3 max-w-md text-xl font-bold tracking-tight md:text-2xl">{t("understand.title")}</h3>
              <p className="mb-8 max-w-md text-muted-foreground">{t("understand.body", { brand: siteConfig.name })}</p>
              <UnderstandVisual />
            </FeatureCard>
          </motion.div>

          <motion.div variants={item} className="md:col-span-1">
            <FeatureCard index="02">
              <h3 className="mb-3 text-lg font-bold tracking-tight">{t("ask.title")}</h3>
              <p className="mb-6 text-sm text-muted-foreground">{t("ask.body")}</p>
              <AskVisual />
            </FeatureCard>
          </motion.div>

          <motion.div variants={item} className="md:col-span-3">
            <FeatureCard index="03">
              <div className="grid items-center gap-8 md:grid-cols-2">
                <div>
                  <h3 className="mb-3 max-w-md text-xl font-bold tracking-tight md:text-2xl">{t("notes.title")}</h3>
                  <p className="max-w-md text-muted-foreground">{t("notes.body")}</p>
                </div>
                <NotesVisual />
              </div>
            </FeatureCard>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
