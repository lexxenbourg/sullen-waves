/* site.js — lightweight behaviour shared across pages.
   No cursor effects, no rAF loops. Cheap and idle by default. */
(function () {
  function fmt(s) {
    var m = Math.floor(s / 60);
    var ss = String(Math.floor(s % 60)).padStart(2, "0");
    return m + ":" + ss;
  }

  // ---- scroll reveals (06) ----
  function initReveals() {
    var els = document.querySelectorAll(".reveal");
    if (!("IntersectionObserver" in window) || !els.length) {
      els.forEach(function (el) { el.classList.add("on"); });
      return;
    }
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (en.isIntersecting) {
          en.target.classList.add("on");
          io.unobserve(en.target);
        }
      });
    }, { threshold: 0.16, rootMargin: "0px 0px -8% 0px" });
    els.forEach(function (el) { io.observe(el); });
  }

  // NOTE: the old prototype "now-playing bar" (initPlayer / .nowbar, fake "Distant Lights"
  // placeholder track) was removed 2026-06-29. The real player is the Spotify-backed catalog
  // player + featured player wired in index.html; this fake bar was dead code that still got
  // injected into <body> and could surface over page content. Do not reintroduce it.

  // ---- newsletter ----
  function initForms() {
    document.querySelectorAll(".subscribe").forEach(function (f) {
      f.addEventListener("submit", function (e) {
        e.preventDefault();
        var b = f.querySelector("button");
        if (b) { b.textContent = "subscribed \u2713"; b.disabled = true; }
      });
    });
  }

  // ---- subtle parallax for [data-parallax] (rAF-throttled) ----
  function initParallax() {
    var items = [].slice.call(document.querySelectorAll("[data-parallax]"));
    if (!items.length) return;
    if (window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    var ticking = false;
    function update() {
      items.forEach(function (el) {
        var host = el.parentElement;
        var r = host.getBoundingClientRect();
        if (r.bottom < -200 || r.top > window.innerHeight + 200) { ticking = false; return; }
        var speed = parseFloat(el.getAttribute("data-parallax")) || 0.15;
        var off = (r.top + r.height / 2) - window.innerHeight / 2;
        el.style.transform = "translate3d(0," + (-off * speed).toFixed(1) + "px,0)";
      });
      ticking = false;
    }
    function onScroll() { if (!ticking) { ticking = true; requestAnimationFrame(update); } }
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll, { passive: true });
    update();
  }

  // ---- cinematic intro / title sequence (v2, once per session) ----
  function initIntro() {
    var intro = document.querySelector(".intro");
    if (!intro) return;
    if (sessionStorage.getItem("sw_intro")) { intro.classList.add("gone"); return; }
    try { sessionStorage.setItem("sw_intro", "1"); } catch (e) {}
    var reduce = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    setTimeout(function () {
      intro.classList.add("done");
      setTimeout(function () { intro.classList.add("gone"); }, 1300);
    }, reduce ? 500 : 1950);
  }

  // ---- kinetic marquee: auto drift + scroll-reactive (v2) ----
  function initMarquee() {
    var track = document.querySelector(".marquee .mtrack");
    if (!track) return;
    track.innerHTML = track.innerHTML + track.innerHTML; // duplicate for seamless wrap
    var reduce = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce) return;
    var offset = 0, last = window.scrollY || window.pageYOffset, half = 0, running = false, inView = false;
    function frame() {
      if (!inView) { running = false; return; }
      if (!half) half = track.scrollWidth / 2;
      var y = window.scrollY || window.pageYOffset;
      offset += 0.45 + (y - last) * 0.28; last = y;
      if (half) { while (offset >= half) offset -= half; while (offset < 0) offset += half; }
      track.style.transform = "translateX(" + (-offset).toFixed(1) + "px)";
      requestAnimationFrame(frame);
    }
    var io = new IntersectionObserver(function (es) {
      es.forEach(function (e) {
        inView = e.isIntersecting;
        if (inView && !running) { running = true; last = window.scrollY || window.pageYOffset; requestAnimationFrame(frame); }
      });
    });
    io.observe(track.closest(".marquee"));
  }

  function init() { initReveals(); initForms(); initParallax(); initIntro(); initMarquee(); }
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else { init(); }
})();
