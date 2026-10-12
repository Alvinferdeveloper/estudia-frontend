"use client";

import Image from "next/image";
import { motion, useReducedMotion, type Variants } from "motion/react";
import { useTranslations } from "next-intl";
import { ArrowRight } from "lucide-react";
import { Link } from "@/i18n/navigation";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ROUTES } from "@/config/routes";
import { siteConfig } from "@/config/site";
import { HeroDemo } from "./hero-demo";

const EASE_OUT = [0.23, 1, 0.32, 1] as const;

const container: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.08, delayChildren: 0.04 } },
};

const item: Variants = {
  hidden: { opacity: 0, y: 12 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: EASE_OUT } },
};

interface HeroProps {
  // A photo in /public that fills the first viewport and fades into the page; without it, a soft gradient.
  backgroundImageSrc?: string;
}

export function Hero({ backgroundImageSrc }: HeroProps) {
  const t = useTranslations("landing.hero");
  const reduceMotion = useReducedMotion();
  const initial = reduceMotion ? false : "hidden";

  return (
    <section className="relative isolate overflow-hidden">
      <div className="absolute inset-x-0 top-0 -z-10 h-dvh">
        {backgroundImageSrc ? (
          <Image src={backgroundImageSrc} alt="" fill priority className="object-cover" />
        ) : (
          <div className="absolute inset-0 bg-atmosphere" />
        )}
        <div className="absolute inset-0 bg-gradient-to-b from-background/10 via-background/30 to-background" />
      </div>

      <motion.div
        variants={container}
        initial={initial}
        animate="show"
        className="container mx-auto max-w-3xl px-4 pb-12 pt-24 text-center md:pb-16 md:pt-28"
      >
        <motion.div variants={item}>
          <Badge variant="secondary" className="mb-6 gap-2 px-3.5 py-1.5 font-normal">
            <span className="size-2 rounded-full bg-marketing-accent" />
            {t("badge")}
          </Badge>
        </motion.div>

        <motion.h1 variants={item} className="mb-6 text-4xl font-bold leading-[1.05] tracking-tight md:text-6xl">
          {t.rich("title", { em: (chunks) => <span className="font-serif font-normal italic">{chunks}</span> })}
        </motion.h1>

        <motion.p variants={item} className="mx-auto mb-10 max-w-2xl text-lg text-foreground/90 md:text-xl">
          {t("subtitle", { brand: siteConfig.name })}
        </motion.p>

        <motion.div variants={item} className="flex flex-col justify-center gap-3 sm:flex-row">
          <Button asChild size="lg" className="h-12 px-8">
            <Link href={ROUTES.register}>
              {t("ctaPrimary")}
              <ArrowRight />
            </Link>
          </Button>
          <Button asChild size="lg" variant="outline" className="h-12 bg-card/70 px-8">
            <a href="#features">{t("ctaSecondary")}</a>
          </Button>
        </motion.div>
        <motion.p variants={item} className="mt-4 text-sm text-muted-foreground">
          {t("note")}
        </motion.p>
      </motion.div>

      <motion.div
        initial={reduceMotion ? false : { opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.3, ease: EASE_OUT }}
        className="container mx-auto px-4 pb-16 md:pb-24"
      >
        <HeroDemo />
      </motion.div>
    </section>
  );
}
