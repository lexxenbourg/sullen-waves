/* tweaks-final.jsx — Sullen Waves FINAL tweak controller.
   index.html base + font selection. Italics permanently off.
   Persists to localStorage (sw_tweaks_final). */

const F_ACCENTS = [
  "#c9a25c", // warm gold (default)
  "#a0432f", // oxblood / rust
  "#c2643a", // ember
  "#8a9a5b", // sage
];

const F_WORDMARK = [
  { value: "Italiana",  label: "Italiana" },
  { value: "Cinzel",    label: "Cinzel" },
  { value: "Marcellus", label: "Marcellus" },
  { value: "Forum",     label: "Forum" },
  { value: "Bodoni",    label: "Bodoni Moda" },
  { value: "SixCaps",   label: "Six Caps" },
  { value: "SpecialElite", label: "Special Elite" },
];

const F_HEAD = [
  { value: "Italiana",  label: "Italiana" },
  { value: "Cinzel",    label: "Cinzel" },
  { value: "Marcellus", label: "Marcellus" },
  { value: "Forum",     label: "Forum" },
  { value: "Cormorant", label: "Cormorant" },
  { value: "Bodoni",    label: "Bodoni Moda" },
  { value: "SixCaps",   label: "Six Caps (poster)" },
  { value: "SpecialElite", label: "Special Elite (typewriter)" },
];

const F_BODY = [
  { value: "Cormorant", label: "Cormorant" },
  { value: "EBGaramond", label: "EB Garamond" },
  { value: "Spectral",  label: "Spectral" },
  { value: "CrimsonPro", label: "Crimson Pro" },
  { value: "Archivo",   label: "Archivo" },
  { value: "CourierPrime", label: "Courier Prime (typewriter)" },
];

const F_CATALOG = [
  { value: "chapters", label: "Cards" },
  { value: "table",    label: "Table" },
];

const F_PHOTOS = [
  { value: "window-guitar", label: "Window & guitar" },
  { value: "hero",          label: "Portrait, wide" },
  { value: "jaguar",        label: "The Jaguar" },
  { value: "long-exposure", label: "Long exposure" },
  { value: "stage-red",     label: "Stage, red" },
];

function FinalTweaks() {
  const seed = (typeof window !== "undefined" && window.SW_STATE) ||
               (typeof window !== "undefined" && window.TWEAK_DEFAULTS) || {};
  const [t, setRaw] = useTweaks(seed);

  const setTweak = React.useCallback((key, val) => {
    const next = { ...t, [key]: val };
    try { localStorage.setItem("sw_tweaks_final", JSON.stringify(next)); } catch (e) {}
    if (window.SWApply) window.SWApply(next);
    window.SW_STATE = next;
    setRaw(key, val);
  }, [t, setRaw]);

  return (
    <TweaksPanel title="Tweaks">
      <TweakSection label="Colour" />
      <TweakColor  label="Accent" value={t.accent} options={F_ACCENTS}
                   onChange={(v) => setTweak("accent", v)} />

      <TweakSection label="Type" />
      <TweakSelect label="Logo (wordmark)" value={t.logoFont || "Italiana"} options={F_WORDMARK}
                   onChange={(v) => setTweak("logoFont", v)} />
      <TweakSelect label="Headlines" value={t.headFont || "Italiana"} options={F_HEAD}
                   onChange={(v) => setTweak("headFont", v)} />
      <TweakSelect label="Body text" value={t.bodyFont || "Cormorant"} options={F_BODY}
                   onChange={(v) => setTweak("bodyFont", v)} />

      <TweakSection label="Catalog & motion" />
      <TweakRadio  label="Catalog" value={t.catalogStyle || "chapters"} options={F_CATALOG}
                   onChange={(v) => setTweak("catalogStyle", v)} />
      <TweakToggle label="Hero hotspots" value={!!t.hotspots}
                   onChange={(v) => setTweak("hotspots", v)} />
      <TweakToggle label="Marquee ticker" value={!!t.ticker}
                   onChange={(v) => setTweak("ticker", v)} />
      <TweakToggle label="Scroll reveals" value={!!t.reveal}
                   onChange={(v) => setTweak("reveal", v)} />

      <TweakSection label="Film & texture" />
      <TweakToggle label="Film grain" value={!!t.grain}
                   onChange={(v) => setTweak("grain", v)} />
      <TweakToggle label="Letterbox hero" value={!!t.letterbox}
                   onChange={(v) => setTweak("letterbox", v)} />
      <TweakToggle label="Sprocket rails" value={!!t.sprockets}
                   onChange={(v) => setTweak("sprockets", v)} />
      <TweakToggle label="Credits footer" value={!!t.creditsFooter}
                   onChange={(v) => setTweak("creditsFooter", v)} />
      <TweakSelect label="Hero photo" value={t.heroPhoto} options={F_PHOTOS}
                   onChange={(v) => setTweak("heroPhoto", v)} />
    </TweaksPanel>
  );
}

(function mountTweaks() {
  const mount = document.getElementById("sw-tweaks-root");
  if (!mount || !window.React || !window.ReactDOM) return;
  ReactDOM.createRoot(mount).render(<FinalTweaks />);
})();
