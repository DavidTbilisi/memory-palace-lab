import {
  ATTRIBUTE_ROUTES,
  UMTF_CHANNELS,
  type AttributeRoute,
  type NodeAttribute,
  type UmtfChannel,
} from "../entities/types";

export const UMTF_CHANNEL_LABELS: Record<UmtfChannel, string> = {
  spatial: "Spatial",
  sensory: "Sensory",
  state: "State",
  relation: "Relation",
  pattern: "Pattern",
  temporal: "Temporal",
  priority: "Priority",
};

/** The one question each channel answers, as UMTF words it. */
export const UMTF_CHANNEL_QUESTIONS: Record<UmtfChannel, string> = {
  spatial: "Where is it?",
  sensory: "How does it feel?",
  state: "What condition is it in?",
  relation: "What does it connect to?",
  pattern: "What larger structure does this resemble?",
  temporal: "When does it happen?",
  priority: "How important is it?",
};

export const ATTRIBUTE_ROUTE_LABELS: Record<AttributeRoute, string> = {
  dissolve: "Dissolve",
  address: "Address",
  enumerate: "Enumerate",
};

/** When each route fits: the answer to "will anything ever ask me for all of them?". */
export const ATTRIBUTE_ROUTE_HINTS: Record<AttributeRoute, string> = {
  dissolve: "Context always gives the key when you use it, and nothing asks for the whole set. Split it into separate items.",
  address: "A small, ordered key picks the value, like a table row. Don't count-shape it.",
  enumerate: "You will be asked for the whole set. One scene with every member, plus the count as a checksum.",
};

/** Above this many channels a scene stops being retrievable, even though UMTF has seven. */
export const ATTRIBUTE_CHANNEL_BUDGET = 4;

export type AttributeWarningKind =
  | "channel-collision"
  | "route-missing"
  | "count-missing"
  | "count-mismatch"
  | "count-unexpected"
  | "channel-budget";

export type AttributeWarning = {
  kind: AttributeWarningKind;
  /** Indexes into the attribute list the warning is about. */
  attributes: number[];
  message: string;
};

function isChannel(value: unknown): value is UmtfChannel {
  return typeof value === "string" && (UMTF_CHANNELS as readonly string[]).includes(value);
}

function isRoute(value: unknown): value is AttributeRoute {
  return typeof value === "string" && (ATTRIBUTE_ROUTES as readonly string[]).includes(value);
}

function normalizeAttribute(value: unknown): NodeAttribute | null {
  if (!value || typeof value !== "object") return null;
  const raw = value as Record<string, unknown>;
  const channel = typeof raw.channel === "string" ? raw.channel.trim().toLowerCase() : raw.channel;
  if (!isChannel(channel)) return null;
  // The DSL line is `channel name [route]: a | b`, so a name drops `:` `[` `]` and `|` splits a value.
  const name = typeof raw.name === "string" ? raw.name.replace(/[:[\]]/g, " ").replace(/\s+/g, " ").trim() : "";
  const values = Array.isArray(raw.values)
    ? raw.values
        .filter((v): v is string => typeof v === "string")
        .flatMap((v) => v.split("|"))
        .map((v) => v.trim())
        .filter((v) => v !== "")
    : [];
  if (!name && values.length === 0) return null;
  const attribute: NodeAttribute = { name, channel, values };
  if (isRoute(raw.route)) attribute.route = raw.route;
  if (typeof raw.count === "number" && Number.isInteger(raw.count) && raw.count > 0) attribute.count = raw.count;
  return attribute;
}

/**
 * Tolerant reader and normalizer: drops entries with no known channel, and entries with neither a
 * name nor a value. Returns `null` when nothing is left.
 */
export function normalizeAttributes(value: unknown): NodeAttribute[] | null {
  if (!Array.isArray(value)) return null;
  const attributes = value.map(normalizeAttribute).filter((a): a is NodeAttribute => a !== null);
  return attributes.length > 0 ? attributes : null;
}

function named(attribute: NodeAttribute): string {
  return attribute.name ? `"${attribute.name}"` : "An unnamed attribute";
}

/**
 * What is wrong with a node's attributes, reported rather than refused. A collision is two
 * attributes on one channel: if two answer the same question, one is mis-assigned. Several values
 * of one attribute are not a collision; they need a route instead.
 */
export function attributeWarnings(attributes: readonly NodeAttribute[] | null | undefined): AttributeWarning[] {
  if (!attributes || attributes.length === 0) return [];
  const warnings: AttributeWarning[] = [];

  const byChannel = new Map<UmtfChannel, number[]>();
  attributes.forEach((attribute, index) => {
    byChannel.set(attribute.channel, [...(byChannel.get(attribute.channel) ?? []), index]);
  });
  for (const [channel, indexes] of byChannel) {
    if (indexes.length < 2) continue;
    const names = indexes.map((i) => named(attributes[i])).join(" and ");
    warnings.push({
      kind: "channel-collision",
      attributes: indexes,
      message: `${names} are both on ${UMTF_CHANNEL_LABELS[channel]} (${UMTF_CHANNEL_QUESTIONS[channel]}). If two answer the same question, one is mis-assigned.`,
    });
  }

  attributes.forEach((attribute, index) => {
    if (attribute.values.length > 1 && !attribute.route) {
      warnings.push({
        kind: "route-missing",
        attributes: [index],
        message: `${named(attribute)} has ${attribute.values.length} values. Choose dissolve, address, or enumerate by what recall will ask for.`,
      });
    }
    if (attribute.route === "enumerate") {
      if (attribute.count === undefined) {
        warnings.push({
          kind: "count-missing",
          attributes: [index],
          message: `${named(attribute)} is enumerated but has no count. The count is the checksum that shows a missing member.`,
        });
      } else if (attribute.count !== attribute.values.length) {
        warnings.push({
          kind: "count-mismatch",
          attributes: [index],
          message: `${named(attribute)} should have ${attribute.count} members but lists ${attribute.values.length}.`,
        });
      }
    } else if (attribute.count !== undefined) {
      warnings.push({
        kind: "count-unexpected",
        attributes: [index],
        message: `${named(attribute)} has a count, but only an enumerated set carries one.`,
      });
    }
  });

  if (byChannel.size > ATTRIBUTE_CHANNEL_BUDGET) {
    warnings.push({
      kind: "channel-budget",
      attributes: attributes.map((_, index) => index),
      message: `${byChannel.size} channels in use. A scene stays retrievable at three or four.`,
    });
  }

  return warnings;
}

/** The first channel no attribute uses yet, in UMTF's listed order; a new attribute starts there. */
export function firstFreeChannel(attributes: readonly NodeAttribute[] | null | undefined): UmtfChannel {
  const used = new Set((attributes ?? []).map((a) => a.channel));
  return UMTF_CHANNELS.find((channel) => !used.has(channel)) ?? UMTF_CHANNELS[0];
}
