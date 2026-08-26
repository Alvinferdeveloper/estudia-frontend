"use client";

import { motion } from "motion/react";
import { Check, FileText, GraduationCap, Search } from "lucide-react";

const columns = [
  {
    icon: FileText,
    title: "No cambia tu flujo",
    body: "Sigues subiendo los PDFs de siempre. Sin plantillas nuevas, sin reaprender nada.",
  },
  {
    icon: GraduationCap,
    title: "Un tutor que te examina",
    body: "El Modo Examen genera pruebas de práctica desde tus propios documentos, con retroalimentación al instante.",
  },
  {
    icon: Search,
    title: "Busca por significado",
    body: "Encuentra respuestas en todos tus documentos aunque no recuerdes la palabra exacta.",
  },
];

const compat = [
  { label: "PDF · disponible", live: true },
  { label: "Word · próximamente", live: false },
  { label: "PowerPoint · próximamente", live: false },
];

export function DeepDive() {
  return (
    <section id="examen" className="py-20 md:py-28 border-y border-border/60 bg-muted/20">
      <div className="container mx-auto px-4">
        <div className="text-center max-w-xl mx-auto mb-16">
          <span className="text-xs font-medium uppercase tracking-wider text-muted-foreground">Se adapta a ti</span>
          <h2 className="mt-3 text-3xl md:text-4xl font-bold tracking-tight">Se adapta a como ya estudias</h2>
        </div>

        <div className="grid md:grid-cols-3 gap-10 md:gap-0 md:divide-x divide-border/60">
          {columns.map((col, i) => (
            <motion.div
              key={col.title}
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.4, delay: i * 0.08, ease: [0.23, 1, 0.32, 1] }}
              className="px-0 md:px-8"
            >
              <col.icon className="h-7 w-7 mb-5" strokeWidth={1.5} />
              <h3 className="text-lg font-bold mb-2">{col.title}</h3>
              <p className="text-sm text-muted-foreground">{col.body}</p>
            </motion.div>
          ))}
        </div>

        <div className="flex flex-wrap justify-center gap-2.5 mt-16">
          {compat.map((c) => (
            <span
              key={c.label}
              className={
                c.live
                  ? "inline-flex items-center gap-1.5 rounded-full bg-success/15 text-success px-3.5 py-1.5 text-xs font-semibold"
                  : "inline-flex items-center gap-1.5 rounded-full border border-border/70 text-muted-foreground px-3.5 py-1.5 text-xs font-semibold"
              }
            >
              {c.live && <Check className="h-3.5 w-3.5" />}
              {c.label}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}
