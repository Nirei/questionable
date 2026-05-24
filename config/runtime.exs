import Config

# Release-time configuration. Evaluated inside the running container when
# the release boots (not at compile time), so this is the right place to
# read `DATABASE_URL`, `SECRET_KEY_BASE`, `PHX_HOST`, `PHX_PORT`, and
# `RELEASE_COOKIE` from the environment. Phase 1 fills it in.
