import type { Metadata } from "next";
import { BRAND_NAME } from "@/lib/brand";
import { AuthForm } from "../components/AuthForm";

export const metadata: Metadata = {
  title: `Crear cuenta · ${BRAND_NAME}`,
};

export default function RegisterPage() {
  return <AuthForm mode="register" />;
}
