import { cn } from "@/lib/utils";
import { siteConfig } from "@/config/site";
import { ZocratisMark } from "./ZocratisMark";

interface BrandLogoProps {
  className?: string;
  markClassName?: string;
}

// Mark + name lockup; wrap it in a Link where it should navigate.
export const BrandLogo: React.FC<BrandLogoProps> = ({ className, markClassName }) => (
  <span className={cn("inline-flex items-center gap-2 font-semibold tracking-tight", className)}>
    <ZocratisMark className={cn("size-6 text-primary", markClassName)} />
    {siteConfig.name}
  </span>
);
