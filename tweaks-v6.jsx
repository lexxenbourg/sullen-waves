/* tweaks-v6.jsx — Sullen Waves v6 ("Poster pass") tweak controller.
   No italics anywhere. Anton/Oswald/Archivo type system.
   Applies via window.SWApply; persists to localStorage (sw_tweaks_v6). */

const V6_ACCENTS = [
  "#bf4630", // rust red (default)
  "#c9a25c", // warm gold
  "#e7dec8", // bone
  "#6e8a5b", // moss
];

const V6_HEAD_FONTS = [
  { value: "Anton",   label: "Anton" },
  { value: "Oswald",  label: "Oswald" },
  { value: "Archivo", label: "Archivo Black" },
];

const V6_BODY_FONTS = [
  { value: "Archivo",  label: "Archivo" },
  { value: "Spectral", label: "Spectral" },
];

const V6_LOGO_FONTS = [
  { value: "Italiana", label: "Italiana" },
  { value: "Anton",    label: "Anton" },
  { value: "Oswald",   label: "Oswald" },
];

const V6_CATALOG = [
  { value: "sleeves", label: "Sleeves" },
  { value: "table",   label: "Table" },
];

const V6_PHOTOS = [
  { value: "window-guitar", label: "Window & guitar" },
  { value: "stage-red",     label: "Stage, red" },
  { value: "live-red",      label: "Live, red" },
  { value: "jaguar",        label: "The Jaguar" },
  { value: "long-exposure", label: "Long exposure" },
  { value: "hero",          label: "Portrait, wide" },
];

function V6Tweaks() {
  const seed = (typeof window !== "undefined" && window.SW_STATE) ||
               (typeof window !== "undefined" && window.TWEAK_DEFAULTS) || {};
  const [t, setRaw] = useTweaks(seed);

  const setTweak = React.useCallback((key, val) => {
    const next = { ...t, [key]: val };
    try { localStorage.setItem("sw_tweaks_v6", JSON.stringify(next)); } catch (e) {}
    if (window.SWApply) window.SWApply(next);
    window.SW_STATE = next;
    setRaw(key, val);
  }, [t, setRaw]);

  return (
    <TweaksPanel title="Tweaks">
      <TweakSection label="Colour" />
      <TweakColor  label="Accent" value={t.accent} options={V6_ACCENTS}
                   onChange={(v) => setTweak("accent", v)} />

      <TweakSection label="Type" />
      <TweakSelect label="Logo (wordmark)" value={t.logoFont || "Italiana"} options={V6_LOGO_FONTS}
                   onChange={(v) => setTweak("logoFont", v)} />
      <TweakRadio  label="Headlines" value={t.headFont || "Anton"} options={V6_HEAD_FONTS}
                   onChange={(v) => setTweak("headFont", v)} />
      <TweakRadio  label="Body text" value={t.bodyFont || "Archivo"} options={V6_BODY_FONTS}
                   onChange={(v) => setTweak("bodyFont", v)} />

      <TweakSection label="Catalog & motion" />
      <TweakRadio  label="Catalog" value={t.catalogStyle || "sleeves"} options={V6_CATALOG}
                   onChange={(v) => setTweak("catalogStyle", v)} />
      <TweakToggle label="Hero hotspots" value={!!t.hotspots}
                   onChange={(v) => setTweak("hotspots", v)} />
      <TweakToggle label="News ticker" value={!!t.ticker}
                   onChange={(v) => setTweak("ticker", v)} />
      <TweakToggle label="Marquee band" value={!!t.marquee}
                   onChange={(v) => setTweak("marquee", v)} />
      <TweakToggle label="Scroll reveals" value={!!t.reveal}
                   onChange={(v) => setTweak("reveal", v)} />

      <TweakSection label="Texture & hero" />
      <TweakToggle label="Film grain" value={!!t.grain}
                   onChange={(v) => setTweak("grain", v)} />
      <TweakToggle label="Scanlines" value={!!t.scan}
                   onChange={(v) => setTweak("scan", v)} />
      <TweakSelect label="Hero photo" value={t.heroPhoto} options={V6_PHOTOS}
                   onChange={(v) => setTweak("heroPhoto", v)} />
    </TweaksPanel>
  );
}

(function mountTweaks() {
  const mount = document.getElementById("sw-tweaks-root");
  if (!mount || !window.React || !window.ReactDOM) return;
  ReactDOM.createRoot(mount).render(<V6Tweaks />);
})();
