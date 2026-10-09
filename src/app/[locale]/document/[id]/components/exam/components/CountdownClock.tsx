import { useEffect, useState } from "react";
import { Clock } from "lucide-react";
import { useTranslations } from "next-intl";
import { formatDuration } from "@/app/[locale]/document/[id]/components/exam/lib/exam-timing";
import { cn } from "@/lib/utils";

// Thresholds that change the clock's look and are announced to screen readers.
const WARNING_SECONDS = 5 * 60;
const URGENT_SECONDS = 60;

export const CountdownClock = ({ secondsLeft }: { secondsLeft: number }) => {
  const t = useTranslations("exam.simulation");
  const [announcement, setAnnouncement] = useState("");
  const stage = secondsLeft <= URGENT_SECONDS ? "urgent" : secondsLeft <= WARNING_SECONDS ? "warning" : "calm";

  // Only stage changes are announced; a ticking live region would be noise.
  useEffect(() => {
    if (stage === "warning") setAnnouncement(t("warning", { minutes: WARNING_SECONDS / 60 }));
    if (stage === "urgent") setAnnouncement(t("urgent"));
  }, [stage, t]);

  return (
    <>
      <span
        className={cn(
          "flex items-center gap-1.5 rounded-full px-2.5 py-1 font-mono text-sm font-semibold tabular-nums transition-colors duration-200",
          stage === "calm" && "text-foreground",
          stage === "warning" && "bg-warning text-warning-foreground",
          stage === "urgent" && "bg-danger text-danger-foreground"
        )}
        aria-label={t("timeLeft", { time: formatDuration(secondsLeft) })}
        role="timer"
      >
        <Clock className="h-3.5 w-3.5" aria-hidden />
        {formatDuration(secondsLeft)}
      </span>
      <span className="sr-only" aria-live="assertive">
        {announcement}
      </span>
    </>
  );
};
