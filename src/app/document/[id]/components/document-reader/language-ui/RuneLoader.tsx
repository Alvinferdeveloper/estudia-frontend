interface RuneLoaderProps {
  label?: string;
}

const SPARKLE_POSITIONS = [
  { top: "-6%", left: "50%" },
  { top: "50%", left: "104%" },
  { top: "104%", left: "50%" },
  { top: "50%", left: "-6%" },
];

export const RuneLoader: React.FC<RuneLoaderProps> = ({
  label = "Conjurando significado…",
}) => {
  return (
    <div className="flex flex-col items-center gap-4 py-2">
      <div className="relative h-16 w-16">
        <div className="absolute inset-0 rounded-full border-2 border-dashed border-violet-400/50 animate-rune-spin" />
        <div className="absolute inset-2 rounded-full border-2 border-dotted border-fuchsia-300/60 animate-rune-spin-reverse" />
        <div className="absolute inset-[22px] rounded-full bg-violet-400/80 blur-[2px] animate-arcane-glow" />
        {SPARKLE_POSITIONS.map((pos, i) => (
          <span
            key={i}
            className="absolute h-1 w-1 -translate-x-1/2 -translate-y-1/2 rounded-full bg-fuchsia-300 animate-sparkle"
            style={{ top: pos.top, left: pos.left, animationDelay: `${i * 0.3}s` }}
          />
        ))}
      </div>
      <p className="text-xs font-medium tracking-wide text-violet-200/70">{label}</p>
    </div>
  );
};
