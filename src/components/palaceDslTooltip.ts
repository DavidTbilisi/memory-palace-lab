import { EditorView, hoverTooltip } from "@codemirror/view";

// ---------------------------------------------------------------------------
// Tooltip content per line type
// ---------------------------------------------------------------------------

interface TipContent {
  syntax: string;
  desc: string;
  example: string;
  extra?: string;
}

function castTable(): string {
  const rows = [
    ["1", "Giant", "Crushing", "Rock", "Red cave"],
    ["2", "Mermaid", "Flowing", "Water", "Blue ocean"],
    ["3", "Mage", "Spreading", "Cloud", "Green sky"],
    ["4", "Dragon", "Exploding", "Lightning", "Purple storm"],
  ]
    .map(
      ([d, ...vals]) =>
        `<tr><td class="cm-tip-digit">${d}</td>${vals.map((v) => `<td>${v}</td>`).join("")}</tr>`,
    )
    .join("");

  return `
    <div class="cm-tip-cast-label">CAST — who / how / what / when (0 = unset)</div>
    <table class="cm-tip-cast-table">
      <thead><tr>
        <th>#</th><th>who</th><th>how</th><th>what</th><th>when</th>
      </tr></thead>
      <tbody>${rows}</tbody>
    </table>`;
}

function esc(s: string): string {
  return s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}

function tipFor(body: string): TipContent | null {
  if (!body || body.startsWith("--")) return null;

  if (body.startsWith("@atlas")) {
    return {
      syntax: "@atlas <path>",
      desc: "Atlas path — assign this palace to a location in the atlas hierarchy",
      example: "@atlas /science/physics",
    };
  }
  const nedf = body.match(/^@([NEDF])(\s|$)/);
  if (nedf) {
    const tips: Record<string, TipContent> = {
      N: {
        syntax: "@N <name-hook>",
        desc: "NEDF Name-hook: a sound-alike, pun, or image. Drilled as recognition. Repeat for more lines",
        example: "@N Mute-X: a gagged guard at the door",
      },
      E: {
        syntax: "@E <essence>",
        desc: "NEDF Essence: what the concept does. Drilled as recall. Repeat for more lines",
        example: "@E Lets one thread in at a time",
      },
      D: {
        syntax: "@D <question> => <reason>",
        desc: "NEDF Distinguisher: a question it shares with its nearest neighbour, and why it is this one. Drilled as discrimination",
        example: "@D One key, or a bowl of keys? => A mutex has one owner",
      },
      F: {
        syntax: "@F <scenario> => <correction>",
        desc: "NEDF Failure: where it breaks, and the fix. Drilled as diagnosis",
        example: "@F Threads hang after an exception => Release the lock in finally",
      },
    };
    return tips[nedf[1]!]!;
  }
  if (body.startsWith("@portal")) {
    return {
      syntax: "@portal <path>",
      desc: "Portal — marks the current node as a link to another palace",
      example: "@portal /palaces/inner#route@node",
    };
  }
  if (body.startsWith("@")) {
    return {
      syntax: "@<name>",
      desc: "Palace header — required first line. Multi-word names are supported",
      example: "@SOLID Citadel",
    };
  }
  if (body.startsWith(":")) {
    return {
      syntax: ": <text>",
      desc: "Body content — prose for the current node. Multiple lines are joined",
      example: ": fundamental laws of motion",
    };
  }
  if (body.startsWith("#")) {
    return {
      syntax: "#<tag> #<tag> ...",
      desc: "Tags — lowercase letters, digits, dash, underscore. Duplicates ignored",
      example: "#fundamental #laws",
    };
  }
  if (body.startsWith(">")) {
    return {
      syntax: "><target> <cast>",
      desc: "Outgoing edge. CAST is an optional 4-digit shorthand (who/how/what/when)",
      example: ">Newton's Laws 0010",
      extra: castTable(),
    };
  }
  if (body.startsWith("/")) {
    return {
      syntax: "/<name>",
      desc: "Route header — starts a named sequence of nodes",
      example: "/First Walk",
    };
  }
  if (/^\d+\s/.test(body)) {
    return {
      syntax: "<n> <title>",
      desc: "Route step — ordered reference to a node title within the current route",
      example: "1 Newton's Laws",
    };
  }
  return {
    syntax: "<title>",
    desc: "Node title — unique across the palace. Follow with : # > @portal lines",
    example: "Newton's Laws",
  };
}

// ---------------------------------------------------------------------------
// Extension
// ---------------------------------------------------------------------------

export const palaceDslTooltip = [
  hoverTooltip(
    (view, pos) => {
      const line = view.state.doc.lineAt(pos);
      const body = line.text.trim();
      const tip = tipFor(body);
      if (!tip) return null;

      return {
        pos: line.from,
        end: line.to,
        above: true,
        create() {
          const dom = document.createElement("div");
          dom.className = "cm-dsl-tip";
          dom.innerHTML = `
            <div class="cm-tip-syntax">${esc(tip.syntax)}</div>
            <div class="cm-tip-desc">${esc(tip.desc)}</div>
            <div class="cm-tip-example">${esc(tip.example)}</div>
            ${tip.extra ?? ""}
          `;
          return { dom };
        },
      };
    },
    { hideOnChange: true },
  ),
  EditorView.theme({
    ".cm-tooltip": {
      border: "none !important",
      backgroundColor: "transparent !important",
      boxShadow: "none !important",
      padding: "0 !important",
    },
    ".cm-dsl-tip": {
      backgroundColor: "#18181b",
      border: "1px solid #3f3f46",
      borderRadius: "8px",
      padding: "8px 10px",
      maxWidth: "360px",
      boxShadow: "0 8px 32px rgba(0,0,0,0.7)",
      fontFamily: "ui-sans-serif, system-ui, sans-serif",
    },
    ".cm-tip-syntax": {
      fontFamily: "ui-monospace, monospace",
      fontSize: "12px",
      color: "#34d399",
      fontWeight: "700",
      marginBottom: "5px",
      letterSpacing: "0.02em",
    },
    ".cm-tip-desc": {
      fontSize: "11px",
      color: "#a1a1aa",
      lineHeight: "1.5",
      marginBottom: "5px",
    },
    ".cm-tip-example": {
      fontFamily: "ui-monospace, monospace",
      fontSize: "11px",
      color: "#fbbf24",
      backgroundColor: "#27272a",
      padding: "2px 6px",
      borderRadius: "4px",
      display: "inline-block",
    },
    ".cm-tip-cast-label": {
      fontSize: "10px",
      color: "#71717a",
      marginTop: "8px",
      marginBottom: "3px",
      fontStyle: "italic",
    },
    ".cm-tip-cast-table": {
      borderCollapse: "collapse",
      width: "100%",
      fontSize: "10px",
    },
    ".cm-tip-cast-table th": {
      color: "#71717a",
      fontWeight: "600",
      textAlign: "left",
      padding: "2px 6px 2px 0",
      borderBottom: "1px solid #3f3f46",
    },
    ".cm-tip-cast-table td": {
      padding: "2px 6px 2px 0",
      color: "#e4e4e7",
    },
    ".cm-tip-digit": {
      color: "#fb7185",
      fontFamily: "ui-monospace, monospace",
      fontWeight: "700",
    },
  }),
];
