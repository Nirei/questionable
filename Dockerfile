# Multi-stage production image. Builder compiles the OTP release; runner
# is a stripped Debian slim with only the runtime libs the release needs.
# See docs/adr/0006-deployment-docker-compose.md for the why.

ARG BUILDER_IMAGE="hexpm/elixir:1.18.4-erlang-27.3.4-debian-bookworm-20260518-slim"
ARG RUNNER_IMAGE="debian:bookworm-20260518-slim"

# ── Builder ──────────────────────────────────────────────────────────
FROM ${BUILDER_IMAGE} AS builder

RUN apt-get update -qq \
 && apt-get install -y --no-install-recommends build-essential git ca-certificates \
 && apt-get clean && rm -rf /var/lib/apt/lists/*

ENV MIX_ENV=prod
WORKDIR /app

RUN mix local.hex --force && mix local.rebar --force

# Dependency layer — cached on mix.exs / mix.lock changes only.
COPY mix.exs mix.lock* ./
COPY config config
RUN mix deps.get --only prod
RUN mix deps.compile

# App sources — recompile only when these change.
COPY lib lib
COPY priv priv

# Phase 1 will add assets (esbuild + tailwind via mix). Uncomment then:
# COPY assets assets
# RUN mix assets.deploy

RUN mix compile
RUN mix release

# ── Runtime ──────────────────────────────────────────────────────────
FROM ${RUNNER_IMAGE}

RUN apt-get update -qq \
 && apt-get install -y --no-install-recommends \
      libstdc++6 openssl libncurses6 locales ca-certificates tini \
 && apt-get clean && rm -rf /var/lib/apt/lists/* \
 && sed -i '/en_US.UTF-8/s/^# //g' /etc/locale.gen && locale-gen

ENV LANG=en_US.UTF-8 \
    LC_ALL=en_US.UTF-8 \
    ELIXIR_ERL_OPTIONS="+fnu" \
    HOME=/app

WORKDIR /app
RUN useradd --create-home --uid 1000 --shell /bin/bash app \
 && chown app:app /app

USER app
COPY --from=builder --chown=app:app /app/_build/prod/rel/questionable ./

EXPOSE 4000

# tini is PID 1 — reaps zombies and forwards signals to the BEAM so
# `docker stop` produces a clean shutdown instead of a 10s SIGKILL.
ENTRYPOINT ["/usr/bin/tini", "--"]
CMD ["bin/questionable", "start"]
