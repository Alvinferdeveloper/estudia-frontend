import type { Metadata } from "next";
import { BRAND_NAME } from "@/lib/brand";
import { AuthForm } from "../components/AuthForm";

export const metadata: Metadata = {
  title: `Entrar · ${BRAND_NAME}`,
};

export default function LoginPage() {
  return <AuthForm mode="login" />;
}
