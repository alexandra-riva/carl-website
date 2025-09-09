/**
 * Marquee + Roller interactions
 */
document.addEventListener('DOMContentLoaded', () => {
  /* ===== Marquee: duplicate for seamless loop ===== */
  const marquee = document.querySelector('[data-marquee]');
  if (marquee) {
    const track = marquee.querySelector('[data-track]');
    if (track && track.children.length) {
      // Clear existing children, then double the track cleanly
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

  /* ===== Roller menu: original (best) effect — scale + opacity ===== */
  const viewport = document.querySelector('.roller__viewport');
  const items = Array.from(document.querySelectorAll('.roller__item'));
  if (viewport && items.length) {
    const update = () => {
      const rect = viewport.getBoundingClientRect();
      const midY = rect.top + rect.height / 2;

      let closest = null;
      let closestDist = Infinity;

      items.forEach(li => {
        const r = li.getBoundingClientRect();
        const itemMid = r.top + r.height / 2;
        const d = Math.abs(itemMid - midY);
        const norm = Math.min(1, d / (rect.height * 0.45));

        const scale = 1 - norm * 0.18;
        const opacity = 1 - norm * 0.55;
        li.style.transform = `translateZ(0) scale(${scale.toFixed(3)})`;
        li.style.opacity = opacity.toFixed(3);

        if (d < closestDist) {
          closestDist = d;
          closest = li;
        }
      });

      items.forEach(li => li.classList.remove('is-active'));
      if (closest) closest.classList.add('is-active');
    };

    update();
    let raf = null;
    const onScroll = () => {
      if (raf) return;
      raf = requestAnimationFrame(() => {
        update();
        raf = null;
      });
    };
    viewport.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);

    items.forEach(li => {
      li.addEventListener('click', () => {
        li.scrollIntoView({ block: 'center', behavior: 'smooth' });
        // No 'id' variable here, so disabled the old logic to click tab
        // const targetId = li.getAttribute('data-id');
        // const tab = document.querySelector(`.tab[data-target="${targetId}"]`);
        // if (tab) tab.click();
      });
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

  let raf = null;
  const update = () => {
    const stickyTop = getStickyTop();
    const marqueeRect = marquee.getBoundingClientRect();

    // when the marquee's top edge reaches hero's midpoint, hide hero
    const heroMid = hero.getBoundingClientRect().top + hero.offsetHeight / 2;

    if (marqueeRect.top <= heroMid - stickyTop) {
      hero.classList.add('hero--hidden');
    } else {
      hero.classList.remove('hero--hidden');
    }

    raf = null;
  };

  const onScroll = () => {
    if (!raf) raf = requestAnimationFrame(update);
  };
  window.addEventListener('scroll', onScroll, { passive: true });
  window.addEventListener('resize', onScroll);
  update();
})();