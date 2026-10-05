import { useTranslations } from "next-intl";
import { getLanguageOption, LanguageCode } from "@/app/types";
import { FlagImage } from "./FlagImage";

interface LanguageFlagProps {
  code: LanguageCode;
  className?: string;
}

export const LanguageFlag: React.FC<LanguageFlagProps> = ({ code, className }) => {
  const t = useTranslations("vocabulary.languages");
  const option = getLanguageOption(code);
  if (!option) return null;

  return <FlagImage countryCode={option.countryCode} label={t(code)} className={className} />;
};
