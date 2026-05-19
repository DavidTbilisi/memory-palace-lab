import * as React from "react";
import * as Dialog from "@radix-ui/react-dialog";
import {
  buildAARRecord,
  isAARFieldsFilled,
  type AARFields,
  type AARSignatureSnapshot,
} from "../domain/services/cast/aarRecords";
import { Button } from "./ui/button";
import { Label } from "./ui/label";

type Props = {
  open: boolean;
  onOpenChange: (o: boolean) => void;
  palaceId: string | null;
  palaceName: string;
  signature: AARSignatureSnapshot;
  onSave: (record: ReturnType<typeof buildAARRecord>) => void;
};

const EMPTY: AARFields = { intent: "", outcome: "", gap: "", adjustment: "", takeaway: "" };

export function CloseAARDialog({ open, onOpenChange, palaceId, palaceName, signature, onSave }: Props) {
  const [fields, setFields] = React.useState<AARFields>(EMPTY);

  const update = <K extends keyof AARFields>(key: K, value: string) =>
    setFields((current) => ({ ...current, [key]: value }));

  const reset = () => setFields(EMPTY);

  const handleSave = () => {
    if (!palaceId) return;
    if (!isAARFieldsFilled(fields)) return;
    const record = buildAARRecord({ palaceId, palaceName, signature, fields });
    onSave(record);
    reset();
    onOpenChange(false);
  };

  return (
    <Dialog.Root
      open={open}
      onOpenChange={(next) => {
        if (!next) reset();
        onOpenChange(next);
      }}
    >
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 z-50 bg-black/60" />
        <Dialog.Content className="fixed left-1/2 top-1/2 z-50 flex max-h-[90vh] w-[min(560px,94vw)] -translate-x-1/2 -translate-y-1/2 flex-col overflow-y-auto rounded-lg border border-zinc-700 bg-zinc-900 p-4 shadow-xl">
          <Dialog.Title className="text-lg font-semibold text-zinc-100">
            Close — After-Action Review
          </Dialog.Title>
          <Dialog.Description className="mt-1 text-sm text-zinc-400">
            ARC step 3. Four questions plus a one-line takeaway. The lab keeps this against the
            current graph shape so future Assess phases can recognize the same topology.
          </Dialog.Description>

          <div className="mt-3 grid gap-3">
            <div>
              <Label htmlFor="aar-intent">What did I intend?</Label>
              <textarea
                id="aar-intent"
                aria-label="AAR intent"
                className="mt-1 h-16 w-full resize-none rounded-md border border-zinc-700 bg-zinc-950 px-2 py-2 text-sm text-zinc-100"
                value={fields.intent}
                onChange={(e) => update("intent", e.target.value)}
              />
            </div>
            <div>
              <Label htmlFor="aar-outcome">What happened?</Label>
              <textarea
                id="aar-outcome"
                aria-label="AAR outcome"
                className="mt-1 h-16 w-full resize-none rounded-md border border-zinc-700 bg-zinc-950 px-2 py-2 text-sm text-zinc-100"
                value={fields.outcome}
                onChange={(e) => update("outcome", e.target.value)}
              />
            </div>
            <div>
              <Label htmlFor="aar-gap">Why the gap?</Label>
              <textarea
                id="aar-gap"
                aria-label="AAR gap"
                className="mt-1 h-16 w-full resize-none rounded-md border border-zinc-700 bg-zinc-950 px-2 py-2 text-sm text-zinc-100"
                value={fields.gap}
                onChange={(e) => update("gap", e.target.value)}
              />
            </div>
            <div>
              <Label htmlFor="aar-adjustment">What changes next time?</Label>
              <textarea
                id="aar-adjustment"
                aria-label="AAR adjustment"
                className="mt-1 h-16 w-full resize-none rounded-md border border-zinc-700 bg-zinc-950 px-2 py-2 text-sm text-zinc-100"
                value={fields.adjustment}
                onChange={(e) => update("adjustment", e.target.value)}
              />
            </div>
            <div>
              <Label htmlFor="aar-takeaway">One-line takeaway</Label>
              <input
                id="aar-takeaway"
                aria-label="AAR takeaway"
                className="mt-1 w-full rounded-md border border-zinc-700 bg-zinc-950 px-2 py-2 text-sm text-zinc-100"
                value={fields.takeaway}
                onChange={(e) => update("takeaway", e.target.value)}
                placeholder="e.g. CAP-style problems → solve invariant on hub before specializing per spoke."
              />
            </div>
          </div>

          <div className="mt-5 flex justify-end gap-2">
            <Button variant="secondary" type="button" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="button" onClick={handleSave} disabled={!palaceId || !isAARFieldsFilled(fields)}>
              Save AAR
            </Button>
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
