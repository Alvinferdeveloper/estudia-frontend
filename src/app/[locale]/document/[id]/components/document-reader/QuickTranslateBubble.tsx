import { motion } from "motion/react";
import { Languages } from "lucide-react";

interface QuickTranslateBubbleProps {
  translation: string | null;
  isLoading: boolean;
}

export const QuickTranslateBubble: React.FC<QuickTranslateBubbleProps> = ({
  translation,
  isLoading,
}) => {
  if (!isLoading && !translation) return null;

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9, y: 4 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      transition={{ type: "spring", stiffness: 400, damping: 40 }}
      className="flex max-w-xs items-center gap-1.5 rounded-full border border-border/60 bg-card/95 px-3 py-1.5 shadow-float backdrop-blur-md"
      onMouseDown={(e) => e.preventDefault()}
    >
      <Languages className="h-3.5 w-3.5 shrink-0 text-muted-foreground" />
      {isLoading ? (
        <span className="flex items-center gap-1 py-0.5">
          <span className="h-1.5 w-1.5 rounded-full bg-muted-foreground/50 animate-pulse-soft" />
          <span className="h-1.5 w-1.5 rounded-full bg-muted-foreground/50 animate-pulse-soft [animation-delay:0.2s]" />
          <span className="h-1.5 w-1.5 rounded-full bg-muted-foreground/50 animate-pulse-soft [animation-delay:0.4s]" />
        </span>
      ) : (
        <span className="whitespace-pre-wrap break-words text-sm text-foreground">
          {translation}
        </span>
      )}
    </motion.div>
  );
};
