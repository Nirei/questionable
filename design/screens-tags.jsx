// Tags index + Tag detail

const TAG_CATALOG = [
  { name: 'elixir',           count: 1842, desc: 'For questions about the Elixir programming language — syntax, OTP idioms, and runtime behavior.' },
  { name: 'ash-framework',    count: 1289, desc: 'Ash: a declarative, layered framework for building Elixir applications.' },
  { name: 'phoenix-liveview', count: 1107, desc: 'Server-rendered, real-time UI for Phoenix without a separate JS framework.' },
  { name: 'ecto',             count:  962, desc: 'Database wrapper and query DSL — schemas, changesets, multi.' },
  { name: 'oban',             count:  541, desc: 'Robust persistent job processing on top of PostgreSQL.' },
  { name: 'phoenix',          count:  498, desc: 'The Phoenix web framework itself — controllers, channels, routing.' },
  { name: 'postgres',         count:  445, desc: 'PostgreSQL — queries, indexes, JSONB, performance.' },
  { name: 'activitypub',      count:  381, desc: 'The ActivityPub federation protocol — actors, activities, signatures.' },
  { name: 'otp',              count:  340, desc: 'Open Telecom Platform — supervisors, GenServers, fault tolerance.' },
  { name: 'tailwind',         count:  284, desc: 'Utility-first CSS — works with Phoenix\'s default generators.' },
  { name: 'authentication',   count:  221, desc: 'Logging users in. ash_authentication, passwords, magic links, OAuth.' },
  { name: 'authorization',    count:  198, desc: 'Deciding what a user can do once they\'re logged in. Policies & roles.' },
  { name: 'earmark',          count:  142, desc: 'Markdown to HTML rendering in Elixir.' },
  { name: 'pubsub',           count:  129, desc: 'Phoenix.PubSub — broadcasting between processes.' },
  { name: 'testing',          count:  118, desc: 'ExUnit, property-based testing, fixtures, Ash.Test helpers.' },
  { name: 'genserver',        count:  102, desc: 'GenServer behaviour — state, callbacks, when not to use one.' },
  { name: 'releases',         count:   87, desc: 'mix release, runtime config, deployment, container images.' },
  { name: 'mox',              count:   64, desc: 'Mocks as a contract — defining behaviours and stubbing in tests.' },
];

function ScreenTags() {
  return (
    <QPage topActive="tags">
      <div style={{ flex: 1, overflow: 'auto', padding: '28px 32px 32px' }}>
        <header style={{ marginBottom: 22, display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
          <div>
            <div className="eyebrow" style={{ marginBottom: 6 }}>Catalogue</div>
            <h1 style={{ fontSize: 34 }}>Tags</h1>
            <p className="serif" style={{ fontStyle: 'italic', color: 'var(--ink-3)', fontSize: 14.5, marginTop: 6, maxWidth: 560 }}>
              Every question carries one to five tags. A tag is at most a short hyphen-cased label — a doorway, not a category.
            </p>
          </div>
          <div style={{ display: 'flex', gap: 8 }}>
            <div style={{ position: 'relative' }}>
              <input className="input" placeholder="filter by name…" style={{ width: 220, height: 32, fontSize: 12.5 }} />
            </div>
            <div style={{ display: 'flex', border: '1px solid var(--rule)', borderRadius: 5, overflow: 'hidden' }}>
              {['Popular', 'A–Z', 'New'].map((t, i) => (
                <button key={t} style={{
                  padding: '6px 12px', fontSize: 12, border: 'none', cursor: 'pointer',
                  background: i === 0 ? 'var(--ink)' : 'var(--card)',
                  color: i === 0 ? 'var(--paper)' : 'var(--ink-3)',
                  borderRight: i === 2 ? 'none' : '1px solid var(--rule)',
                  fontFamily: 'var(--sans)',
                }}>{t}</button>
              ))}
            </div>
          </div>
        </header>

        {/* Featured tag cloud */}
        <div style={{ borderTop: '1px solid var(--rule)', borderBottom: '1px solid var(--rule)', padding: '20px 0', marginBottom: 24, display: 'grid', gridTemplateColumns: 'auto 1fr', gap: 28, alignItems: 'center' }}>
          <div className="eyebrow" style={{ writingMode: 'vertical-rl', transform: 'rotate(180deg)', textAlign: 'center' }}>This week's<br />constellation</div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10, alignItems: 'baseline' }}>
            {TAG_CATALOG.slice(0, 12).map((t, i) => {
              const sizes = [32, 26, 24, 22, 20, 19, 18, 17, 16, 15, 15, 14];
              return (
                <a key={t.name} href="#" className="plain serif tnum" style={{
                  fontSize: sizes[i] || 14, color: i % 3 === 0 ? 'var(--oxblood)' : 'var(--ink)',
                  fontStyle: i % 4 === 0 ? 'italic' : 'normal', fontWeight: 500,
                  letterSpacing: '-0.01em', lineHeight: 1.2
                }}>
                  {t.name}
                </a>
              );
            })}
          </div>
        </div>

        {/* Tag grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 14 }}>
          {TAG_CATALOG.map(t => (
            <a key={t.name} href="#" className="plain" style={{
              padding: 16,
              border: '1px solid var(--rule)',
              borderRadius: 6,
              background: 'var(--card)',
              display: 'flex', flexDirection: 'column', gap: 8,
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
                <span className="tag" style={{ background: 'var(--paper-2)', color: 'var(--ink)', fontSize: 12, padding: '4px 10px' }}>{t.name}</span>
                <span style={{ fontSize: 11, color: 'var(--ink-4)' }} className="tnum">
                  <b className="serif" style={{ color: 'var(--ink-2)', fontSize: 14, fontWeight: 500 }}>{t.count.toLocaleString()}</b> questions
                </span>
              </div>
              <p style={{ fontSize: 12.5, color: 'var(--ink-3)', margin: 0, lineHeight: 1.45 }}>{t.desc}</p>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11, color: 'var(--ink-4)', marginTop: 4 }}>
                <span>{Math.floor(Math.random() * 80 + 5)} this week</span>
                <span>↗ {Math.floor(Math.random() * 30 + 2)} today</span>
              </div>
            </a>
          ))}
        </div>
      </div>
    </QPage>
  );
}

function ScreenTagDetail() {
  return (
    <QPage topActive="tags">
      <div style={{ flex: 1, overflow: 'hidden', display: 'grid', gridTemplateColumns: '1fr 280px', gap: 40, padding: '28px 32px 32px' }}>
        <main>
          {/* Tag header */}
          <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 24, paddingBottom: 18, borderBottom: '1px solid var(--rule)', marginBottom: 18 }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'baseline', gap: 12 }}>
                <h1 style={{ fontSize: 36, fontFamily: 'var(--mono)', fontWeight: 500 }}>ash-framework</h1>
                <span className="serif" style={{ fontStyle: 'italic', color: 'var(--ink-3)', fontSize: 15 }}>— a tag</span>
              </div>
              <p className="serif" style={{ fontSize: 16, lineHeight: 1.55, color: 'var(--ink-2)', maxWidth: 720, margin: '12px 0 0' }}>
                Ash is a declarative, resource-oriented framework for Elixir.
                Use this tag for questions about Ash domains, resources, actions, policies, calculations, aggregates, and the various extensions (<code>ash_postgres</code>, <code>ash_phoenix</code>, <code>ash_authentication</code>).
              </p>
              <div style={{ display: 'flex', gap: 18, marginTop: 14, fontSize: 12.5, color: 'var(--ink-3)' }}>
                <span><span className="tnum serif" style={{ fontSize: 15, color: 'var(--ink)' }}>1,289</span> questions</span>
                <span><span className="tnum serif" style={{ fontSize: 15, color: 'var(--ink)' }}>87</span> this week</span>
                <span><span className="tnum serif" style={{ fontSize: 15, color: 'var(--ink)' }}>14</span> today</span>
                <span><span className="tnum serif" style={{ fontSize: 15, color: 'var(--ink)' }}>342</span> watchers</span>
              </div>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
              <button className="btn btn-primary">★ Watch tag</button>
              <button className="btn btn-sm">Edit wiki</button>
              <span className="serif" style={{ fontStyle: 'italic', color: 'var(--ink-4)', fontSize: 12, textAlign: 'center', marginTop: 4 }}>wiki edited 6 days ago</span>
            </div>
          </div>

          {/* sub-tag filter */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, fontSize: 12, color: 'var(--ink-3)', marginBottom: 14 }}>
            <span className="eyebrow">narrow by</span>
            {['policies 198', 'aggregates 64', 'actions 142', 'calculations 88', 'migrations 76', 'multi-tenancy 31'].map((t, i) => (
              <a key={t} href="#" className="tag plain">{t}</a>
            ))}
          </div>

          {/* tabs */}
          <div style={{ borderBottom: '1px solid var(--rule)', display: 'flex', gap: 2, marginBottom: 4 }}>
            {['Newest', 'Active', 'Unanswered 42', 'Top'].map((t, i) => (
              <a key={t} href="#" className="plain" style={{
                padding: '10px 14px', fontSize: 13,
                color: i === 1 ? 'var(--ink)' : 'var(--ink-3)',
                fontWeight: i === 1 ? 500 : 400,
                borderBottom: i === 1 ? '2px solid var(--oxblood)' : '2px solid transparent',
                marginBottom: -1
              }}>{t}</a>
            ))}
          </div>

          {/* questions list */}
          {[
            { title: 'Ash policy that depends on an aggregate from a related resource — possible?', excerpt: 'I have a Question resource with an answer_count aggregate, and I want a policy on Answer that prevents posting once the question is closed…', tags: ['ash-framework', 'authorization', 'policies'], votes: 24, answers: 3, views: 412, accepted: true, user: { name: 'Mira Okafor', hue: 30, rep: 8420, fed: 'home.questionable.org' }, time: '14 min ago' },
            { title: 'Bulk action with a before_action change — order of execution?', excerpt: 'I have a custom change on a bulk update that needs to fire before the transaction. Today I\'m wrapping with Ash.Changeset.before_action but it fires per-record…', tags: ['ash-framework', 'bulk-actions'], votes: 7, answers: 1, views: 92, user: { name: 'Marcus Whitfield', hue: 15, rep: 432, fed: 'home.questionable.org' }, time: '40 min ago' },
            { title: 'Composing two read actions that share a base filter', excerpt: 'I have two read actions, :unanswered and :top, both of which start from a "not closed" filter. I\'d like to factor that base out…', tags: ['ash-framework', 'actions'], votes: 14, answers: 2, views: 188, user: { name: 'Jonas Vester', hue: 70, rep: 312, fed: 'elixir.social' }, time: '3 hr ago' },
            { title: 'Calculation that takes arguments from the actor — best pattern?', excerpt: '…ideally without re-running the calculation per row in a list query. The actor\'s tenant is fixed for the request lifetime so it feels like it should hoist out.', tags: ['ash-framework', 'calculations', 'multi-tenancy'], votes: 19, answers: 3, views: 524, accepted: true, user: { name: 'Priya Shastri', hue: 290, rep: 1240, fed: 'home.questionable.org' }, time: 'yesterday' },
          ].map((q, i) => <QCard key={i} q={q} />)}
        </main>

        <aside style={{ display: 'flex', flexDirection: 'column', gap: 22 }}>
          <div className="card" style={{ padding: 16 }}>
            <div className="eyebrow" style={{ marginBottom: 10 }}>Top contributors</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {[
                { name: 'Ren Hamasaki', hue: 200, rep: 5610, fed: 'fedi.dev', score: 412 },
                { name: 'Mira Okafor', hue: 30, rep: 8420, fed: 'home.questionable.org', score: 388 },
                { name: 'Soraya Lindgren', hue: 240, rep: 14820, fed: 'lemmy.world', score: 240 },
                { name: 'Priya Shastri', hue: 290, rep: 1240, fed: 'home.questionable.org', score: 198 },
              ].map((u, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <QAvatar name={u.name} hue={u.hue} size={28} />
                  <div style={{ flex: 1, fontSize: 12.5 }}>
                    <a href="#" className="plain" style={{ color: 'var(--ink-2)', fontWeight: 500 }}>{u.name}</a>
                    <span className="fed"> ·{u.fed}</span>
                    <div style={{ color: 'var(--ink-4)', fontSize: 11 }} className="tnum">{u.rep.toLocaleString()} rep · {u.score} in this tag</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <SidebarBlock title="Related tags">
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
              {['ash-postgres', 'ash-phoenix', 'ash-authentication', 'elixir', 'ecto', 'spark-dsl'].map(t => <QTag key={t} name={t} count={Math.floor(Math.random() * 800 + 20)} />)}
            </div>
          </SidebarBlock>

          <SidebarBlock title="Wiki excerpt">
            <p className="serif" style={{ fontStyle: 'italic', fontSize: 13.5, color: 'var(--ink-2)', margin: 0, lineHeight: 1.55 }}>
              "Ash starts from the position that the right place to declare what your application does — its data, its rules, its surface — is the code that defines its resources. Everything else (the database layer, the API layer, the auth) flows from those declarations."
            </p>
            <a href="#" style={{ fontSize: 12, marginTop: 8, display: 'inline-block' }}>read the full wiki →</a>
          </SidebarBlock>
        </aside>
      </div>
    </QPage>
  );
}

Object.assign(window, { ScreenTags, ScreenTagDetail });
