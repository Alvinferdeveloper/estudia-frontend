import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import { ZocratisMark } from "@/components/brand/ZocratisMark";
import { useAutoResizeTextarea } from "@/app/[locale]/document/[id]/hooks/useAutoResizeTextarea";
import type { NoteSessionError } from "@/app/[locale]/document/[id]/hooks/useNoteSession";
import { NoteColorPicker } from "./NoteColorPicker";
import { NoteError, NoteFooter, NoteScrollArea } from "./NoteLayout";

const QUICK_PROMPTS = ["summarize", "simplify", "keyPoints", "reviewQuestions"] as const;

interface NoteComposeFormProps {
  defaultPrompt: string;
  color: string;
  error: NoteSessionError | null;
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
  const t = useTranslations("notes.compose");
  const tCommon = useTranslations("common");
  const [prompt, setPrompt] = useState(defaultPrompt);
  const textareaRef = useAutoResizeTextarea(prompt);
  const canSubmit = prompt.trim().length > 0;

  useEffect(() => {
    textareaRef.current?.focus();
  }, [textareaRef]);

  const quickPrompts = QUICK_PROMPTS.map((id) => ({
    id,
    label: t(`quickPrompts.${id}.label`),
    prompt: t(`quickPrompts.${id}.prompt`),
  }));

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
          {t("label")}
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
          placeholder={t("placeholder")}
          className="mt-2 block max-h-48 w-full resize-none rounded-xl border border-border bg-background px-3.5 py-3 text-[15px] leading-relaxed text-foreground outline-none transition-[border-color,box-shadow] duration-150 placeholder:text-muted-foreground focus:border-primary/50 focus:ring-2 focus:ring-ring"
        />

        <div role="group" aria-label={t("quickPromptsLabel")} className="mt-3 flex flex-wrap gap-1.5">
          {quickPrompts.map((quick) => (
            <Button
              key={quick.id}
              type="button"
              variant="outline"
              size="sm"
              aria-pressed={prompt === quick.prompt}
              onClick={() => pickQuickPrompt(quick.prompt)}
              className="h-7 font-normal text-muted-foreground aria-pressed:border-primary/40 aria-pressed:bg-accent aria-pressed:text-foreground"
            >
              {quick.label}
            </Button>
          ))}
        </div>

        <NoteError error={error} className="mt-3" />
      </NoteScrollArea>

      <NoteFooter className="flex items-center gap-3 px-6">
        <NoteColorPicker selectedColor={color} onColorChange={onColorChange} className="text-foreground" />
        <div className="ml-auto flex items-center gap-2">
          <Button variant="ghost" size="sm" onClick={onCancel}>
            {tCommon("actions.cancel")}
          </Button>
          <Button size="sm" onClick={submit} disabled={!canSubmit}>
            <ZocratisMark className="size-4" />
            {t("submit")}
          </Button>
        </div>
      </NoteFooter>
    </>
  );
};
