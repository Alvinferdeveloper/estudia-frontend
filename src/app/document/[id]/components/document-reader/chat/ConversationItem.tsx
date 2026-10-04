import { useRef, useState } from "react";
import { Ellipsis, Pencil, Trash2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { Conversation } from "@/app/types";
import { ConfirmDialog } from "@/components/confirm-dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ChatIconButton } from "./ChatIconButton";

interface ConversationItemProps {
  conversation: Conversation;
  isActive: boolean;
  onSelect: () => void;
  onRename: (title: string) => Promise<unknown>;
  onDelete: () => Promise<void>;
}

export const ConversationItem: React.FC<ConversationItemProps> = ({
  conversation,
  isActive,
  onSelect,
  onRename,
  onDelete,
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [draftTitle, setDraftTitle] = useState(conversation.title);
  const [isConfirmingDelete, setIsConfirmingDelete] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  // The menu returns focus to its trigger on close, which would blur (and commit) the rename input right away.
  const keepFocusOnClose = useRef(false);

  const startRename = () => {
    keepFocusOnClose.current = true;
    setDraftTitle(conversation.title);
    setIsEditing(true);
  };

  const commitRename = () => {
    const title = draftTitle.trim();
    setIsEditing(false);
    if (title && title !== conversation.title) onRename(title);
  };

  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      await onDelete();
      setIsConfirmingDelete(false);
    } finally {
      setIsDeleting(false);
    }
  };

  if (isEditing) {
    return (
      <li>
        <input
          autoFocus
          value={draftTitle}
          onChange={(event) => setDraftTitle(event.target.value)}
          onBlur={commitRename}
          onKeyDown={(event) => {
            if (event.key === "Enter") commitRename();
            if (event.key === "Escape") setIsEditing(false);
          }}
          aria-label="Nombre de la conversación"
          className="w-full rounded-lg border border-primary/50 bg-background px-3 py-1.5 text-sm text-foreground outline-none ring-2 ring-ring"
        />
      </li>
    );
  }

  return (
    <li className="group relative">
      <button
        type="button"
        onClick={onSelect}
        aria-current={isActive ? "true" : undefined}
        className={cn(
          "flex w-full rounded-lg py-2 pl-3 pr-10 text-left text-sm transition-colors duration-150",
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
          isActive
            ? "bg-sidebar-accent font-medium text-sidebar-accent-foreground"
            : "text-sidebar-foreground/80 hover:bg-sidebar-accent/60 hover:text-sidebar-foreground"
        )}
      >
        <span className="truncate">{conversation.title}</span>
      </button>

      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <ChatIconButton
            label="Opciones de la conversación"
            className="absolute inset-y-0 right-1 my-auto size-7 opacity-0 group-hover:opacity-100 focus-visible:opacity-100 data-[state=open]:opacity-100 [@media(hover:none)]:opacity-100"
          >
            <Ellipsis />
          </ChatIconButton>
        </DropdownMenuTrigger>
        <DropdownMenuContent
          align="end"
          className="w-40"
          onCloseAutoFocus={(event) => {
            if (keepFocusOnClose.current) event.preventDefault();
            keepFocusOnClose.current = false;
          }}
        >
          <DropdownMenuItem onSelect={startRename}>
            <Pencil />
            Renombrar
          </DropdownMenuItem>
          <DropdownMenuItem variant="destructive" onSelect={() => setIsConfirmingDelete(true)}>
            <Trash2 />
            Eliminar
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <ConfirmDialog
        isOpen={isConfirmingDelete}
        onOpenChange={setIsConfirmingDelete}
        onConfirm={handleDelete}
        title="¿Eliminar esta conversación?"
        description="Se eliminarán todos sus mensajes. Esta acción no se puede deshacer."
        confirmText="Eliminar"
        variant="destructive"
        isLoading={isDeleting}
      />
    </li>
  );
};
