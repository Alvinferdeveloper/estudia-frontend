"use client";

import { useState } from "react";
import { ArrowRight, CircleAlert, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import { siteConfig } from "@/config/site";
import { Link } from "@/i18n/navigation";
import { AUTH_MODES, AuthMode, MIN_PASSWORD_LENGTH } from "../lib/auth-modes";
import { EmailAuthFields, useEmailAuth } from "../hooks/useEmailAuth";
import { useSocialAuth } from "../hooks/useSocialAuth";
import { AuthField, PasswordField } from "./AuthField";
import { SocialAuthButtons } from "./SocialAuthButtons";

// Staggered entrance: each block rises in 60ms after the previous one.
const Reveal: React.FC<{ step: number; className?: string; children: React.ReactNode }> = ({ step, className, children }) => (
  <div
    className={cn("animate-in fade-in slide-in-from-bottom-2 fill-mode-both duration-500 ease-[var(--ease-out)]", className)}
    style={{ animationDelay: `${step * 60}ms` }}
  >
    {children}
  </div>
);

export const AuthForm: React.FC<{ mode: AuthMode }> = ({ mode }) => {
  const t = useTranslations("auth");
  const config = AUTH_MODES[mode];
  const emailAuth = useEmailAuth(mode);
  const social = useSocialAuth();
  const [fields, setFields] = useState<EmailAuthFields>({ name: "", email: "", password: "" });

  const isBusy = emailAuth.isSubmitting || social.pendingProvider !== null;
  const error = emailAuth.error ?? social.error;

  const updateField = (key: keyof EmailAuthFields) => (event: React.ChangeEvent<HTMLInputElement>) => {
    setFields((current) => ({ ...current, [key]: event.target.value }));
    emailAuth.clearError();
  };

  return (
    <div className="flex w-full max-w-[380px] flex-col">
      <Reveal step={0}>
        <h1 className="text-[28px] font-semibold leading-tight tracking-tight text-foreground text-balance">{t(`${mode}.title`)}</h1>
        <p className="mt-2 text-[15px] leading-relaxed text-muted-foreground text-pretty">
          {t(`${mode}.subtitle`, { brand: siteConfig.name })}
        </p>
      </Reveal>

      <Reveal step={1} className="mt-8">
        <SocialAuthButtons pendingProvider={social.pendingProvider} disabled={isBusy} onSelect={social.signInWith} />
      </Reveal>

      <Reveal step={2} className="my-6">
        <div className="flex items-center gap-3 text-xs text-muted-foreground">
          <span aria-hidden className="h-px flex-1 bg-border" />
          {t("orWithEmail")}
          <span aria-hidden className="h-px flex-1 bg-border" />
        </div>
      </Reveal>

      <Reveal step={3}>
        <form
          onSubmit={(event) => {
            event.preventDefault();
            emailAuth.submit(fields);
          }}
          className="flex flex-col gap-4"
        >
          {mode === "register" && (
            <AuthField
              id="name"
              label={t("fields.name.label")}
              autoComplete="name"
              placeholder={t("fields.name.placeholder")}
              required
              autoFocus
              value={fields.name}
              onChange={updateField("name")}
            />
          )}
          <AuthField
            id="email"
            type="email"
            label={t("fields.email.label")}
            autoComplete="email"
            placeholder={t("fields.email.placeholder")}
            required
            autoFocus={mode === "login"}
            value={fields.email}
            onChange={updateField("email")}
          />
          <PasswordField
            id="password"
            label={t("fields.password.label")}
            autoComplete={config.passwordAutoComplete}
            required
            minLength={config.showPasswordHint ? MIN_PASSWORD_LENGTH : undefined}
            hint={config.showPasswordHint ? t("fields.password.hint", { min: MIN_PASSWORD_LENGTH }) : undefined}
            value={fields.password}
            onChange={updateField("password")}
          />

          {error && (
            <div role="alert" className="flex items-start gap-2 rounded-xl bg-destructive/10 px-3.5 py-3 text-sm text-destructive">
              <CircleAlert className="mt-0.5 size-4 shrink-0" />
              {t(`errors.${error}`, { min: MIN_PASSWORD_LENGTH })}
            </div>
          )}

          <Button type="submit" size="lg" disabled={isBusy} className="group mt-1 w-full text-[15px]">
            {emailAuth.isSubmitting ? (
              <>
                <Loader2 className="size-4 animate-spin" />
                {t(`${mode}.submitting`)}
              </>
            ) : (
              <>
                {t(`${mode}.submit`)}
                <ArrowRight className="size-4 transition-transform duration-200 ease-[var(--ease-out)] group-hover:translate-x-0.5" />
              </>
            )}
          </Button>
        </form>
      </Reveal>

      <Reveal step={4} className="mt-8">
        <p className="text-center text-sm text-muted-foreground">
          {t(`${mode}.switchPrompt`)}{" "}
          <Link
            href={config.switchHref}
            className="rounded-sm font-medium text-foreground underline-offset-4 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          >
            {t(`${mode}.switchLabel`)}
          </Link>
        </p>
      </Reveal>
    </div>
  );
};
