defmodule Questionable.MixProject do
  use Mix.Project

  @app :questionable
  @version "0.1.0"
  @elixir_requirement "~> 1.18"

  def project do
    [
      app: @app,
      version: @version,
      elixir: @elixir_requirement,
      elixirc_options: elixirc_options(Mix.env()),
      start_permanent: Mix.env() == :prod,
      deps: deps(),
      aliases: aliases(),
      test_coverage: [summary: [threshold: 0]],
      preferred_cli_env: [
        check: :test,
        "test.cover": :test,
        dialyzer: :dev
      ],
      dialyzer: dialyzer()
    ]
  end

  def application do
    [
      extra_applications: [:logger],
      mod: {Questionable.Application, []}
    ]
  end

  # Warnings-as-errors in dev and test so the LLM cannot ship a file with
  # an unused alias / unreachable clause / missing @impl. Prod stays lenient
  # so an emergency release isn't blocked by a stray warning.
  defp elixirc_options(env) when env in [:dev, :test], do: [warnings_as_errors: true]
  defp elixirc_options(_), do: []

  defp deps do
    []
  end

  defp aliases do
    [
      # The single command that gates every change. Run before every commit.
      check: [
        "format --check-formatted",
        "compile --warnings-as-errors",
        "xref graph --label compile-connected --fail-above 0",
        "test --warnings-as-errors",
        "dialyzer"
      ],
      "test.cover": ["test --cover"]
    ]
  end

  defp dialyzer do
    [
      plt_local_path: "priv/plts/local.plt",
      plt_core_path: "priv/plts/core.plt",
      # Be strict by default; loosen per-file with @dialyzer attributes.
      flags: [:error_handling, :unknown, :unmatched_returns, :extra_return, :missing_return]
    ]
  end
end
