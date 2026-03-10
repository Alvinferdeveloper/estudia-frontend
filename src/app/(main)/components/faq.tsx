import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const faqs = [
  {
    q: "¿Qué tipo de archivos puedo subir?",
    a: "Actualmente soportamos PDFs de cualquier tamaño. Próximamente añadiremos soporte para documentos de Word y presentaciones."
  },
  {
    q: "¿Es realmente gratuito?",
    a: "estudiIA ofrece un plan gratuito generoso que incluye procesamiento de documentos y notas con IA. También tenemos un plan Pro para usuarios intensivos."
  },
  {
    q: "¿Cómo funciona la IA para las notas?",
    a: "Utilizamos modelos avanzados que analizan el texto seleccionado junto con el contexto de tu documento para ofrecer explicaciones precisas y coherentes."
  },
  {
    q: "¿Mis documentos están seguros?",
    a: "Sí, la privacidad es nuestra prioridad. Tus documentos están encriptados y solo tú tienes acceso a ellos y a tus anotaciones."
  }
];

export function FAQ() {
  return (
    <section id="faq" className="py-24">
      <div className="container mx-auto px-4 max-w-3xl">
        <h2 className="text-3xl font-bold text-center mb-12">Preguntas frecuentes</h2>
        <Accordion type="single" collapsible className="w-full">
          {faqs.map((faq, i) => (
            <AccordionItem key={i} value={`item-${i}`}>
              <AccordionTrigger className="text-left">{faq.q}</AccordionTrigger>
              <AccordionContent>{faq.a}</AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </section>
  );
}
