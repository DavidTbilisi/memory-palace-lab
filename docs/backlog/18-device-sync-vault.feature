# ROI: High
# Psych leverage: Medium — palaces are built over months, and a memory system you can only
#   reach from one machine is one you stop trusting. Review schedules travelling matters most:
#   a palace whose SM-2 state is stranded on the laptop quietly stops being reviewed at all.
# Tech leverage: High; a revision, a content hash, and one small SyncRemote port. No server,
#   no account system, no third-party dependency. A Git remote is a second implementation of
#   the same port rather than a redesign.
# Status: delivered 2026-09 — revision tracking, the pure core, the engine, the Rust vault
#   commands, the Settings UI, and image assets end to end. Behaviour is covered by a
#   two-device simulation in src/domain/sync/vaultSyncEngine.test.ts, and was driven against
#   two real desktop installs and a real shared folder on 2026-09-23
#   (scripts/two-device-sync/). That run found two defects the simulation could not see, both
#   in "keep both": the copy reused its source's row ids, which SQLite rejects outright, and
#   it was forked from the portable form, so it opened with no pictures. Both fixed, both now
#   covered below. Still undriven by hand: keep mine, take theirs, and deletion propagation.

Feature: Device sync vault
  In order to build a palace on one machine and review it on another
  As a learner with a laptop and a desktop
  I want my palaces, routes and review schedules kept in step through a folder I control,
  without handing them to anyone

  Background:
    Given the desktop app
    And a folder both devices can see, such as a Dropbox, iCloud or Syncthing directory

  # Connecting

  Scenario: Creating a vault
    Given Settings with no vault connected
    When I choose a folder and set a passphrase
    Then a vault descriptor is written to that folder
    And I am told plainly that the passphrase cannot be recovered

  Scenario: Joining a vault from a second device
    Given a folder that already holds a vault
    When I connect to it with the same passphrase
    Then the existing descriptor is adopted rather than replaced
    # Replacing it would mint a new salt and make every file already there unreadable.

  Scenario: Joining with the wrong passphrase
    Given a folder that already holds a vault
    When I connect to it with a different passphrase
    Then I am told the passphrase is wrong
    And no connection is remembered
    And nothing in the folder is changed

  Scenario: The passphrase is asked for once per launch
    Given a vault connected in a previous session
    When the app starts
    Then sync is locked until I enter the passphrase
    And the passphrase is not stored on this device in any form

  # Syncing

  Scenario: A palace reaches the other device
    Given a palace with a route and a stop carrying a review schedule
    When I sync on the first device and then on the second
    Then the palace, its route and its schedule are all present on the second device

  Scenario: A settled vault is quiet
    Given two devices that have just synced
    When I sync again on either
    Then nothing is written to the folder
    And I am told everything was already up to date

  Scenario: The folder reveals nothing
    Given a palace called "Very Secret Palace"
    When I sync
    Then no file in the folder contains that name or any palace content

  # Images

  Scenario: A palace arrives with its background intact
    Given a palace with a background image
    When I sync both devices
    Then the image is on the second device, under that device's own path
    # A palace is stored with an absolute local path to its image. The vault holds the image
    # by content hash instead, and each device rewrites the reference to its own copy.

  Scenario: An image is uploaded once however many palaces use it
    Given two palaces sharing one background image
    When I sync
    Then the vault holds a single copy of it

  Scenario: An image the vault has not finished downloading
    Given a palace whose image file is not in the vault yet
    When I sync
    Then the palace still arrives
    And the image reference survives, so the picture appears once the file does

  Scenario: An image file the user moved or deleted
    Given a palace referring to an image that is no longer on disk
    When I sync
    Then the palace syncs anyway, with its reference left as it was

  Scenario: The vault reveals nothing about an image
    Given a palace with a background image
    When I sync
    Then neither the image data nor even its file type is readable in the folder

  # Conflicts

  Scenario: The same palace changed in two places
    Given a palace edited on both devices since they last synced
    When I sync
    Then nothing is written until I choose
    And I am offered keep mine, take theirs, and keep both

  Scenario Outline: Resolving a conflict
    Given a palace in conflict
    When I choose "<choice>"
    Then <outcome>
    And a following sync on both devices writes nothing

    Examples:
      | choice      | outcome                                                              |
      | keep mine   | this device's version replaces the vault's                           |
      | take theirs | the vault's version replaces this device's                           |
      | keep both   | the vault's version lands and my version is kept as a separate palace |

  Scenario: Keep both leaves the copy usable
    Given a conflict resolved with keep both
    Then the copy carries its own palace id throughout its canvas
    And its stops still resolve to its routes, with their review schedules intact
    # The canvas records the palace id on every shape; a copy that kept the old one would
    # have every node silently re-identified on the next edit, orphaning every stop.

  Scenario: Keep both saves at all
    Given a conflict resolved with keep both
    Then the copy shares no stop, route, node, edge or canvas id with the palace it came from
    # Those ids are unique across the whole database, not within a palace, so a copy that
    # reused them is rejected on save and the resolution fails outright. Found on the first
    # real two-device run, having passed in simulation.

  Scenario: Keep both leaves the copy's pictures showing
    Given a conflict resolved with keep both, on a palace with a background
    Then the copy's images point at files on this device, not at vault references
    # The engine carries a portable form of each palace for the vault's benefit, with every
    # image rewritten to a content hash. Copying that one leaves the palace pointing at
    # references this device cannot draw, so it opens blank while the files sit on disk.

  Scenario: Both devices happened to make the same edit
    Given a palace whose content is now identical on both devices
    When I sync
    Then I am not asked to resolve anything

  # Deletion

  Scenario: A deleted palace reaches the trash on the other device
    When I delete a palace and sync both devices
    Then it is in the trash on the other device, and can be restored there

  Scenario: A purged palace does not come back
    Given a palace purged on the first device
    When both devices sync, repeatedly
    Then it does not reappear on either

  Scenario: A palace edited elsewhere after being purged here
    Given a palace purged here and edited on another device afterwards
    When I sync
    Then I am asked to choose rather than losing the edit

  # Failure

  Scenario: The sync app is still writing a file
    Given a vault file that is only half written
    When I sync
    Then that palace is reported as unreadable and left exactly as it is
    And every other palace in the plan still syncs
    And a later sync picks it up once the file is whole

  Scenario: The folder is empty or has not downloaded
    Given a vault folder whose contents are missing
    When I sync
    Then nothing local is deleted
    # Absence means "not pushed yet". Only an explicit tombstone removes anything.

  Scenario: Files the folder's own sync app created
    Given a conflicted copy or an undownloaded placeholder sitting in the vault
    When I sync
    Then it is ignored, and I am told how many files were ignored

  Scenario: Two devices with clocks that disagree
    Given devices whose clocks are wrong by days
    When I sync
    Then every decision is the same as it would be with correct clocks
    # No branch of the conflict rule reads a timestamp.
