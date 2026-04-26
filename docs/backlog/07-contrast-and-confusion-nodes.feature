# ROI: High
# Psych leverage: High, because many memory failures are confusion and interference failures.
# Tech leverage: Medium, because it mainly extends the node model and review prompts.

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

