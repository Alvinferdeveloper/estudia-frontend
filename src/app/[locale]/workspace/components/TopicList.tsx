import { useTranslations } from "next-intl";
import Folder from "@/app/icons/Folder";
import { Topic } from "@/app/types";
import { cn } from "@/lib/utils";

interface TopicListProps {
  topics: Topic[];
  selectedTopic: Topic | null;
  handleTopicSelect: (topic: Topic) => void;
}

export const TopicList: React.FC<TopicListProps> = ({ topics, selectedTopic, handleTopicSelect }) => {
  const t = useTranslations("workspace");
  return (
    <div className="space-y-0.5">
      {topics.map((topic) => {
        const isSelected = selectedTopic?.id === topic.id;
        return (
          <button
            key={topic.id}
            onClick={() => handleTopicSelect(topic)}
            aria-current={isSelected ? "page" : undefined}
            className={cn(
              "press-feedback flex w-full items-center gap-3 rounded-md px-2 py-1.5 text-left text-sm",
              isSelected ? "bg-primary/10 text-primary" : "text-muted-foreground hover:bg-accent hover:text-foreground"
            )}
          >
            <Folder size="lg" color={topic.color} />
            <div className="min-w-0 flex-1">
              <div className="truncate font-medium">{topic.name}</div>
              <div className="text-xs text-muted-foreground">{t("items.fileCount", { count: topic.count })}</div>
            </div>
          </button>
        )
      })}
    </div>
  );
};
