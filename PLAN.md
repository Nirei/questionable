# Questionable — Development Plan

This file is the **active plan**. CLAUDE.md is the project bible (vision,
domain model, conventions). PLAN.md is what we're doing next and why.

## Current state

Phase 0 (tooling). The project compiles, formats, tests, and type-checks
with **zero third-party hex dependencies**. Everything below is built on
the Erlang/OTP + Elixir distributions only.

| Concern        | Tool                              | Invocation                   |
| -------------- | --------------------------------- | ---------------------------- |
| Formatting     | `mix format`                      | `mix format`                 |
| Compile warns  | Elixir compiler `--warnings-as-errors` | wired into `mix compile` (dev/test) |
| Tests          | `mix test` (ExUnit)               | `mix test`                   |
| Coverage       | `mix test --cover` (built-in)     | `mix test.cover`             |
| Dep cycles / unused| `mix xref graph --label compile-connected --fail-above 0` | inside `mix check` |
| Type analysis  | `mix dialyzer` (custom wrapper, no dialyxir) | `mix dialyzer`        |
| Gate           | `mix check` — runs all of the above in order | `mix check`           |

**Run `mix check` before every commit.** A green `mix check` is the contract.

## The hex.pm constraint

This Claude Code on the web environment cannot reach `repo.hex.pm` or
`builds.hex.pm` (network allowlist; we are not the admins). Direct
consequences:

- `mix deps.get` of any hex package fails.
- `mix archive.install hex` (bootstrap) fails — it redirects to repo.hex.pm.
- `mix phx.new` would fail at the deps step.
- Therefore no Phoenix / Ash / Oban / etc. can be installed from inside this
  container.

What works: GitHub (releases, raw, repos), npm, pypi, rubygems, ubuntu apt.

### Unblock path

We need `deps/` and `mix.lock` to materialise *somehow*. Three options,
ranked:

1. **Vendor `deps/` via tarball on a GitHub release** *(recommended)*.
   Off-box (your laptop), run `mix deps.get && tar --zstd -cf deps.tar.zst deps mix.lock`.
   Upload `deps.tar.zst` as an asset on a `vendored-deps-vN` GitHub release
   in `nirei/questionable`. The SessionStart hook downloads + extracts it
   on container start. Repo stays small; deps stay reproducible; bumps are
   "run locally, re-upload tarball".

2. **Commit `deps/` to git directly.** Same idea, no tarball. Simplest, but
   bloats clones (~100–300 MB once Phoenix+Ash are in). Acceptable if
   bandwidth is cheap and we don't update deps often.

3. **Declare every transitive dep as `{:dep, git: "...", override: true}`
   in `mix.exs`.** Pure mix, no vendoring. ~80–100 entries pinned to SHAs,
   re-pinned on every bump. Rejected: unmaintainable for this stack.

`/deps/` is currently gitignored. Pick an option and we'll adjust.

## Phased roadmap

Carries over the plan from CLAUDE.md, anchored to today's tooling state.

- **Phase 0 — Tooling (done).** This commit.
- **Phase 1 — Project scaffold.**
  Add deps to `mix.exs`: `phoenix`, `phoenix_live_view`, `ash`,
  `ash_postgres`, `ash_phoenix`, `ash_authentication`,
  `ash_authentication_phoenix`, `oban`, `earmark`, `html_sanitize_ex`,
  `{:activity_pub, git: "..."}`. Wire `phoenix_live_view` and `ash`
  formatter rules into `.formatter.exs` via `import_deps:`. Bring up the
  Repo, Endpoint, Router. `mix check` stays green.
- **Phase 2 — Core domain (Accounts + QA).** `User`, `Question`, `Answer`,
  `Tag`, `QuestionTag` Ash resources. Migrations via `ash_postgres`.
- **Phase 3 — Voting & reputation.** `Vote`, `ReputationEvent`; side
  effects; reputation gating in policies.
- **Phase 4 — Authentication.** `ash_authentication` password strategy
  on `User`; LiveView login/register.
- **Phase 5 — LiveView UI.** Layouts, `QuestionsLive.*`, voting,
  accept-answer, PubSub broadcasts.
- **Phase 6 — Search & tags.** PostgreSQL tsvector; `SearchLive`, tag pages.
- **Phase 7 — ActivityPub.** Adapter, transformer, AP routes, content
  negotiation, `DeliverActivity` worker.
- **Phase 8 — Moderation & polish.** Close/reopen, mod dashboard, flagging,
  rate limits, profile pages, SEO.

Each phase ends with a green `mix check` and tests for that phase's
behaviour.

## Toolchain reproducibility

- `.tool-versions` pins Erlang 27.3.4 + Elixir 1.18.4-otp-27 for mise/asdf.
- `.claude/hooks/session-start.sh` rebuilds the toolchain from GitHub
  releases when a Claude Code on the web container starts. First container
  takes ~10–15 min (Erlang source build); subsequent sessions exit in <1s
  because container state is cached.
- `.editorconfig` covers cross-editor whitespace.
- `.formatter.exs` is the single source of truth for code style.

## What we are *not* doing

(Mirrors CLAUDE.md "What NOT To Do" so the active plan stays honest.)

- No third-party formatters, linters, or type-checkers beyond what's listed
  above. `Credo` would mostly duplicate compiler warnings + dialyzer; skip.
  Dialyxir would just wrap Erlang's dialyzer; we wrote our own ~150-line
  task instead (also unblocks the hex.pm constraint).
- No REST/GraphQL API layer.
- No admin dashboard framework.
- No caching (ETS/Redis) at launch scale.
- No email notifications in early phases.
- No GenServers for work Oban handles.
