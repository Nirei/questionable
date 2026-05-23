// Question detail + Ask question

function ScreenQuestion() {
  return (
    <QPage topActive="home">
      <div style={{ flex: 1, overflow: 'hidden', display: 'grid', gridTemplateColumns: '1fr 256px', gap: 40, padding: '24px 32px 32px' }}>
        <main style={{ minWidth: 0 }}>
          {/* breadcrumb */}
          <div style={{ display: 'flex', gap: 8, fontSize: 12, color: 'var(--ink-3)', marginBottom: 12 }}>
            <a href="#" className="plain" style={{ color: 'inherit' }}>Questions</a>
            <span className="ornament">›</span>
            <a href="#" className="plain" style={{ color: 'inherit' }}>[ash-framework]</a>
            <span className="ornament">›</span>
            <span style={{ color: 'var(--ink-4)' }}>Ash policy that depends on an aggregate…</span>
          </div>

          {/* Title block */}
          <header style={{ paddingBottom: 18, borderBottom: '1px solid var(--rule)' }}>
            <h1 style={{ fontSize: 30, lineHeight: 1.2, marginBottom: 14 }}>
              Ash policy that depends on an aggregate from a related resource — <span style={{ fontStyle: 'italic' }}>possible?</span>
            </h1>
            <div style={{ display: 'flex', gap: 20, alignItems: 'center', flexWrap: 'wrap', fontSize: 12.5, color: 'var(--ink-3)' }}>
              <span><span className="eyebrow" style={{ fontSize: 9, marginRight: 6 }}>asked</span> 14 min ago</span>
              <span><span className="eyebrow" style={{ fontSize: 9, marginRight: 6 }}>modified</span> 3 min ago</span>
              <span><span className="eyebrow" style={{ fontSize: 9, marginRight: 6 }}>viewed</span> <span className="tnum">412 times</span></span>
              <span style={{ marginLeft: 'auto', display: 'flex', gap: 6 }}>
                <button className="btn btn-sm">★ Watch</button>
                <button className="btn btn-sm">Share</button>
                <button className="btn btn-sm">Edit</button>
              </span>
            </div>
          </header>

          {/* Question body */}
          <div style={{ display: 'grid', gridTemplateColumns: '52px 1fr', gap: 20, paddingTop: 22, paddingBottom: 22, borderBottom: '1px solid var(--rule-soft)' }}>
            <QVote score={24} voted="up" />
            <div>
              <div className="serif" style={{ fontSize: 16.5, lineHeight: 1.65, color: 'var(--ink)' }}>
                <p className="dropcap" style={{ marginTop: 0 }}>
                  I have a <code>Question</code> resource with an <code>answer_count</code> aggregate, and I want a policy on <code>Answer</code> that prevents posting once the parent is closed. The aggregate is on the parent resource — can <code>authorize_if</code> reach across the relationship without bypassing Ash to write raw Ecto?
                </p>
                <p>
                  Here's the version I have working today, which feels like a workaround because it loads the parent explicitly inside the policy condition:
                </p>
              </div>

              <pre><span style={{ color: 'var(--ink-4)' }}>{`# lib/questionable/qa/answer.ex`}</span>
{`
policies do
  policy action_type(:create) do
    authorize_if expr(
      not exists(question, is_closed == true)
    )
  end
end`}</pre>

              <div className="serif" style={{ fontSize: 16.5, lineHeight: 1.65, color: 'var(--ink)', marginTop: 14 }}>
                <p>
                  This works, but I'd like the rule to depend on an <em>aggregate</em>, not a relationship traversal — specifically, I want to block answering once <code>answer_count</code> reaches some threshold that varies by tag. Is there a way to write this in the policy block declaratively, or do I drop down to <code>check</code> with a custom module?
                </p>
                <p>
                  Aside: I read in the Ash docs that aggregates can be referenced from calculations, but it wasn't clear whether the policy DSL accepts the same expression surface.
                </p>
              </div>

              {/* footer */}
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginTop: 20 }}>
                {['ash-framework', 'elixir', 'authorization', 'policies', 'aggregates'].map(t => <QTag key={t} name={t} />)}
              </div>

              <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', marginTop: 18, gap: 24 }}>
                <div style={{ display: 'flex', gap: 14, fontSize: 12, color: 'var(--ink-3)' }}>
                  <a href="#">Share</a><a href="#">Edit</a><a href="#">Follow</a><a href="#">Flag</a>
                </div>
                <div style={{ background: 'var(--paper-2)', border: '1px solid var(--rule-soft)', borderRadius: 6, padding: '10px 12px', display: 'flex', alignItems: 'center', gap: 10, maxWidth: 280 }}>
                  <QAvatar name="Mira Okafor" hue={30} size={36} />
                  <div style={{ fontSize: 12.5 }}>
                    <div style={{ color: 'var(--ink-3)', fontSize: 11 }} className="eyebrow">asked Mar 18</div>
                    <a href="#" className="plain" style={{ color: 'var(--ink-2)', fontWeight: 500 }}>Mira Okafor</a>
                    <span className="fed"> ·home.questionable.org</span>
                    <div style={{ color: 'var(--ink-3)' }}><span className="tnum" style={{ color: 'var(--ink-2)', fontWeight: 500 }}>8,420</span> · 14 silver · 39 bronze</div>
                  </div>
                </div>
              </div>

              {/* comments */}
              <div style={{ marginTop: 16, paddingTop: 12, borderTop: '1px dashed var(--rule)' }}>
                {[
                  { who: 'Ren Hamasaki', fed: 'fedi.dev', text: 'You can absolutely reference aggregates from policy expressions — it\'s the same expression layer as calculations. The trick is they have to be loaded by the read action behind the policy, which the policy authorizer will do for you if you put them in the resource. Will write up an answer.', time: '11 min ago' },
                  { who: 'Soraya Lindgren', fed: 'lemmy.world', text: 'Tagging this one for our weekly digest — common pitfall.', time: '6 min ago' },
                ].map((c, i) => (
                  <div key={i} style={{ fontSize: 13, color: 'var(--ink-2)', padding: '6px 0', borderBottom: i === 0 ? '1px dashed var(--rule-soft)' : 'none', display: 'flex', gap: 10 }}>
                    <span style={{ color: 'var(--ink-4)', fontFamily: 'var(--serif)', fontStyle: 'italic', flexShrink: 0 }}>—</span>
                    <span style={{ lineHeight: 1.55 }}>
                      {c.text} <a href="#" className="plain" style={{ color: 'var(--oxblood)', fontWeight: 500 }}>{c.who}</a>
                      <span className="fed"> ·{c.fed}</span>
                      <span style={{ color: 'var(--ink-4)', marginLeft: 6 }} className="mono">{c.time}</span>
                    </span>
                  </div>
                ))}
                <a href="#" style={{ fontSize: 12, color: 'var(--ink-3)', display: 'inline-block', marginTop: 6 }}>add a comment</a>
              </div>
            </div>
          </div>

          {/* Answer header */}
          <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', padding: '22px 0 12px' }}>
            <h2><span className="tnum">3</span> Answers</h2>
            <div style={{ display: 'flex', gap: 12, fontSize: 12, color: 'var(--ink-3)' }}>
              <span className="eyebrow">sort</span>
              <a href="#" style={{ color: 'var(--ink)', fontWeight: 500 }}>highest score</a>
              <a href="#" style={{ color: 'var(--ink-4)' }}>oldest</a>
              <a href="#" style={{ color: 'var(--ink-4)' }}>newest</a>
            </div>
          </div>

          {/* Accepted answer */}
          <AnswerBlock
            score={31}
            accepted
            voted="up"
            user={{ name: 'Ren Hamasaki', hue: 200, fed: 'fedi.dev', rep: 5610, when: 'answered Mar 18 at 14:02' }}
            body={(
              <>
                <p>
                  Yes — aggregates are first-class in policy expressions because the policy authorizer runs the same expression compiler as calculations. The only requirement is that the aggregate has to be defined on the resource being authorized (or reachable via a relationship), and Ash will load it transparently when it evaluates the policy.
                </p>
                <p>Here's the working pattern from our codebase:</p>
              </>
            )}
            code={`policies do
  policy action_type(:create) do
    # questions.answer_count is an aggregate on the parent
    authorize_if expr(
      question.answer_count < question.max_answers
    )
    forbid_if expr(question.is_closed)
  end
end`}
            footer={(
              <p>
                If your threshold varies by tag (as you mentioned), expose it as a calculation on <code>Question</code> that joins through <code>question_tags</code> and returns the tag's <code>max_answers</code> — then reference the calc the same way. Avoid putting the conditional logic inside the policy itself; keep policies thin.
              </p>
            )}
            comments={[
              { who: 'Mira Okafor', fed: 'home.questionable.org', text: 'This was the missing piece — moved the threshold into a calc and it composes cleanly with the rest of the policy chain.', time: '3 min ago' },
            ]}
          />

          {/* Second answer */}
          <AnswerBlock
            score={7}
            user={{ name: 'Priya Shastri', hue: 290, fed: 'home.questionable.org', rep: 1240, when: 'answered Mar 18 at 16:40' }}
            body={(
              <>
                <p>
                  Worth noting that if you ever need logic the expression DSL can't express — e.g. checking a value against the requesting actor in a way the compiler doesn't lift — you can drop down to a custom <code>Ash.Policy.SimpleCheck</code>. We use this for the "minimum reputation to downvote" rule, which depends on the actor and not on the resource being voted on.
                </p>
              </>
            )}
          />
        </main>

        <aside style={{ display: 'flex', flexDirection: 'column', gap: 22 }}>
          <div className="card" style={{ padding: 16 }}>
            <div className="eyebrow" style={{ marginBottom: 10 }}>About this question</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 6, fontSize: 12.5 }}>
              <Row k="asked" v="3 days ago" />
              <Row k="last activity" v="3 min ago" />
              <Row k="viewed" v="412 times" />
              <Row k="active on" v="3 instances" />
            </div>
            <div style={{ marginTop: 12, paddingTop: 12, borderTop: '1px solid var(--rule-soft)' }}>
              <div className="eyebrow" style={{ marginBottom: 8 }}>Federation</div>
              <div className="serif" style={{ fontStyle: 'italic', color: 'var(--ink-2)', fontSize: 13, lineHeight: 1.5 }}>
                Mirrored from <a href="#" className="plain"><b>home.questionable.org</b></a>.<br/>
                Answers posted here will federate back.
              </div>
            </div>
          </div>

          <SidebarBlock title="Related">
            <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: 10 }}>
              {[
                { v: 41, t: 'Using aggregates inside a policy condition — performance footnote' },
                { v: 12, t: 'Stale aggregate after bulk update — invalidation strategy?' },
                { v: 8,  t: 'Combining tenant_id and ash_authentication scopes in a policy' },
                { v: 5,  t: 'Can policies reference relationships across data layers?' },
              ].map((r, i) => (
                <li key={i} style={{ display: 'grid', gridTemplateColumns: '36px 1fr', gap: 8, alignItems: 'baseline' }}>
                  <span className="serif tnum" style={{ fontSize: 14, color: 'var(--ink-3)', textAlign: 'right' }}>{r.v}</span>
                  <a href="#" className="plain serif" style={{ fontSize: 13.5, color: 'var(--ink)', lineHeight: 1.4 }}>{r.t}</a>
                </li>
              ))}
            </ul>
          </SidebarBlock>

          <SidebarBlock title="Hot tags">
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
              {['ash-framework', 'policies', 'authorization', 'aggregates', 'elixir'].map(t => <QTag key={t} name={t} accent={t === 'ash-framework'} />)}
            </div>
          </SidebarBlock>
        </aside>
      </div>
    </QPage>
  );
}

function AnswerBlock({ score, voted, accepted, user, body, code, footer, comments }) {
  return (
    <div style={{
      display: 'grid', gridTemplateColumns: '52px 1fr', gap: 20,
      padding: '24px 0', borderBottom: '1px solid var(--rule-soft)',
      ...(accepted ? { background: 'oklch(0.97 0.02 150 / 0.5)', borderRadius: 6, padding: '24px 18px', borderBottom: 'none', border: '1px solid oklch(0.85 0.04 150)', marginBottom: 6 } : {})
    }}>
      <QVote score={score} voted={voted} accepted={accepted} />
      <div>
        {accepted && (
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12, color: 'oklch(0.36 0.07 150)' }}>
            <span style={{ fontSize: 16 }}>✓</span>
            <span className="eyebrow" style={{ color: 'inherit' }}>Accepted answer</span>
            <span className="serif" style={{ fontStyle: 'italic', fontSize: 13, color: 'var(--ink-3)' }}>— chosen by the asker</span>
          </div>
        )}
        <div className="serif" style={{ fontSize: 16, lineHeight: 1.65, color: 'var(--ink)' }}>{body}</div>
        {code && <pre style={{ marginTop: 10 }}>{code}</pre>}
        {footer && <div className="serif" style={{ fontSize: 16, lineHeight: 1.65, marginTop: 12 }}>{footer}</div>}

        <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', marginTop: 18, gap: 24 }}>
          <div style={{ display: 'flex', gap: 14, fontSize: 12, color: 'var(--ink-3)' }}>
            <a href="#">Share</a><a href="#">Edit</a><a href="#">Follow</a><a href="#">Flag</a>
          </div>
          <div style={{ background: 'var(--paper-2)', border: '1px solid var(--rule-soft)', borderRadius: 6, padding: '10px 12px', display: 'flex', alignItems: 'center', gap: 10, maxWidth: 280 }}>
            <QAvatar name={user.name} hue={user.hue} size={36} />
            <div style={{ fontSize: 12.5 }}>
              <div style={{ color: 'var(--ink-3)', fontSize: 11 }} className="eyebrow">{user.when}</div>
              <a href="#" className="plain" style={{ color: 'var(--ink-2)', fontWeight: 500 }}>{user.name}</a>
              <span className="fed"> ·{user.fed}</span>
              <div style={{ color: 'var(--ink-3)' }}><span className="tnum" style={{ color: 'var(--ink-2)', fontWeight: 500 }}>{user.rep.toLocaleString()}</span></div>
            </div>
          </div>
        </div>

        {comments && comments.length > 0 && (
          <div style={{ marginTop: 16, paddingTop: 12, borderTop: '1px dashed var(--rule)' }}>
            {comments.map((c, i) => (
              <div key={i} style={{ fontSize: 13, color: 'var(--ink-2)', padding: '6px 0', display: 'flex', gap: 10 }}>
                <span style={{ color: 'var(--ink-4)', fontFamily: 'var(--serif)', fontStyle: 'italic', flexShrink: 0 }}>—</span>
                <span style={{ lineHeight: 1.55 }}>
                  {c.text} <a href="#" className="plain" style={{ color: 'var(--oxblood)', fontWeight: 500 }}>{c.who}</a>
                  <span className="fed"> ·{c.fed}</span>
                  <span style={{ color: 'var(--ink-4)', marginLeft: 6 }} className="mono">{c.time}</span>
                </span>
              </div>
            ))}
            <a href="#" style={{ fontSize: 12, color: 'var(--ink-3)', display: 'inline-block', marginTop: 6 }}>add a comment</a>
          </div>
        )}
      </div>
    </div>
  );
}

// ─── Ask question screen ─────────────────────────────────────────────
function ScreenAsk() {
  return (
    <QPage topActive="home">
      <div style={{ flex: 1, overflow: 'hidden', display: 'grid', gridTemplateColumns: '1fr 290px', gap: 40, padding: '24px 32px 32px' }}>
        <main style={{ minWidth: 0 }}>
          <div className="eyebrow" style={{ marginBottom: 8 }}>Compose</div>
          <h1 style={{ fontSize: 30, marginBottom: 6 }}>Ask a <span style={{ fontStyle: 'italic' }}>good</span> question.</h1>
          <p className="serif" style={{ fontStyle: 'italic', color: 'var(--ink-3)', fontSize: 14.5, margin: '0 0 22px', maxWidth: 540, lineHeight: 1.5 }}>
            Write as if you were leaving a note for the next person to hit this problem.
            Specifics, version numbers, what you've already tried.
          </p>

          {/* Title field */}
          <Field
            num="1"
            label="Title"
            help="One sentence. Plain language. What you'd type into a search box."
          >
            <input className="input" defaultValue="How do I reference an aggregate from another resource in an Ash policy?" style={{ fontFamily: 'var(--serif)', fontSize: 18 }} />
            <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 6, fontSize: 11.5, color: 'var(--ink-4)' }}>
              <span>✓ Looks like a question.</span>
              <span className="tnum">81 / 300</span>
            </div>
          </Field>

          {/* Body field */}
          <Field
            num="2"
            label="Body"
            help="Markdown supported. Code fences with triple backticks."
          >
            <div style={{ border: '1px solid var(--rule)', borderRadius: 5, overflow: 'hidden' }}>
              <div style={{ display: 'flex', borderBottom: '1px solid var(--rule)', background: 'var(--paper-2)' }}>
                {['Write', 'Preview', 'Split'].map((t, i) => (
                  <button key={t} className="btn-ghost" style={{
                    padding: '8px 14px', border: 'none', background: i === 2 ? 'var(--card)' : 'transparent',
                    borderBottom: i === 2 ? '2px solid var(--oxblood)' : '2px solid transparent',
                    fontSize: 12, color: i === 2 ? 'var(--ink)' : 'var(--ink-3)', fontFamily: 'var(--sans)',
                    fontWeight: i === 2 ? 500 : 400, cursor: 'pointer'
                  }}>{t}</button>
                ))}
                <div style={{ marginLeft: 'auto', display: 'flex', gap: 4, padding: '6px 8px', color: 'var(--ink-4)', fontSize: 13 }}>
                  {['B', 'i', '“ ”', '<>', '⤴', '↹', '⊞'].map((s, i) => (
                    <span key={i} className="kbd" style={{ cursor: 'pointer', padding: '2px 7px' }}>{s}</span>
                  ))}
                </div>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', minHeight: 280 }}>
                <div style={{ padding: 14, borderRight: '1px solid var(--rule)', background: 'var(--paper)', position: 'relative' }}>
                  <div className="mono" style={{ fontSize: 12.5, color: 'var(--ink)', lineHeight: 1.6, whiteSpace: 'pre-wrap' }}>
{`I have a \`Question\` resource with an
\`answer_count\` aggregate, and I want a
policy on \`Answer\` that prevents posting
once the parent is closed.

Today I'm using:

\`\`\`elixir
policies do
  policy action_type(:create) do
    authorize_if expr(
      not exists(question, is_closed == true)
    )
  end
end
\`\`\`

This works, but I'd like the rule to depend on
an *aggregate*, not a relationship traversal —`}<span style={{ background: 'var(--ink)', display: 'inline-block', width: 7, height: 14, verticalAlign: 'middle', marginLeft: 1 }} />
                  </div>
                  <span style={{ position: 'absolute', bottom: 8, right: 10, fontSize: 11, color: 'var(--ink-4)' }} className="mono">L 23 · 487 chars</span>
                </div>
                <div style={{ padding: 14, background: 'var(--card)', overflow: 'hidden' }}>
                  <div className="serif" style={{ fontSize: 14.5, lineHeight: 1.6, color: 'var(--ink)' }}>
                    <p style={{ margin: '0 0 10px' }}>I have a <code>Question</code> resource with an <code>answer_count</code> aggregate, and I want a policy on <code>Answer</code> that prevents posting once the parent is closed.</p>
                    <p style={{ margin: '0 0 8px' }}>Today I'm using:</p>
                    <pre style={{ fontSize: 11.5, padding: 10, margin: '0 0 10px' }}>{`policies do
  policy action_type(:create) do
    authorize_if expr(
      not exists(question, is_closed == true)
    )
  end
end`}</pre>
                    <p style={{ margin: 0 }}>This works, but I'd like the rule to depend on an <em>aggregate</em>, not a relationship traversal —</p>
                  </div>
                </div>
              </div>
            </div>
          </Field>

          {/* Tags */}
          <Field
            num="3"
            label="Tags"
            help="Up to 5. Type to search existing tags; press tab to accept."
          >
            <div className="input" style={{ display: 'flex', flexWrap: 'wrap', gap: 6, alignItems: 'center', padding: '6px 10px' }}>
              {['ash-framework', 'elixir', 'authorization'].map(t => (
                <span key={t} className="tag" style={{ background: 'var(--oxblood-tint)', borderColor: 'oklch(0.82 0.05 25)', color: 'var(--oxblood)' }}>
                  {t} <span style={{ marginLeft: 4, cursor: 'pointer' }}>×</span>
                </span>
              ))}
              <input style={{ border: 'none', outline: 'none', fontSize: 13, padding: '4px 2px', flex: 1, minWidth: 80, background: 'transparent', fontFamily: 'var(--sans)' }} defaultValue="polic" />
              {/* autocomplete dropdown */}
              <div style={{ position: 'relative', width: '100%' }}>
                <div className="card" style={{ position: 'absolute', top: 4, left: 0, width: 340, padding: 4, zIndex: 1 }}>
                  {[
                    { name: 'policies',         count: 482, desc: 'Ash policy DSL, authorize_if/forbid_if' },
                    { name: 'policy-bypass',    count: 12,  desc: 'Edge cases where policies are short-circuited' },
                    { name: 'policy-checks',    count: 38,  desc: 'Writing custom Ash.Policy.SimpleCheck modules' },
                  ].map((t, i) => (
                    <div key={t.name} style={{
                      display: 'flex', justifyContent: 'space-between', padding: '7px 10px', borderRadius: 3,
                      background: i === 0 ? 'var(--paper-2)' : 'transparent',
                      cursor: 'pointer'
                    }}>
                      <span>
                        <span className="mono" style={{ fontSize: 12.5, color: 'var(--ink)', fontWeight: 500 }}>{t.name}</span>
                        <span style={{ fontSize: 11.5, color: 'var(--ink-3)', marginLeft: 10 }}>{t.desc}</span>
                      </span>
                      <span style={{ fontSize: 11, color: 'var(--ink-4)' }} className="tnum">×{t.count}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </Field>

          <div style={{ display: 'flex', gap: 10, marginTop: 28, alignItems: 'center' }}>
            <button className="btn btn-primary">Post your question</button>
            <button className="btn">Save as draft</button>
            <label style={{ display: 'inline-flex', alignItems: 'center', gap: 7, fontSize: 12.5, color: 'var(--ink-3)', marginLeft: 12 }}>
              <input type="checkbox" defaultChecked /> Federate to followers
            </label>
            <span style={{ marginLeft: 'auto', fontSize: 12, color: 'var(--ink-4)', fontStyle: 'italic', fontFamily: 'var(--serif)' }}>auto-saved · 12 sec ago</span>
          </div>
        </main>

        {/* Right rail: writing-well guide */}
        <aside style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
          <div style={{ borderLeft: '2px solid var(--oxblood)', paddingLeft: 14 }}>
            <div className="eyebrow" style={{ marginBottom: 6 }}>House rules</div>
            <p className="serif" style={{ fontStyle: 'italic', fontSize: 15, color: 'var(--ink-2)', margin: 0, lineHeight: 1.55 }}>
              Be specific. Be kind. Show your work.
            </p>
          </div>
          <SidebarBlock title="A good question…">
            <ul className="serif" style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: 10, fontSize: 13.5, lineHeight: 1.5, color: 'var(--ink-2)' }}>
              {[
                { ok: true, t: 'States the goal in plain language' },
                { ok: true, t: 'Includes a minimal reproducible example' },
                { ok: true, t: 'Says what you\'ve already tried' },
                { ok: false, t: 'Asks for opinions, recommendations, or "best library"' },
                { ok: false, t: 'Pastes a wall of code without narrowing the problem' },
              ].map((it, i) => (
                <li key={i} style={{ display: 'grid', gridTemplateColumns: '16px 1fr', gap: 8 }}>
                  <span style={{ color: it.ok ? 'oklch(0.42 0.07 150)' : 'var(--oxblood)', fontSize: 14 }}>{it.ok ? '✓' : '✗'}</span>
                  <span>{it.t}</span>
                </li>
              ))}
            </ul>
          </SidebarBlock>
          <SidebarBlock title="Markdown cheatsheet">
            <div className="mono" style={{ fontSize: 12, color: 'var(--ink-2)', lineHeight: 1.8 }}>
              <div><code>**bold**</code> · <code>*italic*</code></div>
              <div><code>`code`</code> · <code>```lang</code></div>
              <div><code>[text](url)</code></div>
              <div><code>{`> quote`}</code></div>
            </div>
          </SidebarBlock>
        </aside>
      </div>
    </QPage>
  );
}

function Field({ num, label, help, children }) {
  return (
    <div style={{ marginBottom: 22, paddingBottom: 22, borderBottom: '1px solid var(--rule-soft)' }}>
      <div style={{ display: 'flex', alignItems: 'baseline', gap: 12, marginBottom: 8 }}>
        <span className="serif" style={{ fontSize: 14, fontStyle: 'italic', color: 'var(--ink-4)' }}>nº {num}</span>
        <h3 style={{ fontSize: 18 }}>{label}</h3>
        <span className="serif" style={{ fontStyle: 'italic', color: 'var(--ink-3)', fontSize: 13.5 }}>— {help}</span>
      </div>
      {children}
    </div>
  );
}

Object.assign(window, { ScreenQuestion, ScreenAsk, AnswerBlock, Field });
