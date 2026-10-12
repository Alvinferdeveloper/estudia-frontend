import { useTranslations } from "next-intl";
import { ArrowRight } from "lucide-react";
import { Link } from "@/i18n/navigation";
import { Button } from "@/components/ui/button";
import { ROUTES } from "@/config/routes";
import { siteConfig } from "@/config/site";

export function ClosingCta() {
  const t = useTranslations("landing.closingCta");

  return (
    <section className="py-8 pb-24 md:py-12">
      <div className="container mx-auto px-4">
        <div className="relative overflow-hidden rounded-2xl border border-border bg-card px-6 py-16 text-center md:py-24">
          <div className="absolute inset-0 bg-atmosphere opacity-70" />
          <div className="relative">
            <h2 className="text-3xl font-bold leading-tight tracking-tight md:text-5xl">
              {t.rich("title", {
                br: () => <br />,
                em: (chunks) => <span className="font-serif font-normal italic">{chunks}</span>,
              })}
            </h2>
            <p className="mx-auto mt-4 max-w-md text-muted-foreground">{t("body", { brand: siteConfig.name })}</p>
            <div className="mt-8 flex justify-center">
              <Button asChild size="lg" className="h-12 px-8">
                <Link href={ROUTES.register}>
                  {t("cta")}
                  <ArrowRight />
                </Link>
              </Button>
            </div>
            <p className="mt-4 text-sm text-muted-foreground">{t("note")}</p>
          </div>
        </div>
      </div>
    </section>
  );
}
