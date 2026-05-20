import { Button } from "./ui/button";

type Props = {
  palaceName: string;
  sourcePalaceName: string;
  score: number;
  takeaway: string;
  adjustment?: string;
  onJump: () => void;
  onDismiss: () => void;
};

/**
 * Presentation-only Assess banner. Surfaces a high-match past AAR's
 * takeaway with Jump-to-source and Dismiss actions. Used in two places:
 *   - Graph view (the new-problem-encounter surface)
 *   - Insights (the retrospective complement)
 * Both share the same shape so dismissing on one hides on the other.
 */
export function AssessBanner({
  palaceName,
  sourcePalaceName,
  score,
  takeaway,
  adjustment,
  onJump,
  onDismiss,
}: Props) {
  void palaceName; // currently unused in the rendered text but worth carrying for telemetry hooks later
  return (
    <section
      aria-label="You have seen this shape before"
      className="flex items-start justify-between gap-3 rounded-md border border-fuchsia-500/50 bg-fuchsia-900/30 p-3 text-sm text-fuchsia-100"
    >
      <div className="min-w-0">
        <div className="flex items-center gap-2 text-[11px] uppercase tracking-wide text-fuchsia-200">
          <span className="rounded bg-fuchsia-500/30 px-1.5 py-0.5 text-fuchsia-50">
            Assess · seen this shape before
          </span>
          <span className="text-fuchsia-300/80">
            {Math.round(score * 100)}% match · from {sourcePalaceName}
          </span>
        </div>
        <div className="mt-1 font-medium text-fuchsia-50">
          {takeaway || "(no takeaway — open the source palace)"}
        </div>
        {adjustment ? (
          <div className="mt-0.5 text-xs text-fuchsia-100/90">
            <span className="text-fuchsia-300">Next time:</span> {adjustment}
          </div>
        ) : null}
      </div>
      <div className="flex shrink-0 items-center gap-1">
        <Button size="sm" variant="secondary" type="button" onClick={onJump}>
          Jump to source
        </Button>
        <Button
          size="sm"
          variant="ghost"
          type="button"
          aria-label="Dismiss"
          onClick={onDismiss}
        >
          ×
        </Button>
      </div>
    </section>
  );
}
