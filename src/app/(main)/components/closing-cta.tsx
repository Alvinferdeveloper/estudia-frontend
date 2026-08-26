import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

export function ClosingCta() {
  return (
    <section className="py-8 md:py-12 pb-24">
      <div className="container mx-auto px-4">
        <div className="relative overflow-hidden rounded-2xl border border-border/60 bg-card px-6 py-16 md:py-24 text-center">
          <div className="absolute inset-0 bg-atmosphere opacity-70" />
          <div className="relative">
            <h2 className="text-3xl md:text-5xl font-bold tracking-tight leading-tight">
              Deja de tomar apuntes.
              <br />
              Empieza a <span className="font-serif italic font-normal">entender</span>.
            </h2>
            <p className="mt-4 text-muted-foreground max-w-md mx-auto">
              Sube tu primer PDF y deja que estudiIA se encargue del resto.
            </p>
            <div className="mt-8 flex justify-center">
              <Button size="lg" className="press-feedback h-12 px-8 gap-2 rounded-full">
                Empieza gratis <ArrowRight className="w-4 h-4" />
              </Button>
            </div>
            <p className="mt-4 text-sm text-muted-foreground/70">Sin tarjeta de crédito</p>
          </div>
        </div>
      </div>
    </section>
  );
}
