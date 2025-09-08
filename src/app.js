// ===== Simple gallery data (adjust filenames to match your /assets folder) =====
const galleries = {
  kurser: [
    "./assets/project1_1.jpg",
    "./assets/project1_2.jpg",
    "./assets/project1_3.jpg",
    "./assets/project1_4.jpg",
  ],
  events: [
    "./assets/events_1.jpg",
    "./assets/events_2.jpg",
    "./assets/events_3.jpg",
  ],
  dj: [
    "./assets/dj_1.jpg",
    "./assets/dj_2.jpg",
  ],
  mural: [
    "./assets/mural_1.jpg",
    "./assets/mural_2.jpg",
    "./assets/mural_3.jpg",
  ],
};

const track = document.getElementById("track");
const tabs = Array.from(document.querySelectorAll(".nav-link[role='tab']"));

function loadGallery(key) {
  const list = galleries[key] || [];
  track.innerHTML = "";
  for (const src of list) {
    const img = document.createElement("img");
    img.src = src;
    img.alt = ""; // decorative; describe elsewhere if needed
    track.appendChild(img);
  }
  // Snap to start for fresh gallery
  const scroller = track.parentElement;
  scroller.scrollTo({ left: 0, behavior: "instant" in scroller ? "instant" : "auto" });
}

function setActive(tab) {
  tabs.forEach(t => t.setAttribute("aria-selected", "false"));
  tab.setAttribute("aria-selected", "true");
}

function handleTabClick(e) {
  const tab = e.currentTarget;
  const key = tab.dataset.gallery;
  if (!key) return;
  setActive(tab);
  loadGallery(key);
}

function handleTabKeydown(e) {
  const idx = tabs.indexOf(e.currentTarget);
  if (idx === -1) return;

  if (e.key === "ArrowRight" || e.key === "ArrowDown") {
    e.preventDefault();
    const next = tabs[(idx + 1) % tabs.length];
    next.focus();
  } else if (e.key === "ArrowLeft" || e.key === "ArrowUp") {
    e.preventDefault();
    const prev = tabs[(idx - 1 + tabs.length) % tabs.length];
    prev.focus();
  } else if (e.key === "Home") {
    e.preventDefault();
    tabs[0].focus();
  } else if (e.key === "End") {
    e.preventDefault();
    tabs[tabs.length - 1].focus();
  } else if (e.key === "Enter" || e.key === " ") {
    e.preventDefault();
    e.currentTarget.click();
  }
}

// Wire up events
tabs.forEach(tab => {
  tab.addEventListener("click", handleTabClick);
  tab.addEventListener("keydown", handleTabKeydown);
});

// Initial state (first tab)
if (tabs.length) {
  setActive(tabs[0]);
  loadGallery(tabs[0].dataset.gallery);
}