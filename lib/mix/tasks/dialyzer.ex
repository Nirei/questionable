defmodule Mix.Tasks.Dialyzer do
  @moduledoc """
  Runs Erlang's bundled `:dialyzer` against the project, building a PLT
  the first time it runs and reusing it thereafter.

  Replaces the `dialyxir` hex package, which we cannot install in this
  environment. Reads its config from `:dialyzer` in `mix.exs`.

  ## Examples

      mix dialyzer            # build PLT if missing, then analyse
      mix dialyzer --plt      # build PLT only
      mix dialyzer --no-plt   # analyse only, fail if PLT is missing
  """
  use Mix.Task

  # `:dialyzer` ships with Erlang/OTP and is always on the code path at
  # runtime, but isn't loaded by default at compile time. Silence the
  # remote-call warning rather than bloat the release with extra_applications.
  @compile {:no_warn_undefined, :dialyzer}
  # Dialyzer can't analyse its own module (the PLT excludes the dialyzer app
  # to avoid self-reference), so suppress the resulting "unknown function"
  # warnings for our calls into it.
  @dialyzer {:no_unknown, [build_plt: 1, analyze: 1, abort: 2]}

  @shortdoc "Runs the Erlang dialyzer with project config"

  @switches [plt: :boolean, no_plt: :boolean]

  @impl Mix.Task
  def run(argv) do
    {opts, _rest, _invalid} = OptionParser.parse(argv, strict: @switches)

    Mix.Task.run("compile")
    ensure_dialyzer_loaded!()

    cfg = Keyword.merge(default_config(), Mix.Project.config()[:dialyzer] || [])
    File.mkdir_p!(Path.dirname(cfg[:plt_local_path]))

    cond do
      opts[:plt] -> build_plt(cfg)
      opts[:no_plt] -> analyze(cfg)
      true -> ensure_plt(cfg) && analyze(cfg)
    end
  end

  # Several OTP apps that ship with Erlang aren't on mix's code path by
  # default. Add them explicitly so dialyzer can load `:prettypr`,
  # `:erl_syntax`, etc. while it runs.
  @runtime_apps [:dialyzer, :syntax_tools, :compiler]

  defp ensure_dialyzer_loaded! do
    root = to_string(:code.root_dir())

    for app <- @runtime_apps do
      case Path.wildcard(Path.join(root, "lib/#{app}-*/ebin")) do
        [] ->
          Mix.raise("""
          The OTP application `#{app}` is not installed alongside Erlang/OTP \
          at #{root}. On Debian/Ubuntu install the corresponding `erlang-*` \
          package; if you compiled OTP from source, rebuild it without the \
          relevant --without-* flag.
          """)

        [ebin | _] ->
          case :code.add_path(String.to_charlist(ebin)) do
            true ->
              :ok

            {:error, reason} ->
              Mix.raise("Could not add #{ebin} to code path: #{inspect(reason)}")
          end
      end
    end

    Code.ensure_loaded!(:dialyzer)
  end

  defp default_config do
    [
      plt_local_path: "priv/plts/local.plt",
      plt_core_path: "priv/plts/core.plt",
      flags: [:error_handling, :unknown]
    ]
  end

  defp ensure_plt(cfg) do
    if File.exists?(cfg[:plt_local_path]) do
      true
    else
      build_plt(cfg)
    end
  end

  defp build_plt(cfg) do
    Mix.shell().info("Building dialyzer PLT (one-time, ~1-2 min)...")

    files_rec = Enum.map(plt_app_ebins(), &String.to_charlist/1)

    # PLT build can emit benign "Unknown function" warnings for cross-app
    # references not included in the PLT. Treat them as informational; we
    # only fail when the file fails to write.
    _warnings =
      :dialyzer.run(
        analysis_type: :plt_build,
        output_plt: to_charlist(cfg[:plt_local_path]),
        files_rec: files_rec
      )

    if File.exists?(cfg[:plt_local_path]) do
      Mix.shell().info("PLT built: #{cfg[:plt_local_path]}")
    else
      Mix.raise("PLT build failed: #{cfg[:plt_local_path]} was not written")
    end
  end

  defp analyze(cfg) do
    plt = cfg[:plt_local_path]

    unless File.exists?(plt) do
      Mix.raise("PLT not found at #{plt}. Run `mix dialyzer --plt` first.")
    end

    files = project_beam_files()

    if files == [] do
      Mix.raise("No compiled .beam files to analyse. Run `mix compile` first.")
    end

    result =
      :dialyzer.run(
        analysis_type: :succ_typings,
        init_plt: to_charlist(plt),
        files: Enum.map(files, &to_charlist/1),
        warnings: cfg[:flags] || []
      )

    case result do
      [] ->
        Mix.shell().info("dialyzer: no warnings")

      warnings ->
        abort("dialyzer found #{length(warnings)} warning(s)", warnings)
    end
  end

  defp project_beam_files do
    Mix.Project.compile_path()
    |> Path.join("*.beam")
    |> Path.wildcard()
  end

  defp plt_app_ebins do
    # Resolve each app to its ebin directory via the Erlang lib dir.
    # Apps to include: stdlib essentials + everything this app declares.
    # OTP apps for the PLT. `syntax_tools` is needed at dialyzer runtime;
    # `mnesia` and `runtime_tools` pull in functions that `inets` and `ssl`
    # reference, so including them suppresses harmless "Unknown function"
    # PLT-build warnings.
    stdlib = [
      :erts,
      :kernel,
      :stdlib,
      :crypto,
      :ssl,
      :public_key,
      :inets,
      :mnesia,
      :runtime_tools,
      :logger,
      :syntax_tools,
      :compiler
    ]

    extra = (Mix.Project.config()[:application] || [])[:extra_applications] || []
    elixir_apps = [:elixir, :mix, :eex, :iex, :ex_unit]
    apps = Enum.uniq(stdlib ++ elixir_apps ++ extra)
    root = to_string(:code.root_dir())
    elixir_root = Path.dirname(:code.lib_dir(:elixir) |> to_string())

    for app <- apps, ebin = find_app_ebin(app, [root, elixir_root]), ebin != nil do
      ebin
    end
  end

  defp find_app_ebin(app, search_roots) do
    Enum.find_value(search_roots, fn root ->
      case Path.wildcard(Path.join(root, "#{app}-*/ebin")) ++
             Path.wildcard(Path.join(root, "lib/#{app}-*/ebin")) ++
             Path.wildcard(Path.join(root, "#{app}/ebin")) do
        [ebin | _] -> ebin
        [] -> nil
      end
    end)
  end

  @spec abort(String.t(), [term()]) :: no_return()
  defp abort(header, warnings) do
    formatted = Enum.map_join(warnings, "\n", &:dialyzer.format_warning/1)
    Mix.shell().error(header <> ":\n" <> formatted)
    exit({:shutdown, 1})
  end
end
