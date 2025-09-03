import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { PlusCircle } from "lucide-react";

interface CreateTopicDialogProps {
  createTopic: (topic: { name: string; color: string }) => void;
}

export const CreateTopicDialog: React.FC<CreateTopicDialogProps> = ({ createTopic }) => {
  const [newTopicName, setNewTopicName] = useState("");
  const [newTopicColor, setNewTopicColor] = useState("#000000");
  const [isOpen, setIsOpen] = useState(false);

  const handleCreate = () => {
    if (!newTopicName.trim()) return;
    createTopic({ name: newTopicName, color: newTopicColor });
    setNewTopicName("");
    setNewTopicColor("#000000");
    setIsOpen(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button className="w-full">
          <PlusCircle className="mr-2 h-4 w-4" /> Create New Topic
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create New Topic</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="name" className="text-right">
              Name
            </Label>
            <Input
              id="name"
              value={newTopicName}
              onChange={(e) => setNewTopicName(e.target.value)}
              className="col-span-3"
              placeholder="e.g., Chemistry, Art History"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="color" className="text-right">
              Color
            </Label>
            <Input
              id="color"
              type="color"
              value={newTopicColor}
              onChange={(e) => setNewTopicColor(e.target.value)}
              className="col-span-3 h-10"
            />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => setIsOpen(false)}>
            Cancel
          </Button>
          <Button onClick={handleCreate}>Create</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
