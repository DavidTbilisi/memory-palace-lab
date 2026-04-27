export type PaletteGroup =
  | "Actions"
  | "Palaces"
  | "Routes"
  | "Nodes"
  | "Current Palace Nodes"
  | "Other Palaces"
  | "Recent nodes"
  | "Pages"
  | "Docs";

export type PaletteItem = {
  id: string;
  group: PaletteGroup;
  title: string;
  subtitle?: string;
  keywords?: string;
};

export type RankedPaletteItem = PaletteItem & {
  score: number;
  recentRank: number;
};

const GROUP_ORDER: Record<PaletteGroup, number> = {
  Actions: 0,
  "Recent nodes": 1,
  "Current Palace Nodes": 2,
  "Other Palaces": 3,
  Pages: 4,
  Palaces: 5,
  Routes: 6,
  Nodes: 7,
  Docs: 8,
};

function normalize(text: string) {
  return text.trim().toLowerCase();
}

function subsequenceScore(needle: string, haystack: string) {
  if (!needle) return 0;
  let cursor = 0;
  let firstMatch = -1;
  let lastMatch = -1;

  for (let index = 0; index < haystack.length && cursor < needle.length; index += 1) {
    if (haystack[index] !== needle[cursor]) continue;
    if (firstMatch === -1) firstMatch = index;
    lastMatch = index;
    cursor += 1;
  }

  if (cursor !== needle.length || firstMatch === -1 || lastMatch === -1) return null;
  const compactnessPenalty = Math.max(0, lastMatch - firstMatch - needle.length);
  return Math.max(1, 20 - compactnessPenalty);
}

function tokenScore(token: string, title: string, haystack: string) {
  if (!token) return 0;
  if (title === token) return 120;
  if (title.startsWith(token)) return 90 - Math.min(24, title.length - token.length);

  const titleIndex = title.indexOf(token);
  if (titleIndex >= 0) return 72 - Math.min(24, titleIndex);

  const haystackIndex = haystack.indexOf(token);
  if (haystackIndex >= 0) return 48 - Math.min(24, haystackIndex);

  return subsequenceScore(token, haystack);
}

function matchScore(query: string, item: PaletteItem) {
  if (!query) return 1;

  const title = normalize(item.title);
  const subtitle = normalize(item.subtitle ?? "");
  const keywords = normalize(item.keywords ?? "");
  const haystack = [title, subtitle, keywords].filter(Boolean).join(" ");
  const tokens = query.split(/\s+/).filter(Boolean);

  let score = 0;
  for (const token of tokens) {
    const current = tokenScore(token, title, haystack);
    if (current === null) return null;
    score += current;
  }

  return score;
}

export function rankPaletteItems(items: PaletteItem[], query: string, recentIds: string[] = []) {
  const normalizedQuery = normalize(query);
  const recentIndex = new Map(recentIds.map((id, index) => [id, index]));

  const ranked: RankedPaletteItem[] = [];
  for (const item of items) {
    const score = matchScore(normalizedQuery, item);
    if (score === null) continue;
    const recentRank = recentIndex.has(item.id) ? recentIds.length - (recentIndex.get(item.id) ?? 0) : 0;
    ranked.push({
      ...item,
      score: score + recentRank * 8,
      recentRank,
    });
  }

  ranked.sort((a, b) => {
    if (b.score !== a.score) return b.score - a.score;
    if (b.recentRank !== a.recentRank) return b.recentRank - a.recentRank;
    if (GROUP_ORDER[a.group] !== GROUP_ORDER[b.group]) return GROUP_ORDER[a.group] - GROUP_ORDER[b.group];
    return a.title.localeCompare(b.title);
  });

  return ranked;
}
