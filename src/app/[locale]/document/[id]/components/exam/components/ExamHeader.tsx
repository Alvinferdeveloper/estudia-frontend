import React from "react";
import { X } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";

interface ExamHeaderProps {
  currentIndex: number;
  totalQuestions: number;
  onFinish: () => void;
}

export const ExamHeader: React.FC<ExamHeaderProps> = ({
  currentIndex,
  totalQuestions,
  onFinish,
}) => {
  const progress = (currentIndex / totalQuestions) * 100;

  return (
    <header className="sticky top-0 z-10 bg-background/90 backdrop-blur-md border-b border-border/40">
      <div className="w-full max-w-2xl mx-auto px-4 h-16 flex items-center gap-3">
        <Button
          variant="ghost"
          size="icon"
          className="press-feedback h-7 w-7 text-muted-foreground hover:text-foreground hover:bg-muted/50 rounded-full shrink-0"
          onClick={onFinish}
        >
          <X size={15} />
        </Button>

        <div className="flex-1 flex items-center">
          <Progress
            value={progress}
            className="h-4 rounded-full bg-muted/60 border-0"
          />
        </div>

        <span className="text-xs font-semibold text-muted-foreground tabular-nums w-11 text-right">
          {currentIndex + 1}<span className="text-muted-foreground/40"> / {totalQuestions}</span>
        </span>
      </div>
    </header>
  );
};
