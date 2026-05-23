# 3. Use Bonfire's `activity_pub` library (git dependency)

Date: 2026-05-23

## Status

Accepted.

## Context

Phase 7 of the roadmap is the ActivityPub adapter. We surveyed what's
available in the Elixir ecosystem before committing:

- **`activity_pub` on hex.** A single 0.1.0 release from January 2018,
  unmaintained. The name on hex is squatted by an unrelated package.
- **`activity_pub_client` on hex.** A client-only library (consume AP
  feeds); does not implement the server-side inbox/outbox/delivery we
  need.
- **`activity_streams` on hex.** AS2 vocabulary types only; no
  federation logic.
- **Pleroma / Akkoma.** Their AP implementation lives in-tree as part of
  the application; not packaged as a reusable library.
- **`bonfire-networks/activity_pub`.** Actively maintained by the Bonfire
  team, used in production by Bonfire, full server implementation
  (HTTP signatures, inbox/outbox, delivery, instance blocking). Not
  published to hex — distributed as a git dependency only.

Our stated preference is to use hex packages. None of the hex options
meets the bar of "reputable, well-maintained, server-side". Bonfire's
library does, but at the cost of a git dependency.

We also considered building it ourselves from primitives
(`plug_signature`, `req`, `jason`, custom AS2 handling). That defers the
real work without removing it: a usable AP implementation is weeks of
protocol detail (HTTP sig verification edge cases, JSON-LD pitfalls,
delivery retry semantics, blocklist mechanics) we would re-derive
unnecessarily.

## Decision

Use `bonfire-networks/activity_pub` as a git dependency, pinned by SHA
(not branch) for reproducibility:

```elixir
{:activity_pub, git: "https://github.com/bonfire-networks/activity_pub",
 ref: "<sha>"}
```

The `stable` branch is the upstream's tracked branch; we pin to the
commit on that branch at the time of each bump.

## Consequences

- We accept a non-hex dependency for one library, with the SHA pinned in
  `mix.lock` for reproducibility.
- Upgrades require manually advancing the `ref` to a newer commit on
  `stable` and re-running `mix deps.get`.
- If the upstream goes unmaintained or diverges from our needs, we own
  the fork. The protocol is bounded; a fork would be expensive but
  finite.
- Revisit if a reputable server-side AP library reaches hex (open a new
  ADR superseding this one).
