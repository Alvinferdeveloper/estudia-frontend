import { cn } from "@/lib/utils";

interface FlagImageProps {
  countryCode: string;
  label?: string;
  className?: string;
}

/** Single source of truth for rendering a flag image (flagcdn.com, no bundled assets). */
export const FlagImage: React.FC<FlagImageProps> = ({ countryCode, label, className }) => (
  // eslint-disable-next-line @next/next/no-img-element
  <img
    src={`https://flagcdn.com/${countryCode.toLowerCase()}.svg`}
    alt={label ?? countryCode}
    title={label ?? countryCode}
    className={cn("inline-block h-3 w-4 rounded-[2px] object-cover align-[-1px]", className)}
  />
);
