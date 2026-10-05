import type { Metadata } from "next";
import { ROUTES } from "@/config/routes";
import { AuthForm } from "../components/AuthForm";

export const metadata: Metadata = {
  title: "Entrar",
  alternates: { canonical: ROUTES.login },
};

export default function LoginPage() {
  return <AuthForm mode="login" />;
}
