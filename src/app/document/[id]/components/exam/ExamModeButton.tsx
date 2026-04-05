import { FlaskConical } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ExamModeButtonProps {
  onClick: () => void;
  isActive?: boolean;
}

export const ExamModeButton: React.FC<ExamModeButtonProps> = ({ onClick, isActive }) => {
  return (
    <Button
      variant={isActive ? "default" : "outline"}
      size="sm"
      onClick={onClick}
      className={isActive ? "bg-accent" : ""}
    >
      <FlaskConical className="mr-2 h-4 w-4" />
      Exam Mode
    </Button>
  );
};
