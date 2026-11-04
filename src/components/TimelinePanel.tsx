import { useState } from "react";
import { useValue } from "@tldraw/editor";
import { CalendarRange, X } from "lucide-react";
import { isDateImageFilled, readTimeline } from "../canvas/timelineCanvas";
import { STORE_KIND_LABELS, type TimelineStore } from "../domain/services/generatedStore";
import { usePalaceStore } from "../store/palaceStore";
import { addEra, addTimelineEvent, eventImageIsFilled, redateEvent, relayoutTimeline, removeEra, removeEvent } from "../system/timelineStore";
import { Button } from "./ui/button";
import { Input } from "./ui/input";

const DATE_EXAMPLE = "1901, 1969-07-20, 490 BCE, 1910–1913";

/** The open timeline: its events, its eras, and adding to both. */
export function TimelinePanel({ store }: { store: TimelineStore }) {
  const editorRef = usePalaceStore((s) => s.editorRef);
  const counts = useValue(
    "timeline counts",
    () => {
      if (!editorRef) return { events: 0, images: 0 };
      const { events } = readTimeline(editorRef);
      return {
        events: events.length,
        images: events.filter((event) => event.image && isDateImageFilled(event.image, event.date)).length,
      };
    },
    [editorRef],
  );
  const [title, setTitle] = useState("");
  const [date, setDate] = useState("");
  const [eventError, setEventError] = useState<string | null>(null);
  const [eraName, setEraName] = useState("");
  const [eraFrom, setEraFrom] = useState("");
  const [eraTo, setEraTo] = useState("");
  const [eraError, setEraError] = useState<string | null>(null);

  const add = () => {
    const result = addTimelineEvent(title, date);
    if (!result.ok) {
      setEventError(result.error);
      return;
    }
    setEventError(null);
    setTitle("");
    setDate("");
    if (result.nodeId) usePalaceStore.getState().setFocusNodeId(result.nodeId);
  };
  const addNamedEra = () => {
    const result = addEra(eraName, eraFrom, eraTo);
    if (!result.ok) {
      setEraError(result.error);
      return;
    }
    setEraError(null);
    setEraName("");
    setEraFrom("");
    setEraTo("");
  };
  const onEnter = (action: () => void) => (event: React.KeyboardEvent) => {
    if (event.key === "Enter") action();
  };

  return (
    <section aria-label="Store" className="space-y-1.5 rounded-md border border-sky-900/60 bg-sky-950/20 p-2">
      <div className="flex items-center gap-1.5 text-xs font-medium text-sky-100">
        <CalendarRange className="h-3.5 w-3.5" />
        {STORE_KIND_LABELS.timeline} · {store.title}
      </div>
      <p data-testid="store-fill" className="text-[11px] text-zinc-400">
        {counts.events} {counts.events === 1 ? "event" : "events"} · {counts.images} of {counts.events} date images
        filled
      </p>

      <div role="group" aria-label="Add event" className="space-y-1">
        <Input
          aria-label="Event"
          placeholder="Event, e.g. Discovers the paradox"
          value={title}
          onChange={(event) => setTitle(event.target.value)}
          onKeyDown={onEnter(add)}
          className="h-8 text-xs"
        />
        <div className="flex gap-1">
          <Input
            aria-label="Date"
            placeholder="Date, e.g. 1901"
            value={date}
            onChange={(event) => setDate(event.target.value)}
            onKeyDown={onEnter(add)}
            className="h-8 text-xs"
          />
          <Button size="sm" variant="secondary" type="button" disabled={!title.trim() || !date.trim()} onClick={add}>
            Add event
          </Button>
        </div>
        {eventError ? (
          <p role="status" className="text-[11px] text-amber-300">
            {eventError}
          </p>
        ) : null}
      </div>

      <div role="group" aria-label="Eras" className="space-y-1 border-t border-zinc-800 pt-1.5">
        <p className="text-[11px] font-medium text-zinc-300">Eras</p>
        {store.eras.length === 0 ? (
          <p className="text-[10px] leading-4 text-zinc-500">
            Name a stretch of time to draw it as a room. Its events become a section of the route.
          </p>
        ) : (
          <ul className="space-y-0.5">
            {store.eras.map((era) => (
              <li key={era.id} className="flex items-center gap-1 text-[11px] text-zinc-300">
                <span className="min-w-0 flex-1 truncate">
                  {era.name} <span className="text-zinc-500">{era.from}–{era.to}</span>
                </span>
                <button
                  type="button"
                  aria-label={`Remove era ${era.name}`}
                  className="rounded p-0.5 text-zinc-500 hover:bg-zinc-800 hover:text-zinc-200"
                  onClick={() => removeEra(era.id)}
                >
                  <X className="h-3 w-3" />
                </button>
              </li>
            ))}
          </ul>
        )}
        <Input
          aria-label="Era name"
          placeholder="Era, e.g. Principia years"
          value={eraName}
          onChange={(event) => setEraName(event.target.value)}
          onKeyDown={onEnter(addNamedEra)}
          className="h-8 text-xs"
        />
        <div className="flex gap-1">
          <Input
            aria-label="Era from"
            placeholder="From"
            value={eraFrom}
            onChange={(event) => setEraFrom(event.target.value)}
            onKeyDown={onEnter(addNamedEra)}
            className="h-8 text-xs"
          />
          <Input
            aria-label="Era to"
            placeholder="To"
            value={eraTo}
            onChange={(event) => setEraTo(event.target.value)}
            onKeyDown={onEnter(addNamedEra)}
            className="h-8 text-xs"
          />
        </div>
        <Button
          size="sm"
          variant="secondary"
          type="button"
          disabled={!eraName.trim() || !eraFrom.trim() || !eraTo.trim()}
          onClick={addNamedEra}
        >
          Add era
        </Button>
        {eraError ? (
          <p role="status" className="text-[11px] text-amber-300">
            {eraError}
          </p>
        ) : null}
      </div>

      <Button size="sm" variant="ghost" type="button" onClick={() => relayoutTimeline()}>
        Lay out again
      </Button>
      <p className="text-[10px] leading-4 text-zinc-500">
        Dates look like {DATE_EXAMPLE}. Each event's place follows its date; laying out again puts moved nodes back.
      </p>
    </section>
  );
}

/** On a timeline event in the inspector: its date, which can be changed, and removing it. */
export function TimelineEventFields({ nodeId, dateLabel }: { nodeId: string; dateLabel: string }) {
  const [date, setDate] = useState(dateLabel);
  const [error, setError] = useState<string | null>(null);
  const [confirming, setConfirming] = useState(false);
  const [shownFor, setShownFor] = useState({ nodeId, dateLabel });
  // Selecting another event, or a change from elsewhere, resets the field.
  if (shownFor.nodeId !== nodeId || shownFor.dateLabel !== dateLabel) {
    setShownFor({ nodeId, dateLabel });
    setDate(dateLabel);
    setError(null);
    setConfirming(false);
  }

  const save = () => {
    if (date.trim() === dateLabel) return;
    const result = redateEvent(nodeId, date);
    setError(result.ok ? null : result.error);
  };
  const remove = () => {
    if (eventImageIsFilled(nodeId)) setConfirming(true);
    else removeEvent(nodeId, { withImage: true });
  };

  return (
    <div className="space-y-1">
      <label htmlFor="mp-timeline-date" className="text-sm font-medium text-zinc-200">
        Date
      </label>
      <div className="flex gap-1.5">
        <Input
          id="mp-timeline-date"
          aria-label="Event date"
          value={date}
          onChange={(event) => {
            setDate(event.target.value);
            setError(null);
          }}
          onKeyDown={(event) => {
            if (event.key === "Enter") save();
          }}
          className="h-8 text-sm"
        />
        <Button size="sm" variant="secondary" type="button" disabled={!date.trim() || date.trim() === dateLabel} onClick={save}>
          Change date
        </Button>
      </div>
      {error ? (
        <p role="status" className="text-[11px] text-amber-300">
          {error}
        </p>
      ) : (
        <p className="text-[11px] text-zinc-500">The event moves to its date on the axis, and its stop moves with it.</p>
      )}
      {confirming ? (
        <div role="alertdialog" aria-label="Remove event" className="space-y-1.5 rounded border border-amber-800/70 p-1.5">
          <p className="text-[11px] leading-4 text-amber-200">
            Its date image holds your own image. Delete it with the event, or keep it on the canvas?
          </p>
          <div className="flex flex-wrap gap-1.5">
            <Button size="sm" variant="outline" type="button" className="border-red-800 text-red-300" onClick={() => removeEvent(nodeId, { withImage: true })}>
              Delete both
            </Button>
            <Button size="sm" type="button" onClick={() => removeEvent(nodeId, { withImage: false })}>
              Keep the image
            </Button>
            <Button size="sm" variant="ghost" type="button" onClick={() => setConfirming(false)}>
              Cancel
            </Button>
          </div>
        </div>
      ) : (
        <Button size="sm" variant="outline" type="button" onClick={remove}>
          Remove event
        </Button>
      )}
    </div>
  );
}
