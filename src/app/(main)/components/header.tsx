import Link from "next/link";
import { Button } from "@/components/ui/button";

export function Header() {
  return (
    <header className="absolute top-0 inset-x-0 z-40">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <div className="flex items-center gap-8">
          <Link href="/" className="flex items-center gap-2.5 font-semibold text-base tracking-tight text-foreground">
            <span className="flex h-7 w-7 items-center justify-center rounded-md bg-primary text-primary-foreground text-sm font-bold">
              e
            </span>
            estudiIA
          </Link>
          <nav className="hidden md:flex items-center gap-7 text-sm font-medium text-foreground">
            <Link href="#features" className="hover:opacity-70 transition-opacity">Funcionalidades</Link>
            <Link href="#examen" className="hover:opacity-70 transition-opacity">Modo Examen</Link>
            <Link href="#faq" className="hover:opacity-70 transition-opacity">FAQ</Link>
          </nav>
        </div>
        <div className="flex items-center gap-2">
          <Link href="/login">
            <Button variant="ghost" size="sm" className="press-feedback text-foreground/80 hover:text-foreground hover:bg-foreground/10">
              Iniciar sesión
            </Button>
          </Link>
          <Link href="/login">
            <Button size="sm" className="press-feedback rounded-full px-4">
              Empieza gratis
            </Button>
          </Link>
        </div>
      </div>
    </header>
  );
}
