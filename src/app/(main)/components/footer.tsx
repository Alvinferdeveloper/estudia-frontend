import { Github, Twitter } from "lucide-react";
import Link from "next/link";

export function Footer() {
  return (
    <footer className="border-t border-border/60 py-16">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 mb-12">
          <div className="col-span-1 md:col-span-2">
            <Link href="/" className="flex items-center gap-2.5 font-semibold text-base tracking-tight mb-4">
              <span className="flex h-7 w-7 items-center justify-center rounded-md bg-primary text-primary-foreground text-sm font-bold">
                e
              </span>
              estudiIA
            </Link>
            <p className="text-muted-foreground text-sm max-w-xs">
              La plataforma de estudio potenciada por inteligencia artificial. Hecha para estudiantes, por estudiantes.
            </p>
          </div>
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-4">Producto</h4>
            <ul className="space-y-2.5 text-sm text-muted-foreground">
              <li><Link href="#features" className="hover:text-foreground transition-colors">Funcionalidades</Link></li>
              <li><Link href="#examen" className="hover:text-foreground transition-colors">Modo Examen</Link></li>
              <li><Link href="#" className="hover:text-foreground transition-colors">Precios</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-4">Legal</h4>
            <ul className="space-y-2.5 text-sm text-muted-foreground">
              <li><Link href="#" className="hover:text-foreground transition-colors">Privacidad</Link></li>
              <li><Link href="#" className="hover:text-foreground transition-colors">Términos</Link></li>
            </ul>
          </div>
        </div>

        <div className="flex flex-col md:flex-row items-center justify-between gap-4 pt-8 border-t border-border/60 text-sm text-muted-foreground">
          <p>© 2026 estudiIA. Todos los derechos reservados.</p>
          <div className="flex items-center gap-4">
            <Link href="#" className="hover:text-foreground transition-colors"><Twitter className="w-5 h-5" /></Link>
            <Link href="#" className="hover:text-foreground transition-colors"><Github className="w-5 h-5" /></Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
