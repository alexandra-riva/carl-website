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

/* ===================== 2) I18N (your dictionary must exist as I18N = { sv:{}, en:{} }) ===================== */

function getInitialLang(){
  const params = new URLSearchParams(location.search);
  const stored = localStorage.getItem("lang");
  if (params.get("lang")) return params.get("lang");
  if (stored) return stored;
  const browser = (navigator.language || "sv").slice(0,2);
  return browser === "sv" ? "sv" : "en";
}

function applyI18n(lang){
  document.documentElement.setAttribute("lang", lang);
  document.querySelectorAll("[data-i18n]").forEach(node => {
    const key = node.getAttribute("data-i18n");
    const val = (window.I18N && I18N[lang] && I18N[lang][key]) || null;
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

      if (window.__howAPI?.setCategory) {
        const current =
          document.querySelector(".how__card.is-flipped")?.getAttribute("data-category") || "workshops";
        window.__howAPI.setCategory(current);
      }
    });
  }

  window.__getLang = () => lang;
}

/* ===================== 3) HOW WE WORK: cards + gallery ===================== */

function initHow() {
  const root = document.querySelector("#how-we-work");
  if (!root) return;

  // Delay to ensure partials are present
  setTimeout(() => {
    const cards = root.querySelectorAll(".how__card");
    const galleryEl = document.getElementById("how__gallery");
    if (!cards.length || !galleryEl) return;

    // Since ALL images live in /assets (no subfolders), list the filenames per category here.
    // Use any names you already have in /assets. Examples below:
    const imageMap = {
      workshops: ["w1.jpg","w2.jpg","w3.jpg","w4.jpg","w5.jpg","w6.jpg","w7.jpg"],
      events:    ["e1.jpg","e2.jpg","e3.jpg","e4.jpg","e5.jpg","e6.jpg"],
      dj:        ["dj1.jpg","dj2.jpg","dj3.jpg","dj4.jpg"],
      murals:    ["m1.jpg","m2.jpg","m3.jpg","m4.jpg","m5.jpg"]
    };
    window.__imageMap = imageMap;

    const flipOnlyThis = (card) => {
      cards.forEach(c => {
        if (c !== card) {
          c.classList.remove("is-flipped");
          c.setAttribute("aria-pressed","false");
        }
      });
      const flipped = card.classList.toggle("is-flipped");
      card.setAttribute("aria-pressed", flipped.toString());

      const category = card.getAttribute("data-category");
      if (flipped) showGallery(category, galleryEl, imageMap);
      else galleryEl.innerHTML = "";
    };

    cards.forEach(card => {
      // mouse
      card.addEventListener("click", () => flipOnlyThis(card));
      // keyboard
      card.addEventListener("keydown", (e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          flipOnlyThis(card);
        }
      });
    });

    // Expose simple API (optional)
    window.__howAPI = {
      root,
      setCategory: (cat) => {
        const card = [...cards].find(c => c.getAttribute("data-category") === cat);
        if (!card) return;
        cards.forEach(c => { c.classList.remove("is-flipped"); c.setAttribute("aria-pressed","false"); });
        card.classList.add("is-flipped");
        card.setAttribute("aria-pressed","true");
        showGallery(cat, galleryEl, imageMap);
      }
    };

    // Optional default: open the first card
    // window.__howAPI.setCategory("workshops");
  }, 100);
}

function showGallery(category, galleryEl, imageMap){
  galleryEl.innerHTML = "";
  const list = imageMap[category] || [];
  if (!list.length) return;

  // shuffle and take up to 6
  const picks = [...list].sort(() => Math.random() - 0.5).slice(0, 6);
  const sizes = ["s","m","l"];

  picks.forEach((file, i) => {
    const img = document.createElement("img");
    // IMPORTANT: images are directly under /assets/
    img.src = `assets/${file}`;
    img.alt = `${category} ${i+1}`;
    img.loading = "lazy";
    img.decoding = "async";

    // random heights
    img.className = `how__img how__img--${sizes[Math.floor(Math.random()*sizes.length)]}`;

    // Remove broken images (optional)
    img.addEventListener("error", () => img.remove());

    galleryEl.appendChild(img);
  });
}

/* ===================== 4) Header links -> scroll & flip (optional) ===================== */

function wireHeaderToHow() {
  const root = document.querySelector("#how-we-work");
  const links = document.querySelectorAll("[data-goto-how]");
  if (!root || !links.length || !window.__howAPI) return;

  links.forEach(link => {
    link.addEventListener("click", (e) => {
      e.preventDefault();
      const cat = link.getAttribute("data-goto-how");
      root.scrollIntoView({ behavior: "smooth", block: "start" });
      window.__howAPI.setCategory(cat);
      history.replaceState(null, '', '#how-we-work');
    });
  });
}

/* ===================== 5) Boot ===================== */

document.addEventListener("DOMContentLoaded", async () => {
  await includePartials();
  initI18n();
  initHow();
  setTimeout(wireHeaderToHow, 150);
});