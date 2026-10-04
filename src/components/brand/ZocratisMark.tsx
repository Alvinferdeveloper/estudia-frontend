import { cn } from "@/lib/utils";

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
      <path d="M28.05 16.89 Q27.89 17.23 28.22 17.40 L33.02 19.93 Q33.35 20.11 33.54 19.78 L41.20 6.46 Q42.22 4.68 40.40 3.72 L37.42 2.15 Q35.60 1.19 34.70 3.04 Z" />
      <path d="M26.35 20.55 Q26.22 20.79 26.47 20.93 L31.10 23.37 Q31.35 23.50 31.48 23.25 L32.44 21.43 Q32.58 21.18 32.33 21.05 L27.69 18.61 Q27.44 18.48 27.31 18.72 Z" />
      <path d="M27.67 21.24 L30.16 22.55 L23.35 38.65 Q23.28 38.82 23.16 38.68 L19.54 34.23 Q19.36 34.01 19.52 33.77 Z" />
    </g>
    <path d="M4.57 36.08 H15.71 C18.71 36.08 22.42 41.54 24.00 43.75 C25.58 41.54 29.29 36.08 32.29 36.08 H43.43 V39.45 Q43.43 40.38 42.49 40.38 H32.85 C29.85 40.38 25.50 46.00 24.00 46.00 C22.50 46.00 18.15 40.38 15.15 40.38 H5.51 Q4.57 40.38 4.57 39.45 Z" />
  </svg>
);
