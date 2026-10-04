import { cn } from "@/lib/utils";
import { MARK_BOOK_PATH, MARK_CHISEL_PATHS } from "./mark-paths";

interface ZocratisMarkProps extends React.ComponentProps<"svg"> {
  // Omit for decorative use; pass it when the mark stands alone and must be announced.
  title?: string;
  // The chisel taps on the book: Zocratis' "working" state while loading or writing.
  animated?: boolean;
}

export const ZocratisMark: React.FC<ZocratisMarkProps> = ({ title, animated = false, className, ...props }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 48 48"
    fill="currentColor"
    role={title ? "img" : undefined}
    aria-hidden={title ? undefined : true}
    className={cn("size-6 shrink-0", className)}
    {...props}
  >
    {title && <title>{title}</title>}
    <g className={animated ? "zocratis-carve" : undefined}>
      {MARK_CHISEL_PATHS.map((path) => (
        <path key={path} d={path} />
      ))}
    </g>
    <path d={MARK_BOOK_PATH} />
  </svg>
);
