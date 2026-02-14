import { Button } from "@/components/ui/button";
import { Folder } from "lucide-react";
import { Topic } from "@/app/types";
import { cn } from "@/lib/utils";

interface TopicListProps {
  topics: Topic[];
  selectedTopic: Topic | null;
  handleTopicSelect: (topic: Topic) => void;
}

export const TopicList: React.FC<TopicListProps> = ({ topics, selectedTopic, handleTopicSelect }) => {
  return (
    <div className="space-y-2">
      {topics.map((topic) => {
        const isSelected = selectedTopic?.id === topic.id;
        return (
          <Button
            key={topic.id}
            variant={selectedTopic?.id === topic.id ? "default" : "ghost"}
            onClick={() => handleTopicSelect(topic)}
            className={cn(
              "w-full justify-start h-10  px-2 text-sm font-normal text-muted-foreground hover:text-foreground hover:bg-secondary/80",
              isSelected && "bg-secondary text-foreground font-medium"
            )}
          >
            <div
              className="mr-3 p-1.5 rounded-md"
              style={{ backgroundColor: topic.color || "#000000" }}
            >
              <Folder className="h-4 w-4 text-white" />
            </div>
            <div className="flex-1 text-left">
              <div className="font-medium">{topic.name}</div>
              <div className="text-xs text-muted-foreground">{topic.count} files</div>
            </div>
          </Button>
        )
      })}
    </div>
  );
};
