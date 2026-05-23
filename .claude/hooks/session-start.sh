#!/bin/bash
# Installs the Erlang/OTP + Elixir toolchain so this project's `mix` commands
# work in Claude Code on the web. The first run takes ~10-15 minutes to
# compile Erlang from source; the container's filesystem is cached, so
# subsequent sessions exit in <1s.
#
# We build from GitHub releases because builds.hex.pm and packages.erlang-
# solutions.com are not on the network allowlist. See PLAN.md.
set -euo pipefail

# Only run in Claude Code on the web. Locally, the dev sets up their own
# toolchain (e.g. via the .tool-versions file).
if [ "${CLAUDE_CODE_REMOTE:-}" != "true" ]; then
  exit 0
fi

ERLANG_VERSION="27.3.4"
ELIXIR_VERSION="1.18.4"
ELIXIR_OTP_MAJOR="27"

# Persist runtime env for the session.
{
  echo 'export LANG=en_US.UTF-8'
  echo 'export LC_ALL=en_US.UTF-8'
  echo 'export ELIXIR_ERL_OPTIONS="+fnu"'
} >> "${CLAUDE_ENV_FILE:-/dev/null}"

export LANG=en_US.UTF-8
export LC_ALL=en_US.UTF-8

if ! locale -a 2>/dev/null | grep -qi 'en_us.utf-\?8'; then
  sudo locale-gen en_US.UTF-8 >/dev/null
fi

install_erlang() {
  if command -v erl >/dev/null 2>&1 \
     && erl -noshell -eval 'erlang:display(erlang:system_info(otp_release)),halt()' 2>/dev/null \
        | grep -q "\"${ELIXIR_OTP_MAJOR}\""; then
    echo "Erlang/OTP ${ELIXIR_OTP_MAJOR} already installed."
    return 0
  fi

  echo "Installing Erlang/OTP ${ERLANG_VERSION} (one-time, ~10-15 min)..."
  sudo apt-get update -qq
  sudo DEBIAN_FRONTEND=noninteractive apt-get install -y -qq \
    build-essential autoconf m4 libncurses-dev libssl-dev \
    unzip curl ca-certificates >/dev/null

  local tmp
  tmp="$(mktemp -d)"
  curl -fsSL "https://github.com/erlang/otp/releases/download/OTP-${ERLANG_VERSION}/otp_src_${ERLANG_VERSION}.tar.gz" \
    -o "${tmp}/otp.tar.gz"
  tar -xzf "${tmp}/otp.tar.gz" -C "${tmp}"
  (
    cd "${tmp}/otp_src_${ERLANG_VERSION}"
    export ERL_TOP="${PWD}"
    ./configure --prefix=/usr/local \
      --without-jinterface --without-odbc --without-megaco \
      --without-debugger --without-observer --without-et --without-wx \
      >/dev/null
    make -j"$(nproc)" >/dev/null
    sudo make install >/dev/null
  )
  rm -rf "${tmp}"
}

install_elixir() {
  if command -v elixir >/dev/null 2>&1 \
     && elixir --version 2>/dev/null | grep -q "Elixir ${ELIXIR_VERSION}"; then
    echo "Elixir ${ELIXIR_VERSION} already installed."
    return 0
  fi

  echo "Installing Elixir ${ELIXIR_VERSION}..."
  local tmp
  tmp="$(mktemp -d)"
  curl -fsSL "https://github.com/elixir-lang/elixir/releases/download/v${ELIXIR_VERSION}/elixir-otp-${ELIXIR_OTP_MAJOR}.zip" \
    -o "${tmp}/elixir.zip"
  unzip -q "${tmp}/elixir.zip" -d "${tmp}/elixir"
  sudo rm -rf /usr/local/elixir
  sudo mkdir -p /usr/local/elixir
  sudo cp -r "${tmp}/elixir/." /usr/local/elixir/
  for bin in elixir elixirc iex mix; do
    sudo ln -sf "/usr/local/elixir/bin/${bin}" "/usr/local/bin/${bin}"
  done
  rm -rf "${tmp}"
}

install_erlang
install_elixir

echo "Toolchain ready:"
erl -noshell -eval 'io:format("  Erlang/OTP ~s~n", [erlang:system_info(otp_release)]),halt()'
elixir --version | tail -1 | sed 's/^/  /'
