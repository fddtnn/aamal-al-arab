/* Aamal Al Arab — v3 cinematic glass (standalone) */
(function () {
  "use strict";
  var root = document.documentElement;
  var reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var $ = function (s, c) { return (c || document).querySelector(s); };
  var $$ = function (s, c) { return Array.prototype.slice.call((c || document).querySelectorAll(s)); };
  var WA = "966596475546";
  var L = function () { return root.lang === "en" ? "en" : "ar"; };

  /* ---------- products for the studio card (facts only, no prices) ---------- */
  var P = {
    chair: { img: "p-chair", ar: "كرسي مخمل زمردي", en: "Emerald velvet chair",
      specs: [["الخامات", "Materials", "خشب جوز صلب، مخمل، حشوة عالية الكثافة", "Solid walnut, velvet, high-density foam"],
              ["التفصيل", "Made", "على المقاس في مشاغلنا", "To measure in our workshops"],
              ["الألوان", "Colours", "حسب عينات الأقمشة", "From our fabric samples"]] },
    sofa: { img: "p-sofa", ar: "كنب مخمل بثلاث مقاعد", en: "Three-seat velvet sofa",
      specs: [["الخامات", "Materials", "إطار خشب صلب، مخمل، تنجيد يدوي", "Solid-wood frame, velvet, hand upholstery"],
              ["التفصيل", "Made", "أي طول وعمق يناسب مساحتك", "Any length and depth for your room"],
              ["الألوان", "Colours", "حسب عينات الأقمشة", "From our fabric samples"]] },
    curtain: { img: "p-curtain", ar: "ستارة كتان بطيّات", en: "Pleated linen curtain",
      specs: [["الخامات", "Materials", "كتان، مخمل، شيفون، بلاك أوت", "Linen, velvet, sheer, blackout"],
              ["التشغيل", "Control", "يدوي، كهربائي، أو نظام ذكي", "Manual, motorised or smart-home"],
              ["التفصيل", "Made", "على مقاس النافذة بالضبط", "To your exact window size"]] },
    majlis: { img: "p-majlis", ar: "مجلس عربي مفصّل", en: "Bespoke Arabic majlis",
      specs: [["الخامات", "Materials", "كتان، مخمل، أطراف نحاسية", "Linen, velvet, brass end caps"],
              ["المكوّنات", "Includes", "جلسات أرضية، مساند، ومراكي", "Floor seating, backrests, bolsters"],
              ["التفصيل", "Made", "على مقاس المجلس", "Sized to your majlis"]] },
    dining: { img: "p-dining", ar: "طاولة طعام جوز وترافرتين", en: "Walnut & travertine dining",
      specs: [["الخامات", "Materials", "جوز صلب، ترافرتين، مخمل، نحاس", "Solid walnut, travertine, velvet, brass"],
              ["التفصيل", "Made", "مستديرة أو مستطيلة بالمقاس", "Round or long, to size"],
              ["الكراسي", "Chairs", "منجّدة حسب العينات", "Upholstered from our samples"]] },
    bed: { img: "p-bed", ar: "سرير بظهر مخمل منجّد", en: "Velvet channel-tufted bed",
      specs: [["الخامات", "Materials", "إطار جوز، مخمل، تنجيد عمودي", "Walnut frame, velvet, channel tufting"],
              ["التفصيل", "Made", "مقاسات مفردة إلى كينغ", "Single to king sizes"],
              ["يُكمَل بـ", "Pairs with", "خزائن مدمجة وستائر", "Built-in wardrobes and curtains"]] }
  };
  var ORDER = ["curtain", "sofa", "chair", "majlis", "dining", "bed"];
  var cur = "chair";

  /* ---------- language ---------- */
  function setLang(lang, save) {
    root.lang = lang; root.dir = lang === "ar" ? "rtl" : "ltr";
    if (save) { try { localStorage.setItem("aa3-lang", lang); } catch (e) {} }
    var t = $("[data-ar-title]"); if (t) document.title = t.getAttribute("data-" + lang + "-title");
    $$("[data-ar-alt]").forEach(function (el) { el.alt = el.getAttribute("data-" + lang + "-alt"); });
    $$("[data-ar-aria]").forEach(function (el) { el.setAttribute("aria-label", el.getAttribute("data-" + lang + "-aria")); });
    $$("option[data-ar]").forEach(function (o) { o.textContent = o.getAttribute("data-" + lang); });
    renderCard(false);
    placeAll();
    if (window.ScrollTrigger) setTimeout(function () { window.ScrollTrigger.refresh(); }, 60);
  }
  $(".nav__lang").addEventListener("click", function () { setLang(L() === "ar" ? "en" : "ar", true); });

  /* ---------- hero title: split into characters (Latin only; Arabic must stay joined) ---------- */
  $$("[data-chars] [data-l=en]").forEach(function (el) {
    el.innerHTML = el.textContent.split("").map(function (c) { return c === " " ? " " : '<span class="ch">' + c + "</span>"; }).join("");
  });

  /* ---------- hotspots: map image-% coordinates onto an object-fit:cover box ---------- */
  function place(section) {
    var iw = +section.dataset.imgw, ih = +section.dataset.imgh;
    var px = +section.dataset.posx, py = +section.dataset.posy;
    var cw = section.clientWidth, ch = section.clientHeight;
    var s = Math.max(cw / iw, ch / ih), rw = iw * s, rh = ih * s;
    var ox = (cw - rw) * px, oy = (ch - rh) * py;
    $$(".hs", section).forEach(function (h) {
      var x = ox + (+h.dataset.x) * rw, y = oy + (+h.dataset.y) * rh;
      h.style.left = x + "px"; h.style.top = y + "px";
      h.style.display = x < 20 || x > cw - 20 || y < 70 || y > ch - 20 ? "none" : "";
    });
  }
  function placeAll() { $$(".hero, .stage").forEach(place); }
  window.addEventListener("resize", placeAll);
  // small screens: tap a dot to show its label
  $$(".hero .hs").forEach(function (h) { h.addEventListener("click", function () { h.classList.toggle("is-open"); }); });

  /* ---------- studio card ---------- */
  var card = $(".pcard"), titleEl = $(".pcard__title"), specsEl = $(".pcard__specs"), imgEl = $(".pcard__img img"), countEl = $(".pcard__count"), orderEl = $(".pc-order");
  function renderCard(animate) {
    var p = P[cur], l = L(), i = l === "ar" ? 0 : 1;
    var apply = function () {
      titleEl.textContent = p[l];
      specsEl.innerHTML = p.specs.map(function (s) { return "<div><dt>" + s[i] + "</dt><dd>" + s[i + 2] + "</dd></div>"; }).join("");
      imgEl.src = "assets/img/" + p.img + ".jpg";
      imgEl.alt = p[l];
      countEl.textContent = (ORDER.indexOf(cur) + 1) + " / " + ORDER.length;
      var msg = l === "ar" ? "السلام عليكم، مهتم بـ «" + p.ar + "» من موقع أعمال العرب. ممكن تفاصيل أكثر؟" : "Hello, I'm interested in the \"" + p.en + "\" from the Aamal Al Arab website. Could you share more details?";
      orderEl.href = "https://wa.me/" + WA + "?text=" + encodeURIComponent(msg);
    };
    $$(".dock button").forEach(function (b) { b.setAttribute("aria-pressed", String(b.dataset.prod === cur)); });
    $$(".stage .hs").forEach(function (h) { h.classList.toggle("is-active", h.dataset.prod === cur); });
    if (!animate || !window.gsap || reduce) return apply();
    var g = window.gsap;
    g.timeline()
      .to([titleEl, specsEl], { opacity: 0, y: -10, duration: 0.25, ease: "power2.in" })
      .to(imgEl, { opacity: 0, x: 40, scale: 0.94, duration: 0.3, ease: "power2.in" }, 0)
      .add(apply)
      .fromTo([titleEl, specsEl], { opacity: 0, y: 14 }, { opacity: 1, y: 0, duration: 0.5, ease: "power3.out", stagger: 0.06 })
      .fromTo(imgEl, { opacity: 0, x: -40, scale: 0.94 }, { opacity: 1, x: 0, scale: 1, duration: 0.7, ease: "power3.out" }, "<");
  }
  function show(id) { if (id === cur || !P[id]) return; cur = id; renderCard(true); }
  function step(d) { var i = (ORDER.indexOf(cur) + d + ORDER.length) % ORDER.length; show(ORDER[i]); }
  $(".pc-next").addEventListener("click", function () { step(1); });
  $(".pc-prev").addEventListener("click", function () { step(-1); });
  $$(".dock button").forEach(function (b) { b.addEventListener("click", function () { show(b.dataset.prod); }); });
  $$(".stage .hs[data-prod] .hs__dot").forEach(function (d) { d.addEventListener("click", function () { show(d.closest(".hs").dataset.prod); }); });

  /* ---------- projects gallery: drag + buttons ---------- */
  var gal = $(".gallery");
  (function () {
    var down = false, sx = 0, sl = 0, moved = false;
    gal.addEventListener("pointerdown", function (e) { if (e.pointerType !== "mouse") return; down = true; moved = false; sx = e.clientX; sl = gal.scrollLeft; gal.classList.add("is-drag"); });
    window.addEventListener("pointermove", function (e) { if (!down) return; var dx = e.clientX - sx; if (Math.abs(dx) > 4) moved = true; gal.scrollLeft = sl - dx; });
    window.addEventListener("pointerup", function () { if (!down) return; down = false; gal.classList.remove("is-drag"); });
    gal.addEventListener("click", function (e) { if (moved) { e.preventDefault(); e.stopPropagation(); } }, true);
    function by(dir) {
      var w = gal.querySelector(".gcard").offsetWidth + 16;
      var sign = root.dir === "rtl" ? -1 : 1;
      gal.scrollBy({ left: dir * w * sign, behavior: reduce ? "auto" : "smooth" });
    }
    $(".gal-next").addEventListener("click", function () { by(1); });
    $(".gal-prev").addEventListener("click", function () { by(-1); });
  })();

  /* ---------- contact form -> WhatsApp ---------- */
  var form = $(".qform");
  form.addEventListener("submit", function (e) {
    e.preventDefault();
    var first = null, ar = L() === "ar";
    $$("[required]", form).forEach(function (el) {
      var v = el.value.trim();
      var bad = !v || (el.type === "tel" && v.replace(/\D/g, "").length < 9);
      el.setAttribute("aria-invalid", String(bad));
      var er = el.parentElement.querySelector(".err");
      if (er) er.textContent = bad ? (ar ? "هذا الحقل مطلوب بشكل صحيح" : "Please complete this field correctly") : "";
      if (bad && !first) first = el;
    });
    if (first) { first.focus(); return; }
    var sel = form.elements.service;
    var rows = ar
      ? ["السلام عليكم، طلب استشارة من موقع أعمال العرب:", "", "الخدمة: " + sel.options[sel.selectedIndex].text, "الاسم: " + form.elements.name.value.trim(), "الجوال: " + form.elements.phone.value.trim(), "", "تفاصيل المشروع:", form.elements.message.value.trim()]
      : ["Hello, a consultation request from the Aamal Al Arab website:", "", "Service: " + sel.options[sel.selectedIndex].text, "Name: " + form.elements.name.value.trim(), "Mobile: " + form.elements.phone.value.trim(), "", "Project details:", form.elements.message.value.trim()];
    var url = "https://wa.me/" + WA + "?text=" + encodeURIComponent(rows.join("\n"));
    if (window.matchMedia("(pointer: coarse)").matches) location.href = url; else window.open(url, "_blank", "noopener");
    $(".ok", form).classList.add("is-on");
    window.AA_LAST_WA = url;
  });

  /* ---------- nav ---------- */
  var nav = $(".nav");
  function onScroll() { nav.classList.toggle("is-scrolled", window.scrollY > 40); }
  window.addEventListener("scroll", onScroll, { passive: true }); onScroll();
  $$('a[href^="#"]').forEach(function (a) {
    a.addEventListener("click", function (e) {
      var id = a.getAttribute("href"); var el = id === "#top" ? document.body : $(id);
      if (!el) return; e.preventDefault();
      if (window.__lenis) window.__lenis.scrollTo(el === document.body ? 0 : el, { offset: 0 });
      else window.scrollTo({ top: el === document.body ? 0 : el.getBoundingClientRect().top + scrollY, behavior: reduce ? "auto" : "smooth" });
    });
  });

  setLang(L(), false);

  if (reduce || !window.gsap) return;

  /* ---------- motion ---------- */
  root.classList.add("js");
  var gsap = window.gsap; gsap.registerPlugin(window.ScrollTrigger); var ST = window.ScrollTrigger;
  if (window.Lenis) {
    var lenis = new window.Lenis({ duration: 1.1, smoothWheel: true });
    window.__lenis = lenis; lenis.on("scroll", ST.update);
    gsap.ticker.add(function (t) { lenis.raf(t * 1000); }); gsap.ticker.lagSmoothing(0);
  }

  // hero intro (mirrors the reference: haze -> title -> dots -> lines -> labels -> copy)
  var hero = $(".hero");
  var tl = gsap.timeline({ defaults: { ease: "power3.out" } });
  tl.fromTo(".hero__img img", { scale: 1.18, filter: "brightness(0.35) blur(6px)" }, { scale: 1.04, filter: "brightness(1) blur(0px)", duration: 2.2, ease: "power2.out" })
    .from(".nav", { y: -30, opacity: 0, duration: 0.8 }, 0.3);
  var chars = $$(".hero__title [data-l=en] .ch");
  if (L() === "en" && chars.length) tl.from(chars, { yPercent: 60, opacity: 0, filter: "blur(12px)", duration: 1.1, stagger: 0.04 }, 0.5);
  else tl.from(".hero__title", { y: 50, opacity: 0, filter: "blur(14px)", duration: 1.4 }, 0.5);
  var hs = $$(".hero .hs");
  tl.from(hs.map(function (h) { return h.querySelector(".hs__dot"); }), { scale: 0, opacity: 0, duration: 0.6, stagger: 0.15, ease: "back.out(2)" }, 1.3)
    .from(hs.map(function (h) { return h.querySelector(".hs__line"); }), { scaleX: 0, duration: 0.6, stagger: 0.15 }, 1.7)
    .from(hs.map(function (h) { return h.querySelector(".hs__label"); }), { opacity: 0, x: function (i, el) { return el.closest(".hs").dataset.side === "right" ? -14 : 14; }, duration: 0.6, stagger: 0.15 }, 2)
    .from(".hero__bottom > *", { y: 30, opacity: 0, duration: 0.9, stagger: 0.12 }, 1.6);

  // hero scroll: title drifts up and fades, image parallax
  gsap.to(".hero__title", { yPercent: -60, opacity: 0, ease: "none", scrollTrigger: { trigger: hero, start: "top top", end: "60% top", scrub: true } });
  gsap.to(".hero__img img", { yPercent: 10, ease: "none", scrollTrigger: { trigger: hero, start: "top top", end: "bottom top", scrub: true } });

  // studio: hotspots pop in when the section arrives, then the panels
  var stage = $(".stage");
  var shs = $$(".stage .hs");
  var stl = gsap.timeline({ scrollTrigger: { trigger: stage, start: "top 60%" } });
  stl.from(".stage__img img", { scale: 1.12, duration: 1.6, ease: "power2.out" })
    .to($$("[data-up]", stage), { opacity: 1, y: 0, duration: 0.9, stagger: 0.1 }, 0.2)
    .from(shs.map(function (h) { return h.querySelector(".hs__dot"); }), { scale: 0, opacity: 0, duration: 0.5, stagger: 0.12, ease: "back.out(2)" }, 0.6)
    .from(shs.map(function (h) { return h.querySelector(".hs__line"); }), { scaleX: 0, duration: 0.5, stagger: 0.12 }, 0.9)
    .from(shs.map(function (h) { return h.querySelector(".hs__label"); }), { opacity: 0, duration: 0.5, stagger: 0.12 }, 1.1);

  // generic reveals outside hero/studio
  $$("[data-up]").filter(function (el) { return !stage.contains(el); }).forEach(function (el) {
    gsap.to(el, { opacity: 1, y: 0, duration: 1, ease: "power3.out", scrollTrigger: { trigger: el, start: "top 88%" } });
  });
  gsap.to(".contact__img img", { yPercent: -8, scale: 1.08, ease: "none", scrollTrigger: { trigger: ".contact", start: "top bottom", end: "bottom top", scrub: true } });
})();
