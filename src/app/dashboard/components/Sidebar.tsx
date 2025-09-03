import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { FileText } from "lucide-react";
import { TopicList } from "./TopicList";
import { CreateTopicDialog } from "./CreateTopicDialog";
import { useTopics } from "../hooks/useTopics";

interface SidebarProps {
  selectedTopic: any;
  handleTopicSelect: (topic: any) => void;
  documents: any[];
}

export const Sidebar: React.FC<SidebarProps> = ({
  selectedTopic,
  handleTopicSelect,
  documents
}) => {
  const { topics, isLoading, isError, createTopic } = useTopics();

  return (
    <aside className="w-80 bg-card shadow-lg border-r border-border flex flex-col">
      <div className="p-6 border-b border-border">
        <h2 className="text-2xl font-bold text-foreground mb-4">StudyDocs</h2>
      </div>

      <div className="p-6 flex-1 overflow-y-auto">
        <Button
          variant={!selectedTopic ? "default" : "ghost"}
          onClick={() => handleTopicSelect(null)}
          className="w-full justify-start mb-4 h-12"
        >
          <FileText className="mr-3 h-5 w-5" />
          <div className="flex-1 text-left">
            <div className="font-medium">All Documents</div>
            <div className="text-xs text-muted-foreground">{documents.length} files</div>
          </div>
        </Button>

        <Separator className="my-4" />

        <TopicList
          topics={topics || []}
          selectedTopic={selectedTopic}
          handleTopicSelect={handleTopicSelect}
        />
      </div>

      <div className="p-6 border-t border-border">
        <CreateTopicDialog createTopic={createTopic} />
      </div>
    </aside>
  );
};
