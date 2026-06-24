/* tweaks-v4.jsx — Sullen Waves v4 ("Undertow") tweak controller.
   Renders ONLY the Tweaks panel; the page is plain HTML.
   Live changes apply via window.SWApply (defined in index v4.html <head>)
   and persist to localStorage under sw_tweaks_v4. */

const V4_ACCENTS = [
  "#9c3324", // oxblood (default)
  "#c9a25c", // warm gold
  "#b14a31", // rust
  "#6f8f93", // cold steel
];

const V4_HEAD_FONTS = [
  { value: "Italiana",  label: "Italiana" },
  { value: "Oswald",    label: "Oswald" },
  { value: "Anton",     label: "Anton" },
  { value: "Cormorant", label: "Cormorant" },
  { value: "Archivo",   label: "Archivo" },
];

const V4_BODY_FONTS = [
  { value: "Archivo",   label: "Archivo" },
  { value: "Spectral",  label: "Spectral" },
  { value: "Cormorant", label: "Cormorant" },
];

const V4_PHOTOS = [
  { value: "hero",          label: "Portrait, wide" },
  { value: "window-guitar", label: "Window & guitar" },
  { value: "long-exposure", label: "Long exposure" },
  { value: "motion-tele",   label: "Tele, in motion" },
  { value: "stage-red",     label: "Stage, red" },
];

function V4Tweaks() {
  const seed = (typeof window !== "undefined" && window.SW_STATE) ||
               (typeof window !== "undefined" && window.TWEAK_DEFAULTS) || {};
  const [t, setRaw] = useTweaks(seed);

  const setTweak = React.useCallback((key, val) => {
    const next = { ...t, [key]: val };
    try { localStorage.setItem("sw_tweaks_v4", JSON.stringify(next)); } catch (e) {}
    if (window.SWApply) window.SWApply(next);
    window.SW_STATE = next;
    setRaw(key, val);
  }, [t, setRaw]);

  return (
    <TweaksPanel title="Tweaks">
      <TweakSection label="Color" />
      <TweakColor  label="Accent" value={t.accent} options={V4_ACCENTS}
                   onChange={(v) => setTweak("accent", v)} />

      <TweakSection label="Type — wordmark stays Italiana" />
      <TweakSelect label="Headlines" value={t.headFont} options={V4_HEAD_FONTS}
                   onChange={(v) => setTweak("headFont", v)} />
      <TweakSelect label="Body text" value={t.bodyFont} options={V4_BODY_FONTS}
                   onChange={(v) => setTweak("bodyFont", v)} />
      <TweakToggle label="Uppercase headlines" value={!!t.upperHeads}
                   onChange={(v) => setTweak("upperHeads", v)} />

      <TweakSection label="Texture" />
      <TweakToggle label="Film grain" value={!!t.grain}
                   onChange={(v) => setTweak("grain", v)} />
      <TweakSlider label="Grit" value={t.grit ?? 55} min={0} max={100} step={5}
                   onChange={(v) => setTweak("grit", v)} />

      <TweakSection label="Hero" />
      <TweakSelect label="Photograph" value={t.heroPhoto} options={V4_PHOTOS}
                   onChange={(v) => setTweak("heroPhoto", v)} />
    </TweaksPanel>
  );
}

(function mountTweaks() {
  const mount = document.getElementById("sw-tweaks-root");
  if (!mount || !window.React || !window.ReactDOM) return;
  ReactDOM.createRoot(mount).render(<V4Tweaks />);
})();
