import type { Metadata } from "next";
import { setRequestLocale } from "next-intl/server";
import { ROUTES } from "@/config/routes";
import { publicPageMetadata, siteStructuredData } from "@/config/seo";
import { LocaleParams } from "@/i18n/routing";
import { resolveLocale } from "@/i18n/paths";
import { JsonLd } from "@/components/seo/JsonLd";
import { Header } from "./components/header";
import { Hero } from "./components/hero";
import { FeatureRows } from "./components/feature-rows";
import { DeepDive } from "./components/deep-dive";
import { Manifesto } from "./components/manifesto";
import { FAQ } from "./components/faq";
import { ClosingCta } from "./components/closing-cta";
import { Footer } from "./components/footer";

export async function generateMetadata({ params }: LocaleParams): Promise<Metadata> {
  return publicPageMetadata(resolveLocale((await params).locale), ROUTES.home);
}

export default async function LandingPage({ params }: LocaleParams) {
  const locale = resolveLocale((await params).locale);
  setRequestLocale(locale);

  return (
    <div className="flex flex-col min-h-screen">
      <JsonLd data={await siteStructuredData(locale)} />
      <Header />
      <main className="flex-grow">
        {/* To use your own hero background, drop the file into /public/images
            and pass backgroundImageSrc="/images/your-file.jpg" below. */}
        <Hero backgroundImageSrc="/images/hero_bg.png" />
        <FeatureRows />
        <DeepDive />
        <Manifesto />
        <FAQ />
        <ClosingCta />
      </main>
      <Footer />
    </div>
  );
}
