import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BrainCircuit, Search, Highlighter, Zap } from "lucide-react";

const features = [
  {
    title: "Notas Inteligentes con IA",
    description: "Selecciona cualquier texto en tus documentos y deja que la IA explique conceptos o genere resúmenes al instante.",
    icon: BrainCircuit,
  },
  {
    title: "Subrayado con Colores",
    description: "Organiza tus ideas visualmente. Cada color puede representar un tema, una duda o una conclusión generada por la IA.",
    icon: Highlighter,
  },
  {
    title: "Búsqueda Semántica",
    description: "No busques solo palabras clave. Encuentra respuestas basadas en el contexto de todos tus documentos.",
    icon: Search,
  },
  {
    title: "Velocidad Increíble",
    description: "Procesa documentos extensos en segundos y obtén respuestas precisas sin perder tiempo.",
    icon: Zap,
  }
];

export function Benefits() {
  return (
    <section id="features" className="py-24 bg-muted/30">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold mb-4">Todo lo que necesitas para aprobar</h2>
          <p className="text-muted-foreground max-w-xl mx-auto">
            Hemos diseñado herramientas específicas para optimizar cada minuto de tu sesión de estudio.
          </p>
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature, i) => (
            <Card key={i} className="border-none shadow-sm hover:shadow-md transition-shadow">
              <CardHeader>
                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4 text-primary">
                  <feature.icon className="w-6 h-6" />
                </div>
                <CardTitle>{feature.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">{feature.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
