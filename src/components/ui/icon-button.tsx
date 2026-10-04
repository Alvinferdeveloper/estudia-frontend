import { cn } from "@/lib/utils"

interface IconButtonProps extends React.ComponentProps<"button"> {
  label: string
}

// Icon-only button: the label doubles as tooltip and accessible name.
function IconButton({ label, className, children, ...props }: IconButtonProps) {
  return (
    <button
      type="button"
      aria-label={label}
      title={label}
      className={cn(
        "press-feedback flex size-8 shrink-0 items-center justify-center rounded-lg text-muted-foreground transition-colors duration-150 hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-40 [&_svg]:size-4",
        className
      )}
      {...props}
    >
      {children}
    </button>
  )
}

export { IconButton }
