import { useTranslations } from "next-intl";
import { parseChatMessage } from "@/app/[locale]/document/[id]/lib/chat-message";
import { TextQuote } from "@/app/[locale]/document/[id]/components/document-reader/shared/TextQuote";

export const UserMessage: React.FC<{ text: string }> = ({ text }) => {
  const t = useTranslations("chat");
  const { context, question } = parseChatMessage(text);

  return (
    <div className="flex justify-end">
      <div className="max-w-[85%] rounded-2xl rounded-br-md bg-secondary px-3.5 py-2.5 text-[15px] leading-relaxed text-secondary-foreground">
        {context && (
          <TextQuote
            text={context.text}
            caption={t("pageCaption", { page: context.page })}
            className="mb-2 bg-background/70"
          />
        )}
        <p className="whitespace-pre-wrap break-words">{question}</p>
      </div>
    </div>
  );
};
