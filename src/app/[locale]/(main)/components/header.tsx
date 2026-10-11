import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { Button } from "@/components/ui/button";
import { BrandLogo } from "@/components/brand/BrandLogo";
import { LocaleSwitcher } from "@/components/locale/LocaleSwitcher";
import { ROUTES } from "@/config/routes";

export function Header() {
  const t = useTranslations("landing");

  return (
    <header className="absolute top-0 inset-x-0 z-40">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <div className="flex items-center gap-8">
          <Link href={ROUTES.home} className="text-base text-foreground">
            <BrandLogo />
          </Link>
          <nav className="hidden md:flex items-center gap-7 text-sm font-medium text-foreground">
            <Link href="#features" className="hover:opacity-70 transition-opacity">{t("nav.features")}</Link>
            <Link href="#examen" className="hover:opacity-70 transition-opacity">{t("nav.examMode")}</Link>
            <Link href="#faq" className="hover:opacity-70 transition-opacity">{t("nav.faq")}</Link>
          </nav>
        </div>
        <div className="flex items-center gap-2">
          <LocaleSwitcher />
          <Button asChild variant="ghost" size="sm" className="text-foreground/80">
            <Link href={ROUTES.login}>{t("header.login")}</Link>
          </Button>
          <Button asChild size="sm" className="px-4">
            <Link href={ROUTES.register}>{t("header.getStarted")}</Link>
          </Button>
        </div>
      </div>
    </header>
  );
}
