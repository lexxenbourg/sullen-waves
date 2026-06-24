/* tweaks-v5.jsx — Sullen Waves v5 ("Atelier, in colour") tweak controller.
   Warm palette + tweakable headline/body fonts (wordmark stays Italiana).
   Applies via window.SWApply; persists to localStorage (sw_tweaks_v5). */

const V5_ACCENTS = [
  "#c9a25c", // warm gold (default)
  "#a0432f", // oxblood / rust
  "#c2643a", // ember
  "#8a9a5b", // sage
];

const V5_HEAD_FONTS = [
  { value: "Italiana",  label: "Italiana" },
  { value: "Playfair",  label: "Playfair" },
  { value: "Cinzel",    label: "Cinzel" },
  { value: "Cormorant", label: "Cormorant" },
  { value: "Archivo",   label: "Archivo" },
  { value: "Oswald",    label: "Oswald" },
];

const V5_LOGO_FONTS = [
  { value: "Italiana",  label: "Italiana" },
  { value: "Cinzel",    label: "Cinzel" },
  { value: "Playfair",  label: "Playfair" },
  { value: "Cormorant", label: "Cormorant" },
];

const V5_BODY_FONTS = [
  { value: "Cormorant", label: "Cormorant" },
  { value: "Spectral",  label: "Spectral" },
  { value: "Archivo",   label: "Archivo" },
];

const V5_CATALOG = [
  { value: "chapters", label: "Cards" },
  { value: "table",    label: "Table" },
];

const V5_PHOTOS = [
  { value: "window-guitar", label: "Window & guitar" },
  { value: "hero",          label: "Portrait, wide" },
  { value: "jaguar",        label: "The Jaguar" },
  { value: "long-exposure", label: "Long exposure" },
  { value: "stage-red",     label: "Stage, red" },
];

function V5Tweaks() {
  const seed = (typeof window !== "undefined" && window.SW_STATE) ||
               (typeof window !== "undefined" && window.TWEAK_DEFAULTS) || {};
  const [t, setRaw] = useTweaks(seed);

  const setTweak = React.useCallback((key, val) => {
    const next = { ...t, [key]: val };
    try { localStorage.setItem("sw_tweaks_v5", JSON.stringify(next)); } catch (e) {}
    if (window.SWApply) window.SWApply(next);
    window.SW_STATE = next;
    setRaw(key, val);
  }, [t, setRaw]);

  return (
    <TweaksPanel title="Tweaks">
      <TweakSection label="Colour" />
      <TweakColor  label="Accent" value={t.accent} options={V5_ACCENTS}
                   onChange={(v) => setTweak("accent", v)} />

      <TweakSection label="Type" />
      <TweakSelect label="Logo (wordmark)" value={t.logoFont || "Italiana"} options={V5_LOGO_FONTS}
                   onChange={(v) => setTweak("logoFont", v)} />
      <TweakSelect label="Headlines" value={t.headFont} options={V5_HEAD_FONTS}
                   onChange={(v) => setTweak("headFont", v)} />
      <TweakSelect label="Body text" value={t.bodyFont} options={V5_BODY_FONTS}
                   onChange={(v) => setTweak("bodyFont", v)} />
      <TweakToggle label="Italic accents" value={!!t.italics}
                   onChange={(v) => setTweak("italics", v)} />

      <TweakSection label="Catalog & motion" />
      <TweakRadio  label="Catalog" value={t.catalogStyle || "chapters"} options={V5_CATALOG}
                   onChange={(v) => setTweak("catalogStyle", v)} />
      <TweakToggle label="Hero hotspots" value={!!t.hotspots}
                   onChange={(v) => setTweak("hotspots", v)} />
      <TweakToggle label="Marquee ticker" value={!!t.ticker}
                   onChange={(v) => setTweak("ticker", v)} />
      <TweakToggle label="Scroll reveals" value={!!t.reveal}
                   onChange={(v) => setTweak("reveal", v)} />

      <TweakSection label="Texture & hero" />
      <TweakToggle label="Film grain" value={!!t.grain}
                   onChange={(v) => setTweak("grain", v)} />
      <TweakSelect label="Hero photo" value={t.heroPhoto} options={V5_PHOTOS}
                   onChange={(v) => setTweak("heroPhoto", v)} />
    </TweaksPanel>
  );
}

(function mountTweaks() {
  const mount = document.getElementById("sw-tweaks-root");
  if (!mount || !window.React || !window.ReactDOM) return;
  ReactDOM.createRoot(mount).render(<V5Tweaks />);
})();
