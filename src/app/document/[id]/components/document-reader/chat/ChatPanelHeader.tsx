interface ChatPanelHeaderProps {
  leading: React.ReactNode;
  title: string;
  actions: React.ReactNode;
}

export const ChatPanelHeader: React.FC<ChatPanelHeaderProps> = ({ leading, title, actions }) => (
  <header className="flex h-14 shrink-0 items-center gap-1 border-b border-sidebar-border px-2">
    {leading}
    <h2 className="min-w-0 flex-1 truncate px-1.5 text-sm font-medium text-sidebar-foreground">{title}</h2>
    <div className="flex items-center gap-0.5">{actions}</div>
  </header>
);
