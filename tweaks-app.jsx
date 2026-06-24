/* tweaks-app.jsx — Sullen Waves tweak controller.
   Renders ONLY the Tweaks panel; the page itself is plain HTML.
   Live changes apply via window.SWApply (defined in each page <head>)
   and persist to localStorage so all pages stay in sync. */

const SW_ACCENTS = [
  "#c9a25c", // amber (default)
  "#b14a31", // rust
  "#6fa6ad", // sea glass
  "#d8b56a", // bright gold
];

const SW_LOGO_FONTS = [
  { value: "Italiana",  label: "Italiana" },
  { value: "Playfair",  label: "Playfair" },
  { value: "Cormorant", label: "Cormorant" },
  { value: "Cinzel",    label: "Cinzel" },
];

const SW_CATALOG = [
  { value: "chapters", label: "Chapter cards" },
  { value: "table",    label: "Table" },
];

const SW_PHOTOS = [
  { value: "window-guitar", label: "Window & guitar" },
  { value: "hero",          label: "Portrait, wide" },
  { value: "jaguar",        label: "The Jaguar" },
  { value: "live-sing",     label: "Live, singing" },
  { value: "motion-tele",   label: "Tele, in motion" },
  { value: "long-exposure", label: "Long exposure" },
];

function SWTweaks() {
  const seed = (typeof window !== "undefined" && window.SW_STATE) ||
               (typeof window !== "undefined" && window.TWEAK_DEFAULTS) || {};
  const [t, setRaw] = useTweaks(seed);

  // wrap: apply live + mirror to localStorage, then let the host persist too
  const setTweak = React.useCallback((key, val) => {
    const next = { ...t, [key]: val };
    try { localStorage.setItem("sw_tweaks", JSON.stringify(next)); } catch (e) {}
    if (window.SWApply) window.SWApply(next);
    window.SW_STATE = next;
    setRaw(key, val);
  }, [t, setRaw]);

  return (
    <TweaksPanel title="Tweaks">
      <TweakSection label="Look" />
      <TweakColor  label="Accent" value={t.accent} options={SW_ACCENTS}
                   onChange={(v) => setTweak("accent", v)} />
      <TweakSelect label="Logo font" value={t.logoFont} options={SW_LOGO_FONTS}
                   onChange={(v) => setTweak("logoFont", v)} />
      <TweakToggle label="Italic accents" value={!!t.italics}
                   onChange={(v) => setTweak("italics", v)} />
      <TweakToggle label="Film grain" value={!!t.grain}
                   onChange={(v) => setTweak("grain", v)} />

      <TweakSection label="Cinematic (from 08)" />
      <TweakToggle label="Letterbox the hero" value={!!t.letterbox}
                   onChange={(v) => setTweak("letterbox", v)} />
      <TweakToggle label="Sprocket strips" value={!!t.sprockets}
                   onChange={(v) => setTweak("sprockets", v)} />
      <TweakToggle label="Credits-roll footer" value={!!t.creditsFooter}
                   onChange={(v) => setTweak("creditsFooter", v)} />

      <TweakSection label="Motion & content (01 / 06)" />
      <TweakRadio  label="Catalog" value={t.catalogStyle || "chapters"} options={SW_CATALOG}
                   onChange={(v) => setTweak("catalogStyle", v)} />
      <TweakToggle label="Marquee ticker" value={!!t.ticker}
                   onChange={(v) => setTweak("ticker", v)} />
      <TweakToggle label="Hotspots on hero" value={!!t.hotspots}
                   onChange={(v) => setTweak("hotspots", v)} />
      <TweakToggle label="Scroll reveals" value={!!t.reveal}
                   onChange={(v) => setTweak("reveal", v)} />

      <TweakSection label="Hero image (18)" />
      <TweakSelect label="Photograph" value={t.heroPhoto} options={SW_PHOTOS}
                   onChange={(v) => setTweak("heroPhoto", v)} />
    </TweaksPanel>
  );
}

(function mountTweaks() {
  const mount = document.getElementById("sw-tweaks-root");
  if (!mount || !window.React || !window.ReactDOM) return;
  ReactDOM.createRoot(mount).render(<SWTweaks />);
})();
