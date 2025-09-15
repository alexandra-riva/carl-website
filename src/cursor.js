(() => {
  const cursor = document.getElementById('cursor');
  if (!cursor) return;

  // Skip on touch-only devices
  const supportsHover = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
  if (!supportsHover) return;

  let x = window.innerWidth / 2;
  let y = window.innerHeight / 2;
  let tx = x, ty = y;
  const ease = 0.18; // smooth follow

  function raf() {
    x += (tx - x) * ease;
    y += (ty - y) * ease;
    cursor.style.setProperty('--x', x + 'px');
    cursor.style.setProperty('--y', y + 'px');
    // translate directly to the smoothed position
    cursor.style.transform = `translate3d(${x}px, ${y}px, 0)`;
    requestAnimationFrame(raf);
  }
  raf();

  // Track position
  window.addEventListener('mousemove', (e) => {
    tx = e.clientX; ty = e.clientY;
    cursor.classList.remove('is-hidden');
  }, { passive: true });

  // Hide when leaving the window
  document.addEventListener('mouseleave', () => cursor.classList.add('is-hidden'));
  document.addEventListener('mouseenter', () => cursor.classList.remove('is-hidden'));

  // States: down/up
  document.addEventListener('mousedown', () => cursor.classList.add('is-down'));
  document.addEventListener('mouseup',   () => cursor.classList.remove('is-down'));

  // Enlarge over interactive elements
  const isInteractive = (el) =>
    !!el && (el.closest('a, button, input, textarea, select, label, [role="button"], [data-cursor="hover"]'));

  let hoverOn = false;
  document.addEventListener('mouseover', (e) => {
    if (isInteractive(e.target)) {
      hoverOn = true;
      cursor.classList.add('is-hover');
    }
  });
  document.addEventListener('mouseout', (e) => {
    if (hoverOn && !isInteractive(e.relatedTarget)) {
      hoverOn = false;
      cursor.classList.remove('is-hover');
    }
  });
})();