import { cn } from "@/lib/utils";

const COLORS = [
  { name: "Yellow", value: "#FFEB3B" },
  { name: "Green", value: "#A5D6A7" },
  { name: "Blue", value: "#90CAF9" },
  { name: "Pink", value: "#F48FB1" },
  { name: "Orange", value: "#FFCC80" },
  { name: "Purple", value: "#CE93D8" },
];

interface ColorPickerProps {
  selectedColor: string;
  onColorChange: (color: string) => void;
  size?: "sm" | "md";
}

export const NoteColorPicker: React.FC<ColorPickerProps> = ({
  selectedColor,
  onColorChange,
  size = "md",
}) => {
  const sizeClasses = size === "sm" ? "w-7" : "w-9";

  return (
    <div className="flex gap-2">
      {COLORS.map((color) => (
        <button
          key={color.value}
          type="button"
          onClick={() => onColorChange(color.value)}
          className={cn(
            "rounded-full border-2 transition-all hover:scale-110",
            sizeClasses,
            "h-7",
            selectedColor === color.value
              ? "border-primary ring-2 ring-primary/30"
              : "border-transparent hover:border-muted-foreground/30"
          )}
          style={{ backgroundColor: color.value }}
          title={color.name}
        />
      ))}
    </div>
  );
};