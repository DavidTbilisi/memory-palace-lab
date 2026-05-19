import * as React from "react";
import * as Dialog from "@radix-ui/react-dialog";
import type { AARRecord } from "../domain/services/cast/aarRecords";
import { Button } from "./ui/button";

type Props = {
  record: AARRecord | null;
  open: boolean;
  onOpenChange: (o: boolean) => void;
  onDelete: (id: string) => void;
};

export function ViewAARDialog({ record, open, onOpenChange, onDelete }: Props) {
  const [confirmingDelete, setConfirmingDelete] = React.useState(false);

  // Reset confirm state when the dialog closes or the record changes.
  React.useEffect(() => {
    if (!open) setConfirmingDelete(false);
  }, [open, record?.id]);

  if (!record) return null;

  const handleDelete = () => {
    onDelete(record.id);
    setConfirmingDelete(false);
    onOpenChange(false);
  };

  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 z-50 bg-black/60" />
        <Dialog.Content className="fixed left-1/2 top-1/2 z-50 flex max-h-[90vh] w-[min(560px,94vw)] -translate-x-1/2 -translate-y-1/2 flex-col overflow-y-auto rounded-lg border border-zinc-700 bg-zinc-900 p-4 shadow-xl">
          <Dialog.Title className="text-lg font-semibold text-zinc-100">
            AAR — {record.palaceName}
          </Dialog.Title>
          <Dialog.Description className="mt-1 text-xs text-zinc-400">
            Closed {new Date(record.createdAt).toLocaleString()} · {record.signature.nodeCount}{" "}
            nodes · {record.signature.edgeCount} edges
          </Dialog.Description>

          {record.takeaway ? (
            <div className="mt-3 rounded-md border border-fuchsia-700/40 bg-fuchsia-950/30 p-2 text-sm text-fuchsia-100">
              <div className="text-[11px] uppercase tracking-wide text-fuchsia-300">Takeaway</div>
              <div className="mt-0.5 font-medium">{record.takeaway}</div>
            </div>
          ) : null}

          <div className="mt-3 grid gap-2.5 text-sm text-zinc-100">
            <Section label="What did I intend?" body={record.intent} />
            <Section label="What happened?" body={record.outcome} />
            <Section label="Why the gap?" body={record.gap} />
            <Section label="What changes next time?" body={record.adjustment} />
          </div>

          <div className="mt-5 flex items-center justify-between gap-2">
            {confirmingDelete ? (
              <div className="flex items-center gap-2 text-xs text-amber-200">
                <span>Confirm delete?</span>
                <Button
                  size="sm"
                  type="button"
                  className="border border-amber-300/70 bg-amber-400 text-zinc-950 hover:bg-amber-300"
                  onClick={handleDelete}
                >
                  Yes, delete
                </Button>
                <Button
                  size="sm"
                  variant="ghost"
                  type="button"
                  onClick={() => setConfirmingDelete(false)}
                >
                  No
                </Button>
              </div>
            ) : (
              <Button
                size="sm"
                variant="ghost"
                type="button"
                className="text-amber-300 hover:bg-amber-900/30"
                onClick={() => setConfirmingDelete(true)}
              >
                Delete AAR
              </Button>
            )}
            <Button type="button" onClick={() => onOpenChange(false)}>
              Close
            </Button>
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}

function Section({ label, body }: { label: string; body: string }) {
  if (!body.trim()) {
    return (
      <div>
        <div className="text-[11px] uppercase tracking-wide text-zinc-500">{label}</div>
        <div className="mt-0.5 text-xs italic text-zinc-500">(empty)</div>
      </div>
    );
  }
  return (
    <div>
      <div className="text-[11px] uppercase tracking-wide text-zinc-400">{label}</div>
      <div className="mt-0.5 whitespace-pre-wrap text-sm text-zinc-100">{body}</div>
    </div>
  );
}
