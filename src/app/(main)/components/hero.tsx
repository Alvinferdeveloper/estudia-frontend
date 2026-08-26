"use client";

import Image from "next/image";
import { motion } from "motion/react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowRight, Clock, Folder, MessageCircle } from "lucide-react";

const fadeUp = {
  hidden: { opacity: 0, y: 10 },
  show: { opacity: 1, y: 0 },
};

interface HeroProps {
  /**
   * Path to a custom background photo for the hero (e.g. "/images/hero-bg.jpg"
   * after dropping the file into /public/images). It fills roughly one viewport
   * behind the headline, then fades into the page background before the app
   * mockup and the next section, the way a hero photo should. Leave unset to
   * keep the abstract gradient atmosphere instead.
   */
  backgroundImageSrc?: string;
}

export function Hero({ backgroundImageSrc }: HeroProps) {
  return (
    <section className="relative isolate overflow-hidden">
      {/* Full-bleed backdrop, one viewport tall, fading into the page background
          so it reads as a photo behind the fold rather than a page-long wallpaper. */}
      <div className="absolute inset-x-0 top-0 -z-10 h-dvh">
        {backgroundImageSrc ? (
          <Image src={backgroundImageSrc} alt="" fill priority className="object-cover" />
        ) : (
          <div className="absolute inset-0 bg-atmosphere" />
        )}
        <div className="absolute inset-0 bg-gradient-to-b from-background/10 via-background/30 to-background" />
      </div>

      <div className="container mx-auto px-4 text-center max-w-3xl pt-36 pb-12 md:pt-44 md:pb-16">
        <motion.div
          initial="hidden"
          animate="show"
          variants={fadeUp}
          transition={{ duration: 0.5, ease: [0.23, 1, 0.32, 1] }}
        >
          <Badge variant="secondary" className="mb-6 gap-2 rounded-full px-3.5 py-1.5 font-normal">
            <span className="h-1.5 w-1.5 rounded-full bg-marketing-accent" />
            Nuevo · pregunta sobre imágenes y fórmulas de tu PDF
          </Badge>
        </motion.div>

        <motion.h1
          initial="hidden"
          animate="show"
          variants={fadeUp}
          transition={{ duration: 0.5, delay: 0.08, ease: [0.23, 1, 0.32, 1] }}
          className="text-4xl md:text-6xl font-bold tracking-tight leading-[1.05] mb-6"
        >
          La IA que lee tus PDFs{" "}
          <span className="font-serif italic font-normal">contigo</span>.
        </motion.h1>

        <motion.p
          initial="hidden"
          animate="show"
          variants={fadeUp}
          transition={{ duration: 0.5, delay: 0.16, ease: [0.23, 1, 0.32, 1] }}
          className="text-lg md:text-xl text-foreground mb-10"
        >
          estudiIA subraya, resume y responde preguntas sobre el texto, las imágenes y las fórmulas de tus documentos, en tiempo real y sin salir de la página.
        </motion.p>

        <motion.div
          initial="hidden"
          animate="show"
          variants={fadeUp}
          transition={{ duration: 0.5, delay: 0.24, ease: [0.23, 1, 0.32, 1] }}
          className="flex flex-col sm:flex-row gap-3 justify-center"
        >
          <Button size="lg" className="press-feedback h-12 px-8 gap-2 rounded-full">
            Empieza gratis <ArrowRight className="w-4 h-4" />
          </Button>
          <Button size="lg" variant="outline" className="press-feedback h-12 px-8 rounded-full">
            Ver cómo funciona
          </Button>
        </motion.div>
        <p className="mt-4 text-sm text-muted-foreground/70">
          Sin tarjeta de crédito · plan gratuito para siempre
        </p>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.3, ease: [0.23, 1, 0.32, 1] }}
        className="container mx-auto px-4 pb-16 md:pb-24"
      >
        <div className="relative mx-auto max-w-4xl aspect-[16/10] rounded-2xl border border-border/60 overflow-hidden shadow-2xl">
          <div className="absolute inset-0 bg-atmosphere bg-background" />

          <div className="absolute inset-4 md:inset-6 rounded-xl border border-border/60 bg-card shadow-xl overflow-hidden flex flex-col">
            {/* Chrome bar */}
            <div className="flex items-center gap-2 px-3.5 py-2.5 border-b border-border/60 shrink-0">
              <span className="h-2.5 w-2.5 rounded-full bg-danger/70" />
              <span className="h-2.5 w-2.5 rounded-full bg-warning/70" />
              <span className="h-2.5 w-2.5 rounded-full bg-success/70" />
              <span className="mx-auto font-mono text-[11px] text-muted-foreground/70">
                estudiia.app/documento/calculo-ii.pdf
              </span>
            </div>

            <div className="flex flex-1 min-h-0">
              {/* Mini sidebar */}
              <aside className="hidden sm:flex w-40 shrink-0 flex-col border-r border-border/60 bg-secondary/60 p-3">
                <div className="flex items-center gap-1.5 mb-4">
                  <span className="h-4 w-4 rounded-[5px] bg-primary" />
                  <span className="text-[11px] font-bold">estudiIA</span>
                </div>
                <div className="flex items-center gap-1.5 rounded-md bg-primary/10 px-2 py-1.5 text-[11px] font-medium text-primary mb-3">
                  <Clock className="h-3 w-3" />
                  Recientes
                </div>
                <p className="px-2 text-[9px] font-semibold uppercase tracking-wider text-muted-foreground/70 mb-1.5">
                  Colecciones
                </p>
                <div className="flex items-center gap-1.5 px-2 py-1 text-[11px] text-muted-foreground">
                  <span className="h-1.5 w-1.5 rounded-full bg-primary" />
                  Cálculo II
                </div>
                <div className="flex items-center gap-1.5 px-2 py-1 text-[11px] text-muted-foreground">
                  <span className="h-1.5 w-1.5 rounded-full bg-marketing-accent" />
                  Historia
                </div>
                <div className="mt-auto flex items-center gap-1.5 border-t border-border/60 pt-2.5 text-[9.5px] text-muted-foreground/70">
                  <Folder className="h-3 w-3" />
                  24 documentos guardados
                </div>
              </aside>

              {/* Mini reader */}
              <div className="relative flex-1 p-3 md:p-5 bg-muted/30">
                <div className="h-full rounded-lg bg-background/95 shadow-sm p-4 md:p-6 flex flex-col gap-2.5">
                  <div className="h-1.5 w-[92%] rounded-full bg-foreground/10" />
                  <div className="h-1.5 w-[78%] rounded-full bg-foreground/10" />
                  <span className="inline-block h-1.5 w-[85%] rounded-full bg-marketing-accent/50" />
                  <div className="h-1.5 w-[60%] rounded-full bg-foreground/10" />
                  <span className="inline-block h-1.5 w-[70%] rounded-full bg-primary/35" />
                  <div className="h-1.5 w-[80%] rounded-full bg-foreground/10" />
                  <span className="inline-block h-1.5 w-[55%] rounded-full bg-success/35" />
                  <div className="h-1.5 w-[40%] rounded-full bg-foreground/10 mt-1" />
                </div>

                <div className="absolute right-3 bottom-3 md:right-5 md:bottom-5 w-44 md:w-56 rounded-lg border border-border/60 bg-card shadow-lg p-3">
                  <div className="flex items-center gap-1.5 mb-2">
                    <span className="h-1.5 w-1.5 rounded-full bg-primary shadow-[0_0_0_3px_var(--ring)]" />
                    <span className="text-[9.5px] font-semibold tracking-wide text-muted-foreground">NOTA IA</span>
                  </div>
                  <p className="text-[10.5px] leading-relaxed">
                    La derivada mide la razón de cambio instantánea de la función
                    <span className="inline-block w-[2px] h-2.5 bg-primary ml-0.5 align-middle animate-pulse" />
                  </p>
                  <div className="flex gap-1.5 mt-2.5">
                    <span className="rounded-full bg-foreground px-2 py-0.5 text-[9px] font-semibold text-background">
                      Aceptar
                    </span>
                    <span className="rounded-full border border-border/60 px-2 py-0.5 text-[9px] font-semibold text-muted-foreground">
                      Editar
                    </span>
                  </div>
                </div>

                <div className="absolute left-3 bottom-3 md:left-5 md:bottom-5 flex h-8 w-8 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-lg">
                  <MessageCircle className="h-4 w-4" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </section>
  );
}
