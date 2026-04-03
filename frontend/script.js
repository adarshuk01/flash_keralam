// 🔥 API
const API_URL = "https://flash-keralam-nine.vercel.app/api/news/all?limit=50";

// 🔥 Global fallback image
const FALLBACK_IMAGE =
  "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRoTABdENqplpwl9s7yrEBYjikqA4u5GWyg_Q&s";

// ─────────────────────────────────────────────
// 💀 SKELETON STYLES  (injected once)
// ─────────────────────────────────────────────
(function injectSkeletonStyles() {
  if (document.getElementById("skeleton-styles")) return;
  const style = document.createElement("style");
  style.id = "skeleton-styles";
  style.textContent = `
    @keyframes shimmer {
      0%   { background-position: -600px 0; }
      100% { background-position:  600px 0; }
    }
    .skeleton {
      background: linear-gradient(
        90deg,
        #e8e8e8 25%,
        #f5f5f5 50%,
        #e8e8e8 75%
      );
      background-size: 600px 100%;
      animation: shimmer 1.4s infinite linear;
      border-radius: 4px;
    }
    /* dark-mode aware */
    @media (prefers-color-scheme: dark) {
      .skeleton {
        background: linear-gradient(
          90deg,
          #2a2a2a 25%,
          #3a3a3a 50%,
          #2a2a2a 75%
        );
        background-size: 600px 100%;
      }
    }
    .skel-img  { border-radius: 4px; }
    .skel-line { border-radius: 3px; }
  `;
  document.head.appendChild(style);
})();

// ─────────────────────────────────────────────
// 💀 SKELETON BUILDERS
// ─────────────────────────────────────────────

/** Top teasers strip — horizontal cards */
function skeletonTopTeasers(count = 8) {
  return Array.from({ length: count }).map(() => `
    <div class="top-teaser-item min-w-[320px] flex gap-3 items-center p-3 border-r-2 border-gray-200">
      <div class="skeleton skel-img w-16 h-12 flex-shrink-0"></div>
      <div class="min-w-0 flex-1 space-y-1.5">
        <div class="skeleton skel-line h-2.5 w-16"></div>
        <div class="skeleton skel-line h-3 w-full"></div>
        <div class="skeleton skel-line h-3 w-3/4"></div>
      </div>
    </div>
  `).join("");
}

/** Big hero card */
function skeletonBigCard() {
  return `
    <div class="skeleton w-full h-full rounded-sm"></div>
    <div class="absolute bottom-0 left-0 p-4 w-full space-y-2">
      <div class="skeleton skel-line h-2.5 w-20 opacity-60"></div>
      <div class="skeleton skel-line h-4 w-full opacity-60"></div>
      <div class="skeleton skel-line h-4 w-4/5 opacity-60"></div>
      <div class="skeleton skel-line h-3 w-24 opacity-40"></div>
    </div>
  `;
}

/** Side list items */
function skeletonSideNews(count = 4) {
  return Array.from({ length: count }).map(() => `
    <div class="flex gap-3 items-start">
      <div class="flex-1 space-y-1.5">
        <div class="skeleton skel-line h-2.5 w-16"></div>
        <div class="skeleton skel-line h-3.5 w-full"></div>
        <div class="skeleton skel-line h-3.5 w-5/6"></div>
        <div class="skeleton skel-line h-2.5 w-20 mt-1"></div>
      </div>
      <div class="skeleton skel-img w-20 h-16 flex-shrink-0"></div>
    </div>
    <hr class="hr-thin"/>
  `).join("");
}

/** Bottom 3 card-grid */
function skeletonBottomNews(count = 3) {
  return Array.from({ length: count }).map(() => `
    <div class="rounded-sm overflow-hidden">
      <div class="skeleton skel-img w-full" style="height:160px;"></div>
      <div class="pt-3 space-y-2">
        <div class="skeleton skel-line h-3.5 w-full"></div>
        <div class="skeleton skel-line h-3.5 w-4/5"></div>
        <div class="skeleton skel-line h-2.5 w-28 mt-1"></div>
      </div>
    </div>
  `).join("");
}

/** Local news grid */
function skeletonLocalNews(count = 6) {
  return Array.from({ length: count }).map(() => `
    <div class="rounded-sm overflow-hidden">
      <div class="skeleton skel-img w-full rounded-sm" style="height:130px;"></div>
      <div class="pt-2.5 space-y-1.5">
        <div class="skeleton skel-line h-2.5 w-20"></div>
        <div class="skeleton skel-line h-3.5 w-full"></div>
        <div class="skeleton skel-line h-3.5 w-3/4"></div>
      </div>
    </div>
  `).join("");
}

// ─────────────────────────────────────────────
// 🧠 Smart image resolver
// ─────────────────────────────────────────────
function getImage(item) {
  if (!item || !item.image) return FALLBACK_IMAGE;
  const url = item.image;
  if (
    url.includes(".mp4") ||
    url.includes(".webm") ||
    url.includes("video") ||
    url.includes("youtube")
  ) {
    return FALLBACK_IMAGE;
  }
  return url;
}

// ✂️ Short title
function shortTitle(text, len = 80) {
  if (!text) return "";
  return text.length > len ? text.slice(0, len) + "..." : text;
}

// ─────────────────────────────────────────────
// 📡 Load News  (main feed)
// ─────────────────────────────────────────────
async function loadNews() {
  // Show skeletons immediately
  const topEl    = document.getElementById("top-teasers");
  const bigEl    = document.getElementById("big-card");
  const sideEl   = document.getElementById("side-news");
  const bottomEl = document.getElementById("bottom-news");

  if (topEl)    topEl.innerHTML    = skeletonTopTeasers(8);
  if (bigEl)    bigEl.innerHTML    = skeletonBigCard();
  if (sideEl)   sideEl.innerHTML   = skeletonSideNews(4);
  if (bottomEl) bottomEl.innerHTML = skeletonBottomNews(3);

  try {
    const res  = await fetch(API_URL);
    const data = await res.json();
    const news = data?.data || [];

    if (!news.length) return;

    renderTopTeasers(news.slice(10, 22));
    renderBig(news[1]);
    renderSide(news.slice(2, 6));
    renderBottom(news.slice(4, 7));
  } catch (err) {
    console.error("Error loading news:", err);

    // Show error state in each section
    [topEl, bigEl, sideEl, bottomEl].forEach(el => {
      if (el) el.innerHTML = `
        <div class="flex items-center justify-center w-full h-full p-4">
          <p class="text-xs text-muted opacity-60">Failed to load. Please refresh.</p>
        </div>
      `;
    });
  }
}

// ─────────────────────────────────────────────
// 🟦 BIG CARD
// ─────────────────────────────────────────────
function renderBig(item) {
  const el = document.getElementById("big-card");
  if (!item || !el) return;

  el.innerHTML = `
    <img 
      src="${getImage(item)}" 
      onerror="this.src='${FALLBACK_IMAGE}'"
      class="w-full h-full object-cover"
    />
    <div class="hero-overlay absolute inset-0"></div>
    <div class="absolute top-3 left-3">
      <span class="cat-tag sec-badge px-2 py-0.5 rounded-sm">
        ${item.normalizedCategory || "news"}
      </span>
    </div>
    <div class="absolute bottom-0 left-0 p-4">
      <h3 class="font-display text-white font-bold text-base leading-snug">
        ${shortTitle(item.title, 100)}
      </h3>
      <p class="text-xs text-white opacity-70 mt-1">
        ${item.source || ""}
      </p>
    </div>
  `;

  el.onclick = () => window.open(item.link, "_blank");
}

// ─────────────────────────────────────────────
// 🟩 SIDE NEWS
// ─────────────────────────────────────────────
function renderSide(items) {
  const el = document.getElementById("side-news");
  if (!el) return;

  el.innerHTML = items.map(item => `
    <div class="flex gap-3 items-start card-hover cursor-pointer">
      <div class="flex-1">
        <div class="sec-badge text-accent mb-1">
          ${item.normalizedCategory || "news"}
        </div>
        <h3 class="text-sm font-semibold">
          ${shortTitle(item.title, 70)}
        </h3>
        <p class="text-xs text-muted mt-1">
          ${item.source || ""}
        </p>
      </div>
      <img 
        src="${getImage(item)}" 
        onerror="this.src='${FALLBACK_IMAGE}'"
        class="w-20 h-16 object-cover rounded-sm"
      />
    </div>
    <hr class="hr-thin"/>
  `).join("");

  [...el.children].forEach((child, i) => {
    child.onclick = () => window.open(items[i]?.link, "_blank");
  });
}

// ─────────────────────────────────────────────
// 🟨 BOTTOM 3
// ─────────────────────────────────────────────
function renderBottom(items) {
  const el = document.getElementById("bottom-news");
  if (!el) return;

  el.innerHTML = items.map(item => `
    <div class="cursor-pointer rounded-sm overflow-hidden">
      <div class="overflow-hidden" style="height:160px;">
        <img 
          src="${getImage(item)}" 
          onerror="this.src='${FALLBACK_IMAGE}'"
          class="w-full h-full object-cover"
        />
      </div>
      <div class="pt-3">
        <h3 class="text-sm font-semibold">
          ${shortTitle(item.title, 80)}
        </h3>
        <p class="text-xs text-muted mt-1.5">
          ${item.normalizedCategory || "news"} — ${item.source || ""}
        </p>
      </div>
    </div>
  `).join("");

  [...el.children].forEach((child, i) => {
    child.onclick = () => window.open(items[i]?.link, "_blank");
  });
}

// ─────────────────────────────────────────────
// 🟥 HERO
// ─────────────────────────────────────────────
function renderHero(item) {
  const el = document.getElementById("hero-news");
  if (!item || !el) return;

  el.innerHTML = `
    <img 
      src="${getImage(item)}" 
      onerror="this.src='${FALLBACK_IMAGE}'"
      class="w-full h-full object-cover"
    />
    <div class="hero-overlay absolute inset-0"></div>
    <div class="absolute top-4 left-4">
      <span class="pill-live text-xs font-sans font-semibold px-2.5 py-1 rounded-full flex items-center gap-1.5">
        <span class="w-1.5 h-1.5 bg-white rounded-full animate-pulse"></span> Live
      </span>
    </div>
    <div class="absolute bottom-0 left-0 right-0 p-6">
      <div class="flex gap-2 mb-2">
        <span class="cat-tag sec-badge px-2 py-0.5 rounded-sm">
          ${item.normalizedCategory || "news"}
        </span>
        <span class="cat-tag-outline sec-badge px-2 py-0.5 rounded-sm">
          ${item.source || ""}
        </span>
      </div>
      <h1 class="font-display text-white text-lg md:text-3xl font-bold leading-tight max-w-2xl noto-sans-malayalam">
        ${shortTitle(item.title, 120)}
      </h1>
    </div>
    <div class="absolute bottom-4 right-4">
      <span class="font-sans text-xs text-white opacity-80 flex items-center gap-1">
        Read Article →
      </span>
    </div>
  `;

  el.onclick = () => window.open(item.link, "_blank");
}

// ─────────────────────────────────────────────
// 🟪 TOP TEASERS STRIP
// ─────────────────────────────────────────────
function renderTopTeasers(items) {
  const el = document.getElementById("top-teasers");
  if (!items || !items.length || !el) return;

  el.innerHTML = items.map(item => `
    <div class="top-teaser-item min-w-[320px] flex gap-3 items-center p-3 border-r-2 border-gray-300 cursor-pointer">
      <img 
        src="${getImage(item)}" 
        onerror="this.src='${FALLBACK_IMAGE}'"
        class="w-16 h-12 object-cover flex-shrink-0 rounded-sm"
        loading="lazy"
      />
      <div class="min-w-0">
        <div class="sec-badge text-accent mb-0.5">
          ${item.normalizedCategory || "news"}
        </div>
        <p class="text-xs text-secondary text-wrap leading-snug line-clamp-3 noto-sans-malayalam">
          ${shortTitle(item.title, 60)}
        </p>
      </div>
    </div>
  `).join("");

  [...el.children].forEach((child, i) => {
    child.onclick = () => window.open(items[i]?.link, "_blank");
  });
}

// ─────────────────────────────────────────────
// 📡 Load Local News
// ─────────────────────────────────────────────
async function loadLocalNews() {
  const el = document.getElementById("local-news");

  // Show skeleton immediately
  if (el) el.innerHTML = skeletonLocalNews(6);

  try {
    const res  = await fetch(
      "https://flash-keralam-nine.vercel.app/api/news/all?category=kerala"
    );
    const data = await res.json();
    renderLocalNews(data.data);
  } catch (err) {
    console.error("Local news error:", err);
    if (el) el.innerHTML = `
      <div class="col-span-full flex items-center justify-center p-6">
        <p class="text-xs text-muted opacity-60">Failed to load local news. Please refresh.</p>
      </div>
    `;
  }
}

// ─────────────────────────────────────────────
// 🏠 RENDER LOCAL NEWS
// ─────────────────────────────────────────────
function renderLocalNews(items) {
  const el = document.getElementById("local-news");
  if (!el) return;

  if (!items || !items.length) {
    el.innerHTML = "<p>No local news available</p>";
    return;
  }

  el.innerHTML = items.map(item => `
    <div class="card-hover cursor-pointer transition-transform">
      <div class="overflow-hidden rounded-sm img-zoom" style="height:130px;">
        <img 
          src="${getImage(item)}"
          onerror="this.src='${FALLBACK_IMAGE}'"
          class="w-full h-full object-cover"
          loading="lazy"
        />
      </div>
      <div class="pt-2.5">
        <div class="font-sans text-xs text-muted mb-1">
          ${item.source || "News"}
        </div>
        <h3 class="font-serif text-sm font-semibold text-primary leading-snug noto-sans-malayalam">
          ${shortTitle(item.title, 70)}
        </h3>
      </div>
    </div>
  `).join("");

  [...el.children].forEach((child, i) => {
    child.onclick = () => window.open(items[i]?.link, "_blank");
  });
}

// ─────────────────────────────────────────────
// 🚀 Run
// ─────────────────────────────────────────────
loadNews();
loadLocalNews();