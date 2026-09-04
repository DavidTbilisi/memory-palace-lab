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

  // E8xx — Query/traversal language (Feature 8)
  "query-verb-unknown":         "E801",
  "query-path-missing-arg":     "E802",
  "query-unresolved-node":      "W803",
  "query-unresolved-route":     "W804",
  "query-path-ambiguous":       "W805",
};
