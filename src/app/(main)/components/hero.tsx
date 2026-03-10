import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowRight, Sparkles } from "lucide-react";

export function Hero() {
  return (
    <section className="pt-32 pb-16 md:pt-48 md:pb-32 overflow-hidden">
      <div className="container mx-auto px-4 text-center">
        <Badge variant="secondary" className="mb-4 py-1 px-4 gap-2">
          <Sparkles className="w-3 h-3 text-primary" />
          Impulsado por IA de última generación
        </Badge>
        <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight mb-6 bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
          Estudia más inteligente, <br className="hidden md:block" /> no más duro.
        </h1>
        <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-10">
          Transforma tus PDFs en conocimiento accionable. Genera notas con IA, resume conceptos complejos y organiza tu aprendizaje de forma automática.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16">
          <Button size="lg" className="h-12 px-8 gap-2">
            Empezar ahora gratis <ArrowRight className="w-4 h-4" />
          </Button>
          <Button size="lg" variant="outline" className="h-12 px-8">
            Ver demostración
          </Button>
        </div>
        
        {/* Mockup Placeholder */}
        <div className="relative max-w-5xl mx-auto rounded-xl border bg-card shadow-2xl overflow-hidden aspect-video group">
          <div className="absolute inset-0 bg-gradient-to-t from-background/20 to-transparent" />
          <div className="flex items-center justify-center h-full bg-muted/50">
            <p className="text-muted-foreground italic text-center px-4">
              [Simulación de la plataforma: Lector de PDFs interactivo con notas de IA generadas automáticamente]
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
