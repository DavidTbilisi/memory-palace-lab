import type { TheSystemPipelineStep, TheSystemPipelineTemplate } from "../content/theSystemPipelines";
import { splitMarkdownSections } from "../domain/services/markdownSections";

/**
 * Turn any Library document into a runnable pipeline: one step per `##`
 * section, so "Encode this" can materialize a guide or wiki page into nodes,
 * CAST edges, and a walk route through the existing System workbench.
 */
export type DocForPipeline = {
  slug: string;
  title: string;
  summary: string;
  body: string;
};

export const MAX_DOC_PIPELINE_STEPS = 12;

const SKIPPED_SECTIONS = /^(summary|related|related pages|see also|sources|references|links|changelog|history|footnotes|notes|tags)$/i;
const PROMPT_MAX_CHARS = 280;

function slugify(value: string) {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function stripInlineMarkdown(value: string) {
  return value
    .replace(/!\[[^\]]*\]\([^)]*\)/g, "")
    .replace(/\[([^\]]+)\]\([^)]+\)/g, "$1")
    .replace(/[*_`>#]/g, "")
    .replace(/\s+/g, " ")
    .trim();
}

/** First prose paragraph of a section, cleaned and trimmed to a prompt-sized length. */
export function firstParagraph(markdown: string): string {
  const blocks = markdown.split(/\r?\n\s*\r?\n/);
  for (const block of blocks) {
    const trimmed = block.trim();
    if (!trimmed) continue;
    if (/^(```|\||<|---)/.test(trimmed)) continue;
    const cleaned = stripInlineMarkdown(trimmed.replace(/^([-*]|\d+\.)\s+/gm, ""));
    if (cleaned.length < 8) continue;
    return cleaned.length > PROMPT_MAX_CHARS ? `${cleaned.slice(0, PROMPT_MAX_CHARS - 1).trimEnd()}…` : cleaned;
  }
  return "";
}

export function docPipelineId(slug: string): string {
  return `doc:${slug}`;
}

export function isDocPipelineId(id: string): boolean {
  return id.startsWith("doc:");
}

export function buildPipelineTemplateFromDoc(doc: DocForPipeline): TheSystemPipelineTemplate {
  const sections = splitMarkdownSections(doc.body).filter((section) => !SKIPPED_SECTIONS.test(section.title.trim()));
  const picked = sections.slice(0, MAX_DOC_PIPELINE_STEPS);
  const steps: TheSystemPipelineStep[] = (picked.length > 0 ? picked : [{ id: "read", label: doc.title, title: doc.title, content: doc.body }]).map(
    (section, index) => {
      const title = section.title.trim() || `Part ${index + 1}`;
      const prompt = firstParagraph(section.content) || `Work through "${title}" and write what it means for your topic.`;
      return {
        id: `${slugify(doc.slug)}-${index + 1}-${slugify(title) || "step"}`,
        code: String(index + 1).padStart(2, "0"),
        title,
        prompt,
        placeholder: `Notes on ${title}`,
        hint: `From the Library document "${doc.title}". Turn the prompt into a question you can answer from memory.`,
      };
    },
  );

  return {
    id: docPipelineId(doc.slug),
    category: "Document",
    title: doc.title,
    shortTitle: doc.title.length > 28 ? `${doc.title.slice(0, 27).trimEnd()}…` : doc.title,
    summary: doc.summary || `Step through the sections of "${doc.title}".`,
    recommendedFor: "Turning a guide or wiki page into a walkable structure inside the current palace.",
    routeName: `${doc.title} walk`,
    overviewLabel: "Document overview",
    docsSlug: doc.slug,
    steps,
  };
}
