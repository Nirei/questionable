// Main mount — design canvas + tweaks panel

const TWEAK_DEFAULTS = /*EDITMODE-BEGIN*/{
  "accent": "#8a3625",
  "font": "newsreader",
  "warmth": 78
}/*EDITMODE-END*/;

// Map swatch hex -> oklch ramp (hue, chroma, tint chroma)
const ACCENT_MAP = {
  '#8a3625': { hue: 25,  chroma: 0.10,  tintC: 0.030 }, // oxblood
  '#3d6a4a': { hue: 150, chroma: 0.07,  tintC: 0.025 }, // forest
  '#2f3d6e': { hue: 250, chroma: 0.07,  tintC: 0.025 }, // midnight
  '#2a251f': { hue: 60,  chroma: 0.012, tintC: 0.014 }, // ink
};

const FONT_MAP = {
  newsreader: {
    serif: '"Newsreader", "Source Serif Pro", Georgia, serif',
    sans:  '"IBM Plex Sans", "Helvetica Neue", system-ui, sans-serif',
    mono:  '"IBM Plex Mono", ui-monospace, Menlo, monospace',
  },
  spectral: {
    serif: '"Spectral", Georgia, serif',
    sans:  '"Inter", system-ui, sans-serif',
    mono:  '"JetBrains Mono", ui-monospace, Menlo, monospace',
  },
  fraunces: {
    serif: '"Source Serif 4", Georgia, serif',
    sans:  '"Söhne", "Inter", system-ui, sans-serif',
    mono:  '"JetBrains Mono", ui-monospace, Menlo, monospace',
  },
};

function applyTweaks(t) {
  const root = document.documentElement.style;
  const a = ACCENT_MAP[t.accent] || ACCENT_MAP['#8a3625'];
  root.setProperty('--oxblood',      `oklch(0.42 ${a.chroma} ${a.hue})`);
  root.setProperty('--oxblood-2',    `oklch(0.52 ${a.chroma} ${a.hue})`);
  root.setProperty('--oxblood-tint', `oklch(0.93 ${a.tintC} ${a.hue})`);

  const f = FONT_MAP[t.font] || FONT_MAP.newsreader;
  root.setProperty('--serif', f.serif);
  root.setProperty('--sans',  f.sans);
  root.setProperty('--mono',  f.mono);

  const w = t.warmth;
  root.setProperty('--paper',   `oklch(0.972 0.012 ${w})`);
  root.setProperty('--paper-2', `oklch(0.948 0.014 ${w - 2})`);
  root.setProperty('--paper-3', `oklch(0.922 0.016 ${w - 4})`);
  root.setProperty('--card',    `oklch(0.985 0.008 ${w + 2})`);
}

function App() {
  const [t, setTweak] = useTweaks(TWEAK_DEFAULTS);
  React.useEffect(() => { applyTweaks(t); }, [t]);

  return (
    <>
      <DesignCanvas>
        <DCSection id="entry" title="Entry &amp; discovery" subtitle="Where most visits begin.">
          <DCArtboard id="feed" label="A · Home feed" width={1280} height={1100}>
            <ScreenFeed />
          </DCArtboard>
          <DCArtboard id="search" label="B · Search results" width={1280} height={1100}>
            <ScreenSearch />
          </DCArtboard>
          <DCArtboard id="tags" label="C · Tags index" width={1280} height={1100}>
            <ScreenTags />
          </DCArtboard>
          <DCArtboard id="tag" label="D · Tag detail (ash-framework)" width={1280} height={1280}>
            <ScreenTagDetail />
          </DCArtboard>
        </DCSection>

        <DCSection id="qa" title="The Q&amp;A surface" subtitle="The heart of the product.">
          <DCArtboard id="question" label="E · Question detail" width={1280} height={1880}>
            <ScreenQuestion />
          </DCArtboard>
          <DCArtboard id="ask" label="F · Ask a question" width={1280} height={1480}>
            <ScreenAsk />
          </DCArtboard>
        </DCSection>

        <DCSection id="people" title="People &amp; the back room">
          <DCArtboard id="profile" label="G · User profile" width={1280} height={1280}>
            <ScreenProfile />
          </DCArtboard>
          <DCArtboard id="mod" label="H · Moderation queue" width={1280} height={1340}>
            <ScreenMod />
          </DCArtboard>
        </DCSection>

        <DCSection id="auth" title="Getting in">
          <DCArtboard id="register" label="I · Register / sign in" width={1280} height={840}>
            <ScreenAuth />
          </DCArtboard>
        </DCSection>
      </DesignCanvas>

      <TweaksPanel title="Tweaks">
        <TweakSection label="Accent">
          <TweakColor
            label="Editorial accent"
            value={t.accent}
            options={['#8a3625', '#3d6a4a', '#2f3d6e', '#2a251f']}
            onChange={v => setTweak('accent', v)}
          />
        </TweakSection>

        <TweakSection label="Type">
          <TweakSelect
            label="Font pairing"
            value={t.font}
            options={[
              { value: 'newsreader', label: 'Newsreader + IBM Plex' },
              { value: 'spectral',   label: 'Spectral + Inter' },
              { value: 'fraunces',   label: 'Source Serif 4 + system' },
            ]}
            onChange={v => setTweak('font', v)}
          />
        </TweakSection>

        <TweakSection label="Paper">
          <TweakSlider
            label="Warmth"
            value={t.warmth}
            min={20} max={110} step={2}
            onChange={v => setTweak('warmth', v)}
          />
        </TweakSection>
      </TweaksPanel>
    </>
  );
}

ReactDOM.createRoot(document.getElementById('root')).render(<App />);
