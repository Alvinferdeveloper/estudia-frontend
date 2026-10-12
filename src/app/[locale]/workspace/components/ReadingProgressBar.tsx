import { useTranslations } from "next-intl";
import { cn } from "@/lib/utils";

interface ReadingProgressBarProps {
  ratio: number;
  className?: string;
}

export const ReadingProgressBar: React.FC<ReadingProgressBarProps> = ({ ratio, className }) => {
  const t = useTranslations("workspace.progress");
  const percent = Math.round(ratio * 100);

  return (
    <div
      role="progressbar"
      aria-valuemin={0}
      aria-valuemax={100}
      aria-valuenow={percent}
      aria-label={t("label", { ratio })}
      className={cn("h-1 overflow-hidden rounded-full bg-border", className)}
    >
      <div className="h-full rounded-full bg-primary" style={{ width: `${percent}%` }} />
    </div>
  );
};
