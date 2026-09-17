import { cn } from "@/lib/utils";
import { LanguageCode, SUPPORTED_LANGUAGES } from "@/app/types";

interface LanguageFlagProps {
  code: LanguageCode;
  className?: string;
}

export const LanguageFlag: React.FC<LanguageFlagProps> = ({ code, className }) => {
  const option = SUPPORTED_LANGUAGES.find((l) => l.code === code);
  if (!option) return null;

  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={`https://flagcdn.com/${option.countryCode.toLowerCase()}.svg`}
      alt={option.label}
      title={option.label}
      className={cn("inline-block h-3 w-4 rounded-[2px] object-cover align-[-1px]", className)}
    />
  );
};
