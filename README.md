# Questionable

A federated Q&A site, in the spirit of StackOverflow, built on ActivityPub.
Phoenix LiveView + Ash + Elixir/OTP. AGPL-3.0.

- **[CLAUDE.md](./CLAUDE.md)** — project bible: vision, stack, conventions,
  and the working agreement that governs every change. Start here.
- **[PLAN.md](./PLAN.md)** — what's currently being built and how.
- **[docs/adr/](./docs/adr/)** — architecture decisions and their rationale.

## Getting started

Toolchain: Erlang/OTP 27, Elixir 1.18 (pinned in `.tool-versions`).
PostgreSQL 16 is required once Phase 1 lands.

```bash
mise install                # or: asdf install
mix deps.get
mix check                   # format + compile + xref + test + dialyzer
```

`mix check` is the single gate that has to pass before every commit and is
enforced by CI on every PR.

### Optional: pre-commit hook

To run `mix check` automatically before each commit, point git at the
checked-in hooks once:

```bash
git config core.hooksPath .githooks
```

(Disable again with `git config --unset core.hooksPath`.)

## Deploying

The project ships as a Docker image built directly on the VPS — no
registry, no CI write access to the host. See
[ADR 0006](./docs/adr/0006-deployment-docker-compose.md) for the why.

On the VPS (one-time):

```bash
git clone https://github.com/Nirei/questionable.git
cd questionable
cp .env.example .env
# Fill in PG_PASSWORD, SECRET_KEY_BASE (openssl rand -base64 64 | tr -d '\n'),
# RELEASE_COOKIE (openssl rand -hex 32), and PHX_HOST.
docker compose up -d --build
```

Proxy your existing nginx to `127.0.0.1:4000` (or whatever you set
`PHX_PORT` to). To deploy a new version:

```bash
git pull
docker compose up -d --build
```

The Postgres volume (`pgdata`) is the source of truth for everything
durable — including the ActivityPub actor private keys. **Back it up**:
losing it permanently breaks federation, since other servers cache our
public key and there is no rotation protocol. A nightly `pg_dump` to
off-box storage is the minimum.
