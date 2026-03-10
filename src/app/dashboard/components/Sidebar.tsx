import React from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Search, LayoutGrid, Layers } from "lucide-react";
import { TopicList } from "@/app/dashboard/components/TopicList";
import { CreateTopicDialog } from "@/app/dashboard/components/CreateTopicDialog";
import { useFetchTopics } from "@/app/dashboard/hooks/useFetchTopics";
import { useCreateTopic } from "@/app/dashboard/hooks/useCreateTopic";
import { cn } from "@/lib/utils";
import { Topic } from "@/app/types";

interface SidebarProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  selectedTopic: Topic | null;
  handleTopicSelect: (topic: Topic | null) => void;
}

import { UserProfileMenu } from "@/components/user-profile-menu";

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
    <aside className="w-80 h-screen flex flex-col bg-background/50 border-r border-border/50 backdrop-blur supports-[backdrop-filter]:bg-secondary/50">
      {/* --- HEADER --- */}
      <div className="p-6 pb-4 space-y-6">
        {/* Branding & User Profile */}
        <div className="flex items-center justify-between px-1">
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 bg-primary rounded-lg flex items-center justify-center shadow-sm">
              <LayoutGrid className="text-primary-foreground h-5 w-5" />
            </div>
            <h2 className="text-xl font-bold tracking-tight text-foreground">StudyDocs</h2>
          </div>
          <UserProfileMenu />
        </div>

        {/* Search Input */}
        <div className="relative group bg-secondary">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground/70 h-4 w-4 group-focus-within:text-primary transition-colors" />
          <Input
            placeholder="Buscar documentos..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9 bg-secondary/50 border-transparent focus-visible:bg-background focus-visible:ring-1 transition-all"
          />
          <div className="absolute right-3 top-1/2 transform -translate-y-1/2 border rounded px-1.5 py-0.5 text-[10px] text-muted-foreground font-medium opacity-50">
            ⌘K
          </div>
        </div>
      </div>

      {/* --- NAVIGATION --- */}
      <div className="flex-1 overflow-hidden px-4">
        <ScrollArea className="h-full pr-2 custom-scrollbar space-y-6">

          {/* Main Menu */}
          <div>
            <h3 className="mb-2 px-2 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
              Biblioteca
            </h3>
            <Button
              variant={!selectedTopic ? "secondary" : "ghost"}
              onClick={() => handleTopicSelect(null)}
              className={cn(
                "w-full justify-between hover:bg-secondary h-10 font-normal transition-all hover:translate-x-1",
                !selectedTopic ? "bg-secondary text-secondary-foreground shadow-sm" : "text-muted-foreground hover:text-foreground"
              )}
            >
              <div className="flex items-center">
                <Layers className={cn("mr-2 h-4 w-4", !selectedTopic ? "text-primary" : "")} />
                <span>Todos los archivos</span>
              </div>
              <span className="bg-background/80 text-muted-foreground text-[10px] font-medium px-2 py-0.5 rounded-full border border-border/50 shadow-sm">
                {totalDocuments}
              </span>
            </Button>
          </div>

          <Separator className="bg-border/40" />

          {/* Topics Collection */}
          <div>
            <div className="flex items-center justify-between px-2 mb-2 mt-2">
              <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                Colecciones
              </h3>
            </div>

            <div className="space-y-1">
              <TopicList
                topics={topics || []}
                selectedTopic={selectedTopic}
                handleTopicSelect={handleTopicSelect}
              />
            </div>
          </div>
        </ScrollArea>
      </div>

      {/* --- FOOTER --- */}
      <div className="p-4 border-t border-border/50 bg-card/30 space-y-2">
        <CreateTopicDialog
          createTopic={createTopic}
        />
        <div className="text-center">
          <p className="text-[10px] text-muted-foreground">
            Presiona <kbd className="font-sans border rounded px-1">N</kbd> para crear
          </p>
        </div>
      </div>
    </aside>
  );
};