# ROI: High
# Psych leverage: High when effects encode meaning, low when they are only decorative.
# Tech leverage: Medium, because this is mostly UX unless it is tied to analytics and review states.

Feature: Semantic magic theme engine
  In order to make material more distinctive and emotionally salient
  As a learner
  I want neon, glow, and magical effects to carry mnemonic meaning

  Background:
    Given the core review and analytics loop exists

  Scenario: Encode meaning through visual effects
    Given nodes and edges have semantic states
    When the graph is rendered
    Then visual effects map to meaning such as stable, weak, overdue, causal, dangerous, or portal

  Scenario: Avoid uniform glow
    Given a palace contains many objects
    When magic styling is applied
    Then not every object receives the same glow treatment
    And the strongest effects are reserved for the most important distinctions

  Scenario: Link visuals to review state
    Given review strength data exists
    When a node is weak or overdue
    Then its visual treatment reflects that state in a stable and legible way

  Scenario: Theme a palace intentionally
    Given a user wants a palace to feel like a neon district, ritual chamber, or storm archive
    When the user applies a theme
    Then the theme affects the palace consistently without harming readability

  Scenario: Respect performance
    Given a large palace is open
    When effects are enabled
    Then animation and glow do not make the app feel sluggish or noisy

