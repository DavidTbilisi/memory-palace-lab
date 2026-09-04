# ROI: Medium
# Psych leverage: Medium-high — a stable identity mark is what lets a node be recognized at
#   a glance and at a distance, which is most of what a canvas is for.
# Tech leverage: Medium; a node field plus a collision check, mirroring verbCollisions.ts.
# Wiki source: theSystem/wiki/representation-rules.md (Rule 11), theSystem/wiki/glossary.md (Rule 4)
# Note: the wiki enforces one unique glyph per concept and keeps a registry. The app has
#   imageUrl but no identity mark and no collision check.

Feature: Concept glyphs
  In order to recognize a concept without reading its label
  As a learner
  I want each concept node to carry one stable, unique glyph

  Background:
    Given wiki concept pages declare a glyph that is unique wiki-wide and stable once assigned
    And app nodes have an optional image but no identity mark

  Scenario: Assign a glyph
    Given the user is editing a concept node
    When they assign a glyph of one or two characters
    Then it is stored on the node and rendered on the canvas shape

  Scenario: Catch a collision
    Given a glyph is already used by another node in the same palace
    When the user tries to assign it again
    Then the collision is reported before the assignment is accepted

  Scenario: Keep a glyph stable
    Given a node already has a glyph
    When the node is renamed or its content is rewritten
    Then the glyph does not change, because a changed identity mark reads as a different concept

  Scenario: Inherit from the wiki
    Given a node was imported from a wiki page that declares a glyph
    When the import runs
    Then the node adopts that glyph rather than minting a new one

  Scenario: Do not confuse the three senses of the word
    Given the wiki separates concept glyphs, glyph sizes, and alphabet glyphs
    When the app names this field in its UI and its docs
    Then it means the concept glyph, and says so

  Scenario: Stay legible when zoomed out
    Given a palace is zoomed out far enough that labels are unreadable
    When the canvas renders
    Then glyphs remain distinguishable, because that is the case they exist for
