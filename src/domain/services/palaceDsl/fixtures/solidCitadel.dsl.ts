/**
 * A user-authored document that crashed the DSL apply on 2026-09-05 with
 * "At shape(type = geo).meta: Expected json serializable value, got
 * undefined". It mixes ids, aliases, imports, inline references, structured
 * tags, a route, and queries, and none of its nodes declares `@image`.
 */
export const SOLID_CITADEL_DSL = `@SOLID Citadel
@atlas /engineering/oop

~dep:0001 depends on
!import shared.dsl as sh

[gate] Gate of SOLID
: Central fortress connecting five engineering districts.
: Giant glowing word "SOLID" above the gate.
#architecture #clean-code #solid #difficulty:beginner
>Single Responsibility Forge 0001
>Open Closed Library dep

Single Responsibility Forge
: Blacksmith focuses {#gate on the gate} — one thing only.
#cohesion #maintenance #srp
>Change Hydra 1000

/SOLID Main Route
#difficulty:beginner
1 Gate of SOLID
2 Single Responsibility Forge

?tag difficulty:beginner
?path Gate of SOLID Single Responsibility Forge
`;
