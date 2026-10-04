import { Instrument_Serif } from "next/font/google";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { BrandLogo } from "@/components/brand/BrandLogo";
import { AuthEditorialPanel } from "./components/AuthEditorialPanel";

const instrumentSerif = Instrument_Serif({
  variable: "--font-instrument-serif",
  weight: "400",
  style: ["italic"],
  subsets: ["latin"],
});

export default function AuthLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <div className={`${instrumentSerif.variable} grid min-h-[100dvh] bg-background lg:grid-cols-[minmax(0,1fr)_minmax(0,1.05fr)]`}>
      <div className="flex flex-col px-6 py-6 sm:px-10">
        <header className="flex items-center justify-between gap-4">
          {/* On large screens the editorial panel carries the brand. */}
          <Link href="/" className="text-foreground lg:hidden">
            <BrandLogo />
          </Link>
          <Link
            href="/"
            className="ml-auto inline-flex items-center gap-1.5 rounded-lg px-2 py-1 text-sm text-muted-foreground transition-colors duration-150 hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          >
            <ArrowLeft className="size-4" />
            Volver al inicio
          </Link>
        </header>
        <main className="flex flex-1 items-center justify-center py-10">{children}</main>
      </div>
      <AuthEditorialPanel />
    </div>
  );
}
