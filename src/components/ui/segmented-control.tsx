"use client";

import { useId, useRef, type KeyboardEvent, type ReactNode } from "react";
import { motion, useReducedMotion } from "motion/react";
import { Lock } from "lucide-react";
import { cn } from "@/lib/utils";

export interface SegmentedOption<T extends string | number> {
  value: T;
  label: ReactNode;
  disabled?: boolean;
}

interface SegmentedControlProps<T extends string | number> {
  value: T;
  onChange: (value: T) => void;
  options: SegmentedOption<T>[];
  className?: string;
  "aria-label"?: string;
  "aria-labelledby"?: string;
}

const THUMB_TRANSITION = { duration: 0.2, ease: [0.23, 1, 0.32, 1] } as const;

// Single choice among a few options: a track with a raised thumb that slides to the selection.
// Radio-group semantics: one tab stop, arrows move and select, Home/End jump to the ends.
export function SegmentedControl<T extends string | number>({
  value,
  onChange,
  options,
  className,
  ...labelProps
}: SegmentedControlProps<T>) {
  const thumbId = useId();
  const reduceMotion = useReducedMotion();
  const buttons = useRef<(HTMLButtonElement | null)[]>([]);

  const enabled = options.flatMap((option, index) => (option.disabled ? [] : [index]));
  const selectedIndex = options.findIndex((option) => option.value === value);
  const tabStop = enabled.includes(selectedIndex) ? selectedIndex : enabled[0];

  const select = (index: number) => {
    onChange(options[index].value);
    buttons.current[index]?.focus();
  };

  const handleKeyDown = (event: KeyboardEvent, index: number) => {
    const position = enabled.indexOf(index);
    const last = enabled.length - 1;
    const targets: Record<string, number | undefined> = {
      ArrowRight: enabled[Math.min(position + 1, last)],
      ArrowDown: enabled[Math.min(position + 1, last)],
      ArrowLeft: enabled[Math.max(position - 1, 0)],
      ArrowUp: enabled[Math.max(position - 1, 0)],
      Home: enabled[0],
      End: enabled[last],
    };
    const target = targets[event.key];
    if (target === undefined) return;
    event.preventDefault();
    select(target);
  };

  return (
    <div
      role="radiogroup"
      {...labelProps}
      className={cn("grid auto-cols-fr grid-flow-col gap-1 rounded-lg bg-muted p-1", className)}
    >
      {options.map((option, index) => {
        const isSelected = index === selectedIndex;
        return (
          <button
            key={String(option.value)}
            ref={(element) => {
              buttons.current[index] = element;
            }}
            type="button"
            role="radio"
            aria-checked={isSelected}
            disabled={option.disabled}
            tabIndex={index === tabStop ? 0 : -1}
            onClick={() => select(index)}
            onKeyDown={(event) => handleKeyDown(event, index)}
            className={cn(
              "relative flex h-8 items-center justify-center rounded-md px-3 text-sm font-medium tabular-nums outline-none transition-colors duration-150",
              "focus-visible:ring-2 focus-visible:ring-ring",
              isSelected ? "text-foreground" : "text-muted-foreground",
              option.disabled ? "cursor-not-allowed opacity-50" : !isSelected && "hover:text-foreground"
            )}
          >
            {isSelected && (
              <motion.span
                layoutId={thumbId}
                transition={reduceMotion ? { duration: 0 } : THUMB_TRANSITION}
                className="absolute inset-0 rounded-md bg-card shadow-lift dark:bg-accent"
              />
            )}
            <span className="relative flex items-center gap-1.5">
              {option.disabled && <Lock aria-hidden className="h-3 w-3" />}
              {option.label}
            </span>
          </button>
        );
      })}
    </div>
  );
}
