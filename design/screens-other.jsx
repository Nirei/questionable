// User profile + Moderation + Auth screens

function ScreenProfile() {
  return (
    <QPage topActive="home">
      <div style={{ flex: 1, overflow: 'auto', padding: '28px 32px 32px' }}>
        {/* Profile header */}
        <header style={{ display: 'grid', gridTemplateColumns: '120px 1fr 280px', gap: 28, paddingBottom: 24, borderBottom: '1px solid var(--rule)' }}>
          <div style={{ display: 'flex', justifyContent: 'center' }}>
            <QAvatar name="Mira Okafor" hue={30} size={108} />
          </div>
          <div>
            <div className="eyebrow" style={{ marginBottom: 4 }}>Member since March 2025</div>
            <h1 style={{ fontSize: 36, marginBottom: 2 }}>Mira Okafor</h1>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: 8, marginBottom: 10 }}>
              <span className="mono" style={{ fontSize: 13, color: 'var(--ink-3)' }}>@mira</span>
              <span className="fed" style={{ fontSize: 14 }}>·home.questionable.org</span>
            </div>
            <p className="serif" style={{ fontSize: 15.5, fontStyle: 'italic', color: 'var(--ink-2)', margin: '0 0 14px', maxWidth: 540, lineHeight: 1.55 }}>
              Backend gardener. Mostly Elixir &amp; Postgres. Maintain a small Ash extension for soft-deletes; happy to talk policies and aggregates at length.
            </p>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 16, fontSize: 12.5, color: 'var(--ink-3)' }}>
              <span>📍 Lagos, Nigeria</span>
              <span>🔗 <a href="#" className="plain">mira.dev</a></span>
              <span>✉ <a href="#" className="plain">moss.codes/@mira</a></span>
              <span>last seen <span className="mono">3m ago</span></span>
            </div>
          </div>

          {/* Reputation card */}
          <div style={{ background: 'var(--paper-2)', border: '1px solid var(--rule)', borderRadius: 6, padding: 16 }}>
            <div className="eyebrow" style={{ marginBottom: 8 }}>Reputation</div>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: 8 }}>
              <span className="serif tnum" style={{ fontSize: 38, fontWeight: 500, color: 'var(--oxblood)' }}>8,420</span>
              <span style={{ color: 'var(--ink-3)', fontSize: 12 }}>this week <span className="tnum" style={{ color: 'oklch(0.42 0.07 150)' }}>+124</span></span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-around', marginTop: 12, gap: 12, paddingTop: 10, borderTop: '1px solid var(--rule)' }}>
              {[
                { v: 6, c: 'oklch(0.65 0.08 75)', t: 'gold' },
                { v: 24, c: 'oklch(0.70 0.04 80)', t: 'silver' },
                { v: 41, c: 'oklch(0.62 0.05 50)', t: 'bronze' },
              ].map(b => (
                <div key={b.t} style={{ textAlign: 'center' }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 4, color: b.c }}>
                    <span style={{ fontSize: 9 }}>●</span>
                    <span className="serif tnum" style={{ fontSize: 16, color: 'var(--ink)' }}>{b.v}</span>
                  </div>
                  <div className="eyebrow" style={{ fontSize: 9 }}>{b.t}</div>
                </div>
              ))}
            </div>
          </div>
        </header>

        {/* Tabs */}
        <div style={{ borderBottom: '1px solid var(--rule)', display: 'flex', gap: 2, marginBottom: 24, marginTop: 8 }}>
          {['Overview', 'Questions 38', 'Answers 142', 'Tags', 'Reputation', 'Bookmarks', 'Settings'].map((t, i) => (
            <a key={t} href="#" className="plain" style={{
              padding: '12px 16px', fontSize: 13,
              color: i === 0 ? 'var(--ink)' : 'var(--ink-3)',
              fontWeight: i === 0 ? 500 : 400,
              borderBottom: i === 0 ? '2px solid var(--oxblood)' : '2px solid transparent',
              marginBottom: -1
            }}>{t}</a>
          ))}
        </div>

        {/* Body */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 290px', gap: 36 }}>
          <main>
            {/* Stats strip */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16, marginBottom: 28 }}>
              {[
                { k: 'questions asked', v: '38', sub: '4 accepted, 6 unanswered' },
                { k: 'answers given', v: '142', sub: '64% acceptance rate' },
                { k: 'people helped', v: '14.2k', sub: 'cumulative views' },
                { k: 'tags championed', v: '12', sub: 'top in ash-framework' },
              ].map((s, i) => (
                <div key={i} style={{ borderTop: '2px solid var(--ink)', paddingTop: 10 }}>
                  <div className="eyebrow" style={{ fontSize: 9.5 }}>{s.k}</div>
                  <div className="serif tnum" style={{ fontSize: 30, fontWeight: 500, lineHeight: 1.1, marginTop: 6 }}>{s.v}</div>
                  <div className="serif" style={{ fontStyle: 'italic', color: 'var(--ink-3)', fontSize: 12, marginTop: 4 }}>{s.sub}</div>
                </div>
              ))}
            </div>

            {/* Top contributions */}
            <section style={{ marginBottom: 28 }}>
              <h2 style={{ marginBottom: 12, display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
                <span>Top contributions</span>
                <span className="serif" style={{ fontStyle: 'italic', color: 'var(--ink-3)', fontSize: 13 }}>by score</span>
              </h2>
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
                <thead>
                  <tr style={{ borderBottom: '1px solid var(--rule)', color: 'var(--ink-3)' }}>
                    <th className="eyebrow" style={{ textAlign: 'left', padding: '8px 6px' }}>kind</th>
                    <th className="eyebrow" style={{ textAlign: 'right', padding: '8px 6px', width: 60 }}>score</th>
                    <th className="eyebrow" style={{ textAlign: 'left', padding: '8px 6px' }}>title</th>
                    <th className="eyebrow" style={{ textAlign: 'right', padding: '8px 6px', width: 100 }}>when</th>
                  </tr>
                </thead>
                <tbody>
                  {[
                    { k: 'A', v: 41, t: 'Using aggregates inside a policy condition — performance footnote', accepted: true, when: '6 days ago' },
                    { k: 'A', v: 34, t: 'Why ash_postgres rejects array_agg in calculations (and what to do instead)', accepted: true, when: '2 wks ago' },
                    { k: 'Q', v: 24, t: 'Ash policy that depends on an aggregate from a related resource — possible?', accepted: true, when: 'today' },
                    { k: 'A', v: 22, t: 'Composing two read actions that share a base filter', accepted: false, when: '3 wks ago' },
                    { k: 'A', v: 19, t: 'Calculation that takes arguments from the actor — best pattern?', accepted: true, when: '1 mo ago' },
                    { k: 'Q', v: 14, t: 'AshAuthentication: customizing the password reset token expiry', accepted: false, when: '2 mo ago' },
                  ].map((r, i) => (
                    <tr key={i} style={{ borderBottom: '1px solid var(--rule-soft)' }}>
                      <td style={{ padding: '10px 6px' }}>
                        <span className="serif" style={{
                          fontStyle: 'italic',
                          color: r.k === 'A' ? 'var(--oxblood)' : 'var(--ink-3)',
                          fontWeight: 500
                        }}>{r.k === 'A' ? 'answer' : 'question'}</span>
                      </td>
                      <td style={{ padding: '10px 6px', textAlign: 'right' }}>
                        <span className="serif tnum" style={{ fontSize: 15, color: 'var(--ink)' }}>{r.v}</span>
                        {r.accepted && <span style={{ color: 'oklch(0.42 0.07 150)', marginLeft: 4 }}>✓</span>}
                      </td>
                      <td style={{ padding: '10px 6px' }}><a href="#" className="plain serif" style={{ fontSize: 14, color: 'var(--ink)' }}>{r.t}</a></td>
                      <td style={{ padding: '10px 6px', textAlign: 'right', color: 'var(--ink-4)', fontSize: 12 }} className="mono">{r.when}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </section>

            {/* Activity heatmap */}
            <section>
              <h2 style={{ marginBottom: 4 }}>A year of curiosity</h2>
              <p className="serif" style={{ fontStyle: 'italic', color: 'var(--ink-3)', fontSize: 13.5, margin: '0 0 14px' }}>
                <span className="tnum">412</span> contributions in the last 12 months · longest streak <span className="tnum">23 days</span>.
              </p>
              <div style={{ display: 'flex', gap: 2, alignItems: 'flex-end' }}>
                {Array.from({ length: 53 }, (_, w) => (
                  <div key={w} style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                    {Array.from({ length: 7 }, (_, d) => {
                      const seed = (w * 7 + d * 13) % 100;
                      const level = seed < 50 ? 0 : seed < 75 ? 1 : seed < 90 ? 2 : seed < 97 ? 3 : 4;
                      const colors = ['var(--paper-3)', 'oklch(0.88 0.05 25)', 'oklch(0.74 0.08 25)', 'oklch(0.58 0.10 25)', 'oklch(0.42 0.10 25)'];
                      return <div key={d} style={{ width: 10, height: 10, background: colors[level], borderRadius: 1 }} />;
                    })}
                  </div>
                ))}
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 8, fontSize: 11, color: 'var(--ink-4)' }} className="mono">
                <span>May 2025</span>
                <div style={{ display: 'flex', alignItems: 'center', gap: 5, fontSize: 11 }}>
                  <span>less</span>
                  {[0,1,2,3,4].map(l => {
                    const colors = ['var(--paper-3)', 'oklch(0.88 0.05 25)', 'oklch(0.74 0.08 25)', 'oklch(0.58 0.10 25)', 'oklch(0.42 0.10 25)'];
                    return <span key={l} style={{ width: 10, height: 10, background: colors[l], borderRadius: 1, display: 'inline-block' }} />;
                  })}
                  <span>more</span>
                </div>
                <span>May 2026</span>
              </div>
            </section>
          </main>

          <aside style={{ display: 'flex', flexDirection: 'column', gap: 22 }}>
            <SidebarBlock title="Badges earned recently">
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                {[
                  { c: 'oklch(0.65 0.08 75)', n: 'Reviewer', d: 'closed 100 questions for cause', d2: '3 weeks ago' },
                  { c: 'oklch(0.70 0.04 80)', n: 'Federated', d: 'first accepted answer to a remote question', d2: '1 month ago' },
                  { c: 'oklch(0.62 0.05 50)', n: 'Civic Duty', d: 'voted 300 times', d2: '2 months ago' },
                  { c: 'oklch(0.65 0.08 75)', n: 'Populist', d: 'highest scoring answer that outscored an accepted one', d2: '3 months ago' },
                ].map((b, i) => (
                  <div key={i} style={{ display: 'flex', gap: 10, alignItems: 'baseline', padding: '6px 0', borderBottom: i < 3 ? '1px dashed var(--rule-soft)' : 'none' }}>
                    <span style={{ color: b.c, fontSize: 12 }}>●</span>
                    <div style={{ fontSize: 12.5, color: 'var(--ink-2)' }}>
                      <div style={{ color: 'var(--ink)', fontWeight: 500 }}>{b.n}</div>
                      <div className="serif" style={{ fontStyle: 'italic', color: 'var(--ink-3)', fontSize: 12 }}>{b.d}</div>
                      <div style={{ color: 'var(--ink-4)', fontSize: 11 }} className="mono">{b.d2}</div>
                    </div>
                  </div>
                ))}
              </div>
            </SidebarBlock>

            <SidebarBlock title="Most active tags">
              <div style={{ display: 'flex', flexDirection: 'column', gap: 6, fontSize: 12.5 }}>
                {[
                  { t: 'ash-framework', s: 4280, q: 64 },
                  { t: 'elixir', s: 1840, q: 38 },
                  { t: 'policies', s: 1420, q: 22 },
                  { t: 'phoenix-liveview', s: 612, q: 18 },
                  { t: 'ecto', s: 380, q: 12 },
                ].map(r => (
                  <div key={r.t} style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between' }}>
                    <a href="#" className="plain mono" style={{ fontSize: 12.5, color: 'var(--ink)' }}>{r.t}</a>
                    <span style={{ fontSize: 11, color: 'var(--ink-4)' }} className="tnum">{r.s.toLocaleString()} · {r.q} posts</span>
                  </div>
                ))}
              </div>
            </SidebarBlock>
          </aside>
        </div>
      </div>
    </QPage>
  );
}

// ─── Moderation dashboard ────────────────────────────────────────────
function ScreenMod() {
  return (
    <QPage topActive="home">
      <div style={{ flex: 1, overflow: 'auto', padding: '28px 32px 32px' }}>
        <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: 18 }}>
          <div>
            <div className="eyebrow" style={{ marginBottom: 6 }}>The Back Room</div>
            <h1 style={{ fontSize: 32 }}>Moderation queue</h1>
            <p className="serif" style={{ fontStyle: 'italic', color: 'var(--ink-3)', fontSize: 14.5, margin: '6px 0 0' }}>
              Be slow to judge. Be kinder than necessary. Cite the rule.
            </p>
          </div>
          <div style={{ display: 'flex', gap: 8 }}>
            <button className="btn btn-sm">Audit log</button>
            <button className="btn btn-sm">House rules</button>
          </div>
        </header>

        {/* KPI strip */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: 0, border: '1px solid var(--rule)', borderRadius: 6, marginBottom: 22, background: 'var(--card)' }}>
          {[
            { k: 'flags open', v: 14, sub: '3 new today' },
            { k: 'close votes', v: 6, sub: '2 from federated peers' },
            { k: 'low quality', v: 23, sub: 'auto-detected' },
            { k: 'reopen requests', v: 2, sub: '' },
            { k: 'spam', v: 0, sub: 'clean for 3d' },
          ].map((s, i) => (
            <div key={i} style={{ padding: '16px 18px', borderRight: i < 4 ? '1px solid var(--rule)' : 'none' }}>
              <div className="eyebrow" style={{ fontSize: 9.5 }}>{s.k}</div>
              <div className="serif tnum" style={{ fontSize: 32, fontWeight: 500, lineHeight: 1.1, marginTop: 4, color: s.v > 10 ? 'var(--oxblood)' : 'var(--ink)' }}>{s.v}</div>
              <div style={{ color: 'var(--ink-3)', fontSize: 11.5, marginTop: 2, fontStyle: 'italic', fontFamily: 'var(--serif)' }}>{s.sub || '—'}</div>
            </div>
          ))}
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 280px', gap: 32 }}>
          <main>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 14 }}>
              <h2 style={{ fontSize: 19 }}>Queue</h2>
              <div style={{ display: 'flex', gap: 4 }}>
                {['Flags 14', 'Close votes 6', 'Low quality 23', 'Reopens 2', 'Spam 0'].map((t, i) => (
                  <a key={t} href="#" className="tag plain" style={i === 0 ? { background: 'var(--ink)', color: 'var(--paper)', borderColor: 'var(--ink)' } : null}>{t}</a>
                ))}
              </div>
              <span style={{ marginLeft: 'auto', fontSize: 12, color: 'var(--ink-3)' }}>oldest first · <a href="#">newest</a></span>
            </div>

            {[
              {
                kind: 'Flag · spam',
                target: 'A · "Buy cheap Ash mugs ⤴ ⤴ link"',
                quote: 'Visit our store at discount-elixir-mugs.example for 50% off all Ash branded merchandise…',
                reporter: { name: 'Soraya Lindgren', fed: 'lemmy.world' },
                reasons: ['spam ×4', 'low quality ×2'],
                actions: ['Delete', 'Suspend author', 'Dismiss flag'],
                heat: 'red',
              },
              {
                kind: 'Close vote · off-topic',
                target: 'Q · "Best Elixir IDE in 2026?"',
                quote: 'Pretty much the title. I\'ve tried VSCode, Zed, and Helix. What does everyone here use?',
                reporter: { name: 'Ren Hamasaki', fed: 'fedi.dev' },
                reasons: ['opinion-based ×3', 'too broad ×1'],
                actions: ['Close', 'Migrate to discussion', 'Dismiss'],
                heat: 'amber',
              },
              {
                kind: 'Federated flag',
                target: 'A · on elixir.social — "Reply to: How to mock Req in Mox?"',
                quote: 'Forwarded by their moderators with note: "Possibly resolved already — please cross-reference"',
                reporter: { name: 'moderators', fed: 'elixir.social' },
                reasons: ['duplicate ×1'],
                actions: ['Cross-link', 'Confirm', 'Dismiss'],
                heat: 'sage',
              },
              {
                kind: 'Low quality',
                target: 'A · "Have you tried turning it off and on again?"',
                quote: 'just restart it lol',
                reporter: { name: 'auto-flagger', fed: 'system' },
                reasons: ['very short', 'no code', 'low-effort phrasing'],
                actions: ['Convert to comment', 'Delete', 'Dismiss'],
                heat: 'amber',
              },
            ].map((row, i) => (
              <article key={i} style={{ padding: '16px 18px', border: '1px solid var(--rule)', borderRadius: 6, marginBottom: 10, background: 'var(--card)', display: 'grid', gridTemplateColumns: '5px 1fr 200px', gap: 16, alignItems: 'start' }}>
                <div style={{
                  width: 4, alignSelf: 'stretch', borderRadius: 2,
                  background: row.heat === 'red' ? 'var(--oxblood)' : row.heat === 'amber' ? 'var(--amber)' : 'var(--sage)'
                }} />
                <div>
                  <div style={{ display: 'flex', alignItems: 'baseline', gap: 12, marginBottom: 4 }}>
                    <span className="eyebrow">{row.kind}</span>
                    <span style={{ fontSize: 11, color: 'var(--ink-4)' }} className="mono">#{(2400 + i).toString()}</span>
                  </div>
                  <h3 style={{ fontSize: 16, marginBottom: 6 }}><a href="#" className="plain">{row.target}</a></h3>
                  <blockquote style={{ margin: '0 0 10px', padding: '6px 12px', borderLeft: '2px solid var(--rule)', color: 'var(--ink-2)', fontSize: 13, fontFamily: 'var(--serif)', fontStyle: 'italic' }}>
                    "{row.quote}"
                  </blockquote>
                  <div style={{ display: 'flex', gap: 8, alignItems: 'center', fontSize: 12, color: 'var(--ink-3)', flexWrap: 'wrap' }}>
                    <span>flagged by <a href="#" className="plain" style={{ color: 'var(--ink-2)', fontWeight: 500 }}>{row.reporter.name}</a><span className="fed"> ·{row.reporter.fed}</span></span>
                    <span style={{ color: 'var(--ink-4)' }}>·</span>
                    {row.reasons.map(r => <span key={r} className="tag" style={{ background: 'var(--paper-2)', fontSize: 10.5, padding: '2px 7px' }}>{r}</span>)}
                  </div>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                  {row.actions.map((a, j) => (
                    <button key={a} className={j === 0 ? 'btn btn-primary' : 'btn'} style={{ justifyContent: 'center', fontSize: 12 }}>{a}</button>
                  ))}
                </div>
              </article>
            ))}
          </main>

          <aside style={{ display: 'flex', flexDirection: 'column', gap: 22 }}>
            <SidebarBlock title="Active moderators">
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                {[
                  { name: 'Ada Reyes', hue: 25, status: 'on duty', online: true },
                  { name: 'Henrik Vos', hue: 110, status: 'on duty', online: true },
                  { name: 'Lila Park', hue: 320, status: 'reviewing', online: true },
                  { name: 'Eitan Cohen', hue: 50, status: 'off', online: false },
                ].map(m => (
                  <div key={m.name} style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 12.5 }}>
                    <span style={{ position: 'relative' }}>
                      <QAvatar name={m.name} hue={m.hue} size={26} />
                      <span style={{ position: 'absolute', bottom: 0, right: 0, width: 8, height: 8, borderRadius: '50%', background: m.online ? 'oklch(0.65 0.10 150)' : 'var(--ink-4)', border: '1.5px solid var(--card)' }} />
                    </span>
                    <span style={{ color: 'var(--ink-2)', fontWeight: 500 }}>{m.name}</span>
                    <span className="serif" style={{ fontStyle: 'italic', color: 'var(--ink-4)', fontSize: 11.5, marginLeft: 'auto' }}>{m.status}</span>
                  </div>
                ))}
              </div>
            </SidebarBlock>

            <SidebarBlock title="Recent decisions">
              <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: 10, fontSize: 12.5, color: 'var(--ink-2)' }}>
                <li><span className="eyebrow" style={{ fontSize: 9 }}>2m</span> · <b>Henrik</b> closed <a href="#" className="plain">"What is best ORM"</a> — opinion-based.</li>
                <li><span className="eyebrow" style={{ fontSize: 9 }}>14m</span> · <b>Lila</b> migrated an answer to a comment.</li>
                <li><span className="eyebrow" style={{ fontSize: 9 }}>1h</span> · <b>Ada</b> reopened <a href="#" className="plain">"Ash + Multi-tenancy"</a> after edit.</li>
                <li><span className="eyebrow" style={{ fontSize: 9 }}>3h</span> · <b>Henrik</b> warned a user for tone.</li>
              </ul>
            </SidebarBlock>

            <div className="card" style={{ padding: 14, background: 'var(--oxblood-tint)', borderColor: 'oklch(0.82 0.05 25)' }}>
              <div className="eyebrow" style={{ color: 'var(--oxblood)' }}>Don't forget</div>
              <p className="serif" style={{ fontStyle: 'italic', color: 'var(--ink)', fontSize: 13.5, margin: '6px 0 0', lineHeight: 1.5 }}>
                When closing a question, write a one-line note in plain English. The asker has feelings too.
              </p>
            </div>
          </aside>
        </div>
      </div>
    </QPage>
  );
}

// ─── Auth ────────────────────────────────────────────────────────────
function ScreenAuth() {
  return (
    <div className="qa paper" style={{ width: '100%', height: '100%', overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
      <header style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '18px 36px', borderBottom: '1px solid var(--rule)' }}>
        <QLogo size={20} />
        <div style={{ fontSize: 12.5, color: 'var(--ink-3)' }}>
          New here? <a href="#" style={{ color: 'var(--oxblood)' }}>Read about Questionable</a>
        </div>
      </header>

      <div style={{ flex: 1, display: 'grid', gridTemplateColumns: '1fr 1fr', overflow: 'hidden' }}>
        {/* Left: editorial column */}
        <section style={{ padding: '60px 56px', borderRight: '1px solid var(--rule)', background: 'var(--paper-2)', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
          <div>
            <div className="eyebrow" style={{ marginBottom: 14 }}>Welcome, neighbour</div>
            <h1 style={{ fontSize: 50, lineHeight: 1.05, fontWeight: 500, letterSpacing: '-0.015em' }}>
              A small, open place to <span style={{ fontStyle: 'italic', color: 'var(--oxblood)' }}>ask</span>,<br />
              <span style={{ fontStyle: 'italic' }}>answer</span>, and be <span style={{ fontStyle: 'italic' }}>answered.</span>
            </h1>
            <p className="serif" style={{ fontSize: 17, lineHeight: 1.55, color: 'var(--ink-2)', maxWidth: 460, marginTop: 24, fontStyle: 'italic' }}>
              Questionable is a federated Q&amp;A platform — like the old comfortable corners of the web, but with neighbours.
              Your account here can follow tags, vote, and post on any instance.
            </p>
          </div>

          <div>
            <div className="eyebrow" style={{ marginBottom: 10 }}>This instance is moderated by</div>
            <div style={{ display: 'flex', gap: 8, alignItems: 'center', marginBottom: 16 }}>
              {[{n:'Ada Reyes',h:25},{n:'Henrik Vos',h:110},{n:'Lila Park',h:320},{n:'Eitan Cohen',h:50}].map(m => (
                <QAvatar key={m.n} name={m.n} hue={m.h} size={32} />
              ))}
              <span className="serif" style={{ fontStyle: 'italic', color: 'var(--ink-3)', fontSize: 13, marginLeft: 4 }}>
                — small group, mostly nights &amp; weekends.
              </span>
            </div>
            <p className="serif" style={{ fontStyle: 'italic', color: 'var(--ink-3)', fontSize: 13, margin: 0, maxWidth: 460 }}>
              "We try to read every flag within a day. Be patient with us, and we'll be patient with you."
            </p>
          </div>
        </section>

        {/* Right: form column */}
        <section style={{ padding: '60px 56px', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
          <div style={{ maxWidth: 380, width: '100%' }}>
            <div style={{ display: 'flex', borderBottom: '1px solid var(--rule)', marginBottom: 24 }}>
              {['Sign in', 'Create an account'].map((t, i) => (
                <a key={t} href="#" className="plain serif" style={{
                  padding: '10px 0',
                  marginRight: 28,
                  fontSize: 18,
                  fontStyle: 'italic',
                  color: i === 1 ? 'var(--ink)' : 'var(--ink-4)',
                  fontWeight: 500,
                  borderBottom: i === 1 ? '2px solid var(--oxblood)' : 'none',
                  marginBottom: -1
                }}>{t}</a>
              ))}
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              <div>
                <label className="eyebrow" style={{ display: 'block', marginBottom: 6 }}>Username</label>
                <div style={{ position: 'relative' }}>
                  <input className="input" defaultValue="mira" style={{ paddingRight: 130 }} />
                  <span className="fed" style={{ position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)', fontSize: 13.5 }}>·home.questionable.org</span>
                </div>
              </div>

              <div>
                <label className="eyebrow" style={{ display: 'block', marginBottom: 6 }}>Email</label>
                <input className="input" placeholder="you@example.com" />
              </div>

              <div>
                <label className="eyebrow" style={{ display: 'block', marginBottom: 6 }}>Password</label>
                <input className="input" type="password" defaultValue="••••••••••••" />
                <div style={{ marginTop: 6, display: 'flex', gap: 3 }}>
                  {[0,1,2,3].map(i => (
                    <div key={i} style={{ height: 3, flex: 1, background: i < 3 ? 'oklch(0.42 0.07 150)' : 'var(--rule)', borderRadius: 2 }} />
                  ))}
                </div>
                <span className="serif" style={{ fontStyle: 'italic', color: 'var(--ink-3)', fontSize: 11.5 }}>strong — would take centuries to crack</span>
              </div>

              <label style={{ display: 'flex', gap: 8, alignItems: 'flex-start', fontSize: 12.5, color: 'var(--ink-2)', marginTop: 4 }}>
                <input type="checkbox" defaultChecked style={{ marginTop: 2 }} />
                <span>I'd like my actions to federate to peers I follow.<br/>
                  <span style={{ color: 'var(--ink-3)' }}>(You can change this anytime — this enables ActivityPub publication.)</span>
                </span>
              </label>

              <button className="btn btn-primary" style={{ marginTop: 8, justifyContent: 'center', padding: '11px 14px', fontSize: 14 }}>
                Create my account →
              </button>

              <div style={{ display: 'flex', alignItems: 'center', gap: 10, color: 'var(--ink-4)', fontSize: 12, margin: '10px 0' }}>
                <span style={{ flex: 1, height: 1, background: 'var(--rule)' }} />
                <span className="serif" style={{ fontStyle: 'italic' }}>or</span>
                <span style={{ flex: 1, height: 1, background: 'var(--rule)' }} />
              </div>

              <div style={{ display: 'flex', gap: 8 }}>
                <button className="btn" style={{ flex: 1, justifyContent: 'center' }}>Use a magic link</button>
                <button className="btn" style={{ flex: 1, justifyContent: 'center' }}>GitHub</button>
              </div>

              <p className="serif" style={{ fontSize: 12, color: 'var(--ink-4)', fontStyle: 'italic', textAlign: 'center', margin: '14px 0 0', lineHeight: 1.55 }}>
                By signing up you agree to the <a href="#">house rules</a>.<br/>
                We don't sell anything. We don't have analytics. We have a moderation queue.
              </p>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}

Object.assign(window, { ScreenProfile, ScreenMod, ScreenAuth });
