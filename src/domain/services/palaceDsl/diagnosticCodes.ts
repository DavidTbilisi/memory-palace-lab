import type { DslDiagnosticCode } from "./types";

/**
 * Single source of truth mapping symbolic diagnostic codes to their numeric
 * identifiers used in IDE integrations, CI pipelines, and AI correction loops.
 *
 * Prefix conventions:
 *   E — error (document invalid for this construct)
 *   W — warning (valid but likely unintended)
 *   I — info (informational)
 *   H — hint (suggestion)
 */
export const DIAGNOSTIC_CODES: Record<DslDiagnosticCode, string> = {
  // E0xx — Document structure
  "missing-palace-header":      "E001",
  "duplicate-title":            "E002",
  "malformed-cast":             "E003",
  "malformed-route-locus":      "E004",
  "invalid-portal-target":      "E005",
  "misplaced-line":             "E006",
  "unknown-target":             "W007",
  "tag-syntax":                 "W008",
  "nedf-pair-incomplete":       "W009",

  // E12x/W12x — Attribute channels (backlog 12)
  "attribute-malformed":        "E121",
  "attribute-channel-unknown":  "E122",
  "attribute-channel-collision":"W123",
  "attribute-route-missing":    "W124",
  "attribute-count-missing":    "W125",
  "attribute-count-mismatch":   "W126",
  "attribute-count-unexpected": "W127",
  "attribute-channel-budget":   "I128",

  // E15x/W15x — Concept glyphs (backlog 15)
  "glyph-invalid":              "E151",
  "glyph-duplicate":            "W152",

  // E16x/W16x — Confusion links (backlog 07)
  "confusion-malformed":        "E161",
  "confusion-duplicate":        "W162",
  "confusion-unknown-target":   "W163",

  // E1xx — Stable node identifiers (Feature 1)
  "malformed-node-id":          "E101",
  "duplicate-node-id":          "E102",
  "reserved-node-id":           "E103",

  // E2xx — Inline node references (Feature 2)
  "inline-ref-unclosed":        "E201",
  "inline-ref-unresolved-id":   "E202",
  "inline-ref-unresolved-title":"W203",
  "inline-ref-unresolved-alias":"W204",
  "inline-ref-self":            "W205",

  // E3xx — Edge semantic aliases (Feature 3)
  "alias-malformed":            "E301",
  "alias-invalid-cast":         "E302",
  "alias-duplicate":            "E303",
  "alias-cast-conflict":        "E304",
  "alias-unresolved":           "W305",

  // E4xx — Import system (Feature 4)
  "import-malformed":           "E401",
  "import-namespace-collision": "E402",

  // W7xx — Route metadata (Feature 7)
  "route-prereq-unresolved":    "W701",
  "route-setting-invalid":      "W702",

  // E8xx — Query/traversal language (Feature 8)
  "query-verb-unknown":         "E801",
  "query-path-missing-arg":     "E802",
  "query-unresolved-node":      "W803",
  "query-unresolved-route":     "W804",
  "query-path-ambiguous":       "W805",
};
