import { ZocratisMark } from "@/components/brand/ZocratisMark";
import { PromptList } from "./PromptList";

const STARTER_PROMPTS = [
  "Resume las ideas principales",
  "Explícame los conceptos clave",
  "Hazme preguntas para repasar",
];

export const ChatEmptyState: React.FC<{ onPromptSelect: (prompt: string) => void }> = ({ onPromptSelect }) => (
  <div className="my-auto flex flex-col gap-5 py-8">
    <div className="flex flex-col items-start gap-3">
      <ZocratisMark className="size-10 text-primary" />
      <h3 className="text-base font-semibold tracking-tight text-foreground text-balance">
        ¿Qué quieres saber de este documento?
      </h3>
      <p className="text-sm leading-relaxed text-muted-foreground text-pretty">
        Pregunta lo que quieras, o selecciona un fragmento del PDF y pulsa Chat para preguntar sobre él.
      </p>
    </div>
    <PromptList label="Sugerencias para empezar" prompts={STARTER_PROMPTS} onSelect={onPromptSelect} className="-mx-2" />
  </div>
);
