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

interface RetakeMenuProps {
  onRetake: (mode: AttemptMode) => void;
  isPending: boolean;
  disabled?: boolean;
  // Primary where retaking is the screen's main action, quiet in lists.
  appearance: "primary" | "quiet";
}

const APPEARANCE = {
  primary: "h-9 bg-primary px-5 text-primary-foreground hover:bg-primary/90",
  quiet: "px-3 py-1.5 text-muted-foreground hover:bg-accent hover:text-foreground",
};

// Retakes an exam in either mode, so the same questions can be practiced and then simulated.
export const RetakeMenu: React.FC<RetakeMenuProps> = ({ onRetake, isPending, disabled, appearance }) => {
  const t = useTranslations("exam");

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button
          disabled={disabled || isPending}
          className={cn(
            "press-feedback flex shrink-0 items-center gap-1.5 rounded-full text-sm font-medium transition-colors duration-150 disabled:pointer-events-none disabled:opacity-50",
            APPEARANCE[appearance]
          )}
        >
          {isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : <RotateCcw className="h-4 w-4" />}
          {t("retake")}
          <ChevronDown className="h-3.5 w-3.5 opacity-70" aria-hidden />
        </button>
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
