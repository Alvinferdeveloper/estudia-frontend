"use client"

import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"

import { useFieldControl } from "@/components/ui/field"
import { cn } from "@/lib/utils"

// Shared by every text control (Input, Textarea) so they read as one family.
const controlClassName =
  "w-full min-w-0 rounded-md border border-input bg-card text-foreground outline-none transition-[border-color,box-shadow] duration-150 ease-[var(--ease-out)] placeholder:text-muted-foreground/70 selection:bg-primary selection:text-primary-foreground hover:border-foreground/20 focus-visible:border-primary focus-visible:ring-2 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 aria-invalid:border-destructive aria-invalid:ring-destructive/20"

const inputVariants = cva(controlClassName, {
  variants: {
    size: {
      // text-base below md keeps iOS from zooming into the field.
      default: "h-9 px-3 text-base md:text-sm",
      lg: "h-11 rounded-lg px-3.5 text-[15px]",
    },
  },
  defaultVariants: {
    size: "default",
  },
})

function Input({
  className,
  size,
  ...props
}: Omit<React.ComponentProps<"input">, "size"> & VariantProps<typeof inputVariants>) {
  return <input data-slot="input" className={cn(inputVariants({ size, className }))} {...useFieldControl(props)} />
}

export { Input, controlClassName }
