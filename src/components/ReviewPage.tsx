import { useMemo, useState, type ReactNode } from "react";
import {
  Activity,
  ArrowRight,
  CalendarClock,
  Clock3,
  Footprints,
  Layers3,
} from "lucide-react";
import { startReviewAt } from "../app/reviewNavigation";
import type { GlobalDueItem } from "../domain/services/dueQueue";
import {
  dueItemTitle,
  firstDueInDeck,
  groupDueItemsByDeck,
  palacesInDeck,
  type ReviewDeck,
} from "../domain/services/reviewDecks";
import { usePalaceStore } from "../store/palaceStore";
import { useDueQueue } from "./hooks/useDueQueue";
import { Button } from "./ui/button";

type Props = {
  onOpenPalaceWorkspace: () => void;
};

const DAY_MS = 24 * 60 * 60 * 1000;

const QUICK_REVIEW_TIMES = [
  { label: "Now", days: 0 },
  { label: "+1 day", days: 1 },
  { label: "+3 days", days: 3 },
  { label: "+1 week", days: 7 },
] as const;

/** A date as a `datetime-local` value, in local time. */
function toLocalInputValue(date: Date) {
  const pad = (value: number) => String(value).padStart(2, "0");
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}T${pad(date.getHours())}:${pad(date.getMinutes())}`;
}

type ReviewActions = {
  onReview: (item: GlobalDueItem) => void;
  /** Sets the next review of one stop, or of every stop in a deck. */
  onSetStopTime: (item: GlobalDueItem, nextReviewAt: string) => Promise<void>;
  onSetDeckTime: (deck: ReviewDeck, nextReviewAt: string) => Promise<void>;
  pausedDecks: readonly string[];
  onSetDeckPaused: (deck: ReviewDeck, paused: boolean) => void;
};

/** Quick picks and an exact date-time for when something comes up for review next. */
function ReviewTimePanel({
  target,
  onSet,
  onClose,
}: {
  target: string;
  onSet: (nextReviewAt: string) => Promise<void>;
  onClose: () => void;
}) {
  const [value, setValue] = useState(() =>
    toLocalInputValue(new Date(Date.now() + DAY_MS)),
  );
  const [saving, setSaving] = useState(false);
  const apply = async (nextReviewAt: string) => {
    setSaving(true);
    await onSet(nextReviewAt);
    setSaving(false);
    onClose();
  };
  return (
    <div
      role="group"
      aria-label={`Review time for ${target}`}
      className="flex flex-wrap items-center gap-2 rounded-xl border border-zinc-800 bg-zinc-900/60 p-3"
    >
      <span className="text-xs text-zinc-400">Next review:</span>
      {QUICK_REVIEW_TIMES.map(({ label, days }) => (
        <Button
          key={label}
          type="button"
          size="sm"
          variant="secondary"
          disabled={saving}
          onClick={() =>
            void apply(new Date(Date.now() + days * DAY_MS).toISOString())
          }
        >
          {label}
        </Button>
      ))}
      <input
        type="datetime-local"
        aria-label="Review date and time"
        value={value}
        onChange={(event) => setValue(event.target.value)}
        className="h-8 rounded-md border border-zinc-700 bg-zinc-900 px-2 text-xs text-zinc-100 [color-scheme:dark]"
      />
      <Button
        type="button"
        size="sm"
        disabled={saving || !value}
        // A datetime-local value has no zone, so Date reads it as local time.
        onClick={() => void apply(new Date(value).toISOString())}
      >
        Set
      </Button>
      <Button
        type="button"
        size="sm"
        variant="ghost"
        disabled={saving}
        onClick={onClose}
      >
        Cancel
      </Button>
    </div>
  );
}

function DueItemCard({
  item,
  actions,
}: {
  item: GlobalDueItem;
  actions: ReviewActions;
}) {
  const title = dueItemTitle(item);
  const [settingTime, setSettingTime] = useState(false);
  return (
    <div className="rounded-2xl border border-zinc-800 bg-zinc-950/50 p-4">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <div className="text-base font-medium text-zinc-100">{title}</div>
          <div className="mt-1 text-xs text-zinc-400">
            {item.routeName}
            {title !== item.nodeTitle ? ` | ${item.nodeTitle}` : ""}
          </div>
          <div className="mt-1 text-xs text-zinc-500">
            Due {new Date(item.nextReviewAt).toLocaleDateString()}{" "}
            {new Date(item.nextReviewAt).toLocaleTimeString()}
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button
            type="button"
            size="sm"
            variant="ghost"
            aria-label={`Set review time for ${title}`}
            aria-expanded={settingTime}
            title="Set when this stop comes up for review"
            onClick={() => setSettingTime((open) => !open)}
          >
            <CalendarClock className="h-4 w-4" />
          </Button>
          <Button
            type="button"
            size="sm"
            onClick={() => actions.onReview(item)}
          >
            Review now
          </Button>
        </div>
      </div>
      {settingTime ? (
        <div className="mt-3">
          <ReviewTimePanel
            target={title}
            onSet={(nextReviewAt) => actions.onSetStopTime(item, nextReviewAt)}
            onClose={() => setSettingTime(false)}
          />
        </div>
      ) : null}
    </div>
  );
}

/** One deck of the review queue: its palaces' due stops and the decks nested in it. */
function DeckSection({
  deck,
  actions,
  pausedAbove = null,
}: {
  deck: ReviewDeck;
  actions: ReviewActions;
  /** Name of a paused deck this one sits in, which pauses it too. */
  pausedAbove?: string | null;
}) {
  const pausedHere = actions.pausedDecks.includes(deck.path);
  const paused = pausedHere || pausedAbove !== null;
  const [open, setOpen] = useState(!paused);
  const [settingTime, setSettingTime] = useState(false);
  const first = paused ? null : firstDueInDeck(deck);
  // Controls inside the summary must not also fold the deck.
  const inSummary =
    (action: () => void) => (event: { preventDefault: () => void }) => {
      event.preventDefault();
      action();
    };
  return (
    <details
      open={open}
      onToggle={(event) => setOpen(event.currentTarget.open)}
      aria-label={`${deck.name} deck`}
      data-paused={paused || undefined}
      className={`rounded-2xl border border-zinc-800 bg-zinc-950/30 ${paused ? "opacity-60" : ""}`}
    >
      <summary className="flex cursor-pointer select-none flex-wrap items-center gap-2 px-4 py-3">
        <Layers3 className="h-4 w-4 shrink-0 text-violet-300" />
        <span className="font-medium text-zinc-100">{deck.name}</span>
        <span className="rounded-full bg-violet-500/15 px-2 py-0.5 text-xs text-violet-200">
          {deck.dueCount} due
        </span>
        {paused ? (
          <span className="rounded-full bg-zinc-800 px-2 py-0.5 text-xs text-zinc-300">
            {pausedHere ? "Off" : `Off with ${pausedAbove}`}
          </span>
        ) : null}
        <div className="ml-auto flex items-center gap-2">
          <Button
            type="button"
            size="sm"
            variant="ghost"
            aria-label={`Set review time for ${deck.name} deck`}
            aria-expanded={settingTime}
            title="Set when every stop in this deck comes up for review"
            onClick={inSummary(() => {
              setSettingTime((shown) => !shown);
              setOpen(true);
            })}
          >
            <CalendarClock className="h-4 w-4" />
          </Button>
          <button
            type="button"
            role="switch"
            aria-checked={!pausedHere}
            aria-label={`${deck.name} deck in review`}
            disabled={pausedAbove !== null}
            title={
              pausedAbove !== null
                ? `Off because ${pausedAbove} is off`
                : pausedHere
                  ? "Turn this deck back on"
                  : "Turn this deck off: its stops leave the review queue"
            }
            onClick={inSummary(() => {
              actions.onSetDeckPaused(deck, !pausedHere);
              setOpen(pausedHere);
            })}
            className={`relative inline-flex h-5 w-9 shrink-0 items-center rounded-full transition-colors disabled:opacity-50 ${
              pausedHere || pausedAbove !== null
                ? "bg-zinc-700"
                : "bg-violet-500"
            }`}
          >
            <span
              className={`inline-block h-4 w-4 rounded-full bg-white shadow transition-transform ${
                paused ? "translate-x-0.5" : "translate-x-[18px]"
              }`}
            />
          </button>
          {first ? (
            <Button
              type="button"
              size="sm"
              variant="secondary"
              aria-label={`Review ${deck.name} deck`}
              onClick={inSummary(() => actions.onReview(first))}
            >
              Review deck
            </Button>
          ) : null}
        </div>
      </summary>
      <div className="space-y-3 px-4 pb-4">
        {settingTime ? (
          <ReviewTimePanel
            target={`${deck.name} deck`}
            onSet={(nextReviewAt) => actions.onSetDeckTime(deck, nextReviewAt)}
            onClose={() => setSettingTime(false)}
          />
        ) : null}
        {deck.decks.map((child) => (
          <DeckSection
            key={child.path}
            deck={child}
            actions={actions}
            pausedAbove={pausedAbove ?? (pausedHere ? deck.name : null)}
          />
        ))}
        {deck.palaces.map((palace) => (
          <div key={palace.palaceId} className="space-y-2">
            <div className="text-xs font-semibold uppercase tracking-[0.18em] text-zinc-500">
              {palace.palaceName} · {palace.items.length} due
            </div>
            {palace.items.map((item) => (
              <DueItemCard
                key={`${item.palaceId}:${item.locusId}`}
                item={item}
                actions={actions}
              />
            ))}
          </div>
        ))}
      </div>
    </details>
  );
}

function StatCard({
  label,
  value,
  icon,
}: {
  label: string;
  value: string;
  icon: ReactNode;
}) {
  return (
    <div className="rounded-3xl border border-zinc-800 bg-zinc-900/40 p-4">
      <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.18em] text-zinc-500">
        {icon}
        {label}
      </div>
      <div className="mt-3 text-2xl font-semibold text-zinc-100">{value}</div>
    </div>
  );
}

export function ReviewPage({ onOpenPalaceWorkspace }: Props) {
  const palaces = usePalaceStore((s) => s.palaces);
  const pausedDecks = usePalaceStore((s) => s.pausedDecks);
  const setDeckPaused = usePalaceStore((s) => s.setDeckPaused);
  const rescheduleStops = usePalaceStore((s) => s.rescheduleStops);
  const {
    items: dueItems,
    pausedItems,
    loading: loadingDue,
    streak,
    reviewedToday,
    dailyReviewGoal,
    goalProgress,
    refresh,
  } = useDueQueue();
  const [palaceFilter, setPalaceFilter] = useState("all");
  const [notice, setNotice] = useState<string | null>(null);

  const filteredDueItems = useMemo(() => {
    if (palaceFilter === "all") return dueItems;
    return dueItems.filter((item) => item.palaceId === palaceFilter);
  }, [dueItems, palaceFilter]);

  const filteredPausedItems = useMemo(() => {
    if (palaceFilter === "all") return pausedItems;
    return pausedItems.filter((item) => item.palaceId === palaceFilter);
  }, [pausedItems, palaceFilter]);

  // Paused decks stay listed (switched off) so they can be turned back on.
  const decks = useMemo(
    () =>
      groupDueItemsByDeck(
        [...filteredDueItems, ...filteredPausedItems],
        palaces,
      ),
    [filteredDueItems, filteredPausedItems, palaces],
  );

  const announceTime = (what: string, nextReviewAt: string) =>
    setNotice(
      `${what} now comes up for review ${new Date(nextReviewAt).toLocaleString()}.`,
    );

  const actions: ReviewActions = {
    onReview: (item) => void startDueReview(item),
    async onSetStopTime(item, nextReviewAt) {
      await rescheduleStops(
        [{ palaceId: item.palaceId, locusIds: [item.locusId] }],
        nextReviewAt,
      );
      refresh();
      announceTime(dueItemTitle(item), nextReviewAt);
    },
    async onSetDeckTime(deck, nextReviewAt) {
      // Every stop of every palace in the deck, not only the ones due now.
      const inDeck = palacesInDeck(deck.path, palaces);
      await rescheduleStops(
        inDeck.map((palace) => ({ palaceId: palace.id })),
        nextReviewAt,
      );
      refresh();
      announceTime(`Every stop in ${deck.name}`, nextReviewAt);
    },
    pausedDecks,
    onSetDeckPaused: (deck, paused) => {
      setDeckPaused(deck.path, paused);
      setNotice(
        paused
          ? `${deck.name} is off: its stops are out of the review queue.`
          : `${deck.name} is back in the review queue.`,
      );
    },
  };

  const topRoute = filteredDueItems[0] ?? null;

  const startDueReview = (item: GlobalDueItem) =>
    startReviewAt({
      palaceId: item.palaceId,
      routeId: item.routeId,
      locusId: item.locusId,
      nodeId: item.nodeId,
    });

  return (
    <div className="flex min-h-0 flex-1 flex-col overflow-hidden">
      <div className="border-b border-zinc-800 px-5 py-4">
        <div className="flex items-center gap-2 text-sm font-semibold text-violet-200">
          <Footprints className="h-4 w-4" />
          Global Review Queue
        </div>
        <p className="mt-2 max-w-3xl text-sm leading-6 text-zinc-400">
          Due loci are aggregated across all palaces. Start from the top and the
          app will open the correct palace automatically before walk mode
          starts.
        </p>
        <div className="mt-4 flex flex-wrap items-center gap-2">
          {topRoute ? (
            <Button type="button" onClick={() => void startDueReview(topRoute)}>
              <ArrowRight className="h-4 w-4" />
              Start top due review
            </Button>
          ) : null}
          <Button
            type="button"
            variant="secondary"
            onClick={onOpenPalaceWorkspace}
          >
            Back to palace
          </Button>
          <div className="ml-auto">
            <select
              value={palaceFilter}
              onChange={(event) => setPalaceFilter(event.target.value)}
              className="h-9 rounded-md border border-zinc-700 bg-zinc-900 px-3 text-xs text-zinc-100"
              aria-label="Filter review queue by palace"
            >
              <option value="all">All palaces</option>
              {palaces.map((palace) => (
                <option key={palace.id} value={palace.id}>
                  {palace.name}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      <div className="min-h-0 flex-1 overflow-y-auto p-5">
        <div className="grid gap-4 lg:grid-cols-4">
          <StatCard
            label="Total Due"
            value={String(filteredDueItems.length)}
            icon={<Layers3 className="h-3.5 w-3.5" />}
          />
          <StatCard
            label="Streak"
            value={`${streak} day${streak === 1 ? "" : "s"}`}
            icon={<Activity className="h-3.5 w-3.5" />}
          />
          <StatCard
            label="Today Reviewed"
            value={String(reviewedToday)}
            icon={<Footprints className="h-3.5 w-3.5" />}
          />
          <StatCard
            label="Daily Goal"
            value={`${reviewedToday}/${dailyReviewGoal}`}
            icon={<Clock3 className="h-3.5 w-3.5" />}
          />
        </div>

        <section className="mt-4 rounded-2xl border border-zinc-800 bg-zinc-900/40 p-4">
          <div className="flex items-center justify-between gap-2 text-xs text-zinc-400">
            <span>Daily goal progress</span>
            <span>
              {reviewedToday}/{dailyReviewGoal}
            </span>
          </div>
          <div className="mt-2 h-2 overflow-hidden rounded-full bg-zinc-800">
            <div
              className="h-full bg-violet-400 transition-all"
              style={{ width: `${Math.round(goalProgress * 100)}%` }}
            />
          </div>
          <div className="mt-2 text-xs text-zinc-500">
            {reviewedToday >= dailyReviewGoal
              ? "Goal reached. Solid consistency."
              : streak === 0
                ? "Start your streak again today."
                : "Keep the chain alive today."}
          </div>
        </section>

        <section className="mt-4 rounded-[28px] border border-zinc-800 bg-zinc-900/40 p-5">
          <div className="text-sm font-semibold text-zinc-100">
            Due Loci by Deck
          </div>
          <div
            aria-live="polite"
            className={notice ? "mt-2 text-xs text-violet-200" : "sr-only"}
          >
            {notice}
          </div>
          <div className="mt-4 space-y-3">
            {loadingDue ? (
              <div className="rounded-2xl border border-dashed border-zinc-800 bg-zinc-950/40 px-4 py-6 text-sm text-zinc-500">
                Loading global review queue...
              </div>
            ) : decks.length === 0 ? (
              <div className="rounded-2xl border border-dashed border-zinc-800 bg-zinc-950/40 px-4 py-6 text-sm text-zinc-500">
                No due loci right now. Review activity will appear here as items
                become due.
              </div>
            ) : (
              decks.map((deck) => (
                <DeckSection
                  key={deck.path || deck.name}
                  deck={deck}
                  actions={actions}
                />
              ))
            )}
          </div>
        </section>
      </div>
    </div>
  );
}
