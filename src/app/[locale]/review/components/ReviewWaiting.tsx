"use client";

import { useNow, useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { Button } from "@/components/ui/button";

interface ReviewWaitingProps {
  until: number;
  back: { href: string; label: string };
}

const formatCountdown = (ms: number): string => {
  const seconds = Math.max(Math.ceil(ms / 1000), 0);
  return `${Math.floor(seconds / 60)}:${String(seconds % 60).padStart(2, "0")}`;
};

// The cards left are still in a learning step; the session continues on its own when the next one is due.
export const ReviewWaiting: React.FC<ReviewWaitingProps> = ({ until, back }) => {
  const t = useTranslations("review.waiting");
  const now = useNow({ updateInterval: 1000 });

  return (
    <div role="status" className="py-16">
      <p className="text-base font-medium text-foreground">
        {t("title")}{" "}
        <span className="font-mono tabular-nums">{formatCountdown(until - now.getTime())}</span>
      </p>
      <p className="mt-2 max-w-sm text-sm text-muted-foreground">{t("hint")}</p>
      <Button asChild variant="ghost" className="mt-6 -ml-3">
        <Link href={back.href}>{t("leave")}</Link>
      </Button>
    </div>
  );
};
