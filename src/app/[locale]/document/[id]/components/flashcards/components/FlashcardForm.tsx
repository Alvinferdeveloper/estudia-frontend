"use client";

import { useId, useRef, useState } from "react";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import { Field } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { ApiErrorMessage } from "@/components/api-error-message";
import { getApiErrorKey } from "@/lib/api-errors";
import { cn } from "@/lib/utils";
import type { FlashcardContent } from "@/app/[locale]/document/[id]/components/flashcards/hooks/useFlashcards";
import {
  FLASHCARD_BACK_MAX_LENGTH,
  FLASHCARD_FRONT_MAX_LENGTH,
} from "@/app/[locale]/document/[id]/components/flashcards/lib/flashcard-limits";

interface FlashcardFormProps {
  initial?: FlashcardContent;
  submitLabel: string;
  onSubmit: (card: FlashcardContent) => Promise<unknown>;
  onCancel: () => void;
  isPending: boolean;
  error: Error | null;
  // Creating clears the fields and stays open for the next card; editing closes on save.
  resetOnSubmit?: boolean;
  className?: string;
}

// Inline question/answer form, used both to create and to edit a card. Ctrl/Cmd+Enter saves, Escape cancels.
export const FlashcardForm: React.FC<FlashcardFormProps> = ({
  initial,
  submitLabel,
  onSubmit,
  onCancel,
  isPending,
  error,
  resetOnSubmit = false,
  className,
}) => {
  const t = useTranslations("flashcards.form");
  const tCommon = useTranslations("common.actions");
  const id = useId();
  const [front, setFront] = useState(initial?.front ?? "");
  const [back, setBack] = useState(initial?.back ?? "");
  const frontRef = useRef<HTMLInputElement>(null);
  const canSubmit = front.trim() !== "" && back.trim() !== "" && !isPending;

  const submit = async () => {
    if (!canSubmit) return;
    await onSubmit({ front: front.trim(), back: back.trim() });
    if (resetOnSubmit) {
      setFront("");
      setBack("");
      frontRef.current?.focus();
    }
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLFormElement>) => {
    if (event.key === "Enter" && (event.ctrlKey || event.metaKey)) {
      event.preventDefault();
      void submit().catch(() => undefined);
    } else if (event.key === "Escape") {
      event.preventDefault();
      onCancel();
    }
  };

  return (
    <form
      onSubmit={(event) => {
        event.preventDefault();
        void submit().catch(() => undefined);
      }}
      onKeyDown={handleKeyDown}
      // Lets a surrounding dialog leave Escape to the form.
      data-flashcard-form
      className={cn("flex flex-col gap-4 rounded-xl border border-border bg-card p-4", className)}
    >
      <Field id={`${id}-front`} label={t("front")}>
        <Input
          ref={frontRef}
          value={front}
          onChange={(event) => setFront(event.target.value)}
          placeholder={t("frontPlaceholder")}
          maxLength={FLASHCARD_FRONT_MAX_LENGTH}
          autoFocus
        />
      </Field>
      <Field id={`${id}-back`} label={t("back")} hint={t("backHint")}>
        <Textarea
          value={back}
          onChange={(event) => setBack(event.target.value)}
          placeholder={t("backPlaceholder")}
          maxLength={FLASHCARD_BACK_MAX_LENGTH}
          rows={3}
          className="resize-y"
        />
      </Field>

      {error && <ApiErrorMessage errorKey={getApiErrorKey(error)} />}

      <div className="flex items-center justify-end gap-2">
        <Button type="button" variant="ghost" size="sm" onClick={onCancel}>
          {tCommon("cancel")}
        </Button>
        <Button type="submit" size="sm" disabled={!canSubmit}>
          {submitLabel}
          <kbd className="font-sans text-[10px] opacity-60">Ctrl ↵</kbd>
        </Button>
      </div>
    </form>
  );
};
