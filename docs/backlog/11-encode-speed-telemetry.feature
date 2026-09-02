# ROI: High
# Psych leverage: High — encoding speed is the trainable half of the loop, and the half
#   that decides whether a graph can be built live rather than assembled afterwards.
# Tech leverage: Medium; the timing helper already exists, the events do not.
# Wiki source: theSystem/wiki/cast-overview.md, theSystem/wiki/skill-progression-stages.md
# Note: palaceStore.ts already records timeToRevealMs and timeFromRevealToRatingMs on recall.
#   Nothing times the encode. "Am I encoding faster than last month?" is currently unanswerable.

Feature: Encode-speed telemetry
  In order to know whether my encoding is getting faster, not just more accurate
  As a learner
  I want the app to time node and edge construction the way it already times recall

  Background:
    Given walk mode measures how long recall takes
    And nothing measures how long it takes to build a node or an edge

  Scenario: Time a node encode
    Given the user creates a node
    When they finish editing it and apply the change
    Then a node_encoded event records the elapsed time from creation to apply

  Scenario: Time a CAST edge encode
    Given the user starts the Connect workflow
    When they commit an edge with its four CAST slots filled
    Then an edge_encoded event records the elapsed time and which slots were filled

  Scenario: Do not count time the user was away
    Given the user starts a node and leaves the app for an hour
    When they return and apply the change
    Then the recorded encode time excludes the idle period
    And an encode that cannot be timed honestly is recorded as unmeasured rather than as a large number

  Scenario: Auto-tier by encode speed
    Given a node has a recorded encode time
    When the tiering rule runs
    Then the node is assigned a speed tier
    And the tier is derived from the learner's own distribution, not a fixed global threshold

  Scenario: Feed the difficulty estimator
    Given a node has both an encode time and a difficulty unit
    When the difficulty adapter runs
    Then encode time is available as an input alongside the auto-derived graph fields
    And a learner-set difficulty override still wins over the derived value

  Scenario: Report the trend
    Given at least four weeks of encode events exist
    When the user opens Insights
    Then median encode time per node and per edge is charted over time
    And the chart distinguishes first encodes from re-edits, because re-editing a known node is not encoding
