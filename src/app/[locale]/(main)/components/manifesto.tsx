"use client";

import { motion, useReducedMotion } from "motion/react";
import { useTranslations } from "next-intl";
import { ZocratisMark } from "@/components/brand/ZocratisMark";
import { siteConfig } from "@/config/site";

// The idea behind the name: learning by being asked, as Socrates taught.
export function Manifesto() {
  const t = useTranslations("landing.manifesto");
  const reduceMotion = useReducedMotion();

  return (
    <section className="py-24 md:py-36">
      <motion.div
        initial={reduceMotion ? false : { opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-80px" }}
        transition={{ duration: 0.6, ease: [0.23, 1, 0.32, 1] }}
        className="container mx-auto max-w-3xl px-4 text-center"
      >
        <ZocratisMark className="mx-auto mb-8 size-8 text-primary" />
        <h2 className="font-serif text-4xl italic leading-[1.1] md:text-6xl">
          {t("lead")}
          <br />
          <span className="text-primary">{t("brandLine", { brand: siteConfig.name })}</span>
        </h2>
        <p className="mx-auto mt-8 max-w-xl text-lg text-muted-foreground">{t("body")}</p>
      </motion.div>
    </section>
  );
}
