export type TheSystemCategory =
  | "Getting Started"
  | "Comprehension"
  | "Encoding"
  | "Numeric"
  | "Operations"
  | "Examples";

export type TheSystemDoc = {
  slug: string;
  filename: string;
  title: string;
  summary: string;
  category: TheSystemCategory;
  body: string;
};

const DOC_ORDER = [
  "navigator",
  "skill",
  "design-orientation",
  "onboarding-path",
  "memorization-helpers",
  "measurement-framework",
  "comprehension-protocol",
  "confusion-triage",
  "heuristic-palace",
  "how-to-learn-a-language",
  "domain-patterns",
  "metacognitive-checklist",
  "triz",
  "concept-encoding",
  "procedure-encoding",
  "cast-system",
  "cast-beginner-bilingual",
  "georgian-system",
  "formulas",
  "collisions",
  "major-system",
  "pao",
  "sem3-full",
  "binary-hex",
  "calendar-time-memorization",
  "bible-memorization",
  "mind-palace",
  "retrieval-protocol",
  "lecture-listening-notes",
  "encoding-examples",
  "steam-stemm-examples",
  "zero-loss-forced-recall",
] as const;

const DOC_CATEGORY_BY_SLUG: Record<string, TheSystemCategory> = {
  navigator: "Getting Started",
  skill: "Getting Started",
  "design-orientation": "Getting Started",
  "onboarding-path": "Getting Started",
  "memorization-helpers": "Getting Started",
  "measurement-framework": "Getting Started",
  "comprehension-protocol": "Comprehension",
  "confusion-triage": "Comprehension",
  "heuristic-palace": "Comprehension",
  "how-to-learn-a-language": "Comprehension",
  "domain-patterns": "Comprehension",
  "metacognitive-checklist": "Comprehension",
  triz: "Comprehension",
  "concept-encoding": "Encoding",
  "procedure-encoding": "Encoding",
  "cast-system": "Encoding",
  "cast-beginner-bilingual": "Encoding",
  "georgian-system": "Encoding",
  formulas: "Encoding",
  collisions: "Encoding",
  "major-system": "Numeric",
  pao: "Numeric",
  "sem3-full": "Numeric",
  "binary-hex": "Numeric",
  "calendar-time-memorization": "Numeric",
  "bible-memorization": "Numeric",
  "mind-palace": "Operations",
  "retrieval-protocol": "Operations",
  "lecture-listening-notes": "Operations",
  "zero-loss-forced-recall": "Operations",
  "encoding-examples": "Examples",
  "steam-stemm-examples": "Examples",
};

const rawDocModules = import.meta.glob("../../theSystem/*.md", {
  import: "default",
  query: "?raw",
}) as Record<string, () => Promise<string>>;

const FRONTMATTER_RE = /^---\r?\n[\s\S]*?\r?\n---\r?\n?/;

function slugFromPath(path: string) {
  const filename = path.split("/").pop() ?? path;
  return filename.replace(/\.md$/i, "").toLowerCase();
}

function stripFrontmatter(content: string) {
  return content.replace(FRONTMATTER_RE, "").trim();
}

function humanizeSlug(slug: string) {
  return slug
    .split("-")
    .map((part) => (part ? part[0].toUpperCase() + part.slice(1) : part))
    .join(" ");
}

function extractTitle(slug: string, content: string) {
  const match = content.match(/^#\s+(.+)$/m);
  return match?.[1]?.trim() || humanizeSlug(slug);
}

function stripMarkdownInline(value: string) {
  return value
    .replace(/\[([^\]]+)\]\([^)]+\)/g, "$1")
    .replace(/[*_`>#]/g, "")
    .replace(/\s+/g, " ")
    .trim();
}

function extractSummary(content: string) {
  const lines = stripFrontmatter(content).split(/\r?\n/);
  for (const line of lines) {
    const trimmed = line.trim();
    if (!trimmed) continue;
    if (trimmed.startsWith("#")) continue;
    if (trimmed.startsWith("|")) continue;
    if (trimmed.startsWith("```")) continue;
    if (trimmed.startsWith("---")) continue;
    if (/^[-*]\s/.test(trimmed)) continue;
    const cleaned = stripMarkdownInline(trimmed);
    if (cleaned.length >= 24) return cleaned;
  }
  return "Integrated reference document from theSystem.";
}

function extractBody(content: string) {
  const stripped = stripFrontmatter(content);
  const lines = stripped.split(/\r?\n/);
  if (/^#\s+/.test(lines[0] ?? "")) {
    return lines.slice(1).join("\n").trim();
  }
  return stripped;
}

function compareDocs(a: TheSystemDoc, b: TheSystemDoc) {
  const aIndex = DOC_ORDER.indexOf(a.slug as (typeof DOC_ORDER)[number]);
  const bIndex = DOC_ORDER.indexOf(b.slug as (typeof DOC_ORDER)[number]);
  const safeA = aIndex === -1 ? Number.MAX_SAFE_INTEGER : aIndex;
  const safeB = bIndex === -1 ? Number.MAX_SAFE_INTEGER : bIndex;
  if (safeA !== safeB) return safeA - safeB;
  return a.title.localeCompare(b.title);
}

function buildDocs(entries: Array<[string, string]>) {
  return entries
    .map(([path, content]) => {
      const slug = slugFromPath(path);
      return {
        slug,
        filename: path.split("/").pop() ?? `${slug}.md`,
        title: extractTitle(slug, content),
        summary: extractSummary(content),
        category: DOC_CATEGORY_BY_SLUG[slug] ?? "Examples",
        body: extractBody(content),
      };
    })
    .sort(compareDocs);
}

let docsPromise: Promise<TheSystemDoc[]> | null = null;

export function loadTheSystemDocs() {
  if (!docsPromise) {
    docsPromise = Promise.all(
      Object.entries(rawDocModules).map(
        async ([path, loader]) => [path, await loader()] as [string, string],
      ),
    ).then(buildDocs);
  }
  return docsPromise;
}

export const THE_SYSTEM_CATEGORIES: Array<TheSystemCategory | "All"> = [
  "All",
  "Getting Started",
  "Comprehension",
  "Encoding",
  "Numeric",
  "Operations",
  "Examples",
];
