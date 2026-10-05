import type { Metadata } from "next";
import { setRequestLocale } from "next-intl/server";
import { ROUTES } from "@/config/routes";
import { publicPageMetadata } from "@/config/seo";
import { LocaleParams } from "@/i18n/routing";
import { resolveLocale } from "@/i18n/paths";
import { AuthForm } from "../components/AuthForm";

export async function generateMetadata({ params }: LocaleParams): Promise<Metadata> {
  return publicPageMetadata(resolveLocale((await params).locale), ROUTES.register, "register");
}

export default async function RegisterPage({ params }: LocaleParams) {
  setRequestLocale(resolveLocale((await params).locale));
  return <AuthForm mode="register" />;
}
