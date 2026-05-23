# 2. Ash domains are the contexts

Date: 2026-05-23

## Status

Accepted.

## Context

A Phoenix app typically organises persistence and business logic into
"contexts" — modules like `Accounts` or `QA` that wrap Ecto. A typical Ash
app does the same job via Ash domains, with resources, actions, and
policies. Layering both — a Phoenix context module wrapping an Ash domain
that wraps Ecto — adds a redundant indirection: every operation gets a
delegating wrapper, and the wrapper inevitably leaks Ash concepts
(changesets, queries, action names) upward, so the abstraction doesn't
actually hide anything.

## Decision

Ash domains *are* our contexts. `Questionable.Accounts`,
`Questionable.QA`, `Questionable.Engagement` are Ash domain modules; no
parallel Phoenix context modules exist.

Concretely:

- LiveViews, controllers, channels, and Oban workers call Ash actions
  directly (via the domain or via `Ash.read/create/update/destroy/4`).
- No application code calls `Questionable.Repo` directly. `Repo` is an
  Ash implementation detail and is only used by Ash internals,
  migrations, and the test helpers (Ecto sandbox).
- Cross-domain orchestration (e.g. accepting an answer adjusts
  reputation) goes in an Ash action with a custom change, or in an
  explicit orchestration module under the domain that initiates it.
  Not in a context wrapper.

## Consequences

- One fewer layer to keep in sync. Action signatures are the public API.
- Newcomers expecting `lib/questionable/accounts.ex` to be a context
  module need to be pointed at the Ash domain instead — README and
  CLAUDE.md both call this out.
- We commit to using Ash idiomatically (actions, changes, policies,
  calculations). Reaching for `Repo` because Ash "feels heavy" for a
  given case is the early warning sign that we're fighting the
  framework, and is a working-agreement violation.
