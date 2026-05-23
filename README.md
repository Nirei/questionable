# Questionable

A federated Q&A site, in the spirit of StackOverflow, built on ActivityPub.
Phoenix LiveView + Ash + Elixir/OTP. AGPL-3.0.

See [CLAUDE.md](./CLAUDE.md) for the design and conventions; see
[PLAN.md](./PLAN.md) for what's currently being built and how.

## Getting started

Toolchain: Erlang/OTP 27, Elixir 1.18 (pinned in `.tool-versions`).

```bash
mise install                # or: asdf install
mix deps.get                # needs hex.pm access — see PLAN.md
mix check                   # format + compile + xref + test + dialyzer
```

`mix check` is the single gate that has to pass before every commit.
