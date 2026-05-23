// Questionable — shared components

// ─── Logo ────────────────────────────────────────────────────────────
function QLogo({ size = 22 }) {
  return (
    <a href="#" className="plain" style={{ display: 'inline-flex', alignItems: 'baseline', gap: 0, lineHeight: 1 }}>
      <span className="serif" style={{
        fontSize: size, fontStyle: 'italic', fontWeight: 500, color: 'var(--ink)',
        letterSpacing: '-0.02em'
      }}>
        Question
      </span>
      <span className="serif" style={{
        fontSize: size, fontWeight: 500, color: 'var(--oxblood)',
        letterSpacing: '-0.02em'
      }}>
        able
      </span>
      <span style={{
        fontFamily: 'var(--serif)', fontSize: size * 0.9, color: 'var(--oxblood)',
        marginLeft: 1, fontWeight: 500
      }}>?</span>
    </a>
  );
}

// ─── Top Bar ─────────────────────────────────────────────────────────
function QTopBar({ active = 'home', search = '', notifications = 2, you }) {
  const items = [
    { id: 'home',  label: 'Questions' },
    { id: 'tags',  label: 'Tags' },
    { id: 'users', label: 'People' },
  ];
  return (
    <header style={{
      display: 'flex', alignItems: 'center', gap: 24,
      padding: '14px 32px',
      background: 'var(--card)',
      borderBottom: '1px solid var(--rule)'
    }}>
      <QLogo />
      <nav style={{ display: 'flex', gap: 2, marginLeft: 8 }}>
        {items.map(i => (
          <a key={i.id} href="#" className="plain" style={{
            padding: '6px 10px',
            fontSize: 13,
            color: active === i.id ? 'var(--ink)' : 'var(--ink-3)',
            borderBottom: active === i.id ? '1.5px solid var(--oxblood)' : '1.5px solid transparent',
            fontWeight: active === i.id ? 500 : 400,
          }}>{i.label}</a>
        ))}
      </nav>

      <div style={{ flex: 1, position: 'relative', maxWidth: 480 }}>
        <span style={{
          position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)',
          color: 'var(--ink-4)', fontSize: 13
        }}>⌕</span>
        <input
          className="input"
          defaultValue={search}
          placeholder="Search questions, tags, instances…"
          style={{ paddingLeft: 32, paddingRight: 50, height: 34, fontSize: 13, background: 'var(--paper-2)' }}
        />
        <span className="kbd" style={{ position: 'absolute', right: 10, top: '50%', transform: 'translateY(-50%)' }}>⌘ K</span>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginLeft: 'auto' }}>
        <a href="#" className="btn btn-primary">Ask a question</a>
        <span style={{ position: 'relative', color: 'var(--ink-3)', cursor: 'pointer' }}>
          <span style={{ fontSize: 16 }}>✉</span>
          {notifications > 0 && (
            <span style={{
              position: 'absolute', top: -4, right: -7,
              minWidth: 14, height: 14, padding: '0 3px', borderRadius: 7,
              background: 'var(--oxblood)', color: 'white',
              fontSize: 9.5, fontWeight: 600, fontFamily: 'var(--sans)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              lineHeight: 1
            }}>{notifications}</span>
          )}
        </span>
        {you ? (
          <QAvatar name={you.name} hue={you.hue} size={28} fed={you.fed} hideFed />
        ) : null}
      </div>
    </header>
  );
}

// ─── Avatar ──────────────────────────────────────────────────────────
function QAvatar({ name = 'Anon', hue = 25, size = 28, fed, hideFed }) {
  const initials = name.split(/\s+/).map(s => s[0]).slice(0, 2).join('').toUpperCase();
  return (
    <span style={{
      display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
      width: size, height: size, borderRadius: '50%',
      background: `oklch(0.86 0.04 ${hue})`,
      color: `oklch(0.34 0.08 ${hue})`,
      fontFamily: 'var(--serif)', fontWeight: 500,
      fontSize: size * 0.42,
      border: '1px solid oklch(0.78 0.04 ' + hue + ')',
      letterSpacing: 0,
    }}>{initials}</span>
  );
}

// ─── User chip ───────────────────────────────────────────────────────
function QUserChip({ user, time, rep, action }) {
  return (
    <span style={{ display: 'inline-flex', alignItems: 'center', gap: 8, fontSize: 12.5 }}>
      <QAvatar name={user.name} hue={user.hue} size={22} />
      <span style={{ display: 'inline-flex', flexDirection: 'column', lineHeight: 1.2 }}>
        <span>
          <a href="#" className="plain" style={{ color: 'var(--ink-2)', fontWeight: 500 }}>{user.name}</a>
          {user.fed && <span className="fed"> ·{user.fed}</span>}
          {rep != null && <span className="tnum" style={{ color: 'var(--ink-4)', marginLeft: 6 }}>{rep.toLocaleString()}</span>}
        </span>
        {(time || action) && (
          <span className="meta" style={{ fontSize: 11.5 }}>
            {action && <span>{action} </span>}
            {time && <span className="mono">{time}</span>}
          </span>
        )}
      </span>
    </span>
  );
}

// ─── Tag ─────────────────────────────────────────────────────────────
function QTag({ name, count, accent }) {
  return (
    <a href="#" className="tag plain" style={accent ? { borderColor: 'var(--oxblood)', color: 'var(--oxblood)' } : undefined}>
      {name}
      {count != null && <span className="tag-count tnum">×{count.toLocaleString()}</span>}
    </a>
  );
}

// ─── Vote controls ───────────────────────────────────────────────────
function QVote({ score, voted, accepted }) {
  return (
    <div className="vote">
      <span className="arrow" style={{ fontSize: 18, color: voted === 'up' ? 'var(--oxblood)' : undefined }}>▲</span>
      <span className="num tnum">{score}</span>
      <span className="arrow" style={{ fontSize: 18 }}>▼</span>
      {accepted && (
        <span style={{ marginTop: 6, color: 'var(--sage)', fontSize: 18, lineHeight: 1 }}>✓</span>
      )}
    </div>
  );
}

// ─── Question Card (feed row) ────────────────────────────────────────
function QCard({ q }) {
  return (
    <article style={{
      display: 'grid',
      gridTemplateColumns: '88px 1fr 180px',
      gap: 20,
      padding: '20px 4px',
      borderBottom: '1px solid var(--rule-soft)',
      alignItems: 'start'
    }}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 10, paddingTop: 4 }}>
        <QStat label="votes" value={q.votes} />
        <QStat label="answers" value={q.answers} highlight={q.accepted ? 'accepted' : (q.answers > 0 ? 'has' : null)} />
        <QStat label="views" value={q.views} muted />
      </div>

      <div>
        <h3 style={{ marginBottom: 6 }}>
          <a href="#" className="plain" style={{ color: 'var(--ink)' }}>{q.title}</a>
        </h3>
        <p style={{ color: 'var(--ink-3)', fontSize: 13.5, lineHeight: 1.5, margin: '0 0 10px' }}>
          {q.excerpt}
        </p>
        <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
          {q.tags.map(t => <QTag key={t} name={t} />)}
        </div>
      </div>

      <div style={{ textAlign: 'right', display: 'flex', flexDirection: 'column', gap: 6, alignItems: 'flex-end' }}>
        <QUserChip user={q.user} time={q.time} rep={q.user.rep} action="asked" />
      </div>
    </article>
  );
}

function QStat({ label, value, highlight, muted }) {
  const styles = {
    accepted: { background: 'var(--sage-tint)', color: 'oklch(0.36 0.06 150)', border: '1px solid oklch(0.78 0.05 150)' },
    has:      { background: 'var(--paper-2)', color: 'var(--ink-2)', border: '1px solid var(--rule-soft)' },
  };
  const s = highlight ? styles[highlight] : {};
  return (
    <div style={{
      display: 'flex', alignItems: 'baseline', justifyContent: 'flex-end', gap: 6,
      padding: '2px 8px',
      borderRadius: 3,
      color: muted ? 'var(--ink-4)' : 'var(--ink-2)',
      ...s
    }}>
      <span className="serif tnum" style={{ fontSize: 17, lineHeight: 1, fontWeight: 500 }}>{value}</span>
      <span style={{ fontSize: 10.5, letterSpacing: '0.1em', textTransform: 'uppercase', color: muted ? 'var(--ink-4)' : 'var(--ink-3)' }}>{label}</span>
    </div>
  );
}

// ─── Sidebar ─────────────────────────────────────────────────────────
function QSidebar({ instance = 'home.questionable.org' }) {
  return (
    <aside style={{ width: 256, display: 'flex', flexDirection: 'column', gap: 24, paddingTop: 4 }}>
      <SidebarBlock title="This instance">
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          <Row k="domain" v={<span className="mono" style={{ fontSize: 11.5 }}>{instance}</span>} />
          <Row k="members" v="2,418" />
          <Row k="questions" v="11,902" />
          <Row k="answers" v="38,461" />
          <Row k="federating with" v="184 peers" />
        </div>
      </SidebarBlock>

      <SidebarBlock title="Hot tags">
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
          {['elixir', 'ash-framework', 'phoenix-liveview', 'ecto', 'oban', 'postgres', 'activitypub', 'otp', 'gen_server', 'tailwind'].map(t => (
            <QTag key={t} name={t} count={Math.floor(Math.random() * 800 + 40)} />
          ))}
        </div>
      </SidebarBlock>

      <SidebarBlock title="From the editors">
        <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: 10 }}>
          {[
            'On the etiquette of editing someone else’s answer',
            'A field guide to closing questions kindly',
            'Why we let downvotes cost reputation',
          ].map((t, i) => (
            <li key={i} style={{ borderLeft: '2px solid var(--rule)', paddingLeft: 10 }}>
              <a href="#" className="plain serif" style={{ fontSize: 14, color: 'var(--ink)', fontStyle: 'italic' }}>{t}</a>
            </li>
          ))}
        </ul>
      </SidebarBlock>

      <p className="serif" style={{ fontSize: 12, color: 'var(--ink-4)', fontStyle: 'italic', margin: 0, lineHeight: 1.5 }}>
        — Run by volunteers since 2025.<br/>Federated. Open source. AGPL.
      </p>
    </aside>
  );
}

function SidebarBlock({ title, children }) {
  return (
    <section>
      <div className="eyebrow" style={{ marginBottom: 10, borderBottom: '1px solid var(--rule)', paddingBottom: 6 }}>{title}</div>
      {children}
    </section>
  );
}

function Row({ k, v }) {
  return (
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', fontSize: 12.5 }}>
      <span style={{ color: 'var(--ink-3)' }}>{k}</span>
      <span className="tnum" style={{ color: 'var(--ink) ' }}>{v}</span>
    </div>
  );
}

// ─── Page wrapper ────────────────────────────────────────────────────
function QPage({ children, topActive }) {
  return (
    <div className="qa paper" style={{ width: '100%', height: '100%', overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
      <QTopBar active={topActive} you={{ name: 'Ada Reyes', hue: 25 }} />
      <div style={{ flex: 1, overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
        {children}
      </div>
      <QFooter />
    </div>
  );
}

function QFooter() {
  return (
    <footer style={{
      borderTop: '1px solid var(--rule)',
      padding: '14px 32px',
      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      color: 'var(--ink-4)', fontSize: 11.5,
      background: 'var(--paper-2)'
    }}>
      <div style={{ display: 'flex', gap: 18, fontFamily: 'var(--serif)', fontStyle: 'italic' }}>
        <a href="#" className="plain" style={{ color: 'inherit' }}>About</a>
        <a href="#" className="plain" style={{ color: 'inherit' }}>Federation</a>
        <a href="#" className="plain" style={{ color: 'inherit' }}>Source on GitLab</a>
        <a href="#" className="plain" style={{ color: 'inherit' }}>House rules</a>
        <a href="#" className="plain" style={{ color: 'inherit' }}>Contact the moderators</a>
      </div>
      <div className="mono" style={{ fontSize: 11 }}>
        v0.4.1 · running on Ash 3.4 / Phoenix 1.7 · AGPL
      </div>
    </footer>
  );
}

// Export to window so other babel scripts can use them
Object.assign(window, {
  QLogo, QTopBar, QAvatar, QUserChip, QTag, QVote, QCard, QStat,
  QSidebar, SidebarBlock, Row, QPage, QFooter
});
