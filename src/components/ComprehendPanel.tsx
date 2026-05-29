import { Check, Pencil } from "lucide-react";
import { NINE_DIVE } from "../domain/services/cast/nineDive";
import { Button } from "./ui/button";

type Props = {
  /** The crux has been understood — leave Comprehend mode. */
  onUnderstood: () => void;
  /** Understood and ready to author — return to Encode focused on the crux. */
  onEncodeThis: () => void;
};

/**
 * Runs Sloan's nine-dive questions on the crux, surface → deep
 * (content → process → premise), then offers the two exits that close the
 * comprehend loop: "I understand this" or "Encode this".
 */
export function ComprehendPanel({ onUnderstood, onEncodeThis }: Props) {
  return (
    <div className="mt-4 flex min-h-0 flex-1 flex-col">
      <div className="text-[11px] font-semibold uppercase tracking-[0.18em] text-zinc-500">Dive on it</div>
      <div className="mt-2 space-y-3">
        {NINE_DIVE.map((layer) => (
          <section
            key={layer.layer}
            className={
              layer.layer === "premise"
                ? "rounded-lg border border-amber-400/30 bg-amber-400/5 p-2.5"
                : "rounded-lg border border-zinc-800 bg-zinc-900/50 p-2.5"
            }
          >
            <div className="flex items-baseline gap-1.5">
              <span className="text-xs font-semibold text-zinc-200">{layer.label}</span>
              <span className="text-[11px] text-zinc-500">({layer.focus})</span>
              {layer.layer === "premise" ? (
                <span className="ml-auto text-[10px] font-medium text-amber-300/80">frame-shift</span>
              ) : null}
            </div>
            <ul className="mt-1.5 space-y-1">
              {layer.questions.map((q) => (
                <li key={q} className="text-xs leading-5 text-zinc-400">
                  {q}
                </li>
              ))}
            </ul>
          </section>
        ))}
      </div>

      <div className="mt-4 flex flex-col gap-2">
        <Button type="button" size="sm" variant="secondary" onClick={onUnderstood}>
          <Check className="h-4 w-4" />
          I understand this
        </Button>
        <Button type="button" size="sm" variant="outline" onClick={onEncodeThis}>
          <Pencil className="h-4 w-4" />
          Encode this
        </Button>
      </div>
    </div>
  );
}
