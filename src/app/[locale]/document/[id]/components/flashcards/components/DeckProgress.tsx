interface DeckProgressProps {
  // How far through the session, from 0 to 1.
  value: number;
  label: string;
  // Navigation or other controls on the right.
  children?: React.ReactNode;
}

export const DeckProgress: React.FC<DeckProgressProps> = ({ value, label, children }) => (
  <div>
    <div className="flex min-h-7 items-center justify-between gap-3">
      <p className="font-mono text-xs font-semibold tabular-nums text-muted-foreground">{label}</p>
      {children}
    </div>
    <div aria-hidden className="mt-2 h-0.5 overflow-hidden rounded-full bg-muted">
      <div
        className="h-full origin-left bg-primary transition-transform duration-200 ease-[var(--ease-out)]"
        style={{ transform: `scaleX(${value})` }}
      />
    </div>
  </div>
);
