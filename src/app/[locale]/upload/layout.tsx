import type { Metadata } from "next";
import { privatePageMetadata } from "@/config/seo";
import { LocaleParams } from "@/i18n/routing";
import { resolveLocale } from "@/i18n/paths";

export async function generateMetadata({ params }: LocaleParams): Promise<Metadata> {
  return privatePageMetadata(resolveLocale((await params).locale), "upload");
}

export default function UploadLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return children;
}
