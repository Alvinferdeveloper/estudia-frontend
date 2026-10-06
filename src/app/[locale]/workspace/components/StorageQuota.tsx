"use client";

import type { LucideIcon } from "lucide-react";
import { FolderOpen, HardDrive } from "lucide-react";
import { useFormatter, useTranslations } from "next-intl";
import { useUsage } from "@/app/[locale]/subscription/hooks/useSubscription";
import { UNLIMITED } from "@/app/[locale]/subscription/lib/entitlements";
import { isQuotaFull } from "@/app/[locale]/subscription/lib/usage";
import { UpgradePlanLink } from "@/components/upgrade-plan-link";
import { formatBytes } from "@/lib/format";
import { cn } from "@/lib/utils";

const QuotaLine = ({ icon: Icon, label, full }: { icon: LucideIcon; label: string; full: boolean }) => (
  <p className={cn("flex items-center gap-2 tabular-nums", full && "text-destructive")}>
    <Icon className="h-3.5 w-3.5 shrink-0" />
    {label}
  </p>
);

// What the user stores against their plan's quotas, so the limit is visible before an upload fails.
export const StorageQuota = () => {
  const t = useTranslations("workspace.sidebar");
  const format = useFormatter();
  const { data: usage } = useUsage();
  if (!usage) return null;

  const { documents, storageBytes } = usage.quotas;
  const storageUsed = formatBytes(format, storageBytes.used);
  const isAnyFull = isQuotaFull(documents) || isQuotaFull(storageBytes);

  return (
    <div className="space-y-1.5 border-t border-border/60 px-5 py-4 text-xs text-muted-foreground">
      <QuotaLine
        icon={FolderOpen}
        full={isQuotaFull(documents)}
        label={
          documents.limit === UNLIMITED
            ? t("documentsUnlimited", { used: documents.used })
            : t("documentsQuota", { used: documents.used, limit: documents.limit })
        }
      />
      <QuotaLine
        icon={HardDrive}
        full={isQuotaFull(storageBytes)}
        label={
          storageBytes.limit === UNLIMITED
            ? t("storageUnlimited", { used: storageUsed })
            : t("storageQuota", { used: storageUsed, limit: formatBytes(format, storageBytes.limit) })
        }
      />
      {isAnyFull && <UpgradePlanLink className="inline-block pt-0.5" />}
    </div>
  );
};
