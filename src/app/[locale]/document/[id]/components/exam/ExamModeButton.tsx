import { FlaskConical } from "lucide-react";
import { cn } from "@/lib/utils";

interface ExamModeButtonProps {
  onClick: () => void;
  isActive?: boolean;
}

export const ExamModeButton: React.FC<ExamModeButtonProps> = ({ onClick, isActive }) => {
  return (
    <button
      onClick={onClick}
      title="Exam mode"
      className={cn(
        "press-feedback flex h-8 w-8 items-center justify-center rounded-full transition-colors duration-150",
        isActive
          ? "bg-primary/10 text-primary"
          : "text-muted-foreground hover:bg-accent hover:text-foreground"
      )}
    >
      <FlaskConical className="h-4 w-4" />
    </button>
  );
};
