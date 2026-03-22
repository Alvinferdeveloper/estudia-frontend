import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { FileText, Sparkles } from "lucide-react";
import { NoteColorPicker } from "./NoteColorPicker";

interface NoteFormProps {
  selectedText: string;
  prompt: string;
  onPromptChange: (prompt: string) => void;
  selectedColor: string;
  onColorChange: (color: string) => void;
  error?: string;
}

export const NoteForm: React.FC<NoteFormProps> = ({
  selectedText,
  prompt,
  onPromptChange,
  selectedColor,
  onColorChange,
  error,
}) => {
  return (
    <div className="flex-1 overflow-y-auto p-6 space-y-6">
      <div>
        <Label className="flex items-center gap-2 text-sm font-medium mb-2">
          <FileText className="w-4 h-4 text-muted-foreground" />
          Selected Text
        </Label>
        <div className="p-4 bg-muted/50 rounded-lg border">
          <p className="text-sm leading-relaxed whitespace-pre-wrap max-h-32 overflow-y-auto">
            {selectedText.length > 300
              ? selectedText.substring(0, 300) + "..."
              : selectedText}
          </p>
        </div>
      </div>

      <div>
        <Label htmlFor="prompt-input" className="flex items-center gap-2 text-sm font-medium mb-2">
          <Sparkles className="w-4 h-4 text-purple-500" />
          What would you like the AI to do?
        </Label>
        <Textarea
          id="prompt-input"
          placeholder="e.g., Summarize this, Explain this in simple terms, Create a quiz question..."
          value={prompt}
          onChange={(e) => onPromptChange(e.target.value)}
          className="min-h-[100px]"
          rows={4}
        />
      </div>

      <div>
        <Label className="text-sm font-medium mb-2 block">Highlight Color</Label>
        <NoteColorPicker
          selectedColor={selectedColor}
          onColorChange={onColorChange}
          size="md"
        />
      </div>

      {error && <p className="text-sm text-red-500">{error}</p>}
    </div>
  );
};