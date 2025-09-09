/**
 * Marquee + Roller interactions
 * - Marquee: seamless loop
 * - Roller: 3D wheel; centers ABOUT only when the roller comes into view
 */
document.addEventListener('DOMContentLoaded', () => {
  /* ===== Marquee: duplicate for seamless loop ===== */
  const marquee = document.querySelector('[data-marquee]');
  if (marquee) {
    const track = marquee.querySelector('[data-track]');
    if (track && track.children.length) {
      marquee.innerHTML = '';
      const clone = track.cloneNode(true);
      clone.setAttribute('aria-hidden', 'true');

      const wrapper = document.createElement('div');
      wrapper.className = 'marquee__track';
      wrapper.appendChild(track);
      wrapper.appendChild(clone);
      marquee.appendChild(wrapper);
    }
  }

  /* ===== Roller: 3D wheel (rotateX + translateZ) ===== */
  const viewport = document.querySelector('.roller__viewport');
  const listEl   = document.querySelector('.roller__list');
  const items    = Array.from(document.querySelectorAll('.roller__item'));

  if (viewport && listEl && items.length) {
    // Ensure first & last can reach the exact center of the viewport
    const setRollerSpacers = () => {
      const tallest = items.reduce((m, el) => {
        const r = el.getBoundingClientRect();
        return Math.max(m, r.height || el.offsetHeight || 0);
      }, 0);
      const vpH = viewport.clientHeight || 0;

      // Enough space so an item's CENTER can align with viewport CENTER
      const padByMath = Math.round((vpH - tallest) / 2);
      const minPad = Math.round(vpH * 0.5);
      const pad = Math.max(0, Math.max(padByMath, minPad));
      listEl.style.paddingTop = pad + 'px';
      listEl.style.paddingBottom = pad + 'px';
    };

    // Wheel feel (use your previous values; adjust as you like)
    const maxAngleDeg = 20;  // tilt at edges
    const frontZ = 70;       // forward at center
    const backZ  = -90;      // recede at edges
    const scaleMin = 0.92;   // smallest scale at far edges
    const scaleMax = 1.00;   // scale at center

    const update = () => {
      const rect = viewport.getBoundingClientRect();
      const midY = rect.top + rect.height / 2;

      let closest = null;
      let closestDist = Infinity;

      items.forEach(li => {
        const r = li.getBoundingClientRect();
        const itemMid = r.top + r.height / 2;

        const delta = itemMid - midY; // + below, – above
        const normAbs = Math.min(1, Math.abs(delta) / (rect.height * 0.45));
        const normSigned = Math.max(-1, Math.min(1, delta / (rect.height * 0.45)));

        const angle = -normSigned * maxAngleDeg;

        // depth curve: 1 at center → 0 at edges
        const depthEase = Math.cos(Math.abs(normSigned) * Math.PI / 2);
        const z = frontZ * depthEase + backZ * (1 - depthEase);

        const scale = scaleMin + (scaleMax - scaleMin) * depthEase;

        // fade toward near-white at edges
        const fade = Math.min(1, Math.pow(normAbs, 0.9)) * 0.9;
        const ch = Math.round(184 + (255 - 184) * fade); // #b8 → #fff
        const color = `rgb(${ch}, ${ch}, ${ch})`;

        const opacity = (1 - normAbs * 0.25);

        li.style.transform = `rotateX(${angle.toFixed(2)}deg) translateZ(${z.toFixed(1)}px) scale(${scale.toFixed(3)})`;
        li.style.color = color;
        li.style.opacity = opacity.toFixed(3);

        const d = Math.abs(delta);
        if (d < closestDist) { closestDist = d; closest = li; }
      });

      items.forEach(li => li.classList.remove('is-active'));
      if (closest) closest.classList.add('is-active');
    };

    // Listeners (attach now; we'll trigger first paint after ABOUT-centering)
    let raf = null;
    const onScroll = () => {
      if (raf) return;
      raf = requestAnimationFrame(() => { update(); raf = null; });
    };
    viewport.addEventListener('scroll', onScroll, { passive: true });

    const onResize = () => {
      if (raf) return;
      raf = requestAnimationFrame(() => { setRollerSpacers(); update(); raf = null; });
    };
    window.addEventListener('resize', onResize);

    // IntersectionObserver: only center ABOUT when roller comes into view
    let centeredOnce = false;
    setRollerSpacers(); // do an initial pass so IO measures correctly

    const io = new IntersectionObserver((entries) => {
      const entry = entries[0];
      if (!entry || !entry.isIntersecting || centeredOnce) return;

      // Recompute spacers now that it's visible (accurate sizes)
      setRollerSpacers();

      // Center ABOUT inside the roller viewport (does NOT scroll the page)
      const aboutItem = items.find(li => li.textContent.trim().toLowerCase() === 'about');
      if (aboutItem) {
        aboutItem.scrollIntoView({ block: 'center', behavior: 'auto' });
      }

      // First paint with ABOUT centered
      update();

      centeredOnce = true;
      io.disconnect();
    }, { root: null, threshold: 0.4 }); // ~40% of viewport visible

    io.observe(viewport);

    // (Optional) also center ABOUT if user jumps directly to #roller via anchor
    window.addEventListener('hashchange', () => {
      if (location.hash === '#roller' && !centeredOnce) {
        setRollerSpacers();
        const aboutItem = items.find(li => li.textContent.trim().toLowerCase() === 'about');
        if (aboutItem) aboutItem.scrollIntoView({ block: 'center', behavior: 'auto' });
        update();
        centeredOnce = true;
        io.disconnect();
      }
    });
  }

  /* ===== Smooth scroll for header links with sticky offset ===== */
  const getStickyTop = () => {
    const raw = getComputedStyle(document.documentElement)
      .getPropertyValue('--sticky-topbar')
      .trim();
    const n = parseFloat(raw);
    return isNaN(n) ? 60 : n;
  };

  document.addEventListener('click', e => {
    const link = e.target.closest('[data-scroll]');
    if (!link) return;

    const href = link.getAttribute('href');
    if (!href || !href.startsWith('#')) return;

    const target = document.querySelector(href);
    if (!target) return;

    e.preventDefault();
    const topOffset = getStickyTop() + 8;
    const y = window.scrollY + target.getBoundingClientRect().top - topOffset;
    window.scrollTo({ top: y, behavior: 'smooth' });
  });
});

/* ===== Hero visibility: hide a bit later (with buffer) ===== */
(function heroVisibilityController() {
  const hero = document.querySelector('.hero');
  const marquee = document.querySelector('.marquee');
  if (!hero || !marquee) return;

  const getStickyTop = () => {
    const raw = getComputedStyle(document.documentElement)
      .getPropertyValue('--sticky-topbar')
      .trim();
    const n = parseFloat(raw);
    return isNaN(n) ? 60 : n;
  };

  const extraDelayPx = 200; 

  let raf = null;
  const update = () => {
    const stickyTop = getStickyTop();
    const marqueeRect = marquee.getBoundingClientRect();
    const heroMid = hero.getBoundingClientRect().top + hero.offsetHeight / 2;

    const hideThreshold = heroMid - stickyTop - extraDelayPx;

    if (marqueeRect.top <= hideThreshold) {
      hero.classList.add('hero--hidden');
    } else {
      hero.classList.remove('hero--hidden');
    }
    raf = null;
  };

  const onScroll = () => { if (!raf) raf = requestAnimationFrame(update); };
  window.addEventListener('scroll', onScroll, { passive: true });
  window.addEventListener('resize', onScroll);
  update();
})();