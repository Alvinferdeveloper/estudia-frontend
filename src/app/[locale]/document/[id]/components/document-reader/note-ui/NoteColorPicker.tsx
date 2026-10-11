import { useTranslations } from "next-intl";
import { cn } from "@/lib/utils";
import { NOTE_COLORS } from "@/app/[locale]/document/[id]/lib/note-colors";

interface NoteColorPickerProps {
  selectedColor: string;
  onColorChange: (color: string) => void;
  // The selection ring uses currentColor, so set a text color that contrasts with the surface.
  className?: string;
}

export const NoteColorPicker: React.FC<NoteColorPickerProps> = ({ selectedColor, onColorChange, className }) => {
  const t = useTranslations("notes");

  return (
    <div role="radiogroup" aria-label={t("colorPicker.label")} className={cn("flex items-center gap-1.5", className)}>
      {NOTE_COLORS.map(({ id, value }) => {
        const isSelected = selectedColor.toLowerCase() === value.toLowerCase();
        const name = t(`colors.${id}`);
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
              "press-feedback size-5 shrink-0 rounded-full ring-1 ring-inset ring-foreground/10 outline-2 outline-offset-2 transition-[outline-color] duration-150 focus-visible:outline-current",
              isSelected ? "outline-current" : "outline-transparent hover:outline-current/30"
            )}
          />
        );
      })}
    </div>
  );
};
