# Palace: Hub
@atlas /index/main

== Gateway
  > entry to the inner palace
  ~portal /palaces/inner
  #entry

== Detailed Portal
  > targeted at a specific route and node
  ~portal /palaces/inner#fast-walk@start
  #targeted

== Plain Memory
  > not a portal
  -> Gateway          ::1000
  -> Detailed Portal  ::0010
