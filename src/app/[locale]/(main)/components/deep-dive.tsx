"use client";

import { motion } from "motion/react";
import { useTranslations } from "next-intl";
import { Check, FileText, GraduationCap, Search } from "lucide-react";

const columns = [
  { key: "workflow", icon: FileText },
  { key: "tutor", icon: GraduationCap },
  { key: "search", icon: Search },
] as const;

const compat = [
  { key: "pdf", live: true },
  { key: "word", live: false },
  { key: "powerpoint", live: false },
] as const;

export function DeepDive() {
  const t = useTranslations("landing.deepDive");

  return (
    <section id="examen" className="py-20 md:py-28 border-y border-border/60 bg-muted/20">
      <div className="container mx-auto px-4">
        <div className="text-center max-w-xl mx-auto mb-16">
          <h2 className="text-3xl md:text-4xl font-bold tracking-tight">{t("title")}</h2>
        </div>

        <div className="grid md:grid-cols-3 gap-10 md:gap-0 md:divide-x divide-border/60">
          {columns.map((col, i) => (
            <motion.div
              key={col.key}
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.4, delay: i * 0.08, ease: [0.23, 1, 0.32, 1] }}
              className="px-0 md:px-8"
            >
              <col.icon className="h-7 w-7 mb-5" strokeWidth={1.5} />
              <h3 className="text-lg font-bold mb-2">{t(`columns.${col.key}.title`)}</h3>
              <p className="text-sm text-muted-foreground">{t(`columns.${col.key}.body`)}</p>
            </motion.div>
          ))}
        </div>

        <div className="flex flex-wrap justify-center gap-2.5 mt-16">
          {compat.map((c) => (
            <span
              key={c.key}
              className={
                c.live
                  ? "inline-flex items-center gap-1.5 rounded-full bg-success/15 text-success px-3.5 py-1.5 text-xs font-semibold"
                  : "inline-flex items-center gap-1.5 rounded-full border border-border/70 text-muted-foreground px-3.5 py-1.5 text-xs font-semibold"
              }
            >
              {c.live && <Check className="h-3.5 w-3.5" />}
              {t(`compat.${c.key}`)}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}
