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

## Design handoff

The design system and screen mocks for the product live in
[`/design`](./design/) as static HTML/CSS/React prototypes exported from
Claude Design. They are the **visual specification** — use them as the
source of truth for dimensions, colours, typography, and layout when
implementing LiveViews. Do not implement *from* the JSX directly; read it
and translate to Phoenix templates + CSS custom properties.

### Files

- **`tokens.css`** — full design-token layer. Surfaces (`--paper`, `--paper-2`,
  `--paper-3`, `--card`), ink weights (`--ink` through `--ink-4`), rules
  (`--rule`, `--rule-soft`), accents (`--oxblood` primary, `--sage`, `--amber`
  with tint variants), type (`--serif` Newsreader, `--sans` IBM Plex Sans,
  `--mono` IBM Plex Mono), radii (`--r-sm` 3px, `--r` 5px, `--r-lg` 8px — no
  rounded corners larger than 8px), and shared component classes (`.btn`,
  `.tag`, `.card`, `.vote`, `.fed`, `.dropcap`, `.input`, `.kbd`, `.eyebrow`,
  `.meta`). Translate these tokens 1-to-1 into CSS custom properties at
  `:root`.
- **`components.jsx`** — shared component library imported by every screen.
  `QLogo`, `QTopBar`, `QAvatar`, `QUserChip`, `QTag`, `QVote`, `QCard`,
  `QStat`, `QSidebar`, `QPage`, `QFooter`. Federation suffix pattern: every
  username renders as `name<span class="fed"> ·instance.tld</span>` — italic,
  `--ink-4`, never coloured.
- **`screens-feed.jsx`** — screens **A · Home feed** and **B · Search results**.
- **`screens-question.jsx`** — screens **E · Question detail** and
  **F · Ask a question** (Title / Body / Tags fields; Write/Preview/Split
  editor; tag token input with autocomplete).
- **`screens-tags.jsx`** — screens **C · Tags index** (cloud + 3-column grid)
  and **D · Tag detail**.
- **`screens-other.jsx`** — screens **G · User profile** (header, tab bar,
  stats strip, contributions table, 53×7 activity heatmap), **H · Moderation
  queue** (KPI strip, heat-striped action cards), **I · Register / sign in**
  (two-column split with federation-aware username field).
- **`main.jsx`** — canvas entry. `TWEAK_DEFAULTS = { accent: "#8a3625",
  font: "newsreader", warmth: 78 }`. Defines `ACCENT_MAP`, `FONT_MAP`, and
  `applyTweaks()` which writes CSS custom properties at runtime. Mounts all
  screens onto the design canvas grouped into "Entry & discovery", "The Q&A
  surface", "People & the back room", "Getting in".
- **`index.html`** — loads Google Fonts (Newsreader, IBM Plex Sans/Mono,
  Spectral, Inter, Source Serif 4, JetBrains Mono), `tokens.css`, React 18 +
  Babel standalone, then all JSX in dependency order.
- **`design-canvas.jsx`**, **`tweaks-panel.jsx`** — canvas infrastructure
  (pan/zoom, floating tweaks panel). Not relevant to production
  implementation; ignore internals.

### Screen-to-LiveView mapping

| ID | Label | Dimensions | LiveView module (TBD) |
| --- | --- | --- | --- |
| A | Home feed | 1280×1100 | `QuestionableWeb.FeedLive` |
| B | Search results | 1280×1100 | `QuestionableWeb.SearchLive` |
| C | Tags index | 1280×1100 | `QuestionableWeb.TagsLive` |
| D | Tag detail | 1280×1280 | `QuestionableWeb.TagLive` |
| E | Question detail | 1280×1880 | `QuestionableWeb.QuestionLive` |
| F | Ask a question | 1280×1480 | `QuestionableWeb.AskLive` |
| G | User profile | 1280×1280 | `QuestionableWeb.ProfileLive` |
| H | Moderation queue | 1280×1340 | `QuestionableWeb.ModLive` |
| I | Register / sign in | 1280×840 | `QuestionableWeb.AuthLive` |

Module names are provisional and will be confirmed as each screen is
implemented in Phase 5+.

### Design decisions to carry into implementation

1. **No rounded corners > 8px.** The design uses `--r-lg: 8px` as the
   maximum.
2. **Tabular numerals everywhere** vote counts, view counts, rep scores
   need `font-variant-numeric: tabular-nums`.
3. **Federation suffix** is always italic `--ink-4`, never a link colour,
   never bold. Pattern: `user<span class="fed"> ·instance.tld</span>`.
4. **Code in body text** — inline `code` is oxblood on `--paper-2`
   background; fenced blocks use `--paper-2` with `--rule-soft` border.
5. **Drop-cap on question bodies** — the first paragraph of a question
   uses `.dropcap` for editorial flavour.
6. **Accepted answers** — sage-tint background
   (`oklch(0.97 0.02 150 / 0.5)`) with sage border, `✓` in `--sage`.
7. **Heat stripe on moderation items** — 4px coloured left border:
   oxblood = red, amber = amber, sage = sage.
8. **Activity heatmap** — 53 columns × 7 rows, 5 oxblood intensity levels,
   rendered as `10×10px` divs with `border-radius: 1px`.
9. **Tweakable accent** — `--oxblood` is the primary brand colour and should
   be configurable per-instance via settings.

## What we are *not* doing

(Mirrors CLAUDE.md "What NOT To Do" so the active plan stays honest.)

- No third-party formatters, linters, or type-checkers beyond what's listed
  above. `Credo` would mostly duplicate compiler warnings + dialyzer; skip.
  Dialyxir would just wrap Erlang's dialyzer; we wrote our own ~150-line
  task instead.
- No REST/GraphQL API layer.
- No admin dashboard framework.
- No caching (ETS/Redis) at launch scale.
- No email notifications in early phases.
- No GenServers for work Oban handles.
