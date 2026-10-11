"use client"

import * as React from "react"

import { useFieldControl } from "@/components/ui/field"
import { controlClassName } from "@/components/ui/input"
import { cn } from "@/lib/utils"

function Textarea({ className, ...props }: React.ComponentProps<"textarea">) {
  return (
    <textarea
      data-slot="textarea"
      className={cn(controlClassName, "block min-h-16 px-3 py-2 text-base leading-relaxed md:text-sm", className)}
      {...useFieldControl(props)}
    />
  )
}

export { Textarea }
