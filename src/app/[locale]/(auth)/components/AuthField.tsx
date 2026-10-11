"use client";

import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import { useTranslations } from "next-intl";
import { cn } from "@/lib/utils";
import { IconButton } from "@/components/ui/icon-button";
import { Field } from "@/components/ui/field";
import { Input } from "@/components/ui/input";

interface AuthFieldProps extends Omit<React.ComponentProps<"input">, "size"> {
  id: string;
  label: string;
  hint?: string;
  // Control rendered inside the input, on the right (e.g. a visibility toggle).
  trailing?: React.ReactNode;
}

export const AuthField: React.FC<AuthFieldProps> = ({ id, label, hint, trailing, className, ...props }) => (
  <Field id={id} label={label} hint={hint}>
    <div className="relative">
      <Input size="lg" className={cn(trailing && "pr-11", className)} {...props} />
      {trailing && <div className="absolute inset-y-0 right-1.5 flex items-center">{trailing}</div>}
    </div>
  </Field>
);

export const PasswordField: React.FC<Omit<AuthFieldProps, "type" | "trailing">> = (props) => {
  const t = useTranslations("auth.fields.password");
  const [isVisible, setIsVisible] = useState(false);

  return (
    <AuthField
      {...props}
      type={isVisible ? "text" : "password"}
      trailing={
        <IconButton label={t("toggleVisibility")} aria-pressed={isVisible} onClick={() => setIsVisible((visible) => !visible)}>
          {isVisible ? <EyeOff /> : <Eye />}
        </IconButton>
      }
    />
  );
};
