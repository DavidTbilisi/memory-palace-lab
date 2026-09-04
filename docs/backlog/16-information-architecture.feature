# ROI: High
# Psych leverage: High — the app's reference material was split across five surfaces with no
#   links between them, so users could not find what they had already been given.
# Tech leverage: High; a page registry, one navigation channel, and one content index replace
#   seven edit sites and four copies of the same onboarding content.
# Status: delivered 2026-09. Includes the wiki search index, one due-queue service behind the
#   nav badge / Review / Insights / Next-up card, "Encode this" from any Library document, and
#   review chaining from the session summary.

Feature: Information architecture
  In order to find lessons, guides, the wiki, and settings without hunting
  As a learner
  I want one Library, a grouped navigation, and one Settings page

  Background:
    Given the app used to have eight flat tabs, a Help page duplicating the Learn rail, docs under System, and settings inside Insights

  Scenario: One Library for reference content
    When the user opens Library
    Then Start here, Guides, Wiki, Glossary, and Reference are browsable as sections
    And typing in the search box searches every section at once
    And a wiki page body is loaded only when it is opened

  Scenario: Grouped navigation
    When the user looks at the header
    Then the primary tabs are Graph, Review, Insights, System, and Library
    And the active group shows its views (Canvas, Routes, Atlas map; Analytics, Difficulty) as inline sub-tabs
    And the Encode/Comprehend switch and a Settings gear live in the right-hand control cluster

  Scenario: Settings in one place
    When the user opens Settings
    Then the daily review goal, Anthropic API key, idle tips, atlas terminology, backup/restore, updates, and shortcuts are editable there
    And the values are stored under the same keys they used before

  Scenario: Routes edited beside the canvas
    Given a palace with a route
    When the user opens the route panel from the toolbar or the palette
    Then they can add the selected node, reorder and relabel loci, and move or delete the route in one panel

  Scenario: Deep links into the Library
    When the user picks a Docs entry in the command palette, clicks "Read the guide" on a pipeline, or follows a link inside a document
    Then the Library opens on that document and section

  Scenario: Encode a document
    Given a palace is open and a Library document is showing
    When the user chooses "Add as node" or "Run as pipeline"
    Then a titled node appears on the canvas, or the System workbench opens with the document's sections as steps

  Scenario: Next review is one click away
    Given loci are due in any palace
    When the user is on the Graph page
    Then a Next-up strip names the next due locus and starts it in walk mode
    And finishing a walk offers "Review next due" straight from the summary
