import { cn } from "@/lib/utils";

export const MascotCompanion = ({ state, isCorrect }: { state: 'idle' | 'submitting' | 'answered', isCorrect?: boolean }) => {
    let message = "¡Vamos, tú puedes con esto!";
    let expression = "🦉";
    let mascotAnimation = "hover:-translate-y-1.5 transition-transform duration-500 cursor-pointer";
    let bubbleColor = "border-border bg-card";
    let textColor = "text-foreground";

    if (state === 'submitting') {
        message = "Analizando tu respuesta... ¡No te me copies! 👀";
        expression = "🧐";
        mascotAnimation = "animate-pulse scale-95 opacity-80";
    } else if (state === 'answered') {
        if (isCorrect) {
            const positiveMsgs = ["¡Impresionante!", "¡Eso es correcto!", "¡Estás on fire! 🔥"];
            message = positiveMsgs[Math.floor(Math.random() * positiveMsgs.length)];
            expression = "🎉";
            mascotAnimation = "animate-bounce drop-shadow-[0_0_15px_rgba(16,185,129,0.3)]";
            bubbleColor = "border-emerald-500/20 bg-emerald-50/50 dark:bg-emerald-950/20";
            textColor = "text-emerald-700 dark:text-emerald-300";
        } else {
            const learningMsgs = ["¡Casi! Revisa la explicación.", "De los errores se aprende.", "¡A la próxima seguro aciertas!"];
            message = learningMsgs[Math.floor(Math.random() * learningMsgs.length)];
            expression = "💪";
            mascotAnimation = "animate-in shake-vertical duration-500 drop-shadow-[0_0_15px_rgba(245,158,11,0.2)]";
            bubbleColor = "border-amber-500/20 bg-amber-50/50 dark:bg-amber-950/20";
            textColor = "text-amber-700 dark:text-amber-300";
        }
    }

    return (
        <div className="flex items-end gap-5 mb-10 animate-in fade-in slide-in-from-bottom-6 duration-1000">
            <div className={cn(
                "relative w-16 h-16 bg-gradient-to-br from-primary/10 to-primary/5 rounded-[2rem] flex items-center justify-center border border-primary/20 shadow-xl flex-shrink-0",
                mascotAnimation
            )}>
                <span className="text-4xl select-none leading-none">{expression}</span>
                <div className="absolute inset-0 rounded-[2rem] bg-primary/5 -z-10 animate-pulse" />
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
