import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { siteConfig } from "@/config/site";

const faqs = [
  {
    q: "¿Qué tipo de archivos puedo subir?",
    a: "Actualmente soportamos PDFs de cualquier tamaño. Próximamente añadiremos soporte para documentos de Word y presentaciones."
  },
  {
    q: "¿Es realmente gratuito?",
    a: `${siteConfig.name} ofrece un plan gratuito generoso que incluye procesamiento de documentos y notas con IA. También tenemos un plan Pro para usuarios intensivos.`
  },
  {
    q: "¿Cómo funciona la IA para las notas?",
    a: "Utilizamos modelos avanzados que analizan el texto seleccionado junto con el contexto de tu documento para ofrecer explicaciones precisas y coherentes."
  },
  {
    q: "¿Puedo preguntar sobre imágenes y fórmulas?",
    a: "Sí. Selecciona cualquier imagen, diagrama o ecuación de tu PDF y pregúntale directamente: la IA responde usando esa imagen como contexto."
  },
  {
    q: "¿Qué es el Modo Examen?",
    a: "Genera exámenes de práctica personalizados a partir de tus propios documentos, con una mascota que te acompaña y retroalimentación al instante."
  },
  {
    q: "¿Mis documentos están seguros?",
    a: "Sí, la privacidad es nuestra prioridad. Tus documentos están encriptados y solo tú tienes acceso a ellos y a tus anotaciones."
  }
];

export function FAQ() {
  return (
    <section id="faq" className="py-20 md:py-28">
      <div className="container mx-auto px-4 max-w-2xl">
        <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-center mb-14">
          Preguntas frecuentes
        </h2>
        <Accordion type="single" collapsible className="w-full border-t border-border/60">
          {faqs.map((faq, i) => (
            <AccordionItem key={i} value={`item-${i}`} className="border-border/60">
              <AccordionTrigger className="text-left text-base font-semibold hover:no-underline py-5">
                {faq.q}
              </AccordionTrigger>
              <AccordionContent className="text-muted-foreground pb-5">
                {faq.a}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </section>
  );
}
