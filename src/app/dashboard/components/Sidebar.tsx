import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Search, FileText } from "lucide-react";
import { TopicList } from "./TopicList";
import { CreateTopicDialog } from "./CreateTopicDialog";
import { useFetchTopics } from "../hooks/useFetchTopics";
import { useCreateTopic } from "../hooks/useCreateTopic";

interface SidebarProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  selectedTopic: any;
  handleTopicSelect: (topic: any) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  searchQuery,
  setSearchQuery,
  selectedTopic,
  handleTopicSelect,
}) => {
  const { data: topics } = useFetchTopics();
  const { mutate: createTopic } = useCreateTopic();

  const totalDocuments = topics?.reduce((acc, topic) => acc + topic.count, 0) || 0;

  return (
    <aside className="w-80 bg-card shadow-lg border-r border-border flex flex-col">
      <div className="p-6 border-b border-border">
        <h2 className="text-2xl font-bold text-foreground mb-4">StudyDocs</h2>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
          <Input
            placeholder="Search documents..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
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
            <div className="text-xs text-muted-foreground">{totalDocuments} files</div>
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