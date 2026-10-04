import type { Metadata } from "next";
import { ROUTES } from "@/config/routes";
import { AuthForm } from "../components/AuthForm";

export const metadata: Metadata = {
  title: "Crear cuenta",
  alternates: { canonical: ROUTES.register },
};

export default function RegisterPage() {
  return <AuthForm mode="register" />;
}
