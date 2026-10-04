import { Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import type { SocialProvider } from "../hooks/useSocialAuth";
import { FacebookIcon, GitHubIcon, GoogleIcon } from "./ProviderIcons";

interface SocialAuthButtonsProps {
  pendingProvider: SocialProvider | null;
  disabled: boolean;
  onSelect: (provider: SocialProvider) => void;
}

const SECONDARY_PROVIDERS = [
  { id: "github", label: "GitHub", Icon: GitHubIcon },
  { id: "facebook", label: "Facebook", Icon: FacebookIcon },
] as const;

const providerButtonClass =
  "press-feedback flex h-11 items-center justify-center gap-2.5 rounded-xl border border-border bg-background text-sm font-medium text-foreground transition-colors duration-150 hover:bg-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-60";

const ProviderIcon: React.FC<{ isPending: boolean; Icon: React.FC<React.ComponentProps<"svg">> }> = ({ isPending, Icon }) =>
  isPending ? <Loader2 className="size-4 animate-spin text-muted-foreground" /> : <Icon className="size-4" />;

// Google gets the full row: it's how most students sign in.
export const SocialAuthButtons: React.FC<SocialAuthButtonsProps> = ({ pendingProvider, disabled, onSelect }) => (
  <div className="flex flex-col gap-2">
    <button type="button" disabled={disabled} onClick={() => onSelect("google")} className={cn(providerButtonClass, "w-full")}>
      <ProviderIcon isPending={pendingProvider === "google"} Icon={GoogleIcon} />
      Continuar con Google
    </button>
    <div className="grid grid-cols-2 gap-2">
      {SECONDARY_PROVIDERS.map(({ id, label, Icon }) => (
        <button key={id} type="button" disabled={disabled} onClick={() => onSelect(id)} className={providerButtonClass}>
          <ProviderIcon isPending={pendingProvider === id} Icon={Icon} />
          {label}
        </button>
      ))}
    </div>
  </div>
);
