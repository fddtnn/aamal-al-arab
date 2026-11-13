/* Aamal Al Arab — v2 deck: language, stacking slides, reveals */
(function () {
  "use strict";
  var root = document.documentElement;
  var reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* ---------- language ---------- */
  function setLang(lang, save) {
    root.lang = lang;
    root.dir = lang === "ar" ? "rtl" : "ltr";
    if (save) { try { localStorage.setItem("aa-lang", lang); } catch (e) {} }
    var t = document.querySelector("[data-ar-title]");
    if (t) document.title = t.getAttribute("data-" + lang + "-title");
    document.querySelectorAll("[data-ar-alt]").forEach(function (el) { el.alt = el.getAttribute("data-" + lang + "-alt"); });
    document.querySelectorAll("[data-ar-aria]").forEach(function (el) { el.setAttribute("aria-label", el.getAttribute("data-" + lang + "-aria")); });
    if (window.ScrollTrigger) setTimeout(function () { window.ScrollTrigger.refresh(); }, 60);
  }
  setLang(root.lang || "ar", false);
  document.querySelector(".nav__lang").addEventListener("click", function () { setLang(root.lang === "ar" ? "en" : "ar", true); });

  /* ---------- split headlines into words ---------- */
  document.querySelectorAll("[data-split]").forEach(function (h) {
    var walker = document.createTreeWalker(h, NodeFilter.SHOW_TEXT, null);
    var nodes = [];
    while (walker.nextNode()) nodes.push(walker.currentNode);
    nodes.forEach(function (n) {
      if (!n.nodeValue.trim()) return;
      var frag = document.createDocumentFragment();
      n.nodeValue.split(/(\s+)/).forEach(function (part) {
        if (!part) return;
        if (/^\s+$/.test(part)) { frag.appendChild(document.createTextNode(" ")); return; }
        var w = document.createElement("span"); w.className = "w";
        var i = document.createElement("span"); i.textContent = part;
        w.appendChild(i); frag.appendChild(w);
      });
      n.parentNode.replaceChild(frag, n);
    });
  });

  /* ---------- products accordion ---------- */
  var accs = document.querySelectorAll(".acc");
  function openAcc(a) {
    accs.forEach(function (x) { x.classList.toggle("is-open", x === a); x.querySelector("button").setAttribute("aria-expanded", String(x === a)); });
  }
  accs.forEach(function (a) {
    var b = a.querySelector("button");
    b.addEventListener("click", function () { openAcc(a); });
    a.addEventListener("mouseenter", function () { if (window.matchMedia("(hover: hover)").matches) openAcc(a); });
    b.addEventListener("focus", function () { openAcc(a); });
  });

  /* ---------- in-page links with nav offset ---------- */
  document.querySelectorAll('a[href^="#"]').forEach(function (a) {
    a.addEventListener("click", function (e) {
      var id = a.getAttribute("href");
      var el = id === "#top" ? document.body : document.querySelector(id);
      if (!el) return;
      e.preventDefault();
      if (window.__lenis) window.__lenis.scrollTo(el === document.body ? 0 : el, { offset: -90 });
      else window.scrollTo({ top: el === document.body ? 0 : el.getBoundingClientRect().top + scrollY - 90, behavior: reduce ? "auto" : "smooth" });
    });
  });

  if (reduce || !window.gsap) return;

  /* ---------- motion ---------- */
  root.classList.add("js");
  var gsap = window.gsap;
  gsap.registerPlugin(window.ScrollTrigger);
  var ST = window.ScrollTrigger;

  if (window.Lenis) {
    var lenis = new window.Lenis({ duration: 1.1, smoothWheel: true });
    window.__lenis = lenis;
    lenis.on("scroll", ST.update);
    gsap.ticker.add(function (t) { lenis.raf(t * 1000); });
    gsap.ticker.lagSmoothing(0);
  }

  var deck = document.querySelector(".deck");
  var slides = Array.prototype.slice.call(document.querySelectorAll(".slide"));
  var mm = gsap.matchMedia();

  // stacking: each slide shrinks and dims while the next one slides over it
  mm.add("(min-width: 900px) and (min-height: 680px)", function () {
    deck.classList.add("is-stack");
    slides.forEach(function (s, i) {
      var next = slides[i + 1];
      if (!next) return;
      var shade = document.createElement("span");
      shade.className = "slide__shade";
      s.appendChild(shade);
      var tl = gsap.timeline({ scrollTrigger: { trigger: next, start: "top bottom", end: "top " + (90 + 14) + "px", scrub: true } });
      tl.to(s, { scale: 0.9, ease: "none" }, 0).to(shade, { opacity: 0.35, ease: "none" }, 0);
    });
    ST.refresh();
    return function () {
      deck.classList.remove("is-stack");
      document.querySelectorAll(".slide__shade").forEach(function (x) { x.remove(); });
      gsap.set(slides, { clearProps: "transform" });
    };
  });

  // hero intro
  var hero = document.querySelector(".s-hero");
  var intro = gsap.timeline({ defaults: { ease: "power3.out" } });
  intro.from(hero, { scale: 0.94, opacity: 0, duration: 1, ease: "power2.out" })
    .from(".s-hero__img", { clipPath: "inset(0 0 100% 0 round 30px)", duration: 1.3, ease: "power4.inOut" }, "-=0.6")
    .from(".s-hero__img img", { scale: 1.25, duration: 1.8 }, "<")
    .from(".s-hero__panel .pill", { y: 20, opacity: 0, duration: 0.6 }, "-=1.2")
    .from(".s-hero .d-title .w > span", { yPercent: 110, duration: 1, stagger: 0.06, ease: "power4.out" }, "-=1")
    .from(".s-hero__panel .lede, .s-hero__cta", { y: 24, opacity: 0, duration: 0.8, stagger: 0.1 }, "-=0.6")
    .from(".s-hero .badge", { scale: 0, rotate: -120, duration: 1, ease: "back.out(1.5)" }, "-=0.8")
    .from(".s-hero__stats .stat", { y: 30, opacity: 0, duration: 0.7, stagger: 0.08 }, "-=0.7")
    .from(".s-hero .dot2, .s-hero .petal", { scale: 0, duration: 0.6, stagger: 0.1, ease: "back.out(2)" }, "-=0.6")
    .from(".s-hero__giant", { xPercent: root.dir === "rtl" ? -20 : 20, opacity: 0, duration: 1.4 }, "-=1");

  // giant word drift while scrolling away
  gsap.to(".s-hero__giant", { xPercent: root.dir === "rtl" ? 12 : -12, ease: "none", scrollTrigger: { trigger: hero, start: "top top", end: "bottom top", scrub: true } });

  // per-slide entrances
  slides.slice(1).forEach(function (s) {
    var words = s.querySelectorAll(".d-title .w > span");
    var ups = s.querySelectorAll("[data-up]");
    var tl = gsap.timeline({ scrollTrigger: { trigger: s, start: "top 72%" } });
    if (words.length) tl.from(words, { yPercent: 110, duration: 0.9, stagger: 0.05, ease: "power4.out" });
    var heads = s.querySelectorAll(".head p, .head .btn, .bento__title p, .s-cta__left .pill");
    if (heads.length) tl.from(heads, { y: 20, opacity: 0, duration: 0.6, stagger: 0.08 }, "-=0.5");
    if (ups.length) tl.to(ups, { opacity: 1, y: 0, duration: 0.9, stagger: 0.09, ease: "power3.out" }, "-=0.4");
  });

  // counters
  document.querySelectorAll("[data-count]").forEach(function (el) {
    var end = parseFloat(el.getAttribute("data-count"));
    var o = { v: 0 };
    gsap.to(o, { v: end, duration: 2, delay: 1.6, ease: "power2.out", onUpdate: function () { el.textContent = Math.round(o.v) + (el.getAttribute("data-suffix") || ""); } });
  });

  // subtle parallax on bento images
  document.querySelectorAll(".bcard > img, .ncard__body img").forEach(function (img) {
    gsap.fromTo(img, { yPercent: -4, scale: 1.08 }, { yPercent: 4, scale: 1.08, ease: "none", scrollTrigger: { trigger: img.parentElement, start: "top bottom", end: "bottom top", scrub: true } });
  });
})();
