/**
 * Marquee + Roller interactions
 */
document.addEventListener('DOMContentLoaded', () => {
  /* ===== Marquee: duplicate for seamless loop ===== */
  const marquee = document.querySelector('[data-marquee]');
  if (marquee) {
    const track = marquee.querySelector('[data-track]');
    if (track && track.children.length) {
      const clone = track.cloneNode(true);
      clone.setAttribute('aria-hidden', 'true');
      marquee.appendChild(clone);

      const wrapper = document.createElement('div');
      wrapper.className = 'marquee__track';
      wrapper.append(...Array.from(marquee.children));
      marquee.replaceChildren(wrapper);
    }
  }

  /* ===== Tabs (keep Workshops visible for now) ===== */
  const tabs = document.querySelectorAll('.tab');
  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      tabs.forEach(t => t.classList.remove('is-active'));
      tab.classList.add('is-active');

      const id = tab.getAttribute('data-target');
      document.querySelectorAll('.marquee, .marquee--empty').forEach(sec => {
        sec.hidden = sec.id !== id;
      });

      // restart animation when switching back
      const active = document.getElementById(id);
      const t = active && active.querySelector('.marquee__track');
      if (t) {
        t.style.animation = 'none';
        void t.offsetHeight;
        t.style.animation = '';
      }
    });
  });

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
        const d = Math.abs(itemMid - midY);                 // distance to center
        const norm = Math.min(1, d / (rect.height * 0.45)); // 0..1

        const scale = 1 - norm * 0.18;                      // 1 → 0.82
        const opacity = 1 - norm * 0.55;                    // 1 → 0.45
        li.style.transform = `translateZ(0) scale(${scale.toFixed(3)})`;
        li.style.opacity = opacity.toFixed(3);

        if (d < closestDist) { closestDist = d; closest = li; }
      });

      items.forEach(li => li.classList.remove('is-active'));
      if (closest) closest.classList.add('is-active');
    };

    update();
    let raf = null;
    const onScroll = () => {
      if (raf) return;
      raf = requestAnimationFrame(() => { update(); raf = null; });
    };
    viewport.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);

    items.forEach(li => {
      li.addEventListener('click', () => {
        li.scrollIntoView({ block: 'center', behavior: 'smooth' });
        const targetId = li.getAttribute('data-id');
        const tab = document.querySelector(`.tab[data-target="${targetId}"]`);
        if (tab) tab.click();
      });
    });
  }

  /* ===== Smooth scroll for header links with sticky offset ===== */
  const getStickyTop = () => {
    const raw = getComputedStyle(document.documentElement)
      .getPropertyValue('--sticky-topbar').trim();
    const n = parseFloat(raw);
    return isNaN(n) ? 60 : n;
  };

  document.addEventListener('click', (e) => {
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