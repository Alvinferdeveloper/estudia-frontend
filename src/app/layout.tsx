import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "estudiIA | Tu Compañero de Estudio con Inteligencia Artificial",
  description: "Potencia tu aprendizaje con estudiIA. Sube documentos, genera notas automáticas con IA y organiza tu estudio de forma inteligente.",
  keywords: ["IA", "estudio", "estudiantes", "notas automáticas", "resumen de documentos", "estudiIA"],
  openGraph: {
    title: "estudiIA | Tu Compañero de Estudio con Inteligencia Artificial",
    description: "Transforma tus documentos en conocimiento. Notas, resúmenes y organización con IA.",
    type: "website",
  },
};

import { ThemeProvider } from "@/components/theme-provider";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
