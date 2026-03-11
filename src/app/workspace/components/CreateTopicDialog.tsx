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
import { PlusCircle, Check, Palette } from "lucide-react";
import { cn } from "@/lib/utils";

interface CreateTopicDialogProps {
  createTopic: (topic: { name: string; color: string }) => void;
}

const PRESET_COLORS = [
  "#0ea5e9", // Sky
  "#8b5cf6", // Violet
  "#ec4899", // Pink
  "#f43f5e", // Rose
  "#f97316", // Orange
  "#eab308", // Yellow
  "#22c55e", // Green
  "#14b8a6", // Teal
  "#64748b", // Slate
  "#000000", // Black
];

export const CreateTopicDialog: React.FC<CreateTopicDialogProps> = ({ createTopic }) => {
  const [newTopicName, setNewTopicName] = useState("");
  const [selectedColor, setSelectedColor] = useState(PRESET_COLORS[0]);
  const [isOpen, setIsOpen] = useState(false);

  const handleCreate = () => {
    if (!newTopicName.trim()) return;
    createTopic({ name: newTopicName, color: selectedColor });
    resetForm();
    setIsOpen(false);
  };

  const resetForm = () => {
    setNewTopicName("");
    setSelectedColor(PRESET_COLORS[0]);
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => {
      setIsOpen(open);
      if (!open) resetForm();
    }}>
      <DialogTrigger asChild>
        <Button className="w-full shadow-sm cursor-pointer">
          <PlusCircle className="mr-2 h-4 w-4" /> Create New Topic
        </Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Create Collection</DialogTitle>
          <DialogDescription>
            Organize your documents by creating a new topic collection.
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-6 py-4">
          {/* Input Nombre */}
          <div className="space-y-2">
            <Label htmlFor="name" className="text-sm font-medium">
              Topic Name
            </Label>
            <Input
              id="name"
              value={newTopicName}
              onChange={(e) => setNewTopicName(e.target.value)}
              placeholder="e.g. Physics, Project Alpha..."
              className="col-span-3"
              autoFocus
            />
          </div>

          {/* Color Picker */}
          <div className="space-y-3">
            <Label className="text-sm font-medium flex items-center gap-2">
              Color Theme <span className="text-xs text-muted-foreground font-normal">(Pick a color)</span>
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
                  aria-label={`Select color ${color}`}
                >
                  {selectedColor === color && (
                    <Check className="h-4 w-4 text-white drop-shadow-md" strokeWidth={3} />
                  )}
                </button>
              ))}

              {/* Custom color input */}
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
            Cancel
          </Button>
          <Button
            onClick={handleCreate}
            disabled={!newTopicName.trim()}
            className="bg-primary rounded-sm h-8 cursor-pointer"
          >
            Create Collection
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};