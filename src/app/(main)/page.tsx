import { Header } from "./components/header";
import { Hero } from "./components/hero";
import { FeatureRows } from "./components/feature-rows";
import { DeepDive } from "./components/deep-dive";
import { Stats } from "./components/stats";
import { FAQ } from "./components/faq";
import { ClosingCta } from "./components/closing-cta";
import { Footer } from "./components/footer";

export default function LandingPage() {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-grow">
        {/* To use your own hero background, drop the file into /public/images
            and pass backgroundImageSrc="/images/your-file.jpg" below. */}
        <Hero backgroundImageSrc="/images/hero_bg.png" />
        <FeatureRows />
        <DeepDive />
        <Stats />
        <FAQ />
        <ClosingCta />
      </main>
      <Footer />
    </div>
  );
}
