# ROI: High
# Psych leverage: High, because many memory failures are confusion and interference failures.
# Tech leverage: Medium, because it mainly extends the node model and review prompts.
# Status: delivered 2026-09 in two PRs. PR 1: a confusion link is an edge of kind "confusion"
#   (edges.kind, arrow meta mpEdgeKind), drawn as an unlabelled dashed amber arc with no heads,
#   at most one per pair; made from the inspector ("Confused with…" beside the Distinguisher),
#   the Connect dialog, the DSL (`<>Neighbour`), or MCP (`kind` on the edge tools). Graph
#   analysis, difficulty, motifs, and the crux skip it. The Distinguisher card then asks "Which
#   is it: A or B? Say why." "What this is not" is the Distinguisher slot itself: its structured
#   {prompt, reason} pair states the separation from the nearest neighbour and why.
#   PR 2: rating Again asks, without holding the walk up, "Mixed it up with…" (a searchable
#   picker of the palace's other nodes, linked neighbours first) or "Couldn't produce it" (a
#   blank, not a confusion); both log recall_miss_explained, stamped Storm like the rating. A
#   logged confusion brings both nodes' Distinguisher cards due at once on routes in review
#   (never later, other slots untouched), names a node that has no Distinguisher, and the first
#   time a pair is logged offers to link it. Insights › Strength lists confusion hotspots from
#   Siege misses: a pair logged twice, or once and not linked, ranked by count then recency;
#   one starts a recall walk at a Distinguisher card. The event is not sent to METER, which
#   already gets the miss from the rating.

Feature: Contrast and confusion nodes
  In order to reduce concept collisions and false recall
  As a learner
  I want first-class support for confusions, contrasts, and "not this" explanations

  Background:
    Given the user is learning concepts that are similar or easily mixed up

  Scenario: Mark a common confusion
    Given two concepts are easy to confuse
    When the user links them as a confusion pair
    Then the app records that relationship explicitly

  Scenario: Store "what this is not"
    Given a node is prone to fuzzy understanding
    When the user adds a contrast note
    Then the node can display what it is not and why

  Scenario: Use confusion in review
    Given a concept has known collisions
    When the user reviews it
    Then the app can ask discrimination-style questions instead of only recall questions

  Scenario: Surface collisions in analytics
    Given multiple failures cluster around the same concept pair
    When analytics are computed
    Then the dashboard marks that pair as a confusion hotspot

  Scenario: Preserve graph clarity
    Given confusion links exist
    When the graph is rendered
    Then confusion links are visually distinct from normal semantic or CAST links

