"use client";

import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import { cn } from "@/lib/utils";
import { IconButton } from "@/components/ui/icon-button";

interface AuthFieldProps extends React.ComponentProps<"input"> {
  id: string;
  label: string;
  hint?: string;
  // Control rendered inside the input, on the right (e.g. a visibility toggle).
  trailing?: React.ReactNode;
}

export const AuthField: React.FC<AuthFieldProps> = ({ id, label, hint, trailing, className, ...props }) => {
  const hintId = hint ? `${id}-hint` : undefined;

  return (
    <div className="flex flex-col gap-1.5">
      <label htmlFor={id} className="text-sm font-medium text-foreground">
        {label}
      </label>
      <div className="relative">
        <input
          id={id}
          aria-describedby={hintId}
          className={cn(
            "h-11 w-full rounded-xl border border-border bg-background px-3.5 text-[15px] text-foreground outline-none transition-[border-color,box-shadow] duration-150 placeholder:text-muted-foreground/70 hover:border-foreground/20 focus:border-primary/50 focus:ring-2 focus:ring-ring disabled:opacity-60",
            trailing && "pr-11",
            className
          )}
          {...props}
        />
        {trailing && <div className="absolute inset-y-0 right-1.5 flex items-center">{trailing}</div>}
      </div>
      {hint && (
        <p id={hintId} className="text-xs text-muted-foreground">
          {hint}
        </p>
      )}
    </div>
  );
};

export const PasswordField: React.FC<Omit<AuthFieldProps, "type" | "trailing">> = (props) => {
  const [isVisible, setIsVisible] = useState(false);

  return (
    <AuthField
      {...props}
      type={isVisible ? "text" : "password"}
      trailing={
        <IconButton label="Mostrar contraseña" aria-pressed={isVisible} onClick={() => setIsVisible((visible) => !visible)}>
          {isVisible ? <EyeOff /> : <Eye />}
        </IconButton>
      }
    />
  );
};
