import Link from "next/link";
import { Button } from "@/components/ui/button";
import { BrandLogo } from "@/components/brand/BrandLogo";

export function Header() {
  return (
    <header className="absolute top-0 inset-x-0 z-40">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <div className="flex items-center gap-8">
          <Link href="/" className="text-base text-foreground">
            <BrandLogo />
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
