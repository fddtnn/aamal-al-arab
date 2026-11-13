/* ==========================================================
   Aamal Al Arab — shared layout, language, motion
   ========================================================== */
(function () {
  "use strict";

  /* ---------- placeholder contact data (swap later) ---------- */
  var C = {
    phone: "+966 50 000 0000",
    phoneHref: "+966500000000",
    wa: "966500000000",
    email: "info@aamalalarab.sa",
    cr: "1010000000",
    addrAr: "طريق العليا، حي العليا، الرياض",
    addrEn: "Olaya Road, Al Olaya, Riyadh"
  };

  var root = document.documentElement;
  var page = document.body.getAttribute("data-page") || "home";

  /* ---------- language ---------- */
  function setLang(lang, save) {
    root.lang = lang;
    root.dir = lang === "ar" ? "rtl" : "ltr";
    if (save) { try { localStorage.setItem("aa-lang", lang); } catch (e) {} }
    // attributes that can't use [data-l] spans
    document.querySelectorAll("[data-ar-title]").forEach(function (el) {
      document.title = el.getAttribute("data-" + lang + "-title");
    });
    document.querySelectorAll("[data-ar-ph]").forEach(function (el) {
      el.placeholder = el.getAttribute("data-" + lang + "-ph");
    });
    document.querySelectorAll("[data-ar-alt]").forEach(function (el) {
      el.alt = el.getAttribute("data-" + lang + "-alt");
    });
    document.querySelectorAll("[data-ar-aria]").forEach(function (el) {
      el.setAttribute("aria-label", el.getAttribute("data-" + lang + "-aria"));
    });
    var meta = document.querySelector('meta[name="description"]');
    if (meta && meta.dataset[lang]) meta.content = meta.dataset[lang];
    if (window.ScrollTrigger) setTimeout(function () { window.ScrollTrigger.refresh(); }, 50);
  }
  var saved = null;
  try { saved = localStorage.getItem("aa-lang"); } catch (e) {}
  var q = new URLSearchParams(location.search).get("lang");
  setLang(q === "en" || q === "ar" ? q : saved || "ar", false);

  /* ---------- icons ---------- */
  var I = {
    arrow: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" aria-hidden="true"><path d="M5 12h14M13 6l6 6-6 6"/></svg>',
    wa: '<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M17.5 14.4c-.3-.1-1.8-.9-2-1-.3-.1-.5-.1-.7.1-.2.3-.8 1-.9 1.2-.2.2-.3.2-.6.1-.3-.1-1.3-.5-2.4-1.5-.9-.8-1.5-1.8-1.7-2.1-.2-.3 0-.5.1-.6l.4-.5c.2-.2.2-.3.3-.5.1-.2 0-.4 0-.5l-.9-2.2c-.2-.6-.5-.5-.7-.5h-.6c-.2 0-.5.1-.8.4-.3.3-1 1-1 2.5s1.1 2.9 1.2 3.1c.1.2 2.1 3.2 5.1 4.5.7.3 1.3.5 1.7.6.7.2 1.4.2 1.9.1.6-.1 1.8-.7 2-1.4.2-.7.2-1.3.2-1.4-.1-.1-.3-.2-.6-.3zM12 2a10 10 0 0 0-8.6 15.1L2 22l5-1.3A10 10 0 1 0 12 2zm0 18.3c-1.5 0-3-.4-4.3-1.2l-.3-.2-3 .8.8-2.9-.2-.3A8.3 8.3 0 1 1 12 20.3z"/></svg>',
    ig: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" aria-hidden="true"><rect x="3" y="3" width="18" height="18" rx="5"/><circle cx="12" cy="12" r="4"/><circle cx="17.5" cy="6.5" r="1" fill="currentColor"/></svg>',
    x: '<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M17.7 3h3.1l-6.8 7.7 8 10.3h-6.2l-4.9-6.3L5.3 21H2.2l7.2-8.3L1.8 3h6.4l4.4 5.8L17.7 3zm-1.1 16.2h1.7L7.5 4.7H5.7l10.9 14.5z"/></svg>',
    snap: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" aria-hidden="true"><path d="M12 3c3 0 5 2.2 5 5v2.5l1.8-.6c.6 0 .9.7.4 1.1-.8.6-2.2 1-2.2 1.6 0 1.5 2 3.3 4 3.8-.3.9-1.8 1-2.7 1.2-.3.5-.2 1.3-.8 1.4-.8.1-1.6-.4-2.8 0-1 .4-1.7 1.5-3.7 1.5s-2.7-1.1-3.7-1.5c-1.2-.4-2 .1-2.8 0-.6-.1-.5-.9-.8-1.4-.9-.2-2.4-.3-2.7-1.2 2-.5 4-2.3 4-3.8 0-.6-1.4-1-2.2-1.6-.5-.4-.2-1.1.4-1.1L7 10.5V8c0-2.8 2-5 5-5z"/></svg>',
    in: '<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M4.98 3.5a2.5 2.5 0 1 1 0 5 2.5 2.5 0 0 1 0-5zM3 9.5h4V21H3V9.5zm7 0h3.8v1.6h.1c.5-1 1.8-2 3.7-2 4 0 4.7 2.6 4.7 6V21h-4v-5.1c0-1.2 0-2.8-1.7-2.8s-2 1.3-2 2.7V21h-4V9.5z"/></svg>'
  };
  window.AA_ICONS = I;

  function t(ar, en) { return '<span data-l="ar">' + ar + '</span><span data-l="en">' + en + "</span>"; }

  var NAV = [
    { id: "home", href: "index.html", ar: "الرئيسية", en: "Home" },
    { id: "about", href: "about.html", ar: "من نحن", en: "About" },
    { id: "services", href: "services.html", ar: "خدماتنا", en: "Services" },
    { id: "work", href: "work.html", ar: "أعمالنا ومنتجاتنا", en: "Work & Products" },
    { id: "contact", href: "contact.html", ar: "تواصل معنا", en: "Contact" }
  ];

  /* ---------- header + menu ---------- */
  var header = document.createElement("header");
  header.className = "header";
  header.innerHTML =
    '<div class="wrap">' +
      '<a class="header__logo" href="index.html" data-ar-aria="أعمال العرب — الصفحة الرئيسية" data-en-aria="Aamal Al Arab — home">' +
        '<img class="logo-white" src="../assets/brand/logo-full-white.png" alt="" width="1000" height="180">' +
        '<img class="logo-color" src="../assets/brand/logo-full-color.png" alt="" width="1000" height="180">' +
      "</a>" +
      '<nav class="header__nav" aria-label="Primary">' +
        NAV.slice(1).map(function (n) {
          return '<a href="' + n.href + '"' + (n.id === page ? ' aria-current="page"' : "") + ">" + t(n.ar, n.en) + "</a>";
        }).join("") +
      "</nav>" +
      '<div class="header__tools">' +
        '<button class="lang-btn" type="button" data-ar-aria="Switch to English" data-en-aria="التحويل إلى العربية">' +
          '<span data-l="ar">EN</span><span data-l="en">ع</span></button>' +
        '<button class="menu-btn" type="button" aria-expanded="false" aria-controls="site-menu">' +
          '<span class="menu-btn__text">' + t("القائمة", "Menu") + "</span>" +
          '<span class="menu-btn__lines" aria-hidden="true"></span></button>' +
      "</div>" +
    "</div>";

  var menu = document.createElement("div");
  menu.className = "menu";
  menu.id = "site-menu";
  menu.setAttribute("aria-hidden", "true");
  menu.innerHTML =
    '<ul class="menu__links">' +
      NAV.map(function (n, i) {
        return '<li><a href="' + n.href + '"><small>0' + (i + 1) + "</small>" + t(n.ar, n.en) + "</a></li>";
      }).join("") +
    "</ul>" +
    '<div class="menu__side">' +
      "<div><strong>" + t("اتصل بنا", "Call") + '</strong><a href="tel:' + C.phoneHref + '" dir="ltr">' + C.phone + "</a></div>" +
      "<div><strong>" + t("البريد", "Email") + '</strong><a href="mailto:' + C.email + '">' + C.email + "</a></div>" +
      "<div><strong>" + t("المعرض", "Showroom") + "</strong>" + t(C.addrAr, C.addrEn) + "</div>" +
      '<div><a class="btn btn--brass" href="contact.html?service=consultation">' + t("احجز استشارة", "Book a consultation") + I.arrow + "</a></div>" +
    "</div>";

  document.body.prepend(menu);
  document.body.prepend(header);

  var menuBtn = header.querySelector(".menu-btn");
  function toggleMenu(open) {
    var isOpen = open == null ? !root.classList.contains("menu-open") : open;
    root.classList.toggle("menu-open", isOpen);
    menuBtn.setAttribute("aria-expanded", String(isOpen));
    menu.setAttribute("aria-hidden", String(!isOpen));
    if (window.__lenis) isOpen ? window.__lenis.stop() : window.__lenis.start();
  }
  menuBtn.addEventListener("click", function () { toggleMenu(); });
  document.addEventListener("keydown", function (e) { if (e.key === "Escape") toggleMenu(false); });

  header.querySelector(".lang-btn").addEventListener("click", function () {
    setLang(root.lang === "ar" ? "en" : "ar", true);
  });

  /* ---------- footer + whatsapp ---------- */
  var footer = document.createElement("footer");
  footer.className = "footer";
  footer.innerHTML =
    '<div class="wrap">' +
      '<div class="footer__top">' +
        '<div class="footer__brand">' +
          '<img src="../assets/brand/logo-full-white.png" alt="" width="1000" height="180" loading="lazy">' +
          "<p>" + t("تصميم داخلي، تفصيل أثاث وستائر، صيانة واستشارات — من الفكرة إلى آخر لمسة، في مكان واحد.",
                     "Interior design, bespoke furniture and curtains, care and consultation — from first idea to final touch, under one roof.") + "</p>" +
        "</div>" +
        "<div><h4>" + t("الموقع", "Explore") + "</h4><ul>" +
          NAV.map(function (n) { return '<li><a href="' + n.href + '">' + t(n.ar, n.en) + "</a></li>"; }).join("") +
        "</ul></div>" +
        "<div><h4>" + t("الخدمات", "Services") + "</h4><ul>" +
          '<li><a href="services.html#design">' + t("التصميم الداخلي", "Interior Design") + "</a></li>" +
          '<li><a href="services.html#bespoke">' + t("تفصيل الأثاث والستائر", "Bespoke Furniture & Curtains") + "</a></li>" +
          '<li><a href="services.html#care">' + t("الصيانة والعناية", "Care & Maintenance") + "</a></li>" +
          '<li><a href="services.html#consultation">' + t("الاستشارات", "Consultation") + "</a></li>" +
        "</ul></div>" +
        "<div><h4>" + t("تواصل", "Contact") + "</h4><ul>" +
          '<li><a href="tel:' + C.phoneHref + '" dir="ltr">' + C.phone + "</a></li>" +
          '<li><a href="mailto:' + C.email + '">' + C.email + "</a></li>" +
          "<li>" + t(C.addrAr, C.addrEn) + "</li>" +
        '</ul><div class="socials">' +
          '<a href="#" aria-label="Instagram">' + I.ig + "</a>" +
          '<a href="#" aria-label="X">' + I.x + "</a>" +
          '<a href="#" aria-label="Snapchat">' + I.snap + "</a>" +
          '<a href="#" aria-label="LinkedIn">' + I.in + "</a>" +
        "</div></div>" +
      "</div>" +
      '<div class="footer__giant" aria-hidden="true">Aamal Al Arab</div>' +
      '<div class="footer__bar">' +
        "<span>© " + new Date().getFullYear() + " " + t("مؤسسة أعمال العرب للتجارة. جميع الحقوق محفوظة.", "Aamal Al Arab For Trading Establishment. All rights reserved.") + "</span>" +
        "<span>" + t("سجل تجاري", "C.R.") + " " + C.cr + "</span>" +
      "</div>" +
    "</div>";
  document.body.appendChild(footer);

  var wa = document.createElement("a");
  wa.className = "wa";
  wa.href = "https://wa.me/" + C.wa;
  wa.target = "_blank";
  wa.rel = "noopener";
  wa.setAttribute("data-ar-aria", "تواصل عبر واتساب");
  wa.setAttribute("data-en-aria", "Chat on WhatsApp");
  wa.innerHTML = I.wa;
  document.body.appendChild(wa);

  // inline arrow icons
  document.querySelectorAll("[data-icon]").forEach(function (el) {
    el.insertAdjacentHTML("beforeend", I[el.getAttribute("data-icon")] || "");
  });

  setLang(root.lang, false); // apply to injected attributes

  /* ---------- missing images -> soft placeholder ---------- */
  document.querySelectorAll("img[data-img]").forEach(function (img) {
    function fail() { img.style.visibility = "hidden"; if (img.parentElement) img.parentElement.classList.add("ph"); }
    if (img.complete && img.naturalWidth === 0) fail();
    img.addEventListener("error", fail);
  });

  /* ---------- header on scroll ---------- */
  var lastY = 0;
  function onScroll() {
    var y = window.scrollY;
    header.classList.toggle("is-solid", y > 40);
    header.classList.toggle("is-hidden", y > 400 && y > lastY && !root.classList.contains("menu-open"));
    lastY = y;
  }
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  /* ---------- work filters ---------- */
  var filters = document.querySelectorAll(".filter");
  filters.forEach(function (f) {
    f.addEventListener("click", function () {
      filters.forEach(function (x) { x.classList.remove("is-active"); x.setAttribute("aria-pressed", "false"); });
      f.classList.add("is-active");
      f.setAttribute("aria-pressed", "true");
      var cat = f.getAttribute("data-filter");
      document.querySelectorAll(".work[data-cat]").forEach(function (w) {
        w.classList.toggle("is-hidden", cat !== "all" && w.getAttribute("data-cat").indexOf(cat) === -1);
      });
      if (window.ScrollTrigger) window.ScrollTrigger.refresh();
    });
  });

  /* ---------- contact form ---------- */
  var form = document.querySelector(".form");
  if (form) {
    var svc = new URLSearchParams(location.search).get("service");
    if (svc) { var r = form.querySelector('input[name="service"][value="' + svc + '"]'); if (r) r.checked = true; }
    form.addEventListener("submit", function (e) {
      e.preventDefault();
      var ok = true;
      form.querySelectorAll("[required]").forEach(function (el) {
        var err = el.parentElement.querySelector(".err");
        var bad = !el.value.trim() || (el.type === "tel" && el.value.replace(/\D/g, "").length < 9) || (el.type === "email" && el.value && !/^\S+@\S+\.\S+$/.test(el.value));
        if (err) err.innerHTML = bad ? t("هذا الحقل مطلوب بشكل صحيح", "Please complete this field correctly") : "";
        el.setAttribute("aria-invalid", String(bad));
        if (bad && ok) { el.focus(); ok = false; }
      });
      if (!ok) return;
      var btn = form.querySelector('button[type="submit"]');
      btn.disabled = true;
      setTimeout(function () {
        form.querySelector(".form__ok").classList.add("is-on");
        form.reset();
        btn.disabled = false;
      }, 700);
    });
  }

  var reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* ---------- hero 2: project slider ---------- */
  var hero2 = document.querySelector(".hero2");
  if (hero2) {
    var slides = Array.prototype.slice.call(hero2.querySelectorAll(".hero2__slide"));
    var thumbsBox = hero2.querySelector(".hero2__thumbs");
    var countEl = hero2.querySelector(".hero2__count");
    var cur = 0, busy = false, timer = null;
    var pad = function (n) { return (n < 10 ? "0" : "") + n; };

    function renderThumbs() {
      var html = "";
      for (var k = 1; k <= 2; k++) {
        var idx = (cur + k) % slides.length;
        var cap = slides[idx].querySelector("figcaption b").innerHTML;
        html += '<button class="hero2__thumb" type="button" data-go="' + idx + '"><img src="' + slides[idx].getAttribute("data-thumb") +
          '" alt="" loading="lazy"><span>' + cap + "</span></button>";
      }
      thumbsBox.innerHTML = html;
      thumbsBox.querySelectorAll(".hero2__thumb").forEach(function (b) {
        b.addEventListener("click", function () { go(parseInt(b.getAttribute("data-go"), 10)); restart(); });
      });
      countEl.innerHTML = "<b>" + pad(cur + 1) + "</b> / " + pad(slides.length);
    }

    function go(next, dir) {
      if (busy || next === cur) return;
      next = (next + slides.length) % slides.length;
      var from = slides[cur], to = slides[next];
      cur = next;
      from.setAttribute("aria-hidden", "true");
      to.setAttribute("aria-hidden", "false");
      if (window.gsap && !reduce) {
        busy = true;
        var g = window.gsap;
        to.style.zIndex = 2;
        g.fromTo(to, { clipPath: dir < 0 ? "inset(0 0 100% 0)" : "inset(100% 0 0 0)" },
          { clipPath: "inset(0% 0 0% 0)", duration: 1.1, ease: "power4.inOut",
            onComplete: function () {
              from.classList.remove("is-active"); from.style.clipPath = ""; to.style.zIndex = "";
              to.classList.add("is-active"); busy = false;
            } });
        g.fromTo(to.querySelector("img"), { scale: 1.18 }, { scale: 1, duration: 1.6, ease: "power3.out" });
        g.fromTo(to.querySelector("figcaption"), { opacity: 0, y: 14 }, { opacity: 1, y: 0, duration: 0.7, delay: 0.6 });
      } else {
        from.classList.remove("is-active");
        to.classList.add("is-active");
      }
      renderThumbs();
    }

    function restart() {
      if (timer) clearInterval(timer);
      if (!reduce) timer = setInterval(function () { go(cur + 1, 1); }, 6500);
    }
    hero2.querySelector(".hero2__next").addEventListener("click", function () { go(cur + 1, 1); restart(); });
    hero2.querySelector(".hero2__prev").addEventListener("click", function () { go(cur - 1, -1); restart(); });
    hero2.addEventListener("mouseenter", function () { if (timer) clearInterval(timer); });
    hero2.addEventListener("mouseleave", restart);
    document.addEventListener("visibilitychange", function () { document.hidden ? clearInterval(timer) : restart(); });
    renderThumbs();
    restart();
  }

  /* ---------- motion (GSAP + Lenis), skipped for reduced motion ---------- */
  if (reduce || !window.gsap) return;
  root.classList.add("js");
  var gsap = window.gsap;
  gsap.registerPlugin(window.ScrollTrigger);

  if (window.Lenis) {
    var lenis = new window.Lenis({ duration: 1.15, smoothWheel: true });
    window.__lenis = lenis;
    lenis.on("scroll", window.ScrollTrigger.update);
    gsap.ticker.add(function (time) { lenis.raf(time * 1000); });
    gsap.ticker.lagSmoothing(0);
  }

  // hero
  var heroImg = document.querySelector(".hero__media img");
  if (heroImg) {
    gsap.to(heroImg, { scale: 1, duration: 2.4, ease: "power3.out" });
    gsap.to(heroImg, { yPercent: 12, ease: "none", scrollTrigger: { trigger: ".hero", start: "top top", end: "bottom top", scrub: true } });
  }
  var lines = document.querySelectorAll(".page-hero .display .line > span");
  if (lines.length) gsap.from(lines, { yPercent: 110, duration: 1.2, ease: "power4.out", stagger: 0.09, delay: 0.15 });
  var heroBits = document.querySelectorAll(".page-hero .label, .page-hero p.lead");
  if (heroBits.length) gsap.from(heroBits, { opacity: 0, y: 24, duration: 1, delay: 0.6, ease: "power3.out" });

  // hero 2 intro: blur haze -> words -> star -> image rises -> thumbs & controls
  if (hero2) {
    var words = hero2.querySelectorAll(".hero2__w");
    var first = hero2.querySelector(".hero2__slide.is-active");
    var tl = gsap.timeline({ delay: 0.1 });
    tl.from(hero2.querySelector(".hero2__inner"), { filter: "blur(18px)", opacity: 0.2, duration: 1.1, ease: "power2.out", clearProps: "filter,opacity" })
      .from(words, { opacity: 0, y: 40, filter: "blur(10px)", duration: 1.1, ease: "power3.out", stagger: 0.12 }, "-=0.6")
      .from(hero2.querySelector(".hero2__star"), { rotate: -180, scale: 0, opacity: 0, duration: 1, ease: "back.out(1.6)" }, "-=0.8")
      .fromTo(first, { clipPath: "inset(100% 0 0 0)" }, { clipPath: "inset(0% 0 0% 0)", duration: 1.3, ease: "power4.inOut", clearProps: "clipPath" }, "-=0.5")
      .from(first.querySelector("img"), { scale: 1.25, duration: 1.8, ease: "power3.out" }, "<")
      .from(hero2.querySelectorAll(".hero2__thumbs, .hero2__desc, .hero2__ctrl, .hero2__tag"), { opacity: 0, y: 24, duration: 0.9, ease: "power3.out", stagger: 0.08 }, "-=1");
    gsap.to(hero2.querySelector(".hero2__title"), { yPercent: -18, opacity: 0.4, ease: "none", scrollTrigger: { trigger: hero2, start: "top top", end: "bottom top", scrub: true } });
  }

  // reveals
  document.querySelectorAll("[data-reveal]").forEach(function (el) {
    gsap.to(el, { opacity: 1, y: 0, duration: 1, ease: "power3.out", scrollTrigger: { trigger: el, start: "top 88%" } });
  });
  document.querySelectorAll("[data-parallax] img").forEach(function (img) {
    gsap.fromTo(img, { yPercent: -8, scale: 1.15 }, { yPercent: 8, scale: 1.15, ease: "none", scrollTrigger: { trigger: img.parentElement, scrub: true } });
  });

  // counters
  document.querySelectorAll("[data-count]").forEach(function (el) {
    var end = parseFloat(el.getAttribute("data-count"));
    var obj = { v: 0 };
    gsap.to(obj, {
      v: end, duration: 2, ease: "power2.out",
      scrollTrigger: { trigger: el, start: "top 90%" },
      onUpdate: function () { el.textContent = Math.round(obj.v) + (el.getAttribute("data-suffix") || ""); }
    });
  });

  // cursor-follow preview on service rows (fine pointers only)
  var rows = document.querySelectorAll(".row[data-img-src]");
  if (rows.length && window.matchMedia("(hover: hover) and (pointer: fine)").matches) {
    var prev = document.createElement("div");
    prev.className = "cursor-img";
    prev.innerHTML = '<img alt="">';
    document.body.appendChild(prev);
    var pImg = prev.querySelector("img");
    gsap.set(prev, { xPercent: -50, yPercent: -50 });
    var xTo = gsap.quickTo(prev, "x", { duration: 0.6, ease: "power3" });
    var yTo = gsap.quickTo(prev, "y", { duration: 0.6, ease: "power3" });
    window.addEventListener("mousemove", function (e) { xTo(e.clientX); yTo(e.clientY); });
    rows.forEach(function (row) {
      row.addEventListener("mouseenter", function () { pImg.src = row.getAttribute("data-img-src"); prev.classList.add("is-on"); });
      row.addEventListener("mouseleave", function () { prev.classList.remove("is-on"); });
    });
  }
})();
