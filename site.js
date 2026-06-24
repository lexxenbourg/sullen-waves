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

  // ---- unified fake player + persistent now-playing bar ----
  function initPlayer() {
    var TRACK = { title: "Distant Lights", meta: "Sullen Waves \u00b7 SW\u2014004", dur: 252 };
    var pos = Math.round(TRACK.dur * 0.34), playing = false, timer = null;

    var bar = document.createElement("div");
    bar.className = "nowbar";
    bar.innerHTML =
      '<button class="play-btn nb-play" data-playing="0" aria-label="Play / pause">' +
        '<svg class="ico-play" viewBox="0 0 14 16" fill="currentColor"><path d="M0 0 L14 8 L0 16 Z"/></svg>' +
        '<svg class="ico-pause" viewBox="0 0 14 16" fill="currentColor"><rect x="1" width="4" height="16"/><rect x="9" width="4" height="16"/></svg>' +
      '</button>' +
      '<div class="nb-meta"><b>' + TRACK.title + '</b><span>' + TRACK.meta + '</span></div>' +
      '<div class="nb-prog"><div class="bar"><i></i><span class="dot"></span></div></div>' +
      '<div class="nb-time"><span class="cur">01:25</span> / 04:12</div>' +
      '<a class="nb-link" href="#">Spotify \u2197</a>' +
      '<button class="nb-x" aria-label="Hide player">\u2715</button>';
    document.body.appendChild(bar);

    var playBtns = [].slice.call(document.querySelectorAll(".play-btn"));
    var fills = [].slice.call(document.querySelectorAll(".player .bar i, .nowbar .bar i"));
    var dots = [].slice.call(document.querySelectorAll(".player .bar .dot, .nowbar .bar .dot"));
    var curs = [].slice.call(document.querySelectorAll(".player .times span:first-child, .nowbar .nb-time .cur"));

    // build audio-reactive waveforms (v2)
    var waves = [].slice.call(document.querySelectorAll(".wave"));
    waves.forEach(function (w) {
      if (w.children.length) return;
      var n = parseInt(w.getAttribute("data-bars") || "66", 10), html = "";
      for (var i = 0; i < n; i++) {
        var a = Math.abs(Math.sin(i * 0.7) + Math.sin(i * 0.13) * 0.6 + Math.sin(i * 0.37) * 0.35);
        var h = Math.max(14, Math.min(100, 16 + Math.round(a * 62)));
        html += '<i style="height:' + h + '%;animation-delay:' + (-(i % 9) * 0.11).toFixed(2) + 's"></i>';
      }
      w.innerHTML = html;
    });

    var tracks = [].slice.call(document.querySelectorAll(".player .bar, .nowbar .bar, .wave"));

    function render() {
      var pct = Math.min(100, (pos / TRACK.dur) * 100);
      fills.forEach(function (el) { el.style.width = pct + "%"; });
      dots.forEach(function (el) { el.style.left = pct + "%"; });
      curs.forEach(function (el) { el.textContent = fmt(pos); });
      waves.forEach(function (w) {
        var bs = w.children, n = bs.length, lit = Math.round(n * pos / TRACK.dur);
        for (var i = 0; i < n; i++) bs[i].classList.toggle("on", i < lit);
      });
      playBtns.forEach(function (b) { b.setAttribute("data-playing", playing ? "1" : "0"); });
    }
    function show() { bar.classList.add("show"); document.body.classList.add("has-nowbar"); }
    function play() { playing = true; document.body.classList.add("is-playing"); show(); if (!timer) timer = setInterval(tick, 1000); render(); }
    function pause() { playing = false; document.body.classList.remove("is-playing"); clearInterval(timer); timer = null; render(); }
    function tick() { pos += 1; if (pos >= TRACK.dur) pos = 0; render(); }

    playBtns.forEach(function (b) {
      b.addEventListener("click", function (e) { e.preventDefault(); playing ? pause() : play(); });
    });
    tracks.forEach(function (t) {
      t.addEventListener("click", function (e) {
        var r = t.getBoundingClientRect();
        pos = Math.max(0, Math.min(TRACK.dur, Math.round(((e.clientX - r.left) / r.width) * TRACK.dur)));
        show(); render();
      });
    });
    bar.querySelector(".nb-x").addEventListener("click", function () {
      pause(); bar.classList.remove("show"); document.body.classList.remove("has-nowbar");
    });
    render();
  }

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

  function init() { initReveals(); initPlayer(); initForms(); initParallax(); initIntro(); initMarquee(); }
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else { init(); }
})();
