import type { Metadata } from "next";
import { siteConfig } from "@/config/site";
import { AuthForm } from "../components/AuthForm";

export const metadata: Metadata = {
  title: `Crear cuenta · ${siteConfig.name}`,
};

export default function RegisterPage() {
  return <AuthForm mode="register" />;
}
