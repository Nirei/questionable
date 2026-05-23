# Questionable

A federated Q&A site in the spirit of StackOverflow, built on ActivityPub.
AGPL-3.0.

This file is the **project bible**: vision, stack, domain model, and the
working agreement that governs every change. [PLAN.md](./PLAN.md) holds the
active plan (what we're doing next and why). Architectural decisions with
non-obvious rationale live as ADRs under [`docs/adr/`](./docs/adr/).

When a CLAUDE.md rule and any other source disagree, CLAUDE.md wins —
update CLAUDE.md if the rule itself is wrong, don't quietly work around it.

## Vision

A self-hostable Q&A community where questions, answers, votes, and
reputation federate over ActivityPub. Each instance owns its users, its
moderation policy, and its content; federation makes the whole network
greater than any one node. We are explicitly not trying to be a hosted SaaS,
an enterprise knowledge base, or a "Reddit clone".

## Stack

| Layer | Choice |
| --- | --- |
| Language / runtime | Elixir 1.18 on Erlang/OTP 27 |
| Web | Phoenix + Phoenix LiveView |
| Data / domain | Ash + `ash_postgres` (Ash domains *are* our Phoenix contexts — see [ADR 0002](./docs/adr/0002-ash-domains-as-contexts.md)) |
| Auth | `ash_authentication` (+ `ash_authentication_phoenix`) |
| Background jobs | Oban |
| Markdown rendering / sanitization | `earmark` + `html_sanitize_ex` |
| Federation | `activity_pub` (Bonfire fork, git dep — see [ADR 0003](./docs/adr/0003-activitypub-library.md)) |
| Database | PostgreSQL 16 |
| Formatter / tests / type analysis | `mix format` / ExUnit / `mix dialyzer` (custom wrapper) |
| Gate | `mix check` (format + compile + xref + test + dialyzer) |

Toolchain is pinned in `.tool-versions` (mise/asdf) and rebuilt in CCWeb
containers by `.claude/hooks/session-start.sh`.

## Domain model (overview)

The core entities, owned by Ash domains:

- **Accounts** — `User` (identity, reputation, profile).
- **QA** — `Question`, `Answer`, `Tag`, `QuestionTag`.
- **Engagement** — `Vote` (on questions or answers), `ReputationEvent`
  (append-only log of reputation changes).
- **Federation** (Phase 7) — adapter layer mapping our domain to AP actors
  and activities; out-of-process delivery via Oban.

Phases are tracked in PLAN.md. Domain expansion (comments, flags,
moderation queue) gets added there as we get to it, not pre-specified.

## Architectural conventions

These are decided and should not be re-litigated per-PR. If you think a
convention is wrong, raise it; don't quietly violate it.

- **Ash domains are the contexts.** No parallel Phoenix context modules
  wrapping Ash. Application code talks to Ash; nothing talks to `Repo`
  directly outside Ash internals. See ADR 0002.
- **Tagged tuples + `with` chains** for expected failures
  (`{:ok, x} | {:error, reason}`). Raise only for programmer errors and
  invariant violations.
- **LiveView for all UI.** No dead views. No REST/GraphQL API in the early
  phases (we'll reconsider only if a real consumer appears).
- **Oban for asynchronous work.** No bespoke GenServers for jobs Oban can
  hold. GenServers exist for stateful processes (e.g. PubSub subscribers)
  and protocol state, not as queues.
- **Test doubles: real first.** Use the real implementation under the Ecto
  sandbox; reach for Mox only at true external boundaries (ActivityPub
  HTTP delivery, email, third-party APIs). See ADR 0005.
- **Markdown is parsed once, on write.** Store both source and sanitized
  HTML. Never render untrusted Markdown straight to the page.
- **AGPL header policy:** the `LICENSE` file is sufficient; no per-file
  headers.

## Working agreement

These rules apply to every change, human or LLM. They are not negotiable
on the fly — if a task seems to require breaking one, stop and surface it.

### Code quality

1. **Quality is the top priority.** Readability and maintainability come
   before cleverness, brevity, or performance (the rare hot path excepted,
   and only with measurements).
2. **Keep it as simple as possible.** Prefer the obvious solution. Three
   similar lines is not yet a pattern — abstract on the third real
   instance, not the first.
3. **Don't repeat yourself, but don't dry-up too early.** Duplication is
   cheaper than the wrong abstraction. The trigger for extraction is a
   real, recurring need, not a perceived future one.
4. **Don't reinvent the wheel.** Prefer in this order: Erlang/OTP stdlib
   → Elixir stdlib → an existing project dep → a new dep (with a one-line
   justification in the PR) → custom code. Custom code is the last resort,
   not the first.
5. **Read the docs.** Phoenix, Ash, Oban, and `ash_authentication` all
   have non-obvious lifecycles, callback contracts, and "gotcha" defaults.
   When using a library function for the first time in a PR, check its
   docs even if the name looks self-explanatory. Especially true for
   anything macro-driven (Ash actions, LiveView lifecycle, Oban workers).

### Process

6. **Stop and ask when it gets complicated.** Triggers include: a "small"
   task that has grown past ~3 files; introducing a new abstraction layer;
   adding a new dep; touching authentication, federation, or migrations;
   any change that's started feeling speculative. Surface the situation
   to the user; don't push through.
7. **Work with the framework, never around it.** No bypassing Ash
   changesets to write to `Repo` directly. No mutating `Plug.Conn` outside
   the standard plug/controller/LiveView pipeline. No hand-rolled
   authentication around `ash_authentication`. If the framework feels
   wrong for the task, raise it — there is almost always an idiomatic
   path you haven't found yet.
8. **Never leave a preexisting issue unresolved.** If you find a bug,
   broken test, dead code, wrong comment, or violated convention while
   doing something else: fix it in the same PR, or open a tracked issue
   and link it from the PR. Never silently step around. "Not my code"
   is not an excuse on a project this small.
9. **A green `mix check` is the contract.** Run it before every commit.
   CI runs it too; don't push knowing it'll fail.

### Tests

10. **Test behaviour, not implementation.** Assert on observable outputs:
    return values, broadcast messages, DB state, rendered HTML, HTTP
    responses, side effects on doubles. Never assert on which private
    function was called, in what order, or with what intermediate value.
    A test that breaks during a pure refactor was testing the wrong thing.
11. **Write the test that would have caught the bug.** Regression fixes
    come with the test that reproduces the bug first.

### Commits & PRs

12. **Commit message style:** imperative subject under ~70 chars, blank
    line, body explaining *why* the change exists (the *what* is in the
    diff). No tags, no scope prefixes — keep it boring.
13. **One logical change per PR** where practical. Refactors and feature
    work go in separate commits at minimum.

## What we are *not* doing

(Mirrors PLAN.md so the bible and the plan agree.)

- No third-party formatters/linters/type-checkers beyond `mix format`,
  the compiler, and dialyzer. Credo would mostly duplicate compiler
  warnings; skip.
- No REST/GraphQL API layer at launch.
- No admin dashboard framework.
- No caching (ETS/Redis) at launch scale; revisit when a measured hot
  path exists.
- No email notifications in early phases.
- No GenServers for work Oban handles.

## Pointers

- [PLAN.md](./PLAN.md) — what we're building right now and what's next.
- [docs/adr/](./docs/adr/) — architecture decisions, why-we-chose-X.
- [README.md](./README.md) — getting started.
