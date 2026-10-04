"use client"

import { Separator } from "react-resizable-panels"

import { cn } from "@/lib/utils"

// react-resizable-panels exposes the drag state as data-separator="hover" | "active" | "focus".
function ResizeHandle({ className, ...props }: React.ComponentProps<typeof Separator>) {
  return (
    <Separator
      className={cn(
        "group relative w-px shrink-0 bg-border outline-none transition-colors duration-150",
        "data-[separator=hover]:bg-primary/40 data-[separator=active]:bg-primary data-[separator=focus]:bg-primary",
        className
      )}
      {...props}
    >
      <span
        aria-hidden
        className="absolute left-1/2 top-1/2 h-10 w-1.5 -translate-x-1/2 -translate-y-1/2 rounded-full border border-border bg-background opacity-0 shadow-sm transition-opacity duration-150 group-data-[separator=active]:border-primary group-data-[separator=active]:opacity-100 group-data-[separator=focus]:opacity-100 group-data-[separator=hover]:opacity-100"
      />
    </Separator>
  )
}

export { ResizeHandle }
