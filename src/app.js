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

const I18N = {
  sv: {
    // Header nav (only used if you add data-i18n on links)
    "nav.workshops": "WORKSHOPS",
    "nav.events":    "EVENTS",
    "nav.about":     "OM OSS",
    "nav.dj":        "DJ",
    "nav.murals":    "MURALS",
    "nav.contact":   "CONTACT",

    // Hero lead (unchanged)
    "hero.p1": "Jag är Carl, och tillsammans med ett nätverk av kulturarbetare erbjuder jag kreativa tjänster för både offentliga och privata sammanhang. Genom workshops, events och konstnärlig utsmyckning skapar vi upplevelser som förenar människor i alla åldrar och miljöer.",
    "hero.p2": "Vi arbetar med allt från interaktiva kurser i konst, musik, foto och film till DJ-spelningar, muralmålningar och unika kulturevenemang. Alltid med fokus på kvalitet, kreativitet och att alla inblandade ska känna sig delaktiga.",
    "hero.p3": "Vi har erfarenhet av att arbeta med många olika grupper – barn, unga, vuxna och personer med särskilda behov – och anpassar alltid upplägget efter plats, människor och syfte. Med ett brett nätverk inom kulturlivet är vi alltid öppna för nya samarbeten och idéer.",
    "hero.p4": "Ett kreativitetsfrämjande – med plats för alla.",

    // HOW title parts (do not translate titles)
    "how.title.part1": "HOW",
    "how.title.part2": "WE",
    "how.title.part3": "WORK",

    // HOW menu labels
    "how.menu.workshops": "WORKSHOPS",
    "how.menu.events": "EVENTS",
    "how.menu.dj": "DJ",
    "how.menu.murals": "MURALS",

    // HOW descriptions (Swedish) — UPDATED
    "how.workshops.1": "Vi erbjuder kreativa workshops som inspirerar till skapande och gemenskap. Bland våra teman finns streetart och graffiti, där deltagarna får prova på spraykonst i utomhusmiljöer – perfekt för ungdomar och vuxna som vill arbeta aktivt.",
    "how.workshops.2": "Med återbruk och blandkonst visar vi hur konst kan skapas med enkla, återvunna material. Vi erbjuder också collage- och klistermärkes-workshops som är inkluderande för alla åldrar och särskilt anpassade för deltagare med funktionsvariationer. För musikintresserade finns DJ-kurser med både teori och praktik, samt foto- och filmworkshops som lär ut grunderna i filmning, redigering och mobilkamerateknik. Har ni egna idéer? Vi utvecklar dem gärna genom vårt breda kontaktnät inom kreativa områden.",

    "how.events.1": "Vi har lång erfarenhet av att genomföra kulturella evenemang – både på egen hand och i samarbete med andra. Våra arrangemang har sträckt sig från spelningar, musikframträdanden och konstutställningar till föreläsningar, afterworks, fester, barnkalas, möhippor och privata tillställningar. Varje event skräddarsys efter era behov och målgrupp – till exempel en afterwork med DJ:s, konstnärlig utsmyckning och festlig stämning, eller ett barnkalas med graffititema som lockar fram kreativitet och lek.",
    "how.events.2": "Vill ni ha minnen som varar? Vi erbjuder videodokumentation som fångar stämningen och höjdpunkterna från ert evenemang – perfekt för sociala medier eller framtida presentationer. Vi älskar att tänka stort, lekfullt och nyskapande, men utgår alltid från era visioner. Hör av er – tillsammans skapar vi unika och minnesvärda upplevelser.",

    "how.dj.1": "Behöver ni en eller flera DJs? Våra DJs har bred erfarenhet och anpassar alltid musiken efter publik, plats och tillfälle. Vi har spelat på nattklubbar, skoldiscon, ungdomsevent, företagsmässor, modevisningar, ravefester, temafester, restauranger, barer, teaterproduktioner, demonstrationer, afterski-aktiviteter och privata fester.",
    "how.dj.2": "Oavsett om det handlar om ett större evenemang eller en intim samling skapar vi rätt stämning och energi för just er. Musiken blir en naturlig del av helhetsupplevelsen, och varje tillställning får en personlig prägel. Kontakta oss gärna för frågor, idéer eller bokningar – vi hjälper er att hitta den perfekta lösningen.",

    "how.murals.1": "Har ni en vägg, byggnad eller asfaltsyta som behöver nytt liv? Vi erbjuder muralmålningar och markmålningar som förvandlar trista ytor till inspirerande och funktionella miljöer. Vi skapar bland annat interaktiva hinderbanor direkt på asfalt – perfekt för skolgårdar, lekplatser eller innergårdar – som uppmuntrar rörelse, lek och samspel.",
    "how.murals.2": "Vi erbjuder även motivmålningar som anpassas helt efter plats och behov – kanske en nedklottrad container, ett barnrum som behöver färg, eller en vägg som saknar karaktär? Med kreativ design förvandlar vi miljöer på ett hållbart och unikt sätt."
  },

  en: {
    // Header nav
    "nav.workshops": "WORKSHOPS",
    "nav.events":    "EVENTS",
    "nav.about":     "ABOUT",
    "nav.dj":        "DJ",
    "nav.murals":    "MURALS",
    "nav.contact":   "CONTACT",

    // Hero lead (unchanged)
    "hero.p1": "I am Carl, and together with a network of cultural workers, I offer creative services for both public and private settings. Through workshops, events, and artistic decoration we create experiences that connect people across ages and environments.",
    "hero.p2": "Our work spans interactive courses in art, music, photography, and film, as well as DJ performances, murals, and unique cultural events. Always with a focus on quality, creativity, and ensuring that everyone involved feels included.",
    "hero.p3": "We have experience working with many different groups — from children and young people to adults and participants with special needs — and we adapt each project to the people, place, and purpose. With a wide network in the cultural field, we are always open to new collaborations and ideas.",
    "hero.p4": "A hub that promotes creativity – open to all.",

    // HOW title parts
    "how.title.part1": "HOW",
    "how.title.part2": "WE",
    "how.title.part3": "WORK",

    // HOW menu labels
    "how.menu.workshops": "WORKSHOPS",
    "how.menu.events": "EVENTS",
    "how.menu.dj": "DJ",
    "how.menu.murals": "MURALS",

    // HOW descriptions (English) — UPDATED
    "how.workshops.1": "We offer creative workshops designed to inspire creativity and connection. Themes include street art and graffiti, where participants explore spray painting in outdoor settings—perfect for youth and adults who enjoy active expression.",
    "how.workshops.2": "With recycled and mixed media art, we show how creativity can flourish using simple, repurposed materials. We also host collage and sticker workshops that are inclusive for all ages and specially adapted for participants with different abilities. For music lovers, we offer DJ courses covering both theory and practice, as well as photo and film workshops teaching the basics of filming, editing, and mobile camera techniques. Got your own ideas? We’re happy to develop them through our wide creative network.",

    "how.events.1": "We have extensive experience organizing cultural events—both independently and in collaboration with others. Our work has included concerts, music performances, and art exhibitions, as well as lectures, afterworks, parties, children’s birthdays, bachelorette celebrations, and private gatherings. Every event is tailored to your needs and audience—for example, an afterwork featuring DJs, artistic decorations, and a festive atmosphere, or a children’s party with a graffiti theme that sparks creativity and play.",
    "how.events.2": "Looking for lasting memories? We offer professional video documentation that captures the mood and highlights of your event—ideal for social media or future presentations. We thrive on bold, playful, and creative ideas, but we always start from your vision. Get in touch—together we’ll create something unique and unforgettable.",

    "how.dj.1": "Looking for one or more DJs? Our DJs have broad experience and always adapt the music to the audience, venue, and occasion. We’ve performed at nightclubs, school discos, youth events, trade shows, fashion shows, raves, theme parties, restaurants, bars, theater productions, demonstrations, after-ski events, and private parties.",
    "how.dj.2": "Whether it’s a large event or an intimate gathering, we create the right atmosphere and energy for you. The music becomes an integral part of the experience, giving each occasion a personal touch. Feel free to contact us with questions, ideas, or bookings—we’ll gladly help you find the perfect solution.",

    "how.murals.1": "Do you have a wall, building, or asphalt surface in need of new life? We create murals and ground paintings that transform dull spaces into inspiring and functional environments. Our work includes interactive obstacle courses painted directly on asphalt—perfect for schoolyards, playgrounds, or courtyards—that encourage movement, play, and interaction.",
    "how.murals.2": "We also offer customized artworks tailored to each location—whether it’s a graffiti-covered container, a children’s room in need of color, or a wall lacking character. With creative design, we breathe new life into spaces in a way that is both sustainable and unique."
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

  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const img = entry.target;
        img.src = img.dataset.src;
        observer.unobserve(img);
      }
    });
  });

  function makeImg(name) {
    const img = new Image();
    img.decoding = "async";
    img.dataset.src = `assets/${name}.jpg`;
    img.loading = "lazy";
    img.src = ""; // empty initially
    observer.observe(img);
    img.onerror = () => {
      img.src = `assets/${name}.JPG`;
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