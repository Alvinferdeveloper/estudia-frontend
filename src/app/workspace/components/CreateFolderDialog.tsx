import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
  DialogDescription
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { FolderPlus, Check, Palette } from "lucide-react";
import { cn } from "@/lib/utils";

interface CreateFolderDialogProps {
  createFolder: (folder: { name: string; color: string; topicId: string; parentId?: string }) => void;
  topicId: string;
  parentId?: string;
}

const PRESET_COLORS = [
  "#0ea5e9",
  "#8b5cf6",
  "#ec4899",
  "#f43f5e",
  "#f97316",
  "#eab308",
  "#22c55e",
  "#14b8a6",
  "#64748b",
  "#000000",
];

export const CreateFolderDialog: React.FC<CreateFolderDialogProps> = ({ 
  createFolder, 
  topicId,
  parentId 
}) => {
  const [newFolderName, setNewFolderName] = useState("");
  const [selectedColor, setSelectedColor] = useState(PRESET_COLORS[0]);
  const [isOpen, setIsOpen] = useState(false);

  const handleCreate = () => {
    if (!newFolderName.trim()) return;
    createFolder({ name: newFolderName, color: selectedColor, topicId, parentId });
    resetForm();
    setIsOpen(false);
  };

  const resetForm = () => {
    setNewFolderName("");
    setSelectedColor(PRESET_COLORS[0]);
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => {
      setIsOpen(open);
      if (!open) resetForm();
    }}>
      <DialogTrigger asChild>
        <Button variant="ghost" size="sm" className="w-full justify-start h-9 px-2 text-sm font-normal cursor-pointer text-muted-foreground hover:text-foreground hover:bg-background/50">
          <FolderPlus className="mr-2 h-4 w-4" />
          <span>Nueva Carpeta</span>
        </Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Crear Carpeta</DialogTitle>
          <DialogDescription>
            Crea una nueva carpeta para organizar tus documentos.
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-6 py-4">
          <div className="space-y-2">
            <Label htmlFor="folderName" className="text-sm font-medium">
              Nombre de la Carpeta
            </Label>
            <Input
              id="folderName"
              value={newFolderName}
              onChange={(e) => setNewFolderName(e.target.value)}
              placeholder="e.g. Apuntes, Exámenes..."
              className="col-span-3"
              autoFocus
            />
          </div>

          <div className="space-y-3">
            <Label className="text-sm font-medium flex items-center gap-2">
              Color <span className="text-xs text-muted-foreground font-normal">(Elige un color)</span>
            </Label>

            <div className="flex flex-wrap gap-3">
              {PRESET_COLORS.map((color) => (
                <button
                  key={color}
                  type="button"
                  onClick={() => setSelectedColor(color)}
                  className={cn(
                    "h-8 w-8 rounded-full cursor-pointer transition-all flex items-center justify-center border border-transparent focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
                    selectedColor === color ? "scale-110 shadow-md ring-2 ring-offset-2 ring-primary" : "hover:scale-105"
                  )}
                  style={{ backgroundColor: color }}
                >
                  {selectedColor === color && (
                    <Check className="h-4 w-4 text-white drop-shadow-md" strokeWidth={3} />
                  )}
                </button>
              ))}

              <div className="relative group">
                <div className={cn(
                  "h-8 w-8 rounded-full border border-input bg-background flex items-center justify-center cursor-pointer hover:bg-accent transition-colors",
                  !PRESET_COLORS.includes(selectedColor) && "ring-2 ring-offset-2 ring-primary border-transparent"
                )}>
                  <Palette className="h-4 w-4 text-muted-foreground" />
                </div>
                <Input
                  type="color"
                  value={selectedColor}
                  onChange={(e) => setSelectedColor(e.target.value)}
                  className="absolute inset-0 opacity-0 cursor-pointer w-full h-full p-0"
                />
              </div>
            </div>
          </div>
        </div>

        <DialogFooter className="gap-2 sm:gap-2">
          <Button variant="destructive" className="h-8 rounded-sm cursor-pointer" onClick={() => setIsOpen(false)}>
            Cancelar
          </Button>
          <Button
            onClick={handleCreate}
            disabled={!newFolderName.trim()}
            className="bg-primary rounded-sm h-8 cursor-pointer"
          >
            Crear Carpeta
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
