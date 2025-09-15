// ------------------ 1) Include partials first ------------------
async function includePartials() {
  const slots = [...document.querySelectorAll("[data-include]")];
  await Promise.all(
    slots.map(async (el) => {
      const url = el.getAttribute("data-include");
      try {
        const res = await fetch(url, { cache: "no-cache" });
        if (!res.ok) throw new Error(`${res.status} ${res.statusText}`);
        const html = await res.text();
        el.outerHTML = html; // replace placeholder with section markup
      } catch (e) {
        console.error("Include failed:", url, e);
        el.outerHTML = ""; // remove placeholder so layout continues
      }
    })
  );
}

/* ===================== 2) I18N ===================== */
/* We DO NOT change your Swedish sentences. They’re copied verbatim below. */
const I18N = {
  sv: {
    // Header nav (only used if you add data-i18n on links)
    "nav.workshops": "WORKSHOPS",
    "nav.events":    "EVENTS",
    "nav.about":     "OM OSS",
    "nav.dj":        "DJ",
    "nav.murals":    "MURALS",
    "nav.contact":   "CONTACT",

    // Hero lead (exactly your Swedish text)
    "hero.p1": "Vi skapar kulturella upplevelser som förenar människor genom konst, musik och kreativitet.",
    "hero.p2": "Med bred erfarenhet och ett stort nätverk inom kulturlivet erbjuder vi allt från workshops och events till DJ-spelningar och muralmålningar.",
    "hero.p3": "Vårt mål är att inspirera, engagera och lämna ett bestående intryck – oavsett om det handlar om en skola, ett företag, en festival eller ett privat arrangemang.",

    // HOW title parts (only used if you add data-i18n on them)
    "how.title.part1": "HOW",
    "how.title.part2": "WE",
    "how.title.part3": "WORK",

    // HOW menu labels (only used if you add data-i18n on buttons)
    "how.menu.workshops": "WORKSHOPS",
    "how.menu.events": "EVENTS",
    "how.menu.dj": "DJ",
    "how.menu.murals": "MURALS",

    // HOW descriptions (Swedish)
    "how.workshops.1": "Vi erbjuder kreativa workshops inom konst, DJ-ing, foto och film – och kan även samarbeta med andra aktörer för olika teman. Innehållet anpassas alltid efter målgruppen och dess behov.",
    "how.workshops.2": "Tidigare workshops har bland annat handlat om streetart/graffiti, återbrukskonst, collage och klistermärken, DJ-introduktioner samt foto- och filmproduktion med mobilkamera. Våra upplägg fungerar för alla åldrar och grupper, även funktionsvarierade, och kan hållas både inomhus och utomhus.",

    "how.events.1": "Vi planerar och genomför en bredd av kulturevenemang – från spelningar, fester och utställningar till föreläsningar, afterworks och privata firanden.",
    "how.events.2": "Vill ni ha en AW med DJ och street art, ett barnkalas eller en möhippa? Vi idéutvecklar gärna tillsammans och kan även filma/dokumentera ert event.",

    "how.dj.1": "Behöver ni en eller flera DJs? Vi spelar det ni vill – där ni vill!",
    "how.dj.2": "Erfarenhet från klubbar, skoldiscon, mässor, catwalks, rave, restauranger, demonstrationer, teater, afterski och mycket mer.",

    "how.murals.1": "Vi förvandlar tråkiga ytor till levande konstverk.",
    "how.murals.2": "Det kan vara muralmålningar, interaktiva markmålningar (t.ex. hinderbanor på asfalt) eller att ge nytt liv åt containrar, skolmiljöer eller barnrum – alltid i dialog med era idéer."
  },

  en: {
    // Header nav
    "nav.workshops": "WORKSHOPS",
    "nav.events":    "EVENTS",
    "nav.about":     "ABOUT",
    "nav.dj":        "DJ",
    "nav.murals":    "MURALS",
    "nav.contact":   "CONTACT",

    // Hero lead (faithful English translations of your Swedish text)
    "hero.p1": "We create cultural experiences that bring people together through art, music, and creativity.",
    "hero.p2": "With broad experience and a strong network in the cultural field, we offer everything from workshops and events to DJ sets and mural paintings.",
    "hero.p3": "Our goal is to inspire, engage, and leave a lasting impression—whether it’s a school, a company, a festival, or a private event.",

    // HOW title parts
    "how.title.part1": "HOW",
    "how.title.part2": "WE",
    "how.title.part3": "WORK",

    // HOW menu labels
    "how.menu.workshops": "WORKSHOPS",
    "how.menu.events": "EVENTS",
    "how.menu.dj": "DJ",
    "how.menu.murals": "MURALS",

    // HOW descriptions (English)
    "how.workshops.1": "We offer creative workshops in art, DJ-ing, photo and film—and can collaborate with partners for other themes. Each program is tailored to the group’s needs.",
    "how.workshops.2": "Past workshops include street art/graffiti, upcycled art, collage and stickers, DJ introductions, and photo/film production with mobile cameras. Suitable for all ages and groups, indoors or outdoors.",

    "how.events.1": "We plan and deliver a wide range of cultural events—from concerts, parties, and exhibitions to talks, afterworks, and private celebrations.",
    "how.events.2": "Afterwork with a DJ and street art? A kids’ party or a bachelorette? We love co-creating ideas and can also film/document your event.",

    "how.dj.1": "Need one or several DJs? We play what you want—where you want!",
    "how.dj.2": "Experience includes clubs, school discos, trade fairs, catwalks, raves, restaurants, demonstrations, theatre, après-ski, and more.",

    "how.murals.1": "We transform dull surfaces into vibrant works of art.",
    "how.murals.2": "This can be murals, interactive ground paintings (e.g., obstacle courses on asphalt), or giving new life to containers, schools, or children’s rooms—always in dialogue with your ideas."
  }
};

function getInitialLang(){
  const params = new URLSearchParams(location.search);
  const stored = localStorage.getItem("lang");
  if (params.get("lang")) return params.get("lang");
  if (stored) return stored;
  // default by browser
  const browser = (navigator.language || "sv").slice(0,2);
  return browser === "sv" ? "sv" : "en";
}

function applyI18n(lang){
  document.documentElement.setAttribute("lang", lang);
  document.querySelectorAll("[data-i18n]").forEach(node => {
    const key = node.getAttribute("data-i18n");
    const val = I18N?.[lang]?.[key];
    if (!val) return;
    const attr = node.getAttribute("data-i18n-attr") || "text";
    if (attr === "html") node.innerHTML = val;
    else node.textContent = val;
  });
}

function initI18n(){
  let lang = getInitialLang();
  applyI18n(lang);

  const btn = document.getElementById("langswitch");
  if (btn){
    btn.textContent = lang.toUpperCase();
    btn.addEventListener("click", () => {
      lang = (lang === "sv" ? "en" : "sv");
      localStorage.setItem("lang", lang);
      applyI18n(lang);
      btn.textContent = lang.toUpperCase();

      // if HOW descriptions exist, re-render them in the new language
      if (window.__howAPI?.setCategory) {
        const active =
          document.querySelector(".how__menu .is-active")?.dataset.cat || "workshops";
        window.__howAPI.setCategory(active);
      }
    });
  }

  // expose current lang getter if needed
  window.__getLang = () => lang;
}

/* ===================== 3) HOW WE WORK logic ===================== */
function initHow() {
  const root = document.querySelector("#how-we-work");
  if (!root) return null;

  const descEl  = root.querySelector("#how-desc");
  const trackEl = root.querySelector("#how-track");
  const menu    = root.querySelector(".how__menu");
  if (!descEl || !trackEl || !menu) return null;

  // Filenames (we try .jpg then fall back to .JPG)
  const IMG_MAP = {
    workshops: rangeNames("w", 1, 14),
    events:    rangeNames("e", 1, 7),
    dj:        rangeNames("dj", 1, 8),
    murals:    rangeNames("m", 1, 10),
  };

  function rangeNames(prefix, start, end) {
    const arr = [];
    for (let i = start; i <= end; i++) arr.push(`${prefix}${i}`);
    return arr;
  }

  function makeImg(name) {
    const img = new Image();
    img.decoding = "async";
    img.loading = "lazy";
    const lower = `assets/${name}.jpg`;
    const upper = `assets/${name}.JPG`;
    img.src = lower;
    img.onerror = () => {
      if (img.src.endsWith(".jpg")) img.src = upper;
      else img.style.display = "none";
    };
    return img;
  }

  function setDescription(cat) {
    const lang = document.documentElement.getAttribute("lang") || "sv";
    const base = `how.${cat}`;
    const paras = [I18N?.[lang]?.[`${base}.1`], I18N?.[lang]?.[`${base}.2`]]
      .filter(Boolean);
    descEl.innerHTML = paras.map((p) => `<p>${p}</p>`).join("");
  }

  // --- Marquee state ---
  let rafId = null;
  let offset = 0;
  const speed = 60; // px per second
  let lastT = 0;

  function clearTicker() {
    if (rafId) cancelAnimationFrame(rafId);
    rafId = null;
    offset = 0;
    trackEl.style.transform = "translateX(0)";
    lastT = 0;
  }

  function startTicker() {
    clearTicker();
    const styles = getComputedStyle(trackEl);
    const gapPx = styles.gap ? parseFloat(styles.gap) : 12;

    function step(t) {
      if (!lastT) lastT = t;
      const dt = (t - lastT) / 1000;
      lastT = t;

      offset -= speed * dt;
      trackEl.style.transform = `translateX(${offset}px)`;

      const first = trackEl.firstElementChild;
      if (first) {
        const firstW = first.getBoundingClientRect().width + gapPx;
        if (-offset >= firstW) {
          offset += firstW;
          trackEl.appendChild(first);
          trackEl.style.transform = `translateX(${offset}px)`;
        }
      }
      rafId = requestAnimationFrame(step);
    }

    rafId = requestAnimationFrame(step);
  }

  function populateOnce(namesArr) {
    const frag = document.createDocumentFragment();
    namesArr.forEach((n) => frag.appendChild(makeImg(n)));
    trackEl.appendChild(frag);
  }

  function ensureEnoughWidth() {
    const styles = getComputedStyle(trackEl);
    const gap = parseFloat(styles.gap) || 12;

    const totalWidth = () =>
      Array.from(trackEl.children).reduce((sum, el) => sum + el.getBoundingClientRect().width, 0) +
      Math.max(0, trackEl.children.length - 1) * gap;

    const minTotal = window.innerWidth * 2; // enough to loop smoothly
    let total = totalWidth();
    if (total === 0) return;

    while (total < minTotal) {
      const batch = Array.from(trackEl.children).map((n) => n.cloneNode(true));
      const frag = document.createDocumentFragment();
      batch.forEach((n) => frag.appendChild(n));
      trackEl.appendChild(frag);
      total = totalWidth();
    }
  }

  function setMarquee(cat) {
    clearTicker();
    trackEl.innerHTML = "";

    const namesArr = IMG_MAP[cat] || [];
    populateOnce(namesArr);

    const imgs = Array.from(trackEl.querySelectorAll("img"));
    const ready = Promise.all(
      imgs.map(
        (img) =>
          new Promise((res) => {
            if (img.complete) return res();
            img.addEventListener("load", res, { once: true });
            img.addEventListener("error", res, { once: true });
          })
      )
    );

    ready.then(() => {
      ensureEnoughWidth();
      startTicker();
    });
  }

  function setCategory(cat) {
    root
      .querySelectorAll(".how__menu button")
      .forEach((b) => b.classList.toggle("is-active", b.dataset.cat === cat));
    setDescription(cat);
    setMarquee(cat);
  }

  // menu clicks inside section
  menu.addEventListener("click", (e) => {
    const btn = e.target.closest("button[data-cat]");
    if (!btn) return;
    setCategory(btn.dataset.cat);
  });

  // Rebuild marquee on resize (debounced)
  let resizeTimer = null;
  window.addEventListener("resize", () => {
    if (resizeTimer) cancelAnimationFrame(resizeTimer);
    resizeTimer = requestAnimationFrame(() => {
      const active = root.querySelector(".how__menu button.is-active")?.dataset.cat || "workshops";
      setMarquee(active);
    });
  });

  // initial
  setCategory("workshops");

  // expose API so header links can switch category
  const api = { setCategory, root };
  window.__howAPI = api;
  return api;
}

/* ========== 4) Wire header links (data-goto-how="workshops|events|dj|murals") ========== */
function wireHeaderToHow(howAPI) {
  const links = document.querySelectorAll('[data-goto-how]');
  if (!links.length || !howAPI) return;

  links.forEach(link => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      const cat = link.getAttribute('data-goto-how');
      howAPI.root.scrollIntoView({ behavior: 'smooth', block: 'start' });
      howAPI.setCategory(cat);
      history.replaceState(null, '', '#how-we-work');
    });
  });
}

/* ===================== 5) Boot ===================== */
document.addEventListener("DOMContentLoaded", async () => {
  await includePartials();
  initI18n();                   // apply lang to already-inserted DOM
  const howAPI = initHow();     // uses I18N for descriptions
  wireHeaderToHow(howAPI);
});