# Palace: SOLID Citadel

== Gate of SOLID
  > Central fortress connecting five engineering districts. Giant glowing word "SOLID" above the gate.
  #architecture #clean-code #oop #solid
  -> Single Responsibility Forge  ::0001
  -> Open Closed Library          ::0011
  -> Liskov Arena                 ::0010
  -> Interface Harbor             ::0101
  -> Dependency Tower             ::0111

== Single Responsibility Forge
  > Blacksmith focuses only on forging swords. Every time he tries cooking or accounting, the sword cracks.
  #cohesion #maintenance #srp
  -> Change Hydra         ::1000
  -> Open Closed Library  ::0100

== Change Hydra
  > Multi-headed hydra grows a new head whenever one class gets too many responsibilities.
  #chaos #coupling #maintenance

== Open Closed Library
  > Infinite magical library where new shelves appear without rebuilding old walls.
  #abstraction #extensibility #ocp
  -> Plugin Wizard  ::0011
  -> Liskov Arena   ::0110

== Plugin Wizard
  > Wizard inserts extension crystals into existing machines to add new powers safely.
  #composition #extension #plugins

== Liskov Arena
  > Knights replace one another in combat. Any replacement must fight correctly without surprising behavior.
  #inheritance #lsp #substitution
  -> Broken Penguin    ::1001
  -> Interface Harbor  ::0010

== Broken Penguin
  > Penguin forced into flying machine crashes into canyon because not every bird can fly.
  #anti-pattern #inheritance #violation

== Interface Harbor
  > Harbor workers carry small specialized toolkits instead of giant universal backpacks.
  #focused-interfaces #isp #modularity
  -> Fat Whale Interface  ::1110
  -> Dependency Tower     ::0100

== Fat Whale Interface
  > Giant whale drags thousands of useless tools chained to its body.
  #bloated-api #unused-methods

== Dependency Tower
  > Engineers communicate through glowing abstract contracts instead of directly wiring machines together.
  #abstraction #decoupling #dip
  -> Crystal Contracts  ::1010
  -> Gate of SOLID      ::0001

== Crystal Contracts
  > Floating crystal sockets allow any compatible machine to connect safely.
  #abstraction #contracts #dependency-injection

== SOLID Compression Room
  > Five floating symbols rotate in the air: Hammer, Expanding Shelf, Knight, Toolkit, Crystal Socket.
  #compression #mnemonics #recall

== Crumbling Library
  > Rebuilding the library destroys old walls because extension requires modifying the core structure.
  #ocp #rigidity #violation

== Exploding Wiring
  > Direct machine wiring explodes the tower whenever one concrete part changes.
  #coupling #dip #violation

:: Route "SOLID Main Route"
  1. Gate of SOLID
  2. Single Responsibility Forge
  3. Open Closed Library
  4. Liskov Arena
  5. Interface Harbor
  6. Dependency Tower
  7. SOLID Compression Room

:: Route "Violation Route"
  1. Change Hydra
  2. Crumbling Library
  3. Broken Penguin
  4. Fat Whale Interface
  5. Exploding Wiring
