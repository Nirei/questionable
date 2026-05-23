// Home feed + Search results

function ScreenFeed() {
  const tabs = [
    { id: 'newest',     label: 'Newest',     active: true },
    { id: 'active',     label: 'Active' },
    { id: 'unanswered', label: 'Unanswered', badge: 412 },
    { id: 'top',        label: 'Top this week' },
    { id: 'fediverse',  label: 'Across the fediverse' },
  ];

  return (
    <QPage topActive="home">
      <div style={{ flex: 1, overflow: 'hidden', display: 'grid', gridTemplateColumns: '1fr 256px', gap: 40, padding: '24px 32px 32px' }}>
        <main style={{ minWidth: 0 }}>
          {/* Editorial header */}
          <header style={{ marginBottom: 22, display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', gap: 24 }}>
            <div>
              <div className="eyebrow" style={{ marginBottom: 6 }}>Monday · The Front Page</div>
              <h1 style={{ fontSize: 38, fontWeight: 500 }}>
                <span style={{ fontStyle: 'italic' }}>What</span> are we wondering about today?
              </h1>
              <p className="serif" style={{ color: 'var(--ink-3)', fontSize: 15, marginTop: 8, fontStyle: 'italic' }}>
                11,902 questions asked here, 4,318 federated in from neighbours.
              </p>
            </div>
            <div style={{ display: 'flex', gap: 6 }}>
              <button className="btn btn-sm"><span style={{ color: 'var(--ink-4)' }}>⊞</span> Filter</button>
              <button className="btn btn-sm">RSS</button>
            </div>
          </header>

          {/* Tabs */}
          <div style={{ borderBottom: '1px solid var(--rule)', marginBottom: 4, display: 'flex', gap: 2, alignItems: 'center' }}>
            {tabs.map(t => (
              <a key={t.id} href="#" className="plain" style={{
                padding: '10px 14px',
                fontSize: 13,
                color: t.active ? 'var(--ink)' : 'var(--ink-3)',
                fontWeight: t.active ? 500 : 400,
                borderBottom: t.active ? '2px solid var(--oxblood)' : '2px solid transparent',
                marginBottom: -1,
                display: 'inline-flex', alignItems: 'center', gap: 6
              }}>
                {t.label}
                {t.badge != null && (
                  <span className="tnum" style={{
                    background: 'var(--paper-3)', color: 'var(--ink-3)',
                    padding: '0 6px', borderRadius: 999, fontSize: 10.5, fontWeight: 500
                  }}>{t.badge}</span>
                )}
              </a>
            ))}
            <div style={{ marginLeft: 'auto', display: 'flex', gap: 12, fontSize: 12, color: 'var(--ink-3)', alignItems: 'center' }}>
              <span>showing 1–15 of 11,902</span>
            </div>
          </div>

          {/* List */}
          <div>
            {FEED.map((q, i) => <QCard key={i} q={q} />)}
          </div>

          {/* Pagination */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: 18 }}>
            <div className="serif" style={{ color: 'var(--ink-4)', fontStyle: 'italic', fontSize: 13 }}>
              Page <span className="tnum" style={{ color: 'var(--ink-2)' }}>1</span> of <span className="tnum">793</span>
            </div>
            <div style={{ display: 'flex', gap: 4 }}>
              {['1', '2', '3', '4', '5', '…', '793'].map((n, i) => (
                <a key={i} href="#" className="plain tnum" style={{
                  padding: '4px 9px', fontSize: 12,
                  border: '1px solid var(--rule)', borderRadius: 3,
                  background: n === '1' ? 'var(--oxblood)' : 'var(--card)',
                  color: n === '1' ? 'white' : 'var(--ink-2)',
                  borderColor: n === '1' ? 'var(--oxblood)' : 'var(--rule)'
                }}>{n}</a>
              ))}
              <a href="#" className="plain" style={{ padding: '4px 9px', fontSize: 12, border: '1px solid var(--rule)', borderRadius: 3, color: 'var(--ink-2)' }}>Next →</a>
            </div>
          </div>
        </main>

        <QSidebar />
      </div>
    </QPage>
  );
}

const FEED = [
  {
    title: 'Ash policy that depends on an aggregate from a related resource — possible?',
    excerpt: 'I have a Question resource with an answer_count aggregate, and I want a policy on Answer that prevents posting once the question is closed. The aggregate is on the parent…',
    tags: ['ash-framework', 'elixir', 'authorization'],
    votes: 24, answers: 3, views: 412, accepted: true,
    user: { name: 'Mira Okafor', hue: 30, rep: 8420, fed: 'home.questionable.org' },
    time: '14 min ago',
  },
  {
    title: 'Why does ash_postgres.generate_migrations diff my :decimal column on every run?',
    excerpt: 'Every time I run mix ash_postgres.generate_migrations on a clean tree it produces a no-op modify for a :decimal attribute with precision 12, scale 2. The migration runs fine but…',
    tags: ['ash-postgres', 'ecto', 'migrations'],
    votes: 11, answers: 2, views: 88,
    user: { name: 'Jonas Vester', hue: 70, rep: 312, fed: 'elixir.social' },
    time: '32 min ago',
  },
  {
    title: 'LiveView form with embedded Ash resource — how to surface nested errors on the right field?',
    excerpt: 'I have a parent form for Question that embeds tags as a has_many. AshPhoenix.Form.submit/2 returns nested errors keyed by the inner action, but I can\'t get them to show next to…',
    tags: ['ash-phoenix', 'phoenix-liveview', 'forms'],
    votes: 6, answers: 0, views: 41,
    user: { name: 'Priya Shastri', hue: 290, rep: 1240, fed: 'home.questionable.org' },
    time: '1 hr ago',
  },
  {
    title: 'How are people structuring Oban workers that depend on Ash actions in tests?',
    excerpt: 'I keep tripping over the Ash.Test sandbox checkout when an Oban job tries to run an Ash action from a test. The job\'s process doesn\'t share the connection. Manual checkout works but…',
    tags: ['oban', 'ash-framework', 'testing', 'ecto'],
    votes: 18, answers: 4, views: 287,
    user: { name: 'Ren Hamasaki', hue: 200, rep: 5610, fed: 'fedi.dev' },
    time: '2 hr ago',
  },
  {
    title: 'Earmark + HtmlSanitizeEx pipeline — sanitize before or after rendering?',
    excerpt: 'Reading the README I can\'t tell whether the recommended order is sanitize the Markdown source first (and risk eating syntax) or render to HTML and sanitize after. The latter feels…',
    tags: ['earmark', 'html-sanitize-ex', 'markdown'],
    votes: 4, answers: 1, views: 64,
    user: { name: 'Tomás Aguilar', hue: 145, rep: 980, fed: 'home.questionable.org' },
    time: '3 hr ago',
  },
  {
    title: 'ActivityPub Like activity: is `object` allowed to be a Question URL or must it resolve to a Note?',
    excerpt: 'Federating an upvote as Like, my receiving Mastodon instance silently drops the activity. If I rewrite the object IRI to point at the rendered Note it works. Spec reading welcome.',
    tags: ['activitypub', 'federation', 'mastodon'],
    votes: 31, answers: 5, views: 1102, accepted: true,
    user: { name: 'Soraya Lindgren', hue: 240, rep: 14820, fed: 'lemmy.world' },
    time: 'yesterday',
  },
  {
    title: 'Phoenix PubSub: subscribe in handle_params or mount?',
    excerpt: 'For a question detail LiveView that should receive real-time answers, I\'ve seen both patterns in the wild. handle_params re-subscribes on slug changes but seems wasteful when nothing…',
    tags: ['phoenix-liveview', 'pubsub'],
    votes: 9, answers: 2, views: 156,
    user: { name: 'Marcus Whitfield', hue: 15, rep: 432, fed: 'home.questionable.org' },
    time: 'yesterday',
  },
];

function ScreenSearch() {
  return (
    <QPage topActive="home">
      <div style={{ flex: 1, overflow: 'hidden', display: 'grid', gridTemplateColumns: '1fr 256px', gap: 40, padding: '24px 32px 32px' }}>
        <main>
          <div className="eyebrow" style={{ marginBottom: 6 }}>Search results</div>
          <h1 style={{ fontSize: 30, marginBottom: 4 }}>
            Results for <span style={{ fontStyle: 'italic', color: 'var(--oxblood)' }}>"ash policy aggregate"</span>
          </h1>
          <p className="serif" style={{ color: 'var(--ink-3)', fontStyle: 'italic', fontSize: 14, margin: '0 0 18px' }}>
            <span className="tnum">137</span> matches across 4 instances · 0.064 sec
          </p>

          {/* filter row */}
          <div style={{ display: 'flex', gap: 16, alignItems: 'center', borderTop: '1px solid var(--rule)', borderBottom: '1px solid var(--rule)', padding: '10px 0', marginBottom: 16 }}>
            <span className="eyebrow">refine</span>
            <div style={{ display: 'flex', gap: 6 }}>
              {['Questions 92', 'Answers 41', 'Comments 4'].map((t, i) => (
                <a key={t} href="#" className="tag plain" style={i === 0 ? { background: 'var(--ink)', color: 'var(--paper)', borderColor: 'var(--ink)' } : null}>{t}</a>
              ))}
            </div>
            <span style={{ width: 1, height: 16, background: 'var(--rule)' }} />
            <div style={{ display: 'flex', gap: 6 }}>
              <a href="#" className="tag plain">accepted only</a>
              <a href="#" className="tag plain">local only</a>
              <a href="#" className="tag plain">last 30 days</a>
            </div>
            <div style={{ marginLeft: 'auto', fontSize: 12, color: 'var(--ink-3)' }}>
              sort: <a href="#">relevance</a> · <a href="#" style={{ color: 'var(--ink-4)' }}>newest</a> · <a href="#" style={{ color: 'var(--ink-4)' }}>votes</a>
            </div>
          </div>

          {/* results */}
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            {SEARCH_RESULTS.map((r, i) => (
              <article key={i} style={{ padding: '16px 0', borderBottom: '1px solid var(--rule-soft)', display: 'grid', gridTemplateColumns: '64px 1fr', gap: 18 }}>
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 4, color: 'var(--ink-3)' }}>
                  <div className="serif tnum" style={{ fontSize: 19, color: 'var(--ink)' }}>{r.votes}</div>
                  <div className="eyebrow" style={{ fontSize: 9 }}>votes</div>
                  <div className="tnum" style={{ fontSize: 13, marginTop: 6, color: r.accepted ? 'oklch(0.42 0.07 150)' : 'var(--ink-2)', fontWeight: r.accepted ? 500 : 400 }}>{r.answers}{r.accepted ? ' ✓' : ''}</div>
                  <div className="eyebrow" style={{ fontSize: 9 }}>answers</div>
                </div>
                <div>
                  <h3 style={{ marginBottom: 4 }}>
                    <a href="#" className="plain" dangerouslySetInnerHTML={{ __html: r.title }} />
                  </h3>
                  <p style={{ color: 'var(--ink-3)', fontSize: 13, margin: '0 0 8px', lineHeight: 1.5 }} dangerouslySetInnerHTML={{ __html: r.excerpt }} />
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 12 }}>
                    <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>{r.tags.map(t => <QTag key={t} name={t} />)}</div>
                    <span className="meta">{r.user.name} <span className="fed">·{r.user.fed}</span> · <span className="mono">{r.time}</span></span>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </main>

        <aside style={{ display: 'flex', flexDirection: 'column', gap: 22 }}>
          <SidebarBlock title="Search tips">
            <ul className="serif" style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: 8, fontSize: 13.5, color: 'var(--ink-2)', fontStyle: 'italic' }}>
              <li><code style={{ fontStyle: 'normal' }}>[ash]</code> — tag</li>
              <li><code style={{ fontStyle: 'normal' }}>user:mira</code> — by author</li>
              <li><code style={{ fontStyle: 'normal' }}>is:answered</code> — has an answer</li>
              <li><code style={{ fontStyle: 'normal' }}>instance:fedi.dev</code></li>
              <li><code style={{ fontStyle: 'normal' }}>score:5..</code> — score ≥ 5</li>
            </ul>
          </SidebarBlock>
          <SidebarBlock title="Related tags">
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
              {['ash-framework', 'authorization', 'policies', 'aggregates', 'calculations'].map(t => <QTag key={t} name={t} />)}
            </div>
          </SidebarBlock>
          <SidebarBlock title="Across the fediverse">
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10, fontSize: 12.5, color: 'var(--ink-2)' }}>
              <Row k="home.questionable.org" v="84" />
              <Row k="elixir.social" v="29" />
              <Row k="fedi.dev" v="18" />
              <Row k="lemmy.world" v="6" />
            </div>
          </SidebarBlock>
        </aside>
      </div>
    </QPage>
  );
}

const SEARCH_RESULTS = [
  {
    title: 'Ash <mark style="background:var(--amber-tint);color:var(--ink);padding:0 2px">policy</mark> that depends on an <mark style="background:var(--amber-tint);color:var(--ink);padding:0 2px">aggregate</mark> from a related resource — possible?',
    excerpt: '…want a <mark style="background:var(--amber-tint);color:var(--ink);padding:0 2px">policy</mark> on Answer that prevents posting once the question is closed. The <mark style="background:var(--amber-tint);color:var(--ink);padding:0 2px">aggregate</mark> is on the parent resource. Can <code style="font-style:normal">authorize_if</code> reach across…',
    tags: ['ash-framework', 'authorization', 'policies'],
    votes: 24, answers: 3, accepted: true,
    user: { name: 'Mira Okafor', fed: 'home.questionable.org' },
    time: '14 min ago',
  },
  {
    title: 'Using <mark style="background:var(--amber-tint);color:var(--ink);padding:0 2px">aggregate</mark>s inside a <mark style="background:var(--amber-tint);color:var(--ink);padding:0 2px">policy</mark> condition — performance footnote',
    excerpt: 'TL;DR yes, but the <mark style="background:var(--amber-tint);color:var(--ink);padding:0 2px">aggregate</mark> is joined per-row, so on a list action you\'ll want to also expose it as a calculation and load it once. Here\'s the pattern we settled on…',
    tags: ['ash-framework', 'performance'],
    votes: 41, answers: 7, accepted: true,
    user: { name: 'Ren Hamasaki', fed: 'fedi.dev' },
    time: '6 days ago',
  },
  {
    title: 'Stale <mark style="background:var(--amber-tint);color:var(--ink);padding:0 2px">aggregate</mark> after bulk update — invalidation strategy?',
    excerpt: '…the count returns the old value until I touch the parent. I\'ve been calling Ash.load!/3 manually but in a hot path…',
    tags: ['ash-framework', 'aggregates', 'bulk-actions'],
    votes: 12, answers: 2,
    user: { name: 'Soraya Lindgren', fed: 'lemmy.world' },
    time: '3 weeks ago',
  },
  {
    title: 'Combining tenant_id and <mark style="background:var(--amber-tint);color:var(--ink);padding:0 2px">ash</mark>_authentication scopes in a <mark style="background:var(--amber-tint);color:var(--ink);padding:0 2px">policy</mark>',
    excerpt: 'Multi-tenant app, policies need to authorize_if both <code style="font-style:normal">tenant_matches</code> and a relation-based check. The relation\'s tenant is implicit and…',
    tags: ['ash-framework', 'multi-tenancy', 'policies'],
    votes: 8, answers: 1,
    user: { name: 'Jonas Vester', fed: 'elixir.social' },
    time: '1 month ago',
  },
];

Object.assign(window, { ScreenFeed, ScreenSearch });
