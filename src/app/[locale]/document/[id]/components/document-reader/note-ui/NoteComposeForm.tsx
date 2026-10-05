import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { ZocratisMark } from "@/components/brand/ZocratisMark";
import { useAutoResizeTextarea } from "@/app/[locale]/document/[id]/hooks/useAutoResizeTextarea";
import { NoteColorPicker } from "./NoteColorPicker";
import { NoteError, NoteFooter, NoteScrollArea } from "./NoteLayout";

const QUICK_PROMPTS = [
  { label: "Resumir", prompt: "Resume este fragmento en pocas líneas." },
  { label: "Explicar en simple", prompt: "Explícalo con palabras simples, como a alguien que recién empieza." },
  { label: "Puntos clave", prompt: "Extrae los puntos clave en una lista." },
  { label: "Preguntas de repaso", prompt: "Crea preguntas de repaso con sus respuestas." },
];

interface NoteComposeFormProps {
  defaultPrompt: string;
  color: string;
  error: string | null;
  onColorChange: (color: string) => void;
  onSubmit: (prompt: string) => void;
  onCancel: () => void;
}

export const NoteComposeForm: React.FC<NoteComposeFormProps> = ({
  defaultPrompt,
  color,
  error,
  onColorChange,
  onSubmit,
  onCancel,
}) => {
  const [prompt, setPrompt] = useState(defaultPrompt);
  const textareaRef = useAutoResizeTextarea(prompt);
  const canSubmit = prompt.trim().length > 0;

  useEffect(() => {
    textareaRef.current?.focus();
  }, [textareaRef]);

  const submit = () => {
    if (canSubmit) onSubmit(prompt.trim());
  };

  const pickQuickPrompt = (quickPrompt: string) => {
    setPrompt(quickPrompt);
    textareaRef.current?.focus();
  };

  return (
    <>
      <NoteScrollArea>
        <label htmlFor="note-prompt" className="text-sm font-medium text-foreground">
          ¿Qué quieres que haga la IA con este fragmento?
        </label>
        <textarea
          id="note-prompt"
          ref={textareaRef}
          rows={3}
          value={prompt}
          onChange={(event) => setPrompt(event.target.value)}
          onKeyDown={(event) => {
            if (event.key === "Enter" && !event.shiftKey && !event.nativeEvent.isComposing) {
              event.preventDefault();
              submit();
            }
          }}
          placeholder="Por ejemplo: resúmelo en tres puntos y agrega un ejemplo"
          className="mt-2 block max-h-48 w-full resize-none rounded-xl border border-border bg-background px-3.5 py-3 text-[15px] leading-relaxed text-foreground outline-none transition-[border-color,box-shadow] duration-150 placeholder:text-muted-foreground focus:border-primary/50 focus:ring-2 focus:ring-ring"
        />

        <div role="group" aria-label="Pedidos rápidos" className="mt-3 flex flex-wrap gap-1.5">
          {QUICK_PROMPTS.map((quick) => (
            <button
              key={quick.label}
              type="button"
              aria-pressed={prompt === quick.prompt}
              onClick={() => pickQuickPrompt(quick.prompt)}
              className="press-feedback rounded-full border border-border px-3 py-1 text-sm text-muted-foreground transition-colors duration-150 hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring aria-pressed:border-primary/40 aria-pressed:bg-accent aria-pressed:text-foreground"
            >
              {quick.label}
            </button>
          ))}
        </div>

        <NoteError message={error} className="mt-3" />
      </NoteScrollArea>

      <NoteFooter className="flex items-center gap-3 px-6">
        <NoteColorPicker selectedColor={color} onColorChange={onColorChange} className="text-foreground" />
        <div className="ml-auto flex items-center gap-2">
          <Button variant="ghost" size="sm" onClick={onCancel}>
            Cancelar
          </Button>
          <Button size="sm" onClick={submit} disabled={!canSubmit} className="press-feedback">
            <ZocratisMark className="size-4" />
            Crear nota
          </Button>
        </div>
      </NoteFooter>
    </>
  );
};
