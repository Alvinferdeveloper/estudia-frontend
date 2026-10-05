import { Brain, Loader2, PartyPopper, Lightbulb } from "lucide-react";
import { useTranslations } from "next-intl";
import { cn } from "@/lib/utils";

const POSITIVE_KEYS = ["positive1", "positive2", "positive3"] as const;
const LEARNING_KEYS = ["learning1", "learning2", "learning3"] as const;

export const MascotCompanion = ({ state, isCorrect }: { state: 'idle' | 'submitting' | 'answered', isCorrect?: boolean }) => {
    const t = useTranslations("exam.mascot");
    let message = t("idle");
    let Icon = Brain;
    let spinIcon = false;
    let iconColor = "text-primary";
    let iconBg = "bg-primary/10";
    let bubbleColor = "border-border bg-card";
    let textColor = "text-foreground";

    if (state === 'submitting') {
        message = t("submitting");
        Icon = Loader2;
        spinIcon = true;
    } else if (state === 'answered') {
        if (isCorrect) {
            message = t(POSITIVE_KEYS[Math.floor(Math.random() * POSITIVE_KEYS.length)]);
            Icon = PartyPopper;
            iconColor = "text-emerald-600 dark:text-emerald-400";
            iconBg = "bg-emerald-500/10";
            bubbleColor = "border-emerald-500/20 bg-emerald-50/50 dark:bg-emerald-950/20";
            textColor = "text-emerald-700 dark:text-emerald-300";
        } else {
            message = t(LEARNING_KEYS[Math.floor(Math.random() * LEARNING_KEYS.length)]);
            Icon = Lightbulb;
            iconColor = "text-amber-600 dark:text-amber-400";
            iconBg = "bg-amber-500/10";
            bubbleColor = "border-amber-500/20 bg-amber-50/50 dark:bg-amber-950/20";
            textColor = "text-amber-700 dark:text-amber-300";
        }
    }

    return (
        <div className="flex items-end gap-5 mb-10 animate-in fade-in slide-in-from-bottom-6 duration-1000">
            <div className="relative w-16 h-16 bg-gradient-to-br from-primary/10 to-primary/5 rounded-[2rem] flex items-center justify-center border border-primary/20 shadow-xl flex-shrink-0">
                <div
                    key={`${state}-${isCorrect}`}
                    className={cn("flex h-9 w-9 items-center justify-center rounded-full animate-in zoom-in-50 duration-500", iconBg)}
                >
                    <Icon className={cn("h-5 w-5", iconColor, spinIcon && "animate-spin")} />
                </div>
            </div>

            <div className={cn(
                "relative border-2 p-3 rounded-[1.5rem] rounded-bl-none shadow-lg max-w-sm transition-all duration-500",
                bubbleColor
            )}>
                <p className={cn("text-base font-bold leading-relaxed tracking-tight", textColor)}>
                    {message}
                </p>
            </div>
        </div>
    );
};
