"use client";

import { motion } from "motion/react";
import { cn } from "@/lib/utils";

const rows = [
  {
    idx: "01",
    title: "Entiende cada página, no solo las palabras",
    body: "estudiIA no busca coincidencias de texto: entiende el significado de cada párrafo, tabla, imagen o fórmula de tu documento para darte respuestas con contexto real.",
  },
  {
    idx: "02",
    title: "Selecciona y pregunta, al instante",
    body: "Marca cualquier fragmento, imagen o fórmula y pídele una explicación sin salir de la página. La respuesta aparece justo donde la necesitas.",
  },
  {
    idx: "03",
    title: "De la lectura a la nota, sin fricción",
    body: "Cuando la IA genera una nota, ves exactamente qué cambia. Acepta, edita o descarta cada sugerencia línea por línea: la nota final siempre es tuya.",
  },
];

function VisualOne() {
  return (
    <div className="flex flex-col gap-3">
      <div className="flex flex-wrap gap-2">
        <span className="rounded-full bg-primary/15 px-3 py-1 text-xs font-semibold text-primary">Definición</span>
        <span className="rounded-full border border-border/70 px-3 py-1 text-xs font-medium text-muted-foreground">Ejemplo</span>
        <span className="rounded-full border border-border/70 px-3 py-1 text-xs font-medium text-muted-foreground">Fórmula</span>
      </div>
      <div className="h-1 rounded-full bg-border/70 overflow-hidden">
        <div className="h-full w-1/4 rounded-full bg-primary" />
      </div>
      <p className="text-xs text-muted-foreground/70">Página 12 de 48 · analizando contexto</p>
    </div>
  );
}

function VisualTwo() {
  return (
    <div className="relative rounded-lg bg-background/95 p-5">
      <span className="absolute -top-3 left-8 inline-flex items-center gap-1.5 rounded-full bg-foreground px-2.5 py-1 text-[11px] font-semibold text-background shadow-md">
        Explicar esto
      </span>
      <div className="flex flex-col gap-2 mt-3">
        <div className="h-1.5 w-[90%] rounded-full bg-foreground/10" />
        <span className="inline-block h-1.5 w-[70%] rounded-full bg-primary/40 ring-1 ring-primary/50" />
        <div className="h-1.5 w-[55%] rounded-full bg-foreground/10" />
      </div>
    </div>
  );
}

function VisualThree() {
  return (
    <div className="rounded-lg bg-background/95 p-5 text-[13px] leading-relaxed">
      <p className="rounded-md bg-danger/10 text-danger px-2 py-1 line-through decoration-danger/60">
        La derivada es un número que sale de la función.
      </p>
      <p className="mt-1.5 rounded-md bg-success/10 text-success px-2 py-1">
        La derivada mide la razón de cambio instantánea de la función en un punto.
      </p>
      <div className="flex gap-1.5 mt-3">
        <span className="rounded-full bg-foreground px-2.5 py-1 text-[11px] font-semibold text-background">Aceptar</span>
        <span className="rounded-full border border-border/60 px-2.5 py-1 text-[11px] font-semibold text-muted-foreground">Editar</span>
      </div>
    </div>
  );
}

const visuals = [VisualOne, VisualTwo, VisualThree];

export function FeatureRows() {
  return (
    <section id="features" className="py-20 md:py-28">
      <div className="container mx-auto px-4">
        <div className="text-center max-w-xl mx-auto mb-16">
          <span className="text-xs font-medium uppercase tracking-wider text-muted-foreground">Cómo funciona</span>
          <h2 className="mt-3 text-3xl md:text-4xl font-bold tracking-tight">Cómo te ayuda mientras lees</h2>
        </div>

        <div className="flex flex-col">
          {rows.map((row, i) => {
            const Visual = visuals[i];
            const flip = i % 2 === 1;
            return (
              <motion.div
                key={row.idx}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-80px" }}
                transition={{ duration: 0.5, ease: [0.23, 1, 0.32, 1] }}
                className={cn(
                  "grid md:grid-cols-2 gap-10 md:gap-16 items-center py-10 md:py-14",
                  i > 0 && "border-t border-border/60"
                )}
              >
                <div className={cn(flip && "md:order-2")}>
                  <span className="font-serif italic text-muted-foreground/60 text-sm mb-3 block">{row.idx}</span>
                  <h3 className="text-xl md:text-2xl font-bold tracking-tight mb-3">{row.title}</h3>
                  <p className="text-muted-foreground max-w-md">{row.body}</p>
                </div>
                <div className={cn("rounded-xl border border-border/60 bg-card p-6 min-h-[180px] flex items-center", flip && "md:order-1")}>
                  <Visual />
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
