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

// ------------------ 2) HOW WE WORK logic ------------------
function initHow() {
  const root = document.querySelector("#how-we-work");
  if (!root) return null;

  const descEl  = root.querySelector("#how-desc");
  const trackEl = root.querySelector("#how-track");
  const menu    = root.querySelector(".how__menu");
  if (!descEl || !trackEl || !menu) return null;

  // Swedish copy
  const DESCRIPTIONS = {
    workshops: [
  "Vi erbjuder kreativa workshops inom konst, DJ-ing, foto och film – och kan även samarbeta med andra aktörer för olika teman. Innehållet anpassas alltid efter målgruppen och dess behov.",
  "Tidigare workshops har bland annat handlat om streetart/graffiti, återbrukskonst, collage och klistermärken, DJ-introduktioner samt foto- och filmproduktion med mobilkamera. Våra upplägg fungerar för alla åldrar och grupper, även funktionsvarierade, och kan hållas både inomhus och utomhus."
],
    events: [
      "Vi planerar och genomför en bredd av kulturevenemang – från spelningar, fester och utställningar till föreläsningar, afterworks och privata firanden.",
      "Vill ni ha en AW med DJ och street art, ett barnkalas eller en möhippa? Vi idéutvecklar gärna tillsammans och kan även filma/dokumentera ert event."
    ],
    dj: [
      "Behöver ni en eller flera DJs? Vi spelar det ni vill – där ni vill!",
      "Erfarenhet från klubbar, skoldiscon, mässor, catwalks, rave, restauranger, demonstrationer, teater, afterski och mycket mer."
    ],
    murals: [
      "Vi förvandlar tråkiga ytor till levande konstverk.",
      "Det kan vara muralmålningar, interaktiva markmålningar (t.ex. hinderbanor på asfalt) eller att ge nytt liv åt containrar, skolmiljöer eller barnrum – alltid i dialog med era idéer."
    ]
  };

  // Filenames: we try lowercase ".jpg" first; on error we fall back to uppercase ".JPG".
  const IMG_MAP = {
    workshops: rangeNames("w", 1, 14),
    events:    rangeNames("e", 1, 7),
    dj:        rangeNames("dj", 1, 8),
    murals:    rangeNames("m", 1, 10),
  };

  function rangeNames(prefix, start, end) {
    const arr = [];
    for (let i = start; i <= end; i++) {
      arr.push(`${prefix}${i}`);
    }
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
      if (img.src.endsWith(".jpg")) {
        img.src = upper; // fallback to .JPG if .jpg missing
      } else {
        img.style.display = "none";
      }
    };
    return img;
  }

  function setDescription(cat) {
    const paras = DESCRIPTIONS[cat] || [];
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
    const gapPx = getComputedStyle(trackEl).gap
      ? parseFloat(getComputedStyle(trackEl).gap)
      : 12;

    function step(t) {
      if (!lastT) lastT = t;
      const dt = (t - lastT) / 1000;
      lastT = t;

      // Move left
      offset -= speed * dt;
      trackEl.style.transform = `translateX(${offset}px)`;

      // Recycle first item when fully out of view (plus gap)
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
    // Add each image once (no duplicates); uppercase fallback handled in onerror.
    const frag = document.createDocumentFragment();
    namesArr.forEach((n) => frag.appendChild(makeImg(n)));
    trackEl.appendChild(frag);
  }

  function ensureEnoughWidth() {
    // Duplicate the current children until total width >= 2x viewport
    // (for smooth cycling without empty gaps)
    const minTotal = window.innerWidth * 2;
    const measure = () =>
      Array.from(trackEl.children).reduce((sum, el) => sum + el.getBoundingClientRect().width, 0) +
      Math.max(0, trackEl.children.length - 1) * (parseFloat(getComputedStyle(trackEl).gap) || 12);

    let total = measure();
    if (total === 0) return;

    // Duplicate batches of current children (not just one image)
    while (total < minTotal) {
      const batch = Array.from(trackEl.children).map((n) => n.cloneNode(true));
      const frag = document.createDocumentFragment();
      batch.forEach((n) => frag.appendChild(n));
      trackEl.appendChild(frag);
      total = measure();
    }
  }

  function setMarquee(cat) {
    // reset
    clearTicker();
    trackEl.innerHTML = "";

    const namesArr = IMG_MAP[cat] || [];

    // 1) Populate once (no visible duplicates)
    populateOnce(namesArr);

    // 2) After images have layout, ensure width then start
    // Use a micro-wait + imagesComplete
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
  return { setCategory, root };
}

// ------------------ 3) Wire header links to HOW ------------------
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

// ------------------ 4) Boot: includes → init how → wire header ------------------
document.addEventListener("DOMContentLoaded", async () => {
  await includePartials();
  const howAPI = initHow();
  wireHeaderToHow(howAPI);
});