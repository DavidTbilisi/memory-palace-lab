/**
 * Node content HTML arrives from DSL imports, MCP writes, and pastes, and is
 * rendered with innerHTML — sanitizeContentHtml is the safety funnel.
 */
import { describe, expect, it } from "vitest";
import { sanitizeContentHtml } from "./NodeInspector";

describe("sanitizeContentHtml", () => {
  it("strips script tags", () => {
    expect(sanitizeContentHtml('<p>hi</p><script>alert(1)</script>')).toBe("<p>hi</p>");
  });

  it("strips event handlers", () => {
    const out = sanitizeContentHtml('<img src="x" onerror="alert(1)">');
    expect(out).not.toContain("onerror");
  });

  it("strips javascript: hrefs", () => {
    const out = sanitizeContentHtml('<a href="javascript:alert(1)">x</a>');
    expect(out).not.toContain("javascript:");
  });

  it("keeps obsidian source links (Ctrl+click convention)", () => {
    const html =
      '<p>📖 <a href="obsidian://open?vault=Neural%20OS&amp;file=wiki/wealth-money/rich-dad-poor-dad">rich-dad-poor-dad</a></p>';
    expect(sanitizeContentHtml(html)).toContain('href="obsidian://open?vault=Neural%20OS');
  });

  it("keeps https links and basic formatting", () => {
    const html = "<p><strong>bold</strong> <em>it</em> <a href=\"https://example.com\">site</a></p><ul><li>x</li></ul>";
    const out = sanitizeContentHtml(html);
    expect(out).toContain("<strong>bold</strong>");
    expect(out).toContain('href="https://example.com"');
    expect(out).toContain("<li>x</li>");
  });

  it("keeps pasted data-url images but strips foreign schemes", () => {
    expect(sanitizeContentHtml('<img src="data:image/png;base64,AAAA">')).toContain("data:image/png");
    expect(sanitizeContentHtml('<a href="vbscript:evil">x</a>')).not.toContain("vbscript");
  });
});
