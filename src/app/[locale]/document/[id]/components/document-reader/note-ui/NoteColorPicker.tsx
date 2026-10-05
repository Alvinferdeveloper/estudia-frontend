import { cn } from "@/lib/utils";
import { NOTE_COLORS } from "@/app/[locale]/document/[id]/lib/note-colors";

interface NoteColorPickerProps {
  selectedColor: string;
  onColorChange: (color: string) => void;
  // The selection ring uses currentColor, so set a text color that contrasts with the surface.
  className?: string;
}

export const NoteColorPicker: React.FC<NoteColorPickerProps> = ({ selectedColor, onColorChange, className }) => (
  <div role="radiogroup" aria-label="Color del resaltado" className={cn("flex items-center gap-1.5", className)}>
    {NOTE_COLORS.map(({ name, value }) => {
      const isSelected = selectedColor.toLowerCase() === value.toLowerCase();
      return (
        <button
          key={value}
          type="button"
          role="radio"
          aria-checked={isSelected}
          aria-label={name}
          title={name}
          onClick={() => onColorChange(value)}
          style={{ backgroundColor: value }}
          className={cn(
            "press-feedback size-5 shrink-0 rounded-full shadow-[inset_0_0_0_1px_rgb(0_0_0/0.12)] outline-2 outline-offset-2 transition-[outline-color] duration-150 focus-visible:outline-current",
            isSelected ? "outline-current" : "outline-transparent hover:outline-current/30"
          )}
        />
      );
    })}
  </div>
);
