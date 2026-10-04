import { cn } from "@/lib/utils";

interface ChatIconButtonProps extends React.ComponentProps<"button"> {
  label: string;
}

export const ChatIconButton: React.FC<ChatIconButtonProps> = ({ label, className, children, ...props }) => (
  <button
    type="button"
    aria-label={label}
    title={label}
    className={cn(
      "press-feedback flex size-8 shrink-0 items-center justify-center rounded-lg text-muted-foreground transition-colors duration-150 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-40 [&_svg]:size-4",
      className
    )}
    {...props}
  >
    {children}
  </button>
);
