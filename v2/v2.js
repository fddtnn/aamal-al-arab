/* Aamal Al Arab — v2 deck: language, stacking slides, reveals, form */
(function () {
  "use strict";
  var root = document.documentElement;
  var reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var $$ = function (sel, ctx) { return Array.prototype.slice.call((ctx || document).querySelectorAll(sel)); };
  var NAV_OFFSET = 90;

  function t(ar, en) { return '<span data-l="ar">' + ar + '</span><span data-l="en">' + en + "</span>"; }

  /* ---------- language ---------- */
  function setLang(lang, save) {
    root.lang = lang;
    root.dir = lang === "ar" ? "rtl" : "ltr";
    if (save) { try { localStorage.setItem("aa-lang", lang); } catch (e) {} }
    var tt = document.querySelector("[data-ar-title]");
    if (tt) document.title = tt.getAttribute("data-" + lang + "-title");
    var meta = document.querySelector('meta[name="description"]');
    if (meta && meta.dataset[lang]) meta.content = meta.dataset[lang];
    $$("[data-ar-alt]").forEach(function (el) { el.alt = el.getAttribute("data-" + lang + "-alt"); });
    $$("[data-ar-aria]").forEach(function (el) { el.setAttribute("aria-label", el.getAttribute("data-" + lang + "-aria")); });
    $$("[data-ar-ph]").forEach(function (el) { el.placeholder = el.getAttribute("data-" + lang + "-ph"); });
    if (window.ScrollTrigger) setTimeout(function () { window.ScrollTrigger.refresh(); }, 60);
  }
  setLang(root.lang || "ar", false);
  document.querySelector(".nav__lang").addEventListener("click", function () { setLang(root.lang === "ar" ? "en" : "ar", true); });

  /* ---------- split headlines into words ---------- */
  $$("[data-split]").forEach(function (h) {
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
  var accs = $$(".acc");
  function openAcc(a) {
    accs.forEach(function (x) { x.classList.toggle("is-open", x === a); x.querySelector("button").setAttribute("aria-expanded", String(x === a)); });
  }
  accs.forEach(function (a) {
    var b = a.querySelector("button");
    b.addEventListener("click", function () { openAcc(a); });
    a.addEventListener("mouseenter", function () { if (window.matchMedia("(hover: hover)").matches) openAcc(a); });
    b.addEventListener("focus", function () { openAcc(a); });
  });

  /* ---------- contact form ---------- */
  var form = document.querySelector(".form");
  if (form) {
    var svc = new URLSearchParams(location.search).get("service");
    if (svc) { var r = form.querySelector('input[name="service"][value="' + svc + '"]'); if (r) r.checked = true; }
    form.addEventListener("submit", function (e) {
      e.preventDefault();
      var first = null;
      $$("input[required], textarea[required], input[type=email]", form).forEach(function (el) {
        var v = el.value.trim();
        var bad = (el.required && !v) ||
          (el.type === "tel" && v && v.replace(/\D/g, "").length < 9) ||
          (el.type === "email" && v && !/^\S+@\S+\.\S+$/.test(v));
        var err = el.parentElement.querySelector(".err");
        if (err) err.innerHTML = bad ? t("هذا الحقل مطلوب بشكل صحيح", "Please complete this field correctly") : "";
        el.setAttribute("aria-invalid", String(bad));
        if (bad && !first) first = el;
      });
      if (first) { first.focus(); return; }
      // build a ready-to-send WhatsApp message from the form
      var ar = root.lang !== "en";
      var val = function (name) { var el = form.elements[name]; return el ? el.value.trim() : ""; };
      var chip = form.querySelector('input[name="service"]:checked');
      var svcText = chip ? (form.querySelector('label[for="' + chip.id + '"] [data-l="' + (ar ? "ar" : "en") + '"]') || {}).textContent || chip.value : "";
      var rows = ar
        ? ["السلام عليكم، طلب جديد من موقع أعمال العرب:", "", "الخدمة: " + svcText, "الاسم: " + val("name"), "الجوال: " + val("phone")]
        : ["Hello, a new request from the Aamal Al Arab website:", "", "Service: " + svcText, "Name: " + val("name"), "Mobile: " + val("phone")];
      if (val("email")) rows.push((ar ? "البريد: " : "Email: ") + val("email"));
      if (val("district")) rows.push((ar ? "الحي: " : "District: ") + val("district"));
      rows.push("", (ar ? "تفاصيل المشروع:" : "Project details:"), val("message"));
      var url = "https://wa.me/966596475546?text=" + encodeURIComponent(rows.join("\n"));
      // phones: open the app in this tab; desktop: new tab (keeps the site open)
      if (window.matchMedia("(pointer: coarse)").matches) window.location.href = url;
      else window.open(url, "_blank", "noopener");
      form.querySelector(".form__ok").classList.add("is-on");
      window.AA_LAST_WA = url; // for testing
    });
  }

  /* ---------- in-page links with nav offset ---------- */
  function scrollToEl(el, instant) {
    if (window.__lenis) window.__lenis.scrollTo(el, { offset: -NAV_OFFSET, immediate: !!instant });
    else window.scrollTo({ top: el.getBoundingClientRect().top + scrollY - NAV_OFFSET, behavior: instant || reduce ? "auto" : "smooth" });
  }
  $$('a[href^="#"]').forEach(function (a) {
    a.addEventListener("click", function (e) {
      var id = a.getAttribute("href");
      var el = id === "#top" ? document.body : document.querySelector(id);
      if (!el) return;
      e.preventDefault();
      if (el === document.body) { window.__lenis ? window.__lenis.scrollTo(0) : window.scrollTo(0, 0); return; }
      scrollToEl(el);
    });
  });

  var deck = document.querySelector(".deck");
  var slides = $$(".slide");

  function goToHash() {
    if (!location.hash || location.hash.length < 2) return;
    var el = document.getElementById(location.hash.slice(1));
    if (el) setTimeout(function () { scrollToEl(el, true); }, 120);
  }

  if (reduce || !window.gsap) { goToHash(); return; }

  /* ---------- motion ---------- */
  root.classList.add("js");
  var gsap = window.gsap;
  gsap.registerPlugin(window.ScrollTrigger);
  var ST = window.ScrollTrigger;

  if (window.Lenis) {
    var lenis = new window.Lenis({ duration: 1.1, smoothWheel: true });
    window.__lenis = lenis;
    lenis.on("scroll", ST.update);
    gsap.ticker.add(function (tm) { lenis.raf(tm * 1000); });
    gsap.ticker.lagSmoothing(0);
  }

  // stacking slides (desktop): each slide sticks; a slide taller than the screen
  // sticks by its bottom edge so all of it can be read before the next one covers it
  var mm = gsap.matchMedia();
  mm.add("(min-width: 900px) and (min-height: 680px)", function () {
    deck.classList.add("is-stack");
    function setTops() {
      var avail = window.innerHeight;
      slides.forEach(function (s) {
        var top = Math.min(NAV_OFFSET, avail - s.offsetHeight - 16);
        s.style.top = top + "px";
      });
    }
    setTops();
    ST.addEventListener("refreshInit", setTops);
    slides.forEach(function (s, i) {
      var next = slides[i + 1];
      if (!next) return;
      var shade = document.createElement("span");
      shade.className = "slide__shade";
      s.appendChild(shade);
      var tl = gsap.timeline({ scrollTrigger: { trigger: next, start: "top bottom", end: "top " + NAV_OFFSET + "px", scrub: true } });
      tl.to(s, { scale: 0.92, ease: "none" }, 0).to(shade, { opacity: 0.32, ease: "none" }, 0);
    });
    ST.refresh();
    return function () {
      ST.removeEventListener("refreshInit", setTops);
      deck.classList.remove("is-stack");
      $$(".slide__shade").forEach(function (x) { x.remove(); });
      slides.forEach(function (s) { s.style.top = ""; });
      gsap.set(slides, { clearProps: "transform" });
    };
  });

  // first slide intro (works for the home hero, page intros and the contact slide)
  var first = slides[0];
  var intro = gsap.timeline({ defaults: { ease: "power3.out" } });
  function add(sel, vars, pos) { var els = $$(sel, first); if (els.length) intro.from(els, vars, pos); }
  intro.from(first, { scale: 0.95, opacity: 0, duration: 0.9, ease: "power2.out" });
  if (first.querySelector(".s-hero__img")) {
    intro.from(first.querySelector(".s-hero__img"), { clipPath: "inset(0 0 100% 0 round 30px)", duration: 1.3, ease: "power4.inOut" }, "-=0.5")
      .from(first.querySelector(".s-hero__img img"), { scale: 1.25, duration: 1.8 }, "<");
  }
  add(".pill, .crumbs", { y: 20, opacity: 0, duration: 0.6 }, "-=1.1");
  add(".d-title .w > span", { yPercent: 110, duration: 1, stagger: 0.06, ease: "power4.out" }, "-=0.9");
  add(".lede, .s-hero__cta, .sub", { y: 24, opacity: 0, duration: 0.8, stagger: 0.1 }, "-=0.6");
  add(".badge", { scale: 0, rotate: -120, duration: 1, ease: "back.out(1.5)" }, "-=0.8");
  add(".stat", { y: 30, opacity: 0, duration: 0.7, stagger: 0.08 }, "-=0.7");
  add(".dot2, .petal", { scale: 0, duration: 0.6, stagger: 0.1, ease: "back.out(2)" }, "-=0.6");
  add(".s-hero__giant", { xPercent: root.dir === "rtl" ? -20 : 20, opacity: 0, duration: 1.4 }, "-=1");
  var firstUps = $$("[data-up]", first);
  if (firstUps.length) intro.to(firstUps, { opacity: 1, y: 0, duration: 0.8, stagger: 0.06 }, "-=0.9");

  var giant = document.querySelector(".s-hero__giant");
  if (giant) gsap.to(giant, { xPercent: root.dir === "rtl" ? 12 : -12, ease: "none", scrollTrigger: { trigger: giant.closest(".slide"), start: "top top", end: "bottom top", scrub: true } });

  // later slides: headline words, then supporting copy, then cards
  slides.slice(1).forEach(function (s) {
    var tl = gsap.timeline({ scrollTrigger: { trigger: s, start: "top 72%" } });
    var words = $$(".d-title .w > span", s);
    if (words.length) tl.from(words, { yPercent: 110, duration: 0.9, stagger: 0.05, ease: "power4.out" });
    var heads = $$(".head p, .head .btn, .bento__title p, .s-cta__left .pill, .split__num, .split__text > p, .s-map__text .pill, .s-map__text .lede", s);
    if (heads.length) tl.from(heads, { y: 20, opacity: 0, duration: 0.6, stagger: 0.08 }, words.length ? "-=0.5" : 0);
    var ups = $$("[data-up]", s);
    if (ups.length) tl.to(ups, { opacity: 1, y: 0, duration: 0.9, stagger: 0.09, ease: "power3.out" }, "-=0.4");
  });

  // counters (start when visible)
  $$("[data-count]").forEach(function (el) {
    var end = parseFloat(el.getAttribute("data-count"));
    var o = { v: 0 };
    gsap.to(o, { v: end, duration: 2, ease: "power2.out", scrollTrigger: { trigger: el, start: "top 92%" },
      onUpdate: function () { el.textContent = Math.round(o.v) + (el.getAttribute("data-suffix") || ""); } });
  });

  // gentle parallax inside image cards
  $$(".bcard > img, .ncard__body img, .split__media > img").forEach(function (img) {
    gsap.fromTo(img, { yPercent: -4, scale: 1.08 }, { yPercent: 4, scale: 1.08, ease: "none", scrollTrigger: { trigger: img.parentElement, start: "top bottom", end: "bottom top", scrub: true } });
  });

  goToHash();
})();
