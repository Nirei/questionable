# Questionable — Project Bible

This file is the **design constitution**. It captures the vision, the
domain model, and the conventions that any change has to honour. The
companion file `PLAN.md` is the active work plan (current phase, blockers,
next steps); when the two disagree, **CLAUDE.md wins** and PLAN.md gets
amended.

If you're an LLM reading this: every section below is load-bearing.
Don't re-derive these decisions from first principles; cite them.

---

## 1. Mission

Questionable is a **federated Q&A site**, modeled on StackOverflow's
question-with-best-answer format, riding on **ActivityPub** so any Mastodon,
Lemmy, or other AP-speaking server can discover and interact with content.

Non-goals (deliberately):

- Not a forum (threaded discussion).
- Not a microblog (Question/Answer is the unit, not the post).
- Not a wiki (no collaborative editing of the same answer).
- Not a real-time chat.
- Not a federation of *moderation* — each instance moderates its own corpus.

## 2. Stack

| Layer        | Choice                                                        |
| ------------ | ------------------------------------------------------------- |
| Runtime      | Erlang/OTP 27, Elixir 1.18 (pinned in `.tool-versions`)       |
| Web          | Phoenix + Phoenix LiveView                                    |
| Domain       | Ash Framework (resources, actions, policies, changes)         |
| Persistence  | PostgreSQL via `ash_postgres`                                 |
| Background   | Oban (single source of truth for async work)                  |
| Auth         | `ash_authentication` + `ash_authentication_phoenix`           |
| Markdown     | `earmark` for parsing, `html_sanitize_ex` for the final pass  |
| Federation   | `activity_pub` (git dep — pleroma-style adapter)              |
| License      | AGPL-3.0                                                      |

Anything else is suspect. New deps require an entry in PLAN.md and a
sentence justifying why a stdlib/OTP/Ash primitive doesn't already do it.

## 3. Domain model

Five top-level Ash resources. Each is namespaced under its bounded
context.

```
Questionable.Accounts
  └─ User                     # identity, profile, reputation cache
Questionable.QA
  ├─ Question                 # title + body + tags + author
  ├─ Answer                   # body + author, belongs_to Question
  ├─ Tag                      # canonical tag name + description
  └─ QuestionTag              # join, carries tag-position for ordering
Questionable.Engagement
  ├─ Vote                     # up/down on a Question OR Answer
  └─ ReputationEvent          # audit log of every rep delta
Questionable.Federation
  └─ (no resources; adapters and transformers only — see §6)
```

Key invariants the system MUST enforce (in Ash policies and DB constraints,
not just controllers):

- A `Vote` is `(voter_id, votable_type, votable_id)` unique. Re-voting
  updates the existing row; you cannot stack votes.
- A user cannot vote on their own content. Enforced in a policy *and* a
  DB check (defence in depth — federation may try to inject one).
- A `Question` has at most one *accepted* `Answer`. Only the question's
  author (or a moderator) can accept.
- A `Question` has 1–5 tags. Zero tags is invalid; >5 is invalid.
- Closing a `Question` freezes new `Answer` and `Vote` creation; existing
  ones remain.
- `ReputationEvent` is append-only. Reversing a vote inserts a *new*
  compensating event; the old one stays for audit.
- `User.reputation` is a **cached sum** of that user's `ReputationEvent`s.
  The source of truth is the events table; the cache is rebuildable.

## 4. Reputation rules

Numbers below are the launch defaults. They live in
`Questionable.Engagement.Rules` as module attributes so they're greppable
and changeable in one place.

| Event                              | Δ rep |
| ---------------------------------- | -----:|
| Your question is upvoted           |    +5 |
| Your answer is upvoted             |   +10 |
| Your question is downvoted         |    -2 |
| Your answer is downvoted           |    -2 |
| You downvote an answer             |    -1 |
| Your answer is accepted            |   +15 |
| You accept an answer (own question)|    +2 |

Gating thresholds (privileges users earn by reputation):

| Privilege                  | Min rep |
| -------------------------- | ------: |
| Upvote                     |      15 |
| Comment                    |      50 |
| Downvote                   |     125 |
| Edit others' posts (queue) |    2000 |
| Close/reopen own questions |     ∞ (always) |
| Vote to close              |    3000 |
| Moderator actions          | role-based, not rep-based |

Policy enforcement: every action that gates on reputation MUST check via
an Ash policy, not in the LiveView. The policy reads `actor.reputation`.

## 5. Markdown & sanitization pipeline

User-authored bodies (questions, answers, comments) flow through a
three-stage pipeline. There are no shortcuts — every read path that
renders user HTML uses this exact chain:

1. **Parse**: `Earmark.as_html!/2` with `gfm: true`, `breaks: false`,
   `code_class_prefix: "language-"`.
2. **Sanitize**: `HtmlSanitizeEx.markdown_html/1` (allowlist: paragraphs,
   inline formatting, code, blockquote, lists, links, images, tables).
3. **Post-process**: rewrite local `@mention` links, add `rel="nofollow
   ugc"` to outbound links, transform `<pre><code class="language-…">`
   for the chosen syntax-highlight class scheme.

Storage: keep the **markdown source** as the canonical column
(`body_md`). The rendered HTML is a generated column / Ash calculation
(`body_html`), not a separately-mutated field. This means edits never
desync the two, and we can re-render the entire corpus by bumping the
renderer.

## 6. ActivityPub mapping

The mapping is opinionated and a little non-obvious. Read this whole
section before touching federation code.

### Object types

| Local resource    | AP type     | Notes                                          |
| ----------------- | ----------- | ---------------------------------------------- |
| `User`            | `Person`    | `preferredUsername`, `inbox`, `outbox`, etc.   |
| `Question`        | `Question`  | AS2 `Question` (yes, it exists) — re-purposed. |
| `Answer`          | `Note`      | `inReplyTo` = the Question's AP id.            |
| `Vote` (up)       | `Like`      | object = AP id of the question/answer.         |
| `Vote` (down)     | `Dislike`   | object = AP id of the question/answer.         |
| Accept            | custom `Accept` of an `Answer` activity        |
| Tag               | `Hashtag` in `tag` array on the Question object |

AS2's `Question` type is technically for polls; we lean on it because
its semantics ("a thing seeking a response") match a Q&A question more
closely than `Note` does. Implementations that don't grok our usage
will degrade to displaying it as a `Note` with answers as replies —
acceptable graceful degradation.

### Inbox handling

Incoming activities go through `Questionable.Federation.Transformer`,
which:

1. Validates the activity envelope (signature, HTTP-Signatures, date).
2. Fetches & caches the actor's `Person` if unknown.
3. Maps the AP object into an Ash *action input* on the appropriate
   resource (`create`/`update`/`destroy`/custom).
4. Runs the action with `actor: federated_user`. Ash policies enforce
   the same rules as for local actions — federation never bypasses them.

### Outbox delivery

Every domain action that produces a federation-visible side effect
(creating a question, answering, voting, accepting) inserts an Oban job
into the `:federation` queue. The job (`Questionable.Federation.Worker.DeliverActivity`)
serializes the resource, signs the envelope, POSTs to each follower's
inbox. Retries on 5xx with exponential backoff; gives up after 7 days
and logs the dead-letter for the moderator dashboard.

### Content negotiation

Routes that serve user-facing content (e.g. `/questions/:id`) check the
`Accept` header:

- `text/html` (or absent) → LiveView render
- `application/activity+json` or `application/ld+json; profile="…"` →
  AP JSON serialization

This is handled in a Plug that runs *before* the router's normal
pipeline, so AP requests don't pay the LiveView assembly cost.

## 7. Module layout conventions

```
lib/
├── questionable/              # the OTP application, supervision tree
│   └── application.ex
├── questionable.ex            # umbrella API module (thin facade only)
├── questionable_web/          # phoenix-side: endpoint, router, controllers, live views, components
│   ├── endpoint.ex
│   ├── router.ex
│   ├── live/                  # LiveViews, one folder per feature area
│   ├── components/            # function components (`use Phoenix.Component`)
│   └── layouts/
├── questionable/accounts/     # domain context (User, ...)
├── questionable/qa/           # domain context (Question, Answer, Tag, ...)
├── questionable/engagement/   # domain context (Vote, ReputationEvent, Rules)
├── questionable/federation/   # AP adapter, transformer, workers
└── mix/tasks/                 # custom mix tasks (dialyzer, ...)
```

Rules:

- **No cross-context calls below the context's public module.** Code in
  `Questionable.QA.*` must not call `Questionable.Engagement.Vote.*`
  directly — it goes through `Questionable.Engagement` (the context
  module). This keeps the bounded contexts honest.
- **Ash resources are not API.** Code outside a context never calls a
  resource directly; it goes through the domain (`Questionable.QA |>
  Ash.create!(...)`) or the context facade.
- **LiveViews are dumb.** A LiveView's `mount/handle_event` does
  parameter parsing, calls a single context function, assigns the
  result. Business logic lives in the context, not the LiveView.

## 8. Testing conventions

- **Test files mirror source files.** `lib/questionable/qa/question.ex`
  ↔ `test/questionable/qa/question_test.exs`. The `test/` tree is the
  source tree.
- **ExUnit only.** No third-party test framework.
- **Doctests for pure functions.** If a function has a sensible doctest,
  write one; it's the fastest sanity check during refactor.
- **`async: true` by default.** If a test needs to disable it, leave a
  one-line comment explaining what shared state it touches.
- **DB sandbox.** Once `ash_postgres` lands, every test using the repo
  uses the SQL sandbox; no test ever sees another test's data.
- **No `mox`-style mocks for our own modules.** Behaviour-driven test
  doubles for *external* services only (HTTP, time). Internally,
  exercise the real code paths.
- **Coverage threshold starts at 0** and ratchets up — never down. Edit
  `:test_coverage`'s `:summary` threshold in `mix.exs` after each phase.

## 9. The `mix check` contract

`mix check` is the **only** gate. It must pass before every commit and
in CI. See `PLAN.md` for the current pipeline; in summary, it runs:

1. `mix format --check-formatted`
2. `mix compile --warnings-as-errors`
3. `mix xref graph --label compile-connected --fail-above 0`
4. `mix test --warnings-as-errors`
5. `mix dialyzer`

Adding a new check: prepend it to the alias in `mix.exs`, document it
in PLAN.md's tooling table, and make sure it's green on `main` before
the PR that adds it lands.

## 10. What NOT to do

(Lifted forward into the design constitution so it has the same weight
as the rest.)

- **No REST/GraphQL API layer.** Federation *is* the API for external
  consumers; LiveView is the API for humans. If you find yourself
  reaching for a JSON controller, you're probably re-implementing
  something AP already gives you.
- **No admin dashboard framework** (LiveDashboard for ops is fine; an
  admin CMS framework is not). Build the moderator screens as plain
  LiveViews against the same Ash resources users hit.
- **No caching layer at launch.** Postgres + Ecto prepared statements
  carry us well past launch traffic. Add caching when a load test
  proves a specific query is the bottleneck, not before.
- **No email notifications in early phases.** The federation outbox is
  enough signal; email is a 2.0 concern.
- **No GenServers for work Oban handles.** If it's "do this thing
  later" or "retry on failure", it's an Oban job. Long-lived GenServers
  are for actual stateful processes (PubSub, presence, rate-limit
  buckets), not job queues in disguise.
- **No third-party formatter/linter/type-checker** beyond what `mix
  check` already runs (compiler, xref, dialyzer). `Credo` and `dialyxir`
  duplicate things we already have; skip.
- **No premature abstractions.** Three concrete resources before a
  shared behaviour. One concrete LiveView before a generic component.
  Two duplicated migrations before a generator.
