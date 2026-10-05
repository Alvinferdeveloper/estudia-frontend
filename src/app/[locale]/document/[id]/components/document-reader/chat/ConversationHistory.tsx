import { useMemo } from "react";
import { useTranslations } from "next-intl";
import { MessagesSquare } from "lucide-react";
import { Conversation } from "@/app/types";
import { groupConversationsByDate } from "@/app/[locale]/document/[id]/lib/conversation-groups";
import { ConversationItem } from "./ConversationItem";

interface ConversationHistoryProps {
  conversations: Conversation[];
  isLoading: boolean;
  activeConversationId: string | null;
  onSelect: (id: string) => void;
  onRename: (id: string, title: string) => Promise<unknown>;
  onDelete: (id: string) => Promise<void>;
}

const SKELETON_WIDTHS = ["w-4/5", "w-3/5", "w-2/3", "w-1/2"];

export const ConversationHistory: React.FC<ConversationHistoryProps> = ({
  conversations,
  isLoading,
  activeConversationId,
  onSelect,
  onRename,
  onDelete,
}) => {
  const t = useTranslations("chat.history");
  const groups = useMemo(() => groupConversationsByDate(conversations), [conversations]);

  if (isLoading) {
    return (
      <div aria-hidden className="flex animate-pulse flex-col gap-2 p-4 motion-reduce:animate-none">
        {SKELETON_WIDTHS.map((width) => (
          <div key={width} className={`h-8 rounded-lg bg-muted ${width}`} />
        ))}
      </div>
    );
  }

  if (conversations.length === 0) {
    return (
      <div className="flex flex-1 flex-col items-center justify-center gap-2 px-8 text-center">
        <MessagesSquare className="size-5 text-muted-foreground" />
        <p className="text-sm font-medium text-foreground">{t("emptyTitle")}</p>
        <p className="text-sm text-muted-foreground text-pretty">{t("emptyDescription")}</p>
      </div>
    );
  }

  return (
    <div className="min-h-0 flex-1 overflow-y-auto px-2 pb-4">
      {groups.map((group) => (
        <section key={group.key} aria-label={t(`groups.${group.key}`)}>
          <h3 className="px-3 pb-1 pt-4 text-xs font-medium text-muted-foreground">{t(`groups.${group.key}`)}</h3>
          <ul className="flex flex-col gap-0.5">
            {group.conversations.map((conversation) => (
              <ConversationItem
                key={conversation.id}
                conversation={conversation}
                isActive={conversation.id === activeConversationId}
                onSelect={() => onSelect(conversation.id)}
                onRename={(title) => onRename(conversation.id, title)}
                onDelete={() => onDelete(conversation.id)}
              />
            ))}
          </ul>
        </section>
      ))}
    </div>
  );
};
