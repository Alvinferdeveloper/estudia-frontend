import { Check, Minus, X } from "lucide-react";
import { type ScoreTone, TONE_FILL } from "@/app/[locale]/document/[id]/components/exam/lib/exam-score";
import { cn } from "@/lib/utils";

const TONE_ICON: Record<ScoreTone, React.ElementType> = {
  success: Check,
  warning: Minus,
  danger: X,
};

// Graded state as a filled mark; the icon keeps it readable without color.
export const ToneMark = ({ tone, className }: { tone: ScoreTone; className?: string }) => {
  const Icon = TONE_ICON[tone];
  return (
    <span
      aria-hidden
      className={cn("flex h-5 w-5 shrink-0 items-center justify-center rounded-full", TONE_FILL[tone], className)}
    >
      <Icon className="h-3 w-3" strokeWidth={3} />
    </span>
  );
};
