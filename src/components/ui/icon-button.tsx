import { Button } from "@/components/ui/button"

interface IconButtonProps extends React.ComponentProps<typeof Button> {
  label: string
}

// Icon-only button: the label doubles as tooltip and accessible name.
function IconButton({ label, variant = "ghost", size = "icon", ...props }: IconButtonProps) {
  return <Button type="button" aria-label={label} title={label} variant={variant} size={size} {...props} />
}

export { IconButton }
