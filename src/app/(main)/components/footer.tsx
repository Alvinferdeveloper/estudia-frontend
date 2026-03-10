import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Brain, Github, Twitter } from "lucide-react";
import Link from "next/link";

export function Footer() {
  return (
    <footer className="bg-muted/30 pt-24 pb-12">
      <div className="container mx-auto px-4">
        <div className="bg-primary rounded-3xl p-8 md:p-16 text-center text-primary-foreground mb-24">
          <h2 className="text-3xl md:text-5xl font-bold mb-6">¿Listo para mejorar tus notas?</h2>
          <p className="text-primary-foreground/80 mb-10 max-w-lg mx-auto">
            Únete a miles de estudiantes que ya están transformando su aprendizaje con estudiIA.
          </p>
          <Button size="lg" variant="secondary" className="h-12 px-8 text-primary">
            Empieza ahora gratis
          </Button>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
          <div className="col-span-1 md:col-span-2">
            <Link href="/" className="flex items-center gap-2 font-bold text-xl mb-4">
              <Brain className="w-6 h-6 text-primary" />
              <span>estudiIA</span>
            </Link>
            <p className="text-muted-foreground text-sm max-w-xs">
              La plataforma de estudio definitiva potenciada por Inteligencia Artificial. Hecha para estudiantes, por estudiantes.
            </p>
          </div>
          <div>
            <h4 className="font-bold mb-4">Producto</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><Link href="#features">Funcionalidades</Link></li>
              <li><Link href="#">Precios</Link></li>
              <li><Link href="#">Blog</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="font-bold mb-4">Legal</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><Link href="#">Privacidad</Link></li>
              <li><Link href="#">Términos</Link></li>
            </ul>
          </div>
        </div>
        
        <Separator className="mb-8" />
        
        <div className="flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-muted-foreground">
          <p>© 2026 estudiIA. Todos los derechos reservados.</p>
          <div className="flex items-center gap-4">
            <Link href="#" className="hover:text-primary transition-colors"><Twitter className="w-5 h-5" /></Link>
            <Link href="#" className="hover:text-primary transition-colors"><Github className="w-5 h-5" /></Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
