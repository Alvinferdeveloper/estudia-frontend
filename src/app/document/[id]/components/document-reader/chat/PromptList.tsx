import { CornerDownRight } from "lucide-react";
import { cn } from "@/lib/utils";

interface PromptListProps {
  label: string;
  prompts: string[];
  onSelect: (prompt: string) => void;
  className?: string;
}

export const PromptList: React.FC<PromptListProps> = ({ label, prompts, onSelect, className }) => (
  <nav aria-label={label} className={className}>
    <ul className="flex flex-col">
      {prompts.map((prompt) => (
        <li key={prompt}>
          <button
            type="button"
            onClick={() => onSelect(prompt)}
            className={cn(
              "flex w-full items-start gap-2 rounded-lg px-2 py-1.5 text-left text-sm leading-snug text-muted-foreground",
              "transition-colors duration-150 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
              "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            )}
          >
            <CornerDownRight className="mt-0.5 size-3.5 shrink-0 opacity-60" />
            {prompt}
          </button>
        </li>
      ))}
    </ul>
  </nav>
);
