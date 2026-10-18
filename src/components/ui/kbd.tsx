import { cn } from "@/lib/utils"

// A keyboard shortcut hint inside a button or label.
function Kbd({ className, ...props }: React.ComponentProps<"kbd">) {
  return <kbd data-slot="kbd" className={cn("font-sans text-[10px] opacity-60", className)} {...props} />
}

export { Kbd }
