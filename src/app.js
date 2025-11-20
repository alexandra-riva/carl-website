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

/* ===================== I18N (unchanged) ===================== */
const I18N = {
  sv: {
    "nav.workshops": "WORKSHOPS",
    "nav.events": "EVENTS",
    "nav.about": "OM OSS",
    "nav.dj": "DJ",
    "nav.murals": "MURALS",
    "nav.contact": "CONTACT",

    "hero.p1": "Jag är Carl och, tillsammans med ett nätverk av kulturarbetare, erbjuder jag kreativa tjänster för offentliga och privata sammanhang. Genom workshops, events och utsmyckning skapar vi upplevelser som förenar människor i alla åldrar och miljöer.",
    "hero.p2": "Vi arbetar med kurser i konst, musik, foto och film, samt DJ-spelningar, muralmålningar och unika evenemang. Alltid med fokus på kvalitet, kreativitet och delaktighet.",
    "hero.p3": "Vi har erfarenhet av att arbeta med många olika grupper – barn, unga, vuxna och personer med särskilda behov – och anpassar alltid upplägget efter plats, människor och syfte. Med vårt breda nätverk är vi öppna för nya samarbeten och idéer.",

    "how.title.part1": "HOW",
    "how.title.part2": "WE",
    "how.title.part3": "WORK",

    "how.menu.workshops": "WORKSHOPS",
    "how.menu.events": "EVENTS",
    "how.menu.dj": "DJ",
    "how.menu.murals": "MURALS",

    "how.workshops.1": "Vi håller skapande workshops som bygger gemenskap: streetart, graffiti, återbruk, collage och klistermärken.",
    "how.workshops.2": "Vi erbjuder även DJ-kurser samt foto/film-grunder och anpassar alltid efter deltagarnas förutsättningar – kom gärna med egna idéer.",

    "how.events.1": "Vi producerar kulturevenemang från spelningar och utställningar till föreläsningar, fester och privata tillställningar – alltid skräddarsytt.",
    "how.events.2": "Vid behov dokumenterar vi med video och skapar minnen som håller – vi samskapar gärna utifrån er vision.",

    "how.dj.1": "Våra DJs anpassar musiken efter publik och plats – för klubbar, skolor, företagsevent, modevisningar, fester och mer.",
    "how.dj.2": "Stort eller litet sammanhang: vi sätter rätt stämning. Hör av er för frågor och bokning.",

    "how.murals.1": "Vi målar muraler och markmålningar som förvandlar miljöer – inklusive interaktiva hinderbanor för skolgårdar och gårdar.",
    "how.murals.2": "Vi skapar motiv efter plats och behov – från väggar och containrar till barnrum – hållbart och unikt."
  },
  en: {
    "nav.workshops": "WORKSHOPS",
    "nav.events": "EVENTS",
    "nav.about": "ABOUT",
    "nav.dj": "DJ",
    "nav.murals": "MURALS",
    "nav.contact": "CONTACT",

    "hero.p1": "I’m Carl and, together with a network of cultural workers, I offer creative services for public and private settings. Through workshops, events, and decorative projects, we create experiences that bring people together across ages and environments.",
    "hero.p2": "We work with courses in art, music, photography, and film, as well as DJ performances, murals, and unique events. Always with a focus on quality, creativity, and inclusion.",
    "hero.p3": "We have experience working with many groups – children, youth, adults, and people with special needs – and always adapt the approach to the place, people, and purpose. With our wide network, we are open to new collaborations and ideas.",

    "how.title.part1": "HOW",
    "how.title.part2": "WE",
    "how.title.part3": "WORK",

    "how.menu.workshops": "WORKSHOPS",
    "how.menu.events": "EVENTS",
    "how.menu.dj": "DJ",
    "how.menu.murals": "MURALS",

    "how.workshops.1": "We run creative workshops that build community: street art, graffiti, reuse, collage, and stickers.",
    "how.workshops.2": "We also offer DJ courses and photo/film basics, adapting to all abilities—bring your own ideas too.",
    "how.events.1": "We produce cultural events—from gigs and exhibitions to talks, parties, and private gatherings—always tailored.",
    "how.events.2": "We can film for lasting memories and co-create from your vision.",
    "how.dj.1": "Our DJs tailor music to audience and venue—for clubs, schools, corporate events, fashion shows, parties, and more.",
    "how.dj.2": "Big or small, we set the mood. Get in touch to book or ask questions.",
    "how.murals.1": "We create murals and ground paintings that transform spaces—including interactive obstacle courses for schoolyards and courtyards.",
    "how.murals.2": "Custom motifs for walls, containers, and children’s rooms—sustainable and unique."
  }
};

function getInitialLang() {
  const params = new URLSearchParams(location.search);
  const stored = localStorage.getItem("lang");
  if (params.get("lang")) return params.get("lang");
  if (stored) return stored;
  const browser = (navigator.language || "sv").slice(0, 2);
  return browser === "sv" ? "sv" : "en";
}

function renderHowParagraphs(lang) {
  const cats = ["workshops", "events", "dj", "murals"];
  cats.forEach((cat) => {
    const html = [1, 2]
      .map((i) => I18N?.[lang]?.[`how.${cat}.${i}`])
      .filter(Boolean)
      .map((p) => `<p>${p}</p>`)
      .join("");
    const node = document.querySelector(`[data-i18n="how.${cat}.render"]`);
    if (node) node.innerHTML = html;
  });
}

function applyI18n(lang) {
  document.documentElement.setAttribute("lang", lang);
  document.querySelectorAll("[data-i18n]").forEach((node) => {
    const key = node.getAttribute("data-i18n");
    const val = I18N?.[lang]?.[key];
    if (!val) return;
    const attr = node.getAttribute("data-i18n-attr") || "text";
    if (attr === "html") node.innerHTML = val;
    else node.textContent = val;
  });
  renderHowParagraphs(lang);

  // Update gallery heading if present
  const opened = document.querySelector(".how-card__btn[aria-expanded='true']")?.dataset.cat || "workshops";
  const titleKey = `how.menu.${opened}`;
  const titleEl = document.getElementById("how-gallery-title");
  if (titleEl && I18N?.[lang]?.[titleKey]) titleEl.textContent = I18N[lang][titleKey];
}

function initI18n() {
  let lang = getInitialLang();
  applyI18n(lang);

  const btn = document.getElementById("langswitch");
  if (btn) {
    btn.textContent = lang.toUpperCase();
    btn.addEventListener("click", () => {
      lang = lang === "sv" ? "en" : "sv";
      localStorage.setItem("lang", lang);
      applyI18n(lang);
      btn.textContent = lang.toUpperCase();
    });
  }
  window.__getLang = () => lang;
}

/* ===================== 3) HOW — flip cards ===================== */

function initHowFlipCards() {
  const root = document.querySelector("#how-we-work");
  if (!root) return null;

  const buttons = [...root.querySelectorAll(".how-card__btn")];

  function collapseAll(exceptBtn = null) {
    buttons.forEach((b) => {
      if (b !== exceptBtn) b.setAttribute("aria-expanded", "false");
    });
  }

  function getGalleryEls() {
    return {
      gallery: document.getElementById("how-gallery"),
      grid: document.getElementById("how-gallery-grid"),
      status: document.getElementById("how-gallery-status")
    };
  }

  function showGallery() {
    const { gallery } = getGalleryEls();
    if (!gallery) return;
    gallery.classList.remove("is-closing");
    gallery.offsetHeight;
    gallery.classList.add("is-visible");
  }

  function hideGallery(clearAfter = true) {
    const { gallery, grid, status } = getGalleryEls();
    if (!gallery) return;

    if (!gallery.classList.contains("is-visible")) {
      if (clearAfter && grid) grid.innerHTML = "";
      if (status) status.textContent = "";
      gallery.classList.remove("is-closing");
      return;
    }

    gallery.classList.add("is-closing");
    gallery.classList.remove("is-visible");

    const onEnd = (e) => {
      if (e.target !== gallery) return;
      gallery.removeEventListener("transitionend", onEnd);
      gallery.classList.remove("is-closing");
      if (clearAfter && grid) grid.innerHTML = "";
      if (status) status.textContent = "";
    };
    gallery.addEventListener("transitionend", onEnd);

    setTimeout(() => {
      if (gallery.classList.contains("is-closing")) {
        gallery.classList.remove("is-closing");
        if (clearAfter && grid) grid.innerHTML = "";
        if (status) status.textContent = "";
      }
    }, 700);
  }

  function toggle(btn) {
  const isOpen = btn.getAttribute("aria-expanded") === "true";
  const cat = btn.dataset.cat;

  if (isOpen) {
    btn.setAttribute("aria-expanded", "false");
    hideGallery();
    return;
  }

  collapseAll(btn);
  btn.setAttribute("aria-expanded", "true");

  renderCategoryGallery(cat).then(() => {
    showGallery();
    updateGalleryTitle(cat);

    // ⭐ MOBILE: Move gallery under the opened card ⭐
    if (window.innerWidth <= 700) {
      const parentCard = btn.closest(".how-card");
      const gallery = document.getElementById("how-gallery");

      if (parentCard && gallery) {
        parentCard.insertAdjacentElement("afterend", gallery);
      }
    }
  });
}

  buttons.forEach((btn) => {
    btn.addEventListener("click", () => toggle(btn));
    btn.addEventListener("keydown", (e) => {
      if (e.key === "Enter" || e.key === " ") { e.preventDefault(); toggle(btn); }
      if (e.key === "Escape") { btn.setAttribute("aria-expanded", "false"); btn.focus(); hideGallery(); }
    });
  });

  function setCategory(cat) {
    const target = buttons.find((b) => b.dataset.cat === cat);
    if (!target) return;
    collapseAll(target);
    target.setAttribute("aria-expanded", "true");

    renderCategoryGallery(cat).then(() => {
      showGallery();
      updateGalleryTitle(cat);
      target.focus({ preventScroll: true });
    });
  }

  const api = { setCategory, root, showGallery, hideGallery };
  window.__howAPI = api;
  return api;
}

/* ===================== 4) Category Gallery ===================== */

function updateGalleryTitle(cat) {
  const lang = window.__getLang ? window.__getLang() : "sv";
  const titleEl = document.getElementById("how-gallery-title");
  const key = `how.menu.${cat}`;
  if (titleEl && I18N?.[lang]?.[key]) titleEl.textContent = I18N[lang][key];
}

/* ⭐⭐⭐ THIS IS THE ONLY FUNCTION CHANGED ⭐⭐⭐
   Now loads ONE BIG IMAGE ONLY */

async function renderCategoryGallery(cat) {
  const grid = document.getElementById("how-gallery-grid");
  const status = document.getElementById("how-gallery-status");
  if (!grid) return [];

  grid.innerHTML = "";
  if (status) status.textContent = "";

  const MAP = {
    workshops: "assets/w1.jpg",
    events: "assets/e1.jpg",
    dj: "assets/dj1.jpg",
    murals: "assets/m6.jpg"
  };

  const src = MAP[cat];

  const fig = document.createElement("figure");
  fig.className = "how-gallery__item how-gallery__item--single";

  const img = new Image();
  img.src = src;
  img.className = "how-gallery__img is-loaded how-gallery__img--large";
  img.alt = cat;

  fig.appendChild(img);
  grid.appendChild(fig);

  return [src];
}

/* ========== 5) Wire header links ========== */
function wireHeaderToHow(howAPI) {
  const links = document.querySelectorAll("[data-goto-how]");
  if (!links.length || !howAPI) return;

  links.forEach((link) => {
    link.addEventListener("click", (e) => {
      e.preventDefault();
      const cat = link.getAttribute("data-goto-how");
      howAPI.root.scrollIntoView({ behavior: "smooth", block: "start" });
      howAPI.setCategory(cat);
      history.replaceState(null, "", "#how-we-work");
    });
  });
}

/* ===================== 6) Boot ===================== */
document.addEventListener("DOMContentLoaded", async () => {
  await includePartials();
  initI18n();

  const howAPI = initHowFlipCards();
  wireHeaderToHow(howAPI);

  const gallery = document.getElementById("how-gallery");
  if (gallery) {
    gallery.classList.remove("is-visible", "is-closing");
  }
});