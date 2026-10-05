import { useTranslations } from "next-intl";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { siteConfig } from "@/config/site";

const FAQ_KEYS = ["fileTypes", "pricing", "aiNotes", "images", "examMode", "security"] as const;

export function FAQ() {
  const t = useTranslations("landing.faq");

  return (
    <section id="faq" className="py-20 md:py-28">
      <div className="container mx-auto px-4 max-w-2xl">
        <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-center mb-14">
          {t("title")}
        </h2>
        <Accordion type="single" collapsible className="w-full border-t border-border/60">
          {FAQ_KEYS.map((key) => (
            <AccordionItem key={key} value={key} className="border-border/60">
              <AccordionTrigger className="text-left text-base font-semibold hover:no-underline py-5">
                {t(`items.${key}.question`)}
              </AccordionTrigger>
              <AccordionContent className="text-muted-foreground pb-5">
                {t(`items.${key}.answer`, { brand: siteConfig.name })}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </section>
  );
}
