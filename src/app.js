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

/* ===================== I18N ===================== */
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

    "how.workshops.render": "Vi håller skapande workshops som bygger gemenskap: streetart, graffiti, återbruk, collage och klistermärken.<p>Vi erbjuder även DJ-kurser samt foto/film-grunder och anpassar alltid efter deltagarnas förutsättningar – kom gärna med egna idéer.</p>",
    "how.events.render": "Vi producerar kulturevenemang från spelningar och utställningar till föreläsningar, fester och privata tillställningar – alltid skräddarsytt.<p>Vid behov dokumenterar vi med video och skapar minnen som håller – vi samskapar gärna utifrån er vision.</p>",
    "how.dj.render": "Våra DJs anpassar musiken efter publik och plats – för klubbar, skolor, företagsevent, modevisningar, fester och mer.<p>Stort eller litet sammanhang: vi sätter rätt stämning. Hör av er för frågor och bokning.</p>",
    "how.murals.render": "Vi målar muraler och markmålningar som förvandlar miljöer – inklusive interaktiva hinderbanor för skolgårdar och gårdar.<p>Vi skapar motiv efter plats och behov – från väggar och containrar till barnrum – hållbart och unikt.</p>"
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

    "how.workshops.render": "We run creative workshops that build community: street art, graffiti, reuse, collage, and stickers.<p>We also offer DJ courses and photo/film basics, adapting to all abilities—bring your own ideas too.</p>",
    "how.events.render": "We produce cultural events—from gigs and exhibitions to talks, parties, and private gatherings—always tailored.<p>We can film for lasting memories and co-create from your vision.</p>",
    "how.dj.render": "Our DJs tailor music to audience and venue—for clubs, schools, corporate events, fashion shows, parties, and more.<p>Big or small, we set the mood. Get in touch to book or ask questions.</p>",
    "how.murals.render": "We create murals and ground paintings that transform spaces—including interactive obstacle courses for schoolyards and courtyards.<p>Custom motifs for walls, containers, and children’s rooms—sustainable and unique.</p>"
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

function applyTranslations(lang) {
  const dict = I18N[lang] || I18N.sv;
  document.documentElement.lang = lang;

  document.querySelectorAll("[data-i18n]").forEach((el) => {
    const key = el.getAttribute("data-i18n");
    const val = dict[key];
    if (val == null) return;
    const mode = el.getAttribute("data-i18n-attr");
    if (mode === "html") {
      el.innerHTML = val;
    } else {
      el.textContent = val;
    }
  });

  const opened = document.querySelector(".how-card__btn[aria-expanded='true']")?.dataset.cat;
  if (opened) {
    updateGalleryTitle(opened);
  }

  const sw = document.getElementById("langswitch") || document.getElementById("lang-toggle");
  if (sw) sw.textContent = lang.toUpperCase();
}

function initI18n() {
  let currentLang = getInitialLang();
  applyTranslations(currentLang);

  const sw = document.getElementById("langswitch") || document.getElementById("lang-toggle");
  if (sw) {
    sw.addEventListener("click", () => {
      currentLang = currentLang === "sv" ? "en" : "sv";
      localStorage.setItem("lang", currentLang);
      applyTranslations(currentLang);
      const params = new URLSearchParams(location.search);
      params.set("lang", currentLang);
      history.replaceState(null, "", `${location.pathname}?${params.toString()}${location.hash}`);
    });
  }
  window.__getLang = () => currentLang;
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
    gallery.offsetHeight; // force reflow
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

    const resetDom = () => {
      gallery.classList.remove("is-closing");
      if (clearAfter && grid) grid.innerHTML = "";
      if (status) status.textContent = "";
      // Reset gallery back inside shell if it was relocated on mobile
      const shell = document.querySelector("#how-we-work .shell");
      if (shell && gallery.parentElement !== shell) {
        shell.appendChild(gallery);
      }
    };

    const onEnd = (e) => {
      if (e.target !== gallery) return;
      gallery.removeEventListener("transitionend", onEnd);
      resetDom();
    };
    gallery.addEventListener("transitionend", onEnd);

    setTimeout(() => {
      if (gallery.classList.contains("is-closing")) {
        resetDom();
      }
    }, 550);
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

      // On mobile screens: place gallery directly underneath opened card
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

function updateGalleryTitle(cat) {
  const titleEl = document.getElementById("how-gallery-title");
  const key = `how.menu.${cat}`;
  const lang = document.documentElement.lang || "sv";
  if (titleEl && I18N?.[lang]?.[key]) titleEl.textContent = I18N[lang][key];
}

/* ===================== 4) Category Gallery =====================
   Displays the single dedicated high-res picture for each category:
   Workshops -> w1.jpg
   Events    -> e1.JPG
   DJ        -> dj1.jpg
   Murals    -> m6.jpg
================================================================ */
async function renderCategoryGallery(cat) {
  const grid = document.getElementById("how-gallery-grid");
  const status = document.getElementById("how-gallery-status");
  if (!grid) return [];

  grid.innerHTML = "";
  if (status) status.textContent = "";

  const MAP = {
    workshops: "assets/w1.jpg",
    events: "assets/e1.JPG",
    dj: "assets/dj1.jpg",
    murals: "assets/m6.jpg"
  };

  const src = MAP[cat] || "assets/w1.jpg";

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
