import { ArrowLeft } from "lucide-react";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { LocaleParams } from "@/i18n/routing";
import { resolveLocale } from "@/i18n/paths";
import { LocaleSwitcher } from "@/components/locale/LocaleSwitcher";
import { BrandLogo } from "@/components/brand/BrandLogo";
import { ROUTES } from "@/config/routes";
import { AuthEditorialPanel } from "./components/AuthEditorialPanel";

export default async function AuthLayout({ children, params }: LocaleParams & { children: React.ReactNode }) {
  const locale = resolveLocale((await params).locale);
  setRequestLocale(locale);
  const t = await getTranslations({ locale, namespace: "auth" });

  return (
    <div className={`grid min-h-[100dvh] bg-background lg:grid-cols-[minmax(0,1fr)_minmax(0,1.05fr)]`}>
      <div className="flex flex-col px-6 py-6 sm:px-10">
        <header className="flex items-center justify-between gap-4">
          {/* On large screens the editorial panel carries the brand. */}
          <Link href={ROUTES.home} className="text-foreground lg:hidden">
            <BrandLogo />
          </Link>
          <LocaleSwitcher className="ml-auto" />
          <Link
            href={ROUTES.home}
            className="inline-flex items-center gap-1.5 rounded-lg px-2 py-1 text-sm text-muted-foreground transition-colors duration-150 hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          >
            <ArrowLeft className="size-4" />
            {t("backToHome")}
          </Link>
        </header>
        <main className="flex flex-1 items-center justify-center py-10">{children}</main>
      </div>
      <AuthEditorialPanel />
    </div>
  );
}
