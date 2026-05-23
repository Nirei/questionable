# 5. Test doubles: real implementations first, Mox at boundaries

Date: 2026-05-23

## Status

Accepted.

## Context

Elixir projects routinely reach for `Mox` to stub out dependencies in
tests, on the model "every collaborator gets a behaviour and a mock". The
result is often tests that pass while the real code is broken, because
they assert on the shape of the stubbed interaction rather than on
behaviour. This is the failure mode CLAUDE.md's "test behaviour, not
implementation" rule is meant to prevent.

The alternative — using real implementations under the Ecto sandbox — is
the default Phoenix and Ash story: the DB is fast enough, transactions
isolate tests, and you exercise the actual code path including Ash
actions, policies, and changes.

## Decision

- **Default: real implementations + Ecto sandbox.** Tests for Ash
  actions, LiveViews, controllers, and Oban workers run against the
  real Ash resources backed by the real (sandboxed) Postgres. Use
  `Ash.Seed` (not `ex_machina`) to set up test fixtures, since it
  composes with Ash's policies and changesets.
- **Mox only at true external boundaries** that we cannot stand up in
  the test DB: outbound ActivityPub HTTP delivery, email transport,
  third-party APIs. These already have explicit behaviours (or get
  one when introduced) and a Mox mock generated from that behaviour.
- **No mocks for our own modules.** If you find yourself wanting to
  mock `Questionable.QA`, stop — write the test against the real
  domain instead, or extract the boundary that genuinely needs a mock
  and document it.

## Consequences

- Tests are slightly slower than a fully-mocked suite, but exercise
  real code paths, including Ash policy and changeset behaviour.
- Refactors don't break tests unless they change observable behaviour.
- New external integrations require an explicit behaviour module before
  they can be tested — a small upfront cost that pays off in
  swappability.
- We avoid `ex_machina` for fixtures; if a case really needs builder
  ergonomics beyond `Ash.Seed`, raise it as a working-agreement
  trigger before adding the dep.
