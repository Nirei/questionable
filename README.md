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
