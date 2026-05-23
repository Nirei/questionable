# 4. Install PostgreSQL in the SessionStart hook

Date: 2026-05-23

## Status

Accepted.

## Context

From Phase 1 onward the project needs PostgreSQL: `ash_postgres`
migrations, the `mix ecto.*` workflow, and the Ecto sandbox for tests.
CCWeb (Claude Code on the web) containers start from a clean Ubuntu image
and the SessionStart hook is the standard place to install anything the
project needs that isn't in the base image.

Three options:

1. **Install via apt in the SessionStart hook.** Ubuntu 24.04 ships
   PostgreSQL 16 in `noble-updates`. Install is cached in the
   container's filesystem snapshot, so it pays the cost once.
2. **Docker / Compose.** Standard locally but doubles the bootstrap
   complexity in CCWeb (Docker-in-container, daemon lifecycle).
3. **Defer.** Leave Phase 1 to fail loudly when migrations are first
   attempted, and figure it out then.

## Decision

Install PostgreSQL 16 in the SessionStart hook alongside Erlang/Elixir:
`apt-get install -y postgresql postgresql-contrib`, start the cluster,
create a superuser role for the dev user, and persist the connection
info via the standard `PG*` env vars. Idempotent — re-runs (cached
container) exit fast.

Locally, developers are expected to provide their own Postgres
(homebrew, docker, system package — their choice); the hook only runs
in CCWeb (`CLAUDE_CODE_REMOTE=true`).

## Consequences

- Phase 1 can run `mix ecto.create && mix ecto.migrate` in a fresh
  CCWeb container with no extra setup.
- The hook gains ~30s of install on the first container; subsequent
  sessions skip it (Postgres binary present).
- We are pinned to whatever Postgres ships in Ubuntu's repos (16 today,
  17 when Ubuntu ships it). That's acceptable for a side-project dev
  environment; production deployment is a separate concern with its own
  version pin.
- We do **not** vendor Postgres data into the container snapshot — the
  cluster's data directory is initialised on first use. Test data is
  ephemeral; nothing valuable lives in the dev DB.
