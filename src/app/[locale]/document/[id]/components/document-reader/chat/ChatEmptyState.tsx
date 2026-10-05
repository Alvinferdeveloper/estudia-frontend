import { useTranslations } from "next-intl";
import { ZocratisMark } from "@/components/brand/ZocratisMark";
import { PromptList } from "./PromptList";

const STARTER_PROMPT_KEYS = ["summarize", "explainConcepts", "quizMe"] as const;

export const ChatEmptyState: React.FC<{ onPromptSelect: (prompt: string) => void }> = ({ onPromptSelect }) => {
  const t = useTranslations("chat.emptyState");
  const starterPrompts = STARTER_PROMPT_KEYS.map((key) => t(`prompts.${key}`));

  return (
    <div className="my-auto flex flex-col gap-5 py-8">
      <div className="flex flex-col items-start gap-3">
        <ZocratisMark className="size-10 text-primary" />
        <h3 className="text-base font-semibold tracking-tight text-foreground text-balance">{t("title")}</h3>
        <p className="text-sm leading-relaxed text-muted-foreground text-pretty">{t("description")}</p>
      </div>
      <PromptList label={t("promptsLabel")} prompts={starterPrompts} onSelect={onPromptSelect} className="-mx-2" />
    </div>
  );
};
