import { ChevronDown, Loader2, RotateCcw } from "lucide-react";
import { useTranslations } from "next-intl";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ATTEMPT_MODES, type AttemptMode } from "@/app/[locale]/document/[id]/components/exam/hooks/useExam";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

interface RetakeMenuProps {
  onRetake: (mode: AttemptMode) => void;
  isPending: boolean;
  disabled?: boolean;
  // Primary where retaking is the screen's main action, quiet in lists.
  appearance: "primary" | "quiet";
}

const APPEARANCE = {
  primary: { variant: "default", size: "default", className: "px-5" },
  quiet: { variant: "ghost", size: "sm", className: undefined },
} as const;

// Retakes an exam in either mode, so the same questions can be practiced and then simulated.
export const RetakeMenu: React.FC<RetakeMenuProps> = ({ onRetake, isPending, disabled, appearance }) => {
  const t = useTranslations("exam");

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button {...APPEARANCE[appearance]} disabled={disabled || isPending} className={cn("gap-1.5", APPEARANCE[appearance].className)}>
          {isPending ? <Loader2 className="animate-spin" /> : <RotateCcw />}
          {t("retake")}
          <ChevronDown className="size-3.5 opacity-70" aria-hidden />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-64">
        {Object.values(ATTEMPT_MODES).map((mode) => (
          <DropdownMenuItem key={mode} onSelect={() => onRetake(mode)} className="flex-col items-start gap-0.5">
            <span className="font-medium">{t(`modes.${mode}.title`)}</span>
            <span className="text-xs text-muted-foreground">{t(`modes.${mode}.description`)}</span>
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
