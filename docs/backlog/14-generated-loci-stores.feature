# ROI: Medium-high
# Psych leverage: High — an addressable store removes the "I have run out of palaces" ceiling,
#   which is the usual reason a mnemonic practice stalls.
# Tech leverage: High — this is a palace generator, and generating palaces is the one thing
#   this app can do that a markdown wiki cannot.
# Wiki source: theSystem/wiki/table-of-support-images.md, theSystem/wiki/four-level-blocks.md,
#   theSystem/wiki/peg-system.md

Feature: Generated addressable loci stores
  In order to stop hand-placing every locus
  As a learner
  I want the app to generate numerically-addressed loci stores from a number code I already know

  Background:
    Given every node in a palace is currently placed by hand
    And the learner already has automatized two-digit number images
    And two self-generating store designs exist: the table of support images and the four-level block

  Scenario: Generate a table of support images
    Given the learner supplies their hundred two-digit number images
    When they generate a table of support images
    Then a palace is created whose cells are numerically addressed
    And each cell is derived by free association and part-subdivision from its number image

  Scenario: Generate a four-level block
    Given the learner names a theme
    When they generate a four-level block
    Then a five-by-five lattice of nested support images is created
    And every locus carries a three-digit address

  Scenario: Jump to an address
    Given a generated store exists
    When the user enters an address
    Then the canvas navigates to that locus directly, without walking the route

  Scenario: Fill a cell without breaking its address
    Given a generated cell is empty
    When the user stores material in it
    Then the material attaches to the cell
    And the cell keeps its address, because the address is what makes the store usable

  Scenario: Keep generated and walked palaces distinguishable
    Given a learner has both hand-built palaces and generated stores
    When they browse the atlas
    Then generated stores are marked as such
    And a generated store is not silently treated as a walked route

  Scenario: Regenerate without destroying stored material
    Given a generated store already holds encoded material
    When the learner regenerates it
    Then the app refuses to overwrite occupied cells without an explicit confirmation
